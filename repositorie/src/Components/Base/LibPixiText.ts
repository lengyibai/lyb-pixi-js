import { Text, TextStyle, type TextStyleAlign, type TextStyleFontWeight } from "pixi.js";

export interface LibPixiTextParams {
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
  /** 缩进，单位为字数 */
  indent?: number;
  /** 阴影-颜色 角度 模糊度 阴影距离 */
  shadow?: [string, number, number, number];
}

/** @description 自定义文本类
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiText-文本
 */
export class LibPixiText extends Text {
  constructor(options: LibPixiTextParams) {
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
      indent = 0,
      shadow,
    } = options;

    const style = new TextStyle({
      fontSize,
      wordWrap,
      wordWrapWidth,
      fontWeight,
      lineHeight: lineHeight * fontSize,
      breakWords: wordWrap,
      fill: fontColor,
      align,
      fontFamily: fontFamily,
      stroke: stroke ? strokeColor : "transparent",
      strokeThickness: stroke ? strokeThickness : 0,
      lineJoin: "round",
    });

    if (shadow) {
      style.dropShadow = true;
      style.dropShadowColor = shadow[0];
      style.dropShadowAngle = shadow[1] * (Math.PI / 180);
      style.dropShadowBlur = shadow[2];
      style.dropShadowDistance = shadow[3];
    }

    super(text, style);
    this.position.x = indent * fontSize;
  }
}
