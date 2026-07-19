/** Live screenshot of the sensor-trigger live hint (task dialog, ha-shots).
 *
 * Opens the panel, opens the task dialog in create mode, configures a delta
 * counter against a real demo sensor and screenshots the dialog — verifying
 * the hint renders with the live reading + computed due point. Output to the
 * given dir (scratchpad), not docs/. */
import { chromium } from "@playwright/test";
import { watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = REST + "/";
const USER = "demo", PASS = "demo-pass-1";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
watchdog(4 * 60e3, "trigger-hint shot");
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
  if (!t.access_token) throw new Error("token exchange failed");
  return t.access_token;
}

const token = await login();
log("logged in");
// Find a numeric demo sensor to bind the trigger to.
const api = await wsClient(REST, token);
const states = await api.send({ type: "get_states" });
const sensor = states.find(
  (s) => s.entity_id.startsWith("sensor.") && !isNaN(parseFloat(s.state)) && s.attributes?.unit_of_measurement,
);
if (!sensor) throw new Error("no numeric demo sensor found");
log("using", sensor.entity_id, "=", sensor.state, sensor.attributes.unit_of_measurement);

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1200, height: 1000 }, colorScheme: "dark", deviceScaleFactor: 2 });
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
if (!mounted) throw new Error("panel never mounted");
log("panel mounted");

const hintText = await p.evaluate(async ({ finder, entityId }) => {
  eval(finder);
  const panel = window.__panel;
  const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog");
  // openCreate is ASYNC (awaits users/tags/parts WS loads before _open=true).
  await dlg.openCreate(panel._objects[0].entry_id, panel._objects);
  await dlg.updateComplete;
  dlg._scheduleType = "sensor_based";
  dlg._triggerEntityId = entityId;
  dlg._triggerEntityIds = [entityId];
  dlg._triggerType = "counter";
  dlg._triggerDeltaMode = true;
  dlg._triggerTargetValue = "100";
  await dlg.updateComplete;
  const hint = dlg.shadowRoot.querySelector(".trigger-live-hint");
  if (hint) hint.scrollIntoView({ block: "center" });
  return hint ? hint.textContent.trim() : null;
}, { finder: deepFindPanel, entityId: sensor.entity_id });

if (!hintText) throw new Error("trigger-live-hint did NOT render");
log("HINT:", hintText);
await p.waitForTimeout(800);
await p.screenshot({ path: OUT + "/trigger-hint-dialog.png" });
log("captured", OUT + "/trigger-hint-dialog.png");
await ctx.close(); await b.close();
log("TRIGGER-HINT SHOT DONE");
process.exit(0);
