import { Container } from "pixi.js";
import { LibPixiBitText } from "../Base/LibPixiBitText";
import { LibPixiArrangeLinearV2 } from "./LibPixiArrangeLinearV2";

interface LibBitTextGroupParams {
  /** 字体 */
  family: string;
  /** 文本 */
  text: string;
  /** 字体大小 */
  fontSize: number;
  /** 间隔 */
  gap?: number;
  /** 锚点X */
  anchorX?: number;
  /** 锚点Y */
  anchorY?: number;
}

/** @description 美术字组 */
export class LibBitTextGroup extends LibPixiArrangeLinearV2<Container> {
  constructor(params: LibBitTextGroupParams) {
    const {
      family,
      text,
      fontSize,
      gap = -3,
      anchorX = 0.5,
      anchorY = 0.5,
    } = params;

    super({
      direction: "x",
      gap,
      anchorX,
      anchorY,
    });

    const bit = new LibPixiBitText(family, fontSize);
    for (const char of text) {
      const bitText = bit.createText(char);
      bitText.anchor.y = 0.5;
      this.push(bit.createText(char));
    }

    this.layout();
  }
}
