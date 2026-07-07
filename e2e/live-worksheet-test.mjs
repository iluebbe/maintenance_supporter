/** Live check: task work sheet (v2.21) — one-pager with details, checklist
 *  tick boxes, QR pair, and the manual-excerpt link backed by the new
 *  pypdf endpoint. */
import { chromium } from "@playwright/test";
import fs from "fs";
const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("./live-shots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
fs.mkdirSync(OUT, { recursive: true });
const token = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8").match(/HA_TOKEN=(\S+)/)[1];
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 7 * 60e3);

// A structurally valid 5-page PDF ("manual") built by hand.
function fivePagePdf() {
  const pages = 5;
  const objs = ["<< /Type /Catalog /Pages 2 0 R >>"];
  const kids = Array.from({ length: pages }, (_, i) => `${3 + i * 2} 0 R`).join(" ");
  objs.push(`<< /Type /Pages /Kids [${kids}] /Count ${pages} >>`);
  for (let i = 0; i < pages; i++) {
    const contentRef = `${4 + i * 2} 0 R`;
    objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentRef} /Resources << /Font << /F1 ${3 + pages * 2} 0 R >> >> >>`);
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
  return body;
}

// Seed object via service.
const suffix = Date.now() % 100000;
const objName = "Test Gastherme " + suffix;
const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
  method: "POST", headers: auth, body: JSON.stringify({ name: objName }),
}).then((r) => r.json());
const entryId = (svc.service_response ?? svc).entry_id;
log("object", entryId);

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
}, { t: token, ha: HA });
const p = await ctx.newPage();
// The shots-demo pattern: land on /lovelace first, evaluate from there.
await p.goto(HA + "/lovelace", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(6000);

// Task with checklist + notes via WS (in-page, shots-demo style).
const taskId = await p.evaluate(async ({ entryId }) => {
  const hass = document.querySelector("home-assistant").hass;
  const r = await hass.connection.sendMessagePromise({
    type: "maintenance_supporter/task/create",
    entry_id: entryId, name: "Jahreswartung Brenner", task_type: "service",
    interval_days: 365, warning_days: 14,
    notes: "Vor Beginn: Gashahn schließen. Dichtung 12x2mm bereitlegen.",
    checklist: ["Brennkammer öffnen", "Elektroden prüfen", "Dichtung ersetzen", "CO2-Wert messen"],
  });
  return r.task_id;
}, { entryId });
log("task", taskId);

// Upload the 5-page manual + link it to the task at page 2.
const fd = new FormData();
fd.append("entry_id", entryId);
fd.append("title", "Installationsanleitung");
fd.append("file", new Blob([fivePagePdf()], { type: "application/pdf" }), "gastherme-manual.pdf");
const up = await fetch(REST + "/api/maintenance_supporter/document/upload", {
  method: "POST", headers: { Authorization: "Bearer " + token }, body: fd,
}).then((r) => r.json());
log("doc", up.id);
await p.evaluate(async ({ docId, taskId }) => {
  const hass = document.querySelector("home-assistant").hass;
  await hass.connection.sendMessagePromise({
    type: "maintenance_supporter/documents/update",
    doc_id: docId, task_ids: [taskId], task_pages: { [taskId]: 2 },
  });
}, { docId: up.id, taskId });
log("doc linked at page 2");

// Deep-link straight to the task view, open ⋮ → Work sheet.
await p.goto(HA + `/maintenance-supporter?entry_id=${entryId}&task_id=${taskId}`, { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
const panel = p.locator("maintenance-supporter-panel");
await panel.locator(".more-menu-wrapper ha-icon-button").first().click();
await p.waitForTimeout(800);
const [sheet] = await Promise.all([
  ctx.waitForEvent("page"),
  panel.locator(".popup-menu-item", { hasText: /work sheet|arbeitsblatt/i }).click(),
]);
sheet.on("console", (m) => console.log("SHEET-CONSOLE:", m.type(), m.text().slice(0, 300)));
sheet.on("pageerror", (e) => console.log("SHEET-ERROR:", String(e).slice(0, 300)));
await sheet.waitForLoadState("domcontentloaded");
await sheet.waitForTimeout(1500);
await sheet.screenshot({ path: OUT + "40-worksheet.png", fullPage: true });
log("shot 40 (work sheet)");

// v2.21b: the excerpt pages render inline via pdf.js — wait for the canvases.
await sheet.waitForSelector(".excerpt-pages canvas", { timeout: 20000 });
await sheet.waitForTimeout(1500);
await sheet.screenshot({ path: OUT + "43-worksheet-inline-pages.png", fullPage: true });
const checks = await sheet.evaluate(() => ({
  canvases: document.querySelectorAll(".excerpt-pages canvas").length,
  qrs: document.querySelectorAll(".qr img").length,
  boxes: document.querySelectorAll("ul.check .box").length,
  excerpt: document.querySelector(".excerpt")?.textContent || "",
  title: document.querySelector("h1")?.textContent || "",
}));
log("VERIFY", JSON.stringify(checks));
if (checks.qrs !== 2) throw new Error("expected 2 QR codes");
if (checks.boxes !== 4) throw new Error("expected 4 checklist boxes");
if (!/2–5|2-5/.test(checks.excerpt)) throw new Error("excerpt page range missing");
if (checks.canvases !== 4) throw new Error("expected 4 inline excerpt pages, got " + checks.canvases);

// The excerpt link actually serves a PDF.
const excerptOk = await sheet.evaluate(async () => {
  const a = document.querySelector(".excerpt a");
  const resp = await fetch(a.getAttribute("href"));
  return { status: resp.status, type: resp.headers.get("content-type") };
});
log("excerpt fetch", JSON.stringify(excerptOk));
if (excerptOk.status !== 200 || !/pdf/.test(excerptOk.type || "")) throw new Error("excerpt endpoint failed");

log("ALL OK");
await ctx.close(); await b.close(); process.exit(0);
