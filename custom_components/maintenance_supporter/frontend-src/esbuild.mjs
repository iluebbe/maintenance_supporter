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
await build({
  ...common,
  entryPoints: ["maintenance-dashboard-strategy.ts"],
  outfile: "../frontend/maintenance-dashboard-strategy.js",
});

// Calendar Card (v1.9.0+ — Lovelace card extracted from panel's Calendar tab)
await build({
  ...common,
  entryPoints: ["maintenance-calendar-card.ts"],
  outfile: "../frontend/maintenance-calendar-card.js",
});

console.log("Build complete.");
