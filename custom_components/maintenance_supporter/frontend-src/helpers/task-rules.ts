/** The beta task editor (2026-10, in the way of the HA 2026.11 automation
 *  editor): the task dialog's state read as rule rows with one sentence each,
 *  the rule types the "Add rule" picker offers, and the rules a device's
 *  entities suggest. Pure functions, unit-tested in task-rules.test.ts; the
 *  dialog owns the state and applies what the user picks. */

import type { TriggerConfig, TriggerType } from "../types";
import { formatDate, formatNumber, formatUnit, t, weekdayName } from "../styles";

/** The rows the beta editor shows; each opens one section in the sidebar. */
export type RuleRowId = "task" | "schedule" | "trigger" | "completion" | "people" | "notifications";

export interface RuleRow {
  id: RuleRowId;
  icon: string;
  /** The rule as one sentence (without the entities: those are `chips`). */
  text: string;
  /** Entity names, shown as chips like the automation editor's targets. */
  chips: string[];
  /** Short extras after the sentence (quick complete, a rotation, …). */
  badges: string[];
  /** Whether the row's remove button applies (the schedule or the sensor rule). */
  removable: boolean;
}

/** What the rows are read from: the dialog's form state (strings as typed). */
export interface RuleDraft {
  name: string;
  enabled: boolean;
  typeLabel: string;
  scheduleType: string;
  intervalDays: string;
  intervalUnit: string;
  intervalAnchor: string;
  dueDate: string;
  weekdays: number[];
  nth: string;
  nthWeekday: string;
  domDay: string;
  domLastDay: boolean;
  calendarEntity: string;
  warningDays: string;
  triggerType: TriggerType;
  triggerEntityIds: string[];
  triggerAttribute: string;
  above: string;
  below: string;
  forMinutes: string;
  targetValue: string;
  deltaMode: boolean;
  fromState: string;
  toState: string;
  targetChanges: string;
  runtimeHours: string;
  daysBefore: string;
  triggerCombinator: "any" | "all";
  entityLogic: "any" | "all";
  compoundLogic: "AND" | "OR";
  compoundCount: number;
  compoundEntityIds: string[];
  completeWhenEntity: string;
  completeWhenState: string;
  completeWhenFor: string;
  completeWhenAnyTime: boolean;
  quickOn: boolean;
  requiredCount: number;
  allowSkip: boolean;
  requireTagScan: boolean;
  checklistCount: number;
  partsCount: number;
  responsibleUserId: string | null;
  pool: string[];
  rotation: string;
  notifyEnabled: boolean;
  mirrorLists: string[];
}

export interface RuleContext {
  lang: string;
  entityName: (entityId: string) => string;
  userName: (userId: string) => string;
}

/** The calendar kinds the dialog offers as schedule types. */
export const CALENDAR_SCHEDULE_KINDS = ["weekdays", "nth_weekday", "day_of_month", "calendar"];
/** The schedule kinds the add picker offers, in this order. */
export const ADD_SCHEDULE_KINDS = ["time_based", ...CALENDAR_SCHEDULE_KINDS, "one_time"];
/** The sensor rule types the add picker offers, in this order. */
export const ADD_TRIGGER_TYPES: TriggerType[] = ["threshold", "counter", "state_change", "runtime", "due_date", "compound"];

const SCHEDULE_ICONS: Record<string, string> = {
  time_based: "mdi:calendar-sync",
  weekdays: "mdi:calendar-week",
  nth_weekday: "mdi:calendar-today",
  day_of_month: "mdi:calendar-month",
  calendar: "mdi:calendar-star",
  one_time: "mdi:calendar-check",
  manual: "mdi:gesture-tap",
  sensor_based: "mdi:calendar-sync",
};

export const TRIGGER_ICONS: Record<string, string> = {
  threshold: "mdi:gauge",
  counter: "mdi:counter",
  state_change: "mdi:state-machine",
  runtime: "mdi:timer-outline",
  due_date: "mdi:calendar-alert",
  compound: "mdi:set-center",
};

export function scheduleIcon(kind: string): string {
  return SCHEDULE_ICONS[kind] ?? "mdi:calendar";
}

type SpanUnit = "day" | "week" | "month" | "year";
const UNIT_OF: Record<string, SpanUnit> = { days: "day", weeks: "week", months: "month", years: "year" };

