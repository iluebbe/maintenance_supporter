/** Generate `dtsPropsFor` bodies for .design-sync/config.json from the Lit
 * `@property()`/public-field declarations of each mapped component.
 *
 * The design-sync converter extracts React props via ts-morph — Lit reactive
 * properties are invisible to it, so every <Name>Props came out empty. This
 * harvests the real element API (public @property fields incl. their JSDoc
 * line where present) and rewrites config.json's dtsPropsFor. Re-run after
 * adding/renaming public properties, then rebuild.
 *
 *   node .design-sync/gen-dts-props.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONFIG = ".design-sync/config.json";
const PKG_DIR = "custom_components/maintenance_supporter/frontend-src";

const cfg = JSON.parse(readFileSync(CONFIG, "utf8"));
const out = {};

// Matches every reactive public property: `@property(...) public name: Type`,
// `@property(...) public name = <literal>` (type inferred from the default),
// optional/definite markers included. @state/private/protected are internal
// and deliberately skipped. A get/set pair matches twice — deduped by name.
const PROP_RX = /@property\([^)]*\)\s+(?:public\s+)?(?:get\s+|set\s+)?([A-Za-z_$][\w$]*)([?!]?)\s*(?::\s*([^;=\n]+?))?\s*(?:=\s*([^;\n]+))?;/g;

const inferType = (dflt) => {
  const d = (dflt ?? "").trim();
  if (/^["'`]/.test(d)) return "string";
  if (/^(true|false)$/.test(d)) return "boolean";
  if (/^-?[\d.]+$/.test(d)) return "number";
  if (/^\[/.test(d)) return "unknown[]";
  if (/^null$/.test(d)) return "unknown | null";
  return "unknown";
};

for (const [name, rel] of Object.entries(cfg.componentSrcMap ?? {})) {
  if (!rel) continue;
  const src = readFileSync(join(PKG_DIR, rel), "utf8");
  const seen = new Set();
  const props = [];
  let m;
  PROP_RX.lastIndex = 0;
  while ((m = PROP_RX.exec(src)) !== null) {
    const [, prop, opt, typeRaw, dflt] = m;
    if (seen.has(prop)) continue;
    seen.add(prop);
    const type = typeRaw ? typeRaw.trim().replace(/\s+/g, " ") : inferType(dflt);
    props.push(`${prop}${opt === "?" ? "?" : ""}: ${type};`);
  }
  if (props.length) out[name] = props.join(" ");
}

cfg.dtsPropsFor = out;
writeFileSync(CONFIG, JSON.stringify(cfg, null, 2) + "\n");
console.log(`dtsPropsFor: ${Object.keys(out).length} components populated`);
for (const [k, v] of Object.entries(out)) console.log(`  ${k}: ${v.split(";").length - 1} props`);
