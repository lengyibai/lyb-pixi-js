import { libPixiTickerTimeout } from "./LibPixiTickerTimeout";

/** @description 可控延迟调用函数 */
export const libControlledDelayedCall = (time: number) => {
  let _resolve: any;
  let timer: () => void;

  const start = new Promise<void>((resolve) => {
    _resolve = resolve;
    timer = libPixiTickerTimeout(() => {
      resolve();
    }, time);
  });

  const stop = () => {
    timer();
    _resolve();
  };

  return {
    start,
    stop,
  };
};