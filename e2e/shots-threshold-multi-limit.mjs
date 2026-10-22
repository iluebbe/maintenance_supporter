/** docs/images/threshold-multi-limit.png — one threshold trigger with two
 *  limits (below 3 OR equals 360) on a countdown sensor that flips to 360
 *  when overdue (CONFIGURATION.md, Threshold Trigger). On the seeded, dark
 *  ha-shots instance like the rest of the docs set. A REST state
 *  sensor.filter_days_left (42 d) stands in for the device; the task dialog
 *  is photographed filled in and closed unsaved, the state removed again.
 *  Prereqs: seeded ha-shots + playwright-server.
 *  node shots-threshold-multi-limit.mjs */
import { chromium } from "@playwright/test";
import { haLogin, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SENSOR = "sensor.filter_days_left";
watchdog(5 * 60e3, "threshold multi-limit shot");

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
await fetch(`${REST}/api/states/${SENSOR}`, { method: "POST", headers: H, body: JSON.stringify({ state: "42", attributes: { unit_of_measurement: "d", friendly_name: "Filter days left", device_class: "duration" } }) });

const b = await chromium.connect(PW_WS, { timeout: 20000 });
try {
  const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
  await ctx.addInitScript(({ t, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({ access_token: t, token_type: "Bearer", expires_in: 1800, hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "" }));
    localStorage.setItem("msp-overview-tab", '"dashboard"');
  }, { t: token, ha: HA });
  const p = await ctx.newPage();
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  const PANEL = `(() => { const st=[document.documentElement]; let n=0;
    while (st.length && n++ < 80000) { const el = st.pop(); if (!el) continue;
      if (el.tagName === "MAINTENANCE-SUPPORTER-PANEL") return el;
      if (el.shadowRoot) st.push(el.shadowRoot); for (const k of (el.children || [])) st.push(k); } return null; })()`;
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    if (await p.evaluate(`!!(${PANEL})?._objects?.length`).catch(() => false)) break;
  }
  await p.waitForTimeout(1500);
  const filled = await p.evaluate(async (src) => {
    const panel = eval(src);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const obj = panel._objects.find((o) => o.object.name === "HVAC System") || panel._objects[0];
    const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog") || (await panel._ui("maintenance-task-dialog"));
    await dlg.openCreate(obj.entry_id, []);
    await dlg.updateComplete;
    dlg._name = "Replace filter";
    dlg._scheduleType = "sensor_based";
    await dlg.updateComplete;
    dlg._triggerEntityId = "sensor.filter_days_left";
    dlg._triggerEntityIds = ["sensor.filter_days_left"];
    dlg._triggerType = "threshold";
    dlg._triggerBelow = "3";
    dlg._triggerEquals = "360";
    await dlg._fetchEntityAttributes?.("sensor.filter_days_left");
    await dlg.updateComplete;
    await wait(1200);
    const root = dlg.shadowRoot;
    const label = [...root.querySelectorAll("label, span, div, h3")].find((x) => /^\s*sensor trigger\s*$/i.test(x.textContent || "") && x.children.length < 3);
    (label || root.querySelector("ha-form.entity-picker-form"))?.scrollIntoView({ block: "start" });
    await wait(800);
    const text = root.textContent || "";
    return { hint: /42/.test(text) && /below 3|falls below/i.test(text), below: dlg._triggerBelow, equals: dlg._triggerEquals };
  }, PANEL);
  console.log("filled:", JSON.stringify(filled));
  await p.screenshot({ path: OUT + "threshold-multi-limit.png" });
  console.log("SHOT threshold-multi-limit.png");
  await p.evaluate(async (src) => { const panel = eval(src); const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog"); if (dlg) dlg._open = false; }, PANEL).catch(() => {});
  await ctx.close();
} finally {
  await fetch(`${REST}/api/states/${SENSOR}`, { method: "DELETE", headers: H }).catch(() => {});
  await b.close().catch(() => {});
}
process.exit(0);
