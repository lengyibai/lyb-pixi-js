import { libJsIsMobile } from "lyb-js/Browser/LibJsIsMobile.js";
import { libJsIsPad } from "lyb-js/Browser/LibJsIsPad.js";
import { libJsHorizontal } from "lyb-js/Misc/LibJsHorizontal.js";
import { Container } from "pixi.js";

/** @description 获取本地边界坐标
 * @param stage 舞台
 * @param mode 模式：hv 横竖屏都适用，h 横屏，v 竖屏
 */
export const libPixiLocalBoundary = (stage: Container, mode: string) => {
  const { w, h } = libJsHorizontal(mode);
  const isMobile = libJsIsMobile() || libJsIsPad();
  const isLandscape = w > h;

  const rightTarget = isMobile
    ? isLandscape
      ? { x: w, y: 0 }
      : { x: 0, y: h }
    : { x: w, y: 0 };

  const leftTop = stage.toLocal({ x: 0, y: 0 });
  const rightTop = stage.toLocal(rightTarget);

  return {
    isMobile,
    isLandscape,
    leftTop,
    rightTop,
    w,
    h,
  };
};
