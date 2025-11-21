import { Container } from "pixi.js";

/** @description 判断元素是否超出屏幕 */
export const libPixiIsOutOfView = (entity: Container) => {
  const bounds = entity.getBounds();
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;
  return (
    bounds.x + bounds.width < 0 ||
    bounds.x > viewWidth ||
    bounds.y + bounds.height < 0 ||
    bounds.y > viewHeight
  );
};
