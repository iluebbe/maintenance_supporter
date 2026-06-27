/**
 * Global setup: bring a freshly-booted Home Assistant to a known state so the
 * specs can focus on user stories.
 *
 *   1. Onboard (create owner) if the instance is pristine, else log in.
 *   2. Ensure the maintenance_supporter integration is set up (one global entry).
 *   3. Save an authenticated storageState (hassTokens in localStorage) that
 *      every spec reuses, so no test has to log in.
 *
 * REST/onboarding runs from this Node process (E2E_HA_REST_URL); the browser
 * uses E2E_HA_URL. They differ only when driving a browser inside docker.
 */
import { chromium, type FullConfig } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { createStrategyDashboard, waitForHass, ws, STRATEGY_DASH } from "./helpers";

const HA = process.env.E2E_HA_URL || "http://localhost:8123";
const REST = process.env.E2E_HA_REST_URL || HA;
const PW_WS = process.env.E2E_PW_WS || "";
const REST_CID = REST + "/";
const USER = "e2e";
const PASS = "e2e-passw0rd";

const j = (r: Response) => r.json() as Promise<any>;

async function exchange(code: string): Promise<string> {
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: REST_CID }),
  }).then(j);
  if (!t.access_token) throw new Error("token exchange failed: " + JSON.stringify(t));
  return t.access_token;
}

async function login(): Promise<string> {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: REST_CID, handler: ["homeassistant", null], redirect_uri: REST_CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: REST_CID, username: USER, password: PASS }),
  }).then(j);
  if (s.type !== "create_entry") throw new Error("login failed: " + JSON.stringify(s));
  return exchange(s.result);
}

async function onboardOrLogin(): Promise<string> {
  const status = await fetch(REST + "/api/onboarding").then(j).catch(() => null);
  const done = Array.isArray(status) && status.every((x: any) => x.done);
  if (done) return login();

  const u = await fetch(REST + "/api/onboarding/users", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: REST_CID, name: "E2E", username: USER, password: PASS, language: "en" }),
  }).then(j);
  if (!u.auth_code) throw new Error("onboarding/users failed: " + JSON.stringify(u));
  const token = await exchange(u.auth_code);
  const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const steps: [string, object][] = [
    ["core_config", {}],
    ["analytics", {}],
    ["integration", { client_id: REST_CID, redirect_uri: REST_CID + "?auth_callback=1" }],
  ];
  for (const [step, body] of steps) {
    const r = await fetch(REST + "/api/onboarding/" + step, { method: "POST", headers: auth, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`onboarding/${step} -> HTTP ${r.status}`);
  }
  return token;
}

async function ensureIntegration(token: string): Promise<void> {
  const auth = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
  const entries = await fetch(REST + "/api/config/config_entries/entry", { headers: auth }).then(j).catch(() => []);
  if (Array.isArray(entries) && entries.some((e: any) => e.domain === "maintenance_supporter")) return;
  const start = await fetch(REST + "/api/config/config_entries/flow", {
    method: "POST", headers: auth,
    body: JSON.stringify({ handler: "maintenance_supporter", show_advanced_options: false }),
  }).then(j);
  let res = start;
  if (start.type === "form") {
    res = await fetch(REST + "/api/config/config_entries/flow/" + start.flow_id, {
      method: "POST", headers: auth,
      body: JSON.stringify({ default_warning_days: 7, notifications_enabled: false, notify_service: "" }),
    }).then(j);
  }
  if (res.type !== "create_entry") throw new Error("integration flow failed: " + JSON.stringify(res));
  await new Promise((r) => setTimeout(r, 5000)); // let setup register WS + frontend
}

export default async function globalSetup(_config: FullConfig) {
  const token = await onboardOrLogin();
  await ensureIntegration(token);

  const browser = PW_WS
    ? await chromium.connect(PW_WS, { timeout: 20_000 })
    : await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
  const ctx = await browser.newContext();
  await ctx.addInitScript(({ t, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: t, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { t: token, ha: HA });
  const page = await ctx.newPage();
  await page.goto(HA + "/lovelace", { waitUntil: "domcontentloaded" });
  await waitForHass(page);
  // The sidebar panel (/maintenance-supporter) is off by default — enable it so
  // the panel-driven lifecycle spec can reach it. Flipping panel_enabled fires
  // async_register_panel(force=True) on the backend.
  await ws(page, { type: "maintenance_supporter/global/update", settings: { panel_enabled: true } }).catch(() => {});
  await page.waitForTimeout(2500); // let the panel register
  // One shared strategy dashboard that every spec navigates to (empty-state
  // when there are no objects, populated once a spec seeds them).
  await createStrategyDashboard(page, STRATEGY_DASH);
  const authDir = path.join(__dirname, ".auth");
  fs.mkdirSync(authDir, { recursive: true });
  await ctx.storageState({ path: path.join(authDir, "state.json") });
  await browser.close();
}
