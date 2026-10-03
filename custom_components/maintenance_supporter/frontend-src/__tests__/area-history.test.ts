/** Area history and costs (#191) — the pure helpers behind the areas page,
 * the area detail and the printable area report: grouping incl. the "No
 * area" bucket, the cross-object merge and filters, month/year buckets
 * across a year boundary, totals, sorting, the full-history loader's
 * truncated-only + concurrency-limited fetch, and the printable (light
 * scheme, escaping, ledger order). */

import { expect } from "@open-wc/testing";
import {
  NO_AREA,
  areaDisplayName,
  areaTotals,
  calendarYear,
  costBuckets,
  costByObject,
  filterAreaHistory,
  filterAreas,
  historyYears,
  lastTwelveMonths,
  mergeAreaHistory,
  nextAreaSort,
  objectsInArea,
  parseAreaSort,
  sortAreas,
  summarizeAreas,
  type AreaObjectLike,
} from "../helpers/area-history.js";
import { FullHistoryLoader, isHistoryTruncated, mapLimit } from "../helpers/full-history.js";
import { buildAreaRecordHtml, type AreaRecordLabels } from "../helpers/area-record.js";
import type { HistoryEntry } from "../types";

// Local wall-clock timestamps (no zone): the buckets are local calendar
// months, whatever timezone the test browser runs in.
const h = (timestamp: string, type: string, cost?: number, extra: Record<string, unknown> = {}) =>
  ({ timestamp, type, ...(cost != null ? { cost } : {}), ...extra }) as unknown as HistoryEntry;

export const AREA_OBJECTS: AreaObjectLike[] = [
  {
    entry_id: "e1",
    object: { name: "Fridge", area_id: "kitchen" },
    tasks: [
      {
        id: "t1", name: "Clean coils", status: "overdue",
        history: [h("2025-12-15T12:00:00", "completed", 30, { duration: 20 }), h("2026-02-10T12:00:00", "completed", 50, { notes: "<b>dust</b>", duration: 25 })],
      },
      { id: "t2", name: "Replace filter", status: "ok", archived: true, history: [h("2026-01-05T12:00:00", "completed", 20)] },
    ],
  },
  {
    entry_id: "e2",
    object: { name: "Dishwasher", area_id: "kitchen" },
    tasks: [
      { id: "t3", name: "Descale", status: "due_soon", history: [h("2026-01-20T12:00:00", "completed", 15), h("2026-03-01T12:00:00", "skipped")] },
    ],
  },
  { entry_id: "e3", object: { name: "Car", area_id: null }, tasks: [{ id: "t4", name: "Oil change", status: "ok", history: [h("2025-06-01T12:00:00", "completed", 90)] }] },
  {
    entry_id: "e4",
    object: { name: "Old boiler", area_id: "kitchen", archived: true },
    tasks: [{ id: "t5", name: "Service", status: "ok", history: [h("2026-01-01T12:00:00", "completed", 1000)] }],
  },
  { entry_id: "e5", object: { name: "Lamp", area_id: "ghost_area" }, tasks: [] },
];

const AREAS = { kitchen: { name: "Kitchen", icon: "mdi:stove" } };
const windowOf = (_entryId: string, task: { history?: HistoryEntry[] | null }) => task.history ?? [];

function summaries(showArchived = false) {
  return summarizeAreas(AREA_OBJECTS, { showArchived, areas: AREAS, noAreaLabel: "No area", year: 2026, historyOf: windowOf });
}

