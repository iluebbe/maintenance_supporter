/** Live check on ha-maint for the 2026-08-29 bug-audit fixes that only a
 *  real core + browser can prove:
 *
 *   1. Live subscriptions survive an entry RELOAD: a second client edits a
 *      task (which reloads the entry); a completion afterwards must still
 *      reach the first client's `maintenance_supporter/subscribe` stream.
 *   2. QR deep link on a tag-gated task WITHOUT quick-complete defaults:
 *      the panel falls back to the complete dialog with via_tag_scan, and
 *      Complete succeeds (used to be refused: dead end).
 *   3. The choke point refuses an archived task's manual completion
 *      (task_inactive) and an early one (too_early) on the WS surface.
 *
 *  Seeds one throwaway object, deletes it afterwards.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "audit 2026-08-29 live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
let entryId = null;
let browser = null;

const getTask = async (taskId) => {
  const obj = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  return obj.tasks.find((t) => t.id === taskId);
};
const completedCount = (t) => (t.history || []).filter((h) => h.type === "completed").length;

try {
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: `audit${stamp}` });
  entryId = obj.entry_id;
  const t1 = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Reload watch", schedule_type: "time_based", interval_days: 30,
  });
  const t2 = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Gated no defaults", schedule_type: "time_based", interval_days: 30,
    nfc_tag_id: `audit-${stamp}`, require_tag_scan: true,
  });
  const t3 = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Too early", schedule_type: "time_based", interval_days: 60, earliest_completion_days: 3,
  });

  // ── 1. subscription survives a reload ──────────────────────────────────
  const sub = await wsClient(REST, token);
  const events = [];
  const subId = await sub.subscribe({ type: "maintenance_supporter/subscribe" }, (ev) => events.push(ev));
  log("  subscribed", subId);
  await new Promise((r) => setTimeout(r, 1500));
  const before = events.length;
  // Another client renames the task → entry reload → new coordinator.
  await api.send({ type: "maintenance_supporter/task/update", entry_id: entryId, task_id: t1.task_id, name: "Reload watch (renamed)" });
  await new Promise((r) => setTimeout(r, 6000)); // reload + snapshot settle
  const afterReload = events.length;
  await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: t1.task_id });
  let pushed = false;
  for (let i = 0; i < 15 && !pushed; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    pushed = events.slice(afterReload).some((ev) =>
      JSON.stringify(ev).includes(entryId) && JSON.stringify(ev).includes(t1.task_id));
  }
  assert(afterReload >= before, "subscription stayed open across the reload");
  assert(pushed, "completion after the reload was pushed to the subscriber (was frozen before)");
  sub.close();

  // ── 3. choke-point refusals on the WS surface ──────────────────────────
  let code = null;
  try { await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: t3.task_id }); }
  catch (e) { code = JSON.parse(e.message).code; }
  assert(code === "too_early", `early completion refused with too_early (${code})`);
  await api.send({ type: "maintenance_supporter/task/archive", entry_id: entryId, task_id: t1.task_id });
  code = null;
  try { await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: t1.task_id }); }
  catch (e) { code = JSON.parse(e.message).code; }
  assert(code === "task_inactive", `archived task refused with task_inactive (${code})`);

  // ── 2. QR deep link on a gated task without quick defaults ─────────────
  browser = await chromium.connect(PW_WS);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  const page = await ctx.newPage();
  await page.addInitScript(hassTokensInit, { t: token, ha: HA });
  await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(entryId)}&task_id=${encodeURIComponent(t2.task_id)}&action=quick_complete`,
    { waitUntil: "domcontentloaded", timeout: 30000 });
  const findPanel = () => {
    const sr = (el) => el && el.shadowRoot;
    const st = [document.documentElement]; let n = 0;
    while (st.length && n++ < 8000) {
      const el = st.pop();
      if (el.tagName === "MAINTENANCE-SUPPORTER-PANEL") return el;
      const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
      else if (el.children) st.push(...el.children);
    }
    return null;
  };
  let dlg = null;
  for (let i = 0; i < 25 && !dlg; i++) {
    await page.waitForTimeout(1000);
    dlg = await page.evaluate(`(() => {
      const findPanel = ${findPanel.toString()};
      const d = findPanel()?.shadowRoot?.querySelector("maintenance-complete-dialog");
      const root = d?.shadowRoot;
      if (!root || !root.querySelector(".dialog-actions")) return null;
      return { note: !!root.querySelector(".scan-required-note"), viaTagScan: !!d.viaTagScan };
    })()`);
  }
  assert(dlg, "QR fallback opened the complete dialog");
  assert(dlg.viaTagScan && !dlg.note, `dialog carries via_tag_scan and hides the refusal note (${JSON.stringify(dlg)})`);
  await page.evaluate(`(() => {
    const findPanel = ${findPanel.toString()};
    const d = findPanel()?.shadowRoot?.querySelector("maintenance-complete-dialog");
    const b = [...d.shadowRoot.querySelectorAll(".dialog-actions ha-button")];
    b[b.length - 1].click();
  })()`);
  let done = null;
  for (let i = 0; i < 12 && !done; i++) {
    await page.waitForTimeout(1000);
    const t = await getTask(t2.task_id);
    if (completedCount(t) === 1) done = t;
  }
  assert(done, "gated task completed through the QR fallback (was a dead end)");

  log("PASS: audit 2026-08-29 live check");
} finally {
  if (browser) await browser.close().catch(() => {});
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  api.close();
}
