/** Live journeys for one stock pool shared by several objects (#111).
 *
 * The unit tests build config entries directly. These drive the real WebSocket
 * API against a running Home Assistant, so they also exercise the schemas, the
 * sanitisers and the config-entry machinery that the unit tests bypass — and,
 * for the deletion journey, the actual entry-removal hook.
 *
 * Journeys, in the order a household would meet them:
 *   A  set the pool up and consume from two appliances
 *   B  the reorder threshold fires once, on the owner
 *   C  restocking from either side is seen by both
 *   D  replacing one appliance keeps it drawing on the pool
 *   E  deleting the pool's owner moves it to a borrower, stock and all
 *   F  a link whose pool has vanished is surfaced, not swallowed
 *   G  export/import keeps a link whose object still exists
 *
 * Run from the repo root:
 *   node e2e/live-shared-parts-check.mjs
 */

import { loadToken, wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const log = (...a) => console.log(...a);
watchdog(10 * 60e3, "shared parts check");

const token = loadToken();
const api = await wsClient(REST, token);

const results = [];
const check = (ok, line) => { results.push({ ok, line }); log(`  ${ok ? "PASS" : "FAIL"} ${line}`); };
const stamp = String(Date.now()).slice(-6);
const created = new Set();

async function makeObject(name) {
  const res = await api.send({ type: "maintenance_supporter/object/create", name: `${name} ${stamp}` });
  created.add(res.entry_id);
  return res.entry_id;
}

async function makePart(entryId, name, stock) {
  const res = await api.send({
    type: "maintenance_supporter/part/create",
    entry_id: entryId,
    name: `${name} ${stamp}`,
    unit: "pcs",
    stock,
    reorder_threshold: 2,
    restock_quantity: 6,
  });
  return res.part_id;
}

async function makeTask(entryId, name, consumes) {
  const res = await api.send({
    type: "maintenance_supporter/task/create",
    entry_id: entryId,
    name: `${name} ${stamp}`,
    task_type: "cleaning",
    schedule_type: "time_based",
    interval_days: 30,
    last_performed: "2020-01-01",
    ...(consumes ? { consumes_parts: consumes } : {}),
  });
  return res.task_id;
}

async function readParts(entryId) {
  const res = await api.send({ type: "maintenance_supporter/objects" });
  const obj = (res.objects || []).find((o) => o.entry_id === entryId);
  return obj?.parts || [];
}

async function stockOf(entryId, partId) {
  const parts = await readParts(entryId);
  const part = parts.find((p) => p.id === partId);
  return part ? part.stock : null;
}

async function complete(entryId, taskId) {
  await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: taskId });
  await new Promise((r) => setTimeout(r, 800));
}

async function tasksOf(entryId) {
  const res = await api.send({ type: "maintenance_supporter/task/list", entry_id: entryId });
  return res.tasks || [];
}

// ── A: set up and consume from two appliances ────────────────────────────
log("\n[A] one pool, two appliances");
const shelf = await makeObject("Shelf");
const bags = await makePart(shelf, "Dust bags", 10);
const vacOne = await makeObject("Vacuum One");
const vacTwo = await makeObject("Vacuum Two");
const link = [{ entry_id: shelf, part_id: bags, quantity: 2 }];
const taskOne = await makeTask(vacOne, "Change bag", link);
const taskTwo = await makeTask(vacTwo, "Change bag", link);

const savedOne = (await tasksOf(vacOne))[0]?.consumes_parts || [];
check(
  savedOne.length === 1 && savedOne[0].entry_id === shelf && savedOne[0].part_id === bags,
  `the cross-object link survived task/create (${JSON.stringify(savedOne[0] || null)})`,
);

check((await stockOf(shelf, bags)) === 10, "pool starts at 10");
await complete(vacOne, taskOne);
check((await stockOf(shelf, bags)) === 8, "appliance one consumed 2 from the shared pool");
await complete(vacTwo, taskTwo);
check(
  (await stockOf(shelf, bags)) === 6,
  "appliance two continued from 8, not from a private copy",
);

// ── B: the threshold fires once, on the owner ────────────────────────────
log("\n[B] one low state, one buy task");
await api.send({
  type: "maintenance_supporter/part/update",
  entry_id: shelf,
  part_id: bags,
  name: `Dust bags ${stamp}`, // part/update is a full write: the name is required
  unit: "pcs",
  auto_buy_task: true,
  reorder_threshold: 8,
  restock_quantity: 6,
});
await new Promise((r) => setTimeout(r, 1500));

const shelfParts = await readParts(shelf);
const pool = shelfParts.find((p) => p.id === bags);
check(pool?.is_low === true, `the pool reads low on its owner (stock ${pool?.stock})`);

const borrowerParts = [...(await readParts(vacOne)), ...(await readParts(vacTwo))];
check(borrowerParts.length === 0, "the borrowers own no parts of their own");

const buyTasks = [];
for (const entryId of [shelf, vacOne, vacTwo]) {
  for (const t of await tasksOf(entryId)) {
    if (String(t.name || "").toLowerCase().startsWith("buy")) buyTasks.push(`${entryId}:${t.name}`);
  }
}
check(
  buyTasks.length === 1,
  `exactly one buy reminder for one purchase (found ${buyTasks.length}: ${buyTasks.join(", ")})`,
);

