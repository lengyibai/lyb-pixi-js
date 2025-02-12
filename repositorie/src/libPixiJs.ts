import { LibPixiBitText } from "./Components/Base/LibPixiBitText";
import { LibPixiContainer } from "./Components/Base/LibPixiContainer";
import { LibPixiParticleMove } from "./Components/Base/LibPixiParticleMove";
import { LibPixiRectBgColor } from "./Components/Base/LibPixiRectBgColor";
import { LibPixiSpine } from "./Components/Base/LibPixiSpine";
import { LibPixiText } from "./Components/Base/LibPixiText";

import { LibPixiButtonHover } from "./Components/Custom/LibPixiButtonHover";
import { LibPixiCloseBtn } from "./Components/Custom/LibPixiCloseBtn";
import { LibPixiDrawer } from "./Components/Custom/LibPixiDrawer";
import { LibPixiPerforMon } from "./Components/Custom/LibPixiPerforMon";
import { LibPixiProgress } from "./Components/Custom/LibPixiProgress";
import { LibPixiScrollContainer } from "./Components/Custom/LibPixiScrollContainer";
import { LibPixiScrollNum } from "./Components/Custom/LibPixiScrollNum";
import { LibPixiSlider } from "./Components/Custom/LibPixiSlider";
import { LibPixiSubAddMinMax } from "./Components/Custom/LibPixiSubAddMinMax";
import { LibPixiTable } from "./Components/Custom/LibPixiTable";

import { LibPixiAudio } from "./Utils/LibPixiAudio";
import { libPixiCreateNineGrid } from "./Utils/LibPixiCreateNineGrid";
import { libPixiEvent } from "./Utils/LibPixiEvent";
import { libPixiEventControlled } from "./Utils/LibPixiEventControlled";
import { libPixiIntervalTrigger } from "./Utils/LibPixiIntervalTrigger";
import { libPixiOutsideClick } from "./Utils/LibPixiOutsideClick";
import { libPixiOverflowHidden } from "./Utils/LibPixiOverflowHidden";
import { libPixiPromiseTickerTimeout } from "./Utils/LibPixiPromiseTickerTimeout";
import { libPixiScaleContainer } from "./Utils/LibPixiScaleContainer";
import { libPixiFilter } from "./Utils/LibPixiFilter";
import { libPixiShadow } from "./Utils/LibPixiShadow";
import { libPixiTickerTimeout } from "./Utils/LibPixiTickerTimeout";
import { LibPixiSlideInput } from "./Utils/LibPixiSlideInput";
import { LibGlobalUpdater } from "./Utils/LibGlobalUpdater";

/** @description 组件 */
export const Components = {
  Base: {
    /** @description 自定义位图文本
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiBitText-位图
     */
    LibPixiBitText,

    /** @description 自定义容器大小及背景色
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiContainer-容器
     */
    LibPixiContainer,

    /** @description 利用贝塞尔曲线实现粒子移动
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiParticleMove-粒子容器
     */
    LibPixiParticleMove,

    /** @description 自定义矩形背景色
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiRectBgColor-矩形
     */
    LibPixiRectBgColor,

    /** @description 自定义 Spine 动画
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSpine-动画
     */
    LibPixiSpine,

    /** @description 自定义文本类
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiText-文本
     */
    LibPixiText,
  },

  Custom: {
    /** @description 悬浮切换材质
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiButtonHover-按钮悬浮
     */
    LibPixiButtonHover,
    /** @description 右上角关闭按钮，支持悬浮旋转动画
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiCloseBtn-关闭按钮
     */
    LibPixiCloseBtn,
    /** @description 底部弹出抽屉
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiDrawer-抽屉
     */
    LibPixiDrawer,
    /** @description 监视帧率、Draw Call、Max Draw Call
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiPerforMon-性能监视器
     */
    LibPixiPerforMon,
    /** @description 通过裁剪的方式显示进度条
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiProgress-进度条
     */
    LibPixiProgress,
    /** @description 支持鼠标滚轮滚动、鼠标拖动、手指滑动，支持惯性滚动及回弹
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiScrollContainer-滚动容器
     */
    LibPixiScrollContainer,
    /** @description 通过鼠标或手指拖动数字列选择数字
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiScrollNum-数字滑动
     */
    LibPixiScrollNum,
    /** @description 类似轮播图，但是不会自动轮播
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSlider-横向滑动图
     */
    LibPixiSlider,
    /** @description 最小、最大按钮和增减按钮功能及置灰逻辑
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSubAddMinMax-数字控制器
     */
    LibPixiSubAddMinMax,
    /** @description 绘制表格并填充数字
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiTable-数字表格
     */
    LibPixiTable,
  },
};

/** @description 方法 */
export const Utils = {
  /** @description 音频播放器
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiAudio-音频播放器
   */
  LibPixiAudio,

  /** @description 九宫格图
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiCreateNineGrid-九宫格图
   */
  libPixiCreateNineGrid,

  /** @description 事件注册
   * @param v 事件容器
   * @param eventName 事件名称
   * @param callback 回调函数
   * @param once 是否只执行一次
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiEvent-事件注册
   */
  libPixiEvent,

  /** @description 设置可关闭的事件监听，调用自身后不再触发
   * @param container 事件容器
   * @param eventName 事件名称
   * @param callback 事件回调
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiEventControlled-可关闭的事件
   */
  libPixiEventControlled,

  /** @description 滤镜
   * @param filterName 滤镜名称
   * @param v 滤镜值
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiFilter-滤镜
   */
  libPixiFilter,

  /** @description 间隔触发
   * @param callback 回调函数
   * @param interval 间隔毫秒，或随机范围
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiIntervalTrigger-间隔触发
   */
  libPixiIntervalTrigger,

  /** @description 点击容器外或入口按钮时隐藏
   * @param container 容器
   * @param btn 按钮
   * @param onClose 关闭回调
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiOutsideClick-失焦隐藏
   */
  libPixiOutsideClick,

  /** @description 为容器创建并应用一个矩形遮罩，用于隐藏溢出的内容，函数会返回遮罩，可控制是否显示遮罩
   * @param container 需要设置遮罩裁剪的容器
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiOverflowHidden-溢出裁剪
   */
  libPixiOverflowHidden,

  /** @description 基于 Ticker 和 Promise 的定时器
   * @param delay 延迟时间
   * @param callback 延迟后执行的函数
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiPromiseTickerTimeout-TickerPromise定时器
   */
  libPixiPromiseTickerTimeout,

  /** @description 元素超过指定宽度就缩放
   * @param scaleContainer 需要缩放的元素
   * @param maxWidth 最大宽度
   * @param maxHeight 最大高度
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiScaleContainer-超出缩放
   */
  libPixiScaleContainer,

  /** @description 阴影
   * @param container 需要添加阴影的元素
   * @param config 配置项
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiShadow-阴影
   */
  libPixiShadow,

  /** @description 基于 Ticker 的定时器
   * @param callback 延迟后执行的函数
   * @param delay 延迟时间
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiTickerTimeout-Ticker定时器
   */
  libPixiTickerTimeout,

  /** @description 滑动选择器核心代码
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSlideInput-滑动选择值
   */
  LibPixiSlideInput,

  /** @description 事件总线更新实例汇总
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibGlobalUpdater-事件实例汇总
   */
  LibGlobalUpdater,
};
