import { Container, ParticleContainer, Ticker } from "pixi.js";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import gsap from "gsap";
import { LibPixiText } from "./LibPixiText";

export interface LibPixiParticleMoveParams {
  /** 粒子JSON资源 */
  container: Container;
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
  /** 是否启用粒子容器 */
  enableParticleContainer?: boolean;
  /** 粒子配置 */
  particleConfig: {
    /** 随机时长 */
    lifetime: {
      /** 最小时长 */
      min: number;
      /** 最大时长 */
      max: number;
    };
    /** 混合模式 */
    blendMode?: string;
    /** 频率，秒/个 */
    frequency?: number;
    /** 透明度变化 */
    alpha?: {
      /** 开始透明度 */
      start: number;
      /** 结束透明度 */
      end: number;
    };
    /** 颜色变化 */
    color?: {
      /** 开始颜色 */
      start: string;
      /** 结束颜色 */
      end: string;
    };
    /** 随机缩放变化 */
    scale?: {
      /** 最小 */
      start: number;
      /** 最大 */
      end: number;
    };
    /** 随机偏移角度变化 */
    rotation?: {
      /** 最小角度 */
      min: number;
      /** 最大角度 */
      max: number;
    };
    /** 随机自身旋转角度变化 */
    rotate?: {
      /** 最小角度 */
      min: number;
      /** 最大角度 */
      max: number;
    };
    /** 移动速度，像素 */
    speed?: {
      /** 开始速度，不能为0，可无限接近0 */
      start: number;
      /** 结束速度，开始速度会衰减到结束速度 */
      end: number;
    };
  };
  /** 头部粒子到达终点后触发，可在此设置隐藏动画，隐藏动画结束后调用 destroy 参数进行销毁 */
  onDestroy?: (destroy: () => void) => void;
}

/** @description 利用贝塞尔曲线实现粒子移动
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiParticleMove-粒子容器
 */
export class LibPixiParticleMove extends Container {
  private _particleContainer: Container | ParticleContainer;

  constructor(params: LibPixiParticleMoveParams) {
    super();

    const {
      start,
      control,
      end,
      container,
      duration,
      ease = "power1.out",
      showControl = false,
      loop = false,
      enableParticleContainer = false,
      particleConfig,
      onDestroy,
    } = params;

    const config = upgradeConfig(
      {
        lifetime: particleConfig.lifetime,
        blendMode: particleConfig.blendMode,
        frequency: particleConfig.frequency || 0.01,
        maxParticles: 1 / (particleConfig.frequency || 0.01),
        alpha: particleConfig.alpha,
        scale: particleConfig.scale,
        color: particleConfig.color,
        startRotation: particleConfig.rotation,
        rotationSpeed: particleConfig.rotate,
        speed: particleConfig.speed,
        pos: {
          x: 0,
          y: 0,
        },
      },
      [container]
    );

    if (enableParticleContainer) {
      this._particleContainer = new ParticleContainer();
    } else {
      this._particleContainer = new Container();
    }
    this.addChild(this._particleContainer);

    // 初始化粒子发射器
    const flyParticle = new Emitter(this._particleContainer, config);

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
      repeatDelay: loop ? 1 : 0,
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
        if (onDestroy) {
          onDestroy(() => {
            flyParticle.emit = false;
            ticker.destroy();
            this.destroy({ children: true });
          });
        } else {
          gsap.to(this, {
            alpha: 0,
            duration: 1,
            onComplete: () => {
              flyParticle.emit = false;
              ticker.destroy();
              this.destroy({ children: true });
            },
          });
        }
      },
    });

    const ticker = new Ticker();
    ticker.add(() => {
      flyParticle.update(ticker.deltaMS / 1000);
    });
    ticker.start();
  }

  /** @description 创建贝塞尔曲线路径点组 */
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
          fontSize: 20,
          stroke: "#000",
          strokeThickness: 1,
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

  /** @description 计算贝塞尔曲线单个路径衔接点 */
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

  /** @description 计算组合数 */
  private _binomial(n: number, k: number) {
    if (k === 0 || k === n) return 1;
    let res = 1;
    for (let i = 1; i <= k; i++) {
      res = (res * (n - i + 1)) / i;
    }
    return res;
  }
}
