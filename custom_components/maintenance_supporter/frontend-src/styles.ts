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
  completed: "Abgeschlossen",
  skip: "Überspringen",
  skipped: "Übersprungen",
  reset: "Zurücksetzen",
  cancel: "Abbrechen",
  completing: "Wird erledigt…",
  interval: "Intervall",
  warning: "Vorwarnung",
  last_performed: "Zuletzt durchgeführt",
  next_due: "Nächste Fälligkeit",
  days_until_due: "Tage bis fällig",
  avg_duration: "Ø Dauer",
  trigger: "Trigger",
  trigger_type: "Trigger-Typ",
  threshold_above: "Obergrenze",
  threshold_below: "Untergrenze",
  threshold: "Schwellwert",
  counter: "Zähler",
  state_change: "Zustandsänderung",
  runtime: "Laufzeit",
  runtime_hours: "Ziel-Laufzeit (Stunden)",
  target_value: "Zielwert",
  baseline: "Nulllinie",
  target_changes: "Ziel-Änderungen",
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
  cost: "Kosten",
  duration: "Dauer",
  both: "Beides",
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
  last_performed_optional: "Zuletzt durchgeführt (optional)",
  interval_anchor: "Intervall-Anker",
  anchor_completion: "Ab Erledigung",
  anchor_planned: "Ab geplantem Datum (kein Drift)",
  edit_object: "Objekt bearbeiten",
  name: "Name",
  manufacturer_optional: "Hersteller (optional)",
  model_optional: "Modell (optional)",
  serial_number_optional: "Seriennummer (optional)",
  serial_number_label: "S/N",
  sort_due_date: "Fälligkeit",
  sort_object: "Objekt-Name",
  sort_type: "Typ",
  sort_task_name: "Aufgaben-Name",
  all_objects: "Alle Objekte",
  tasks_lower: "Aufgaben",
  no_tasks_yet: "Noch keine Aufgaben",
  add_first_task: "Erste Aufgabe hinzufügen",
  // Trigger dialog labels
  trigger_configuration: "Trigger-Konfiguration",
  entity_id: "Entitäts-ID",
  comma_separated: "kommagetrennt",
  entity_logic: "Entitäts-Logik",
  entity_logic_any: "Beliebige Entität löst aus",
  entity_logic_all: "Alle Entitäten müssen auslösen",
  entities: "Entitäten",
  attribute_optional: "Attribut (optional, leer = Zustand)",
  use_entity_state: "Entitäts-Zustand verwenden (kein Attribut)",
  trigger_above: "Auslösen wenn über",
  trigger_below: "Auslösen wenn unter",
  for_at_least_minutes: "Für mindestens (Minuten)",
  safety_interval_days: "Sicherheitsintervall (Tage, optional)",
  delta_mode: "Delta-Modus",
  from_state_optional: "Von Zustand (optional)",
  to_state_optional: "Zu Zustand (optional)",
  documentation_url_optional: "Dokumentation URL (optional)",
  nfc_tag_id_optional: "NFC-Tag-ID (optional)",
  nfc_tag_id: "NFC-Tag-ID",
  nfc_linked: "NFC-Tag verknüpft",
  nfc_link_hint: "Klicken um NFC-Tag zu verknüpfen",
  // User assignment
  responsible_user: "Verantwortlicher Benutzer",
  no_user_assigned: "(Kein Benutzer zugewiesen)",
  all_users: "Alle Benutzer",
  my_tasks: "Meine Aufgaben",
  budget_monthly: "Monatsbudget",
  budget_yearly: "Jahresbudget",
  groups: "Gruppen",
  loading_chart: "Daten werden geladen...",
  // Adaptive scheduling
  was_maintenance_needed: "War diese Wartung nötig?",
  feedback_needed: "Nötig",
  feedback_not_needed: "Nicht nötig",
  feedback_not_sure: "Unsicher",
  suggested_interval: "Empfohlenes Intervall",
  apply_suggestion: "Übernehmen",
  dismiss_suggestion: "Verwerfen",
  confidence_low: "Niedrig",
  confidence_medium: "Mittel",
  confidence_high: "Hoch",
  recommended: "empfohlen",
  // Seasonal scheduling
  seasonal_awareness: "Saisonale Anpassung",
  seasonal_chart_title: "Saisonale Faktoren",
  seasonal_learned: "Gelernt",
  seasonal_manual: "Manuell",
  month_jan: "Jan", month_feb: "Feb", month_mar: "Mär", month_apr: "Apr",
  month_may: "Mai", month_jun: "Jun", month_jul: "Jul", month_aug: "Aug",
  month_sep: "Sep", month_oct: "Okt", month_nov: "Nov", month_dec: "Dez",
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
  // Weibull / Phase 4
  weibull_reliability_curve: "Zuverlässigkeitskurve",
  weibull_failure_probability: "Ausfallwahrscheinlichkeit",
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
  qr_error_no_url: "Keine HA-URL konfiguriert. Bitte unter Einstellungen \u2192 System \u2192 Netzwerk eine externe oder interne URL setzen.",
  save_error: "Fehler beim Speichern. Bitte erneut versuchen.",
  qr_print: "Drucken",
  qr_download: "SVG herunterladen",
  qr_action: "Aktion beim Scannen",
  qr_action_view: "Wartungsinfo anzeigen",
  qr_action_complete: "Wartung als erledigt markieren",
  qr_url_mode: "Link-Typ",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Lokal (mDNS)",
  qr_mode_server: "Server-URL",
  // Dashboard redesign
  overview: "Übersicht",
  analysis: "Analyse",
  recent_activities: "Letzte Aktivitäten",
  search_notes: "Notizen durchsuchen",
  avg_cost: "Ø Kosten",
  no_advanced_features: "Keine erweiterten Funktionen aktiviert",
  no_advanced_features_hint: "Aktiviere \u201EAdaptive Intervalle\u201C oder \u201ESaisonale Muster\u201C in den Integrationseinstellungen, um hier Analysedaten zu sehen.",
  analysis_not_enough_data: "Noch nicht genügend Daten für die Analyse vorhanden.",
  analysis_not_enough_data_hint: "Die Weibull-Analyse benötigt mindestens 5 abgeschlossene Wartungen, saisonale Muster werden nach 6+ Datenpunkten pro Monat sichtbar.",
  analysis_manual_task_hint: "Manuelle Aufgaben ohne Intervall erzeugen keine Analysedaten.",
  completions: "Abschlüsse",
  current: "Aktuell",
  shorter: "Kürzer",
  longer: "Länger",
  normal: "Normal",
  disabled: "Deaktiviert",
  compound_logic: "Verknüpfungslogik",
  // Card editor
  card_title: "Titel",
  card_show_header: "Kopfzeile mit Statistiken anzeigen",
  card_show_actions: "Aktionsbuttons anzeigen",
  card_compact: "Kompaktmodus",
  card_max_items: "Max. Einträge (0 = alle)",
  // Consistency audit additions
  action_error: "Aktion fehlgeschlagen. Bitte erneut versuchen.",
  area_id_optional: "Bereich (optional)",
  installation_date_optional: "Installationsdatum (optional)",
  custom_icon_optional: "Icon (optional, z.B. mdi:wrench)",
  task_enabled: "Aufgabe aktiviert",
  skip_reason_prompt: "Aufgabe überspringen?",
  reason_optional: "Grund (optional)",
  reset_date_prompt: "Aufgabe zurücksetzen?",
  reset_date_optional: "Neues Datum (optional)",
  notes_label: "Notizen",
  documentation_label: "Dokumentation",
  no_nfc_tag: "— Kein Tag —",
  // Settings tab
  dashboard: "Dashboard",
  settings: "Einstellungen",
  settings_features: "Erweiterte Funktionen",
  settings_features_desc: "Erweiterte Funktionen ein- oder ausschalten. Deaktivieren blendet sie in der Oberfläche aus, löscht aber keine Daten.",
  feat_adaptive: "Adaptive Intervalle",
  feat_adaptive_desc: "Optimale Intervalle aus Wartungshistorie lernen",
  feat_predictions: "Sensorvorhersagen",
  feat_predictions_desc: "Trigger-Datum anhand von Sensordegradation vorhersagen",
  feat_seasonal: "Saisonale Anpassungen",
  feat_seasonal_desc: "Intervalle basierend auf saisonalen Mustern anpassen",
  feat_environmental: "Umgebungskorrelation",
  feat_environmental_desc: "Intervalle mit Temperatur/Luftfeuchtigkeit korrelieren",
  feat_budget: "Budgetverfolgung",
  feat_budget_desc: "Monatliche und jährliche Wartungsausgaben verfolgen",
  feat_groups: "Aufgabengruppen",
  feat_groups_desc: "Aufgaben in logische Gruppen organisieren",
  feat_checklists: "Checklisten",
  feat_checklists_desc: "Mehrstufige Verfahren zur Aufgabenerlediung",
  settings_general: "Allgemein",
  settings_default_warning: "Standard-Warntage",
  settings_panel_enabled: "Seitenleisten-Panel",
  settings_notifications: "Benachrichtigungen",
  settings_notify_service: "Benachrichtigungsdienst",
  settings_notify_due_soon: "Bei baldiger Fälligkeit benachrichtigen",
  settings_notify_overdue: "Bei Überfälligkeit benachrichtigen",
  settings_notify_triggered: "Bei Auslösung benachrichtigen",
  settings_interval_hours: "Wiederholungsintervall (Stunden, 0 = einmalig)",
  settings_quiet_hours: "Ruhezeiten",
  settings_quiet_start: "Beginn",
  settings_quiet_end: "Ende",
  settings_max_per_day: "Max. Benachrichtigungen pro Tag (0 = unbegrenzt)",
  settings_bundling: "Benachrichtigungen bündeln",
  settings_bundle_threshold: "Bündelungsschwelle",
  settings_actions: "Mobile Aktionsbuttons",
  settings_action_complete: "\"Erledigt\"-Button anzeigen",
  settings_action_skip: "\"Überspringen\"-Button anzeigen",
  settings_action_snooze: "\"Schlummern\"-Button anzeigen",
  settings_snooze_hours: "Schlummerdauer (Stunden)",
  settings_budget: "Budget",
  settings_currency: "Währung",
  settings_budget_monthly: "Monatsbudget",
  settings_budget_yearly: "Jahresbudget",
  settings_budget_alerts: "Budget-Warnungen",
  settings_budget_threshold: "Warnschwelle (%)",
  settings_import_export: "Import / Export",
  settings_export_json: "JSON exportieren",
  settings_export_csv: "CSV exportieren",
  settings_import_csv: "CSV importieren",
  settings_import_placeholder: "JSON- oder CSV-Inhalt hier einfügen…",
  settings_import_btn: "Importieren",
  settings_import_success: "{count} Objekte erfolgreich importiert.",
  settings_export_success: "Export heruntergeladen.",
  settings_saved: "Einstellung gespeichert.",
  settings_include_history: "Verlauf einbeziehen",
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
  completed: "Completed",
  skip: "Skip",
  skipped: "Skipped",
  reset: "Reset",
  cancel: "Cancel",
  completing: "Completing…",
  interval: "Interval",
  warning: "Warning",
  last_performed: "Last performed",
  next_due: "Next due",
  days_until_due: "Days until due",
  avg_duration: "Avg duration",
  trigger: "Trigger",
  trigger_type: "Trigger type",
  threshold_above: "Upper limit",
  threshold_below: "Lower limit",
  threshold: "Threshold",
  counter: "Counter",
  state_change: "State change",
  runtime: "Runtime",
  runtime_hours: "Target runtime (hours)",
  target_value: "Target value",
  baseline: "Baseline",
  target_changes: "Target changes",
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
  cost: "Cost",
  duration: "Duration",
  both: "Both",
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
  last_performed_optional: "Last performed (optional)",
  interval_anchor: "Interval anchor",
  anchor_completion: "From completion date",
  anchor_planned: "From planned date (no drift)",
  edit_object: "Edit Object",
  name: "Name",
  manufacturer_optional: "Manufacturer (optional)",
  model_optional: "Model (optional)",
  serial_number_optional: "Serial number (optional)",
  serial_number_label: "S/N",
  sort_due_date: "Due date",
  sort_object: "Object name",
  sort_type: "Type",
  sort_task_name: "Task name",
  all_objects: "All objects",
  tasks_lower: "tasks",
  no_tasks_yet: "No tasks yet",
  add_first_task: "Add first task",
  // Trigger dialog labels
  trigger_configuration: "Trigger Configuration",
  entity_id: "Entity ID",
  comma_separated: "comma-separated",
  entity_logic: "Entity logic",
  entity_logic_any: "Any entity triggers",
  entity_logic_all: "All entities must trigger",
  entities: "entities",
  attribute_optional: "Attribute (optional, blank = state)",
  use_entity_state: "Use entity state (no attribute)",
  trigger_above: "Trigger above",
  trigger_below: "Trigger below",
  for_at_least_minutes: "For at least (minutes)",
  safety_interval_days: "Safety interval (days, optional)",
  delta_mode: "Delta mode",
  from_state_optional: "From state (optional)",
  to_state_optional: "To state (optional)",
  documentation_url_optional: "Documentation URL (optional)",
  nfc_tag_id_optional: "NFC Tag ID (optional)",
  nfc_tag_id: "NFC Tag ID",
  nfc_linked: "NFC tag linked",
  nfc_link_hint: "Click to link NFC tag",
  // User assignment
  responsible_user: "Responsible User",
  no_user_assigned: "(No user assigned)",
  all_users: "All Users",
  my_tasks: "My Tasks",
  budget_monthly: "Monthly budget",
  budget_yearly: "Yearly budget",
  groups: "Groups",
  loading_chart: "Loading chart data...",
  // Adaptive scheduling
  was_maintenance_needed: "Was this maintenance needed?",
  feedback_needed: "Needed",
  feedback_not_needed: "Not needed",
  feedback_not_sure: "Not sure",
  suggested_interval: "Suggested interval",
  apply_suggestion: "Apply",
  dismiss_suggestion: "Dismiss",
  confidence_low: "Low",
  confidence_medium: "Medium",
  confidence_high: "High",
  recommended: "recommended",
  // Seasonal scheduling
  seasonal_awareness: "Seasonal Awareness",
  seasonal_chart_title: "Seasonal Factors",
  seasonal_learned: "Learned",
  seasonal_manual: "Manual",
  month_jan: "Jan", month_feb: "Feb", month_mar: "Mar", month_apr: "Apr",
  month_may: "May", month_jun: "Jun", month_jul: "Jul", month_aug: "Aug",
  month_sep: "Sep", month_oct: "Oct", month_nov: "Nov", month_dec: "Dec",
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
  // Weibull / Phase 4
  weibull_reliability_curve: "Reliability Curve",
  weibull_failure_probability: "Failure Probability",
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
  qr_error_no_url: "No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",
  save_error: "Failed to save. Please try again.",
  qr_print: "Print",
  qr_download: "Download SVG",
  qr_action: "Action on scan",
  qr_action_view: "View maintenance info",
  qr_action_complete: "Mark maintenance as complete",
  qr_url_mode: "Link type",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Local (mDNS)",
  qr_mode_server: "Server URL",
  // Dashboard redesign
  overview: "Overview",
  analysis: "Analysis",
  recent_activities: "Recent Activities",
  search_notes: "Search notes",
  avg_cost: "Avg Cost",
  no_advanced_features: "No advanced features enabled",
  no_advanced_features_hint: "Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",
  analysis_not_enough_data: "Not enough data for analysis yet.",
  analysis_not_enough_data_hint: "Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",
  analysis_manual_task_hint: "Manual tasks without an interval do not generate analysis data.",
  completions: "completions",
  current: "Current",
  shorter: "Shorter",
  longer: "Longer",
  normal: "Normal",
  disabled: "Disabled",
  compound_logic: "Compound logic",
  // Card editor
  card_title: "Title",
  card_show_header: "Show header with statistics",
  card_show_actions: "Show action buttons",
  card_compact: "Compact mode",
  card_max_items: "Max items (0 = all)",
  // Consistency audit additions
  action_error: "Action failed. Please try again.",
  area_id_optional: "Area (optional)",
  installation_date_optional: "Installation date (optional)",
  custom_icon_optional: "Icon (optional, e.g. mdi:wrench)",
  task_enabled: "Task enabled",
  skip_reason_prompt: "Skip this task?",
  reason_optional: "Reason (optional)",
  reset_date_prompt: "Reset this task?",
  reset_date_optional: "New date (optional)",
  notes_label: "Notes",
  documentation_label: "Documentation",
  no_nfc_tag: "— No tag —",
  // Settings tab
  dashboard: "Dashboard",
  settings: "Settings",
  settings_features: "Advanced Features",
  settings_features_desc: "Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",
  feat_adaptive: "Adaptive Scheduling",
  feat_adaptive_desc: "Learn optimal intervals from maintenance history",
  feat_predictions: "Sensor Predictions",
  feat_predictions_desc: "Predict trigger dates from sensor degradation",
  feat_seasonal: "Seasonal Adjustments",
  feat_seasonal_desc: "Adjust intervals based on seasonal patterns",
  feat_environmental: "Environmental Correlation",
  feat_environmental_desc: "Correlate intervals with temperature/humidity",
  feat_budget: "Budget Tracking",
  feat_budget_desc: "Track monthly and yearly maintenance spending",
  feat_groups: "Task Groups",
  feat_groups_desc: "Organize tasks into logical groups",
  feat_checklists: "Checklists",
  feat_checklists_desc: "Multi-step procedures for task completion",
  settings_general: "General",
  settings_default_warning: "Default warning days",
  settings_panel_enabled: "Sidebar panel",
  settings_notifications: "Notifications",
  settings_notify_service: "Notification service",
  settings_notify_due_soon: "Notify when due soon",
  settings_notify_overdue: "Notify when overdue",
  settings_notify_triggered: "Notify when triggered",
  settings_interval_hours: "Repeat interval (hours, 0 = once)",
  settings_quiet_hours: "Quiet hours",
  settings_quiet_start: "Start",
  settings_quiet_end: "End",
  settings_max_per_day: "Max notifications per day (0 = unlimited)",
  settings_bundling: "Bundle notifications",
  settings_bundle_threshold: "Bundle threshold",
  settings_actions: "Mobile Action Buttons",
  settings_action_complete: "Show 'Complete' button",
  settings_action_skip: "Show 'Skip' button",
  settings_action_snooze: "Show 'Snooze' button",
  settings_snooze_hours: "Snooze duration (hours)",
  settings_budget: "Budget",
  settings_currency: "Currency",
  settings_budget_monthly: "Monthly budget",
  settings_budget_yearly: "Yearly budget",
  settings_budget_alerts: "Budget alerts",
  settings_budget_threshold: "Alert threshold (%)",
  settings_import_export: "Import / Export",
  settings_export_json: "Export JSON",
  settings_export_csv: "Export CSV",
  settings_import_csv: "Import CSV",
  settings_import_placeholder: "Paste JSON or CSV content here\u2026",
  settings_import_btn: "Import",
  settings_import_success: "{count} objects imported successfully.",
  settings_export_success: "Export downloaded.",
  settings_saved: "Setting saved.",
  settings_include_history: "Include history",
};

