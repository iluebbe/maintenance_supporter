/** What does HA 2026.8's device split actually do to object↔device linking?
 *
 * The registry rewrite (storage 1.12 → 3.2) splits a device shared by several
 * config entries into one device per entry. Object↔device linking (2.19)
 * depends on that sharing: an object with `ha_device_id` returns only the
 * appliance's identifiers from `device_info`, so the registry merges our
 * entities onto its device.
 *
 * The unit tests say the shared-id assertion no longer holds. What they cannot
 * say is what a USER ends up seeing — whether the appliance's device page still
 * lists the maintenance entities, or whether they now sit on a device of their
 * own. That is the question this answers, against a real instance.
 *
 * Prereq: the throwaway ha-beta container on 8132 (HA 2026.8.0b0), whose
 * configuration.yaml enables `demo` — that supplies real devices owned by a
 * foreign config entry to link against.
 *
 * Usage: node e2e/beta-device-split-check.mjs
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8132";
const CID = REST + "/";
const D = "maintenance_supporter";
const USER = "demo", PASS = "demo-pass-1";
const log = (...a) => console.log(...a);
watchdog(240e3, "beta device split check");

/** Parse JSON, but say what came back instead of dying inside JSON.parse.
 *  A 401 body ("401: Unauthorized") used to surface as a syntax error four
 *  frames deep, which says nothing about the actual problem. */
