/** Seed or judge one migration scenario on a throwaway instance.
 *
 *   node e2e/scenario-probe.mjs seed  <port>
 *   node e2e/scenario-probe.mjs probe <port> "<label>"
 *
 * `seed` onboards, sets the integration up and links an object to a device
 * owned by HA's `demo` integration. `probe` reports what became of that link:
 * where the entities live, whether we co-own somebody else's device, and
 * whether a nameless duplicate appeared. Used by migration-scenarios.sh to
 * compare update orders.
 */
const MODE = process.argv[2];
const PORT = process.argv[3];
const LABEL = process.argv[4] || "";
const REST = `http://127.0.0.1:${PORT}`;
const CID = REST + "/";
const D = "maintenance_supporter";
const USER = "demo", PASS = "demo-pass-1";
const log = (...a) => console.log(...a);

const j = async (r) => {
  const t = await r.text();
  try { return JSON.parse(t); } catch { throw new Error(`${r.status} ${r.url.replace(REST, "")} -> ${t.slice(0, 90)}`); }
};

async function token() {
  const status = await fetch(REST + "/api/onboarding").then(j).catch(() => null);
  const haveUser = status === null || (Array.isArray(status) && status.some((x) => x.step === "user" && x.done));
  if (!haveUser) {
    const u = await fetch(REST + "/api/onboarding/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: CID, name: "Demo", username: USER, password: PASS, language: "en" }),
    }).then(j);
    const t = await fetch(REST + "/auth/token", {
      method: "POST",
      body: new URLSearchParams({ grant_type: "authorization_code", code: u.auth_code, client_id: CID }),
    }).then(j);
    const auth = { Authorization: "Bearer " + t.access_token, "Content-Type": "application/json" };
    for (const step of ["core_config", "analytics"]) {
      await fetch(`${REST}/api/onboarding/${step}`, { method: "POST", headers: auth, body: "{}" }).catch(() => {});
    }
    await fetch(`${REST}/api/onboarding/integration`, {
      method: "POST", headers: auth, body: JSON.stringify({ client_id: CID, redirect_uri: CID }),
    }).catch(() => {});
    return t.access_token;
  }
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: USER, password: PASS }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("token exchange failed: " + JSON.stringify(t).slice(0, 120));
  return t.access_token;
}

// A minimal WS client — ws-client.mjs reads a token from docker/.env, and
// these throwaway instances have their own credentials.
async function ws(tok) {
  const sock = new WebSocket(REST.replace("http", "ws") + "/api/websocket");
  let id = 1;
  const pending = new Map();
  await new Promise((res, rej) => {
    sock.onerror = rej;
    sock.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "auth_required") sock.send(JSON.stringify({ type: "auth", access_token: tok }));
      else if (m.type === "auth_ok") res();
      else if (m.type === "auth_invalid") rej(new Error("auth invalid"));
      else if (m.type === "result") {
        const p = pending.get(m.id);
        if (p) { pending.delete(m.id); m.success ? p.res(m.result) : p.rej(new Error(JSON.stringify(m.error))); }
      }
    };
  });
  return {
    send: (msg) => new Promise((res, rej) => { const i = id++; pending.set(i, { res, rej }); sock.send(JSON.stringify({ ...msg, id: i })); }),
    close: () => sock.close(),
  };
}

const tok = await token();
const api = await ws(tok);
try {
  if (MODE === "seed") {
    const auth = { Authorization: "Bearer " + tok, "Content-Type": "application/json" };
    const entries = await fetch(REST + "/api/config/config_entries/entry", { headers: auth }).then(j).catch(() => []);
    if (!entries.some((e) => e.domain === D)) {
      const start = await fetch(REST + "/api/config/config_entries/flow", {
        method: "POST", headers: auth, body: JSON.stringify({ handler: D, show_advanced_options: false }),
      }).then(j);
      let res = start;
      if (start.type === "form") {
        res = await fetch(REST + "/api/config/config_entries/flow/" + start.flow_id, {
          method: "POST", headers: auth,
          body: JSON.stringify({ default_warning_days: 7, notifications_enabled: false, notify_service: "" }),
        }).then(j);
      }
      if (res.type !== "create_entry") throw new Error("flow failed: " + JSON.stringify(res).slice(0, 150));
      await new Promise((r) => setTimeout(r, 6000));
    }
    const cfgEntries = await api.send({ type: "config_entries/get" });
    const demo = cfgEntries.find((e) => e.domain === "demo");
    const devs = await api.send({ type: "config/device_registry/list" });
    const foreign = devs.find((d) => (d.identifiers || []).length && (d.config_entries || []).includes(demo.entry_id));
    const objs = (await api.send({ type: `${D}/objects` })).objects;
    if (!objs.some((o) => o.object.name === "Scenario Object")) {
      const res = await api.send({ type: `${D}/object/create`, name: "Scenario Object", ha_device_id: foreign.id });
      await api.send({
        type: `${D}/task/create`, entry_id: res.entry_id, name: "Service",
        task_type: "service", schedule_type: "time_based", interval_days: 30,
      });
      await new Promise((r) => setTimeout(r, 5000));
    }
    const after = (await api.send({ type: "config/device_registry/list" })).find((d) => d.id === foreign.id);
    log(`SEEDED  appliance="${after.name}" id=${foreign.id} entriesOnIt=${after.config_entries.length}`);
    process.exit(0);
  }

  // ── probe ───────────────────────────────────────────────────────────────
  const cfg = await api.send({ type: "get_config" });
  const objs = (await api.send({ type: `${D}/objects` })).objects;
  const obj = objs.find((o) => o.object.name === "Scenario Object");
  if (!obj) throw new Error("the scenario object is missing");

  const devs = await api.send({ type: "config/device_registry/list" });
  const ents = (await api.send({ type: "config/entity_registry/list" })).filter(
    (e) => e.config_entry_id === obj.entry_id,
  );
  const linkTarget = devs.find((d) => d.id === obj.object.ha_device_id);
  const onLink = linkTarget ? ents.filter((e) => e.device_id === linkTarget.id).length : 0;
  const coOwned = devs.filter((d) => (d.config_entries || []).includes(obj.entry_id));
  const nameless = coOwned.filter((d) => !d.name);
  const homeless = ents.filter((e) => !e.device_id).length;

  const verdict =
    onLink === ents.length && ents.length > 0 && coOwned.length === 0
      ? "OK"
      : homeless
        ? "BROKEN (entities have no device)"
        : coOwned.length
          ? `DEGRADED (${coOwned.length} device(s) of our own${nameless.length ? `, ${nameless.length} nameless` : ""})`
          : "DEGRADED";

  log(
    `${LABEL.padEnd(46)} HA ${String(cfg.version).padEnd(11)} ` +
      `entities=${ents.length} onAppliance=${onLink} homeless=${homeless} ourDevices=${coOwned.length} -> ${verdict}`,
  );
} finally {
  api.close();
}
