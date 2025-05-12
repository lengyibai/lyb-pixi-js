import { Container } from "pixi.js";

/** @description 触发后代监听
 * @param container 容器
 * @param event 事件名称
 * @param payload 事件携带数据
 */
export const LibPixiEmitContainerEvent = (
  container: Container,
  event: string,
  payload?: any
): void => {
  container.children.forEach((child) => {
    child.emit(event, payload);
    if ("children" in child) {
      LibPixiEmitContainerEvent(child as Container, event, payload);
    }
  });
};
