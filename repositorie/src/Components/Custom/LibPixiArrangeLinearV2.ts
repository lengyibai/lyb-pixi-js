import { Container } from "pixi.js";
import { libPixiPivot } from "../../Utils/LibPixiActhor";

export interface GridLayoutParams {
  gap?: number | number[];
  direction?: "x" | "y";
  colNum?: number;
  elementList?: any[];
  anchorX?: number;
  anchorY?: number;
}

/** @description 线性排列 */
export class LibPixiArrangeLinearV2<T extends Container> extends Container {
  /** 参数 */
  private _params: GridLayoutParams;
  /** 元素列表 */
  private _elementList: T[] = [];

  constructor(params?: GridLayoutParams) {
    super();

    this._params = params || {};
    this._elementList = this._params.elementList || [];
  }

  /** @description 追加元素 */
  push(element: T) {
    this.addChild(element);
    this._elementList.push(element);
  }

  /** @description 布局 */
  layout() {
    const {
      colNum = this._elementList.length,
      gap = 0,
      direction = "x",
      anchorX = 0,
      anchorY = 0,
    } = this._params;

    let lastRowMax = 0; // 当前行（或列）的最大高度（或宽度），用于多行/多列换行时计算偏移
    let rowOffset = 0; // 累计偏移量，控制换行后的整体偏移位置
    this._elementList.forEach((item, index) => {
      const row = Math.floor(index / colNum); // 当前行号
      const col = index % colNum; // 当前列号

      if (direction === "x") {
        //间隔
        const gapValue = Array.isArray(gap) ? gap[index - 1] ?? 0 : gap;

        //在每行第一列重置列偏移量
        if (col === 0 && row > 0) {
          rowOffset += lastRowMax + gapValue;
          lastRowMax = 0;
        }

        // 横向位置 = 前一个元素的右侧 + 间隔；首列则从 0 开始
        item.x =
          col === 0
            ? 0
            : this._elementList[index - 1].x +
              this._elementList[index - 1].width +
              gapValue;
        // 纵向位置 = 当前累计的行偏移
        rowOffset && (item.y = rowOffset);

        // 更新当前行的最大高度
        lastRowMax = Math.max(lastRowMax, item.height);
      } else {
        //间隔
        const gapValue = Array.isArray(gap) ? gap[index - 1] ?? 0 : gap;

        //在每列第一行重置行偏移
        if (col === 0 && row > 0) {
          rowOffset += lastRowMax + gapValue;
          lastRowMax = 0;
        }

        // 纵向位置 = 首列则从 0 开始，其余从前一个元素的y坐标 + 高度 + 间隔；
        item.y =
          col === 0
            ? 0
            : this._elementList[index - 1].y +
              this._elementList[index - 1].height +
              gapValue;
        // 横向位置 = 当前累计的列偏移
        rowOffset && (item.x = rowOffset);

        // 更新当前列的最大宽度
        lastRowMax = Math.max(lastRowMax, item.width);
      }
    });

    libPixiPivot(this, anchorX, anchorY);
  }

  /** @description 获取列表元素 */
  getList() {
    return this._elementList;
  }

  /** @description 销毁列表元素 */
  destroyList() {
    this._elementList.forEach((item) => {
      item.destroy();
    });
    this._elementList = [];
  }
}
