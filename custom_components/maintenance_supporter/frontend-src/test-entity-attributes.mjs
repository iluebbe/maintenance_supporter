/**
 * Quick Playwright test for entity attribute introspection.
 * Run from frontend-src: node test-entity-attributes.mjs
 */
import { chromium } from "playwright";

const HA_URL = "http://homeassistant-dev:8123";

async function main() {
  const browser = await chromium.connect("ws://localhost:3000");
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to HA
  await page.goto(HA_URL);
  await page.waitForTimeout(2000);

  // Check if we need to login
  const url = page.url();
  console.log("Current URL:", url);

  if (url.includes("/auth/authorize") || url.includes("onboarding")) {
    // Try auto-login - look for login form
    const loginField = await page.$('input[name="username"]');
    if (loginField) {
      await loginField.fill("dev");
      const pwField = await page.$('input[name="password"]');
      if (pwField) {
        await pwField.fill("dev");
        await page.click('mwc-button, button[type="submit"], ha-button');
        await page.waitForTimeout(3000);
      }
    }
  }

  console.log("After login URL:", page.url());

  // Test the WS endpoint via browser console
  const result = await page.evaluate(async () => {
    // Access hass object
    const ha = document.querySelector("home-assistant");
    if (!ha || !ha.hass) {
      return { error: "No hass object found" };
    }

    // Test entity/attributes endpoint
    try {
      const res = await ha.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/entity/attributes",
        entity_id: "sensor.sun_solar_elevation",
      });
      return { success: true, result: res };
    } catch (e) {
      return { error: e.message || String(e) };
    }
  });

  console.log("\n=== Entity Attributes WS Test ===");
  console.log(JSON.stringify(result, null, 2));

  // Test with a non-existent entity to verify graceful handling
  const result2 = await page.evaluate(async () => {
    const ha = document.querySelector("home-assistant");
    try {
      const res = await ha.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/entity/attributes",
        entity_id: "climate.nonexistent",
      });
      return { success: true, result: res };
    } catch (e) {
      return { error: e.message || String(e) };
    }
  });

  console.log("\n=== Non-existent Entity Test ===");
  console.log(JSON.stringify(result2, null, 2));

  // Check binary_sensor entities
  const binarySensors = await page.evaluate(async () => {
    const ha = document.querySelector("home-assistant");
    if (!ha || !ha.hass) return { error: "No hass" };
    const states = ha.hass.states;
    const ms = {};
    for (const [k, v] of Object.entries(states)) {
      if (k.includes("maintenance")) {
        ms[k] = { state: v.state, attributes: v.attributes };
      }
    }
    return ms;
  });

  console.log("\n=== Maintenance Entities ===");
  console.log(JSON.stringify(binarySensors, null, 2));

  // Navigate to panel and test the UI
  await page.goto(HA_URL + "/maintenance_supporter_panel");
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({ path: "/tmp/panel-test.png", fullPage: true });
  console.log("\nScreenshot saved to /tmp/panel-test.png");

  await context.close();
  await browser.close();

  console.log("\n=== All tests completed ===");
}

main().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
