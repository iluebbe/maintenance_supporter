import { chromium } from "@playwright/test";
const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", CID = REST + "/";
const j = (r) => r.json();
const f1 = await fetch(REST + "/auth/login_flow", { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }) }).then(j);
const s = await fetch(REST + "/auth/login_flow/" + f1.flow_id, { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ client_id: CID, username: "demo", password: "demo-pass-1" }) }).then(j);
const t = await fetch(REST + "/auth/token", { method: "POST",
  body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }) }).then(j);
const b = await chromium.connect("ws://127.0.0.1:3000/", { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage();
await p.addInitScript(({ tok, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({ access_token: tok, token_type: "Bearer", expires_in: 1800, hassUrl: ha, clientId: ha + "/", expires: Date.now() + 1800e3, refresh_token: "x" }));
}, { tok: t.access_token, ha: HA });
await p.goto(HA + "/demo-cards", { waitUntil: "domcontentloaded", timeout: 30000 });
await p.waitForTimeout(4000);
if (p.url().includes("/auth/authorize")) {
  await p.locator('input[name="username"]').first().fill("demo");
  await p.locator('input[name="password"]').first().fill("demo-pass-1");
  await p.locator("mwc-button, ha-button, button", { hasText: /log in/i }).first().click();
  await p.waitForTimeout(5000);
  if (!p.url().includes("demo-cards")) await p.goto(HA + "/demo-cards", { waitUntil: "domcontentloaded" });
}
await p.waitForTimeout(9000);
const probe = await p.evaluate(() => {
  const tags = new Map();
  const stack = [document.documentElement];
  let n = 0, calCard = null;
  while (stack.length && n < 200000) {
    const el = stack.pop(); n++;
    if (!el || !el.tagName) continue;
    const tg = el.tagName;
    if (tg.includes("MAINTENANCE") || tg.includes("HUI-ERROR") || tg === "HUI-CARD") tags.set(tg, (tags.get(tg) || 0) + 1);
    if (tg === "MAINTENANCE-SUPPORTER-CALENDAR-CARD") calCard = el;
    if (el.shadowRoot) stack.push(...el.shadowRoot.children);
    stack.push(...el.children);
  }
  return {
    url: location.pathname, nodes: n, tags: [...tags.entries()],
    calDefined: !!customElements.get("maintenance-supporter-calendar-card"),
    calSelects: calCard ? calCard.shadowRoot?.querySelectorAll("select").length : null,
    errText: document.querySelector("hui-error-card")?.textContent || null,
  };
});
console.log(JSON.stringify(probe));
await b.close();
