import { Container, Graphics } from "pixi.js";

/** @description 全屏黑色蒙版 */
export class LibPixiMaskBg extends Graphics {
  /** 舞台 */
  static stage: Container;
  /** 蒙版透明度 */
  static bgAlpha = 0.5;

  constructor() {
    super();

    this.alpha = LibPixiMaskBg.bgAlpha;
  }

  /** @description 更新蒙版 */
  updateSize() {
    const topLeft = LibPixiMaskBg.stage.toLocal({ x: 0, y: 0 });
    const bottomRight = LibPixiMaskBg.stage.toLocal({
      x: window.innerWidth,
      y: window.innerHeight,
    });

    this.clear();
    this.beginFill(0x000000, 1);
    this.drawRect(
      topLeft.x,
      topLeft.y,
      bottomRight.x - topLeft.x,
      bottomRight.y - topLeft.y
    );
    this.endFill();
  }
}
