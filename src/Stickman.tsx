import React from 'react';
import {useCurrentFrame} from 'remotion';

export type StickmanAction = 'idle'|'walk'|'run'|'jump'|'wave'|'chop'|'eat'|'drink'|'sleep'|'sit'|'happy'|'scared'|'build';
export type Emotion = 'happy'|'scared'|'tired'|'determined'|'normal'|'sleeping';

interface Props {
  x?: number; y?: number; scale?: number; flip?: boolean;
  action?: StickmanAction; emotion?: Emotion;
  color?: string; backpack?: boolean; hat?: boolean; opacity?: number;
}

export const Stickman: React.FC<Props> = ({
  x=0, y=0, scale=1, flip=false, action='idle', emotion='normal',
  color='#111827', backpack=false, hat=false, opacity=1
}) => {
  const frame = useCurrentFrame();
  let leftArm = -10, rightArm = 10, leftLeg = 0, rightLeg = 0;
  let bodyY = 0, bodyLean = 0, bodyRotate = 0;
  const breathing = Math.sin(frame * 0.08) * 2;

  if (action === 'walk') {
    const s = Math.sin(frame * 0.25);
    leftLeg = s * 38; rightLeg = -s * 38;
    leftArm = -s * 30; rightArm = s * 30;
    bodyY = Math.abs(Math.cos(frame * 0.25)) * -6; bodyLean = 5;
  } else if (action === 'run') {
    const s = Math.sin(frame * 0.45);
    leftLeg = s * 55; rightLeg = -s * 55;
    leftArm = -s * 50; rightArm = s * 50;
    bodyY = Math.abs(Math.cos(frame * 0.45)) * -12; bodyLean = 12;
  } else if (action === 'jump') {
    const jump = Math.abs(Math.sin(frame * 0.18));
    bodyY = -jump * 45; leftLeg = -20 - jump*20; rightLeg = 20 + jump*20;
    leftArm = -150; rightArm = 150;
  } else if (action === 'wave') {
    rightArm = -160 + Math.sin(frame*0.3)*25; leftArm = -10;
  } else if (action === 'chop') {
    const chop = Math.sin(frame * 0.2);
    rightArm = -80 + chop * 60; leftArm = -30; bodyLean = chop * 10;
  } else if (action === 'eat' || action === 'drink') {
    rightArm = -130 + Math.sin(frame*0.15)*20; bodyLean = action==='drink'?15:5;
  } else if (action === 'sleep') {
    bodyRotate = 85; bodyY = 30;
  } else if (action === 'sit') {
    leftLeg = 85; rightLeg = 85; leftArm = 20; rightArm = 20; bodyY = 25;
  } else if (action === 'happy' || action === 'scared') {
    leftArm = -150; rightArm = 150; bodyY = Math.abs(Math.sin(frame*0.2)) * -15;
  } else if (action === 'build') {
    const s = Math.sin(frame*0.3); rightArm = -60 + s*40; leftArm = -60 - s*40; bodyLean = 8;
  } else {
    leftArm = -8 + breathing; rightArm = 8 - breathing; bodyY = breathing * 0.5;
  }

  const mouth = emotion === 'happy' ? 'M 42 24 Q 50 32 58 24' : emotion === 'scared' ? 'M 44 28 Q 50 22 56 28' : 'M 44 25 Q 50 27 56 25';

  return (
    <div style={{position:'absolute', left:x, top:y, width:200*scale, height:320*scale, opacity, transform:`scaleX(${flip?-1:1})`, transformOrigin:'center bottom'}}>
      <svg viewBox="0 0 100 160" width={200*scale} height={320*scale}>
        <ellipse cx="50" cy="152" rx="35" ry="6" fill="rgba(0,0,0,0.25)" />
        <g transform={`translate(0 ${bodyY}) rotate(${bodyLean} 50 85) rotate(${bodyRotate} 50 85)`}>
          <g transform={`rotate(${leftLeg} 50 88)`}><line x1="50" y1="88" x2="50" y2="130" stroke={color} strokeWidth="7" strokeLinecap="round"/></g>
          <g transform={`rotate(${rightLeg} 50 88)`}><line x1="50" y1="88" x2="50" y2="130" stroke={color} strokeWidth="7" strokeLinecap="round"/></g>
          {backpack && <rect x="58" y="48" width="18" height="28" rx="6" fill="#f59e0b" stroke={color} strokeWidth="3"/>}
          <line x1="50" y1="38" x2="50" y2="88" stroke={color} strokeWidth="7" strokeLinecap="round"/>
          <g transform={`rotate(${leftArm} 50 46)`}><line x1="50" y1="46" x2="50" y2="78" stroke={color} strokeWidth="6" strokeLinecap="round"/></g>
          <g transform={`rotate(${rightArm} 50 46)`}><line x1="50" y1="46" x2="50" y2="78" stroke={color} strokeWidth="6" strokeLinecap="round"/></g>
          <g>
            <circle cx="50" cy="20" r="17" fill="white" stroke={color} strokeWidth="5"/>
            {emotion==='sleeping' ? (<><path d="M38 18 Q42 21 46 18" stroke={color} fill="none" strokeWidth="2"/><path d="M54 18 Q58 21 62 18" stroke={color} fill="none" strokeWidth="2"/></>) : (<><circle cx="43" cy="18" r="2.5" fill={color}/><circle cx="57" cy="18" r="2.5" fill={color}/></>)}
            <path d={mouth} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            {hat && <path d="M30 12 Q50 -2 70 12 L70 16 L30 16 Z" fill="#22c55e" stroke={color} strokeWidth="3"/>}
          </g>
        </g>
      </svg>
    </div>
  );
};