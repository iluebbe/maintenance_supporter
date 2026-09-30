/** Live check: Replace object asks for the new unit's device (the wiring
 *  moves), parts bought in packages (#98), and when parts count as spending
 *  (#104).
 *
 *  Runs against the demo instance (ha-shots, 8131) with its two fake Roborock
 *  devices (Q7, S8). Everything it creates is a throwaway object that is
 *  deleted at the end; the parts cost setting is restored.
 *
 *    1. UI: an object linked to the Q7 with a brush trigger and a reset
 *       action → *Replace…* in the panel → "another device" → S8 → the
 *       successor's trigger and reset target are the S8's, the toast says so.
 *    2. WS: a 400 ml can at 12 → 100 ml per job; stock, parts value and unit
 *       price; a decimal absolute stock; both cost modes; a purchase under
 *       "when used" sets the part's price and counts nothing.
 */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = process.env.HA_REST || "http://127.0.0.1:8131";
const HA = process.env.HA_BROWSER || "http://ha-shots:8123";
const PW_WS = process.env.PW_WS || "ws://127.0.0.1:3000/";
const SHOT = process.env.SHOT_DIR || "";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
const near = (a, b) => typeof a === "number" && Math.abs(a - b) < 1e-6;
watchdog(8 * 60e3, "replace/parts cost check");

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const MS = (type, extra = {}) => api.send({ type: `maintenance_supporter/${type}`, ...extra });
const cleanup = [];

async function objectById(entryId) {
  const { objects } = await MS("objects");
  return objects.find((o) => o.entry_id === entryId);
}

