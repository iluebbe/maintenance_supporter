/** Responsive sweep for the panel's DETAIL surfaces (the overview-tab sweep
 *  lives in live-responsive-check.mjs): object view, task view, the complete
 *  dialog (incl. the #99 "parts used" section), the task create dialog and
 *  the suggested-setups dialog — at phone / iPad-mini / tablet widths, with
 *  the same programmatic horizontal-overflow detection + screenshots.
 *  Seeds its own object (labeled task with checklist/notes/part link, part
 *  with stock, linked web doc) and cleans up. */
import { chromium } from "@playwright/test";
import { loadToken, watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
watchdog(10 * 60e3, "responsive detail sweep");

const DEVICES = [
  { name: "phone-360", w: 360, h: 800 },
  { name: "ipad-mini-portrait", w: 744, h: 1133 },
  { name: "androidtab-landscape", w: 1280, h: 800 },
];

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;
const OVERFLOW_SRC = `(panel) => {
  const vw = window.innerWidth;
  const issues = [];
  if (document.documentElement.scrollWidth > vw + 1) {
    issues.push("PAGE overflows: " + document.documentElement.scrollWidth + " > " + vw);
  }
  const scrollsX = (el) => {
    for (let a = el; a && a !== document.body; a = a.parentElement || (a.getRootNode && a.getRootNode().host)) {
      try {
        const ox = getComputedStyle(a).overflowX;
        if ((ox === "auto" || ox === "scroll") && a !== el) return true;
      } catch { /* detached */ }
    }
    return false;
  };
  const stack = [panel.shadowRoot];
  let seen = 0;
  const offenders = new Map();
  while (stack.length && seen < 20000) {
    const root = stack.pop();
    for (const el of root.querySelectorAll("*")) {
      seen++;
      if (el.shadowRoot) stack.push(el.shadowRoot);
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > vw + 8 && !scrollsX(el)) {
        const key = el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : "");
        offenders.set(key, Math.max(offenders.get(key) || 0, Math.round(r.right - vw)));
      }
    }
  }
  for (const [k, px] of [...offenders].slice(0, 6)) issues.push(k + " sticks out " + px + "px");
  return issues;
}`;

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
let entryId = null;
const findings = [];

try {
  // ── seed a data-rich object ────────────────────────────────────────────────
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: `Resp Obj ${stamp}` });
  entryId = obj.entry_id;
  const part = await api.send({
    type: "maintenance_supporter/part/create", entry_id: entryId,
    name: `Filter cartridge ${stamp}`, stock: 3, reorder_threshold: 1, storage_location: "Basement shelf",
  });
  const task = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: `Quarterly deep inspection ${stamp}`, interval_days: 90,
    labels: ["garden", "safety"], notes: "Check the housing seals before restarting the pump.",
    checklist: ["Power off", "Open housing", "Swap filter", "Bleed air"],
    consumes_parts: [{ part_id: part.part_id, quantity: 1 }],
  });
  const doc = await api.send({
    type: "maintenance_supporter/documents/add_link", entry_id: entryId,
    url: "https://example.com/manual", title: `Service manual ${stamp}`,
  });
  await api.send({
    type: "maintenance_supporter/documents/update", doc_id: doc.id,
    task_ids: [task.task_id], part_ids: [part.part_id],
  });
  log("seeded");

  const b = await chromium.connect(PW_WS, { timeout: 20000 });
  for (const dev of DEVICES) {
    const ctx = await b.newContext({
      viewport: { width: dev.w, height: dev.h },
      deviceScaleFactor: 2,
      isMobile: dev.w < 500,
      hasTouch: true,
      colorScheme: "dark",
    });
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
    if (!mounted) { findings.push(`${dev.name}: PANEL NEVER MOUNTED`); await ctx.close(); continue; }

    const surfaces = [
      ["object", `(panel, a) => { panel._showObject(a.eid); }`],
      ["task", `(panel, a) => { panel._showTask(a.eid, a.tid); }`],
      ["complete-dialog", `(panel, a) => { panel._openCompleteDialog(a.eid, a.tid, a.name, ["Power off", "Open housing"], false); }`],
      ["task-dialog", `(panel, a) => { const d = panel.shadowRoot.querySelector("maintenance-task-dialog"); return d.openCreate(a.eid, panel._objects); }`],
      ["setups-dialog", `(panel) => { panel._openSuggestedSetups(); }`],
    ];
    for (const [name, src] of surfaces) {
      await p.evaluate(async ({ finder, body, a }) => {
        eval(finder);
        // openCreate is ASYNC — await before shooting (established gotcha).
        await eval(`(${body})`)(window.__panel, a);
      }, { finder: deepFindPanel, body: src, a: { eid: entryId, tid: task.task_id, name: `Quarterly deep inspection ${stamp}` } });
      await p.waitForTimeout(1600);
      const overflow = await p.evaluate(({ finder, body }) => {
        eval(finder);
        return eval(`(${body})`)(window.__panel);
      }, { finder: deepFindPanel, body: OVERFLOW_SRC }).catch((e) => [`check failed: ${e}`]);
      await p.screenshot({ path: `${OUT}/respd-${dev.name}-${name}.png` });
      if (overflow.length) {
        findings.push(`${dev.name} / ${name}: ${overflow.join("; ")}`);
        log(`  !! ${dev.name}/${name}:`, overflow.join("; "));
      } else {
        log(`  ok ${dev.name}/${name}`);
      }
      // close dialogs so the next surface starts clean
      await p.evaluate(({ finder }) => {
        eval(finder);
        const panel = window.__panel;
        const cd = panel.shadowRoot.querySelector("maintenance-complete-dialog");
        if (cd) cd._open = false;
        const td = panel.shadowRoot.querySelector("maintenance-task-dialog");
        if (td && td._open !== undefined) td._open = false;
        const sd = panel.shadowRoot.querySelector("maintenance-suggested-setups-dialog");
        if (sd) sd._open = false;
      }, { finder: deepFindPanel });
      await p.waitForTimeout(300);
    }
    await ctx.close();
  }
  await b.close();

  log("");
  if (findings.length) {
    log("FINDINGS:");
    for (const f of findings) log(" -", f);
  } else {
    log("NO OVERFLOW FINDINGS — all detail surfaces clean");
  }
} finally {
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  api.close();
  log("cleanup done");
}
