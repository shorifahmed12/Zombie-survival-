import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

export const Rain: React.FC<{intensity?:number}> = ({intensity=80}) => {
  const frame = useCurrentFrame();
  const drops = Array.from({length:intensity}, (_,i)=>({x:(i*137)%1920, speed:18+(i%10)*3, y:(frame*(18+(i%10)*3)+i*97)%1080, len:20+(i%5)*5}));
  return <div style={{position:'absolute', inset:0}}>{drops.map((d,i)=>(<div key={i} style={{position:'absolute', left:d.x, top:d.y, width:3, height:d.len, background:'rgba(147,197,253,0.7)', borderRadius:2}}/>))}</div>
};
export const Fire: React.FC<{x:number;y:number;scale?:number}> = ({x,y,scale=1}) => {
  const frame = useCurrentFrame();
  const flames = [{dx:0,s:1,c:'#f97316'},{dx:-35,s:0.7,c:'#ef4444'},{dx:35,s:0.7,c:'#ef4444'},{dx:-15,s:0.5,c:'#facc15'},{dx:15,s:0.5,c:'#facc15'}];
  return <div style={{position:'absolute', left:x, top:y, width:200*scale, height:200*scale}}>
    <div style={{position:'absolute', bottom:10, left:20, width:160, height:22, background:'#78350f', borderRadius:10, transform:'rotate(-18deg)'}}/>
    <div style={{position:'absolute', bottom:10, left:20, width:160, height:22, background:'#92400e', borderRadius:10, transform:'rotate(18deg)'}}/>
    {flames.map((f,i)=>{ const flicker = 1 + Math.sin(frame*0.6 + i*1.3)*0.18; const h = 110*f.s*flicker;
      return <div key={i} style={{position:'absolute', bottom:25, left:100+f.dx-30*f.s, width:60*f.s, height:h, background:`radial-gradient(ellipse at 50% 80%, ${f.c}, transparent 70%)`, borderRadius:'50%'}}/>})}
    {Array.from({length:12},(_,i)=>{ const sx = 100 + Math.sin(i*2.5)*60; const sy = 180 - ((frame*2 + i*23)%150);
      return <div key={i} style={{position:'absolute', left:sx, top:sy, width:6, height:6, background:'#fde68a', borderRadius:'50%', opacity: interpolate(sy,[30,180],[0,1])}}/>})}
  </div>
};
export const Stars: React.FC = () => <>{Array.from({length:60},(_,i)=>(<div key={i} style={{position:'absolute', left:(i*173)%1920, top:(i*97)%600, width:3+(i%3), height:3+(i%3), background:'white', borderRadius:'50%', opacity:0.6+ (i%4)*0.1}}/>))}</>;
export const Zzz: React.FC<{x:number;y:number}> = ({x,y}) => { const frame = useCurrentFrame(); return <div style={{position:'absolute', left:x, top:y - (frame%60), fontSize:40, fontWeight:900, color:'#93c5fd', opacity: interpolate(frame%60,[0,60],[1,0])}}>Z</div> };
export const SweatDrops: React.FC<{x:number;y:number}> = ({x,y}) => { const frame = useCurrentFrame(); return <>{[0,1,2].map(i=>(<div key={i} style={{position:'absolute', left:x+i*15, top:y+((frame*2+i*20)%40), width:10, height:14, background:'#38bdf8', borderRadius:'50% 50% 50% 50% / 60% 60% 40% 40%'}}/>))}</> };
export const Confetti: React.FC = () => { const frame = useCurrentFrame(); const colors=['#ef4444','#f59e0b','#22c55e','#3b82f6','#ec4899'];
  return <>{Array.from({length:70},(_,i)=>{ const x=(i*137)%1920; const y=(frame*3 + i*53)%1080; const rot=frame*5+i*20;
  return <div key={i} style={{position:'absolute', left:x, top:y, width:14, height:20, background:colors[i%5], transform:`rotate(${rot}deg)`, opacity:0.9}}/>})}</> };