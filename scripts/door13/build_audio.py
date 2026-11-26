import json, subprocess
import numpy as np
from pathlib import Path
# Source in/out, output start/end. Pauses between cues belong to the score.
edits=[(0,6.94,0,6.94),(6.94,11.1,6.94,10.34),(11.45,20.37,10.34,17),(20.65,27.55,17,22.5),(27.62,35.1,22.5,28),(35.45,38.88,28.8,32.6),(38.95,42.8,34.7,39.6),(43,48.1,40,45),(48.4,52.73,45.2,49.4),(52.74,57.55,49.5,53),(57.85,60.01,53,55),(60.3,63,55.4,58.3),(63.13,66.29,61,64.7),(66.5,70.49,69,73.1),(70.65,73.35,74,76.9),(73.37,76.91,77.9,81.65),(76.92,79.91,82,84.45),(79.92,85.31,84.45,89.35)]
sr=44100
out=np.zeros(sr*90,np.float32)
for a,b,c,d in edits:
 data=subprocess.check_output(['ffmpeg','-loglevel','error','-ss',str(a),'-i','public/door13/narration.mp3','-t',str(d-c),'-af',f'atrim=duration={b-a},atempo={(b-a)/(d-c)},aresample={sr}','-ac','1','-f','f32le','-'])
 v=np.frombuffer(data,'<f4').copy();v[:120]*=np.linspace(0,1,120);v[-180:]*=np.linspace(1,0,180);i=round(c*sr);out[i:i+len(v)]+=v
t=np.arange(out.size)/sr;rng=np.random.default_rng(13);rain=rng.normal(0,.007,t.size)
fx=.011*np.sin(2*np.pi*46*t+.4*np.sin(t))+.007*np.sin(2*np.pi*69.4*t)+rain
for at in [0,.53,1.06,46.9,47.36,89.52]:
 u=t-at;fx+=.056*np.sin(2*np.pi*106*u)*np.clip(1-u/.34,0,1)*(u>0)
for hz in [640,958]:fx+=.041*np.sin(2*np.pi*hz*(t-16.7))*np.exp(-2*np.maximum(t-16.7,0))*(t>16.7)
for at in np.arange(29,37,.63):
 u=t-at;fx+=.05*np.sin(2*np.pi*71*u)*np.exp(-22*np.maximum(u,0))*(u>0)
out=np.clip(out+fx,-.98,.98)
p=subprocess.run(['ffmpeg','-loglevel','error','-f','f32le','-ar',str(sr),'-ac','1','-i','-','-c:a','aac','-b:a','160k','-y','public/door13/mix.m4a'],input=out.astype('<f4').tobytes(),check=True)
words=[]
for s in json.loads(Path(__file__).with_name('words.json').read_text()):
 w=s['text'].strip().replace('3.13','3:13').replace('3.12','3:12')
 if not w:continue
 x=s['offsets']['from']/1000;y=s['offsets']['to']/1000
 a,b,c,d=min(edits,key=lambda e:max(e[0]-x,x-e[1],0))
 conv=lambda z:round(30*(c+(max(a,min(z,b))-a)*(d-c)/(b-a)))
 words.append((conv(x),max(conv(x)+1,conv(y)),w))
caps=[];g=[]
for i,w in enumerate(words):
 g.append(w)
 if len(g)>=5 or (len(g)>=2 and (w[2][-1] in '.,!?"' or i+1<len(words) and words[i+1][0]-w[1]>9)) or i==len(words)-1:
  caps.append([g[0][0],g[-1][1],' '.join(t[2] for t in g)]);g=[]
Path('src/door13/captions.ts').write_text('export const captions: [number,number,string][] = '+json.dumps(caps,indent=1)+';\n')
