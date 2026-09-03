/** Standalone dialog mounting helper.
 *
 * Mounts the existing MaintenanceObjectDialog / MaintenanceTaskDialog into
 * <home-assistant>'s shadow root — the same place HA's own dialogs live —
 * so they can be opened from any Lovelace context without the user
 * navigating to the panel first.
 *
 * The mount point matters (#129): HA's modern components (ha-entity-picker
 * and friends) resolve data through Lit context — `context-request` events
 * that bubble UP the DOM to providers on the <home-assistant> element. A
 * dialog on document.body is a SIBLING tree of <home-assistant>, the events
 * never reach the providers, and such components upgrade to an empty shadow
 * root. Mounting inside <home-assistant>'s shadow root keeps the provider
 * chain intact; document.body remains only as a last-resort fallback.
 *
 * Usage from a strategy or card click handler:
 *
 *   import { openCreateObjectDialog, openTaskDialog } from "./dialog-mount";
 *   openCreateObjectDialog();
 *
 * The hass instance is pulled from <home-assistant>.hass at open time and
 * re-injected on every Lovelace re-render so the dialog stays connected to
 * a fresh WS connection across HA reconnects.
 *
 * Each dialog is created once and re-used. Closing the dialog (via its own
 * Cancel/Save buttons) unsets ``_open`` internally; we never destroy it.
 */

import "./components/object-dialog";
import "./components/task-dialog";
import "./components/complete-dialog";
import "./components/history-edit-dialog";
import "./components/qr-dialog";
import "./components/task-quick-actions-dialog";
import "./components/object-quick-actions-dialog";
import type { MaintenanceObjectDialog } from "./components/object-dialog";
import type { MaintenanceTaskDialog } from "./components/task-dialog";
import type {
  MaintenanceHistoryEditDialog,
  HistoryEntryDraft,
} from "./components/history-edit-dialog";
import type { MaintenanceCompleteDialog } from "./components/complete-dialog";
import type { MaintenanceQrDialog } from "./components/qr-dialog";
import type { MaintenanceTaskQuickActionsDialog } from "./components/task-quick-actions-dialog";
import type { MaintenanceObjectQuickActionsDialog } from "./components/object-quick-actions-dialog";
import type { HomeAssistant, MaintenanceObject } from "./types";
import { ensureLocale, isLocaleLoaded, langOf, setDateTimePrefs } from "./styles";
import { fillAndOpenCompleteDialog, type CompleteDialogArgs } from "./helpers/complete-dialog-args";

const OBJECT_DIALOG_TAG = "maintenance-object-dialog";
const TASK_DIALOG_TAG = "maintenance-task-dialog";
const HISTORY_EDIT_DIALOG_TAG = "maintenance-history-edit-dialog";
const COMPLETE_DIALOG_TAG = "maintenance-complete-dialog";
const QR_DIALOG_TAG = "maintenance-qr-dialog";
const QUICK_ACTIONS_DIALOG_TAG = "maintenance-task-quick-actions-dialog";
const OBJECT_QUICK_ACTIONS_DIALOG_TAG = "maintenance-object-quick-actions-dialog";

interface HassRoot extends HTMLElement {
  hass?: HomeAssistant;
}

function getHass(): HomeAssistant | undefined {
  const root = document.querySelector<HassRoot>("home-assistant");
  return root?.hass;
}

/** Where dialogs live: <home-assistant>'s shadow root (context providers
 *  reachable), falling back to document.body if HA's root ever goes away. */
function dialogHost(): ShadowRoot | HTMLElement {
  return document.querySelector("home-assistant")?.shadowRoot ?? document.body;
}

function getOrCreate<T extends HTMLElement>(tag: string): T {
  const host = dialogHost();
  let el = host.querySelector<T>(tag) ?? document.body.querySelector<T>(tag);
  if (!el) {
    el = document.createElement(tag) as T;
    host.appendChild(el);
  } else if (el.parentNode !== host) {
    // Adopt a dialog mounted by an older bundle onto document.body.
    host.appendChild(el);
  }
  return el;
}

function syncHass(el: HTMLElement & { hass?: HomeAssistant }): boolean {
  const hass = getHass();
  if (!hass) return false;
  el.hass = hass;
  // Dialogs opened from the dashboard strategy live in a lazily-loaded chunk
  // that never ran the panel's ensureLocale — so without this the popup renders
  // in English even when the rest of HA is localized. Fetch the user's locale
  // (idempotent + cached) and force a re-render once it's in, so the first paint
  // (which may be English) is corrected to the user's language.
  const lang = langOf(hass);
  if (!isLocaleLoaded(lang)) {
    void ensureLocale(lang).then(() => {
      (el as unknown as { requestUpdate?: () => void }).requestUpdate?.();
    });
  }
  // Same story for the profile date/time format (#163): on a strategy
  // dashboard no panel or card may ever have fed hass.locale into the prefs
  // singleton, so formatDate inside the dialog would fall back to the
  // language default and ignore a DMY/MDY/YMD profile setting.
  setDateTimePrefs(hass.locale as Parameters<typeof setDateTimePrefs>[0], hass.config?.country);
  return true;
}