const NL: Translations = {
  maintenance: "Onderhoud",
  objects: "Objecten",
  tasks: "Taken",
  overdue: "Achterstallig",
  due_soon: "Binnenkort",
  triggered: "Geactiveerd",
  ok: "OK",
  all: "Alle",
  new_object: "+ Nieuw object",
  edit: "Bewerken",
  delete: "Verwijderen",
  add_task: "+ Taak",
  complete: "Voltooid",
  completed: "Voltooid",
  skip: "Overslaan",
  skipped: "Overgeslagen",
  reset: "Resetten",
  cancel: "Annuleren",
  completing: "Wordt voltooid\u2026",
  interval: "Interval",
  warning: "Waarschuwing",
  last_performed: "Laatst uitgevoerd",
  next_due: "Volgende keer",
  days_until_due: "Dagen tot vervaldatum",
  avg_duration: "\u00D8 Duur",
  trigger: "Trigger",
  trigger_type: "Triggertype",
  threshold_above: "Bovengrens",
  threshold_below: "Ondergrens",
  threshold: "Drempelwaarde",
  counter: "Teller",
  state_change: "Statuswijziging",
  runtime: "Looptijd",
  runtime_hours: "Doellooptijd (uren)",
  target_value: "Doelwaarde",
  baseline: "Basislijn",
  target_changes: "Doelwijzigingen",
  for_minutes: "Voor (minuten)",
  time_based: "Tijdgebaseerd",
  sensor_based: "Sensorgebaseerd",
  manual: "Handmatig",
  cleaning: "Reiniging",
  inspection: "Inspectie",
  replacement: "Vervanging",
  calibration: "Kalibratie",
  service: "Service",
  custom: "Aangepast",
  history: "Geschiedenis",
  cost: "Kosten",
  duration: "Duur",
  both: "Beide",
  trigger_val: "Triggerwaarde",
  complete_title: "Voltooid: ",
  checklist: "Checklist",
  notes_optional: "Notities (optioneel)",
  cost_optional: "Kosten (optioneel)",
  duration_minutes: "Duur in minuten (optioneel)",
  days: "dagen",
  day: "dag",
  today: "Vandaag",
  d_overdue: "d achterstallig",
  no_tasks: "Geen onderhoudstaken. Maak een object aan om te beginnen.",
  no_tasks_short: "Geen taken",
  no_history: "Nog geen geschiedenisitems.",
  show_all: "Alles tonen",
  cost_duration_chart: "Kosten & Duur",
  installed: "Ge\u00EFnstalleerd",
  confirm_delete_object: "Dit object en alle bijbehorende taken verwijderen?",
  confirm_delete_task: "Deze taak verwijderen?",
  min: "Min",
  max: "Max",
  save: "Opslaan",
  saving: "Opslaan\u2026",
  edit_task: "Taak bewerken",
  new_task: "Nieuwe onderhoudstaak",
  task_name: "Taaknaam",
  maintenance_type: "Onderhoudstype",
  schedule_type: "Planningstype",
  interval_days: "Interval (dagen)",
  warning_days: "Waarschuwingsdagen",
  last_performed_optional: "Laatst uitgevoerd (optioneel)",
  interval_anchor: "Interval-anker",
  anchor_completion: "Vanaf voltooiing",
  anchor_planned: "Vanaf geplande datum (geen drift)",
  edit_object: "Object bewerken",
  name: "Naam",
  manufacturer_optional: "Fabrikant (optioneel)",
  model_optional: "Model (optioneel)",
  serial_number_optional: "Serienummer (optioneel)",
  serial_number_label: "S/N",
  sort_due_date: "Vervaldatum",
  sort_object: "Objectnaam",
  sort_type: "Type",
  sort_task_name: "Taaknaam",
  all_objects: "Alle objecten",
  tasks_lower: "taken",
  no_tasks_yet: "Nog geen taken",
  add_first_task: "Eerste taak toevoegen",
  trigger_configuration: "Triggerconfiguratie",
  entity_id: "Entiteits-ID",
  comma_separated: "kommagescheiden",
  entity_logic: "Entiteitslogica",
  entity_logic_any: "Elke entiteit triggert",
  entity_logic_all: "Alle entiteiten moeten triggeren",
  entities: "entiteiten",
  attribute_optional: "Attribuut (optioneel, leeg = status)",
  use_entity_state: "Entiteitsstatus gebruiken (geen attribuut)",
  trigger_above: "Activeren als boven",
  trigger_below: "Activeren als onder",
  for_at_least_minutes: "Voor minstens (minuten)",
  safety_interval_days: "Veiligheidsinterval (dagen, optioneel)",
  delta_mode: "Deltamodus",
  from_state_optional: "Van status (optioneel)",
  to_state_optional: "Naar status (optioneel)",
  documentation_url_optional: "Documentatie-URL (optioneel)",
  nfc_tag_id_optional: "NFC-tag-ID (optioneel)",
  nfc_tag_id: "NFC-tag-ID",
  nfc_linked: "NFC-tag gekoppeld",
  nfc_link_hint: "Klik om NFC-tag te koppelen",
  responsible_user: "Verantwoordelijke gebruiker",
  no_user_assigned: "(Geen gebruiker toegewezen)",
  all_users: "Alle gebruikers",
  my_tasks: "Mijn taken",
  budget_monthly: "Maandbudget",
  budget_yearly: "Jaarbudget",
  groups: "Groepen",
  loading_chart: "Grafiekgegevens laden...",
  was_maintenance_needed: "Was dit onderhoud nodig?",
  feedback_needed: "Nodig",
  feedback_not_needed: "Niet nodig",
  feedback_not_sure: "Niet zeker",
  suggested_interval: "Voorgesteld interval",
  apply_suggestion: "Toepassen",
  dismiss_suggestion: "Negeren",
  confidence_low: "Laag",
  confidence_medium: "Gemiddeld",
  confidence_high: "Hoog",
  recommended: "aanbevolen",
  seasonal_awareness: "Seizoensbewustzijn",
  seasonal_chart_title: "Seizoensfactoren",
  seasonal_learned: "Geleerd",
  seasonal_manual: "Handmatig",
  month_jan: "Jan", month_feb: "Feb", month_mar: "Mrt", month_apr: "Apr",
  month_may: "Mei", month_jun: "Jun", month_jul: "Jul", month_aug: "Aug",
  month_sep: "Sep", month_oct: "Okt", month_nov: "Nov", month_dec: "Dec",
  sensor_prediction: "Sensorvoorspelling",
  degradation_trend: "Trend",
  trend_rising: "Stijgend",
  trend_falling: "Dalend",
  trend_stable: "Stabiel",
  trend_insufficient_data: "Onvoldoende gegevens",
  days_until_threshold: "Dagen tot drempelwaarde",
  threshold_exceeded: "Drempelwaarde overschreden",
  environmental_adjustment: "Omgevingsfactor",
  sensor_prediction_urgency: "Sensor voorspelt drempelwaarde in ~{days} dagen",
  day_short: "dag",
  weibull_reliability_curve: "Betrouwbaarheidscurve",
  weibull_failure_probability: "Faalkans",
  weibull_r_squared: "Fit R\u00B2",
  beta_early_failures: "Vroege uitval",
  beta_random_failures: "Willekeurige uitval",
  beta_wear_out: "Slijtage",
  beta_highly_predictable: "Zeer voorspelbaar",
  confidence_interval: "Betrouwbaarheidsinterval",
  confidence_conservative: "Conservatief",
  confidence_aggressive: "Optimistisch",
  current_interval_marker: "Huidig interval",
  recommended_marker: "Aanbevolen",
  characteristic_life: "Karakteristieke levensduur",
  chart_mini_sparkline: "Trend-sparkline",
  chart_history: "Kosten- en duurgeschiedenis",
  chart_seasonal: "Seizoensfactoren, 12 maanden",
  chart_weibull: "Weibull-betrouwbaarheidscurve",
  chart_sparkline: "Sensor-triggerwaardegrafiek",
  days_progress: "Dagenvoortgang",
  qr_code: "QR-code",
  qr_generating: "QR-code genereren\u2026",
  qr_error: "QR-code kon niet worden gegenereerd.",
  qr_error_no_url: "Geen HA-URL geconfigureerd. Stel een externe of interne URL in via Instellingen \u2192 Systeem \u2192 Netwerk.",
  save_error: "Opslaan mislukt. Probeer het opnieuw.",
  qr_print: "Afdrukken",
  qr_download: "SVG downloaden",
  qr_action: "Actie bij scannen",
  qr_action_view: "Onderhoudsinfo bekijken",
  qr_action_complete: "Onderhoud als voltooid markeren",
  qr_url_mode: "Linktype",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Lokaal (mDNS)",
  qr_mode_server: "Server-URL",
  overview: "Overzicht",
  analysis: "Analyse",
  recent_activities: "Recente activiteiten",
  search_notes: "Notities doorzoeken",
  avg_cost: "\u00D8 Kosten",
  no_advanced_features: "Geen geavanceerde functies ingeschakeld",
  no_advanced_features_hint: "Schakel \u201EAdaptieve Intervallen\u201D of \u201ESeizoenpatronen\u201D in via de integratie-instellingen om hier analysegegevens te zien.",
  analysis_not_enough_data: "Nog niet genoeg gegevens voor analyse.",
  analysis_not_enough_data_hint: "Weibull-analyse vereist minstens 5 voltooide onderhoudsbeurten; seizoenspatronen worden zichtbaar na 6+ datapunten per maand.",
  analysis_manual_task_hint: "Handmatige taken zonder interval genereren geen analysegegevens.",
  completions: "voltooiingen",
  current: "Huidig",
  shorter: "Korter",
  longer: "Langer",
  normal: "Normaal",
  disabled: "Uitgeschakeld",
  compound_logic: "Samengestelde logica",
  // Card editor
  card_title: "Titel",
  card_show_header: "Koptekst met statistieken tonen",
  card_show_actions: "Actieknoppen tonen",
  card_compact: "Compacte modus",
  card_max_items: "Max items (0 = alle)",
  action_error: "Actie mislukt. Probeer het opnieuw.",
  area_id_optional: "Gebied (optioneel)",
  installation_date_optional: "Installatiedatum (optioneel)",
  custom_icon_optional: "Icoon (optioneel, bijv. mdi:wrench)",
  task_enabled: "Taak ingeschakeld",
  skip_reason_prompt: "Deze taak overslaan?",
  reason_optional: "Reden (optioneel)",
  reset_date_prompt: "Deze taak resetten?",
  reset_date_optional: "Nieuwe datum (optioneel)",
  notes_label: "Notities",
  documentation_label: "Documentatie",
  no_nfc_tag: "— Geen tag —",
  // Settings tab
  dashboard: "Dashboard",
  settings: "Instellingen",
  settings_features: "Geavanceerde functies",
  settings_features_desc: "Schakel geavanceerde functies in of uit. Uitschakelen verbergt ze in de interface maar verwijdert geen gegevens.",
  feat_adaptive: "Adaptieve planning",
  feat_adaptive_desc: "Leer optimale intervallen uit onderhoudsgeschiedenis",
  feat_predictions: "Sensorvoorspellingen",
  feat_predictions_desc: "Voorspel triggerdatums op basis van sensordegradatie",
  feat_seasonal: "Seizoensaanpassingen",
  feat_seasonal_desc: "Pas intervallen aan op seizoenspatronen",
  feat_environmental: "Omgevingscorrelatie",
  feat_environmental_desc: "Correleer intervallen met temperatuur/vochtigheid",
  feat_budget: "Budgetbeheer",
  feat_budget_desc: "Volg maandelijkse en jaarlijkse onderhoudsuitgaven",
  feat_groups: "Taakgroepen",
  feat_groups_desc: "Organiseer taken in logische groepen",
  feat_checklists: "Checklists",
  feat_checklists_desc: "Meerstaps procedures voor taakvoltooiing",
  settings_general: "Algemeen",
  settings_default_warning: "Standaard waarschuwingsdagen",
  settings_panel_enabled: "Zijbalkpaneel",
  settings_notifications: "Meldingen",
  settings_notify_service: "Meldingsservice",
  settings_notify_due_soon: "Melding bij bijna verlopen",
  settings_notify_overdue: "Melding bij achterstallig",
  settings_notify_triggered: "Melding bij geactiveerd",
  settings_interval_hours: "Herhalingsinterval (uren, 0 = eenmalig)",
  settings_quiet_hours: "Stille uren",
  settings_quiet_start: "Start",
  settings_quiet_end: "Einde",
  settings_max_per_day: "Max meldingen per dag (0 = onbeperkt)",
  settings_bundling: "Meldingen bundelen",
  settings_bundle_threshold: "Bundeldrempel",
  settings_actions: "Mobiele actieknoppen",
  settings_action_complete: "Knop 'Voltooid' tonen",
  settings_action_skip: "Knop 'Overslaan' tonen",
  settings_action_snooze: "Knop 'Snooze' tonen",
  settings_snooze_hours: "Snoozeduur (uren)",
  settings_budget: "Budget",
  settings_currency: "Valuta",
  settings_budget_monthly: "Maandbudget",
  settings_budget_yearly: "Jaarbudget",
  settings_budget_alerts: "Budgetwaarschuwingen",
  settings_budget_threshold: "Waarschuwingsdrempel (%)",
  settings_import_export: "Import / Export",
  settings_export_json: "JSON exporteren",
  settings_export_csv: "CSV exporteren",
  settings_import_csv: "CSV importeren",
  settings_import_placeholder: "Plak JSON- of CSV-inhoud hier\u2026",
  settings_import_btn: "Importeren",
  settings_import_success: "{count} objecten succesvol ge\u00EFmporteerd.",
  settings_export_success: "Export gedownload.",
  settings_saved: "Instelling opgeslagen.",
  settings_include_history: "Geschiedenis meenemen",
};

