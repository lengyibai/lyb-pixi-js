import { Container, Graphics, Sprite } from "pixi.js";

import { LibPixiScrollContainerY } from "./LibPixiScrollContainerY.js";

/** @description 布局方向 */
export type LibPixiFlexDirection = "row" | "column";
/** @description 列推进方向 */
export type LibPixiFlexColumnDirection = "ltr" | "rtl";
/** @description 主轴对齐方式 */
export type LibPixiFlexJustifyContent = "start" | "space-between";
/** @description 交叉轴对齐方式 */
export type LibPixiFlexAlignItems = "start" | "center";

/** 布局内边距 */
interface LibPixiFlexPadding {
  /** 上内边距 */
  top: number;
  /** 右内边距 */
  right: number;
  /** 下内边距 */
  bottom: number;
  /** 左内边距 */
  left: number;
}

/** 布局分组 */
interface LibPixiFlexGroup {
  /** 分组子项 */
  items: Container[];
  /** 主轴总长度 */
  mainSize: number;
  /** 交叉轴最大长度 */
  crossSize: number;
}

/** @description 布局配置 */
export interface LibPixiFlexOptions {
  /** 布局方向 */
  direction?: LibPixiFlexDirection;
  /** 统一内边距 */
  padding?: number;
  /** 横向内边距 */
  paddingX?: number;
  /** 纵向内边距 */
  paddingY?: number;
  /** 上内边距 */
  paddingTop?: number;
  /** 右内边距 */
  paddingRight?: number;
  /** 下内边距 */
  paddingBottom?: number;
  /** 左内边距 */
  paddingLeft?: number;
  /** 滚动可视高度 */
  scrollHeight?: number;
  /** 是否显示测试背景 */
  showBg?: boolean;
  /** 测试背景颜色 */
  bgColor?: string;
  /** 主轴对齐方式 */
  justifyContent?: LibPixiFlexJustifyContent;
  /** 交叉轴对齐方式 */
  alignItems?: LibPixiFlexAlignItems;
  /** 子项间距 */
  gap?: number;
  /** 行间距 */
  rowGap?: number;
  /** 列间距 */
  columnGap?: number;
  /** 最大宽度 */
  maxWidth?: number;
  /** 最大高度 */
  maxHeight?: number;
  /** 列推进方向 */
  columnDirection?: LibPixiFlexColumnDirection;
}

/** @description Pixi弹性布局骨架类 */
export class LibPixiFlex extends Container {
  /** 布局子项 */
  private readonly _items: Container[];
  /** 布局内容容器 */
  private readonly _content: Container;
  /** 测试背景 */
  private readonly _bg: Graphics;
  /** 滚动容器 */
  private readonly _scrollContainer?: LibPixiScrollContainerY;
  /** 布局配置 */
  private readonly _options: LibPixiFlexOptions;

  /** @description 创建Pixi弹性布局骨架类 */
  constructor(items: Container[], options?: LibPixiFlexOptions);
  /** @description 创建Pixi弹性布局骨架类 */
  constructor(items: Sprite[], options?: LibPixiFlexOptions);
  /** @description 创建Pixi弹性布局骨架类 */
  constructor(items: Container[], options: LibPixiFlexOptions = {}) {
    super();

    this._items = items;
    this._options = options;
    this._content = new Container();
    this._bg = new Graphics();

    this._normalizeItemsPivot();
    this.addChild(this._bg);

    if (this._items.length > 0) {
      this._content.addChild(...this._items);
    }

    if (this._options.scrollHeight) {
      this._scrollContainer = new LibPixiScrollContainerY({
        width: 1,
        height: this._options.scrollHeight,
        scrollContent: this._content,
        scrollbarRgiht: LibPixiScrollContainerY.scrollbarStyle.scrollbarRgiht,
        scrollbarWidth: LibPixiScrollContainerY.scrollbarStyle.scrollbarWidth,
        scrollbarColor: LibPixiScrollContainerY.scrollbarStyle.scrollbarColor,
      });
      this.addChild(this._scrollContainer);
    } else {
      this.addChild(this._content);
    }

    this.layout();
  }

  /** @description 执行布局 */
  layout() {
    const direction = this._options.direction ?? "row";

    if (direction === "column") {
      this._layoutColumn();
      this._updateScrollContainer();
      this._renderBg();
      return this;
    }

    this._layoutRow();
    this._updateScrollContainer();
    this._renderBg();
    return this;
  }

  /** @description 统一修正子项基准点 */
  private _normalizeItemsPivot() {
    this._items.forEach((item) => {
      const { x, y } = item.getLocalBounds();

      item.pivot.x = x;
      item.pivot.y = y;
    });
  }

