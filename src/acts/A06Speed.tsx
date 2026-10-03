import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {DotGrid, InkBg} from '../components/Backgrounds';
import {H, Label, Letters, W, at} from '../components/Text';
import {At, Media} from '../components/UI';
import {Icon} from '../components/Icons';
import {useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog, shake} from '../lib/anim';
import {rand} from '../lib/kf';
import {beatPulse} from '../lib/beat';

const RING = {x: 960, y: 500, R: 232, w: 22};

type Toast = {title: string; sub: string; icon: string};
const LANES: {y: number; dir: number; speed: number; items: Toast[]}[] = [
  {
    y: 118,
    dir: -1,
    speed: 300,
    items: [
      {title: 'Brief baru masuk', sub: '09:12 · Marketing', icon: 'doc'},
      {title: 'Revisi minor', sub: '10:05 · Video v3', icon: 'comment'},
      {title: 'Deadline Jumat', sub: '11:30 · Campaign', icon: 'calendar'},
      {title: 'Launching campaign', sub: '13:00 · Digital', icon: 'rocket'},
      {title: 'Approval klien', sub: '14:20 · Final cut', icon: 'check'},
    ],
  },
  {
    y: 250,
    dir: 1,
    speed: 240,
    items: [
      {title: 'Konten harian', sub: '08:00 · 15 akun', icon: 'phone'},
      {title: 'Dokumentasi event', sub: '15:00 · On site', icon: 'camera'},
      {title: 'Upload 19.00', sub: 'Prime time', icon: 'clock'},
      {title: 'Shooting besok pagi', sub: '06:00 · Call time', icon: 'clapper'},
      {title: 'Reels mingguan', sub: 'Senin · 3 video', icon: 'play'},
    ],
  },
  {
    y: 760,
    dir: -1,
    speed: 340,
    items: [
      {title: 'Press release', sub: '16:40 · Media', icon: 'megaphone'},
      {title: 'Foto produk', sub: '12:15 · Studio', icon: 'image'},
      {title: 'Company profile', sub: 'Draft 2', icon: 'building'},
      {title: 'Live report', sub: 'Sekarang', icon: 'mic'},
      {title: 'Story highlight', sub: '20:00 · IG', icon: 'sparkle'},
    ],
  },
];
const TOAST_W = 430;
const TOAST_GAP = 26;

const ToastCard: React.FC<{toast: Toast; hot?: boolean}> = ({toast, hot}) => (
  <div
    style={{
      width: TOAST_W,
      height: 104,
      flexShrink: 0,
      borderRadius: 22,
      background: hot ? 'rgba(47,73,198,0.22)' : 'rgba(255,255,255,0.06)',
      border: `1.5px solid ${hot ? 'rgba(144,161,244,0.55)' : 'rgba(255,255,255,0.10)'}`,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '0 22px',
      boxSizing: 'border-box',
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
    }}
  >
    <div style={{width: 58, height: 58, borderRadius: 16, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
      <Icon name={toast.icon} size={30} color="#fff" stroke={2.1} />
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 25, letterSpacing: '-0.02em', color: '#fff', whiteSpace: 'nowrap'}}>{toast.title}</div>
      <div style={{fontFamily: F.mono, fontSize: 16, color: 'rgba(255,255,255,0.55)', marginTop: 4, whiteSpace: 'nowrap'}}>{toast.sub}</div>
    </div>
    <div style={{width: 12, height: 12, borderRadius: 6, background: hot ? C.violetLight : C.blueLight}} />
  </div>
);