/** Settings cache used to populate task-dialog's feature-gated sections
 *  (checklists / schedule_time / completion_actions) AND its
 *  defaultWarningDays prop when the dialog is mounted from Lovelace.
 *
 *  Without this, every section that's gated on a feature flag stays
 *  hidden (default false) — that's the "ich habe nicht alles wie im
 *  Panel gefunden" symptom. The panel reads the same settings object
 *  via maintenance-panel.ts and passes it through as element properties.
 *
 *  Cache lifetime: page session. Invalidated on full HA reload (which
 *  also drops our custom-element registry).  The settings WS itself is
 *  cheap (~10ms) so even uncached this isn't a hot path concern, but
 *  caching means re-opening the dialog feels instant.
 */
interface SettingsCache {
  features: {
    adaptive: boolean; predictions: boolean; seasonal: boolean;
    environmental: boolean; budget: boolean; groups: boolean;
    checklists: boolean; schedule_time: boolean; completion_actions: boolean;
  };
  defaultWarningDays: number;
  /** #145: global "Task row actions" style (buttons_compact | buttons | icons). */
  rowActionStyle: string;
}

const FALLBACK_SETTINGS: SettingsCache = {
  features: {
    adaptive: false, predictions: false, seasonal: false,
    environmental: false, budget: false, groups: false,
    checklists: false, schedule_time: false, completion_actions: false,
  },
  defaultWarningDays: 7,
  rowActionStyle: "buttons_compact",
};

/** The household's row-action style for surfaces outside the panel (the
 *  Lovelace card follows it unless its own `action_style` is set). */
export function getRowActionStyle(hass: HomeAssistant): Promise<string> {
  return fetchSettingsOnce(hass).then((s) => s.rowActionStyle);
}

/** Test hook: the settings cache is module-wide (one fetch per page), which
 *  makes component tests with DIFFERENT settings share the first answer. */
export function __resetSettingsCacheForTests(): void {
  _cachedSettings = null;
}

let _cachedSettings: Promise<SettingsCache> | null = null;

function fetchSettingsOnce(hass: HomeAssistant): Promise<SettingsCache> {
  if (_cachedSettings) return _cachedSettings;
  _cachedSettings = hass.connection
    .sendMessagePromise<{
      features?: SettingsCache["features"];
      general?: { default_warning_days?: number; row_action_style?: string };
    }>({ type: "maintenance_supporter/settings" })
    .then((r) => ({
      features: r.features ?? FALLBACK_SETTINGS.features,
      defaultWarningDays: r.general?.default_warning_days ?? 7,
      rowActionStyle: r.general?.row_action_style ?? FALLBACK_SETTINGS.rowActionStyle,
    }))
    .catch(() => FALLBACK_SETTINGS);
  return _cachedSettings;
}

