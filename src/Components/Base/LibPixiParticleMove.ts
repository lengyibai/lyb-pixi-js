import { Container, Graphics, ParticleContainer, Ticker } from "pixi.js";
import { Emitter, type EmitterConfigV3 } from "@pixi/particle-emitter";
import gsap from "gsap";
import { LibPixiText } from './LibPixiText';

export interface LibPixiParticleMoveParams {
  /** 粒子JSON资源 */
  json: EmitterConfigV3;
  /** 运动时长 */
  duration: number;
  /** 粒子开始位置 */
  start: { x: number; y: number };
  /** 粒子控制点 */
  control: { x: number; y: number }[];
  /** 粒子结束点 */
  end: { x: number; y: number };
  /** 运动曲线 */
  ease?: gsap.EaseString;
  /** 是否显示控制点，调试使用 */
  showControl?: boolean;
  /** 是否循环，调试使用 */
  loop?: boolean;
}

/** @description 利用贝塞尔曲线实现粒子移动
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiParticleMove-粒子容器
 */
export class LibPixiParticleMove extends Container {
  private _particleContainer: ParticleContainer;

  constructor(params: LibPixiParticleMoveParams) {
    super();

    const {
      start,
      control,
      end,
      json,
      duration,
      ease = "power1.out",
      showControl = false,
      loop = false,
    } = params;

    this._particleContainer = new ParticleContainer();
    this.addChild(this._particleContainer);

    // 初始化粒子发射器
    const flyParticle = new Emitter(this._particleContainer, json);

    // 创建贝塞尔曲线的路径
    const path = this._createBezierPoints(
      [start, ...control, end],
      100,
      showControl
    );

    // 用来控制路径动画的对象
    const flyObj = { pathThrough: 0 };

    gsap.to(flyObj, {
      duration,
      pathThrough: path.length - 1,
      repeat: loop ? -1 : 0,
      ease,
      onStart: () => {
        flyParticle.emit = true;
      },
      onUpdate: () => {
        const i = Math.floor(flyObj.pathThrough);
        const p = path[i];
        flyParticle.updateOwnerPos(p.x, p.y);
      },
      onComplete: () => {
        gsap.to(this, {
          alpha: 0,
          duration: 0.5,
          onComplete: () => {
            flyParticle.emit = false;
            ticker.destroy();
            this.removeFromParent();
          },
        });
      },
    });

    const ticker = new Ticker();
    ticker.add(() => {
      flyParticle.update(1 / 75);
    });
    ticker.start();
  }

  private _createBezierPoints(
    anchorPoints: { x: number; y: number }[],
    pointsAmount: number,
    showControl: boolean
  ) {
    const points: { x: number; y: number }[] = [];

    // 渲染控制点
    if (showControl) {
      anchorPoints.forEach((item, index) => {
        //创建一个小圆点
        const text = new LibPixiText({
          text: index + 1,
          fontSize: 16,
        });
        text.position.set(item.x, item.y);
        this.addChild(text);
      });
    }

    // 计算并存储贝塞尔曲线上的点
    for (let i = 0; i < pointsAmount; i++) {
      const point = this._multiPointBezier(anchorPoints, i / pointsAmount);
      points.push(point);
    }

    return points;
  }

  private _multiPointBezier(points: { x: number; y: number }[], t: number) {
    const len = points.length;
    let x = 0,
      y = 0;

    // 预计算组合数
    const binomials: number[] = [];
    for (let i = 0; i < len; i++) {
      binomials[i] = this._binomial(len - 1, i);
    }

    // 计算贝塞尔曲线上的点
    for (let i = 0; i < len; i++) {
      const point = points[i];
      const binom = binomials[i];
      const factorT = Math.pow(t, i);
      const factor1MinusT = Math.pow(1 - t, len - 1 - i);
      x += point.x * factor1MinusT * factorT * binom;
      y += point.y * factor1MinusT * factorT * binom;
    }

    return { x, y };
  }

  private _binomial(n: number, k: number) {
    if (k === 0 || k === n) return 1;
    let res = 1;
    for (let i = 1; i <= k; i++) {
      res = (res * (n - i + 1)) / i;
    }
    return res;
  }
}