// "kecepatan harus berjalan bersama ketepatan. Karena di tengah kebutuhan yang terus bergerak,
//  momentum tidak selalu dapat menunggu."
export const A06Speed: React.FC = () => {
  const t = useT();
  const bp = beatPulse(t);
  const kecepatan = at(23, 'kecepatan');
  const harus = at(23, 'harus');
  const berjalan = at(23, 'berjalan');
  const bersama = at(23, 'bersama');
  const ketepatan = at(23, 'ketepatan');
  const karena = at(24, 'karena');
  const kebutuhan = at(24, 'kebutuhan');
  const yang = at(24, 'yang');
  const terus = at(24, 'terus');
  const bergerak = at(24, 'bergerak');
  const momentum = at(25, 'momentum');
  const tidak = at(25, 'tidak');
  const selalu = at(25, 'selalu');
  const dapat = at(25, 'dapat');
  const menunggu = at(25, 'menunggu');

  // ---------------- part A: speed + precision ----------------
  const kIn = prog(t, kecepatan - 0.06, 0.42, ease.outExpo);
  const outA = prog(t, 54.72, 0.3, ease.inCubic);
  const sel = prog(t, ketepatan + 0.18, 0.4, ease.outExpo);

  // ---------------- part B: lanes ----------------
  const lanesIn = prog(t, karena - 0.1, 0.55, ease.outExpo);
  const lanesOut = prog(t, momentum - 0.42, 0.26, ease.inCubic);
  const accel = (tt: number) => {
    // distance travelled: base speed, doubling after "terus bergerak"
    const a = Math.max(0, tt - (karena - 0.3));
    const b = Math.max(0, tt - terus);
    return a + b * b * 0.9 + b * 0.6;
  };

  // ---------------- part C: the momentum stopwatch ----------------
  const ringIn = prog(t, momentum - 0.12, 0.55, ease.outBackStrong);
  const remain = 1 - clamp01((t - momentum) / (menunggu - momentum));
  const hit = prog(t, menunggu, 0.3, ease.outExpo);
  const paper = prog(t, menunggu + 0.12, 0.35, ease.inOutCubic);
  const dive = prog(t, 59.55, 0.65, ease.inCubic);
  const zoom = Math.exp(Math.log(7) * dive);
  const sh = shake(t, menunggu, 14, 0.4, 'mom');
  const secs = Math.max(0, (menunggu - t) * 1);
  const stamp = `00:0${Math.floor(secs)}.${String(Math.floor((secs % 1) * 100)).padStart(2, '0')}`;

  return (
    <AbsoluteFill>
      <InkBg
        fadeFrom={51.55}
        glow={[
          [C.blue, 15, 30],
          [C.violet, 85, 75],
        ]}
        dots={false}
      />
      <DotGrid color="rgba(255,255,255,0.12)" gap={38} opacity={(0.4 + bp * 0.3) * prog(t, 51.55, 0.9, ease.inCubic)} drift={t < 55 ? -60 : 0} />

      {/* ================= part A ================= */}
      {t < 55.1 ? (
        <AbsoluteFill style={{opacity: 1 - outA, transform: `translateY(${-outA * 60}px)`}}>
          {/* speed streaks behind "kecepatan" */}
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <defs>
              <linearGradient id="streak" x1="0" x2="1">
                <stop offset="0" stopColor={C.blueLight} stopOpacity={0.9} />
                <stop offset="1" stopColor={C.blueLight} stopOpacity={0} />
              </linearGradient>
            </defs>
            {Array.from({length: 26}, (_, i) => {
              const y = 220 + rand(i, 1) * 240;
              const len = 180 + rand(i, 2) * 520;
              const sp = 2600 + rand(i, 3) * 1800;
              const x = 2000 - (((t - kecepatan + rand(i, 4) * 3) * sp) % 3200);
              const o = prog(t, kecepatan - 0.1, 0.2) * (0.25 + rand(i, 5) * 0.5) * (1 - prog(t, ketepatan, 0.6));
              return <rect key={i} x={x} y={y} width={len} height={2 + rand(i, 6) * 4} rx={3} fill="url(#streak)" opacity={o} />;
            })}
          </svg>
          {/* kecepatan */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 228,
              display: 'flex',
              justifyContent: 'center',
              transform: `translateX(${(1 - kIn) * 1300}px) skewX(${(1 - kIn) * -18}deg)`,
              filter: kIn < 0.97 ? `blur(${(1 - kIn) * 24}px)` : undefined,
              opacity: clamp01(kIn * 3),
            }}
          >
            <H size={172} color="#fff" style={{fontStyle: 'italic'}}>
              <span style={{backgroundImage: `linear-gradient(90deg, #fff 60%, ${C.blueLight})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingRight: '0.08em'}}>kecepatan</span>
            </H>
          </div>
          {/* harus berjalan [bersama] */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 452, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
            <H size={56} color="rgba(255,255,255,0.7)" weight={700}>
              <W t={harus}>harus </W>
              <W t={berjalan}>berjalan</W>
            </H>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 26px',
                borderRadius: 999,
                background: GRAD,
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: 50,
                letterSpacing: '-0.03em',
                color: '#fff',
                transform: `scale(${prog(t, bersama - 0.04, 0.45, ease.outBackStrong) * (1 + bump(t, bersama + 0.1, 0.3) * 0.08)})`,
                boxShadow: '0 16px 40px rgba(47,73,198,0.5)',
              }}
            >
              <Icon name="layers" size={44} color="#fff" stroke={2.2} />
              bersama
            </div>
          </div>
          {/* ketepatan, drawn like a selected layer in a design tool */}
          <div style={{position: 'absolute', left: 0, right: 0, top: 590, display: 'flex', justifyContent: 'center'}}>
            <div style={{position: 'relative'}}>
              <H size={172} color="#fff">
                <Letters text="ketepatan" t0={ketepatan - 0.05} stagger={0.03} />
              </H>
              {sel > 0 ? (
                <>
                  <div style={{position: 'absolute', left: -26, right: -26, top: -6, bottom: -14, border: `2.5px solid ${C.violetLight}`, opacity: sel}} />
                  {[
                    [0, 0],
                    [1, 0],
                    [0, 1],
                    [1, 1],
                    [0.5, 0],
                    [0.5, 1],
                  ].map(([hx, hy], i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `calc(${hx * 100}% + ${(hx - 0.5) * 52}px - 9px)`,
                        top: hy ? 'calc(100% + 14px - 9px)' : -6 - 9,
                        width: 18,
                        height: 18,
                        background: '#fff',
                        border: `2.5px solid ${C.violetMid}`,
                        boxSizing: 'border-box',
                        transform: `scale(${prog(t, ketepatan + 0.22 + i * 0.03, 0.3, ease.outBackStrong)})`,
                      }}
                    />
                  ))}
                  <div style={{position: 'absolute', left: -26, top: -52, fontFamily: F.mono, fontSize: 20, letterSpacing: '0.08em', color: C.violetLight, opacity: sel}}>
                    X 0.00 · Y 0.00 · ±0 px
                  </div>
                  {/* crosshair */}
                  <svg width={120} height={120} style={{position: 'absolute', left: '50%', top: '50%', marginLeft: -60, marginTop: -54, opacity: sel * 0.9, overflow: 'visible'}}>
                    <g transform={`rotate(${(1 - sel) * 90} 60 60)`}>
                      <circle cx={60} cy={60} r={30 * mix(2, 1, sel)} fill="none" stroke={C.violetLight} strokeWidth={2.5} />
                      <line x1={60} y1={10} x2={60} y2={40} stroke={C.violetLight} strokeWidth={2.5} />
                      <line x1={60} y1={80} x2={60} y2={110} stroke={C.violetLight} strokeWidth={2.5} />
                      <line x1={10} y1={60} x2={40} y2={60} stroke={C.violetLight} strokeWidth={2.5} />
                      <line x1={80} y1={60} x2={110} y2={60} stroke={C.violetLight} strokeWidth={2.5} />
                    </g>
                  </svg>
                </>
              ) : null}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ================= part B: lanes of requests ================= */}
      {t > karena - 0.15 && t < momentum + 0.2 ? (
        <AbsoluteFill style={{opacity: lanesIn * (1 - lanesOut)}}>
          {LANES.map((lane, li) => {
            const rowW = lane.items.length * (TOAST_W + TOAST_GAP);
            const d = accel(t) * lane.speed;
            const off = ((lane.dir * d + li * 260) % rowW + rowW) % rowW;
            const items = [...lane.items, ...lane.items, ...lane.items, ...lane.items];
            const blur = Math.min(10, Math.max(0, t - terus) * 6) * (1 - lanesOut);
            return (
              <div
                key={li}
                style={{
                  position: 'absolute',
                  left: -2 * rowW + off,
                  top: lane.y + (1 - lanesIn) * (li === 2 ? 120 : -120),
                  display: 'flex',
                  gap: TOAST_GAP,
                  filter: blur > 0.3 ? `url(#mbx${Math.min(5, Math.ceil(blur / 2))})` : undefined,
                }}
              >
                {items.map((toast, i) => (
                  <ToastCard key={i} toast={toast} hot={(i + li) % 4 === 1} />
                ))}
              </div>
            );
          })}
          <div style={{position: 'absolute', left: 0, right: 0, top: 418, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Label size={26} color={C.blueLight}>
              <W t={karena}>karena di tengah </W>
              {t >= terus - 0.1 ? (
                <>
                  <W t={kebutuhan}>kebutuhan </W>
                  <W t={yang}>yang</W>
                </>
              ) : null}
            </Label>
            {t < terus - 0.1 ? (
              <H size={164} color="#fff" style={{marginTop: 8}}>
                <W t={kebutuhan} out={terus - 0.25} look="serif" dark style={{fontSize: '1.1em'}}>
                  kebutuhan
                </W>
              </H>
            ) : (
              <H size={164} color="#fff" style={{marginTop: 8}}>
                <W t={terus} look="grad" dark>
                  terus{' '}
                </W>
                <W t={bergerak} look="serif" dark style={{fontSize: '1.1em'}}>
                  bergerak
                </W>
              </H>
            )}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ================= part C: momentum ================= */}
      {t > momentum - 0.15 ? (
        <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) scale(${zoom})`, transformOrigin: `${RING.x}px ${RING.y}px`}}>
          {/* paper grows inside the ring → Act 7 */}
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <defs>
              <linearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={C.blueMid} />
                <stop offset="1" stopColor={C.violetMid} />
              </linearGradient>
              <clipPath id="ringClip">
                <circle cx={RING.x} cy={RING.y} r={RING.R - RING.w / 2 - 6} />
              </clipPath>
            </defs>
            <g transform={`translate(${RING.x} ${RING.y}) scale(${ringIn}) translate(${-RING.x} ${-RING.y})`}>
              {/* bezel ticks */}
              {Array.from({length: 60}, (_, i) => {
                const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
                const long = i % 5 === 0;
                const r0 = RING.R + 26;
                const r1 = RING.R + (long ? 52 : 40);
                const lit = i / 60 < remain;
                return (
                  <line
                    key={i}
                    x1={RING.x + Math.cos(a) * r0}
                    y1={RING.y + Math.sin(a) * r0}
                    x2={RING.x + Math.cos(a) * r1}
                    y2={RING.y + Math.sin(a) * r1}
                    stroke={lit ? '#fff' : 'rgba(255,255,255,0.18)'}
                    strokeWidth={long ? 4 : 2.5}
                    strokeLinecap="round"
                  />
                );
              })}
              {/* crown */}
              <rect x={RING.x - 26} y={RING.y - RING.R - 100} width={52} height={34} rx={8} fill="#fff" />
              <rect x={RING.x - 12} y={RING.y - RING.R - 70} width={24} height={22} fill="#fff" />
              <circle cx={RING.x} cy={RING.y} r={RING.R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={RING.w} />
              <circle
                cx={RING.x}
                cy={RING.y}
                r={RING.R}
                fill="none"
                stroke="url(#ringG)"
                strokeWidth={RING.w}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={`${remain} 1`}
                transform={`rotate(-90 ${RING.x} ${RING.y})`}
                opacity={1 - hit}
              />
              <circle cx={RING.x} cy={RING.y} r={RING.R} fill="none" stroke="url(#ringG)" strokeWidth={RING.w} opacity={hit} />
            </g>
          </svg>
          {/* the reel playing inside the stopwatch */}
          <div
            style={{
              position: 'absolute',
              left: RING.x - (RING.R - RING.w / 2 - 6),
              top: RING.y - (RING.R - RING.w / 2 - 6),
              width: (RING.R - RING.w / 2 - 6) * 2,
              height: (RING.R - RING.w / 2 - 6) * 2,
              borderRadius: '50%',
              overflow: 'hidden',
              transform: `scale(${ringIn})`,
              background: C.ink2,
            }}
          >
            <At t={momentum - 0.15}>
              <Media src="videos/reel-hallway-bts.mp4" trim={2.5} pos="50% 18%" />
            </At>
            <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 50%, rgba(7,8,22,0.55) 100%)'}} />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 34,
                transform: 'translateX(-50%)',
                padding: '8px 18px',
                borderRadius: 999,
                background: 'rgba(7,8,22,0.75)',
                color: '#fff',
                fontFamily: F.mono,
                fontSize: 26,
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
              }}
            >
              {stamp}
            </div>
            <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: hit * 0.7 * (1 - paper)}} />
            <div style={{position: 'absolute', inset: 0, background: C.paper, opacity: paper}} />
          </div>
          {/* words either side */}
          <div style={{position: 'absolute', right: 1920 - 650, top: 410, textAlign: 'right'}}>
            <H size={128} color="#fff" align="right">
              <W t={momentum} look="serif" dark style={{fontSize: '1.05em'}}>
                momentum
              </W>
            </H>
          </div>
          <div style={{position: 'absolute', left: 1268, top: 392}}>
            <H size={64} color="rgba(255,255,255,0.75)" weight={700} align="left" lh={1.08}>
              <W t={tidak}>tidak </W>
              <W t={selalu}>selalu</W>
              <br />
              <W t={dapat}>dapat </W>
              <br />
            </H>
            <H size={96} color="#fff" align="left" style={{marginTop: 4}}>
              <W t={menunggu} look="grad" dark>
                menunggu.
              </W>
            </H>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

