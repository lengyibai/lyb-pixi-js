import gsap from "gsap";
import { Container, type HTMLText, type Text } from "pixi.js";
import { LibPixiRectangle } from "../Base/LibPixiRectangle";

interface Params {
  /** 高度 */
  width: number;
  /** 宽度 */
  height: number;
  /** 速度，px/s，默认100 */
  speed?: number;

  /** 可见性回调 */
  onVisable: (v: boolean) => void;
}

/** @description 滚动通知栏 */
export class LibPixiNoticeBar extends Container {
  /** 当前参数 */
  private _params: Params;

  /** 文本队列 */
  private _textQueue: (Text | HTMLText)[] = [];
  /** 当前显示的文本 */
  private _currentText?: Text | HTMLText;

  constructor(params: Params) {
    super();

    this._params = params;
    const { width, height } = params;

    const rectangle = new LibPixiRectangle(width, height);
    this.addChild(rectangle);
    this.mask = rectangle;
  }

  /** @description 添加到队列 */
  addText(...text: (Text | HTMLText)[]) {
    this._textQueue.push(...text);

    if (this._currentText) return;
    this._showText();
  }

  /** @description 显示文本 */
  private _showText() {
    this._currentText = this._textQueue.shift();

    if (!this._currentText) return;
    this._params.onVisable(true);

    this.addChild(this._currentText);
    this._currentText.anchor.y = 0.5;
    this._currentText.position.set(this._params.width, this._params.height / 2);

    gsap.to(this._currentText, {
      x: -this._currentText.width,
      duration:
        (this._params.width + this._currentText.width) /
        (this._params.speed || 100),
      ease: "none",
      onComplete: () => {
        this._currentText!.destroy();
        this._currentText = undefined;

        if (this._textQueue.length) {
          this._showText();
        } else {
          this._params.onVisable(false);
          this._currentText = undefined;
        }
      },
    });
  }
}
