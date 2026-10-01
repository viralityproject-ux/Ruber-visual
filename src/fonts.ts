import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const faces: {family: string; file: string; weight: string; style?: string}[] = [
  {family: 'Jakarta', file: 'plus-jakarta-sans-latin-500-normal.woff2', weight: '500'},
  {family: 'Jakarta', file: 'plus-jakarta-sans-latin-600-normal.woff2', weight: '600'},
  {family: 'Jakarta', file: 'plus-jakarta-sans-latin-700-normal.woff2', weight: '700'},
  {family: 'Jakarta', file: 'plus-jakarta-sans-latin-800-normal.woff2', weight: '800'},
  {family: 'Jakarta', file: 'plus-jakarta-sans-latin-800-italic.woff2', weight: '800', style: 'italic'},
  {family: 'Instrument', file: 'instrument-serif-latin-400-normal.woff2', weight: '400'},
  {family: 'Instrument', file: 'instrument-serif-latin-400-italic.woff2', weight: '400', style: 'italic'},
  {family: 'JBMono', file: 'jetbrains-mono-latin-400-normal.woff2', weight: '400'},
  {family: 'JBMono', file: 'jetbrains-mono-latin-500-normal.woff2', weight: '500'},
  {family: 'JBMono', file: 'jetbrains-mono-latin-700-normal.woff2', weight: '700'},
];

export const fontsReady = Promise.all(
  faces.map((f) =>
    loadFont({
      family: f.family,
      url: staticFile(`fonts/${f.file}`),
      weight: f.weight,
      style: f.style ?? 'normal',
    }),
  ),
);
