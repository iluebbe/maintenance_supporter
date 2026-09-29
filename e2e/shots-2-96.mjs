/** The docs pictures of features that had none (2.96): the phase strip, an
 *  adaptive recommendation, the dashboard grouped by task group, a saved
 *  view applied, the vacation settings and the replacement lineage link —
 *  dark theme, on the seeded demo instance (shots-demo.mjs seeds them in its
 *  2.96 block). Prereqs: seeded ha-shots + playwright-server running. */
import { chromium } from "@playwright/test";
import { haLogin, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
watchdog(8 * 60e3, "2.96 shots");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", '"dashboard"');
}, { t: token, ha: HA });
const p = await ctx.newPage();
const failures = [];

async function openPanel() {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    const ok = await p.evaluate(({ d }) => { eval(d); return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0; }, { d: DEEP }).catch(() => false);
    if (ok) break;
  }
  await p.waitForTimeout(1200);
}

async function panelClip(height = 1000) {
  return p.evaluate(({ d, height }) => {
    eval(d);
    const r = window.__panel.getBoundingClientRect();
    return { x: Math.max(0, r.x), y: 0, width: Math.min(r.width, 1600), height };
  }, { d: DEEP, height });
}

async function shoot(name, prepare, { verify, height } = {}) {
  log("STEP", name);
  try {
    await openPanel();
    await p.evaluate(prepare, { d: DEEP });
    await p.waitForTimeout(2500);
    if (verify) {
      const ok = await p.evaluate(verify, { d: DEEP });
      if (!ok) throw new Error("what the picture is about did not render");
    }
    await p.screenshot({ path: OUT + name, clip: await panelClip(height) });
    log("SHOT", name);
  } catch (e) {
    failures.push(name);
    log("FAIL", name, String(e && e.message || e).slice(0, 200));
  }
}

const showTask = (objName, taskName, cardSelector) => `
  eval(d);
  const panel = window.__panel;
  const o = panel._objects.find((x) => x.object.name === ${JSON.stringify(objName)});
  const t = o.tasks.find((x) => x.name === ${JSON.stringify(taskName)});
  panel._showTask(o.entry_id, t.id);
  setTimeout(() => panel.shadowRoot.querySelector(${JSON.stringify(cardSelector)})?.scrollIntoView({ block: "center" }), 1200);`;

await shoot("task-phases.png", new Function("{ d }", showTask("Lawn Mower", "Mower blades", ".phases-card")),
  { verify: new Function("{ d }", "eval(d); return !!window.__panel.shadowRoot.querySelector('.phases-card');") });

await shoot("task-recommendation.png", new Function("{ d }", showTask("Lawn Mower", "Clean the deck", ".recommendation-card")),
  { verify: new Function("{ d }", "eval(d); return !!window.__panel.shadowRoot.querySelector('.recommendation-card');") });

await shoot("group-by-group.png", async ({ d }) => {
  eval(d);
  const panel = window.__panel;
  panel._groupByMode = "group";
  await panel.updateComplete;
}, { verify: ({ d }) => { eval(d); return window.__panel.shadowRoot.querySelectorAll(".group-section").length >= 2; } });

await shoot("saved-view.png", async ({ d }) => {
  eval(d);
  const panel = window.__panel;
  const view = (panel._savedViews || []).find((v) => v.name === "Anna's tasks");
  if (view) panel._applyView(view.id);
  await panel.updateComplete;
}, { verify: ({ d }) => {
  eval(d);
  const panel = window.__panel;
  // The person select must name the view's person, not stay blank.
  const sel = [...panel.shadowRoot.querySelectorAll("select")].find((s) => s.querySelector('option[value="current_user"]'));
  return !!panel._activeViewId && sel?.selectedOptions[0]?.textContent.trim() === "Anna";
} });

await shoot("vacation-settings.png", async ({ d }) => {
  eval(d);
  const panel = window.__panel;
  panel._setOverviewTab("settings");
  await panel.updateComplete;
  await new Promise((r) => setTimeout(r, 1500));
  const view = panel.shadowRoot.querySelector("maintenance-settings-view");
  view?.shadowRoot?.querySelector(".vacation-section")?.scrollIntoView({ block: "start" });
}, { verify: ({ d }) => {
  eval(d);
  const view = window.__panel.shadowRoot.querySelector("maintenance-settings-view");
  return !!view?.shadowRoot?.querySelector(".vacation-section");
} });

await shoot("object-lineage.png", async ({ d }) => {
  eval(d);
  const panel = window.__panel;
  const o = panel._objects.find((x) => x.object.name === "Dehumidifier");
  panel._showObject(o.entry_id);
}, { verify: ({ d }) => { eval(d); return !!window.__panel.shadowRoot.querySelector(".object-lineage-link"); }, height: 700 });

await ctx.close();
await b.close();
if (failures.length) {
  console.error("FAILED:", failures.join(", "));
  process.exit(1);
}
process.exit(0);
