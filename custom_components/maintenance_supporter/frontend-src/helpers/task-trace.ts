/** The task trace (2026-10 beta): the backend's journal (status changes,
 *  reminders, snoozes, Done-when changes, edits — helpers/task_trace.py)
 *  merged with the task's history and split into due cycles, the way a HA
 *  automation trace is one run. A completion, a skip or a reset ends a
 *  cycle; what came after it is the current one.
 *
 *  What the trace adds to the history, after HA's own traces: each step's
 *  details when clicked (exact time, what it came to, how long a status
 *  lasted), the time between steps ("3 days later"), the cycle's result
 *  (done how long after it was due, reminders, snoozes) and same-shape
 *  steps in a row folded into one (fifteen trigger firings are one line,
 *  their values in the details). Pure, unit-tested in task-trace.test.ts. */

import { countText, formatDate, formatDateTime, formatNumber, formatRecurrence, formatUnit, monthName, t, withUnit } from "../styles";
import { historyNoteText } from "./history-note";
import { conditionText } from "./task-rules";
import { triggerValueText } from "./trigger-value";
import { compoundLogic, triggerEntityIds } from "./trigger-entities";
import { URGENT_STATUSES } from "../status-constants";
import { ownTextKinds } from "./notification-texts";
import { REQUIRED_COMPLETION_LABELS } from "../components/required-completion-labels";
import type { HistoryEntry, NotificationTexts, TriggerConfig } from "../types";

/** One event of the journal, as `maintenance_supporter/task/trace` sends it. */
export interface TraceEvent {
  at: string;
  kind: string;
  [key: string]: unknown;
}

/** How a step reads in the graph: done (green), status, info, or a change
 *  that did not count (dashed). */
export type TraceTone = "done" | "status" | "info" | "skipped";

/** One line of a step's details: a label and its value. */
export interface TraceDetail {
  label: string;
  value: string;
}

export interface TraceItem {
  at: string;
  icon: string;
  text: string;
  tone: TraceTone;
  /** What a click on the step adds to its line (HA's "step details"). */
  details: TraceDetail[];
  /** The step's shape: steps with the same one in a row fold into one. */
  group: string;
  /** The text of a folded run, without what differs between its steps
   *  (a trigger's value); the steps' own texts are in `repeats`. */
  foldText?: string;
  /** The history entry behind a history step: the view renders its notes,
   *  photos, readings and costs the way the history does. */
  history?: HistoryEntry;
  /** A folded run, oldest first, this step included. */
  repeats?: TraceItem[];
  /** Time since the step before it in the cycle, ms; null for the first. */
  gapMs?: number | null;
  /** An edit's values, field → [before, after] (the backend keeps the
   *  short ones); the view words them with changeDetails. */
  changes?: Record<string, [unknown, unknown]>;
  /** Whose sensors the step is about, for the activity around it: the
   *  sensor rule's or the Done-when entity's. */
  watch?: "rule" | "done_when";
}

export interface TraceCycle {
  /** The first and the last step's time. */
  start: string;
  end: string;
  /** False for the current cycle (no completion, skip or reset yet). */
  closed: boolean;
  items: TraceItem[];
  /** The history type that closed it (completed, skipped, reset). */
  endType?: string;
  /** When the cycle before it ended: where this cycle's interval began. */
  since?: string;
  /** Since when the task was due without a break when the cycle ended (or
   *  is still, for the current one): a firing that was missed and fired
   *  again counts from the second time. */
  dueAt?: string;
}

export interface TraceOptions {
  /** The trigger sensor's unit, for the values its firings recorded. */
  triggerUnit?: string;
  /** The rule is a state rule: its firings' value is only a count. */
  stateRule?: boolean;
  /** An entity by its name: the steps named the sensor by its id. */
  entityName?: (entityId: string) => string;
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
  updated: "mdi:file-replace-outline",
};

/** The history entries that end a cycle. */
const CYCLE_ENDS = new Set(["completed", "skipped", "reset"]);

/** The statuses that make a task due (status-constants): the moment it
 *  entered one is when it was due. */
const DUE_STATUSES = new Set<string>(URGENT_STATUSES);

/** The note the backend writes on every trigger firing (coordinator); it
 *  says what the type already says. */
const TRIGGER_NOTE = "Sensor trigger activated";

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
  reassigned: "beta_trace_cleared_reassigned",
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

