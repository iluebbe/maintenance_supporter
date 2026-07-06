/** Live check: template-gallery curation (v2.21) — toggle in Settings hides
 *  the template from the panel gallery. */
import { chromium } from "@playwright/test";
import fs from "fs";
const HA = "http://ha-maint:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("./live-shots/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
fs.mkdirSync(OUT, { recursive: true });
const token = fs.readFileSync(new URL("../docker/.env", import.meta.url), "utf-8").match(/HA_TOKEN=(\S+)/)[1];
const log = (...a) => console.log(...a);
setTimeout(() => { console.error("WATCHDOG"); process.exit(3); }, 6 * 60e3);

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
await p.waitForTimeout(9000);
const panel = p.locator("maintenance-supporter-panel");

// Open the Settings tab via the UI (localStorage only remembers today/calendar).
await panel.locator("div.tab", { hasText: /settings|einstellungen/i }).first().click();
await p.waitForTimeout(2500);

// Settings → Template gallery section: untick "Motorcycle".
const section = p.locator('[data-section="templates"]');
await section.scrollIntoViewIfNeeded();
await p.waitForTimeout(800);
await p.screenshot({ path: OUT + "30-settings-template-toggles.png" });
log("shot 30 (template toggle section)");
const row = section.locator("label.setting-row").filter({ hasText: "Motorcycle" });
await row.locator("input").click();
await p.waitForTimeout(2500); // global/update + settings reload
await p.screenshot({ path: OUT + "31-motorcycle-unticked.png" });
log("motorcycle unticked");

// Gallery: "From template" must NOT offer Motorcycle anymore.
await p.reload({ waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
await p.locator("maintenance-supporter-panel").getByRole("button", { name: /from template|aus vorlage/i }).first().click();
await p.waitForTimeout(2500);
await p.screenshot({ path: OUT + "32-gallery-without-motorcycle.png" });
const text = await p.evaluate(() => {
  const walk = (root, out) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.shadowRoot) walk(el.shadowRoot, out);
      out.push(el.textContent || "");
    }
    return out;
  };
  return walk(document.querySelector("home-assistant").shadowRoot, []).join(" | ");
});
if (/Motorcycle/.test(text)) throw new Error("Motorcycle still visible in gallery");
if (!/Bicycle/.test(text)) throw new Error("gallery seems empty — Bicycle missing too");
log("gallery hides Motorcycle, keeps Bicycle");

// Re-enable (leave the dev instance clean).
await p.reload({ waitUntil: "domcontentloaded" });
await p.waitForTimeout(8000);
await p.locator("maintenance-supporter-panel").locator("div.tab", { hasText: /settings|einstellungen/i }).first().click();
await p.waitForTimeout(2500);
const section2 = p.locator('[data-section="templates"]');
await section2.scrollIntoViewIfNeeded();
await section2.locator("label.setting-row").filter({ hasText: "Motorcycle" }).locator("input").click();
await p.waitForTimeout(2000);
log("ALL OK (re-enabled)");
await ctx.close(); await b.close(); process.exit(0);
