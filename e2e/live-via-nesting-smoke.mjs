/** Live lifecycle of the explicit via_device_id nesting (2027.8 rework):
 *
 *   1. nest      → child's own device points at the parent's
 *   2. un-nest   → the pointer is CLEARED (the old identifier-tuple path
 *                  left it behind)
 *   3. re-nest   → pointer back
 *   4. parent reload (homeassistant.reload_config_entry) → the reverse
 *      direction re-points the child; pointer intact afterwards
 *
 *   HA_TOKEN=… node e2e/live-via-nesting-smoke.mjs
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const URL = process.env.HA_URL || "http://127.0.0.1:8125";
const D = "maintenance_supporter";
watchdog(5 * 60e3, "via nesting smoke");

let failed = 0;
const check = (ok, label) => { console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); if (!ok) failed++; };
const settle = (ms = 2500) => new Promise((r) => setTimeout(r, ms));

const api = await wsClient(URL, process.env.HA_TOKEN);
const created = [];
try {
  async function newObject(name, extra = {}) {
    const res = await api.send({ type: `${D}/object/create`, name, ...extra });
    created.push(res.entry_id);
    await api.send({
      type: `${D}/task/create`, entry_id: res.entry_id, name: "Service",
      task_type: "service", schedule_type: "time_based", interval_days: 30,
    });
    return res.entry_id;
  }
  const devices = async () => api.send({ type: "config/device_registry/list" });
  const ownDev = (devs, entryId) => devs.find((d) => (d.config_entries || []).includes(entryId));

  const parent = await newObject("Via Parent");
  const child = await newObject("Via Child", { parent_entry_id: parent });
  await settle(4000);

  let devs = await devices();
  let pDev = ownDev(devs, parent), cDev = ownDev(devs, child);
  check(!!pDev && !!cDev, "both objects own a device");
  check(cDev.via_device_id === pDev.id, `1. nested: child via_device_id -> parent (${cDev.via_device_id})`);

  // 2. un-nest
  await api.send({ type: `${D}/object/update`, entry_id: child, parent_entry_id: null });
  await settle(4000);
  devs = await devices();
  cDev = ownDev(devs, child);
  check(cDev.via_device_id === null, `2. un-nested: pointer cleared (${cDev.via_device_id})`);

  // 3. re-nest
  await api.send({ type: `${D}/object/update`, entry_id: child, parent_entry_id: parent });
  await settle(4000);
  devs = await devices();
  pDev = ownDev(devs, parent); cDev = ownDev(devs, child);
  check(cDev.via_device_id === pDev.id, "3. re-nested: pointer back");

  // 4. parent reload → the reverse pass re-points its children.
  await api.send({
    type: "call_service", domain: "homeassistant", service: "reload_config_entry",
    service_data: { entry_id: parent },
  });
  await settle(5000);
  devs = await devices();
  pDev = ownDev(devs, parent); cDev = ownDev(devs, child);
  check(!!pDev && cDev.via_device_id === pDev.id, "4. parent reload: nesting intact (reverse pass)");
} finally {
  for (const id of created.reverse()) {
    await api.send({ type: `${D}/object/delete`, entry_id: id }).catch(() => {});
  }
  api.close();
  console.log(failed ? `\n${failed} check(s) FAILED` : "\nall checks passed");
  process.exitCode = failed ? 1 : 0;
}
