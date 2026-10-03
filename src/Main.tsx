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
import {A07Process} from './acts/A07Process';
import {A08Ready} from './acts/A08Ready';
import {A08cDetail} from './acts/A08cDetail';
import {A09Digital} from './acts/A09Digital';
import {A10Message} from './acts/A10Message';
import {A11Idea} from './acts/A11Idea';
import {A12Outro} from './acts/A12Outro';

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
    <Scene name="07 Process" from={60.2} to={74.35}>
      <A07Process />
    </Scene>
    <Scene name="08 Ready" from={74.35} to={86.65}>
      <A08Ready />
    </Scene>
    <Scene name="08c Detail" from={86.65} to={95.3}>
      <A08cDetail />
    </Scene>
    <Scene name="09 Digital" from={95.3} to={108.85}>
      <A09Digital />
    </Scene>
    <Scene name="10 Message" from={108.85} to={121.4}>
      <A10Message />
    </Scene>
    <Scene name="11 Idea" from={121.4} to={129.65}>
      <A11Idea />
    </Scene>
    <Scene name="12 Outro" from={129.65} to={134.92}>
      <A12Outro />
    </Scene>
    {subtitles ? <Subtitles /> : null}
    <Grain opacity={0.05} />
    {music ? <Audio src={staticFile('audio/soundtrack-v2.mp3')} /> : null}
  </AbsoluteFill>
);
