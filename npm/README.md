# Lib 自用 PixiJS 组件与工具库

## 介绍

`lyb-pixi-js` 是一个偏项目实战型的 PixiJS 组件与工具集合，覆盖文本、图形、滚动容器、表格、动画、交互、布局、音频、弹窗管理等常见场景。

这份 README 的目标不是写成一份冗长的源码手册，而是让你快速知道：

- 怎么安装
- 怎么按需导入
- 每个模块大概解决什么问题
- 最常见的调用方式是什么

更完整的参数说明、类型约束和 JSDoc，请直接查看 `npm` 产物中的 `.d.ts`，或在编辑器里通过 TypeScript 提示查看。

## 安装

```bash
npm install lyb-pixi-js
```

```bash
pnpm add lyb-pixi-js
```

```bash
yarn add lyb-pixi-js
```

## 起步

### 1. 按需导入

当前包导出以按需导入为主，推荐直接从以下三个分类路径导入：

- `lyb-pixi-js/Components/Base/*`
- `lyb-pixi-js/Components/Custom/*`
- `lyb-pixi-js/Utils/*`

```ts
import { LibPixiText } from "lyb-pixi-js/Components/Base/LibPixiText";
import { LibPixiRectBgColor } from "lyb-pixi-js/Components/Base/LibPixiRectBgColor";
import { libPixiEvent } from "lyb-pixi-js/Utils/LibPixiEvent";

const title = new LibPixiText({
  text: "Hello Pixi",
  fontSize: 42,
  fontColor: "#ffffff",
});

const panel = new LibPixiRectBgColor({
  width: 320,
  height: 120,
  bgColor: "#1f2937",
  radius: 16,
});

libPixiEvent(panel, "pointertap", () => {
  console.log("panel clicked");
});

app.stage.addChild(panel, title);
```

### 2. 项目内二次封装

如果同一批组件和工具会在多个文件重复使用，建议在项目内做一次聚合导出。

```ts
// utils/pixi.ts
export * from "lyb-pixi-js/Components/Base/LibPixiText";
export * from "lyb-pixi-js/Components/Custom/LibPixiSlide";
export * from "lyb-pixi-js/Utils/LibPixiAudio";
export * from "lyb-pixi-js/Utils/LibPixiEvent";
```

```ts
// page.ts
import {
  LibPixiText,
  LibPixiSlide,
  LibPixiAudio,
  libPixiEvent,
} from "./utils/pixi";
```

### 3. 关于整库导入

README 不再主推 `import { LibPixiJs } from "lyb-pixi-js"` 这类整库入口写法。当前 `package.json` 的 `exports` 以按需导出为准，复制示例时请优先使用本 README 中的真实路径。

## 使用说明

### 环境说明

- 大部分组件和工具默认运行在 PixiJS 场景中。
- 部分模块依赖浏览器环境，例如 `LibPixiInput`、`LibPixiDragLocate`、`LibPixiPolygonDrawTool`。
- 涉及音频、Spine、粒子、GSAP 的模块，需要你在项目里准备好对应资源与运行时环境。

### 阅读方式

每个章节基本遵循同一结构：

1. 一句话说明用途
2. 给出真实导入路径
3. 给出 1 个最常用示例

如果你想快速查参数，优先看 `.d.ts` 类型定义，比 README 更准确。

## 目录

### Components/Base

