/** Notes over several lines (#202, contributed by @korova-sq).
 *
 * The complete dialog's notes field was a single-line input: Enter did
 * nothing and a longer note scrolled out of view. It is a text area now, and
 * every full view of a note keeps its line breaks: the task history, the
 * service booklet and the area report. They used to fold each break into a
 * space, also for a note edited in the history. Notes stay plain text; the
 * one-line summaries (object and area history tables) stay one line.
 */

import { expect } from "@open-wc/testing";
import { render } from "lit";
import { renderHistoryEntry, type HistoryContext } from "../renderers/history.js";
import { mergeObjectHistory } from "../helpers/object-history.js";
import { buildServiceRecordHtml, DEFAULT_INCLUDE, type ServiceRecordLabels } from "../helpers/service-record.js";
import { buildAreaRecordHtml, type AreaRecordLabels } from "../helpers/area-record.js";
import { areaTotals, costBuckets, costByObject, type AreaHistoryEntry } from "../helpers/area-history.js";
import { sharedStyles } from "../styles.js";
import type { HistoryEntry } from "../types";
import { createMockHass } from "./_test-utils.js";

const NOTE = "Filter changed\nSeal checked, order a new one";

/** Labels by their own key: the printables only need some text per slot. */
function keyLabels<T extends object>(): T {
  return new Proxy({} as T, {
    get: (_t, key) => {
      if (key === "entriesLabel") return (n: number) => `${n} entries`;
      if (key === "page") return (n: number) => `Page ${n}`;
      return typeof key === "string" ? key : "";
    },
  });
}

describe("completion notes over several lines (#202)", () => {
  it("the history row keeps the line breaks", () => {
    const { hass } = createMockHass({});
    const ctx: HistoryContext = {
      lang: "en", hass: hass as never, filter: null, search: "", currencySymbol: "€",
      setFilter: () => undefined, setSearch: () => undefined,
    };
    // The row's CSS is sharedStyles, as on every surface that draws it.
    const host = document.createElement("div");
    host.style.width = "600px";
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [sharedStyles.styleSheet!];
    const row = (notes: string) => {
      const box = document.createElement("div");
      shadow.appendChild(box);
      render(renderHistoryEntry({ type: "completed", timestamp: "2026-08-01T10:00:00", notes } as HistoryEntry, ctx), box);
      return box.querySelector<HTMLElement>(".history-notes")!;
    };
    const twoLines = row(NOTE);
    const oneLine = row(NOTE.replace(/\n/g, " "));
    expect(twoLines.textContent).to.equal(NOTE);
    expect(getComputedStyle(twoLines).whiteSpace).to.equal("pre-wrap");
    expect(twoLines.offsetHeight, "two lines drawn, not one").to.be.greaterThan(oneLine.offsetHeight * 1.5);
    host.remove();
  });

  it("the service booklet and the area report keep them too", () => {
    const booklet = buildServiceRecordHtml(
      { name: "House", manufacturer: null, model: null, serial_number: null, installation_date: null } as never,
      mergeObjectHistory([{ id: "t1", name: "Filter", history: [{ timestamp: "2026-02-05T09:00:00+00:00", type: "completed", notes: NOTE }] }] as never),
      keyLabels<ServiceRecordLabels>(),
      (iso) => iso.slice(0, 10),
      (m) => `${m} min`,
      (a) => `${a} €`,
      "2026-09-12T12:00:00Z",
      { options: { layout: "chronological", include: DEFAULT_INCLUDE } },
    );
    expect(booklet).to.match(/td\.notes \{[^}]*white-space: pre-wrap/);
    expect(booklet).to.include(NOTE);

    const entries = [{
      type: "completed", ts: Date.parse("2026-02-05T09:00:00Z"), timestamp: "2026-02-05T09:00:00+00:00",
      entryId: "e1", taskId: "t1", objectName: "Washer", taskName: "Filter", notes: NOTE,
      cost: null, duration: null, completedBy: null,
    }] as unknown as AreaHistoryEntry[];
    const report = buildAreaRecordHtml(
      {
        areaName: "Laundry", from: "2026-01-01", to: "2026-12-31",
        totals: areaTotals(entries),
        byObject: costByObject(entries, [{ entry_id: "e1", object: { name: "Washer" } }]),
        buckets: costBuckets(entries, { from: "2026-01-01", to: "2026-12-31" }),
        entries, capped: false,
      },
      keyLabels<AreaRecordLabels>(),
      {
        date: (iso) => iso.slice(0, 10), cost: (n) => `${n} €`, duration: (m) => `${m} min`,
        bucket: (b) => b.key, share: (f) => `${Math.round(f * 100)} %`, number: (n) => String(n),
      },
      "2026-10-03T10:00:00Z",
    );
    expect(report).to.match(/td\.notes \{[^}]*white-space: pre-wrap/);
    expect(report).to.include(NOTE);
  });
});
