/** Live check on ha-maint for the #134 priority round.
 *
 *   1. Task sensor exposes the `priority` attribute (explicit + normal default).
 *   2. views/save round-trips the priority filter dimension.
 *   3. Notification view-scope: with a "high priority" scope view set,
 *      a LOW-priority task turning overdue sends NO notification while a
 *      HIGH-priority one does (notify.persistent_notification as service).
 *   4. Panel filter bar has the priority dropdown and filters the list.
 *   5. Lovelace card filter_priority narrows to the high task (plain dashboard).
 *
 *  Seeds one throwaway object + dashboard; restores notify settings; cleans up.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(8 * 60e3, "priority live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const objName = `prio${stamp}`;
let entryId = null;
let browser = null;
let dashCreated = false;
let savedGlobals = null;
const DASH_URL = `prio-${stamp}`;

const getState = async (entity) => {
  const r = await fetch(`${REST}/api/states/${entity}`, { headers: { Authorization: `Bearer ${token}` } });
  return r.ok ? r.json() : null;
};

try {
  // ── Seed ──
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: objName });
  entryId = obj.entry_id;
  const past = new Date(Date.now() - 40 * 86400e3).toISOString().slice(0, 10);
  const tHigh = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "hightask", schedule_type: "time_based", interval_days: 90,
    priority: "high", last_performed: past,
  });
  const tLow = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "lowtask", schedule_type: "time_based", interval_days: 90,
    priority: "low", last_performed: past,
  });
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "plaintask", schedule_type: "time_based", interval_days: 90,
    last_performed: past,
  });

  // 1. Sensor attribute
  const stHigh = await getState(`sensor.${objName}_hightask`);
  assert(stHigh && stHigh.attributes.priority === "high", "sensor exposes priority=high");
  const stPlain = await getState(`sensor.${objName}_plaintask`);
  assert(stPlain && stPlain.attributes.priority === "normal", "no explicit priority reads as normal");

  // 2. views/save round-trips priority
  const saved = await api.send({
    type: "maintenance_supporter/views/save", name: `HighPrio ${stamp}`,
    filters: { status: "", user_id: null, label: null, priority: "high", archived: false, sort_mode: "due_date", group_by: "none" },
  });
  const viewId = saved.saved_id;
  const listed = await api.send({ type: "maintenance_supporter/views/list" });
  const view = listed.views.find((v) => v.id === viewId);
  assert(view && view.filters.priority === "high", "views/save round-trips the priority filter");

  // 3. Notification view-scope honours priority.
  const settings = await api.send({ type: "maintenance_supporter/settings" });
  const g = settings.settings || settings;
  savedGlobals = {
    notifications_enabled: g.notifications_enabled ?? false,
    notify_service: g.notify_service ?? "",
    notify_scope_view_id: g.notify_scope_view_id ?? "",
    notify_overdue_enabled: g.notify_overdue_enabled ?? true,
    // Quiet hours default ON (22:00-08:00) and would silently swallow the
    // notification when this check runs in the evening — disable for the test.
    quiet_hours_enabled: g.quiet_hours_enabled ?? true,
  };
  await api.send({
    type: "maintenance_supporter/global/update",
    settings: {
      notifications_enabled: true,
      notify_service: "persistent_notification",
      notify_scope_view_id: viewId,
      notify_overdue_enabled: true,
      quiet_hours_enabled: false,
    },
  });

  // Flip both tasks ok -> overdue WITHOUT an entry reload: task/update
  // writes entry.data and reloads the entry, whose fresh coordinator SEEDS
  // the already-overdue status instead of notifying (anti-burst by design).
  // task/reset writes the Store only — the running coordinator sees a live
  // status change on its next refresh, which is the real #134 path.
  const veryPast = new Date(Date.now() - 200 * 86400e3).toISOString().slice(0, 10);
  await api.send({ type: "maintenance_supporter/task/reset", entry_id: entryId, task_id: tHigh.task_id, date: veryPast });
  await api.send({ type: "maintenance_supporter/task/reset", entry_id: entryId, task_id: tLow.task_id, date: veryPast });
  await new Promise((r) => setTimeout(r, 12000)); // debounced refresh -> status change -> notify

  const notes = await api.send({ type: "persistent_notification/get" });
  const texts = (notes || []).map((n) => `${n.title || ""} ${n.message || ""}`).join(" || ");
  assert(/hightask/.test(texts), `high-priority overdue notified (${texts.slice(0, 120)})`);
  assert(!/lowtask/.test(texts), "low-priority overdue was filtered by the view scope");

  // ── Browser ──
  await api.send({
    type: "lovelace/dashboards/create", url_path: DASH_URL, title: `Prio ${stamp}`,
    mode: "storage", show_in_sidebar: false, require_admin: false,
  });
  dashCreated = true;
  await api.send({
    type: "lovelace/config/save", url_path: DASH_URL,
    config: { views: [{ title: "p", cards: [
      { type: "custom:maintenance-supporter-card", filter_objects: [objName], filter_priority: ["high"], show_actions: false },
    ] }] },
  });

  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 950 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });

  // 5. Card on a plain dashboard
  await p.goto(`${HA}/${DASH_URL}/0`, { waitUntil: "domcontentloaded", timeout: 30000 });
  let cardNames = [];
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    cardNames = await p.evaluate(() => {
      const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
        while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
          if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
          for (const k of (el.children || [])) st.push(k); } return o; };
      const card = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
      if (!card || !card.shadowRoot) return [];
      return [...card.shadowRoot.querySelectorAll(".task-name")].map((n) => (n.textContent || "").trim());
    }).catch(() => []);
    if (cardNames.length) break;
  }
  assert(cardNames.length === 1 && /hightask/.test(cardNames[0]),
    `card filter_priority shows only the high task (${JSON.stringify(cardNames)})`);

  // 4. Panel dropdown + filtering
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
  let panelUp = false;
  for (let i = 0; i < 30 && !panelUp; i++) {
    await p.waitForTimeout(1000);
    panelUp = await p.evaluate(() => {
      const deep = (pred) => { const st = [document.documentElement]; const o = []; let n = 0;
        while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
          if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
          for (const k of (el.children || [])) st.push(k); } return o; };
      window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }).catch(() => false);
  }
  assert(panelUp, "panel mounted");
  const panelCheck = await p.evaluate(({ obj }) => {
    const panel = window.__panel;
    panel._setOverviewTab ? panel._setOverviewTab("dashboard") : (panel._overviewTab = "dashboard");
    panel._filterPriority = "high";
    return new Promise((res) => setTimeout(() => {
      const rows = [...panel.shadowRoot.querySelectorAll("*")]
        .filter((el) => el.className && String(el.className).includes("task-name"))
        .map((el) => (el.textContent || "").trim());
      const mine = rows.filter((r) => /hightask|lowtask|plaintask/.test(r));
      const filters = panel._currentFilters;
      res({ mine, priorityInFilters: filters.priority });
    }, 1500));
  }, { obj: objName });
  assert(panelCheck.priorityInFilters === "high", "panel captures priority in _currentFilters (view save shape)");
  assert(panelCheck.mine.length === 1 && /hightask/.test(panelCheck.mine[0]),
    `panel priority filter narrows the list (${JSON.stringify(panelCheck.mine)})`);

  log("\nALL LIVE CHECKS PASSED");
  process.exitCode = 0;
} catch (err) {
  console.error("ERROR:", err && (err.stack || err.message || err));
  process.exitCode = 1;
} finally {
  try {
    if (savedGlobals) await api.send({ type: "maintenance_supporter/global/update", settings: savedGlobals });
  } catch { /* ignore */ }
  try { if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }); } catch { /* ignore */ }
  try {
    const listed = await api.send({ type: "maintenance_supporter/views/list" });
    const mine = (listed.views || []).find((v) => v.name === `HighPrio ${stamp}`);
    if (mine) await api.send({ type: "maintenance_supporter/views/delete", view_id: mine.id });
  } catch { /* ignore */ }
  try { if (dashCreated) {
    const dashes = await api.send({ type: "lovelace/dashboards/list" });
    const d = (dashes || []).find((x) => x.url_path === DASH_URL);
    if (d) await api.send({ type: "lovelace/dashboards/delete", dashboard_id: d.id });
  } } catch { /* ignore */ }
  try { if (browser) await browser.close(); } catch { /* ignore */ }
  try { api.close(); } catch { /* ignore */ }
  process.exit(process.exitCode ?? 1);
}
