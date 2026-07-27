/** Live check: a task that DEMANDS completion details cannot be closed out
 * from a surface that never asked for them.
 *
 * The rule is enforced in the coordinator, so this drives the real surfaces
 * against the dev instance and asserts each one behaves:
 *
 *   1. WS complete without the details  → rejected, nothing recorded
 *   2. WS complete with the details     → recorded
 *   3. the one-press button entity      → rejected (it cannot ask)
 *   4. the to-do check-off              → rejected
 *   5. the maintenance_supporter.complete service without details → rejected
 *   6. a task with no requirements      → still one-tap, unaffected
 *
 * Run from the repo root:
 *   node e2e/live-required-completion-check.mjs
 */

import { loadToken, wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const log = (...a) => console.log(...a);
watchdog(5 * 60e3, "required completion check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = process.env.MS_STAMP || String(Date.now()).slice(-6);

const results = [];
const check = (ok, line) => { results.push({ ok, line }); log(`  ${ok ? "PASS" : "FAIL"} ${line}`); };

/** Call a HA service over WS; resolve {ok} instead of throwing. */
async function callService(domain, service, service_data) {
  try {
    await api.send({ type: "call_service", domain, service, service_data });
    return { ok: true };
  } catch (e) {
    return { ok: false, err: String(e?.message || e) };
  }
}

async function historyCount(entryId, taskId) {
  const res = await api.send({ type: "maintenance_supporter/objects" });
  const obj = res.objects.find((o) => o.entry_id === entryId);
  const task = obj?.tasks.find((t) => t.id === taskId);
  return (task?.history || []).filter((h) => h.type === "completed").length;
}

let entryId = null;
try {
  const obj = await api.send({
    type: "maintenance_supporter/object/create", name: `Required details ${stamp}`,
  });
  entryId = obj.entry_id;

  const strict = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Strict chore", task_type: "cleaning", interval_days: 1,
    last_performed: "2020-01-01",
    required_completion_fields: ["notes", "cost"],
  });
  const relaxed = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Relaxed chore", task_type: "cleaning", interval_days: 1,
    last_performed: "2020-01-01",
  });
  // Creating a task with `last_performed` seeds a history entry, so every
  // assertion below compares against this baseline rather than zero.
  const base = await historyCount(entryId, strict.task_id);
  log(`seeded strict=${strict.task_id} relaxed=${relaxed.task_id} (history baseline ${base})`);

  // 1 — WS complete without the details
  let rejected = false;
  try {
    await api.send({
      type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: strict.task_id,
    });
  } catch (e) {
    rejected = String(e?.code || e?.message || e).includes("completion_details_required");
  }
  check(rejected, "WS complete without details is rejected");
  check((await historyCount(entryId, strict.task_id)) === base, "nothing was recorded by the rejected attempt");

  // 3 — the button entity (cannot ask, so must refuse)
  const buttonId = `button.required_details_${stamp}_strict_chore_complete`;
  const btn = await callService("button", "press", { entity_id: buttonId });
  check(!btn.ok, `button press refused (${buttonId})`);
  check((await historyCount(entryId, strict.task_id)) === base, "button press recorded nothing");

  // 5 — the service without details
  const sensorId = `sensor.required_details_${stamp}_strict_chore`;
  const svc = await callService("maintenance_supporter", "complete", { entity_id: sensorId });
  check(!svc.ok, "service complete without details refused");

  // 4 — the to-do list
  const items = await api.send({ type: "todo/item/list", entity_id: "todo.maintenance" }).catch(() => null);
  const item = items?.items?.find((i) => (i.summary || "").includes("Strict chore"));
  if (item) {
    const todo = await callService("todo", "update_item", {
      entity_id: "todo.maintenance", item: item.uid, status: "completed",
    });
    check(!todo.ok, "to-do check-off refused");
  } else {
    log("  SKIP to-do (task not on the list yet)");
  }

  // 2 — WS complete WITH the details
  let accepted = false;
  try {
    await api.send({
      type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: strict.task_id,
      notes: "descaled with citric acid", cost: 4.5,
    });
    accepted = true;
  } catch (e) {
    log("  (unexpected)", e?.message || e);
  }
  check(accepted, "WS complete WITH details succeeds");
  check((await historyCount(entryId, strict.task_id)) === base + 1, "the good completion was recorded exactly once");

  // 6 — a task without requirements stays one-tap
  let plain = false;
  try {
    await api.send({
      type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: relaxed.task_id,
    });
    plain = true;
  } catch { /* noop */ }
  check(plain, "a task without requirements still completes in one tap");
} finally {
  if (entryId) {
    await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  }
  api.close();
}

const fails = results.filter((r) => !r.ok);
log(fails.length ? `\n${fails.length} FAILURES` : "\nREQUIRED COMPLETION: ALL PASS");
process.exit(fails.length ? 1 : 0);
