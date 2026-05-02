/**
 * Screenshot the new interactive section cards (Vacation/Budget/Groups)
 * + the existing task quick-actions dialog (after the button-row fix)
 * + the complete-dialog (to investigate the user's "fields are missing" report).
 *
 * Creates a temporary Lovelace dashboard with all three cards, navigates,
 * captures shots in light + dark mode at desktop width.
 */
import { chromium } from "playwright";
import { promises as fs } from "fs";
import http from "http";
import path from "path";

const HA = "http://localhost:8125";
const OUT = path.resolve("../../../screenshots-section-cards");

async function getRefreshToken() {
  function post(p, body, ct = "application/json") {
    return new Promise((resolve, reject) => {
      const data = typeof body === "string" ? body : JSON.stringify(body);
      const opts = {
        hostname: "localhost", port: 8125, path: p, method: "POST",
        headers: { "Content-Type": ct, "Content-Length": Buffer.byteLength(data) },
      };
      const req = http.request(opts, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => resolve(JSON.parse(d)));
      });
      req.on("error", reject);
      req.write(data);
      req.end();
    });
  }
  const flow = await post("/auth/login_flow", {
    client_id: HA + "/", handler: ["homeassistant", null], redirect_uri: HA + "/",
  });
  const auth = await post(`/auth/login_flow/${flow.flow_id}`, {
    client_id: HA + "/", username: "dev", password: "dev",
  });
  const tok = await post(
    "/auth/token",
    `grant_type=authorization_code&code=${auth.result}&client_id=${HA}/`,
    "application/x-www-form-urlencoded",
  );
  return tok.refresh_token;
}

async function ws(page, cmd) {
  return page.evaluate(async (c) => {
    const ha = document.querySelector("home-assistant");
    if (!ha?.hass?.connection) throw new Error("no hass connection");
    return await ha.hass.connection.sendMessagePromise(c);
  }, cmd);
}

async function ensureDashboard(page) {
  const dashboards = await ws(page, { type: "lovelace/dashboards/list" });
  const slug = "section-cards-test";
  const existing = dashboards.find((d) => d.url_path === slug);
  if (!existing) {
    await ws(page, {
      type: "lovelace/dashboards/create",
      url_path: slug,
      title: "Section Cards Test",
      icon: "mdi:test-tube",
      mode: "storage",
      show_in_sidebar: false,
      require_admin: false,
    });
  }
  // Save the lovelace config with our 3 cards
  await ws(page, {
    type: "lovelace/config/save",
    url_path: slug,
    config: {
      views: [
        {
          title: "Sections",
          path: "default",
          icon: "mdi:view-dashboard",
          cards: [
            { type: "custom:maintenance-vacation-section-card" },
            { type: "custom:maintenance-budget-section-card" },
            { type: "custom:maintenance-groups-section-card" },
          ],
        },
        {
          title: "Card",
          path: "card",
          icon: "mdi:card-text",
          cards: [
            { type: "custom:maintenance-supporter-card", show_actions: true, max_items: 6 },
          ],
        },
      ],
    },
  });
  return slug;
}

