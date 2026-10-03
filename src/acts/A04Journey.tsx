import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, GRAD_MID} from '../theme';
import {InkBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Icon} from '../components/Icons';
import {RuberMark} from '../components/RuberLogo';
import {RING_C} from '../components/ruberLogoPaths';
import {useT} from '../lib/scene';
import {clamp01, ease, mix, prog} from '../lib/anim';
import {kf, rand} from '../lib/kf';
import {beatPulse} from '../lib/beat';

// ---------------- part A: the journey (simple pinhole projection) ----------------
const FOC = 1000;
const CX = 960;
const CY0 = 470;
const FLOOR = 420;
const JOURNEY = [
  {src: 'photos/group-seven-grey.jpg', w: 600, h: 400, tag: 'Brand Campaign'},
  {src: 'photos/hijab-blazer-navy.jpg', w: 360, h: 520, tag: 'Corporate Portrait'},
  {src: 'photos/trio-tablet-shelf.jpg', w: 600, h: 400, tag: 'Lifestyle'},
  {src: 'photos/poster-titip.jpg', w: 400, h: 500, tag: 'Short Movie'},
  {src: 'photos/paragon-meeting-great-ideas.jpg', w: 600, h: 400, tag: 'Corporate Video'},
  {src: 'photos/perfume-outdoor-sky.jpg', w: 620, h: 350, tag: 'Product'},
  {src: 'photos/suits-warehouse.jpg', w: 560, h: 440, tag: 'Fashion'},
];
const Z0 = 1500;
const DZ = 900;
const Z_MARK = 8600;
const MARK_WORLD = 520; // mark height in world units
const MARK_Y = -100; // ring centre height

// ---------------- part B: logo wall ----------------
const ROWS = [
  ['bca', 'goto', 'wardah', 'paragon-corp', 'kahf', 'indika-foundation', 'mit-reap'],
  ['pijar', 'radyalabs', 'ybm-brilian', 'vogl-media', 'womens-space', 'brave'],
  ['fbn', 'ganara-art', 'novo-club', 'pemimpin-id', 'points-of-you', 'wardah-inspiring-teacher'],
];
const CARD_W = 300;
const CARD_H = 150;
const CARD_GAP = 28;
const INDUSTRIES: [string, number, number, string][] = [
  ['Perbankan', 250, 300, C.blueLight],
  ['Teknologi', 1660, 270, C.violetLight],
  ['Kecantikan', 150, 470, C.violetLight],
  ['Pendidikan', 1770, 450, C.blueLight],
  ['Yayasan', 330, 150, C.blueLight],
  ['Media', 1560, 130, C.blueLight],
  ['Komunitas', 210, 640, C.blueLight],
  ['Seni & Budaya', 1700, 620, C.violetLight],
];

// ---------------- part C: three different briefs ----------------
const BRIEFS = [
  {word: 'kebutuhan', icon: 'target', main: 'photos/paragon-discussion.jpg', inset: 'photos/paragon-empowered.jpg', x: 470},
  {word: 'karakter', icon: 'sparkle', main: 'photos/hijab-blazer-black.jpg', inset: 'photos/p41-stage-confetti.jpg', x: 960},
  {word: 'tantangan', icon: 'bolt', main: 'photos/bts-director-pointing.jpg', inset: 'photos/bts-bed-scene-overhead.jpg', x: 1450},
];
const BC_W = 420;
const BC_H = 560;
const BC_Y = 560;

// polaroid that carries us into Act 5
const POL = {w: 460, h: 560, photo: 420};
const POL_FOCAL: [number, number] = [300, 506]; // a spot in the bottom white margin

