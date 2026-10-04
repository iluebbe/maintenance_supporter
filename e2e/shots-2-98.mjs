/** The docs pictures of the features after 2.97.1: Undo after Complete (the
 *  panel's toast), the parts a deleted completion returns (the confirm names
 *  them), and the dashboard card's document chips in a dashboard column.
 *  Dark theme, on the seeded demo instance. Leaves it as it found it: the
 *  completions are undone (task/undo), the delete is declined, the card's
 *  demo object and dashboard are removed again.
 *  Prereqs: seeded ha-shots + playwright-server running. */
import { chromium } from "@playwright/test";
import { haLogin, watchdog, wsClient } from "./ws-client.mjs";

const REST = "http://127.0.0.1:8131", HA = "http://ha-shots:8123", PW_WS = "ws://127.0.0.1:3000/";
const OUT = new URL("../docs/images/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const log = (...a) => console.log(...a);
// One picture only: node shots-2-98.mjs history-delete-parts.png
const only = process.argv[2];
const want = (name) => !only || only === name;
watchdog(10 * 60e3, "2.98 shots");

const DEEP = `const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
  while (st.length && n < 80000) { const el = st.pop(); n++; if (!el) continue;
    if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
    for (const k of (el.children || [])) st.push(k); } return o; };
  window.__deep = deep;
  window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];`;

const token = await haLogin(REST, { user: "demo", pass: "demo-pass-1", cid: HA + "/" });
const api = await wsClient(REST, token);
const b = await chromium.connect(PW_WS, { timeout: 20000 });
const tokensInit = ({ t, ha }) => {
  localStorage.setItem("hassTokens", JSON.stringify({
    access_token: t, token_type: "Bearer", expires_in: 1800,
    hassUrl: ha, clientId: ha + "/", expires: Date.now() + 9e11, refresh_token: "",
  }));
  localStorage.setItem("msp-overview-tab", '"dashboard"');
};
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, colorScheme: "dark" });
await ctx.addInitScript(tokensInit, { t: token, ha: HA });
const p = await ctx.newPage();
const failures = [];

async function openPanel() {
  await p.goto(HA + "/maintenance-supporter", { waitUntil: "domcontentloaded" });
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(1000);
    const ok = await p.evaluate(({ d }) => { eval(d); return !!window.__panel && Array.isArray(window.__panel._objects) && window.__panel._objects.length > 0; }, { d: DEEP }).catch(() => false);
    if (ok) break;
  }
  await p.waitForTimeout(1200);
}

async function panelClip(height = 1000) {
  return p.evaluate(({ d, height }) => {
    eval(d);
    const r = window.__panel.getBoundingClientRect();
    return { x: Math.max(0, r.x), y: 0, width: Math.min(r.width, 1600), height };
  }, { d: DEEP, height });
}

/** Take back the demo user's last completion of that task (the toast's Undo). */
async function undo(entryId, taskId) {
  const res = await api.send({ type: "maintenance_supporter/task/undo", entry_id: entryId, task_id: taskId }).catch((e) => ({ error: String(e && e.message || e) }));
  log("UNDO", JSON.stringify(res));
}

// 1. The toast after a Complete in the panel: "Completed: … — Undo". The
//    completion is taken back right after the picture.
if (want("undo-toast.png")) {
  try {
    log("STEP undo-toast.png");
    await openPanel();
    const target = await p.evaluate(async ({ d }) => {
      eval(d);
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const panel = window.__panel;
      let pick = null;
      for (const o of panel._objects) {
        for (const t of o.tasks) {
          if (!["overdue", "due_soon"].includes(t.status)) continue;
          if (t.require_tag_scan || (t.required_completion_fields || []).length || t.type === "reading" || t.part_ref) continue;
          if ((t.consumes_parts || []).length || t.on_complete_action) continue;
          pick = { entry: o.entry_id, task: t.id, name: t.name };
          break;
        }
        if (pick) break;
      }
      if (!pick) return null;
      panel._openCompleteDialog(pick.entry, pick.task, pick.name, undefined, false);
      let dlg = null;
      for (let i = 0; i < 20; i++) {
        await sleep(250);
        dlg = panel.shadowRoot.querySelector("maintenance-complete-dialog");
        if (dlg?.shadowRoot?.querySelector(".dialog-actions ha-button")) break;
      }
      const buttons = [...dlg.shadowRoot.querySelectorAll(".dialog-actions ha-button")];
      buttons[buttons.length - 1].click();
      for (let i = 0; i < 24 && !panel.shadowRoot.querySelector(".toast-undo"); i++) await sleep(250);
      return pick;
    }, { d: DEEP });
    if (!target) throw new Error("no task to complete");
    await p.waitForTimeout(700);
    const toast = await p.evaluate(({ d }) => { eval(d); const t = window.__panel.shadowRoot.querySelector(".toast"); return t ? t.textContent.replace(/\s+/g, " ").trim() : ""; }, { d: DEEP });
    if (!/Undo/.test(toast)) throw new Error("no Undo in the toast: " + toast);
    await p.screenshot({ path: OUT + "undo-toast.png", clip: await panelClip() });
    log("SHOT undo-toast.png", JSON.stringify(toast));
    await undo(target.entry, target.task);
  } catch (e) {
    failures.push("undo-toast.png");
    log("FAIL undo-toast.png", String(e && e.message || e).slice(0, 200));
  }
}

