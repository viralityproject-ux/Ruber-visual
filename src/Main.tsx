import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Grain} from './components/Backgrounds';
import {Subtitles} from './components/Subtitles';
import {MotionBlurDefs, Scene} from './lib/scene';
import {A01Hook} from './acts/A01Hook';
import {A02Logo} from './acts/A02Logo';
import {A03Services} from './acts/A03Services';
import {A04Journey} from './acts/A04Journey';
import {A05Principle} from './acts/A05Principle';
import {A06Speed} from './acts/A06Speed';

export type MainProps = {
  sfx?: boolean;
  /** Soundtrack (VO + music mix) on/off — off is handy for checking the SFX layer. */
  music?: boolean;
  subtitles?: boolean;
};

// Acts are back-to-back; every hand-off happens on a flat colour or a shared element, so there is no visible cut.
export const Main: React.FC<MainProps> = ({music = true, subtitles = true}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <MotionBlurDefs />
    <Scene name="01 Hook" from={0} to={13.6}>
      <A01Hook />
    </Scene>
    <Scene name="02 Logo" from={13.6} to={22.0}>
      <A02Logo />
    </Scene>
    <Scene name="03 Services" from={22.0} to={35.1}>
      <A03Services />
    </Scene>
    <Scene name="04 Journey" from={35.1} to={47.2}>
      <A04Journey />
    </Scene>
    <Scene name="05 Principle" from={47.2} to={51.55}>
      <A05Principle />
    </Scene>
    <Scene name="06 Speed" from={51.55} to={60.2}>
      <A06Speed />
    </Scene>
    {subtitles ? <Subtitles /> : null}
    <Grain opacity={0.05} />
    {music ? <Audio src={staticFile('audio/soundtrack-v2.mp3')} /> : null}
  </AbsoluteFill>
);
