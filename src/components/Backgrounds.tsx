import React, {useMemo} from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {C} from '../theme';
import {useLayout, useT} from '../lib/scene';

/** Closed smooth path through points (Catmull-Rom → cubic Bézier). */
export const smoothClosed = (pts: [number, number][]) => {
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + ' Z';
};

export type BlobSpec = {x: number; y: number; r: number; color: string; seed: string; wobble?: number; drift?: number};

/** Organic, slowly morphing colour blobs (positions in % of frame, radius in px @1080). */
export const Blobs: React.FC<{blobs: BlobSpec[]; blur?: number; opacity?: number; speed?: number}> = ({
  blobs,
  blur = 70,
  opacity = 1,
  speed = 1,
}) => {
  const t = useT();
  const {w, h, u} = useLayout();
  return (
    <svg width={w} height={h} style={{position: 'absolute', inset: 0, filter: `blur(${blur * u}px)`, opacity}}>
      {blobs.map((b) => {
        const k = 18;
        const tt = t * 0.25 * speed;
        const drift = (b.drift ?? 60) * u;
        const cx = (b.x / 100) * w + noise2D(b.seed + 'dx', tt * 0.6, 0) * drift;
        const cy = (b.y / 100) * h + noise2D(b.seed + 'dy', 0, tt * 0.6) * drift;
        const pts: [number, number][] = [];
        for (let i = 0; i < k; i++) {
          const a = (i / k) * Math.PI * 2;
          const rr = b.r * u * (1 + (b.wobble ?? 0.28) * noise2D(b.seed, Math.cos(a) * 0.8 + tt, Math.sin(a) * 0.8 + tt));
          pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
        }
        return <path key={b.seed} d={smoothClosed(pts)} fill={b.color} />;
      })}
    </svg>
  );
};

export const PaperBg: React.FC<{blobs?: BlobSpec[]; tint?: string; blobOpacity?: number}> = ({blobs, tint = C.paper, blobOpacity = 0.9}) => (
  <AbsoluteFill style={{background: tint}}>
    {blobs ? <Blobs blobs={blobs} opacity={blobOpacity} /> : null}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)'}} />
  </AbsoluteFill>
);

export const DotGrid: React.FC<{color?: string; gap?: number; size?: number; opacity?: number; drift?: number}> = ({
  color = 'rgba(255,255,255,0.16)',
  gap = 34,
  size = 1.6,
  opacity = 1,
  drift = 0,
}) => {
  const t = useT();
  const {u} = useLayout();
  const g = gap * u;
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `radial-gradient(circle, ${color} ${size * u}px, transparent ${size * u + 0.6}px)`,
        backgroundSize: `${g}px ${g}px`,
        backgroundPosition: `${(t * drift * u) % g}px ${(t * drift * 0.5 * u) % g}px`,
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 85%)',
      }}
    />
  );
};

export const InkBg: React.FC<{glow?: [string, number, number][]; dots?: boolean; base?: string; children?: React.ReactNode}> = ({
  glow = [
    [C.blue, 20, 85],
    [C.violet, 85, 15],
  ],
  dots = true,
  base = C.ink,
  children,
}) => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: base}}>
      {glow.map(([c, x, y], i) => {
        const dx = noise2D('g' + i, t * 0.15, 0) * 6;
        const dy = noise2D('g' + i, 0, t * 0.15) * 6;
        return (
          <AbsoluteFill
            key={i}
            style={{background: `radial-gradient(circle at ${x + dx}% ${y + dy}%, ${c}66 0%, ${c}22 25%, transparent 55%)`}}
          />
        );
      })}
      {dots ? <DotGrid /> : null}
      {children}
    </AbsoluteFill>
  );
};

export const GradientBg: React.FC<{from?: string; to?: string; angle?: number}> = ({from = C.blue, to = C.violet, angle = 120}) => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: `linear-gradient(${angle + Math.sin(t * 0.8) * 10}deg, ${from}, ${to})`}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 45%)'}} />
    </AbsoluteFill>
  );
};

/** Animated film grain + soft vignette on top of everything. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const frame = useCurrentFrame();
  const offs = useMemo(() => {
    // deterministic jitter per frame
    const r = Math.sin(frame * 12.9898) * 43758.5453;
    return [Math.floor((r - Math.floor(r)) * 512), Math.floor(((r * 7.13) % 1) * 512)];
  }, [frame]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('textures/grain.png')})`,
          backgroundSize: '512px 512px',
          backgroundPosition: `${offs[0]}px ${Math.abs(offs[1])}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Full-frame colour flash used on hard cuts. */
export const Flash: React.FC<{at: number; dur?: number; color?: string; max?: number}> = ({at, dur = 0.22, color = '#fff', max = 0.9}) => {
  const t = useT();
  const x = (t - at) / dur;
  if (x < 0 || x > 1) return null;
  return <AbsoluteFill style={{background: color, opacity: max * Math.pow(1 - x, 2), pointerEvents: 'none'}} />;
};

export const PreloadImg: React.FC<{src: string}> = ({src}) => (
  <Img src={staticFile(src)} style={{position: 'absolute', width: 1, height: 1, opacity: 0}} />
);