- [LibPixiText-文本](#libpixitext-文本)
- [LibPixiHtmlText-富文本](#libpixihtmltext-富文本)
- [LibPixiBit-位图文本](#libpixibit-位图文本)
- [LibPixiBitText-位图文本工厂](#libpixibittext-位图文本工厂)
- [LibPixiContainer-容器](#libpixicontainer-容器)
- [LibPixiRectBgColor-带背景色矩形](#libpixirectbgcolor-带背景色矩形)
- [LibPixiRectangle-矩形](#libpixirectangle-矩形)
- [LibPixiCircular-圆形](#libpixicircular-圆形)
- [LibPixiPolygon-多边形](#libpixipolygon-多边形)
- [LibPixiArc-弧形](#libpixiarc-弧形)
- [LibPixiOval-椭圆](#libpixioval-椭圆)
- [LibPixiRound-圆圈](#libpixiround-圆圈)
- [LibPixiRoundedRect-圆角矩形](#libpixiroundedrect-圆角矩形)
- [LibPixiTriangle-三角形](#libpixitriangle-三角形)
- [LibPixiSpine-动画](#libpixispine-动画)
- [LibPixiParticleMove-粒子容器](#libpixiparticlemove-粒子容器)

### Components/Custom

- [LibPixiAreaClick-扩大点击范围](#libpixiareaclick-扩大点击范围)
- [LibPixiArrangeLinearV2-线性排列](#libpixiarrangelinearv2-线性排列)
- [LibPixiButtonHover-按钮悬浮](#libpixibuttonhover-按钮悬浮)
- [LibPixiCapsule-胶囊形](#libpixicapsule-胶囊形)
- [LibPixiCloseBtn-关闭按钮](#libpixiclosebtn-关闭按钮)
- [LibPixiDragLocate-元素拖拽定位](#libpixidraglocate-元素拖拽定位)
- [LibPixiDrawer-抽屉](#libpixidrawer-抽屉)
- [LibPixiGridColumnLayout-网格列布局](#libpixigridcolumnlayout-网格列布局)
- [LibPixiGridRowLayout-网格行布局](#libpixigridrowlayout-网格行布局)
- [LibPixiHeadingParagraphLayout-标题段落布局](#libpixiheadingparagraphlayout-标题段落布局)
- [LibPixiInput-输入框](#libpixiinput-输入框)
- [LibPixiLabelValue-标签值布局](#libpixilabelvalue-标签值布局)
- [LibPixiMaskBg-全屏黑色蒙版](#libpiximaskbg-全屏黑色蒙版)
- [LibPixiNoticeBar-滚动通知栏](#libpixinoticebar-滚动通知栏)
- [LibPixiPerforMon-性能监视器](#libpixiperformon-性能监视器)
- [LibPixiProgress-进度条](#libpixiprogress-进度条)
- [LibPixiPuzzleBg-设计图背景拼接](#libpixipuzzlebg-设计图背景拼接)
- [LibPixiScrollContainerX-X 轴滚动容器](#libpixiscrollcontainerx-x-轴滚动容器)
- [LibPixiScrollContainerY-Y 轴滚动容器](#libpixiscrollcontainery-y-轴滚动容器)
- [LibPixiScrollNum-数字滑动](#libpixiscrollnum-数字滑动)
- [LibPixiSlide-滑动页](#libpixislide-滑动页)
- [LibPixiSlider-横向滑动图](#libpixislider-横向滑动图)
- [LibPixiTable-简易表格](#libpixitable-简易表格)
- [LibPixiTableV2-自定义表格](#libpixitablev2-自定义表格)
- [LibPixiTextGroupWrap-文本组换行](#libpixitextgroupwrap-文本组换行)
- [LibPixiTurntable-转盘布局](#libpixiturntable-转盘布局)

### Utils

- [libContainerCenter-父容器居中](#libcontainercenter-父容器居中)
- [libControlledDelayedCall-可控延迟调用](#libcontrolleddelayedcall-可控延迟调用)
- [LibPixiAudio-音频播放器](#libpixiaudio-音频播放器)
- [libPixiCreateNineGrid-九宫格图](#libpixicreateninegrid-九宫格图)
- [LibPixiDigitalIncreasingAnimation-递增动画](#libpixidigitalincreasinganimation-递增动画)
- [LibPixiDownScaleAnimation-按下放大](#libpixidownscaleanimation-按下放大)
- [LibPixiEmitContainerEvent-触发后代监听](#libpixiemitcontainerevent-触发后代监听)
- [libPixiEvent-事件注册](#libpixievent-事件注册)
- [libPixiFilter-滤镜](#libpixifilter-滤镜)
- [LibPixiGlobalUpdater-事件实例汇总](#libpixiglobalupdater-事件实例汇总)
- [LibPixiGridLayout-网格布局](#libpixigridlayout-网格布局)
- [libPixiHVCenter-列表居中](#libpixihvcenter-列表居中)
- [libPixiHVGap-列表间距](#libpixihvgap-列表间距)
- [libPixiIntervalTrigger-间隔触发](#libpixiintervaltrigger-间隔触发)
- [libPixiIsOutOfView-离开可视区检测](#libpixiisoutofview-离开可视区检测)
- [libPixiLocalBoundary-本地边界坐标](#libpixilocalboundary-本地边界坐标)
- [libPixiOutsideClick-失焦隐藏](#libpixioutsideclick-失焦隐藏)
- [libPixiOverflowHidden-溢出裁剪](#libpixioverflowhidden-溢出裁剪)
- [libPixiPivot-容器锚点设置](#libpixipivot-容器锚点设置)
- [LibPixiPolygonDrawTool-多边形绘制工具](#libpixipolygondrawtool-多边形绘制工具)
- [libPixiPromiseTickerTimeout-TickerPromise 定时器](#libpixipromisetickertimeout-tickerpromise-定时器)
- [libPixiScaleContainer-超出缩放](#libpixiscalecontainer-超出缩放)
- [libPixiShadow-阴影](#libpixishadow-阴影)
- [LibPixiSlideInput-滑块输入](#libpixislideinput-滑块输入)
- [LibPixiTicker-Ticker 管理器](#libpixiticker-ticker-管理器)
- [libPixiTickerTimeout-Ticker 定时器](#libpixitickertimeout-ticker-定时器)
- [LibPixiDialogManager-弹窗管理器](#libpixidialogmanager-弹窗管理器)

## Components/Base

### LibPixiText-文本

自定义文本类，适合普通 Pixi 文本展示。

```ts
import { LibPixiText } from "lyb-pixi-js/Components/Base/LibPixiText";
```

```ts
const text = new LibPixiText({
  text: "Hello World",
  fontSize: 42,
  fontColor: "#ffffff",
  stroke: "#111827",
  strokeThickness: 4,
  align: "center",
  shadow: ["#000000", 45, 4, 2],
});

app.stage.addChild(text);
```

常用参数：

```ts
interface LibPixiTextParams {
  text: string | number;
  fontSize?: number;
  fontColor?: any;
  gradientDirection?: "v" | "h";
  stroke?: string | number;
  strokeThickness?: number;
  fontFamily?: string;
  fontWeight?: TextStyleFontWeight;
  wordWrapWidth?: number;
  lineHeight?: number;
  align?: TextStyleAlign;
  indent?: number;
  shadow?: [string, number, number, number];
  breakWord?: boolean;
}
```

### LibPixiHtmlText-富文本

基于 `HTMLText` 的富文本组件，适合混排与局部样式。

```ts
import { LibPixiHtmlText } from "lyb-pixi-js/Components/Base/LibPixiHtmlText";
```

```ts
const htmlText = new LibPixiHtmlText({
  text: `<span style="color:#f59e0b">Gold</span> x 100`,
  fontSize: 36,
  fontColor: "#ffffff",
});

app.stage.addChild(htmlText);
```

### LibPixiBit-位图文本

对 `BitmapText` 的简化封装，适合固定字号的位图字。

```ts
import { LibPixiBit } from "lyb-pixi-js/Components/Base/LibPixiBit";
```

```ts
const score = new LibPixiBit("ScoreFont", "999", 48);
app.stage.addChild(score);
```

### LibPixiBitText-位图文本工厂

用于复用同一位图字体，按需创建多个 `BitmapText`。

```ts
import { LibPixiBitText } from "lyb-pixi-js/Components/Base/LibPixiBitText";
```

```ts
const bitFactory = new LibPixiBitText("ScoreFont", 32);
const score = bitFactory.createText("1280");
const combo = bitFactory.createText("Combo x3", 24);

app.stage.addChild(score, combo);
```

### LibPixiContainer-容器

带尺寸与背景色能力的容器基类，适合做占位、点击区域和布局容器。

```ts
import { LibPixiContainer } from "lyb-pixi-js/Components/Base/LibPixiContainer";
```

```ts
const box = new LibPixiContainer(400, 220, "#0f172a");
app.stage.addChild(box);
```

### LibPixiRectBgColor-带背景色矩形

带圆角、透明度等配置的矩形底板，常用于按钮底、面板底、遮罩块。

```ts
import { LibPixiRectBgColor } from "lyb-pixi-js/Components/Base/LibPixiRectBgColor";
```

```ts
const panel = new LibPixiRectBgColor({
  width: 320,
  height: 120,
  bgColor: "#1d4ed8",
  alpha: 0.9,
  radius: 16,
});

app.stage.addChild(panel);
```

### LibPixiRectangle-矩形

更轻量的矩形图形，适合做点击热区或调试定位。

```ts
import { LibPixiRectangle } from "lyb-pixi-js/Components/Base/LibPixiRectangle";
```

```ts
const hitArea = new LibPixiRectangle(200, 80, "#ff0000");
hitArea.alpha = 0.2;
app.stage.addChild(hitArea);
```

### LibPixiCircular-圆形

快速创建纯色圆形。

```ts
import { LibPixiCircular } from "lyb-pixi-js/Components/Base/LibPixiCircular";
```

```ts
const dot = new LibPixiCircular(12, "#22c55e");
app.stage.addChild(dot);
```

### LibPixiPolygon-多边形

用于不规则多边形绘制，也常拿来做不规则点击区域。

```ts
import { LibPixiPolygon } from "lyb-pixi-js/Components/Base/LibPixiPolygon";
```

```ts
const polygon = new LibPixiPolygon(
  [
    0, 0,
    120, 0,
    150, 60,
    80, 120,
    0, 90,
  ],
  "#f97316"
);

app.stage.addChild(polygon);
```

### LibPixiArc-弧形

用于绘制弧线或扇形区域。

```ts
import { LibPixiArc } from "lyb-pixi-js/Components/Base/LibPixiArc";
```

```ts
const arc = new LibPixiArc({
  start: 0,
  end: Math.PI * 1.2,
  radius: 80,
  color: "#38bdf8",
  thickness: 8,
});

app.stage.addChild(arc);
```

### LibPixiOval-椭圆

快速创建椭圆图形。

```ts
import { LibPixiOval } from "lyb-pixi-js/Components/Base/LibPixiOval";
```

```ts
const oval = new LibPixiOval(200, 100, "#a855f7");
app.stage.addChild(oval);
```

### LibPixiRound-圆圈

快速创建描边圆圈。

```ts
import { LibPixiRound } from "lyb-pixi-js/Components/Base/LibPixiRound";
```

```ts
const ring = new LibPixiRound(6, 60, "#facc15");
app.stage.addChild(ring);
```

### LibPixiRoundedRect-圆角矩形

快速创建纯色圆角矩形。

```ts
import { LibPixiRoundedRect } from "lyb-pixi-js/Components/Base/LibPixiRoundedRect";
```

```ts
const rounded = new LibPixiRoundedRect(260, 100, 20, "#111827");
app.stage.addChild(rounded);
```

### LibPixiTriangle-三角形

快速创建三角形图形。

```ts
import { LibPixiTriangle } from "lyb-pixi-js/Components/Base/LibPixiTriangle";
```

```ts
const triangle = new LibPixiTriangle(
  [
    [0, 0],
    [100, 60],
  ],
  "#ef4444"
);

app.stage.addChild(triangle);
```

### LibPixiSpine-动画

自定义 Spine 动画封装，支持动画播放、换皮和挂点跟随。

```ts
import { LibPixiSpine } from "lyb-pixi-js/Components/Base/LibPixiSpine";
import { Assets, Container } from "pixi.js";
```

```ts
const weapon = new Container();

const spine = new LibPixiSpine(Assets.get("heroSpine"), {
  followPointList: [
    {
      boneName: "hand_r",
      follow: weapon,
      angleFollow: true,
      scaleFollow: true,
    },
  ],
});

await spine.setAnimation("appear");
await spine.addAnimation("idle", true);
spine.setSkin("default");

app.stage.addChild(spine);
```

常用参数：

```ts
interface OnUpdateParams {
  x: number;
  y: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
}

interface LibPixiSpineParams {
  visible?: boolean;
  followPointList?: {
    boneName: string;
    follow: Container;
    angleFollow?: boolean;
    scaleFollow?: boolean;
    onUpdate?: (config: OnUpdateParams) => void;
  }[];
}
```

### LibPixiParticleMove-粒子容器

利用贝塞尔曲线驱动粒子沿路径飞行，适合拖尾、抛物线奖励、路径特效。

```ts
import { LibPixiParticleMove } from "lyb-pixi-js/Components/Base/LibPixiParticleMove";
import { Assets } from "pixi.js";
import gsap from "gsap";
```

```ts
const particleMove = new LibPixiParticleMove({
  start: { x: 0, y: 720 },
  control: [
    { x: 600, y: 200 },
    { x: 900, y: 300 },
  ],
  end: { x: 1280, y: 80 },
  container: Assets.get("flyParticle"),
  duration: 1.2,
  ease: "power1.inOut",
  particleConfig: {
    frequency: 0.002,
    lifetime: { min: 0.2, max: 0.8 },
    alpha: { start: 1, end: 0 },
    color: { start: "#fff7ae", end: "#fb7185" },
    scale: { start: 1.2, end: 2 },
    speed: { start: 50, end: 0.1 },
  },
  onDestroy: (destroy) => {
    gsap.to(particleMove, {
      alpha: 0,
      duration: 0.2,
      onComplete: destroy,
    });
  },
});

app.stage.addChild(particleMove);
```

常用参数：

```ts
interface LibPixiParticleMoveParams {
  container: Container;
  duration: number;
  start: { x: number; y: number };
  control: { x: number; y: number }[];
  end: { x: number; y: number };
  ease?: gsap.EaseString;
  showControl?: boolean;
  loop?: boolean;
  enableParticleContainer?: boolean;
  particleConfig: {
    lifetime: { min: number; max: number };
    blendMode?: string;
    frequency?: number;
    alpha?: { start: number; end: number };
    color?: { start: string; end: string };
    scale?: { start: number; end: number };
    rotation?: { min: number; max: number };
    rotate?: { min: number; max: number };
    speed?: { start: number; end: number };
  };
  onDestroy?: (destroy: () => void) => void;
}
```

## Components/Custom

### LibPixiAreaClick-扩大点击范围

当视觉元素很小或存在透明边距时，用它扩大点击热区。

```ts
import { LibPixiAreaClick } from "lyb-pixi-js/Components/Custom/LibPixiAreaClick";
```

```ts
const area = new LibPixiAreaClick(120, 120);
area.push(closeIcon);
app.stage.addChild(area);
```

### LibPixiArrangeLinearV2-线性排列

面向容器列表的线性排列组件，支持横向、纵向、列数和间距。

```ts
import { LibPixiArrangeLinearV2 } from "lyb-pixi-js/Components/Custom/LibPixiArrangeLinearV2";
```

```ts
const layout = new LibPixiArrangeLinearV2({
  direction: "x",
  gap: 20,
  colNum: 3,
  elementList: rewardList,
});

app.stage.addChild(layout);
```

### LibPixiButtonHover-按钮悬浮

提供纹理切换与色彩状态切换的按钮容器。

```ts
import { LibPixiButtonHover } from "lyb-pixi-js/Components/Custom/LibPixiButtonHover";
import { Texture } from "pixi.js";
```

```ts
const button = new LibPixiButtonHover({
  texture: Texture.from("btn-normal.png"),
  hoverTexture: Texture.from("btn-hover.png"),
  tintColor: "#ffffff",
  hoverTintColor: "#fde68a",
  disabledColor: "#94a3b8",
});

button.setDisabled(false);
app.stage.addChild(button);
```

### LibPixiCapsule-胶囊形

适合做圆角按钮底或标签底板。

```ts
import { LibPixiCapsule } from "lyb-pixi-js/Components/Custom/LibPixiCapsule";
```

```ts
const capsule = new LibPixiCapsule(220, 64, "#2563eb");
app.stage.addChild(capsule);
```

### LibPixiCloseBtn-关闭按钮

适合放在弹窗右上角，支持点击关闭和悬浮旋转效果。

```ts
import { LibPixiCloseBtn } from "lyb-pixi-js/Components/Custom/LibPixiCloseBtn";
import { Sprite, Texture } from "pixi.js";
```

```ts
const closeBtn = new LibPixiCloseBtn({
  sprite: new Sprite(Texture.from("close.png")),
  onClick: () => {
    dialog.visible = false;
  },
});

app.stage.addChild(closeBtn);
```

### LibPixiDragLocate-元素拖拽定位

开发期定位工具，可搜索组件类名或 `name` 并拖拽调整位置。

```ts
import { LibPixiDragLocate } from "lyb-pixi-js/Components/Custom/LibPixiDragLocate";
```

```ts
LibPixiDragLocate.stage = app.stage;
const dragLocate = new LibPixiDragLocate();
app.stage.addChild(dragLocate);
```

### LibPixiDrawer-抽屉

底部抽屉容器，适合弹出面板、筛选器和操作栏。

```ts
import { LibPixiDrawer } from "lyb-pixi-js/Components/Custom/LibPixiDrawer";
import { Container } from "pixi.js";
```

```ts
const content = new Container();
const drawer = new LibPixiDrawer(content);

app.stage.addChild(drawer);
```

### LibPixiGridColumnLayout-网格列布局

按列优先布局元素，常用于纵向填充后换列。

```ts
import { LibPixiGridColumnLayout } from "lyb-pixi-js/Components/Custom/LibPixiGridColumnLayout";
```

```ts
const layout = new LibPixiGridColumnLayout({
  rowNum: 4,
  colGap: 16,
  rowGap: 12,
  elementList: itemList,
});
```

### LibPixiGridRowLayout-网格行布局

按行优先布局元素，常用于横向填充后换行。

```ts
import { LibPixiGridRowLayout } from "lyb-pixi-js/Components/Custom/LibPixiGridRowLayout";
```

```ts
const layout = new LibPixiGridRowLayout({
  colNum: 5,
  colGap: 16,
  rowGap: 12,
  elementList: itemList,
});
```

### LibPixiHeadingParagraphLayout-标题段落布局

适合渲染一段由标题和正文构成的说明文案。

```ts
import { LibPixiHeadingParagraphLayout } from "lyb-pixi-js/Components/Custom/LibPixiHeadingParagraphLayout";
```

```ts
const article = new LibPixiHeadingParagraphLayout({
  width: 600,
  textList: [
    { type: "h", text: "隐私政策" },
    { type: "p", text: "这里放正文内容。" },
  ],
});

app.stage.addChild(article);
```

### LibPixiInput-输入框

基于浏览器原生输入框实现的 Pixi 输入组件。

```ts
import { LibPixiInput } from "lyb-pixi-js/Components/Custom/LibPixiInput";
```

```ts
const input = new LibPixiInput({
  width: 320,
  height: 60,
  fontSizeRatio: 0.5,
  placeholder: "请输入昵称",
});

app.stage.addChild(input);
```

### LibPixiLabelValue-标签值布局

适合左侧标签、右侧动态数值的并排展示。

```ts
import { LibPixiLabelValue } from "lyb-pixi-js/Components/Custom/LibPixiLabelValue";
import { LibPixiText } from "lyb-pixi-js/Components/Base/LibPixiText";
```

```ts
const label = new LibPixiText({ text: "金币", fontSize: 28, fontColor: "#94a3b8" });
const value = new LibPixiText({ text: "1280", fontSize: 36, fontColor: "#facc15" });

const labelValue = new LibPixiLabelValue({
  label,
  value,
  gap: 12,
});

app.stage.addChild(labelValue);
```

### LibPixiMaskBg-全屏黑色蒙版

快速生成全屏黑色蒙版，适合弹窗背景与转场遮罩。

```ts
import { LibPixiMaskBg } from "lyb-pixi-js/Components/Custom/LibPixiMaskBg";
```

```ts
LibPixiMaskBg.stage = app.stage;
LibPixiMaskBg.bgAlpha = 0.6;

const maskBg = new LibPixiMaskBg();
app.stage.addChild(maskBg);
```

### LibPixiNoticeBar-滚动通知栏

让多条文本在固定区域内依次滚动展示。

```ts
import { LibPixiNoticeBar } from "lyb-pixi-js/Components/Custom/LibPixiNoticeBar";
import { LibPixiText } from "lyb-pixi-js/Components/Base/LibPixiText";
```

```ts
const noticeBar = new LibPixiNoticeBar({
  width: 600,
  height: 52,
  speed: 120,
  onVisable: (v) => {
    console.log("当前是否有内容在显示", v);
  },
});

noticeBar.addText(
  new LibPixiText({ text: "系统公告 1", fontSize: 24, fontColor: "#fff" }),
  new LibPixiText({ text: "系统公告 2", fontSize: 24, fontColor: "#fff" })
);

app.stage.addChild(noticeBar);
```

### LibPixiPerforMon-性能监视器

监视帧率、Draw Call 和 Max Draw Call，适合开发调试阶段。

```ts
import { LibPixiPerforMon } from "lyb-pixi-js/Components/Custom/LibPixiPerforMon";
```

```ts
const monitor = new LibPixiPerforMon(app);
app.stage.addChild(monitor);
```

### LibPixiProgress-进度条

通过裁剪贴图显示进度，适合资源加载条和血条。

```ts
import { LibPixiProgress } from "lyb-pixi-js/Components/Custom/LibPixiProgress";
import { Texture } from "pixi.js";
```

```ts
const progress = new LibPixiProgress({
  bgWidth: 400,
  bgHeight: 24,
  barWidth: 400,
  barHeight: 24,
  bgTexture: Texture.from("progress-bg.png"),
  barTexture: Texture.from("progress-bar.png"),
});

progress.setProgress(0.65);
app.stage.addChild(progress);
```

### LibPixiPuzzleBg-设计图背景拼接

将设计图作为覆盖层铺在舞台上，方便做像素级对齐。

```ts
import { LibPixiPuzzleBg } from "lyb-pixi-js/Components/Custom/LibPixiPuzzleBg";
import { Texture } from "pixi.js";
```

```ts
const puzzleBg = new LibPixiPuzzleBg(Texture.from("design.png"));
app.stage.addChild(puzzleBg);
```

### LibPixiScrollContainerX-X 轴滚动容器

横向滚动容器，支持拖动、滚轮、惯性与回弹。

```ts
import { LibPixiScrollContainerX } from "lyb-pixi-js/Components/Custom/LibPixiScrollContainerX";
import { Container } from "pixi.js";
```

```ts
const content = new Container();
const scrollX = new LibPixiScrollContainerX({
  width: 800,
  height: 200,
  scrollContent: content,
});

app.stage.addChild(scrollX);
```

### LibPixiScrollContainerY-Y 轴滚动容器

纵向滚动容器，适合长列表与说明面板。

```ts
import { LibPixiScrollContainerY } from "lyb-pixi-js/Components/Custom/LibPixiScrollContainerY";
import { Container } from "pixi.js";
```

```ts
const content = new Container();
const scrollY = new LibPixiScrollContainerY({
  width: 420,
  height: 560,
  scrollContent: content,
});

app.stage.addChild(scrollY);
```

### LibPixiScrollNum-数字滑动

通过滑动数字列来做数字选择器。

```ts
import { LibPixiScrollNum } from "lyb-pixi-js/Components/Custom/LibPixiScrollNum";
import { Container } from "pixi.js";
```

```ts
const numberList = new Container();
const picker = new LibPixiScrollNum({
  width: 220,
  height: 320,
  pageHeight: 64,
  content: numberList,
  pageNum: 10,
  slideCallback: (index) => {
    console.log("选中了", index);
  },
});

app.stage.addChild(picker);
```

### LibPixiSlide-滑动页

这是更通用的滑动页组件，支持横向、纵向、循环和景深回调。

```ts
import { LibPixiSlide } from "lyb-pixi-js/Components/Custom/LibPixiSlide";
import { Container } from "pixi.js";
```

```ts
const content = new Container();
const itemList: Container[] = [page1, page2, page3];

const slide = new LibPixiSlide({
  stage: app.stage,
  direction: "x",
  width: 600,
  height: 280,
  pageWidth: 220,
  content,
  itemList,
  loop: true,
  slideCallback: (index) => {
    console.log("当前页", index);
  },
  depthCallback(container, getValue) {
    container.alpha = getValue(0.4);
    container.scale.set(getValue(0.12));
  },
});

app.stage.addChild(slide);
```

常用参数：

```ts
interface LibPixiSlideParams {
  stage: Container;
  direction: "x" | "y";
  width: number;
  height: number;
  pageWidth?: number;
  pageHeight?: number;
  content: Container;
  itemList: Container[];
  loop?: boolean;
  depthCallback?: (
    container: Container,
    getValue: (depthAtten: number) => number
  ) => void;
  slideCallback?: (index: number) => void;
  scrollCallback?: (x: number, index: number) => void;
}
```

### LibPixiSlider-横向滑动图

类似轮播图，但默认不做自动播放。

```ts
import { LibPixiSlider } from "lyb-pixi-js/Components/Custom/LibPixiSlider";
```

```ts
const slider = new LibPixiSlider({
  width: 500,
  height: 280,
  slideList: [page1, page2, page3],
  loop: true,
  enableDepth: true,
  slideCallback: (pageIndex, pageNum) => {
    console.log(`${pageIndex + 1} / ${pageNum + 1}`);
  },
});

app.stage.addChild(slider);
slider.next();
```

### LibPixiTable-简易表格

快速绘制基于文本的简单表格。

```ts
import { LibPixiTable } from "lyb-pixi-js/Components/Custom/LibPixiTable";
```

```ts
const table = new LibPixiTable({
  data: [
    ["Name", "Score", "Rank"],
    ["Tom", 1200, 1],
    ["Jerry", 980, 2],
  ],
  cellWidth: 140,
  cellHeight: 72,
  fontSize: 24,
  lineWidth: 2,
  lineColor: "#94a3b8",
});

app.stage.addChild(table);
```

### LibPixiTableV2-自定义表格

单元格内部文本样式完全交给外部控制，适合更复杂的表格 UI。

```ts
import { LibPixiTableV2 } from "lyb-pixi-js/Components/Custom/LibPixiTableV2";
import { LibPixiText } from "lyb-pixi-js/Components/Base/LibPixiText";
```

```ts
const headerStyle = { fontSize: 24, fontColor: "#ffffff", align: "center" as const };
const bodyStyle = { fontSize: 22, fontColor: "#f8fafc", align: "center" as const };

const table = new LibPixiTableV2({
  cellWidth: 180,
  cellHeight: 72,
  cellPadding: 10,
  lineWidth: 2,
  lineColor: "#475569",
  data: [
    [
      { text: new LibPixiText({ text: "Date", ...headerStyle }), bgColor: "#334155" },
      { text: new LibPixiText({ text: "Event", ...headerStyle }), bgColor: "#334155" },
    ],
    [
      { text: new LibPixiText({ text: "2026-03-20", ...bodyStyle }), bgColor: "#0f172a" },
      { text: new LibPixiText({ text: "Login", ...bodyStyle }), bgColor: "#0f172a" },
    ],
  ],
});

app.stage.addChild(table);
```

### LibPixiTextGroupWrap-文本组换行

适合由多段文本拼接组成的一整段内容，并统一控制换行。

```ts
import { LibPixiTextGroupWrap } from "lyb-pixi-js/Components/Custom/LibPixiTextGroupWrap";
```

```ts
const group = new LibPixiTextGroupWrap({
  wordWrapWidth: 420,
  items: [
    { text: "恭喜你获得 " },
    { text: "SSR", style: { fill: "#f59e0b" } },
    { text: " 角色一名。" },
  ],
});

app.stage.addChild(group);
```

### LibPixiTurntable-转盘布局

根据份数和中心距离，计算一圈元素的坐标和旋转。

```ts
import { LibPixiTurntable } from "lyb-pixi-js/Components/Custom/LibPixiTurntable";
```

```ts
LibPixiTurntable(8, 180, (x, y, rotation, index) => {
  rewardList[index].position.set(x, y);
  rewardList[index].rotation = rotation;
});
```

## Utils

### libContainerCenter-父容器居中

让子容器在父容器内按 `x`、`y` 或 `xy` 居中。

```ts
import { libContainerCenter } from "lyb-pixi-js/Utils/LibContainerCenter";
```

```ts
libContainerCenter(dialog, button, "xy");
```

### libControlledDelayedCall-可控延迟调用

创建一个可中止的延迟任务。

```ts
import { libControlledDelayedCall } from "lyb-pixi-js/Utils/LibControlledDelayedCall";
```

```ts
const delayed = libControlledDelayedCall(1000);
delayed.start.then(() => {
  console.log("1 秒后执行");
});

delayed.stop();
```

### LibPixiAudio-音频播放器

统一管理 Pixi 场景中的音效和背景音乐。

```ts
import { LibPixiAudio } from "lyb-pixi-js/Utils/LibPixiAudio";
```

```ts
const audio = new LibPixiAudio();

await audio.playEffect("coin");
await audio.playMusic("bgm-main");

audio.pauseMusic();
audio.resumeMusic();
audio.stopEffect("coin");

audio.setEffectEnabled(true);
audio.setMusicEnabled(true);
```

### libPixiCreateNineGrid-九宫格图

创建九宫格拉伸图。

```ts
import { libPixiCreateNineGrid } from "lyb-pixi-js/Utils/LibPixiCreateNineGrid";
import { Texture } from "pixi.js";
```

```ts
const nineGrid = libPixiCreateNineGrid({
  texture: Texture.from("panel.png"),
  dotWidth: [20, 20, 20, 20],
  width: 420,
  height: 220,
});

app.stage.addChild(nineGrid);
```

### LibPixiDigitalIncreasingAnimation-递增动画

让数字在一段时间内平滑增长到目标值。

```ts
import { LibPixiDigitalIncreasingAnimation } from "lyb-pixi-js/Utils/LibPixiDigitalIncreasingAnimation";
```

```ts
const stop = LibPixiDigitalIncreasingAnimation({
  startValue: 0,
  value: 9999,
  duration: 1,
  onChange: (value) => {
    amountText.text = value;
  },
});

stop();
```

### LibPixiDownScaleAnimation-按下放大

为按钮或图标添加按下反馈动画。

```ts
import { LibPixiDownScaleAnimation } from "lyb-pixi-js/Utils/LibPixiDownScaleAnimation";
```

```ts
LibPixiDownScaleAnimation(startBtn, "small");
```

### LibPixiEmitContainerEvent-触发后代监听

向后代容器递归分发事件。

```ts
import { LibPixiEmitContainerEvent } from "lyb-pixi-js/Utils/LibPixiEmitContainerEvent";
```

```ts
LibPixiEmitContainerEvent(app.stage, "LANGUAGE_CHANGE", { lang: "zh-CN" });
```

### libPixiEvent-事件注册

对 Pixi 事件做一层统一封装，支持 `once`、节流、防误触和自动鼠标样式。

```ts
import { libPixiEvent } from "lyb-pixi-js/Utils/LibPixiEvent";
```

```ts
const off = libPixiEvent(
  button,
  "pointertap",
  () => {
    console.log("clicked");
  },
  {
    once: false,
    throttle: true,
    throttleTime: 300,
    autoCursor: true,
  }
);

off();
```

### libPixiFilter-滤镜

快速创建常见滤镜。

```ts
import { libPixiFilter } from "lyb-pixi-js/Utils/LibPixiFilter";
```

```ts
sprite.filters = [
  libPixiFilter("brightness", 1.2),
  libPixiFilter("contrast", 1.1),
];
```

### LibPixiGlobalUpdater-事件实例汇总

集中存储组件实例，便于事件总线或全局逻辑按 key 调用。

```ts
import { LibPixiGlobalUpdater } from "lyb-pixi-js/Utils/LibPixiGlobalUpdater";
```

```ts
type Instances = "GameUI" | "ToolbarUI";

const updater = new LibPixiGlobalUpdater<Instances>();
updater.setInstance("GameUI", gameUI);
updater.setInstance("ToolbarUI", toolbarUI);

updater.getInstance("GameUI").visible = true;
```

### LibPixiGridLayout-网格布局

将一组元素快速排成网格。

```ts
import { LibPixiGridLayout } from "lyb-pixi-js/Utils/LibPixiGridLayout";
```

```ts
LibPixiGridLayout(cardList, 20, 4, "row");
```

### libPixiHVCenter-列表居中

让一组元素整体相对父容器水平或垂直居中。

```ts
import { libPixiHVCenter } from "lyb-pixi-js/Utils/LibPixiHVCenter";
```

```ts
libPixiHVCenter(app.stage, rewardList, ["x"]);
```

### libPixiHVGap-列表间距

按 `x` 或 `y` 方向设置元素间距。

```ts
import { libPixiHVGap } from "lyb-pixi-js/Utils/LibPixiHVGap";
```

```ts
libPixiHVGap(rewardList, 16, "x");
```

### libPixiIntervalTrigger-间隔触发

基于共享 Ticker 的间隔触发器，支持固定间隔和随机区间。

```ts
import { libPixiIntervalTrigger } from "lyb-pixi-js/Utils/LibPixiIntervalTrigger";
```

```ts
const stop = libPixiIntervalTrigger(() => {
  console.log("tick");
}, [500, 1200]);

stop();
```

### libPixiIsOutOfView-离开可视区检测

判断某个容器是否已离开屏幕范围。

```ts
import { libPixiIsOutOfView } from "lyb-pixi-js/Utils/LibPixiIsOutOfView";
```

```ts
if (libPixiIsOutOfView(enemy)) {
  enemy.visible = false;
}
```

### libPixiLocalBoundary-本地边界坐标

获取舞台在当前适配模式下的边界信息。

```ts
import { libPixiLocalBoundary } from "lyb-pixi-js/Utils/LibPixiLocalBoundary";
```

```ts
const boundary = libPixiLocalBoundary(app.stage, "hv");
console.log(boundary.leftTop, boundary.rightTop);
```

### libPixiOutsideClick-失焦隐藏

点击容器外部或入口按钮时关闭浮层。

```ts
import { libPixiOutsideClick } from "lyb-pixi-js/Utils/LibPixiOutsideClick";
import { libPixiEvent } from "lyb-pixi-js/Utils/LibPixiEvent";
```

```ts
let removeOutside: () => void;

libPixiEvent(triggerBtn, "pointertap", () => {
  popup.visible = !popup.visible;

  if (popup.visible) {
    removeOutside = libPixiOutsideClick(popup, triggerBtn, () => {
      popup.visible = false;
    });
  } else {
    removeOutside?.();
  }
});
```

### libPixiOverflowHidden-溢出裁剪

为容器添加矩形遮罩，隐藏溢出内容。

```ts
import { libPixiOverflowHidden } from "lyb-pixi-js/Utils/LibPixiOverflowHidden";
```

```ts
const mask = libPixiOverflowHidden(scrollContent);
mask.visible = false;
```

### libPixiPivot-容器锚点设置

用于设置容器 `pivot`。注意导入路径文件名是 `LibPixiActhor`，导出名是 `libPixiPivot`。

```ts
import { libPixiPivot } from "lyb-pixi-js/Utils/LibPixiActhor";
```

```ts
libPixiPivot(dialog, 0.5, 0.5);
```

### LibPixiPolygonDrawTool-多边形绘制工具

开发期辅助工具，用于快速点绘多边形顶点数据。

```ts
import { LibPixiPolygonDrawTool } from "lyb-pixi-js/Utils/LibPixiPolygonDrawTool";
```

```ts
new LibPixiPolygonDrawTool(app, {
  outFormat: "number",
  dotRadius: 6,
  polygonColor: "#22c55e",
});
```

### libPixiPromiseTickerTimeout-TickerPromise 定时器

基于 Ticker 与 Promise 的延时工具。

```ts
import { libPixiPromiseTickerTimeout } from "lyb-pixi-js/Utils/LibPixiPromiseTickerTimeout";
```

```ts
await libPixiPromiseTickerTimeout(1000, () => {
  console.log("1 秒后触发");
});
```

### libPixiScaleContainer-超出缩放

当元素超出给定尺寸时自动缩放到范围内。

```ts
import { libPixiScaleContainer } from "lyb-pixi-js/Utils/LibPixiScaleContainer";
```

```ts
libPixiScaleContainer(title, 300, 80);
```

### libPixiShadow-阴影

给容器添加阴影效果。

```ts
import { libPixiShadow } from "lyb-pixi-js/Utils/LibPixiShadow";
```

```ts
libPixiShadow(card, {
  color: "#000000",
  alpha: 0.4,
  blur: 6,
  distance: 8,
  offset: { x: 2, y: 4 },
});
```

### LibPixiSlideInput-滑块输入

适合通过拖动来选择某个数值。

```ts
import { LibPixiSlideInput } from "lyb-pixi-js/Utils/LibPixiSlideInput";
import { Container } from "pixi.js";
```

```ts
const slideInput = new LibPixiSlideInput({
  app,
  clickArea: [new Container()],
  sideArea: new Container(),
  maxMoveDistance: 500,
  onChange: (x, value) => {
    console.log(x, value);
  },
});

slideInput.setValue(0.5);
```

### LibPixiTicker-Ticker 管理器

统一管理全局 Ticker 回调。

```ts
import { LibPixiTicker } from "lyb-pixi-js/Utils/LibPixiTicker";
```

```ts
const off = LibPixiTicker.add("coin-spin", () => {
  coin.rotation += 0.05;
});

LibPixiTicker.stop("coin-spin");
LibPixiTicker.start("coin-spin");
off();
```

### libPixiTickerTimeout-Ticker 定时器

基于 Ticker 的延迟执行工具。

```ts
import { libPixiTickerTimeout } from "lyb-pixi-js/Utils/LibPixiTickerTimeout";
```

```ts
const cancel = libPixiTickerTimeout(() => {
  console.log("timeout");
}, 800);

cancel();
```

### LibPixiDialogManager-弹窗管理器

提供弹窗打开、关闭、批量销毁和关闭监听能力，同时导出 `LibPixiDialog` 与 `LibPixiBaseContainer`。

```ts
import {
  LibPixiDialogManager,
  LibPixiDialog,
  LibPixiBaseContainer,
} from "lyb-pixi-js/Utils/LibPixiDialogManager";
```

```ts
class RewardDialog extends LibPixiDialog {
  constructor() {
    super({ needBg: true });
  }
}

const dialogManager = new LibPixiDialogManager(app.stage);

dialogManager.open(RewardDialog, "reward-dialog");
dialogManager.onClose("reward-dialog", () => {
  console.log("dialog closed");
});

await dialogManager.close("reward-dialog");
```

## 补充说明

- README 中的导入路径以当前 `npm/package.json` 的 `exports` 为准。
- 组件和工具较多，少数模块存在“文件名”和“导出名”不完全一致的情况，复制代码前建议结合类型提示确认。
- 本文档优先强调“怎么用”，不是完整的源码设计说明。
- 如果你需要更准确的参数、方法签名和返回值，请直接查看对应 `.d.ts` 文件。
