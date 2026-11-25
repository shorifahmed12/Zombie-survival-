import { ease, limit, mix, pathGround, point, wave, type Point } from "./math";

type Contact = {
  frame: number;
  release: number;
  x: number;
  y: number;
  lift: number;
};
export type Pose = {
  x: number;
  y: number;
  size: number;
  hip: Point;
  shoulder: Point;
  feet: [Point, Point];
  hands: [Point, Point];
  turn: number;
  tilt: number;
  alarm: number;
  scarf: number;
  blink: number;
  zombie: boolean;
};

// Integrate velocity through the braking and acceleration intervals.
export function survivorX(f: number) {
  const brake = limit((f - 83) / 20),
    launch = limit((f - 244) / 14);
  return (
    441 +
    3.95 * Math.min(f, 83) +
    79 * (brake - (brake * brake) / 2) +
    66.5 * launch * launch +
    9.5 * Math.max(0, f - 258)
  );
}
const zombieX = (f: number) =>
  612 + Math.max(0, f - 179) * 1.58 + Math.max(0, f - 234) * 0.97;
const zombieSize = (f: number) => mix(0.78, 0.98, ease(179, 238, f));
const zombieFloor = (f: number) =>
  mix(545, pathGround(zombieX(f)), ease(179, 238, f));
