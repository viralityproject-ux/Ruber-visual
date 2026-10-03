import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, GRAD, GRAD_MID} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {GrowCover} from '../components/Cover';
import {H, Label, W, at} from '../components/Text';
import {Icon} from '../components/Icons';
import {FloatHeart, Sparkle} from '../components/Illos';
import {useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog} from '../lib/anim';

const AUDIENCE = [
  'photos/street-girl-portrait.jpg',
  'photos/street-boy-bag.jpg',
  'photos/fashion-hijab-cap.jpg',
  'photos/fashion-man-sneakers.jpg',
  'photos/fashion-hijab-vest.jpg',
  'photos/street-boy-lowangle.jpg',
  'photos/fashion-hijab-purple.jpg',
  'photos/street-girl-sit.jpg',
];

const Ticks: React.FC<{n: number; color: string}> = ({n, color}) => (
  <svg width={44} height={24} viewBox="0 0 44 24">
    <path d="M2 13l6 6L20 6" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    {n > 1 ? <path d="M16 15l4 4L32 6" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /> : null}
  </svg>
);

// "Pengalaman tersebut membuat kami memahami bahwa visual bukan hanya tentang bagaimana sesuatu terlihat,
//  tetapi juga tentang bagaimana pesan dapat diterima, diingat, dan relevan bagi audience-nya."
export const A10Message: React.FC = () => {
  const t = useT();
  const pengalaman = at(45, 'pengalaman');
  const tersebut = at(45, 'tersebut');
  const membuat = at(45, 'membuat');
  const kami = at(45, 'kami');
  const memahami = at(45, 'memahami');
  const bahwa = at(45, 'bahwa');
  const visual = at(45, 'visual');
  const bukan = at(46, 'bukan');
  const hanya = at(46, 'hanya');
  const tentang = at(46, 'tentang');
  const bagaimana = at(46, 'bagaimana');
  const sesuatu = at(46, 'sesuatu');
  const terlihat = at(46, 'terlihat');
  const tetapi = at(47, 'tetapi');
  const pesan = at(47, 'pesan');
  const dapat = at(47, 'dapat');
  const diterima = at(47, 'diterima');
  const diingat = at(48, 'diingat');
  const relevan = at(48, 'relevan');
  const bagi = at(48, 'bagi');
  const audience = at(48, 'audience');

  // ---------------- giant photo-filled "visual" ----------------
  const vIn = prog(t, visual - 0.08, 0.6, ease.outExpo);
  const vUp = prog(t, bukan - 0.1, 0.55, ease.inOutExpo);
  const vOut = prog(t, tetapi - 0.15, 0.4, ease.inCubic);
  const vScale = mix(mix(0.8, 1, vIn), 0.36, vUp);
  const vY = mix(560, 150, vUp);

  // ---------------- parts ----------------
  const aOut = prog(t, visual - 0.3, 0.3, ease.inCubic);
  const bIn = prog(t, bukan, 0.55, ease.outExpo);
  const bOut = prog(t, tetapi - 0.15, 0.4, ease.inCubic);
  const strike = prog(t, terlihat + 0.28, 0.3, ease.outQuart);
  const blink = bump(t, 113.4, 0.22) + bump(t, 114.0, 0.2);
  const cIn = prog(t, tetapi - 0.05, 0.6, ease.outExpo);
  const toCards = prog(t, diingat - 0.25, 0.55, ease.inOutExpo);
  const collapse = prog(t, 120.92, 0.22, ease.inCubic);
  const tick1 = t > tetapi + 0.6;
  const tick2 = t > pesan + 0.1;
  const read = prog(t, diterima, 0.35, ease.outBackStrong);

  const chat = {
    x: mix(960, 400, toCards),
    y: mix(560, 520, toCards),
    s: mix(1, 0.62, toCards),
  };
  const cardPos = (i: number) => ({x: 400 + i * 560, y: 520});

  return (
    <AbsoluteFill>
      <PaperBg
        fadeFrom={108.85}
        blobs={[
          {x: 12, y: 15, r: 320, color: C.violetSoft, seed: 'v1'},
          {x: 90, y: 88, r: 360, color: C.blueSoft, seed: 'v2'},
        ]}
      />
      <AbsoluteFill style={{transform: `scale(${mix(1, 0.05, collapse)})`, transformOrigin: '960px 560px', opacity: 1 - clamp01((collapse - 0.7) * 4)}}>
        {/* ================= A: pengalaman tersebut membuat kami memahami bahwa ================= */}
        {t < visual + 0.2 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 1 - aOut, transform: `translateY(${-aOut * 80}px)`}}>
            <H size={108}>
              <W t={pengalaman}>pengalaman </W>
              <W t={tersebut} look="serif" style={{fontSize: '1.1em'}}>
                tersebut
              </W>
            </H>
            <H size={74} weight={700} color={C.muted} style={{marginTop: 18}}>
              <W t={membuat}>membuat </W>
              <W t={kami}>kami </W>
              <span style={{position: 'relative', display: 'inline-block', color: C.ink, fontWeight: 800}}>
                <span
                  style={{
                    position: 'absolute',
                    left: '-3%',
                    bottom: '6%',
                    height: '42%',
                    width: `${prog(t, memahami + 0.1, 0.45, ease.outQuart) * 106}%`,
                    background: GRAD_MID,
                    opacity: 0.22,
                    borderRadius: 8,
                  }}
                />
                <W t={memahami}>memahami</W>
              </span>
            </H>
            <Label size={30} color={C.blueMid} style={{marginTop: 26}}>
              <W t={bahwa}>bahwa</W>
            </Label>
          </div>
        ) : null}

        {/* the giant word, filled with a real shoot */}
        {t > visual - 0.1 && vOut < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: 960 - 760,
              top: vY - 240,
              width: 1520,
              height: 480,
              transform: `scale(${vScale})`,
              opacity: clamp01(vIn * 2) * (1 - vOut),
              filter: vIn < 0.98 ? `blur(${(1 - vIn) * 16}px)` : undefined,
            }}
          >
            <svg width={0} height={0} style={{position: 'absolute'}}>
              <defs>
                <clipPath id="visualWord" clipPathUnits="userSpaceOnUse">
                  <text x={760} y={385} textAnchor="middle" style={{fontFamily: F.display, fontWeight: 800, fontSize: 470, letterSpacing: '-0.055em'}}>
                    visual
                  </text>
                </clipPath>
              </defs>
            </svg>
            <div style={{position: 'absolute', inset: 0, clipPath: 'url(#visualWord)'}}>
              <Img
                src={staticFile('photos/p41-stage-confetti.jpg')}
                style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 40%', transform: `scale(${mix(1.25, 1.05, prog(t, visual, 2.5, ease.outCubic))})`}}
              />
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(23,42,134,0.25), rgba(67,28,145,0.25))'}} />
            </div>
          </div>
        ) : null}

        {/* ================= B: not only how it looks ================= */}
        {bIn > 0 && bOut < 1 ? (
          <AbsoluteFill style={{opacity: clamp01(bIn * 2) * (1 - bOut), transform: `translateX(${(1 - bIn) * 120 - bOut * 200}px)`}}>
            <div style={{position: 'absolute', left: 230, top: 380, width: 520, height: 320}}>
              <svg width={520} height={320} viewBox="-260 -160 520 320" style={{overflow: 'visible'}}>
                <defs>
                  <linearGradient id="irisG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={C.blueMid} />
                    <stop offset="1" stopColor={C.violetMid} />
                  </linearGradient>
                  <clipPath id="eyeClip">
                    <path d={`M-230 0 C -120 ${-150 * (1 - blink)}, 120 ${-150 * (1 - blink)}, 230 0 C 120 ${150 * (1 - blink)}, -120 ${150 * (1 - blink)}, -230 0 Z`} />
                  </clipPath>
                </defs>
                <path d={`M-230 0 C -120 ${-150 * (1 - blink)}, 120 ${-150 * (1 - blink)}, 230 0 C 120 ${150 * (1 - blink)}, -120 ${150 * (1 - blink)}, -230 0 Z`} fill="#fff" stroke={C.ink} strokeWidth={10} strokeLinejoin="round" />
                <g clipPath="url(#eyeClip)">
                  <circle cx={Math.sin(t * 1.4) * 30} cy={0} r={86} fill="url(#irisG)" />
                  <circle cx={Math.sin(t * 1.4) * 30} cy={0} r={38} fill={C.ink} />
                  <circle cx={Math.sin(t * 1.4) * 30 - 22} cy={-26} r={14} fill="#fff" />
                </g>
                {[-150, -100, -50, 0, 50, 100, 150].map((x, i) => (
                  <line key={i} x1={x} y1={-118 * (1 - blink) - 4} x2={x * 1.12} y2={-150 * (1 - blink) - 26} stroke={C.ink} strokeWidth={8} strokeLinecap="round" opacity={1 - blink} />
                ))}
              </svg>
              {[
                [-10, 20, 46, 0],
                [490, 40, 34, 0.1],
                [470, 280, 40, 0.2],
              ].map(([x, y, s, d], i) => (
                <div key={i} style={{position: 'absolute', left: x - s / 2, top: y - s / 2}}>
                  <Sparkle size={s} color={i % 2 ? C.violetMid : C.blueMid} p={prog(t, sesuatu + d, 0.4, ease.outBackStrong) * (1 - strike)} rot={t * 50} />
                </div>
              ))}
            </div>
            <div style={{position: 'absolute', left: 860, top: 360}}>
              <H size={66} align="left" weight={700} color={C.muted} lh={1.1}>
                <W t={bukan}>bukan </W>
                <W t={hanya}>hanya </W>
                <W t={tentang}>tentang</W>
                <br />
                <W t={bagaimana}>bagaimana </W>
                <W t={sesuatu}>sesuatu</W>
              </H>
              <div style={{position: 'relative', display: 'inline-block', marginTop: 12}}>
                <H size={168} align="left">
                  <W t={terlihat} look="serif" style={{fontSize: '1.08em'}}>
                    terlihat.
                  </W>
                </H>
                <div style={{position: 'absolute', left: '-3%', top: '54%', height: 14, borderRadius: 7, width: `${strike * 104}%`, background: C.violetMid, transform: 'rotate(-4deg)', transformOrigin: 'left center'}} />
              </div>
            </div>
          </AbsoluteFill>
        ) : null}

        {/* ================= C: the message is received ================= */}
        {cIn > 0 ? (
          <>
            <div style={{position: 'absolute', left: 0, right: 0, top: 84, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 1 - prog(t, diingat - 0.3, 0.3)}}>
              <Label size={26} color={C.blueMid}>
                <W t={tetapi}>tetapi juga tentang bagaimana</W>
              </Label>
              <H size={120} style={{marginTop: 4}}>
                <W t={pesan} look="grad">
                  pesan{' '}
                </W>
                <W t={dapat} style={{fontSize: '0.5em', fontWeight: 700, color: C.muted}}>
                  dapat{' '}
                </W>
                <W t={diterima} look="serif" style={{fontSize: '1.1em'}}>
                  diterima.
                </W>
              </H>
            </div>
            {/* chat card → becomes card 1 */}
            <div
              style={{
                position: 'absolute',
                left: chat.x - 360,
                top: chat.y - 230 + (1 - cIn) * 120,
                width: 720,
                height: 460,
                transform: `scale(${chat.s * mix(0.9, 1, cIn)})`,
                opacity: clamp01(cIn * 2),
              }}
            >
              <div style={{position: 'absolute', inset: 0, borderRadius: 36, background: '#fff', boxShadow: '0 40px 90px rgba(20,16,65,0.18)', overflow: 'hidden'}}>
                <div style={{height: 88, borderBottom: `2px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 30px'}}>
                  <div style={{display: 'flex'}}>
                    {AUDIENCE.slice(0, 3).map((src, i) => (
                      <div key={src} style={{width: 46, height: 46, borderRadius: 23, overflow: 'hidden', border: '3px solid #fff', marginLeft: i ? -14 : 0}}>
                        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 26, color: C.ink}}>Audience</div>
                    <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 18, color: '#22A35A'}}>online</div>
                  </div>
                </div>
                {/* the bubble */}
                <div
                  style={{
                    position: 'absolute',
                    right: 30,
                    top: 116,
                    width: 440,
                    borderRadius: '28px 28px 8px 28px',
                    background: GRAD,
                    padding: 14,
                    boxSizing: 'border-box',
                    transform: `scale(${prog(t, tetapi + 0.3, 0.5, ease.outBackStrong)})`,
                    transformOrigin: '100% 100%',
                    boxShadow: '0 20px 40px rgba(23,42,134,0.3)',
                  }}
                >
                  <div style={{height: 190, borderRadius: 18, overflow: 'hidden'}}>
                    <Img src={staticFile('photos/paragon-empowered.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                  <div style={{padding: '14px 8px 4px', fontFamily: F.display, fontWeight: 700, fontSize: 24, color: '#fff'}}>Pesan utama, tersampaikan.</div>
                </div>
                <div style={{position: 'absolute', right: 34, top: 392, display: 'flex', alignItems: 'center', gap: 8, fontFamily: F.display, fontWeight: 600, fontSize: 20, color: C.muted}}>
                  {read > 0 ? (
                    <span style={{color: C.violetMid, fontWeight: 800, transform: `scale(${read})`, display: 'inline-block'}}>Dibaca</span>
                  ) : tick2 ? (
                    'Terkirim'
                  ) : tick1 ? (
                    'Mengirim…'
                  ) : null}
                  {tick1 ? <Ticks n={tick2 ? 2 : 1} color={read > 0 ? C.violetMid : C.muted} /> : null}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* ================= D: received · remembered · relevant ================= */}
        {toCards > 0 ? (
          <>
            {[
              {word: 'diterima', icon: 'check', t0: diterima, sub: 'pesan sampai'},
              {word: 'diingat', icon: 'sparkle', t0: diingat, sub: 'melekat di benak'},
              {word: 'relevan', icon: 'target', t0: relevan, sub: 'tepat sasaran'},
            ].map((c, i) => {
              const p = i === 0 ? toCards : prog(t, c.t0 - 0.08, 0.5, ease.outBackStrong);
              const pos = cardPos(i);
              return (
                <div
                  key={c.word}
                  style={{
                    position: 'absolute',
                    left: pos.x - 230,
                    top: pos.y - 160,
                    width: 460,
                    height: 320,
                    borderRadius: 34,
                    background: i === 0 ? '#fff' : i === 1 ? GRAD : C.ink,
                    boxShadow: '0 40px 80px rgba(20,16,65,0.2)',
                    transform: `translateY(${(1 - p) * 80}px) scale(${mix(0.85, 1, p) * (1 + bump(t, c.t0, 0.35) * 0.04)})`,
                    opacity: clamp01(p * 2),
                    padding: 40,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{width: 76, height: 76, borderRadius: 22, background: i === 0 ? GRAD : 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name={c.icon} size={42} color="#fff" stroke={2.4} />
                  </div>
                  <div>
                    <div style={{fontFamily: i === 1 ? F.serif : F.display, fontStyle: i === 1 ? 'italic' : 'normal', fontWeight: i === 1 ? 400 : 800, fontSize: i === 1 ? 84 : 72, letterSpacing: '-0.04em', color: i === 0 ? C.ink : '#fff', lineHeight: 1}}>{c.word}</div>
                    <div style={{fontFamily: F.mono, fontSize: 20, letterSpacing: '0.08em', color: i === 0 ? C.muted : 'rgba(255,255,255,0.7)', marginTop: 10}}>{c.sub.toUpperCase()}</div>
                  </div>
                </div>
              );
            })}
            {/* audience row */}
            <div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18}}>
              <Label size={24} color={C.blueMid} style={{marginRight: 16}}>
                <W t={bagi}>bagi</W>
              </Label>
              {AUDIENCE.map((src, i) => {
                const p = prog(t, audience - 0.1 + i * 0.05, 0.45, ease.outBackStrong);
                return (
                  <div key={src} style={{position: 'relative', width: 92, height: 92, transform: `scale(${p}) translateY(${-bump(t, audience + 0.3 + i * 0.05, 0.35) * 16}px)`}}>
                    <div style={{width: 92, height: 92, borderRadius: 46, overflow: 'hidden', boxShadow: '0 0 0 4px #fff, 0 10px 24px rgba(20,16,65,0.2)'}}>
                      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    </div>
                    <FloatHeart t0={audience + 0.15 + i * 0.07} x={46} y={10} size={30} color={i % 2 ? C.violetMid : C.blueMid} drift={i - 3.5} />
                  </div>
                );
              })}
              <H size={64} style={{marginLeft: 18}}>
                <W t={audience} look="serif" style={{fontSize: '1.1em'}}>
                  audience-nya.
                </W>
              </H>
            </div>
          </>
        ) : null}
      </AbsoluteFill>
      {/* everything collapses into the dark of the next idea */}
      <GrowCover t0={121.02} dur={0.33} x={960} y={560} color={C.ink} r0={6} fn={ease.inCubic} />
    </AbsoluteFill>
  );
};

