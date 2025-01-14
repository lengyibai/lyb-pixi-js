import { Container, type FederatedPointerEvent } from "pixi.js";
import gsap from "gsap";
import { libPixiOverflowHidden } from "../../Utils/LibPixiOverflowHidden";
import { LibPixiContainer } from '../Base/LibPixiContainer';

/** @description 类似轮播图，但是不会自动轮播
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSlider-横向滑动图
 */
export class LibPixiSlider extends LibPixiContainer {
  /** 当前幻灯片索引 */
  private _currentIndex = 0;
  /** 滑动区域宽度 */
  private _slideWidth = 0;
  /** 记录拖动开始时的X坐标 */
  private _startX = 0;
  /** 偏移量 */
  private _offsetX = 0;
  /** 最大索引 */
  private _pageNum = 0;
  /** 记录开始时间 */
  private _startTime = new Date().getTime();
  /* 是否正在拖动 */
  private _isDragging = false;

  /** 滑动内容 */
  private _slideArea: Container;

  /** @description 滑动回调 */
  private slideCallback: (pageIndex: number, _pageNum: number) => void;

  /**
   * @param width 宽度
   * @param height 高度
   * @param content 内容
   * @param slideCallback 滑动结束回调
   */
  constructor(
    width: number,
    height: number,
    content: Container,
    slideCallback: (pageIndex: number, _pageNum: number) => void
  ) {
    super(width, height);
    libPixiOverflowHidden(this);

    this._slideWidth = width;
    this._slideArea = content;
    this.slideCallback = slideCallback;
    this._pageNum = Math.floor(content.width / this._slideWidth) - 1;
    this.addChild(content);

    // 监听拖动事件
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerdown", this._onDragStart);
    window.addEventListener("pointermove", this._onDragMove.bind(this));
    window.addEventListener("pointerup", this._onDragEnd.bind(this));
  }

  /** @description 上一页 */
  prev() {
    this._slideTo(this._currentIndex - 1);
  }

  /** @description 下一页 */
  next() {
    this._slideTo(this._currentIndex + 1);
  }

  /** @description 滑动到指定索引
   * @param index 索引
   */
  private _slideTo(index: number) {
    if (index < 0) {
      // 回弹到第一张
      gsap.to(this._slideArea, { x: 0, duration: 0.25 });
      this._currentIndex = 0;
    } else if (index > this._pageNum) {
      // 回弹到最后一张
      gsap.to(this._slideArea, {
        x: -this._pageNum * this._slideWidth,
        duration: 0.5,
      });
      this._currentIndex = this._pageNum;
    } else {
      // 正常滑动
      this._currentIndex = index;
      gsap.to(this._slideArea, {
        x: -this._currentIndex * this._slideWidth,
        duration: 0.25,
      });
    }

    this.slideCallback(this._currentIndex, this._pageNum);
  }

  /** @description 开始拖动 */
  private _onDragStart(event: FederatedPointerEvent) {
    this._isDragging = true;
    this._startX = event.global.x;
    this._offsetX = this._slideArea.x;
    gsap.killTweensOf(this._slideArea);
    this._startTime = new Date().getTime();
  }

  /** @description 拖动中 */
  private _onDragMove(event: PointerEvent) {
    if (!this._isDragging) return;
    const moveX = event.pageX - this._startX;
    this._slideArea.x = this._offsetX + moveX;
  }

  /** @description 结束拖动 */
  private _onDragEnd(event: PointerEvent) {
    if (!this._isDragging) return;
    this._isDragging = false;
    const endTime = new Date().getTime() - this._startTime;
    const slide = this._startX - event.pageX;
    const slideSpeed = Math.abs(slide) / endTime;

    //滑动距离阈值，滑动到一半以上必定翻页
    const slideThreshold = this._slideWidth / 2;
    //滑动速度阈值，滑动速度大于这个值，必定翻页
    const speedThreshold = 0.275;

    //如果滑动距离大于阈值，或速度大于阈值翻页
    if (Math.abs(slide) > slideThreshold || slideSpeed > speedThreshold) {
      slide > 0 ? this._currentIndex++ : this._currentIndex--;
    }

    this._slideTo(this._currentIndex);
  }
}
