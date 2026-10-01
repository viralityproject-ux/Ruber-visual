import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Media} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {between, bump, ease, mix, prog, spr} from '../lib/anim';

const Eye: React.FC<{open: number; size: number; color?: string}> = ({open, size, color = '#fff'}) => {
  const lid = mix(0, 9, open);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{overflow: 'visible'}}>
      <path d={`M1.5 12 Q12 ${12 - lid * 1.4} 22.5 12 Q12 ${12 + lid * 1.4} 1.5 12 Z`} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx="12" cy="12" r={3.6 * open} fill={color} />
      <circle cx="13.2" cy="10.8" r={1.1 * open} fill={C.violet} />
    </svg>
  );
};

const Typing: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  const {u} = useLayout();
  const done = t > t0 + 0.7;
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12 * u, alignItems: 'flex-start'}}>
      <div style={{padding: `${18 * u}px ${24 * u}px`, borderRadius: `${26 * u}px ${26 * u}px ${26 * u}px ${6 * u}px`, background: 'rgba(7,7,15,0.06)', display: 'flex', gap: 8 * u}}>
        {done ? (
          <span style={{fontFamily: F.display, fontWeight: 600, fontSize: 26 * u, color: C.ink}}>Apa yang mau disampaikan?</span>
        ) : (
          [0, 1, 2].map((i) => (
            <span key={i} style={{width: 12 * u, height: 12 * u, borderRadius: '50%', background: C.muted, transform: `translateY(${Math.sin(t * 12 - i) * 4 * u}px)`}} />
          ))
        )}
      </div>
      <div style={{alignSelf: 'flex-end', padding: `${18 * u}px ${24 * u}px`, borderRadius: `${26 * u}px ${26 * u}px ${6 * u}px ${26 * u}px`, background: GRAD, opacity: prog(t, t0 + 0.9, 0.3), transform: `scale(${prog(t, t0 + 0.9, 0.4, ease.outBack)})`}}>
        <span style={{fontFamily: F.display, fontWeight: 600, fontSize: 26 * u, color: '#fff'}}>Satu pesan yang jelas.</span>
      </div>
    </div>
  );
};

