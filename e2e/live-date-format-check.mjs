/** Live UI check for issue #97 on ha-maint: task due dates follow the HA
 *  per-user date format (hass.locale.date_format), not just the language.
 *
 *  Drives the real panel: reads a task detail's due date with the default
 *  (language-derived) format, then pushes a hass update whose locale carries
 *  date_format="DMY" / "YMD" — exactly what HA does after the user changes
 *  the profile setting — and asserts the rendered date flips. Screenshots
 *  before/after. */
import { chromium } from "@playwright/test";
import { loadToken, watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(5 * 60e3, "date-format check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
let entryId = null;

try {
  // Seed a task with a KNOWN due date (one-time, due 2026-08-10 like the issue).
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: `DateFmt ${stamp}` });
  entryId = obj.entry_id;
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: `Inspection ${stamp}`, schedule_type: "one_time", due_date: "2026-08-10",
  });

  const deepFindPanel = `
    const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
      while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  `;
  const b = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "dark", deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
  let mounted = false;
  for (let i = 0; i < 30 && !mounted; i++) {
    await p.waitForTimeout(1000);
    mounted = await p.evaluate(({ finder }) => {
      eval(finder);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }, { finder: deepFindPanel }).catch(() => false);
  }
  if (!mounted) fail("panel never mounted");
  log("panel mounted");

  // The real hass.locale must carry the profile fields our fix reads.
  const localeShape = await p.evaluate(({ finder }) => {
    eval(finder);
    return window.__panel.hass?.locale || null;
  }, { finder: deepFindPanel });
  log("  live hass.locale:", JSON.stringify(localeShape));

  // Open the seeded task's detail view (panel-internal navigation, then read
  // the rendered due-date text from the overview tab).
  const openTask = `(panel, name) => {
    for (const o of panel._objects) {
      const task = o.tasks.find((t2) => t2.name === name);
      if (task) { panel._showTask(o.entry_id, task.id); return true; }
    }
    return false;
  }`;
  const opened = await p.evaluate(({ finder, body, a }) => {
    eval(finder);
    return eval(`(${body})`)(window.__panel, a);
  }, { finder: deepFindPanel, body: openTask, a: `Inspection ${stamp}` });
  assert(opened === true, "task detail opened");
  await p.waitForTimeout(1200);

  const readDates = `(panel) => {
    const txt = panel.shadowRoot.querySelector(".content")?.textContent || "";
    const out = [];
    for (const m of txt.matchAll(/\\b(\\d{2}[./]\\d{2}[./]\\d{4}|\\d{4}-\\d{2}-\\d{2})\\b/g)) out.push(m[1]);
    return [...new Set(out)];
  }`;
  const inPanel = (src) => p.evaluate(({ finder, body }) => {
    eval(finder);
    return eval(`(${body})`)(window.__panel);
  }, { finder: deepFindPanel, body: src });

  // 1. Default (language-derived, en → en-US): due date reads 08/10/2026.
  const before = await inPanel(readDates);
  log("  dates (language default):", JSON.stringify(before));
  assert(before.includes("08/10/2026"), `language-derived en shows 08/10/2026 (got ${before})`);
  await p.screenshot({ path: `${OUT}/date-format-before.png` });

  // 2. Simulate the HA profile switch to DMY: HA hands every component a new
  //    hass object whose locale carries date_format — exactly what we push.
  const setFmt = (fmt) => p.evaluate(({ finder, f }) => {
    eval(finder);
    const panel = window.__panel;
    panel.hass = { ...panel.hass, locale: { ...(panel.hass.locale || {}), date_format: f } };
    return true;
  }, { finder: deepFindPanel, f: fmt });
  await setFmt("DMY");
  await p.waitForTimeout(800);
  const dmy = await inPanel(readDates);
  log("  dates (DMY):", JSON.stringify(dmy));
  assert(dmy.includes("10/08/2026"), `DMY shows 10/08/2026 — the issue's expectation (got ${dmy})`);
  assert(!dmy.includes("08/10/2026"), "no mm/dd/yyyy remnants in DMY mode");
  await p.screenshot({ path: `${OUT}/date-format-dmy.png` });

  // 3. YMD (ISO) for good measure.
  await setFmt("YMD");
  await p.waitForTimeout(800);
  const ymd = await inPanel(readDates);
  assert(ymd.includes("2026-08-10"), `YMD shows 2026-08-10 (got ${ymd})`);

  // 4. Back to language → original rendering returns.
  await setFmt("language");
  await p.waitForTimeout(800);
  const back = await inPanel(readDates);
  assert(back.includes("08/10/2026"), "switching back to 'language' restores en-US rendering");

  log("DATE-FORMAT LIVE CHECK PASSED");
  await ctx.close();
  await b.close();
} finally {
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  api.close();
  log("cleanup done");
}
