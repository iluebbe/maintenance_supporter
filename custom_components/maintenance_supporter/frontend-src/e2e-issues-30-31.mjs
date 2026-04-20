/**
 * E2E test scenarios for issues #30 and #31.
 *
 * #30: Task without last_performed should anchor next_due on created_at,
 *      not "today" every refresh.
 * #31: Reset prompt strings should make it clear that the date is the
 *      "last performed" date, not the next due date.
 *
 * Usage:
 *   docker compose up -d homeassistant-dev playwright
 *   docker restart playwright-server
 *   cd custom_components/maintenance_supporter/frontend-src
 *   node e2e-issues-30-31.mjs
 */
import { setup, ws, cleanup } from "./e2e-helpers.mjs";
import { readFile } from "fs/promises";

let passed = 0, failed = 0;
function check(name, ok, detail) {
  if (ok) { passed++; console.log("  PASS " + name); }
  else { failed++; console.log("  FAIL " + name + (detail ? " — " + detail : "")); }
}
async function runTest(name, fn) {
  console.log("\n=== " + name + " ===");
  try { await fn(); }
  catch (e) { failed++; console.log("  ERROR: " + e.message + (e.stack ? "\n" + e.stack : "")); }
}

const { browser, ctx, page } = await setup();
const RUN = `${Date.now().toString(36)}`;

// Helper: create a temp object + task on a fresh entry, return ids.
async function wsLog(cmd) {
  try {
    return await ws(page, cmd);
  } catch (e) {
    const detail = e.message + " · cmd=" + JSON.stringify(cmd);
    throw new Error(detail);
  }
}
async function createScenarioObject(name, taskOptions) {
  const created = await wsLog({
    type: "maintenance_supporter/object/create", name,
  });
  const entryId = created.entry_id;
  const taskRes = await wsLog({
    type: "maintenance_supporter/task/create",
    entry_id: entryId,
    ...taskOptions,
  });
  return { entryId, taskId: taskRes.task_id };
}
async function readTask(entryId, taskId) {
  const obj = await ws(page, { type: "maintenance_supporter/object", entry_id: entryId });
  return obj.tasks.find(t => t.id === taskId);
}
async function deleteEntry(entryId) {
  try {
    await page.evaluate(async (eid) => {
      const ha = document.querySelector("home-assistant");
      const conn = ha.__hass.connection;
      await conn.sendMessagePromise({
        type: "config_entries/remove",
        entry_id: eid,
      });
    }, entryId);
  } catch (e) {
    console.log("  cleanup: ", e.message);
  }
}

// =====================================================================
// SCENARIO #30: created_at fallback for tasks without last_performed
// =====================================================================

await runTest("#30 — Task ohne last_performed bekommt created_at=today", async () => {
  const { entryId, taskId } = await createScenarioObject(`E2E Issue30 A ${RUN}`, {
    name: "Daily Task", task_type: "cleaning",
    schedule_type: "time_based", interval_days: 1, warning_days: 0, enabled: true,
  });
  const task = await readTask(entryId, taskId);
  console.log(`  debug: next_due=${task.next_due} days_until_due=${task.days_until_due} last_performed=${task.last_performed}`);
  // The frontend doesn't expose created_at, but we know that with last_performed=null
  // and a fresh anchor, days_until_due must equal interval_days (1 here).
  check("days_until_due equals interval_days", task.days_until_due === 1,
    `got ${task.days_until_due} (expected 1)`);
  check("status is OK with warning_days=0", task.status === "ok",
    `got ${task.status}`);

  await deleteEntry(entryId);
});

await runTest("#30 — Interval=30 ergibt days_until_due=30", async () => {
  const { entryId, taskId } = await createScenarioObject(`E2E Issue30 B ${RUN}`, {
    name: "Monthly Task", task_type: "cleaning",
    schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true,
  });
  const task = await readTask(entryId, taskId);
  console.log(`  debug: next_due=${task.next_due} days_until_due=${task.days_until_due}`);
  check("days_until_due equals interval_days (30)", task.days_until_due === 30,
    `got ${task.days_until_due}`);
  check("status is OK (not DUE_SOON)", task.status === "ok",
    `got ${task.status}`);

  await deleteEntry(entryId);
});

