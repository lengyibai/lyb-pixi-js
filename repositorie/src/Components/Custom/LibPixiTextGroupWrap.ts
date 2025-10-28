import { Container, Text, type ITextStyle } from "pixi.js";

interface TextItem {
  text: string | number;
  style?: Partial<ITextStyle>;
}

interface TextGroupOptions {
  items: TextItem[];
  defaultStyle?: Partial<ITextStyle>;
  wordWrapWidth?: number;
  paddingX?: number;
  paddingY?: number;
  align?: "left" | "center" | "right";
  anchorX?: number; // 0~1, 默认中心
  anchorY?: number; // 0~1, 默认中心
}

/** @description 文本组换行 */
export class LibPixiTextGroupWrap extends Container {
  constructor({
    items,
    defaultStyle = {},
    wordWrapWidth,
    paddingX = 0,
    paddingY = 0,
    align = "left",
    anchorX = 0,
    anchorY = 0,
  }: TextGroupOptions) {
    super();
    if (!items.length) return;

    const lineGroups: Text[][] = [];
    let currentLine: Text[] = [];
    let x = 0;

    // 分行
    for (const { text, style = {} } of items) {
      const instance = new Text(text, { ...defaultStyle, ...style });
      const w = instance.width;

      if (wordWrapWidth && x + w > wordWrapWidth && x > 0) {
        lineGroups.push(currentLine);
        currentLine = [];
        x = 0;
      }

      currentLine.push(instance);
      x += w + paddingX;
    }
    if (currentLine.length) lineGroups.push(currentLine);

    // 布局每行
    let y = 0;
    for (const line of lineGroups) {
      const totalWidth = line.reduce(
        (sum, i) => sum + i.width + paddingX,
        -paddingX
      );
      let offsetX = 0;
      if (align === "center" && wordWrapWidth)
        offsetX = (wordWrapWidth - totalWidth) / 2;
      else if (align === "right" && wordWrapWidth)
        offsetX = wordWrapWidth - totalWidth;

      let currentX = offsetX;
      let maxHeight = 0;
      for (const item of line) {
        item.x = currentX;
        item.y = y;
        this.addChild(item);
        currentX += item.width + paddingX;
        if (item.height > maxHeight) maxHeight = item.height;
      }
      y += maxHeight + paddingY;
    }

    // 根据 anchor 调整整体偏移
    const bounds = this.getLocalBounds();
    this.pivot.set(
      bounds.x + bounds.width * anchorX,
      bounds.y + bounds.height * anchorY
    );
  }
}
