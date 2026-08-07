// One-off: eyeball the #125 header on ha-shots (menu closed + open).
import { chromium } from "@playwright/test";
const HA = "http://ha-shots:8123";
const REST = "http://127.0.0.1:8131";
const CID = HA + "/";
const j = (r) => r.json();
const f = await fetch(REST + "/auth/login_flow", { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }) }).then(j);
const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ client_id: CID, username: "demo", password: "demo-pass-1" }) }).then(j);
const t = await fetch(REST + "/auth/token", { method: "POST",
  body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }) }).then(j);
const b = await chromium.connect("ws://127.0.0.1:3000/", { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1500, height: 900 }, colorScheme: "dark" });
await ctx.addInitScript(({ tk, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({ access_token: tk, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "" }));
  localStorage.setItem("msp-overview-tab", "dashboard");
}, { tk: t.access_token, ha: HA });
const p = await ctx.newPage();
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
await p.screenshot({ path: process.env.SHOT1 || "h1.png" });
await p.evaluate(() => {
  const panel = document.querySelector("home-assistant")?.shadowRoot
    ?.querySelector("home-assistant-main")?.shadowRoot
    ?.querySelector("ha-drawer partial-panel-resolver ha-panel-custom maintenance-supporter-panel");
  panel.shadowRoot.querySelector(".new-menu-button")?.click();
});
await p.waitForTimeout(1200);
await p.screenshot({ path: process.env.SHOT2 || "h2.png" });
await ctx.close(); await b.close();
console.log("header shots done");
