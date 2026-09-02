/**
 * #150 follow-up (maisun's mobile screenshot, 2026-08-31): in the narrow row
 * grid the due column is fit-content(100px) and right-aligned — the
 * shrink-to-fit trigger-progress used to grow to its label's width and
 * overhang LEFT across its neighbour. It is now clamped to the cell.
 *
 * Since the two-row phone layout (2026-09-02) the object name sits in row 1
 * next to the task name; the due cell's left-hand neighbour in row 2 is the
 * chip strip (.task-sub) — or, when there are no chips, the status column.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

type PanelPriv = HTMLElement & { updateComplete: Promise<unknown>; narrow: boolean };

const SENSOR_TASK = () =>
  task({
    status: "triggered",
    schedule_type: "sensor_based",
    trigger_active: true,
    trigger_current_value: 14,
    trigger_config: { type: "counter", entity_id: "sensor.x", trigger_target_value: 1000000 },
  });

describe("trigger progress clamp (narrow)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });

  it("the bar + label stay inside the due cell and never overlap their row-2 neighbour", async () => {
    const r = await mountPanel([obj("e1", [SENSOR_TASK()])], {
      "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
    });
    const el = r.el as PanelPriv;
    el.style.width = "400px";
    el.narrow = true;
    await new Promise((res) => setTimeout(res, 80));
    await el.updateComplete;

    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".task-row .trigger-progress"), "trigger progress rendered");
    const due = sr.querySelector(".task-row .due-cell")!.getBoundingClientRect();
    const tp = sr.querySelector(".task-row .trigger-progress")!.getBoundingClientRect();
    const objName = sr.querySelector(".task-row .cell.object-name")!.getBoundingClientRect();
    const badges = sr.querySelector(".task-row .cell-badges")!.getBoundingClientRect();
    const sub = sr.querySelector(".task-row .task-sub");
    const subRect = sub && sub.getBoundingClientRect().width > 0 ? sub.getBoundingClientRect() : null;
    const neighbourRight = subRect ? subRect.right : badges.right;

    expect(tp.width, "progress no wider than its cell").to.be.at.most(due.width + 1);
    expect(tp.left, "no left overhang out of the cell").to.be.at.least(due.left - 1);
    expect(tp.left, "no overlap with the row-2 neighbour").to.be.at.least(neighbourRight - 1);
    // The object name lives in row 1 now — it must sit entirely above the bar.
    expect(objName.bottom, "object name above the due cell").to.be.at.most(tp.top + 1);
  });
});
