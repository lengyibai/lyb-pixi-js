import { Graphics } from "pixi.js";
import gsap from "gsap";

export interface LibRectBgColorParams {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 背景颜色 */
  bgColor?: string | number;
  /** x轴偏移 */
  x?: number;
  /** y轴偏移 */
  y?: number;
  /** 是否启用变色功能 */
  enableTint?: boolean;
}

/** @description 自定义矩形背景色 */
export class LibRectBgColor extends Graphics {
  /** 启用着色 */
  private enableTint = true;
  /** 背景颜色 */
  private bgColor: string | number = "#fff";

  constructor(options: LibRectBgColorParams) {
    super();

    const {
      x = 0,
      y = 0,
      width = 0,
      height = 0,
      bgColor = "#fff",
      enableTint = true,
    } = options;

    this.x = x;
    this.y = y;
    this.enableTint = enableTint;
    this.bgColor = bgColor;
    this.renderBg(width, height);
  }

  /** @description 重新绘制并添加颜色 */
  updateColor(tint: string) {
    gsap.to(this, { tint, duration: 0.25 });
  }

  /** @description 更新宽度 */
  renderBg(width: number, height: number) {
    this.clear();

    if (this.enableTint) {
      this.beginFill("#fff");
      this.tint = this.bgColor;
    } else {
      this.beginFill(this.bgColor);
    }

    this.drawRect(0, 0, width, height);
    this.endFill();
  }
}

new LibRectBgColor({
  width: 100,
  height: 100,
  bgColor: "red",
});
