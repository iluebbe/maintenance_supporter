/**
 * #150: (1) a task with allow_skip=false renders NO skip action in the
 * dashboard rows — the server refuses anyway (choke point), the UI just
 * doesn't offer it; (2) the dashboard can group by object/device.
 */

import { expect, waitUntil } from "@open-wc/testing";
import { DEFAULT_SETTINGS_RESPONSE } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task } from "./_panel-utils.js";

type PanelPriv = HTMLElement & {
  updateComplete: Promise<unknown>;
  _groupByMode: string;
};

async function mount(objects: ReturnType<typeof obj>[]) {
  const r = await mountPanel(objects, {
    "maintenance_supporter/settings": () => DEFAULT_SETTINGS_RESPONSE,
  });
  const el = r.el as PanelPriv;
  el.style.width = "1200px";
  await new Promise((res) => setTimeout(res, 60));
  await el.updateComplete;
  return el;
}

describe("skip lock + group-by object (#150)", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });

  it("allow_skip=false hides the Skip action in the row, Complete stays", async () => {
    const el = await mount([obj("e1", [task({ status: "overdue", allow_skip: false })])]);
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".task-row .row-actions"), "actions rendered");
    const actions = sr.querySelector(".task-row .row-actions")!;
    expect(actions.textContent).to.contain("Complete");
    expect(actions.textContent).to.not.contain("Skip");
    expect(actions.querySelector(".btn-skip")).to.equal(null);
  });

  it("default (no flag) keeps the Skip action", async () => {
    const el = await mount([obj("e1", [task({ status: "overdue" })])]);
    const sr = el.shadowRoot!;
    await waitUntil(() => !!sr.querySelector(".task-row .row-actions"), "actions rendered");
    expect(sr.querySelector(".task-row .row-actions")!.textContent).to.contain("Skip");
  });

  it("group-by object renders one section per object", async () => {
    const el = await mount([
      obj("e1", [task({ status: "overdue" }), task({ status: "ok" })]),
      obj("e2", [task({ status: "due_soon" })], "Espresso Machine"),
    ]);
    el._groupByMode = "object";
    await el.updateComplete;
    const sr = el.shadowRoot!;
    await waitUntil(() => sr.querySelectorAll(".group-section").length === 2, "two object sections");
    const sections = [...sr.querySelectorAll(".group-section")];
    // 2 + 1 rows, each under its object's section.
    expect(sections[0].querySelectorAll(".task-row").length + sections[1].querySelectorAll(".task-row").length).to.equal(3);
    const headers = sections.map((s) => s.querySelector(".group-section-header span")!.textContent);
    expect(new Set(headers).size).to.equal(2);
  });

  it("group sections share ONE set of column tracks: task names align across sections", async () => {
    // Section A carries "Overdue" + "OK" badges, section B only "OK" — with
    // per-section tables B's content-sized badge column was narrower and
    // its names started further left (2026-09-02 report: "unruhig").
    const el = await mount([
      obj("e1", [task({ status: "overdue" }), task({ status: "ok" })], "Espresso Machine"),
      obj("e2", [task({ status: "ok" }), task({ status: "ok" })], "Bicycle"),
    ]);
    el._groupByMode = "object";
    await el.updateComplete;
    const sr = el.shadowRoot!;
    await waitUntil(() => sr.querySelectorAll(".group-section .task-row").length === 4, "four grouped rows");
    const lefts = [...sr.querySelectorAll(".group-section .task-row .cell.task-name")].map(
      (c) => Math.round(c.getBoundingClientRect().left),
    );
    expect(new Set(lefts).size, `task-name x per row: ${lefts.join(",")}`).to.equal(1);
    const dues = [...sr.querySelectorAll(".group-section .task-row .due-cell")].map(
      (c) => Math.round(c.getBoundingClientRect().left),
    );
    expect(new Set(dues).size, `due x per row: ${dues.join(",")}`).to.equal(1);
  });

  it("section headers toggle their rows (div-based disclosure, keyboard too)", async () => {
    const el = await mount([
      obj("e1", [task({ status: "overdue" })], "Espresso Machine"),
      obj("e2", [task({ status: "ok" })], "Bicycle"),
    ]);
    el._groupByMode = "object";
    await el.updateComplete;
    const sr = el.shadowRoot!;
    await waitUntil(() => sr.querySelectorAll(".group-section").length === 2, "two sections");
    const first = sr.querySelector(".group-section")!;
    const header = first.querySelector<HTMLElement>(".group-section-header")!;
    expect(first.hasAttribute("open")).to.equal(true);
    expect(header.getAttribute("aria-expanded")).to.equal("true");
    header.click();
    await el.updateComplete;
    expect(first.hasAttribute("open"), "collapsed after click").to.equal(false);
    expect(first.querySelectorAll(".task-row").length).to.equal(0);
    expect(sr.querySelectorAll(".group-section .task-row").length, "other section untouched").to.equal(1);
    header.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await el.updateComplete;
    expect(first.hasAttribute("open"), "re-opened via keyboard").to.equal(true);
    expect(first.querySelectorAll(".task-row").length).to.equal(1);
  });
});
