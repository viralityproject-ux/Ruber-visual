import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Media} from '../components/UI';
import {LogoMark} from '../components/Logo';
import {useLayout, useT} from '../lib/scene';
import {between, ease, mix, prog, shake, spr} from '../lib/anim';

const Lines: React.FC<{n: number; dark?: boolean; t0: number}> = ({n, dark, t0}) => {
  const t = useT();
  const {u} = useLayout();
  return (
    <>
      {Array.from({length: n}, (_, i) => (
        <div
          key={i}
          style={{
            height: 9 * u,
            borderRadius: 9,
            marginTop: 10 * u,
            width: `${[92, 78, 85, 60, 88][i % 5] * prog(t, t0 + i * 0.05, 0.4)}%`,
            background: dark ? 'rgba(255,255,255,0.35)' : 'rgba(7,7,15,0.12)',
          }}
        />
      ))}
    </>
  );
};

const PageTitle: React.FC<{k: string; title: string; dark?: boolean}> = ({k, title, dark}) => {
  const {u} = useLayout();
  return (
    <>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 15 * u, letterSpacing: '0.14em', color: dark ? 'rgba(255,255,255,0.75)' : C.violet}}>{k}</div>
      <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 30 * u, letterSpacing: '-0.03em', color: dark ? '#fff' : C.ink, marginTop: 4 * u}}>{title}</div>
    </>
  );
};

