/**
 * Shared helpers for Playwright E2E tests.
 *
 * Usage:
 *   import { setup, ws, panelSR, cleanup } from "./e2e-helpers.mjs";
 *   const { browser, page } = await setup({ mobile: false });
 */
import { chromium } from "playwright";

const HA = "http://homeassistant-dev:8123";

export async function getRefreshToken() {
  const http = await import("http");
  function post(path, body, contentType = "application/json") {
    return new Promise((resolve, reject) => {
      const data = typeof body === "string" ? body : JSON.stringify(body);
      const opts = {
        hostname: "localhost", port: 8125, path, method: "POST",
        headers: { "Content-Type": contentType, "Content-Length": Buffer.byteLength(data) },
      };
      const req = http.request(opts, (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => resolve(JSON.parse(d)));
      });
      req.on("error", reject);
      req.write(data);
      req.end();
    });
  }
  const flow = await post("/auth/login_flow", { client_id: `${HA}/`, handler: ["homeassistant", null], redirect_uri: `${HA}/` });
  const auth = await post(`/auth/login_flow/${flow.flow_id}`, { client_id: `${HA}/`, username: "dev", password: "dev" });
  const tokens = await post("/auth/token", `grant_type=authorization_code&code=${auth.result}&client_id=${HA}/`, "application/x-www-form-urlencoded");
  return tokens.refresh_token;
}

export async function setup({ mobile = false, timezone = undefined } = {}) {
  const refreshToken = process.env.HA_REFRESH_TOKEN || await getRefreshToken();
  const browser = await chromium.connect("ws://localhost:3000");
  const ctxOpts = {
    viewport: mobile ? { width: 375, height: 812 } : { width: 1280, height: 900 },
    locale: "en-US",
    colorScheme: "dark",
    ...(mobile ? { isMobile: true } : {}),
    ...(timezone ? { timezoneId: timezone } : {}),
  };
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();

  await page.goto(HA);
  await page.waitForTimeout(1000);
  await page.evaluate((args) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      hassUrl: args.ha, clientId: args.ha + "/",
      refresh_token: args.r, access_token: "",
      token_type: "Bearer", expires_in: 1800, expires: 0,
    }));
  }, { ha: HA, r: refreshToken });
  await page.goto(HA + "/maintenance-supporter");
  await page.waitForTimeout(7000);

  return { browser, ctx, page };
}

export async function ws(page, cmd) {
  return page.evaluate(async (c) => {
    const ha = document.querySelector("home-assistant");
    if (!ha?.hass?.connection) throw new Error("no hass connection");
    return ha.hass.connection.sendMessagePromise(c);
  }, cmd);
}

export function panelSR(page) {
  return page.evaluate(() => {
    const ha = document.querySelector("home-assistant");
    const main = ha?.shadowRoot?.querySelector("home-assistant-main");
    const drawer = main?.shadowRoot?.querySelector("ha-drawer");
    const resolver = drawer?.querySelector("partial-panel-resolver");
    const custom = resolver?.querySelector("ha-panel-custom");
    const panel = custom?.querySelector("maintenance-supporter-panel");
    return !!panel?.shadowRoot;
  });
}

const PANEL_EVAL = "window._ha=document.querySelector('home-assistant');window._main=_ha.shadowRoot.querySelector('home-assistant-main');window._drawer=_main.shadowRoot.querySelector('ha-drawer');window._resolver=_drawer.querySelector('partial-panel-resolver');window._custom=_resolver.querySelector('ha-panel-custom');window._panel=_custom.querySelector('maintenance-supporter-panel');window._sr=_panel.shadowRoot;";

export async function openEditDialog(page, entryId, task) {
  await page.evaluate(({ eid, task, fn }) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog").openEdit(eid, task);
  }, { eid: entryId, task, fn: PANEL_EVAL });
  await page.waitForTimeout(1500);
}

export async function readDialogSelects(page) {
  return page.evaluate(({ fn }) => {
    eval(fn);
    const dlgSr = window._sr?.querySelector("maintenance-task-dialog")?.shadowRoot;
    if (!dlgSr) return [];
    return [...dlgSr.querySelectorAll("select")].map((sel) => {
      const label = sel.closest(".select-row")?.querySelector("label")?.textContent?.trim() || "unknown";
      const selected = [...sel.options].find((o) => o.selected);
      return { label, value: sel.value, selectedValue: selected?.value, match: sel.value === selected?.value };
    });
  }, { fn: PANEL_EVAL });
}

export async function readDialogFields(page) {
  return page.evaluate(({ fn }) => {
    eval(fn);
    const dlgSr = window._sr?.querySelector("maintenance-task-dialog")?.shadowRoot;
    if (!dlgSr) return [];
    return [...dlgSr.querySelectorAll("ha-textfield")].map((f) => ({
      label: f.getAttribute("label"), type: f.getAttribute("type"), value: f.value,
    }));
  }, { fn: PANEL_EVAL });
}

export async function cleanup(browser, ctx) {
  try { await ctx.close(); } catch { /* ignore */ }
  try { await browser.close(); } catch { /* ignore */ }
}
