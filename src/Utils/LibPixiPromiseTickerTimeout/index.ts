import { Ticker } from "pixi.js";

/** @description 基于 Ticker 和 Promise 的定时器
 * @param delay 延迟时间
 * @param callback 延迟后执行的函数
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiPromiseTickerTimeout-TickerPromise定时器
 */
export const libPixiPromiseTickerTimeout = (
  delay = 1,
  callback?: () => void
) => {
  return new Promise<void>((resolve) => {
    let elapsedTime = 0;
    const ticker = new Ticker();

    const tickerCallback = () => {
      elapsedTime += ticker.deltaMS;
      if (elapsedTime >= delay) {
        callback?.();
        ticker.destroy();
        resolve();
      }
    };
    ticker.add(tickerCallback);
    ticker.start();
  });
};
