/**
 * The interval anchor says what its two choices do (#212).
 *
 * A yearly payment made weeks before its due date: with "From completion
 * date" the next due date counts from the payment and moves earlier every
 * year; "From planned date" keeps the schedule's dates. The choice had no
 * explanation next to it. Pins: the help sits under the anchor select (in
 * its row), localized, and only where the select is (interval schedules).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-dialog.js";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import { t } from "../styles.js";
import { createMockHass } from "./_test-utils.js";

describe("task dialog: interval anchor help", () => {
  async function openNew() {
    const { hass } = createMockHass();
    const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
    await el.openCreate("entry_x");
    await el.updateComplete;
    return el;
  }

  it("explains both choices under the anchor select", async () => {
    const el = await openNew();
    const help = el.shadowRoot!.querySelector(".anchor-help");
    expect(help, "help shown for an interval schedule").to.exist;
    expect(help!.textContent!.trim()).to.equal(t("interval_anchor_hint", "en"));
    expect(help!.closest(".select-row")!.querySelector("select option[value=planned]"), "in the anchor's row").to.exist;
  });

  it("is not shown where there is no anchor to choose", async () => {
    const el = await openNew();
    (el as unknown as { _scheduleType: string })._scheduleType = "one_time";
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".anchor-help")).to.equal(null);
  });
});
