import type { Container, Sprite, Text } from "pixi.js";

/** @description 元素超过指定宽度就缩放
 * @param scaleContainer 需要缩放的元素
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiScaleContainer-超出缩放
 */
export const libPixiScaleContainer = (
  scaleContainer: Container | Sprite | Text,
  maxWidth: number,
  maxHeight?: number
) => {
  const scaleX = (maxWidth / scaleContainer.width) * scaleContainer.scale.x;
  const scaleY = maxHeight
    ? (maxHeight / scaleContainer.height) * scaleContainer.scale.y
    : scaleX;
  const scale = Math.min(scaleX, scaleY);
  scaleContainer.scale.set(scale > 1 ? 1 : scale);
};
