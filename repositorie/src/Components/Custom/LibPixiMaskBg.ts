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
    const w = window.innerWidth;
    const h = window.innerHeight;

    const p1 = LibPixiMaskBg.stage.toLocal({ x: 0, y: 0 });
    const p2 = LibPixiMaskBg.stage.toLocal({ x: w, y: h });

    const x = Math.min(p1.x, p2.x);
    const y = Math.min(p1.y, p2.y);
    const width = Math.abs(p2.x - p1.x);
    const height = Math.abs(p2.y - p1.y);

    this.clear();
    this.beginFill(0x000000, 1);
    this.drawRect(x, y, width, height);
    this.endFill();
  }
}
