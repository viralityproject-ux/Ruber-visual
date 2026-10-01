import React from 'react';
import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {at} from './components/Text';

type Sound =
  | 'whoosh'
  | 'whoosh-short'
  | 'whoosh-deep'
  | 'swish'
  | 'impact'
  | 'hit'
  | 'click'
  | 'pop'
  | 'tick'
  | 'ding'
  | 'sparkle'
  | 'riser'
  | 'shutter'
  | 'clap'
  | 'stamp'
  | 'glitch'
  | 'beep';

const VOL: Record<Sound, number> = {
  whoosh: 0.32,
  'whoosh-short': 0.28,
  'whoosh-deep': 0.34,
  swish: 0.22,
  impact: 0.5,
  hit: 0.38,
  click: 0.3,
  pop: 0.22,
  tick: 0.18,
  ding: 0.2,
  sparkle: 0.16,
  riser: 0.26,
  shutter: 0.45,
  clap: 0.55,
  stamp: 0.5,
  glitch: 0.2,
  beep: 0.28,
};

type Cue = [number, Sound, number?]; // time (s), sound, volume multiplier

const stagger = (t0: number, n: number, step: number, s: Sound, v = 1): Cue[] => Array.from({length: n}, (_, i) => [t0 + i * step, s, v] as Cue);

