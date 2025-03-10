import { Container, type FederatedPointerEvent } from "pixi.js";
import gsap from "gsap";
import { libPixiOverflowHidden } from "../../Utils/LibPixiOverflowHidden";
import { LibPixiContainer } from "../Base/LibPixiContainer";

interface LibPixiSliderParams {
  /** 滑动区域宽度 */
  width: number;
  /** 滑动区域高度 */
  height: number;
  /** 滑动页列表 */
  slideList: Container[];
  /** 是否启用景深 */
  enableDepth?: boolean;
  /** 景深透明度 */
  depthAlpha?: number;
  /** 景深缩放 */
  depthScale?: number;
  /** 滑动回调 */
  slideCallback: (pageIndex: number, _pageNum: number) => void;
}

/** @description 类似轮播图，但是不会自动轮播
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSlider-横向滑动图
 */
export class LibPixiSlider extends LibPixiContainer {
  /** 当前幻灯片索引 */
  private _currentIndex = 0;
  /** 滑动区域宽度 */
  private _slideWidth = 0;
  /** 滑动区域高度 */
  private _slideHeight = 0;
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

  /** 是否启用景深 */
  private _enableDepth: boolean;
  /** 景深透明度 */
  private _depthAlpha: number;
  /** 景深缩放 */
  private _depthScale: number;
  /** 滑动容器列表 */
  private _slideList: Container[];

  /** @description 滑动回调 */
  private slideCallback: (pageIndex: number, _pageNum: number) => void;

  /**
   * @param width 宽度
   * @param height 高度
   * @param content 内容
   * @param slideCallback 滑动结束回调
   */
  constructor(params: LibPixiSliderParams) {
    const {
      width,
      height,
      slideList,
      slideCallback,
      enableDepth = false,
      depthAlpha = 0.5,
      depthScale = 0.5,
    } = params;

    super(width, height);
    libPixiOverflowHidden(this);

    this._slideArea = new Container();
    this._slideWidth = width;
    this._slideHeight = height;
    this._slideList = slideList;
    this._enableDepth = enableDepth;
    this._depthAlpha = depthAlpha;
    this._depthScale = depthScale;
    this.slideCallback = slideCallback;
    this._pageNum = slideList.length - 1;

    this._slideList.forEach((item, index) => {
      this._slideArea.addChild(item);
      item.x = index * width + this._slideWidth / 2;
      item.y = this._slideHeight / 2;
      item.pivot.set(this._slideWidth / 2, this._slideHeight / 2);
    });
    this.addChild(this._slideArea);

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
      gsap.to(this._slideArea, {
        x: 0,
        duration: 0.25,
        onUpdate: () => {
          this._setDepth();
        },
      });
      this._currentIndex = 0;
    } else if (index > this._pageNum) {
      // 回弹到最后一张
      gsap.to(this._slideArea, {
        x: -this._pageNum * this._slideWidth,
        duration: 0.5,
        onUpdate: () => {
          this._setDepth();
        },
      });
      this._currentIndex = this._pageNum;
    } else {
      // 正常滑动
      this._currentIndex = index;
      gsap.to(this._slideArea, {
        x: -this._currentIndex * this._slideWidth,
        duration: 0.25,
        onUpdate: () => {
          this._setDepth();
        },
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
    this._setDepth();
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

  /** @description 设置滚动景深
   * @param containerList 元素列表
   * @param y 拖动Y坐标
   * @param startY 内部将y - startY进行计算
   */
  private _setDepth() {
    if (!this._enableDepth) return;

    const Y = this._slideArea.x;
    const idx = Math.floor(Math.abs(Y) / this._slideWidth);
    const t = (Math.abs(Y) % this._slideWidth) / this._slideWidth;
    const prevIdx = idx - 1;
    const nextIdx = idx + 1;
    const curItem = this._slideList[idx];

    curItem.alpha = this.lerp(this._depthAlpha, 1, 1 - t);
    curItem.scale.set(this.lerp(this._depthScale, 1, 1 - t));

    if (nextIdx < this._slideList.length) {
      const nextItem = this._slideList[nextIdx];
      nextItem.alpha = this.lerp(this._depthAlpha, 1, t);
      nextItem.scale.set(this.lerp(this._depthScale, 1, t));
    }
    if (prevIdx >= 0) {
      const prevItem = this._slideList[prevIdx];
      prevItem.alpha = this.lerp(this._depthAlpha, 1, 1 - t);
      prevItem.scale.set(this.lerp(this._depthScale, 1, 1 - t));
    }
  }

  lerp(a1: number, a2: number, t: number) {
    return a1 * (1 - t) + a2 * t;
  }
}
