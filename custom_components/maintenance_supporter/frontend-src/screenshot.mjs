import { chromium } from "playwright";

const HA = "http://homeassistant-dev:8123";
const REFRESH = process.env.HA_REFRESH_TOKEN;
if (!REFRESH) { console.error("Set HA_REFRESH_TOKEN env var"); process.exit(1); }

const browser = await chromium.connect("ws://localhost:3000");

function getPanel() {
  return "var ha = document.querySelector('home-assistant'); " +
    "var main = ha && ha.shadowRoot && ha.shadowRoot.querySelector('home-assistant-main'); " +
    "var drawer = main && main.shadowRoot && main.shadowRoot.querySelector('ha-drawer'); " +
    "var resolver = drawer && drawer.querySelector('partial-panel-resolver'); " +
    "var custom = resolver && resolver.querySelector('ha-panel-custom'); " +
    "var p = custom && custom.querySelector('maintenance-supporter-panel'); ";
}

async function login(page) {
  await page.goto(HA);
  await page.waitForTimeout(1000);
  await page.evaluate((refresh) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      hassUrl: "http://homeassistant-dev:8123",
      clientId: "http://homeassistant-dev:8123/",
      refresh_token: refresh,
      access_token: "",
      token_type: "Bearer",
      expires_in: 1800,
      expires: 0,
    }));
  }, REFRESH);
  await page.goto(HA + "/maintenance-supporter");
  await page.waitForTimeout(6000);
}

// Desktop screenshot (1280x900)
const desktopCtx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "de" });
const desktopPage = await desktopCtx.newPage();
await login(desktopPage);

var info = await desktopPage.evaluate("{ " + getPanel() +
  "var result = []; " +
  "if (p && p._objects) { " +
  "  for (var i = 0; i < p._objects.length; i++) { " +
  "    var obj = p._objects[i]; " +
  "    var tasks = []; " +
  "    if (obj.tasks) for (var j = 0; j < obj.tasks.length; j++) tasks.push({ id: obj.tasks[j].id }); " +
  "    result.push({ entry_id: obj.entry_id, tasks: tasks }); " +
  "  } " +
  "} " +
  "JSON.stringify(result); " +
  "}");
var data = JSON.parse(info);
var entryId = data[0].entry_id;
var taskId = data[0].tasks[0].id;

// Desktop: task detail
await desktopPage.evaluate("{ " + getPanel() + "if (p) p._showTask('" + entryId + "', '" + taskId + "'); }");
await desktopPage.waitForTimeout(2000);
await desktopPage.screenshot({ path: "screenshots/desktop_task.png" });
console.log("Desktop task detail done");

// Desktop: overview
await desktopPage.evaluate("{ " + getPanel() + "if (p) p._showOverview(); }");
await desktopPage.waitForTimeout(2000);
await desktopPage.screenshot({ path: "screenshots/desktop_overview.png" });
console.log("Desktop overview done");

await desktopCtx.close();

// Mobile screenshot (375x812, iPhone-like)
const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 }, locale: "de", isMobile: true });
const mobilePage = await mobileCtx.newPage();
await login(mobilePage);

// Mobile: overview
await mobilePage.screenshot({ path: "screenshots/mobile_overview.png" });
console.log("Mobile overview done");

// Mobile: task detail
await mobilePage.evaluate("{ " + getPanel() + "if (p) p._showTask('" + entryId + "', '" + taskId + "'); }");
await mobilePage.waitForTimeout(2000);
await mobilePage.screenshot({ path: "screenshots/mobile_task.png" });
console.log("Mobile task detail done");

await mobileCtx.close();
await browser.close();
console.log("All screenshots done!");
