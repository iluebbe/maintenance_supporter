/** The task trace (2026-10 beta): the backend's journal (status changes,
 *  reminders, snoozes, Done-when changes, edits — helpers/task_trace.py)
 *  merged with the task's history and split into due cycles, the way a HA
 *  automation trace is one run. A completion, a skip or a reset ends a
 *  cycle; what came after it is the current one. Pure, unit-tested in
 *  task-trace.test.ts. */

import { formatDateTime, formatUnit, t } from "../styles";
import { historyNoteText } from "./history-note";
import type { HistoryEntry } from "../types";

/** One event of the journal, as `maintenance_supporter/task/trace` sends it. */
export interface TraceEvent {
  at: string;
  kind: string;
  [key: string]: unknown;
}

/** How a step reads in the graph: done (green), status, info, or a change
 *  that did not count (dashed). */
export type TraceTone = "done" | "status" | "info" | "skipped";

export interface TraceItem {
  at: string;
  icon: string;
  text: string;
  tone: TraceTone;
}

export interface TraceCycle {
  /** The first and the last step's time. */
  start: string;
  end: string;
  /** False for the current cycle (no completion, skip or reset yet). */
  closed: boolean;
  items: TraceItem[];
}

const STATUS_ICONS: Record<string, string> = {
  ok: "mdi:check-circle-outline",
  due_soon: "mdi:calendar-clock",
  overdue: "mdi:calendar-alert",
  triggered: "mdi:alert-circle-outline",
  paused: "mdi:pause-circle-outline",
  archived: "mdi:archive-outline",
};

const HISTORY_ICONS: Record<string, string> = {
  completed: "mdi:check-circle",
  skipped: "mdi:debug-step-over",
  missed: "mdi:calendar-remove",
  reset: "mdi:restore",
  triggered: "mdi:alert-circle-outline",
  trigger_removed: "mdi:link-off",
  trigger_replaced: "mdi:swap-horizontal",
};

/** The history entries that end a cycle. */
const CYCLE_ENDS = new Set(["completed", "skipped", "reset"]);

const DONE_WHEN_KEYS: Record<string, string> = {
  counted: "beta_trace_dw_counted",
  waiting: "beta_trace_dw_waiting",
  left_early: "beta_trace_dw_left_early",
  not_due: "beta_trace_dw_not_due",
  inert: "beta_trace_dw_inert",
  recent: "beta_trace_dw_recent",
};

const CLEARED_KEYS: Record<string, string> = {
  done: "beta_trace_cleared_done",
  status_left: "beta_trace_cleared_status",
  inert: "beta_trace_cleared_inert",
};

function str(v: unknown): string {
  return typeof v === "string" ? v : v === undefined || v === null ? "" : String(v);
}

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((s, [k, v]) => s.split(`{${k}}`).join(v), template);
}

function statusLabel(status: string, lang: string): string {
  return status ? t(status, lang) : "—";
}

/** One journal event as a timeline step. */
export function eventItem(e: TraceEvent, lang: string): TraceItem {
  const L = lang;
  switch (e.kind) {
    case "status": {
      const to = str(e.to);
      return {
        at: e.at,
        icon: STATUS_ICONS[to] ?? "mdi:information-outline",
        text: `${statusLabel(str(e.from), L)} → ${statusLabel(to, L)}`,
        tone: "status",
      };
    }
    case "reminder": {
      if (e.reminder === "lead") {
        const days = Number(e.days);
        return {
          at: e.at,
          icon: "mdi:bell-outline",
          text: fill(t("beta_trace_reminder_lead", L), { interval: Number.isFinite(days) ? formatUnit(days, "day", L) : "—" }),
          tone: "info",
        };
      }
      return { at: e.at, icon: "mdi:bell-ring-outline", text: fill(t("beta_trace_reminder", L), { status: statusLabel(str(e.status), L) }), tone: "info" };
    }
    case "reminder_cleared":
      return { at: e.at, icon: "mdi:bell-off-outline", text: t(CLEARED_KEYS[str(e.reason)] ?? "beta_trace_cleared_done", L), tone: "info" };
    case "snoozed":
      return { at: e.at, icon: "mdi:alarm-snooze", text: fill(t("beta_trace_snoozed", L), { time: formatDateTime(str(e.until), L) }), tone: "info" };
    case "done_when": {
      const result = str(e.result);
      const minutes = Number(e.minutes);
      return {
        at: e.at,
        icon: result === "counted" ? "mdi:check-circle-outline" : result === "waiting" ? "mdi:timer-sand" : "mdi:cancel",
        text: fill(t(DONE_WHEN_KEYS[result] ?? "beta_trace_dw_not_due", L), {
          entity: str(e.entity) || "—",
          state: str(e.state) || "—",
          duration: Number.isFinite(minutes) && minutes > 0 ? formatUnit(minutes, "minute", L) : "—",
        }),
        tone: result === "counted" ? "done" : result === "waiting" ? "info" : "skipped",
      };
    }
    case "edited": {
      const fields = Array.isArray(e.fields) ? e.fields.map(str).filter(Boolean) : [];
      return { at: e.at, icon: "mdi:pencil-outline", text: fill(t("beta_trace_edited", L), { fields: editedFieldsText(fields, L) || "—" }), tone: "info" };
    }
    default:
      return { at: e.at, icon: "mdi:information-outline", text: e.kind, tone: "info" };
  }
}

