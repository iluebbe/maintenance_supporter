/**
 * The object page on a wide screen (beta, 2026-11-01). At 2560 and 4K it ran
 * one column across the whole width and every task opened as a page of its
 * own. With the beta on:
 *   - from 1500 px of panel a task docks on the right, the object page stays
 *     (the dashboard's master-detail), the row is marked, and a reload brings
 *     the docked task back
 *   - from 2200 px the page itself is two columns: sub-objects, tasks and
 *     history on the left, the object's data, documents and parts right
 * With the beta off nothing changes: the task opens as its page.
 */

import { expect } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";
import { setBetaUi } from "../helpers/beta-ui";

// Home Assistant's elements the beta UI builds on, stubbed as beta-ui.test does.
for (const tag of ["ha-dropdown", "ha-dropdown-item", "wa-divider", "ha-adaptive-dialog", "ha-select", "ha-input", "ha-switch",
  "ha-checkbox", "ha-settings-row", "ha-expansion-panel", "ha-alert", "ha-tab-group", "ha-tab-group-tab"]) {
  if (!customElements.get(tag)) customElements.define(tag, class extends HTMLElement {});
}

const PAGE_PATH = window.location.pathname;

type Panel = HTMLElement & {
  updateComplete: Promise<unknown>;
  requestUpdate: () => void;
  _view: string;
  _selectedEntryId: string | null;
  _selectedTaskId: string | null;
  _showObject: (entryId: string) => void;
};

async function settle(el: Panel) {
  await new Promise((r) => setTimeout(r, 60));
  await el.updateComplete;
}

async function objectPage(width: number, beta: boolean) {
  await setViewport({ width, height: 1000 });
  const base = obj("e1", [task({ name: "Clean the air filter" }), task({ name: "Annual service" })], "Heat pump");
  Object.assign(base.object, { manufacturer: "Vaillant", model: "aroTHERM" });
  const { el } = await mountPanel([base]);
  const panel = el as unknown as Panel;
  // The household's switch, as the panel's settings would bring it.
  setBetaUi(beta);
  panel._showObject("e1");
  await settle(panel);
  return panel;
}

const clickTask = async (panel: Panel, name: string) => {
  [...sr(panel).querySelectorAll<HTMLElement>(".task-table.object-tasks .cell.task-name")].find((c) => c.textContent!.includes(name))!.click();
  await settle(panel);
};

describe("object page on a wide screen (beta)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
  });
  afterEach(async () => {
    setBetaUi(false);
    localStorage.clear();
    history.replaceState(null, "", PAGE_PATH);
    await setViewport({ width: 800, height: 600 });
  });

  it("1920: a task docks beside the object page, marked in the list", async () => {
    const panel = await objectPage(1920, true);
    expect(sr(panel).querySelector(".object-split .split-pane-empty") !== null, "the pane waits for a task").to.equal(true);
    await clickTask(panel, "Annual service");
    expect(panel._view).to.equal("object");
    expect(panel._selectedTaskId).to.equal("t2");
    expect(sr(panel).querySelector(".object-split .split-pane .task-name-breadcrumb")?.textContent).to.contain("Annual service");
    const selected = sr(panel).querySelector(".task-table.object-tasks .task-row.selected .cell.task-name");
    expect(selected?.textContent).to.contain("Annual service");
    expect((history.state as { msp_view?: string; msp_task?: string }).msp_task, "the entry keeps it for a reload").to.equal("t2");
    expect(sr(panel).querySelector(".object-columns") === null, "one column below 2200 px").to.equal(true);
  });

  it("the docked task's row keeps its cells in their tracks", async () => {
    const panel = await objectPage(1920, true);
    const row = sr(panel).querySelector(".task-table.object-tasks .task-row")!;
    const name = row.querySelector(".cell.task-name")!.getBoundingClientRect();
    const due = row.querySelector(".due-cell")!.getBoundingClientRect();
    expect(due.left, "the due date right of the name, not under it").to.be.at.least(name.right - 1);
    expect(name.width, "the name gets the wide track, not the object column's 180 px").to.be.greaterThan(240);
    expect(due.width, "the due date its own 150-px track").to.be.at.most(160);
  });

  it("2560: the page is two columns, the object's data on the right", async () => {
    const panel = await objectPage(2560, true);
    const cols = sr(panel).querySelectorAll(".object-columns > .object-col");
    expect(cols.length).to.equal(2);
    expect(cols[0].querySelector(".task-table.object-tasks") !== null, "tasks on the left").to.equal(true);
    expect(cols[1].querySelector(".object-meta")?.textContent).to.contain("Vaillant");
    expect(cols[1].getBoundingClientRect().left).to.be.greaterThan(cols[0].getBoundingClientRect().right);
  });

  it("a reload on the object page brings the docked task back", async () => {
    await setViewport({ width: 1920, height: 1000 });
    history.replaceState({ msp_view: "object", msp_entry: "e1", msp_task: "t2", msp_area: null }, "", PAGE_PATH);
    const { el } = await mountPanel([obj("e1", [task({ name: "Clean the air filter" }), task({ name: "Annual service" })], "Heat pump")]);
    const panel = el as unknown as Panel;
    setBetaUi(true);
    panel.requestUpdate();
    await settle(panel);
    expect(panel._view).to.equal("object");
    expect(sr(panel).querySelector(".object-split .split-pane .task-name-breadcrumb")?.textContent).to.contain("Annual service");
  });

  it("without the beta the task opens as its page, as before", async () => {
    const panel = await objectPage(2560, false);
    expect(sr(panel).querySelector(".object-split, .object-columns") === null).to.equal(true);
    await clickTask(panel, "Annual service");
    expect(panel._view).to.equal("task");
  });
});