export function openCreateObjectDialog(): boolean {
  const dlg = getOrCreate<MaintenanceObjectDialog>(OBJECT_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  // openCreate is defined on MaintenanceObjectDialog
  dlg.openCreate();
  return true;
}

export function openEditObjectDialog(
  entryId: string,
  obj: MaintenanceObject,
): boolean {
  const dlg = getOrCreate<MaintenanceObjectDialog>(OBJECT_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  dlg.openEdit(entryId, obj);
  return true;
}

export function openCreateTaskDialog(
  entryId = "",
  objects?: Array<{ entry_id: string; object: { name: string } }>,
): boolean {
  const dlg = getOrCreate<MaintenanceTaskDialog>(TASK_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  const hass = getHass();
  if (!hass) return false;
  void (async () => {
    const settings = await fetchSettingsOnce(hass);
    const dlgFull = dlg as MaintenanceTaskDialog & {
      checklistsEnabled: boolean;
      scheduleTimeEnabled: boolean;
      completionActionsEnabled: boolean;
      defaultWarningDays: number;
      openCreate: (
        entryId: string,
        objects?: Array<{ entry_id: string; object: { name: string } }>,
      ) => void;
    };
    dlgFull.checklistsEnabled = settings.features.checklists;
    dlgFull.scheduleTimeEnabled = settings.features.schedule_time;
    dlgFull.completionActionsEnabled = settings.features.completion_actions;
    dlgFull.defaultWarningDays = settings.defaultWarningDays;
    // openCreate NEEDS a target: a bare call left _entryId undefined and
    // _objectChoices empty — no object picker, and save failed on the
    // backend's required entry_id (bug audit 2026-08-22). Callers pass the
    // entry (quick-actions) or their object list (card header button).
    dlgFull.openCreate(entryId, objects);
  })();
  return true;
}

export function openEditTaskDialog(
  entryId: string,
  taskId: string,
): boolean {
  const dlg = getOrCreate<MaintenanceTaskDialog>(TASK_DIALOG_TAG);
  if (!syncHass(dlg)) return false;

  // openEdit on the panel-side expects a FULL MaintenanceTask (it accesses
  // task.warning_days.toString(), task.checklist, task.adaptive_config etc.
  // unconditionally on hydrate). For the Lovelace-mount path we only have
  // (entry_id, task_id) at the click site, so we MUST fetch the full task
  // via WS before calling openEdit.
  //
  // Earlier the comment claimed "the dialog re-loads task data via WS in
  // its own openEdit handler when given just an id" — that was aspirational
  // but never implemented. Calling openEdit with a stub `{id: taskId}`
  // crashed silently with TypeError: Cannot read properties of undefined
  // (reading 'toString'). Reported as #50-followup ("strategy dashboard
  // edit button geht nicht mehr").
  //
  // The fetch is fire-and-forget — boolean return is kept for back-compat
  // (true = mount succeeded, false = no hass yet). Errors during fetch are
  // logged + the dialog stays closed.
  const hass = getHass();
  if (!hass) return false;
  void (async () => {
    try {
      // Fetch features + task in parallel — both are needed before openEdit.
      // Without features, the completion-action / checklist / schedule-time
      // sections stay hidden (their @property defaults to false), which is
      // the "im Dashboard nicht alles wie im Panel" symptom.
      const [r, settings] = await Promise.all([
        hass.connection.sendMessagePromise<{
          tasks?: Array<{ id: string } & Record<string, unknown>>;
        }>({ type: "maintenance_supporter/object", entry_id: entryId }),
        fetchSettingsOnce(hass),
      ]);
      const fullTask = (r.tasks || []).find((t) => t.id === taskId);
      if (!fullTask) {
        // eslint-disable-next-line no-console
        console.warn(`openEditTaskDialog: task ${taskId} not found in entry ${entryId}`);
        return;
      }
      const dlgFull = dlg as MaintenanceTaskDialog & {
        checklistsEnabled: boolean;
        scheduleTimeEnabled: boolean;
        completionActionsEnabled: boolean;
        defaultWarningDays: number;
        openEdit: (entryId: string, task: unknown) => Promise<void>;
      };
      dlgFull.checklistsEnabled = settings.features.checklists;
      dlgFull.scheduleTimeEnabled = settings.features.schedule_time;
      dlgFull.completionActionsEnabled = settings.features.completion_actions;
      dlgFull.defaultWarningDays = settings.defaultWarningDays;
      await dlgFull.openEdit(entryId, fullTask);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("openEditTaskDialog: failed to load task/features", e);
    }
  })();
  return true;
}

/** v2.2.0: open the history-entry editor in place, e.g. from a calendar
 *  card past-event click. The caller fetches the existing entry data via
 *  the maintenance_supporter/object WS first (or uses what the calendar
 *  event already carries). */
export function openHistoryEditDialog(draft: HistoryEntryDraft): boolean {
  const dlg = getOrCreate<MaintenanceHistoryEditDialog>(HISTORY_EDIT_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  dlg.openEdit(draft);
  return true;
}

/** v2.3.0: open the rich complete-dialog from any Lovelace context.
 *
 *  Takes the full argument bag (`buildCompleteDialogArgs` derives it from a
 *  task + object list). Every dialog field is assigned — the dialog is a
 *  singleton, so an omitted field must reset, never leak the previous
 *  task's value (tag-scan gate, restock default, checklist ticks included). */
export function openCompleteDialog(args: CompleteDialogArgs): boolean {
  const dlg = getOrCreate<MaintenanceCompleteDialog>(COMPLETE_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  fillAndOpenCompleteDialog(dlg, args, (getHass()?.language) || "en");
  return true;
}

/** v2.3.0: open the QR dialog for a single task. */
export function openQrDialog(args: {
  entry_id: string;
  task_id: string;
  task_name: string;
  object_name: string;
}): boolean {
  const dlg = getOrCreate<MaintenanceQrDialog>(QR_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  dlg.openForTask(args.entry_id, args.task_id, args.object_name, args.task_name);
  return true;
}

/** v2.3.0: open the task quick-actions dialog (Complete/Skip/Reset/Edit/QR/Delete).
 *  This is the primary entry point from a card row click. */
export function openTaskQuickActions(entryId: string, taskId: string): boolean {
  const dlg = getOrCreate<MaintenanceTaskQuickActionsDialog>(
    QUICK_ACTIONS_DIALOG_TAG,
  );
  if (!syncHass(dlg)) return false;
  void dlg.openFor(entryId, taskId);
  return true;
}

/** v2.3.0 Phase 3: open the object quick-actions dialog (Edit/Add-task/Delete + read-only meta + task list). */
export function openObjectQuickActions(entryId: string): boolean {
  const dlg = getOrCreate<MaintenanceObjectQuickActionsDialog>(
    OBJECT_QUICK_ACTIONS_DIALOG_TAG,
  );
  if (!syncHass(dlg)) return false;
  void dlg.openFor(entryId);
  return true;
}
