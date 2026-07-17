/** Live check for #99 (per-completion parts selection) + the part-delete
 *  confirmation, on ha-maint.
 *
 *  Backend: WS complete with used_parts overrides the fixed link (0.5 works).
 *  UI: the complete dialog renders the editable "Parts used this time" list
 *  (prefilled from the fixed link); unticking the linked part and ticking the
 *  other one books exactly that against stock. Deleting a part first fires a
 *  confirm() — dismiss keeps it, accept deletes it. */
import { chromium } from "@playwright/test";
import { loadToken, watchdog, wsClient, hassTokensInit } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const OUT = process.argv[2] || ".";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "used-parts check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
let entryId = null;

const stocks = async () => {
  const objs = await api.send({ type: "maintenance_supporter/objects" });
  const obj = objs.objects.find((o) => o.entry_id === entryId);
  return Object.fromEntries((obj.parts || []).map((p2) => [p2.name, p2.stock]));
};

try {
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: `UsedParts ${stamp}` });
  entryId = obj.entry_id;
  await api.send({ type: "maintenance_supporter/part/create", entry_id: entryId, name: `Filter ${stamp}`, stock: 5 });
  await api.send({ type: "maintenance_supporter/part/create", entry_id: entryId, name: `Seal ${stamp}`, stock: 5 });
  const objs0 = await api.send({ type: "maintenance_supporter/objects" });
  const parts0 = objs0.objects.find((o) => o.entry_id === entryId).parts;
  const filterId = parts0.find((p2) => p2.name.startsWith("Filter")).id;
  const task = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: `Inspect ${stamp}`, interval_days: 30,
    consumes_parts: [{ part_id: filterId, quantity: 1 }],
  });
  // Separate task for the UI pass — the household double-complete guard
  // would otherwise DROP a second completion of the same task within its
  // dedup window (by design).
  const task2 = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: `Inspect B ${stamp}`, interval_days: 30,
    consumes_parts: [{ part_id: filterId, quantity: 1 }],
  });

  // 1. Backend: explicit used_parts overrides the fixed link (decimal qty).
  const sealId = parts0.find((p2) => p2.name.startsWith("Seal")).id;
  await api.send({
    type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: task.task_id,
    used_parts: [{ part_id: sealId, quantity: 0.5 }],
  });
  let s = await stocks();
  assert(s[`Filter ${stamp}`] === 5, "fixed link NOT deducted when override sent");
  assert(s[`Seal ${stamp}`] === 4.5, `override consumed 0.5 seal (got ${s[`Seal ${stamp}`]})`);

  // 2. UI: dialog section, adjust selection, complete.
  const deepFindPanel = `
    const deep = (pred) => { const st=[document.documentElement]; const o=[]; let n=0;
      while (st.length && n < 60000) { const el = st.pop(); n++; if (!el) continue;
        if (pred(el)) o.push(el); if (el.shadowRoot) st.push(el.shadowRoot);
        for (const k of (el.children || [])) st.push(k); } return o; };
    window.__panel = deep((el) => el.tagName === "MAINTENANCE-SUPPORTER-PANEL")[0];
  `;
  const b = await chromium.connect(PW_WS, { timeout: 20000 });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 950 }, colorScheme: "dark", deviceScaleFactor: 2 });
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

  const dlgState = await p.evaluate(({ finder, eid, tid, name }) => {
    eval(finder);
    window.__panel._openCompleteDialog(eid, tid, name);
    const dlg = window.__panel.shadowRoot.querySelector("maintenance-complete-dialog");
    if (!dlg || !dlg.shadowRoot) return "no dialog";
    return { parts: dlg.parts.length, prefilled: Object.keys(dlg._usedParts || {}) };
  }, { finder: deepFindPanel, eid: entryId, tid: task2.task_id, name: `Inspect B ${stamp}` });
  assert(dlgState.parts === 2, `dialog carries both parts (${JSON.stringify(dlgState)})`);
  assert(dlgState.prefilled.length === 1 && dlgState.prefilled[0] === filterId,
    "selection prefilled from the fixed link");
  await p.waitForTimeout(600);

  const uiRows = await p.evaluate(({ finder }) => {
    eval(finder);
    const dlg = window.__panel.shadowRoot.querySelector("maintenance-complete-dialog");
    const rows = [...dlg.shadowRoot.querySelectorAll(".used-part-row")];
    return rows.map((r) => ({
      label: r.querySelector(".used-part-check span").textContent.trim(),
      checked: r.querySelector('input[type="checkbox"]').checked,
    }));
  }, { finder: deepFindPanel });
  log("  rows:", JSON.stringify(uiRows));
  assert(uiRows.length === 2, "two part rows render");
  assert(uiRows.some((r) => r.label.startsWith("Filter") && r.checked), "linked part prechecked");
  await p.screenshot({ path: `${OUT}/used-parts-dialog.png` });

  // Untick the filter, tick the seal with qty 2, submit (real events).
  const submitted = await p.evaluate(({ finder }) => {
    eval(finder);
    const dlg = window.__panel.shadowRoot.querySelector("maintenance-complete-dialog");
    const rows = [...dlg.shadowRoot.querySelectorAll(".used-part-row")];
    const filterRow = rows.find((r) => r.textContent.includes("Filter"));
    const sealRow = rows.find((r) => r.textContent.includes("Seal"));
    filterRow.querySelector('input[type="checkbox"]').click();
    sealRow.querySelector('input[type="checkbox"]').click();
    return true;
  }, { finder: deepFindPanel });
  assert(submitted === true, "selection adjusted");
  await p.waitForTimeout(400);
  await p.evaluate(({ finder }) => {
    eval(finder);
    const dlg = window.__panel.shadowRoot.querySelector("maintenance-complete-dialog");
    const qty = dlg.shadowRoot.querySelector(".used-part-qty");
    qty.value = "2";
    qty.dispatchEvent(new Event("input", { bubbles: true }));
    const btns = [...dlg.shadowRoot.querySelectorAll("ha-button, button")];
    const done = btns.find((x) => /Complete|Erledigt/i.test(x.textContent));
    done.click();
  }, { finder: deepFindPanel });
  await p.waitForTimeout(1800);
  s = await stocks();
  assert(s[`Filter ${stamp}`] === 5, "unticked linked part still not deducted");
  assert(s[`Seal ${stamp}`] === 2.5, `UI selection consumed 2 seals (got ${s[`Seal ${stamp}`]})`);

  // 3. Part-delete confirmation: dismiss keeps, accept deletes.
  await p.evaluate(({ finder, eid }) => {
    eval(finder);
    window.__panel._showObject(eid);
  }, { finder: deepFindPanel, eid: entryId });
  await p.waitForTimeout(1200);
  let confirmSeen = 0;
  p.on("dialog", (d) => { confirmSeen++; void (confirmSeen === 1 ? d.dismiss() : d.accept()); });
  const clickDelete = () => p.evaluate(({ finder }) => {
    eval(finder);
    const ps = window.__panel.shadowRoot.querySelector("maintenance-parts-section");
    const del = [...ps.shadowRoot.querySelectorAll("ha-icon-button")]
      .find((x) => x.querySelector('ha-icon[icon="mdi:delete-outline"]'));
    del.click();
    return true;
  }, { finder: deepFindPanel });
  await clickDelete();
  await p.waitForTimeout(1000);
  assert(confirmSeen === 1, "confirm() fired");
  assert(Object.keys(await stocks()).length === 2, "dismiss keeps the part");
  await clickDelete();
  await p.waitForTimeout(2500);
  assert(confirmSeen === 2, "second confirm fired");
  assert(Object.keys(await stocks()).length === 1, "accept deletes the part");

  log("USED-PARTS LIVE CHECK PASSED");
  await ctx.close();
  await b.close();
} finally {
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  api.close();
  log("cleanup done");
}
