/** v2.2.0 — intensive E2E for the history-edit feature.
 *
 * The user (Discussion #49 follow-up) explicitly asked: "das müsste intensiv
 * getestet werden ob die Änderungen korrekt gespeichert werden". This script
 * exercises the full roundtrip via the live HA WebSocket:
 *
 *   1. find an existing maintenance object + completed task with ≥1 history entry
 *   2. record the original entry payload
 *   3. send maintenance_supporter/task/history/update with patched fields
 *   4. fetch the object again, verify the patch landed
 *   5. test edge cases: clear notes (None), edit timestamp updates last_performed
 *   6. read back AGAIN after a brief wait — confirms persistence isn't lost
 *
 * No browser UI needed — this is pure WS roundtrip, the most reliable layer.
 */
import { chromium } from "playwright";

const HA = "http://localhost:8125";
const HA_TOKEN = process.env.HA_TOKEN;
if (!HA_TOKEN) {
  console.error("Set HA_TOKEN env var.");
  process.exit(1);
}

async function getRefreshToken() {
  async function post(path, body, ctype = "application/json") {
    const data = typeof body === "string" ? body : JSON.stringify(body);
    const r = await fetch(`${HA}${path}`, {
      method: "POST",
      headers: { "Content-Type": ctype },
      body: data,
    });
    return await r.json();
  }
  const flow = await post("/auth/login_flow", {
    client_id: `${HA}/`, handler: ["homeassistant", null], redirect_uri: `${HA}/`,
  });
  const auth = await post(`/auth/login_flow/${flow.flow_id}`, {
    client_id: `${HA}/`, username: "dev", password: "dev",
  });
  const tokens = await post(
    "/auth/token",
    `grant_type=authorization_code&code=${auth.result}&client_id=${HA}/`,
    "application/x-www-form-urlencoded",
  );
  return tokens.refresh_token;
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

const refreshToken = await getRefreshToken();
await page.goto(HA);
await page.waitForTimeout(800);
await page.evaluate(({ ha, r }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    hassUrl: ha, clientId: `${ha}/`, refresh_token: r,
    access_token: "", token_type: "Bearer", expires_in: 1800, expires: 0,
  }));
}, { ha: HA, r: refreshToken });
await page.goto(HA);
await page.waitForTimeout(8000);

