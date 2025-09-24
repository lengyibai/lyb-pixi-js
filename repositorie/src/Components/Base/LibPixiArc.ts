import { Graphics } from "pixi.js";

interface Params {
  start: number;
  end: number;
  radius: number;
  color: string;
  strokeColor?: string;
  thickness?: number;
  alpha?: number;
  anticlockwise?: boolean;
}

/** @description 弧形 */
export class LibPixiArc extends Graphics {
  constructor(params: Params) {
    super();

    const { start, end, radius, color, strokeColor, thickness, alpha = 1, anticlockwise = false } = params;

    this.beginFill(color, alpha); // 半透明绿色填充
    strokeColor && this.lineStyle(thickness!, strokeColor); // 线宽为2，红色
    this.moveTo(0, 0);
    this.arc(0, 0, radius, start, end, anticlockwise);
    this.closePath();
    this.endFill();
  }
}
