/** Issue #124 reproduction — stale-cached strategy entry vs. renamed chunks.
 *
 * Models the update that broke peterb-ART-h's dashboard: a browser that
 * heuristically cached the strategy entry (old, still "fresh") while the
 * content-hashed chunks it imports need revalidation — after the 2.50→2.51
 * file swap the old chunk names 404 and the strategy dashboard dies.
 *
 * The mtime skew on the v2.50 files (entry points backdated 100 days,
 * chunks stamped now) stands in for the fetch-time skew that develops
 * naturally across real browsing sessions: freshness = 10% of
 * (Date − Last-Modified), so the entry stays cache-fresh for days while
 * the chunks revalidate on every navigation.
 *
 * Phases:
 *   A  v2.50 code — open the strategy dashboard, card renders, cache fills
 *   B  swap files to v2.51.1 (HACS-style: delete + re-extract), restart HA,
 *      SAME browser context navigates again → expect the break
 *   C  fresh context (empty cache) on the same v2.51.1 server → works
 *
 * Usage:  REPRO_DIR=<scratchpad> node e2e/cache-repro-124.mjs
 * Needs:  ha-cache-repro on :8135 (docker_ha-net) + playwright-server :3000
 */
import { chromium } from "@playwright/test";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const PORT = 8135;
const REST = `http://127.0.0.1:${PORT}`;
const HA = "http://ha-cache-repro:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = HA + "/";
const D = "maintenance_supporter";
const USER = "demo", PASS = "demo-pass-1";
const DASH = "maint-strat";
const SCRATCH = process.env.REPRO_DIR;
if (!SCRATCH) { console.error("set REPRO_DIR"); process.exit(2); }

const log = (...a) => console.log(...a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))));
process.on("unhandledRejection", (e) => { log("UNHANDLED", String((e && e.stack) || e)); process.exit(2); });
const wd = setTimeout(() => { log("WATCHDOG: run exceeded 12 min"); process.exit(3); }, 12 * 60e3);

const j = async (r) => {
  const t = await r.text();
  try { return JSON.parse(t); } catch { throw new Error(`${r.status} ${r.url.replace(REST, "")} -> ${t.slice(0, 90)}`); }
};

async function token() {
  const status = await fetch(REST + "/api/onboarding").then(j).catch(() => null);
  const haveUser = status === null || (Array.isArray(status) && status.some((x) => x.step === "user" && x.done));
  if (!haveUser) {
    const u = await fetch(REST + "/api/onboarding/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: CID, name: "Demo", username: USER, password: PASS, language: "en" }),
    }).then(j);
    const t = await fetch(REST + "/auth/token", {
      method: "POST",
      body: new URLSearchParams({ grant_type: "authorization_code", code: u.auth_code, client_id: CID }),
    }).then(j);
    const auth = { Authorization: "Bearer " + t.access_token, "Content-Type": "application/json" };
    for (const step of ["core_config", "analytics"]) {
      await fetch(`${REST}/api/onboarding/${step}`, { method: "POST", headers: auth, body: "{}" }).catch(() => {});
    }
    await fetch(`${REST}/api/onboarding/integration`, {
      method: "POST", headers: auth, body: JSON.stringify({ client_id: CID, redirect_uri: CID }),
    }).catch(() => {});
    return t.access_token;
  }
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: USER, password: PASS }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("token exchange failed: " + JSON.stringify(t).slice(0, 120));
  return t.access_token;
}

async function ws(tok) {
  const sock = new WebSocket(REST.replace("http", "ws") + "/api/websocket");
  let id = 1;
  const pending = new Map();
  await new Promise((res, rej) => {
    sock.onerror = rej;
    sock.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.type === "auth_required") sock.send(JSON.stringify({ type: "auth", access_token: tok }));
      else if (m.type === "auth_ok") res();
      else if (m.type === "auth_invalid") rej(new Error("auth invalid"));
      else if (m.type === "result") {
        const p = pending.get(m.id);
        if (p) { pending.delete(m.id); m.success ? p.res(m.result) : p.rej(new Error(JSON.stringify(m.error))); }
      }
    };
  });
  return {
    send: (msg) => new Promise((res, rej) => { const i = id++; pending.set(i, { res, rej }); sock.send(JSON.stringify({ ...msg, id: i })); }),
    close: () => sock.close(),
  };
}

