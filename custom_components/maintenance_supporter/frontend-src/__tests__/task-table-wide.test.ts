/**
 * On a 2560 px or wider screen at 100 % the task list's slack went into the
 * name (or chips) track, so a row's due date and buttons sat 1000 px and
 * more to the right of its name (4K capture, 2026-11-01). From 2400 px the
 * name hugs the longest name and an empty last track takes the rest.
 */

import { expect } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Panel = HTMLElement & { updateComplete: Promise<unknown> };

/** Pixels between the end of the task name's text and the due cell. */
function nameToDue(row: Element): number {
  const name = row.querySelector(".cell.task-name")!;
  const range = document.createRange();
  range.selectNodeContents(name);
  const textRight = range.getBoundingClientRect().right;
  return row.querySelector(".due-cell")!.getBoundingClientRect().left - textRight;
}

describe("task list on a very wide screen", () => {
  beforeEach(() => resetTaskSeq());
  afterEach(async () => {
    await setViewport({ width: 800, height: 600 });
    localStorage.clear();
  });

  for (const width of [2560, 3840]) {
    it(`${width} px: due date and buttons follow the name`, async () => {
      await setViewport({ width, height: 1000 });
      localStorage.setItem("msp-overview-tab", "dashboard");
      const { el } = await mountPanel([obj("e1", [task({ name: "Mow lawn" }), task({ name: "Clean the filter of the pool pump" })])]);
      await new Promise((r) => setTimeout(r, 60));
      await (el as unknown as Panel).updateComplete;
      const rows = [...sr(el).querySelectorAll(".task-table .task-row:not(.virt-sizer)")];
      expect(rows.length).to.equal(2);
      const table = sr(el).querySelector(".task-table")!.getBoundingClientRect();
      expect(table.width, "the table is wide").to.be.greaterThan(1200);
      for (const row of rows) {
        expect(nameToDue(row), "gap between the name and its due date").to.be.lessThan(500);
      }
    });
  }
});
