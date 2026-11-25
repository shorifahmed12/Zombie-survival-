import React from 'react';
import {Composition} from 'remotion';
import {ZombieSurvivalCinematic01} from './cinematic01/Scene';
import {StickmanSurvival} from './StickmanSurvival';

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
      <Composition
        id="ZombieSurvivalCinematic01"
        component={ZombieSurvivalCinematic01}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};