import { Container, Graphics, Text } from "pixi.js";

export interface LibPixiTableCell {
  text: Text; // 外部已构建好的 Text
  bgColor?: string; // 单元格背景色
}

export interface LibPixiTableParams {
  /** 表格数据 */
  data: (number | string | LibPixiTableCell)[][];
  /** 是否需要表格外框 */
  outsideBorder?: boolean;
  /** 单元格最小宽度 */
  cellWidth?: number;
  /** 单元格最小高度 */
  cellHeight?: number;
  /** 格子内部内边距 */
  cellPadding?: number;
  /** 线条厚度 */
  lineWidth?: number;
  /** 线条颜色 */
  lineColor?: string;
}

/** @description 表格（文本样式完全外部控制） */
export class LibPixiTableV2 extends Container {
  constructor(params: LibPixiTableParams) {
    super();

    const {
      data,
      outsideBorder = true,
      cellWidth = 80,
      cellHeight = 30,
      cellPadding = 6,
      lineWidth = 1,
      lineColor = "#cccccc",
    } = params;

    if (!data || !data.length) return;

    // 计算列数
    const cols = data.reduce((max, row) => Math.max(max, row.length), 0);

    // 计算列宽/行高
    const colWidths = Array(cols).fill(cellWidth);
    const rowHeights = Array(data.length).fill(cellHeight);

    for (let r = 0; r < data.length; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const raw = (data[r] && data[r][c]) ?? "";
        const txt = typeof raw === "object" && "text" in raw ? raw.text : new Text(String(raw)); // 无样式处理

        const w = txt.width + cellPadding * 2;
        const h = txt.height + cellPadding * 2;

        if (w > colWidths[c]) colWidths[c] = w;
        if (h > rowHeights[r]) rowHeights[r] = h;
      }
    }

    // 坐标
    const colX: number[] = [];
    let accX = 0;
    for (let c = 0; c < cols; c += 1) {
      colX.push(accX);
      accX += colWidths[c];
    }

    const rowY: number[] = [];
    let accY = 0;
    for (let r = 0; r < rowHeights.length; r += 1) {
      rowY.push(accY);
      accY += rowHeights[r];
    }

    const totalW = accX;
    const totalH = accY;

    // 背景绘制
    for (let r = 0; r < data.length; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const raw = data[r][c];
        const bgColor = typeof raw === "object" && "bgColor" in raw ? raw.bgColor : undefined;

        if (bgColor) {
          const bg = new Graphics();
          bg.beginFill(parseInt(bgColor.replace("#", ""), 16));
          bg.drawRect(colX[c], rowY[r], colWidths[c], rowHeights[r]);
          bg.endFill();
          this.addChild(bg);
        }
      }
    }

    // 网格线
    const g = new Graphics();
    g.lineStyle(lineWidth, parseInt(lineColor.replace("#", ""), 16));

    if (outsideBorder) {
      g.drawRect(0, 0, totalW, totalH);
    }

    let xPos = 0;
    for (let c = 1; c < cols; c += 1) {
      xPos += colWidths[c - 1];
      g.moveTo(xPos + lineWidth / 2, 0);
      g.lineTo(xPos + lineWidth / 2, totalH);
    }

    let yPos = 0;
    for (let r = 1; r < rowHeights.length; r += 1) {
      yPos += rowHeights[r - 1];
      g.moveTo(0, yPos + lineWidth / 2);
      g.lineTo(totalW, yPos + lineWidth / 2);
    }

    this.addChild(g);

    // 文本
    for (let r = 0; r < data.length; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const raw = data[r][c];

        const txt = typeof raw === "object" && "text" in raw ? raw.text : new Text(String(raw));

        const cx = colX[c];
        const cy = rowY[r];

        txt.x = Math.round(cx + (colWidths[c] - txt.width) / 2);
        txt.y = Math.round(cy + (rowHeights[r] - txt.height) / 2);

        this.addChild(txt);
      }
    }

    // @ts-ignore
    this.width = totalW;
    // @ts-ignore
    this.height = totalH;
  }
}
