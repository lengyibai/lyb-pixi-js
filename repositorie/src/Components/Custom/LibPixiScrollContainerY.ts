import { Container, Sprite, Texture, type FederatedPointerEvent, type IDestroyOptions } from "pixi.js";
import { gsap } from "gsap";

import { libPixiEvent } from "../../Utils/LibPixiEvent.js";
import { LibPixiContainer } from "../Base/LibPixiContainer.js";
import { LibPixiRectangle } from "../Base/LibPixiRectangle.js";

/** @description Y轴滚动容器参数 */
export interface LibPixiScrollContainerYParams {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 滚动内容 */
  scrollContent: Container;
  /** 背景颜色，用于定位 */
  bgColor?: string;
  /** 自定义遮罩贴图 */
  maskTexture?: Texture;
  /** 遮罩X坐标 */
  maskX?: number;
  /** 遮罩Y坐标 */
  maskY?: number;
  /** 是否显示滚动条 */
  scrollbar?: boolean;
  /** 滚动条右侧坐标 */
  scrollbarRgiht?: number;
  /** 滚动条宽度 */
  scrollbarWidth?: number;
  /** 滚动条颜色 */
  scrollbarColor?: string;
  /** 滚动触发 */
  onScroll?: (y: number) => void;
  /** 触底加载回调 */
  onLoad?: (pageIndex: number) => Promise<void>;
}

/** @description 滚动条样式配置 */
export interface LibPixiScrollContainerYScrollbarStyle {
  /** 是否显示滚动条 */
  scrollbar: boolean;
  /** 滚动条右侧距离 */
  scrollbarRgiht: number;
  /** 滚动条宽度 */
  scrollbarWidth: number;
  /** 滚动条颜色 */
  scrollbarColor: string;
}

/** @description 支持鼠标滚轮、鼠标拖动、手指滑动的Y轴滚动容器 */
export class LibPixiScrollContainerY extends LibPixiContainer {
  /** 全局滚动条样式 */
  static scrollbarStyle: LibPixiScrollContainerYScrollbarStyle = {
    scrollbar: false,
    scrollbarRgiht: 0,
    scrollbarWidth: 10,
    scrollbarColor: "#ffffff",
  };

  /** @description 设置全局滚动条样式 */
  static setScrollbarStyle(style: Partial<LibPixiScrollContainerYScrollbarStyle>) {
    this.scrollbarStyle = {
      ...this.scrollbarStyle,
      ...style,
    };
  }

  /** 舞台 */
  static stage: Container;

  /** 拖动起始纵坐标 */
  private _startY = 0;
  /** 惯性速度 */
  private _velocity = 0;
  /** 上次拖动开始时间 */
  private _startTime = 0;
  /** 拖动开始时内容位置 */
  private _startContentY = 0;
  /** 滚轮速度倍率 */
  private _scrollSpeed = 200;
  /** 是否正在拖动内容 */
  private _isDragging = false;
  /** 是否正在拖动滚动条 */
  private _scrollbarDragging = false;
  /** 滚动条拖动偏移量 */
  private _scrollbarDragOffset = 0;
  /** 分页索引 */
  private _pageIndex = 0;
  /** 触底加载锁 */
  private _scrollLock = false;
  /** 滚动条样式覆盖项 */
  private _scrollbarStyle: Partial<LibPixiScrollContainerYScrollbarStyle> = {};
  /** 上边距 */
  private _topMargin = 0;
  /** 下边距占位元素 */
  private _bottomMarginBox?: Sprite;
  /** 外部传入的滚动内容 */
  public _scrollContent: Container;
  /** 遮罩对象 */
  private _maskGraphics: Container;
  /** 实际移动的内容容器 */
  private _content: Container;
  /** 滚动条 */
  private _scrollbar: LibPixiRectangle;
  /** 滚动回调 */
  private _onScroll?: (y: number) => void;
  /** 触底加载回调 */
  private _onLoad?: (pageIndex: number) => Promise<void>;
  /** 销毁滚动条按下监听 */
  private _offScrollbarPointerDown?: () => void;
  /** 销毁滚动条移入监听 */
  private _offScrollbarPointerEnter?: () => void;
  /** 销毁滚动条移出监听 */
  private _offScrollbarPointerLeave?: () => void;
  /** 销毁容器按下监听 */
  private _offPointerDown?: () => void;
  /** 销毁舞台移动监听 */
  private _offStagePointerMove?: () => void;
  /** 销毁容器抬起监听 */
  private _offPointerUp?: () => void;
  /** 销毁容器滚轮监听 */
  private _offWheel?: () => void;
  /** 销毁容器外抬起监听 */
  private _offPointerUpOutside?: () => void;

