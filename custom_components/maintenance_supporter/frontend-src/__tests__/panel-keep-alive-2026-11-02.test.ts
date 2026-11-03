/** The lists are kept while another page is open, and the grouped list is
 *  windowed like the flat one (perf 2026-11-02, the round after the light
 *  rows):
 *   - Back from a task or object page built the whole overview again: the
 *     rows, the stats, the tab bar, the toolbar. It is kept now (Lit's cache)
 *     and comes back where it was scrolled; a jump to it starts at the top.
 *   - Today and Tasks keep theirs between tab switches; the calendar and the
 *     settings are built afresh, as they were, since they load on attach.
 *   - The document storage card counts again on each return.
 *   - Grouped by area, person, group or object, every row was drawn.
 */

import { expect } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";
import { computeWindow, sectionWindow } from "../helpers/virtual-window.js";

type PanelEl = HTMLElement & {
  updateComplete: Promise<unknown>;
  _showTask: (entryId: string, taskId: string) => void;
  _showObject: (entryId: string) => void;
  _showOverview: (back?: boolean) => void;
  _setOverviewTab: (tab: string) => void;
  _setGroupBy: (mode: string) => void;
  _view: string;
};

const STORAGE = { total_bytes: 0, dedup_savings_bytes: 0, file_count: 0, link_count: 0, document_count: 0, by_object: {} };

async function settle(el: PanelEl, rounds = 2) {
  for (let i = 0; i < rounds; i++) {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;
  }
}

const content = (el: HTMLElement) => sr(el).querySelector<HTMLElement>(".content")!;
const rowOf = (el: HTMLElement, name: string) =>
  [...sr(el).querySelectorAll<HTMLElement>(".task-row:not(.virt-sizer)")]
    .find((r) => r.querySelector(".cell.task-name")?.textContent?.trim() === name);
// The warm-up's hidden hosts, direct children of the panel's shadow root
// (`:scope` matches nothing in a shadow root's querySelectorAll).
const hiddenHosts = (el: HTMLElement) =>
  [...sr(el).children].filter((c): c is HTMLDivElement => c instanceof HTMLDivElement && c.hidden === true);
const back = (view: string) =>
  window.dispatchEvent(new PopStateEvent("popstate", { state: { msp_view: view, msp_entry: null, msp_task: null, msp_area: null } }));

async function scrollTo(el: PanelEl, top: number) {
  content(el).scrollTop = top;
  content(el).dispatchEvent(new Event("scroll"));
  await settle(el);
}

async function mountMany(n = 150) {
  const many = Array.from({ length: n }, (_, i) => task({ name: `Bulk ${String(i).padStart(3, "0")}`, days_until_due: i + 1 }));
  const r = await mountPanel([obj("e1", many)], { "maintenance_supporter/documents/storage": () => STORAGE });
  const el = r.el as PanelEl;
  await settle(el);
  return { el, sent: r.sent };
}

