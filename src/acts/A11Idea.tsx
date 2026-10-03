import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, GRAD} from '../theme';
import {DotGrid, InkBg} from '../components/Backgrounds';
import {GrowCover} from '../components/Cover';
import {H, Label, W, at} from '../components/Text';
import {At, Cursor, Media} from '../components/UI';
import {Icon} from '../components/Icons';
import {FloatHeart, PhoneFrame} from '../components/Illos';
import {useT} from '../lib/scene';
import {bump, ease, mix, prog} from '../lib/anim';
import {beatPulse} from '../lib/beat';

const CX = 960;
const CY = 540;

const gearPath = (r: number, rIn: number, teeth: number, hole: number) => {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const seq: [number, number][] = [
      [a - step * 0.5, rIn],
      [a - step * 0.22, rIn],
      [a - step * 0.14, r],
      [a + step * 0.14, r],
      [a + step * 0.22, rIn],
    ];
    for (const [aa, rr] of seq) pts.push(`${(Math.cos(aa) * rr).toFixed(1)} ${(Math.sin(aa) * rr).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z M${hole} 0 A${hole} ${hole} 0 1 0 ${-hole} 0 A${hole} ${hole} 0 1 0 ${hole} 0 Z`;
};

const AUDIENCE = [
  'photos/fashion-hijab-glasses.jpg',
  'photos/street-jump.jpg',
  'photos/fashion-girl-pink.jpg',
  'photos/street-duo-01.jpg',
  'photos/fashion-hijab-orange.jpg',
  'photos/fashion-trio.jpg',
  'photos/street-girl-selfie.jpg',
  'photos/fashion-duo-wide.jpg',
  'photos/fashion-group-barrier.jpg',
  'photos/street-boy-bag.jpg',
  'photos/fashion-hijab-vest.jpg',
  'photos/street-girl-portrait.jpg',
];

// "Dari sebuah ide, menjadi sebuah proses, kemudian diwujudkan menjadi karya yang siap bertemu dengan audience-nya."
export const A11Idea: React.FC = () => {
  const t = useT();
  const bp = beatPulse(t);
  const dari = at(49, 'dari');
  const sebuah = at(49, 'sebuah');
  const ide = at(49, 'ide');
  const menjadi = at(50, 'menjadi');
  const sebuah2 = at(50, 'sebuah');
  const proses = at(50, 'proses');
  const kemudian = at(51, 'kemudian');
  const diwujudkan = at(51, 'diwujudkan');
  const karya = at(51, 'karya');
  const siap = at(51, 'siap');
  const bertemu = at(51, 'bertemu');
  const dengan = at(52, 'dengan');
  const audience = at(52, 'audience');

  // ---------------- the morph chain ----------------
  const bulbIn = prog(t, 121.42, 0.5, ease.outBackStrong);
  const lit = prog(t, ide - 0.04, 0.45, ease.outExpo);
  const toGears = prog(t, menjadi - 0.15, 0.6, ease.inOutExpo);
  const gearsIn = prog(t, menjadi - 0.05, 0.6, ease.outBackStrong);
  const toPhone = prog(t, kemudian - 0.1, 0.6, ease.inOutExpo);
  const phoneIn = prog(t, kemudian + 0.15, 0.6, ease.outBackStrong);
  const published = prog(t, siap, 0.35, ease.outBackStrong);
  const ring = (i: number) => prog(t, bertemu + i * 0.045, 0.5, ease.outBackStrong);
  const converge = prog(t, 129.08, 0.3, ease.inCubic);
  const spin = (t - menjadi) * 120 * (1 + toPhone * 2);

  return (
    <AbsoluteFill>
      <InkBg
        fadeFrom={121.4}
        glow={[
          [C.blue, 25, 30],
          [C.violet, 80, 75],
        ]}
        dots={false}
      />
      <DotGrid color="rgba(255,255,255,0.12)" gap={38} opacity={(0.35 + bp * 0.25) * prog(t, 121.4, 0.9, ease.inCubic)} />
      <AbsoluteFill style={{transform: `scale(${mix(1, 0.02, converge)})`, transformOrigin: `${CX}px ${CY}px`}}>
        {/* ---------------- ide: the bulb ---------------- */}
        {toGears < 1 ? (
          <div style={{position: 'absolute', left: CX - 200, top: CY - 250, width: 400, height: 470, transform: `scale(${bulbIn * mix(1, 0.3, toGears)})`, opacity: 1 - toGears}}>
            <svg width={400} height={470} viewBox="-200 -230 400 470" style={{overflow: 'visible'}}>
              <defs>
                <radialGradient id="bulbLight" cx="50%" cy="45%" r="60%">
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="0.35" stopColor={C.blueLight} />
                  <stop offset="1" stopColor={C.violetMid} />
                </radialGradient>
                <radialGradient id="bulbHalo">
                  <stop offset="0" stopColor={C.violetLight} stopOpacity={0.55} />
                  <stop offset="1" stopColor={C.violetMid} stopOpacity={0} />
                </radialGradient>
              </defs>
              <circle cx={0} cy={-40} r={mix(60, 330, lit)} fill="url(#bulbHalo)" opacity={lit} />
              <path
                d="M-80 60 C -80 20, -130 -10, -130 -70 C -130 -150, -70 -205, 0 -205 C 70 -205, 130 -150, 130 -70 C 130 -10, 80 20, 80 60 Z"
                fill={lit > 0 ? 'url(#bulbLight)' : 'rgba(255,255,255,0.04)'}
                fillOpacity={mix(0.05, 1, lit)}
                stroke="#fff"
                strokeWidth={10}
                strokeLinejoin="round"
              />
              <path d="M-36 40 L -36 -40 L -14 -70 L 0 -40 L 14 -70 L 36 -40 L 36 40" fill="none" stroke={lit > 0.5 ? '#fff' : C.blueLight} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              <rect x={-78} y={70} width={156} height={30} rx={12} fill="#fff" />
              <rect x={-70} y={108} width={140} height={26} rx={10} fill="#fff" opacity={0.85} />
              <rect x={-44} y={142} width={88} height={30} rx={14} fill="#fff" opacity={0.7} />
              {Array.from({length: 9}, (_, i) => {
                const a = ((-90 + (i - 4) * 24) * Math.PI) / 180;
                const p = prog(t, ide + 0.05 + i * 0.02, 0.4, ease.outExpo);
                if (p <= 0) return null;
                return (
                  <line
                    key={i}
                    x1={Math.cos(a) * 165}
                    y1={-60 + Math.sin(a) * 165}
                    x2={Math.cos(a) * mix(165, 225, p)}
                    y2={-60 + Math.sin(a) * mix(165, 225, p)}
                    stroke={i % 2 ? C.violetLight : '#fff'}
                    strokeWidth={10}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>
        ) : null}

        {/* ---------------- proses: interlocking gears ---------------- */}
        {gearsIn > 0 && toPhone < 1 ? (
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 1 - toPhone}}>
            <defs>
              <linearGradient id="gearG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={C.blueMid} />
                <stop offset="1" stopColor={C.violetMid} />
              </linearGradient>
            </defs>
            <g transform={`translate(${CX} ${CY}) scale(${gearsIn * mix(1, 0.4, toPhone)})`}>
              <g transform={`translate(-150 30) rotate(${spin})`}>
                <path d={gearPath(150, 118, 12, 46)} fill="url(#gearG)" fillRule="evenodd" />
              </g>
              <g transform={`translate(118 -96) rotate(${-spin * 1.5 + 15})`}>
                <path d={gearPath(104, 80, 8, 30)} fill="#fff" fillRule="evenodd" />
              </g>
              <g transform={`translate(132 150) rotate(${-spin * 1.33 + 8})`}>
                <path d={gearPath(90, 68, 9, 26)} fill={C.violetLight} fillRule="evenodd" />
              </g>
              {/* the four steps orbit the machine */}
              {[0, 1, 2, 3].map((i) => {
                const a = (i / 4) * Math.PI * 2 - Math.PI / 2 + (t - menjadi) * 0.9;
                const on = prog(t, proses - 0.2 + i * 0.12, 0.3, ease.outBackStrong);
                return (
                  <g key={i} transform={`translate(${Math.cos(a) * 330} ${Math.sin(a) * 330}) scale(${on})`}>
                    <circle r={34} fill={C.ink2} stroke="url(#gearG)" strokeWidth={5} />
                    <text textAnchor="middle" y={10} fill="#fff" style={{fontFamily: F.display, fontWeight: 800, fontSize: 28}}>
                      {`0${i + 1}`}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        ) : null}

        {/* ---------------- karya: the finished piece ---------------- */}
        {phoneIn > 0 ? (
          <>
            {/* audience ring */}
            <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
              {AUDIENCE.map((_, i) => {
                const p = ring(i);
                if (p <= 0) return null;
                const a = (i / AUDIENCE.length) * Math.PI * 2 - Math.PI / 2;
                const x = CX + Math.cos(a) * 470 * p;
                const y = CY + Math.sin(a) * 330 * p;
                const flow = (t * 1.2 + i * 0.13) % 1;
                return (
                  <g key={i}>
                    <line x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(144,161,244,0.35)" strokeWidth={2} />
                    <circle cx={mix(CX, x, flow)} cy={mix(CY, y, flow)} r={6} fill={i % 2 ? C.violetLight : C.blueLight} />
                  </g>
                );
              })}
            </svg>
            {AUDIENCE.map((src, i) => {
              const p = ring(i);
              if (p <= 0) return null;
              const a = (i / AUDIENCE.length) * Math.PI * 2 - Math.PI / 2;
              const x = CX + Math.cos(a) * 470 * p;
              const y = CY + Math.sin(a) * 330 * p;
              return (
                <div key={src} style={{position: 'absolute', left: x - 50, top: y - 50, width: 100, height: 100, transform: `scale(${p * (1 + bump(t, audience + i * 0.03, 0.3) * 0.15)})`}}>
                  <div style={{width: 100, height: 100, borderRadius: 50, overflow: 'hidden', boxShadow: `0 0 0 4px ${i % 3 ? '#fff' : C.violetLight}, 0 14px 30px rgba(0,0,0,0.5)`}}>
                    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 25%'}} />
                  </div>
                  <FloatHeart t0={audience + 0.1 + i * 0.05} x={50} y={0} size={30} color={i % 2 ? C.violetLight : '#fff'} drift={(i % 5) - 2} />
                </div>
              );
            })}
            <div style={{position: 'absolute', left: CX - 140, top: CY - 287, transform: `scale(${phoneIn * mix(0.4, 1, toPhone)}) rotate(${mix(-12, 0, phoneIn)}deg)`}}>
              <PhoneFrame w={280}>
                <At t={kemudian}>
                  <Media src="videos/reel-street-fashion-bts.mp4" trim={4} />
                </At>
                <div style={{position: 'absolute', left: 16, top: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 999, background: published > 0 ? GRAD : 'rgba(7,8,22,0.6)', color: '#fff', fontFamily: F.display, fontWeight: 800, fontSize: 15}}>
                  {published > 0 ? (
                    <>
                      <div style={{width: 8, height: 8, borderRadius: 4, background: '#fff'}} /> LIVE
                    </>
                  ) : (
                    'DRAFT'
                  )}
                </div>
              </PhoneFrame>
              {/* publish button */}
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  right: 20,
                  top: 600,
                  height: 64,
                  borderRadius: 18,
                  background: published > 0 ? '#22A35A' : GRAD,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  color: '#fff',
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 26,
                  transform: `scale(${prog(t, karya - 0.1, 0.4, ease.outBackStrong) * (1 - bump(t, siap - 0.05, 0.2) * 0.08)})`,
                  boxShadow: '0 16px 36px rgba(0,0,0,0.45)',
                }}
              >
                <Icon name={published > 0 ? 'check' : 'share'} size={26} color="#fff" stroke={2.6} />
                {published > 0 ? 'Published' : 'Publish'}
              </div>
              {t < bertemu + 0.3 ? (
                <Cursor
                  dark
                  size={50}
                  path={[
                    {t: karya, x: 330, y: 760},
                    {t: siap - 0.05, x: 160, y: 634, click: true},
                    {t: siap + 0.4, x: 230, y: 700},
                  ]}
                />
              ) : null}
            </div>
          </>
        ) : null}

        {/* ---------------- keywords ---------------- */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {t < menjadi - 0.1 ? (
            <H size={128} color="#fff">
              <W t={dari} out={menjadi - 0.3} style={{fontSize: '0.45em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                dari{' '}
              </W>
              <W t={sebuah} out={menjadi - 0.3} style={{fontSize: '0.45em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                sebuah{' '}
              </W>
              <W t={ide} out={menjadi - 0.3} look="serif" dark style={{fontSize: '1.15em'}}>
                ide,
              </W>
            </H>
          ) : t < kemudian - 0.1 ? (
            <H size={128} color="#fff">
              <W t={menjadi} out={kemudian - 0.3} style={{fontSize: '0.45em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                menjadi{' '}
              </W>
              <W t={sebuah2} out={kemudian - 0.3} style={{fontSize: '0.45em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                sebuah{' '}
              </W>
              <W t={proses} out={kemudian - 0.3} look="grad" dark>
                proses,
              </W>
            </H>
          ) : null}
        </div>
        {t > kemudian - 0.1 && t < dengan ? (
          <div style={{position: 'absolute', left: 1240, top: 330, width: 600}}>
            <Label size={24} color={C.blueLight}>
              <W t={kemudian} out={dengan - 0.25}>
                kemudian{' '}
              </W>
              <W t={diwujudkan} out={dengan - 0.25}>
                diwujudkan menjadi
              </W>
            </Label>
            <H size={150} color="#fff" align="left" style={{marginTop: 6}}>
              <W t={karya} out={dengan - 0.25} look="serif" dark style={{fontSize: '1.1em'}}>
                karya
              </W>
            </H>
            <H size={54} color="rgba(255,255,255,0.75)" weight={700} align="left" style={{marginTop: 4}}>
              <W t={at(51, 'yang')} out={dengan - 0.25}>
                yang{' '}
              </W>
              <W t={siap} out={dengan - 0.25} style={{color: '#fff'}}>
                siap{' '}
              </W>
              <W t={bertemu} out={dengan - 0.25}>
                bertemu
              </W>
            </H>
          </div>
        ) : null}
        {t > dengan - 0.1 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center'}}>
            <H size={84} color="#fff">
              <W t={dengan} style={{fontSize: '0.55em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                dengan{' '}
              </W>
              <W t={audience} look="serif" dark style={{fontSize: '1.15em'}}>
                audience-nya.
              </W>
            </H>
          </div>
        ) : null}
      </AbsoluteFill>
      {/* everything meets in a single point of light, which becomes the paper of the finale */}
      <GrowCover t0={129.28} dur={0.3} x={CX} y={CY} color={C.paper} r0={4} fn={ease.inCubic} />
    </AbsoluteFill>
  );
};
