import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, GRAD, GRAD_LIGHT} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Icon} from '../components/Icons';
import {useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog, shake} from '../lib/anim';
import {kf} from '../lib/kf';

// Same polaroid (and the same spot of its white margin) that Act 4 dived into.
const POL = {x: 730, y: 260, w: 460, h: 560, photo: 420, rot: -3};
const FOCAL0: [number, number] = [POL.x + 300, POL.y + 506];

const BOARD = [
  {src: 'photos/bts-shoot-bedroom-camera.jpg', x: 400, y: 330, rot: 6, s: 0.72, note: 'take 03'},
  {src: 'photos/bts-set-office-crew.jpg', x: 1530, y: 320, rot: -6, s: 0.72, note: 'set kantor'},
  {src: 'photos/bts-set-bedroom-wide.jpg', x: 430, y: 800, rot: -5, s: 0.66, note: 'lighting'},
];
const NOTES = [
  {x: 1500, y: 790, rot: 4, bg: C.violetSoft, lines: ['shot list', '✓ 24/24']},
  {x: 1230, y: 860, rot: -7, bg: C.blueSoft, lines: ['call time', '06.00']},
];
const CARD = {x: 960, y: 480, w: 780, h: 430};
const CARD_FOCAL: [number, number] = [CARD.x - CARD.w / 2 + 640, CARD.y - CARD.h / 2 + 330];

