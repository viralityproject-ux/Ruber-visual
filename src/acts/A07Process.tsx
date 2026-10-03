import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD, GRAD_MID} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {At, Cursor, Media} from '../components/UI';
import {Icon} from '../components/Icons';
import {useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog} from '../lib/anim';
import {kf, type Key} from '../lib/kf';

const GAPX = 1700;
const NODE_R = 150;
const TARGET: [number, number] = [4 * GAPX, 0];
const PANEL = {w: 1120, h: 520, y: 230};
const STEPS = [
  {n: '01', title: 'Memahami kebutuhan', icon: 'target'},
  {n: '02', title: 'Menentukan pendekatan', icon: 'bulb'},
  {n: '03', title: 'Menyusun strategi', icon: 'calendar'},
  {n: '04', title: 'Eksekusi', icon: 'camera'},
];

/** Camera keyframes: [time, centre x, centre y, log zoom]. */
type Cam = [number, number, number, number, ((x: number) => number)?];

const camAt = (t: number, keys: Cam[]) => {
  const kx: Key[] = keys.map(([tt, x, , , e]) => [tt, x, e]);
  const ky: Key[] = keys.map(([tt, , y, , e]) => [tt, y, e]);
  const kz: Key[] = keys.map(([tt, , , z, e]) => [tt, z, e]);
  return {x: kf(t, kx), y: kf(t, ky), z: Math.exp(kf(t, kz))};
};

const Panel: React.FC<{i: number; children: React.ReactNode; active: number; appear: number}> = ({i, children, active, appear}) => (
  <div
    style={{
      position: 'absolute',
      opacity: clamp01(appear * 2),
      transform: `translateY(${(1 - appear) * 80}px) scale(${mix(0.9, 1, appear)})`,
      left: i * GAPX - PANEL.w / 2,
      top: PANEL.y,
      width: PANEL.w,
      height: PANEL.h,
      borderRadius: 36,
      background: '#fff',
      boxShadow: `0 40px 90px rgba(20,16,65,${mix(0.1, 0.2, active)}), 0 4px 12px rgba(20,16,65,0.06)`,
      border: `2px solid ${active > 0.5 ? 'rgba(47,73,198,0.25)' : 'rgba(7,8,22,0.05)'}`,
      overflow: 'hidden',
    }}
  >
    <div style={{position: 'absolute', left: 50, top: 40, display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{width: 64, height: 64, borderRadius: 18, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon name={STEPS[i].icon} size={34} color="#fff" stroke={2.1} />
      </div>
      <div>
        <div style={{fontFamily: F.mono, fontSize: 18, letterSpacing: '0.14em', color: C.muted}}>LANGKAH {STEPS[i].n}</div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 50, letterSpacing: '-0.04em', color: C.ink, lineHeight: 1.05}}>{STEPS[i].title}</div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 50, right: 50, top: 160, bottom: 44}}>{children}</div>
  </div>
);