  /** @description 创建Y轴滚动容器 */
  constructor(params: LibPixiScrollContainerYParams) {
    const {
      width,
      height,
      scrollContent,
      onScroll,
      bgColor,
      maskTexture,
      maskX = 0,
      maskY = 0,
      onLoad,
      scrollbar,
      scrollbarRgiht,
      scrollbarWidth,
      scrollbarColor,
    } = params;
    super(width, height, bgColor);

    this._scrollContent = scrollContent;
    this._onScroll = onScroll;
    this._onLoad = onLoad;

    if (scrollbar !== undefined) {
      this._scrollbarStyle.scrollbar = scrollbar;
    }
    if (scrollbarRgiht !== undefined) {
      this._scrollbarStyle.scrollbarRgiht = scrollbarRgiht;
    }
    if (scrollbarWidth !== undefined) {
      this._scrollbarStyle.scrollbarWidth = scrollbarWidth;
    }
    if (scrollbarColor !== undefined) {
      this._scrollbarStyle.scrollbarColor = scrollbarColor;
    }

    this._content = new Container();
    this.addChild(this._content);
    this._content.addChild(this._scrollContent);

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

    this._scrollbar = new LibPixiRectangle(this._scrollbarWidth, height, this._scrollbarColor);
    this._scrollbar.x = width - (this._scrollbarRgiht || this._scrollbarWidth);
    this.addChild(this._scrollbar);
    this._scrollbar.visible = this._showScrollbar;
    this._scrollbar.alpha = 0;
    this._updateScrollbarSize();

    this._offScrollbarPointerDown = libPixiEvent(this._scrollbar, "pointerdown", this._onScrollbarDragStart.bind(this));
    this._offScrollbarPointerEnter = libPixiEvent(this._scrollbar, "pointerenter", () => {
      gsap.killTweensOf(this._scrollbar);
      this._scrollbar.alpha = 1;
      this._updateScrollbarSize();
    });
    this._offScrollbarPointerLeave = libPixiEvent(this._scrollbar, "pointerleave", () => {
      gsap.to(this._scrollbar, {
        duration: 0.5,
        alpha: 0,
        delay: 1,
      });
    });

    this._offPointerDown = libPixiEvent(this, "pointerdown", (event) => {
      this._onDragStart(event);
      this._updateScrollbarSize();
    });
    this._offStagePointerMove = libPixiEvent(LibPixiScrollContainerY.stage, "pointermove", (event) => {
      this._onScrollbarDragMove(event);
      this._onDragMove(event);
    });
    LibPixiScrollContainerY.stage.cursor = "default";
    this._offPointerUp = libPixiEvent(this, "pointerup", (event) => {
      this._onScrollbarDragEnd(event);
      this._onDragEnd();
    });
    this._offWheel = libPixiEvent(this, "wheel", (event) => {
      this._onWheelScroll(event as unknown as WheelEvent);
      this._updateScrollbarSize();
    });
    this._offPointerUpOutside = libPixiEvent(this, "pointerupoutside", () => {
      this._onDragEnd();
    });
    this.cursor = "default";
  }

  /** @description 添加顶部和底部留白 */
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

  /** @description 设置滚动容器可视区域宽高 */
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

  /** @description 为滚动内容追加元素 */
  addContent(container: Container) {
    this._scrollContent.addChild(container);
  }

  /** @description 重置触底加载页码 */
  resetPageIndex() {
    this._pageIndex = 0;
  }

  /** @description 更新底部留白位置 */
  private _updateBottomMargin() {
    if (!this._bottomMarginBox) {
      return;
    }

    this._bottomMarginBox.x = this._topMargin + this._scrollContent.width;
  }

  /** @description 按下开始拖动内容 */
  private _onDragStart(event: FederatedPointerEvent) {
    if (!this.parent || this._content.height <= this._maskGraphics.height) {
      return;
    }

    const { y } = event.getLocalPosition(this);
    this._startY = y - this._content.y;
    this._isDragging = true;
    this._velocity = 0;
    this._startTime = Date.now();
    this._startContentY = this._content.y;
    gsap.killTweensOf(this._content);
  }

  /** @description 拖动内容 */
  private _onDragMove(event: FederatedPointerEvent) {
    if (!this._isDragging || !this.parent) {
      return;
    }

    const { y } = event.getLocalPosition(this);
    const newPosition = y - this._startY;
    this._content.y = newPosition;
    this._updateScrollbar();
  }

  /** @description 结束拖动并尝试应用惯性 */
  private _onDragEnd() {
    this._isDragging = false;
    this._scrollbarDragging = false;
    const currentTime = Date.now();
    const deltaTime = currentTime - this._startTime;

    if (deltaTime < 250) {
      this._velocity = (this._content.y - this._startContentY) / deltaTime;
      this._applyInertia();
    } else {
      this._velocity = 0;
    }

    this._limitScrollRange();

    gsap.to(this._scrollbar, {
      duration: 0.5,
      alpha: 0,
      delay: 0.25,
    });
  }

