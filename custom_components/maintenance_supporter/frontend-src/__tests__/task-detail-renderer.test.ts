/** Tests for the extracted task-detail renderers (renderers/task-detail).
 *
 * The cluster moved out of maintenance-panel.ts as free functions + a
 * TaskDetailContext of ~20 panel-owned callbacks. These tests pin the
 * behaviour the extraction must preserve:
 *   - header renders name / object breadcrumb / status chip / actions
 *   - Complete / Skip route to the panel callbacks with the task
 *   - operator mode: only Complete/Skip; the more-menu carries just QR + worksheet
 *   - the more-menu items (edit/qr/worksheet/duplicate/…/archive/delete) fire callbacks
 *   - tab bar switches via setActiveTab; history tab renders the timeline
 *   - KPI bar shows warning days + currency; user badge resolves names
 */

import { expect } from "@open-wc/testing";
import { render } from "lit";
import {
  renderTaskDetail,
  renderUserBadge,
  type TaskDetailContext,
} from "../renderers/task-detail.js";
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

function mount(t: MaintenanceTask, c: TaskDetailContext): HTMLElement {
  const host = document.createElement("div");
  document.body.appendChild(host);
  render(renderTaskDetail(t, c), host);
  return host;
}

describe("task-detail renderer", () => {
  afterEach(() => {
    document.body.querySelectorAll("div").forEach((el) => {
      if (el.parentElement === document.body) el.remove();
    });
  });

  it("renders header with task name, object breadcrumb, and status chip", () => {
    const host = mount(task(), ctx());
    expect(host.querySelector(".task-name-breadcrumb")!.textContent).to.include("Filter Wechsel");
    expect(host.querySelector(".object-name-breadcrumb")!.textContent).to.include("Pool Pump");
    const chip = host.querySelector(".status-chip")!;
    expect(chip.classList.contains("warning")).to.be.true;
  });

  it("Complete routes to openComplete with the task; Skip to promptSkip", () => {
    let completed: MaintenanceTask | null = null;
    let skipped = 0;
    const host = mount(task(), ctx({
      openComplete: (tk) => { completed = tk; },
      promptSkip: () => { skipped++; },
    }));
    const buttons = [...host.querySelectorAll(".task-header-actions ha-button")];
    (buttons[0] as HTMLElement).click(); // Complete (filled)
    (buttons[1] as HTMLElement).click(); // Skip
    expect(completed).to.not.be.null;
    expect(completed!.name).to.equal("Filter Wechsel");
    expect(skipped).to.equal(1);
  });

  it("operator mode: only Complete/Skip buttons; menu carries just QR + worksheet", () => {
    const host = mount(task(), ctx({ isOperator: true, moreMenuOpen: true }));
    // The ⋮ stays (QR + worksheet moved into it), but write actions don't.
    expect(host.querySelector(".more-menu-wrapper"), "menu present").to.exist;
    const buttons = [...host.querySelectorAll(".task-header-actions ha-button")];
    expect(buttons.length).to.equal(2); // Complete + Skip only
    const items = [...host.querySelectorAll(".popup-menu-item")].map((i) => i.textContent?.trim() || "");
    expect(items.length).to.equal(2);
    expect(items.join(" ")).to.not.match(/edit|archive|delete|duplicate|reset/i);
  });

  it("open more-menu lists edit/qr/worksheet/duplicate/reset/postpone/snooze/archive/delete and fires callbacks", () => {
    const calls: string[] = [];
    const host = mount(task(), ctx({
      moreMenuOpen: true,
      closeMoreMenu: () => calls.push("close"),
      deleteTask: () => calls.push("delete"),
      promptPostpone: () => calls.push("postpone"),
      snoozeTask: () => calls.push("snooze"),
      printWorksheet: () => calls.push("worksheet"),
      toggleArchive: () => calls.push("archive"),
    }));
    const items = [...host.querySelectorAll(".popup-menu-item")];
    // edit, qr, worksheet, duplicate, reset, postpone, snooze, archive, delete
    expect(items.length).to.equal(9);
    (items[5] as HTMLElement).click(); // postpone
    (items[6] as HTMLElement).click(); // snooze
    (items[2] as HTMLElement).click(); // work sheet (v2.21)
    (items[7] as HTMLElement).click(); // archive (demoted from the header)
    (items[8] as HTMLElement).click(); // delete (danger)
    expect(calls).to.deep.equal([
      "close", "postpone", "close", "snooze", "close", "worksheet", "close", "archive", "close", "delete",
    ]);
  });

  it("shows a postponed badge when the task has a due_override, and none otherwise", () => {
    const plain = mount(task(), ctx());
    expect(plain.querySelector(".postponed-badge")).to.be.null;
    const postponed = mount(task({ due_override: "2026-06-20" }), ctx());
    const badge = postponed.querySelector(".postponed-badge");
    expect(badge, "postponed badge").to.exist;
    expect(badge!.textContent).to.match(/2026|20/);
  });

  it("tab bar switches via setActiveTab; history tab renders the timeline", () => {
    let tab = "";
    const host = mount(task(), ctx({ setActiveTab: (t2) => { tab = t2; } }));
    const tabs = [...host.querySelectorAll(".tab-bar .tab")];
    (tabs[1] as HTMLElement).click();
    expect(tab).to.equal("history");

    const host2 = mount(task({
      history: [{ timestamp: "2026-06-10T10:00:00+00:00", type: "completed", notes: "done" }],
    }), ctx({ activeTab: "history" }));
    expect(host2.querySelector(".history-timeline")).to.not.be.null;
    expect(host2.querySelector(".kpi-bar")).to.be.null;
  });

  it("KPI bar shows warning days and currency symbol", () => {
    const host = mount(task(), ctx({ currencySymbol: "$" }));
    const kpi = host.querySelector(".kpi-bar")!;
    expect(kpi.textContent).to.include("7");
    expect(kpi.textContent).to.include("$");
  });

  it("renderUserBadge resolves the name (and hides when unknown)", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    render(renderUserBadge(task({ responsible_user_id: "u1" }) , (id) => (id === "u1" ? "Ingmar" : null)), host);
    expect(host.textContent).to.include("Ingmar");
    render(renderUserBadge(task({ responsible_user_id: "u2" }), () => null), host);
    expect(host.textContent!.trim()).to.equal("");
  });
});
