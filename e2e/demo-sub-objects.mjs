/** The 2.108 ingredients for the docs pictures and the sub-objects clip, put
 *  on the seeded demo (ha-shots) and taken off again, so the other scripts
 *  keep seeing the flat demo they were written for:
 *
 *  - #225: *Garden* holding the Lawn Mower and the Pool Pump, the mower
 *    holding its *Charging Station* (three levels for the breadcrumb), and a
 *    *Utility Room* holding the Washing Machine, the meters and the
 *    dehumidifier. The pool pump's triggered task marks Garden as overdue.
 *  - #226: *Washer fluid* on the Family Car, counted in litres and bought in
 *    5 l jugs, the issue's own case.
 *
 *  seedSubObjects() reuses what a crashed earlier run left behind, and
 *  unseedSubObjects() takes everything out by name, so a rerun converges.
 *  Both talk WebSocket from node: call them before a page opens. */

const daysAgo = (n) => new Date(Date.now() - n * 86400e3).toISOString().slice(0, 10);

const PARENTS = [
  { name: "Garden", area: /garden/i, children: ["Lawn Mower", "Pool Pump"] },
  { name: "Utility Room", children: ["Washing Machine", "Utility Meters", "Dehumidifier"] },
];
const NESTED = { name: "Charging Station", parent: "Lawn Mower", manufacturer: "Husqvarna" };
const WASHER_FLUID = "Washer fluid";

const objectsOf = async (api) => (await api.send({ type: "maintenance_supporter/objects" })).objects || [];
const byName = (objs, name) => objs.find((o) => o.object.name === name && !o.object.archived);
// The objects list leaves the parts shelf out; the single-object read has it.
const partsOf = async (api, entryId) =>
  ((await api.send({ type: "maintenance_supporter/object", entry_id: entryId }).catch(() => ({}))).parts || []);

export async function seedSubObjects(api, log = () => {}) {
  let objs = await objectsOf(api);
  const areas = await api.send({ type: "config/area_registry/list" }).catch(() => []);
  const want = new Map(); // child entry id -> parent entry id

  for (const p of PARENTS) {
    let parent = byName(objs, p.name);
    if (!parent) {
      const area = p.area ? (areas || []).find((a) => p.area.test(a.name)) : null;
      const made = await api.send({
        type: "maintenance_supporter/object/create", name: p.name,
        ...(area ? { area_id: area.area_id } : {}),
      });
      parent = { entry_id: made.entry_id };
    }
    for (const c of p.children) {
      const child = byName(objs, c);
      if (child) want.set(child.entry_id, parent.entry_id);
      else log("  sub-objects: no object", c);
    }
  }

  const mower = byName(objs, NESTED.parent);
  if (mower && !byName(objs, NESTED.name)) {
    const made = await api.send({
      type: "maintenance_supporter/object/create", name: NESTED.name,
      manufacturer: NESTED.manufacturer, parent_entry_id: mower.entry_id,
    });
    await api.send({
      type: "maintenance_supporter/task/create", entry_id: made.entry_id, name: "Clean the charging contacts",
      task_type: "cleaning", schedule_type: "time_based", interval_days: 90, last_performed: daysAgo(31),
    });
  }

  for (const [child, parent] of want) {
    const cur = objs.find((o) => o.entry_id === child);
    if (cur.object.parent_entry_id !== parent) {
      await api.send({ type: "maintenance_supporter/object/update", entry_id: child, parent_entry_id: parent });
    }
  }

  const car = byName(objs, "Family Car");
  if (car && !(await partsOf(api, car.entry_id)).some((x) => x.name === WASHER_FLUID)) {
    await api.send({
      type: "maintenance_supporter/part/create", entry_id: car.entry_id, name: WASHER_FLUID,
      vendor: "Sonax", storage_location: "Garage shelf", unit: "l", package_size: 5,
      cost: 7.9, stock: 7.5, reorder_threshold: 2, restock_quantity: 2, auto_buy_task: true,
    });
  }

  // A parent change reloads the child's entry: wait until every child reports
  // its parent and the new objects have their tasks again.
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 500));
    objs = await objectsOf(api);
    const placed = [...want].every(([c, p]) => objs.find((o) => o.entry_id === c)?.object.parent_entry_id === p);
    const nested = byName(objs, NESTED.name);
    if (placed && (!mower || (nested && nested.tasks.length))) break;
  }
  await new Promise((r) => setTimeout(r, 1500));
  const ids = Object.fromEntries(
    [...PARENTS.map((p) => p.name), NESTED.name, NESTED.parent, "Pool Pump", "Family Car"]
      .map((n) => [n, byName(objs, n)?.entry_id || null]),
  );
  log("SEED sub-objects", JSON.stringify(ids));
  return ids;
}

export async function unseedSubObjects(api) {
  const objs = await objectsOf(api);
  const made = new Set([...PARENTS.map((p) => p.name), NESTED.name]);
  const madeIds = new Set(objs.filter((o) => made.has(o.object.name)).map((o) => o.entry_id));
  for (const o of objs) {
    if (!madeIds.has(o.entry_id) && madeIds.has(o.object.parent_entry_id)) {
      await api.send({ type: "maintenance_supporter/object/update", entry_id: o.entry_id, parent_entry_id: null }).catch(() => {});
    }
  }
  // Children first: the Charging Station sits inside the mower, not inside one of ours.
  for (const o of objs.filter((x) => madeIds.has(x.entry_id)).sort((a) => (a.object.name === NESTED.name ? -1 : 1))) {
    await api.send({ type: "maintenance_supporter/object/delete", entry_id: o.entry_id }).catch(() => {});
  }
  const car = byName(objs, "Family Car");
  for (const part of (car ? await partsOf(api, car.entry_id) : []).filter((x) => x.name === WASHER_FLUID)) {
    await api.send({ type: "maintenance_supporter/part/delete", entry_id: car.entry_id, part_id: part.id }).catch(() => {});
  }
  // The fluid's own buy reminder, if a Use crossed its threshold.
  for (const t of (car?.tasks || []).filter((x) => x.part_ref && /washer fluid/i.test(x.name))) {
    await api.send({ type: "maintenance_supporter/task/delete", entry_id: car.entry_id, task_id: t.id }).catch(() => {});
  }
}
