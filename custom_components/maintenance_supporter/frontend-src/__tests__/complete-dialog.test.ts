/**
 * Behavioural tests for <maintenance-complete-dialog> (audit gap #3).
 *
 * The completion dialog is the money path of the whole product; until now it
 * was only covered by the lazy-load tripwire. These tests pin the exact
 * outgoing WS payload (notes / cost / duration / feedback / checklist_state /
 * photo_doc_id) and the error path (server refusal keeps the dialog open).
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/complete-dialog.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import { createMockHass, pickDateField } from "./_test-utils.js";

type MountOpts = {
  checklist?: string[];
  adaptiveEnabled?: boolean;
  completeHandler?: () => unknown;
};

async function mount(opts: MountOpts = {}) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/task/complete":
        opts.completeHandler ?? (() => ({ success: true })),
    },
  });
  const el = await fixture<MaintenanceCompleteDialog>(html`
    <maintenance-complete-dialog
      .hass=${hass}
      .entryId=${"entry1"}
      .taskId=${"task1"}
      .taskName=${"Filter Wechsel"}
      .lang=${"en"}
      .checklist=${opts.checklist ?? []}
      .adaptiveEnabled=${opts.adaptiveEnabled ?? false}
    ></maintenance-complete-dialog>
  `);
  el.open();
  await el.updateComplete;
  return { el, sent };
}

function setInput(el: MaintenanceCompleteDialog, index: number, value: string) {
  const input = [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".field-input")][index];
  input.value = value;
  input.dispatchEvent(new Event("input"));
}

function clickComplete(el: MaintenanceCompleteDialog) {
  const buttons = [...el.shadowRoot!.querySelectorAll(".dialog-actions ha-button")];
  (buttons[buttons.length - 1] as HTMLElement).click();
}

describe("complete-dialog", () => {
  it("submits notes, cost, duration, feedback and checklist_state in the payload", async () => {
    const { el, sent } = await mount({
      checklist: ["Step A", "Step B"],
      adaptiveEnabled: true,
    });

    setInput(el, 0, "oil changed");
    setInput(el, 1, "12.5");
    setInput(el, 2, "30");
    // Tick the second checklist step (click the checkbox; the event bubbles
    // to the row's toggle handler exactly once).
    const boxes = [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".checklist-item input")];
    boxes[1].click();
    // Pick the "not needed" feedback option.
    const fb = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".feedback-btn")];
    fb[1].click();
    await el.updateComplete;

    clickComplete(el);
    await new Promise((r) => setTimeout(r, 10));

    const msg = sent.find((m) => m.type === "maintenance_supporter/task/complete")!;
    expect(msg, "task/complete sent").to.exist;
    expect(msg.entry_id).to.equal("entry1");
    expect(msg.task_id).to.equal("task1");
    expect(msg.notes).to.equal("oil changed");
    expect(msg.cost).to.equal(12.5);
    expect(msg.duration).to.equal(30);
    expect(msg.feedback).to.equal("not_needed");
    expect(msg.checklist_state).to.deep.equal({ "1": true });
    // Dialog closed on success.
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("ha-dialog")).to.be.null;
  });

  it("omits optional fields that were left empty", async () => {
    const { el, sent } = await mount();
    clickComplete(el);
    await new Promise((r) => setTimeout(r, 10));

    const msg = sent.find((m) => m.type === "maintenance_supporter/task/complete")!;
    expect(msg).to.exist;
    expect("notes" in msg).to.be.false;
    expect("cost" in msg).to.be.false;
    expect("duration" in msg).to.be.false;
    expect("feedback" in msg).to.be.false;
    expect("checklist_state" in msg).to.be.false;
    expect("photo_doc_id" in msg).to.be.false;
    expect("completed_at" in msg).to.be.false;
  });

  /** The optional backdate starts as a "Set date & time" button (#163): the
   *  HA datetime selector has no empty state, so the field only appears once
   *  the user asks for it, seeded with the current minute. */
  async function openBackdate(el: MaintenanceCompleteDialog) {
    const pick = el.shadowRoot!.querySelector<HTMLButtonElement>(".backdate-pick")!;
    expect(pick, "backdate seed button rendered").to.exist;
    expect(el.shadowRoot!.querySelector("ms-date-field"), "no field before the seed click").to.be.null;
    pick.click();
    await el.updateComplete;
    const field = el.shadowRoot!.querySelector("ms-date-field")!;
    expect(field, "backdate field rendered after the seed click").to.exist;
    await (field as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    return field;
  }

  it("sends completed_at with seconds re-added when a backdate is picked (#133)", async () => {
    const { el, sent } = await mount();
    const field = await openBackdate(el);
    // Seeded with the current minute, in the contract format.
    expect((field as unknown as { value: string }).value).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00$/);
    // HA's datetime selector speaks "YYYY-MM-DD HH:MM:SS".
    pickDateField(field, "2026-01-10 14:30:00");
    await el.updateComplete;

    clickComplete(el);
    await new Promise((r) => setTimeout(r, 10));

    const msg = sent.find((m) => m.type === "maintenance_supporter/task/complete")!;
    expect(msg).to.exist;
    expect(msg.completed_at).to.equal("2026-01-10T14:30:00");
  });

  it("rejects a future completed_at client-side without a WS roundtrip (#133)", async () => {
    const { el, sent } = await mount();
    const future = new Date(Date.now() + 48 * 3600 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const v = `${future.getFullYear()}-${pad(future.getMonth() + 1)}-${pad(future.getDate())} 12:00:00`;
    const field = await openBackdate(el);
    pickDateField(field, v);
    await el.updateComplete;

    clickComplete(el);
    await new Promise((r) => setTimeout(r, 10));

    expect(sent.find((m) => m.type === "maintenance_supporter/task/complete")).to.equal(undefined);
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.include("future");
  });

  it("attaches an uploaded photo as photo_doc_id", async () => {
    const { el, sent } = await mount();

    // Stub the document-upload endpoint the photo picker posts to.
    const realFetch = window.fetch;
    const uploads: RequestInit[] = [];
    window.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
      uploads.push(init!);
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: "doc-photo-1", deduped: false }),
      } as Response;
    }) as typeof window.fetch;

    try {
      const fileInput = el.shadowRoot!.querySelector<HTMLInputElement>(
        '.photo-pick input[type="file"]',
      )!;
      const dt = new DataTransfer();
      dt.items.add(new File(["fake-png"], "done.png", { type: "image/png" }));
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event("change"));
      await new Promise((r) => setTimeout(r, 10));
      await el.updateComplete;

      // Preview replaces the picker once the upload returns an id.
      expect(el.shadowRoot!.querySelector(".photo-preview img")).to.exist;
      expect(uploads.length).to.equal(1);
      const form = uploads[0].body as FormData;
      expect(form.get("entry_id")).to.equal("entry1");
      expect(form.get("tags")).to.equal("photo");

      clickComplete(el);
      await new Promise((r) => setTimeout(r, 10));
      const msg = sent.find((m) => m.type === "maintenance_supporter/task/complete")!;
      expect(msg.photo_doc_id).to.equal("doc-photo-1");
    } finally {
      window.fetch = realFetch;
    }
  });

  it("shows the server error and stays open on refusal (e.g. too_early)", async () => {
    const { el, sent } = await mount({
      completeHandler: () => {
        throw { code: "too_early", message: "Task can only be completed closer to its due date" };
      },
    });
    let completedEvent = false;
    el.addEventListener("task-completed", () => (completedEvent = true));

    clickComplete(el);
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;

    expect(sent.find((m) => m.type === "maintenance_supporter/task/complete")).to.exist;
    // Dialog stays open with a visible error; no completion event fired.
    expect(el.shadowRoot!.querySelector("ha-dialog")).to.exist;
    const err = el.shadowRoot!.querySelector(".error");
    expect(err, "error banner rendered").to.exist;
    expect((err!.textContent || "").length).to.be.greaterThan(0);
    expect(completedEvent).to.be.false;
  });
});

