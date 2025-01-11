import { BitmapText } from "pixi.js";

/** @description 自定义位图文本
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiBitText-位图
 */
export class LibPixiBitText {
  /** 字体名称 */
  private _fontName: string;
  /* 字体大小 */
  private _defaultFontSize?: number;

  /**
   * @param fontName 字体名称
   * @param defaultFontSize 默认字体大小
   */
  constructor(fontName: string, defaultFontSize?: number) {
    this._fontName = fontName;
    this._defaultFontSize = defaultFontSize;
  }

  /** @description 创建位图文本
   * @param text 文本内容
   * @param fontSize 字体大小，不填则使用默认大小
   * @returns 位图实例
   */
  createText(text: string | number, fontSize?: number) {
    const bitMapText = new BitmapText(text.toString(), {
      fontName: this._fontName,
      fontSize: this._defaultFontSize || fontSize,
    });

    return bitMapText;
  }
}
