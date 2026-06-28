import { Container, Graphics, Sprite } from "pixi.js";

import { LibPixiScrollContainerY } from "./LibPixiScrollContainerY.js";

/** @description 网格布局方向 */
export type LibPixiGridDirection = "row" | "column";
/** @description 网格列推进方向 */
export type LibPixiGridColumnDirection = "ltr" | "rtl";

/** 网格布局内边距 */
interface LibPixiGridPadding {
  /** 上内边距 */
  top: number;
  /** 右内边距 */
  right: number;
  /** 下内边距 */
  bottom: number;
  /** 左内边距 */
  left: number;
}

/** 网格分组 */
interface LibPixiGridGroup {
  /** 分组子项 */
  items: Container[];
  /** 分组最大宽度 */
  width: number;
  /** 分组最大高度 */
  height: number;
}

/** @description 网格布局参数 */
export interface LibPixiGridOptions {
  /** 网格布局方向 */
  direction?: LibPixiGridDirection;
  /** 每行或每列个数 */
  count: number;
  /** 滚动可视宽度 */
  scrollWidth?: number;
  /** 行间隔 */
  rowGap?: number;
  /** 列间隔 */
  columnGap?: number;
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
  /** 列推进方向 */
  columnDirection?: LibPixiGridColumnDirection;
  /** 滚动可视高度 */
  scrollHeight?: number;
  /** 滚动条右边距 */
  scrollbarRight?: number;
  /** 滚动条宽度 */
  scrollbarWidth?: number;
  /** 滚动条颜色 */
  scrollbarColor?: string;
  /** 滚动内容顶部留白 */
  scrollMarginTop?: number;
  /** 滚动内容底部留白 */
  scrollMarginBottom?: number;
  /** 是否显示测试背景 */
  showBg?: boolean;
  /** 测试背景颜色 */
  bgColor?: string;
}

/** @description Pixi网格布局组件 */
export class LibPixiGrid extends Container {
  /** 布局子项 */
  private readonly _items: Container[];
  /** 布局内容容器 */
  private readonly _content: Container;
  /** 测试背景 */
  private readonly _bg: Graphics;
  /** 滚动容器 */
  private readonly _scrollContainer?: LibPixiScrollContainerY;
  /** 布局配置 */
  private readonly _options: LibPixiGridOptions;

  /** @description 创建Pixi网格布局组件 */
  constructor(items: Container[], options: LibPixiGridOptions);
  /** @description 创建Pixi网格布局组件 */
  constructor(items: Sprite[], options: LibPixiGridOptions);
  /** @description 创建Pixi网格布局组件 */
  constructor(items: Container[], options: LibPixiGridOptions) {
    super();

    this._items = items;
    this._options = options;
    this._content = new Container();
    this._bg = new Graphics();

    this.addChild(this._bg);
    this._normalizeItemsPivot();

    if (this._items.length > 0) {
      this._content.addChild(...this._items);
    }

    if (this._options.scrollHeight) {
      this._scrollContainer = new LibPixiScrollContainerY({
        width: this._options.scrollWidth ?? 1,
        height: this._options.scrollHeight,
        scrollContent: this._content,
        scrollbarRgiht: this._options.scrollbarRight,
        scrollbarWidth: this._options.scrollbarWidth,
        scrollbarColor: this._options.scrollbarColor,
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

  /** @description 执行横向网格布局 */
  private _layoutRow() {
    const rowGroups = this._createRowGroups();
    const padding = this._getPadding();
    let currentY = padding.top;

    rowGroups.forEach((group, groupIndex) => {
      let currentX = padding.left;

      group.items.forEach((item, itemIndex) => {
        item.x = currentX;
        item.y = currentY;

        if (itemIndex < group.items.length - 1) {
          currentX += item.width + (this._options.columnGap ?? 0);
        }
      });

      if (groupIndex < rowGroups.length - 1) {
        currentY += group.height + (this._options.rowGap ?? 0);
      }
    });
  }

  /** @description 执行纵向网格布局 */
  private _layoutColumn() {
    const columnGroups = this._createColumnGroups();
    const columnDirection = this._options.columnDirection ?? "ltr";
    const padding = this._getPadding();
    let currentX = padding.left;

    columnGroups.forEach((group, groupIndex) => {
      let currentY = padding.top;

      if (groupIndex > 0) {
        if (columnDirection === "rtl") {
          currentX -= group.width + (this._options.columnGap ?? 0);
        } else {
          const prevGroup = columnGroups[groupIndex - 1];

          currentX += prevGroup.width + (this._options.columnGap ?? 0);
        }
      }

      group.items.forEach((item, itemIndex) => {
        item.x = currentX;
        item.y = currentY;

        if (itemIndex < group.items.length - 1) {
          currentY += item.height + (this._options.rowGap ?? 0);
        }
      });
    });
  }

  /** @description 创建横向行分组 */
  private _createRowGroups() {
    const groups: LibPixiGridGroup[] = [];
    let currentItems: Container[] = [];

    this._items.forEach((item) => {
      if (currentItems.length >= this._options.count) {
        groups.push(this._createGroup(currentItems));
        currentItems = [];
      }

      currentItems.push(item);
    });

    if (currentItems.length > 0) {
      groups.push(this._createGroup(currentItems));
    }

    return groups;
  }

  /** @description 创建纵向列分组 */
  private _createColumnGroups() {
    const groups: LibPixiGridGroup[] = [];
    let currentItems: Container[] = [];

    this._items.forEach((item) => {
      if (currentItems.length >= this._options.count) {
        groups.push(this._createGroup(currentItems));
        currentItems = [];
      }

      currentItems.push(item);
    });

    if (currentItems.length > 0) {
      groups.push(this._createGroup(currentItems));
    }

    return groups;
  }

  /** @description 创建网格分组 */
  private _createGroup(items: Container[]) {
    let width = 0;
    let height = 0;

    items.forEach((item) => {
      width = Math.max(width, item.width);
      height = Math.max(height, item.height);
    });

    return {
      items,
      width,
      height,
    };
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
    if (this._options.scrollWidth !== undefined) {
      return this._options.scrollWidth;
    }

    return contentWidth;
  }

  /** @description 获取内容包围盒 */
  private _getContentBounds() {
    const itemBounds = this._getItemsBounds();
    const padding = this._getPadding();

    return {
      width: itemBounds.width + padding.left + padding.right,
      height:
        itemBounds.height +
        padding.top +
        padding.bottom +
        (this._options.scrollMarginTop ?? 0) +
        (this._options.scrollMarginBottom ?? 0),
    };
  }

  /** @description 获取子项包围盒 */
  private _getItemsBounds() {
    if (this._items.length <= 0) {
      return {
        width: 0,
        height: 0,
      };
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    this._items.forEach((item) => {
      minX = Math.min(minX, item.x);
      minY = Math.min(minY, item.y);
      maxX = Math.max(maxX, item.x + item.width);
      maxY = Math.max(maxY, item.y + item.height);
    });

    return {
      width: Math.max(0, maxX - minX),
      height: Math.max(0, maxY - minY),
    };
  }

  /** @description 获取布局内边距 */
  private _getPadding(): LibPixiGridPadding {
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
}
