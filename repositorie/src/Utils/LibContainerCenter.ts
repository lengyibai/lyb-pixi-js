import { Container } from "pixi.js";

/** @description 当前容器在父容器居中 */
export const libContainerCenter = (parent: Container, item: Container, centerType: "x" | "y" | "xy" = "xy") => {
  const xy = centerType === "xy";

  if (centerType === "x" || xy) {
    item.x = parent.width / 2 - item.width / 2;
  }

  if (centerType === "y" || xy) {
    item.y = parent.height / 2 - item.height / 2;
  }
};