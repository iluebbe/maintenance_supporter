/**
 * The beta UI's sensor rule on the task page (renderers/sparkline.ts
 * renderSensorRule): Home Assistant's entities-card vocabulary instead of
 * raw entity ids.
 *
 * Pins: one row per sensor (a compound: per condition), the condition in
 * the editor's words with the sensor's unit, HA's formatted state on the
 * right, the state badge when HA has it, more-info on a tap and on Enter,
 * no entity id in the visible text, "Show more" into HA's history of every
 * sensor of the rule, the any/all subtitle, the progress kept for counters,
 * and no event-value line for a state change without history. Classic
 * (beta off) keeps the old card.
 */

import { expect } from "@open-wc/testing";
import { render } from "lit";
import { renderTriggerSection, ruleSensors, type SparklineContext } from "../renderers/sparkline.js";
import { conditionText, withUnit } from "../helpers/task-rules";
import { setBetaUi } from "../helpers/beta-ui";
import type { HomeAssistant, MaintenanceTask, StatisticsPoint, TriggerConfig } from "../types";

const STATES: Record<string, { state: string; attributes: Record<string, unknown> }> = {
  "sensor.hvac_airflow": { state: "60.1", attributes: { unit_of_measurement: "%", friendly_name: "HVAC airflow" } },
  "sensor.dehumidifier_tank": { state: "50.7", attributes: { unit_of_measurement: "%", friendly_name: "Dehumidifier tank" } },
  "sensor.basement_humidity": { state: "85", attributes: { unit_of_measurement: "%", friendly_name: "Basement humidity" } },
  "sensor.washer_total_washes": { state: "632", attributes: { friendly_name: "Washer total washes" } },
  "sensor.printer_status": { state: "paper_jam", attributes: { friendly_name: "Printer status" } },
};

function hass(): HomeAssistant {
  return {
    language: "en",
    states: STATES,
    formatEntityState: (so: { state: string; attributes: Record<string, unknown> }) =>
      `F(${so.state}${so.attributes.unit_of_measurement ? ` ${so.attributes.unit_of_measurement}` : ""})`,
  } as unknown as HomeAssistant;
}

