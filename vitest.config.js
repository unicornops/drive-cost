import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

/**
 * Vitest configuration for the drive-cost app
 *
 * - Uses the Vue plugin so SFCs are handled correctly
 * - Runs tests in a jsdom environment (DOM APIs available)
 * - Enables globals (describe/it/expect) for terser tests
 * - Points to a test setup file for matchers (e.g. @testing-library/jest-dom)
 * - Produces coverage reports (text + lcov) suitable for CI
 */
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    // Match typical unit test file patterns, including Vue SFC tests
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,vue}"],
    // Optional setup file where you can import jest-dom or other globals
    setupFiles: "src/test/setupTests.js",
    // Coverage config - useful in CI
    coverage: {
      provider: "v8", // fast JS coverage provider in Node >= 14
      reporter: ["text", "lcov"],
      all: true,
      // only collect coverage from source files
      include: ["src/**/*.{js,ts,vue}"],
      exclude: [
        "src/main.js",
        "src/style.css",
        "src/**/__tests__/**",
        "tests/**",
        "node_modules/**",
      ],
    },
    // Sometimes Vue libs need to be inlined for vitest to handle ESM correctly
    deps: {
      inline: ["@vue", "vue"],
    },
    // Increase hook timeout if CI runners are slower
    testTimeout: 10000,
  },
});
