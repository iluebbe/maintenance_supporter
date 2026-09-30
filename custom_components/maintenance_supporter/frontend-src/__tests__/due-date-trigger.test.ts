/** Due-date trigger in the panel: a sensor that reports WHEN the
 *  maintenance is due. Its reading is the days left (fractional); rows show
 *  whole days the way every due date does, and a missing lead time is 0. */

import { expect } from "@open-wc/testing";
import { applyTypeFields, typeFieldsFromConfig } from "../components/task-dialog.js";
import { dueDaysOf, renderTriggerProgress } from "../renderers/progress.js";
import { render } from "lit";

describe("due_date trigger", () => {
  it("a stored trigger without a lead time edits as 0 and saves as 0", () => {
    const fields = typeFieldsFromConfig({ type: "due_date" } as never);
    expect(fields.daysBefore).to.equal("0");
    const out: Record<string, unknown> = { type: "due_date" };
    applyTypeFields(out as never, { ...fields, daysBefore: "" });
    expect(out.trigger_days_before).to.equal(0);
  });

  it("days left read as whole days: later today is today, 30 hours are 2 days", () => {
    expect(dueDaysOf(0.2)).to.equal(1);
    expect(dueDaysOf(1.25)).to.equal(2);
    expect(dueDaysOf(0)).to.equal(0);
    expect(dueDaysOf(-0.4)).to.equal(0);
    expect(dueDaysOf(-2.6)).to.equal(-2);
  });

  function label(val: number, lead = 7): { text: string; width: string } {
    const host = document.createElement("div");
    render(
      renderTriggerProgress({ trigger_config: { type: "due_date", trigger_days_before: lead }, trigger_current_value: val } as never, { lang: "en" }),
      host,
    );
    const fill = host.querySelector<HTMLElement>(".trigger-progress-fill")!;
    return { text: host.querySelector(".trigger-progress-label")!.textContent!.trim(), width: fill.style.width };
  }

  it("the row says how far the date is, and fills once within the lead time", () => {
    expect(label(12.3).text).to.equal("13 days");
    expect(label(12.3).width).to.not.equal("100%");
    expect(label(5).width).to.equal("100%");
    expect(label(1).text).to.equal("1 day");
    expect(label(-3.2).text).to.include("overdue");
  });
});
