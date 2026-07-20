/** Live end-to-end check of the Battery Fleet against ha-maint.
 *
 *  Prereq: seed the fixture first — `node e2e/seed-battery-fleet.mjs` (installs a
 *  30-battery Battery Notes fleet). This then walks: overview → setup (idempotent)
 *  → mark a subset replaced → stock consumed + buttons pressed. Idempotent:
 *  safe to re-run (setup reconciles, never a second fleet).
 */
import { loadToken, wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const D = "maintenance_supporter";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(120e3, "battery fleet check");

const api = await wsClient(REST, loadToken());
try {
  // 1) overview reports the seeded fleet + grouped needs.
  let ov = await api.send({ type: `${D}/battery_fleet/overview` });
  assert(ov.available === true, "Battery Notes detected (fixture seeded?)");
  assert(ov.total >= 10, `fleet has batteries (total=${ov.total})`);
  assert(ov.low.length > 0, `some batteries are low (${ov.low.length})`);
  const needSum = Object.values(ov.needs_now).reduce((a, b) => a + b, 0);
  assert(needSum >= ov.low.length, "needs_now sums the low quantities by type");
  log("  needs_now:", JSON.stringify(ov.needs_now));

  // 2) setup: one object + one part per type + one task (idempotent).
  const setup = await api.send({ type: `${D}/battery_fleet/setup` });
  assert(!!setup.entry_id, "setup returns the fleet entry");
  assert(setup.types.length === ov.types.length, "a part per battery type");

  const objs = await api.send({ type: `${D}/objects` });
  const fleet = objs.objects.find((o) => o.entry_id === setup.entry_id);
  assert(!!fleet, "fleet object exists");
  assert(fleet.tasks.length === 1, "exactly ONE task (not one per battery)");
  const task = fleet.tasks[0];
  assert(task.battery_fleet_task === true, "the task is flagged battery_fleet_task");
  assert(["triggered", "overdue"].includes(task.status) || task.trigger_active,
    `the single task is due while batteries are low (status=${task.status})`);
  assert(fleet.parts.length === ov.types.length, `${fleet.parts.length} type-parts on the fleet object`);

  // 3) stock a type + mark one battery of that type replaced → stock drops.
  const target = ov.low[0];
  const pid = `batt_${target.battery_type.toLowerCase()}`;
  await api.send({ type: `${D}/part/restock`, entry_id: setup.entry_id, part_id: pid, absolute: 20 });
  const mark = await api.send({ type: `${D}/battery_fleet/mark_replaced`, entity_ids: [target.entity_id] });
  assert(mark.marked === 1, "mark_replaced marked the one battery");
  assert(mark.consumed[pid] === target.quantity, `consumed ${target.quantity}× ${target.battery_type} from stock`);

  const objs2 = await api.send({ type: `${D}/objects` });
  const fleet2 = objs2.objects.find((o) => o.entry_id === setup.entry_id);
  const part = fleet2.parts.find((p) => p.id === pid);
  assert(part.stock === 20 - target.quantity, `stock decremented to ${part.stock}`);

  log("\nBATTERY FLEET LIVE CHECK PASSED");
} finally {
  api.close();
}
