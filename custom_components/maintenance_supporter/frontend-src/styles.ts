/** Shared CSS styles and i18n for the Maintenance Supporter frontend. */

import { css } from "lit";

export const STATUS_COLORS: Record<string, string> = {
  ok: "var(--success-color, #4caf50)",
  due_soon: "var(--warning-color, #ff9800)",
  overdue: "var(--error-color, #f44336)",
  triggered: "#ff5722",
};

export const STATUS_ICONS: Record<string, string> = {
  ok: "mdi:check-circle",
  due_soon: "mdi:alert-circle",
  overdue: "mdi:alert-octagon",
  triggered: "mdi:bell-alert",
  completed: "mdi:check-circle",
  skipped: "mdi:skip-next",
  reset: "mdi:refresh",
};

export const TYPE_ICONS: Record<string, string> = {
  cleaning: "mdi:broom",
  inspection: "mdi:magnify",
  replacement: "mdi:swap-horizontal",
  calibration: "mdi:tune",
  service: "mdi:wrench",
  custom: "mdi:cog",
};

/* ─── i18n ─── */

interface Translations {
  [key: string]: string;
}

const DE: Translations = {
  maintenance: "Wartung",
  objects: "Objekte",
  tasks: "Aufgaben",
  overdue: "Überfällig",
  due_soon: "Bald fällig",
  triggered: "Ausgelöst",
  ok: "OK",
  all: "Alle",
  new_object: "+ Neues Objekt",
  edit: "Bearbeiten",
  delete: "Löschen",
  add_task: "+ Aufgabe",
  complete: "Erledigt",
  skip: "Überspringen",
  reset: "Zurücksetzen",
  cancel: "Abbrechen",
  completing: "Wird erledigt…",
  type: "Typ",
  schedule: "Planung",
  interval: "Intervall",
  warning: "Vorwarnung",
  last_performed: "Zuletzt durchgeführt",
  next_due: "Nächste Fälligkeit",
  days_until_due: "Tage bis fällig",
  times_performed: "Durchführungen",
  total_cost: "Gesamtkosten",
  avg_duration: "Ø Dauer",
  trigger: "Trigger",
  entity: "Entität",
  attribute: "Attribut",
  trigger_type: "Trigger-Typ",
  active: "Aktiv",
  yes: "Ja",
  no: "Nein",
  current_value: "Aktueller Wert",
  threshold_above: "Obergrenze",
  threshold_below: "Untergrenze",
  threshold: "Schwellwert",
  counter: "Zähler",
  state_change: "Zustandsänderung",
  target_value: "Zielwert",
  baseline: "Nulllinie",
  target_changes: "Ziel-Änderungen",
  entity_min: "Minimum",
  entity_max: "Maximum",
  for_minutes: "Für (Minuten)",
  time_based: "Zeitbasiert",
  sensor_based: "Sensorbasiert",
  manual: "Manuell",
  cleaning: "Reinigung",
  inspection: "Inspektion",
  replacement: "Austausch",
  calibration: "Kalibrierung",
  service: "Service",
  custom: "Benutzerdefiniert",
  history: "Verlauf",
  notes: "Notizen",
  documentation: "Dokumentation",
  cost: "Kosten",
  duration: "Dauer",
  trigger_val: "Trigger-Wert",
  complete_title: "Erledigt: ",
  checklist: "Checkliste",
  notes_optional: "Notizen (optional)",
  cost_optional: "Kosten (optional)",
  duration_minutes: "Dauer in Minuten (optional)",
  days: "Tage",
  day: "Tag",
  today: "Heute",
  d_overdue: "T überfällig",
  no_tasks: "Keine Wartungsaufgaben vorhanden. Erstellen Sie ein Objekt um zu beginnen.",
  no_tasks_short: "Keine Aufgaben",
  no_history: "Noch keine Verlaufseinträge.",
  show_all: "Alle anzeigen",
  cost_duration_chart: "Kosten & Dauer",
  installed: "Installiert",
  confirm_delete_object: "Dieses Objekt und alle zugehörigen Aufgaben löschen?",
  confirm_delete_task: "Diese Aufgabe wirklich löschen?",
  value_history: "Wertverlauf",
  min: "Min",
  max: "Max",
  // Dialog labels
  save: "Speichern",
  saving: "Speichern…",
  edit_task: "Aufgabe bearbeiten",
  new_task: "Neue Wartungsaufgabe",
  task_name: "Aufgabenname",
  maintenance_type: "Wartungstyp",
  schedule_type: "Planungsart",
  interval_days: "Intervall (Tage)",
  warning_days: "Warntage",
  edit_object: "Objekt bearbeiten",
  name: "Name",
  manufacturer_optional: "Hersteller (optional)",
  model_optional: "Modell (optional)",
  // Trigger dialog labels
  trigger_configuration: "Trigger-Konfiguration",
  entity_id: "Entitäts-ID",
  attribute_optional: "Attribut (optional, leer = Zustand)",
  trigger_above: "Auslösen wenn über",
  trigger_below: "Auslösen wenn unter",
  for_at_least_minutes: "Für mindestens (Minuten)",
  safety_interval_days: "Sicherheitsintervall (Tage, optional)",
  delta_mode: "Delta-Modus",
  from_state_optional: "Von Zustand (optional)",
  to_state_optional: "Zu Zustand (optional)",
  documentation_url_optional: "Dokumentation URL (optional)",
  budget_monthly: "Monatsbudget",
  budget_yearly: "Jahresbudget",
  export_csv: "CSV Export",
  import_csv: "CSV Import",
  groups: "Gruppen",
  no_groups: "Keine Gruppen definiert.",
  group_tasks: "Aufgaben",
  loading_chart: "Daten werden geladen...",
  // Adaptive scheduling
  was_maintenance_needed: "War diese Wartung nötig?",
  feedback_needed: "Nötig",
  feedback_not_needed: "Nicht nötig",
  feedback_not_sure: "Unsicher",
  suggested_interval: "Empfohlenes Intervall",
  apply_suggestion: "Übernehmen",
  dismiss_suggestion: "Verwerfen",
  adaptive_scheduling: "Adaptive Planung",
  confidence_low: "Niedrig",
  confidence_medium: "Mittel",
  confidence_high: "Hoch",
  confidence: "Konfidenz",
  recommended: "empfohlen",
  // Seasonal scheduling
  seasonal_awareness: "Saisonale Anpassung",
  seasonal_factor: "Saisonfaktor",
  seasonal_chart_title: "Saisonale Faktoren",
  seasonal_learned: "Gelernt",
  seasonal_manual: "Manuell",
  seasonal_insufficient_data: "Nicht genug Daten",
  month_jan: "Jan", month_feb: "Feb", month_mar: "Mär", month_apr: "Apr",
  month_may: "Mai", month_jun: "Jun", month_jul: "Jul", month_aug: "Aug",
  month_sep: "Sep", month_oct: "Okt", month_nov: "Nov", month_dec: "Dez",
  hemisphere_north: "Nördlich",
  hemisphere_south: "Südlich",
  seasonal_factor_short: "Saison",
  // Sensor prediction (Phase 3)
  sensor_prediction: "Sensorvorhersage",
  degradation_trend: "Trend",
  trend_rising: "Steigend",
  trend_falling: "Fallend",
  trend_stable: "Stabil",
  trend_insufficient_data: "Unzureichende Daten",
  days_until_threshold: "Tage bis Schwellwert",
  threshold_exceeded: "Schwellwert überschritten",
  environmental_adjustment: "Umgebungsfaktor",
  sensor_prediction_urgency: "Sensor prognostiziert Schwellwert in ~{days} Tagen",
  day_short: "Tag",
  prediction_projection: "Projektion",
  // Weibull / Phase 4
  weibull_reliability_curve: "Zuverlässigkeitskurve",
  weibull_failure_probability: "Ausfallwahrscheinlichkeit",
  weibull_reliability: "Zuverlässigkeit",
  weibull_beta_param: "Form β",
  weibull_eta_param: "Skala η",
  weibull_r_squared: "Güte R²",
  beta_early_failures: "Frühausfälle",
  beta_random_failures: "Zufällige Ausfälle",
  beta_wear_out: "Verschleiß",
  beta_highly_predictable: "Hochvorhersagbar",
  confidence_interval: "Konfidenzintervall",
  confidence_conservative: "Konservativ",
  confidence_aggressive: "Optimistisch",
  current_interval_marker: "Aktuelles Intervall",
  recommended_marker: "Empfohlen",
  reliability_at_current: "Zuverlässigkeit bei aktuellem Intervall",
  characteristic_life: "Charakteristische Lebensdauer",
  // Accessibility (ARIA labels)
  chart_mini_sparkline: "Trend-Sparkline",
  chart_history: "Kosten- und Dauer-Verlauf",
  chart_seasonal: "Saisonfaktoren, 12 Monate",
  chart_weibull: "Weibull-Zuverlässigkeitskurve",
  chart_sparkline: "Sensor-Triggerwert-Verlauf",
  days_progress: "Tagesfortschritt",
  // QR Code
  qr_code: "QR-Code",
  qr_generating: "QR-Code wird generiert\u2026",
  qr_error: "QR-Code konnte nicht generiert werden.",
  qr_print: "Drucken",
  qr_download: "SVG herunterladen",
  qr_action: "Aktion beim Scannen",
  qr_action_view: "Wartungsinfo anzeigen",
  qr_action_complete: "Wartung als erledigt markieren",
};

