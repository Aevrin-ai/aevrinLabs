import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

// Tests run on the same Vite config as the site, so the @ alias and the React
// transform behave exactly as they do in the build.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.ts"],
      css: false,
      restoreMocks: true,
    },
  })
);
