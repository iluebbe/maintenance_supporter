/** Live lifecycle of in-cycle checklist ticks (#73):
 *
 *   1. tick two of three steps → echoed on the objects response
 *   2. entry reload → ticks survive
 *   3. unknown item → dropped
 *   4. complete the task → ticks cleared, history carries the snapshot
 *
 *   HA_TOKEN=… node e2e/live-checklist-progress-smoke.mjs
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const URL = process.env.HA_URL || "http://127.0.0.1:8125";
const D = "maintenance_supporter";
watchdog(5 * 60e3, "checklist progress smoke");

let failed = 0;
const check = (ok, label) => { console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); if (!ok) failed++; };
const settle = (ms = 2500) => new Promise((r) => setTimeout(r, ms));

const api = await wsClient(URL, process.env.HA_TOKEN);
let entryId = null;
try {
  const created = await api.send({ type: `${D}/object/create`, name: "Checklist Smoke" });
  entryId = created.entry_id;
  const task = await api.send({
    type: `${D}/task/create`, entry_id: entryId, name: "Service",
    task_type: "service", schedule_type: "time_based", interval_days: 30,
    checklist: ["Drain", "Clean", "Refill"],
  });
  const taskId = task.task_id;
  await settle();

  const progressOf = async () => {
    const objs = (await api.send({ type: `${D}/objects` })).objects;
    return objs.find((o) => o.entry_id === entryId).tasks.find((x) => x.id === taskId).checklist_progress || {};
  };

  const res = await api.send({
    type: `${D}/task/checklist_progress`, entry_id: entryId, task_id: taskId,
    checklist_state: { Drain: true, Clean: true, Bogus: true },
  });
  check(JSON.stringify(res.checklist_state) === JSON.stringify({ Drain: true, Clean: true }),
    `set + unknown dropped (${JSON.stringify(res.checklist_state)})`);
  await settle(1500);
  let p = await progressOf();
  check(p.Drain === true && p.Clean === true && !("Bogus" in p), "echoed on objects response");

  await api.send({
    type: "call_service", domain: "homeassistant", service: "reload_config_entry",
    service_data: { entry_id: entryId },
  });
  await settle(4000);
  p = await progressOf();
  check(p.Drain === true && p.Clean === true, "ticks survive an entry reload");

  await api.send({ type: `${D}/task/complete`, entry_id: entryId, task_id: taskId, notes: "smoke" });
  await settle(2500);
  p = await progressOf();
  check(Object.keys(p).length === 0, `completing clears the ticks (${JSON.stringify(p)})`);
} finally {
  if (entryId) await api.send({ type: `${D}/object/delete`, entry_id: entryId }).catch(() => {});
  api.close();
  console.log(failed ? `\n${failed} check(s) FAILED` : "\nall checks passed");
  process.exitCode = failed ? 1 : 0;
}
