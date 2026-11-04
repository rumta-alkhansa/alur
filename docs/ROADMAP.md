# Roadmap Alur

Waktu adalah perkiraan mengikuti kalender sekolah; patokan utama adalah kriteria selesai, bukan tanggal.

| Fase | Fokus | Perkiraan | Selesai bila |
|---|---|---|---|
| 1 | Stabilkan dan uji di kelas | Nov-Des 2026 | Satu sesi kelas berjalan tanpa pemilik proyek menyentuh kode |
| 2 | Level 3 Pecah dan Ulangi | Jan-Feb 2027 | Satu kelompok 3 anak menyelesaikan 4 misi; 12 soal lolos verifikasi |
| 3 | Level 5 dan Level 4 lengkap | Mar-Apr 2027 | Diagram alur buatan siswa bisa dijalankan teman |
| 4 | Level 6 dan paket Pekan Algoritma | Mei-Jun 2027 | Satu teka-teki buatan siswa lolos pemeriksa; pameran terlaksana |
| 5 | Opsional: akun, panel guru, open source | Mulai Jul 2027 | Orang lain bisa menjalankan dan menambah modul hanya dari panduan |

Level 3 harus siap sebelum Unit 3 (semester 2 kelas 5) dipakai.

## Fase 1 (sedang berjalan)
1. Uji di proyektor kelas dan satu perangkat siswa; catat 3 masalah paling mengganggu.
2. Perbaiki ukuran kotak, kontras, area sentuh.
3. Simpan font ke berkas lokal (offline penuh).
4. Pilih hosting HTTPS; uji pasang PWA di perangkat kelas.
5. Tombol ekspor dan impor profil (JSON) sebagai cadangan localStorage.
6. Uji kelompok 3 anak dengan lembar observasi.
7. Sederhanakan kalimat petunjuk yang membingungkan.
8. Cek ketersediaan nama Alur (repositori dan merek); ikon final.

## Fase 2: Level 3 (modul baru, id `pu`) — implementasi otomatis selesai; gerbang kelas menunggu
Modul `pecah-dan-ulangi` sudah terdaftar di shell dan build. Data 12 soal ada di `src/modules/pecah-dan-ulangi-data.json`; `engine.js` membuka blok ulangi menjadi perintah dasar sebelum simulasi dan animasi.

Empat misi:
1. **Pecah Tugas:** tempatkan enam langkah ke tiga kelompok tugas kecil dan urutkan.
2. **Cari Pola:** lanjutkan pola tiga bentuk ubin yang berulang.
3. **Blok Ulangi:** bawa robot di grid dengan paling banyak tiga kartu, termasuk blok ulangi.
4. **Jalur Hemat:** bandingkan tiga jalur, pilih jumlah kartu paling sedikit, dan pilih alasan yang sesuai.

Pemeriksa otomatis memastikan struktur dan jawaban 12 soal, program ulangi sampai ke FINIS, serta semua jalur valid dan satu jalur paling hemat. Uji asap mencakup alur menang tiap misi. Yang masih wajib sebelum Fase 2 ditutup: uji layar/proyektor dan uji kelompok tiga anak.

## Fase 3 (sedang berjalan)
Simulator aturan **Jika… Maka…** sudah ditambahkan sebagai latihan opsional setelah tiap misi tabel Level 4; progres empat misi tidak berubah. Level 5 **Pilih yang Penting** sudah dibuat sebagai modul dengan 4 misi dan 12 versi soal: memilih informasi, menyederhanakan peta, menyusun diagram alur bercabang, dan menelusuri diagram pada beberapa kasus. Level 1-6 memiliki animasi konsep yang diputar ulang sesuai permintaan dan terpisah dari jawaban soal. Tes otomatis mencakup puzzle, tiga versi kembar, alur klik, serta tampilan/pemutaran animasi untuk tiap level yang tersedia.

Yang masih wajib: uji Level 4 dan 5 di proyektor/perangkat siswa serta kelompok tiga anak. Opsi Mode Kelas menyimpan progres per nama kelas dan ekspor ringkasan untuk penilaian guru tetap direncanakan.

## Fase 4 (editor grid awal tersedia)
Level 6 kini memiliki editor peta grid 5 × 5: siswa menaruh jumlah penghalang sesuai misi, menyusun program, lalu menjalankannya untuk menguji START ke FINIS. Empat misi dan tiga versi tersedia. Rancangan belum disimpan atau dibagikan dan uji kelas masih menunggu.

Berikutnya: uji editor grid; buat editor tantangan tabel logika memakai pemeriksa yang sama; tambah berbagi soal tanpa server lewat berkas atau kode; tata letak cetak buku teka-teki; paket Pekan Algoritma (panduan pos, kartu stempel, rubrik, gladi).

## Fase 5
Pilih lisensi (kode dan konten soal terpisah); hapus nama sekolah dan aset berlisensi; catat sumber font dan ikon; README, panduan kontribusi, panduan menambah modul; opsional akun dan panel guru dengan penyimpanan bersama.

## Gerbang kualitas tiap modul
1 Rancang (tujuan, 3 versi kembar) 2 Verifikasi otomatis 3 Uji asap klik 4 Uji layar (proyektor dan sentuh) 5 Uji kelompok 3 anak.

## Ukuran keberhasilan (usulan)
Soal lolos pemeriksa 100%; kesalahan teknis per sesi 0; minimal 80% kelompok menyelesaikan Misi 1-2 tanpa bantuan teknis; mayoritas siswa Berkembang atau Mahir pada kemampuan menjelaskan; minimal satu tantangan buatan siswa lolos pemeriksa per kelompok di Fase 4.
