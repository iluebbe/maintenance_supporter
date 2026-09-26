/**
 * DRY audit + bug audit 2026-09-26, tranche 2 — frontend regressions.
 *
 * One `describe` per finding id (FE-A* = DRY audit section A, FE-* = bug
 * audit "Frontend runtime"). Every test fails on the code before the fix.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "../components/task-quick-actions-dialog.js";
import "../components/object-quick-actions-dialog.js";
import "../components/groups-section-card.js";
import "../components/object-history-section.js";
import "../components/documents-section.js";
import "../components/parts-section.js";
import "../components/complete-dialog.js";
import "../components/history-edit-dialog.js";
import "../components/storage-section-card.js";
import "../components/camera-capture.js";
import "../components/settings-view.js";
import "../components/vacation-section-card.js";
import "../maintenance-card.js";
import "../maintenance-calendar-card.js";
import { MaintenanceDashboardStrategy } from "../maintenance-dashboard-strategy.js";
import type { MaintenanceTaskQuickActionsDialog } from "../components/task-quick-actions-dialog";
import type { MaintenanceObjectQuickActionsDialog } from "../components/object-quick-actions-dialog";
import type { MaintenanceObjectHistorySection } from "../components/object-history-section";
import type { MaintenanceDocumentsSection } from "../components/documents-section";
import type { MaintenancePartsSection } from "../components/parts-section";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import type { HistoryEntryDraft, MaintenanceHistoryEditDialog } from "../components/history-edit-dialog";
import type { MaintenanceStorageSectionCard } from "../components/storage-section-card";
import type { MsCameraCapture } from "../components/camera-capture";
import type { MaintenanceSettingsView } from "../components/settings-view";
import type { MaintenanceVacationSectionCard } from "../components/vacation-section-card";
import type { MaintenanceSupporterCard } from "../maintenance-card";
import type { MaintenanceConfirmDialog } from "../components/confirm-dialog";
import { renderStatusBadge, statusKey, STATUS_KEYS } from "../renderers/status.js";
import { newestFirst } from "../renderers/history.js";
import { canWrite, HOUSEHOLD_ACTIONS } from "../helpers/permissions.js";
import { fetchSettingsOnce, invalidateSettingsCache, parseSettings } from "../helpers/settings-cache.js";
import { buildCompleteDialogArgs } from "../helpers/complete-dialog-args.js";
import { buildPastBuckets, isoDateLocal, pastHistoryGaps } from "../helpers/calendar-bucket.js";
import { buildTaskWorksheetHtml } from "../helpers/worksheet.js";
import { parseDurationMinutes } from "../helpers/duration.js";
import { ToastTimer } from "../helpers/toast.js";
import { VACATION_BUFFER_DAYS_RANGE } from "../helpers/setting-ranges.js";
import { STATUS_ICONS } from "../status-constants.js";
import { describeWsError } from "../ws-errors.js";
import { formatDate, t } from "../styles.js";
import { render } from "lit";
import { DEFAULT_FEATURES, DEFAULT_SETTINGS_RESPONSE, createMockHass, type SentMessage } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, sr, task as panelTask } from "./_panel-utils.js";

const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => { resolve = r; });
  return { promise, resolve };
}

async function sourceManifest(): Promise<Record<string, string>> {
  return (await fetch("/__source-manifest")).json();
}

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${isoDateLocal(d)}T10:00:00`;
}

/** A task as the object/objects WS responses carry it. */
function wireTask(over: Record<string, unknown> = {}) {
  return {
    id: "t1", name: "Filter", type: "custom", schedule_type: "time_based",
    interval_days: 30, warning_days: 7, status: "ok", enabled: true, archived: false,
    is_done: false, days_until_due: 10, next_due: "2026-10-10", last_performed: null,
    trigger_active: false, times_performed: 0, total_cost: 0, average_duration: null,
    history: [], checklist: [], ...over,
  };
}

/** Mount the Lovelace task quick-actions dialog with one task. */
async function mountQuickActions(taskOver: Record<string, unknown> = {}, opts: {
  user?: { id: string; is_admin: boolean } | null;
  settings?: Record<string, unknown>;
  handlers?: Record<string, (msg: SentMessage) => unknown>;
} = {}) {
  const { hass, sent } = createMockHass({
    settingsResponse: { ...DEFAULT_SETTINGS_RESPONSE, ...(opts.settings ?? {}) } as never,
    handlers: {
      "maintenance_supporter/object": () => ({
        entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [wireTask(taskOver)],
      }),
      ...(opts.handlers ?? {}),
    },
  });
  if (opts.user !== null) (hass as Record<string, unknown>).user = opts.user ?? { id: "admin", is_admin: true };
  const el = await fixture<MaintenanceTaskQuickActionsDialog>(html`
    <maintenance-task-quick-actions-dialog .hass=${hass}></maintenance-task-quick-actions-dialog>
  `);
  await el.openFor("e1", "t1");
  await el.updateComplete;
  return { el, sent, hass };
}

