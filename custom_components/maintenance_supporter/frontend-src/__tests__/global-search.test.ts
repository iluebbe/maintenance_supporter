/**
 * The panel's global search (#171): a visible magnifier opens it (tab bar on
 * wide screens, header when narrow), the tolerant matcher runs over objects
 * (incl. model / serial), tasks (incl. notes), spare parts, results come
 * grouped and ranked, archived objects stay out, the server's document and
 * history-note hits are merged after the debounce (page chip + snippet),
 * and selecting a hit lands in the right place — a history note on the
 * task's history tab with the filter pre-filled, a content hit in the PDF
 * on the matching page.
 */

import { expect } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const REMOTE = {
  documents: [
    { id: "d1", entry_id: "e1", object_name: "Spülmaschine", kind: "file", title: "Bedienungsanleitung", filename: "m.pdf", match: "content", page: 2, snippet: "…Fehlercode E24: Zulauf prüfen…", score: 80 },
    { id: "d2", entry_id: "e1", object_name: "Spülmaschine", kind: "weblink", title: "E24 Video", url: "https://example.com/e24", match: "meta", page: null, snippet: "", score: 70 },
  ],
  history: [
    { entry_id: "e1", task_id: "t1", task_name: "Filter reinigen", object_name: "Spülmaschine", timestamp: "2026-05-01T10:00:00", type: "completed", snippet: "…E24 nach dem Reinigen weg…", score: 4 },
  ],
};

async function open(el: HTMLElement & { updateComplete: Promise<unknown> }, query: string, settle = 0) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
  await el.updateComplete;
  const input = sr(el).querySelector<HTMLInputElement>(".palette-input")!;
  input.value = query;
  input.dispatchEvent(new Event("input"));
  await el.updateComplete;
  if (settle) { await new Promise((r) => setTimeout(r, settle)); await el.updateComplete; }
  return input;
}

const labels = (el: HTMLElement) => [...sr(el).querySelectorAll(".palette-results .palette-label")].map((n) => n.textContent!.trim());
const groups = (el: HTMLElement) => [...sr(el).querySelectorAll(".palette-results .palette-group:not(.palette-waiting)")].map((n) => n.textContent!.trim());

function fixtures() {
  const dish = obj("e1", [
    task({ name: "Filter reinigen", labels: ["küche"] }),
    task({ name: "Salz nachfüllen", notes: "Spezialsalz aus dem Baumarkt" }),
  ], "Spülmaschine");
  (dish.object as Record<string, unknown>).model = "SN65ZX";
  (dish.object as Record<string, unknown>).serial_number = "WM-14-T5";
  (dish as Record<string, unknown>).parts = [{ id: "p1", name: "Zulaufschlauch", mpn: "00668114" }];
  const pump = obj("e2", [task({ name: "Pumpe prüfen" })], "Pool Pump");
  const gone = obj("e3", [task({ name: "Filter tauschen" })], "Alter Filterkasten");
  (gone.object as Record<string, unknown>).archived = true;
  return [dish, pump, gone];
}

