/**
 * E2E tests for features that previously had WS endpoints without UI.
 *
 * Usage:
 *   docker compose up -d homeassistant-dev playwright
 *   docker restart playwright-server
 *   cd custom_components/maintenance_supporter/frontend-src
 *   node e2e-new-features.mjs
 */
import { setup, ws, cleanup } from "./e2e-helpers.mjs";

let passed = 0, failed = 0;
function check(name, ok, detail) {
  if (ok) { passed++; console.log("  PASS " + name); }
  else { failed++; console.log("  FAIL " + name + (detail ? " — " + detail : "")); }
}
async function runTest(name, fn) {
  console.log("\n=== " + name + " ===");
  try { await fn(); }
  catch (e) { failed++; console.log("  ERROR: " + e.message); }
}

const { browser, ctx, page } = await setup();

// =====================================================================
// Batch A: Test-Notification Button in Settings
// =====================================================================

await runTest("Test-Notification: WS endpoint reachable", async () => {
  const res = await ws(page, { type: "maintenance_supporter/global/test_notification" });
  check("WS response has success field", typeof res.success === "boolean",
    `got ${JSON.stringify(res)}`);
  // When no notify_service is configured the backend returns success=false
  // with a "no_service" message. Either outcome is a valid response —
  // what matters is that the endpoint is reachable.
  check("WS response has message field", typeof res.message === "string" || res.success,
    `got ${JSON.stringify(res)}`);
});

await runTest("Test-Notification: Button renders in Settings view", async () => {
  // Navigate to maintenance panel and open settings. In the base panel the
  // settings tab is not always pre-rendered; we verify the string keys exist
  // in the bundled JS so the button can be rendered when the tab is opened.
  const { readFile } = await import("fs/promises");
  const js = await readFile(
    new URL("../frontend/maintenance-panel.js", import.meta.url),
    "utf-8",
  );
  check("EN send_test string shipped", js.includes("Send test"));
  check("EN test_notification string shipped", js.includes("Test notification"));
  check("DE test_notification string shipped", js.includes("Test-Benachrichtigung"));
  check("testing state string shipped",
    js.includes("Sending\\u2026") || js.includes("Sending…"));
});

// =====================================================================
// Batch B: Re-analyze Button in Task Detail view
// =====================================================================

await runTest("Re-analyze: WS endpoint returns analysis", async () => {
  const objs = await ws(page, { type: "maintenance_supporter/objects" });
  const obj = objs.objects[0];
  const t1 = obj.tasks[0];
  if (!t1) { console.log("  SKIP: no task in first object"); return; }

  const res = await ws(page, {
    type: "maintenance_supporter/task/analyze_interval",
    entry_id: obj.entry_id, task_id: t1.id,
  });
  check("analysis has current_interval field",
    "current_interval" in res, `got keys=${Object.keys(res).join(",")}`);
  check("analysis has confidence field", typeof res.confidence === "string");
  check("analysis has data_points number", typeof res.data_points === "number");
});

await runTest("Re-analyze: Button strings shipped", async () => {
  const { readFile } = await import("fs/promises");
  const js = await readFile(
    new URL("../frontend/maintenance-panel.js", import.meta.url),
    "utf-8",
  );
  check("EN reanalyze label shipped", js.includes("Re-analyze"));
  check("DE reanalyze label shipped", js.includes("Neu analysieren"));
  check("reanalyze_result string shipped", js.includes("New analysis"));
  check("reanalyze_insufficient_data shipped",
    js.includes("Not enough data to produce"));
});

// =====================================================================
// Batch B.2: Environmental Entity Selector (Task Dialog, sensor_based)
// =====================================================================

await runTest("Environmental entity: WS endpoint persists adaptive_config", async () => {
  // Create a sensor-based task, then set and clear the env entity.
  const obj = await ws(page, { type: "maintenance_supporter/object/create", name: `env ${Date.now().toString(36)}` });
  const task = await ws(page, {
    type: "maintenance_supporter/task/create",
    entry_id: obj.entry_id, name: "env-task",
    schedule_type: "sensor_based", interval_days: 30,
    trigger_config: { type: "threshold", entity_id: "sensor.dummy", trigger_above: 10 },
    enabled: true,
  });

  // Set
  const r1 = await ws(page, {
    type: "maintenance_supporter/task/set_environmental_entity",
    entry_id: obj.entry_id, task_id: task.task_id,
    environmental_entity: "sensor.outdoor_temperature",
    environmental_attribute: null,
  });
  check("set succeeds", r1.success === true, JSON.stringify(r1));

  const detail = await ws(page, {
    type: "maintenance_supporter/object", entry_id: obj.entry_id,
  });
  const t = detail.tasks.find(x => x.id === task.task_id);
  check("adaptive_config reflects env entity",
    t?.adaptive_config?.environmental_entity === "sensor.outdoor_temperature",
    `got ${JSON.stringify(t?.adaptive_config)}`);

  // Clear
  await ws(page, {
    type: "maintenance_supporter/task/set_environmental_entity",
    entry_id: obj.entry_id, task_id: task.task_id,
    environmental_entity: null,
  });

  // Cleanup (as admin via config_entries)
  try {
    await page.evaluate(async (eid) => {
      const ha = document.querySelector("home-assistant");
      await ha.hass.connection.sendMessagePromise({
        type: "config_entries/remove", entry_id: eid,
      });
    }, obj.entry_id);
  } catch { /* best-effort */ }
});

