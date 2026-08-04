/** Deterministic prod-scale seed for panel performance measurement.
 *
 *  Builds PERF_OBJECTS x PERF_TASKS tasks (default 20 x 8 = 160) with
 *  PERF_HISTORY real completed-history entries each — via ONE `json/import`
 *  call, because history is the prod ingredient that a create/complete loop
 *  cannot produce (the household double-complete window deduplicates rapid
 *  repeat completions; a 40-completion loop yielded 2 stored entries).
 *  Status mix rides on `last_performed`: per object ~2 overdue + 2 due-soon
 *  + 4 ok. priority/labels are patched afterwards (the import whitelist
 *  deliberately excludes them).
 *
 *  Idempotent-ish: skips entirely when Perf objects already exist.
 *  PERF_CLEANUP=1 deletes all Perf objects (restores the instance for docs
 *  screenshots).
 *
 *    node e2e/perf-seed.mjs                       (ha-shots demo)
 *    PERF_HISTORY=40 node e2e/perf-seed.mjs
 *    PERF_CLEANUP=1 node e2e/perf-seed.mjs
 *    HA_URL=… HA_TOKEN=… node e2e/perf-seed.mjs   (any instance)
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const REST = process.env.HA_URL || "http://127.0.0.1:8131";
const D = "maintenance_supporter";
const N_OBJECTS = parseInt(process.env.PERF_OBJECTS || "20", 10);
const N_TASKS = parseInt(process.env.PERF_TASKS || "8", 10);
const N_HISTORY = parseInt(process.env.PERF_HISTORY || "8", 10);
watchdog(15 * 60e3, "perf seed");
const log = (...a) => console.log(...a);

async function token() {
  if (process.env.HA_TOKEN) return process.env.HA_TOKEN;
  const CID = "http://ha-shots:8123/";
  const j = (r) => r.json();
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: "demo", password: "demo-pass-1" }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("login failed");
  return t.access_token;
}

const api = await wsClient(REST, await token());
const existing = (await api.send({ type: `${D}/objects` })).objects.filter((o) => /^Perf \d+$/.test(o.object.name));

if (process.env.PERF_CLEANUP === "1") {
  for (const o of existing) {
    await api.send({ type: `${D}/object/delete`, entry_id: o.entry_id }).catch((e) => log("delete failed:", o.object.name, String(e).slice(0, 60)));
  }
  log(`cleaned up ${existing.length} perf objects`);
  api.close();
  process.exit(0);
}

if (existing.length >= N_OBJECTS) {
  log(`perf seed already present (${existing.length} objects) — nothing to do`);
  api.close();
  process.exit(0);
}

// The import payload version comes from a live export so the seed follows
// the format instead of pinning it.
const probe = await api.send({ type: `${D}/export`, format: "json", include_history: false });
const version = JSON.parse(probe.data).version;

const LABELS = ["safety", "seasonal", "kitchen", "garden", "workshop"];
const TYPES = ["cleaning", "inspection", "replacement", "service", "custom"];
const iso = (d) => d.toISOString().slice(0, 10);
const now = Date.now();

const objects = [];
for (let i = existing.length; i < N_OBJECTS; i++) {
  const name = `Perf ${String(i + 1).padStart(2, "0")}`;
  const tasks = [];
  for (let k = 0; k < N_TASKS; k++) {
    // due in: k=0,1 overdue; k=2,3 soon; rest comfortably ok.
    const dueIn = k <= 1 ? -(5 + 7 * k) : k <= 3 ? 2 + 3 * (k - 2) : 20 + 30 * k;
    const history = [];
    for (let h = N_HISTORY - 1; h >= 0; h--) {
      history.push({
        timestamp: new Date(now - (h + 1) * 11 * 864e5).toISOString(),
        type: "completed",
        ...(h % 3 === 0 ? { notes: `completion ${h} — routine run, everything nominal` } : {}),
        ...(h % 4 === 0 ? { cost: 12.5 } : {}),
        ...(h % 5 === 0 ? { duration: 25 } : {}),
      });
    }
    tasks.push({
      name: `Task ${String(k + 1).padStart(2, "0")} of ${name}`,
      type: TYPES[k % TYPES.length],
      enabled: true,
      schedule_type: "time_based",
      interval_days: 30,
      interval_unit: "days",
      interval_anchor: "completion",
      last_performed: iso(new Date(now + (dueIn - 30) * 864e5)),
      ...(k % 4 === 0 ? { checklist: ["Step one", "Step two", "Step three"] } : {}),
      ...(k % 3 === 0 ? { notes: `Synthetic perf task ${k} — deterministic seed for the benchmark harness.` } : {}),
      history,
    });
  }
  objects.push({ object: { name, manufacturer: "Perf Fixtures", model: `Model ${i}` }, tasks, documents: [], parts: [] });
}

const res = await api.send({ type: `${D}/json/import`, json_content: JSON.stringify({ version, objects }) });
log("import:", JSON.stringify(res).slice(0, 160));

// priority/labels are excluded from import by design — patch them on.
const after = (await api.send({ type: `${D}/objects` })).objects.filter((o) => /^Perf \d+$/.test(o.object.name));
for (const o of after) {
  const sorted = [...o.tasks].sort((a, b) => a.name.localeCompare(b.name));
  for (let k = 0; k < sorted.length; k++) {
    await api.send({
      type: `${D}/task/update`, entry_id: o.entry_id, task_id: sorted[k].id,
      priority: k === 0 ? "high" : k === 1 ? "low" : "normal",
      labels: [LABELS[k % LABELS.length]],
    }).catch(() => {});
  }
}

const final = (await api.send({ type: `${D}/objects` })).objects;
const perf = final.filter((o) => /^Perf \d+$/.test(o.object.name));
const total = final.reduce((n, o) => n + o.tasks.length, 0);
const sample = perf[0]?.tasks?.[0];
log(`DONE: ${perf.length} perf objects, ${total} tasks on the instance, sample history length ${(sample?.history || []).length}`);
api.close();
