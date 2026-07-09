/** Live e2e (#88): a new time-based task must KEEP its interval. Mimics the
 *  panel's exact create payload — flat interval_days/unit/anchor alongside a
 *  bare nested {kind:"interval"} (the season/ends carrier). Regression from the
 *  v2.22 season/ends work: the WS create path treated the bare schedule as
 *  authoritative and dropped the flat interval → every:null / next_due:null. */
import fs from "fs";
const REST = "http://127.0.0.1:8125", WS = "ws://127.0.0.1:8125/api/websocket";
const token = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8").match(/HA_TOKEN=(\S+)/)[1];
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 60e3);

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
