import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {DotGrid, PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Avatar, FloatHeart, Reticle, Sparkle, StoryCard} from '../components/Illos';
import {GrowCover} from '../components/Cover';
import {ARC_L, ARC_R} from '../components/ruberLogoPaths';
import {useT} from '../lib/scene';
import {clamp01, ease, mix, prog} from '../lib/anim';
import {kf, rand} from '../lib/kf';
import {beatPulse} from '../lib/beat';

const CX = 960;
const CY = 596;
const CW = 300;
const CH = 533;

const STORIES = [
  'photos/fashion-hijab-glasses.jpg',
  'photos/street-jump.jpg',
  'photos/fashion-girl-pink.jpg',
  'photos/street-duo-01.jpg',
  'photos/fashion-hijab-orange.jpg',
  'photos/fashion-trio.jpg',
  'photos/street-girl-selfie.jpg',
  'photos/fashion-duo-wide.jpg',
  'photos/fashion-group-barrier.jpg',
];
const RING1 = [
  'photos/street-girl-portrait.jpg',
  'photos/street-boy-bag.jpg',
  'photos/fashion-hijab-cap.jpg',
  'photos/fashion-hijab-vest.jpg',
  'photos/fashion-man-sneakers.jpg',
  'photos/street-boy-lowangle.jpg',
];
const RING2 = [
  'photos/street-girl-sit.jpg',
  'photos/street-duo-03.jpg',
  'photos/fashion-hijab-purple.jpg',
  'photos/fashion-girl-phones.jpg',
  'photos/street-jump.jpg',
  'photos/fashion-trio.jpg',
  'photos/fashion-girl-pink.jpg',
  'photos/street-girl-selfie.jpg',
  'photos/fashion-hijab-orange.jpg',
  'photos/street-duo-01.jpg',
];
const R1_ANG = [-165, -105, -45, 15, 75, 135];
const R2_ANG = [-160, -128, -52, -18, 12, 42, 72, 108, 140, 172];
const TARGETS = [3, 4, 5]; // ring-2 indices that get "dituju"

const polar = (deg: number, rx: number, ry: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [CX + Math.cos(a) * rx, CY + Math.sin(a) * ry];
};

/** Quadratic edge from the centre to (x, y), bent sideways. */
const edgePath = (x: number, y: number, bend: number) => {
  const mx = (CX + x) / 2;
  const my = (CY + y) / 2;
  const dx = x - CX;
  const dy = y - CY;
  const qx = mx - dy * bend;
  const qy = my + dx * bend;
  return {d: `M${CX} ${CY} Q${qx} ${qy} ${x} ${y}`, qx, qy};
};
const qpt = (x: number, y: number, qx: number, qy: number, s: number): [number, number] => [
  (1 - s) * (1 - s) * CX + 2 * (1 - s) * s * qx + s * s * x,
  (1 - s) * (1 - s) * CY + 2 * (1 - s) * s * qy + s * s * y,
];

