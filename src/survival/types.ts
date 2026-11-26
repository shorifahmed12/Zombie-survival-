export type Action =
  | "idle"
  | "walk"
  | "run"
  | "sneak"
  | "shamble"
  | "listen"
  | "crouch"
  | "reach"
  | "recoil"
  | "stumble"
  | "jump"
  | "fall"
  | "rise";
export type Role = "scout" | "mechanic" | "drifter" | "hollow";
export type Expression = "calm" | "focused" | "alarmed" | "exhausted";
export type Gear = "torch" | "radio" | "none";
export type Location = "relay" | "marsh" | "underpass";
export type Weather = "clear" | "drizzle" | "ash";
export type Camera = { x: number; y: number; zoom: number };

export interface Cue {
  at: number;
  action: Action;
  facing?: "left" | "right";
  expression?: Expression;
}
export interface Actor {
  role: Role;
  x: number;
  y?: number;
  scale?: number;
  facing?: "left" | "right";
  gear?: Gear;
  /** Cycle offset in turns. Different offsets break up a crowd's march. */
  phase?: number;
  cues: Cue[];
}
export interface Prop {
  kind: "beacon" | "barrier" | "crate" | "marker";
  x: number;
  y?: number;
  scale?: number;
  /** For a beacon, seconds into the shot at which the light comes on. */
  onAt?: number;
}
export interface Shot {
  name: string;
  seconds: number;
  location: Location;
  camera: Camera;
  endCamera?: Camera;
  cameraEase?: "smooth" | "linear";
  portraitCamera?: Camera;
  portraitEndCamera?: Camera;
  weather?: Weather;
  props?: Prop[];
  actors: Actor[];
}
