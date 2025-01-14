import { Graphics, type Container } from "pixi.js";

/** @description 为容器创建并应用一个矩形遮罩，用于隐藏溢出的内容，函数会返回遮罩，可控制是否显示遮罩
 * @param container 需要设置遮罩裁剪的容器
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiOverflowHidden-溢出裁剪
 */
export const libPixiOverflowHidden = (container: Container) => {
  const mask = new Graphics();
  mask.beginFill(0xffffff);
  mask.drawRect(0, 0, container.width, container.height);
  mask.endFill();
  container.addChild(mask);
  container.mask = mask;
  return mask;
};
