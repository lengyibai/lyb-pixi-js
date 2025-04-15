import { Graphics } from "pixi.js";

/** @description 圆形
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiCircular-圆形
 */
export class LibPixiCircular extends Graphics {
  constructor(radius: number, color: string) {
    super();

    this.beginFill(color);
    this.drawCircle(0, 0, radius);
    this.endFill();
  }
}