// "Dalam perjalanan kami, Ruber Visual telah berkolaborasi dengan berbagai klien dari beragam industri,
//  dengan kebutuhan, karakter, dan tantangan yang berbeda."
export const A04Journey: React.FC = () => {
  const t = useT();
  const bp = beatPulse(t);
  const dalam = at(15, 'dalam');
  const perjalanan = at(15, 'perjalanan');
  const kami = at(15, 'kami');
  const ruber = at(16, 'ruber');
  const telah = at(16, 'telah');
  const berkolaborasi = at(16, 'berkolaborasi');
  const dengan = at(16, 'dengan');
  const berbagai = at(16, 'berbagai');
  const klien = at(17, 'klien');
  const beragam = at(17, 'beragam');
  const industri = at(17, 'industri');
  const dengan2 = at(18, 'dengan');
  const kebutuhan = at(18, 'kebutuhan');
  const karakter = at(19, 'karakter');
  const tantangan = at(19, 'tantangan');
  const yang = at(19, 'yang');
  const berbeda = at(19, 'berbeda');
  const briefT = [kebutuhan, karakter, tantangan];

  // ---------------- camera for part A ----------------
  const camZ = kf(t, [
    [35.1, 0],
    [35.27, 220, ease.outCubic],
    [35.75, 1100],
    [36.23, 2000],
    [36.71, 2900],
    [37.2, 3800],
    [ruber, 7200, ease.inOutCubic],
    [38.18, 7450, ease.outCubic],
    [38.46, Z_MARK - 30, ease.inExpo],
  ]);
  const camY = kf(t, [
    [37.6, 0],
    [38.2, MARK_Y, ease.inOutCubic],
  ]);
  const cy = CY0;
  const fadeIn = prog(t, 35.1, 0.5, ease.outCubic);
  const proj = (x: number, y: number, z: number) => {
    const d = z - camZ;
    return {X: CX + (FOC * x) / d, Y: cy + (FOC * (y - camY)) / d, s: FOC / d, d};
  };
  const fog = (d: number) => clamp01((9200 - d) / 2600) * clamp01((d - 60) / 120);
  const partA = t < 38.47;

  // ---------------- part B / C / D timing ----------------
  const wallIn = prog(t, 38.3, 0.6, ease.outExpo);
  const wallOut = prog(t, 42.35, 0.5, ease.inCubic);
  const stack = prog(t, 45.75, 0.42, ease.inOutExpo);
  const polDrop = prog(t, 46.12, 0.36, ease.outBack);
  const dive = prog(t, 46.52, 0.68, ease.inCubic);
  const zoom = Math.exp(Math.log(46) * dive);
  const polX = 960;
  const polY = 540;
  const fx = mix(polX - POL.w / 2 + POL_FOCAL[0], 960, prog(t, 46.45, 0.7, ease.inOutCubic));
  const fy = mix(polY - POL.h / 2 + POL_FOCAL[1], 540, prog(t, 46.45, 0.7, ease.inOutCubic));
  const focal0: [number, number] = [polX - POL.w / 2 + POL_FOCAL[0], polY - POL.h / 2 + POL_FOCAL[1]];
  const world = `translate(${fx}px, ${fy}px) scale(${zoom}) translate(${-focal0[0]}px, ${-focal0[1]}px)`;

  // floor grid lines (projected)
  const gridLines: React.ReactNode[] = [];
  if (partA) {
    for (let k = -12; k <= 12; k++) {
      if (k === 0) continue;
      const x = k * 300;
      const a = proj(x, FLOOR, camZ + 140);
      const b = proj(x, FLOOR, camZ + 9200);
      gridLines.push(<line key={'x' + k} x1={a.X} y1={a.Y} x2={b.X} y2={b.Y} stroke="url(#floorFade)" strokeWidth={1.5} />);
    }
    const z0 = Math.ceil((camZ + 140) / 400) * 400;
    for (let z = z0; z < camZ + 9200; z += 400) {
      const a = proj(-3600, FLOOR, z);
      const b = proj(3600, FLOOR, z);
      const o = fog(z - camZ) * 0.4;
      gridLines.push(<line key={'z' + z} x1={a.X} y1={a.Y} x2={b.X} y2={b.Y} stroke={C.blueLight} strokeOpacity={o} strokeWidth={1.5} />);
    }
  }

  return (
    <AbsoluteFill>
      <InkBg
        fadeFrom={35.1}
        glow={[
          [C.blue, 50, 40],
          [C.violet, 85, 80],
        ]}
        dots={false}
      />

      {/* ================= part B: logo wall ================= */}
      {t > 38.18 && t < 43.0 ? (
        <AbsoluteFill style={{perspective: 1800, opacity: clamp01(wallIn * 1.5) * (1 - wallOut)}}>
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: 680 + wallOut * 260,
              width: 0,
              height: 0,
              transform: `rotateX(${mix(58, 20, wallIn) + wallOut * 35}deg) rotateZ(-7deg) scale(${mix(0.72, 1, wallIn) * (1 + bp * 0.006)})`,
              filter: wallIn < 0.98 ? `blur(${(1 - wallIn) * 14}px)` : wallOut > 0.02 ? `blur(${wallOut * 12}px)` : undefined,
            }}
          >
            {ROWS.map((row, r) => {
              const dir = r % 2 ? 1 : -1;
              const rowW = row.length * (CARD_W + CARD_GAP);
              const off = (((dir * (t - 38.4) * 95 + r * 140) % rowW) + rowW) % rowW;
              const items = [...row, ...row, ...row, ...row];
              return (
                <div key={r} style={{position: 'absolute', left: -rowW * 2 + off, top: (r - 1) * (CARD_H + 34) - CARD_H / 2, display: 'flex', gap: CARD_GAP}}>
                  {items.map((logo, i) => {
                    const pop = prog(t, 38.45 + ((i % row.length) / row.length) * 0.4 + r * 0.08, 0.5, ease.outBackStrong);
                    return (
                      <div
                        key={logo + i}
                        style={{
                          width: CARD_W,
                          height: CARD_H,
                          borderRadius: 24,
                          background: '#fff',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 24px 50px rgba(0,0,0,0.45)',
                          transform: `scale(${mix(0.6, 1, pop)})`,
                          opacity: clamp01(pop * 2),
                        }}
                      >
                        <Img src={staticFile(`logos/${logo}.png`)} style={{maxWidth: 220, maxHeight: 92, objectFit: 'contain'}} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {/* vignette so the wall melts into the dark */}
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 50% 62%, transparent 45%, rgba(7,8,22,0.92) 100%)'}} />
        </AbsoluteFill>
      ) : null}
      {/* ================= part A: journey ================= */}
      {partA ? (
        <AbsoluteFill style={{opacity: fadeIn}}>
          {/* portal: once the dive starts, part A is opaque except the ring's hole */}
          {t > 38.18
            ? (() => {
                const d = Z_MARK - camZ;
                const c = proj(0, MARK_Y, Z_MARK);
                const r = Math.max(0, 40 * (MARK_WORLD / 455) * (FOC / d));
                return (
                  <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: prog(t, 38.18, 0.12)}}>
                    <path d={`M0 0H1920V1080H0Z M${c.X + r} ${c.Y} A${r} ${r} 0 1 0 ${c.X - r} ${c.Y} A${r} ${r} 0 1 0 ${c.X + r} ${c.Y} Z`} fill={C.ink} fillRule="evenodd" />
                  </svg>
                );
              })()
            : null}
          {/* horizon glow */}
          <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 30% at 50% ${(cy - (FOC * camY) / 9000) / 10.8}%, rgba(109,62,204,0.35), transparent 70%)`}} />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <defs>
              <linearGradient id="floorFade" gradientUnits="userSpaceOnUse" x1="0" y1={cy} x2="0" y2={1080}>
                <stop offset="0" stopColor={C.blueLight} stopOpacity={0} />
                <stop offset="0.25" stopColor={C.blueLight} stopOpacity={0.25} />
                <stop offset="1" stopColor={C.blueLight} stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="pathFill" gradientUnits="userSpaceOnUse" x1="0" y1={cy} x2="0" y2={1080}>
                <stop offset="0" stopColor={C.blueMid} stopOpacity={0} />
                <stop offset="0.3" stopColor={C.blueMid} stopOpacity={0.35} />
                <stop offset="1" stopColor={C.violetMid} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            {gridLines}
            {/* the path */}
            {(() => {
              const n1 = proj(-110, FLOOR, camZ + 140);
              const n2 = proj(110, FLOOR, camZ + 140);
              const f1 = proj(-110, FLOOR, Z_MARK);
              const f2 = proj(110, FLOOR, Z_MARK);
              return <path d={`M${n1.X} ${n1.Y} L${f1.X} ${f1.Y} L${f2.X} ${f2.Y} L${n2.X} ${n2.Y} Z`} fill="url(#pathFill)" />;
            })()}
            {Array.from({length: 40}, (_, k) => {
              const z = Math.floor(camZ / 260) * 260 + k * 260 + 160;
              if (z > Z_MARK - 100) return null;
              const a = proj(-7, FLOOR, z);
              const b = proj(7, FLOOR, z + 110);
              const d = z - camZ;
              if (d < 140) return null;
              return <rect key={'dash' + k} x={Math.min(a.X, b.X)} y={b.Y} width={Math.abs(a.X - b.X) + (FOC * 14) / d} height={Math.max(1, a.Y - b.Y)} fill="#fff" opacity={fog(d) * 0.8} />;
            })}
            {/* milestones */}
            {JOURNEY.map((ph, i) => {
              const z = Z0 + i * DZ;
              const d = z - camZ;
              if (d < 120 || d > 9200) return null;
              const side = i % 2 ? 1 : -1;
              const dot = proj(0, FLOOR, z);
              const foot = proj(side * 640, FLOOR, z);
              const top = proj(side * 640, -60 + ph.h / 2, z);
              const o = fog(d);
              return (
                <g key={'m' + i} opacity={o}>
                  <line x1={dot.X} y1={dot.Y} x2={foot.X} y2={foot.Y} stroke={C.violetLight} strokeOpacity={0.6} strokeWidth={Math.max(1, 3 * dot.s)} />
                  <line x1={foot.X} y1={foot.Y} x2={top.X} y2={top.Y} stroke={C.blueLight} strokeOpacity={0.6} strokeWidth={Math.max(1, 3 * dot.s)} />
                  <circle cx={dot.X} cy={dot.Y} r={Math.max(2, 16 * dot.s)} fill="#fff" />
                  <circle cx={dot.X} cy={dot.Y} r={Math.max(4, 40 * dot.s)} fill="none" stroke={C.blueLight} strokeWidth={Math.max(1, 4 * dot.s)} opacity={0.6} />
                </g>
              );
            })}
            {/* dust */}
            {Array.from({length: 60}, (_, k) => {
              const zz = ((rand(k, 1) * 9000 - camZ * 0.9) % 9000 + 9000) % 9000 + 200;
              const p = {X: CX + (FOC * (rand(k, 2) - 0.5) * 5200) / zz, Y: cy + (FOC * ((rand(k, 3) - 0.6) * 1800 - camY)) / zz};
              return <circle key={'dust' + k} cx={p.X} cy={p.Y} r={Math.min(4, 1 + 900 / zz)} fill={k % 2 ? C.blueLight : '#fff'} opacity={fog(zz) * 0.5} />;
            })}
          </svg>
          {/* billboards, far to near */}
          {JOURNEY.map((ph, i) => ({ph, i, z: Z0 + i * DZ}))
            .reverse()
            .map(({ph, i, z}) => {
              const d = z - camZ;
              if (d < 150 || d > 9200) return null;
              const side = i % 2 ? 1 : -1;
              const c = proj(side * 640, -60, z);
              return (
                <div
                  key={ph.src}
                  style={{
                    position: 'absolute',
                    left: c.X,
                    top: c.Y,
                    width: ph.w,
                    height: ph.h,
                    marginLeft: -ph.w / 2,
                    marginTop: -ph.h / 2,
                    transform: `scale(${c.s}) perspective(900px) rotateY(${-side * 20}deg)`,
                    opacity: fog(d),
                  }}
                >
                  <div style={{width: '100%', height: '100%', borderRadius: 18, overflow: 'hidden', boxShadow: `0 0 0 4px rgba(255,255,255,0.9), 0 30px 80px rgba(0,0,0,0.5)`}}>
                    <Img src={staticFile(ph.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                  <div style={{position: 'absolute', left: 0, top: ph.h + 18, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff', fontFamily: F.mono, fontSize: 20, letterSpacing: '0.08em', whiteSpace: 'nowrap'}}>
                    <div style={{width: 10, height: 10, borderRadius: 5, background: side > 0 ? C.violetLight : C.blueLight}} />
                    {String(i + 1).padStart(2, '0')} · {ph.tag.toUpperCase()}
                  </div>
                </div>
              );
            })}
          {/* the destination: Ruber Visual */}
          {(() => {
            const d = Z_MARK - camZ;
            if (d < 20) return null;
            const s = (FOC / d) * (MARK_WORLD / 455);
            const c = proj(0, MARK_Y, Z_MARK);
            const size = 455 * s;
            return (
              <div style={{position: 'absolute', left: c.X - RING_C[0] * s, top: c.Y - RING_C[1] * s, opacity: fog(d) * prog(t, 35.6, 0.6)}}>
                <RuberMark size={size} color="#fff" />
              </div>
            );
          })()}
          {/* keywords */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 118, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {t > dalam - 0.1 && t < 37.7 ? (
              <>
                <Label size={24} color={C.blueLight}>
                  <W t={dalam} out={37.45}>
                    dalam
                  </W>
                </Label>
                <H size={150} color="#fff" style={{marginTop: 2}}>
                  <W t={perjalanan} out={37.45} look="serif" dark style={{fontSize: '1.08em'}}>
                    perjalanan{' '}
                  </W>
                  <W t={kami} out={37.45}>
                    kami,
                  </W>
                </H>
              </>
            ) : null}
            {t > ruber - 0.1 && t < 38.35 ? (
              <H size={64} color="#fff" weight={700} style={{marginTop: 30}}>
                <W t={ruber} out={38.15}>
                  Ruber Visual{' '}
                </W>
                <W t={telah} out={38.15}>
                  telah
                </W>
              </H>
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}

      {t > 38.4 && t < 42.7 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 96, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {t < klien - 0.05 ? (
            <>
              <Label size={24} color={C.blueLight}>
                <W t={38.42} out={klien - 0.25}>
                  ruber visual telah
                </W>
              </Label>
              <H size={132} color="#fff" style={{marginTop: 4}}>
                <W t={berkolaborasi} out={klien - 0.25} look="grad" dark>
                  berkolaborasi
                </W>
              </H>
              <H size={50} color="rgba(255,255,255,0.75)" weight={700} style={{marginTop: 6}}>
                <W t={dengan} out={klien - 0.25}>
                  dengan{' '}
                </W>
                <W t={berbagai} out={klien - 0.25}>
                  berbagai
                </W>
              </H>
            </>
          ) : (
            <>
              <H size={132} color="#fff">
                <W t={klien} out={42.4}>
                  klien{' '}
                </W>
                <W t={at(17, 'dari')} out={42.4} style={{fontSize: '0.45em', fontWeight: 700, color: 'rgba(255,255,255,0.7)'}}>
                  dari{' '}
                </W>
              </H>
              <H size={110} color="#fff" style={{marginTop: -6}}>
                <W t={beragam} out={42.4} look="serif" dark>
                  beragam{' '}
                </W>
                <W t={industri} out={42.4} look="serif" dark>
                  industri
                </W>
              </H>
            </>
          )}
        </div>
      ) : null}
      {/* industry chips */}
      {t > beragam - 0.05 && t < 42.7
        ? INDUSTRIES.map(([label, x, y, col], i) => {
            const p = prog(t, beragam + i * 0.06, 0.45, ease.outBackStrong);
            const o = 1 - prog(t, 42.25 + i * 0.02, 0.25, ease.inCubic);
            return (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y + Math.sin(t * 2 + i) * 6,
                  transform: `translate(-50%, -50%) scale(${p * o})`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 22px',
                  borderRadius: 999,
                  background: 'rgba(13,14,33,0.86)',
                  border: `1.5px solid ${col}66`,
                  boxShadow: `0 14px 34px rgba(0,0,0,0.5)`,
                  color: '#fff',
                  fontFamily: F.display,
                  fontWeight: 700,
                  fontSize: 26,
                  whiteSpace: 'nowrap',
                }}
              >
                <div style={{width: 12, height: 12, borderRadius: 6, background: col}} />
                {label}
              </div>
            );
          })
        : null}

      {/* ================= part C + D: briefs → polaroid → dive ================= */}
      {t > 42.3 ? (
        <AbsoluteFill style={{transform: world, transformOrigin: '0 0'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 88, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {t < yang - 0.1 ? (
              <Label size={26} color={C.blueLight}>
                <W t={dengan2} out={yang - 0.3}>
                  dengan
                </W>
              </Label>
            ) : (
              <H size={124} color="#fff" style={{opacity: 1 - stack}}>
                <W t={yang} style={{fontSize: '0.5em', fontWeight: 700, color: 'rgba(255,255,255,0.75)'}}>
                  yang{' '}
                </W>
                <W t={berbeda} look="serif" dark>
                  berbeda.
                </W>
              </H>
            )}
          </div>
          {BRIEFS.map((b, i) => {
            const t0 = briefT[i];
            const pin = prog(t, t0 - 0.06, 0.55, ease.outBackStrong);
            if (t < t0 - 0.08) return null;
            const diff = prog(t, berbeda + i * 0.07, 0.5, ease.outBackStrong);
            const rot0 = [-4, 2, 5][i];
            const rotD = [-7, 0, 8][i];
            const sx = mix(b.x, 960 + (i - 1) * 22, stack);
            const sy = mix(BC_Y, 540 + (i - 1) * 10, stack);
            const sRot = mix(mix(rot0 * (1 - pin) * 4, rotD, diff), (i - 1) * 7, stack);
            const bg = i === 0 ? GRAD_MID : i === 1 ? C.ink : C.violet;
            const fg = diff > 0.5 ? '#fff' : C.ink;
            const clip =
              i === 2 && diff > 0
                ? `polygon(0 ${4 * diff}%, ${12 * diff}% 0, 100% ${2 * diff}%, 100% ${92 + 0 * diff}%, ${88 + 12 * (1 - diff)}% 100%, 0 100%)`
                : undefined;
            return (
              <div
                key={b.word}
                style={{
                  position: 'absolute',
                  left: sx - BC_W / 2,
                  top: sy - BC_H / 2 + (1 - pin) * 420,
                  width: BC_W,
                  height: BC_H,
                  transform: `rotate(${sRot}deg) scale(${(i === 1 ? 1 + diff * 0.06 : 1) * mix(1, 0.92, stack)})`,
                  opacity: clamp01(pin * 3),
                  zIndex: i === 1 ? 3 : 2,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: i === 0 ? mix(28, 48, diff) : 28,
                    background: '#fff',
                    overflow: 'hidden',
                    clipPath: clip,
                    boxShadow: '0 40px 90px rgba(0,0,0,0.5)',
                    border: i === 1 && diff > 0 ? `${3 * diff}px solid ${C.blueLight}` : undefined,
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{position: 'absolute', inset: 0, background: bg, opacity: diff}} />
                  <div style={{position: 'absolute', left: 18, top: 18, right: 18, height: 360, borderRadius: 18, overflow: 'hidden'}}>
                    <Img
                      src={staticFile(b.main)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: i === 1 ? `grayscale(${diff}) contrast(${1 + diff * 0.25})` : i === 2 ? `saturate(${1 + diff * 0.6}) hue-rotate(${diff * -18}deg)` : undefined,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      right: 30,
                      top: 268,
                      width: 150,
                      height: 150,
                      borderRadius: i === 0 ? 75 * diff + 18 * (1 - diff) : 18,
                      overflow: 'hidden',
                      border: '5px solid #fff',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                      transform: `rotate(${(i - 1) * 6 * diff}deg)`,
                    }}
                  >
                    <Img src={staticFile(b.inset)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                  <div style={{position: 'absolute', left: 30, bottom: 34, display: 'flex', alignItems: 'center', gap: 14}}>
                    <div style={{width: 58, height: 58, borderRadius: 16, background: diff > 0.5 ? 'rgba(255,255,255,0.16)' : C.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Icon name={b.icon} size={32} color={diff > 0.5 ? '#fff' : C.blueMid} stroke={2.2} />
                    </div>
                    <div
                      style={{
                        fontFamily: i === 1 && diff > 0.5 ? F.serif : F.display,
                        fontStyle: i === 1 && diff > 0.5 ? 'italic' : 'normal',
                        fontWeight: i === 1 && diff > 0.5 ? 400 : 800,
                        fontSize: i === 1 && diff > 0.5 ? 58 : 48,
                        letterSpacing: i === 2 && diff > 0.5 ? '0.02em' : '-0.04em',
                        textTransform: i === 2 && diff > 0.5 ? 'uppercase' : 'none',
                        color: fg,
                      }}
                    >
                      {b.word}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* the experience: a polaroid lands on top of the stack */}
          {t > 46.05 ? (
            <div
              style={{
                position: 'absolute',
                left: polX - POL.w / 2,
                top: polY - POL.h / 2 - (1 - polDrop) * 700,
                width: POL.w,
                height: POL.h,
                transform: `rotate(${mix(-18, -3, polDrop)}deg)`,
                transformOrigin: `${POL_FOCAL[0]}px ${POL_FOCAL[1]}px`,
                background: '#fff',
                borderRadius: 6,
                boxShadow: `0 ${mix(80, 30, polDrop)}px ${mix(120, 70, polDrop)}px rgba(0,0,0,0.55)`,
                zIndex: 10,
              }}
            >
              <div style={{position: 'absolute', left: 20, top: 20, width: POL.photo, height: POL.photo, overflow: 'hidden', background: C.ink}}>
                <Img src={staticFile('photos/bts-shoot-bedroom-crew.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

