import { Container } from "pixi.js";

/**
 * @description 将元素按照指定的列数和间隔排列成网格布局。
 * @param items 要排列的元素数组
 * @param gap 每个元素之间的间隔
 * @param cols 网格的列数，默认为元素数量
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiGridLayout-网格布局
 */
export const LibPixiGridLayout = (
  items: Container[],
  gap: number,
  cols = items.length
) => {
  let lastX = 0;

  items.forEach((item, index) => {
    const itemWidth = item.width || 0;
    const itemHeight = item.height || 0;
    const colIndex = index % cols;
    const rowIndex = Math.floor(index / cols);

    item.x = colIndex === 0 ? 0 : lastX + gap;
    item.y = rowIndex * (itemHeight + gap);

    lastX = item.x + itemWidth;

    if (colIndex === cols - 1) {
      lastX = 0;
    }
  });
};
