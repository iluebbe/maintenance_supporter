/** Pixel-comparison visual regression over the seeded ha-shots demo.
 *
 *  Captures a fixed set of panel surfaces and compares them pixel-by-pixel
 *  (pixelmatch) against committed baselines in e2e/visual-baselines/:
 *
 *    node e2e/visual-regression.mjs                 compare (exit 1 on drift)
 *    VISUAL_UPDATE=1 node e2e/visual-regression.mjs re-baseline (INTENTIONAL
 *                                                   UI changes only — review
 *                                                   the diff images first!)
 *
 *  Tolerance model: the demo seed is date-relative, so absolute dates in
 *  rows drift day by day — each surface allows a small diff budget
 *  (default 1 % of pixels, per-surface override in SURFACES) that absorbs
 *  date digits while still catching the real regression classes: overflow,
 *  overlapping chips, missing sections, broken colors, layout shifts (the
 *  mobile-width battery-roster overflow of 2026-08-04 would have tripped
 *  this at ~8 %). Failures write actual + diff PNGs to
 *  e2e/visual-results/<ts>/ for review.
 *
 *  Path to (near-)exact matching later: seed with FIXED dates + freeze both
 *  clocks (server faketime currently breaks WS auth — see the shots-demo
 *  memory), or mask date-bearing elements with visibility:hidden (keeps
 *  layout). Until then the budget is the honest contract.
 *
 *  Baselines are tied to the shots-demo seed — re-baseline after deliberate
 *  seed changes. Prereqs: seeded ha-shots + playwright-server running.
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const CID = HA + "/";
const BASE = new URL("./visual-baselines/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const OUT = new URL("./visual-results/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")
  + new Date().toISOString().replace(/[:.]/g, "-") + "/";
const UPDATE = process.env.VISUAL_UPDATE === "1";
watchdog(15 * 60e3, "visual regression");
const log = (...a) => console.log(...a);

// name, viewport, budget (max diff-pixel ratio), prepare(page) positions the UI.
const SURFACES = [
  { name: "dashboard", viewport: { width: 1600, height: 1000 }, budget: 0.01, prepare: async (p) => showTab(p, "dashboard") },
  { name: "today", viewport: { width: 1600, height: 1000 }, budget: 0.01, prepare: async (p) => showTab(p, "today") },
  { name: "settings", viewport: { width: 1600, height: 1000 }, budget: 0.005, prepare: async (p) => showTab(p, "settings") },
  { name: "task-detail", viewport: { width: 1600, height: 1200 }, budget: 0.005, prepare: (p) => showTask(p, false) },
  // The trigger chart's x-axis is anchored at NOW, so its curve shifts a
  // little between runs — the bigger budget absorbs that while still
  // catching layout/section breakage around it.
  { name: "task-detail-trigger", viewport: { width: 1600, height: 1200 }, budget: 0.03, prepare: (p) => showTask(p, true) },
  { name: "battery-fleet", viewport: { width: 1600, height: 1460 }, budget: 0.015, prepare: showFleetRoster },
  { name: "mobile-dashboard", viewport: { width: 400, height: 900 }, budget: 0.01, prepare: async (p) => showTab(p, "dashboard") },
];

const j = (r) => r.json();
async function login() {
  const f = await fetch(REST + "/auth/login_flow", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, handler: ["homeassistant", null], redirect_uri: CID }),
  }).then(j);
  const s = await fetch(REST + "/auth/login_flow/" + f.flow_id, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CID, username: "demo", password: "demo-pass-1" }),
  }).then(j);
  const t = await fetch(REST + "/auth/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "authorization_code", code: s.result, client_id: CID }),
  }).then(j);
  if (!t.access_token) throw new Error("login failed");
  return t.access_token;
}

const FINDER = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  window.__deep = deep;
`;

async function mountPanel(page) {
  await page.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 30; i++) {
    const ok = await page.evaluate(({ f }) => {
      eval(f);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }, { f: FINDER }).catch(() => false);
    if (ok) return;
    await page.waitForTimeout(1000);
  }
  throw new Error("panel did not mount");
}

async function showTab(page, tab) {
  await page.evaluate(({ f, tab: t2 }) => {
    eval(f);
    window.__panel._view = "overview";
    window.__panel._overviewTab = t2;
  }, { f: FINDER, tab });
  await page.waitForTimeout(1500);
}

async function showTask(page, withTrigger) {
  await page.evaluate(({ f, wt }) => {
    eval(f);
    const objs = [...window.__panel._objects].sort((a, b) => a.object.name.localeCompare(b.object.name));
    for (const o of objs) {
      if (o.tasks.some((t) => t.battery_fleet_task)) continue;
      const task = [...o.tasks].sort((a, b) => a.name.localeCompare(b.name)).find((t) => wt === !!t.trigger_config);
      if (task) { window.__panel._showTask(o.entry_id, task.id); return; }
    }
    throw new Error("no matching task in the seed");
  }, { f: FINDER, wt: withTrigger });
  await page.waitForTimeout(3000);
}

async function showFleetRoster(page) {
  await page.evaluate(({ f }) => {
    eval(f);
    // The object-level battery_fleet flag doesn't ride in the objects
    // response — the task-level battery_fleet_task marker does.
    const fleet = window.__panel._objects.find((o) => (o.tasks || []).some((t) => t.battery_fleet_task));
    if (!fleet) throw new Error("no fleet object in the seed");
    const task = fleet.tasks.find((t) => t.battery_fleet_task);
    window.__panel._showTask(fleet.entry_id, task.id);
  }, { f: FINDER });
  await page.waitForTimeout(3000);
  await page.evaluate(({ f }) => {
    eval(f);
    for (const d of window.__deep((el) => el.tagName === "DETAILS")) { d.open = true; d.dispatchEvent(new Event("toggle")); }
  }, { f: FINDER });
  await page.waitForTimeout(2500);
}

function compare(name, actualBuf, budget) {
  const basePath = BASE + name + ".png";
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(BASE, { recursive: true });
    fs.writeFileSync(basePath, actualBuf);
    return { status: "baseline-created" };
  }
  const base = PNG.sync.read(fs.readFileSync(basePath));
  const actual = PNG.sync.read(actualBuf);
  if (base.width !== actual.width || base.height !== actual.height) {
    return { status: "size-mismatch", detail: `${base.width}x${base.height} -> ${actual.width}x${actual.height}` };
  }
  const diff = new PNG({ width: base.width, height: base.height });
  const bad = pixelmatch(base.data, actual.data, diff.data, base.width, base.height, { threshold: 0.1 });
  const ratio = bad / (base.width * base.height);
  if (ratio > budget) {
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(OUT + name + "-actual.png", actualBuf);
    fs.writeFileSync(OUT + name + "-diff.png", PNG.sync.write(diff));
    return { status: "FAIL", ratio, budget };
  }
  return { status: "ok", ratio, budget };
}

const token = await login();
const b = await chromium.connect(PW_WS, { timeout: 20000 });
let failures = 0;

for (const s of SURFACES) {
  const ctx = await b.newContext({ viewport: s.viewport, colorScheme: "dark", reducedMotion: "reduce" });
  await ctx.addInitScript(({ t, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: t, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { t: token, ha: HA });
  const page = await ctx.newPage();
  try {
    await mountPanel(page);
    await s.prepare(page);
    const buf = await page.screenshot({ animations: "disabled", caret: "hide" });
    if (UPDATE) {
      fs.mkdirSync(BASE, { recursive: true });
      fs.writeFileSync(BASE + s.name + ".png", buf);
      log(`UPDATED  ${s.name}`);
    } else {
      const r = compare(s.name, buf, s.budget);
      if (r.status === "FAIL" || r.status === "size-mismatch") {
        failures++;
        log(`FAIL     ${s.name}  ${r.status === "size-mismatch" ? r.detail : `diff ${(r.ratio * 100).toFixed(2)} % > budget ${(r.budget * 100).toFixed(1)} %`}`);
      } else if (r.status === "baseline-created") {
        log(`NEW      ${s.name}  baseline written (review + commit it)`);
      } else {
        log(`ok       ${s.name}  diff ${(r.ratio * 100).toFixed(3)} % (budget ${(r.budget * 100).toFixed(1)} %)`);
      }
    }
  } catch (e) {
    failures++;
    log(`ERROR    ${s.name}  ${String(e).slice(0, 120)}`);
  }
  await ctx.close();
}

await b.close();
if (failures) {
  log(`\n${failures} surface(s) drifted — diffs in ${OUT}`);
  log("Intentional UI change? Review the diffs, then: VISUAL_UPDATE=1 node e2e/visual-regression.mjs");
  process.exit(1);
}
log("\nall surfaces match");
