import { libJsConvertAngle } from "lyb-js/Math/LibJsConvertAngle.js";

/** @description 转盘布局
 * @param num 份数
 * @param distance 中心距离
 * @param layoutCallback 定位计算回调
 */
export const LibPixiTurntable = (
  num: number,
  distance: number,
  layoutCallback: (x: number, y: number, rotation: number, index: number) => void,
) => {
  for (let i = 0; i < num; i++) {
    const rotation = libJsConvertAngle((360 / num) * i, "rad");
    const cos = Math.cos(rotation + libJsConvertAngle(-90, "rad"));
    const sin = Math.sin(rotation + libJsConvertAngle(-90, "rad"));
    layoutCallback(cos * distance, sin * distance, rotation, i);
  }
};
