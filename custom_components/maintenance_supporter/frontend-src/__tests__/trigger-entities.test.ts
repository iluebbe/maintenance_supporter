/**
 * A trigger stores its entities as the `entity_ids` list, the legacy single
 * `entity_id`, or both. The detail chart, the overview sparkline and the
 * trend arrow read only `entity_id`, so a trigger stored with just the list
 * (an adopted problem sensor) showed none of them (same-class audit
 * 2026-10-04). The battery fleet keeps its own "N to replace" row.
 */

import { expect } from "@open-wc/testing";
import { nothing } from "lit";
import { primaryTriggerEntity, triggerEntityIds } from "../helpers/trigger-entities.js";
import { computeTrend, renderMiniSparkline } from "../renderers/progress.js";
import type { StatisticsPoint, TaskRow, TriggerConfig } from "../types";

const DAY = 86400e3;
const stats = (eid: string, ...vals: number[]) =>
  new Map([[eid, vals.map((val, i) => ({ ts: Date.now() - (vals.length - i) * DAY, val })) as StatisticsPoint[]]]);

describe("trigger entities in either stored shape", () => {
  it("reads the list, the legacy single entity, or both", () => {
    expect(triggerEntityIds({ entity_ids: ["sensor.a", "sensor.b"] })).to.deep.equal(["sensor.a", "sensor.b"]);
    expect(triggerEntityIds({ entity_id: "sensor.a" })).to.deep.equal(["sensor.a"]);
    expect(triggerEntityIds({ entity_id: "sensor.a", entity_ids: ["sensor.a"] })).to.deep.equal(["sensor.a"]);
    expect(triggerEntityIds({ entity_ids: [] , entity_id: "sensor.a" })).to.deep.equal(["sensor.a"]);
    expect(triggerEntityIds(null)).to.deep.equal([]);
    expect(triggerEntityIds({})).to.deep.equal([]);
  });

  it("charts a single-source trigger by its first entity, a compound by none", () => {
    expect(primaryTriggerEntity({ type: "state_change", entity_ids: ["binary_sensor.fault"] })).to.equal("binary_sensor.fault");
    expect(primaryTriggerEntity({ type: "threshold", entity_id: "sensor.salt" })).to.equal("sensor.salt");
    const compound = { type: "compound", conditions: [{ type: "threshold", entity_id: "sensor.a" }] } as unknown as TriggerConfig;
    expect(primaryTriggerEntity(compound)).to.equal(undefined);
    expect(primaryTriggerEntity(undefined)).to.equal(undefined);
  });

  it("a trigger stored with only the list gets its sparkline and trend arrow", () => {
    const row = {
      trigger_config: { type: "threshold", entity_ids: ["sensor.salt"], trigger_below: 20 },
      trigger_current_value: 30,
    } as unknown as TaskRow;
    const data = stats("sensor.salt", 80, 60, 40);
    expect(renderMiniSparkline(row, data, "en")).to.not.equal(nothing);
    expect(computeTrend(row, data)).to.equal("approaching");
  });

  it("the battery fleet's row keeps its own count instead", () => {
    const fleet = {
      battery_fleet_task: true,
      trigger_config: { type: "threshold", entity_ids: ["sensor.b1", "sensor.b2"], trigger_below: 20 },
      trigger_current_value: 2,
    } as unknown as TaskRow;
    const data = stats("sensor.b1", 80, 60, 40);
    expect(renderMiniSparkline(fleet, data, "en")).to.equal(nothing);
    expect(computeTrend(fleet, data)).to.equal(null);
  });
});