describe("perf 2026-11-02: the lists are kept", () => {
  beforeEach(async () => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
    await setViewport({ width: 1400, height: 900 });
  });
  afterEach(async () => {
    localStorage.clear();
    await setViewport({ width: 800, height: 600 });
  });

  it("Back from a task page puts the same rows back, scrolled where they were", async () => {
    const { el } = await mountMany();
    await scrollTo(el, 1500);
    const top = content(el).scrollTop;
    expect(top, "the list scrolled").to.be.greaterThan(1000);
    const row = [...sr(el).querySelectorAll<HTMLElement>(".task-row:not(.virt-sizer)")]
      .find((r) => r.getBoundingClientRect().top > content(el).getBoundingClientRect().top + 20)!;
    const name = row.querySelector(".cell.task-name")!.textContent!.trim();

    el._showTask("e1", "t1");
    await settle(el);
    expect(sr(el).querySelector(".task-table"), "the list left the page").to.equal(null);
    expect(content(el).scrollTop, "the task page starts at the top").to.equal(0);

    back("overview");
    await settle(el);
    expect(content(el).scrollTop, "where the list was left").to.equal(top);
    expect(rowOf(el, name) === row, `${name}: the same element`).to.equal(true);
    expect(row.isConnected, "on the page again").to.equal(true);
  });

  it("the page's back arrow returns there too; the breadcrumb starts at the top", async () => {
    const { el } = await mountMany();
    await scrollTo(el, 1200);
    const top = content(el).scrollTop;

    el._showObject("e1");
    await settle(el);
    el._showOverview(true);
    await settle(el);
    expect(content(el).scrollTop, "back arrow").to.equal(top);

    el._showObject("e1");
    await settle(el);
    el._showOverview();
    await settle(el);
    expect(content(el).scrollTop, "breadcrumb").to.equal(0);
  });

  it("Today and Tasks keep their rows between tab switches", async () => {
    const { el } = await mountMany(20);
    const row = rowOf(el, "Bulk 003")!;
    el._setOverviewTab("today");
    await settle(el);
    expect(rowOf(el, "Bulk 003"), "not on Today").to.equal(undefined);
    el._setOverviewTab("dashboard");
    await settle(el);
    expect(rowOf(el, "Bulk 003") === row, "the same element").to.equal(true);
  });

  it("the calendar is built afresh on a return to the overview", async () => {
    const { el } = await mountMany(5);
    el._setOverviewTab("calendar");
    await settle(el);
    const before = sr(el).querySelector("maintenance-supporter-calendar-card");
    expect(before !== null, "the calendar").to.equal(true);
    el._showTask("e1", "t1");
    await settle(el);
    back("overview");
    await settle(el);
    const after = sr(el).querySelector("maintenance-supporter-calendar-card");
    expect(after !== null && after !== before, "a new calendar").to.equal(true);
  });

  it("the storage card counts again on each return", async () => {
    const { el, sent } = await mountMany(5);
    const count = () => sent.filter((m) => (m as { type?: string }).type === "maintenance_supporter/documents/storage").length;
    const first = count();
    expect(first, "loaded once").to.equal(1);
    el._showTask("e1", "t1");
    await settle(el);
    back("overview");
    await settle(el);
    expect(count(), "loaded again").to.equal(first + 1);
  });
});

describe("perf 2026-11-02: the task page is drawn once while idle", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => localStorage.clear());

  it("hidden, out of the panel's reach, loading nothing, then gone", async () => {
    const r = await mountPanel([obj("e1", [task({ name: "Filter" })])]);
    const el = r.el as PanelEl & { _warmUpTaskPage: () => void; _warmedUp: boolean };
    // The idle callback may have run during the mount already: once more.
    el._warmedUp = false;
    const before = r.sent.length;
    el._warmUpTaskPage();
    const host = sr(el).firstElementChild as HTMLElement;
    expect(host.hidden, "a hidden host first in the panel").to.equal(true);
    const view = host.shadowRoot!.querySelector("maintenance-task-detail-view") as HTMLElement & { updateComplete: Promise<unknown> };
    await view.updateComplete;
    expect(view.querySelector(".task-header") !== null, "the page drew").to.equal(true);
    expect(sr(el).querySelector(".task-header"), "no query of the panel finds it").to.equal(null);
    await new Promise((res) => requestAnimationFrame(() => res(null)));
    await new Promise((res) => setTimeout(res, 20));
    expect(host.isConnected, "dropped after a frame").to.equal(false);
    expect(r.sent.slice(before).map((m) => (m as { type?: string }).type), "nothing loaded").to.deep.equal([]);
    expect(el._warmedUp, "once per load").to.equal(true);
  });

  it("not when a task page is already on screen", async () => {
    const r = await mountPanel([obj("e1", [task({ name: "Filter" })])]);
    const el = r.el as PanelEl & { _warmUpTaskPage: () => void; _warmedUp: boolean };
    el._showTask("e1", "t1");
    await settle(el);
    el._warmedUp = false;
    el._warmUpTaskPage();
    expect(hiddenHosts(el).length, "no hidden copy").to.equal(0);
    expect(el._warmedUp, "and none later").to.equal(true);
  });
});

