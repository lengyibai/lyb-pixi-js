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
import { LibPixiScrollContainerX } from "./Components/Custom/LibPixiScrollContainerX";
import { LibPixiScrollContainerY } from "./Components/Custom/LibPixiScrollContainerY";
import { LibPixiScrollNum } from "./Components/Custom/LibPixiScrollNum";
import { LibPixiSlider } from "./Components/Custom/LibPixiSlider";
import { LibPixiTable } from "./Components/Custom/LibPixiTable";

import { LibPixiAudio } from "./Utils/LibPixiAudio";
import { libPixiCreateNineGrid } from "./Utils/LibPixiCreateNineGrid";
import { libPixiEvent } from "./Utils/LibPixiEvent";
import { libPixiIntervalTrigger } from "./Utils/LibPixiIntervalTrigger";
import { libPixiOutsideClick } from "./Utils/LibPixiOutsideClick";
import { libPixiOverflowHidden } from "./Utils/LibPixiOverflowHidden";
import { libPixiPromiseTickerTimeout } from "./Utils/LibPixiPromiseTickerTimeout";
import { libPixiScaleContainer } from "./Utils/LibPixiScaleContainer";
import { libPixiFilter } from "./Utils/LibPixiFilter";
import { libPixiShadow } from "./Utils/LibPixiShadow";
import { libPixiTickerTimeout } from "./Utils/LibPixiTickerTimeout";
import { LibPixiSlideInput } from "./Utils/LibPixiSlideInput";
import { LibPixiGlobalUpdater } from "./Utils/LibPixiGlobalUpdater";
import { LibPixiPolygonDrawTool } from "./Utils/LibPixiPolygonDrawTool";
import { LibPixiHtmlText } from "./Components/Base/LibPixiHtmlText";
import { LibPixiRectangle } from "./Components/Base/LibPixiRectangle";
import { LibPixiPolygon } from "./Components/Base/LibPixiPolygon";
import { LibPixiCircular } from "./Components/Base/LibPixiCircular";
import { LibPixiDigitalIncreasingAnimation } from "./Utils/LibPixiDigitalIncreasingAnimation";
import { LibPixiDownScaleAnimation } from "./Utils/LibPixiDownScaleAnimation";
import { LibPixiGridLayout } from "./Utils/LibPixiGridLayout";
import { LibPixiArrangeLinear } from "./Utils/LibPixiArrangeLinear";
import { LibPixiSlide } from "./Components/Custom/LibPixiSlide";
import { LibPixiEmitContainerEvent } from "./Utils/LibPixiEmitContainerEvent";
import { LibPixiLabelValue } from "./Components/Custom/LibPixiLabelValue";
import { LibPixiPuzzleBg } from "./Components/Custom/LibPixiPuzzleBg";
import { libContainerCenter } from "./Utils/LibContainerCenter";
import { libPixiHVCenter } from "./Utils/LibPixiHVCenter";
import { libPixiHVGap } from "./Utils/LibPixiHVGap";
import { LibPixiTriangle } from "./Components/Custom/LibPixiTriangle";
import { LibPixiCapsule } from "./Components/Custom/LibPixiCapsule";
import { LibDestroyContainer } from "./Components/Base/LibDestroyContainer";
import { LibPixiDragLocate } from "./Components/Custom/LibPixiDragLocate";

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

    /** @description 矩形类，可用于一些场景的局部点击，传颜色是为了方便定位，最终可能需要将颜色隐藏掉
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiRectangle-矩形
     */
    LibPixiRectangle,

    /** @description 圆形
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiCircular-圆形
     */
    LibPixiCircular,

    /** @description 多边形类
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiPolygon-多边形
     */
    LibPixiPolygon,

    /** @description 自定义 Spine 动画
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSpine-动画
     */
    LibPixiSpine,

    /** @description 自定义文本类
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiText-文本
     */
    LibPixiText,

    /** @description 自定义富文本类
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiHtmlText-自定义富文本类
     */
    LibPixiHtmlText,

    /** @description 带销毁的容器 */
    LibDestroyContainer,
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
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiScrollContainerX-X轴滚动容器
     */
    LibPixiScrollContainerX,
    /** @description 支持鼠标滚轮滚动、鼠标拖动、手指滑动，支持惯性滚动及回弹
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiScrollContainerY-Y轴滚动容器
     */
    LibPixiScrollContainerY,
    /** @description 通过鼠标或手指拖动数字列选择数字
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiScrollNum-数字滑动
     */
    LibPixiScrollNum,
    /** @description 类似轮播图，但是不会自动轮播
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSlider-横向滑动图
     */
    LibPixiSlider,

    /** @description 滑动页
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiSlide-滑动页
     */
    LibPixiSlide,

    /** @description 绘制表格并填充数字
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiTable-数字表格
     */
    LibPixiTable,

    /** @description 自适应宽度的标签和值组件
     * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiLabelValue-标签值
     */
    LibPixiLabelValue,

    /** @description 设计图背景拼接 */
    LibPixiPuzzleBg,

    /** @description 胶囊体 */
    LibPixiCapsule,

    /** @description 三角形 */
    LibPixiTriangle,

    /** @description 元素拖拽定位 */
    LibPixiDragLocate,
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
  LibPixiGlobalUpdater,

  /** @description 多边形绘制工具，绘制时浏览器窗口需要全屏显示，空格键控制开始和结束，开始后鼠标进行点击绘制，退格删除点，空格结束绘制，绘制结果在控制台打印，不满意可再次按空格清空并重新绘制
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiPolygonDrawTool-多边形绘制
   */
  LibPixiPolygonDrawTool,

  /** @description 数值递增动画
   * @param params 动画参数
   * @returns 设置为目标值并停止动画
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiDigitalIncreasingAnimation-递增动画
   */
  LibPixiDigitalIncreasingAnimation,

  /** @description 按下放大
   * @param container 要放大的容器
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiDownScaleAnimation-按下放大
   */
  LibPixiDownScaleAnimation,

  /**
   * @description 将元素按照指定的列数和间隔排列成网格布局。
   * @param items 要排列的元素数组
   * @param gap 每个元素之间的间隔
   * @param cols 网格的列数，默认为元素数量
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiGridLayout-网格布局
   */
  LibPixiGridLayout,

  /**
   * @description 按照指定方向（水平或垂直）排列元素，支持固定间隔或自定义每个间隔。
   * @param items 要排列的元素数组。
   * @param gap 元素之间的间隔，可以是固定间隔或自定义的间隔数组。
   * @param direction 排列方向，"x"表示水平，"y"表示垂直，默认为水平。
   * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiArrangeLinear-间隔布局
   */
  LibPixiArrangeLinear,

  /** @description 触发后代监听
   * @param container 容器
   * @param event 事件名称
   * @param payload 事件携带数据
   */
  LibPixiEmitContainerEvent,

  /** @description 当前容器在父容器居中 */
  libContainerCenter,

  /** @description 列表居中
   * @param parent 父容器
   * @param items 子元素数组
   * @param direction 方向数组，"x"表示水平，"y"表示垂直
   */
  libPixiHVCenter,

  /**
   * @description 按照指定方向（水平或垂直）排列元素，支持固定间隔或自定义每个间隔。
   * @param items 要排列的元素数组。
   * @param gap 元素之间的间隔，可以是固定间隔或自定义的间隔数组。
   * @param direction 排列方向，"x"表示水平，"y"表示垂直，默认为水平。
   */
  libPixiHVGap,
};