describe("area-history helpers (#191)", () => {
  it("groups objects by area: HA name, unknown id shown raw, No area bucket last", () => {
    const rows = summaries();
    expect(rows.map((r) => r.name)).to.deep.equal(["ghost_area", "Kitchen", "No area"]);
    const kitchen = rows.find((r) => r.key === "kitchen")!;
    expect(kitchen.icon).to.equal("mdi:stove");
    expect(kitchen.objects, "archived object hidden").to.equal(2);
    expect(kitchen.tasks, "archived task not counted").to.equal(2);
    expect(kitchen.overdue).to.equal(1);
    expect(kitchen.dueSoon).to.equal(1);
    // The archived TASK's completion is still money spent (20 in 2026).
    expect(kitchen.costYear).to.equal(50 + 20 + 15);
    expect(kitchen.costTotal).to.equal(30 + 50 + 20 + 15);
    expect(kitchen.lastCompletion, "a skip is not a completion").to.equal("2026-02-10T12:00:00");
    const none = rows.find((r) => r.key === NO_AREA)!;
    expect(none.costTotal).to.equal(90);
    expect(none.costYear).to.equal(0);
    expect(rows.find((r) => r.key === "ghost_area")!.lastCompletion).to.equal(null);
    expect(areaDisplayName(NO_AREA, AREAS, "Kein Bereich")).to.equal("Kein Bereich");
  });

  it("the show-archived toggle brings archived objects and tasks back", () => {
    const kitchen = summaries(true).find((r) => r.key === "kitchen")!;
    expect(kitchen.objects).to.equal(3);
    expect(kitchen.tasks).to.equal(4);
    expect(kitchen.costTotal).to.equal(1115);
    expect(objectsInArea(AREA_OBJECTS, "kitchen", false).map((o) => o.entry_id)).to.deep.equal(["e1", "e2"]);
    expect(objectsInArea(AREA_OBJECTS, NO_AREA, false).map((o) => o.entry_id)).to.deep.equal(["e3"]);
  });

  it("merges every object's history newest first, tagged with the object", () => {
    const merged = mergeAreaHistory(objectsInArea(AREA_OBJECTS, "kitchen", false), windowOf);
    expect(merged.map((e) => `${e.objectName}/${e.taskName}/${e.type}`)).to.deep.equal([
      "Dishwasher/Descale/skipped",
      "Fridge/Clean coils/completed",
      "Dishwasher/Descale/completed",
      "Fridge/Replace filter/completed",
      "Fridge/Clean coils/completed",
    ]);
    expect(merged[1].entryId).to.equal("e1");
  });

  it("filters by date range, object and a tolerant task-name query", () => {
    const merged = mergeAreaHistory(objectsInArea(AREA_OBJECTS, "kitchen", false), windowOf);
    expect(filterAreaHistory(merged, { from: "2026-01-01", to: "2026-01-31" }).length).to.equal(2);
    expect(filterAreaHistory(merged, { entryId: "e2" }).every((e) => e.entryId === "e2")).to.equal(true);
    expect(filterAreaHistory(merged, { taskQuery: "descal" }).map((e) => e.taskName)).to.deep.equal(["Descale", "Descale"]);
    expect(filterAreaHistory(merged, { taskQuery: "coils", from: "2026-01-01" }).length).to.equal(1);
  });

  it("totals: completions, cost, average per completion, time", () => {
    const merged = mergeAreaHistory(objectsInArea(AREA_OBJECTS, "kitchen", false), windowOf);
    const tot = areaTotals(merged);
    expect(tot.completions).to.equal(4);
    expect(tot.totalCost).to.equal(115);
    expect(tot.avgCost).to.equal(115 / 4);
    expect(tot.totalDuration).to.equal(45);
    expect(areaTotals([]).avgCost).to.equal(null);
  });

  it("cost per object lists every object, most expensive first, with its share", () => {
    const objs = objectsInArea(AREA_OBJECTS, "kitchen", false);
    const rows = costByObject(mergeAreaHistory(objs, windowOf), objs);
    expect(rows.map((r) => [r.objectName, r.completions, r.cost])).to.deep.equal([["Fridge", 3, 100], ["Dishwasher", 1, 15]]);
    expect(rows[0].share).to.be.closeTo(100 / 115, 1e-9);
    const quiet = costByObject([], objs);
    expect(quiet.every((r) => r.cost === 0 && r.share === 0)).to.equal(true);
  });

  it("month buckets run across the year boundary, empty months included", () => {
    const merged = mergeAreaHistory(objectsInArea(AREA_OBJECTS, "kitchen", false), windowOf);
    const { unit, buckets } = costBuckets(merged, { from: "2025-11-01", to: "2026-02-28" });
    expect(unit).to.equal("month");
    expect(buckets.map((b) => b.key)).to.deep.equal(["2025-11", "2025-12", "2026-01", "2026-02"]);
    expect(buckets.map((b) => b.cost)).to.deep.equal([0, 30, 35, 50]);
    expect(buckets.map((b) => b.month)).to.deep.equal([10, 11, 0, 1]);
    expect(buckets[2].completions).to.equal(2);
  });

  it("a long range buckets by year; an open start begins at the oldest completion", () => {
    const merged = mergeAreaHistory(AREA_OBJECTS, windowOf);
    const long = costBuckets(merged, { from: "2020-01-01", to: "2026-12-31" });
    expect(long.unit).to.equal("year");
    expect(long.buckets.map((b) => b.key)).to.deep.equal(["2020", "2021", "2022", "2023", "2024", "2025", "2026"]);
    expect(long.buckets.at(-2)!.cost).to.equal(90 + 30);
    const open = costBuckets(merged, { from: null, to: "2026-03-31" }, "2026-03-31");
    expect(open.buckets[0].key, "starts at the 2025-06 oil change").to.equal("2025-06");
    expect(open.buckets.at(-1)!.key).to.equal("2026-03");
  });

  it("range presets: the last twelve months and a calendar year", () => {
    expect(lastTwelveMonths("2026-09-28")).to.deep.equal({ from: "2025-10-01", to: "2026-09-28" });
    expect(lastTwelveMonths("2026-01-03")).to.deep.equal({ from: "2025-02-01", to: "2026-01-03" });
    expect(calendarYear(2025)).to.deep.equal({ from: "2025-01-01", to: "2025-12-31" });
    const merged = mergeAreaHistory(AREA_OBJECTS, windowOf);
    expect(historyYears(merged, 2027)).to.deep.equal([2027, 2026, 2025]);
  });

  it("sorting: header clicks flip or start sensibly; No area stays last by name; stored form validated", () => {
    const rows = summaries();
    expect(nextAreaSort({ key: "name", dir: "asc" }, "name")).to.deep.equal({ key: "name", dir: "desc" });
    expect(nextAreaSort({ key: "name", dir: "asc" }, "cost_total")).to.deep.equal({ key: "cost_total", dir: "desc" });
    expect(sortAreas(rows, { key: "name", dir: "desc" }).map((r) => r.name)).to.deep.equal(["Kitchen", "ghost_area", "No area"]);
    expect(sortAreas(rows, { key: "cost_total", dir: "desc" }).map((r) => r.key)).to.deep.equal(["kitchen", NO_AREA, "ghost_area"]);
    expect(sortAreas(rows, { key: "last", dir: "desc" })[0].key).to.equal("kitchen");
    expect(parseAreaSort("cost_year:desc")).to.deep.equal({ key: "cost_year", dir: "desc" });
    expect(parseAreaSort("bogus:up")).to.deep.equal({ key: "name", dir: "asc" });
    expect(filterAreas(rows, "kitch").map((r) => r.key)).to.deep.equal(["kitchen"]);
  });
});

