/** @description 设置滤镜 */

import { ColorMatrixFilter, BlurFilter } from "pixi.js";

export type LibPixiSetFilterFilterName =
  | "brightness"
  | "blur"
  | "desaturate"
  | "contrast";

/** @description 滤镜
 * @param filterName 滤镜名称
 * @param v 滤镜值
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiFilter-滤镜
 */
export const libPixiFilter = (
  filterName: LibPixiSetFilterFilterName,
  v?: number
): ColorMatrixFilter | BlurFilter => {
  let filter: ColorMatrixFilter | BlurFilter;

  if (filterName === "brightness") {
    filter = new ColorMatrixFilter();
    filter.brightness(v!, false); // 设置亮度
  } else if (filterName === "blur") {
    filter = new BlurFilter();
  } else if (filterName === "desaturate") {
    filter = new ColorMatrixFilter();
    filter.desaturate();
  } else if (filterName === "contrast") {
    filter = new ColorMatrixFilter();
    filter.contrast(v!, false);
  } else if (filterName === "saturate") {
    filter = new ColorMatrixFilter();
    filter.saturate(v!, false);
  } else {
    throw new Error("未知滤镜名称");
  }
  filter.resolution = window.devicePixelRatio || 1;
  return filter;
};