const FR: Translations = {
  maintenance: "Maintenance",
  objects: "Objets",
  tasks: "T\u00E2ches",
  overdue: "En retard",
  due_soon: "Bient\u00F4t d\u00FB",
  triggered: "D\u00E9clench\u00E9",
  ok: "OK",
  all: "Tous",
  new_object: "+ Nouvel objet",
  edit: "Modifier",
  delete: "Supprimer",
  add_task: "+ T\u00E2che",
  complete: "Termin\u00E9",
  completed: "Termin\u00E9",
  skip: "Passer",
  skipped: "Ignor\u00E9",
  reset: "R\u00E9initialiser",
  cancel: "Annuler",
  completing: "En cours\u2026",
  interval: "Intervalle",
  warning: "Avertissement",
  last_performed: "Derni\u00E8re ex\u00E9cution",
  next_due: "Prochaine \u00E9ch\u00E9ance",
  days_until_due: "Jours restants",
  avg_duration: "\u00D8 Dur\u00E9e",
  trigger: "D\u00E9clencheur",
  trigger_type: "Type de d\u00E9clencheur",
  threshold_above: "Limite sup\u00E9rieure",
  threshold_below: "Limite inf\u00E9rieure",
  threshold: "Seuil",
  counter: "Compteur",
  state_change: "Changement d\u0027\u00E9tat",
  runtime: "Dur\u00E9e de fonctionnement",
  runtime_hours: "Dur\u00E9e cible (heures)",
  target_value: "Valeur cible",
  baseline: "Ligne de base",
  target_changes: "Changements cibles",
  for_minutes: "Pendant (minutes)",
  time_based: "Temporel",
  sensor_based: "Capteur",
  manual: "Manuel",
  cleaning: "Nettoyage",
  inspection: "Inspection",
  replacement: "Remplacement",
  calibration: "\u00C9talonnage",
  service: "Service",
  custom: "Personnalis\u00E9",
  history: "Historique",
  cost: "Co\u00FBt",
  duration: "Dur\u00E9e",
  both: "Les deux",
  trigger_val: "Valeur du d\u00E9clencheur",
  complete_title: "Termin\u00E9 : ",
  checklist: "Checklist",
  notes_optional: "Notes (optionnel)",
  cost_optional: "Co\u00FBt (optionnel)",
  duration_minutes: "Dur\u00E9e en minutes (optionnel)",
  days: "jours",
  day: "jour",
  today: "Aujourd\u0027hui",
  d_overdue: "j en retard",
  no_tasks: "Aucune t\u00E2che de maintenance. Cr\u00E9ez un objet pour commencer.",
  no_tasks_short: "Aucune t\u00E2che",
  no_history: "Aucun historique.",
  show_all: "Tout afficher",
  cost_duration_chart: "Co\u00FBts & Dur\u00E9e",
  installed: "Install\u00E9",
  confirm_delete_object: "Supprimer cet objet et toutes ses t\u00E2ches ?",
  confirm_delete_task: "Supprimer cette t\u00E2che ?",
  min: "Min",
  max: "Max",
  save: "Enregistrer",
  saving: "Enregistrement\u2026",
  edit_task: "Modifier la t\u00E2che",
  new_task: "Nouvelle t\u00E2che de maintenance",
  task_name: "Nom de la t\u00E2che",
  maintenance_type: "Type de maintenance",
  schedule_type: "Type de planification",
  interval_days: "Intervalle (jours)",
  warning_days: "Jours d\u0027avertissement",
  last_performed_optional: "Dernière exécution (optionnel)",
  interval_anchor: "Ancrage de l\u0027intervalle",
  anchor_completion: "Depuis la date de r\u00E9alisation",
  anchor_planned: "Depuis la date pr\u00E9vue (sans d\u00E9rive)",
  edit_object: "Modifier l\u0027objet",
  name: "Nom",
  manufacturer_optional: "Fabricant (optionnel)",
  model_optional: "Mod\u00E8le (optionnel)",
  serial_number_optional: "Num\u00E9ro de s\u00E9rie (optionnel)",
  serial_number_label: "N/S",
  sort_due_date: "Échéance",
  sort_object: "Nom de l'objet",
  sort_type: "Type",
  sort_task_name: "Nom de la tâche",
  all_objects: "Tous les objets",
  tasks_lower: "tâches",
  no_tasks_yet: "Pas encore de tâches",
  add_first_task: "Ajouter la première tâche",
  trigger_configuration: "Configuration du d\u00E9clencheur",
  entity_id: "ID d\u0027entit\u00E9",
  comma_separated: "s\u00E9par\u00E9 par des virgules",
  entity_logic: "Logique d\u0027entit\u00E9",
  entity_logic_any: "N\u0027importe quelle entit\u00E9 d\u00E9clenche",
  entity_logic_all: "Toutes les entit\u00E9s doivent d\u00E9clencher",
  entities: "entit\u00E9s",
  attribute_optional: "Attribut (optionnel, vide = \u00E9tat)",
  use_entity_state: "Utiliser l\u0027\u00E9tat de l\u0027entit\u00E9 (pas d\u0027attribut)",
  trigger_above: "D\u00E9clencher au-dessus de",
  trigger_below: "D\u00E9clencher en dessous de",
  for_at_least_minutes: "Pendant au moins (minutes)",
  safety_interval_days: "Intervalle de s\u00E9curit\u00E9 (jours, optionnel)",
  delta_mode: "Mode delta",
  from_state_optional: "\u00C9tat source (optionnel)",
  to_state_optional: "\u00C9tat cible (optionnel)",
  documentation_url_optional: "URL de documentation (optionnel)",
  nfc_tag_id_optional: "ID tag NFC (optionnel)",
  nfc_tag_id: "ID tag NFC",
  nfc_linked: "Tag NFC lié",
  nfc_link_hint: "Cliquer pour associer un tag NFC",
  responsible_user: "Utilisateur responsable",
  no_user_assigned: "(Aucun utilisateur assign\u00E9)",
  all_users: "Tous les utilisateurs",
  my_tasks: "Mes t\u00E2ches",
  budget_monthly: "Budget mensuel",
  budget_yearly: "Budget annuel",
  groups: "Groupes",
  loading_chart: "Chargement des donn\u00E9es...",
  was_maintenance_needed: "Cette maintenance \u00E9tait-elle n\u00E9cessaire ?",
  feedback_needed: "N\u00E9cessaire",
  feedback_not_needed: "Pas n\u00E9cessaire",
  feedback_not_sure: "Pas s\u00FBr",
  suggested_interval: "Intervalle sugg\u00E9r\u00E9",
  apply_suggestion: "Appliquer",
  dismiss_suggestion: "Ignorer",
  confidence_low: "Faible",
  confidence_medium: "Moyen",
  confidence_high: "\u00C9lev\u00E9",
  recommended: "recommand\u00E9",
  seasonal_awareness: "Conscience saisonni\u00E8re",
  seasonal_chart_title: "Facteurs saisonniers",
  seasonal_learned: "Appris",
  seasonal_manual: "Manuel",
  month_jan: "Jan", month_feb: "F\u00E9v", month_mar: "Mar", month_apr: "Avr",
  month_may: "Mai", month_jun: "Juin", month_jul: "Juil", month_aug: "Ao\u00FBt",
  month_sep: "Sep", month_oct: "Oct", month_nov: "Nov", month_dec: "D\u00E9c",
  sensor_prediction: "Pr\u00E9diction capteur",
  degradation_trend: "Tendance",
  trend_rising: "En hausse",
  trend_falling: "En baisse",
  trend_stable: "Stable",
  trend_insufficient_data: "Donn\u00E9es insuffisantes",
  days_until_threshold: "Jours avant le seuil",
  threshold_exceeded: "Seuil d\u00E9pass\u00E9",
  environmental_adjustment: "Facteur environnemental",
  sensor_prediction_urgency: "Le capteur pr\u00E9voit le seuil dans ~{days} jours",
  day_short: "jour",
  weibull_reliability_curve: "Courbe de fiabilit\u00E9",
  weibull_failure_probability: "Probabilit\u00E9 de d\u00E9faillance",
  weibull_r_squared: "Ajustement R\u00B2",
  beta_early_failures: "D\u00E9faillances pr\u00E9coces",
  beta_random_failures: "D\u00E9faillances al\u00E9atoires",
  beta_wear_out: "Usure",
  beta_highly_predictable: "Tr\u00E8s pr\u00E9visible",
  confidence_interval: "Intervalle de confiance",
  confidence_conservative: "Conservateur",
  confidence_aggressive: "Optimiste",
  current_interval_marker: "Intervalle actuel",
  recommended_marker: "Recommand\u00E9",
  characteristic_life: "Dur\u00E9e de vie caract\u00E9ristique",
  chart_mini_sparkline: "Sparkline de tendance",
  chart_history: "Historique co\u00FBts et dur\u00E9e",
  chart_seasonal: "Facteurs saisonniers, 12 mois",
  chart_weibull: "Courbe de fiabilit\u00E9 Weibull",
  chart_sparkline: "Graphique valeur d\u00E9clencheur",
  days_progress: "Progression en jours",
  qr_code: "QR Code",
  qr_generating: "G\u00E9n\u00E9ration du QR code\u2026",
  qr_error: "Impossible de g\u00E9n\u00E9rer le QR code.",
  qr_error_no_url: "Aucune URL HA configur\u00E9e. Veuillez d\u00E9finir une URL externe ou interne dans Param\u00E8tres \u2192 Syst\u00E8me \u2192 R\u00E9seau.",
  save_error: "\u00C9chec de l'enregistrement. Veuillez r\u00E9essayer.",
  qr_print: "Imprimer",
  qr_download: "T\u00E9l\u00E9charger SVG",
  qr_action: "Action au scan",
  qr_action_view: "Afficher les infos de maintenance",
  qr_action_complete: "Marquer la maintenance comme termin\u00E9e",
  qr_url_mode: "Type de lien",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Local (mDNS)",
  qr_mode_server: "URL serveur",
  overview: "Aper\u00E7u",
  analysis: "Analyse",
  recent_activities: "Activit\u00E9s r\u00E9centes",
  search_notes: "Rechercher dans les notes",
  avg_cost: "\u00D8 Co\u00FBt",
  no_advanced_features: "Aucune fonction avanc\u00E9e activ\u00E9e",
  no_advanced_features_hint: "Activez \u00AB Intervalles adaptatifs \u00BB ou \u00AB Tendances saisonni\u00E8res \u00BB dans les param\u00E8tres de l\u0027int\u00E9gration pour voir les donn\u00E9es d\u0027analyse ici.",
  analysis_not_enough_data: "Pas encore assez de donn\u00E9es pour l\u0027analyse.",
  analysis_not_enough_data_hint: "L\u0027analyse Weibull n\u00E9cessite au moins 5 maintenances termin\u00E9es ; les tendances saisonni\u00E8res apparaissent apr\u00E8s 6+ points par mois.",
  analysis_manual_task_hint: "Les t\u00E2ches manuelles sans intervalle ne g\u00E9n\u00E8rent pas de donn\u00E9es d\u0027analyse.",
  completions: "r\u00E9alisations",
  current: "Actuel",
  shorter: "Plus court",
  longer: "Plus long",
  normal: "Normal",
  disabled: "D\u00E9sactiv\u00E9",
  compound_logic: "Logique compos\u00E9e",
  // Card editor
  card_title: "Titre",
  card_show_header: "Afficher l'en-t\u00EAte avec statistiques",
  card_show_actions: "Afficher les boutons d'action",
  card_compact: "Mode compact",
  card_max_items: "Nombre max (0 = tous)",
  action_error: "Action échouée. Veuillez réessayer.",
  area_id_optional: "Zone (optionnel)",
  installation_date_optional: "Date d'installation (optionnel)",
  custom_icon_optional: "Icône (optionnel, ex. mdi:wrench)",
  task_enabled: "Tâche activée",
  skip_reason_prompt: "Ignorer cette tâche ?",
  reason_optional: "Raison (optionnel)",
  reset_date_prompt: "Réinitialiser cette tâche ?",
  reset_date_optional: "Nouvelle date (optionnel)",
  notes_label: "Notes",
  documentation_label: "Documentation",
  no_nfc_tag: "— Aucun tag —",
  // Settings tab
  dashboard: "Tableau de bord",
  settings: "Param\u00E8tres",
  settings_features: "Fonctions avanc\u00E9es",
  settings_features_desc: "Activez ou d\u00E9sactivez les fonctions avanc\u00E9es. La d\u00E9sactivation les masque dans l'interface mais ne supprime pas les donn\u00E9es.",
  feat_adaptive: "Planification adaptative",
  feat_adaptive_desc: "Apprendre les intervalles optimaux \u00E0 partir de l'historique",
  feat_predictions: "Pr\u00E9dictions capteurs",
  feat_predictions_desc: "Pr\u00E9dire les dates de d\u00E9clenchement par d\u00E9gradation des capteurs",
  feat_seasonal: "Ajustements saisonniers",
  feat_seasonal_desc: "Ajuster les intervalles selon les tendances saisonni\u00E8res",
  feat_environmental: "Corr\u00E9lation environnementale",
  feat_environmental_desc: "Corr\u00E9ler les intervalles avec la temp\u00E9rature/humidit\u00E9",
  feat_budget: "Suivi budg\u00E9taire",
  feat_budget_desc: "Suivre les d\u00E9penses de maintenance mensuelles et annuelles",
  feat_groups: "Groupes de t\u00E2ches",
  feat_groups_desc: "Organiser les t\u00E2ches en groupes logiques",
  feat_checklists: "Checklists",
  feat_checklists_desc: "Proc\u00E9dures multi-\u00E9tapes pour la r\u00E9alisation des t\u00E2ches",
  settings_general: "G\u00E9n\u00E9ral",
  settings_default_warning: "Jours d'avertissement par d\u00E9faut",
  settings_panel_enabled: "Panneau lat\u00E9ral",
  settings_notifications: "Notifications",
  settings_notify_service: "Service de notification",
  settings_notify_due_soon: "Notifier quand bient\u00F4t d\u00FB",
  settings_notify_overdue: "Notifier quand en retard",
  settings_notify_triggered: "Notifier quand d\u00E9clench\u00E9",
  settings_interval_hours: "Intervalle de r\u00E9p\u00E9tition (heures, 0 = une fois)",
  settings_quiet_hours: "Heures de silence",
  settings_quiet_start: "D\u00E9but",
  settings_quiet_end: "Fin",
  settings_max_per_day: "Max notifications par jour (0 = illimit\u00E9)",
  settings_bundling: "Regrouper les notifications",
  settings_bundle_threshold: "Seuil de regroupement",
  settings_actions: "Boutons d'action mobiles",
  settings_action_complete: "Afficher le bouton 'Termin\u00E9'",
  settings_action_skip: "Afficher le bouton 'Passer'",
  settings_action_snooze: "Afficher le bouton 'Reporter'",
  settings_snooze_hours: "Dur\u00E9e de report (heures)",
  settings_budget: "Budget",
  settings_currency: "Devise",
  settings_budget_monthly: "Budget mensuel",
  settings_budget_yearly: "Budget annuel",
  settings_budget_alerts: "Alertes budg\u00E9taires",
  settings_budget_threshold: "Seuil d'alerte (%)",
  settings_import_export: "Import / Export",
  settings_export_json: "Exporter JSON",
  settings_export_csv: "Exporter CSV",
  settings_import_csv: "Importer CSV",
  settings_import_placeholder: "Collez le contenu JSON ou CSV ici\u2026",
  settings_import_btn: "Importer",
  settings_import_success: "{count} objets import\u00E9s avec succ\u00E8s.",
  settings_export_success: "Export t\u00E9l\u00E9charg\u00E9.",
  settings_saved: "Param\u00E8tre enregistr\u00E9.",
  settings_include_history: "Inclure l'historique",
};

