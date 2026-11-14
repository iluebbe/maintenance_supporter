/** A trigger firing's value, as the history and the trace show it. The
 *  reading with its unit, or what a state rule saw change: a state rule's
 *  trigger_value is only the count of changes, and the history said "Trigger
 *  value: 1". An update entity names its versions. */

import { formatNumber, t, withUnit } from "../styles";
import type { HistoryEntry } from "../types";

export interface TriggerValueContext {
  /** The trigger sensor's unit, for a reading. */
  unit?: string | null;
  /** The task's rule is a state rule: a firing without its transition (from
   *  before 2.119) shows no value rather than the count. */
  stateRule?: boolean;
}

function text(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** "Trigger value: 74,606.275 km", "Trigger value: off → on",
 *  "v2026.11.0 available, v0.9.74 installed"; "" when there is nothing to say. */
export function triggerValueText(h: HistoryEntry, lang: string, ctx: TriggerValueContext = {}): string {
  const change = h.trigger_change;
  if (change && typeof change === "object") {
    const latest = text(change.latest);
    const installed = text(change.installed);
    if (latest && installed && latest !== installed) {
      return t("trigger_update_available", lang).split("{latest}").join(latest).split("{installed}").join(installed);
    }
    const to = text(change.to);
    const from = text(change.from);
    if (to) return `${t("trigger_val", lang)}: ${from ? `${from} → ` : ""}${to}`;
  }
  if (ctx.stateRule || typeof h.trigger_value !== "number" || !Number.isFinite(h.trigger_value)) return "";
  return `${t("trigger_val", lang)}: ${withUnit(formatNumber(h.trigger_value, lang, { maximumFractionDigits: 3 }), ctx.unit, lang)}`;
}
