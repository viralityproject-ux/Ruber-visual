import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, GRAD, GRAD_MID} from '../theme';
import {DotGrid, PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {At, Cursor, Media} from '../components/UI';
import {Icon} from '../components/Icons';
import {RuberMark} from '../components/RuberLogo';
import {FloatHeart, PhoneFrame} from '../components/Illos';
import {useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog} from '../lib/anim';
import {kf, rand, type Key} from '../lib/kf';

// ---------------- geometry ----------------
// The app window lives in "wall space" as a 405×210 tile; the camera scale of 4 makes it fill the screen.
const WIN_W = 1620;
const WIN_H = 840;
const TILE_K = 0.25;
const SCREEN_C: [number, number] = [960, 516];
const SIDE_W = 360;
const CONTENT = {x: 400, y: 248, w: 1180, h: 556};

type Svc = {name: string; slug: string; icon: string; t0: number};

const rise = (t: number, t0: number, d = 0.45, y = 36): React.CSSProperties => {
  const p = prog(t, t0, d, ease.outExpo);
  return {opacity: clamp01(p * 2.2), transform: `translateY(${(1 - p) * y}px) scale(${mix(0.95, 1, p)})`};
};

/** A service's content: slides in on its cue, slides out on the next one. */
const Slot: React.FC<{t0: number; t1: number; children: React.ReactNode}> = ({t0, t1, children}) => {
  const t = useT();
  if (t < t0 - 0.06 || t > t1 + 0.32) return null;
  const pin = prog(t, t0 - 0.04, 0.5, ease.outExpo);
  const pout = prog(t, t1 - 0.04, 0.3, ease.inCubic);
  const blur = (1 - pin) * 10 + pout * 12;
  return (
    <div
      style={{
        position: 'absolute',
        left: CONTENT.x,
        top: CONTENT.y,
        width: CONTENT.w,
        height: CONTENT.h,
        opacity: clamp01(pin * 2) * (1 - pout),
        transform: `translate(${(1 - pin) * 70 - pout * 50}px, 0)`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

const Box: React.FC<{x: number; y: number; w: number; h: number; r?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
  x,
  y,
  w,
  h,
  r = 18,
  style,
  children,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, overflow: 'hidden', background: '#fff', ...style}}>{children}</div>
);

const shadow = '0 18px 40px rgba(16,14,60,0.14), 0 2px 6px rgba(16,14,60,0.06)';

const InfoRow: React.FC<{icon: string; title: string; sub: string; style?: React.CSSProperties}> = ({icon, title, sub, style}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', height: 92, borderRadius: 18, background: '#fff', boxShadow: shadow, ...style}}>
    <div style={{width: 54, height: 54, borderRadius: 14, background: C.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
      <Icon name={icon} size={28} color={C.blueMid} stroke={2.1} />
    </div>
    <div>
      <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', color: C.ink}}>{title}</div>
      <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 16, color: C.muted, marginTop: 2}}>{sub}</div>
    </div>
  </div>
);

const MetricBar: React.FC<{label: string; p: number; t0: number}> = ({label, p, t0}) => {
  const t = useT();
  const q = prog(t, t0, 0.8, ease.outExpo);
  return (
    <div style={{marginTop: 22}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.display, fontWeight: 700, fontSize: 18, color: C.ink}}>
        <span>{label}</span>
        <span style={{color: C.blueMid, display: 'flex', alignItems: 'center', gap: 4}}>
          <span style={{display: 'inline-block', transform: 'rotate(-90deg)'}}>
            <Icon name="arrow" size={18} color={C.blueMid} stroke={2.6} />
          </span>
        </span>
      </div>
      <div style={{height: 12, borderRadius: 6, background: 'rgba(7,8,22,0.07)', marginTop: 10, overflow: 'hidden'}}>
        <div style={{width: `${p * q * 100}%`, height: '100%', borderRadius: 6, background: GRAD_MID}} />
      </div>
    </div>
  );
};

// ---------------- the seven services ----------------
const SCompany: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  return (
    <>
      <Box x={0} y={0} w={760} h={509} style={{boxShadow: shadow, background: C.ink}}>
        <At t={t0 - 0.1}>
          <Media src="videos/corporate-meeting-result-bts.mp4" />
        </At>
        <div style={{position: 'absolute', left: 18, right: 18, bottom: 16, display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 40, height: 40, borderRadius: 20, background: 'rgba(7,8,22,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name="play" size={18} color="#fff" fill="#fff" stroke={1} />
          </div>
          <div style={{flex: 1, height: 6, borderRadius: 3, background: 'rgba(7,8,22,0.2)'}}>
            <div style={{width: `${clamp01((t - t0) / 1.4) * 100}%`, height: '100%', borderRadius: 3, background: GRAD_MID}} />
          </div>
        </div>
      </Box>
      <div style={{position: 'absolute', left: 790, top: 0, width: 390, display: 'flex', flexDirection: 'column', gap: 16}}>
        <InfoRow icon="building" title="Profil Perusahaan" sub="Cerita, visi, budaya" style={rise(t, t0 + 0.08)} />
        <InfoRow icon="film" title="Video 16:9 · 4K" sub="Durasi 2–3 menit" style={rise(t, t0 + 0.16)} />
        <InfoRow icon="globe" title="Web · Event · Sosmed" sub="Siap didistribusikan" style={rise(t, t0 + 0.24)} />
        <div style={{...rise(t, t0 + 0.32), height: 137, borderRadius: 18, background: GRAD, padding: '20px 22px', boxSizing: 'border-box', color: '#fff'}}>
          <Label size={13} color="rgba(255,255,255,0.7)">
            Deliverable
          </Label>
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', marginTop: 8}}>Brand Film</div>
          <div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 24, opacity: 0.85}}>+ foto korporat</div>
        </div>
      </div>
    </>
  );
};

const SDigital: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  const pts = Array.from({length: 12}, (_, i) => [i * (290 / 11), 120 - (Math.pow(i / 11, 1.6) * 92 + Math.sin(i * 1.7) * 9)] as [number, number]);
  const drawn = prog(t, t0 + 0.2, 0.9, ease.outCubic);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return (
    <>
      <Box x={0} y={0} w={400} h={532} style={{boxShadow: shadow, ...rise(t, t0)}}>
        <Img src={staticFile('photos/campaign-kahf-jalan-yang-kupilih.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Box>
      <Box x={428} y={0} w={399} h={532} style={{boxShadow: shadow, background: C.ink, ...rise(t, t0 + 0.08)}}>
        <At t={t0 - 0.1}>
          <Media src="videos/reel-kahf-before-after.mp4" trim={1} />
        </At>
      </Box>
      <Box x={856} y={0} w={324} h={532} style={{boxShadow: shadow, padding: 24, boxSizing: 'border-box', ...rise(t, t0 + 0.16)}}>
        <Label size={13} color={C.muted}>
          Kampanye
        </Label>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', color: C.ink, marginTop: 6}}>#JalanYangKupilih</div>
        <MetricBar label="Reach" p={0.88} t0={t0 + 0.25} />
        <MetricBar label="Engagement" p={0.7} t0={t0 + 0.33} />
        <MetricBar label="Konversi" p={0.52} t0={t0 + 0.41} />
        <svg width={276} height={130} style={{position: 'absolute', left: 24, bottom: 20, overflow: 'visible'}}>
          <defs>
            <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={C.violetMid} stopOpacity={0.35} />
              <stop offset="1" stopColor={C.violetMid} stopOpacity={0} />
            </linearGradient>
            <clipPath id="sparkClip">
              <rect x={0} y={-20} width={290 * drawn} height={170} />
            </clipPath>
          </defs>
          <g clipPath="url(#sparkClip)">
            <path d={`${d} L290 130 L0 130 Z`} fill="url(#spark)" />
            <path d={d} fill="none" stroke={C.blueMid} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </Box>
    </>
  );
};

const SShort: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  return (
    <>
      <Box x={0} y={0} w={420} h={525} style={{boxShadow: shadow, ...rise(t, t0)}}>
        <Img src={staticFile('photos/poster-lara-bisu.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Box>
      <Box x={450} y={40} w={730} h={445} style={{boxShadow: shadow, background: '#000', ...rise(t, t0 + 0.05)}}>
        <Img
          src={staticFile('photos/poster-lara-bisu.jpg')}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: `scale(${1.1 + (t - t0) * 0.05})`, filter: 'brightness(0.75)'}}
        />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 52, background: '#000'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 52, background: '#000'}} />
        {[0, 1].map((k) => (
          <div key={k} style={{position: 'absolute', left: -((t * 120) % 46), right: 0, top: k ? undefined : 16, bottom: k ? 16 : undefined, height: 18, display: 'flex', gap: 22}}>
            {Array.from({length: 18}, (_, i) => (
              <div key={i} style={{width: 24, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.22)', flexShrink: 0}} />
            ))}
          </div>
        ))}
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 96, height: 96, marginLeft: -48, marginTop: -48, borderRadius: 48, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="play" size={40} color={C.ink} fill={C.ink} stroke={1} />
        </div>
        <div style={{position: 'absolute', left: 26, bottom: 70, fontFamily: F.mono, fontSize: 15, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.85)'}}>SCENE 12 · TAKE 3</div>
      </Box>
    </>
  );
};

const SCorporate: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  const tc = Math.max(0, t - t0);
  const ss = Math.floor(tc) + 14;
  const ff = Math.floor((tc % 1) * 30);
  return (
    <>
      <Box x={0} y={0} w={760} h={507} style={{boxShadow: shadow, ...rise(t, t0)}}>
        <Img src={staticFile('photos/collage-event-stage.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.04 + tc * 0.025})`}} />
        <div style={{position: 'absolute', left: 20, top: 18, display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 10, background: 'rgba(7,8,22,0.7)', color: '#fff', fontFamily: F.mono, fontSize: 16, letterSpacing: '0.08em'}}>
          <div style={{width: 12, height: 12, borderRadius: 6, background: '#FF4D5E', opacity: Math.floor(t * 2.5) % 2 ? 1 : 0.35}} />
          REC 00:00:{String(ss).padStart(2, '0')}:{String(ff).padStart(2, '0')}
        </div>
        {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
          <div
            key={c}
            style={{
              position: 'absolute',
              width: 44,
              height: 44,
              [c[0] === 't' ? 'top' : 'bottom']: 64,
              [c[1] === 'l' ? 'left' : 'right']: 70,
              borderTop: c[0] === 't' ? '4px solid #fff' : undefined,
              borderBottom: c[0] === 'b' ? '4px solid #fff' : undefined,
              borderLeft: c[1] === 'l' ? '4px solid #fff' : undefined,
              borderRight: c[1] === 'r' ? '4px solid #fff' : undefined,
              opacity: 0.85,
            }}
          />
        ))}
      </Box>
      <Box x={790} y={0} w={390} h={261} style={{boxShadow: shadow, ...rise(t, t0 + 0.08)}}>
        <At t={t0 - 0.1}>
          <Media src="videos/corporate-portrait-result-bts.mp4" />
        </At>
      </Box>
      <Box x={790} y={281} w={390} h={226} style={{boxShadow: shadow, padding: '22px 24px', boxSizing: 'border-box', ...rise(t, t0 + 0.16)}}>
        <Label size={13} color={C.muted}>
          Dokumentasi
        </Label>
        {['Foto acara', 'Video highlight', 'Portrait eksekutif'].map((s, i) => {
          const p = prog(t, t0 + 0.35 + i * 0.22, 0.35, ease.outBackStrong);
          return (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, fontFamily: F.display, fontWeight: 700, fontSize: 21, color: C.ink}}>
              <div style={{width: 30, height: 30, borderRadius: 15, background: p > 0 ? GRAD : 'rgba(7,8,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${mix(0.6, 1, p)})`}}>
                <Icon name="check" size={18} color="#fff" stroke={3} />
              </div>
              {s}
            </div>
          );
        })}
      </Box>
    </>
  );
};

