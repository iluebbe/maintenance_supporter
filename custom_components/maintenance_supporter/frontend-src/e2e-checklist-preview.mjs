/**
 * Verifies the read-only checklist preview in the task detail (overview tab).
 * Adds a task with a checklist via WS, navigates to its detail, asserts the
 * preview card with all 3 steps is in the DOM.
 */
import { setup, ws, cleanup } from "./e2e-helpers.mjs";

const RUN = Date.now().toString(36);
const OBJ_NAME = `Checklist Preview ${RUN}`;
const STEPS = ["Drain water", "Replace filter cartridge", "Run flush cycle"];

const log = (...a) => console.log(...a);
let pass = 0, fail = 0;
const check = (label, ok, detail) => {
  if (ok) { pass++; log(`  ✓ ${label}`); }
  else { fail++; log(`  ✗ ${label}${detail ? "  — " + detail : ""}`); }
};

const PANEL_EVAL = `
window._ha=document.querySelector('home-assistant');
window._main=_ha.shadowRoot.querySelector('home-assistant-main');
window._drawer=_main.shadowRoot.querySelector('ha-drawer');
window._resolver=_drawer.querySelector('partial-panel-resolver');
window._custom=_resolver.querySelector('ha-panel-custom');
window._panel=_custom.querySelector('maintenance-supporter-panel');
window._sr=_panel.shadowRoot;
`;

async function main() {
  const { browser, ctx, page } = await setup({ mobile: false });

  log("\n== Step 1: enable Checklists feature");
  await ws(page, {
    type: "maintenance_supporter/global/update",
    settings: { advanced_checklists_visible: true },
  });

  log("\n== Step 2: create object + task with checklist");
  const obj = await ws(page, { type: "maintenance_supporter/object/create", name: OBJ_NAME });
  const taskRes = await ws(page, {
    type: "maintenance_supporter/task/create",
    entry_id: obj.entry_id, name: "Filter Maintenance", interval_days: 30,
    checklist: STEPS,
  });
  log("   created task_id =", taskRes.task_id);

  log("\n== Step 3: wait for panel to refresh + select the task");
  await page.waitForTimeout(2500);
  await page.evaluate(({ eid, tid, fn }) => {
    eval(fn);
    window._panel._selectedEntryId = eid;
    window._panel._selectedTaskId = tid;
    window._panel._view = "task";
    window._panel.requestUpdate();
  }, { eid: obj.entry_id, tid: taskRes.task_id, fn: PANEL_EVAL });
  await page.waitForTimeout(1500);

  log("\n== Step 4: inspect overview tab DOM for the checklist preview card");
  const result = await page.evaluate(({ fn }) => {
    eval(fn);
    const sr = window._sr;
    const card = sr.querySelector(".checklist-preview-card");
    const header = card?.querySelector(".checklist-preview-header")?.textContent?.trim();
    const items = [...(card?.querySelectorAll("li") || [])].map((li) => li.textContent?.trim());
    return {
      hasCard: !!card,
      header,
      items,
      cardOffsetTop: card?.offsetTop,
    };
  }, { fn: PANEL_EVAL });
  log("   hasCard:", result.hasCard);
  log("   header:", JSON.stringify(result.header));
  log("   items:", JSON.stringify(result.items));
  log("   offsetTop:", result.cardOffsetTop);

  check("preview card rendered in task detail", result.hasCard === true, "");
  check("header shows count = 3", result.header?.includes("(3)"), `header="${result.header}"`);
  check("all 3 items rendered in order",
    JSON.stringify(result.items) === JSON.stringify(STEPS),
    `items=${JSON.stringify(result.items)}`);

  await page.screenshot({ path: "checklist-preview.png", fullPage: false });
  log("   saved checklist-preview.png");

  log("\n== Step 5: verify preview is HIDDEN when checklist is empty");
  const obj2 = await ws(page, { type: "maintenance_supporter/object/create", name: `Empty ${RUN}` });
  const t2 = await ws(page, {
    type: "maintenance_supporter/task/create",
    entry_id: obj2.entry_id, name: "Bare Task", interval_days: 7,
  });
  await page.waitForTimeout(1500);
  await page.evaluate(({ eid, tid, fn }) => {
    eval(fn);
    window._panel._selectedEntryId = eid;
    window._panel._selectedTaskId = tid;
    window._panel._view = "task";
    window._panel.requestUpdate();
  }, { eid: obj2.entry_id, tid: t2.task_id, fn: PANEL_EVAL });
  await page.waitForTimeout(1000);
  const empty = await page.evaluate(({ fn }) => {
    eval(fn);
    return !!window._sr.querySelector(".checklist-preview-card");
  }, { fn: PANEL_EVAL });
  check("preview hidden for tasks without checklist", empty === false, "");

  log("\n== Cleanup");
  await ws(page, { type: "maintenance_supporter/object/delete", entry_id: obj.entry_id });
  await ws(page, { type: "maintenance_supporter/object/delete", entry_id: obj2.entry_id });
  await cleanup(browser, ctx);

  log(`\n=== ${pass} passed, ${fail} failed ===`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
