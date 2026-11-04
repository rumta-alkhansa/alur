# AGENTS.md: panduan serah-terima Alur

Baca seluruh berkas ini sebelum mengubah apa pun. Ringkasan satu paragraf: **Alur** (Algoritma, Logika, Uji, Rancang) adalah app belajar berpikir komputasional untuk SD kelas 4-6, dipakai di kelas (proyektor dan perangkat kelas), satu berkas HTML tanpa dependensi runtime, berbentuk PWA. Isinya modul interaktif bertingkat dengan tiga versi soal kembar (A, B, C) supaya tiga anak bisa maju bergiliran.

## 1. Aturan yang tidak boleh dilanggar
1. **Tanpa gambar atau emoji makhluk bernyawa.** Pakai benda, mesin, simbol, warna. Robot (🤖) dianggap mesin dan diperbolehkan.
2. **Bahasa Indonesia, kalimat pendek**, sesuai anak kelas 4-6. Petunjuk berbentuk pertanyaan atau isyarat, **bukan membuka jawaban**. Teks yang dibaca siswa memakai tanda kutip lengkung dan apostrof ’; sintaks kode tetap tanda lurus.
3. **Setiap soal wajib lolos `tests/verify-puzzles.js`**: jawaban benar, tunggal (untuk teka-teki), dan tiga versi kembar setara tingkat sulitnya.
4. **Data siswa hanya nama panggilan di `localStorage` (kunci `alur.v1`).** Jangan menambah data pribadi, akun online, atau pengiriman data keluar.
5. **Satu berkas `dist/index.html` tanpa library runtime.** Jangan menambah dependensi besar tanpa alasan kuat (proyek hemat biaya). Font Baloo 2 dan Nunito sekarang disimpan lokal dengan lisensi OFL.
6. **Tema tidak boleh mengubah mekanik**, dan tema tidak selalu robotika.
7. **Jangan menaruh nama sekolah di kode atau konten** (direncanakan open source).
8. **Tidak ada papan peringkat atau kompetisi antarsiswa.** Penghargaan untuk proses, bukan kecepatan.
9. **Jangan mengubah keputusan di bagian 3 tanpa menanyakan pemilik proyek.**

## 2. Gaya kerja dengan pemilik proyek
Pemilik proyek adalah guru ekskul sekaligus pengembang. Komunikasi yang efektif: langsung, analitis, memakai kerangka konkret, dan jujur soal risiko. Selalu nyatakan apa yang sudah diuji dan apa yang belum. Jangan mengklaim sesuatu "sudah berfungsi" sebelum `npm test` lulus dan, untuk tampilan, sebelum diuji di layar nyata.

## 3. Keputusan yang sudah diambil
- Nama app: **Alur** (Algoritma, Logika, Uji, Rancang).
- Dipakai **di kelas saja**, bukan di rumah (agar tidak mengalihkan perhatian dari pelajaran utama). Sasaran SD kelas 4-6. Satu sekolah. Kemungkinan open source kelak; lisensi belum dipilih (kode dan konten soal bisa berlisensi berbeda).
- Akun bernilai tambah tetapi **penyimpanan lokal cukup** (pemakai tunggal). Rancang data dengan kode siswa lokal agar mudah dipindah ke akun kelak.
- **Mode Kelas** adalah prioritas utama: perangkat guru di proyektor, tiga anak bergiliran (Versi A, B, C), penonton boleh menjelaskan tetapi tidak menyebut jawaban, tombol Tukar versi untuk putaran kedua. **Mode Mandiri** berarti mandiri di dalam kelas: profil lokal, versi soal dibagi bergilir, level dan misi terbuka satu per satu.
- Siklus belajar: Pahami, Rencanakan, Coba, Perbaiki, Jelaskan.
- Mode Kelas sengaja **tidak** menyimpan progres (tiap pertemuan mulai dari awal). Bisa dibuat opsional di Fase 3.
- Penyimpanan bersama dan panel guru lintas perangkat ditunda ke Fase 5.

## 4. Peta repositori
```
src/
  template.html        kerangka halaman, penanda @@CSS@@ @@ENGINE@@ @@MODS@@ @@SHELL@@
  styles.css           semua gaya (variabel tema terang dan gelap)
  engine.js            mesin grid dan robot bersama (tr, at, mv, sim, bfs, gh, run)
  modules/
    susun-langkah.js   Level 1 (id sl)
    pemburu-bug.js     Level 2 (id pb)
    pecah-dan-ulangi.js Level 3 (id pu): mekanik
    pecah-dan-ulangi-data.json data 12 soal Level 3
    detektif-logika.js Level 4 (id dt): data soal + adaptor, termasuk latihan aturan opsional
    pilih-yang-penting.js Level 5 (id ab): abstraksi dan diagram alur
    pilih-yang-penting-data.json data 12 soal Level 5
    perancang.js Level 6 (id ra): pembuat dan penguji peta grid
  shell.js             peta level, profil, mode, navigasi, penyimpanan
  how.json             teks "Cara bermain" per modul
public/                manifest, service worker, ikon (disalin ke dist)
tools/build.js         merakit src menjadi dist/index.html
tests/verify-puzzles.js  verifikasi semua soal
tests/smoke.js         uji asap klik dengan jsdom
docs/                  ROADMAP.md dan KURIKULUM.md
dist/                  hasil build (boleh di-commit untuk pratinjau)
```

