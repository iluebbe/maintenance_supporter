/** ONE measurement run for the panel-perf harness — its own process.
 *
 *  perf-panel.mjs spawns this once per run: a fresh short-lived process with
 *  a fresh playwright connection is the empirically reliable shape (the
 *  long-lived multi-run connection wedged its page channel 5/5 times on
 *  2026-08-04/05; single-shot probes worked 4/4). Prints ONE JSON line.
 *
 *  Env: PERF_TOKEN (required), HA_URL, HA_BROWSER_URL, PERF_SETTLE_MS.
 */
import { chromium } from "@playwright/test";
import fs from "fs";

const HA = process.env.HA_BROWSER_URL || "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const TOKEN = process.env.PERF_TOKEN;
const SETTLE = parseInt(process.env.PERF_SETTLE_MS || "15000", 10);
setTimeout(() => { console.error("run watchdog"); process.exit(3); }, 5 * 60e3).unref();

const src = fs.readFileSync(new URL("./perf-panel.mjs", import.meta.url), "utf-8");
const INIT = src
  .match(/const INIT = \`([\s\S]*?)\`;/)[1]
  .replace("__PERF_SCROLL__", process.env.PERF_SCROLL === "1" ? "true" : "false");

const withTimeout = (p, ms, fb) => Promise.race([p, new Promise((r) => setTimeout(() => r(fb), ms))]);

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
await ctx.addInitScript(({ tk, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: tk, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
}, { tk: TOKEN, ha: HA });
await ctx.addInitScript(INIT);
const page = await ctx.newPage();

async function loadOnce() {
  await page.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(SETTLE);
  return withTimeout(page.evaluate(() => {
    const bundle = performance.getEntriesByType("resource").find((r) => /maintenance-panel\.js/.test(r.name));
    return {
      marks: window.__perf.marks,
      ws: window.__perf.ws,
      long: window.__perf.long,
      bundle: bundle ? { ms: Math.round(bundle.duration), kb: Math.round((bundle.transferSize || bundle.encodedBodySize || 0) / 1024) } : null,
      scroll: window.__scrollResult || null,
    };
  }), 30000, null);
}

const cold = await loadOnce();
const scrollRes = (cold && cold.scroll) || { frames: [], renderedRows: -1, dataTasks: -1 };

let warm = null;
if (process.env.PERF_WARM === "1") {
  try {
    await page.reload({ waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(SETTLE);
    warm = await withTimeout(page.evaluate(() => ({ marks: window.__perf.marks })), 30000, null);
  } catch {
    warm = null;
  }
}

console.log(JSON.stringify({ cold, warm, scroll: { frames: scrollRes.frames, layout: 0, recalc: 0, scriptMs: 0 }, tabs: { toToday: null, toDashboard: null }, dom: { renderedRows: scrollRes.renderedRows, dataTasks: scrollRes.dataTasks } }));
await b.close();
process.exit(0);
