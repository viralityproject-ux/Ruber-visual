import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {RuberLockup, RuberMark, RuberWordmark} from '../components/RuberLogo';
import {W, at} from '../components/Text';
import {useT} from '../lib/scene';
import {bump, ease, mix, prog} from '../lib/anim';

const SIZE = 300; // mark height
const K = SIZE / 455;
const LW = 530 * K;
const LH = 617 * K;
const LX = 960 - LW / 2;
const LY = 455 - LH / 2;

// "Ruber Visual. Built to make every story exceptional."
export const A12Outro: React.FC = () => {
  const t = useT();
  const ruber = at(53, 'ruber');
  const exceptional = at(54, 'exceptional');
  const words = ['built', 'to', 'make', 'every', 'story'].map((w) => ({w: w === 'built' ? 'Built' : w, t: at(54, w)}));
  const t0 = ruber - 0.33; // the dot appears just before the name is said
  const settle = prog(t, 130.6, 4.2, ease.outCubic);
  const shine = prog(t, 133.75, 0.7, ease.inOutCubic);
  const swoosh = prog(t, exceptional + 0.45, 0.45, ease.inOutCubic);

  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 15, y: 20, r: 340, color: C.blueSoft, seed: 'o1'},
          {x: 85, y: 80, r: 380, color: C.violetSoft, seed: 'o2'},
        ]}
        fadeFrom={129.65}
      />
      <AbsoluteFill style={{transform: `scale(${mix(0.97, 1.02, settle)})`, transformOrigin: '960px 540px'}}>
        <div style={{position: 'absolute', left: LX, top: LY}}>
          <RuberLockup size={SIZE} color={C.ink} t0={t0} wordDelay={0.48} />
        </div>
        {/* a light sweep across the lockup on the last beat */}
        {shine > 0 && shine < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: LX,
              top: LY,
              width: LW,
              height: LH,
              clipPath: `polygon(${mix(-200, LW + 200, shine)}px 0, ${mix(-200, LW + 200, shine) + 110}px 0, ${mix(-200, LW + 200, shine) + 10}px 100%, ${mix(-200, LW + 200, shine) - 100}px 100%)`,
            }}
          >
            <div style={{position: 'absolute', left: 39 * K, top: 0}}>
              <RuberMark size={SIZE} color={C.violetMid} />
            </div>
            <div style={{position: 'absolute', left: 0, top: 537 * K}}>
              <RuberWordmark height={80 * K} color={C.violetMid} />
            </div>
          </div>
        ) : null}
        {/* tagline */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 770, display: 'flex', justifyContent: 'center', alignItems: 'baseline', fontFamily: F.display, fontWeight: 800, fontSize: 66, letterSpacing: '-0.035em', color: C.ink, whiteSpace: 'nowrap'}}>
          {words.map(({w, t: tw}) => (
            <W key={w} t={tw}>
              {w}{' '}
            </W>
          ))}
          <span style={{position: 'relative', display: 'inline-block', marginLeft: '0.18em', transform: `scale(${1 + bump(t, exceptional + 0.1, 0.4) * 0.05})`}}>
            <W t={exceptional} look="serif" style={{fontSize: '1.3em'}}>
              exceptional.
            </W>
            <svg width={400} height={30} viewBox="0 0 420 30" style={{position: 'absolute', left: 6, bottom: -26, overflow: 'visible'}}>
              <defs>
                <linearGradient id="tagSwoosh" x1="0" x2="1">
                  <stop offset="0" stopColor={C.blueMid} />
                  <stop offset="1" stopColor={C.violetMid} />
                </linearGradient>
              </defs>
              <path d="M4 20 C 120 6, 280 4, 414 14" fill="none" stroke="url(#tagSwoosh)" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - swoosh} />
            </svg>
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