describe("perf 2026-11-02: the object page is drawn once while idle", () => {
  type WarmEl = PanelEl & { _warmUpObjectPage: () => void; _scheduleWarmUp: () => void; _objectWarmedUp: boolean; _warmedUp: boolean };
  type Section = HTMLElement & { entryId: string; updateComplete: Promise<unknown> };
  const SECTIONS = ["maintenance-documents-section", "maintenance-parts-section", "maintenance-object-history-section"];
  // Tasks only, and tasks with history and a part: the warm-up takes the second.
  const objects = () => [
    obj("e1", [task({ name: "Plain" })], "Plain object"),
    { ...obj("e2", [task({ name: "Filter", times_performed: 2, history: [{ type: "completed", timestamp: "2026-10-01T08:00:00" }] })], "Full object"),
      parts: [{ id: "p1", name: "Filter cartridge", stock: 2 }], document_count: 1 },
  ];
  const frame = async () => {
    await new Promise((res) => requestAnimationFrame(() => res(null)));
    await new Promise((res) => setTimeout(res, 20));
  };

  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => localStorage.clear());

  it("hidden, out of the panel's reach, its sections loading nothing, then gone", async () => {
    const r = await mountPanel(objects());
    const el = r.el as WarmEl;
    await settle(el);
    el._objectWarmedUp = false;
    const before = r.sent.length;
    el._warmUpObjectPage();
    const host = sr(el).firstElementChild as HTMLElement;
    expect(host.hidden, "a hidden host first in the panel").to.equal(true);
    const box = host.shadowRoot!;
    expect(box.querySelector(".detail-section h2")?.textContent, "the fullest object's page").to.contain("Full object");
    const sections = SECTIONS.map((tag) => box.querySelector(tag) as Section | null);
    expect(sections.map((s) => s !== null), "every section drew").to.deep.equal([true, true, true]);
    await Promise.all(sections.map((s) => s!.updateComplete));
    expect(sections.map((s) => s!.entryId), "no object id").to.deep.equal(["", "", ""]);
    expect(sr(el).querySelector(".detail-section"), "no query of the panel finds it").to.equal(null);
    await frame();
    expect(host.isConnected, "dropped after a frame").to.equal(false);
    expect(sections.map((s) => s!.isConnected), "the sections went with it").to.deep.equal([false, false, false]);
    expect(r.sent.slice(before).map((m) => (m as { type?: string }).type), "nothing loaded").to.deep.equal([]);
    expect(el._objectWarmedUp, "once per load").to.equal(true);
  });

  it("not after an object page was drawn for real", async () => {
    const r = await mountPanel(objects());
    const el = r.el as WarmEl;
    await settle(el);
    // The idle warm-up may have run during the mount already.
    el._objectWarmedUp = false;
    el._showObject("e1");
    await settle(el);
    el._showOverview(true);
    await settle(el);
    expect(el._objectWarmedUp, "the real page counts").to.equal(true);
    el._warmUpObjectPage();
    expect(hiddenHosts(el).length, "no hidden copy").to.equal(0);
  });

  it("the task page and the object page in idle slices of their own", async () => {
    const r = await mountPanel(objects());
    const el = r.el as WarmEl;
    await settle(el);
    const queued: (() => void)[] = [];
    const w = window as unknown as { requestIdleCallback?: unknown };
    const saved = w.requestIdleCallback;
    w.requestIdleCallback = (cb: () => void) => { queued.push(cb); };
    try {
      el._warmedUp = false;
      el._objectWarmedUp = false;
      el._scheduleWarmUp();
      expect(queued.length, "one slice asked for").to.equal(1);
      queued.shift()!();
      const hosts = () => hiddenHosts(el);
      expect(hosts().map((h) => h.shadowRoot!.firstElementChild?.localName), "the task page first").to.deep.equal(["maintenance-task-detail-view"]);
      expect(queued.length, "the object page in the next slice").to.equal(1);
      await frame();
      queued.shift()!();
      expect(hosts().some((h) => h.shadowRoot!.querySelector(".detail-section") !== null), "then the object page").to.equal(true);
      expect(queued.length, "and nothing more").to.equal(0);
    } finally {
      w.requestIdleCallback = saved;
    }
  });
});

