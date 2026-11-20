import React from 'react';
import {useCurrentFrame} from 'remotion';

export const Sun: React.FC<{x:number;y:number;size?:number}> = ({x,y,size=160}) => (
  <div style={{position:'absolute', left:x-size/2, top:y-size/2, width:size, height:size, borderRadius:'50%', background:'radial-gradient(circle, #fff7ad 0%, #ffd93d 45%, #ff9f1a 100%)', boxShadow:'0 0 80px 40px rgba(255,200,0,0.55)'}}/>
);
export const Moon: React.FC<{x:number;y:number}> = ({x,y}) => (
  <div style={{position:'absolute', left:x-60, top:y-60, width:120, height:120, borderRadius:'50%', background:'#fef9c3', boxShadow:'0 0 60px 20px rgba(254,249,195,0.4)'}}/>
);
export const Clouds: React.FC<{speed?:number; dark?:boolean}> = ({speed=0.5, dark=false}) => {
  const frame = useCurrentFrame();
  const clouds = [{x:200,y:120,s:1.2},{x:700,y:80,s:0.9},{x:1200,y:150,s:1.4},{x:1650,y:100,s:1}];
  return <>{clouds.map((c,i)=>{
    const cx = ((c.x + frame*speed*(20+i*5)) % 2200) - 200;
    const col = dark?'#334155':'white';
    return <div key={i} style={{position:'absolute', left:cx, top:c.y, opacity:0.9, transform:`scale(${c.s})`}}>
      <div style={{width:180,height:60,background:col,borderRadius:40}}/>
      <div style={{width:110,height:70,background:col,borderRadius:'50%',position:'absolute',top:-30,left:35}}/>
      <div style={{width:90,height:55,background:col,borderRadius:'50%',position:'absolute',top:-20,left:90}}/>
    </div>
  })}</>
};
export const Mountains: React.FC<{color:string; opacity?:number}> = ({color, opacity=1}) => (
  <svg style={{position:'absolute', bottom:260, left:0, width:'100%', height:380, opacity}} viewBox="0 0 1920 380" preserveAspectRatio="none">
    <polygon points="0,380 320,120 620,380" fill={color}/><polygon points="420,380 820,60 1180,380" fill={color}/><polygon points="980,380 1380,140 1720,380" fill={color}/><polygon points="1500,380 1920,180 1920,380" fill={color}/>
  </svg>
);
export const PineTrees: React.FC<{offset?:number; color?:string}> = ({offset=0, color='#14532d'}) => {
  const trees = Array.from({length:8}, (_,i)=> 100 + i*240);
  return <>{trees.map((x,i)=>(
    <div key={i} style={{position:'absolute', left:x - (offset%240), bottom:240}}>
      <svg width="140" height="260" viewBox="0 0 140 260"><rect x="62" y="190" width="16" height="70" fill="#78350f"/><polygon points="70,0 20,110 120,110" fill={color}/><polygon points="70,60 10,180 130,180" fill={color}/><polygon points="70,120 0,230 140,230" fill={color}/></svg>
    </div>))}</>
};
export const Bear: React.FC<{x:number;y:number;scale?:number}> = ({x,y,scale=1}) => {
  const frame = useCurrentFrame(); const bob = Math.abs(Math.sin(frame*0.4))* -10;
  return <div style={{position:'absolute', left:x, top:y+bob, width:280*scale, height:200*scale}}>
    <svg viewBox="0 0 280 200" width={280*scale} height={200*scale}>
      <ellipse cx="140" cy="120" rx="95" ry="55" fill="#451a03"/><circle cx="235" cy="85" r="42" fill="#451a03"/><circle cx="210" cy="50" r="16" fill="#451a03"/><circle cx="255" cy="50" r="16" fill="#451a03"/><ellipse cx="260" cy="100" rx="18" ry="12" fill="#d6d3d1"/><circle cx="245" cy="80" r="5" fill="black"/><circle cx="272" cy="95" r="5" fill="black"/><rect x="70" y="155" width="28" height="40" rx="10" fill="#451a03"/><rect x="180" y="155" width="28" height="40" rx="10" fill="#451a03"/>
    </svg></div>
};