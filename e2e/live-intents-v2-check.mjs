/** Live check for the second intents wave on ha-maint via the REAL intent
 *  API (POST /api/intent/handle — the entry point both Assist agents use):
 *  grounded TaskInstructions (full data + the disclose-and-ask empty case),
 *  TaskDue, SnoozeTask, PartStock. Seeds + cleans up its own object. */
import { loadToken, wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const token = loadToken();
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(120e3, "intents v2 check");

const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
let entryId = null;

const intentCall = async (name, data) => {
  const r = await fetch(REST + "/api/intent/handle", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ name, data }),
  });
  const j = await r.json().catch(() => null);
  return { status: r.status, speech: j?.speech?.plain?.speech || "" };
};

try {
  // Seed: object + guided task (notes/checklist/part/doc+page) + bare task.
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: `Voice Pump ${stamp}` });
  entryId = obj.entry_id;
  const part = await api.send({
    type: "maintenance_supporter/part/create", entry_id: entryId,
    name: `Seal kit ${stamp}`, storage_location: "Shelf B", stock: 3, reorder_threshold: 1,
  });
  const guided = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: `Pump service ${stamp}`, interval_days: 180,
    notes: "Bleed the housing before restarting.",
    checklist: ["Power off", "Swap seal", "Bleed housing"],
    consumes_parts: [{ part_id: part.part_id, quantity: 2 }],
  });
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: `Mystery chore ${stamp}`, interval_days: 30,
  });
  const doc = await api.send({
    type: "maintenance_supporter/documents/add_link", entry_id: entryId,
    url: "https://example.com/pump-manual", title: `Pump manual ${stamp}`,
  });
  await api.send({
    type: "maintenance_supporter/documents/update", doc_id: doc.id,
    task_ids: [guided.task_id], task_pages: { [guided.task_id]: 12 },
  });
  log("seeded");

  // 1. Grounded instructions — everything comes from stored data.
  const g = await intentCall("MaintenanceSupporterTaskInstructions", { name: `Pump service ${stamp}` });
  assert(g.status === 200, `instructions answered (${g.status})`);
  for (const bit of ["Bleed the housing", "3 checklist steps", `Pump manual ${stamp}`, "page 12",
    `2 × Seal kit ${stamp}`, "Shelf B", "3 in stock"]) {
    assert(g.speech.includes(bit), `speech carries stored "${bit}"`);
  }

  // 2. Nothing stored — disclose and ASK, never invent.
  const bare = await intentCall("MaintenanceSupporterTaskInstructions", { name: `Mystery chore ${stamp}` });
  assert(bare.speech.includes("no stored instructions") && bare.speech.includes("would you like that?"),
    `empty case discloses + asks ("${bare.speech.slice(0, 90)}…")`);

  // 3. Due query.
  const due = await intentCall("MaintenanceSupporterTaskDue", { name: `Pump service ${stamp}` });
  assert(/due in \d+ days/.test(due.speech) && /next due date is 20\d\d-/i.test(due.speech),
    `due query speaks days + date ("${due.speech}")`);

  // 4. Part stock (1 ≤ threshold? stock 3 > threshold 1 → no low warning).
  const stock = await intentCall("MaintenanceSupporterPartStock", { name: `Seal kit ${stamp}` });
  assert(stock.speech.includes(`3 × Seal kit ${stamp}`) && stock.speech.includes("Shelf B"),
    `stock query ("${stock.speech}")`);

  // 5. Snooze — real notification manager path.
  const sn = await intentCall("MaintenanceSupporterSnoozeTask", { name: `Pump service ${stamp}` });
  assert(sn.status === 200 && sn.speech.includes("Snoozed") && sn.speech.includes("hours"),
    `snooze answered ("${sn.speech}")`);

  log("ALL INTENT V2 LIVE CHECKS PASSED");
} finally {
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  api.close();
  log("cleanup done");
}
