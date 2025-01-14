import { Container, Sprite, type Texture } from "pixi.js";
import { libPixiEvent } from "../../../Utils/LibPixiEvent";

export interface LibPixiButtonHoverParams {
  /** 图标资源 */
  texture: Texture;
  /** 悬浮图标 */
  hoverTexture: Texture;
  /** 染色 */
  tintColor?: string;
}

/** @description 悬浮切换材质
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiButtonHover-按钮悬浮
 */
export class LibPixiButtonHover extends Container {
  /** 按钮 */
  private _btn: Sprite;
  /** 默认材质 */
  private _texture: Texture;
  /** 悬浮材质 */
  private _hoverTexture: Texture;
  /** 染色 */
  private _tintColor?: string;

  constructor(params: LibPixiButtonHoverParams) {
    super();

    const { texture, hoverTexture, tintColor } = params;
    this._texture = texture;
    this._hoverTexture = hoverTexture;
    this._tintColor = tintColor;

    //创建图标容器
    const iconBox = new Container();
    this.addChild(iconBox);

    //创建图标
    this._btn = new Sprite(texture);
    iconBox.addChild(this._btn);
    tintColor && (this._btn.tint = tintColor);

    libPixiEvent(iconBox, "pointerenter", () => {
      this._btn._texture = this._hoverTexture;
      this._btn.tint = "#fff";
    });

    libPixiEvent(iconBox, "pointerleave", () => {
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
    this._btn.tint = status ? "#7C7C7C" : this._tintColor || "#fff";
  }
}
