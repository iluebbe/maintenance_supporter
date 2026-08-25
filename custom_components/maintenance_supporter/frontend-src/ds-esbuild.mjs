/** design-sync dist build: bundles ds-entry.ts into a single ESM file that
 * the design-sync converter consumes as `--entry`. Kept separate from
 * esbuild.mjs so the product build is untouched. Unminified on purpose —
 * the converter re-bundles it into the final IIFE, and readable output makes
 * converter diagnostics actionable. */
import { build } from "esbuild";
import { readFileSync } from "node:fs";

const manifestVersion = JSON.parse(readFileSync("../manifest.json", "utf-8")).version;

await build({
  entryPoints: ["ds-entry.ts"],
  outfile: "dist-ds/ds-entry.js",
  bundle: true,
  format: "esm",
  target: "es2021",
  minify: false,
  sourcemap: false,
  define: { __MS_BUNDLE_VERSION__: JSON.stringify(manifestVersion) },
  banner: { js: `/*! maintenance_supporter design-system entry ${manifestVersion} */` },
});
console.log("ds dist built: dist-ds/ds-entry.js");
