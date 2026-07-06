/** Live browser verification of the v2.19.x features that were only
 *  backend-tested so far:
 *   - M1 double-tap dedup (v2.19.1): two rapid completes count once
 *   - Logbook adapter (v2.19): completion renders as a readable entry
 *   - Automation-editor trigger blocks (v2.19, HA 2026.7): the integration's
 *     purpose-specific triggers appear in the Add-Trigger picker
 *   - Device page (v2.19): the object's HA device with its entities
 *     (incl. the disabled next-due timestamp sensor)
 *   - Object dialog (v2.19): device-link + parent-object fields
 *  Screenshots land in e2e/live-shots/.
 */
import { chromium } from "@playwright/test";
import fs from "fs";

const HA = "http://ha-maint:8123";
const REST = "http://127.0.0.1:8125";
const PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("./live-shots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
fs.mkdirSync(OUT, { recursive: true });

const envFile = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8");
const token = envFile.match(/HA_TOKEN=(\S+)/)[1];
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
const watchdog = setTimeout(() => { console.error("WATCHDOG abort"); process.exit(3); }, 9 * 60e3);

// Seed: object + task via services.
const suffix = Date.now() % 100000;
const objName = "Test Heizung " + suffix;
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: objName }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;
const tsvc = await fetch(REST + "/api/services/maintenance_supporter/add_task?return_response", {
  method: "POST", headers: auth,
  body: JSON.stringify({ entry_id: entryId, name: "Wartung Brenner", interval_days: 30 }),
}).then((r) => r.json());
const taskId = (tsvc.service_response ?? tsvc).task_id;
log("seeded", objName, entryId, taskId);
const startIso = new Date(Date.now() - 60e3).toISOString();

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
}, { t: token, ha: HA });
const p = await ctx.newPage();

// ── M1: double-tap — two rapid dialog completes must count ONCE ─────────────
await p.goto(HA + "/maintenance-supporter?entry_id=" + entryId, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
const panel = p.locator("maintenance-supporter-panel");

async function completeOnce() {
  await panel.locator(".btn-complete").first().click();
  await p.waitForTimeout(900);
  const cdlg = p.locator("maintenance-complete-dialog");
  await cdlg.getByRole("button", { name: /^(complete|erledig)/i }).last().click();
  await p.waitForTimeout(1200);
}
await completeOnce();
await completeOnce(); // the household double-tap, seconds apart
log("two rapid completes sent");

const rows = await fetch(REST + "/api/services/maintenance_supporter/list_tasks?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ entry_id: entryId }),
}).then((r) => r.json());
// history via the task detail UI instead: open detail → History tab
await panel.getByText("Wartung Brenner").first().click();
await p.waitForTimeout(1500);
await panel.getByRole("button", { name: /history|verlauf/i }).first().click()
  .catch(() => panel.getByText(/history|verlauf/i).first().click());
await p.waitForTimeout(1200);
await p.screenshot({ path: OUT + "20-double-tap-history-one-entry.png" });
log("shot 20 (history after double tap)");

const text1 = await p.evaluate(() => {
  const walk = (root, out) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) walk(el.shadowRoot, out);
      out.push(el.textContent || "");
    }
    return out;
  };
  return walk(document.querySelector("home-assistant").shadowRoot, []).join(" | ");
});
const completedChip = text1.match(/Completed \((\d+)\)/i);
log("history filter chip:", completedChip && completedChip[0]);
if (!completedChip || completedChip[1] !== "1") {
  throw new Error("double-tap dedup failed in UI: " + (completedChip && completedChip[0]));
}

// ── Logbook adapter: the completion is a readable logbook entry ─────────────
const lb = await fetch(REST + "/api/logbook/" + startIso, { headers: auth }).then((r) => r.json());
const entry = lb.find((e) => (e.name || "").includes("Wartung Brenner"));
log("logbook entry:", JSON.stringify(entry || null));
if (!entry || !/was completed|wurde erledigt/.test(entry.message || "")) {
  throw new Error("no readable logbook completion entry");
}

// ── Device page: object device + entities (incl. disabled timestamp sensor) ──
// Find the device id via the entity registry-backed REST template: use the
// sensor's state attributes route instead — simplest: search the devices page.
// Resolve the device id via the template API and open its page directly.
const sensorEid = "sensor.test_heizung_" + suffix + "_wartung_brenner";
const deviceId = await fetch(REST + "/api/template", {
  method: "POST", headers: auth,
  body: JSON.stringify({ template: "{{ device_id('" + sensorEid + "') }}" }),
}).then((r) => r.text());
log("device id", deviceId);
await p.goto(HA + "/config/devices/device/" + deviceId.trim(), { waitUntil: "domcontentloaded" });
await p.waitForTimeout(5000);
await p.screenshot({ path: OUT + "21-device-page-entities.png" });
log("shot 21 (device page with task entities)");
const text2 = await p.evaluate(() => document.body.innerText || "");
// device page renders in the main document tree? use shadow walk instead:
const text2b = await p.evaluate(() => {
  const walk = (root, out) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) walk(el.shadowRoot, out);
      out.push(el.textContent || "");
    }
    return out;
  };
  return walk(document.querySelector("home-assistant").shadowRoot, []).join(" | ");
});
if (!/Wartung Brenner/.test(text2b)) throw new Error("device page missing task entities");
log("device page shows task entities; disabled-entities hint present:", /disabled|deaktiviert/i.test(text2b));

// ── Automation editor: purpose-specific trigger blocks (HA 2026.7) ──────────
await p.goto(HA + "/config/automation/edit/new", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(5000);
// The new editor opens with a "new automation" dialog or directly the editor.
// Click "Add Trigger" (bottom of triggers section).
const addTrigger = p.getByRole("button", { name: /add trigger|auslöser hinzufügen/i }).first();
await addTrigger.click().catch(async () => {
  await p.getByText(/add trigger|auslöser hinzufügen/i).first().click();
});
await p.waitForTimeout(1500);
// Search the picker for our integration.
await p.keyboard.type("maintenance");
await p.waitForTimeout(1500);
await p.screenshot({ path: OUT + "22-automation-trigger-picker.png" });
log("shot 22 (trigger picker filtered to maintenance)");
const text3 = await p.evaluate(() => {
  const walk = (root, out) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) walk(el.shadowRoot, out);
      out.push(el.textContent || "");
    }
    return out;
  };
  return walk(document.querySelector("home-assistant").shadowRoot, []).join(" | ");
});
if (!/overdue|überfällig/i.test(text3)) {
  throw new Error("maintenance trigger blocks not visible in the picker");
}
log("trigger blocks visible (overdue et al.)");

// ── Object dialog: device-link + parent fields (v2.19) ──────────────────────
await p.goto(HA + "/maintenance-supporter?entry_id=" + entryId, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(7000);
await p.locator("maintenance-supporter-panel").getByRole("button", { name: /^edit|bearbeiten/i }).first().click();
await p.waitForTimeout(1500);
await p.screenshot({ path: OUT + "23-object-dialog-device-link.png" });
log("shot 23 (object dialog with device/parent fields)");

log("ALL OK");
clearTimeout(watchdog);
await ctx.close();
await b.close();
process.exit(0);