/** A label without the hint in brackets ("Done when (optional)"). */
function bare(label: string): string {
  return label.replace(/\s*[(（][^)）]*[)）]\s*$/, "").trim();
}

/** A span of time in the largest unit that reads well: minutes under an
 *  hour, hours under two days, days beyond. */
export function spanText(ms: number, lang: string): string {
  const minutes = Math.max(1, Math.round(ms / 60_000));
  if (minutes < 60) return formatUnit(minutes, "minute", lang);
  const hours = Math.round(ms / 3_600_000);
  if (hours < 48) return formatUnit(hours, "hour", lang);
  return formatUnit(Math.round(ms / 86_400_000), "day", lang);
}

/** One journal event as a timeline step. */
export function eventItem(e: TraceEvent, lang: string, opts: TraceOptions = {}): TraceItem {
  const L = lang;
  const named = (id: string): string => (id && opts.entityName ? opts.entityName(id) : id);
  switch (e.kind) {
    case "status": {
      const from = str(e.from);
      const to = str(e.to);
      return {
        at: e.at,
        icon: STATUS_ICONS[to] ?? "mdi:information-outline",
        text: `${statusLabel(from, L)} → ${statusLabel(to, L)}`,
        tone: "status",
        details: [],
        group: `status:${from}>${to}`,
        watch: from === "triggered" || to === "triggered" ? "rule" : undefined,
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
          details: [],
          group: `reminder:lead:${str(e.days)}`,
        };
      }
      const bundled = e.reminder === "bundle";
      return {
        at: e.at,
        icon: "mdi:bell-ring-outline",
        text: fill(t("beta_trace_reminder", L), { status: statusLabel(str(e.status), L) }),
        tone: "info",
        details: bundled ? [{ label: t("beta_trace_message", L), value: t("beta_trace_bundle", L) }] : [],
        group: `reminder:${str(e.reminder)}:${str(e.status)}`,
      };
    }
    case "reminder_cleared":
      return {
        at: e.at,
        icon: "mdi:bell-off-outline",
        text: t(CLEARED_KEYS[str(e.reason)] ?? "beta_trace_cleared_done", L),
        tone: "info",
        details: [],
        group: `cleared:${str(e.reason)}`,
      };
    case "snoozed": {
      const hours = Number(e.hours);
      return {
        at: e.at,
        icon: "mdi:alarm-snooze",
        text: fill(t("beta_trace_snoozed", L), { time: formatDateTime(str(e.until), L) }),
        tone: "info",
        details: Number.isFinite(hours) && hours > 0 ? [{ label: t("duration", L), value: formatUnit(hours, "hour", L) }] : [],
        group: `snoozed:${str(e.until)}`,
      };
    }
    case "done_when": {
      const result = str(e.result);
      const minutes = Number(e.minutes);
      const entity = named(str(e.entity)) || "—";
      const state = str(e.state) || "—";
      const details: TraceDetail[] = [{ label: bare(t("complete_when", L)), value: `${entity} → ${state}` }];
      if (result === "not_due" && str(e.status)) details.push({ label: t("report_col_status", L), value: statusLabel(str(e.status), L) });
      return {
        at: e.at,
        icon: result === "counted" ? "mdi:check-circle-outline" : result === "waiting" ? "mdi:timer-sand" : "mdi:cancel",
        text: fill(t(DONE_WHEN_KEYS[result] ?? "beta_trace_dw_not_due", L), {
          entity,
          state,
          duration: Number.isFinite(minutes) && minutes > 0 ? formatUnit(minutes, "minute", L) : "—",
        }),
        tone: result === "counted" ? "done" : result === "waiting" ? "info" : "skipped",
        details,
        group: `done_when:${result}:${entity}:${state}`,
        watch: "done_when",
      };
    }
    case "edited": {
      const fields = Array.isArray(e.fields) ? e.fields.map(str).filter(Boolean) : [];
      const text = fill(t("beta_trace_edited", L), { fields: editedFieldsText(fields, L) || "—" });
      const changes: Record<string, [unknown, unknown]> = {};
      if (isRecord(e.changes)) {
        for (const [field, pair] of Object.entries(e.changes)) {
          if (Array.isArray(pair) && pair.length === 2) changes[field] = [pair[0], pair[1]];
        }
      }
      // Two edits never fold: each has its own values.
      return { at: e.at, icon: "mdi:pencil-outline", text, tone: "info", details: [], group: `edited:${e.at}`, changes };
    }
    case "trigger_cleared": {
      // The rule let go of the task by itself: what the sensor reads now
      // (an update entity: the version now installed).
      const installed = str(e.installed);
      const state = str(e.state);
      const value = typeof e.value === "number" && Number.isFinite(e.value) ? e.value : null;
      const text = installed
        ? fill(t("beta_trace_trigger_cleared_update", L), { installed })
        : state
          ? fill(t("beta_trace_trigger_cleared_state", L), { state })
          : value !== null
            ? fill(t("beta_trace_trigger_cleared_value", L), {
                value: withUnit(formatNumber(value, L, { maximumFractionDigits: 3 }), opts.triggerUnit, L),
              })
            : t("beta_trace_trigger_cleared", L);
      const details: TraceDetail[] = str(e.entity) ? [{ label: t("beta_sensor_rule", L), value: named(str(e.entity)) }] : [];
      return {
        at: e.at,
        icon: "mdi:alert-circle-check-outline",
        text,
        tone: "status",
        details,
        group: `trigger_cleared:${str(e.entity)}:${state || installed}`,
        watch: "rule",
      };
    }
    default:
      return { at: e.at, icon: "mdi:information-outline", text: e.kind, tone: "info", details: [], group: `kind:${e.kind}` };
  }
}

