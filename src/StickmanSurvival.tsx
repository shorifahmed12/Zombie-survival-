import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Scene1, Scene2, Scene3, Scene4, Scene5, Scene6} from './Scenes';
import {ProgressBar} from './UI';

export const StickmanSurvival: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor:'black', overflow:'hidden', fontFamily:'Arial, Helvetica, sans-serif'}}>
      <Sequence durationInFrames={300} name="1-Awakening"><Scene1/></Sequence>
      <Sequence from={300} durationInFrames={300} name="2-Desert-Water"><Scene2/></Sequence>
      <Sequence from={600} durationInFrames={300} name="3-Bear-Chase"><Scene3/></Sequence>
      <Sequence from={900} durationInFrames={300} name="4-Storm-Shelter"><Scene4/></Sequence>
      <Sequence from={1200} durationInFrames={300} name="5-Night-Fire"><Scene5/></Sequence>
      <Sequence from={1500} durationInFrames={300} name="6-Victory"><Scene6/></Sequence>

      <div style={{position:'absolute', inset:0, background:'radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.4) 100%)', pointerEvents:'none'}}/>
      <ProgressBar frame={frame} total={1800}/>
      {/* Add music: put file in public/music.mp3 then uncomment */}
      {/* <Audio src={staticFile('music.mp3')} /> */}
    </AbsoluteFill>
  );
};