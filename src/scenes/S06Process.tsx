import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {noise2D} from '@remotion/noise';
import {C, F} from '../theme';
import {PaperBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {useLayout, useT} from '../lib/scene';
import {between, ease, mix, prog} from '../lib/anim';

/** Open smooth path through points. */
export const smoothOpen = (pts: [number, number][]) => {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

const Node: React.FC<{x: number; y: number; label: string; t0: number; active?: number}> = ({x, y, label, t0, active = 0}) => {
  const t = useT();
  const {u} = useLayout();
  const p = prog(t, t0, 0.5, ease.outBackStrong);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`}}>
      <div
        style={{
          width: 44 * u,
          height: 44 * u,
          borderRadius: '50%',
          background: active > 0.5 ? `linear-gradient(120deg, ${C.blue}, ${C.violet})` : '#fff',
          border: `${5 * u}px solid ${C.ink}`,
          boxShadow: active > 0.5 ? `0 0 ${40 * u}px ${C.violet}` : 'none',
        }}
      />
      <div style={{position: 'absolute', top: 64 * u, left: '50%', transform: 'translateX(-50%)', fontFamily: F.mono, fontWeight: 700, fontSize: 26 * u, letterSpacing: '0.12em', color: C.ink, whiteSpace: 'nowrap'}}>
        {label}
      </div>
    </div>
  );
};

// "Karena bagi kami, proses kreatif nggak seharusnya dibuat lebih rumit dari yang dibutuhkan."
export const S06Process: React.FC = () => {
  const t = useT();
  const {w, h, u, portrait} = useLayout();
  const proses = at(5, 'proses');
  const nggak = at(5, 'nggak');
  const rumit = at(5, 'rumit');
  const dari = at(5, 'dari');
  const dibutuhkan = at(5, 'dibutuhkan');
  const x0 = w * (portrait ? 0.12 : 0.14);
  const x1 = w * (portrait ? 0.88 : 0.86);
  const yc = h * (portrait ? 0.52 : 0.56);
  const N = 160;
  const draw = between(t, nggak - 0.1, rumit + 0.2, ease.inOutCubic);
  const straight = between(t, dari, dibutuhkan + 0.25, ease.inOutExpo);
  const pts = useMemo(() => {
    const out: [number, number][] = [];
    const loops = 6.5;
    const R = (portrait ? 120 : 130) * u;
    for (let i = 0; i < N; i++) {
      const s = i / (N - 1);
      const env = Math.sin(Math.PI * s); // no loops at the end points
      const om = loops * Math.PI * 2 * s;
      const rr = R * env * (0.7 + 0.6 * noise2D('loop', s * 3, 0));
      const mx = mix(x0, x1, s) - rr * Math.sin(om) * 1.25;
      const my = yc + rr * Math.cos(om) * 0.9 - rr * 0.9 * env + noise2D('ly', s * 4, 1) * 40 * u * env;
      const sx = mix(x0, x1, s);
      out.push([mix(mx, sx, straight), mix(my, yc, straight)]);
    }
    return out;
  }, [straight, x0, x1, yc, u, portrait]);
  const d = smoothOpen(pts);
  const jitter = t > rumit && straight < 0.05 ? noise2D('j', t * 20, 0) * 3 : 0;
  // traveller dot once the line is straight
  const run = prog(t, dibutuhkan + 0.2, 0.55, ease.inOutCubic);
  const hdr = portrait ? h * 0.2 : h * 0.17;
  return (
    <AbsoluteFill>
      <PaperBg
        blobs={[
          {x: 12, y: 90, r: 330, color: C.blue, seed: 'h'},
          {x: 92, y: 12, r: 300, color: C.violet, seed: 'i'},
        ]}
        blobOpacity={0.55}
      />
      <div style={{position: 'absolute', left: 0, right: 0, top: hdr, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Label size={28} color={C.violet} style={{marginBottom: 18 * u}}>
          <W t={at(5, 'karena')}>karena </W>
          <W t={at(5, 'bagi')}>bagi </W>
          <W t={at(5, 'kami')}>kami,</W>
        </Label>
        <H size={portrait ? 120 : 130}>
          <W t={proses}>proses </W>
          <W t={at(5, 'kreatif')} look="grad">
            kreatif
          </W>
        </H>
      </div>
      <svg width={w} height={h} style={{position: 'absolute', inset: 0, transform: `translate(${jitter}px, ${-jitter}px)`}}>
        <defs>
          <linearGradient id="procGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={C.blue} />
            <stop offset="1" stopColor={C.violet} />
          </linearGradient>
        </defs>
        <path
          d={d}
          fill="none"
          stroke={straight > 0.5 ? 'url(#procGrad)' : C.ink}
          strokeWidth={(straight > 0.5 ? 9 : 6) * u}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
        {run > 0 && run < 1 ? (
          <circle cx={mix(x0, x1, run)} cy={yc} r={18 * u} fill="#fff" stroke={C.violet} strokeWidth={6 * u} />
        ) : null}
      </svg>
      <Node x={x0} y={yc} label="IDE" t0={nggak - 0.2} active={run} />
      <Node x={x1} y={yc} label="EKSEKUSI" t0={nggak - 0.1} active={run >= 1 ? 1 : 0} />
      {/* "rumit" tag riding the scribble */}
      <div
        style={{
          position: 'absolute',
          left: w * (portrait ? 0.62 : 0.66),
          top: yc + (portrait ? 120 : 110) * u,
          transform: `translate(-50%, 0) rotate(${mix(-8, 0, straight)}deg) scale(${mix(1, 0.6, straight)})`,
          opacity: 1 - straight,
        }}
      >
        <H size={110}>
          <W t={rumit} look="serif" style={{fontSize: '1.15em'}}>
            rumit?
          </W>
        </H>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: (portrait ? 300 : 120) * u, padding: `0 ${60 * u}px`}}>
        <H size={portrait ? 54 : 58} weight={700} ls="-0.025em" color={C.ink}>
          <W t={nggak}>nggak </W>
          <W t={at(5, 'seharusnya')}>seharusnya </W>
          <W t={at(5, 'dibuat')}>dibuat </W>
          <W t={at(5, 'lebih')}>lebih </W>
          <W t={rumit} look="grad">
            rumit{' '}
          </W>
          {portrait ? <br /> : null}
          <W t={dari} style={{color: C.muted}}>
            dari{' '}
          </W>
          <W t={at(5, 'yang')} style={{color: C.muted}}>
            yang{' '}
          </W>
          <W t={dibutuhkan} style={{color: C.muted}}>
            dibutuhkan.
          </W>
        </H>
      </div>
    </AbsoluteFill>
  );
};
