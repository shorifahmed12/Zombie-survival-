import React from 'react';
import {Composition} from 'remotion';
import {StickmanSurvival} from './StickmanSurvival';

import {ZombieTrailer} from './ZombieTrailer';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="ZombieTrailer" component={ZombieTrailer} durationInFrames={900} fps={30} width={1920} height={1080}/>
      <Composition
        id="StickmanSurvival"
        component={StickmanSurvival}
        durationInFrames={1800} // 60 sec * 30 fps
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Vertical version for YouTube Shorts / Reels */}
      <Composition
        id="StickmanSurvivalShort"
        component={StickmanSurvival}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};