const SReels: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  const thumbs = ['photos/varsity-hallway-vertical.jpg', 'photos/street-girl-selfie.jpg', 'photos/fashion-girl-phones.jpg'];
  return (
    <>
      <div style={{position: 'absolute', left: 30, top: 0, ...rise(t, t0)}}>
        <PhoneFrame w={262}>
          <At t={t0 - 0.1}>
            <Media src="videos/reel-studio-campus.mp4" trim={2} />
          </At>
          <div style={{position: 'absolute', right: 12, bottom: 90, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center'}}>
            {['heart', 'comment', 'share'].map((n) => (
              <Icon key={n} name={n} size={30} color="#fff" fill={n === 'heart' ? '#fff' : undefined} stroke={2} />
            ))}
          </div>
          <div style={{position: 'absolute', left: 14, bottom: 24, right: 70}}>
            <div style={{height: 10, width: '70%', borderRadius: 5, background: 'rgba(255,255,255,0.9)'}} />
            <div style={{height: 8, width: '90%', borderRadius: 4, background: 'rgba(255,255,255,0.6)', marginTop: 8}} />
          </div>
        </PhoneFrame>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <FloatHeart key={k} t0={t0 + 0.2 + k * 0.13} x={200 + (k % 3) * 16} y={420} size={34} color={k % 2 ? C.violetMid : C.blueMid} drift={k - 2.5} />
        ))}
      </div>
      {thumbs.map((src, i) => (
        <Box key={src} x={350 + i * 276} y={60} w={250} h={444} r={22} style={{boxShadow: shadow, ...rise(t, t0 + 0.08 + i * 0.07)}}>
          <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          <div style={{position: 'absolute', left: 14, bottom: 14, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'rgba(7,8,22,0.6)', color: '#fff', fontFamily: F.mono, fontSize: 14}}>
            <Icon name="play" size={14} color="#fff" fill="#fff" stroke={1} /> REEL 0{i + 1}
          </div>
        </Box>
      ))}
    </>
  );
};

