import React from 'react';
import {C, F} from '../theme';
import {useLayout, useT} from '../lib/scene';
import {ease, mix, prog} from '../lib/anim';

// Ruber mark: a rounded tile with a monoline "r" (stem + looped arm) and a dot.
const STEM = 'M30 82 L30 32 A8 8 0 0 1 46 32 L46 82 A8 8 0 0 1 30 82 Z';
const LOOP = 'M46 40 C52 46 58 47 64 46 C73 44.5 79 38 78 30 C77 22.5 70.5 18 63.5 18.5 C56 19 50 24 46 31';
const DOT = {cx: 69, cy: 74, r: 7};

/**
 * The mark. `t0` triggers the reveal (tile pops, glyph draws, dot drops).
 * variant: 'light' = white tile + ink glyph, 'grad' = gradient tile + white glyph, 'ink' = ink tile + white glyph.
 */
export const LogoMark: React.FC<{size: number; t0?: number; variant?: 'light' | 'grad' | 'ink'; style?: React.CSSProperties}> = ({
  size,
  t0,
  variant = 'grad',
  style,
}) => {
  const t = useT();
  const on = t0 === undefined;
  const tile = on ? 1 : prog(t, t0, 0.55, ease.outBackStrong);
  const draw = on ? 1 : prog(t, t0 + 0.12, 0.7, ease.inOutCubic);
  const dot = on ? 1 : prog(t, t0 + 0.6, 0.45, ease.outBackStrong);
  const tileFill = variant === 'grad' ? 'url(#rvTileGrad)' : variant === 'ink' ? C.ink : '#fff';
  const glyph = variant === 'light' ? C.ink : '#fff';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', ...style}}>
      <defs>
        <linearGradient id="rvTileGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.blue} />
          <stop offset="100%" stopColor={C.violet} />
        </linearGradient>
      </defs>
      <g transform={`translate(50 50) scale(${tile}) rotate(${mix(-25, 0, tile)}) translate(-50 -50)`}>
        <rect x="2" y="2" width="96" height="96" rx="16" fill={tileFill} />
        <path d={STEM} fill="none" stroke={glyph} strokeWidth={5.5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={LOOP} fill="none" stroke={glyph} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <circle cx={DOT.cx} cy={DOT.cy - (1 - dot) * 30} r={DOT.r * dot} fill={glyph} />
      </g>
    </svg>
  );
};

/** "Ruber." + "Visual" wordmark beside the mark. */
export const LogoLockup: React.FC<{
  height: number; // mark size in px @1080
  t0?: number;
  dark?: boolean;
  variant?: 'light' | 'grad' | 'ink';
  textDelay?: number;
}> = ({height, t0, dark = true, variant = 'grad', textDelay = 0.35}) => {
  const t = useT();
  const {u} = useLayout();
  const s = height * u;
  const tt = t0 === undefined ? -999 : t0 + textDelay;
  const reveal = t0 === undefined ? 1 : prog(t, tt, 0.7, ease.outExpo);
  const sub = t0 === undefined ? 1 : prog(t, tt + 0.2, 0.6, ease.outExpo);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: s * 0.24}}>
      <LogoMark size={s} t0={t0} variant={variant} />
      <div style={{overflow: 'hidden', paddingRight: s * 0.1}}>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 800,
            fontSize: s * 0.62,
            lineHeight: 0.95,
            letterSpacing: '-0.045em',
            color: dark ? '#fff' : C.ink,
            transform: `translateX(${mix(-40, 0, reveal)}%)`,
            opacity: reveal,
            filter: reveal < 0.99 ? `blur(${mix(12, 0, reveal)}px)` : undefined,
          }}
        >
          Ruber<span style={{color: C.violetLight}}>.</span>
        </div>
        <div
          style={{
            fontFamily: F.display,
            fontWeight: 700,
            fontSize: s * 0.36,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: dark ? 'rgba(255,255,255,0.6)' : 'rgba(7,7,15,0.55)',
            transform: `translateY(${mix(100, 0, sub)}%)`,
            opacity: sub,
          }}
        >
          Visual
        </div>
      </div>
    </div>
  );
};
