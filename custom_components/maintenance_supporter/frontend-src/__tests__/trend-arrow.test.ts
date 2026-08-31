/**
 * #150 follow-up (Variante B): on narrow/tight rows the squeezed sparkline is
 * replaced by a 3-state trend arrow in the trigger label — direction is
 * relative to the THRESHOLD (a dropping salt level and a rising runtime both
 * read "approaching"). The wide regime keeps the sparkline. The due column is
 * fixed at 100px in the narrow grid so every row's bar reads the same width.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { computeTrend, renderTriggerProgress } from "../renderers/progress.js";
import type { StatisticsPoint, TaskRow } from "../types";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

const DAY = 86400e3;
const pts = (...vals: number[]): StatisticsPoint[] =>
  vals.map((val, i) => ({ ts: Date.now() - (vals.length - i) * DAY, val })) as StatisticsPoint[];

const stats = (eid: string, ...vals: number[]) => new Map([[eid, pts(...vals)]]);

function row(tc: Record<string, unknown>, current: number | null = null): TaskRow {
  return { trigger_config: { entity_id: "sensor.x", ...tc }, trigger_current_value: current } as unknown as TaskRow;
}

describe("computeTrend", () => {
  it("below-threshold: a dropping value approaches, a rising one eases", () => {
    const salt = row({ type: "threshold", trigger_below: 20 });
    expect(computeTrend(salt, stats("sensor.x", 80, 60, 40))).to.equal("approaching");
    expect(computeTrend(salt, stats("sensor.x", 40, 60, 80))).to.equal("easing");
  });

  it("above-threshold and accumulating types approach on a rising value", () => {
    expect(computeTrend(row({ type: "threshold", trigger_above: 60 }), stats("sensor.x", 30, 45, 54))).to.equal("approaching");
    expect(computeTrend(row({ type: "runtime", trigger_runtime_hours: 6 }), stats("sensor.x", 1, 2, 4))).to.equal("approaching");
    expect(computeTrend(row({ type: "counter", trigger_target_value: 100 }), stats("sensor.x", 90, 70, 40))).to.equal("easing");
  });

  it("a flat series is stable (movement under 15% of the range)", () => {
    expect(computeTrend(row({ type: "threshold", trigger_above: 60 }), stats("sensor.x", 50, 50.2, 50.1, 50.15))).to.equal("stable");
  });

  it("no arrow for discrete levels, compound, or fewer than two points", () => {
    expect(computeTrend(row({ type: "threshold", trigger_equals: 3 }), stats("sensor.x", 1, 2, 3))).to.equal(null);
    expect(computeTrend(row({ type: "compound", conditions: [] }), stats("sensor.x", 1, 2, 3))).to.equal(null);
    expect(computeTrend(row({ type: "threshold", trigger_above: 60 }), new Map())).to.equal(null);
  });
});

describe("renderTriggerProgress with a trend", () => {
  it("renders the arrow with its state class and tooltip", async () => {
    const r = row({ type: "threshold", trigger_above: 60 }, 54.2);
    const el = await fixture(html`<div>${renderTriggerProgress(r, { trend: "approaching", lang: "en" })}</div>`);
    const arrow = el.querySelector(".trend-arrow")!;
    expect(arrow.classList.contains("trend-approaching")).to.equal(true);
    expect(arrow.textContent).to.equal("↗");
    expect(arrow.getAttribute("title")).to.have.length.greaterThan(3);
  });

  it("renders no arrow without a trend (back-compat callers)", async () => {
    const r = row({ type: "threshold", trigger_above: 60 }, 54.2);
    const el = await fixture(html`<div>${renderTriggerProgress(r)}</div>`);
    expect(el.querySelector(".trend-arrow")).to.equal(null);
  });
});

describe("narrow regime: arrow visible, sparkline hidden, equal bar widths", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });

  it("swaps curve for arrow and pins every due cell to the same width", async () => {
    const sensorTask = task({
      status: "triggered",
      schedule_type: "sensor_based",
      trigger_active: true,
      trigger_current_value: 54.2,
      trigger_config: { type: "threshold", entity_id: "sensor.x", trigger_above: 60 },
    });
    const timeTask = task({ status: "due_soon", days_until_due: 0 });
    const r = await mountPanel([obj("e1", [sensorTask, timeTask])], {
      "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
    });
    const el = r.el as HTMLElement & { updateComplete: Promise<unknown>; narrow: boolean };
    (el as unknown as { _miniStatsData: Map<string, StatisticsPoint[]> })._miniStatsData = stats("sensor.x", 30, 45, 54);
    el.style.width = "400px";
    el.narrow = true;
    await new Promise((res) => setTimeout(res, 80));
    await el.updateComplete;

    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".task-row .trend-arrow"), "arrow rendered");
    const arrow = sr.querySelector(".task-row .trend-arrow")!;
    expect(getComputedStyle(arrow).display).to.equal("inline");
    const spark = sr.querySelector(".task-row .mini-sparkline");
    if (spark) expect(getComputedStyle(spark).display).to.equal("none");

    // Fixed due column: both rows' cells read the same width.
    const widths = [...sr.querySelectorAll(".task-row .due-cell")].map((c) => Math.round(c.getBoundingClientRect().width));
    expect(widths.length).to.be.at.least(2);
    expect(new Set(widths).size, `equal widths, got ${widths}`).to.equal(1);
    // The track is fixed (100px, 84px under 380px viewports) — the cell's
    // measured box can round a few px under it in the shared-track subgrid.
    expect(widths[0]).to.be.within(84, 100);
  });

  it("wide regime keeps the sparkline and hides the arrow", async () => {
    const sensorTask = task({
      status: "triggered",
      schedule_type: "sensor_based",
      trigger_active: true,
      trigger_current_value: 54.2,
      trigger_config: { type: "threshold", entity_id: "sensor.x", trigger_above: 60 },
    });
    const r = await mountPanel([obj("e1", [sensorTask])], {
      "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
    });
    const el = r.el as HTMLElement & { updateComplete: Promise<unknown>; narrow: boolean };
    (el as unknown as { _miniStatsData: Map<string, StatisticsPoint[]> })._miniStatsData = stats("sensor.x", 30, 45, 54);
    el.style.width = "1400px";
    el.narrow = false;
    await new Promise((res) => setTimeout(res, 80));
    await el.updateComplete;
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".task-row .trend-arrow"), "arrow in DOM");
    expect(getComputedStyle(sr.querySelector(".task-row .trend-arrow")!).display, "arrow hidden on wide").to.equal("none");
    const spark = sr.querySelector(".task-row .mini-sparkline")!;
    expect(spark, "sparkline rendered on wide").to.not.equal(null);
    expect(getComputedStyle(spark).display).to.not.equal("none");
  });
});