await runTest("#30 — Refresh ändert next_due nicht (Anker stabil)", async () => {
  const { entryId, taskId } = await createScenarioObject(`E2E Issue30 C ${RUN}`, {
    name: "Stable Date", task_type: "cleaning",
    schedule_type: "time_based", interval_days: 7, enabled: true,
  });
  const t1 = await readTask(entryId, taskId);
  // Force a refresh by sleeping briefly
  await page.waitForTimeout(1500);
  const t2 = await readTask(entryId, taskId);
  check("next_due stable across refreshes", t1.next_due === t2.next_due,
    `t1=${t1.next_due}, t2=${t2.next_due}`);

  await deleteEntry(entryId);
});

await runTest("#30 — Task mit last_performed nutzt last_performed (nicht created_at)", async () => {
  const past = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10);
  const { entryId, taskId } = await createScenarioObject(`E2E Issue30 D ${RUN}`, {
    name: "Past LP Task", task_type: "cleaning",
    schedule_type: "time_based", interval_days: 30,
    last_performed: past, enabled: true,
  });
  const task = await readTask(entryId, taskId);
  // last_performed=60 days ago + interval=30 → next_due was 30 days ago → OVERDUE
  check("status is OVERDUE", task.status === "overdue", `got ${task.status}`);
  check("days_until_due negative", task.days_until_due < 0, `got ${task.days_until_due}`);

  await deleteEntry(entryId);
});

// =====================================================================
// SCENARIO #31: Reset prompt strings clearer
// =====================================================================

await runTest("#31 — Reset-Prompt Label sagt 'Last performed date'", async () => {
  // Create a task to reset
  const { entryId, taskId } = await createScenarioObject(`E2E Issue31 ${RUN}`, {
    name: "Reset Demo", task_type: "cleaning",
    schedule_type: "time_based", interval_days: 30, enabled: true,
  });
  await page.goto("http://homeassistant-dev:8123/maintenance-supporter");
  await page.waitForTimeout(3000);

  // Verify shipped strings via the built JS file (runs on host fs, not browser).
  const builtJs = await readFile(
    new URL("../frontend/maintenance-panel.js", import.meta.url),
    "utf-8",
  );
  check("EN reset_date_optional shipped",
    builtJs.includes("Last performed date (optional, defaults to today)"));
  check("EN reset_date_prompt shipped",
    builtJs.includes("Mark task as performed?"));
  check("DE reset_date_optional shipped",
    builtJs.includes("Letztes Erledigungs-Datum"));
  check("Old confusing string removed",
    !builtJs.includes("Reset this task?"),
    "old 'Reset this task?' still present");

  // Reset via WS using the new label semantics: setting the date sets last_performed.
  const resetDate = "2025-01-15";
  await ws(page, {
    type: "maintenance_supporter/task/reset", entry_id: entryId, task_id: taskId,
    date: resetDate,
  });
  const task = await readTask(entryId, taskId);
  check("reset sets last_performed", task.last_performed === resetDate,
    `got ${task.last_performed}`);
  // next_due = last_performed + interval = 2025-01-15 + 30 = 2025-02-14
  check("next_due = last_performed + interval", task.next_due === "2025-02-14",
    `got ${task.next_due}`);

  await deleteEntry(entryId);
});

// =====================================================================
// EDGE CASES: TZ + lifecycle interaction
// =====================================================================

