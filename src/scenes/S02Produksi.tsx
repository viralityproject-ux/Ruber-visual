import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, Strike, W, at} from '../components/Text';
import {Center} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {bump, ease, mix, n2, prog, shake} from '../lib/anim';

const CHIPS: [string, string][] = [
  ['LIGHTING', 'light'],
  ['TALENT', 'user'],
  ['SCRIPT', 'doc'],
  ['LOKASI', 'pin'],
  ['WARDROBE', 'shirt'],
  ['JADWAL', 'calendar'],
  ['CREW', 'users'],
  ['AUDIO', 'mic'],
  ['EDITING', 'film'],
  ['BUDGET', 'chart'],
];

// "tapi produksi yang baik nggak semudah yang mereka kira."
export const S02Produksi: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const semudah = at(1, 'semudah');
  const kira = at(1, 'yang', 1);
  const strikeAt = semudah + 0.55;
  const sk = shake(t, strikeAt, 14, 0.35);
  const fs = portrait ? 132 : 150;
  const zoom = mix(1, 1.05, prog(t, 3, 4, ease.linear)) + bump(t, at(1, 'produksi'), 0.35) * 0.04;
  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 90, y: 12, r: 380, color: C.violet, seed: 'd'},
          {x: 6, y: 92, r: 400, color: C.blue, seed: 'e'},
        ]}
        blobOpacity={0.8}
      />
      {/* complexity chips orbiting */}
      <AbsoluteFill>
        {CHIPS.map(([label, icon], i) => {
          const t0 = kira + i * 0.07;
          const p = prog(t, t0, 0.6, ease.outBackStrong);
          if (p <= 0) return null;
          const a = (i / CHIPS.length) * Math.PI * 2 + t * 0.25 + 0.3;
          const rx = portrait ? w * 0.4 : w * 0.41;
          const ry = portrait ? h * 0.36 : h * 0.4;
          const depth = (Math.sin(a) + 1) / 2; // 0 back .. 1 front
          const x = w / 2 + Math.cos(a) * rx + n2('cx' + i, t * 0.4) * 20 * u;
          const y = h / 2 + Math.sin(a) * ry * 0.92 + n2('cy' + i, t * 0.4) * 20 * u;
          const s = mix(0.7, 1.05, depth) * p;
          return (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${s}) rotate(${n2('r' + i, t * 0.3) * 8}deg)`,
                filter: depth < 0.35 ? `blur(${(0.35 - depth) * 10}px)` : undefined,
                opacity: mix(0.55, 1, depth),
                display: 'flex',
                alignItems: 'center',
                gap: 12 * u,
                padding: `${16 * u}px ${26 * u}px`,
                borderRadius: 999,
                background: i % 3 === 0 ? C.ink : '#fff',
                color: i % 3 === 0 ? '#fff' : C.ink,
                boxShadow: `0 ${14 * u}px ${34 * u}px rgba(40,30,110,0.16)`,
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 30 * u,
                letterSpacing: '0.08em',
                zIndex: depth > 0.5 ? 2 : 0,
              }}
            >
              <Icon name={icon} size={32 * u} color={i % 3 === 0 ? C.violetLight : C.violet} stroke={2.2} />
              {label}
            </div>
          );
        })}
      </AbsoluteFill>
      <Center style={{transform: `translate(${sk.x}px, ${sk.y}px) rotate(${sk.r}deg) scale(${zoom})`, zIndex: 1}}>
        <Label size={26} color={C.violet} style={{marginBottom: 26 * u, opacity: prog(t, at(1, 'tapi'), 0.3)}}>
          <W t={at(1, 'tapi')}>— tapi</W>
        </Label>
        <H size={fs}>
          <div>
            <W t={at(1, 'produksi')}>produksi </W>
            {portrait ? <br /> : null}
            <W t={at(1, 'yang')}>yang </W>
            <W t={at(1, 'baik')}>baik</W>
          </div>
          <div style={{marginTop: 6 * u}}>
            <W t={at(1, 'nggak')} style={{color: C.muted}}>
              nggak{' '}
            </W>
            {portrait ? <br /> : null}
            <span style={{position: 'relative', display: 'inline-block'}}>
              <W t={semudah} look="serif" style={{fontSize: '1.12em'}}>
                semudah
              </W>
              <Strike t0={strikeAt} thickness={0.07} color={C.ink} />
            </span>
          </div>
        </H>
        <H size={portrait ? 54 : 58} weight={600} color={C.muted} ls="-0.02em" style={{marginTop: 30 * u}}>
          <W t={kira}>yang </W>
          <W t={at(1, 'mereka')}>mereka </W>
          <W t={at(1, 'kira')} style={{color: C.ink}}>
            kira.
          </W>
        </H>
      </Center>
      <Label size={24} color={C.ink} style={{position: 'absolute', left: 56 * u, bottom: 48 * u, opacity: prog(t, kira, 0.4)}}>
        {`[ ${CHIPS.length} hal yang sering diremehkan ]`}
      </Label>
    </AbsoluteFill>
  );
};
