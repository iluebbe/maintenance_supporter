/**
 * Reproduces issue #32 item 1: enable Checklists feature, then verify
 * the textarea is actually visible in the task dialog.
 *
 * Run via:
 *   docker exec playwright-server sh -c \
 *     'cd /tmp && node /work/frontend-src/e2e-checklist-visibility.mjs'
 * or from host with the helper container.
 */
import { setup, ws, cleanup } from "./e2e-helpers.mjs";

const RUN = Date.now().toString(36);
const OBJ_NAME = `Checklist Probe ${RUN}`;

const log = (...args) => console.log(...args);
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

  log("\n== Step 1: read /settings (initial)");
  let settings = await ws(page, { type: "maintenance_supporter/settings" });
  log("   features.checklists =", settings.features.checklists);

  log("\n== Step 2: enable Checklists via /global/update");
  settings = await ws(page, {
    type: "maintenance_supporter/global/update",
    settings: { advanced_checklists_visible: true },
  });
  check("backend reports checklists=true", settings.features.checklists === true,
    `actual=${settings.features.checklists}`);

  log("\n== Step 3: wait for panel to react to settings event");
  await page.waitForTimeout(2500);

  log("\n== Step 4: read panel's _features");
  const panelFeatures = await page.evaluate((fn) => {
    eval(fn);
    return window._panel._features;
  }, PANEL_EVAL);
  log("   _features =", JSON.stringify(panelFeatures));
  check("panel._features.checklists is true", panelFeatures?.checklists === true,
    `panel sees checklists=${panelFeatures?.checklists}`);

  log("\n== Step 5: create object + task to open dialog against");
  const obj = await ws(page, { type: "maintenance_supporter/object/create", name: OBJ_NAME });
  const taskRes = await ws(page, {
    type: "maintenance_supporter/task/create",
    entry_id: obj.entry_id, name: "Probe Task", interval_days: 7,
  });
  await page.waitForTimeout(2000);

  log("\n== Step 6: open task-dialog in EDIT mode");
  const objWithTasks = await ws(page, {
    type: "maintenance_supporter/object", entry_id: obj.entry_id,
  });
  const task = objWithTasks.tasks.find(t => t.id === taskRes.task_id);
  await page.evaluate(({ eid, task, fn }) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog").openEdit(eid, task);
  }, { eid: obj.entry_id, task, fn: PANEL_EVAL });
  await page.waitForTimeout(1500);

  log("\n== Step 7: inspect the dialog DOM for the checklist textarea");
  const dlgState = await page.evaluate((fn) => {
    eval(fn);
    const dlg = window._sr.querySelector("maintenance-task-dialog");
    const dlgSr = dlg?.shadowRoot;
    return {
      dialogExists: !!dlg,
      checklistsEnabled: dlg?.checklistsEnabled,
      open: dlg?._open,
      hasTextarea: !!dlgSr?.querySelector("textarea.checklist-textarea"),
      hasFieldLabel: !!dlgSr?.querySelector('label[for="checklist-textarea"]'),
      labelText: dlgSr?.querySelector('label[for="checklist-textarea"]')?.textContent?.trim(),
      // grab the rendered HTML around the env field for reference
      contentSnippet: dlgSr?.querySelector(".content")?.innerHTML?.slice(0, 1500),
    };
  }, PANEL_EVAL);

  log("   dialogExists:", dlgState.dialogExists);
  log("   checklistsEnabled prop:", dlgState.checklistsEnabled);
  log("   dialog open:", dlgState.open);
  log("   hasTextarea:", dlgState.hasTextarea);
  log("   hasFieldLabel:", dlgState.hasFieldLabel);
  log("   labelText:", dlgState.labelText);
  check("checklistsEnabled prop is true on the dialog",
    dlgState.checklistsEnabled === true,
    `prop=${dlgState.checklistsEnabled}`);
  check("checklist textarea is in the DOM",
    dlgState.hasTextarea === true,
    "the textarea.checklist-textarea was not found inside the dialog");
  check("label exists for checklist textarea",
    dlgState.hasFieldLabel === true,
    "the label for=\"checklist-textarea\" was not found");

  if (!dlgState.hasTextarea) {
    log("\n  --- dialog content snippet (first 1500 chars) ---");
    log(dlgState.contentSnippet);
  }

  log("\n== Step 8: take screenshot of edit dialog");
  await page.screenshot({ path: "/tmp/checklist-edit.png", fullPage: false });
  log("   saved /tmp/checklist-edit.png");

  log("\n== Step 9: scroll inside dialog so the textarea is visible");
  const scrollInfo = await page.evaluate((fn) => {
    eval(fn);
    const dlgSr = window._sr.querySelector("maintenance-task-dialog").shadowRoot;
    const content = dlgSr.querySelector(".content");
    const ta = dlgSr.querySelector("textarea.checklist-textarea");
    return {
      contentScrollHeight: content?.scrollHeight,
      contentClientHeight: content?.clientHeight,
      contentOverflow: getComputedStyle(content).overflowY,
      textareaOffsetTop: ta?.offsetTop,
      textareaVisible: ta && ta.getBoundingClientRect().top < window.innerHeight,
    };
  }, PANEL_EVAL);
  log("   scroll info:", JSON.stringify(scrollInfo));
  check("dialog content is scrollable",
    scrollInfo.contentOverflow === "auto" || scrollInfo.contentOverflow === "scroll",
    `overflow-y=${scrollInfo.contentOverflow}`);
  check("textarea is reachable by scrolling within dialog",
    scrollInfo.textareaOffsetTop > 0,
    `offsetTop=${scrollInfo.textareaOffsetTop}`);

  log("\n== Step 10: test CREATE mode (new task — does the field appear there?)");
  await page.evaluate((fn) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog")._open = false;
  }, PANEL_EVAL);
  await page.waitForTimeout(500);
  await page.evaluate(({ eid, fn }) => {
    eval(fn);
    window._sr.querySelector("maintenance-task-dialog").openCreate(eid);
  }, { eid: obj.entry_id, fn: PANEL_EVAL });
  await page.waitForTimeout(1500);

  const createState = await page.evaluate((fn) => {
    eval(fn);
    const dlgSr = window._sr.querySelector("maintenance-task-dialog").shadowRoot;
    return {
      hasTextarea: !!dlgSr?.querySelector("textarea.checklist-textarea"),
      labelText: dlgSr?.querySelector('label[for="checklist-textarea"]')?.textContent?.trim(),
    };
  }, PANEL_EVAL);
  log("   CREATE mode:", JSON.stringify(createState));
  check("checklist textarea also visible in CREATE dialog",
    createState.hasTextarea === true, "");
  await page.screenshot({ path: "/tmp/checklist-create.png", fullPage: false });
  log("   saved /tmp/checklist-create.png");

  log("\n== Cleanup");
  await ws(page, {
    type: "maintenance_supporter/object/delete", entry_id: obj.entry_id,
  });
  await cleanup(browser, ctx);

  log(`\n=== ${pass} passed, ${fail} failed ===`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
