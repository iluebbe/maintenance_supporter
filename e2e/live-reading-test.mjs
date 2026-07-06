/** Live browser verification of the meter-reading feature (v2.20, #83)
 *  against the running ha-maint dev instance — plus a quick look at the
 *  pause/replace buttons (N3/N1) in the object header.
 *
 *  Flow (all through the real panel UI, not WS shortcuts, except object
 *  creation):
 *    1. create object "Test Stromzähler" via WS
 *    2. open its detail, Add task → type=reading → unit field appears → kWh
 *    3. complete twice via the complete dialog (reading 1000, then 1123.5;
 *       31 s apart — the manual-completion dedup window is real)
 *    4. history shows both readings and the +123.5 delta
 *  Screenshots land in e2e/live-shots/.
 */
import { chromium } from "@playwright/test";
import fs from "fs";

const HA = "http://ha-maint:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("./live-shots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
fs.mkdirSync(OUT, { recursive: true });

const envFile = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8");
const token = envFile.match(/HA_TOKEN=(\S+)/)[1];

const log = (...a) => console.log(...a);
const watchdog = setTimeout(() => { console.error("WATCHDOG abort"); process.exit(3); }, 8 * 60e3);

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
}, { t: token, ha: HA });
// 1. Fresh test object via the add_object SERVICE from the host (avoids the
// in-page-evaluate wedge the playwright-server is known for).
const REST = "http://127.0.0.1:8125";
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: "Test Stromzähler " + Date.now() % 100000 }),
}).then((r) => r.json());
const objName = Object.values(svc.service_response ?? svc)?.name || null;
const entryId = (svc.service_response ?? svc).entry_id;
log("object created via service", JSON.stringify(svc).slice(0, 160));

const p = await ctx.newPage();
await p.goto(HA + "/maintenance-supporter?entry_id=" + entryId, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
log("panel open (deep-linked to object)");

// 2. Deep link landed on the object detail already.
await p.screenshot({ path: OUT + "01-object-header-pause-replace.png" });
log("shot 01 (object header incl. Pause/Replace buttons)");

// 3. Add task via the dialog: name, type=reading → unit field must appear.
await p.locator("maintenance-supporter-panel").getByRole("button", { name: /add task|aufgabe/i }).first().click();
await p.waitForTimeout(1200);
const dlg = p.locator("maintenance-task-dialog");
await dlg.locator("ms-textfield").first().locator("input").fill("Zählerstand ablesen");
// type select is the first .select-row select
await dlg.locator(".select-row select").first().selectOption("reading");
await p.waitForTimeout(600);
// unit field appears directly below the type select
const unitInput = dlg.locator("ms-textfield", { hasText: "" }).filter({ has: p.locator("input") });
// robust: find by its label text
const unitField = dlg.locator("ms-textfield").filter({ hasText: /reading unit|ableseeinheit/i });
if (await unitField.count() === 0) throw new Error("reading-unit field did NOT appear for type=reading");
await unitField.locator("input").fill("kWh");
await p.screenshot({ path: OUT + "02-task-dialog-reading-unit.png" });
log("shot 02 (task dialog with reading unit field)");
await dlg.getByRole("button", { name: /^(save|create|speichern|erstellen|anlegen)/i }).last().click();
await p.waitForTimeout(2500);

// 4. First completion with reading 1000 via the complete dialog.
async function completeWithReading(value) {
  // task row complete button (mwc-icon-button.btn-complete)
  await p.locator("maintenance-supporter-panel .btn-complete").first().click();
  await p.waitForTimeout(1000);
  const cdlg = p.locator("maintenance-complete-dialog");
  const reading = cdlg.locator("label.field").filter({ hasText: /reading|ablese/i }).locator("input");
  if (await reading.count() === 0) throw new Error("reading-value field missing in complete dialog");
  await reading.fill(String(value));
  await p.screenshot({ path: OUT + `03-complete-dialog-${value}.png` });
  await cdlg.getByRole("button", { name: /^(complete|erledig)/i }).last().click();
  await p.waitForTimeout(2000);
}
await completeWithReading(1000);
log("first reading recorded");

log("waiting 32s (manual-completion dedup window)…");
await p.waitForTimeout(32000);
await completeWithReading(1123.5);
log("second reading recorded");

// 5. Open the task detail → history: both readings + the delta.
await p.locator("maintenance-supporter-panel").getByText("Zählerstand ablesen").first().click();
await p.waitForTimeout(1500);
// history tab
await p.locator("maintenance-supporter-panel").getByRole("button", { name: /history|verlauf/i }).first().click()
  .catch(() => p.locator("maintenance-supporter-panel").getByText(/history|verlauf/i).first().click());
await p.waitForTimeout(1500);
await p.screenshot({ path: OUT + "04-history-readings-delta.png", fullPage: false });
log("shot 04 (history with readings)");

// Verify the delta text actually rendered somewhere in the panel.
const hasDelta = await p.evaluate(() => {
  const walk = (root, out) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) walk(el.shadowRoot, out);
      out.push(el.textContent || "");
    }
    return out;
  };
  const texts = walk(document.querySelector("home-assistant").shadowRoot, []).join(" ");
  return { delta: texts.includes("+123.5"), unit: texts.includes("kWh"), v1: texts.includes("1000"), v2: texts.includes("1123.5") };
});
log("VERIFY", JSON.stringify(hasDelta));
if (!hasDelta.delta || !hasDelta.unit) throw new Error("delta or unit not visible in history: " + JSON.stringify(hasDelta));

log("ALL OK");
clearTimeout(watchdog);
await ctx.close();
await b.close();
process.exit(0);