function ctx(overrides: Partial<SparklineContext> = {}): SparklineContext {
  return {
    lang: "en",
    hass: hass(),
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

function task(tc: TriggerConfig, overrides: Record<string, unknown> = {}): MaintenanceTask {
  return { id: "t1", name: "Task", history: [], trigger_active: false, trigger_config: tc, ...overrides } as unknown as MaintenanceTask;
}

function mount(t: MaintenanceTask, c: SparklineContext = ctx()): HTMLElement {
  const host = document.createElement("div");
  host.className = "sensor-rule-host";
  document.body.appendChild(host);
  render(renderTriggerSection(t, c), host);
  return host;
}

const AIRFLOW: TriggerConfig = { type: "threshold", entity_id: "sensor.hvac_airflow", entity_ids: ["sensor.hvac_airflow"], trigger_below: 60 };
const DEHUM: TriggerConfig = {
  type: "compound", compound_logic: "OR", conditions: [
    { type: "threshold", entity_id: "sensor.dehumidifier_tank", trigger_above: 90 },
    { type: "threshold", entity_id: "sensor.basement_humidity", trigger_above: 72 },
  ],
};

describe("beta sensor rule (task page)", () => {
  beforeEach(() => setBetaUi(true));
  afterEach(() => {
    setBetaUi(false);
    document.body.querySelectorAll(".sensor-rule-host").forEach((d) => d.remove());
  });

  it("words a condition like the editor, with HA's unit spacing", () => {
    expect(withUnit("60", "%", "en")).to.equal("60%");
    expect(withUnit("60", "%", "de")).to.equal("60 %");
    expect(withUnit("8,000", "km", "en")).to.equal("8,000 km");
    expect(conditionText(AIRFLOW, "%", "en")).to.equal("below 60%");
    expect(conditionText({ type: "counter", trigger_delta_mode: true, trigger_target_value: 40 }, "", "en")).to.equal("goes up by 40 since the last completion");
    expect(conditionText({ type: "state_change", trigger_to_state: "paper_jam" }, "", "en")).to.equal("changes to paper_jam");
    expect(conditionText({ type: "threshold", trigger_above: 30, trigger_for_minutes: 5, attribute: "temperature" }, "°C", "en")).to.contain("(temperature)");
  });

  it("one entities-card row per sensor, HA's state, no entity id in sight", () => {
    const host = mount(task(AIRFLOW));
    const rows = host.querySelectorAll(".sensor-row");
    expect(rows.length).to.equal(1);
    expect(rows[0].querySelector(".sensor-name")!.textContent).to.equal("HVAC airflow");
    expect(rows[0].querySelector(".sensor-cond")!.textContent).to.equal("below 60%");
    expect(rows[0].querySelector(".sensor-state")!.textContent).to.equal("F(60.1 %)");
    expect(host.querySelector(".sensor-rule")!.textContent).not.to.contain("sensor.hvac_airflow");
    expect(host.querySelector(".trigger-entity-id")).to.equal(null);
  });

  it("a compound lists every condition's sensor with its own condition and an any/all line", () => {
    const host = mount(task(DEHUM, { trigger_active: true }));
    const rows = [...host.querySelectorAll(".sensor-row")];
    expect(rows.map((r) => r.querySelector(".sensor-name")!.textContent)).to.deep.equal(["Dehumidifier tank", "Basement humidity"]);
    expect(rows.map((r) => r.querySelector(".sensor-cond")!.textContent)).to.deep.equal(["above 90%", "above 72%"]);
    expect(host.querySelector(".sensor-rule-sub")!.textContent).to.equal("Any condition applies (2)");
    expect(host.querySelector(".status-badge")!.classList.contains("triggered")).to.equal(true);
    expect(ruleSensors(DEHUM).map((s) => s.entityId)).to.deep.equal(["sensor.dehumidifier_tank", "sensor.basement_humidity"]);
  });

  it("a tap and Enter open HA's more-info for that sensor", () => {
    const host = mount(task(DEHUM));
    const seen: string[] = [];
    host.addEventListener("hass-more-info", (e) => seen.push((e as CustomEvent<{ entityId: string }>).detail.entityId));
    const rows = host.querySelectorAll<HTMLElement>(".sensor-row");
    rows[1].click();
    rows[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(seen).to.deep.equal(["sensor.basement_humidity", "sensor.dehumidifier_tank"]);
    expect(rows[0].getAttribute("role")).to.equal("button");
    expect(rows[0].getAttribute("tabindex")).to.equal("0");
  });

  it("Show more goes to HA's history of all the rule's sensors", () => {
    const host = mount(task(DEHUM));
    const more = host.querySelector<HTMLAnchorElement>(".sensor-rule-more")!;
    expect(more.getAttribute("href")).to.equal("/history?entity_id=sensor.dehumidifier_tank,sensor.basement_humidity");
    const before = location.href;
    let changed = 0;
    const onChange = () => changed++;
    window.addEventListener("location-changed", onChange);
    more.click();
    window.removeEventListener("location-changed", onChange);
    expect(location.pathname).to.equal("/history");
    expect(changed).to.equal(1);
    history.replaceState(null, "", before);
  });

  it("uses HA's state badge when HA has one", () => {
    if (!customElements.get("state-badge")) customElements.define("state-badge", class extends HTMLElement {});
    const host = mount(task(AIRFLOW));
    const badge = host.querySelector(".sensor-row .sensor-badge")!;
    expect(badge.localName).to.equal("state-badge");
    expect((badge as unknown as { stateObj: unknown }).stateObj).to.equal(STATES["sensor.hvac_airflow"]);
  });

  it("keeps the progress for a counter", () => {
    const host = mount(task({ type: "counter", entity_id: "sensor.washer_total_washes", trigger_target_value: 40 }, { trigger_current_value: 8 }));
    expect(host.querySelector(".counter-progress-main")!.textContent).to.contain("8");
    expect(host.querySelector(".sensor-cond")!.textContent).to.equal("reaches 40");
  });

  it("draws no event-value line for a state change without history", () => {
    const c = ctx({ detailStatsData: new Map([["sensor.printer_status", []]]) });
    const t = task({ type: "state_change", entity_id: "sensor.printer_status", trigger_to_state: "paper_jam" }, {
      history: [{ type: "completed", timestamp: "2026-01-01T10:00:00", trigger_value: 1 }, { type: "completed", timestamp: "2026-06-01T10:00:00", trigger_value: 0 }],
    });
    const host = mount(t, c);
    expect(host.querySelector("maintenance-trigger-chart")).to.equal(null);
    expect(host.querySelector(".sensor-state")!.textContent).to.equal("F(paper_jam)");
  });

  it("each sensor row draws its recent course, the limit dashed, red once the live state is past it", () => {
    const now = Date.UTC(2026, 10, 1);
    const series = (from: number, to: number): StatisticsPoint[] =>
      Array.from({ length: 200 }, (_, i) => ({ ts: now - (200 - i) * 3600e3, val: from + ((to - from) * i) / 199 }));
    const c = ctx({ detailStatsData: new Map([
      ["sensor.dehumidifier_tank", series(40, 95)],
      ["sensor.basement_humidity", series(55, 61)],
    ]) });
    const host = mount(task(DEHUM), c);
    const trends = [...host.querySelectorAll(".sensor-row svg.sensor-trend")];
    expect(trends.length).to.equal(2);
    const linePoints = (el: Element) => (el.querySelector(".sensor-trend-line")!.getAttribute("d") || "").split(/[ML]/).filter(Boolean).length;
    expect(linePoints(trends[0])).to.be.within(40, 52, "thinned to a few dozen points");
    // The statistics end at the last full hour; the live state next to the
    // line decides: the tank's hours ended at 95 but it reads 50.7 now, the
    // humidity's hours stayed below 72 but it reads 85 now.
    expect(trends[0].classList.contains("past")).to.equal(false, "the tank reads 50.7 now");
    expect(trends[1].classList.contains("past")).to.equal(true, "the humidity reads 85 now");
    expect(trends[0].querySelectorAll(".sensor-trend-limit").length).to.equal(1, "90 lies within the tank's course");
    expect(trends[1].querySelectorAll(".sensor-trend-limit").length).to.equal(1, "72 lies within two spans of 55..61");
    // The row order stays badge, info, trend, state.
    expect([...host.querySelector(".sensor-row")!.children].map((e) => e.classList[0])).to.deep.equal(["sensor-badge", "sensor-info", "sensor-trend", "sensor-state"]);
  });

  it("no trend without statistics, and none far-off limit flattening the line", () => {
    const now = Date.UTC(2026, 10, 1);
    // Near the live 60.1, so the line spans 59.5..60.1 and a limit at 5 lies far off it.
    const flat = Array.from({ length: 10 }, (_, i) => ({ ts: now - i * 3600e3, val: 59.5 + i * 0.06 })).reverse();
    const c = ctx({ detailStatsData: new Map([["sensor.hvac_airflow", flat]]) });
    const far = mount(task({ ...AIRFLOW, trigger_below: 5 }), c);
    expect(far.querySelectorAll(".sensor-trend-limit").length).to.equal(0);
    const none = mount(task({ type: "state_change", entity_id: "sensor.printer_status", trigger_to_state: "paper_jam" }));
    expect(none.querySelector(".sensor-trend")).to.equal(null);
  });

  it("classic (beta off) keeps the old trigger card", () => {
    setBetaUi(false);
    const host = mount(task(AIRFLOW));
    expect(host.querySelector(".sensor-rule")).to.equal(null);
    expect(host.querySelector(".trigger-entity-id")!.textContent).to.contain("sensor.hvac_airflow");
  });
});
