/** Task phases (#139) — frontend twin of helpers/phases.py.
 *
 * One shared cadence, an ordered cycle of phase ids, a rotating cursor. A
 * phase field that is SET overrides the task-level field; unset falls
 * through (override, never merge). The clamp mirrors the backend so a stale
 * cursor from the Store can never index out of range.
 */

import type { MaintenanceTask, TaskPartLink, TaskPhaseDef } from "../types";

export interface EffectivePhase {
  id: string;
  name: string;
  index: number;
  count: number;
  notes?: string;
  /** Effective values for the phase currently due (already fallen through). */
  checklist: string[];
  consumesParts: TaskPartLink[];
  requiredFields: string[];
}

export function clampPhaseCursor(cursor: unknown, sequenceLen: number): number {
  if (sequenceLen <= 0) return 0;
  const value = typeof cursor === "number" && Number.isFinite(cursor) ? Math.trunc(cursor) : 0;
  return value < 0 ? 0 : value % sequenceLen;
}

export function hasPhases(task: Pick<MaintenanceTask, "phases" | "phase_sequence"> | null | undefined): boolean {
  return !!(task?.phases && task.phase_sequence && task.phase_sequence.length > 0);
}

/** The phase currently due, with the task's fields already applied as
 *  fallbacks — exactly what the complete dialog needs. Null for phase-less
 *  tasks. */
export function effectivePhase(
  task:
    | Pick<
        MaintenanceTask,
        "phases" | "phase_sequence" | "phase_cursor" | "checklist" | "consumes_parts" | "required_completion_fields"
      >
    | null
    | undefined,
): EffectivePhase | null {
  if (!task || !hasPhases(task)) return null;
  const seq = task.phase_sequence!;
  const index = clampPhaseCursor(task.phase_cursor, seq.length);
  const id = seq[index];
  const def: TaskPhaseDef | undefined = task.phases?.[id];
  if (!def) return null;
  return {
    id,
    name: def.name,
    index,
    count: seq.length,
    notes: def.notes,
    checklist: def.checklist !== undefined ? def.checklist : task.checklist ?? [],
    consumesParts: def.consumes_parts !== undefined ? def.consumes_parts : task.consumes_parts ?? [],
    requiredFields:
      def.required_completion_fields !== undefined
        ? def.required_completion_fields
        : task.required_completion_fields ?? [],
  };
}

/** "2/4 · Flip blades" — the compact label surfaces show next to the task. */
export function phaseLabel(task: Parameters<typeof effectivePhase>[0]): string {
  const phase = effectivePhase(task);
  return phase ? `${phase.index + 1}/${phase.count} · ${phase.name}` : "";
}
