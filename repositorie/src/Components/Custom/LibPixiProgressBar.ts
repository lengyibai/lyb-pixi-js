import gsap from "gsap";
import { Container, Graphics } from "pixi.js";

import { LibPixiRectangle } from "../Base/LibPixiRectangle.js";
import { LibPixiRoundedRect } from "../Base/LibPixiRoundedRect.js";
import { LibPixiText } from "../Base/LibPixiText.js";

/** 文本文字参数 */
type LibPixiTextParams = ConstructorParameters<typeof LibPixiText>[0];

/** @description 纯色进度条参数 */
export interface LibPixiProgressBarParams {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 圆角 */
  radius?: number;
  /** 背景颜色 */
  bgColor?: string;
  /** 进度颜色 */
  barColor?: string;
  /** 动画时长 */
  duration?: number;
  /** 是否显示文本 */
  showText?: boolean;
  /** 文本样式 */
  textStyle?: Partial<LibPixiTextParams>;
  /** 文本格式化 */
  formatter?: (progress: number) => string;
}

/** @description 纯图形进度条组件 */
export class LibPixiProgressBar extends Container {
  /** 宽度 */
  private _widthValue: number;
  /** 高度 */
  private _heightValue: number;
  /** 圆角 */
  private _radius: number;
  /** 动画时长 */
  private _duration: number;
  /** 当前进度 */
  private _progressState = { value: 0 };
  /** 进度图形 */
  private _bar: Container;
  /** 进度遮罩 */
  private _maskGraphics: Graphics;
  /** 文字对象 */
  private _progressText?: LibPixiText;
  /** 文本格式化 */
  private _formatter: (progress: number) => string;

  /** @description 创建纯色进度条 */
  constructor(params: LibPixiProgressBarParams) {
    super();

    this._widthValue = params.width;
    this._heightValue = params.height;
    this._radius = params.radius ?? 0;
    this._duration = params.duration ?? 0.25;
    this._formatter = params.formatter || ((progress) => `${Math.round(progress * 100)}%`);

    const bg = this._createShape(this._widthValue, this._heightValue, params.bgColor ?? "#000");
    this.addChild(bg);

    this._bar = this._createShape(this._widthValue, this._heightValue, params.barColor ?? "#fff");
    this.addChild(this._bar);

    this._maskGraphics = new Graphics();
    this.addChild(this._maskGraphics);
    this._bar.mask = this._maskGraphics;
    this._renderMask(0);

    if (params.showText !== false) {
      const textStyle = params.textStyle || {};

      this._progressText = new LibPixiText({
        text: this._formatter(0),
        fontSize: 28,
        fontWeight: "bold",
        fontColor: "#fff",
        stroke: "#000",
        strokeThickness: 4,
        ...textStyle,
      });
      this.addChild(this._progressText);
      this._progressText.anchor.set(0.5);
      this._progressText.position.set(this._widthValue / 2, this._heightValue / 2);
    }
  }

  /** @description 设置进度 */
  setProgress(progress: number, animate = true) {
    const targetProgress = Math.max(0, Math.min(1, progress));

    gsap.killTweensOf(this._progressState);

    if (!animate) {
      this._progressState.value = targetProgress;
      this._renderMask(this._progressState.value);
      this._updateText();
      return;
    }

    gsap.to(this._progressState, {
      value: targetProgress,
      duration: this._duration,
      ease: "none",
      onUpdate: () => {
        this._renderMask(this._progressState.value);
        this._updateText();
      },
    });
  }

  /** @description 手动设置文本 */
  setText(text: string) {
    if (!this._progressText) {
      return;
    }

    this._progressText.text = text;
  }

  /** @description 获取当前进度 */
  getProgress() {
    return this._progressState.value;
  }

  /** @description 更新文本格式化器 */
  setFormatter(formatter: (progress: number) => string) {
    this._formatter = formatter;
    this._updateText();
  }

  /** @description 创建基础图形 */
  private _createShape(width: number, height: number, color: string) {
    if (this._radius > 0) {
      return new LibPixiRoundedRect(width, height, this._radius, color);
    }

    return new LibPixiRectangle(width, height, color);
  }

  /** @description 更新文本 */
  private _updateText() {
    if (!this._progressText) {
      return;
    }

    this._progressText.text = this._formatter(this._progressState.value);
  }

  /** @description 重绘遮罩 */
  private _renderMask(progress: number) {
    const maskWidth = this._widthValue * progress;

    this._maskGraphics.clear();
    this._maskGraphics.beginFill(0xffffff);

    if (maskWidth <= 0) {
      this._maskGraphics.endFill();
      return;
    }

    if (this._radius > 0) {
      const radius = Math.min(this._radius, maskWidth / 2, this._heightValue / 2);
      this._maskGraphics.drawRoundedRect(0, 0, maskWidth, this._heightValue, radius);
    } else {
      this._maskGraphics.drawRect(0, 0, maskWidth, this._heightValue);
    }

    this._maskGraphics.endFill();
  }
}
