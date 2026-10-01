import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {InkBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Media} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {between, bump, ease, mix, n2, prog, shake} from '../lib/anim';
import {smoothOpen} from './S06Process';

const PEOPLE = [
  ['photos/street-boy-bag.jpg', '50% 22%'],
  ['photos/fashion-hijab-orange.jpg', '50% 25%'],
  ['photos/fashion-man-sneakers.jpg', '40% 25%'],
  ['photos/fashion-girl-pink.jpg', '50% 30%'],
  ['photos/street-girl-portrait.jpg', '50% 22%'],
  ['photos/fashion-hijab-vest.jpg', '50% 22%'],
  ['photos/street-boy-lowangle.jpg', '50% 20%'],
  ['photos/fashion-hijab-cap.jpg', '50% 28%'],
];

/** A scribble that scrawls over a word (for "complicated"). */
const Scribble: React.FC<{t0: number; t1: number; w: number; h: number}> = ({t0, t1, w, h}) => {
  const t = useT();
  const p = between(t, t0, t1, ease.inOutCubic);
  const pts: [number, number][] = [];
  const N = 70;
  for (let i = 0; i < N; i++) {
    const s = i / (N - 1);
    pts.push([s * w + Math.sin(s * 40) * w * 0.05, h * 0.5 + Math.cos(s * 33) * h * 0.32 + n2('sc', s * 6) * h * 0.12]);
  }
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={smoothOpen(pts)} fill="none" stroke={C.violetLight} strokeWidth={h * 0.06} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.9} />
    </svg>
  );
};

// "Great work doesn't need complicated processes. It needs the right preparation and the right people."
export const S19GreatWork: React.FC = () => {
  const t = useT();
  const {u, portrait} = useLayout();
  const great = at(22, 'great');
  const complicated = at(22, 'complicated');
  const processes = at(22, 'processes');
  const it = at(22, 'it');
  const prep = at(22, 'preparation');
  const and = at(22, 'and');
  const people = at(22, 'people');
  const phaseB = t >= it - 0.25;
  const outA = between(t, it - 0.45, it - 0.25, ease.inCubic);
  const sk = shake(t, great, 20, 0.35, 'gw');
  const big = portrait ? 170 : 230;
  const tile = (portrait ? 220 : 190) * u;
  return (
    <AbsoluteFill>
      <InkBg glow={[[C.blue, 50, 0], [C.violet, 50, 100]]} />
      {!phaseB ? (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translate(${sk.x}px, ${sk.y}px) scale(${mix(1, 0.8, outA)})`,
            opacity: 1 - outA,
            filter: outA > 0 ? `blur(${outA * 20}px)` : undefined,
          }}
        >
          <H size={big} color="#fff" lh={0.95}>
            <W t={great} dark>
              Great{' '}
            </W>
            {portrait ? <br /> : null}
            <W t={at(22, 'work')} dark look="grad">
              work
            </W>
          </H>
          <H size={portrait ? 80 : 90} color="rgba(255,255,255,0.55)" weight={700} ls="-0.03em" style={{marginTop: 20 * u}}>
            <W t={at(22, 'doesn')} dark>
              doesn&apos;t{' '}
            </W>
            <W t={at(22, 'need')} dark>
              need
            </W>
          </H>
          <H size={portrait ? 92 : 104} color="#fff" style={{marginTop: 6 * u}}>
            <span style={{position: 'relative', display: 'inline-block'}}>
              <W t={complicated} dark>
                complicated
              </W>
              <Scribble t0={complicated + 0.1} t1={processes + 0.4} w={(portrait ? 92 : 104) * 6.2 * u} h={(portrait ? 92 : 104) * 1.1 * u} />
            </span>{' '}
            {portrait ? <br /> : null}
            <W t={processes} dark>
              processes.
            </W>
          </H>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: portrait ? 'flex-start' : 'center', paddingTop: portrait ? 300 * u : 0}}>
          <div style={{transform: `translateY(${portrait ? 0 : -110 * u}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Label size={32} color={C.violetLight}>
              <W t={it}>it </W>
              <W t={at(22, 'needs')}>needs</W>
            </Label>
            <H size={portrait ? 92 : 108} color="#fff" style={{marginTop: 14 * u}}>
              <W t={at(22, 'the')} dark>
                the{' '}
              </W>
              <W t={at(22, 'right')} dark>
                right{' '}
              </W>
              {portrait ? <br /> : null}
              <span style={{position: 'relative', display: 'inline-block'}}>
                <W t={prep} look="grad">
                  preparation
                </W>
                <span style={{position: 'absolute', right: -70 * u, top: -20 * u, transform: `scale(${prog(t, prep + 0.3, 0.4, ease.outBackStrong)})`}}>
                  <Icon name="check" size={60 * u} color={C.violetLight} stroke={3} draw={prep + 0.3} />
                </span>
              </span>
            </H>
            <H size={portrait ? 92 : 108} color="#fff" style={{marginTop: 4 * u}}>
              <W t={and} dark style={{color: 'rgba(255,255,255,0.55)'}}>
                and{' '}
              </W>
              <W t={at(22, 'the', 1)} dark>
                the{' '}
              </W>
              <W t={at(22, 'right', 1)} dark>
                right{' '}
              </W>
              {portrait ? <br /> : null}
              <W t={people} look="serif" style={{fontSize: '1.3em'}}>
                people.
              </W>
            </H>
          </div>
          {/* people strip */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: (portrait ? 170 : 70) * u,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 18 * u,
              padding: `0 ${portrait ? 60 * u : 0}px`,
            }}
          >
            {PEOPLE.map(([src, pos], i) => {
              const p = prog(t, and - 0.1 + i * 0.09, 0.5, ease.outBackStrong);
              const lift = bump(t, people + i * 0.03, 0.4);
              return (
                <div
                  key={src}
                  style={{
                    width: tile,
                    height: tile * 1.2,
                    borderRadius: 26 * u,
                    overflow: 'hidden',
                    border: `${3 * u}px solid rgba(255,255,255,0.25)`,
                    transform: `translateY(${mix(120, 0, p) - lift * 24 * u}px) rotate(${(i % 2 ? 1 : -1) * mix(10, 2, p)}deg) scale(${p})`,
                    boxShadow: `0 ${24 * u}px ${50 * u}px rgba(0,0,0,0.5)`,
                  }}
                >
                  <Media src={src} pos={pos} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

