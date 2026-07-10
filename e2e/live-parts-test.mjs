/** Live e2e for the spare-parts loop against ha-maint (pure Node-WS).
 *
 *  create part (stock 1, threshold 1→ low needs 1→0) + consuming task →
 *  complete → stock 0, auto "Buy …" task appears (self-contained notes,
 *  shopping link) → complete the buy task with a qty override → restocked,
 *  reminder detached, stock sensor reflects it.
 */
import fs from "fs";
const REST = "http://127.0.0.1:8125", WS = "ws://127.0.0.1:8125/api/websocket";
const token = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8").match(/HA_TOKEN=(\S+)/)[1];
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 120e3);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsClient() {
  const ws = new WebSocket(WS);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error("ws")); });
  let id = 1; const pend = new Map();
  await new Promise((res, rej) => {
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "auth_required") ws.send(JSON.stringify({ type: "auth", access_token: token }));
      else if (m.type === "auth_ok") res();
      else if (m.type === "auth_invalid") rej(new Error("auth"));
      else if (m.type === "result") { const p = pend.get(m.id); if (p) { pend.delete(m.id); m.success ? p.res(m.result) : p.rej(new Error(JSON.stringify(m.error))); } }
    };
  });
  return { send: (msg) => new Promise((res, rej) => { const i = id++; pend.set(i, { res, rej }); ws.send(JSON.stringify({ ...msg, id: i })); }) };
}

const api = await wsClient();
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: "PartsLoop " + (Date.now() % 100000) }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;
log("object:", entryId);

// Part: stock 1, threshold 1 → creating it already makes it low? 1 <= 1 → yes,
// so use threshold 0: low only at 0, crossed by the consumption below.
const pr = await api.send({
  type: "maintenance_supporter/part/create", entry_id: entryId,
  name: "HEPA-Filter", vendor: "Bosch", mpn: "00754869", gtin: "4006381333931",
  storage_location: "Keller Regal B", unit: "pcs", cost: 24.9,
  stock: 1, reorder_threshold: 0, restock_quantity: 2, auto_buy_task: true,
});
const partId = pr.part_id;
log("part:", partId);

const tr = await api.send({
  type: "maintenance_supporter/task/create", entry_id: entryId,
  name: "Filter wechseln", task_type: "replacement",
  interval_days: 90, last_performed: "2026-01-01",
  consumes_parts: [{ part_id: partId, quantity: 1 }],
});
const taskId = tr.task_id;

async function objState() {
  const objs = await api.send({ type: "maintenance_supporter/objects" });
  return objs.objects.find((o) => o.entry_id === entryId);
}
async function pollBuyTask(expect) {
  for (let i = 0; i < 20; i++) {
    const o = await objState();
    const buy = (o.tasks || []).filter((t2) => t2.part_ref && t2.part_ref.part_id === partId);
    if (buy.length === (expect ? 1 : 0)) return { o, buy };
    await sleep(2000);
  }
  throw new Error("buy task state never reached expect=" + expect);
}

// 1. Complete the consuming task → stock 1→0 → buy task (reconcile + reload are async: poll).
await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: taskId });
const { o: o1, buy: buy1 } = await pollBuyTask(true);
const part1 = o1.parts.find((p) => p.id === partId);
log("after consume — stock:", part1.stock, "is_low:", part1.is_low, "| buy task:", buy1[0].name);
if (part1.stock !== 0) throw new Error("stock not decremented: " + part1.stock);
if (!part1.is_low) throw new Error("part not low");
const buyTask = buy1[0];
if (!(buyTask.notes || "").includes("Keller Regal B")) throw new Error("buy-task notes missing storage location: " + buyTask.notes);
if (!(buyTask.documentation_url || "").includes("4006381333931") && !(buyTask.documentation_url || "").includes("amazon"))
  throw new Error("buy-task shopping link missing: " + buyTask.documentation_url);
if (!(buyTask.labels || []).includes("shopping")) throw new Error("buy-task label missing");

// 2. Stock sensor reads 0 (poll — the entity re-registers across the
//    reconcile's entry reload and is briefly unavailable).
let stockSensor = null;
for (let i = 0; i < 15; i++) {
  const states = await fetch(REST + "/api/states", { headers: auth }).then((r) => r.json());
  stockSensor = states.find((s) => s.entity_id.includes("hepa_filter_stock") && s.state === "0");
  if (stockSensor) break;
  await sleep(2000);
}
log("stock sensor:", stockSensor && stockSensor.entity_id, "=", stockSensor && stockSensor.state);
if (!stockSensor) throw new Error("stock sensor never reached 0");

// 3. Complete the buy task with qty override 3 → stock 3, reminder detached.
await api.send({
  type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: buyTask.id,
  cost: 74.7, restock_quantity: 3,
});
const { o: o2 } = await pollBuyTask(false);
const part2 = o2.parts.find((p) => p.id === partId);
log("after restock — stock:", part2.stock, "is_low:", part2.is_low);
if (part2.stock !== 3) throw new Error("restock override not applied: " + part2.stock);
const survivor = (o2.tasks || []).find((t2) => t2.id === buyTask.id);
if (!survivor) throw new Error("completed reminder was deleted (cost history lost)");
if (survivor.part_ref) throw new Error("part_ref not detached");

// cleanup
await fetch(REST + "/api/config/config_entries/entry/" + entryId, { method: "DELETE", headers: auth }).catch(() => {});
log("cleaned up");
log("PARTS LOOP OK — consume → low → buy task (self-contained) → restock via dialog qty → detached");
process.exit(0);
