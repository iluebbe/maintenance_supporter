/**
 * Narrow rows share their column tracks (2026-09-01): with per-row grids the
 * auto badge column sized independently, so an "OK" row's object name started
 * further left than a "Due Soon" row's — the list read jittery. The list now
 * owns the four tracks (the wide layout's #66 subgrid lesson).
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

  it("object-name and due columns start at the same X in every row", async () => {
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
    const lefts = (sel: string) =>
      [...sr.querySelectorAll(`.task-row ${sel}`)].map((c) => Math.round(c.getBoundingClientRect().left));
    for (const sel of [".cell.object-name", ".due-cell", ".row-actions"]) {
      const xs = lefts(sel);
      expect(xs.length, sel).to.be.at.least(3);
      expect(new Set(xs).size, `${sel} aligned, got ${xs}`).to.equal(1);
    }
  });
});
