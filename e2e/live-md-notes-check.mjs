/** Live check on ha-maint: markdown notes render via <ha-markdown> in the panel
 *  (task detail + object detail). */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const assert = (c, m) => { if (!c) { console.error("FAIL:", m); throw new Error(m); } log("  ok:", m); };
watchdog(4 * 60e3, "md-notes live check");

const token = loadToken();
const api = await wsClient(REST, token);
let entryId = null;
let browser = null;
try {
  const obj = await api.send({
    type: "maintenance_supporter/object/create", name: `mdsmoke${Date.now() % 100000}`,
  });
  entryId = obj.entry_id;
  await api.send({
    type: "maintenance_supporter/object/update", entry_id: entryId,
    notes: "**Wichtig:** vorher Strom abschalten\n- Schritt 1\n- Schritt 2",
  });
  const created = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "MD task", schedule_type: "time_based", interval_days: 30,
    notes: "See the [manual](https://example.com) — **torque: 12 Nm**",
  });
  const taskId = created.task_id;

  browser = await chromium.connect(PW_WS);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  const page = await ctx.newPage();
  await page.addInitScript(hassTokensInit, { t: token, ha: HA });

  const findPanel = () => {
    const sr = (el) => el && el.shadowRoot;
    const st = [document.documentElement]; let n = 0;
    while (st.length && n++ < 8000) {
      const el = st.pop();
      if (el.tagName === "MAINTENANCE-SUPPORTER-PANEL") return el;
      const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
      else if (el.children) st.push(...el.children);
    }
    return null;
  };
  const probeSel = async (sel) => {
    for (let i = 0; i < 25; i++) {
      const res = await page.evaluate(`(() => {
        const findPanel = ${findPanel.toString()};
        const root = findPanel()?.shadowRoot;
        const md = root?.querySelector("${sel} ha-markdown");
        if (!md) return null;
        const inner = (md.shadowRoot || md).innerHTML || "";
        if (!inner.includes("<p")) return null; // parse is async — Lit comment markers land first
        return { strong: inner.includes("<strong>"), li: inner.includes("<li>"), a: inner.includes("<a ") };
      })()`);
      if (res) return res;
      await page.waitForTimeout(1000);
    }
    return null;
  };

  await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(entryId)}&task_id=${encodeURIComponent(taskId)}`,
    { waitUntil: "domcontentloaded", timeout: 30000 });
  const taskMd = await probeSel(".task-meta-notes");
  assert(taskMd, "task detail renders notes through ha-markdown");
  assert(taskMd.strong && taskMd.a, `task notes markdown parsed (strong=${taskMd?.strong} a=${taskMd?.a})`);

  await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(entryId)}`,
    { waitUntil: "domcontentloaded", timeout: 30000 });
  const objMd = await probeSel(".object-notes-body");
  assert(objMd, "object detail renders notes through ha-markdown");
  assert(objMd.strong && objMd.li, `object notes markdown parsed (strong=${objMd?.strong} li=${objMd?.li})`);

  log("PASS: md-notes live check");
} finally {
  if (browser) await browser.close().catch(() => {});
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  api.close();
}
