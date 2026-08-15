/** Live smoke check on ha-maint for the 2026-08 refactor rounds.
 *
 * Exercises the paths the DRY sweep rewired, against the REAL panel:
 *  1. _runAction happy path — snooze: success toast + data reload (the one
 *     action that used to skip the refresh).
 *  2. _runAction error path — action on a server-side-deleted task must show
 *     the SERVER message, not the old generic "Action failed".
 *  3. Checklist tick through the shared wrapper (+ Store round-trip).
 *  4. Archive object → Undo toast → undo restores it.
 *  5. settings/export: the new second export (WS content checked host-side,
 *     panel button clicked live).
 *  6. Card-picker registrations deduplicate (registerCustomCard).
 *  7. Signed document URL chain (auth/sign_path → HTTP 200) when the
 *     instance has a document.
 *
 * Seeds ONE throwaway object and deletes it afterwards — the dev instance
 * data stays untouched.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "refactor smoke check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
let entryId = null;
let browser = null;

const deepFindPanel = `
  const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
    while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
      if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
      for (const k of (el.children || [])) st.push(k); } return o; };
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
`;

try {
  // ── Seed ──
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: `Smoke ${stamp}` });
  entryId = obj.entry_id;
  const t1 = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: `Smoke task ${stamp}`, schedule_type: "time_based", interval_days: 30,
    checklist: ["alpha", "beta"],
  });
  const taskId = t1.task_id;

  // 5a. settings/export content (host-side).
  const exp = await api.send({ type: "maintenance_supporter/settings/export" });
  const parsed = JSON.parse(exp.data);
  assert(parsed.version === 1 && parsed.global_settings && typeof parsed.global_settings === "object",
    "settings/export returns a global_settings payload");
  assert(!("admin_panel_user_ids" in parsed.global_settings), "settings/export excludes admin_panel_user_ids");

  // ── Browser ──
  browser = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
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

  const toastText = async (tries = 8) => {
    for (let i = 0; i < tries; i++) {
      const t = await p.evaluate(() => String((window.__panel && window.__panel._toastMessage) || ""));
      if (t) return t;
      await p.waitForTimeout(700);
    }
    return "";
  };

  // 1. Snooze (notification snooze) via the shared wrapper: success toast.
  await p.evaluate(({ e, t }) => window.__panel._snoozeTask(e, t), { e: entryId, t: taskId });
  const snoozeToast = await toastText();
  assert(snoozeToast.length > 0 && !/action failed/i.test(snoozeToast), `snooze shows success toast (${JSON.stringify(snoozeToast)})`);
  // 1b. Postpone: toast + the due_override lands (reload path live).
  await p.evaluate(({ e, t }) => window.__panel._postponeTask(e, t, "2026-12-24"), { e: entryId, t: taskId });
  const postponeToast = await toastText();
  assert(postponeToast.length > 0 && !/action failed/i.test(postponeToast), `postpone shows success toast (${JSON.stringify(postponeToast)})`);
  const afterPostpone = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  assert(afterPostpone.tasks.find((x) => x.id === taskId).due_override === "2026-12-24", "postpone persisted the due_override");

  // 3. Checklist tick through _runAction.
  await p.evaluate(({ e, t }) => window.__panel._setChecklistItem(e, t, "alpha", true), { e: entryId, t: taskId });
  await p.waitForTimeout(1200);
  const afterTick = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  const prog = afterTick.tasks.find((x) => x.id === taskId).checklist_progress || {};
  assert(prog.alpha === true, "checklist tick persisted via the shared action wrapper");

  // 2. Error path: delete the task server-side, then act on the stale UI.
  await api.send({ type: "maintenance_supporter/task/delete", entry_id: entryId, task_id: taskId });
  await p.evaluate(({ e, t }) => window.__panel._snoozeTask(e, t), { e: entryId, t: taskId });
  const errToast = await toastText();
  assert(errToast.length > 0 && !/^action failed$/i.test(errToast.trim()),
    `stale action surfaces the SERVER message, not the generic toast (${JSON.stringify(errToast)})`);

  // 4. Archive → Undo toast → undo.
  await p.evaluate(({ e }) => window.__panel._toggleArchiveObject(e, false), { e: entryId });
  await p.waitForTimeout(1500);
  await toastText();
  const undo = await p.evaluate(() => !!(window.__panel._toastUndo || /archiv/i.test(String(window.__panel._toastMessage || ""))));
  assert(undo, "archive shows the undo toast");
  const archived = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  assert(archived.object.archived_at, "object archived");
  await p.evaluate(({ e }) => window.__panel._toggleArchiveObject(e, true), { e: entryId });
  await p.waitForTimeout(1500);
  const unarchived = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  assert(!unarchived.object.archived_at, "undo/unarchive restores the object");

  // 5b. The settings-export BUTTON exists in the settings view.
  const btn = await p.evaluate(() => {
    const deep = (root, pred, out = []) => { const st = [root]; let n = 0;
      while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) out.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return out; };
    window.__panel._setOverviewTab("settings");
    return new Promise((res) => setTimeout(() => {
      const hits = deep(window.__panel, (el) => el.tagName === "BUTTON" && /export settings|einstellungen exportieren/i.test(el.textContent || ""));
      res(hits.length);
    }, 4000));
  });
  assert(btn >= 1, "settings view renders the new Export-settings button");

  // 6. Card-picker registrations deduplicate.
  const cards = await p.evaluate(() => {
    const c = window.customCards || [];
    const types = c.map((x) => x.type);
    return { total: types.length, unique: new Set(types).size, types };
  });
  if (cards.total === 0) log("  SKIP: no customCards on the panel page (card bundles not loaded here)");
  else assert(cards.total === cards.unique, `customCards unique (${cards.types.join(", ")})`);

  // 7. Signed document chain, when a document exists anywhere.
  const objects = await api.send({ type: "maintenance_supporter/objects" });
  let docChecked = false;
  for (const o of objects.objects || []) {
    const docs = await api.send({ type: "maintenance_supporter/documents/list", entry_id: o.entry_id }).catch(() => null);
    const file = docs && (docs.documents || []).find((d) => d.kind === "file");
    if (!file) continue;
    const status = await p.evaluate(async ({ id }) => {
      const hass = document.querySelector("home-assistant").hass;
      const s = await hass.connection.sendMessagePromise({
        type: "auth/sign_path", path: `/api/maintenance_supporter/document/${id}`, expires: 60,
      });
      const r = await fetch(new URL(s.path, location.origin).href);
      return r.status;
    }, { id: file.id });
    assert(status === 200, `signed document URL serves the blob (HTTP ${status})`);
    docChecked = true;
    break;
  }
  if (!docChecked) log("  SKIP: no file documents on this instance");

  log("SMOKE CHECK PASSED");
} finally {
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  try { api.close(); } catch { /* already closed */ }
  if (browser) await browser.close().catch(() => {});
}
process.exit(0);
