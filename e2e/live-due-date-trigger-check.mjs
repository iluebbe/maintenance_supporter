/** Live check: the due_date trigger (a sensor that reports WHEN maintenance
 *  is due) on the demo instance (ha-shots, 8131).
 *
 *    1. A timestamp sensor three days ahead + a task that fires seven days
 *       before it → the task is triggered at once, reading ~3 days left.
 *    2. The device moves its date forward (a new filter period) → the
 *       trigger clears and the task records the completion itself.
 *    3. The panel's task dialog shows the type as "Date from a sensor" with
 *       the lead time, and the hint names the reported date.
 *
 *  Everything it creates is deleted at the end (the sensor state too).
 */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = process.env.HA_REST || "http://127.0.0.1:8131";
const HA = process.env.HA_BROWSER || "http://ha-shots:8123";
const PW_WS = process.env.PW_WS || "ws://127.0.0.1:3000/";
const SHOT = process.env.SHOT_DIR || "";
const SENSOR = "sensor.live_check_filter_change_due";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
watchdog(6 * 60e3, "due-date trigger check");

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const MS = (type, extra = {}) => api.send({ type: `maintenance_supporter/${type}`, ...extra });
const setSensor = (days) =>
  fetch(`${REST}/api/states/${SENSOR}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      state: new Date(Date.now() + days * 86400e3).toISOString(),
      attributes: { device_class: "timestamp", friendly_name: "Live check filter change due" },
    }),
  });
const cleanup = [];

async function task(entryId, taskId) {
  const { objects } = await MS("objects");
  return objects.find((o) => o.entry_id === entryId)?.tasks.find((t) => t.id === taskId);
}

try {
  for (const o of (await MS("objects")).objects) {
    if (o.object.name === "Live due-date check") await MS("object/delete", { entry_id: o.entry_id });
  }

  log("STEP a date three days ahead, seven days' lead");
  await setSensor(3);
  const obj = await MS("object/create", { name: "Live due-date check" });
  cleanup.push(obj.entry_id);
  const created = await MS("task/create", {
    entry_id: obj.entry_id,
    name: "Replace Filter",
    task_type: "replacement",
    schedule_type: "sensor_based",
    trigger_config: { type: "due_date", entity_ids: [SENSOR], trigger_days_before: 7, auto_complete_on_recovery: true },
  });
  let t = null;
  for (let i = 0; i < 20 && !(t && t.status === "triggered"); i++) {
    await sleep(500);
    t = await task(obj.entry_id, created.task_id);
  }
  assert(t.status === "triggered", `the task is due (status ${t.status})`);
  assert(t.trigger_current_value > 2.9 && t.trigger_current_value < 3.1, `reading ~3 days left (${t.trigger_current_value})`);

  log("STEP the device starts a new filter period");
  await setSensor(90);
  for (let i = 0; i < 20 && !(t && t.status !== "triggered" && (t.history || []).some((h) => h.type === "completed")); i++) {
    await sleep(500);
    t = await task(obj.entry_id, created.task_id);
  }
  assert(t.status !== "triggered", `the trigger cleared (status ${t.status})`);
  assert((t.history || []).some((h) => h.type === "completed"), "the recovery recorded the completion");

  log("STEP the task dialog");
  const browser = await chromium.connect(PW_WS);
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
    const page = await ctx.newPage();
    await page.addInitScript(({ tk, ha }) => {
      localStorage.setItem("hassTokens", JSON.stringify({
        access_token: tk, token_type: "Bearer", expires_in: 1800,
        hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
      }));
    }, { tk: token, ha: HA });
    await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(obj.entry_id)}&task_id=${created.task_id}`, { waitUntil: "domcontentloaded" });
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
    await page.waitForFunction(`(() => { const p = ${findPanel}; return p && p._objects && p._objects.some((o) => o.entry_id === ${JSON.stringify(obj.entry_id)}); })()`, null, { timeout: 60000 });
    await page.evaluate(`(async () => {
      const p = ${findPanel};
      const o = p._objects.find((x) => x.entry_id === ${JSON.stringify(obj.entry_id)});
      const t = o.tasks.find((x) => x.id === ${JSON.stringify(created.task_id)});
      const d = await p._ui("maintenance-task-dialog");
      d.openEdit(o.entry_id, t);
    })()`);
    const dialog = `(() => { const p = ${findPanel}; return p.shadowRoot.querySelector("maintenance-task-dialog") || document.querySelector("maintenance-task-dialog"); })()`;
    await page.waitForFunction(`(() => { const d = ${dialog}; return d && d.shadowRoot && d._triggerType === "due_date" && d.shadowRoot.querySelector(".trigger-live-hint"); })()`, null, { timeout: 20000 });
    const info = await page.evaluate(`(() => {
      const d = ${dialog};
      const select = [...d.shadowRoot.querySelectorAll("select")].find((s) => [...s.options].some((o) => o.value === "due_date"));
      const opt = select && [...select.options].find((o) => o.value === "due_date");
      return {
        label: opt ? opt.textContent.trim() : null,
        selected: select ? select.value : null,
        days: d._triggerDaysBefore,
        hint: d.shadowRoot.querySelector(".trigger-live-hint").textContent.trim(),
      };
    })()`);
    assert(info.label === "Date from a sensor", `the type reads "${info.label}"`);
    assert(info.selected === "due_date" && info.days === "7", "the dialog shows the stored lead time");
    assert(/7 days before the date the sensor reports/.test(info.hint) && /Reported date:/.test(info.hint), `hint: "${info.hint}"`);
    if (SHOT) {
      await page.evaluate(`(() => { const d = ${dialog}; d.shadowRoot.querySelector(".trigger-live-hint").scrollIntoView({ block: "center" }); })()`);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${SHOT}/due-date-dialog.png` });
    }
    await ctx.close();
  } finally {
    await browser.close();
  }
  log("ALL CHECKS PASSED");
} finally {
  for (const id of cleanup) {
    try { await MS("object/delete", { entry_id: id }); } catch (e) { log("cleanup:", String(e).slice(0, 120)); }
  }
  await fetch(`${REST}/api/states/${SENSOR}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
  api.close();
  setTimeout(() => process.exit(process.exitCode ?? 0), 300);
}
