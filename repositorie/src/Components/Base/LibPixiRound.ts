import { Graphics } from "pixi.js";

/** @description 圆圈 */
export class LibPixiRound extends Graphics {
  constructor(width: number, radius: number, color: string) {
    super();

    this.lineStyle(width, color);
    this.drawCircle(0, 0, radius);
  }
}
