/** Tests for the trigger-section renderer (progress header + stats-fallback note). */

import { expect } from "@open-wc/testing";
import { render } from "lit";
import { renderTriggerSection, type SparklineContext } from "../renderers/sparkline.js";
import type { MaintenanceTask, StatisticsPoint } from "../types";

function ctx(overrides: Partial<SparklineContext> = {}): SparklineContext {
  return {
    lang: "en",
    detailStatsData: new Map<string, StatisticsPoint[]>(),
    hasStatsService: true,
    isCounterEntity: () => false,
    rangeDays: 30,
    setRangeDays: () => undefined,
    hideOutliers: false,
    setHideOutliers: () => undefined,
    ...overrides,
  };
}

function task(overrides: Record<string, unknown>): MaintenanceTask {
  return {
    id: "t1",
    name: "Task",
    history: [],
    trigger_active: false,
    ...overrides,
  } as unknown as MaintenanceTask;
}

function mount(t: MaintenanceTask, c: SparklineContext): HTMLElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  render(renderTriggerSection(t, c), host);
  return host;
}

describe("trigger-section", () => {
  afterEach(() => {
    document.body.querySelectorAll("div").forEach((d) => d.remove());
  });

  it("shows a progress header for state_change tasks (changes vs target)", () => {
    const host = mount(
      task({
        trigger_config: { type: "state_change", entity_id: "input_boolean.wm", trigger_target_changes: 8 },
        trigger_current_value: 5,
      }),
      ctx(),
    );
    const main = host.querySelector(".counter-progress-main");
    expect(main, "progress header rendered").to.exist;
    expect(main!.textContent).to.contain("5");
    expect(main!.textContent).to.contain("8");
    expect(host.querySelector(".counter-progress-pct")!.textContent).to.contain("63");
  });

  it("shows a progress header for runtime tasks (hours vs target)", () => {
    const host = mount(
      task({
        trigger_config: { type: "runtime", entity_id: "input_boolean.comp", trigger_runtime_hours: 500 },
        trigger_current_value: 400,
      }),
      ctx(),
    );
    const pct = host.querySelector(".counter-progress-pct");
    expect(pct, "progress header rendered").to.exist;
    expect(pct!.textContent).to.contain("80");
    expect(pct!.classList.contains("near"), "80% renders in the warning tier").to.be.true;
  });

  it("notes the statistics fallback when the entity has no long-term stats", () => {
    const history = [1, 2, 3].map((i) => ({
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      type: "completed",
      trigger_value: i * 10,
    }));
    const host = mount(
      task({
        trigger_config: { type: "threshold", entity_id: "sensor.no_stats", trigger_below: 5 },
        trigger_current_value: 42,
        history,
      }),
      // Stats were fetched and came back EMPTY → fallback note expected.
      ctx({ detailStatsData: new Map([["sensor.no_stats", []]]) }),
    );
    expect(host.querySelector(".chart-note"), "fallback note shown").to.exist;
  });

  it("shows no fallback note when real statistics exist", () => {
    const stats: StatisticsPoint[] = Array.from({ length: 5 }, (_, i) => ({
      ts: Date.now() - (5 - i) * 86400000,
      val: 50 + i,
    }));
    const host = mount(
      task({
        trigger_config: { type: "threshold", entity_id: "sensor.with_stats", trigger_below: 5 },
        trigger_current_value: 55,
      }),
      ctx({ detailStatsData: new Map([["sensor.with_stats", stats]]) }),
    );
    expect(host.querySelector(".chart-note"), "no note with real stats").to.not.exist;
    expect(host.querySelector("maintenance-trigger-chart"), "chart rendered").to.exist;
  });
});
