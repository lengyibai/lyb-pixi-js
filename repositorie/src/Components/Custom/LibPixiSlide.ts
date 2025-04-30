import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import gsap from "gsap";
import { LibPixiContainer } from "../Base/LibPixiContainer";
import { libPixiEvent } from "../../Utils/LibPixiEvent";

export interface LibPixiSlideParams {
  /** 舞台 */
  stage: Container;
  /** 当前方向 */
  direction: "x" | "y";
  /** 滚动区域宽度 */
  width: number;
  /** 滚动区域高度 */
  height: number;
  /** 一页宽度 */
  pageWidth?: number;
  /** 一页高度 */
  pageHeight?: number;
  /** 滚动的容器 */
  content: Container;
  /** 元素列表 */
  itemList: Container[];

  /** 是否启用循环 */
  loop?: boolean;

  /** 景深定制回调，第二参数函数参数景深衰减值，可视区三个元素时，建议0.5，五个元素时，建议0.2 */
  depthCallback?: (
    container: Container,
    getValue: (depthAtten: number) => number
  ) => void;
  /** 松手回调 */
  slideCallback?: (index: number) => void;
  /** 滚动回调 */
  scrollCallback?: (x: number, index: number) => void;
}

/** @description 滑动页
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSlide-滑动页
 */
export class LibPixiSlide extends LibPixiContainer {
  /** 滑动加速度触发翻页 */
  private _SPEED_THRESHOLD = 0.35;
  /** 滑动比例翻页 */
  private _SCROLL_THRESHOLD = 0.5;

  /** 当前方向 */
  private _direction: "x" | "y";
  /** 元素列表 */
  private _itemList: Container[];
  /** 一页宽度 */
  private _pageWidth = 0;
  /** 一页高度 */
  private _pageHeight = 0;
  /** 是否循环 */
  private _loop = false;

  /** 两侧预留格数，如可视区有三个，则两侧预留为1 */
  private _freeGridNum = 0;
  /** 当前幻灯片索引 */
  private _currentIndex = 0;
  /** 记录拖动开始时的X坐标 */
  private _startX = 0;
  /** 记录拖动开始时的Y坐标 */
  private _startY = 0;
  /** 偏移量 */
  private _offsetX = 0;
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
  /** 景深定制回调 */
  private _depthCallback?: (
    container: Container,
    getValue: (depthAtten: number) => number
  ) => void;
  /** 滑动回调 */
  private _slideCallback?: (index: number) => void;
  /** 滚动回调 */
  private _scrollCallback?: (v: number, index: number) => void;

  constructor(params: LibPixiSlideParams) {
    const {
      stage,
      width,
      height,
      content,
      depthCallback,
      slideCallback,
      scrollCallback,
      pageWidth = 0,
      pageHeight = 0,
      itemList,
      loop = false,
      direction,
    } = params;
    super(width, height);

    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, this.width, this.height);
    mask.endFill();
    this.addChild(mask);
    this.mask = mask;

    this._direction = direction;
    this._pageWidth = pageWidth;
    this._pageHeight = pageHeight;
    this._slideArea = content;
    this._itemList = itemList;
    this._loop = loop;
    this._depthCallback = depthCallback;
    this._slideCallback = slideCallback;
    this._scrollCallback = scrollCallback;
    this._pageNum = itemList.length;

    this.addChild(this._slideArea);

    if (this._direction === "x") {
      this._freeGridNum = Math.floor(width / this._pageWidth / 2);
      this._slideArea.x = this._pageWidth * this._freeGridNum;
    } else {
      this._freeGridNum = Math.floor(height / pageHeight / 2);
      this._slideArea.y = this._pageHeight * this._freeGridNum;
    }

    this.eventMode = "static";
    this.cursor = "pointer";

