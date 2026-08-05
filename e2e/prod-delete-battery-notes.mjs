// TEMPLATE: delete Battery Notes subentries by title match. Origin story
// (2026-08-03, identifiers scrubbed): auto-discovered notes of type
// "Rechargeable" on self-charging robot vacuums made the fleet advise
// BUYING rechargeables for devices that charge themselves, with a
// last_replaced seeded from the device-creation date — the notes had to go.
//
//   BN_TITLE_REGEX  regex matching the subentry titles to delete (required)
//   BN_EXPECT       exact number of matches expected — abort otherwise (required)
//
// Usage:  HA_URL=... HA_PROD_TOKEN=... BN_TITLE_REGEX='^My Vacuum' BN_EXPECT=2 \
//         node e2e/prod-delete-battery-notes.mjs
import { wsClient } from "./ws-client.mjs";

const TITLE = new RegExp(process.env.BN_TITLE_REGEX || "$^");
const EXPECT = parseInt(process.env.BN_EXPECT || "0", 10);
if (!process.env.BN_TITLE_REGEX || !EXPECT) {
  console.log("set BN_TITLE_REGEX and BN_EXPECT");
  process.exit(1);
}
const api = await wsClient(process.env.HA_URL, process.env.HA_PROD_TOKEN);
const entries = await api.send({ type: "config_entries/get" });
const parent = entries.find((e) => e.domain === "battery_notes" && e.title === "Battery Notes");
if (!parent) throw new Error("Battery Notes parent entry not found");
const subs = await api.send({ type: "config_entries/subentries/list", entry_id: parent.entry_id });
const targets = subs.filter((s) => TITLE.test(s.title || ""));
console.log("targets:", targets.map((t) => `${t.title} (${t.subentry_id})`).join(" | ") || "none");
if (targets.length !== EXPECT) {
  console.log(`ABORT: expected exactly ${EXPECT} targets, found ${targets.length}`);
  api.close();
  process.exit(1);
}
for (const t of targets) {
  await api.send({ type: "config_entries/subentries/delete", entry_id: parent.entry_id, subentry_id: t.subentry_id });
  console.log("deleted:", t.title);
}
const after = await api.send({ type: "config_entries/subentries/list", entry_id: parent.entry_id });
console.log(`subentries now: ${after.length} | still matching: ${after.filter((s) => TITLE.test(s.title || "")).length}`);
api.close();
