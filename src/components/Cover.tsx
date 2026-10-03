import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useLayout, useT} from '../lib/scene';
import {ease, mix, prog} from '../lib/anim';
import {coverRadius} from '../lib/kf';

/**
 * A disc that grows from (x, y) until it covers the frame — the hand-off into the next act.
 * The next act starts on the same flat colour, so the cut is invisible.
 */
export const GrowCover: React.FC<{t0: number; dur: number; x?: number; y?: number; color: string; r0?: number; fn?: (x: number) => number}> = ({
  t0,
  dur,
  x,
  y,
  color,
  r0 = 0,
  fn = ease.inCubic,
}) => {
  const t = useT();
  const {w, h} = useLayout();
  if (t < t0) return null;
  const cx = x ?? w / 2;
  const cy = y ?? h / 2;
  const R = coverRadius(cx, cy, w, h);
  const r = mix(r0, R, prog(t, t0, dur, fn));
  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 1000}}>
      <div style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: '50%', background: color}} />
    </AbsoluteFill>
  );
};

/**
 * The opposite: a full-frame colour that opens up as a growing hole, revealing what is underneath.
 * Used at the very start of an act that continues a GrowCover.
 */
export const HoleReveal: React.FC<{t0: number; dur: number; x?: number; y?: number; color: string; fn?: (x: number) => number}> = ({
  t0,
  dur,
  x,
  y,
  color,
  fn = ease.inOutCubic,
}) => {
  const t = useT();
  const {w, h} = useLayout();
  const p = prog(t, t0, dur, fn);
  if (p >= 1) return null;
  const cx = x ?? w / 2;
  const cy = y ?? h / 2;
  const R = coverRadius(cx, cy, w, h);
  const r = mix(0, R, p);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', zIndex: 1000}}>
      <svg width={w} height={h}>
        <path d={`M0 0H${w}V${h}H0Z M${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} Z`} fill={color} fillRule="evenodd" />
      </svg>
    </AbsoluteFill>
  );
};