const IT: Translations = {
  maintenance: "Manutenzione",
  objects: "Oggetti",
  tasks: "Attivit\u00E0",
  overdue: "Scaduto",
  due_soon: "In scadenza",
  triggered: "Attivato",
  ok: "OK",
  all: "Tutti",
  new_object: "+ Nuovo oggetto",
  edit: "Modifica",
  delete: "Elimina",
  add_task: "+ Attivit\u00E0",
  complete: "Completato",
  completed: "Completato",
  skip: "Salta",
  skipped: "Saltato",
  reset: "Reimposta",
  cancel: "Annulla",
  completing: "Completamento\u2026",
  interval: "Intervallo",
  warning: "Avviso",
  last_performed: "Ultima esecuzione",
  next_due: "Prossima scadenza",
  days_until_due: "Giorni alla scadenza",
  avg_duration: "\u00D8 Durata",
  trigger: "Trigger",
  trigger_type: "Tipo di trigger",
  threshold_above: "Limite superiore",
  threshold_below: "Limite inferiore",
  threshold: "Soglia",
  counter: "Contatore",
  state_change: "Cambio di stato",
  runtime: "Tempo di funzionamento",
  runtime_hours: "Durata obiettivo (ore)",
  target_value: "Valore obiettivo",
  baseline: "Linea di base",
  target_changes: "Modifiche obiettivo",
  for_minutes: "Per (minuti)",
  time_based: "Temporale",
  sensor_based: "Sensore",
  manual: "Manuale",
  cleaning: "Pulizia",
  inspection: "Ispezione",
  replacement: "Sostituzione",
  calibration: "Calibrazione",
  service: "Servizio",
  custom: "Personalizzato",
  history: "Cronologia",
  cost: "Costo",
  duration: "Durata",
  both: "Entrambi",
  trigger_val: "Valore trigger",
  complete_title: "Completato: ",
  checklist: "Checklist",
  notes_optional: "Note (opzionale)",
  cost_optional: "Costo (opzionale)",
  duration_minutes: "Durata in minuti (opzionale)",
  days: "giorni",
  day: "giorno",
  today: "Oggi",
  d_overdue: "g in ritardo",
  no_tasks: "Nessuna attivit\u00E0 di manutenzione. Crea un oggetto per iniziare.",
  no_tasks_short: "Nessuna attivit\u00E0",
  no_history: "Nessuna voce nella cronologia.",
  show_all: "Mostra tutto",
  cost_duration_chart: "Costi & Durata",
  installed: "Installato",
  confirm_delete_object: "Eliminare questo oggetto e tutte le sue attivit\u00E0?",
  confirm_delete_task: "Eliminare questa attivit\u00E0?",
  min: "Min",
  max: "Max",
  save: "Salva",
  saving: "Salvataggio\u2026",
  edit_task: "Modifica attivit\u00E0",
  new_task: "Nuova attivit\u00E0 di manutenzione",
  task_name: "Nome attivit\u00E0",
  maintenance_type: "Tipo di manutenzione",
  schedule_type: "Tipo di pianificazione",
  interval_days: "Intervallo (giorni)",
  warning_days: "Giorni di avviso",
  last_performed_optional: "Ultima esecuzione (opzionale)",
  interval_anchor: "Ancoraggio intervallo",
  anchor_completion: "Dalla data di completamento",
  anchor_planned: "Dalla data pianificata (nessuna deriva)",
  edit_object: "Modifica oggetto",
  name: "Nome",
  manufacturer_optional: "Produttore (opzionale)",
  model_optional: "Modello (opzionale)",
  serial_number_optional: "Numero di serie (opzionale)",
  serial_number_label: "N/S",
  sort_due_date: "Scadenza",
  sort_object: "Nome oggetto",
  sort_type: "Tipo",
  sort_task_name: "Nome attività",
  all_objects: "Tutti gli oggetti",
  tasks_lower: "attività",
  no_tasks_yet: "Nessuna attività",
  add_first_task: "Aggiungi prima attività",
  trigger_configuration: "Configurazione trigger",
  entity_id: "ID entit\u00E0",
  comma_separated: "separati da virgola",
  entity_logic: "Logica entit\u00E0",
  entity_logic_any: "Qualsiasi entit\u00E0 attiva",
  entity_logic_all: "Tutte le entit\u00E0 devono attivare",
  entities: "entit\u00E0",
  attribute_optional: "Attributo (opzionale, vuoto = stato)",
  use_entity_state: "Usa stato dell\u0027entit\u00E0 (nessun attributo)",
  trigger_above: "Attivare sopra",
  trigger_below: "Attivare sotto",
  for_at_least_minutes: "Per almeno (minuti)",
  safety_interval_days: "Intervallo di sicurezza (giorni, opzionale)",
  delta_mode: "Modalit\u00E0 delta",
  from_state_optional: "Dallo stato (opzionale)",
  to_state_optional: "Allo stato (opzionale)",
  documentation_url_optional: "URL documentazione (opzionale)",
  nfc_tag_id_optional: "ID tag NFC (opzionale)",
  nfc_tag_id: "ID tag NFC",
  nfc_linked: "Tag NFC collegato",
  nfc_link_hint: "Clicca per collegare un tag NFC",
  responsible_user: "Utente responsabile",
  no_user_assigned: "(Nessun utente assegnato)",
  all_users: "Tutti gli utenti",
  my_tasks: "Le mie attivit\u00E0",
  budget_monthly: "Budget mensile",
  budget_yearly: "Budget annuale",
  groups: "Gruppi",
  loading_chart: "Caricamento dati...",
  was_maintenance_needed: "Questa manutenzione era necessaria?",
  feedback_needed: "Necessaria",
  feedback_not_needed: "Non necessaria",
  feedback_not_sure: "Non sicuro",
  suggested_interval: "Intervallo suggerito",
  apply_suggestion: "Applica",
  dismiss_suggestion: "Ignora",
  confidence_low: "Bassa",
  confidence_medium: "Media",
  confidence_high: "Alta",
  recommended: "consigliato",
  seasonal_awareness: "Consapevolezza stagionale",
  seasonal_chart_title: "Fattori stagionali",
  seasonal_learned: "Appreso",
  seasonal_manual: "Manuale",
  month_jan: "Gen", month_feb: "Feb", month_mar: "Mar", month_apr: "Apr",
  month_may: "Mag", month_jun: "Giu", month_jul: "Lug", month_aug: "Ago",
  month_sep: "Set", month_oct: "Ott", month_nov: "Nov", month_dec: "Dic",
  sensor_prediction: "Previsione sensore",
  degradation_trend: "Tendenza",
  trend_rising: "In aumento",
  trend_falling: "In calo",
  trend_stable: "Stabile",
  trend_insufficient_data: "Dati insufficienti",
  days_until_threshold: "Giorni alla soglia",
  threshold_exceeded: "Soglia superata",
  environmental_adjustment: "Fattore ambientale",
  sensor_prediction_urgency: "Il sensore prevede la soglia tra ~{days} giorni",
  day_short: "giorno",
  weibull_reliability_curve: "Curva di affidabilit\u00E0",
  weibull_failure_probability: "Probabilit\u00E0 di guasto",
  weibull_r_squared: "Adattamento R\u00B2",
  beta_early_failures: "Guasti precoci",
  beta_random_failures: "Guasti casuali",
  beta_wear_out: "Usura",
  beta_highly_predictable: "Altamente prevedibile",
  confidence_interval: "Intervallo di confidenza",
  confidence_conservative: "Conservativo",
  confidence_aggressive: "Ottimistico",
  current_interval_marker: "Intervallo attuale",
  recommended_marker: "Consigliato",
  characteristic_life: "Vita caratteristica",
  chart_mini_sparkline: "Sparkline di tendenza",
  chart_history: "Cronologia costi e durata",
  chart_seasonal: "Fattori stagionali, 12 mesi",
  chart_weibull: "Curva di affidabilit\u00E0 Weibull",
  chart_sparkline: "Grafico valore trigger sensore",
  days_progress: "Avanzamento giorni",
  qr_code: "Codice QR",
  qr_generating: "Generazione codice QR\u2026",
  qr_error: "Impossibile generare il codice QR.",
  qr_error_no_url: "Nessun URL HA configurato. Impostare un URL esterno o interno in Impostazioni \u2192 Sistema \u2192 Rete.",
  save_error: "Salvataggio non riuscito. Riprovare.",
  qr_print: "Stampa",
  qr_download: "Scarica SVG",
  qr_action: "Azione alla scansione",
  qr_action_view: "Visualizza info manutenzione",
  qr_action_complete: "Segna manutenzione come completata",
  qr_url_mode: "Tipo di link",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Locale (mDNS)",
  qr_mode_server: "URL server",
  overview: "Panoramica",
  analysis: "Analisi",
  recent_activities: "Attivit\u00E0 recenti",
  search_notes: "Cerca nelle note",
  avg_cost: "\u00D8 Costo",
  no_advanced_features: "Nessuna funzione avanzata attivata",
  no_advanced_features_hint: "Attiva \u201CIntervalli Adattivi\u201D o \u201CModelli Stagionali\u201D nelle impostazioni dell\u0027integrazione per vedere i dati di analisi qui.",
  analysis_not_enough_data: "Non ci sono ancora abbastanza dati per l\u0027analisi.",
  analysis_not_enough_data_hint: "L\u0027analisi Weibull richiede almeno 5 manutenzioni completate; i modelli stagionali diventano visibili dopo 6+ punti dati al mese.",
  analysis_manual_task_hint: "Le attivit\u00E0 manuali senza intervallo non generano dati di analisi.",
  completions: "completamenti",
  current: "Attuale",
  shorter: "Pi\u00F9 breve",
  longer: "Pi\u00F9 lungo",
  normal: "Normale",
  disabled: "Disattivato",
  compound_logic: "Logica composta",
  // Card editor
  card_title: "Titolo",
  card_show_header: "Mostra intestazione con statistiche",
  card_show_actions: "Mostra pulsanti azione",
  card_compact: "Modalit\u00E0 compatta",
  card_max_items: "Max elementi (0 = tutti)",
  action_error: "Azione fallita. Riprova.",
  area_id_optional: "Area (opzionale)",
  installation_date_optional: "Data di installazione (opzionale)",
  custom_icon_optional: "Icona (opzionale, es. mdi:wrench)",
  task_enabled: "Attività abilitata",
  skip_reason_prompt: "Saltare questa attività?",
  reason_optional: "Motivo (opzionale)",
  reset_date_prompt: "Reimpostare questa attività?",
  reset_date_optional: "Nuova data (opzionale)",
  notes_label: "Note",
  documentation_label: "Documentazione",
  no_nfc_tag: "— Nessun tag —",
  // Settings tab
  dashboard: "Dashboard",
  settings: "Impostazioni",
  settings_features: "Funzioni avanzate",
  settings_features_desc: "Attiva o disattiva le funzioni avanzate. La disattivazione le nasconde dall'interfaccia ma non elimina i dati.",
  feat_adaptive: "Pianificazione adattiva",
  feat_adaptive_desc: "Impara intervalli ottimali dalla cronologia di manutenzione",
  feat_predictions: "Previsioni sensore",
  feat_predictions_desc: "Prevedi date di attivazione dalla degradazione dei sensori",
  feat_seasonal: "Adeguamenti stagionali",
  feat_seasonal_desc: "Adegua gli intervalli in base ai modelli stagionali",
  feat_environmental: "Correlazione ambientale",
  feat_environmental_desc: "Correla gli intervalli con temperatura/umidit\u00E0",
  feat_budget: "Monitoraggio budget",
  feat_budget_desc: "Monitora le spese di manutenzione mensili e annuali",
  feat_groups: "Gruppi di attivit\u00E0",
  feat_groups_desc: "Organizza le attivit\u00E0 in gruppi logici",
  feat_checklists: "Checklist",
  feat_checklists_desc: "Procedure multi-fase per il completamento delle attivit\u00E0",
  settings_general: "Generale",
  settings_default_warning: "Giorni di avviso predefiniti",
  settings_panel_enabled: "Pannello laterale",
  settings_notifications: "Notifiche",
  settings_notify_service: "Servizio di notifica",
  settings_notify_due_soon: "Notifica quando in scadenza",
  settings_notify_overdue: "Notifica quando scaduto",
  settings_notify_triggered: "Notifica quando attivato",
  settings_interval_hours: "Intervallo di ripetizione (ore, 0 = una volta)",
  settings_quiet_hours: "Ore di silenzio",
  settings_quiet_start: "Inizio",
  settings_quiet_end: "Fine",
  settings_max_per_day: "Max notifiche al giorno (0 = illimitato)",
  settings_bundling: "Raggruppare le notifiche",
  settings_bundle_threshold: "Soglia di raggruppamento",
  settings_actions: "Pulsanti azione mobili",
  settings_action_complete: "Mostra pulsante 'Completato'",
  settings_action_skip: "Mostra pulsante 'Salta'",
  settings_action_snooze: "Mostra pulsante 'Posticipa'",
  settings_snooze_hours: "Durata posticipo (ore)",
  settings_budget: "Budget",
  settings_currency: "Valuta",
  settings_budget_monthly: "Budget mensile",
  settings_budget_yearly: "Budget annuale",
  settings_budget_alerts: "Avvisi budget",
  settings_budget_threshold: "Soglia di avviso (%)",
  settings_import_export: "Import / Export",
  settings_export_json: "Esporta JSON",
  settings_export_csv: "Esporta CSV",
  settings_import_csv: "Importa CSV",
  settings_import_placeholder: "Incolla il contenuto JSON o CSV qui\u2026",
  settings_import_btn: "Importa",
  settings_import_success: "{count} oggetti importati con successo.",
  settings_export_success: "Export scaricato.",
  settings_saved: "Impostazione salvata.",
  settings_include_history: "Includi cronologia",
};

