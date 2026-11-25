import { noise, range } from "./math";

// Batch leaf and needle marks by pigment to keep the SVG small.
function leaf(x: number, y: number, w: number, h: number, tilt: number) {
  return (
    "M" +
    x +
    " " +
    y +
    "q" +
    w * 0.25 +
    " " +
    -h +
    " " +
    w +
    " " +
    tilt +
    "q-" +
    w * 0.48 +
    " " +
    h * 0.63 +
    " -" +
    w +
    " " +
    -tilt +
    "z"
  );
}
export function Shrubs() {
  return (
    <g>
      {range(26).map((i) => {
        const x = -260 + i * 93 + noise(i, 11) * 64,
          y = 501 + noise(i, 8) * 29;
        const s = 0.52 + noise(i, 91) * 0.9;
        return (
          <g
            key={i}
            transform={"translate(" + x + " " + y + ") scale(" + s + ")"}
          >
            <path
              d="M-43 3q9 -9 16 -9 -1 -7 9 -7 8 -10 14 -7 10 -8 16 0 10 -1 14 7 8 1 12 11z"
              fill="#506e4e"
            />
            {["#527551", "#72905e", "#98a365", "#aab16d"].map((c, j) => (
              <path
                key={c}
                fill={c}
                d={range(32)
                  .map((k) => {
                    const a = noise(k, i * 11 + j) * 70 - 35,
                      b =
                        -Math.sin(((a + 35) / 70) * Math.PI) *
                        19 *
                        noise(k, i * 14 + j + 1);
                    return leaf(
                      a,
                      b,
                      3 + noise(k, 15) * 5,
                      2 + noise(k, 3) * 3,
                      noise(k, i) * 3 - 2,
                    );
                  })
                  .join("")}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}
export function TreeCrown({ frame }: { frame: number }) {
  return (
    <g transform={"translate(34 5) rotate(" + Math.sin(frame / 66) * 0.7 + ")"}>
      <path
        d="M-50 -34q65 55 104 66t87 8l63 -28 -61 21 -50 1 -36 -13 -64 -51z"
        fill="#344c43"
      />
      {range(11).map((j) => {
        const xx = 11 + j * 13,
          yy = 12 + Math.sin(j / 4) * 25;
        const endX = xx + 19 + noise(j, 44) * 27,
          endY = yy + ((j % 3) - 1) * 21 + 5;
        return (
          <g key={j}>
            <path
              d={
                "M" +
                xx +
                " " +
                yy +
                "Q" +
                endX +
                " " +
                yy +
                " " +
                endX +
                " " +
                endY
              }
              fill="none"
              stroke="#465a47"
              strokeWidth="2.2"
            />
            {["#2b4e44", "#466a4f", "#738658"].map((c, i) => (
              <path
                key={c}
                fill={c}
                d={range(12)
                  .map((k) => {
                    const a = endX + noise(k, 50 + j + i) * 34 - 18,
                      b = endY + noise(k, 22 * j + i) * 21 - 10;
                    return leaf(
                      a,
                      b,
                      4 + noise(k, 2) * 7,
                      3 + noise(k, 6) * 5,
                      3 + noise(k, 5) * 6,
                    );
                  })
                  .join("")}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}