  /** @description 处理滚轮滚动 */
  private _onWheelScroll(event: WheelEvent) {
    if (this._content.height <= this._maskGraphics.height) {
      return;
    }

    let y = this._content.y - event.deltaY * (this._scrollSpeed / 100);

    if (y > 0) {
      y = 0;
    } else if (Math.abs(y) >= this._content.height - this._maskGraphics.height) {
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

  /** @description 应用惯性滚动动画 */
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

  /** @description 限制滚动范围并在越界时回弹 */
  private _limitScrollRange() {
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
    } else if (Math.abs(this._content.y) >= this._content.height - this._maskGraphics.height) {
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
      } else {
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

  /** @description 更新滚动条位置并触发回调 */
  private async _updateScrollbar() {
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

    const scrollHeight = this._content.height - this._maskGraphics.height;

    if (scrollHeight + this._content.y < this._maskGraphics.height && !this._scrollLock) {
      this._scrollLock = true;
      this._onLoad?.(this._pageIndex).then(
        () => {
          this._pageIndex++;
          this._scrollLock = false;
        },
        () => {
          this._scrollLock = false;
        },
      );
    }
  }

  /** @description 更新滚动条大小和显隐 */
  private _updateScrollbarSize() {
    if (!this._showScrollbar) {
      return;
    }

    const viewHeight = this._maskGraphics.height;
    const contentHeight = this._content.height;

    if (contentHeight <= viewHeight) {
      this._scrollbar.visible = false;
    } else {
      this._scrollbar.visible = true;
    }

    const ratio = viewHeight / contentHeight;
    const barHeight = viewHeight * ratio;

    this._scrollbar.x = this.width - (this._scrollbarRgiht || this._scrollbarWidth);
    this._scrollbar.clear();
    this._scrollbar.beginFill(this._scrollbarColor);
    this._scrollbar.drawRect(0, 0, this._scrollbarWidth, barHeight);
    this._scrollbar.endFill();
  }

  /** @description 按下滚动条开始拖动 */
  private _onScrollbarDragStart(event: FederatedPointerEvent) {
    event.stopPropagation();
    if (!this.parent) {
      return;
    }

    this._scrollbarDragging = true;
    this._scrollbarDragOffset = event.getLocalPosition(this._scrollbar).y;
    gsap.killTweensOf(this._content);
  }

  /** @description 拖动滚动条 */
  private _onScrollbarDragMove(event: FederatedPointerEvent) {
    event.stopPropagation();
    if (!this._scrollbarDragging || !this.parent) {
      return;
    }

    const localY = event.getLocalPosition(this).y;
    const viewHeight = this._maskGraphics.height;
    const contentHeight = this._content.height;
    const ratio = viewHeight / contentHeight;
    const barHeight = viewHeight * ratio;
    const maxBarY = viewHeight - barHeight;

    if (maxBarY <= 0) {
      return;
    }

    const newBarY = Math.min(Math.max(localY - this._scrollbarDragOffset, 0), maxBarY);
    const scrollY = (newBarY / maxBarY) * (contentHeight - viewHeight);

    this._content.y = -scrollY;
    this._updateScrollbar();
  }

  /** @description 结束滚动条拖动 */
  private _onScrollbarDragEnd(event: FederatedPointerEvent) {
    event.stopPropagation();
    this._scrollbarDragging = false;
  }

  /** @description 延迟隐藏滚动条 */
  private _hideScrollbar() {
    gsap.to(this._scrollbar, {
      duration: 0.5,
      alpha: 0,
      delay: 0.25,
    });
  }

  /** @description 获取滚动条右侧距离 */
  private get _scrollbarRgiht() {
    return this._scrollbarStyle.scrollbarRgiht ?? LibPixiScrollContainerY.scrollbarStyle.scrollbarRgiht;
  }

  /** @description 获取滚动条宽度 */
  private get _scrollbarWidth() {
    return this._scrollbarStyle.scrollbarWidth ?? LibPixiScrollContainerY.scrollbarStyle.scrollbarWidth;
  }

  /** @description 获取滚动条颜色 */
  private get _scrollbarColor() {
    return this._scrollbarStyle.scrollbarColor ?? LibPixiScrollContainerY.scrollbarStyle.scrollbarColor;
  }

  /** @description 获取是否显示滚动条 */
  private get _showScrollbar() {
    return this._scrollbarStyle.scrollbar ?? LibPixiScrollContainerY.scrollbarStyle.scrollbar;
  }

  /** @description 销毁滚动容器并清理事件 */
  override destroy(options?: boolean | IDestroyOptions): void {
    this._isDragging = false;
    this._scrollbarDragging = false;
    gsap.killTweensOf(this._content);
    gsap.killTweensOf(this._scrollbar);
    this._offScrollbarPointerDown?.();
    this._offScrollbarPointerEnter?.();
    this._offScrollbarPointerLeave?.();
    this._offPointerDown?.();
    this._offStagePointerMove?.();
    this._offPointerUp?.();
    this._offWheel?.();
    this._offPointerUpOutside?.();
    super.destroy(options);
  }
}
