export type Point = { x: number; y: number };
export const point = (x: number, y: number): Point => ({ x, y });
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const limit = (t: number) => Math.max(0, Math.min(1, t));
export function ease(a: number, b: number, t: number) {
  const u = limit((t - a) / (b - a));
  return u * u * (3 - 2 * u);
}
export const wave = (t: number) => Math.sin(2 * Math.PI * t);
export const range = (n: number) => Array.from({ length: n }, (_, i) => i);
export function noise(i: number, seed = 0) {
  const n = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}
export const pathGround = (x: number) =>
  579 + 3 * Math.sin(x / 92) + 2 * Math.cos(x / 43);

// The pole selects the side of the hip–ankle line on which the knee bends.
export function joint(
  root: Point,
  end: Point,
  a: number,
  b: number,
  pole: number,
): Point {
  const dx = end.x - root.x,
    dy = end.y - root.y;
  const mag = Math.max(0.0001, Math.hypot(dx, dy));
  const d = Math.max(Math.abs(a - b) + 0.0001, Math.min(a + b - 0.0001, mag));
  const along = (a * a - b * b + d * d) / (2 * d);
  const height = pole * Math.sqrt(Math.max(0, a * a - along * along));
  return point(
    root.x + (dx * along + dy * height) / mag,
    root.y + (dy * along - dx * height) / mag,
  );
}
