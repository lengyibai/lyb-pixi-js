import type {
  Container,
  DisplayObjectEvents,
  FederatedPointerEvent,
} from "pixi.js";

const debounceImmediate = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let invoked = false;

  return (...args: Parameters<T>) => {
    if (!invoked) {
      func(...args);
      invoked = true;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      invoked = false;
    }, wait);
  };
};

export interface LibPixiEventParams {
  /** 是否只执行一次 */
  once?: boolean;
  /** 是否启用防抖 */
  debounce?: boolean;
  /** 防抖时长 */
  debounceTime?: number;
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
  const { once = false, debounce = false, debounceTime = 1000 } = params;
  v.cursor = "pointer";
  v.eventMode = "static";

  const fn = (e: FederatedPointerEvent) => {
    if (e.button === 2) return;
    callback(e);
  };

  const handler = debounce ? debounceImmediate(fn, debounceTime) : fn;

  if (once) {
    v.once(eventName, handler);
  } else {
    v.on(eventName, handler);
  }

  return () => {
    v.off(eventName, handler);
  };
};
