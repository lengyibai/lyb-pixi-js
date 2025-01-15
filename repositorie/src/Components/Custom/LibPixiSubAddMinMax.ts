import { LibJsNumberStepper } from "lyb-js/Misc/LibJsNumberStepper.js";

export interface LibPixiSubAddMinMaxParams {
  /** 初始下注索引 */
  initialBetIndex: number;
  /** 下注金额列表 */
  betAmountListLength: number;
  /** 金额更新回调
   * @param index 金额索引
   */
  onAmountIndex: (index: number) => void;
  /** 按钮置灰状态回调
   * @param type 被置灰的按钮类型
   */
  onDisabled: (type?: "min" | "max") => void;
}

/** @description 最小、最大按钮和增减按钮功能及置灰逻辑
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSubAddMinMax-数字控制器
 */
export class LibPixiSubAddMinMax {
  /** 步进器 */
  private _baseNumSteper: LibJsNumberStepper;

  /** 金额列表数量 */
  private _betAmountListLength = 0;

  /** 金额更新回调 */
  private _onAmountIndex: (index: number) => void;
  /** 按钮置灰状态回调 */
  private _onDisabled: (type?: "min" | "max") => void;

  constructor(params: LibPixiSubAddMinMaxParams) {
    const { initialBetIndex, betAmountListLength, onAmountIndex, onDisabled } =
      params;

    this._onAmountIndex = onAmountIndex;
    this._onDisabled = onDisabled;
    this._betAmountListLength = betAmountListLength;

    //金额增减步进器
    this._baseNumSteper = new LibJsNumberStepper(
      betAmountListLength,
      (index) => {
        this._onAmountIndex(index);
        this.minMaxUpdateIndex(index);
      }
    );

    //设置初始状态
    this.minMaxUpdateIndex(initialBetIndex);
    this._baseNumSteper.updateIndex(initialBetIndex);
  }

  /** @description 点击最小按钮 */
  min() {
    this.minMaxUpdateIndex(0);
    this._onAmountIndex(0);
  }

  /** @description 点击最大按钮 */
  max() {
    const index = this._betAmountListLength - 1;
    this.minMaxUpdateIndex(index);
    this._onAmountIndex(index);
  }

  /** @description 点击减少按钮 */
  sub() {
    this._baseNumSteper.down("sub");
  }

  /** @description 点击增加按钮 */
  add() {
    this._baseNumSteper.down("add");
  }

  /** @description 改变最小最大按钮状态及回调
   * @param index 索引
   */
  minMaxUpdateIndex(index: number) {
    if (index === 0) {
      this._onDisabled("min");
    } else if (index === this._betAmountListLength - 1) {
      this._onDisabled("max");
    } else {
      this._onDisabled();
    }
    this._baseNumSteper.updateIndex(index);
  }
}
