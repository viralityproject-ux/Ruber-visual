import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from '../theme';
import {Blobs, InkBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {LogoLockup} from '../components/Logo';
import {Center} from '../components/UI';
import {DotRing} from './S03Brand';
import {useLayout, useT} from '../lib/scene';
import {ease, mix, prog} from '../lib/anim';

/** "move." with a motion trail that resolves into the word. */
const MoveWord: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  const p = prog(t, t0 - 0.05, 0.6, ease.outExpo);
  const trail = 5;
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      {Array.from({length: trail}, (_, i) => {
        const k = (i + 1) / trail;
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              fontFamily: '"Instrument", serif',
              fontStyle: 'italic',
              fontWeight: 400,
              color: C.violetLight,
              opacity: (1 - p) * 0.5 * (1 - k) * (t >= t0 - 0.05 ? 1 : 0),
              transform: `translateX(${-(1 - p) * k * 1.6}em)`,
              filter: `blur(${k * 6}px)`,
              whiteSpace: 'pre',
            }}
          >
            move.
          </span>
        );
      })}
      <span
        style={{
          display: 'inline-block',
          fontFamily: '"Instrument", serif',
          fontStyle: 'italic',
          fontWeight: 400,
          backgroundImage: `linear-gradient(100deg, ${C.blueLight}, ${C.violetLight})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          paddingRight: '0.1em',
          opacity: prog(t, t0 - 0.05, 0.15),
          transform: `translateX(${mix(-1.2, 0, p)}em) skewX(${mix(-20, 0, p)}deg)`,
          whiteSpace: 'pre',
        }}
      >
        move.
      </span>
    </span>
  );
};

// "Ruber Visual, creative production made to move."
export const S20Outro: React.FC = () => {
  const t = useT();
  const {u, portrait} = useLayout();
  const ruber = at(23, 'ruber');
  const creative = at(23, 'creative');
  const move = at(23, 'move');
  const lift = prog(t, creative - 0.2, 0.7, ease.inOutCubic);
  const fadeOut = prog(t, 108.3, 0.7, ease.inCubic);
  const mark = portrait ? 200 : 210;
  return (
    <AbsoluteFill>
      <InkBg glow={[[C.blue, 20, 80], [C.violet, 80, 20]]} />
      <Blobs
        blobs={[
          {x: 15, y: 85, r: 360, color: C.blue, seed: 'oa'},
          {x: 85, y: 15, r: 360, color: C.violet, seed: 'ob'},
        ]}
        opacity={0.35}
        blur={110}
      />
      <Center style={{transform: `translateY(${mix(0, portrait ? -170 : -120, lift) * u}px)`}}>
        <div style={{position: 'absolute', left: '50%', top: '50%', opacity: mix(1, 0.35, lift)}}>
          <DotRing r={portrait ? 430 : 420} n={110} t0={ruber - 0.3} dot={7} speed={0.6} />
          <DotRing r={portrait ? 480 : 470} n={140} t0={ruber - 0.15} dot={4} speed={-0.45} color={C.violetLight} />
        </div>
        <LogoLockup height={mark} t0={ruber - 0.15} textDelay={0.35} />
      </Center>
      <Center style={{paddingTop: (portrait ? 420 : 330) * u}}>
        <H size={portrait ? 74 : 78} color="#fff" weight={700} ls="-0.035em">
          <W t={creative} dark>
            creative{' '}
          </W>
          <W t={at(23, 'production')} dark>
            production
          </W>
        </H>
        <H size={portrait ? 130 : 140} color="#fff" style={{marginTop: 4 * u}}>
          <W t={at(23, 'made')} dark>
            made{' '}
          </W>
          <W t={at(23, 'to')} dark>
            to{' '}
          </W>
          <MoveWord t0={move} />
        </H>
      </Center>
      <Label
        size={22}
        color="rgba(255,255,255,0.45)"
        style={{position: 'absolute', left: 0, right: 0, bottom: (portrait ? 120 : 56) * u, textAlign: 'center', opacity: prog(t, move + 0.6, 0.6), fontFamily: F.mono}}
      >
        creative production partner
      </Label>
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
