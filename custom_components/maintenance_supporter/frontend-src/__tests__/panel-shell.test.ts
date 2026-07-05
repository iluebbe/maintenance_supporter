import { expect } from "@open-wc/testing";
import { mountPanel, obj, resetTaskSeq, sr, task } from "./_panel-utils.js";
describe("panel shell", () => {
  beforeEach(() => {
    resetTaskSeq();
    localStorage.clear();
    localStorage.setItem("msp-overview-tab", "dashboard");
  });
  afterEach(() => localStorage.clear());

  it("bulk select-all covers visible rows only and bulk Complete sends one call per selection", async () => {
    const { el, sent } = await mountPanel([
      obj("e1", [
        task({ name: "Active A" }),
        task({ name: "Active B" }),
        task({ name: "Active C" }),
        task({ name: "Gone", archived: true }),
      ]),
    ]);

    // Enter bulk mode.
    sr(el).querySelector<HTMLElement>(".bulk-toggle")!.click();
    await el.updateComplete;
    expect(sr(el).querySelector(".bulk-bar"), "bulk bar visible").to.exist;

    // Select all → exactly the 3 visible (non-archived) rows get checkboxes.
    sr(el).querySelector<HTMLInputElement>(".bulk-selectall input")!.click();
    await el.updateComplete;
    const checked = [...sr(el).querySelectorAll<HTMLInputElement>(".bulk-check input")]
      .filter((c) => c.checked);
    expect(checked.length).to.equal(3);

    // Bulk Complete → one task/complete per selected task, none for archived.
    const completeBtn = sr(el).querySelector<HTMLElement>(".bulk-actions ha-button")!;
    completeBtn.click();
    await new Promise((r) => setTimeout(r, 40));
    await el.updateComplete;

    const completes = sent.filter((m) => m.type === "maintenance_supporter/task/complete");
    expect(completes.length).to.equal(3);
    expect(new Set(completes.map((m) => m.task_id))).to.deep.equal(
      new Set(["t1", "t2", "t3"]),
    );
    // Bulk mode exits after the action.
    expect(sr(el).querySelector(".bulk-bar")).to.be.null;
  });

  it("bulk Archive sends task/archive for the manually selected rows only", async () => {
    const { el, sent } = await mountPanel([
      obj("e1", [task({ name: "One" }), task({ name: "Two" }), task({ name: "Three" })]),
    ]);

    sr(el).querySelector<HTMLElement>(".bulk-toggle")!.click();
    await el.updateComplete;

    // Tick rows 1 and 3 via their row checkboxes.
    const boxes = [...sr(el).querySelectorAll<HTMLInputElement>(".bulk-check input")];
    boxes[0].click();
    boxes[2].click();
    await el.updateComplete;

    // Second bulk action button is Archive.
    const actions = [...sr(el).querySelectorAll<HTMLElement>(".bulk-actions ha-button")];
    actions[1].click();
    await new Promise((r) => setTimeout(r, 40));
    await el.updateComplete;

    const archives = sent.filter((m) => m.type === "maintenance_supporter/task/archive");
    expect(archives.length).to.equal(2);
    expect(new Set(archives.map((m) => m.task_id))).to.deep.equal(new Set(["t1", "t3"]));
    expect(sent.filter((m) => m.type === "maintenance_supporter/task/complete").length)
      .to.equal(0);
  });

  it("'/' opens the command palette, filters, and navigates to the task", async () => {
    const { el } = await mountPanel([
      obj("e1", [task({ name: "Filter Wechsel" }), task({ name: "Pumpe prüfen" })]),
    ]);

    // Ctrl+K must NOT open it — that's HA's own global-search hotkey and the
    // panel used to shadow it (changed in 2.18.1).
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
    await el.updateComplete;
    expect(sr(el).querySelector(".palette-input"), "Ctrl+K stays HA's").to.be.null;

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
    await el.updateComplete;
    const input = sr(el).querySelector<HTMLInputElement>(".palette-input");
    expect(input, "palette opened").to.exist;

    input!.value = "Filter";
    input!.dispatchEvent(new Event("input"));
    await el.updateComplete;

    const results = [...sr(el).querySelectorAll(".palette-results .palette-label")]
      .map((r) => r.textContent?.trim());
    expect(results).to.include("Filter Wechsel");
    expect(results).to.not.include("Pumpe prüfen");

    // Click the task result → task detail renders.
    const hit = [...sr(el).querySelectorAll<HTMLElement>(".palette-results > *")]
      .find((r) => /Filter Wechsel/.test(r.textContent || ""))!;
    hit.click();
    await new Promise((r) => setTimeout(r, 20));
    await el.updateComplete;
    expect(sr(el).querySelector(".palette-input"), "palette closed").to.be.null;
    expect(sr(el).querySelector(".task-header"), "task detail rendered").to.exist;
    expect(sr(el).querySelector(".task-name-breadcrumb")!.textContent)
      .to.include("Filter Wechsel");
  });

  it("'/' while typing in a text field does not open the palette", async () => {
    const { el } = await mountPanel([
      obj("e1", [task({ name: "Filter Wechsel" })]),
    ]);
    const field = document.createElement("input");
    document.body.appendChild(field);
    try {
      field.dispatchEvent(
        new KeyboardEvent("keydown", { key: "/", bubbles: true, composed: true }),
      );
      await el.updateComplete;
      expect(sr(el).querySelector(".palette-input")).to.be.null;
    } finally {
      field.remove();
    }
  });

  it("Today view buckets overdue / due-today / this-week and hides later tasks", async () => {
    localStorage.setItem("msp-overview-tab", "today");
    const { el } = await mountPanel([
      obj("e1", [
        task({ name: "Late", status: "overdue", days_until_due: -3 }),
        task({ name: "Now", status: "due_soon", days_until_due: 0 }),
        task({ name: "Soon", status: "due_soon", days_until_due: 3 }),
        task({ name: "Later", status: "ok", days_until_due: 20 }),
      ]),
    ]);

    const view = sr(el).querySelector(".today-view");
    expect(view, "today view rendered").to.exist;
    const sections = [...sr(el).querySelectorAll(".today-section")];
    const byHeader = (re: RegExp) =>
      sections.find((s) => re.test(s.querySelector(".today-section-header")!.textContent || ""));

    const textOf = (s: Element | undefined) =>
      [...(s?.querySelectorAll(".today-task") || [])].map((t2) => t2.textContent?.trim());

    const all = sections.flatMap((s) => textOf(s));
    expect(all).to.include("Late");
    expect(all).to.include("Now");
    expect(all).to.include("Soon");
    expect(all).to.not.include("Later");
    // Overdue section leads with the late task.
    const overdueSection = byHeader(/overdue|überfällig/i);
    expect(textOf(overdueSection)).to.include("Late");
  });

  it("virtualizes the table above the threshold and moves the window on scroll", async () => {
    const many = Array.from({ length: 150 }, (_, i) =>
      task({ name: `Bulk ${String(i).padStart(3, "0")}`, days_until_due: (i % 40) + 1 }),
    );
    const { el } = await mountPanel([obj("e1", many)]);

    const table = sr(el).querySelector(".task-table");
    expect(table, "table rendered").to.exist;
    expect(table!.classList.contains("virtual"), "virtual mode active").to.be.true;

    const domRows = () =>
      [...sr(el).querySelectorAll(".task-table .task-row:not(.virt-sizer)")];
    expect(domRows().length).to.be.lessThan(120);
    expect(domRows().length).to.be.greaterThan(5);

    // Scroll the content container → the window shifts and a top spacer grows.
    const content = sr(el).querySelector<HTMLElement>(".content")!;
    content.scrollTop = 3000;
    content.dispatchEvent(new Event("scroll"));
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    await new Promise((r) => setTimeout(r, 30));
    await el.updateComplete;

    const spacer = sr(el).querySelector<HTMLElement>(".task-table .virt-spacer");
    expect(spacer, "top spacer present after scroll").to.exist;
    expect(parseInt(spacer!.style.height, 10)).to.be.greaterThan(0);
    const firstName = domRows()[0]?.querySelector(".task-name")?.textContent?.trim();
    expect(firstName).to.not.equal("Bulk 000");
  });
});
