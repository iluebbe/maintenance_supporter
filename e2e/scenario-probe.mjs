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
import { wsClient, onboardOrLogin, ensureIntegration } from "./ws-client.mjs";
const MODE = process.argv[2];
const PORT = process.argv[3];
const LABEL = process.argv[4] || "";
const REST = `http://127.0.0.1:${PORT}`;
const CID = REST + "/";
const D = "maintenance_supporter";
const USER = "demo", PASS = "demo-pass-1";
const log = (...a) => console.log(...a);

const tok = await onboardOrLogin(REST, { user: USER, pass: PASS, cid: CID });
const api = await wsClient(REST, tok);
try {
  if (MODE === "seed") {
    await ensureIntegration(REST, tok, { settleMs: 6000 });
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
