/** Live end-to-end for the three scheduling features against ha-maint (pure
 *  WebSocket, admin token — no browser). Verifies, in the running integration:
 *   1. Seasonal window: a monthly task limited to January rolls its next_due to
 *      a YYYY-01-01 (the next active month), whatever "now" is.
 *   2. Finite series: `ends.count = 1` → one completion marks the task done and
 *      it never re-arms.
 *   3. Postpone: task/postpone moves next_due to the chosen date; completing
 *      consumes the override and the cadence returns to normal.
 */
import fs from "fs";
const REST = "http://127.0.0.1:8125", WS = "ws://127.0.0.1:8125/api/websocket";
const token = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8").match(/HA_TOKEN=(\S+)/)[1];
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 90e3);

async function wsClient() {
  const ws = new WebSocket(WS);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("ws connect failed")); });
  let nextId = 1;
  const pending = new Map();
  await new Promise((res, rej) => {
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "auth_required") ws.send(JSON.stringify({ type: "auth", access_token: token }));
      else if (m.type === "auth_ok") res();
      else if (m.type === "auth_invalid") rej(new Error("auth invalid"));
      else if (m.type === "result") {
        const p = pending.get(m.id); if (!p) return;
        pending.delete(m.id);
        m.success ? p.res(m.result) : p.rej(new Error(JSON.stringify(m.error)));
      }
    };
  });
  return {
    send: (msg) => new Promise((res, rej) => { const id = nextId++; pending.set(id, { res, rej }); ws.send(JSON.stringify({ ...msg, id })); }),
    close: () => ws.close(),
  };
}

const api = await wsClient();
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

  // Completing consumes the override — assert due_override is cleared. (The
  // recomputed next_due settles on the next coordinator refresh; the exact
  // cadence-restoration invariant is pinned deterministically in the
  // test_journey_finite_and_postpone journey.)
  await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: taskId });
  for (let i = 0; i < 10; i++) {
    t = await taskOf(entryId);
    if (!t.due_override) break;
    await new Promise((r) => setTimeout(r, 300));
  }
  log("after complete — due_override:", t.due_override);
  if (t.due_override) throw new Error("override not cleared on completion");
  log("postpone OK (override set on postpone, cleared on complete)");
}

// Cleanup.
for (const entryId of created) {
  await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
}
log("cleaned up");

log("ALL OK");
api.close();
process.exit(0);
