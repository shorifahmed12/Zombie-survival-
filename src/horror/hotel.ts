import { smartphone } from "./phone";
import * as T from "three";
import {
  aged,
  box,
  canvasMap,
  group,
  mesh,
  noise,
  oval,
  print,
  profile,
  rod,
  surface,
} from "./model";
import { actor } from "./actors";

function archive(parent: T.Object3D) {
  const atlas = canvasMap(1536, 1536, (c) => {
    for (let i = 0; i < 36; i++) {
      const x = (i % 6) * 256,
        y = Math.floor(i / 6) * 256;
      c.save();
      c.translate(x, y);
      c.beginPath();
      c.rect(0, 0, 256, 256);
      c.clip();
      c.fillStyle = "#d6c9ab";
      c.fillRect(0, 0, 256, 256);
      c.fillStyle = "#272d30";
      c.fillRect(9, 9, 238, 213);
      c.save();
      c.beginPath();
      c.rect(9, 9, 238, 213);
      c.clip();
      const vx = 38 + noise(i) * 180,
        vy = 75 + noise(i + 99) * 56;
      for (let j = 0; j < 10; j++) {
        const k = Math.pow(0.76, j);
        c.strokeStyle = "rgba(191,172,139,.48)";
        c.strokeRect(vx + (10 - vx) * k, vy + (9 - vy) * k, 234 * k, 214 * k);
      }
      c.translate(50 + noise(i + 6) * 148, 152 + noise(i + 20) * 46);
      c.rotate((noise(i + 60) - 0.5) * 0.62);
      const scale = 0.65 + noise(i + 57) * 1.45;
      c.scale(scale, scale);
      c.fillStyle = "#141719";
      c.fillRect(-12, -28, 24, 36);
      c.fillStyle = "#ab9580";
      c.beginPath();
      c.ellipse(0, -39, 8, 11, 0, 0, 7);
      c.fill();
      c.fillStyle = "#302c29";
      c.fillRect(-8, -50, 16, 6);
      c.strokeStyle = "#181a1b";
      c.lineWidth = 7;
      for (const s of [-1, 1]) {
        c.beginPath();
        c.moveTo(s * 10, -24);
        c.lineTo(s * 20, -10);
        c.lineTo(s * (14 + noise(i + 12) * 10), -8 - noise(i + s + 10) * 36);
        c.stroke();
        c.beginPath();
        c.moveTo(s * 7, 2);
        c.lineTo(s * 11, 26);
        c.lineTo(s * 16, 45);
        c.stroke();
      }
      c.restore();
      for (let j = 0; j < 850; j++) {
        c.fillStyle = j % 2 ? "#ffffff17" : "#00000022";
        c.fillRect(
          9 + noise(i * 913 + j) * 237,
          9 + noise(j + 200) * 212,
          2,
          1,
        );
      }
      c.fillStyle = "#514338";
      c.font = "12px monospace";
      c.fillText("HOTEL  /  CAM " + String(i + 1).padStart(2, "0"), 13, 244);
      c.restore();
    }
  });
  const pos: number[] = [],
    uv: number[] = [];
  for (let side = 0; side < 3; side++)
    for (let r = 0; r < 12; r++)
      for (let k = 0; k < 21; k++) {
        const n = side * 252 + r * 21 + k,
          x = (k - 10) * 0.29 + (noise(n) - 0.5) * 0.05,
          y = 0.15 + r * 0.285 + (noise(n + 10) - 0.5) * 0.05,
          a = (noise(n + 99) - 0.5) * 0.27,
          tile = Math.floor(noise(n + 200) * 36);
        for (const [u, v] of [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 0],
          [1, 1],
          [0, 1],
        ]) {
          const dx = (u - 0.5) * 0.262,
            dy = (v - 0.5) * 0.257,
            xx = x + dx * Math.cos(a) - dy * Math.sin(a),
            yy = y + dx * Math.sin(a) + dy * Math.cos(a);
          pos.push(
            side === 0 ? xx : side === 1 ? -3.16 : 3.16,
            yy,
            side === 0 ? -2.89 : side === 1 ? xx : -xx,
          );
          uv.push(((tile % 6) + u) / 6, 1 - (Math.floor(tile / 6) + 1 - v) / 6);
        }
      }
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  mesh(
    parent,
    geo,
    new T.MeshBasicMaterial({
      map: atlas,
      side: T.DoubleSide,
      color: "#ccc0ab",
    }),
    0,
    0,
    0,
  );
}
export function hotel(zone: "lobby" | "hall" | "archive") {
  const root = new T.Group(),
    dan = actor(root, "guard"),
    girl = actor(root, "girl"),
    creature = actor(root, "crawler");
  const wood = aged("#665041", "grain"),
    wall = aged("#7a7167", "paper"),
    iron = aged("#59616a", "steel"),
    floor = aged("#45444a", "stone"),
    brass = surface("#b29462", 0.33, 0.65),
    black = surface("#20242b"),
    red = aged("#87322f", "grain");
  const glow = new T.MeshBasicMaterial({ color: "#ffdb9a" }),
    blue = new T.MeshBasicMaterial({ color: "#58738c" });
  const light = (
    x: number,
    y: number,
    z: number,
    color: number,
    power: number,
    range: number,
  ) => {
    const l = new T.PointLight(color, power, range, 2);
    l.position.set(x, y, z);
    root.add(l);
    return l;
  };
  root.add(new T.HemisphereLight(0xbacbea, 0x706353, 1.25));
  const key = new T.DirectionalLight(0xf9d3b1, 1.65);
  key.position.set(-3, 4, 3);
  root.add(key);
  function lamp(x: number, y: number, z: number) {
    box(root, iron, x, y, z, 0.35, 0.09, 0.17);
    oval(root, glow, x, y - 0.07, z, 0.14, 0.07, 0.09);
  }
  const desk = group(root),
    phone = group(root),
    lift = group(root),
    doors = [group(lift), group(lift)],
    hinge = group(root),
    receiver = group(root),
    clockA = group(root),
    clockB = group(root);
  const rain = group(root);
  if (zone === "lobby") {
    box(root, floor, 0, -0.12, 0, 10, 0.24, 12);
    box(root, wall, 0, 1.95, -3.1, 10, 3.9, 0.2);
    box(root, wall, -4.3, 1.95, 0, 0.2, 3.9, 7);
    box(root, wood, 0, 0.47, -2.93, 10, 0.94, 0.12);
    box(root, brass, 0, 0.98, -2.88, 10, 0.035, 0.05);
    desk.position.set(-0.85, 0, 0.45);
    box(desk, wood, 0, 0.53, 0, 2.5, 1.06, 0.67);
    box(desk, wood, 0, 1.085, 0, 2.66, 0.1, 0.83);
    for (let i = 0; i < 5; i++) {
      box(desk, brass, -1 + i * 0.49, 0.56, 0.342, 0.012, 0.76, 0.012);
      box(desk, wood, -0.76 + i * 0.49, 0.55, 0.35, 0.37, 0.62, 0.025);
    }
    phone.name = "phone-screen";
    phone.position.set(-0.55, 1.245, 0.65);
    phone.rotation.x = -1.03;
    smartphone(phone);
    box(root, wood, -1.15, 1.9, -2.88, 2.7, 1.32, 0.12);
    print(
      root,
      ["GUEST  REGISTRY"],
      -1.15,
      2.43,
      -2.8,
      1.45,
      0.14,
      "#3c322b",
      "#d5bf8c",
      true,
    );
    for (let i = 0; i < 12; i++) {
      const x = -2.23 + (i % 6) * 0.43,
        y = 2.16 - Math.floor(i / 6) * 0.48;
      print(
        root,
        [String(i + 1).padStart(2, "0")],
        x,
        y,
        -2.8,
        0.24,
        0.12,
        "#998052",
        "#211e1d",
      );
      const ring = mesh(
        root,
        new T.TorusGeometry(0.043, 0.011, 8, 20),
        brass,
        x,
        y - 0.15,
        -2.75,
      );
      ring.rotation.z = 0.14;
      rod(
        root,
        brass,
        [x, y - 0.19, -2.75],
        [x + 0.012, y - 0.31, -2.75],
        0.014,
      );
      box(root, brass, x + 0.036, y - 0.29, -2.75, 0.066, 0.021, 0.02);
    }
    lift.position.set(1.48, 0, -2.68);
    box(lift, black, 0, 1.25, -0.18, 1.72, 2.52, 0.14);
    for (const s of [-1, 1])
      box(lift, brass, s * 0.86, 1.28, 0.04, 0.1, 2.55, 0.22);
    box(lift, brass, 0, 2.52, 0.04, 1.8, 0.12, 0.21);
    print(
      lift,
      ["L I F T"],
      0,
      2.72,
      0.08,
      0.73,
      0.2,
      "#292622",
      "#d7be84",
      true,
    );
    doors.forEach((d, i) => {
      const s = i ? 1 : -1;
      box(d, iron, s * 0.405, 1.21, 0, 0.805, 2.4, 0.06);
      for (let j = 0; j < 4; j++)
        box(d, brass, s * (0.15 + j * 0.135), 1.2, 0.035, 0.012, 2.28, 0.01);
    });
    box(lift, brass, 0.998, 1.36, 0.08, 0.16, 0.46, 0.034);
    print(lift, ["B"], 0.998, 1.35, 0.109, 0.112, 0.135, "#513e2d", "#ffdf9c");
    girl.root.position.set(1.48, 0, -2.49);
    doors.forEach((d) => (d.position.z = 0.25));
    for (let i = 0; i < 3; i++) {
      box(root, blue, -3.4 + i * 0.7, 2.25, -2.96, 0.62, 1.87, 0.04);
      box(root, wood, -3.4 + i * 0.7, 2.25, -2.91, 0.035, 1.87, 0.05);
    }
    for (let i = 0; i < 48; i++) {
      const o = box(
        rain,
        blue,
        -3.68 + noise(i) * 1.95,
        1.35 + noise(i + 50) * 1.8,
        -2.86,
        0.006,
        0.11,
        0.006,
      );
      o.rotation.z = -0.18;
    }
    lamp(-1, 3, -2.65);
    light(-1, 2.8, -1.85, 0xffb269, 14, 7);
    light(1.55, 2.15, -2.1, 0xaad5ff, 5, 4);
  } else {
    const hall = zone === "hall",
      half = hall ? 1.55 : 3.25,
      back = hall ? -6 : -3;
    box(root, floor, 0, -0.11, 2, half * 2, 0.22, 18);
    for (const s of [-1, 1]) {
      box(root, wall, s * half, 1.68, 2, 0.14, 3.36, 18);
      box(root, wood, s * (half - 0.08), 0.13, 2, 0.055, 0.25, 18);
      for (let i = 0; i < 6; i++) {
        const z = -5 + i * 2.3;
        box(root, iron, s * (half - 0.12), 2.93, z, 0.13, 0.16, 0.1);
        lamp(s * (half - 0.17), 2.23, z);
      }
    }
    box(root, wall, 0, 1.66, back - 0.15, half * 2, 3.4, 0.2);
    box(root, floor, 0, 3.44, 2, half * 2, 0.14, 18);
    for (let i = 0; i < 4; i++) {
      const x = -1.12 + i * 0.25;
      rod(root, iron, [x, 3.12, back], [x, 3.12, 9], 0.055 + i * 0.008);
      for (let j = 0; j < 5; j++)
        box(root, brass, x, 3.12, -4 + j * 2.3, 0.15, 0.15, 0.05);
    }
    hinge.position.set(-0.57, 0, back + 0.08);
    box(hinge, red, 0.57, 1.22, 0, 1.14, 2.44, 0.12);
    for (const y of [0.62, 1.71])
      box(hinge, red, 0.57, y, 0.073, 0.89, 0.88, 0.06);
    print(
      hinge,
      ["13"],
      0.57,
      1.76,
      0.111,
      0.41,
      0.31,
      "#462c26",
      "#e3c992",
      true,
    );
    box(hinge, brass, 1.01, 1.02, 0.11, 0.075, 0.23, 0.025);
    rod(hinge, brass, [1.01, 1.06, 0.13], [0.86, 1.06, 0.16], 0.025);
    for (const s of [-1, 1])
      box(root, wood, s * 0.64, 1.26, back + 0.05, 0.1, 2.52, 0.19);
    box(root, wood, 0, 2.49, back + 0.05, 1.38, 0.11, 0.19);
    light(0.65, 2.4, back + 1, 0xffad68, 12, 7);
    light(-1.1, 2, 1, 0x789ed3, 9, 8);
    if (!hall) {
      archive(root);
      desk.position.set(0.88, 0, -1.47);
      box(desk, wood, 0, 0.86, 0, 1.48, 0.1, 0.68);
      for (const s of [-1, 1])
        for (const t of [-1, 1])
          box(desk, wood, s * 0.61, 0.42, t * 0.23, 0.09, 0.84, 0.09);
      const base = group(desk, -0.22, 0.93, 0.04);
      profile(
        base,
        black,
        [
          [0.18, 0],
          [0.22, 0.035],
          [0.19, 0.09],
          [0.13, 0.105],
        ],
        0,
        0,
        0,
        0.76,
      );
      const dial = group(base, 0, 0.08, 0.07);
      dial.rotation.x = -1.21;
      mesh(dial, new T.TorusGeometry(0.08, 0.016, 8, 32), brass, 0, 0, 0);
      for (let i = 0; i < 10; i++)
        oval(
          dial,
          black,
          Math.cos(i * 0.628) * 0.08,
          Math.sin(i * 0.628) * 0.08,
          0.009,
          0.013,
          0.013,
          0.008,
        );
      receiver.position.set(0.66, 1.085, -1.49);
      rod(receiver, black, [-0.16, 0, 0], [0.16, 0, 0], 0.029);
      for (const s of [-1, 1])
        oval(receiver, black, s * 0.16, -0.018, 0, 0.068, 0.05, 0.06);
      box(desk, black, 0.38, 1.03, -0.04, 0.42, 0.21, 0.13);
      [clockA, clockB].forEach((g, i) =>
        print(
          g,
          [i ? "3:13 AM" : "3:12 AM"],
          1.26,
          1.035,
          -1.435,
          0.39,
          0.16,
          "#191c1d",
          "#ff8e65",
        ),
      );
    }
  }
  const mote = canvasMap(32, 32, (c) => {
    const g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "#fff");
    g.addColorStop(1, "transparent");
    c.fillStyle = g;
    c.fillRect(0, 0, 32, 32);
  });
  const particleGeo = new T.BufferGeometry();
  particleGeo.setAttribute(
    "position",
    new T.Float32BufferAttribute(
      Array.from(
        { length: 540 },
        (_, i) => (noise(i) - 0.5) * (i % 3 === 1 ? 3.5 : 7),
      ),
      3,
    ),
  );
  const dust = new T.Points(
    particleGeo,
    new T.PointsMaterial({
      map: mote,
      size: 0.024,
      transparent: true,
      opacity: 0.37,
      depthWrite: false,
      color: 0xeed8b9,
    }),
  );
  root.add(dust);
  const shadow = canvasMap(64, 64, (c) => {
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "#080a0de0");
    g.addColorStop(1, "transparent");
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
  });
  const contact = mesh(
    root,
    new T.PlaneGeometry(0.95, 0.56),
    new T.MeshBasicMaterial({
      map: shadow,
      transparent: true,
      depthWrite: false,
    }),
    0,
    0.006,
    0,
  );
  contact.rotation.x = -Math.PI / 2;
  return {
    root,
    dan,
    girl,
    creature,
    contact,
    dust,
    phone,
    doors,
    hinge,
    rain,
    receiver,
    clockA,
    clockB,
    key,
  };
}