const Polaroid: React.FC<{src: string; w: number; h: number; photo: number; caption?: React.ReactNode}> = ({src, w, h, photo, caption}) => (
  <div style={{position: 'relative', width: w, height: h, background: '#fff', borderRadius: 6, boxShadow: '0 30px 60px rgba(20,16,65,0.22), 0 3px 8px rgba(20,16,65,0.1)'}}>
    <div style={{position: 'absolute', left: (w - photo) / 2, top: (w - photo) / 2, width: photo, height: photo, overflow: 'hidden', background: C.ink}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </div>
    {caption}
    <div style={{position: 'absolute', left: w / 2 - 14, top: -12, width: 28, height: 28, borderRadius: 14, background: GRAD, boxShadow: '0 6px 10px rgba(20,16,65,0.35), inset 0 3px 4px rgba(255,255,255,0.4)'}} />
  </div>
);

// "Pengalaman tersebut membentuk prinsip kerja yang kami pegang hingga hari ini:"
export const A05Principle: React.FC = () => {
  const t = useT();
  const pengalaman = at(20, 'pengalaman');
  const tersebut = at(20, 'tersebut');
  const membentuk = at(21, 'membentuk');
  const prinsip = at(21, 'prinsip');
  const kerja = at(21, 'kerja');
  const yang = at(21, 'yang');
  const kami = at(21, 'kami');
  const pegang = at(21, 'pegang');
  const hingga = at(22, 'hingga');
  const hari = at(22, 'hari');

  // camera: out of the polaroid margin, then wide on the board; finally into the principle card
  const zLog = kf(t, [
    [47.2, Math.log(46)],
    [47.64, Math.log(1.5), ease.outExpo],
    [tersebut, Math.log(1.45)],
    [48.2, Math.log(0.84), ease.inOutCubic],
    [membentuk + 0.3, Math.log(1.0), ease.inOutCubic],
  ]);
  const fxA = kf(t, [
    [47.2, FOCAL0[0]],
    [47.64, 960, ease.outExpo],
  ]);
  const fyA = kf(t, [
    [47.2, FOCAL0[1]],
    [47.64, 600, ease.outExpo],
    [48.2, 560, ease.inOutCubic],
    [membentuk + 0.3, 540, ease.inOutCubic],
  ]);
  const dive = prog(t, 51.12, 0.43, ease.inCubic);
  const zoom = Math.exp(zLog) * Math.exp(Math.log(40) * dive);
  const fx = mix(fxA, CARD_FOCAL[0], prog(t, 51.05, 0.45, ease.inOutCubic));
  const fy = mix(fyA, CARD_FOCAL[1], prog(t, 51.05, 0.45, ease.inOutCubic));
  const sh = shake(t, pegang + 0.05, 10, 0.35, 'peg');
  const world = `translate(${960 + sh.x}px, ${540 + sh.y}px) scale(${zoom}) translate(${-fx}px, ${-fy}px)`;

  const gather = prog(t, membentuk, 0.42, ease.inExpo);
  const cardIn = prog(t, membentuk + 0.36, 0.5, ease.outBackStrong);
  const write = prog(t, pengalaman + 0.02, 0.55, ease.inOutCubic);
  const seal = prog(t, pegang - 0.04, 0.4, ease.outBackStrong);
  const line = prog(t, hingga - 0.05, 0.5, ease.inOutCubic);
  const marker = prog(t, hingga, 0.32 + (hari - hingga), ease.inOutCubic);

  const pinOf = (x: number, y: number, h: number, s: number): [number, number] => [x, y - (h * s) / 2 - 2];
  const mainPin: [number, number] = [POL.x + POL.w / 2, POL.y - 2];

  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 10, y: 85, r: 320, color: C.blueSoft, seed: 'p1'},
          {x: 92, y: 12, r: 300, color: C.violetSoft, seed: 'p2'},
        ]}
      />
      <AbsoluteFill style={{transform: world, transformOrigin: '0 0'}}>
        {/* board grid */}
        <AbsoluteFill
          style={{
            left: -1200,
            top: -800,
            right: -1200,
            bottom: -800,
            backgroundImage: 'linear-gradient(rgba(7,8,22,0.05) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(7,8,22,0.05) 1.5px, transparent 1.5px)',
            backgroundSize: '60px 60px',
            opacity: 1 - gather,
          }}
        />
        {/* strings between the pins */}
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - gather}}>
          {BOARD.map((b, i) => {
            const [px, py] = pinOf(b.x, b.y, 560, b.s);
            const mx = (px + mainPin[0]) / 2;
            const my = Math.max(py, mainPin[1]) + 70;
            return (
              <path
                key={i}
                d={`M${mainPin[0]} ${mainPin[1]} Q${mx} ${my} ${px} ${py}`}
                fill="none"
                stroke={i % 2 ? C.violetMid : C.blueMid}
                strokeWidth={3.5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - prog(t, tersebut + i * 0.08, 0.45, ease.outCubic)}
              />
            );
          })}
        </svg>
        {/* the other polaroids + notes */}
        {BOARD.map((b, i) => {
          const p = prog(t, tersebut - 0.1 + i * 0.07, 0.5, ease.outBackStrong);
          const gx = mix(b.x, 960, gather);
          const gy = mix(b.y, 480, gather);
          return (
            <div
              key={b.src}
              style={{
                position: 'absolute',
                left: gx - 230,
                top: gy - 280,
                transform: `rotate(${mix(b.rot, b.rot * 3, gather)}deg) scale(${b.s * p * mix(1, 0.4, gather)})`,
                opacity: clamp01(p * 2) * (1 - prog(t, membentuk + 0.36, 0.1)),
              }}
            >
              <Polaroid
                src={b.src}
                w={460}
                h={560}
                photo={420}
                caption={
                  <div style={{position: 'absolute', left: 26, top: 458, fontFamily: F.serif, fontStyle: 'italic', fontSize: 52, color: C.ink, opacity: 0.85}}>{b.note}</div>
                }
              />
            </div>
          );
        })}
        {NOTES.map((n, i) => {
          const p = prog(t, tersebut + 0.15 + i * 0.08, 0.45, ease.outBackStrong);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: mix(n.x, 960, gather) - 110,
                top: mix(n.y, 480, gather) - 110,
                width: 220,
                height: 200,
                background: n.bg,
                borderRadius: 6,
                padding: '26px 24px',
                boxSizing: 'border-box',
                boxShadow: '0 18px 30px rgba(20,16,65,0.16)',
                transform: `rotate(${n.rot}deg) scale(${p * mix(1, 0.4, gather)})`,
                opacity: 1 - prog(t, membentuk + 0.36, 0.1),
                fontFamily: F.serif,
                fontStyle: 'italic',
                fontSize: 42,
                lineHeight: 1.1,
                color: C.ink,
              }}
            >
              {n.lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          );
        })}
        {/* the main polaroid (continues from Act 4) */}
        <div
          style={{
            position: 'absolute',
            left: mix(POL.x, 960 - 230, gather),
            top: mix(POL.y, 480 - 280, gather),
            transform: `rotate(${mix(POL.rot, -14, gather)}deg) scale(${mix(1, 0.45, gather)})`,
            transformOrigin: '300px 506px',
            opacity: 1 - prog(t, membentuk + 0.36, 0.1),
          }}
        >
          <Polaroid
            src="photos/bts-shoot-bedroom-crew.jpg"
            w={POL.w}
            h={POL.h}
            photo={POL.photo}
            caption={
              <div style={{position: 'absolute', left: 30, top: 452}}>
                <div
                  style={{
                    fontFamily: F.serif,
                    fontStyle: 'italic',
                    fontSize: 70,
                    color: C.ink,
                    WebkitMaskImage: `linear-gradient(90deg, #000 ${write * 100}%, transparent ${write * 100 + 6}%)`,
                    maskImage: `linear-gradient(90deg, #000 ${write * 100}%, transparent ${write * 100 + 6}%)`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  pengalaman
                </div>
                <svg width={320} height={20} style={{position: 'absolute', left: 4, top: 76, overflow: 'visible'}}>
                  <path d="M2 12 C 80 2, 200 4, 312 10" fill="none" stroke={C.violetMid} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(t, pengalaman + 0.5, 0.3)} />
                </svg>
              </div>
            }
          />
        </div>
        {/* keyword on the board */}
        {t > tersebut - 0.1 && t < membentuk + 0.2 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center', opacity: 1 - gather}}>
            <Label size={30} color={C.blueMid}>
              <W t={tersebut}>pengalaman tersebut</W>
            </Label>
          </div>
        ) : null}

        {/* the principle card */}
        {cardIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: CARD.x - CARD.w / 2,
              top: CARD.y - CARD.h / 2,
              width: CARD.w,
              height: CARD.h,
              borderRadius: 40,
              background: C.ink,
              boxShadow: '0 50px 100px rgba(20,16,65,0.35)',
              transform: `scale(${cardIn * (1 + bump(t, pegang, 0.3) * 0.03)}) rotate(${mix(-8, 0, cardIn)}deg)`,
              overflow: 'hidden',
            }}
          >
            <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 15% 0%, rgba(47,73,198,0.45), transparent 55%)`}} />
            <div style={{position: 'absolute', left: 56, top: 50}}>
              <Label size={20} color={C.blueLight}>
                [ prinsip kerja ]
              </Label>
              <H size={108} color="#fff" align="left" style={{marginTop: 10, whiteSpace: 'nowrap'}}>
                <W t={prinsip} look="serif" dark style={{fontSize: '1.12em'}}>
                  prinsip{' '}
                </W>
                <W t={kerja}>kerja</W>
              </H>
              <H size={42} color="rgba(255,255,255,0.72)" weight={600} align="left" ls="-0.02em" style={{marginTop: 18}}>
                <W t={yang}>yang </W>
                <W t={kami}>kami </W>
                <W t={pegang} style={{color: '#fff', fontWeight: 800}}>
                  pegang
                </W>
              </H>
            </div>
          </div>
        ) : null}
        {/* seal */}
        {seal > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: CARD.x + CARD.w / 2 - 110,
              top: CARD.y - CARD.h / 2 - 60,
              width: 170,
              height: 170,
              borderRadius: 85,
              background: GRAD,
              boxShadow: '0 20px 40px rgba(23,42,134,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${mix(2.2, 1, seal)}) rotate(${mix(-40, -10, seal)}deg)`,
              opacity: clamp01(seal * 3),
            }}
          >
            <svg width={170} height={170} viewBox="0 0 170 170" style={{position: 'absolute', inset: 0}}>
              <defs>
                <path id="sealArc" d="M85 85 m-60 0 a60 60 0 1 1 120 0 a60 60 0 1 1 -120 0" />
              </defs>
              <text fill="rgba(255,255,255,0.85)" style={{fontFamily: F.mono, fontSize: 15, letterSpacing: '0.32em'}}>
                <textPath href="#sealArc">RUBER VISUAL · PRINSIP · </textPath>
              </text>
            </svg>
            <Icon name="check" size={60} color="#fff" stroke={3.2} draw={pegang + 0.05} drawDur={0.3} />
          </div>
        ) : null}
        {/* hingga hari ini */}
        {t > hingga - 0.1 ? (
          <div style={{position: 'absolute', left: CARD.x - CARD.w / 2, top: CARD.y + CARD.h / 2 + 60, width: CARD.w, height: 90}}>
            <div style={{position: 'absolute', left: 0, top: 40, height: 6, width: `${line * 100}%`, borderRadius: 3, background: `linear-gradient(90deg, rgba(23,42,134,0.15), ${C.blueMid}, ${C.violetMid})`}} />
            {Array.from({length: 13}, (_, i) => (
              <div key={i} style={{position: 'absolute', left: (i / 12) * CARD.w - 1.5, top: i % 3 === 0 ? 28 : 34, width: 3, height: i % 3 === 0 ? 30 : 18, borderRadius: 2, background: C.ink, opacity: 0.35 * clamp01(line * 13 - i)}} />
            ))}
            <div
              style={{
                position: 'absolute',
                left: marker * CARD.w - 18,
                top: 25,
                width: 36,
                height: 36,
                borderRadius: 18,
                background: '#fff',
                border: `6px solid ${C.violetMid}`,
                boxSizing: 'border-box',
                boxShadow: `0 0 0 ${10 * bump(t, hari + 0.05, 0.5)}px rgba(109,62,204,0.25)`,
                opacity: clamp01(line * 4),
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: CARD.w - 10,
                top: 43,
                transform: `translate(-50%, -150%) scale(${prog(t, hari, 0.4, ease.outBackStrong)})`,
                padding: '10px 22px',
                borderRadius: 999,
                background: C.ink,
                color: '#fff',
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: 30,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Icon name="calendar" size={28} color={C.blueLight} stroke={2.2} />
              <span style={{backgroundImage: GRAD_LIGHT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>hari ini</span>
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