const SPhoto: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  const shots = ['photos/collage-studio-blue-portrait.jpg', 'photos/collage-ponytail-studio.jpg', 'photos/collage-library-portrait.jpg', 'photos/collage-corporate-portrait.jpg'];
  const cur = Math.min(3, Math.max(0, Math.floor((t - t0) / 0.17)));
  return (
    <>
      {shots.map((src, i) => {
        const ti = t0 + i * 0.17;
        const flash = t > ti && t < ti + 0.16 ? 1 - (t - ti) / 0.16 : 0;
        return (
          <Box key={src} x={i * 302} y={0} w={276} h={414} style={{boxShadow: shadow, ...rise(t, ti, 0.4, 24)}}>
            <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />
          </Box>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: cur * 302 - 10,
          top: -10,
          width: 296,
          height: 434,
          border: `4px solid ${C.violetMid}`,
          borderRadius: 24,
          opacity: prog(t, t0, 0.2),
        }}
      />
      <div style={{position: 'absolute', left: 0, top: 444, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...rise(t, t0 + 0.2)}}>
        <div style={{fontFamily: F.mono, fontSize: 19, letterSpacing: '0.1em', color: C.ink}}>ISO 100 · f/2.8 · 1/125s · RAW</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 19, color: C.muted}}>
          <Icon name="camera" size={26} color={C.blueMid} stroke={2} /> IMG_{String(142 + cur).padStart(4, '0')}
        </div>
      </div>
    </>
  );
};

