/** <maintenance-object-history-section> (#138): full-history fetch, merged
 * rows, filters, totals, cap note, open-task event. */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/object-history-section.js";
import type { MaintenanceObjectHistorySection } from "../components/object-history-section";
import { createMockHass } from "./_test-utils.js";

const FULL: Record<string, unknown[]> = {
  t_oil: [
    { timestamp: "2026-03-10T09:00:00+00:00", type: "completed", cost: 89.5, duration: 40, notes: "5W-30" },
    { timestamp: "2025-03-12T10:00:00+00:00", type: "completed", cost: 85 },
  ],
  t_tires: [
    { timestamp: "2026-04-02T14:30:00+00:00", type: "completed", cost: 20 },
    { timestamp: "2025-10-05T09:00:00+00:00", type: "skipped", notes: "winter set on" },
  ],
};

const TASKS = [
  { id: "t_oil", name: "Oil change", history: [] },
  { id: "t_tires", name: "Tire rotation", history: [] },
] as never[];

async function mount(histories: Record<string, unknown[]> = FULL) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/history": (msg) => ({ history: histories[msg.task_id as string] ?? [] }),
    },
  });
  const el = await fixture<MaintenanceObjectHistorySection>(html`
    <maintenance-object-history-section
      .hass=${hass as never}
      .entryId=${"e1"}
      .object=${{ name: "Family Car" } as never}
      .tasks=${TASKS as never}
      .currencySymbol=${"€"}
    ></maintenance-object-history-section>
  `);
  await waitUntil(() => el.shadowRoot!.querySelectorAll(".row").length > 0, "rows render");
  return { el, sent };
}

const rows = (el: MaintenanceObjectHistorySection) => [...el.shadowRoot!.querySelectorAll(".row")];

describe("object-history-section", () => {
  it("fetches every task's full history and renders merged, newest first", async () => {
    const { el, sent } = await mount();
    const fetched = sent.filter((m) => m.type === "maintenance_supporter/task/history").map((m) => m.task_id);
    expect(fetched.sort()).to.deep.equal(["t_oil", "t_tires"]);
    const names = rows(el).map((r) => r.querySelector(".task-link")!.textContent!.trim());
    expect(names).to.deep.equal(["Tire rotation", "Oil change", "Tire rotation", "Oil change"]);
    // totals footer sums completed costs
    expect(el.shadowRoot!.querySelector(".totals")!.textContent).to.contain("194.50");
  });

  it("filters by task and by date range", async () => {
    const { el } = await mount();
    const priv = el as unknown as { _filterTask: string; _from: string };
    priv._filterTask = "t_oil";
    await el.updateComplete;
    expect(rows(el).length).to.equal(2);
    priv._from = "2026-01-01";
    await el.updateComplete;
    expect(rows(el).length).to.equal(1);
    expect(rows(el)[0].textContent).to.contain("Oil change");
  });

  it("emits open-task when a row's task name is clicked", async () => {
    const { el } = await mount();
    let opened = "";
    el.addEventListener("open-task", (e) => { opened = (e as CustomEvent<{ taskId: string }>).detail.taskId; });
    (rows(el)[0].querySelector(".task-link") as HTMLElement).click();
    expect(opened).to.equal("t_tires");
  });

  it("shows the retention-cap note only when a task history hits the cap", async () => {
    const { el } = await mount();
    expect(el.shadowRoot!.querySelector(".cap-note")).to.equal(null);
    const capped = Array.from({ length: 500 }, (_, i) => ({
      timestamp: new Date(Date.UTC(2020, 0, 1) + i * 86400000).toISOString(),
      type: "completed",
    }));
    const { el: el2 } = await mount({ t_oil: capped, t_tires: [] });
    expect(el2.shadowRoot!.querySelector(".cap-note"), "cap note shown").to.exist;
  });
});
