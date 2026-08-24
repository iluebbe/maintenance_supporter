/** Object lifecycle history (#138): merge / filter / totals helpers and the
 * printable service record's colour-scheme + content contract. */

import { expect } from "@open-wc/testing";
import {
  filterObjectHistory,
  mergeObjectHistory,
  objectHistoryTotals,
} from "../helpers/object-history.js";
import { buildServiceRecordHtml, type ServiceRecordLabels } from "../helpers/service-record.js";

const TASKS = [
  {
    id: "t_oil",
    name: "Oil change",
    history: [
      { timestamp: "2026-03-10T09:00:00+00:00", type: "completed", cost: 89.5, duration: 40, notes: "5W-30" },
      { timestamp: "2025-03-12T10:00:00+00:00", type: "completed", cost: 85 },
      { timestamp: "2026-05-01T08:00:00+00:00", type: "triggered", trigger_value: 15000 },
    ],
  },
  {
    id: "t_tires",
    name: "Tire rotation",
    history: [
      { timestamp: "2026-04-02T14:30:00+00:00", type: "completed", cost: 20, completed_by: "sam" },
      { timestamp: "2025-10-05T09:00:00+00:00", type: "skipped", notes: "winter set on" },
      { timestamp: "not-a-date", type: "completed" },
    ],
  },
] as never[];

describe("mergeObjectHistory", () => {
  it("merges lifecycle entries across tasks, newest first, dropping noise", () => {
    const merged = mergeObjectHistory(TASKS as never);
    // triggered + unparsable timestamp are dropped: 4 rows remain
    expect(merged.map((e) => `${e.taskName}:${e.type}`)).to.deep.equal([
      "Tire rotation:completed",
      "Oil change:completed",
      "Tire rotation:skipped",
      "Oil change:completed",
    ]);
    expect(merged[0].completedBy).to.equal("sam");
    expect(merged[1].notes).to.equal("5W-30");
  });
});

describe("filterObjectHistory", () => {
  const merged = mergeObjectHistory(TASKS as never);

  it("filters by task", () => {
    const only = filterObjectHistory(merged, { taskId: "t_oil" });
    expect(only.every((e) => e.taskId === "t_oil")).to.equal(true);
    expect(only.length).to.equal(2);
  });

  it("date range is inclusive on both ends", () => {
    const range = filterObjectHistory(merged, { from: "2026-03-10", to: "2026-04-02" });
    expect(range.map((e) => e.taskName)).to.deep.equal(["Tire rotation", "Oil change"]);
  });
});

describe("objectHistoryTotals", () => {
  it("sums completed entries only", () => {
    const merged = mergeObjectHistory(TASKS as never);
    const { completed, totalCost } = objectHistoryTotals(merged);
    expect(completed).to.equal(3);
    expect(totalCost).to.be.closeTo(194.5, 0.001);
  });
});

describe("service record printable", () => {
  const labels = new Proxy({} as ServiceRecordLabels, {
    get: (_t, key) => (key === "entriesLabel" ? (n: number) => `${n} entries` : typeof key === "string" ? key : ""),
  });

  function recordHtml(capped = false): string {
    return buildServiceRecordHtml(
      { name: "Family Car", manufacturer: "VW", model: "Golf", serial_number: "WVW-123", installation_date: "2020-05-01" } as never,
      mergeObjectHistory(TASKS as never),
      labels as ServiceRecordLabels,
      (iso) => iso.slice(0, 10),
      (m) => `${m} min`,
      "€",
      "2026-08-24T12:00:00Z",
      { capped },
    );
  }

  it("paints its own light colour scheme (Companion WebView contract)", () => {
    const doc = recordHtml();
    expect(doc).to.match(/<meta\s+name="color-scheme"\s+content="light"\s*\/?>/);
    expect(doc).to.match(/color-scheme:\s*light/);
    const body = /body\s*\{([^}]*)\}/.exec(doc)![1];
    expect(body).to.match(/background(-color)?:\s*(#fff|#ffffff|white)/i);
    expect(body).to.match(/(^|;)\s*color:\s*#/);
  });

  it("lists completed work chronologically with a cost total, escaping content", () => {
    const doc = recordHtml(true);
    // completed rows only — the skipped winter-set entry stays out
    expect(doc).to.contain("Oil change");
    expect(doc).to.not.contain("winter set on");
    expect(doc).to.contain("194.50 €");
    expect(doc).to.contain("capNote");
    // escaping: inject markup through a task name
    const evil = buildServiceRecordHtml(
      { name: "<img src=x onerror=1>" } as never,
      [],
      labels as ServiceRecordLabels,
      (iso) => iso,
      (m) => `${m}`,
      "€",
      "2026-08-24T12:00:00Z",
    );
    expect(evil).to.not.contain("<img src=x");
    expect(evil).to.contain("&lt;img");
  });
});