/** "30 days", "2 weeks", in the language's own plural. */
export function intervalText(n: number, unit: string, lang: string): string {
  return formatUnit(n, UNIT_OF[unit] ?? "day", lang);
}

function num(text: string): number | null {
  const v = parseFloat(text);
  return Number.isFinite(v) ? v : null;
}

function fill(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((s, [k, v]) => s.split(`{${k}}`).join(v), template);
}

/** The schedule as a sentence. A sensor-based task says only what its safety
 *  interval adds; the sensor rule is a row of its own. */
export function scheduleSentence(d: RuleDraft, lang: string): string {
  const L = lang;
  const every = (): string | null => {
    const n = parseInt(d.intervalDays, 10);
    return Number.isFinite(n) && n > 0 ? intervalText(n, d.intervalUnit, L) : null;
  };
  switch (d.scheduleType) {
    case "time_based": {
      const span = every();
      return span ? fill(t("beta_rules_every", L), { interval: span }) : t("beta_rules_manual", L);
    }
    case "one_time":
      return d.dueDate ? fill(t("beta_rules_once_on", L), { date: formatDate(d.dueDate, L) }) : t("beta_rules_no_date", L);
    case "manual":
      return t("beta_rules_manual", L);
    case "weekdays": {
      const days = [...d.weekdays].sort((a, b) => a - b).map((w) => weekdayName(w, L, "short"));
      return `${t("recurrence_on_days", L)}: ${days.length ? days.join(", ") : "—"}`;
    }
    case "nth_weekday": {
      const ord = d.nth === "-1" ? t("ord_last", L) : t(`ord_${d.nth}`, L);
      return `${t("nth_weekday", L)}: ${ord} ${weekdayName(parseInt(d.nthWeekday, 10) || 0, L, "long")}`;
    }
    case "day_of_month":
      return `${t("day_of_month", L)}: ${d.domLastDay ? t("recurrence_last_day", L) : d.domDay}`;
    case "calendar":
      return `${t("calendar_entity_label", L)}: ${d.calendarEntity || "—"}`;
    case "sensor_based": {
      const span = every();
      if (!span) return t("beta_rules_sensor_only", L);
      return fill(t(d.triggerCombinator === "all" ? "beta_rules_safety_all" : "beta_rules_safety_any", L), { interval: span });
    }
    default:
      return t(d.scheduleType, L);
  }
}

/** The second line of the schedule: when it is due soon, and how an interval counts. */
export function scheduleBadges(d: RuleDraft, lang: string): string[] {
  const out: string[] = [];
  if (d.scheduleType === "time_based" && parseInt(d.intervalDays, 10) > 0) {
    out.push(t(d.intervalAnchor === "planned" ? "anchor_planned" : "anchor_completion", lang));
  }
  const warn = parseInt(d.warningDays, 10);
  if (d.scheduleType !== "manual" && Number.isFinite(warn) && warn > 0) {
    out.push(fill(t("beta_rules_due_soon", lang), { interval: formatUnit(warn, "day", lang) }));
  }
  return out;
}

