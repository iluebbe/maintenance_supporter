/**
 * Tripwire: dates, times AND numbers have ONE formatting authority —
 * styles.ts — and dates ONE input element — <ms-date-field> (#163).
 *
 * History: maisun set "Date format: DMY" in the HA profile and still saw
 * mm/dd/yyyy. Two leak classes, both invisible to the component tests
 * because those run in a single browser locale:
 *
 *   1. A component formatted through Intl / toLocaleDateString itself
 *      (battery-fleet roster) instead of styles.ts formatDate — bypassing the
 *      profile prefs that formatDate honours.
 *   2. Fourteen native <input type="date|time|datetime-local"> in eight
 *      components rendered in the BROWSER locale; nothing can restyle them.
 *
 * Three rules, checked against the raw TypeScript of every production module
 * (served by the source-manifest plugin in web-test-runner.config.mjs):
 *
 *   A. No native date/time inputs anywhere — use <ms-date-field kind=…>,
 *      which wraps <ha-selector> (HA's pickers follow the profile).
 *   B. Only styles.ts may call Intl.DateTimeFormat / Intl.NumberFormat /
 *      toLocaleDateString / toLocaleTimeString / toLocaleString. Need a new
 *      shape? Add a helper there (formatDate, formatDateTime, formatDateShort,
 *      formatTimeOfDay, formatWeekday, formatMonth, weekdayName, monthName,
 *      formatNumber, formatCost).
 *   C. Every top-level surface (Lovelace card / panel) whose import closure
 *      formats dates or numbers must feed the profile into the prefs
 *      singleton via syncLocaleFromHass(this, changedProps) in updated() — or
 *      delegate to a rendered child that does (ROOT_DELEGATES). Without it
 *      the formatters silently fall back to the language default.
 *   D. No toFixed / toPrecision outside styles.ts and chart-utils px(): a
 *      cost rendered as `x.toFixed(2)` is "12.50" under a decimal_comma
 *      profile (the number_format half of #163).
 */

import { expect } from "@open-wc/testing";

type Manifest = Record<string, string>;

const AUTHORITY = "styles.ts";
const PROFILE_FORMATTERS =
  /\b(formatDate|formatDateTime|formatDateShort|formatTimeOfDay|formatWeekday|formatMonth|weekdayName|monthName|fmtDateTick|fmtDateTime|formatNumber|formatCost|fmtNum|fmtVal|formatBytes)\b/;
