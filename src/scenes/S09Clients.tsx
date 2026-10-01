import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Card, CheckBadge} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {between, bump, ease, mix, prog, spr} from '../lib/anim';

const CLIENTS = [
  {word: 'Corporate', cue: 'corporate', icon: 'building', note: 'company & institution'},
  {word: 'Startup', cue: 'startup', icon: 'rocket', note: 'fast-growing teams'},
  {word: 'NGO', cue: 'ngo', icon: 'heart', note: 'impact & campaign'},
  {word: 'Brand', cue: 'brand', icon: 'tag', note: 'product & lifestyle'},
];

const Toggle: React.FC<{t0: number; icon: string; children: React.ReactNode; width: number}> = ({t0, icon, children, width}) => {
  const t = useT();
  const {u} = useLayout();
  const {portrait} = useLayout();
  const s = spr(t, t0 - 0.12, 220, 18);
  const on = prog(t, t0 + 0.05, 0.3, ease.outBack);
  const grow = prog(t, t0 - 0.2, 0.45, ease.outExpo);
  return (
    <div style={{width: portrait ? width : width * grow, height: portrait ? undefined : 'auto', display: 'flex', justifyContent: 'center'}}>
    <div style={{transform: `translateY(${mix(80, 0, s)}px) scale(${mix(0.8, 1, s)})`, opacity: Math.min(1, s * 2), flexShrink: 0}}>
      <Card radius={30} pad={30} style={{width, display: 'flex', alignItems: 'center', gap: 24 * u}}>
        <div
          style={{
            width: 96 * u,
            height: 54 * u,
            borderRadius: 999,
            background: on > 0.5 ? GRAD : 'rgba(7,7,15,0.1)',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 6 * u,
              left: mix(6, 48, on) * u,
              width: 42 * u,
              height: 42 * u,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: `0 ${3 * u}px ${8 * u}px rgba(0,0,0,0.25)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name={icon} size={24 * u} color={on > 0.5 ? C.violet : C.muted} stroke={2.4} />
          </div>
        </div>
        <div style={{flex: 1}}>{children}</div>
        <CheckBadge t0={t0 + 0.15} size={52} />
      </Card>
    </div>
    </div>
  );
};

// "untuk corporate, startup, NGO, dan brand yang membutuhkan eksekusi cepat, fleksibel, tapi tetap matang."
export const S09Clients: React.FC = () => {
  const t = useT();
  const {u, portrait} = useLayout();
  const untuk = at(8, 'untuk');
  const yang = at(8, 'yang');
  const eks = at(8, 'eksekusi');
  const collapse = between(t, yang - 0.1, yang + 0.5, ease.inOutExpo);
  const cardW = portrait ? 440 : 390;
  const cardH = portrait ? 400 : 440;
  const activeIdx = CLIENTS.reduce((acc, c, i) => (t >= at(8, c.cue) ? i : acc), -1);
  const gridScale = mix(1, portrait ? 0.46 : 0.5, collapse);
  const gridY = mix(0, portrait ? -640 : -330, collapse) * u;
  const attrW = 860 * u;
  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 0, y: 0, r: 360, color: C.blue, seed: 'm'},
          {x: 100, y: 100, r: 420, color: C.violet, seed: 'n'},
        ]}
        blobOpacity={0.55}
      />
      <Label
        size={30}
        color={C.violet}
        style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', top: (portrait ? 330 : 120) * u, opacity: 1 - collapse}}
      >
        <W t={untuk}>— untuk</W>
      </Label>
      {/* client cards */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${gridY}px) scale(${gridScale})`,
        }}
      >
        <div
          style={{
            display: portrait ? 'grid' : 'flex',
            gridTemplateColumns: portrait ? `repeat(2, ${cardW * u}px)` : undefined,
            gap: portrait ? 34 * u : 0,
          }}
        >
          {CLIENTS.map((c, i) => {
            const t0 = at(8, c.cue);
            const s = spr(t, t0 - 0.08, 230, 16);
            const active = i === activeIdx && collapse < 0.5;
            const k = bump(t, t0, 0.3);
            const grow = portrait ? 1 : prog(t, t0 - 0.15, 0.5, ease.outExpo);
            return (
              <div key={c.word} style={{width: portrait ? cardW * u : (cardW + 34) * u * grow, display: 'flex', justifyContent: 'center'}}>
              <div
                style={{
                  flexShrink: 0,
                  width: cardW * u,
                  height: cardH * u,
                  borderRadius: 40 * u,
                  padding: 40 * u,
                  boxSizing: 'border-box',
                  background: active ? GRAD : '#fff',
                  color: active ? '#fff' : C.ink,
                  boxShadow: active ? `0 ${40 * u}px ${80 * u}px rgba(91,60,255,0.45)` : `0 ${24 * u}px ${60 * u}px rgba(40,30,110,0.14)`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transform: `translateY(${mix(160, 0, s)}px) scale(${mix(0.6, 1, s) + k * 0.05}) rotate(${mix(i % 2 ? 8 : -8, 0, s)}deg)`,
                  opacity: Math.min(1, s * 2.5),
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div
                    style={{
                      width: 100 * u,
                      height: 100 * u,
                      borderRadius: 28 * u,
                      background: active ? 'rgba(255,255,255,0.18)' : GRAD,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={c.icon} size={54 * u} color="#fff" stroke={2} draw={t0} />
                  </div>
                  <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28 * u, opacity: 0.6}}>0{i + 1}</span>
                </div>
                <div>
                  <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 60 * u, letterSpacing: '-0.045em', lineHeight: 1}}>{c.word}</div>
                  <div style={{fontFamily: F.mono, fontSize: 22 * u, marginTop: 14 * u, opacity: 0.65, letterSpacing: '0.04em'}}>{c.note}</div>
                </div>
              </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* attributes */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: (portrait ? 620 : 380) * u,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: collapse,
        }}
      >
        <H size={portrait ? 64 : 60} weight={700} color={C.muted} ls="-0.03em">
          <W t={yang}>yang </W>
          <W t={at(8, 'membutuhkan')}>membutuhkan</W>
        </H>
        <H size={portrait ? 160 : 150} style={{marginTop: 6 * u}}>
          <W t={eks} look="grad">
            eksekusi
          </W>
        </H>
        <div
          style={{
            display: 'flex',
            flexDirection: portrait ? 'column' : 'row',
            gap: 26 * u,
            marginTop: 50 * u,
            alignItems: 'center',
          }}
        >
          <Toggle t0={at(8, 'cepat')} icon="bolt" width={portrait ? attrW : 430 * u}>
            <H size={54} align="left">
              <W t={at(8, 'cepat')}>cepat,</W>
            </H>
          </Toggle>
          <Toggle t0={at(9, 'fleksibel')} icon="move" width={portrait ? attrW : 500 * u}>
            <H size={54} align="left">
              <W t={at(9, 'fleksibel')}>fleksibel,</W>
            </H>
          </Toggle>
          <Toggle t0={at(9, 'tetap')} icon="check" width={portrait ? attrW : 700 * u}>
            <H size={54} align="left">
              <W t={at(9, 'tapi')} style={{color: C.muted, fontSize: '0.75em'}}>
                tapi{' '}
              </W>
              <W t={at(9, 'tetap')} style={{color: C.muted, fontSize: '0.75em'}}>
                tetap{' '}
              </W>
              <W t={at(9, 'matang')} look="serif" style={{fontSize: '1.25em'}}>
                matang.
              </W>
            </H>
          </Toggle>
        </div>
      </div>
    </AbsoluteFill>
  );
};
