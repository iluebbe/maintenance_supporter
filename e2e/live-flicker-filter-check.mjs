/** Live check (#136): the state-change hold filter, end to end on ha-maint.
 *
 *  Adopts a throwaway problem sensor with for_minutes=1 (REAL TIME — the
 *  hold timer is monotonic, faketime cannot accelerate it), then:
 *    1. flicker: on for ~5 s, back off → the task must NOT trigger,
 *    2. persist: on for ~70 s → the task MUST trigger,
 *    3. recovery: off → auto-complete clears it again.
 *  Cleans up its own object + entity. Takes ~2 minutes wall clock.
 */
import { loadToken, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
watchdog(6 * 60e3, "flicker filter live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const EID = `binary_sensor.flicker_probe_${stamp}`;

async function setState(state) {
  await fetch(`${REST}/api/states/${EID}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ state, attributes: { device_class: "problem", friendly_name: `Flicker Probe ${stamp}` } }),
  });
}

async function taskState(entryId) {
  const o = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  return o && o.tasks ? o.tasks[0] : null;
}

let entryId = null;
try {
  await setState("off");
  const res = await api.send({
    type: "maintenance_supporter/problem_sensors/adopt",
    selections: [{ entity_id: EID, name: `Flicker Probe ${stamp}`, object_name: `Flicker Probe ${stamp}`, for_minutes: 1 }],
  });
  assert(res.tasks_created === 1, "adopted with for_minutes=1");
  entryId = res.created[0].entry_id;
  const t0 = await taskState(entryId);
  assert(t0 && t0.trigger_config.trigger_for_minutes === 1, "created trigger carries trigger_for_minutes=1");

  // 1. Flicker: on for ~5 s, off again — must not trigger (now or later).
  await setState("on");
  await sleep(5000);
  await setState("off");
  await sleep(70000);
  let t = await taskState(entryId);
  assert(t && !t.trigger_active, "a 5 s flicker never triggers the task (checked after the window elapsed)");

  // 2. Persist: on through the 1-minute window — triggers.
  await setState("on");
  await sleep(75000);
  t = await taskState(entryId);
  assert(t && t.trigger_active === true, "a problem persisting through the window triggers the task");

  // 3. Recovery auto-completes (the adopted default).
  await setState("off");
  await sleep(4000);
  t = await taskState(entryId);
  assert(t && !t.trigger_active, "recovery clears the trigger again");
  const autoDone = (t.history || []).some((h) => h.type === "completed" && h.auto === true);
  assert(autoDone, "recovery auto-completed the task");

  log("\nALL FLICKER-FILTER LIVE CHECKS PASSED");
  process.exitCode = 0;
} catch (err) {
  console.error("ERROR:", err && (err.stack || err.message || err));
  process.exitCode = 1;
} finally {
  try { if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }); } catch { /* ignore */ }
  try { await fetch(`${REST}/api/states/${EID}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); } catch { /* ignore */ }
  try { api.close(); } catch { /* ignore */ }
  process.exit(process.exitCode ?? 1);
}
