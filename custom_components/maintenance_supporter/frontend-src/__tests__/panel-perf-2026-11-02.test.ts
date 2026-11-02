/**
 * Real-click performance (2026-11-02). Measured on a 138-task home with the
 * CPU slowed to a mid-range phone's: most of a click went to work around it.
 *
 * - Home Assistant hands the panel a new `hass` on every state change in the
 *   home; each one redrew the whole panel and measured its list. A change
 *   of only `states` (the panel draws none of them) now redraws at most
 *   once a second, any other change at once, with the newest `hass`.
 * - The rows are computed once per change of what they read, and a row is
 *   drawn again only when it or what every row reads changed: a scroll step
 *   draws the rows it brings in.
 * - Intl formatters are built once per locale and options (a chart built
 *   thousands per render).
 * - The list search follows the box a moment after typing stops.
 */

import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";
import { HASS_STATES_REDRAW_MS, onlyStatesChanged } from "../helpers/hass-changes";
import { formatDateShort, formatDateTime, formatNumber, formatUnit, monthName, weekdayName } from "../styles";

type Panel = HTMLElement & {
  hass: Record<string, unknown>;
  updateComplete: Promise<unknown>;
  requestUpdate: () => void;
  updated: (changed: Map<string, unknown>) => void;
  _filterStatus: string;
  _virtStart: number;
  _rowsFiltered: (filterStatus: boolean, search?: boolean) => unknown[];
  _updateVirtualWindow: () => void;
};

const tick = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function mounted(): Promise<Panel> {
  const { el } = await mountPanel([
    obj("e1", [task({ name: "Clean the air filter", status: "overdue", days_until_due: -3 }), task({ name: "Annual service" })], "Heat pump"),
    obj("e2", [task({ name: "Descale", status: "due_soon", days_until_due: 4 })], "Washing machine"),
  ]);
  return el as unknown as Panel;
}

/** Count the panel's updates and what each changed. */
function watch(p: Panel): Array<string[]> {
  const seen: Array<string[]> = [];
  const orig = p.updated.bind(p);
  p.updated = (changed) => {
    seen.push([...changed.keys()].map(String));
    orig(changed);
  };
  return seen;
}

describe("perf 2026-11-02: which hass changes redraw", () => {
  it("only states changed, nothing else: the frequent case", () => {
    const states = { "sensor.a": { state: "1" } };
    const base = { states, areas: {}, user: { id: "u" }, language: "en" };
    expect(onlyStatesChanged(base, { ...base, states: { ...states } })).to.equal(true);
    expect(onlyStatesChanged(base, { ...base, states: { ...states }, areas: {} })).to.equal(false);
    // A copy with the same states is not such a change: it redraws as before.
    expect(onlyStatesChanged(base, { ...base })).to.equal(false);
    expect(onlyStatesChanged(base, base)).to.equal(false);
  });
});

describe("perf 2026-11-02: the panel and Home Assistant's state changes", () => {
  beforeEach(() => resetTaskSeq());

  it("a change of only states waits, then redraws once with the newest hass", async () => {
    const p = await mounted();
    await tick(HASS_STATES_REDRAW_MS + 50); // out of the first render's window
    const seen = watch(p);
    p.hass = { ...p.hass, states: { "sensor.a": { state: "1" } } };
    await p.updateComplete;
    // Drawn at once: the first change after a quiet second.
    expect(seen).to.have.length(1);
    p.hass = { ...p.hass, states: { "sensor.a": { state: "2" } } };
    await p.updateComplete;
    p.hass = { ...p.hass, states: { "sensor.a": { state: "3" } } };
    await p.updateComplete;
    expect(seen).to.have.length(1);
    await tick(HASS_STATES_REDRAW_MS + 100);
    await p.updateComplete;
    // One more draw for both, and it knows hass changed.
    expect(seen).to.have.length(2);
    expect(seen[1]).to.include("hass");
    expect((p.hass.states as Record<string, { state: string }>)["sensor.a"].state).to.equal("3");
  });

  it("any other change draws at once and takes the held hass along", async () => {
    const p = await mounted();
    await tick(HASS_STATES_REDRAW_MS + 50);
    const seen = watch(p);
    p.hass = { ...p.hass, states: { x: 1 } };
    await p.updateComplete;
    p.hass = { ...p.hass, states: { x: 2 } };
    await p.updateComplete;
    expect(seen).to.have.length(1);
    p._filterStatus = "overdue";
    await p.updateComplete;
    expect(seen).to.have.length(2);
    expect(seen[1]).to.include.members(["_filterStatus", "hass"]);
    // Nothing left to draw a second later: the held change went with it.
    await tick(HASS_STATES_REDRAW_MS + 100);
    expect(seen).to.have.length(2);
  });

  it("new areas or a new user draw at once", async () => {
    const p = await mounted();
    const seen = watch(p);
    p.hass = { ...p.hass, states: { x: 1 } };
    await p.updateComplete;
    p.hass = { ...p.hass, areas: { kitchen: { area_id: "kitchen", name: "Kitchen" } } };
    await p.updateComplete;
    expect(seen.length).to.be.greaterThan(0);
    expect(seen[seen.length - 1]).to.include("hass");
  });

  it("the rows are computed once per change of what they read", async () => {
    const p = await mounted();
    const first = p._rowsFiltered(true);
    expect(p._rowsFiltered(true)).to.equal(first);
    // A scroll step reads the same rows.
    p._virtStart = 1;
    await p.updateComplete;
    expect(p._rowsFiltered(true)).to.equal(first);
    p._filterStatus = "overdue";
    await p.updateComplete;
    const filtered = p._rowsFiltered(true);
    expect(filtered).not.to.equal(first);
    expect(filtered).to.have.length(1);
  });

  it("a redraw for states alone measures no list it already measured", async () => {
    const p = await mounted();
    await tick(HASS_STATES_REDRAW_MS + 50);
    let measured = 0;
    const orig = p._updateVirtualWindow.bind(p);
    p._updateVirtualWindow = () => { measured++; orig(); };
    p.hass = { ...p.hass, states: { y: 1 } };
    await p.updateComplete;
    expect(measured).to.equal(0);
    p._filterStatus = "due_soon";
    await p.updateComplete;
    expect(measured).to.equal(1);
    expect(sr(p).querySelectorAll(".task-row:not(.virt-sizer)").length).to.equal(1);
  });
});

describe("perf 2026-11-02: formatters built once, same words as before", () => {
  it("numbers, units, dates and names read as the native calls read them", () => {
    const d = new Date(Date.UTC(2026, 6, 3, 14, 5, 9));
    expect(formatNumber(1234.5, "de")).to.equal((1234.5).toLocaleString("de-DE", { maximumFractionDigits: 2 }));
    expect(formatNumber(1234.5, "de")).to.equal(formatNumber(1234.5, "de"));
    expect(formatUnit(3, "day", "en")).to.equal("3 days");
    expect(formatUnit(3, "day", "de")).to.equal("3 Tage");
    expect(monthName(6, "en")).to.equal("July");
    expect(weekdayName(0, "de")).to.equal("Montag");
    expect(formatDateShort(d, "en")).to.match(/Jul/);
    // With seconds for a trace step, without for everything else.
    expect(formatDateTime(d.toISOString(), "en", true)).to.match(/:09/);
    expect(formatDateTime(d.toISOString(), "en")).not.to.match(/:09/);
  });
});