describe("complete-dialog cost suggestion from parts (#104 follow-up)", () => {
  async function mountWithParts(over: Partial<MaintenanceCompleteDialog> = {}) {
    const { hass } = createMockHass({});
    const el = await fixture<MaintenanceCompleteDialog>(html`
      <maintenance-complete-dialog
        .hass=${hass}
        .entryId=${"entry1"}
        .taskId=${"task1"}
        .taskName=${"Uses Parts"}
        .lang=${"en"}
      ></maintenance-complete-dialog>
    `);
    Object.assign(el, over);
    el.open();
    await el.updateComplete;
    return el;
  }

  const chip = (el: MaintenanceCompleteDialog) =>
    el.shadowRoot!.querySelector<HTMLButtonElement>(".cost-suggestion");

  it("sums selected consumed parts (qty x unit cost) and fills on click", async () => {
    const el = await mountWithParts({
      parts: [
        { id: "p1", name: "Filter", cost: 12.5 },
        { id: "p2", name: "O-Ring", cost: 2.25 },
        { id: "p3", name: "Unpriced", cost: null },
      ] as never,
      consumesParts: [
        { part_id: "p1", quantity: 1 },
        { part_id: "p2", quantity: 2 },
        { part_id: "p3", quantity: 1 },
      ] as never,
      currencySymbol: "€",
    });
    const c = chip(el)!;
    expect(c, "suggestion chip rendered").to.exist;
    expect(c.textContent).to.include("17.00");
    expect(c.textContent).to.include("€");
    c.click();
    await el.updateComplete;
    const cost = [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".field-input")][1];
    expect(cost.value).to.equal("17.00");
    expect(chip(el), "chip hides once cost is set").to.equal(null);
  });

  it("buy task: restock qty x unit cost, follows the qty field", async () => {
    const el = await mountWithParts({ restockDefault: 2, restockUnitCost: 4.5 });
    expect(chip(el)!.textContent).to.include("9.00");
  });

  it("no chip when no involved part carries a price", async () => {
    const el = await mountWithParts({
      parts: [{ id: "p1", name: "Filter", cost: null }] as never,
      consumesParts: [{ part_id: "p1", quantity: 1 }] as never,
    });
    expect(chip(el)).to.equal(null);
  });

  it("no chip once the user typed a cost themselves", async () => {
    const el = await mountWithParts({
      parts: [{ id: "p1", name: "Filter", cost: 5 }] as never,
      consumesParts: [{ part_id: "p1", quantity: 1 }] as never,
    });
    expect(chip(el)).to.exist;
    setInput(el, 1, "3.10");
    await el.updateComplete;
    expect(chip(el)).to.equal(null);
  });
});

describe("complete-dialog require_tag_scan note", () => {
  it("shows the scan hint when the task demands proof of presence", async () => {
    const { hass } = createMockHass({});
    const el = await fixture<MaintenanceCompleteDialog>(html`
      <maintenance-complete-dialog
        .hass=${hass}
        .entryId=${"entry1"}
        .taskId=${"task1"}
        .taskName=${"Filter Wechsel"}
        .lang=${"en"}
        .requireTagScan=${true}
      ></maintenance-complete-dialog>
    `);
    el.open();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".scan-required-note")).to.exist;
  });

  it("stays silent for ordinary tasks", async () => {
    const { el } = await mount();
    expect(el.shadowRoot!.querySelector(".scan-required-note")).to.equal(null);
  });
});
