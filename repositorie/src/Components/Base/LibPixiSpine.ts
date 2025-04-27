import { type Container, Assets, Ticker } from "pixi.js";
import { Spine, type Bone } from "@pixi-spine/runtime-3.8";
import gsap from "gsap";
import "pixi-spine";

export interface OnUpdateParams {
  x: number;
  y: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
}
export interface LibPixiSpineParams {
  /** 默认是否可见 */
  visible?: boolean;
  /** 挂点列表 */
  followPointList?: {
    /** 挂点名称 */
    boneName: string;
    /** 跟随的精灵或容器 */
    follow: Container;
    /** 是否启用角度 */
    angleFollow?: boolean;
    /** 是否启用缩放 */
    scaleFollow?: boolean;
    /** 更新回调,不传则接受内置挂点更新 */
    onUpdate?: (config: OnUpdateParams) => void;
  }[];
}

/** @description 自定义 Spine 动画
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSpine-动画
 */
export class LibPixiSpine extends Spine {
  /** 挂点 */
  private _followDots: {
    point: Bone;
    follow: Container;
    angleFollow: boolean;
    scaleFollow: boolean;
    onUpdate?: (config: OnUpdateParams) => void;
  }[] = [];
  /** 是否已开始 */
  private _isStart = false;
  /** spine更新函数 */
  private _loopFn: () => void;

  constructor(spineNameOrTexture: string | any, params?: LibPixiSpineParams) {
    const { followPointList, visible = false } = params || {};

    let spineData;
    if (typeof spineNameOrTexture === "string") {
      spineData = Assets.get(spineNameOrTexture).spineData;
    } else {
      spineData = spineNameOrTexture.spineData;
    }

    super(spineData);
    this.alpha = visible ? 1 : 0;
    this.autoUpdate = false;

    //如果存在挂点
    if (followPointList?.length) {
      followPointList?.forEach((item) => {
        item.follow.alpha = 0;
        this._followDots.push({
          point: this.skeleton.findBone(item.boneName),
          follow: item.follow,
          onUpdate: item.onUpdate,
          angleFollow: item.angleFollow || false,
          scaleFollow: item.scaleFollow === undefined ? true : item.scaleFollow,
        });
      });
    }

    this._loopFn = this._loop.bind(this);
    Ticker.system.add(this._loopFn);
  }

  /** @description 设置动画
   * @param animationName 动画名称
   * @param loop 是否循环播放
   */
  setAnimation(animationName = "animation", loop = false) {
    return new Promise<void>((resolve) => {
      this.state.setAnimation(0, animationName, loop).listener = {
        complete: () => {
          resolve();
        },
      };
      setTimeout(() => {
        this.alpha = 1;
      });
    });
  }

  /** @description 添加动画
   * @param animationName 动画名称
   * @param loop 是否循环播放
   * @param delay 延迟播放时间
   */
  addAnimation(animationName = "animation", loop = false, delay = 0) {
    return new Promise<void>((resolve) => {
      this.state.addAnimation(0, animationName, loop, delay).listener = {
        complete: () => {
          resolve();
        },
      };
    });
  }

  /** @description 改变骨骼数据 */
  setSkin(skinName: string) {
    this.skeleton.setSkinByName(skinName);
  }

  /** @description 销毁动画及挂点 */
  destroyAll() {
    Ticker.system.remove(this._loopFn);
    this.destroy({ children: true });
  }

  /** @description 更新渲染 */
  private _loop() {
    if (this.destroyed) {
      Ticker.system.remove(this._loopFn);
      return;
    }
    this.update(Ticker.system.deltaMS / 1000);
    this._updateFollowPoint();
  }

  /** @description 更新挂点 */
  private _updateFollowPoint() {
    if (this._followDots.length === 0) return;

    this._followDots.forEach((item) => {
      const { worldX: x, worldY: y } = item.point;
      const rotate = item.point.getWorldRotationX() * (Math.PI / 180);
      const scaleX = item.point.getWorldScaleX();
      const scaleY = item.point.getWorldScaleY();

      if (item.onUpdate) {
        item.onUpdate({
          x,
          y,
          rotate,
          scaleX,
          scaleY,
        });
      } else {
        if (item.angleFollow) {
          item.follow.rotation = rotate;
        }
        if (item.scaleFollow) {
          item.follow.scale.set(scaleX, scaleY);
        }
        item.follow.position.set(
          x + 1920 / 2 - item.follow.width / 2,
          y + 1080 / 2 - item.follow.height / 2
        );
      }
    });

    if (!this._isStart) {
      this._isStart = true;
      this._followDots.forEach((item) => {
        gsap.to(item.follow, {
          alpha: 1,
          duration: 0.25,
          delay: 0.15,
        });
      });
    }
  }
}
