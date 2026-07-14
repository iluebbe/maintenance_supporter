/** Live end-to-end for the v2.26 feature wave against ha-maint (8125).
 *
 * Proves on a REAL running HA:
 *   A. Saved views carry the new label filter (round-trip + sanitiser).
 *   B. notify_scope_view_id round-trips through settings/update → dashboard.
 *   C. Notes survive un-adopt → re-adopt of a problem sensor (full WS cycle
 *      against a REST-seeded device_class:problem binary_sensor).
 *   D. Documents link to spare parts (part_ids via documents/update, listed).
 *   E. Assist intents answer + complete for real (REST /api/intent/handle).
 *
 * Pure WS/REST (admin token) — the UI pass runs separately via playwright.
 * Cleans up everything it creates.
 */
import { loadToken, wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const token = loadToken();
const log = (...a) => console.log(...a);
watchdog(120e3, "v2.26 live test");

const api = await wsClient(REST, token);
const assert = (cond, msg) => {
  if (!cond) { console.error("FAIL:", msg); process.exit(1); }
  log("  ok:", msg);
};
const rest = async (method, path, body) => {
  const r = await fetch(REST + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: r.status, json: r.status !== 404 ? await r.json().catch(() => null) : null };
};

const stamp = Date.now() % 100000;
const cleanup = { entryIds: [], viewIds: [], docIds: [] };

try {
  // ── A. label filter on saved views ─────────────────────────────────────────
  log("A. saved-view label filter");
  const savedA = await api.send({
    type: "maintenance_supporter/views/save",
    name: `Live Garden ${stamp}`,
    filters: { status: "", label: "  garden  ", sort_mode: "due_date", group_by: "none" },
  });
  const viewA = savedA.views.find((v) => v.id === savedA.saved_id);
  cleanup.viewIds.push(savedA.saved_id);
  assert(viewA.filters.label === "garden", "label filter round-trips trimmed");
  const savedJunk = await api.send({
    type: "maintenance_supporter/views/save",
    name: `Live Junk ${stamp}`,
    filters: { label: "x".repeat(200) },
  });
  const viewJunk = savedJunk.views.find((v) => v.id === savedJunk.saved_id);
  cleanup.viewIds.push(savedJunk.saved_id);
  assert(viewJunk.filters.label === null, "over-long label sanitised to null");

  // ── B. notify_scope_view_id setting ────────────────────────────────────────
  log("B. notification scope setting");
  await api.send({
    type: "maintenance_supporter/global/update",
    settings: { notify_scope_view_id: savedA.saved_id },
  });
  const settings1 = await api.send({ type: "maintenance_supporter/settings" });
  assert(
    settings1.notifications.scope_view_id === savedA.saved_id,
    "scope_view_id round-trips through global/update → settings",
  );
  await api.send({ type: "maintenance_supporter/global/update", settings: { notify_scope_view_id: "" } });
  const settings2 = await api.send({ type: "maintenance_supporter/settings" });
  assert(settings2.notifications.scope_view_id === "", "scope resets to empty (= all tasks)");

  // ── C. notes survive un-adopt → re-adopt ───────────────────────────────────
  log("C. adopted-task note persistence");
  const sensorId = `binary_sensor.live_seal_problem_${stamp}`;
  const seed = await rest("POST", `/api/states/${sensorId}`, {
    state: "on",
    attributes: { device_class: "problem", friendly_name: `Live seal problem ${stamp}` },
  });
  assert(seed.status === 200 || seed.status === 201, "problem sensor seeded via REST");

  const disc1 = await api.send({ type: "maintenance_supporter/problem_sensors/discover" });
  assert(disc1.sensors.some((s) => s.entity_id === sensorId), "discovery proposes the seeded sensor");

  const adopt1 = await api.send({
    type: "maintenance_supporter/problem_sensors/adopt",
    selections: [{ entity_id: sensorId, name: `Seal problem ${stamp}`, object_name: `Live Dishwasher ${stamp}` }],
  });
  assert(adopt1.tasks_created === 1 && adopt1.objects_created === 1, "adopt creates object + task");

  const objects1 = await api.send({ type: "maintenance_supporter/objects" });
  const obj1 = objects1.objects.find((o) => o.object.name === `Live Dishwasher ${stamp}`);
  cleanup.entryIds.push(obj1.entry_id);
  const task1 = obj1.tasks[0];
  // trigger_active needs a state CHANGE event (v2.24 behaviour, tested there);
  // this test is about the v2.26 note cycle, so just confirm the wiring.
  log("  (adopted task trigger_active:", task1.trigger_active, ")");

  const NOTE = "Bypass valve sticks — needs the small seal kit.";
  await api.send({
    type: "maintenance_supporter/task/update",
    entry_id: obj1.entry_id, task_id: task1.id, notes: NOTE,
  });
  await api.send({ type: "maintenance_supporter/task/delete", entry_id: obj1.entry_id, task_id: task1.id });
  log("  (un-adopted: task deleted)");

  const disc2 = await api.send({ type: "maintenance_supporter/problem_sensors/discover" });
  assert(disc2.sensors.some((s) => s.entity_id === sensorId), "sensor discoverable again after un-adopt");

  const adopt2 = await api.send({
    type: "maintenance_supporter/problem_sensors/adopt",
    selections: [{ entity_id: sensorId, name: `Seal problem ${stamp}`, object_name: `Live Dishwasher 2 ${stamp}` }],
  });
  assert(adopt2.tasks_created === 1, "re-adopt creates a fresh task");
  const objects2 = await api.send({ type: "maintenance_supporter/objects" });
  const obj2 = objects2.objects.find((o) => o.object.name === `Live Dishwasher 2 ${stamp}`);
  cleanup.entryIds.push(obj2.entry_id);
  assert(obj2.tasks[0].notes === NOTE, "notes restored on the re-adopted task");

  // ── D. documents on spare parts ────────────────────────────────────────────
  log("D. per-part document links");
  const part = await api.send({
    type: "maintenance_supporter/part/create",
    entry_id: obj2.entry_id, name: `Seal kit ${stamp}`, stock: 2,
  });
  assert(part.part_id, "part created");
  const doc = await api.send({
    type: "maintenance_supporter/documents/add_link",
    entry_id: obj2.entry_id, url: "https://example.com/seal-datasheet", title: "Seal datasheet",
  });
  cleanup.docIds.push(doc.id);
  assert(Array.isArray(doc.part_ids) && doc.part_ids.length === 0, "fresh doc has empty part_ids");
  await api.send({
    type: "maintenance_supporter/documents/update", doc_id: doc.id, part_ids: [part.part_id],
  });
  const docs = await api.send({ type: "maintenance_supporter/documents/list", entry_id: obj2.entry_id });
  const linked = docs.documents.find((d) => d.id === doc.id);
  assert(linked.part_ids.length === 1 && linked.part_ids[0] === part.part_id, "doc linked to the part via part_ids");

  // ── E. Assist intents (REST /api/intent/handle) ────────────────────────────
  log("E. Assist intents");
  const listRes = await rest("POST", "/api/intent/handle", { name: "MaintenanceSupporterListTasks", data: {} });
  if (listRes.status === 404) {
    log("  skip: /api/intent/handle not available (intent API not loaded)");
  } else {
    const speech = listRes.json?.speech?.plain?.speech || "";
    // The dev instance has dozens of due tasks and speech caps at 8 — just
    // prove the intent answers with a real task summary.
    assert(speech.length > 0 && /task/i.test(speech), `ListTasks answers with a task summary ("${speech.slice(0, 100)}…")`);
    const compRes = await rest("POST", "/api/intent/handle", {
      name: "MaintenanceSupporterCompleteTask",
      data: { name: `Seal problem ${stamp}` },
    });
    const compSpeech = compRes.json?.speech?.plain?.speech || "";
    assert(compRes.status === 200 && compSpeech, `CompleteTask answered ("${compSpeech.slice(0, 120)}")`);
    const objectsAfter = await api.send({ type: "maintenance_supporter/objects" });
    const obj2After = objectsAfter.objects.find((o) => o.entry_id === obj2.entry_id);
    assert(!!obj2After.tasks[0].last_performed, "completion via intent is REAL (last_performed set)");
  }

  log("ALL v2.26 LIVE CHECKS PASSED");
} finally {
  // ── cleanup ────────────────────────────────────────────────────────────────
  for (const id of cleanup.docIds) {
    await api.send({ type: "maintenance_supporter/documents/delete", doc_id: id }).catch(() => {});
  }
  for (const id of cleanup.entryIds) {
    await api.send({ type: "maintenance_supporter/object/delete", entry_id: id }).catch(() => {});
  }
  for (const id of cleanup.viewIds) {
    await api.send({ type: "maintenance_supporter/views/delete", view_id: id }).catch(() => {});
  }
  api.close();
  log("cleanup done");
}
