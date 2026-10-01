import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {InkBg} from '../components/Backgrounds';
import {Label, W, at, lookStyle} from '../components/Text';
import {At, Media} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog, spr} from '../lib/anim';

type Service = {
  name: string;
  t: number;
  src: string;
  trim?: number;
  pos?: string;
  icon: string;
  chrome?: 'ig' | 'reel' | 'film' | 'rec' | 'ad' | 'poster';
};

const SERVICES: Service[] = [
  {name: 'company profile', t: at(10, 'company'), src: 'videos/corporate-meeting-result-bts.mp4', pos: '0% 50%', icon: 'building', chrome: 'rec'},
  {name: 'commercial ads', t: at(10, 'commercial'), src: 'videos/reel-kahf-before-after.mp4', trim: 8, icon: 'megaphone', chrome: 'ad'},
  {name: 'corporate documentation', t: at(10, 'corporate'), src: 'videos/corporate-portrait-result-bts.mp4', pos: '100% 50%', icon: 'camera', chrome: 'rec'},
  {name: 'short movie', t: at(11, 'short'), src: 'photos/poster-lara-bisu.jpg', icon: 'clapper', chrome: 'poster'},
  {name: 'film', t: at(11, 'film'), src: 'videos/reel-street-fashion-bts.mp4', trim: 7.5, icon: 'film', chrome: 'film'},
  {name: 'social media content', t: at(11, 'social'), src: 'photos/fashion-girl-phones.jpg', pos: '50% 40%', icon: 'heart', chrome: 'ig'},
  {name: 'reels production', t: at(11, 'reels'), src: 'videos/reel-studio-campus.mp4', trim: 6.8, icon: 'phone', chrome: 'reel'},
  {name: 'product photography', t: at(12, 'product'), src: 'photos/product-kahf-red.jpg', pos: '62% 50%', icon: 'image'},
  {name: 'corporate photoshoot', t: at(12, 'corporate'), src: 'videos/studio-portrait-result-bts.mp4', pos: '0% 50%', icon: 'user', chrome: 'rec'},
];