await runTest("EDGE — Lifecycle: create → complete → next_due aktualisiert", async () => {
  const { entryId, taskId } = await createScenarioObject(`E2E Edge LC ${RUN}`, {
    name: "Lifecycle Task", task_type: "cleaning",
    schedule_type: "time_based", interval_days: 30, warning_days: 7, enabled: true,
  });
  // Initial state: no last_performed, days_until_due == interval_days
  const t1 = await readTask(entryId, taskId);
  check("initial days_until_due == interval_days", t1.days_until_due === 30,
    `got ${t1.days_until_due}`);
  check("initial last_performed is null", t1.last_performed === null,
    `got ${t1.last_performed}`);

  // Complete via WS
  await ws(page, {
    type: "maintenance_supporter/task/complete",
    entry_id: entryId, task_id: taskId,
  });
  const t2 = await readTask(entryId, taskId);
  check("after complete: last_performed set", t2.last_performed !== null,
    `got ${t2.last_performed}`);
  check("after complete: days_until_due == interval", t2.days_until_due === 30,
    `got ${t2.days_until_due}`);
  // History entry written
  check("after complete: history has entry", t2.history.length === 1,
    `len=${t2.history.length}`);
  // Timestamp must be TZ-aware
  const ts = t2.history[0].timestamp;
  check("history timestamp has TZ suffix",
    /[+-]\d{2}:\d{2}$|Z$/.test(ts),
    `ts=${ts}`);

  await deleteEntry(entryId);
});

await runTest("EDGE — Reset zu vergangenem Datum: last_performed + history", async () => {
  const { entryId, taskId } = await createScenarioObject(`E2E Edge RST ${RUN}`, {
    name: "Reset Edge", task_type: "cleaning",
    schedule_type: "time_based", interval_days: 30, enabled: true,
  });
  const past = "2025-01-15";
  await ws(page, {
    type: "maintenance_supporter/task/reset",
    entry_id: entryId, task_id: taskId, date: past,
  });
  const t = await readTask(entryId, taskId);
  check("reset: last_performed = past date", t.last_performed === past,
    `got ${t.last_performed}`);
  check("reset: next_due = past + interval (overdue)",
    t.next_due === "2025-02-14",
    `got ${t.next_due}`);
  check("reset: status is overdue", t.status === "overdue",
    `got ${t.status}`);
  check("reset: history has reset entry",
    t.history.some(h => h.type === "reset"),
    `types=${t.history.map(h => h.type).join(",")}`);

  await deleteEntry(entryId);
});

await runTest("EDGE — Skip via WS: history entry + last_performed bumped", async () => {
  const { entryId, taskId } = await createScenarioObject(`E2E Edge SKP ${RUN}`, {
    name: "Skip Edge", task_type: "cleaning",
    schedule_type: "time_based", interval_days: 14, enabled: true,
  });
  await ws(page, {
    type: "maintenance_supporter/task/skip",
    entry_id: entryId, task_id: taskId, reason: "user busy",
  });
  const t = await readTask(entryId, taskId);
  check("skip: last_performed set (today)", t.last_performed !== null);
  check("skip: history has skip entry",
    t.history.some(h => h.type === "skipped"),
    `types=${t.history.map(h => h.type).join(",")}`);
  check("skip: next_due == today + interval (14)",
    t.days_until_due === 14,
    `got ${t.days_until_due}`);

  await deleteEntry(entryId);
});

await runTest("EDGE — Update last_performed setzt next_due neu", async () => {
  const { entryId, taskId } = await createScenarioObject(`E2E Edge UPD ${RUN}`, {
    name: "Update Edge", task_type: "cleaning",
    schedule_type: "time_based", interval_days: 30, enabled: true,
  });
  const past = "2024-06-01";
  await ws(page, {
    type: "maintenance_supporter/task/update",
    entry_id: entryId, task_id: taskId,
    last_performed: past,
  });
  const t = await readTask(entryId, taskId);
  check("update: last_performed reflected", t.last_performed === past,
    `got ${t.last_performed}`);
  check("update: next_due = last + interval",
    t.next_due === "2024-07-01",
    `got ${t.next_due}`);

  await deleteEntry(entryId);
});

// =====================================================================
await cleanup(browser, ctx);
console.log("\n" + "═".repeat(50));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
if (failed > 0) { console.log("SOME TESTS FAILED!"); process.exit(1); }
else console.log("ALL TESTS PASSED!");
