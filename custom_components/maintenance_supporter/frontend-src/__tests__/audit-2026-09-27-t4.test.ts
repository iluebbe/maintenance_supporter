/**
 * Bug audit #2 (2026-09-26), tranche 4 — frontend regressions.
 *
 * One `describe` per finding (M13/M14/M15 = Medium 13–15, L* = the frontend
 * Low items). Every test fails on the code before the fix.
 */

import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import { render } from "lit";
import "../components/complete-dialog.js";
import "../components/history-edit-dialog.js";
import "../components/task-dialog.js";
import "../components/task-quick-actions-dialog.js";
import "../components/camera-capture.js";
import "../maintenance-calendar-card.js";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import type { HistoryEntryDraft, MaintenanceHistoryEditDialog } from "../components/history-edit-dialog";
import type { MaintenanceTaskDialog } from "../components/task-dialog";
import type { MaintenanceTaskQuickActionsDialog } from "../components/task-quick-actions-dialog";
import type { MsCameraCapture } from "../components/camera-capture";
import { discardUploadedPhotos } from "../helpers/photo-upload.js";
import { loadHistoryEntryDraft } from "../helpers/history-draft.js";
import { isoDateLocal, pastHistoryGaps } from "../helpers/calendar-bucket.js";
import { haToday } from "../helpers/ha-time.js";
import { buildCompleteDialogArgs } from "../helpers/complete-dialog-args.js";
import { renderHistoryEntry } from "../renderers/history.js";
import { renderTaskDetail, type TaskDetailContext } from "../renderers/task-detail.js";
import { invalidateSettingsCache } from "../helpers/settings-cache.js";
import type { HistoryEntry, MaintenanceTask } from "../types";
import { DEFAULT_SETTINGS_RESPONSE, createMockHass, type SentMessage } from "./_test-utils.js";
import { mountPanel, obj, resetTaskSeq, task as panelTask } from "./_panel-utils.js";

const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => { resolve = r; });
  return { promise, resolve };
}

const DISCARD = "maintenance_supporter/documents/discard_upload";
const discards = (sent: SentMessage[]) => sent.filter((m) => m.type === DISCARD).map((m) => ({ entry_id: m.entry_id, doc_id: m.doc_id }));

/** Stub the multipart upload route; each upload waits for `gates[i](id)`. */
function gatedUpload() {
  const realFetch = window.fetch;
  const gates: Array<(id: string) => void> = [];
  window.fetch = (() => new Promise<Response>((resolve) => {
    gates.push((id) => resolve({ ok: true, status: 200, json: async () => ({ id }) } as Response));
  })) as typeof window.fetch;
  return { gates, restore: () => { window.fetch = realFetch; } };
}