/** A stored task field → the locale key of the label the dialog shows for
 *  it. The trace named the fields by their storage keys ("interval_days,
 *  trigger_config"), readable in no language (language check 2026-11-01).
 *  tests/test_frontend_const_parity.py holds it against the stored task's
 *  fields: one without a label read as "other settings". */
export const FIELD_LABELS: Record<string, string> = {
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
  // The dialog asks both the other way round: its values are turned too.
  allow_skip: "disallow_skip",
  notify_enabled: "no_notifications",
  required_completion_fields: "require_on_completion",
  entity_slug: "entity_id",
  on_complete_action: "on_complete_action_title",
  quick_complete_defaults: "qr_action_quick_complete",
  consumes_parts: "consumes_parts_label",
  notify_icon: "notify_icon",
  notification_texts: "notify_texts",
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
    const label = bare(t(key, lang));
    if (label && !labels.includes(label)) labels.push(label);
  }
  if (other) labels.push(t("beta_trace_edited_other", lang));
  return labels.join(", ");
}

/** What words an edit's values need from the view, looked up when the
 *  details are drawn (the members load after the trace). */
export interface ChangeContext {
  lang: string;
  entityName: (entityId: string) => string;
  userName: (userId: string) => string | null;
  /** The trigger sensor's unit, for a rule's values. */
  unit?: string;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

const ENTITY_ID = /^[a-z_]+\.[a-z0-9_]+$/;

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** A sensor rule in a few words: its sensors and their condition, or how
 *  many conditions a compound has; then what happens when it ends by
 *  itself. Two rules that differed only there read the same ("… → …"). */
function ruleText(rule: TriggerConfig, ctx: ChangeContext): string {
  const L = ctx.lang;
  let text: string;
  if (rule.type === "compound") {
    const n = String((rule.conditions || []).length);
    const all = compoundLogic(rule) === "AND";
    text = t(all ? "beta_rules_all_of" : "beta_rules_any_of", L).split("{n}").join(n);
  } else {
    const who = triggerEntityIds(rule).map(ctx.entityName).join(", ");
    const what = conditionText(rule, ctx.unit, L);
    text = who ? `${who}: ${what}` : what;
  }
  if (rule.trigger_hold_until_done) return `${text} · ${t("trigger_end_hold", L)}`;
  if (rule.auto_complete_on_recovery) return `${text} · ${t("trigger_end_done", L)}`;
  return text;
}

/** What a stored schedule says beyond its kind and day: the date of a
 *  one-time task, an interval counted from the planned date, the season, the
 *  end of a series. "One-time → One-time" was a new date (FE7-A3). */
function scheduleText(s: Record<string, unknown>, L: string): string {
  const base = formatRecurrence({ schedule: s, due_date: typeof s.due_date === "string" ? s.due_date : undefined } as Parameters<typeof formatRecurrence>[0], L);
  const parts = [base];
  if (s.anchor === "planned") parts.push(t("anchor_planned", L));
  if (Array.isArray(s.season_months) && s.season_months.length) {
    const months = [...s.season_months].filter((m): m is number => typeof m === "number").sort((a, b) => a - b);
    parts.push(`${bare(t("season_window_label", L))}: ${months.map((m) => monthName(m - 1, L, "short")).join(", ")}`);
  }
  if (isRecord(s.ends)) {
    if (typeof s.ends.count === "number") parts.push(`${t("series_end_count_label", L)}: ${formatNumber(s.ends.count, L)}`);
    if (typeof s.ends.until === "string") parts.push(`${t("series_end_until_label", L)}: ${formatDate(s.ends.until, L)}`);
  }
  return parts.join(" · ");
}

/** One stored value of a task field the way the dialog would say it: a
 *  schedule as its recurrence, a rule as its sentence, people and entities
 *  by name, days with their unit; "—" for none. */
export function changeValue(field: string, v: unknown, ctx: ChangeContext): string {
  const L = ctx.lang;
  if (v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length)) return "—";
  switch (field) {
    case "schedule":
      return isRecord(v) ? scheduleText(v, L) : "—";
    case "trigger_config":
      return isRecord(v) ? ruleText(v as unknown as TriggerConfig, ctx) : "—";
    case "notification_texts":
      // #252: which kinds the task words itself (the texts are too long).
      return isRecord(v) ? ownTextKinds(v as NotificationTexts).map((k) => t(k, L)).join(", ") || "—" : "—";
    case "complete_when": {
      if (!isRecord(v) || typeof v.entity_id !== "string") return "—";
      // As the task's badge says it: how long the state must hold, and
      // whether it also counts while the task is not due.
      let text = `${ctx.entityName(v.entity_id)} → ${str(v.to_state) || "—"}`;
      const minutes = Number(v.for_minutes);
      if (Number.isFinite(minutes) && minutes > 0) text += ` ${t("complete_when_badge_for", L).replace("{minutes}", String(minutes))}`;
      if (v.any_time === true) text += `, ${t("complete_when_badge_any_time", L)}`;
      return text;
    }
    case "allow_skip":
    case "notify_enabled":
      // Labelled as the dialog asks: "Don't allow skipping", "No notifications".
      return typeof v === "boolean" ? (v ? "✗" : "✓") : str(v);
    case "rotation_strategy":
      return t(`rotation_${str(v)}`, L);
    case "required_completion_fields":
      return Array.isArray(v) ? v.map((f) => t(REQUIRED_COMPLETION_LABELS[str(f)] ?? str(f), L)).join(", ") : "—";
    case "interval_days":
    case "warning_days":
    case "earliest_completion_days":
      return typeof v === "number" ? formatUnit(v, "day", L) : str(v);
    case "responsible_user_id":
      return typeof v === "string" ? ctx.userName(v) ?? v : "—";
    case "assignee_pool":
      return Array.isArray(v) ? v.map((id) => (typeof id === "string" ? ctx.userName(id) ?? id : str(id))).join(", ") : "—";
    case "due_date":
    case "due_override":
    case "last_performed":
      return typeof v === "string" ? formatDate(v, L) : "—";
    case "priority":
      return t(`priority_${str(v)}`, L);
    case "type":
      return t(str(v), L);
  }
  if (typeof v === "boolean") return v ? "✓" : "✗";
  if (typeof v === "number") return formatNumber(v, L);
  if (typeof v === "string") return ENTITY_ID.test(v) ? ctx.entityName(v) : clip(v, 60);
  if (Array.isArray(v) && v.every((x) => x === null || typeof x !== "object")) {
    return clip(v.map((x) => (typeof x === "string" && ENTITY_ID.test(x) ? ctx.entityName(x) : str(x))).join(", "), 80);
  }
  return "…";
}

