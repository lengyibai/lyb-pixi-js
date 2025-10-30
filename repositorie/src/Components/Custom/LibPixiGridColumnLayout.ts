export interface GridLayoutParams {
  /** 行数 */
  rowNum?: number;
  /** 列间隔 */
  colGap?: number;
  /** 行间隔 */
  rowGap?: number;
  /** 元素列表 */
  elementList?: any[];
  /** 锚点X */
  anchorX?: number;
  /** 锚点Y */
  anchorY?: number;
  /** 每列最大行数 */
  maxRow?: number;
  /** 布局方向：ltr 左到右，rtl 右到左 */
  direction?: "ltr" | "rtl";
}

import { Container } from "pixi.js";

/** @description 网格列布局 */
export class LibPixiGridColumnLayout<T extends Container> extends Container {
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

  /** @description 列布局 */
  layout() {
    const {
      rowNum = 1,
      colGap = 325,
      rowGap = 75,
      anchorX = 0,
      anchorY = 0,
      direction = "ltr",
    } = this._params as GridLayoutParams;

    const isRTL = direction === "rtl";

    this._elementList.forEach((item, index) => {
      const row = index % rowNum;
      const col = Math.floor(index / rowNum);
      item.x = isRTL ? -col * colGap : col * colGap;
      item.y = row * rowGap;
    });

    const bounds = this.getLocalBounds();
    this.pivot.set(bounds.x + bounds.width * anchorX, bounds.y + bounds.height * anchorY);
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
