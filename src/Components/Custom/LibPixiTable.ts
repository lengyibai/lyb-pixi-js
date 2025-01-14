/** @description 表格绘制并填入数字 */
import { Text, Container, Graphics } from "pixi.js";
import { libPixiScaleContainer } from "../../Utils/LibPixiScaleContainer";

export interface LibPixiTableParams {
  /** 表格数据 */
  data: (number | string)[][];
  /** 单元格宽度 */
  cellWidth?: number;
  /** 单元格高度 */
  cellHeight?: number;
  /** 字体大小 */
  fontSize?: number;
  /** 字体颜色 */
  fontColor?: string;
  /** 线条厚度 */
  lineWidth?: number;
  /** 线条颜色 */
  lineColor?: string;
}

/** @description 绘制表格并填充数字
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiTable-数字表格
 */
export class LibPixiTable extends Container {
  /** 行数 */
  private _rows: number;
  /** 列数 */
  private _cols: number;
  /** 单元格宽度 */
  private _cellWidth: number;
  /** 单元格高度 */
  private _cellHeight: number;
  /** 字体大小 */
  private _fontSize: number;
  /** 线条宽度 */
  private _lineWidth: number;

  /** 字体颜色 */
  private _fontColor: string;
  /** 线条颜色 */
  private _lineColor: string;

  /** 二维数字数组 */
  private _data: (number | string)[][];

  constructor(params: LibPixiTableParams) {
    super();

    const {
      data,
      cellWidth = 130,
      cellHeight = 100,
      fontColor = "#B4B4B8",
      fontSize = 24,
      lineWidth = 3,
      lineColor = "#B4B4B8",
    } = params;

    this._data = data;
    this._rows = data.length;
    this._cols = data[0].length;
    this._cellWidth = cellWidth;
    this._cellHeight = cellHeight;
    this._fontColor = fontColor;
    this._fontSize = fontSize;
    this._lineWidth = lineWidth;
    this._lineColor = lineColor;

    this._drawTable();
    this.fillNumbers();
  }

  /** @description 绘制表格 */
  private _drawTable() {
    const tableWidth = this._cellWidth * this._cols;
    const tableHeight = this._cellHeight * this._rows;

    const graphics = new Graphics();
    graphics.lineStyle(this._lineWidth, this._lineColor);

    // 绘制表格外框
    graphics.drawRect(0, 0, tableWidth, tableHeight);

    // 绘制横线
    for (let i = 1; i < this._rows; i++) {
      graphics.moveTo(0, i * this._cellHeight);
      graphics.lineTo(tableWidth, i * this._cellHeight);
    }

    // 绘制竖线
    for (let j = 1; j < this._cols; j++) {
      graphics.moveTo(j * this._cellWidth, 0);
      graphics.lineTo(j * this._cellWidth, tableHeight);
    }

    this.addChild(graphics);
  }

  /** @description 填充数字 */
  private fillNumbers() {
    for (let row = 0; row < this._rows; row++) {
      for (let col = 0; col < this._cols; col++) {
        const number = this._data[row][col];
        this._createNumberText(number, col, row);
      }
    }
  }

  /** @description 创建数字文本
   * @param number 数字
   * @param col 列索引
   * @param row 行索引
   */
  private _createNumberText(
    number: number | string,
    col: number,
    row: number
  ): void {
    const text = new Text(number.toString(), {
      _fontSize: this._fontSize,
      fill: this._fontColor,
    });

    // 计算文本的居中位置
    const x = col * this._cellWidth + this._cellWidth / 2;
    const y = row * this._cellHeight + this._cellHeight / 2;

    this.addChild(text);
    text.anchor.set(0.5);
    text.position.set(x, y);
    libPixiScaleContainer(text, this._cellWidth * 0.9);
  }
}