/** An edit's values as detail lines, "Schedule: Every 30 days → Every 60
 *  days", labelled as the dialog labels the field; a field without a label
 *  of its own stays "other settings" in the step's line and gets none. */
export function changeDetails(changes: Record<string, [unknown, unknown]> | undefined, ctx: ChangeContext): TraceDetail[] {
  if (!changes) return [];
  const rows: TraceDetail[] = [];
  for (const [field, [before, after]] of Object.entries(changes)) {
    const key = FIELD_LABELS[field];
    if (!key) continue;
    rows.push({ label: bare(t(key, ctx.lang)), value: `${changeValue(field, before, ctx)} → ${changeValue(field, after, ctx)}` });
  }
  return rows;
}

/** One recorded state of a watched sensor around a step. */
export interface ActivityRow {
  at: number;
  entityId: string;
  state: string;
}

/** A recorded state as `history/history_during_period` sends it (the
 *  compressed form: `s`, `lu`/`lc` in seconds; the long one as fallback). */
interface RecordedState {
  s?: string;
  lu?: number;
  lc?: number;
  state?: string;
  last_updated?: string;
  last_changed?: string;
}

/** The states the recorder kept around a step: every watched sensor's,
 *  merged, the `limit` closest to the step, in time order. */
export function activityRows(res: Record<string, RecordedState[] | undefined> | null | undefined, atMs: number, limit = 20): ActivityRow[] {
  const rows: ActivityRow[] = [];
  for (const [entityId, states] of Object.entries(res ?? {})) {
    for (const st of states ?? []) {
      const seconds = st.lu ?? st.lc;
      const at = typeof seconds === "number" ? seconds * 1000 : Date.parse(st.last_updated ?? st.last_changed ?? "");
      const state = st.s ?? st.state;
      if (Number.isFinite(at) && typeof state === "string") rows.push({ at, entityId, state });
    }
  }
  return rows
    .sort((a, b) => Math.abs(a.at - atMs) - Math.abs(b.at - atMs))
    .slice(0, limit)
    .sort((a, b) => a.at - b.at);
}

