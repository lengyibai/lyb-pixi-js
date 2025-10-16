import { Container, Graphics, Sprite, type Texture } from "pixi.js";

export interface LibPixiProgressParams {
  /** 背景宽度 */
  bgWidth: number;
  /** 背景高度 */
  bgHeight: number;
  /** 进度条宽度 */
  barWidth: number;
  /** 进度条高度 */
  barHeight: number;
  /** 背景纹理 */
  bgTexture: Texture;
  /** 进度条纹理 */
  barTexture: Texture;
  /** 方向 */
  direction?: "h" | "v";
}

/** @description 通过裁剪的方式显示进度条
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiProgress-进度条
 */
export class LibPixiProgress extends Container {
  /** 光条图 */
  private _progressBar: Sprite;
  /** 蒙版 */
  private _maskGraphics: Graphics;
  /** 方向 */
  private _direction: "h" | "v";

  constructor(params: LibPixiProgressParams) {
    super();

    const { bgWidth, bgHeight, barWidth, barHeight, bgTexture, barTexture, direction } = params;

    this._direction = direction || "h";

    // 背景图
    const background = new Sprite(bgTexture);
    this.addChild(background);

    // 光条图
    this._progressBar = new Sprite(barTexture);
    this.addChild(this._progressBar);
    this._progressBar.x = (bgWidth - barWidth) / 2;
    this._progressBar.y = (bgHeight - barHeight) / 2;

    // 创建蒙版
    const mask = new Graphics();
    mask.beginFill(0xffffff);

    if (direction === "h") {
      mask.drawRect(0, 0, 0, this._progressBar.height);
    } else {
      mask.drawRect(0, 0, this._progressBar.width, 0);
    }
    mask.endFill();
    this._progressBar.addChild(mask);
    this._progressBar.mask = mask;
    this._maskGraphics = mask;
  }

  /** @description 更新进度
   * @param progress 进度值，范围从0到1
   */
  setProgress(progress: number) {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    this._maskGraphics.clear();
    this._maskGraphics.beginFill(0xffffff);

    if (this._direction === "h") {
      this._maskGraphics.drawRect(0, 0, this._progressBar.width * clampedProgress, this._progressBar.height);
    } else {
      this._maskGraphics.drawRect(
        0,
        this._progressBar.height * (1 - clampedProgress),
        this._progressBar.width,
        this._progressBar.height * clampedProgress,
      );
    }

    this._maskGraphics.endFill();
  }
}
