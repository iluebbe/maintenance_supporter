/** Everything <maintenance-complete-dialog> needs for ONE task, derived once.
 *
 * Six surfaces open the completion dialog (panel task detail, panel rows,
 * QR deep link, Lovelace card row button, quick-actions dialog, calendar via
 * quick-actions). The panel resolved the full set — phase override, tag-scan
 * gate, restock default + unit cost, currency symbol, "consumes" hint lines,
 * in-cycle checklist ticks — while the Lovelace paths forwarded a subset, so
 * a buy task opened from the card had no restock field and a
 * require_tag_scan task never announced its gate (audit 2026-08-29).
 *
 * `buildCompleteDialogArgs` is the single derivation; `fillAndOpenCompleteDialog`
 * assigns EVERY dialog field before opening. Always-assign matters: the
 * dialog is a singleton per surface, so an omitted value must reset to its
 * default rather than leak the previous task's.
 */

import type { MaintenanceTask, ReadingSlot, TaskPartLink } from "../types";
import { readingHistory, type ReadingHistoryEntry } from "./reading-slots";
import type { MaintenanceCompleteDialog } from "../components/complete-dialog";
import { describePartLink, partsForCompletion, type LinkedPart, type PartOwner } from "./shared-parts";
import { effectivePhase, phaseLabel } from "./phases";

/** Wire-shaped (snake_case) argument bag — what `dialog-mount.openCompleteDialog`
 *  has always accepted, now complete. */
export interface CompleteDialogArgs {
  entry_id: string;
  task_id: string;
  task_name: string;
  checklist?: string[];
  adaptive_enabled?: boolean;
  /** Details the task demands before it counts as done (v2.44). */
  required_completion_fields?: string[];
  /** Reading tasks need type+unit or the value field never renders. */
  task_type?: string;
  reading_unit?: string;
  /** #161 phase 2: reading slots + the dated slot snapshots (for the
   *  "last: …" hint, relative to the completion moment). */
  readings?: ReadingSlot[];
  reading_history?: ReadingHistoryEntry[];
  /** #99/#111: per-completion parts selection incl. shared pools. */
  parts?: LinkedPart[];
  consumes_parts?: TaskPartLink[];
  /** #139: "2/4 · Flip blades" — the phase this completion records. */
  phase_label?: string;
  /** Proof of presence: the task completes only via NFC/QR scan. */
  require_tag_scan?: boolean;
  /** Buy task: default restock quantity (null = not a buy task). */
  restock_default?: number | null;
  /** Buy task: the part's unit cost for the cost suggestion. */
  restock_unit_cost?: number | null;
  /** Currency symbol for the cost suggestion ("" = plain number). */
  currency_symbol?: string;
  /** "1× HEPA filter (Shelf B)" hint lines for consuming tasks. */
  consumes_info?: string[];
  /** #73: in-cycle checklist ticks (keyed by item text) to prefill. */
  checklist_prefill?: Record<string, boolean>;
  /** The dialog is the fallback of a QR/NFC scan (quick-complete refused):
   *  the completion carries `via_tag_scan` so the tag-scan gate is met. */
  via_tag_scan?: boolean;
}

export interface BuildCompleteDialogArgsOptions {
  entryId: string;
  taskId: string;
  taskName: string;
  /** The task, when the caller has it — null keeps the dialog usable with
   *  just the name (the panel's deep-link path may race the object list). */
  task: MaintenanceTask | null | undefined;
  /** The object list the parts/restock lookups resolve against. */
  objects: readonly PartOwner[];
  lang: string;
  /** Task-level checklist, already feature-gated by the caller (undefined
   *  = feature off / nothing to show). */
  checklist?: string[];
  /** Whether a PHASE checklist may show (panel: features.checklists).
   *  Defaults to true — the Lovelace paths never gated on the feature. */
  checklistsEnabled?: boolean;
  adaptiveEnabled?: boolean;
  currencySymbol?: string;
  viaTagScan?: boolean;
}

