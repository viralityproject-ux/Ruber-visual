import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, GRAD} from '../theme';
import {DotGrid, InkBg} from '../components/Backgrounds';
import {GrowCover} from '../components/Cover';
import {H, Label, W, at} from '../components/Text';
import {Icon} from '../components/Icons';
import {useT} from '../lib/scene';
import {bump, clamp01, ease, mix, n2, prog, shake} from '../lib/anim';
import {rand} from '../lib/kf';
import {beatPulse} from '../lib/beat';
import {openPath, wobble, type Pt} from '../lib/sketch';

const CHAOS = [
  {src: 'photos/titip-panic-phone.jpg', x: 420, y: 470, r: -12},
  {src: 'photos/titip-wake-up.jpg', x: 560, y: 600, r: 9},
  {src: 'photos/titip-crying-phone.jpg', x: 360, y: 690, r: 6},
  {src: 'photos/titip-office-call.jpg', x: 590, y: 400, r: -5},
];
const CORE: Pt = [960, 520];
const INPUTS = [
  {word: 'kesiapan', icon: 'check', src: 'photos/bts-lighting-diagram.jpg', x: 380, y: 300, pos: '50% 35%'},
  {word: 'koordinasi', icon: 'users', src: 'photos/bts-director-pointing.jpg', x: 1540, y: 300, pos: '50% 50%'},
  {word: 'pengalaman', icon: 'layers', src: 'photos/titip-production-desk.jpg', x: 380, y: 745, pos: '50% 40%'},
  {word: 'pemahaman', icon: 'bulb', src: 'photos/moodboard-fisheye.jpg', x: 1540, y: 745, pos: '50% 45%'},
];
const IN_W = 420;
const IN_H = 270;
const GOAL: Pt = [1560, 520];

