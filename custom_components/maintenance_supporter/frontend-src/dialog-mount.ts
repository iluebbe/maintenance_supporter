/** Standalone dialog mounting helper.
 *
 * Mounts the existing MaintenanceObjectDialog / MaintenanceTaskDialog onto
 * document.body so they can be opened from any Lovelace context — without
 * the user navigating to the panel first.
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

function getOrCreate<T extends HTMLElement>(tag: string): T {
  let el = document.body.querySelector<T>(tag);
  if (!el) {
    el = document.createElement(tag) as T;
    document.body.appendChild(el);
  }
  return el;
}

function syncHass(el: HTMLElement & { hass?: HomeAssistant }): boolean {
  const hass = getHass();
  if (!hass) return false;
  el.hass = hass;
  return true;
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

export function openCreateTaskDialog(): boolean {
  const dlg = getOrCreate<MaintenanceTaskDialog>(TASK_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  // openCreate accepts optional entry / object args; outside the panel we
  // open it without a pre-selected object — the dialog presents an object
  // chooser dropdown when entry_id is missing.
  (dlg as unknown as { openCreate: (entryId?: string) => void }).openCreate();
  return true;
}

export function openEditTaskDialog(
  entryId: string,
  taskId: string,
): boolean {
  const dlg = getOrCreate<MaintenanceTaskDialog>(TASK_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  // openEdit signature on the panel-side: (entry_id, task) — but for the
  // mount helper we don't have the full task object. We pass entry_id +
  // a stub; the dialog re-loads task data via WS in its own openEdit
  // handler when given just an id. (Fallback: deep-link if openEdit
  // signature mismatches.)
  type TaskDialogWithEdit = MaintenanceTaskDialog & {
    openEdit: (entryId: string, taskOrId: unknown) => void;
  };
  (dlg as TaskDialogWithEdit).openEdit(entryId, { id: taskId });
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

/** v2.3.0: open the rich complete-dialog from any Lovelace context. */
export function openCompleteDialog(args: {
  entry_id: string;
  task_id: string;
  task_name: string;
  checklist?: string[];
  adaptive_enabled?: boolean;
}): boolean {
  const dlg = getOrCreate<MaintenanceCompleteDialog>(COMPLETE_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  dlg.entryId = args.entry_id;
  dlg.taskId = args.task_id;
  dlg.taskName = args.task_name;
  dlg.checklist = args.checklist ?? [];
  dlg.adaptiveEnabled = !!args.adaptive_enabled;
  dlg.lang = (getHass()?.language) || "en";
  dlg.open();
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
