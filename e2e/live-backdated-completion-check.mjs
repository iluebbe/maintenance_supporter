/** Live check on ha-maint for backdated completions + completed_at event (#133).
 *
 *   1. Normal complete: event carries completed_at ≈ now.
 *   2. Backdated complete right after (past moment): NOT swallowed by the
 *      double-tap dedup; event carries the chosen past moment; cycle anchor
 *      stays on the newer real completion (pure backfill).
 *   3. Fresh task, completed_at = yesterday (latest): last_performed anchors
 *      on yesterday.
 *   4. Future completed_at -> WS error completed_at_in_future.
 *   5. HA service maintenance_supporter.complete with completed_at works.
 *   6. Panel complete dialog offers the backdate seed button and, once
 *      clicked, an <ms-date-field kind="datetime"> wrapping HA's datetime
 *      selector (#163 — follows the profile date/time format).
 *
 *  Seeds one throwaway object, deletes it afterwards.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "backdated completion live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const objName = `backdate${stamp}`;
let entryId = null;
let browser = null;

const completedEvents = [];
const unsub = await api.subscribe(
  { type: "subscribe_events", event_type: "maintenance_supporter_task_completed" },
  (ev) => completedEvents.push(ev.data),
);

try {
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: objName });
  entryId = obj.entry_id;
  const t1 = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "roundtrip", schedule_type: "time_based", interval_days: 30,
  });
  const t2 = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "anchor", schedule_type: "time_based", interval_days: 30,
  });

  // 1. Normal complete -> completed_at ≈ now
  await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: t1.task_id });
  await new Promise((r) => setTimeout(r, 1500));
  const evNow = completedEvents.find((e) => e.task_id === t1.task_id);
  assert(evNow && evNow.completed_at, "event carries completed_at");
  assert(Math.abs(Date.now() - new Date(evNow.completed_at).getTime()) < 60_000,
    `completed_at is ~now (${evNow.completed_at})`);

  // 2. Backdated complete seconds later — dedup must NOT swallow it,
  //    event must carry the past moment, cycle must stay on the real one.
  const past = new Date(Date.now() - 4 * 86400e3);
  const pastIso = past.toISOString();
  await api.send({
    type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: t1.task_id,
    completed_at: pastIso, cost: 42.5,
  });
  await new Promise((r) => setTimeout(r, 1500));
  const backfillEvents = completedEvents.filter((e) => e.task_id === t1.task_id);
  assert(backfillEvents.length === 2, "backfill right after a completion is not deduped away");
  assert(backfillEvents[1].completed_at.startsWith(pastIso.slice(0, 19)),
    `backfill event carries the past moment (${backfillEvents[1].completed_at})`);

  const read1 = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  const task1 = read1.tasks.find((x) => x.id === t1.task_id);
  const today = new Date().toISOString().slice(0, 10);
  assert(task1.last_performed === today,
    `pure backfill left the cycle anchor on today (${task1.last_performed})`);
  const completed1 = task1.history.filter((h) => h.type === "completed");
  assert(completed1.length === 2 && completed1.some((h) => h.cost === 42.5),
    "history holds both completions incl. backfill cost");

  // 3. Fresh task: completed_at = yesterday IS the latest -> anchors there
  const yesterday = new Date(Date.now() - 86400e3);
  await api.send({
    type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: t2.task_id,
    completed_at: yesterday.toISOString(),
  });
  const read2 = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  const task2 = read2.tasks.find((x) => x.id === t2.task_id);
  assert(task2.last_performed === yesterday.toISOString().slice(0, 10),
    `backdated-latest anchors last_performed on yesterday (${task2.last_performed})`);

  // 4. Future -> refused
  let futureErr = null;
  try {
    await api.send({
      type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: t2.task_id,
      completed_at: new Date(Date.now() + 2 * 86400e3).toISOString(),
    });
  } catch (e) {
    futureErr = String(e.message || e);
  }
  assert(futureErr && futureErr.includes("completed_at_in_future"), `future date refused (${futureErr})`);

  // 5. HA service with completed_at (slug: sensor.<obj>_<task>)
  const svcPast = new Date(Date.now() - 2 * 86400e3);
  const svc = await fetch(`${REST}/api/services/maintenance_supporter/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      entity_id: `sensor.${objName}_roundtrip`,
      completed_at: svcPast.toISOString(),
      notes: "service backfill",
    }),
  });
  assert(svc.ok, `service call accepted (${svc.status})`);
  await new Promise((r) => setTimeout(r, 1500));
  const read3 = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  const hist3 = read3.tasks.find((x) => x.id === t1.task_id).history.filter((h) => h.type === "completed");
  assert(hist3.length === 3 && hist3.some((h) => h.notes === "service backfill"),
    "service backfill recorded in history");

  // 6. Panel dialog renders the backdate field
  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 950 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
  let panelUp = false;
  for (let i = 0; i < 30 && !panelUp; i++) {
    await p.waitForTimeout(1000);
    panelUp = await p.evaluate(() => {
      const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
        while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
          if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
          for (const k of (el.children || [])) st.push(k); } return o; };
      window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }).catch(() => false);
  }
  assert(panelUp, "panel mounted");
  const dlgCheck = await p.evaluate(({ e, t }) => {
    const panel = window.__panel;
    const dlg = panel.shadowRoot.querySelector("maintenance-complete-dialog");
    if (!dlg) return "no-dialog-element";
    dlg.entryId = e; dlg.taskId = t; dlg.taskName = "roundtrip";
    dlg.open();
    return new Promise((res) => setTimeout(() => {
      const sr = dlg.shadowRoot;
      const pick = sr && sr.querySelector(".backdate-pick");
      const beforeClick = !!(sr && sr.querySelector("ms-date-field"));
      if (pick) pick.click();
      setTimeout(() => {
        const field = sr && sr.querySelector("ms-date-field");
        const sel = field && field.shadowRoot && field.shadowRoot.querySelector("ha-selector");
        const label = sr ? sr.textContent : "";
        res({
          hasPick: !!pick, beforeClick, hasField: !!field, kind: field && field.kind,
          seeded: !!(field && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00$/.test(field.value)),
          selectorDefined: !!(sel && customElements.get("ha-selector")),
          label: /Completed at|Erledigt am/.test(label),
        });
      }, 400);
    }, 600));
  }, { e: entryId, t: t1.task_id });
  assert(dlgCheck.hasPick === true, `dialog offers the backdate seed button (${JSON.stringify(dlgCheck)})`);
  assert(dlgCheck.beforeClick === false, "no datetime field before the seed click");
  assert(dlgCheck.hasField === true && dlgCheck.kind === "datetime", "seed click renders <ms-date-field kind=datetime>");
  assert(dlgCheck.seeded === true, "field seeded with the current minute (YYYY-MM-DDTHH:MM:00)");
  assert(dlgCheck.selectorDefined === true, "wrapper renders HA's ha-selector (defined in the panel)");
  assert(dlgCheck.label === true, "field label localized");

  log("\nALL LIVE CHECKS PASSED");
  process.exitCode = 0;
} catch (err) {
  console.error("ERROR:", err && (err.stack || err.message || err));
  process.exitCode = 1;
} finally {
  try { await unsub(); } catch { /* ignore */ }
  try { if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }); } catch { /* ignore */ }
  try { if (browser) await browser.close(); } catch { /* ignore */ }
  try { api.close(); } catch { /* ignore */ }
  process.exit(process.exitCode ?? 1);
}
