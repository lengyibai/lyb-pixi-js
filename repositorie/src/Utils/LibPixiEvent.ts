import type {
  Container,
  DisplayObjectEvents,
  FederatedPointerEvent,
} from "pixi.js";

/** @description 事件注册
 * @param v 事件容器
 * @param eventName 事件名称
 * @param callback 回调函数
 * @param once 是否只执行一次
 * @returns 停止监听
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiEvent-事件注册
 */
export const libPixiEvent = (
  v: Container,
  eventName: keyof DisplayObjectEvents,
  callback: (event: FederatedPointerEvent) => void,
  once = false
) => {
  v.cursor = "pointer";
  v.eventMode = "static";

  const fn = (e: FederatedPointerEvent) => {
    if (e.button === 2) return;
    callback(e);
  };
  if (once) {
    v.once(eventName, fn);
  } else {
    v.on(eventName, fn);
  }

  return () => {
    v.off(eventName, fn);
  };
};