// 2. Deleting a completion: the confirm names the parts that go back to
//    stock. A completion with parts is recorded for the picture, the delete
//    declined, the completion undone.
if (want("history-delete-parts.png")) {
  try {
    log("STEP history-delete-parts.png");
    const objects = (await api.send({ type: "maintenance_supporter/objects" })).objects || [];
    let found = null;
    for (const o of objects) {
      for (const t of o.tasks) {
        if ((t.consumes_parts || []).length && !(t.required_completion_fields || []).length && !t.require_tag_scan && t.type !== "reading") {
          found = { o, t };
          break;
        }
      }
      if (found) break;
    }
    if (!found) throw new Error("no task with parts in the demo");
    const links = found.t.consumes_parts.slice(0, 2).map((l) => ({ ...l, quantity: l.quantity || 1 }));
    await api.send({ type: "maintenance_supporter/task/complete", entry_id: found.o.entry_id, task_id: found.t.id, used_parts: links, notes: "Swapped in a spare from stock" });
    await openPanel();
    const opened = await p.evaluate(async ({ d, entry, task }) => {
      eval(d);
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const panel = window.__panel;
      await panel._loadData();
      panel._showTask(entry, task);
      await sleep(1500);
      const t = panel._getTask(entry, task);
      const latest = [...(t.history || [])].filter((h) => h.type === "completed").sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))[0];
      if (!latest || !(latest.used_parts || []).length) return "no completion with parts";
      panel._openHistoryEdit(latest);
      let dlg = null;
      for (let i = 0; i < 20; i++) {
        await sleep(250);
        dlg = panel.shadowRoot.querySelector("maintenance-history-edit-dialog");
        if (dlg?.shadowRoot?.querySelector("button.delete-entry")) break;
      }
      dlg.shadowRoot.querySelector("button.delete-entry").click();
      for (let i = 0; i < 20; i++) {
        await sleep(250);
        const c = window.__deep((el) => el.tagName === "MAINTENANCE-CONFIRM-DIALOG" && el.shadowRoot && el.shadowRoot.querySelector("ha-dialog[open], ha-dialog"))[0];
        if (c && /stock/.test(c.shadowRoot.textContent || "")) return "confirm open";
      }
      return "confirm not found";
    }, { d: DEEP, entry: found.o.entry_id, task: found.t.id });
    if (opened !== "confirm open") throw new Error(opened);
    await p.waitForTimeout(900);
    await p.screenshot({ path: OUT + "history-delete-parts.png", clip: await panelClip() });
    log("SHOT history-delete-parts.png");
    // Decline, close the editor, take the completion back.
    await p.evaluate(({ d }) => {
      eval(d);
      const c = window.__deep((el) => el.tagName === "MAINTENANCE-CONFIRM-DIALOG" && el.shadowRoot)[0];
      const buttons = c ? [...c.shadowRoot.querySelectorAll(".dialog-actions ha-button")] : [];
      buttons[0]?.click();
    }, { d: DEEP });
    await p.waitForTimeout(600);
    await undo(found.o.entry_id, found.t.id);
  } catch (e) {
    failures.push("history-delete-parts.png");
    log("FAIL history-delete-parts.png", String(e && e.message || e).slice(0, 200));
  }
}
await ctx.close();

