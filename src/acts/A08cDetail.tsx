import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, GRAD, GRAD_MID} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Icon} from '../components/Icons';
import {MOSAIC} from '../data/mosaic';
import {useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog} from '../lib/anim';
import {kf} from '../lib/kf';
import {DOT_CELL, DOT_COLS, DOT_R, dotColor} from '../lib/dots';

// detail photo geometry (shared with scripts/mosaic.py — keep in sync)
const PX = 760;
const PY = 170;
const PW = 1080;
const PHB = 600;
const LOUPE_R = 170;
const MAG = 2;
const SPOTS = {
  warna: [922, 412] as [number, number],
  cahaya: [1286, 465] as [number, number],
  fokus: [1162, 384] as [number, number], // final loupe position → the mosaic crop
};
const DIVE_Z = 8;

const TASKS = ['Brief', 'Konsep', 'Produksi', 'Editing', 'Publish'];
const LEN = [0.13, 0.15, 0.2, 0.14, 0.07];
const GAPS = [0.07, 0.08, 0.06, 0.05];
const OUTPUTS = [
  {src: 'photos/titip-office-desk.jpg', chip: '4K'},
  {src: 'photos/titip-office-smile.jpg', chip: 'Color graded'},
  {src: 'photos/library-landscape.jpg', chip: 'Final'},
];