describe("perf 2026-11-02: the grouped list is windowed", () => {
  beforeEach(async () => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
    await setViewport({ width: 1400, height: 900 });
  });
  afterEach(async () => {
    localStorage.clear();
    await setViewport({ width: 800, height: 600 });
  });

  it("sectionWindow: a section off screen draws none, one on screen the flat slice", () => {
    const offsets = Array.from({ length: 51 }, (_, i) => i * 50);
    const base = { viewportHeight: 500, offsets, total: 50 };
    expect(sectionWindow({ ...base, scrollTop: 0, listTop: 5000 }), "far below").to.deep.equal([0, 0]);
    expect(sectionWindow({ ...base, scrollTop: 9000, listTop: 0 }), "far above").to.deep.equal([0, 0]);
    const w = computeWindow({ ...base, scrollTop: 800, listTop: 300 });
    expect(sectionWindow({ ...base, scrollTop: 800, listTop: 300 }), "on screen").to.deep.equal([w.start, w.end]);
    expect(sectionWindow({ ...base, total: 0, offsets: [0], scrollTop: 0, listTop: 0 }), "empty").to.deep.equal([0, 0]);
  });

  it("draws the rows on screen only, and every row once while scrolling through", async () => {
    const objects = ["Alpha", "Bravo", "Charlie"].map((name, k) =>
      obj(`e${k}`, Array.from({ length: 50 }, (_, i) => task({ name: `${name} ${String(i).padStart(2, "0")}`, days_until_due: i + 1 })), name));
    const r = await mountPanel(objects, { "maintenance_supporter/documents/storage": () => STORAGE });
    const el = r.el as PanelEl;
    el._setGroupBy("object");
    await settle(el, 3);
    const table = sr(el).querySelector(".task-table.grouped");
    expect(table?.classList.contains("virtual"), "windowed").to.equal(true);
    const drawn = () => [...sr(el).querySelectorAll<HTMLElement>(".group-rows .task-row")];
    expect(drawn().length, "not all 150 rows").to.be.below(80);
    const sections = [...sr(el).querySelectorAll<HTMLElement>(".group-section")];
    expect(sections.length, "every section card").to.equal(3);
    expect(sections[2].querySelectorAll(".task-row").length, "the last section, off screen, draws none").to.equal(0);

    const seen = new Set<string>();
    const box = () => content(el).getBoundingClientRect();
    for (let top = 0, step = 0; step < 60; top += 350, step++) {
      await scrollTo(el, top);
      for (const row of drawn()) seen.add(row.querySelector(".cell.task-name")!.textContent!.trim());
      // Wherever we look there is a row, a header or the gap between
      // cards, never a spacer standing in for rows that should be drawn.
      const b = box();
      for (const y of [b.top + 10, b.top + b.height / 2, b.bottom - 10]) {
        const hit = sr(el).elementFromPoint(b.left + 300, y);
        expect(hit?.classList.contains("virt-spacer"), `step ${step}, y ${Math.round(y - b.top)}: a spacer on screen`).to.equal(false);
      }
      if (content(el).scrollTop + content(el).clientHeight >= content(el).scrollHeight - 1) break;
    }
    expect(seen.size, "every row was drawn").to.equal(150);
    // Each section's rows in their order.
    const charlie = drawn().map((r) => r.querySelector(".cell.task-name")!.textContent!.trim()).filter((n) => n.startsWith("Charlie"));
    expect(charlie.length, "the end of the list is on screen").to.be.above(0);
    expect(charlie, "Charlie's rows in order").to.deep.equal([...charlie].sort());
  });

  it("below the threshold every row is drawn, as before", async () => {
    const objects = ["Alpha", "Bravo"].map((name, k) =>
      obj(`e${k}`, Array.from({ length: 10 }, (_, i) => task({ name: `${name} ${i}`, days_until_due: i + 1 })), name));
    const r = await mountPanel(objects);
    const el = r.el as PanelEl;
    el._setGroupBy("object");
    await settle(el);
    expect(sr(el).querySelector(".task-table.grouped")?.classList.contains("virtual"), "not windowed").to.equal(false);
    expect(sr(el).querySelectorAll(".group-rows .task-row").length).to.equal(20);
    expect(sr(el).querySelectorAll(".group-section-header ha-svg-icon").length, "light header glyphs").to.equal(2);
  });
});
