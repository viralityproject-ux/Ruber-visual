import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, GRAD} from '../theme';
import {DotGrid, InkBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {RuberMark, RuberWordmark} from '../components/RuberLogo';
import {DOT_C, DOT_R, RING_C} from '../components/ruberLogoPaths';
import {Sparkle, Tick} from '../components/Illos';
import {Icon} from '../components/Icons';
import {useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog} from '../lib/anim';
import {kf, rand} from '../lib/kf';
import {beatPulse} from '../lib/beat';
import {arcPts, arrowHead, linePts, openPath, ringPath, wobble, type Pt} from '../lib/sketch';

// ---------- logo geometry (screen px) ----------
const SZ = 260; // mark height during the reveal
const K = SZ / 455;
const LCX = 960;
const LCY = 500;
const LW = 530 * K;
const LH = 617 * K;
const L0 = LCX - LW / 2;
const T0 = LCY - LH / 2;
const MX = L0 + 39 * K;
const MY = T0;
const RC: Pt = [MX + RING_C[0] * K, MY + RING_C[1] * K];
const DH: Pt = [MX + DOT_C[0] * K, MY + DOT_C[1] * K];
const DOT_PX = DOT_R * K;
const RING_OUT = 94 * K;
const RING_IN = 42 * K;
const START: Pt = [960, 596]; // where Act 1's last node collapsed

// ---------- translator layout ----------
const CANV = {x: 740, y: 225, w: 440, h: 550};
const CARD = {x: 740, y: 190, w: 440, h: 660};
const INSET = {x: 14, y: 44, w: 412, h: 430};
const BULB: Pt = [360, 300];
const LENS_WAIT: Pt = [1480, 520];
const FOCAL: Pt = [CARD.x + 360, CARD.y + 525]; // a pure-white spot of the card the camera dives into

const HOPS = [13.92, 14.41, 14.9];

const pushAt = (t: number) => kf(t, [[15.85, 1], [17.25, 1.06, ease.linear]]) + (bump(t, 16.36, 0.3) + bump(t, 16.85, 0.3)) * 0.012;
const pushed = (p: Pt, s: number): Pt => [LCX + (p[0] - LCX) * s, LCY + (p[1] - LCY) * s];

/** Thin expanding ring (sonar) from a point. */
const Shock: React.FC<{t0: number; x: number; y: number; r0?: number; r1?: number; color?: string; dur?: number; w?: number}> = ({
  t0,
  x,
  y,
  r0 = 20,
  r1 = 380,
  color = C.blueLight,
  dur = 0.8,
  w = 3,
}) => {
  const t = useT();
  const p = (t - t0) / dur;
  if (p <= 0 || p >= 1) return null;
  return <circle cx={x} cy={y} r={mix(r0, r1, ease.outExpo(p))} fill="none" stroke={color} strokeWidth={w * (1 - p) + 0.5} opacity={(1 - p) * 0.9} />;
};

/** Hand-drawn light bulb (local coords centred on the glass). */
const SketchBulb: React.FC<{t0: number; lit: number}> = ({t0, lit}) => {
  const t = useT();
  const draw = (d: number, dur = 0.45) => prog(t, t0 + d, dur, ease.outCubic);
  const glass: Pt[] = [...arcPts(0, 0, 66, 122, 418, 30), [31, 62], [27, 86]];
  const neckL: Pt[] = [[-31, 58], [-27, 86]];
  const parts: {pts: Pt[]; d: number}[] = [
    {pts: [[-27, 86], ...glass.slice().reverse().slice(1)], d: 0},
    {pts: linePts(neckL[0], neckL[1], 3), d: 0.18},
    {pts: linePts([-30, 96], [30, 96], 5), d: 0.26},
    {pts: linePts([-26, 108], [26, 108], 5), d: 0.32},
    {pts: linePts([-18, 120], [18, 120], 4), d: 0.38},
    {pts: [[-14, 60], [-12, 22], [-6, 8], [0, 22], [6, 8], [12, 22], [14, 60]], d: 0.3},
  ];
  const rays = Array.from({length: 9}, (_, i) => -90 + (i - 4) * 26);
  return (
    <svg width={300} height={320} viewBox="-150 -160 300 320" style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="bulbGlow">
          <stop offset="0" stopColor="#fff" stopOpacity={1} />
          <stop offset="0.45" stopColor={C.blueLight} stopOpacity={0.75} />
          <stop offset="1" stopColor={C.violetMid} stopOpacity={0} />
        </radialGradient>
      </defs>
      {lit > 0 ? <circle cx={0} cy={0} r={mix(40, 150, ease.outExpo(lit))} fill="url(#bulbGlow)" opacity={mix(1, 0.55, lit)} /> : null}
      {lit > 0 ? <circle cx={0} cy={0} r={60 * Math.min(1, lit * 3)} fill="#fff" opacity={0.18} /> : null}
      {parts.map((pp, i) => (
        <path
          key={i}
          d={openPath(wobble(pp.pts, 'bulb' + i, 1.6, t))}
          fill="none"
          stroke="#fff"
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw(pp.d)}
        />
      ))}
      {rays.map((a, i) => {
        const p = prog(t, t0 + 0.95 + i * 0.015, 0.35, ease.outExpo);
        if (lit <= 0 || p <= 0) return null;
        const r0 = 86;
        const r1 = mix(86, 122, p);
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={'r' + i}
            x1={Math.cos(rad) * r0}
            y1={Math.sin(rad) * r0}
            x2={Math.cos(rad) * r1}
            y2={Math.sin(rad) * r1}
            stroke={i % 2 ? C.violetLight : C.blueLight}
            strokeWidth={5}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

// "Di Ruber Visual, kami menerjemahkan ide menjadi komunikasi visual yang memiliki tujuan."
export const A02Logo: React.FC = () => {
  const t = useT();
  const bp = beatPulse(t);
  const ruber = at(5, 'ruber');
  const visual = at(5, 'visual');
  const menerjemahkan = at(6, 'menerjemahkan');
  const ide = at(6, 'ide');
  const menjadi = at(6, 'menjadi');
  const komunikasi = at(6, 'komunikasi');
  const visual2 = at(6, 'visual');
  const yang = at(7, 'yang');
  const memiliki = at(7, 'memiliki');
  const tujuan = at(7, 'tujuan');

  // ---------------- pre-roll: the dot hops up on the beat ----------------
  const hopP = HOPS.map((b) => prog(t, b, 0.26, ease.outBackStrong));
  const ys = [START[1], 552, 504, RC[1]];
  const rs = [16, 21, 25.5, DOT_PX];
  let preY = ys[0];
  let preR = rs[0] * prog(t, 13.62, 0.22, ease.outBackStrong);
  for (let i = 0; i < 3; i++) {
    if (t >= HOPS[i]) {
      preY = mix(ys[i], ys[i + 1], hopP[i]);
      preR = mix(rs[i], rs[i + 1], hopP[i]);
    }
  }
  const preX = mix(START[0], RC[0], prog(t, 14.9, 0.26));
  const squash = HOPS.reduce((a, b) => a + bump(t, b, 0.28), 0);
  const t0Mark = 15.1;

  // ---------------- logo → lens ----------------
  const push = pushAt(t);
  const sP = pushAt(17.25);
  const RCs = pushed(RC, sP);
  const DHs = pushed(DH, sP);
  const arcsOut = prog(t, 17.2, 0.32, ease.inCubic);
  const ringX = prog(t, 17.3, 0.12, ease.linear); // logo ring → procedural lens ring
  const lensMove = prog(t, 17.3, 0.55, ease.inOutExpo);
  const lensX = kf(t, [
    [17.3, RCs[0]],
    [17.85, LENS_WAIT[0], ease.inOutExpo],
    [menjadi - 0.36, LENS_WAIT[0]],
    [18.86, 1062, ease.inOutCubic],
    [19.24, 930, ease.inOutCubic],
  ]);
  const lensY =
    kf(t, [
      [17.3, RCs[1]],
      [17.85, LENS_WAIT[1], ease.inOutExpo],
      [menjadi - 0.36, LENS_WAIT[1]],
      [18.86, 650, ease.inOutCubic],
      [19.24, 418, ease.inOutCubic],
    ]) +
    (t > 17.85 && t < 18.45 ? Math.sin((t - 17.85) * 6) * 6 : 0);
  const open = prog(t, komunikasi, 0.38, ease.inOutExpo);
  const lensR = mix(mix(RING_OUT * sP, 172, lensMove), 590, open);
  const lensr = mix(mix(RING_IN * sP, 148, lensMove), 565, open);
  const lensFade = 1 - prog(t, komunikasi + 0.1, 0.16, ease.linear);
  const mag = mix(1.12, 1, open);
  const revealed = open >= 1;

  // the logo's dot flies off to become the spark of the idea
  const dotFly = prog(t, 17.32, 1.08, ease.inOutCubic);
  const dotX = mix(DHs[0], BULB[0], dotFly);
  const dotY = mix(DHs[1], BULB[1], dotFly) - Math.sin(dotFly * Math.PI) * 250;
  const dotRad = mix(DOT_PX * sP, 14, dotFly);
  const lit = prog(t, ide - 0.02, 0.5, ease.outCubic);

  // ---------------- card ----------------
  const form = prog(t, komunikasi + 0.36, 0.34, ease.inOutExpo);
  const photo = {
    x: mix(CANV.x, CARD.x + INSET.x, form),
    y: mix(CANV.y, CARD.y + INSET.y, form),
    w: mix(CANV.w, INSET.w, form),
    h: mix(CANV.h, INSET.h, form),
  };
  const card = {
    x: mix(CANV.x, CARD.x, form),
    y: mix(CANV.y, CARD.y, form),
    w: mix(CANV.w, CARD.w, form),
    h: mix(CANV.h, CARD.h, form),
  };
  const ui = (d: number) => prog(t, komunikasi + 0.55 + d, 0.4, ease.outBackStrong);
  const cardBump = 1 + bump(t, tujuan, 0.35) * 0.04;

  // ---------------- dive into the card (bridge to Act 3) ----------------
  const dive = prog(t, 21.55, 0.45, ease.inCubic);
  const zoom = Math.exp(Math.log(34) * dive);
  const fx = mix(FOCAL[0], 960, prog(t, 21.5, 0.5, ease.inOutCubic));
  const fy = mix(FOCAL[1], 540, prog(t, 21.5, 0.5, ease.inOutCubic));
  const world = `translate(${fx}px, ${fy}px) scale(${zoom}) translate(${-FOCAL[0]}px, ${-FOCAL[1]}px)`;

  // ---------------- sketch reveal masks ----------------
  const blobs: [number, number, number][] = [
    [0.5, 0.2, 17.62],
    [0.52, 0.52, 17.76],
    [0.26, 0.7, 17.9],
    [0.76, 0.76, 17.98],
    [0.48, 0.94, 18.06],
  ];
  const sketchMask =
    t < 18.6
      ? blobs
          .map(([bx, by, b0]) => {
            const r = mix(0, 360, prog(t, b0, 0.5, ease.outCubic));
            return `radial-gradient(circle at ${bx * CANV.w}px ${by * CANV.h}px, #000 ${r}px, transparent ${r + 60}px)`;
          })
          .join(', ')
      : undefined;
  const lxC = lensX - CANV.x; // lens centre in canvas coords
  const lyC = lensY - CANV.y;
  const lensOnCanvas = t > 18.3;
  const sketchVis = 1 - prog(t, komunikasi + 0.2, 0.25, ease.linear);

  const guide = 'rgba(144,161,244,0.55)';
  const guideFade = 1 - prog(t, 15.55, 0.45, ease.inCubic);
  const gDraw = (t0: number, d = 0.5) => prog(t, t0, d, ease.outExpo);

  const particles = Array.from({length: 40}, (_, i) => {
    const t0 = 13.66 + rand(i, 1) * 0.55;
    const dur = 1.05 + rand(i, 2) * 0.45;
    const p = (t - t0) / dur;
    if (p <= 0 || p >= 1.08) return null;
    const e = ease.inOutCubic(clamp01(p));
    const a0 = rand(i, 3) * Math.PI * 2;
    const dir = i % 2 ? 1 : -1;
    const r0 = 760 + rand(i, 4) * 420;
    const pos = (q: number) => {
      const ee = ease.inOutCubic(clamp01(q));
      const ang = a0 + dir * (1 - ee) * Math.PI * 1.2;
      const rr = mix(r0, RING_OUT + 6, ee);
      return [RC[0] + Math.cos(ang) * rr, RC[1] + Math.sin(ang) * rr * 0.92];
    };
    const [x, y] = pos(p);
    const [x2, y2] = pos(p - 0.035);
    const col = i % 3 === 0 ? '#fff' : i % 3 === 1 ? C.blueLight : C.violetLight;
    const o = clamp01(p * 4) * (1 - clamp01((p - 0.92) / 0.16));
    return (
      <g key={i} opacity={o}>
        <line x1={x2} y1={y2} x2={x} y2={y} stroke={col} strokeWidth={2 + rand(i, 5) * 2.5} strokeLinecap="round" opacity={0.5} />
        <circle cx={x} cy={y} r={1.8 + rand(i, 6) * 2.6 * (1 - e * 0.5)} fill={col} />
      </g>
    );
  });

  return (
    <AbsoluteFill>
      <InkBg
        fadeFrom={13.6}
        glow={[
          [C.blue, 18, 82],
          [C.violet, 84, 18],
        ]}
        dots={false}
      />
      <DotGrid color="rgba(255,255,255,0.13)" gap={38} opacity={(0.5 + bp * 0.3) * prog(t, 13.6, 0.9, ease.inCubic)} />
      {/* logo glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${RC[0]}px ${RC[1] + 40}px, rgba(109,62,204,${0.28 * prog(t, 15.4, 0.6) * (1 - prog(t, 17.3, 0.6))}) 0%, rgba(47,73,198,0) 38%)`,
        }}
      />

      {/* construction guides + particles + sonar */}
      {t < 16.2 ? (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <g opacity={guideFade} stroke={guide} strokeWidth={1.5} fill="none">
            <line x1={RC[0]} y1={RC[1]} x2={mix(RC[0], 560, gDraw(13.92))} y2={RC[1]} />
            <line x1={RC[0]} y1={RC[1]} x2={mix(RC[0], 1360, gDraw(13.92))} y2={RC[1]} />
            <line x1={RC[0]} y1={RC[1]} x2={RC[0]} y2={mix(RC[1], 110, gDraw(13.98))} />
            <line x1={RC[0]} y1={RC[1]} x2={RC[0]} y2={mix(RC[1], 790, gDraw(13.98))} />
            <circle cx={RC[0]} cy={RC[1]} r={RING_OUT} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - gDraw(14.0, 0.6)} />
            <circle cx={RC[0]} cy={RC[1]} r={RING_IN} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - gDraw(14.08, 0.6)} />
            <circle cx={RC[0]} cy={RC[1]} r={205 * K} strokeDasharray="6 8" opacity={gDraw(14.41)} transform={`rotate(${t * 12} ${RC[0]} ${RC[1]})`} />
            <circle cx={RC[0]} cy={RC[1]} r={300 * K} strokeDasharray="2 10" opacity={gDraw(14.48)} transform={`rotate(${-t * 9} ${RC[0]} ${RC[1]})`} />
            <line x1={RC[0] - 230 * gDraw(14.41)} y1={RC[1] - 230 * gDraw(14.41)} x2={RC[0] + 230 * gDraw(14.41)} y2={RC[1] + 230 * gDraw(14.41)} strokeDasharray="4 7" />
            <line x1={RC[0] - 230 * gDraw(14.45)} y1={RC[1] + 230 * gDraw(14.45)} x2={RC[0] + 230 * gDraw(14.45)} y2={RC[1] - 230 * gDraw(14.45)} strokeDasharray="4 7" />
            <circle cx={DH[0]} cy={DH[1]} r={DOT_PX} strokeDasharray="5 5" opacity={gDraw(14.9)} />
            <rect x={MX} y={MY} width={456 * K} height={455 * K} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - gDraw(14.9, 0.6)} />
          </g>
          <g opacity={guideFade * gDraw(14.95)} fill={C.blueLight} style={{fontFamily: F.mono, fontSize: 14, letterSpacing: '0.08em'}}>
            <text x={MX} y={MY - 12}>
              456 × 455
            </text>
            <text x={RC[0] + RING_OUT + 10} y={RC[1] - 8}>
              R94
            </text>
            <text x={DH[0] + DOT_PX + 8} y={DH[1] - DOT_PX}>
              ●
            </text>
          </g>
          {particles}
          {HOPS.map((b, i) => (
            <Shock key={b} t0={b + 0.16} x={RC[0] + (i === 2 ? 0 : (START[0] - RC[0]) * 0)} y={ys[i + 1]} r0={rs[i + 1]} r1={300 + i * 60} color={i % 2 ? C.violetLight : C.blueLight} />
          ))}
          <Shock t0={15.84} x={DH[0]} y={DH[1]} r0={DOT_PX} r1={520} color="#fff" w={4} dur={0.9} />
          <Shock t0={15.9} x={RC[0]} y={RC[1]} r0={RING_OUT} r1={760} color={C.violetLight} w={3} dur={1.1} />
        </svg>
      ) : null}

      {/* pre-roll dot */}
      {t >= 13.62 && t < t0Mark ? (
        <div
          style={{
            position: 'absolute',
            left: preX - preR,
            top: preY - preR,
            width: preR * 2,
            height: preR * 2,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: `0 0 ${30 + bp * 30}px rgba(144,161,244,0.7)`,
            transform: `scale(${1 - squash * 0.18}, ${1 + squash * 0.22})`,
          }}
        />
      ) : null}

      {/* the lockup */}
      {t >= t0Mark && t < 17.75 ? (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: `${LCX}px ${LCY}px`}}>
          <div style={{position: 'absolute', left: MX, top: MY}}>
            <RuberMark size={SZ} color="#fff" t0={t0Mark} dotPop={false} dotFromScale={1} ringOpacity={1 - ringX} dotOpacity={t < 17.32 ? 1 : 0} arcsOut={arcsOut} />
          </div>
          <div style={{position: 'absolute', left: L0, top: T0 + 537 * K}}>
            <RuberWordmark height={80 * K} color="#fff" t0={15.62} wave={visual} out={17.1} />
          </div>
          {/* colour sweep on "Ruber" */}
          {t > ruber - 0.05 && t < ruber + 0.7
            ? [C.blueLight, C.violetLight].map((col, i) => {
                const p = prog(t, ruber - 0.02 + i * 0.07, 0.5, ease.inOutCubic);
                const x0 = mix(-160, LW + 160, p);
                return (
                  <div
                    key={col}
                    style={{
                      position: 'absolute',
                      left: L0,
                      top: T0,
                      width: LW,
                      height: LH,
                      clipPath: `polygon(${x0}px 0, ${x0 + 90}px 0, ${x0 + 10}px 100%, ${x0 - 80}px 100%)`,
                    }}
                  >
                    <div style={{position: 'absolute', left: 39 * K, top: 0}}>
                      <RuberMark size={SZ} color={col} />
                    </div>
                    <div style={{position: 'absolute', left: 0, top: 537 * K}}>
                      <RuberWordmark height={80 * K} color={col} wave={visual} />
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      ) : null}

      {/* ---------------- translator ---------------- */}
      <AbsoluteFill style={{transform: world, transformOrigin: '0 0'}}>
        {/* bullseye behind the card: the visual sits dead centre of its purpose */}
        {t > yang - 0.1 ? (
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <defs>
              <radialGradient id="bullGlow">
                <stop offset="0" stopColor={C.violetMid} stopOpacity={0.45} />
                <stop offset="1" stopColor={C.blue} stopOpacity={0} />
              </radialGradient>
            </defs>
            <circle cx={960} cy={520} r={mix(200, 620, prog(t, yang, 0.6))} fill="url(#bullGlow)" opacity={prog(t, yang, 0.4)} />
            {[330, 430, 530, 630, 730].map((r, i) => {
              const p = prog(t, yang + 0.02 + i * 0.1, 0.5, ease.outExpo);
              const pulse = bump(t, tujuan + i * 0.04, 0.4);
              return (
                <circle
                  key={r}
                  cx={960}
                  cy={520}
                  r={r * mix(0.85, 1, p) + pulse * 26}
                  fill="none"
                  stroke={i % 2 ? C.violetLight : C.blueLight}
                  strokeWidth={i === 0 ? 4 : 2.5}
                  strokeDasharray={i % 2 ? '10 12' : undefined}
                  opacity={p * (0.65 - i * 0.09) + pulse * 0.3}
                  pathLength={i % 2 ? undefined : 1}
                  strokeDashoffset={i % 2 ? -t * 30 : undefined}
                  transform={i % 2 ? `rotate(${t * (i % 4 === 1 ? 14 : -10)} 960 520)` : undefined}
                />
              );
            })}
          </svg>
        ) : null}

        {/* card body grows around the revealed photo */}
        {form > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: card.x,
              top: card.y,
              width: card.w,
              height: card.h,
              borderRadius: mix(18, 26, form),
              background: '#fff',
              boxShadow: '0 40px 90px rgba(0,0,0,0.45)',
              transform: `scale(${cardBump})`,
            }}
          >
            {/* chrome + content */}
            <div style={{position: 'absolute', left: 22, top: 16, display: 'flex', gap: 8, opacity: ui(0)}}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{width: 12, height: 12, borderRadius: 6, background: i === 0 ? C.blueMid : i === 1 ? C.violetMid : 'rgba(7,8,22,0.14)'}} />
              ))}
            </div>
            <div style={{position: 'absolute', left: 92, top: 14, width: 230 * ui(0.02), height: 16, borderRadius: 8, background: 'rgba(7,8,22,0.06)'}} />
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 492,
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: 32,
                letterSpacing: '-0.03em',
                color: C.ink,
                opacity: clamp01(ui(0.08) * 1.5),
                transform: `translateY(${(1 - ui(0.08)) * 16}px)`,
              }}
            >
              Brand Story
            </div>
            <div style={{position: 'absolute', left: 14, top: 538, width: 280 * clamp01(ui(0.14)), height: 10, borderRadius: 5, background: 'rgba(7,8,22,0.10)'}} />
            <div style={{position: 'absolute', left: 14, top: 558, width: 200 * clamp01(ui(0.18)), height: 10, borderRadius: 5, background: 'rgba(7,8,22,0.07)'}} />
            {[C.blue, C.blueMid, C.violet, C.violetMid].map((col, i) => (
              <div
                key={col}
                style={{
                  position: 'absolute',
                  left: 14 + i * 40,
                  top: 594,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: col,
                  border: '3px solid #fff',
                  boxShadow: '0 4px 10px rgba(7,8,22,0.18)',
                  transform: `scale(${ui(0.24 + i * 0.05)})`,
                }}
              />
            ))}
            <div style={{position: 'absolute', left: 184, top: 588, fontFamily: F.serif, fontStyle: 'italic', fontSize: 38, color: C.ink, opacity: clamp01(ui(0.4) * 1.4)}}>Aa</div>
            <div
              style={{
                position: 'absolute',
                left: 258,
                top: 590,
                height: 40,
                padding: '0 18px',
                borderRadius: 20,
                background: GRAD,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#fff',
                fontFamily: F.display,
                fontWeight: 700,
                fontSize: 17,
                transform: `scale(${ui(0.46)})`,
                transformOrigin: '0% 50%',
              }}
            >
              Lihat Story <Icon name="arrow" size={18} color="#fff" stroke={2.4} />
            </div>
          </div>
        ) : null}

        {/* photo: seen through the lens first, then fully revealed and slotted into the card */}
        {lensOnCanvas ? (
          <div
            style={{
              position: 'absolute',
              left: photo.x,
              top: photo.y,
              width: photo.w,
              height: photo.h,
              borderRadius: mix(0, 14, form),
              overflow: 'hidden',
              clipPath: revealed ? undefined : `circle(${Math.max(0, lensr)}px at ${lxC}px ${lyC}px)`,
              transform: `scale(${cardBump})`,
              transformOrigin: `${960 - photo.x}px ${520 - photo.y}px`,
            }}
          >
            <Img
              src={staticFile('sketch/portrait-crop.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '50% 18%',
                transform: `scale(${mag})`,
                transformOrigin: `${lxC}px ${lyC}px`,
              }}
            />
          </div>
        ) : null}

        {/* the sketch ("ide") */}
        {t > 17.58 && sketchVis > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: CANV.x,
              top: CANV.y,
              width: CANV.w,
              height: CANV.h,
              opacity: sketchVis,
              WebkitMaskImage: lensOnCanvas ? `radial-gradient(circle at ${lxC}px ${lyC}px, transparent ${lensr}px, #000 ${lensr + 1.5}px)` : undefined,
              maskImage: lensOnCanvas ? `radial-gradient(circle at ${lxC}px ${lyC}px, transparent ${lensr}px, #000 ${lensr + 1.5}px)` : undefined,
            }}
          >
            <div style={{position: 'absolute', inset: 0, WebkitMaskImage: sketchMask, maskImage: sketchMask}}>
              <Img
                src={staticFile('sketch/portrait-sketch.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `translate(${(rand(Math.floor(t * 8)) - 0.5) * 1.6}px, ${(rand(Math.floor(t * 8), 3) - 0.5) * 1.6}px)`,
                }}
              />
            </div>
            {/* storyboard frame */}
            <svg width={CANV.w} height={CANV.h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <path
                d={openPath(
                  wobble(
                    [...linePts([0, 0], [CANV.w, 0], 8), ...linePts([CANV.w, 0], [CANV.w, CANV.h], 10).slice(1), ...linePts([CANV.w, CANV.h], [0, CANV.h], 8).slice(1), ...linePts([0, CANV.h], [0, 0], 10).slice(1)],
                    'frame',
                    2.2,
                    t,
                  ),
                )}
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth={3}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - prog(t, 17.58, 0.7, ease.inOutCubic)}
              />
              {[1, 2].map((i) => (
                <g key={i} stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} strokeDasharray="6 8" opacity={prog(t, 17.7 + i * 0.05, 0.3)}>
                  <line x1={(CANV.w * i) / 3} y1={0} x2={(CANV.w * i) / 3} y2={CANV.h} />
                  <line x1={0} y1={(CANV.h * i) / 3} x2={CANV.w} y2={(CANV.h * i) / 3} />
                </g>
              ))}
            </svg>
            <div style={{position: 'absolute', left: 14, bottom: 12, fontFamily: F.mono, fontSize: 14, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', opacity: prog(t, 17.9, 0.3)}}>
              FRAME 01 · HERO
            </div>
          </div>
        ) : null}

        {/* storyboard annotations */}
        {t > 17.9 && t < 19.1
          ? (() => {
              const o = 1 - prog(t, 18.8, 0.25, ease.linear);
              const notes: {x: number; y: number; text: string; t0: number; from: Pt; to: Pt}[] = [
                {x: 1205, y: 262, text: 'senyum!', t0: 17.95, from: [1205, 290], to: [1060, 350]},
                {x: 520, y: 640, text: 'warm tone', t0: 18.12, from: [665, 655], to: [790, 610]},
              ];
              return (
                <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: o, overflow: 'visible'}}>
                  {notes.map((n, i) => {
                    const p = prog(t, n.t0 + 0.12, 0.35, ease.outCubic);
                    const mid: Pt = [(n.from[0] + n.to[0]) / 2, (n.from[1] + n.to[1]) / 2 - 40];
                    const pts = wobble([n.from, mid, n.to], 'note' + i, 1.5, t);
                    return (
                      <g key={i}>
                        <text
                          x={n.x}
                          y={n.y}
                          fill="#fff"
                          style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 38}}
                          opacity={prog(t, n.t0, 0.25)}
                          transform={`rotate(-4 ${n.x} ${n.y})`}
                        >
                          {n.text}
                        </text>
                        <path d={openPath(pts)} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
                        {p > 0.95 ? <path d={arrowHead(n.to, pts[1], 16)} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" /> : null}
                      </g>
                    );
                  })}
                </svg>
              );
            })()
          : null}

        {/* the lens (the logo's ring) */}
        {t >= 17.3 && lensFade > 0 ? (
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: lensFade}}>
            <circle cx={lensX} cy={lensY} r={lensr} fill={`rgba(144,161,244,${0.07 * (1 - open)})`} />
            <path d={ringPath(lensX, lensY, lensR, lensr)} fill="#fff" fillRule="evenodd" opacity={ringX} />
            <circle cx={lensX} cy={lensY} r={lensR + 4} fill="none" stroke={C.blueLight} strokeWidth={2} opacity={0.7 * lensMove} />
            <circle cx={lensX} cy={lensY} r={Math.max(0, lensr - 4)} fill="none" stroke={C.violetLight} strokeWidth={2} opacity={0.7 * lensMove} />
            {/* glass highlights */}
            <path
              d={openPath(arcPts(lensX, lensY, Math.max(0, lensr - 18), 200, 252, 10))}
              fill="none"
              stroke="#fff"
              strokeWidth={7}
              strokeLinecap="round"
              opacity={0.45 * lensMove * (1 - open)}
            />
            <path
              d={openPath(arcPts(lensX, lensY, Math.max(0, lensr - 18), 266, 280, 4))}
              fill="none"
              stroke="#fff"
              strokeWidth={7}
              strokeLinecap="round"
              opacity={0.45 * lensMove * (1 - open)}
            />
            {/* processing spinner while it waits */}
            <circle
              cx={lensX}
              cy={lensY}
              r={lensR + 28}
              fill="none"
              stroke={C.blueLight}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="60 360"
              opacity={prog(t, 17.8, 0.2) * (1 - prog(t, 18.42, 0.2))}
              transform={`rotate(${t * 420} ${lensX} ${lensY})`}
            />
          </svg>
        ) : null}

        {/* bulb + dot */}
        {t > 17.55 && t < 20.7 ? (
          <div
            style={{
              position: 'absolute',
              left: BULB[0] - 150,
              top: BULB[1] - 160,
              transform: `scale(${1 - prog(t, 20.3, 0.35, ease.inCubic)})`,
              opacity: 1 - prog(t, 20.4, 0.25),
            }}
          >
            <SketchBulb t0={17.6} lit={lit} />
          </div>
        ) : null}
        {t >= 17.32 && t < ide + 0.06 ? (
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            {[0.05, 0.1, 0.15, 0.2].map((lag, i) => {
              const q = prog(t - lag, 17.32, 1.08, ease.inOutCubic);
              if (q <= 0) return null;
              const x = mix(DHs[0], BULB[0], q);
              const y = mix(DHs[1], BULB[1], q) - Math.sin(q * Math.PI) * 250;
              return <circle key={i} cx={x} cy={y} r={mix(DOT_PX * sP, 14, q) * (1 - i * 0.18)} fill={i % 2 ? C.violetLight : C.blueLight} opacity={0.32 - i * 0.07} />;
            })}
            <circle cx={dotX} cy={dotY} r={dotRad} fill="#fff" />
          </svg>
        ) : null}

        {/* idea → canvas arrow (rough), canvas → message arrow (clean) */}
        {t > 18.5 && t < 20.6 ? (
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - prog(t, 20.3, 0.25)}}>
            {(() => {
              const pts = wobble([[470, 290], [560, 238], [650, 262], [712, 320]], 'arrow1', 1.4, t);
              const p = prog(t, 18.55, 0.4, ease.outCubic) * (1 - prog(t, 19.0, 0.3));
              return (
                <g opacity={p > 0 ? 1 : 0}>
                  <path d={openPath(pts)} fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeDasharray="10 9" pathLength={undefined} opacity={p} />
                  {p > 0.6 ? <path d={arrowHead([712, 320], pts[2], 16)} fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" opacity={p} /> : null}
                </g>
              );
            })()}
          </svg>
        ) : null}

        {/* sparkles when the card lands */}
        {t > visual2 - 0.1 && t < 21.5
          ? [
              [CARD.x - 30, CARD.y + 70, 54, 0],
              [CARD.x + CARD.w + 26, CARD.y + 300, 40, 0.08],
              [CARD.x + 40, CARD.y + CARD.h + 26, 34, 0.14],
            ].map(([x, y, s, d], i) => (
              <div key={i} style={{position: 'absolute', left: x - s / 2, top: y - s / 2}}>
                <Sparkle size={s} color={i === 1 ? C.violetLight : C.blueLight} p={prog(t, visual2 + d, 0.4, ease.outBackStrong) * (1 - prog(t, 20.9, 0.3))} rot={t * 60} />
              </div>
            ))
          : null}

        {/* tick: on target */}
        {t > tujuan - 0.05 ? (
          <div style={{position: 'absolute', left: CARD.x + CARD.w - 48, top: CARD.y - 48}}>
            <Tick t0={tujuan} size={96} />
          </div>
        ) : null}

        {/* ---------------- keywords ---------------- */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 128, display: 'flex', justifyContent: 'center'}}>
          {t > menerjemahkan - 0.1 && t < 19.3 ? (
            <Label size={24} color={C.blueLight}>
              <W t={menerjemahkan} out={19.05}>
                [ menerjemahkan ]
              </W>
            </Label>
          ) : null}
        </div>
        {t > ide - 0.1 && t < 20.7 ? (
          <div style={{position: 'absolute', left: 80, width: 560, top: 448, display: 'flex', justifyContent: 'center'}}>
            <H size={170} color="#fff">
              <W t={ide} out={20.3} look="serif" dark>
                ide.
              </W>
            </H>
          </div>
        ) : null}
        {t > komunikasi - 0.1 && t < 20.7 ? (
          <div style={{position: 'absolute', left: 1230, width: 620, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <H size={74} color="#fff">
              <W t={komunikasi} out={20.3}>
                komunikasi
              </W>
            </H>
            <H size={168} color="#fff" style={{marginTop: -10}}>
              <W t={visual2} out={20.3} look="serif" dark>
                visual
              </W>
            </H>
          </div>
        ) : null}
        {t > yang - 0.1 ? (
          <div style={{position: 'absolute', left: 80, width: 600, top: 400, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <H size={84} color="#fff" lh={1.05}>
              <W t={yang}>yang</W>
              <br />
              <W t={memiliki}>memiliki</W>
            </H>
          </div>
        ) : null}
        {t > tujuan - 0.1 ? (
          <div style={{position: 'absolute', left: 1230, width: 640, top: 395, display: 'flex', justifyContent: 'center'}}>
            <H size={176} color="#fff">
              <W t={tujuan} look="serif" dark>
                tujuan.
              </W>
            </H>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

