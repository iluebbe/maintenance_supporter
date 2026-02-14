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
  runtime: "Laufzeit",
  runtime_hours: "Ziel-Laufzeit (Stunden)",
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
  // User assignment
  responsible_user: "Verantwortlicher Benutzer",
  no_user_assigned: "(Kein Benutzer zugewiesen)",
  all_users: "Alle Benutzer",
  my_tasks: "Meine Aufgaben",
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
  runtime: "Runtime",
  runtime_hours: "Target runtime (hours)",
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
  // User assignment
  responsible_user: "Responsible User",
  no_user_assigned: "(No user assigned)",
  all_users: "All Users",
  my_tasks: "My Tasks",
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
  skip: "Overslaan",
  reset: "Resetten",
  cancel: "Annuleren",
  completing: "Wordt voltooid\u2026",
  type: "Type",
  schedule: "Planning",
  interval: "Interval",
  warning: "Waarschuwing",
  last_performed: "Laatst uitgevoerd",
  next_due: "Volgende keer",
  days_until_due: "Dagen tot vervaldatum",
  times_performed: "Aantal keer uitgevoerd",
  total_cost: "Totale kosten",
  avg_duration: "\u00D8 Duur",
  trigger: "Trigger",
  entity: "Entiteit",
  attribute: "Attribuut",
  trigger_type: "Triggertype",
  active: "Actief",
  yes: "Ja",
  no: "Nee",
  current_value: "Huidige waarde",
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
  entity_min: "Minimum",
  entity_max: "Maximum",
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
  notes: "Notities",
  documentation: "Documentatie",
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
  value_history: "Waardegeschiedenis",
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
  edit_object: "Object bewerken",
  name: "Naam",
  manufacturer_optional: "Fabrikant (optioneel)",
  model_optional: "Model (optioneel)",
  trigger_configuration: "Triggerconfiguratie",
  entity_id: "Entiteits-ID",
  attribute_optional: "Attribuut (optioneel, leeg = status)",
  trigger_above: "Activeren als boven",
  trigger_below: "Activeren als onder",
  for_at_least_minutes: "Voor minstens (minuten)",
  safety_interval_days: "Veiligheidsinterval (dagen, optioneel)",
  delta_mode: "Deltamodus",
  from_state_optional: "Van status (optioneel)",
  to_state_optional: "Naar status (optioneel)",
  documentation_url_optional: "Documentatie-URL (optioneel)",
  responsible_user: "Verantwoordelijke gebruiker",
  no_user_assigned: "(Geen gebruiker toegewezen)",
  all_users: "Alle gebruikers",
  my_tasks: "Mijn taken",
  budget_monthly: "Maandbudget",
  budget_yearly: "Jaarbudget",
  export_csv: "CSV-export",
  import_csv: "CSV-import",
  groups: "Groepen",
  no_groups: "Geen groepen gedefinieerd.",
  group_tasks: "Taken",
  loading_chart: "Grafiekgegevens laden...",
  was_maintenance_needed: "Was dit onderhoud nodig?",
  feedback_needed: "Nodig",
  feedback_not_needed: "Niet nodig",
  feedback_not_sure: "Niet zeker",
  suggested_interval: "Voorgesteld interval",
  apply_suggestion: "Toepassen",
  dismiss_suggestion: "Negeren",
  adaptive_scheduling: "Adaptieve planning",
  confidence_low: "Laag",
  confidence_medium: "Gemiddeld",
  confidence_high: "Hoog",
  confidence: "Betrouwbaarheid",
  recommended: "aanbevolen",
  seasonal_awareness: "Seizoensbewustzijn",
  seasonal_factor: "Seizoensfactor",
  seasonal_chart_title: "Seizoensfactoren",
  seasonal_learned: "Geleerd",
  seasonal_manual: "Handmatig",
  seasonal_insufficient_data: "Onvoldoende gegevens",
  month_jan: "Jan", month_feb: "Feb", month_mar: "Mrt", month_apr: "Apr",
  month_may: "Mei", month_jun: "Jun", month_jul: "Jul", month_aug: "Aug",
  month_sep: "Sep", month_oct: "Okt", month_nov: "Nov", month_dec: "Dec",
  hemisphere_north: "Noordelijk",
  hemisphere_south: "Zuidelijk",
  seasonal_factor_short: "Seizoen",
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
  prediction_projection: "Projectie",
  weibull_reliability_curve: "Betrouwbaarheidscurve",
  weibull_failure_probability: "Faalkans",
  weibull_reliability: "Betrouwbaarheid",
  weibull_beta_param: "Vorm \u03B2",
  weibull_eta_param: "Schaal \u03B7",
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
  reliability_at_current: "Betrouwbaarheid bij huidig interval",
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
  qr_print: "Afdrukken",
  qr_download: "SVG downloaden",
  qr_action: "Actie bij scannen",
  qr_action_view: "Onderhoudsinfo bekijken",
  qr_action_complete: "Onderhoud als voltooid markeren",
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
  skip: "Passer",
  reset: "R\u00E9initialiser",
  cancel: "Annuler",
  completing: "En cours\u2026",
  type: "Type",
  schedule: "Planification",
  interval: "Intervalle",
  warning: "Avertissement",
  last_performed: "Derni\u00E8re ex\u00E9cution",
  next_due: "Prochaine \u00E9ch\u00E9ance",
  days_until_due: "Jours restants",
  times_performed: "Nombre d\u0027ex\u00E9cutions",
  total_cost: "Co\u00FBt total",
  avg_duration: "\u00D8 Dur\u00E9e",
  trigger: "D\u00E9clencheur",
  entity: "Entit\u00E9",
  attribute: "Attribut",
  trigger_type: "Type de d\u00E9clencheur",
  active: "Actif",
  yes: "Oui",
  no: "Non",
  current_value: "Valeur actuelle",
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
  entity_min: "Minimum",
  entity_max: "Maximum",
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
  notes: "Notes",
  documentation: "Documentation",
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
  value_history: "Historique des valeurs",
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
  edit_object: "Modifier l\u0027objet",
  name: "Nom",
  manufacturer_optional: "Fabricant (optionnel)",
  model_optional: "Mod\u00E8le (optionnel)",
  trigger_configuration: "Configuration du d\u00E9clencheur",
  entity_id: "ID d\u0027entit\u00E9",
  attribute_optional: "Attribut (optionnel, vide = \u00E9tat)",
  trigger_above: "D\u00E9clencher au-dessus de",
  trigger_below: "D\u00E9clencher en dessous de",
  for_at_least_minutes: "Pendant au moins (minutes)",
  safety_interval_days: "Intervalle de s\u00E9curit\u00E9 (jours, optionnel)",
  delta_mode: "Mode delta",
  from_state_optional: "\u00C9tat source (optionnel)",
  to_state_optional: "\u00C9tat cible (optionnel)",
  documentation_url_optional: "URL de documentation (optionnel)",
  responsible_user: "Utilisateur responsable",
  no_user_assigned: "(Aucun utilisateur assign\u00E9)",
  all_users: "Tous les utilisateurs",
  my_tasks: "Mes t\u00E2ches",
  budget_monthly: "Budget mensuel",
  budget_yearly: "Budget annuel",
  export_csv: "Export CSV",
  import_csv: "Import CSV",
  groups: "Groupes",
  no_groups: "Aucun groupe d\u00E9fini.",
  group_tasks: "T\u00E2ches",
  loading_chart: "Chargement des donn\u00E9es...",
  was_maintenance_needed: "Cette maintenance \u00E9tait-elle n\u00E9cessaire ?",
  feedback_needed: "N\u00E9cessaire",
  feedback_not_needed: "Pas n\u00E9cessaire",
  feedback_not_sure: "Pas s\u00FBr",
  suggested_interval: "Intervalle sugg\u00E9r\u00E9",
  apply_suggestion: "Appliquer",
  dismiss_suggestion: "Ignorer",
  adaptive_scheduling: "Planification adaptative",
  confidence_low: "Faible",
  confidence_medium: "Moyen",
  confidence_high: "\u00C9lev\u00E9",
  confidence: "Confiance",
  recommended: "recommand\u00E9",
  seasonal_awareness: "Conscience saisonni\u00E8re",
  seasonal_factor: "Facteur saisonnier",
  seasonal_chart_title: "Facteurs saisonniers",
  seasonal_learned: "Appris",
  seasonal_manual: "Manuel",
  seasonal_insufficient_data: "Donn\u00E9es insuffisantes",
  month_jan: "Jan", month_feb: "F\u00E9v", month_mar: "Mar", month_apr: "Avr",
  month_may: "Mai", month_jun: "Juin", month_jul: "Juil", month_aug: "Ao\u00FB",
  month_sep: "Sep", month_oct: "Oct", month_nov: "Nov", month_dec: "D\u00E9c",
  hemisphere_north: "Nord",
  hemisphere_south: "Sud",
  seasonal_factor_short: "Saison",
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
  prediction_projection: "Projection",
  weibull_reliability_curve: "Courbe de fiabilit\u00E9",
  weibull_failure_probability: "Probabilit\u00E9 de d\u00E9faillance",
  weibull_reliability: "Fiabilit\u00E9",
  weibull_beta_param: "Forme \u03B2",
  weibull_eta_param: "\u00C9chelle \u03B7",
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
  reliability_at_current: "Fiabilit\u00E9 \u00E0 l\u0027intervalle actuel",
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
  qr_print: "Imprimer",
  qr_download: "T\u00E9l\u00E9charger SVG",
  qr_action: "Action au scan",
  qr_action_view: "Afficher les infos de maintenance",
  qr_action_complete: "Marquer la maintenance comme termin\u00E9e",
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
  skip: "Salta",
  reset: "Reimposta",
  cancel: "Annulla",
  completing: "Completamento\u2026",
  type: "Tipo",
  schedule: "Pianificazione",
  interval: "Intervallo",
  warning: "Avviso",
  last_performed: "Ultima esecuzione",
  next_due: "Prossima scadenza",
  days_until_due: "Giorni alla scadenza",
  times_performed: "Esecuzioni",
  total_cost: "Costo totale",
  avg_duration: "\u00D8 Durata",
  trigger: "Trigger",
  entity: "Entit\u00E0",
  attribute: "Attributo",
  trigger_type: "Tipo di trigger",
  active: "Attivo",
  yes: "S\u00EC",
  no: "No",
  current_value: "Valore attuale",
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
  entity_min: "Minimo",
  entity_max: "Massimo",
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
  notes: "Note",
  documentation: "Documentazione",
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
  value_history: "Cronologia valori",
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
  edit_object: "Modifica oggetto",
  name: "Nome",
  manufacturer_optional: "Produttore (opzionale)",
  model_optional: "Modello (opzionale)",
  trigger_configuration: "Configurazione trigger",
  entity_id: "ID entit\u00E0",
  attribute_optional: "Attributo (opzionale, vuoto = stato)",
  trigger_above: "Attivare sopra",
  trigger_below: "Attivare sotto",
  for_at_least_minutes: "Per almeno (minuti)",
  safety_interval_days: "Intervallo di sicurezza (giorni, opzionale)",
  delta_mode: "Modalit\u00E0 delta",
  from_state_optional: "Dallo stato (opzionale)",
  to_state_optional: "Allo stato (opzionale)",
  documentation_url_optional: "URL documentazione (opzionale)",
  responsible_user: "Utente responsabile",
  no_user_assigned: "(Nessun utente assegnato)",
  all_users: "Tutti gli utenti",
  my_tasks: "Le mie attivit\u00E0",
  budget_monthly: "Budget mensile",
  budget_yearly: "Budget annuale",
  export_csv: "Esporta CSV",
  import_csv: "Importa CSV",
  groups: "Gruppi",
  no_groups: "Nessun gruppo definito.",
  group_tasks: "Attivit\u00E0",
  loading_chart: "Caricamento dati...",
  was_maintenance_needed: "Questa manutenzione era necessaria?",
  feedback_needed: "Necessaria",
  feedback_not_needed: "Non necessaria",
  feedback_not_sure: "Non sicuro",
  suggested_interval: "Intervallo suggerito",
  apply_suggestion: "Applica",
  dismiss_suggestion: "Ignora",
  adaptive_scheduling: "Pianificazione adattiva",
  confidence_low: "Bassa",
  confidence_medium: "Media",
  confidence_high: "Alta",
  confidence: "Affidabilit\u00E0",
  recommended: "consigliato",
  seasonal_awareness: "Consapevolezza stagionale",
  seasonal_factor: "Fattore stagionale",
  seasonal_chart_title: "Fattori stagionali",
  seasonal_learned: "Appreso",
  seasonal_manual: "Manuale",
  seasonal_insufficient_data: "Dati insufficienti",
  month_jan: "Gen", month_feb: "Feb", month_mar: "Mar", month_apr: "Apr",
  month_may: "Mag", month_jun: "Giu", month_jul: "Lug", month_aug: "Ago",
  month_sep: "Set", month_oct: "Ott", month_nov: "Nov", month_dec: "Dic",
  hemisphere_north: "Nord",
  hemisphere_south: "Sud",
  seasonal_factor_short: "Stagione",
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
  prediction_projection: "Proiezione",
  weibull_reliability_curve: "Curva di affidabilit\u00E0",
  weibull_failure_probability: "Probabilit\u00E0 di guasto",
  weibull_reliability: "Affidabilit\u00E0",
  weibull_beta_param: "Forma \u03B2",
  weibull_eta_param: "Scala \u03B7",
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
  reliability_at_current: "Affidabilit\u00E0 all\u0027intervallo attuale",
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
  qr_print: "Stampa",
  qr_download: "Scarica SVG",
  qr_action: "Azione alla scansione",
  qr_action_view: "Visualizza info manutenzione",
  qr_action_complete: "Segna manutenzione come completata",
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
  skip: "Omitir",
  reset: "Restablecer",
  cancel: "Cancelar",
  completing: "Completando\u2026",
  type: "Tipo",
  schedule: "Planificaci\u00F3n",
  interval: "Intervalo",
  warning: "Aviso",
  last_performed: "\u00DAltima ejecuci\u00F3n",
  next_due: "Pr\u00F3ximo vencimiento",
  days_until_due: "D\u00EDas hasta vencimiento",
  times_performed: "Ejecuciones",
  total_cost: "Coste total",
  avg_duration: "\u00D8 Duraci\u00F3n",
  trigger: "Disparador",
  entity: "Entidad",
  attribute: "Atributo",
  trigger_type: "Tipo de disparador",
  active: "Activo",
  yes: "S\u00ED",
  no: "No",
  current_value: "Valor actual",
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
  entity_min: "M\u00EDnimo",
  entity_max: "M\u00E1ximo",
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
  notes: "Notas",
  documentation: "Documentaci\u00F3n",
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
  value_history: "Historial de valores",
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
  edit_object: "Editar objeto",
  name: "Nombre",
  manufacturer_optional: "Fabricante (opcional)",
  model_optional: "Modelo (opcional)",
  trigger_configuration: "Configuraci\u00F3n del disparador",
  entity_id: "ID de entidad",
  attribute_optional: "Atributo (opcional, vac\u00EDo = estado)",
  trigger_above: "Activar por encima de",
  trigger_below: "Activar por debajo de",
  for_at_least_minutes: "Durante al menos (minutos)",
  safety_interval_days: "Intervalo de seguridad (d\u00EDas, opcional)",
  delta_mode: "Modo delta",
  from_state_optional: "Desde estado (opcional)",
  to_state_optional: "Hasta estado (opcional)",
  documentation_url_optional: "URL de documentaci\u00F3n (opcional)",
  responsible_user: "Usuario responsable",
  no_user_assigned: "(Ning\u00FAn usuario asignado)",
  all_users: "Todos los usuarios",
  my_tasks: "Mis tareas",
  budget_monthly: "Presupuesto mensual",
  budget_yearly: "Presupuesto anual",
  export_csv: "Exportar CSV",
  import_csv: "Importar CSV",
  groups: "Grupos",
  no_groups: "No hay grupos definidos.",
  group_tasks: "Tareas",
  loading_chart: "Cargando datos...",
  was_maintenance_needed: "\u00BFEra necesario este mantenimiento?",
  feedback_needed: "Necesario",
  feedback_not_needed: "No necesario",
  feedback_not_sure: "No seguro",
  suggested_interval: "Intervalo sugerido",
  apply_suggestion: "Aplicar",
  dismiss_suggestion: "Descartar",
  adaptive_scheduling: "Planificaci\u00F3n adaptativa",
  confidence_low: "Baja",
  confidence_medium: "Media",
  confidence_high: "Alta",
  confidence: "Confianza",
  recommended: "recomendado",
  seasonal_awareness: "Conciencia estacional",
  seasonal_factor: "Factor estacional",
  seasonal_chart_title: "Factores estacionales",
  seasonal_learned: "Aprendido",
  seasonal_manual: "Manual",
  seasonal_insufficient_data: "Datos insuficientes",
  month_jan: "Ene", month_feb: "Feb", month_mar: "Mar", month_apr: "Abr",
  month_may: "May", month_jun: "Jun", month_jul: "Jul", month_aug: "Ago",
  month_sep: "Sep", month_oct: "Oct", month_nov: "Nov", month_dec: "Dic",
  hemisphere_north: "Norte",
  hemisphere_south: "Sur",
  seasonal_factor_short: "Estaci\u00F3n",
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
  prediction_projection: "Proyecci\u00F3n",
  weibull_reliability_curve: "Curva de fiabilidad",
  weibull_failure_probability: "Probabilidad de fallo",
  weibull_reliability: "Fiabilidad",
  weibull_beta_param: "Forma \u03B2",
  weibull_eta_param: "Escala \u03B7",
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
  reliability_at_current: "Fiabilidad en el intervalo actual",
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
  qr_print: "Imprimir",
  qr_download: "Descargar SVG",
  qr_action: "Acci\u00F3n al escanear",
  qr_action_view: "Ver info de mantenimiento",
  qr_action_complete: "Marcar mantenimiento como completado",
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
};

const TRANSLATIONS: Record<string, Translations> = { de: DE, en: EN, nl: NL, fr: FR, it: IT, es: ES };

/** Get a localized string. Falls back to English, then to key. */
export function t(key: string, lang?: string): string {
  const l = (lang || "en").substring(0, 2).toLowerCase();
  return TRANSLATIONS[l]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

/** Map language prefix to BCP-47 locale for date formatting. */
function langToLocale(lang?: string): string {
  const l = (lang || "de").substring(0, 2).toLowerCase();
  const map: Record<string, string> = {
    de: "de-DE", en: "en-US", nl: "nl-NL", fr: "fr-FR", it: "it-IT", es: "es-ES",
  };
  return map[l] ?? "en-US";
}

/** Format a date string (ISO) in the user's locale. */
export function formatDate(iso: string | null | undefined, lang?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(langToLocale(lang), { day: "2-digit", month: "2-digit", year: "numeric" });
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
