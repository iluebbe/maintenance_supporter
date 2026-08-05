/** Fresh-context probe for the #124 harness: N cold loads of the strategy
 *  dashboard on whatever ha-cache-repro currently serves. Distinguishes a
 *  fix regression from the long-known cold-load whenDefined race (which the
 *  self-heal shim recovers a few seconds later).
 *
 *  Usage: ROUNDS=3 SETTLE=30000 node e2e/cache-repro-124-fresh.mjs
 */
import { chromium } from "@playwright/test";

const REST = "http://127.0.0.1:8135";
const HA = "http://ha-cache-repro:8123";
const CID = HA + "/";
const USER = "demo", PASS = "demo-pass-1";
const ROUNDS = Number(process.env.ROUNDS || 3);
const SETTLE = Number(process.env.SETTLE || 30000);

const j = (r) => r.json();
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
if (!t.access_token) { console.log("login failed"); process.exit(2); }

const b = await chromium.connect("ws://127.0.0.1:3000/", { timeout: 20000 });
for (let i = 1; i <= ROUNDS; i++) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(({ tok, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: tok, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { tok: t.access_token, ha: HA });
  const p = await ctx.newPage();
  const events = [];
  p.on("response", (r) => { if (r.url().includes("maintenance_supporter")) events.push(`${r.status()} ${r.url().replace(HA, "")}`); });
  await p.goto(HA + "/maint-strat/0", { waitUntil: "domcontentloaded" });
  const half = await p.locator("maintenance-supporter-card").count().catch(() => -1);
  await p.waitForTimeout(SETTLE);
  const cards = await p.locator("maintenance-supporter-card").count();
  // Second visit in the same (now warm) context — distinguishes "cold-load
  // race lost this once" from "this server state cannot render the card".
  await p.goto(HA + "/maint-strat/0", { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(8000);
  const revisit = await p.locator("maintenance-supporter-card").count();
  console.log(`round ${i}: cards(early)=${half} cards(after ${SETTLE / 1000}s)=${cards} revisit=${revisit}`);
  for (const e of events) console.log("   ", e);
  await ctx.close();
}
await b.close();
