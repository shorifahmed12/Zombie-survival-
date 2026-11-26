import { useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "./Character";
import { Air, Foreground, Landscape, Materials, SetProp, Sky } from "./World";
import { clamp, ease, mix } from "./motion";
import type { Shot } from "./types";

export function episodeFrames(shots: Shot[], fps: number) {
  if (shots.length === 0)
    throw new Error("Add at least one shot to ZombieSurvival.tsx.");
  let frames = 0;
  for (const shot of shots) {
    if (!Number.isFinite(shot.seconds) || shot.seconds <= 0)
      throw new Error(shot.name + " needs a positive duration in seconds.");
    for (const actor of shot.actors) {
      let last = -1;
      for (const cue of actor.cues) {
        if (
          !Number.isFinite(cue.at) ||
          cue.at < 0 ||
          cue.at <= last ||
          cue.at >= shot.seconds
        )
          throw new Error(
            shot.name +
              ": cue times for " +
              actor.role +
              " must increase within the shot.",
          );
        last = cue.at;
      }
    }
    frames += Math.max(1, Math.round(shot.seconds * fps));
  }
  return frames;
}
export function StoryFrame({
  shots,
  frame,
  fps,
  width,
  height,
}: {
  shots: Shot[];
  frame: number;
  fps: number;
  width: number;
  height: number;
}) {
  const worldHeight = 720,
    worldWidth = (width / height) * worldHeight;
  let local = frame,
    shot = shots[0];
  for (const candidate of shots) {
    shot = candidate;
    const length = Math.max(1, Math.round(shot.seconds * fps));
    if (local < length) break;
    local -= length;
  }
  if (!shot) return null;
  const t = local / fps,
    clock = frame / fps,
    fraction = clamp(local / Math.max(1, Math.round(shot.seconds * fps) - 1)),
    progress = shot.cameraEase === "linear" ? fraction : ease(fraction);
  const portrait = width < height && !!shot.portraitCamera;
  const start = (portrait ? shot.portraitCamera : shot.camera) ?? shot.camera;
  const end = (portrait ? shot.portraitEndCamera : shot.endCamera) ?? start;
  const zoom = mix(start.zoom, end.zoom, progress),
    x = mix(start.x, end.x, progress),
    y = mix(start.y, end.y, progress);
  const camera = (factor: number) =>
    "translate(" +
    worldWidth / 2 +
    " 360) scale(" +
    (1 + (zoom - 1) * factor) +
    ") translate(" +
    -(640 + (x - 640) * factor) +
    " " +
    -(360 + (y - 360) * factor) +
    ")";
  const items = [
    ...(shot.props ?? []).map((prop, i) => ({
      depth: prop.y ?? 548,
      element: <SetProp key={"prop" + i} prop={prop} time={t} />,
    })),
    ...shot.actors.map((actor, i) => ({
      depth: actor.y ?? 548,
      element: <Character key={"actor" + i} actor={actor} time={t} />,
    })),
  ].sort((a, b) => a.depth - b.depth);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={"0 0 " + worldWidth + " 720"}
      style={{ display: "block", background: "#394e5c" }}
    >
      <Materials location={shot.location} />
      <g transform={camera(0.31)}>
        <Sky location={shot.location} time={clock} />
      </g>
      <g transform={camera(1)}>
        <Landscape location={shot.location} />
        {items.map((item) => item.element)}
      </g>
      <g transform={camera(1.09)}>
        <Foreground time={clock} />
      </g>
      <Air weather={shot.weather ?? "clear"} time={clock} width={worldWidth} />
      <rect
        width={worldWidth}
        height="720"
        fill="url(#falloff)"
        pointerEvents="none"
      />
    </svg>
  );
}
export function Episode({ shots }: { shots: Shot[] }) {
  const frame = useCurrentFrame(),
    { fps, width, height } = useVideoConfig();
  return (
    <StoryFrame
      shots={shots}
      frame={frame}
      fps={fps}
      width={width}
      height={height}
    />
  );
}
