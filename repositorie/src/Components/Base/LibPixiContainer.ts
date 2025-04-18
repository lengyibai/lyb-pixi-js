import { Container, Graphics, Sprite } from "pixi.js";
import { LibPixiRectBgColor } from './LibPixiRectBgColor';

/** @description 自定义容器大小及背景色
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiContainer-容器
 */
export class LibPixiContainer extends Container {
  /** 填充容器 */
  private _fill?: Sprite;
  /** 背景色填充 */
  private _bgColorFill?: LibPixiRectBgColor;

  /**
   * @param width 容器宽度
   * @param height 容器高度
   * @param bgColor 背景色
   * @param overHidden 是否溢出裁剪
   */
  constructor(
    width: number,
    height: number,
    bgColor?: string,
    overHidden?: boolean
  ) {
    super();

    if (overHidden) {
      const mask = new Graphics();
      mask.beginFill(0xffffff);
      mask.drawRect(0, 0, width, height);
      mask.endFill();
      this.addChild(mask);
      this.mask = mask;
    }

    if (bgColor) {
      this._bgColorFill = new LibPixiRectBgColor({
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

  /** @description 设置容器大小
   * @param width 容器宽度
   * @param height 容器高度
   */
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