describe("audit 2026-09-26 tranche 2", () => {
  beforeEach(() => invalidateSettingsCache());
  afterEach(() => {
    document.querySelectorAll("maintenance-confirm-dialog[data-ms-lovelace-confirm]").forEach((d) => d.remove());
  });

  // ── FE-A1: one status derivation + chip styles for every key ────────────
  describe("FE-A1 status badge", () => {
    it("derives archived > done > backend status, and labels done as Completed", () => {
      expect(statusKey({ status: "ok", is_done: true })).to.equal("done");
      expect(statusKey({ status: "overdue", archived: true, is_done: true })).to.equal("archived");
      expect(statusKey({ status: "paused" })).to.equal("paused");
      const host = document.createElement("div");
      render(renderStatusBadge({ status: "ok", is_done: true }, "en"), host);
      const pill = host.querySelector(".status-badge")!;
      expect(pill.classList.contains("done")).to.equal(true);
      expect(pill.textContent).to.contain("Completed");
      render(renderStatusBadge({ status: "triggered" }, "en", "chip"), host);
      expect(host.querySelector(".status-chip.triggered")).to.exist;
    });

    it("every status key has a header-chip rule and a pill rule (tripwire)", async () => {
      const src = await sourceManifest();
      for (const key of STATUS_KEYS) {
        expect(src["panel-styles.ts"], `.status-chip.${key}`).to.contain(`.status-chip.${key} {`);
        expect(src["styles.ts"], `.status-badge.${key}`).to.contain(`.status-badge.${key} {`);
      }
      // The task-detail header derives through the shared renderer.
      expect(src["renderers/task-detail.ts"]).to.contain('renderStatusBadge(task, L, "chip")');
    });

    it("the quick-actions dialog shows a finished one-time task as Completed, not OK", async () => {
      const { el } = await mountQuickActions({ status: "ok", is_done: true });
      const badge = el.shadowRoot!.querySelector(".title .status-badge")!;
      expect(badge.classList.contains("done")).to.equal(true);
      expect(badge.textContent).to.contain("Completed");
      const dot = el.shadowRoot!.querySelector<HTMLElement>(".status-dot")!;
      expect(dot.getAttribute("style")).to.contain("maint-done-color");
    });

    it("the object quick-actions list labels a finished task Completed", async () => {
      const { hass } = createMockHass({
        handlers: {
          "maintenance_supporter/object": () => ({
            entry_id: "e1", object: { id: "o1", name: "Pump" },
            tasks: [wireTask({ id: "a", name: "Once", status: "ok", is_done: true }), wireTask({ id: "b", name: "Due", status: "overdue" })],
          }),
        },
      });
      (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
      const el = await fixture<MaintenanceObjectQuickActionsDialog>(html`
        <maintenance-object-quick-actions-dialog .hass=${hass}></maintenance-object-quick-actions-dialog>
      `);
      await el.openFor("e1");
      await el.updateComplete;
      const labels = [...el.shadowRoot!.querySelectorAll(".task-status")].map((s) => s.textContent!.trim());
      expect(labels).to.deep.equal(["Completed", "Overdue"]);
    });
  });

  // ── FE-A2: stats from the server totals, not the 20-entry window ────────
  describe("FE-A2 capped history", () => {
    it("quick-actions stats use times_performed / total_cost / average_duration / history_count", async () => {
      const history = Array.from({ length: 20 }, (_, i) => ({ timestamp: isoDaysAgo(20 - i), type: "completed", cost: 1, duration: 10 }));
      const { el } = await mountQuickActions({
        history, history_count: 42, times_performed: 40, total_cost: 321, average_duration: 25,
      });
      (el as unknown as { _showDetails: boolean })._showDetails = true;
      await el.updateComplete;
      const values = [...el.shadowRoot!.querySelectorAll(".stat-value")].map((v) => v.textContent!.trim());
      expect(values[0]).to.equal("40");
      expect(values[1]).to.contain("321");
      expect(values[2]).to.contain("25");
      expect(el.shadowRoot!.querySelector(".history-count")!.textContent!.trim()).to.equal("42");
      expect(el.shadowRoot!.querySelector(".history-more")!.textContent).to.contain("+22");
    });

    it("past-mode calendar: names tasks whose list window may miss entries and uses their full history", () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const listed = Array.from({ length: 20 }, (_, i) => ({ timestamp: isoDaysAgo(19 - i), type: "completed" }));
      const full = Array.from({ length: 28 }, (_, i) => ({ timestamp: isoDaysAgo(27 - i), type: "completed" }));
      const objects = [{
        entry_id: "e1", object: { id: "o1", name: "Pump" },
        tasks: [wireTask({ history: listed, history_count: 28 }), wireTask({ id: "t2", history: listed.slice(0, 3), history_count: 3 })],
      }] as never;
      const gaps = pastHistoryGaps(objects, today, 30);
      expect(gaps.map((g) => g.key)).to.deep.equal(["e1/t1"]);
      const count = (b: ReturnType<typeof buildPastBuckets>) => b.reduce((n, d) => n + d.events.filter((e) => e.task_id === "t1").length, 0);
      expect(count(buildPastBuckets(objects, today, 30))).to.equal(20);
      expect(count(buildPastBuckets(objects, today, 30, null, { "e1/t1": full }))).to.equal(28);
    });

    it("the calendar card fetches the full history in past mode", async () => {
      const listed = Array.from({ length: 20 }, (_, i) => ({ timestamp: isoDaysAgo(19 - i), type: "completed" }));
      const full = Array.from({ length: 25 }, (_, i) => ({ timestamp: isoDaysAgo(24 - i), type: "completed" }));
      const { hass, sent } = createMockHass({
        handlers: {
          "maintenance_supporter/objects": () => ({
            objects: [{ entry_id: "e1", object: { id: "o1", name: "Pump", area_id: null }, tasks: [wireTask({ history: listed, history_count: 25 })] }],
          }),
          "maintenance_supporter/statistics": () => ({}),
          "maintenance_supporter/task/history": () => ({ history: full }),
        },
      });
      const el = document.createElement("maintenance-supporter-calendar-card") as HTMLElement & {
        setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>;
      };
      el.setConfig({ type: "custom:maintenance-supporter-calendar-card", past_days: 30 });
      el.hass = hass;
      document.body.appendChild(el);
      try {
        await waitUntil(() => el.shadowRoot!.querySelectorAll(".cal-event").length === 25, "25 past events", { timeout: 3000 });
        expect(sent.filter((m) => m.type === "maintenance_supporter/task/history").length).to.equal(1);
      } finally {
        el.remove();
      }
    });
  });

  // ── FE-A3: one canWrite(); household actions for everyone ───────────────
  describe("FE-A3 permissions", () => {
    it("canWrite mirrors user_can_write", () => {
      const on = { operatorWriteEnabled: true, operatorIds: ["op"] };
      expect(canWrite(null, on)).to.equal(false);
      expect(canWrite({ id: "a", is_admin: true })).to.equal(true);
      expect(canWrite({ id: "op", is_admin: false }, on)).to.equal(true);
      expect(canWrite({ id: "op", is_admin: false }, { ...on, operatorWriteEnabled: false })).to.equal(false);
      expect(canWrite({ id: "x", is_admin: false }, on)).to.equal(false);
      expect(HOUSEHOLD_ACTIONS).to.include.members(["task/reset", "task/postpone", "task/snooze"]);
    });

    it("the settings cache carries the delegation", () => {
      const s = parseSettings({ operator_write_enabled: true, admin_panel_user_ids: ["op", 3 as never] });
      expect(s.access).to.deep.equal({ operatorWriteEnabled: true, operatorIds: ["op"] });
    });

    it("quick-actions: a delegated operator gets Edit/Delete; a plain member QR + Reset but no Edit", async () => {
      const delegated = { operator_write_enabled: true, admin_panel_user_ids: ["op"] };
      const op = await mountQuickActions({}, { user: { id: "op", is_admin: false }, settings: delegated });
      expect(op.el.shadowRoot!.querySelector(".qa-edit"), "operator edit").to.exist;
      expect(op.el.shadowRoot!.querySelector(".qa-delete"), "operator delete").to.exist;

      invalidateSettingsCache();
      const member = await mountQuickActions({}, { user: { id: "someone", is_admin: false }, settings: delegated });
      const root = member.el.shadowRoot!;
      expect(root.querySelector(".qa-edit"), "no edit").to.equal(null);
      expect(root.querySelector(".qa-delete"), "no delete").to.equal(null);
      expect(root.querySelector(".qa-qr"), "QR is read tier").to.exist;
      expect([...root.querySelectorAll(".primary-row ha-button")].map((b) => b.textContent!.trim()).join(" ")).to.contain("Reset");
    });

    it("groups card: a delegated operator may add groups", async () => {
      const { hass } = createMockHass({
        settingsResponse: { ...DEFAULT_SETTINGS_RESPONSE, operator_write_enabled: true, admin_panel_user_ids: ["op"] } as never,
        handlers: { "maintenance_supporter/groups": () => ({ groups: {} }) },
      });
      (hass as Record<string, unknown>).user = { id: "op", is_admin: false };
      const el = await fixture<HTMLElement & { updateComplete: Promise<unknown> }>(html`
        <maintenance-groups-section-card .hass=${hass}></maintenance-groups-section-card>
      `);
      await waitUntil(() => el.shadowRoot!.querySelector(".add-row"), "add row for the operator");
    });

    it("panel: a non-writer's task menu offers Reset / Postpone / Snooze but no edit actions", async () => {
      resetTaskSeq();
      const { el } = await mountPanel([obj("e1", [panelTask({ name: "Pump filter" })])], {}, { user: { id: "member", is_admin: false } });
      const panel = el as unknown as { _showTask: (e: string, t: string) => void; _moreMenuOpen: boolean; updateComplete: Promise<unknown> };
      panel._showTask("e1", "t1");
      panel._moreMenuOpen = true;
      await panel.updateComplete;
      const items = [...sr(el).querySelectorAll(".popup-menu-item")].map((i) => i.textContent!.trim()).join(" | ");
      expect(items).to.contain("Reset");
      expect(items).to.contain("Postpone");
      expect(items).to.contain("Snooze");
      expect(items).to.not.match(/Edit|Delete|Duplicate|Archive/);
    });
  });

  // ── FE-A4: feature switches gate the complete dialog for every surface ──
  describe("FE-A4 complete dialog features", () => {
    const checklistTask = wireTask({ checklist: ["Rinse"], adaptive_config: { enabled: true } }) as never;

    it("buildCompleteDialogArgs gates checklist + adaptive feedback on the features", () => {
      const base = { entryId: "e1", taskId: "t1", taskName: "Filter", task: checklistTask, objects: [], lang: "en" };
      const off = buildCompleteDialogArgs({ ...base, features: { checklists: false, adaptive: false } });
      expect(off.checklist).to.deep.equal([]);
      expect(off.adaptive_enabled).to.equal(false);
      const on = buildCompleteDialogArgs({ ...base, features: { checklists: true, adaptive: true } });
      expect(on.checklist).to.deep.equal(["Rinse"]);
      expect(on.adaptive_enabled).to.equal(true);
    });

    it("the Lovelace card's Complete honours a switched-off checklist feature", async () => {
      const { hass } = createMockHass({
        handlers: {
          "maintenance_supporter/objects": () => ({
            objects: [{ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [wireTask({ status: "overdue", checklist: ["Rinse"] })] }],
          }),
          "maintenance_supporter/statistics": () => ({}),
        },
      });
      (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
      const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
      el.setConfig({ type: "custom:maintenance-supporter-card", show_actions: true, show_documents: false } as never);
      el.hass = hass as never;
      await waitUntil(() => el.shadowRoot!.querySelector(".complete-btn-text, .complete-btn"), "complete action");
      await tick(30);
      (el.shadowRoot!.querySelector(".complete-btn-text, .complete-btn") as HTMLElement).click();
      const dlg = el.shadowRoot!.querySelector<MaintenanceCompleteDialog>("maintenance-complete-dialog")!;
      expect(dlg.checklist).to.deep.equal([]);
    });
  });

  // ── FE-A5: the strategy's Overdue view wears the overdue icon ───────────
  it("FE-A5 strategy due-date Overdue view uses STATUS_ICONS.overdue", async () => {
    const hass = {
      config: {}, areas: {}, floors: {},
      connection: {
        sendMessagePromise: async () => ({
          objects: [{ entry_id: "e1", object: { id: "o1", name: "Pump", area_id: null }, tasks: [wireTask({ status: "overdue", days_until_due: -3 })] }],
        }),
      },
    };
    const dash = await MaintenanceDashboardStrategy.generate({ group_by: "due_date" } as never, hass as never);
    const overdue = (dash.views as Array<{ path?: string; icon?: string }>).find((v) => v.path === "overdue");
    expect(overdue?.icon).to.equal(STATUS_ICONS.overdue);
  });

  // ── FE-A6 / FE-A12: all-objects cards ────────────────────────────────────
  describe("FE-A6 + FE-A12 object cards", () => {
    it("formats the paused-until date and says '1 task'", async () => {
      resetTaskSeq();
      const paused = obj("e1", [panelTask()], "Boiler") as Record<string, unknown>;
      paused.object = { ...(paused.object as object), paused: true, paused_until: "2026-10-15" };
      const { el } = await mountPanel([paused, obj("e2", [panelTask(), panelTask()], "Car")]);
      (el as unknown as { _showAllObjects: () => void })._showAllObjects();
      await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
      const title = sr(el).querySelector(".paused-badge")!.getAttribute("title")!;
      expect(title).to.contain(formatDate("2026-10-15", "en"));
      if (formatDate("2026-10-15", "en") !== "2026-10-15") expect(title).to.not.contain("2026-10-15");
      const counts = [...sr(el).querySelectorAll(".object-card-count")].map((c) => c.textContent!.trim());
      expect(counts).to.include("1 task");
      expect(counts).to.include("2 tasks");
    });
  });

  // ── FE-A7: template gallery relays the server's reason ───────────────────
  it("FE-A7 template gallery shows the server's reason instead of 'Action failed'", async () => {
    resetTaskSeq();
    const refusal = { code: "limit_reached", message: "Limit reached" };
    const { el } = await mountPanel([obj("e1", [panelTask()])], {
      "maintenance_supporter/object/from_template": () => { throw refusal; },
    });
    const panel = el as unknown as { _createFromTemplate: (id: string) => Promise<void>; _toastMessage: string };
    await panel._createFromTemplate("dishwasher");
    expect(panel._toastMessage).to.equal(describeWsError(refusal, "en"));
    expect(panel._toastMessage).to.not.equal(t("action_error", "en"));
  });

  // ── FE-A8: one vacation buffer range, both editors say so ───────────────
  describe("FE-A8 vacation buffer range", () => {
    it("settings view: out of range is named in a toast, not silently dropped", async () => {
      const { hass, sent } = createMockHass({});
      const el = await fixture<MaintenanceSettingsView>(html`
        <maintenance-settings-view .hass=${hass} .features=${DEFAULT_FEATURES}></maintenance-settings-view>
      `);
      await tick(50);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector<HTMLInputElement>(".vacation-section .vac-grid input[type=number]")!;
      expect(input.max).to.equal(String(VACATION_BUFFER_DAYS_RANGE[1]));
      input.value = "20";
      input.dispatchEvent(new Event("change"));
      await tick();
      expect(sent.some((m) => m.type === "maintenance_supporter/vacation/update")).to.equal(false);
      expect((el as unknown as { _toast: string })._toast).to.contain(String(VACATION_BUFFER_DAYS_RANGE[1]));
      expect(input.value, "snaps back").to.equal("3");
    });

    it("vacation card: the same range is checked before sending", async () => {
      const { hass, sent } = createMockHass({
        handlers: { "maintenance_supporter/vacation/state": () => ({ enabled: false, buffer_days: 3, start: null, end: null }) },
      });
      (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
      const el = await fixture<MaintenanceVacationSectionCard>(html`
        <maintenance-vacation-section-card .hass=${hass}></maintenance-vacation-section-card>
      `);
      await tick();
      await el.updateComplete;
      const buffer = el.shadowRoot!.querySelector<HTMLInputElement>('input[type="number"]')!;
      buffer.value = "20";
      buffer.dispatchEvent(new Event("input"));
      await el.updateComplete;
      await (el as unknown as { _save: () => Promise<void> })._save();
      expect(sent.some((m) => m.type === "maintenance_supporter/vacation/update")).to.equal(false);
      expect((el as unknown as { _error: string })._error).to.contain("14");
    });
  });

  // ── FE-A9: quick-actions read the page-wide settings cache ──────────────
  it("FE-A9 quick-actions reuse the settings cache and follow an invalidation", async () => {
    let adaptive = false;
    const { hass, sent } = createMockHass({
      handlers: {
        "maintenance_supporter/settings": () => ({ ...DEFAULT_SETTINGS_RESPONSE, features: { ...DEFAULT_FEATURES, adaptive } }),
        "maintenance_supporter/object": () => ({ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [wireTask()] }),
      },
    });
    (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
    await fetchSettingsOnce(hass as never);
    const el = await fixture<MaintenanceTaskQuickActionsDialog>(html`
      <maintenance-task-quick-actions-dialog .hass=${hass}></maintenance-task-quick-actions-dialog>
    `);
    await el.openFor("e1", "t1");
    expect(sent.filter((m) => m.type === "maintenance_supporter/settings").length, "served from the cache").to.equal(1);
    expect((el as unknown as { _features: { adaptive: boolean } })._features.adaptive).to.equal(false);
    adaptive = true;
    invalidateSettingsCache(); // what global/update does
    el.close();
    await el.openFor("e1", "t1");
    expect((el as unknown as { _features: { adaptive: boolean } })._features.adaptive).to.equal(true);
  });

  // ── FE-A10: the Lovelace dialogs ask through the confirm dialog ─────────
  it("FE-A10 quick-actions Delete asks via the confirm dialog, not window.confirm", async () => {
    const realConfirm = window.confirm;
    window.confirm = () => { throw new Error("native confirm used"); };
    try {
      const { el, sent } = await mountQuickActions({}, {
        handlers: { "maintenance_supporter/task/delete": () => ({ success: true }) },
      });
      (el.shadowRoot!.querySelector(".qa-delete") as HTMLElement).click();
      await tick();
      const dlg = document.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog[data-ms-lovelace-confirm]")!;
      expect(dlg, "confirm dialog mounted").to.exist;
      await dlg.updateComplete;
      expect(dlg.shadowRoot!.querySelector(".content")!.textContent).to.contain(t("delete_task_confirm", "en"));
      const buttons = dlg.shadowRoot!.querySelectorAll<HTMLElement>(".dialog-actions ha-button");
      buttons[buttons.length - 1].click();
      await tick();
      expect(sent.some((m) => m.type === "maintenance_supporter/task/delete")).to.equal(true);
    } finally {
      window.confirm = realConfirm;
    }
  });

  it("FE-A10 the vacation card's End now asks via the confirm dialog too", async () => {
    const realConfirm = window.confirm;
    window.confirm = () => { throw new Error("native confirm used"); };
    try {
      const { hass, sent } = createMockHass({
        handlers: {
          "maintenance_supporter/vacation/state": () => ({ enabled: true, is_active: true, start: "2026-09-20", end: "2026-10-01", buffer_days: 3 }),
          "maintenance_supporter/vacation/end_now": () => ({ enabled: false, is_active: false, start: null, end: null, buffer_days: 3 }),
        },
      });
      (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
      const el = await fixture<MaintenanceVacationSectionCard>(html`
        <maintenance-vacation-section-card .hass=${hass}></maintenance-vacation-section-card>
      `);
      await tick();
      await el.updateComplete;
      const endNow = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>(".actions .btn")]
        .find((b) => b.textContent!.includes(t("vacation_end_now", "en")))!;
      endNow.click();
      await tick();
      const dlg = document.querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog[data-ms-lovelace-confirm]")!;
      await dlg.updateComplete;
      const buttons = dlg.shadowRoot!.querySelectorAll<HTMLElement>(".dialog-actions ha-button");
      buttons[buttons.length - 1].click();
      await tick();
      expect(sent.some((m) => m.type === "maintenance_supporter/vacation/end_now")).to.equal(true);
    } finally {
      window.confirm = realConfirm;
    }
  });

  it("FE-A10 one key per delete question (the duplicate pairs are gone)", async () => {
    const src = await sourceManifest();
    const all = Object.values(src).join("\n");
    for (const dropped of ["confirm_delete_task", "confirm_delete_object", "group_delete_confirm"]) {
      expect(all, dropped).to.not.contain(`"${dropped}"`);
    }
    expect(src["maintenance-panel.ts"]).to.contain('t("delete_task_confirm"');
    expect(src["components/task-quick-actions-dialog.ts"]).to.contain('t("delete_task_confirm"');
  });

  // ── FE-A11: one toast timer per surface ──────────────────────────────────
  describe("FE-A11 toasts", () => {
    it("a newer toast is not cut short by the older one's timer; clear() drops it", async () => {
      const timer = new ToastTimer();
      const hidden: string[] = [];
      timer.schedule(() => hidden.push("a"), 30);
      await tick(10);
      timer.schedule(() => hidden.push("b"), 60);
      await tick(40);
      expect(hidden, "a's timer was replaced").to.deep.equal([]);
      await tick(40);
      expect(hidden).to.deep.equal(["b"]);
      timer.schedule(() => hidden.push("c"), 20);
      timer.clear();
      await tick(40);
      expect(hidden).to.deep.equal(["b"]);
    });

    it("closing the quick-actions dialog drops a pending toast", async () => {
      const { el } = await mountQuickActions();
      const priv = el as unknown as { _showToast: (m: string, ms?: number) => void; _toast: string; _toastTimer: ToastTimer };
      priv._showToast("hello", 5000);
      expect(priv._toastTimer.pending).to.equal(true);
      el.close();
      expect(priv._toastTimer.pending).to.equal(false);
      expect(priv._toast).to.equal("");
    });
  });

  // ── FE-4: the object history section follows task changes ──────────────
  it("FE-4 object history refetches when a task's history changes, not on identical lists", async () => {
    let entries = [{ timestamp: "2026-03-10T09:00:00+00:00", type: "completed", cost: 10 }];
    const { hass, sent } = createMockHass({
      handlers: { "maintenance_supporter/task/history": () => ({ history: entries }) },
    });
    const tasks = [{ id: "t1", name: "Oil", history: [], history_count: 1 }];
    const el = await fixture<MaintenanceObjectHistorySection>(html`
      <maintenance-object-history-section .hass=${hass as never} .entryId=${"e1"} .object=${{ name: "Car" } as never} .tasks=${tasks as never}></maintenance-object-history-section>
    `);
    await waitUntil(() => el.shadowRoot!.querySelectorAll(".row").length === 1, "first load");
    const fetches = () => sent.filter((m) => m.type === "maintenance_supporter/task/history").length;
    expect(fetches()).to.equal(1);

    el.tasks = [{ ...tasks[0] }] as never; // same content, new identity (a delta for another task)
    await el.updateComplete;
    await tick();
    expect(fetches(), "unchanged histories are not refetched").to.equal(1);

    entries = [{ timestamp: "2026-09-20T09:00:00+00:00", type: "completed", cost: 12 }, ...entries];
    el.tasks = [{ ...tasks[0], history_count: 2 }] as never; // a completion elsewhere
    await waitUntil(() => el.shadowRoot!.querySelectorAll(".row").length === 2, "refreshed after the completion");
    expect(fetches()).to.equal(2);
  });

  // ── FE-5 / FE-11: printed QR codes ───────────────────────────────────────
  describe("FE-5 + FE-11 QR deep links", () => {
    beforeEach(() => {
      resetTaskSeq();
      localStorage.clear();
      localStorage.setItem("msp-overview-tab", "dashboard");
    });
    afterEach(() => {
      localStorage.clear();
      history.replaceState(null, "", window.location.pathname);
    });

    it("the Complete QR opens the dialog as a scan (via_tag_scan)", async () => {
      history.replaceState(null, "", `${window.location.pathname}?entry_id=e1&task_id=t1&action=complete`);
      const { el } = await mountPanel([obj("e1", [panelTask({ name: "Scan Me", require_tag_scan: true })])]);
      let dlg: MaintenanceCompleteDialog | null = null;
      for (let i = 0; i < 400 && !dlg?.shadowRoot?.querySelector("ha-dialog"); i++) {
        await tick(20);
        dlg = sr(el).querySelector<MaintenanceCompleteDialog>("maintenance-complete-dialog");
      }
      expect(dlg!.shadowRoot!.querySelector("ha-dialog"), "dialog open").to.exist;
      expect(dlg!.viaTagScan).to.equal(true);
    });

    it("the Skip QR opens the skip prompt", async () => {
      history.replaceState(null, "", `${window.location.pathname}?entry_id=e1&task_id=t1&action=skip`);
      const { el } = await mountPanel([obj("e1", [panelTask({ name: "Skippable" })])]);
      const confirmDlg = () => sr(el).querySelector<MaintenanceConfirmDialog>("maintenance-confirm-dialog");
      await waitUntil(() => confirmDlg()?.shadowRoot?.querySelector("ha-dialog"), "skip prompt open", { timeout: 3000 });
      expect(confirmDlg()!.shadowRoot!.querySelector(".dialog-title")!.textContent).to.contain(t("skip", "en"));
    });
  });

  // ── FE-6 + FE-15 (duration): complete dialog number fields ──────────────
  describe("FE-6 complete dialog quantities", () => {
    async function mountDialog(over: Partial<MaintenanceCompleteDialog>) {
      const { hass, sent } = createMockHass({ handlers: { "maintenance_supporter/task/complete": () => ({ success: true }) } });
      const el = await fixture<MaintenanceCompleteDialog>(html`
        <maintenance-complete-dialog .hass=${hass} .entryId=${"e1"} .taskId=${"t1"} .taskName=${"Filter"} .lang=${"en"}></maintenance-complete-dialog>
      `);
      Object.assign(el, over);
      el.open();
      await el.updateComplete;
      return { el, sent };
    }
    const clickComplete = (el: MaintenanceCompleteDialog) => {
      const b = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".dialog-actions ha-button")];
      b[b.length - 1].click();
    };
    const complete = (sent: SentMessage[]) => sent.find((m) => m.type === "maintenance_supporter/task/complete");

    it("clearing a used-part quantity keeps the field empty (no '1' → '13')", async () => {
      const { el, sent } = await mountDialog({
        parts: [{ id: "p1", name: "Filter" }] as never,
        consumesParts: [{ part_id: "p1", quantity: 1 }] as never,
      });
      const qty = el.shadowRoot!.querySelector<HTMLInputElement>(".used-part-qty")!;
      qty.value = "";
      qty.dispatchEvent(new Event("input"));
      await el.updateComplete;
      expect(qty.value, "not rewritten to 1").to.equal("");
      qty.value = "3";
      qty.dispatchEvent(new Event("input"));
      await el.updateComplete;
      clickComplete(el);
      await tick();
      expect((complete(sent)!.used_parts as Array<{ quantity: number }>)[0].quantity).to.equal(3);
    });

    it("an empty used-part quantity is refused with a message, nothing sent", async () => {
      const { el, sent } = await mountDialog({
        parts: [{ id: "p1", name: "Filter" }] as never,
        consumesParts: [{ part_id: "p1", quantity: 1 }] as never,
      });
      const qty = el.shadowRoot!.querySelector<HTMLInputElement>(".used-part-qty")!;
      qty.value = "";
      qty.dispatchEvent(new Event("input"));
      clickComplete(el);
      await tick();
      expect(complete(sent)).to.equal(undefined);
      expect(el.shadowRoot!.querySelector(".error")!.textContent).to.contain("999");
    });

    it("a fractional restock quantity is sent, not dropped", async () => {
      const { el, sent } = await mountDialog({ restockDefault: 1 });
      const inputs = [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".field-input")];
      const restock = inputs.find((i) => i.getAttribute("max") === "9999")!;
      restock.value = "0.5";
      restock.dispatchEvent(new Event("input"));
      clickComplete(el);
      await tick();
      expect(complete(sent)!.restock_quantity).to.equal(0.5);
    });

    it("FE-15 duration is whole minutes, rounded (the server coerces to int)", async () => {
      expect(parseDurationMinutes("12.6")).to.equal(13);
      expect(parseDurationMinutes("7,4")).to.equal(7);
      expect(parseDurationMinutes("")).to.equal(null);
      expect(parseDurationMinutes("-3")).to.equal(null);
      const { el, sent } = await mountDialog({});
      const duration = [...el.shadowRoot!.querySelectorAll<HTMLInputElement>(".field-input")][2];
      expect(duration.step).to.equal("1");
      duration.value = "12.6";
      duration.dispatchEvent(new Event("input"));
      clickComplete(el);
      await tick();
      expect(complete(sent)!.duration).to.equal(13);
    });
  });

  // ── FE-7: part restock double submit ─────────────────────────────────────
  it("FE-7 a second restock while the first is in flight is ignored", async () => {
    const gate = deferred<unknown>();
    const sent: Array<Record<string, unknown>> = [];
    const hass = {
      language: "en",
      connection: { sendMessagePromise: (msg: Record<string, unknown>) => { sent.push(msg); return gate.promise; } },
    };
    const el = await fixture<MaintenancePartsSection>(html`
      <maintenance-parts-section .hass=${hass as never} .entryId=${"e1"} .canWrite=${true}
        .parts=${[{ id: "p1", name: "Filter", stock: 1, is_low: false, restock_quantity: 2 }] as never}></maintenance-parts-section>
    `);
    const priv = el as unknown as { _restock: (p: unknown) => Promise<void>; parts: unknown[]; _restockQty: string };
    priv._restockQty = "2";
    const first = priv._restock(priv.parts[0]);
    void priv._restock(priv.parts[0]); // Enter + ✓ / double Enter
    await tick();
    gate.resolve({ stock: 3 });
    await first;
    expect(sent.filter((m) => m.type === "maintenance_supporter/part/restock").length).to.equal(1);
  });

  // ── FE-8: checklist ticks compose ────────────────────────────────────────
  it("FE-8 two quick checklist ticks both survive", async () => {
    resetTaskSeq();
    const progress: Record<string, boolean> = {};
    const tk = panelTask({ checklist: ["A", "B"], checklist_progress: progress });
    const { el, sent } = await mountPanel([obj("e1", [tk])], {
      "maintenance_supporter/objects": () => ({ objects: [obj("e1", [{ ...tk, checklist_progress: { ...progress } }])] }),
      "maintenance_supporter/task/checklist_progress": async (msg) => {
        await tick(30);
        Object.assign(progress, msg.checklist_state as Record<string, boolean>);
        return { success: true };
      },
    });
    const panel = el as unknown as { _setChecklistItem: (e: string, t: string, i: string, d: boolean) => Promise<void> };
    const a = panel._setChecklistItem("e1", "t1", "A", true);
    const b = panel._setChecklistItem("e1", "t1", "B", true);
    await Promise.all([a, b]);
    const states = sent.filter((m) => m.type === "maintenance_supporter/task/checklist_progress").map((m) => m.checklist_state);
    expect(states[states.length - 1]).to.deep.equal({ A: true, B: true });
    expect(progress).to.deep.equal({ A: true, B: true });
  });

  // ── FE-9: history order by timestamp ─────────────────────────────────────
  it("FE-9 a backdated entry (appended last) is not shown as the newest", () => {
    const history = [
      { timestamp: "2026-09-01T10:00:00", type: "completed", notes: "sep" },
      { timestamp: "2026-09-20T10:00:00", type: "completed", notes: "latest" },
      { timestamp: "2026-08-15T10:00:00", type: "completed", notes: "backdated #133" },
    ];
    expect(newestFirst(history).map((h) => h.notes)).to.deep.equal(["latest", "sep", "backdated #133"]);
    // Same timestamp: later appended counts as newer (stable).
    const tie = [{ timestamp: "2026-09-01", n: 1 }, { timestamp: "2026-09-01", n: 2 }];
    expect(newestFirst(tie).map((h) => h.n)).to.deep.equal([2, 1]);
  });

  // ── FE-10: card header badges follow the live list ───────────────────────
  it("FE-10 card header badges follow subscription updates", async () => {
    const overdueTask = wireTask({ status: "overdue", days_until_due: -2 });
    const objects = [{ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [overdueTask] }];
    const { hass, subscriptions } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => ({ objects }),
        "maintenance_supporter/statistics": () => ({ overdue: 7, due_soon: 0, triggered: 0 }),
      },
    });
    (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
    const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card", show_documents: false } as never);
    el.hass = hass as never;
    await waitUntil(() => el.shadowRoot!.querySelector(".badge.overdue"), "badge");
    expect(el.shadowRoot!.querySelector(".badge.overdue")!.textContent!.trim(), "counted from the list").to.equal("1");
    await waitUntil(() => subscriptions.length > 0, "subscribed");
    subscriptions[0].push({ objects: [{ ...objects[0], tasks: [{ ...overdueTask, status: "ok", days_until_due: 20 }] }] });
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".badge.overdue"), "badge gone after the completion").to.equal(null);
  });

  it("FE-10 the card shows a loading line (not 'no tasks yet') until the first list lands, already view-scoped", async () => {
    const objectsGate = deferred<unknown>();
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/objects": () => objectsGate.promise,
        "maintenance_supporter/statistics": () => ({}),
        "maintenance_supporter/views/list": () => ({ views: [{ id: "v", name: "Urgent", filters: { status: "overdue" } }] }),
      },
    });
    (hass as Record<string, unknown>).user = { id: "admin", is_admin: true };
    const el = await fixture<MaintenanceSupporterCard>(html`<maintenance-supporter-card></maintenance-supporter-card>`);
    el.setConfig({ type: "custom:maintenance-supporter-card", show_documents: false, view_id: "v" } as never);
    el.hass = hass as never;
    await tick();
    expect(el.shadowRoot!.querySelector(".card-loading"), "loading line").to.exist;
    expect(el.shadowRoot!.querySelector(".empty-card"), "no premature empty state").to.equal(null);
    objectsGate.resolve({
      objects: [{ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [wireTask({ id: "a", name: "Late", status: "overdue" }), wireTask({ id: "b", name: "Fine", status: "ok" })] }],
    });
    await waitUntil(() => el.shadowRoot!.querySelectorAll(".task-name").length > 0, "rows");
    const names = [...el.shadowRoot!.querySelectorAll(".task-name")].map((n) => n.textContent!.trim());
    expect(names, "first paint already scoped by the view").to.deep.equal(["Late"]);
  });

  // ── FE-12: documents section reused across objects ──────────────────────
  it("FE-12 documents: a stale list for the previous object is dropped and forms reset", async () => {
    const slow = deferred<unknown>();
    const { hass } = createMockHass({
      handlers: {
        "maintenance_supporter/documents/list": (msg) => (msg.entry_id === "e1"
          ? slow.promise
          : { documents: [{ id: "d2", kind: "weblink", title: "Car manual", url: "https://example.com/car" }] }),
      },
    });
    const el = await fixture<MaintenanceDocumentsSection>(html`
      <maintenance-documents-section .hass=${hass} .entryId=${"e1"} .canWrite=${true}></maintenance-documents-section>
    `);
    const priv = el as unknown as { _addingLink: boolean; _linkUrl: string; _docs: Array<{ id: string }> };
    priv._addingLink = true;
    priv._linkUrl = "https://example.com/for-e1";
    el.entryId = "e2";
    await el.updateComplete;
    await tick();
    expect(priv._addingLink, "link form closed").to.equal(false);
    expect(priv._linkUrl).to.equal("");
    slow.resolve({ documents: [{ id: "d1", kind: "weblink", title: "Boiler manual", url: "https://example.com/boiler" }] });
    await tick();
    expect(priv._docs.map((d) => d.id), "e1's late answer ignored").to.deep.equal(["d2"]);
  });

  // ── FE-13: out-of-order responses ────────────────────────────────────────
  describe("FE-13 out-of-order responses", () => {
    it("storage search: an older, slower answer does not overwrite a newer one", async () => {
      const answers: Record<string, ReturnType<typeof deferred<unknown>>> = { fil: deferred(), filter: deferred() };
      const { hass } = createMockHass({
        handlers: {
          "maintenance_supporter/documents/storage": () => ({ total_bytes: 0, dedup_savings_bytes: 0, file_count: 0, link_count: 0, document_count: 0, by_object: {} }),
          "maintenance_supporter/documents/search": (msg) => answers[msg.query as string].promise,
        },
      });
      const el = await fixture<MaintenanceStorageSectionCard>(html`
        <maintenance-storage-section-card .hass=${hass} .objects=${[]}></maintenance-storage-section-card>
      `);
      const priv = el as unknown as { _query: string; _doSearch: () => Promise<void>; _results: Array<{ id: string }> };
      priv._query = "fil";
      const older = priv._doSearch();
      priv._query = "filter";
      const newer = priv._doSearch();
      answers.filter.resolve({ results: [{ id: "new" }] });
      await newer;
      answers.fil.resolve({ results: [{ id: "old" }] });
      await older;
      expect(priv._results.map((r) => r.id)).to.deep.equal(["new"]);
    });

    it("history edit: part options of a previous entry never land on the reopened dialog", async () => {
      const overview = { parts: [
        { part_id: "p_a", name: "A", entry_id: "e1", object_name: "One", consumers: [] },
        { part_id: "p_b", name: "B", entry_id: "e2", object_name: "Two", consumers: [] },
      ] };
      const calls: Array<ReturnType<typeof deferred<unknown>>> = [];
      const { hass } = createMockHass({
        handlers: { "maintenance_supporter/parts/overview": () => { const d = deferred<unknown>(); calls.push(d); return d.promise; } },
      });
      const el = await fixture<MaintenanceHistoryEditDialog>(html`<maintenance-history-edit-dialog .hass=${hass}></maintenance-history-edit-dialog>`);
      const draft = (entry: string): HistoryEntryDraft => ({
        entry_id: entry, task_id: "t1", original_timestamp: "2026-08-01T10:00:00", type: "completed",
        timestamp: "2026-08-01T10:00:00", notes: null, cost: null, duration: null, completed_by: null,
      });
      el.openEdit(draft("e1"));
      el.close();
      el.openEdit(draft("e2"));
      calls[1].resolve(overview);
      await tick();
      calls[0].resolve(overview);
      await tick();
      const options = (el as unknown as { _partOptions: Array<{ part_id: string }> })._partOptions;
      expect(options.map((o) => o.part_id)).to.deep.equal(["p_b"]);
    });

    it("chart range: the answer for an older range chip is dropped", async () => {
      resetTaskSeq();
      const { el } = await mountPanel([obj("e1", [panelTask()])]);
      const answers = [deferred<unknown[]>(), deferred<unknown[]>()];
      let n = 0;
      const panel = el as unknown as {
        _statsService: unknown; _fetchDetailStats: (id: string, c: boolean) => Promise<void>;
        _detailStatsData: Map<string, unknown[]>;
      };
      panel._statsService = {
        getDetailStats: () => answers[n++].promise,
        getBatchMiniStats: async () => new Map(),
        clearCache: () => undefined,
      };
      const first = panel._fetchDetailStats("sensor.x", false);
      const second = panel._fetchDetailStats("sensor.x", false);
      answers[1].resolve([{ v: "30d" }]);
      await second;
      answers[0].resolve([{ v: "7d" }]);
      await first;
      expect(panel._detailStatsData.get("sensor.x")).to.deep.equal([{ v: "30d" }]);
    });
  });

  // ── FE-14: camera double tap ─────────────────────────────────────────────
  it("FE-14 a double tap opens the camera once", async () => {
    const canvas = document.createElement("canvas");
    canvas.getContext("2d")!.fillRect(0, 0, 4, 4);
    const stream = canvas.captureStream(5);
    const md = navigator.mediaDevices;
    const real = md.getUserMedia;
    let calls = 0;
    md.getUserMedia = async () => { calls++; await tick(20); return stream; };
    try {
      const el = await fixture<MsCameraCapture>(html`<ms-camera-capture></ms-camera-capture>`);
      await Promise.all([el.open(), el.open()]);
      expect(calls).to.equal(1);
      el.close();
    } finally {
      md.getUserMedia = real;
    }
  });

  // ── FE-15: worksheet date + calendar singular ────────────────────────────
  describe("FE-15 small formatting bugs", () => {
    it("the work sheet footer prints the LOCAL day through the profile date format", () => {
      const now = new Date(2026, 6, 29, 0, 30); // 00:30 local — the UTC day may still be the 28th
      const L = new Proxy({} as never, {
        get: (_t, k) => (k === "typeLabel" || k === "statusLabel" ? (v: string) => v : typeof k === "string" ? k : ""),
      });
      const sheet = buildTaskWorksheetHtml(
        { name: "Filter", type: "custom", checklist: [] } as never, "Pump", L,
        (iso: string) => `F<${iso}>`, () => "—", null, null, null, now.toISOString(),
      );
      const footer = /<footer>([^<]*)<\/footer>/.exec(sheet.replace(/&lt;|&gt;/g, (m) => (m === "&lt;" ? "[" : "]")))![1];
      expect(footer).to.contain(`F[${isoDateLocal(now)}]`);
    });

    it("the calendar card says 'every day', not 'every 1 days'", async () => {
      const soon = new Date();
      soon.setDate(soon.getDate() + 2);
      const { hass } = createMockHass({
        handlers: {
          "maintenance_supporter/objects": () => ({
            objects: [{ entry_id: "e1", object: { id: "o1", name: "Pump", area_id: null }, tasks: [wireTask({ interval_days: 1, days_until_due: 2, next_due: isoDateLocal(soon) })] }],
          }),
          "maintenance_supporter/statistics": () => ({}),
        },
      });
      const el = await fixture<HTMLElement & { updateComplete: Promise<unknown> }>(html`
        <maintenance-supporter-calendar-card .hass=${hass}></maintenance-supporter-calendar-card>
      `);
      await waitUntil(() => el.shadowRoot!.querySelector(".cal-event-recur"), "projected recurrences");
      const labels = [...el.shadowRoot!.querySelectorAll(".cal-event-recur")].map((r) => r.textContent!.trim());
      expect(labels[0]).to.equal(t("cal_every_day", "en"));
      expect(labels.join(" ")).to.not.contain("every 1 days");
    });
  });
});
