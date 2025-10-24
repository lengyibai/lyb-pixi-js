import type {
  Container,
  DisplayObjectEvents,
  FederatedPointerEvent,
} from "pixi.js";

const throttleImmediate = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func(...args);
    }
  };
};

export interface LibPixiEventParams {
  /** 是否只执行一次 */
  once?: boolean;
  /** 是否启用节流 */
  throttle?: boolean;
  /** 节流时长 */
  throttleTime?: number;
  /** 是否阻止拖动点击 */
  preventDragClick?: boolean;
}

/** @description 事件注册
 * @param v 事件容器
 * @param eventName 事件名称
 * @param callback 回调函数
 * @returns 停止监听
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiEvent-事件注册
 */
export const libPixiEvent = (
  v: Container,
  eventName: keyof DisplayObjectEvents,
  callback: (event: FederatedPointerEvent) => void,
  params: LibPixiEventParams = {}
) => {
  const {
    once = false,
    throttle = false,
    throttleTime = 1000,
    preventDragClick = false,
  } = params;
  v.cursor = "pointer";
  v.eventMode = "static";

  let lastX = 0;
  let lastY = 0;
  let isDragging = false;
  if (preventDragClick) {
    v.on("pointerdown", (e) => {
      isDragging = false;
      lastX = e.globalX;
      lastY = e.globalY;

      const threshold = 10; // 阈值像素

      const moveHandler = (ev: FederatedPointerEvent) => {
        const dx = ev.globalX - lastX;
        const dy = ev.globalY - lastY;
        if (dx * dx + dy * dy > threshold * threshold) {
          isDragging = true;
        }
      };

      const upHandler = () => {
        v.off("pointermove", moveHandler);
        v.off("pointerup", upHandler);
      };

      v.on("pointermove", moveHandler);
      v.on("pointerup", upHandler);
    });
  }

  const fn = (e: FederatedPointerEvent) => {
    if (isDragging && ["pointertap", "pointerup"].includes(eventName as any))
      return;
    if (e.button === 2) return;
    callback(e);
  };

  const handler = throttle ? throttleImmediate(fn, throttleTime) : fn;

  if (once) {
    v.once(eventName, handler);
  } else {
    v.on(eventName, handler);
  }

  return () => {
    v.off(eventName, handler);
  };
};
