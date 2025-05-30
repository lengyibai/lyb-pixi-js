import { Container } from "pixi.js";
import gsap from "gsap";
import { LibPixiRectBgColor } from "../../../Components/Base/LibPixiRectBgColor";
import { libPixiEvent } from "../../LibPixiEvent";
import { LibPixiBaseContainer } from "./LibPixiBaseContainer";
import { LibJsResizeWatcher } from "lyb-js/Base/LibJsResizeWatcher";

interface Params {
  /** 是否需要显示黑色背景 */
  needBg?: boolean;
  /** 竖版初始大小 */
  size?: number;
  /** 点击蒙版回调 */
  onClickMask?: () => void;
}

/** @description 弹窗组件 */
export class LibPixiDialog extends LibPixiBaseContainer {
  /** 黑色背景透明度 */
  static bgAlpha = 0.5;
  /** 动画时长 */
  static durationIn = 0.5;
  static durationOut = 0.5;

  /** 蒙版UI */
  private _maskUI: LibPixiRectBgColor;
  /** 内容容器 */
  private _dialogContainer: Container;
  /** 当前大小 */
  private _size = 1;
  /** 竖版初始大小 */
  private _initialSize: number;
  /** 是否处于关闭动画状态 */
  private _isCloseAnimating = false;

  /** 停止监听窗口 */
  private _offResize: () => void;

  constructor(params?: Params) {
    super();

    const { size = 1, onClickMask, needBg = true } = params || {};

    this._initialSize = size;

    //蒙版
    this._maskUI = new LibPixiRectBgColor({
      width: 2700,
      height: 1080,
      bgColor: "#000",
    });
    this.addChild(this._maskUI);
    this._maskUI.alpha = 0;
    this._maskUI.eventMode = "static";
    this._maskUI.visible = needBg;

    if (onClickMask) {
      libPixiEvent(this._maskUI, "pointertap", () => {
        if (this._isCloseAnimating) return;
        onClickMask?.();
        this._offResize();
      });
    }

    //弹窗内容容器
    this._dialogContainer = new Container();
    this.addChild(this._dialogContainer);
    this._dialogContainer.eventMode = "static";

    const resize = new LibJsResizeWatcher();
    this._offResize = resize.on((w, h) => {
      const halfW = 1920 / 2;
      const halfH = 1080 / 2;

      if (w > h) {
        this._maskUI.renderBg(2700, 1080);
        this._maskUI.x = -(2700 - 1920) / 2;
        this._dialogContainer.position.set(halfW, halfH);
        this._size = 1;

        if (this._dialogContainer.scale.x === this._initialSize) {
          this._dialogContainer.scale.set(1);
        }
      } else {
        this._maskUI.renderBg(1080, 2700);
        this._maskUI.x = 0;
        this._dialogContainer.position.set(halfH, halfW);
        this._size = this._initialSize;

        if (this._dialogContainer.scale.x === 1) {
          this._dialogContainer.scale.set(this._initialSize);
        }
      }

      gsap.to(this._dialogContainer.scale, {
        duration: LibPixiDialog.durationIn,
        ease: "back.out",
        x: this._size,
        y: this._size,
      });
    });
  }

  /** @description 设置弹窗内容 */
  setDialogContent(content: Container) {
    this._dialogContainer.addChild(content);
    const w = this._dialogContainer.width / 2;
    const h = this._dialogContainer.height / 2;
    this._dialogContainer.pivot.set(w, h);
    this._dialogContainer.scale.set(0);
    this._dialogContainer.alpha = 0;

    gsap.to(this._maskUI, {
      duration: LibPixiDialog.durationIn,
      alpha: LibPixiDialog.bgAlpha,
    });
    gsap.to(this._dialogContainer, {
      duration: LibPixiDialog.durationIn,
      alpha: 1,
    });
  }

  /** @description 关闭 */
  async close() {
    if (this._isCloseAnimating) return;
    this._offResize();
    this._isCloseAnimating = true;
    gsap.to(this._dialogContainer.scale, {
      duration: LibPixiDialog.durationOut,
      ease: "back.in",
      x: 0,
      y: 0,
    });

    gsap.to(this._dialogContainer, {
      duration: LibPixiDialog.durationOut,
      delay: LibPixiDialog.durationOut / 2,
      alpha: 0,
    });

    await gsap.to(this._maskUI, {
      duration: LibPixiDialog.durationOut,
      delay: LibPixiDialog.durationOut / 2,
      alpha: 0,
    });
  }
}