const Chrome: React.FC<{kind?: Service['chrome']; t0: number}> = ({kind, t0}) => {
  const t = useT();
  const {u} = useLayout();
  if (!kind) return null;
  const p = prog(t, t0 + 0.15, 0.4, ease.outExpo);
  const mono: React.CSSProperties = {fontFamily: F.mono, fontWeight: 700, color: '#fff', fontSize: 22 * u, letterSpacing: '0.08em'};
  if (kind === 'rec') {
    const blink = Math.floor(t * 2.5) % 2 === 0;
    return (
      <div style={{position: 'absolute', right: 26 * u, top: 26 * u, display: 'flex', alignItems: 'center', gap: 10 * u, opacity: p, ...mono}}>
        <span style={{width: 16 * u, height: 16 * u, borderRadius: '50%', background: C.violetLight, opacity: blink ? 1 : 0.3}} /> REC
      </div>
    );
  }
  if (kind === 'ad') {
    return (
      <div style={{position: 'absolute', right: 26 * u, top: 26 * u, padding: `${6 * u}px ${14 * u}px`, borderRadius: 8 * u, background: '#fff', color: C.ink, opacity: p, ...mono}}>
        <span style={{color: C.ink}}>SPONSORED</span>
      </div>
    );
  }
  if (kind === 'film' || kind === 'poster') {
    const bar = mix(0, kind === 'film' ? 0.12 : 0.0, p);
    return (
      <>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: `${bar * 100}%`, background: '#000'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${bar * 100}%`, background: '#000'}} />
        {kind === 'film' ? (
          <div style={{position: 'absolute', left: 24 * u, bottom: 22 * u, opacity: p, ...mono}}>SC 04 · TK 2 · 23.976</div>
        ) : null}
      </>
    );
  }
  if (kind === 'ig') {
    const like = prog(t, t0 + 0.5, 0.45, ease.outBackStrong);
    return (
      <>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, padding: 20 * u, display: 'flex', alignItems: 'center', gap: 12 * u, background: 'linear-gradient(180deg, rgba(0,0,0,0.45), transparent)', opacity: p}}>
          <div style={{width: 44 * u, height: 44 * u, borderRadius: '50%', background: GRAD, border: `${3 * u}px solid #fff`}} />
          <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 24 * u, color: '#fff'}}>Ruber Visual</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: 22 * u, display: 'flex', gap: 22 * u, background: 'linear-gradient(0deg, rgba(0,0,0,0.5), transparent)', opacity: p}}>
          <Icon name="heart" size={40 * u} color="#fff" fill={like > 0.5 ? '#fff' : 'none'} stroke={2} style={{transform: `scale(${1 + bump(t, t0 + 0.5, 0.3) * 0.5})`}} />
          <Icon name="comment" size={40 * u} color="#fff" stroke={2} />
          <Icon name="share" size={40 * u} color="#fff" stroke={2} />
        </div>
        {like > 0 ? (
          <div style={{position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${like * (1 - prog(t, t0 + 1.0, 0.3))})`}}>
            <Icon name="heart" size={180 * u} color="#fff" fill="#fff" stroke={1} />
          </div>
        ) : null}
      </>
    );
  }
  if (kind === 'reel') {
    const p2 = clamp01((t - t0) / 1.5);
    return (
      <>
        <div style={{position: 'absolute', left: 24 * u, top: 24 * u, display: 'flex', alignItems: 'center', gap: 10 * u, opacity: p, ...mono}}>
          <Icon name="play" size={26 * u} color="#fff" fill="#fff" /> REELS
        </div>
        <div style={{position: 'absolute', left: 24 * u, right: 24 * u, bottom: 26 * u, height: 6 * u, borderRadius: 9, background: 'rgba(255,255,255,0.3)', opacity: p}}>
          <div style={{width: `${p2 * 100}%`, height: '100%', borderRadius: 9, background: '#fff'}} />
        </div>
      </>
    );
  }
  return null;
};

// "Mulai dari company profile, commercial ads, ... sampai corporate photoshoot."
export const S10Services: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const mulai = at(10, 'mulai');
  const sampai = at(12, 'sampai');
  // continuous index: each service adds a spring step
  const a = SERVICES.slice(1).reduce((acc, s) => acc + spr(t, s.t - 0.06, 260, 24), 0);
  const active = Math.round(a);
  const cardH = portrait ? h * 0.47 : h * 0.8;
  const cardW = cardH * 0.8;
  const cardX = portrait ? w / 2 : w * 0.72;
  const cardY = portrait ? h * 0.31 : h * 0.5;
  const wheelX = portrait ? w / 2 : w * 0.06;
  const wheelY = portrait ? h * 0.76 : h * 0.52;
  const rowH = (portrait ? 108 : 118) * u;
  const listW = portrait ? w * 0.9 : w * 0.5;
  const intro = prog(t, mulai - 0.2, 0.6, ease.outExpo);
  return (
    <AbsoluteFill>
      <InkBg glow={[[C.blue, portrait ? 50 : 72, portrait ? 30 : 50], [C.violet, 10, 90]]} />
      {/* giant ghost marquee of the active service */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: portrait ? h * 0.56 : h * 0.06,
          whiteSpace: 'nowrap',
          fontFamily: F.display,
          fontWeight: 800,
          fontSize: 260 * u,
          letterSpacing: '-0.05em',
          color: 'transparent',
          WebkitTextStroke: `${2 * u}px rgba(255,255,255,0.08)`,
          transform: `translateX(${-((t - mulai) * 240 * u) % (w * 1.5)}px)`,
        }}
      >
        {`${SERVICES[active].name} · ${SERVICES[active].name} · ${SERVICES[active].name}`}
      </div>
      {/* header */}
      <div style={{position: 'absolute', left: portrait ? 0 : wheelX, right: portrait ? 0 : undefined, top: portrait ? h * 0.585 : h * 0.12, textAlign: portrait ? 'center' : 'left', opacity: intro}}>
        <Label size={28} color={C.violetLight}>
          <W t={mulai}>mulai </W>
          <W t={at(10, 'dari')}>dari</W>
          {t >= sampai ? (
            <W t={sampai} style={{marginLeft: '0.6em', color: '#fff'}}>
              → sampai
            </W>
          ) : null}
        </Label>
      </div>
      {/* wheel */}
      <div
        style={{
          position: 'absolute',
          left: portrait ? (w - listW) / 2 : wheelX,
          top: wheelY,
          width: listW,
          height: 0,
          maskImage: 'none',
        }}
      >
        {SERVICES.map((s, i) => {
          const d = i - a;
          const ad = Math.abs(d);
          if (ad > 3.2) return null;
          const on = ad < 0.5;
          const appear = prog(t, mulai + i * 0.04, 0.5, ease.outExpo);
          const base = Math.min(portrait ? 92 : 96, (listW * 0.92) / (s.name.length * 0.55));
          const sc = mix(1, 0.5, Math.min(1, ad));
          const y = d * rowH * (ad < 1 ? 1 : 0.85 + 0.15 / ad) + (ad >= 1 ? Math.sign(d) * 18 * u : 0);
          return (
            <div
              key={s.name}
              style={{
                position: 'absolute',
                left: 0,
                width: listW,
                top: y,
                transform: `translateY(-50%) scale(${sc})`,
                transformOrigin: portrait ? '50% 50%' : '0% 50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: portrait ? 'center' : 'flex-start',
                gap: 22 * u,
                opacity: appear * mix(1, 0.32, Math.min(1, ad)) * (ad > 2.2 ? 1 - (ad - 2.2) : 1),
                filter: ad > 0.6 ? `blur(${(ad - 0.6) * 2.5}px)` : undefined,
              }}
            >
              <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 30 * u, color: on ? C.violetLight : 'rgba(255,255,255,0.6)'}}>{String(i + 1).padStart(2, '0')}</span>
              <span
                style={{
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: base * u,
                  letterSpacing: '-0.045em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  color: '#fff',
                  ...(on ? lookStyle('grad', true) : {}),
                  ...(on ? {backgroundImage: `linear-gradient(100deg, #fff 0%, ${C.blueLight} 45%, ${C.violetLight} 100%)`} : {}),
                }}
              >
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
      {/* counter */}
      <div
        style={{
          position: 'absolute',
          left: portrait ? 0 : wheelX,
          right: portrait ? 0 : undefined,
          bottom: portrait ? h * 0.04 : h * 0.1,
          textAlign: portrait ? 'center' : 'left',
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 34 * u,
          color: '#fff',
          opacity: intro,
          display: 'flex',
          alignItems: 'center',
          justifyContent: portrait ? 'center' : 'flex-start',
          gap: 18 * u,
        }}
      >
        <span>{String(active + 1).padStart(2, '0')}</span>
        <span style={{width: 220 * u, height: 4 * u, background: 'rgba(255,255,255,0.15)', borderRadius: 9, position: 'relative'}}>
          <span style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${((a + 1) / SERVICES.length) * 100}%`, background: GRAD, borderRadius: 9}} />
        </span>
        <span style={{color: 'rgba(255,255,255,0.5)'}}>{String(SERVICES.length).padStart(2, '0')}</span>
      </div>
      {/* media deck */}
      {SERVICES.map((s, i) => {
        const next = SERVICES[i + 1]?.t ?? 999;
        if (t < s.t - 0.25 || t > next + 0.6) return null;
        const p = spr(t, s.t - 0.12, 200, 20);
        const leave = prog(t, next - 0.1, 0.55, ease.inOutCubic);
        const dir = i % 2 === 0 ? 1 : -1;
        const x = cardX + mix(w * 0.35 * (portrait ? 0 : 1), 0, p) - leave * 40 * u;
        const y = cardY + mix(portrait ? h * 0.5 : h * 0.15, 0, p) + leave * 30 * u;
        const rot = mix(dir * 14, dir * -2.5, p) + leave * dir * -4;
        const sc = mix(1.15, 1, p) * mix(1, 0.86, leave) * (1 + bump(t, s.t + 0.05, 0.3) * 0.03);
        return (
          <div
            key={s.name}
            style={{
              position: 'absolute',
              left: x - cardW / 2,
              top: y - cardH / 2,
              width: cardW,
              height: cardH,
              borderRadius: 34 * u,
              overflow: 'hidden',
              transform: `rotate(${rot}deg) scale(${sc})`,
              boxShadow: `0 ${40 * u}px ${90 * u}px rgba(0,0,0,0.6)`,
              border: `${2 * u}px solid rgba(255,255,255,0.18)`,
              background: C.ink2,
              filter: leave > 0 ? `brightness(${1 - leave * 0.55}) blur(${leave * 6}px)` : p < 0.5 ? 'url(#mbx2)' : undefined,
              opacity: Math.min(1, p * 3),
            }}
          >
            <At t={s.t - 0.25}>
              <Media src={s.src} trim={s.trim} pos={s.pos} />
            </At>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(7,7,15,0.55))'}} />
            <Chrome kind={s.chrome} t0={s.t} />
            <div
              style={{
                position: 'absolute',
                left: 24 * u,
                bottom: s.chrome === 'ig' || s.chrome === 'reel' || s.chrome === 'film' ? 96 * u : 26 * u,
                display: 'flex',
                alignItems: 'center',
                gap: 12 * u,
                padding: `${10 * u}px ${18 * u}px`,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.14)',
                border: `${1.5 * u}px solid rgba(255,255,255,0.25)`,
                backdropFilter: 'blur(10px)',
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 22 * u,
                color: '#fff',
                letterSpacing: '0.06em',
                opacity: prog(t, s.t + 0.1, 0.3),
              }}
            >
              <Icon name={s.icon} size={26 * u} color="#fff" stroke={2.2} />
              {s.name.toUpperCase()}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
