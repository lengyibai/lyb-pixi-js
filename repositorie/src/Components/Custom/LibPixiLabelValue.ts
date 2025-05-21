import { BitmapText, Container, Sprite } from "pixi.js";
import { LibPixiText } from "../Base/LibPixiText";
import { libPixiScaleContainer } from "../../Utils/LibPixiScaleContainer";

type T = Sprite | LibPixiText | BitmapText;

interface LabelValueParams {
  /** 描述 */
  label: T;
  /** 值 */
  value: T;
  /** 最大宽度 */
  maxWidth?: number;
  /** 间隔 */
  gap?: number;
}

/** @description 自适应宽度的标签和值组件
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiLabelValue-标签值
 */
export class LibPixiLabelValue extends Container {
  /** 描述 */
  private _label: T;
  /** 值 */
  private _value: T;

  /** 间隔 */
  private _gap: number;
  /** 最大宽度 */
  private _maxWidth?: number;

  constructor(params: LabelValueParams) {
    super();

    const { label, value, maxWidth, gap = 0 } = params;

    this._label = label;
    this._value = value;
    this._maxWidth = maxWidth;
    this._gap = gap;

    this.addChild(this._label);
    this._label.anchor.set(1, 0.5);

    this.addChild(this._value);
    this._value.anchor.set(0.5);

    this.updatePosition();
  }

  /** @description 更新坐标 */
  updatePosition() {
    this._label.x = this._label.width * 0.5 - this._value.width * 0.5;
    this._value.x = this._label.width * 0.5 + this._gap;

    this._maxWidth && libPixiScaleContainer(this, this._maxWidth);
  }
}
