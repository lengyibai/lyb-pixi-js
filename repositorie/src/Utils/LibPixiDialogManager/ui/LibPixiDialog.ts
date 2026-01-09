import { Container, Ticker } from "pixi.js";
import gsap from "gsap";
import { LibJsResizeWatcher } from "lyb-js/Base/LibJsResizeWatcher.js";
import { LibPixiMaskBg } from "../../../Components/Custom/LibPixiMaskBg";
import { libPixiEvent } from "../../LibPixiEvent";
import { LibPixiBaseContainer } from "./LibPixiBaseContainer";
import { libPixiPivot } from "../../LibPixiActhor";

interface Params {
  /** 是否需要显示黑色背景 */
  needBg?: boolean;
  /** 点击蒙版回调 */
  onClickMask?: () => void;
  /** 竖版缩放大小 */
  vScale?: number;
}

/** @description 弹窗组件 */
export class LibPixiDialog extends LibPixiBaseContainer {
  /** 黑色背景透明度 */
  static bgAlpha = 0.5;
  /** 动画时长 */
  static durationIn = 0.5;
  static durationOut = 0.5;
  /** 是否支持横竖版 */
  static adaptation: "hv" | "h" | "v" = "hv";
  /** 舞台 */
  static stage: Container;

  /** 蒙版UI */
  private _maskUI: LibPixiMaskBg;
  /** 内容容器 */
  private _dialogContainer: Container;
  /** 竖版缩放大小 */
  private _vScale = 1;
  /** 上一次是否为横版 */
  private _lastIsH?: boolean;

  /** 停止监听窗口 */
  private _offResize?: () => void;

  constructor(params?: Params) {
    super();

    LibPixiMaskBg.stage = LibPixiDialog.stage;
    LibPixiMaskBg.bgAlpha = LibPixiDialog.bgAlpha;

    const { onClickMask, vScale = 1, needBg = true } = params || {};
    this._vScale = vScale;

    //蒙版
    this._maskUI = new LibPixiMaskBg();
    this.addChild(this._maskUI);
    this._maskUI.alpha = 0;
    this._maskUI.eventMode = "static";
    this._maskUI.visible = needBg;

    if (onClickMask) {
      libPixiEvent(
        this._maskUI,
        "pointertap",
        () => {
          onClickMask?.();
          this._offResize?.();
        },
        {
          once: true,
        }
      );
    }
    this._maskUI.cursor = "default";

    //弹窗内容容器
    this._dialogContainer = new Container();
    this.addChild(this._dialogContainer);
    this._dialogContainer.eventMode = "static";

    const resize = new LibJsResizeWatcher(LibPixiDialog.adaptation);
    const off1 = resize.on(this._redraw.bind(this), false);
    const updateSize = () => {
      this._maskUI.updateSize();
    };
    Ticker.shared.add(updateSize);

    this._onDestroyed = () => {
      off1();
      Ticker.shared.remove(updateSize);
    };
  }

  /** @description 设置弹窗内容 */
  setDialogContent(content: Container) {
    this._dialogContainer.addChild(content);
    this._dialogContainer.alpha = 0;

    requestAnimationFrame(() => {
      if (LibPixiDialog.adaptation === "h") {
        this._redraw(1920, 1080);
      } else if (LibPixiDialog.adaptation === "v") {
        this._redraw(1080, 1920);
      } else {
        this._redraw(window.innerWidth, window.innerHeight);
      }

      gsap.to(this._maskUI, {
        duration: LibPixiDialog.durationIn,
        alpha: LibPixiDialog.bgAlpha,
      });
      gsap.to(this._dialogContainer, {
        duration: LibPixiDialog.durationIn,
        alpha: 1,
      });
    });
  }

  /** @description 更新弹窗容器坐标 */
  updatePosition(w: number, h: number) {
    libPixiPivot(this._dialogContainer, 0.5, 0.5);

    const halfW = 1920 / 2;
    const halfH = 1080 / 2;

    if (w > h) {
      this._dialogContainer.position.set(halfW, halfH);
    } else {
      this._dialogContainer.position.set(halfH, halfW);
    }
  }

  /** @description 关闭 */
  async close() {
    this._maskUI.eventMode = "none";
    this._offResize?.();
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

  /** @description 重绘弹窗 */
  private _redraw(w: number, h: number) {
    this._maskUI.updateSize();

    if (this._lastIsH === w > h) return;
    this._lastIsH = w > h;

    let scale = 0;

    if (w > h) {
      scale = 1;
    } else {
      scale = this._vScale;
    }

    this.updatePosition(w, h);

    this._dialogContainer.scale.set(0);
    gsap.to(this._dialogContainer.scale, {
      duration: LibPixiDialog.durationIn,
      ease: "back.out",
      x: scale,
      y: scale,
    });
  }
}
