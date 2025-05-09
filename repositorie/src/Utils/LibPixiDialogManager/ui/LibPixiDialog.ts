import { Container } from "pixi.js";
import gsap from "gsap";
import { LibPixiRectBgColor } from "../../../Components/Base/LibPixiRectBgColor";
import { libPixiEvent } from "../../LibPixiEvent";
import { LibPixiBaseContainer } from "./LibPixiBaseContainer";

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
  /** 蒙版UI */
  private maskUI: LibPixiRectBgColor;
  /** 内容容器 */
  private dialogContainer: Container;
  /** 当前大小 */
  private size = 1;
  /** 竖版初始大小 */
  private initialSize: number;
  /** 是否处于关闭动画状态 */
  private isCloseAnimating = false;

  constructor(params?: Params) {
    super();

    const { size = 1, onClickMask, needBg = true } = params || {};

    this.initialSize = size;

    //蒙版
    this.maskUI = new LibPixiRectBgColor({
      width: 2700,
      height: 1080,
      bgColor: "#000",
    });
    this.addChild(this.maskUI);
    this.maskUI.alpha = 0;
    this.maskUI.eventMode = "static";
    this.maskUI.visible = needBg;

    if (onClickMask) {
      libPixiEvent(this.maskUI, "pointertap", () => {
        if (this.isCloseAnimating) return;
        onClickMask?.();
      });
    }

    //弹窗内容容器
    this.dialogContainer = new Container();
    this.addChild(this.dialogContainer);
    this.dialogContainer.eventMode = "static";
  }

  /** @description 设置弹窗内容 */
  setDialogContent(content: Container) {
    this.dialogContainer.addChild(content);
    const w = this.dialogContainer.width / 2;
    const h = this.dialogContainer.height / 2;
    this.dialogContainer.pivot.set(w, h);
    this.dialogContainer.scale.set(0);
    this.dialogContainer.alpha = 0;

    gsap.to(this.maskUI, {
      duration: 0.5,
      alpha: 0.5,
    });
    gsap.to(this.dialogContainer, {
      duration: 0.5,
      alpha: 1,
    });

    this._onResize((w, h) => {
      const halfW = 1920 / 2;
      const halfH = 1080 / 2;

      if (w > h) {
        this.maskUI.renderBg(2700, 1080);
        this.maskUI.x = -(2700 - 1920) / 2;
        this.dialogContainer.position.set(halfW, halfH);
        this.size = 1;

        if (this.dialogContainer.scale.x === this.initialSize) {
          this.dialogContainer.scale.set(1);
        }
      } else {
        this.maskUI.renderBg(1080, 2700);
        this.maskUI.x = 0;
        this.dialogContainer.position.set(halfH, halfW);
        this.size = this.initialSize;

        if (this.dialogContainer.scale.x === 1) {
          this.dialogContainer.scale.set(this.initialSize);
        }
      }

      gsap.to(this.dialogContainer.scale, {
        duration: 0.5,
        ease: "back.out",
        x: this.size,
        y: this.size,
      });
    });
  }

  /** @description 关闭 */
  async close() {
    if (this.isCloseAnimating) return;
    this.isCloseAnimating = true;
    gsap.to(this.dialogContainer.scale, {
      duration: 0.5,
      ease: "back.in",
      x: 0,
      y: 0,
    });

    gsap.to(this.dialogContainer, {
      duration: 0.5,
      delay: 0.25,
      alpha: 0,
    });

    await gsap.to(this.maskUI, {
      duration: 0.5,
      delay: 0.25,
      alpha: 0,
    });
  }
}
