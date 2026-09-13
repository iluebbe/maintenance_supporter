/**
 * Collapsible object-page sections (#179, @RaymonPreissner): tasks,
 * documents, spare parts and history each fold behind a chevron. Collapsed
 * means the section's component is NOT in the DOM (no thumbnails load, no
 * long list to scroll past) — not merely hidden. The collapsed set is saved
 * per browser under `msp-object-sections`, one setting for every object,
 * and everything starts open (no change for existing users). A search hit
 * into a section and a `?section=` deep link open that section for the
 * visit without rewriting the saved set.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const LS_KEY = "msp-object-sections";

type PanelPriv = HTMLElement & {
  updateComplete: Promise<unknown>;
  _showObject: (entryId: string, section?: string | null) => void;
  _view: string;
  _selectedEntryId: string | null;
};

function fixtures() {
  const o = obj("e1", [task({ name: "Filter reinigen", times_performed: 3 }), task({ name: "Salz nachfüllen" })], "Spülmaschine");
  (o as Record<string, unknown>).parts = [{ id: "p1", name: "Zulaufschlauch", mpn: "00668114" }];
  (o.object as Record<string, unknown>).document_count = 2;
  return [o];
}

const REMOTE = {
  documents: [
    { id: "d2", entry_id: "e1", object_name: "Spülmaschine", kind: "weblink", title: "E24 Video", url: "https://example.com/e24", match: "meta", page: null, snippet: "", score: 70 },
  ],
  history: [],
};

async function openObject(el: PanelPriv, entryId = "e1") {
  el._showObject(entryId);
  await el.updateComplete;
  await waitUntil(() => !!sr(el).querySelector(".obj-section"), "object page rendered");
}

const sectionEl = (el: HTMLElement, id: string) => sr(el).querySelector<HTMLElement>(`.obj-section[data-section="${id}"]`);
const toggle = (el: HTMLElement, id: string) => sectionEl(el, id)!.querySelector<HTMLButtonElement>(".obj-section-toggle")!;

async function settle(el: PanelPriv) {
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
}

describe("object page: collapsible sections (#179)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => {
    localStorage.clear();
    history.replaceState(null, "", window.location.pathname);
  });

  it("all four sections render open by default, each with an expanded chevron", async () => {
    const { el } = await mountPanel(fixtures());
    await openObject(el as PanelPriv);
    for (const id of ["tasks", "documents", "parts", "history"]) {
      expect(sectionEl(el, id), `${id} block`).to.exist;
      expect(sectionEl(el, id)!.classList.contains("open"), `${id} open`).to.be.true;
      expect(toggle(el, id).getAttribute("aria-expanded"), `${id} aria-expanded`).to.equal("true");
      expect(toggle(el, id).tagName, "native button — keyboard operable").to.equal("BUTTON");
      expect(toggle(el, id).getAttribute("aria-label")).to.equal("Collapse section");
    }
    expect(sr(el).querySelector(".task-table.object-tasks"), "task table").to.exist;
    expect(sr(el).querySelector("maintenance-documents-section")).to.exist;
    expect(sr(el).querySelector("maintenance-parts-section")).to.exist;
    expect(sr(el).querySelector("maintenance-object-history-section")).to.exist;
    expect(localStorage.getItem(LS_KEY), "nothing written until a toggle").to.be.null;
  });

  it("collapsing documents removes the component from the DOM, shows a heading row with the count, and saves the choice", async () => {
    const { el } = await mountPanel(fixtures());
    const panel = el as PanelPriv;
    await openObject(panel);
    toggle(el, "documents").click();
    await panel.updateComplete;

    expect(sr(el).querySelector("maintenance-documents-section"), "component not rendered when collapsed").to.be.null;
    const head = sectionEl(el, "documents")!.querySelector(".obj-section-title")!;
    expect(head.textContent).to.contain("Documents");
    expect(head.querySelector(".obj-section-count")!.textContent!.trim()).to.equal("2");
    expect(toggle(el, "documents").getAttribute("aria-expanded")).to.equal("false");
    expect(toggle(el, "documents").getAttribute("aria-label")).to.equal("Expand section");
    expect(JSON.parse(localStorage.getItem(LS_KEY)!)).to.deep.equal(["documents"]);
    // The other three are untouched.
    expect(sr(el).querySelector(".task-table.object-tasks")).to.exist;
    expect(sr(el).querySelector("maintenance-parts-section")).to.exist;
    expect(sr(el).querySelector("maintenance-object-history-section")).to.exist;

    // The heading row itself expands it again; the saved set empties.
    (head as HTMLElement).click();
    await panel.updateComplete;
    expect(sr(el).querySelector("maintenance-documents-section")).to.exist;
    expect(JSON.parse(localStorage.getItem(LS_KEY)!)).to.deep.equal([]);
  });

  it("a remount with the key set starts collapsed — the same for every object", async () => {
    localStorage.setItem(LS_KEY, JSON.stringify(["documents", "history"]));
    const second = obj("e2", [task({ history: [{ type: "skipped", timestamp: "2026-05-01T10:00:00" }] })], "Pool Pump");
    const { el } = await mountPanel([...fixtures(), second]);
    const panel = el as PanelPriv;
    for (const entryId of ["e1", "e2"]) {
      await openObject(panel, entryId);
      expect(sr(el).querySelector("maintenance-documents-section"), `${entryId} documents collapsed`).to.be.null;
      expect(sr(el).querySelector("maintenance-object-history-section"), `${entryId} history collapsed`).to.be.null;
      expect(sectionEl(el, "documents")!.querySelector(".obj-section-title")!.textContent).to.contain("Documents");
      expect(sectionEl(el, "history")!.querySelector(".obj-section-title")!.textContent).to.contain("History");
      expect(sr(el).querySelector(".task-table.object-tasks"), `${entryId} tasks open`).to.exist;
    }
    // Unknown ids in a stale value are dropped, not persisted back.
    localStorage.setItem(LS_KEY, JSON.stringify(["documents", "bogus"]));
    const again = await mountPanel(fixtures());
    await openObject(again.el as PanelPriv);
    expect(sr(again.el).querySelector("maintenance-documents-section")).to.be.null;
    expect(sr(again.el).querySelector("maintenance-parts-section")).to.exist;
  });

  it("a document search hit opens the object's documents for that visit only — the saved set is untouched", async () => {
    localStorage.setItem(LS_KEY, JSON.stringify(["documents"]));
    const { el } = await mountPanel(fixtures(), { "maintenance_supporter/search": () => REMOTE });
    const panel = el as PanelPriv;
    const orig = window.open;
    const opened: string[] = [];
    (window as unknown as { open: unknown }).open = (url?: string) => { opened.push(url || ""); return null; };
    try {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
      await panel.updateComplete;
      const input = sr(el).querySelector<HTMLInputElement>(".palette-input")!;
      input.value = "e24";
      input.dispatchEvent(new Event("input"));
      await new Promise((r) => setTimeout(r, 320));
      await panel.updateComplete;
      const hit = [...sr(el).querySelectorAll<HTMLElement>(".palette-item")].find((n) => /E24 Video/.test(n.textContent || ""))!;
      expect(hit, "document hit listed").to.exist;
      hit.click();
      await settle(panel);
    } finally {
      (window as unknown as { open: unknown }).open = orig;
    }
    expect(opened[0], "the link still opens").to.equal("https://example.com/e24");
    expect(panel._view).to.equal("object");
    expect(panel._selectedEntryId).to.equal("e1");
    expect(sr(el).querySelector("maintenance-documents-section"), "documents unfolded for this visit").to.exist;
    expect(toggle(el, "documents").getAttribute("aria-expanded")).to.equal("true");
    expect(JSON.parse(localStorage.getItem(LS_KEY)!), "saved set unchanged").to.deep.equal(["documents"]);

    // A plain visit afterwards is collapsed again.
    panel._showObject("e1");
    await panel.updateComplete;
    expect(sr(el).querySelector("maintenance-documents-section"), "override was for one visit").to.be.null;
  });

  it("a part search hit opens the spare-parts section", async () => {
    localStorage.setItem(LS_KEY, JSON.stringify(["parts"]));
    const { el } = await mountPanel(fixtures(), { "maintenance_supporter/search": () => ({ documents: [], history: [] }) });
    const panel = el as PanelPriv;
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
    await panel.updateComplete;
    const input = sr(el).querySelector<HTMLInputElement>(".palette-input")!;
    input.value = "zulauf";
    input.dispatchEvent(new Event("input"));
    await panel.updateComplete;
    const hit = [...sr(el).querySelectorAll<HTMLElement>(".palette-item")].find((n) => /Zulaufschlauch/.test(n.textContent || ""))!;
    hit.click();
    await settle(panel);
    expect(panel._view).to.equal("object");
    expect(sr(el).querySelector("maintenance-parts-section")).to.exist;
    expect(JSON.parse(localStorage.getItem(LS_KEY)!)).to.deep.equal(["parts"]);
  });

  it("?entry_id=…&section=history opens the object with history unfolded; an unknown value is ignored", async () => {
    localStorage.setItem(LS_KEY, JSON.stringify(["history"]));
    history.replaceState(null, "", `${window.location.pathname}?entry_id=e1&section=history`);
    const { el } = await mountPanel(fixtures());
    const panel = el as PanelPriv;
    await settle(panel);
    expect(panel._view).to.equal("object");
    expect(sr(el).querySelector("maintenance-object-history-section"), "history unfolded").to.exist;
    expect(window.location.search, "params consumed").to.equal("");
    expect(JSON.parse(localStorage.getItem(LS_KEY)!)).to.deep.equal(["history"]);

    // A manual collapse while the override is active ends it and saves.
    toggle(el, "history").click();
    await panel.updateComplete;
    expect(sr(el).querySelector("maintenance-object-history-section")).to.be.null;
    expect(JSON.parse(localStorage.getItem(LS_KEY)!)).to.deep.equal(["history"]);

    history.replaceState(null, "", `${window.location.pathname}?entry_id=e1&section=bogus`);
    const again = await mountPanel(fixtures());
    await settle(again.el as PanelPriv);
    expect((again.el as PanelPriv)._view).to.equal("object");
    expect(sr(again.el).querySelector("maintenance-object-history-section"), "unknown section value: stays collapsed").to.be.null;
  });

  it("no block where the section would render nothing: parts for an operator without parts, history without an entry", async () => {
    const plain = obj("e1", [task()]);
    const { el } = await mountPanel([plain], {}, { user: { id: "op-1", is_admin: false } });
    await openObject(el as PanelPriv);
    expect(sectionEl(el, "parts"), "no parts block").to.be.null;
    expect(sectionEl(el, "history"), "no history block — a chevron beside nothing").to.be.null;
    expect(sectionEl(el, "documents")).to.exist;
    expect(sectionEl(el, "tasks")).to.exist;
  });
});
