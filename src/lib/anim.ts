import {noise2D} from '@remotion/noise';
import type {CSSProperties} from 'react';

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export const ease = {
  linear: (x: number) => x,
  outCubic: (x: number) => 1 - Math.pow(1 - x, 3),
  outQuart: (x: number) => 1 - Math.pow(1 - x, 4),
  outQuint: (x: number) => 1 - Math.pow(1 - x, 5),
  outExpo: (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  inExpo: (x: number) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
  inCubic: (x: number) => x * x * x,
  inOutCubic: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  inOutExpo: (x: number) =>
    x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  inOutQuint: (x: number) => (x < 0.5 ? 16 * x ** 5 : 1 - Math.pow(-2 * x + 2, 5) / 2),
  outBack: (x: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  outBackStrong: (x: number) => {
    const c1 = 2.6;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  outElastic: (x: number) => {
    const c4 = (2 * Math.PI) / 3.2;
    return x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  },
};

/** Eased 0..1 progress of an animation that starts at t0 (seconds) and lasts dur. */
export const prog = (t: number, t0: number, dur: number, fn: (x: number) => number = ease.outExpo) =>
  fn(clamp01((t - t0) / dur));

/** Progress between two moments: 0 before a, 1 after b. */
export const between = (t: number, a: number, b: number, fn: (x: number) => number = ease.inOutCubic) =>
  fn(clamp01((t - a) / (b - a)));

/** Damped spring in seconds. Returns 0 → 1 with overshoot. */
export const spr = (t: number, t0: number, stiffness = 170, damping = 14, mass = 1) => {
  const x = t - t0;
  if (x <= 0) return 0;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * x) * (Math.cos(wd * x) + ((zeta * w0) / wd) * Math.sin(wd * x));
  }
  return 1 - Math.exp(-w0 * x) * (1 + w0 * x);
};

/** Short decaying bump 0 → 1 → 0, handy for punch zooms. */
export const bump = (t: number, t0: number, dur = 0.35) => {
  const x = (t - t0) / dur;
  if (x <= 0 || x >= 1) return 0;
  return Math.sin(x * Math.PI) * Math.pow(1 - x, 1.2);
};

/** Camera shake offset in px that decays after t0. */
export const shake = (t: number, t0: number, amp = 18, dur = 0.4, seed = 'shake') => {
  const x = (t - t0) / dur;
  if (x <= 0 || x >= 1) return {x: 0, y: 0, r: 0};
  const k = Math.pow(1 - x, 2) * amp;
  return {
    x: noise2D(seed + 'x', t * 30, 0) * k,
    y: noise2D(seed + 'y', t * 30, 1) * k,
    r: noise2D(seed + 'r', t * 25, 2) * k * 0.05,
  };
};

/** The standard "word pops in" look: blur, lift and scale settle. */
export const popIn = (t: number, t0: number, opts: {dur?: number; y?: number; blur?: number; scale?: number} = {}): CSSProperties => {
  const {dur = 0.45, y = 0.45, blur = 14, scale = 0.86} = opts;
  const p = prog(t, t0, dur, ease.outExpo);
  const o = prog(t, t0, dur * 0.45, ease.outCubic);
  return {
    opacity: o,
    transform: `translateY(${mix(y, 0, p)}em) scale(${mix(scale, 1, p)})`,
    filter: p < 0.999 ? `blur(${mix(blur, 0, p)}px)` : undefined,
  };
};

export const popOut = (t: number, t0: number, dur = 0.3): CSSProperties => {
  const p = prog(t, t0, dur, ease.inExpo);
  if (p <= 0) return {};
  return {
    opacity: 1 - p,
    transform: `translateY(${mix(0, -0.3, p)}em) scale(${mix(1, 1.08, p)})`,
    filter: `blur(${mix(0, 16, p)}px)`,
  };
};

export const n2 = (seed: string, x: number, y = 0) => noise2D(seed, x, y);
