/** MaintenanceBudgetSectionCard — inline monthly + yearly budget editor
 * with spending progress bars (amber at the alert threshold, red over). */
import * as React from "react";
import { dsDemoHass, dsProps } from "maintenance-supporter-frontend";

const budgetHass = (status: Record<string, unknown>) =>
  dsDemoHass({
    handlers: { "maintenance_supporter/budget_status": () => status },
  });

export const UnderBudget = () => (
  <maintenance-budget-section-card
    ref={dsProps({ hass: dsDemoHass() })}
    style={{ display: "block", width: 440 }}
  />
);

export const NearLimit = () => (
  <maintenance-budget-section-card
    ref={dsProps({
      hass: budgetHass({
        monthly_budget: 150,
        monthly_spent: 138.2,
        yearly_budget: 1500,
        yearly_spent: 1544.6,
        alert_threshold_pct: 80,
        currency_symbol: "€",
      }),
    })}
    style={{ display: "block", width: 440 }}
  />
);

/** #104 — spending tracked without a maximum: plain totals, no bars. */
export const TrackingOnly = () => (
  <maintenance-budget-section-card
    ref={dsProps({
      hass: budgetHass({
        monthly_budget: 0,
        monthly_spent: 42,
        yearly_budget: 0,
        yearly_spent: 517.4,
        alert_threshold_pct: 80,
        currency_symbol: "€",
      }),
    })}
    style={{ display: "block", width: 440 }}
  />
);
