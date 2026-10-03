import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, GRAD, GRAD_LIGHT} from '../theme';
import {InkBg} from '../components/Backgrounds';
import {GrowCover} from '../components/Cover';
import {H, Label, W, at} from '../components/Text';
import {useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog, shake} from '../lib/anim';
import {kf, rand} from '../lib/kf';
import {beatPulse} from '../lib/beat';
import {DOT_COLS, DOT_R, DOT_ROWS, dotColor, dotXY} from '../lib/dots';

const ACCOUNTS = [
  {key: 'mental-juara', followers: '520K'},
  {key: 'sehatbugar', followers: '176K'},
  {key: 'official-indeed', followers: '129K'},
  {key: 'scoopmedia', followers: '95K'},
  {key: 'kerjasantuy', followers: '45K'},
  {key: 'leaderatur', followers: '29K'},
  {key: 'adadirumah'},
  {key: 'leaderasi'},
  {key: 'kataibuku'},
  {key: 'asayangtumbuh'},
  {key: 'semiliarkebaikan'},
  {key: 'jalanbalik'},
  {key: 'jurnalmasjid'},
  {key: 'teladani'},
  {key: 'welcomehomesociety'},
] as {key: string; followers?: string}[];

const N = DOT_COLS * DOT_ROWS;
const GLOBE_R = 300;
const ORBIT = {rx: 560, ry: 150, tilt: -10};
const TILE = 150;
const TILE_GAP = 14;

