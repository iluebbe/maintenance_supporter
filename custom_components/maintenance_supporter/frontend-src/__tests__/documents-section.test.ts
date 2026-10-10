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
import { DOC_MAX_BYTES } from "../helpers/photo-upload.js";
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

  it("opens a document by clicking its title row, not just the icons", async () => {
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

    const info = el.shadowRoot!.querySelector<HTMLElement>(".doc-info");
    expect(info, "title row present").to.exist;
    expect(info!.getAttribute("role"), "title row is a button").to.equal("button");
    info!.click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".lightbox"), "clicking the title opens the preview").to.exist;
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

  describe("a refused upload says so and keeps saying it (#209)", () => {
    const origFetch = window.fetch;
    afterEach(() => { window.fetch = origFetch; });
    const pdf = (name: string, size = 1) => {
      const f = new File(["x"], name, { type: "application/pdf" });
      Object.defineProperty(f, "size", { value: size });
      return f;
    };
    const upload = async (el: MaintenanceDocumentsSection, files: File[]) => {
      (el.hass as unknown as { auth: unknown }).auth = { data: { access_token: "tok" } };
      await (el as unknown as { _uploadFiles: (f: File[]) => Promise<void> })._uploadFiles.call(el, files);
      await el.updateComplete;
      return el.shadowRoot!.querySelector(".doc-msg.error")?.textContent?.trim() ?? "";
    };

    it("a 413 is still on the error line after the list reloaded", async () => {
      const { el, sent } = await mount(true, [FILE_DOC]);
      window.fetch = (async () => new Response("{}", { status: 413 })) as typeof fetch;
      const lists = () => sent.filter((m) => m.type === "maintenance_supporter/documents/list").length;
      const before = lists();
      const shown = await upload(el, [pdf("hvac.pdf")]);
      expect(lists(), "the list reloaded").to.equal(before + 1);
      expect(shown).to.equal("hvac.pdf: File is too large (max 25 MB).");
    });

    it("a file over the limit is refused without being sent", async () => {
      const { el } = await mount(true, [FILE_DOC]);
      const posted: string[] = [];
      window.fetch = (async (_u: string, o: { body: FormData }) => {
        posted.push((o.body.get("file") as File).name);
        return new Response(JSON.stringify({ id: "n", deduped: false }), { status: 200 });
      }) as unknown as typeof fetch;
      const shown = await upload(el, [pdf("manual.pdf", DOC_MAX_BYTES + 1), pdf("invoice.pdf", DOC_MAX_BYTES)]);
      expect(posted, "only the file within the limit went up").to.deep.equal(["invoice.pdf"]);
      expect(shown).to.equal("manual.pdf: File is too large (max 25 MB).");
    });

    it("a dropped connection is named per file and the rest still go up", async () => {
      const { el } = await mount(true, [FILE_DOC]);
      let calls = 0;
      window.fetch = (async () => {
        if (calls++ === 0) throw new TypeError("Failed to fetch");
        return new Response(JSON.stringify({ id: "n", deduped: false }), { status: 200 });
      }) as typeof fetch;
      const shown = await upload(el, [pdf("a.pdf"), pdf("b.pdf")]);
      expect(calls).to.equal(2);
      expect(shown).to.equal("a.pdf: Upload failed.");
    });

    it("an upload without a refusal leaves no error behind", async () => {
      const { el } = await mount(true, [FILE_DOC]);
      window.fetch = (async () => new Response(JSON.stringify({ id: "n", deduped: false }), { status: 200 })) as typeof fetch;
      expect(await upload(el, [pdf("ok.pdf")])).to.equal("");
    });
  });

  it("opens the file picker via keyboard on the upload label (a11y)", async () => {
    const { el } = await mount();
    const label = [...el.shadowRoot!.querySelectorAll("label.btn")].find(
      (l) => l.querySelector('input[type="file"][multiple]'),
    ) as HTMLElement;
    expect(label, "upload label is focusable").to.exist;
    expect(label.getAttribute("tabindex")).to.equal("0");
    expect(label.getAttribute("role")).to.equal("button");

    const input = label.querySelector<HTMLInputElement>('input[type="file"]')!;
    let clicked = false;
    input.click = () => { clicked = true; };
    label.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(clicked, "Enter triggers the hidden file input").to.be.true;
  });

  it("offers a local filter from 8 documents up and filters tolerantly (#171)", async () => {
    const many = Array.from({ length: 9 }, (_, i) => ({
      ...FILE_DOC, id: `f${i}`, title: i === 4 ? "Garantie Spülmaschine" : `Rechnung ${i}`, filename: `r${i}.pdf`, tags: i === 4 ? ["warranty"] : ["invoice"],
    }));
    const { el } = await mount(true, many);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>(".doc-filter input");
    expect(input, "filter box shown").to.exist;
    expect(el.shadowRoot!.querySelectorAll(".doc-row").length).to.equal(9);
    input!.value = "spuel garant";
    input!.dispatchEvent(new Event("input"));
    await el.updateComplete;
    const rows = [...el.shadowRoot!.querySelectorAll(".doc-row")];
    expect(rows.length).to.equal(1);
    expect(rows[0].textContent).to.contain("Garantie Spülmaschine");
    input!.value = "nichts";
    input!.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".doc-empty")!.textContent).to.contain("No matching documents");
    expect(el.shadowRoot!.querySelector("h3")!.textContent, "count stays the full count").to.contain("(9)");
  });

  it("keeps the list uncluttered below 8 documents — no filter box", async () => {
    const { el } = await mount();
    expect(el.shadowRoot!.querySelector(".doc-filter")).to.be.null;
  });
});
