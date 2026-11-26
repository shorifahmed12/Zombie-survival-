import type { Location, Prop, Weather } from "./types";

const ink = "#172f39";
const seq = (n: number) => Array.from({ length: n }, (_, i) => i);
const noise = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const palettes = {
  relay: ["#34495e", "#9ba6a6", "#f5c390", "#637c80", "#415e64", "#354e53"],
  marsh: ["#3b5869", "#9eb4a7", "#e1d5a0", "#658982", "#4a7069", "#3b5b52"],
  underpass: ["#41425a", "#a69aa3", "#e5ab83", "#747583", "#515766", "#414a52"],
};
export function Materials({ location }: { location: Location }) {
  const p = palettes[location];
  return (
    <defs>
      <linearGradient id="sky" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop stopColor={p[0]} />
        <stop offset=".52" stopColor={p[1]} />
        <stop offset=".91" stopColor={p[2]} />
      </linearGradient>
      <linearGradient id="earth" x2=".12" y2="1">
        <stop stopColor={p[3]} />
        <stop offset=".18" stopColor={p[4]} />
        <stop offset="1" stopColor="#1e343e" />
      </linearGradient>
      <linearGradient id="metal" x2=".2" y2="1">
        <stop stopColor="#85918c" />
        <stop offset=".45" stopColor="#627977" />
        <stop offset="1" stopColor="#3d575b" />
      </linearGradient>
      <linearGradient id="torchbeam">
        <stop stopColor="#ffe7a4" stopOpacity=".48" />
        <stop offset=".43" stopColor="#ffeab5" stopOpacity=".18" />
        <stop offset="1" stopColor="#ffeed1" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="halo">
        <stop stopColor="#ffe4a1" stopOpacity=".85" />
        <stop offset=".24" stopColor="#ffc17a" stopOpacity=".40" />
        <stop offset="1" stopColor="#ffa75d" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="falloff">
        <stop offset=".43" stopColor="#0b1e2a" stopOpacity="0" />
        <stop offset="1" stopColor="#0b1e2a" stopOpacity=".30" />
      </radialGradient>
      <pattern id="ribs" width="13" height="18" patternUnits="userSpaceOnUse">
        <path d="M1 0 V18" stroke="#c6c8ae" opacity=".23" strokeWidth="1.3" />
        <path d="M3 0 V18" stroke="#27464e" opacity=".55" />
      </pattern>
      <pattern id="hazard" width="20" height="12" patternUnits="userSpaceOnUse">
        <rect width="20" height="12" fill="#334950" />
        <path
          d="M-8 12 L2 0 H11 L1 12 M12 12 L22 0 H31 L21 12"
          fill="#c79f64"
        />
      </pattern>
      <pattern id="mesh" width="13" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M0 0 L13 20 M13 0 L0 20"
          fill="none"
          stroke="#abc0b2"
          opacity=".52"
          strokeWidth="1.2"
        />
      </pattern>
      <g id="pine">
        <path d="M0 -96 L7 -71 4 -73 13 -56 8 -59 18 -41 13 -44 22 -27 14 -30 25 -14 4 -19 3 0 -2 0 -3 -18 -24 -12 -15 -27 -21 -24 -12 -42 -17 -38 -8 -59 -13 -55 -5 -76 -8 -72Z" />
      </g>
      <g id="reeds" fill="none" strokeLinecap="round">
        <path
          d="M0 0 Q0 -22 -8 -34 M1 0 Q6 -32 12 -38 M0 0 Q-10 -14 -16 -16 M3 0 Q18 -16 23 -15"
          stroke="currentColor"
          strokeWidth="2.3"
        />
        <path
          d="M-8 -34 l-3 -7 M12 -38 l3 -8"
          stroke="currentColor"
          strokeWidth="3.8"
        />
      </g>
    </defs>
  );
}
export function Sky({ location, time }: { location: Location; time: number }) {
  const p = palettes[location];
  return (
    <g>
      <rect x="-1400" y="-1500" width="4200" height="2500" fill={p[0]} />
      <rect x="-1400" y="-30" width="4200" height="545" fill="url(#sky)" />
      <circle cx="890" cy="312" r="109" fill="url(#halo)" />
      <circle cx="890" cy="312" r="37" fill="#f7d7a3" opacity=".86" />
      {seq(18).map((i) => {
        const x = -370 + i * 131 + Math.sin(time * 0.05) * 6,
          y = 80 + noise(i + 9) * 216;
        return (
          <path
            key={i}
            d={
              "M" +
              x +
              " " +
              y +
              " q30 -7 49 -6 q14 -9 36 -4 q26 -6 48 3 l57 5 -84 2Z"
            }
            fill={i % 3 ? "#b4b5af" : "#e3c8aa"}
            opacity={0.12 + noise(i) * 0.24}
          />
        );
      })}
      <path
        d="M-1400 390 L-30 336 100 351 227 306 290 314 365 283 410 306 472 300 533 326 640 302 719 319 860 287 919 307 1014 278 1080 298 1156 285 1320 350 2500 345 V620 H-1400Z"
        fill={p[3]}
      />
      <path
        d="M225 307 l62 9 71 -27 -41 27 -26 7 -41 -6Z M507 325 l47 7 86 -30 -74 41Z M854 291 l31 5 34 13 -37 -8Z M1013 279 l43 16 -38 -9 -49 13Z"
        fill="#cccfb8"
        opacity=".29"
      />
      <path
        d="M-1400 405 L-30 390 124 366 196 372 302 333 415 346 515 316 626 355 713 331 797 348 978 317 1123 349 1300 324 2500 345 V625 H-1400Z"
        fill={p[4]}
      />
      {seq(91).map((i) => (
        <use
          key={i}
          href="#pine"
          transform={
            "translate(" +
            (-680 + i * 30) +
            " " +
            (408 + 19 * Math.sin(i * 0.3)) +
            ") scale(" +
            (0.23 + noise(i + 2) * 0.55) +
            ")"
          }
          fill={p[4]}
        />
      ))}
      {seq(43).map((i) => (
        <use
          key={"fir" + i}
          href="#pine"
          transform={
            "translate(" +
            (-170 + i * 39 + noise(i) * 14) +
            " " +
            (405 + 9 * Math.sin(i * 0.47)) +
            ") scale(" +
            (0.36 + noise(i + 36) * 0.48) +
            ")"
          }
          fill={p[5]}
        />
      ))}
      <path
        d="M-1400 427 Q-50 355 250 398 T820 391 T1440 385 T2600 393 V620 H-1400Z"
        fill={p[5]}
      />
    </g>
  );
}
function Mast({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g
      transform={"translate(" + x + " " + y + ") scale(" + s + ")"}
      fill="none"
      stroke="#455d63"
    >
      <path d="M-28 0 L-6 -230 H6 L27 0Z" strokeWidth="4" />
      {seq(10).map((i) => {
        const h = -i * 23,
          w = 26 - i * 2;
        return (
          <path
            key={i}
            d={
              "M-" +
              w +
              " " +
              h +
              " l" +
              (2 * w - 2) +
              " -23 h-" +
              (2 * w - 4) +
              " l" +
              (2 * w - 2) +
              " 23"
            }
            strokeWidth="1.8"
          />
        );
      })}
      <path
        d="M0 -230 V-277 M-16 -250 H18 M-11 -260 H11 M-62 0 L0 -230 65 0"
        strokeWidth="2"
      />
      <circle cy="-275" r="3" fill="#efb18b" stroke="none" />
    </g>
  );
}
function RelayHouse() {
  return (
    <g strokeLinejoin="round">
      <Mast x={858} y={435} s={0.93} />
      <path
        d="M394 281 Q627 386 857 254 M395 287 Q626 389 856 258"
        fill="none"
        stroke="#496064"
        strokeWidth="2"
      />
      <path
        d="M389 452 V261 h6 v191 M375 282 h38 M379 277 h31"
        fill="#526565"
        stroke="#4e6061"
        strokeWidth="3"
      />
      <path d="M734 421 L952 418 1021 398 815 395Z" fill="#2c4248" />
      <path
        d="M738 324 L921 318 V420 H738Z"
        fill="url(#metal)"
        stroke="#344d53"
        strokeWidth="2"
      />
      <path
        d="M921 318 L992 333 V409 L921 421Z"
        fill="#445b5d"
        stroke="#344d53"
        strokeWidth="2"
      />
      <path d="M739 325 L920 320 V419 H739Z" fill="url(#ribs)" />
      <path
        d="M724 320 L914 307 1004 328 997 336 916 319 726 331Z"
        fill="#344b53"
        stroke="#253c45"
        strokeWidth="2"
      />
      <path
        d="M730 321 L916 309 L991 326"
        stroke="#a3a99b"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M756 350 h57 v24 h-57Z"
        fill="#263d47"
        stroke="#a1a99b"
        strokeWidth="3"
      />
      {seq(4).map((i) => (
        <path
          key={i}
          d={"M" + (759 + i * 13) + " 352 l9 -1 v19 h-9Z"}
          fill={i === 1 ? "#e0b879" : "#86a1a0"}
          opacity={i === 1 ? 0.9 : 0.58}
        />
      ))}
      <path
        d="M851 417 v-69 l43 -1 v71"
        fill="#40575c"
        stroke="#9ca89a"
        strokeWidth="2"
      />
      <path d="M858 357 h25 v17 h-25Z" fill="#2c4149" />
      <path d="M853 390 h35 M883 380 h5" stroke="#b2b5a0" strokeWidth="2" />
      <path
        d="M943 337 v55 q0 5 6 5 h22 v-15 M947 338 v52"
        fill="none"
        stroke="#91a49a"
        strokeWidth="2"
      />
      <path d="M760 394 h55 v21 h-55Z" fill="#526b69" />
      {seq(5).map((i) => (
        <path key={i} d={"M764 " + (397 + i * 3) + " h46"} stroke="#2f494f" />
      ))}
      <text
        x="823"
        y="342"
        fill="#e3dbbc"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="10"
        letterSpacing="2"
      >
        RELAY 06
      </text>
      <g stroke="#546c70" fill="none">
        <path d="M1014 434 v-78 h204 v77Z" fill="url(#mesh)" strokeWidth="3" />
        <path d="M1014 364 h204 M1111 355 v77 M1189 355 v77" strokeWidth="3" />
      </g>
    </g>
  );
}
function Underpass() {
  return (
    <g>
      <path d="M-80 205 L1360 138 V199 L-80 263Z" fill="#48515a" />
      <path d="M-80 206 L1360 139" stroke="#aaa796" strokeWidth="7" />
      {[-50, 318, 723, 1120].map((x) => (
        <g key={x} transform={"translate(" + x + " 0)"}>
          <path d="M0 223 h95 l-25 40 -6 170 -37 3 -3 -169Z" fill="#495b61" />
          <path d="M65 258 l-6 166" stroke="#788482" strokeWidth="3" />
          <path d="M27 398 l35 -2 v12 l-35 2Z" fill="url(#hazard)" />
        </g>
      ))}
      <path d="M-80 233 L1360 168" stroke="#303f49" strokeWidth="7" />
    </g>
  );
}
function Marsh() {
  return (
    <g>
      <path d="M155 408 L150 331 235 319 270 331 269 407Z" fill="#516c6a" />
      <path d="M141 332 l82 -29 57 24 -11 7 -49 -18 -76 24Z" fill="#364f55" />
      <path d="M183 346 l24 -5 v24 l-24 5Z" fill="#263f46" />
      <path d="M214 339 l25 -6 v24 l-25 4Z" fill="#91a79a" />
      {seq(9).map((i) => (
        <path
          key={i}
          d={"M" + (100 + i * 63) + " 410 v-29 m-4 6 l68 -2"}
          stroke="#526b6a"
          strokeWidth="3"
          fill="none"
        />
      ))}
      <path
        d="M123 409 q160 -4 229 0 t207 3"
        stroke="#d1c89d"
        strokeWidth="3"
        fill="none"
      />
    </g>
  );
}
export function Landscape({ location }: { location: Location }) {
  return (
    <g>
      {location === "relay" ? (
        <RelayHouse />
      ) : location === "marsh" ? (
        <Marsh />
      ) : (
        <Underpass />
      )}
      <path
        d="M-1400 435 Q-400 400 100 429 T740 427 T1440 421 T2600 425 V1600 H-1400Z"
        fill="url(#earth)"
      />
      {seq(64).map((i) => {
        const x = -490 + noise(i + 30) * 2330,
          y = 439 + noise(i + 96) * 235;
        return (
          <path
            key={i}
            d={"M" + x + " " + y + " q20 -2 48 -1 l-13 2Z"}
            fill={i % 4 ? "#a4b2a2" : "#263f45"}
            opacity={i % 4 ? 0.22 : 0.46}
          />
        );
      })}
      <path
        d="M-1400 548 Q-60 511 240 525 T975 512 T2640 514 L2640 582 Q1290 550 785 570 T-1400 590Z"
        fill="#8d9590"
        opacity=".35"
      />
      {seq(58).map((i) => {
        const x = -180 + i * 32 + noise(i) * 22,
          y = 508 + noise(i + 33) * 87;
        return (
          <g key={"gravel" + i} transform={"translate(" + x + " " + y + ")"}>
            <path
              d="M-3 0 l2 -1.4 4 .2 2 1.6 -6 .8Z"
              fill="#344a4c"
              opacity=".65"
            />
            <path
              d="M-2 -.7 l2 -.7 3 .4"
              fill="none"
              stroke="#b8b7a1"
              strokeWidth=".7"
              opacity=".65"
            />
          </g>
        );
      })}
      {seq(12).map((i) => {
        const x = -90 + i * 126,
          y = 537 + noise(i + 45) * 35;
        return (
          <g
            key={"puddle" + i}
            transform={
              "translate(" +
              x +
              " " +
              y +
              ") scale(" +
              (0.4 + noise(i) * 0.8) +
              " 1)"
            }
          >
            <path
              d="M-39 0 q13 -2 28 -1 l17 -2 31 1 -6 1 13 1 -23 2 -36 1 7 -2Z"
              fill="#b4c3b7"
              opacity=".45"
            />
            <path d="M-26 0 h14 m9 1 h15" stroke="#ced1b9" strokeWidth=".7" />
          </g>
        );
      })}
      {seq(38).map((i) => (
        <use
          key={i}
          href="#reeds"
          transform={
            "translate(" +
            (-280 + i * 54 + noise(i) * 32) +
            " " +
            (444 + noise(i) * 22) +
            ") scale(" +
            (0.18 + noise(i + 22) * 0.35) +
            ")"
          }
          color="#526b63"
        />
      ))}
    </g>
  );
}
export function SetProp({ prop, time }: { prop: Prop; time: number }) {
  const on = time >= (prop.onAt ?? 0);
  return (
    <g
      transform={
        "translate(" +
        prop.x +
        " " +
        (prop.y ?? 548) +
        ") scale(" +
        (prop.scale ?? 1) +
        ")"
      }
      strokeLinejoin="round"
    >
      {prop.kind === "beacon" ? (
        <g>
          <ellipse cy="1" rx="23" ry="4" fill="#253c41" opacity=".65" />
          <path
            d="M-13 0 v-4 h6 l2 -54 h9 l4 54 h6 v4Z"
            fill="#506366"
            stroke={ink}
            strokeWidth="2"
          />
          <path d="M-5 -20 h10 v10 H-5Z" fill="url(#hazard)" />
          <path
            d="M-10 -56 v-5 h20 v5Z M-8 -77 q7 -9 15 -1 l1 4 h-16Z"
            fill="#435357"
            stroke={ink}
            strokeWidth="1.6"
          />
          {on && <circle cy="-68" r="43" fill="url(#halo)" />}
          <rect
            x="-7"
            y="-75"
            width="14"
            height="14"
            rx="3"
            fill={on ? "#ffd587" : "#665d53"}
            stroke="#493f37"
            strokeWidth="1.5"
          />
          <path
            d="M-4 -75 v14 M4 -75 v14 M-8 -67 h16"
            stroke="#8f7857"
            strokeWidth="1.2"
          />
          {on && <path d="M-2 -72 v8" stroke="#fff1b4" strokeWidth="2.5" />}
        </g>
      ) : prop.kind === "crate" ? (
        <g>
          <path
            d="M-25 -32 l40 -4 13 6 v28 l-42 3 -11 -5Z"
            fill="#536967"
            stroke={ink}
            strokeWidth="2"
          />
          <path
            d="M-25 -32 l11 6 42 -4 M-14 -26 V1 M-18 -27 v23 M17 -28 v27"
            fill="none"
            stroke="#a7a68d"
            strokeWidth="2"
          />
          <path d="M-8 -17 l15 -2 v5 l-15 2Z" fill="#d3b57e" />
        </g>
      ) : prop.kind === "marker" ? (
        <g>
          <path d="M-3 0 v-79 h6 V0Z" fill="#596769" />
          <path
            d="M-22 -85 h41 l8 11 -9 10 h-40Z"
            fill="#d4b273"
            stroke={ink}
            strokeWidth="2"
          />
          <path
            d="M-12 -75 h22 m-5 -5 6 5 -6 5"
            fill="none"
            stroke={ink}
            strokeWidth="3"
          />
        </g>
      ) : (
        <g>
          <path
            d="M-45 0 l10 -19 5 -19 h62 l5 19 10 19Z"
            fill="#82908b"
            stroke={ink}
            strokeWidth="2"
          />
          <path d="M-32 -28 h66 l1 10 h-69Z" fill="url(#hazard)" />
          <path d="M-39 -5 h79" stroke="#536866" strokeWidth="2" />
        </g>
      )}
    </g>
  );
}
export function Foreground({ time }: { time: number }) {
  return (
    <g>
      {seq(32).map((i) => {
        const x = -450 + i * 67 + noise(i) * 36;
        return (
          <use
            key={i}
            href="#reeds"
            transform={
              "translate(" +
              x +
              " " +
              (720 + noise(i + 21) * 26) +
              ") rotate(" +
              3 * Math.sin(time * 1.3 + i) +
              ") scale(" +
              (1 + noise(i) * 1.6) +
              ")"
            }
            color="#203840"
            opacity=".88"
          />
        );
      })}
    </g>
  );
}
export function Air({
  weather,
  time,
  width,
}: {
  weather: Weather;
  time: number;
  width: number;
}) {
  if (weather === "clear") return null;
  const rain = weather === "drizzle";
  return (
    <g>
      {seq(rain ? 77 : 38).map((i) => {
        const z = 0.45 + noise(i + 19) * 0.75;
        const x =
          ((((noise(i) * width * 1.4 - time * (rain ? 107 : 21) * z) %
            (width + 50)) +
            width +
            50) %
            (width + 50)) -
          25;
        const y =
          ((noise(i + 71) * 790 + time * (rain ? 430 : 29) * z) % 790) - 30;
        return rain ? (
          <path
            key={i}
            d={"M" + x + " " + y + " l-" + 4 * z + " " + 13 * z}
            stroke="#cce4de"
            strokeWidth={z}
            opacity=".29"
          />
        ) : (
          <circle
            key={i}
            cx={x + 7 * Math.sin(time + i)}
            cy={y}
            r={z * 1.6}
            fill="#e5d8af"
            opacity=".65"
          />
        );
      })}
    </g>
  );
}
