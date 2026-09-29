// Generic storage diff between two Home Assistant config folders — the
// Docker twin of tests/test_migration_roundtrip.py (same rules: ids become
// names, absent / null / "" / [] / {} and the default priority mean the same,
// the shared tests/fixtures/migration_expectations.json names what stays).
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DOMAIN = "maintenance_supporter";
const GLOBAL_UNIQUE_ID = "maintenance_supporter_global";
const ENTRY_KEYS = new Set(["entry_id", "parent_entry_id", "predecessor_entry_id", "replaced_by_entry_id"]);
const TASK_LIST_KEYS = new Set(["task_ids", "vacation_exempt_task_ids"]);
const USER_KEYS = new Set(["responsible_user_id", "completed_by", "user_id"]);
const DEVICE_KEYS = new Set(["ha_device_id", "device_id"]);

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const isEmpty = (v) =>
  v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0) || (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);

/** ``cutoff``: history written after the export (a trigger firing on either
 *  running instance) is runtime, not moved data — left out on both sides. */
/** Task id → its name; tasks sharing a name in one object (a finished buy
 *  reminder kept beside the next one) are told apart as "#1", "#2" in the
 *  order they were created — both of which a move keeps. Keyed by the bare
 *  name, one would silently overwrite the other on each side. */
export function taskLabels(tasks) {
  const byName = {};
  for (const [tid, t] of Object.entries(tasks)) (byName[t.name] ||= []).push(tid);
  const labels = {};
  for (const [name, tids] of Object.entries(byName)) {
    if (tids.length === 1) {
      labels[tids[0]] = name;
      continue;
    }
    const key = (tid) => [String(tasks[tid].created_at || ""), Number(tasks[tid].ref_no || 0)];
    tids.sort((a, b) => {
      const [ca, ra] = key(a);
      const [cb, rb] = key(b);
      return ca < cb ? -1 : ca > cb ? 1 : ra - rb;
    });
    tids.forEach((tid, i) => { labels[tid] = `${name} #${i + 1}`; });
  }
  return labels;
}