const ES: Translations = {
  maintenance: "Mantenimiento",
  objects: "Objetos",
  tasks: "Tareas",
  overdue: "Vencida",
  due_soon: "Pr\u00F3xima",
  triggered: "Activada",
  ok: "OK",
  all: "Todos",
  new_object: "+ Nuevo objeto",
  edit: "Editar",
  delete: "Eliminar",
  add_task: "+ Tarea",
  complete: "Completada",
  completed: "Completada",
  skip: "Omitir",
  skipped: "Omitida",
  reset: "Restablecer",
  cancel: "Cancelar",
  completing: "Completando\u2026",
  interval: "Intervalo",
  warning: "Aviso",
  last_performed: "\u00DAltima ejecuci\u00F3n",
  next_due: "Pr\u00F3ximo vencimiento",
  days_until_due: "D\u00EDas hasta vencimiento",
  avg_duration: "\u00D8 Duraci\u00F3n",
  trigger: "Disparador",
  trigger_type: "Tipo de disparador",
  threshold_above: "L\u00EDmite superior",
  threshold_below: "L\u00EDmite inferior",
  threshold: "Umbral",
  counter: "Contador",
  state_change: "Cambio de estado",
  runtime: "Tiempo de funcionamiento",
  runtime_hours: "Duraci\u00F3n objetivo (horas)",
  target_value: "Valor objetivo",
  baseline: "L\u00EDnea base",
  target_changes: "Cambios objetivo",
  for_minutes: "Durante (minutos)",
  time_based: "Temporal",
  sensor_based: "Sensor",
  manual: "Manual",
  cleaning: "Limpieza",
  inspection: "Inspecci\u00F3n",
  replacement: "Sustituci\u00F3n",
  calibration: "Calibraci\u00F3n",
  service: "Servicio",
  custom: "Personalizado",
  history: "Historial",
  cost: "Coste",
  duration: "Duraci\u00F3n",
  both: "Ambos",
  trigger_val: "Valor del disparador",
  complete_title: "Completada: ",
  checklist: "Lista de verificaci\u00F3n",
  notes_optional: "Notas (opcional)",
  cost_optional: "Coste (opcional)",
  duration_minutes: "Duraci\u00F3n en minutos (opcional)",
  days: "d\u00EDas",
  day: "d\u00EDa",
  today: "Hoy",
  d_overdue: "d vencida",
  no_tasks: "No hay tareas de mantenimiento. Cree un objeto para empezar.",
  no_tasks_short: "Sin tareas",
  no_history: "Sin entradas en el historial.",
  show_all: "Mostrar todo",
  cost_duration_chart: "Costes & Duraci\u00F3n",
  installed: "Instalado",
  confirm_delete_object: "\u00BFEliminar este objeto y todas sus tareas?",
  confirm_delete_task: "\u00BFEliminar esta tarea?",
  min: "M\u00EDn",
  max: "M\u00E1x",
  save: "Guardar",
  saving: "Guardando\u2026",
  edit_task: "Editar tarea",
  new_task: "Nueva tarea de mantenimiento",
  task_name: "Nombre de la tarea",
  maintenance_type: "Tipo de mantenimiento",
  schedule_type: "Tipo de planificaci\u00F3n",
  interval_days: "Intervalo (d\u00EDas)",
  warning_days: "D\u00EDas de aviso",
  last_performed_optional: "Última ejecución (opcional)",
  interval_anchor: "Anclaje del intervalo",
  anchor_completion: "Desde la fecha de finalizaci\u00F3n",
  anchor_planned: "Desde la fecha planificada (sin desviaci\u00F3n)",
  edit_object: "Editar objeto",
  name: "Nombre",
  manufacturer_optional: "Fabricante (opcional)",
  model_optional: "Modelo (opcional)",
  serial_number_optional: "Número de serie (opcional)",
  serial_number_label: "N/S",
  sort_due_date: "Vencimiento",
  sort_object: "Nombre del objeto",
  sort_type: "Tipo",
  sort_task_name: "Nombre de la tarea",
  all_objects: "Todos los objetos",
  tasks_lower: "tareas",
  no_tasks_yet: "Aún no hay tareas",
  add_first_task: "Agregar primera tarea",
  trigger_configuration: "Configuraci\u00F3n del disparador",
  entity_id: "ID de entidad",
  comma_separated: "separados por comas",
  entity_logic: "L\u00F3gica de entidad",
  entity_logic_any: "Cualquier entidad activa",
  entity_logic_all: "Todas las entidades deben activar",
  entities: "entidades",
  attribute_optional: "Atributo (opcional, vac\u00EDo = estado)",
  use_entity_state: "Usar estado de la entidad (sin atributo)",
  trigger_above: "Activar por encima de",
  trigger_below: "Activar por debajo de",
  for_at_least_minutes: "Durante al menos (minutos)",
  safety_interval_days: "Intervalo de seguridad (d\u00EDas, opcional)",
  delta_mode: "Modo delta",
  from_state_optional: "Desde estado (opcional)",
  to_state_optional: "Hasta estado (opcional)",
  documentation_url_optional: "URL de documentaci\u00F3n (opcional)",
  nfc_tag_id_optional: "ID de etiqueta NFC (opcional)",
  nfc_tag_id: "ID de etiqueta NFC",
  nfc_linked: "Etiqueta NFC vinculada",
  nfc_link_hint: "Clic para vincular etiqueta NFC",
  responsible_user: "Usuario responsable",
  no_user_assigned: "(Ning\u00FAn usuario asignado)",
  all_users: "Todos los usuarios",
  my_tasks: "Mis tareas",
  budget_monthly: "Presupuesto mensual",
  budget_yearly: "Presupuesto anual",
  groups: "Grupos",
  loading_chart: "Cargando datos...",
  was_maintenance_needed: "\u00BFEra necesario este mantenimiento?",
  feedback_needed: "Necesario",
  feedback_not_needed: "No necesario",
  feedback_not_sure: "No seguro",
  suggested_interval: "Intervalo sugerido",
  apply_suggestion: "Aplicar",
  dismiss_suggestion: "Descartar",
  confidence_low: "Baja",
  confidence_medium: "Media",
  confidence_high: "Alta",
  recommended: "recomendado",
  seasonal_awareness: "Conciencia estacional",
  seasonal_chart_title: "Factores estacionales",
  seasonal_learned: "Aprendido",
  seasonal_manual: "Manual",
  month_jan: "Ene", month_feb: "Feb", month_mar: "Mar", month_apr: "Abr",
  month_may: "May", month_jun: "Jun", month_jul: "Jul", month_aug: "Ago",
  month_sep: "Sep", month_oct: "Oct", month_nov: "Nov", month_dec: "Dic",
  sensor_prediction: "Predicci\u00F3n del sensor",
  degradation_trend: "Tendencia",
  trend_rising: "En aumento",
  trend_falling: "En descenso",
  trend_stable: "Estable",
  trend_insufficient_data: "Datos insuficientes",
  days_until_threshold: "D\u00EDas hasta el umbral",
  threshold_exceeded: "Umbral superado",
  environmental_adjustment: "Factor ambiental",
  sensor_prediction_urgency: "El sensor predice el umbral en ~{days} d\u00EDas",
  day_short: "d\u00EDa",
  weibull_reliability_curve: "Curva de fiabilidad",
  weibull_failure_probability: "Probabilidad de fallo",
  weibull_r_squared: "Ajuste R\u00B2",
  beta_early_failures: "Fallos tempranos",
  beta_random_failures: "Fallos aleatorios",
  beta_wear_out: "Desgaste",
  beta_highly_predictable: "Altamente predecible",
  confidence_interval: "Intervalo de confianza",
  confidence_conservative: "Conservador",
  confidence_aggressive: "Optimista",
  current_interval_marker: "Intervalo actual",
  recommended_marker: "Recomendado",
  characteristic_life: "Vida caracter\u00EDstica",
  chart_mini_sparkline: "Sparkline de tendencia",
  chart_history: "Historial de costes y duraci\u00F3n",
  chart_seasonal: "Factores estacionales, 12 meses",
  chart_weibull: "Curva de fiabilidad Weibull",
  chart_sparkline: "Gr\u00E1fico de valor del disparador",
  days_progress: "Progreso en d\u00EDas",
  qr_code: "C\u00F3digo QR",
  qr_generating: "Generando c\u00F3digo QR\u2026",
  qr_error: "No se pudo generar el c\u00F3digo QR.",
  qr_error_no_url: "No hay URL de HA configurada. Establezca una URL externa o interna en Ajustes \u2192 Sistema \u2192 Red.",
  save_error: "Error al guardar. Int\u00E9ntelo de nuevo.",
  qr_print: "Imprimir",
  qr_download: "Descargar SVG",
  qr_action: "Acci\u00F3n al escanear",
  qr_action_view: "Ver info de mantenimiento",
  qr_action_complete: "Marcar mantenimiento como completado",
  qr_url_mode: "Tipo de enlace",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Local (mDNS)",
  qr_mode_server: "URL del servidor",
  overview: "Resumen",
  analysis: "An\u00E1lisis",
  recent_activities: "Actividades recientes",
  search_notes: "Buscar en notas",
  avg_cost: "\u00D8 Coste",
  no_advanced_features: "Sin funciones avanzadas activadas",
  no_advanced_features_hint: "Active \u201CIntervalos Adaptativos\u201D o \u201CPatrones Estacionales\u201D en la configuraci\u00F3n de la integraci\u00F3n para ver datos de an\u00E1lisis aqu\u00ED.",
  analysis_not_enough_data: "A\u00FAn no hay suficientes datos para el an\u00E1lisis.",
  analysis_not_enough_data_hint: "El an\u00E1lisis Weibull requiere al menos 5 mantenimientos completados; los patrones estacionales son visibles tras 6+ puntos de datos por mes.",
  analysis_manual_task_hint: "Las tareas manuales sin intervalo no generan datos de an\u00E1lisis.",
  completions: "finalizaciones",
  current: "Actual",
  shorter: "M\u00E1s corto",
  longer: "M\u00E1s largo",
  normal: "Normal",
  disabled: "Desactivado",
  compound_logic: "L\u00F3gica compuesta",
  // Card editor
  card_title: "T\u00EDtulo",
  card_show_header: "Mostrar encabezado con estad\u00EDsticas",
  card_show_actions: "Mostrar botones de acci\u00F3n",
  card_compact: "Modo compacto",
  card_max_items: "M\u00E1x. elementos (0 = todos)",
  action_error: "Acción fallida. Inténtelo de nuevo.",
  area_id_optional: "Área (opcional)",
  installation_date_optional: "Fecha de instalación (opcional)",
  custom_icon_optional: "Icono (opcional, ej. mdi:wrench)",
  task_enabled: "Tarea habilitada",
  skip_reason_prompt: "¿Omitir esta tarea?",
  reason_optional: "Motivo (opcional)",
  reset_date_prompt: "¿Restablecer esta tarea?",
  reset_date_optional: "Nueva fecha (opcional)",
  notes_label: "Notas",
  documentation_label: "Documentación",
  no_nfc_tag: "— Sin etiqueta —",
  // Settings tab
  dashboard: "Panel",
  settings: "Ajustes",
  settings_features: "Funciones avanzadas",
  settings_features_desc: "Active o desactive funciones avanzadas. Desactivar las oculta de la interfaz pero no elimina datos.",
  feat_adaptive: "Planificaci\u00F3n adaptativa",
  feat_adaptive_desc: "Aprender intervalos \u00F3ptimos del historial de mantenimiento",
  feat_predictions: "Predicciones de sensor",
  feat_predictions_desc: "Predecir fechas de activaci\u00F3n por degradaci\u00F3n del sensor",
  feat_seasonal: "Ajustes estacionales",
  feat_seasonal_desc: "Ajustar intervalos seg\u00FAn patrones estacionales",
  feat_environmental: "Correlaci\u00F3n ambiental",
  feat_environmental_desc: "Correlacionar intervalos con temperatura/humedad",
  feat_budget: "Seguimiento de presupuesto",
  feat_budget_desc: "Seguir los gastos de mantenimiento mensuales y anuales",
  feat_groups: "Grupos de tareas",
  feat_groups_desc: "Organizar tareas en grupos l\u00F3gicos",
  feat_checklists: "Listas de verificaci\u00F3n",
  feat_checklists_desc: "Procedimientos de varios pasos para completar tareas",
  settings_general: "General",
  settings_default_warning: "D\u00EDas de aviso predeterminados",
  settings_panel_enabled: "Panel lateral",
  settings_notifications: "Notificaciones",
  settings_notify_service: "Servicio de notificaci\u00F3n",
  settings_notify_due_soon: "Notificar cuando est\u00E9 pr\u00F3xima",
  settings_notify_overdue: "Notificar cuando est\u00E9 vencida",
  settings_notify_triggered: "Notificar cuando se active",
  settings_interval_hours: "Intervalo de repetici\u00F3n (horas, 0 = una vez)",
  settings_quiet_hours: "Horas de silencio",
  settings_quiet_start: "Inicio",
  settings_quiet_end: "Fin",
  settings_max_per_day: "M\u00E1x. notificaciones por d\u00EDa (0 = ilimitado)",
  settings_bundling: "Agrupar notificaciones",
  settings_bundle_threshold: "Umbral de agrupaci\u00F3n",
  settings_actions: "Botones de acci\u00F3n m\u00F3viles",
  settings_action_complete: "Mostrar bot\u00F3n 'Completada'",
  settings_action_skip: "Mostrar bot\u00F3n 'Omitir'",
  settings_action_snooze: "Mostrar bot\u00F3n 'Posponer'",
  settings_snooze_hours: "Duraci\u00F3n de posposici\u00F3n (horas)",
  settings_budget: "Presupuesto",
  settings_currency: "Moneda",
  settings_budget_monthly: "Presupuesto mensual",
  settings_budget_yearly: "Presupuesto anual",
  settings_budget_alerts: "Alertas de presupuesto",
  settings_budget_threshold: "Umbral de alerta (%)",
  settings_import_export: "Importar / Exportar",
  settings_export_json: "Exportar JSON",
  settings_export_csv: "Exportar CSV",
  settings_import_csv: "Importar CSV",
  settings_import_placeholder: "Pegue el contenido JSON o CSV aqu\u00ED\u2026",
  settings_import_btn: "Importar",
  settings_import_success: "{count} objetos importados correctamente.",
  settings_export_success: "Exportaci\u00F3n descargada.",
  settings_saved: "Ajuste guardado.",
  settings_include_history: "Incluir historial",
};

