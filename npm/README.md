# Lib 自用 PixiJS 组件&工具方法

## 介绍

> 该库为作者在写项目时收集的常用方法，代码简陋，没有严格的边缘处理
>
> 在通过`import`引入使用时，鼠标悬浮在每一个方法上都有较为完整的`Jsdoc`提示
>
> 示例仅展示方法的部分参数使用，更多传参和调用，可在编辑器右键方法转到类型定义查看方法的`.d.ts `文件

## 起步

> 完整使用

```ts
import { LibPixiJs } from "lyb-pixi-js";

const text = new LibPixiJs.Base.LibPixiText({
  text: "Hello World!",
  fontSize: 50,
  fontColor: "red",
});
app.stage.addChild(text);
```

> 按需引入，打包时就不会把整个库打进去

```ts
import { LibRectBgColor } from "lyb-pixi-js/Base/LibPixiRectBgColor";

const box = new LibPixiRectBgColor({
  width: 100,
  height: 100,
  bgColor: "red",
});
app.stage.addChild(box);
```

> 如果在多个文件使用到同一个方法，建议采用按需引入聚合导出

```ts
//你的公共工具函数文件 utils.ts
export * from "lyb-pixi-js/Base/LibPixiText";
export * from "lyb-pixi-js/Base/LibPixiRectBgColor";

//你的项目文件 index.ts
import { LibText, LibRectBgColor } from "utils";

const text = new LibPixiText({
  text: "Hello World!",
  fontSize: 50,
  fontColor: "red",
});
app.stage.addChild(text);

const box = new LibPixiRectBgColor({
  width: 100,
  height: 100,
  bgColor: "red",
});
app.stage.addChild(box);
```

**通过 `CDN ` 使用 `LibPixiJs`**

> 你可以借助 `script` 标签直接通过 `CDN` 来使用 `LibPixiJs`

```html
<script src="https://unpkg.com/lyb-pixi-js/lyb-pixi.js"></script>

<script>
  const text = new LibPixiJs.Base.LibPixiText({
    text: "Hello World!",
    fontSize: 50,
    fontColor: "red",
  });
  app.stage.addChild(text);
</script>
```

## 目录

### 组件