const DetailPhoto: React.FC<{style?: React.CSSProperties}> = ({style}) => (
  <Img src={staticFile('photos/titip-bed-tissue.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style}} />
);

// "Dengan proses tersebut, setiap pekerjaan dapat berjalan lebih efisien tanpa mengurangi kualitas
//  dan perhatian terhadap detail."
export const A08cDetail: React.FC = () => {
  const t = useT();
  const dengan = at(36, 'dengan');
  const proses = at(36, 'proses');
  const tersebut = at(36, 'tersebut');
  const setiap = at(37, 'setiap');
  const pekerjaan = at(37, 'pekerjaan');
  const berjalan = at(37, 'berjalan');
  const lebih = at(37, 'lebih');
  const efisien = at(37, 'efisien');
  const tanpa = at(38, 'tanpa');
  const mengurangi = at(38, 'mengurangi');
  const kualitas = at(38, 'kualitas');
  const dan = at(38, 'dan');
  const perhatian = at(38, 'perhatian');
  const terhadap = at(38, 'terhadap');
  const detail = at(38, 'detail');

  // ---------------- phases ----------------
  const tlIn = prog(t, setiap - 0.25, 0.55, ease.outExpo);
  const tlOut = prog(t, tanpa - 0.15, 0.4, ease.inCubic);
  const squeeze = prog(t, efisien - 0.05, 0.55, ease.inOutExpo);
  const qIn = prog(t, tanpa - 0.05, 0.5, ease.outExpo);
  const qOut = prog(t, dan - 0.2, 0.38, ease.inCubic);
  const dIn = prog(t, dan - 0.15, 0.5, ease.outExpo);

  // loupe path
  const lx = kf(t, [
    [perhatian, SPOTS.warna[0]],
    [terhadap + 0.05, SPOTS.cahaya[0], ease.inOutCubic],
    [detail, SPOTS.fokus[0], ease.inOutCubic],
  ]);
  const ly = kf(t, [
    [perhatian, SPOTS.warna[1]],
    [terhadap + 0.05, SPOTS.cahaya[1], ease.inOutCubic],
    [detail, SPOTS.fokus[1], ease.inOutCubic],
  ]);
  const loupeIn = prog(t, perhatian - 0.1, 0.4, ease.outBackStrong);

  // dive → pixels → dots
  const dive = prog(t, 94.18, 0.56, ease.inCubic);
  const zoom = Math.exp(Math.log(DIVE_Z) * dive);
  const fx = mix(SPOTS.fokus[0], 960, prog(t, 94.15, 0.59, ease.inOutCubic));
  const fy = mix(SPOTS.fokus[1], 540, prog(t, 94.15, 0.59, ease.inOutCubic));
  const world = `translate(${fx}px, ${fy}px) scale(${zoom}) translate(${-SPOTS.fokus[0]}px, ${-SPOTS.fokus[1]}px)`;
  const px128 = prog(t, 94.75, 0.05, ease.linear);
  const px64 = prog(t, 94.83, 0.05, ease.linear);
  const px32 = prog(t, 94.9, 0.05, ease.linear);
  const toDots = prog(t, 94.97, 0.31, ease.inOutCubic);


  return (
    <AbsoluteFill>
      <PaperBg
        fadeFrom={86.65}
        blobs={[
          {x: 90, y: 85, r: 320, color: C.blueSoft, seed: 'r1'},
          {x: 8, y: 10, r: 280, color: C.violetSoft, seed: 'r2'},
        ]}
      />

      {/* ================= dengan proses tersebut ================= */}
      {t < setiap + 0.3 ? (
        <AbsoluteFill style={{opacity: 1 - prog(t, setiap - 0.2, 0.3)}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <H size={118}>
              <W t={dengan} style={{fontSize: '0.5em', fontWeight: 700, color: C.muted}}>
                dengan{' '}
              </W>
              <W t={proses} look="serif" style={{fontSize: '1.12em'}}>
                proses{' '}
              </W>
              <W t={tersebut}>tersebut,</W>
            </H>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 40}}>
              {['01 Memahami', '02 Pendekatan', '03 Strategi', '04 Eksekusi'].map((s, i) => {
                const p = prog(t, proses + i * 0.1, 0.4, ease.outBackStrong);
                return (
                  <React.Fragment key={s}>
                    <div style={{padding: '12px 22px', borderRadius: 999, background: '#fff', boxShadow: '0 12px 30px rgba(20,16,65,0.12)', fontFamily: F.display, fontWeight: 800, fontSize: 26, color: C.ink, transform: `scale(${p})`, display: 'flex', alignItems: 'center', gap: 10}}>
                      <span style={{width: 26, height: 26, borderRadius: 13, background: GRAD, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Icon name="check" size={16} color="#fff" stroke={3.2} />
                      </span>
                      {s}
                    </div>
                    {i < 3 ? (
                      <div style={{opacity: p}}>
                        <Icon name="arrow" size={28} color={C.blueMid} stroke={2.4} />
                      </div>
                    ) : null}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ================= efficient timeline ================= */}
      {tlIn > 0 && tlOut < 1 ? (
        <AbsoluteFill style={{opacity: clamp01(tlIn * 2) * (1 - tlOut), transform: `translateY(${(1 - tlIn) * 80 - tlOut * 260}px)`}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 84, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Label size={26} color={C.blueMid}>
              <W t={setiap}>setiap </W>
              <W t={pekerjaan}>pekerjaan </W>
              <W t={berjalan - 0.24}>dapat </W>
              <W t={berjalan}>berjalan</W>
            </Label>
            <H size={112} style={{marginTop: 4}}>
              <W t={lebih}>lebih </W>
              <W t={efisien} look="grad">
                efisien.
              </W>
            </H>
          </div>
          <div style={{position: 'absolute', left: 260, top: 330, width: 1400, height: 520, borderRadius: 34, background: '#fff', boxShadow: '0 40px 90px rgba(20,16,65,0.16)'}}>
            <div style={{position: 'absolute', left: 40, top: 32, fontFamily: F.display, fontWeight: 800, fontSize: 30, color: C.ink}}>Project timeline</div>
            <div style={{position: 'absolute', right: 40, top: 30, padding: '6px 16px', borderRadius: 999, background: C.blueSoft, fontFamily: F.mono, fontSize: 18, color: C.blue}}>MINGGU 1 — 4</div>
            {(() => {
              const TX = 260;
              const TW = 1080;
              let cursor = 0;
              return TASKS.map((task, i) => {
                const start = cursor;
                const len = LEN[i];
                cursor = start + len + (i < GAPS.length ? GAPS[i] * (1 - squeeze) : 0);
                const draw = prog(t, setiap + 0.05 + i * 0.22, 0.4, ease.outExpo);
                const gapW = i < GAPS.length ? GAPS[i] * (1 - squeeze) : 0;
                return (
                  <div key={task} style={{position: 'absolute', left: 40, right: 40, top: 100 + i * 76, height: 56}}>
                    <div style={{position: 'absolute', left: 0, top: 12, fontFamily: F.display, fontWeight: 700, fontSize: 26, color: C.ink}}>{task}</div>
                    <div style={{position: 'absolute', left: TX - 40, width: TW, top: 0, height: 56, borderRadius: 14, background: 'rgba(7,8,22,0.035)'}} />
                    <div
                      style={{
                        position: 'absolute',
                        left: TX - 40 + start * TW,
                        width: len * TW * draw,
                        top: 0,
                        height: 56,
                        borderRadius: 14,
                        background: i % 2 ? `linear-gradient(90deg, ${C.violetMid}, ${C.violet})` : `linear-gradient(90deg, ${C.blueMid}, ${C.blue})`,
                        boxShadow: '0 10px 22px rgba(47,73,198,0.25)',
                      }}
                    />
                    {gapW > 0.002 && draw >= 1 ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: TX - 40 + (start + len) * TW,
                          width: gapW * TW,
                          top: 8,
                          height: 40,
                          borderRadius: 10,
                          backgroundImage: 'repeating-linear-gradient(135deg, rgba(7,8,22,0.10) 0 6px, transparent 6px 14px)',
                          opacity: 1 - squeeze,
                        }}
                      />
                    ) : null}
                  </div>
                );
              });
            })()}
            {/* end markers */}
            {(() => {
              const total = LEN.reduce((a, b) => a + b, 0) + GAPS.reduce((a, b) => a + b, 0) * (1 - squeeze);
              const before = LEN.reduce((a, b) => a + b, 0) + GAPS.reduce((a, b) => a + b, 0);
              return (
                <>
                  <div style={{position: 'absolute', left: 260 + before * 1080, top: 88, bottom: 30, width: 0, borderLeft: `3px dashed rgba(7,8,22,${0.25 * squeeze})`}} />
                  <div style={{position: 'absolute', left: 260 + total * 1080, top: 88, bottom: 30, width: 4, borderRadius: 2, background: C.violetMid, opacity: prog(t, setiap + 1.1, 0.3)}} />
                  <div
                    style={{
                      position: 'absolute',
                      left: 260 + total * 1080 + 18,
                      top: 380,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 20px',
                      borderRadius: 999,
                      background: GRAD,
                      color: '#fff',
                      fontFamily: F.display,
                      fontWeight: 800,
                      fontSize: 26,
                      transform: `scale(${prog(t, efisien + 0.2, 0.4, ease.outBackStrong)})`,
                      transformOrigin: '0% 50%',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon name="bolt" size={26} color="#fff" fill="#fff" stroke={1} />
                    lebih efisien
                  </div>
                </>
              );
            })()}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ================= without losing quality ================= */}
      {qIn > 0 && qOut < 1 ? (
        <AbsoluteFill style={{opacity: clamp01(qIn * 2) * (1 - qOut), transform: `translateX(${(1 - qIn) * 140 - qOut * 300}px)`}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 84, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Label size={26} color={C.blueMid}>
              <W t={tanpa}>tanpa </W>
              <W t={mengurangi}>mengurangi</W>
            </Label>
            <H size={112} style={{marginTop: 4}}>
              <W t={kualitas} look="serif" style={{fontSize: '1.12em'}}>
                kualitas.
              </W>
            </H>
          </div>
          {OUTPUTS.map((o, i) => {
            const p = prog(t, tanpa + i * 0.1, 0.5, ease.outBackStrong);
            return (
              <div
                key={o.src}
                style={{
                  position: 'absolute',
                  left: 150 + i * 560,
                  top: 340,
                  width: 520,
                  height: 300,
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px rgba(20,16,65,0.2)',
                  transform: `translateY(${(1 - p) * 60}px) scale(${mix(0.9, 1, p)})`,
                  opacity: clamp01(p * 2),
                }}
              >
                <Img src={staticFile(o.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <div style={{position: 'absolute', left: 16, top: 16, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', fontFamily: F.display, fontWeight: 800, fontSize: 18, color: C.ink}}>{o.chip}</div>
              </div>
            );
          })}
          {[
            {label: 'Efisiensi', from: 0.55, icon: 'bolt'},
            {label: 'Kualitas', from: 1, icon: 'sparkle'},
          ].map((m, i) => {
            const fill = m.from === 1 ? 1 : mix(m.from, 1, prog(t, tanpa + 0.2, 0.9, ease.inOutCubic));
            const lock = prog(t, kualitas, 0.4, ease.outBackStrong);
            return (
              <div key={m.label} style={{position: 'absolute', left: 150, width: 1640, top: 700 + i * 86, height: 60, display: 'flex', alignItems: 'center', gap: 24}}>
                <div style={{width: 48, height: 48, borderRadius: 14, background: i ? GRAD : C.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name={m.icon} size={26} color={i ? '#fff' : C.blueMid} stroke={2.2} />
                </div>
                <div style={{width: 180, fontFamily: F.display, fontWeight: 800, fontSize: 30, color: C.ink}}>{m.label}</div>
                <div style={{flex: 1, height: 18, borderRadius: 9, background: 'rgba(7,8,22,0.07)', overflow: 'hidden'}}>
                  <div style={{width: `${fill * 100}%`, height: '100%', borderRadius: 9, background: GRAD_MID, boxShadow: i && lock > 0 ? `0 0 ${20 * bump(t, kualitas, 0.5)}px ${C.violetMid}` : undefined}} />
                </div>
                <div style={{width: 110, fontFamily: F.display, fontWeight: 800, fontSize: 32, color: C.ink, fontVariantNumeric: 'tabular-nums'}}>{Math.round(fill * 100)}%</div>
                {i === 1 ? (
                  <div style={{width: 48, height: 48, borderRadius: 24, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${lock})`}}>
                    <Icon name="check" size={28} color="#fff" stroke={3.2} />
                  </div>
                ) : (
                  <div style={{width: 48}} />
                )}
              </div>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* ================= attention to detail ================= */}
      {dIn > 0 && t < 94.97 ? (
        <AbsoluteFill style={{transform: world, transformOrigin: '0 0'}}>
          <div style={{position: 'absolute', left: 90, top: 300, opacity: clamp01(dIn * 2) * (1 - prog(t, 94.2, 0.2)), transform: `translateX(${(1 - dIn) * -120}px)`}}>
            <H size={64} align="left" color={C.muted} weight={700} lh={1.05}>
              <W t={dan}>dan </W>
              <W t={perhatian}>perhatian</W>
              <br />
              <W t={terhadap}>terhadap</W>
            </H>
            <H size={200} align="left" style={{marginTop: 10}}>
              <W t={detail} look="serif" style={{fontSize: '1.05em'}}>
                detail.
              </W>
            </H>
          </div>
          {/* the photo */}
          <div
            style={{
              position: 'absolute',
              left: PX,
              top: PY,
              width: PW,
              height: PHB,
              borderRadius: 26,
              overflow: 'hidden',
              boxShadow: '0 40px 90px rgba(20,16,65,0.25)',
              transform: `translateX(${(1 - dIn) * 500}px)`,
              opacity: clamp01(dIn * 2),
            }}
          >
            <DetailPhoto />
            {/* rule of thirds — composition */}
            <svg width={PW} height={PHB} style={{position: 'absolute', inset: 0, opacity: prog(t, perhatian + 0.1, 0.3) * (1 - prog(t, detail, 0.3))}}>
              {[1, 2].map((k) => (
                <g key={k} stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeDasharray="8 8">
                  <line x1={(PW * k) / 3} y1={0} x2={(PW * k) / 3} y2={PHB} />
                  <line x1={0} y1={(PHB * k) / 3} x2={PW} y2={(PHB * k) / 3} />
                </g>
              ))}
            </svg>
          </div>
          {/* callouts */}
          {[
            {label: 'komposisi', x: PX + PW - 60, y: PY - 50, t0: perhatian + 0.1, anchor: [PX + (PW * 2) / 3, PY + PHB / 3]},
            {label: 'warna', x: PX + 40, y: PY - 50, t0: perhatian + 0.05, anchor: SPOTS.warna},
            {label: 'cahaya', x: PX + PW - 60, y: PY + PHB + 50, t0: terhadap + 0.1, anchor: SPOTS.cahaya},
            {label: 'fokus', x: PX + 300, y: PY + PHB + 50, t0: detail - 0.05, anchor: SPOTS.fokus},
          ].map((c) => {
            const p = prog(t, c.t0, 0.4, ease.outBackStrong);
            if (p <= 0) return null;
            const o = 1 - prog(t, 94.15, 0.15);
            return (
              <React.Fragment key={c.label}>
                <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: o}}>
                  <line x1={c.x} y1={c.y} x2={mix(c.x, c.anchor[0], p)} y2={mix(c.y, c.anchor[1], p)} stroke={C.violetMid} strokeWidth={3} />
                  <circle cx={c.anchor[0]} cy={c.anchor[1]} r={9 * p} fill="#fff" stroke={C.violetMid} strokeWidth={4} />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    left: c.x,
                    top: c.y,
                    transform: `translate(-50%, -50%) scale(${p})`,
                    padding: '10px 22px',
                    borderRadius: 999,
                    background: C.ink,
                    color: '#fff',
                    fontFamily: F.display,
                    fontWeight: 800,
                    fontSize: 28,
                    whiteSpace: 'nowrap',
                    opacity: o,
                  }}
                >
                  {c.label}
                </div>
              </React.Fragment>
            );
          })}
          {/* the loupe */}
          {loupeIn > 0 ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: PX,
                  top: PY,
                  width: PW,
                  height: PHB,
                  clipPath: `circle(${LOUPE_R * loupeIn}px at ${lx - PX}px ${ly - PY}px)`,
                }}
              >
                <div style={{position: 'absolute', inset: 0, transform: `scale(${MAG})`, transformOrigin: `${lx - PX}px ${ly - PY}px`}}>
                  <DetailPhoto />
                </div>
              </div>
              <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
                <circle cx={lx} cy={ly} r={LOUPE_R * loupeIn + 7} fill="none" stroke="#fff" strokeWidth={14} />
                <circle cx={lx} cy={ly} r={LOUPE_R * loupeIn + 15} fill="none" stroke={C.violetMid} strokeWidth={4} />
                <line
                  x1={lx + (LOUPE_R + 14) * 0.7 * loupeIn}
                  y1={ly + (LOUPE_R + 14) * 0.7 * loupeIn}
                  x2={lx + (LOUPE_R + 130) * 0.7 * loupeIn}
                  y2={ly + (LOUPE_R + 130) * 0.7 * loupeIn}
                  stroke={C.ink}
                  strokeWidth={30}
                  strokeLinecap="round"
                  opacity={1 - dive}
                />
              </svg>
            </>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* ================= pixels → dots (into Act 9) ================= */}
      {t > 94.74 ? (
        <AbsoluteFill>
          <AbsoluteFill style={{background: C.ink, opacity: px32 >= 1 ? 1 : 0}} />
          {[
            ['sketch/mosaic-128.png', px128 * (1 - px64)],
            ['sketch/mosaic-64.png', px64 * (1 - px32)],
          ].map(([src, o]) =>
            (o as number) > 0 ? (
              <Img key={src as string} src={staticFile(src as string)} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, imageRendering: 'pixelated', opacity: o as number}} />
            ) : null,
          )}
          {px32 > 0
            ? MOSAIC.map((col, i) => {
                const cx = (i % DOT_COLS) * DOT_CELL;
                const cy = Math.floor(i / DOT_COLS) * DOT_CELL;
                const d = clamp01(toDots * 1.25 - ((i % DOT_COLS) / DOT_COLS) * 0.25);
                const size = mix(DOT_CELL + 0.5, DOT_R * 2, d);
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: cx + DOT_CELL / 2 - size / 2,
                      top: cy + DOT_CELL / 2 - size / 2,
                      width: size,
                      height: size,
                      borderRadius: mix(0, size / 2, d),
                      background: d < 0.5 ? col : dotColor(i),
                      opacity: px32 * mix(1, 0.9, d),
                    }}
                  />
                );
              })
            : null}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