const PT: Translations = {
  maintenance: "Manutenção",
  objects: "Objetos",
  tasks: "Tarefas",
  overdue: "Atrasada",
  due_soon: "Próxima",
  triggered: "Acionada",
  ok: "OK",
  all: "Todos",
  new_object: "+ Novo objeto",
  edit: "Editar",
  delete: "Eliminar",
  add_task: "+ Tarefa",
  complete: "Concluída",
  completed: "Concluída",
  skip: "Saltar",
  skipped: "Saltada",
  reset: "Repor",
  cancel: "Cancelar",
  completing: "A concluir\u2026",
  interval: "Intervalo",
  warning: "Aviso",
  last_performed: "Última execução",
  next_due: "Próximo vencimento",
  days_until_due: "Dias até vencimento",
  avg_duration: "\u00D8 Duração",
  trigger: "Acionador",
  trigger_type: "Tipo de acionador",
  threshold_above: "Limite superior",
  threshold_below: "Limite inferior",
  threshold: "Limiar",
  counter: "Contador",
  state_change: "Mudança de estado",
  runtime: "Tempo de funcionamento",
  runtime_hours: "Duração alvo (horas)",
  target_value: "Valor alvo",
  baseline: "Linha de base",
  target_changes: "Alterações alvo",
  for_minutes: "Durante (minutos)",
  time_based: "Temporal",
  sensor_based: "Sensor",
  manual: "Manual",
  cleaning: "Limpeza",
  inspection: "Inspeção",
  replacement: "Substituição",
  calibration: "Calibração",
  service: "Serviço",
  custom: "Personalizado",
  history: "Histórico",
  cost: "Custo",
  duration: "Duração",
  both: "Ambos",
  trigger_val: "Valor do acionador",
  complete_title: "Concluída: ",
  checklist: "Lista de verificação",
  notes_optional: "Notas (opcional)",
  cost_optional: "Custo (opcional)",
  duration_minutes: "Duração em minutos (opcional)",
  days: "dias",
  day: "dia",
  today: "Hoje",
  d_overdue: "d em atraso",
  no_tasks: "Sem tarefas de manutenção. Crie um objeto para começar.",
  no_tasks_short: "Sem tarefas",
  no_history: "Sem entradas no histórico.",
  show_all: "Mostrar tudo",
  cost_duration_chart: "Custos & Duração",
  installed: "Instalado",
  confirm_delete_object: "Eliminar este objeto e todas as suas tarefas?",
  confirm_delete_task: "Eliminar esta tarefa?",
  min: "Mín",
  max: "Máx",
  save: "Guardar",
  saving: "A guardar\u2026",
  edit_task: "Editar tarefa",
  new_task: "Nova tarefa de manutenção",
  task_name: "Nome da tarefa",
  maintenance_type: "Tipo de manutenção",
  schedule_type: "Tipo de agendamento",
  interval_days: "Intervalo (dias)",
  warning_days: "Dias de aviso",
  last_performed_optional: "Última execução (opcional)",
  interval_anchor: "Âncora do intervalo",
  anchor_completion: "A partir da data de conclusão",
  anchor_planned: "A partir da data planeada (sem desvio)",
  edit_object: "Editar objeto",
  name: "Nome",
  manufacturer_optional: "Fabricante (opcional)",
  model_optional: "Modelo (opcional)",
  serial_number_optional: "Número de série (opcional)",
  serial_number_label: "N/S",
  sort_due_date: "Vencimento",
  sort_object: "Nome do objeto",
  sort_type: "Tipo",
  sort_task_name: "Nome da tarefa",
  all_objects: "Todos os objetos",
  tasks_lower: "tarefas",
  no_tasks_yet: "Ainda sem tarefas",
  add_first_task: "Adicionar primeira tarefa",
  trigger_configuration: "Configuração do acionador",
  entity_id: "ID da entidade",
  comma_separated: "separados por vírgulas",
  entity_logic: "Lógica da entidade",
  entity_logic_any: "Qualquer entidade aciona",
  entity_logic_all: "Todas as entidades devem acionar",
  entities: "entidades",
  attribute_optional: "Atributo (opcional, vazio = estado)",
  use_entity_state: "Usar estado da entidade (sem atributo)",
  trigger_above: "Acionar acima de",
  trigger_below: "Acionar abaixo de",
  for_at_least_minutes: "Durante pelo menos (minutos)",
  safety_interval_days: "Intervalo de segurança (dias, opcional)",
  delta_mode: "Modo delta",
  from_state_optional: "Do estado (opcional)",
  to_state_optional: "Para o estado (opcional)",
  documentation_url_optional: "URL de documentação (opcional)",
  nfc_tag_id_optional: "ID da etiqueta NFC (opcional)",
  nfc_tag_id: "ID da etiqueta NFC",
  nfc_linked: "Etiqueta NFC associada",
  nfc_link_hint: "Clique para associar etiqueta NFC",
  responsible_user: "Utilizador responsável",
  no_user_assigned: "(Nenhum utilizador atribuído)",
  all_users: "Todos os utilizadores",
  my_tasks: "As minhas tarefas",
  budget_monthly: "Orçamento mensal",
  budget_yearly: "Orçamento anual",
  groups: "Grupos",
  loading_chart: "A carregar dados...",
  was_maintenance_needed: "Esta manutenção era necessária?",
  feedback_needed: "Necessária",
  feedback_not_needed: "Não necessária",
  feedback_not_sure: "Não tenho a certeza",
  suggested_interval: "Intervalo sugerido",
  apply_suggestion: "Aplicar",
  dismiss_suggestion: "Descartar",
  confidence_low: "Baixa",
  confidence_medium: "Média",
  confidence_high: "Alta",
  recommended: "recomendado",
  seasonal_awareness: "Consciência sazonal",
  seasonal_chart_title: "Fatores sazonais",
  seasonal_learned: "Aprendido",
  seasonal_manual: "Manual",
  month_jan: "Jan", month_feb: "Fev", month_mar: "Mar", month_apr: "Abr",
  month_may: "Mai", month_jun: "Jun", month_jul: "Jul", month_aug: "Ago",
  month_sep: "Set", month_oct: "Out", month_nov: "Nov", month_dec: "Dez",
  sensor_prediction: "Previsão do sensor",
  degradation_trend: "Tendência",
  trend_rising: "A subir",
  trend_falling: "A descer",
  trend_stable: "Estável",
  trend_insufficient_data: "Dados insuficientes",
  days_until_threshold: "Dias até ao limiar",
  threshold_exceeded: "Limiar ultrapassado",
  environmental_adjustment: "Fator ambiental",
  sensor_prediction_urgency: "O sensor prevê o limiar em ~{days} dias",
  day_short: "dia",
  weibull_reliability_curve: "Curva de fiabilidade",
  weibull_failure_probability: "Probabilidade de falha",
  weibull_r_squared: "Ajuste R\u00B2",
  beta_early_failures: "Falhas precoces",
  beta_random_failures: "Falhas aleatórias",
  beta_wear_out: "Desgaste",
  beta_highly_predictable: "Altamente previsível",
  confidence_interval: "Intervalo de confiança",
  confidence_conservative: "Conservador",
  confidence_aggressive: "Otimista",
  current_interval_marker: "Intervalo atual",
  recommended_marker: "Recomendado",
  characteristic_life: "Vida característica",
  chart_mini_sparkline: "Sparkline de tendência",
  chart_history: "Histórico de custos e duração",
  chart_seasonal: "Fatores sazonais, 12 meses",
  chart_weibull: "Curva de fiabilidade Weibull",
  chart_sparkline: "Gráfico de valor do acionador",
  days_progress: "Progresso em dias",
  qr_code: "Código QR",
  qr_generating: "A gerar código QR\u2026",
  qr_error: "Não foi possível gerar o código QR.",
  qr_error_no_url: "Nenhum URL do HA configurado. Defina um URL externo ou interno em Definições \u2192 Sistema \u2192 Rede.",
  save_error: "Erro ao guardar. Tente novamente.",
  qr_print: "Imprimir",
  qr_download: "Transferir SVG",
  qr_action: "Ação ao digitalizar",
  qr_action_view: "Ver informações de manutenção",
  qr_action_complete: "Marcar manutenção como concluída",
  qr_url_mode: "Tipo de ligação",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Local (mDNS)",
  qr_mode_server: "URL do servidor",
  overview: "Visão geral",
  analysis: "Análise",
  recent_activities: "Atividades recentes",
  search_notes: "Pesquisar notas",
  avg_cost: "\u00D8 Custo",
  no_advanced_features: "Sem funções avançadas ativadas",
  no_advanced_features_hint: "Ative \u201CIntervalos Adaptativos\u201D ou \u201CPadrões Sazonais\u201D nas definições da integração para ver dados de análise aqui.",
  analysis_not_enough_data: "Ainda não há dados suficientes para a análise.",
  analysis_not_enough_data_hint: "A análise Weibull requer pelo menos 5 manutenções concluídas; os padrões sazonais tornam-se visíveis após 6+ pontos de dados por mês.",
  analysis_manual_task_hint: "Tarefas manuais sem intervalo não geram dados de análise.",
  completions: "conclusões",
  current: "Atual",
  shorter: "Mais curto",
  longer: "Mais longo",
  normal: "Normal",
  disabled: "Desativado",
  compound_logic: "Lógica composta",
  card_title: "Título",
  card_show_header: "Mostrar cabeçalho com estatísticas",
  card_show_actions: "Mostrar botões de ação",
  card_compact: "Modo compacto",
  card_max_items: "Máx. itens (0 = todos)",
  action_error: "Ação falhada. Tente novamente.",
  area_id_optional: "Área (opcional)",
  installation_date_optional: "Data de instalação (opcional)",
  custom_icon_optional: "Ícone (opcional, ex. mdi:wrench)",
  task_enabled: "Tarefa ativada",
  skip_reason_prompt: "Saltar esta tarefa?",
  reason_optional: "Motivo (opcional)",
  reset_date_prompt: "Repor esta tarefa?",
  reset_date_optional: "Nova data (opcional)",
  notes_label: "Notas",
  documentation_label: "Documentação",
  no_nfc_tag: "— Sem etiqueta —",
  dashboard: "Painel",
  settings: "Definições",
  settings_features: "Funções avançadas",
  settings_features_desc: "Ative ou desative funções avançadas. Desativar oculta-as da interface mas não elimina dados.",
  feat_adaptive: "Agendamento adaptativo",
  feat_adaptive_desc: "Aprender intervalos ideais a partir do histórico de manutenção",
  feat_predictions: "Previsões do sensor",
  feat_predictions_desc: "Prever datas de acionamento pela degradação do sensor",
  feat_seasonal: "Ajustes sazonais",
  feat_seasonal_desc: "Ajustar intervalos com base em padrões sazonais",
  feat_environmental: "Correlação ambiental",
  feat_environmental_desc: "Correlacionar intervalos com temperatura/humidade",
  feat_budget: "Controlo de orçamento",
  feat_budget_desc: "Acompanhar despesas de manutenção mensais e anuais",
  feat_groups: "Grupos de tarefas",
  feat_groups_desc: "Organizar tarefas em grupos lógicos",
  feat_checklists: "Listas de verificação",
  feat_checklists_desc: "Procedimentos com vários passos para conclusão de tarefas",
  settings_general: "Geral",
  settings_default_warning: "Dias de aviso predefinidos",
  settings_panel_enabled: "Painel lateral",
  settings_notifications: "Notificações",
  settings_notify_service: "Serviço de notificação",
  settings_notify_due_soon: "Notificar quando próxima",
  settings_notify_overdue: "Notificar quando atrasada",
  settings_notify_triggered: "Notificar quando acionada",
  settings_interval_hours: "Intervalo de repetição (horas, 0 = uma vez)",
  settings_quiet_hours: "Horas de silêncio",
  settings_quiet_start: "Início",
  settings_quiet_end: "Fim",
  settings_max_per_day: "Máx. notificações por dia (0 = ilimitado)",
  settings_bundling: "Agrupar notificações",
  settings_bundle_threshold: "Limiar de agrupamento",
  settings_actions: "Botões de ação móveis",
  settings_action_complete: "Mostrar botão 'Concluída'",
  settings_action_skip: "Mostrar botão 'Saltar'",
  settings_action_snooze: "Mostrar botão 'Adiar'",
  settings_snooze_hours: "Duração do adiamento (horas)",
  settings_budget: "Orçamento",
  settings_currency: "Moeda",
  settings_budget_monthly: "Orçamento mensal",
  settings_budget_yearly: "Orçamento anual",
  settings_budget_alerts: "Alertas de orçamento",
  settings_budget_threshold: "Limiar de alerta (%)",
  settings_import_export: "Importar / Exportar",
  settings_export_json: "Exportar JSON",
  settings_export_csv: "Exportar CSV",
  settings_import_csv: "Importar CSV",
  settings_import_placeholder: "Cole o conteúdo JSON ou CSV aqui\u2026",
  settings_import_btn: "Importar",
  settings_import_success: "{count} objetos importados com sucesso.",
  settings_export_success: "Exportação transferida.",
  settings_saved: "Definição guardada.",
  settings_include_history: "Incluir histórico",
};