// "Di ranah digital, kami juga membangun dan mengelola lebih dari 15 media dan proxy. Melalui berbagai konten
//  yang kami kembangkan, secara akumulatif telah menghasilkan lebih dari satu miliar views."
export const A09Digital: React.FC = () => {
  const t = useT();
  const bp = beatPulse(t);
  const ranah = at(39, 'ranah');
  const digital = at(39, 'digital');
  const kami = at(40, 'kami');
  const juga = at(40, 'juga');
  const membangun = at(40, 'membangun');
  const dan = at(40, 'dan');
  const mengelola = at(40, 'mengelola');
  const lebih = at(41, 'lebih');
  const lima = at(41, '15');
  const media = at(41, 'media');
  const proxy = at(41, 'proxy');
  const melalui = at(42, 'melalui');
  const berbagai = at(42, 'berbagai');
  const konten = at(42, 'konten');
  const kembangkan = at(42, 'kembangkan');
  const secara = at(43, 'secara');
  const akumulatif = at(43, 'akumulatif');
  const telah = at(44, 'telah');
  const menghasilkan = at(44, 'menghasilkan');
  const satu = at(44, 'satu');
  const miliar = at(44, 'miliar');
  const views = at(44, 'views');

  // ---------------- globe ----------------
  const wrap = (i: number) => {
    const col = i % DOT_COLS;
    const row = Math.floor(i / DOT_COLS);
    const d = Math.hypot(col - DOT_COLS / 2, row - DOT_ROWS / 2);
    return prog(t, 95.38 + d * 0.022, 0.75, ease.inOutCubic);
  };
  const spin = (t - 95.3) * 0.55;
  const globeX = kf(t, [
    [lebih - 0.2, 960],
    [lebih + 0.4, 700, ease.inOutCubic],
  ]);
  const globeY = 545;
  const globeOut = prog(t, melalui - 0.15, 0.55, ease.inCubic);
  const globeS = mix(1, 0.35, globeOut) * (1 + bp * 0.012);
  const tilt = (-16 * Math.PI) / 180;

  const globe = Array.from({length: N}, (_, i) => {
    const col = i % DOT_COLS;
    const row = Math.floor(i / DOT_COLS);
    const lat = mix(0.94, -0.94, row / (DOT_ROWS - 1));
    const lon = (col / DOT_COLS) * Math.PI * 2 + spin;
    const r = Math.sqrt(1 - lat * lat);
    let x = Math.cos(lon) * r;
    let y = -lat;
    let z = Math.sin(lon) * r;
    // tilt toward the viewer
    const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
    const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
    y = y2;
    z = z2;
    return {sx: globeX + x * GLOBE_R * globeS, sy: globeY + y * GLOBE_R * globeS, z};
  });

  // ---------------- orbit of accounts ----------------
  const orbitIn = (k: number) => prog(t, membangun - 0.15 + k * 0.06, 0.5, ease.outBackStrong);
  const orbitAng = (k: number) => (k / ACCOUNTS.length) * Math.PI * 2 + (t - 97) * 0.32;
  const orbitPos = (k: number) => {
    const a = orbitAng(k);
    const ex = Math.cos(a) * ORBIT.rx;
    const ey = Math.sin(a) * ORBIT.ry;
    const tr = (ORBIT.tilt * Math.PI) / 180;
    return {x: globeX + ex * Math.cos(tr) - ey * Math.sin(tr), y: globeY + ex * Math.sin(tr) + ey * Math.cos(tr), front: Math.sin(a) > 0, depth: Math.sin(a)};
  };
  const managed = prog(t, mengelola, 0.4, ease.outBackStrong);

  // ---------------- content wall ----------------
  const wallIn = prog(t, melalui, 0.6, ease.outExpo);
  const gatherW = prog(t, secara - 0.1, 0.75, ease.inExpo);
  const orb = prog(t, secara + 0.2, 0.7, ease.outBackStrong) * (1 - prog(t, telah - 0.05, 0.3, ease.inCubic));

  // ---------------- views counter ----------------
  const count = Math.round(1_000_000_000 * prog(t, menghasilkan, miliar - menghasilkan, ease.outQuart));
  const glitch = t > miliar && t < miliar + 0.22;
  const sh = shake(t, miliar, 22, 0.45, 'bn');
  const eye = {x: 1060, y: 662};

  const accountEl = (k: number, size: number) => {
    const acc = ACCOUNTS[k];
    const p = orbitIn(k);
    if (p <= 0) return null;
    const o = orbitPos(k);
    const s = mix(0.72, 1, (o.depth + 1) / 2) * p * (1 - globeOut);
    if (s <= 0.01) return null;
    const chip = acc.followers ? prog(t, media + k * 0.08, 0.4, ease.outBackStrong) : 0;
    return (
      <div key={acc.key} style={{position: 'absolute', left: o.x, top: o.y, transform: `translate(-50%, -50%) scale(${s})`, opacity: mix(0.55, 1, (o.depth + 1) / 2), zIndex: o.front ? 30 : 5}}>
        <div style={{width: size, height: size, borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 0 4px ${managed > 0 ? C.violetLight : '#fff'}, 0 14px 30px rgba(0,0,0,0.5)`, background: '#fff'}}>
          <Img src={staticFile(`sosmed/avatars/${acc.key}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        {managed > 0 ? (
          <div style={{position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: 12, background: '#22C55E', border: '3px solid #0D0E21', transform: `scale(${managed})`}} />
        ) : null}
        {chip > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -44,
              transform: `translateX(-50%) scale(${chip})`,
              padding: '6px 14px',
              borderRadius: 999,
              background: GRAD,
              color: '#fff',
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 22,
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 20px rgba(23,42,134,0.5)',
            }}
          >
            {acc.followers}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <AbsoluteFill>
      <InkBg
        fadeFrom={95.3}
        glow={[
          [C.blue, 30, 35],
          [C.violet, 75, 70],
        ]}
        dots={false}
      />

      {/* ================= globe made of the incoming pixels ================= */}
      {t < melalui + 0.5 ? (
        <AbsoluteFill>
          {/* orbit path */}
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: prog(t, kami, 0.5) * (1 - globeOut)}}>
            <ellipse cx={globeX} cy={globeY} rx={ORBIT.rx} ry={ORBIT.ry} fill="none" stroke="rgba(144,161,244,0.35)" strokeWidth={2} strokeDasharray="6 10" transform={`rotate(${ORBIT.tilt} ${globeX} ${globeY})`} />
            {managed > 0
              ? ACCOUNTS.map((_, k) => {
                  const o = orbitPos(k);
                  return <line key={k} x1={globeX} y1={globeY} x2={o.x} y2={o.y} stroke="rgba(191,164,244,0.18)" strokeWidth={1.5} />;
                })
              : null}
          </svg>
          {ACCOUNTS.map((_, k) => (orbitPos(k).front ? null : accountEl(k, 84)))}
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, zIndex: 10}}>
            <defs>
              <radialGradient id="globeGlow">
                <stop offset="0" stopColor={C.blueMid} stopOpacity={0.35} />
                <stop offset="1" stopColor={C.blueMid} stopOpacity={0} />
              </radialGradient>
            </defs>
            <circle cx={globeX} cy={globeY} r={GLOBE_R * 1.35 * globeS} fill="url(#globeGlow)" opacity={prog(t, 95.8, 0.6)} />
            {globe.map((g, i) => {
              const w = wrap(i);
              const [gx, gy] = dotXY(i);
              const x = mix(gx, g.sx, w);
              const y = mix(gy, g.sy, w);
              const depthK = (g.z + 1) / 2;
              const r = mix(DOT_R, mix(2.2, 6.5, depthK) * globeS, w);
              const o = mix(0.9, mix(0.18, 1, depthK), w);
              return <circle key={i} cx={x} cy={y} r={r} fill={dotColor(i)} opacity={o * (1 - globeOut * 0.5)} />;
            })}
          </svg>
          <div style={{position: 'absolute', inset: 0, zIndex: 20}}>{ACCOUNTS.map((_, k) => (orbitPos(k).front ? accountEl(k, 84) : null))}</div>
        </AbsoluteFill>
      ) : null}

      {/* keywords, part A–C */}
      {t < melalui - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 86, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 40}}>
          {t < kami - 0.1 ? (
            <>
              <Label size={26} color={C.blueLight}>
                <W t={at(39, 'di')} out={kami - 0.3}>
                  di{' '}
                </W>
                <W t={ranah} out={kami - 0.3}>
                  ranah
                </W>
              </Label>
              <H size={120} color="#fff">
                <W t={digital} out={kami - 0.3} look="grad" dark>
                  digital
                </W>
              </H>
            </>
          ) : t < lebih - 0.1 ? (
            <H size={84} color="#fff">
              <W t={kami} out={lebih - 0.3} style={{fontSize: '0.55em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                kami{' '}
              </W>
              <W t={juga} out={lebih - 0.3} style={{fontSize: '0.55em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                juga{' '}
              </W>
              <W t={membangun} out={lebih - 0.3} look="grad" dark>
                membangun{' '}
              </W>
              <W t={dan} out={lebih - 0.3} style={{fontSize: '0.55em', color: 'rgba(255,255,255,0.7)', fontWeight: 700}}>
                &amp;{' '}
              </W>
              <W t={mengelola} out={lebih - 0.3} look="serif" dark style={{fontSize: '1.1em'}}>
                mengelola
              </W>
            </H>
          ) : null}
        </div>
      ) : null}
      {t > lebih - 0.1 && t < melalui + 0.1 ? (
        <div style={{position: 'absolute', left: 1290, top: 300, width: 560, zIndex: 40, opacity: 1 - prog(t, melalui - 0.2, 0.3)}}>
          <Label size={26} color={C.blueLight}>
            <W t={lebih}>lebih dari</W>
          </Label>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 300, letterSpacing: '-0.06em', lineHeight: 0.95, marginTop: 6}}>
            <W t={lima} look="grad" dark>
              15+
            </W>
          </div>
          <H size={70} color="#fff" align="left" style={{marginTop: 8}}>
            <W t={media}>media </W>
            <W t={at(41, 'dan')} style={{fontSize: '0.6em', color: 'rgba(255,255,255,0.65)', fontWeight: 700}}>
              &amp;{' '}
            </W>
            <W t={proxy} look="serif" dark style={{fontSize: '1.12em'}}>
              proxy
            </W>
          </H>
        </div>
      ) : null}

      {/* ================= the content wall ================= */}
      {t > melalui - 0.1 && t < telah + 0.2 ? (
        <AbsoluteFill style={{perspective: 1800}}>
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: 600,
              width: 0,
              height: 0,
              transform: `rotateX(${mix(40, 24, wallIn)}deg) rotateZ(-9deg) scale(${mix(0.7, 1, wallIn)}) translateY(${-(t - melalui) * 40}px)`,
            }}
          >
            {ACCOUNTS.map((acc, c) =>
              Array.from({length: 9}, (_, r) => {
                const k = c * 9 + r;
                const x = (c - 7) * (TILE + TILE_GAP) - TILE / 2;
                const y = (r - 4) * (TILE + TILE_GAP) - TILE / 2 + (c % 2 ? 60 : 0);
                const pin = prog(t, melalui + 0.05 + (Math.abs(c - 7) + r) * 0.035 + rand(k, 3) * 0.08, 0.45, ease.outBackStrong);
                // accumulate: everything spirals into the orb
                const gk = clamp01(gatherW * 1.3 - rand(k, 5) * 0.3);
                const ang = rand(k, 6) * Math.PI * 2;
                const gx = mix(x, Math.cos(ang) * 40, gk);
                const gy = mix(y, 120 + Math.sin(ang) * 40, gk);
                return (
                  <div
                    key={k}
                    style={{
                      position: 'absolute',
                      left: gx,
                      top: gy,
                      width: TILE,
                      height: TILE,
                      borderRadius: 14,
                      overflow: 'hidden',
                      boxShadow: '0 16px 30px rgba(0,0,0,0.45)',
                      transform: `scale(${pin * mix(1, 0.15, gk)}) rotate(${gk * (rand(k, 7) - 0.5) * 180}deg)`,
                      opacity: clamp01(pin * 2) * (1 - clamp01((gk - 0.85) * 6)),
                    }}
                  >
                    <Img src={staticFile(`sosmed/posts/${acc.key}-${r + 1}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                );
              }),
            )}
          </div>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 55%, transparent 40%, rgba(7,8,22,0.9) 100%)'}} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(7,8,22,0.96) 0%, rgba(7,8,22,0.82) 20%, rgba(7,8,22,0) 42%)'}} />
        </AbsoluteFill>
      ) : null}
      {/* the orb everything accumulates into */}
      {orb > 0 ? (
        <div style={{position: 'absolute', left: 960 - 160, top: 600 - 160, width: 320, height: 320, transform: `scale(${orb * (1 + bump(t, akumulatif, 0.4) * 0.15)})`}}>
          <div style={{position: 'absolute', inset: -120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,62,204,0.55), transparent 65%)'}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #fff 0%, ${C.blueLight} 18%, ${C.blueMid} 50%, ${C.violet} 100%)`, boxShadow: '0 0 80px rgba(144,161,244,0.6)'}} />
        </div>
      ) : null}
      {t > melalui - 0.1 && t < telah ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 86, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 40}}>
          {t < secara - 0.1 ? (
            <>
              <Label size={26} color={C.blueLight}>
                <W t={melalui} out={secara - 0.3}>
                  melalui{' '}
                </W>
                <W t={berbagai} out={secara - 0.3}>
                  berbagai
                </W>
              </Label>
              <H size={128} color="#fff">
                <W t={konten} out={secara - 0.3} look="serif" dark style={{fontSize: '1.1em'}}>
                  konten{' '}
                </W>
                <W t={kembangkan} out={secara - 0.3} style={{fontSize: '0.42em', fontWeight: 700, color: 'rgba(255,255,255,0.75)'}}>
                  yang kami kembangkan
                </W>
              </H>
            </>
          ) : (
            <>
              <Label size={26} color={C.blueLight}>
                <W t={secara} out={telah - 0.2}>
                  secara
                </W>
              </Label>
              <H size={128} color="#fff">
                <W t={akumulatif} out={telah - 0.2} look="grad" dark>
                  akumulatif
                </W>
              </H>
            </>
          )}
        </div>
      ) : null}

      {/* ================= one billion views ================= */}
      {t > telah - 0.15 ? (
        <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
          <AbsoluteFill style={{background: `radial-gradient(circle at 50% 52%, rgba(109,62,204,${0.35 + bump(t, miliar, 0.5) * 0.4}), transparent 55%)`}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Label size={28} color={C.blueLight}>
              <W t={telah}>telah </W>
              <W t={menghasilkan}>menghasilkan </W>
              <W t={at(44, 'lebih')}>lebih dari</W>
            </Label>
            <div
              style={{
                position: 'relative',
                marginTop: 18,
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: 196,
                letterSpacing: '-0.05em',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                backgroundImage: GRAD_LIGHT,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                transform: `scale(${prog(t, telah, 0.5, ease.outBackStrong) * (1 + bump(t, miliar, 0.35) * 0.08)})`,
                filter: glitch ? 'saturate(2)' : undefined,
              }}
            >
              {count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}+
              {glitch ? (
                <>
                  <div style={{position: 'absolute', inset: 0, color: C.blueMid, WebkitTextFillColor: C.blueMid, transform: 'translateX(-9px)', mixBlendMode: 'screen', opacity: 0.8}}>1.000.000.000+</div>
                  <div style={{position: 'absolute', inset: 0, color: C.violetMid, WebkitTextFillColor: C.violetMid, transform: 'translateX(9px)', mixBlendMode: 'screen', opacity: 0.8}}>1.000.000.000+</div>
                </>
              ) : null}
            </div>
          </div>
          <div style={{position: 'absolute', right: 1920 - (eye.x - 84), top: eye.y - 58}}>
            <H size={100} color="#fff" align="right">
              <W t={satu} look="serif" dark style={{fontSize: '1.1em'}}>
                satu{' '}
              </W>
              <W t={miliar}>miliar</W>
            </H>
          </div>
          {t > views - 0.1 ? (
            <>
              <div style={{position: 'absolute', left: eye.x - 60, top: eye.y - 60, width: 120, height: 120, transform: `scale(${prog(t, views - 0.05, 0.4, ease.outBackStrong)})`}}>
                <svg width={120} height={120} viewBox="-60 -60 120 120">
                  <path d="M-56 0 C -30 -40, 30 -40, 56 0 C 30 40, -30 40, -56 0 Z" fill={C.paper} />
                  <circle r={24} fill={C.violetMid} />
                  <circle r={11} fill={C.ink} />
                  <circle cx={-7} cy={-8} r={5} fill="#fff" />
                </svg>
              </div>
              <div style={{position: 'absolute', left: eye.x + 84, top: eye.y - 58}}>
                <H size={100} color="#fff" align="left">
                  <W t={views} look="grad" dark>
                    views.
                  </W>
                </H>
              </div>
            </>
          ) : null}
        </AbsoluteFill>
      ) : null}
      {/* the eye opens wide: its white becomes the next act's paper */}
      <GrowCover t0={108.32} dur={0.48} x={eye.x} y={eye.y} color={C.paper} r0={11} fn={ease.inCubic} />
    </AbsoluteFill>
  );
};