// All assertions go through this — runs in browser context with hass.connection
const result = await page.evaluate(async () => {
  const out = { steps: [] };
  const log = (msg, data) => out.steps.push({ msg, ...(data ? { data } : {}) });

  const hass = document.querySelector("home-assistant")?.hass;
  if (!hass) {
    out.error = "no hass";
    return out;
  }
  const ws = (m) => hass.connection.sendMessagePromise(m);

  // 1. Find an object with a completed task that has ≥1 history entry
  const { objects } = await ws({ type: "maintenance_supporter/objects" });
  let testEntry = null;
  let testTask = null;
  for (const obj of objects) {
    for (const task of obj.tasks || []) {
      if (Array.isArray(task.history) && task.history.length >= 1) {
        testEntry = obj;
        testTask = task;
        break;
      }
    }
    if (testEntry) break;
  }
  if (!testEntry) {
    // None exists — create a fresh object + task + complete it once
    log("no history found, creating one");
    const cr = await ws({
      type: "maintenance_supporter/object/create",
      name: `histtest-${Math.random().toString(36).slice(2, 8)}`,
    });
    const newEntryId = cr.entry_id;
    await new Promise(r => setTimeout(r, 500));
    const tr = await ws({
      type: "maintenance_supporter/task/create",
      entry_id: newEntryId,
      name: "edit-test-task",
      schedule_type: "time_based",
      interval_days: 30,
    });
    const newTaskId = tr.task_id;
    await new Promise(r => setTimeout(r, 500));
    await ws({
      type: "maintenance_supporter/task/complete",
      entry_id: newEntryId,
      task_id: newTaskId,
      notes: "initial completion",
      cost: 25.0,
      duration: 45,
    });
    await new Promise(r => setTimeout(r, 800));
    const fresh = await ws({
      type: "maintenance_supporter/object",
      entry_id: newEntryId,
    });
    testEntry = { entry_id: newEntryId };
    testTask = fresh.tasks.find(t => t.id === newTaskId);
  }
  log("test target", {
    entry_id: testEntry.entry_id,
    task_id: testTask.id,
    history_count: testTask.history.length,
  });

  // 2. Take the FIRST completed entry (most likely to be lifecycle-relevant)
  const original = testTask.history.find(h => h.type === "completed")
    || testTask.history[0];
  const originalTs = original.timestamp;
  log("original entry", { ts: originalTs, notes: original.notes, cost: original.cost });

  // 3. PATCH 1 — change notes only
  const patchedNotes = `e2e-patch-${Date.now()}`;
  const r1 = await ws({
    type: "maintenance_supporter/task/history/update",
    entry_id: testEntry.entry_id,
    task_id: testTask.id,
    original_timestamp: originalTs,
    notes: patchedNotes,
  });
  log("patch1 result", r1);
  out.patch1_ok = r1.success === true;

  // 4. Verify roundtrip
  await new Promise(r => setTimeout(r, 800));
  const round1 = await ws({
    type: "maintenance_supporter/object",
    entry_id: testEntry.entry_id,
  });
  const taskAfter1 = round1.tasks.find(t => t.id === testTask.id);
  const entryAfter1 = taskAfter1.history.find(h => h.timestamp === originalTs);
  out.notes_persisted = entryAfter1?.notes === patchedNotes;
  log("after patch1", { notes: entryAfter1?.notes });

  // 5. PATCH 2 — change cost AND duration in one call
  const r2 = await ws({
    type: "maintenance_supporter/task/history/update",
    entry_id: testEntry.entry_id,
    task_id: testTask.id,
    original_timestamp: originalTs,
    cost: 99.95,
    duration: 123,
  });
  out.patch2_ok = r2.success === true;
  await new Promise(r => setTimeout(r, 800));
  const round2 = await ws({
    type: "maintenance_supporter/object",
    entry_id: testEntry.entry_id,
  });
  const taskAfter2 = round2.tasks.find(t => t.id === testTask.id);
  const entryAfter2 = taskAfter2.history.find(h => h.timestamp === originalTs);
  out.cost_persisted = entryAfter2?.cost === 99.95;
  out.duration_persisted = entryAfter2?.duration === 123;
  out.notes_still_there = entryAfter2?.notes === patchedNotes;  // unchanged
  out.type_unchanged = entryAfter2?.type === original.type;     // never patchable

  // 6. PATCH 3 — clear notes via null
  const r3 = await ws({
    type: "maintenance_supporter/task/history/update",
    entry_id: testEntry.entry_id,
    task_id: testTask.id,
    original_timestamp: originalTs,
    notes: null,
  });
  out.patch3_ok = r3.success === true;
  await new Promise(r => setTimeout(r, 800));
  const round3 = await ws({
    type: "maintenance_supporter/object",
    entry_id: testEntry.entry_id,
  });
  const taskAfter3 = round3.tasks.find(t => t.id === testTask.id);
  const entryAfter3 = taskAfter3.history.find(h => h.timestamp === originalTs);
  out.notes_cleared = entryAfter3?.notes == null;

  // 7. PATCH 4 — change timestamp; verify last_performed follows when this
  //    is the latest lifecycle entry
  const lifecycleEntries = taskAfter3.history.filter(
    h => ["completed", "reset", "skipped"].includes(h.type),
  );
  const latestTs = lifecycleEntries.reduce(
    (max, h) => h.timestamp > max ? h.timestamp : max,
    "",
  );
  const isLatest = entryAfter3.timestamp === latestTs;
  out.is_latest_lifecycle = isLatest;
  if (isLatest) {
    // Bump timestamp by 1 hour
    const dt = new Date(entryAfter3.timestamp);
    dt.setHours(dt.getHours() + 1);
    const newTs = dt.toISOString();
    const r4 = await ws({
      type: "maintenance_supporter/task/history/update",
      entry_id: testEntry.entry_id,
      task_id: testTask.id,
      original_timestamp: entryAfter3.timestamp,
      timestamp: newTs,
    });
    out.patch4_ok = r4.success === true;
    await new Promise(r => setTimeout(r, 800));
    const round4 = await ws({
      type: "maintenance_supporter/object",
      entry_id: testEntry.entry_id,
    });
    const taskAfter4 = round4.tasks.find(t => t.id === testTask.id);
    const entryAfter4 = taskAfter4.history.find(h => h.timestamp === newTs);
    out.timestamp_persisted = entryAfter4 != null;
    out.last_performed_followed =
      taskAfter4.last_performed === newTs.slice(0, 10);
  }

  // 8. INVALID timestamp rejected
  try {
    await ws({
      type: "maintenance_supporter/task/history/update",
      entry_id: testEntry.entry_id,
      task_id: testTask.id,
      original_timestamp: "nonexistent-2020-01-01",
      notes: "oops",
    });
    out.invalid_ts_rejected = false;
  } catch (e) {
    out.invalid_ts_rejected = true;
    out.invalid_ts_error = String(e).substring(0, 200);
  }

  return out;
});

console.log(JSON.stringify(result, null, 2));

const summary = [
  ["patch1 (notes)               ", result.patch1_ok && result.notes_persisted],
  ["patch2 (cost+duration)       ", result.patch2_ok && result.cost_persisted && result.duration_persisted],
  ["patch2 leaves notes intact   ", result.notes_still_there],
  ["patch2 leaves type intact    ", result.type_unchanged],
  ["patch3 (clear notes via null)", result.patch3_ok && result.notes_cleared],
  ["patch4 (timestamp)           ", result.is_latest_lifecycle ? (result.patch4_ok && result.timestamp_persisted) : true],
  ["last_performed follows latest", result.is_latest_lifecycle ? result.last_performed_followed : true],
  ["invalid original_ts rejected ", result.invalid_ts_rejected],
];

console.log("\n=== SUMMARY ===");
let allOk = true;
for (const [label, ok] of summary) {
  console.log(`  ${ok ? "✓" : "✗"} ${label}`);
  if (!ok) allOk = false;
}

await browser.close();
process.exit(allOk ? 0 : 1);
