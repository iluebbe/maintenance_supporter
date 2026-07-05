/**
 * Panel-shell behaviour tests (audit gaps #2, #6, #7, #8).
 *
 * First tests that mount the full <maintenance-supporter-panel> with a mock
 * hass. Covers the v2.15.0 shell features that had zero coverage:
 *  - bulk select: select-all covers exactly the visible (non-archived) rows;
 *    bulk Complete/Archive send one WS call per SELECTED task and exit bulk
 *    mode (destructive multi-item money path)
 *  - command palette: Ctrl+K opens, query filters, result click navigates
 *  - Today view: overdue / due-today / this-week bucketing
 *  - virtualized table: >=120 rows switch to windowed rendering (partial DOM
 *    + spacers), scrolling moves the window
 */

import { expect, fixture, html } from "@open-wc/testing";
import "../maintenance-panel.js";
import { createMockHass } from "./_test-utils.js";

let taskSeq = 0;

function task(over: Record<string, unknown> = {}) {
  taskSeq++;
  return {
    id: `t${taskSeq}`,
    name: `Task ${String(taskSeq).padStart(3, "0")}`,
    type: "custom",
    schedule_type: "time_based",
    interval_days: 30,
    warning_days: 7,
    status: "ok",
    days_until_due: 10,
    next_due: "2026-07-15",
    last_performed: null,
    trigger_active: false,
    trigger_current_value: null,
    trigger_config: null,
    times_performed: 0,
    total_cost: 0,
    average_duration: null,
    history: [],
    checklist: [],
    labels: [],
    priority: "normal",
    enabled: true,
    archived: false,
    is_done: false,
    responsible_user_id: null,
    nfc_tag_id: null,
    entity_slug: null,
    ...over,
  };
}

function obj(entryId: string, tasks: unknown[], name = "Pool Pump") {
  return {
    entry_id: entryId,
    object_id: `obj_${entryId}`,
    object: {
      id: `obj_${entryId}`, name, area_id: null, manufacturer: null,
      model: null, serial_number: null, task_ids: [],
    },
    tasks,
    document_count: 0,
  };
}

async function mountPanel(objects: unknown[]) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/objects": () => ({ objects }),
      "maintenance_supporter/statistics": () => ({
        total_objects: objects.length, total_tasks: 0,
        overdue: 0, due_soon: 0, triggered: 0, ok: 0,
      }),
      "maintenance_supporter/budget_status": () => ({}),
      "maintenance_supporter/groups": () => ({ groups: {} }),
      "maintenance_supporter/documents/list": () => ({ documents: [] }),
      "maintenance_supporter/task/complete": () => ({ success: true }),
      "maintenance_supporter/task/archive": () => ({ success: true }),
      "maintenance_supporter/task/unarchive": () => ({ success: true }),
    },
  });
  // The panel derives write access from hass.user (no user → read-only).
  (hass as Record<string, unknown>).user = { id: "admin-1", is_admin: true };
  (hass as Record<string, unknown>).areas = {};

  const el = await fixture<HTMLElement & { updateComplete: Promise<unknown> }>(html`
    <maintenance-supporter-panel
      .hass=${hass}
      style="display:block; height: 600px;"
    ></maintenance-supporter-panel>
  `);
  // _loadData is async; give it a beat, then settle renders.
  await new Promise((r) => setTimeout(r, 40));
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 10));
  await el.updateComplete;
  return { el, sent };
}

function sr(el: HTMLElement): ShadowRoot {
  return el.shadowRoot!;
}

describe("panel shell", () => {
  beforeEach(() => {
    taskSeq = 0;
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

  it("Ctrl+K opens the command palette, filters, and navigates to the task", async () => {
    const { el } = await mountPanel([
      obj("e1", [task({ name: "Filter Wechsel" }), task({ name: "Pumpe prüfen" })]),
    ]);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
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
