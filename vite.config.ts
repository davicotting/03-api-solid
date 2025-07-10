import { defineConfig } from "vitest/config";
import tsConfigOptions from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigOptions()],
  test: {
    dir: "src",
    workspace: [
      {
        extends: true,
        test: {
          name: "unit",
          dir: "src/use-cases",
        },
      },
      {
        extends: true,
        test: {
          name: "e2e",
          dir: "src/http/controllers",
          environment:
            "./prisma/vitest-enviroment-prisma/prisma-test-enviroment.ts",
        },
      },
    ],
  },
});