/** Who did a completion (and on which device), for its details; the view
 *  asks when it draws them, the members load after the trace. */
export function completedByDetail(h: HistoryEntry, userName: (userId: string) => string | null, lang: string): TraceDetail | null {
  const by = h.completed_by ? userName(h.completed_by) : null;
  if (!by) return null;
  const via = h.completed_via ? userName(h.completed_via) : null;
  return { label: t("completed_by", lang), value: via ? fill(t("completed_via", lang), { person: by, device: via }) : by };
}

/** What a history entry adds that its row in the history does not show:
 *  the checklist and the "was it needed" answer (who did it: see
 *  completedByDetail). Notes, photos, readings, costs and the trigger value
 *  come with the history's own renderer (renderHistoryEntry). */
function historyDetails(h: HistoryEntry, lang: string): TraceDetail[] {
  const L = lang;
  const details: TraceDetail[] = [];
  const checklist = h.checklist_state && typeof h.checklist_state === "object" ? Object.values(h.checklist_state) : [];
  if (checklist.length) details.push({ label: t("checklist", L), value: `${checklist.filter(Boolean).length}/${checklist.length}` });
  if (h.feedback) details.push({ label: t("was_maintenance_needed", L), value: t(`feedback_${h.feedback}`, L) });
  return details;
}

/** One history entry as a timeline step. A note the backend wrote itself
 *  ("Auto-completed: …") in the reader's language, as the history shows it;
 *  the trace showed it in English in every language. A trigger firing says
 *  the value it fired at instead of the note it always carries. */
export function historyItem(h: HistoryEntry, lang: string, opts: TraceOptions = {}): TraceItem {
  const type = str(h.type);
  const rawNote = str(h.notes).trim();
  const ownNote = type === "triggered" && rawNote === TRIGGER_NOTE;
  const notes = ownNote ? "" : historyNoteText(rawNote, lang).trim();
  const short = notes.length > 80 ? `${notes.slice(0, 79)}…` : notes;
  const base = short ? `${t(type, lang)} · ${short}` : t(type, lang);
  const fired = type === "triggered" ? triggerValueText(h, lang, { unit: opts.triggerUnit, stateRule: opts.stateRule }) : "";
  return {
    at: str(h.timestamp),
    icon: HISTORY_ICONS[type] ?? "mdi:history",
    text: fired ? `${base} · ${fired}` : base,
    tone: CYCLE_ENDS.has(type) ? "done" : type === "triggered" ? "status" : "info",
    details: historyDetails(h, lang),
    // Firings and misses fold (same note); one completion is never another.
    group: type === "triggered" || type === "missed" ? `history:${type}:${rawNote}` : `history:${type}:${str(h.timestamp)}`,
    foldText: base,
    history: h,
    watch: type === "triggered" ? "rule" : undefined,
  };
}

