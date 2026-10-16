# 🎓 TKA Made Easy — Reborn

Selamat datang di versi baru **TKA Made Easy**!  
Aplikasi simulasi tryout dan belajar UTBK TKA (Tes Kemampuan Akademik) yang lebih tangguh, mandiri, dan mudah dikelola tanpa takut database mati atau error deployment.

---

## ⚡ Kenapa Website Lama Berhenti Bekerja?
1. **Supabase Free Tier Tertidur/Terhapus:** Akun Supabase gratis otomatis masuk mode sleep jika tidak ada aktivitas selama 7 hari. Domain `*.supabase.co` hilang sehingga koneksi database dan otentikasi login putus total.
2. **Backend Vercel Hang/Crash:** File `main.py` lama mencoba menghubungi database Supabase saat startup. Karena Supabase mati, serverless Vercel mengalami *timeout* (504).
3. **Nama File Terduplikasi:** Nama file seperti `index(1).html` dan `main(1).py` membuat script import dan deployment gagal membaca file utama.

---

## 🚀 Fitur & Struktur Baru
- **Zero-Config Database (SQLite):** Riwayat skor disimpan otomatis di file lokal `tka.db`. Tidak perlu setup database cloud yang ribet dan tidak akan pernah kedaluwarsa!
- **Bank Soal & Materi Berbasis JSON:** Menambah soal atau materi tidak butuh SQL! Cukup edit atau tambah file `.json` di folder `data/soal/` dan `data/materi/`.
- **Mode Tamu (Guest Mode):** Langsung coba simulasi tanpa harus pusing login/registrasi Supabase.
- **Unified Single-Server:** Backend FastAPI langsung melayani API sekaligus file frontend `index.html`. Zero CORS error!
- **AI Assistant Siap Pakai:** Mendukung Google Gemini dan Groq (LLaMA 3) dengan pesan fallback ramah jika API key belum diisi.

---

## 📁 Struktur Direktori
```text
TKA madeez/
├── data/
│   ├── soal/             <-- Tempat menaruh data soal UTBK (.json)
│   │   ├── Matematika.json
│   │   ├── Fisika.json
│   │   ├── Kimia.json
│   │   ├── Biologi.json
│   │   ├── Ekonomi.json
│   │   ├── Sosiologi.json
│   │   ├── Geografi.json
│   │   ├── Sejarah.json
│   │   ├── Bahasa Indonesia.json
│   │   └── Bahasa Inggris.json
│   └── materi/           <-- Tempat menaruh rangkuman materi (.json)
│       ├── Matematika.json
│       └── Fisika.json
├── index.html            <-- Antarmuka web utama (Frontend)
├── main.py               <-- Server backend FastAPI
├── requirements.txt      <-- Dependensi Python
├── Procfile              <-- Konfigurasi deployment Render / Railway
├── render.yaml           <-- Blueprint Render.com
├── vercel.json           <-- Konfigurasi deployment Vercel
├── .env.example          <-- Template API key
├── tka.db                <-- Database SQLite lokal (dibuat otomatis)
└── _old_backup/          <-- Arsip file lama kamu yang aman tersimpan
```

---

## 💻 Cara Menjalankan di Komputer Sendiri (Local)
1. Buka Terminal / PowerShell di folder ini:
   ```powershell
   python main.py
   ```
2. Buka browser dan kunjungi:
   👉 **`http://localhost:8000`**

Aplikasi langsung berjalan dengan simulasi tryout, materi, dan penyimpanan skor!

---

## 📝 Cara Menambah / Mengubah Soal (Putting Data)
Buka file di `data/soal/<Nama Mata Pelajaran>.json` (misalnya `data/soal/Matematika.json`).  
Formatnya sangat mudah:
```json
[
  {
    "mata_pelajaran": "Matematika",
    "topic": "Paket 1",
    "content": "Pertanyaan soal di sini...\nA. Pilihan A\nB. Pilihan B\nC. Pilihan C\nD. Pilihan D\nE. Pilihan E",
    "kunci_jawaban": "b",
    "pembahasan": "Penjelasan langkah penyelesaian di sini."
  }
]
```
Setiap kali kamu menyimpan file JSON tersebut, soal baru langsung tersedia di website!

---

## 🌐 Cara Deploy Gratis ke Internet

### Pilihan 1: Render.com (Paling Direkomendasikan & Termudah ⭐)
Render sangat cocok untuk aplikasi Python FastAPI:
1. Buat akun gratis di [render.com](https://render.com).
2. Upload folder ini ke repository GitHub kamu.
3. Di Render Dashboard, klik **New +** > **Web Service**.
4. Hubungkan repository GitHub kamu.
5. Render akan otomatis mendeteksi konfigurasi:
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Klik **Deploy Web Service**. Website kamu langsung aktif online 24/7!

### Pilihan 2: Vercel
File `vercel.json` sudah disediakan jika kamu ingin tetap memakai Vercel. Cukup push ke GitHub dan import ke Vercel!