// ── C: restock is seen by both ───────────────────────────────────────────
log("\n[C] restocking");
await api.send({ type: "maintenance_supporter/part/restock", entry_id: shelf, part_id: bags, delta: 10 });
await new Promise((r) => setTimeout(r, 800));
check((await stockOf(shelf, bags)) === 16, "restock landed on the pool");
// A SECOND task, not a re-completion: completing the same task again lands
// inside the double-complete guard window and is deliberately dropped, which
// would look like the pool failing to decrement.
const taskTwoB = await makeTask(vacTwo, "Change brush", link);
await complete(vacTwo, taskTwoB);
check((await stockOf(shelf, bags)) === 14, "the borrower consumes the restocked pool");

// ── D: replacing a borrower keeps the link ───────────────────────────────
log("\n[D] replacing an appliance");
const replaced = await api.send({
  type: "maintenance_supporter/object/replace",
  entry_id: vacTwo,
  name: `Vacuum Two Mk2 ${stamp}`,
});
created.add(replaced.entry_id);
const successorTasks = await tasksOf(replaced.entry_id);
const successorLink = successorTasks.flatMap((t) => t.consumes_parts || [])[0];
check(
  successorLink?.entry_id === shelf && successorLink?.part_id === bags,
  `the successor still draws on the pool (${JSON.stringify(successorLink || null)})`,
);

// ── E: deleting the owner moves the pool ─────────────────────────────────
log("\n[E] deleting the pool's owner");
const before = await stockOf(shelf, bags);
await api.send({ type: "maintenance_supporter/object/delete", entry_id: shelf });
created.delete(shelf);
await new Promise((r) => setTimeout(r, 2000));

const heirParts = await readParts(vacOne);
const inherited = heirParts.find((p) => String(p.name || "").includes("Dust bags"));
check(!!inherited, `the pool was inherited by the oldest borrower (${heirParts.length} part(s) there now)`);
check(
  inherited && inherited.stock === before,
  `the stock came with it (${inherited?.stock} vs ${before} before)`,
);

const heirLink = (await tasksOf(vacOne)).flatMap((t) => t.consumes_parts || [])[0];
check(
  heirLink && !heirLink.entry_id,
  `the heir's own link no longer points elsewhere (${JSON.stringify(heirLink || null)})`,
);
const otherLink = (await tasksOf(replaced.entry_id)).flatMap((t) => t.consumes_parts || [])[0];
check(
  otherLink?.entry_id === vacOne,
  `the other borrower was repointed at the heir (${JSON.stringify(otherLink || null)})`,
);

// consuming still works after the move
const afterMove = await stockOf(vacOne, inherited?.id);
await complete(replaced.entry_id, successorTasks[0].task_id);
check(
  (await stockOf(vacOne, inherited?.id)) === afterMove - 2,
  "the moved pool is still consumed by the other appliance",
);

// ── F: a vanished pool is surfaced ───────────────────────────────────────
log("\n[F] a link whose pool is gone");
const orphanHost = await makeObject("Orphan Host");
const orphanTask = await makeTask(orphanHost, "Uses nothing", null);
// Write a link to an entry that cannot exist, straight past the picker.
await api.send({
  type: "maintenance_supporter/task/update",
  entry_id: orphanHost,
  task_id: orphanTask,
  consumes_parts: [{ entry_id: "01DEADBEEFDEADBEEFDEADBEEF", part_id: "nope", quantity: 1 }],
});
const orphanSaved = (await tasksOf(orphanHost))[0]?.consumes_parts || [];
check(
  orphanSaved.length === 0,
  `a link to a non-existent object is refused at write time (${JSON.stringify(orphanSaved)})`,
);

// ── G: export keeps the shape ────────────────────────────────────────────
log("\n[G] export");
const exported = await api.send({ type: "maintenance_supporter/export" });
// The archive rides as a JSON *string* under `data` — matching against the
// envelope finds nothing, because every quote in it is escaped.
const archive = typeof exported.data === "string" ? JSON.parse(exported.data) : exported.data;
const ourObjects = (archive.objects || []).filter((o) =>
  String(o.object?.name || o.name || "").includes(stamp),
);
check(ourObjects.length > 0, `the archive contains this run's objects (${ourObjects.length})`);

const ourLinks = ourObjects
  .flatMap((o) => Object.values(o.tasks || {}))
  .flatMap((t) => t.consumes_parts || []);
check(ourLinks.length > 0, `the archive carries our part links (${ourLinks.length})`);
check(
  ourLinks.some((l) => l.entry_id),
  `and a shared link keeps its owning object (${JSON.stringify(ourLinks[0] || null)})`,
);

// ── cleanup ──────────────────────────────────────────────────────────────
log("\n[cleanup]");
for (const entryId of created) {
  await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
}
log(`      removed ${created.size} objects`);
// A run that died mid-way leaves objects behind. Sweep anything this script
// could have created so the next run starts from a clean house.
const remaining = await api.send({ type: "maintenance_supporter/objects" });
let swept = 0;
for (const obj of remaining.objects || []) {
  const name = String(obj.object?.name || "");
  if (/^(Shelf|Vacuum One|Vacuum Two|Vacuum Two Mk2|Orphan Host) [0-9]{6}$/.test(name)) {
    await api.send({ type: "maintenance_supporter/object/delete", entry_id: obj.entry_id }).catch(() => {});
    swept += 1;
  }
}
if (swept) log(`      swept ${swept} leftover object(s) from an earlier run`);

await api.close();

const failed = results.filter((r) => !r.ok);
log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  for (const f of failed) log(`  FAILED: ${f.line}`);
  process.exit(1);
}
