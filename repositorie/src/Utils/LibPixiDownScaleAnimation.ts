import { Container } from "pixi.js";
import { libPixiEvent } from "./LibPixiEvent";
import gsap from "gsap";

/** @description 按下放大
 * @param container 要放大的容器
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiDownScaleAnimation-按下放大
 */
export const LibPixiDownScaleAnimation = (container: Container) => {
  libPixiEvent(container, "pointerdown", () => {
    gsap.to(container, {
      duration: 0.1,
      pixi: {
        scale: 1.1,
      },
    });
  });

  libPixiEvent(container, "pointerup", () => {
    gsap.to(container, {
      duration: 0.1,
      pixi: {
        scale: 1,
      },
    });
  });

  libPixiEvent(container, "pointerleave", () => {
    gsap.to(container, {
      duration: 0.1,
      pixi: {
        scale: 1,
      },
    });
  });
};
