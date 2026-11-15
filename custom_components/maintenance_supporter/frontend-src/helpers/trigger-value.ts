/** A trigger firing's value, as the history and the trace show it. The
 *  reading with its unit, or what a state rule saw change: a state rule's
 *  trigger_value is only the count of changes, and the history said "Trigger
 *  value: 1". An update entity names its versions. A rule on several
 *  sensors names the one that fired, and a completion the rule recorded by
 *  itself says what ended it and how long after the firing. */

import { formatNumber, t, withUnit } from "../styles";
import { stampMs } from "./ha-time";
import { spanText } from "./span-text";
import type { HistoryEntry } from "../types";

export interface TriggerValueContext {
  /** The trigger sensor's unit, for a reading. */
  unit?: string | null;
  /** The task's rule is a state rule: a firing without its transition (from
   *  before 2.119) shows no value rather than the count. */
  stateRule?: boolean;
  /** A sensor by its name. With more than one sensor in the rule the row
   *  says which one fired: a rule on nine routers said "8.51 available"
   *  twice, for two of them. */
  entityName?: (entityId: string) => string;
  /** How many sensors the rule watches (one needs no name). */
  sensors?: number;
  /** The task's history: an automatic completion says how long after the
   *  firing it came. */
  history?: readonly HistoryEntry[];
}

function text(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** The sensor a firing or a recovery names, when the rule has several. */
function sensorOf(change: { entity?: unknown }, ctx: TriggerValueContext): string {
  const id = text(change.entity);
  if (!id || !ctx.entityName || (ctx.sensors ?? 1) < 2) return "";
  return ctx.entityName(id);
}

const LIFECYCLE = new Set(["triggered", "completed", "skipped", "reset"]);

/** How long after the firing that opened its cycle a completion came:
 *  the entry just before it must be that firing ("" otherwise). */
export function afterFiringText(h: HistoryEntry, history: readonly HistoryEntry[] | undefined, lang: string): string {
  const at = stampMs(h.timestamp);
  if (!history || Number.isNaN(at)) return "";
  let prev: HistoryEntry | null = null;
  let prevAt = -Infinity;
  for (const e of history) {
    if (e === h || !LIFECYCLE.has(e.type)) continue;
    const ms = stampMs(e.timestamp);
    if (Number.isNaN(ms) || ms > at || ms < prevAt) continue;
    if (ms === at && e.type !== "triggered") continue;
    prev = e;
    prevAt = ms;
  }
  if (!prev || prev.type !== "triggered" || !(at - prevAt > 0)) return "";
  return t("trigger_after_report", lang).split("{duration}").join(spanText(at - prevAt, lang));
}

/** What ended a cycle the rule completed by itself: the sensor, an
 *  update's installed version and how long after the firing. */
function recoveryText(h: HistoryEntry, lang: string, ctx: TriggerValueContext): string {
  const change = h.trigger_change;
  if (!change || typeof change !== "object") return "";
  const installed = text(change.installed);
  const parts = [
    installed ? t("trigger_update_installed", lang).split("{installed}").join(installed) : "",
    afterFiringText(h, ctx.history, lang),
  ].filter(Boolean);
  const who = sensorOf(change, ctx);
  const rest = parts.join(" · ");
  return who && rest ? `${who}: ${rest}` : who || rest;
}

/** "Trigger value: 74,606.275 km", "Trigger value: off → on",
 *  "v2026.11.0 available, v0.9.74 installed", "Router 2: 8.51 available,
 *  8.25 installed"; for an automatic completion "Router 2: 8.51 installed ·
 *  4 minutes after the report"; "" when there is nothing to say. */
export function triggerValueText(h: HistoryEntry, lang: string, ctx: TriggerValueContext = {}): string {
  if (h.type === "completed") return recoveryText(h, lang, ctx);
  const change = h.trigger_change;
  if (change && typeof change === "object") {
    const who = sensorOf(change, ctx);
    const named = (s: string): string => (who ? `${who}: ${s}` : s);
    const latest = text(change.latest);
    const installed = text(change.installed);
    if (latest && installed && latest !== installed) {
      return named(t("trigger_update_available", lang).split("{latest}").join(latest).split("{installed}").join(installed));
    }
    const to = text(change.to);
    const from = text(change.from);
    if (to) return named(`${t("trigger_val", lang)}: ${from ? `${from} → ` : ""}${to}`);
  }
  if (ctx.stateRule || typeof h.trigger_value !== "number" || !Number.isFinite(h.trigger_value)) return "";
  return `${t("trigger_val", lang)}: ${withUnit(formatNumber(h.trigger_value, lang, { maximumFractionDigits: 3 }), ctx.unit, lang)}`;
}
