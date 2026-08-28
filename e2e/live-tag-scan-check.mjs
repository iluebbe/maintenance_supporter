/** Live check on ha-maint for require_tag_scan (proof of presence).
 *
 *   1. Create a throwaway object + a task with require_tag_scan + an NFC tag.
 *   2. Read model echoes require_tag_scan: true.
 *   3. Panel-style WS complete → refused (tag_scan_required); no history entry.
 *   4. QR quick_complete → completes (the sticker hangs ON the thing).
 *   5. After the 30 s dedup window: firing the HA tag_scanned event completes
 *      the task through the NFC handler.
 *   6. Panel UI: the complete dialog shows the scan-required note; clicking
 *      its Complete button does NOT complete the task (server refusal keeps
 *      the count).
 *
 *  Seeds one throwaway object, deletes it afterwards.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "require_tag_scan live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const tagId = `scan-${stamp}`;
let entryId = null;
let browser = null;

const getTask = async (taskId) => {
  const obj = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  return obj.tasks.find((t) => t.id === taskId);
};
const completedCount = (t) => t.history.filter((h) => h.type === "completed").length;
/** Poll until the read model reflects a state — WS complete returns before
 *  the coordinator refresh lands, so asserting immediately races. */
const getTaskUntil = async (taskId, pred) => {
  let task = null;
  for (let i = 0; i < 12; i++) {
    task = await getTask(taskId);
    if (task && pred(task)) return task;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return task;
};

try {
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: `scan${stamp}` });
  entryId = obj.entry_id;
  const created = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Grease the press", schedule_type: "time_based", interval_days: 30,
    nfc_tag_id: tagId, require_tag_scan: true,
    quick_complete_defaults: { notes: "via QR" },
  });
  const taskId = created.task_id;

  // 2. read model echo
  let task = await getTask(taskId);
  assert(task.require_tag_scan === true, "summary echoes require_tag_scan: true");

  // 3. unscanned complete refused
  let refusal = null;
  try {
    await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: taskId });
  } catch (e) {
    refusal = String(e.message || e.code || e);
    log("  refusal:", refusal);
  }
  assert(refusal !== null, "WS complete without a scan refused");
  task = await getTask(taskId);
  assert(completedCount(task) === 0, "refusal left no history entry");

  // 4. QR quick-complete passes the gate (refusal did not arm the dedup)
  await api.send({ type: "maintenance_supporter/task/quick_complete", entry_id: entryId, task_id: taskId });
  task = await getTaskUntil(taskId, (t) => completedCount(t) === 1);
  assert(completedCount(task) === 1, "quick_complete (QR) completed the task");

  // 5. NFC event path. The manual-completion dedup window (30 s, task-wide)
  // would swallow this — wait it out with the WSL2 clock-drift margin.
  log("  waiting out the 30s double-complete dedup window (40s, drift margin) …");
  await new Promise((r) => setTimeout(r, 40000));
  const evt = await fetch(`${REST}/api/events/tag_scanned`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ tag_id: tagId }),
  });
  assert(evt.ok, `tag_scanned event accepted (${evt.status})`);
  task = await getTaskUntil(taskId, (t) => completedCount(t) === 2);
  assert(completedCount(task) === 2, "NFC tag_scanned event completed the task");

  // 6. panel UI: complete dialog carries the note; its button can't bypass
  browser = await chromium.connect(PW_WS);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  const page = await ctx.newPage();
  await page.addInitScript(hassTokensInit, { t: token, ha: HA });
  await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(entryId)}&task_id=${encodeURIComponent(taskId)}`,
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
  let opened = false;
  for (let i = 0; i < 30 && !opened; i++) {
    await page.waitForTimeout(1000);
    opened = await page.evaluate(`(() => {
      const findPanel = ${findPanel.toString()};
      const panel = findPanel();
      const btn = panel?.shadowRoot?.querySelector(".detail-section ha-button");
      if (!btn) return false;
      btn.click();
      return true;
    })()`);
  }
  assert(opened, "clicked Complete on the detail header");
  await page.waitForTimeout(1200);
  const dlg = await page.evaluate(`(() => {
    const findPanel = ${findPanel.toString()};
    const panel = findPanel();
    const dlg = panel?.shadowRoot?.querySelector("maintenance-complete-dialog");
    const root = dlg?.shadowRoot;
    const buttons = [...(root?.querySelectorAll(".dialog-actions ha-button") || [])];
    buttons[buttons.length - 1]?.click();
    return { note: root?.querySelector(".scan-required-note")?.textContent?.trim() ?? "" };
  })()`);
  assert(dlg.note.length > 0, `complete dialog shows the scan note ("${dlg.note}")`);
  await page.waitForTimeout(2500);
  task = await getTask(taskId);
  assert(completedCount(task) === 2, "dialog Complete was refused server-side (count still 2)");

  log("PASS: require_tag_scan live check");
} finally {
  if (browser) await browser.close().catch(() => {});
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  api.close();
}
