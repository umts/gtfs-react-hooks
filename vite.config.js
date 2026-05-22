import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      name: "GtfsReactHooks",
      entry: resolve(import.meta.dirname, "lib/index.js"),
      fileName: "gtfs-react-hooks",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["gtfs-realtime-bindings", "react"],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.js"],
    coverage: {
      enabled: true,
      include: ["lib/**/*"],
      thresholds: {
        100: true,
      },
    },
  },
});
