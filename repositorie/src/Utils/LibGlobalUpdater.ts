import type { Container } from "pixi.js";

/** @description 事件总线更新实例汇总 */
export class LibGlobalUpdater<Instances> {
  /** 实例列表 */
  private instances: Map<Instances, Container> = new Map();

  /** @description 存储实例
   * @param key 实例key
   * @param instance 实例
   */
  setInstance(key: Instances, instance: Container) {
    this.instances.has(key) && this.instances.delete(key);
    this.instances.set(key, instance);
  }

  /** @description 获取实例
   * @param key 实例key
   */
  getInstance<T>(key: Instances): T {
    return this.instances.get(key) as T;
  }
}
