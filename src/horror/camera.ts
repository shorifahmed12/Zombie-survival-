import * as T from "three";
import { ease } from "./model";
export type V = [number, number, number];
export type Shot = [number, V, V, V, number, number?];
// Positions and targets use set coordinates. Each cut establishes a fresh move.
export function direct(
  camera: T.PerspectiveCamera,
  shots: Shot[],
  frame: number,
) {
  const i = shots.reduce((last, s, k) => (s[0] <= frame ? k : last), 0);
  const [start, a, b, look, fov, finish] = shots[i],
    end = shots[i + 1]?.[0] ?? 2700;
  const u = ease((frame - start) / Math.max(1, end - start - 1));
  camera.position.set(...a).lerp(new T.Vector3(...b), u);
  camera.fov = fov + ((finish ?? fov) - fov) * u;
  camera.near = 0.012;
  camera.far = 55;
  camera.lookAt(...look);
  camera.rotateZ(0.012 * Math.sin(u * Math.PI) * (i % 2 ? 1 : -1));
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
}
