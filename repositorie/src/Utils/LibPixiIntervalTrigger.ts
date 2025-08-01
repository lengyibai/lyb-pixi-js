import { Ticker } from "pixi.js"; //@ts-ignore
import { libJsRandom } from "lyb-js/Random/LibJsRandom.js";

/** @description 间隔触发
 * @param callback 回调函数
 * @param interval 间隔毫秒，或随机范围
 * @param immediately 是否立即执行一次
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiIntervalTrigger-间隔触发
 */
export const libPixiIntervalTrigger = (
  callback: () => void,
  interval: number | [number, number],
  immediately = true,
) => {
  let elapsedTime = 0;

  // 创建一个新的 Ticker 实例
  const ticker = new Ticker();

  // 创建回调函数
  const tickerCallback = () => {
    elapsedTime += ticker.elapsedMS;

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

  immediately && callback();

  ticker.add(tickerCallback);
  ticker.start();

  return () => {
    ticker.remove(tickerCallback);
    ticker.stop();
  };
};
