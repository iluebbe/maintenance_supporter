/** Live UI test for the v2.26 wave against ha-maint, driven in a real browser.
 *
 * Proves with genuine browser events + screenshots:
 *   1. The panel's Label filter dropdown narrows the task table; the seeded
 *      saved view (label=garden) applies it via the Views dropdown.
 *   2. Settings → Notifications shows the "Notify only for view" picker fed
 *      by views/list; selecting a view persists notify_scope_view_id.
 *   3. A parts-row paperclip opens the part's linked-documents list.
 *   4. A Lovelace card with `view_id` shows only the view's tasks.
 *
 * Seeds its own object/tasks/part/doc/view over WS (admin token) and cleans
 * everything up, including the throwaway dashboard.
 */
import { chromium } from "@playwright/test";
import { loadToken, watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
// throw (not process.exit) so the finally-cleanup still runs on failure
const fail = (m) => { console.error("FAIL:", m); throw new Error("FAIL: " + m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "v2.26 UI test");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const OBJ = `UI Shed ${stamp}`, VIEW = `Garden UI ${stamp}`;
const cleanup = { entryId: null, viewId: null, docId: null, dashboardId: null };

try {
  // ── seed ────────────────────────────────────────────────────────────────────
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: OBJ });
  cleanup.entryId = obj.entry_id;
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: obj.entry_id,
    name: `Mow lawn ${stamp}`, interval_days: 14, labels: ["garden"],
  });
  await api.send({
    type: "maintenance_supporter/task/create", entry_id: obj.entry_id,
    name: `Descale kettle ${stamp}`, interval_days: 30, labels: ["kitchen"],
  });
  const part = await api.send({
    type: "maintenance_supporter/part/create", entry_id: obj.entry_id, name: `Blade set ${stamp}`, stock: 1,
  });
  const doc = await api.send({
    type: "maintenance_supporter/documents/add_link", entry_id: obj.entry_id,
    url: "https://example.com/blade-datasheet", title: `Blade datasheet ${stamp}`,
  });
  cleanup.docId = doc.id;
  await api.send({ type: "maintenance_supporter/documents/update", doc_id: doc.id, part_ids: [part.part_id] });
  const view = await api.send({
    type: "maintenance_supporter/views/save", name: VIEW,
    filters: { status: "", label: "garden", sort_mode: "due_date", group_by: "none" },
  });
  cleanup.viewId = view.saved_id;
  log("seeded:", OBJ, "+ 2 labeled tasks, part+doc, view", VIEW);

  // ── browser ─────────────────────────────────────────────────────────────────
  const deepFindPanel = `
    const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
      while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  `;
  const b = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: "dark", deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.addInitScript(hassTokensInit, { t: token, ha: HA });
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
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

  /** Run fn(panel) in-page; fn is passed as SOURCE (closures don't serialize). */
  const inPanel = (src, arg) => p.evaluate(({ finder, body, a }) => {
    eval(finder);
    return eval(`(${body})`)(window.__panel, a);
  }, { finder: deepFindPanel, body: src, a: arg ?? null });

  // ── 1. label filter dropdown ────────────────────────────────────────────────
  log("1. panel label filter");
  await inPanel(`(panel) => { panel._view = "overview"; panel._overviewTab = "dashboard"; }`);
  await p.waitForTimeout(800);
  const hasDropdown = await inPanel(`(panel) => {
    const sels = [...panel.shadowRoot.querySelectorAll(".filter-field select")];
    const dd = sels.find((s) => [...s.options].some((o) => o.value === "garden"));
    if (!dd) return false;
    dd.value = "garden";
    dd.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }`);
  assert(hasDropdown, "label dropdown renders with the seeded label and accepts 'garden'");
  await p.waitForTimeout(600);
  const afterLabel = await inPanel(`(panel) => ({
    label: panel._filterLabel,
    rows: panel._taskRows.map((r) => r.task_name),
  })`);
  assert(afterLabel.label === "garden", "panel filter state = garden");
  assert(afterLabel.rows.some((n) => n.startsWith("Mow lawn")),
    `garden task visible (rows: ${JSON.stringify(afterLabel.rows)})`);
  assert(!afterLabel.rows.some((n) => n.startsWith("Descale kettle")), "kitchen task filtered out");
  await p.screenshot({ path: `${OUT}/v226-1-label-filter.png` });

  // reset, then apply the saved view through the Views dropdown (real event)
  await inPanel(`(panel) => { panel._filterLabel = null; }`);
  const applied = await inPanel(`(panel, vid) => {
    const sels = [...panel.shadowRoot.querySelectorAll("select")];
    const dd = sels.find((s) => [...s.options].some((o) => o.value === vid));
    if (!dd) return false;
    dd.value = vid;
    dd.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }`, cleanup.viewId);
  assert(applied, "views dropdown lists the seeded view");
  await p.waitForTimeout(600);
  const afterView = await inPanel(`(panel) => panel._filterLabel`);
  assert(afterView === "garden", "applying the saved view restores its label filter");

  // ── 2. settings scope picker ────────────────────────────────────────────────
  log("2. notification scope picker");
  await inPanel(`(panel) => { panel._overviewTab = "settings"; }`);
  await p.waitForTimeout(1500);
  const scopeSet = await inPanel(`(panel, vid) => {
    const sv = panel.shadowRoot.querySelector("maintenance-settings-view");
    if (!sv || !sv.shadowRoot) return "no settings view";
    const sels = [...sv.shadowRoot.querySelectorAll("select")];
    const dd = sels.find((s) => [...s.options].some((o) => o.value === vid));
    if (!dd) return "no scope select with the view";
    dd.value = vid;
    dd.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }`, cleanup.viewId);
  assert(scopeSet === true, `scope picker offers the view and accepts it (${scopeSet})`);
  await p.waitForTimeout(900);
  const persisted = await api.send({ type: "maintenance_supporter/settings" });
  assert(persisted.notifications.scope_view_id === cleanup.viewId, "notify_scope_view_id persisted from the UI");
  const scopeSel = await p.evaluateHandle(({ finder }) => {
    eval(finder);
    const sv = window.__panel.shadowRoot.querySelector("maintenance-settings-view");
    const sels = [...sv.shadowRoot.querySelectorAll("select")];
    return sels.find((s) => [...s.options].some((o) => o.textContent.includes("Garden UI")));
  }, { finder: deepFindPanel });
  await scopeSel.asElement().scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${OUT}/v226-2-notify-scope.png` });
  await api.send({ type: "maintenance_supporter/global/update", settings: { notify_scope_view_id: "" } });

  // ── 3. parts paperclip → linked documents ───────────────────────────────────
  log("3. part documents");
  await inPanel(`(panel, eid) => panel._showObject(eid)`, cleanup.entryId);
  await p.waitForTimeout(1200);
  const clipClicked = await inPanel(`(panel) => {
    const ps = panel.shadowRoot.querySelector("maintenance-parts-section");
    if (!ps || !ps.shadowRoot) return "no parts section";
    const clip = [...ps.shadowRoot.querySelectorAll("ha-icon-button")]
      .find((b) => b.querySelector('ha-icon[icon="mdi:paperclip"]'));
    if (!clip) return "no paperclip";
    clip.click();
    return true;
  }`);
  assert(clipClicked === true, `paperclip on the part row clicked (${clipClicked})`);
  await p.waitForTimeout(900);
  const partDocs = await inPanel(`(panel) => {
    const ps = panel.shadowRoot.querySelector("maintenance-parts-section");
    const td = ps.shadowRoot.querySelector("maintenance-task-documents");
    if (!td || !td.shadowRoot) return "no docs component";
    const titles = [...td.shadowRoot.querySelectorAll(".tdoc-title")].map((n) => n.textContent.trim());
    return titles;
  }`);
  assert(Array.isArray(partDocs) && partDocs.some((t2) => t2.startsWith("Blade datasheet")),
    `part's document list shows the linked datasheet (${JSON.stringify(partDocs)})`);
  const partsEl = await p.evaluateHandle(({ finder }) => {
    eval(finder);
    return window.__panel.shadowRoot.querySelector("maintenance-parts-section");
  }, { finder: deepFindPanel });
  await partsEl.asElement().scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${OUT}/v226-3-part-docs.png` });

  // ── 4. Lovelace card scoped to the view ─────────────────────────────────────
  log("4. card with view_id");
  const dash = await api.send({
    type: "lovelace/dashboards/create", url_path: `v226-test-${stamp}`,
    title: `v226 test ${stamp}`, mode: "storage", show_in_sidebar: false, require_admin: false,
  });
  cleanup.dashboardId = dash.id;
  await api.send({
    type: "lovelace/config/save", url_path: `v226-test-${stamp}`,
    config: { views: [{ title: "Test", cards: [{
      type: "custom:maintenance-supporter-card",
      title: `Garden card ${stamp}`, view_id: cleanup.viewId, show_actions: false,
    }] }] },
  });
  await p.goto(HA + `/v226-test-${stamp}`, { waitUntil: "domcontentloaded" });
  let cardRows = null;
  for (let i = 0; i < 30 && !cardRows; i++) {
    await p.waitForTimeout(1000);
    cardRows = await p.evaluate(() => {
      const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
        while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
          if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
          for (const k of (el.children || [])) st.push(k); } return o; };
      const card = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
      if (!card || !card.shadowRoot) return null;
      const names = [...card.shadowRoot.querySelectorAll(".task-name")].map((n) => n.textContent.trim());
      return names.length ? names : null;
    }).catch(() => null);
  }
  assert(Array.isArray(cardRows), "card mounted with task rows");
  assert(cardRows.some((n) => n.startsWith("Mow lawn")), "card shows the view's garden task");
  assert(!cardRows.some((n) => n.startsWith("Descale kettle")), "card hides the non-matching task");
  await p.screenshot({ path: `${OUT}/v226-4-card-view.png` });

  log("ALL v2.26 UI CHECKS PASSED");
  await ctx.close();
  await b.close();
} finally {
  if (cleanup.dashboardId) await api.send({ type: "lovelace/dashboards/delete", dashboard_id: cleanup.dashboardId }).catch(() => {});
  if (cleanup.docId) await api.send({ type: "maintenance_supporter/documents/delete", doc_id: cleanup.docId }).catch(() => {});
  if (cleanup.entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: cleanup.entryId }).catch(() => {});
  if (cleanup.viewId) await api.send({ type: "maintenance_supporter/views/delete", view_id: cleanup.viewId }).catch(() => {});
  await api.send({ type: "maintenance_supporter/global/update", settings: { notify_scope_view_id: "" } }).catch(() => {});
  api.close();
  log("cleanup done");
}
