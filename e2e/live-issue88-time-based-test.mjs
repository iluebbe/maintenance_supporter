/** Live e2e (#88): a new time-based task must KEEP its interval. Mimics the
 *  panel's exact create payload — flat interval_days/unit/anchor alongside a
 *  bare nested {kind:"interval"} (the season/ends carrier). Regression from the
 *  v2.22 season/ends work: the WS create path treated the bare schedule as
 *  authoritative and dropped the flat interval → every:null / next_due:null. */
import { loadToken, wsClient, watchdog } from "./ws-client.mjs";
const REST = "http://127.0.0.1:8125";
const token = loadToken();
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
watchdog(60e3, "issue88 time-based test");

const api = await wsClient(REST, token);
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: "Issue88 " + (Date.now() % 100000) }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;

// EXACT panel payload for a new time-based task (interval 14, unit days, anchor planned):
const r = await api.send({
  type: "maintenance_supporter/task/create",
  entry_id: entryId, name: "Take out recycling bin", task_type: "cleaning",
  interval_days: 14, interval_unit: "days", interval_anchor: "planned",
  warning_days: 1, last_performed: "2026-07-05",
  schedule: { kind: "interval" },
});
const taskId = r.task_id;

const objs = await api.send({ type: "maintenance_supporter/objects" });
const obj = objs.objects.find((o) => o.entry_id === entryId);
const t = obj.tasks.find((x) => x.id === taskId);
console.log("stored schedule :", JSON.stringify(t.schedule));
console.log("interval_days   :", t.interval_days);
console.log("interval_unit   :", t.interval_unit);
console.log("interval_anchor :", t.interval_anchor);
console.log("warning_days    :", t.warning_days);
console.log("next_due        :", t.next_due);

// cleanup
await fetch(REST + "/api/config/config_entries/entry/" + entryId, { method: "DELETE", headers: auth }).catch(() => {});

const ok = t.interval_days === 14 && t.next_due;
console.log(ok ? "PASS — interval persisted" : "FAIL — interval LOST (#88 reproduced)");
process.exit(ok ? 0 : 1);
