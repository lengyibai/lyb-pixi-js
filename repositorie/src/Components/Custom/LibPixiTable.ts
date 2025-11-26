import { Container, Graphics, Text, TextStyle, TextStyleAlign } from "pixi.js";

export interface LibPixiTableParams {
  /** 表格数据 */
  data: (number | string)[][];
  /** 是否需要表格外框 */
  outsideBorder?: boolean;
  /** 单元格最小宽度 */
  cellWidth?: number;
  /** 单元格最小高度 */
  cellHeight?: number;
  /** 字体大小 */
  fontSize?: number;
  /** 字体颜色 */
  fontColor?: string;
  /** 表格第一列字体颜色 */
  firstColumnFontColor?: string;
  /** 表格第一行字体颜色 */
  firstRowFontColor?: string;
  /** 是否字体需要加粗 */
  fontBold?: boolean;
  /** 格子内部内边距 */
  cellPadding?: number;
  /** 线条厚度 */
  lineWidth?: number;
  /** 线条颜色 */
  lineColor?: string;
  /** 文本对齐方式 */
  textAlign?: TextStyleAlign;
}

/** @description 绘制表格 */
export class LibPixiTable extends Container {
  constructor(params: LibPixiTableParams) {
    super();

    const {
      data,
      outsideBorder = true,
      cellWidth = 80,
      cellHeight = 30,
      fontSize = 14,
      fontColor = "#000000",
      firstColumnFontColor,
      firstRowFontColor,
      fontBold = false,
      cellPadding = 6,
      lineWidth = 1,
      textAlign = "left",
      lineColor = "#cccccc",
    } = params;

    if (!data || !data.length) return;

    // 计算列数（取最长行）
    const cols = data.reduce((max, row) => Math.max(max, row.length), 0);

    // 文本样式缓存
    const baseStyle = new TextStyle({
      fontSize,
      fontWeight: fontBold ? "bold" : "normal",
      align: textAlign,
    });

    // 先测量所有单元格尺寸，得到每列宽度、每行高度
    const colWidths: number[] = Array(cols).fill(cellWidth);
    const rowHeights: number[] = Array(data.length).fill(cellHeight);

    for (let r = 0; r < data.length; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const raw = (data[r] && data[r][c]) ?? "";
        const txt = new Text(String(raw), baseStyle);
        const w = txt.width + cellPadding * 2;
        const h = txt.height + cellPadding * 2;
        if (w > colWidths[c]) colWidths[c] = w;
        if (h > rowHeights[r]) rowHeights[r] = h;
      }
    }

    // 计算每个单元格左上坐标
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

    // 绘制网格线
    const g = new Graphics();
    const lineHex = parseInt(lineColor.replace("#", ""), 16);
    g.lineStyle(lineWidth, lineHex);

    const totalW = accX;
    const totalH = accY;

    // 可选外框
    if (outsideBorder) {
      g.drawRect(0, 0, totalW, totalH);
    }

    // 画竖线
    let xPos = 0;
    for (let c = 1; c < cols; c += 1) {
      xPos += colWidths[c - 1];
      g.moveTo(xPos + lineWidth / 2, 0);
      g.lineTo(xPos + lineWidth / 2, totalH);
    }
    // 画横线
    let yPos = 0;
    for (let r = 1; r < rowHeights.length; r += 1) {
      yPos += rowHeights[r - 1];
      g.moveTo(0, yPos + lineWidth / 2);
      g.lineTo(totalW, yPos + lineWidth / 2);
    }

    this.addChild(g);

    // 绘制文本（居中）
    for (let r = 0; r < data.length; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const raw = (data[r] && data[r][c]) ?? "";
        const color =
          (r === 0 && firstRowFontColor) ||
          (c === 0 && firstColumnFontColor) ||
          fontColor;
        const style = new TextStyle({
          fontSize,
          fontWeight: fontBold ? "bold" : "normal",
          fill: color,
          align: textAlign,
        });
        const txt = new Text(String(raw), style);
        const cx = colX[c];
        const cy = rowY[r];
        // 居中放置
        const tx = cx + (colWidths[c] - txt.width) / 2;
        const ty = cy + (rowHeights[r] - txt.height) / 2;
        txt.x = Math.round(tx);
        txt.y = Math.round(ty);
        this.addChild(txt);
      }
    }

    // 设置容器大小属性（便于外部读取）
    // @ts-ignore 想让外部能通过宽高读取
    this.width = totalW;
    // @ts-ignore
    this.height = totalH;
  }
}
