import { ease, noise, range } from "./math";

export function FallenCedar() {
  return (
    <g transform="translate(974 527) rotate(-6)">
      <path d="M-90 8q88 -10 174 -5l7 6 -157 8z" fill="#405340" opacity=".65" />
      <path
        d="M-83 -2l42 -18 115 -4 12 9 -4 15 -134 9z"
        fill="#685b45"
        stroke="#445342"
        strokeWidth="2"
      />
      <path d="M-85 1l20 -12 29 -10 111 -4 -9 8 -125 13z" fill="#949069" />
      <path
        d="M-46 -13l12 -15 2 -16 5 1 -1 19 -4 8 M19 -19l16 -13 7 -11 -2 16 -7 7"
        fill="#635a43"
      />
      {range(33).map((i) => {
        const a = -71 + noise(i, 1) * 142,
          b = -10 + noise(i, 2) * 13;
        return (
          <path
            key={i}
            d={"M" + a + " " + b + "l" + (7 + noise(i, 3) * 18) + " -2"}
            stroke={i % 3 ? "#454f40" : "#ad9b71"}
            strokeWidth={1 + noise(i, 5)}
            fill="none"
          />
        );
      })}
      <ellipse
        cx="77"
        cy="-8"
        rx="11"
        ry="14"
        fill="#bd9971"
        stroke="#555340"
        strokeWidth="3"
      />
      <ellipse
        cx="77"
        cy="-7"
        rx="6.5"
        ry="10"
        fill="none"
        stroke="#846f56"
        strokeWidth="1.6"
      />
      <path d="M75 -6l6 -9 -2 9 5 4" stroke="#74644e" fill="none" />
      <path d="M-76 -5l23 -13 32 -4 5 3 -13 2 -19 0 -10 7z" fill="#83925e" />
    </g>
  );
}
export function WreckedShed() {
  return (
    <g transform="translate(1381 502) skewX(-4)" strokeLinejoin="round">
      <path d="M-92 -3l15 -64 67 -17 70 20 22 65 -89 -5z" fill="#4f6051" />
      {range(14).map((i) => {
        const x = -77 + i * 11,
          y = -59 - noise(i, 11) * 15;
        return (
          <path
            key={i}
            d={"M" + x + " -3l2 " + y + " 9 -2 -4 " + (-y + 1) + "z"}
            fill={["#7c8064", "#666f59", "#888468"][i % 3]}
            stroke="#52614f"
            strokeWidth="1"
          />
        );
      })}
      <path
        d="M-100 -65l43 -31 34 2 16 16 19 -6 16 12 24 -3 32 20 -65 -11 -30 2 -31 -10z"
        fill="#777c67"
        stroke="#43574d"
        strokeWidth="3"
      />
      <path
        d="M-91 -72l36 -24 28 1 -16 9 -20 1z M12 -84l20 8 18 -1 23 15 -42 -9z"
        fill="#a29b77"
      />
      <path d="M-14 -55l34 3 -4 44 -35 -1z" fill="#354f47" />
      <path d="M-23 -17l47 -26 3 6 -48 29z" fill="#8b876c" />
    </g>
  );
}
export function Raven({ frame }: { frame: number }) {
  const u = Math.max(0, frame - 102),
    x = 493 + u * 2.8,
    y = 346 - 139 * ease(102, 148, frame) - u * 0.6;
  if (frame > 169) return null;
  const wings = 8 * Math.sin(u * 0.48);
  return (
    <g
      transform={
        "translate(" +
        x +
        " " +
        y +
        ") rotate(" +
        -14 * ease(101, 109, frame) +
        ")"
      }
      fill="#2d3d3d"
    >
      {u > 0 ? (
        <>
          <path
            d={
              "M2 0Q-4 " +
              (-9 + wings) +
              " -19 " +
              (-12 + wings * 1.7) +
              "l5 7 8 6 9 4z"
            }
          />
          <path
            d={
              "M2 1Q10 " +
              (-6 + wings) +
              " 16 " +
              (-9 + wings * 1.6) +
              "l-3 8 -8 8z"
            }
            fill="#46504d"
          />
        </>
      ) : (
        <path d="M-6 0l-2 7 4 -1 1 -4 3 2 -1 3 3 -1 -1 -6z" />
      )}
      <path d="M-14 1l7 -4q5 -8 10 -6l3 -4q5 -2 7 4l5 1 -6 2q-3 8 -14 8l-11 4z" />
      <path d="M-6 -2q4 -5 11 -4l-5 4z" fill="#556363" />
    </g>
  );
}
