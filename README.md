# Lib自用PixiJS工具方法

## 介绍

> 该库为作者在写项目时收集的常用方法，代码简陋，没有严格的边缘处理
>
> 在通过`import`引入使用时，鼠标悬浮在每一个方法上都有较为完整的`Jsdoc`提示

## 起步

> 完整使用

```ts
import { LibPixiJs } from "lyb-pixi-js";

const t = LibPixiJs.Base.libPixiJsGetDataType("Hellow World!");
console.log(t); //"string"
```

> 按需引入，打包时就不会把整个库打进去

```ts
import { libPixiJsGetDataType } from "lyb-pixi-js/dist/Base/LibPixiJsGetDataType";

const t = libPixiJsGetDataType("Hellow World!");
console.log(t); //"string"
```

> 如果在多个文件使用到同一个方法，建议采用按需引入聚合导出

```ts
//你的公共工具函数文件 utils.ts
export * from "lyb-pixi-js/dist/Base/LibPixiJsGetDataType";
export * from "lyb-pixi-js/dist/Math/LibPixiJsCalculateExpression";

//你的项目文件 index.ts
import { libPixiJsGetDataType,libPixiJsCalculateExpression } from "utils";

const t = libPixiJsGetDataType("Hellow World!");
console.log(t); //"string"

const v = libPixiJsCalculateExpression("(1+2)-(3*4)/5");
conosle.log(v); //0.6
```

**通过 `CDN ` 使用 `LibPixiJs`**

> 你可以借助 `script` 标签直接通过 `CDN` 来使用 `LibPixiJs`

```html
<script src="https://unpkg.com/lyb-pixi-js/umd/lyb-pixi.js"></script>

<script>
const t = LibPixiJs.Base.libPixiJsGetDataType("Hellow World!");
console.log(t); //"string"
</script>
```

## 目录

### 基础

\- [LibPixiJsGetDataType-数据类型](#LibPixiJsGetDataType-数据类型)


## Base-基础

### LibPixiJsGetDataType-数据类型

> 返回数据类型

```ts

const result1 = libPixiJsGetDataType(123);
console.log(result1); //"number"

const result2 = libPixiJsGetDataType("hello");
console.log(result2); //"string"

const result3 = libPixiJsGetDataType([1, 2, 3]);
console.log(result3); //"array"
```

