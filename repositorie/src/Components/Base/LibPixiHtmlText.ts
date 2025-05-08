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
  /** 是否描边 */
  stroke?: boolean;
  /** 描边颜色 */
  strokeColor?: string | number;
  /** 描边宽度 */
  strokeThickness?: number;
  /** 字体样式 */
  fontFamily?: string;
  /** 字体粗细 */
  fontWeight?: TextStyleFontWeight;
  /** 是否换行 */
  wordWrap?: boolean;
  /** 换行宽度 */
  wordWrapWidth?: number;
  /** 行高 */
  lineHeight?: number;
  /** 对齐方式 */
  align?: TextStyleAlign;
  /** 阴影-颜色 角度 模糊度 阴影距离 */
  shadow?: [string, number, number, number];
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
      strokeColor,
      strokeThickness,
      fontFamily = "Arial",
      fontWeight = "normal",
      wordWrap = false,
      wordWrapWidth = 100,
      lineHeight = 1.25,
      align = "left",
      shadow,
    } = options;

    super(text.toString(), {
      fontSize,
      wordWrap,
      wordWrapWidth,
      fontWeight,
      lineHeight: lineHeight * fontSize,
      breakWords: wordWrap,
      fill: fontColor,
      align,
      whiteSpace: "pre-line",
      fontFamily: fontFamily,
      stroke: stroke ? strokeColor : "transparent",
      strokeThickness: stroke ? strokeThickness : 0,
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
