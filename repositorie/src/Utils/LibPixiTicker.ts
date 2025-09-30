import { Ticker } from "pixi.js";

/** @description Ticker管理器 */
export class LibPixiTicker {
  private static _callbacks = new Map<string, { fn: () => void; active: boolean }>();

  /** @description 添加回调，重复 ID 会覆盖 */
  static add(id: string, fn: () => void) {
    // 如果已有相同 ID，先移除旧回调
    if (this._callbacks.has(id)) {
      Ticker.shared.remove(this._callbacks.get(id)!.fn);
    }

    // 默认 active
    this._callbacks.set(id, { fn, active: true });
    Ticker.shared.add(fn);

    return () => {
      LibPixiTicker.remove(id);
    };
  }

  /** @description 删除回调 */
  static remove(id: string) {
    const cb = this._callbacks.get(id);
    if (cb) {
      Ticker.shared.remove(cb.fn);
      this._callbacks.delete(id);
    }
  }

  /** @description 停止某个回调（pause） */
  static stop(id: string) {
    const cb = this._callbacks.get(id);
    if (cb && cb.active) {
      Ticker.shared.remove(cb.fn);
      cb.active = false;
    }
  }

  /** @description 启动某个回调（resume） */
  static start(id: string) {
    const cb = this._callbacks.get(id);
    if (cb && !cb.active) {
      Ticker.shared.add(cb.fn);
      cb.active = true;
    }
  }

  /** @description 清空所有回调 */
  static clearAll() {
    this._callbacks.forEach((cb) => {
      Ticker.shared.remove(cb.fn);
    });
    this._callbacks.clear();
  }
}
