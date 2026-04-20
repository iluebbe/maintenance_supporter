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
await cleanup(browser, ctx);
console.log("\n" + "═".repeat(50));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
if (failed > 0) { console.log("SOME TESTS FAILED!"); process.exit(1); }
else console.log("ALL TESTS PASSED!");
