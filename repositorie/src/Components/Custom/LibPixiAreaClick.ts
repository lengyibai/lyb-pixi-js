import { Container, Sprite } from "pixi.js";

/** @description 扩大点击范围 */
export class LibPixiAreaClick extends Container {
  constructor(w: number, h: number) {
    super();

    const fill = new Sprite();
    this.addChild(fill);
    fill.anchor.set(0.5);

    fill.width = w;
    fill.height = h;
  }

  push(container: Container) {
    this.addChild(container);
    container.position.set(-container.width / 2, -container.height / 2);
  }
}
