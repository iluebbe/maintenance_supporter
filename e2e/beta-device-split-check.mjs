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
import { wsClient, watchdog, onboardOrLogin, ensureIntegration } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8132";
const CID = REST + "/";
const D = "maintenance_supporter";
const USER = "demo", PASS = "demo-pass-1";
const log = (...a) => console.log(...a);
watchdog(240e3, "beta device split check");

const token = await onboardOrLogin(REST, { user: USER, pass: PASS, cid: CID });
log("authenticated, token length " + String(token && token.length));
await ensureIntegration(REST, token, { settleMs: 6000 });
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
