/** Panel load + scroll performance benchmark (measure first, optimize second).
 *
 *  Runs against a seeded instance (node e2e/perf-seed.mjs first — 160 tasks
 *  at prod scale) and reports, per run and as a median of PERF_RUNS:
 *
 *   load    cold + warm timeline: nav → panel element → data loaded → first
 *           task row painted; bundle transfer size/duration (resource timing)
 *   ws      per-command duration + payload bytes (connection wrapped BEFORE
 *           the panel loads, via window.hassConnection)
 *   long    long tasks (>50 ms main-thread blocks) during load
 *   scroll  rAF frame times while programmatically scrolling the task list:
 *           p50/p95/max frame ms, frames >50 ms, effective fps — plus CDP
 *           LayoutCount/RecalcStyleCount/ScriptDuration deltas
 *   tabs    Today <-> Dashboard switch latency (double-rAF settled)
 *   dom     rendered rows vs data rows (does virtualization actually engage?)
 *
 *  Output: console table + JSON in e2e/perf-results/<ts>.json. The first run
 *  also writes e2e/perf-baseline.json (medians) — later optimization rounds
 *  diff against it. No thresholds/gates on purpose: this is the ruler, not
 *  the referee.
 *
 *    node e2e/perf-panel.mjs            (ha-shots demo)
 *    HA_URL=… HA_TOKEN=… node e2e/perf-panel.mjs
 */
import { chromium } from "@playwright/test";
import fs from "fs";
import { wsClient, watchdog } from "./ws-client.mjs";

