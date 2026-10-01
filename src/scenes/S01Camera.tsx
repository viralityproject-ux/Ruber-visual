import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, W, at} from '../components/Text';
import {Brackets} from '../components/UI';
import {useLayout, useT} from '../lib/scene';
import {bump, ease, mix, prog} from '../lib/anim';

// "Semua orang bisa menyalakan kamera,"
export const S01Camera: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const rec = at(0, 'menyalakan');
  const cam = at(0, 'kamera');
  const vfW = portrait ? w * 0.86 : w * 0.74;
  const vfH = portrait ? h * 0.52 : h * 0.66;
  const vfIn = prog(t, 0, 0.6, ease.outExpo);
  const push = mix(1.0, 1.06, prog(t, 0, 3, ease.linear)) + bump(t, cam, 0.4) * 0.05;
  const recOn = t >= rec;
  const blink = recOn && Math.floor((t - rec) * 2.5) % 2 === 0;
  const tc = Math.max(0, t - rec);
  const frames = Math.floor((tc % 1) * 25);
  const tcStr = `00:00:${String(Math.floor(tc)).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  const fs = portrait ? 118 : 128;
  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 8, y: 18, r: 360, color: C.blue, seed: 'a'},
          {x: 92, y: 88, r: 420, color: C.violet, seed: 'b'},
          {x: 78, y: 4, r: 200, color: C.blueLight, seed: 'c'},
        ]}
        blobOpacity={0.85}
      />
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <div
          style={{
            position: 'absolute',
            left: (w - vfW) / 2,
            top: (h - vfH) / 2,
            width: vfW,
            height: vfH,
            transform: `scale(${mix(1.25, 1, vfIn)})`,
          }}
        >
          <Brackets w={vfW} h={vfH} len={70} thick={7} color={C.ink} p={vfIn} />
          {/* HUD */}
          <div style={{position: 'absolute', left: 34 * u, top: 30 * u, display: 'flex', alignItems: 'center', gap: 12 * u, opacity: vfIn}}>
            <div
              style={{
                width: 20 * u,
                height: 20 * u,
                borderRadius: '50%',
                background: recOn ? C.violet : 'rgba(7,7,15,0.25)',
                boxShadow: recOn && blink ? `0 0 ${24 * u}px ${C.violet}` : 'none',
                opacity: recOn ? (blink ? 1 : 0.35) : 1,
              }}
            />
            <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26 * u, color: C.ink, letterSpacing: '0.1em'}}>{recOn ? 'REC' : 'STBY'}</span>
          </div>
          <div style={{position: 'absolute', right: 34 * u, top: 30 * u, fontFamily: F.mono, fontWeight: 500, fontSize: 26 * u, color: C.ink, opacity: vfIn}}>
            {tcStr}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 34 * u,
              right: 34 * u,
              bottom: 28 * u,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: F.mono,
              fontSize: 20 * u,
              color: 'rgba(7,7,15,0.55)',
              letterSpacing: '0.08em',
              opacity: vfIn,
            }}
          >
            <span>ISO 800</span>
            <span>1/50</span>
            <span>f/2.8</span>
            {portrait ? null : <span>4K · 25P</span>}
            <span style={{display: 'flex', alignItems: 'center', gap: 6 * u}}>
              <span style={{width: 34 * u, height: 16 * u, border: `${2 * u}px solid rgba(7,7,15,0.55)`, borderRadius: 3 * u, display: 'inline-block', position: 'relative'}}>
                <span style={{position: 'absolute', left: 2 * u, top: 2 * u, bottom: 2 * u, width: 18 * u, background: 'rgba(7,7,15,0.55)'}} />
              </span>
            </span>
          </div>
          {/* focus cross */}
          <div style={{position: 'absolute', left: '50%', top: '50%', width: 40 * u, height: 40 * u, marginLeft: -20 * u, marginTop: -20 * u, opacity: 0.25 * vfIn}}>
            <div style={{position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2 * u, background: C.ink}} />
            <div style={{position: 'absolute', top: '50%', left: 0, right: 0, height: 2 * u, background: C.ink}} />
          </div>
          {/* Headline */}
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <H size={fs}>
              <div>
                <W t={at(0, 'semua')}>Semua </W>
                <W t={at(0, 'orang')}>orang </W>
                {portrait ? <br /> : null}
                <W t={at(0, 'bisa')}>bisa</W>
              </div>
              <div>
                <W t={rec}>menyalakan </W>
                {portrait ? <br /> : null}
                <span style={{position: 'relative', display: 'inline-block'}}>
                  <W t={cam} look="grad">
                    kamera,
                  </W>
                  <FocusBox t0={cam} />
                </span>
              </div>
            </H>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FocusBox: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  if (t < t0 + 0.12) return null;
  const p = prog(t, t0 + 0.12, 0.35, ease.outBackStrong);
  const flick = Math.floor((t - t0) * 12) % 2 === 0 && t - t0 < 0.5;
  return (
    <span
      style={{
        position: 'absolute',
        left: '-0.12em',
        right: '-0.05em',
        top: '0.02em',
        bottom: '-0.04em',
        transform: `scale(${mix(1.5, 1, p)})`,
        opacity: flick ? 0.35 : 1,
      }}
    >
      <CornerBox color={C.violet} />
    </span>
  );
};

/** Four corner marks drawn in em units, fills its positioned parent. */
export const CornerBox: React.FC<{color: string; len?: string; thick?: string}> = ({color, len = '0.22em', thick = '0.035em'}) => (
  <>
    {(
      [
        ['top', 'left'],
        ['top', 'right'],
        ['bottom', 'left'],
        ['bottom', 'right'],
      ] as const
    ).map(([v, hz]) => (
      <span
        key={v + hz}
        style={{
          position: 'absolute',
          [v]: 0,
          [hz]: 0,
          width: len,
          height: len,
          [`border${v === 'top' ? 'Top' : 'Bottom'}`]: `${thick} solid ${color}`,
          [`border${hz === 'left' ? 'Left' : 'Right'}`]: `${thick} solid ${color}`,
        }}
      />
    ))}
  </>
);
