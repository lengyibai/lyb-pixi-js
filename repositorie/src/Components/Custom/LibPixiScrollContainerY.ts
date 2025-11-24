import { Container, FederatedPointerEvent, Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";
import { libPixiEvent } from "../../Utils/LibPixiEvent";
import { LibPixiContainer } from "../Base/LibPixiContainer";
import { LibPixiRectangle } from "../Base/LibPixiRectangle";

export interface LibPixiScrollContainerYParams {
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
  /** 是否需要滚动条 */
  scrollbar?: boolean;
  /** 滚动靠右坐标 */
  scrollbarRgiht?: number;
  /** 滚动条宽度 */
  scrollbarWidth?: number;
  /** 滚动条颜色 */
  scrollbarColor?: string;

  /** 滚动触发 */
  onScroll?: (y: number) => void;
}

/** @description 支持鼠标滚轮滚动、鼠标拖动、手指滑动，支持惯性滚动及回弹 */
export class LibPixiScrollContainerY extends LibPixiContainer {
  /** 舞台 */
  static stage: Container;

  /** 开始位置 */
  private _startY = 0;
  /** 惯性速度 */
  private _velocity = 0;
  /** 上一次滚动时间 */
  private _startTime = 0;
  /** 开始位置 */
  private _startContentY = 0;
  /** 滚动速度 */
  private _scrollSpeed = 200;
  /** 是否处于拖动状态 */
  private _isDragging = false;
  /** 是否处于滚动状态 */
  private _scrollbarDragging = false;
  /** 滚动条拖动偏移量 */
  private _scrollbarDragOffset = 0;

  /** 滚动条右边距 */
  private _scrollbarRgiht: number;
  /** 滚动条宽度 */
  private _scrollbarWidth: number;

  /** 上边距 */
  private _topMargin = 0;
  /** 右边距元素 */
  private _bottomMarginBox?: Sprite;

  /** 滚动容器 */
  public _scrollContent: Container;
  /** 遮罩 */
  private _maskGraphics: Container;
  /** 滚动的内容 */
  private _content: Container;
  /** 滚动条 */
  private _scrollbar: LibPixiRectangle;
  /** 滚动条颜色 */
  private _scrollbarColor: string;

  /** 是否显示滚动条 */
  private _showScrollbar: boolean;
  /** 滚动触发 */
  private _onScroll?: (y: number) => void;

  constructor(params: LibPixiScrollContainerYParams) {
    const {
      width,
      height,
      scrollbar = false,
      scrollContent,
      scrollbarRgiht = 0,
      scrollbarWidth = 10,
      scrollbarColor = "#ffffff",
      onScroll,
      bgColor,
      maskTexture,
      maskX = 0,
      maskY = 0,
    } = params;
    super(width, height, bgColor);

    this._scrollbarRgiht = scrollbarRgiht;
    this._scrollbarWidth = scrollbarWidth;
    this._scrollContent = scrollContent;
    this._scrollbarColor = scrollbarColor;
    this._onScroll = onScroll;
    this._showScrollbar = scrollbar;

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

    // 创建滚动条
    this._scrollbar = new LibPixiRectangle(
      scrollbarWidth,
      height,
      this._scrollbarColor
    );
    this._scrollbar.x = width - (scrollbarRgiht || scrollbarWidth);
    this.addChild(this._scrollbar);
    this._scrollbar.visible = this._showScrollbar;
    this._scrollbar.alpha = 0;
    this._updateScrollbarSize();

    //是否已经离开滚动条
    libPixiEvent(
      this._scrollbar,
      "pointerdown",
      this._onScrollbarDragStart.bind(this)
    );
    libPixiEvent(this._scrollbar, "pointerenter", () => {
      gsap.killTweensOf(this._scrollbar);
      this._scrollbar.alpha = 1;
      this._updateScrollbarSize();
    });
    libPixiEvent(this._scrollbar, "pointerleave", () => {
      gsap.to(this._scrollbar, {
        duration: 0.5,
        alpha: 0,
        delay: 1,
      });
    });

    // 添加事件监听
    libPixiEvent(this, "pointerdown", (event) => {
      this._onDragStart(event);
      this._updateScrollbarSize();
    });
    libPixiEvent(LibPixiScrollContainerY.stage, "pointermove", (event) => {
      this._onScrollbarDragMove(event);
      this._onDragMove(event);
    });
    LibPixiScrollContainerY.stage.cursor = "default";
    libPixiEvent(this, "pointerup", (event) => {
      this._onScrollbarDragEnd(event);
      this._onDragEnd();
    });
    libPixiEvent(this, "wheel", (event) => {
      this._onWheelScroll(event as unknown as WheelEvent);
      this._updateScrollbarSize();
    });
    libPixiEvent(this, "pointerupoutside", () => {
      this._onDragEnd();
    });
    this.cursor = "default";
  }

  /** @description 添加边距 */
  addMargin(topMargin: number, bottomMargin = topMargin) {
    this._topMargin = topMargin;
    if (topMargin) {
      const topMarginBox = new Sprite();
      this._content.addChild(topMarginBox);
      topMarginBox.height = topMargin;
      this._scrollContent.y += topMargin;
    }

    if (bottomMargin) {
      this._bottomMarginBox = new Sprite();
      this._content.addChild(this._bottomMarginBox);
      this._bottomMarginBox.height = bottomMargin;
      this._bottomMarginBox.y = topMargin + this._scrollContent.height;
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
    this._scrollbar.x = width - (this._scrollbarRgiht || this._scrollbarWidth);
    this._updateBottomMargin();
  }

  /** @description 返回顶部 */
  scrollToTop(animate = false) {
    gsap.killTweensOf(this._content);
    if (animate) {
      gsap.to(this._content, { y: 0, duration: 0.25 });
    } else {
      this._content.y = 0;
    }
  }

  /** @description 往滚动内容添加元素 */
  addContent(container: Container) {
    this._scrollContent.addChild(container);
  }

  /** @description 更新右边距坐标 */
  private _updateBottomMargin() {
    if (!this._bottomMarginBox) return;
    this._bottomMarginBox.x = this._topMargin + this._scrollContent.width;
  }

  /** @description 按下 */
  private _onDragStart(event: FederatedPointerEvent) {
    if (this._content.height <= this._maskGraphics.height) return;

    const { y } = event.getLocalPosition(this);
    this._startY = y - this._content.y;
    this._isDragging = true;
    this._velocity = 0;
    this._startTime = Date.now();
    this._startContentY = this._content.y;
    gsap.killTweensOf(this._content);
  }

  /** @description 拖动 */
  private _onDragMove(event: FederatedPointerEvent) {
    if (this._isDragging) {
      const { y } = event.getLocalPosition(this);
      const newPosition = y - this._startY;
      this._content.y = newPosition;
      this._updateScrollbar();
    }
  }

  /** @description 拖动结束 */
  private _onDragEnd() {
    this._isDragging = false;
    this._scrollbarDragging = false;
    const currentTime = Date.now();
    const deltaTime = currentTime - this._startTime; // 计算停留时间

    if (deltaTime < 250) {
      // 如果停留时间在阈值内，计算惯性速度
      this._velocity = (this._content.y - this._startContentY) / deltaTime;
      this._applyInertia();
    } else {
      // 停留时间超出阈值，取消惯性
      this._velocity = 0;
    }

    this._limitScrollRange();

    gsap.to(this._scrollbar, {
      duration: 0.5,
      alpha: 0,
      delay: 0.25,
    });
  }

  /** @description 滚轮滚动 */
  private _onWheelScroll(event: WheelEvent) {
    // 如果内容高度小于遮罩高度，则不滚动
    if (this._content.height <= this._maskGraphics.height) return;

    let y = this._content.y - event.deltaY * (this._scrollSpeed / 100);

    //如果到达顶部，则不滚动
    if (y > 0) {
      y = 0;
    }
    //如果到达底部，则不滚动
    else if (Math.abs(y) >= this._content.height - this._maskGraphics.height) {
      y = -(this._content.height - this._maskGraphics.height);
    }

    gsap.to(this._content, {
      duration: 0.25,
      ease: "power1.out",
      y,
      onUpdate: () => {
        this._updateScrollbar();
      },
      onComplete: () => {
        this._hideScrollbar();
      },
    });
  }

  /** @description 惯性动画 */
  private _applyInertia() {
    gsap.to(this._content, {
      y: this._content.y + this._velocity * 250,
      duration: 0.5,
      ease: "power1.out",
      onUpdate: () => {
        this._limitScrollRange();
        this._updateScrollbar();
      },
      onComplete: () => {
        this._hideScrollbar();
      },
    });
  }

  /** @description 限制滚动范围 */
  private _limitScrollRange() {
    //如果内容顶部离开了滚动容器顶部，则归位
    if (this._content.y > 0) {
      gsap.to(this._content, {
        duration: 0.2,
        y: 0,
        ease: "power1.out",
        onUpdate: () => {
          this._updateScrollbar();
        },
        onComplete: () => {
          this._hideScrollbar();
        },
      });
    }
    // 如果滚动距离大于内容高度减去遮罩高度
    else if (
      Math.abs(this._content.y) >=
      this._content.height - this._maskGraphics.height
    ) {
      // 如果内容高度大于遮罩高度，则滚动到底部
      if (this._content.height > this._maskGraphics.height) {
        const y = -(this._content.height - this._maskGraphics.height);
        gsap.to(this._content, {
          duration: 0.2,
          y,
          ease: "power1.out",
          onUpdate: () => {
            this._updateScrollbar();
          },
          onComplete: () => {
            this._hideScrollbar();
          },
        });
      }
      // 否则静止不动
      else {
        gsap.to(this._content, {
          duration: 0.25,
          y: 0,
          onUpdate: () => {
            this._updateScrollbar();
          },
          onComplete: () => {
            this._hideScrollbar();
          },
        });
      }
    }
  }

  /** @description 更新滚动位置 */
  private _updateScrollbar() {
    this._scrollbar.alpha = 1;
    gsap.killTweensOf(this._scrollbar);

    const viewHeight = this._maskGraphics.height;
    const contentHeight = this._content.height;

    const ratio = viewHeight / contentHeight;
    const barHeight = viewHeight * ratio;
    const maxScrollY = contentHeight - viewHeight;
    const scrollY = Math.min(Math.max(-this._content.y, 0), maxScrollY);
    const barY = (scrollY / maxScrollY) * (viewHeight - barHeight);

    this._scrollbar.y = barY;
    this._onScroll?.(this._content.y);
  }

  /** @description 更新滚动条大小 */
  private _updateScrollbarSize() {
    if (!this._showScrollbar) return;

    const viewHeight = this._maskGraphics.height;
    const contentHeight = this._content.height;

    if (contentHeight <= viewHeight) {
      this._scrollbar.visible = false;
    } else {
      this._scrollbar.visible = true;
    }

    const ratio = viewHeight / contentHeight;
    const barHeight = viewHeight * ratio;

    this._scrollbar.clear();
    this._scrollbar.beginFill(this._scrollbarColor);
    this._scrollbar.drawRect(0, 0, 10, barHeight);
    this._scrollbar.endFill();
  }

  /** @description 滚动条按下 */
  private _onScrollbarDragStart(event: FederatedPointerEvent) {
    event.stopPropagation();
    this._scrollbarDragging = true;
    this._scrollbarDragOffset = event.getLocalPosition(this._scrollbar).y;
    gsap.killTweensOf(this._content);
  }

  /** @description 滚动条移动 */
  private _onScrollbarDragMove(event: FederatedPointerEvent) {
    event.stopPropagation();
    if (!this._scrollbarDragging) return;

    const localY = event.getLocalPosition(this).y;
    const viewHeight = this._maskGraphics.height;
    const contentHeight = this._content.height;
    const ratio = viewHeight / contentHeight;
    const barHeight = viewHeight * ratio;
    const maxBarY = viewHeight - barHeight;
    const newBarY = Math.min(
      Math.max(localY - this._scrollbarDragOffset, 0),
      maxBarY
    );
    const scrollY = (newBarY / maxBarY) * (contentHeight - viewHeight);

    this._content.y = -scrollY;
    this._updateScrollbar();
  }

  /** @description 滚动条松开 */
  private _onScrollbarDragEnd(event: FederatedPointerEvent) {
    event.stopPropagation();
    this._scrollbarDragging = false;
  }

  /** @description 滚动结束一秒后隐藏滚动条 */
  private _hideScrollbar() {
    gsap.to(this._scrollbar, {
      duration: 0.5,
      alpha: 0,
      delay: 0.25,
    });
  }
}