describe("full-history loader (#191)", () => {
  it("mapLimit keeps order and never exceeds the limit", async () => {
    let running = 0;
    let peak = 0;
    const out = await mapLimit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, async (n) => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((r) => setTimeout(r, 2));
      running--;
      return n * 2;
    });
    expect(out).to.deep.equal([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    expect(peak).to.equal(3);
  });

  it("fetches only truncated tasks, six at a time; caches; refetches on change; a failure keeps the window", async () => {
    let running = 0;
    let peak = 0;
    const calls: string[] = [];
    const hass = {
      connection: {
        sendMessagePromise: async (msg: { task_id: string }) => {
          calls.push(msg.task_id);
          running++;
          peak = Math.max(peak, running);
          await new Promise((r) => setTimeout(r, 2));
          running--;
          if (msg.task_id === "bad") throw new Error("boom");
          return { history: [h("2020-01-01T12:00:00", "completed", 1), h("2026-01-01T12:00:00", "completed", 2)] };
        },
      },
    };
    let updates = 0;
    const loader = new FullHistoryLoader({ addController() {}, requestUpdate() { updates++; } } as never);
    const win = [h("2026-01-01T12:00:00", "completed", 2)];
    const tasks = Array.from({ length: 10 }, (_, i) => ({ id: `t${i}`, history: win, history_count: 30 }));
    const complete = { id: "whole", history: win, history_count: 1 };
    const bad = { id: "bad", history: win, history_count: 5 };
    expect(isHistoryTruncated(complete)).to.equal(false);
    expect(isHistoryTruncated({ id: "x", history: win }), "no count = fetch").to.equal(true);
    const refs = [...tasks, complete, bad].map((task) => ({ entryId: "e1", task }));
    const p = loader.sync(hass as never, refs);
    expect(loader.loading).to.equal(true);
    await p;
    expect(loader.loading).to.equal(false);
    expect(calls.length, "the complete task is not fetched").to.equal(11);
    expect(peak).to.be.at.most(6);
    expect(loader.historyOf("e1", tasks[0]).length).to.equal(2);
    expect(loader.historyOf("e1", complete)).to.equal(win);
    expect(loader.historyOf("e1", bad), "failed fetch → the window").to.equal(win);
    expect(updates).to.be.greaterThan(0);

    await loader.sync(hass as never, refs);
    expect(calls.length, "cached — including the failed one (no retry loop)").to.equal(11);

    const changed = { ...tasks[3], history_count: 31, history: [...win, h("2026-02-01T12:00:00", "completed", 3)] };
    await loader.sync(hass as never, [{ entryId: "e1", task: changed }]);
    expect(calls.slice(11)).to.deep.equal(["t3"]);
  });
});

