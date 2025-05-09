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
  private views: Record<string, LibPixiBaseContainer> = {};
  /** 上一次方向 */
  private lastOrientation: "h" | "v" = "h";
  /** open时显示的元素的父容器 */
  private _openContainer: Container;
  /** 是否适配横竖屏 */
  private _hv = false;

  constructor(parent: Container, hv = false) {
    this._openContainer = parent;
    this._hv = hv;

    if (hv) {
      window.addEventListener("resize", () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const orientation = w > h ? "h" : "v";

        if (orientation !== this.lastOrientation) {
          this.resize?.(window.innerWidth, window.innerHeight);
          this.lastOrientation = orientation;
        }
      });
    }
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

    if (this._hv) {
      view.resize?.(window.innerWidth, window.innerHeight);
    } else {
      view.resize?.(1920, 1080);
    }

    this.views[id] = view;
    return view as InstanceType<T>;
  }

  /** @description 关闭页面，会调用页面的 onBeforeUnmount 事件，里面会做关闭动画，动画结束后会自动销毁
   * @param id 页面名称
   */
  close(id: string) {
    const view = this.views[id];
    if (view) {
      if (view.beforeUnmount) {
        view.beforeUnmount(() => {
          requestAnimationFrame(() => {
            view.destroy({ children: true });
          });
        });
      } else {
        requestAnimationFrame(() => {
          view.destroy({ children: true });
        });
      }

      delete this.views[id];
    }
  }

  private resize(w: number, h: number) {
    Object.values(this.views).forEach((view) => {
      view.resize?.(w, h);
    });
  }
}
