import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, ease, mix} from './anim';

const SceneCtx = createContext({startFrame: 0, from: 0, to: 0});

/** Global VO time in seconds, even inside a Scene. */
export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {startFrame} = useContext(SceneCtx);
  return (startFrame + frame) / fps;
};

export const useSceneBounds = () => useContext(SceneCtx);

export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  const u = Math.min(width, height) / 1080;
  return {w: width, h: height, portrait, u};
};

export type Trans =
  | 'none'
  | 'fade'
  | 'zoomIn' // arrives from far away
  | 'zoomThrough' // arrives from very close / leaves by flying into the camera
  | 'zoomOut' // leaves by shrinking away
  | 'whipLeft'
  | 'whipRight'
  | 'whipUp'
  | 'whipDown'
  | 'iris'
  | 'slideUp'
  | 'blur';

const whipVec = (t: Trans): [number, number] =>
  t === 'whipLeft' ? [-1, 0] : t === 'whipRight' ? [1, 0] : t === 'whipUp' ? [0, -1] : t === 'whipDown' ? [0, 1] : [0, 0];

const enterStyle = (type: Trans, p: number): React.CSSProperties => {
  if (type === 'none' || p >= 1) return {};
  switch (type) {
    case 'fade':
      return {opacity: ease.outCubic(p)};
    case 'zoomIn': {
      // waits for the outgoing scene to fly past, then lands from slightly too close (edges never show)
      const q = clamp01((p - 0.3) / 0.7);
      const e = ease.outExpo(q);
      return {opacity: clamp01(q * 3), transform: `scale(${mix(1.5, 1, e)})`, filter: q < 1 ? `blur(${mix(26, 0, e)}px)` : undefined};
    }
    case 'zoomThrough': {
      const e = ease.outExpo(p);
      return {opacity: clamp01(p * 3), transform: `scale(${mix(2.2, 1, e)})`, filter: `blur(${mix(28, 0, e)}px)`};
    }
    case 'blur': {
      const e = ease.outCubic(p);
      return {opacity: e, filter: `blur(${mix(40, 0, e)}px)`, transform: `scale(${mix(1.08, 1, e)})`};
    }
    case 'iris': {
      const e = ease.inOutCubic(p);
      return {clipPath: `circle(${mix(0, 120, e)}% at 50% 50%)`};
    }
    case 'slideUp': {
      const e = ease.inOutExpo(p);
      return {transform: `translateY(${mix(100, 0, e)}%)`};
    }
    default: {
      const [vx, vy] = whipVec(type);
      const e = ease.inOutExpo(p);
      const v = Math.sin(p * Math.PI);
      // whipLeft: content travels left, so the new scene comes in from the right
      return {
        transform: `translate(${-vx * (1 - e) * 100}%, ${-vy * (1 - e) * 100}%)`,
        filter: v > 0.05 ? `url(#${vx !== 0 ? 'mbx' : 'mby'}${Math.min(5, Math.ceil(v * 5))})` : undefined,
      };
    }
  }
};

const exitStyle = (type: Trans, p: number): React.CSSProperties => {
  if (type === 'none' || p <= 0) return {};
  switch (type) {
    case 'fade':
      return {opacity: 1 - ease.inCubic(p)};
    case 'zoomThrough': {
      const e = ease.inCubic(clamp01(p / 0.75));
      return {opacity: 1 - clamp01((p - 0.45) * 2.5), transform: `scale(${mix(1, 2.8, e)})`, filter: `blur(${mix(0, 26, e)}px)`};
    }
    case 'zoomOut':
    case 'zoomIn': {
      const e = ease.inExpo(p);
      return {opacity: 1 - clamp01((p - 0.4) * 1.8), transform: `scale(${mix(1, 0.5, e)})`, filter: `blur(${mix(0, 24, e)}px)`};
    }
    case 'blur': {
      const e = ease.inCubic(p);
      return {opacity: 1 - e, filter: `blur(${mix(0, 40, e)}px)`};
    }
    case 'iris':
    case 'slideUp':
      return {};
    default: {
      const [vx, vy] = whipVec(type);
      const e = ease.inOutExpo(p);
      const v = Math.sin(p * Math.PI);
      return {
        transform: `translate(${vx * e * 100}%, ${vy * e * 100}%)`,
        filter: v > 0.05 ? `url(#${vx !== 0 ? 'mbx' : 'mby'}${Math.min(5, Math.ceil(v * 5))})` : undefined,
      };
    }
  }
};

const combine = (a: React.CSSProperties, b: React.CSSProperties): React.CSSProperties => {
  const out: React.CSSProperties = {...a, ...b};
  if (a.transform && b.transform) out.transform = `${a.transform} ${b.transform}`;
  if (a.filter && b.filter) out.filter = `${a.filter} ${b.filter}`;
  if (a.opacity !== undefined && b.opacity !== undefined) out.opacity = (a.opacity as number) * (b.opacity as number);
  return out;
};

/**
 * A scene lives between `from` and `to` (global seconds). Enter/exit transitions play
 * at the very start and end, so neighbouring scenes should overlap by the transition length.
 */
export const Scene: React.FC<{
  from: number;
  to: number;
  enter?: Trans;
  enterDur?: number;
  exit?: Trans;
  exitDur?: number;
  name?: string;
  children: React.ReactNode;
}> = ({from, to, enter = 'none', enterDur = 0.4, exit = 'none', exitDur = 0.4, name, children}) => {
  const {fps} = useVideoConfig();
  const startFrame = Math.round(from * fps);
  const dur = Math.max(1, Math.round(to * fps) - startFrame);
  return (
    <Sequence from={startFrame} durationInFrames={dur} name={name}>
      <SceneCtx.Provider value={{startFrame, from, to}}>
        <SceneBody enter={enter} enterDur={enterDur} exit={exit} exitDur={exitDur} dur={dur / fps}>
          {children}
        </SceneBody>
      </SceneCtx.Provider>
    </Sequence>
  );
};

const SceneBody: React.FC<{
  enter: Trans;
  enterDur: number;
  exit: Trans;
  exitDur: number;
  dur: number;
  children: React.ReactNode;
}> = ({enter, enterDur, exit, exitDur, dur, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lt = frame / fps;
  const pin = clamp01(lt / enterDur);
  const pout = clamp01((lt - (dur - exitDur)) / exitDur);
  const style = combine(enterStyle(enter, pin), exitStyle(exit, pout));
  // slow camera push so no frame is ever fully static
  const push = 1 + 0.03 * (lt / Math.max(1, dur));
  return (
    <AbsoluteFill style={{...style, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Directional motion-blur SVG filters referenced by whip transitions (mbx1..5 / mby1..5). */
export const MotionBlurDefs: React.FC = () => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    <defs>
      {[1, 2, 3, 4, 5].map((i) => (
        <React.Fragment key={i}>
          <filter id={`mbx${i}`} x="-20%" y="0%" width="140%" height="100%">
            <feGaussianBlur stdDeviation={`${i * 14} 0`} />
          </filter>
          <filter id={`mby${i}`} x="0%" y="-20%" width="100%" height="140%">
            <feGaussianBlur stdDeviation={`0 ${i * 14}`} />
          </filter>
        </React.Fragment>
      ))}
    </defs>
  </svg>
);
