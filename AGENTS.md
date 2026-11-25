# Zombie Survival production standards

## Source and branches

Keep each cinematic in its own directory under `src/`. Register it in `src/RemotionRoot.tsx` with a stable composition ID. Preserve existing composition IDs, durations and source assets when adding a film. Work on a development branch and obtain the owner's approval before merging into `main`.

Use the repository's pinned Remotion, React and TypeScript versions. Generate character and environment art with SVG. Keep choreography, rig geometry, scenery and the composition entry point independently editable.

## Animation and staging

- Author cinematic masters at 1920 × 1080 and 30 fps. Specify durations as integer frame counts. A ten-second timeline contains frames 0 through 299.
- Derive every animated property from the current composition frame. Use stable seeds for procedural detail so scrubbing, concurrency and out-of-order renders produce the same image.
- Specify stance contacts in world coordinates. Interpolate a foot only during swing, solve the knee and elbow with two-bone IK, and keep limb targets within reach. Apply camera transforms after posing the character.
- Give humans and infected characters independent cadence, stride, posture and reactions. Infected characters have light-green skin and opaque white eyes. Preserve a recognizable stick figure silhouette, readable expressions and separation between near and far limbs.
- Stage action in foreground, subject and background layers. Tie shadows to physical contacts, assign parallax by depth and check that vegetation, fog and particles preserve the focal action.
- Use original or appropriately licensed sound. The forest bed, creaking door and footfalls for this film can be regenerated with `python3 scripts/cinematic01_sound.py`.

## Render review

Run the TypeScript check from the repository root. Inspect actual frames at native aspect ratio, including action transitions. Check planted feet, motion across cuts, the doorway occlusion and character silhouettes in motion. Verify the delivered encode's duration, resolution, frame rate and frame count.

For the first cinematic:

```sh
npm ci
npx tsc --noEmit
npx remotion render src/index.ts ZombieSurvivalCinematic01 out/ZombieSurvivalCinematic01.mp4 --crf=16 --jpeg-quality=95
npx remotion render src/index.ts ZombieSurvivalCinematic01 out/previews --sequence --frames=0,60,120,180,240,297 --image-format=png
```

The entry is `src/cinematic01/Scene.tsx`. Contact schedules, character poses and camera cuts live in `motion.ts`. The camera uses world units in a 1280 × 720 SVG viewBox, which Remotion rasterizes at the composition resolution.