const EN: Translations = {
  maintenance: "Maintenance",
  objects: "Objects",
  tasks: "Tasks",
  overdue: "Overdue",
  due_soon: "Due Soon",
  triggered: "Triggered",
  ok: "OK",
  all: "All",
  new_object: "+ New Object",
  edit: "Edit",
  delete: "Delete",
  add_task: "+ Add Task",
  complete: "Complete",
  skip: "Skip",
  reset: "Reset",
  cancel: "Cancel",
  completing: "Completing…",
  type: "Type",
  schedule: "Schedule",
  interval: "Interval",
  warning: "Warning",
  last_performed: "Last performed",
  next_due: "Next due",
  days_until_due: "Days until due",
  times_performed: "Times performed",
  total_cost: "Total cost",
  avg_duration: "Avg duration",
  trigger: "Trigger",
  entity: "Entity",
  attribute: "Attribute",
  trigger_type: "Trigger type",
  active: "Active",
  yes: "Yes",
  no: "No",
  current_value: "Current value",
  threshold_above: "Upper limit",
  threshold_below: "Lower limit",
  threshold: "Threshold",
  counter: "Counter",
  state_change: "State change",
  target_value: "Target value",
  baseline: "Baseline",
  target_changes: "Target changes",
  entity_min: "Minimum",
  entity_max: "Maximum",
  for_minutes: "For (minutes)",
  time_based: "Time-based",
  sensor_based: "Sensor-based",
  manual: "Manual",
  cleaning: "Cleaning",
  inspection: "Inspection",
  replacement: "Replacement",
  calibration: "Calibration",
  service: "Service",
  custom: "Custom",
  history: "History",
  notes: "Notes",
  documentation: "Documentation",
  cost: "Cost",
  duration: "Duration",
  trigger_val: "Trigger value",
  complete_title: "Complete: ",
  checklist: "Checklist",
  notes_optional: "Notes (optional)",
  cost_optional: "Cost (optional)",
  duration_minutes: "Duration in minutes (optional)",
  days: "days",
  day: "day",
  today: "Today",
  d_overdue: "d overdue",
  no_tasks: "No maintenance tasks yet. Create an object to get started.",
  no_tasks_short: "No tasks",
  no_history: "No history entries yet.",
  show_all: "Show all",
  cost_duration_chart: "Cost & Duration",
  installed: "Installed",
  confirm_delete_object: "Delete this object and all its tasks?",
  confirm_delete_task: "Delete this task?",
  value_history: "Value history",
  min: "Min",
  max: "Max",
  // Dialog labels
  save: "Save",
  saving: "Saving…",
  edit_task: "Edit Task",
  new_task: "New Maintenance Task",
  task_name: "Task name",
  maintenance_type: "Maintenance type",
  schedule_type: "Schedule type",
  interval_days: "Interval (days)",
  warning_days: "Warning days",
  edit_object: "Edit Object",
  name: "Name",
  manufacturer_optional: "Manufacturer (optional)",
  model_optional: "Model (optional)",
  // Trigger dialog labels
  trigger_configuration: "Trigger Configuration",
  entity_id: "Entity ID",
  attribute_optional: "Attribute (optional, blank = state)",
  trigger_above: "Trigger above",
  trigger_below: "Trigger below",
  for_at_least_minutes: "For at least (minutes)",
  safety_interval_days: "Safety interval (days, optional)",
  delta_mode: "Delta mode",
  from_state_optional: "From state (optional)",
  to_state_optional: "To state (optional)",
  documentation_url_optional: "Documentation URL (optional)",
  budget_monthly: "Monthly budget",
  budget_yearly: "Yearly budget",
  export_csv: "CSV Export",
  import_csv: "CSV Import",
  groups: "Groups",
  no_groups: "No groups defined.",
  group_tasks: "Tasks",
  loading_chart: "Loading chart data...",
  // Adaptive scheduling
  was_maintenance_needed: "Was this maintenance needed?",
  feedback_needed: "Needed",
  feedback_not_needed: "Not needed",
  feedback_not_sure: "Not sure",
  suggested_interval: "Suggested interval",
  apply_suggestion: "Apply",
  dismiss_suggestion: "Dismiss",
  adaptive_scheduling: "Adaptive Scheduling",
  confidence_low: "Low",
  confidence_medium: "Medium",
  confidence_high: "High",
  confidence: "Confidence",
  recommended: "recommended",
  // Seasonal scheduling
  seasonal_awareness: "Seasonal Awareness",
  seasonal_factor: "Seasonal factor",
  seasonal_chart_title: "Seasonal Factors",
  seasonal_learned: "Learned",
  seasonal_manual: "Manual",
  seasonal_insufficient_data: "Insufficient data",
  month_jan: "Jan", month_feb: "Feb", month_mar: "Mar", month_apr: "Apr",
  month_may: "May", month_jun: "Jun", month_jul: "Jul", month_aug: "Aug",
  month_sep: "Sep", month_oct: "Oct", month_nov: "Nov", month_dec: "Dec",
  hemisphere_north: "Northern",
  hemisphere_south: "Southern",
  seasonal_factor_short: "Season",
  // Sensor prediction (Phase 3)
  sensor_prediction: "Sensor Prediction",
  degradation_trend: "Trend",
  trend_rising: "Rising",
  trend_falling: "Falling",
  trend_stable: "Stable",
  trend_insufficient_data: "Insufficient data",
  days_until_threshold: "Days until threshold",
  threshold_exceeded: "Threshold exceeded",
  environmental_adjustment: "Environmental factor",
  sensor_prediction_urgency: "Sensor predicts threshold in ~{days} days",
  day_short: "day",
  prediction_projection: "Projection",
  // Weibull / Phase 4
  weibull_reliability_curve: "Reliability Curve",
  weibull_failure_probability: "Failure Probability",
  weibull_reliability: "Reliability",
  weibull_beta_param: "Shape β",
  weibull_eta_param: "Scale η",
  weibull_r_squared: "Fit R²",
  beta_early_failures: "Early Failures",
  beta_random_failures: "Random Failures",
  beta_wear_out: "Wear-out",
  beta_highly_predictable: "Highly Predictable",
  confidence_interval: "Confidence Interval",
  confidence_conservative: "Conservative",
  confidence_aggressive: "Optimistic",
  current_interval_marker: "Current interval",
  recommended_marker: "Recommended",
  reliability_at_current: "Reliability at current interval",
  characteristic_life: "Characteristic life",
  // Accessibility (ARIA labels)
  chart_mini_sparkline: "Trend sparkline",
  chart_history: "Cost and duration history",
  chart_seasonal: "Seasonal factors, 12 months",
  chart_weibull: "Weibull reliability curve",
  chart_sparkline: "Sensor trigger value chart",
  days_progress: "Days progress",
  // QR Code
  qr_code: "QR Code",
  qr_generating: "Generating QR code\u2026",
  qr_error: "Failed to generate QR code.",
  qr_print: "Print",
  qr_download: "Download SVG",
  qr_action: "Action on scan",
  qr_action_view: "View maintenance info",
  qr_action_complete: "Mark maintenance as complete",
};