  /** @description 重绘测试背景 */
  private _renderBg() {
    this._bg.clear();

    if (this._options.showBg === false) {
      return;
    }

    const { width, height } = this._getBgViewportBounds();

    if (width <= 0 || height <= 0) {
      return;
    }

    this._bg.beginFill(this._options.bgColor ?? "#000000");
    this._bg.drawRect(0, 0, width, height);
    this._bg.endFill();
  }

  /** @description 更新滚动容器尺寸 */
  private _updateScrollContainer() {
    if (!this._scrollContainer || !this._options.scrollHeight) {
      return;
    }

    const { width } = this._getContentBounds();
    const viewportWidth = this._getViewportWidth(width);

    this._scrollContainer.position.set(0, 0);
    this._scrollContainer.setDimensions(viewportWidth, this._options.scrollHeight);
  }

  /** @description 获取背景可视区域包围盒 */
  private _getBgViewportBounds() {
    if (this._options.scrollHeight !== undefined) {
      const { width } = this._getContentBounds();

      return {
        width: this._getViewportWidth(width),
        height: this._options.scrollHeight,
      };
    }

    return this._getViewportBounds();
  }

  /** @description 获取可视区域包围盒 */
  private _getViewportBounds() {
    if (this._scrollContainer) {
      return {
        width: this._scrollContainer.width,
        height: this._scrollContainer.height,
      };
    }

    const { width, height } = this._getContentBounds();

    return {
      width,
      height,
    };
  }

  /** @description 获取可视宽度 */
  private _getViewportWidth(contentWidth: number) {
    if (this._options.maxWidth !== undefined) {
      return this._options.maxWidth;
    }

    return contentWidth;
  }

  /** @description 获取内容包围盒 */
  private _getContentBounds() {
    const { width, height } = this._content.getLocalBounds();
    const padding = this._getPadding();

    return {
      width: width + padding.left + padding.right,
      height: height + padding.top + padding.bottom,
    };
  }

  /** @description 执行横向布局 */
  private _layoutRow() {
    const rowGroups = this._createRowGroups();
    const padding = this._getPadding();
    let rowStartY = padding.top;

    rowGroups.forEach((group, groupIndex) => {
      const currentGap = this._getRowGap(group);
      let currentX = padding.left;

      group.items.forEach((item, itemIndex) => {
        item.x = currentX;
        item.y = this._getRowItemY(rowStartY, group.crossSize, item.height);

        if (itemIndex < group.items.length - 1) {
          currentX += item.width + currentGap;
        }
      });

      if (groupIndex < rowGroups.length - 1) {
        rowStartY += group.crossSize + (this._options.rowGap ?? 0);
      }
    });
  }

  /** @description 执行纵向布局 */
  private _layoutColumn() {
    const columnGroups = this._createColumnGroups();
    const columnDirection = this._options.columnDirection ?? "ltr";
    const padding = this._getPadding();
    let columnStartX = padding.left;

    columnGroups.forEach((group, groupIndex) => {
      const currentGap = this._getColumnGap(group);
      let currentY = padding.top;

      if (groupIndex > 0) {
        const prevGroup = columnGroups[groupIndex - 1];

        if (columnDirection === "rtl") {
          columnStartX -= (this._options.columnGap ?? 0) + group.crossSize;
        } else {
          columnStartX += prevGroup.crossSize + (this._options.columnGap ?? 0);
        }
      }

      group.items.forEach((item, itemIndex) => {
        item.x = this._getColumnItemX(columnStartX, group.crossSize, item.width);
        item.y = currentY;

        if (itemIndex < group.items.length - 1) {
          currentY += item.height + currentGap;
        }
      });
    });
  }

  /** @description 获取横向布局主轴间距 */
  private _getRowGap(group: LibPixiFlexGroup) {
    const justifyContent = this._options.justifyContent ?? "start";

    if (justifyContent !== "space-between") {
      return this._options.gap ?? 0;
    }

    if (group.items.length <= 1 || this._options.maxWidth === undefined) {
      return this._options.gap ?? 0;
    }

    const contentWidth = this._getContentWidth(this._options.maxWidth);
    const remainWidth = contentWidth - group.mainSize;

    return (this._options.gap ?? 0) + remainWidth / (group.items.length - 1);
  }

