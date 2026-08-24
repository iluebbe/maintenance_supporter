/** MaintenanceTriggerChart — the responsive sensor-history chart: gridlines,
 * hatched danger zone above the threshold (in-zone line segments in red),
 * completion-marker lane, range chips. Pure props — no hass needed. */
import * as React from "react";

const now = Date.now();
const day = 86400000;

/** 30 d of rising pump runtime crossing the 300 h service threshold. */
const RUNTIME = Array.from({ length: 31 }, (_, i) => {
  const val = 228 + i * 2.9 + Math.sin(i * 1.7) * 2.4;
  return {
    ts: now - (30 - i) * day,
    val: Math.round(val * 10) / 10,
    min: Math.round((val - 4) * 10) / 10,
    max: Math.round((val + 4) * 10) / 10,
  };
});

const EVENTS = [
  { ts: now - 26 * day, type: "completed" },
  { ts: now - 12 * day, type: "skipped" },
];

export const RuntimeThreshold = () => (
  <maintenance-trigger-chart
    ref={(el: unknown) => {
      if (el) Object.assign(el as Record<string, unknown>, {
        points: RUNTIME,
        events: EVENTS,
        unit: "h",
        lang: "en",
        thresholdAbove: 300,
        rangeDays: 30,
        showOutlierToggle: true,
      });
    }}
    style={{ display: "block", width: 620 }}
  />
);

/** Counter climbing toward its service target (target line pinned, zero
 * floor forced — a progress axis never dips below zero). */
const COUNTER = Array.from({ length: 31 }, (_, i) => ({
  ts: now - (30 - i) * day,
  val: Math.round(318 + i * 4.6 + Math.sin(i * 2.3) * 3),
}));

export const CounterTarget = () => (
  <maintenance-trigger-chart
    ref={(el: unknown) => {
      if (el) Object.assign(el as Record<string, unknown>, {
        points: COUNTER,
        events: [{ ts: now - 30 * day, type: "reset" }],
        unit: "cycles",
        lang: "en",
        targetValue: 500,
        forceZero: true,
        rangeDays: 30,
        showOutlierToggle: false,
      });
    }}
    style={{ display: "block", width: 620 }}
  />
);

/** Declining pressure with the danger zone BELOW the threshold and a dashed
 * degradation-trend projection heading into it. (The projection's first
 * point sits inside the plotted window — the chart clips x to the plot, so
 * a segment starting at the very last sample would render zero-length.) */
const PRESSURE = Array.from({ length: 31 }, (_, i) => {
  const val = 2.82 - i * 0.044 + Math.sin(i * 1.3) * 0.05;
  return { ts: now - (30 - i) * day, val: Math.round(val * 100) / 100 };
});

export const DegradationProjection = () => (
  <maintenance-trigger-chart
    ref={(el: unknown) => {
      if (el) Object.assign(el as Record<string, unknown>, {
        points: PRESSURE,
        events: [{ ts: now - 24 * day, type: "completed" }],
        unit: "bar",
        lang: "en",
        thresholdBelow: 1.2,
        projection: [
          { ts: now - 8 * day, val: 1.82 },
          { ts: now + 14 * day, val: 0.85 },
        ],
        rangeDays: 30,
        showOutlierToggle: false,
      });
    }}
    style={{ display: "block", width: 620 }}
  />
);
