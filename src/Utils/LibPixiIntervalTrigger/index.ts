import { Ticker } from "pixi.js";
import { libJsRandom } from "lyb-js/dist/Random/LibJsRandom";

/** @description 间隔触发
 * @param callback 回调函数
 * @param interval 间隔毫秒，或随机范围
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiIntervalTrigger-间隔触发
 */
export const libPixiIntervalTrigger = (
  callback: () => void,
  interval: number | [number, number]
) => {
  let elapsedTime = 0;

  // 创建一个新的 Ticker 实例
  const ticker = new Ticker();

  // 创建回调函数
  const tickerCallback = (deltaTime: number) => {
    elapsedTime += deltaTime * ticker.deltaMS;

    let intervalNum = 0;
    if (Array.isArray(interval)) {
      intervalNum = libJsRandom(interval[0], interval[1], 2);
    } else {
      intervalNum = interval;
    }

    if (elapsedTime >= intervalNum) {
      callback();
      elapsedTime = 0;
    }
  };

  ticker.add(tickerCallback);

  ticker.start();

  return () => {
    ticker.remove(tickerCallback);
    ticker.stop();
  };
};