  /** @description 获取纵向布局主轴间距 */
  private _getColumnGap(group: LibPixiFlexGroup) {
    const justifyContent = this._options.justifyContent ?? "start";

    if (justifyContent !== "space-between") {
      return this._options.gap ?? 0;
    }

    if (group.items.length <= 1 || this._options.maxHeight === undefined) {
      return this._options.gap ?? 0;
    }

    const contentHeight = this._getContentHeight(this._options.maxHeight);
    const remainHeight = contentHeight - group.mainSize;

    return (this._options.gap ?? 0) + remainHeight / (group.items.length - 1);
  }

  /** @description 获取布局内边距 */
  private _getPadding(): LibPixiFlexPadding {
    const padding = this._options.padding ?? 0;
    const paddingX = this._options.paddingX ?? padding;
    const paddingY = this._options.paddingY ?? padding;

    return {
      top: this._options.paddingTop ?? paddingY,
      right: this._options.paddingRight ?? paddingX,
      bottom: this._options.paddingBottom ?? paddingY,
      left: this._options.paddingLeft ?? paddingX,
    };
  }

  /** @description 获取可用内容宽度 */
  private _getContentWidth(totalWidth: number) {
    const padding = this._getPadding();

    return Math.max(0, totalWidth - padding.left - padding.right);
  }

  /** @description 获取可用内容高度 */
  private _getContentHeight(totalHeight: number) {
    const padding = this._getPadding();

    return Math.max(0, totalHeight - padding.top - padding.bottom);
  }

  /** @description 获取横向布局子项纵坐标 */
  private _getRowItemY(rowStartY: number, rowHeight: number, itemHeight: number) {
    const alignItems = this._options.alignItems ?? "start";

    if (alignItems === "start") {
      return rowStartY;
    }

    return rowStartY + (rowHeight - itemHeight) / 2;
  }

  /** @description 获取纵向布局子项横坐标 */
  private _getColumnItemX(columnStartX: number, columnWidth: number, itemWidth: number) {
    const alignItems = this._options.alignItems ?? "start";

    if (alignItems === "start") {
      return columnStartX;
    }

    return columnStartX + (columnWidth - itemWidth) / 2;
  }

  /** @description 创建横向行分组 */
  private _createRowGroups() {
    const groups: LibPixiFlexGroup[] = [];
    let currentItems: Container[] = [];
    let currentMainSize = 0;
    let currentCrossSize = 0;
    const maxWidth = this._options.maxWidth === undefined ? undefined : this._getContentWidth(this._options.maxWidth);
    const gap = this._options.gap ?? 0;

    this._items.forEach((item) => {
      const itemWidth = item.width;
      const itemHeight = item.height;
      const nextMainSize = currentItems.length === 0 ? itemWidth : currentMainSize + gap + itemWidth;

      if (currentItems.length > 0 && maxWidth !== undefined && nextMainSize > maxWidth) {
        groups.push({
          items: currentItems,
          mainSize: currentMainSize,
          crossSize: currentCrossSize,
        });

        currentItems = [];
        currentMainSize = 0;
        currentCrossSize = 0;
      }

      currentItems.push(item);
      currentMainSize = currentItems.length === 1 ? itemWidth : currentMainSize + gap + itemWidth;
      currentCrossSize = Math.max(currentCrossSize, itemHeight);
    });

    if (currentItems.length > 0) {
      groups.push({
        items: currentItems,
        mainSize: currentMainSize,
        crossSize: currentCrossSize,
      });
    }

    return groups;
  }

  /** @description 创建纵向列分组 */
  private _createColumnGroups() {
    const groups: LibPixiFlexGroup[] = [];
    let currentItems: Container[] = [];
    let currentMainSize = 0;
    let currentCrossSize = 0;
    const maxHeight =
      this._options.maxHeight === undefined ? undefined : this._getContentHeight(this._options.maxHeight);
    const gap = this._options.gap ?? 0;

    this._items.forEach((item) => {
      const itemWidth = item.width;
      const itemHeight = item.height;
      const nextMainSize = currentItems.length === 0 ? itemHeight : currentMainSize + gap + itemHeight;

      if (currentItems.length > 0 && maxHeight !== undefined && nextMainSize > maxHeight) {
        groups.push({
          items: currentItems,
          mainSize: currentMainSize,
          crossSize: currentCrossSize,
        });

        currentItems = [];
        currentMainSize = 0;
        currentCrossSize = 0;
      }

      currentItems.push(item);
      currentMainSize = currentItems.length === 1 ? itemHeight : currentMainSize + gap + itemHeight;
      currentCrossSize = Math.max(currentCrossSize, itemWidth);
    });

    if (currentItems.length > 0) {
      groups.push({
        items: currentItems,
        mainSize: currentMainSize,
        crossSize: currentCrossSize,
      });
    }

    return groups;
  }
}
