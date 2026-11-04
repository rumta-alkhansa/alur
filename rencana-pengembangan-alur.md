# Rencana Pengembangan Alur

Nov 3, 2026 · @Rifqi

Tujuan akhirnya: pada akhir tahun ajaran 2026/2027, Alur dipakai rutin di ekskul kelas 4-6 sebagai alat belajar yang stabil dengan enam level, terverifikasi otomatis, dan menjadi dasar Pekan Algoritma. Rencana ini memecahnya menjadi lima fase, masing-masing dengan goal, langkah, dan tanda selesai yang jelas.

## 1. Goal

**Goal utama.** Alur menjadi app kelas yang stabil, memuat 6 level (Urutan, Salah Itu Petunjuk, Pecah dan Ulangi, Jika... Maka..., Pilih yang Penting, Perancang), dan dipakai dalam satu Pekan Algoritma di akhir tahun ajaran.

**Goal pendidikan.** Siswa mampu:

- menyusun langkah yang bisa dijalankan teman tanpa bertanya,
- menemukan sebab sebuah bug dan memperbaikinya dengan alasan,
- memecah masalah besar dan mengenali pola berulang,
- menyederhanakan masalah dengan memilih detail penting,
- membuat satu tantangan sederhana untuk temannya sendiri.

**Goal teknis.**

- Satu basis kode, bisa dipasang sebagai PWA dan jalan offline.
- Setiap soal lolos pemeriksa otomatis (jawaban benar, tunggal, setara antar versi).
- Data siswa hanya nama panggilan, tersimpan di perangkat, dan bisa dicadangkan.
- Konten terpisah dari kode agar siap dibuka sebagai open source.

**Bukan goal (sengaja ditunda atau dicoret).**

- Pemakaian di rumah dan akun online lintas perangkat.
- Papan peringkat atau kompetisi antarsiswa.
- Dipakai oleh banyak sekolah.

## 2. Kondisi saat ini

| Komponen | Status | Catatan |
| --- | --- | --- |
| Kerangka Alur (peta level, profil lokal, Mode Kelas dan Mandiri) | Selesai | Uji klik otomatis: 17 pemeriksaan lulus, tanpa error |
| Level 1 Susun Langkah | Selesai | 4 misi × 3 versi, terverifikasi |
| Level 2 Pemburu Bug | Selesai | 4 misi × 3 versi, terverifikasi |
| Level 4 Detektif Logika | Sebagian | Baru tabel logika; aturan jika-maka belum ada |
| Level 3, 5, 6 | Belum dibuat | Ditampilkan sebagai “Segera hadir” |
| Uji di proyektor dan perangkat siswa | Belum | Baru diuji di simulasi |
| Mode offline penuh | Sebagian | Font masih diambil dari internet |
| Cadangan data siswa | Belum ada | Penyimpanan lokal bisa hilang bila data peramban dibersihkan |
| Mode Kelas menyimpan progres | Belum | Disengaja, tetapi bisa dibutuhkan |
| Ikon, nama, lisensi | Sementara | Ikon sederhana; nama belum dicek ketersediaannya |

## 3. Peta fase

Waktu di bawah adalah **perkiraan** yang mengikuti kalender sekolah dan mengasumsikan pengembangan dilakukan di sela tugas harian Anda. Koreksi sesuai ketersediaan waktu yang sebenarnya.

| Fase | Fokus | Perkiraan waktu | Goal fase | Selesai bila... |
| --- | --- | --- | --- | --- |
| 1 | Stabilkan dan uji di kelas | Nov-Des 2026 | Kerangka siap dipakai satu kelas penuh | Satu sesi kelas berjalan tanpa Anda menyentuh kode |
| 2 | Level 3 Pecah dan Ulangi | Jan-Feb 2027 | Modul siap sebelum Unit 3 semester 2 | Satu kelompok 3 anak menyelesaikan 4 misi |
| 3 | Level 5 dan Level 4 lengkap | Mar-Apr 2027 | Abstraksi dan aturan jika-maka tersedia | Diagram alur buatan siswa bisa dijalankan teman |
| 4 | Level 6 dan paket Pekan Algoritma | Mei-Jun 2027 | Siswa membuat tantangan sendiri | Satu teka-teki buatan siswa lolos pemeriksa; pameran terlaksana |
| 5 | Opsional: akun, panel guru, open source | Mulai Jul 2027 | Siap dibagikan | Repositori publik dengan lisensi dan panduan |

