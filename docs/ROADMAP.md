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

## Fase 2: Level 3 (modul baru, id `pu`)
Empat misi: (1) Pecah misi: kelompokkan dan urutkan sub-tugas; (2) Cari pola: lanjutkan barisan ubin atau ritme; (3) Blok ulangi: program grid dengan kartu "ulangi n kali"; (4) Cari jalur: bandingkan 2-3 jalur dengan total langkah, pilih yang hemat beserta alasan.
Langkah: rancang 4 misi x 3 versi kembar; tulis pemeriksa (jawaban benar, kesetaraan versi); bangun mekanik baru (perluas `engine.js` untuk blok ulangi: ekspansi program sebelum `sim`); daftarkan di shell; perluas `tests/`; pindahkan data soal ke berkas data terpisah; uji kelompok; rilis.

## Fase 3
Mekanik diagram alur; mekanik menyederhanakan; simulator jika-maka untuk Level 4; opsi Mode Kelas menyimpan progres per nama kelas; ekspor ringkasan untuk penilaian guru.

## Fase 4
Editor tantangan (grid dan tabel logika) memakai pemeriksa yang sama; berbagi soal tanpa server lewat berkas atau kode; tata letak cetak buku teka-teki; paket Pekan Algoritma (panduan pos, kartu stempel, rubrik, gladi).

## Fase 5
Pilih lisensi (kode dan konten soal terpisah); hapus nama sekolah dan aset berlisensi; catat sumber font dan ikon; README, panduan kontribusi, panduan menambah modul; opsional akun dan panel guru dengan penyimpanan bersama.

## Gerbang kualitas tiap modul
1 Rancang (tujuan, 3 versi kembar) 2 Verifikasi otomatis 3 Uji asap klik 4 Uji layar (proyektor dan sentuh) 5 Uji kelompok 3 anak.

## Ukuran keberhasilan (usulan)
Soal lolos pemeriksa 100%; kesalahan teknis per sesi 0; minimal 80% kelompok menyelesaikan Misi 1-2 tanpa bantuan teknis; mayoritas siswa Berkembang atau Mahir pada kemampuan menjelaskan; minimal satu tantangan buatan siswa lolos pemeriksa per kelompok di Fase 4.