const REST = process.env.HA_URL || "http://127.0.0.1:8131";
const HA = process.env.HA_BROWSER_URL || "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const RUNS = parseInt(process.env.PERF_RUNS || "3", 10);
const OUTDIR = new URL("./perf-results/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const BASELINE = new URL("./perf-baseline.json", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
watchdog(15 * 60e3, "perf panel run");
const log = (...a) => console.log(...a);

async function token() {
  if (process.env.HA_TOKEN) return process.env.HA_TOKEN;
  const CID = HA + "/";
  const j = (r) => r.json();
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

const TOKEN = await token();
const api = await wsClient(REST, TOKEN);
const objs = (await api.send({ type: "maintenance_supporter/objects" })).objects;
const taskCount = objs.reduce((n, o) => n + o.tasks.length, 0);
api.close();
log(`instance: ${objs.length} objects, ${taskCount} tasks`);

// Instrumentation injected before any app code: WS wrapping (via the
// hassConnection promise the HA frontend exposes), long-task observer,
// panel-appearance + first-row timestamps.
const INIT = `
  window.__perf = { ws: [], long: [], marks: {} };
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__perf.long.push({ start: e.startTime, dur: e.duration });
    }).observe({ entryTypes: ["longtask"] });
  } catch {}
  const mark = (k) => { if (!(k in window.__perf.marks)) window.__perf.marks[k] = performance.now(); };
  const poll = setInterval(() => {
    const deep = (pred) => { const st = [document.documentElement]; let n = 0;
      while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) return el; if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return null; };
    const panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL");
    if (panel) {
      mark("panelInDom");
      if (Array.isArray(panel._objects) && panel._objects.length > 0) mark("dataLoaded");
      window.__panel = panel;
      const row = deep((el) => el.classList && (el.classList.contains("task-row") || el.tagName === "TR") && /Perf |Task /.test(el.textContent || ""));
      if (row) { mark("firstRowPainted"); clearInterval(poll); }
    }
  }, 16);
  const wrap = (conn) => {
    const orig = conn.sendMessagePromise.bind(conn);
    conn.sendMessagePromise = async (msg) => {
      const t0 = performance.now();
      const res = await orig(msg);
      let size = 0;
      try { size = JSON.stringify(res).length; } catch {}
      window.__perf.ws.push({ type: msg.type, ms: Math.round(performance.now() - t0), bytes: size });
      return res;
    };
  };
  const hookConn = () => {
    if (window.hassConnection && window.hassConnection.then) {
      window.hassConnection.then(({ conn }) => wrap(conn)).catch(() => {});
    } else { setTimeout(hookConn, 5); }
  };
  hookConn();
`;

const pct = (arr, p) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
};
const median = (arr) => pct(arr, 50);

async function measureLoad(page) {
  await page.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__perf?.marks?.firstRowPainted, { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(800); // let stragglers (stats, locales) land
  return page.evaluate(() => {
    const bundle = performance.getEntriesByType("resource").find((r) => /maintenance-panel\.js/.test(r.name));
    return {
      marks: window.__perf.marks,
      ws: window.__perf.ws,
      long: window.__perf.long,
      bundle: bundle ? { ms: Math.round(bundle.duration), kb: Math.round((bundle.transferSize || bundle.encodedBodySize || 0) / 1024) } : null,
    };
  });
}

async function measureScroll(page, cdp) {
  // Find the scrollable ancestor of a task row and pump 80 wheel steps,
  // capturing rAF deltas — the honest "does it feel smooth" number.
  const before = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
  const frames = await page.evaluate(async () => {
    const deepAll = (pred) => { const st = [document.documentElement]; const out = []; let n = 0;
      while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) out.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return out; };
    let el = deepAll((e) => e.classList && (e.classList.contains("task-row") || e.tagName === "TR"))[0];
    let scroller = null;
    while (el) {
      if (el.scrollHeight > el.clientHeight + 40) { scroller = el; break; }
      el = el.parentNode instanceof ShadowRoot ? el.parentNode.host : el.parentElement;
    }
    if (!scroller) scroller = document.scrollingElement;
    const deltas = [];
    let last = performance.now();
    for (let i = 0; i < 80; i++) {
      scroller.scrollTop += 140;
      await new Promise((r) => requestAnimationFrame(r));
      const now = performance.now();
      deltas.push(now - last);
      last = now;
    }
    scroller.scrollTop = 0;
    return deltas;
  });
  const after = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
  return {
    frames,
    layout: Math.round(after.LayoutCount - before.LayoutCount),
    recalc: Math.round(after.RecalcStyleCount - before.RecalcStyleCount),
    scriptMs: Math.round((after.ScriptDuration - before.ScriptDuration) * 1000),
  };
}

async function measureTabs(page) {
  const t = async (label) => page.evaluate(async (want) => {
    const deepAll = (pred) => { const st = [document.documentElement]; const out = []; let n = 0;
      while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) out.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return out; };
    const tab = deepAll((e) => (e.tagName === "MWC-TAB" || e.getAttribute?.("role") === "tab" || e.tagName === "BUTTON") && new RegExp(want, "i").test(e.textContent || ""))[0];
    if (!tab) return null;
    const t0 = performance.now();
    tab.click();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    return Math.round(performance.now() - t0);
  }, label);
  const toToday = await t("today");
  await page.waitForTimeout(300);
  const toDashboard = await t("dashboard");
  await page.waitForTimeout(300);
  return { toToday, toDashboard };
}