const NATIVE_DATE_INPUT = /\btype=["'`](date|time|datetime-local|month|week)["'`]/;
const DIRECT_INTL: Array<[string, RegExp]> = [
  ["Intl.DateTimeFormat(", /\bIntl\.DateTimeFormat\s*\(/],
  ["Intl.NumberFormat(", /\bIntl\.NumberFormat\s*\(/],
  [".toLocaleDateString(", /\.toLocaleDateString\s*\(/],
  [".toLocaleTimeString(", /\.toLocaleTimeString\s*\(/],
  [".toLocaleString(", /\.toLocaleString\s*\(/],
];
/** Lovelace cards implement setConfig(); the panel is the @customElement root. */
const ROOT_SURFACE = /\bsetConfig\s*\(|@customElement\(\s*["']maintenance-supporter-panel["']/;
/** toFixed/toPrecision give "12.50" whatever the profile says. SVG/CSS
 *  coordinates legitimately need exactly that — chart-utils px() is the one
 *  sanctioned wrapper; human-facing figures use formatNumber. */
const FIXED_DIGITS = /\.(toFixed|toPrecision)\s*\(/;
const GEOMETRY_HELPER = "renderers/chart-utils.ts";
/** The per-updated() helper, or the raw primitive for hosts without a Lit update cycle. */
const SYNC_CALL = /\b(syncLocaleFromHass|setProfilePrefs)\s*\(/;
/** Roots whose sync lives in a module they render / load instead of in the root itself. */
const ROOT_DELEGATES: Record<string, string> = {
  "components/battery-fleet-card.ts": "components/battery-fleet-section.ts",
  // The strategy renders nothing itself — its dates live in the dialogs that
  // dialog-mount opens from entity rows, and dialog-mount pulls hass on its
  // own, so the sync sits there (found by this rule: it did the language
  // boot but not the date prefs).
  "maintenance-dashboard-strategy.ts": "dialog-mount.ts",
};

let manifest: Manifest;

before(async () => {
  const resp = await fetch("/__source-manifest");
  expect(resp.ok, "source manifest served by web-test-runner.config.mjs").to.be.true;
  manifest = await resp.json();
  expect(Object.keys(manifest).length, "manifest lists the production modules").to.be.greaterThan(50);
  expect(manifest[AUTHORITY], "styles.ts is in the manifest").to.be.a("string");
});

/** Code lines only — a comment may legitimately NAME the banned API. */
function codeLines(src: string): Array<[number, string]> {
  const out: Array<[number, string]> = [];
  let inBlock = false;
  src.split(/\r?\n/).forEach((line, i) => {
    const s = line.trim();
    if (inBlock) {
      if (s.includes("*/")) inBlock = false;
      return;
    }
    if (s.startsWith("//")) return;
    if (s.startsWith("/*") || s.startsWith("/**")) {
      if (!s.includes("*/")) inBlock = true;
      return;
    }
    if (s.startsWith("*")) return;
    out.push([i + 1, line]);
  });
  return out;
}

function dirname(path: string): string {
  const i = path.lastIndexOf("/");
  return i < 0 ? "" : path.slice(0, i);
}

function resolveImport(from: string, spec: string): string | undefined {
  if (!spec.startsWith(".")) return undefined; // bare specifier (lit, …)
  const parts = (dirname(from) ? `${dirname(from)}/${spec}` : spec).split("/");
  const out: string[] = [];
  for (const p of parts) {
    if (p === "." || p === "") continue;
    if (p === "..") out.pop();
    else out.push(p);
  }
  const joined = out.join("/").replace(/\.js$/, "");
  return joined.endsWith(".ts") ? joined : `${joined}.ts`;
}

function importsOf(path: string): string[] {
  const src = manifest[path] || "";
  const specs = new Set<string>();
  for (const m of src.matchAll(/^\s*import\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/gm)) specs.add(m[1]);
  for (const m of src.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g)) specs.add(m[1]);
  return [...specs].map((s) => resolveImport(path, s)).filter((p): p is string => !!p && p in manifest);
}

function importClosure(root: string): Set<string> {
  const seen = new Set<string>([root]);
  const stack = [root];
  while (stack.length) {
    for (const dep of importsOf(stack.pop()!)) {
      if (!seen.has(dep)) {
        seen.add(dep);
        stack.push(dep);
      }
    }
  }
  return seen;
}

describe("date/time formatting has a single source (#163 tripwire)", () => {
  it("A. no native <input type=date|time|datetime-local> — use <ms-date-field>", () => {
    const hits: string[] = [];
    for (const [path, src] of Object.entries(manifest)) {
      for (const [n, line] of codeLines(src)) {
        if (NATIVE_DATE_INPUT.test(line)) hits.push(`${path}:${n}: ${line.trim()}`);
      }
    }
    expect(hits, "native date/time inputs render in the BROWSER locale, not the HA profile format").to.deep.equal([]);
  });

  it("B. only styles.ts talks to Intl for dates, times and numbers", () => {
    const hits: string[] = [];
    for (const [path, src] of Object.entries(manifest)) {
      if (path === AUTHORITY) continue;
      for (const [n, line] of codeLines(src)) {
        for (const [label, re] of DIRECT_INTL) {
          if (re.test(line)) hits.push(`${path}:${n}: ${label} — ${line.trim()}`);
        }
      }
    }
    expect(hits, "direct Intl calls bypass the HA profile date/time/number prefs — add a helper to styles.ts instead").to.deep.equal([]);
  });

  it("B'. styles.ts itself still owns the formatting (guards against the rule going stale)", () => {
    const src = manifest[AUTHORITY];
    expect(src).to.match(/\.toLocaleDateString\s*\(/);
    expect(src).to.match(/\.toLocaleTimeString\s*\(/);
    expect(src).to.match(/\bIntl\.NumberFormat\s*\(/);
    for (const name of ["formatDate", "formatDateTime", "formatDateShort", "formatTimeOfDay", "formatWeekday", "formatMonth", "weekdayName", "monthName", "formatNumber", "formatCost"]) {
      expect(src, `styles.ts exports ${name}`).to.match(new RegExp(`export function ${name}\\(`));
    }
  });

  it("C. every root surface that formats dates or numbers syncs the profile prefs", () => {
    const roots = Object.keys(manifest).filter((p) => ROOT_SURFACE.test(manifest[p]));
    expect(roots, "root-surface detection still finds the panel and the cards").to.include.members([
      "maintenance-panel.ts",
      "maintenance-card.ts",
      "maintenance-calendar-card.ts",
    ]);
    const problems: string[] = [];
    for (const root of roots) {
      const closure = importClosure(root);
      const formatting = [...closure].filter((p) => p !== AUTHORITY && codeLines(manifest[p]).some(([, l]) => PROFILE_FORMATTERS.test(l)));
      if (!formatting.length) continue; // renders no dates — nothing to sync
      const delegate = ROOT_DELEGATES[root];
      const synced = SYNC_CALL.test(manifest[root]) || (!!delegate && closure.has(delegate) && SYNC_CALL.test(manifest[delegate]));
      if (!synced) {
        problems.push(`${root} formats dates/numbers via ${formatting.slice(0, 3).join(", ")}${formatting.length > 3 ? ", …" : ""} but never calls syncLocaleFromHass(this, changedProps)`);
      }
    }
    expect(problems).to.deep.equal([]);
  });

  it("D. no toFixed / toPrecision outside styles.ts and chart-utils px()", () => {
    const hits: string[] = [];
    for (const [path, src] of Object.entries(manifest)) {
      if (path === AUTHORITY || path === GEOMETRY_HELPER) continue;
      for (const [n, line] of codeLines(src)) {
        if (FIXED_DIGITS.test(line)) hits.push(`${path}:${n}: ${line.trim()}`);
      }
    }
    expect(hits, "toFixed ignores the HA profile number format — formatNumber(n, lang, digits) for figures, px(n) for SVG/CSS coordinates").to.deep.equal([]);
  });

  it("D'. chart-utils px() is the sanctioned toFixed (guards against the rule going stale)", () => {
    expect(manifest[GEOMETRY_HELPER]).to.match(/export function px\(/);
    expect(manifest[GEOMETRY_HELPER]).to.match(/\.toFixed\s*\(/);
  });

  it("C'. the closure walk sees through the panel (guards against the rule going stale)", () => {
    const closure = importClosure("maintenance-panel.ts");
    expect(closure.has("components/battery-fleet-section.ts"), "panel → battery-fleet-section").to.be.true;
    expect(closure.has("renderers/chart-utils.ts"), "panel → … → chart-utils").to.be.true;
    expect(closure.has(AUTHORITY)).to.be.true;
  });
});
