/**
 * Narrow rows share their column tracks (2026-09-01): with per-row grids the
 * auto badge column sized independently, so an "OK" row's chip strip started
 * further left than a "Due Soon" row's — the list read jittery. The list now
 * owns the four tracks (the wide layout's #66 subgrid lesson).
 *
 * Two-row phone layout (2026-09-02, #150): row 1 = task name + object name,
 * row 2 = status icon | chips | due | actions. Row-2 columns must still line
 * up across rows, and the object names must share their right edge.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

describe("narrow row alignment (shared tracks)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });

  it("row-2 columns start at the same X in every row; object names share a right edge", async () => {
    const rows = [
      task({ status: "ok" }),                                  // short pill
      task({ status: "due_soon", days_until_due: 2, priority: "high" }), // long pill + chevron
      task({ status: "overdue", days_until_due: -3 }),
    ];
    const r = await mountPanel([obj("e1", rows)], {
      "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
    });
    const el = r.el as HTMLElement & { updateComplete: Promise<unknown>; narrow: boolean };
    el.style.width = "400px";
    el.narrow = true;
    await new Promise((res) => setTimeout(res, 80));
    await el.updateComplete;

    const sr = el.shadowRoot!;
    await waitUntil(() => sr.querySelectorAll(".task-row .cell.object-name").length >= 3, "rows rendered");
    const edges = (sel: string, edge: "left" | "right") =>
      [...sr.querySelectorAll(`.task-row ${sel}`)].map((c) => Math.round(c.getBoundingClientRect()[edge]));
    for (const sel of [".cell-badges", ".task-sub", ".due-cell", ".row-actions"]) {
      const xs = edges(sel, "left");
      expect(xs.length, sel).to.be.at.least(3);
      expect(new Set(xs).size, `${sel} aligned, got ${xs}`).to.equal(1);
    }
    const rights = edges(".cell.object-name", "right");
    expect(new Set(rights).size, `object-name right edges aligned, got ${rights}`).to.equal(1);

    // Row 1 holds task + object name side by side; row 2 sits below it.
    const row = sr.querySelector(".task-row")!;
    const name = row.querySelector(".cell.task-name")!.getBoundingClientRect();
    const objName = row.querySelector(".cell.object-name")!.getBoundingClientRect();
    const due = row.querySelector(".due-cell")!.getBoundingClientRect();
    expect(Math.abs(name.top - objName.top), "task + object name on the same line").to.be.at.most(4);
    expect(objName.left, "object name to the right of the task name").to.be.at.least(name.right - 1);
    expect(due.top, "due cell below row 1").to.be.at.least(name.bottom - 1);

    // The status pill is icon-only on phones — the label survives for AT only.
    const badge = row.querySelector(".status-badge")!;
    const label = badge.querySelector(".status-label")!;
    expect(getComputedStyle(label).display, "status label hidden on narrow").to.equal("none");
    expect((badge.getAttribute("aria-label") || "").length, "status badge keeps an aria-label").to.be.greaterThan(0);
  });
});