/** The history entry as a step's details show it: without the note every
 *  trigger firing carries (the step's line already says it fired). */
export function detailEntry(h: HistoryEntry): HistoryEntry {
  return str(h.type) === "triggered" && str(h.notes).trim() === TRIGGER_NOTE ? { ...h, notes: null } : h;
}

function instant(at: string): number {
  const ms = Date.parse(at);
  return Number.isFinite(ms) ? ms : 0;
}

/** What a completion sets off right away (the status back to OK, the
 *  reminder off the phones) belongs to the cycle it ended. */
const AFTERMATH_KINDS = new Set(["status", "reminder_cleared"]);
const AFTERMATH_MS = 60_000;

/** The end of a cycle the rule closed by itself (no history entry). */
export const SELF_ENDED = "self_ended";
/** The statuses a triggered task goes back to when its rule lets go. */
const SELF_END_STATUSES = new Set(["ok", "due_soon"]);

/** Same-shape steps in a row as one step, and each step's distance to the
 *  one before it (from the last of a folded run). */
function fold(items: TraceItem[]): TraceItem[] {
  const out: TraceItem[] = [];
  for (const item of items) {
    const prev = out[out.length - 1];
    if (prev && prev.group === item.group) {
      // The run's first step as it was, beside the ones that followed it.
      if (!prev.repeats) prev.repeats = [{ ...prev }];
      prev.repeats.push(item);
      continue;
    }
    out.push(item);
  }
  let lastAt: string | null = null;
  for (const item of out) {
    item.gapMs = lastAt === null ? null : instant(item.at) - instant(lastAt);
    lastAt = item.repeats ? item.repeats[item.repeats.length - 1].at : item.at;
  }
  return out;
}

/** Journal and history merged in time order and split into cycles, oldest
 *  first. A completion, skip or reset ends its cycle; the steps after the
 *  last one are the current cycle (left out while it has none). */
export function buildCycles(events: TraceEvent[], history: HistoryEntry[], lang: string, opts: TraceOptions = {}): TraceCycle[] {
  const steps: Array<{ item: TraceItem; ends: boolean; kind: string; order: number; type: string }> = [];
  let order = 0;
  for (const e of events) {
    if (!e || typeof e.at !== "string" || typeof e.kind !== "string") continue;
    steps.push({ item: eventItem(e, lang, opts), ends: false, kind: e.kind, order: order++, type: "" });
  }
  for (const h of history) {
    if (!h || typeof h.timestamp !== "string") continue;
    const type = str(h.type);
    steps.push({ item: historyItem(h, lang, opts), ends: CYCLE_ENDS.has(type), kind: `history:${type}`, order: order++, type });
  }
  // Same instant: the journal first (the door that counted, then the
  // completion it made), else in arrival order.
  steps.sort((a, b) => instant(a.item.at) - instant(b.item.at) || a.order - b.order);
  // How long each status lasted: until the next status change.
  let lastStatus: TraceItem | null = null;
  for (const s of steps) {
    if (s.kind !== "status") continue;
    if (lastStatus) lastStatus.details.push({ label: t("duration", lang), value: spanText(instant(s.item.at) - instant(lastStatus.at), lang) });
    lastStatus = s.item;
  }
  const cycles: TraceCycle[] = [];
  let current: TraceItem[] = [];
  let dueSince: string | undefined;
  let historyAt = -Infinity;
  let clearedAt = -Infinity;
  for (const s of steps) {
    const at = instant(s.item.at);
    // The rule letting go of a triggered task (back to OK or due soon) ends
    // its cycle as well: the update got installed, the pressure came back.
    // Without it the cycle ran on, "still running", from one firing to the
    // next months later. Not when a history entry set the status off (a
    // missed occurrence), unless the journal says the rule let go.
    let selfEnded = false;
    let wasDueSince = dueSince;
    if (s.kind === "trigger_cleared") clearedAt = at;
    if (s.kind === "status") {
      const g = s.item.group;
      const from = g.slice("status:".length, g.indexOf(">"));
      const to = g.slice(g.indexOf(">") + 1);
      selfEnded = from === "triggered" && SELF_END_STATUSES.has(to)
        && (at - clearedAt <= AFTERMATH_MS || at - historyAt > AFTERMATH_MS);
      wasDueSince = dueSince;
      if (!DUE_STATUSES.has(to)) dueSince = undefined;
      else dueSince ??= s.item.at;
    }
    if (s.kind.startsWith("history:")) historyAt = at;
    const last = cycles[cycles.length - 1];
    if (
      !current.length && last && AFTERMATH_KINDS.has(s.kind)
      && instant(s.item.at) - instant(last.end) <= AFTERMATH_MS
    ) {
      last.items.push(s.item);
      continue;
    }
    current.push(s.item);
    if (s.ends || selfEnded) {
      cycles.push({
        start: current[0].at,
        end: s.item.at,
        closed: true,
        items: current,
        endType: s.ends ? s.type : SELF_ENDED,
        since: last?.end,
        dueAt: s.ends ? dueSince : wasDueSince,
      });
      current = [];
    }
  }
  if (current.length) {
    cycles.push({ start: current[0].at, end: current[current.length - 1].at, closed: false, items: current, since: cycles[cycles.length - 1]?.end, dueAt: dueSince });
  }
  for (const c of cycles) c.items = fold(c.items);
  return cycles;
}

