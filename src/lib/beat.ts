import {BEATS} from '../data/beats';

/** Index of the last beat at or before t (-1 before the first beat). */
export const beatIndex = (t: number) => {
  let lo = 0;
  let hi = BEATS.length - 1;
  if (t < BEATS[0]) return -1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (BEATS[mid] <= t) lo = mid;
    else hi = mid - 1;
  }
  return lo;
};

/** Beat time nearest to t. */
export const snap = (t: number) => {
  const i = Math.max(0, beatIndex(t));
  const a = BEATS[i];
  const b = BEATS[Math.min(BEATS.length - 1, i + 1)];
  return t - a < b - t ? a : b;
};

/** Decaying pulse 1 -> 0 after every beat (downbeats can be weighted heavier). */
export const beatPulse = (t: number, decay = 0.22, downbeatBoost = 1.6) => {
  const i = beatIndex(t);
  if (i < 0) return 0;
  const x = (t - BEATS[i]) / decay;
  const k = i % 4 === 0 ? downbeatBoost : 1;
  return Math.max(0, 1 - x) ** 2 * k;
};

/** Beats inside [a, b). */
export const beatsBetween = (a: number, b: number) => BEATS.filter((x) => x >= a && x < b);