/** Derive the complete argument bag for one task (see module doc). */
export function buildCompleteDialogArgs(o: BuildCompleteDialogArgsOptions): CompleteDialogArgs {
  const task = o.task ?? null;
  // #139: a phased task completes the phase currently due — its checklist,
  // parts and required fields override the task-level values (fallthrough
  // is already baked into effectivePhase).
  const phase = task ? effectivePhase(task) : null;
  const links = phase ? phase.consumesParts : (task?.consumes_parts || []);
  // A buy task RESTOCKS via the qty field instead of consuming parts.
  const isBuy = !!task?.part_ref;
  const objParts = o.objects.find((obj) => obj.entry_id === o.entryId)?.parts || [];
  const refPart = isBuy ? objParts.find((pt) => pt.id === task!.part_ref!.part_id) : undefined;
  const checklistsEnabled = o.checklistsEnabled ?? true;
  return {
    entry_id: o.entryId,
    task_id: o.taskId,
    task_name: o.taskName,
    checklist: phase ? (checklistsEnabled ? phase.checklist : []) : (o.checklist ?? []),
    adaptive_enabled: !!o.adaptiveEnabled,
    required_completion_fields: phase ? phase.requiredFields : (task?.required_completion_fields || []),
    task_type: task?.type || "",
    reading_unit: task?.reading_unit || "",
    readings: task?.readings || [],
    reading_history: readingHistory(task?.history),
    // #99: editable per-completion parts selection. The list carries the
    // object's own parts plus the shared pools this task draws on (#111), so
    // a foreign link is visible and untickable rather than silently absent.
    parts: isBuy ? [] : partsForCompletion({ consumes_parts: links }, o.entryId, o.objects, o.lang),
    consumes_parts: isBuy ? [] : links,
    phase_label: phase ? phaseLabel(task) : "",
    require_tag_scan: !!task?.require_tag_scan,
    restock_default: isBuy ? (refPart?.restock_quantity ?? 1) : null,
    // #104 follow-up: restock qty × unit cost powers the cost suggestion.
    restock_unit_cost: isBuy ? (refPart?.cost ?? null) : null,
    currency_symbol: o.currencySymbol ?? "",
    // #111: name the owning object; never drop a line that fails to resolve.
    consumes_info: links.map((link) => describePartLink(link, o.entryId, o.objects, o.lang)),
    // #73: ticks recorded during the cycle prefill the dialog's checklist.
    checklist_prefill: task?.checklist_progress || {},
    via_tag_scan: !!o.viaTagScan,
  };
}

/** The dialog surface the helper writes to (structural, so tests can pass
 *  a plain object). */
export type CompleteDialogTarget = Pick<
  MaintenanceCompleteDialog,
  | "entryId" | "taskId" | "taskName" | "lang" | "checklist" | "adaptiveEnabled"
  | "requiredFields" | "taskType" | "readingUnit" | "readings" | "readingHistory" | "parts" | "consumesParts"
  | "phaseLabel" | "requireTagScan" | "restockDefault" | "restockUnitCost"
  | "currencySymbol" | "consumesInfo" | "checklistPrefill" | "viaTagScan" | "open"
>;

/** Assign every field (always-assign — see module doc) and open the dialog. */
export function fillAndOpenCompleteDialog(
  dlg: CompleteDialogTarget,
  args: CompleteDialogArgs,
  lang: string,
): void {
  dlg.entryId = args.entry_id;
  dlg.taskId = args.task_id;
  dlg.taskName = args.task_name;
  dlg.lang = lang;
  dlg.checklist = args.checklist ?? [];
  dlg.adaptiveEnabled = !!args.adaptive_enabled;
  dlg.requiredFields = args.required_completion_fields ?? [];
  dlg.taskType = args.task_type ?? "";
  dlg.readingUnit = args.reading_unit ?? "";
  dlg.readings = args.readings ?? [];
  dlg.readingHistory = args.reading_history ?? [];
  dlg.parts = args.parts ?? [];
  dlg.consumesParts = args.consumes_parts ?? [];
  dlg.phaseLabel = args.phase_label ?? "";
  dlg.requireTagScan = !!args.require_tag_scan;
  dlg.restockDefault = args.restock_default ?? null;
  dlg.restockUnitCost = args.restock_unit_cost ?? null;
  dlg.currencySymbol = args.currency_symbol ?? "";
  dlg.consumesInfo = args.consumes_info ?? [];
  dlg.checklistPrefill = args.checklist_prefill ?? {};
  dlg.viaTagScan = !!args.via_tag_scan;
  dlg.open({ viaTagScan: !!args.via_tag_scan });
}
