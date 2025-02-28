import gsap from "gsap";
import type { Sprite } from "pixi.js";
import { libPixiEvent } from "../../Utils/LibPixiEvent";
import { LibPixiContainer } from "../Base/LibPixiContainer";

export interface LibPixiCloseBtnParams {
  /** 按钮素材 */
  sprite: Sprite;
  /** 点击回调 */
  onClick: () => void;
}

/** @description 右上角关闭按钮，支持悬浮旋转动画
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiCloseBtn-关闭按钮
 */
export class LibPixiCloseBtn extends LibPixiContainer {
  constructor(params: LibPixiCloseBtnParams) {
    const { sprite, onClick } = params;

    super(sprite.width, sprite.height);

    this.addChild(sprite);
    sprite.anchor.set(0.5);
    sprite.x = sprite.width / 2;
    sprite.y = sprite.height / 2;

    libPixiEvent(this, "pointerenter", () => {
      gsap.to(sprite, {
        duration: 0.25,
        rotation: 180 * (Math.PI / 180),
      });
    });

    const offLeave = libPixiEvent(this, "pointerleave", () => {
      sprite.alpha = 1;
      gsap.to(sprite, {
        duration: 0.25,
        rotation: 0,
      });
    });

    libPixiEvent(this, "pointerdown", () => {
      sprite.alpha = 0.5;
    });

    libPixiEvent(this, "pointerup", () => {
      onClick();
      offLeave();
    });
  }
}
