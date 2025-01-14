import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import type { Container } from "pixi.js";

export interface LibPixiShadowShadowConfig {
  color?: string;
  alpha?: number;
  blur?: number;
  distance?: number;
  offset?: { x: number; y: number };
}

/** @description 为图片或容器设置阴影
 * @param container 需要添加阴影的元素
 * @param config 配置项
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiShadow-阴影
 */
export const libPixiShadow = (
  container: Container,
  config?: LibPixiShadowShadowConfig
) => {
  const {
    color = "#000",
    alpha = 0.25,
    blur = 1,
    distance = 0,
    offset = { x: 0, y: 0 },
  } = config || {};
  const shadowFilter = new DropShadowFilter({
    color: color as unknown as number,
    alpha,
    blur,
    distance,
    offset,
  });
  shadowFilter.resolution = window.devicePixelRatio || 1;
  container.filters = [shadowFilter];
};
