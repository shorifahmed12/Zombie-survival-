import { Composition } from "remotion";
import { episodeFrames } from "./survival";
import { ZombieSurvival, shots } from "./ZombieSurvival";

export const RemotionRoot = () => {
  const fps = 30,
    durationInFrames = episodeFrames(shots, fps);
  const common = { component: ZombieSurvival, fps, durationInFrames };
  return (
    <>
      <Composition id="ZombieSurvival" {...common} width={1920} height={1080} />
      <Composition
        id="StickmanSurvival"
        {...common}
        width={1920}
        height={1080}
      />
      <Composition
        id="StickmanSurvivalShort"
        {...common}
        width={1080}
        height={1920}
      />
    </>
  );
};
