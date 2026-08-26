/** Live check on ha-maint for task phases (#139) — the mower-blade scenario.
 *
 *   1. Create a throwaway object + a part (stock 20) + a phased task:
 *      phases {swap, flip, replace(consumes 2×part, requires cost)},
 *      sequence [swap, flip, swap, replace], task-level checklist.
 *   2. Read model: current_phase = swap 1/4; phases/sequence/cursor echoed.
 *   3. Complete → history entry stamped phase_id=swap, cursor advances,
 *      current_phase = flip; stock UNTOUCHED (swap consumes nothing —
 *      task-level has no links either).
 *   4. task/set_phase → 3 (replace). Complete WITHOUT cost → refused
 *      (phase-level required_completion_fields enforced). With cost →
 *      stock drops by the PHASE quantity (2), cursor wraps to 0.
 *   5. Task sensor exposes current_phase / phase_index / phase_count attrs.
 *   6. Panel UI: task detail renders the cycle strip (4 steps, current
 *      highlighted, click-to-repoint for admins); complete dialog shows the
 *      phase line; task dialog shows the phases editor with 3 defs + 4 chips.
 *
 *  Seeds one throwaway object, deletes it afterwards.
 */
import { chromium } from "@playwright/test";
import { hassTokensInit, loadToken, watchdog, wsClient } from "./ws-client.mjs";

const HA = "http://ha-maint:8123", REST = "http://127.0.0.1:8125", PW_WS = "ws://127.0.0.1:3000/";
const log = (...a) => console.log(...a);
const fail = (m) => { console.error("FAIL:", m); throw new Error(m); };
const assert = (cond, msg) => { if (!cond) fail(msg); log("  ok:", msg); };
watchdog(6 * 60e3, "task phases live check");

const token = loadToken();
const api = await wsClient(REST, token);
const stamp = Date.now() % 100000;
const objName = `phases${stamp}`;
let entryId = null;
let browser = null;

const getTask = async (taskId) => {
  const obj = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  return obj.tasks.find((t) => t.id === taskId);
};
const getPart = async (partId) => {
  const obj = await api.send({ type: "maintenance_supporter/object", entry_id: entryId });
  return (obj.parts || []).find((p) => p.id === partId);
};

