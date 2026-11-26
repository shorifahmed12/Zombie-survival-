import type { Action, Actor, Expression } from "./types";

type Gait = {
  rate: number;
  span: number;
  lift: number;
  stance: number;
  lean: number;
  swing: number;
};
const still: Gait = {
  rate: 0,
  span: 0,
  lift: 0,
  stance: 0.58,
  lean: 0,
  swing: 0,
};
const gaits: Record<Action, Gait> = {
  jump: still,
  fall: still,
  rise: still,
  idle: still,
  listen: still,
  crouch: still,
  reach: still,
  recoil: still,
  walk: { rate: 1.08, span: 24, lift: 9, stance: 0.58, lean: 4, swing: 28 },
  run: { rate: 1.82, span: 33, lift: 21, stance: 0.42, lean: 14, swing: 56 },
  sneak: { rate: 0.78, span: 16, lift: 6, stance: 0.65, lean: 11, swing: 16 },
  shamble: { rate: 0.73, span: 16, lift: 6, stance: 0.67, lean: 14, swing: 19 },
  stumble: {
    rate: 1.27,
    span: 19,
    lift: 14,
    stance: 0.53,
    lean: 21,
    swing: 31,
  },
};
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ease = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};
const tau = Math.PI * 2;
type Point = { x: number; y: number };

function step(turns: number, gait: Gait, offset: number, limp: boolean): Point {
  const phase = (((turns + offset) % 1) + 1) % 1;
  if (phase < gait.stance) {
    return { x: gait.span * (0.5 - phase / gait.stance), y: 0 };
  }
  const swing = (phase - gait.stance) / (1 - gait.stance);
  return {
    x: gait.span * (ease(swing) - 0.5),
    y: -Math.sin(Math.PI * swing) * gait.lift * (limp ? 0.42 : 1),
  };
}

// Solve the knee from the hip and a planted ankle. The positive bend faces screen right.
export function knee(hip: Point, ankle: Point): Point {
  const dx = ankle.x - hip.x,
    dy = ankle.y - hip.y;
  const distance = Math.max(0.01, Math.hypot(dx, dy));
  const bend = Math.sqrt(Math.max(0, 24.5 ** 2 - (distance / 2) ** 2));
  return {
    x: (hip.x + ankle.x) / 2 + (dy / distance) * bend,
    y: (hip.y + ankle.y) / 2 - (dx / distance) * bend,
  };
}
function pose(action: Action, turns: number, t: number, age: number) {
  const gait = gaits[action],
    wave = Math.sin(turns * tau);
  const startle = action === "recoil" ? Math.exp(-age * 3.2) : 0;
  const air =
    action === "jump" ? Math.sin(Math.PI * clamp((age - 0.15) / 0.55)) : 0;
  const load =
    action === "jump"
      ? Math.max(0, 1 - Math.abs(age - 0.12) / 0.12) * 9 +
        Math.max(0, 1 - Math.abs(age - 0.75) / 0.12) * 7
      : 0;
  const down =
    action === "fall"
      ? ease(age / 0.55)
      : action === "rise"
        ? 1 - ease(age / 0.8)
        : 0;
  const low = action === "crouch" ? 19 : action === "sneak" ? 9 : 0;
  const drift = action === "shamble" ? 3 * Math.sin(turns * tau + 0.7) : 0;
  const feet = [
    step(turns, gait, 0, false),
    step(turns, gait, 0.5, action === "shamble"),
  ];
  const near =
    action === "listen"
      ? -76
      : action === "reach"
        ? -76
        : action === "recoil"
          ? -58
          : action === "shamble"
            ? -41
            : -7;
  const elbow =
    action === "listen"
      ? -93
      : action === "reach"
        ? -13
        : action === "run"
          ? -75
          : action === "shamble"
            ? -29
            : -30;
  return {
    airborne: -air * 31,
    tumble: down * 83,
    hipY:
      -51 +
      low +
      load +
      air * 10 +
      Math.abs(wave) * gait.lift * 0.19 +
      Math.sin(t * 2.6) * 0.55 +
      5 * startle,
    lean: -gait.lean - drift + 19 * startle + (action === "reach" ? -11 : 0),
    head:
      (action === "listen" ? -9 : action === "crouch" ? 8 : 0) +
      drift * 0.8 +
      Math.sin(t * 2) * 1.3,
    nearArm: near + wave * gait.swing,
    farArm: 9 - wave * gait.swing,
    elbow,
    farElbow: action === "run" ? -81 : -25,
    nearX: feet[0].x + 3,
    nearY: feet[0].y - 6,
    farX: feet[1].x - 4,
    farY: feet[1].y - 7,
  };
}
type Pose = ReturnType<typeof pose>;
export function performance(actor: Actor, time: number) {
  let start = 0,
    travel = 0,
    turns = actor.phase ?? 0;
  let facing = actor.facing ?? "right";
  let current: Action = "idle",
    previous: Action = "idle",
    expression: Expression = "calm";
  let previousAge = 0;
  const advance = (dt: number) => {
    const gait = gaits[current];
    turns += dt * gait.rate;
    travel +=
      ((facing === "left" ? -1 : 1) * dt * gait.rate * gait.span) / gait.stance;
  };
  for (const cue of actor.cues) {
    if (cue.at > time) break;
    previousAge = cue.at - start;
    advance(previousAge);
    previous = current;
    current = cue.action;
    start = cue.at;
    facing = cue.facing ?? facing;
    expression = cue.expression ?? expression;
  }
  const age = Math.max(0, time - start);
  const boundaryTurns = turns;
  advance(age);
  const result = pose(current, turns, time, age);
  if (start > 0 && age < 0.16) {
    const prior = pose(previous, boundaryTurns, start, previousAge);
    for (const key of Object.keys(result) as (keyof Pose)[])
      result[key] = mix(prior[key], result[key], ease(age / 0.16));
  }
  return { pose: result, travel, expression, facing };
}
