/**
 * "Manual" column fallback to uploaded manual documents (prod finding
 * 2026-08-02): an object whose handbook is ATTACHED (category "manual") but
 * whose legacy documentation_url is empty rendered "—" in the objects table —
 * next to an object that plainly has its manual. The cell (and the object
 * header) now falls back to the manual-tagged documents the backend exposes
 * as `manual_docs`.
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr } from "./_panel-utils.js";

type PanelEl = HTMLElement & {
  updateComplete: Promise<unknown>;
  _view: string;
  _objectViewMode: string;
  _objectsTableColumns: string[];
};

async function mountObjectsTable(objects: unknown[]) {
  const { el } = await mountPanel(objects);
  const panel = el as PanelEl;
  panel._view = "all_objects";
  panel._objectViewMode = "table";
  panel._objectsTableColumns = ["name", "documentation_url"];
  await panel.updateComplete;
  await new Promise((r) => setTimeout(r, 10));
  await panel.updateComplete;
  return panel;
}

function docCellFor(panel: PanelEl, name: string): HTMLElement | null {
  const rows = [...sr(panel).querySelectorAll<HTMLElement>(".objects-table-row")];
  const row = rows.find((r) => r.textContent?.includes(name));
  return row?.querySelector<HTMLElement>(".oc-documentation_url") ?? null;
}

describe("objects table: manual column falls back to uploaded manuals", () => {
  beforeEach(() => resetTaskSeq());

  it("documentation_url still wins when set", async () => {
    const o = obj("e1", [], "Printer");
    (o.object as Record<string, unknown>).documentation_url = "https://vendor.example/manual";
    const panel = await mountObjectsTable([o]);
    const cell = docCellFor(panel, "Printer");
    expect(cell, "cell rendered").to.exist;
    const link = cell!.querySelector("a");
    expect(link, "link rendered").to.exist;
    expect(link!.getAttribute("href")).to.equal("https://vendor.example/manual");
  });

  it("an attached manual document replaces the em-dash", async () => {
    const o = obj("e2", [], "Wallbox");
    (o.object as Record<string, unknown>).manual_docs = [
      { id: "d1", title: "Installationshandbuch", kind: "file" },
      { id: "d2", title: "Benutzerhandbuch", kind: "file" },
    ];
    const panel = await mountObjectsTable([o]);
    const cell = docCellFor(panel, "Wallbox");
    expect(cell, "cell rendered").to.exist;
    expect(cell!.textContent).to.not.include("—");
    const link = cell!.querySelector("a");
    expect(link, "fallback link rendered").to.exist;
    expect(link!.getAttribute("title")).to.equal("Installationshandbuch");
  });

  it("no url and no manuals keeps the em-dash", async () => {
    const panel = await mountObjectsTable([obj("e3", [], "Bare Object")]);
    const cell = docCellFor(panel, "Bare Object");
    expect(cell, "cell rendered").to.exist;
    expect(cell!.textContent).to.include("—");
    expect(cell!.querySelector("a")).to.equal(null);
  });

  it("the object header lists attached manuals when the url field is empty", async () => {
    const o = obj("e4", [], "Wallbox");
    (o.object as Record<string, unknown>).manual_docs = [
      { id: "d1", title: "Installationshandbuch", kind: "file" },
      { id: "d2", title: "Benutzerhandbuch", kind: "file" },
    ];
    const { el } = await mountPanel([o]);
    const panel = el as PanelEl & { _showObject: (id: string) => void };
    panel._showObject("e4");
    await panel.updateComplete;
    await new Promise((r) => setTimeout(r, 10));
    await panel.updateComplete;
    const metas = [...sr(panel).querySelectorAll<HTMLElement>("p.meta")];
    const manualRow = metas.find((m) => m.textContent?.includes("Installationshandbuch"));
    expect(manualRow, "manual meta row rendered").to.exist;
    expect(manualRow!.querySelectorAll("a").length).to.equal(2);
    expect(manualRow!.textContent).to.include("Benutzerhandbuch");
  });

  it("the header caps at three manuals and counts the rest", async () => {
    // An object can carry MANY manual-tagged documents — the header must not
    // become a wall of links (the full list lives in the documents section
    // right below). Three links + a "+N" indicator.
    const o = obj("e5", [], "Archive Box");
    (o.object as Record<string, unknown>).manual_docs = Array.from({ length: 12 }, (_, i) => ({
      id: `d${i}`, title: `Handbook ${i + 1}`, kind: "file",
    }));
    const { el } = await mountPanel([o]);
    const panel = el as PanelEl & { _showObject: (id: string) => void };
    panel._showObject("e5");
    await panel.updateComplete;
    await new Promise((r) => setTimeout(r, 10));
    await panel.updateComplete;
    const metas = [...sr(panel).querySelectorAll<HTMLElement>("p.meta")];
    const manualRow = metas.find((m) => m.textContent?.includes("Handbook 1"));
    expect(manualRow, "manual meta row rendered").to.exist;
    expect(manualRow!.querySelectorAll("a").length).to.equal(3);
    expect(manualRow!.textContent).to.include("+9");
    expect(manualRow!.textContent).to.not.include("Handbook 4");
  });
});
