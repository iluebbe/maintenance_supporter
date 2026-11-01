/** The task rows are rendered by their task (lit's repeat), not by position.
 *
 *  Rendered by position, a row's element showed whichever task came to its
 *  place: the virtual window moved one row on, a completion re-sorted the
 *  list, and the element that held the keyboard focus (or that a click had
 *  just picked) now stood for another task (2026-11-01, found while Playwright
 *  clicked a row a screen below the fold).
 */

import { expect } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

type Panel = HTMLElement & { updateComplete: Promise<unknown>; _setSortMode: (m: string) => void };

const rowOf = (el: HTMLElement, name: string) =>
  [...sr(el).querySelectorAll<HTMLElement>(".task-row:not(.virt-sizer)")]
    .find((r) => r.querySelector(".cell.task-name")?.textContent?.trim() === name);

async function settle(el: Panel) {
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  await new Promise((r) => setTimeout(r, 40));
  await el.updateComplete;
}

describe("task rows keep their element", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(async () => {
    localStorage.clear();
    await setViewport({ width: 800, height: 600 });
  });

  it("a re-sort moves the element with its task, and the focus with it", async () => {
    await setViewport({ width: 1440, height: 900 });
    const { el } = await mountPanel([
      obj("e1", [task({ name: "Zebra", status: "overdue", days_until_due: -5 }), task({ name: "Apple", days_until_due: 20 })], "Pump"),
    ]);
    const p = el as unknown as Panel;
    const zebra = rowOf(el, "Zebra")!;
    expect(zebra !== undefined, "Zebra rendered").to.equal(true);
    const name = zebra.querySelector<HTMLElement>(".cell.task-name")!;
    name.tabIndex = 0;
    name.focus();

    p._setSortMode("task_name");
    await settle(p);

    expect(rowOf(el, "Apple") !== zebra, "Apple got its own element").to.equal(true);
    expect(rowOf(el, "Zebra") === zebra, "Zebra kept its element").to.equal(true);
    // The focus stays with Zebra, or goes when its element is the one moved
    // (a moved node drops it); it never lands on Apple.
    expect(sr(el).activeElement?.textContent?.trim(), "focus on another task").to.not.equal("Apple");
  });

  it("the virtual window moves on, a task still on screen keeps its element", async () => {
    await setViewport({ width: 1440, height: 900 });
    const many = Array.from({ length: 150 }, (_, i) => task({ name: `Bulk ${String(i).padStart(3, "0")}`, days_until_due: i + 1 }));
    const { el } = await mountPanel([obj("e1", many)]);
    const p = el as unknown as Panel;
    expect(sr(el).querySelector(".task-table.virtual") !== null, "virtual list").to.equal(true);

    const before = rowOf(el, "Bulk 012")!;
    expect(before !== undefined, "Bulk 012 in the first window").to.equal(true);
    const content = sr(el).querySelector<HTMLElement>(".content")!;
    const startBefore = (el as unknown as { _virtStart: number })._virtStart;
    for (let i = 0; i < 40 && (el as unknown as { _virtStart: number })._virtStart === startBefore; i++) {
      content.scrollTop += 120;
      content.dispatchEvent(new Event("scroll"));
      await settle(p);
    }
    expect((el as unknown as { _virtStart: number })._virtStart, "the window moved").to.be.greaterThan(startBefore);
    const after = rowOf(el, "Bulk 012");
    expect(after !== undefined, "Bulk 012 still in the window").to.equal(true);
    expect(after === before, "the same element").to.equal(true);
  });
});
