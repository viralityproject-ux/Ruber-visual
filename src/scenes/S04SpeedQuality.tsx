import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, W, at} from '../components/Text';
import {Bar, Card, CheckBadge} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {between, bump, ease, mix, prog, shake, spr} from '../lib/anim';

const Meter: React.FC<{
  t0: number;
  icon: string;
  tag: string;
  word: string;
  value: number; // 0..1
  glow: number; // 0..1 gradient border emphasis
  check?: number;
  wordT: number;
  width: number;
  dim?: number;
}> = ({t0, icon, tag, word, value, glow, check, wordT, width, dim = 0}) => {
  const t = useT();
  const {u} = useLayout();
  const s = spr(t, t0, 210, 17);
  if (t < t0) return null;
  return (
    <div style={{transform: `scale(${mix(0.6, 1, s)}) translateY(${mix(120, 0, s)}px)`, opacity: Math.min(1, s * 2), filter: dim > 0 ? `saturate(${1 - dim})` : undefined}}>
      <div style={{padding: 4 * u, borderRadius: 40 * u, background: `linear-gradient(120deg, rgba(43,89,255,${glow}), rgba(123,60,255,${glow}))`}}>
        <Card radius={36} pad={44} style={{width: width}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16 * u}}>
              <div style={{width: 64 * u, height: 64 * u, borderRadius: 18 * u, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon name={icon} size={36 * u} color="#fff" stroke={2.2} />
              </div>
              <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30 * u, letterSpacing: '0.14em', color: C.muted}}>{tag}</span>
            </div>
            {check !== undefined ? <CheckBadge t0={check} size={56} /> : null}
          </div>
          <div style={{marginTop: 30 * u}}>
            <H size={112} align="left">
              {t < wordT ? (
                <span style={{color: 'rgba(7,7,15,0.12)'}}>{word}</span>
              ) : (
                <W t={wordT} look={glow > 0.5 ? 'grad' : 'plain'} dur={0.35}>
                  {word}
                </W>
              )}
            </H>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 22 * u, marginTop: 34 * u}}>
            <Bar p={value} h={18} style={{flex: 1}} />
            <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 40 * u, color: C.ink, width: 120 * u, textAlign: 'right'}}>{Math.round(value * 100)}%</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

// "Kecepatan tidak harus mengorbankan kualitas."
export const S04SpeedQuality: React.FC = () => {
  const t = useT();
  const {u, portrait} = useLayout();
  const kec = at(3, 'kecepatan');
  const tidak = at(3, 'tidak');
  const meng = at(3, 'mengorbankan');
  const kual = at(3, 'kualitas');
  const speed = prog(t, kec + 0.05, 0.7, ease.outQuart);
  // quality first sags (the usual trade-off), then shoots back to 100 on "kualitas"
  const sag = between(t, kec + 0.5, meng + 0.3, ease.inOutCubic);
  const back = prog(t, kual, 0.55, ease.outBackStrong);
  const quality = Math.min(1.0, mix(mix(1, 0.32, sag), 1, back));
  const sk = shake(t, kual, 16, 0.4);
  const cardW = portrait ? 880 * u : 800 * u;
  const zoom = 1 + bump(t, kual, 0.4) * 0.04 + bump(t, kec, 0.35) * 0.03;
  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: -2, y: 100, r: 440, color: C.blue, seed: 'f'},
          {x: 102, y: -4, r: 380, color: C.violet, seed: 'g'},
        ]}
        blobOpacity={0.55}
      />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: portrait ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: (portrait ? 40 : 60) * u,
          transform: `translate(${sk.x}px, ${sk.y}px) scale(${zoom})`,
          paddingBottom: portrait ? 0 : 130 * u,
        }}
      >
        <Meter t0={kec - 0.1} wordT={kec} icon="bolt" tag="SPEED" word="Kecepatan" value={speed} glow={0} width={cardW} check={kual + 0.15} />
        {portrait ? <TradeOff t0={tidak} meng={meng} kual={kual} /> : null}
        <Meter
          t0={kec + 0.35}
          wordT={kual}
          icon="sparkle"
          tag="QUALITY"
          word="Kualitas."
          value={quality}
          glow={prog(t, kual, 0.4)}
          width={cardW}
          check={kual + 0.25}
        />
      </AbsoluteFill>
      {portrait ? null : (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 150 * u, display: 'flex', justifyContent: 'center'}}>
          <TradeOff t0={tidak} meng={meng} kual={kual} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const TradeOff: React.FC<{t0: number; meng: number; kual: number}> = ({t0, meng, kual}) => {
  const t = useT();
  const {u} = useLayout();
  return (
    <H size={64} weight={700} ls="-0.03em">
      <W t={t0} style={{color: C.ink}}>
        tidak{' '}
      </W>
      <W t={at(3, 'harus')} style={{color: C.ink}}>
        harus{' '}
      </W>
      <span style={{position: 'relative', display: 'inline-block'}}>
        <W t={meng} style={{color: C.muted}}>
          mengorbankan
        </W>
        <span
          style={{
            position: 'absolute',
            left: '-3%',
            top: '55%',
            height: 6 * u,
            width: `${prog(t, kual - 0.1, 0.3, ease.outQuart) * 106}%`,
            background: C.violet,
            borderRadius: 9,
            transform: 'rotate(-3deg)',
          }}
        />
      </span>
    </H>
  );
};
