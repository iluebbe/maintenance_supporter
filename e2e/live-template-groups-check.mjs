/** Live check: template clustering (v2.27) on ha-maint.
 *  WS: 29 templates across 6 categories (household + garden new, pool split).
 *  UI: settings gallery groups under category headers with toggle-all +
 *  count; the group toggle actually persists; panel picker sections show
 *  the new categories. Screenshots of both. */
import { chromium } from "@playwright/test";
import { loadToken, watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(5 * 60e3, "template groups check");

const token = loadToken();
const api = await wsClient(REST, token);

const res = await api.send({ type: "maintenance_supporter/templates", language: "de" });
assert(res.templates.length === 31, `31 templates (got ${res.templates.length})`);
const cats = Object.keys(res.categories);
assert(JSON.stringify(cats) === JSON.stringify(["vehicle", "home", "household", "garden", "pool", "appliance"]),
  `6 categories in order (got ${cats.join(",")})`);
const byCat = {};
for (const t2 of res.templates) byCat[t2.category] = (byCat[t2.category] || 0) + 1;
log("  per category:", JSON.stringify(byCat));
assert(byCat.household === 5 && byCat.garden === 6 && byCat.pool === 2, "household=5, garden=6, pool=2");
const bathroom = res.templates.find((t2) => t2.id === "household_bathroom");
assert(bathroom.name === "Badezimmer", `Bathroom localized (got ${bathroom.name})`);
assert(res.categories.household.name_de === "Haushalt & Routinen", "household category localized");

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;
log("connecting browser…");
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1280, height: 1400 }, colorScheme: "dark", deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.addInitScript(hassTokensInit, { t: token, ha: HA });
log("navigating…");
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
let mounted = false;
for (let i = 0; i < 30 && !mounted; i++) {
  await p.waitForTimeout(1000);
  mounted = await p.evaluate(({ finder }) => {
    eval(finder);
    return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
  }, { finder: deepFindPanel }).catch(() => false);
}
if (!mounted) fail("panel never mounted");
log("panel mounted");

// 1. Settings gallery: 6 group heads, counts, toggle-all round-trip.
await p.evaluate(({ finder }) => {
  eval(finder);
  window.__panel._view = "overview";
  window.__panel._overviewTab = "settings";
}, { finder: deepFindPanel });
await p.waitForTimeout(2500);
const gallery = await p.evaluate(({ finder }) => {
  eval(finder);
  const sv = window.__panel.shadowRoot.querySelector("maintenance-settings-view");
  const sec = sv.shadowRoot.querySelector('[data-section="templates"]');
  if (!sec) return { err: "no templates section" };
  const heads = [...sec.querySelectorAll(".tpl-group-head")];
  sec.scrollIntoView({ block: "start" });
  return {
    groups: heads.map((h) => ({
      name: h.querySelector(".tpl-group-name").textContent.trim(),
      count: h.querySelector(".tpl-group-count").textContent.trim(),
    })),
    rows: sec.querySelectorAll(".tpl-row").length,
  };
}, { finder: deepFindPanel });
assert(!gallery.err, gallery.err || "gallery renders");
assert(gallery.groups.length === 6, `6 group headers (got ${gallery.groups.length})`);
// Collapsed by default: only the headers (with counts) are visible.
assert(gallery.rows === 0, `groups collapsed by default (got ${gallery.rows} rows)`);
log("  groups:", gallery.groups.map((g) => `${g.name} ${g.count}`).join(" | "));
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/template-groups-settings.png` });

// Expanding a group by clicking its header reveals exactly its rows.
const expanded = await p.evaluate(({ finder }) => {
  eval(finder);
  const sv = window.__panel.shadowRoot.querySelector("maintenance-settings-view");
  const sec = sv.shadowRoot.querySelector('[data-section="templates"]');
  const hh = [...sec.querySelectorAll(".tpl-group-head")].find((h) => /Household|Haushalt/.test(h.textContent));
  hh.click();
  return true;
}, { finder: deepFindPanel });
assert(expanded === true, "household header clicked");
await p.waitForTimeout(500);
const afterExpand = await p.evaluate(({ finder }) => {
  eval(finder);
  const sv = window.__panel.shadowRoot.querySelector("maintenance-settings-view");
  const sec = sv.shadowRoot.querySelector('[data-section="templates"]');
  return sec.querySelectorAll(".tpl-row").length;
}, { finder: deepFindPanel });
assert(afterExpand === 5, `expanding household shows its 5 rows (got ${afterExpand})`);
await p.screenshot({ path: `${OUT}/template-groups-expanded.png` });

// Toggle-all round trip on the household group (real click).
const toggled = await p.evaluate(({ finder }) => {
  eval(finder);
  const sv = window.__panel.shadowRoot.querySelector("maintenance-settings-view");
  const sec = sv.shadowRoot.querySelector('[data-section="templates"]');
  const heads = [...sec.querySelectorAll(".tpl-group-head")];
  const hh = heads.find((h) => /Household|Haushalt/.test(h.textContent));
  if (!hh) return "no household head";
  hh.querySelector('input[type="checkbox"]').click();
  return true;
}, { finder: deepFindPanel });
assert(toggled === true, `household toggle-all clicked (${toggled})`);
await p.waitForTimeout(1200);
const disabledNow = await api.send({ type: "maintenance_supporter/templates" });
const hhDisabled = disabledNow.templates.filter((t2) => t2.category === "household" && t2.disabled).length;
assert(hhDisabled === 5, `group toggle persisted: all 5 household templates disabled (got ${hhDisabled})`);
// restore
const undo = await p.evaluate(({ finder }) => {
  eval(finder);
  const sv = window.__panel.shadowRoot.querySelector("maintenance-settings-view");
  const sec = sv.shadowRoot.querySelector('[data-section="templates"]');
  const hh = [...sec.querySelectorAll(".tpl-group-head")].find((h) => /Household|Haushalt/.test(h.textContent));
  hh.querySelector('input[type="checkbox"]').click();
  return true;
}, { finder: deepFindPanel });
assert(undo === true, "toggle-all clicked again");
await p.waitForTimeout(1200);
const restored = await api.send({ type: "maintenance_supporter/templates" });
assert(restored.templates.filter((t2) => t2.disabled).length === 0 ||
  restored.templates.filter((t2) => t2.category === "household" && t2.disabled).length === 0,
  "household group re-enabled");

// 2. Panel "From template" gallery shows the new category sections.
await p.evaluate(({ finder }) => {
  eval(finder);
  window.__panel._overviewTab = "dashboard";
  window.__panel._openTemplateGallery ? window.__panel._openTemplateGallery() : (window.__panel._templateGalleryOpen = true);
}, { finder: deepFindPanel });
await p.waitForTimeout(2000);
const picker = await p.evaluate(({ finder }) => {
  eval(finder);
  const g = window.__panel.shadowRoot.querySelector(".template-gallery-body");
  if (!g) return { err: "no gallery body" };
  return { text: g.textContent };
}, { finder: deepFindPanel });
assert(!picker.err, picker.err || "picker open");
for (const label of ["Household", "Garden", "Bathroom", "E-Bike", "Smoke"]) {
  assert(picker.text.includes(label), `picker shows "${label}"`);
}
await p.screenshot({ path: `${OUT}/template-groups-picker.png` });

log("TEMPLATE GROUPS LIVE CHECK PASSED");
await ctx.close();
await b.close();
api.close();
