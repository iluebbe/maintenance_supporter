/** SeasonalOverridesDialog — manual per-month seasonal factor overrides
 * (0.1–5.0) for one task. Opened via open(entryId, taskId, overrides). */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const openOverrides = (overrides: Record<number, number> | null) => (el: unknown) => {
  if (!el) return;
  dsProps({ hass: dsDemoHass() })(el);
  (el as {
    open: (e: string, t: string, o: Record<number, number> | null) => void;
  }).open("demo_pool", "t_backwash", overrides);
};

/** Pool-pump backwash: heavy summer bias, near-dormant winter months. */
export const SummerBias = () => (
  <maintenance-seasonal-overrides-dialog
    ref={openOverrides({ 1: 0.5, 2: 0.5, 3: 0.8, 6: 1.5, 7: 2.0, 8: 2.0, 9: 1.4, 12: 0.5 })}
  />
);

/** No overrides yet — every month shows the neutral 1.0 placeholder. */
export const Empty = () => (
  <maintenance-seasonal-overrides-dialog ref={openOverrides(null)} />
);
