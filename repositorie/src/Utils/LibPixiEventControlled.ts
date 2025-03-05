import type {
  Container,
  DisplayObjectEvents,
  FederatedPointerEvent,
} from "pixi.js";

/** @description 设置可关闭的事件监听，调用自身后不再触发
 * @param container 事件容器
 * @param eventName 事件名称
 * @param callback 事件回调
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiEventControlled-可关闭的事件
 */
export const libPixiEventControlled = (
  container: Container,
  eventName: keyof DisplayObjectEvents,
  callback: (e: FederatedPointerEvent) => void
) => {
  let isDestroy = false;
  container.cursor = "pointer";
  container.eventMode = "static";
  container.on(eventName, (e: FederatedPointerEvent) => {
    if (isDestroy) return;
    if (e.button === 2) return;
    callback(e);
  });

  return () => {
    isDestroy = true;
  };
};
