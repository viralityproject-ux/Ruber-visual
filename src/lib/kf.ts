import {clamp01, ease, mix} from './anim';

export type Ease = (x: number) => number;
/** [time, value, easing used to arrive at this key] */
export type Key = [number, number, Ease?];

/** Multi-key interpolation over global time. Holds the first/last value outside the range. */
export const kf = (t: number, keys: Key[], fallback: Ease = ease.inOutCubic): number => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1, e] = keys[i + 1];
    if (t <= t1) {
      const p = t1 === t0 ? 1 : clamp01((t - t0) / (t1 - t0));
      return mix(v0, v1, (e ?? fallback)(p));
    }
  }
  return keys[keys.length - 1][1];
};

/** Radius that covers the whole frame from point (x, y). */
export const coverRadius = (x: number, y: number, w: number, h: number) =>
  Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y)) + 4;

/** Deterministic pseudo random in [0,1). */
export const rand = (i: number, salt = 0) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453123;
  return x - Math.floor(x);
};
