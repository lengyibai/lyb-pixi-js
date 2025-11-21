import { Container } from "pixi.js";
import gsap from "gsap";
import { libPixiEvent } from "./LibPixiEvent";

/** @description 按下放大
 * @param container 要放大的容器
 * @param type 缩放类型
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiDownScaleAnimation-按下放大
 */
export const LibPixiDownScaleAnimation = (
  container: Container,
  type: "small" | "big" = "big",
  scaleContainer?: Container
) => {
  libPixiEvent(container, "pointerdown", () => {
    gsap.to(scaleContainer || container, {
      duration: 0.1,
      pixi: {
        scale: type === "big" ? 1.1 : 0.9,
      },
    });
  });

  libPixiEvent(container, "pointerup", () => {
    gsap.to(scaleContainer || container, {
      duration: 0.1,
      pixi: {
        scale: 1,
      },
    });
  });

  libPixiEvent(container, "pointerleave", () => {
    gsap.to(scaleContainer || container, {
      duration: 0.1,
      pixi: {
        scale: 1,
      },
    });
  });
};
