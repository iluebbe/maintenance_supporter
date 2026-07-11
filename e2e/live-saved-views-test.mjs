/** Live end-to-end: saved filter views CRUD against ha-maint.
 *
 * Proves the views/list|save|delete WS contract on a real HA: create a view
 * from a filter combination, update it in place (same id, no duplicate),
 * re-list it, then delete it. Pure WebSocket (admin token) — no browser. */
import { loadToken, wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const token = loadToken();
const log = (...a) => console.log(...a);
watchdog(60e3, "saved-views test");

const api = await wsClient(REST, token);
const assert = (cond, msg) => {
  if (!cond) { console.error("FAIL:", msg); process.exit(1); }
  log("  ok:", msg);
};

const name = "Live View " + (Date.now() % 100000);

// 1. Baseline list.
const before = await api.send({ type: "maintenance_supporter/views/list" });
assert(Array.isArray(before.views), "views/list returns an array");
const startCount = before.views.length;
log("baseline views:", startCount);

// 2. Create a view from a filter combination.
const filters = { status: "overdue", user_id: "current_user", archived: true, sort_mode: "area", group_by: "user" };
const saved = await api.send({ type: "maintenance_supporter/views/save", name, filters });
assert(saved.saved_id, "views/save returns a saved_id");
const vid = saved.saved_id;
const created = saved.views.find((v) => v.id === vid);
assert(created && created.name === name, "created view is in the returned list");
assert(created.filters.status === "overdue" && created.filters.group_by === "user", "filters round-trip");

// 3. Sanitiser: an unknown sort_mode coerces to due_date.
const junk = await api.send({
  type: "maintenance_supporter/views/save",
  name: name + " junk",
  filters: { status: "not-real", sort_mode: "bogus", group_by: "nope" },
});
const junkView = junk.views.find((v) => v.name === name + " junk");
assert(junkView.filters.status === "" && junkView.filters.sort_mode === "due_date", "unknown filter values sanitised");

// 4. Update in place — same id, name changes, no duplicate.
const updated = await api.send({
  type: "maintenance_supporter/views/save",
  view_id: vid,
  name: name + " (edited)",
  filters,
});
const matches = updated.views.filter((v) => v.id === vid);
assert(matches.length === 1, "update keeps a single entry for the id");
assert(matches[0].name === name + " (edited)", "name updated in place");

// 5. Delete both test views; confirm gone and count restored.
await api.send({ type: "maintenance_supporter/views/delete", view_id: vid });
const afterDel = await api.send({ type: "maintenance_supporter/views/delete", view_id: junkView.id });
assert(!afterDel.views.some((v) => v.id === vid || v.id === junkView.id), "both test views deleted");
assert(afterDel.views.length === startCount, "view count restored to baseline");

log("\nSAVED-VIEWS LIVE TEST PASSED");
process.exit(0);