// ── seed: entry + object + a storage dashboard using the strategy ──────────
const tok = await token();
const api = await ws(tok);
const auth = { Authorization: "Bearer " + tok, "Content-Type": "application/json" };
const entries = await fetch(REST + "/api/config/config_entries/entry", { headers: auth }).then(j).catch(() => []);
if (!entries.some((e) => e.domain === D)) {
  const start = await fetch(REST + "/api/config/config_entries/flow", {
    method: "POST", headers: auth, body: JSON.stringify({ handler: D, show_advanced_options: false }),
  }).then(j);
  let res = start;
  if (start.type === "form") {
    res = await fetch(REST + "/api/config/config_entries/flow/" + start.flow_id, {
      method: "POST", headers: auth,
      body: JSON.stringify({ default_warning_days: 7, notifications_enabled: false, notify_service: "" }),
    }).then(j);
  }
  if (res.type !== "create_entry") throw new Error("flow failed: " + JSON.stringify(res).slice(0, 150));
  await new Promise((r) => setTimeout(r, 6000));
}
const objs = (await api.send({ type: `${D}/objects` })).objects;
if (!objs.some((o) => o.object.name === "Repro Boiler")) {
  const res = await api.send({ type: `${D}/object/create`, name: "Repro Boiler" });
  await api.send({
    type: `${D}/task/create`, entry_id: res.entry_id, name: "Descale",
    task_type: "service", schedule_type: "time_based", interval_days: 30,
  });
}
const dashes = await api.send({ type: "lovelace/dashboards/list" });
if (!dashes.some((d) => d.url_path === DASH)) {
  await api.send({
    type: "lovelace/dashboards/create", url_path: DASH, mode: "storage",
    title: "Maint Strategy", show_in_sidebar: true, require_admin: false,
  });
}
await api.send({
  type: "lovelace/config/save", url_path: DASH,
  // The registered strategy type is the hyphenated element name, NOT the
  // python domain: window.customStrategies gets "maintenance-supporter".
  config: { strategy: { type: "custom:maintenance-supporter" } },
});
api.close();
log("SEEDED — strategy dashboard at /" + DASH);

// ── browser ────────────────────────────────────────────────────────────────
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const lines = [];
function trackPage(p, tag) {
  p.on("response", (r) => { const u = r.url(); if (u.includes("maintenance_supporter")) lines.push(`${tag} RESP ${r.status()} ${u.replace(HA, "")}`); });
  p.on("requestfailed", (r) => { const u = r.url(); if (u.includes("maintenance_supporter")) lines.push(`${tag} REQFAIL ${r.failure()?.errorText} ${u.replace(HA, "")}`); });
  p.on("console", (m) => { if (m.type() === "error") lines.push(`${tag} CONSOLE ${m.text().slice(0, 220)}`); });
}
async function inject(ctx) {
  await ctx.addInitScript(({ t, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: t, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { t: tok, ha: HA });
}

const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await inject(ctx);
const p = await ctx.newPage();
trackPage(p, "A");

log("PHASE A — v2.50, warming the cache");
await p.goto(HA + "/" + DASH + "/0", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(15000);
const cardsA = await p.locator("maintenance-supporter-card").count();
await p.screenshot({ path: path.join(SCRATCH, "repro-A-v250.png"), fullPage: false });
log(`A cards=${cardsA}`);

log("SWAP — replacing files with v2.51.1 (HACS-style) + restart");
const live = path.join(SCRATCH, "repro-code-live", "custom_components", D);
// REPRO_NEXT switches the "update target": the broken v2.51.1 release by
// default, or a fixed working tree to verify the cache-busting change.
const next = process.env.REPRO_NEXT || path.join(SCRATCH, "repro-code-2511", "custom_components", D);
fs.rmSync(live, { recursive: true, force: true });
fs.cpSync(next, live, { recursive: true });
execSync("docker restart ha-cache-repro", { stdio: "ignore" });
for (let i = 0; i < 60; i++) {
  const ok = await fetch(REST + "/auth/providers").then((r) => r.ok).catch(() => false);
  if (ok) break;
  await new Promise((r) => setTimeout(r, 3000));
}
await new Promise((r) => setTimeout(r, 25000));
log("HA back up on v2.51.1");

log("PHASE B — SAME browser context navigates again (no hard refresh)");
trackPage(p, "B");
await p.goto(HA + "/" + DASH + "/0", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(15000);
const cardsB = await p.locator("maintenance-supporter-card").count();
await p.screenshot({ path: path.join(SCRATCH, "repro-B-stale.png"), fullPage: false });
log(`B cards=${cardsB}`);
await ctx.close();

log("PHASE C — fresh context (empty cache), same v2.51.1 server");
const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } });
await inject(ctx2);
const p2 = await ctx2.newPage();
trackPage(p2, "C");
await p2.goto(HA + "/" + DASH + "/0", { waitUntil: "domcontentloaded" });
await p2.waitForTimeout(15000);
const cardsC = await p2.locator("maintenance-supporter-card").count();
await p2.screenshot({ path: path.join(SCRATCH, "repro-C-fresh.png"), fullPage: false });
log(`C cards=${cardsC}`);
await ctx2.close();
await b.close();

log("");
log("── network/console trail ──");
for (const l of lines) log(l);
log("");
const fixMode = Boolean(process.env.REPRO_NEXT);
log(`VERDICT: A(v2.50 warm)=${cardsA} B(stale cache after update)=${cardsB} C(fresh cache)=${cardsC}`);
if (fixMode) {
  log(cardsA > 0 && cardsB > 0
    ? "FIX VERIFIED — the same stale-cache session that died on v2.51.1 renders after the update"
    : "FIX NOT CONFIRMED — see trail above");
} else {
  log(cardsA > 0 && cardsB === 0 && cardsC > 0
    ? "REPRODUCED — the stale-entry/renamed-chunk mix kills the strategy dashboard"
    : "NOT reproduced in this form — see trail above");
}
clearTimeout(wd);
process.exit(0);
