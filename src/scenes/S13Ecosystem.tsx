import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {InkBg} from '../components/Backgrounds';
import {H, W, at} from '../components/Text';
import {Media} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {between, bump, ease, mix, n2, prog} from '../lib/anim';

type Node = {kind: 'photo' | 'avatar' | 'icon' | 'tag'; v: string; ring: 0 | 1 | 2; a: number};

const NODES: Node[] = [
  {kind: 'photo', v: 'photos/fashion-trio.jpg', ring: 0, a: 0.2},
  {kind: 'icon', v: 'heart', ring: 0, a: 1.25},
  {kind: 'avatar', v: 'photos/street-boy-lowangle.jpg', ring: 0, a: 2.2},
  {kind: 'tag', v: 'audience', ring: 0, a: 3.1},
  {kind: 'photo', v: 'photos/fashion-hijab-purple.jpg', ring: 0, a: 4.05},
  {kind: 'icon', v: 'comment', ring: 0, a: 5.1},
  {kind: 'tag', v: 'creator', ring: 1, a: 0.65},
  {kind: 'photo', v: 'photos/street-duo-01.jpg', ring: 1, a: 1.6},
  {kind: 'icon', v: 'share', ring: 1, a: 2.55},
  {kind: 'avatar', v: 'photos/fashion-girl-pink.jpg', ring: 1, a: 3.5},
  {kind: 'tag', v: 'community', ring: 1, a: 4.4},
  {kind: 'photo', v: 'photos/fashion-group-barrier.jpg', ring: 1, a: 5.45},
  {kind: 'icon', v: 'chart', ring: 2, a: 0.1},
  {kind: 'tag', v: 'trend', ring: 2, a: 1.05},
  {kind: 'avatar', v: 'photos/fashion-hijab-cap.jpg', ring: 2, a: 1.95},
  {kind: 'icon', v: 'megaphone', ring: 2, a: 2.85},
  {kind: 'tag', v: 'brand', ring: 2, a: 3.8},
  {kind: 'avatar', v: 'photos/street-girl-portrait.jpg', ring: 2, a: 4.75},
  {kind: 'tag', v: 'insight', ring: 2, a: 5.7},
];

