import { Container } from "pixi.js";

/** @description 容器锚点设置 */
export const libPixiPivot = (
  container: Container,
  pivotX = 0,
  pivotY = pivotX
) => {
  const { x, y, width, height } = container.getLocalBounds();
  container.pivot.x = x + width * pivotX;
  container.pivot.y = y + height * pivotY;
};