const RU: Translations = {
  maintenance: "Обслуживание",
  objects: "Объекты",
  tasks: "Задачи",
  overdue: "Просрочено",
  due_soon: "Скоро",
  triggered: "Сработало",
  ok: "OK",
  all: "Все",
  new_object: "+ Новый объект",
  edit: "Изменить",
  delete: "Удалить",
  add_task: "+ Добавить задачу",
  complete: "Выполнить",
  completed: "Выполнено",
  skip: "Пропустить",
  skipped: "Пропущено",
  reset: "Сбросить",
  cancel: "Отмена",
  completing: "Выполнение…",
  interval: "Интервал",
  warning: "Предупреждение",
  last_performed: "Последнее выполнение",
  next_due: "Следующий срок",
  days_until_due: "Дней до срока",
  avg_duration: "Ср. длительность",
  trigger: "Триггер",
  trigger_type: "Тип триггера",
  threshold_above: "Верхний предел",
  threshold_below: "Нижний предел",
  threshold: "Порог",
  counter: "Счётчик",
  state_change: "Изменение состояния",
  runtime: "Время работы",
  runtime_hours: "Целевое время работы (часы)",
  target_value: "Целевое значение",
  baseline: "Базовое значение",
  target_changes: "Целевые изменения",
  for_minutes: "На (минут)",
  time_based: "По времени",
  sensor_based: "По датчику",
  manual: "Вручную",
  cleaning: "Чистка",
  inspection: "Осмотр",
  replacement: "Замена",
  calibration: "Калибровка",
  service: "Сервис",
  custom: "Своё",
  history: "История",
  cost: "Стоимость",
  duration: "Длительность",
  both: "Оба",
  trigger_val: "Значение триггера",
  complete_title: "Выполнить: ",
  checklist: "Контрольный список",
  notes_optional: "Примечания (опционально)",
  cost_optional: "Стоимость (опционально)",
  duration_minutes: "Длительность в минутах (опционально)",
  days: "дней",
  day: "день",
  today: "Сегодня",
  d_overdue: "дн. просрочено",
  no_tasks: "Пока нет задач по обслуживанию. Создайте объект, чтобы начать.",
  no_tasks_short: "Нет задач",
  no_history: "Пока нет записей в истории.",
  show_all: "Показать все",
  cost_duration_chart: "Стоимость и длительность",
  installed: "Установлен",
  confirm_delete_object: "Удалить этот объект и все его задачи?",
  confirm_delete_task: "Удалить эту задачу?",
  min: "Мин",
  max: "Макс",
  // Dialog labels
  save: "Сохранить",
  saving: "Сохранение…",
  edit_task: "Изменить задачу",
  new_task: "Новая задача обслуживания",
  task_name: "Название задачи",
  maintenance_type: "Тип обслуживания",
  schedule_type: "Тип расписания",
  interval_days: "Интервал (дни)",
  warning_days: "Дни предупреждения",
  interval_anchor: "Якорь интервала",
  anchor_completion: "От даты выполнения",
  anchor_planned: "От плановой даты (без смещения)",
  edit_object: "Изменить объект",
  name: "Имя",
  manufacturer_optional: "Производитель (опционально)",
  model_optional: "Модель (опционально)",
  serial_number_optional: "Серийный номер (опционально)",
  serial_number_label: "С/Н",
  // Trigger dialog labels
  trigger_configuration: "Настройка триггера",
  entity_id: "ID сущности",
  comma_separated: "через запятую",
  entity_logic: "Логика сущностей",
  entity_logic_any: "Любая сущность срабатывает",
  entity_logic_all: "Все сущности должны сработать",
  entities: "сущности",
  attribute_optional: "Атрибут (опционально, пусто = состояние)",
  use_entity_state: "Использовать состояние сущности (без атрибута)",
  trigger_above: "Срабатывать выше",
  trigger_below: "Срабатывать ниже",
  for_at_least_minutes: "Не менее (минут)",
  safety_interval_days: "Интервал безопасности (дни, опционально)",
  delta_mode: "Режим дельты",
  from_state_optional: "Из состояния (опционально)",
  to_state_optional: "В состояние (опционально)",
  documentation_url_optional: "URL документации (опционально)",
  nfc_tag_id_optional: "ID NFC-метки (опционально)",
  nfc_tag_id: "ID NFC-метки",
  nfc_linked: "NFC-метка привязана",
  nfc_link_hint: "Нажмите, чтобы привязать NFC-метку",
  // User assignment
  responsible_user: "Ответственный пользователь",
  no_user_assigned: "(Не назначен)",
  all_users: "Все пользователи",
  my_tasks: "Мои задачи",
  budget_monthly: "Месячный бюджет",
  budget_yearly: "Годовой бюджет",
  groups: "Группы",
  loading_chart: "Загрузка данных графика...",
  // Adaptive scheduling
  was_maintenance_needed: "Требовалось ли это обслуживание?",
  feedback_needed: "Требовалось",
  feedback_not_needed: "Не требовалось",
  feedback_not_sure: "Не уверен",
  suggested_interval: "Рекомендуемый интервал",
  apply_suggestion: "Применить",
  dismiss_suggestion: "Отклонить",
  confidence_low: "Низкая",
  confidence_medium: "Средняя",
  confidence_high: "Высокая",
  recommended: "рекомендуется",
  // Seasonal scheduling
  seasonal_awareness: "Сезонная адаптация",
  seasonal_chart_title: "Сезонные факторы",
  seasonal_learned: "Изученные",
  seasonal_manual: "Ручные",
  month_jan: "Янв", month_feb: "Фев", month_mar: "Мар", month_apr: "Апр",
  month_may: "Май", month_jun: "Июн", month_jul: "Июл", month_aug: "Авг",
  month_sep: "Сен", month_oct: "Окт", month_nov: "Ноя", month_dec: "Дек",
  // Sensor prediction (Phase 3)
  sensor_prediction: "Предсказание по датчику",
  degradation_trend: "Тренд",
  trend_rising: "Растущий",
  trend_falling: "Падающий",
  trend_stable: "Стабильный",
  trend_insufficient_data: "Недостаточно данных",
  days_until_threshold: "Дней до порога",
  threshold_exceeded: "Порог превышен",
  environmental_adjustment: "Фактор среды",
  sensor_prediction_urgency: "Датчик предсказывает порог через ~{days} дней",
  day_short: "дн",
  // Weibull / Phase 4
  weibull_reliability_curve: "Кривая надёжности",
  weibull_failure_probability: "Вероятность отказа",
  weibull_r_squared: "Качество аппроксимации R²",
  beta_early_failures: "Ранние отказы",
  beta_random_failures: "Случайные отказы",
  beta_wear_out: "Износ",
  beta_highly_predictable: "Высокая предсказуемость",
  confidence_interval: "Доверительный интервал",
  confidence_conservative: "Консервативный",
  confidence_aggressive: "Оптимистичный",
  current_interval_marker: "Текущий интервал",
  recommended_marker: "Рекомендуемый",
  characteristic_life: "Характеристический срок службы",
  // Accessibility (ARIA labels)
  chart_mini_sparkline: "Мини-график тренда",
  chart_history: "История стоимости и длительности",
  chart_seasonal: "Сезонные факторы, 12 месяцев",
  chart_weibull: "Кривая надёжности Вейбулла",
  chart_sparkline: "График значений триггера датчика",
  days_progress: "Прогресс по дням",
  // QR Code
  qr_code: "QR-код",
  qr_generating: "Генерация QR-кода\u2026",
  qr_error: "Не удалось сгенерировать QR-код.",
  qr_error_no_url: "URL HA не настроен. Установите внешний или внутренний URL в Настройках → Система → Сеть.",
  save_error: "Не удалось сохранить. Попробуйте ещё раз.",
  qr_print: "Печать",
  qr_download: "Скачать SVG",
  qr_action: "Действие при сканировании",
  qr_action_view: "Просмотр информации об обслуживании",
  qr_action_complete: "Отметить обслуживание как выполненное",
  qr_url_mode: "Тип ссылки",
  qr_mode_companion: "Приложение-компаньон",
  qr_mode_local: "Локальный (mDNS)",
  qr_mode_server: "URL сервера",
  // Dashboard redesign
  overview: "Обзор",
  analysis: "Анализ",
  recent_activities: "Недавние действия",
  search_notes: "Поиск по заметкам",
  avg_cost: "Ср. стоимость",
  no_advanced_features: "Расширенные функции не включены",
  no_advanced_features_hint: "Включите «Адаптивные интервалы» или «Сезонные паттерны» в настройках интеграции, чтобы увидеть здесь аналитику.",
  analysis_not_enough_data: "Недостаточно данных для анализа.",
  analysis_not_enough_data_hint: "Для анализа Вейбулла требуется минимум 5 выполненных обслуживаний; сезонные паттерны становятся видны после 6+ точек данных в месяц.",
  analysis_manual_task_hint: "Ручные задачи без интервала не генерируют аналитику.",
  completions: "выполнений",
  current: "Текущий",
  shorter: "Короче",
  longer: "Длиннее",
  normal: "Нормальный",
  disabled: "Отключено",
  compound_logic: "Составная логика",
  // Card editor
  card_title: "Заголовок",
  card_show_header: "Показывать заголовок со статистикой",
  card_show_actions: "Показывать кнопки действий",
  card_compact: "Компактный режим",
  card_max_items: "Макс. элементов (0 = все)",
  // Consistency audit additions
  action_error: "Не удалось выполнить действие. Попробуйте ещё раз.",
  area_id_optional: "Зона (опционально)",
  installation_date_optional: "Дата установки (опционально)",
  custom_icon_optional: "Иконка (опционально, например mdi:wrench)",
  task_enabled: "Задача включена",
  skip_reason_prompt: "Пропустить эту задачу?",
  reason_optional: "Причина (опционально)",
  reset_date_prompt: "Сбросить эту задачу?",
  reset_date_optional: "Новая дата (опционально)",
  notes_label: "Примечания",
  documentation_label: "Документация",
  no_nfc_tag: "— Нет метки —",
  // Settings tab
  dashboard: "Панель",
  settings: "Настройки",
  settings_features: "Расширенные функции",
  settings_features_desc: "Включите или отключите расширенные функции. Отключение скрывает их из интерфейса, но не удаляет данные.",
  feat_adaptive: "Адаптивное планирование",
  feat_adaptive_desc: "Изучать оптимальные интервалы из истории обслуживания",
  feat_predictions: "Предсказания по датчикам",
  feat_predictions_desc: "Предсказывать даты срабатывания по деградации датчика",
  feat_seasonal: "Сезонные корректировки",
  feat_seasonal_desc: "Корректировать интервалы на основе сезонных паттернов",
  feat_environmental: "Экологическая корреляция",
  feat_environmental_desc: "Связывать интервалы с температурой/влажностью",
  feat_budget: "Отслеживание бюджета",
  feat_budget_desc: "Отслеживать месячные и годовые расходы на обслуживание",
  feat_groups: "Группы задач",
  feat_groups_desc: "Организовывать задачи в логические группы",
  feat_checklists: "Контрольные списки",
  feat_checklists_desc: "Многошаговые процедуры для выполнения задачи",
  settings_general: "Основные",
  settings_default_warning: "Дни предупреждения по умолчанию",
  settings_panel_enabled: "Боковая панель",
  settings_notifications: "Уведомления",
  settings_notify_service: "Сервис уведомлений",
  settings_notify_due_soon: "Уведомлять, когда срок скоро истекает",
  settings_notify_overdue: "Уведомлять при просрочке",
  settings_notify_triggered: "Уведомлять при срабатывании",
  settings_interval_hours: "Интервал повторения (часы, 0 = один раз)",
  settings_quiet_hours: "Часы тишины",
  settings_quiet_start: "Начало",
  settings_quiet_end: "Конец",
  settings_max_per_day: "Макс. уведомлений в день (0 = без ограничений)",
  settings_bundling: "Группировать уведомления",
  settings_bundle_threshold: "Порог группировки",
  settings_actions: "Кнопки действий в мобильном приложении",
  settings_action_complete: "Показывать кнопку «Выполнить»",
  settings_action_skip: "Показывать кнопку «Пропустить»",
  settings_action_snooze: "Показывать кнопку «Отложить»",
  settings_snooze_hours: "Длительность откладывания (часы)",
  settings_budget: "Бюджет",
  settings_currency: "Валюта",
  settings_budget_monthly: "Месячный бюджет",
  settings_budget_yearly: "Годовой бюджет",
  settings_budget_alerts: "Оповещения о бюджете",
  settings_budget_threshold: "Порог оповещения (%)",
  settings_import_export: "Импорт / Экспорт",
  settings_export_json: "Экспорт JSON",
  settings_export_csv: "Экспорт CSV",
  settings_import_csv: "Импорт CSV",
  settings_import_placeholder: "Вставьте содержимое JSON или CSV здесь\u2026",
  settings_import_btn: "Импортировать",
  settings_import_success: "Импортировано объектов: {count}.",
  settings_export_success: "Экспорт загружен.",
  settings_saved: "Настройка сохранена.",
  settings_include_history: "Включать историю",
};

