import { chromium } from "@playwright/test";
import fs from "fs";
const HA = "http://ha-maint:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("./live-shots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const token = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8").match(/HA_TOKEN=(\S+)/)[1];
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 5 * 60e3);
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
}, { t: token, ha: HA });
const p = await ctx.newPage();
await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
await p.locator("maintenance-supporter-panel").getByRole("button", { name: /from template|aus vorlage/i }).first().click();
await p.waitForTimeout(2500);
await p.screenshot({ path: OUT + "50-gallery-with-ev.png" });
const text = await p.evaluate(() => {
  const walk = (root, out) => { for (const el of root.querySelectorAll("*")) { if (el.shadowRoot) walk(el.shadowRoot, out); out.push(el.textContent || ""); } return out; };
  return walk(document.querySelector("home-assistant").shadowRoot, []).join(" | ");
});
if (!/Electric Car|Elektroauto/.test(text)) throw new Error("EV template not in gallery");
console.log("gallery shows EV template:", /Elektroauto/.test(text) ? "Elektroauto (de)" : "Electric Car (en)");
console.log("ALL OK");
await ctx.close(); await b.close(); process.exit(0);
