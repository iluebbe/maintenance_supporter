/** Does the battery roster actually reach the user's screen?
 *
 * The WS layer is covered by live-battery-fleet-check.mjs. This is the part
 * that decides whether the fix exists for a person: the roster is rendered
 * inside the fleet task's overview tab, behind a disclosure, and the exclude
 * button has to be there for a device that is NOT low — which is the entire
 * point of discussion #113.
 *
 * Prereq: ha-maint seeded (node e2e/seed-battery-fleet.mjs) + playwright-server.
 * Usage: node e2e/live-battery-roster-ui-check.mjs
 */
import { chromium } from "@playwright/test";
import { loadToken, wsClient, watchdog, hassTokensInit } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const HA = "http://ha-maint:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const D = "maintenance_supporter";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (c, m) => { if (!c) fail(m); log("  ok:", m); };
watchdog(180e3, "battery roster ui check");

const token = loadToken();

// Which task should be on screen, and what the backend says is in the roster.
const api = await wsClient(REST, token);
let fleetEntry, fleetTaskId, expectHealthy;
try {
  const setup = await api.send({ type: `${D}/battery_fleet/setup` });
  fleetEntry = setup.entry_id;
  const objs = await api.send({ type: `${D}/objects` });
  const fleet = objs.objects.find((o) => o.entry_id === fleetEntry);
  fleetTaskId = fleet.tasks[0].id;
  const ov = await api.send({ type: `${D}/battery_fleet/overview` });
  expectHealthy = ov.all.filter((r) => r.status === "ok").map((r) => r.device_name);
  log(`  fleet task ${fleetTaskId}, roster ${ov.all.length} rows, ${expectHealthy.length} healthy`);
} finally {
  api.close();
}

const panelOf = () => document
  .querySelector("home-assistant")?.shadowRoot
  ?.querySelector("home-assistant-main")?.shadowRoot
  ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");

const browser = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 }, colorScheme: "dark" });
await ctx.addInitScript(hassTokensInit, { t: token, ha: HA });
const p = await ctx.newPage();
try {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
  await p.waitForTimeout(9000);

  let mounted = false;
  for (let i = 0; i < 30 && !mounted; i++) {
    mounted = await p.evaluate((fn) => !!eval(`(${fn})`)()?.shadowRoot, panelOf.toString()).catch(() => false);
    if (!mounted) await p.waitForTimeout(1000);
  }
  assert(mounted, "panel mounted");

  // Straight to the fleet task's detail — clicking through the object list
  // would be testing navigation, not the roster.
  const opened = await p.evaluate(
    ({ fn, entryId, taskId }) => {
      const panel = eval(`(${fn})`)();
      panel._showTask(entryId, taskId);
      return true;
    },
    { fn: panelOf.toString(), entryId: fleetEntry, taskId: fleetTaskId },
  );
  assert(opened, "opened the fleet task detail");
  await p.waitForTimeout(4000); // the section fetches its own overview

  const probe = await p.evaluate((fn) => {
    const panel = eval(`(${fn})`)();
    const sec = panel.shadowRoot.querySelector("maintenance-battery-fleet-section");
    if (!sec) return { error: "no battery-fleet-section on the task detail" };
    const root = sec.shadowRoot;
    if (!root) return { error: "section has no shadow root" };
    const details = root.querySelector("details.bf-roster");
    if (!details) return { error: "no roster disclosure rendered" };
    const rows = [...details.querySelectorAll(".bf-row")];
    const named = rows.map((r) => ({
      name: r.querySelector(".bf-dev")?.textContent?.trim(),
      status: (r.querySelector(".bf-status")?.className || "").replace("bf-status ", ""),
      statusText: r.querySelector(".bf-status")?.textContent?.trim(),
      canExclude: !!r.querySelector("button.bf-exclude"),
    }));
    return {
      open: details.open,
      summary: details.querySelector("summary")?.textContent?.trim(),
      hint: root.querySelector(".bf-roster-hint")?.textContent?.trim()?.slice(0, 60),
      rows: named,
    };
  }, panelOf.toString());

  if (probe.error) fail(probe.error);

  assert(probe.open === false, "the roster is collapsed by default");
  assert(/\(\d+\)/.test(probe.summary || ""), `the summary states the count: "${probe.summary}"`);
  assert(!!probe.hint, `the hint explains pre-emptive exclusion: "${probe.hint}…"`);
  assert(probe.rows.length > 0, `${probe.rows.length} roster rows on screen`);

  const healthyOnScreen = probe.rows.filter((r) => r.status.includes("bf-ok"));
  assert(
    healthyOnScreen.length === expectHealthy.length,
    `every healthy device is on screen (${healthyOnScreen.length}/${expectHealthy.length})`,
  );
  assert(
    healthyOnScreen.every((r) => r.canExclude),
    "each healthy row offers the exclude button — the whole point of #113",
  );
  assert(
    probe.rows.every((r) => r.statusText && r.statusText.length > 0),
    "every row shows a translated status label",
  );
  log(`  sample: ${healthyOnScreen.slice(0, 3).map((r) => `${r.name} [${r.statusText}]`).join(", ")}`);

  log("\nBATTERY ROSTER UI CHECK PASSED");
} finally {
  await ctx.close().catch(() => {});
  await browser.close().catch(() => {});
}
