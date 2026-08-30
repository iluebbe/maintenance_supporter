/**
 * The chips column under squeeze (#145 follow-up, duty-rotation GIF
 * 2026-08-30): in the WIDE grid the task-sub track is minmax(0, …) and its
 * nowrap chips used to paint over the neighbouring type column. They now
 * clip inside their own track. In the NARROW layout the chips get their own
 * full-width row and must WRAP — nothing may be cut there.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

type PanelPriv = HTMLElement & { updateComplete: Promise<unknown>; narrow: boolean };

const CHIPPY = () =>
  task({
    status: "overdue",
    days_until_due: -2,
    responsible_user_id: "u-anna",
    labels: ["air quality filters", "seasonal maintenance", "safety"],
  });

async function mountAt(width: number, narrow: boolean) {
  const objects = [obj("e1", [CHIPPY()])];
  const r = await mountPanel(objects, {
    "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
    "maintenance_supporter/users/list": () => ({ users: [{ id: "u-anna", name: "Anna Annamaria" }] }),
  });
  const el = r.el as PanelPriv;
  el.style.width = `${width}px`;
  el.narrow = narrow;
  await new Promise((res) => setTimeout(res, 80));
  await el.updateComplete;
  return el;
}

const rect = (n: Element) => n.getBoundingClientRect();

describe("task-sub squeeze behaviour", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });

  it("wide squeeze: chips stay inside their track and never touch the type column", async () => {
    const el = await mountAt(1000, false); // ≥ 920 → wide grid, tight not set
    const sr = el.shadowRoot!;
    await waitUntil(() => sr.querySelectorAll(".task-row .sub-chip").length >= 3, "chips rendered");
    const row = sr.querySelector(".task-row")!;
    const sub = row.querySelector(".task-sub")!;
    const type = row.querySelector(".cell.type")!;
    const subR = rect(sub);
    const typeR = rect(type);
    // The chips container itself must not reach into the type column.
    expect(subR.right, "task-sub ends before the type column").to.be.at.most(typeR.left + 1);
    // Whatever a chip cannot fit is clipped by the container, not painted
    // outside of it (overflow: hidden makes the visible box the container).
    for (const chip of sub.querySelectorAll(".sub-chip")) {
      const c = rect(chip);
      const visibleRight = Math.min(c.right, subR.right);
      expect(visibleRight, "no chip paints past the container").to.be.at.most(typeR.left + 1);
    }
  });

  it("narrow: chips wrap in their own row and are fully visible", async () => {
    const el = await mountAt(400, true);
    const sr = el.shadowRoot!;
    await waitUntil(() => sr.querySelectorAll(".task-row .sub-chip").length >= 3, "chips rendered");
    const sub = sr.querySelector(".task-row .task-sub")!;
    const subR = rect(sub);
    // Wrapped, not clipped: every chip sits completely inside the container.
    for (const chip of sub.querySelectorAll(".sub-chip")) {
      const c = rect(chip);
      expect(c.right, "chip right edge inside").to.be.at.most(subR.right + 1);
      expect(c.bottom, "chip bottom edge inside").to.be.at.most(subR.bottom + 1);
      expect(c.width, "chip has real width").to.be.greaterThan(20);
    }
    // And the container grew to hold them (wrap → more than one line).
    expect(subR.height).to.be.greaterThan(30);
  });
});
