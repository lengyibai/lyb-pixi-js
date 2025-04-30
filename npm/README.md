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

\- [LibPixiHtmlText-富文本](#LibPixiHtmlText-富文本)

\- [LibPixiBitText-位图](#LibPixiBitText-位图)

\- [LibPixiContainer-容器](#LibPixiContainer-容器)

\- [LibPixiRectBgColor-矩形](#LibPixiRectBgColor-矩形)

\- [LibPixiRectangle-矩形](#LibPixiRectangle-矩形)

\- [LibPixiCircular-圆形](#LibPixiCircular-圆形)

\- [LibPixiPolygon-多边形](#LibPixiPolygon-多边形)

\- [LibPixiSpine-动画](#LibPixiSpine-动画)

\- [LibPixiParticleMove-粒子容器](#LibPixiParticleMove-粒子容器)

\- [LibPixiButtonHover-按钮悬浮](#LibPixiButtonHover-按钮悬浮)

\- [LibPixiCloseBtn-关闭按钮](#LibPixiCloseBtn-关闭按钮)

\- [LibPixiDrawer-抽屉](#LibPixiDrawer-抽屉)

\- [LibPixiPerforMon-性能监视器](#LibPixiPerforMon-性能监视器)

\- [LibPixiProgress-进度条](#LibPixiProgress-进度条)

\- [LibPixiScrollContainerX-X 轴滚动容器](#LibPixiScrollContainerX-X 轴滚动容器)

\- [LibPixiScrollContainerY-Y 轴滚动容器](#LibPixiScrollContainerY-Y 轴滚动容器)

\- [LibPixiScrollNum-数字滑动](#LibPixiScrollNum-数字滑动)

\- [LibPixiSlider-横向滑动图](#LibPixiSlider-横向滑动图)

\- [LibPixiSlide-滑动页](#LibPixiSlide-滑动页)

\- [LibPixiSubAddMinMax-数字控制器](#LibPixiSubAddMinMax-数字控制器)

\- [LibPixiTable-数字表格](#LibPixiTable-数字表格)

\- [LibPixiParticleMove-粒子移动特效](#LibPixiParticleMove-粒子移动特效)

### 方法

\- [LibPixiAudio-音频播放器](#LibPixiAudio-音频播放器)

\- [LibPixiCreateNineGrid-九宫格图](#LibPixiCreateNineGrid-九宫格图)

\- [LibPixiEvent-事件注册](#LibPixiEvent-事件注册)

\- [LibPixiFilter-滤镜](#LibPixiFilter-滤镜)

\- [LibPixiIntervalTrigger-间隔触发](#LibPixiIntervalTrigger-间隔触发)

\- [LibPixiOutsideClick-失焦隐藏](#LibPixiOutsideClick-失焦隐藏)

\- [LibPixiOverflowHidden-溢出裁剪](#LibPixiOverflowHidden-溢出裁剪)

\- [LibPixiPromiseTickerTimeout-TickerPromise 定时器](#LibPixiPromiseTickerTimeout-TickerPromise定时器)

\- [LibPixiScaleContainer-超出缩放](#LibPixiScaleContainer-超出缩放)

\- [LibPixiShadow-阴影](#LibPixiShadow-阴影)

\- [LibPixiTickerTimeout-Ticker 定时器](#LibPixiTickerTimeout-Ticker定时器)

\- [LibPixiSlideInput-滑块选择值](#LibPixiSlideInput-滑块选择值)

\- [LibGlobalUpdater-事件实例汇总](#LibGlobalUpdater-事件实例汇总)

\- [LibPixiPolygonDrawTool-多边形绘制](#LibPixiPolygonDrawTool-多边形绘制)

\- [LibPixiDigitalIncreasingAnimation-递增动画](#LibPixiDigitalIncreasingAnimation-递增动画)

\- [LibPixiDownScaleAnimation-按下放大](#LibPixiDownScaleAnimation-按下放大)

\- [LibPixiGridLayout-网格布局](#LibPixiGridLayout-网格布局)

\- [LibArrangeLinear-间隔布局](#LibArrangeLinear-间隔布局)

## Base-基础

### LibPixiText-文本

> 自定义文本类

```ts
const text = new LibPixiJs.Base.LibPixiText(LibPixiTextParams);
this.addChild(text);

interface LibPixiTextParams {
  /** 文本内容 */
  text: string | number;
  /**  字体大小 */
  fontSize?: number;
  /** 字体颜色 */
  fontColor?: any;
  /** 是否描边 */
  stroke?: boolean;
  /** 描边颜色 */
  strokeColor?: string | number;
  /** 描边宽度 */
  strokeThickness?: number;
  /** 字体样式 */
  fontFamily?: string;
  /** 字体粗细 */
  fontWeight?: TextStyleFontWeight;
  /** 是否换行 */
  wordWrap?: boolean;
  /** 换行宽度 */
  wordWrapWidth?: number;
  /** 行高 */
  lineHeight?: number;
  /** 对齐方式 */
  align?: TextStyleAlign;
  /** 缩进，单位为字数 */
  indent?: number;
  /** 阴影-颜色 角度 模糊度 阴影距离 */
  shadow?: [string, number, number, number];
}
```

### LibPixiHtmlText-富文本

> 自定义富文本类

```ts
const text = new LibPixiHtmlText(LibPixiTextParams);
this.addChild(text);

interface LibPixiHtmlTextParams {
  /** 文本内容 */
  text: string | number;
  /**  字体大小 */
  fontSize?: number;
  /** 字体颜色 */
  fontColor?: any;
  /** 是否描边 */
  stroke?: boolean;
  /** 描边颜色 */
  strokeColor?: string | number;
  /** 描边宽度 */
  strokeThickness?: number;
  /** 字体样式 */
  fontFamily?: string;
  /** 字体粗细 */
  fontWeight?: TextStyleFontWeight;
  /** 是否换行 */
  wordWrap?: boolean;
  /** 换行宽度 */
  wordWrapWidth?: number;
  /** 行高 */
  lineHeight?: number;
  /** 对齐方式 */
  align?: TextStyleAlign;
  /** 阴影-颜色 角度 模糊度 阴影距离 */
  shadow?: [string, number, number, number];
}
```

### LibPixiBitText-位图

> 自定义位图文本

```ts
/**
 * @param fontName 字体名称
 * @param defaultFontSize 默认字体大小
 */

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
/**
 * @param width 容器宽度
 * @param height 容器高度
 * @param bgColor 背景色
 * @param overHidden 是否溢出裁剪
 */
const box = new LibPixiJs.Base.LibPixiContainer(100, 100, "#fff", true);
this.addChild(box);
```

### LibPixiRectBgColor-矩形

> 自定义矩形背景色

```ts
const rect = new LibPixiRectBgColor(LibPixiRectBgColorParams);
this.addChild(rect);

interface LibPixiRectBgColorParams {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 背景颜色 */
  bgColor?: string | number;
  /** 透明度 */
  alpha?: number;
  /** 圆角半径 */
  radius?: number | number[];
  /** 边框宽度 */
  borderWidth?: number;
  /** 边框颜色 */
  borderColor?: string;
  /** 是否启用变色功能 */
  enableTint?: boolean;
}
```

### LibPixiRectangle-矩形

> `LibPixiRectBgColor`精简版，可用于一些场景的局部点击，传颜色是为了方便定位，最终可能需要将颜色隐藏掉

```ts
const libPixiRectangle = new LibPixiRectangle(100, 100, "#fff");
```

### LibPixiPolygon-多边形

> 多边形类，可用于一些场景的局部点击，传颜色是为了方便定位，最终可能需要将颜色隐藏掉

```ts
const polygonVertices = new LibPixiPolygon([
    0, 0, 604, 0, 596, 32, 616, 30, 611, 62, 644, 57, 643, 87, 697, 82, 702, 102, 724, 86, 744, 83, 753, 91, 756, 83,
    772, 85, 793, 100, 797, 114, 794, 316, 798, 336, 799, 476, 796, 491, 801, 507, 797, 635, 742, 656, 723, 683, 659,
    687, 638, 678, 646, 712, 617, 707, 611, 717, 618, 741, 596, 734, 595, 746, 601, 762, 14, 763, 18, 739, -4, 741, 4,
    712, -5, 705, -28, 711, -22, 686, -34, 679, -47, 686, -195, 686, -189, 667, -192, 647, -195, 506, -192, 499, -194,
    476, -192, 331, -187, 323, -193, 307, -194, 110, -188, 103, -189, 93, -172, 81, -112, 82, -98, 95, -93, 80, -56,
    82, -40, 89, -36, 80, -41, 57, -30, 57, -16, 62, -8, 58, -16, 29, 1, 35, 8, 25, 0, 0,
], "#000");
```

### LibPixiCircular-圆形

```ts
const libPixiCircular = new LibPixiCircular(100, "#fff");
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

interface OnUpdateParams {
  x: number;
  y: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
}
interface LibPixiSpineParams {
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
```

### LibPixiParticleMove-粒子容器

> 利用贝塞尔曲线实现粒子移动

```ts
const libParticleMove = new LibPixiJs.Components.Base.LibPixiParticleMove({
  start: { x: 0, y: window.innerHeight },
  control: [
    { x: 1000, y: 750 },
    { x: 500, y: 250 },
  ],
  end: { x: 0, y: 0 },
  container: PIXI.Assets.get("fly.png"),
  duration: 1,
  showControl: true,
  ease: "power1.in",
  particleConfig: {
    frequency: 0.001,
    blendMode: "add",
    lifetime: {
      min: 0.01,
      max: 1,
    },
    alpha: {
      start: 1,
      end: 0,
    },
    color: {
      start: "#fff96c",
      end: "#ff837f",
    },
    scale: {
      start: 2,
      end: 3,
    },
    rotation: {
      min: 0,
      max: 360,
    },
    rotate: {
      min: 0,
      max: 360,
    },
    speed: {
      start: 0,
      end: 0,
    },
  },

  onDestroy: (destroy) => {
    gsap.to(libParticleMove, {
      alpha: 0,
      onComplete: () => {
        destroy();
      },
    });
  },
});
app.stage.addChild(libParticleMove);

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
```

## Custom-定制

### LibPixiButtonHover-按钮悬浮

> 悬浮切换材质

```ts
import { LibPixiButtonHover } from "lyb-pixi-js";

//创建按钮实例
const button = new LibPixiButtonHover({
  texture: PIXI.Texture.from("path/to/normal.png"),
  hoverTexture: PIXI.Texture.from("path/to/hover.png"),
  tintColor: "#ff0000", //默认颜色
  hoverTintColor: "#00ff00", //悬浮颜色
  disabledColor: "#cccccc", //禁用颜色
});

//启用/禁用按钮
button.setDisabled(false); //启用
button.setDisabled(true); //禁用

//切换按钮材质
button.toggleTexture(
  PIXI.Texture.from("path/to/new_normal.png"),
  PIXI.Texture.from("path/to/new_hover.png")
);

//添加到Pixi舞台
app.stage.addChild(button);
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

### LibPixiScrollContainerX-X 轴滚动容器

> 支持鼠标滚轮滚动、鼠标拖动、手指滑动，支持惯性滚动及回弹

```ts
import { Container } from "pixi.js";
import { LibPixiScrollContainerX } from "./path/to/LibPixiScrollContainerX";

//创建滚动内容容器
const scrollContent = new Container();
//在这里添加滚动内容，例如图片、文本等
//scrollContent.addChild(someOtherPixiElement);

//创建滚动容器实例
const scrollContainer = new LibPixiScrollContainerX({
  width: 800,
  height: 600,
  scrollContent: scrollContent,
});

//添加到Pixi.js场景
app.stage.addChild(scrollContainer);

//设置容器大小
scrollContainer.setDimensions(800, 600);

//将内容添加到滚动容器
scrollContainer.addContent(new Sprite(Texture.from("new-content.png")));
```

### LibPixiScrollContainerY-Y 轴滚动容器

> 支持鼠标滚轮滚动、鼠标拖动、手指滑动，支持惯性滚动及回弹

```ts
import { Container } from "pixi.js";
import { LibPixiScrollContainerY } from "./path/to/LibPixiScrollContainerY";

//创建滚动内容容器
const scrollContent = new Container();
//在这里添加滚动内容，例如图片、文本等
//scrollContent.addChild(someOtherPixiElement);

//创建滚动容器实例
const scrollContainer = new LibPixiScrollContainerY({
  width: 800,
  height: 600,
  scrollContent: scrollContent,
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
const slider = new LibPixiSlider({
  width: 400,
  height: 300,
  slideContent,
  enableDepth: true,
  slideCallback: (pageIndex, pageNum) => {
    console.log(`当前页: ${pageIndex + 1} / ${pageNum + 1}`);
  },
});

//将幻灯片添加到场景
app.stage.addChild(slider);

//手动滑动到上一页或下一页
slider.prev();
slider.next();
```

### LibPixiSlide-滑动页

> `LibPixiSlider-横向滑动图`和`LibPixiScrollNum-数字滑动`的替代品，支持`X`和`Y`配置，景深

```ts
const three = new LibPixiSlide({
  stage: gameMount.gameStage,
  direction: "y",
  width: 255,
  height: 320,
  pageHeight: 70,
  content: threeList,
  itemList: threeTextList,

  scrollCallback: (y, index) => {
    two.updatePosition(y, index);
  },
  depthCallback(container, getValue) {
    const alpha = getValue(0.4);
    const scaleY = getValue(0.1);
    container.alpha = alpha;
    container.scale.y = scaleY;
  },
});
```

### LibPixiSubAddMinMax-数字控制器

> 最小、最大按钮和增减按钮功能及置灰逻辑

```ts
import { LibPixiSubAddMinMax } from "lyb-pixi-js";

//创建按钮实例
const betControl = new LibPixiSubAddMinMax({
  initialBetIndex: 0, //初始下注索引
  betAmountListLength: 10, //下注金额列表长度
  onAmountIndex: (index) => {
    console.log("当前下注金额索引:", index);
  },
  onDisabled: (type) => {
    if (type === "min") {
      minButton.tint = 0x999999; //禁用最小按钮
    } else if (type === "max") {
      maxButton.tint = 0x999999; //禁用最大按钮
    } else {
      minButton.tint = 0xffffff; //启用最小按钮
      maxButton.tint = 0xffffff; //启用最大按钮
    }
  },
});

//设置初始状态
betControl.min(); //设置为最小值
betControl.max(); //设置为最大值
betControl.sub(); //减少下注
betControl.add(); //增加下注

//添加到Pixi舞台
app.stage.addChild(minButton, maxButton, subButton, addButton);
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

//播放音效
audioPlayer.playEffect("effect-link").then(() => {
  console.log("音效播放完成");
});

//播放音乐
audioPlayer.playMusic("music-link");

//暂停音乐
audioPlayer.pauseMusic();

//继续播放音乐
audioPlayer.resumeMusic();

//停止指定音效
audioPlayer.stopEffect("effect-link");

//设置启用音效
audioPlayer.setEffectEnabled(false);

//设置启用音乐
audioPlayer.setMusicEnabled(false);
```

### LibPixiCreateNineGrid-九宫格图

> 九宫格图

```ts
const nineGrid = libPixiCreateNineGrid({
  texture: yourTexture, //传入纹理
  dotWidth: 10, //四个角的宽度，可以是数字或者数组
  width: 200, //宽度
  height: 150, //高度
});
```

### LibPixiEvent-事件注册

> 事件注册

```ts
libPixiEvent(container, "pointerdown", (e) => {
  console.log("Pointer down event triggered", e);
});

//停止监听
const offEvent = libPixiEvent(container, "pointerdown", (e) => {
  console.log("Pointer down event triggered", e);
  offEvent();
});

//只执行一次的事件
libPixiEvent(
  container,
  "pointerup",
  (e) => {
    console.log("Pointer up event triggered", e);
  },
  {
    once: true,
  }
);

//防抖
libPixiEvent(
  container,
  "pointerup",
  (e) => {
    console.log("Pointer up event triggered", e);
  },
  {
    debounce: true,
    debounceTime: 1000,
  }
);

//停止监听
const off = libPixiEvent(
  container,
  "pointerup",
  (e) => {
    console.log("Pointer up event triggered", e);
  },
  true
);
off();
```

### LibPixiFilter-滤镜

> 滤镜

```ts
const brightnessFilter = libPixiFilter("brightness", 1.2); //设置亮度为1.2
const blurFilter = libPixiFilter("blur"); //设置模糊滤镜
const desaturateFilter = libPixiFilter("desaturate"); //设置去饱和滤镜
const contrastFilter = libPixiFilter("contrast", 1.5); //设置对比度为1.5
```

### LibPixiIntervalTrigger-间隔触发

> 间隔触发

```ts
const stopInterval = libPixiIntervalTrigger(() => {
  console.log("Triggered interval callback");
}, [500, 1000]); //随机间隔 500ms 到 1000ms

//or

const stopInterval = libPixiIntervalTrigger(() => {
  console.log("Triggered interval callback");
}, 500); //间隔 500ms

//停止间隔触发
stopInterval();
```

### LibPixiOutsideClick-失焦隐藏

> 点击容器外或入口按钮时隐藏

```ts
let removeEventListener: () => void;
const btn = new Sprite(Assets.get("btnIcon"));
const optionList = new Container();
libPixiEvent(btn, "pointertap", () => {
  optionList.visible = !optionList.visible;

  //列表显示后开始监听是否点击容器外
  if (optionList.visible) {
    removeEventListener = libPixiOutsideClick(optionList, btn, () => {
      optionList.visible = false;
    });
  }
  //如果通过再次点击按钮关闭了列表，则移除监听器
  else {
    removeEventListener();
  }
});
```

### LibPixiOverflowHidden-溢出裁剪

> 为容器创建并应用一个矩形遮罩，用于隐藏溢出的内容，函数会返回遮罩，可控制是否显示遮罩

```ts
const mask = libPixiOverflowHidden(container); //为容器创建并应用矩形蒙版
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
libPixiScaleContainer(container, 500, 300); //容器超过 500px 宽度或 300px 高度时进行缩放
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

//停止定时器
stopTimer();
```

### LibPixiSlideInput-滑块选择值

> 滑动选择器核心代码

```ts
import { Application, Container } from "pixi.js";
import { LibPixiSlideInput } from "./LibPixiSlideInput";

// 初始化 PIXI 应用和容器
const app = new Application();
const clickArea = [new Container()]; // 点击范围
const sideArea = new Container(); // 滑动区域

// 创建 LibPixiSlideInput 实例
const slideInput = new LibPixiSlideInput({
  app,
  clickArea,
  sideArea,
  maxMoveDistance: 500,
  onDown: () => {
    console.log("按下事件触发");
  },
  onUp: () => {
    console.log("抬起事件触发");
  },
  onChange: (x, value) => {
    console.log(`当前滑动位置: ${x}, 进度: ${value}`);
  },
});

// 设置进度为 50%
slideInput.setValue(0.5);
```

### LibGlobalUpdater-事件实例汇总

> 将组件实例化后，将涉及通过事件总线更新的实例进行存储，用于事件总线统一在一个位置监听并通过从实例汇总中获取实例调用实例的方法进行更新

```ts
//app.ts
this.gameUI = new GameUI();
this.addChild(this.gameUI);
globalUpdater.setInstance("GameUI", this.gameUI);

this.toolbarUI = new ToolbarUI();
this.addChild(this.toolbarUI);
globalUpdater.setInstance("ToolbarUI", this.toolbarUI);

//globalUpdater.ts
import type { GameUI } from "@/app/ui/GameUI";
import type { ToolbarUI } from "@/app/ui/ToolbarUI";

type Instances = "GameUI" | "ToolbarUI";
const globalUpdater = new GlobalUpdater<Instances>();
export { globalUpdater };

//开始游戏
$bus.on("play", () => {
  globalUpdater.getInstance<GameUI>("GameUI").play();
  globalUpdater.getInstance<ToolbarUI>("ToolbarUI").play();
});
```

### LibPixiPolygonDrawTool-多边形绘制

> 多边形绘制工具，绘制时浏览器窗口需要全屏显示，空格键控制开始和结束，开始后鼠标进行点击绘制，退格删除点，空格结束绘制，绘制结果在控制台打印，不满意可再次按空格清空并重新绘制

```ts
new LibPixiPolygonDrawTool(app);
```

### LibPixiDigitalIncreasingAnimation-递增动画

> 数值递增动画

```ts
const amountAnimation = _digitalIncreasingAnimation({
  startValue: 0,
  value: 100,
  duration: 1,
  onChange: (v) => {
    this._winAmountText.text = v;
  },
  onComplete: () => {
  },
});
```

### LibPixiDownScaleAnimation-按下放大

> 鼠标按下放大

```ts
LibPixiDownScaleAnimation(sprite);
```

### LibPixiGridLayout-网格布局

> 将元素按照指定的列数和间隔排列成网格布局

```ts
LibPixiGridLayout(cardList, 20, 3); //间隔20，一行三个
```

### LibArrangeLinear-间隔布局

> 按照指定方向（水平或垂直）排列元素，支持固定间隔或自定义每个间隔

```ts
LibArrangeLinear(cardList, 20, "y"); //间隔20，y轴排列
```

