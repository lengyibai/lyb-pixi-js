import { Ticker } from "pixi.js"; //@ts-ignore
import { libJsRandom } from "lyb-js/Random/LibJsRandom.js";

/** @description 间隔触发（共享 Ticker 版） */
export const libPixiIntervalTrigger = (
  callback: () => void,
  interval: number | [number, number],
  immediately = true
) => {
  let nextInterval = Array.isArray(interval)
    ? libJsRandom(interval[0], interval[1], 2)
    : interval;
  let elapsed = 0;

  if (immediately) callback();

  const tickerCallback = () => {
    elapsed += Ticker.shared.deltaMS;
    if (elapsed >= nextInterval) {
      elapsed -= nextInterval;
      callback();
      nextInterval = Array.isArray(interval)
        ? libJsRandom(interval[0], interval[1], 2)
        : interval;
    }
  };

  Ticker.shared.add(tickerCallback);

  return () => {
    Ticker.shared.remove(tickerCallback);
  };
};
