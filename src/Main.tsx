import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Flash, Grain} from './components/Backgrounds';
import {Aperture} from './components/Aperture';
import {MotionBlurDefs, Scene} from './lib/scene';
import {S01Camera} from './scenes/S01Camera';
import {S02Produksi} from './scenes/S02Produksi';
import {S03Brand} from './scenes/S03Brand';
import {S04SpeedQuality} from './scenes/S04SpeedQuality';
import {S05Moves} from './scenes/S05Moves';
import {S06Process} from './scenes/S06Process';
import {S07IdeaExecution} from './scenes/S07IdeaExecution';
import {S08Partner} from './scenes/S08Partner';
import {S09Clients} from './scenes/S09Clients';
import {S10Services} from './scenes/S10Services';
import {S11Workflow} from './scenes/S11Workflow';
import {S12Detail} from './scenes/S12Detail';
import {S13Ecosystem} from './scenes/S13Ecosystem';
import {S14Stats} from './scenes/S14Stats';
import {S15NotEnough} from './scenes/S15NotEnough';
import {S16Pillars} from './scenes/S16Pillars';
import {S17Treatment} from './scenes/S17Treatment';
import {S18Faster} from './scenes/S18Faster';
import {S19GreatWork} from './scenes/S19GreatWork';
import {S20Outro} from './scenes/S20Outro';
import {Sfx} from './Sfx';

export type MainProps = {
  /** Optional background music file inside public/, e.g. "audio/music.mp3". */
  music?: string;
  musicVolume?: number;
  sfx?: boolean;
  /** Voice over on/off (off is handy for checking the SFX mix). */
  vo?: boolean;
};

export const Main: React.FC<MainProps> = ({music, musicVolume = 0.18, sfx = true, vo = true}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <MotionBlurDefs />
    <Scene name="01 Kamera" from={0} to={2.96}>
      <S01Camera />
    </Scene>
    <Scene name="02 Produksi" from={2.95} to={7.45} exit="whipUp" exitDur={0.4}>
      <S02Produksi />
    </Scene>
    <Scene name="03 Brand" from={7.05} to={10.5} enter="whipUp" enterDur={0.4} exit="zoomThrough" exitDur={0.35}>
      <S03Brand />
    </Scene>
    <Scene name="04 Speed vs Quality" from={10.15} to={13.7} enter="zoomIn" enterDur={0.35} exit="whipLeft" exitDur={0.3}>
      <S04SpeedQuality />
    </Scene>
    <Scene name="05 Cepat Terukur Tepat" from={13.4} to={16.85} enter="whipLeft" enterDur={0.3}>
      <S05Moves />
    </Scene>
    <Scene name="06 Proses" from={16.85} to={22.2} exit="zoomThrough" exitDur={0.35}>
      <S06Process />
    </Scene>
    <Scene name="07 Idea to Execution" from={21.85} to={24.6} enter="zoomIn" enterDur={0.35} exit="whipLeft" exitDur={0.35}>
      <S07IdeaExecution />
    </Scene>
    <Scene name="08 Partner" from={24.25} to={27.95} enter="whipLeft" enterDur={0.35} exit="whipUp" exitDur={0.35}>
      <S08Partner />
    </Scene>
    <Scene name="09 Clients" from={27.6} to={35.15} enter="whipUp" enterDur={0.35} exit="zoomThrough" exitDur={0.35}>
      <S09Clients />
    </Scene>
    <Scene name="10 Services" from={34.8} to={46.65} enter="zoomIn" enterDur={0.35} exit="whipUp" exitDur={0.35}>
      <S10Services />
    </Scene>
    <Scene name="11 Workflow" from={46.3} to={51.75} enter="whipUp" enterDur={0.35}>
      <S11Workflow />
    </Scene>
    <Scene name="12 Detail" from={51.4} to={56.5} enter="iris" enterDur={0.4} exit="zoomThrough" exitDur={0.3}>
      <S12Detail />
    </Scene>
    <Scene name="13 Ekosistem" from={56.2} to={62.05} enter="zoomIn" enterDur={0.3} exit="zoomThrough" exitDur={0.3}>
      <S13Ecosystem />
    </Scene>
    <Scene name="14 Stats" from={61.75} to={69.4} enter="zoomIn" enterDur={0.3} exit="whipLeft" exitDur={0.3}>
      <S14Stats />
    </Scene>
    <Scene name="15 Tidak Cukup" from={69.1} to={75.7} enter="whipLeft" enterDur={0.3} exit="zoomThrough" exitDur={0.3}>
      <S15NotEnough />
    </Scene>
    <Scene name="16 Pesan Karakter Alasan" from={75.4} to={82.75} enter="zoomIn" enterDur={0.3}>
      <S16Pillars />
    </Scene>
    <Scene name="17 Treatment" from={82.35} to={88.7} enter="iris" enterDur={0.4} exit="whipUp" exitDur={0.3}>
      <S17Treatment />
    </Scene>
    <Scene name="18 Lebih Cepat" from={88.4} to={96.9} enter="whipUp" enterDur={0.3} exit="zoomThrough" exitDur={0.3}>
      <S18Faster />
    </Scene>
    <Scene name="19 Great Work" from={96.6} to={103.15} enter="zoomIn" enterDur={0.3} exit="blur" exitDur={0.3}>
      <S19GreatWork />
    </Scene>
    <Scene name="20 Outro" from={102.85} to={109} enter="blur" enterDur={0.35}>
      <S20Outro />
    </Scene>
    <Flash at={16.85} color="#fff" />
    <Aperture close={[2.5, 2.95]} open={[2.95, 3.4]} />
    <Grain />
    {vo ? <Audio src={staticFile('audio/voice-over-master.mp3')} /> : null}
    {sfx ? <Sfx volume={1.25} /> : null}
    {music ? <Audio src={staticFile(music)} volume={musicVolume} /> : null}
  </AbsoluteFill>
);