/** A stored task field → the locale key of the label the dialog shows for
 *  it. The trace named the fields by their storage keys ("interval_days,
 *  trigger_config"), readable in no language (language check 2026-11-01). */
const FIELD_LABELS: Record<string, string> = {
  name: "task_name",
  type: "maintenance_type",
  enabled: "task_enabled",
  schedule: "schedule_type",
  schedule_type: "schedule_type",
  interval_days: "interval",
  interval_unit: "interval",
  interval_anchor: "interval_anchor",
  due_date: "due_date",
  due_override: "postponed",
  last_performed: "last_performed",
  warning_days: "warning_days",
  earliest_completion_days: "earliest_completion_days",
  schedule_time: "schedule_time_toggle",
  trigger_config: "beta_sensor_rule",
  complete_when: "complete_when",
  notes: "notes_label",
  documentation_url: "documentation_url_label",
  custom_icon: "custom_icon_optional",
  priority: "priority",
  labels: "labels",
  checklist: "checklist",
  phases: "phases_section",
  phase_sequence: "phases_section",
  reading_unit: "reading_unit_label",
  readings: "readings_section",
  responsible_user_id: "responsible_user",
  assignee_pool: "task_shared_with",
  rotation_strategy: "rotation_strategy",
  nfc_tag_id: "nfc_tag_id",
  require_tag_scan: "require_tag_scan",
  allow_skip: "disallow_skip",
  on_complete_action: "on_complete_action_title",
  quick_complete_defaults: "qr_action_quick_complete",
  consumes_parts: "consumes_parts_label",
  notify_icon: "notify_icon",
  mirror_todo_entities: "task_mirror_todo",
  mirror_todo_use_default: "task_mirror_todo",
  adaptive_config: "adaptive_enabled",
};

/** The changed fields as the dialog names them, each once, without the
 *  hints in brackets ("Done when (optional)"); the ones without a label of
 *  their own as "other settings". */
export function editedFieldsText(fields: string[], lang: string): string {
  const labels: string[] = [];
  let other = false;
  for (const field of fields) {
    const key = FIELD_LABELS[field];
    if (!key) {
      other = true;
      continue;
    }
    const label = t(key, lang).replace(/\s*[(（][^)）]*[)）]\s*$/, "").trim();
    if (label && !labels.includes(label)) labels.push(label);
  }
  if (other) labels.push(t("beta_trace_edited_other", lang));
  return labels.join(", ");
}

/** One history entry as a timeline step. A note the backend wrote itself
 *  ("Sensor trigger activated") in the reader's language, as the history
 *  shows it; the trace showed it in English in every language. */
export function historyItem(h: HistoryEntry, lang: string): TraceItem {
  const type = str(h.type);
  const notes = historyNoteText(str(h.notes), lang).trim();
  const short = notes.length > 80 ? `${notes.slice(0, 79)}…` : notes;
  return {
    at: str(h.timestamp),
    icon: HISTORY_ICONS[type] ?? "mdi:history",
    text: short ? `${t(type, lang)} · ${short}` : t(type, lang),
    tone: CYCLE_ENDS.has(type) ? "done" : type === "triggered" ? "status" : "info",
  };
}

function instant(at: string): number {
  const ms = Date.parse(at);
  return Number.isFinite(ms) ? ms : 0;
}

/** What a completion sets off right away (the status back to OK, the
 *  reminder off the phones) belongs to the cycle it ended. */
const AFTERMATH_KINDS = new Set(["status", "reminder_cleared"]);
const AFTERMATH_MS = 60_000;

/** Journal and history merged in time order and split into cycles, oldest
 *  first. A completion, skip or reset ends its cycle; the steps after the
 *  last one are the current cycle (left out while it has none). */
export function buildCycles(events: TraceEvent[], history: HistoryEntry[], lang: string): TraceCycle[] {
  const steps: Array<{ item: TraceItem; ends: boolean; kind: string; order: number }> = [];
  let order = 0;
  for (const e of events) {
    if (!e || typeof e.at !== "string" || typeof e.kind !== "string") continue;
    steps.push({ item: eventItem(e, lang), ends: false, kind: e.kind, order: order++ });
  }
  for (const h of history) {
    if (!h || typeof h.timestamp !== "string") continue;
    steps.push({ item: historyItem(h, lang), ends: CYCLE_ENDS.has(str(h.type)), kind: `history:${str(h.type)}`, order: order++ });
  }
  // Same instant: the journal first (the door that counted, then the
  // completion it made), else in arrival order.
  steps.sort((a, b) => instant(a.item.at) - instant(b.item.at) || a.order - b.order);
  const cycles: TraceCycle[] = [];
  let current: TraceItem[] = [];
  for (const s of steps) {
    const last = cycles[cycles.length - 1];
    if (
      !current.length && last && AFTERMATH_KINDS.has(s.kind)
      && instant(s.item.at) - instant(last.end) <= AFTERMATH_MS
    ) {
      last.items.push(s.item);
      continue;
    }
    current.push(s.item);
    if (s.ends) {
      cycles.push({ start: current[0].at, end: s.item.at, closed: true, items: current });
      current = [];
    }
  }
  if (current.length) cycles.push({ start: current[0].at, end: current[current.length - 1].at, closed: false, items: current });
  return cycles;
}