Urutan fase mengikuti kebutuhan ekskul: Level 3 harus siap sebelum Unit 3 dipakai, dan Level 6 sebelum proyek akhir kelas 6.

## 4. Langkah rinci per fase

### Fase 1: Stabilkan dan uji di kelas

**Goal:** kerangka yang sekarang terbukti nyaman dipakai anak kelas 4-6.

1. Buka Alur di proyektor kelas dan di satu perangkat siswa. Catat tiga hal yang paling mengganggu.
2. Perbaiki ukuran kotak, kontras, dan area sentuh berdasarkan catatan itu.
3. Simpan font ke dalam berkas lokal agar tampilan sama saat offline.
4. Pilih tempat hosting yang memakai HTTPS (server sekolah, atau layanan hosting statis) dan uji pemasangan sebagai PWA di perangkat kelas.
5. Tambahkan tombol **ekspor dan impor profil** (berkas JSON) sebagai cadangan, karena penyimpanan lokal bisa terhapus.
6. Uji coba dengan satu kelompok 3 anak memakai lembar observasi: di mana mereka ragu, apa yang mereka salah baca.
7. Sederhanakan kalimat petunjuk yang paling sering membuat bingung.
8. Cek ketersediaan nama Alur sebagai nama repositori dan merek; siapkan ikon final.

**Selesai bila:** satu sesi kelas (3 anak, minimal 1 misi tiap modul) berjalan tanpa kesalahan teknis dan tanpa Anda membuka kode.

### Fase 2: Level 3 Pecah dan Ulangi

**Goal:** modul baru yang melatih dekomposisi, pola, perulangan, dan efisiensi, siap sebelum Unit 3 semester 2.

1. Rancang empat misi: (a) memecah misi menjadi bagian, (b) mencari pola pada barisan langkah, (c) mengganti langkah berulang dengan satu blok ulangi, (d) membandingkan dua jalur dan memilih yang lebih hemat.
2. Rancang tiga versi kembar untuk tiap misi: struktur dan tingkat sulit sama, hanya tema dan posisi jawaban yang berbeda.
3. Tulis pemeriksa otomatis: jawaban benar, jawaban tunggal atau semua jawaban valid, dan kesetaraan antar versi.
4. Bangun tiga mekanik baru: pecah misi, blok ulangi di grid, dan perbandingan jalur.
5. Daftarkan modul di kerangka, lalu perluas uji klik otomatis agar mencakup Level 3.
6. Pindahkan data soal semua level ke berkas data terpisah dari kode (langkah awal menuju open source).
7. Uji kelompok 3 anak, revisi, rilis.

**Selesai bila:** 12 soal Level 3 lolos pemeriksa, dan satu kelompok menyelesaikan keempat misi dengan paling banyak satu bantuan teknis.

### Fase 3: Level 5 dan Level 4 lengkap

**Goal:** siswa kelas 6 bisa berlatih abstraksi dan aturan jika-maka.

1. Bangun mekanik **diagram alur**: menyusun kotak mulai, proses, keputusan, dan selesai dari potongan yang tersedia.
2. Bangun mekanik **menyederhanakan**: memilih detail penting dari sebuah peta atau data.
3. Bangun **simulator jika-maka** untuk melengkapi Level 4 (misalnya lampu lalu lintas atau pintu otomatis).
4. Tambahkan opsi **Mode Kelas menyimpan progres** per nama kelas, bila ternyata dibutuhkan setelah Fase 1-2.
5. Tambahkan **ekspor ringkasan** (cetak atau berkas) untuk catatan penilaian Anda.
6. Uji kelompok, revisi, rilis.

**Selesai bila:** diagram alur buatan seorang siswa bisa dijalankan temannya tanpa penjelasan tambahan.

### Fase 4: Level 6 dan Pekan Algoritma

**Goal:** siswa berpindah dari penjawab menjadi perancang.

1. Bangun **editor tantangan**: siswa membuat soal grid atau teka-teki tabel logika sendiri.
2. Pasang pemeriksa yang sama dengan yang dipakai Anda ke editor, sehingga soal siswa harus punya jawaban tunggal sebelum bisa dibagikan.
3. Buat cara berbagi tanpa server: soal diekspor sebagai berkas atau kode, lalu dibuka di perangkat teman.
4. Siapkan tata letak cetak agar teka-teki buatan siswa bisa dijadikan buku.
5. Susun **paket Pekan Algoritma**: panduan tiap pos, kartu stempel, rubrik pameran, dan jadwal gladi.
6. Gladi satu pos bersama satu kelompok, lalu laksanakan pameran.

