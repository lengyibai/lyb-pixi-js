import { libJsDecimal } from "lyb-js/Math/LibJsDecimal.js";
import { Container, Sprite, Texture } from "pixi.js";

/** @description 设计图背景拼接
 * @link 使用方法：https://www.npmjs.com/package/lyb-pixi-js#LibPixiPuzzleBg-设计图背景拼接
 */
export class LibPixiPuzzleBg extends Container {
  constructor(texture: Texture) {
    super();

    this.eventMode = "none";

    // 背景
    const bg = new Sprite(texture);
    this.addChild(bg);
    bg.visible = false;

    //读取配置
    const config = JSON.parse(localStorage.getItem("puzzle_bg_config") || "{}");
    const { alpha, x, y } = config;
    bg.alpha = alpha || 0.25;
    bg.position.set(x || 0, y || 0);

    //监听鼠标空格事件
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "q" && !e.shiftKey) {
        e.preventDefault();
        bg.visible = !bg.visible;
      } else if (e.code === "ArrowUp") {
        bg.y -= 2;
      } else if (e.code === "ArrowDown") {
        bg.y += 2;
      } else if (e.code === "ArrowLeft") {
        bg.x -= 2;
      } else if (e.code === "ArrowRight") {
        bg.x += 2;
      }

      if (e.code === "NumpadAdd" && bg.alpha < 1) {
        bg.alpha = libJsDecimal(bg.alpha, 0.1, "+");
      } else if (e.code === "NumpadSubtract" && bg.alpha > 0) {
        bg.alpha = libJsDecimal(bg.alpha, 0.1, "-");
      }

      localStorage.setItem("puzzle_bg_config", JSON.stringify({ alpha: bg.alpha, x: bg.x, y: bg.y }));
    });
  }
}
