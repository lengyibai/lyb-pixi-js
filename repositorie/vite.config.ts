import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../npm",
    lib: {
      formats: ["umd"],
      entry: "main.ts",
      name: "LibPixiJs",
      fileName: () => `lyb-pixi.js`,
    },
  },
});
