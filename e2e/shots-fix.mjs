/** Follow-up pass for shots-demo.mjs — redoes the handful of screenshots the
 * main run missed: mobile shots (taken FIRST — a second browser context on a
 * long-lived playwright-server connection can wedge, so mobile gets the fresh
 * one), the collapsed <details> dialog sections (completion action +
 * quick-complete), the more-info attributes expansion, the lovelace card
 * (with a reload after config save), and the integration Configure dialog.
 * Assumes ha-shots is already seeded by shots-demo.mjs.
 */
import { chromium } from "@playwright/test";
import fs from "fs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
// The client_id must be the origin the BROWSER uses (ha-shots:8123), not the
// host-side REST one — the frontend stores clientId next to the token and
// bounces to /auth/authorize when they disagree, which renders as a black
// page that then OVERWRITES a good screenshot. Caught 2026-08-02.
const CID = HA + "/";
const USER = "demo", PASS = "demo-pass-1";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const LOG = new URL("./shots-fix.log", import.meta.url);
fs.writeFileSync(LOG, "");
const log = (...a) => { const line = a.map((x) => typeof x === "string" ? x : JSON.stringify(x)).join(" "); fs.appendFileSync(LOG, line + String.fromCharCode(10)); console.log(line); };
process.on("unhandledRejection", (e) => { log("UNHANDLED", String(e && e.stack || e)); process.exit(2); });
const watchdog = setTimeout(() => { log("WATCHDOG: aborting"); process.exit(3); }, 7 * 60e3);

const j = (r) => r.json();
async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: USER, password: PASS }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("login failed");
  return t.access_token;
}

const token = await login();
log("LOGIN OK");
const b = await chromium.connect(PW_WS, { timeout: 20000 });

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

// Poll until the panel is mounted WITH data — the faketime dev image renders
// slowly and a fixed wait was exactly what made this script clobber a good
// screenshot with a blank frame (2026-08-02).
async function waitMounted(page, seconds = 30) {
  for (let i = 0; i < seconds; i++) {
    const ok = await page.evaluate(({ finder }) => {
      eval(finder);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }, { finder: deepFindPanel }).catch(() => false);
    if (ok) return;
    await page.waitForTimeout(1000);
  }
  throw new Error("panel never mounted");
}

async function waitHass(page, seconds = 20) {
  for (let i = 0; i < seconds; i++) {
    const ok = await page.evaluate(() => {
      const el = document.querySelector("home-assistant");
      return !!(el && el.hass && el.hass.states);
    }).catch(() => false);
    if (ok) return;
    await page.waitForTimeout(1000);
  }
  throw new Error("hass never ready");
}

const failures = [];
async function step(name, fn) {
  log("STEP", name);
  try { await fn(); log("OK", name); }
  catch (e) { failures.push(name); log("FAIL", name, String(e && e.message || e).slice(0, 300)); }
}

function initScript(tab) {
  return [({ t, ha, tab }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: t, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
    localStorage.setItem("msp-overview-tab", tab);
  }, { t: token, ha: HA, tab }];
}

// ── Mobile first (fresh connection = reliable second context) ──────────────
const mctx = await b.newContext({ viewport: { width: 400, height: 860 }, colorScheme: "dark", isMobile: true, hasTouch: true });
await mctx.addInitScript(...initScript("today"));
const mp = await mctx.newPage();

await step("mobile-overview.png", async () => {
  await mp.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  await waitMounted(mp);
  await mp.waitForTimeout(1500);
  await mp.screenshot({ path: OUT + "mobile-overview.png" });
});

await step("mobile-task.png", async () => {
  await mp.evaluate(({ finder }) => {
    eval(finder);
    const panel = window.__panel;
    const o = panel._objects.find((x) => x.object.name === "HVAC System");
    const t2 = o.tasks.find((x) => x.name === "Filter Replacement");
    panel._showTask(o.entry_id, t2.id);
  }, { finder: deepFindPanel });
  await mp.waitForTimeout(3000);
  await mp.screenshot({ path: OUT + "mobile-task.png" });
});
await mctx.close();

// ── Desktop fixes ───────────────────────────────────────────────────────────
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
await ctx.addInitScript(...initScript("dashboard"));
const p = await ctx.newPage();
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
await waitMounted(p);
await p.waitForTimeout(1500);

