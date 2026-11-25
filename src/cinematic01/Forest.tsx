import { Ridge } from "./Ridge";
import { noise, range } from "./math";

// Each bough has its own asymmetric underside and a broken, sun-facing edge.
function Fir({ seed }: { seed: number }) {
  const lean = (noise(seed, 1) - 0.5) * 16;
  return (
    <g id={"fir" + seed}>
      <path
        d={"M-4 0Q1 -72 " + lean + " -168Q4 -72 5 0Z"}
        fill="currentColor"
      />
      {range(23).flatMap((i) =>
        [-1, 1].map((side) => {
          const t = (i + 1) / 25;
          const y = -163 + t * 141 + noise(i, seed + side) * 5;
          const root = lean * (1 - t),
            w = (4 + t * 37) * (0.78 + 0.48 * noise(i + side, seed));
          const tip = root + side * w,
            drop = 7 + 12 * t;
          let d =
            "M" +
            root +
            " " +
            (y - 8) +
            " Q" +
            (root + side * w * 0.36) +
            " " +
            (y + 3) +
            " " +
            tip +
            " " +
            (y + drop);
          for (let k = 0; k < 7; k++) {
            const f = k / 7;
            const a = tip - side * w * f;
            d +=
              "l" +
              -side * 1.7 +
              " " +
              (2 + 4 * noise(i * 7 + k, seed)) +
              " L" +
              (a - (side * w) / 8) +
              " " +
              (y + drop * (1 - f) + 1);
          }
          return (
            <g key={i + ":" + side}>
              <path
                d={d + "L" + root + " " + (y + 3) + "Z"}
                fill="currentColor"
              />
              {side === -1 && i % 2 === 0 && (
                <path
                  d={
                    "M" +
                    root +
                    " " +
                    (y - 5) +
                    "Q" +
                    (root - w * 0.3) +
                    " " +
                    (y + 4) +
                    " " +
                    (tip + 2) +
                    " " +
                    (y + drop - 1)
                  }
                  fill="none"
                  stroke="#f5d591"
                  opacity=".25"
                  strokeWidth="1.2"
                />
              )}
            </g>
          );
        }),
      )}
    </g>
  );
}
function Fern({ seed }: { seed: number }) {
  return (
    <g id={"fern" + seed}>
      {range(7).map((j) => {
        const angle = (j - 3) * 19 + (noise(j, seed) - 0.5) * 13;
        const length = 36 + noise(j, seed + 8) * 28;
        return (
          <g
            key={j}
            transform={"rotate(" + angle + ") scale(" + length / 50 + ")"}
            fill="currentColor"
          >
            <path
              d="M0 0Q-4 -25 2 -50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
            />
            {range(10).map((k) => {
              const y = -4 - k * 4.2,
                w = 9 * Math.sin(((k + 1) / 12) * Math.PI) + 1;
              return (
                <path
                  key={k}
                  d={
                    "M-1 " +
                    y +
                    "q-" +
                    w +
                    " -1 -" +
                    (w + 1) +
                    " -8q" +
                    w +
                    " 3 " +
                    (w + 1) +
                    " 7 q" +
                    w * 0.7 +
                    " -5 " +
                    (w + 1) +
                    " -8q-2 7 -" +
                    (w + 1) +
                    " 9"
                  }
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
export function ForestDefs() {
  return (
    <>
      {range(5).map((i) => (
        <Fir key={i} seed={i} />
      ))}
      {range(3).map((i) => (
        <Fern key={i} seed={i} />
      ))}
    </>
  );
}
function Ridgeline({
  base,
  seed,
  fill,
}: {
  base: number;
  seed: number;
  fill: string;
}) {
  const outline = range(151).map((i) => {
    const x = -650 + i * 24;
    return [
      x,
      base +
        25 * Math.sin(x / 158 + seed) +
        13 * Math.sin(x / 49) +
        noise(i, seed) * 11,
    ];
  });
  return (
    <path
      d={"M" + outline.map((p) => p.join(" ")).join("L") + "V620H-650Z"}
      fill={fill}
    />
  );
}
function Pines({
  density,
  base,
  size,
  seed,
  color,
}: {
  density: number;
  base: number;
  size: number;
  seed: number;
  color: string;
}) {
  return (
    <g color={color}>
      {range(density).map((i) => {
        const x = -670 + i * (3550 / density) + noise(i, seed) * 28,
          y = base + 13 * Math.sin(x / 90) + noise(i, seed + 1) * 17;
        const s = size * (0.46 + noise(i, seed + 2) * 0.76);
        return (
          <use
            key={i}
            href={"#fir" + (i % 5)}
            transform={"translate(" + x + " " + y + ") scale(" + s + ")"}
          />
        );
      })}
      <path
        d={
          "M-700 " +
          (base + 14) +
          "Q0 " +
          (base - 15) +
          " 900 " +
          (base + 7) +
          "T2990 " +
          base +
          "v180h-3700z"
        }
        fill={color}
      />
    </g>
  );
}
function LookoutTower() {
  return (
    <g
      transform="translate(912 332)"
      fill="#415e60"
      stroke="#415e60"
      strokeLinejoin="round"
    >
      <path
        d="M-19 3l-10 86 M15 3l10 86 M-20 12l40 57 M17 12l-42 58 M-23 47l45 0 M-17 7l35 0"
        strokeWidth="3.3"
        fill="none"
      />
      <path d="M-24 -26l34 -4 13 5v25l-48 2z" />
      <path d="M-27 -25l10 -10 27 -4 19 12 -38 -1z" />
      <path
        d="M-19 -22l8 -1v11l-8 1z M-7 -23l9 -1v11l-9 1z"
        fill="#d5b899"
        stroke="none"
      />
      <path
        d="M-32 -6v10l62 -2v-10m-62 2l62 -2 M20 -30l0 -24"
        fill="none"
        strokeWidth="1.4"
      />
    </g>
  );
}
export function Sky({ frame, camera }: { frame: number; camera: number }) {
  const shift = camera - 640;
  return (
    <>
      <rect x="-800" y="-400" width="4000" height="1250" fill="url(#sky)" />
      <g transform={"translate(" + shift * 0.94 + " 0)"}>
        <circle cx="357" cy="206" r="160" fill="url(#sunGlow)" />
        <circle cx="357" cy="206" r="41" fill="#fff1bf" />
        {range(29).map((i) => {
          const x = -160 + noise(i, 30) * 1700 + frame * 0.035,
            y = 52 + noise(i, 31) * 173,
            w = 24 + noise(i, 32) * 165;
          return (
            <path
              key={i}
              d={
                "M" +
                x +
                " " +
                y +
                "q" +
                w * 0.21 +
                " -2 " +
                w * 0.42 +
                " -3t" +
                w * 0.61 +
                " 0q-" +
                w * 0.32 +
                " 2 -" +
                w * 0.55 +
                " 2z"
              }
              fill={i % 3 ? "#f9ccb2" : "#c69fa9"}
              opacity=".62"
            />
          );
        })}
      </g>
      <g transform={"translate(" + shift * 0.87 + " 0)"}>
        <Ridge x={192} y={237} scale={1.19} index={0} />
        <Ridge x={695} y={238} scale={1.53} index={1} />
        <Ridge x={1191} y={202} scale={1.59} index={2} />
      </g>
      <g transform={"translate(" + shift * 0.76 + " 0)"}>
        <Ridgeline base={299} seed={3} fill="#9a9398" />
        <Pines density={112} base={364} size={0.31} seed={22} color="#889899" />
      </g>
      <g transform={"translate(" + shift * 0.62 + " 0)"}>
        <Ridgeline base={374} seed={4} fill="#698686" />
        <Pines density={110} base={405} size={0.48} seed={12} color="#678584" />
        <LookoutTower />
      </g>
      <g transform={"translate(" + shift * 0.45 + " 0)"}>
        <Pines density={88} base={480} size={0.77} seed={14} color="#416d6d" />
        <path
          d="M-650 407q360 -44 657 -8t620 5 660 5 990 0v94H-650z"
          fill="url(#mist)"
          transform={"translate(" + Math.sin(frame / 97) * 18 + " 0)"}
        />
      </g>
      <g transform={"translate(" + shift * 0.25 + " 0)"}>
        <Pines density={67} base={524} size={1.16} seed={31} color="#295656" />
      </g>
    </>
  );
}