async function j(r) {
  const text = await r.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${r.status} ${r.url.replace(REST, "")} -> ${text.slice(0, 120)}`);
  }
}

async function tokenFor() {
  const status = await fetch(REST + "/api/onboarding").then(j).catch(() => null);
  // Only the USER step decides whether we can log in. The later steps are
  // wizard bookkeeping and one of them stays `done: false` unless finished
  // with the right body — treating that as "not onboarded" sent this script
  // down the create-user path on every run, which then handed `undefined`
  // along as the token.
  const haveUser =
    status === null || (Array.isArray(status) && status.some((x) => x.step === "user" && x.done));
  if (!haveUser) {
    const u = await fetch(REST + "/api/onboarding/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: CID, name: "Demo", username: USER, password: PASS, language: "en" }),
    }).then(j);
    if (!u.auth_code) throw new Error("onboarding returned no auth code: " + JSON.stringify(u).slice(0, 200));
    const t = await fetch(REST + "/auth/token", {
      method: "POST",
      body: new URLSearchParams({ grant_type: "authorization_code", code: u.auth_code, client_id: CID }),
    }).then(j);
    const auth = { Authorization: "Bearer " + t.access_token, "Content-Type": "application/json" };
    for (const step of ["core_config", "analytics"]) {
      await fetch(`${REST}/api/onboarding/${step}`, { method: "POST", headers: auth, body: "{}" }).catch(() => {});
    }
    // The integration step wants the client it should mint a code for.
    await fetch(`${REST}/api/onboarding/integration`, {
      method: "POST", headers: auth,
      body: JSON.stringify({ client_id: CID, redirect_uri: CID }),
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
  if (!s.result) throw new Error("login step returned no auth code: " + JSON.stringify(s).slice(0, 200));
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  // Failing here rather than handing `undefined` on means the next call reports
  // a real 401 instead of "Bearer undefined" four frames deeper.
  if (!t.access_token) throw new Error("token exchange returned no token: " + JSON.stringify(t).slice(0, 200));
  return t.access_token;
}

async function ensureIntegration(token) {
  const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const entries = await fetch(REST + "/api/config/config_entries/entry", { headers: auth }).then(j).catch(() => []);
  if (Array.isArray(entries) && entries.some((e) => e.domain === D)) return;
  const start = await fetch(REST + "/api/config/config_entries/flow", {
    method: "POST", headers: auth,
    body: JSON.stringify({ handler: D, show_advanced_options: false }),
  }).then(j);
  let res = start;
  if (start.type === "form") {
    res = await fetch(REST + "/api/config/config_entries/flow/" + start.flow_id, {
      method: "POST", headers: auth,
      body: JSON.stringify({ default_warning_days: 7, notifications_enabled: false, notify_service: "" }),
    }).then(j);
  }
  if (res.type !== "create_entry") throw new Error("integration flow failed: " + JSON.stringify(res).slice(0, 200));
  await new Promise((r) => setTimeout(r, 6000));
}

const token = await tokenFor();
log("authenticated, token length " + String(token && token.length));
await ensureIntegration(token);
log("integration set up");

const api = await wsClient(REST, token);
try {
  // ── a foreign device to link to ──────────────────────────────────────────
  const devices = await api.send({ type: "config/device_registry/list" });
  const entriesList = await api.send({ type: "config_entries/get" });
  const demoEntry = entriesList.find((e) => e.domain === "demo");
  const foreign = devices.find(
    (d) => demoEntry && (d.config_entries || []).includes(demoEntry.entry_id) && (d.identifiers || []).length,
  );
  if (!foreign) throw new Error("no demo device found to link against");
  log(`foreign device: "${foreign.name}" id=${foreign.id} owner=demo`);

  // ── link a maintenance object to it ──────────────────────────────────────
  // Reuse the object from a previous run rather than failing on
  // "already_configured" — this check is meant to be re-run after every
  // change to the attachment code.
  const existing = (await api.send({ type: `${D}/objects` })).objects || [];
  const already = existing.find((o) => (o.object || {}).name === "Linked Appliance");
  let entryId;
  if (already) {
    entryId = already.entry_id;
    log(`reusing linked object: entry ${entryId}`);
  } else {
    const created = await api.send({
      type: `${D}/object/create`, name: "Linked Appliance", ha_device_id: foreign.id,
    });
    entryId = created.entry_id;
    log(`linked object created: entry ${entryId}`);
  }
  await new Promise((r) => setTimeout(r, 4000));

  await api.send({
    type: `${D}/task/create`, entry_id: entryId, name: "Service", task_type: "service",
    schedule_type: "time_based", interval_days: 30,
  }).catch((e) => log("  (task create said: " + (e.message || e) + ")"));
  await new Promise((r) => setTimeout(r, 5000));

  // ── what the registries now say ──────────────────────────────────────────
  const ents = await api.send({ type: "config/entity_registry/list" });
  const ours = ents.filter((e) => e.config_entry_id === entryId);
  const devs2 = await api.send({ type: "config/device_registry/list" });
  const byId = new Map(devs2.map((d) => [d.id, d]));

  log(`\nour entities: ${ours.length}`);
  const onForeign = ours.filter((e) => e.device_id === foreign.id);
  const elsewhere = ours.filter((e) => e.device_id && e.device_id !== foreign.id);
  log(`  on the appliance's device : ${onForeign.length}`);
  log(`  on some other device      : ${elsewhere.length}`);
  log(`  device-less               : ${ours.filter((e) => !e.device_id).length}`);

  for (const e of elsewhere.slice(0, 3)) {
    const d = byId.get(e.device_id);
    log(`    ${e.entity_id} -> device "${d?.name}" (${e.device_id})`);
    if (d) {
      const extra = Object.fromEntries(
        Object.entries(d).filter(([k]) => /composite|split|primary_config_entry/.test(k)),
      );
      log(`      ${JSON.stringify(extra)}`);
      log(`      config_entries: ${JSON.stringify(d.config_entries)}`);
    }
  }

  const foreignNow = byId.get(foreign.id);
  log(`\nthe appliance's device after linking:`);
  log(`  config_entries: ${JSON.stringify(foreignNow?.config_entries)}`);
  log(`  identifiers   : ${JSON.stringify(foreignNow?.identifiers)}`);

  const splits = devs2.filter((d) => d.composite_device_id || d.has_composite_identifiers);
  log(`\ndevices carrying composite/split markers: ${splits.length}`);
  for (const d of splits.slice(0, 5)) {
    log(`  "${d.name}" id=${d.id} composite_device_id=${d.composite_device_id} entries=${JSON.stringify(d.config_entries)}`);
  }

  log("\nVERDICT");
  if (onForeign.length === ours.filter((e) => e.device_id).length && onForeign.length > 0) {
    log("  linking still MERGES onto the appliance's device — the feature is intact on 2026.8.");
  } else if (elsewhere.length > 0) {
    log("  our entities sit on a SEPARATE device — the appliance page no longer shows them.");
  } else {
    log("  inconclusive: our entities have no device at all.");
  }
} finally {
  api.close();
}
