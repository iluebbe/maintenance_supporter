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
});
