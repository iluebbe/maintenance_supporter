/** Interactive review shots of the fleet-UI wave on the seeded ha-shots demo:
 *  roster default / urgency sort / type filter / mobile width.
 *  Output PNGs go to argv[2] (default: OS temp review dir).
 */
import { chromium } from "@playwright/test";
import { wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = HA + "/";
const OUT = (process.argv[2] || ".").replace(/\/?$/, "/");
const log = (...a) => console.log(...a);
watchdog(8 * 60e3, "fleet ui review");

const j = (r) => r.json();
async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: "demo", password: "demo-pass-1" }),
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

const api = await wsClient(REST, token);
const objs = (await api.send({ type: "maintenance_supporter/objects" })).objects;
const fleet = objs.find((o) => o.object.battery_fleet || /battery fleet/i.test(o.object.name));
const fleetTask = fleet.tasks[0];
api.close();

const b = await chromium.connect(PW_WS, { timeout: 20000 });

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  window.__deep = deep;
`;

async function session(viewport, prefix, interactions) {
  const ctx = await b.newContext({ viewport, colorScheme: "dark" });
  await ctx.addInitScript(({ t, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: t, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { t: token, ha: HA });
  const p = await ctx.newPage();
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 30; i++) {
    const ok = await p.evaluate(({ finder }) => {
      eval(finder);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }, { finder: deepFindPanel }).catch(() => false);
    if (ok) break;
    await p.waitForTimeout(1000);
  }
  await p.evaluate(({ finder, entryId, taskId }) => {
    eval(finder);
    window.__panel._showTask(entryId, taskId);
  }, { finder: deepFindPanel, entryId: fleet.entry_id, taskId: fleetTask.id });
  await p.waitForTimeout(3000);
  // open the roster (fires toggle → history fetch)
  await p.evaluate(({ finder }) => {
    eval(finder);
    for (const d of window.__deep((el) => el.tagName === "DETAILS")) { d.open = true; d.dispatchEvent(new Event("toggle")); }
  }, { finder: deepFindPanel });
  await p.waitForTimeout(2500);
  for (const [name, action] of interactions) {
    if (action) {
      await p.evaluate(({ finder, sel }) => {
        eval(finder);
        const el = window.__deep((e) => e.matches && e.matches(sel))[0];
        if (el) el.click();
      }, { finder: deepFindPanel, sel: action });
      await p.waitForTimeout(800);
    }
    await p.screenshot({ path: `${OUT}${prefix}${name}.png`, fullPage: false });
    log("SHOT", prefix + name);
  }
  await ctx.close();
}

await session({ width: 1600, height: 1460 }, "review-", [
  ["default", null],
  ["urgency", "button.bf-sort:nth-of-type(2)"],
  ["filter-aaa", "button.bf-type-chip"],
]);
await session({ width: 400, height: 1400 }, "review-mobile-", [["default", null]]);

await b.close();
log("DONE");
