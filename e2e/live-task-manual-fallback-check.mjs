/** Browser-level check: the task-detail object-manual row falls back to an
 *  attached manual-category document when documentation_url is empty, and the
 *  click opens the document (weblink → new tab).
 *
 *   HA_TOKEN=… node e2e/live-task-manual-fallback-check.mjs
 */
import { chromium } from "@playwright/test";
import { wsClient, watchdog } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8125";
const HA = "http://ha-maint:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const D = "maintenance_supporter";
watchdog(6 * 60e3, "task manual fallback check");

let failed = 0;
const check = (ok, label) => { console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); if (!ok) failed++; };

const api = await wsClient(REST, process.env.HA_TOKEN);
let entryId = null, taskId = null;
try {
  const createdObj = await api.send({ type: `${D}/object/create`, name: "Manual Fallback Probe" });
  entryId = createdObj.entry_id;
  const task = await api.send({
    type: `${D}/task/create`, entry_id: entryId, name: "Descale",
    task_type: "cleaning", schedule_type: "time_based", interval_days: 30,
  });
  taskId = task.task_id || task.id;
  await api.send({
    type: `${D}/documents/add_link`, entry_id: entryId,
    url: "http://ha-maint:8123/manifest.json", title: "Probe Handbook", tags: ["manual"],
  });
  await new Promise((r) => setTimeout(r, 2500));
  if (!taskId) {
    const objs = (await api.send({ type: `${D}/objects` })).objects;
    taskId = objs.find((o) => o.entry_id === entryId).tasks[0].id;
  }

  const b = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
  await ctx.addInitScript(({ t, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: t, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { t: process.env.HA_TOKEN, ha: HA });
  const p = await ctx.newPage();

  const finder = `
    const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
      while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  `;
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  let mounted = false;
  for (let i = 0; i < 30 && !mounted; i++) {
    await p.waitForTimeout(1000);
    mounted = await p.evaluate(({ f }) => {
      eval(f);
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }, { f: finder }).catch(() => false);
  }
  check(mounted, "panel mounted");

  await p.evaluate(({ f, entryId, taskId }) => {
    eval(f);
    window.__panel._showTask(entryId, taskId);
  }, { f: finder, entryId, taskId });
  await p.waitForTimeout(2500);

  const row = await p.evaluate(({ f }) => {
    eval(f);
    const links = [...window.__panel.shadowRoot.querySelectorAll(".task-meta-link a")];
    const a = links.find((x) => (x.textContent || "").includes("Manual Fallback Probe"));
    return a ? { text: a.textContent.trim(), title: a.getAttribute("title"), href: a.getAttribute("href") } : null;
  }, { f: finder });
  check(!!row, `manual row rendered (${JSON.stringify(row)})`);
  check(row?.title === "Probe Handbook", "row carries the document title");

  // Click → weblink opens in a new tab.
  const popupPromise = ctx.waitForEvent("page", { timeout: 15000 }).catch(() => null);
  await p.evaluate(({ f }) => {
    eval(f);
    const links = [...window.__panel.shadowRoot.querySelectorAll(".task-meta-link a")];
    links.find((x) => (x.textContent || "").includes("Manual Fallback Probe")).click();
  }, { f: finder });
  const popup = await popupPromise;
  check(!!popup && popup.url().includes("manifest.json"), `click opened the manual (${popup && popup.url()})`);

  await b.close();
} finally {
  if (entryId) await api.send({ type: `${D}/object/delete`, entry_id: entryId }).catch(() => {});
  api.close();
  console.log(failed ? `\n${failed} check(s) FAILED` : "\nall checks passed");
  process.exitCode = failed ? 1 : 0;
}
