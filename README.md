# Zombie Survival

Make original 2D stickman survival episodes by replacing **[src/ZombieSurvival.tsx](src/ZombieSurvival.tsx)**. The character rigs, motion, props, environments and cameras live in [src/survival](src/survival). Every shot uses the same library. The episode length follows the shot list automatically.

[Watch the 10-second example](examples/relay-six.mp4) · [Compare the character rigs](examples/rig-comparison.jpg) · [Visual workflow](assets/workflows/survival-visuals.md)

## Start a new episode in ordinary chat

Give the chat this repository and paste the prompt below. If it cannot open GitHub, paste [the API types](src/survival/types.ts) and [the example episode](src/ZombieSurvival.tsx) into the chat.

> Read the README, src/survival/types.ts and src/ZombieSurvival.tsx in shorifahmed12/Zombie-survival-. Write one complete replacement for src/ZombieSurvival.tsx. Keep the named exports shots and ZombieSurvival. Use the existing Episode component and only the documented actions, gear, characters, props and locations. Use shot-local seconds, preserve character positions across cuts, and frame both landscape and portrait. Return a single TSX code block. My episode idea and duration are: [describe the story].

Paste the result into that one file and commit it. Keep previous episodes in Git history by committing each version with the episode title.

## Preview and render

Open a current checkout in a Codespace or on a computer using Node 22.13+ from the 22.x line, or Node 24+. Open the terminal in the directory containing package.json.

```sh
npm ci
npm run dev
```

Open the Studio preview and select **ZombieSurvival**. To make an MP4, open another terminal in the same folder.

```sh
npm run render
```

The landscape file is `out/ZombieSurvival.mp4`. For portrait use `npm run render:short`; the output is `out/ZombieSurvivalShort.mp4`. In a Codespace, open the Files panel, find the file under `out`, and select Download. The render machine needs a supported Chromium browser; Remotion normally downloads its browser on first render. The source art itself uses local SVG shapes and system fonts.

## Episode file

```tsx
import {Episode, type Shot} from './survival';

export const shots: Shot[] = [{
  name: 'Wait under the bridge',
  seconds: 5,
  location: 'underpass',
  weather: 'ash',
  camera: {x: 550, y: 431, zoom: 1.65},
  portraitCamera: {x: 543, y: 431, zoom: 1.4},
  props: [{kind: 'barrier', x: 630}],
  actors: [{
    role: 'mechanic', x: 485, scale: 1.5, gear: 'radio',
    cues: [
      {at: 0, action: 'sneak', expression: 'focused'},
      {at: 2.0, action: 'crouch'},
      {at: 3.2, action: 'listen', expression: 'alarmed'},
    ],
  }],
}];

export const ZombieSurvival = () => <Episode shots={shots}/>;
```

| Control | Available values |
| --- | --- |
| Character | scout, mechanic, drifter, hollow |
| Travel | walk, run, sneak, shamble, stumble |
| Stationary action | idle, listen, crouch, reach, recoil |
| One-off action | jump, fall, rise |
| Expression | calm, focused, alarmed, exhausted |
| Handheld gear | torch, radio, none |
| Location | relay, marsh, underpass |
| Prop | beacon, marker, crate, barrier |
| Weather | clear, drizzle, ash |

**Staging.** Coordinates use a 1280 × 720 landscape world at zoom 1. An actor's x and y mark the ground between their feet. The default ground y is 548. At scale 1 an upright actor is about 130 world units tall. Larger y values draw in front. Set actor facing to left or right. A cue may change facing for a turn. Use phase values such as 0, 0.23 and 0.51 to give a group different strides.

**Timing.** Start with at least one positive-length shot. List cues in increasing seconds from the start of each shot. Characters start idle. A cue holds until the next one. Moving actions advance the actor automatically in the facing direction. At scale 1 the scout walks about 45 world units per second and runs about 143. Multiply by scale to predict the next cut position. Set each new shot's starting position explicitly. A jump takes about 0.9 s with anticipation and landing. A fall settles in 0.55 s and holds until the next cue. Follow it with rise for an approximately 0.8 s recovery.

**Framing.** Camera x and y identify the center of the shot. Zoom 1 shows the whole landscape width; zoom 2 shows half. Use endCamera for a smooth move. For steady tracking alongside a runner, set cameraEase to linear. A portrait frame shows 405 world units across at zoom 1. Set portraitCamera and, for a tracking move, portraitEndCamera to keep the subject in view. A beacon with onAt lights at that shot-local second. Omit onAt to start lit.

**Render checks.** Run `npm run lint` to catch mistyped asset names and invalid episode shapes. Preview one full stride and each cut in Studio. Check the flashlight follows the hand and the intended face or prop is visible in the portrait crop.

## License

This project uses Remotion. [Remotion license terms](https://www.remotion.dev/docs/license)
