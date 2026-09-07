/**
 * Reference numbers in the panel (#170): formatting/parsing, the chips on
 * the object header, task header and history entries, the objects-table
 * column, the history notes filter, and the global search answering "8",
 * "8.3" and "8.3-2".
 */

import { expect } from "@open-wc/testing";
import { entryRef, objectRef, parseRef, taskRef } from "../helpers/reference.js";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";

describe("reference helper (#170)", () => {
  it("formats the three levels and stays silent without numbers", () => {
    const o = { ref_no: 8 }, t = { ref_no: 3 }, e = { ref_no: 2 };
    expect(objectRef(o)).to.equal("8");
    expect(taskRef(o, t)).to.equal("8.3");
    expect(entryRef(o, t, e)).to.equal("8.3-2");
    expect(objectRef({ ref_no: null })).to.equal(null);
    expect(taskRef({ ref_no: 8 }, { ref_no: 0 })).to.equal(null);
    expect(entryRef({ ref_no: 8 }, { ref_no: 3 }, {})).to.equal(null);
    expect(entryRef(null, t, e)).to.equal(null);
  });

  it("parses what a user types", () => {
    expect(parseRef("8")).to.deep.equal({ object: 8, task: null, entry: null });
    expect(parseRef(" 8.3 ")).to.deep.equal({ object: 8, task: 3, entry: null });
    expect(parseRef("8.3-2")).to.deep.equal({ object: 8, task: 3, entry: 2 });
    expect(parseRef("8-2")).to.equal(null);
    expect(parseRef("filter")).to.equal(null);
  });
});

describe("reference chips and search (#170)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => localStorage.clear());

  function fixtures() {
    const dish = obj("e1", [
      task({ name: "Filter reinigen", ref_no: 3, history: [
        { timestamp: "2026-05-01T10:00:00", type: "completed", ref_no: 2, notes: "Sieb" },
        { timestamp: "2026-04-01T10:00:00", type: "skipped", notes: "later" },
      ] }),
      task({ name: "Salz nachfüllen", ref_no: 1 }),
    ], "Spülmaschine");
    (dish.object as Record<string, unknown>).ref_no = 8;
    const pump = obj("e2", [task({ name: "Pumpe prüfen", ref_no: 1 })], "Pool Pump");
    (pump.object as Record<string, unknown>).ref_no = 9;
    return [dish, pump];
  }

  const open = async (el: HTMLElement & { updateComplete: Promise<unknown> }, q: string) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
    await el.updateComplete;
    const input = sr(el).querySelector<HTMLInputElement>(".palette-input")!;
    input.value = q;
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
  };
  const labels = (el: HTMLElement) => [...sr(el).querySelectorAll(".palette-results .palette-label")].map((n) => n.textContent!.trim());
  const chips = (el: HTMLElement) => [...sr(el).querySelectorAll(".palette-results .ref-chip")].map((n) => n.textContent!.trim());

  it("the object header, the task header and the history entries carry their chips", async () => {
    const { el } = await mountPanel(fixtures());
    const panel = el as unknown as { _showObject: (e: string) => void; _showTask: (e: string, t: string) => void; _activeTab: string };
    panel._showObject("e1");
    await el.updateComplete;
    expect(sr(el).querySelector(".detail-header h2 .ref-chip")!.textContent!.trim()).to.equal("#8");
    panel._showTask("e1", "t1");
    await el.updateComplete;
    expect(sr(el).querySelector(".task-header .ref-chip")!.textContent!.trim()).to.equal("#8.3");
    panel._activeTab = "history";
    await el.updateComplete;
    const entryChips = [...sr(el).querySelectorAll(".history-entry .ref-chip")].map((n) => n.textContent!.trim());
    expect(entryChips, "only the completion is numbered").to.deep.equal(["#8.3-2"]);
    // The notes filter finds an entry by its number.
    (el as unknown as { _historySearch: string })._historySearch = "8.3-2";
    await el.updateComplete;
    expect(sr(el).querySelectorAll(".history-entry").length).to.equal(1);
  });

  it("'8' lists object 8 and its tasks; '8.3' the one task; '8.3-2' the completion from the server", async () => {
    const { el } = await mountPanel(fixtures(), {
      "maintenance_supporter/search": (msg: Record<string, unknown>) => (
        msg.query === "8.3-2"
          ? { documents: [], history: [{ entry_id: "e1", task_id: "t1", task_name: "Filter reinigen", object_name: "Spülmaschine", timestamp: "2026-05-01T10:00:00", type: "completed", snippet: "Sieb", score: 1000, ref: "8.3-2" }] }
          : { documents: [], history: [] }),
    });
    await open(el, "8");
    expect(labels(el)).to.deep.equal(["Spülmaschine", "Filter reinigen", "Salz nachfüllen"]);
    expect(chips(el)).to.deep.equal(["#8", "#8.3", "#8.1"]);
    expect(labels(el)).to.not.include("Pool Pump");

    const input = sr(el).querySelector<HTMLInputElement>(".palette-input")!;
    input.value = "8.3";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(labels(el)).to.deep.equal(["Filter reinigen"]);

    input.value = "8.3-2";
    input.dispatchEvent(new Event("input"));
    await new Promise((r) => setTimeout(r, 320));
    await el.updateComplete;
    expect(labels(el)).to.deep.equal(["Filter reinigen", "Filter reinigen"]);
    expect(chips(el)).to.deep.equal(["#8.3", "#8.3-2"]);
    const hit = [...sr(el).querySelectorAll<HTMLElement>(".palette-item")].at(-1)!;
    hit.click();
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
    const panel = el as unknown as { _view: string; _activeTab: string; _historySearch: string };
    expect(panel._view).to.equal("task");
    expect(panel._activeTab).to.equal("history");
    expect(panel._historySearch).to.equal("8.3-2");
  });

  it("a number nothing carries falls through to text matching", async () => {
    const { el } = await mountPanel(fixtures(), { "maintenance_supporter/search": () => ({ documents: [], history: [] }) });
    await open(el, "42");
    expect(sr(el).querySelector(".palette-empty, .palette-waiting")).to.exist;
    expect(labels(el)).to.deep.equal([]);
  });

  it("the objects table offers a reference column", async () => {
    const { el } = await mountPanel(fixtures());
    const panel = el as unknown as { _showAllObjects: () => void; _objectViewMode: string; _objectsTableColumns: string[] };
    panel._showAllObjects();
    panel._objectViewMode = "table";
    panel._objectsTableColumns = ["name", "ref_no", "task_count"];
    await el.updateComplete;
    const cells = [...sr(el).querySelectorAll(".oc-ref_no")].map((c) => c.textContent!.trim());
    expect(cells).to.include("#8");
    expect(cells).to.include("#9");
  });
});
