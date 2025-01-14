import type { Container } from "pixi.js";

/** @description 点击容器外或入口按钮时隐藏
 * @param container 容器
 * @param btn 按钮
 * @param onClose 关闭回调
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiOutsideClick-失焦隐藏
 */
export const libPixiOutsideClick = (
  container: Container,
  btn: Container,
  onClose: () => void
) => {
  const outsideClick = (e: PointerEvent) => {
    const btnInside = btn.getBounds().contains(e.clientX, e.clientY);
    const containerInside = container
      .getBounds()
      .contains(e.clientX, e.clientY);

    if (!btnInside && !containerInside && container.visible) {
      onClose();
      window.removeEventListener("pointerdown", outsideClick);
    }
  };
  window.addEventListener("pointerdown", outsideClick);

  return () => {
    window.removeEventListener("pointerdown", outsideClick);
  };
};