// Open the task dialog and expand + scroll to a <details> section whose
// summary text matches.
async function dialogSection(objName, taskName, summaryMatch, file) {
  await p.evaluate(({ finder, objName, taskName, summaryMatch }) => {
    eval(finder);
    const panel = window.__panel;
    const o = panel._objects.find((x) => x.object.name === objName);
    const t2 = o.tasks.find((x) => x.name === taskName);
    const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog");
    dlg.openEdit(o.entry_id, t2);
    setTimeout(() => {
      const root = dlg.shadowRoot;
      for (const sum of root.querySelectorAll("details > summary")) {
        if (new RegExp(summaryMatch, "i").test(sum.textContent || "")) {
          sum.parentElement.open = true;
          sum.scrollIntoView({ block: "start" });
        }
      }
    }, 900);
  }, { finder: deepFindPanel, objName, taskName, summaryMatch });
  await p.waitForTimeout(2200);
  await p.screenshot({ path: OUT + file });
  await p.keyboard.press("Escape");
  await p.waitForTimeout(500);
}

await step("task-dialog-action.png", () =>
  dialogSection("Pool Pump", "Impeller Cleaning", "on complete", "task-dialog-action.png"));

await step("task-dialog-quick-complete.png", () =>
  dialogSection("HVAC System", "Filter Replacement", "quick-complete", "task-dialog-quick-complete.png"));

// Entity attributes: more-info dialog with the Attributes panel expanded.
await step("entity-attributes.png", async () => {
  await waitHass(p);
  await p.evaluate(() => {
    const haEl = document.querySelector("home-assistant");
    const id = Object.keys(haEl.hass.states).find((k) => k.startsWith("sensor.") && k.includes("oil_change"));
    haEl.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: id }, bubbles: true, composed: true }));
  });
  await p.waitForTimeout(2500);
  await p.evaluate(() => {
    const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
      while (st.length && n < 100000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    for (const exp of deep((el) => el.tagName === "HA-EXPANSION-PANEL")) {
      exp.expanded = true;
      if (typeof exp.click === "function" && !exp.expanded) exp.click();
    }
    setTimeout(() => {
      const attrs = deep((el) => el.tagName === "HA-ATTRIBUTES")[0];
      if (attrs) attrs.scrollIntoView({ block: "center" });
    }, 600);
  });
  await p.waitForTimeout(1800);
  await p.screenshot({ path: OUT + "entity-attributes.png" });
  await p.keyboard.press("Escape");
  await p.waitForTimeout(500);
});

// Lovelace card: save the dashboard config, then a hard reload so the saved
// (storage-mode) config replaces the auto strategy dashboard.
await step("lovelace-card.png", async () => {
  await waitHass(p);
  await p.evaluate(async () => {
    const hass = document.querySelector("home-assistant").hass;
    await hass.connection.sendMessagePromise({
      type: "lovelace/config/save", url_path: null,
      config: { title: "Home", views: [{ title: "Home", path: "home", cards: [
        { type: "custom:maintenance-supporter-card", show_header: true, show_actions: true,
          filter_status: ["overdue", "triggered", "due_soon"], max_items: 8 },
      ] }] },
    });
  });
  await p.goto(HA + "/lovelace/home", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(3000);
  await p.reload({ waitUntil: "domcontentloaded" });
  await p.waitForTimeout(7000);
  const rect = await p.evaluate(() => {
    const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
      while (st.length && n < 100000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    const card = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
    if (!card) return null;
    const r = card.getBoundingClientRect();
    return { x: Math.max(0, r.x - 16), y: Math.max(0, r.y - 16), width: Math.min(r.width + 32, 1600), height: Math.min(r.height + 32, 1000 - Math.max(0, r.y - 16)) };
  });
  if (!rect || rect.width < 100) throw new Error("card not rendered");
  await p.screenshot({ path: OUT + "lovelace-card.png", clip: rect });
});

// Config flow: integration page → Configure (gear icon or text button).
await step("config-flow.png", async () => {
  await p.goto(HA + "/config/integrations/integration/maintenance_supporter", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(5000);
  const clicked = await p.evaluate(() => {
    const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
      while (st.length && n < 100000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    const label = (el) => (el.getAttribute && (el.getAttribute("aria-label") || el.getAttribute("label") || el.title) || "") + " " + (el.textContent || "");
    const cand = deep((el) => ["HA-BUTTON", "MWC-BUTTON", "HA-ICON-BUTTON"].includes(el.tagName) && /configur|options|einstell/i.test(label(el)));
    if (cand[0]) { cand[0].click(); return label(cand[0]).slice(0, 80); }
    return null;
  });
  if (!clicked) throw new Error("no configure control found");
  log("clicked:", clicked);
  await p.waitForTimeout(3500);
  await p.screenshot({ path: OUT + "config-flow.png" });
  await p.keyboard.press("Escape");
});

log(failures.length ? "DONE WITH FAILURES: " + failures.join(", ") : "DONE ALL OK");
clearTimeout(watchdog);
await b.close();
process.exit(failures.length ? 1 : 0);
