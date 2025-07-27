import { Graphics } from "pixi.js";

/** @description 胶囊形 */
export class LibPixiCapsule extends Graphics {
  constructor(width: number, height: number, color: string) {
    super();

    this.beginFill(color);
    this.drawRoundedRect(0, 0, width, height, width / 2);
    this.endFill();
  }
}