const TRANSLATIONS: Record<string, Translations> = { de: DE, en: EN, nl: NL, fr: FR, it: IT, es: ES, pt: PT, ru: RU };

/** Get a localized string. Falls back to English, then to key. */
export function t(key: string, lang?: string): string {
  const l = (lang || "en").substring(0, 2).toLowerCase();
  return TRANSLATIONS[l]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

/** Map language prefix to BCP-47 locale for date formatting. */
function langToLocale(lang?: string): string {
  const l = (lang || "en").substring(0, 2).toLowerCase();
  const map: Record<string, string> = {
    de: "de-DE", en: "en-US", nl: "nl-NL", fr: "fr-FR", it: "it-IT", es: "es-ES", pt: "pt-PT",
  };
  return map[l] ?? "en-US";
}

/** Format a date string (ISO) in the user's locale.
 *  Appends T00:00:00 to date-only strings so JS parses them as local time, not UTC. */
export function formatDate(iso: string | null | undefined, lang?: string): string {
  if (!iso) return "—";
  try {
    const local = iso.includes("T") ? iso : iso + "T00:00:00";
    return new Date(local).toLocaleDateString(langToLocale(lang), { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
}

/** Format a datetime string (ISO) in the user's locale. */
export function formatDateTime(iso: string | null | undefined, lang?: string): string {
  if (!iso) return "—";
  try {
    const locale = langToLocale(lang);
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

/** Dispatch HA native "More Info" dialog for an entity. */
export function fireMoreInfo(ev: Event, entityId: string) {
  (ev.currentTarget as HTMLElement).dispatchEvent(
    new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true,
    })
  );
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
  .stat-item.clickable { cursor: pointer; border-radius: 8px; padding: 4px 8px; transition: background 0.15s; }
  .stat-item.clickable:hover { background: var(--secondary-background-color); }

  .objects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
    padding: 16px 0;
  }
  .object-card {
    padding: 16px;
    background: var(--card-background-color);
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid var(--divider-color);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .object-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .object-card-header { display: flex; justify-content: space-between; align-items: center; }
  .object-card-name { font-weight: 500; font-size: 16px; }
  .object-card-count { color: var(--secondary-text-color); font-size: 13px; }
  .object-card-meta { color: var(--secondary-text-color); font-size: 13px; margin-top: 4px; }
  .object-card-empty { color: var(--warning-color); font-size: 13px; margin-top: 8px; font-style: italic; }

  .empty-state-centered { text-align: center; padding: 32px 16px; }
  .empty-state-centered ha-button { margin-top: 16px; }

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
    height: 200px;
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

  .entity-link {
    cursor: pointer;
    text-decoration: underline dotted;
    text-underline-offset: 2px;
  }
  .entity-link:hover {
    color: var(--primary-color);
    text-decoration: underline solid;
  }

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

  .task-disabled { opacity: 0.5; }
  .badge-disabled {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 8px;
    background: var(--disabled-color, #9e9e9e);
    color: white;
  }

  /* ── Shared responsive styles (panel + card) ── */
  @media (max-width: 600px) {
    .row-actions mwc-icon-button {
      --mdc-icon-button-size: 44px;
      --mdc-icon-size: 22px;
    }

    .due-cell { min-width: 70px; }

    .trigger-card { padding: 10px 12px; }
    .trigger-current { font-size: 22px; }

    .prediction-grid { flex-direction: column; gap: 8px; }

    .weibull-info-row { flex-direction: column; gap: 8px; }

    .budget-bars { flex-direction: column; }
    .budget-item { min-width: 0; }

    .group-card { min-width: 0; max-width: 100%; }

    .filter-chip { padding: 6px 12px; font-size: 13px; }

    .history-details { flex-wrap: wrap; gap: 6px; }

    .sparkline-container { max-width: 100%; overflow: hidden; }
    .sparkline-svg { height: 100px; }

    .stats-bar { gap: 8px; padding: 12px; }
    .stat-item { min-width: 60px; }
    .stat-value { font-size: 20px; }
  }
`;
