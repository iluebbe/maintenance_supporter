/**
 * Lit-component test runner for the panel UI.
 *
 * Runs in real Chromium (headless) but mounts components in isolation
 * with mocked hass — no HA shell, no shadow-DOM-deep-piercing nightmares.
 * Each test is ~10-50ms, the whole suite runs in seconds.
 *
 *   npm test              — one-shot
 *   npm run test:watch    — watch mode
 */

import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";
import { defaultReporter, summaryReporter } from "@web/test-runner";

export default {
  files: "__tests__/**/*.test.ts",
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      ts: true,
      target: "es2020",
      tsconfig: "./tsconfig.json",
    }),
  ],
  browsers: [
    playwrightLauncher({
      product: "chromium",
      // Channel-less; uses bundled chromium from playwright cache.
    }),
  ],
  testFramework: {
    config: { ui: "bdd", timeout: "5000" },
  },
  coverage: false,
  reporters: [
    summaryReporter(),
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
  ],
};
