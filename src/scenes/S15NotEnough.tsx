import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Center, Media} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {between, bump, ease, mix, n2, prog, shake} from '../lib/anim';

const Stars: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  const {u} = useLayout();
  return (
    <div style={{display: 'flex', gap: 6 * u}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const p = prog(t, t0 + i * 0.07, 0.4, ease.outBackStrong);
        return (
          <svg key={i} width={34 * u} height={34 * u} viewBox="0 0 24 24" style={{transform: `scale(${p}) rotate(${mix(-90, 0, p)}deg)`}}>
            <path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z" fill={C.violet} />
          </svg>
        );
      })}
    </div>
  );
};

/** Photo with an RGB-split + slice glitch between g0 and g1, desaturating afterwards. */
const GlitchPhoto: React.FC<{src: string; g0: number; g1: number; w: number; h: number}> = ({src, g0, g1, w, h}) => {
  const t = useT();
  const {u} = useLayout();
  const on = t >= g0 && t <= g1;
  const after = prog(t, g0, 0.6, ease.outCubic);
  const amp = on ? 1 : 0;
  const slices = 7;
  return (
    <div style={{position: 'relative', width: w, height: h, borderRadius: 36 * u, overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', inset: 0, filter: `grayscale(${after}) brightness(${mix(1, 0.75, after)}) contrast(${mix(1, 1.1, after)})`}}>
        <Media src={src} pos="50% 35%" />
      </div>
      {amp
        ? Array.from({length: slices}, (_, i) => {
            const y0 = (i / slices) * 100;
            const off = n2('gl' + i, Math.floor(t * 24)) * 70 * u;
            return (
              <div key={i} style={{position: 'absolute', inset: 0, clipPath: `inset(${y0}% 0 ${100 - y0 - 100 / slices}% 0)`, transform: `translateX(${off}px)`}}>
                <Media src={src} pos="50% 35%" style={{filter: 'grayscale(0.4)'}} />
              </div>
            );
          })
        : null}
      {amp ? (
        <>
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${14 * u}px)`, mixBlendMode: 'screen', opacity: 0.55, background: C.blue}} />
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${-14 * u}px)`, mixBlendMode: 'multiply', opacity: 0.4, background: C.violet}} />
        </>
      ) : null}
    </div>
  );
};

