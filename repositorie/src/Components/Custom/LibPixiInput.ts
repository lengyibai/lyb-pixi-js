import { Container, Ticker } from "pixi.js";
import Decimal from "decimal.js";
import { libPixiEvent } from "../../Utils/LibPixiEvent";
import { libPixiScaleContainer } from "../../Utils/LibPixiScaleContainer";
import { LibPixiContainer } from "../Base/LibPixiContainer";
import { LibPixiText } from "../Base/LibPixiText";

interface Params {
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 字体与高度比 */
  fontSizeRatio?: number;
  /** 使用字体 */
  fontFamily?: string;
  /** 是否加粗 */
  bold?: boolean;
  /** 是否需要placeholder */
  placeholder?: string;
  /** placeholder颜色 */
  placeholderColor?: string;
  /** 背景色，用于调试输入框的位置 */
  bgColor?: string;
  /** 输入类型 */
  type?: "number" | "text" | "password";
  /** 字体颜色 */
  color?: string;
  /** 初始值 */
  value?: string;
  /** 是否整数 */
  integer?: boolean;
  /** 是否允许输入负数 */
  isNegative?: boolean;
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 最大长度 */
  maxLength?: number;
  /** 对齐方式 */
  align?: "left" | "center";
  /** 输入回调 */
  onInput?: (text: number | string) => void;
  /** 失去焦点回调 */
  onValue?: (text: number | string) => void;
  /** 格式化显示值 */
  onFormatValue?: (text: number | string) => string;
}

/** @description 动态缩放移动输入框 */
export class LibPixiInput extends LibPixiContainer {
  /** 舞台 */
  static stage: Container;
  /** 参数 */
  private _params: Params;
  /** 只读输入框 */
  private _readonlyInput!: LibPixiText;
  /** placeholder */
  private _placeholder!: LibPixiText;
  /** 输入框dom */
  private _input!: HTMLInputElement;

  /** 当前输入的值 */
  private _value = "";

  constructor(params: Params) {
    const { width, height, bgColor, value = "" } = params;

    super(width, height, bgColor);

    this.cursor = "text";
    this._params = params;
    this._value = value;

    this._createInput();
    this._createReadOnlyInput();

    //聚焦
    libPixiEvent(this, "pointertap", this._focus.bind(this));

    const ticker = new Ticker();
    ticker.add(() => {
      if (this.destroyed) {
        ticker.stop();
        return;
      }
      this._updateInputPosition();
    });
    ticker.start();
  }

  /** @description 设置值 */
  setValue(v: string) {
    const { onFormatValue, type = "text" } = this._params;

    const value = v;
    this._value = value;

    if (type === "password") {
      this._readonlyInput.text =
        onFormatValue?.(value) || "●".repeat(value.length);
    } else {
      this._readonlyInput.text = onFormatValue?.(value) || value;
    }
  }

  /** @description 创建输入框 */
  private _createInput() {
    const {
      color = "#fff",
      maxLength = 999999,
      align = "left",
      type = "text",
      onInput = () => {},
      fontFamily = "",
      bold = false,
    } = this._params;

    this._input = document.createElement("input");
    this._input.type = type;
    this._input.maxLength = maxLength;
    this._input.style.cssText = `
      position: absolute;
      border: none;
      outline: none;
      display: none;
      background-color: transparent;
      color: ${color};
      text-align: ${align};
      font-family: ${fontFamily};
      font-weight: ${bold ? "bold" : "normal"}
      `;
    document.querySelector("#game")!.appendChild(this._input);

    this._input.addEventListener("input", function () {
      if (this.value.length > maxLength && type === "number") {
        this.value = this.value.slice(0, maxLength);
      }
      onInput(this.value.trim());
    });
    this._input.addEventListener("paste", function (e) {
      const paste = e.clipboardData?.getData("text") ?? "";
      if (paste.length > maxLength) {
        e.preventDefault();
        this.value = paste.slice(0, maxLength);
      }
    });
    this._input.addEventListener("blur", this._blur.bind(this));
  }