function pickFiles(root: ShadowRoot, names: string[]) {
  const input = root.querySelector<HTMLInputElement>('.photo-pick-gallery input[type="file"]')!;
  const dt = new DataTransfer();
  for (const name of names) dt.items.add(new File(["png"], name, { type: "image/png" }));
  input.files = dt.files;
  input.dispatchEvent(new Event("change"));
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

async function mountComplete() {
  const { hass, sent } = createMockHass({
    handlers: { "maintenance_supporter/task/complete": () => ({ success: true }) },
  });
  const el = await fixture<MaintenanceCompleteDialog>(html`
    <maintenance-complete-dialog .hass=${hass} .entryId=${"entry1"} .taskId=${"task1"}
      .taskName=${"Filter"} .lang=${"en"}></maintenance-complete-dialog>
  `);
  el.open();
  await el.updateComplete;
  return { el, sent };
}

const completeButton = (el: MaintenanceCompleteDialog) => {
  const buttons = [...el.shadowRoot!.querySelectorAll<HTMLElement & { disabled: boolean }>(".dialog-actions ha-button")];
  return buttons[buttons.length - 1];
};
const cancelButton = (el: MaintenanceCompleteDialog) =>
  el.shadowRoot!.querySelector<HTMLElement>(".dialog-actions ha-button")!;

function draft(partial: Partial<HistoryEntryDraft> = {}): HistoryEntryDraft {
  return {
    entry_id: "e1", task_id: "t1",
    original_timestamp: "2026-08-01T10:00:00",
    type: "completed", timestamp: "2026-08-01T10:00:00",
    notes: null, cost: null, duration: null, completed_by: null,
    ...partial,
  };
}

async function mountHistoryEdit(handlers: Record<string, (msg: SentMessage) => unknown> = {}) {
  const { hass, sent } = createMockHass({
    handlers: {
      "maintenance_supporter/parts/overview": () => ({ parts: [] }),
      "maintenance_supporter/task/history/update": () => ({ success: true }),
      "auth/sign_path": () => ({ path: "/api/maintenance_supporter/document/x?authSig=y" }),
      ...handlers,
    },
  });
  const el = await fixture<MaintenanceHistoryEditDialog>(html`
    <maintenance-history-edit-dialog .hass=${hass}></maintenance-history-edit-dialog>
  `);
  return { el, sent };
}

type HistoryEditPriv = { _set: (k: "notes", v: string) => void; _save: () => Promise<void> };

/** Mount the Lovelace task quick-actions dialog with one task. */
async function mountQuickActions(taskOver: Record<string, unknown>, user: { id: string; is_admin: boolean }, settings: Record<string, unknown> = {}) {
  const { hass, sent } = createMockHass({
    settingsResponse: { ...DEFAULT_SETTINGS_RESPONSE, ...settings } as never,
    handlers: {
      "maintenance_supporter/object": () => ({
        entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [wireTask(taskOver)],
      }),
    },
  });
  (hass as Record<string, unknown>).user = user;
  const el = await fixture<MaintenanceTaskQuickActionsDialog>(html`
    <maintenance-task-quick-actions-dialog .hass=${hass}></maintenance-task-quick-actions-dialog>
  `);
  await el.openFor("e1", "t1");
  await el.updateComplete;
  return { el, sent };
}

const MEMBER = { id: "member", is_admin: false };
const ADMIN = { id: "admin", is_admin: true };

describe("bug audit 2026-09-26 #2, tranche 4 (frontend)", () => {
  beforeEach(() => invalidateSettingsCache());

  // ── M13: completion-photo cleanup for everyone + no save mid-upload ────
  describe("M13 completion photos", () => {
    it("the cleanup goes through the read-tier discard_upload, naming the object", async () => {
      const { hass, sent } = createMockHass();
      await discardUploadedPhotos(hass as never, "e1", ["d1", "d2"]);
      expect(discards(sent)).to.deep.equal([{ entry_id: "e1", doc_id: "d1" }, { entry_id: "e1", doc_id: "d2" }]);
      expect(sent.some((m) => m.type === "maintenance_supporter/documents/delete"), "never the write-gated delete").to.equal(false);
    });

    it("complete dialog: ✕ and Cancel discard through discard_upload with the entry id", async () => {
      const { el, sent } = await mountComplete();
      const up = gatedUpload();
      try {
        pickFiles(el.shadowRoot!, ["a.png", "b.png"]);
        await tick();
        up.gates[0]("up-1");
        await tick();
        up.gates[1]("up-2");
        await tick();
        await el.updateComplete;
        el.shadowRoot!.querySelector<HTMLElement>(".photo-remove")!.click();
        cancelButton(el).click();
        await tick();
        expect(discards(sent)).to.deep.equal([{ entry_id: "entry1", doc_id: "up-1" }, { entry_id: "entry1", doc_id: "up-2" }]);
      } finally {
        up.restore();
      }
    });

    it("complete dialog: Complete is disabled while a photo uploads and a late upload after Cancel is discarded", async () => {
      const { el, sent } = await mountComplete();
      const up = gatedUpload();
      try {
        pickFiles(el.shadowRoot!, ["a.png"]);
        await tick();
        await el.updateComplete;
        expect(completeButton(el).disabled, "no completion while uploading").to.equal(true);
        expect(completeButton(el).getAttribute("title"), "says why").to.equal("Uploading…");
        await (el as unknown as { _complete: () => Promise<void> })._complete();
        expect(sent.some((m) => m.type === "maintenance_supporter/task/complete"), "guarded in the handler too").to.equal(false);

        cancelButton(el).click();
        await el.updateComplete;
        up.gates[0]("late-1");
        await tick();
        expect(discards(sent), "the orphan is dropped on arrival").to.deep.equal([{ entry_id: "entry1", doc_id: "late-1" }]);

        // The next session starts clean — the late upload never joins it.
        el.open();
        await el.updateComplete;
        expect(el.shadowRoot!.querySelectorAll(".photo-preview").length).to.equal(0);
        expect(completeButton(el).disabled).to.equal(false);
      } finally {
        up.restore();
      }
    });

    it("complete dialog: Complete re-enables once the upload landed and sends the photo", async () => {
      const { el, sent } = await mountComplete();
      const up = gatedUpload();
      try {
        pickFiles(el.shadowRoot!, ["a.png"]);
        await tick();
        up.gates[0]("up-9");
        await tick();
        await el.updateComplete;
        expect(completeButton(el).disabled).to.equal(false);
        completeButton(el).click();
        await tick();
        expect(sent.find((m) => m.type === "maintenance_supporter/task/complete")!.photo_doc_ids).to.deep.equal(["up-9"]);
        expect(discards(sent)).to.deep.equal([]);
      } finally {
        up.restore();
      }
    });

    it("history edit: Save is disabled while a photo uploads; a late upload after close is discarded", async () => {
      const { el, sent } = await mountHistoryEdit();
      const up = gatedUpload();
      try {
        el.openEdit(draft({ notes: "x" }));
        await el.updateComplete;
        await tick();
        pickFiles(el.shadowRoot!, ["a.png"]);
        await tick();
        await el.updateComplete;
        const save = el.shadowRoot!.querySelector<HTMLButtonElement>("button.save")!;
        expect(save.disabled, "no save while uploading").to.equal(true);
        (el as unknown as HistoryEditPriv)._set("notes", "changed");
        await (el as unknown as HistoryEditPriv)._save();
        expect(sent.some((m) => m.type === "maintenance_supporter/task/history/update")).to.equal(false);

        el.close();
        up.gates[0]("late-h");
        await tick();
        expect(discards(sent)).to.deep.equal([{ entry_id: "e1", doc_id: "late-h" }]);
      } finally {
        up.restore();
      }
    });
  });

  // ── M14: calendar past events beyond the 20-entry window ────────────────
  describe("M14 capped history in the calendar", () => {
    it("loadHistoryEntryDraft finds an entry older than the listed window via task/history", async () => {
      const listed = Array.from({ length: 20 }, (_, i) => ({ timestamp: isoDaysAgo(20 - i), type: "completed" }));
      const old = { timestamp: isoDaysAgo(40), type: "completed", notes: "the old one", cost: 7 };
      const { hass, sent } = createMockHass({
        handlers: {
          "maintenance_supporter/object": () => ({ tasks: [{ id: "t1", type: "custom", history: listed }] }),
          "maintenance_supporter/task/history": () => ({ history: [old, ...listed] }),
        },
      });
      const d = await loadHistoryEntryDraft(hass as never, "e1", "t1", old.timestamp);
      expect(d?.notes).to.equal("the old one");
      expect(d?.cost).to.equal(7);
      const full = sent.find((m) => m.type === "maintenance_supporter/task/history")!;
      expect([full.entry_id, full.task_id]).to.deep.equal(["e1", "t1"]);
      // A listed entry needs no second round trip.
      sent.length = 0;
      await loadHistoryEntryDraft(hass as never, "e1", "t1", listed[5].timestamp);
      expect(sent.map((m) => m.type)).to.deep.equal(["maintenance_supporter/object"]);
    });

    it("the refetch signature changes when a listed entry is edited (same count)", () => {
      const today = haToday();
      const listed = Array.from({ length: 20 }, (_, i) => ({ timestamp: isoDaysAgo(19 - i), type: "completed", notes: "n" }));
      const objects = (history: unknown[]) => [{
        entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [wireTask({ history, history_count: 28 })],
      }] as never;
      const before = pastHistoryGaps(objects(listed), today, 30)[0].sig;
      expect(pastHistoryGaps(objects(listed.map((h) => ({ ...h }))), today, 30)[0].sig, "stable without a change").to.equal(before);
      const edited = listed.map((h, i) => (i === 3 ? { ...h, notes: "fixed typo" } : h));
      expect(pastHistoryGaps(objects(edited), today, 30)[0].sig).to.not.equal(before);
    });

    it("the calendar card reloads a fetched full history when one of its entries was saved", async () => {
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
        setConfig: (c: unknown) => void; hass: unknown;
      };
      el.setConfig({ type: "custom:maintenance-supporter-calendar-card", past_days: 30 });
      el.hass = hass;
      document.body.appendChild(el);
      const fetches = () => sent.filter((m) => m.type === "maintenance_supporter/task/history").length;
      try {
        await waitUntil(() => el.shadowRoot!.querySelectorAll(".cal-event").length === 25, "25 past events", { timeout: 3000 });
        expect(fetches()).to.equal(1);
        // An old entry (outside the listed 20) edited on the page: the list
        // payload does not change, the event does.
        window.dispatchEvent(new CustomEvent("history-entry-saved", { detail: { entry_id: "e1", task_id: "t1" } }));
        await waitUntil(() => fetches() === 2, "refetched after the save", { timeout: 2000 });
        // A task without a fetched history is none of the card's business.
        window.dispatchEvent(new CustomEvent("history-entry-saved", { detail: { entry_id: "e1", task_id: "other" } }));
        await tick(50);
        expect(fetches()).to.equal(2);
      } finally {
        el.remove();
      }
    });
  });

  // ── M15: typing before parts/overview answered ─────────────────────────
  it("M15 the history-edit parts section survives an edit typed before parts/overview answers", async () => {
    const gate = deferred<unknown>();
    const { el, sent } = await mountHistoryEdit({ "maintenance_supporter/parts/overview": () => gate.promise });
    el.openEdit(draft({ used_parts: [{ part_id: "p1", name: "Filter", quantity: 1 }] }));
    await el.updateComplete;
    (el as unknown as HistoryEditPriv)._set("notes", "typed early");
    gate.resolve({ parts: [{ part_id: "p1", name: "Filter", entry_id: "e1", object_name: "Pump", consumers: [] }] });
    await tick();
    await el.updateComplete;
    expect(!!el.shadowRoot!.querySelector(".parts-block"), "parts section rendered").to.equal(true);
    // Untick the part → the save carries the corrected consumption.
    const box = el.shadowRoot!.querySelector<HTMLInputElement>(".part-row-edit input[type=checkbox]")!;
    box.checked = false;
    box.dispatchEvent(new Event("change"));
    await (el as unknown as HistoryEditPriv)._save();
    const patch = sent.find((m) => m.type === "maintenance_supporter/task/history/update")!;
    expect(patch.notes).to.equal("typed early");
    expect(patch.used_parts).to.deep.equal([]);
  });

  // ── Low items ───────────────────────────────────────────────────────────
  describe("Low", () => {
    it("a buy task whose part stores restock_quantity 0 prefills 1, a real default stays", () => {
      const args = (restock: unknown) => buildCompleteDialogArgs({
        entryId: "e1", taskId: "t1", taskName: "Buy salt",
        task: { id: "t1", name: "Buy salt", part_ref: { part_id: "p1" }, history: [] } as never,
        objects: [{ entry_id: "e1", object: { name: "Softener" }, parts: [{ id: "p1", name: "Salt", restock_quantity: restock }] }] as never,
        lang: "en",
      }).restock_default;
      expect(args(0)).to.equal(1);
      expect(args(-2)).to.equal(1);
      expect(args(null)).to.equal(1);
      expect(args(2.5)).to.equal(2.5);
    });

    describe("task dialog part quantities keep the typed text", () => {
      async function mountTaskDialog(taskOver: Record<string, unknown>) {
        const { hass, sent } = createMockHass({
          handlers: {
            "maintenance_supporter/object": () => ({ parts: [{ id: "p1", name: "Filter" }] }),
            "maintenance_supporter/task/update": () => ({ success: true }),
          },
        });
        const el = await fixture<MaintenanceTaskDialog>(html`<maintenance-task-dialog .hass=${hass}></maintenance-task-dialog>`);
        await el.openEdit("e1", {
          id: "t1", name: "Service", type: "custom", schedule_type: "time_based",
          interval_days: 30, warning_days: 7, enabled: true, ...taskOver,
        } as never);
        await el.updateComplete;
        return { el, sent };
      }
      const type = async (el: MaintenanceTaskDialog, input: HTMLInputElement, value: string) => {
        input.value = value;
        input.dispatchEvent(new Event("input"));
        await el.updateComplete;
      };
      const save = (el: MaintenanceTaskDialog) => (el as unknown as { _save: () => Promise<void> })._save();

      it("consumes_parts: clearing 2 and typing 3 saves 3 (not 13)", async () => {
        const { el, sent } = await mountTaskDialog({ consumes_parts: [{ part_id: "p1", quantity: 2 }] });
        const qty = el.shadowRoot!.querySelector<HTMLInputElement>(".consumes-qty")!;
        await type(el, qty, "");
        expect(qty.value, "not rewritten to 1").to.equal("");
        await type(el, qty, "3");
        expect(qty.value).to.equal("3");
        await save(el);
        const msg = sent.find((m) => m.type === "maintenance_supporter/task/update")!;
        expect(msg.consumes_parts).to.deep.equal([{ part_id: "p1", quantity: 3 }]);
      });

      it("consumes_parts: an empty quantity is refused with a message, nothing sent", async () => {
        const { el, sent } = await mountTaskDialog({ consumes_parts: [{ part_id: "p1", quantity: 2 }] });
        await type(el, el.shadowRoot!.querySelector<HTMLInputElement>(".consumes-qty")!, "");
        await save(el);
        await el.updateComplete;
        expect(sent.some((m) => m.type === "maintenance_supporter/task/update")).to.equal(false);
        expect(el.shadowRoot!.querySelector(".error")!.textContent).to.match(/10[,.\u00a0\u202f]?000/);
      });

      it("phase part: clearing 2 and typing 3 saves 3", async () => {
        const { el, sent } = await mountTaskDialog({
          phases: { a: { name: "A", consumes_parts: [{ part_id: "p1", quantity: 2 }] } },
          phase_sequence: ["a"],
        });
        const qty = el.shadowRoot!.querySelector<HTMLInputElement>(".phase-qty")!;
        expect(qty.value).to.equal("2");
        await type(el, qty, "");
        expect(qty.value, "not rewritten to 1").to.equal("");
        await type(el, qty, "3");
        await save(el);
        const msg = sent.find((m) => m.type === "maintenance_supporter/task/update")! as Record<string, unknown>;
        const phases = msg.phases as Record<string, { consumes_parts: unknown }>;
        expect(phases.a.consumes_parts).to.deep.equal([{ part_id: "p1", quantity: 3 }]);
      });
    });

    describe("history pencil + Apply suggestion follow canWrite", () => {
      const entry = { timestamp: "2026-09-01T10:00:00", type: "completed", notes: "done" } as HistoryEntry;

      it("the shared history row draws the pencil only with an openEdit", () => {
        const { hass } = createMockHass();
        const host = document.createElement("div");
        render(renderHistoryEntry(entry, { lang: "en", hass: hass as never, currencySymbol: "€" }), host);
        expect(!!host.querySelector(".history-edit-btn"), "read-only: no pencil").to.equal(false);
        render(renderHistoryEntry(entry, { lang: "en", hass: hass as never, currencySymbol: "€", openEdit: () => undefined }), host);
        expect(!!host.querySelector(".history-edit-btn")).to.equal(true);
      });

      it("quick-actions: no pencil and no Apply for a plain member, both for an admin", async () => {
        const over = { history: [entry], suggested_interval: 45, interval_confidence: "high" };
        const settings = { features: { ...DEFAULT_SETTINGS_RESPONSE.features, adaptive: true } };
        for (const [user, expected] of [[MEMBER, false], [ADMIN, true]] as const) {
          invalidateSettingsCache();
          const { el } = await mountQuickActions(over, user, settings);
          const priv = el as unknown as { _showDetails: boolean; _showAdaptive: boolean };
          priv._showDetails = true;
          priv._showAdaptive = true;
          await el.updateComplete;
          expect(!!el.shadowRoot!.querySelector(".history-edit-btn"), `pencil for ${user.id}`).to.equal(expected);
          expect(!!el.shadowRoot!.querySelector(".qa-apply-suggestion"), `apply for ${user.id}`).to.equal(expected);
        }
      });

      it("task detail: Apply suggestion is hidden in operator (read-only) mode", () => {
        const { hass } = createMockHass();
        const ctx = (isOperator: boolean): TaskDetailContext => ({
          lang: "en", hass: hass as never, entryId: "e1", taskId: "t1", objectName: "Pump",
          objectDocUrl: null, objectManualDocs: [], openManualDoc: () => undefined,
          setChecklistItem: () => undefined, setPhaseCursor: () => undefined,
          isOperator, actionLoading: false, moreMenuOpen: false, activeTab: "overview",
          features: { ...DEFAULT_SETTINGS_RESPONSE.features, adaptive: true },
          currencySymbol: "€", collapsedSections: new Set(), costDurationToggle: "both",
          suggestionDismissed: false,
          sparkline: {
            lang: "en", detailStatsData: new Map(), hasStatsService: false, isCounterEntity: () => false,
            rangeDays: 30, setRangeDays: () => undefined, hideOutliers: false, setHideOutliers: () => undefined,
          } as never,
          history: { lang: "en", hass: hass as never, filter: null, search: "", currencySymbol: "€", setFilter: () => undefined, setSearch: () => undefined },
          getUserName: () => null, setActiveTab: () => undefined, toggleSection: () => undefined,
          setCostDurationToggle: () => undefined, showTaskView: () => undefined, showObject: () => undefined,
          toggleMoreMenu: () => undefined, closeMoreMenu: () => undefined, openEdit: () => undefined,
          openComplete: () => undefined, promptSkip: () => undefined, toggleArchive: () => undefined, togglePause: () => undefined,
          openQr: () => undefined, duplicateTask: () => undefined, moveTask: () => undefined,
          promptReset: () => undefined, promptPostpone: () => undefined, snoozeTask: () => undefined,
          printWorksheet: () => undefined, deleteTask: () => undefined, applySuggestion: () => undefined,
          reanalyze: () => undefined, dismissSuggestion: () => undefined, openSeasonalOverrides: () => undefined,
        });
        const tk = wireTask({ suggested_interval: 45, interval_confidence: "high", status: "ok" }) as unknown as MaintenanceTask;
        const host = document.createElement("div");
        render(renderTaskDetail(tk, ctx(true)), host);
        expect(!!host.querySelector(".recommendation-card"), "the suggestion itself stays visible").to.equal(true);
        expect(!!host.querySelector(".apply-suggestion")).to.equal(false);
        render(renderTaskDetail(tk, ctx(false)), host);
        expect(!!host.querySelector(".apply-suggestion")).to.equal(true);
      });

      it("panel: the history context carries no openEdit for a read-only member", async () => {
        resetTaskSeq();
        const member = await mountPanel([obj("e1", [panelTask()])], {}, { user: MEMBER });
        expect((member.el as unknown as { _historyCtx: () => { openEdit?: unknown } })._historyCtx().openEdit === undefined).to.equal(true);
        resetTaskSeq();
        const admin = await mountPanel([obj("e1", [panelTask()])]);
        expect(typeof (admin.el as unknown as { _historyCtx: () => { openEdit?: unknown } })._historyCtx().openEdit).to.equal("function");
      });
    });

    it("quick-actions: an older object answer never replaces the newer task (no stuck Loading)", async () => {
      const answers: Record<string, ReturnType<typeof deferred<unknown>>> = { e1: deferred(), e2: deferred() };
      const { hass } = createMockHass({
        handlers: { "maintenance_supporter/object": (msg) => answers[msg.entry_id as string].promise },
      });
      (hass as Record<string, unknown>).user = ADMIN;
      const el = await fixture<MaintenanceTaskQuickActionsDialog>(html`
        <maintenance-task-quick-actions-dialog .hass=${hass}></maintenance-task-quick-actions-dialog>
      `);
      const first = el.openFor("e1", "t1");
      const second = el.openFor("e2", "t2");
      answers.e2.resolve({ entry_id: "e2", object: { id: "o2", name: "Car" }, tasks: [wireTask({ id: "t2", name: "Tyres" })] });
      await second;
      answers.e1.resolve({ entry_id: "e1", object: { id: "o1", name: "Pump" }, tasks: [wireTask({ id: "t1", name: "Filter" })] });
      await first;
      await el.updateComplete;
      expect(!!el.shadowRoot!.querySelector(".loading"), "not stuck on Loading").to.equal(false);
      expect(el.shadowRoot!.querySelector(".task-name")!.textContent).to.equal("Tyres");
    });

    it("quick-actions: a deleted task shows an error instead of Loading forever", async () => {
      const { el } = await mountQuickActions({ id: "somebody-else" }, ADMIN);
      expect(!!el.shadowRoot!.querySelector(".loading")).to.equal(false);
      expect(!!el.shadowRoot!.querySelector(".error")).to.equal(true);
    });

    it("worksheet: the tab opens inside the click, the sheet lands in it after the awaits", async () => {
      resetTaskSeq();
      const { el } = await mountPanel([obj("e1", [panelTask()])]);
      const opened: string[] = [];
      const tab = { closed: false, location: { href: "" }, close() { this.closed = true; } };
      const orig = window.open;
      (window as unknown as { open: unknown }).open = (url?: string) => { opened.push(url || ""); return tab; };
      let openedInClick: string[] = [];
      try {
        const done = (el as unknown as { _printTaskWorksheet: (e: string, t: string) => Promise<void> })._printTaskWorksheet("e1", "t1");
        openedInClick = [...opened];
        await done; // inside the stub's lifetime — never a real popup
      } finally {
        (window as unknown as { open: unknown }).open = orig;
      }
      expect(openedInClick, "opened synchronously, before any await").to.deep.equal(["about:blank"]);
      expect(opened).to.deep.equal(["about:blank"]);
      expect(tab.location.href).to.match(/^blob:/);
      expect(tab.closed).to.equal(false);
    });

    it("camera: a stream that arrives after the element left the DOM is stopped", async () => {
      const canvas = document.createElement("canvas");
      canvas.getContext("2d")!.fillRect(0, 0, 4, 4);
      const stream = canvas.captureStream(5);
      const gate = deferred<MediaStream>();
      const asked = deferred<void>();
      const md = navigator.mediaDevices;
      const real = md.getUserMedia;
      md.getUserMedia = () => { asked.resolve(); return gate.promise; };
      try {
        const el = await fixture<MsCameraCapture>(html`<ms-camera-capture></ms-camera-capture>`);
        const opening = el.open();
        await asked.promise; // the camera request is out (after the device list)
        el.remove(); // the host dialog closed while the permission prompt was up
        gate.resolve(stream);
        await opening;
        expect(stream.getTracks().every((t) => t.readyState === "ended"), "camera released").to.equal(true);
        expect((el as unknown as { _stream: MediaStream | null })._stream === null).to.equal(true);
        expect((el as unknown as { _open: boolean })._open).to.equal(false);
      } finally {
        md.getUserMedia = real;
      }
    });
  });
});