**Selesai bila:** satu teka-teki buatan siswa lolos pemeriksa dan dipecahkan pengunjung di pameran.

### Fase 5: Opsional, akun, panel guru, dan open source

**Goal:** Alur siap dibagikan atau diperluas tanpa mengubah fondasi.

1. Putuskan lisensi: satu untuk kode, satu untuk konten soal.
2. Hapus nama sekolah dan aset berlisensi yang tidak boleh dibagikan; catat sumber font dan ikon.
3. Tulis README, panduan menambah modul, dan panduan kontribusi.
4. Bila dibutuhkan, tambah sistem akun dan panel guru lintas perangkat dengan penyimpanan bersama.
5. Buka repositori publik.

**Selesai bila:** orang lain bisa menjalankan Alur dan menambah satu modul hanya dengan membaca panduan.

## 5. Gerbang kualitas untuk setiap modul

Setiap modul baru melewati lima gerbang yang sama sebelum dipakai di kelas.

| Gerbang | Pemeriksaan | Alat |
| --- | --- | --- |
| 1. Rancang | Tujuan belajar dan bukti belajar jelas; 3 versi kembar punya struktur sama | Peta unit di rencana ekskul |
| 2. Verifikasi | Jawaban benar dan tunggal; tingkat sulit antar versi setara | Pemeriksa otomatis |
| 3. Uji asap | Alur klik utama berjalan tanpa error | Uji klik otomatis |
| 4. Uji layar | Terbaca dari bangku belakang dan nyaman disentuh | Proyektor dan perangkat siswa |
| 5. Uji kelompok | Satu kelompok 3 anak menyelesaikan modul; bagian membingungkan dicatat dan diperbaiki | Lembar observasi |

## 6. Ukuran keberhasilan

Target di bawah adalah usulan awal; sesuaikan setelah ada data dari kelas.

| Ukuran | Cara mengukur | Usulan target |
| --- | --- | --- |
| Soal bebas cacat | Persentase soal lolos pemeriksa | 100% sebelum dirilis |
| Kestabilan | Kesalahan teknis per sesi kelas | 0 |
| Kemandirian | Persentase kelompok menyelesaikan Misi 1-2 tanpa bantuan teknis | Minimal 80% |
| Pemahaman | Siswa menjelaskan alasan langkahnya dengan kata sendiri (rubrik 3 tingkat) | Mayoritas di tingkat Berkembang atau Mahir |
| Ketekunan | Siswa memperbaiki bug tanpa membuka petunjuk | Meningkat dari awal ke akhir semester |
| Daya cipta | Jumlah tantangan buatan siswa yang lolos pemeriksa | Minimal satu per kelompok di Fase 4 |

## 7. Risiko dan antisipasi

| Risiko | Dampak | Antisipasi |
| --- | --- | --- |
| Waktu pengembangan terbatas | Jadwal fase meleset | Kunci urutan oleh kriteria selesai, bukan tanggal; kerjakan satu modul per fase |
| Data siswa hilang karena peramban dibersihkan | Progres hilang | Ekspor dan impor profil di Fase 1 |
| Soal buatan atau soal baru punya jawaban ganda | Kepercayaan siswa turun | Pemeriksa otomatis wajib sebelum rilis |
| Anak menghafal pola jawaban | Latihan jadi tebakan | Tiga versi kembar dan tahap “jelaskan” di tiap misi |
| Perangkat atau koneksi kelas tidak mendukung | App tidak bisa dipakai | PWA offline dan font lokal |
| Ruang lingkup membengkak | Tidak selesai | Satu mekanik baru per level; tunda akun dan panel guru ke Fase 5 |

## 8. Tiga langkah berikutnya

1. **Uji Alur di proyektor kelas** dan catat tiga hal yang paling mengganggu.
2. **Putuskan tempat hosting** dengan HTTPS agar mode offline aktif.
3. **Pilih satu kelompok 3 anak** untuk uji coba Fase 1.

Setelah catatan uji tersebut ada, Fase 1 bisa ditutup dan Fase 2 dimulai.
