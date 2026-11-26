import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ease } from "./model";

// Use the depth buffer for inserts. Keep the corridor in deep focus.
export function Lens({ frame }: { frame: number }) {
  const { gl, scene, camera, size } = useThree();
  const lens = useMemo(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    const bokeh = new BokehPass(scene, camera, {
      focus: 1,
      aperture: 0.009,
      maxblur: 0.007,
    });
    composer.addPass(bokeh);
    const output = new OutputPass();
    composer.addPass(output);
    return { composer, bokeh, output };
  }, [gl, scene, camera]);
  useEffect(() => {
    lens.composer.setSize(size.width, size.height);
  }, [lens, size.width, size.height]);
  useEffect(
    () => () => {
      lens.bokeh.dispose();
      lens.output.dispose();
      lens.composer.dispose();
    },
    [lens],
  );
  useFrame(() => {
    let focus = 0;
    if (frame < 79 || frame >= 2661) {
      const phone = scene.getObjectByName("phone-screen");
      if (phone) focus = camera.position.distanceTo(phone.position);
    } else if (frame >= 79 && frame < 137)
      focus = 0.48 + 1.9 * ease((frame - 79) / 58);
    else if (frame >= 1753 && frame < 1940)
      focus =
        0.68 - 0.24 * ease((frame < 1830 ? frame - 1753 : frame - 1830) / 45);
    if (focus > 0) {
      (lens.bokeh.uniforms as { focus: { value: number } }).focus.value = focus;
      lens.composer.render(0);
    } else gl.render(scene, camera);
  }, 1);
  return null;
}