// "Tapi kami tidak hanya memproduksi konten, kami juga hidup di dalam ekosistemnya."
export const S13Ecosystem: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const konten = at(15, 'konten');
  const kami2 = at(15, 'kami', 1);
  const eko = at(15, 'ekosistemnya');
  const zoomOut = between(t, kami2 - 0.2, at(15, 'dalam') + 0.2, ease.inOutCubic);
  const s = mix(1, portrait ? 0.52 : 0.48, zoomOut);
  const cw = 480 * u;
  const ch = 600 * u;
  const rx = (portrait ? [880, 1300, 1700] : [1050, 1600, 2150]).map((r) => r * u);
  const ry = (portrait ? [1150, 1650, 2150] : [700, 1050, 1400]).map((r) => r * u);
  const like = prog(t, konten, 0.45, ease.outBackStrong);
  const cx = w / 2;
  const cy = h / 2 + (portrait ? 40 : 30) * u;
  const nodePos = (n: Node) => {
    const rot = t * (n.ring === 1 ? -0.06 : 0.05);
    const a = n.a + rot;
    return [Math.cos(a) * rx[n.ring], Math.sin(a) * ry[n.ring]];
  };
  const phase2 = t >= kami2 - 0.15;
  return (
    <AbsoluteFill>
      <InkBg glow={[[C.violet, 50, 50], [C.blue, 15, 10]]} />
      {/* world */}
      <div style={{position: 'absolute', left: cx, top: cy, transform: `scale(${s})`}}>
        {/* orbits */}
        {[0, 1, 2].map((r) => (
          <div
            key={r}
            style={{
              position: 'absolute',
              left: -rx[r],
              top: -ry[r],
              width: rx[r] * 2,
              height: ry[r] * 2,
              borderRadius: '50%',
              border: `${3 * u}px dashed rgba(179,145,255,${0.28 * zoomOut})`,
            }}
          />
        ))}
        {/* links */}
        <svg style={{position: 'absolute', left: -3000 * u, top: -3000 * u, overflow: 'visible'}} width={6000 * u} height={6000 * u}>
          {NODES.map((n, i) => {
            const ap = prog(t, kami2 + 0.1 + i * 0.05, 0.5, ease.outCubic);
            if (ap <= 0) return null;
            const [x, y] = nodePos(n);
            return (
              <line
                key={i}
                x1={3000 * u}
                y1={3000 * u}
                x2={3000 * u + x * ap}
                y2={3000 * u + y * ap}
                stroke={i % 2 ? C.violetLight : C.blueLight}
                strokeOpacity={0.35}
                strokeWidth={3 * u}
                strokeDasharray={`${18 * u} ${16 * u}`}
                strokeDashoffset={-t * 120 * u}
              />
            );
          })}
        </svg>
        {/* nodes */}
        {NODES.map((n, i) => {
          const ap = prog(t, kami2 + 0.15 + i * 0.05, 0.55, ease.outBackStrong);
          if (ap <= 0) return null;
          const [x, y] = nodePos(n);
          const fy = n2('nf' + i, t * 0.5) * 20 * u;
          const common: React.CSSProperties = {
            position: 'absolute',
            left: x,
            top: y + fy,
            transform: `translate(-50%, -50%) scale(${ap * (1 + bump(t, eko + i * 0.02, 0.4) * 0.15)})`,
          };
          if (n.kind === 'photo') {
            return (
              <div key={i} style={{...common, width: 300 * u, height: 375 * u, borderRadius: 30 * u, overflow: 'hidden', border: `${6 * u}px solid #fff`, boxShadow: `0 ${30 * u}px ${60 * u}px rgba(0,0,0,0.5)`}}>
                <Media src={n.v} />
              </div>
            );
          }
          if (n.kind === 'avatar') {
            return (
              <div key={i} style={{...common, width: 200 * u, height: 200 * u, borderRadius: '50%', overflow: 'hidden', border: `${8 * u}px solid ${C.violetLight}`}}>
                <Media src={n.v} pos="50% 25%" />
              </div>
            );
          }
          if (n.kind === 'icon') {
            return (
              <div key={i} style={{...common, width: 170 * u, height: 170 * u, borderRadius: '50%', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${60 * u}px rgba(123,60,255,0.6)`}}>
                <Icon name={n.v} size={84 * u} color="#fff" stroke={2} />
              </div>
            );
          }
          return (
            <div
              key={i}
              style={{
                ...common,
                padding: `${22 * u}px ${44 * u}px`,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.1)',
                border: `${3 * u}px solid rgba(255,255,255,0.3)`,
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 60 * u,
                color: '#fff',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              #{n.v}
            </div>
          );
        })}
        {/* the content piece we make */}
        <div
          style={{
            position: 'absolute',
            left: -cw / 2,
            top: -ch / 2,
            width: cw,
            height: ch,
            borderRadius: 36 * u,
            overflow: 'hidden',
            background: '#fff',
            boxShadow: `0 ${40 * u}px ${100 * u}px rgba(0,0,0,0.6), 0 0 ${120 * u * zoomOut}px rgba(123,60,255,${0.8 * zoomOut})`,
            transform: `scale(${prog(t, at(15, 'kami') - 0.1, 0.6, ease.outBackStrong)}) rotate(${mix(-6, 0, prog(t, at(15, 'kami') - 0.1, 0.8, ease.outExpo))}deg)`,
            border: `${zoomOut > 0.5 ? 10 * u : 0}px solid ${C.violetLight}`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 12 * u, padding: 18 * u}}>
            <div style={{width: 44 * u, height: 44 * u, borderRadius: '50%', background: GRAD}} />
            <div style={{fontFamily: F.display, fontWeight: 700, fontSize: 24 * u, color: C.ink}}>Ruber Visual</div>
          </div>
          <div style={{position: 'relative', height: ch - 160 * u}}>
            <Media src="photos/street-girl-selfie.jpg" pos="50% 40%" />
            {like > 0 ? (
              <div style={{position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${like * (1 - prog(t, konten + 0.6, 0.3))})`}}>
                <Icon name="heart" size={170 * u} color="#fff" fill="#fff" stroke={1} />
              </div>
            ) : null}
          </div>
          <div style={{display: 'flex', gap: 20 * u, padding: `${20 * u}px ${18 * u}px`}}>
            <Icon name="heart" size={38 * u} color={like > 0.5 ? C.violet : C.ink} fill={like > 0.5 ? C.violet : 'none'} stroke={2} />
            <Icon name="comment" size={38 * u} color={C.ink} stroke={2} />
            <Icon name="share" size={38 * u} color={C.ink} stroke={2} />
          </div>
        </div>
      </div>
      {/* legibility veils for the copy */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(7,7,15,${0.85 * zoomOut}) 0%, rgba(7,7,15,0) 26%, rgba(7,7,15,0) 70%, rgba(7,7,15,${0.9 * zoomOut}) 100%)`,
        }}
      />
      {/* copy */}
      <div style={{position: 'absolute', left: 0, right: 0, top: (portrait ? 150 : 70) * u, padding: `0 ${60 * u}px`}}>
        {!phase2 ? (
          <H size={portrait ? 70 : 72} color="#fff" weight={700} ls="-0.035em">
            <W t={at(15, 'tapi')} dark>
              Tapi{' '}
            </W>
            <W t={at(15, 'kami')} dark>
              kami{' '}
            </W>
            <W t={at(15, 'tidak')} dark>
              tidak{' '}
            </W>
            <W t={at(15, 'hanya')} dark>
              hanya
            </W>
          </H>
        ) : (
          <H size={portrait ? 70 : 72} color="#fff" weight={700} ls="-0.035em">
            <W t={kami2} dark>
              kami{' '}
            </W>
            <W t={at(15, 'juga')} dark>
              juga{' '}
            </W>
            <W t={at(15, 'hidup')} dark look="grad">
              hidup{' '}
            </W>
            <W t={at(15, 'di')} dark>
              di{' '}
            </W>
            <W t={at(15, 'dalam')} dark>
              dalam
            </W>
          </H>
        )}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: (portrait ? 170 : 60) * u, padding: `0 ${40 * u}px`}}>
        {!phase2 ? (
          <H size={portrait ? 88 : 90} color="#fff">
            <W t={at(15, 'memproduksi')} dark>
              memproduksi{' '}
            </W>
            <W t={konten} look="grad">
              konten,
            </W>
          </H>
        ) : (
          <H size={portrait ? 150 : 170} color="#fff">
            <W t={eko} look="serif">
              ekosistemnya.
            </W>
          </H>
        )}
      </div>
    </AbsoluteFill>
  );
};
