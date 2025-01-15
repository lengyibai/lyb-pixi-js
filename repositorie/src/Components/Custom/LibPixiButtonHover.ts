import { Container, Sprite, type Texture } from "pixi.js";
import { libPixiEvent } from "../../Utils/LibPixiEvent";

export interface LibPixiButtonHoverParams {
  /** 图标资源 */
  texture: Texture;
  /** 悬浮图标，type为"texture"时生效 */
  hoverTexture?: Texture;
  /** 默认颜色 */
  tintColor?: string;
  /** 悬浮颜色，默认白色 */
  hoverTintColor?: string;
  /** 置灰颜色 */
  disabledColor?: string;
}

/** @description 悬浮切换材质
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiButtonHover-按钮悬浮
 */
export class LibPixiButtonHover extends Container {
  /** 是否被禁用 */
  private disabled = false;
  /** 按钮 */
  private _btn: Sprite;
  /** 默认材质 */
  private _texture: Texture;
  /** 悬浮材质 */
  private _hoverTexture?: Texture;
  /** 默认颜色 */
  private _tintColor?: string;
  /** 置灰颜色 */
  private _disabledColor: string;

  constructor(params: LibPixiButtonHoverParams) {
    super();

    const {
      texture,
      hoverTexture,
      tintColor,
      hoverTintColor = "#fff",
      disabledColor = "#999",
    } = params;
    this._texture = texture;
    this._hoverTexture = hoverTexture;
    this._tintColor = tintColor;
    this._disabledColor = disabledColor;

    //创建图标
    this._btn = new Sprite(texture);
    this.addChild(this._btn);
    this._btn.anchor.set(0.5);
    tintColor && (this._btn.tint = tintColor);

    libPixiEvent(this._btn, "pointerenter", () => {
      if (this.disabled) return;
      this._btn.tint = hoverTintColor;
      if (this._hoverTexture) {
        this._btn._texture = this._hoverTexture;
      }
    });

    libPixiEvent(this._btn, "pointerleave", () => {
      if (this.disabled) return;
      this._btn._texture = this._texture;
      tintColor && (this._btn.tint = tintColor);
    });
  }

  /** @description 切换材质
   * @param texture 默认材质
   * @param hoverTexture 悬浮材质
   */
  toggleTexture(texture: Texture, hoverTexture: Texture) {
    this._texture = texture;
    this._hoverTexture = hoverTexture;
    this._btn._texture = hoverTexture;
  }

  /** @description 屏蔽
   * @param status 状态
   */
  setDisabled(status: boolean) {
    this.disabled = status;
    this._btn.tint = status ? this._disabledColor : this._tintColor || "#fff";
    this._btn.texture = this._texture;
  }
}
