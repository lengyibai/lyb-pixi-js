import { Container, Graphics } from "pixi.js";
import gsap from "gsap";
import { LibPixiContainer } from "../../Base/LibPixiContainer";

export interface LibPixiScrollNumParams {
  /** 滚动区域宽度 */
  width: number;
  /** 滚动区域高度 */
  height: number;
  /** 一页高度 */
  pageHeight: number;
  /** 滚动的容器 */
  content: Container;
  /** 总数 */
  pageNum: number;
  /** 松手回调 */
  slideCallback?: (index: number) => void;
  /** 滚动回调 */
  scrollCallback?: (y: number, index: number) => void;
}

/** @description 通过鼠标或手指拖动数字列选择数字
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiScrollNum-数字滑动
 */
export class LibPixiScrollNum extends LibPixiContainer {
  /** 当前幻灯片索引 */
  private _currentIndex = 0;
  /** 滚动区域高度 */
  private _scrollHeight = 0;
  /** 滑动区域高度 */
  private _slideHeight = 0;
  /** 记录拖动开始时的Y坐标 */
  private _startY = 0;
  /** 偏移量 */
  private _offsetY = 0;
  /** 最大索引 */
  private _pageNum = 0;
  /** 记录开始时间 */
  private _startTime = new Date().getTime();
  /** 是否正在拖动 */
  private _isDragging = false;

  /** 滑动内容 */
  private _slideArea: Container;

  /** 滑动回调 */
  private _slideCallback?: (index: number) => void;
  /** 滚动回调 */
  private _scrollCallback?: (y: number, index: number) => void;

  constructor(params: LibPixiScrollNumParams) {
    const {
      width,
      height,
      content,
      slideCallback,
      scrollCallback,
      pageNum,
      pageHeight,
    } = params;
    super(width, height);

    //设置遮罩
    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, this.width, this.height);
    mask.endFill();
    this.addChild(mask);
    this.mask = mask;

    this._scrollHeight = height;
    this._slideHeight = pageHeight;
    this._slideArea = content;
    this._slideCallback = slideCallback;
    this._scrollCallback = scrollCallback;
    this._pageNum = pageNum - 1;

    this.addChild(this._slideArea);
    this._slideArea.x = width / 2;
    this._slideArea.y = this._scrollHeight / 2;

    // 监听拖动事件
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", this._onDragStart);
    window.addEventListener("pointermove", this._onDragMove.bind(this));
    window.addEventListener("pointerup", this._onDragEnd.bind(this));
  }

  /** @description 更新坐标
   * @param y Y坐标
   * @param index 页数索引
   */
  updatePosition(y: number, index: number) {
    this._slideArea.y = y;
    this._currentIndex = index;
  }

  /** @description 滑动到指定索引
   * @param index 页数索引
   * @param animate 是否需要过渡动画
   */
  slideTo(index: number, animate = true) {
    if (index < 0) {
      // 回弹到第一张
      gsap.to(this._slideArea, {
        y: this._scrollHeight / 2,
        duration: 0.25,
        onUpdate: () => {
          this._scrollCallback?.(this._slideArea.y, this._currentIndex);
        },
      });
      this._currentIndex = 0;
    } else if (index > this._pageNum) {
      // 回弹到最后一张
      gsap.to(this._slideArea, {
        y: -this._pageNum * this._slideHeight + this._scrollHeight / 2,
        duration: 0.5,
        onUpdate: () => {
          this._scrollCallback?.(this._slideArea.y, this._currentIndex);
        },
      });
      this._currentIndex = this._pageNum;
    } else {
      // 正常滑动
      this._currentIndex = index;
      gsap.to(this._slideArea, {
        y: -this._currentIndex * this._slideHeight + this._scrollHeight / 2,
        duration: animate ? 0.25 : 0.01,
        onUpdate: () => {
          this._scrollCallback?.(this._slideArea.y, this._currentIndex);
        },
      });
    }

    this._slideCallback?.(this._currentIndex);
  }

  /** @description 开始拖动 */
  private _onDragStart(event: any) {
    this._isDragging = true;
    this._startY = event.data.global.y;
    this._offsetY = this._slideArea.y;
    gsap.killTweensOf(this._slideArea);
    this._startTime = new Date().getTime();
  }

  /** @description 拖动中 */
  private _onDragMove(event: PointerEvent) {
    if (!this._isDragging) return;
    const moveY = event.pageY - this._startY;
    this._slideArea.y = this._offsetY + moveY;
    this._scrollCallback?.(this._slideArea.y, this._currentIndex);
  }

  /** @description 结束拖动 */
  private _onDragEnd(event: PointerEvent) {
    if (!this._isDragging) return;
    this._isDragging = false;

    const endTime = new Date().getTime() - this._startTime;
    const slide = this._startY - event.pageY; // 计算滑动的距离
    const slideSpeed = Math.abs(slide) / endTime; // 计算滑动速度
    const speedThreshold = 0.275;

    // 计算滑动的页面变化数，根据滑动距离来调整页码
    const slideThreshold = this._slideHeight / 2;

    // 计算实际的翻页增量，使用 `slide / this._slideHeight` 来计算滑动的页数
    const pageChange = Math.round(slide / this._slideHeight);

    // 如果滑动速度足够快，且滑动的距离大于阈值，强制翻页
    if (Math.abs(slide) > slideThreshold || slideSpeed > speedThreshold) {
      this._currentIndex += pageChange; // 这里会根据滑动的方向来增加或减少当前页码
    }

    // 防止超出页面的上下限
    if (this._currentIndex < 0) {
      this._currentIndex = 0; // 保证当前页码不小于 0
    } else if (this._currentIndex > this._pageNum) {
      this._currentIndex = this._pageNum; // 保证当前页码不大于最大页码
    }

    // 执行滑动到目标页码
    this.slideTo(this._currentIndex);
  }
}