function footfall(
  f: number,
  release: number,
  x: number,
  y: number,
  lift: number,
): Contact {
  return { frame: f, release, x, y, lift };
}
function survivorContacts(side: number) {
  const steps: Contact[] = [];
  for (let f = -40 + side * 10; f <= 100; f += 20) {
    const x = survivorX(f + 5.3);
    steps.push(footfall(f, f + 11.6, x, pathGround(x) - 3, 19));
  }
  const rest = survivorX(104) + (side === 0 ? 13 : -14);
  const last = steps[steps.length - 1];
  // The finishing half-step settles both soles before the head turns.
  steps.push(
    footfall(
      last.frame + 20,
      side === 0 ? 243 : 247,
      rest,
      pathGround(rest) - 3,
      31,
    ),
  );
  for (let f = 250 + side * 7; f < 340; f += 14) {
    const x = survivorX(f + 2.7);
    steps.push(footfall(f, f + 5.4, x, pathGround(x) - 3, 34));
  }
  return steps;
}
function zombieContacts(side: number) {
  const steps: Contact[] = [];
  for (let f = 148 + side * 13; f <= 344; f += 27) {
    const x = zombieX(f + 6) + (side === 0 ? 2 : -3);
    steps.push(
      footfall(
        f,
        f + 16 + (side === 0 ? 1 : -1),
        x,
        zombieFloor(f + 6) - 3,
        side === 0 ? 13 : 5,
      ),
    );
  }
  return steps;
}
const humanFeet = [survivorContacts(0), survivorContacts(1)];
const infectedFeet = [zombieContacts(0), zombieContacts(1)];
function footAt(steps: Contact[], frame: number): Point {
  let i = 0;
  while (i + 1 < steps.length && steps[i + 1].frame <= frame) i++;
  const a = steps[i],
    b = steps[i + 1] ?? a;
  const phase = limit(
    (frame - a.release) / Math.max(0.001, b.frame - a.release),
  );
  const t = phase * phase * (3 - 2 * phase);
  return point(
    mix(a.x, b.x, t),
    mix(a.y, b.y, t) - Math.sin(Math.PI * phase) * a.lift,
  );
}
function feetLocal(
  tracks: Contact[][],
  f: number,
  x: number,
  y: number,
  size: number,
): [Point, Point] {
  const local = (p: Point) => point((p.x - x) / size, (p.y - y) / size);
  return [local(footAt(tracks[0], f)), local(footAt(tracks[1], f))];
}
export function survivor(f: number): Pose {
  const x = survivorX(f),
    y = pathGround(x),
    walk = 1 - ease(84, 109, f),
    run = ease(240, 257, f);
  const swing = wave((f - 2) / 20) * walk + wave((f - 250) / 14) * run;
  const listen = ease(88, 115, f) * (1 - ease(241, 255, f));
  const flinch = ease(235, 242, f) * (1 - ease(242, 252, f));
  const breath = Math.sin(f * 0.105);
  const feet = feetLocal(humanFeet, f, x, y, 1);
  const desiredHipY =
    -82 +
    5 * run -
    3 * Math.cos((f * Math.PI) / 5) * walk +
    8 * flinch -
    4 * Math.cos(((f - 252) * Math.PI) / 3.5) * run;
  // Lower the pelvis only as far as necessary to honor both shin/thigh lengths.
  const hipX = -5 * flinch;
  const reachableY = feet.map(
    (foot, i) =>
      foot.y -
      Math.sqrt(
        Math.max(0, 80.7 ** 2 - (foot.x - hipX - (i === 0 ? -3 : 2)) ** 2),
      ),
  );
  const hip = point(hipX, Math.max(desiredHipY, ...reachableY));
  const shoulder = point(
    hip.x + 5 + 18 * run - 13 * flinch - 5 * listen,
    hip.y - 40 + breath * 1.1 + run * 4,
  );
  const hand = (s: number) =>
    point(
      shoulder.x +
        s * swing * (17 + 16 * run) +
        5 +
        (s === 1 ? -28 : 12) * listen +
        8 * flinch,
      shoulder.y +
        40 -
        Math.max(0, s * swing) * (8 + 19 * run) -
        12 * run -
        (s === 1 ? 28 : 0) * listen -
        18 * flinch,
    );
  return {
    x,
    y,
    size: 1,
    hip,
    shoulder,
    feet,
    hands: [hand(-1), hand(1)],
    turn: 1 - 1.94 * ease(91, 119, f) + 1.94 * ease(241, 255, f),
    tilt: 3 * wave(f / 42) * walk - 9 * listen - 13 * flinch + 9 * run,
    alarm: Math.max(
      (0.37 + 0.21 * ease(183, 222, f)) * listen,
      flinch,
      run * 0.75,
    ),
    scarf: 3 * wave(f / 21) + run * 18,
    blink:
      1 -
      0.94 * Math.max(0, 1 - Math.abs(f - 48) / 2, 1 - Math.abs(f - 142) / 2),
    zombie: false,
  };
}
export function infected(f: number): Pose {
  const x = zombieX(f),
    y = zombieFloor(f),
    size = zombieSize(f);
  const sway = wave((f - 176) / 27),
    lurch = Math.pow((1 + sway) / 2, 2);
  const hip = point(-3, -67 + lurch * 6);
  const shoulder = point(hip.x + 15 + 8 * lurch, hip.y - 32 + 2 * wave(f / 17));
  const grab = ease(203, 224, f);
  return {
    x,
    y,
    size,
    hip,
    shoulder,
    feet: feetLocal(infectedFeet, f, x, y, size),
    hands: [
      point(shoulder.x + 13 + sway * 10, shoulder.y + 34),
      point(
        shoulder.x + 22 + 16 * grab - 3 * sway,
        shoulder.y + 19 - 18 * grab + 4 * wave(f / 19),
      ),
    ],
    turn: 0.91,
    tilt: 12 + 7 * sway,
    alarm: 0.2,
    scarf: 0,
    blink: 1,
    zombie: true,
  };
}
export function camera(f: number) {
  const x = survivorX(f);
  if (f < 102)
    return {
      x: 622 + 0.34 * (x - 441) + 8 * ease(95, 180, f),
      y: 382 + 47 * ease(75, 180, f),
      zoom: 1.01 + 0.4 * ease(65, 180, f),
    };
  if (f < 180)
    return {
      x: 790 - 47 * ease(113, 177, f),
      y: 444 + 8 * ease(105, 172, f),
      zoom: 2.7 + 0.18 * ease(102, 170, f),
    };
  if (f < 240)
    return {
      x: 713 + 20 * ease(180, 240, f),
      y: 450 - 3 * ease(180, 240, f),
      zoom: 1.82 + 0.12 * ease(180, 240, f),
    };
  return {
    x: 746 + 0.98 * (x - survivorX(240)),
    y: 426 + 2.4 * wave(f / 14) * ease(243, 259, f),
    zoom: 1.49 - 0.16 * ease(241, 282, f),
  };
}
