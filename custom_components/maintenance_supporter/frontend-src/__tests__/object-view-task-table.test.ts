/**
 * Object page task list (prod finding 2026-09-02): its rows have no
 * object-name cell, so under the shared 7-track `.task-table` template every
 * cell sat one track to the left and the labelled Complete/Skip pair landed
 * in the fixed 150px due track — poking past the row's right edge and, once
 * a classic vertical scrollbar took its 17px, forcing a horizontal one. The
 * object list now carries its own six-track template.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

type PanelPriv = HTMLElement & {
  updateComplete: Promise<unknown>;
  _showObject: (entryId: string) => void;
};

describe("object view: task table fits its row", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
  });

  it("wide panel: the action buttons end inside the row, in the last track", async () => {
    const r = await mountPanel([obj("e1", [task({ status: "ok" }), task({ status: "overdue" })])], {
      "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
    });
    const el = r.el as PanelPriv;
    el.style.width = "1600px";
    await new Promise((res) => setTimeout(res, 120));
    await el.updateComplete;
    el._showObject("e1");
    await el.updateComplete;
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".task-table.object-tasks .task-row .row-actions"), "object rows rendered");

    const row = sr.querySelector<HTMLElement>(".task-table.object-tasks .task-row")!;
    const actions = row.querySelector<HTMLElement>(".row-actions")!;
    const rowBox = row.getBoundingClientRect();
    const rowPadRight = parseFloat(getComputedStyle(row).paddingRight);
    const a = actions.getBoundingClientRect();
    // Content edge of the row (padding box minus its right padding).
    expect(a.right, "actions end inside the row").to.be.at.most(rowBox.right - rowPadRight + 0.5);
    // ... and are the right-most cell: nothing of the row sits past them.
    const due = row.querySelector<HTMLElement>(".due-cell")!.getBoundingClientRect();
    expect(due.right, "due cell precedes the actions").to.be.at.most(a.left + 0.5);
    // Six explicit tracks, not the dashboard's seven.
    const tracks = getComputedStyle(row.parentElement!).gridTemplateColumns.trim().split(/\s+/);
    expect(tracks.length, "six tracks for six cells").to.equal(6);
  });
});
