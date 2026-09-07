/**
 * The traceable service booklet (#170): the merged entries carry what a
 * completion recorded (readings with deltas, parts, photos, checklist,
 * reference numbers); the printable renders them behind include switches,
 * in a chronological or a by-task layout (task header with schedule, linked
 * documents and a QR code), and the section's print panel drives it.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { mergeObjectHistory } from "../helpers/object-history.js";
import {
  buildServiceRecordHtml,
  DEFAULT_INCLUDE,
  type ServiceRecordData,
  type ServiceRecordLabels,
  type ServiceRecordOptions,
} from "../helpers/service-record.js";
import "../components/object-history-section.js";
import type { MaintenanceObjectHistorySection } from "../components/object-history-section";
import { createMockHass, type SentMessage } from "./_test-utils.js";

const TASKS = [
  {
    id: "t_meter", name: "Water meter", ref_no: 3, reading_unit: "m³",
    history: [
      { timestamp: "2026-01-05T09:00:00+00:00", type: "completed", ref_no: 1, reading_values: [{ id: "c", name: "Cold", unit: "m³", value: 100 }] },
      { timestamp: "2026-02-05T09:00:00+00:00", type: "completed", ref_no: 2, reading_values: [{ id: "c", name: "Cold", unit: "m³", value: 112.5 }], photo_doc_ids: ["p1", "p2"], notes: "Seal wet", completed_by: "u1",
        used_parts: [{ part_id: "x", name: "Seal", quantity: 2 }], checklist_state: { a: true, b: false }, cost: 4, duration: 10 },
      { timestamp: "2026-02-20T09:00:00+00:00", type: "skipped", notes: "away" },
    ],
  },
  {
    id: "t_filter", name: "Filter", ref_no: 1, history: [
      { timestamp: "2026-03-01T09:00:00+00:00", type: "completed", ref_no: 5, reading_value: 42 },
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

const DATA: ServiceRecordData = {
  objectRef: "8",
  tasks: [
    { id: "t_filter", name: "Filter", ref: "8.1", schedule: "every 30 days", documents: [{ title: "Manual", page: 12 }], qrDataUri: "data:image/svg+xml;base64,QUJD" },
    { id: "t_meter", name: "Water meter", ref: "8.3", schedule: "monthly", documents: [], qrDataUri: null },
  ],
  photos: { p1: { name: "front.jpg", url: "https://ha.local/api/doc/p1?authSig=x" }, p2: { name: "back.jpg", url: null } },
  fmtNumber: (n) => String(n),
};

function booklet(options: Partial<ServiceRecordOptions> = {}, data: ServiceRecordData = DATA): string {
  return buildServiceRecordHtml(
    { name: "House", manufacturer: null, model: null, serial_number: null, installation_date: null } as never,
    mergeObjectHistory(TASKS as never),
    labels,
    (iso) => iso.slice(0, 10),
    (m) => `${m} min`,
    (a) => `${a.toFixed(2)} €`,
    "2026-09-07T12:00:00Z",
    { options: { layout: options.layout ?? "chronological", include: { ...DEFAULT_INCLUDE, ...(options.include ?? {}) } }, data },
  );
}

describe("merged lifecycle entries carry the completion's record (#170)", () => {
  it("readings with per-slot deltas, parts, photos, checklist tally and the numbers", () => {
    const merged = mergeObjectHistory(TASKS as never);
    const second = merged.find((e) => e.timestamp.startsWith("2026-02-05"))!;
    expect(second.refNo).to.equal(2);
    expect(second.taskRefNo).to.equal(3);
    expect(second.readings).to.deep.equal([{ name: "Cold", value: 112.5, unit: "m³", delta: 12.5 }]);
    expect(second.parts).to.deep.equal([{ name: "Seal", quantity: 2 }]);
    expect(second.photoIds).to.deep.equal(["p1", "p2"]);
    expect(second.checklist).to.deep.equal({ done: 1, total: 2 });
    const first = merged.find((e) => e.timestamp.startsWith("2026-01-05"))!;
    expect(first.readings[0].delta, "first reading has no delta").to.equal(null);
    const scalar = merged.find((e) => e.taskId === "t_filter")!;
    expect(scalar.readings).to.deep.equal([{ name: "", value: 42, unit: "", delta: null }]);
    expect(scalar.refNo).to.equal(5);
  });
});

describe("service booklet printable (#170)", () => {
  it("chronological: details under the row, reference numbers, photo thumbnails with captions", () => {
    const doc = booklet();
    expect(doc).to.contain("#8.3-2");
    expect(doc).to.contain("#8.1-5");
    expect(doc).to.contain("<span class=\"k\">readings</span>Cold: 112.5 m³");
    expect(doc).to.contain("(+12.5)");
    expect(doc).to.contain("Seal × 2");
    expect(doc).to.contain("<span class=\"k\">checklist</span>1/2");
    expect(doc).to.contain('src="https://ha.local/api/doc/p1?authSig=x"');
    expect(doc).to.contain("front.jpg");
    expect(doc).to.contain("back.jpg"); // no url → caption only
    expect(doc).to.contain("Seal wet · completedBy: u1");
    expect(doc).to.contain("4.00 €");
    expect(doc).to.not.contain("away", "skips are not part of the record");
    expect(doc).to.contain("<th>colTask</th>");
    expect(doc).to.not.contain("scanHint", "QR only in the by-task layout");
    expect(doc).to.contain("<span>refNumber</span><strong>#8</strong>");
  });

  it("include switches remove exactly their block", () => {
    const off = booklet({ include: { readings: false, parts: false, photos: false, checklist: false, notes: false, costs: false, person: false, refs: false } });
    for (const gone of ["Cold: 112.5", "Seal × 2", "checklist</span>", "front.jpg", "Seal wet", "u1", "4.00 €", "#8.3-2", "colCost", "<strong>#8</strong>"]) {
      expect(off, `switched off: ${gone}`).to.not.contain(gone);
    }
    expect(off).to.contain("2026-02-05");
    expect(off).to.not.contain("class=\"details\"", "no empty detail rows");
  });

  it("by task: one section per task with schedule, documents (with page), QR and subtotal; tasks that vanished still print", () => {
    const doc = booklet({ layout: "by_task", include: { qr: true } });
    const sections = doc.split("<section class=\"task\">").length - 1;
    expect(sections).to.equal(2);
    expect(doc.indexOf("<h2>Filter"), "object task order: task 1 before task 3").to.be.lessThan(doc.indexOf("<h2>Water meter"));
    expect(doc).to.contain("<h2>Filter <span class=\"ref\">#8.1</span></h2>");
    expect(doc).to.contain("every 30 days");
    expect(doc).to.contain("<span class=\"k\">documents</span>Manual (Page 12)");
    expect(doc).to.contain('src="data:image/svg+xml;base64,QUJD"');
    expect(doc).to.contain("scanHint");
    expect(doc).to.contain("2 entries · 4.00 €");
    // A task deleted since (not in data.tasks) still gets its section from the history.
    const orphan = booklet({ layout: "by_task" }, { ...DATA, tasks: DATA.tasks.filter((t) => t.id !== "t_filter") });
    expect(orphan.split("<section class=\"task\">").length - 1).to.equal(2);
    expect(orphan).to.contain("<h2>Filter <span class=\"ref\">#8.1</span></h2>");
  });

  it("caps the photos of one entry and says how many more", () => {
    const many = { ...TASKS[0], history: [{ timestamp: "2026-02-05T09:00:00+00:00", type: "completed", photo_doc_ids: ["a", "b", "c", "d", "e", "f", "g", "h"] }] };
    const doc = buildServiceRecordHtml({ name: "H" } as never, mergeObjectHistory([many] as never), labels, (i) => i, (m) => `${m}`, (a) => `${a}`, "2026-09-07T12:00:00Z", { options: { layout: "chronological", include: DEFAULT_INCLUDE }, data: { ...DATA, photos: {} } });
    expect(doc.split("<figure class=\"photo\">").length - 1).to.equal(6);
    expect(doc).to.contain("<span class=\"more\">+2</span>");
  });
});

describe("object-history section print panel (#170)", () => {
  async function mount(sent?: SentMessage[]) {
    const { hass, sent: s } = createMockHass({
      handlers: {
        "maintenance_supporter/task/history": (msg) => ({ history: (TASKS.find((t) => t.id === msg.task_id) || { history: [] }).history }),
        "maintenance_supporter/documents/list": () => ({ documents: [{ id: "p1", title: "Front", filename: "front.jpg", task_ids: ["t_meter"], task_pages: {} }, { id: "m1", title: "Manual", filename: "m.pdf", task_ids: ["t_filter"], task_pages: { t_filter: 12 } }] }),
        "maintenance_supporter/qr/generate": () => ({ svg_data_uri: "data:image/svg+xml;base64,QUJD" }),
        "auth/sign_path": (msg) => ({ path: `${msg.path as string}?authSig=x` }),
      },
    });
    const el = await fixture<MaintenanceObjectHistorySection>(html`
      <maintenance-object-history-section .hass=${hass as never} .entryId=${"e1"} .object=${{ name: "House", ref_no: 8 } as never}
        .tasks=${TASKS.map((t) => ({ ...t, history: [] })) as never} .currencySymbol=${"€"}></maintenance-object-history-section>
    `);
    await waitUntil(() => el.shadowRoot!.querySelectorAll(".row").length > 0, "rows render");
    return { el, sent: sent ?? s };
  }

  beforeEach(() => localStorage.clear());

  it("the print button opens the options panel; choices persist and gate the by-task-only switches", async () => {
    const { el } = await mount();
    expect(el.shadowRoot!.querySelector(".print-options")).to.equal(null);
    el.shadowRoot!.querySelector<HTMLElement>(".print-btn")!.click();
    await el.updateComplete;
    const panel = el.shadowRoot!.querySelector(".print-options")!;
    expect(panel).to.exist;
    const qrBox = [...panel.querySelectorAll<HTMLInputElement>("input[type=checkbox]")].at(-1)!;
    expect(qrBox.disabled, "QR needs the by-task layout").to.equal(true);
    panel.querySelector<HTMLInputElement>("input[value=by_task]")!.click();
    await el.updateComplete;
    expect([...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".print-options input[type=checkbox]")].at(-1)!.disabled).to.equal(false);
    const photos = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".print-options .opt")].find((o) => /photos/i.test(o.textContent || ""))!.querySelector("input")!;
    photos.click();
    await el.updateComplete;
    const saved = JSON.parse(localStorage.getItem("msp-print-options")!);
    expect(saved.layout).to.equal("by_task");
    expect(saved.include.photos).to.equal(false);
  });

  it("Print gathers documents, QR codes and signed photo urls, then opens the sheet", async () => {
    localStorage.setItem("msp-print-options", JSON.stringify({ layout: "by_task", include: { ...DEFAULT_INCLUDE, qr: true } }));
    const { el, sent } = await mount();
    const opened: string[] = [];
    const orig = window.open;
    (window as unknown as { open: unknown }).open = (url?: string) => { opened.push(url || ""); return null; };
    try {
      el.shadowRoot!.querySelector<HTMLElement>(".print-btn")!.click();
      await el.updateComplete;
      el.shadowRoot!.querySelector<HTMLElement>(".po-print")!.click();
      await waitUntil(() => opened.length === 1, "sheet opened");
    } finally {
      (window as unknown as { open: unknown }).open = orig;
    }
    expect(opened[0]).to.match(/^blob:/);
    expect(sent.some((m) => m.type === "maintenance_supporter/documents/list")).to.equal(true);
    expect(sent.filter((m) => m.type === "maintenance_supporter/qr/generate").length).to.equal(2);
    const signs = sent.filter((m) => m.type === "auth/sign_path").map((m) => m.path as string);
    expect(signs).to.have.members(["/api/maintenance_supporter/document/p1", "/api/maintenance_supporter/document/p2"]);
    expect(el.shadowRoot!.querySelector(".print-options"), "panel closes after printing").to.equal(null);
  });
});
