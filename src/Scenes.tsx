import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {Stickman} from './Stickman';
import {Sun, Moon, Clouds, Mountains, PineTrees, Bear} from './Environment';
import {Rain, Fire, Stars, Zzz, SweatDrops, Confetti} from './Effects';
import {Subtitle, BigTitle} from './UI';

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const sunY = interpolate(frame, [0,300],[750,420], {extrapolateRight:'clamp'});
  const camScale = interpolate(frame, [0,300],[1.15,1], {extrapolateRight:'clamp'});
  const sleeping = frame < 90;
  return <AbsoluteFill style={{transform:`scale(${camScale})`}}>
    <div style={{position:'absolute', inset:0, background:'linear-gradient(to bottom, #7c3aed 0%, #ec4899 45%, #f59e0b 75%, #fde68a 100%)'}}/>
    <Sun x={960} y={sunY} size={180}/><Clouds speed={0.3}/><Mountains color="#92400e"/>
    <div style={{position:'absolute', bottom:0, width:'100%', height:320, background:'linear-gradient(to bottom, #d97706, #92400e)'}}/>
    <Stickman x={860} y={620} scale={1.6} action={sleeping?'sleep':'wave'} emotion={sleeping?'sleeping':'happy'} hat/>
    {sleeping && <Zzz x={1020} y={580}/>}
    <BigTitle text="STICKMAN SURVIVAL" subtitle="Alone in the Wild" start={10}/>
    <Subtitle text="Day 1... I woke up alone in the wild." start={20} end={280}/>
  </AbsoluteFill>
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0,260], [-180, 1380], {extrapolateRight:'clamp'});
  return <AbsoluteFill>
    <div style={{position:'absolute', inset:0, background:'linear-gradient(to bottom, #38bdf8 0%, #bae6fd 55%, #fef3c7 100%)'}}/>
    <Sun x={1550} y={180} size={150}/><Clouds speed={0.4}/><Mountains color="#f59e0b" opacity={0.6}/>
    <div style={{position:'absolute', bottom:0, width:'100%', height:340, background:'linear-gradient(to bottom, #fde68a, #d97706)'}}/>
    <div style={{position:'absolute', right:120, bottom:180, width:340, height:110, background:'radial-gradient(ellipse, #38bdf8, #0369a1)', borderRadius:'50%', border:'6px solid #22c55e'}}/>
    <Stickman x={x} y={600} scale={1.5} action={frame<230?'walk':'drink'} emotion={frame<230?'tired':'happy'} backpack/>
    <Subtitle text="Thirsty... I must find water before sunset." start={10} end={200}/>
    <Subtitle text="Water! Finally!" start={230} end={295}/>
  </AbsoluteFill>
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const shakeX = Math.sin(frame*0.9)*6, shakeY = Math.cos(frame*0.7)*4;
  const bearX = interpolate(frame, [0,300],[-200,520], {extrapolateRight:'clamp'});
  return <AbsoluteFill style={{transform:`translate(${shakeX}px, ${shakeY}px)`}}>
    <div style={{position:'absolute', inset:0, background:'linear-gradient(to bottom, #86efac 0%, #22c55e 60%, #14532d 100%)'}}/>
    <Clouds speed={0.6}/><PineTrees offset={frame*1.5}/>
    <div style={{position:'absolute', bottom:0, width:'100%', height:300, background:'#166534'}}/>
    <Bear x={bearX} y={620} scale={1.2}/>
    <Stickman x={750} y={600} scale={1.6} action="run" emotion="scared"/>
    <SweatDrops x={870} y={580}/>
    <div style={{position:'absolute', left:840, top:520, fontSize:80, fontWeight:900, color:'#ef4444', textShadow:'0 4px 0 #000'}}>!</div>
    <Subtitle text="A BEAR! I need to run!" start={10} end={180}/>
    <Subtitle text="Phew... I escaped into the forest." start={190} end={295}/>
  </AbsoluteFill>
};

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const lightning = (frame>=70 && frame<78) ? 0.7 : (frame>=150 && frame<156) ? 0.5 : 0;
  return <AbsoluteFill>
    <div style={{position:'absolute', inset:0, background:'linear-gradient(to bottom, #1e293b 0%, #475569 60%, #334155 100%)'}}/>
    <Clouds speed={3} dark/><PineTrees offset={frame*0.5} color="#0f172a"/>
    <div style={{position:'absolute', bottom:0, width:'100%', height:320, background:'#1f2937'}}/>
    {frame>180 && <div style={{position:'absolute', left:1050, bottom:280, width:0, height:0, borderLeft:'140px solid transparent', borderRight:'140px solid transparent', borderBottom:'180px solid #b45309'}}/>}
    <Stickman x={frame>=230?1150:650} y={620} scale={1.5} action={frame<140?'chop':frame<230?'build':'idle'} emotion="determined"/>
    <Rain intensity={90}/>
    <div style={{position:'absolute', inset:0, background:'white', opacity:lightning}}/>
    <Subtitle text="Storm coming! Build shelter fast!" start={10} end={160}/>
    <Subtitle text="Safe inside my shelter." start={230} end={295}/>
  </AbsoluteFill>
};

export const Scene5: React.FC = () => {
  return <AbsoluteFill>
    <div style={{position:'absolute', inset:0, background:'linear-gradient(to bottom, #020617 0%, #1e3a8a 60%, #0f172a 100%)'}}/>
    <Stars/><Moon x={1650} y={160}/>
    <div style={{position:'absolute', bottom:0, width:'100%', height:300, background:'#020617'}}/>
    <div style={{position:'absolute', left:1250, bottom:260, width:180, height:120, background:'#14532d', borderRadius:'50%'}}/>
    {Array.from({length:10},(_,i)=>(<div key={i} style={{position:'absolute', left:1270+(i*17)%140, bottom:280+(i*11)%70, width:16, height:16, background:'#ef4444', borderRadius:'50%'}}/>))}
    <Fire x={860} y={620} scale={1.3}/>
    <Stickman x={620} y={640} scale={1.5} action="sit" emotion="happy"/>
    <Stickman x={1150} y={640} scale={1.4} action="eat" emotion="happy" flip/>
    <Subtitle text="Night falls. Fire keeps me warm." start={10} end={160}/>
    <Subtitle text="Berries taste sweet. I will survive!" start={170} end={295}/>
  </AbsoluteFill>
};

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const sunY = interpolate(frame,[0,300],[700,350],{extrapolateRight:'clamp'});
  return <AbsoluteFill>
    <div style={{position:'absolute', inset:0, background:'linear-gradient(to bottom, #f472b6 0%, #fb923c 50%, #fde68a 100%)'}}/>
    <Sun x={960} y={sunY} size={200}/><Clouds speed={0.5}/><Mountains color="#9a3412"/>
    <div style={{position:'absolute', bottom:0, width:'100%', height:320, background:'linear-gradient(to bottom,#86efac,#22c55e)'}}/>
    <Confetti/>
    <Stickman x={860} y={600} scale={1.8} action="jump" emotion="happy" hat/>
    <BigTitle text="SURVIVED!" subtitle="Stickman vs Wild - Day 1 Complete" start={20}/>
    <Subtitle text="From sunrise to sunrise... I survived the wild!" start={40} end={280}/>
  </AbsoluteFill>
};