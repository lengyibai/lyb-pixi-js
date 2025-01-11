# Lib自用PixiJS工具方法

## 介绍

> 该库为作者在写项目时收集的常用方法，代码简陋，没有严格的边缘处理
>
> 在通过`import`引入使用时，鼠标悬浮在每一个方法上都有较为完整的`Jsdoc`提示
>
> 示例仅展示方法的部分参数使用，更多传参和调用，需要查看方法源码

## 起步

> 完整使用

```ts
import { LibPixiJs } from "lyb-pixi-js";

const text = new LibPixiJs.Base.LibText({
  text: "Hello World!",
  fontSize: 50,
  fontColor:"red",
});
app.stage.addChild(text);
```

> 按需引入，打包时就不会把整个库打进去

```ts
import { LibRectBgColor } from "lyb-pixi-js/dist/Base/LibRectBgColor";

const box = new LibRectBgColor({
  width: 100,
  height: 100,
  bgColor: "red",
});
app.stage.addChild(box);
```

> 如果在多个文件使用到同一个方法，建议采用按需引入聚合导出

```ts
//你的公共工具函数文件 utils.ts
export * from "lyb-pixi-js/dist/Base/LibText";
export * from "lyb-pixi-js/dist/Base/LibRectBgColor";

//你的项目文件 index.ts
import { LibText,LibRectBgColor } from "utils";

const text = new LibText({
  text: "Hello World!",
  fontSize: 50,
  fontColor:"red",
});
app.stage.addChild(text);

const box = new LibRectBgColor({
  width: 100,
  height: 100,
  bgColor: "red",
});
app.stage.addChild(box);
```

**通过 `CDN ` 使用 `LibPixiJs`**

> 你可以借助 `script` 标签直接通过 `CDN` 来使用 `LibPixiJs`

```html
<script src="https://unpkg.com/lyb-pixi-js/umd/lyb-pixi.js"></script>

<script>
const text = new LibPixiJs.Base.LibText({
  text: "Hello World!",
  fontSize: 50,
  fontColor:"red",
});
app.stage.addChild(text);
</script>
```

## 目录

### 基础

\- [LibText-文本](#LibText-文本)

\- [LibBitText-位图](#LibBitText-位图)

\- [LibContainer-容器](#LibContainer-容器)

\- [LibRectBgColor-矩形](#LibRectBgColor-矩形)

\- [LibSpine-动画](#LibSpine-动画)

\- [LibParticleMove-粒子容器](#LibParticleMove-粒子容器)


## Base-基础

### LibText-文本

> 自定义文本类

```ts
const text = new LibPixiJs.Base.LibText({
  text: "Hello World!",
  fontSize: 50,
  fontColor:"red",
});
this.addChild(text);
```

### LibBitText-位图

> 自定义位图文本

```ts
//所有文字使用同一个字体大小
const font = new LibBitText("FontName", 16);
const fontText = font.createText("10");
this.addChild(fontText);

//同字体不同大小
const font = new LibBitText("FontName");
const fontText1 = font.createText("10", 16);
this.addChild(fontText1);
const fontText2 = font.createText("10", 24);
this.addChild(fontText2);
```

### LibContainer-容器

> 自定义容器大小及背景色

```ts
const box = new LibPixiJs.Base.LibContainer({
  width: 100,
  height: 100,
  bgColor: "#fff",
  overHidden: true,
});
this.addChild(box);
```

### LibRectBgColor-矩形

> 自定义矩形背景色

```ts
const rect = new LibRectBgColor({
  width: 100,
  height: 100,
  bgColor: "red",
});
this.addChild(rect);
```

### LibSpine-动画

> 自定义 Spine 动画，内置挂点

```ts
//基础使用
const spine = new LibSpine(Assets.get("lihe"));
spine.setAnimation("in");
spine.addAnimation("idle", true);
this.addChild(spine);

//挂点
this.bgSpine = new LibSpine("spine_buyfree", {
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
          y + 1080 / 2 - followContainer2.height / 2,
        );
        followContainer2.rotation = rotate;
        followContainer2.scale.set(scaleX, scaleY);
      },
    },
  ],
});
```

### LibParticleMove-粒子容器

> 利用贝塞尔曲线实现粒子移动

```ts
const libParticleMove = new LibPixiJs.Base.LibParticleMove({
  start: { x: 300, y: 600 },
  control: [
    { x: 600, y: 500 },
    { x: 500, y: 100 },
  ],
  end: { x: 0, y: 0 },
  json: PIXI.Assets.get("fly.json"),
  duration: 1,
  showControl: true,
  ease:"power1.in",
  loop: true,
});
```

