import { Container, Ticker } from "pixi.js";
import gsap from "gsap";
import { libPixiFilter } from "../../Utils/LibPixiFilter";
import { libJsCopy } from "lyb-js/Browser/LibJsCopy.js";

/** @description 元素拖拽定位 */
export class LibPixiDragLocate extends Container {
  static stage: Container;

  /** 输入框 */
  private _inputEl!: HTMLInputElement;
  /** 搜索结果 */
  private _resultEl!: HTMLDivElement;
  /** 状态栏元素 */
  private _statusBarEl!: HTMLDivElement;
  /** 坐标元素 */
  private _positionEl!: HTMLDivElement;
  /** 当前坐标值 */
  private _positionValue = "";

  /** 是否处于定位状态 */
  private _isLocalte = false;
  /** 是否显示输入框 */
  private _showInput = false;
  /** 是否允许移动 */
  private _allowMove = false;
  /** 按下坐标 */
  private _downPos = { x: 0, y: 0 };

  /** 当前处于移动的元素 */
  private _currentMoveContainer?: Container;

  constructor() {
    super();

    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "q" && e.shiftKey) {
        e.preventDefault();
        if (this._isLocalte) return;
        this._showInput = !this._showInput;
      }

      if (e.key === "Escape") {
        this._showInput = false;
      }
    });

    this._createInput();
    this._createResultList();
    this._createStatusBar();

    LibPixiDragLocate.stage.on("pointerdown", (event) => {
      if (!this._currentMoveContainer) return;
      this._allowMove = true;
      const { x, y } = LibPixiDragLocate.stage.toLocal(event.global);
      this._downPos = { x, y };
    });

    LibPixiDragLocate.stage.on("pointermove", (event) => {
      if (!this._allowMove || !this._currentMoveContainer) return;

      const { x, y } = LibPixiDragLocate.stage.toLocal(event.global);
      const dx = x - this._downPos.x;
      const dy = y - this._downPos.y;

      this._currentMoveContainer.x += dx;
      this._currentMoveContainer.y += dy;

      this._downPos = { x, y };

      const posX = Math.round(this._currentMoveContainer.x);
      const posY = Math.round(this._currentMoveContainer.y);
      this._positionEl.textContent = `X: ${posX}, Y: ${posY}`;
      this._positionValue = `xxx.position.set(${posX}, ${posY})`;
    });

    LibPixiDragLocate.stage.on(
      "pointerup",
      () => {
        this._allowMove = false;
      },
      this
    );

    Ticker.shared.add(() => {
      if (this._showInput) {
        if (this._isLocalte) {
          this._inputEl.style.display = "none";
          this._resultEl.style.display = "none";
          this._statusBarEl.style.display = "flex";
        } else {
          this._inputEl.style.display = "block";
          this._resultEl.style.display = "flex";
          this._statusBarEl.style.display = "none";
          this._inputEl.focus();
        }
      } else {
        this._inputEl.style.display = "none";
        this._resultEl.style.display = "none";
      }
    });
  }

  /** @description 创建输入框 */
  private _createInput() {
    this._inputEl = document.createElement("input");
    this._inputEl.type = "text";
    this._inputEl.style.cssText = `
      background-color: rgba(0,0,0,0.75);
      border: 2px solid rgba(255,255,255,0.5);
      color: #fff;
      display: none;
      font-size: 25px;
      height: 50px;
      left: 50%;
      outline: none;
      position: fixed;
      text-align: center;
      top: 25%;
      transform: translate(-50%, -50%);
      width: 50vw;
    `;
    document.body.appendChild(this._inputEl);
    this._inputEl.addEventListener("input", () => {
      const results = this._findByName(
        LibPixiDragLocate.stage,
        this._inputEl.value
      );

      //创建搜索结果列表
      this._resultEl.innerHTML = "";

      const renderNode = (item: TreeNode) => {
        const resultEl = this._createResultEl(
          item.node.constructor.name,
          item.node.name!,
          item.depth
        );
        this._resultEl.appendChild(resultEl);
        gsap.killTweensOf(item.node);

        //悬浮结果列表元素闪烁
        resultEl.addEventListener("mouseenter", () => {
          gsap.to(item.node, {
            alpha: 0,
            duration: 0.25,
            yoyo: true,
            ease: "none",
            repeat: -1,
          });
        });

        //离开结果后停止闪烁
        resultEl.addEventListener("mouseleave", () => {
          gsap.killTweensOf(item.node);
          item.node.alpha = 1;
        });

        resultEl.addEventListener("click", () => {
          gsap.killTweensOf(item.node);
          this._currentMoveContainer = item.node;
          item.node.alpha = 1;
          item.node.filters = [libPixiFilter("desaturate", 0)];
          this._isLocalte = true;
        });

        item.children.forEach(renderNode);
      };

      results.forEach(renderNode);
    });
  }

  /** @description 创建用于展示搜索结果的列表 */
  private _createResultList() {
    this._resultEl = document.createElement("div");
    this._resultEl.style.cssText = `
      background-color: rgba(0,0,0,0.75);
      border: 2px solid rgba(255,255,255,0.5);
      left: 50%;
      transform: translateX(-50%);
      height: 300px;
      overflow-y: auto;
      position: fixed;
      display: none;
      gap: 10px;
      flex-direction: column;
      top: calc(25% + 50px);
      width: 50vw;
    `;
    document.body.appendChild(this._resultEl);
  }

  /** @description 创建搜索结果元素 */
  private _createResultEl(className: string, tagName: string, depth: number) {
    const resultItem = document.createElement("div");
    resultItem.style.cssText = `
      display: flex;
      justify-content: space-between;
      padding: 5px 10px;
      align-items: center;
      width: 100%;
      font-size: 25px;
      background-color: rgba(255,255,255,0.1);
      color: #fff;
      padding-left: ${depth * 20}px;
    `;

    const classNameEl = document.createElement("div");
    classNameEl.textContent = className;
    resultItem.appendChild(classNameEl);

    const tagNameEl = document.createElement("div");
    tagNameEl.textContent = tagName;
    resultItem.appendChild(tagNameEl);

    return resultItem;
  }

  /** @description 创建状态栏 */
  private _createStatusBar() {
    this._statusBarEl = document.createElement("div");
    this._statusBarEl.style.cssText = `
      align-items: center;
      background-color: rgba(0,0,0,0.75);
      border: 2px solid rgba(0, 255, 13, 0.5);
      color: #fff;
      display: none;
      font-size: 25px;
      justify-content: center;
      position: fixed;
      top: 25%;
      height: 50px;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50vw;
    `;

    this._positionEl = document.createElement("div");
    this._statusBarEl.appendChild(this._positionEl);
    document.body.appendChild(this._statusBarEl);
    this._statusBarEl.addEventListener("click", () => {
      this._isLocalte = false;
      libJsCopy(this._positionValue);
      if (this._currentMoveContainer) {
        this._currentMoveContainer.filters = [];
        this._currentMoveContainer = undefined;
      }
    });
  }

  /** @description 递归搜索 */
  private _findByName(root: Container, keyword: string): TreeNode[] {
    if (!keyword) return [];

    const match = (node: Container) =>
      node.name?.toLowerCase().includes(keyword.toLowerCase()) ||
      node.constructor.name.toLowerCase().includes(keyword.toLowerCase());

    const dfs = (node: Container, depth: number): TreeNode[] => {
      const children = node.children
        .filter((c): c is Container => c instanceof Container)
        .flatMap((c) => dfs(c, depth + 1));

      if (match(node) || children.length > 0) {
        return [
          {
            node,
            depth,
            children,
            expanded: true,
          },
        ];
      }

      return [];
    };

    return dfs(root, 0);
  }
}

interface TreeNode {
  node: Container;
  depth: number;
  children: TreeNode[];
  expanded: boolean;
}
