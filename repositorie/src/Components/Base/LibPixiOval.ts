import { Graphics } from "pixi.js";

/** @description 椭圆 */
export class LibPixiOval extends Graphics {
  constructor(width: number, height: number, color: string) {
    super();

    this.beginFill(color);
    this.drawEllipse(0, 0, width, height);
    this.endFill();
  }
}
