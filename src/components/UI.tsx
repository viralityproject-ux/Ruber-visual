import React from 'react';
import {Img, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import {C, F, GRAD} from '../theme';
import {useLayout, useSceneBounds, useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog} from '../lib/anim';

/** Mounts children from global time `t` (s) inside the current Scene (so videos start playing there). */
export const At: React.FC<{t: number; until?: number; children: React.ReactNode}> = ({t, until, children}) => {
  const {fps} = useVideoConfig();
  const {startFrame} = useSceneBounds();
  const from = Math.round(t * fps) - startFrame;
  const dur = until !== undefined ? Math.max(1, Math.round(until * fps) - startFrame - from) : undefined;
  return (
    <Sequence from={from} durationInFrames={dur} layout="none">
      {children}
    </Sequence>
  );
};

export const Card: React.FC<{
  dark?: boolean;
  radius?: number;
  pad?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({dark = false, radius = 28, pad = 0, style, children}) => {
  const {u} = useLayout();
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: radius * u,
        padding: pad * u,
        background: dark ? 'linear-gradient(180deg, rgba(34,34,58,0.92), rgba(18,18,32,0.92))' : '#FFFFFF',
        border: `${1.5 * u}px solid ${dark ? 'rgba(255,255,255,0.09)' : 'rgba(20,20,60,0.06)'}`,
        boxShadow: dark
          ? `0 ${30 * u}px ${80 * u}px rgba(0,0,0,0.55), inset 0 ${1 * u}px 0 rgba(255,255,255,0.06)`
          : `0 ${30 * u}px ${70 * u}px rgba(40,30,110,0.16), 0 ${4 * u}px ${12 * u}px rgba(40,30,110,0.06)`,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{
  size?: number;
  grad?: boolean;
  dark?: boolean;
  outline?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({size = 30, grad = false, dark = false, outline = false, style, children}) => {
  const {u} = useLayout();
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.4 * size * u,
        padding: `${0.42 * size * u}px ${0.85 * size * u}px`,
        borderRadius: 999,
        fontFamily: F.display,
        fontWeight: 700,
        fontSize: size * u,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        color: grad || dark ? '#fff' : C.ink,
        background: outline ? 'transparent' : grad ? GRAD : dark ? 'rgba(255,255,255,0.08)' : '#fff',
        border: outline ? `${2 * u}px solid ${dark ? 'rgba(255,255,255,0.4)' : C.ink}` : dark ? `${1.5 * u}px solid rgba(255,255,255,0.12)` : 'none',
        boxShadow: grad
          ? `0 ${14 * u}px ${40 * u}px rgba(91,60,255,0.40)`
          : outline || dark
            ? 'none'
            : `0 ${12 * u}px ${30 * u}px rgba(40,30,110,0.14)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Mouse pointer that glides between waypoints and clicks. Positions are px in the parent box. */
export const Cursor: React.FC<{
  path: {t: number; x: number; y: number; click?: boolean}[];
  size?: number;
  dark?: boolean;
}> = ({path, size = 46, dark = false}) => {
  const t = useT();
  const {u} = useLayout();
  if (t < path[0].t - 0.25) return null;
  let x = path[0].x;
  let y = path[0].y;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (t >= a.t && t <= b.t) {
      const p = ease.inOutCubic(clamp01((t - a.t) / (b.t - a.t)));
      x = mix(a.x, b.x, p);
      y = mix(a.y, b.y, p);
    } else if (t > b.t) {
      x = b.x;
      y = b.y;
    }
  }
  const clicks = path.filter((p) => p.click);
  let press = 0;
  let ring: {p: number; x: number; y: number} | null = null;
  for (const c of clicks) {
    press = Math.max(press, bump(t, c.t, 0.22));
    const rp = (t - c.t) / 0.5;
    if (rp > 0 && rp < 1) ring = {p: rp, x: c.x, y: c.y};
  }
  const appear = prog(t, path[0].t - 0.25, 0.25, ease.outCubic);
  const s = size * u;
  return (
    <>
      {ring ? (
        <div
          style={{
            position: 'absolute',
            left: ring.x - 40 * u * ring.p,
            top: ring.y - 40 * u * ring.p,
            width: 80 * u * ring.p,
            height: 80 * u * ring.p,
            borderRadius: '50%',
            border: `${3 * u}px solid ${dark ? '#fff' : C.violet}`,
            opacity: 1 - ring.p,
          }}
        />
      ) : null}
      <svg
        width={s}
        height={s}
        viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          left: x - s * 0.18,
          top: y - s * 0.08,
          opacity: appear,
          transform: `scale(${1 - press * 0.22})`,
          transformOrigin: '20% 10%',
          filter: `drop-shadow(0 ${6 * u}px ${10 * u}px rgba(0,0,0,0.35))`,
        }}
      >
        <path d="M4.5 2.5 19 13.2l-6.4.9 3.6 6.6-2.7 1.4-3.6-6.7-4.4 4.6z" fill={dark ? '#fff' : C.ink} stroke={dark ? C.ink : '#fff'} strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** Photo or video, cover-fitted. Videos start playing where they are mounted (wrap in <At>). */
export const Media: React.FC<{
  src: string;
  trim?: number; // seconds to skip at the start of a video
  pos?: string;
  zoom?: number;
  style?: React.CSSProperties;
  rate?: number;
  fit?: 'cover' | 'contain';
}> = ({src, trim = 0, pos = '50% 50%', zoom = 1, style, rate = 1, fit = 'cover'}) => {
  const {fps} = useVideoConfig();
  const common: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: fit,
    objectPosition: pos,
    transform: zoom !== 1 ? `scale(${zoom})` : undefined,
    display: 'block',
    ...style,
  };
  if (src.endsWith('.mp4')) {
    return <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(trim * fps)} muted playbackRate={rate} style={common} />;
  }
  return <Img src={staticFile(src)} style={common} />;
};

/** Rolling number. */
export const Counter: React.FC<{
  from?: number;
  to: number;
  t0: number;
  dur: number;
  sep?: string;
  style?: React.CSSProperties;
  pad?: number;
}> = ({from = 0, to, t0, dur, sep = '.', style, pad = 0}) => {
  const t = useT();
  const p = prog(t, t0, dur, ease.outQuart);
  const v = Math.round(mix(from, to, p));
  const s = v.toString().padStart(pad, '0').replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{s}</span>;
};

/** Progress bar with gradient fill. */
export const Bar: React.FC<{p: number; h?: number; dark?: boolean; style?: React.CSSProperties}> = ({p, h = 14, dark = false, style}) => {
  const {u} = useLayout();
  return (
    <div style={{position: 'relative', height: h * u, borderRadius: 999, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(20,20,60,0.07)', overflow: 'hidden', ...style}}>
      <div style={{position: 'absolute', inset: 0, width: `${clamp01(p) * 100}%`, background: GRAD, borderRadius: 999, boxShadow: `0 0 ${20 * u}px rgba(123,60,255,0.6)`}} />
    </div>
  );
};

/** Round check badge that pops. */
export const CheckBadge: React.FC<{t0: number; size?: number; style?: React.CSSProperties}> = ({t0, size = 44, style}) => {
  const t = useT();
  const {u} = useLayout();
  const s = prog(t, t0, 0.5, ease.outBackStrong);
  const p = prog(t, t0 + 0.08, 0.35, ease.outCubic);
  return (
    <div
      style={{
        width: size * u,
        height: size * u,
        borderRadius: '50%',
        background: GRAD,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${s})`,
        boxShadow: `0 ${8 * u}px ${20 * u}px rgba(91,60,255,0.45)`,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg width={size * 0.55 * u} height={size * 0.55 * u} viewBox="0 0 24 24">
        <path d="M4.5 12.5l5 5L20 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
    </div>
  );
};

/** Viewfinder corner brackets. */
export const Brackets: React.FC<{w: number; h: number; len?: number; thick?: number; color?: string; p?: number}> = ({
  w,
  h,
  len = 60,
  thick = 6,
  color = C.ink,
  p = 1,
}) => {
  const {u} = useLayout();
  const L = len * u;
  const T = thick * u;
  const off = (1 - p) * 80 * u;
  const corners: [('top' | 'bottom'), ('left' | 'right')][] = [
    ['top', 'left'],
    ['top', 'right'],
    ['bottom', 'left'],
    ['bottom', 'right'],
  ];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, opacity: p}}>
      {corners.map(([v, hz]) => (
        <div key={v + hz} style={{position: 'absolute', [v]: -off, [hz]: -off, width: L, height: L}}>
          <div style={{position: 'absolute', [v]: 0, [hz]: 0, width: L, height: T, background: color, borderRadius: T}} />
          <div style={{position: 'absolute', [v]: 0, [hz]: 0, width: T, height: L, background: color, borderRadius: T}} />
        </div>
      ))}
    </div>
  );
};

/** Centers children absolutely. */
export const Center: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', ...style}}>{children}</div>
);