// Sound placement, in global seconds. Transitions are anticipated slightly so the peak lands on the cut.
const CUES: Cue[] = [
  // 01 kamera
  [0.05, 'whoosh-deep', 0.7],
  [at(0, 'menyalakan'), 'beep'],
  [at(0, 'kamera') + 0.12, 'beep', 0.8],
  [2.55, 'whoosh-short', 0.8],
  [2.86, 'shutter'],
  // 02 produksi
  [at(1, 'produksi'), 'hit', 0.6],
  [at(1, 'semudah') + 0.55, 'swish', 1.2],
  ...stagger(at(1, 'yang', 1), 10, 0.07, 'pop', 0.7),
  [7.02, 'whoosh'],
  // 03 brand
  [at(2, 'di') - 0.05, 'impact', 0.8],
  [at(2, 'di') + 0.55, 'sparkle'],
  [at(2, 'visual') - 0.05, 'whoosh-short'],
  [at(2, 'satu'), 'ding', 0.8],
  [10.1, 'whoosh-deep'],
  // 04 speed vs quality
  [at(3, 'kecepatan') - 0.05, 'whoosh-short'],
  [at(3, 'kecepatan') + 0.3, 'riser', 0.35],
  [at(3, 'mengorbankan') + 0.2, 'glitch', 0.6],
  [at(3, 'kualitas') - 0.02, 'hit'],
  [at(3, 'kualitas') + 0.15, 'ding'],
  [13.38, 'whoosh'],
  // 05 cepat / terukur / tepat
  [at(4, 'cepat') - 0.1, 'whoosh-short', 1.1],
  [at(4, 'cepat'), 'hit'],
  [at(4, 'terukur') - 0.02, 'impact', 0.7],
  ...stagger(at(4, 'terukur') + 0.05, 5, 0.06, 'tick'),
  [at(4, 'tepat') - 0.02, 'impact'],
  [at(4, 'tepat') + 0.2, 'ding', 0.7],
  [16.85, 'click'],
  // 06 proses
  [at(5, 'proses'), 'pop'],
  [at(5, 'nggak') - 0.05, 'riser', 0.5],
  [at(5, 'rumit'), 'glitch', 0.5],
  [at(5, 'dari'), 'swish'],
  [at(5, 'dibutuhkan') + 0.2, 'whoosh-short', 0.8],
  [21.82, 'whoosh-deep'],
  // 07 idea → execution
  [at(6, 'idea') - 0.03, 'pop', 1.2],
  [at(6, 'idea') + 0.1, 'riser', 0.5],
  [at(6, 'execution') - 0.02, 'impact'],
  [24.22, 'whoosh'],
  // 08 partner
  ...stagger(at(7, 'ruber') - 0.35, 4, 0.12, 'whoosh-short', 0.6),
  [at(7, 'ruber') + 0.15, 'sparkle'],
  [at(7, 'creative') - 0.05, 'pop', 1.2],
  [27.58, 'whoosh'],
  // 09 clients + attributes
  [at(8, 'corporate'), 'hit', 0.6],
  [at(8, 'startup'), 'hit', 0.6],
  [at(8, 'ngo'), 'hit', 0.6],
  [at(8, 'brand'), 'hit', 0.6],
  [at(8, 'yang') - 0.05, 'whoosh-short', 0.8],
  [at(8, 'eksekusi'), 'pop'],
  [at(8, 'cepat'), 'click'],
  [at(8, 'cepat') + 0.15, 'ding', 0.6],
  [at(9, 'fleksibel'), 'click'],
  [at(9, 'fleksibel') + 0.15, 'ding', 0.6],
  [at(9, 'tetap'), 'click'],
  [at(9, 'matang') - 0.05, 'ding', 0.8],
  [34.78, 'whoosh-deep'],
  // 10 services
  [at(10, 'company') - 0.12, 'whoosh-short'],
  [at(10, 'commercial') - 0.12, 'whoosh-short'],
  [at(10, 'corporate') - 0.12, 'whoosh-short'],
  [at(11, 'short') - 0.12, 'whoosh-short'],
  [at(11, 'film') - 0.12, 'whoosh-short'],
  [at(11, 'social') - 0.12, 'whoosh-short'],
  [at(11, 'social') + 0.5, 'pop'],
  [at(11, 'reels') - 0.12, 'whoosh-short'],
  [at(12, 'product') - 0.12, 'whoosh-short'],
  [at(12, 'product') + 0.05, 'shutter', 0.6],
  [at(12, 'corporate') - 0.12, 'whoosh-short'],
  [at(12, 'corporate') + 0.1, 'shutter', 0.6],
  [46.27, 'whoosh'],
  // 11 workflow
  [at(13, 'brief') + 0.2, 'ding'],
  ...stagger(at(13, 'brief') + 0.25, 4, 0.25, 'tick'),
  [at(13, 'masuk'), 'click'],
  [at(13, 'treatment') - 0.15, 'whoosh-short', 0.8],
  [at(13, 'bergerak'), 'click'],
  [at(13, 'tim') - 0.15, 'whoosh-short', 0.8],
  ...stagger(at(13, 'tim'), 6, 0.08, 'pop', 0.6),
  [at(13, 'bersiap'), 'click'],
  [at(13, 'produksi') - 0.15, 'whoosh-short', 0.8],
  [at(13, 'berjalan'), 'beep'],
  [51.38, 'whoosh'],
  // 12 detail
  ...stagger(at(14, 'detail') + 0.05, 8, 0.2, 'tick', 1.3),
  [at(14, 'detail'), 'pop'],
  [at(14, 'bahkan') - 0.2, 'swish', 1.2],
  ...stagger(at(14, 'bahkan') + 0.35, 7, 0.12, 'tick', 1.1),
  [at(14, 'syuting'), 'ding'],
  [at(14, 'dimulai') - 0.06, 'clap'],
  [56.15, 'whoosh-deep'],
  // 13 ekosistem
  [at(15, 'kami') - 0.1, 'pop'],
  [at(15, 'konten'), 'pop', 1.2],
  [at(15, 'kami', 1) - 0.2, 'riser', 0.6],
  ...stagger(at(15, 'kami', 1) + 0.15, 8, 0.12, 'pop', 0.4),
  [at(15, 'ekosistemnya'), 'sparkle', 1.3],
  [61.72, 'whoosh-deep'],
  // 14 stats
  ...stagger(at(16, '15') - 0.2, 10, 0.06, 'tick', 1.2),
  [at(16, '15') + 0.35, 'hit'],
  ...stagger(at(16, 'media') - 0.2, 8, 0.12, 'pop', 0.4),
  [at(16, 'kembangkan'), 'sparkle'],
  [at(16, 'dengan') - 0.25, 'whoosh-deep'],
  [at(16, 'total'), 'riser', 0.8],
  [at(16, 'juta') - 0.02, 'impact', 1.1],
  [at(16, 'juta'), 'stamp', 0.6],
  [69.08, 'whoosh'],
  // 15 tidak cukup
  [at(17, 'satu'), 'ding', 0.7],
  [at(18, 'visual') - 0.45, 'swish'],
  [at(18, 'visual') - 0.2, 'pop'],
  [at(18, 'bagus'), 'sparkle'],
  [at(18, 'tidak') - 0.05, 'glitch', 1.2],
  [at(18, 'tidak'), 'impact'],
  [at(18, 'cukup'), 'hit', 0.8],
  [75.38, 'whoosh-deep'],
  // 16 pillars
  [at(19, 'pesan') - 0.1, 'pop'],
  [at(19, 'pesan') + 0.7, 'ding', 0.5],
  [at(19, 'karakter') - 0.1, 'pop'],
  [at(19, 'terpenting') - 0.1, 'whoosh-deep', 0.7],
  [at(19, 'punya', 2) - 0.1, 'hit'],
  [at(19, 'diperhatikan'), 'sparkle', 1.2],
  [at(19, 'diperhatikan') + 0.05, 'ding', 0.7],
  [82.32, 'whoosh'],
  // 17 treatment
  [at(20, 'setiap') - 0.1, 'whoosh-short', 0.8],
  [at(20, 'treatment') - 0.1, 'swish', 1.2],
  ...stagger(at(20, 'treatment'), 5, 0.06, 'tick'),
  [at(20, 'persiapkan') - 0.05, 'whoosh-short', 0.7],
  [at(20, 'persiapkan') + 0.4, 'click'],
  [at(20, 'serius') - 0.02, 'stamp'],
  [88.38, 'whoosh'],
  // 18 lebih cepat
  [at(21, 'proses') - 0.1, 'riser', 0.9],
  [at(21, 'panjang'), 'whoosh-deep', 0.7],
  [at(21, 'justru') - 0.02, 'impact', 1.1],
  [at(21, 'eksekusinya'), 'pop'],
  [at(21, 'cepat') - 0.02, 'whoosh-short', 0.6],
  [at(21, 'cepat') + 0.2, 'ding', 0.6],
  [at(21, 'rapi'), 'click'],
  [at(21, 'rapi') + 0.2, 'ding', 0.6],
  [at(21, 'pasti'), 'hit', 0.7],
  [at(21, 'pasti') + 0.2, 'ding', 0.8],
  [96.58, 'whoosh-deep'],
  // 19 great work
  [at(22, 'great') - 0.02, 'impact'],
  [at(22, 'complicated') + 0.1, 'glitch', 0.6],
  [at(22, 'it') - 0.45, 'swish'],
  [at(22, 'preparation') + 0.3, 'ding', 0.7],
  ...stagger(at(22, 'and') - 0.1, 8, 0.09, 'pop', 0.5),
  [at(22, 'people'), 'sparkle'],
  [102.85, 'whoosh-deep', 0.8],
  // 20 outro
  [at(23, 'ruber') - 0.15, 'impact', 1.1],
  [at(23, 'ruber') + 0.4, 'sparkle', 1.2],
  [at(23, 'creative') - 0.2, 'swish'],
  [at(23, 'move') - 0.08, 'whoosh', 1.2],
  [at(23, 'move') + 0.05, 'hit', 0.7],
];

export const Sfx: React.FC<{volume?: number}> = ({volume = 1}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {CUES.map(([t, s, v = 1], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(t * fps))} durationInFrames={Math.round(2 * fps)} name={`sfx ${s}`} layout="none">
          <Audio src={staticFile(`sfx/${s}.wav`)} volume={Math.min(1, VOL[s] * v * volume)} />
        </Sequence>
      ))}
    </>
  );
};
