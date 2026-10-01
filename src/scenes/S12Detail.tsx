import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Bar, Card, CheckBadge} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog, shake} from '../lib/anim';

const ITEMS: [string, string][] = [
  ['Shot list & storyboard', 'doc'],
  ['Lokasi & perizinan', 'pin'],
  ['Talent & wardrobe', 'shirt'],
  ['Lighting plan', 'light'],
  ['Audio & equipment', 'mic'],
  ['Callsheet & jadwal', 'calendar'],
  ['Properti & set', 'layers'],
  ['Backup plan', 'check'],
];

const Clapper: React.FC<{t0: number; size: number}> = ({t0, size}) => {
  const t = useT();
  const p = prog(t, t0 - 0.35, 0.45, ease.outBackStrong);
  const clap = prog(t, t0 - 0.05, 0.12, ease.inCubic);
  const arm = mix(-28, 0, clap);
  const stripes = (y: number, h: number) =>
    Array.from({length: 6}, (_, i) => <polygon key={i} points={`${8 + i * 16},${y} ${18 + i * 16},${y} ${12 + i * 16},${y + h} ${2 + i * 16},${y + h}`} fill="#fff" />);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `scale(${p}) rotate(${mix(-15, -6, p)}deg)`, overflow: 'visible'}}>
      <defs>
        <linearGradient id="clapGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={C.blue} />
          <stop offset="1" stopColor={C.violet} />
        </linearGradient>
      </defs>
      <rect x="4" y="34" width="92" height="60" rx="6" fill={C.ink} />
      <rect x="4" y="34" width="92" height="14" fill="url(#clapGrad)" />
      {stripes(34, 14)}
      <text x="12" y="66" fill="#fff" fontFamily="JBMono" fontWeight="700" fontSize="9" letterSpacing="1">SCENE 01</text>
      <text x="12" y="82" fill="rgba(255,255,255,0.6)" fontFamily="JBMono" fontSize="8">TAKE 1 · RUBER</text>
      <g transform={`rotate(${arm} 6 32)`}>
        <rect x="4" y="18" width="92" height="14" rx="3" fill="url(#clapGrad)" />
        {stripes(18, 14)}
      </g>
    </svg>
  );
};

// "dan setiap detail sudah kami pikirkan bahkan sebelum hari syuting dimulai."
export const S12Detail: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const detail = at(14, 'detail');
  const bahkan = at(14, 'bahkan');
  const syuting = at(14, 'syuting');
  const dimulai = at(14, 'dimulai');
  const swap = bahkan - 0.1;
  const flip = prog(t, swap - 0.15, 0.3, ease.inCubic); // checklist out
  const flipIn = prog(t, swap + 0.1, 0.45, ease.outBack); // calendar in
  const sk = shake(t, dimulai, 22, 0.4);
  const cardW = (portrait ? 900 : 760) * u;
  const textX = portrait ? 0 : w * 0.07;
  const textW = portrait ? w : w * 0.42;
  const doneCount = ITEMS.filter((_, i) => t >= detail + 0.05 + i * 0.2).length;
  return (
    <AbsoluteFill style={{transform: `translate(${sk.x}px, ${sk.y}px)`}}>
      <PaperBg
        blobs={[
          {x: 100, y: 50, r: 420, color: C.violet, seed: 'o'},
          {x: 0, y: 100, r: 300, color: C.blue, seed: 'p'},
        ]}
        blobOpacity={0.5}
      />
      {/* text column */}
      <div
        style={{
          position: 'absolute',
          left: textX,
          width: textW,
          top: portrait ? h * 0.08 : 0,
          bottom: portrait ? undefined : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: portrait ? 'center' : 'flex-start',
          textAlign: portrait ? 'center' : 'left',
        }}
      >
        {t < swap ? (
          <>
            <H size={64} weight={700} color={C.muted} align={portrait ? 'center' : 'left'} ls="-0.03em">
              <W t={at(14, 'dan')}>dan </W>
              <W t={at(14, 'setiap')}>setiap</W>
            </H>
            <H size={portrait ? 210 : 220} align={portrait ? 'center' : 'left'} style={{margin: `${-6 * u}px 0 ${4 * u}px`}}>
              <W t={detail} look="grad">
                detail
              </W>
            </H>
            <H size={64} weight={700} align={portrait ? 'center' : 'left'} ls="-0.03em">
              <W t={at(14, 'sudah')}>sudah </W>
              <W t={at(14, 'kami')}>kami </W>
              <W t={at(14, 'pikirkan')}>pikirkan</W>
            </H>
          </>
        ) : (
          <>
            <H size={64} weight={700} color={C.muted} align={portrait ? 'center' : 'left'} ls="-0.03em">
              <W t={bahkan}>bahkan </W>
              <W t={at(14, 'sebelum')}>sebelum</W>
            </H>
            <H size={portrait ? 140 : 150} align={portrait ? 'center' : 'left'}>
              <W t={at(14, 'hari')}>hari </W>
              <W t={syuting}>syuting</W>
            </H>
            <H size={portrait ? 170 : 180} align={portrait ? 'center' : 'left'} style={{marginTop: -10 * u}}>
              <W t={dimulai} look="serif">
                dimulai.
              </W>
            </H>
          </>
        )}
      </div>
      {/* card column */}
      <div
        style={{
          position: 'absolute',
          left: portrait ? (w - cardW) / 2 : w * 0.53,
          top: portrait ? h * 0.42 : 0,
          bottom: portrait ? undefined : 0,
          width: cardW,
          display: 'flex',
          alignItems: 'center',
          perspective: 1600,
        }}
      >
        {flip < 1 ? (
          <div style={{transform: `rotateY(${flip * 90}deg) translateY(${mix(120, 0, prog(t, detail - 0.4, 0.6, ease.outExpo))}px)`, opacity: prog(t, detail - 0.4, 0.3)}}>
            <Card radius={40} pad={44} style={{width: cardW}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 * u}}>
                <Label size={22} color={C.violet}>pre-production checklist</Label>
                <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 26 * u, color: C.ink}}>{`${doneCount}/${ITEMS.length}`}</span>
              </div>
              {ITEMS.map(([label, icon], i) => {
                const ti = detail + 0.05 + i * 0.2;
                const on = t >= ti;
                const ap = prog(t, detail - 0.3 + i * 0.04, 0.4, ease.outExpo);
                return (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20 * u,
                      padding: `${14 * u}px 0`,
                      borderBottom: i < ITEMS.length - 1 ? `${1.5 * u}px solid rgba(7,7,15,0.06)` : 'none',
                      opacity: ap,
                      transform: `translateX(${mix(40, 0, ap)}px)`,
                    }}
                  >
                    {on ? (
                      <CheckBadge t0={ti} size={42} />
                    ) : (
                      <div style={{width: 42 * u, height: 42 * u, borderRadius: '50%', border: `${3 * u}px solid rgba(7,7,15,0.15)`, boxSizing: 'border-box'}} />
                    )}
                    <Icon name={icon} size={30 * u} color={on ? C.violet : C.muted} stroke={2} />
                    <span style={{fontFamily: F.display, fontWeight: 700, fontSize: 32 * u, color: on ? C.ink : C.muted, flex: 1, letterSpacing: '-0.02em'}}>{label}</span>
                    <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 20 * u, color: on ? C.violet : 'transparent'}}>READY</span>
                  </div>
                );
              })}
              <Bar p={doneCount / ITEMS.length} h={12} style={{marginTop: 20 * u}} />
            </Card>
          </div>
        ) : (
          <div style={{transform: `rotateY(${mix(-90, 0, flipIn)}deg) scale(${1 + bump(t, dimulai, 0.3) * 0.04})`, position: 'relative'}}>
            <Calendar t0={swap + 0.1} syuting={syuting} width={cardW} />
            <div style={{position: 'absolute', right: -60 * u, bottom: -70 * u}}>
              <Clapper t0={dimulai} size={(portrait ? 300 : 280) * u} />
            </div>
          </div>
        )}
      </div>
      {/* clap flash */}
      {(() => {
        const x = (t - dimulai) / 0.18;
        return x > 0 && x < 1 ? <AbsoluteFill style={{background: '#fff', opacity: (1 - x) * 0.8}} /> : null;
      })()}
    </AbsoluteFill>
  );
};

