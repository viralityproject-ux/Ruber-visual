import {noise2D} from '@remotion/noise';

export type Pt = [number, number];

/** Points on a circular arc (degrees, screen orientation: 0 = right, 90 = down). */
export const arcPts = (cx: number, cy: number, r: number, a0: number, a1: number, n = 24): Pt[] =>
  Array.from({length: n + 1}, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as Pt;
  });

/** Points along a straight segment. */
export const linePts = (a: Pt, b: Pt, n = 6): Pt[] => Array.from({length: n + 1}, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n] as Pt);

/** Hand-drawn jitter that "boils" a few times per second, like traced animation. */
export const wobble = (pts: Pt[], seed: string, amp: number, t: number, boilFps = 8): Pt[] => {
  const f = Math.floor(t * boilFps);
  return pts.map(([x, y], i) => [x + noise2D(seed + 'x', i * 0.31, f * 0.77) * amp, y + noise2D(seed + 'y', i * 0.31, f * 0.77) * amp] as Pt);
};

/** Smooth open path through points (Catmull-Rom → cubic Bézier). */
export const openPath = (pts: Pt[]) => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

/** Annulus (ring) path for fill-rule evenodd. */
export const ringPath = (cx: number, cy: number, R: number, r: number) =>
  `M ${cx - R} ${cy} a ${R} ${R} 0 1 0 ${2 * R} 0 a ${R} ${R} 0 1 0 ${-2 * R} 0 Z ` +
  (r > 0 ? `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z` : '');

/** Arrow head (two short strokes) at the end of a direction. */
export const arrowHead = (tip: Pt, from: Pt, size = 18, spread = 0.5) => {
  const a = Math.atan2(tip[1] - from[1], tip[0] - from[0]);
  const l: Pt = [tip[0] - Math.cos(a - spread) * size, tip[1] - Math.sin(a - spread) * size];
  const r: Pt = [tip[0] - Math.cos(a + spread) * size, tip[1] - Math.sin(a + spread) * size];
  return `M ${l[0].toFixed(1)} ${l[1].toFixed(1)} L ${tip[0].toFixed(1)} ${tip[1].toFixed(1)} L ${r[0].toFixed(1)} ${r[1].toFixed(1)}`;
};