## 5. Arsitektur
**Urutan muat** di `dist/index.html`: `engine.js`, lalu modul (masing-masing dibungkus IIFE oleh `tools/build.js` dan diekspos sebagai `SL`, `PB`, `PU`, `DT`, `AB`, `RA`), lalu `shell.js`. Data `pu` dan `ab` diinjeksi ke IIFE dari berkas JSON masing-masing. Tidak ada modul ES; semua global. Gaya kode: ES5 (`var`, `function`), tanpa transpiler.

**Kontrak modul.** Setiap modul mengekspor persis: `MT, H, P, init, view, tap, go, sum`.
| Anggota | Peran |
|---|---|
| `MT` | Array 4 judul misi |
| `H` | Array 4 daftar petunjuk bertingkat (tombol Petunjuk berputar di dalamnya) |
| `P(m, v)` | Mengembalikan objek soal untuk misi `m` (0-3) versi `v` (0-2); minimal `{s: cerita}` |
| `init(p)` | Membuat objek state per soal |
| `view(p, s)` | Mengembalikan HTML papan di `#bd` |
| `tap(e, p, s)` | Menangani klik di `#bd`; mengembalikan nilai benar bila perlu menggambar ulang; mengembalikan 0 bila sudah memanggil `fin` |
| `go(p, s, k)` | Aksi tombol utama (Cek atau Jalankan); harus memanggil `fin(k, pesan, "ok"/"no", menang)` |
| `sum(p, s)` | HTML ringkasan di kartu "misi selesai" |

**Global yang disediakan shell untuk modul:** `key()` (= `v*4 + cur`, indeks misi dan versi), `isDone(k)`, `fin(k, teks, kelas, menang)` (menampilkan pesan, menandai selesai, menyimpan progres Mode Mandiri, menggambar ulang), `rd()` (menggambar ulang). `engine.js` (`run`) juga memakainya.

**State shell:** `ST` (disimpan), `mod`, `v` (versi), `cur` (misi), `rot` (putaran tukar), `S` (state soal per `modId:key`), `DN` (selesai per `modId:key`), `hi` (indeks petunjuk), `cache` (soal).
- `ST = {mode:"kelas"|"mandiri", profiles:[{id,nama,v,done:{modId:[indeksMisi]}}], active}`; versi siswa baru = jumlah profil mod 3.
- Level terkunci di Mode Mandiri bila modul sebelumnya (urutan `ORD`) belum selesai semua 4 misi. Misi terkunci bila misi sebelumnya belum selesai. Di Mode Kelas semuanya terbuka.
- `openMod()` mereset `S`, `DN`, `hi`; progres Mandiri dipulihkan dari profil.
- Shell menyediakan animasi konsep yang bisa diputar ulang untuk Level 1-6. Animasi memakai contoh umum, tidak mengambil jawaban soal, dan tidak mengubah progres. Hormati `prefers-reduced-motion`.

**Mesin grid.** Karakter petak: `.` kosong, `#` kardus, `S` start, `F` finis. Arah 0=utara, 1=timur, 2=selatan, 3=barat. Perintah: `F` maju, `L` kiri, `R` kanan (dari sudut pandang robot). `sim` menjalankan program; `bfs` menghitung jumlah kartu terpendek; `expand` membuka blok ulangi menjadi perintah dasar; `run` menganimasikan 500 ms per langkah dan memanggil `fin`.

**Tiga versi kembar.** `tr(grid, v)`: v0 apa adanya (menghadap utara); v1 cermin horizontal (program: tukar L dan R); v2 putar 180 derajat (menghadap selatan, program sama). Untuk soal bukan grid, versi kembar dibuat dengan struktur dan urutan deduksi sama, hanya tema dan posisi jawaban berbeda. Contoh data Detektif: `K(teks, kiri, ✓/✗, kanan, grid, baris, kolom)` mendefinisikan satu petunjuk bergambar sekaligus petak yang disorot.

## 6. Perintah
```
npm install
npm run build      # menulis dist/
npm test           # build + verify-puzzles + smoke
npm run serve      # http://localhost:8000
```

