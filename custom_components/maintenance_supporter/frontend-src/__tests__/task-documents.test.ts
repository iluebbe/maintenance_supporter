/** Lit component tests for <maintenance-task-documents>. */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/task-documents.js";
import type { MaintenanceTaskDocuments } from "../components/task-documents";
import { createMockHass } from "./_test-utils.js";

const LINKED = { id: "d1", kind: "file", title: "Manual", filename: "m.pdf", mime: "application/pdf", size: 100, tags: ["manual"], task_ids: ["t1"] };
const AVAIL = { id: "d2", kind: "file", title: "Invoice", filename: "i.pdf", mime: "application/pdf", size: 50, tags: ["invoice"], task_ids: [] };

async function mount(canWrite = true, docs: unknown[] = [LINKED, AVAIL]) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/documents/list": () => ({ documents: docs }),
      "maintenance_supporter/documents/update": () => ({ id: "d1" }),
    },
  });
  const el = await fixture<MaintenanceTaskDocuments>(html`
    <maintenance-task-documents .hass=${hass} .entryId=${"e1"} .taskId=${"t1"} .canWrite=${canWrite}></maintenance-task-documents>
  `);
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
  return { el, sent };
}

describe("task-documents", () => {
  it("lists only documents linked to the task", async () => {
    const { el } = await mount();
    const rows = el.shadowRoot!.querySelectorAll(".tdoc-row");
    expect(rows.length).to.equal(1);
    expect(rows[0].querySelector(".tdoc-title")!.textContent).to.contain("Manual");
    const opts = el.shadowRoot!.querySelectorAll(".tdoc-select option");
    expect([...opts].some((o) => o.textContent!.includes("Invoice")), "unlinked doc offered").to.be.true;
  });

  it("links an available document to the task via WS", async () => {
    const { el, sent } = await mount();
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>(".tdoc-select")!;
    select.value = "d2";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>(".tdoc-btn")!.click();
    await el.updateComplete;
    const msg = sent.find((m) => m.type === "maintenance_supporter/documents/update" && m.doc_id === "d2");
    expect(msg, "link WS sent").to.exist;
    expect(msg!.task_ids).to.deep.equal(["t1"]);
  });

  it("unlinks a linked document via WS", async () => {
    const { el, sent } = await mount();
    const unlink = [...el.shadowRoot!.querySelectorAll(".tdoc-row .icon-btn")].find(
      (b) => b.querySelector('ha-icon[icon="mdi:link-variant-off"]'),
    ) as HTMLButtonElement;
    unlink.click();
    await el.updateComplete;
    const msg = sent.find((m) => m.type === "maintenance_supporter/documents/update" && m.doc_id === "d1");
    expect(msg, "unlink WS sent").to.exist;
    expect(msg!.task_ids).to.deep.equal([]);
  });

  it("hides entirely when the object has no documents", async () => {
    const { el } = await mount(true, []);
    expect(el.shadowRoot!.querySelector(".task-docs"), "hidden with no docs").to.not.exist;
  });
});
