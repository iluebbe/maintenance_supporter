/** MaintenanceSavedViewsDialog — save the panel's current filter combination
 * under a name + manage (delete) existing saved views.
 * Opened imperatively via open(currentFilters, views). */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

/** The capture harness's story root has transform:translateZ(0), which makes
 * it the containing block for position:fixed — the overlay would collapse to
 * the zero-height mount and clip the card. Neutralize so it anchors to the
 * real viewport. */
const FixedAnchor = () => (
  <style>{".ds-single{transform:none !important}"}</style>
);

const FILTERS = {
  status: "all",
  user_id: null,
  label: null,
  priority: "",
  archived: false,
  sort_mode: "due_date",
  group_by: "object",
};

const openViews = (views: Array<Record<string, unknown>>, typedName?: string) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass: dsDemoHass() })(el);
  const dlg = el as {
    open: (f: Record<string, unknown>, v: Array<Record<string, unknown>>) => Promise<void>;
  };
  void dlg.open(FILTERS, views);
  // Pre-typed name so the primary "Save current filters" action shows enabled.
  if (typedName) (el as Record<string, unknown>)._name = typedName;
};

/** Three saved views + a name typed into the save field. */
export const WithViews = () => (
  <>
    <FixedAnchor />
    <maintenance-saved-views-dialog
      ref={openViews(
        [
          { id: "v_mine", name: "My tasks", filters: { ...FILTERS, user_id: "admin-1" } },
          { id: "v_overdue", name: "Overdue only", filters: { ...FILTERS, status: "overdue" } },
          { id: "v_high", name: "High priority — grouped by area", filters: { ...FILTERS, priority: "high", group_by: "area" } },
        ],
        "Weekend garden round",
      )}
    />
  </>
);

/** First-run state: no views saved yet. */
export const Empty = () => (
  <>
    <FixedAnchor />
    <maintenance-saved-views-dialog ref={openViews([])} />
  </>
);
