import { Container } from "pixi.js";

/** @description 带销毁的容器 */
export class LibDestroyContainer extends Container {
  /** 销毁之前 */
  protected _onBeforeDestroy?: () => void | Promise<void>;
  /** 已销毁 */
  protected _onDestroyed?: () => void;

  constructor() {
    super();
  }

  /** @description 销毁 */
  async destroy() {
    await this._onBeforeDestroy?.();
    super.destroy({ children: true });
    this._onDestroyed?.();
  }
}
