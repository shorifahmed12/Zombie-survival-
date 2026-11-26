import * as T from "three";

export const group = (parent: T.Object3D, x = 0, y = 0, z = 0) => {
  const g = new T.Group();
  g.position.set(x, y, z);
  parent.add(g);
  return g;
};
export function noise(i: number) {
  const n = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return n - Math.floor(n);
}
export function canvasMap(
  w: number,
  h: number,
  paint: (c: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  paint(canvas.getContext("2d")!);
  const map = new T.CanvasTexture(canvas);
  map.colorSpace = T.SRGBColorSpace;
  return map;
}
export function surface(color: string, roughness = 0.75, metalness = 0) {
  return new T.MeshStandardMaterial({ color, roughness, metalness });
}
export function aged(
  base: string,
  kind: "grain" | "steel" | "paper" | "stone",
) {
  const map = canvasMap(256, 256, (c) => {
    c.fillStyle = base;
    c.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 6400; i++) {
      const x = noise(i) * 256,
        y = noise(i + 7000) * 256;
      c.fillStyle = i % 3 ? "rgba(9,12,15,.065)" : "rgba(248,229,191,.085)";
      c.fillRect(
        x,
        y,
        kind === "grain"
          ? 2 + noise(i + 80) * 40
          : kind === "steel"
            ? noise(i + 30) * 12
            : 1 + noise(i + 90) * 3,
        1 + noise(i + 41) * 2,
      );
    }
    if (kind === "paper")
      for (let i = 0; i < 8; i++) {
        c.strokeStyle = "#66533e";
        c.strokeRect(i * 32 + 2, 0, 3, 256);
        for (let j = 0; j < 4; j++) {
          c.beginPath();
          c.ellipse(i * 32 + 18, j * 64 + 32, 8, 19, 0.3, 0, 7);
          c.stroke();
        }
      }
  });
  map.wrapS = map.wrapT = T.RepeatWrapping;
  return new T.MeshStandardMaterial({
    map,
    bumpMap: map,
    bumpScale: 0.003,
    roughness: kind === "steel" ? 0.36 : 0.84,
    metalness: kind === "steel" ? 0.65 : 0,
  });
}
const cube = new T.BoxGeometry(),
  ball = new T.SphereGeometry(1, 24, 18),
  cyl = new T.CylinderGeometry(1, 1, 1, 20);
export function mesh(
  p: T.Object3D,
  geo: T.BufferGeometry,
  m: T.Material,
  x: number,
  y: number,
  z: number,
  sx = 1,
  sy = 1,
  sz = 1,
) {
  const o = new T.Mesh(geo, m);
  o.position.set(x, y, z);
  o.scale.set(sx, sy, sz);
  p.add(o);
  return o;
}
export const box = (
  p: T.Object3D,
  m: T.Material,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
) => mesh(p, cube, m, x, y, z, w, h, d);
export const oval = (
  p: T.Object3D,
  m: T.Material,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
) => mesh(p, ball, m, x, y, z, w, h, d);
export function rod(
  p: T.Object3D,
  m: T.Material,
  a: number[],
  b: number[],
  r: number,
) {
  const start = new T.Vector3(...a),
    end = new T.Vector3(...b),
    v = end.clone().sub(start);
  const o = mesh(
    p,
    cyl,
    m,
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
    (a[2] + b[2]) / 2,
    r,
    v.length(),
    r,
  );
  o.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), v.normalize());
  return o;
}
export function profile(
  p: T.Object3D,
  m: T.Material,
  points: number[][],
  x: number,
  y: number,
  z: number,
  depth = 1,
) {
  return mesh(
    p,
    new T.LatheGeometry(
      points.map(([r, h]) => new T.Vector2(r, h)),
      32,
    ),
    m,
    x,
    y,
    z,
    1,
    1,
    depth,
  );
}
export function print(
  p: T.Object3D,
  lines: string[],
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  bg: string,
  ink: string,
  serif = false,
) {
  const map = canvasMap(512, Math.max(64, Math.round((512 * h) / w)), (c) => {
    const H = c.canvas.height;
    c.fillStyle = bg;
    c.fillRect(0, 0, 512, H);
    c.fillStyle = ink;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font =
      "600 " +
      Math.min(
        H / (lines.length * 1.35),
        800 / Math.max(...lines.map((s) => s.length)),
      ) +
      "px " +
      (serif ? "Georgia" : "Arial");
    lines.forEach((s, i) =>
      c.fillText(s, 256, (H * (i + 0.5)) / lines.length, 480),
    );
  });
  return mesh(
    p,
    new T.PlaneGeometry(w, h),
    new T.MeshBasicMaterial({ map }),
    x,
    y,
    z,
  );
}
export const ease = (v: number) => {
  v = Math.max(0, Math.min(1, v));
  return v * v * (3 - 2 * v);
};
