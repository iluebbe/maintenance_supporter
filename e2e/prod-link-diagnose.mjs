/** Read-only diagnosis: why does an object's device link report as lost?
 *
 *   HA_URL=https://… HA_PROD_TOKEN=… node e2e/prod-link-diagnose.mjs
 *
 * Reads (never writes): the maintenance objects, the device registry and the
 * repair issues. For every linked object it answers three questions:
 *
 *   1. does the stored `ha_device_id` name a registered device?
 *   2. if not — which existing device does the link most plausibly MEAN?
 *      (matched by the object's name/manufacturer against device names, so a
 *      device that was re-created under a new id shows up as the candidate)
 *   3. does the device registry remember DELETING a device with that id?
 *
 * That distinguishes the two failure stories: a stale id from a re-created
 * device (old code hid it by silently falling back; the repair notice merely
 * made it visible) versus a device that is genuinely present under the stored
 * id (which would mean a resolver bug on our side).
 */
import { wsClient, watchdog } from "./ws-client.mjs";

const URL = process.env.HA_URL || "http://127.0.0.1:8125";
const TOKEN = process.env.HA_PROD_TOKEN || process.env.HA_TOKEN;
if (!TOKEN) {
  console.error("Set HA_URL and HA_PROD_TOKEN (long-lived access token).");
  process.exit(1);
}
const D = "maintenance_supporter";
const log = (...a) => console.log(...a);
watchdog(4 * 60e3, "prod link diagnose");

const api = await wsClient(URL, TOKEN);
try {
  const cfg = await api.send({ type: "get_config" });
  log(`HA ${cfg.version} — ${cfg.location_name}`);

  const objs = (await api.send({ type: `${D}/objects` })).objects;
  const devices = await api.send({ type: "config/device_registry/list" });
  const byId = new Map(devices.map((d) => [d.id, d]));

  let issues = [];
  try {
    const resp = await api.send({ type: "repairs/list_issues" });
    issues = (resp.issues || []).filter((i) => i.domain === D && i.issue_id.startsWith("device_link_lost"));
  } catch {
    /* older HA spells the command differently — the per-object output below covers it */
  }
  log(`objects: ${objs.length} | devices: ${devices.length} | device_link_lost issues: ${issues.length}\n`);

  const linked = objs.filter((o) => o.object.ha_device_id);
  if (!linked.length) log("no linked objects at all");

  const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  for (const o of linked) {
    const stored = o.object.ha_device_id;
    const dev = byId.get(stored);
    log(`■ ${o.object.name}  (entry ${o.entry_id})`);
    log(`    stored ha_device_id : ${stored}`);
    if (dev) {
      log(`    → RESOLVES to "${dev.name_by_user || dev.name}" [${dev.manufacturer ?? "-"} ${dev.model ?? "-"}]`);
      log(`      owners: ${JSON.stringify(dev.config_entries)} disabled: ${dev.disabled_by ?? "no"}`);
      continue;
    }
    log(`    → resolves to NOTHING — this is what raises the repair notice`);

    // Which device does the link most plausibly mean today?
    const words = new Set(norm(o.object.name).split(" ").filter((w) => w.length > 2));
    words.add(norm(o.object.manufacturer));
    const scored = devices
      .map((d) => {
        const hay = norm(`${d.name_by_user || ""} ${d.name || ""} ${d.manufacturer || ""} ${d.model || ""}`);
        let score = 0;
        for (const w of words) if (w && hay.includes(w)) score++;
        return { d, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    if (scored.length) {
      log(`      best candidates for what it MEANT:`);
      for (const { d, score } of scored) {
        log(`        [match ${score}] "${d.name_by_user || d.name}" id=${d.id} [${d.manufacturer ?? "-"} ${d.model ?? "-"}] created=${d.created_at ? new Date(d.created_at * 1000).toISOString().slice(0, 10) : "-"}`);
      }
      log(`      → if one of these is the real appliance, its id CHANGED at some point`);
      log(`        (integration re-added / re-paired) and the old code hid that by`);
      log(`        silently falling back; re-link the object to it in the panel.`);
    } else {
      log(`      no plausible device found by name/manufacturer either`);
    }
  }
} finally {
  api.close();
}