    this._setDepth();
    libPixiEvent(this, "pointerdown", this._onDragStart.bind(this));
    libPixiEvent(stage, "pointermove", this._onDragMove.bind(this));
    window.addEventListener("pointerup", this._onDragEnd.bind(this));
  }

  /** @description 更新坐标 */
  updatePosition(v: number, index: number) {
    this._currentIndex = index;
    this._setDepth();

    if (this._direction === "x") {
      this._slideArea.x = v;
    } else {
      this._slideArea.y = v;
    }
  }

  /** @description 上一页 */
  prev() {
    this.slideTo(this._currentIndex - 1);
  }

  /** @description 下一页 */
  next() {
    this.slideTo(this._currentIndex + 1);
  }

  /** @description 滑动到指定索引 */
  slideTo(index: number) {
    this._currentIndex = index;

    //首尾限制
    if (this._currentIndex < 0) {
      if (this._loop) {
        this._currentIndex = this._pageNum - 1;
      } else {
        this._currentIndex = 0;
      }
    } else if (this._currentIndex >= this._pageNum) {
      this._currentIndex = this._pageNum;
      if (this._loop) {
        this._currentIndex = 0;
      } else {
        this._currentIndex--;
      }
    }

    if (this._direction === "x") {
      gsap.to(this._slideArea, {
        x:
          -this._currentIndex * this._pageWidth +
          this._pageWidth * this._freeGridNum,
        duration: 0.25,
        onUpdate: () => {
          this._onScroll();
        },
      });
    } else {
      gsap.to(this._slideArea, {
        y:
          -this._currentIndex * this._pageHeight +
          this._pageHeight * this._freeGridNum,
        duration: 0.25,
        onUpdate: () => {
          this._onScroll();
        },
      });
    }

    // 触发滑动结束回调
    this._slideCallback?.(this._currentIndex);
  }

  /** @description 设置滚动景深 */
  private _setDepth() {
    if (!this._depthCallback) return;

    let t = 0;
    let currentIndex = 0;

    if (this._direction === "x") {
      const x = this._slideArea.x;
      const startX = this._freeGridNum * this._pageWidth;

      //设置起始位置，获取当前绝对坐标
      const absX = Math.abs(x - startX);
      // 根据滑动宽度计算出当前位置对应的索引
      currentIndex = Math.floor(absX / this._pageWidth);
      // 计算当前索引在一页中的比例，越靠近当前索引的x坐标，值越小，范围0-1
      t = (absX % this._pageWidth) / this._pageWidth;

      //如果在起点的时候还在向左滑，则取反,避免distance显示效果计算错误
      if (x - startX > 0) {
        t = -t;
        currentIndex = -currentIndex;
      }
    } else {
      const y = this._slideArea.y;
      const startY = this._freeGridNum * this._pageHeight;

      //设置起始位置，获取当前绝对坐标
      const absY = Math.abs(y - startY);
      // 根据滑动宽度计算出当前位置对应的索引
      currentIndex = Math.floor(absY / this._pageHeight);
      // 计算当前索引在一页中的比例，越靠近当前索引的x坐标，值越小，范围0-1
      t = (absY % this._pageHeight) / this._pageHeight;

      //如果在起点的时候还在向左滑，则取反,避免distance显示效果计算错误
      if (y - startY > 0) {
        t = -t;
        currentIndex = -currentIndex;
      }
    }

    this._itemList.forEach((item, i) => {
      // 计算当前项与目标索引之间的索引距离
      const distance = Math.abs(i - currentIndex - t);
      this._depthCallback?.(item, (depthAtten: number) => {
        return Math.max(0, 1 - distance * depthAtten);
      });
    });
  }

  /** @description 开始拖动 */
  private _onDragStart(event: FederatedPointerEvent) {
    this._isDragging = true;
    gsap.killTweensOf(this._slideArea);
    this._startTime = new Date().getTime();

    if (this._direction === "x") {
      this._startX = event.global.x;
      this._offsetX = this._slideArea.x;
    } else {
      this._startY = event.global.y;
      this._offsetY = this._slideArea.y;
    }
  }

  /** @description 拖动中 */
  private _onDragMove(event: FederatedPointerEvent) {
    if (!this._isDragging) return;

    if (this._direction === "x") {
      const moveX = event.pageX - this._startX;
      this._slideArea.x = this._offsetX + moveX;
    } else {
      const moveY = event.pageY - this._startY;
      this._slideArea.y = this._offsetY + moveY;
    }

    this._onScroll();
  }

  /** @description 滚动触发 */
  private _onScroll() {
    this._setDepth();

    if (this._direction === "x") {
      this._scrollCallback?.(this._slideArea.x, this._currentIndex);
    } else {
      this._scrollCallback?.(this._slideArea.y, this._currentIndex);
    }
  }

  /** @description 结束拖动 */
  private _onDragEnd(event: PointerEvent) {
    if (this._direction === "x") {
      if (!this._isDragging) return;
      this._isDragging = false;

      //滑动耗时
      const slideTime = new Date().getTime() - this._startTime;
      //滑动距离
      const slide = this._startX - event.pageX;
      //滑动速度
      const slideSpeed = Math.abs(slide) / slideTime;
      //要滑动的页数
      const pageChange = Math.round(slide / this._pageWidth);

      //如果滑动超过阈值，则翻页
      if (Math.abs(slide) > this._pageWidth * this._SCROLL_THRESHOLD) {
        this._currentIndex += pageChange;
      }
      //如果滑动速度大于阈值，则翻页
      else if (slideSpeed > this._SPEED_THRESHOLD) {
        let addIndex = slide / this._pageWidth;
        if (addIndex > 0) {
          addIndex = Math.ceil(addIndex);
        } else {
          addIndex = Math.floor(addIndex);
        }
        this._currentIndex += addIndex;
      }

      this.slideTo(this._currentIndex);
    } else {
      if (!this._isDragging) return;
      this._isDragging = false;

      //滑动耗时
      const slideTime = new Date().getTime() - this._startTime;
      //滑动距离
      const slide = this._startY - event.pageY;
      //滑动速度
      const slideSpeed = Math.abs(slide) / slideTime;
      //要滑动的页数
      const pageChange = Math.round(slide / this._pageHeight);

      //如果滑动超过阈值，则翻页
      if (Math.abs(slide) > this._pageHeight * this._SCROLL_THRESHOLD) {
        this._currentIndex += pageChange;
      }
      //如果滑动速度大于阈值，则翻页
      else if (slideSpeed > this._SPEED_THRESHOLD) {
        let addIndex = slide / this._pageHeight;
        if (addIndex > 0) {
          addIndex = Math.ceil(addIndex);
        } else {
          addIndex = Math.floor(addIndex);
        }
        this._currentIndex += addIndex;
      }

      this.slideTo(this._currentIndex);
    }
  }
}
