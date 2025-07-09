import { defineConfig } from "vitest/config";
import tsConfigOptions from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigOptions()],
  test: {
    coverage: {
      all: false,
    },
  },
});
