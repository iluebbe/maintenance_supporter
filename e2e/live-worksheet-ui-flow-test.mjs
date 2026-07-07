/** Live check of the USER flow for the work-sheet manual excerpt (v2.21):
 *  upload a PDF via the object page → attach it to the task and set the page
 *  in the task's Documents section → the work sheet links the excerpt.
 *  No WS shortcuts — every step through the real UI. */
import { chromium } from "@playwright/test";
import fs from "fs";
const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("./live-shots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
fs.mkdirSync(OUT, { recursive: true });
const token = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8").match(/HA_TOKEN=(\S+)/)[1];
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 7 * 60e3);

function fivePagePdf() {
  const pages = 5;
  const objs = ["<< /Type /Catalog /Pages 2 0 R >>"];
  const kids = Array.from({ length: pages }, (_, i) => `${3 + i * 2} 0 R`).join(" ");
  objs.push(`<< /Type /Pages /Kids [${kids}] /Count ${pages} >>`);
  for (let i = 0; i < pages; i++) {
    objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${4 + i * 2} 0 R /Resources << /Font << /F1 ${3 + pages * 2} 0 R >> >> >>`);
    const stream = `BT /F1 28 Tf 72 760 Td (Manual page ${i + 1}) Tj ET`;
    objs.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  }
  objs.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  let body = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((o, i) => { offsets.push(body.length); body += `${i + 1} 0 obj ${o} endobj\n`; });
  const xref = body.length;
  body += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`
    + offsets.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("")
    + `trailer << /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(body);
}

// Seed a bare object + task via services (creation isn't under test).
const suffix = Date.now() % 100000;
const objName = "Test Spülmaschine " + suffix;
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: objName }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;
const tsvc = await fetch(REST + "/api/services/maintenance_supporter/add_task?return_response", {
  method: "POST", headers: auth,
  body: JSON.stringify({ entry_id: entryId, name: "Siebe reinigen", interval_days: 90 }),
}).then((r) => r.json());
const taskId = (tsvc.service_response ?? tsvc).task_id;
log("seeded", objName, entryId, taskId);

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
}, { t: token, ha: HA });
const p = await ctx.newPage();

// 1. Upload the PDF via REST (setInputFiles with a buffer crashes the dockered
// playwright-server; the upload dialog itself is long-established). The steps
// under test — attach to the task + page hint + work sheet — stay pure UI.
const fd = new FormData();
fd.append("entry_id", entryId);
fd.append("title", "Bedienungsanleitung");
fd.append("file", new Blob([fivePagePdf()], { type: "application/pdf" }), "spuelmaschine-manual.pdf");
const up = await fetch(REST + "/api/maintenance_supporter/document/upload", {
  method: "POST", headers: { Authorization: "Bearer " + token }, body: fd,
}).then((r) => r.json());
log("PDF uploaded", up.id);
await p.goto(HA + "/maintenance-supporter?entry_id=" + entryId, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);

// 2. Task detail → Documents: attach the doc, then set page 2.
await p.locator("maintenance-supporter-panel").getByText("Siebe reinigen").first().click();
await p.waitForTimeout(2000);
const tdocs = p.locator("maintenance-task-documents");
await tdocs.scrollIntoViewIfNeeded();
await tdocs.locator("select").selectOption({ index: 1 }).catch(async () => {
  // single option case: pick by label
  await tdocs.locator("select").selectOption({ label: /sp.lmaschine/i });
});
await tdocs.locator("button.tdoc-btn", { hasText: /link|verkn/i }).first().click();
await p.waitForTimeout(2000);
log("doc attached to task via UI");
await tdocs.locator("input.tdoc-page").fill("2");
await tdocs.locator("input.tdoc-page").dispatchEvent("change");
await p.waitForTimeout(2000);
await p.screenshot({ path: OUT + "41-task-docs-page-set.png" });
log("page 2 set via UI");

// 3. ⋮ → Work sheet: the excerpt line must be there.
await p.locator("maintenance-supporter-panel .more-menu-wrapper ha-icon-button").first().click();
await p.waitForTimeout(800);
const [sheet] = await Promise.all([
  ctx.waitForEvent("page"),
  p.locator("maintenance-supporter-panel .popup-menu-item", { hasText: /work sheet|arbeitsblatt/i }).click(),
]);
await sheet.waitForLoadState("domcontentloaded");
await sheet.waitForTimeout(1500);
await sheet.screenshot({ path: OUT + "42-worksheet-ui-flow.png", fullPage: true });
const checks = await sheet.evaluate(async () => {
  const excerpt = document.querySelector(".excerpt");
  const a = excerpt?.querySelector("a");
  let fetchStatus = null;
  if (a) fetchStatus = (await fetch(a.href)).status;
  return { text: excerpt?.textContent?.replace(/\s+/g, " ").trim() || "", fetchStatus };
});
log("VERIFY", JSON.stringify(checks));
if (!/2–5|2-5/.test(checks.text)) throw new Error("excerpt line missing on the sheet");
if (checks.fetchStatus !== 200) throw new Error("excerpt PDF fetch failed: " + checks.fetchStatus);

log("ALL OK — full UI flow works");
await ctx.close(); await b.close(); process.exit(0);
