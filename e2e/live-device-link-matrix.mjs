/** Object↔device attachment, exercised end to end against a live instance.
 *
 * The attachment was reworked from "return the appliance's identifiers so the
 * registry merges us onto its device" to "point the entity at the device and
 * describe nothing" (HA's documented helper pattern). That touches how every
 * task entity gets its device, how the area travels between object and device,
 * and what a stored link means after a reload — a deep enough change that unit
 * tests alone are not the place to find out.
 *
 * Runs the same matrix on any instance, so it can be pointed at 2026.7 and at
 * the 2026.8 beta and the results compared:
 *
 *   node e2e/live-device-link-matrix.mjs            # ha-maint  (8125)
 *   node e2e/live-device-link-matrix.mjs 8132 demo  # ha-beta   (8132)
 *
 * The second argument switches to username/password login for the throwaway
 * beta instance, which has no long-lived token.
 *
 * Self-cleaning: every object it creates is deleted at the end, so re-runs are
 * safe and the instance is left as it was found.
 */
import { loadToken, wsClient, watchdog } from "./ws-client.mjs";

const PORT = process.argv[2] || "8125";
const MODE = process.argv[3] || "token";
const REST = `http://127.0.0.1:${PORT}`;
const CID = REST + "/";
const D = "maintenance_supporter";
const log = (...a) => console.log(...a);
watchdog(15 * 60e3, "device link matrix");

let failures = 0;
const ok = (cond, msg) => {
  if (cond) log("  ok:", msg);
  else { failures++; log("  FAIL:", msg); }
};

const j = async (r) => {
  const t = await r.text();
  try { return JSON.parse(t); } catch { throw new Error(`${r.status} ${r.url.replace(REST, "")} -> ${t.slice(0, 100)}`); }
};

async function token() {
  if (MODE === "token") return loadToken();
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
  if (!t.access_token) throw new Error("no token: " + JSON.stringify(t).slice(0, 150));
  return t.access_token;
}

const settle = (ms = 3500) => new Promise((r) => setTimeout(r, ms));

