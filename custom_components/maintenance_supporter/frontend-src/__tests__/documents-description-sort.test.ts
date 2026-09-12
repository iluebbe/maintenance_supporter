/**
 * #164: a description per document and a sortable document list.
 * sortDocuments orders naturally by title ("Construct 2" before "Construct 10"),
 * by category, newest/oldest; the section shows the description under the
 * title, sends it on edit and on add-link, and remembers the chosen order.
 */
import { expect, fixture, html } from "@open-wc/testing";
import "../components/documents-section.js";
import type { MaintenanceDocumentsSection } from "../components/documents-section";
import { filterDocuments, sortDocuments } from "../helpers/document-filter";
import { LS_KEYS } from "../helpers/storage-keys";
import { createMockHass } from "./_test-utils.js";

const DOCS = [
  { id: "a", kind: "file", title: "Construct 10", filename: "c10.pdf", mime: "application/pdf", size: 10, tags: ["manual"], added_at: "2026-01-03T00:00:00", description: "Roof section" },
  { id: "b", kind: "file", title: "Construct 2", filename: "c2.pdf", mime: "application/pdf", size: 10, tags: ["invoice"], added_at: "2026-01-01T00:00:00" },
  { id: "c", kind: "weblink", title: "Online", url: "https://example.com/x", tags: [], added_at: "2026-01-02T00:00:00", description: "Vendor page" },
  { id: "d", kind: "file", title: "Construct 1", filename: "c1.pdf", mime: "application/pdf", size: 10, tags: ["manual"], added_at: "2026-01-04T00:00:00" },
];

async function mount(docs: unknown[] = DOCS) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/documents/list": () => ({ documents: docs }),
      "maintenance_supporter/documents/update": () => ({ id: "a" }),
      "maintenance_supporter/documents/add_link": () => ({ id: "new", kind: "weblink", url: "https://x", tags: [] }),
    },
  });
  const el = await fixture<MaintenanceDocumentsSection>(html`
    <maintenance-documents-section .hass=${hass} .entryId=${"e1"} .canWrite=${true}></maintenance-documents-section>
  `);
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
  return { el, sent };
}

const titles = (el: MaintenanceDocumentsSection) => [...el.shadowRoot!.querySelectorAll(".doc-title")].map((n) => n.textContent!.trim());

describe("documents: description + sort (#164)", () => {
  afterEach(() => { try { localStorage.removeItem(LS_KEYS.docSort); } catch { /* ignore */ } });

  it("sortDocuments: natural title order, category groups, newest/oldest", () => {
    expect(sortDocuments(DOCS, "title").map((d) => d.id)).to.deep.equal(["d", "b", "a", "c"]);
    expect(sortDocuments(DOCS, "category").map((d) => d.id)).to.deep.equal(["d", "a", "b", "c"]);
    expect(sortDocuments(DOCS, "newest").map((d) => d.id)).to.deep.equal(["d", "a", "c", "b"]);
    expect(sortDocuments(DOCS, "oldest").map((d) => d.id)).to.deep.equal(["b", "c", "a", "d"]);
    expect(sortDocuments(DOCS, "title")).to.not.equal(DOCS, "never sorts in place");
  });

  it("filterDocuments matches the description", () => {
    expect(filterDocuments(DOCS, "roof").map((d) => d.id)).to.deep.equal(["a"]);
  });

  it("shows the description under the title and offers the sort select", async () => {
    const { el } = await mount();
    const rows = [...el.shadowRoot!.querySelectorAll(".doc-row")];
    const withDesc = rows.filter((r) => r.querySelector(".doc-desc"));
    expect(withDesc.length).to.equal(2);
    expect(withDesc[0].querySelector(".doc-desc")!.textContent).to.equal("Roof section");
    const select = el.shadowRoot!.querySelector<HTMLSelectElement>("select.sort-select")!;
    expect(select.value).to.equal("newest");
    expect(titles(el)).to.deep.equal(["Construct 1", "Construct 10", "Online", "Construct 2"]);
    select.value = "title";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(titles(el)).to.deep.equal(["Construct 1", "Construct 2", "Construct 10", "Online"]);
    expect(localStorage.getItem(LS_KEYS.docSort)).to.equal("title");
    // A remembered order applies on the next mount.
    const { el: el2 } = await mount();
    expect(titles(el2)[0]).to.equal("Construct 1");
    expect(el2.shadowRoot!.querySelector<HTMLSelectElement>("select.sort-select")!.value).to.equal("title");
  });

  it("edit sends the description; add-link sends it too", async () => {
    const { el, sent } = await mount();
    const editBtn = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>("button.icon-btn")].find((b) => /edit/i.test(b.title))!;
    editBtn.click();
    await el.updateComplete;
    const desc = el.shadowRoot!.querySelector<HTMLInputElement>("input.edit-desc")!;
    expect(desc, "description field in the edit row").to.exist;
    desc.value = "Updated note";
    desc.dispatchEvent(new Event("input"));
    await el.updateComplete;
    [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>("button.icon-btn")].find((b) => /save/i.test(b.title))!.click();
    await new Promise((r) => setTimeout(r, 20));
    const upd = sent.find((m) => m.type === "maintenance_supporter/documents/update");
    expect(upd!.description).to.equal("Updated note");

    [...el.shadowRoot!.querySelectorAll("button")].find((b) => /link/i.test(b.textContent || ""))!.click();
    await el.updateComplete;
    const url = el.shadowRoot!.querySelector<HTMLInputElement>('input[type="url"]')!;
    url.value = "https://example.com/manual.pdf";
    url.dispatchEvent(new Event("input"));
    const ldesc = el.shadowRoot!.querySelector<HTMLInputElement>("input.link-desc")!;
    ldesc.value = "Vendor manual";
    ldesc.dispatchEvent(new Event("input"));
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>(".link-form .btn.primary")!.click();
    await new Promise((r) => setTimeout(r, 20));
    const add = sent.find((m) => m.type === "maintenance_supporter/documents/add_link");
    expect(add!.description).to.equal("Vendor manual");
  });
});
