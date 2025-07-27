import { Graphics } from "pixi.js";

/** @description 三角形 */
export class LibPixiTriangle extends Graphics {
  constructor(dots: [[number, number], [number, number]], color: string) {
    super();

    this.beginFill(color);
    this.moveTo(0, 0);
    this.lineTo(dots[0][0], dots[0][1]);
    this.lineTo(dots[1][0], dots[1][1]);
    this.endFill();
  }
}
