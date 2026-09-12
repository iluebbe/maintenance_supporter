/**
 * Bug audit 2026-09-12, finding 2: a global-search history hit lands on the
 * task's History tab with the notes filter pre-filled — but the server
 * matched fold-tolerantly (AND over words, any order) while the client
 * filtered with a plain `includes()`, so "spuelung" vs "Spülung durchgeführt"
 * or a reordered query opened an EMPTY tab. The client filter now runs the
 * same matcher (helpers/search-match). And the pre-filled filter belongs to
 * the one task the palette opened: `_showTask` clears it, so it does not
 * leak into every task opened afterwards.
 */
import { expect } from "@open-wc/testing";
import { render } from "lit";
import { renderHistoryList, type HistoryContext } from "../renderers/history.js";
import { matchesQuery } from "../helpers/search-match.js";
import type { HistoryEntry, MaintenanceTask } from "../types";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

const ENTRIES: Partial<HistoryEntry>[] = [
  { timestamp: "2026-05-01T10:00:00", type: "completed", notes: "Spülung durchgeführt, Filter gereinigt", ref_no: 1 },
  { timestamp: "2026-06-01T10:00:00", type: "completed", notes: "Salz nachgefüllt", ref_no: 2 },
  { timestamp: "2026-07-01T10:00:00", type: "skipped", notes: "" },
];

function ctx(search: string): HistoryContext {
  return {
    lang: "en", hass: {} as never, filter: null, search, currencySymbol: "€",
    setFilter: () => undefined, setSearch: () => undefined, openEdit: () => undefined, taskRef: "8.3",
  };
}

function entriesFor(search: string): string[] {
  const t = { history: ENTRIES } as unknown as MaintenanceTask;
  const host = document.createElement("div");
  render(renderHistoryList(t, ctx(search)), host);
  return [...host.querySelectorAll(".history-entry")].map((n) => n.querySelector(".history-content > div:nth-child(3)")?.textContent?.trim() ?? "");
}

describe("history notes filter uses the tolerant matcher (bug audit 2026-09-12)", () => {
  it("matchesQuery folds diacritics / digraphs and ANDs the words in any order", () => {
    expect(matchesQuery("Spülung durchgeführt", "spuelung")).to.equal(true);
    expect(matchesQuery("Spülung durchgeführt", "durchgefuehrt spuelung")).to.equal(true);
    expect(matchesQuery("Spülung durchgeführt", "spuelung salz")).to.equal(false, "every word must hit");
    expect(matchesQuery("", "spuelung")).to.equal(false);
    expect(matchesQuery(null, "x")).to.equal(false);
    expect(matchesQuery("a-b", "-")).to.equal(true, "punctuation-only query falls back to a substring test");
  });

  it("finds 'Spülung durchgeführt' for 'spuelung' and for the words reordered", () => {
    expect(entriesFor("spuelung")).to.deep.equal(["Spülung durchgeführt, Filter gereinigt"]);
    expect(entriesFor("filter spulung")).to.deep.equal(["Spülung durchgeführt, Filter gereinigt"]);
    expect(entriesFor("SALZ")).to.deep.equal(["Salz nachgefüllt"]);
    expect(entriesFor("")).to.have.length(3);
  });

  it("keeps the #170 reference suffix path ('-2' finds completion 8.3-2)", () => {
    expect(entriesFor("-2")).to.deep.equal(["Salz nachgefüllt"]);
    expect(entriesFor("8.3-1")).to.deep.equal(["Spülung durchgeführt, Filter gereinigt"]);
  });
});

const REMOTE = {
  documents: [],
  history: [
    { entry_id: "e1", task_id: "t1", task_name: "Filter reinigen", object_name: "Spülmaschine", timestamp: "2026-05-01T10:00:00", type: "completed", snippet: "…Spülung durchgeführt…", score: 4 },
  ],
};

type PanelState = HTMLElement & { updateComplete: Promise<unknown>; _historySearch: string; _selectedTaskId: string | null; _activeTab: string; _showTask(entryId: string, taskId: string): void };

async function openPalette(el: PanelState, query: string) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
  await el.updateComplete;
  const input = sr(el).querySelector<HTMLInputElement>(".palette-input")!;
  input.value = query;
  input.dispatchEvent(new Event("input"));
  await new Promise((r) => setTimeout(r, 320));
  await el.updateComplete;
}

describe("the pre-filled history filter belongs to the palette's task only (bug audit 2026-09-12)", () => {
  beforeEach(() => { resetTaskSeq(); localStorage.clear(); localStorage.setItem("msp-overview-tab", "dashboard"); });
  afterEach(() => localStorage.clear());

  it("a history hit pre-fills the filter; opening another task clears it", async () => {
    const { el } = await mountPanel(
      [obj("e1", [task({ name: "Filter reinigen" }), task({ name: "Salz nachfüllen" })], "Spülmaschine")],
      { "maintenance_supporter/search": () => REMOTE },
    );
    const panel = el as unknown as PanelState;
    await openPalette(panel, "spuelung");
    const note = [...sr(el).querySelectorAll<HTMLElement>(".palette-item")].find((n) => /Spülung durchgeführt/.test(n.textContent || ""))!;
    expect(note, "history hit listed").to.exist;
    note.click();
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    expect(panel._selectedTaskId).to.equal("t1");
    expect(panel._activeTab).to.equal("history");
    expect(panel._historySearch).to.equal("spuelung");

    panel._showTask("e1", "t2");
    await el.updateComplete;
    expect(panel._selectedTaskId).to.equal("t2");
    expect(panel._historySearch, "filter does not leak into the next task").to.equal("");
  });
});
