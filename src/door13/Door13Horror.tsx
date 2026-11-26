import { Lens } from "../horror/Lens";
import { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import * as T from "three";
import { direct } from "../horror/camera";
import { hotel } from "../horror/hotel";
import { ease } from "../horror/model";
import { shots } from "./shots";
import { captions } from "./captions";

function SetAndCamera({ f }: { f: number }) {
  const zone = f < 840 || f >= 2661 ? "lobby" : f < 1650 ? "hall" : "archive";
  const set = useMemo(() => hotel(zone), [zone]);
  const { camera, scene } = useThree();
  useLayoutEffect(() => {
    const {
      dan,
      girl,
      creature,
      contact,
      dust,
      phone,
      doors,
      hinge,
      rain,
      receiver,
      clockA,
      clockB,
    } = set;
    const step = (a: number, b: number) => ease((f - a) / (b - a));
    const t = f / 30,
      walk =
        zone === "hall"
          ? (1 - step(1100, 1170)) * step(840, 860) + step(1590, 1610)
          : 0;
    const fear = f < 510 ? 0.13 : f < 840 ? 0.57 : f < 1200 ? 0.41 : 0.92;
    dan.pose(
      f,
      fear,
      walk,
      zone === "hall"
        ? step(1330, 1390) * (1 - step(1425, 1460))
        : zone === "archive"
          ? step(2208, 2250)
          : 0,
    );
    dan.root.position.set(
      zone === "lobby"
        ? -0.64
        : zone === "archive"
          ? 0.54 * step(2040, 2100)
          : 0.06,
      0,
      zone === "lobby"
        ? -0.13
        : zone === "hall"
          ? 1.8 - 6.58 * step(840, 1170) - 1.8 * step(1590, 1649)
          : -0.13 - 0.7 * step(2040, 2100),
    );
    dan.root.rotation.y =
      zone === "hall"
        ? Math.PI +
          0.24 * Math.sin(t * 0.6) -
          2.5 * step(1444, 1510) +
          2.5 * step(1570, 1610)
        : zone === "archive"
          ? -0.35 + 0.6 * Math.sin(t * 0.6)
          : 0.15 + 0.36 * step(480, 515);
    contact.position.set(dan.root.position.x, 0.006, dan.root.position.z);
    girl.root.visible = zone === "lobby" && f >= 510 && f < 728;
    girl.pose(f, 0, 0, step(580, 640));
    girl.root.rotation.y = 0.47;
    creature.root.visible =
      (zone === "hall" && f >= 1485 && f < 1610) ||
      (zone === "archive" && f >= 2505);
    creature.pose(f, 1, 1);
    creature.root.rotation.set(zone === "hall" ? -Math.PI * 0.53 : 0, 0, 0);
    creature.root.position.set(
      zone === "hall" ? 0.2 * Math.sin(t) : 0.26,
      zone === "hall" ? 2.85 : 0,
      zone === "hall" ? 0.65 - 1.2 * step(1485, 1590) : -2.05,
    );
    clockA.visible = f < 2220;
    clockB.visible = f >= 2220;
    if (zone === "archive") {
      const lift = step(2241, 2288);
      receiver.position.set(
        0.66 + 0.04 * lift,
        1.085 + 0.54 * lift,
        -1.49 + 0.66 * lift,
      );
      receiver.rotation.z = lift * 1.06;
    }
    hinge.rotation.y =
      zone === "hall"
        ? -1.47 * step(1590, 1641)
        : -1.2 * (1 - step(2460, 2535));
    doors.forEach((d, i) => {
      d.position.x =
        (i ? 1 : -1) * 0.81 * step(510, 563) * (1 - step(780, 837));
      d.position.y = -0.42 * step(803, 839);
    });
    phone.position.x =
      -0.55 + 0.0025 * Math.sin(f * 2.1) * Math.max(0, Math.cos(f * 0.09));
    rain.children.forEach(
      (o, i) =>
        (o.position.y =
          1.28 + ((((i * 0.373 - f * 0.026) % 1.86) + 1.86) % 1.86)),
    );
    dust.position.set(
      0.16 * Math.sin(t * 0.3),
      1.7 + 0.11 * Math.sin(t * 0.43),
      -0.8 + 0.2 * Math.cos(t * 0.22),
    );
    scene.background = new T.Color("#182432");
    scene.fog = new T.FogExp2("#263344", zone === "hall" ? 0.1 : 0.058);
    direct(camera as T.PerspectiveCamera, shots, f);
  }, [f, zone, set, camera, scene]);
  return <primitive object={set.root} />;
}
export function Door13Horror() {
  const f = useCurrentFrame(),
    caption = captions.find(([a, b]) => f >= a && f < b);
  const black = (f >= 723 && f < 734) || (f >= 738 && f < 741);
  return (
    <AbsoluteFill style={{ background: "#121b27" }}>
      <ThreeCanvas
        width={1080}
        height={1920}
        gl={{ antialias: true, alpha: false }}
        camera={{ fov: 48, near: 0.012, far: 55 }}
      >
        <SetAndCamera f={f} />
        <Lens frame={f} />
      </ThreeCanvas>
      <AbsoluteFill
        style={{
          background: black
            ? "#06090c"
            : "radial-gradient(ellipse at 50% 42%,transparent 42%,rgba(7,10,17,.28) 99%)",
          pointerEvents: "none",
        }}
      />
      {caption && (
        <div
          style={{
            position: "absolute",
            left: "9%",
            right: "9%",
            bottom: "16%",
            textAlign: "center",
            font: "650 51px/1.16 Arial, sans-serif",
            color: /13|himself|mother|never/i.test(caption[2])
              ? "#ffe4b0"
              : "#fff8ed",
            textShadow: "0 3px 8px #080b10,0 0 18px #000",
            transform:
              "translateY(" + (1 - ease((f - caption[0] + 1) / 4)) * 6 + "px)",
          }}
        >
          {caption[2]}
        </div>
      )}
      <Audio src={staticFile("door13/mix.m4a")} />
    </AbsoluteFill>
  );
}
