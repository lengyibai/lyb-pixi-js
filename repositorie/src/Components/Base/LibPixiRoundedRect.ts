import { Graphics } from "pixi.js";

/** @description 圆角矩形 */
export class LibPixiRoundedRect extends Graphics {
  constructor(width: number, height: number, radius: number, color: string) {
    super();

    this.beginFill(color);
    this.drawRoundedRect(0, 0, width, height, radius);
    this.endFill();
  }
}
