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

  it("the docked pane is no inner scroller and stays in view while the list scrolls", async () => {
    // 60 rows: the list outgrows the 600px host, so `.content` scrolls.
    const rows = Array.from({ length: 60 }, () => task({ status: "ok" }));
    const r = await mountPanel([obj("e1", rows)], {
      "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
    });
    const el = r.el as PanelPriv;
    el.style.width = "1700px";
    await new Promise((res) => setTimeout(res, 120));
    await el.updateComplete;
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".split-pane"), "split pane rendered");
    (sr.querySelector(".task-row .cell.task-name") as HTMLElement).click();
    await el.updateComplete;
    await waitUntil(() => !!sr.querySelector(".split-pane maintenance-task-detail-view"), "detail docked");

    const content = sr.querySelector<HTMLElement>(".content")!;
    const pane = sr.querySelector<HTMLElement>(".split-pane")!;
    expect(getComputedStyle(pane).overflowY, "no nested scrollbar").to.equal("visible");
    expect(getComputedStyle(pane).position).to.equal("sticky");
    expect(content.scrollHeight, "the list scrolls inside .content").to.be.greaterThan(content.clientHeight + 200);

    content.scrollTop = content.scrollHeight;
    await new Promise((res) => requestAnimationFrame(() => setTimeout(res, 30)));
    const c = content.getBoundingClientRect();
    const p = pane.getBoundingClientRect();
    // Scrolled to the very end the pane (short detail → top-sticky) is
    // still inside the scroller's viewport — the old behaviour left it at
    // the top of the document, 9000px above.
    expect(p.top, "pane top inside viewport").to.be.at.least(c.top - 1);
    expect(p.top, "pane not scrolled away").to.be.below(c.bottom);
  });

  it("selecting a task at the bottom of a long list parks the detail where the user is", async () => {
    const rows = Array.from({ length: 60 }, () => task({ status: "ok" }));
    const r = await mountPanel([obj("e1", rows)], {
      "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
    });
    const el = r.el as PanelPriv;
    el.style.width = "1700px";
    // A short viewport: the detail (~440px) is taller than what is left of
    // the list below the scroll position, so plain sticky could not reach
    // the viewport top — the pane must be parked there explicitly.
    el.style.height = "300px";
    await new Promise((res) => setTimeout(res, 120));
    await el.updateComplete;
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".split-pane"), "split pane rendered");
    const content = sr.querySelector<HTMLElement>(".content")!;
    content.scrollTop = content.scrollHeight;
    await new Promise((res) => requestAnimationFrame(() => setTimeout(res, 30)));
    const atBottom = content.scrollTop;
    expect(atBottom, "list scrolled").to.be.greaterThan(1000);

    const all = sr.querySelectorAll(".task-row .cell.task-name");
    (all[all.length - 1] as HTMLElement).click();
    await el.updateComplete;
    await waitUntil(() => !!sr.querySelector(".split-pane maintenance-task-detail-view"), "detail docked");
    await new Promise((res) => requestAnimationFrame(() => setTimeout(res, 60)));

    const c = content.getBoundingClientRect();
    const p = sr.querySelector<HTMLElement>(".split-pane")!.getBoundingClientRect();
    expect(content.scrollTop, "no scroll jump").to.equal(atBottom);
    // The pane's TOP edge is at the viewport top (+gap), not 2000px above
    // (which is where the grid area would otherwise leave a pane taller
    // than the tail of the list).
    expect(p.height, "detail taller than the viewport").to.be.greaterThan(content.clientHeight);
    expect(p.top).to.be.at.least(c.top);
    expect(p.top).to.be.below(c.top + 40);
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
