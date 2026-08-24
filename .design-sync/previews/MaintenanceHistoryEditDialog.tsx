/** MaintenanceHistoryEditDialog — edit a past history entry (timestamp /
 * notes / cost / duration) incl. the recorded part consumption (#130).
 * Opened imperatively via openEdit(draft); loads parts/overview on open.
 *
 * The kit's parts/overview rows use `id` and carry no `consumers`, which this
 * dialog requires — so the preview overrides the handler with the real
 * backend shape (part_id + consumers) covering own AND pooled parts. */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

/** The capture harness's story root has transform:translateZ(0), which makes
 * it the containing block for position:fixed — this dialog self-positions
 * (fixed, centered) and would center on the zero-height mount, clipping its
 * top half above the viewport. Neutralize so it anchors to the real viewport. */
const FixedAnchor = () => (
  <style>{".ds-single{transform:none !important}"}</style>
);

const partsHass = () =>
  dsDemoHass({
    handlers: {
      "maintenance_supporter/parts/overview": () => ({
        parts: [
          { part_id: "p_filter", name: "HEPA filter", entry_id: "demo_hvac", object_name: "HVAC Unit", consumers: [] },
          { part_id: "p_coil_spray", name: "Coil cleaner spray", entry_id: "demo_hvac", object_name: "HVAC Unit", consumers: [] },
          // Pooled part (#111) another object owns but t_filter draws on.
          { part_id: "p_chlorine", name: "Chlorine tabs", entry_id: "demo_pool", object_name: "Pool Pump",
            consumers: [{ entry_id: "demo_hvac", task_id: "t_filter" }] },
        ],
      }),
    },
  });

const openEdit = (draft: Record<string, unknown>) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass: partsHass() })(el);
  (el as { openEdit: (d: Record<string, unknown>) => void }).openEdit(draft);
};

/** A completed entry with notes, cost, duration and one consumed part —
 * the shape the task-detail history tab hands over. */
export const CompletedWithParts = () => (
  <>
    <FixedAnchor />
    <maintenance-history-edit-dialog
      ref={openEdit({
        entry_id: "demo_hvac",
        task_id: "t_filter",
        original_timestamp: "2026-08-06T09:12:00",
        type: "completed",
        timestamp: "2026-08-06T09:12:00",
        notes: "Rinsed and dried the filter",
        cost: 24.9,
        duration: 15,
        completed_by: "admin-1",
        used_parts: [{ part_id: "p_filter", name: "HEPA filter", quantity: 1 }],
      })}
    />
  </>
);

/** A skipped entry — no cost/duration/parts recorded, only a reason note. */
export const SkippedEntry = () => (
  <>
    <FixedAnchor />
    <maintenance-history-edit-dialog
      ref={openEdit({
        entry_id: "demo_pool",
        task_id: "t_ph",
        original_timestamp: "2026-06-07T10:05:00",
        type: "skipped",
        timestamp: "2026-06-07T10:05:00",
        notes: "On vacation",
        cost: null,
        duration: null,
        completed_by: null,
        used_parts: null,
      })}
    />
  </>
);
