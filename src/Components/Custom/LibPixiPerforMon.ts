import {
  Text,
  Application,
  Container,
  UPDATE_PRIORITY,
  type IRenderer,
  Ticker,
} from "pixi.js";
import { LibPixiText } from '../Base/LibPixiText';

/** @description 监视帧率、Draw Call、Max Draw Call
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiPerforMon-性能监视器
 */
export class LibPixiPerforMon extends Container {
  /** 数据收集时间间隔 (5秒) */
  private readonly COLLECT_TIME = 5 * 1000;
  /** 当前时间 */
  private _nowTime = 0;
  /** 上次更新的时间 */
  private _lastTime = 0;
  /** 当前绘制调用次数 */
  private _drawCount = 0;
  /** 最大绘制调用次数 */
  private _maxDrawCount = 0;
  /** 临时最大绘制调用次数 */
  private _tempMaxDrawCount = 0;
  /** 上次收集数据的时间 */
  private _lastCollectTime = 0;

  /** 渲染器 */
  private _renderer: IRenderer;

  /** 存储每个性能指标的文本对象 */
  private _paramTxts: Text[] = [];

  /** 原始的 drawElements 方法 */
  private _drawElements: Function;

  constructor(app: Application) {
    super();

    for (let i = 0; i < 3; i++) {
      const txt = new LibPixiText({
        text: "",
        fontWeight: "bold",
        fontSize: 36,
        shadow: ["#000", 45, 3, 5],
        fontColor: "#fff",
      });
      this._paramTxts[i] = txt;
      txt.x = 0;
      txt.y = txt.height * i;
      this.addChild(txt);
      txt.alpha = 0.75;
    }

    this._renderer = app.renderer;
    this._drawElements = (this._renderer as any)["gl"].drawElements;

    this.init();
  }

  /** @description 初始化显示性能数据 */
  init() {
    (this._renderer as any)["gl"].drawElements = (...args: any[]) => {
      this._drawElements.call((this._renderer as any)["gl"], ...args);
      this._drawCount++;
    };

    Ticker.shared.add(() => {
      const fps = Ticker.system.FPS;
      this._nowTime = performance.now();

      if (this._nowTime - this._lastTime >= 100.0) {
        this._setTxtInfo(0, Math.floor(fps).toFixed(0));
        this._lastTime = this._nowTime;
      }

      if (this._nowTime - this._lastCollectTime < this.COLLECT_TIME) {
        if (this._tempMaxDrawCount < this._drawCount) {
          this._tempMaxDrawCount = this._drawCount;
        }
      } else {
        this._maxDrawCount = this._tempMaxDrawCount;
        this._tempMaxDrawCount = 0;
        this._lastCollectTime = this._nowTime;
      }

      this._setTxtInfo(1, this._drawCount);
      this._setTxtInfo(2, this._maxDrawCount);
      this._drawCount = 0;
    }, UPDATE_PRIORITY.UTILITY);
  }

  /** @description 更新文本信息 */
  private _setTxtInfo(p: number, v: any) {
    const fpsColor = (v: number) => {
      this._paramTxts[p].style.fill = "#fff";
      if (v <= 30) {
        this._paramTxts[p].style.fill = "yellow";
      }
      if (v <= 20) {
        this._paramTxts[p].style.fill = "red";
      }
    };
    const drawCallColor = (v: number) => {
      this._paramTxts[p].style.fill = "#fff";
      if (v >= 75) {
        this._paramTxts[p].style.fill = "yellow";
      }
      if (v >= 100) {
        this._paramTxts[p].style.fill = "red";
      }
    };
    const paramMapping: (() => string)[] = [
      () => {
        fpsColor(v);
        return `Fps：${v}`;
      },
      () => {
        drawCallColor(v);
        return `Draw Call：${v}`;
      },
      () => {
        drawCallColor(v);
        return `Max Draw Call：${v}`;
      },
    ];

    this._paramTxts[p].text = paramMapping[p]();
  }
}
