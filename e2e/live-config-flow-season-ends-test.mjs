/** Live end-to-end for the NEW config-flow (options) surface of the seasonal
 *  window + finite-series end, against ha-maint (REST options flow + WS read).
 *  Drives the real per-object options flow exactly as the HA UI would:
 *    init menu → manage_tasks → select the task → edit_task → submit the form
 *    with season_months + ends_count, then reads the task back over WS and
 *    asserts the persisted nested schedule carries season_months + ends.
 */
import fs from "fs";
const REST = "http://127.0.0.1:8125", WS = "ws://127.0.0.1:8125/api/websocket";
const token = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8").match(/HA_TOKEN=(\S+)/)[1];
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 80e3);

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

// REST options-flow helpers ---------------------------------------------------
async function flowStart(entryId) {
  const r = await fetch(REST + "/api/config/config_entries/options/flow", {
    method: "POST", headers: auth, body: JSON.stringify({ handler: entryId, show_advanced_options: false }),
  });
  if (!r.ok) throw new Error("flow start " + r.status + " " + (await r.text()));
  return r.json();
}
async function flowStep(flowId, body) {
  const r = await fetch(REST + "/api/config/config_entries/options/flow/" + flowId, {
    method: "POST", headers: auth, body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("flow step " + r.status + " " + (await r.text()));
  return r.json();
}

// Seed a time-based task (so the recurrence-extras fields are offered) ---------
const created = [];
async function seedTimeBasedTask(name) {
  const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
    method: "POST", headers: auth, body: JSON.stringify({ name: name + " " + suffix }),
  }).then((r) => r.json());
  const entryId = (svc.service_response ?? svc).entry_id;
  created.push(entryId);
  const r = await api.send({
    type: "maintenance_supporter/task/create",
    entry_id: entryId, name: "Mow", task_type: "cleaning",
    schedule: { kind: "interval", every: 30, unit: "days" },
  });
  return { entryId, taskId: r.task_id };
}
async function taskOf(entryId, taskId) {
  const objs = await api.send({ type: "maintenance_supporter/objects" });
  const obj = objs.objects.find((o) => o.entry_id === entryId);
  return obj.tasks.find((t) => t.id === taskId) || obj.tasks[0];
}

// ── Drive the options flow: edit the task with season + finite end ───────────
const { entryId, taskId } = await seedTimeBasedTask("CFSeason");
log("seeded object", entryId, "task", taskId);

let step = await flowStart(entryId);
if (step.type !== "menu") throw new Error("expected init menu, got " + step.type + "/" + step.step_id);
step = await flowStep(step.flow_id, { next_step_id: "manage_tasks" });
if (step.step_id !== "manage_tasks") throw new Error("expected manage_tasks, got " + step.step_id);
step = await flowStep(step.flow_id, { selected_task: taskId, go_back: false });
if (step.type !== "menu") throw new Error("expected task-action menu, got " + step.type + "/" + step.step_id);
step = await flowStep(step.flow_id, { next_step_id: "edit_task" });
if (step.step_id !== "edit_task") throw new Error("expected edit_task form, got " + step.step_id);

// Confirm the new fields are actually offered on the live form.
const fieldNames = (step.data_schema || []).map((f) => f.name);
log("edit_task fields:", fieldNames.join(", "));
for (const f of ["season_months", "ends_count", "ends_until"]) {
  if (!fieldNames.includes(f)) throw new Error("edit_task form is missing field: " + f);
}

// Submit the edit with a spring-to-autumn window + a 6-completion finite series.
const submit = {
  name: "Mow", type: "cleaning", interval_days: 14,
  season_months: ["4", "5", "6", "7", "8", "9", "10"],
  ends_count: 6,
};
// The container has the advanced schedule-time flag on, so the form offers a
// TimeSelector whose empty default fails its own validator — send a real time.
if (fieldNames.includes("schedule_time")) submit.schedule_time = "09:00:00";
const done = await flowStep(step.flow_id, submit);
if (done.type !== "create_entry" && done.type !== "menu")
  throw new Error("edit submit did not finish cleanly: " + JSON.stringify(done).slice(0, 200));
log("edit submitted, flow result:", done.type);

// ── Assert the persisted schedule over WS ────────────────────────────────────
const t = await taskOf(entryId, taskId);
log("persisted schedule:", JSON.stringify(t.schedule));
const sm = t.schedule?.season_months;
if (JSON.stringify(sm) !== JSON.stringify([4, 5, 6, 7, 8, 9, 10]))
  throw new Error("season_months not persisted via config flow: " + JSON.stringify(sm));
if (JSON.stringify(t.schedule?.ends) !== JSON.stringify({ count: 6 }))
  throw new Error("ends not persisted via config flow: " + JSON.stringify(t.schedule?.ends));
log("config-flow season + finite end OK");

// The off-season next_due must have rolled into the active window (Apr–Oct).
const dueMonth = t.next_due ? Number(t.next_due.slice(5, 7)) : null;
log("next_due:", t.next_due, "(month", dueMonth + ")");
if (dueMonth !== null && (dueMonth < 4 || dueMonth > 10))
  throw new Error("next_due fell outside the seasonal window: " + t.next_due);

// Cleanup
for (const id of created) {
  await fetch(REST + "/api/config/config_entries/entry/" + id, { method: "DELETE", headers: auth }).catch(() => {});
}
log("cleaned up");
api.close();
log("ALL OK");
process.exit(0);
