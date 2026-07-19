/** Live lifecycle check for adopted problem sensors on ha-maint (v2.37):
 *  adopt with responsible user → configure → problem fires → recovery
 *  auto-completes (history flagged auto, rotation/responsible untouched) →
 *  un-adopt → re-adopt restores the full config from the stash.
 *  Seeds + cleans up its own fake sensor/object. */
import { loadToken, wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const token = loadToken();
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(120e3, "problem sensor lifecycle check");

const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const SENSOR = `binary_sensor.live_ps_${stamp}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const setSensor = async (state) => {
  const r = await fetch(`${REST}/api/states/${SENSOR}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      state,
      attributes: { device_class: "problem", friendly_name: `Live PS ${stamp}` },
    }),
  });
  if (!r.ok) fail(`set sensor ${state}: HTTP ${r.status}`);
};

const findObject = async (name) => {
  const res = await api.send({ type: "maintenance_supporter/objects" });
  return res.objects.find((o) => o.object.name === name) || null;
};

let entryIds = [];
try {
  await setSensor("off");

  // 1) Discover lists the sensor.
  const disc = await api.send({ type: "maintenance_supporter/problem_sensors/discover" });
  const cand = disc.sensors.find((s) => s.entity_id === SENSOR);
  assert(cand, "discover lists the fake problem sensor");

  // 2) Adopt with a responsible user (as the dialog now sends).
  const users = await api.send({ type: "maintenance_supporter/users/list" });
  const user = users.users[0];
  assert(user, "users/list returns a user");
  const adopt = await api.send({
    type: "maintenance_supporter/problem_sensors/adopt",
    selections: [{
      entity_id: SENSOR, name: `Live PS ${stamp}`,
      object_name: `PS Object ${stamp}`, responsible_user_id: user.id,
    }],
  });
  assert(adopt.tasks_created === 1, "one task created");
  assert(adopt.created?.length === 1 && adopt.created[0].task_id, "result carries created task ref");
  const obj = await findObject(`PS Object ${stamp}`);
  entryIds.push(obj.entry_id);
  let task = obj.tasks.find((t) => t.id === adopt.created[0].task_id);
  assert(task.responsible_user_id === user.id, "adopted task carries the responsible user");

  // 3) Configure like a real user would (priority, labels, notes).
  await api.send({
    type: "maintenance_supporter/task/update", entry_id: obj.entry_id, task_id: task.id,
    priority: "high", labels: ["live-check"], notes: "Reset via service menu.",
  });

  // 4) Problem fires → task due (triggered).
  await setSensor("on");
  await sleep(2500);
  let o = await findObject(`PS Object ${stamp}`);
  task = o.tasks.find((t) => t.id === task.id);
  assert(["triggered", "overdue", "due_soon"].includes(task.status) || task.trigger_active,
    `task became due when the sensor fired (status=${task.status})`);

  // 5) Recovery → auto-complete: history flagged, responsible untouched.
  await setSensor("off");
  await sleep(2500);
  o = await findObject(`PS Object ${stamp}`);
  task = o.tasks.find((t) => t.id === task.id);
  const detail = await api.send({
    type: "maintenance_supporter/task_detail", entry_id: o.entry_id, task_id: task.id,
  }).catch(() => null);
  const history = (detail?.task?.history ?? task.history ?? []).filter((h) => h.type === "completed");
  assert(history.length === 1, "exactly one completion recorded");
  assert(history[0].auto === true, "completion is flagged auto");
  assert(!history[0].completed_by, "auto completion has no user attribution");
  assert(task.responsible_user_id === user.id, "responsible user untouched by auto-complete");

  // 6) Un-adopt → re-adopt WITHOUT explicit responsible: stash restores all.
  await api.send({ type: "maintenance_supporter/task/delete", entry_id: o.entry_id, task_id: task.id });
  const adopt2 = await api.send({
    type: "maintenance_supporter/problem_sensors/adopt",
    selections: [{ entity_id: SENSOR, name: `Live PS ${stamp}`, object_name: `PS Object2 ${stamp}` }],
  });
  assert(adopt2.tasks_created === 1, "re-adopt created a task");
  const obj2 = await findObject(`PS Object2 ${stamp}`);
  entryIds.push(obj2.entry_id);
  const task2 = obj2.tasks.find((t) => t.id === adopt2.created[0].task_id);
  assert(task2.notes === "Reset via service menu.", "notes restored from stash");
  assert(task2.priority === "high", "priority restored from stash");
  assert((task2.labels || []).includes("live-check"), "labels restored from stash");
  assert(task2.responsible_user_id === user.id, "responsible user restored from stash");

  log("\nPROBLEM SENSOR LIFECYCLE LIVE CHECK PASSED");
} finally {
  for (const id of entryIds) {
    await api.send({ type: "maintenance_supporter/object/delete", entry_id: id }).catch(() => {});
  }
  await fetch(`${REST}/api/states/${SENSOR}`, {
    method: "DELETE", headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
  api.close();
}
