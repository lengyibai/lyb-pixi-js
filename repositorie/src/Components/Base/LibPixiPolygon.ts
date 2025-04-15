import { Graphics, type IPointData } from "pixi.js";

/** @description 多边形类，可用于一些场景的局部点击，传颜色是为了方便定位，最终可能需要将颜色隐藏掉
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiPolygon-多边形
 */
export class LibPixiPolygon extends Graphics {
  constructor(points: IPointData[] | number[], color?: string) {
    super();

    this.beginFill(color || 0x000000);
    this.drawPolygon(points);
    this.endFill();

    if (!color) {
      this.alpha = 0;
    }
  }
}
