import type { Container } from "pixi.js";
import type { LibPixiBaseContainer } from "./ui/LibPixiBaseContainer";
export { LibPixiBaseContainer } from "./ui/LibPixiBaseContainer";
export { LibPixiDialog } from "./ui/LibPixiDialog";

interface IViewCtor {
  new (...args: any[]): LibPixiBaseContainer;
}

/** @description 弹窗管理器 */
export class LibPixiDialogManager {
  /** 视图表 */
  private _views: Record<string, LibPixiBaseContainer> = {};
  /** 弹窗关闭监听器表 */
  private _closeListeners = new Map<string, Set<() => void>>();
  /** open时显示的元素的父容器 */
  private _openContainer: Container;

  constructor(parent: Container) {
    this._openContainer = parent;
  }

  /**
   * 打开界面
   * @param View 实例类型或构造方法
   * @param args 实例参数
   */
  open<T extends IViewCtor>(
    View: T,
    id: string,
    ...args: ConstructorParameters<T>
  ): InstanceType<T> {
    const view = new View(...args);
    this._openContainer.addChild(view);

    this._views[id] = view;
    return view as InstanceType<T>;
  }

  /** 监听弹窗关闭
   * @param id 弹窗id
   * @param callback 关闭回调
   */
  onClose(id: string, callback: () => void) {
    if (!this._closeListeners.has(id)) this._closeListeners.set(id, new Set());
    this._closeListeners.get(id)!.add(callback);
  }

  /** @description 关闭页面，会调用页面的 onBeforeUnmount 事件，里面会做关闭动画，动画结束后会自动销毁
   * @param id 页面名称
   */
  async close(id: string) {
    const view = this._views[id];
    if (view) {
      await view.destroy?.();
      delete this._views[id];

      const set = this._closeListeners.get(id);
      if (!set) return;
      for (const cb of set) cb();
      this._closeListeners.delete(id);
    }
  }

  /** @description 关闭并销毁所有弹窗 */
  async closeAll() {
    const ids = Object.keys(this._views);
    for (const id of ids) {
      await this.close(id);
    }
  }
}
