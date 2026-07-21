/** Tests for <maintenance-task-detail-view> — the task-detail sub-view as a
 * web component (incremental step over the renderers/task-detail
 * extraction). Pins the contract the component adds on top of the renderer:
 *   - registers and renders into LIGHT DOM (no own shadow root) so the
 *     panel's shadow-scoped styles keep matching
 *   - header / breadcrumb / actions come through the component boundary
 *   - callbacks in the passed TaskDetailContext still fire (Complete, tab
 *     switch) — props in, panel callbacks out
 *   - property changes re-render (new task object → new name in the DOM)
 *   - renders nothing until both `task` and `ctx` are set
 */

import { expect, fixture } from "@open-wc/testing";
import { html } from "lit";
import "../components/task-detail-view.js";
import type { MaintenanceTaskDetailView } from "../components/task-detail-view.js";
import type { TaskDetailContext } from "../renderers/task-detail.js";
import type { MaintenanceTask } from "../types";
import { createMockHass } from "./_test-utils.js";

function task(overrides: Record<string, unknown> = {}): MaintenanceTask {
  return {
    id: "t1",
    name: "Filter Wechsel",
    type: "cleaning",
    enabled: true,
    status: "due_soon",
    schedule_type: "time_based",
    interval_days: 30,
    warning_days: 7,
    days_until_due: 3,
    next_due: "2026-07-10",
    last_performed: "2026-06-10",
    times_performed: 2,
    total_cost: 50,
    average_duration: 20,
    history: [],
    checklist: [],
    is_done: false,
    archived: false,
    trigger_active: false,
    ...overrides,
  } as unknown as MaintenanceTask;
}

function ctx(overrides: Partial<TaskDetailContext> = {}): TaskDetailContext {
  const { hass } = createMockHass({
    handler: () => ({ documents: [] }),
  });
  return {
    lang: "en",
    hass: hass as TaskDetailContext["hass"],
    entryId: "entry1",
    taskId: "t1",
    objectName: "Pool Pump",
    objectDocUrl: null,
    isOperator: false,
    actionLoading: false,
    moreMenuOpen: false,
    activeTab: "overview",
    features: {
      adaptive: false, predictions: false, seasonal: false,
      environmental: false, budget: false, groups: false,
      checklists: false, schedule_time: false, completion_actions: false,
    },
    currencySymbol: "€",
    collapsedSections: new Set(),
    costDurationToggle: "both",
    suggestionDismissed: false,
    sparkline: {
      lang: "en",
      detailStatsData: new Map(),
      hasStatsService: false,
      isCounterEntity: () => false,
      rangeDays: 30,
      setRangeDays: () => undefined,
      hideOutliers: false,
      setHideOutliers: () => undefined,
    },
    history: {
      lang: "en",
      hass: hass as TaskDetailContext["hass"],
      filter: null,
      search: "",
      currencySymbol: "€",
      setFilter: () => undefined,
      setSearch: () => undefined,
      openEdit: () => undefined,
    },
    getUserName: () => null,
    setActiveTab: () => undefined,
    toggleSection: () => undefined,
    setCostDurationToggle: () => undefined,
    showTaskView: () => undefined,
    showObject: () => undefined,
    toggleMoreMenu: () => undefined,
    closeMoreMenu: () => undefined,
    openEdit: () => undefined,
    openComplete: () => undefined,
    promptSkip: () => undefined,
    toggleArchive: () => undefined,
    openQr: () => undefined,
    duplicateTask: () => undefined,
    promptReset: () => undefined,
    promptPostpone: () => undefined,
    snoozeTask: () => undefined,
    printWorksheet: () => undefined,
    deleteTask: () => undefined,
    applySuggestion: () => undefined,
    reanalyze: () => undefined,
    dismissSuggestion: () => undefined,
    openSeasonalOverrides: () => undefined,
    ...overrides,
  };
}

async function mount(t: MaintenanceTask, c: TaskDetailContext): Promise<MaintenanceTaskDetailView> {
  const el = await fixture<MaintenanceTaskDetailView>(html`
    <maintenance-task-detail-view .task=${t} .ctx=${c}></maintenance-task-detail-view>
  `);
  await el.updateComplete;
  return el;
}

describe("maintenance-task-detail-view", () => {
  it("is registered as a custom element", () => {
    expect(customElements.get("maintenance-task-detail-view")).to.exist;
  });

  it("renders into light DOM so the panel's shadow-scoped styles keep applying", async () => {
    const el = await mount(task(), ctx());
    expect(el.shadowRoot, "no own shadow root").to.equal(null);
    // The detail markup is queryable directly on the element (= light DOM).
    expect(el.querySelector(".detail-section"), "detail section in light DOM").to.exist;
  });

  it("renders header, breadcrumb and status through the component boundary", async () => {
    const el = await mount(task(), ctx());
    expect(el.querySelector(".task-name-breadcrumb")?.textContent).to.contain("Filter Wechsel");
    expect(el.querySelector(".object-name-breadcrumb")?.textContent).to.contain("Pool Pump");
    expect(el.querySelector(".status-chip"), "status chip").to.exist;
    expect(el.querySelector(".kpi-bar"), "KPI bar").to.exist;
  });

  it("routes the Complete action to the panel callback with the task", async () => {
    let completed: MaintenanceTask | null = null;
    const el = await mount(task(), ctx({ openComplete: (tk) => { completed = tk; } }));
    const btn = [...el.querySelectorAll(".task-header-actions ha-button")]
      .find((b) => b.textContent?.match(/complete/i)) as HTMLElement;
    expect(btn, "complete button").to.exist;
    btn.click();
    expect(completed, "openComplete received the task").to.not.equal(null);
    expect((completed as unknown as MaintenanceTask).id).to.equal("t1");
  });

  it("switches tabs via the panel-owned setActiveTab callback", async () => {
    let tab = "";
    const el = await mount(task(), ctx({ setActiveTab: (v) => { tab = v; } }));
    const tabs = [...el.querySelectorAll(".tab-bar .tab")] as HTMLElement[];
    expect(tabs.length).to.equal(2);
    tabs[1].click();
    expect(tab).to.equal("history");
  });

  it("re-renders when the task property changes", async () => {
    const el = await mount(task(), ctx());
    el.task = task({ name: "Pumpe entkalken" });
    await el.updateComplete;
    expect(el.querySelector(".task-name-breadcrumb")?.textContent).to.contain("Pumpe entkalken");
  });

  it("renders nothing until both task and ctx are set", async () => {
    const el = await fixture<MaintenanceTaskDetailView>(html`
      <maintenance-task-detail-view></maintenance-task-detail-view>
    `);
    await el.updateComplete;
    expect(el.querySelector(".detail-section")).to.equal(null);
  });

  it("operators get the more-menu with only the read-safe items (QR + worksheet)", async () => {
    const el = await mount(task(), ctx({ isOperator: true, moreMenuOpen: true }));
    expect(el.querySelector(".more-menu-wrapper"), "menu present for operators").to.exist;
    const labels = [...el.querySelectorAll(".popup-menu-item")].map((i) => i.textContent?.trim());
    expect(labels.length).to.equal(2);
    // No write actions leak into the operator menu.
    expect(labels.join(" ")).to.not.match(/edit|archive|delete|duplicate|reset/i);
  });
});
