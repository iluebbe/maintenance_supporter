/** Live UI test: the sensor-trigger live hint, driven like a real user.
 *
 * Unlike shots-trigger-hint.mjs (which sets dialog fields programmatically),
 * this drives the ACTUAL UI on ha-shots: click "New Maintenance Task", pick
 * the sensor-based schedule type, TYPE the entity id, pick Counter, tick
 * Delta mode, TYPE the target — every step a real browser event — then
 * asserts the live hint appears with the sensor's current reading and the
 * computed due point, and screenshots the dialog. */
import { chromium } from "@playwright/test";
import { watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const REST = "http://localhost:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = REST + "/";
const USER = "demo", PASS = "demo-pass-1";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
watchdog(5 * 60e3, "trigger-hint UI test");
const j = (r) => r.json();
const fail = (m) => { console.error("FAIL:", m); process.exit(1); };

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
  if (!t.access_token) throw new Error("token exchange failed");
  return t.access_token;
}

const token = await login();
const api = await wsClient(REST, token);
const states = await api.send({ type: "get_states" });
const sensor = states.find(
  (s) => s.entity_id.startsWith("sensor.") && !isNaN(parseFloat(s.state)) && s.attributes?.unit_of_measurement,
);
if (!sensor) fail("no numeric demo sensor found");
const reading = Math.round(parseFloat(sensor.state) * 10) / 10;
const unit = sensor.attributes.unit_of_measurement;
log("sensor:", sensor.entity_id, "=", reading, unit);

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1280, height: 1050 }, colorScheme: "dark", deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.addInitScript(hassTokensInit, { t: token, ha: HA });
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
let mounted = false;
for (let i = 0; i < 30 && !mounted; i++) {
  await p.waitForTimeout(1000);
  mounted = await p.evaluate(({ finder }) => {
    eval(finder);
    return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
  }, { finder: deepFindPanel }).catch(() => false);
}
if (!mounted) fail("panel never mounted");
log("panel mounted");

/** Resolve an element inside the panel/dialog shadow tree to a real
 *  Playwright ElementHandle so interactions are genuine browser events.
 *  Takes the SOURCE of a `(panel) => element` function (string — a closure
 *  would lose its captured variables when serialized to the page). */
async function handleOf(src) {
  const h = await p.evaluateHandle(({ finder, body }) => {
    eval(finder);
    // eslint-disable-next-line no-new-func
    return new Function("panel", "return (" + body + ")(panel)")(window.__panel);
  }, { finder: deepFindPanel, body: src });
  const el = h.asElement();
  if (!el) fail("element not found for: " + src.slice(0, 80));
  return el;
}
const inDlg = (expr) => `(panel) => { const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog"); return ${expr}; }`;

// 1. Real click on the "New Maintenance Task" header button.
const newTaskBtn = await handleOf(`(panel) =>
  [...panel.shadowRoot.querySelectorAll("ha-button")].find((b) => /new maintenance task/i.test(b.textContent))`);
await newTaskBtn.click();
log("clicked New Maintenance Task");
// Dialog opens async (loads users/tags/parts) — wait for it to be open.
await p.waitForFunction(({ finder }) => {
  eval(finder);
  return window.__panel?.shadowRoot?.querySelector("maintenance-task-dialog")?._open === true;
}, { finder: deepFindPanel }, { timeout: 15000 });
log("dialog open");

// 2. Schedule type → sensor_based (real selectOption on the actual <select>).
const schedSelect = await handleOf(inDlg(`[...dlg.shadowRoot.querySelectorAll("select")].find((s) => [...s.options].some((o) => o.value === "sensor_based"))`));
await schedSelect.selectOption("sensor_based");
log("schedule type = sensor_based");

// 3. Type the entity id into the Entity ID field (real keystrokes via fill).
const entityInput = await handleOf(inDlg(`[...dlg.shadowRoot.querySelectorAll("ms-textfield")].find((f) => /entity/i.test(f.label || ""))?.shadowRoot.querySelector("input")`));
await entityInput.fill(sensor.entity_id);
log("typed entity id");

// 4. Trigger type → counter.
const trigSelect = await handleOf(inDlg(`[...dlg.shadowRoot.querySelectorAll("select")].find((s) => [...s.options].some((o) => o.value === "counter"))`));
await trigSelect.selectOption("counter");
log("trigger type = counter");

// 5. Tick Delta mode (real click on the checkbox).
const deltaBox = await handleOf(inDlg(`[...dlg.shadowRoot.querySelectorAll("label")].find((l) => /delta/i.test(l.textContent))?.querySelector("input[type=checkbox]")`));
await deltaBox.check();
log("delta mode checked");

// 6. Type the target value.
const targetInput = await handleOf(inDlg(`[...dlg.shadowRoot.querySelectorAll("ms-textfield")].find((f) => /target/i.test(f.label || ""))?.shadowRoot.querySelector("input")`));
await targetInput.fill("100");
log("typed target 100");

// 7. The live hint must now render with the sensor's reading + computed due.
await p.waitForFunction(({ finder }) => {
  eval(finder);
  return !!window.__panel?.shadowRoot?.querySelector("maintenance-task-dialog")?.shadowRoot?.querySelector(".trigger-live-hint");
}, { finder: deepFindPanel }, { timeout: 5000 }).catch(() => fail("hint never rendered"));
const hintText = await p.evaluate(({ finder }) => {
  eval(finder);
  return window.__panel.shadowRoot.querySelector("maintenance-task-dialog").shadowRoot.querySelector(".trigger-live-hint").textContent.trim();
}, { finder: deepFindPanel });
log("HINT:", hintText);

const due = Math.round((reading + 100) * 10) / 10;
if (!hintText.includes(String(reading))) fail(`hint missing current reading ${reading}: ${hintText}`);
if (!hintText.includes(String(due))) fail(`hint missing computed due ${due}: ${hintText}`);
log(`asserted: reading ${reading} + computed due ${due} present`);

const hintEl = await handleOf(inDlg(`dlg.shadowRoot.querySelector(".trigger-live-hint")`));
await hintEl.scrollIntoViewIfNeeded();
await p.waitForTimeout(600);
await p.screenshot({ path: OUT + "/trigger-hint-ui.png" });
log("captured", OUT + "/trigger-hint-ui.png");
await ctx.close(); await b.close();
log("\nTRIGGER-HINT UI TEST PASSED");
process.exit(0);
