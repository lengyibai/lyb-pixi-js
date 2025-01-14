import { NineSlicePlane, type Texture } from "pixi.js";

export interface LibPixiCreateNineGridParams {
  /** 九宫格图片 */
  texture: Texture;
  /** 四个角的宽度 */
  dotWidth: number | [number, number, number, number];
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
}

/** @description 九宫格图
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiCreateNineGrid-九宫格图
 */
export const libPixiCreateNineGrid = (params: LibPixiCreateNineGridParams) => {
  const { texture, dotWidth, width, height } = params;

  let slice_width: number[] = [];

  // 四个角的宽度
  if (Array.isArray(dotWidth)) {
    slice_width = dotWidth;
  } else {
    slice_width = [dotWidth, dotWidth, dotWidth, dotWidth];
  }

  const nineSlicePlane = new NineSlicePlane(
    texture,
    slice_width[0],
    slice_width[1],
    slice_width[2],
    slice_width[3]
  );
  nineSlicePlane.width = width;
  nineSlicePlane.height = height;

  return nineSlicePlane;
};
