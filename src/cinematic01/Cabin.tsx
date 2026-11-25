import { ease, noise, range } from "./math";

const facade = "M464 373L604 263 748 373 744 548 461 557Z";
const roof =
  "M196 354L341 246 391 245 404 254 420 244 466 248 480 241 515 250 608 256 467 380Z";
function Window({
  x,
  y,
  w = 72,
  h = 56,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
}) {
  return (
    <g
      transform={
        "translate(" + x + " " + y + ") scale(" + w / 72 + " " + h / 56 + ")"
      }
    >
      <path
        d="M-5 -5l81 -2 -1 68 -82 2z"
        fill="#483e36"
        stroke="#333a34"
        strokeWidth="3"
      />
      <path d="M0 0l71 -2 -1 55 -70 3z" fill="#273d3b" />
      <path
        d="M2 2l28 -1 -17 24 -11 4z M39 1l29 -1 -2 6 -14 13 -5 -3 -8 10z M5 35l10 -4 6 2 -5 9 -14 7z"
        fill="#8caaa0"
      />
      <path d="M34 0v54 M0 27l70 -2" stroke="#9b7952" strokeWidth="4" />
      <path
        d="M-7 45l76 -34 5 7 -78 35z"
        fill="#987651"
        stroke="#4f4837"
        strokeWidth="1.5"
      />
      <path d="M-6 56l81 -3 2 6 -83 4z" fill="#b99769" />
    </g>
  );
}
function Boards() {
  return (
    <g clipPath="url(#frontWall)">
      <path d={facade} fill="#ad7950" />
      {range(24).map((i) => {
        const y = 260 + i * 13,
          wobble = noise(i, 94) * 3;
        return (
          <g key={i}>
            <path
              d={"M450 " + y + "l309 -9v12l-312 10z"}
              fill={
                ["#ac7951", "#966c4d", "#b98759", "#ba895c", "#a27652"][i % 5]
              }
            />
            <path
              d={"M451 " + (y + 11) + "q132 -3 307 -10"}
              fill="none"
              stroke="#69533e"
              strokeWidth="2"
            />
            <path
              d={
                "M470 " +
                (y + 1) +
                "l" +
                (70 + wobble * 14) +
                " -3m40 -1l110 -4"
              }
              fill="none"
              stroke="#d6a574"
              strokeWidth="1.25"
            />
          </g>
        );
      })}
      {range(175).map((i) => {
        const x = 458 + noise(i, 32) * 297,
          y = 266 + noise(i, 41) * 296,
          w = noise(i, 15) * 36 + 1;
        return (
          <path
            key={i}
            d={"M" + x + " " + y + "q" + w * 0.33 + " -1 " + w + " -1.5"}
            fill="none"
            stroke={i % 3 ? "#71543f" : "#f1c491"}
            opacity=".55"
            strokeWidth={0.5 + noise(i, 3) * 1.1}
          />
        );
      })}
      {range(34).map((i) => (
        <ellipse
          key={i}
          cx={472 + (i % 3) * 129 + noise(i, 98) * 4}
          cy={289 + (i % 17) * 15}
          rx="1.4"
          ry="1.1"
          fill="#5c4b40"
        />
      ))}
    </g>
  );
}
function Roof() {
  return (
    <g>
      <path
        d="M309 290l2 -76 32 0 1 52z"
        fill="#826858"
        stroke="#464a43"
        strokeWidth="3"
      />
      <path d="M305 210l41 1v10l-40 -2z" fill="#59544d" />
      {range(5).map((i) => (
        <path
          key={i}
          d={"M312 " + (224 + i * 9) + "l29 1m-13 -1v-7"}
          stroke="#b69a75"
          fill="none"
          strokeWidth="1.5"
        />
      ))}
      <path d={roof} fill="#615a50" stroke="#303e3b" strokeWidth="4" />
      <g clipPath="url(#roofEdge)">
        {range(26).map((i) => {
          const x = 175 + i * 17;
          return (
            <g key={i}>
              <path
                d={"M" + x + " 367l145 -121 17 1 -144 124z"}
                fill={
                  [
                    "#805e4e",
                    "#a4775d",
                    "#aa7a5b",
                    "#736153",
                    "#886956",
                    "#b1805c",
                  ][i % 6]
                }
              />
              <path
                d={"M" + x + " 368l147 -124"}
                stroke="#534e44"
                strokeWidth="2.4"
              />
              <path
                d={"M" + (x + 3) + " 367l145 -123"}
                stroke="#d2a078"
                strokeWidth="1.3"
              />
            </g>
          );
        })}
        {range(115).map((i) => {
          const x = 184 + noise(i, 43) * 440,
            y = 239 + noise(i, 44) * 144;
          return (
            <path
              key={i}
              d={
                "M" +
                x +
                " " +
                y +
                "l" +
                (3 + noise(i, 45) * 14) +
                " -" +
                (2 + noise(i, 45) * 10)
              }
              stroke={i % 3 ? "#624f45" : "#dca47b"}
              strokeWidth={1 + noise(i, 50) * 2}
              opacity=".65"
            />
          );
        })}
        <path
          d="M342 281l24 -17 49 2 -9 11 -13 -1 -7 7 -17 -3 -5 5z M382 317l25 -21 29 2 -6 9 -8 1 -10 11z"
          fill="#35453e"
        />
        <path
          d="M345 281l31 -6 27 2m-17 39l21 -9 17 1"
          stroke="#b49b75"
          strokeWidth="3"
          fill="none"
        />
      </g>
      <path
        d="M191 353l276 23 142 -121 -7 -6 -140 119 -264 -21z"
        fill="#3c4940"
      />
      <path
        d="M466 375L604 254 760 368l-4 9 -151 -111 -135 115z"
        fill="#775e46"
        stroke="#38463c"
        strokeWidth="2.8"
      />
      <path
        d="M466 371l138 -119 154 114"
        fill="none"
        stroke="#d4ae7d"
        strokeWidth="3"
      />
      <path
        d="M201 349l54 4 -4 3 -19 0 -5 3 -26 -5z M442 368l26 2 28 -24 -15 19 -11 10 -24 -3z"
        fill="#9c9c5f"
      />
    </g>
  );
}
export function CabinDefs() {
  return (
    <>
      <clipPath id="frontWall">
        <path d={facade} />
      </clipPath>
      <clipPath id="roofEdge">
        <path d={roof} />
      </clipPath>
    </>
  );
}
export function Cabin() {
  return (
    <g>
      <path
        d="M203 542l54 -20 209 11 268 -5 63 26 -344 16z"
        fill="#304436"
        opacity=".7"
      />
      <path
        d="M218 502l245 29 280 -10 -1 27 -280 14 -244 -36z"
        fill="#5e6350"
      />
      {range(18).map((i) => {
        const x = 224 + 28 * i,
          y = x < 462 ? 521 + (x - 224) * 0.13 : 553 - (x - 462) * 0.045;
        return (
          <path
            key={i}
            d={"M" + x + " " + y + "l7 -8 14 -2 6 3 2 7 -13 3z"}
            fill={["#737969", "#7c7e69", "#565f53", "#99957a"][i % 4]}
          />
        );
      })}
      <path
        d="M215 349l252 18 -3 181 -247 -28z"
        fill="#735c46"
        stroke="#3b443b"
        strokeWidth="3"
      />
      {range(15).map((i) => {
        const y = 350 + i * 12;
        return (
          <g key={i}>
            <path
              d={"M216 " + y + "l248 " + (18 + i * 0.61)}
              stroke="#544e3d"
              strokeWidth="2.5"
            />
            <path
              d={"M219 " + (y + 2) + "l231 " + (17 + i * 0.6)}
              stroke="#9b7b55"
              strokeWidth="1.4"
            />
          </g>
        );
      })}
      <g transform="matrix(1 .10 0 1 0 -33)">
        <Window x={269} y={397} w={74} h={59} />
        <path d="M374 387l23 3 -3 113 -21 -3z" fill="#504e3d" />
        <path d="M380 392l9 1 -2 96 -9 -1z" fill="#827053" />
      </g>
      <Boards />
      <path d="M466 369v180 M741 372l-2 170" stroke="#785e43" strokeWidth="9" />
      <path d="M469 377v169 M737 380l-1 160" stroke="#d2a576" strokeWidth="2" />
      <path
        d="M500 379l103 -91 102 79 M605 292v53 M541 348l62 -8 61 6"
        stroke="#795c43"
        fill="none"
        strokeWidth="4"
      />
      <path d="M578 321l26 -20 27 19 -1 10 -53 2z" fill="#484d41" />
      {range(4).map((i) => (
        <path
          key={i}
          d={
            "M" +
            (580 + i * 6) +
            " " +
            (329 - i * 6) +
            "l" +
            (48 - i * 12) +
            " -2"
          }
          stroke="#a28865"
          strokeWidth="2"
        />
      ))}
      <Roof />
      <Window x={485} y={417} w={74} h={64} />
      <path
        d="M579 411l83 -3 -1 137 -84 3z"
        fill="#3e4538"
        stroke="#c19a6e"
        strokeWidth="6"
      />
      <path d="M584 413l73 -2 -2 133 -72 1z" fill="url(#doorDark)" />
      <path d="M582 539l75 -2 7 8 -89 3z" fill="#9a8d71" />
      <path
        d="M673 407l44 -1 2 71 -46 3z"
        fill="#425c51"
        stroke="#5e503d"
        strokeWidth="3"
      />
      <path
        d="M679 413l32 -1 1 58 -33 2z"
        fill="none"
        stroke="#bac19b"
        strokeWidth="1.2"
      />
      <path d="M688 430l7 -12 8 12 -5 -2 6 7 -16 0 5 -7z" fill="#e4d4ae" />
      <text
        x="696"
        y="459"
        textAnchor="middle"
        fontFamily="DejaVu Sans,sans-serif"
        fontWeight="bold"
        fontSize="20"
        fill="#e7d7b1"
      >
        07
      </text>
      <g transform="rotate(-2 606 377)">
        <rect
          x="535"
          y="361"
          width="147"
          height="31"
          rx="1"
          fill="#68553e"
          stroke="#473f32"
          strokeWidth="3"
        />
        <rect
          x="539"
          y="364"
          width="139"
          height="25"
          fill="#3e574b"
          stroke="#b9ac83"
          strokeWidth="1"
        />
        <text
          x="608"
          y="381"
          textAnchor="middle"
          fontFamily="DejaVu Sans,sans-serif"
          fontWeight="bold"
          letterSpacing="1.9"
          fontSize="12"
          fill="#f4ddaf"
        >
          ALDER LOOKOUT
        </text>
      </g>
      <path
        d="M457 511l22 -2 -15 46 -28 4z M448 523l-9 29 -45 -6 3 -11z"
        fill="#7d7056"
        stroke="#4e5342"
        strokeWidth="2"
      />
    </g>
  );
}
export function Door({ frame }: { frame: number }) {
  const open =
    0.075 * ease(106, 120, frame) -
    0.05 * ease(124, 143, frame) +
    1.57 * ease(157, 201, frame) +
    0.1 *
      Math.sin((frame - 205) / 6) *
      ease(195, 210, frame) *
      (1 - ease(210, 236, frame));
  const w = 72 * Math.cos(open),
    drop = 11 * Math.sin(open);
  return (
    <g transform={"matrix(" + w / 72 + " " + drop / 72 + " 0 1 583 412)"}>
      <path
        d="M0 0l72 -2 -1 130 -71 2z"
        fill="#57705c"
        stroke="#354a3e"
        strokeWidth="2.7"
      />
      {range(7).map((i) => (
        <g key={i}>
          <path
            d={"M" + (i * 10 + 1) + " 1l-1 127"}
            stroke="#3e584b"
            strokeWidth="2"
          />
          <path
            d={"M" + (i * 10 + 4) + " 6v41m0 34v40"}
            stroke="#839079"
            strokeWidth="1"
          />
        </g>
      ))}
      <path
        d="M1 8l69 -1v9l-69 1z M0 112L68 62l3 8 -70 52z M1 117l68 -2 1 8 -70 2z"
        fill="#79836b"
        stroke="#465b49"
        strokeWidth="1.5"
      />
      <path d="M56 57l7 0v13h-7z" fill="#38463e" />
      <circle cx="59" cy="63" r="2.5" fill="#c8ad77" />
    </g>
  );
}
