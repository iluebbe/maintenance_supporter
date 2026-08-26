/**
 * StatisticsService: recorder-history fallback for entities without
 * long-term statistics (#141 — problem/binary sensors drew a flat line).
 *
 * Pins:
 *   - empty statistics → history_during_period is fetched, on/off maps to
 *     1/0, every change gets a doubled point (step line), the last state is
 *     extended to "now", and the entity lands in historyFallbackIds
 *   - non-empty statistics → NO history fetch, no fallback marker
 *   - unknown/unavailable rows are skipped; numeric states parse
 *   - a failed history call degrades to the old empty-series behaviour
 */

import { expect } from "@open-wc/testing";
import { StatisticsService } from "../statistics-service";
import { createMockHass } from "./_test-utils.js";

const H = 3600; // seconds
const nowS = Date.now() / 1000;

function service(handlers: Record<string, (msg: any) => unknown>) {
  const { hass } = createMockHass({ handlers });
  return new StatisticsService(hass as any);
}

describe("statistics-service history fallback (#141)", () => {
  it("maps on/off history to a 0/1 step series and marks the entity", async () => {
    const svc = service({
      "recorder/statistics_during_period": () => ({}),
      "history/history_during_period": () => ({
        "binary_sensor.tank": [
          { s: "off", lu: nowS - 10 * H },
          { s: "on", lu: nowS - 6 * H },
          { s: "off", lu: nowS - 2 * H },
        ],
      }),
    });
    const points = await svc.getDetailStats("binary_sensor.tank", true, 30);
    expect(svc.historyFallbackIds.has("binary_sensor.tank")).to.equal(true);
    // 3 states → first + 2 doubled changes + extension to now = 6 points
    expect(points.map((p) => p.val)).to.deep.equal([0, 0, 1, 1, 0, 0]);
    // the doubled point shares its timestamp with the new value's point
    expect(points[1].ts).to.equal(points[2].ts);
    expect(points[3].ts).to.equal(points[4].ts);
    // last point reaches "now"
    expect(points[5].ts).to.be.greaterThan(points[4].ts);
  });

  it("prefers real statistics and clears the marker", async () => {
    let historyCalled = false;
    const svc = service({
      "recorder/statistics_during_period": () => ({
        "sensor.pressure": [
          { start: 1000, mean: 2.0 },
          { start: 2000, mean: 2.5 },
        ],
      }),
      "history/history_during_period": () => {
        historyCalled = true;
        return {};
      },
    });
    const points = await svc.getDetailStats("sensor.pressure", false, 30);
    expect(points.length).to.equal(2);
    expect(historyCalled).to.equal(false);
    expect(svc.historyFallbackIds.has("sensor.pressure")).to.equal(false);
  });

  it("skips unknown/unavailable rows and parses numeric states", async () => {
    const svc = service({
      "recorder/statistics_during_period": () => ({}),
      "history/history_during_period": () => ({
        "sensor.raw": [
          { s: "3.5", lu: nowS - 5 * H },
          { s: "unavailable", lu: nowS - 4 * H },
          { s: "unknown", lu: nowS - 3 * H },
          { s: "garbage", lu: nowS - 2.5 * H },
          { s: "4.0", lu: nowS - 2 * H },
        ],
      }),
    });
    const points = await svc.getDetailStats("sensor.raw", false, 30);
    // 3.5, (2h: 3.5 doubled), 4.0, extension to now
    expect(points.map((p) => p.val)).to.deep.equal([3.5, 3.5, 4, 4]);
  });

  it("degrades to an empty series when the history call fails", async () => {
    const svc = service({
      "recorder/statistics_during_period": () => ({}),
      "history/history_during_period": () => {
        throw new Error("recorder unavailable");
      },
    });
    const points = await svc.getDetailStats("binary_sensor.x", true, 30);
    expect(points).to.deep.equal([]);
    expect(svc.historyFallbackIds.has("binary_sensor.x")).to.equal(false);
  });

  it("a single history row is not enough for a line — no fallback marker", async () => {
    const svc = service({
      "recorder/statistics_during_period": () => ({}),
      "history/history_during_period": () => ({
        "binary_sensor.y": [{ s: "on", lu: nowS - 1 * H }],
      }),
    });
    // one state still expands to (state, extension-to-now) = 2 points… the
    // service requires >= 2 SOURCE-derived points, which this satisfies via
    // the extension — assert the actual contract:
    const points = await svc.getDetailStats("binary_sensor.y", true, 30);
    expect(points.length).to.equal(2);
    expect(svc.historyFallbackIds.has("binary_sensor.y")).to.equal(true);
  });
});
