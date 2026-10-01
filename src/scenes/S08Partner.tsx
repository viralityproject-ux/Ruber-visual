import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {LogoLockup} from '../components/Logo';
import {Center, Media, Pill} from '../components/UI';
import {useLayout, useT} from '../lib/scene';
import {bump, ease, mix, n2, prog, spr} from '../lib/anim';

type Shot = {src: string; x: number; y: number; r: number; w: number; pos?: string};

const LAND: Shot[] = [
  {src: 'photos/street-jump.jpg', x: 11, y: 26, r: -9, w: 290},
  {src: 'photos/fashion-girl-pink.jpg', x: 28, y: 13, r: 5, w: 240},
  {src: 'photos/product-kahf-red.jpg', x: 73, y: 12, r: -4, w: 330},
  {src: 'photos/fashion-trio.jpg', x: 90, y: 28, r: 8, w: 270},
  {src: 'photos/fashion-hijab-orange.jpg', x: 9, y: 76, r: 6, w: 260},
  {src: 'photos/campaign-kahf-jalan-yang-kupilih.jpg', x: 27, y: 88, r: -6, w: 250},
  {src: 'photos/street-duo-02.jpg', x: 72, y: 88, r: 5, w: 290},
  {src: 'photos/fashion-girl-phones.jpg', x: 91, y: 74, r: -8, w: 250},
];
const PORT: Shot[] = [
  {src: 'photos/street-jump.jpg', x: 18, y: 12, r: -9, w: 300},
  {src: 'photos/product-kahf-red.jpg', x: 72, y: 9, r: 5, w: 380},
  {src: 'photos/fashion-girl-pink.jpg', x: 86, y: 25, r: 8, w: 250},
  {src: 'photos/fashion-trio.jpg', x: 14, y: 30, r: -4, w: 250},
  {src: 'photos/fashion-hijab-orange.jpg', x: 16, y: 72, r: 6, w: 270},
  {src: 'photos/campaign-kahf-jalan-yang-kupilih.jpg', x: 84, y: 74, r: -6, w: 270},
  {src: 'photos/street-duo-02.jpg', x: 30, y: 90, r: 5, w: 300},
  {src: 'photos/fashion-girl-phones.jpg', x: 74, y: 91, r: -8, w: 250},
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
              top: y - cw * 0.625,
              width: cw,
              height: cw * 1.25,
              borderRadius: 22 * u,
              overflow: 'hidden',
              transform: `scale(${sc}) rotate(${s.r + n2('pr' + i, t * 0.3) * 3}deg) perspective(1200px) rotateY(${mix(dx > 0 ? -40 : 40, 0, p)}deg)`,
              boxShadow: `0 ${30 * u}px ${60 * u}px rgba(30,20,90,0.28)`,
              border: `${6 * u}px solid #fff`,
              opacity: Math.min(1, p * 3),
              filter: p < 0.6 ? `blur(${(0.6 - p) * 20}px)` : undefined,
            }}
          >
            <Media src={s.src} />
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
