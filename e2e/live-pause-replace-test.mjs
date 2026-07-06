/** Live browser verification of seasonal pause (N3) + replace flow (N1)
 *  against ha-maint — clicking the real panel UI end to end.
 *
 *  Pause: header button → prompt dialog (optional resume date) → paused badge
 *  on detail + object card, task reads "paused" → Resume → back to ok.
 *  Replace: header button → name prompt → successor detail opens, task fresh;
 *  the predecessor is archived with its history.
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
const watchdog = setTimeout(() => { console.error("WATCHDOG abort"); process.exit(3); }, 8 * 60e3);

// Seed: object + one overdue-ish task via services (creation isn't under test).
const suffix = Date.now() % 100000;
const objName = "Test Poolpumpe " + suffix;
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: objName }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;
await fetch(REST + "/api/services/maintenance_supporter/add_task?return_response", {
  method: "POST", headers: auth,
  body: JSON.stringify({ entry_id: entryId, name: "Filter reinigen", interval_days: 30 }),
}).then((r) => r.json());
log("seeded", objName, entryId);

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
}, { t: token, ha: HA });
const p = await ctx.newPage();
await p.goto(HA + "/maintenance-supporter?entry_id=" + entryId, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
log("panel open on object detail");
const panel = p.locator("maintenance-supporter-panel");

// Shadow-piercing text dump for verification.
const panelText = () => p.evaluate(() => {
  const walk = (root, out) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) walk(el.shadowRoot, out);
      out.push(el.textContent || "");
    }
    return out;
  };
  return walk(document.querySelector("home-assistant").shadowRoot, []).join(" | ");
});

// ── N3: Pause ────────────────────────────────────────────────────────────────
await panel.getByRole("button", { name: /^pause|pausieren/i }).first().click();
await p.waitForTimeout(1000);
await p.screenshot({ path: OUT + "10-pause-prompt.png" });
log("shot 10 (pause prompt with date field)");
// Confirm without a date (open-ended pause).
const confirmDlg = p.locator("maintenance-confirm-dialog");
await confirmDlg.getByRole("button", { name: /^pause|pausieren/i }).last().click();
await p.waitForTimeout(4000); // reload + repaint

let text = await panelText();
if (!/paused|pausiert/i.test(text)) throw new Error("no paused indicator after pause");
await p.screenshot({ path: OUT + "11-object-paused-detail.png" });
log("shot 11 (paused meta line + paused task status)");

// Object list: paused badge on the card.
await panel.getByText(/all objects|alle objekte/i).first().click().catch(async () => {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(5000);
});
await p.waitForTimeout(1500);
// navigate to All objects via overview if needed — the card shows the badge
await p.screenshot({ path: OUT + "12-object-card-paused-badge.png" });
log("shot 12 (object card with paused badge)");

// Back to detail → Resume.
await p.goto(HA + "/maintenance-supporter?entry_id=" + entryId, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(6000);
await p.locator("maintenance-supporter-panel").getByRole("button", { name: /resume|fortsetzen/i }).first().click();
await p.waitForTimeout(4000);
text = await panelText();
if (!/Filter reinigen/.test(text)) throw new Error("task missing after resume");
// status back to OK (badge text "OK")
await p.screenshot({ path: OUT + "13-object-resumed.png" });
log("shot 13 (resumed, task ok again)");

// Backend truth check via WS-free REST: entity state of the task sensor.
const states = await fetch(REST + "/api/states", { headers: auth }).then((r) => r.json());
const sensor = states.find((s) => s.entity_id.startsWith("sensor.test_poolpumpe_" + suffix));
log("sensor state after resume:", sensor && sensor.state);
if (!sensor || sensor.state === "paused") throw new Error("sensor still paused after resume");

// ── N1: Replace ──────────────────────────────────────────────────────────────
await p.locator("maintenance-supporter-panel").getByRole("button", { name: /replace|ersetzen/i }).first().click();
await p.waitForTimeout(1000);
await p.screenshot({ path: OUT + "14-replace-prompt.png" });
log("shot 14 (replace prompt, prefilled name)");
const rdlg = p.locator("maintenance-confirm-dialog");
await rdlg.locator("input").fill(objName + " (2026)");
await rdlg.getByRole("button", { name: /replace|ersetzen/i }).last().click();
await p.waitForTimeout(6000); // create + reload + navigate to successor

text = await panelText();
if (!text.includes(objName + " (2026)")) throw new Error("successor detail not shown");
if (!/Filter reinigen/.test(text)) throw new Error("task config did not carry over");
await p.screenshot({ path: OUT + "15-successor-detail.png" });
log("shot 15 (successor with carried task, fresh state)");

// Predecessor archived + linked?
const objs = await fetch(REST + "/api/services/maintenance_supporter/list_tasks?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({}),
}).then((r) => r.json());
const rows = (objs.service_response ?? objs).tasks || [];
const oldRows = rows.filter((r2) => r2.object_name === objName);
log("old object active tasks after replace:", oldRows.length, "(expect 0 — archived cascade)");
if (oldRows.length !== 0) throw new Error("predecessor tasks still active");
const newRows = rows.filter((r2) => r2.object_name === objName + " (2026)");
if (newRows.length !== 1 || newRows[0].status !== "ok") throw new Error("successor task not ok: " + JSON.stringify(newRows));

log("ALL OK");
clearTimeout(watchdog);
await ctx.close();
await b.close();
process.exit(0);
