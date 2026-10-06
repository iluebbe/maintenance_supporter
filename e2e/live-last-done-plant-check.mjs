/** Live check on ha-maint for D#203 (last done instead of a dash) and #204
 *  (plant entities as trigger sources).
 *
 *   1. A manual task done 23 days ago shows "done 23 d ago", muted, in the
 *      dashboard row, on its object page and on the Lovelace card; a task
 *      never done keeps "—"; a task with a due date keeps its days.
 *   2. A paused task (no due date while paused) shows when it was last done.
 *   3. #204: the task dialog's trigger picker offers plant entities; a
 *      state-change trigger on plant.<name> → "problem" makes the task
 *      triggered, and back to "ok" completes it by itself.
 *
 *  The plant is a REST state (no Plant Monitor install): the catalog side
 *  (registry device → "Check Plant") is pinned by tests/test_plant_monitor_204.py
 *  and the adoption sweep. Seeds throwaway objects + a dashboard; cleans up.
 */
import { chromium } from "@playwright/test";
import { DEEP_SRC, hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
watchdog(6 * 60e3, "last-done / plant live check");

const token = loadToken();
const api = await wsClient(REST, token);
const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
const stamp = Date.now() % 100000;
const PLANT = `plant.ficus_${stamp}`;
const DASH = `lastdone-${stamp}`;
const LABEL = `lastdone${stamp}`;
let pc = null, ficus = null, browser = null, dash = false;

const setState = (entity, state) =>
  fetch(`${REST}/api/states/${entity}`, { method: "POST", headers, body: JSON.stringify({ state, attributes: { friendly_name: "Ficus" } }) });
const daysAgo = (n) => { const d = new Date(Date.now() - n * 86400e3); return d.toISOString().slice(0, 10); };
const taskOf = async (entry, name) => {
  const { objects } = await api.send({ type: "maintenance_supporter/objects" });
  return objects.find((o) => o.entry_id === entry).tasks.find((t) => t.name === name);
};

try {
  // ── Seed ──
  pc = (await api.send({ type: "maintenance_supporter/object/create", name: `PC ${stamp}` })).entry_id;
  await api.send({ type: "maintenance_supporter/task/create", entry_id: pc, name: "Dust the case", schedule_type: "manual", last_performed: daysAgo(23), labels: [LABEL] });
  await api.send({ type: "maintenance_supporter/task/create", entry_id: pc, name: "Replace thermal paste", schedule_type: "manual", labels: [LABEL] });
  await api.send({ type: "maintenance_supporter/task/create", entry_id: pc, name: "Clean the filter", schedule_type: "time_based", interval_days: 30, last_performed: daysAgo(20), labels: [LABEL] });
  const paused = await api.send({ type: "maintenance_supporter/task/create", entry_id: pc, name: "Reseat the RAM", schedule_type: "time_based", interval_days: 90, last_performed: daysAgo(12), labels: [LABEL] });
  await api.send({ type: "maintenance_supporter/task/pause", entry_id: pc, task_id: paused.task_id });

  await setState(PLANT, "ok");
  ficus = (await api.send({ type: "maintenance_supporter/object/create", name: `Ficus ${stamp}` })).entry_id;
  const check = await api.send({
    type: "maintenance_supporter/task/create", entry_id: ficus, name: "Check Plant", schedule_type: "sensor_based",
    trigger_config: { type: "state_change", entity_id: PLANT, entity_ids: [PLANT], trigger_to_state: "problem", trigger_target_changes: 1, auto_complete_on_recovery: true },
  });
  assert(!!check.task_id, "a state-change trigger on a plant entity is accepted");

  const dust = await taskOf(pc, "Dust the case");
  assert(dust.days_until_due == null && String(dust.last_performed).startsWith(daysAgo(23)), `manual task: no due date, last done ${dust.last_performed}`);
  const ram = await taskOf(pc, "Reseat the RAM");
  log("  paused task:", JSON.stringify({ status: ram.status, days: ram.days_until_due, last: ram.last_performed }));

  // 3. Plant engine
  await setState(PLANT, "problem");
  await sleep(12000);
  assert((await taskOf(ficus, "Check Plant")).status === "triggered", "plant reports a problem → task triggered");
  await setState(PLANT, "ok");
  await sleep(12000);
  const healed = await taskOf(ficus, "Check Plant");
  const hist = (healed.history || []).map((h) => h.type);
  assert(healed.status === "ok" && hist.includes("completed"), `back to ok → completed by itself (${hist.join(",")})`);

  // Card dashboard
  await api.send({ type: "lovelace/dashboards/create", url_path: DASH, title: `Last done ${stamp}`, mode: "storage", show_in_sidebar: false, require_admin: false });
  dash = true;
  await api.send({ type: "lovelace/config/save", url_path: DASH, config: { views: [{ title: "x", cards: [{ type: "custom:maintenance-supporter-card", filter_objects: [`PC ${stamp}`], show_actions: false }] }] } });

  // ── Browser ──
  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 950 } });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });

  await p.goto(`${HA}/${DASH}/0`, { waitUntil: "domcontentloaded", timeout: 30000 });
  let card = null;
  for (let i = 0; i < 30 && !card; i++) {
    await p.waitForTimeout(1000);
    card = await p.evaluate(`(() => { ${DEEP_SRC}
      const c = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
      if (!c || !c.shadowRoot || c.shadowRoot.querySelectorAll(".task-item").length < 4) return null;
      const out = {};
      for (const r of c.shadowRoot.querySelectorAll(".task-item")) out[r.querySelector(".task-name").textContent.trim()] = { due: r.querySelector(".task-due").textContent.trim(), muted: !!r.querySelector(".task-due .last-done") };
      return out;
    })()`).catch(() => null);
  }
  log("  card:", JSON.stringify(card));
  assert(card && card["Dust the case"].due === "done 23 d ago" && card["Dust the case"].muted, "card: done 23 d ago");
  assert(card["Replace thermal paste"].due === "—", "card: never done keeps the dash");
  assert(/days?$/.test(card["Clean the filter"].due), "card: a due date keeps its days");

  await p.goto(`${HA}/maintenance-supporter`, { waitUntil: "domcontentloaded", timeout: 30000 });
  let up = false;
  for (let i = 0; i < 30 && !up; i++) {
    await p.waitForTimeout(1000);
    up = await p.evaluate(`(() => { ${DEEP_SRC}
      window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
      return !!window.__panel && (window.__panel._objects || []).some((o) => o.entry_id === ${JSON.stringify(pc)});
    })()`).catch(() => false);
  }
  assert(up, "panel mounted");
  const ui = await p.evaluate(async ({ pc, ficus, label }) => {
    const panel = window.__panel;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const rows = () => {
      const out = {};
      for (const r of panel.shadowRoot.querySelectorAll(".task-row")) {
        const name = r.querySelector(".task-name")?.textContent?.trim() || "";
        const due = r.querySelector(".due-text");
        if (due) out[name.replace(/^#\S+\s*/, "")] = { due: due.textContent.trim(), muted: due.classList.contains("last-done") };
      }
      return out;
    };
    panel._view = "overview";
    if (panel._setOverviewTab) panel._setOverviewTab("dashboard");
    panel._filterStatus = ""; panel._filterUser = null; panel._filterPriority = ""; panel._filterPlace = "";
    panel._filterLabel = label;
    await wait(1500);
    const dashboard = rows();
    panel._showObject(pc);
    await wait(1500);
    const objectPage = rows();
    // #204: the trigger picker of the plant task offers plant entities.
    const obj = panel._objects.find((o) => o.entry_id === ficus);
    const task = obj.tasks.find((t) => t.name === "Check Plant");
    const dlg = await panel._ui("maintenance-task-dialog");
    dlg.openEdit(ficus, task);
    await wait(2000);
    const pickers = [];
    const walk = (root) => { for (const el of root.querySelectorAll("*")) { if (el.includeDomains) pickers.push([...el.includeDomains]); if (el.schema && Array.isArray(el.schema)) for (const s of el.schema) { const d = s?.selector?.entity?.domain; if (d) pickers.push([].concat(d)); } if (el.shadowRoot) walk(el.shadowRoot); } };
    walk(dlg.shadowRoot);
    dlg._open = false;
    return { dashboard, objectPage, pickers };
  }, { pc, ficus, label: LABEL });
  log("  ui:", JSON.stringify({ d: ui.dashboard, o: ui.objectPage, pickers: ui.pickers.slice(0, 3) }));
  const pick = (map, key) => Object.entries(map).find(([k]) => k.includes(key))?.[1];
  assert(pick(ui.dashboard, "Dust the case")?.due === "done 23 d ago" && pick(ui.dashboard, "Dust the case").muted, "dashboard: done 23 d ago, muted");
  assert(pick(ui.dashboard, "Replace thermal paste")?.due === "—", "dashboard: never done keeps the dash");
  assert(pick(ui.objectPage, "Dust the case")?.due === "done 23 d ago", "object page: done 23 d ago");
  const pausedRow = pick(ui.objectPage, "Reseat the RAM");
  log("  paused row:", JSON.stringify(pausedRow));
  assert(ui.pickers.some((d) => d.includes("plant")), "the trigger picker offers plant entities");
  assert(pausedRow?.due === "done 12 d ago" && pausedRow.muted, "a paused task shows when it was last done");
  await ctx.close();

  // 4. The longest translation (ru, "выполнено 23 дн. назад") stays inside
  //    its cell, wide and at phone width, in the panel and on the card.
  for (const width of [1400, 360]) {
    const c2 = await browser.newContext({ viewport: { width, height: 900 } });
    const p2 = await c2.newPage();
    await p2.addInitScript(hassTokensInit, { t: token, ha: HA });
    await p2.goto(`${HA}/maintenance-supporter`, { waitUntil: "domcontentloaded", timeout: 30000 });
    let ready = false;
    for (let i = 0; i < 30 && !ready; i++) {
      await p2.waitForTimeout(1000);
      ready = await p2.evaluate(`(() => { ${DEEP_SRC}
        window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
        return !!window.__panel && (window.__panel._objects || []).length > 0;
      })()`).catch(() => false);
    }
    const fit = await p2.evaluate(async ({ label }) => {
      const panel = window.__panel;
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      panel.hass = { ...panel.hass, language: "ru", locale: { ...(panel.hass.locale || {}), language: "ru" } };
      await wait(2500);
      panel._view = "overview";
      if (panel._setOverviewTab) panel._setOverviewTab("dashboard");
      panel._filterStatus = ""; panel._filterUser = null; panel._filterPriority = ""; panel._filterPlace = "";
      panel._filterLabel = label;
      await wait(1500);
      const out = { narrow: panel.hasAttribute("narrow"), texts: [], spill: [] };
      for (const row of panel.shadowRoot.querySelectorAll(".task-row")) {
        const due = row.querySelector(".due-text"), cell = row.querySelector(".due-cell"), acts = row.querySelector(".row-actions");
        if (!due || !cell) continue;
        const d = due.getBoundingClientRect(), c = cell.getBoundingClientRect(), r = row.getBoundingClientRect();
        out.texts.push(due.textContent.trim());
        if (d.right > c.right + 1 || d.left < c.left - 1 || d.right > r.right + 1) out.spill.push(`${due.textContent.trim()} (cell)`);
        if (acts) {
          const a = acts.getBoundingClientRect();
          const overlap = d.right > a.left + 1 && d.left < a.right - 1 && d.bottom > a.top + 1 && d.top < a.bottom - 1;
          if (overlap) out.spill.push(`${due.textContent.trim()} (actions)`);
        }
      }
      return out;
    }, { label: LABEL });
    log(`  ru @${width}px:`, JSON.stringify(fit));
    assert(fit.texts.some((x) => /назад/.test(x)), `ru text rendered @${width}px`);
    assert(fit.spill.length === 0, `nothing spills @${width}px (narrow=${fit.narrow})`);

    await p2.goto(`${HA}/${DASH}/0`, { waitUntil: "domcontentloaded", timeout: 30000 });
    let cardFit = null;
    for (let i = 0; i < 30 && !cardFit; i++) {
      await p2.waitForTimeout(1000);
      cardFit = await p2.evaluate(`(async () => { ${DEEP_SRC}
        const c = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
        if (!c || !c.shadowRoot || c.shadowRoot.querySelectorAll(".task-item").length < 4) return null;
        c.hass = { ...c.hass, language: "ru", locale: { ...(c.hass.locale || {}), language: "ru" } };
        await new Promise((r) => setTimeout(r, 2500));
        const box = c.getBoundingClientRect();
        const spill = [], texts = [];
        for (const due of c.shadowRoot.querySelectorAll(".task-due")) {
          const d = due.getBoundingClientRect();
          texts.push(due.textContent.trim());
          if (d.right > box.right + 1 || d.left < box.left - 1) spill.push(due.textContent.trim());
        }
        for (const name of c.shadowRoot.querySelectorAll(".task-name")) {
          const n = name.getBoundingClientRect();
          if (n.width < 40) spill.push("name squeezed: " + name.textContent.trim());
        }
        return { texts, spill };
      })()`).catch(() => null);
    }
    log(`  card ru @${width}px:`, JSON.stringify(cardFit));
    assert(cardFit && cardFit.texts.some((x) => /назад/.test(x)) && cardFit.spill.length === 0, `card: fits @${width}px`);
    await c2.close();
  }

  log("\nALL LIVE CHECKS PASSED");
  process.exitCode = 0;
} catch (err) {
  console.error("ERROR:", err && (err.stack || err.message || err));
  process.exitCode = 1;
} finally {
  for (const id of [pc, ficus]) { try { if (id) await api.send({ type: "maintenance_supporter/object/delete", entry_id: id }); } catch { /* ignore */ } }
  try { await fetch(`${REST}/api/states/${PLANT}`, { method: "DELETE", headers }); } catch { /* ignore */ }
  try { if (dash) {
    const ds = await api.send({ type: "lovelace/dashboards/list" });
    const d = (ds || []).find((x) => x.url_path === DASH);
    if (d) await api.send({ type: "lovelace/dashboards/delete", dashboard_id: d.id });
  } } catch { /* ignore */ }
  try { if (browser) await browser.close(); } catch { /* ignore */ }
  api.close();
}
