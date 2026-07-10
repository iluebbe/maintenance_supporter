/** Live end-to-end: JSON export → delete → import round-trip against ha-maint.
 *
 * Proves a JSON backup/restore preserves the full v2.17+/#83 task-field wave
 * (priority, labels, reading_unit, schedule_time, earliest_completion_days,
 * checklist, notes, on_complete_action, quick_complete_defaults) plus history
 * with a reading_value. Pure WebSocket (admin token) — no browser needed. */
import { loadToken, wsClient, watchdog } from "./ws-client.mjs";
const REST = "http://127.0.0.1:8125";
const token = loadToken();
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
watchdog(90e3, "import-export test");

const api = await wsClient(REST, token);

// Two real users so the assignee_pool survives the setup-time user reconcile.
const users = await api.send({ type: "maintenance_supporter/users/list" }).catch(() => ({ users: [] }));
const realUsers = (users.users || []).filter((u) => u.id && !u.system).slice(0, 2);
const pool = realUsers.map((u) => u.id);
log("real users for pool:", pool.length);

// 1. Seed an object + a rich task.
const suffix = Date.now() % 100000;
const objName = "RoundTrip Asset " + suffix;
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: objName }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;
log("object", entryId);

const taskFields = {
  entry_id: entryId,
  name: "Full Field Task",
  task_type: "reading",
  interval_days: 30,
  warning_days: 7,
  priority: "high",
  labels: ["seasonal", "critical"],
  reading_unit: "kWh",
  schedule_time: "08:30",
  notes: "torque 25Nm",
  documentation_url: "https://x.test/manual.pdf",
  checklist: ["Step 1", "Step 2", "Step 3"],
  on_complete_action: { service: "notify.test", data: { message: "done" } },
  quick_complete_defaults: { notes: "std", cost: 12.5, duration: 20, feedback: "needed" },
};
if (pool.length === 2) {
  taskFields.assignee_pool = pool;
  taskFields.rotation_strategy = "round_robin";
  taskFields.responsible_user_id = pool[0];
}
const created = await api.send({ type: "maintenance_supporter/task/create", ...taskFields });
const taskId = created.task_id;
log("task", taskId);

// Complete it once with a meter reading so history carries a reading_value.
// (earliest_completion_days is added AFTER — it would block completing a task
// whose due date is 30 days out.)
await api.send({
  type: "maintenance_supporter/task/complete",
  entry_id: entryId, task_id: taskId, cost: 9.0, reading_value: 1234.5,
});
log("completed with reading 1234.5");
await api.send({
  type: "maintenance_supporter/task/update",
  entry_id: entryId, task_id: taskId, earliest_completion_days: 3,
});
log("set earliest_completion_days=3");

// 2. Export JSON (with history).
const exp = await api.send({ type: "maintenance_supporter/export", format: "json", include_history: true });
const full = JSON.parse(exp.data);
const mine = full.objects.find((o) => o.object.name === objName);
if (!mine) throw new Error("exported object not found");
const et = mine.tasks.find((t) => t.name === "Full Field Task");
log("EXPORTED", JSON.stringify({
  priority: et.priority, labels: et.labels, reading_unit: et.reading_unit,
  schedule_time: et.schedule_time, earliest: et.earliest_completion_days,
  checklist: (et.checklist || []).length, notes: et.notes,
  on_complete: !!et.on_complete_action, qcd: !!et.quick_complete_defaults,
  pool: (et.assignee_pool || []).length, rot: et.rotation_strategy,
  histReading: et.history?.[0]?.reading_value,
}));

const expectExport = {
  priority: "high",
  labels: ["seasonal", "critical"],
  reading_unit: "kWh",
  schedule_time: "08:30",
  earliest_completion_days: 3,
  notes: "torque 25Nm",
};
for (const [k, v] of Object.entries(expectExport)) {
  const got = JSON.stringify(et[k]);
  if (got !== JSON.stringify(v)) throw new Error(`EXPORT lost ${k}: ${got} != ${JSON.stringify(v)}`);
}
if ((et.checklist || []).length !== 3) throw new Error("EXPORT lost checklist");
if (!et.on_complete_action) throw new Error("EXPORT lost on_complete_action");
if (!et.quick_complete_defaults) throw new Error("EXPORT lost quick_complete_defaults");
if (et.history?.[0]?.reading_value !== 1234.5) throw new Error("EXPORT lost history reading_value");
if (pool.length === 2 && (et.assignee_pool || []).length !== 2) throw new Error("EXPORT lost assignee_pool");
log("export OK — all fields present");

// 3. Delete the object (clean slate).
await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId });
log("deleted original");

// 4. Import the exported object back (renamed to avoid unique_id clash).
const copyName = objName + " Copy";
mine.object.name = copyName;
await api.send({ type: "maintenance_supporter/json/import", json_content: JSON.stringify({ objects: [mine] }) });
log("imported copy");

// 5. Verify via the read path (objects list → the imported task).
const objs = await api.send({ type: "maintenance_supporter/objects" });
const copy = objs.objects.find((o) => o.object.name === copyName);
if (!copy) throw new Error("imported copy not found");
const it = copy.tasks.find((t) => t.name === "Full Field Task");
if (!it) throw new Error("imported task not found");
log("IMPORTED", JSON.stringify({
  priority: it.priority, labels: it.labels, reading_unit: it.reading_unit,
  schedule_time: it.schedule_time, earliest: it.earliest_completion_days,
  checklist: (it.checklist || []).length, notes: it.notes,
  on_complete: !!it.on_complete_action, qcd: !!it.quick_complete_defaults,
  pool: (it.assignee_pool || []).length, rot: it.rotation_strategy,
}));
for (const [k, v] of Object.entries(expectExport)) {
  const got = JSON.stringify(it[k]);
  if (got !== JSON.stringify(v)) throw new Error(`IMPORT lost ${k}: ${got} != ${JSON.stringify(v)}`);
}
if ((it.checklist || []).length !== 3) throw new Error("IMPORT lost checklist");
if (!it.on_complete_action) throw new Error("IMPORT lost on_complete_action");
if (!it.quick_complete_defaults) throw new Error("IMPORT lost quick_complete_defaults");
if (pool.length === 2 && ((it.assignee_pool || []).length !== 2 || it.rotation_strategy !== "round_robin")) {
  throw new Error("IMPORT lost assignee_pool/rotation");
}
// History round-trips: re-export the copy and check reading_value.
const exp2 = await api.send({ type: "maintenance_supporter/export", format: "json", include_history: true });
const copy2 = JSON.parse(exp2.data).objects.find((o) => o.object.name === copyName);
const it2 = copy2.tasks.find((t) => t.name === "Full Field Task");
if (it2.history?.[0]?.reading_value !== 1234.5) throw new Error("IMPORT lost history reading_value");
log("import OK — all fields preserved");

// Cleanup.
await api.send({ type: "maintenance_supporter/object/delete", entry_id: copy.entry_id });
log("cleaned up");

log("ALL OK");
api.close();
process.exit(0);
