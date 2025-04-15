import { Graphics } from "pixi.js";

/** @description 矩形类，可用于一些场景的局部点击，传颜色是为了方便定位，最终可能需要将颜色隐藏掉
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiRectangle-矩形
 */
export class LibPixiRectangle extends Graphics {
  constructor(width: number, height: number, color?: string) {
    super();

    this.beginFill(color || 0x000000);
    this.drawRect(0, 0, width, height);
    this.endFill();

    if (!color) {
      this.alpha = 0;
    }
  }
}
