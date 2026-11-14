/** The per-type fields of one sensor rule as the task dialog edits them:
 *  string-typed like the form inputs, coerced on save. The flat trigger
 *  form, every compound condition and the beta editor's rule row read them
 *  through these rules only. */

import type { TriggerConfig, TriggerType } from "../types";

/** The per-type trigger fields BOTH editors own — the flat trigger form and
 *  every compound condition. The flat form used to hydrate and serialize
 *  them with its own copy of the rules below, and the copies had drifted:
 *  a compound state_change condition dropped its #136 hold time
 *  (`trigger_for_minutes`, a managed key, so not carried either) on every
 *  save (DRY audit 2026-09-26). */
export interface TriggerTypeFields {
  type: TriggerType;
  attribute: string; // "" = use the entity state
  above: string;
  below: string;
  equals: string;
  notEquals: string;
  forMinutes: string;
  targetValue: string;
  deltaMode: boolean;
  fromState: string;
  toState: string;
  targetChanges: string;
  runtimeHours: string;
  onStates: string;
  daysBefore: string;
}

/** The fields of a new, empty rule. */
export function emptyTypeFields(): TriggerTypeFields {
  return {
    type: "threshold", attribute: "", above: "", below: "",
    equals: "", notEquals: "", forMinutes: "0",
    targetValue: "", deltaMode: false, fromState: "", toState: "",
    targetChanges: "", runtimeHours: "", onStates: "", daysBefore: "0",
  };
}

/** Storage → form for the shared per-type fields. */
export function typeFieldsFromConfig(c: TriggerConfig): TriggerTypeFields {
  return {
    type: c.type || "threshold",
    attribute: c.attribute || "",
    above: c.trigger_above?.toString() ?? "",
    below: c.trigger_below?.toString() ?? "",
    equals: c.trigger_equals?.toString() ?? "",
    notEquals: c.trigger_not_equals?.toString() ?? "",
    forMinutes: c.trigger_for_minutes?.toString() ?? "0",
    targetValue: c.trigger_target_value?.toString() ?? "",
    deltaMode: c.trigger_delta_mode || false,
    fromState: c.trigger_from_state || "",
    toState: c.trigger_to_state || "",
    targetChanges: c.trigger_target_changes?.toString() ?? "",
    runtimeHours: c.trigger_runtime_hours?.toString() ?? "",
    onStates: (c.trigger_on_states || []).join(", "),
    daysBefore: c.trigger_days_before?.toString() ?? "0",
  };
}

/** Form → storage: writes the shared per-type fields onto `c` (only the
 *  ones the type uses; unparsable numbers are left out). */
export function applyTypeFields(c: TriggerConfig, d: TriggerTypeFields): void {
  if (d.attribute) c.attribute = d.attribute;
  const forMinutes = parseInt(d.forMinutes, 10);
  if (d.type === "threshold") {
    const a = parseFloat(d.above); if (!isNaN(a)) c.trigger_above = a;
    const b = parseFloat(d.below); if (!isNaN(b)) c.trigger_below = b;
    const eq = parseFloat(d.equals); if (!isNaN(eq)) c.trigger_equals = eq;
    const ne = parseFloat(d.notEquals); if (!isNaN(ne)) c.trigger_not_equals = ne;
    if (!isNaN(forMinutes)) c.trigger_for_minutes = forMinutes;
  } else if (d.type === "counter") {
    const v = parseFloat(d.targetValue); if (!isNaN(v)) c.trigger_target_value = v;
    c.trigger_delta_mode = d.deltaMode;
  } else if (d.type === "state_change") {
    if (d.fromState) c.trigger_from_state = d.fromState;
    if (d.toState) c.trigger_to_state = d.toState;
    const n = parseInt(d.targetChanges, 10); if (!isNaN(n)) c.trigger_target_changes = n;
    // #136: the new state must hold this long before a change counts.
    if (!isNaN(forMinutes)) c.trigger_for_minutes = forMinutes;
  } else if (d.type === "runtime") {
    const h = parseFloat(d.runtimeHours); if (!isNaN(h)) c.trigger_runtime_hours = h;
    const on = (d.onStates || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (on.length > 0) c.trigger_on_states = on;
  } else if (d.type === "due_date") {
    const days = parseInt(d.daysBefore, 10);
    c.trigger_days_before = isNaN(days) ? 0 : days;
  }
}

/** The fields as a stored rule without its entities (what the rule says). */
export function configFromTypeFields(d: TriggerTypeFields): TriggerConfig {
  const c = { type: d.type } as TriggerConfig;
  applyTypeFields(c, d);
  return c;
}
