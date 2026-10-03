import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {LogoLockup} from '../components/Logo';
import {Center, Media, Pill} from '../components/UI';
import {useLayout, useT} from '../lib/scene';
import {bump, ease, mix, n2, prog, spr} from '../lib/anim';

// ar = height / width of the card (portrait 1.25, landscape 0.72)
type Shot = {src: string; x: number; y: number; r: number; w: number; ar?: number; pos?: string};

const LAND: Shot[] = [
  {src: 'photos/collage-library-portrait.jpg', x: 10, y: 27, r: -9, w: 270, pos: '55% 40%'},
  {src: 'photos/collage-varsity-hallway.jpg', x: 30, y: 12, r: 5, w: 380, ar: 0.72, pos: '40% 45%'},
  {src: 'photos/collage-perfume-product.jpg', x: 71, y: 12, r: -4, w: 390, ar: 0.72, pos: '55% 45%'},
  {src: 'photos/collage-ponytail-studio.jpg', x: 90, y: 28, r: 8, w: 260, pos: '50% 30%'},
  {src: 'photos/collage-studio-blue-portrait.jpg', x: 9, y: 75, r: 6, w: 260, pos: '50% 35%'},
  {src: 'photos/collage-event-stage.jpg', x: 29, y: 88, r: -6, w: 390, ar: 0.72, pos: '50% 55%'},
  {src: 'photos/collage-group-blue.jpg', x: 71, y: 88, r: 5, w: 390, ar: 0.72, pos: '50% 40%'},
  {src: 'photos/collage-corporate-portrait.jpg', x: 91, y: 74, r: -8, w: 250, pos: '50% 30%'},
];
const PORT: Shot[] = [
  {src: 'photos/collage-varsity-hallway.jpg', x: 24, y: 10, r: -7, w: 430, ar: 0.72, pos: '40% 45%'},
  {src: 'photos/collage-perfume-product.jpg', x: 76, y: 9, r: 5, w: 420, ar: 0.72, pos: '55% 45%'},
  {src: 'photos/collage-ponytail-studio.jpg', x: 86, y: 26, r: 8, w: 240, pos: '50% 30%'},
  {src: 'photos/collage-library-portrait.jpg', x: 14, y: 29, r: -4, w: 240, pos: '55% 40%'},
  {src: 'photos/collage-studio-blue-portrait.jpg', x: 15, y: 72, r: 6, w: 250, pos: '50% 35%'},
  {src: 'photos/collage-corporate-portrait.jpg', x: 85, y: 73, r: -6, w: 250, pos: '50% 30%'},
  {src: 'photos/collage-event-stage.jpg', x: 26, y: 90, r: 5, w: 430, ar: 0.72, pos: '50% 55%'},
  {src: 'photos/collage-group-blue.jpg', x: 75, y: 91, r: -7, w: 420, ar: 0.72, pos: '50% 40%'},
];

// "Ruber Visual hadir sebagai creative production partner"
export const S08Partner: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const ruber = at(7, 'ruber');
  const hadir = at(7, 'hadir');
  const creative = at(7, 'creative');
  const shots = portrait ? PORT : LAND;
  const push = bump(t, creative, 0.5);
  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 50, y: 50, r: 380, color: C.violetSoft, seed: 'j', wobble: 0.15},
          {x: 20, y: 50, r: 240, color: C.blueSoft, seed: 'k'},
          {x: 80, y: 50, r: 240, color: C.violetSoft, seed: 'l'},
        ]}
        blobOpacity={0.9}
      />
      {shots.map((s, i) => {
        const t0 = ruber - 0.35 + i * 0.055;
        const p = spr(t, t0, 140, 15);
        const cx = (s.x / 100) * w;
        const cy = (s.y / 100) * h;
        const dx = cx - w / 2;
        const dy = cy - h / 2;
        const out = 1.9;
        const x = mix(w / 2 + dx * out, cx, p) + n2('px' + i, t * 0.35) * 14 * u + dx * 0.04 * push;
        const y = mix(h / 2 + dy * out, cy, p) + n2('py' + i, t * 0.35) * 14 * u + dy * 0.04 * push;
        const sc = mix(2.2, 1, p) * (1 + 0.012 * (t - t0));
        const cw = s.w * u;
        return (
          <div
            key={s.src}
            style={{
              position: 'absolute',
              left: x - cw / 2,
              top: y - (cw * (s.ar ?? 1.25)) / 2,
              width: cw,
              height: cw * (s.ar ?? 1.25),
              borderRadius: 22 * u,
              overflow: 'hidden',
              transform: `scale(${sc}) rotate(${s.r + n2('pr' + i, t * 0.3) * 3}deg) perspective(1200px) rotateY(${mix(dx > 0 ? -40 : 40, 0, p)}deg)`,
              boxShadow: `0 ${30 * u}px ${60 * u}px rgba(30,20,90,0.28)`,
              border: `${6 * u}px solid #fff`,
              opacity: Math.min(1, p * 3),
              filter: p < 0.6 ? `blur(${(0.6 - p) * 20}px)` : undefined,
            }}
          >
            <Media src={s.src} pos={s.pos} />
          </div>
        );
      })}
      <Center>
        <div style={{transform: `scale(${1 + push * 0.04})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <LogoLockup height={portrait ? 170 : 190} t0={ruber - 0.1} dark={false} textDelay={0.2} />
          <Label size={30} color={C.muted} style={{marginTop: 46 * u}}>
            <W t={hadir}>hadir </W>
            <W t={at(7, 'sebagai')}>sebagai</W>
          </Label>
          <div style={{marginTop: 26 * u, transform: `scale(${prog(t, creative - 0.1, 0.45, ease.outBackStrong)})`}}>
            <Pill size={portrait ? 46 : 54} grad>
              <H size={portrait ? 46 : 54} color="#fff" weight={800} ls="-0.03em">
                <W t={creative}>creative </W>
                <W t={at(7, 'production')}>production </W>
                <W t={at(7, 'partner')} look="plain" style={{fontFamily: '"Instrument", serif', fontStyle: 'italic', fontWeight: 400, fontSize: '1.15em'}}>
                  partner
                </W>
              </H>
            </Pill>
          </div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};
