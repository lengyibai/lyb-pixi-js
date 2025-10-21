import {
  Container,
  Sprite,
  Texture,
  type FederatedPointerEvent,
} from "pixi.js";
import { gsap } from "gsap";
import { libPixiEvent } from "../../Utils/LibPixiEvent";
import { LibPixiContainer } from "../Base/LibPixiContainer";
import { LibPixiRectangle } from "../Base/LibPixiRectangle";

export interface LibPixiScrollContainerXParams {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 滚动内容 */
  scrollContent: Container;
  /** 背景色，用于定位 */
  bgColor?: string;
  /** 自定义遮罩贴图 */
  maskTexture?: Texture;
  /** 遮罩X坐标 */
  maskX?: number;
  /** 遮罩Y坐标 */
  maskY?: number;
}

/** @description 支持鼠标滚轮滚动、鼠标拖动、手指滑动，支持惯性滚动及回弹 */
export class LibPixiScrollContainerX extends LibPixiContainer {
  /** 舞台 */
  static stage: Container;
  /** 开始位置 */
  private _startX = 0;
  /** 惯性速度 */
  private _velocity = 0;
  /** 上一次滚动时间 */
  private _startTime = 0;
  /** 开始位置 */
  private _startPosition = 0;
  /** 滚动速度 */
  private _scrollSpeed = 200;
  /** 是否处于拖动状态 */
  private _isDragging = false;

  /** 左边距 */
  private _leftMargin = 0;
  /** 右边距元素 */
  private _rightMarginBox!: Sprite;

  /** 滚动容器 */
  public _scrollContent: Container;
  /** 遮罩 */
  private _maskGraphics: Container;
  /** 滚动的内容 */
  private _content: Container;

  constructor(params: LibPixiScrollContainerXParams) {
    const {
      width,
      height,
      scrollContent,
      bgColor,
      maskTexture,
      maskX = 0,
      maskY = 0,
    } = params;
    super(width, height, bgColor);

    this._scrollContent = scrollContent;

    // 创建内容容器
    this._content = new Container();
    this.addChild(this._content);
    this._content.addChild(this._scrollContent);

    //自定义遮罩
    if (maskTexture) {
      this._maskGraphics = new Sprite(maskTexture);
      this.addChild(this._maskGraphics);
      this._maskGraphics.width = width;
      this._maskGraphics.height = height;
      this._maskGraphics.position.set(maskX, maskY);
      this.mask = this._maskGraphics;
    } else {
      this._maskGraphics = new LibPixiRectangle(width, height, "#000");
      this.addChild(this._maskGraphics);
      this.mask = this._maskGraphics;
    }

    // 添加事件监听
    libPixiEvent(this, "pointerdown", (event) => {
      this._onDragStart(event);
    });
    libPixiEvent(LibPixiScrollContainerX.stage, "pointermove", (event) => {
      this._onDragMove(event);
    });
    libPixiEvent(this, "pointerup", () => {
      this._onDragEnd();
    });
    libPixiEvent(this, "wheel", (event) => {
      this._onWheelScroll(event as unknown as WheelEvent);
    });
    libPixiEvent(this, "pointerupoutside", () => {
      this._onDragEnd();
    });
  }

  /** @description 添加边距 */
  addMargin(leftMargin: number, rightMargin = leftMargin) {
    this._leftMargin = leftMargin;
    if (leftMargin) {
      const leftMarginBox = new Sprite();
      this._content.addChild(leftMarginBox);
      leftMarginBox.width = leftMargin;
      this._scrollContent.x += leftMargin;
    }

    if (rightMargin) {
      this._rightMarginBox = new Sprite();
      this._content.addChild(this._rightMarginBox);
      this._rightMarginBox.height = rightMargin;
      this._rightMarginBox.x = leftMargin + this._scrollContent.width;
    }
  }

  /** @description 设置滚动容器可视区宽高
   * @param width 宽度
   * @param height 高度
   */
  setDimensions(width: number, height: number) {
    this._maskGraphics.width = width;
    this._maskGraphics.height = height;
    this.setSize(width, height);
    this._updateRightMargin();
  }

  /** @description 返回顶部 */
  scrollToTop() {
    gsap.killTweensOf(this._content);
    this._content.x = 0;
  }

  /** @description 往滚动内容添加元素 */
  addContent(container: Container) {
    this._scrollContent.addChild(container);
  }

  /** @description 更新右边距坐标 */
  private _updateRightMargin() {
    this._rightMarginBox.x = this._leftMargin + this._scrollContent.width;
  }

  /** @description 按下 */
  private _onDragStart(event: FederatedPointerEvent) {
    if (this._content.width <= this._maskGraphics.width) return;

    const { x } = event.getLocalPosition(this);
    this._startX = x - this._content.x;
    this._isDragging = true;
    this._velocity = 0;
    this._startTime = Date.now();
    this._startPosition = this._content.x;
    gsap.killTweensOf(this._content);
  }

  /** @description 拖动 */
  private _onDragMove(event: FederatedPointerEvent) {
    if (this._isDragging) {
      const { x } = event.getLocalPosition(this);
      const newPosition = x - this._startX;
      this._content.x = newPosition;
    }
  }

  /** @description 拖动结束 */
  private _onDragEnd() {
    this._isDragging = false;
    const currentTime = Date.now();
    const deltaTime = currentTime - this._startTime; // 计算停留时间

    if (deltaTime < 250) {
      // 如果停留时间在阈值内，计算惯性速度
      this._velocity = (this._content.x - this._startPosition) / deltaTime;
      this._applyInertia();
    } else {
      // 停留时间超出阈值，取消惯性
      this._velocity = 0;
    }

    this._limitScrollRange();
  }

  /** @description 滚轮滚动 */
  private _onWheelScroll(event: WheelEvent) {
    // 如果内容高度小于遮罩高度，则不滚动
    if (this._content.width <= this._maskGraphics.width) return;

    let x = this._content.x - event.deltaY * (this._scrollSpeed / 100);

    if (x > 0) {
      x = 0;
    } else if (Math.abs(x) >= this._content.width - this._maskGraphics.width) {
      x = -(this._content.width - this._maskGraphics.width);
    }

    gsap.to(this._content, {
      duration: 0.25,
      ease: "power1.out",
      x,
    });
  }

  /** @description 惯性动画 */
  private _applyInertia() {
    gsap.to(this._content, {
      x: this._content.x + this._velocity * 250,
      duration: 0.5,
      ease: "power1.out",
      onUpdate: this._limitScrollRange.bind(this),
    });
  }

  /** @description 限制滚动范围 */
  private _limitScrollRange() {
    //如果内容顶部离开了滚动容器顶部，则归位
    if (this._content.x > 0) {
      //回弹
      gsap.to(this._content, {
        duration: 0.2,
        ease: "power1.out",
        x: 0,
      });
    }
    // 如果滚动距离大于内容高度减去遮罩高度
    else if (
      Math.abs(this._content.x) >=
      this._content.width - this._maskGraphics.width
    ) {
      // 如果内容高度大于遮罩高度，则滚动到底部
      if (this._content.width > this._maskGraphics.width) {
        //回弹
        const x = -(this._content.width - this._maskGraphics.width);
        gsap.to(this._content, {
          duration: 0.2,
          ease: "power1.out",
          x,
        });
      }
    }
  }
}
