import React from 'react';
import {VO2} from '../data/vo2';
import {C, F} from '../theme';
import {useT} from '../lib/scene';
import {clamp01, ease, mix} from '../lib/anim';

/** Background tone timeline (seconds): which acts are paper and which are ink. */
export const TONES: [number, 'light' | 'dark'][] = [
  [0, 'light'],
  [13.45, 'dark'],
  [21.95, 'light'],
  [35.1, 'dark'],
  [47.2, 'light'],
  [51.55, 'dark'],
  [60.2, 'light'],
  [74.35, 'dark'],
  [86.65, 'light'],
  [95.3, 'dark'],
  [108.85, 'light'],
  [121.4, 'dark'],
  [129.65, 'light'],
];

/** 0 = light background, 1 = dark background, smoothly blended around boundaries. */
export const darkness = (t: number) => {
  let v = TONES[0][1] === 'dark' ? 1 : 0;
  for (let i = 1; i < TONES.length; i++) {
    const [tb, tone] = TONES[i];
    const target = tone === 'dark' ? 1 : 0;
    const p = clamp01((t - (tb - 0.1)) / 0.25);
    v = mix(v, target, ease.inOutCubic(p));
  }
  return v;
};

const lerpColor = (a: number[], b: number[], p: number) => `rgba(${a.map((x, i) => Math.round(mix(x, b[i], p))).join(',')})`;

/** Karaoke-style captions of the full VO, adapting to the background tone. */
export const Subtitles: React.FC = () => {
  const t = useT();
  const line = VO2.find((l) => t >= l.start - 0.08 && t <= l.end + 0.32);
  if (!line) return null;
  const inP = ease.outCubic(clamp01((t - (line.start - 0.08)) / 0.18));
  const outP = ease.inCubic(clamp01((t - (line.end + 0.12)) / 0.2));
  const d = darkness(t);
  const text = lerpColor([7, 8, 22, 1], [255, 255, 255, 1], d);
  const pending = lerpColor([7, 8, 22, 0.32], [255, 255, 255, 0.38], d);
  const pill = lerpColor([255, 255, 255, 0.82], [9, 10, 28, 0.62], d);
  const border = lerpColor([7, 8, 22, 0.06], [255, 255, 255, 0.1], d);
  const accent = d > 0.5 ? C.blueLight : C.blueMid;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 46,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: inP * (1 - outP),
        transform: `translateY(${mix(14, 0, inP) + outP * 8}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          padding: '12px 26px 13px',
          borderRadius: 18,
          background: pill,
          border: `1.5px solid ${border}`,
          backdropFilter: 'blur(14px)',
          fontFamily: F.display,
          fontWeight: 600,
          fontSize: 31,
          letterSpacing: '-0.01em',
          lineHeight: 1.25,
          textAlign: 'center',
          boxShadow: d > 0.5 ? 'none' : '0 10px 30px rgba(20,20,60,0.10)',
        }}
      >
        {line.words.map((w, i) => {
          const said = t >= w.s;
          const active = t >= w.s && t < w.e + 0.05;
          return (
            <span key={i} style={{color: active ? accent : said ? text : pending}}>
              {w.w}
              {i < line.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};
