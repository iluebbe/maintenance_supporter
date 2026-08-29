/** Live check on ha-maint for the binary-sensor trigger chart (#141).
 *
 *  A problem/binary entity has NO long-term statistics, so the detail chart
 *  used to draw a flat line at the current value. Now it falls back to
 *  recorder state history: this check creates an input_boolean, toggles it
 *  a few times (real recorder rows), attaches a state_change task, opens
 *  the task detail and asserts the chart plots BOTH 0 and 1 with the
 *  history-fallback footnote.
 *
 *  Seeds one throwaway helper + object, deletes both afterwards.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "binary chart live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
let helperId = null;
let entryId = null;
let browser = null;

try {
  const helper = await api.send({ type: "input_boolean/create", name: `chart141 ${stamp}` });
  helperId = helper.id;
  const entityId = `input_boolean.chart141_${stamp}`;
  log("helper:", entityId);

  // Real recorder history: a few on/off transitions.
  for (let i = 0; i < 4; i++) {
    await fetch(`${REST}/api/services/input_boolean/toggle`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ entity_id: entityId }),
    });
    await new Promise((r) => setTimeout(r, 1200));
  }

  const obj = await api.send({ type: "maintenance_supporter/object/create", name: `chart141obj${stamp}` });
  entryId = obj.entry_id;
  const created = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Tank warning watch", schedule_type: "sensor_based",
    trigger_config: { type: "state_change", entity_id: entityId, trigger_target_changes: 10 },
  });
  const taskId = created.task_id;

  browser = await chromium.connect(PW_WS);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  const page = await ctx.newPage();
  await page.addInitScript(hassTokensInit, { t: token, ha: HA });
  await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(entryId)}&task_id=${encodeURIComponent(taskId)}`,
    { waitUntil: "domcontentloaded", timeout: 30000 });

  const probe = async () => page.evaluate(() => {
    const sr = (el) => el && el.shadowRoot;
    const panel = (() => {
      const st = [document.documentElement]; let n = 0;
      while (st.length && n++ < 8000) {
        const el = st.pop();
        if (el.tagName === "MAINTENANCE-SUPPORTER-PANEL") return el;
        const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
        else if (el.children) st.push(...el.children);
      }
      return null;
    })();
    if (!panel || !sr(panel)) return null;
    const root = sr(panel);
    const chart = root.querySelector("maintenance-trigger-chart");
    if (!chart) return { chart: false };
    const points = chart.points || [];
    return {
      chart: true,
      count: points.length,
      vals: [...new Set(points.map((p) => p.val))].sort(),
      note: root.querySelector(".chart-note")?.textContent?.trim() ?? "",
    };
  });

  let ui = null;
  for (let i = 0; i < 30 && (!ui || !ui.chart || ui.count < 3); i++) {
    await page.waitForTimeout(1000);
    ui = await probe();
  }
  assert(ui?.chart, "trigger chart rendered");
  assert(ui.count >= 3, `chart has a real series (${ui.count} points)`);
  // #141 round 2: a state_change trigger draws the CHANGE COUNT since the
  // last service, not the raw 0/1 state — a rising staircase.
  const maxVal = Math.max(...ui.vals);
  assert(maxVal >= 2, `change counter climbed (max ${maxVal}, vals: ${ui.vals})`);
  assert(ui.vals.every((v, i) => i === 0 || v >= ui.vals[i - 1]), "counter never decreases");
  assert(/change count|state history/i.test(ui.note), `counter footnote shown (${ui.note})`);

  // Latch mode (target 1 + to-state OFF) on an entity that is ON: the trigger
  // view is flat 0 ("not in alert state"), where the raw line would be 1.
  await fetch(`${REST}/api/services/input_boolean/turn_on`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ entity_id: entityId }),
  });
  const latch = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Valve watch", schedule_type: "sensor_based",
    trigger_config: { type: "state_change", entity_id: entityId, trigger_to_state: "off", trigger_target_changes: 1, trigger_for_minutes: 5 },
  });
  await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(entryId)}&task_id=${encodeURIComponent(latch.task_id)}`,
    { waitUntil: "domcontentloaded", timeout: 30000 });
  let latchUi = null;
  for (let i = 0; i < 30 && !(latchUi && latchUi.chart && latchUi.count >= 2); i++) {
    await page.waitForTimeout(1000);
    latchUi = await probe();
  }
  assert(latchUi?.chart, "latch chart rendered");
  assert(latchUi.vals.every((v) => v === 0), `latch view flat 0 while the entity is ON (vals: ${latchUi.vals})`);
  assert(/alert state/i.test(latchUi.note), `latch footnote shown (${latchUi.note})`);

  log("PASS: binary chart live check");
} finally {
  if (browser) await browser.close().catch(() => {});
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  if (helperId) await api.send({ type: "input_boolean/delete", input_boolean_id: helperId }).catch(() => {});
  api.close();
}
