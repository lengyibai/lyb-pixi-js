import { Ticker, type Container } from "pixi.js";


/** @description 对象属性监听
 * @param obj 对象
 * @param keys 监听的对象属性
 * @param callback 监听的对象属性发生变化时触发回调
 * @param container 容器对象，用于判断元素是否被销毁
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiWatchProperty-对象属性监听
 */
export const LibPixiWatchProperty = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
  callback: () => void,
  container?: Container
) => {
  const ticker = new Ticker();
  const lastValues = new Map<K, T[K]>();

  ticker.maxFPS = 10;

  callback();

  //存储上一次的值
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    lastValues.set(key, obj[key]);
  }

  const flag = (key: K) => {
    if (lastValues.get(key) !== obj[key]) {
      lastValues.set(key, obj[key]);
      return true;
    }
    return false;
  };

  ticker.add(() => {
    //如果元素被销毁
    if (container?.destroyed) {
      ticker.destroy();
      return;
    }

    let changed = false;

    if (keys.length === 1) {
      changed = flag(keys[0]);
    } else {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        changed = flag(key);
      }
    }

    if (changed) callback();
  });

  ticker.start();
};