/** The status steps of a cycle (folded runs unfolded), oldest first. */
function statusSteps(cycle: TraceCycle): Array<{ at: string; group: string }> {
  return cycle.items.flatMap((i) => i.repeats ?? [i]).filter((i) => i.group.startsWith("status:"));
}

function count(cycle: TraceCycle, prefix: string): number {
  return cycle.items.flatMap((i) => i.repeats ?? [i]).filter((i) => i.group.startsWith(prefix)).length;
}

/** The cycle's result, the way a HA trace ends ("Finished at …"): how it
 *  ended or that it still runs, then what only the trace knows: how long
 *  after it was due it was done, how long it has been due, the reminders
 *  and snoozes it took, the interval since the cycle before. */
export function cycleResult(cycle: TraceCycle, lang: string, nowMs: number = Date.now()): { text: string; icon: string; tone: TraceTone; facts: string[] } {
  const L = lang;
  const statuses = statusSteps(cycle);
  const toOf = (g: string) => g.slice(g.indexOf(">") + 1);
  const dueAt = cycle.dueAt;
  const facts: string[] = [];
  if (cycle.closed) {
    if (cycle.endType === SELF_ENDED && dueAt) {
      facts.push(fill(t("beta_trace_triggered_for", L), { span: spanText(instant(cycle.end) - instant(dueAt), L) }));
    }
    if (cycle.endType === "completed") {
      // Within a minute (a Done-when rule, a firing done at once) says nothing.
      const late = dueAt ? instant(cycle.end) - instant(dueAt) : 0;
      if (dueAt && late >= 60_000) facts.push(fill(t("beta_trace_after_due", L), { span: spanText(late, L) }));
      else if (statuses.some((s) => toOf(s.group) === "due_soon")) facts.push(t("beta_trace_before_due", L));
    }
    if (cycle.since) facts.push(fill(t("beta_trace_cycle_length", L), { span: spanText(instant(cycle.end) - instant(cycle.since), L) }));
  } else if (dueAt) {
    facts.push(fill(t("beta_trace_due_for", L), { span: spanText(nowMs - instant(dueAt), L) }));
  }
  const reminders = count(cycle, "reminder:");
  if (reminders) facts.push(countText("beta_trace_reminders", "beta_trace_reminders_one", reminders, L));
  const snoozes = count(cycle, "snoozed:");
  if (snoozes) facts.push(countText("beta_trace_snoozes", "beta_trace_snoozes_one", snoozes, L));
  if (!cycle.closed) return { text: t("beta_trace_running", L), icon: "mdi:progress-clock", tone: "info", facts };
  if (cycle.endType === SELF_ENDED) {
    return { text: `${t("beta_trace_cycle_self_ended", L)} · ${formatDateTime(cycle.end, L)}`, icon: "mdi:alert-circle-check-outline", tone: "status", facts };
  }
  const type = cycle.endType ?? "completed";
  return { text: `${t(type, L)} · ${formatDateTime(cycle.end, L)}`, icon: HISTORY_ICONS[type] ?? "mdi:check-circle", tone: "done", facts };
}
