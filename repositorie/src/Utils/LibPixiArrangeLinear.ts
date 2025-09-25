import { Container } from "pixi.js";

/**
 * @description 按照指定方向（水平或垂直）排列元素，支持固定间隔或自定义每个间隔。
 * @param items 要排列的元素数组。
 * @param gap 元素之间的间隔，可以是固定间隔或自定义的间隔数组。
 * @param direction 排列方向，"x"表示水平，"y"表示垂直，默认为水平。
 * @param cols 列数，默认为元素数量。
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiArrangeLinear-间隔布局
 */
export const LibPixiArrangeLinear = (
  items: Container[],
  gap: number | number[],
  direction: "x" | "y" = "x",
  cols: number = Infinity
) => {
  if (Array.isArray(gap)) {
    if (gap.length !== items.length - 1) {
      console.error(new Error("间隔的数组长度只能等于元素数组长度-1"));
      return;
    }
  }

  let lastRowMax = 0; // 记录当前行/列最大高度或宽度
  let rowOffset = 0; // 累计偏移量（多行时用）

  items.forEach((item, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;

    if (direction === "x") {
      const gapValue = Array.isArray(gap) ? gap[index - 1] ?? 0 : gap;

      if (col === 0 && row > 0) {
        rowOffset += lastRowMax + gapValue;
        lastRowMax = 0;
      }

      item.x =
        col === 0 ? 0 : items[index - 1].x + items[index - 1].width + gapValue;
      item.y = rowOffset;

      lastRowMax = Math.max(lastRowMax, item.height);
    } else {
      const gapValue = Array.isArray(gap) ? gap[index - 1] ?? 0 : gap;

      if (col === 0 && row > 0) {
        rowOffset += lastRowMax + gapValue;
        lastRowMax = 0;
      }

      item.y =
        col === 0 ? 0 : items[index - 1].y + items[index - 1].height + gapValue;
      item.x = rowOffset;

      lastRowMax = Math.max(lastRowMax, item.width);
    }
  });
};
