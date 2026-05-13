import * as Base from "./Components/Base/index.js";
import * as Custom from "./Components/Custom/index.js";
import * as Utils from "./Utils/index.js";

export * from "./Components/Base/index.js";
export * from "./Components/Custom/index.js";
export * from "./Utils/index.js";

export const LibPixi = {
  Components: {
    Base,
    Custom,
  },
  Utils,
};

export { Base, Custom, Utils };
