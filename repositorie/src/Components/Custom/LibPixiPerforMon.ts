import {
  type IRenderer,
  type Application,
  Container,
  Ticker,
  UPDATE_PRIORITY,
} from "pixi.js";
import { LibPixiRectBgColor } from "../Base/LibPixiRectBgColor";
import { LibPixiText } from "../Base/LibPixiText";

/** @description 监视帧率、Draw Call、Max Draw Call
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiPerforMon-性能监视器
 */
export class LibPixiPerforMon extends Container {
  /** 当前适配模式 */
  static ADAPT_MODE: "h" | "v" | "hv" = "hv";

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

  /** 整体宽度 */
  private _containerWidth = 590;
  /** 整体高度 */
  private _containerHeight = 50;

  /** 渲染器 */
  private _renderer: IRenderer;

  /** 原始的 drawElements 方法 */
  private _drawElements: Function;

  /** 背景 */
  private _bg: LibPixiRectBgColor;
  /** FPS文本 */
  private _fpsText: TextBox;
  /** Draw Call文本 */
  private _drawCallText: TextBox;
  /** Max Draw Call文本 */
  private _maxDrawCallText: TextBox;

  constructor(app: Application) {
    super();

    this.pivot.x = this._containerWidth / 2;

    //创建背景
    this._bg = new LibPixiRectBgColor({
      width: this._containerWidth,
      height: this._containerHeight,
      bgColor: "#000",
      alpha: 0.75,
    });
    this.addChild(this._bg);

    //创建内容容器
    const content = new Container();
    this.addChild(content);
    content.x = 25;
    content.y = this._containerHeight / 2;

    //创建FPS文本
    this._fpsText = new TextBox("FPS");
    content.addChild(this._fpsText);

    //创建Draw Call文本
    this._drawCallText = new TextBox("Draw Call");
    content.addChild(this._drawCallText);
    this._drawCallText.x = 125;

    //创建Max Draw Call文本
    this._maxDrawCallText = new TextBox("Max Draw Call");
    content.addChild(this._maxDrawCallText);
    this._maxDrawCallText.x = 320;

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
        this._setTextInfo("fps", Number(Math.floor(fps).toFixed(0)));
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

      this._setTextInfo("drawCall", this._drawCount);
      this._setTextInfo("maxDrawCall", this._maxDrawCount);
      this._drawCount = 0;
    }, UPDATE_PRIORITY.UTILITY);
  }

  /** @description 更新文本信息 */
  private _setTextInfo(p: string, v: number) {
    const textObj: Record<string, TextBox> = {
      fps: this._fpsText,
      drawCall: this._drawCallText,
      maxDrawCall: this._maxDrawCallText,
    };
    const textBox = textObj[p];
    textBox.updateValue(v);

    if (p === "fps") {
      textBox.updateColor(this.getFpsColor(v));
    } else {
      textBox.updateColor(this.getDrawCallColor(v));
    }
  }

  /** @description 获取FPS颜色 */
  getFpsColor(v: number) {
    let color = "#00ff04";
    if (v < 30) {
      color = "#ffd20a";
    }
    if (v < 20) {
      color = "#ff000d";
    }
    return color;
  }

  /** @description 获取Draw Call颜色 */
  getDrawCallColor(v: number) {
    let color = "#00ff04";
    if (v >= 75) {
      color = "#ffd20a";
    }
    if (v >= 100) {
      color = "#ff000d";
    }
    return color;
  }
}

class TextBox extends Container {
  /** @description 数值 */
  private _valueText: LibPixiText;

  constructor(text: string, fontSize = 26) {
    super();

    const label = new LibPixiText({
      text,
      fontSize,
      fontWeight: "bold",
    });
    this.addChild(label);
    label.anchor.y = 0.5;

    this._valueText = new LibPixiText({
      text: "0",
      fontSize,
      fontWeight: "bold",
    });
    this.addChild(this._valueText);
    this._valueText.anchor.y = 0.5;
    this._valueText.x = label.width + 10;
  }

  /** @description 更改颜色 */
  updateColor(color: string) {
    this._valueText.style.fill = color;
  }

  /** @description 设置数值 */
  updateValue(value: number) {
    this._valueText.text = value;
  }
}
