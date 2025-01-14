import { Container } from "pixi.js";
import gsap from "gsap";
import { LibPixiRectBgColor } from '../Base/LibPixiRectBgColor';

/** @description 底部弹出抽屉
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiDrawer-抽屉
 */
export class LibPixiDrawer extends Container {
  /** 蒙版UI */
  private _maskUI: LibPixiRectBgColor;
  /** 抽屉容器 */
  private _drawerContainer: Container;

  /**
   * @param content 抽屉内容
   */
  constructor(content: Container) {
    super();

    //蒙版
    this._maskUI = new LibPixiRectBgColor({
      bgColor: "#000",
      width: 1080,
      height: 1920,
    });
    this.addChild(this._maskUI);
    this._maskUI.alpha = 0;
    this._maskUI.eventMode = "static";

    //弹窗内容容器
    this._drawerContainer = content;
    this.addChild(this._drawerContainer);
    this._drawerContainer.y = this._maskUI.height;

    gsap.to(this._maskUI, {
      duration: 0.25,
      alpha: 0.5,
    });

    gsap.to(this._drawerContainer, {
      duration: 0.25,
      ease: "power1.out",
      y: this._maskUI.height - this._drawerContainer.height,
    });
  }

  /** @description 关闭 */
  async close() {
    gsap.to(this._drawerContainer, {
      duration: 0.25,
      y: this._maskUI.height,
    });

    await gsap.to(this._maskUI, {
      duration: 0.25,
      delay: 0.125,
      alpha: 0,
    });
  }
}
