import { build } from "esbuild";

const common = {
  bundle: true,
  format: "esm",
  target: "es2021",
  minify: true,
  sourcemap: false,
  external: [],
};

// Panel
await build({
  ...common,
  entryPoints: ["maintenance-panel.ts"],
  outfile: "../frontend/maintenance-panel.js",
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

console.log("Build complete.");
