/** Live check (discussion #193): pause ONE task, and a snooze that says
 *  for how long — through the panel on the demo instance (ha-shots, 8131).
 *
 *    1. The task's ⋮ menu offers "Pause…"; pausing with a resume date shows
 *       the task as paused with the date, the object's other task keeps
 *       running.
 *    2. "Resume" starts a fresh cycle: due again 21 days from today.
 *    3. Snooze answers "Reminders muted for 4 hours — until …".
 *
 *  Everything it creates is deleted at the end.
 */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = process.env.HA_REST || "http://127.0.0.1:8131";
const HA = process.env.HA_BROWSER || "http://ha-shots:8123";
const PW_WS = process.env.PW_WS || "ws://127.0.0.1:3000/";
const SHOT = process.env.SHOT_DIR || "";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
watchdog(6 * 60e3, "task pause / snooze check");

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const MS = (type, extra = {}) => api.send({ type: `maintenance_supporter/${type}`, ...extra });
const isoDay = (offset) => new Date(Date.now() + offset * 86400e3).toISOString().slice(0, 10);
let objectId = null;

async function task(entryId, taskId) {
  const { objects } = await MS("objects");
  return objects.find((o) => o.entry_id === entryId)?.tasks.find((t) => t.id === taskId);
}

try {
  for (const o of (await MS("objects")).objects) {
    if (o.object.name === "Live pause check") await MS("object/delete", { entry_id: o.entry_id });
  }
  objectId = (await MS("object/create", { name: "Live pause check" })).entry_id;
  const filter = await MS("task/create", {
    entry_id: objectId, name: "Clean and change filter", task_type: "cleaning",
    schedule_type: "time_based", interval_days: 21, last_performed: isoDay(-30),
  });
  const other = await MS("task/create", {
    entry_id: objectId, name: "Descale", task_type: "cleaning", schedule_type: "time_based", interval_days: 21, last_performed: isoDay(-30),
  });
  let t = await task(objectId, filter.task_id);
  assert(t.status === "overdue", `the filter task starts overdue (${t.status})`);

  const browser = await chromium.connect(PW_WS);
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
    const page = await ctx.newPage();
    await page.addInitScript(({ tk, ha }) => {
      localStorage.setItem("hassTokens", JSON.stringify({
        access_token: tk, token_type: "Bearer", expires_in: 1800,
        hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
      }));
    }, { tk: token, ha: HA });
    await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(objectId)}&task_id=${filter.task_id}`, { waitUntil: "domcontentloaded" });
    const panel = `(() => {
      const st = [document.documentElement]; let n = 0;
      while (st.length && n++ < 20000) {
        const el = st.pop();
        if (el.tagName === "MAINTENANCE-SUPPORTER-PANEL") return el;
        if (el.shadowRoot) st.push(...el.shadowRoot.querySelectorAll("*"));
        else if (el.children) st.push(...el.children);
      }
      return null;
    })()`;
    await page.waitForFunction(`(() => { const p = ${panel}; return p && p.shadowRoot.querySelector(".task-header"); })()`, null, { timeout: 60000 });

    log("STEP the menu offers Pause…");
    await page.evaluate(`(() => { const p = ${panel}; p._moreMenuOpen = true; })()`);
    await page.waitForTimeout(500);
    const items = await page.evaluate(`[...(${panel}).shadowRoot.querySelectorAll(".popup-menu-item")].map((i) => i.textContent.trim())`);
    assert(items.includes("Pause…"), `the task menu lists "Pause…" (${items.join(", ")})`);
    await page.evaluate(`(() => { const p = ${panel}; const item = [...p.shadowRoot.querySelectorAll(".popup-menu-item")].find((i) => i.textContent.trim() === "Pause…"); item.click(); })()`);

    log("STEP pause with a resume date");
    const until = isoDay(3);
    const dialog = `(${panel}).shadowRoot.querySelector("maintenance-confirm-dialog")`;
    await page.waitForFunction(`(() => { const d = ${dialog}; return d && d.shadowRoot && d.shadowRoot.querySelector("input[type=date]"); })()`, null, { timeout: 10000 });
    await page.evaluate(`(async () => {
      const d = ${dialog};
      const input = d.shadowRoot.querySelector("input[type=date]");
      input.value = ${JSON.stringify(until)};
      input.dispatchEvent(new Event("input"));
      await d.updateComplete;
      const buttons = d.shadowRoot.querySelectorAll(".dialog-actions ha-button");
      buttons[buttons.length - 1].click();
    })()`);
    await page.waitForFunction(`(() => { const p = ${panel}; return /Task paused/.test(p._toastMessage || ""); })()`, null, { timeout: 15000 });
    t = await task(objectId, filter.task_id);
    assert(t.status === "paused" && t.paused && t.paused_until === until, `the task is paused until ${until}`);
    const o = await task(objectId, other.task_id);
    assert(o.status === "overdue", "the object's other task keeps running");
    await page.waitForFunction(`(() => { const p = ${panel}; return p.shadowRoot.querySelector(".paused-until"); })()`, null, { timeout: 15000 });
    const badge = await page.evaluate(`(${panel}).shadowRoot.querySelector(".paused-until").textContent.trim()`);
    assert(/until/.test(badge), `the header names the resume date ("${badge}")`);
    if (SHOT) await page.screenshot({ path: `${SHOT}/task-paused.png` });

    log("STEP resume");
    await page.evaluate(`(() => { const p = ${panel}; p._togglePauseTask(${JSON.stringify(objectId)}, ${JSON.stringify(filter.task_id)}, true); })()`);
    await page.waitForFunction(`(() => { const p = ${panel}; return /Task resumed/.test(p._toastMessage || ""); })()`, null, { timeout: 15000 });
    t = await task(objectId, filter.task_id);
    assert(t.status === "ok" && !t.paused, `resumed (${t.status})`);
    assert(t.days_until_due === 21, `a fresh cycle: due in 21 days (${t.days_until_due})`);

    log("STEP snooze says for how long");
    await page.evaluate(`(() => { const p = ${panel}; p._snoozeTask(${JSON.stringify(objectId)}, ${JSON.stringify(other.task_id)}); })()`);
    await page.waitForFunction(`(() => { const p = ${panel}; return /muted/.test(p._toastMessage || ""); })()`, null, { timeout: 15000 });
    const toast = await page.evaluate(`(${panel})._toastMessage`);
    assert(/Reminders muted for 4 hours — until /.test(toast), `the toast: "${toast}"`);
    await ctx.close();
  } finally {
    await browser.close();
  }
  log("ALL CHECKS PASSED");
} finally {
  if (objectId) await MS("object/delete", { entry_id: objectId }).catch(() => {});
  api.close();
  setTimeout(() => process.exit(process.exitCode ?? 0), 300);
}
