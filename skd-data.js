/* ==========================================================================
   MODE SKD (Seleksi Kompetensi Dasar — Sekolah Kedinasan & CPNS, CAT BKN)
   File data: konfigurasi, daftar bab, modul materi, cheat sheet, target PTK.
   Dimuat SEBELUM script utama index.html.
   ========================================================================== */
(function () {
  'use strict';

  var TWK = 'Tes Wawasan Kebangsaan (TWK)';
  var TIU = 'Tes Intelegensia Umum (TIU)';
  var TKP = 'Tes Karakteristik Pribadi (TKP)';

  window.SKD_CONFIG = {
    names: { TWK: TWK, TIU: TIU, TKP: TKP },
    totalSoal: 110,
    totalMenit: 100,
    maxTotal: 550,
    subtests: [
      { ui: TWK, db: TWK, short: 'TWK', kategori: 'SKD', isWajib: true, icon: '🦅', soalCount: 30, benar: 5, max: 150, pg: 65 },
      { ui: TIU, db: TIU, short: 'TIU', kategori: 'SKD', isWajib: true, icon: '🧠', soalCount: 35, benar: 5, max: 175, pg: 80 },
      { ui: TKP, db: TKP, short: 'TKP', kategori: 'SKD', isWajib: true, icon: '🤝', soalCount: 45, benar: 5, max: 225, pg: 166, pgKedinasan: 156, pgCpns: 166 }
    ],
    // Estimasi skor total "aman" historis (perkiraan komunitas, BUKAN data resmi; berubah tiap tahun & per formasi/daerah)
    ptkTargets: [
      { id: 'STAN',   nama: 'PKN STAN (Kemenkeu)',              jenis: 'kedinasan', aman: 430, kompetitif: 400 },
      { id: 'IPDN',   nama: 'IPDN (Kemendagri)',                jenis: 'kedinasan', aman: 450, kompetitif: 420 },
      { id: 'STIS',   nama: 'Polstat STIS (BPS)',               jenis: 'kedinasan', aman: 420, kompetitif: 390 },
      { id: 'STIN',   nama: 'STIN (BIN)',                       jenis: 'kedinasan', aman: 440, kompetitif: 410 },
      { id: 'POLTEK', nama: 'Poltekip / Poltekim (Kemenkumham/Imipas)', jenis: 'kedinasan', aman: 460, kompetitif: 430 },
      { id: 'STMKG',  nama: 'STMKG (BMKG)',                     jenis: 'kedinasan', aman: 425, kompetitif: 395 },
      { id: 'HUB',    nama: 'Sekolah Kedinasan Kemenhub (STIP, PTDI-STTD, dll.)', jenis: 'kedinasan', aman: 410, kompetitif: 380 },
      { id: 'SSN',    nama: 'Poltek SSN (BSSN)',                jenis: 'kedinasan', aman: 440, kompetitif: 410 },
      { id: 'CPNS',   nama: 'CPNS Umum (Instansi Pusat/Daerah)', jenis: 'cpns',     aman: 420, kompetitif: 380 }
    ]
  };

  window.SKD_CHAPTERS = {};
  window.SKD_CHAPTERS[TWK] = [
    'Pancasila: Nasionalisme & Pilar Negara',
    'UUD NRI 1945 & Sistem Ketatanegaraan',
    'Sejarah Pergerakan, NKRI & Bhinneka Tunggal Ika',
    'Integritas, Antikorupsi & Bela Negara',
    'Bahasa Negara: EYD V & Kalimat Efektif'
  ];
  window.SKD_CHAPTERS[TIU] = [
    'Kemampuan Verbal: Analogi, Sinonim & Antonim',
    'Silogisme & Penalaran Analitis',
    'Numerik: Deret Angka & Hitung Cepat',
    'Soal Cerita & Perbandingan Kuantitatif',
    'Kemampuan Figural: Pola, Rotasi & Ketidaksamaan'
  ];
  window.SKD_CHAPTERS[TKP] = [
    'Pelayanan Publik',
    'Jejaring Kerja',
    'Sosial Budaya',
    'Teknologi Informasi & Komunikasi',
    'Profesionalisme & Anti-Radikalisme'
  ];

  function ul(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }

  var M = {};
  M[TWK] = {};
  M[TWK]['Pancasila: Nasionalisme & Pilar Negara'] = {
    konsep: 'TWK menguji <strong>nasionalisme</strong> dan penguasaan <strong>4 Pilar Kebangsaan</strong> (Pancasila, UUD NRI 1945, NKRI, Bhinneka Tunggal Ika). Pancasila berkedudukan sebagai dasar negara, ideologi terbuka, pandangan hidup, dan <em>sumber dari segala sumber hukum negara</em> (Pasal 2 UU No. 12/2011). Soal HOTS biasanya berupa kasus nyata yang harus dikaitkan dengan nilai sila tertentu.',
    rumus: ul([
      '<strong>Kronologi perumusan:</strong> Sidang I BPUPKI 29 Mei–1 Juni 1945 (usulan Yamin, Soepomo, Soekarno 1 Juni) → Piagam Jakarta oleh Panitia Sembilan 22 Juni 1945 → disahkan PPKI 18 Agustus 1945.',
      '<strong>Hari Lahir Pancasila (1 Juni):</strong> ditetapkan lewat Keppres No. 24 Tahun 2016.',
      '<strong>Ideologi terbuka:</strong> nilai dasar (tetap) – nilai instrumental (UU/kebijakan, dinamis) – nilai praksis (perilaku nyata).',
      '<strong>Kata kunci sila:</strong> 1 toleransi beragama · 2 HAM & kemanusiaan · 3 persatuan · 4 musyawarah/demokrasi · 5 keadilan sosial & pemerataan.'
    ]),
    soal: 'Pemerintah daerah menerbitkan Perda tentang pemerataan akses air bersih di desa terpencil. Dalam Pancasila sebagai ideologi terbuka, Perda tersebut merupakan wujud nilai ...',
    pembahasan: 'Perda adalah penjabaran operasional dari nilai dasar dalam bentuk aturan → <strong>nilai instrumental</strong>. Substansinya (pemerataan) selaras dengan sila ke-5.',
    soalAplikasi: 'Warga sebuah kompleks berbeda pendapat soal penggunaan fasilitas umum. Ketua RT mengundang semua pihak berdiskusi hingga tercapai kesepakatan. Nilai Pancasila yang paling menonjol?',
    solusiAplikasi: 'Penyelesaian lewat diskusi mencari mufakat mencerminkan <strong>sila ke-4 (musyawarah untuk mufakat)</strong>.',
    tips: 'Pada soal kasus, cari "kata kerja inti" tindakan (menghormati, bermusyawarah, membantu, membagi adil) lalu cocokkan ke sila. Hafalkan tanggal & dasar hukum—sering keluar sebagai soal hafalan cepat.'
  };
  M[TWK]['UUD NRI 1945 & Sistem Ketatanegaraan'] = {
    konsep: 'UUD NRI 1945 telah <strong>diamandemen 4 kali (1999–2002)</strong> oleh MPR. Amandemen memperkuat checks and balances: membatasi masa jabatan presiden, pemilihan presiden langsung, serta membentuk MK, KY, dan DPD.',
    rumus: ul([
      '<strong>Pasal 1 ayat (2):</strong> kedaulatan di tangan rakyat dan dilaksanakan menurut UUD. <strong>Ayat (3):</strong> Indonesia negara hukum.',
      '<strong>Pasal 3 ayat (1):</strong> MPR berwenang mengubah & menetapkan UUD.',
      '<strong>Pasal 6A & 7:</strong> Presiden/Wapres dipilih langsung; menjabat 5 tahun, dapat dipilih kembali dalam jabatan yang sama hanya 1 kali masa jabatan.',
      '<strong>Pasal 24C:</strong> MK menguji UU terhadap UUD, sengketa kewenangan lembaga negara, pembubaran parpol, perselisihan hasil pemilu.',
      '<strong>Pasal 27 (3) & 30 (1):</strong> hak dan kewajiban bela negara. <strong>Pasal 31 (4):</strong> anggaran pendidikan min. 20% APBN/APBD. <strong>Pasal 33 (3):</strong> bumi, air, kekayaan alam dikuasai negara untuk kemakmuran rakyat.'
    ]),
    soal: 'Sekelompok warga menilai suatu undang-undang melanggar hak konstitusional mereka. Ke lembaga mana mereka mengajukan pengujian?',
    pembahasan: 'Pengujian UU terhadap UUD adalah kewenangan <strong>Mahkamah Konstitusi</strong> (Pasal 24C). Pengujian peraturan di bawah UU terhadap UU menjadi kewenangan Mahkamah Agung.',
    soalAplikasi: 'Seorang presiden telah menjabat dua periode penuh. Bolehkah ia mencalonkan diri kembali sebagai presiden?',
    solusiAplikasi: 'Tidak. Pasal 7 membatasi jabatan presiden hanya dapat dipilih kembali satu kali dalam jabatan yang sama.',
    tips: 'Buat "peta lembaga" (MPR–DPR–DPD–Presiden–MA–MK–KY–BPK) beserta pasal kewenangannya. Soal TWK sering menukar MA dan MK sebagai pengecoh.'
  };
  M[TWK]['Sejarah Pergerakan, NKRI & Bhinneka Tunggal Ika'] = {
    konsep: 'Materi ini menguji pemahaman perjalanan bangsa dari kebangkitan nasional hingga pengakuan kedaulatan, serta konsep NKRI sebagai negara kepulauan dan semboyan <strong>Bhinneka Tunggal Ika</strong> (kitab Sutasoma, Mpu Tantular).',
    rumus: ul([
      '<strong>20 Mei 1908:</strong> Budi Utomo → Hari Kebangkitan Nasional.',
      '<strong>28 Oktober 1928:</strong> Sumpah Pemuda (Kongres Pemuda II): satu tanah air, satu bangsa, menjunjung bahasa persatuan.',
      '<strong>13 Desember 1957:</strong> Deklarasi Djuanda — konsep negara kepulauan (diakui UNCLOS 1982).',
      '<strong>KMB 1949:</strong> Belanda mengakui kedaulatan kepada RIS (27 Desember 1949). Kembali ke NKRI 17 Agustus 1950.',
      '<strong>Wawasan Nusantara:</strong> kesatuan politik, ekonomi, sosial budaya, dan pertahanan keamanan.'
    ]),
    soal: 'Konsep yang menjadikan laut di antara pulau-pulau Indonesia sebagai satu kesatuan wilayah pertama kali dicetuskan melalui ...',
    pembahasan: '<strong>Deklarasi Djuanda (13 Desember 1957)</strong> menegaskan prinsip negara kepulauan dan kemudian diakui dunia melalui UNCLOS 1982.',
    soalAplikasi: 'Pemerintah membangun jalan dan pasar di wilayah perbatasan agar harga kebutuhan pokok tidak jauh berbeda dengan kota besar. Ini perwujudan Wawasan Nusantara di bidang ...',
    solusiAplikasi: '<strong>Kesatuan ekonomi</strong> — pemerataan pembangunan & kemakmuran di seluruh wilayah.',
    tips: 'Gunakan garis waktu (1908 → 1928 → 1945 → 1949 → 1950 → 1957). Soal sejarah TWK hampir selalu menanyakan "makna/nilai" peristiwa, bukan sekadar tanggal.'
  };
  M[TWK]['Integritas, Antikorupsi & Bela Negara'] = {
    konsep: 'Integritas adalah konsistensi antara nilai, ucapan, dan tindakan. TWK menguji pengetahuan antikorupsi (gratifikasi, konflik kepentingan), 9 nilai antikorupsi KPK, core values ASN <strong>BerAKHLAK</strong>, serta nilai dasar bela negara (UU No. 23/2019).',
    rumus: ul([
      '<strong>9 Nilai Antikorupsi:</strong> jujur, peduli, mandiri, disiplin, tanggung jawab, kerja keras, sederhana, berani, adil.',
      '<strong>BerAKHLAK:</strong> Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif.',
      '<strong>Gratifikasi:</strong> wajib dilaporkan ke KPK paling lambat 30 hari kerja sejak diterima (Pasal 12C UU 20/2001).',
      '<strong>Nilai dasar bela negara:</strong> cinta tanah air, sadar berbangsa & bernegara, setia pada Pancasila, rela berkorban, kemampuan awal bela negara.'
    ]),
    soal: 'Seorang pegawai menerima parsel bernilai tinggi dari rekanan proyek. Tindakan yang sesuai ketentuan adalah ...',
    pembahasan: 'Pemberian terkait jabatan termasuk gratifikasi. Pegawai wajib <strong>menolak, atau jika telanjur diterima, melaporkannya ke KPK paling lambat 30 hari kerja</strong>.',
    soalAplikasi: 'Atasan meminta Anda menaikkan nilai kuitansi perjalanan dinas "agar sama dengan pagu". Sikap berintegritas?',
    solusiAplikasi: 'Menolak dengan sopan, menjelaskan aturan, dan bila tekanan berlanjut melapor melalui saluran pengaduan/whistleblowing instansi.',
    tips: 'Jawaban TWK integritas selalu memilih tindakan yang taat hukum, transparan, dan tidak kompromi—tetapi tetap santun (bukan konfrontatif berlebihan).'
  };
  M[TWK]['Bahasa Negara: EYD V & Kalimat Efektif'] = {
    konsep: 'Bahasa Indonesia sebagai bahasa negara diatur dalam <strong>Pasal 36 UUD NRI 1945</strong> dan UU No. 24/2009. TWK menguji kata baku, penulisan huruf kapital, gabungan kata, tanda baca (EYD Edisi V), dan kalimat efektif.',
    rumus: ul([
      '<strong>Kata baku sering keluar:</strong> analisis, kualitas, praktik, risiko, apotek, hakikat, jadwal, sistem, ijazah, nasihat, objek, konkret.',
      '<strong>Gabungan kata:</strong> kerja sama, tanggung jawab (terpisah) → bertanggung jawab, pertanggungjawaban (serangkai jika berimbuhan awal+akhir); kacamata, matahari (sudah padu).',
      '<strong>Kalimat efektif:</strong> memiliki S–P jelas, hemat (tanpa pleonasme seperti "para hadirin-hadirin"), logis, dan paralel.',
      '<strong>Huruf kapital:</strong> nama hari raya (Idulfitri, Natal), nama geografi (Selat Sunda), jabatan yang diikuti nama orang (Presiden Soekarno).'
    ]),
    soal: 'Kalimat berikut yang efektif adalah ... (a) Bagi para peserta-peserta harap hadir. (b) Peserta diharapkan hadir tepat waktu.',
    pembahasan: '(a) mengandung pleonasme "para … -peserta" dan subjek didahului preposisi "bagi". (b) <strong>efektif</strong>: hemat dan memiliki subjek jelas.',
    soalAplikasi: 'Perbaiki: "Dengan adanya program ini akan meningkatkan kesejahteraan warga."',
    solusiAplikasi: '"Program ini akan meningkatkan kesejahteraan warga." (hapus "dengan adanya" agar subjek jelas).',
    tips: 'Kalimat diawali "Dengan/Bagi/Dalam/Untuk/Kepada" + tanpa subjek lain biasanya TIDAK efektif. Cek juga kata mubazir: "sangat … sekali", "agar supaya", "demi untuk".'
  };

  M[TIU] = {};
  M[TIU]['Kemampuan Verbal: Analogi, Sinonim & Antonim'] = {
    konsep: 'Subtes verbal menguji kosakata dan hubungan makna. <strong>Analogi</strong> menuntut kita menemukan relasi pasangan kata (fungsi, bahan–hasil, pelaku–alat, sebab–akibat, bagian–keseluruhan) lalu mencari pasangan dengan relasi yang sama.',
    rumus: ul([
      '<strong>Teknik kalimat penghubung:</strong> ubah pasangan menjadi kalimat, mis. "PILOT mengemudikan PESAWAT" → "NAKHODA mengemudikan KAPAL".',
      '<strong>Relasi umum:</strong> bahan–produk (kayu:meja), kebutuhan (haus:air), profesi–tempat (dokter:rumah sakit), alat–fungsi (gunting:memotong).',
      '<strong>Sinonim langganan:</strong> nisbi = relatif, abrasi = pengikisan pantai, konklusi = simpulan, kendala = hambatan, absurd = mustahil.',
      '<strong>Antonim langganan:</strong> amatir >< profesional, eksplisit >< implisit, sporadis >< kontinu, prolog >< epilog.'
    ]),
    soal: 'GURU : MURID = DOKTER : ...',
    pembahasan: 'Guru melayani/membimbing murid; dokter melayani/merawat <strong>pasien</strong>.',
    soalAplikasi: 'Antonim dari EKSPLISIT adalah ...',
    solusiAplikasi: '<strong>Implisit</strong> (tersirat).',
    tips: 'Jika lebih dari satu opsi cocok, perketat kalimat penghubungnya (urutan & tingkat spesifik). Jangan habiskan > 30 detik per soal verbal.'
  };
  M[TIU]['Silogisme & Penalaran Analitis'] = {
    konsep: 'Silogisme menarik kesimpulan pasti dari premis. Penalaran analitis menyusun posisi/urutan berdasarkan syarat-syarat (duduk melingkar/berjajar, jadwal, peringkat).',
    rumus: ul([
      '<strong>Modus Ponens:</strong> p→q, p ∴ q. <strong>Modus Tollens:</strong> p→q, ~q ∴ ~p. <strong>Silogisme:</strong> p→q, q→r ∴ p→r.',
      '<strong>Kuantor:</strong> Semua A adalah B; sebagian C adalah A ∴ sebagian C adalah B.',
      '<strong>Negasi:</strong> ~(semua) = ada yang tidak; ~(p∧q) = ~p∨~q; ~(p→q) = p∧~q.',
      '<strong>Analitis:</strong> gambar slot posisi, isi dulu syarat yang pasti (tetap), lalu syarat relatif.'
    ]),
    soal: 'Jika hujan, jalan basah. Jalan tidak basah. Simpulan?',
    pembahasan: 'Modus Tollens: p→q, ~q ∴ ~p → <strong>tidak hujan</strong>.',
    soalAplikasi: 'Negasi dari "Semua peserta lulus" adalah ...',
    solusiAplikasi: '<strong>Ada (beberapa) peserta yang tidak lulus.</strong>',
    tips: 'Waspadai kesalahan konversi (p→q, q ∴ p) dan invers (p→q, ~p ∴ ~q) — keduanya TIDAK sah dan sering menjadi pengecoh.'
  };
  M[TIU]['Numerik: Deret Angka & Hitung Cepat'] = {
    konsep: 'Numerik menguji kecepatan menghitung dan mengenali pola. Deret bisa aritmetika, geometri, bertingkat, Fibonacci, kuadrat/kubik, atau loncat (dua deret bergantian).',
    rumus: ul([
      '<strong>Langkah deret:</strong> cek selisih → cek rasio → cek selisih tingkat 2 → cek pola loncat → cek pola Fibonacci (jumlah 2 suku sebelumnya).',
      '<strong>Pecahan cepat:</strong> 0,125 = 1/8; 0,25 = 1/4; 0,375 = 3/8; 0,2 = 1/5; 0,1666 = 1/6.',
      '<strong>Persen:</strong> a% dari b = b% dari a (mis. 30% × 70 = 70% × 30).',
      '<strong>Kuadrat penting:</strong> 11²–25², 38² = 1.444, 45² = 2.025.'
    ]),
    soal: '2, 5, 11, 23, 47, ...',
    pembahasan: 'Pola ×2 + 1: 47 × 2 + 1 = <strong>95</strong>.',
    soalAplikasi: '25% dari 480 + 0,15 × 600 = ...',
    solusiAplikasi: '120 + 90 = <strong>210</strong>.',
    tips: 'Jangan hitung penuh; gunakan estimasi & digit satuan untuk mengeliminasi opsi.'
  };
  M[TIU]['Soal Cerita & Perbandingan Kuantitatif'] = {
    konsep: 'Soal cerita menguji pemodelan: kecepatan-jarak-waktu, kerja bersama, untung-rugi, umur, rata-rata. Perbandingan kuantitatif meminta membandingkan nilai x dan y.',
    rumus: ul([
      '<strong>Kerja bersama:</strong> 1/T = 1/a + 1/b.',
      '<strong>Berpapasan:</strong> t = jarak / (v₁ + v₂). <strong>Menyusul:</strong> t = selisih jarak / (v₁ − v₂).',
      '<strong>Naik a% lalu turun a%:</strong> hasil akhir turun (a²/100)%.',
      '<strong>Rata-rata gabungan:</strong> total = rata-rata × banyak data.'
    ]),
    soal: 'A menyelesaikan pekerjaan dalam 12 hari, B dalam 6 hari. Jika bekerja bersama?',
    pembahasan: '1/12 + 1/6 = 3/12 = 1/4 → <strong>4 hari</strong>.',
    soalAplikasi: 'x = 30% dari 70, y = 70% dari 30. Hubungan x dan y?',
    solusiAplikasi: 'x = 21 dan y = 21 → <strong>x = y</strong>.',
    tips: 'Tulis variabel singkat sebelum menghitung. Untuk soal umur, buat tabel "sekarang – n tahun lagi".'
  };
  M[TIU]['Kemampuan Figural: Pola, Rotasi & Ketidaksamaan'] = {
    konsep: 'Figural menguji persepsi visual: serial gambar (pola bertahap), analogi gambar, ketidaksamaan (mencari yang berbeda), dan visualisasi ruang (jaring-jaring kubus/dadu).',
    rumus: ul([
      '<strong>Elemen yang dicek:</strong> jumlah (sisi/titik/garis), posisi, rotasi (90°/45°, searah/berlawanan jarum jam), warna/arsiran, ukuran.',
      '<strong>Bilangan segitiga:</strong> 1, 3, 6, 10, 15, … (tambah 2, 3, 4, …).',
      '<strong>Dadu standar:</strong> jumlah sisi berhadapan = 7.',
      '<strong>Ketidaksamaan:</strong> cari satu sifat yang dimiliki 4 gambar tetapi tidak dimiliki 1 gambar.'
    ]),
    soal: 'Segitiga, persegi, segilima, segienam, ...',
    pembahasan: 'Jumlah sisi bertambah 1 → <strong>segitujuh</strong>.',
    soalAplikasi: 'Pada dadu standar, sisi atas bermata 2. Berapa mata sisi bawah?',
    solusiAplikasi: '7 − 2 = <strong>5</strong>.',
    tips: 'Fokus pada SATU elemen dulu (mis. rotasi), baru elemen kedua. Figural sering bisa dijawab < 40 detik.'
  };

  M[TKP] = {};
  var tkpRumus = function (aspek, poin5) {
    return ul([
      '<strong>Skoring TKP:</strong> setiap opsi bernilai 1–5 (tidak ada 0 kecuali kosong). Maksimal 45 × 5 = 225.',
      '<strong>Indikator nilai 5 aspek ' + aspek + ':</strong> ' + poin5,
      '<strong>Pola nilai rendah:</strong> menolak, menghindar, menyerahkan ke orang lain, egois, melanggar aturan.',
      '<strong>Prinsip umum:</strong> proaktif + sesuai aturan + mengutamakan kepentingan organisasi/publik + solutif.'
    ]);
  };
  M[TKP]['Pelayanan Publik'] = {
    konsep: 'Aspek <strong>Pelayanan Publik</strong> menilai empati, keramahan, responsivitas, dan keadilan dalam melayani masyarakat sesuai standar pelayanan (UU No. 25/2009).',
    rumus: tkpRumus('Pelayanan Publik', 'melayani dengan ramah, cepat, adil tanpa diskriminasi, tetap sesuai prosedur, dan memberi solusi.'),
    soal: 'Warga datang marah karena berkasnya belum selesai. Respons terbaik?',
    pembahasan: 'Nilai 5: mendengarkan dengan tenang, meminta maaf atas ketidaknyamanan, menjelaskan status berkas, dan menawarkan solusi/kepastian waktu.',
    soalAplikasi: 'Kenalan atasan meminta didahulukan dari antrean.',
    solusiAplikasi: 'Tetap melayani sesuai urutan antrean dengan menjelaskan secara sopan — adil bagi semua warga.',
    tips: 'Pada pelayanan publik, opsi terbaik = "melayani + tetap sesuai aturan". Opsi "menolak" atau "melempar ke rekan" bernilai rendah.'
  };
  M[TKP]['Jejaring Kerja'] = {
    konsep: 'Aspek <strong>Jejaring Kerja</strong> menilai kemampuan membangun dan memelihara hubungan kerja, berkolaborasi lintas unit/instansi, dan memanfaatkan jaringan untuk tujuan organisasi.',
    rumus: tkpRumus('Jejaring Kerja', 'aktif membangun relasi, berbagi informasi, berkolaborasi, dan menyelesaikan perbedaan secara konstruktif.'),
    soal: 'Anda ditempatkan dalam tim baru yang anggotanya belum Anda kenal.',
    pembahasan: 'Nilai 5: berinisiatif memperkenalkan diri, mengenal peran tiap anggota, dan aktif berkontribusi pada tujuan tim.',
    soalAplikasi: 'Rekan satu tim tidak mengerjakan bagiannya.',
    solusiAplikasi: 'Berbicara empat mata untuk memahami kendalanya dan menawarkan bantuan/penyesuaian pembagian tugas agar target tim tercapai.',
    tips: 'Kata kunci nilai tinggi: inisiatif, kolaborasi, komunikasi, saling menguntungkan.'
  };
  M[TKP]['Sosial Budaya'] = {
    konsep: 'Aspek <strong>Sosial Budaya</strong> menilai kemampuan beradaptasi dengan lingkungan yang beragam, toleransi, menghargai perbedaan SARA, dan menjaga harmoni.',
    rumus: tkpRumus('Sosial Budaya', 'beradaptasi dengan budaya setempat, menghormati perbedaan, menolak diskriminasi, dan menjaga persatuan.'),
    soal: 'Anda ditugaskan di daerah dengan bahasa dan adat yang berbeda.',
    pembahasan: 'Nilai 5: antusias mempelajari bahasa dan adat setempat sambil menjalankan tugas dengan baik.',
    soalAplikasi: 'Ada candaan bernada SARA di grup kantor.',
    solusiAplikasi: 'Mengingatkan dengan santun bahwa candaan tersebut dapat menyinggung dan mengajak menjaga suasana saling menghormati.',
    tips: 'Opsi yang menunjukkan "menghindari/menarik diri" dari lingkungan baru biasanya bernilai rendah.'
  };
  M[TKP]['Teknologi Informasi & Komunikasi'] = {
    konsep: 'Aspek <strong>TIK</strong> menilai kemauan belajar teknologi, pemanfaatan TIK untuk efisiensi kerja, serta kesadaran keamanan informasi (perlindungan data, waspada phishing & hoaks).',
    rumus: tkpRumus('TIK', 'antusias mempelajari teknologi baru, memanfaatkannya untuk efisiensi pelayanan, dan menjaga keamanan data.'),
    soal: 'Kantor menerapkan aplikasi baru yang belum Anda kuasai.',
    pembahasan: 'Nilai 5: segera mempelajarinya (pelatihan, panduan, bertanya) agar dapat memanfaatkannya optimal.',
    soalAplikasi: 'Anda menerima email yang meminta kata sandi akun dinas.',
    solusiAplikasi: 'Tidak memberikan kata sandi, memverifikasi ke tim TI, dan melaporkan email tersebut sebagai phishing.',
    tips: 'Keamanan data selalu prioritas: jangan pilih opsi yang membagikan data pribadi/kata sandi meski "untuk mempercepat pekerjaan".'
  };
  M[TKP]['Profesionalisme & Anti-Radikalisme'] = {
    konsep: 'Aspek <strong>Profesionalisme</strong> menilai komitmen, tanggung jawab, kualitas kerja, dan penerimaan kritik. Aspek <strong>Anti-Radikalisme</strong> menilai kesetiaan pada Pancasila, penolakan kekerasan/intoleransi, dan sikap kritis terhadap paham radikal.',
    rumus: tkpRumus('Profesionalisme & Anti-Radikalisme', 'bertanggung jawab penuh, menerima kritik untuk perbaikan, mengakui & memperbaiki kesalahan; menolak tegas paham anti-Pancasila dan melaporkannya ke pihak berwenang.'),
    soal: 'Anda menemukan kesalahan data dalam laporan yang telanjur Anda serahkan.',
    pembahasan: 'Nilai 5: segera mengakui kepada atasan, memperbaikinya, dan memastikan tidak terulang.',
    soalAplikasi: 'Teman mengajak bergabung kelompok yang ingin mengganti ideologi Pancasila.',
    solusiAplikasi: 'Menolak dengan tegas, mengingatkan teman, dan melaporkan kepada pihak berwenang.',
    tips: 'Untuk anti-radikalisme, opsi "diam saja/abaikan" bernilai rendah — yang tertinggi adalah menolak + mencegah/melaporkan.'
  };
  window.SKD_MATERI_DATA = M;

  var C = {};
  C[TWK] = '<h3>🦅 Cheat Sheet TWK</h3>' + ul([
    'PPKI sahkan Pancasila & UUD: <b>18 Agustus 1945</b> · Piagam Jakarta (Panitia Sembilan): <b>22 Juni 1945</b>',
    'Amandemen UUD: <b>4×</b> (1999, 2000, 2001, 2002) oleh <b>MPR</b>',
    'MK (Ps. 24C): uji UU vs UUD, sengketa lembaga, bubarkan parpol, sengketa pemilu · MA: uji peraturan di bawah UU',
    'Bela negara: Ps. 27(3) & 30(1) · Pendidikan 20%: Ps. 31(4) · SDA: Ps. 33(3) · Bahasa negara: Ps. 36',
    'Budi Utomo 1908 · Sumpah Pemuda 1928 · Djuanda 1957 · KMB 1949',
    'BerAKHLAK · 9 nilai antikorupsi · Gratifikasi lapor KPK ≤ 30 hari kerja',
    'Kalimat efektif: S–P jelas, tanpa pleonasme, tanpa "Dengan adanya…" di awal'
  ]) + '<p><b>Target:</b> ≥ 13 benar (65) untuk lolos PG; idealnya 20+ benar (100+).</p>';
  C[TIU] = '<h3>🧠 Cheat Sheet TIU</h3>' + ul([
    'Analogi: buat kalimat penghubung → uji ke semua opsi',
    'Modus Ponens/Tollens/Silogisme sah · Konversi & invers TIDAK sah',
    'Negasi "semua" = "ada yang tidak" · ~(p→q) = p ∧ ~q',
    'Deret: selisih → rasio → tingkat 2 → loncat → Fibonacci',
    'Kerja bersama 1/T = Σ 1/t · Berpapasan t = s/(v₁+v₂)',
    'Naik a% lalu turun a% → turun a²/100 %',
    'Dadu: sisi berhadapan = 7 · Bilangan segitiga 1,3,6,10,15'
  ]) + '<p><b>Target:</b> ≥ 16 benar (80) untuk lolos PG; kerjakan figural & verbal dulu, numerik berat terakhir.</p>';
  C[TKP] = '<h3>🤝 Cheat Sheet TKP</h3>' + ul([
    'Skor 1–5 per soal, maks 225 · <b>WAJIB jawab semua</b> (kosong = 0)',
    'Nilai 5 = proaktif + sesuai aturan + kepentingan organisasi/publik + solutif',
    'Pelayanan: ramah, adil, tanpa diskriminasi, tetap prosedural',
    'Jejaring: inisiatif kolaborasi & komunikasi',
    'Sosbud: adaptasi & toleransi · TIK: belajar teknologi & jaga keamanan data',
    'Profesional: akui & perbaiki kesalahan, terima kritik · Anti-radikalisme: tolak + laporkan',
    'Nilai rendah: menolak, menghindar, melempar tugas, egois, melanggar aturan'
  ]) + '<p><b>Target:</b> PG 156 (kedinasan) / 166 (CPNS); target aman ≥ 180 (rata-rata ≥ 4 poin/soal).</p>';
  window.SKD_CHEATSHEET_DATA = C;
})();