const SProduct: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  const on = (d: number) => prog(t, t0 + d, 0.12, ease.linear) * (0.85 + 0.15 * Math.sin(t * 40 + d * 9));
  return (
    <>
      <Box x={0} y={0} w={760} h={507} style={{boxShadow: shadow, ...rise(t, t0)}}>
        <Img src={staticFile('photos/collage-perfume-product.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.03 + (t - t0) * 0.03})`}} />
      </Box>
      <Box
        x={790}
        y={0}
        w={390}
        h={260}
        style={{boxShadow: shadow, ...rise(t, t0 + 0.08), transform: `${rise(t, t0 + 0.08).transform} perspective(900px) rotateY(${mix(-35, 0, prog(t, t0 + 0.08, 0.7, ease.outExpo))}deg)`}}
      >
        <Img src={staticFile('photos/product-kahf-red.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Box>
      <Box x={790} y={280} w={390} h={227} style={{boxShadow: shadow, background: C.ink, ...rise(t, t0 + 0.16)}}>
        <svg width={390} height={227} viewBox="0 0 390 227">
          <defs>
            <linearGradient id="cone" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity={0.5} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* key light */}
          <g transform="translate(70 70) rotate(30)" opacity={on(0.25)}>
            <path d="M18 -10 L170 -50 L170 50 L18 10 Z" fill="url(#cone)" />
          </g>
          <rect x={36} y={42} width={44} height={60} rx={6} fill={C.blueMid} transform="rotate(30 58 72)" />
          {/* rim light */}
          <g transform="translate(330 70) rotate(150)" opacity={on(0.4)}>
            <path d="M18 -10 L150 -40 L150 40 L18 10 Z" fill="url(#cone)" />
          </g>
          <rect x={310} y={44} width={40} height={54} rx={6} fill={C.violetMid} transform="rotate(-30 330 71)" />
          <circle cx={195} cy={130} r={22} fill="#C8202F" stroke="#fff" strokeWidth={3} />
          <rect x={177} y={190} width={36} height={24} rx={5} fill="#fff" />
          <circle cx={195} cy={202} r={7} fill={C.ink} />
          <text x={40} y={130} fill={C.blueLight} style={{fontFamily: F.mono, fontSize: 13, letterSpacing: '0.1em'}}>
            KEY
          </text>
          <text x={318} y={126} fill={C.violetLight} style={{fontFamily: F.mono, fontSize: 13, letterSpacing: '0.1em'}}>
            RIM
          </text>
          <text x={222} y={208} fill="rgba(255,255,255,0.7)" style={{fontFamily: F.mono, fontSize: 13, letterSpacing: '0.1em'}}>
            CAM
          </text>
        </svg>
      </Box>
    </>
  );
};

// ---------------- the content wall ----------------
type Tile = {col: number; y: number; h: number; kind: 'photo' | 'text' | 'video' | 'window'; src?: string; label?: string; icon?: string; style?: number};
const COL_W = 405;
const GAP = 26;
const WALL_PHOTOS = [
  'photos/collage-varsity-hallway.jpg',
  'photos/collage-group-blue.jpg',
  'photos/group-four-grey.jpg',
  'photos/varsity-backpack.jpg',
  'photos/street-duo-02.jpg',
  'photos/varsity-hallway-vertical.jpg',
  'photos/collage-event-stage.jpg',
  'photos/collage-studio-blue-portrait.jpg',
  'photos/campaign-kahf-jalan-yang-kupilih.jpg',
  'photos/collage-perfume-product.jpg',
  'photos/collage-library-portrait.jpg',
  'photos/product-kahf-red.jpg',
  'photos/collage-ponytail-studio.jpg',
  'photos/poster-lara-bisu.jpg',
  'photos/collage-corporate-portrait.jpg',
  'photos/street-duo-03.jpg',
  'photos/fashion-hijab-cap.jpg',
  'photos/street-girl-sit.jpg',
];
const TEXT_TILES: [string, string][] = [
  ['Company Deck', 'doc'],
  ['Annual Report', 'chart'],
  ['Event Recap', 'calendar'],
  ['Employer Branding', 'users'],
  ['Product Launch', 'rocket'],
  ['Konten Harian', 'phone'],
  ['Testimoni', 'chat'],
  ['Campaign Launch', 'megaphone'],
];
const HEIGHTS = [300, 230, 380, 260, 330, 210, 360, 280];
const WALL: Tile[] = (() => {
  const tiles: Tile[] = [];
  let pi = 0;
  let ti = 0;
  let vi = 0;
  const next = (col: number, y: number, h: number, salt: number): Tile => {
    const r = rand(col * 31 + salt, 9);
    if (r < 0.24) {
      const [label, icon] = TEXT_TILES[ti++ % TEXT_TILES.length];
      return {col, y, h: Math.min(h, 260), kind: 'text', label, icon, style: ti % 3};
    }
    if (r > 0.92 && vi < 2) {
      vi++;
      return {col, y, h: 270, kind: 'video', src: vi === 1 ? 'videos/studio-portrait-result-bts.mp4' : 'videos/corporate-meeting-result-bts.mp4'};
    }
    return {col, y, h, kind: 'photo', src: WALL_PHOTOS[pi++ % WALL_PHOTOS.length]};
  };
  for (let col = -3; col <= 3; col++) {
    if (col === 0) {
      tiles.push({col, y: -105, h: 210, kind: 'window'});
      let y = -105 - GAP;
      for (let k = 0; y > -1500; k++) {
        const h = HEIGHTS[(k * 3 + 1) % HEIGHTS.length];
        const tile = next(col, y - h, h, -k - 1);
        tile.y = y - tile.h;
        tiles.push(tile);
        y = tile.y - GAP;
      }
      y = 105 + GAP;
      for (let k = 0; y < 1500; k++) {
        const h = HEIGHTS[(k * 5 + 2) % HEIGHTS.length];
        const tile = next(col, y, h, k + 40);
        tiles.push(tile);
        y += tile.h + GAP;
      }
      continue;
    }
    let y = -1550 + (Math.abs(col) % 2) * 140 + rand(col, 2) * 60;
    for (let k = 0; y < 1550; k++) {
      const h = HEIGHTS[(k + col * 3 + 16) % HEIGHTS.length];
      const tile = next(col, y, h, k);
      tiles.push(tile);
      y += tile.h + GAP;
    }
  }
  return tiles;
})();

const TileFace: React.FC<{tile: Tile}> = ({tile}) => {
  if (tile.kind === 'photo') return <Img src={staticFile(tile.src!)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;
  if (tile.kind === 'video')
    return (
      <At t={30.3}>
        <Media src={tile.src!} />
      </At>
    );
  const st = tile.style ?? 0;
  const bg = st === 0 ? GRAD_MID : st === 1 ? '#fff' : C.ink;
  const fg = st === 1 ? C.ink : '#fff';
  return (
    <div style={{width: '100%', height: '100%', background: bg, padding: 30, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div style={{width: 64, height: 64, borderRadius: 18, background: st === 1 ? C.blueSoft : 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon name={tile.icon!} size={34} color={st === 1 ? C.blueMid : '#fff'} stroke={2.1} />
      </div>
      <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 40, lineHeight: 1.02, letterSpacing: '-0.035em', color: fg}}>{tile.label}</div>
    </div>
  );
};

// "Mulai dari company profile, … product photography, hingga berbagai kebutuhan konten untuk perusahaan dan organisasi."
export const A03Services: React.FC = () => {
  const t = useT();
  const svc: Svc[] = [
    {name: 'Company Profile', slug: 'company-profile', icon: 'building', t0: at(8, 'company')},
    {name: 'Digital Campaign', slug: 'digital-campaign', icon: 'megaphone', t0: at(9, 'digital')},
    {name: 'Short Film', slug: 'short-film', icon: 'film', t0: at(10, 'short')},
    {name: 'Corporate Documentation', slug: 'corporate-documentation', icon: 'camera', t0: at(10, 'corporate')},
    {name: 'Reels Production', slug: 'reels-production', icon: 'phone', t0: at(11, 'reels')},
    {name: 'Photoshoot', slug: 'photoshoot', icon: 'image', t0: at(11, 'photoshoot')},
    {name: 'Product Photography', slug: 'product-photography', icon: 'tag', t0: at(12, 'product')},
  ];
  const END_SVC = 30.35;
  const clicks = svc.map((s) => s.t0 - 0.09);
  const hingga = at(13, 'hingga');
  const kebutuhan = at(13, 'kebutuhan');
  const konten = at(13, 'konten');
  const perusahaan = at(13, 'perusahaan');
  const organisasi = at(14, 'organisasi');

  let cur = -1;
  clicks.forEach((c, i) => {
    if (t >= c) cur = i;
  });

  // ---------------- camera ----------------
  const camLog = kf(t, [
    [22.0, Math.log(26)],
    [22.52, Math.log(4), ease.outExpo],
    [END_SVC, Math.log(4)],
    [31.55, Math.log(1.12), ease.inOutExpo],
    [34.9, Math.log(0.92), ease.linear],
  ]);
  const punch = clicks.reduce((a, c) => a + bump(t, c + 0.03, 0.4), 0) * 0.025;
  const cam = Math.exp(camLog) * (1 + punch);
  const fx = kf(t, [
    [22.0, 50],
    [22.52, 0, ease.outExpo],
  ]) + Math.sin(t * 0.8) * 2 * (t < END_SVC ? 1 : 0);
  const fy = kf(t, [
    [22.0, 22],
    [22.52, 0, ease.outExpo],
  ]) + Math.cos(t * 0.6) * 1.5 * (t < END_SVC ? 1 : 0);
  const rot = kf(t, [
    [END_SVC, 0],
    [31.55, -6, ease.inOutExpo],
  ]);

  // ---------------- wall ----------------
  const wallOn = t > END_SVC - 0.05;
  const flipStart = 33.98;
  const inkBg = prog(t, 34.6, 0.4, ease.inOutCubic);

  // indicator follows the active service
  const indKeys: Key[] = [[clicks[0], 0]];
  for (let i = 1; i < clicks.length; i++) {
    indKeys.push([clicks[i], i - 1]);
    indKeys.push([clicks[i] + 0.28, i, ease.outBackStrong]);
  }
  const indY = kf(t, indKeys);

  // header title roll
  const title = (i: number) => {
    const s = svc[i];
    const pin = prog(t, clicks[i] + 0.1, 0.4, ease.outExpo);
    const pout = i < svc.length - 1 ? prog(t, clicks[i + 1], 0.16, ease.inCubic) : 0;
    if (t < clicks[i] || pout >= 1) return null;
    return (
      <div key={s.slug} style={{position: 'absolute', left: 0, top: 0, opacity: clamp01(pin * 2) * (1 - pout), transform: `translateY(${(1 - pin) * 112 - pout * 112}px)`}}>
        <div style={{fontFamily: F.mono, fontSize: 15, letterSpacing: '0.08em', color: C.muted}}>
          Layanan / <span style={{color: C.blueMid}}>{s.slug}</span>
        </div>
        <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 66, letterSpacing: '-0.045em', color: C.ink, marginTop: 6, whiteSpace: 'nowrap'}}>{s.name}</div>
      </div>
    );
  };

  const windowEl = (
    <div style={{position: 'relative', width: WIN_W, height: WIN_H, borderRadius: 30, background: '#fff', overflow: 'hidden', boxShadow: '0 50px 120px rgba(20,16,65,0.22), 0 6px 18px rgba(20,16,65,0.08)'}}>
      {/* title bar */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 56, borderBottom: `1.5px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '0 24px'}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: 'rgba(7,8,22,0.12)', marginRight: 9}} />
        ))}
        <div style={{flex: 1, textAlign: 'center', fontFamily: F.display, fontWeight: 700, fontSize: 18, color: C.muted}}>Ruber Studio</div>
        <div style={{display: 'flex', marginRight: 16}}>
          {['photos/street-girl-portrait.jpg', 'photos/fashion-hijab-cap.jpg', 'photos/street-boy-bag.jpg'].map((src, i) => (
            <div key={src} style={{width: 34, height: 34, borderRadius: 17, overflow: 'hidden', border: '2.5px solid #fff', marginLeft: i ? -10 : 0}}>
              <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          ))}
        </div>
        <div style={{padding: '8px 18px', borderRadius: 12, border: `1.5px solid ${C.line}`, fontFamily: F.display, fontWeight: 700, fontSize: 16, color: C.ink, marginRight: 10}}>Brief</div>
        <div style={{padding: '9px 18px', borderRadius: 12, background: GRAD, fontFamily: F.display, fontWeight: 700, fontSize: 16, color: '#fff'}}>Mulai Project</div>
      </div>
      {/* sidebar */}
      <div style={{position: 'absolute', left: 0, top: 56, width: SIDE_W, bottom: 0, background: '#F7F8FC', borderRight: `1.5px solid ${C.line}`}}>
        <div style={{position: 'absolute', left: 26, top: 26, display: 'flex', alignItems: 'center', gap: 12}}>
          <RuberMark size={34} color={C.ink} />
          <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', color: C.ink}}>Ruber Studio</div>
        </div>
        <div style={{position: 'absolute', left: 22, right: 22, top: 88, height: 46, borderRadius: 12, background: '#fff', border: `1.5px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px'}}>
          <Icon name="target" size={20} color={C.muted} stroke={2} />
          <div style={{flex: 1, fontFamily: F.display, fontSize: 16, color: C.muted}}>Cari layanan…</div>
          <div style={{fontFamily: F.mono, fontSize: 13, color: C.muted, padding: '2px 7px', borderRadius: 6, border: `1.5px solid ${C.line}`}}>⌘K</div>
        </div>
        <div style={{position: 'absolute', left: 26, top: 158, fontFamily: F.mono, fontSize: 13, letterSpacing: '0.14em', color: C.muted}}>LAYANAN</div>
        {/* active indicator */}
        {cur >= 0 ? (
          <div style={{position: 'absolute', left: 14, right: 14, top: 184 + indY * 62, height: 54, borderRadius: 14, background: GRAD_MID, boxShadow: '0 10px 24px rgba(47,73,198,0.35)'}} />
        ) : null}
        {svc.map((s, i) => {
          const active = i === cur;
          const done = i < cur;
          return (
            <div key={s.slug} style={{position: 'absolute', left: 26, right: 26, top: 184 + i * 62, height: 54, display: 'flex', alignItems: 'center', gap: 14}}>
              <Icon name={s.icon} size={24} color={active ? '#fff' : C.blueMid} stroke={2.1} />
              <div style={{flex: 1, fontFamily: F.display, fontWeight: active ? 800 : 600, fontSize: 19, letterSpacing: '-0.015em', color: active ? '#fff' : C.ink}}>{s.name}</div>
              {done ? (
                <div style={{width: 22, height: 22, borderRadius: 11, background: C.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="check" size={14} color={C.blueMid} stroke={3} />
                </div>
              ) : null}
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 22, right: 22, bottom: 22, height: 76, borderRadius: 16, background: '#fff', border: `1.5px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px'}}>
          <div style={{width: 44, height: 44, borderRadius: 22, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name="users" size={24} color="#fff" stroke={2} />
          </div>
          <div style={{flex: 1}}>
            <div style={{fontFamily: F.display, fontWeight: 800, fontSize: 17, color: C.ink}}>Tim Ruber</div>
            <div style={{fontFamily: F.display, fontWeight: 500, fontSize: 14, color: C.muted}}>Creative · Production</div>
          </div>
          <div style={{width: 12, height: 12, borderRadius: 6, background: '#22C55E'}} />
        </div>
      </div>
      {/* header */}
      <div style={{position: 'absolute', left: 400, top: 84, right: 40, height: 108, overflow: 'hidden'}}>{svc.map((_, i) => title(i))}</div>
      <div style={{position: 'absolute', left: 400, top: 196, display: 'flex', gap: 28, fontFamily: F.display, fontWeight: 700, fontSize: 17, color: C.muted}}>
        {['Overview', 'Media', 'Timeline', 'Deliverables'].map((tab, i) => (
          <div key={tab} style={{color: i === 1 ? C.ink : C.muted, paddingBottom: 8, borderBottom: i === 1 ? `3px solid ${C.blueMid}` : '3px solid transparent'}}>
            {tab}
          </div>
        ))}
      </div>
      {/* content */}
      <Slot t0={svc[0].t0} t1={clicks[1]}>
        <SCompany t0={svc[0].t0} />
      </Slot>
      <Slot t0={svc[1].t0} t1={clicks[2]}>
        <SDigital t0={svc[1].t0} />
      </Slot>
      <Slot t0={svc[2].t0} t1={clicks[3]}>
        <SShort t0={svc[2].t0} />
      </Slot>
      <Slot t0={svc[3].t0} t1={clicks[4]}>
        <SCorporate t0={svc[3].t0} />
      </Slot>
      <Slot t0={svc[4].t0} t1={clicks[5]}>
        <SReels t0={svc[4].t0} />
      </Slot>
      <Slot t0={svc[5].t0} t1={clicks[6]}>
        <SPhoto t0={svc[5].t0} />
      </Slot>
      <Slot t0={svc[6].t0} t1={99}>
        <SProduct t0={svc[6].t0} />
      </Slot>
      {/* cursor */}
      {t < END_SVC + 0.3 ? (
        <Cursor
          size={40}
          path={[
            {t: 22.25, x: 760, y: 470},
            ...clicks.flatMap((c, i) => [
              {t: c - 0.22, x: 175 + (i % 2) * 18, y: 184 + i * 62 + 27},
              {t: c, x: 175 + (i % 2) * 18, y: 184 + i * 62 + 27, click: true},
            ]),
            {t: 29.8, x: 760, y: 520},
          ]}
        />
      ) : null}
    </div>
  );

  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 6, y: 12, r: 300, color: C.blueSoft, seed: 's1'},
          {x: 94, y: 90, r: 360, color: C.violetSoft, seed: 's2'},
        ]}
      />
      <DotGrid color="rgba(7,8,22,0.09)" gap={38} opacity={0.5} />
      <AbsoluteFill style={{background: C.ink, opacity: inkBg}} />
      {/* ink spreads behind the tiles right behind the flip wave */}
      {t > flipStart
        ? (() => {
            const r = Math.max(0, ((t - flipStart - 0.16) / 0.55) * 1500 * cam);
            return <div style={{position: 'absolute', left: SCREEN_C[0] - r, top: SCREEN_C[1] - r, width: r * 2, height: r * 2, borderRadius: '50%', background: C.ink}} />;
          })()
        : null}

      {/* camera: wall space → screen */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate(${SCREEN_C[0]}px, ${SCREEN_C[1]}px) rotate(${rot}deg) scale(${cam}) translate(${-fx}px, ${-fy}px)`,
          transformOrigin: '0 0',
        }}
      >
        {WALL.map((tile, i) => {
          const cx = tile.col * (COL_W + GAP);
          const scroll = tile.col === 0 ? -Math.max(0, t - 31.4) * 14 : (tile.col % 2 ? 1 : -1) * Math.max(0, t - END_SVC) * (26 + Math.abs(tile.col) * 6);
          const y = tile.y + scroll;
          const d = Math.hypot(cx, y + tile.h / 2);
          const appear = tile.kind === 'window' ? 1 : prog(t, END_SVC + 0.1 + d / 2200, 0.55, ease.outBackStrong);
          if (!wallOn && tile.kind !== 'window') return null;
          if (appear <= 0) return null;
          const fl = prog(t, flipStart + d / 1500 * 0.55, 0.42, ease.inOutCubic);
          const ang = fl * 180;
          const back = ang > 90;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: cx - COL_W / 2,
                top: y,
                width: COL_W,
                height: tile.h,
                transform: `perspective(1400px) rotateY(${ang}deg) scale(${appear})`,
                zIndex: tile.kind === 'window' ? 5 : 1,
              }}
            >
              {back ? (
                <div style={{width: '100%', height: '100%', borderRadius: 16, background: C.ink, transform: 'scaleX(-1)'}} />
              ) : tile.kind === 'window' ? (
                <div style={{width: COL_W, height: tile.h, borderRadius: mix(0, 16, prog(t, END_SVC, 0.6))}}>
                  <div style={{transform: `scale(${TILE_K})`, transformOrigin: '0 0'}}>{windowEl}</div>
                </div>
              ) : (
                <div style={{width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: `0 16px 40px rgba(20,16,65,${0.16 * (1 - inkBg)})`}}>
                  <TileFace tile={tile} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* "berbagai kebutuhan konten untuk perusahaan dan organisasi" */}
      {t > hingga - 0.1 && t < 34.3
        ? (() => {
            const pin = prog(t, hingga - 0.05, 0.55, ease.outExpo);
            const pout = prog(t, 33.95, 0.32, ease.inCubic);
            return (
              <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center', zIndex: 50}}>
                <div
                  style={{
                    padding: '26px 54px 30px',
                    borderRadius: 40,
                    background: 'rgba(255,255,255,0.94)',
                    boxShadow: '0 30px 80px rgba(20,16,65,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: clamp01(pin * 2) * (1 - pout),
                    transform: `translateY(${(1 - pin) * -40}px) scale(${mix(0.9, 1, pin) * mix(1, 0.85, pout)})`,
                  }}
                >
                  <Label size={22} color={C.blueMid}>
                    <W t={hingga}>hingga berbagai</W>
                  </Label>
                  <H size={92} style={{marginTop: 4}}>
                    <W t={kebutuhan}>kebutuhan </W>
                    <W t={konten} look="serif" style={{fontSize: '1.18em'}}>
                      konten
                    </W>
                  </H>
                  <div style={{display: 'flex', gap: 18, marginTop: 14, height: 66}}>
                    {[
                      {t0: perusahaan, icon: 'building', text: 'perusahaan', grad: true},
                      {t0: organisasi, icon: 'users', text: 'organisasi', grad: false},
                    ].map((c) => {
                      const p = prog(t, c.t0, 0.45, ease.outBackStrong);
                      return (
                        <div
                          key={c.text}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 26px',
                            borderRadius: 999,
                            background: c.grad ? GRAD : C.ink,
                            color: '#fff',
                            fontFamily: F.display,
                            fontWeight: 800,
                            fontSize: 32,
                            letterSpacing: '-0.02em',
                            transform: `scale(${p})`,
                            opacity: clamp01(p * 3),
                          }}
                        >
                          <Icon name={c.icon} size={32} color="#fff" stroke={2.2} />
                          {c.text}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()
        : null}
    </AbsoluteFill>
  );
};
