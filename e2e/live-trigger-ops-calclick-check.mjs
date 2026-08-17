/** Live check on ha-maint for the 2026-08 trigger-operators + calendar-card round.
 *
 *  Backend (WS/REST):
 *   1. threshold trigger_equals validates, persists, and FIRES when the sensor
 *      hits the exact level (task sensor state -> triggered).
 *   2. trigger_not_equals fires when the value leaves the expected level.
 *   3. trigger_combinator=all: an active trigger with a not-yet-elapsed safety
 *      interval stays un-actioned (ok/due states), and actions once the
 *      interval leg is met too.
 *  Browser (plain dashboard, no strategy bundle):
 *   4. Calendar-card future-event click opens the task quick-actions dialog.
 *   5. Calendar-card past-event click opens the history-edit dialog.
 *   6. The card editor renders localized labels (no raw cal_editor_* keys).
 *   7. Task dialog shows the =/≠ inputs and the combinator select.
 *
 *  Seeds one throwaway object + one throwaway dashboard, removes both.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(8 * 60e3, "trigger-ops live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const objName = `eqdemo${stamp}`;
let entryId = null;
let browser = null;
let dashCreated = false;
const DASH_URL = `calclick-${stamp}`;

const setSensor = async (entity, state, attrs = {}) => {
  const r = await fetch(`${REST}/api/states/${entity}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ state: String(state), attributes: { unit_of_measurement: "lvl", ...attrs } }),
  });
  if (!r.ok) fail(`states/set ${entity} -> ${r.status}`);
};

const taskSensorState = async (suffix) => {
  const r = await fetch(`${REST}/api/states/sensor.${objName}_${suffix}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return null;
  return r.json();
};

const waitForState = async (suffix, want, tries = 25) => {
  for (let i = 0; i < tries; i++) {
    const st = await taskSensorState(suffix);
    if (st && st.state === want) return st;
    await new Promise((res) => setTimeout(res, 1000));
  }
  return null;
};

const deepFind = `
  window.__deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
`;

try {
  // ── Seed sensors first (so trigger setup sees a live state) ──
  await setSensor(`sensor.eqsrc${stamp}`, 1);
  await setSensor(`sensor.nesrc${stamp}`, 1);
  await setSensor(`sensor.combsrc${stamp}`, 0);

  // ── Seed object + tasks ──
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: objName });
  entryId = obj.entry_id;

  const tEq = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "eqtask", schedule_type: "sensor_based",
    trigger_config: { type: "threshold", entity_id: `sensor.eqsrc${stamp}`, trigger_equals: 3 },
  });
  const tNe = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "netask", schedule_type: "sensor_based",
    trigger_config: { type: "threshold", entity_id: `sensor.nesrc${stamp}`, trigger_not_equals: 1 },
  });
  // Combinator task: trigger will fire, but the 30d safety interval has not
  // elapsed -> must NOT action. Give it a history completion "now" so the
  // interval leg is fresh.
  const tComb = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "combtask", schedule_type: "sensor_based", interval_days: 30,
    trigger_config: {
      type: "threshold", entity_id: `sensor.combsrc${stamp}`,
      trigger_above: 5, trigger_combinator: "all",
    },
  });
  await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: tComb.task_id });
  // A future-due plain task for the calendar card click + one recorded history
  // entry (the completion above) for the past-event click.
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "caltask", schedule_type: "time_based", interval_days: 7,
  });

  // 1. equals round-trips
  const read = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  const eqStored = read.tasks.find((x) => x.id === tEq.task_id).trigger_config;
  assert(eqStored.trigger_equals === 3, "trigger_equals persisted through create+read");
  const combStored = read.tasks.find((x) => x.id === tComb.task_id).trigger_config;
  assert(combStored.trigger_combinator === "all", "trigger_combinator persisted");

  // equals fires on the exact level
  await setSensor(`sensor.eqsrc${stamp}`, 3);
  assert(await waitForState("eqtask", "triggered"), "trigger_equals fired at the exact level");
  const eqAttrs = (await taskSensorState("eqtask")).attributes;
  assert(eqAttrs.trigger_equals === 3, "sensor attributes expose trigger_equals");

  // 2. not_equals fires when the value leaves the level
  await setSensor(`sensor.nesrc${stamp}`, 2);
  assert(await waitForState("netask", "triggered"), "trigger_not_equals fired on deviation");

  // 3. combinator=all suppresses the fresh-interval task
  await setSensor(`sensor.combsrc${stamp}`, 9);
  await new Promise((res) => setTimeout(res, 12000)); // trigger event + refresh window
  const combState = await taskSensorState("combtask");
  assert(combState && combState.state !== "triggered",
    `combinator=all keeps a fresh task un-actioned (state=${combState && combState.state})`);
  assert(combState.attributes.trigger_active === true, "raw trigger_active is latched underneath");
  assert(combState.attributes.trigger_combinator === "all", "attrs expose trigger_combinator");

  // ── Browser: plain dashboard with the calendar card ──
  await api.send({
    type: "lovelace/dashboards/create", url_path: DASH_URL, title: `CalClick ${stamp}`,
    mode: "storage", show_in_sidebar: false, require_admin: false,
  });
  dashCreated = true;
  await api.send({
    type: "lovelace/config/save", url_path: DASH_URL,
    config: { views: [{ title: "cal", cards: [
      { type: "custom:maintenance-supporter-calendar-card", object_filter: objName },
      { type: "custom:maintenance-supporter-calendar-card", past_days: 30, object_filter: objName },
    ] }] },
  });

  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 950 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  await p.goto(`${HA}/${DASH_URL}/0`, { waitUntil: "domcontentloaded", timeout: 30000 });

  let cardsUp = false;
  for (let i = 0; i < 40 && !cardsUp; i++) {
    await p.waitForTimeout(1000);
    cardsUp = await p.evaluate(({ finder }) => {
      eval(finder);
      const cards = window.__deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CALENDAR-CARD");
      window.__cards = cards;
      return cards.length >= 2 && cards.every((c) => c.shadowRoot && c.shadowRoot.querySelector(".cal-event"));
    }, { finder: deepFind }).catch(() => false);
  }
  if (!cardsUp) {
    const diag = await p.evaluate(({ finder }) => {
      eval(finder);
      const errs = window.__deep((el) => el.tagName === "HUI-ERROR-CARD");
      return {
        url: location.href,
        title: document.title,
        cards: (window.__cards || []).map((c) => ({
          events: c.shadowRoot ? c.shadowRoot.querySelectorAll(".cal-event").length : -1,
          text: c.shadowRoot ? c.shadowRoot.textContent.replace(/\s+/g, " ").slice(0, 220) : null,
        })),
        errCards: errs.map((e) => ((e.shadowRoot || e).textContent || "").slice(0, 150)),
        bodyText: (document.body.innerText || "").replace(/\s+/g, " ").slice(0, 250),
      };
    }, { finder: deepFind });
    console.log("CARD DIAG:", JSON.stringify(diag, null, 1));
  }
  assert(cardsUp, "both calendar cards render events on a PLAIN dashboard");

  // 4. future event click -> task quick-actions dialog
  const qaOpened = await p.evaluate(() => {
    // deep() traversal order is not document order — pick the FORWARD card
    // (no past_days) explicitly.
    const card = window.__cards.find((c) => !c._pastDays);
    if (!card) return "no-forward-card";
    const ev = card.shadowRoot.querySelector(".cal-event");
    if (!ev) return "no-event";
    ev.click();
    return true;
  });
  assert(qaOpened === true, `clicked a future event (${qaOpened})`);
  await p.waitForTimeout(2500);
  const qaDiag = await p.evaluate(() => {
    const host = document.querySelector("home-assistant").shadowRoot;
    const inHost = host.querySelector("maintenance-task-quick-actions-dialog");
    const inBody = document.body.querySelector("maintenance-task-quick-actions-dialog");
    const dlg = inHost || inBody;
    return {
      inHost: !!inHost, inBody: !!inBody,
      open: dlg ? dlg._open : null,
      textLen: dlg && dlg.shadowRoot ? dlg.shadowRoot.textContent.trim().length : -1,
    };
  });
  const qaVisible = (qaDiag.inHost || qaDiag.inBody) && qaDiag.open !== false && qaDiag.textLen > 0;
  if (!qaVisible) console.log("QA DIAG:", JSON.stringify(qaDiag));
  assert(qaVisible, "task quick-actions dialog opened from the plain dashboard");
  await p.evaluate(() => {
    const host = document.querySelector("home-assistant").shadowRoot;
    const dlg = host.querySelector("maintenance-task-quick-actions-dialog");
    if (dlg && typeof dlg.close === "function") dlg.close();
    else if (dlg) dlg.remove();
  });

  // 5. past event click -> history edit dialog
  await p.waitForTimeout(500);
  const histClick = await p.evaluate(() => {
    const card = window.__cards.find((c) => c._pastDays > 0);
    if (!card) return "no-past-card";
    const evs = [...card.shadowRoot.querySelectorAll(".cal-event")];
    if (!evs.length) return "no-past-event";
    evs[0].click();
    return true;
  });
  assert(histClick === true, `clicked a past event (${histClick})`);
  await p.waitForTimeout(2000);
  const histVisible = await p.evaluate(() => {
    const host = document.querySelector("home-assistant").shadowRoot;
    const dlg = host.querySelector("maintenance-history-edit-dialog");
    return !!(dlg && dlg.shadowRoot && dlg.shadowRoot.textContent.trim().length > 0);
  });
  assert(histVisible, "history-edit dialog opened from the past-days card");

  // 6. editor labels are localized strings, not raw keys
  const editorCheck = await p.evaluate(async () => {
    const ed = document.createElement("maintenance-supporter-calendar-card-editor");
    ed.hass = document.querySelector("home-assistant").hass;
    ed.setConfig({ type: "custom:maintenance-supporter-calendar-card" });
    document.body.appendChild(ed);
    await new Promise((r) => setTimeout(r, 1200));
    const text = ed.shadowRoot ? ed.shadowRoot.textContent : "";
    ed.remove();
    return text;
  });
  assert(!/cal_editor_/.test(editorCheck), "editor shows no raw cal_editor_* keys");
  assert(/(Default window|Standard-Zeitfenster)/.test(editorCheck), "editor window label localized");
  assert(/(Fortnight|Zwei Wochen)/.test(editorCheck), "editor window options localized");

  // 7. panel task dialog: =/≠ inputs + combinator select
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded", timeout: 30000 });
  let panelUp = false;
  for (let i = 0; i < 30 && !panelUp; i++) {
    await p.waitForTimeout(1000);
    panelUp = await p.evaluate(({ finder }) => {
      eval(finder);
      window.__panel = window.__deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
      return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0;
    }, { finder: deepFind }).catch(() => false);
  }
  assert(panelUp, "panel mounted");
  const dialogCheck = await p.evaluate(async ({ e, t }) => {
    const panel = window.__panel;
    const obj = panel._objects.find((o) => o.entry_id === e);
    const task = obj.tasks.find((x) => x.id === t);
    const dlg = panel.shadowRoot.querySelector("maintenance-task-dialog");
    await dlg.openEdit(e, task);
    await new Promise((r) => setTimeout(r, 900));
    const fields = [...dlg.shadowRoot.querySelectorAll("ms-textfield")].map((f) => f.getAttribute("label") || f.label || "");
    const selects = [...dlg.shadowRoot.querySelectorAll("select")].map((s) => [...s.options].map((o) => o.textContent.trim()).join("|"));
    return { fields: fields.join(" ;; "), selects: selects.join(" // ") };
  }, { e: entryId, t: tComb.task_id });
  assert(/(equal to|genau)/i.test(dialogCheck.fields), "dialog has the = field");
  assert(/(different from|abweichend)/i.test(dialogCheck.fields), "dialog has the ≠ field");
  assert(/(whichever first|zuerst erfüllt)/i.test(dialogCheck.selects), "dialog has the combinator select");

  log("\nALL LIVE CHECKS PASSED");
  process.exitCode = 0;
} catch (err) {
  console.error("ERROR:", err && (err.stack || err.message || err));
  process.exitCode = 1;
} finally {
  try { if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }); } catch { /* ignore */ }
  try { if (dashCreated) {
    const dashes = await api.send({ type: "lovelace/dashboards/list" });
    const d = (dashes || []).find((x) => x.url_path === DASH_URL);
    if (d) await api.send({ type: "lovelace/dashboards/delete", dashboard_id: d.id });
  } } catch { /* ignore */ }
  try { if (browser) await browser.close(); } catch { /* ignore */ }
  try { api.close(); } catch { /* ignore */ }
  process.exit(process.exitCode ?? 1);
}
