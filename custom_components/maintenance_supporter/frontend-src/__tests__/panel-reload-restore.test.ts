/**
 * A reload (F5) keeps the browser's history entry and its state. The panel
 * seeded "overview" over it on every start, so a reload on a task page or an
 * object page always landed on the overview (lifecycle click test,
 * 2026-11-01). Now it goes back to the page the entry describes, once the
 * objects are in; a deep link in the URL wins, and a task deleted meanwhile
 * lands on the overview.
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

const PAGE_PATH = window.location.pathname;

type Panel = HTMLElement & { updateComplete: Promise<unknown>; _view: string; _selectedEntryId: string | null; _selectedTaskId: string | null };

async function reloadOn(state: Record<string, unknown> | null, query = "") {
  history.replaceState(state, "", `${PAGE_PATH}${query}`);
  const { el } = await mountPanel([obj("e1", [task({ name: "Mow lawn" }), task({ name: "Descale" })])]);
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
  return el as unknown as Panel;
}

describe("reload keeps the panel page", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
    history.replaceState(null, "", PAGE_PATH);
  });

  it("a task page comes back on the task", async () => {
    const el = await reloadOn({ msp_view: "task", msp_entry: "e1", msp_task: "t2", msp_area: null });
    expect(el._view).to.equal("task");
    expect(el._selectedEntryId).to.equal("e1");
    expect(el._selectedTaskId).to.equal("t2");
  });

  it("an object page comes back on the object", async () => {
    const el = await reloadOn({ msp_view: "object", msp_entry: "e1", msp_task: null, msp_area: null });
    expect(el._view).to.equal("object");
    expect(el._selectedEntryId).to.equal("e1");
  });

  it("a task deleted meanwhile lands on the overview, and the entry says so", async () => {
    const el = await reloadOn({ msp_view: "task", msp_entry: "e1", msp_task: "t99", msp_area: null });
    expect(el._view).to.equal("overview");
    expect((history.state as { msp_view?: string } | null)?.msp_view).to.equal("overview");
  });

  it("a fresh visit (no state) starts on the overview", async () => {
    const el = await reloadOn(null);
    expect(el._view).to.equal("overview");
    expect((history.state as { msp_view?: string } | null)?.msp_view).to.equal("overview");
  });

  it("a deep link in the URL wins over the entry's page", async () => {
    const el = await reloadOn({ msp_view: "task", msp_entry: "e1", msp_task: "t2", msp_area: null }, "?entry_id=e1&task_id=t1");
    expect(el._view).to.equal("task");
    expect(el._selectedTaskId).to.equal("t1");
  });
});
