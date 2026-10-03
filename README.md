# Ruber Visual — Hyper Dynamic Mograph (V2)

Motion graphic brand video Ruber Visual (±135 detik, 16:9), dibuat dengan [Remotion](https://www.remotion.dev/).
Soundtrack = mix VO + musik dari bang Dep (`public/audio/soundtrack-v2.mp3`); semua animasi disinkronkan
per kata (dari SRT + stem vokal) dan per ketukan musik (beat grid).

- Palet **Midnight**: biru `#172A86` / `#2F49C6`, ungu `#431C91` / `#6D3ECC`, background bergantian
  putih `#F4F5F9` dan hitam `#070816`
- Font: Plus Jakarta Sans (display), Instrument Serif Italic (aksen), JetBrains Mono (label UI)
- Gaya SaaS: window aplikasi, kursor, chip, dashboard, kartu
- Kata kunci besar + subtitle karaoke di bawah (outro: logo + tagline saja)
- Semua perpindahan antar bagian **seamless**: tiap act diakhiri dengan warna rata / elemen yang sama
  dengan frame pertama act berikutnya (dicek frame per frame)
- Semua foto revisi (01–41, kecuali 30 yang duplikat 06), semua logo klien, 15 akun sosmed + 135 post dipakai
- SFX dibuat sendiri secara prosedural (`scripts/sfx_v2.py`), nada disetel ke kunci musik

## Menjalankan

```bash
npm install
npm run dev      # Remotion Studio untuk preview & edit
npm run render   # out/ruber-visual-v2-16x9.mp4 + out/ruber-visual-v2-16x9-master.mp4
npm run sfx      # generate ulang stem SFX (public/audio/sfx-v2.wav)
```

`*-master.mp4` adalah versi final untuk upload: audio di-limit dan dinormalisasi ke -14 LUFS / -1 dBTP
lewat `scripts/master.mjs` (butuh ffmpeg). Video stream tidak di-encode ulang.

Props (opsional): `--props='{"sfx":false}'`, `{"subtitles":false}`, `{"music":false}`.

## Struktur

```
src/
  Root.tsx              komposisi RuberVisual (1920×1080, 30 fps)
  Main.tsx              timeline: 12 act berurutan + subtitle + audio
  acts/A01..A12         satu file per bagian VO
  data/vo2.ts           timestamp per kata (VO v2)
  data/beats.ts         beat grid musik
  data/mosaic.ts        warna piksel untuk transisi foto → titik (Act 8c → 9)
  components/           RuberLogo (logo resmi, vektor), Subtitles, Cover (transisi), Illos, UI, Text, Backgrounds
  lib/                  scene/useT, anim (easing), kf (keyframe), beat, sketch (garis tangan), dots
public/
  audio/ photos/ videos/ logos/ sosmed/ sketch/ fonts/ textures/
scripts/
  sfx_v2.py             SFX prosedural + cue sheet → stem
  sketchify.py          foto → layer sketsa garis (Act 2)
  mosaic.py             foto → grid warna (Act 8c)
  master.mjs            mastering audio MP4 akhir
  stills.mjs, sheet.py  render frame QA + contact sheet
```

## Peta act

| # | Detik | VO | Visual | Transisi keluar |
|---|-------|----|--------|-----------------|
| 01 | 0.0 | Setiap brand memiliki cerita… menjangkau audience yang dituju | Titik → story card, carousel 3D, "menarik" dicoret + glitch, viewfinder dari busur logo, jaringan audience | semua tersedot ke titik → hitam |
| 02 | 13.6 | Di Ruber Visual, kami menerjemahkan ide menjadi komunikasi visual yang memiliki tujuan | Logo dibangun dari garis konstruksi; ring logo jadi lensa yang mengubah sketsa jadi foto asli; kartu "Brand Story"; bullseye "tujuan" | zoom ke area putih kartu |
| 03 | 22.0 | company profile … product photography, kebutuhan konten perusahaan & organisasi | App "Ruber Studio": kursor klik 7 layanan, media per layanan; mundur jadi dinding konten | tile berbalik jadi hitam |
| 04 | 35.1 | Dalam perjalanan kami … klien beragam industri … kebutuhan, karakter, tantangan berbeda | Perjalanan 3D melewati foto project, masuk lewat lubang ring logo; marquee 19 logo klien + chip industri; 3 kartu yang berubah beda | zoom ke margin polaroid BTS |
| 05 | 47.2 | Pengalaman tersebut membentuk prinsip kerja … hingga hari ini | Papan polaroid BTS, tulisan tangan "pengalaman", jadi kartu "prinsip kerja" + segel | zoom ke kartu hitam |
| 06 | 51.55 | kecepatan harus berjalan bersama ketepatan … momentum tidak selalu dapat menunggu | Speed streak vs seleksi presisi, jalur notifikasi kebutuhan, stopwatch berisi reel | isi stopwatch jadi kertas |
| 07 | 60.2 | proses yang terarah: memahami, menentukan, menyusun, mengeksekusi … cepat, tepat, akurat | Kanvas 4 langkah (checklist, opsi, gantt, export) dengan kamera pindah; bullseye | masuk ke pusat target |
| 08 | 74.35 | bekerja cepat bukan berarti terburu-buru … kesiapan, koordinasi, pengalaman, pemahaman … tujuan project | Foto TITIP kacau → rapi; inti "kecepatan" diisi 4 sumber BTS; tembakan ke tujuan | titik tujuan jadi kertas |
| 08c | 86.65 | lebih efisien tanpa mengurangi kualitas dan perhatian terhadap detail | Timeline yang jedanya hilang, kualitas 100%, kaca pembesar + callout | foto dizoom sampai jadi piksel → titik |
| 09 | 95.3 | ranah digital … 15+ media & proxy … satu miliar views | Grid titik membungkus jadi globe, 15 akun mengorbit + follower, dinding 135 post → orb, counter 1.000.000.000+ | mata "views" membuka jadi kertas |
| 10 | 108.85 | visual bukan hanya … terlihat, tetapi pesan diterima, diingat, relevan | "visual" raksasa berisi foto, mata + "terlihat" dicoret, chat "Dibaca", kartu diterima/diingat/relevan + audience | runtuh ke titik → hitam |
| 11 | 121.4 | Dari sebuah ide, menjadi proses, diwujudkan menjadi karya … audience-nya | Bohlam menyala → roda gigi → HP publish reel → cincin audience | satu titik cahaya → kertas |
| 12 | 129.65 | Ruber Visual. Cepat, tepat, akurat. | Logo dibangun dari satu titik + tagline | — |

## Mengubah timing

Timing kata ada di `src/data/vo2.ts`; tiap act mengambil cue lewat `at(baris, 'kata')`.
SFX memakai data yang sama (`npm run sfx` setelah VO berubah).