const tok = await token();
const api = await wsClient(REST, tok);
const created = [];
try {
  const version = (await api.send({ type: "get_config" })).version;
  log(`\n=== HA ${version} on :${PORT} ===`);

  // ── a device owned by somebody else ──────────────────────────────────────
  const entries = await api.send({ type: "config_entries/get" });
  const ourEntryIds = new Set(entries.filter((e) => e.domain === D).map((e) => e.entry_id));
  const devices = await api.send({ type: "config/device_registry/list" });
  const foreigners = devices.filter(
    (d) => (d.identifiers || []).length && !(d.config_entries || []).some((c) => ourEntryIds.has(c)),
  );
  if (foreigners.length < 2) throw new Error(`need two foreign devices, found ${foreigners.length}`);
  const [devA, devB] = foreigners;
  log(`foreign devices: "${devA.name}" and "${devB.name}"`);

  const reg = async () => ({
    ents: await api.send({ type: "config/entity_registry/list" }),
    devs: await api.send({ type: "config/device_registry/list" }),
  });
  const oursOn = (ents, entryId) => ents.filter((e) => e.config_entry_id === entryId);
  const deviceOf = (ents, entryId) => {
    const ids = new Set(oursOn(ents, entryId).map((e) => e.device_id));
    return [...ids];
  };
  const ownDevices = (devs, entryId) => devs.filter((d) => (d.config_entries || []).includes(entryId));

  async function newObject(name, extra = {}) {
    const res = await api.send({ type: `${D}/object/create`, name, ...extra });
    created.push(res.entry_id);
    await api.send({
      type: `${D}/task/create`, entry_id: res.entry_id, name: "Service",
      task_type: "service", schedule_type: "time_based", interval_days: 30,
    });
    await settle();
    return res.entry_id;
  }

  // ── 1. linking ───────────────────────────────────────────────────────────
  log("\n1. link an object to an existing device");
  const linked = await newObject("Matrix Linked", { ha_device_id: devA.id });
  let { ents, devs } = await reg();
  ok(oursOn(ents, linked).length > 0, `${oursOn(ents, linked).length} entities created`);
  ok(deviceOf(ents, linked).join() === devA.id, "every entity sits on the appliance's device");
  ok(!(devs.find((d) => d.id === devA.id).config_entries || []).includes(linked),
    "we are NOT listed as an owner of that device");
  ok(ownDevices(devs, linked).length === 0, "no device of our own was created");

  // ── 2. area travels device → object ──────────────────────────────────────
  log("\n2. moving the appliance moves the object");
  const areas = await api.send({ type: "config/area_registry/list" });
  const target = areas.find((a) => a.area_id !== devA.area_id) || areas[0];
  await api.send({ type: "config/device_registry/update", device_id: devA.id, area_id: target.area_id });
  await settle();
  let obj = (await api.send({ type: `${D}/objects` })).objects.find((o) => o.entry_id === linked);
  ok(obj.object.area_id === target.area_id, `object followed to area "${target.name}"`);

  // ── 3. the object must NOT push its metadata back ────────────────────────
  log("\n3. the appliance's own metadata stays untouched");
  const before = devs.find((d) => d.id === devA.id);
  await api.send({ type: `${D}/object/update`, entry_id: linked, name: "Renamed Matrix", manufacturer: "NotTheOwner" });
  await settle();
  const afterDev = (await api.send({ type: "config/device_registry/list" })).find((d) => d.id === devA.id);
  ok(afterDev.name === before.name, `device name still "${afterDev.name}"`);
  ok(afterDev.manufacturer === before.manufacturer, "device manufacturer untouched");

  // ── 4. two objects on the same device ────────────────────────────────────
  log("\n4. a second object on the same device");
  const linked2 = await newObject("Matrix Linked Two", { ha_device_id: devA.id });
  ({ ents, devs } = await reg());
  ok(deviceOf(ents, linked2).join() === devA.id, "second object's entities are on it too");
  const other = areas.find((a) => a.area_id !== target.area_id) || target;
  await api.send({ type: "config/device_registry/update", device_id: devA.id, area_id: other.area_id });
  await settle();
  const objs = (await api.send({ type: `${D}/objects` })).objects;
  const both = [linked, linked2].map((id) => objs.find((o) => o.entry_id === id).object.area_id);
  ok(both.every((a) => a === other.area_id), `both objects followed (${both.join(", ")})`);

  // ── 5. relink to a different device ──────────────────────────────────────
  log("\n5. relink to another device");
  await api.send({ type: `${D}/object/update`, entry_id: linked2, ha_device_id: devB.id });
  await settle(6000);
  ({ ents, devs } = await reg());
  ok(deviceOf(ents, linked2).join() === devB.id, `entities moved to "${devB.name}"`);
  ok(ownDevices(devs, linked2).length === 0, "still no device of our own");

  // ── 6. unlink entirely ───────────────────────────────────────────────────
  log("\n6. unlink");
  await api.send({ type: `${D}/object/update`, entry_id: linked2, ha_device_id: null });
  await settle(6000);
  ({ ents, devs } = await reg());
  const own = ownDevices(devs, linked2);
  ok(own.length === 1, `an own device appeared (${own.length})`);
  ok(own.length === 1 && deviceOf(ents, linked2).join() === own[0].id, "entities moved onto it");
  ok(own.length === 1 && !!own[0].name, `and it has a name: "${own[0]?.name}"`);

  // ── 6b. relink after living unlinked: no empty leftover device ──────────
  log("\n6b. relink the unlinked object — its empty own device must go");
  await api.send({ type: `${D}/object/update`, entry_id: linked2, ha_device_id: devA.id });
  await settle(8000);
  ({ ents, devs } = await reg());
  ok(deviceOf(ents, linked2).join() === devA.id, "entities moved back onto the appliance");
  ok(ownDevices(devs, linked2).length === 0,
    "the own device from its unlinked life was cleaned up");

  // ── 7. nesting under another object (via_device) ─────────────────────────
  log("\n7. nest one object under another");
  const parent = await newObject("Matrix Parent");
  const child = await newObject("Matrix Child", { parent_entry_id: parent });
  ({ devs } = await reg());
  const parentDev = ownDevices(devs, parent)[0];
  const childDev = ownDevices(devs, child)[0];
  ok(!!parentDev && !!childDev, "both have their own device");
  ok(childDev && parentDev && childDev.via_device_id === parentDev.id, "child hangs under the parent");

  // ── 8. entity ids survive a reload ───────────────────────────────────────
  log("\n8. a reload changes nothing");
  const idsBefore = oursOn((await reg()).ents, linked).map((e) => e.entity_id).sort();
  // Reload is REST, not a WS command.
  await fetch(`${REST}/api/config/config_entries/entry/${linked}/reload`, {
    method: "POST", headers: { Authorization: "Bearer " + tok, "Content-Type": "application/json" },
  });
  await settle(8000);
  const after = await reg();
  const idsAfter = oursOn(after.ents, linked).map((e) => e.entity_id).sort();
  ok(idsBefore.join() === idsAfter.join(), `${idsAfter.length} entity ids unchanged`);
  ok(deviceOf(after.ents, linked).join() === devA.id, "still on the appliance's device");
  ok(ownDevices(after.devs, linked).length === 0, "no stray device appeared");

  log(failures ? `\n${failures} CHECK(S) FAILED` : "\nDEVICE LINK MATRIX PASSED");
} finally {
  for (const entryId of created) {
    await api.send({ type: `${D}/object/delete`, entry_id: entryId }).catch(() => {});
  }
  log(`(cleaned up ${created.length} objects)`);
  api.close();
}
process.exit(failures ? 1 : 0);
