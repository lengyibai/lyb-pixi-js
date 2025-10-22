import { Container, Text, type ITextStyle } from "pixi.js";

interface Params {
  /** 文本列表 */
  textList: { type: "h" | "p"; text: string; style?: Partial<ITextStyle> }[];
  /** 内容宽度 */
  width: number;
  /** 默认样式 */
  defaultStyle?: Partial<ITextStyle>;
}

/** @description 标题内容纵向排列 */
export class LibPixiHeadingParagraphLayout extends Container {
  constructor(params: Params) {
    super();

    const { textList, width, defaultStyle = {} } = params;

    const textItemList: Text[] = [];
    let lastText: Text;
    textList.forEach((item, index) => {
      const text = new Text(item.text, {
        wordWrap: true,
        wordWrapWidth: width,
        ...defaultStyle,
        ...item.style,
      });
      this.addChild(text);
      textItemList.push(text);

      if (item.type === "h") {
        text.anchor.x = 0.5;
        text.x = width / 2;
        text.style.align = "center";
      }

      if (lastText) {
        text.y = lastText.y + lastText.height + Number(defaultStyle.fontSize) / 2;
      }
      if (item.type === "h" && index !== 0) {
        text.y += Number(defaultStyle.fontSize);
      }

      lastText = text;
    });
  }
}
