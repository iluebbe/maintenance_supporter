/** Smoke-test the WS write paths used by the new section cards.
 *
 *   1. Enable vacation via vacation/update         → expect enabled=true
 *   2. Set start/end + buffer                       → expect persisted
 *   3. Disable vacation                             → expect enabled=false
 *   4. Set monthly + yearly budget via global/update → expect persisted
 *   5. Create + rename + delete a group             → expect roundtrip
 */
import http from "http";
import WebSocket from "ws";

const HA = "http://localhost:8125";
const WSURL = "ws://localhost:8125/api/websocket";

function post(p, body, ct = "application/json") {
  return new Promise((resolve, reject) => {
    const data = typeof body === "string" ? body : JSON.stringify(body);
    const opts = { hostname: "localhost", port: 8125, path: p, method: "POST",
      headers: { "Content-Type": ct, "Content-Length": Buffer.byteLength(data) } };
    const req = http.request(opts, (r) => { let d = ""; r.on("data", (c) => (d += c)); r.on("end", () => resolve(JSON.parse(d))); });
    req.on("error", reject); req.write(data); req.end();
  });
}

async function getToken() {
  const flow = await post("/auth/login_flow", { client_id: HA + "/", handler: ["homeassistant", null], redirect_uri: HA + "/" });
  const auth = await post(`/auth/login_flow/${flow.flow_id}`, { client_id: HA + "/", username: "dev", password: "dev" });
  const tok = await post("/auth/token", `grant_type=authorization_code&code=${auth.result}&client_id=${HA}/`, "application/x-www-form-urlencoded");
  return tok.access_token;
}

async function main() {
  const token = await getToken();
  const ws = new WebSocket(WSURL);
  let id = 1;
  const pending = new Map();

  ws.on("message", (raw) => {
    const m = JSON.parse(raw);
    if (m.type === "auth_required") {
      ws.send(JSON.stringify({ type: "auth", access_token: token }));
    } else if (m.type === "auth_ok") {
      pending.get("auth")?.resolve();
    } else if (m.type === "result") {
      const p = pending.get(m.id);
      if (p) {
        if (m.success === false) p.reject(new Error(JSON.stringify(m.error)));
        else p.resolve(m.result);
        pending.delete(m.id);
      }
    }
  });

  await new Promise((resolve) => { ws.once("open", resolve); });
  await new Promise((resolve) => pending.set("auth", { resolve }));

  function call(payload) {
    return new Promise((resolve, reject) => {
      const i = id++;
      pending.set(i, { resolve, reject });
      ws.send(JSON.stringify({ id: i, ...payload }));
    });
  }

  let ok = 0, total = 0;
  function check(label, cond, value) {
    total++;
    if (cond) ok++;
    console.log(`  ${cond ? "✓" : "✗"} ${label}${value !== undefined ? " — " + value : ""}`);
  }

  console.log("\n=== Vacation enable + dates ===");
  await call({ type: "maintenance_supporter/vacation/update", enabled: true, start: "2026-06-01", end: "2026-06-15", buffer_days: 3 });
  let s = await call({ type: "maintenance_supporter/vacation/state" });
  check("enabled=true", s.enabled === true);
  check("start=2026-06-01", s.start === "2026-06-01", s.start);
  check("end=2026-06-15", s.end === "2026-06-15", s.end);
  check("buffer_days=3", s.buffer_days === 3, s.buffer_days);

  console.log("\n=== Vacation disable ===");
  await call({ type: "maintenance_supporter/vacation/update", enabled: false });
  s = await call({ type: "maintenance_supporter/vacation/state" });
  check("enabled=false after disable", s.enabled === false);
  check("dates preserved", s.start === "2026-06-01" && s.end === "2026-06-15");

  console.log("\n=== Budget update via global/update ===");
  await call({ type: "maintenance_supporter/global/update", settings: { budget_monthly: 200, budget_yearly: 2000 } });
  let bs = await call({ type: "maintenance_supporter/budget_status" });
  check("monthly=200", bs.monthly_budget === 200, bs.monthly_budget);
  check("yearly=2000", bs.yearly_budget === 2000, bs.yearly_budget);

  // Restore previous values
  await call({ type: "maintenance_supporter/global/update", settings: { budget_monthly: 150, budget_yearly: 1500 } });

  console.log("\n=== Groups: create + rename + delete ===");
  const created = await call({ type: "maintenance_supporter/group/create", name: "TmpTestGroup" });
  check("group created with id", typeof created.group_id === "string");
  const gid = created.group_id;

  let g = await call({ type: "maintenance_supporter/groups" });
  check("new group present", !!g.groups[gid] && g.groups[gid].name === "TmpTestGroup", g.groups[gid]?.name);

  await call({ type: "maintenance_supporter/group/update", group_id: gid, name: "RenamedGroup" });
  g = await call({ type: "maintenance_supporter/groups" });
  check("renamed", g.groups[gid]?.name === "RenamedGroup", g.groups[gid]?.name);

  await call({ type: "maintenance_supporter/group/delete", group_id: gid });
  g = await call({ type: "maintenance_supporter/groups" });
  check("deleted", !g.groups[gid]);

  console.log(`\n=== SUMMARY ===\n  ${ok}/${total} checks passed`);
  ws.close();
  process.exit(ok === total ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
