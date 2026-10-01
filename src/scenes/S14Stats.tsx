import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {DotGrid, InkBg} from '../components/Backgrounds';
import {H, Label, W, at, lookStyle} from '../components/Text';
import {Media} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {between, bump, clamp01, ease, mix, n2, prog, shake} from '../lib/anim';

const AVATARS = [
  'photos/street-boy-bag.jpg',
  'photos/fashion-girl-pink.jpg',
  'photos/street-jump.jpg',
  'photos/fashion-hijab-orange.jpg',
  'photos/street-duo-02.jpg',
  'photos/fashion-man-sneakers.jpg',
  'photos/fashion-girl-phones.jpg',
  'photos/street-girl-sit.jpg',
  'photos/fashion-hijab-purple.jpg',
  'photos/fashion-trio.jpg',
  'photos/street-boy-lowangle.jpg',
  'photos/fashion-hijab-vest.jpg',
  'photos/street-girl-selfie.jpg',
  'photos/fashion-duo-wide.jpg',
  'photos/fashion-hijab-cap.jpg',
];

/** Growth chart line drawn across the background. */
const Growth: React.FC<{t0: number; t1: number}> = ({t0, t1}) => {
  const t = useT();
  const {w, h, u} = useLayout();
  const p = between(t, t0, t1, ease.inOutCubic);
  const N = 60;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const s = i / (N - 1);
    const y = h * 0.92 - Math.pow(s, 2.6) * h * 0.7 + n2('gr', s * 8) * 26 * u * (1 - s);
    pts.push([w * 0.02 + s * w * 0.96, y]);
  }
  const d = pts.map((q, i) => `${i ? 'L' : 'M'} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
  const area = `${d} L ${pts[N - 1][0]} ${h} L ${pts[0][0]} ${h} Z`;
  const head = pts[Math.min(N - 1, Math.floor(p * (N - 1)))];
  return (
    <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="grLine" x1="0" x2="1">
          <stop offset="0" stopColor={C.blue} />
          <stop offset="1" stopColor={C.violetLight} />
        </linearGradient>
        <linearGradient id="grArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={C.violet} stopOpacity={0.35} />
          <stop offset="1" stopColor={C.violet} stopOpacity={0} />
        </linearGradient>
        <clipPath id="grClip">
          <rect x={0} y={0} width={w * 0.02 + p * w * 0.96} height={h} />
        </clipPath>
      </defs>
      <path d={area} fill="url(#grArea)" clipPath="url(#grClip)" />
      <path d={d} fill="none" stroke="url(#grLine)" strokeWidth={6 * u} clipPath="url(#grClip)" strokeLinejoin="round" />
      {p > 0 && p < 1 ? <circle cx={head[0]} cy={head[1]} r={14 * u} fill="#fff" stroke={C.violet} strokeWidth={6 * u} /> : null}
    </svg>
  );
};

/** Hearts / comments floating up after t0. */
const Burst: React.FC<{t0: number; n?: number}> = ({t0, n = 22}) => {
  const t = useT();
  const {w, h, u} = useLayout();
  if (t < t0) return null;
  return (
    <AbsoluteFill>
      {Array.from({length: n}, (_, i) => {
        const st = t0 + (i % 11) * 0.09;
        const life = (t - st) / 1.8;
        if (life <= 0 || life >= 1) return null;
        const x = w * (0.08 + ((i * 0.61803) % 1) * 0.84) + n2('bx' + i, t) * 30 * u;
        const y = h * 1.02 - life * h * (0.55 + (i % 5) * 0.08);
        const icon = ['heart', 'comment', 'share', 'heart'][i % 4];
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, opacity: Math.sin(life * Math.PI), transform: `scale(${0.6 + (i % 3) * 0.3})`}}>
            <div style={{width: 64 * u, height: 64 * u, borderRadius: '50%', background: i % 2 ? GRAD : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon name={icon} size={32 * u} color="#fff" fill={icon === 'heart' ? '#fff' : 'none'} stroke={2} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// "Lebih dari 15 media dan proxy account telah kami kembangkan dengan total engagement lebih dari 100 juta."
export const S14Stats: React.FC = () => {
  const t = useT();
  const {w, u, portrait} = useLayout();
  const lebih = at(16, 'lebih');
  const n15 = at(16, '15');
  const media = at(16, 'media');
  const kembangkan = at(16, 'kembangkan');
  const dengan = at(16, 'dengan');
  const engagement = at(16, 'engagement');
  const n100 = at(16, '100');
  const juta = at(16, 'juta');
  const phaseB = t >= dengan - 0.1;
  const outA = between(t, dengan - 0.35, dengan - 0.05, ease.inCubic);
  const count15 = Math.round(mix(0, 15, prog(t, n15 - 0.2, 0.6, ease.outQuart)));
  const big = clamp01((t - (dengan + 0.1)) / (n100 + 0.05 - (dengan + 0.1)));
  const value = Math.round(Math.pow(ease.inOutCubic(big), 1.6) * 100_000_000);
  const valueStr = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const sk = shake(t, juta, 26, 0.45);
  const stamp = prog(t, juta, 0.4, ease.outBackStrong);
  const tile = (portrait ? 150 : 128) * u;
  return (
    <AbsoluteFill>
      <InkBg glow={[[C.blue, 10, 20], [C.violet, 90, 80]]} dots={false} />
      <DotGrid gap={44} />
      {!phaseB ? (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: portrait ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: (portrait ? 40 : 110) * u,
            opacity: 1 - outA,
            transform: `scale(${mix(1, 1.3, outA)})`,
            filter: outA > 0 ? `blur(${outA * 20}px)` : undefined,
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', alignItems: portrait ? 'center' : 'flex-start'}}>
            <Label size={34} color={C.violetLight}>
              <W t={lebih}>lebih </W>
              <W t={at(16, 'dari')}>dari</W>
            </Label>
            <div
              style={{
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: (portrait ? 330 : 380) * u,
                letterSpacing: '-0.06em',
                lineHeight: 0.9,
                color: '#fff',
                opacity: prog(t, n15 - 0.25, 0.2),
                transform: `scale(${1 + bump(t, n15 + 0.35, 0.35) * 0.08})`,
              }}
            >
              <span style={{fontVariantNumeric: 'tabular-nums'}}>{count15}</span>
              <span style={lookStyle('grad', true)}>+</span>
            </div>
            <H size={portrait ? 60 : 64} color="#fff" weight={700} align={portrait ? 'center' : 'left'} ls="-0.03em">
              <W t={media} dark>
                media{' '}
              </W>
              <W t={at(16, 'dan')} dark style={{color: 'rgba(255,255,255,0.5)'}}>
                &amp;{' '}
              </W>
              <br />
              <W t={at(16, 'proxy')} look="grad">
                proxy{' '}
              </W>
              <W t={at(16, 'account')} look="grad">
                account
              </W>
            </H>
            <Label size={26} color="rgba(255,255,255,0.6)" style={{marginTop: 22 * u}}>
              <W t={at(16, 'telah')}>telah </W>
              <W t={at(16, 'kami')}>kami </W>
              <W t={kembangkan} style={{color: '#fff'}}>
                kembangkan ↗
              </W>
            </Label>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: `repeat(5, ${tile}px)`, gap: 22 * u}}>
            {AVATARS.map((src, i) => {
              const p = prog(t, media - 0.2 + i * 0.06, 0.45, ease.outBackStrong);
              const grow = prog(t, kembangkan + (i % 5) * 0.04 + Math.floor(i / 5) * 0.06, 0.6, ease.outExpo);
              return (
                <div key={src} style={{position: 'relative', width: tile, height: tile, transform: `scale(${p})`}}>
                  <div style={{width: tile, height: tile, borderRadius: '50%', padding: 5 * u, boxSizing: 'border-box', background: GRAD}}>
                    <div style={{width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', border: `${4 * u}px solid ${C.ink}`, boxSizing: 'border-box'}}>
                      <Media src={src} pos="50% 25%" />
                    </div>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      right: -8 * u,
                      bottom: -6 * u,
                      padding: `${4 * u}px ${10 * u}px`,
                      borderRadius: 999,
                      background: '#fff',
                      fontFamily: F.mono,
                      fontWeight: 700,
                      fontSize: 18 * u,
                      color: C.violet,
                      transform: `scale(${grow})`,
                    }}
                  >
                    ↗{Math.round(grow * (20 + ((i * 37) % 70)))}K
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{transform: `translate(${sk.x}px, ${sk.y}px)`}}>
          <Growth t0={dengan} t1={n100 + 0.2} />
          <Burst t0={n100 - 0.2} />
          <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Label size={32} color="rgba(255,255,255,0.7)">
              <W t={dengan}>dengan </W>
              <W t={at(16, 'total')}>total </W>
              <W t={engagement} style={{color: '#fff'}}>
                engagement
              </W>
            </Label>
            <div
              style={{
                marginTop: 20 * u,
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: Math.min(250, (w * 0.9) / (12 * 0.62 * u)) * u,
                letterSpacing: '-0.05em',
                lineHeight: 1,
                color: '#fff',
                fontVariantNumeric: 'tabular-nums',
                opacity: prog(t, dengan + 0.05, 0.3),
                transform: `scale(${mix(1, 0.86, stamp)}) translateY(${mix(0, -30, stamp) * u}px)`,
              }}
            >
              {valueStr}
              <span style={lookStyle('grad', true)}>+</span>
            </div>
            <div style={{height: 0, overflow: 'visible', display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
              <div
                style={{
                  marginTop: 10 * u,
                  padding: `${14 * u}px ${46 * u}px`,
                  borderRadius: 24 * u,
                  background: GRAD,
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 120 * u,
                  letterSpacing: '-0.04em',
                  color: '#fff',
                  transform: `scale(${mix(2.4, 1, stamp)}) rotate(${mix(-14, -4, stamp)}deg)`,
                  opacity: stamp > 0 ? 1 : 0,
                  boxShadow: `0 ${30 * u}px ${80 * u}px rgba(91,60,255,0.6)`,
                  whiteSpace: 'nowrap',
                }}
              >
                <W t={at(16, 'lebih', 1)} dark style={{fontSize: '0.4em', verticalAlign: 'middle', opacity: 0.85, marginRight: '0.6em', letterSpacing: '-0.01em'}}>
                  lebih dari
                </W>
                100 JUTA
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
