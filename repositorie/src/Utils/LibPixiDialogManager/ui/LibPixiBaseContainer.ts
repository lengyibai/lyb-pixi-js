import { Container } from "pixi.js";

/** @description 基础容器，所有弹窗或页面都基于此视图来管理视图生命周期 */
export class LibPixiBaseContainer extends Container {
  /** 调用 GameDialogManager.close 时调用 */
  beforeUnmount?: (destroy: () => void) => void;
  /** 窗口大小发生改变后调用 */
  resize?: (w: number, h: number) => void;

  constructor() {
    super();
  }

  /** @description 卸载前回调，需要调用回调参数进行手动销毁 */
  protected _onBeforeUnmount(beforeUnmount: (destroy: () => void) => void) {
    this.beforeUnmount = beforeUnmount;
  }

  /** @description 窗口大小发生改变后回调 */
  protected _onResize(resize: (w: number, h: number) => void) {
    this.resize = resize;
  }
}