/** The sensor rule as a sentence (its entities are the row's chips). */
export function triggerSentence(d: RuleDraft, lang: string): string {
  const L = lang;
  if (d.triggerType === "compound") {
    const key = d.compoundLogic === "OR" ? "beta_rules_any_of" : "beta_rules_all_of";
    return fill(t(key, L), { n: formatNumber(d.compoundCount, L) });
  }
  if (!d.triggerEntityIds.length) return t("beta_rules_pick_entity", L);
  const parts: string[] = [];
  const forMin = parseInt(d.forMinutes, 10);
  const holds = Number.isFinite(forMin) && forMin > 0 ? fill(t("beta_rules_for", L), { duration: formatUnit(forMin, "minute", L) }) : "";
  switch (d.triggerType) {
    case "threshold": {
      const above = num(d.above);
      const below = num(d.below);
      if (above !== null) parts.push(fill(t("beta_rules_above", L), { value: formatNumber(above, L) }));
      if (below !== null) parts.push(fill(t("beta_rules_below", L), { value: formatNumber(below, L) }));
      if (!parts.length) parts.push(t("threshold", L));
      if (holds) parts.push(holds);
      break;
    }
    case "counter": {
      const v = num(d.targetValue);
      const value = v === null ? "—" : formatNumber(v, L);
      parts.push(fill(t(d.deltaMode ? "beta_rules_counter_delta" : "beta_rules_counter_reaches", L), { value }));
      break;
    }
    case "state_change": {
      const from = d.fromState.trim();
      const to = d.toState.trim();
      if (from) parts.push(fill(t("beta_rules_changes_from", L), { state: from }));
      if (to) parts.push(fill(t("beta_rules_changes_to", L), { state: to }));
      if (!from && !to) parts.push(t("beta_rules_changes", L));
      const n = parseInt(d.targetChanges, 10);
      if (Number.isFinite(n) && n > 1) parts.push(fill(t("beta_rules_times", L), { n: formatNumber(n, L) }));
      if (holds) parts.push(holds);
      break;
    }
    case "runtime": {
      const h = num(d.runtimeHours);
      parts.push(fill(t("beta_rules_runs_for", L), { duration: h === null ? "—" : formatUnit(h, "hour", L) }));
      break;
    }
    case "due_date": {
      const days = parseInt(d.daysBefore, 10);
      parts.push(Number.isFinite(days) && days > 0
        ? fill(t("beta_rules_date_before", L), { interval: formatUnit(days, "day", L) })
        : t("beta_rules_date_on", L));
      break;
    }
  }
  const sentence = parts.join(" · ");
  return d.triggerAttribute ? `${sentence} (${d.triggerAttribute})` : sentence;
}

/** Languages that put a space before "%" — Home Assistant's own list
 *  (blankBeforePercent), so "below 60 %" reads like the state next to it. */
const BLANK_BEFORE_PERCENT = ["cs", "de", "fi", "fr", "sk", "sv"];

/** A number with its unit the way Home Assistant writes a state. */
export function withUnit(value: string, unit: string | null | undefined, lang: string): string {
  if (!unit) return value;
  if (unit === "%") return BLANK_BEFORE_PERCENT.includes(lang.split("-")[0]) ? `${value} %` : `${value}%`;
  if (unit === "°") return `${value}°`;
  return `${value} ${unit}`;
}

/** One sensor's part of a stored rule, worded like the rule row of the beta
 *  editor ("below 60%", "goes up by 40 since the last completion", "changes
 *  to paper_jam"), with the sensor's unit. The task page's sensor rows say
 *  it under each sensor (renderers/sparkline.ts); a compound passes each
 *  condition. */
export function conditionText(tc: TriggerConfig, unit: string | null | undefined, lang: string): string {
  const L = lang;
  const v = (n: number) => withUnit(formatNumber(n, L), unit, L);
  const parts: string[] = [];
  const type = tc.type || "threshold";
  switch (type) {
    case "threshold":
      if (tc.trigger_above != null) parts.push(fill(t("beta_rules_above", L), { value: v(tc.trigger_above) }));
      if (tc.trigger_below != null) parts.push(fill(t("beta_rules_below", L), { value: v(tc.trigger_below) }));
      if (tc.trigger_equals != null) parts.push(`= ${typeof tc.trigger_equals === "number" ? v(tc.trigger_equals) : tc.trigger_equals}`);
      if (tc.trigger_not_equals != null) parts.push(`≠ ${typeof tc.trigger_not_equals === "number" ? v(tc.trigger_not_equals) : tc.trigger_not_equals}`);
      if (!parts.length) parts.push(t("threshold", L));
      break;
    case "counter":
      parts.push(fill(t(tc.trigger_delta_mode ? "beta_rules_counter_delta" : "beta_rules_counter_reaches", L), {
        value: tc.trigger_target_value != null ? v(tc.trigger_target_value) : "—",
      }));
      break;
    case "state_change": {
      const from = (tc.trigger_from_state ?? "").trim();
      const to = (tc.trigger_to_state ?? "").trim();
      if (from) parts.push(fill(t("beta_rules_changes_from", L), { state: from }));
      if (to) parts.push(fill(t("beta_rules_changes_to", L), { state: to }));
      if (!from && !to) parts.push(t("beta_rules_changes", L));
      if (tc.trigger_target_changes && tc.trigger_target_changes > 1) parts.push(fill(t("beta_rules_times", L), { n: formatNumber(tc.trigger_target_changes, L) }));
      break;
    }
    case "runtime":
      parts.push(fill(t("beta_rules_runs_for", L), { duration: tc.trigger_runtime_hours != null ? formatUnit(tc.trigger_runtime_hours, "hour", L) : "—" }));
      break;
    case "due_date":
      parts.push(tc.trigger_days_before && tc.trigger_days_before > 0
        ? fill(t("beta_rules_date_before", L), { interval: formatUnit(tc.trigger_days_before, "day", L) })
        : t("beta_rules_date_on", L));
      break;
  }
  if ((type === "threshold" || type === "state_change") && tc.trigger_for_minutes && tc.trigger_for_minutes > 0) {
    parts.push(fill(t("beta_rules_for", L), { duration: formatUnit(tc.trigger_for_minutes, "minute", L) }));
  }
  const sentence = parts.join(" · ");
  return tc.attribute ? `${sentence} (${tc.attribute})` : sentence;
}