const Page: React.FC<{i: number; t0: number}> = ({i, t0}) => {
  const {u} = useLayout();
  const t = useT();
  if (i === 0) {
    return (
      <div style={{position: 'absolute', inset: 0, background: GRAD, padding: 28 * u, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <LogoMark size={64 * u} variant="light" />
        <div>
          <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 16 * u, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.8)'}}>TREATMENT</div>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 52 * u, letterSpacing: '-0.04em', color: '#fff', lineHeight: 0.95, marginTop: 8 * u}}>
            Project
            <br />
            Deck.
          </div>
        </div>
      </div>
    );
  }
  if (i === 1) {
    return (
      <div style={{position: 'absolute', inset: 0, background: '#fff', padding: 28 * u}}>
        <PageTitle k="01 · CONCEPT" title="Big idea" />
        <div style={{height: 210 * u, borderRadius: 14 * u, overflow: 'hidden', marginTop: 16 * u}}>
          <Media src="photos/street-jump.jpg" pos="50% 40%" />
        </div>
        <Lines n={4} t0={t0 + 0.2} />
      </div>
    );
  }
  if (i === 2) {
    const ph = ['photos/fashion-hijab-orange.jpg', 'photos/street-duo-03.jpg', 'photos/fashion-girl-pink.jpg', 'photos/product-kahf-red.jpg', 'photos/fashion-trio.jpg', 'photos/street-girl-portrait.jpg'];
    return (
      <div style={{position: 'absolute', inset: 0, background: '#fff', padding: 28 * u}}>
        <PageTitle k="02 · MOODBOARD" title="Look & feel" />
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 * u, marginTop: 16 * u}}>
          {ph.map((src, j) => (
            <div key={src} style={{height: 112 * u, borderRadius: 10 * u, overflow: 'hidden', transform: `scale(${prog(t, t0 + 0.15 + j * 0.05, 0.4, ease.outBack)})`}}>
              <Media src={src} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (i === 3) {
    const rows = [
      ['SH01', 'WIDE', 'Establishing'],
      ['SH02', 'MCU', 'Talent intro'],
      ['SH03', 'CU', 'Product hero'],
      ['SH04', 'INSERT', 'Detail'],
      ['SH05', 'GIMBAL', 'Walk & talk'],
      ['SH06', 'TOP', 'Flatlay'],
    ];
    return (
      <div style={{position: 'absolute', inset: 0, background: '#fff', padding: 28 * u}}>
        <PageTitle k="03 · SHOT LIST" title="Coverage" />
        <div style={{marginTop: 16 * u}}>
          {rows.map((r, j) => (
            <div key={r[0]} style={{display: 'flex', gap: 10 * u, padding: `${10 * u}px 0`, borderBottom: `${1.5 * u}px solid rgba(7,7,15,0.07)`, fontFamily: F.mono, fontSize: 16 * u, opacity: prog(t, t0 + 0.15 + j * 0.05, 0.3)}}>
              <span style={{color: C.violet, fontWeight: 700}}>{r[0]}</span>
              <span style={{color: C.ink, fontWeight: 700, width: 70 * u}}>{r[1]}</span>
              <span style={{color: C.muted}}>{r[2]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const bars = [
    [0, 0.3, 'PRE'],
    [0.2, 0.55, 'PREP'],
    [0.5, 0.7, 'SHOOT'],
    [0.65, 0.95, 'POST'],
    [0.9, 1, 'DELIVER'],
  ] as const;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#fff', padding: 28 * u}}>
      <PageTitle k="04 · TIMELINE" title="Schedule" />
      <div style={{marginTop: 22 * u, display: 'flex', flexDirection: 'column', gap: 16 * u}}>
        {bars.map(([a, b, l], j) => (
          <div key={l} style={{position: 'relative', height: 34 * u}}>
            <div
              style={{
                position: 'absolute',
                left: `${a * 100}%`,
                width: `${(b - a) * 100 * prog(t, t0 + 0.15 + j * 0.07, 0.5, ease.outExpo)}%`,
                top: 0,
                bottom: 0,
                borderRadius: 9 * u,
                background: j === 2 ? GRAD : 'rgba(123,60,255,0.18)',
              }}
            />
            <span style={{position: 'absolute', left: `${a * 100}%`, top: 6 * u, marginLeft: 8 * u, fontFamily: F.mono, fontWeight: 700, fontSize: 14 * u, color: j === 2 ? '#fff' : C.indigo}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// "Karena itulah, setiap proyek di Ruber Visual mendapatkan treatment yang kami persiapkan dengan serius."
export const S17Treatment: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const karena = at(20, 'karena');
  const treatment = at(20, 'treatment');
  const persiapkan = at(20, 'persiapkan');
  const serius = at(20, 'serius');
  const fan = spr(t, treatment - 0.1, 120, 14);
  const align = between(t, persiapkan - 0.1, persiapkan + 0.5, ease.inOutExpo);
  const stamp = prog(t, serius, 0.35, ease.outExpo);
  const sk = shake(t, serius + 0.05, 24, 0.4);
  const pw = (portrait ? 300 : 300) * u;
  const ph = pw * 1.38;
  const deckX = portrait ? w / 2 : w * 0.66;
  const deckY = portrait ? h * 0.66 : h * 0.54;
  const n = 5;
  const appear = prog(t, at(20, 'setiap') - 0.1, 0.7, ease.outExpo);
  return (
    <AbsoluteFill style={{transform: `translate(${sk.x}px, ${sk.y}px)`}}>
      <PaperBg
        blobs={[
          {x: 70, y: 50, r: 460, color: C.violetSoft, seed: 'u', wobble: 0.15},
          {x: 0, y: 0, r: 300, color: C.blue, seed: 'v'},
        ]}
        blobOpacity={0.7}
      />
      {/* copy */}
      <div
        style={{
          position: 'absolute',
          left: portrait ? 0 : w * 0.06,
          right: portrait ? 0 : undefined,
          width: portrait ? undefined : w * 0.36,
          top: portrait ? h * 0.08 : 0,
          bottom: portrait ? undefined : 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: portrait ? 'center' : 'flex-start',
          textAlign: portrait ? 'center' : 'left',
          zIndex: 2,
        }}
      >
        <Label size={28} color={C.violet}>
          <W t={karena}>karena </W>
          <W t={at(20, 'itulah')}>itulah,</W>
        </Label>
        <H size={portrait ? 62 : 58} weight={700} align={portrait ? 'center' : 'left'} ls="-0.03em" style={{marginTop: 18 * u}}>
          <W t={at(20, 'setiap')}>setiap </W>
          <W t={at(20, 'proyek')}>proyek </W>
          <W t={at(20, 'di')}>di </W>
          <br />
          <W t={at(20, 'ruber')} look="grad">
            Ruber{' '}
          </W>
          <W t={at(20, 'visual')} look="grad">
            Visual{' '}
          </W>
          <W t={at(20, 'mendapatkan')} style={{color: C.muted}}>
            mendapatkan
          </W>
        </H>
        <H size={portrait ? 150 : 140} align={portrait ? 'center' : 'left'} style={{marginTop: 4 * u}}>
          <W t={treatment}>treatment</W>
        </H>
        <H size={portrait ? 56 : 52} weight={700} color={C.muted} align={portrait ? 'center' : 'left'} ls="-0.03em" style={{marginTop: 8 * u}}>
          <W t={at(20, 'yang')}>yang </W>
          <W t={at(20, 'kami')}>kami </W>
          <W t={persiapkan} style={{color: C.ink}}>
            persiapkan{' '}
          </W>
          {portrait ? null : <br />}
          <W t={at(20, 'dengan')}>dengan </W>
          <W t={serius} look="serif" style={{fontSize: '1.7em'}}>
            serius.
          </W>
        </H>
      </div>
      {/* deck */}
      {Array.from({length: n}, (_, i) => {
        const c = i - (n - 1) / 2;
        // stacked → fanned → aligned grid (2 rows in portrait)
        const fx = c * pw * 0.42;
        const fy = Math.abs(c) * 22 * u;
        const fr = c * 9;
        const gx = portrait ? (i < 3 ? i - 1 : i - 3 - 0.5) * (pw * 0.75 + 16 * u) : c * (pw * 0.62 + 14 * u);
        const gy = portrait ? (i < 3 ? -ph * 0.4 : ph * 0.4) : 0;
        const gs = portrait ? 0.72 : 0.6;
        const x = mix(mix(0, fx, fan), gx, align);
        const y = mix(mix(-i * 4 * u, fy, fan), gy, align);
        const r = mix(mix((i - 2) * 1.5, fr, fan), 0, align);
        const s = mix(1, gs, align);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: deckX + x - pw / 2,
              top: deckY + y - ph / 2 + mix(400 * u, 0, appear),
              width: pw,
              height: ph,
              borderRadius: 20 * u,
              overflow: 'hidden',
              transform: `rotate(${r}deg) scale(${s})`,
              boxShadow: `0 ${24 * u}px ${50 * u}px rgba(40,30,110,0.25)`,
              zIndex: i === 0 ? 1 : 0,
              opacity: appear,
            }}
          >
            <Page i={i} t0={treatment + i * 0.06} />
          </div>
        );
      })}
      {/* approval stamp */}
      {t >= serius ? (
        <div
          style={{
            position: 'absolute',
            left: deckX,
            top: deckY + (portrait ? ph * 0.75 : ph * 0.42),
            transform: `translate(-50%, -50%) scale(${mix(2.6, 1, stamp)}) rotate(-8deg)`,
            opacity: Math.min(1, stamp * 3),
            padding: `${14 * u}px ${36 * u}px`,
            borderRadius: 18 * u,
            border: `${6 * u}px solid ${C.violet}`,
            background: 'rgba(255,255,255,0.92)',
            color: C.violet,
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 46 * u,
            letterSpacing: '0.14em',
            whiteSpace: 'nowrap',
            zIndex: 3,
            boxShadow: `0 ${20 * u}px ${50 * u}px rgba(91,60,255,0.3)`,
          }}
        >
          ✓ READY TO SHOOT
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
