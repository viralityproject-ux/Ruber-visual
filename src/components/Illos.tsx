import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, F, GRAD, GRAD_MID} from '../theme';
import {useT} from '../lib/scene';
import {clamp01, ease, mix, prog} from '../lib/anim';
import {Icon} from './Icons';

/** Cover-fitted still. */
export const Photo: React.FC<{src: string; pos?: string; zoom?: number; style?: React.CSSProperties; filter?: string}> = ({
  src,
  pos = '50% 50%',
  zoom = 1,
  style,
  filter,
}) => (
  <Img
    src={staticFile(src)}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: pos,
      transform: zoom !== 1 ? `scale(${zoom})` : undefined,
      display: 'block',
      filter,
      ...style,
    }}
  />
);

/** Instagram-story style card. `bars` = progress of the story segments (0..4). */
export const StoryCard: React.FC<{
  src: string;
  w: number;
  h: number;
  radius?: number;
  bars?: number;
  pos?: string;
  sat?: number;
  blur?: number;
  ui?: number; // UI chrome opacity
}> = ({src, w, h, radius = 30, bars = 1.3, pos, sat = 1, blur = 0, ui = 1}) => {
  const k = w / 300;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        borderRadius: radius,
        overflow: 'hidden',
        background: C.ink2,
        boxShadow: `0 ${28 * k}px ${60 * k}px rgba(16,14,60,0.28), 0 ${4 * k}px ${10 * k}px rgba(16,14,60,0.12)`,
        filter: blur > 0.05 || sat !== 1 ? `blur(${blur}px) saturate(${sat})` : undefined,
      }}
    >
      <Photo src={src} pos={pos} />
      <div style={{position: 'absolute', inset: 0, opacity: ui}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.5) 100%)'}} />
        <div style={{position: 'absolute', left: 12 * k, right: 12 * k, top: 12 * k, display: 'flex', gap: 5 * k}}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{flex: 1, height: 4 * k, borderRadius: 9, background: 'rgba(255,255,255,0.35)', overflow: 'hidden'}}>
              <div style={{width: `${clamp01(bars - i) * 100}%`, height: '100%', background: '#fff'}} />
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 14 * k, top: 28 * k, display: 'flex', alignItems: 'center', gap: 9 * k}}>
          <div style={{width: 34 * k, height: 34 * k, borderRadius: '50%', background: GRAD_MID, border: `${2.5 * k}px solid #fff`}} />
          <div>
            <div style={{width: 74 * k, height: 8 * k, borderRadius: 9, background: 'rgba(255,255,255,0.95)'}} />
            <div style={{width: 40 * k, height: 6 * k, borderRadius: 9, background: 'rgba(255,255,255,0.6)', marginTop: 5 * k}} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 14 * k, right: 14 * k, bottom: 16 * k, display: 'flex', alignItems: 'center', gap: 10 * k}}>
          <div style={{flex: 1, height: 36 * k, borderRadius: 999, border: `${1.5 * k}px solid rgba(255,255,255,0.7)`}} />
          <Icon name="heart" size={26 * k} color="#fff" stroke={2} />
          <Icon name="share" size={24 * k} color="#fff" stroke={2} />
        </div>
      </div>
    </div>
  );
};

/** Round photo avatar with optional ring. */
export const Avatar: React.FC<{src: string; size: number; ring?: string; ringW?: number; pos?: string; style?: React.CSSProperties; filter?: string}> = ({
  src,
  size,
  ring,
  ringW = 4,
  pos = '50% 30%',
  style,
  filter,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      boxShadow: ring ? `0 0 0 ${ringW}px ${ring}` : '0 6px 16px rgba(16,14,60,0.18)',
      background: C.blueSoft,
      ...style,
    }}
  >
    <Photo src={src} pos={pos} filter={filter} />
  </div>
);

