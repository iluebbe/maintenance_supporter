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
import fs from "fs";
import { watchdog } from "./ws-client.mjs";

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
// Instance info via REST, NOT wsClient: a Node-side HA WebSocket in the same
// process as the playwright connection correlated with the page channel
// wedging (2026-08-05 bisect — the probe without it never hung).
const states = await fetch(REST + "/api/states", { headers: { Authorization: "Bearer " + TOKEN } }).then((r) => r.json());
log(`instance: ${states.length} states`);
const objs = [];
const taskCount = "?";

// Instrumentation injected before any app code: WS wrapping (via the
// hassConnection promise the HA frontend exposes), long-task observer,
// panel-appearance + first-row timestamps.
const INIT = `
  // Scroll probing is OPT-IN (PERF_SCROLL=1): the in-page rAF scroll loop
  // wedged the remote run-server's evaluate channel (1.62, 2026-08-05) —
  // load/payload metrics are the reliable core; scroll numbers exist in the
  // pre-truncation baselines and are untouched by payload changes.
  const PERF_SCROLL = __PERF_SCROLL__;
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
      const row = deep((el) => el.classList && (el.classList.contains("task-row") || (el.tagName === "TR" && (el.textContent || "").trim().length > 10)));
      if (row) { mark("firstRowPainted"); clearInterval(poll); if (PERF_SCROLL) setTimeout(scrollProbe, 4000); }
    }
  }, 16);
  // The scroll measurement runs IN-PAGE, self-started after first paint —
  // the harness only READS window.__scrollResult in its single evaluate
  // (a second evaluate on the same page wedges the remote run-server).
  async function scrollProbe() {
    try {
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
      const rows = deepAll((e) => (e.classList && e.classList.contains("task-row")) || (e.tagName === "TR" && /Task /.test(e.textContent || "")));
      const dataTasks = (window.__panel && window.__panel._objects || []).reduce((n, o) => n + o.tasks.length, 0);
      window.__scrollResult = { frames: deltas, renderedRows: rows.length, dataTasks: dataTasks };
    } catch (e) {
      window.__scrollResult = { frames: [], renderedRows: -1, dataTasks: -1, error: String(e) };
    }
  }
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
    // Subscription PUSHES are the suspected steady-state cost: every
    // coordinator update re-ships the full objects payload. Count them.
    window.__perf.subs = [];
    const origSub = conn.subscribeMessage.bind(conn);
    conn.subscribeMessage = (cb, m, opts) =>
      origSub((ev) => {
        let size = 0;
        try { size = JSON.stringify(ev).length; } catch {}
        window.__perf.subs.push({ type: m && m.type, at: Math.round(performance.now()), bytes: size });
        return cb(ev);
      }, m, opts);
  };
  const hookConn = () => {
    if (window.hassConnection && window.hassConnection.then) {
      window.hassConnection.then(({ conn }) => wrap(conn)).catch(() => {});
    } else { setTimeout(hookConn, 5); }
  };
  hookConn();
`;

const withTimeout = (promise, ms, fallback) =>
  Promise.race([promise, new Promise((r) => setTimeout(() => r(fallback), ms))]);

const pct = (arr, p) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
};
const median = (arr) => pct(arr, 50);





// One SUBPROCESS per run (perf-run-once.mjs): fresh short-lived playwright
// connections are the empirically reliable shape — the long-lived multi-run
// connection wedged its page channel repeatedly (2026-08-04/05).
import { execFileSync } from "child_process";
const runs = [];
for (let r = 0; r < RUNS; r++) {
  const out = execFileSync(process.execPath, [new URL("./perf-run-once.mjs", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")], {
    env: { ...process.env, PERF_TOKEN: TOKEN },
    encoding: "utf-8",
    timeout: 6 * 60e3,
  });
  const line = out.trim().split("\n").pop();
  const run = JSON.parse(line);
  if (!run.cold) { log(`run ${r + 1}: cold read failed — skipped`); continue; }
  runs.push(run);
  const m = run.cold.marks || {};
  log(`run ${r + 1}: cold firstRow ${Math.round(m.firstRowPainted || -1)} ms | warm ${Math.round(run.warm?.marks?.firstRowPainted || -1)} ms | scroll p95 ${Math.round(pct(run.scroll.frames, 95))} ms | rows ${run.dom.renderedRows}/${run.dom.dataTasks}`);
}
if (!runs.length) throw new Error("no successful runs");

const sum = {
  instance: { objects: objs.length, tasks: taskCount, url: REST },
  runs: RUNS,
  coldMs: {
    panelInDom: median(runs.map((r) => Math.round(r.cold.marks.panelInDom || 0))),
    dataLoaded: median(runs.map((r) => Math.round(r.cold.marks.dataLoaded || 0))),
    firstRowPainted: median(runs.map((r) => Math.round(r.cold.marks.firstRowPainted || 0))),
  },
  warmFirstRowMs: median(runs.map((r) => Math.round(r.warm?.marks?.firstRowPainted || 0))),
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