describe("global search (#171)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(async () => { localStorage.clear(); await setViewport({ width: 1200, height: 800 }); });

  it("the tab-bar magnifier opens the search on wide screens; the header one when narrow", async () => {
    const { el } = await mountPanel(fixtures(), { "maintenance_supporter/search": () => REMOTE });
    const button = sr(el).querySelector<HTMLElement>(".tab-bar .tab-search");
    expect(button, "magnifier in the tab bar").to.exist;
    expect(sr(el).querySelector(".header-search"), "no header on the wide overview").to.be.null;
    button!.click();
    await el.updateComplete;
    expect(sr(el).querySelector(".palette-input"), "search opened").to.exist;
    expect(sr(el).querySelector(".palette-empty")!.textContent).to.contain("Type to search");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(sr(el).querySelector(".palette-input")).to.be.null;

    // HA sets `narrow` on the panel element for phone widths.
    (el as unknown as { narrow: boolean }).narrow = true;
    await el.updateComplete;
    expect(sr(el).querySelector(".header .header-search"), "magnifier in the narrow header").to.exist;
    expect(sr(el).querySelector(".tab-bar .tab-search"), "not twice on narrow").to.be.null;
  });

  it("matches tolerantly across objects, tasks and parts, grouped and without archived objects", async () => {
    const { el } = await mountPanel(fixtures(), { "maintenance_supporter/search": () => ({ documents: [], history: [] }) });
    await open(el, "spuelm filt");
    expect(groups(el)).to.deep.equal(["Tasks"]);
    expect(labels(el)).to.deep.equal(["Filter reinigen"]);
    expect(sr(el).querySelector(".palette-sub")!.textContent).to.contain("Spülmaschine");

    const input = sr(el).querySelector<HTMLInputElement>(".palette-input")!;
    for (const [q, expectGroup, expectLabel] of [
      ["sn65", "Objects", "Spülmaschine"], // model
      ["wm14t5", "Objects", "Spülmaschine"], // serial, separators ignored
      ["baumarkt", "Tasks", "Salz nachfüllen"], // task notes
      ["zulaufschl", "Spare parts", "Zulaufschlauch"], // part name
      ["00668114", "Spare parts", "Zulaufschlauch"], // part number
      ["kuche", "Tasks", "Filter reinigen"], // label, diacritics folded
    ] as const) {
      input.value = q;
      input.dispatchEvent(new Event("input"));
      await el.updateComplete;
      expect(groups(el), q).to.include(expectGroup);
      expect(labels(el), q).to.include(expectLabel);
    }
    input.value = "filter";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(labels(el)).to.include("Filter reinigen");
    expect(labels(el), "archived object's task stays out").to.not.include("Filter tauschen");
    expect(labels(el)).to.not.include("Alter Filterkasten");
    input.value = "x";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(sr(el).querySelector(".palette-empty")!.textContent, "one char = hint, no search").to.contain("Type to search");
  });

  it("merges the server's document and history hits after the debounce, with page chip and snippet", async () => {
    const calls: Record<string, unknown>[] = [];
    const { el } = await mountPanel(fixtures(), {
      "maintenance_supporter/search": (msg: Record<string, unknown>) => { calls.push(msg); return REMOTE; },
    });
    await open(el, "e24");
    expect(calls.length, "nothing sent before the debounce").to.equal(0);
    expect(sr(el).querySelector(".palette-waiting, .palette-empty")!.textContent).to.contain("Searching");
    await new Promise((r) => setTimeout(r, 320));
    await el.updateComplete;
    expect(calls.length).to.equal(1);
    expect(calls[0].query).to.equal("e24");
    expect(groups(el)).to.deep.equal(["Documents", "In documents", "History notes"]);
    const content = [...sr(el).querySelectorAll<HTMLElement>(".palette-item")].find((n) => /Bedienungsanleitung/.test(n.textContent || ""))!;
    expect(content.querySelector(".palette-page")!.textContent).to.equal("Page 2");
    expect(content.querySelector(".palette-snippet")!.textContent).to.contain("Fehlercode E24");
    const note = [...sr(el).querySelectorAll<HTMLElement>(".palette-item")].find((n) => /nach dem Reinigen/.test(n.textContent || ""))!;
    expect(note.querySelector(".palette-sub")!.textContent).to.contain("Spülmaschine");
    expect(sr(el).querySelector(".palette-waiting"), "no longer waiting").to.be.null;
  });

  it("a history hit opens the task's history tab with the notes filter pre-filled", async () => {
    const { el } = await mountPanel(fixtures(), { "maintenance_supporter/search": () => REMOTE });
    await open(el, "e24", 320);
    const note = [...sr(el).querySelectorAll<HTMLElement>(".palette-item")].find((n) => /nach dem Reinigen/.test(n.textContent || ""))!;
    note.click();
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    expect(sr(el).querySelector(".palette-input"), "closed").to.be.null;
    const panel = el as unknown as { _view: string; _activeTab: string; _historySearch: string; _selectedTaskId: string };
    expect(panel._view).to.equal("task");
    expect(panel._selectedTaskId).to.equal("t1");
    expect(panel._activeTab).to.equal("history");
    expect(panel._historySearch).to.equal("e24");
  });

  it("a content hit opens the signed PDF on the matching page; a web-link hit opens the URL", async () => {
    const { el } = await mountPanel(fixtures(), {
      "maintenance_supporter/search": () => REMOTE,
      "auth/sign_path": (msg: Record<string, unknown>) => ({ path: `${msg.path as string}?authSig=x` }),
    });
    const opened: string[] = [];
    const fakeWin = { location: { href: "" }, close: () => undefined };
    const orig = window.open;
    (window as unknown as { open: unknown }).open = (url?: string) => { opened.push(url || "about:blank"); return fakeWin; };
    try {
      await open(el, "e24", 320);
      const content = [...sr(el).querySelectorAll<HTMLElement>(".palette-item")].find((n) => /Bedienungsanleitung/.test(n.textContent || ""))!;
      content.click();
      await new Promise((r) => setTimeout(r, 30));
      expect(opened[0]).to.equal("about:blank");
      expect(fakeWin.location.href).to.contain("/api/maintenance_supporter/document/d1");
      expect(fakeWin.location.href).to.contain("#page=2");

      await open(el, "e24", 320);
      const link = [...sr(el).querySelectorAll<HTMLElement>(".palette-item")].find((n) => /E24 Video/.test(n.textContent || ""))!;
      link.click();
      await new Promise((r) => setTimeout(r, 10));
      expect(opened[1]).to.equal("https://example.com/e24");
    } finally {
      (window as unknown as { open: unknown }).open = orig;
    }
  });

  it("keyboard: arrows walk the flat list across groups, Enter opens the active hit", async () => {
    const { el } = await mountPanel(fixtures(), { "maintenance_supporter/search": () => ({ documents: [], history: [] }) });
    await open(el, "filter");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    await el.updateComplete;
    const active = sr(el).querySelector(".palette-item.active")!;
    const activeLabel = active.querySelector(".palette-label")!.textContent!.trim();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    expect(sr(el).querySelector(".palette-input")).to.be.null;
    const panel = el as unknown as { _view: string };
    expect(["task", "object"]).to.include(panel._view);
    expect(activeLabel.length).to.be.greaterThan(0);
  });
});
