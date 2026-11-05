/** The docs pictures of 2.117-2.119 on the seeded demo, dark theme: a task's
 *  Trace tab (2.117) and the template improvements an object is offered
 *  (2.118, D#85), on the object page and in the review dialog. The review
 *  needs an object made from a template before 2.118: a "Lawn" from Lawn Care,
 *  imported with the July 2026 names and recurrences (no seasonal windows yet)
 *  and the template origin, deleted again in the finally.
 *  The Trace pictures the HVAC filter's cycle the GIFs complete (quick
 *  complete by QR), so the sweep runs task-trace.png after gifs-demo.mjs.
 *  Prereqs: seeded ha-shots (restarted after backend changes) +
 *  playwright-server running. Some pictures only: node shots-2-119.mjs task-trace.png,template-updates.png */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const D = "maintenance_supporter";
const LAWN = "Lawn";
const log = (...a) => console.log(...a);
const only = process.argv[2];
const want = (name) => !only || only.split(",").includes(name);
watchdog(10 * 60e3, "2.119 shots");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  window.__trace = () => deep((el) => el.tagName === "MAINTENANCE-TASK-TRACE")[0];
  window.__tpl = () => deep((el) => el.tagName === "MAINTENANCE-TEMPLATE-UPDATES")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const failures = [];
const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

/** Lawn Care as it was on 17 July 2026: the old names (the task keys) and
 *  recurrences from templates_history.py, made on 20 July. */
const OLD_LAWN = [
  ["Mowing", 10, 2, 6],
  ["Watering", 7, 1, 3],
  ["Fertilising", 120, 14, 64],
  ["Scarifying", 365, 30, 204],
  ["Aerating", 365, 30, 57],
  ["Overseeding", 365, 30, 55],
  ["Weeding", 90, 14, 41],
];

async function lawnIds() {
  const objs = (await api.send({ type: `${D}/objects` })).objects || [];
  return objs.filter((o) => o.object?.name === LAWN).map((o) => o.entry_id);
}
async function unseedLawn() {
  for (const id of await lawnIds()) await api.send({ type: `${D}/object/delete`, entry_id: id });
}

// ── Seed, all before the browser (a WS call after the page opens hangs) ──
const ids = {};
try {
  await unseedLawn(); // a crashed earlier run
  await api.send({ type: `${D}/json/import`, json_content: JSON.stringify({ version: 1, objects: [{
    object: { name: LAWN, template_id: "garden_lawn" },
    tasks: OLD_LAWN.map(([key, days, warn, done]) => ({
      name: key, type: "service", schedule_type: "time_based", interval_days: days, warning_days: warn,
      last_performed: daysAgo(done), created_at: "2026-07-20T09:00:00+00:00",
      origin: { kind: "template", template: "garden_lawn", task: key },
    })),
  }] }) });
  for (let i = 0; i < 20 && !ids.lawn; i++) {
    ids.lawn = (await lawnIds())[0];
    if (!ids.lawn) await new Promise((r) => setTimeout(r, 500));
  }
  const updates = await api.send({ type: `${D}/template_updates`, entry_id: ids.lawn });
  log("lawn updates:", JSON.stringify(updates).slice(0, 300));
  const objs = (await api.send({ type: `${D}/objects` })).objects || [];
  const hvac = objs.find((o) => o.object?.name === "HVAC System");
  ids.hvac = hvac?.entry_id;
  ids.filter = hvac?.tasks?.find((t) => t.name === "Replace Filter")?.id;
  if (!ids.lawn || !ids.hvac || !ids.filter) throw new Error(`missing ids ${JSON.stringify(ids)}`);
} catch (e) {
  log("FAIL seed", String(e && e.message || e).slice(0, 200));
  failures.push("seed");
}

