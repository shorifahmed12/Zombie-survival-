import React from 'react';
import {useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const Subtitle: React.FC<{text:string; start?:number; end?:number}> = ({text, start=0, end=9999}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [start, start+15, end-15, end], [0,1,1,0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  if (frame < start || frame > end) return null;
  return <div style={{position:'absolute', bottom:70, left:0, right:0, display:'flex', justifyContent:'center', opacity}}>
    <div style={{background:'rgba(0,0,0,0.75)', color:'white', padding:'16px 32px', borderRadius:16, fontSize:36, fontWeight:700, maxWidth:1400, textAlign:'center'}}>{text}</div></div>
};
export const BigTitle: React.FC<{text:string; subtitle?:string; start?:number}> = ({text, subtitle, start=0}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const scale = spring({frame: frame-start, fps, config:{damping:12, stiffness:120}});
  const opacity = interpolate(frame, [start, start+20],[0,1],{extrapolateRight:'clamp'});
  return <div style={{position:'absolute', top:120, left:0, right:0, textAlign:'center', opacity, transform:`scale(${scale})`}}>
    <div style={{fontSize:92, fontWeight:900, color:'white', textShadow:'0 6px 0 #000'}}>{text}</div>
    {subtitle && <div style={{fontSize:36, color:'#fde68a', fontWeight:700, marginTop:10, textShadow:'0 3px 0 #000'}}>{subtitle}</div>}</div>
};
export const ProgressBar: React.FC<{frame:number; total:number}> = ({frame,total}) => (
  <div style={{position:'absolute', top:0, left:0, right:0, height:10, background:'rgba(0,0,0,0.4)', zIndex:50}}>
    <div style={{width:`${(frame/total)*100}%`, height:'100%', background:'linear-gradient(90deg,#22c55e,#f59e0b,#ef4444)'}}/></div>
);