// "Setiap brand memiliki cerita…" → "…menjangkau audience yang dituju."
export const A01Hook: React.FC = () => {
  const t = useT();
  const cerita = at(0, 'cerita');
  const namun = at(1, 'namun');
  const cerita2 = at(1, 'cerita');
  const tidak = at(2, 'tidak');
  const cukup = at(2, 'cukup');
  const terlihat = at(2, 'terlihat');
  const menarik = at(2, 'menarik');
  const disampaikan = at(3, 'disampaikan');
  const tepat = at(3, 'tepat');
  const relevan = at(4, 'relevan');
  const menjangkau = at(4, 'menjangkau');
  const audience = at(4, 'audience');
  const dituju = at(4, 'dituju');

  // ---------------- carousel ----------------
  const grow = prog(t, 0.42, 0.62, ease.inOutExpo); // dot → hero card
  const spread = prog(t, 0.95, 0.9, ease.outExpo); // other cards fan out
  const rot = kf(t, [
    [0.9, -70],
    [3.85, -12, ease.linear],
    [4.9, 360, ease.inOutExpo],
  ]);
  const fanOut = prog(t, 4.75, 0.6, ease.inCubic); // others leave when the hero is chosen
  const R = mix(0, 620, spread) + fanOut * 600;

  // hero card track: centre → right (tidak cukup) → centre (tepat) → node (relevan)
  const heroX = kf(t, [
    [5.25, CX],
    [5.75, 1300, ease.outExpo],
    [7.5, 1300],
    [8.0, CX, ease.inOutExpo],
  ]);
  const toNode = prog(t, 9.42, 0.5, ease.inOutExpo);
  const heroScale = kf(t, [
    [3.95, 1],
    [4.9, 1.12, ease.outExpo],
    [5.4, 1.0, ease.inOutCubic],
  ]);
  const heroW = mix(mix(16, CW, grow), 150, toNode);
  const heroH = mix(mix(16, CH, grow), 150, toNode);
  const heroR = mix(mix(8, 30, grow), 75, toNode);
  const dotPop = prog(t, 0.2, 0.35, ease.outBackStrong);
  const glitch = t > menarik + 0.3 && t < menarik + 0.62;
  const focusBlur = t > 7.5 && t < tepat ? mix(0, 7, prog(t, 7.5, 0.4)) * (1 - prog(t, tepat - 0.06, 0.12)) : 0;
  const lock = prog(t, tepat - 0.05, 0.3, ease.outExpo);

  // ---------------- network ----------------
  const retract = prog(t, 12.88, 0.42, ease.inCubic); // everything falls into the centre
  const nodeShrink = prog(t, 13.0, 0.3, ease.inOutCubic);
  const targetP = prog(t, dituju, 0.45, ease.outExpo);
  const showNet = t > relevan - 0.1;
  const bp = beatPulse(t);

  const cards = STORIES.map((src, i) => {
    if (i === 0) return null;
    const a = i * (360 / STORIES.length) + rot;
    const rad = (a * Math.PI) / 180;
    const d = Math.cos(rad); // 1 = front
    const s = mix(0.56, 1, (d + 1) / 2) * mix(0.3, 1, spread);
    const x = CX + Math.sin(rad) * R;
    const y = CY - (1 - d) * 46;
    const vis = spread * (1 - fanOut);
    if (vis <= 0.01) return null;
    return (
      <div
        key={src}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          zIndex: Math.round(d * 50) + 50,
          transform: `translate(-50%, -50%) scale(${s}) perspective(1400px) rotateY(${-Math.sin(rad) * 32}deg)`,
          opacity: vis * mix(0.35, 1, (d + 1) / 2),
        }}
      >
        <StoryCard src={src} w={CW} h={CH} bars={1 + ((t * 0.6 + i * 0.37) % 3)} blur={(1 - d) * 2.6} sat={mix(0.7, 1, (d + 1) / 2)} />
      </div>
    );
  });

  const avatars1 = RING1.map((src, i) => {
    const [x, y] = polar(R1_ANG[i], 330, 222);
    const t0 = relevan + 0.08 + i * 0.07;
    const p = prog(t, t0 + 0.22, 0.45, ease.outBackStrong);
    const [rx, ry] = [mix(x, CX, retract), mix(y, CY, retract)];
    const bounce = prog(t, audience + i * 0.03, 0.2) * (1 - prog(t, audience + 0.25 + i * 0.03, 0.3));
    return (
      <div key={'a1' + i} style={{position: 'absolute', left: rx, top: ry - bounce * 18, transform: `translate(-50%, -50%) scale(${p * (1 - retract)})`, zIndex: 120}}>
        <Avatar src={src} size={96} ring="#fff" ringW={5} />
      </div>
    );
  });
  const avatars2 = RING2.map((src, i) => {
    const [x, y] = polar(R2_ANG[i], 640, 352);
    const t0 = menjangkau - 0.05 + i * 0.05;
    const p = prog(t, t0 + 0.25, 0.45, ease.outBackStrong);
    const isT = TARGETS.includes(i);
    const dim = t > dituju ? (isT ? 0 : targetP * 0.6) : 0;
    const [rx, ry] = [mix(x, CX, retract), mix(y, CY, retract)];
    const bounce = prog(t, audience + 0.1 + i * 0.03, 0.2) * (1 - prog(t, audience + 0.35 + i * 0.03, 0.3));
    return (
      <div
        key={'a2' + i}
        style={{
          position: 'absolute',
          left: rx,
          top: ry - bounce * 14,
          transform: `translate(-50%, -50%) scale(${p * (1 - retract) * (isT ? 1 + targetP * 0.14 : 1)})`,
          opacity: 1 - dim,
          zIndex: 110,
        }}
      >
        <Avatar src={src} size={78} ring={isT && t > dituju ? C.violetMid : '#fff'} ringW={isT && t > dituju ? 6 : 4} filter={dim > 0.1 ? `grayscale(${dim})` : undefined} />
      </div>
    );
  });
  const dots = Array.from({length: 34}, (_, i) => {
    const ang = (i / 34) * 360 + 4;
    const [x, y] = polar(ang, 860, 470);
    const t0 = menjangkau + 0.15 + rand(i, 3) * 0.5;
    const p = prog(t, t0, 0.35, ease.outBack);
    return {x, y, p, i};
  });

  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 8, y: 14, r: 330, color: C.blueSoft, seed: 'h1'},
          {x: 92, y: 88, r: 380, color: C.violetSoft, seed: 'h2'},
          {x: 86, y: 8, r: 220, color: C.blueSoft, seed: 'h3'},
        ]}
        blobOpacity={0.95}
      />
      <DotGrid color="rgba(7,8,22,0.10)" gap={38} opacity={0.6 + bp * 0.25} />

      {/* network edges + reach dots */}
      {showNet ? (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, zIndex: 20}}>
          <defs>
            <linearGradient id="edgeG" x1="0" x2="1">
              <stop offset="0" stopColor={C.blue} />
              <stop offset="1" stopColor={C.violet} />
            </linearGradient>
          </defs>
          {RING1.map((_, i) => {
            const [x, y] = polar(R1_ANG[i], 330, 222);
            const e = edgePath(x, y, 0.14 * (i % 2 ? 1 : -1));
            const p = prog(t, relevan + i * 0.07, 0.4, ease.outCubic) * (1 - retract);
            return <path key={'e1' + i} d={e.d} fill="none" stroke={C.blue} strokeOpacity={0.5} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
          })}
          {RING2.map((_, i) => {
            const [x, y] = polar(R2_ANG[i], 640, 352);
            const e = edgePath(x, y, 0.1 * (i % 2 ? -1 : 1));
            const p = prog(t, menjangkau - 0.1 + i * 0.05, 0.45, ease.outCubic) * (1 - retract);
            const isT = TARGETS.includes(i) && t > dituju;
            return (
              <path
                key={'e2' + i}
                d={e.d}
                fill="none"
                stroke={isT ? 'url(#edgeG)' : C.blue}
                strokeOpacity={isT ? 0.95 : t > dituju ? mix(0.35, 0.12, targetP) : 0.35}
                strokeWidth={isT ? 5 : 2.5}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
              />
            );
          })}
          {/* packets travelling outward */}
          {RING2.map((_, i) => {
            const [x, y] = polar(R2_ANG[i], 640, 352);
            const e = edgePath(x, y, 0.1 * (i % 2 ? -1 : 1));
            if (t < menjangkau + 0.3 || retract > 0.05) return null;
            const s = ((t - menjangkau) * 0.9 + rand(i, 7)) % 1;
            const [px, py] = qpt(x, y, e.qx, e.qy, s);
            return <circle key={'pk' + i} cx={px} cy={py} r={6} fill={TARGETS.includes(i) && t > dituju ? C.violetMid : C.blueMid} />;
          })}
          {dots.map(({x, y, p, i}) => (
            <circle key={'d' + i} cx={mix(x, CX, retract)} cy={mix(y, CY, retract)} r={7 * p * (1 - retract)} fill={i % 3 ? C.blueMid : C.violetMid} opacity={0.55} />
          ))}
        </svg>
      ) : null}

      {/* audience */}
      {showNet ? avatars1 : null}
      {showNet ? avatars2 : null}

      {/* story carousel */}
      {cards}

      {/* the hero: dot → story → node */}
      <div
        style={{
          position: 'absolute',
          left: mix(heroX, CX, toNode),
          top: CY,
          zIndex: 200,
          transform: `translate(-50%, -50%) scale(${(t < 0.42 ? dotPop : 1) * heroScale * (1 + bp * 0.012) * (1 - nodeShrink * 0.9)})`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: heroW,
            height: heroH,
            borderRadius: heroR,
            overflow: 'hidden',
            background: C.ink,
            boxShadow: grow > 0.2 ? '0 30px 70px rgba(16,14,60,0.28)' : 'none',
            filter: focusBlur > 0.05 ? `blur(${focusBlur}px)` : glitch ? 'saturate(0.2) contrast(1.4)' : undefined,
            transform: glitch ? `translateX(${(rand(Math.floor(t * 30)) - 0.5) * 26}px)` : undefined,
          }}
        >
          <div style={{position: 'absolute', inset: 0, opacity: clamp01((grow - 0.25) * 2) * (1 - nodeShrink)}}>
            {toNode < 0.5 ? (
              <StoryCard src={STORIES[0]} w={heroW} h={heroH} radius={heroR} bars={clamp01((t - 1) / 3) * 2 + 0.2} ui={1 - toNode * 2} pos="50% 35%" />
            ) : (
              <Avatar src={STORIES[0]} size={heroW} pos="50% 30%" />
            )}
          </div>
          {glitch ? (
            <>
              <div style={{position: 'absolute', inset: 0, background: C.blueMid, mixBlendMode: 'screen', opacity: 0.35, transform: 'translateX(10px)'}} />
              <div style={{position: 'absolute', inset: 0, background: C.violetMid, mixBlendMode: 'multiply', opacity: 0.3, transform: 'translateX(-10px)'}} />
            </>
          ) : null}
        </div>
        {/* "terlihat menarik" decorations */}
        {t > terlihat && t < menarik + 0.6 ? (
          <>
            <div style={{position: 'absolute', left: -46, top: 70, transform: `scale(${prog(t, terlihat + 0.05, 0.4, ease.outBackStrong) * (1 - prog(t, menarik + 0.32, 0.2))})`}}>
              <div style={{display: 'flex', gap: 4, padding: '10px 14px', borderRadius: 16, background: '#fff', boxShadow: '0 16px 36px rgba(16,14,60,0.18)'}}>
                {[0, 1, 2, 3, 4].map((k) => (
                  <Sparkle key={k} size={24} color={C.violetMid} p={prog(t, terlihat + 0.1 + k * 0.05, 0.3, ease.outBackStrong)} />
                ))}
              </div>
            </div>
            <div style={{position: 'absolute', right: -40, top: 230, transform: `scale(${prog(t, menarik, 0.4, ease.outBackStrong) * (1 - prog(t, menarik + 0.32, 0.2))}) rotate(-12deg)`}}>
              <Sparkle size={90} color={C.blueMid} />
            </div>
          </>
        ) : null}
        {t > terlihat && t < menarik + 1.4
          ? [0, 1, 2, 3, 4, 5].map((k) => <FloatHeart key={k} t0={terlihat + k * 0.12} x={heroW / 2 + (k - 2.5) * 34} y={heroH - 60} size={38} color={k % 2 ? '#fff' : C.violetLight} drift={k - 2.5} />)
          : null}
      </div>

      {/* viewfinder made of the logo's own arcs: hunts for focus, then locks on "tepat" */}
      {t > disampaikan - 0.2 && t < 9.7
        ? (() => {
            const hunt = (1 - lock) * (64 + Math.sin(t * 11) * 10);
            const rotA = (1 - lock) * -14;
            const vis = prog(t, disampaikan - 0.2, 0.3) * (1 - prog(t, 9.45, 0.25));
            const KS = 0.5;
            const lx = CX - CW / 2 - 30;
            const ly = CY - CH / 2 - 30;
            const rx = CX + CW / 2 + 30 - 457 * KS;
            const ry = CY + CH / 2 + 30 - 455 * KS;
            return (
              <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, zIndex: 210, opacity: vis, overflow: 'visible'}}>
                <g transform={`translate(${lx - hunt} ${ly - 4 * KS - hunt}) scale(${KS}) rotate(${rotA} 95 150)`}>
                  <path d={ARC_L} fill={C.ink} />
                </g>
                <g transform={`translate(${rx + hunt} ${ry + hunt}) scale(${KS}) rotate(${rotA} 290 330)`}>
                  <path d={ARC_R} fill={C.ink} />
                </g>
              </svg>
            );
          })()
        : null}
      {t > tepat - 0.1 && t < 9.7 ? (
        <div style={{position: 'absolute', left: CX, top: CY, zIndex: 211, transform: 'translate(-50%, -50%)', opacity: lock * (1 - prog(t, 9.45, 0.25))}}>
          <Reticle r={46} color={C.violetMid} p={lock} spin={t * 40} />
        </div>
      ) : null}

      {/* target lock around the reached segment */}
      {t > dituju - 0.1 && retract < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: polar(R2_ANG[4], 640, 352)[0],
            top: polar(R2_ANG[4], 640, 352)[1],
            zIndex: 130,
            transform: `translate(-50%, -50%) scale(${1 - retract})`,
            opacity: targetP,
          }}
        >
          <Reticle r={190} color={C.violetMid} p={targetP} spin={-t * 30} stroke={4} />
        </div>
      ) : null}

      {/* keyword slot */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 92, zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {t < namun - 0.1 ? (
          <>
            <Label size={26} color={C.blueMid}>
              <W t={at(0, 'setiap')} out={namun - 0.3}>
                setiap{' '}
              </W>
              <W t={at(0, 'brand')} out={namun - 0.3}>
                brand{' '}
              </W>
              <W t={at(0, 'memiliki')} out={namun - 0.3}>
                memiliki
              </W>
            </Label>
            <H size={150} style={{marginTop: -6}}>
              <W t={cerita} out={namun - 0.3} look="serif">
                cerita.
              </W>
            </H>
          </>
        ) : null}
        {t >= namun - 0.1 && t < tidak - 0.1 ? (
          <H size={92} weight={700}>
            <W t={namun} out={tidak - 0.3}>
              namun{' '}
            </W>
            <W t={at(1, 'sebuah')} out={tidak - 0.3}>
              sebuah{' '}
            </W>
            <W t={cerita2} out={tidak - 0.3} look="serif" style={{fontSize: '1.3em'}}>
              cerita
            </W>
          </H>
        ) : null}
        {t >= disampaikan - 0.1 && t < 9.65 ? (
          <>
            <Label size={26} color={C.blueMid}>
              <W t={disampaikan} out={9.5}>
                harus disampaikan{' '}
              </W>
              <W t={at(3, 'dengan')} out={9.5}>
                dengan
              </W>
            </Label>
            <H size={150} style={{marginTop: -6}}>
              <W t={tepat} out={9.5} look="grad">
                tepat.
              </W>
            </H>
          </>
        ) : null}
        {t >= relevan - 0.1 && t < menjangkau - 0.05 ? (
          <H size={120}>
            <W t={relevan} out={menjangkau - 0.25} look="serif">
              relevan,
            </W>
          </H>
        ) : null}
        {t >= menjangkau - 0.1 && t < dituju - 0.05 ? (
          <H size={96}>
            <W t={menjangkau} out={dituju - 0.25}>
              menjangkau{' '}
            </W>
            <W t={audience} out={dituju - 0.25} look="grad">
              audience
            </W>
          </H>
        ) : null}
        {t >= dituju - 0.1 ? (
          <H size={112}>
            <W t={at(4, 'yang', 0)} out={12.95}>
              yang{' '}
            </W>
            <W t={dituju} out={12.95} look="serif" style={{fontSize: '1.2em'}}>
              dituju.
            </W>
          </H>
        ) : null}
      </div>

      {/* "tidak cukup hanya terlihat menarik" — left column while the hero sits right */}
      {t > tidak - 0.15 && t < 7.7 ? (
        <div style={{position: 'absolute', left: 150, top: 330, zIndex: 300}}>
          <H size={142} align="left" lh={0.98}>
            <W t={tidak} out={7.45}>
              tidak{' '}
            </W>
            <br />
            <W t={cukup} out={7.45} look="grad">
              cukup
            </W>
          </H>
          <H size={60} weight={700} align="left" color={C.muted} ls="-0.03em" style={{marginTop: 24}}>
            <W t={at(2, 'hanya')} out={7.45}>
              hanya{' '}
            </W>
            <W t={terlihat} out={7.45}>
              terlihat{' '}
            </W>
            <span style={{position: 'relative', display: 'inline-block', color: C.ink}}>
              <W t={menarik} out={7.45}>
                menarik.
              </W>
              <span
                style={{
                  position: 'absolute',
                  left: '-4%',
                  top: '52%',
                  height: 7,
                  borderRadius: 9,
                  background: C.violetMid,
                  width: `${prog(t, menarik + 0.3, 0.25, ease.outQuart) * 108}%`,
                  opacity: 1 - prog(t, 7.4, 0.15),
                }}
              />
            </span>
          </H>
        </div>
      ) : null}

      {/* hand-off: everything collapsed into the dot, which swallows the frame */}
      <GrowCover t0={13.22} dur={0.33} color={C.ink} r0={8} x={CX} y={CY} fn={ease.inCubic} />
    </AbsoluteFill>
  );
};
