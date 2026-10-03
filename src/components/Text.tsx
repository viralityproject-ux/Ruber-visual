import React from 'react';
import {C, F, GRAD, GRAD_LIGHT} from '../theme';
import {useLayout, useT} from '../lib/scene';
import {ease, mix, popIn, popOut, prog} from '../lib/anim';
import {VO2 as VO} from '../data/vo2';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Start time (s) of a word in a VO line, matched by prefix. nth picks repeated words. */
export const at = (line: number, word: string, nth = 0) => {
  const hits = VO[line].words.filter((w) => norm(w.w).startsWith(norm(word)));
  if (!hits[nth]) throw new Error(`cue not found: line ${line} "${word}"`);
  return hits[nth].s;
};
export const endOf = (line: number, word: string, nth = 0) => {
  const hits = VO[line].words.filter((w) => norm(w.w).startsWith(norm(word)));
  if (!hits[nth]) throw new Error(`cue not found: line ${line} "${word}"`);
  return hits[nth].e;
};

export type WordLook = 'plain' | 'grad' | 'serif' | 'mono' | 'outline' | 'ghost';

export const lookStyle = (look: WordLook, dark: boolean): React.CSSProperties => {
  switch (look) {
    case 'grad':
      return {
        backgroundImage: dark ? GRAD_LIGHT : GRAD,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        paddingRight: '0.04em',
      };
    case 'serif':
      return {
        fontFamily: F.serif,
        fontStyle: 'italic',
        fontWeight: 400,
        letterSpacing: '-0.01em',
        backgroundImage: dark ? GRAD_LIGHT : GRAD,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        paddingRight: '0.08em',
      };
    case 'mono':
      return {fontFamily: F.mono, fontWeight: 500, letterSpacing: '0.02em'};
    case 'outline':
      return {color: 'transparent', WebkitTextStroke: `0.025em ${dark ? '#fff' : C.ink}`};
    case 'ghost':
      return {opacity: 0.35};
    default:
      return {};
  }
};

/** One animated word. `t` is the global time it should land. */
export const W: React.FC<{
  t: number;
  out?: number;
  look?: WordLook;
  dark?: boolean;
  style?: React.CSSProperties;
  dur?: number;
  y?: number;
  children: React.ReactNode;
}> = ({t: t0, out, look = 'plain', dark = false, style, dur, y, children}) => {
  const t = useT();
  const a = popIn(t, t0, {dur, y});
  const b = out !== undefined ? popOut(t, out) : {};
  const transform = [a.transform, b.transform].filter(Boolean).join(' ');
  const filter = [a.filter, b.filter].filter(Boolean).join(' ') || undefined;
  return (
    <span
      style={{
        display: 'inline-block',
        whiteSpace: 'pre',
        ...lookStyle(look, dark),
        ...style,
        opacity: (a.opacity as number) * ((b.opacity as number) ?? 1),
        transform,
        filter,
      }}
    >
      {children}
    </span>
  );
};

/** Headline block: big tight display type. Size is in px @1080 short side. */
export const H: React.FC<{
  size?: number;
  color?: string;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  lh?: number;
  ls?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({size = 110, color = C.ink, weight = 800, align = 'center', lh = 1.02, ls = '-0.045em', style, children}) => {
  const {u} = useLayout();
  return (
    <div
      style={{
        fontFamily: F.display,
        fontWeight: weight,
        fontSize: size * u,
        lineHeight: lh,
        letterSpacing: ls,
        color,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Small mono label, e.g. "[ 01 ] SERVICES". */
export const Label: React.FC<{size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({
  size = 22,
  color = C.muted,
  style,
  children,
}) => {
  const {u} = useLayout();
  return (
    <div style={{fontFamily: F.mono, fontSize: size * u, letterSpacing: '0.12em', textTransform: 'uppercase', color, fontWeight: 500, ...style}}>
      {children}
    </div>
  );
};

/** Typewriter reveal for UI text. */
export const Typed: React.FC<{text: string; t0: number; cps?: number; caret?: boolean; style?: React.CSSProperties}> = ({
  text,
  t0,
  cps = 28,
  caret = true,
  style,
}) => {
  const t = useT();
  const n = Math.max(0, Math.min(text.length, Math.floor((t - t0) * cps)));
  const done = n >= text.length;
  const blink = Math.floor(t * 2.4) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, n)}
      {caret && t >= t0 && (!done || blink) ? <span style={{opacity: 0.8}}>|</span> : null}
    </span>
  );
};

/** Letters that rise in one by one (for wordmarks / big single words). */
export const Letters: React.FC<{text: string; t0: number; stagger?: number; look?: WordLook; dark?: boolean; style?: React.CSSProperties}> = ({
  text,
  t0,
  stagger = 0.035,
  look = 'plain',
  dark = false,
  style,
}) => {
  const t = useT();
  return (
    <span style={{display: 'inline-block', whiteSpace: 'pre', ...style}}>
      {text.split('').map((ch, i) => {
        const p = prog(t, t0 + i * stagger, 0.55, ease.outExpo);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              ...lookStyle(look, dark),
              opacity: prog(t, t0 + i * stagger, 0.2, ease.outCubic),
              transform: `translateY(${mix(0.6, 0, p)}em) rotate(${mix(8, 0, p)}deg)`,
              filter: p < 0.99 ? `blur(${mix(10, 0, p)}px)` : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/** A hand-drawn style strike line that draws across its parent. */
export const Strike: React.FC<{t0: number; dur?: number; color?: string; thickness?: number; skew?: number}> = ({
  t0,
  dur = 0.35,
  color = C.violet,
  thickness = 0.09,
  skew = -4,
}) => {
  const t = useT();
  const p = prog(t, t0, dur, ease.outQuart);
  return (
    <span
      style={{
        position: 'absolute',
        left: '-4%',
        top: '52%',
        height: `${thickness}em`,
        width: `${p * 108}%`,
        background: color,
        borderRadius: 999,
        transform: `rotate(${skew}deg)`,
        transformOrigin: 'left center',
      }}
    />
  );
};
