export interface GridLayoutParams {
  /** 列数 */
  colNum?: number;
  /** 列间隔 */
  colGap?: number;
  /** 行间隔 */
  rowGap?: number;
  /** 元素列表 */
  elementList?: any[];
}

import { Container } from "pixi.js";

/** @description 网格布局 */
export class LibPixiGridLayoutV2<T extends Container> extends Container {
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
    const { colNum = this._elementList.length, colGap = 325, rowGap = 75 } = this._params;
    this._elementList.forEach((item, index) => {
      const col = index % colNum;
      const row = Math.floor(index / colNum);
      item.x = col * colGap;
      item.y = row * rowGap;
    });
  }

  /** @description 获取列表元素 */
  getList() {
    return this._elementList;
  }
}
