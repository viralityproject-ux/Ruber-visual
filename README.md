# Ruber Visual — Hyper Dynamic Mograph

Motion graphic brand video Ruber Visual (±109 detik), dibuat dengan [Remotion](https://www.remotion.dev/).
Semua animasi disinkronkan per kata ke voice over `public/audio/voice-over.mp3`.

- Palet: biru elektrik `#2B59FF` + ungu `#7B3CFF`, background putih `#F4F5FB` / hitam `#07070F`
- Font: Plus Jakarta Sans (display), Instrument Serif Italic (aksen), JetBrains Mono (UI label)
- Dua format dari satu source: **16:9** (`RuberVisual`, 1920×1080) dan **9:16** (`RuberVisualVertical`, 1080×1920)
- Aset portfolio dari repo ini dipakai langsung (foto & video di `public/photos`, `public/videos`)

## Menjalankan

```bash
npm install
npm run dev              # buka Remotion Studio untuk preview & edit
npm run render           # out/ruber-visual-16x9.mp4  + out/ruber-visual-16x9-master.mp4
npm run render:vertical  # out/ruber-visual-9x16.mp4  + out/ruber-visual-9x16-master.mp4
```

File `*-master.mp4` adalah versi final untuk upload: audio sudah di-limit dan dinormalisasi
ke -14 LUFS / -1 dBTP lewat `scripts/master.mjs` (butuh ffmpeg di PATH; kalau tidak ada, step ini dilewati
dan file tanpa `-master` tetap bisa dipakai). Video stream tidak di-encode ulang.

Audio:
- `public/audio/voice-over.mp3` — VO asli
- `public/audio/voice-over-master.mp3` — VO yang dipakai di video (high-pass 70 Hz, kompresi ringan, -17 LUFS)
- `public/sfx/*.wav` — SFX sintetis, generate ulang dengan `npm run sfx`

Tambah musik latar (opsional): taruh file di `public/audio/`, lalu

```bash
npx remotion render RuberVisual out/ruber-visual-16x9.mp4 --props='{"music":"audio/music.mp3","musicVolume":0.18}'
```

SFX bisa dimatikan dengan `--props='{"sfx":false}'`.

## Struktur

```
src/
  Root.tsx            komposisi 16:9 dan 9:16
  Main.tsx            timeline: 20 scene + transisi + audio
  data/voiceover.ts   timestamp per kata hasil transkripsi VO
  Sfx.tsx             penempatan SFX (detik global)
  lib/scene.tsx       <Scene> (enter/exit transition), useT(), useLayout()
  lib/anim.ts         easing, spring, shake, popIn
  components/         Backgrounds, Text (kinetic type), UI, Icons, Logo, Aperture
  scenes/S01..S20     satu file per bagian VO
public/
  audio/ fonts/ photos/ videos/ sfx/ textures/
scripts/
  gen_sfx.py          generator SFX (whoosh, impact, click, clap, dll) — semua sintetis
  master.mjs          mastering audio MP4 akhir (-14 LUFS), jalan di Mac/Windows/Linux
  stills.mjs          render frame QA: node scripts/stills.mjs RuberVisual 12.5 40.2
  sheet.py            gabungkan still QA jadi satu contact sheet
```

## Peta scene

| # | Detik | VO | Visual |
|---|-------|----|--------|
| 01 | 0.0 | Semua orang bisa menyalakan kamera | Viewfinder HUD, REC, focus box → aperture menutup |
| 02 | 3.0 | produksi yang baik nggak semudah… | Kinetic type, "semudah" dicoret, chip kompleksitas mengorbit |
| 03 | 7.1 | Di Ruber Visual, kami percaya satu hal | Logo reveal + LED dot ring |
| 04 | 10.2 | Kecepatan tidak harus mengorbankan kualitas | Meter Speed & Quality (quality turun lalu balik 100%) |
| 05 | 13.4 | cepat, terukur, tepat | 3 beat full-screen: speed lines / penggaris / crosshair |
| 06 | 16.9 | proses kreatif nggak seharusnya rumit | Garis kusut → lurus dari IDE ke EKSEKUSI |
| 07 | 21.9 | From idea to execution | Progress bar idea → execution |
| 08 | 24.3 | creative production partner | Kolase foto portfolio terbang + lockup |
| 09 | 27.6 | corporate, startup, NGO, brand… cepat, fleksibel, matang | Kartu klien + toggle atribut |
| 10 | 34.8 | company profile … corporate photoshoot | Wheel 9 layanan + deck kartu media dari repo |
| 11 | 46.3 | Brief masuk, treatment bergerak, tim bersiap, produksi berjalan | Pipeline 4 step dengan kamera pan |
| 12 | 51.4 | setiap detail… sebelum hari syuting dimulai | Checklist pre-production → countdown → clapperboard |
| 13 | 56.2 | hidup di dalam ekosistemnya | Satu post → zoom out jadi jaringan ekosistem |
| 14 | 61.8 | 15+ media & proxy account, 100 juta engagement | Counter 15+, grid akun, counter 100.000.000 + stamp |
| 15 | 69.1 | Visual yang bagus saja tidak cukup | Foto "aesthetic 10/10" → glitch → "tidak cukup." |
| 16 | 75.4 | pesan, karakter, alasan untuk diperhatikan | 3 kartu pilar + spotlight |
| 17 | 82.4 | treatment yang kami persiapkan dengan serius | Deck treatment membuka → rapi → stamp |
| 18 | 88.4 | bukan proses panjang… lebih cepat, rapi, pasti | Timeline memanjang → snap → 3 baris check |
| 19 | 96.6 | Great work doesn't need complicated processes… | Statement + strip people |
| 20 | 102.9 | Ruber Visual, creative production made to move | Logo outro |

## Mengubah timing

Timing tiap kata ada di `src/data/voiceover.ts`. Scene mengambil cue lewat `at(line, 'kata')`,
jadi kalau VO diganti cukup update file itu (dan batas `from`/`to` scene di `Main.tsx` bila durasi berubah banyak).
