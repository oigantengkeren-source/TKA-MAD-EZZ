"""
=============================================================
  TKA Made Easy — Reborn TKA Tryout Backend & Platform
  Framework : FastAPI
  Database  : SQLite (Local Default) + Supabase (Optional)
  Data Bank : JSON Files in data/soal and data/materi
=============================================================
"""

import os
import sys
import re
import json
import sqlite3
import urllib.request
import urllib.error
from typing import Optional, List, Dict, Any
from pathlib import Path
from contextlib import contextmanager

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
SOAL_DIR = DATA_DIR / "soal"
MATERI_DIR = DATA_DIR / "materi"
DB_FILE = BASE_DIR / "tka.db"

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

def get_pg_conn():
    """Buka koneksi PostgreSQL (Supabase) dengan timeout cepat dan SSL aman."""
    if not DATABASE_URL:
        return None
    try:
        import pg8000
        import ssl
        from urllib.parse import urlparse
        url = urlparse(DATABASE_URL)
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        conn = pg8000.connect(
            host=url.hostname,
            port=url.port or 5432,
            database=url.path.lstrip("/"),
            user=url.username,
            password=url.password,
            ssl_context=ssl_ctx,
            timeout=5
        )
        return conn
    except Exception as e:
        print(f"[DB] PostgreSQL connect notice: {e}")
        return None

