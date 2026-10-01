import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {DotGrid, InkBg, PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Bar, CheckBadge} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {between, bump, ease, mix, prog, shake, spr} from '../lib/anim';

const Row: React.FC<{t0: number; key0: number; icon: string; lead: string; word: string; width: number}> = ({
  t0,
  key0,
  icon,
  lead,
  word,
  width,
}) => {
  const t = useT();
  const {u} = useLayout();
  const s = spr(t, t0 - 0.12, 220, 17);
  const fill = prog(t, key0, 0.5, ease.outQuart);
  return (
    <div
      style={{
        width,
        display: 'flex',
        alignItems: 'center',
        gap: 30 * u,
        padding: `${26 * u}px ${36 * u}px`,
        borderRadius: 36 * u,
        background: '#fff',
        boxShadow: `0 ${24 * u}px ${60 * u}px rgba(40,30,110,0.14)`,
        transform: `translateX(${mix(-160, 0, s)}px) scale(${mix(0.85, 1, s) * (1 + bump(t, key0, 0.3) * 0.04)})`,
        opacity: Math.min(1, s * 2.5),
      }}
    >
      <div style={{width: 96 * u, height: 96 * u, borderRadius: 28 * u, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
        <Icon name={icon} size={52 * u} color="#fff" stroke={2} draw={t0} />
      </div>
      <div style={{flex: 1}}>
        <H size={84} align="left" lh={1}>
          <W t={t0} style={{color: C.muted, fontSize: '0.62em'}}>
            {lead}{' '}
          </W>
          <W t={key0} look="grad">
            {word}
          </W>
        </H>
        <Bar p={fill} h={10} style={{marginTop: 16 * u}} />
      </div>
      <CheckBadge t0={key0 + 0.2} size={64} />
    </div>
  );
};

// "Bukan untuk membuat proses menjadi panjang, justru untuk membuat eksekusinya lebih cepat, lebih rapi, dan lebih pasti."
export const S18Faster: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const bukan = at(21, 'bukan');
  const panjang = at(21, 'panjang');
  const justru = at(21, 'justru');
  const eks = at(21, 'eksekusinya');
  const stretch = between(t, at(21, 'proses') - 0.1, justru - 0.05, ease.inOutCubic);
  const snap = spr(t, justru, 260, 13);
  const phaseB = t >= justru + 0.18;
  const sk = shake(t, justru, 30, 0.45, 'snap');
  const barW = mix(w * 0.4, w * 3.2, stretch) * (1 - snap) + w * 0.18 * snap;
  const pan = stretch * w * 1.3 * (1 - snap);
  const weeks = 16;
  const rowW = (portrait ? 920 : 1100) * u;
  return (
    <AbsoluteFill style={{transform: `translate(${sk.x}px, ${sk.y}px)`}}>
      {!phaseB ? (
        <AbsoluteFill>
          <InkBg glow={[[C.blue, 20, 30], [C.violet, 80, 70]]} dots={false} />
          <DotGrid drift={-120 * stretch} />
          <div style={{position: 'absolute', left: 0, right: 0, top: (portrait ? 330 : 160) * u, textAlign: 'center'}}>
            <H size={portrait ? 66 : 72} color="#fff" weight={700} ls="-0.035em">
              <W t={bukan} dark>
                Bukan{' '}
              </W>
              <W t={at(21, 'untuk')} dark>
                untuk{' '}
              </W>
              <W t={at(21, 'membuat')} dark>
                membuat{' '}
              </W>
              {portrait ? <br /> : null}
              <W t={at(21, 'proses')} dark look="grad">
                proses{' '}
              </W>
              <W t={at(21, 'menjadi')} dark>
                menjadi
              </W>
            </H>
          </div>
          {/* the endless timeline */}
          <div style={{position: 'absolute', left: w * 0.3 - pan, top: h * 0.53, width: barW, height: 70 * u}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: `${2 * u}px solid rgba(255,255,255,0.15)`}} />
            {Array.from({length: weeks}, (_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${(i / weeks) * 100}%`,
                  width: `${(1 / weeks) * 100}%`,
                  top: 0,
                  bottom: 0,
                  borderRight: `${2 * u}px solid rgba(255,255,255,0.12)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: F.mono,
                  fontWeight: 700,
                  fontSize: 22 * u,
                  color: 'rgba(255,255,255,0.55)',
                  overflow: 'hidden',
                }}
              >
                W{i + 1}
              </div>
            ))}
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.62, textAlign: 'center'}}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: F.display,
                fontWeight: 800,
                fontSize: (portrait ? 190 : 210) * u,
                letterSpacing: `${mix(-0.04, 0.05, stretch)}em`,
                color: '#fff',
                transform: `scaleX(${mix(1, portrait ? 1.25 : 1.6, prog(t, panjang, 1.0, ease.outCubic))})`,
                opacity: prog(t, panjang - 0.05, 0.25),
                filter: t < panjang + 0.2 ? 'url(#mbx2)' : undefined,
              }}
            >
              panjang,
            </span>
          </div>
        </AbsoluteFill>
      ) : (
        <AbsoluteFill>
          <PaperBg
            blobs={[
              {x: 100, y: 0, r: 380, color: C.violet, seed: 'w'},
              {x: 0, y: 100, r: 380, color: C.blue, seed: 'x'},
            ]}
            blobOpacity={0.55}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 22 * u,
            }}
          >
            <Label size={30} color={C.violet}>
              <W t={justru}>justru </W>
              <W t={at(21, 'untuk', 1)}>untuk </W>
              <W t={at(21, 'membuat', 1)}>membuat</W>
            </Label>
            <H size={portrait ? 110 : 120} style={{marginBottom: 20 * u}}>
              <W t={eks}>eksekusinya</W>
            </H>
            <Row t0={at(21, 'lebih')} key0={at(21, 'cepat')} icon="bolt" lead="lebih" word="cepat," width={rowW} />
            <Row t0={at(21, 'lebih', 1)} key0={at(21, 'rapi')} icon="grid" lead="lebih" word="rapi," width={rowW} />
            <Row t0={at(21, 'dan')} key0={at(21, 'pasti')} icon="target" lead="dan lebih" word="pasti." width={rowW} />
          </div>
        </AbsoluteFill>
      )}
      {/* snap flash */}
      {(() => {
        const x = (t - justru - 0.1) / 0.2;
        return x > 0 && x < 1 ? <AbsoluteFill style={{background: '#fff', opacity: (1 - x) * 0.95}} /> : null;
      })()}
    </AbsoluteFill>
  );
};
