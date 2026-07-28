/** Live check: the per-person notification self-test, against a real HA.
 *
 *   1. `notify/user_targets` answers for every real household member
 *   2. a member WITH a Companion device resolves to their own notify service
 *   3. `global/test_notification {user_id}` sends to that service, not the
 *      household one — proven by watching the actual service call
 *   4. a member WITHOUT a device is reported as `user_no_device` and nothing
 *      is sent at all
 *   5. the settings page renders one row per member with a working button
 *
 * The point of running this live rather than trusting the unit tests: those
 * patch the resolver, so they cannot catch a mismatch between what mobile_app
 * actually registers and what we look up — which is exactly the shape of #75.
 *
 * Run from the repo root (playwright-server must be up):
 *   docker restart playwright-server
 *   node e2e/live-notify-selftest-check.mjs
 */

import { chromium } from "@playwright/test";
import { loadToken, wsClient, watchdog, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123";
const REST = "http://127.0.0.1:8125";
const PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
watchdog(8 * 60e3, "notify self-test check");

const token = loadToken();
const api = await wsClient(REST, token);

const results = [];
const check = (ok, line) => { results.push({ ok, line }); log(`  ${ok ? "PASS" : "FAIL"} ${line}`); };

// ── 1. What does the backend say each member resolves to? ────────────────
log("\n[1] notify/user_targets");
const targetsRes = await api.send({ type: "maintenance_supporter/notify/user_targets" });
const targets = targetsRes?.targets || [];
check(Array.isArray(targets) && targets.length > 0, `resolved ${targets.length} household member(s)`);
for (const t of targets) {
  log(`      ${t.name}: ${t.services.length ? t.services.join(", ") : "(no own device — household fallback)"}`);
}
check(
  targets.every((t) => typeof t.user_id === "string" && typeof t.name === "string" && Array.isArray(t.services)),
  "every row carries user_id, name and a services array",
);

const withDevice = targets.find((t) => t.services.length > 0);
const withoutDevice = targets.find((t) => t.services.length === 0);

// ── 2. Does a per-user test actually reach that service? ─────────────────
// Watched by subscribing to call_service events: the real proof is the
// service HA ends up calling, not what the WS result claims.
log("\n[2] per-user send target");

async function watchServiceCalls(fn) {
  const seen = [];
  const unsub = await api.subscribe({ type: "subscribe_events", event_type: "call_service" }, (ev) => {
    const d = ev?.data;
    if (d && d.domain === "notify") seen.push(`${d.domain}.${d.service}`);
  });
  await fn();
  await new Promise((r) => setTimeout(r, 1500));
  await unsub();
  return seen;
}

if (withDevice) {
  let res;
  const calls = await watchServiceCalls(async () => {
    res = await api.send({
      type: "maintenance_supporter/global/test_notification",
      user_id: withDevice.user_id,
    });
  });
  check(res?.result === "success", `test for ${withDevice.name} reported success (got ${res?.result})`);
  const hit = calls.filter((c) => withDevice.services.includes(c));
  check(hit.length > 0, `HA called ${withDevice.services.join(" / ")} — observed: ${calls.join(", ") || "(none)"}`);
  const householdOnly = calls.length > 0 && hit.length === 0;
  check(!householdOnly, "the send did NOT fall back to the household service");
} else {
  log("  SKIP no household member has a Companion device in this instance");
}

// ── 3. A member without a device must not get a fake green ───────────────
log("\n[3] member without a Companion device");
if (withoutDevice) {
  let res;
  const calls = await watchServiceCalls(async () => {
    res = await api.send({
      type: "maintenance_supporter/global/test_notification",
      user_id: withoutDevice.user_id,
    });
  });
  check(res?.result === "user_no_device", `reported user_no_device (got ${res?.result})`);
  check(res?.success === false, "not reported as success");
  check(calls.length === 0, `nothing was sent — observed: ${calls.join(", ") || "(none)"}`);
  check(typeof res?.message === "string" && res.message.length > 0, "carries a localized explanation");
} else {
  log("  SKIP every member has a device in this instance");
}

// ── 4. The household test must still behave as before ────────────────────
log("\n[4] household test unchanged");
const householdRes = await api.send({ type: "maintenance_supporter/global/test_notification" });
check(
  ["success", "no_service", "invalid_service", "failed"].includes(householdRes?.result),
  `household test returned a household-path result (${householdRes?.result})`,
);

// ── 5. The settings page renders the rows ────────────────────────────────
log("\n[5] settings page");
const browser = await chromium.connect(PW_WS);
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
await hassTokensInit(page, HA, token);

let rows = null;
await page.goto(`${HA}/maintenance-supporter`, { waitUntil: "domcontentloaded" });
for (let i = 0; i < 30 && !rows; i++) {
  await page.waitForTimeout(1000);
  rows = await page.evaluate(() => {
    const deep = (pred) => {
      const st = [document.documentElement]; const o = []; let n = 0;
      while (st.length && n < 80000) {
        const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el);
        if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k);
      }
      return o;
    };
    // Open the Settings tab if we are not already there.
    const panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
    if (panel && panel.shadowRoot) {
      const tab = [...panel.shadowRoot.querySelectorAll("button, .tab")]
        .find((b) => /settings|einstellung/i.test(b.textContent || ""));
      if (tab) tab.click();
    }
    const view = deep((el) => el.tagName === "MAINTENANCE-SETTINGS-VIEW")[0];
    if (!view || !view.shadowRoot) return null;
    const found = [...view.shadowRoot.querySelectorAll(".notify-person-row")];
    if (!found.length) return null;
    return found.map((r) => ({
      name: r.querySelector(".notify-person-name")?.textContent.trim() || "",
      target: r.querySelector(".notify-person-target")?.textContent.trim() || "",
      muted: !!r.querySelector(".notify-person-target.muted"),
      disabled: !!r.querySelector("button")?.disabled,
    }));
  }).catch(() => null);
}

if (rows) {
  check(rows.length === targets.length, `one row per member (${rows.length} of ${targets.length})`);
  for (const r of rows) log(`      ${r.name} → ${r.target}${r.disabled ? " [button disabled]" : ""}`);
  const noDeviceRows = rows.filter((r) => r.muted);
  check(
    noDeviceRows.every((r) => r.disabled),
    "members without a device have their send button disabled",
  );
  check(
    rows.filter((r) => !r.muted).every((r) => !r.disabled),
    "members with a device have an enabled button",
  );
  check(rows.every((r) => r.target.length > 0), "no row shows an empty target cell");
} else {
  check(false, "settings page never rendered the per-person rows");
}

await ctx.close();
await browser.close();
await api.close();

const failed = results.filter((r) => !r.ok);
log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  for (const f of failed) log(`  FAILED: ${f.line}`);
  process.exit(1);
}
