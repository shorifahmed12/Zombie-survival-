import { Episode, type Shot } from "./survival";

// Edit this file for each episode. Positions use the world grid; time is in seconds.
export const shots: Shot[] = [
  {
    name: "The last working relay",
    seconds: 3.1,
    location: "relay",
    weather: "drizzle",
    camera: { x: 620, y: 398, zoom: 1.38 },
    endCamera: { x: 658, y: 407, zoom: 1.51 },
    portraitCamera: { x: 507, y: 415, zoom: 1.2 },
    portraitEndCamera: { x: 604, y: 418, zoom: 1.45 },
    props: [
      { kind: "beacon", x: 646, scale: 1.25, onAt: 2.24 },
      { kind: "crate", x: 803, y: 531 },
    ],
    actors: [
      {
        role: "scout",
        x: 432,
        scale: 1.58,
        gear: "torch",
        cues: [
          { at: 0, action: "walk", expression: "focused" },
          { at: 2.2, action: "listen" },
        ],
      },
    ],
  },
  {
    name: "Something moves beyond the lamp",
    seconds: 2.1,
    location: "relay",
    weather: "drizzle",
    camera: { x: 701, y: 447, zoom: 2.65 },
    endCamera: { x: 717, y: 435, zoom: 3.12 },
    portraitCamera: { x: 742, y: 432, zoom: 1.75 },
    portraitEndCamera: { x: 722, y: 433, zoom: 1.9 },
    props: [
      { kind: "beacon", x: 646, scale: 1.25 },
      { kind: "crate", x: 803, y: 531 },
    ],
    actors: [
      {
        role: "drifter",
        x: 806,
        y: 530,
        scale: 1.42,
        facing: "left",
        phase: 0.21,
        cues: [{ at: 0, action: "shamble" }],
      },
    ],
  },
  {
    name: "Recognition",
    seconds: 1.7,
    location: "relay",
    weather: "drizzle",
    camera: { x: 574, y: 398, zoom: 4.25 },
    endCamera: { x: 581, y: 400, zoom: 4.62 },
    portraitCamera: { x: 587, y: 405, zoom: 3.35 },
    props: [{ kind: "beacon", x: 646, scale: 1.25 }],
    actors: [
      {
        role: "scout",
        x: 584,
        scale: 1.58,
        gear: "torch",
        cues: [
          { at: 0, action: "listen", expression: "focused" },
          { at: 0.35, action: "recoil", expression: "alarmed" },
        ],
      },
    ],
  },
  {
    name: "Break for cover",
    cameraEase: "linear",
    seconds: 3.1,
    location: "relay",
    weather: "drizzle",
    camera: { x: 630, y: 425, zoom: 1.72 },
    endCamera: { x: 236, y: 422, zoom: 1.52 },
    portraitCamera: { x: 619, y: 441, zoom: 1.32 },
    portraitEndCamera: { x: -82, y: 440, zoom: 1.13 },
    props: [
      { kind: "beacon", x: 646, scale: 1.25 },
      { kind: "marker", x: 175, y: 552 },
    ],
    actors: [
      {
        role: "drifter",
        x: 716,
        y: 534,
        scale: 1.43,
        facing: "left",
        cues: [
          { at: 0, action: "shamble" },
          { at: 0.84, action: "stumble" },
        ],
      },
      {
        role: "scout",
        x: 584,
        scale: 1.58,
        facing: "left",
        gear: "torch",
        cues: [{ at: 0, action: "run", expression: "alarmed" }],
      },
    ],
  },
];
export const ZombieSurvival = () => <Episode shots={shots} />;