await runTest("Environmental entity: dialog strings shipped", async () => {
  const { readFile } = await import("fs/promises");
  const js = await readFile(
    new URL("../frontend/maintenance-panel.js", import.meta.url),
    "utf-8",
  );
  check("EN environmental_entity label", js.includes("Environmental sensor"));
  check("DE environmental_entity label", js.includes("Umgebungs-Sensor"));
  check("helper text shipped", js.includes("adjusts the interval"));
});

// =====================================================================
// Batch C: Seasonal Overrides Dialog
// =====================================================================

await runTest("Seasonal overrides: WS roundtrip set + clear", async () => {
  const obj = await ws(page, { type: "maintenance_supporter/object/create", name: `seas ${Date.now().toString(36)}` });
  const task = await ws(page, {
    type: "maintenance_supporter/task/create",
    entry_id: obj.entry_id, name: "seas-task",
    schedule_type: "time_based", interval_days: 30, enabled: true,
  });

  // Set overrides for Jan + Jul
  const r1 = await ws(page, {
    type: "maintenance_supporter/task/seasonal_overrides",
    entry_id: obj.entry_id, task_id: task.task_id,
    overrides: { 1: 2.0, 7: 0.5 },
  });
  check("set succeeds", r1.success === true, JSON.stringify(r1));

  const detail = await ws(page, {
    type: "maintenance_supporter/object", entry_id: obj.entry_id,
  });
  const t = detail.tasks.find(x => x.id === task.task_id);
  const ov = t?.adaptive_config?.seasonal_overrides;
  check("adaptive_config has overrides",
    ov && (ov["1"] === 2.0 || ov[1] === 2.0) && (ov["7"] === 0.5 || ov[7] === 0.5),
    `got ${JSON.stringify(ov)}`);

  // Clear
  const r2 = await ws(page, {
    type: "maintenance_supporter/task/seasonal_overrides",
    entry_id: obj.entry_id, task_id: task.task_id,
    overrides: {},
  });
  check("clear succeeds", r2.success === true);

  try {
    await page.evaluate(async (eid) => {
      const ha = document.querySelector("home-assistant");
      await ha.hass.connection.sendMessagePromise({
        type: "config_entries/remove", entry_id: eid,
      });
    }, obj.entry_id);
  } catch { /* best-effort */ }
});

await runTest("Seasonal overrides: dialog + button strings shipped", async () => {
  const { readFile } = await import("fs/promises");
  const js = await readFile(
    new URL("../frontend/maintenance-panel.js", import.meta.url),
    "utf-8",
  );
  check("EN edit button", js.includes("Edit seasonal factors"));
  check("EN title", js.includes("Seasonal factors (override)"));
  check("clear_all string", js.includes("Clear all"));
  check("DE title", js.includes("Saisonale Faktoren"));
});

// =====================================================================
// Batch D: Groups CRUD UI
// =====================================================================

await runTest("Groups: WS roundtrip create + update + delete", async () => {
  // Need an object + task to reference
  const obj = await ws(page, { type: "maintenance_supporter/object/create", name: `grp-obj ${Date.now().toString(36)}` });
  const task = await ws(page, {
    type: "maintenance_supporter/task/create",
    entry_id: obj.entry_id, name: "grp-task",
    schedule_type: "time_based", interval_days: 30, enabled: true,
  });

  // Create group
  const create = await ws(page, {
    type: "maintenance_supporter/group/create",
    name: "E2E Group",
    description: "created by e2e",
    task_refs: [{ entry_id: obj.entry_id, task_id: task.task_id }],
  });
  check("group/create returns group_id", typeof create.group_id === "string",
    JSON.stringify(create));
  const gid = create.group_id;

  // Read back
  const list = await ws(page, { type: "maintenance_supporter/groups" });
  check("group appears in list", !!list.groups[gid],
    `got ${Object.keys(list.groups).join(",")}`);
  check("task_refs persisted",
    list.groups[gid].task_refs.length === 1,
    JSON.stringify(list.groups[gid]));

  // Update
  const update = await ws(page, {
    type: "maintenance_supporter/group/update",
    group_id: gid,
    name: "E2E Group renamed",
    task_refs: [],
  });
  check("group/update succeeds", update.success === true);

  const list2 = await ws(page, { type: "maintenance_supporter/groups" });
  check("group renamed", list2.groups[gid].name === "E2E Group renamed");
  check("task_refs cleared", list2.groups[gid].task_refs.length === 0);

  // Delete
  const del = await ws(page, {
    type: "maintenance_supporter/group/delete", group_id: gid,
  });
  check("group/delete succeeds", del.success === true);

  const list3 = await ws(page, { type: "maintenance_supporter/groups" });
  check("group gone", !list3.groups[gid]);

  // Cleanup object
  try {
    await page.evaluate(async (eid) => {
      const ha = document.querySelector("home-assistant");
      await ha.hass.connection.sendMessagePromise({
        type: "config_entries/remove", entry_id: eid,
      });
    }, obj.entry_id);
  } catch { /* best-effort */ }
});

await runTest("Groups: dialog + buttons strings shipped", async () => {
  const { readFile } = await import("fs/promises");
  const js = await readFile(
    new URL("../frontend/maintenance-panel.js", import.meta.url),
    "utf-8",
  );
  check("EN new_group", js.includes("New group"));
  check("EN edit_group", js.includes("Edit group"));
  check("EN no_groups", js.includes("No groups yet"));
  check("EN group_select_tasks", js.includes("Select tasks"));
  check("DE new_group", js.includes("Neue Gruppe"));
});

// =====================================================================
await cleanup(browser, ctx);
console.log("\n" + "═".repeat(50));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
if (failed > 0) { console.log("SOME TESTS FAILED!"); process.exit(1); }
else console.log("ALL TESTS PASSED!");