async function shot(page, name) {
  await page.waitForTimeout(800);
  const file = path.join(OUT, name + ".png");
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  📸 ${name}.png`);
}

async function setColorScheme(page, scheme) {
  // Force HA's theme by injecting localStorage entry + reloading
  await page.evaluate((s) => {
    localStorage.setItem("selectedTheme", JSON.stringify({ dark: s === "dark" }));
  }, scheme);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  console.log("Getting refresh token…");
  const refreshToken = await getRefreshToken();

  const browser = await chromium.launch({ headless: true });

  for (const colorScheme of ["dark", "light"]) {
    console.log(`\n=== ${colorScheme} mode ===`);
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      colorScheme,
      ignoreHTTPSErrors: true,
    });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
    page.on("console", (m) => {
      if (m.type() === "error") console.log("CONSOLE:", m.text());
    });

    await page.goto(HA);
    await page.waitForTimeout(800);
    await page.evaluate((args) => {
      localStorage.setItem("hassTokens", JSON.stringify({
        hassUrl: args.ha, clientId: args.ha + "/",
        refresh_token: args.r, access_token: "",
        token_type: "Bearer", expires_in: 1800, expires: 0,
      }));
      localStorage.setItem("selectedTheme", JSON.stringify({ dark: args.cs === "dark" }));
    }, { ha: HA, r: refreshToken, cs: colorScheme });

    await page.goto(HA);
    await page.waitForTimeout(3500);

    const slug = await ensureDashboard(page);
    await page.goto(`${HA}/${slug}/default`);
    await page.waitForTimeout(4000);

    await shot(page, `sections-${colorScheme}`);

    // Card view — click a task row to open quick-actions dialog
    await page.goto(`${HA}/${slug}/card`);
    await page.waitForTimeout(3500);
    await shot(page, `card-${colorScheme}`);

    // Find the first card .task-item.clickable and click it
    const taskClicked = await page.evaluate(() => {
      // Lovelace path: home-assistant > home-assistant-main > ha-drawer >
      //   partial-panel-resolver > ha-panel-lovelace > hui-root > #view >
      //   hui-view > hui-card > maintenance-supporter-card
      const ha = document.querySelector("home-assistant");
      if (!ha?.shadowRoot) return "no ha";
      const main = ha.shadowRoot.querySelector("home-assistant-main");
      if (!main?.shadowRoot) return "no main";
      const drawer = main.shadowRoot.querySelector("ha-drawer");
      if (!drawer) return "no drawer";
      const partial = drawer.querySelector("partial-panel-resolver");
      if (!partial) return "no partial";
      const lovelace = partial.querySelector("ha-panel-lovelace");
      if (!lovelace?.shadowRoot) return "no lovelace";
      const huiRoot = lovelace.shadowRoot.querySelector("hui-root");
      if (!huiRoot?.shadowRoot) return "no hui-root";
      // Walk every shadow-DOM looking for our card
      function findInAllShadows(root, sel) {
        if (!root) return null;
        if (root.querySelector) {
          const direct = root.querySelector(sel);
          if (direct) return direct;
        }
        const all = root.querySelectorAll ? root.querySelectorAll("*") : [];
        for (const el of all) {
          if (el.shadowRoot) {
            const found = findInAllShadows(el.shadowRoot, sel);
            if (found) return found;
          }
        }
        return null;
      }
      const card = findInAllShadows(huiRoot.shadowRoot, "maintenance-supporter-card");
      if (!card?.shadowRoot) return "no card";
      const row = card.shadowRoot.querySelector(".task-item.clickable");
      if (!row) return "no clickable row";
      row.click();
      return "clicked";
    });

    console.log(`  Task row click: ${taskClicked}`);
    if (taskClicked === "clicked") {
      await page.waitForTimeout(1800);
      await shot(page, `quick-actions-${colorScheme}`);

      // Click the Complete button — it's in the .actions.primary-row of the dialog
      const completeClicked = await page.evaluate(() => {
        const dlg = document.body.querySelector("maintenance-task-quick-actions-dialog");
        if (!dlg?.shadowRoot) return "no quick-actions dialog on body";
        const btns = dlg.shadowRoot.querySelectorAll(".actions.primary-row button");
        // The first button in primary-row IS Complete
        if (btns.length === 0) return "no buttons in primary-row";
        btns[0].click();
        return "clicked: " + (btns[0].textContent || "").trim();
      });
      console.log(`  Complete click: ${completeClicked}`);
      await page.waitForTimeout(2000);
      await shot(page, `complete-dialog-${colorScheme}`);

      // Close everything
      await page.keyboard.press("Escape");
      await page.waitForTimeout(500);
    }

    await ctx.close();
  }

  await browser.close();
  console.log(`\nDone. Screenshots in ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