async function domReality(page) {
  return page.evaluate(() => {
    const deepAll = (pred) => { const st = [document.documentElement]; const out = []; let n = 0;
      while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) out.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return out; };
    const rows = deepAll((e) => e.classList?.contains("task-row") || (e.tagName === "TR" && /Task /.test(e.textContent || "")));
    const dataTasks = (window.__panel?._objects || []).reduce((n, o) => n + o.tasks.length, 0);
    return { renderedRows: rows.length, dataTasks };
  });
}

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const runs = [];
for (let r = 0; r < RUNS; r++) {
  const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
  await ctx.addInitScript(({ tk, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: tk, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { tk: TOKEN, ha: HA });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Performance.enable");

  const cold = await measureLoad(page);
  const scroll = await measureScroll(page, cdp);
  const tabs = await measureTabs(page);
  const dom = await domReality(page);
  // Warm: same context (HTTP cache + service worker primed), fresh perf state.
  await page.reload({ waitUntil: "domcontentloaded" });
  const warm = await measureLoad(page);

  runs.push({ cold, warm, scroll, tabs, dom });
  const m = cold.marks;
  log(`run ${r + 1}: cold firstRow ${Math.round(m.firstRowPainted || -1)} ms | warm ${Math.round(warm.marks.firstRowPainted || -1)} ms | scroll p95 ${Math.round(pct(scroll.frames, 95))} ms | rows ${dom.renderedRows}/${dom.dataTasks}`);
  await ctx.close();
}
await b.close();

const sum = {
  instance: { objects: objs.length, tasks: taskCount, url: REST },
  runs: RUNS,
  coldMs: {
    panelInDom: median(runs.map((r) => Math.round(r.cold.marks.panelInDom || 0))),
    dataLoaded: median(runs.map((r) => Math.round(r.cold.marks.dataLoaded || 0))),
    firstRowPainted: median(runs.map((r) => Math.round(r.cold.marks.firstRowPainted || 0))),
  },
  warmFirstRowMs: median(runs.map((r) => Math.round(r.warm.marks.firstRowPainted || 0))),
  bundle: runs[0].cold.bundle,
  ws: (() => {
    const byType = {};
    for (const c of runs[0].cold.ws) {
      byType[c.type] = byType[c.type] || { ms: [], bytes: 0, n: 0 };
      byType[c.type].ms.push(c.ms);
      byType[c.type].bytes = Math.max(byType[c.type].bytes, c.bytes);
      byType[c.type].n++;
    }
    return Object.fromEntries(Object.entries(byType)
      .sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 8)
      .map(([t, v]) => [t, { ms: median(v.ms), kb: Math.round(v.bytes / 1024), calls: v.n }]));
  })(),
  longTasksLoad: median(runs.map((r) => r.cold.long.length)),
  longestLoadBlockMs: median(runs.map((r) => Math.round(Math.max(0, ...r.cold.long.map((l) => l.dur))))),
  scroll: {
    p50: median(runs.map((r) => Math.round(pct(r.scroll.frames, 50)))),
    p95: median(runs.map((r) => Math.round(pct(r.scroll.frames, 95)))),
    max: median(runs.map((r) => Math.round(Math.max(...r.scroll.frames)))),
    framesOver50: median(runs.map((r) => r.scroll.frames.filter((f) => f > 50).length)),
    layout: median(runs.map((r) => r.scroll.layout)),
    recalc: median(runs.map((r) => r.scroll.recalc)),
    scriptMs: median(runs.map((r) => r.scroll.scriptMs)),
  },
  tabs: {
    toToday: median(runs.map((r) => r.tabs.toToday ?? 0)),
    toDashboard: median(runs.map((r) => r.tabs.toDashboard ?? 0)),
  },
  dom: runs[0].dom,
};

fs.mkdirSync(OUTDIR, { recursive: true });
const out = OUTDIR + new Date().toISOString().replace(/[:.]/g, "-") + ".json";
fs.writeFileSync(out, JSON.stringify({ summary: sum, runs }, null, 2));
log("\n=== SUMMARY (medians of " + RUNS + " runs) ===");
log(JSON.stringify(sum, null, 2));
if (!fs.existsSync(BASELINE)) {
  fs.writeFileSync(BASELINE, JSON.stringify(sum, null, 2));
  log("baseline written: e2e/perf-baseline.json");
} else {
  const base = JSON.parse(fs.readFileSync(BASELINE, "utf-8"));
  log(`vs baseline: cold firstRow ${base.coldMs?.firstRowPainted} -> ${sum.coldMs.firstRowPainted} ms | scroll p95 ${base.scroll?.p95} -> ${sum.scroll.p95} ms`);
}
log("report: " + out);
