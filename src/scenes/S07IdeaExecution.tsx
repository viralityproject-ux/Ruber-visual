import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, GRAD} from '../theme';
import {DotGrid, InkBg} from '../components/Backgrounds';
import {H, Label, W, at} from '../components/Text';
import {Bar, Center} from '../components/UI';
import {Icon} from '../components/Icons';
import {useLayout, useT} from '../lib/scene';
import {between, bump, ease, mix, prog, shake} from '../lib/anim';

// "From idea to execution."
export const S07IdeaExecution: React.FC = () => {
  const t = useT();
  const {u, portrait} = useLayout();
  const from = at(6, 'from');
  const idea = at(6, 'idea');
  const to = at(6, 'to');
  const exe = at(6, 'execution');
  const load = between(t, idea + 0.1, exe + 0.25, ease.inOutCubic);
  const sk = shake(t, exe, 24, 0.45);
  const zoom = mix(1.08, 1, prog(t, from - 0.2, 0.8, ease.outExpo)) + bump(t, exe, 0.35) * 0.06;
  const big = portrait ? 180 : 230;
  const iconBox = (name: string, t0: number, on: number) => {
    const p = prog(t, t0, 0.5, ease.outBackStrong);
    return (
      <div
        style={{
          width: 120 * u,
          height: 120 * u,
          borderRadius: 34 * u,
          background: on > 0.5 ? GRAD : 'rgba(255,255,255,0.06)',
          border: `${2 * u}px solid rgba(255,255,255,0.14)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${p}) rotate(${mix(-20, 0, p)}deg)`,
          boxShadow: on > 0.5 ? `0 0 ${60 * u}px rgba(123,60,255,0.6)` : 'none',
        }}
      >
        <Icon name={name} size={64 * u} color="#fff" stroke={2} draw={t0 + 0.1} />
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <InkBg glow={[[C.blue, 15, 30], [C.violet, 85, 75]]} dots={false} />
      <DotGrid drift={-260} gap={36} />
      <Center style={{transform: `translate(${sk.x}px, ${sk.y}px) scale(${zoom})`, gap: 28 * u}}>
        <Label size={38} color="rgba(255,255,255,0.7)">
          <W t={from}>from</W>
        </Label>
        <div style={{display: 'flex', alignItems: 'center', gap: 36 * u}}>
          {iconBox('bulb', idea - 0.05, 1)}
          <H size={big} color="#fff">
            <W t={idea}>idea</W>
          </H>
        </div>
        <div style={{width: (portrait ? 860 : 1100) * u, display: 'flex', alignItems: 'center', gap: 24 * u, opacity: prog(t, idea + 0.05, 0.3)}}>
          <span style={{fontFamily: F.mono, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontSize: 38 * u}}>
            <W t={to}>to</W>
          </span>
          <Bar p={load} h={16} dark style={{flex: 1}} />
          <span style={{fontFamily: F.mono, fontWeight: 700, color: '#fff', fontSize: 38 * u, width: 120 * u, textAlign: 'right'}}>{Math.round(load * 100)}%</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 36 * u}}>
          {iconBox('play', exe - 0.05, prog(t, exe, 0.2))}
          <H size={portrait ? 134 : big} color="#fff">
            <W t={exe} look="grad">
              execution.
            </W>
          </H>
        </div>
      </Center>
    </AbsoluteFill>
  );
};
