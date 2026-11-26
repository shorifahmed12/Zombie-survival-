import * as T from "three";
import {
  aged,
  box,
  ease,
  group,
  noise,
  oval,
  print,
  profile,
  rod,
  surface,
} from "./model";

export function actor(parent: T.Object3D, role: "guard" | "girl" | "crawler") {
  const root = group(parent),
    body = group(root, 0, 0.94, 0),
    girl = role === "girl",
    beast = role === "crawler";
  const flesh = beast
    ? aged("#383c41", "stone")
    : surface(girl ? "#d7c9bb" : "#bd8267");
  const hair = surface("#271b19"),
    cloth = aged(girl ? "#d6cdb9" : beast ? "#353941" : "#20354d", "stone"),
    pants = surface("#222a36"),
    boots = surface("#231e1d", 0.4),
    brass = surface("#bca06c", 0.36, 0.6),
    white = surface("#e4d8c7"),
    iris = surface("#373e39");
  profile(
    body,
    cloth,
    [
      [0.14, 0],
      [0.21, 0.05],
      [0.19, 0.18],
      [0.235, 0.39],
      [0.25, 0.46],
      [0.185, 0.5],
      [0.1, 0.52],
    ],
    0,
    0,
    0,
    0.65,
  );
  if (girl)
    profile(
      body,
      cloth,
      [
        [0.36, -0.64],
        [0.32, -0.38],
        [0.21, 0.08],
        [0.17, 0.2],
      ],
      0,
      0,
      0,
      0.82,
    );
  if (role === "guard") {
    box(body, boots, 0, 0.08, 0, 0.42, 0.06, 0.27);
    box(body, brass, 0, 0.08, 0.145, 0.065, 0.045, 0.018);
    for (const s of [-1, 1]) {
      box(body, cloth, s * 0.126, 0.31, 0.136, 0.115, 0.106, 0.022);
      box(
        body,
        cloth,
        s * 0.126,
        0.355,
        0.151,
        0.124,
        0.034,
        0.015,
      ).rotation.z = s * 0.05;
      box(body, brass, s * 0.18, 0.48, 0.02, 0.095, 0.014, 0.09);
      box(body, cloth, s * 0.062, 0.463, 0.128, 0.073, 0.095, 0.02).rotation.z =
        -s * 0.45;
    }
    print(
      body,
      ["SECURITY"],
      0.115,
      0.394,
      0.155,
      0.13,
      0.033,
      "#282d32",
      "#eee2bc",
    );
    for (let i = 0; i < 5; i++)
      oval(body, brass, 0, 0.16 + i * 0.066, 0.135, 0.009, 0.009, 0.004);
  }
  const neck = group(body, 0, 0.505, 0);
  oval(neck, flesh, 0, 0.055, 0, 0.079, 0.095, 0.077);
  const head = group(neck, 0, 0.2, 0.007);
  profile(
    head,
    flesh,
    [
      [0.035, -0.161],
      [0.09, -0.138],
      [0.122, -0.085],
      [0.14, 0.018],
      [0.137, 0.09],
      [0.107, 0.142],
      [0.05, 0.166],
      [0, 0.17],
    ],
    0,
    0,
    0,
    0.9,
  );
  const lids: T.Group[] = [],
    brows: T.Mesh[] = [];
  if (!beast) {
    for (const s of [-1, 1]) {
      oval(head, flesh, s * 0.134, -0.007, 0, 0.032, 0.052, 0.027);
      const eye = group(head, s * 0.056, 0.018, 0.111);
      lids.push(eye);
      oval(eye, white, 0, 0, 0, 0.039, 0.019, 0.015);
      oval(eye, iris, 0, 0, 0.014, 0.015, 0.017, 0.006);
      oval(eye, white, -0.004, 0.005, 0.02, 0.004, 0.004, 0.002);
      brows.push(
        oval(head, hair, s * 0.057, 0.054, 0.113, 0.043, 0.009, 0.008),
      );
    }
    oval(head, flesh, 0, -0.018, 0.125, 0.025, 0.043, 0.028);
    oval(head, surface("#753e39"), 0, -0.08, 0.107, 0.041, 0.007, 0.008);
    oval(head, hair, 0, 0.109, -0.009, 0.143, 0.083, 0.124);
    for (let i = 0; i < 48; i++) {
      const a = i * 2.4,
        r = 0.105 + noise(i) * 0.033,
        front = Math.cos(a);
      const lock = oval(
        head,
        hair,
        Math.sin(a) * r,
        girl ? (front > 0.55 ? 0.117 : -0.023) : 0.096 + noise(i + 50) * 0.036,
        front * r * 0.82,
        girl ? 0.035 : 0.047,
        girl ? (front > 0.55 ? 0.042 : 0.22) : 0.058,
        0.032,
      );
      lock.rotation.z = Math.sin(a) * 0.24;
      lock.rotation.x = front * 0.19;
    }
  }
  const arms = [-1, 1].map((s) => {
    const shoulder = group(body, s * 0.226, 0.426, 0),
      elbow = group(shoulder, 0, -0.3, 0),
      hand = group(elbow, 0, -0.265, 0);
    oval(shoulder, cloth, 0, -0.123, 0, 0.084, 0.195, 0.083);
    oval(elbow, beast ? flesh : cloth, 0, -0.117, 0, 0.064, 0.157, 0.062);
    oval(hand, flesh, 0, -0.043, 0.005, 0.058, 0.081, 0.031);
    for (let j = 0; j < 5; j++) {
      const thumb = j === 4,
        x = thumb ? -s * 0.053 : (j - 1.5) * 0.025;
      const joint = group(hand, x, thumb ? -0.045 : -0.096, 0.009);
      joint.rotation.z = thumb ? -s * 0.58 : 0;
      joint.name = "digit-" + j;
      const len = beast ? 0.17 : 0.048 - j * 0.003;
      rod(joint, flesh, [0, 0, 0], [0, -len, 0.008], 0.012);
      rod(joint, flesh, [0, -len, 0.008], [0, -len * 1.65, 0.019], 0.009);
    }
    return { shoulder, elbow, hand };
  });
  const legs = [-1, 1].map((s) => {
    const hip = group(root, s * 0.117, 0.96, 0),
      knee = group(hip, 0, -0.44, 0),
      foot = group(knee, 0, -0.43, 0);
    oval(hip, beast ? flesh : pants, 0, -0.205, 0, 0.11, 0.275, 0.104);
    oval(knee, beast ? flesh : pants, 0, -0.2, 0, 0.081, 0.248, 0.081);
    oval(foot, boots, 0, -0.031, 0.056, 0.086, 0.072, 0.16);
    return { hip, knee, foot };
  });
  if (girl) root.scale.setScalar(0.73);
  if (beast) {
    root.scale.set(0.95, 1.47, 0.78);
    arms.forEach((a) => (a.shoulder.scale.y = 1.53));
    head.scale.set(0.82, 1.35, 0.82);
  }
  return {
    root,
    pose(f: number, fear: number, walk = 0, reach = 0) {
      const t = f / 30,
        cycle = f * 0.14,
        blink = (f + 13) % 109;
      body.position.y =
        0.94 + 0.006 * Math.sin(t * 2.8) + walk * 0.022 * Math.cos(cycle * 2);
      body.rotation.z = 0.015 * Math.sin(t) + fear * 0.035;
      neck.rotation.x = -fear * 0.15 + 0.025 * Math.sin(t);
      neck.rotation.y = 0.12 * Math.sin(t * 0.83);
      neck.rotation.z = girl ? -0.19 * ease(t / 2) : 0;
      lids.forEach(
        (l) =>
          (l.scale.y =
            (blink < 5 ? 0.2 + (0.8 * Math.abs(blink - 2)) / 3 : 1) *
            (1 + fear * 0.24)),
      );
      brows.forEach((b, i) => {
        b.rotation.z = (i ? 1 : -1) * (0.06 + fear * 0.29);
        b.position.y = 0.054 + fear * 0.014;
      });
      arms.forEach(({ shoulder, elbow, hand }, i) => {
        hand.children.forEach((digit) => {
          if (digit.name.startsWith("digit-"))
            digit.rotation.x =
              (girl && i && digit.name === "digit-0" ? 0 : -reach * 0.68) +
              fear * 0.025 * Math.sin(f * 0.77);
        });
        const s = i ? 1 : -1;
        shoulder.rotation.x =
          walk * 0.56 * s * Math.sin(cycle) - (i ? reach * 1.44 : 0);
        shoulder.rotation.z = s * (0.09 + fear * 0.055);
        elbow.rotation.x = -0.13 - fear * 0.15 - (i ? reach * 0.19 : 0);
      });
      legs.forEach(({ hip, knee, foot }, i) => {
        const a = cycle + i * Math.PI;
        // Solve hip and knee against a stance ankle or lifted swing ankle.
        const stride = 0.27 * walk * Math.sin(a);
        const drop = 0.845 - 0.12 * walk * Math.max(0, Math.cos(a));
        const distance = Math.min(0.869, Math.hypot(stride, drop));
        const bend = Math.acos(
          Math.min(
            1,
            (distance * distance - 0.44 * 0.44 - 0.43 * 0.43) /
              (2 * 0.44 * 0.43),
          ),
        );
        hip.rotation.x =
          -Math.atan2(stride, drop) -
          Math.atan2(0.43 * Math.sin(bend), 0.44 + 0.43 * Math.cos(bend));
        knee.rotation.x = bend;
        foot.rotation.x = -hip.rotation.x - knee.rotation.x;
      });
      if (beast) {
        body.rotation.x = 0.66;
        neck.rotation.y = 0.48 * Math.sin(t * 0.85);
        arms.forEach(({ shoulder, elbow }, i) => {
          shoulder.rotation.x = -1.4 + 0.83 * Math.sin(t * 3 + i * 3);
          shoulder.rotation.z = (i ? 1 : -1) * 0.86;
          elbow.rotation.x = -0.86;
        });
      }
    },
  };
}
