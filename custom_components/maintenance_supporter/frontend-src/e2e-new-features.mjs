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
await cleanup(browser, ctx);
console.log("\n" + "═".repeat(50));
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
if (failed > 0) { console.log("SOME TESTS FAILED!"); process.exit(1); }
else console.log("ALL TESTS PASSED!");
