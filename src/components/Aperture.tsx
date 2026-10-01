import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {useLayout, useT} from '../lib/scene';
import {ease, mix, prog} from '../lib/anim';

/**
 * Camera iris that closes over the frame and re-opens on the next scene.
 * close: [start, end] of closing; open: [start, end] of opening (global seconds).
 */
export const Aperture: React.FC<{close: [number, number]; open: [number, number]; blades?: number; color?: string}> = ({
  close,
  open,
  blades = 7,
  color = C.ink,
}) => {
  const t = useT();
  const {w, h} = useLayout();
  if (t < close[0] || t > open[1]) return null;
  const R = Math.hypot(w, h) / 2 + 40;
  let k: number; // 0 = fully open, 1 = fully closed
  if (t <= close[1]) k = prog(t, close[0], close[1] - close[0], ease.inCubic);
  else if (t < open[0]) k = 1;
  else k = 1 - prog(t, open[0], open[1] - open[0], ease.outCubic);
  const r = mix(R, 0, k);
  const rot = mix(0, 70, k);
  const cx = w / 2;
  const cy = h / 2;
  const pts = Array.from({length: blades}, (_, i) => {
    const a = (i / blades) * Math.PI * 2 + (rot * Math.PI) / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const hole = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';
  const outer = `M -10 -10 L ${w + 10} -10 L ${w + 10} ${h + 10} L -10 ${h + 10} Z`;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={w} height={h}>
        <path d={`${outer} ${hole}`} fill={color} fillRule="evenodd" />
        {pts.map((p, i) => {
          const q = pts[(i + 1) % blades];
          // blade edge: extend the hole edge outwards so it reads as overlapping blades
          const dx = q[0] - p[0];
          const dy = q[1] - p[1];
          const len = Math.hypot(dx, dy) || 1;
          return (
            <line
              key={i}
              x1={p[0]}
              y1={p[1]}
              x2={p[0] - (dx / len) * R * 1.4}
              y2={p[1] - (dy / len) * R * 1.4}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={2}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="rgba(123,60,255,0.5)" strokeWidth={3} opacity={k > 0.02 && k < 0.98 ? 1 : 0} />
      </svg>
    </AbsoluteFill>
  );
};
