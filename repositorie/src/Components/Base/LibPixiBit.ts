import { BitmapText } from "pixi.js";

/** @description 自定义位图文本 */
export class LibPixiBit extends BitmapText {
  constructor(fontName: string, text: string | number, fontSize: number) {
    super(text.toString(), {
      fontName,
      fontSize,
    });
  }
}