@contextmanager
def get_db():
    """Context manager untuk koneksi SQLite lokal."""
    conn = sqlite3.connect(str(DB_FILE))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Inisialisasi tabel User_Score secara aman di PostgreSQL atau SQLite."""
    pg_conn = get_pg_conn()
    if pg_conn:
        try:
            cur = pg_conn.cursor()
            cur.execute("""
                CREATE TABLE IF NOT EXISTS "User_Score" (
                    id BIGSERIAL PRIMARY KEY,
                    nama_user TEXT NOT NULL,
                    mata_pel TEXT NOT NULL,
                    skor DOUBLE PRECISION NOT NULL,
                    tanggal TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            """)
            pg_conn.commit()
            cur.close()
            pg_conn.close()
            print("[DB] PostgreSQL (Supabase) connected and ready ✅")
        except Exception as e:
            print(f"[DB] PostgreSQL init note: {e}")

    try:
        with get_db() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS User_Score (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nama_user TEXT NOT NULL,
                    mata_pel TEXT NOT NULL,
                    skor REAL NOT NULL,
                    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
        print("[DB] SQLite database initialized successfully at tka.db ✅")
    except Exception as e:
        print(f"[DB] Warning initializing SQLite: {e}")


# ---------------------------------------------------------------------------
# Data Bank Loader (JSON)
# ---------------------------------------------------------------------------

def load_bank_soal(mata_pelajaran: str) -> List[Dict[str, Any]]:
    """Muat bank soal dari file JSON di data/soal/{mata_pelajaran}.json"""
    file_path = SOAL_DIR / f"{mata_pelajaran}.json"
    if not file_path.exists():
        # Coba format case-insensitive
        for f in SOAL_DIR.glob("*.json"):
            if f.stem.lower() == mata_pelajaran.lower():
                file_path = f
                break

    if file_path.exists():
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Data] Error reading {file_path}: {e}")
    return []

def load_materi(mata_pelajaran: str) -> List[Dict[str, Any]]:
    """Muat ringkasan materi dari data/materi/{mata_pelajaran}.json"""
    file_path = MATERI_DIR / f"{mata_pelajaran}.json"
    if not file_path.exists():
        for f in MATERI_DIR.glob("*.json"):
            if f.stem.lower() == mata_pelajaran.lower():
                file_path = f
                break

    if file_path.exists():
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Data] Error reading {file_path}: {e}")
    return []

# ---------------------------------------------------------------------------
# AI Helpers (Gemini & Groq with Offline Fallback)
# ---------------------------------------------------------------------------

def strip_html(html_str: str) -> str:
    """Bersihkan tag HTML untuk teks pencarian materi."""
    clean = re.sub(r'<[^>]+>', ' ', html_str)
    return re.sub(r'\s+', ' ', clean).strip()

def cari_konteks_materi(query: str) -> str:
    """Cari materi dan soal relevan dari file JSON data/ berdasarkan kata kunci query."""
    query_lower = query.lower()
    stop_words = {"apa", "itu", "bagaimana", "cara", "yang", "dan", "di", "ke", "dari", "ini", "itu", "adalah", "kak", "halo", "tolong", "jelaskan", "soal", "materi", "dong", "saja", "aja"}
    tokens = [w for w in re.findall(r'\b[a-zA-Z0-9]{3,}\b', query_lower) if w not in stop_words]
    if not tokens:
        return ""

    candidates = []

    # 1. Cari di data/materi/
    if MATERI_DIR.exists():
        for f in MATERI_DIR.glob("*.json"):
            mapel = f.stem
            try:
                with open(f, "r", encoding="utf-8") as fp:
                    chapters = json.load(fp)
                for ch in chapters:
                    topic = ch.get("topic", "")
                    content = strip_html(ch.get("html", ""))
                    text_blob = f"{mapel} {topic} {content}".lower()
                    score = sum(4 if re.search(r'\b' + re.escape(t) + r'\b', text_blob) else 1 for t in tokens if t in text_blob)
                    if score > 0:
                        candidates.append((score, f"[Materi {mapel} — {topic}]: {content[:300]}"))
            except Exception:
                pass

    # 2. Cari di data/soal/
    if SOAL_DIR.exists():
        for f in SOAL_DIR.glob("*.json"):
            mapel = f.stem
            try:
                with open(f, "r", encoding="utf-8") as fp:
                    soal_list = json.load(fp)
                for s in soal_list:
                    soal_txt = s.get("content", "")
                    pembahasan = s.get("pembahasan", "")
                    text_blob = f"{mapel} {soal_txt} {pembahasan}".lower()
                    score = sum(4 if re.search(r'\b' + re.escape(t) + r'\b', text_blob) else 1 for t in tokens if t in text_blob)
                    if score > 0:
                        candidates.append((score, f"[Bank Soal {mapel}]: {soal_txt[:150]} (Kunci: {s.get('kunci_jawaban')}, Pembahasan: {pembahasan[:120]})"))
            except Exception:
                pass

    if not candidates:
        return ""

    candidates.sort(key=lambda x: x[0], reverse=True)
    return "\n".join([c[1] for c in candidates[:2]])

def call_ai(system_prompt: str, user_prompt: str, max_tokens: int = 800) -> str:
    """Kirim prompt ke Gemini API atau Groq API, dengan pesan ramah jika belum diset."""
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    groq_key = os.getenv("GROQ_API_KEY", "").strip()

    # 1. Coba Gemini API jika ada key
    if gemini_key:
        models_to_try = [
            "gemini-flash-lite-latest",
            "gemini-3.1-flash-lite",
            "gemini-3.5-flash-lite",
            "gemini-3-flash-preview",
            "gemini-flash-latest"
        ]
        last_err = ""

        for model in models_to_try:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_key}"
                payload = json.dumps({
                    "contents": [
                        {
                            "parts": [
                                {"text": f"System Instruction: {system_prompt}\n\nUser: {user_prompt}"}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "maxOutputTokens": max_tokens,
                        "temperature": 0.3
                    }
                }).encode("utf-8")
                req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
                with urllib.request.urlopen(req, timeout=20) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    if text:
                        return text.strip()
            except urllib.error.HTTPError as e:
                err_body = e.read().decode("utf-8", errors="ignore")
                last_err = f"Gemini HTTP {e.code}: {err_body[:180]}"
                print(f"[AI] Gemini {model} error: {last_err}")
            except Exception as e:
                last_err = str(e)
                print(f"[AI] Gemini {model} exception: {e}")

        # Jika Gemini gagal tapi ada groq_key, kita coba Groq sebagai cadangan
        if not groq_key:
            return f"⚠️ Respon AI: Gagal menghubungi Gemini ({last_err}). Cek apakah GEMINI_API_KEY dari aistudio.google.com valid."

    # 2. Coba Groq API jika ada key
    if groq_key:
        try:
            payload = json.dumps({
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": min(max_tokens, 400),
                "temperature": 0.4
            }).encode("utf-8")
            req = urllib.request.Request(
                "https://api.groq.com/openai/v1/chat/completions",
                data=payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {groq_key}"
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"[AI] Groq call failed: {e}")
            return f"⚠️ Respon Groq: Gagal memproses permintaan ({e})."

    # 3. Fallback jika belum ada key
    return (
        f"💡 Halo Pejuang TKA!\n\n"
        f"Pertanyaanmu: '{user_prompt[:80]}...'\n\n"
        f"AI Assistant siap aktif! Silakan tambahkan GEMINI_API_KEY di file .env atau Vercel Environment Variables. "
        f"Kunci API gratis bisa didapatkan di https://aistudio.google.com/app/apikey"
    )

from contextlib import contextmanager, asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="TKA Made Easy — TKA Tryout API",
    description="Backend API & Platform untuk tryout, materi, dan skor TKA",
    version="3.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------

class SkorRequest(BaseModel):
    nama_user: str = Field(..., min_length=1, max_length=100)
    mata_pel: str = Field(...)
    skor: float = Field(..., ge=0, le=100)

class SkorResponse(BaseModel):
    id: int
    nama_user: str
    mata_pel: str
    skor: float
    tanggal: str

class PostResponse(BaseModel):
    pesan: str
    data: SkorResponse

class MateriRequest(BaseModel):
    mata_pelajaran: str
    gaya_belajar: str

class VariasiSoalRequest(BaseModel):
    soal_asli: str

class ChatRequest(BaseModel):
    pesan: str

# ---------------------------------------------------------------------------
# API Routes — Scores (SQLite)
# ---------------------------------------------------------------------------

@app.post("/scores", response_model=PostResponse, status_code=201, tags=["Scores"])
def tambah_skor(payload: SkorRequest):
    """Simpan riwayat skor tryout baru."""
    # 1. Coba simpan ke PostgreSQL (Supabase) jika terhubung
    pg_conn = get_pg_conn()
    if pg_conn:
        try:
            cur = pg_conn.cursor()
            cur.execute(
                'INSERT INTO "User_Score" (nama_user, mata_pel, skor) VALUES (%s, %s, %s) '
                'RETURNING id, nama_user, mata_pel, skor, tanggal::TEXT',
                (payload.nama_user.strip(), payload.mata_pel.strip(), payload.skor)
            )
            row = cur.fetchone()
            pg_conn.commit()
            cur.close()
            pg_conn.close()
            cols = ["id", "nama_user", "mata_pel", "skor", "tanggal"]
            data = dict(zip(cols, row))
            return PostResponse(pesan="Skor berhasil disimpan ke Supabase! 🎉", data=SkorResponse(**data))
        except Exception as exc:
            print(f"[DB] Supabase insert notice ({exc}), falling back to SQLite.")

    # 2. Fallback ke SQLite
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO User_Score (nama_user, mata_pel, skor) VALUES (?, ?, ?)",
                (payload.nama_user.strip(), payload.mata_pel.strip(), payload.skor)
            )
            score_id = cursor.lastrowid
            conn.commit()

            cursor.execute(
                "SELECT id, nama_user, mata_pel, skor, datetime(tanggal, 'localtime') as tanggal FROM User_Score WHERE id = ?",
                (score_id,)
            )
            row = cursor.fetchone()
            data = dict(row)

        return PostResponse(pesan="Skor berhasil disimpan! 🎉", data=SkorResponse(**data))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan skor: {exc}")

@app.get("/scores", response_model=List[SkorResponse], tags=["Scores"])
def ambil_semua_skor(nama_user: Optional[str] = None, mata_pel: Optional[str] = None):
    """Ambil data riwayat skor tryout."""
    # 1. Coba ambil dari PostgreSQL (Supabase)
    pg_conn = get_pg_conn()
    if pg_conn:
        try:
            cur = pg_conn.cursor()
            query = 'SELECT id, nama_user, mata_pel, skor, tanggal::TEXT FROM "User_Score" WHERE 1=1'
            params = []
            if nama_user:
                query += " AND LOWER(nama_user) LIKE %s"
                params.append(f"%{nama_user.lower()}%")
            if mata_pel:
                query += " AND mata_pel = %s"
                params.append(mata_pel)
            query += " ORDER BY id DESC LIMIT 100"
            cur.execute(query, params)
            rows = cur.fetchall()
            cur.close()
            pg_conn.close()
            cols = ["id", "nama_user", "mata_pel", "skor", "tanggal"]
            return [SkorResponse(**dict(zip(cols, r))) for r in rows]
        except Exception as exc:
            print(f"[DB] Supabase query notice ({exc}), falling back to SQLite.")

    # 2. Fallback ke SQLite
    try:
        with get_db() as conn:
            query = "SELECT id, nama_user, mata_pel, skor, datetime(tanggal, 'localtime') as tanggal FROM User_Score WHERE 1=1"
            params = []
            if nama_user:
                query += " AND LOWER(nama_user) LIKE ?"
                params.append(f"%{nama_user.lower()}%")
            if mata_pel:
                query += " AND mata_pel = ?"
                params.append(mata_pel)
            query += " ORDER BY id DESC LIMIT 100"

            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = [dict(r) for r in cursor.fetchall()]
        return [SkorResponse(**r) for r in rows]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil skor: {exc}")


# ---------------------------------------------------------------------------
# API Routes — Soal & Materi (from JSON bank)
# ---------------------------------------------------------------------------

@app.get("/soal", tags=["Soal"])
def ambil_soal(mata_pelajaran: Optional[str] = None, topic: Optional[str] = None):
    """Ambil soal latihan dari bank data JSON."""
    if not mata_pelajaran:
        # Jika tidak ada mata pelajaran spesifik, kumpulkan semua
        all_soal = []
        for json_file in SOAL_DIR.glob("*.json"):
            try:
                with open(json_file, "r", encoding="utf-8") as f:
                    all_soal.extend(json.load(f))
            except Exception:
                pass
        return {"total": len(all_soal), "soal": all_soal}

    soal_list = load_bank_soal(mata_pelajaran)
    if topic:
        soal_list = [s for s in soal_list if s.get("topic") == topic]

    return {"total": len(soal_list), "soal": soal_list}

@app.get("/materi/daftar-bab", tags=["Materi"])
def get_daftar_bab(mata_pelajaran: str):
    """Ambil daftar bab materi untuk dropdown mata pelajaran."""
    chapters = load_materi(mata_pelajaran)
    bab_list = [c.get("topic", f"Bab {i+1}") for i, c in enumerate(chapters)]
    if not bab_list:
        bab_list = ["Ringkasan Materi Utama", "Konsep Kunci & Rumus", "Latihan & Pembahasan"]
    return {"mata_pelajaran": mata_pelajaran, "bab": bab_list}

@app.get("/materi", tags=["Materi"])
def get_materi(mata_pelajaran: str, topic: Optional[str] = None):
    """Ambil materi pelajaran yang diformat HTML siap tampil."""
    chapters = load_materi(mata_pelajaran)
    selected_html = ""
    clean_topic = re.sub(r"^bab\s*\d+\s*:\s*", "", (topic or "").strip(), flags=re.IGNORECASE)
    selected_topic = clean_topic or topic or "Materi Pokok"

    if chapters:
        if clean_topic:
            # 1. Exact match
            matched = [c for c in chapters if c.get("topic", "").strip().lower() == clean_topic.lower()]
            # 2. Substring / keyword match
            if not matched:
                words = [w for w in re.findall(r'\w+', clean_topic.lower()) if len(w) > 2]
                for c in chapters:
                    ch_topic = c.get("topic", "").lower()
                    if any(w in ch_topic for w in words):
                        matched = [c]
                        break
            if matched:
                selected_html = matched[0].get("html", "")
                selected_topic = matched[0].get("topic", selected_topic)
        if not selected_html and chapters:
            selected_html = chapters[0].get("html", "")
            selected_topic = chapters[0].get("topic", selected_topic)

    if not selected_html:
        selected_html = f"""
        <div class="materi-box" style="padding:20px; line-height:1.7;">
          <h2 style="color:#3a9db0;">Rangkuman {mata_pelajaran} — {selected_topic}</h2>
          <p>Materi inti persiapan TKA untuk mata pelajaran <strong>{mata_pelajaran}</strong>.</p>
          <div style="background:#faf5ef; border-left:4px solid #5bbccc; padding:14px; margin:16px 0; border-radius:8px;">
            <strong>Poin Kunci Belajar:</strong>
            <ul style="margin-left:20px; margin-top:8px;">
              <li>Pahami konsep dasar sebelum menghafal rumus atau teori.</li>
              <li>Sering kerjakan variasi soal latihan untuk mengasah intuisi.</li>
              <li>Gunakan AI Assistant di pojok kanan bawah jika ada bagian materi yang belum jelas.</li>
            </ul>
          </div>
        </div>
        """

    return {
        "mata_pelajaran": mata_pelajaran,
        "topic": selected_topic,
        "html": selected_html
    }

# ---------------------------------------------------------------------------
# API Routes — AI Assistant
# ---------------------------------------------------------------------------

@app.post("/ai/chat", tags=["AI"])
def ai_chat(payload: ChatRequest):
    """Endpoint chat AI tutor TKA popup — singkat, to-the-point, terhubung database materi."""
    konteks = cari_konteks_materi(payload.pesan)
    konteks_prompt = f"\n\nReferensi Materi dari Database TKA Made Easy:\n{konteks}" if konteks else ""

    system_prompt = (
        "Kamu adalah TKA Chatbot Popup — asisten belajar TKA kilat di pojok layar.\n"
        "TUGAS UTAMA: Menjawab pertanyaan kecil secara CEPAT, SINGKAT, dan LANGSUNG KE INTI.\n\n"
        "ATURAN KETAT MENJAWAB:\n"
        "1. JAWAB SINGKAT & PADAT (maksimal 2–4 kalimat atau 2–3 poin pendek). Dilarang membuat paragraf panjang!\n"
        "2. HINDARI BASA-BASI (langsung ke jawaban inti tanpa kalimat pembuka/penutup panjang).\n"
        "3. Jika user menyapa (halo/hai), sapa balik dengan 1 kalimat ramah saja.\n"
        "4. Jika ada rumus/soal, sebutkan rumus dan penjelasan singkatnya saja.\n"
        "5. Jika relevan, utamakan data materi dan contoh soal dari referensi database TKA berikut:\n"
        f"{konteks_prompt}"
    )
    reply = call_ai(system_prompt, payload.pesan, max_tokens=800)
    return {"balasan": reply}

@app.post("/ai/materi", tags=["AI"])
def ai_materi(payload: MateriRequest):
    """Jelaskan materi berdasarkan gaya belajar user."""
    system_prompt = (
        f"Kamu adalah guru TKA. Jelaskan materi {payload.mata_pelajaran} "
        f"sesuai gaya belajar {payload.gaya_belajar} (visual/auditori/kinestetik)."
    )
    reply = call_ai(system_prompt, f"Jelaskan materi {payload.mata_pelajaran} untuk gaya belajar {payload.gaya_belajar}")
    return {
        "mata_pelajaran": payload.mata_pelajaran,
        "gaya_belajar": payload.gaya_belajar,
        "materi": reply
    }

@app.post("/ai/variasi-soal", tags=["AI"])
def ai_variasi_soal(payload: VariasiSoalRequest):
    """Buat variasi soal baru dari soal yang diberikan."""
    system_prompt = (
        "Kamu adalah pembuat soal TKA profesional. Buat 1 variasi soal baru "
        "dengan konsep sama persis tapi angka/konteks berbeda, lengkap dengan opsi A-E dan kunci jawaban."
    )
    reply = call_ai(system_prompt, f"Buat variasi dari soal berikut:\n{payload.soal_asli}")
    return {"soal_asli": payload.soal_asli, "variasi_soal": reply}

@app.post("/ai/rekomendasi", tags=["AI"])
def ai_rekomendasi(nilai: dict):
    """Berikan analisis dan rekomendasi belajar dari hasil nilai tryout."""
    ringkasan = "\n".join(f"- {mapel}: {skor}/100" for mapel, skor in nilai.items())
    system_prompt = (
        "Kamu adalah konselor BK dan tutor persiapan TKA yang solutif. "
        "Berikan rekomendasi belajar konkret berdasarkan nilai tryout siswa berikut."
    )
    reply = call_ai(system_prompt, f"Hasil Tryout:\n{ringkasan}\n\nBerikan strategi belajar dan prioritas perbaikan.")
    return {"ringkasan_nilai": nilai, "rekomendasi": reply}

# ---------------------------------------------------------------------------
# Static & Frontend Serving (Serves index.html directly)
# ---------------------------------------------------------------------------

@app.get("/api/health", tags=["Info"])
def health():
    return {
        "status": "online",
        "app": "TKA Made Easy Reborn",
        "db": "SQLite (tka.db)",
        "soal_files_available": len(list(SOAL_DIR.glob("*.json"))),
        "materi_files_available": len(list(MATERI_DIR.glob("*.json")))
    }

# Serve index.html at root
INDEX_HTML = BASE_DIR / "index.html"
if INDEX_HTML.exists():
    @app.get("/", tags=["Frontend"])
    def serve_frontend():
        return FileResponse(str(INDEX_HTML))

if __name__ == "__main__":
    import uvicorn
    print("\n[SERVER] Menjalankan TKA Made Easy di http://localhost:8000 ...\n")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

