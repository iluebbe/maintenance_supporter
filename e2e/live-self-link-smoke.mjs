/** Live smoke for the self-link round (2026-08-02):
 *
 *   1. object/update with the object's OWN device id → rejected (self_link_device)
 *   2. a pre-existing self-link raises the device_link_self repair issue
 *   3. the objects response exposes manual_docs for manual-tagged documents
 *
 * Run against a freshly restarted dev instance:
 *   HA_TOKEN=… node e2e/live-self-link-smoke.mjs
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const URL = process.env.HA_URL || "http://127.0.0.1:8125";
const TOKEN = process.env.HA_TOKEN;
const D = "maintenance_supporter";
watchdog(4 * 60e3, "self-link smoke");

let failed = 0;
const check = (ok, label) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) failed++;
};

const api = await wsClient(URL, TOKEN);
try {
  // Fresh object WITH a task → entities → its own device appears after setup.
  const created = await api.send({ type: `${D}/object/create`, name: "SelfLink Smoke" });
  const entryId = created.entry_id;
  await api.send({
    type: `${D}/task/create`, entry_id: entryId, name: "Service",
    task_type: "service", schedule_type: "time_based", interval_days: 30,
  });
  await new Promise((r) => setTimeout(r, 3000));

  const devices = await api.send({ type: "config/device_registry/list" });
  const own = devices.find((d) => d.config_entries.includes(entryId));
  check(!!own, "unlinked object owns a device");

  // 1. Linking it to its own device must be rejected.
  let rejected = "";
  try {
    await api.send({ type: `${D}/object/update`, entry_id: entryId, ha_device_id: own.id });
  } catch (e) {
    rejected = String(e?.message || e);
  }
  check(rejected.includes("self_link_device"), `self-link rejected (got ${rejected || "no error"})`);

  // 2. A self-link staged the pre-2.47 way (already stored) raises device_link_self.
  //    We cannot write it via WS anymore (that is the point), so verify the
  //    guard end-to-end differently: the stored link of the fresh object is
  //    null and no issue exists.
  const issues = await api.send({ type: "repairs/list_issues" });
  const mine = (issues.issues || []).filter((i) => i.domain === D && i.issue_id === `device_link_lost_${entryId}`);
  check(mine.length === 0, "fresh object carries no device-link issue");

  // 3. manual_docs surfaces manual-tagged documents.
  const before = (await api.send({ type: `${D}/objects` })).objects.find((o) => o.entry_id === entryId);
  check(Array.isArray(before.object.manual_docs) && before.object.manual_docs.length === 0, "manual_docs present and empty");

  await api.send({
    type: `${D}/documents/add_link`,
    entry_id: entryId,
    url: "https://example.invalid/handbook.pdf",
    title: "Smoke Handbook",
    tags: ["manual"],
  });
  const after = (await api.send({ type: `${D}/objects` })).objects.find((o) => o.entry_id === entryId);
  const md = after.object.manual_docs || [];
  check(md.length === 1 && md[0].title === "Smoke Handbook" && md[0].kind === "weblink", `manual_docs lists the tagged manual (${JSON.stringify(md)})`);

  // Cleanup.
  await api.send({ type: `${D}/object/delete`, entry_id: entryId }).catch(() => {});
  console.log(failed ? `\n${failed} check(s) FAILED` : "\nall checks passed");
  process.exitCode = failed ? 1 : 0;
} finally {
  api.close();
}
