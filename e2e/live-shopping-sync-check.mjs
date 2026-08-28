/** Live check on ha-maint for the shopping-list sync (v2.67).
 *
 *   1. Create a throwaway Local To-do list via its real config flow.
 *   2. Point the global shopping_list_entity option at it.
 *   3. Throwaway object + part (threshold 2, restock 5, auto_buy_task);
 *      stock → 1 ⇒ the reconcile mints a buy task ⇒ a row appears in the
 *      to-do list (only ours; a seeded foreign row stays untouched).
 *   4. Check the row off ⇒ the buy task completes (history notes name the
 *      shopping list), stock jumps to 6, the row disappears.
 *   5. Cleanup: object + option + Local To-do entry removed.
 */
import { loadToken, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(5 * 60e3, "shopping sync live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
let entryId = null;
let todoEntryId = null;
let listEntity = null;

const svc = async (domain, service, data, response = false) => {
  const r = await fetch(`${REST}/api/services/${domain}/${service}${response ? "?return_response" : ""}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!r.ok) fail(`${domain}.${service} → ${r.status} ${await r.text()}`);
  return response ? (await r.json()).service_response : null;
};
const listItems = async () => {
  const resp = await svc("todo", "get_items", { entity_id: listEntity, status: ["needs_action", "completed"] }, true);
  return resp?.[listEntity]?.items ?? [];
};
const until = async (what, pred, tries = 20) => {
  for (let i = 0; i < tries; i++) {
    const v = await pred();
    if (v) return v;
    await new Promise((r) => setTimeout(r, 1000));
  }
  fail(`timeout waiting for ${what}`);
};

try {
  // 1. Local To-do list via the REAL config flow (REST — flows are not WS)
  const flowInit = await fetch(`${REST}/api/config/config_entries/flow`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ handler: "local_todo", show_advanced_options: false }),
  });
  if (!flowInit.ok) fail(`flow init → ${flowInit.status} ${await flowInit.text()}`);
  const flow = await flowInit.json();
  const flowStep = await fetch(`${REST}/api/config/config_entries/flow/${flow.flow_id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ todo_list_name: `Shopping ${stamp}` }),
  });
  if (!flowStep.ok) fail(`flow step → ${flowStep.status} ${await flowStep.text()}`);
  const done = await flowStep.json();
  assert(done.type === "create_entry", `local_todo flow created an entry (${done.type})`);
  todoEntryId = done.result?.entry_id;
  listEntity = `todo.shopping_${stamp}`;
  await until("todo entity", async () => (await fetch(`${REST}/api/states/${listEntity}`, { headers: { Authorization: `Bearer ${token}` } })).ok);
  log("  ok: local_todo list is live:", listEntity);
  await svc("todo", "add_item", { entity_id: listEntity, item: "Milk" }); // foreign row

  // 2. point the option at it
  await api.send({ type: "maintenance_supporter/global/update", settings: { shopping_list_entity: listEntity } });
  log("  ok: shopping_list_entity option set");

  // 3. low part ⇒ buy task ⇒ row
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: `shopsync${stamp}` });
  entryId = obj.entry_id;
  const part = await api.send({
    type: "maintenance_supporter/part/create", entry_id: entryId,
    name: "Filter cartridge", stock: 5, reorder_threshold: 2, restock_quantity: 5, auto_buy_task: true,
  });
  const partId = part.part_id ?? part.id;
  await api.send({ type: "maintenance_supporter/part/restock", entry_id: entryId, part_id: partId, absolute: 1 });
  const row = await until("buy-task row in the list", async () =>
    (await listItems()).find((i) => (i.summary || "").includes("Filter cartridge")));
  assert(row.status === "needs_action", `row is open (${row.status})`);
  assert((await listItems()).some((i) => i.summary === "Milk"), "foreign row untouched");

  // 4. check it off ⇒ complete + restock + row gone
  await svc("todo", "update_item", { entity_id: listEntity, item: row.uid, status: "completed" });
  await until("row removed after check-off", async () =>
    !(await listItems()).some((i) => (i.summary || "").includes("Filter cartridge")));
  log("  ok: row removed after check-off");
  const objFull = await until("completed buy task in history", async () => {
    const o = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
    const t = (o.tasks || []).find((tk) => (tk.history || []).some((h) => h.type === "completed" && (h.notes || "").includes("shopping list")));
    return t ? o : null;
  });
  assert(objFull, "buy task completed with shopping-list notes");
  const parts = await api.send({ type: "maintenance_supporter/parts/overview" });
  const p = (parts.parts || []).find((x) => (x.id ?? x.part_id) === partId || x.name === "Filter cartridge");
  assert(p && Number(p.stock) === 6, `stock restocked to 6 (${p?.stock})`);
  assert((await listItems()).some((i) => i.summary === "Milk"), "foreign row still there at the end");

  log("PASS: shopping sync live check");
} finally {
  try { await api.send({ type: "maintenance_supporter/global/update", settings: { shopping_list_entity: "" } }); } catch { /* best effort */ }
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  if (todoEntryId) {
    await fetch(`${REST}/api/config/config_entries/entry/${todoEntryId}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  api.close();
}