/** Rotating dashed reticle with crosshair ticks. */
export const Reticle: React.FC<{r: number; color: string; p?: number; spin?: number; stroke?: number}> = ({r, color, p = 1, spin = 0, stroke = 3}) => {
  const s = r * 2 + 40;
  return (
    <svg width={s} height={s} viewBox={`${-s / 2} ${-s / 2} ${s} ${s}`} style={{overflow: 'visible', opacity: p}}>
      <g transform={`rotate(${spin}) scale(${mix(1.6, 1, ease.outExpo(p))})`}>
        <circle r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${r * 0.42} ${r * 0.2}`} />
        {[0, 90, 180, 270].map((a) => (
          <line key={a} x1={0} y1={-r - 16} x2={0} y2={-r + 10} stroke={color} strokeWidth={stroke} strokeLinecap="round" transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  );
};

/** Gradient chip/pill. */
export const Chip: React.FC<{children: React.ReactNode; size?: number; dark?: boolean; grad?: boolean; icon?: string; style?: React.CSSProperties}> = ({
  children,
  size = 26,
  dark = false,
  grad = false,
  icon,
  style,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.4,
      padding: `${size * 0.38}px ${size * 0.75}px`,
      borderRadius: 999,
      fontFamily: F.display,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
      color: grad || dark ? '#fff' : C.ink,
      background: grad ? GRAD : dark ? 'rgba(255,255,255,0.08)' : '#fff',
      border: dark && !grad ? '1.5px solid rgba(255,255,255,0.14)' : 'none',
      boxShadow: grad ? '0 14px 36px rgba(23,42,134,0.35)' : dark ? 'none' : '0 12px 30px rgba(16,14,60,0.12)',
      ...style,
    }}
  >
    {icon ? <Icon name={icon} size={size * 1.05} color={grad || dark ? '#fff' : C.blueMid} stroke={2.2} /> : null}
    {children}
  </div>
);

/** Floating heart that rises and fades (for reactions). */
export const FloatHeart: React.FC<{t0: number; x: number; y: number; size?: number; color?: string; drift?: number}> = ({
  t0,
  x,
  y,
  size = 44,
  color = '#fff',
  drift = 0,
}) => {
  const t = useT();
  const p = (t - t0) / 1.3;
  if (p <= 0 || p >= 1) return null;
  const s = prog(t, t0, 0.3, ease.outBackStrong);
  return (
    <div
      style={{
        position: 'absolute',
        left: x + Math.sin(p * 6 + drift) * 18 + drift * p * 40,
        top: y - p * 220,
        opacity: Math.sin(p * Math.PI) * 1.2,
        transform: `translate(-50%, -50%) scale(${s})`,
      }}
    >
      <Icon name="heart" size={size} color={color} fill={color} stroke={1} />
    </div>
  );
};

/** Four-point sparkle. */
export const Sparkle: React.FC<{size: number; color: string; p?: number; rot?: number}> = ({size, color, p = 1, rot = 0}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{transform: `scale(${p}) rotate(${rot}deg)`, overflow: 'visible'}}>
    <path d="M12 1c.8 5.6 3.6 8.4 11 11-7.4 2.6-10.2 5.4-11 11-.8-5.6-3.6-8.4-11-11 7.4-2.6 10.2-5.4 11-11z" fill={color} />
  </svg>
);

/** Phone frame with arbitrary screen content. */
export const PhoneFrame: React.FC<{w: number; children: React.ReactNode; dark?: boolean; style?: React.CSSProperties}> = ({w, children, dark = true, style}) => {
  const h = w * 2.05;
  const k = w / 300;
  return (
    <div
      style={{
        position: 'relative',
        width: w,
        height: h,
        borderRadius: 46 * k,
        padding: 10 * k,
        boxSizing: 'border-box',
        background: dark ? 'linear-gradient(160deg, #22233A, #0B0C1C)' : '#fff',
        boxShadow: `0 ${40 * k}px ${90 * k}px rgba(0,0,0,0.45), inset 0 0 0 ${1.5 * k}px rgba(255,255,255,0.14)`,
        ...style,
      }}
    >
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 38 * k, overflow: 'hidden', background: '#000'}}>
        {children}
        <div style={{position: 'absolute', left: '50%', top: 10 * k, width: 90 * k, height: 26 * k, marginLeft: -45 * k, borderRadius: 999, background: '#000'}} />
      </div>
    </div>
  );
};

/** Gradient-filled check badge (drawn stroke). */
export const Tick: React.FC<{t0: number; size: number; style?: React.CSSProperties}> = ({t0, size, style}) => {
  const t = useT();
  const s = prog(t, t0, 0.45, ease.outBackStrong);
  const p = prog(t, t0 + 0.08, 0.3, ease.outCubic);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: GRAD,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${s})`,
        boxShadow: `0 ${size * 0.2}px ${size * 0.5}px rgba(23,42,134,0.4)`,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24">
        <path d="M4.5 12.5l5 5L20 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      </svg>
    </div>
  );
};