/** Letters that can't keep still. */
const Jitter: React.FC<{text: string; t0: number; calm: number}> = ({text, t0, calm}) => {
  const t = useT();
  const f = Math.floor(t * 14);
  return (
    <span style={{display: 'inline-block', whiteSpace: 'pre'}}>
      {text.split('').map((ch, i) => {
        const p = prog(t, t0 + i * 0.025, 0.3, ease.outBackStrong);
        const k = 1 - calm;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: clamp01(p * 2),
              transform: `translate(${(rand(f + i * 7, 1) - 0.5) * 10 * k}px, ${(rand(f + i * 7, 2) - 0.5) * 18 * k + (1 - p) * 40}px) rotate(${(rand(f + i * 7, 3) - 0.5) * 22 * k}deg)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

// "Bagi kami, bekerja cepat bukan berarti terburu-buru. Kecepatan lahir dari kesiapan, koordinasi,
//  pengalaman, serta pemahaman yang jelas terhadap tujuan setiap project."
export const A08Ready: React.FC = () => {
  const t = useT();
  const bp = beatPulse(t);
  const bagi = at(32, 'bagi');
  const bekerja = at(32, 'bekerja');
  const cepat = at(32, 'cepat');
  const bukan = at(32, 'bukan');
  const berarti = at(32, 'berarti');
  const terburu = at(32, 'terburu');
  const kecepatan = at(33, 'kecepatan');
  const lahir = at(33, 'lahir');
  const dari = at(33, 'dari');
  const cue = [at(33, 'kesiapan'), at(33, 'koordinasi'), at(34, 'pengalaman'), at(34, 'pemahaman')];
  const jelas = at(34, 'jelas');
  const terhadap = at(35, 'terhadap');
  const tujuan = at(35, 'tujuan');
  const setiap = at(35, 'setiap');
  const project = at(35, 'project');

  // ---------------- part A ----------------
  const strike = prog(t, terburu + 0.42, 0.3, ease.outQuart);
  const calm = prog(t, 77.75, 0.5, ease.inOutCubic);
  const gatherA = prog(t, 78.55, 0.55, ease.inExpo);
  const outA = prog(t, 78.75, 0.35, ease.inCubic);
  const sh = shake(t, terburu, 16, 0.9, 'rush');
  const chaosOn = prog(t, terburu - 0.12, 0.35, ease.outBackStrong);

  // ---------------- part B ----------------
  const coreIn = prog(t, kecepatan - 0.15, 0.6, ease.outBackStrong);
  const power = cue.reduce((a, c) => a + prog(t, c + 0.1, 0.45, ease.outCubic), 0) / 4;
  const cardsOut = prog(t, jelas - 0.05, 0.45, ease.inCubic);
  const coreShift = prog(t, jelas - 0.05, 0.6, ease.inOutCubic);
  const coreX = mix(CORE[0], 540, coreShift);
  const goalIn = prog(t, terhadap - 0.05, 0.5, ease.outBackStrong);
  const beam = prog(t, tujuan - 0.1, 0.32, ease.inOutCubic);
  const hit = prog(t, tujuan + 0.2, 0.5, ease.outExpo);

  return (
    <AbsoluteFill>
      <InkBg
        fadeFrom={74.35}
        glow={[
          [C.blue, 20, 20],
          [C.violet, 80, 85],
        ]}
        dots={false}
      />
      <DotGrid color="rgba(255,255,255,0.12)" gap={38} opacity={(0.4 + bp * 0.3) * prog(t, 74.35, 0.9, ease.inCubic)} />

      {/* ================= part A: cepat ≠ terburu-buru ================= */}
      {t < 79.2 ? (
        <AbsoluteFill style={{opacity: 1 - outA}}>
          {t < 75.6 ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: 410, display: 'flex', justifyContent: 'center'}}>
              <H size={150} color="#fff">
                <W t={bagi} out={75.32}>
                  bagi{' '}
                </W>
                <W t={at(32, 'kami')} out={75.34} look="serif" dark style={{fontSize: '1.12em'}}>
                  kami,
                </W>
              </H>
            </div>
          ) : null}
          <div style={{position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', justifyContent: 'center'}}>
            <Label size={26} color={C.blueLight}>
              <W t={75.4} out={78.4}>
                bagi kami, bekerja
              </W>
            </Label>
          </div>
          {/* right: cepat — one smooth, confident line */}
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <defs>
              <linearGradient id="smooth" x1="0" x2="1">
                <stop offset="0" stopColor={C.blueMid} stopOpacity={0} />
                <stop offset="0.5" stopColor={C.blueLight} />
                <stop offset="1" stopColor={C.violetLight} />
              </linearGradient>
            </defs>
            {(() => {
              const p = prog(t, bekerja + 0.1, 0.9, ease.inOutCubic);
              const d = 'M1130 700 C 1300 700, 1360 560, 1520 560 S 1700 470, 1820 470';
              return (
                <g opacity={1 - gatherA}>
                  <path d={d} fill="none" stroke="url(#smooth)" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
                  <path d={d} fill="none" stroke="rgba(144,161,244,0.25)" strokeWidth={34} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{filter: 'blur(10px)'}} />
                </g>
              );
            })()}
          </svg>
          <div style={{position: 'absolute', left: 1180, top: 330, opacity: 1 - gatherA}}>
            <H size={190} color="#fff" align="left">
              <W t={cepat} look="grad" dark style={{fontStyle: 'italic'}}>
                cepat
              </W>
            </H>
          </div>
          {/* centre: ≠ */}
          <div style={{position: 'absolute', left: 860, top: 380, width: 200, display: 'flex', justifyContent: 'center', opacity: 1 - gatherA}}>
            <H size={200} color={C.violetLight}>
              <W t={bukan}>≠</W>
            </H>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', opacity: 1 - gatherA}}>
            <Label size={24} color="rgba(255,255,255,0.6)">
              <W t={bukan}>bukan </W>
              <W t={berarti}>berarti</W>
            </Label>
          </div>
          {/* left: terburu-buru — rushed, shaky, scribbled */}
          <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x * (1 - calm)}px, ${sh.y * (1 - calm)}px)`}}>
            {CHAOS.map((c, i) => {
              const jx = n2('cx' + i, t * 4) * 14 * (1 - calm);
              const jy = n2('cy' + i, t * 4) * 14 * (1 - calm);
              const x = mix(c.x + jx, CORE[0], gatherA);
              const y = mix(c.y + jy, CORE[1], gatherA);
              const rot = mix(c.r + n2('cr' + i, t * 3) * 6 * (1 - calm), 0, calm);
              const p = prog(t, terburu - 0.12 + i * 0.06, 0.35, ease.outBackStrong);
              return (
                <div
                  key={c.src}
                  style={{
                    position: 'absolute',
                    left: x - 200,
                    top: y - 125,
                    width: 400,
                    height: 250,
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: '5px solid #fff',
                    boxShadow: '0 24px 50px rgba(0,0,0,0.5)',
                    transform: `rotate(${rot}deg) scale(${p * mix(1, 0.08, gatherA)})`,
                    opacity: clamp01(p * 2),
                    filter: calm < 1 ? `saturate(${mix(0.6, 1, calm)}) contrast(${mix(1.15, 1, calm)})` : undefined,
                  }}
                >
                  <Img src={staticFile(c.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
              );
            })}
            {/* scribbles */}
            {chaosOn > 0 ? (
              <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: (1 - calm) * chaosOn}}>
                {[0, 1, 2].map((k) => {
                  const pts: Pt[] = Array.from({length: 14}, (_, i) => [200 + rand(i + k * 20, 1) * 560, 330 + rand(i + k * 20, 2) * 480] as Pt);
                  return (
                    <path
                      key={k}
                      d={openPath(wobble(pts, 'scr' + k, 6, t, 12))}
                      fill="none"
                      stroke={k === 1 ? C.violetLight : 'rgba(255,255,255,0.75)'}
                      strokeWidth={4}
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - prog(t, terburu + k * 0.1, 0.5, ease.outCubic)}
                    />
                  );
                })}
              </svg>
            ) : null}
            {/* the word itself */}
            <div style={{position: 'absolute', left: 120, top: 820, opacity: 1 - gatherA}}>
              <div style={{position: 'relative', display: 'inline-block'}}>
                <H size={112} color="#fff" align="left">
                  <Jitter text="terburu-buru" t0={terburu} calm={calm} />
                </H>
                <div style={{position: 'absolute', left: '-3%', top: '50%', height: 12, borderRadius: 6, width: `${strike * 106}%`, background: C.violetLight, transform: 'rotate(-3deg)', transformOrigin: 'left center'}} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ================= part B: where speed comes from ================= */}
      {t > kecepatan - 0.3 ? (
        <AbsoluteFill>
          {/* beams from the inputs into the core */}
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <defs>
              <linearGradient id="beamG" x1="0" x2="1">
                <stop offset="0" stopColor={C.blueLight} />
                <stop offset="1" stopColor={C.violetLight} />
              </linearGradient>
              <radialGradient id="coreGlow">
                <stop offset="0" stopColor={C.violetMid} stopOpacity={0.65} />
                <stop offset="1" stopColor={C.blue} stopOpacity={0} />
              </radialGradient>
            </defs>
            <circle cx={coreX} cy={CORE[1]} r={mix(160, 340, power) * coreIn} fill="url(#coreGlow)" opacity={0.8} />
            {INPUTS.map((inp, i) => {
              const p = prog(t, cue[i] + 0.05, 0.4, ease.inOutCubic) * (1 - cardsOut);
              if (p <= 0) return null;
              const x1 = inp.x + (inp.x < 960 ? IN_W / 2 : -IN_W / 2);
              const y1 = inp.y;
              const x2 = mix(x1, coreX, p);
              const y2 = mix(y1, CORE[1], p);
              const flow = (t * 1.6 + i * 0.25) % 1;
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#beamG)" strokeWidth={5} strokeLinecap="round" opacity={0.85} />
                  {p >= 1 ? <circle cx={mix(x1, coreX, flow)} cy={mix(y1, CORE[1], flow)} r={8} fill="#fff" /> : null}
                </g>
              );
            })}
            {/* goal beam */}
            {beam > 0 ? (
              <line x1={coreX + 140} y1={CORE[1]} x2={mix(coreX + 140, GOAL[0] - 150, beam)} y2={CORE[1]} stroke="url(#beamG)" strokeWidth={10} strokeLinecap="round" />
            ) : null}
          </svg>
          {/* input cards */}
          {INPUTS.map((inp, i) => {
            const p = prog(t, cue[i] - 0.1, 0.5, ease.outBackStrong);
            if (p <= 0) return null;
            return (
              <div
                key={inp.word}
                style={{
                  position: 'absolute',
                  left: inp.x - IN_W / 2,
                  top: inp.y - IN_H / 2,
                  width: IN_W,
                  height: IN_H,
                  borderRadius: 22,
                  overflow: 'hidden',
                  background: C.ink2,
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                  transform: `translate(${(inp.x < 960 ? -1 : 1) * (1 - p) * 140 + (inp.x < 960 ? -1 : 1) * cardsOut * 300}px, 0) scale(${mix(0.8, 1, p) * (1 + bump(t, cue[i], 0.35) * 0.05)})`,
                  opacity: clamp01(p * 2) * (1 - cardsOut),
                }}
              >
                <Img src={staticFile(inp.src)} style={{width: '100%', height: 200, objectFit: 'cover', objectPosition: inp.pos}} />
                <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 70, display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px'}}>
                  <div style={{width: 42, height: 42, borderRadius: 12, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name={inp.icon} size={24} color="#fff" stroke={2.3} />
                  </div>
                  <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 34, letterSpacing: '-0.03em', color: '#fff'}}>{inp.word}</div>
                </div>
              </div>
            );
          })}
          {/* the core */}
          <div
            style={{
              position: 'absolute',
              left: coreX - 150,
              top: CORE[1] - 150,
              width: 300,
              height: 300,
              transform: `scale(${coreIn * (1 + bp * 0.03 + cue.reduce((a, c) => a + bump(t, c + 0.4, 0.35), 0) * 0.08)})`,
            }}
          >
            <svg width={300} height={300} viewBox="-150 -150 300 300" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <defs>
                <linearGradient id="coreFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={C.blueMid} />
                  <stop offset="1" stopColor={C.violetMid} />
                </linearGradient>
              </defs>
              <circle r={140} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={12} />
              <circle r={140} fill="none" stroke="url(#coreFill)" strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${power} 1`} transform="rotate(-90)" />
              <circle r={112} fill="none" stroke="rgba(144,161,244,0.5)" strokeWidth={2} strokeDasharray="6 10" transform={`rotate(${t * 40})`} />
              <circle r={92} fill="url(#coreFill)" />
              <circle r={92} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
            </svg>
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon name="bolt" size={86} color="#fff" fill="#fff" stroke={1.5} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 316, textAlign: 'center', fontFamily: F.mono, fontSize: 22, letterSpacing: '0.14em', color: C.blueLight}}>
              {Math.round(power * 100)}%
            </div>
          </div>
          {/* the goal */}
          {goalIn > 0 ? (
            <div style={{position: 'absolute', left: GOAL[0] - 150, top: GOAL[1] - 150, width: 300, height: 300, transform: `scale(${goalIn * (1 + bump(t, tujuan + 0.2, 0.4) * 0.1)})`}}>
              <svg width={300} height={300} viewBox="-150 -150 300 300" style={{overflow: 'visible'}}>
                <circle r={146} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
                <circle r={110} fill="none" stroke={C.blueLight} strokeWidth={6} />
                <circle r={72} fill="none" stroke={C.violetLight} strokeWidth={6} />
                <circle r={34} fill={C.paper} />
                {hit > 0 && hit < 1 ? <circle r={mix(34, 260, hit)} fill="none" stroke="#fff" strokeWidth={8 * (1 - hit)} opacity={1 - hit} /> : null}
              </svg>
              <div style={{position: 'absolute', left: -60, right: -60, top: 320, display: 'flex', justifyContent: 'center'}}>
                <H size={58} color="#fff">
                  <W t={tujuan} look="grad" dark>
                    tujuan{' '}
                  </W>
                </H>
              </div>
              <div style={{position: 'absolute', left: -80, right: -80, top: 392, display: 'flex', justifyContent: 'center'}}>
                <Label size={22} color="rgba(255,255,255,0.65)">
                  <W t={setiap}>setiap </W>
                  <W t={project}>project</W>
                </Label>
              </div>
            </div>
          ) : null}
          {/* headline */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 92, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {t < jelas - 0.1 ? (
              <H size={92} color="#fff">
                <W t={kecepatan} out={jelas - 0.3} look="serif" dark style={{fontSize: '1.15em'}}>
                  kecepatan{' '}
                </W>
                <W t={lahir} out={jelas - 0.3} style={{fontSize: '0.55em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                  lahir{' '}
                </W>
                <W t={dari} out={jelas - 0.3} style={{fontSize: '0.55em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                  dari
                </W>
              </H>
            ) : (
              <H size={92} color="#fff">
                <W t={jelas - 0.05} style={{fontSize: '0.55em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                  pemahaman yang{' '}
                </W>
                <W t={jelas} look="serif" dark style={{fontSize: '1.15em'}}>
                  jelas
                </W>
              </H>
            )}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* hand-off: the goal's white centre floods the frame with paper */}
      <GrowCover t0={86.18} dur={0.42} x={GOAL[0]} y={GOAL[1]} color={C.paper} r0={34} fn={ease.inCubic} />
    </AbsoluteFill>
  );
};

