/** Demo data for the newer features (2.22 scheduling + 2.23 spare parts).
 *
 * Companion to scripts/setup_demo.py: that seeds the classic objects via the
 * REST config flow; the features here need the WebSocket API (parts CRUD,
 * nested schedule extras, task/postpone), so this is the project's usual
 * Node-WS pattern. Wired into scripts/init-dev.sh after setup_demo.py and
 * safe to run any time — idempotent by object name.
 *
 * Creates:
 *   "Demo Coffee Machine" — spare-parts loop: a stocked descaler consumed by
 *     the descale task, a water-filter cartridge already AT the threshold so
 *     an open "Buy …" reminder exists out of the box, and a catalog-only
 *     door seal (identifiers/link, no stock tracking).
 *   "Demo Mower Scheduling" — seasonal window (Apr–Oct), a finite 3-of-N series,
 *     and a task postponed by two weeks (badge + card indicator).
 *
 * Usage: node scripts/seed_new_features.mjs   (HA_TOKEN env or docker/.env;
 *        HA_URL env overrides the default http://127.0.0.1:8125)
 */
import { loadToken, wsClient, watchdog } from "../e2e/ws-client.mjs";

const REST = process.env.HA_URL || "http://127.0.0.1:8125";

const TOKEN = loadToken();
const auth = { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
watchdog(120e3, "seed");

const api = await wsClient(REST, TOKEN);
const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const daysAhead = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

async function existingNames() {
  const objs = await api.send({ type: "maintenance_supporter/objects" });
  return new Map(objs.objects.map((o) => [o.object.name, o.entry_id]));
}

async function createObject(name, extra = {}) {
  const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
    method: "POST", headers: auth, body: JSON.stringify({ name, ...extra }),
  }).then((r) => r.json());
  return (svc.service_response ?? svc).entry_id;
}

const names = await existingNames();

// ── Demo Coffee Machine — spare parts (2.23) ────────────────────────────────
if (names.has("Demo Coffee Machine")) {
  log("Demo Coffee Machine already exists — skipping");
} else {
  const entryId = await createObject("Demo Coffee Machine", { manufacturer: "Jura", model: "E8" });

  const descaler = await api.send({
    type: "maintenance_supporter/part/create", entry_id: entryId,
    name: "Descaling tablets", vendor: "Jura", mpn: "62535",
    gtin: "7610917625352", storage_location: "Utility cabinet, box 2",
    unit: "pcs", cost: 8.9, stock: 3, reorder_threshold: 1,
    restock_quantity: 6, auto_buy_task: true,
  });
  // Already AT the threshold → the auto "Buy …" reminder appears right away.
  const filter = await api.send({
    type: "maintenance_supporter/part/create", entry_id: entryId,
    name: "Water filter cartridge", vendor: "Jura", mpn: "71794",
    storage_location: "Utility cabinet, box 2",
    unit: "pcs", cost: 15.5, stock: 1, reorder_threshold: 1,
    restock_quantity: 3, auto_buy_task: true,
  });
  // Catalog-only part: identifiers + shopping link, no stock tracking.
  await api.send({
    type: "maintenance_supporter/part/create", entry_id: entryId,
    name: "Brew group seal", vendor: "Jura", mpn: "63308",
    product_url: "https://www.jura.com/en/customer-care",
  });

  await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Descale machine", task_type: "cleaning",
    interval_days: 60, last_performed: daysAgo(50), warning_days: 7,
    consumes_parts: [{ part_id: descaler.part_id, quantity: 1 }],
  });
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Replace water filter", task_type: "replacement",
    interval_days: 90, last_performed: daysAgo(80), warning_days: 7,
    consumes_parts: [{ part_id: filter.part_id, quantity: 1 }],
  });
  log("Demo Coffee Machine created (3 parts — one low with an open Buy reminder, 2 consuming tasks)");
}

// ── Demo Mower Scheduling — 2.22 scheduling (season / finite / postpone) ──────────
if (names.has("Demo Mower Scheduling")) {
  log("Demo Mower Scheduling already exists — skipping");
} else {
  const entryId = await createObject("Demo Mower Scheduling", { manufacturer: "Husqvarna", model: "Automower 315X" });

  // Seasonal window: only due April–October; rolls to spring off-season.
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Blade cleaning", task_type: "cleaning",
    interval_days: 14, last_performed: daysAgo(10), warning_days: 3,
    schedule: { kind: "interval", every: 14, unit: "days", season_months: [4, 5, 6, 7, 8, 9, 10] },
  });
  // Finite series: monthly break-in check, ends after 3 completions.
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Break-in inspection", task_type: "inspection",
    warning_days: 7, last_performed: daysAgo(20),
    schedule: { kind: "interval", every: 1, unit: "months", ends: { count: 3 } },
  });
  // Postponed occurrence: pushed two weeks out (badge + card indicator).
  const deck = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Clean mower deck", task_type: "cleaning",
    interval_days: 30, last_performed: daysAgo(28), warning_days: 5,
  });
  await api.send({
    type: "maintenance_supporter/task/postpone", entry_id: entryId,
    task_id: deck.task_id, until: daysAhead(14),
  });
  log("Demo Mower Scheduling created (seasonal window, finite series, postponed task)");
}

log("SEED OK");
process.exit(0);