const b = await chromium.connect(PW_WS, { timeout: 20000 });
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
// F5 keeps the panel's page since 2.116 (history state); every visit here starts fresh.
await ctx.addInitScript(() => { try { history.replaceState(null, ""); } catch { /* ignore */ } });
await ctx.addInitScript(({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", '"dashboard"');
}, { t: token, ha: HA });
const p = await ctx.newPage();

async function openPanel() {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    const ok = await p.evaluate(({ d, id }) => {
      eval(d);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.some((o) => o.entry_id === id);
    }, { d: DEEP, id: ids.lawn }).catch(() => false);
    if (ok) break;
  }
  await p.waitForTimeout(1200);
}

async function shoot(name, prepare, { verify, clip } = {}) {
  if (!want(name) || !ids.lawn) return;
  log("STEP", name);
  try {
    await openPanel();
    await p.evaluate(prepare, { d: DEEP, ids });
    await p.waitForTimeout(2500);
    const ok = verify ? await p.evaluate(verify, { d: DEEP, ids }) : true;
    if (!ok) throw new Error("what the picture is about did not render");
    await p.screenshot({ path: OUT + name, ...(clip ? { clip: await p.evaluate(clip, { d: DEEP }) } : {}) });
    log("SHOT", name);
  } catch (e) {
    failures.push(name);
    log("FAIL", name, String(e && e.message || e).slice(0, 200));
  }
}

try {
  // 1. The Trace tab of the HVAC filter: the cycle its airflow rule opened
  // and the quick complete of the GIFs ended.
  await shoot("task-trace.png", async ({ d, ids }) => {
    eval(d);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    window.__panel._showTask(ids.hvac, ids.filter);
    await sleep(800);
    window.__panel._activeTab = "trace";
    for (let i = 0; i < 20 && !window.__trace()?.shadowRoot?.querySelector(".trace-steps"); i++) await sleep(300);
  }, {
    verify: ({ d }) => {
      eval(d);
      const sr = window.__trace()?.shadowRoot;
      const steps = sr ? sr.querySelectorAll(".trace-item").length : 0;
      console.log("trace steps", steps, sr?.querySelector(".trace-cycle-label")?.textContent);
      return steps >= 3;
    },
  });

  // 2. The lawn's page: the line that says the template has changes.
  await shoot("template-updates.png", async ({ d, ids }) => {
    eval(d);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    window.__panel._showObject(ids.lawn);
    for (let i = 0; i < 20 && !window.__tpl()?.shadowRoot?.querySelector(".tpl-banner"); i++) await sleep(300);
  }, {
    verify: ({ d }) => {
      eval(d);
      return /Lawn Care/.test(window.__tpl()?.shadowRoot?.querySelector(".tpl-banner")?.textContent || "");
    },
    clip: ({ d }) => {
      eval(d);
      const r = window.__panel.getBoundingClientRect();
      const banner = window.__tpl().shadowRoot.querySelector(".tpl-banner").getBoundingClientRect();
      return { x: Math.max(0, r.x), y: 0, width: Math.min(r.width, 1600), height: Math.min(innerHeight, banner.bottom + 260) };
    },
  });

  // 3. Review: task by task, before and after, all ticked.
  await shoot("template-updates-review.png", async ({ d, ids }) => {
    eval(d);
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    window.__panel._showObject(ids.lawn);
    for (let i = 0; i < 20 && !window.__tpl()?.shadowRoot?.querySelector(".tpl-review"); i++) await sleep(300);
    window.__tpl().shadowRoot.querySelector(".tpl-review").click();
  }, {
    verify: ({ d }) => {
      eval(d);
      const sr = window.__tpl()?.shadowRoot;
      const tasks = sr ? [...sr.querySelectorAll(".tpl-task-name")].map((x) => x.textContent) : [];
      console.log("review tasks", tasks.join(" | "));
      return tasks.length >= 3 && !!sr.querySelector(".tpl-before") && !!sr.querySelector(".tpl-after");
    },
  });
} finally {
  await ctx.close().catch(() => {});
  await unseedLawn().catch((e) => log("FAIL unseed", String(e && e.message || e).slice(0, 200)));
}

api.close();
await b.close();
if (failures.length) {
  console.error("FAILED:", failures.join(", "));
  process.exit(1);
}
process.exit(0);
