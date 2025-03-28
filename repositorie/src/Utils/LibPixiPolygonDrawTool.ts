import {
  Graphics,
  type Application,
  type FederatedPointerEvent,
} from "pixi.js";

export interface LibPixiPolygonDrawToolParams {
  /** 输出的数组内容格式 */
  outFormat?: "object" | "number";
  /** 圆点半径 */
  dotRadius?: number;
  /** 圆点颜色 */
  dotColor?: string | number;
  /** 多边形颜色 */
  polygonColor?: string | number;
  /** 多边形透明度 */
  polygonAlpha?: number;
}

/** @description 多边形绘制工具，绘制时浏览器窗口需要全屏显示，空格键控制开始和结束，开始后鼠标进行点击绘制，退格删除点，空格结束绘制，绘制结果在控制台打印，不满意可再次按空格清空并重新绘制
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiPolygonDrawTool-多边形绘制
 */
export class LibPixiPolygonDrawTool {
  /** App */
  private _app: Application;
  /** 多边形 */
  private _polygon: Graphics;
  /** 是否正在绘制 */
  private _drawing: boolean = false;
  /** 储点的数组 */
  private _points: { x: number; y: number }[] = [];
  /** 起始点 */
  private _startPoint: { x: number; y: number }[] = [];
  /** 实际绘制的点 */
  private _realPoints: { x: number; y: number }[] = [];
  /** 点元素 */
  private _pointElements: Graphics[] = [];
  /** 参数 */
  private _params: Required<LibPixiPolygonDrawToolParams>;

  constructor(app: Application, params: LibPixiPolygonDrawToolParams = {}) {
    this._app = app;
    this._params = {
      outFormat: "number",
      dotRadius: 2,
      dotColor: "#fff",
      polygonColor: "#68CCFF",
      polygonAlpha: 0.5,
      ...params,
    };
    this._app.stage.sortableChildren = true;
    this._polygon = new Graphics();
    this._app.stage.addChild(this._polygon);
    this._polygon.zIndex = 999999;
    this._setupListeners();
  }

  private _setupListeners() {
    // 监听键盘空格键按下事件
    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        this.toggleDrawing();
      } else if (event.code === "Backspace") {
        this._points.pop();
        this._realPoints.pop();
        this._drawPolygon();
      }
    });

    // 监听鼠标点击事件
    this._app.stage.eventMode = "static";
    this._app.stage.on("pointerdown", (event) => {
      if (this._drawing) {
        this._addPoint(event);
      }
    });
  }

  /** @description 控制绘制开始和结束 */
  private toggleDrawing() {
    if (this._drawing) {
      alert("绘制结束");
      this._points.push({ x: 0, y: 0 });

      if (this._params.outFormat === "object") {
        console.log(this._points);
      } else {
        console.log(this._points.map((item) => [item.x, item.y]).flat());
      }
    } else {
      alert("开始绘制");
      this._startPoint = [];
      this._points = [];
      this._realPoints = [];
      this._polygon.clear();
      this._pointElements.forEach((item) => item.destroy());
      this._pointElements = [];
    }
    this._drawing = !this._drawing;
  }

  /** @description 添加点坐标 */
  private _addPoint(event: FederatedPointerEvent) {
    const x = Number(event.clientX.toFixed(0));
    const y = Number(event.clientY.toFixed(0));

    this._realPoints.push({ x, y });

    // 如果是第一个点，记录为原点（0, 0）
    if (this._startPoint.length === 0) {
      this._startPoint = [{ x, y }];
      this._points.push({ x: 0, y: 0 });
    } else {
      // 计算相对于第一个点的偏移
      const offsetX = x - this._startPoint[0].x;
      const offsetY = y - this._startPoint[0].y;

      // 将相对坐标添加到数组
      this._points.push({
        x: Number(offsetX.toFixed(0)),
        y: Number(offsetY.toFixed(0)),
      });
    }

    this._drawPolygon();
  }

  /** @description 绘制多边形 */
  private _drawPolygon() {
    this._polygon.clear();
    this._polygon.beginFill(this._params.polygonColor);
    this._polygon.drawPolygon(this._realPoints);
    this._polygon.endFill();
    this._polygon.alpha = this._params.polygonAlpha;

    //渲染点
    this._pointElements.forEach((point) => point.destroy());
    this._pointElements = [];
    this._realPoints.forEach((point) => {
      this._pointElements.push(this._drawDot(point.x, point.y));
    });
  }

  /** @description 绘制一个点 */
  private _drawDot(x: number, y: number) {
    const pointElement = new Graphics();
    pointElement.beginFill(this._params.dotColor);
    pointElement.drawCircle(x, y, this._params.dotRadius || 2);
    pointElement.endFill();
    this._app.stage.addChild(pointElement);
    pointElement.zIndex = 999999;
    return pointElement;
  }
}
