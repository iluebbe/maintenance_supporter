/** Live end-to-end for the three scheduling features against ha-maint (pure
 *  WebSocket, admin token — no browser). Verifies, in the running integration:
 *   1. Seasonal window: a monthly task limited to January rolls its next_due to
 *      a YYYY-01-01 (the next active month), whatever "now" is.
 *   2. Finite series: `ends.count = 1` → one completion marks the task done and
 *      it never re-arms.
 *   3. Postpone: task/postpone moves next_due to the chosen date; completing
 *      consumes the override and the cadence returns to normal.
 */
import { loadToken, wsClient, watchdog } from "./ws-client.mjs";
const REST = "http://127.0.0.1:8125";
const token = loadToken();
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
watchdog(90e3, "scheduling-features test");

const api = await wsClient(REST, token);
const suffix = Date.now() % 100000;

async function seedObject(name) {
  const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
    method: "POST", headers: auth, body: JSON.stringify({ name: name + " " + suffix }),
  }).then((r) => r.json());
  return (svc.service_response ?? svc).entry_id;
}

async function taskOf(entryId) {
  const objs = await api.send({ type: "maintenance_supporter/objects" });
  const obj = objs.objects.find((o) => o.entry_id === entryId);
  return obj.tasks[0];
}

const created = [];
async function makeTask(name, schedule) {
  const entryId = await seedObject(name);
  created.push(entryId);
  const r = await api.send({
    type: "maintenance_supporter/task/create",
    entry_id: entryId, name: "T", task_type: "inspection", schedule,
  });
  return { entryId, taskId: r.task_id };
}

// ── 1. Seasonal window ───────────────────────────────────────────────────────
{
  const { entryId } = await makeTask("Season", { kind: "interval", every: 1, unit: "months", season_months: [1] });
  const t = await taskOf(entryId);
  log("season next_due:", t.next_due);
  if (!/^\d{4}-01-01$/.test(t.next_due || "")) throw new Error("season window did not roll next_due to January: " + t.next_due);
  log("seasonal window OK");
}

// ── 2. Finite series (ends.count = 1) ────────────────────────────────────────
{
  const { entryId, taskId } = await makeTask("Finite", { kind: "interval", every: 1, unit: "months", ends: { count: 1 } });
  let t = await taskOf(entryId);
  if (t.is_done) throw new Error("finite series done before any completion");
  await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: taskId });
  t = await taskOf(entryId);
  log("finite after 1 completion — is_done:", t.is_done, "next_due:", t.next_due);
  if (t.is_done !== true) throw new Error("ends.count=1 series not done after one completion");
  if (t.next_due !== null) throw new Error("ended series still has a next_due: " + t.next_due);
  log("finite series OK");
}

// ── 3. Postpone a single occurrence ──────────────────────────────────────────
{
  const { entryId, taskId } = await makeTask("Postpone", { kind: "interval", every: 1, unit: "months" });
  const natural = (await taskOf(entryId)).next_due;
  await api.send({ type: "maintenance_supporter/task/postpone", entry_id: entryId, task_id: taskId, until: "2030-01-15" });
  let t = await taskOf(entryId);
  log("postpone — next_due:", t.next_due, "due_override:", t.due_override);
  if (t.next_due !== "2030-01-15") throw new Error("postpone did not move next_due: " + t.next_due);
  if (t.due_override !== "2030-01-15") throw new Error("due_override not exposed: " + t.due_override);

  // Completing consumes the override and restores the cadence. The coordinator
  // processes the completion asynchronously (debounced refresh), so poll until
  // times_performed increments — then the recomputed next_due has settled.
  await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: taskId });
  for (let i = 0; i < 40; i++) {
    t = await taskOf(entryId);
    if ((t.times_performed || 0) >= 1) break;
    await new Promise((r) => setTimeout(r, 500));
  }
  log("after complete — next_due:", t.next_due, "due_override:", t.due_override, "times_performed:", t.times_performed);
  if (t.due_override) throw new Error("override not cleared on completion");
  if (t.next_due === "2030-01-15") throw new Error("cadence not restored after the postponed cycle");
  log("postpone OK (override set, cleared on complete, cadence restored)");
}

// Cleanup.
for (const entryId of created) {
  await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
}
log("cleaned up");

log("ALL OK");
api.close();
process.exit(0);