/** How the task gets done, as a sentence plus what completing it asks. */
export function completionSentence(d: RuleDraft, ctx: RuleContext): { text: string; chips: string[]; badges: string[] } {
  const L = ctx.lang;
  const chips: string[] = [];
  let text: string;
  if (d.completeWhenEntity && d.completeWhenState.trim()) {
    const name = ctx.entityName(d.completeWhenEntity);
    chips.push(name);
    text = fill(t("complete_when_badge", L), { entity: name, state: d.completeWhenState.trim() });
    const hold = parseInt(d.completeWhenFor, 10);
    if (Number.isFinite(hold) && hold > 0) text += ` · ${fill(t("complete_when_badge_for", L), { minutes: formatNumber(hold, L) })}`;
    if (d.completeWhenAnyTime) text += ` · ${t("complete_when_badge_any_time", L)}`;
  } else {
    text = t("beta_rules_by_hand", L);
  }
  const badges: string[] = [];
  if (d.quickOn) badges.push(t("quick_complete_label", L));
  if (d.requiredCount > 0) badges.push(`${t("require_on_completion", L)}: ${formatNumber(d.requiredCount, L)}`);
  if (d.checklistCount > 0) badges.push(`${t("checklist", L)}: ${formatNumber(d.checklistCount, L)}`);
  if (d.partsCount > 0) badges.push(`${t("consumes_parts_label", L)}: ${formatNumber(d.partsCount, L)}`);
  if (d.requireTagScan) badges.push(t("require_tag_scan", L));
  if (!d.allowSkip) badges.push(t("disallow_skip", L));
  return { text, chips, badges };
}

/** All rows for the draft, in the editor's order. */
export function buildRuleRows(d: RuleDraft, ctx: RuleContext): RuleRow[] {
  const L = ctx.lang;
  const rows: RuleRow[] = [];
  rows.push({
    id: "task",
    icon: "mdi:clipboard-text-outline",
    text: d.name.trim() || t("beta_rules_name_missing", L),
    chips: [],
    badges: [d.typeLabel, ...(d.enabled ? [] : [t("disabled", L)])],
    removable: false,
  });
  const sensor = d.scheduleType === "sensor_based";
  rows.push({
    id: "schedule",
    icon: scheduleIcon(d.scheduleType),
    text: scheduleSentence(d, L),
    chips: [],
    badges: scheduleBadges(d, L),
    removable: sensor ? parseInt(d.intervalDays, 10) > 0 : d.scheduleType !== "manual",
  });
  if (sensor) {
    const ids = d.triggerType === "compound" ? d.compoundEntityIds : d.triggerEntityIds;
    rows.push({
      id: "trigger",
      icon: TRIGGER_ICONS[d.triggerType] ?? "mdi:gauge",
      text: triggerSentence(d, L),
      chips: [...new Set(ids)].map((id) => ctx.entityName(id)),
      badges: d.triggerType !== "compound" && d.triggerEntityIds.length > 1
        ? [t(d.entityLogic === "all" ? "entity_logic_all" : "entity_logic_any", L)]
        : [],
      removable: true,
    });
  }
  const done = completionSentence(d, ctx);
  rows.push({ id: "completion", icon: "mdi:check-circle-outline", text: done.text, chips: done.chips, badges: done.badges, removable: false });
  const peopleBadges = d.pool.length >= 2 && d.rotation ? [t(`rotation_${d.rotation}`, L)] : [];
  let peopleText: string;
  if (d.responsibleUserId) peopleText = `${t("responsible_user", L)}: ${ctx.userName(d.responsibleUserId)}`;
  else if (d.pool.length) peopleText = `${t("task_shared_with", L)}: ${d.pool.map((u) => ctx.userName(u)).join(", ")}`;
  else peopleText = t("beta_rules_nobody", L);
  rows.push({ id: "people", icon: "mdi:account-multiple", text: peopleText, chips: [], badges: peopleBadges, removable: false });
  rows.push({
    id: "notifications",
    icon: d.notifyEnabled ? "mdi:bell-ring-outline" : "mdi:bell-off-outline",
    text: d.notifyEnabled ? t("beta_rules_reminders_on", L) : t("no_notifications", L),
    chips: d.mirrorLists.map((id) => ctx.entityName(id)),
    badges: [],
    removable: false,
  });
  return rows;
}

