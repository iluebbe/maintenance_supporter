/** The entities a stored trigger watches, in either stored shape.
 *
 *  A trigger keeps its entities as the ``entity_ids`` list, the legacy single
 *  ``entity_id``, or both. The charts, the overview sparkline and the trend
 *  arrow read only ``entity_id``, so a trigger stored with just the list (an
 *  adopted problem sensor) showed none of them (same-class audit 2026-10-04).
 *  These are the twins of the backend's ``normalize_entity_ids`` and
 *  ``primary_entity_id`` (entity/triggers/__init__.py); a tripwire test keeps
 *  the panel and the renderers on them.
 */
import type { TriggerConfig } from "../types";

/** Every entity of a single-source trigger: ``entity_ids``, else the legacy
 *  ``entity_id``. A compound keeps its entities in its conditions. */
/** An entity as people know it: its friendly name, else the id. Settings,
 *  the task dialog and the task page each read the attribute by hand (DRY
 *  audit 2026-10-30). */
export function entityName(hass: { states?: Record<string, { attributes?: { friendly_name?: unknown } } | undefined> } | null | undefined, entityId: string): string {
  const name = hass?.states?.[entityId]?.attributes?.friendly_name;
  return typeof name === "string" && name ? name : entityId;
}

/** A compound rule's logic as the backend reads it (entity/triggers/
 *  compound.py): any case, AND unless it says otherwise. The dialog read
 *  "and" as AND and "or" as AND, the sensor card "and" as OR (DRY audit
 *  2026-11-07, FE7-B2). Only `compound_logic`: a legacy `operator` key the
 *  backend never reads made the panel say OR for a rule that runs as AND
 *  (bug audit 2026-11-08, E8-8). */
export function compoundLogic(tc: Pick<TriggerConfig, "compound_logic"> | null | undefined): "AND" | "OR" {
  return String(tc?.compound_logic || "AND").toUpperCase() === "AND" ? "AND" : "OR";
}

export function triggerEntityIds(tc: TriggerConfig | null | undefined): string[] {
  if (!tc) return [];
  if (Array.isArray(tc.entity_ids) && tc.entity_ids.length > 0) return [...tc.entity_ids];
  return tc.entity_id ? [tc.entity_id] : [];
}

/** The entity a single-source trigger is charted by: the first of
 *  {@link triggerEntityIds}, or undefined for a compound or no trigger. */
export function primaryTriggerEntity(tc: TriggerConfig | null | undefined): string | undefined {
  if (!tc || tc.type === "compound") return undefined;
  return triggerEntityIds(tc)[0];
}

/** The unit of the sensor a single-source trigger watches: its state's,
 *  else the one the backend reported. The sensor rule's chart, the history
 *  and the trace show a firing's value with it. */
export function triggerUnit(
  hass: { states?: Record<string, { attributes?: { unit_of_measurement?: unknown } } | undefined> } | null | undefined,
  task: { trigger_config?: TriggerConfig | null; trigger_entity_info?: { unit_of_measurement?: string | null } | null } | null | undefined,
): string {
  const primary = primaryTriggerEntity(task?.trigger_config);
  const own = primary ? hass?.states?.[primary]?.attributes?.unit_of_measurement : undefined;
  return (typeof own === "string" ? own : undefined) ?? task?.trigger_entity_info?.unit_of_measurement ?? "";
}

/** Whether the task's rule counts state changes: its firings' value is
 *  the count, not a reading (the history and the trace leave it out). */
export function isStateRule(task: { trigger_config?: TriggerConfig | null } | null | undefined): boolean {
  return task?.trigger_config?.type === "state_change";
}

/** One sensor of the rule: the entity and the condition it answers. */
export interface RuleSensor {
  entityId: string;
  cond: TriggerConfig;
}

/** The sensors a rule watches, one row each: every entity of a single or
 *  multi-entity rule with the rule's condition, every entity of every
 *  condition of a compound with that condition's. */
export function ruleSensors(tc: TriggerConfig): RuleSensor[] {
  if (tc.type === "compound") {
    return (tc.conditions || []).flatMap((c) => triggerEntityIds(c).map((entityId) => ({ entityId, cond: c })));
  }
  return triggerEntityIds(tc).map((entityId) => ({ entityId, cond: tc }));
}

/** Counter-style triggers chart the recorder's sum / change, every other
 *  kind a level (mean / min / max): two different series of one entity. */
export function isCounterTrigger(tc: TriggerConfig | null | undefined): boolean {
  if (!tc) return false;
  const type = tc.type || "threshold";
  return type === "counter" || type === "state_change";
}

/** The key of a row's overview sparkline series: its entity plus that kind.
 *  One sensor can sit behind a counter task and a level task at once, and
 *  both rows showed whichever series came back last (bug audit 2026-10-16). */
export function miniSeriesKey(entityId: string, isCounter: boolean): string {
  return `${entityId}:${isCounter ? "counter" : "level"}`;
}
