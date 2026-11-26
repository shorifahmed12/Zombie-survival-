import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const hash=(n:number)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const ground=850;
type P={x:number;y:number};
function knee(a:P,b:P,l:number,m:number,side:number):P{
 const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(.001,Math.hypot(dx,dy)),q=Math.max(-l,Math.min(l,(l*l-m*m+d*d)/(2*d))),h=Math.sqrt(Math.max(0,l*l-q*q));
 return {x:a.x+dx/d*q-dy/d*h*side,y:a.y+dy/d*q+dx/d*h*side};
}
const Rig:React.FC<{x:number;y:number;t:number;speed:number;z?:boolean;scale?:number;jump?:number}>=({x,y,t,speed,z=false,scale=1,jump=0})=>{
 const stride=z?65:speed>150?145:75, period=stride/Math.max(speed,1),phase=t/period;
 const hip={x:0,y:-112+Math.sin(phase*2*Math.PI)*4}, shoulder={x:z?19:speed>150?25:5,y:hip.y-83};
 const leg=(offset:number)=>{const p=((phase+offset)%1+1)%1;const stance=.62;const foot={x:p<stance?stride*(.5-p/stance):stride*(-.5+(p-stance)/(1-stance)),y:p<stance?0:-Math.sin(Math.PI*(p-stance)/(1-stance))*(speed>150?48:20)};const k=knee(hip,foot,70,70,-1);return 'M '+hip.x+' '+hip.y+' L '+k.x+' '+k.y+' L '+foot.x+' '+foot.y+' l 18 0';};
 const arm=(offset:number)=>{const a=Math.sin((phase+offset)*Math.PI*2);return 'M '+shoulder.x+' '+shoulder.y+' l '+(z?42:a*43)+' '+(z?15:48)+' l '+(z?46:-a*25+15)+' '+(z?8:32);};
 return <g transform={`translate(${x} ${y-jump}) scale(${scale})`} strokeLinecap="round" strokeLinejoin="round" fill="none">
 <ellipse cx="0" cy={jump/scale+3} rx={62} ry={12} fill="#080b10" opacity={.5}/>
 <g stroke={z?'#303e39':'#303b49'} strokeWidth={13}><path d={leg(.5)}/><path d={arm(.5)}/></g>
 <g stroke={z?'#728276':'#b5c4cc'} strokeWidth={15}><path d={leg(0)}/><path d={`M ${hip.x} ${hip.y} L ${shoulder.x} ${shoulder.y}`}/><path d={arm(0)}/></g>
 {!z&&<rect x={shoulder.x-36} y={shoulder.y+4} width="32" height="64" rx="10" fill="#544e3e" stroke="#252b30" strokeWidth="5"/>}
 <circle cx={shoulder.x+5} cy={shoulder.y-34} r="29" fill={z?'#65776a':'#aebcc5'} stroke="#182229" strokeWidth="6"/>
 <path d={`M ${shoulder.x+10} ${shoulder.y-39} h 13`} stroke={z?'#ff5544':'#182229'} strokeWidth="5"/>
 </g>;
};
export const ZombieTrailer:React.FC=()=>{
 const f=useCurrentFrame(),t=f/30,scene=Math.min(5,Math.floor(t/5)),s=t-scene*5;
 const run=t>=15, speed=run?260:85, hero= t<5?-250: t<15?320+(t-5)*85:1170+(t-15)*260;
 const cam=t<5?s*42:hero-650, jump=t>=21&&t<=22.2?Math.sin((t-21)/1.2*Math.PI)*190:0;
 const title=clamp((t-26.5)*1.5), fade=Math.min(1,t*2,(30-t)*2);
 return <AbsoluteFill style={{backgroundColor:'#10171e',fontFamily:'Arial, sans-serif'}}>
 <svg viewBox="0 0 1920 1080" width="100%" height="100%">
 <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#182635"/><stop offset="1" stopColor="#9c5945"/></linearGradient><linearGradient id="road" x2="0" y2="1"><stop stopColor="#343b3c"/><stop offset="1" stopColor="#10161b"/></linearGradient><radialGradient id="vig"><stop offset=".45" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".8"/></radialGradient></defs>
 <rect width="1920" height="1080" fill="url(#sky)"/><circle cx="1450" cy="280" r="135" fill="#e59b69" opacity=".45"/>
 {[0,1,2].map(layer=><g key={layer} transform={`translate(${-((cam*(.18+layer*.22))%520+520)%520} 0)`} opacity={.55+layer*.2}>{Array.from({length:7},(_,i)=>{const n=i+layer*17,w=170+hash(n)*190,h=230+hash(n+90)*430,x=i*520;return <g key={i}><path d={`M ${x} 780 V ${780-h} l ${w*.3} -25 ${w*.3} 28 ${w*.4} -15 V 780 Z`} fill={['#45505a','#303b43','#202a31'][layer]}/>{Array.from({length:18},(_,j)=><rect key={j} x={x+18+j%3*w/3} y={810-h+Math.floor(j/3)*49} width="25" height="29" fill={hash(n*19+j)>.85?'#ad7650':'#111a21'} opacity=".65"/>)}</g>;})}</g>)}
 <rect y="780" width="1920" height="300" fill="url(#road)"/>
 {Array.from({length:12},(_,i)=><path key={i} d={`M ${i*230-cam%230} 945 l 95 0`} stroke="#9a8d6e" strokeWidth="7" opacity=".4"/>)}
 {Array.from({length:45},(_,i)=><ellipse key={i} cx={((i*137-cam)%2100+2100)%2100} cy={865+hash(i)*180} rx={4+hash(i+2)*20} ry="4" fill="#0e1418"/>)}
 <g transform={`translate(${4200-cam} 0)`}><path d="M -100 850 L -100 805 -60 790 -20 742 85 742 130 790 170 805 170 850Z" fill="#343e42" stroke="#151b20" strokeWidth="8"/><path d="M -10 752 H 75 L 105 787 H -40Z" fill="#70868b"/><circle cx="-55" cy="845" r="27" fill="#101519"/><circle cx="120" cy="845" r="27" fill="#101519"/></g>
 {t>=10&&Array.from({length:7},(_,i)=>{const zX=hero-210-i*135+Math.sin(t+i)*25;return <Rig key={i} x={zX-cam} y={ground+i%3*12} t={t+i*.17} speed={run?210:65} z scale={.83+i%3*.07}/>;})}
 {t>=5&&<Rig x={hero-cam} y={ground} t={t} speed={speed} jump={jump}/>}
 {Array.from({length:60},(_,i)=><circle key={i} cx={(hash(i+200)*1920+t*(12+hash(i)*22))%1920} cy={hash(i+400)*1080} r={1+hash(i+3)*3} fill="#dfb49b" opacity={.1+hash(i)*.3}/>)}
 <rect width="1920" height="1080" fill="url(#vig)"/><rect width="1920" height="90" fill="#080a0d"/><rect y="990" width="1920" height="90" fill="#080a0d"/>
 {t<5&&<text x="960" y="490" textAnchor="middle" fill="#d5d8d7" fontSize="40" letterSpacing="12" opacity={Math.sin(Math.PI*clamp(t/5))}>DAY 01 — NO SIGNAL</text>}
 <g opacity={title}><rect width="1920" height="1080" fill="#080c10" opacity=".87"/><text x="960" y="485" textAnchor="middle" fontSize="100" fontWeight="900" letterSpacing="8" fill="#e0e3e2">ZOMBIE SURVIVAL</text><text x="960" y="580" textAnchor="middle" fontSize="42" letterSpacing="18" fill="#e16d55">THE OUTBREAK</text><text x="960" y="720" textAnchor="middle" fontSize="25" letterSpacing="8" fill="#aab2b5">SURVIVE THE NIGHT</text></g>
 <rect width="1920" height="1080" fill="#000" opacity={1-fade}/>
 </svg></AbsoluteFill>;
};
