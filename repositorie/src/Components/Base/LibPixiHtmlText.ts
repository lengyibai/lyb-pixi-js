import {
  HTMLText,
  type TextStyleAlign,
  type TextStyleFontWeight,
} from "pixi.js";

export interface LibPixiHtmlTextParams {
  /** 文本内容 */
  text: string | number;
  /**  字体大小 */
  fontSize?: number;
  /** 字体颜色 */
  fontColor?: any;
  /** 描边颜色 */
  stroke?: string | number;
  /** 描边宽度 */
  strokeThickness?: number;
  /** 字体样式 */
  fontFamily?: string;
  /** 字体粗细 */
  fontWeight?: TextStyleFontWeight;
  /** 换行宽度 */
  wordWrapWidth?: number;
  /** 行高 */
  lineHeight?: number;
  /** 对齐方式 */
  align?: TextStyleAlign;
  /** 阴影-颜色 角度 模糊度 阴影距离 */
  shadow?: [string, number, number, number];
  /** 按照单词换行 */
  breakWord?: boolean;
}

/** @description 自定义富文本类
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiHtmlText-富文本
 */
export class LibPixiHtmlText extends HTMLText {
  constructor(options: LibPixiHtmlTextParams) {
    const {
      text,
      fontSize = 36,
      fontColor = 0xffffff,
      stroke,
      strokeThickness,
      fontFamily = "Arial",
      fontWeight = "normal",
      wordWrapWidth,
      lineHeight = 1.25,
      align = "left",
      shadow,
      breakWord = true,
    } = options;

    super(text.toString(), {
      fontSize,
      wordWrap: !!wordWrapWidth,
      wordWrapWidth,
      fontWeight,
      lineHeight: lineHeight * fontSize,
      breakWords: breakWord,
      fill: fontColor,
      align,
      whiteSpace: "pre-line",
      fontFamily: fontFamily,
      stroke: stroke ? stroke : "transparent",
      strokeThickness: strokeThickness ? strokeThickness : 0,
    });

    if (shadow) {
      this.style.dropShadow = true;
      this.style.dropShadowColor = shadow[0];
      this.style.dropShadowAngle = shadow[1] * (Math.PI / 180);
      this.style.dropShadowBlur = shadow[2];
      this.style.dropShadowDistance = shadow[3];
    }
  }
}
