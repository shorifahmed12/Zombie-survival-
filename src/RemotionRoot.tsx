import { Door13Horror } from "./door13/Door13Horror";
import { Composition } from "remotion";
import { episodeFrames } from "./survival";
import { ZombieSurvival, shots } from "./ZombieSurvival";

export const RemotionRoot = () => {
  const fps = 30,
    durationInFrames = episodeFrames(shots, fps);
  const common = { component: ZombieSurvival, fps, durationInFrames };
  return (
    <>
      <Composition
        id="Door13Horror"
        component={Door13Horror}
        durationInFrames={2700}
        width={1080}
        height={1920}
        fps={30}
      />
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
