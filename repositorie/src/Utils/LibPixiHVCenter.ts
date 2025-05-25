import { Container } from "pixi.js";

/** @description 列表居中
 * @param parent 父容器
 * @param items 子元素数组
 * @param direction 方向数组，"x"表示水平，"y"表示垂直
 */
export const libPixiHVCenter = (
  parent: Container,
  items: Container[],
  direction: ("x" | "y")[]
) => {
  items.forEach((item) => {
    direction.forEach((d) => {
      item[d] =
        parent[d === "x" ? "width" : "height"] / 2 -
        item[d === "x" ? "width" : "height"] / 2;
    });
  });
};
