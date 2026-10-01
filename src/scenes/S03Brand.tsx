import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {InkBg} from '../components/Backgrounds';
import {H, W, at} from '../components/Text';
import {LogoLockup} from '../components/Logo';
import {Center} from '../components/UI';
import {useLayout, useT} from '../lib/scene';
import {between, ease, mix, prog} from '../lib/anim';

/** LED dot ring with a travelling highlight. */
export const DotRing: React.FC<{r: number; n?: number; t0: number; dot?: number; speed?: number; color?: string}> = ({
  r,
  n = 72,
  t0,
  dot = 9,
  speed = 1,
  color = C.blueLight,
}) => {
  const t = useT();
  const {u} = useLayout();
  return (
    <div style={{position: 'absolute', left: '50%', top: '50%', width: 0, height: 0}}>
      {Array.from({length: n}, (_, i) => {
        const appear = prog(t, t0 + (i / n) * 0.45, 0.25, ease.outCubic);
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const head = ((t - t0) * speed * 0.8) % 1;
        const d = ((i / n - head) % 1 + 1) % 1; // distance behind the head
        const glow = Math.max(0, 1 - d * 3.2);
        const b = 0.18 + glow * 0.82;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: Math.cos(a) * r * u - (dot * u) / 2,
              top: Math.sin(a) * r * u - (dot * u) / 2,
              width: dot * u,
              height: dot * u,
              borderRadius: 2 * u,
              background: glow > 0.5 ? '#fff' : color,
              opacity: b * appear,
              boxShadow: glow > 0.2 ? `0 0 ${14 * u * glow}px ${color}` : 'none',
              transform: `rotate(${(a * 180) / Math.PI}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

// half lockup width minus half mark, in mark units (measured)
const OFF = 1.03;

// "Di Ruber Visual, kami percaya satu hal."
export const S03Brand: React.FC = () => {
  const t = useT();
  const {u, portrait} = useLayout();
  const di = at(2, 'di');
  const visual = at(2, 'visual');
  const kami = at(2, 'kami');
  const mark = 230;
  // the lockup starts centred on the mark and slides so the whole lockup is centred
  const reveal = prog(t, visual - 0.05, 0.7, ease.outExpo);
  const shiftX = mix(mark * OFF, 0, reveal) * u;
  const up = between(t, kami - 0.15, kami + 0.45, ease.inOutCubic);
  const lockScale = mix(1, portrait ? 0.62 : 0.66, up);
  const lockY = mix(0, portrait ? -230 : -170, up) * u;
  const ringOut = 1 - prog(t, visual + 0.05, 0.5, ease.inCubic);
  const ringGrow = prog(t, visual - 0.05, 0.7, ease.outExpo);
  return (
    <AbsoluteFill>
      <InkBg glow={[[C.blue, 25, 80], [C.violet, 80, 20]]} />
      <AbsoluteFill style={{transform: `translateY(${lockY}px)`}}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            opacity: ringOut,
            transform: `translateX(${shiftX - OFF * mark * u * lockScale}px) scale(${mix(1, 1.7, ringGrow)})`,
          }}
        >
          <DotRing r={250} t0={di - 0.25} />
          <DotRing r={300} n={96} t0={di - 0.1} dot={5} speed={-0.6} color={C.violetLight} />
        </div>
        <Center>
          <div style={{transform: `translateX(${shiftX}px) scale(${lockScale})`}}>
            <LogoLockup height={mark} t0={di - 0.05} textDelay={visual - di - 0.05} />
          </div>
        </Center>
      </AbsoluteFill>
      <Center style={{paddingTop: (portrait ? 380 : 330) * u}}>
        <H size={portrait ? 92 : 100} color="#fff">
          <W t={kami} dark>
            kami{' '}
          </W>
          <W t={at(2, 'percaya')} dark>
            percaya{' '}
          </W>
          {portrait ? <br /> : null}
          <W t={at(2, 'satu')} look="serif" style={{fontSize: '1.2em'}}>
            satu{' '}
          </W>
          <W t={at(2, 'hal')} look="serif" style={{fontSize: '1.2em'}}>
            hal.
          </W>
        </H>
      </Center>
    </AbsoluteFill>
  );
};
