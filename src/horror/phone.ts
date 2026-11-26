import * as T from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { box, canvasMap, mesh, surface } from "./model";

export function smartphone(parent: T.Object3D) {
  const metal = surface("#373d42", 0.23, 0.78),
    glass = surface("#090d13", 0.16, 0.25);
  mesh(
    parent,
    new RoundedBoxGeometry(0.179, 0.33, 0.017, 4, 0.009),
    metal,
    0,
    0,
    0,
  );
  mesh(
    parent,
    new RoundedBoxGeometry(0.175, 0.326, 0.011, 4, 0.008),
    glass,
    0,
    0,
    0.006,
  );
  const map = canvasMap(448, 840, (c) => {
    const gradient = c.createLinearGradient(0, 0, 448, 840);
    gradient.addColorStop(0, "#253945");
    gradient.addColorStop(0.6, "#102632");
    gradient.addColorStop(1, "#171a24");
    c.fillStyle = gradient;
    c.fillRect(0, 0, 448, 840);
    c.textAlign = "center";
    const label = (t: string, y: number, size: number, color: string) => {
      c.font = "500 " + size + "px Arial";
      c.fillStyle = color;
      c.fillText(t, 224, y);
    };
    label("3:13 AM", 90, 37, "#d8e8ef");
    label("I N C O M I N G   C A L L", 218, 17, "#c0d5d6");
    label("My Number", 305, 61, "#fff7eb");
    label("+1 555 013 0013", 352, 29, "#c4d3d8");
    c.strokeStyle = "#81a2aa";
    c.lineWidth = 2;
    c.beginPath();
    c.arc(224, 483, 51, 0, 7);
    c.stroke();
    c.fillStyle = "#78959d";
    c.beginPath();
    c.arc(224, 469, 14, 0, 7);
    c.fill();
    c.beginPath();
    c.ellipse(224, 499, 27, 16, 0, Math.PI, Math.PI * 2);
    c.fill();
    for (const [x, color, word] of [
      [110, "#9a4748", "Decline"],
      [338, "#4e8576", "Answer"],
    ] as const) {
      c.fillStyle = color;
      c.beginPath();
      c.arc(x, 697, 36, 0, 7);
      c.fill();
      c.strokeStyle = "#fff5e8";
      c.lineWidth = 7;
      c.beginPath();
      c.arc(x, 687, 18, 0.3, 2.85);
      c.stroke();
      c.font = "21px Arial";
      c.fillStyle = "#e9e9e3";
      c.fillText(word, x, 764);
    }
  });
  mesh(
    parent,
    new T.PlaneGeometry(0.162, 0.299),
    new T.MeshBasicMaterial({ map }),
    0,
    0,
    0.012,
  );
  box(parent, metal, 0.091, 0.046, 0, 0.004, 0.047, 0.009);
}
