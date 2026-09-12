/**
 * Booklet: "Completions without details" (#170 round 2).
 *
 * A completion that carries only a date is a row of blanks on paper. With
 * the `bare` include switch off, buildServiceRecordHtml drops those rows
 * (in both layouts) and keeps every completion that recorded something;
 * the switch defaults to on, and the print panel offers it.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { mergeObjectHistory } from "../helpers/object-history.js";
import { buildServiceRecordHtml, DEFAULT_INCLUDE, hasDetails, type ServiceRecordLabels } from "../helpers/service-record.js";
import "../components/object-history-section.js";
import type { MaintenanceObjectHistorySection } from "../components/object-history-section";
import { createMockHass } from "./_test-utils.js";

const TASKS = [
  {
    id: "t1", name: "Filter", ref_no: 1,
    history: [
      { timestamp: "2026-01-05T09:00:00+00:00", type: "completed", ref_no: 1 },
      { timestamp: "2026-02-05T09:00:00+00:00", type: "completed", ref_no: 2, notes: "Seal wet" },
      { timestamp: "2026-03-05T09:00:00+00:00", type: "completed", ref_no: 3, cost: 4 },
      { timestamp: "2026-04-05T09:00:00+00:00", type: "completed", ref_no: 4, photo_doc_ids: ["p1"] },
      { timestamp: "2026-05-05T09:00:00+00:00", type: "completed", ref_no: 5, notes: "   " },
    ],
  },
];

const labels = new Proxy({} as ServiceRecordLabels, {
  get: (_t, key) => {
    if (key === "entriesLabel") return (n: number) => `${n} entries`;
    if (key === "page") return (n: number) => `Page ${n}`;
    return typeof key === "string" ? key : "";
  },
});

function booklet(bare: boolean, layout: "chronological" | "by_task" = "chronological"): string {
  return buildServiceRecordHtml(
    { name: "House", manufacturer: null, model: null, serial_number: null, installation_date: null } as never,
    mergeObjectHistory(TASKS as never),
    labels,
    (iso) => iso.slice(0, 10),
    (m) => `${m} min`,
    (a) => `${a.toFixed(2)} €`,
    "2026-09-12T12:00:00Z",
    { options: { layout, include: { ...DEFAULT_INCLUDE, bare } } },
  );
}

describe("booklet: completions without details (#170)", () => {
  it("hasDetails: notes, cost, duration, readings, parts, photos or a checklist count; blank notes do not", () => {
    const merged = mergeObjectHistory(TASKS as never);
    const byDate = (d: string) => merged.find((e) => e.timestamp.startsWith(d))!;
    expect(hasDetails(byDate("2026-01-05"))).to.equal(false);
    expect(hasDetails(byDate("2026-02-05"))).to.equal(true);
    expect(hasDetails(byDate("2026-03-05"))).to.equal(true);
    expect(hasDetails(byDate("2026-04-05"))).to.equal(true);
    expect(hasDetails(byDate("2026-05-05")), "whitespace notes are no details").to.equal(false);
  });

  it("defaults to on: every completion prints", () => {
    expect(DEFAULT_INCLUDE.bare).to.equal(true);
    const doc = booklet(true);
    for (const d of ["2026-01-05", "2026-02-05", "2026-03-05", "2026-04-05", "2026-05-05"]) expect(doc).to.contain(d);
  });

  it("off: bare completions vanish in both layouts, detailed ones stay", () => {
    for (const layout of ["chronological", "by_task"] as const) {
      const doc = booklet(false, layout);
      expect(doc, layout).to.not.contain("2026-01-05");
      expect(doc, layout).to.not.contain("2026-05-05");
      for (const d of ["2026-02-05", "2026-03-05", "2026-04-05"]) expect(doc, layout).to.contain(d);
    }
  });

  it("the print panel offers the switch and persists it", async () => {
    localStorage.removeItem("msp-print-options");
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/task/history": (msg) => ({ history: (TASKS.find((t) => t.id === msg.task_id) || { history: [] }).history }),
        "maintenance_supporter/documents/list": () => ({ documents: [] }),
      },
    });
    const el = await fixture<MaintenanceObjectHistorySection>(html`
      <maintenance-object-history-section .hass=${hass as never} .entryId=${"e1"} .object=${{ name: "House", ref_no: 8 } as never}
        .tasks=${TASKS.map((t) => ({ ...t, history: [] })) as never} .currencySymbol=${"€"}></maintenance-object-history-section>
    `);
    await waitUntil(() => el.shadowRoot!.querySelectorAll(".row").length > 0, "rows render");
    el.shadowRoot!.querySelector<HTMLElement>(".print-btn")!.click();
    await el.updateComplete;
    const opt = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".print-options .opt")].find((o) => /without details/i.test(o.textContent || ""))!;
    expect(opt, "switch present").to.exist;
    const box = opt.querySelector("input")!;
    expect(box.checked).to.equal(true);
    box.click();
    await el.updateComplete;
    expect(JSON.parse(localStorage.getItem("msp-print-options")!).include.bare).to.equal(false);
    localStorage.removeItem("msp-print-options");
  });
});
