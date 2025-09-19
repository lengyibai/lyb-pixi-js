import { Container } from "pixi.js";

/**
 * @description 将元素按照指定的列数和间隔排列成网格布局。
 * @param items 要排列的元素数组
 * @param gap 每个元素之间的间隔
 * @param cols 网格的列数，默认为元素数量
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiGridLayout-网格布局
 * @param direction 排列方向: "row" 行优先(默认) | "col" 列优先
 */
export const LibPixiGridLayout = (
  items: Container[],
  gap: number,
  cols = items.length,
  direction: "row" | "col" = "row",
) => {
  const rows = Math.ceil(items.length / cols); // 动态计算行数

  items.forEach((item, index) => {
    const itemWidth = item.width || 0;
    const itemHeight = item.height || 0;

    let colIndex = 0;
    let rowIndex = 0;

    if (direction === "row") {
      colIndex = index % cols;
      rowIndex = Math.floor(index / cols);
    } else {
      colIndex = Math.floor(index / rows);
      rowIndex = index % rows;
    }

    item.x = colIndex * (itemWidth + gap);
    item.y = rowIndex * (itemHeight + gap);
  });
};
