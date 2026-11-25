import { noise, range } from "./math";

type Vertex = readonly [number, number];
const ridges: Vertex[][] = [
  [
    [-380, 232],
    [-270, 172],
    [-229, 148],
    [-195, 91],
    [-166, 75],
    [-146, 23],
    [-128, 21],
    [-114, 1],
    [-77, 20],
    [-61, 5],
    [-47, 4],
    [-23, -57],
    [-5, -76],
    [16, -45],
    [24, -41],
    [42, -39],
    [60, -11],
    [76, -5],
    [98, 37],
    [122, 50],
    [142, 83],
    [178, 93],
    [215, 138],
    [320, 213],
  ],
  [
    [-350, 227],
    [-208, 131],
    [-149, 92],
    [-113, 42],
    [-82, 28],
    [-70, 1],
    [-50, -4],
    [-29, -32],
    [-11, -30],
    [11, -55],
    [32, -50],
    [47, -29],
    [64, -29],
    [81, -13],
    [99, -18],
    [115, 4],
    [126, 6],
    [142, 40],
    [174, 58],
    [200, 93],
    [287, 150],
    [380, 213],
  ],
  [
    [-375, 220],
    [-270, 156],
    [-221, 97],
    [-190, 80],
    [-148, 36],
    [-118, 48],
    [-81, 9],
    [-65, 9],
    [-28, -64],
    [-15, -59],
    [0, -84],
    [15, -78],
    [34, -26],
    [48, -13],
    [76, 0],
    [105, 44],
    [132, 54],
    [173, 115],
    [216, 137],
    [330, 209],
  ],
];
export function Ridge({
  x,
  y,
  scale,
  index,
}: {
  x: number;
  y: number;
  scale: number;
  index: number;
}) {
  const vertices = ridges[index],
    seed = index * 71 + 19;
  const jagged: Vertex[] = vertices.flatMap(([ax, ay], i) => {
    const [bx, by] = vertices[i + 1] ?? vertices[i];
    return range(5).map(
      (j) =>
        [
          ax + ((bx - ax) * j) / 5,
          ay + ((by - ay) * j) / 5 + (j ? noise(i * 5 + j, seed) * 5 - 2.5 : 0),
        ] as Vertex,
    );
  });
  const trace = (p: Vertex[]) => p.map((v) => v.join(" ")).join("L");
  const d = "M" + trace(jagged) + "V260H-390Z",
    id = "ridge-mask-" + index;
  return (
    <g transform={"translate(" + x + " " + y + ") scale(" + scale + ")"}>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={index === 1 ? "#d3988e" : "#ce8f82"} />
      <g clipPath={"url(#" + id + ")"}>
        {vertices.slice(2, -2).map(([a, b], i) => {
          const next = vertices[i + 3],
            dark = next[1] > b,
            spread = next[0] - a;
          const dir = dark ? 1 : -1,
            toe = a + dir * (32 + noise(i, seed) * 55);
          return (
            <g key={i}>
              <path
                d={
                  "M" +
                  a +
                  " " +
                  b +
                  "L" +
                  trace([
                    next,
                    [next[0] + dir * 11, next[1] + 28],
                    [toe + spread, 90 + noise(i, seed + 4) * 35],
                    [toe + dir * 55, 182],
                    [toe, 132],
                    [a + dir * 16, b + 56],
                    [a + dir * 4, b + 21],
                  ]) +
                  "Z"
                }
                fill={
                  dark
                    ? ["#977783", "#ae8084", "#ac7b7d"][i % 3]
                    : ["#efb893", "#e3a78c", "#f3c39f"][i % 3]
                }
              />
              {b < 45 && (
                <path
                  d={
                    "M" +
                    a +
                    " " +
                    b +
                    "L" +
                    next.join(" ") +
                    "l-6 7 -4 -2 -6 8 -5 -1 -9 12 3 -10 -8 4 3 -7 -8 4z"
                  }
                  fill={dark ? "#d5a49a" : "#fce3ba"}
                  opacity=".94"
                />
              )}
            </g>
          );
        })}
        {range(330).map((i) => {
          const a = -260 + noise(i, seed + 2) * 530,
            b = -60 + noise(i, seed + 4) * 230,
            dir = a < -22 ? -1 : 1;
          const len = 3 + noise(i, seed + 8) * 21;
          return (
            <path
              key={i}
              d={
                "M" +
                a +
                " " +
                b +
                "l" +
                dir * len * 0.36 +
                " " +
                len * 0.54 +
                " " +
                dir * len * 0.27 +
                " " +
                len * 0.14 +
                " " +
                dir * len * 0.15 +
                " " +
                len * 0.27
              }
              stroke={i % 4 === 0 ? "#ffddab" : "#926f77"}
              opacity={0.19 + noise(i, seed + 1) * 0.22}
              strokeWidth={0.6 + noise(i, seed + 5) * 1.45}
              fill="none"
            />
          );
        })}
      </g>
    </g>
  );
}
