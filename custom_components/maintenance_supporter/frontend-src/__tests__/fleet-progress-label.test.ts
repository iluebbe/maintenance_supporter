/**
 * renderTriggerProgress — the battery-fleet task's row. Its sensor counts the
 * batteries to replace against an "above 0" limit; the generic threshold
 * label read "4.0 / 0 batteries" (a count with a decimal, over a meaningless
 * zero), and the zero limit's 100-wide scale painted an empty fleet as a full
 * red bar.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { renderTriggerProgress } from "../renderers/progress.js";
import type { TaskRow } from "../types";

function fleet(count: number, above = 0, fleetTask = true): TaskRow {
  return {
    battery_fleet_task: fleetTask,
    trigger_config: { type: "threshold", entity_id: "sensor.maintenance_supporter_batteries_to_replace", trigger_above: above },
    trigger_current_value: count,
    trigger_entity_info: {
      entity_id: "sensor.maintenance_supporter_batteries_to_replace",
      friendly_name: "Batteries to replace",
      unit_of_measurement: "batteries",
    },
  } as unknown as TaskRow;
}

async function render(r: TaskRow) {
  const el = await fixture(html`<div>${renderTriggerProgress(r, { lang: "en" })}</div>`);
  return {
    label: el.querySelector(".trigger-progress-label")!.textContent!.trim(),
    pct: parseFloat(el.querySelector<HTMLElement>(".trigger-progress-fill")!.style.width),
  };
}

describe("renderTriggerProgress — battery fleet", () => {
  it("counts the batteries to replace instead of '4.0 / 0 batteries'", async () => {
    const { label, pct } = await render(fleet(4));
    expect(label).to.equal("4 to replace");
    expect(pct).to.equal(100);
  });

  it("an empty fleet is an empty bar", async () => {
    const { label, pct } = await render(fleet(0));
    expect(label).to.equal("0 to replace");
    expect(pct).to.equal(0);
  });

  it("a raised limit fills toward the count that triggers", async () => {
    expect((await render(fleet(1, 2))).pct).to.be.closeTo(33.3, 0.5);
    expect((await render(fleet(3, 2))).pct).to.equal(100);
  });

  it("any other threshold task keeps its current / limit label", async () => {
    expect((await render(fleet(4, 0, false))).label).to.equal("4.0 / 0 batteries");
  });
});
