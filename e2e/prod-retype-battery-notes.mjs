// TEMPLATE: retype a set of Battery Notes subentries via the reconfigure
// flow, optionally record a fresh replacement, then re-run fleet part
// hygiene. Origin story (2026-08-03, identifiers scrubbed): a motion-sensor
// model's library entry said CR123A but the actual hardware revision takes
// 2x AAA — the notes needed retyping, one sensor had just had its battery
// swapped (recorder showed weeks at ~16 %, then the jump to 100 %), and the
// orphaned old type-part had to go so the fleet could mint the right one.
//
// Everything identifying comes from the environment:
//   BN_TITLE_REGEX   regex matching the subentry titles to retype (required)
//   BN_EXPECT        exact number of matches expected — abort otherwise (required)
//   NEW_TYPE         target battery type, e.g. AAA (required)
//   NEW_QTY          target battery quantity (required)
//   REPLACED_ENTITY  optional entity_id whose device gets set_battery_replaced
//   OLD_PART         optional fleet part_id to delete once its type is gone
//
// Usage:  HA_URL=... HA_PROD_TOKEN=... BN_TITLE_REGEX='^My Sensor ' BN_EXPECT=6 \
//         NEW_TYPE=AAA NEW_QTY=2 node e2e/prod-retype-battery-notes.mjs
import { wsClient } from "./ws-client.mjs";

const REST = process.env.HA_URL;
const TOKEN = process.env.HA_PROD_TOKEN;
const TITLE = new RegExp(process.env.BN_TITLE_REGEX || "$^");
const EXPECT = parseInt(process.env.BN_EXPECT || "0", 10);
const NEW_TYPE = process.env.NEW_TYPE;
const NEW_QTY = parseInt(process.env.NEW_QTY || "0", 10);
if (!process.env.BN_TITLE_REGEX || !EXPECT || !NEW_TYPE || !NEW_QTY) {
  console.log("set BN_TITLE_REGEX, BN_EXPECT, NEW_TYPE, NEW_QTY");
  process.exit(1);
}
const auth = { Authorization: "Bearer " + TOKEN, "Content-Type": "application/json" };
const j = (r) => r.json();

const api = await wsClient(REST, TOKEN);
const entries = await api.send({ type: "config_entries/get" });
const parent = entries.find((e) => e.domain === "battery_notes" && e.title === "Battery Notes");
if (!parent) throw new Error("Battery Notes parent entry not found");
const subs = await api.send({ type: "config_entries/subentries/list", entry_id: parent.entry_id });
const targets = subs.filter((s) => TITLE.test(s.title || ""));
console.log("matched subentries:", targets.length, targets.map((t) => t.title).join(" | "));
if (targets.length !== EXPECT) {
  console.log(`ABORT: expected exactly ${EXPECT} matching subentries`);
  api.close();
  process.exit(1);
}

// ── 1. retype via the subentry reconfigure flow (single-step form) ─────────
const fieldDefaults = (schema) => {
  // voluptuous-serialized schema → {name: default}; sections nest a schema.
  const out = {};
  for (const f of schema || []) {
    if (f.type === "expandable" && Array.isArray(f.schema)) out[f.name] = fieldDefaults(f.schema);
    else if ("default" in f) out[f.name] = f.default;
  }
  return out;
};

for (const t of targets) {
  const flow = await fetch(`${REST}/api/config/config_entries/subentries/flow`, {
    method: "POST", headers: auth,
    body: JSON.stringify({ handler: [parent.entry_id, "battery_note"], subentry_id: t.subentry_id }),
  }).then(j);
  if (flow.step_id !== "reconfigure") {
    console.log("ABORT on", t.title, "- unexpected step:", flow.step_id, JSON.stringify(flow).slice(0, 200));
    api.close();
    process.exit(1);
  }
  const d = fieldDefaults(flow.data_schema);
  const adv = d.advanced_settings || {};
  const input = {
    ...(d.name !== undefined ? { name: d.name } : {}),
    battery_type: NEW_TYPE,
    battery_quantity: NEW_QTY,
    note: d.note ?? "",
    battery_low_threshold: d.battery_low_threshold ?? 0,
    advanced_settings: {
      ...(adv.battery_percentage_template ? { battery_percentage_template: adv.battery_percentage_template } : {}),
      ...(adv.battery_low_template ? { battery_low_template: adv.battery_low_template } : {}),
      filter_outliers: adv.filter_outliers ?? false,
    },
  };
  const done = await fetch(`${REST}/api/config/config_entries/subentries/flow/${flow.flow_id}`, {
    method: "POST", headers: auth, body: JSON.stringify(input),
  }).then(j);
  const ok = done.type === "abort" && /reconfigure_successful|success/i.test(done.reason || "");
  console.log((ok ? "RETYPED" : "RESULT"), t.title, "->", done.type, done.reason || "", ok ? "" : JSON.stringify(done).slice(0, 200));
}

// ── 2. optionally record a just-swapped battery ────────────────────────────
if (process.env.REPLACED_ENTITY) {
  const entReg = await api.send({ type: "config/entity_registry/list" });
  const ent = entReg.find((e) => e.entity_id === process.env.REPLACED_ENTITY);
  if (ent?.device_id) {
    await api.send({
      type: "call_service", domain: "battery_notes", service: "set_battery_replaced",
      service_data: { device_id: ent.device_id },
    });
    console.log("REPLACED recorded for", process.env.REPLACED_ENTITY);
  } else {
    console.log("WARN:", process.env.REPLACED_ENTITY, "not in the entity registry - replacement NOT recorded");
  }
}

// ── 3. fleet part hygiene ──────────────────────────────────────────────────
const OLD_PART = process.env.OLD_PART; // e.g. batt_cr123a
if (OLD_PART) {
  await new Promise((r) => setTimeout(r, 4000)); // let BN reload its subentries
  const oldType = OLD_PART.replace(/^batt_/, "").toUpperCase();
  const ov = await api.send({ type: "maintenance_supporter/battery_fleet/overview" });
  console.log("fleet types now:", ov.types.join(", "), "| needs_now:", JSON.stringify(ov.needs_now), "| needs_soon:", JSON.stringify(ov.needs_soon));
  if (!ov.types.includes(oldType) && ov.entry_id) {
    const del = await api.send({ type: "maintenance_supporter/part/delete", entry_id: ov.entry_id, part_id: OLD_PART }).catch((e) => ({ error: String(e) }));
    console.log("part", OLD_PART, "delete:", JSON.stringify(del).slice(0, 120));
    const setup = await api.send({ type: "maintenance_supporter/battery_fleet/setup" });
    console.log("fleet reconcile:", JSON.stringify(setup));
  } else if (ov.types.includes(oldType)) {
    console.log(oldType, "still present in the fleet - part kept (check which battery still carries it)");
  }
}

// final verification
const after = await api.send({ type: "maintenance_supporter/battery_fleet/overview" });
const rows = after.all.filter((r) => TITLE.test(r.device_name || ""));
for (const r of rows) console.log("row:", r.device_name, "|", r.quantity + "x " + r.battery_type, "|", r.level + "%", "|", r.status);
api.close();
console.log("DONE");
