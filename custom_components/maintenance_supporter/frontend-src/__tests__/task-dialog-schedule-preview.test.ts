/**
 * <maintenance-task-dialog>: the live "next dates" schedule preview (#83).
 *
 * Pins: the dialog debounce-fetches maintenance_supporter/schedule/preview
 * with the DRAFT schedule (engine dict form, mirroring the save mapping),
 * renders the returned occurrences as weekday-prefixed dates, appends the
 * series-end hint, and hides the box for manual schedules.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { type SentMessage, createMockHass } from "./_test-utils.js";

async function mountCreate(previewResponse: {
  occurrences: string[];
  series_ended: boolean;
}): Promise<{ el: MaintenanceTaskDialog; sent: SentMessage[] }> {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/schedule/preview": () => previewResponse,
    },
  });
  const el = await fixture<MaintenanceTaskDialog>(html`
    <maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>
  `);
  await el.updateComplete;
  await el.openCreate("entry_x", []);
  await el.updateComplete;
  return { el, sent };
}

const settle = async (el: MaintenanceTaskDialog) => {
  await new Promise((r) => setTimeout(r, 400)); // debounce is 300 ms
  await el.updateComplete;
};

describe("task-dialog schedule preview (#83)", () => {
  it("fetches the draft schedule and renders weekday-prefixed dates", async () => {
    const { el, sent } = await mountCreate({
      occurrences: ["2027-01-09", "2027-07-10", "2028-01-08"],
      series_ended: false,
    });
    (el as any)._scheduleType = "nth_weekday";
    (el as any)._nth = "2";
    (el as any)._nthWeekday = "5";
    (el as any)._seasonMonths = [1, 7];
    await settle(el);

    const req = sent.find((m) => m.type === "maintenance_supporter/schedule/preview") as any;
    expect(req, "preview request sent").to.exist;
    expect(req.schedule).to.deep.include({ kind: "nth_weekday", nth: 2, weekday: 5 });
    expect(req.schedule.season_months).to.deep.equal([1, 7]);

    const box = el.shadowRoot!.querySelector(".schedule-preview");
    expect(box, "preview box rendered").to.exist;
    const text = box!.textContent!.replace(/\s+/g, " ");
    expect(text).to.contain("2027");
    expect(text).to.match(/Sat|Sa/); // weekday prefix from the shared helper
  });

  it("shows the series-end hint and hides for manual schedules", async () => {
    const { el } = await mountCreate({
      occurrences: ["2026-07-26", "2026-08-02"],
      series_ended: true,
    });
    (el as any)._scheduleType = "time_based";
    (el as any)._intervalDays = "7";
    (el as any)._endsMode = "count";
    (el as any)._endsCount = "2";
    await settle(el);
    const box = el.shadowRoot!.querySelector(".schedule-preview");
    expect(box!.textContent).to.contain("series ends");

    (el as any)._scheduleType = "manual";
    await settle(el);
    expect(el.shadowRoot!.querySelector(".schedule-preview")).to.equal(null);
  });
});
