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

console.log("Build complete.");
