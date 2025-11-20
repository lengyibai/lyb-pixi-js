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
    const bounds = LibPixiMaskBg.stage.getLocalBounds();

    this.clear();
    this.beginFill(0x000000, 1);
    this.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
    this.endFill();
  }
}
