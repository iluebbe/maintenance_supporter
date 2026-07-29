/** Focused screenshots for the "documents under tasks" + backup features:
 *  - object detail: Tasks -> Documents -> Parts order + per-task paperclip badge
 *  - settings Import/Export: object picker + documents-archive (ZIP) buttons
 *  Seeds a self-contained demo object (task + linked doc + part) on ha-shots. */
import { chromium } from "@playwright/test";
import fs from "fs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
// browser-side origin, not the host REST one (see shots-demo.mjs)
const CID = HA + "/", USER = "demo", PASS = "demo-pass-1";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const j = (r) => r.json();
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 3 * 60e3);

// --- login ---
const f = await fetch(REST + "/auth/login_flow", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }) }).then(j);
const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: CID, username: USER, password: PASS }) }).then(j);
const tok = await fetch(REST + "/auth/token", { method: "POST", body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }) }).then(j);
const token = tok.access_token;
const auth = { Authorization: "Bearer " + token };

// --- WS helper ---
async function ws() {
  const sock = new WebSocket(REST.replace(/^http/, "ws") + "/api/websocket");
  await new Promise((res, rej) => { sock.onopen = res; sock.onerror = () => rej(new Error("ws")); });
  let id = 1; const pend = new Map();
  await new Promise((res) => { sock.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.type === "auth_required") sock.send(JSON.stringify({ type: "auth", access_token: token })); else if (m.type === "auth_ok") res(); else if (m.type === "result") { const p = pend.get(m.id); if (p) { pend.delete(m.id); m.success ? p.res(m.result) : p.rej(new Error(JSON.stringify(m.error))); } } }; });
  return { send: (msg) => new Promise((res, rej) => { const i = id++; pend.set(i, { res, rej }); sock.send(JSON.stringify({ ...msg, id: i })); }) };
}
const api = await ws();

// --- seed a clean demo object if absent ---
const NAME = "Espresso Machine";
let list = (await api.send({ type: "maintenance_supporter/objects" })).objects || [];
let obj = list.find((o) => o.object.name === NAME);
if (!obj) {
  const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify({ name: NAME, manufacturer: "ECM", model: "Synchronika" }) }).then(j);
  const entryId = (svc.service_response ?? svc).entry_id;
  await api.send({ type: "maintenance_supporter/task/create", entry_id: entryId, name: "Descale", task_type: "cleaning", interval_days: 60, last_performed: "2026-06-20", warning_days: 7 });
  await api.send({ type: "maintenance_supporter/task/create", entry_id: entryId, name: "Backflush", task_type: "cleaning", interval_days: 7, last_performed: "2026-07-10", warning_days: 2 });
  await api.send({ type: "maintenance_supporter/part/create", entry_id: entryId, name: "Descaling tablets", vendor: "ECM", mpn: "62535", unit: "pcs", stock: 6, reorder_threshold: 1, restock_quantity: 6, auto_buy_task: true });
  list = (await api.send({ type: "maintenance_supporter/objects" })).objects || [];
  obj = list.find((o) => o.object.name === NAME);
}
const entryId = obj.entry_id;
const descale = obj.tasks.find((t) => t.name === "Descale") || obj.tasks[0];

// Upload a manual and link it to the Descale task (so the paperclip badge shows).
const existingDocs = (await api.send({ type: "maintenance_supporter/documents/list", entry_id: entryId })).documents || [];
if (!existingDocs.some((d) => (d.task_ids || []).includes(descale.id))) {
  const fd = new FormData();
  fd.append("entry_id", entryId);
  fd.append("file", new Blob([Buffer.from("%PDF-1.4 Descaling guide")], { type: "application/pdf" }), "Descaling guide.pdf");
  fd.append("title", "Descaling guide");
  const up = await fetch(REST + "/api/maintenance_supporter/document/upload", { method: "POST", headers: auth, body: fd }).then(j);
  await api.send({ type: "maintenance_supporter/documents/update", doc_id: up.id, task_ids: [descale.id] });
  log("linked doc", up.id, "to task", descale.id);
}
log("seed ready, entry", entryId);

// --- browser ---
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
await ctx.addInitScript(() => {
  localStorage.setItem("selectedTheme", JSON.stringify({ dark: true }));
});
const p = await ctx.newPage();
// UI login (token injection started bouncing to /auth/authorize, 2026-07-20).
await p.goto(HA + "/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(4000);
await p.evaluate(({ u, pw }) => {
  const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
    while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  const inputs = deep((el) => el.tagName === "INPUT" && ["text", "password"].includes(el.type));
  const set = (el, v) => { el.focus(); el.value = v; el.dispatchEvent(new Event("input", { bubbles: true, composed: true })); };
  const user = inputs.find((i) => i.type === "text");
  const pass = inputs.find((i) => i.type === "password");
  if (user) set(user, u);
  if (pass) set(pass, pw);
}, { u: USER, pw: PASS });
await p.waitForTimeout(500);
await p.keyboard.press("Enter");
await p.waitForTimeout(6000);

// Object detail — order + per-task doc badge.
await p.goto(HA + "/maintenance-supporter?entry_id=" + entryId, { waitUntil: "domcontentloaded" });
log("navigated to object detail");
for (let i = 0; i < 25; i++) {
  const ready = await p.evaluate(() => {
    const pnl = document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("maintenance-supporter-panel")?.shadowRoot;
    return !!(pnl && pnl.querySelector(".task-table") && pnl.querySelector("maintenance-documents-section"));
  }).catch((e) => { log("poll err", String(e).slice(0, 60)); return false; });
  if (ready) { log("object detail ready at", i); break; }
  await p.waitForTimeout(1000);
}
await p.waitForTimeout(1500);
await p.screenshot({ path: OUT + "task-documents.png" });
log("shot task-documents.png");

// Settings → Import/Export: expand the object picker so the selective +
// documents-archive controls are visible.
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(3000);
const opened = await p.evaluate(() => {
  const panel = document.querySelector("home-assistant").shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("maintenance-supporter-panel").shadowRoot;
  const tabs = [...panel.querySelectorAll("button, .tab, [role=tab]")];
  const settings = tabs.find((el) => /settings|einstellungen/i.test(el.textContent || ""));
  if (settings) { settings.click(); return true; }
  return false;
});
await p.waitForTimeout(2500);
// Scroll the Import/Export section into view + click the "load objects" button.
await p.evaluate(() => {
  const root = document.querySelector("home-assistant").shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("maintenance-supporter-panel").shadowRoot;
  const sv = root.querySelector("maintenance-settings-view");
  const svRoot = sv?.shadowRoot || sv;
  const h3s = [...(svRoot?.querySelectorAll("h3") || [])];
  const ie = h3s.find((h) => /import|export/i.test(h.textContent || ""));
  ie?.scrollIntoView({ block: "start" });
  const loadBtn = [...(svRoot?.querySelectorAll("button") || [])].find((btn) => /object|objekt/i.test(btn.textContent || "") && /select|ausw|limit|beschr/i.test(btn.textContent || ""));
  loadBtn?.click();
});
await p.waitForTimeout(2000);
await p.screenshot({ path: OUT + "export-options.png" });
log("shot export-options.png");

await ctx.close(); await b.close();
log("DONE");
process.exit(0);
