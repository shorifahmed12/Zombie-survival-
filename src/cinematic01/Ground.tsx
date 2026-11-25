import { FallenCedar, WreckedShed } from "./SettlementDetails";
import { Shrubs, TreeCrown } from "./Foliage";
import { noise, range } from "./math";

function grassPath(seed: number, count: number, front: boolean) {
  return range(count)
    .map((i) => {
      const x = -400 + noise(i, seed) * 2900;
      const y = front
        ? 639 + noise(i, seed + 1) * 120
        : 501 + noise(i, seed + 1) * 47;
      const s = (front ? 1.55 : 1) * (0.4 + noise(i, seed + 2));
      return (
        "M" +
        x +
        " " +
        y +
        "q-2 -7 -7 -12q6 4 9 11q0 -9 4 -" +
        12 * s +
        "q-1 7 0 13q4 -6 9 -8l-6 9z"
      );
    })
    .join("");
}
function Grass({ front }: { front: boolean }) {
  return (
    <g>
      {["#355a42", "#557348", "#87975a", "#b8ac65", "#295341"].map(
        (color, i) => (
          <path
            key={color}
            d={grassPath(81 + i * 7, front ? 95 : 110, front)}
            fill={color}
          />
        ),
      )}
    </g>
  );
}
function Rocks({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={"translate(" + x + " " + y + ") scale(" + s + ")"}>
      <path d="M-29 1l9 -12 12 -4 15 1 16 13 -16 6 -19 -2z" fill="#56645c" />
      <path d="M-28 0l9 -11 12 -4 12 1 -14 10z" fill="#a9aa87" />
      <path d="M-11 -2l16 -12 13 11 -10 -4z" fill="#8b9279" />
      <path
        d="M-21 -9l9 -4 8 -1 M-28 0l11 -2"
        stroke="#cfbd8e"
        fill="none"
        strokeWidth="1.2"
      />
    </g>
  );
}
function Telegraph({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g
      transform={"translate(" + x + " " + y + ") scale(" + s + ") rotate(-3)"}
      strokeLinejoin="round"
    >
      <path
        d="M-5 0l5 -183 6 -2 2 185z"
        fill="#6d6150"
        stroke="#454e42"
        strokeWidth="1.8"
      />
      <path d="M0 -7l3 -162 M-19 -158l43 0" stroke="#b29b70" strokeWidth="2" />
      <path
        d="M-25 -163l53 -1v5l-53 3z"
        fill="#6d634d"
        stroke="#4c5546"
        strokeWidth="1.2"
      />
      {[-18, 0, 21].map((n) => (
        <g key={n}>
          <path d={"M" + n + " -163v-8"} stroke="#394b45" strokeWidth="2" />
          <path
            d={"M" + (n - 2) + " -168l5 0 -1 -6 -3 1z"}
            fill="#b8c0a6"
            stroke="#4a6159"
            strokeWidth="1"
          />
        </g>
      ))}
    </g>
  );
}
export function Floor() {
  return (
    <>
      <path
        d="M-650 494q380 -33 737 3t698 2 654 -8 1090 7v490H-650Z"
        fill="url(#ground)"
      />
      <path
        d="M-800 559q420 -58 721 -21t499 7 360 8 490 -17 510 12 694 -16v96q-412 30 -752 -9t-623 10 -519 -6 -565 10 -815 12z"
        fill="url(#trail)"
      />
      {range(45).map((i) => {
        const x = -350 + noise(i, 4) * 2680,
          y = 554 + noise(i, 5) * 62,
          w = 25 + noise(i, 6) * 117;
        return (
          <path
            key={i}
            d={
              "M" +
              x +
              " " +
              y +
              "q" +
              w * 0.33 +
              " -4 " +
              w * 0.63 +
              " -3l" +
              w * 0.37 +
              " 1 -" +
              w * 0.53 +
              " 2z"
            }
            fill={i % 3 ? "#dab283" : "#847b65"}
            opacity=".61"
          />
        );
      })}
      {range(640).map((i) => {
        const x = -330 + noise(i, 17) * 2740,
          y = 548 + noise(i, 18) * 79,
          w = 0.8 + noise(i, 19) * 4.4;
        return (
          <path
            key={i}
            d={
              "M" +
              x +
              " " +
              y +
              "l" +
              w +
              " -1.4 " +
              w * 0.7 +
              " 1.1 -" +
              w * 0.9 +
              " 1.2z"
            }
            fill={i % 4 ? "#756f5d" : "#f2cf98"}
            opacity=".64"
          />
        );
      })}
      <WreckedShed />
      <Shrubs />
      <FallenCedar />
      <Grass front={false} />
      <g fill="none" stroke="#4d5146" strokeWidth="1.8">
        <path d="M-260 258Q-70 380 146 340Q375 427 812 363Q1030 436 1294 354Q1590 430 1960 355" />
        <path d="M-260 265Q-50 393 166 342Q380 444 827 365Q1040 449 1307 356" />
      </g>
      <Telegraph x={157} y={511} s={1} />
      <Telegraph x={835} y={497} s={0.78} />
      <Telegraph x={1314} y={509} s={0.9} />
      <Telegraph x={1970} y={514} s={0.95} />
      {range(34).map((i) => {
        const x = -200 + i * 85 + noise(i, 31) * 40;
        return (
          <g key={i}>
            <use
              href={"#fern" + (i % 3)}
              transform={
                "translate(" +
                x +
                " " +
                (521 + noise(i, 52) * 15) +
                ") scale(" +
                (0.24 + noise(i, 3) * 0.38) +
                ")"
              }
              color={i % 3 ? "#587b52" : "#96a365"}
            />
            {i % 3 === 0 && (
              <Rocks
                x={x + 34}
                y={527 + noise(i, 7) * 15}
                s={0.4 + noise(i, 12) * 0.46}
              />
            )}
          </g>
        );
      })}
    </>
  );
}
function Flowers({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={"translate(" + x + " " + y + ") scale(" + s + ")"}>
      {range(8).map((i) => {
        const a = noise(i, 13) * 46 - 18,
          b = -18 - noise(i, 15) * 24;
        return (
          <g key={i}>
            <path
              d={"M0 0Q" + a + " -10 " + a + " " + b}
              fill="none"
              stroke="#69805a"
              strokeWidth="1.3"
            />
            <path
              d={
                "M" +
                (a - 3) +
                " " +
                (b - 1) +
                "q-3 -5 1 -4 3 -4 4 1 5 -2 4 2 -2 4 -6 4z"
              }
              fill={i % 3 ? "#e88e5b" : "#ffbb73"}
            />
            <circle cx={a + 1} cy={b} r="1.5" fill="#743f36" />
          </g>
        );
      })}
    </g>
  );
}
function CloseTree({
  x,
  y,
  flip,
  scale = 1,
}: {
  x: number;
  y: number;
  flip: number;
  scale?: number;
}) {
  return (
    <g
      transform={
        "translate(" +
        x +
        " " +
        y +
        ") scale(" +
        flip * scale +
        " " +
        scale +
        ")"
      }
    >
      <path
        d="M-65 20q37 -36 37 -77l6 -253 -18 -109 -43 -90 -56 -64 14 -21 49 58 46 40 -4 -138 32 -57 16 8 -19 57 12 173 32 -51 32 -110 12 -5 -11 91 46 -51 14 2 -56 82 -35 89 -1 129 20 131 45 63 32 23 -67 -21 -23 -27 9 56 -34 -31 -18 33 -3 -34z"
        fill="#263e3b"
      />
      <path
        d="M-24 -339l13 98 -5 168 -19 79 26 -55 7 -143 -8 -118 -9 -62z M17 -299l37 -90 33 -46 -46 95z"
        fill="#56604b"
      />
      <path
        d="M-19 -264q19 91 3 151m24 -280q6 60 -9 94M0 -88q10 52 25 69"
        stroke="#838366"
        fill="none"
        strokeWidth="2.2"
        opacity=".65"
      />
      {range(22).map((i) => {
        const xx = -18 + noise(i, 33) * 33,
          yy = -60 - noise(i, 38) * 230;
        return (
          <path
            key={i}
            d={"M" + xx + " " + yy + "q4 -14 0 -27"}
            stroke="#677059"
            opacity=".5"
            strokeWidth="1.5"
            fill="none"
          />
        );
      })}
    </g>
  );
}
export function Understory({
  camera,
  frame,
}: {
  camera: number;
  frame: number;
}) {
  return (
    <g transform={"translate(" + (640 - camera) * 0.23 + " 0)"}>
      <path
        d="M-800 682q212 -51 470 -30t430 -6 280 14 382 -12 320 5 396 -7 367 10 670 -12v350H-800z"
        fill="url(#bank)"
      />
      <Grass front />
      {range(57).map((i) => {
        const x = -420 + i * 52 + noise(i, 12) * 57,
          y = 665 + noise(i, 10) * 61,
          s = 0.36 + noise(i, 7) * 0.79;
        return (
          <g key={i}>
            <use
              href={"#fern" + (i % 3)}
              transform={
                "translate(" +
                x +
                " " +
                y +
                ") rotate(" +
                Math.sin(frame / 30 + i) * 1.6 +
                ") scale(" +
                s +
                ")"
              }
              color={["#244a42", "#43654c", "#658151", "#8b935a"][i % 4]}
            />
            {i % 5 === 0 && <Flowers x={x + 28} y={y - 5} s={s} />}
            {i % 7 === 0 && <Rocks x={x + 40} y={y + 2} s={s * 0.78} />}
          </g>
        );
      })}
      <TreeCrown frame={frame} />
      <CloseTree x={15} y={665} flip={1} scale={1.15} />
      <CloseTree x={1660} y={695} flip={-1} scale={0.88} />
    </g>
  );
}
