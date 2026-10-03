import React from 'react';
import {C} from '../theme';
import {useT} from '../lib/scene';
import {bump, clamp01, ease, mix, prog} from '../lib/anim';
import {ARC_L, ARC_R, DOT, DOT_C, LETTERS, MARK_H, MARK_W, RING, RING_C, WORD_H, WORD_W} from './ruberLogoPaths';

export type LogoAnim = {
  /** reveal start (global s). Omit for a fully drawn, static logo. */
  t0?: number;
  /** where the dot starts, in mark units relative to its final centre (for bridges). */
  dotFrom?: [number, number];
  /** extra uniform scale applied to the dot during its flight (e.g. arrives big from a bridge). */
  dotFromScale?: number;
  /** false = the dot is already visible at dotFrom (handed over from another element) instead of popping in. */
  dotPop?: boolean;
};

export type MarkParts = {
  /** opacity multipliers for the parts (for cross-fades into other shapes). */
  ringOpacity?: number;
  dotOpacity?: number;
  /** 0..1: arcs swing outward and fade (exit). */
  arcsOut?: number;
};

/** The mark only. `size` is its rendered height in px. */
export const RuberMark: React.FC<
  LogoAnim & MarkParts & {size: number; color?: string; dotColor?: string; glow?: number; style?: React.CSSProperties}
> = ({
  size,
  color = C.ink,
  dotColor,
  t0,
  dotFrom = [RING_C[0] - DOT_C[0], RING_C[1] - DOT_C[1]],
  dotFromScale = 0.6,
  dotPop: pop = true,
  ringOpacity = 1,
  dotOpacity = 1,
  arcsOut = 0,
  glow = 0,
  style,
}) => {
  const t = useT();
  const on = t0 === undefined;
  const ring = on ? 1 : prog(t, t0 + 0.08, 0.55, ease.outBackStrong);
  const ringRot = on ? 0 : mix(-150, 0, prog(t, t0 + 0.08, 0.7, ease.outExpo));
  const aL = on ? 1 : prog(t, t0 + 0.26, 0.6, ease.outExpo);
  const aR = on ? 1 : prog(t, t0 + 0.32, 0.6, ease.outExpo);
  const dotP = on ? 1 : prog(t, t0 + 0.18, 0.55, ease.inOutCubic);
  const dotPop = on || !pop ? 1 : prog(t, t0, 0.3, ease.outBackStrong);
  // dot travels on a slight arc from dotFrom to its home
  const dx = mix(dotFrom[0], 0, dotP) + Math.sin(dotP * Math.PI) * -30;
  const dy = mix(dotFrom[1], 0, dotP) + Math.sin(dotP * Math.PI) * -60;
  const ds = mix(dotFromScale, 1, dotP) * dotPop;
  const w = (size * MARK_W) / MARK_H;
  return (
    <svg width={w} height={size} viewBox={`0 0 ${MARK_W} ${MARK_H}`} style={{overflow: 'visible', ...style}}>
      {glow > 0 ? (
        <defs>
          <filter id="rvGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={18} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      ) : null}
      <g filter={glow > 0 ? 'url(#rvGlow)' : undefined} opacity={1}>
        {arcsOut < 1 ? (
          <>
            <path
              d={ARC_L}
              fill={color}
              opacity={clamp01(aL * 1.6) * (1 - arcsOut)}
              transform={`rotate(${mix(-120, 0, aL) - arcsOut * 75} ${RING_C[0]} ${RING_C[1]}) translate(${mix(-40, 0, aL) - arcsOut * 60} ${-arcsOut * 30})`}
            />
            <path
              d={ARC_R}
              fill={color}
              opacity={clamp01(aR * 1.6) * (1 - arcsOut)}
              transform={`rotate(${mix(120, 0, aR) + arcsOut * 75} ${RING_C[0]} ${RING_C[1]}) translate(${mix(40, 0, aR) + arcsOut * 60} ${arcsOut * 30})`}
            />
          </>
        ) : null}
        {ringOpacity > 0 ? (
          <path
            d={RING}
            fill={color}
            fillRule="evenodd"
            opacity={ringOpacity}
            transform={`translate(${RING_C[0]} ${RING_C[1]}) rotate(${ringRot}) scale(${ring}) translate(${-RING_C[0]} ${-RING_C[1]})`}
          />
        ) : null}
        {dotOpacity > 0 ? (
          <path
            d={DOT}
            fill={dotColor ?? color}
            opacity={dotOpacity}
            transform={`translate(${dx} ${dy}) translate(${DOT_C[0]} ${DOT_C[1]}) scale(${ds}) translate(${-DOT_C[0]} ${-DOT_C[1]})`}
          />
        ) : null}
      </g>
    </svg>
  );
};

/** The "ruber visual" wordmark. `height` is its rendered height in px. Letters rise in from t0. */
export const RuberWordmark: React.FC<{
  height: number;
  color?: string;
  t0?: number;
  stagger?: number;
  /** a ripple of little hops through the letters, starting at this time */
  wave?: number;
  /** letters drop away (exit), starting at this time */
  out?: number;
  style?: React.CSSProperties;
}> = ({height, color = C.ink, t0, stagger = 0.035, wave, out, style}) => {
  const t = useT();
  const w = (height * WORD_W) / WORD_H;
  return (
    <svg width={w} height={height} viewBox={`0 0 ${WORD_W} ${WORD_H}`} style={{overflow: 'visible', ...style}}>
      {LETTERS.map((L, i) => {
        const p = t0 === undefined ? 1 : prog(t, t0 + i * stagger, 0.5, ease.outExpo);
        const hop = wave === undefined ? 0 : bump(t, wave + i * 0.03, 0.32) * 16;
        const o = out === undefined ? 0 : prog(t, out + (LETTERS.length - 1 - i) * 0.018, 0.32, ease.inCubic);
        const cx = (L.x0 + L.x1) / 2;
        return (
          <path
            key={i}
            d={L.d}
            fill={color}
            fillRule="evenodd"
            opacity={clamp01(p * 1.5) * (1 - o)}
            transform={`translate(0 ${mix(46, 0, p) - hop + o * 70}) rotate(${o * (i % 2 ? 14 : -14)} ${cx} 40)`}
          />
        );
      })}
    </svg>
  );
};

/** Stacked lockup (mark above wordmark) like the official artwork. `size` = mark height. */
export const RuberLockup: React.FC<
  LogoAnim & {size: number; color?: string; dotColor?: string; wordDelay?: number; glow?: number}
> = ({size, color = C.ink, dotColor, t0, dotFrom, dotFromScale, wordDelay = 0.55, glow}) => {
  const k = size / MARK_H;
  return (
    <div style={{position: 'relative', width: WORD_W * k, height: 617 * k}}>
      <div style={{position: 'absolute', left: 39 * k, top: 0}}>
        <RuberMark size={size} color={color} dotColor={dotColor} t0={t0} dotFrom={dotFrom} dotFromScale={dotFromScale} glow={glow} />
      </div>
      <div style={{position: 'absolute', left: 0, top: 537 * k}}>
        <RuberWordmark height={WORD_H * k} color={color} t0={t0 === undefined ? undefined : t0 + wordDelay} />
      </div>
    </div>
  );
};
