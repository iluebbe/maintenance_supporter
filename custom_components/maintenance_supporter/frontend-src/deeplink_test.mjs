import { chromium } from "playwright";

const HA = "http://homeassistant-dev:8123";
const REFRESH = process.env.HA_REFRESH_TOKEN;
if (!REFRESH) { console.error("Set HA_REFRESH_TOKEN env var"); process.exit(1); }

const browser = await chromium.connect("ws://localhost:3000");
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "de" });
const page = await ctx.newPage();

await page.goto(HA);
await page.waitForTimeout(1000);
await page.evaluate((refresh) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    hassUrl: "http://homeassistant-dev:8123",
    clientId: "http://homeassistant-dev:8123/",
    refresh_token: refresh, access_token: "", token_type: "Bearer",
    expires_in: 1800, expires: 0,
  }));
}, REFRESH);

// Test 1: Deep-link with valid entry_id + task_id
console.log("=== Test 1: Valid deep-link ===");
await page.goto(HA + "/maintenance-supporter?entry_id=01KJTX1VHBT6TN5JMF9W6WADTJ&task_id=49c49ecf36204031be94c8f132aa6479");
await page.waitForTimeout(6000);
var url1 = page.url();
console.log("URL after deep-link:", url1);
console.log("Query params cleaned:", !url1.includes("entry_id"));
await page.screenshot({ path: "screenshots/deeplink_valid.png" });

// Test 2: Deep-link with invalid entry_id
console.log("\n=== Test 2: Invalid entry_id ===");
await page.goto(HA + "/maintenance-supporter?entry_id=NONEXISTENT");
await page.waitForTimeout(6000);
var url2 = page.url();
console.log("URL after invalid deep-link:", url2);
console.log("Query params cleaned:", !url2.includes("entry_id"));
await page.screenshot({ path: "screenshots/deeplink_invalid.png" });

// Test 3: Deep-link with valid entry but invalid task
console.log("\n=== Test 3: Invalid task_id ===");
await page.goto(HA + "/maintenance-supporter?entry_id=01KJTX1VHBT6TN5JMF9W6WADTJ&task_id=NONEXISTENT");
await page.waitForTimeout(6000);
var url3 = page.url();
console.log("URL after invalid task deep-link:", url3);
await page.screenshot({ path: "screenshots/deeplink_invalid_task.png" });

await ctx.close();
await browser.close();
console.log("\nDone!");
