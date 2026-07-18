/**
 * renderTriggerProgress: delta-mode counters must never fall back to the RAW
 * counter value (issue #102 — a 27,000 km odometer with a 15,000 km interval
 * rendered as a full red "27000/15000" bar right after adoption, before the
 * baseline reached the read-model). Pins: delta used when present, computed
 * from baseline when only the baseline is known, NOTHING rendered while the
 * baseline is still unknown, and absolute-mode counters keep the raw value.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { renderTriggerProgress } from "../renderers/progress.js";
import type { TaskRow } from "../types";

function row(overrides: Partial<TaskRow>): TaskRow {
  return {
    trigger_config: {
      type: "counter",
      trigger_target_value: 15000,
      trigger_delta_mode: true,
    },
    trigger_current_value: 27000,
    trigger_current_delta: null,
    trigger_baseline_value: null,
    ...overrides,
  } as unknown as TaskRow;
}

async function labelOf(r: TaskRow): Promise<string | null> {
  const el = await fixture(html`<div>${renderTriggerProgress(r)}</div>`);
  return el.querySelector(".trigger-progress-label")?.textContent?.trim() ?? null;
}

describe("renderTriggerProgress — delta-mode counter (issue #102)", () => {
  it("renders nothing while the baseline is still unknown (no raw-value lie)", async () => {
    expect(await labelOf(row({}))).to.equal(null);
  });

  it("uses the exposed delta when present", async () => {
    const label = await labelOf(row({ trigger_current_delta: 100 }));
    expect(label).to.contain("100.0 / 15000");
  });

  it("computes the delta from the baseline when only the baseline is exposed", async () => {
    const label = await labelOf(row({ trigger_baseline_value: 27000 }));
    expect(label).to.contain("0.0 / 15000");
  });

  it("keeps the raw value for absolute-mode counters", async () => {
    const label = await labelOf(
      row({ trigger_config: { type: "counter", trigger_target_value: 30000 } as never }),
    );
    expect(label).to.contain("27000.0 / 30000");
  });
});