  /** @description 创建只读输入框 */
  private _createReadOnlyInput() {
    const {
      color = "#fff",
      value = "",
      width,
      height,
      fontSizeRatio = 0.5,
      align = "left",
      placeholder = "",
      placeholderColor,
      fontFamily = "",
      bold = false,
    } = this._params;

    //创建描述
    this._placeholder = new LibPixiText({
      text: placeholder,
      fontColor: placeholderColor,
      fontSize: height * fontSizeRatio,
      fontFamily,
      fontWeight: bold ? "bold" : "normal",
    });
    this.addChild(this._placeholder);
    this._placeholder.visible = !value;
    this._placeholder.anchor.set(align === "left" ? 0 : 0.5, 0.5);
    this._placeholder.position.set(
      align === "left" ? 0 : width / 2,
      height / 2
    );

    //创建实际显示的文本
    this._readonlyInput = new LibPixiText({
      text: value,
      fontColor: color,
      fontSize: height * fontSizeRatio,
      fontFamily,
      fontWeight: bold ? "bold" : "normal",
    });
    this.addChild(this._readonlyInput);
    this._readonlyInput.visible = !!value;
    this._readonlyInput.anchor.set(align === "left" ? 0 : 0.5, 0.5);
    this._readonlyInput.position.set(
      align === "left" ? 0 : width / 2,
      height / 2
    );
  }

  /** @description 聚焦 */
  private _focus() {
    const { type } = this._params;

    this._input.style.display = "block";
    this._input.focus();
    this._readonlyInput.visible = false;
    this._placeholder.visible = false;

    if (type === "number") {
      this._input.value = this._value && Number(this._value).toString();
    } else {
      this._input.value = this._value;
    }
  }

  /** @description 失焦 */
  private _blur() {
    const { onValue, width } = this._params;

    const value = this._onBlurHandler();
    this.setValue(value);
    this._input.style.display = "none";
    libPixiScaleContainer(this._readonlyInput, width);

    if (this._params.type === "number") {
      this._readonlyInput.visible = true;
      onValue?.(Number(value));
    } else {
      onValue?.(value);

      //如果输入的值为空，并且启用了描述，并且没有默认值，则显示描述
      if (value === "" && this._placeholder) {
        this._placeholder.visible = true;
      } else {
        this._readonlyInput.visible = true;
      }
    }
  }

  /** @description 失去焦点处理 */
  private _onBlurHandler = () => {
    const {
      type = "text",
      integer = false,
      min = 1,
      max = Infinity,
    } = this._params;

    let text = this._input.value.trim();

    //如果类型为字符串，则不参与校验
    if (["text", "password"].includes(type)) return text;

    //如果为空，则使用最小值
    if (this._input.value === "") text = min.toString();

    //如果不能为负数，输入值小于最小值，则使用最小值
    if (Number(text) < min) text = min.toString();

    //如果存在最大值，且输入值大于最大值，则使用最大值
    if (max && Number(text) > max) text = max.toString();

    //如果要求整数，则取整
    if (integer) text = parseInt(text).toString();

    //保留两位小数且不四舍五入
    const value = new Decimal(Number(text));
    text = value.toFixed(2, Decimal.ROUND_DOWN);

    return text;
  };

  /** @description 实时更新输入框位置 */
  private _updateInputPosition() {
    const { width, height, x, y } = this.getBounds();
    const { fontSizeRatio = 0.5 } = this._params;

    this._input.style.width = `${width}px`;
    this._input.style.height = `${height}px`;
    this._input.style.fontSize = `${height * fontSizeRatio}px`;

    if (LibPixiInput.stage.rotation === 0) {
      this._input.style.left = `${x}px`;
      this._input.style.top = `${y}px`;
      this._input.style.width = `${width}px`;
      this._input.style.height = `${height}px`;
      this._input.style.fontSize = `${height * fontSizeRatio}px`;
      this._input.style.transform = `rotate(0deg)`;
    } else {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      this._input.style.left = `${centerX - height / 2}px`;
      this._input.style.top = `${centerY - width / 2}px`;
      this._input.style.width = `${height}px`;
      this._input.style.height = `${width}px`;
      this._input.style.fontSize = `${width * fontSizeRatio}px`;
      this._input.style.transform = `rotate(90deg)`;
    }
  }

  /** @description 设置输入框类型 */
  toggleType(type: "text" | "password") {
    this._input.type = type;
    this._params.type = type;

    this.setValue(this._value);
  }
}
