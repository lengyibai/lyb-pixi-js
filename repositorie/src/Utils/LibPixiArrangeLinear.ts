import type { Container } from "pixi.js";

/**
 * @description 线性排列 PIXI.Container 元素（支持横向/纵向排列，多列布局、固定或自定义间隔）
 * @param items 需要排列的容器数组
 * @param gap 间隔，可为固定值或数组（数组长度必须等于 items.length - 1）
 * @param direction 排列方向："x" 横向排列，"y" 纵向排列
 * @param cols 每行（或每列）最多的元素个数，默认为 Infinity（单行/单列）
 * @example
 * // 横向排列
 * LibPixiArrangeLinear([sprite1, sprite2, sprite3], 10, "x");
 * // 纵向排列
 * LibPixiArrangeLinear([sprite1, sprite2, sprite3], 20, "y");
 * // 两列布局
 * LibPixiArrangeLinear([sprite1, sprite2, sprite3, sprite4], 10, "x", 2);
 */
export const LibPixiArrangeLinear = (
  items: Container[],
  gap: number | number[],
  direction: "x" | "y" = "x",
  cols: number = Infinity
) => {
  // 验证 gap 数组长度是否正确
  if (Array.isArray(gap)) {
    if (gap.length !== items.length - 1) {
      console.error(new Error("间隔的数组长度只能等于元素数组长度-1"));
      return;
    }
  }

  let lastRowMax = 0; // 当前行（或列）的最大高度（或宽度），用于多行/多列换行时计算偏移
  let rowOffset = 0; // 累计偏移量，控制换行后的整体偏移位置

  items.forEach((item, index) => {
    const row = Math.floor(index / cols); // 当前行号
    const col = index % cols; // 当前列号

    if (direction === "x") {
      //间隔
      const gapValue = Array.isArray(gap) ? gap[index - 1] ?? 0 : gap;

      //在每行第一列重置列偏移量
      if (col === 0 && row > 0) {
        rowOffset += lastRowMax + gapValue;
        lastRowMax = 0;
      }

      // 横向位置 = 前一个元素的右侧 + 间隔；首列则从 0 开始
      item.x =
        col === 0 ? 0 : items[index - 1].x + items[index - 1].width + gapValue;
      // 纵向位置 = 当前累计的行偏移
      rowOffset && (item.y = rowOffset);

      // 更新当前行的最大高度
      lastRowMax = Math.max(lastRowMax, item.height);
    } else {
      //间隔
      const gapValue = Array.isArray(gap) ? gap[index - 1] ?? 0 : gap;

      //在每列第一行重置行偏移
      if (col === 0 && row > 0) {
        rowOffset += lastRowMax + gapValue;
        lastRowMax = 0;
      }

      // 纵向位置 = 首列则从 0 开始，其余从前一个元素的y坐标 + 高度 + 间隔；
      item.y =
        col === 0 ? 0 : items[index - 1].y + items[index - 1].height + gapValue;
      // 横向位置 = 当前累计的列偏移
      rowOffset && (item.x = rowOffset);

      // 更新当前列的最大宽度
      lastRowMax = Math.max(lastRowMax, item.width);
    }
  });
};
