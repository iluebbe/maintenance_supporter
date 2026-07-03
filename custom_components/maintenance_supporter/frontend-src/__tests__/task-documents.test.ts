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

  it("sets a per-task jump-to page for a linked PDF via WS", async () => {
    const PDF = { id: "d1", kind: "file", title: "Manual", filename: "m.pdf", mime: "application/pdf", size: 100, tags: ["manual"], task_ids: ["t1"] };
    const { el, sent } = await mount(true, [PDF]);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".tdoc-page");
    expect(input, "page field renders for a linked PDF").to.exist;
    input!.value = "7";
    input!.dispatchEvent(new Event("change"));
    await el.updateComplete;
    const msg = sent.find((m) => m.type === "maintenance_supporter/documents/update" && m.doc_id === "d1");
    expect(msg, "page update WS sent").to.exist;
    expect(msg!.task_pages).to.deep.equal({ t1: 7 });
  });

  it("opens a paged PDF at its page via the #page fragment", async () => {
    const PDF = { id: "d1", kind: "file", title: "Manual", filename: "m.pdf", mime: "application/pdf", size: 100, tags: ["manual"], task_ids: ["t1"], task_pages: { t1: 12 } };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/documents/list": () => ({ documents: [PDF] }),
        "auth/sign_path": () => ({ path: "/api/maintenance_supporter/document/d1?authSig=x" }),
      },
    });
    const el = await fixture<MaintenanceTaskDocuments>(html`
      <maintenance-task-documents .hass=${hass} .entryId=${"e1"} .taskId=${"t1"} .canWrite=${true}></maintenance-task-documents>
    `);
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;

    const win = { location: { href: "" }, close() {} };
    const orig = window.open;
    window.open = (() => win as unknown as Window) as typeof window.open;
    try {
      const eye = [...el.shadowRoot!.querySelectorAll(".tdoc-row .icon-btn")].find(
        (b) => b.querySelector('ha-icon[icon="mdi:eye-outline"]'),
      ) as HTMLButtonElement;
      eye.click();
      await new Promise((r) => setTimeout(r, 20));
      expect(win.location.href).to.contain("#page=12");
    } finally {
      window.open = orig;
    }
  });

  it("opens a document by clicking its title row (not just the eye icon)", async () => {
    const LINK = { id: "d3", kind: "weblink", title: "Online Manual", url: "https://x/m.pdf", tags: [], task_ids: ["t1"] };
    const orig = window.open;
    let openedUrl = "";
    window.open = ((u: string) => { openedUrl = u; return null; }) as typeof window.open;
    try {
      const { el } = await mount(true, [LINK]);
      const info = el.shadowRoot!.querySelector<HTMLElement>(".tdoc-row .tdoc-info")!;
      expect(info, "title row present").to.exist;
      expect(info.getAttribute("role"), "title row is a button").to.equal("button");
      info.click();
      await el.updateComplete;
      expect(openedUrl, "clicking the title opens the link").to.equal("https://x/m.pdf");
    } finally {
      window.open = orig;
    }
  });
});