// "Karena itu, kami bekerja dengan proses yang terarah: memahami kebutuhan, menentukan pendekatan,
//  menyusun strategi produksi, dan mengeksekusinya secara cepat, tepat, dan akurat."
export const A07Process: React.FC = () => {
  const t = useT();
  const karena = at(26, 'karena');
  const kami = at(26, 'kami');
  const bekerja = at(26, 'bekerja');
  const dengan = at(26, 'dengan');
  const proses = at(26, 'proses');
  const yang = at(26, 'yang');
  const terarah = at(26, 'terarah');
  const memahami = at(27, 'memahami');
  const kebutuhan = at(27, 'kebutuhan');
  const menentukan = at(28, 'menentukan');
  const pendekatan = at(28, 'pendekatan');
  const menyusun = at(29, 'menyusun');
  const produksi = at(29, 'produksi');
  const mengeksekusi = at(30, 'mengeksekusinya');
  const cepat = at(30, 'cepat');
  const tepat = at(31, 'tepat');
  const dan = at(31, 'dan');
  const akurat = at(31, 'akurat');
  const focus = [memahami, menentukan, menyusun, mengeksekusi];

  const OVER: [number, number, number] = [GAPX * 2, 250, Math.log(0.24)];
  const focusCam = (i: number): [number, number, number] => [i * GAPX, 330, Math.log(0.9)];
  const cams: Cam[] = [
    [60.2, 0, 0, Math.log(9)],
    [60.95, 0, 70, Math.log(1.3), ease.outExpo],
    [proses - 0.15, 0, 70, Math.log(1.16), ease.linear],
    [proses + 0.55, ...OVER, ease.inOutExpo],
    [memahami - 0.12, ...OVER],
    [memahami + 0.45, ...focusCam(0), ease.inOutExpo],
    [menentukan - 0.12, ...focusCam(0)],
    [menentukan + 0.42, ...focusCam(1), ease.inOutExpo],
    [menyusun - 0.12, ...focusCam(1)],
    [menyusun + 0.42, ...focusCam(2), ease.inOutExpo],
    [mengeksekusi - 0.22, ...focusCam(2)],
    [mengeksekusi + 0.32, ...focusCam(3), ease.inOutExpo],
    [72.38, ...focusCam(3)],
    [72.9, ...OVER, ease.inOutExpo],
    [73.66, OVER[0] + 60, OVER[1], Math.log(0.25), ease.linear],
  ];
  const cam = camAt(t, cams);
  // final dive: the target glides to the centre of the screen while the zoom grows exponentially
  if (t > 73.66) {
    const p = clamp01((t - 73.66) / 0.69);
    const z0 = 0.25;
    const sx0 = 960 + (TARGET[0] - (OVER[0] + 60)) * z0;
    const sy0 = 540 + (TARGET[1] - OVER[1]) * z0;
    const z = Math.exp(mix(Math.log(z0), Math.log(40), ease.inCubic(p)));
    const sx = mix(sx0, 960, ease.inOutCubic(p));
    const sy = mix(sy0, 540, ease.inOutCubic(p));
    cam.z = z;
    cam.x = TARGET[0] - (sx - 960) / z;
    cam.y = TARGET[1] - (sy - 540) / z;
  }
  // a little breathing dip while travelling between steps
  const travel = [menentukan, menyusun, mengeksekusi].reduce((a, c) => a + bump(t, c - 0.12, 0.55), 0);
  const zoom = cam.z * (1 - travel * 0.18);
  const world = `translate(960px, 540px) scale(${zoom}) translate(${-cam.x}px, ${-cam.y}px)`;

  const pathDraw = prog(t, proses + 0.05, 0.9, ease.inOutCubic);
  const checks = [0, 1, 2, 3].map((i) => prog(t, tepat + i * 0.09, 0.4, ease.outBackStrong));
  const hitP = prog(t, akurat, 0.5, ease.outExpo);
  const active = (i: number) => (t > focus[i] - 0.1 ? 1 : 0) * (1 - (i < 3 ? prog(t, focus[i + 1], 0.3) : 0));

  // ---------------- step contents ----------------
  const checklist = ['Tujuan', 'Audiens', 'Pesan utama', 'Channel'];
  const options = [
    {t: 'Storytelling', icon: 'film'},
    {t: 'Edukatif', icon: 'bulb'},
    {t: 'Playful', icon: 'sparkle'},
  ];
  const gantt: [string, number, number][] = [
    ['Pra-produksi', 0, 0.32],
    ['Produksi', 0.26, 0.62],
    ['Pasca-produksi', 0.55, 0.86],
    ['Distribusi', 0.8, 1],
  ];
  const pick = prog(t, pendekatan - 0.02, 0.4, ease.outBackStrong);
  const render = clamp01((t - (mengeksekusi + 0.2)) / (cepat - (mengeksekusi + 0.2)));

  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 12, y: 80, r: 320, color: C.blueSoft, seed: 'q1'},
          {x: 88, y: 14, r: 300, color: C.violetSoft, seed: 'q2'},
        ]}
      />
      <AbsoluteFill style={{transform: world, transformOrigin: '0 0'}}>
        {/* canvas dot grid */}
        <div
          style={{
            position: 'absolute',
            left: -2000,
            top: -1600,
            width: TARGET[0] + 4000,
            height: 3600,
            backgroundImage: 'radial-gradient(circle, rgba(7,8,22,0.13) 2.2px, transparent 2.8px)',
            backgroundSize: '56px 56px',
          }}
        />
        {/* the path */}
        <svg width={TARGET[0] + 400} height={400} style={{position: 'absolute', left: -200, top: -200, overflow: 'visible'}}>
          <defs>
            <linearGradient id="pathG" x1="0" x2="1">
              <stop offset="0" stopColor={C.blueMid} />
              <stop offset="1" stopColor={C.violetMid} />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((i) => {
            const x0 = 200 + i * GAPX + NODE_R + 24;
            const x1 = 200 + (i + 1) * GAPX - NODE_R - 24;
            const seg = clamp01(pathDraw * 4 - i);
            const done = prog(t, i < 3 ? focus[i + 1] - 0.1 : tepat + 0.3, 0.45, ease.inOutCubic);
            return (
              <g key={i}>
                <line x1={x0} y1={200} x2={mix(x0, x1, seg)} y2={200} stroke="rgba(7,8,22,0.18)" strokeWidth={10} strokeDasharray="4 22" strokeLinecap="round" />
                <line x1={x0} y1={200} x2={mix(x0, x1, done)} y2={200} stroke="url(#pathG)" strokeWidth={10} strokeLinecap="round" />
                {seg > 0.98 ? <path d={`M${x1 - 30} 176 L${x1} 200 L${x1 - 30} 224`} fill="none" stroke={done > 0.98 ? C.violetMid : 'rgba(7,8,22,0.25)'} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /> : null}
              </g>
            );
          })}
        </svg>
        {/* nodes */}
        {STEPS.map((s, i) => {
          const x = i * GAPX;
          const appear = i === 0 ? 1 : prog(t, proses + 0.15 + i * 0.16, 0.5, ease.outBackStrong);
          const on = i === 0 || active(i) > 0 || t > focus[i] + 0.2;
          return (
            <div key={s.n} style={{position: 'absolute', left: x - NODE_R, top: -NODE_R, width: NODE_R * 2, height: NODE_R * 2, transform: `scale(${appear * (1 + bump(t, focus[i], 0.4) * 0.08)})`}}>
              <svg width={NODE_R * 2} height={NODE_R * 2} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
                <defs>
                  <linearGradient id={`nodeG${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor={C.blueMid} />
                    <stop offset="1" stopColor={C.violetMid} />
                  </linearGradient>
                </defs>
                <circle cx={NODE_R} cy={NODE_R} r={NODE_R - 9} fill={C.paper} stroke={on ? `url(#nodeG${i})` : 'rgba(7,8,22,0.16)'} strokeWidth={18} />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: F.display,
                  fontWeight: 800,
                  fontSize: 110,
                  letterSpacing: '-0.05em',
                  backgroundImage: on ? GRAD : 'none',
                  color: on ? 'transparent' : 'rgba(7,8,22,0.25)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  opacity: i === 0 ? prog(t, 60.6, 0.5) : 1,
                }}
              >
                {s.n}
              </div>
              {/* completion badge */}
              {checks[i] > 0 ? (
                <div style={{position: 'absolute', right: -10, top: -10, width: 92, height: 92, borderRadius: 46, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${checks[i]})`, boxShadow: '0 12px 30px rgba(23,42,134,0.4)'}}>
                  <Icon name="check" size={52} color="#fff" stroke={3.4} />
                </div>
              ) : null}
            </div>
          );
        })}
        {/* the target */}
        <div style={{position: 'absolute', left: TARGET[0] - 180, top: TARGET[1] - 180, width: 360, height: 360, transform: `scale(${prog(t, proses + 0.8, 0.5, ease.outBackStrong) * (1 + bump(t, akurat, 0.45) * 0.12)})`}}>
          <svg width={360} height={360} viewBox="-180 -180 360 360" style={{overflow: 'visible'}}>
            <circle r={176} fill={C.blueSoft} />
            <circle r={128} fill="#fff" />
            <circle r={84} fill={C.violetSoft} />
            <circle r={44} fill={C.ink} />
            {[0, 90, 180, 270].map((a) => (
              <line key={a} x1={0} y1={-238} x2={0} y2={-196} stroke={C.violetMid} strokeWidth={8} strokeLinecap="round" transform={`rotate(${a})`} opacity={hitP} />
            ))}
            {hitP > 0 && hitP < 1 ? <circle r={mix(44, 330, hitP)} fill="none" stroke={C.violetMid} strokeWidth={10 * (1 - hitP)} opacity={1 - hitP} /> : null}
          </svg>
        </div>

        {/* ---- 01 memahami kebutuhan ---- */}
        <Panel i={0} active={active(0)} appear={prog(t, proses + 0.25, 0.5, ease.outBackStrong)}>
          {checklist.map((c, k) => {
            const ck = prog(t, kebutuhan - 0.45 + k * 0.32, 0.35, ease.outBackStrong);
            return (
              <div key={c} style={{display: 'flex', alignItems: 'center', gap: 20, height: 74, borderBottom: k < 3 ? `2px solid ${C.line}` : 'none'}}>
                <div style={{width: 42, height: 42, borderRadius: 12, border: `3px solid ${ck > 0 ? 'transparent' : 'rgba(7,8,22,0.2)'}`, background: ck > 0 ? GRAD : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${mix(0.8, 1, ck)})`, boxSizing: 'border-box'}}>
                  {ck > 0 ? <Icon name="check" size={26} color="#fff" stroke={3.2} /> : null}
                </div>
                <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 34, color: C.ink, width: 280}}>{c}</div>
                <div style={{flex: 1, height: 14, borderRadius: 7, background: 'rgba(7,8,22,0.06)', overflow: 'hidden'}}>
                  <div style={{width: `${ck * [72, 55, 84, 46][k]}%`, height: '100%', borderRadius: 7, background: GRAD_MID}} />
                </div>
              </div>
            );
          })}
        </Panel>

        {/* ---- 02 menentukan pendekatan ---- */}
        <Panel i={1} active={active(1)} appear={prog(t, proses + 0.37, 0.5, ease.outBackStrong)}>
          <div style={{display: 'flex', gap: 28, height: '100%'}}>
            {options.map((o, k) => {
              const sel = k === 0;
              const inP = prog(t, menentukan + 0.2 + k * 0.1, 0.45, ease.outBackStrong);
              return (
                <div
                  key={o.t}
                  style={{
                    flex: 1,
                    borderRadius: 26,
                    background: sel && pick > 0 ? 'linear-gradient(160deg, #F1F3FE, #F4EEFE)' : '#F7F8FC',
                    border: `3px solid ${sel && pick > 0 ? C.blueMid : 'rgba(7,8,22,0.06)'}`,
                    padding: 28,
                    boxSizing: 'border-box',
                    position: 'relative',
                    transform: `translateY(${(1 - inP) * 60 - (sel ? pick * 22 : 0)}px) scale(${sel ? 1 + pick * 0.04 : 1})`,
                    opacity: clamp01(inP * 2) * (sel ? 1 : mix(1, 0.45, pick)),
                    boxShadow: sel && pick > 0 ? '0 30px 60px rgba(47,73,198,0.22)' : 'none',
                  }}
                >
                  <div style={{fontFamily: F.mono, fontSize: 20, color: C.muted, letterSpacing: '0.1em'}}>OPSI {'ABC'[k]}</div>
                  <div style={{width: 76, height: 76, borderRadius: 22, background: sel && pick > 0 ? GRAD : 'rgba(7,8,22,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 24}}>
                    <Icon name={o.icon} size={42} color={sel && pick > 0 ? '#fff' : C.ink} stroke={2.1} />
                  </div>
                  <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 38, letterSpacing: '-0.03em', color: C.ink, marginTop: 26}}>{o.t}</div>
                  {sel && pick > 0 ? (
                    <div style={{position: 'absolute', right: 20, top: 20, width: 48, height: 48, borderRadius: 24, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pick})`}}>
                      <Icon name="check" size={28} color="#fff" stroke={3.2} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          {t > menentukan && t < menyusun + 0.5 ? (
            <Cursor
              size={52}
              path={[
                {t: menentukan + 0.3, x: 900, y: 330},
                {t: pendekatan - 0.06, x: 200, y: 200, click: true},
                {t: pendekatan + 0.6, x: 260, y: 260},
              ]}
            />
          ) : null}
        </Panel>

        {/* ---- 03 menyusun strategi produksi ---- */}
        <Panel i={2} active={active(2)} appear={prog(t, proses + 0.49, 0.5, ease.outBackStrong)}>
          <div style={{position: 'relative', height: '100%'}}>
            <div style={{position: 'absolute', left: 290, right: 0, top: 0, display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 18, color: C.muted, letterSpacing: '0.1em'}}>
              {['M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            {gantt.map(([label, a, b], k) => {
              const g = prog(t, menyusun + 0.25 + k * 0.22, 0.55, ease.outExpo);
              return (
                <div key={label} style={{position: 'absolute', left: 0, right: 0, top: 50 + k * 80, height: 60, display: 'flex', alignItems: 'center'}}>
                  <div style={{width: 290, fontFamily: F.display, fontWeight: 700, fontSize: 30, color: C.ink}}>{label}</div>
                  <div style={{position: 'relative', flex: 1, height: 44, borderRadius: 12, background: 'rgba(7,8,22,0.04)'}}>
                    <div
                      style={{
                        position: 'absolute',
                        left: `${a * 100}%`,
                        width: `${(b - a) * 100 * g}%`,
                        top: 0,
                        bottom: 0,
                        borderRadius: 12,
                        background: k % 2 ? `linear-gradient(90deg, ${C.violetMid}, ${C.violet})` : `linear-gradient(90deg, ${C.blueMid}, ${C.blue})`,
                        boxShadow: '0 8px 18px rgba(47,73,198,0.25)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div style={{position: 'absolute', left: `calc(290px + ${clamp01((t - menyusun - 0.3) / 1.6) * 100}% * 0.73)`, top: 36, bottom: 0, width: 3, background: C.violetMid, opacity: prog(t, menyusun + 0.3, 0.3)}} />
            <div style={{position: 'absolute', right: 0, bottom: 0, display: 'flex', gap: 14, opacity: prog(t, produksi, 0.3)}}>
              {['Shot list', 'Talent', 'Lokasi', 'Jadwal'].map((c) => (
                <div key={c} style={{padding: '8px 18px', borderRadius: 999, background: C.blueSoft, fontFamily: F.display, fontWeight: 700, fontSize: 22, color: C.blue}}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* ---- 04 eksekusi ---- */}
        <Panel i={3} active={active(3)} appear={prog(t, proses + 0.61, 0.5, ease.outBackStrong)}>
          <div style={{display: 'flex', gap: 30, height: '100%'}}>
            <div style={{position: 'relative', width: 600, height: '100%', borderRadius: 24, overflow: 'hidden', background: C.ink}}>
              <At t={mengeksekusi - 0.3}>
                <Media src="videos/studio-portrait-result-bts.mp4" trim={0.5} />
              </At>
              <div style={{position: 'absolute', left: 16, top: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 10, background: 'rgba(7,8,22,0.72)', color: '#fff', fontFamily: F.mono, fontSize: 18}}>
                <div style={{width: 12, height: 12, borderRadius: 6, background: '#FF4D5E', opacity: Math.floor(t * 2.5) % 2 ? 1 : 0.35}} />
                REC
              </div>
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22}}>
              <div style={{fontFamily: F.mono, fontSize: 20, color: C.muted, letterSpacing: '0.1em'}}>EXPORT · FINAL</div>
              <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 92, letterSpacing: '-0.05em', color: C.ink, fontVariantNumeric: 'tabular-nums'}}>{Math.round(render * 100)}%</div>
              <div style={{height: 18, borderRadius: 9, background: 'rgba(7,8,22,0.07)', overflow: 'hidden'}}>
                <div style={{width: `${render * 100}%`, height: '100%', borderRadius: 9, background: GRAD_MID}} />
              </div>
              <div style={{display: 'flex', gap: 10}}>
                {[
                  ['cepat', cepat],
                  ['tepat', tepat],
                  ['akurat', akurat],
                ].map(([w, tw]) => {
                  const p = prog(t, tw as number, 0.35, ease.outBackStrong);
                  return (
                    <div key={w as string} style={{padding: '8px 16px', borderRadius: 999, background: p > 0 ? GRAD : 'rgba(7,8,22,0.06)', color: p > 0 ? '#fff' : C.muted, fontFamily: F.display, fontWeight: 800, fontSize: 24, transform: `scale(${mix(0.9, 1, p)})`}}>
                      {w as string}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Panel>
      </AbsoluteFill>

      {/* ---------------- keyword overlays ---------------- */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 86, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none'}}>
        {t > karena - 0.1 && t < proses - 0.05 ? (
          <>
            <Label size={26} color={C.blueMid}>
              <W t={karena} out={proses - 0.3}>
                karena itu,
              </W>
            </Label>
            <H size={84} style={{marginTop: 6}}>
              <W t={kami} out={proses - 0.3}>
                kami{' '}
              </W>
              <W t={bekerja} out={proses - 0.3}>
                bekerja{' '}
              </W>
              <W t={dengan} out={proses - 0.3}>
                dengan
              </W>
            </H>
          </>
        ) : null}
        {t >= proses - 0.05 && t < memahami + 0.1 ? (
          <H size={128}>
            <W t={proses} out={memahami - 0.15}>
              proses{' '}
            </W>
            <W t={yang} out={memahami - 0.15} style={{fontSize: '0.45em', fontWeight: 700, color: C.muted}}>
              yang{' '}
            </W>
            <W t={terarah} out={memahami - 0.15} look="serif" style={{fontSize: '1.12em'}}>
              terarah.
            </W>
          </H>
        ) : null}
        {t >= 72.45 ? (
          <H size={120}>
            <W t={72.5} out={73.85} look="grad">
              cepat,{' '}
            </W>
            <W t={tepat} out={73.87} look="grad">
              tepat,{' '}
            </W>
            <W t={dan} out={73.89} style={{fontSize: '0.45em', fontWeight: 700, color: C.muted}}>
              dan{' '}
            </W>
            <W t={akurat} out={73.91} look="serif" style={{fontSize: '1.12em'}}>
              akurat.
            </W>
          </H>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
