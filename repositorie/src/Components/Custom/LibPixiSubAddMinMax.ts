
import type { Container } from "pixi.js";
import { libPixiFilter } from "../../Utils/LibPixiFilter";//@ts-ignore
import { LibJsNumberStepper } from 'lyb-js/Misc/LibJsNumberStepper.js';

export interface LibPixiSubAddMinMaxParams {
  /** 最小按钮 */
  minBtn: Container;
  /** 最大按钮 */
  maxBtn: Container;
  /** 增加按钮 */
  subBtn: Container;
  /** 减少按钮 */
  addBtn: Container;
  /** 初始下注索引 */
  initialBetIndex: number;
  /** 下注金额列表 */
  betAmountListLength: number;
  /** 金额更新回调 */
  onAmountIndex: (index: number) => void;
}

/** @description 最小、最大按钮和增减按钮功能及置灰逻辑
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSubAddMinMax-数字控制器
 */
export class LibPixiSubAddMinMax {
  /** 步进器 */
  private baseNumSteper: LibJsNumberStepper;
  /** 最大最小按钮 */
  private minBtn: Container;
  private maxBtn: Container;
  /** 增加减少按钮 */
  private subBtn: Container;
  private addBtn: Container;

  /** 金额列表数量 */
  private betAmountListLength = 0;

  /** 金额更新回调 */
  onAmountIndex: (index: number) => void;

  constructor(params: LibPixiSubAddMinMaxParams) {
    const {
      minBtn,
      maxBtn,
      addBtn,
      subBtn,
      initialBetIndex,
      betAmountListLength,
      onAmountIndex,
    } = params;

    this.minBtn = minBtn;
    this.maxBtn = maxBtn;
    this.subBtn = subBtn;
    this.addBtn = addBtn;
    this.onAmountIndex = onAmountIndex;
    this.betAmountListLength = betAmountListLength;

    //金额增减步进器
    this.baseNumSteper = new LibJsNumberStepper(
      betAmountListLength,//@ts-ignore
      (index) => {
        this.onAmountIndex(index);
        this.minMaxUpdateIndex(index);
      }
    );

    //设置初始状态
    this.minMaxUpdateIndex(initialBetIndex);
    this.baseNumSteper.updateIndex(initialBetIndex);
  }

  /** @description 点击最小按钮 */
  min() {
    this.minMaxUpdateIndex(0);
    this.onAmountIndex(0);
  }

  /** @description 点击最大按钮 */
  max() {
    const index = this.betAmountListLength - 1;
    this.minMaxUpdateIndex(index);
    this.onAmountIndex(index);
  }

  /** @description 点击减少按钮 */
  sub() {
    this.baseNumSteper.down("sub");
  }

  /** @description 点击增加按钮 */
  add() {
    this.baseNumSteper.down("add");
  }

  /** @description 改变最小最大按钮状态及回调
   * @param index 索引
   */
  minMaxUpdateIndex(index: number) {
    if (index === 0) {
      this._setGrey("min");
    } else if (index === this.betAmountListLength - 1) {
      this._setGrey("max");
    } else {
      this._setGrey();
    }
    this.baseNumSteper.updateIndex(index);
  }

  /** @description 设置最大最小按钮置灰及恢复 */
  private _setGrey(type?: "min" | "max") {
    this.minBtn.filters = [];
    this.maxBtn.filters = [];
    this.subBtn.filters = [];
    this.addBtn.filters = [];

    if (type === "min") {
      this.minBtn.filters = [libPixiFilter("desaturate")];
      this.subBtn.filters = [libPixiFilter("desaturate")];
    } else if (type === "max") {
      this.maxBtn.filters = [libPixiFilter("desaturate")];
      this.addBtn.filters = [libPixiFilter("desaturate")];
    }
  }
}
