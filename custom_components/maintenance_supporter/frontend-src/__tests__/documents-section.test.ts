/**
 * Lit component tests for <maintenance-documents-section>.
 *
 * Covers the WS-driven paths (list render, add-link, delete) and the write
 * gate. File upload goes through fetch() to the authenticated view and is
 * verified live (live_docs.py), not here.
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../components/documents-section.js";
import type { MaintenanceDocumentsSection } from "../components/documents-section";
import { createMockHass } from "./_test-utils.js";

const FILE_DOC = {
  id: "d1", kind: "file", title: "Manual", filename: "m.pdf",
  mime: "application/pdf", size: 2048, tags: ["manual"], added_at: "2026-01-01T00:00:00",
};
const LINK_DOC = {
  id: "d2", kind: "weblink", title: "Online", url: "https://example.com/x",
  tags: [], added_at: "2026-01-01T00:00:00",
};

async function mount(canWrite = true, docs: unknown[] = [FILE_DOC, LINK_DOC]) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/documents/list": () => ({ documents: docs }),
      "maintenance_supporter/documents/add_link": () => ({ id: "new", kind: "weblink", url: "https://x", tags: [] }),
      "maintenance_supporter/documents/delete": () => ({ success: true, bytes_freed: 0 }),
    },
  });
  const el = await fixture<MaintenanceDocumentsSection>(html`
    <maintenance-documents-section .hass=${hass} .entryId=${"e1"} .canWrite=${canWrite}></maintenance-documents-section>
  `);
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
  return { el, sent };
}

describe("documents-section", () => {
  it("lists documents with a count", async () => {
    const { el } = await mount();
    const rows = el.shadowRoot!.querySelectorAll(".doc-row");
    expect(rows.length).to.equal(2);
    expect(el.shadowRoot!.querySelector("h3")!.textContent).to.contain("2");
  });

  it("offers all six categories when writable", async () => {
    const { el } = await mount(true);
    const opts = el.shadowRoot!.querySelectorAll(".cat-select option");
    expect(opts.length).to.equal(6);
  });

  it("adds a web-link via WS", async () => {
    const { el, sent } = await mount();
    const toggle = [...el.shadowRoot!.querySelectorAll("button")].find((b) =>
      /link/i.test(b.textContent || ""),
    );
    toggle!.click();
    await el.updateComplete;

    const urlInput = el.shadowRoot!.querySelector<HTMLInputElement>('input[type="url"]')!;
    urlInput.value = "https://example.com/manual.pdf";
    urlInput.dispatchEvent(new Event("input"));
    await el.updateComplete;

    el.shadowRoot!.querySelector<HTMLButtonElement>(".link-form .btn.primary")!.click();
    await el.updateComplete;

    const msg = sent.find((m) => m.type === "maintenance_supporter/documents/add_link");
    expect(msg, "add_link WS sent").to.exist;
    expect(msg!.url).to.equal("https://example.com/manual.pdf");
  });

  it("deletes a document via WS after confirmation", async () => {
    const orig = window.confirm;
    window.confirm = () => true;
    try {
      const { el, sent } = await mount();
      el.shadowRoot!.querySelector<HTMLButtonElement>(".icon-btn.danger")!.click();
      await el.updateComplete;
      const msg = sent.find((m) => m.type === "maintenance_supporter/documents/delete");
      expect(msg, "delete WS sent").to.exist;
      expect(msg!.doc_id).to.equal("d1");
    } finally {
      window.confirm = orig;
    }
  });

  it("hides write controls when not writable", async () => {
    const { el } = await mount(false);
    expect(el.shadowRoot!.querySelector(".cat-select"), "no category select").to.not.exist;
    expect(el.shadowRoot!.querySelector(".icon-btn.danger"), "no delete button").to.not.exist;
    // read-only still lists documents and offers open/download
    expect(el.shadowRoot!.querySelectorAll(".doc-row").length).to.equal(2);
  });

  it("shows an image thumbnail and opens it in a lightbox", async () => {
    const IMG = {
      id: "img1", kind: "file", title: "Typenschild", filename: "p.jpg",
      mime: "image/jpeg", size: 100, tags: ["photo"], added_at: "2026-01-01T00:00:00",
    };
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/documents/list": () => ({ documents: [IMG] }),
        "auth/sign_path": () => ({ path: "/api/maintenance_supporter/document/img1?authSig=x" }),
      },
    });
    const el = await fixture<MaintenanceDocumentsSection>(html`
      <maintenance-documents-section .hass=${hass} .entryId=${"e1"} .canWrite=${true}></maintenance-documents-section>
    `);
    await new Promise((r) => setTimeout(r, 40));
    await el.updateComplete;

    const thumb = el.shadowRoot!.querySelector<HTMLImageElement>(".doc-thumb");
    expect(thumb, "thumbnail rendered").to.exist;
    expect(thumb!.src).to.contain("authSig");

    thumb!.click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".lightbox"), "lightbox open").to.exist;
  });

  it("edits a document's title/category via WS", async () => {
    const { el, sent } = await mount();
    const editBtn = [...el.shadowRoot!.querySelectorAll(".doc-row-actions .icon-btn")].find(
      (b) => b.querySelector('ha-icon[icon="mdi:pencil"]'),
    ) as HTMLButtonElement;
    editBtn.click();
    await el.updateComplete;

    const title = el.shadowRoot!.querySelector<HTMLInputElement>(".edit-title");
    expect(title, "edit form open").to.exist;
    title!.value = "Renamed manual";
    title!.dispatchEvent(new Event("input"));
    await el.updateComplete;

    const saveBtn = [...el.shadowRoot!.querySelectorAll(".doc-row.editing .icon-btn")].find(
      (b) => b.querySelector('ha-icon[icon="mdi:check"]'),
    ) as HTMLButtonElement;
    saveBtn.click();
    await el.updateComplete;

    const msg = sent.find((m) => m.type === "maintenance_supporter/documents/update");
    expect(msg, "update WS sent").to.exist;
    expect(msg!.title).to.equal("Renamed manual");
    expect(msg!.doc_id).to.equal("d1");
  });

  it("uploads multiple files and honors the camera category override", async () => {
    const { el } = await mount(true, [FILE_DOC]);
    (el.hass as unknown as { auth: unknown }).auth = { data: { access_token: "tok" } };
    const tags: string[] = [];
    const origFetch = window.fetch;
    window.fetch = (async (_url: string, opts: { body: FormData }) => {
      tags.push(opts.body.get("tags") as string);
      return new Response(JSON.stringify({ id: "n", deduped: false }), { status: 200 });
    }) as unknown as typeof window.fetch;
    const up = (el as unknown as { _uploadFiles: (f: File[], c?: string) => Promise<void> })._uploadFiles;
    try {
      const f1 = new File(["a"], "a.pdf", { type: "application/pdf" });
      const f2 = new File(["b"], "b.pdf", { type: "application/pdf" });
      await up.call(el, [f1, f2]); // one POST per file, default category
      expect(tags).to.deep.equal(["manual", "manual"]);
      tags.length = 0;
      await up.call(el, [f1], "photo"); // camera override
      expect(tags).to.deep.equal(["photo"]);
    } finally {
      window.fetch = origFetch;
    }
  });
});
