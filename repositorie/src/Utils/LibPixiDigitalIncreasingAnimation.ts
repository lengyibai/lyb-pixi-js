import { libJsNumComma } from "lyb-js/Formatter/LibJsNumComma.js";

export interface LibPixiDigitalIncreasingAnimationParams {
  /** 目标值 */
  value: number;
  /** 开始值 */
  startValue?: number;
  /** 动画时长 */
  duration?: number;
  /** 值改变时触发 */
  onChange: (value: string) => void;
  /** 动画完成后触发 */
  onComplete?: () => void;
}

/** @description 数值递增动画
 * @param params 动画参数
 * @returns 设置为目标值并停止动画
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiDigitalIncreasingAnimation-递增动画
 */
export const LibPixiDigitalIncreasingAnimation = (
  params: LibPixiDigitalIncreasingAnimationParams
) => {
  const { value, onChange, onComplete, startValue = 0, duration = 4 } = params;

  // 动画递增的目标值
  const animatedValue = { value: startValue };

  // 使用 GSAP 创建递增动画
  gsap.killTweensOf(animatedValue);
  const amountAnimation = gsap.to(animatedValue, {
    value,
    duration,
    ease: "linear",
    onUpdate: () => {
      onChange(libJsNumComma(animatedValue.value, 2));
    },
    onComplete: onComplete,
  });

  return () => {
    amountAnimation.progress(1);
  };
};
