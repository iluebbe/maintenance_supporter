/** Deterministic prod-scale seed for panel performance measurement.
 *
 *  Creates PERF_OBJECTS objects x PERF_TASKS tasks (default 20 x 8 = 160 —
 *  mirroring a real 150-task install), each task with PERF_HISTORY completed
 *  history entries (the `objects` payload carries history, so entry count is
 *  a first-class suspect for load cost). Status mix is pinned afterwards via
 *  task/reset: ~2 overdue + 2 due-soon + 4 ok per object.
 *
 *  Idempotent: objects are named "Perf NN" — existing ones are counted and
 *  only the missing remainder is created. PERF_CLEANUP=1 deletes all Perf
 *  objects instead (restores the instance for docs screenshots).
 *
 *  Target: the seeded ha-shots demo instance by default (demo/demo-pass-1);
 *  any instance via HA_URL + HA_TOKEN.
 *
 *    node e2e/perf-seed.mjs
 *    PERF_CLEANUP=1 node e2e/perf-seed.mjs
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const REST = process.env.HA_URL || "http://127.0.0.1:8131";
const D = "maintenance_supporter";
const N_OBJECTS = parseInt(process.env.PERF_OBJECTS || "20", 10);
const N_TASKS = parseInt(process.env.PERF_TASKS || "8", 10);
const N_HISTORY = parseInt(process.env.PERF_HISTORY || "8", 10);
watchdog(15 * 60e3, "perf seed");
const log = (...a) => console.log(...a);

async function token() {
  if (process.env.HA_TOKEN) return process.env.HA_TOKEN;
  const CID = "http://ha-shots:8123/";
  const j = (r) => r.json();
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: "demo", password: "demo-pass-1" }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("login failed");
  return t.access_token;
}

const api = await wsClient(REST, await token());
const existing = (await api.send({ type: `${D}/objects` })).objects.filter((o) => /^Perf \d+$/.test(o.object.name));

if (process.env.PERF_CLEANUP === "1") {
  for (const o of existing) {
    await api.send({ type: `${D}/object/delete`, entry_id: o.entry_id }).catch((e) => log("delete failed:", o.object.name, String(e).slice(0, 60)));
  }
  log(`cleaned up ${existing.length} perf objects`);
  api.close();
  process.exit(0);
}

log(`existing perf objects: ${existing.length} / ${N_OBJECTS}`);
const LABELS = ["safety", "seasonal", "kitchen", "garden", "workshop"];
const TYPES = ["cleaning", "inspection", "replacement", "service", "custom"];
const iso = (d) => d.toISOString().slice(0, 10);

for (let i = existing.length; i < N_OBJECTS; i++) {
  const name = `Perf ${String(i + 1).padStart(2, "0")}`;
  const created = await api.send({ type: `${D}/object/create`, name, manufacturer: "Perf Fixtures", model: `Model ${i}` })
    .catch(() => api.send({ type: `${D}/object/create`, name }));
  const entryId = created.entry_id;
  for (let k = 0; k < N_TASKS; k++) {
    const payload = {
      type: `${D}/task/create`,
      entry_id: entryId,
      name: `Task ${String(k + 1).padStart(2, "0")} of ${name}`,
      task_type: TYPES[k % TYPES.length],
      interval_days: 30,
      ...(k % 4 === 0 ? { checklist: ["Step one", "Step two", "Step three"] } : {}),
    };
    if (k % 3 === 0) payload.notes = `Synthetic perf task ${k} — deterministic seed for the benchmark harness.`;
    const t = await api.send(payload);
    const taskId = t.task_id || t.id;
    // priority/labels ride as a patch — the create schema is strict.
    await api.send({
      type: `${D}/task/update`, entry_id: entryId, task_id: taskId,
      priority: k === 0 ? "high" : k === 1 ? "low" : "normal",
      labels: [LABELS[k % LABELS.length]],
    }).catch(() => {});
    // History entries drive the objects-payload size — the real-install
    // ingredient a fresh seed otherwise lacks.
    for (let h = 0; h < N_HISTORY; h++) {
      await api.send({
        type: `${D}/task/complete`, entry_id: entryId, task_id: taskId,
        notes: h % 3 === 0 ? `completion ${h}` : undefined, cost: h % 4 === 0 ? 12.5 : undefined,
      }).catch(() => {});
    }
    // Pin the status mix: k=0,1 overdue (due 5/12 d ago), k=2,3 due soon
    // (in 2/5 d), rest comfortably ok. reset re-anchors the recurrence.
    const dueIn = k <= 1 ? -(5 + 7 * k) : k <= 3 ? 2 + 3 * (k - 2) : 20 + 30 * k;
    const anchor = new Date(Date.now() + (dueIn - 30) * 864e5);
    await api.send({ type: `${D}/task/reset`, entry_id: entryId, task_id: taskId, date: iso(anchor) }).catch((e) => {
      if (i === existing.length && k === 0) log("task/reset failed (status mix degraded):", String(e).slice(0, 100));
    });
  }
  log(`seeded ${name} (${N_TASKS} tasks x ${N_HISTORY} completions)`);
}

const after = (await api.send({ type: `${D}/objects` })).objects;
const perf = after.filter((o) => /^Perf \d+$/.test(o.object.name));
const total = after.reduce((n, o) => n + o.tasks.length, 0);
log(`DONE: ${perf.length} perf objects, ${total} tasks total on the instance`);
api.close();
