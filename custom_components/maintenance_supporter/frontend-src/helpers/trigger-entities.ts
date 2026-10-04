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
