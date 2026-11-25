import { Raven } from "./SettlementDetails";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Actor } from "./Actors";
import { Cabin, CabinDefs, Door } from "./Cabin";
import { ForestDefs, Sky } from "./Forest";
import { Floor, Understory } from "./Ground";
import { camera, infected, survivor, type Pose } from "./motion";
import { ease, noise, range } from "./math";

const gradients: Record<string, string[]> = {
  sky: ["#659da8", "#f6a289", "#ffda95", "#f1c894"],
  ground: ["#809556", "#9c9a58", "#537647", "#245645"],
  trail: ["#aca582", "#cfae82", "#ccae84", "#a49370"],
  bank: ["#4b6e4f", "#355b48", "#183d3b"],
  warmSkin: ["#fff0c9", "#f1d5a8", "#d9b68e"],
  sickSkin: ["#d1e9a0", "#b4d88b", "#87ab74"],
  infectedCoat: ["#768c70", "#536c5b", "#414e45"],
  raincoat: ["#fac16b", "#df9451", "#ac6941"],
  doorDark: ["#192e2e", "#273b35", "#45503c"],
};
function Definitions() {
  return (
    <defs>
      {Object.entries(gradients).map(([id, stops]) => (
        <linearGradient
          key={id}
          id={id}
          x2={id.endsWith("Skin") ? ".65" : "0"}
          y2="1"
        >
          {stops.map((c, i) => (
            <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      ))}
      <radialGradient id="fogVeil">
        <stop stopColor="#e8dbb6" stopOpacity=".57" />
        <stop offset=".53" stopColor="#e9dcbc" stopOpacity=".28" />
        <stop offset="1" stopColor="#e4ddbd" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="sunGlow">
        <stop stopColor="#fff1b9" stopOpacity=".78" />
        <stop offset=".46" stopColor="#ffda9e" stopOpacity=".38" />
        <stop offset="1" stopColor="#fbd29d" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="mist" x2="0" y2="1">
        <stop stopColor="#e3d5ae" stopOpacity="0" />
        <stop offset=".50" stopColor="#ddc9a6" stopOpacity=".4" />
        <stop offset="1" stopColor="#dcd5ae" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="ray" x1="0" x2=".8" y1="0" y2="1">
        <stop stopColor="#fff0c4" stopOpacity="0" />
        <stop offset=".45" stopColor="#ffe7ad" stopOpacity=".23" />
        <stop offset="1" stopColor="#fff1bb" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="vignette" r=".71">
        <stop offset=".50" stopColor="#183139" stopOpacity="0" />
        <stop offset="1" stopColor="#102e36" stopOpacity=".35" />
      </radialGradient>
      <radialGradient id="shadow">
        <stop stopColor="#253a36" stopOpacity=".68" />
        <stop offset="1" stopColor="#243b33" stopOpacity="0" />
      </radialGradient>
      <pattern
        id="print"
        width="119"
        height="107"
        patternUnits="userSpaceOnUse"
      >
        {range(3).map((k) => (
          <path
            key={k}
            d={range(230)
              .map(
                (i) =>
                  "M" +
                  119 * noise(i, 272 + k) +
                  " " +
                  107 * noise(i, 404 + k) +
                  "l.7 -.15",
              )
              .join("")}
            stroke={k === 1 ? "#fff2c8" : "#29332e"}
            strokeWidth={0.65 + k * 0.16}
            opacity=".20"
          />
        ))}
      </pattern>
      <ForestDefs />
      <CabinDefs />
    </defs>
  );
}
function Shade({ pose: p }: { pose: Pose }) {
  return (
    <g transform={"translate(" + p.x + " " + p.y + ") scale(" + p.size + ")"}>
      <ellipse cx="9" cy="1" rx="52" ry="9" fill="url(#shadow)" />
      <path
        d={
          "M" +
          (p.feet[0].x - 5) +
          " " +
          (p.feet[0].y + 4) +
          "l26 -2 45 9 12 5 -34 -3 -26 -5 -17 -1z"
        }
        fill="#52604e"
        opacity=".3"
      />
      {p.feet.map((a, i) => (
        <ellipse
          key={i}
          cx={a.x + 3}
          cy="2"
          rx="14"
          ry="3.1"
          fill="#394536"
          opacity={0.32 * Math.max(0, 1 - Math.abs(a.y + 3) / 22)}
        />
      ))}
    </g>
  );
}
function Dust({ frame: f, cx }: { frame: number; cx: number }) {
  return (
    <g>
      {range(70).map((i) => {
        const x =
          -70 +
          ((noise(i, 91) * 1490 +
            f * ((i % 4) + 1) * 0.08 -
            (cx - 640) * 0.12 +
            1490) %
            1490);
        const y = 140 + noise(i, 93) * 510 + Math.sin(f * 0.032 + i) * 10;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={0.5 + noise(i, 97) * 1.4}
            ry=".8"
            fill={i % 3 ? "#ffe4a5" : "#cbe4c2"}
            opacity={0.23 + 0.38 * (0.5 + 0.5 * Math.sin(f * 0.051 + i))}
          />
        );
      })}
    </g>
  );
}
export function ForestFrame({ frame: f }: { frame: number }) {
  const human = survivor(f),
    zombie = infected(f),
    cam = camera(f);
  const spill = 180 * ease(185, 207, f);
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1280 720"
      style={{ display: "block", background: "#889f9a" }}
    >
      <Definitions />
      <g
        transform={
          "translate(640 360) scale(" +
          cam.zoom +
          ") translate(" +
          -cam.x +
          " " +
          -cam.y +
          ")"
        }
      >
        <Sky frame={f} camera={cam.x} />
        <g opacity=".68">
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse
              key={i}
              cx={-290 + i * 517 + 19 * Math.sin(f / 60 + i)}
              cy={453 + (i % 3) * 14}
              rx={310}
              ry={35 + (i % 2) * 16}
              fill="url(#fogVeil)"
            />
          ))}
        </g>
        <Floor />
        <Cabin />
        {f >= 178 && (
          <>
            <defs>
              <clipPath id="threshold">
                <rect
                  x={582 - spill}
                  y={413 - spill}
                  width={75 + 3 * spill}
                  height={133 + spill * 2}
                />
              </clipPath>
            </defs>
            <g clipPath={f < 207 ? "url(#threshold)" : undefined}>
              <Shade pose={zombie} />
              <Actor pose={zombie} />
            </g>
          </>
        )}
        <Door frame={f} />
        <Raven frame={f} />
        <g
          opacity={0.64 + 0.12 * Math.sin(f / 54)}
          transform={"translate(" + Math.sin(f / 83) * 6 + " 0)"}
        >
          <path
            d="M-10 -50l104 0 432 635 -48 3z M164 -50h34l339 603 -15 5z M720 -50h45l331 640 -30 0z"
            fill="url(#ray)"
          />
        </g>
        <Shade pose={human} />
        <Actor pose={human} />
        <Understory camera={cam.x} frame={f} />
      </g>
      <Dust frame={f} cx={cam.x} />
      <rect width="1280" height="720" fill="url(#print)" opacity=".66" />
      <rect width="1280" height="720" fill="url(#vignette)" />
    </svg>
  );
}
export function ZombieSurvivalCinematic01() {
  const frame = useCurrentFrame(),
    { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <ForestFrame frame={(frame * 30) / fps} />
      <Audio src={staticFile("cinematic01/alder-forest.wav")} />
    </AbsoluteFill>
  );
}
