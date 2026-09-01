/**
 * Master-detail split (2026-09-01): on panels ≥1500px the dashboard keeps the
 * task list on the left and docks the task detail on the right — clicking a
 * task no longer switches the view. Below the threshold the classic full-page
 * navigation is untouched.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

type PanelPriv = HTMLElement & {
  updateComplete: Promise<unknown>;
  narrow: boolean;
  split: boolean;
  _view: string;
};

async function mountAt(width: number) {
  const r = await mountPanel([obj("e1", [task({ status: "overdue" }), task({ status: "ok" })])], {
    "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
  });
  const el = r.el as PanelPriv;
  el.style.width = `${width}px`;
  await new Promise((res) => setTimeout(res, 120));
  await el.updateComplete;
  return el;
}

describe("master-detail split (wide dashboard)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });

  it("≥1500px: empty pane invites, clicking a task docks the detail without a view switch", async () => {
    const el = await mountAt(1700);
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".split-pane"), "split pane rendered");
    expect(el.split, "split reflected").to.equal(true);
    expect(sr.querySelector(".split-pane-empty"), "empty hint first").to.not.equal(null);

    (sr.querySelector(".task-row .cell.task-name") as HTMLElement).click();
    await el.updateComplete;
    await waitUntil(() => !!sr.querySelector(".split-pane maintenance-task-detail-view"), "detail docked");
    expect(el._view, "no view switch").to.equal("overview");
    expect(sr.querySelector(".task-row.selected"), "clicked row marked").to.not.equal(null);
  });

  it("<1500px: clicking a task still opens the full task page", async () => {
    const el = await mountAt(1200);
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".task-row .cell.task-name"), "rows rendered");
    expect(sr.querySelector(".split-pane")).to.equal(null);

    (sr.querySelector(".task-row .cell.task-name") as HTMLElement).click();
    await el.updateComplete;
    expect(el._view).to.equal("task");
  });
});