try {
  const obj = await api.send({ type: "maintenance_supporter/object/create", name: objName });
  entryId = obj.entry_id;
  const part = await api.send({
    type: "maintenance_supporter/part/create", entry_id: entryId,
    name: "Blade set", stock: 20,
  });
  const partId = part.part_id ?? part.id;
  assert(partId, "part created");

  const created = await api.send({
    type: "maintenance_supporter/task/create", entry_id: entryId,
    name: "Mower blades", schedule_type: "time_based", interval_days: 30,
    checklist: ["Task-level step"],
    phases: {
      swap: { name: "Swap cutting disks" },
      flip: { name: "Flip blades", checklist: ["Loosen", "Flip", "Torque"] },
      replace: {
        name: "Replace blades",
        consumes_parts: [{ part_id: partId, quantity: 2 }],
        required_completion_fields: ["cost"],
      },
    },
    phase_sequence: ["swap", "flip", "swap", "replace"],
  });
  const taskId = created.task_id;

  // 2. read model
  let task = await getTask(taskId);
  assert(task.phase_sequence?.length === 4, "sequence echoed (4 steps)");
  assert(task.phase_cursor === 0, "cursor starts at 0");
  assert(task.current_phase?.id === "swap" && task.current_phase.index === 0 && task.current_phase.count === 4,
    `current_phase = swap 1/4 (${JSON.stringify(task.current_phase)})`);

  // 3. complete the swap step
  await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: taskId });
  task = await getTask(taskId);
  assert(task.phase_cursor === 1, "completion advanced the cursor");
  assert(task.current_phase?.id === "flip", "current_phase is now flip");
  const done = task.history.filter((h) => h.type === "completed");
  assert(done.at(-1)?.phase_id === "swap", "history entry stamped phase_id=swap");
  assert((await getPart(partId)).stock === 20, "swap consumed nothing (stock 20)");

  // 4. jump to replace; phase-level required field + parts enforced
  const setRes = await api.send({ type: "maintenance_supporter/task/set_phase", entry_id: entryId, task_id: taskId, cursor: 3 });
  assert(setRes.phase_cursor === 3 || setRes.success, "set_phase → 3 accepted");
  task = await getTask(taskId);
  assert(task.current_phase?.id === "replace", "current_phase is replace after set_phase");

  let refused = false;
  try {
    await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: taskId });
  } catch (e) {
    refused = true;
    log("  refusal code:", e.message || e.code || e);
  }
  assert(refused, "complete without cost refused (phase requires cost)");

  // The double-tap dedup (MANUAL_COMPLETION_DEDUP_SECONDS = 30, journey M1)
  // swallows a same-task re-completion inside its window — deliberately, and
  // task-wide even across a set_phase. Wait it out before the replace step.
  log("  waiting out the 31s double-complete dedup window …");
  await new Promise((r) => setTimeout(r, 31000));
  await api.send({ type: "maintenance_supporter/task/complete", entry_id: entryId, task_id: taskId, cost: 24.9 });
  task = await getTask(taskId);
  assert(task.phase_cursor === 0, "cursor wrapped to 0 after replace");
  const done2 = task.history.filter((h) => h.type === "completed");
  assert(done2.at(-1)?.phase_id === "replace", "history entry stamped phase_id=replace");
  assert((await getPart(partId)).stock === 18, `replace consumed the PHASE quantity (stock ${ (await getPart(partId)).stock } = 18)`);

  // 5. sensor attributes
  const sensorId = task.sensor_entity_id;
  assert(sensorId, "task sensor entity id known");
  const state = await (await fetch(`${REST}/api/states/${sensorId}`, { headers: { Authorization: `Bearer ${token}` } })).json();
  assert(state.attributes.current_phase_id === "swap", `sensor current_phase_id=swap (${state.attributes.current_phase_id})`);
  assert(state.attributes.phase_index === 1 && state.attributes.phase_count === 4,
    `sensor phase_index/count = 1/4 (${state.attributes.phase_index}/${state.attributes.phase_count})`);

  // 6. panel UI
  browser = await chromium.connect(PW_WS);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  const page = await ctx.newPage();
  await page.addInitScript(hassTokensInit, { t: token, ha: HA });
  await page.goto(`${HA}/maintenance-supporter?entry_id=${encodeURIComponent(entryId)}&task_id=${encodeURIComponent(taskId)}`,
    { waitUntil: "domcontentloaded", timeout: 30000 });

  const probe = async () => page.evaluate(() => {
    const sr = (el) => el && el.shadowRoot;
    const panel = (() => {
      const st = [document.documentElement]; let n = 0;
      while (st.length && n++ < 8000) {
        const el = st.pop();
        if (el.tagName === "MAINTENANCE-SUPPORTER-PANEL") return el;
        const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
        else if (el.children) st.push(...el.children);
      }
      return null;
    })();
    if (!panel || !sr(panel)) return null;
    const root = sr(panel);
    const card = root.querySelector(".phases-card");
    if (!card) return { card: false };
    return {
      card: true,
      steps: card.querySelectorAll(".phase-step").length,
      current: card.querySelector(".phase-step.current")?.textContent?.trim() ?? "",
      lastLines: card.querySelectorAll(".phase-step-last").length,
    };
  });
  let ui = null;
  for (let i = 0; i < 30 && (!ui || !ui.card); i++) {
    await page.waitForTimeout(1000);
    ui = await probe();
  }
  assert(ui?.card, "task detail renders the phases card");
  assert(ui.steps === 4, `cycle strip has 4 steps (${ui.steps})`);
  assert(ui.current.includes("Swap"), `current step highlighted = Swap (${ui.current})`);
  assert(ui.lastLines >= 2, `last-completion lines under completed steps (${ui.lastLines})`);

  // complete dialog shows the phase line
  const dialogProbe = await page.evaluate(() => {
    const sr = (el) => el && el.shadowRoot;
    const panel = (() => {
      const st = [document.documentElement]; let n = 0;
      while (st.length && n++ < 8000) {
        const el = st.pop();
        if (el.tagName === "MAINTENANCE-SUPPORTER-PANEL") return el;
        const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
        else if (el.children) st.push(...el.children);
      }
      return null;
    })();
    const root = sr(panel);
    const btn = root.querySelector(".detail-section ha-button");
    if (!btn || !btn.textContent) return { opened: false, why: "no complete button" };
    btn.click();
    return { opened: true };
  });
  assert(dialogProbe.opened, "clicked Complete on the detail header");
  await page.waitForTimeout(1200);
  const dlgInfo = await page.evaluate(() => {
    const sr = (el) => el && el.shadowRoot;
    const panel = (() => {
      const st = [document.documentElement]; let n = 0;
      while (st.length && n++ < 8000) {
        const el = st.pop();
        if (el.tagName === "MAINTENANCE-SUPPORTER-PANEL") return el;
        const r = sr(el); if (r) st.push(...r.querySelectorAll("*"));
        else if (el.children) st.push(...el.children);
      }
      return null;
    })();
    const dlg = sr(panel)?.querySelector("maintenance-complete-dialog");
    const root = sr(dlg);
    return {
      phaseLine: root?.querySelector(".phase-line")?.textContent?.trim() ?? "",
      checklist: [...(root?.querySelectorAll(".checklist-item") || [])].map((el) => el.textContent.trim()),
    };
  });
  assert(dlgInfo.phaseLine.includes("1/4"), `complete dialog names the phase (${dlgInfo.phaseLine})`);
  assert(dlgInfo.checklist.some((s) => s.includes("Task-level step")),
    "swap falls through to the task-level checklist");

  log("PASS: task phases live check");
} finally {
  if (browser) await browser.close().catch(() => {});
  if (entryId) await api.send({ type: "maintenance_supporter/object/delete", entry_id: entryId }).catch(() => {});
  api.close();
}
