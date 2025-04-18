import { Graphics } from "pixi.js";
import gsap from "gsap";

export interface LibPixiRectBgColorParams {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 背景颜色 */
  bgColor?: string | number;
  /** 透明度 */
  alpha?: number;
  /** 圆角半径 */
  radius?: number | number[];
  /** 边框宽度 */
  borderWidth?: number;
  /** 边框颜色 */
  borderColor?: string;
  /** 是否启用变色功能 */
  enableTint?: boolean;
}

/** @description 自定义矩形背景色
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiRectBgColor-矩形
 */
export class LibPixiRectBgColor extends Graphics {
  /** 圆边大小 */
  private radius: number | number[] = 0;
  /** 启用着色 */
  private enableTint = true;
  /** 背景颜色 */
  private bgColor: string | number = "#fff";
  /** 边框宽度 */
  private borderWidth = 0;
  /** 边框颜色 */
  private borderColor = "black";
  /** 背景色 */
  private bgAlpha = 1;

  constructor(options: LibPixiRectBgColorParams) {
    super();

    const {
      width,
      height,
      bgColor = "#fff",
      alpha = 1,
      radius = 0,
      borderWidth = 0,
      borderColor = "black",
      enableTint = true,
    } = options;

    this.bgAlpha = alpha;
    this.radius = radius;
    this.enableTint = enableTint;
    this.bgColor = bgColor;
    this.borderWidth = borderWidth;
    this.borderColor = borderColor;
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
      this.beginFill("#fff", this.bgAlpha);
      this.tint = this.bgColor;
    } else {
      this.beginFill(this.bgColor, this.bgAlpha);
    }

    this.borderWidth && this.lineStyle(this.borderWidth, this.borderColor, 1);

    if (this.radius !== 0) {
      if (typeof this.radius === "number") {
        this.drawRoundedRect(0, 0, width, height, this.radius);
      } else {
        // 绘制顶部边
        this.moveTo(0 + this.radius[0], 0);
        this.lineTo(0 + width - this.radius[1], 0);

        // 绘制右上角的圆角
        if (this.radius[1] > 0) {
          this.arcTo(
            0 + width,
            0,
            0 + width,
            0 + this.radius[1],
            this.radius[1]
          );
        } else {
          this.lineTo(0 + width, 0);
        }

        // 绘制右侧边
        this.lineTo(0 + width, 0 + height - this.radius[2]);

        // 绘制右下角的圆角
        if (this.radius[2] > 0) {
          this.arcTo(
            0 + width,
            0 + height,
            0 + width - this.radius[2],
            0 + height,
            this.radius[2]
          );
        } else {
          this.lineTo(0 + width, 0 + height);
        }

        // 绘制底部边
        this.lineTo(0 + this.radius[3], 0 + height);

        // 绘制左下角的圆角
        if (this.radius[3] > 0) {
          this.arcTo(
            0,
            0 + height,
            0,
            0 + height - this.radius[3],
            this.radius[3]
          );
        } else {
          this.lineTo(0, 0 + height);
        }

        // 绘制左侧边
        this.lineTo(0, 0 + this.radius[0]);

        // 绘制左上角的圆角
        if (this.radius[0] > 0) {
          this.arcTo(0, 0, 0 + this.radius[0], 0, this.radius[0]);
        } else {
          this.lineTo(0, 0);
        }

        this.closePath();
      }
    } else {
      this.drawRect(0, 0, width, height);
    }

    this.endFill();
  }
}
