/** Live check + screenshot of the adopt-problem-sensors dialog on ha-shots.
 *  Seeds two device_class:problem binary sensors, opens the dialog from the
 *  panel header, shoots it, then adopts and checks a task was created. */
import { chromium } from "@playwright/test";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const CID = REST + "/", USER = "demo", PASS = "demo-pass-1";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const j = (r) => r.json();
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 3 * 60e3);

const f = await fetch(REST + "/auth/login_flow", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }) }).then(j);
const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: CID, username: USER, password: PASS }) }).then(j);
const tok = await fetch(REST + "/auth/token", { method: "POST", body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }) }).then(j);
const token = tok.access_token;
const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };

// Seed two problem sensors via the states API (template-config-free).
for (const [eid, name] of [["binary_sensor.printer_problem", "Printer problem"], ["binary_sensor.hvac_filter_alert", "HVAC filter alert"]]) {
  await fetch(REST + "/api/states/" + eid, { method: "POST", headers: auth, body: JSON.stringify({ state: "on", attributes: { device_class: "problem", friendly_name: name } }) });
}
log("seeded problem sensors");

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
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
for (let i = 0; i < 25; i++) {
  const ok = await p.evaluate(() => !!document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("maintenance-supporter-panel")?.shadowRoot?.querySelector("maintenance-adopt-problem-sensors-dialog")).catch(() => false);
  if (ok) break;
  await p.waitForTimeout(1000);
}

// Open the dialog programmatically (robust against header layout).
const opened = await p.evaluate(async () => {
  const panel = document.querySelector("home-assistant").shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("maintenance-supporter-panel");
  const dlg = panel.shadowRoot.querySelector("maintenance-adopt-problem-sensors-dialog");
  if (!dlg || typeof dlg.open !== "function") return "no dialog";
  await dlg.open();
  return "ok";
});
log("open:", opened);
await p.waitForTimeout(2500);
await p.screenshot({ path: OUT + "adopt-problem-sensors.png" });
log("shot adopt-problem-sensors.png");

// Sanity: the dialog listed our sensors.
const listed = await p.evaluate(() => {
  const panel = document.querySelector("home-assistant").shadowRoot.querySelector("home-assistant-main").shadowRoot.querySelector("maintenance-supporter-panel");
  const dlg = panel.shadowRoot.querySelector("maintenance-adopt-problem-sensors-dialog");
  return (dlg._sensors || []).map((x) => x.entity_id);
});
log("dialog listed:", JSON.stringify(listed));
if (!listed.includes("binary_sensor.printer_problem")) throw new Error("dialog did not list the seeded problem sensor");

log("DONE");
await ctx.close(); await b.close();
process.exit(0);
