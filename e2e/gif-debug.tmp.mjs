import { chromium } from "@playwright/test";
const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", CID = REST + "/";
const j = (r) => r.json();
const f1 = await fetch(REST + "/auth/login_flow", { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }) }).then(j);
const s = await fetch(REST + "/auth/login_flow/" + f1.flow_id, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ client_id: CID, username: "demo", password: "demo-pass-1" }) }).then(j);
const t = await fetch(REST + "/auth/token", { method: "POST",
  body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }) }).then(j);
console.log("token ok:", !!t.access_token);
const b = await chromium.connect("ws://127.0.0.1:3000/");
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage();
await p.addInitScript(({ tok, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({ access_token: tok, token_type: "Bearer", expires_in: 1800, hassUrl: ha, clientId: ha + "/", expires: Date.now() + 1800e3, refresh_token: "x" }));
}, { tok: t.access_token, ha: HA });
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
await p.waitForTimeout(8000);
console.log("url:", p.url());
console.log("title:", await p.title());
const probe = await p.evaluate(() => {
  const haEl = document.querySelector("home-assistant");
  const main = haEl?.shadowRoot?.querySelector("home-assistant-main");
  return { hasHa: !!haEl, hasMain: !!main, body: document.body.innerText.slice(0, 120) };
});
console.log(JSON.stringify(probe));
await p.screenshot({ path: "C:/tmp/pw/gif-debug.png" });
await b.close();