describe("area report printable (#191)", () => {
  const labels = new Proxy({} as AreaRecordLabels, { get: (_t, k) => (typeof k === "string" ? k : "") });
  function recordHtml(): string {
    const objs = objectsInArea(AREA_OBJECTS, "kitchen", false).map((o) =>
      o.entry_id === "e2" ? { ...o, object: { ...o.object, name: "Dish<script>washer" } } : o,
    );
    const entries = mergeAreaHistory(objs, windowOf).map((e) => (e.taskName === "Descale" ? { ...e, completedBy: "Anna & Ben" } : e));
    return buildAreaRecordHtml(
      {
        areaName: "Kitchen \"main\"",
        from: "2025-11-01",
        to: "2026-02-28",
        totals: areaTotals(entries),
        byObject: costByObject(entries, objs),
        buckets: costBuckets(entries, { from: "2025-11-01", to: "2026-02-28" }),
        entries,
        capped: true,
      },
      labels,
      {
        date: (iso) => iso.slice(0, 10),
        cost: (n) => `${n} €`,
        duration: (m) => `${m} min`,
        bucket: (b) => `M${b.key}`,
        share: (f) => `${Math.round(f * 100)} %`,
        number: (n) => String(n),
      },
      "2026-03-05T10:00:00Z",
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

  it("escapes user text and prints completed work oldest first with totals", () => {
    const doc = recordHtml();
    expect(doc).to.contain("Dish&lt;script&gt;washer");
    expect(doc).to.not.contain("<script>");
    expect(doc).to.contain("&lt;b&gt;dust&lt;/b&gt;");
    expect(doc).to.contain("Kitchen &quot;main&quot;");
    expect(doc).to.contain("completedBy: Anna &amp; Ben");
    // ledger order: Dec coil clean → Jan filter → Jan descale → Feb coil clean
    const order = ["2025-12-15", "2026-01-05", "2026-01-20", "2026-02-10"].map((d) => doc.lastIndexOf(d));
    expect(order).to.deep.equal([...order].sort((a, b) => a - b));
    expect(doc, "a skip is not printed as work").to.not.contain("2026-03-01");
    expect(doc).to.contain("M2025-11");
    expect(doc).to.contain("M2026-02");
    expect(doc).to.contain("115 €");
    expect(doc).to.contain("capNote");
  });
});
