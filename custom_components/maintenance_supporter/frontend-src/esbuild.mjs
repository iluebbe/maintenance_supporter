import { build } from "esbuild";
import { cpSync, mkdirSync, rmSync } from "fs";

// Content-hashed chunk names change every time their inputs change; esbuild
// writes the new files but never removes the old ones. Clear the chunks dir up
// front so stale, unreferenced chunks don't accumulate in git (they did before
// this — every frontend change left orphans behind).
rmSync("../frontend/strategy/chunks", { recursive: true, force: true });

// Stamp the integration version into every bundle (helpers/bundle-version.ts
// reads it) — the panel compares it against the backend at runtime and shows
// a "reload" banner when a stale cached bundle is running (roadmap guard 2;
// the #106 follow-up class: HA's service worker serves stale-while-revalidate,
// so "I updated and restarted" routinely still runs old frontend code).
import { readFileSync } from "node:fs";
const manifestVersion = JSON.parse(readFileSync("../manifest.json", "utf-8")).version;

const common = {
  bundle: true,
  format: "esm",
  target: "es2021",
  minify: true,
  sourcemap: false,
  external: [],
  define: { __MS_BUNDLE_VERSION__: JSON.stringify(manifestVersion) },
  // A readable banner as well as the define. After the minifier is done the
  // stamped version survives only as `var xy="2.44.1"` with a generated name,
  // which nothing outside the bundle can reliably find — so 2.44.0 shipped a
  // bundle built before the version bump and every install showed a permanent
  // "reload the panel" banner (#112). This line is what
  // tests/test_frontend_bundle_version.py checks, and it also lets anyone read
  // the built version straight out of devtools.
  banner: { js: `/*! maintenance_supporter frontend ${manifestVersion} */` },
};

// Panel — code-split (perf wave 2, item 5): the dialogs + settings view the
// panel dynamic-imports land in frontend/panel-chunks/ as content-hashed
// chunks, shrinking the entry's critical parse path. publicPath makes the
// chunk imports ABSOLUTE, because the entry is served from a versioned
// file URL (/maintenance_supporter_panel_<hash>) that has no directory for
// relative imports to resolve against. Cache-safety (#124 class): the
// entry URL changes with its content hash, and a fresh entry always names
// exactly its own content-hashed chunks.
rmSync("../frontend/panel-chunks", { recursive: true, force: true });
await build({
  ...common,
  entryPoints: ["maintenance-panel.ts"],
  outdir: "../frontend",
  splitting: true,
  chunkNames: "panel-chunks/[name]-[hash]",
  publicPath: "/maintenance_supporter_panelfiles",
});

// Lovelace Card
await build({
  ...common,
  entryPoints: ["maintenance-card.ts"],
  outfile: "../frontend/maintenance-card.js",
});

// Dashboard Strategy (HA 2026.5+ — silent no-op on older HA)
//
// v2.3.4 (issue #52): we MUST split dynamic imports out into separate
// chunks. HA's strategy loader has a 5 s timeout on
// customElements.whenDefined("ll-strategy-dashboard-..."); if the strategy
// bundle takes longer than that to download + parse + execute, the
// dashboard fails to open. Without splitting, esbuild inlines every
// dynamic import — strategy file ballooned to 510 KB pulling in 7 dialog
// components + 3 section cards. With splitting enabled, the strategy
// entry stays small (~13 KB) and registers customElements instantly;
// heavy components load lazily as separate chunks only when they're
// actually rendered.
//
// All output lands in ../frontend/strategy/ so HA can serve the directory
// as a single static-path mount and the entry's relative ./chunks/ imports
// resolve naturally without per-chunk URL registration.
await build({
  ...common,
  entryPoints: ["maintenance-dashboard-strategy.ts"],
  outdir: "../frontend/strategy",
  splitting: true,
  entryNames: "[name]",
  chunkNames: "chunks/[name]-[hash]",
});

// Dashboard-strategy registration shim (v2.8.1 — strategy timeout fix).
//
// HA loads frontend_extra_module_url entries as fire-and-forget import() with
// no ordering/await, then only waits ~5 s via whenDefined for a custom: strategy
// element. Under heavy HACS plugin load the full strategy bundle could lose that
// race (element downloaded but not yet executed). This tiny zero-import shim is
// what we register as the extra_module_url: it defines the dashboard tag
// synchronously (a few hundred bytes, no import graph) and lazy-import()s the
// heavy bundle above only on first generate()/getConfigElement().
await build({
  ...common,
  entryPoints: ["maintenance-strategy-shim.ts"],
  outfile: "../frontend/maintenance-strategy-shim.js",
});

// Calendar Card (v1.9.0+ — Lovelace card extracted from panel's Calendar tab)
await build({
  ...common,
  entryPoints: ["maintenance-calendar-card.ts"],
  outfile: "../frontend/maintenance-calendar-card.js",
});

// Copy the runtime-loaded locale tables into the served frontend dir. Only EN
// is bundled (imported by styles.ts); the other languages are fetched at
// runtime from frontend/locales/, so editing a translation needs no rebuild.
mkdirSync("../frontend/locales", { recursive: true });
cpSync("locales", "../frontend/locales", { recursive: true });

// v2.21: vendor pdf.js for the work sheet's inline manual excerpt. Copied,
// not bundled — the work-sheet page loads it on demand from VENDOR_URL, so
// the panel/card bundles stay untouched.
mkdirSync("../frontend/vendor", { recursive: true });
cpSync("node_modules/pdfjs-dist/legacy/build/pdf.min.mjs", "../frontend/vendor/pdf.min.mjs");
cpSync("node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs", "../frontend/vendor/pdf.worker.min.mjs");

console.log("Build complete.");
