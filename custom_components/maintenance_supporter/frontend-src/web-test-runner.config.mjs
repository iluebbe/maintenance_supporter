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

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";
import { defaultReporter, summaryReporter } from "@web/test-runner";

/** Source-level tripwires (e.g. profile-format-single-source.test.ts) need the
 *  RAW TypeScript of every production module, but a browser test can neither
 *  list directories nor bypass the esbuild transform. This serves
 *  `/__source-manifest` = { "<relative path>": "<source>" } for every
 *  .ts file outside __tests__/ and node_modules/. */
const SOURCE_ROOT = fileURLToPath(new URL(".", import.meta.url));
const SKIP_DIRS = new Set(["__tests__", "node_modules", "dist-ds", "screenshots", "locales"]);
function collectSources(dir, out) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name)) collectSources(full, out);
    } else if (name.endsWith(".ts") && !name.endsWith(".d.ts")) {
      out[relative(SOURCE_ROOT, full).split("\\").join("/")] = readFileSync(full, "utf-8");
    }
  }
  return out;
}
const sourceManifestPlugin = {
  name: "source-manifest",
  serve(context) {
    if (context.path === "/__source-manifest") {
      return { body: JSON.stringify(collectSources(SOURCE_ROOT, {})), type: "json" };
    }
    return undefined;
  },
};

export default {
  files: "__tests__/**/*.test.ts",
  nodeResolve: true,
  plugins: [
    sourceManifestPlugin,
    esbuildPlugin({
      ts: true,
      json: true,
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