/** What picking a rule type in the add picker does to the current rules. */
export type RuleEffect = "set" | "replace" | "combine" | "safety";

export interface RuleChoice {
  kind: "schedule" | "trigger";
  value: string;
  icon: string;
  effect: RuleEffect;
}

/** The rule types the add picker offers for the current rules, with what
 *  each does: a sensor-based task gets a safety interval or a second sensor
 *  rule (a compound), a date-only task becomes sensor-based (an interval
 *  stays as its safety interval) or swaps its schedule. */
export function ruleChoices(d: { scheduleType: string; intervalDays: string; triggerType: TriggerType }): RuleChoice[] {
  const sensor = d.scheduleType === "sensor_based";
  const hasInterval = parseInt(d.intervalDays, 10) > 0;
  const out: RuleChoice[] = [];
  for (const kind of ADD_SCHEDULE_KINDS) {
    if (kind === d.scheduleType) continue;
    let effect: RuleEffect;
    if (sensor) {
      if (kind === "time_based") {
        if (hasInterval) continue;
        effect = "safety";
      } else {
        effect = "replace";
      }
    } else {
      effect = d.scheduleType === "manual" ? "set" : "replace";
    }
    out.push({ kind: "schedule", value: kind, icon: scheduleIcon(kind), effect });
  }
  for (const type of ADD_TRIGGER_TYPES) {
    if (sensor && type === "compound") continue;
    let effect: RuleEffect;
    if (sensor) effect = "combine";
    else effect = d.scheduleType === "time_based" || d.scheduleType === "manual" ? "set" : "replace";
    out.push({ kind: "trigger", value: type, icon: TRIGGER_ICONS[type], effect });
  }
  return out;
}

/** The facts about an entity the device suggestions are read from. */
export interface EntityFacts {
  entityId: string;
  name: string;
  domain: string;
  deviceClass?: string;
  stateClass?: string;
  numeric: boolean;
}

export interface RuleSuggestion {
  entityId: string;
  name: string;
  /** A sensor rule of `triggerType`, or the task's "Done when". */
  target: "trigger" | "done_when";
  triggerType?: TriggerType;
  icon: string;
}

const ON_OFF_DOMAINS = new Set(["binary_sensor", "input_boolean", "switch", "fan", "light", "lock", "cover", "valve", "siren"]);
const RUNNING_DOMAINS = new Set(["switch", "fan", "light", "valve", "input_boolean"]);
const RUNNING_CLASSES = new Set(["running", "power", "plug", "heat", "cold", "moving", "vibration"]);
const DONE_CLASSES = new Set(["door", "opening", "window", "garage_door", "lock", "running", "moving", "vibration", "occupancy", "presence"]);
const COUNTING_STATE_CLASSES = new Set(["total", "total_increasing"]);
const STATEFUL_DOMAINS = new Set(["select", "input_select", "vacuum", "lawn_mower", "climate", "water_heater", "media_player", "alarm_control_panel", "event"]);

/** The rules an entity suggests, most fitting first. A device's door
 *  suggests "Done when"; a counting sensor a counter rule; a measurement a
 *  limit; a date sensor its date; an on/off entity a state change and hours
 *  of running. */
