/**
 * renderTriggerProgress — threshold bars must read the same for negative
 * limits and for two-sided bands (bug review 2026-09-04):
 *
 *  - `above = −15` (freezer "warn above −15 °C") anchored its floor at 0,
 *    ABOVE the limit: a safe −20 °C rendered as a full red bar.
 *  - `below = −10` doubled the limit for its ceiling (−20, BELOW the limit):
 *    a safe −5 rendered as full red, a triggered −15 as half.
 *  - both limits: the bar measured from `below` up to `above`, so a reading
 *    just under `below` — already triggered — showed 0 % green.
 */

import { expect, fixture, html } from "@open-wc/testing";
import { renderTriggerProgress } from "../renderers/progress.js";
import type { TaskRow } from "../types";

function row(tc: Record<string, unknown>, current: number, info: Record<string, unknown> = {}): TaskRow {
  return {
    trigger_config: { type: "threshold", entity_id: "sensor.x", ...tc },
    trigger_current_value: current,
    trigger_entity_info: { entity_id: "sensor.x", friendly_name: "x", unit_of_measurement: "°C", ...info },
  } as unknown as TaskRow;
}

async function pctOf(r: TaskRow): Promise<number> {
  const el = await fixture(html`<div>${renderTriggerProgress(r, { lang: "en" })}</div>`);
  const fill = el.querySelector<HTMLElement>(".trigger-progress-fill")!;
  return parseFloat(fill.style.width);
}

async function labelOf(r: TaskRow): Promise<string> {
  const el = await fixture(html`<div>${renderTriggerProgress(r, { lang: "en" })}</div>`);
  return el.querySelector(".trigger-progress-label")!.textContent!.trim();
}

describe("renderTriggerProgress — sign-aware threshold bars", () => {
  it("negative upper limit: a safe reading is partial, the limit is full", async () => {
    // Floor one |limit| below: −30 … −15.
    expect(await pctOf(row({ trigger_above: -15 }, -20))).to.be.closeTo(66.7, 0.5);
    expect(await pctOf(row({ trigger_above: -15 }, -30))).to.equal(0);
    expect(await pctOf(row({ trigger_above: -15 }, -10))).to.equal(100);
    // The entity's own min wins as the floor when it is known.
    expect(await pctOf(row({ trigger_above: -15 }, -20, { min: -25 }))).to.equal(50);
  });

  it("positive upper limit keeps its zero floor", async () => {
    expect(await pctOf(row({ trigger_above: 60 }, 30))).to.equal(50);
  });

  it("negative lower limit: the ceiling sits ABOVE the limit", async () => {
    // Ceiling one |limit| above: −10 … 0.
    expect(await pctOf(row({ trigger_below: -10 }, -5))).to.equal(50);
    expect(await pctOf(row({ trigger_below: -10 }, 0))).to.equal(0);
    expect(await pctOf(row({ trigger_below: -10 }, -15))).to.equal(100);
  });

  it("positive lower limit keeps the 2× ceiling and the entity max", async () => {
    expect(await pctOf(row({ trigger_below: 20 }, 30))).to.equal(50);
    expect(await pctOf(row({ trigger_below: 20 }, 60, { max: 100 }))).to.equal(50);
  });

  it("a zero limit gets a 100-wide scale on its safe side", async () => {
    expect(await pctOf(row({ trigger_above: 0 }, -50))).to.equal(50);
    expect(await pctOf(row({ trigger_below: 0 }, 50))).to.equal(50);
  });

  it("a band fills toward EITHER edge and names the nearer limit", async () => {
    const band = { trigger_below: 20, trigger_above: 60 };
    expect(await pctOf(row(band, 40)), "centre = safest").to.equal(0);
    expect(await pctOf(row(band, 55)), "near the upper edge").to.equal(75);
    expect(await pctOf(row(band, 25)), "near the lower edge").to.equal(75);
    expect(await pctOf(row(band, 15)), "below the band = triggered").to.equal(100);
    expect(await labelOf(row(band, 25))).to.contain("25.0 / 20");
    expect(await labelOf(row(band, 55))).to.contain("55.0 / 60");
  });
});