// 3. The dashboard card in an ordinary dashboard column: the document chips
//    on a line of their own under each task, two at most and "+N". A small
//    demo object of its own, removed again afterwards.
if (want("card-docs-column.png")) {
  const OBJ = "3D Printer";
  const URL_PATH = "demo-card-docs-shot";
  let entryId = null;
  let dashboardId = null;
  try {
    log("STEP card-docs-column.png");
    const svc = await fetch(REST + "/api/services/maintenance_supporter/add_object?return_response", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ name: OBJ, manufacturer: "Prusa", model: "MK4" }),
    }).then((r) => r.json());
    entryId = (svc.service_response ?? svc).entry_id;
    const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
    const task = (name, interval, last, extra = {}) =>
      api.send({ type: "maintenance_supporter/task/create", entry_id: entryId, name, task_type: "cleaning", interval_days: interval, last_performed: daysAgo(last), warning_days: 7, ...extra });
    await task("Replace the PTFE tube", 180, 220, { task_type: "replacement", documentation_url: "https://example.invalid/ptfe-tube" });
    await task("Clean the print bed", 14, 38);
    await task("Lubricate the rails", 90, 120, { task_type: "service" });
    await task("Check the belt tension", 60, 75, { task_type: "inspection" });
    await new Promise((r) => setTimeout(r, 4000));
    const obj = ((await api.send({ type: "maintenance_supporter/objects" })).objects || []).find((o) => o.entry_id === entryId);
    const tid = (name) => obj.tasks.find((t) => t.name === name).id;
    const link = async (title, tags, taskName) => {
      const doc = await api.send({ type: "maintenance_supporter/documents/add_link", entry_id: entryId, url: `https://example.invalid/${encodeURIComponent(title)}`, title, tags });
      await api.send({ type: "maintenance_supporter/documents/update", doc_id: doc.document?.id ?? doc.id, task_ids: [tid(taskName)] });
    };
    await link("Print bed cleaning guide", ["manual"], "Clean the print bed");
    await link("PEI sheet care sheet", ["manual"], "Clean the print bed");
    await link("Spare parts list", ["spare_parts"], "Clean the print bed");
    await link("Maintenance manual MK4.pdf", ["manual"], "Lubricate the rails");

    const dashboards = await api.send({ type: "lovelace/dashboards/list" });
    const stale = (dashboards || []).find((x) => x.url_path === URL_PATH);
    dashboardId = stale ? stale.id : (await api.send({ type: "lovelace/dashboards/create", url_path: URL_PATH, title: "Card docs", mode: "storage", show_in_sidebar: false })).id;
    await api.send({
      type: "lovelace/config/save",
      url_path: URL_PATH,
      config: { views: [{ title: "Card", cards: [{ type: "custom:maintenance-supporter-card", title: "Workshop", filter_objects: [OBJ] }] }] },
    });

    const cctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
    await cctx.addInitScript(tokensInit, { t: token, ha: HA });
    const cp = await cctx.newPage();
    await cp.goto(`${HA}/${URL_PATH}/0`, { waitUntil: "domcontentloaded" });
    let info = null;
    for (let i = 0; i < 40 && !info; i++) {
      await cp.waitForTimeout(750);
      info = await cp.evaluate(({ d }) => {
        eval(d);
        const card = window.__deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-CARD")[0];
        const sr = card && card.shadowRoot;
        if (!sr || sr.querySelectorAll(".task-item").length < 4) return null;
        const bed = [...sr.querySelectorAll(".task-item")].find((r) => r.textContent.includes("Clean the print bed"));
        if (!bed || !bed.querySelector(".doc-more")) return null;
        window.__card = card;
        return { width: Math.round(card.getBoundingClientRect().width), chips: [...sr.querySelectorAll(".doc-chip")].map((c) => c.textContent.trim()) };
      }, { d: DEEP }).catch(() => null);
    }
    if (!info) throw new Error("the card did not show its chips");
    log("CARD", JSON.stringify(info));
    await cp.waitForTimeout(1200);
    const handle = await cp.evaluateHandle(() => window.__card);
    await handle.asElement().screenshot({ path: OUT + "card-docs-column.png" });
    log("SHOT card-docs-column.png");
    await cctx.close();
  } catch (e) {
    failures.push("card-docs-column.png");
    log("FAIL card-docs-column.png", String(e && e.message || e).slice(0, 200));
  } finally {
    if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
    if (dashboardId) await api.send({ type: "lovelace/dashboards/delete", dashboard_id: dashboardId }).catch(() => {});
  }
}

api.close();
await b.close();
if (failures.length) {
  console.error("FAILED:", failures.join(", "));
  process.exit(1);
}
process.exit(0);