\- [LibPixiText-文本](#LibPixiText-文本)

\- [LibPixiBitText-位图](#LibPixiBitText-位图)

\- [LibPixiContainer-容器](#LibPixiContainer-容器)

\- [LibPixiRectBgColor-矩形](#LibPixiRectBgColor-矩形)

\- [LibPixiSpine-动画](#LibPixiSpine-动画)

\- [LibPixiParticleMove-粒子容器](#LibPixiParticleMove-粒子容器)

\- [LibPixiButtonHover-按钮悬浮](#LibPixiButtonHover-按钮悬浮)

\- [LibPixiCloseBtn-关闭按钮](#LibPixiCloseBtn-关闭按钮)

\- [LibPixiDrawer-抽屉](#LibPixiDrawer-抽屉)

\- [LibPixiPerforMon-性能监视器](#LibPixiPerforMon-性能监视器)

\- [LibPixiProgress-进度条](#LibPixiProgress-进度条)

\- [LibPixiScrollContainer-滚动容器](#LibPixiScrollContainer-滚动容器)

\- [LibPixiScrollNum-数字滑动](#LibPixiScrollNum-数字滑动)

\- [LibPixiSlider-横向滑动图](#LibPixiSlider-横向滑动图)

\- [LibPixiSubAddMinMax-数字控制器](#LibPixiSubAddMinMax-数字控制器)

\- [LibPixiTable-数字表格](#LibPixiTable-数字表格)

### 方法

\- [LibPixiAudio-音频播放器](#LibPixiAudio-音频播放器)

\- [LibPixiCreateNineGrid-九宫格图](#LibPixiCreateNineGrid-九宫格图)

\- [LibPixiEvent-事件注册](#LibPixiEvent-事件注册)

\- [LibPixiEventControlled-可关闭的事件](#LibPixiEventControlled-可关闭的事件)

\- [LibPixiFilter-滤镜](#LibPixiFilter-滤镜)

\- [LibPixiIntervalTrigger-间隔触发](#LibPixiIntervalTrigger-间隔触发)

\- [LibPixiOutsideClick-失焦隐藏](#LibPixiOutsideClick-失焦隐藏)

\- [LibPixiOverflowHidden-溢出裁剪](#LibPixiOverflowHidden-溢出裁剪)

\- [LibPixiPromiseTickerTimeout-TickerPromise 定时器](#LibPixiPromiseTickerTimeout-TickerPromise定时器)

\- [LibPixiScaleContainer-超出缩放](#LibPixiScaleContainer-超出缩放)

\- [LibPixiShadow-阴影](#LibPixiShadow-阴影)

\- [LibPixiTickerTimeout-Ticker 定时器](#LibPixiTickerTimeout-Ticker定时器)

## Base-基础

### LibPixiText-文本

> 自定义文本类

```ts
const text = new LibPixiJs.Base.LibPixiText({
  text: "Hello World!",
  fontSize: 50,
  fontColor: "red",
});
this.addChild(text);
```

### LibPixiBitText-位图

> 自定义位图文本

```ts
//所有文字使用同一个字体大小
const font = new LibPixiBitText("FontName", 16);
const fontText = font.createText("10");
this.addChild(fontText);

//同字体不同大小
const font = new LibPixiBitText("FontName");
const fontText1 = font.createText("10", 16);
this.addChild(fontText1);
const fontText2 = font.createText("10", 24);
this.addChild(fontText2);
```

### LibPixiContainer-容器

> 自定义容器大小及背景色

```ts
const box = new LibPixiJs.Base.LibPixiContainer(100, 100, "#fff", true);
this.addChild(box);
```

### LibPixiRectBgColor-矩形

> 自定义矩形背景色

```ts
const rect = new LibPixiRectBgColor({
  width: 100,
  height: 100,
  bgColor: "red",
});
this.addChild(rect);
```

### LibPixiSpine-动画

> 自定义 Spine 动画，内置挂点

```ts
//基础使用
const spine = new LibPixiSpine(Assets.get("lihe"));
spine.setAnimation("in");
spine.addAnimation("idle", true);
this.addChild(spine);

//挂点
this.bgSpine = new LibPixiSpine("spine_buyfree", {
  followPointList: [
    {
      boneName: "aaa",
      follow: followContainer1,
    },
    {
      boneName: "bbb",
      follow: followContainer2,
      onUpdate: ({ x, y, rotate, scaleX, scaleY }) => {
        followContainer2.position.set(
          x + 1920 / 2 - followContainer2.width / 2,
          y + 1080 / 2 - followContainer2.height / 2
        );
        followContainer2.rotation = rotate;
        followContainer2.scale.set(scaleX, scaleY);
      },
    },
  ],
});
```

### LibPixiParticleMove-粒子容器

> 利用贝塞尔曲线实现粒子移动

```ts
const libPixiParticleMove = new LibPixiJs.Base.LibPixiParticleMove({
  start: { x: 300, y: 600 },
  control: [
    { x: 600, y: 500 },
    { x: 500, y: 100 },
  ],
  end: { x: 0, y: 0 },
  json: PIXI.Assets.get("fly.json"),
  duration: 1,
  showControl: true,
  ease: "power1.in",
  loop: true,
});
```

## Custom-定制

### LibPixiButtonHover-按钮悬浮

> 悬浮切换材质

```ts
import { Texture } from "pixi.js";
import { LibPixiButtonHover } from "./path/to/LibPixiButtonHover";

//加载材质资源
const defaultTexture: Texture = Texture.from("default-icon.png");
const hoverTexture: Texture = Texture.from("hover-icon.png");

//创建按钮实例
const button = new LibPixiButtonHover({
  texture: defaultTexture,
  hoverTexture: hoverTexture,
  tintColor: "#FF0000", //可选：按钮的初始颜色
});

//设置按钮状态
button.setDisabled(true); //禁用按钮

//在Pixi.js应用的容器中添加按钮
app.stage.addChild(button);

//切换按钮材质
button.toggleTexture(
  Texture.from("new-default.png"),
  Texture.from("new-hover.png")
);
```

### LibPixiCloseBtn-关闭按钮

> 右上角关闭按钮，支持悬浮旋转动画

```ts
import { Sprite, Texture } from "pixi.js";
import { LibPixiCloseBtn } from "./path/to/LibPixiCloseBtn";

//创建按钮材质
const closeTexture = Texture.from("close-icon.png");

//创建按钮精灵
const closeButton = new Sprite(closeTexture);

//创建关闭按钮实例
const closeBtn = new LibPixiCloseBtn({
  sprite: closeButton,
  onClick: () => {
    console.log("Close button clicked!");
  },
});

//添加到Pixi.js场景
app.stage.addChild(closeBtn);
```

### LibPixiDrawer-抽屉

> 底部弹出抽屉

```ts
import { Container } from "pixi.js";
import { LibPixiDrawer } from "./path/to/LibPixiDrawer";

//创建抽屉内容容器
const drawerContent = new Container();
//在这里添加你想要的内容，例如一些按钮或文本等
//drawerContent.addChild(someOtherPixiElement);

//创建抽屉实例
const drawer = new LibPixiDrawer(drawerContent);

//添加到Pixi.js场景
app.stage.addChild(drawer);

//关闭抽屉
//drawer.close();
```

### LibPixiPerforMon-性能监视器

> 监视帧率、Draw Call、Max Draw Call

```ts
import { LibPixiPerforMon } from "./path/to/LibPixiPerforMon";

//创建性能监视实例
const perforMon = new LibPixiPerforMon(app);

//添加到Pixi应用的舞台
app.stage.addChild(perforMon);
```

### LibPixiProgress-进度条

> 通过裁剪的方式显示进度条

```ts
import { Texture } from "pixi.js";
import { LibPixiProgress } from "./path/to/LibPixiProgress";

//创建进度条背景和进度条材质
const bgTexture = Texture.from("background.png");
const barTexture = Texture.from("progress-bar.png");

//创建进度条实例
const progress = new LibPixiProgress({
  bgWidth: 400,
  bgHeight: 50,
  barWidth: 400,
  barHeight: 50,
  bgTexture: bgTexture,
  barTexture: barTexture,
});

//设置进度值
progress.setProgress(0.5); //50% 完成

//添加到Pixi.js场景
app.stage.addChild(progress);
```

### LibPixiScrollContainer-滚动容器

> 支持鼠标滚轮滚动、鼠标拖动、手指滑动，支持惯性滚动及回弹

```ts
import { Container } from "pixi.js";
import { LibPixiScrollContainer } from "./path/to/LibPixiScrollContainer";

//创建滚动内容容器
const scrollContent = new Container();
//在这里添加滚动内容，例如图片、文本等
//scrollContent.addChild(someOtherPixiElement);

//创建滚动容器实例
const scrollContainer = new LibPixiScrollContainer({
  width: 800,
  height: 600,
  scrollContent: scrollContent,
  bottomMargin: 50, //可选：底部内边距
});

//添加到Pixi.js场景
app.stage.addChild(scrollContainer);

//设置容器大小
scrollContainer.setDimensions(800, 600);

//将内容添加到滚动容器
scrollContainer.addContent(new Sprite(Texture.from("new-content.png")));
```

### LibPixiScrollNum-数字滑动

> 通过鼠标或手指拖动数字列选择数字

```ts
import { Container } from "pixi.js";
import { LibPixiScrollNum } from "./path/to/LibPixiScrollNum";

//创建滚动内容容器
const scrollContent = new Container();
//在这里添加滚动内容，例如数字、文本等
//scrollContent.addChild(someTextOrSprite);

//创建数字选择滚动器
const scrollNum = new LibPixiScrollNum({
  width: 300,
  height: 600,
  pageHeight: 100,
  content: scrollContent,
  pageNum: 5, //设定总行数
  slideCallback: (index) => {
    console.log("滑动到行:", index);
  },
  scrollCallback: (y, index) => {
    console.log(`当前Y: ${y}, 当前行: ${index}`);
  },
});

//将滚动器添加到场景
app.stage.addChild(scrollNum);

//手动滑动到特定行
scrollNum.slideTo(2);
```

### LibPixiSlider-横向滑动图

> 类似轮播图，但是不会自动轮播

```ts
import { Container } from "pixi.js";
import { LibPixiSlider } from "./path/to/LibPixiSlider";

//创建滑动内容容器
const slideContent = new Container();
//在这里添加幻灯片内容，例如图片、文本等
//slideContent.addChild(someImageOrText);

//创建幻灯片
const slider = new LibPixiSlider(
  400, //宽度
  300, //高度
  slideContent,
  (pageIndex, pageNum) => {
    console.log(`当前页: ${pageIndex + 1} / ${pageNum + 1}`);
  }
);

//将幻灯片添加到场景
app.stage.addChild(slider);

//手动滑动到上一页或下一页
slider.prev();
slider.next();
```

### LibPixiSubAddMinMax-数字控制器

> 最小、最大按钮和增减按钮功能及置灰逻辑

```ts
import { LibPixiSubAddMinMax } from "./path/to/LibPixiSubAddMinMax";
import { Container } from "pixi.js";

//创建最小、最大、增加和减少按钮
const minBtn = new Container();
const maxBtn = new Container();
const subBtn = new Container();
const addBtn = new Container();

//设置初始下注索引和金额列表数量
const initialBetIndex = 0;
const betAmountListLength = 5;

//金额更新回调
const onAmountIndex = (index: number) => {
  console.log(`当前金额索引: ${index}`);
};

//创建LibPixiSubAddMinMax实例
const betAmountController = new LibPixiSubAddMinMax({
  minBtn,
  maxBtn,
  subBtn,
  addBtn,
  initialBetIndex,
  betAmountListLength,
  onAmountIndex,
});

//绑定按钮事件
minBtn.on("pointerdown", () => betAmountController.min());
maxBtn.on("pointerdown", () => betAmountController.max());
subBtn.on("pointerdown", () => betAmountController.sub());
addBtn.on("pointerdown", () => betAmountController.add());
```

### LibPixiTable-数字表格

> 绘制表格并填充数字

```ts
import { LibPixiTable } from "./path/to/LibPixiTable";
import { Container } from "pixi.js";

//定义表格数据
const data: (number | string)[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

//创建LibPixiTable实例
const table = new LibPixiTable({
  data,
  cellWidth: 130,
  cellHeight: 100,
  fontSize: 24,
  fontColor: "#B4B4B8",
  lineWidth: 3,
  lineColor: "#B4B4B8",
});

//将表格添加到舞台
stage.addChild(table);
```

## Utils-工具方法

### LibPixiAudio-音频播放器

> 音频播放器

```ts
const audioPlayer = new LibPixiAudio();

// 播放音效
audioPlayer.playEffect("effect-link").then(() => {
  console.log("音效播放完成");
});

// 播放音乐
audioPlayer.playMusic("music-link");

// 暂停音乐
audioPlayer.pauseMusic();

// 继续播放音乐
audioPlayer.resumeMusic();

// 停止指定音效
audioPlayer.stopEffect("effect-link");

// 设置启用音效
audioPlayer.setEffectEnabled(false);

// 设置启用音乐
audioPlayer.setMusicEnabled(false);
```

### LibPixiCreateNineGrid-九宫格图

> 九宫格图

```ts
const nineGrid = libPixiCreateNineGrid({
  texture: yourTexture, // 传入纹理
  dotWidth: 10, // 四个角的宽度，可以是数字或者数组
  width: 200, // 宽度
  height: 150, // 高度
});
```

### LibPixiEvent-事件注册

> 事件注册

```ts
libPixiEvent(container, "pointerdown", (e) => {
  console.log("Pointer down event triggered", e);
});

// 只执行一次的事件
libPixiEvent(
  container,
  "pointerup",
  (e) => {
    console.log("Pointer up event triggered", e);
  },
  true
);
```

### LibPixiEventControlled-可关闭的事件

> 设置可关闭的事件监听，调用自身后不再触发

```ts
const closeEvent = libPixiEventControlled(container, "pointerdown", (e) => {
  console.log("Pointer down event triggered", e);
});

// 调用返回的函数关闭事件监听
closeEvent();
```

### LibPixiFilter-滤镜

> 滤镜

```ts
const brightnessFilter = libPixiFilter("brightness", 1.2); // 设置亮度为1.2
const blurFilter = libPixiFilter("blur"); // 设置模糊滤镜
const desaturateFilter = libPixiFilter("desaturate"); // 设置去饱和滤镜
const contrastFilter = libPixiFilter("contrast", 1.5); // 设置对比度为1.5
```

### LibPixiIntervalTrigger-间隔触发

> 间隔触发

```ts
const stopInterval = libPixiIntervalTrigger(() => {
  console.log("Triggered interval callback");
}, [500, 1000]); // 随机间隔 500ms 到 1000ms

//or

const stopInterval = libPixiIntervalTrigger(() => {
  console.log("Triggered interval callback");
}, 500); // 间隔 500ms

// 停止间隔触发
stopInterval();
```

### LibPixiOutsideClick-失焦隐藏

> 点击容器外或入口按钮时隐藏

```ts
const stopOutsideClick = libPixiOutsideClick(container, button, () => {
  console.log("Container closed");
});

// 停止监听点击事件
stopOutsideClick();
```

### LibPixiOverflowHidden-溢出裁剪

> 为容器创建并应用一个矩形遮罩，用于隐藏溢出的内容，函数会返回遮罩，可控制是否显示遮罩

```ts
const mask = libPixiOverflowHidden(container); // 为容器创建并应用矩形蒙版
```

### LibPixiPromiseTickerTimeout-TickerPromise 定时器

> 基于 Ticker 和 Promise 的定时器

```ts
libPixiPromiseTickerTimeout(1000, () => {
  console.log("Callback after 1000ms");
}).then(() => {
  console.log("Timer completed");
});
```

### LibPixiScaleContainer-超出缩放

> 元素超过指定宽度就缩放

```ts
libPixiScaleContainer(container, 500, 300); // 容器超过 500px 宽度或 300px 高度时进行缩放
```

### LibPixiShadow-阴影

> 为图片或容器设置阴影

```ts
libPixiShadow(container, {
  color: "#ff0000",
  alpha: 0.5,
  blur: 5,
  distance: 10,
  offset: { x: 2, y: 2 },
});
```

### LibPixiTickerTimeout-Ticker 定时器

> 基于 Ticker 的定时器

```ts
const stopTimer = libPixiTickerTimeout(() => {
  console.log("Callback after delay");
}, 1000);

// 停止定时器
stopTimer();
```
