import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
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

// "Ruber Visual. Cepat, tepat, akurat."
export const A12Outro: React.FC = () => {
  const t = useT();
  const ruber = at(53, 'ruber');
  const cepat = at(53, 'cepat');
  const tepat = at(54, 'tepat');
  const akurat = at(54, 'akurat');
  const t0 = ruber - 0.08;
  const settle = prog(t, 130.6, 4.2, ease.outCubic);
  const shine = prog(t, 133.4, 0.7, ease.inOutCubic);

  const word = (text: string, tw: number, look: 'plain' | 'grad' | 'serif') => (
    <W t={tw} look={look === 'plain' ? 'plain' : look} style={look === 'serif' ? {fontSize: '1.14em'} : undefined}>
      {text}
    </W>
  );

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
        <div style={{position: 'absolute', left: 0, right: 0, top: 790, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, fontFamily: F.display, fontWeight: 800, fontSize: 64, letterSpacing: '-0.035em', color: C.ink}}>
          {word('cepat', cepat, 'plain')}
          <div style={{width: 14, height: 14, borderRadius: 7, background: GRAD, transform: `scale(${prog(t, tepat - 0.1, 0.35, ease.outBackStrong) * (1 + bump(t, tepat, 0.3) * 0.4)})`}} />
          {word('tepat', tepat, 'grad')}
          <div style={{width: 14, height: 14, borderRadius: 7, background: GRAD, transform: `scale(${prog(t, akurat - 0.1, 0.35, ease.outBackStrong) * (1 + bump(t, akurat, 0.3) * 0.4)})`}} />
          {word('akurat.', akurat, 'serif')}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
