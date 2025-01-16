import type { Application, Container, FederatedPointerEvent } from "pixi.js";
import { libPixiEvent } from "./LibPixiEvent";

export interface LibPixiSlideInputParams {
  /** App */
  app: Application;
  /** 有效点击范围 */
  clickArea: Container[];
  /** 滑动区域 */
  sideArea: Container;
  /** 最大移动距离 */
  maxMoveDistance: number;
  /** 起点坐标 */
  startX?: number;
  /** 按下回调 */
  onDown?: () => void;
  /** 抬起回调 */
  onUp?: () => void;
  /** 拖动回调 */
  onChange: (x: number, value: number) => void;
}


/** @description 滑动选择器核心代码
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSlideInput-滑动选择值
 */
export class LibPixiSlideInput {
  /** App */
  private _app: Application;
  /** 滑动区域 */
  private _sideArea: Container;

  /** 最大移动距离 */
  private _maxMoveDistance: number;
  /** 是否处于拖动中 */
  private _isDragging = false;
  /** 当前移动的位置 */
  private _moveX = 0;
  /** 上次移动的位置 */
  private _lastMoveX = 0;

  /** 当前进度 */
  private _progress = 0;

  /** 按下回调 */
  private _onDown?: () => void;
  /** 抬起回调 */
  private _onUp?: () => void;
  /** 拖动回调 */
  private _onChange: (x: number, value: number) => void;

  constructor(params: LibPixiSlideInputParams) {
    const {
      app,
      clickArea,
      maxMoveDistance,
      onChange,
      onDown,
      onUp,
      sideArea,
    } = params;
    this._app = app;
    this._maxMoveDistance = maxMoveDistance;
    this._onChange = onChange;
    this._onDown = onDown;
    this._onUp = onUp;
    this._sideArea = sideArea;

    clickArea.forEach((item) => {
      libPixiEvent(item, "pointerdown", this._onDragStart.bind(this));
    });
    libPixiEvent(sideArea, "pointerdown", this._onDragMove.bind(this));
    app.stage.on("pointermove", this._onDragMove.bind(this));
    app.stage.on("pointerup", this._onDragEnd.bind(this));
  }

  /** @description 设置进度
   * @param value 进度值，范围 0-1
   */
  setValue(value: number) {
    this._progress = value;
    this._lastMoveX = this._maxMoveDistance * value;
    this._onChange(this._lastMoveX, value);
  }

  /** @description 按下触发 */
  private _onDragStart() {
    this._app.stage.eventMode = "static";
    this._isDragging = true;
    this._onDown?.();
  }

  /** @description 移动触发 */
  private _onDragMove(event: FederatedPointerEvent) {
    const position = event.getLocalPosition(this._sideArea);

    if (this._isDragging) {
      this._moveX = Math.max(0, Math.min(position.x, this._maxMoveDistance));
      this._progress = Number((this._moveX / this._maxMoveDistance).toFixed(2));
      this._onChange(this._moveX, this._progress);
    }
  }

  /** @description 抬起触发 */
  private _onDragEnd() {
    this._app.stage.eventMode = "auto";
    this._isDragging = false;
    this._lastMoveX = this._moveX;
    this._onUp?.();
  }
}