const TRANSLATIONS: Record<string, Translations> = { de: DE, en: EN };

/** Get a localized string. Falls back to English, then to key. */
export function t(key: string, lang?: string): string {
  const l = (lang || "en").substring(0, 2).toLowerCase();
  return TRANSLATIONS[l]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

/** Format a date string (ISO) in the user's locale. */
export function formatDate(iso: string | null | undefined, lang?: string): string {
  if (!iso) return "—";
  try {
    const locale = (lang || "de").startsWith("de") ? "de-DE" : "en-US";
    return new Date(iso).toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
}

/** Format a datetime string (ISO) in the user's locale. */
export function formatDateTime(iso: string | null | undefined, lang?: string): string {
  if (!iso) return "—";
  try {
    const locale = (lang || "de").startsWith("de") ? "de-DE" : "en-US";
    const d = new Date(iso);
    return (
      d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" }) +
      " " +
      d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    );
  } catch {
    return iso;
  }
}

/** Format "days until due" in localized manner. */
export function formatDueDays(days: number | null | undefined, lang?: string): string {
  if (days === null || days === undefined) return "—";
  const l = lang || "en";
  if (days < 0) return `${Math.abs(days)} ${t("d_overdue", l)}`;
  if (days === 0) return t("today", l);
  return `${days} ${days === 1 ? t("day", l) : t("days", l)}`;
}

export const sharedStyles = css`
  :host {
    --maint-ok-color: var(--success-color, #4caf50);
    --maint-due-soon-color: var(--warning-color, #ff9800);
    --maint-overdue-color: var(--error-color, #f44336);
    --maint-triggered-color: #ff5722;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: white;
    white-space: nowrap;
  }

  .status-badge.ok { background-color: var(--maint-ok-color); }
  .status-badge.due_soon { background-color: var(--maint-due-soon-color); }
  .status-badge.overdue { background-color: var(--maint-overdue-color); }
  .status-badge.triggered { background-color: var(--maint-triggered-color); }

  .stats-bar {
    display: flex;
    gap: 16px;
    padding: 16px;
    flex-wrap: wrap;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-text-color);
  }

  .stat-label {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
  }

  .card-header h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .action-buttons ha-button {
    --ha-button-font-size: 13px;
  }

  .history-timeline { padding: 0 16px 16px; }

  .history-entry {
    display: flex;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid var(--divider-color);
  }
  .history-entry:last-child { border-bottom: none; }

  .history-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
  }

  .history-icon.completed { background: var(--maint-ok-color); }
  .history-icon.skipped { background: var(--secondary-text-color); }
  .history-icon.reset { background: var(--info-color, #2196f3); }
  .history-icon.triggered { background: var(--maint-triggered-color); }

  .history-content { flex: 1; min-width: 0; }

  .history-date {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .history-details {
    display: flex;
    gap: 12px;
    font-size: 13px;
    color: var(--secondary-text-color);
    margin-top: 4px;
  }

  /* History filter chips */
  .history-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    cursor: pointer;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color);
    border: 1px solid var(--divider-color);
    transition: all 0.2s;
    user-select: none;
  }

  .filter-chip:hover { background: var(--divider-color); }

  .filter-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }

  .filter-chip.clear {
    font-style: italic;
    opacity: 0.7;
  }

  /* Cost/Duration history chart */
  .history-chart {
    width: 100%;
    height: 120px;
    display: block;
  }

  .chart-legend {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 4px;
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .legend-swatch {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    color: var(--secondary-text-color);
  }

  .empty-state ha-svg-icon {
    --mdc-icon-size: 48px;
    margin-bottom: 16px;
  }

  /* Sparkline chart */
  .sparkline-container { position: relative; margin: 8px 0; }

  .sparkline-svg {
    width: 100%;
    height: 140px;
    display: block;
  }

  /* Trigger info card */
  .trigger-card {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    padding: 12px 16px;
    margin: 8px 0;
    border: 1px solid var(--divider-color);
  }

  .trigger-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .trigger-entity-name { font-weight: 500; font-size: 14px; }
  .trigger-entity-id { font-size: 11px; color: var(--secondary-text-color); font-family: monospace; }

  .trigger-value-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 4px 0;
  }

  .trigger-current { font-size: 28px; font-weight: 700; color: var(--primary-text-color); }
  .trigger-current.active { color: var(--maint-triggered-color); }
  .trigger-unit { font-size: 14px; color: var(--secondary-text-color); }

  .trigger-limits {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: var(--secondary-text-color);
    margin: 6px 0;
    flex-wrap: wrap;
  }

  .trigger-limit-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .trigger-limit-item .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .trigger-limit-item .dot.warn { background: var(--error-color, #f44336); }
  .trigger-limit-item .dot.range { background: var(--secondary-text-color); }
  .trigger-limit-item .dot.ok { background: var(--maint-ok-color); }

  /* Row action buttons */
  .row-actions {
    display: flex;
    gap: 0;
    flex-shrink: 0;
    margin-left: auto;
  }

  .row-actions mwc-icon-button {
    --mdc-icon-button-size: 32px;
    --mdc-icon-size: 18px;
  }

  .row-actions .btn-complete { color: var(--maint-ok-color); }
  .row-actions .btn-skip { color: var(--secondary-text-color); }

  /* Days bar for overview */
  .due-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 90px;
    gap: 2px;
  }

  .due-text { font-size: 13px; }

  .days-bar {
    width: 100%;
    height: 3px;
    background: var(--divider-color);
    border-radius: 2px;
    overflow: hidden;
  }

  .days-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s;
  }

  /* Trigger progress bar (overview rows) */
  .trigger-progress {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 90px;
  }

  .trigger-progress-bar {
    width: 100%;
    height: 6px;
    background: var(--divider-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .trigger-progress-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s;
  }

  .trigger-progress-label {
    font-size: 12px;
    color: var(--secondary-text-color);
    text-align: right;
  }

  /* Days progress bar (detail view) */
  .days-progress {
    margin: 8px 0 16px;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color);
  }

  .days-progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 6px;
  }

  .days-progress-bar {
    width: 100%;
    height: 6px;
    background: var(--divider-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .days-progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }

  .days-progress-text {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    margin-top: 6px;
    color: var(--primary-text-color);
  }

  /* Sparkline tooltip */
  .sparkline-tooltip {
    position: absolute;
    transform: translate(-50%, -100%);
    background: var(--primary-text-color);
    color: var(--card-background-color, #fff);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 10;
    line-height: 1.4;
  }
  .sparkline-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--primary-text-color);
  }

  /* Mini-sparkline in overview rows */
  .mini-sparkline {
    width: 60px;
    height: 20px;
    display: block;
    margin-top: 2px;
    opacity: 0.7;
  }

  /* Overflow indicator for overdue progress bars */
  .days-bar-fill.overflow,
  .days-progress-fill.overflow,
  .trigger-progress-fill.overflow {
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 3px,
      rgba(255,255,255,0.2) 3px,
      rgba(255,255,255,0.2) 6px
    );
    animation: overflow-pulse 2s ease-in-out infinite;
  }

  @keyframes overflow-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  /* Budget bars */
  .budget-bars {
    display: flex;
    gap: 16px;
    padding: 8px 16px;
    flex-wrap: wrap;
  }

  .budget-item {
    flex: 1;
    min-width: 200px;
  }

  .budget-label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 4px;
  }

  .budget-bar {
    width: 100%;
    height: 6px;
    background: var(--divider-color);
    border-radius: 3px;
    overflow: hidden;
  }

  .budget-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s;
  }

  /* Groups section */
  .groups-section {
    padding: 8px 16px 16px;
  }

  .groups-section h3 {
    font-size: 14px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin: 0 0 8px;
  }

  .groups-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .group-card {
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: 12px;
    padding: 12px 16px;
    min-width: 180px;
    flex: 1;
    max-width: 300px;
    cursor: default;
  }

  .group-card-name {
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .group-card-desc {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }

  .group-card-tasks {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .group-task-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--primary-text-color);
  }

  /* Adaptive scheduling suggestion badge */
  .suggestion-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    background: var(--info-color, #2196f3);
    color: white;
    margin-left: 8px;
  }

  .suggestion-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .suggestion-actions ha-button {
    --ha-button-font-size: 12px;
  }

  .confidence-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .confidence-dot.low { background: var(--secondary-text-color); }
  .confidence-dot.medium { background: var(--warning-color, #ff9800); }
  .confidence-dot.high { background: var(--success-color, #4caf50); }

  /* Feedback toggle buttons in complete dialog */
  .feedback-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 0;
    border-top: 1px solid var(--divider-color);
  }

  .feedback-label {
    font-weight: 500;
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  .feedback-buttons {
    display: flex;
    gap: 8px;
  }

  .feedback-btn {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-size: 13px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
  }

  .feedback-btn:hover {
    background: var(--secondary-background-color, #f5f5f5);
  }

  .feedback-btn.selected {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }

  /* Seasonal chart */
  .seasonal-chart {
    padding: 12px 16px;
    margin: 8px 0;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color);
  }

  .seasonal-chart-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .seasonal-chart-title .source-tag {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 8px;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
    font-weight: 400;
  }

  .seasonal-chart svg {
    width: 100%;
    height: 100px;
    display: block;
  }

  .seasonal-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 2px;
    margin-top: 4px;
  }

  .seasonal-label {
    font-size: 10px;
    color: var(--secondary-text-color);
    text-align: center;
    flex: 1;
  }

  .seasonal-label.active-month {
    font-weight: 700;
    color: var(--primary-color);
  }

  .seasonal-factor-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
    margin-left: 6px;
  }

  .seasonal-factor-tag.short {
    background: rgba(76, 175, 80, 0.15);
    color: var(--success-color, #4caf50);
  }

  .seasonal-factor-tag.long {
    background: rgba(255, 152, 0, 0.15);
    color: var(--warning-color, #ff9800);
  }

  /* --- Sensor Prediction Section (Phase 3) --- */

  .prediction-section {
    margin: 16px 0;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
  }

  .prediction-urgency-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: rgba(255, 152, 0, 0.15);
    color: var(--warning-color, #ff9800);
    font-size: 13px;
    font-weight: 500;
  }
  .prediction-urgency-banner ha-svg-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
  }

  .prediction-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-text-color);
    margin-bottom: 10px;
  }
  .prediction-title ha-svg-icon {
    --mdc-icon-size: 16px;
    color: var(--primary-color);
  }

  .prediction-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .prediction-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .prediction-item ha-svg-icon {
    --mdc-icon-size: 14px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  .prediction-label {
    font-weight: 500;
  }

  .prediction-value {
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .prediction-value.rising { color: var(--error-color, #f44336); }
  .prediction-value.falling { color: var(--info-color, #2196f3); }
  .prediction-value.stable { color: var(--success-color, #4caf50); }
  .prediction-value.exceeded { color: var(--error-color, #f44336); font-weight: 700; }
  .prediction-value.urgent { color: var(--warning-color, #ff9800); font-weight: 700; }

  .prediction-rate {
    font-size: 11px;
    opacity: 0.7;
    font-family: monospace;
  }

  .prediction-date {
    font-size: 11px;
    opacity: 0.7;
  }

  .prediction-entity {
    font-size: 10px;
    opacity: 0.6;
    font-family: monospace;
  }

  /* --- Weibull Reliability Section (Phase 4) --- */

  .weibull-section {
    margin: 16px 0;
    padding: 12px 16px;
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
  }

  .weibull-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-text-color);
    margin-bottom: 10px;
  }
  .weibull-title ha-svg-icon {
    --mdc-icon-size: 16px;
    color: var(--primary-color);
  }

  .weibull-chart svg {
    width: 100%;
    height: 160px;
    display: block;
  }

  .weibull-info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 10px;
  }

  .weibull-info-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .weibull-info-value {
    font-weight: 600;
    color: var(--primary-text-color);
  }

  /* Beta interpretation badge */
  .beta-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }
  .beta-badge ha-svg-icon {
    --mdc-icon-size: 14px;
  }

  .beta-badge.early_failures {
    background: rgba(244, 67, 54, 0.15);
    color: var(--error-color, #f44336);
  }
  .beta-badge.random_failures {
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
  }
  .beta-badge.wear_out {
    background: rgba(255, 152, 0, 0.15);
    color: var(--warning-color, #ff9800);
  }
  .beta-badge.highly_predictable {
    background: rgba(76, 175, 80, 0.15);
    color: var(--success-color, #4caf50);
  }

  /* Confidence interval range bar */
  .confidence-range {
    margin-top: 12px;
  }

  .confidence-range-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--secondary-text-color);
    margin-bottom: 6px;
  }

  .confidence-bar {
    position: relative;
    width: 100%;
    height: 8px;
    background: var(--divider-color, #e0e0e0);
    border-radius: 4px;
    overflow: visible;
  }

  .confidence-fill {
    position: absolute;
    height: 100%;
    border-radius: 4px;
    background: var(--primary-color, #03a9f4);
    opacity: 0.25;
  }

  .confidence-marker {
    position: absolute;
    top: -4px;
    width: 3px;
    height: 16px;
    border-radius: 1px;
    transform: translateX(-50%);
  }
  .confidence-marker.recommended {
    background: var(--success-color, #4caf50);
  }
  .confidence-marker.current {
    background: var(--primary-color, #03a9f4);
  }

  .confidence-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
  }

  .confidence-text {
    font-size: 10px;
    color: var(--secondary-text-color);
  }
  .confidence-text.low {
    text-align: left;
  }
  .confidence-text.high {
    text-align: right;
  }
`;
