import { Container, Sprite } from "pixi.js";

import { LibRectBgColor } from "../LibRectBgColor";

/** @description 自定义容器大小及背景色 */
export class LibContainer extends Container {
  /** 填充容器 */
  private _fill?: Sprite;
  /** 背景色填充 */
  private _bgColorFill?: LibRectBgColor;

  /**
   * @param width 容器宽度
   * @param height 容器高度
   * @param bgColor 背景色
   */
  constructor(width: number, height: number, bgColor?: string) {
    super();

    if (bgColor) {
      this._bgColorFill = new LibRectBgColor({
        width,
        height,
        bgColor,
      });
      this.addChild(this._bgColorFill);
    } else {
      this._fill = new Sprite();
      this._fill.width = width;
      this._fill.height = height;
      this.addChild(this._fill);
    }
  }

  /** @description 设置容器大小 */
  setSize(width: number, height: number) {
    if (this._fill) {
      this._fill.width = width;
      this._fill.height = height;
    }

    if (this._bgColorFill) {
      this._bgColorFill.renderBg(width, height);
    }
  }
}
