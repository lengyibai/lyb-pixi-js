import {
  Container,
  Graphics,
  Sprite,
  type FederatedPointerEvent,
} from "pixi.js";
import { gsap } from "gsap";
import { LibPixiContainer } from "../Base/LibPixiContainer";

export interface LibPixiScrollContainerParams {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 滚动内容 */
  scrollContent: Container;
  /** 底部内边距 */
  bottomMargin?: number;
}

/** @description 支持鼠标滚轮滚动、鼠标拖动、手指滑动，支持惯性滚动及回弹
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiScrollContainer-滚动容器
 */
export class LibPixiScrollContainer extends LibPixiContainer {
  /** 开始位置 */
  private _startY = 0;
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

  /** 滚动容器 */
  public _scrollContent: Container;
  /** 遮罩 */
  private _maskGraphics: Graphics;
  /** 滚动的内容 */
  private _content: Container;

  constructor(params: LibPixiScrollContainerParams) {
    const { width, height, scrollContent, bottomMargin = 50 } = params;
    super(width, height);

    this._scrollContent = scrollContent;

    // 创建内容容器
    this._content = new Container();
    this.addChild(this._content);
    this._content.addChild(this._scrollContent);

    // 创建底部占位
    if (bottomMargin > 0) {
      const bottom_box = new Sprite();
      this._content.addChild(bottom_box);
      bottom_box.y = this._content.height + bottomMargin;
    }

    // 创建遮罩
    this._maskGraphics = new Graphics();
    this.addChild(this._maskGraphics);
    this._maskGraphics.clear();
    this._maskGraphics.beginFill(0x000000);
    this._maskGraphics.drawRect(0, 0, width, height);
    this._maskGraphics.endFill();
    this.mask = this._maskGraphics;

    // 添加事件监听
    this.eventMode = "static";
    this.on("pointerdown", this._onDragStart, this);
    this.on("pointermove", this._onDragMove, this);
    this.on("pointerup", this._onDragEnd, this);
    this.on("pointerupoutside", this._onDragEnd, this);
    this.on("wheel", this._onWheelScroll, this);
  }

  /** @description 设置滚动容器可视区宽高
   * @param width 宽度
   * @param height 高度
   */
  setDimensions(width: number, height: number) {
    // 更新遮罩尺寸
    this._maskGraphics.clear();
    this._maskGraphics.beginFill(0x000000);
    this._maskGraphics.drawRect(0, 0, width, height);
    this._maskGraphics.endFill();
    this.setSize(width, height);
  }

  /** @description 返回顶部 */
  scrollToTop() {
    this._content.y = 0;
  }

  /** @description 往滚动内容添加元素 */
  addContent(container: Container) {
    this._scrollContent.addChild(container);
  }

  /** @description 按下 */
  private _onDragStart(event: FederatedPointerEvent) {
    if (this._content.height <= this._maskGraphics.height) return;

    const position = event.getLocalPosition(this);
    this._startY = position.y - this._content.y;
    this._isDragging = true;
    this._velocity = 0;
    this._startTime = Date.now();
    this._startPosition = this._content.y;
    gsap.killTweensOf(this._content);
  }

  /** @description 拖动 */
  private _onDragMove(event: any) {
    if (this._isDragging) {
      const position = event.data.getLocalPosition(this);
      const newPosition = position.y - this._startY;
      this._content.y = newPosition;
    }
  }

  /** @description 拖动结束 */
  private _onDragEnd() {
    this._isDragging = false;
    const currentTime = Date.now();
    const deltaTime = currentTime - this._startTime; // 计算停留时间

    if (deltaTime < 250) {
      // 如果停留时间在阈值内，计算惯性速度
      this._velocity = (this._content.y - this._startPosition) / deltaTime;
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
    });
  }

  /** @description 惯性动画 */
  private _applyInertia() {
    gsap.to(this._content, {
      y: this._content.y + this._velocity * 250,
      duration: 0.5,
      ease: "power1.out",
      onUpdate: this._limitScrollRange.bind(this),
    });
  }

  /** @description 限制滚动范围 */
  private _limitScrollRange() {
    //如果内容顶部离开了滚动容器顶部，则归位
    if (this._content.y > 0) {
      gsap.to(this._content, {
        duration: 0.75,
        y: 0,
        ease: "elastic.out",
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
          duration: 0.75,
          y,
          ease: "elastic.out",
        });
      }
      // 否则静止不动
      else {
        gsap.to(this._content, {
          duration: 0.25,
          y: 0,
        });
      }
    }
  }
}