// "Pengalaman itu membuat kami memahami satu hal." + "Visual yang bagus saja tidak cukup."
export const S15NotEnough: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const peng = at(17, 'pengalaman');
  const satu = at(17, 'satu');
  const visual = at(18, 'visual');
  const bagus = at(18, 'bagus');
  const tidak = at(18, 'tidak');
  const cukup = at(18, 'cukup');
  const phaseB = t >= visual - 0.3;
  const outA = between(t, visual - 0.5, visual - 0.3, ease.inCubic);
  const sk = shake(t, tidak, 26, 0.45, 'nc');
  const sk2 = shake(t, cukup, 18, 0.35, 'nc2');
  const photoW = (portrait ? 620 : 520) * u;
  const photoH = photoW * 1.4;
  const drop = between(t, tidak, tidak + 0.6, ease.outCubic);
  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 15, y: 15, r: 340, color: C.blue, seed: 'q'},
          {x: 85, y: 85, r: 380, color: C.violet, seed: 'r'},
        ]}
        blobOpacity={phaseB ? mix(0.7, 0.15, drop) : 0.7}
      />
      {!phaseB || outA < 1 ? (
        <Center style={{opacity: 1 - outA, transform: `translateY(${-outA * 120}px)`, filter: outA > 0 ? `blur(${outA * 16}px)` : undefined}}>
          <H size={portrait ? 120 : 140}>
            <W t={peng}>Pengalaman </W>
            {portrait ? <br /> : null}
            <W t={at(17, 'itu')}>itu</W>
          </H>
          <H size={portrait ? 64 : 70} weight={700} color={C.muted} ls="-0.03em" style={{marginTop: 14 * u}}>
            <W t={at(17, 'membuat')}>membuat </W>
            <W t={at(17, 'kami')}>kami </W>
            <W t={at(17, 'memahami')} style={{color: C.ink}}>
              memahami
            </W>
          </H>
          <H size={portrait ? 200 : 220} style={{marginTop: -6 * u}}>
            <W t={satu} look="serif" style={{transform: `scale(${1 + bump(t, satu + 0.1, 0.4) * 0.06})`}}>
              satu{' '}
            </W>
            <W t={at(17, 'hal')} look="serif">
              hal.
            </W>
          </H>
        </Center>
      ) : null}
      {phaseB ? (
        <AbsoluteFill style={{transform: `translate(${sk.x}px, ${sk.y}px)`}}>
          {/* photo */}
          <div
            style={{
              position: 'absolute',
              left: portrait ? (w - photoW) / 2 : w * 0.66 - photoW / 2,
              top: portrait ? h * 0.36 : (h - photoH) / 2,
              transform: `rotate(${mix(4, -3, prog(t, visual, 0.8, ease.outExpo))}deg) scale(${prog(t, visual - 0.2, 0.6, ease.outBackStrong) * mix(1, 0.88, drop)})`,
              boxShadow: `0 ${40 * u}px ${80 * u}px rgba(40,30,110,0.25)`,
              borderRadius: 36 * u,
            }}
          >
            <GlitchPhoto src="photos/fashion-hijab-glasses.jpg" g0={tidak - 0.05} g1={tidak + 0.3} w={photoW} h={photoH} />
            <div
              style={{
                position: 'absolute',
                left: -40 * u,
                top: 60 * u,
                padding: `${14 * u}px ${24 * u}px`,
                borderRadius: 20 * u,
                background: '#fff',
                boxShadow: `0 ${20 * u}px ${40 * u}px rgba(40,30,110,0.2)`,
                transform: `scale(${prog(t, bagus, 0.45, ease.outBackStrong)}) rotate(-6deg)`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8 * u,
              }}
            >
              <Stars t0={bagus + 0.05} />
              <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20 * u, color: C.ink, letterSpacing: '0.08em'}}>AESTHETIC 10/10</span>
            </div>
            <div style={{position: 'absolute', right: -30 * u, bottom: 80 * u, transform: `scale(${prog(t, bagus + 0.2, 0.5, ease.outBackStrong)})`}}>
              <Icon name="sparkle" size={90 * u} color={C.violet} fill={C.violet} stroke={1} />
            </div>
          </div>
          {/* copy */}
          <div
            style={{
              position: 'absolute',
              left: portrait ? 0 : w * 0.07,
              right: portrait ? 0 : undefined,
              top: portrait ? h * 0.1 : 0,
              bottom: portrait ? undefined : 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: portrait ? 'center' : 'flex-start',
              opacity: mix(1, 0.1, drop),
              filter: drop > 0 ? `blur(${drop * 8}px)` : undefined,
            }}
          >
            <H size={portrait ? 110 : 120} align={portrait ? 'center' : 'left'}>
              <W t={visual}>Visual </W>
              <br />
              <W t={at(18, 'yang')} style={{color: C.muted}}>
                yang{' '}
              </W>
              <W t={bagus} look="grad">
                bagus
              </W>
              <br />
              <W t={at(18, 'saja')}>saja...</W>
            </H>
          </div>
          {/* the slam */}
          <Center style={{transform: `translate(${sk2.x}px, ${sk2.y}px)`}}>
            <div
              style={{
                opacity: t >= tidak ? 1 : 0,
                transform: `scale(${mix(2.2, 1, prog(t, tidak, 0.3, ease.outExpo))})`,
                padding: `${10 * u}px ${(portrait ? 40 : 50) * u}px ${24 * u}px`,
                background: C.ink,
                borderRadius: 30 * u,
                boxShadow: `0 ${40 * u}px ${100 * u}px rgba(7,7,15,0.45)`,
                marginTop: portrait ? 560 * u : 0,
              }}
            >
              <H size={portrait ? 118 : 190} color="#fff">
                <span>tidak </span>
                <span style={{display: 'inline-block', opacity: t >= cukup ? 1 : 0.15, transform: `scale(${mix(1.4, 1, prog(t, cukup, 0.25, ease.outExpo))})`}}>
                  cukup.
                </span>
              </H>
              <div style={{height: 10 * u, borderRadius: 9, background: `linear-gradient(90deg, ${C.blue}, ${C.violet})`, width: `${prog(t, cukup + 0.05, 0.35, ease.outQuart) * 100}%`, marginTop: 6 * u}} />
            </div>
          </Center>
          <Label size={22} color={C.ink} style={{position: 'absolute', left: 0, right: 0, bottom: 50 * u, textAlign: 'center', opacity: prog(t, cukup + 0.3, 0.4)}}>
            visual ≠ pesan
          </Label>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
