import React from 'react';
import {Composition} from 'remotion';
import {Main, type MainProps} from './Main';
import {FPS, TOTAL_SECONDS} from './timeline';
import './fonts';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="RuberVisual"
    component={Main}
    durationInFrames={Math.round(TOTAL_SECONDS * FPS)}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{sfx: true} as MainProps}
  />
);