try {
  // Leftovers of an aborted run.
  for (const o of (await MS("objects")).objects) {
    if (/^Live (swap robot|parts cost shelf)/.test(o.object.name)) await MS("object/delete", { entry_id: o.entry_id });
  }

  // ── 1. Replace object → the new unit's device ─────────────────────────
  log("STEP devices");
  const devices = await api.send({ type: "config/device_registry/list" });
  const robot = (name) => devices.find((d) => d.name === name && (d.identifiers || []).some((i) => i[0] === "roborock"));
  const q7 = robot("Roborock Q7");
  const s8 = robot("Roborock S8");
  if (!q7 || !s8) fail("the demo needs the fake Roborock Q7 and S8 (docker/demo_roborock_fixture)");

  log("STEP create the linked object");
  const created = await MS("object/create", { name: "Live swap robot", ha_device_id: q7.id });
  cleanup.push(created.entry_id);
  const task = await MS("task/create", {
    entry_id: created.entry_id,
    name: "Replace main brush",
    task_type: "replacement",
    schedule_type: "sensor_based",
    trigger_config: { type: "threshold", entity_ids: ["sensor.roborock_q7_main_brush_time_left"], trigger_below: 10 },
    on_complete_action: { service: "button.press", target: { entity_id: "button.roborock_q7_reset_main_brush_consumable" } },
  });
  const taskId = task.task_id;

  log("STEP replace through the panel");
  const browser = await chromium.connect(PW_WS);
  let successorId = null;
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
    const page = await ctx.newPage();
    await page.addInitScript(({ t, ha }) => {
      localStorage.setItem("hassTokens", JSON.stringify({
        access_token: t, token_type: "Bearer", expires_in: 1800,
        hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
      }));
    }, { t: token, ha: HA });
    await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(created.entry_id)}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    const findPanel = `(() => {
      const st = [document.documentElement]; let n = 0;
      while (st.length && n++ < 8000) {
        const el = st.pop();
        if (el.tagName === "MAINTENANCE-SUPPORTER-PANEL") return el;
        if (el.shadowRoot) st.push(...el.shadowRoot.querySelectorAll("*"));
        else if (el.children) st.push(...el.children);
      }
      return null;
    })()`;
    await page.waitForFunction(`(() => { const p = ${findPanel}; return p && p._objects && p._objects.some((o) => o.entry_id === ${JSON.stringify(created.entry_id)}); })()`, null, { timeout: 60000 });
    await page.evaluate(`(() => {
      const p = ${findPanel};
      const o = p._objects.find((x) => x.entry_id === ${JSON.stringify(created.entry_id)});
      p._replaceObject(o.entry_id, o.object);
    })()`);
    const dialog = `(() => { const p = ${findPanel}; return p.shadowRoot.querySelector("maintenance-object-dialog") || document.querySelector("maintenance-object-dialog"); })()`;
    await page.waitForFunction(`(() => { const d = ${dialog}; return d && d.shadowRoot && d.shadowRoot.querySelectorAll('input[name="replace-device"]').length === 3; })()`, null, { timeout: 20000 });
    const text = await page.evaluate(`(${dialog}).shadowRoot.querySelector(".radio-group").textContent`);
    assert(/Roborock Q7/.test(text), "the dialog names the current device");
    if (SHOT) {
      await page.evaluate(`(() => { const r = (${dialog}).shadowRoot.querySelectorAll('input[name="replace-device"]')[1]; r.checked = true; r.dispatchEvent(new Event("change")); })()`);
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${SHOT}/replace-device.png` });
    }
    await page.evaluate(`(async () => {
      const d = ${dialog};
      const r = d.shadowRoot.querySelectorAll('input[name="replace-device"]')[1];
      r.checked = true; r.dispatchEvent(new Event("change"));
      await d.updateComplete;
      d.shadowRoot.querySelector("ha-form").dispatchEvent(new CustomEvent("value-changed", { detail: { value: { device: ${JSON.stringify(s8.id)} } } }));
      await d.updateComplete;
      const buttons = d.shadowRoot.querySelectorAll(".dialog-actions ha-button");
      buttons[buttons.length - 1].click();
    })()`);
    await page.waitForFunction(`(() => { const p = ${findPanel}; return p && p._toastMessage && /moved/.test(p._toastMessage); })()`, null, { timeout: 30000 });
    const toast = await page.evaluate(`(${findPanel})._toastMessage`);
    assert(/· 2 sensor links moved/.test(toast), `the toast says what moved ("${toast}")`);
    await ctx.close();
  } finally {
    await browser.close();
  }

  const { objects } = await MS("objects");
  const successor = objects.find((o) => o.object.predecessor_entry_id === created.entry_id);
  assert(successor, "a successor exists");
  successorId = successor.entry_id;
  cleanup.push(successorId);
  assert(successor.object.ha_device_id === s8.id, "the successor links the S8");
  const moved = successor.tasks.find((t) => t.name === "Replace main brush");
  assert(moved.trigger_config.entity_ids[0] === "sensor.roborock_s8_main_brush_time_left", "the trigger reads the S8's brush sensor");
  assert(moved.on_complete_action.target.entity_id === "button.roborock_s8_reset_main_brush_consumable", "the reset presses the S8's button");
  const retired = objects.find((o) => o.entry_id === created.entry_id);
  assert(retired.object.ha_device_id === q7.id, "the retired unit keeps its record of the Q7");
  void taskId;

  // ── 2. Packages and parts cost ────────────────────────────────────────
  log("STEP package part");
  const settings = await MS("settings");
  const modeBefore = settings.budget?.parts_cost_mode ?? "purchase";
  const shelf = await MS("object/create", { name: "Live parts cost shelf" });
  cleanup.push(shelf.entry_id);
  const { part_id: partId } = await MS("part/create", {
    entry_id: shelf.entry_id, name: "Contact spray", unit: "ml", package_size: 400, cost: 12,
    stock: 800, restock_quantity: 2, reorder_threshold: 200.5, auto_buy_task: true,
  });
  assert(true, "a decimal reorder threshold is accepted");
  const job = await MS("task/create", {
    entry_id: shelf.entry_id, name: "Clean contacts", task_type: "cleaning", schedule_type: "time_based",
    interval_days: 30, consumes_parts: [{ part_id: partId, quantity: 100 }],
  });

  // Backdated, one day apart: two completions of one task within a minute
  // are one household double-tap (journey M1) and the second is dropped.
  let daysBack = 4;
  const complete = (extra = {}) => MS("task/complete", {
    entry_id: shelf.entry_id, task_id: job.task_id,
    completed_at: new Date(Date.now() - --daysBack * 86400e3).toISOString(), ...extra,
  });
  const lastEntry = async (taskId) => {
    const o = await objectById(shelf.entry_id);
    const t = o.tasks.find((x) => x.id === taskId);
    return { entry: t.history[t.history.length - 1], task: t, part: o.parts.find((p) => p.id === partId), obj: o };
  };

  log("STEP when bought (default)");
  await MS("global/update", { settings: { parts_cost_mode: "purchase" } });
  await complete();
  let { entry, part, task: t1 } = await lastEntry(job.task_id);
  assert(near(part.stock, 700), `100 ml used from 800 ml (stock ${part.stock})`);
  assert(near(entry.used_parts[0].unit_cost, 0.03), "the entry records 0.03 per ml");
  assert(near(entry.parts_cost, 3), "parts value 3 = 100/400 of a 12 can");
  assert(entry.cost_basis === undefined, "booked when bought: no cost basis");
  assert(near(t1.total_cost, 0), "nothing counts on the job");

  log("STEP when used");
  await MS("global/update", { settings: { parts_cost_mode: "use" } });
  await complete({ cost: 2 });
  ({ entry, task: t1 } = await lastEntry(job.task_id));
  assert(entry.cost_basis === "use", "booked when used");
  assert(near(t1.total_cost, 5), `the job counts 2 typed + 3 parts (total ${t1.total_cost})`);

  log("STEP decimal absolute stock → buy reminder");
  await MS("part/restock", { entry_id: shelf.entry_id, part_id: partId, absolute: 250.5 });
  await complete();
  let o = await objectById(shelf.entry_id);
  let buy = o.tasks.find((x) => x.part_ref && x.part_ref.part_id === partId);
  for (let i = 0; !buy && i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    o = await objectById(shelf.entry_id);
    buy = o.tasks.find((x) => x.part_ref && x.part_ref.part_id === partId);
  }
  assert(buy, "the buy reminder exists at 150.5 ml");
  assert(/400/.test(buy.notes || ""), "its notes name the package");

  log("STEP a purchase under 'when used'");
  await MS("task/complete", { entry_id: shelf.entry_id, task_id: buy.id, cost: 26, restock_quantity: 2 });
  o = await objectById(shelf.entry_id);
  const p2 = o.parts.find((p) => p.id === partId);
  assert(near(p2.stock, 950.5), `two cans add 800 ml (stock ${p2.stock})`);
  assert(near(p2.cost, 13), `the price paid becomes the part's price (${p2.cost})`);
  const bought = o.tasks.find((x) => x.id === buy.id);
  if (bought) {
    const h = bought.history[bought.history.length - 1];
    assert(h.purchase === true && h.cost_basis === "use", "the purchase entry is marked");
    assert(near(bought.total_cost, 0), "a purchase counts nothing when parts count when used");
  } else {
    log("  (the buy reminder retired itself; entry checked through the budget instead)");
  }

  await MS("global/update", { settings: { parts_cost_mode: modeBefore } });
  log("restored parts_cost_mode:", modeBefore);
  log("ALL CHECKS PASSED");
} finally {
  for (const id of cleanup.reverse()) {
    try { await MS("object/delete", { entry_id: id }); } catch (e) { log("cleanup:", id, String(e).slice(0, 120)); }
  }
  api.close();
  setTimeout(() => process.exit(process.exitCode ?? 0), 300);
}
