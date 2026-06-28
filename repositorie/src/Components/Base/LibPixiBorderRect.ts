import { Graphics } from "pixi.js";

/** @description 矩形描边参数 */
export interface LibPixiBorderRectParams {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 圆角 */
  radius?: number;
  /** 描边宽度 */
  lineWidth?: number;
  /** 描边颜色 */
  color?: string | number;
  /** 描边透明度 */
  alpha?: number;
  /** 内缩偏移 */
  inset?: number;
}

/** @description Pixi矩形描边 */
export class LibPixiBorderRect extends Graphics {
  /** 宽度 */
  private readonly _widthValue: number;
  /** 高度 */
  private readonly _heightValue: number;
  /** 圆角 */
  private readonly _radius: number;
  /** 描边宽度 */
  private readonly _lineWidth: number;
  /** 描边颜色 */
  private readonly _color: string | number;
  /** 描边透明度 */
  private readonly _alphaValue: number;
  /** 内缩偏移 */
  private readonly _inset: number;

  /** @description 创建矩形描边 */
  constructor(params: LibPixiBorderRectParams) {
    super();

    this._widthValue = params.width;
    this._heightValue = params.height;
    this._radius = params.radius ?? 0;
    this._lineWidth = params.lineWidth ?? 1;
    this._color = params.color ?? "#ffffff";
    this._alphaValue = params.alpha ?? 1;
    this._inset = params.inset ?? 0;

    this._drawBorder();
  }

  /** @description 重绘描边 */
  private _drawBorder() {
    const drawWidth = Math.max(0, this._widthValue - this._inset * 2);
    const drawHeight = Math.max(0, this._heightValue - this._inset * 2);

    this.clear();
    this.lineStyle(this._lineWidth, this._color, this._alphaValue);

    if (this._radius > 0) {
      this.drawRoundedRect(this._inset, this._inset, drawWidth, drawHeight, this._radius);
      return;
    }

    this.drawRect(this._inset, this._inset, drawWidth, drawHeight);
  }
}