## 7. Menambah modul atau level (daftar periksa)
1. Rancang 4 misi bertingkat dan 3 versi kembar di atas kertas dulu (struktur, lalu tema). Tulis tujuan belajar dan bukti belajarnya (lihat `docs/KURIKULUM.md`).
2. Buat `src/modules/<nama>.js` mengikuti kontrak bagian 5. Jangan menaruh variabel global; semua di dalam IIFE.
3. Daftarkan di `tools/build.js` (bungkus IIFE dan nama global), di `shell.js` (`MODS`, `NM`, `ORD`, `LV[x].m`), dan di `src/how.json`.
4. Tambahkan pemeriksa untuk modul baru di `tests/verify-puzzles.js` dan alur klik di `tests/smoke.js`.
5. `npm test` harus lulus. Lalu uji di proyektor dan satu kelompok 3 anak sebelum dianggap selesai.
6. Perbarui status di `docs/KURIKULUM.md` dan `docs/ROADMAP.md`.

## 8. Pengujian dan gerbang kualitas
- `verify-puzzles.js` memeriksa: kontrak modul lengkap; Susun Langkah (urutan acak valid, jalur terpendek sama antar versi); Pemburu Bug (program benar sampai finis, program bug gagal); Pecah dan Ulangi (12 versi soal, jawaban, ekspansi blok, dan jalur valid); Detektif (tepat satu solusi per soal, jawaban tersimpan cocok dengan petunjuk, simulator aturan benar pada kondisi terpenuhi dan tidak terpenuhi); Pilih yang Penting (12 versi, pilihan abstraksi, struktur diagram, cabang, dan kasus uji kembar); Perancang (empat ukuran tantangan, tiga versi peta, jumlah penghalang dan rute yang bisa diuji).
- `smoke.js` menyimulasikan klik: peta level, animasi konsep dan putar ulang Level 1-6, penyelesaian modul, Mode Kelas dan giliran, Mode Mandiri (profil, penguncian, penyimpanan progres).
- Tes **tidak** menggantikan uji layar dan uji kelompok. Gerbang tiap modul: Rancang, Verifikasi otomatis, Uji asap, Uji layar, Uji kelompok 3 anak.

## 9. Jebakan yang sudah ditemui
- State soal bocor antar sesi: soal yang sudah terisi tampil terisi saat modul dibuka ulang. Sudah diperbaiki dengan mereset `S` di `openMod`; jangan menghapusnya.
- Animasi robot butuh waktu: tes harus menunggu minimal `(jumlah langkah + 2) x 520` ms.
- Jangan memakai atribut `data-in` (properti `in` bermasalah); gunakan `data-ins`.
- `String.replace` memakai pola `$`; `tools/build.js` memakai fungsi pengganti agar kode berisi `$(...)` aman. Pertahankan.
- Versi B (cermin) pada soal grid wajib menukar L dan R pada program; lupa menukar membuat soal tak terselesaikan.
- Verifikasi soal harus berjalan di berkas hasil build, bukan hanya di sumber.
- Mode Kelas: penonton tidak boleh menyebut jawaban; jangan menambah fitur yang membocorkan jawaban (tombol Petunjuk hanya bertanya balik).
- Font kini lokal. Service worker menyimpan font, lisensi, dan ikon untuk penggunaan offline.

## 10. Status dan tugas berikutnya
**Selesai:** kerangka (peta enam level, profil lokal, dua mode, penyimpanan), Level 1-5 versi otomatis, simulator aturan Level 4, Level 6 awal (editor peta grid dan uji program), animasi konsep Level 1-6, font lokal, ekspor dan impor profil, ikon final, uji otomatis, PWA dasar.
**Belum:** uji Level 3-6 dengan kelompok tiga anak; uji di proyektor dan perangkat siswa; hosting HTTPS; editor teka-teki tabel logika; berbagi/ekspor tantangan; lisensi; pemeriksaan merek Alur secara resmi.

**Tugas berikutnya:** uji layar/proyektor dan kelompok tiga anak untuk Level 3-6; catat masalah dan lakukan perbaikan. Lanjutkan Level 6 dengan editor tabel logika dan berbagi tantangan setelah editor grid diuji. Lihat gerbang fase di `docs/ROADMAP.md`.

## 11. Rujukan di luar repositori (konteks, tidak wajib)
Dokumen sumber ditulis di Claude Docs (rencana ekskul, rancangan app, rencana pengembangan) dan pratinjau di https://claude.ai/artifact/2EEvtj4KMEWv3szU3g8ATo. Isi pentingnya sudah disalin ke `docs/`. Bila ada perbedaan, `AGENTS.md` dan `docs/` yang berlaku.
