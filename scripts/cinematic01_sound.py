"""Rebuild the original ten-second forest sound bed using Python 3."""
import math
from array import array
from pathlib import Path
import random
import sys
import wave

rate = 32000
length = 10
rng = random.Random(7102)
samples = [0.0] * (rate * length)
tau = 2 * math.pi

def event(start, duration, synth):
    begin = round(start * rate)
    for i in range(round(duration * rate)):
        n = begin + i
        if 0 <= n < len(samples):
            samples[n] += synth(i / rate)

wind = 0
for i in range(len(samples)):
    t = i / rate
    wind = .978 * wind + .022 * rng.uniform(-1, 1)
    # Gusting canopy and a low bowed interval under the creaking door.
    threat = max(0, min(1, (t - 4.7) / 2.1))
    samples[i] = wind * (.29 + .11 * math.sin(t * 1.7)) + threat * (
        .034 * math.sin(tau * 55 * t + .27 * math.sin(t * 1.6))
        + .023 * math.sin(tau * 82.6 * t))

for start in [.18, .48, 1.37, 2.25, 2.52, 3.66, 4.77]:
    freq = rng.uniform(1600, 2700)
    event(start, .16, lambda t: .045 * math.sin(math.pi*t/.16)**2
          * math.sin(tau*(freq*t + 1700*t*t) + .8*math.sin(90*t)))

for frame in list(range(0, 110, 10)) + list(range(250, 300, 7)):
    level = .20 if frame >= 250 else .13
    event(frame/30, .16, lambda t: level * math.exp(-29*t) *
          (math.sin(tau*(82*t-102*t*t))+.6*rng.uniform(-1,1)) * min(1,t*900))
for frame in [184, 202, 216, 231, 248, 263, 275, 291]:
    event(frame/30, .23, lambda t: .12 * math.exp(-19*t) *
          (math.sin(tau*61*t)+.65*rng.uniform(-1,1))*min(1,t*600))

for start,duration,pitch,gain in [(3.55,.27,290,.08),(5.71,.96,165,.125)]:
    event(start,duration,lambda t: gain * math.sin(math.pi*t/duration)**1.3 *
          (math.sin(tau*(pitch*t+41*t*t)+1.5*math.sin(60*t))+
           .31*math.sin(tau*pitch*2.03*t)) * (.8+.2*math.sin(43*t)))
event(7.86,.65,lambda t: .22*math.exp(-6*t)*math.sin(tau*(72*t-21*t*t))*min(1,t*120))
event(8.03,.31,lambda t: .078*math.sin(math.pi*t/.31)**2*rng.uniform(-1,1))

pcm = array('h', (round(max(-1,min(1,s * 1.85 * min(1,i/740,(len(samples)-i)/2200)))*32767)
                  for i,s in enumerate(samples)))
if sys.byteorder != 'little':
    pcm.byteswap()
out = Path(__file__).resolve().parents[1] / 'public/cinematic01/alder-forest.wav'
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out),'wb') as wav:
    wav.setparams((1,2,rate,0,'NONE','not compressed'))
    wav.writeframes(pcm.tobytes())
