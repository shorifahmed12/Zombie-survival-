import { joint, point, type Point } from "./math";
import type { Pose } from "./motion";

const ink = "#19292b";
function Limb({
  from,
  to,
  arm,
  far,
  z,
}: {
  from: Point;
  to: Point;
  arm?: boolean;
  far: boolean;
  z: boolean;
}) {
  const bend = joint(
    from,
    to,
    arm ? 27 : z ? 36 : 40,
    arm ? 25 : z ? 38 : 41,
    arm ? -1 : 1,
  );
  const d =
    "M" +
    from.x +
    " " +
    from.y +
    " L" +
    bend.x +
    " " +
    bend.y +
    " L" +
    to.x +
    " " +
    to.y;
  const width = arm ? 7.3 : 9.2;
  const core = z ? (far ? "#65826b" : "#a6c584") : far ? "#384953" : "#43556a";
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={ink} strokeWidth={width + 2.6} fill="none" />
      <path d={d} stroke={core} strokeWidth={width - 1.6} fill="none" />
      <path
        d={
          "M" + from.x + " " + (from.y - 1) + " L" + bend.x + " " + (bend.y - 1)
        }
        fill="none"
        stroke={far ? "#566358" : z ? "#d1dd9e" : "#949085"}
        strokeWidth="1.5"
      />
      <g transform={"translate(" + to.x + " " + to.y + ")"}>
        {arm ? (
          z ? (
            <g fill="none" stroke="#afcd93" strokeWidth="2.8">
              <path d="M-1 -2q5 -1 8 2l3 4 M0 0q4 0 6 4l2 3 M1 1l3 5" />
            </g>
          ) : (
            <>
              <path
                d="M-4 -4q5 -4 8 2l2 4q-3 5 -8 2z"
                fill={far ? "#916f55" : "#dec19a"}
                stroke={ink}
                strokeWidth="1.7"
              />
              <path d="M-4 -4l6 -2" stroke="#b3774f" strokeWidth="3" />
            </>
          )
        ) : (
          <>
            <path
              d="M-5 -6l8 -1 2 5 7 2q3 1 3 3l-21 0z"
              fill={z ? "#463e38" : far ? "#403b34" : "#634b3b"}
              stroke={ink}
              strokeWidth="1.8"
            />
            <path
              d="M-5 2l19 0"
              stroke={z ? "#968873" : "#c69e70"}
              strokeWidth="1.5"
            />
            <path d="M0 -4l4 -1" stroke="#b99a73" strokeWidth="1.4" />
          </>
        )}
      </g>
    </g>
  );
}
function Face({ pose: p }: { pose: Pose }) {
  const z = p.zombie;
  const faceX = z ? 5 * p.turn : 10 * p.turn - 5;
  const brim = 8 * p.turn;
  return (
    <g
      transform={
        "translate(" +
        p.shoulder.x +
        " " +
        (p.shoulder.y - 27) +
        ") rotate(" +
        p.tilt +
        ")"
      }
    >
      <path
        d="M-15 -13Q-10 -25 4 -22Q21 -21 22 -5Q25 10 17 17Q9 26 -5 21Q-19 18 -22 6Q-26 -5 -15 -13Z"
        fill={z ? "url(#sickSkin)" : "url(#warmSkin)"}
        stroke={ink}
        strokeWidth="2.6"
      />
      <path
        d="M-16 -10q-8 14 1 22l8 5"
        fill="none"
        stroke={z ? "#739774" : "#b99c78"}
        strokeWidth="2"
      />
      <g transform={"translate(" + faceX + " 0)"}>
        {z ? (
          <>
            <path
              d="M-10 -7q9 -9 16 0l-1 8q-12 5 -15 -2z M10 -8q7 -6 11 1l-1 7 -9 1z"
              fill="#587360"
            />
            <ellipse cx="-2" cy="-2" rx="6.1" ry="4.8" fill="#f5ffe7" />
            <ellipse cx="15.4" cy="-2" rx="4.3" ry="4.1" fill="#fbffe8" />
            <path d="M3 10q6 -5 14 -2l-3 9 -10 -2z" fill="#353c34" />
            <path d="M6 9l3 -1 -1 4z M11 8l3 0 -1 3z" fill="#ecdfb5" />
            <path
              d="M-12 -14l4 3 -2 3 M-14 4l5 3 -3 4 M9 0l-1 5 3 1"
              stroke="#5f805e"
              strokeWidth="1.25"
              fill="none"
            />
            <path
              d="M-19 -9l-3 -9 7 3 -1 -8 7 5 6 -6 6 3 5 -2 5 6 -10 0 -9 5z"
              fill="#526b57"
            />
          </>
        ) : (
          <>
            <g transform={"translate(0 -2) scale(1 " + p.blink + ")"}>
              <ellipse
                cx="-3"
                cy="0"
                rx="4.9"
                ry={4.4 + p.alarm * 1.8}
                fill="#fff4d7"
              />
              <ellipse
                cx="13"
                cy="-.7"
                rx="3.8"
                ry={4 + p.alarm}
                fill="#fff4d7"
              />
              <ellipse
                cx={-3 + 1.9 * p.turn}
                cy="0"
                rx="2.1"
                ry="3"
                fill={ink}
              />
              <ellipse
                cx={13 + 1.4 * p.turn}
                cy="-.6"
                rx="1.8"
                ry="2.7"
                fill={ink}
              />
            </g>
            <path
              d={"M-9 " + (-8 - 3 * p.alarm) + "q5 -3 10 0 M9 -9l7 -1"}
              stroke={ink}
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M7 0l-1 5 4 1"
              stroke="#ba8b62"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d={
                p.alarm > 0.58
                  ? "M2 13q5 -5 10 -3l-1 5q-4 3 -9 -2z"
                  : "M2 13q4 1 9 -1"
              }
              fill={p.alarm > 0.58 ? ink : "none"}
              stroke={ink}
              strokeWidth="1.5"
            />
          </>
        )}
      </g>
      {!z && (
        <g>
          {[-1, 1].map((side) => (
            <path
              key={side}
              d="M-19 0q-5 -2 -5 4t7 4"
              transform={"scale(" + side + " 1)"}
              opacity={0.5 + 0.5 * side * p.turn}
              fill="#d1a57d"
              stroke={ink}
              strokeWidth="1.5"
            />
          ))}
          <path
            d="M-23 0q-4 -9 1 -15l6 -5q18 -12 31 0l3 7 -21 -1 -10 9 -3 -4 -3 9z"
            fill="#263735"
          />
          <path
            d="M-23 -10q0 -18 17 -20q17 -2 24 13l-2 5 -23 2z"
            fill="#496e64"
            stroke={ink}
            strokeWidth="2"
          />
          <path
            d="M-18 -20q8 -9 17 -8 M-5 -27q9 1 12 11"
            stroke="#8ba387"
            fill="none"
            strokeWidth="1.4"
          />
          <path
            d={`M-21 -12Q0 -16 19 -15L${22 + brim} -17Q${26 + brim} -14 ${21 + brim} -12Q${brim} -8 ${-21 + brim} -8L${-23 + brim} -11Z`}
            fill="#354f49"
            stroke={ink}
            strokeWidth="1.6"
          />
          <path
            d={`M${-13 + brim} -13q11 -2 23 -2`}
            stroke="#c6b683"
            strokeWidth="1.3"
          />
        </g>
      )}
    </g>
  );
}
export function Actor({ pose: p }: { pose: Pose }) {
  const z = p.zombie,
    h = p.hip,
    s = p.shoulder;
  const angle = (Math.atan2(s.x - h.x, h.y - s.y) * 180) / Math.PI;
  return (
    <g transform={"translate(" + p.x + " " + p.y + ") scale(" + p.size + ")"}>
      <Limb from={point(h.x - 3, h.y)} to={p.feet[0]} far z={z} />
      <Limb from={point(s.x - 2, s.y + 2)} to={p.hands[0]} far z={z} arm />
      <Limb from={point(h.x + 2, h.y)} to={p.feet[1]} far={false} z={z} />
      <g transform={"translate(" + h.x + " " + h.y + ") rotate(" + angle + ")"}>
        {!z && (
          <>
            <path
              d="M-9 -40q-11 -5 -14 1l-3 23q1 7 12 7l7 -4z"
              fill="#40605b"
              stroke={ink}
              strokeWidth="2.8"
            />
            <path
              d="M-23 -33l11 2 -3 9 -10 -2z"
              fill="#66775e"
              stroke={ink}
              strokeWidth="1.3"
            />
            <path
              d="M-23 -37l13 2 M-23 -18l8 1"
              stroke="#b9a36b"
              strokeWidth="2"
            />
          </>
        )}
        <path
          d={
            z
              ? "M-8 -39l14 -2 7 13 -2 14 4 13 -7 -3 -3 5 -5 -5 -8 3 1 -20z"
              : "M-8 -44q9 -4 16 0l4 12 -4 17 5 14q-10 5 -25 0l3 -15z"
          }
          fill={z ? "url(#infectedCoat)" : "url(#raincoat)"}
          stroke={ink}
          strokeWidth="2.6"
        />
        <path
          d="M-6 -36l11 27 -3 4 -13 -28z"
          fill={z ? "#757b65" : "#425353"}
        />
        {!z && (
          <>
            <path d="M2 -17l4 -2 2 5 -4 2z" fill="#d8c899" />
            <path d="M-10 -5l21 0" stroke="#84593a" strokeWidth="2" />
          </>
        )}
        {z && (
          <path
            d="M-6 -35l3 6 -3 5 M7 -20l-6 6 4 3 M-7 -7l4 -5"
            fill="none"
            stroke="#a2a17e"
            strokeWidth="1.5"
          />
        )}
      </g>
      <Limb from={point(s.x, s.y + 2)} to={p.hands[1]} far={false} z={z} arm />
      <circle
        cx={s.x}
        cy={s.y + 2}
        r="5.6"
        fill={z ? "#64775e" : "#d8914c"}
        stroke={ink}
        strokeWidth="1.4"
      />
      <Face pose={p} />
      {!z && (
        <g transform={"translate(" + s.x + " " + (s.y + 1) + ")"}>
          <path
            d={
              "M-5 -4Q-19 6 -37 " +
              (7 - p.scarf * 0.35) +
              "L-30 " +
              (14 - p.scarf * 0.5) +
              "Q-20 15 -4 3Z"
            }
            fill="#bd4934"
            stroke={ink}
            strokeWidth="1.8"
          />
          <path
            d="M-13 -7q13 6 24 0l-2 7 -11 5 -12 -6z"
            fill="#eb7449"
            stroke={ink}
            strokeWidth="1.6"
          />
          <path
            d="M-9 -4q9 4 17 1"
            fill="none"
            stroke="#ffb073"
            strokeWidth="1.4"
          />
        </g>
      )}
    </g>
  );
}
