import type { Actor, Expression, Gear, Role } from "./types";
import { knee, performance } from "./motion";

const wardrobe = {
  scout: {
    cloth: "#d17a3b",
    light: "#ffbb72",
    shade: "#80432e",
    trim: "#e6ca89",
    face: "#263945",
  },
  mechanic: {
    cloth: "#528b91",
    light: "#a1c7ba",
    shade: "#315766",
    trim: "#f1bb70",
    face: "#283c48",
  },
  drifter: {
    cloth: "#677867",
    light: "#aeb69b",
    shade: "#384b4b",
    trim: "#c1bc88",
    face: "#667a72",
  },
  hollow: {
    cloth: "#76677d",
    light: "#ab93a4",
    shade: "#473f53",
    trim: "#bbaba0",
    face: "#748280",
  },
};
type Ink = typeof wardrobe.scout;
const outline = "#17262e";
const infected = (role: Role) => role === "drifter" || role === "hollow";

function Leg({
  hipY,
  x,
  y,
  back,
}: {
  hipY: number;
  x: number;
  y: number;
  back: boolean;
}) {
  const hip = { x: back ? -3 : 2, y: hipY },
    ankle = { x, y };
  const joint = knee(hip, ankle);
  const path =
    "M" +
    hip.x +
    " " +
    hip.y +
    " L" +
    joint.x +
    " " +
    joint.y +
    " L" +
    x +
    " " +
    y;
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d={path} fill="none" stroke={outline} strokeWidth="10" />
      <path
        d={path}
        fill="none"
        stroke={back ? "#34434a" : "#465962"}
        strokeWidth="6"
      />
      <path
        d={
          "M" +
          (hip.x + 1) +
          " " +
          (hip.y + 2) +
          " L" +
          (joint.x + 1) +
          " " +
          (joint.y - 1)
        }
        stroke={back ? "#49575a" : "#708080"}
        strokeWidth="1.3"
      />
      <ellipse
        cx={joint.x}
        cy={joint.y}
        rx="4.2"
        ry="3.6"
        fill={back ? "#26383e" : "#34484e"}
      />
      <g transform={"translate(" + x + " " + y + ")"}>
        <path
          d="M-4 -3 L3 -3 5 1 Q12 1 13 4 L12 6 -5 6Z"
          fill="#25343b"
          stroke={outline}
          strokeWidth="1.6"
        />
        <path d="M-4 4.5 H11" stroke="#89918a" strokeWidth="1.2" />
        <path d="M2 0 l3 1" stroke="#a99d84" />
      </g>
    </g>
  );
}
function HandGear({ gear }: { gear: Gear }) {
  if (gear === "torch")
    return (
      <g>
        <path d="M9 -4 L186 -29 Q192 -4 184 25 L9 2Z" fill="url(#torchbeam)" />
        <path
          d="M-5 -4 H5 L11 -6 14 -5 V2 L10 3 5 1 H-5Z"
          fill="#445862"
          stroke={outline}
          strokeWidth="1.5"
        />
        <path d="M11 -4 V1" stroke="#ffde99" strokeWidth="2.4" />
        <path d="M-1 -3 V0 M2 -3 V0" stroke="#9fa998" />
      </g>
    );
  if (gear === "radio")
    return (
      <g transform="rotate(12)">
        <path d="M-4 -13 v-9" stroke={outline} strokeWidth="2" />
        <rect
          x="-6"
          y="-14"
          width="12"
          height="18"
          rx="2"
          fill="#43545a"
          stroke={outline}
          strokeWidth="2"
        />
        <path d="M-3 -10 H3 M-3 -7 H3 M-3 -4 H3" stroke="#8a9c96" />
        <circle cy="1" r="1" fill="#ffb675" />
      </g>
    );
  return null;
}
function Arm({
  ink,
  angle,
  elbow,
  back,
  sick,
  gear,
  lean,
}: {
  ink: Ink;
  angle: number;
  elbow: number;
  back?: boolean;
  sick: boolean;
  gear: Gear;
  lean: number;
}) {
  return (
    <g
      transform={"translate(" + (back ? -3 : 2) + " -27) rotate(" + angle + ")"}
    >
      <path
        d="M-5 0 Q-6 -5 0 -6 Q4 -7 5 -1 L4 15 1 19 -4 17Z"
        fill={back ? ink.shade : ink.cloth}
        stroke={outline}
        strokeWidth="1.7"
      />
      <path
        d="M-4 10 L4 9 M-3 13 L3 12"
        stroke={back ? ink.cloth : ink.trim}
        strokeWidth="1.2"
      />
      <g transform={"translate(0 17) rotate(" + elbow + ")"}>
        <path
          d="M-3.4 -2 Q0 -4 3 -1 L3.8 13 2 16 -3 14Z"
          fill={back ? ink.shade : ink.cloth}
          stroke={outline}
          strokeWidth="1.5"
        />
        <path d="M-3 10 L3.7 9.5 L4 14 -3 15Z" fill="#33454a" />
        <g transform="translate(0 16)">
          {gear === "radio" && <HandGear gear="radio" />}
          <path
            d="M-3 -2 Q-4 1 -2 5 L0 6 1 4 3 5 4 1 2 -2Z"
            fill={sick ? "#849188" : "#37474a"}
            stroke={outline}
            strokeWidth="1.2"
          />
        </g>
      </g>
      {gear === "torch" && (
        <g
          transform={
            "translate(0 17) rotate(" +
            elbow +
            ") translate(0 16) rotate(" +
            (-angle - elbow - lean - 5) +
            ")"
          }
        >
          <HandGear gear="torch" />
        </g>
      )}
    </g>
  );
}
function Head({
  role,
  ink,
  expression,
  t,
}: {
  role: Role;
  ink: Ink;
  expression: Expression;
  t: number;
}) {
  const sick = infected(role),
    blink = t % 3.87 > 3.72,
    alarm = expression === "alarmed",
    focused = expression === "focused";
  const eye = sick ? "#d7f0a5" : "#fff2ce";
  return (
    <g strokeLinejoin="round">
      <path
        d="M-18 -10 Q-18 -27 -4 -30 Q13 -33 21 -20 L22 -10 25 -5 21 -3 Q20 11 9 15 Q-4 18 -15 9 Q-22 1 -18 -10Z"
        fill={ink.face}
        stroke={outline}
        strokeWidth="2"
      />
      <path
        d="M-15 -2 Q-13 11 3 14 Q-8 15 -15 9Z"
        fill="#142732"
        opacity=".65"
      />
      {sick ? (
        <g>
          <path
            d={
              role === "hollow"
                ? "M-18 -7 L-23 -14 -16 -15 -19 -23 -12 -21 -10 -30 -5 -26 5 -33 4 -28 12 -31 10 -25 19 -24 18 -19 10 -18 4 -21 -4 -16 -8 -17 -12 -7Z"
                : "M-20 -8 Q-23 -24 -13 -29 L-15 -34 -4 -30 3 -36 4 -31 16 -32 13 -27 22 -25 16 -20 4 -23 -4 -18 -8 -21 -13 -7Z"
            }
            fill="#293c40"
            stroke={outline}
            strokeWidth="1.4"
          />
          <path
            d="M-12 -8 l5 5 -2 3 4 3 M9 4 l4 -5 2 1 2 -5"
            fill="none"
            stroke="#374e50"
            strokeWidth="1.4"
          />
          <path d="M1 7 Q9 5 17 3 L15 10 6 12Z" fill="#24333b" />
          <path d="M6 7 l2 3 2 -4 M12 6 l2 2 1 -3" fill="#c4c3a6" />
        </g>
      ) : (
        <g>
          <path
            d="M-20 -5 Q-26 -21 -15 -31 Q-8 -41 6 -37 Q18 -35 20 -24 L25 -20 20 -15 4 -16 -9 -13 -13 -4Z"
            fill={ink.cloth}
            stroke={outline}
            strokeWidth="2"
          />
          <path
            d="M-19 -20 Q-15 -35 -2 -35 Q7 -34 12 -29 M-10 -18 Q-11 -29 -4 -33"
            fill="none"
            stroke={ink.light}
            strokeWidth="1.4"
          />
          {role === "mechanic" ? (
            <g>
              <path
                d="M-21 -15 Q-3 -20 24 -22 L28 -19 26 -16 9 -14 -18 -10Z"
                fill="#34494e"
              />
              <rect
                x="5"
                y="-22"
                width="13"
                height="7"
                rx="2"
                fill="#91c2b8"
                stroke={outline}
                strokeWidth="2"
              />
            </g>
          ) : (
            <g>
              <path
                d="M-22 -16 Q-7 -22 19 -24 L21 -18 Q-2 -15 -19 -10Z"
                fill="#35454b"
                stroke={outline}
              />
              <path d="M-18 -14 L-7 -17" stroke="#9d9c86" strokeWidth="1.3" />
              <path
                d="M10 -26 L20 -26 23 -23 22 -17 12 -16 9 -19Z"
                fill="#526167"
                stroke={outline}
                strokeWidth="1.5"
              />
              <path d="M17 -24 L21 -24 21 -19 17 -18Z" fill="#ffe8ab" />
            </g>
          )}
          <path
            d="M-16 -9 Q-12 -14 -8 -10 L-7 0 -12 4 -16 0Z"
            fill={ink.shade}
            stroke={outline}
            strokeWidth="1.3"
          />
          <path d="M-13 -6 v5" stroke={ink.light} />
          <path
            d="M-20 -21 Q-12 -31 -5 -31 M-17 -18 l2 -3 M-14 -20 l2 -3 M-11 -22 l2 -3"
            fill="none"
            stroke={ink.shade}
            strokeWidth=".85"
          />
          <path
            d="M-21 -15 l3 -.6 M-16 -16 l3 -.6 M-11 -17 l3 -.6"
            stroke="#b5ab91"
            strokeWidth=".6"
          />
          <circle cx="-12.4" cy="-1" r=".9" fill="#bfaa83" />
          <path
            d={
              alarm
                ? "M6 8 Q11 3 15 7 L15 10 Q10 12 6 8Z"
                : expression === "exhausted"
                  ? "M4 8 Q9 11 15 6"
                  : "M5 7 Q11 8 16 5"
            }
            fill={alarm ? "#142530" : "none"}
            stroke={alarm ? "#91a5a3" : "#bac3b7"}
            strokeWidth="1.2"
          />
        </g>
      )}
      <g transform={"translate(0 " + (sick ? -2 : 0) + ")"} fill={eye}>
        <ellipse
          cx="3"
          cy="-6.5"
          rx={sick ? 4.2 : 3.8}
          ry={blink && !sick ? 0.55 : alarm ? 5 : focused ? 2.5 : 3.6}
        />
        <ellipse
          cx="16"
          cy="-8"
          rx="2.8"
          ry={blink && !sick ? 0.5 : alarm ? 4.3 : 2.9}
        />
        {sick && (
          <g fill="#344b47">
            <circle cx="4.5" cy="-6" r="1.25" />
            <circle cx="17" cy="-7.6" r=".9" />
          </g>
        )}
        <path
          d={
            alarm ? "M-2 -13 l7 -2 M13 -16 l6 1" : "M-2 -12 l8 2 M13 -12 l6 -3"
          }
          stroke={sick ? "#405450" : "#aec2be"}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}
export function Character({ actor, time }: { actor: Actor; time: number }) {
  const { pose: p, travel, expression, facing } = performance(actor, time),
    ink = wardrobe[actor.role];
  const sick = infected(actor.role),
    scale = actor.scale ?? 1,
    face = facing === "left" ? -1 : 1;
  const x = actor.x + travel * scale,
    y = actor.y ?? 548,
    lean = -p.lean;
  return (
    <g
      transform={
        "translate(" +
        x +
        " " +
        y +
        ") scale(" +
        scale * face +
        " " +
        scale +
        ")"
      }
    >
      <ellipse cx="-1" cy="1" rx="29" ry="4.3" fill="#0a191e" opacity=".45" />
      <g transform={"translate(0 " + p.airborne + ") rotate(" + p.tumble + ")"}>
        <Leg hipY={p.hipY} x={p.farX} y={p.farY} back />
        <Leg hipY={p.hipY} x={p.nearX} y={p.nearY} back={false} />
        <g transform={"translate(0 " + p.hipY + ") rotate(" + lean + ")"}>
          <Arm
            ink={ink}
            angle={p.farArm}
            elbow={p.farElbow}
            back
            sick={sick}
            gear="none"
            lean={lean}
          />
          {!sick && (
            <g>
              <path
                d="M-9 -30 Q-18 -33 -20 -24 L-21 -7 Q-22 -2 -17 0 L-8 -2Z"
                fill="#414f4e"
                stroke={outline}
                strokeWidth="2"
              />
              <path d="M-19 -21 l8 2 -1 8 -9 -1Z" fill="#586862" />
              <path
                d="M-18 -24 l8 2 M-19 -7 l7 1"
                stroke="#a3906a"
                strokeWidth="1.2"
              />
            </g>
          )}
          <path
            d={
              sick
                ? "M-8 -34 Q0 -38 8 -31 L11 -16 9 1 4 -2 0 3 -3 0 -9 4 -8 -9 -12 -6Z"
                : "M-8 -34 Q0 -38 8 -31 L11 -15 10 1 1 4 -11 2 -10 -13Z"
            }
            fill={ink.cloth}
            stroke={outline}
            strokeWidth="2"
          />
          <path
            d="M-7 -25 Q1 -21 8 -25 L9 -19 Q3 -17 -6 -20Z"
            fill={ink.light}
            opacity=".22"
          />
          <path
            d="M-4 -13 l4 -1 M-6 -11 l3 -.6 M6 -9 l2 -2 M-3 -4 l2 1"
            stroke={ink.shade}
            fill="none"
            strokeWidth=".8"
          />
          <path d="M-8 -29 L-5 -28 -5 -5 2 2 -10 1Z" fill={ink.shade} />
          <path
            d="M4 -29 L6 -6 5 0"
            fill="none"
            stroke={ink.light}
            strokeWidth="1.1"
          />
          <path
            d="M-7 -7 L2 -9 3 -3 -6 -1Z"
            fill={ink.shade}
            stroke={outline}
            strokeWidth=".8"
          />
          {sick ? (
            <path
              d="M-7 -23 l7 7 -4 3 6 5 M7 -21 l-3 4"
              fill="none"
              stroke={outline}
              strokeWidth="2"
            />
          ) : (
            <g>
              <path d="M-7 -31 L7 -15" stroke="#35444a" strokeWidth="3.6" />
              <path d="M0 -23 l3 4" stroke="#ccba8e" strokeWidth="2" />
              <path d="M5 -14 l4 -2" stroke={ink.trim} strokeWidth="2" />
            </g>
          )}
          <g transform={"translate(0 -42) rotate(" + p.head + ")"}>
            <Head
              role={actor.role}
              ink={ink}
              expression={expression}
              t={time + (actor.phase ?? 0)}
            />
          </g>
          <path
            d="M-11 -39 Q-3 -33 7 -36 L10 -32 3 -28 -7 -30 -12 -34Z"
            fill={sick ? ink.shade : "#475f60"}
            stroke={outline}
            strokeWidth="1.4"
          />
          <path
            d="M-8 -35 Q-2 -31 5 -33"
            stroke={sick ? ink.light : "#91a29a"}
            fill="none"
            strokeWidth="1"
          />
          <Arm
            ink={ink}
            angle={p.nearArm}
            elbow={p.elbow}
            sick={sick}
            gear={actor.gear ?? "none"}
            lean={lean}
          />
        </g>
      </g>
    </g>
  );
}
