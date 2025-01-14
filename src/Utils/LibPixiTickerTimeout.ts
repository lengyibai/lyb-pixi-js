import { Ticker } from "pixi.js";

/** @description 基于 Ticker 的定时器
 * @param callback 延迟后执行的函数
 * @param delay 延迟时间
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiTickerTimeout-Ticker定时器
 */
export const libPixiTickerTimeout = (callback: () => void, delay = 1) => {
  let elapsedTime = 0;
  const ticker = new Ticker();
  const tickerCallback = () => {
    elapsedTime += ticker.deltaMS;
    if (elapsedTime >= delay) {
      callback?.();
      try {
        ticker.destroy();
      } catch (error) {}
    }
  };
  ticker.add(tickerCallback);
  ticker.start();

  return () => {
    try {
      ticker.destroy();
    } catch (error) {}
  };
};