export function snapshot(configDir, expect, cutoff = null) {
  const storage = join(configDir, ".storage");
  const entries = readJson(join(storage, "core.config_entries")).data.entries.filter((e) => e.domain === DOMAIN);
  const global = entries.find((e) => e.unique_id === GLOBAL_UNIQUE_ID);
  const objects = entries.filter((e) => e.unique_id !== GLOBAL_UNIQUE_ID && e.data.object);
  const users = Object.fromEntries((readJson(join(storage, "auth")).data.users || []).map((u) => [u.id, u.name]));
  // Device ids are minted per instance: compare the integration identifiers.
  const devices = Object.fromEntries(
    (readJson(join(storage, "core.device_registry")).data.devices || []).map((d) => [
      d.id,
      (d.identifiers || []).map(([dom, id]) => `${dom}:${id}`).sort().join("|"),
    ]),
  );
  const entryName = Object.fromEntries(objects.map((e) => [e.entry_id, e.data.object.name]));
  const objectName = Object.fromEntries(objects.map((e) => [e.data.object.id, e.data.object.name]));
  const taskLabel = {};
  const taskName = {};
  const partName = {};
  for (const e of objects) {
    Object.assign(taskLabel, taskLabels(e.data.tasks || {}));
    for (const tid of Object.keys(e.data.tasks || {})) taskName[tid] = `${e.data.object.name}/${taskLabel[tid]}`;
    for (const [pid, p] of Object.entries(e.data.parts || {})) partName[pid] = `${e.data.object.name}/${p.name}`;
  }
  const docsPath = join(storage, `${DOMAIN}.documents`);
  const docStore = existsSync(docsPath) ? readJson(docsPath).data : { documents: {} };
  const docName = Object.fromEntries(
    Object.entries(docStore.documents || {}).map(([id, d]) => [id, `${objectName[d.object_id]}/${d.kind}:${d.title}`]),
  );
  const miss = (map, v) => map[v] ?? `?${v}`;

  const tr = (value, key) => {
    if (Array.isArray(value)) {
      if (TASK_LIST_KEYS.has(key)) return value.map((x) => miss(taskName, x)).sort();
      if (key === "assignee_pool") return value.map((x) => miss(users, x));
      if (key === "photo_doc_ids") return value.map((x) => miss(docName, x));
      if (key === "part_ids") return value.map((x) => miss(partName, x)).sort();
      return value.map((v) => tr(v, key));
    }
    if (value && typeof value === "object") {
      if (key === "task_pages") return Object.fromEntries(Object.entries(value).map(([k, v]) => [miss(taskName, k), v]));
      const out = {};
      for (const [k, v] of Object.entries(value)) {
        if (isEmpty(v) || (k === "priority" && v === "normal")) continue;
        out[k] = tr(v, k);
      }
      return out;
    }
    if (typeof value !== "string") return value;
    if (ENTRY_KEYS.has(key)) return miss(entryName, value);
    if (key === "object_id") return miss(objectName, value);
    if (key === "task_id") return miss(taskName, value);
    if (key === "part_id") return miss(partName, value);
    if (key === "doc_id") return miss(docName, value);
    if (USER_KEYS.has(key)) return miss(users, value);
    if (DEVICE_KEYS.has(key)) return miss(devices, value);
    return value;
  };

  const runtimeOnly = new Set(Object.keys(expect.runtime_only_state));
  const snap = { objects: {}, documents: {}, settings: {} };
  for (const e of objects) {
    const storePath = join(storage, `${DOMAIN}.${e.entry_id}`);
    const store = existsSync(storePath) ? readJson(storePath).data : { tasks: {}, parts: {} };
    const { id: _oid, ...obj } = e.data.object;
    const rest = Object.fromEntries(Object.entries(e.data).filter(([k]) => !["object", "tasks", "parts"].includes(k)));
    const rec = { object: tr(obj), data: tr(rest), options: tr(e.options || {}), tasks: {}, parts: {} };
    for (const [tid, t] of Object.entries(e.data.tasks || {})) {
      const { id: _tid, ...task } = t;
      const state = Object.fromEntries(Object.entries((store.tasks || {})[tid] || {}).filter(([k]) => !runtimeOnly.has(k)));
      if (cutoff && Array.isArray(state.history)) state.history = state.history.filter((h) => !(h.timestamp > cutoff));
      rec.tasks[taskLabel[tid]] = tr({ ...task, _state: state });
    }
    for (const [pid, p] of Object.entries(e.data.parts || {})) {
      const { id: _pid, ...part } = p;
      rec.parts[p.name] = tr({ ...part, _stock: ((store.parts || {})[pid] || {}).stock ?? null });
    }
    snap.objects[e.data.object.name] = rec;
  }
  const blobsDir = join(configDir, DOMAIN, "docs", "blobs");
  const blobs = existsSync(blobsDir) ? new Set(readdirSync(blobsDir)) : new Set();
  for (const [id, d] of Object.entries(docStore.documents || {})) {
    const { id: _did, ...doc } = d;
    const rec = tr(doc);
    if (d.kind === "file") rec._blob_on_disk = blobs.has(d.hash);
    snap.documents[docName[id]] = rec;
  }
  const options = Object.fromEntries(Object.entries(global?.options || {}).filter(([k]) => !(k in expect.non_portable_options)));
  const groups = options.groups || {};
  options.groups = Object.fromEntries(
    Object.entries(groups).map(([gid, g]) => [
      gid,
      { ...g, task_refs: (g.task_refs || []).map((r) => `${miss(entryName, r.entry_id)}|${miss(taskName, r.task_id)}`).sort() },
    ]),
  );
  snap.settings = tr(options);
  return snap;
}

export function diff(a, b, path = "", out = []) {
  const show = (v) => JSON.stringify(v)?.slice(0, 160);
  if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
    for (const k of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) {
      if (!(k in b)) out.push(`LOST    ${path}.${k} = ${show(a[k])}`);
      else if (!(k in a)) out.push(`ADDED   ${path}.${k} = ${show(b[k])}`);
      else diff(a[k], b[k], `${path}.${k}`, out);
    }
  } else if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
    a.forEach((x, i) => diff(x, b[i], `${path}[${i}]`, out));
  } else if (JSON.stringify(a) !== JSON.stringify(b)) {
    out.push(`CHANGED ${path}: ${show(a)} -> ${show(b)}`);
  }
  return out;
}