const Calendar: React.FC<{t0: number; syuting: number; width: number}> = ({t0, syuting, width}) => {
  const t = useT();
  const {u} = useLayout();
  const shoot = 15;
  const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  const cell = (width - 88 * u - 6 * 10 * u) / 7;
  return (
    <Card radius={40} pad={44} style={{width}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 * u}}>
        <div>
          <Label size={22} color={C.violet}>shooting schedule</Label>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 48 * u, color: C.ink, letterSpacing: '-0.04em', marginTop: 4 * u}}>Countdown</div>
        </div>
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 44 * u, color: C.violet}}>
          {(() => {
            const k = Math.min(7, Math.max(0, Math.floor((t - t0 - 0.35) / 0.12)));
            return t >= syuting ? 'D-DAY' : `D-${7 - k}`;
          })()}
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(7, ${cell}px)`, gap: 10 * u}}>
        {days.map((d, i) => (
          <div key={'h' + i} style={{textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 20 * u, color: C.muted}}>
            {d}
          </div>
        ))}
        {Array.from({length: 28}, (_, i) => {
          const day = i + 1;
          const crossT = t0 + 0.35 + (day - 8) * 0.12;
          const crossed = day >= 8 && day < shoot && t >= crossT;
          const isShoot = day === shoot;
          const sp = isShoot ? prog(t, syuting, 0.45, ease.outBackStrong) : 0;
          const ap = prog(t, t0 + i * 0.008, 0.3, ease.outCubic);
          return (
            <div
              key={day}
              style={{
                position: 'relative',
                height: cell * 0.82,
                borderRadius: 16 * u,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: F.display,
                fontWeight: 700,
                fontSize: 28 * u,
                color: isShoot && sp > 0.5 ? '#fff' : day < 8 ? 'rgba(7,7,15,0.25)' : C.ink,
                background: day >= 8 && day < shoot ? 'rgba(123,60,255,0.07)' : 'transparent',
                opacity: ap,
              }}
            >
              {isShoot ? (
                <div style={{position: 'absolute', inset: -4 * u, borderRadius: 18 * u, background: GRAD, transform: `scale(${sp})`, boxShadow: `0 ${10 * u}px ${30 * u}px rgba(91,60,255,0.5)`}} />
              ) : null}
              <span style={{position: 'relative'}}>{day}</span>
              {crossed ? (
                <svg style={{position: 'absolute', inset: 8 * u}} viewBox="0 0 10 10" preserveAspectRatio="none">
                  <path d="M1 1 L9 9" stroke={C.violet} strokeWidth={1.2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01((t - crossT) / 0.12)} />
                </svg>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12 * u, marginTop: 20 * u, opacity: prog(t, syuting, 0.3)}}>
        <Icon name="camera" size={30 * u} color={C.violet} stroke={2} />
        <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24 * u, color: C.ink, letterSpacing: '0.08em'}}>SHOOT DAY · CALL TIME 06:00</span>
      </div>
    </Card>
  );
};
