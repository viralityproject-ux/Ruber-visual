import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from '../theme';
import {DotGrid, GradientBg, InkBg, PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Center} from '../components/UI';
import {useLayout, useT} from '../lib/scene';
import {bump, ease, mix, prog, shake} from '../lib/anim';

/** Rough single-line fit: font size so `chars` fit into maxW. */
export const fit = (chars: number, maxW: number, base: number, k = 0.6) => Math.min(base, maxW / (chars * k));

const SpeedLines: React.FC<{t0: number; color?: string; n?: number}> = ({t0, color = 'rgba(255,255,255,0.7)', n = 26}) => {
  const t = useT();
  const {w, h, u} = useLayout();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {Array.from({length: n}, (_, i) => {
        const y = ((i * 0.6180339) % 1) * h;
        const len = (180 + ((i * 97) % 300)) * u;
        const speed = (2600 + ((i * 131) % 1800)) * u;
        const x = w + 200 * u - (((t - t0) * speed + i * 377) % (w + len + 400 * u));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: len, height: (2 + (i % 3)) * u, background: color, borderRadius: 9, opacity: 0.25 + (i % 4) * 0.15}} />;
      })}
    </AbsoluteFill>
  );
};

/** Dimension line with end ticks and a centred label, like a CAD measurement. */
const Dimension: React.FC<{t0: number; width: number; label: string}> = ({t0, width, label}) => {
  const t = useT();
  const {u} = useLayout();
  const p = prog(t, t0, 0.55, ease.outExpo);
  const wv = width * p;
  return (
    <div style={{position: 'relative', width, height: 70 * u, margin: '0 auto'}}>
      <div style={{position: 'absolute', left: (width - wv) / 2, width: wv, top: 34 * u, height: 3 * u, background: C.ink}} />
      {[0, 1].map((k) => (
        <div key={k} style={{position: 'absolute', left: k === 0 ? (width - wv) / 2 : (width + wv) / 2 - 3 * u, top: 14 * u, width: 3 * u, height: 42 * u, background: C.ink}} />
      ))}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 16 * u,
          transform: 'translateX(-50%)',
          background: C.paper,
          padding: `0 ${16 * u}px`,
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 34 * u,
          color: C.violet,
          opacity: prog(t, t0 + 0.2, 0.3),
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Ticks: React.FC<{t0: number; width: number}> = ({t0, width}) => {
  const t = useT();
  const {u} = useLayout();
  const n = 41;
  return (
    <div style={{position: 'relative', width, height: 60 * u, margin: '0 auto'}}>
      {Array.from({length: n}, (_, i) => {
        const p = prog(t, t0 + i * 0.008, 0.3, ease.outBack);
        const major = i % 10 === 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: (i / (n - 1)) * width,
              top: 0,
              width: 3 * u,
              height: (major ? 44 : i % 5 === 0 ? 30 : 18) * u * p,
              background: major ? C.violet : C.ink,
              opacity: major ? 1 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
};

const Crosshair: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  const {w, h, u} = useLayout();
  const p = prog(t, t0, 0.5, ease.outExpo);
  const ring = prog(t, t0 + 0.2, 0.5, ease.outBackStrong);
  const R = 300 * u;
  const gap = mix(Math.max(w, h) * 0.5, R * 0.9, p);
  const line = (style: React.CSSProperties) => <div style={{position: 'absolute', background: 'rgba(255,255,255,0.85)', ...style}} />;
  return (
    <AbsoluteFill>
      {line({left: 0, width: w / 2 - gap, top: h / 2 - 1.5 * u, height: 3 * u})}
      {line({right: 0, width: w / 2 - gap, top: h / 2 - 1.5 * u, height: 3 * u})}
      {line({top: 0, height: h / 2 - gap, left: w / 2 - 1.5 * u, width: 3 * u})}
      {line({bottom: 0, height: h / 2 - gap, left: w / 2 - 1.5 * u, width: 3 * u})}
      <div
        style={{
          position: 'absolute',
          left: w / 2 - R * 1.6,
          top: h / 2 - R * 1.6,
          width: R * 3.2,
          height: R * 3.2,
          borderRadius: '50%',
          border: `${3 * u}px solid rgba(255,255,255,0.5)`,
          transform: `scale(${mix(1.6, 1, ring)})`,
          opacity: ring,
        }}
      />
    </AbsoluteFill>
  );
};

// "Kami bergerak cepat, terukur, dan tepat."
export const S05Moves: React.FC = () => {
  const t = useT();
  const {w, u, portrait} = useLayout();
  const cepat = at(4, 'cepat');
  const terukur = at(4, 'terukur');
  const dan = at(4, 'dan');
  const tepat = at(4, 'tepat');
  const beat = t < terukur - 0.02 ? 0 : t < dan - 0.02 ? 1 : 2;
  const sk = shake(t, beat === 0 ? cepat : beat === 1 ? terukur : tepat, 22, 0.35, 'm' + beat);
  const maxW = w * (portrait ? 0.9 : 0.8);
  return (
    <AbsoluteFill>
      {beat === 0 ? (
        <AbsoluteFill>
          <GradientBg from={C.blue} to={C.violet} angle={100} />
          <SpeedLines t0={cepat - 0.5} />
          <Center style={{transform: `translate(${sk.x}px, ${sk.y}px)`}}>
            <Label size={30} color="rgba(255,255,255,0.75)" style={{marginBottom: 20 * u}}>
              <W t={at(4, 'kami')}>kami </W>
              <W t={at(4, 'bergerak')}>bergerak →</W>
            </Label>
            <H size={fit(6, maxW, 340, 0.62)} color="#fff" style={{fontStyle: 'italic'}}>
              <span
                style={{
                  display: 'inline-block',
                  transform: `translateX(${mix(110, 0, prog(t, cepat, 0.32, ease.outExpo))}vw) skewX(${mix(-30, -8, prog(t, cepat, 0.5, ease.outBack))}deg)`,
                  filter: t < cepat + 0.2 ? 'url(#mbx4)' : undefined,
                  opacity: t < cepat ? 0 : 1,
                }}
              >
                cepat,
              </span>
            </H>
          </Center>
        </AbsoluteFill>
      ) : null}
      {beat === 1 ? (
        <AbsoluteFill>
          <PaperBg />
          <DotGrid color="rgba(7,7,15,0.18)" gap={40} />
          <Center style={{transform: `translate(${sk.x}px, ${sk.y}px) scale(${1 + bump(t, terukur, 0.3) * 0.05})`}}>
            <Dimension t0={terukur + 0.1} width={Math.min(maxW, 1150 * u)} label="100% terukur" />
            <H size={fit(8, maxW, 300, 0.6)}>
              <W t={terukur} dur={0.35}>
                terukur,
              </W>
            </H>
            <Ticks t0={terukur + 0.05} width={Math.min(maxW, 1150 * u)} />
          </Center>
        </AbsoluteFill>
      ) : null}
      {beat === 2 ? (
        <AbsoluteFill>
          <InkBg glow={[[C.violet, 50, 50], [C.blue, 10, 90]]} />
          <Crosshair t0={tepat - 0.1} />
          <Center style={{transform: `translate(${sk.x}px, ${sk.y}px) scale(${1 + bump(t, tepat, 0.3) * 0.06})`}}>
            <Label size={30} color="rgba(255,255,255,0.6)" style={{marginBottom: 10 * u}}>
              <W t={dan}>dan</W>
            </Label>
            <H size={fit(6, maxW, 320, 0.6)} color="#fff">
              <W t={tepat} dur={0.3} look="grad">
                tepat.
              </W>
            </H>
            <Label size={26} color={C.violetLight} style={{marginTop: 20 * u, opacity: prog(t, tepat + 0.35, 0.3)}}>
              ● on target
            </Label>
          </Center>
        </AbsoluteFill>
      ) : null}
      {/* frame flicker on each beat */}
      {[terukur, tepat].map((b, i) => {
        const x = (t - b) / 0.12;
        return x > 0 && x < 1 ? <AbsoluteFill key={i} style={{background: '#fff', opacity: (1 - x) * 0.85}} /> : null;
      })}
    </AbsoluteFill>
  );
};
