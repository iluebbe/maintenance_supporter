/** Live check: the 9 wishlist templates (Discussion #85) on ha-maint.
 *  WS: templates lists 23 incl. the new ids, localized names in de.
 *  UI: the template gallery is the LAST settings section; screenshot. */
import { chromium } from "@playwright/test";
import { loadToken, watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(4 * 60e3, "templates wave check");

const token = loadToken();
const api = await wsClient(REST, token);

const res = await api.send({ type: "maintenance_supporter/templates", language: "de" });
const tpls = res.templates || [];
assert(tpls.length === 41, `templates WS lists 41 (got ${tpls.length})`);
const ids = new Set(tpls.map((t) => t.id));
for (const id of ["home_ro_filter", "appliance_espresso", "home_knives", "garden_irrigation",
  "garden_pressure_washer", "home_houseplants", "home_bathroom_fan",
  "appliance_robot_vacuum", "appliance_robot_mop"]) {
  assert(ids.has(id), `catalog has ${id}`);
}
const robot = tpls.find((t) => t.id === "appliance_robot_vacuum");
log("  robot vacuum localized name:", JSON.stringify(robot.name));

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1100 }, colorScheme: "dark", deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.addInitScript(hassTokensInit, { t: token, ha: HA });
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
let mounted = false;
for (let i = 0; i < 30 && !mounted; i++) {
  await p.waitForTimeout(1000);
  mounted = await p.evaluate(({ finder }) => {
    eval(finder);
    return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
  }, { finder: deepFindPanel }).catch(() => false);
}
if (!mounted) fail("panel never mounted");

await p.evaluate(({ finder }) => {
  eval(finder);
  window.__panel._view = "overview";
  window.__panel._overviewTab = "settings";
}, { finder: deepFindPanel });
await p.waitForTimeout(2500);

const info = await p.evaluate(({ finder }) => {
  eval(finder);
  const sv = window.__panel.shadowRoot.querySelector("maintenance-settings-view");
  if (!sv || !sv.shadowRoot) return { err: "no settings view" };
  const sections = [...sv.shadowRoot.querySelectorAll(".settings-section")];
  const last = sections[sections.length - 1];
  const tglSection = sv.shadowRoot.querySelector('[data-section="templates"]');
  const rows = tglSection ? tglSection.querySelectorAll("label.setting-row, .setting-row").length : 0;
  tglSection?.scrollIntoView({ block: "start" });
  return {
    sectionCount: sections.length,
    lastIsTemplates: last?.dataset?.section === "templates",
    toggleRows: rows,
  };
}, { finder: deepFindPanel });
assert(!info.err, info.err || "settings view present");
assert(info.lastIsTemplates, `template gallery is the LAST settings section (of ${info.sectionCount})`);
assert(info.toggleRows === 23, `gallery lists 23 toggle rows (got ${info.toggleRows})`);
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/templates-gallery-end.png` });

log("TEMPLATES WAVE LIVE CHECK PASSED");
await ctx.close();
await b.close();
api.close();
