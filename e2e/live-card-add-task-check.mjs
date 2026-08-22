/** Live check: the Lovelace card's "Add task" button opens a SAVABLE dialog.
 *
 *  Bug audit 2026-08-22: openCreateTaskDialog() forwarded nothing — the
 *  mounted task dialog had no object picker (empty _objectChoices) and an
 *  undefined entry_id, so save always failed on the backend's required
 *  entry_id. This check creates a throwaway storage dashboard with just the
 *  card on the seeded ha-shots demo, clicks the header "Add task" button and
 *  asserts the dialog shows the object picker with the seed's objects and a
 *  preselected entry_id. Cleans the dashboard up afterwards.
 */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131";
const HA = "http://ha-shots:8123";
const PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "card add-task check");

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const objCount = (await api.send({ type: "maintenance_supporter/objects" })).objects.length;
if (objCount < 2) fail("seed too small for a picker check");

const URL_PATH = "demo-addtask-check";
let dashboardId = null;
let browser = null;
try {
  const dashboards = await api.send({ type: "lovelace/dashboards/list" });
  const stale = (dashboards || []).find((d) => d.url_path === URL_PATH);
  if (stale) dashboardId = stale.id;
  if (!dashboardId) {
    const dash = await api.send({
      type: "lovelace/dashboards/create",
      url_path: URL_PATH,
      title: "AddTask Check",
      mode: "storage",
      show_in_sidebar: false,
    });
    dashboardId = dash.id;
  }
  await api.send({
    type: "lovelace/config/save",
    url_path: URL_PATH,
    config: { views: [{ type: "panel", cards: [{ type: "custom:maintenance-supporter-card" }] }] },
  });

  browser = await chromium.connect(PW_WS);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(({ t, ha }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: t, token_type: "Bearer", expires_in: 1800,
      hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
    }));
  }, { t: token, ha: HA });
  await page.goto(HA + "/" + URL_PATH, { waitUntil: "domcontentloaded", timeout: 30000 });

  const result = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const deepAll = (root, sel) => {
      const st = [root]; let n = 0; const out = [];
      while (st.length && n++ < 5000) {
        const el = st.pop();
        const r = el.shadowRoot || (el instanceof ShadowRoot || el instanceof Document ? el : null);
        if (r) {
          out.push(...(r.querySelectorAll?.(sel) || []));
          st.push(...r.querySelectorAll("*"));
        }
      }
      return out;
    };
    // Two .hdr-add buttons exist — "new object" (plus-box) and "add task"
    // (playlist-plus). We need the second.
    let btn = null;
    for (let i = 0; i < 60 && !btn; i++) {
      await sleep(500);
      btn = deepAll(document, ".hdr-add").find((b) => b.innerHTML.includes("playlist-plus")) || null;
    }
    if (!btn) return { error: "add-task button not found (card not rendered or not admin)" };
    btn.click();
    const haRoot = document.querySelector("home-assistant");
    let dlg = null;
    for (let i = 0; i < 30 && !dlg; i++) {
      await sleep(500);
      const cand = haRoot?.shadowRoot?.querySelector("maintenance-task-dialog");
      if (cand && cand._open) dlg = cand;
    }
    if (!dlg) return { error: "task dialog did not open in HA shadow root" };
    await sleep(500);
    const select = dlg.shadowRoot?.querySelector(".select-row select");
    return {
      entryId: dlg._entryId ?? null,
      choices: (dlg._objectChoices || []).length,
      selectRendered: !!select,
      selectOptions: select ? select.querySelectorAll("option").length : 0,
    };
  });

  if (result.error) fail(result.error);
  log("dialog state:", JSON.stringify(result));
  assert(result.choices >= 2, `object choices populated (${result.choices})`);
  assert(result.selectRendered, "object picker <select> rendered");
  assert(result.selectOptions === result.choices, "picker lists every choice");
  assert(!!result.entryId, `entry_id preselected (${result.entryId})`);
  log("PASS: card add-task dialog is savable");
} finally {
  if (browser) await browser.close().catch(() => {});
  if (dashboardId) await api.send({ type: "lovelace/dashboards/delete", dashboard_id: dashboardId }).catch(() => {});
  api.close();
}