export function suggestionsFor(e: EntityFacts): RuleSuggestion[] {
  const base = { entityId: e.entityId, name: e.name };
  const rule = (triggerType: TriggerType): RuleSuggestion => ({ ...base, target: "trigger", triggerType, icon: TRIGGER_ICONS[triggerType] });
  const doneWhen: RuleSuggestion = { ...base, target: "done_when", icon: "mdi:check-circle-outline" };
  if (e.domain === "sensor") {
    if (e.deviceClass === "timestamp" || e.deviceClass === "date") return [rule("due_date")];
    if (e.numeric) {
      if (COUNTING_STATE_CLASSES.has(e.stateClass ?? "")) return [rule("counter"), rule("threshold")];
      if (e.deviceClass === "duration") return [rule("threshold"), rule("counter")];
      return [rule("threshold")];
    }
    return [rule("state_change"), doneWhen];
  }
  if (e.domain === "counter") return [rule("counter")];
  if (e.domain === "number" || e.domain === "input_number") return [rule("threshold")];
  if (ON_OFF_DOMAINS.has(e.domain)) {
    const out: RuleSuggestion[] = [];
    if (DONE_CLASSES.has(e.deviceClass ?? "")) out.push(doneWhen);
    out.push(rule("state_change"));
    if (RUNNING_DOMAINS.has(e.domain) || RUNNING_CLASSES.has(e.deviceClass ?? "")) out.push(rule("runtime"));
    if (!out.includes(doneWhen)) out.push(doneWhen);
    return out;
  }
  if (STATEFUL_DOMAINS.has(e.domain)) return [rule("state_change"), doneWhen];
  return [];
}

/** A registry entry as far as the device suggestions read it. */
interface RegistryEntity {
  entity_id?: string;
  platform?: string;
  device_id?: string | null;
  area_id?: string | null;
  entity_category?: string | null;
  hidden?: boolean;
}

/** A device registry entry as far as the suggestions read it. */
interface RegistryDevice {
  area_id?: string | null;
}

/** Where a suggested entity comes from: the object's own device, or the
 *  rest of its area. */
export type EntityGroup = "device" | "area";

/** The entities that suggest a rule: the object's own device first (its
 *  entities are the likeliest to matter), then the rest of the area — the
 *  object's area, else its device's. An entity sits where HA puts it: its
 *  own area, else its device's. Not this integration's own, not hidden;
 *  in each group the diagnostic and configuration ones last. */
export function deviceEntityFacts(
  hass: {
    states?: Record<string, { state: string; attributes: Record<string, unknown> }>;
    entities?: Record<string, RegistryEntity>;
    devices?: Record<string, RegistryDevice>;
  },
  opts: { deviceId?: string | null; areaId?: string | null; ownPlatform: string },
): Array<EntityFacts & { group: EntityGroup }> {
  const devices = hass.devices ?? {};
  const areaId = opts.areaId || (opts.deviceId ? devices[opts.deviceId]?.area_id : null) || null;
  const areaOf = (e: RegistryEntity) => e.area_id || (e.device_id ? devices[e.device_id]?.area_id : null) || null;
  const facts: Array<EntityFacts & { group: EntityGroup; secondary: boolean }> = [];
  for (const [id, e] of Object.entries(hass.entities ?? {})) {
    if (e.platform === opts.ownPlatform || e.hidden) continue;
    let group: EntityGroup;
    if (opts.deviceId && e.device_id === opts.deviceId) group = "device";
    else if (areaId && areaOf(e) === areaId) group = "area";
    else continue;
    const st = hass.states?.[id];
    if (!st) continue;
    const attrs = st.attributes ?? {};
    facts.push({
      entityId: id,
      name: typeof attrs.friendly_name === "string" ? attrs.friendly_name : id,
      domain: id.split(".")[0],
      deviceClass: typeof attrs.device_class === "string" ? attrs.device_class : undefined,
      stateClass: typeof attrs.state_class === "string" ? attrs.state_class : undefined,
      // A sensor with a unit is a measurement even while it is unavailable.
      numeric: (st.state !== "" && Number.isFinite(Number(st.state))) || typeof attrs.unit_of_measurement === "string",
      group,
      secondary: !!e.entity_category,
    });
  }
  const rank = (f: { group: EntityGroup }) => (f.group === "device" ? 0 : 1);
  facts.sort((a, b) => rank(a) - rank(b) || Number(a.secondary) - Number(b.secondary) || a.name.localeCompare(b.name));
  return facts.map(({ secondary: _s, ...f }) => f).filter((f) => suggestionsFor(f).length > 0);
}