// "Konten harus punya pesan, punya karakter, dan yang terpenting punya alasan untuk diperhatikan."
export const S16Pillars: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const konten = at(19, 'konten');
  const pesan = at(19, 'pesan');
  const karakter = at(19, 'karakter');
  const dan = at(19, 'dan');
  const terpenting = at(19, 'terpenting');
  const alasan = at(19, 'alasan');
  const diper = at(19, 'diperhatikan');
  const focus = between(t, dan - 0.05, terpenting + 0.1, ease.inOutCubic);
  const spot = between(t, terpenting, at(19, 'punya', 2) + 0.2, ease.inOutCubic);
  const eye = prog(t, diper, 0.5, ease.outBackStrong);
  const cw = (portrait ? 900 : 520) * u;
  const ch = (portrait ? 360 : 560) * u;
  // positions for the three cards
  const pos = (i: number) => {
    if (portrait) {
      const ys = [h * 0.36, h * 0.36 + ch + 36 * u, h * 0.36 + (ch + 36 * u) * 2];
      const shrink = i < 2 ? focus : 0;
      return {x: w / 2, y: ys[i] - shrink * (i === 0 ? 0 : 60 * u) + (i === 2 ? -focus * 60 * u : 0), s: i < 2 ? mix(1, 0.9, focus) : mix(1, 1.04, spot)};
    }
    const xs = [w * 0.2, w * 0.5, w * 0.8];
    const x = i < 2 ? xs[i] - focus * w * (i === 0 ? 0.08 : 0.1) : xs[2] - focus * w * 0.08;
    return {x, y: h * 0.6, s: i < 2 ? mix(1, 0.82, focus) : mix(1, 1.18, spot)};
  };
  const card = (i: number, t0: number, children: React.ReactNode, accent = false) => {
    const p = spr(t, t0 - 0.15, 200, 16);
    const {x, y, s} = pos(i);
    const dim = i < 2 ? spot * 0.6 : 0;
    return (
      <div
        style={{
          position: 'absolute',
          left: x - cw / 2,
          top: y - ch / 2,
          width: cw,
          height: ch,
          borderRadius: 44 * u,
          padding: 44 * u,
          boxSizing: 'border-box',
          background: accent ? GRAD : '#fff',
          boxShadow: accent ? `0 ${40 * u}px ${100 * u}px rgba(91,60,255,0.5)` : `0 ${30 * u}px ${70 * u}px rgba(40,30,110,0.16)`,
          transform: `translateY(${mix(140, 0, p)}px) scale(${mix(0.7, 1, p) * s * (1 + bump(t, t0, 0.3) * 0.04)}) rotate(${mix(i % 2 ? 8 : -8, 0, p)}deg)`,
          opacity: Math.min(1, p * 2.5) * (1 - dim),
          filter: dim > 0 ? `blur(${dim * 6}px)` : undefined,
          display: 'flex',
          flexDirection: portrait ? 'row' : 'column',
          justifyContent: 'space-between',
          alignItems: portrait ? 'center' : 'stretch',
          gap: 24 * u,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    );
  };
  const tag = (label: string, dark: boolean) => (
    <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22 * u, letterSpacing: '0.12em', color: dark ? 'rgba(255,255,255,0.75)' : C.muted, textTransform: 'uppercase'}}>{label}</span>
  );
  const iconTile = (name: string, accent: boolean) => (
    <div style={{width: 84 * u, height: 84 * u, borderRadius: 24 * u, background: accent ? 'rgba(255,255,255,0.18)' : GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
      <Icon name={name} size={46 * u} color="#fff" stroke={2} />
    </div>
  );
  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 0, y: 50, r: 320, color: C.blue, seed: 's'},
          {x: 100, y: 30, r: 340, color: C.violet, seed: 't'},
        ]}
        blobOpacity={0.5}
      />
      {/* spotlight */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${(pos(2).x / w) * 100}% ${(pos(2).y / h) * 100}%, rgba(7,7,15,0) 0%, rgba(7,7,15,0) 22%, rgba(7,7,15,0.88) 55%)`,
          opacity: spot,
        }}
      />
      <div style={{position: 'absolute', left: 0, right: 0, top: (portrait ? 150 : 90) * u, textAlign: 'center'}}>
        <H size={portrait ? 96 : 100} color={spot > 0.5 ? '#fff' : C.ink}>
          <W t={konten}>Konten </W>
          <W t={at(19, 'harus')}>harus </W>
          <W t={at(19, 'punya')} look="grad">
            punya
          </W>
        </H>
        <Label size={26} color={spot > 0.5 ? C.violetLight : C.violet} style={{marginTop: 18 * u, opacity: prog(t, terpenting, 0.3)}}>
          <W t={dan}>dan </W>
          <W t={at(19, 'yang')}>yang </W>
          <W t={terpenting} style={{color: spot > 0.5 ? '#fff' : C.ink}}>
            ★ terpenting
          </W>
        </Label>
      </div>
      {card(
        0,
        pesan,
        <>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 * u}}>
            {iconTile('chat', false)}
            {portrait ? null : tag('01 · message', false)}
          </div>
          {portrait ? null : <Typing t0={pesan} />}
          <div style={{flex: portrait ? 1 : undefined}}>
            {portrait ? tag('01 · message', false) : null}
            <H size={portrait ? 92 : 84} align="left">
              <W t={pesan}>pesan,</W>
            </H>
          </div>
        </>,
      )}
      {card(
        1,
        karakter,
        <>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 * u}}>
            {iconTile('user', false)}
            {portrait ? null : tag('02 · persona', false)}
          </div>
          {portrait ? null : (
            <div style={{display: 'flex', alignItems: 'center', gap: 18 * u}}>
              <div style={{width: 130 * u, height: 130 * u, borderRadius: '50%', overflow: 'hidden', border: `${5 * u}px solid ${C.violetLight}`, flexShrink: 0, transform: `scale(${prog(t, karakter + 0.1, 0.5, ease.outBackStrong)})`}}>
                <Media src="photos/fashion-girl-pink.jpg" pos="50% 25%" />
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 8 * u}}>
                {['bold', 'playful', 'relatable'].map((s, i) => (
                  <span
                    key={s}
                    style={{
                      padding: `${8 * u}px ${16 * u}px`,
                      borderRadius: 999,
                      background: i === 0 ? GRAD : 'rgba(7,7,15,0.06)',
                      color: i === 0 ? '#fff' : C.ink,
                      fontFamily: F.mono,
                      fontWeight: 700,
                      fontSize: 20 * u,
                      transform: `scale(${prog(t, karakter + 0.25 + i * 0.1, 0.4, ease.outBackStrong)})`,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div style={{flex: portrait ? 1 : undefined}}>
            {portrait ? tag('02 · persona', false) : null}
            <H size={portrait ? 92 : 84} align="left">
              <W t={karakter}>karakter,</W>
            </H>
          </div>
        </>,
      )}
      {card(
        2,
        at(19, 'punya', 2),
        <>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 * u}}>
            <div style={{width: 84 * u, height: 84 * u, borderRadius: 24 * u, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <Eye open={Math.max(0.15, eye)} size={56 * u} />
            </div>
            {portrait ? null : tag('03 · attention', true)}
          </div>
          <div style={{flex: portrait ? 1 : undefined}}>
            {portrait ? tag('03 · attention', true) : null}
            <H size={portrait ? 64 : 62} align="left" color="#fff" lh={1.05}>
              <W t={alasan} dark style={{fontSize: '1.45em'}}>
                alasan
              </W>
              <br />
              <W t={at(19, 'untuk')} dark>
                untuk{' '}
              </W>
              <W t={diper} dark look="serif" style={{backgroundImage: 'linear-gradient(90deg,#fff,#E1D4FF)'}}>
                diperhatikan.
              </W>
            </H>
          </div>
        </>,
        true,
      )}
      {/* attention rings */}
      {[0, 1, 2].map((k) => {
        const x = (t - diper - k * 0.25) / 1.1;
        if (x <= 0 || x >= 1) return null;
        const {x: px, y: py} = pos(2);
        const r = mix(cw * 0.55, cw * 1.3, ease.outCubic(x));
        return <div key={k} style={{position: 'absolute', left: px - r, top: py - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `${4 * u}px solid ${C.violetLight}`, opacity: 1 - x}} />;
      })}
    </AbsoluteFill>
  );
};
