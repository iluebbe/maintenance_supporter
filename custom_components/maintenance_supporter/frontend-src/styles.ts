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
  checklist_steps_optional: "Checkliste-Schritte (optional)",
  checklist_placeholder: "Filter reinigen\nDichtung ersetzen\nDruck testen",
  checklist_help: "Ein Schritt pro Zeile. Max. 100 Einträge.",
  err_too_long: "{field}: zu lang (max. {n} Zeichen)",
  err_too_short: "{field}: zu kurz (min. {n} Zeichen)",
  err_value_too_high: "{field}: zu groß (max. {n})",
  err_value_too_low: "{field}: zu klein (min. {n})",
  err_required: "{field}: Pflichtfeld",
  err_wrong_type: "{field}: falscher Typ (erwartet: {type})",
  err_invalid_choice: "{field}: nicht erlaubter Wert",
  err_invalid_value: "{field}: ungültiger Wert",
  feat_schedule_time: "Uhrzeit-Scheduling",
  feat_schedule_time_desc: "Tasks werden zu einer festen Uhrzeit fällig statt um Mitternacht.",
  schedule_time_optional: "Fällig um (optional, HH:MM)",
  schedule_time_help: "Leer = Mitternacht (Default). HA-Zeitzone.",
  at_time: "um",
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
  environmental_entity_optional: "Umgebungs-Sensor (optional)",
  environmental_entity_helper: "z.B. sensor.aussentemperatur — passt das Intervall an Umgebungswerte an",
  environmental_attribute_optional: "Umgebungs-Attribut (optional)",
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
  new_group: "Neue Gruppe",
  edit_group: "Gruppe bearbeiten",
  no_groups: "Keine Gruppen vorhanden",
  delete_group: "Gruppe löschen",
  delete_group_confirm: "Gruppe '{name}' wirklich löschen?",
  group_select_tasks: "Aufgaben auswählen",
  group_name_required: "Name erforderlich",
  description_optional: "Beschreibung (optional)",
  selected: "Ausgewählt",
  loading_chart: "Daten werden geladen...",
  // Adaptive scheduling
  was_maintenance_needed: "War diese Wartung nötig?",
  feedback_needed: "Nötig",
  feedback_not_needed: "Nicht nötig",
  feedback_not_sure: "Unsicher",
  suggested_interval: "Empfohlenes Intervall",
  apply_suggestion: "Übernehmen",
  reanalyze: "Neu analysieren",
  reanalyze_result: "Neue Analyse",
  reanalyze_insufficient_data: "Nicht genügend Daten für eine Empfehlung",
  data_points: "Datenpunkte",
  dismiss_suggestion: "Verwerfen",
  confidence_low: "Niedrig",
  confidence_medium: "Mittel",
  confidence_high: "Hoch",
  recommended: "empfohlen",
  // Seasonal scheduling
  seasonal_awareness: "Saisonale Anpassung",
  edit_seasonal_overrides: "Saison-Faktoren bearbeiten",
  seasonal_overrides_title: "Saisonale Faktoren (Override)",
  seasonal_overrides_hint: "Faktor pro Monat (0.1–5.0). Leer = automatisch gelernt.",
  seasonal_override_invalid: "Ungültiger Wert",
  seasonal_override_range: "Faktor muss zwischen 0.1 und 5.0 liegen",
  clear_all: "Alle zurücksetzen",
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
  card_filter_status: "Nach Status filtern",
  card_filter_status_help: "Leer = alle Status zeigen.",
  card_filter_objects: "Nach Objekten filtern",
  card_filter_objects_help: "Leer = alle Objekte zeigen.",
  card_filter_entities: "Nach Entitäten filtern (entity_ids)",
  card_filter_entities_help: "Wähle Sensor-/Binary-Sensor-Entitäten dieser Integration. Leer = alle.",
  card_loading_objects: "Lade Objekte\u2026",
  no_objects: "Keine Objekte vorhanden.",
  // Consistency audit additions
  action_error: "Aktion fehlgeschlagen. Bitte erneut versuchen.",
  area_id_optional: "Bereich (optional)",
  installation_date_optional: "Installationsdatum (optional)",
  custom_icon_optional: "Icon (optional, z.B. mdi:wrench)",
  task_enabled: "Aufgabe aktiviert",
  skip_reason_prompt: "Aufgabe überspringen?",
  reason_optional: "Grund (optional)",
  reset_date_prompt: "Aufgabe als ausgeführt markieren?",
  reset_date_optional: "Letztes Erledigungs-Datum (optional, Standard: heute)",
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
  test_notification: "Test-Benachrichtigung",
  send_test: "Test senden",
  testing: "Sende…",
  test_notification_success: "Test-Benachrichtigung gesendet",
  test_notification_failed: "Test-Benachrichtigung fehlgeschlagen",
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
  // 1.0.44 — sort + group-by + operator mode
  sort_alphabetical: "Alphabetisch",
  sort_due_soonest: "Frühestens fällig",
  sort_task_count: "Aufgaben-Anzahl",
  sort_area: "Bereich",
  sort_assigned_user: "Verantwortlicher",
  sort_group: "Gruppe",
  groupby_none: "Keine Gruppierung",
  groupby_area: "Nach Bereich",
  groupby_group: "Nach Gruppe",
  groupby_user: "Nach Verantwortlichem",
  unassigned: "Nicht zugewiesen",
  no_area: "Kein Bereich",
  has_overdue: "Überfällige Aufgaben",
  object: "Objekt",
  // Panel access (operator override)
  settings_panel_access: "Panel-Zugriff",
  settings_panel_access_desc: "Admins sehen immer das vollständige Panel. Wähle hier Non-Admin-User aus, die ebenfalls Vollzugriff bekommen sollen — alle anderen Non-Admins sehen nur Abhaken/Überspringen.",
  no_non_admin_users: "Keine Non-Admin-User gefunden. Lege welche unter Einstellungen → Personen an.",
  owner_label: "Owner",
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
  checklist_steps_optional: "Checklist steps (optional)",
  checklist_placeholder: "Clean filter\nReplace seal\nTest pressure",
  checklist_help: "One step per line. Max 100 items.",
  err_too_long: "{field}: too long (max {n} characters)",
  err_too_short: "{field}: too short (min {n} characters)",
  err_value_too_high: "{field}: too large (max {n})",
  err_value_too_low: "{field}: too small (min {n})",
  err_required: "{field}: required",
  err_wrong_type: "{field}: wrong type (expected: {type})",
  err_invalid_choice: "{field}: not an allowed value",
  err_invalid_value: "{field}: invalid value",
  feat_schedule_time: "Time-of-day scheduling",
  feat_schedule_time_desc: "Tasks become overdue at a specific time of day instead of midnight.",
  schedule_time_optional: "Due at time (optional, HH:MM)",
  schedule_time_help: "Empty = midnight (default). HA timezone.",
  at_time: "at",
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
  environmental_entity_optional: "Environmental sensor (optional)",
  environmental_entity_helper: "e.g. sensor.outdoor_temperature — adjusts the interval based on environmental conditions",
  environmental_attribute_optional: "Environmental attribute (optional)",
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
  new_group: "New group",
  edit_group: "Edit group",
  no_groups: "No groups yet",
  delete_group: "Delete group",
  delete_group_confirm: "Delete group '{name}'?",
  group_select_tasks: "Select tasks",
  group_name_required: "Name is required",
  description_optional: "Description (optional)",
  selected: "Selected",
  loading_chart: "Loading chart data...",
  // Adaptive scheduling
  was_maintenance_needed: "Was this maintenance needed?",
  feedback_needed: "Needed",
  feedback_not_needed: "Not needed",
  feedback_not_sure: "Not sure",
  suggested_interval: "Suggested interval",
  apply_suggestion: "Apply",
  reanalyze: "Re-analyze",
  reanalyze_result: "New analysis",
  reanalyze_insufficient_data: "Not enough data to produce a recommendation",
  data_points: "data points",
  dismiss_suggestion: "Dismiss",
  confidence_low: "Low",
  confidence_medium: "Medium",
  confidence_high: "High",
  recommended: "recommended",
  // Seasonal scheduling
  seasonal_awareness: "Seasonal Awareness",
  edit_seasonal_overrides: "Edit seasonal factors",
  seasonal_overrides_title: "Seasonal factors (override)",
  seasonal_overrides_hint: "Factor per month (0.1–5.0). Empty = learned automatically.",
  seasonal_override_invalid: "Invalid value",
  seasonal_override_range: "Factor must be between 0.1 and 5.0",
  clear_all: "Clear all",
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
  card_filter_status: "Filter by status",
  card_filter_status_help: "Empty = show all statuses.",
  card_filter_objects: "Filter by objects",
  card_filter_objects_help: "Empty = show all objects.",
  card_filter_entities: "Filter by entities (entity_ids)",
  card_filter_entities_help: "Pick sensor / binary_sensor entities from this integration. Empty = all.",
  card_loading_objects: "Loading objects\u2026",
  no_objects: "No objects yet.",
  // Consistency audit additions
  action_error: "Action failed. Please try again.",
  area_id_optional: "Area (optional)",
  installation_date_optional: "Installation date (optional)",
  custom_icon_optional: "Icon (optional, e.g. mdi:wrench)",
  task_enabled: "Task enabled",
  skip_reason_prompt: "Skip this task?",
  reason_optional: "Reason (optional)",
  reset_date_prompt: "Mark task as performed?",
  reset_date_optional: "Last performed date (optional, defaults to today)",
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
  test_notification: "Test notification",
  send_test: "Send test",
  testing: "Sending…",
  test_notification_success: "Test notification sent",
  test_notification_failed: "Test notification failed",
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
  // 1.0.44 — sort + group-by + operator mode
  sort_alphabetical: "Alphabetical",
  sort_due_soonest: "Due soonest",
  sort_task_count: "Task count",
  sort_area: "Area",
  sort_assigned_user: "Assigned user",
  sort_group: "Group",
  groupby_none: "No grouping",
  groupby_area: "By area",
  groupby_group: "By group",
  groupby_user: "By user",
  unassigned: "Unassigned",
  no_area: "No area",
  has_overdue: "Has overdue tasks",
  object: "Object",
  // Panel access (operator override)
  settings_panel_access: "Panel access",
  settings_panel_access_desc: "Admins always see the full panel. Pick non-admin users below who should also get full panel access — every other non-admin sees only Complete and Skip.",
  no_non_admin_users: "No non-admin users found. Add some in Settings → People.",
  owner_label: "Owner",
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
  checklist_steps_optional: "Checklist-stappen (optioneel)",
  checklist_placeholder: "Filter schoonmaken\nPakking vervangen\nDruk testen",
  checklist_help: "Eén stap per regel. Max. 100 items.",
  err_too_long: "{field}: te lang (max. {n} tekens)",
  err_too_short: "{field}: te kort (min. {n} tekens)",
  err_value_too_high: "{field}: te groot (max. {n})",
  err_value_too_low: "{field}: te klein (min. {n})",
  err_required: "{field}: verplicht",
  err_wrong_type: "{field}: verkeerd type (verwacht: {type})",
  err_invalid_choice: "{field}: niet-toegestane waarde",
  err_invalid_value: "{field}: ongeldige waarde",
  feat_schedule_time: "Tijd-van-dag-planning",
  feat_schedule_time_desc: "Taken vervallen op een specifieke tijd in plaats van middernacht.",
  schedule_time_optional: "Vervaldagstijd (optioneel, HH:MM)",
  schedule_time_help: "Leeg = middernacht (standaard). HA-tijdzone.",
  at_time: "om",
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
  environmental_entity_optional: "Omgevingssensor (optioneel)",
  environmental_entity_helper: "bv. sensor.buitentemperatuur — past het interval aan op basis van omgevingswaarden",
  environmental_attribute_optional: "Omgevingsattribuut (optioneel)",
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
  new_group: "Nieuwe groep",
  edit_group: "Groep bewerken",
  no_groups: "Nog geen groepen",
  delete_group: "Groep verwijderen",
  delete_group_confirm: "Groep '{name}' verwijderen?",
  group_select_tasks: "Taken selecteren",
  group_name_required: "Naam vereist",
  description_optional: "Beschrijving (optioneel)",
  selected: "Geselecteerd",
  loading_chart: "Grafiekgegevens laden...",
  was_maintenance_needed: "Was dit onderhoud nodig?",
  feedback_needed: "Nodig",
  feedback_not_needed: "Niet nodig",
  feedback_not_sure: "Niet zeker",
  suggested_interval: "Voorgesteld interval",
  apply_suggestion: "Toepassen",
  reanalyze: "Opnieuw analyseren",
  reanalyze_result: "Nieuwe analyse",
  reanalyze_insufficient_data: "Onvoldoende gegevens voor een aanbeveling",
  data_points: "datapunten",
  dismiss_suggestion: "Negeren",
  confidence_low: "Laag",
  confidence_medium: "Gemiddeld",
  confidence_high: "Hoog",
  recommended: "aanbevolen",
  seasonal_awareness: "Seizoensbewustzijn",
  edit_seasonal_overrides: "Seizoensfactoren bewerken",
  seasonal_overrides_title: "Seizoensfactoren (override)",
  seasonal_overrides_hint: "Factor per maand (0.1–5.0). Leeg = automatisch geleerd.",
  seasonal_override_invalid: "Ongeldige waarde",
  seasonal_override_range: "Factor moet tussen 0.1 en 5.0 liggen",
  clear_all: "Alles wissen",
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
  card_filter_status: "Filteren op status",
  card_filter_status_help: "Leeg = alle statussen tonen.",
  card_filter_objects: "Filteren op objecten",
  card_filter_objects_help: "Leeg = alle objecten tonen.",
  card_filter_entities: "Filteren op entiteiten (entity_ids)",
  card_filter_entities_help: "Kies sensor/binary_sensor entiteiten van deze integratie. Leeg = alle.",
  card_loading_objects: "Objecten laden\u2026",
  no_objects: "Nog geen objecten.",
  action_error: "Actie mislukt. Probeer het opnieuw.",
  area_id_optional: "Gebied (optioneel)",
  installation_date_optional: "Installatiedatum (optioneel)",
  custom_icon_optional: "Icoon (optioneel, bijv. mdi:wrench)",
  task_enabled: "Taak ingeschakeld",
  skip_reason_prompt: "Deze taak overslaan?",
  reason_optional: "Reden (optioneel)",
  reset_date_prompt: "Taak markeren als uitgevoerd?",
  reset_date_optional: "Laatste uitvoeringsdatum (optioneel, standaard vandaag)",
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
  test_notification: "Testmelding",
  send_test: "Test versturen",
  testing: "Verzenden…",
  test_notification_success: "Testmelding verzonden",
  test_notification_failed: "Testmelding mislukt",
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
  // 1.0.44 — sort + group-by + operator mode
  sort_alphabetical: "Alfabetisch",
  sort_due_soonest: "Eerst vervallend",
  sort_task_count: "Aantal taken",
  sort_area: "Gebied",
  sort_assigned_user: "Toegewezen gebruiker",
  sort_group: "Groep",
  groupby_none: "Geen groepering",
  groupby_area: "Per gebied",
  groupby_group: "Per groep",
  groupby_user: "Per gebruiker",
  unassigned: "Niet toegewezen",
  no_area: "Geen gebied",
  has_overdue: "Heeft achterstallige taken",
  object: "Object",
  settings_panel_access: "Paneel-toegang",
  settings_panel_access_desc: "Admins zien altijd het volledige paneel. Kies hier niet-admin gebruikers die ook volledige toegang krijgen — andere niet-admins zien alleen Voltooien en Overslaan.",
  no_non_admin_users: "Geen niet-admin gebruikers gevonden. Voeg ze toe in Instellingen → Personen.",
  owner_label: "Eigenaar",
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
  checklist_steps_optional: "\u00C9tapes de la checklist (optionnel)",
  checklist_placeholder: "Nettoyer le filtre\nRemplacer le joint\nTester la pression",
  checklist_help: "Une \u00E9tape par ligne. Max 100 \u00E9l\u00E9ments.",
  err_too_long: "{field} : trop long (max {n} caract\u00E8res)",
  err_too_short: "{field} : trop court (min {n} caract\u00E8res)",
  err_value_too_high: "{field} : trop grand (max {n})",
  err_value_too_low: "{field} : trop petit (min {n})",
  err_required: "{field} : champ obligatoire",
  err_wrong_type: "{field} : mauvais type (attendu : {type})",
  err_invalid_choice: "{field} : valeur non autoris\u00E9e",
  err_invalid_value: "{field} : valeur invalide",
  feat_schedule_time: "Planification \u00E0 l'heure",
  feat_schedule_time_desc: "Les t\u00E2ches arrivent \u00E0 \u00E9ch\u00E9ance \u00E0 une heure pr\u00E9cise plut\u00F4t qu'\u00E0 minuit.",
  schedule_time_optional: "\u00C9ch\u00E9ance \u00E0 l'heure (optionnel, HH:MM)",
  schedule_time_help: "Vide = minuit (d\u00E9faut). Fuseau horaire HA.",
  at_time: "\u00E0",
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
  environmental_entity_optional: "Capteur d'environnement (optionnel)",
  environmental_entity_helper: "ex. sensor.temperature_exterieure — ajuste l'intervalle selon les conditions environnementales",
  environmental_attribute_optional: "Attribut d'environnement (optionnel)",
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
  new_group: "Nouveau groupe",
  edit_group: "Modifier le groupe",
  no_groups: "Aucun groupe pour l'instant",
  delete_group: "Supprimer le groupe",
  delete_group_confirm: "Supprimer le groupe '{name}' ?",
  group_select_tasks: "Sélectionner les tâches",
  group_name_required: "Nom requis",
  description_optional: "Description (optionnel)",
  selected: "Sélectionné",
  loading_chart: "Chargement des donn\u00E9es...",
  was_maintenance_needed: "Cette maintenance \u00E9tait-elle n\u00E9cessaire ?",
  feedback_needed: "N\u00E9cessaire",
  feedback_not_needed: "Pas n\u00E9cessaire",
  feedback_not_sure: "Pas s\u00FBr",
  suggested_interval: "Intervalle sugg\u00E9r\u00E9",
  apply_suggestion: "Appliquer",
  reanalyze: "Réanalyser",
  reanalyze_result: "Nouvelle analyse",
  reanalyze_insufficient_data: "Données insuffisantes pour une recommandation",
  data_points: "points de données",
  dismiss_suggestion: "Ignorer",
  confidence_low: "Faible",
  confidence_medium: "Moyen",
  confidence_high: "\u00C9lev\u00E9",
  recommended: "recommand\u00E9",
  seasonal_awareness: "Conscience saisonni\u00E8re",
  edit_seasonal_overrides: "Modifier les facteurs saisonniers",
  seasonal_overrides_title: "Facteurs saisonniers (override)",
  seasonal_overrides_hint: "Facteur par mois (0.1–5.0). Vide = appris automatiquement.",
  seasonal_override_invalid: "Valeur invalide",
  seasonal_override_range: "Le facteur doit \u00EAtre entre 0.1 et 5.0",
  clear_all: "Tout effacer",
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
  card_filter_status: "Filtrer par statut",
  card_filter_status_help: "Vide = afficher tous les statuts.",
  card_filter_objects: "Filtrer par objets",
  card_filter_objects_help: "Vide = afficher tous les objets.",
  card_filter_entities: "Filtrer par entit\u00E9s (entity_ids)",
  card_filter_entities_help: "Choisissez des entit\u00E9s sensor / binary_sensor de cette int\u00E9gration. Vide = toutes.",
  card_loading_objects: "Chargement des objets\u2026",
  no_objects: "Aucun objet pour l'instant.",
  action_error: "Action échouée. Veuillez réessayer.",
  area_id_optional: "Zone (optionnel)",
  installation_date_optional: "Date d'installation (optionnel)",
  custom_icon_optional: "Icône (optionnel, ex. mdi:wrench)",
  task_enabled: "Tâche activée",
  skip_reason_prompt: "Ignorer cette tâche ?",
  reason_optional: "Raison (optionnel)",
  reset_date_prompt: "Marquer la tâche comme effectuée ?",
  reset_date_optional: "Date de dernière exécution (optionnel, défaut : aujourd'hui)",
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
  test_notification: "Notification de test",
  send_test: "Envoyer le test",
  testing: "Envoi en cours…",
  test_notification_success: "Notification de test envoyée",
  test_notification_failed: "Échec de la notification de test",
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
  // 1.0.44 — sort + group-by + operator mode
  sort_alphabetical: "Alphab\u00E9tique",
  sort_due_soonest: "\u00C9ch\u00E9ance la plus proche",
  sort_task_count: "Nombre de t\u00E2ches",
  sort_area: "Zone",
  sort_assigned_user: "Utilisateur affect\u00E9",
  sort_group: "Groupe",
  groupby_none: "Aucun groupement",
  groupby_area: "Par zone",
  groupby_group: "Par groupe",
  groupby_user: "Par utilisateur",
  unassigned: "Non assign\u00E9",
  no_area: "Aucune zone",
  has_overdue: "T\u00E2ches en retard",
  object: "Objet",
  settings_panel_access: "Acc\u00E8s au panneau",
  settings_panel_access_desc: "Les administrateurs voient toujours le panneau complet. S\u00E9lectionnez ici les utilisateurs non administrateurs qui devraient aussi avoir l'acc\u00E8s complet — les autres ne voient que Terminer et Ignorer.",
  no_non_admin_users: "Aucun utilisateur non administrateur trouv\u00E9. Ajoutez-en dans Param\u00E8tres → Personnes.",
  owner_label: "Propri\u00E9taire",
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
  checklist_steps_optional: "Passaggi della checklist (opzionale)",
  checklist_placeholder: "Pulire il filtro\nSostituire la guarnizione\nTestare la pressione",
  checklist_help: "Un passaggio per riga. Max 100 elementi.",
  err_too_long: "{field}: troppo lungo (max {n} caratteri)",
  err_too_short: "{field}: troppo corto (min {n} caratteri)",
  err_value_too_high: "{field}: troppo grande (max {n})",
  err_value_too_low: "{field}: troppo piccolo (min {n})",
  err_required: "{field}: campo obbligatorio",
  err_wrong_type: "{field}: tipo errato (atteso: {type})",
  err_invalid_choice: "{field}: valore non consentito",
  err_invalid_value: "{field}: valore non valido",
  feat_schedule_time: "Pianificazione oraria",
  feat_schedule_time_desc: "Le attivit\u00E0 scadono a un'ora specifica anzich\u00E9 a mezzanotte.",
  schedule_time_optional: "Scadenza all'ora (opzionale, HH:MM)",
  schedule_time_help: "Vuoto = mezzanotte (default). Fuso orario HA.",
  at_time: "alle",
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
  environmental_entity_optional: "Sensore ambientale (opzionale)",
  environmental_entity_helper: "es. sensor.temperatura_esterna — regola l'intervallo in base alle condizioni ambientali",
  environmental_attribute_optional: "Attributo ambientale (opzionale)",
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
  new_group: "Nuovo gruppo",
  edit_group: "Modifica gruppo",
  no_groups: "Nessun gruppo",
  delete_group: "Elimina gruppo",
  delete_group_confirm: "Eliminare il gruppo '{name}'?",
  group_select_tasks: "Seleziona attività",
  group_name_required: "Nome richiesto",
  description_optional: "Descrizione (opzionale)",
  selected: "Selezionato",
  loading_chart: "Caricamento dati...",
  was_maintenance_needed: "Questa manutenzione era necessaria?",
  feedback_needed: "Necessaria",
  feedback_not_needed: "Non necessaria",
  feedback_not_sure: "Non sicuro",
  suggested_interval: "Intervallo suggerito",
  apply_suggestion: "Applica",
  reanalyze: "Rianalizza",
  reanalyze_result: "Nuova analisi",
  reanalyze_insufficient_data: "Dati insufficienti per una raccomandazione",
  data_points: "punti dati",
  dismiss_suggestion: "Ignora",
  confidence_low: "Bassa",
  confidence_medium: "Media",
  confidence_high: "Alta",
  recommended: "consigliato",
  seasonal_awareness: "Consapevolezza stagionale",
  edit_seasonal_overrides: "Modifica fattori stagionali",
  seasonal_overrides_title: "Fattori stagionali (override)",
  seasonal_overrides_hint: "Fattore per mese (0.1–5.0). Vuoto = appreso automaticamente.",
  seasonal_override_invalid: "Valore non valido",
  seasonal_override_range: "Il fattore deve essere tra 0.1 e 5.0",
  clear_all: "Cancella tutto",
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
  card_filter_status: "Filtra per stato",
  card_filter_status_help: "Vuoto = mostra tutti gli stati.",
  card_filter_objects: "Filtra per oggetti",
  card_filter_objects_help: "Vuoto = mostra tutti gli oggetti.",
  card_filter_entities: "Filtra per entit\u00E0 (entity_ids)",
  card_filter_entities_help: "Seleziona entit\u00E0 sensor / binary_sensor da questa integrazione. Vuoto = tutte.",
  card_loading_objects: "Caricamento oggetti\u2026",
  no_objects: "Nessun oggetto ancora.",
  action_error: "Azione fallita. Riprova.",
  area_id_optional: "Area (opzionale)",
  installation_date_optional: "Data di installazione (opzionale)",
  custom_icon_optional: "Icona (opzionale, es. mdi:wrench)",
  task_enabled: "Attività abilitata",
  skip_reason_prompt: "Saltare questa attività?",
  reason_optional: "Motivo (opzionale)",
  reset_date_prompt: "Segnare l'attività come eseguita?",
  reset_date_optional: "Data ultima esecuzione (opzionale, predefinito: oggi)",
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
  test_notification: "Notifica di test",
  send_test: "Invia test",
  testing: "Invio in corso…",
  test_notification_success: "Notifica di test inviata",
  test_notification_failed: "Notifica di test non riuscita",
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
  // 1.0.44 — sort + group-by + operator mode
  sort_alphabetical: "Alfabetico",
  sort_due_soonest: "Scadenza pi\u00F9 vicina",
  sort_task_count: "Numero di attivit\u00E0",
  sort_area: "Area",
  sort_assigned_user: "Utente assegnato",
  sort_group: "Gruppo",
  groupby_none: "Nessun raggruppamento",
  groupby_area: "Per area",
  groupby_group: "Per gruppo",
  groupby_user: "Per utente",
  unassigned: "Non assegnato",
  no_area: "Nessuna area",
  has_overdue: "Attivit\u00E0 scadute",
  object: "Oggetto",
  settings_panel_access: "Accesso al pannello",
  settings_panel_access_desc: "Gli amministratori vedono sempre il pannello completo. Seleziona qui gli utenti non amministratori che dovrebbero anche avere accesso completo — gli altri vedono solo Completa e Salta.",
  no_non_admin_users: "Nessun utente non amministratore trovato. Aggiungili in Impostazioni → Persone.",
  owner_label: "Proprietario",
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
  checklist_steps_optional: "Pasos de la lista de verificaci\u00F3n (opcional)",
  checklist_placeholder: "Limpiar filtro\nReemplazar junta\nProbar presi\u00F3n",
  checklist_help: "Un paso por l\u00EDnea. M\u00E1x. 100 elementos.",
  err_too_long: "{field}: demasiado largo (m\u00E1x. {n} caracteres)",
  err_too_short: "{field}: demasiado corto (m\u00EDn. {n} caracteres)",
  err_value_too_high: "{field}: demasiado grande (m\u00E1x. {n})",
  err_value_too_low: "{field}: demasiado peque\u00F1o (m\u00EDn. {n})",
  err_required: "{field}: campo obligatorio",
  err_wrong_type: "{field}: tipo incorrecto (esperado: {type})",
  err_invalid_choice: "{field}: valor no permitido",
  err_invalid_value: "{field}: valor inv\u00E1lido",
  feat_schedule_time: "Programaci\u00F3n por hora",
  feat_schedule_time_desc: "Las tareas vencen a una hora espec\u00EDfica en lugar de medianoche.",
  schedule_time_optional: "Vence a las (opcional, HH:MM)",
  schedule_time_help: "Vac\u00EDo = medianoche (predeterminado). Zona horaria HA.",
  at_time: "a las",
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
  environmental_entity_optional: "Sensor ambiental (opcional)",
  environmental_entity_helper: "p.ej. sensor.temperatura_exterior — ajusta el intervalo segu\u0301n las condiciones ambientales",
  environmental_attribute_optional: "Atributo ambiental (opcional)",
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
  new_group: "Nuevo grupo",
  edit_group: "Editar grupo",
  no_groups: "Sin grupos todav\u00EDa",
  delete_group: "Eliminar grupo",
  delete_group_confirm: "\u00BFEliminar el grupo '{name}'?",
  group_select_tasks: "Seleccionar tareas",
  group_name_required: "Nombre requerido",
  description_optional: "Descripci\u00F3n (opcional)",
  selected: "Seleccionado",
  loading_chart: "Cargando datos...",
  was_maintenance_needed: "\u00BFEra necesario este mantenimiento?",
  feedback_needed: "Necesario",
  feedback_not_needed: "No necesario",
  feedback_not_sure: "No seguro",
  suggested_interval: "Intervalo sugerido",
  apply_suggestion: "Aplicar",
  reanalyze: "Reanalizar",
  reanalyze_result: "Nuevo an\u00E1lisis",
  reanalyze_insufficient_data: "Datos insuficientes para una recomendaci\u00F3n",
  data_points: "puntos de datos",
  dismiss_suggestion: "Descartar",
  confidence_low: "Baja",
  confidence_medium: "Media",
  confidence_high: "Alta",
  recommended: "recomendado",
  seasonal_awareness: "Conciencia estacional",
  edit_seasonal_overrides: "Editar factores estacionales",
  seasonal_overrides_title: "Factores estacionales (override)",
  seasonal_overrides_hint: "Factor por mes (0.1–5.0). Vac\u00EDo = aprendido autom\u00E1ticamente.",
  seasonal_override_invalid: "Valor no v\u00E1lido",
  seasonal_override_range: "El factor debe estar entre 0.1 y 5.0",
  clear_all: "Borrar todo",
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
  card_filter_status: "Filtrar por estado",
  card_filter_status_help: "Vac\u00EDo = mostrar todos los estados.",
  card_filter_objects: "Filtrar por objetos",
  card_filter_objects_help: "Vac\u00EDo = mostrar todos los objetos.",
  card_filter_entities: "Filtrar por entidades (entity_ids)",
  card_filter_entities_help: "Selecciona entidades sensor / binary_sensor de esta integraci\u00F3n. Vac\u00EDo = todas.",
  card_loading_objects: "Cargando objetos\u2026",
  no_objects: "A\u00FAn no hay objetos.",
  action_error: "Acción fallida. Inténtelo de nuevo.",
  area_id_optional: "Área (opcional)",
  installation_date_optional: "Fecha de instalación (opcional)",
  custom_icon_optional: "Icono (opcional, ej. mdi:wrench)",
  task_enabled: "Tarea habilitada",
  skip_reason_prompt: "¿Omitir esta tarea?",
  reason_optional: "Motivo (opcional)",
  reset_date_prompt: "¿Marcar la tarea como realizada?",
  reset_date_optional: "Fecha de última ejecución (opcional, por defecto: hoy)",
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
  test_notification: "Notificaci\u00F3n de prueba",
  send_test: "Enviar prueba",
  testing: "Enviando…",
  test_notification_success: "Notificaci\u00F3n de prueba enviada",
  test_notification_failed: "La notificaci\u00F3n de prueba fall\u00F3",
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
  // 1.0.44 — sort + group-by + operator mode
  sort_alphabetical: "Alfab\u00E9tico",
  sort_due_soonest: "Pr\u00F3ximo a vencer",
  sort_task_count: "Cantidad de tareas",
  sort_area: "\u00C1rea",
  sort_assigned_user: "Usuario asignado",
  sort_group: "Grupo",
  groupby_none: "Sin agrupaci\u00F3n",
  groupby_area: "Por \u00E1rea",
  groupby_group: "Por grupo",
  groupby_user: "Por usuario",
  unassigned: "Sin asignar",
  no_area: "Sin \u00E1rea",
  has_overdue: "Tareas vencidas",
  object: "Objeto",
  settings_panel_access: "Acceso al panel",
  settings_panel_access_desc: "Los administradores siempre ven el panel completo. Selecciona aqu\u00ED a los usuarios no administradores que tambi\u00E9n deben tener acceso completo — los dem\u00E1s solo ven Completar y Omitir.",
  no_non_admin_users: "No se encontraron usuarios no administradores. A\u00F1ade alguno en Ajustes → Personas.",
  owner_label: "Propietario",
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
  checklist_steps_optional: "Passos da lista de verificação (opcional)",
  checklist_placeholder: "Limpar filtro\nSubstituir vedação\nTestar pressão",
  checklist_help: "Um passo por linha. Máx. 100 itens.",
  err_too_long: "{field}: demasiado longo (máx. {n} caracteres)",
  err_too_short: "{field}: demasiado curto (mín. {n} caracteres)",
  err_value_too_high: "{field}: demasiado grande (máx. {n})",
  err_value_too_low: "{field}: demasiado pequeno (mín. {n})",
  err_required: "{field}: campo obrigatório",
  err_wrong_type: "{field}: tipo incorreto (esperado: {type})",
  err_invalid_choice: "{field}: valor não permitido",
  err_invalid_value: "{field}: valor inválido",
  feat_schedule_time: "Agendamento por hora",
  feat_schedule_time_desc: "Tarefas vencem em um horário específico em vez de meia-noite.",
  schedule_time_optional: "Vence às (opcional, HH:MM)",
  schedule_time_help: "Vazio = meia-noite (padrão). Fuso horário HA.",
  at_time: "às",
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
  environmental_entity_optional: "Sensor ambiental (opcional)",
  environmental_entity_helper: "ex. sensor.temperatura_exterior — ajusta o intervalo segundo as condições ambientais",
  environmental_attribute_optional: "Atributo ambiental (opcional)",
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
  new_group: "Novo grupo",
  edit_group: "Editar grupo",
  no_groups: "Ainda sem grupos",
  delete_group: "Eliminar grupo",
  delete_group_confirm: "Eliminar o grupo '{name}'?",
  group_select_tasks: "Selecionar tarefas",
  group_name_required: "Nome obrigatório",
  description_optional: "Descrição (opcional)",
  selected: "Selecionado",
  loading_chart: "A carregar dados...",
  was_maintenance_needed: "Esta manutenção era necessária?",
  feedback_needed: "Necessária",
  feedback_not_needed: "Não necessária",
  feedback_not_sure: "Não tenho a certeza",
  suggested_interval: "Intervalo sugerido",
  apply_suggestion: "Aplicar",
  reanalyze: "Reanalisar",
  reanalyze_result: "Nova análise",
  reanalyze_insufficient_data: "Dados insuficientes para uma recomendação",
  data_points: "pontos de dados",
  dismiss_suggestion: "Descartar",
  confidence_low: "Baixa",
  confidence_medium: "Média",
  confidence_high: "Alta",
  recommended: "recomendado",
  seasonal_awareness: "Consciência sazonal",
  edit_seasonal_overrides: "Editar fatores sazonais",
  seasonal_overrides_title: "Fatores sazonais (override)",
  seasonal_overrides_hint: "Fator por mês (0.1–5.0). Vazio = aprendido automaticamente.",
  seasonal_override_invalid: "Valor inválido",
  seasonal_override_range: "O fator deve estar entre 0.1 e 5.0",
  clear_all: "Limpar tudo",
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
  card_filter_status: "Filtrar por estado",
  card_filter_status_help: "Vazio = mostrar todos os estados.",
  card_filter_objects: "Filtrar por objetos",
  card_filter_objects_help: "Vazio = mostrar todos os objetos.",
  card_filter_entities: "Filtrar por entidades (entity_ids)",
  card_filter_entities_help: "Selecione entidades sensor / binary_sensor desta integração. Vazio = todas.",
  card_loading_objects: "A carregar objetos\u2026",
  no_objects: "Ainda sem objetos.",
  action_error: "Ação falhada. Tente novamente.",
  area_id_optional: "Área (opcional)",
  installation_date_optional: "Data de instalação (opcional)",
  custom_icon_optional: "Ícone (opcional, ex. mdi:wrench)",
  task_enabled: "Tarefa ativada",
  skip_reason_prompt: "Saltar esta tarefa?",
  reason_optional: "Motivo (opcional)",
  reset_date_prompt: "Marcar tarefa como executada?",
  reset_date_optional: "Data da última execução (opcional, padrão: hoje)",
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
  test_notification: "Notificação de teste",
  send_test: "Enviar teste",
  testing: "A enviar…",
  test_notification_success: "Notificação de teste enviada",
  test_notification_failed: "Falha na notificação de teste",
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
  // 1.0.44 — sort + group-by + operator mode
  sort_alphabetical: "Alfab\u00E9tico",
  sort_due_soonest: "Vencimento mais pr\u00F3ximo",
  sort_task_count: "Quantidade de tarefas",
  sort_area: "\u00C1rea",
  sort_assigned_user: "Usu\u00E1rio atribu\u00EDdo",
  sort_group: "Grupo",
  groupby_none: "Sem agrupamento",
  groupby_area: "Por \u00E1rea",
  groupby_group: "Por grupo",
  groupby_user: "Por usu\u00E1rio",
  unassigned: "N\u00E3o atribu\u00EDdo",
  no_area: "Sem \u00E1rea",
  has_overdue: "Tarefas em atraso",
  object: "Objeto",
  settings_panel_access: "Acesso ao painel",
  settings_panel_access_desc: "Administradores sempre veem o painel completo. Selecione aqui usu\u00E1rios n\u00E3o administradores que tamb\u00E9m devem ter acesso completo — os demais s\u00F3 veem Concluir e Ignorar.",
  no_non_admin_users: "Nenhum usu\u00E1rio n\u00E3o administrador encontrado. Adicione em Configura\u00E7\u00F5es → Pessoas.",
  owner_label: "Propriet\u00E1rio",
};
const UK: Translations = {
  maintenance: "Обслуговування",
  objects: "Об'єкти",
  tasks: "Завдання",
  overdue: "Прострочено",
  due_soon: "Незабаром",
  triggered: "Спрацювало",
  ok: "Норма",
  all: "Всі",
  new_object: "+ Новий об'єкт",
  edit: "Редагувати",
  delete: "Видалити",
  add_task: "+ Додати завдання",
  complete: "Виконати",
  completed: "Виконано",
  skip: "Пропустити",
  skipped: "Пропущено",
  reset: "Скинути",
  cancel: "Скасувати",
  completing: "Виконується…",
  interval: "Інтервал",
  warning: "Попередження",
  last_performed: "Останнє виконання",
  next_due: "Наступний термін",
  days_until_due: "Днів до терміну",
  avg_duration: "Сер. тривалість",
  trigger: "Тригер",
  trigger_type: "Тип тригера",
  threshold_above: "Верхня межа",
  threshold_below: "Нижня межа",
  threshold: "Поріг",
  counter: "Лічильник",
  state_change: "Зміна стану",
  runtime: "Напрацювання",
  runtime_hours: "Цільове напрацювання (години)",
  target_value: "Цільове значення",
  baseline: "Базове значення",
  target_changes: "Цільова кількість змін",
  for_minutes: "Протягом (хвилин)",
  time_based: "За часом",
  sensor_based: "За сенсором",
  manual: "Вручну",
  cleaning: "Очищення",
  inspection: "Огляд",
  replacement: "Заміна",
  calibration: "Калібрування",
  service: "Сервіс",
  custom: "Власний",
  history: "Історія",
  cost: "Вартість",
  duration: "Тривалість",
  both: "Обидва",
  trigger_val: "Значення тригера",
  complete_title: "Виконати: ",
  checklist: "Чекліст",
  checklist_steps_optional: "Кроки чекліста (необов'язково)",
  checklist_placeholder: "Очистити фільтр\nЗамінити ущільнювач\nПеревірити тиск",
  checklist_help: "Один крок на рядок. Макс. 100 елементів.",
  err_too_long: "{field}: задовге (макс. {n} символів)",
  err_too_short: "{field}: закоротке (мін. {n} символів)",
  err_value_too_high: "{field}: завелике (макс. {n})",
  err_value_too_low: "{field}: замале (мін. {n})",
  err_required: "{field}: обов'язкове поле",
  err_wrong_type: "{field}: невірний тип (очікувалось: {type})",
  err_invalid_choice: "{field}: недопустиме значення",
  err_invalid_value: "{field}: невірне значення",
  feat_schedule_time: "Планування за часом доби",
  feat_schedule_time_desc: "Задачі стають простроченими у певний час доби, а не опівночі.",
  schedule_time_optional: "Час прострочення (необов'язково, HH:MM)",
  schedule_time_help: "Порожньо = опівночі (за замовчуванням). Часовий пояс HA.",
  at_time: "о",
  notes_optional: "Примітки (необов'язково)",
  cost_optional: "Вартість (необов'язково)",
  duration_minutes: "Тривалість у хвилинах (необов'язково)",
  days: "днів",
  day: "день",
  today: "Сьогодні",
  d_overdue: "д прострочено",
  no_tasks: "Завдань обслуговування ще немає. Створіть об'єкт, щоб почати.",
  no_tasks_short: "Немає завдань",
  no_history: "Записів в історії ще немає.",
  show_all: "Показати всі",
  cost_duration_chart: "Вартість і тривалість",
  installed: "Встановлено",
  confirm_delete_object: "Видалити цей об'єкт і всі його завдання?",
  confirm_delete_task: "Видалити це завдання?",
  min: "Мін",
  max: "Макс",
  // Мітки діалогів
  save: "Зберегти",
  saving: "Збереження…",
  edit_task: "Редагувати завдання",
  new_task: "Нове завдання обслуговування",
  task_name: "Назва завдання",
  maintenance_type: "Тип обслуговування",
  schedule_type: "Тип розкладу",
  interval_days: "Інтервал (дні)",
  warning_days: "Днів попередження",
  interval_anchor: "Прив'язка інтервалу",
  anchor_completion: "Від дати виконання",
  anchor_planned: "Від запланованої дати (без зміщення)",
  edit_object: "Редагувати об'єкт",
  name: "Назва",
  manufacturer_optional: "Виробник (необов'язково)",
  model_optional: "Модель (необов'язково)",
  serial_number_optional: "Серійний номер (необов'язково)",
  serial_number_label: "С/Н",
  last_performed_optional: "Останнé виконання (необов'язково)",
  sort_due_date: "Дата терміну",
  sort_object: "Назва об'єкта",
  sort_type: "Тип",
  sort_task_name: "Назва завдання",
  all_objects: "Всі об'єкти",
  tasks_lower: "завдань",
  no_tasks_yet: "Завдань ще немає",
  add_first_task: "Додати перше завдання",
  // Мітки діалогу тригера
  trigger_configuration: "Налаштування тригера",
  entity_id: "ID об'єкта",
  comma_separated: "через кому",
  entity_logic: "Логіка об'єктів",
  entity_logic_any: "Будь-який об'єкт спрацьовує",
  entity_logic_all: "Всі об'єкти мають спрацювати",
  entities: "об'єктів",
  attribute_optional: "Атрибут (необов'язково, порожньо = стан)",
  use_entity_state: "Використовувати стан об'єкта (без атрибута)",
  trigger_above: "Спрацювати, коли вище",
  trigger_below: "Спрацювати, коли нижче",
  for_at_least_minutes: "Протягом не менше (хвилин)",
  safety_interval_days: "Страховий інтервал (дні, необов'язково)",
  delta_mode: "Режим дельти",
  from_state_optional: "З стану (необов'язково)",
  to_state_optional: "До стану (необов'язково)",
  documentation_url_optional: "URL документації (необов'язково)",
  nfc_tag_id_optional: "ID NFC-тега (необов'язково)",
  environmental_entity_optional: "Датчик навколишнього середовища (необов'язково)",
  environmental_entity_helper: "напр. sensor.outdoor_temperature — коригує інтервал відповідно до умов навколишнього середовища",
  environmental_attribute_optional: "Атрибут середовища (необов'язково)",
  nfc_tag_id: "ID NFC-тега",
  nfc_linked: "NFC-тег прив'язано",
  nfc_link_hint: "Натисніть, щоб прив'язати NFC-тег",
  // Призначення користувача
  responsible_user: "Відповідальний користувач",
  no_user_assigned: "(Користувача не призначено)",
  all_users: "Всі користувачі",
  my_tasks: "Мої завдання",
  budget_monthly: "Щомісячний бюджет",
  budget_yearly: "Щорічний бюджет",
  groups: "Групи",
  new_group: "Нова група",
  edit_group: "Редагувати групу",
  no_groups: "Груп ще немає",
  delete_group: "Видалити групу",
  delete_group_confirm: "Видалити групу '{name}'?",
  group_select_tasks: "Обрати завдання",
  group_name_required: "Потрібна назва",
  description_optional: "Опис (необов'язково)",
  selected: "Обрано",
  loading_chart: "Завантаження даних графіка...",
  // Адаптивне планування
  was_maintenance_needed: "Чи було потрібне це обслуговування?",
  feedback_needed: "Потрібне",
  feedback_not_needed: "Не потрібне",
  feedback_not_sure: "Не впевнений",
  suggested_interval: "Рекомендований інтервал",
  apply_suggestion: "Застосувати",
  reanalyze: "Повторно проаналізувати",
  reanalyze_result: "Новий аналіз",
  reanalyze_insufficient_data: "Недостатньо даних для рекомендації",
  data_points: "точок даних",
  dismiss_suggestion: "Відхилити",
  confidence_low: "Низька",
  confidence_medium: "Середня",
  confidence_high: "Висока",
  recommended: "рекомендовано",
  // Сезонне планування
  seasonal_awareness: "Сезонна корекція",
  edit_seasonal_overrides: "Редагувати сезонні коефіцієнти",
  seasonal_overrides_title: "Сезонні коефіцієнти (перевизначення)",
  seasonal_overrides_hint: "Коефіцієнт на місяць (0.1–5.0). Порожньо = автоматично.",
  seasonal_override_invalid: "Недійсне значення",
  seasonal_override_range: "Коефіцієнт має бути між 0.1 та 5.0",
  clear_all: "Очистити все",
  seasonal_chart_title: "Сезонні коефіцієнти",
  seasonal_learned: "Навчена",
  seasonal_manual: "Ручна",
  month_jan: "Січ", month_feb: "Лют", month_mar: "Бер", month_apr: "Кві",
  month_may: "Тра", month_jun: "Чер", month_jul: "Лип", month_aug: "Сер",
  month_sep: "Вер", month_oct: "Жов", month_nov: "Лис", month_dec: "Гру",
  // Прогноз сенсора (Фаза 3)
  sensor_prediction: "Прогноз сенсора",
  degradation_trend: "Тренд",
  trend_rising: "Зростає",
  trend_falling: "Спадає",
  trend_stable: "Стабільний",
  trend_insufficient_data: "Недостатньо даних",
  days_until_threshold: "Днів до порогу",
  threshold_exceeded: "Поріг перевищено",
  environmental_adjustment: "Екологічний коефіцієнт",
  sensor_prediction_urgency: "Сенсор прогнозує досягнення порогу через ~{days} днів",
  day_short: "день",
  // Вейбулл / Фаза 4
  weibull_reliability_curve: "Крива надійності",
  weibull_failure_probability: "Ймовірність відмови",
  weibull_r_squared: "Точність R²",
  beta_early_failures: "Ранні відмови",
  beta_random_failures: "Випадкові відмови",
  beta_wear_out: "Знос",
  beta_highly_predictable: "Дуже передбачуваний",
  confidence_interval: "Довірчий інтервал",
  confidence_conservative: "Консервативний",
  confidence_aggressive: "Оптимістичний",
  current_interval_marker: "Поточний інтервал",
  recommended_marker: "Рекомендовано",
  characteristic_life: "Характеристичний ресурс",
  // Доступність (ARIA-мітки)
  chart_mini_sparkline: "Мінімальний графік тренду",
  chart_history: "Історія вартості та тривалості",
  chart_seasonal: "Сезонні коефіцієнти, 12 місяців",
  chart_weibull: "Крива надійності Вейбулла",
  chart_sparkline: "Графік значень тригера сенсора",
  days_progress: "Прогрес днів",
  // QR-код
  qr_code: "QR-код",
  qr_generating: "Генерація QR-коду\u2026",
  qr_error: "Не вдалося згенерувати QR-код.",
  qr_error_no_url: "URL Home Assistant не налаштовано. Задайте зовнішню або внутрішню URL-адресу в Налаштування \u2192 Система \u2192 Мережа.",
  save_error: "Не вдалося зберегти. Спробуйте ще раз.",
  qr_print: "Друкувати",
  qr_download: "Завантажити SVG",
  qr_action: "Дія при скануванні",
  qr_action_view: "Переглянути інформацію про обслуговування",
  qr_action_complete: "Позначити обслуговування виконаним",
  qr_url_mode: "Тип посилання",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Локальний (mDNS)",
  qr_mode_server: "URL сервера",
  // Редизайн дашборду
  overview: "Огляд",
  analysis: "Аналіз",
  recent_activities: "Остання активність",
  search_notes: "Пошук у примітках",
  avg_cost: "Сер. вартість",
  no_advanced_features: "Розширені функції не увімкнено",
  no_advanced_features_hint: "Увімкніть «Адаптивні інтервали» або «Сезонні закономірності» в налаштуваннях інтеграції, щоб побачити тут дані аналізу.",
  analysis_not_enough_data: "Недостатньо даних для аналізу.",
  analysis_not_enough_data_hint: "Аналіз Вейбулла потребує щонайменше 5 виконаних обслуговувань; сезонні закономірності стають видимими після 6+ записів на місяць.",
  analysis_manual_task_hint: "Ручні завдання без інтервалу не генерують дані аналізу.",
  completions: "виконань",
  current: "Поточний",
  shorter: "Коротший",
  longer: "Довший",
  normal: "Звичайний",
  disabled: "Вимкнено",
  compound_logic: "Складена логіка",
  // Редактор картки
  card_title: "Заголовок",
  card_show_header: "Показувати заголовок зі статистикою",
  card_show_actions: "Показувати кнопки дій",
  card_compact: "Компактний режим",
  card_max_items: "Макс. елементів (0 = всі)",
  card_filter_status: "Фільтрувати за статусом",
  card_filter_status_help: "Порожньо = показати всі статуси.",
  card_filter_objects: "Фільтрувати за об'єктами",
  card_filter_objects_help: "Порожньо = показати всі об'єкти.",
  card_filter_entities: "Фільтрувати за сутностями (entity_ids)",
  card_filter_entities_help: "Виберіть сутності sensor / binary_sensor з цієї інтеграції. Порожньо = всі.",
  card_loading_objects: "Завантаження об'єктів\u2026",
  no_objects: "Поки немає об'єктів.",
  // Доповнення аудиту узгодженості
  action_error: "Дія не вдалась. Спробуйте ще раз.",
  area_id_optional: "Зона (необов'язково)",
  installation_date_optional: "Дата встановлення (необов'язково)",
  custom_icon_optional: "Іконка (необов'язково, наприклад mdi:wrench)",
  task_enabled: "Завдання увімкнено",
  skip_reason_prompt: "Пропустити це завдання?",
  reason_optional: "Причина (необов'язково)",
  reset_date_prompt: "Позначити як виконане?",
  reset_date_optional: "Дата останнього виконання (необов'язково, типово: сьогодні)",
  notes_label: "Примітки",
  documentation_label: "Документація",
  no_nfc_tag: "— Без тега —",
  // Вкладка налаштувань
  dashboard: "Дашборд",
  settings: "Налаштування",
  settings_features: "Розширені функції",
  settings_features_desc: "Увімкніть або вимкніть розширені функції. Вимкнення приховує їх з інтерфейсу, але не видаляє дані.",
  feat_adaptive: "Адаптивне планування",
  feat_adaptive_desc: "Навчатися оптимальним інтервалам з історії обслуговування",
  feat_predictions: "Прогнози за сенсорами",
  feat_predictions_desc: "Прогнозувати дати спрацювання за деградацією сенсора",
  feat_seasonal: "Сезонні корекції",
  feat_seasonal_desc: "Коригувати інтервали на основі сезонних закономірностей",
  feat_environmental: "Кореляція з довкіллям",
  feat_environmental_desc: "Корелювати інтервали з температурою/вологістю",
  feat_budget: "Відстеження бюджету",
  feat_budget_desc: "Відстежувати щомісячні та щорічні витрати на обслуговування",
  feat_groups: "Групи завдань",
  feat_groups_desc: "Організовувати завдання в логічні групи",
  feat_checklists: "Чеклісти",
  feat_checklists_desc: "Багатокрокові процедури для виконання завдань",
  settings_general: "Загальне",
  settings_default_warning: "Днів попередження за замовчуванням",
  settings_panel_enabled: "Панель у бічному меню",
  settings_notifications: "Сповіщення",
  settings_notify_service: "Служба сповіщень",
  test_notification: "Тестове сповіщення",
  send_test: "Надіслати тест",
  testing: "Надсилання…",
  test_notification_success: "Тестове сповіщення надіслано",
  test_notification_failed: "Не вдалося надіслати тестове сповіщення",
  settings_notify_due_soon: "Сповіщати, коли термін наближається",
  settings_notify_overdue: "Сповіщати про прострочення",
  settings_notify_triggered: "Сповіщати про спрацювання",
  settings_interval_hours: "Інтервал повторення (години, 0 = одноразово)",
  settings_quiet_hours: "Тихі години",
  settings_quiet_start: "Початок",
  settings_quiet_end: "Кінець",
  settings_max_per_day: "Макс. сповіщень на день (0 = без обмежень)",
  settings_bundling: "Групувати сповіщення",
  settings_bundle_threshold: "Поріг групування",
  settings_actions: "Кнопки дій у мобільних сповіщеннях",
  settings_action_complete: "Показувати кнопку «Виконати»",
  settings_action_skip: "Показувати кнопку «Пропустити»",
  settings_action_snooze: "Показувати кнопку «Відкласти»",
  settings_snooze_hours: "Тривалість відкладення (години)",
  settings_budget: "Бюджет",
  settings_currency: "Валюта",
  settings_budget_monthly: "Щомісячний бюджет",
  settings_budget_yearly: "Щорічний бюджет",
  settings_budget_alerts: "Сповіщення про бюджет",
  settings_budget_threshold: "Поріг сповіщення (%)",
  settings_import_export: "Імпорт / Експорт",
  settings_export_json: "Експортувати JSON",
  settings_export_csv: "Експортувати CSV",
  settings_import_csv: "Імпортувати CSV",
  settings_import_placeholder: "Вставте вміст JSON або CSV сюди\u2026",
  settings_import_btn: "Імпортувати",
  settings_import_success: "{count} об'єктів успішно імпортовано.",
  settings_export_success: "Експорт завантажено.",
  settings_saved: "Налаштування збережено.",
  settings_include_history: "Включити історію",
  // 1.0.44 — sort + group-by + operator mode
  sort_alphabetical: "За алфавітом",
  sort_due_soonest: "Найближчий термін",
  sort_task_count: "Кількість завдань",
  sort_area: "Зона",
  sort_assigned_user: "Призначений користувач",
  sort_group: "Група",
  groupby_none: "Без групування",
  groupby_area: "За зоною",
  groupby_group: "За групою",
  groupby_user: "За користувачем",
  unassigned: "Не призначено",
  no_area: "Без зони",
  has_overdue: "Прострочені завдання",
  object: "Об'єкт",
  settings_panel_access: "Доступ до панелі",
  settings_panel_access_desc: "Адміністратори завжди бачать повну панель. Виберіть тут не-адмін користувачів, які також повинні мати повний доступ — інші бачать лише Виконати та Пропустити.",
  no_non_admin_users: "Не знайдено не-адмін користувачів. Додайте їх у Налаштуваннях → Особи.",
  owner_label: "Власник",
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
  checklist_steps_optional: "Шаги контрольного списка (необязательно)",
  checklist_placeholder: "Очистить фильтр\nЗаменить уплотнитель\nПроверить давление",
  checklist_help: "Один шаг на строку. Макс. 100 элементов.",
  err_too_long: "{field}: слишком длинно (макс. {n} символов)",
  err_too_short: "{field}: слишком коротко (мин. {n} символов)",
  err_value_too_high: "{field}: слишком велико (макс. {n})",
  err_value_too_low: "{field}: слишком мало (мин. {n})",
  err_required: "{field}: обязательное поле",
  err_wrong_type: "{field}: неверный тип (ожидался: {type})",
  err_invalid_choice: "{field}: недопустимое значение",
  err_invalid_value: "{field}: неверное значение",
  feat_schedule_time: "Планирование по времени дня",
  feat_schedule_time_desc: "Задачи становятся просроченными в определённое время дня, а не в полночь.",
  schedule_time_optional: "Срок (необязательно, HH:MM)",
  schedule_time_help: "Пусто = полночь (по умолчанию). Часовой пояс HA.",
  at_time: "в",
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
  sort_due_date: "Срок",
  sort_object: "Имя объекта",
  sort_type: "Тип",
  sort_task_name: "Имя задачи",
  all_objects: "Все объекты",
  tasks_lower: "задач",
  no_tasks_yet: "Пока нет задач",
  add_first_task: "Добавить первую задачу",
  last_performed_optional: "Последнее выполнение (опционально)",
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
  environmental_entity_optional: "Датчик окружающей среды (опционально)",
  environmental_entity_helper: "напр. sensor.outdoor_temperature — корректирует интервал в зависимости от условий",
  environmental_attribute_optional: "Атрибут среды (опционально)",
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
  new_group: "Новая группа",
  edit_group: "Редактировать группу",
  no_groups: "Групп пока нет",
  delete_group: "Удалить группу",
  delete_group_confirm: "Удалить группу '{name}'?",
  group_select_tasks: "Выбрать задачи",
  group_name_required: "Требуется имя",
  description_optional: "Описание (опционально)",
  selected: "Выбрано",
  loading_chart: "Загрузка данных графика...",
  // Adaptive scheduling
  was_maintenance_needed: "Требовалось ли это обслуживание?",
  feedback_needed: "Требовалось",
  feedback_not_needed: "Не требовалось",
  feedback_not_sure: "Не уверен",
  suggested_interval: "Рекомендуемый интервал",
  apply_suggestion: "Применить",
  reanalyze: "Повторный анализ",
  reanalyze_result: "Новый анализ",
  reanalyze_insufficient_data: "Недостаточно данных для рекомендации",
  data_points: "точек данных",
  dismiss_suggestion: "Отклонить",
  confidence_low: "Низкая",
  confidence_medium: "Средняя",
  confidence_high: "Высокая",
  recommended: "рекомендуется",
  // Seasonal scheduling
  seasonal_awareness: "Сезонная адаптация",
  edit_seasonal_overrides: "Редактировать сезонные коэффициенты",
  seasonal_overrides_title: "Сезонные коэффициенты (переопределение)",
  seasonal_overrides_hint: "Коэффициент на месяц (0.1–5.0). Пусто = автоматически.",
  seasonal_override_invalid: "Недопустимое значение",
  seasonal_override_range: "Коэффициент должен быть от 0.1 до 5.0",
  clear_all: "Очистить все",
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
  card_filter_status: "Фильтровать по статусу",
  card_filter_status_help: "Пусто = показать все статусы.",
  card_filter_objects: "Фильтровать по объектам",
  card_filter_objects_help: "Пусто = показать все объекты.",
  card_filter_entities: "Фильтровать по сущностям (entity_ids)",
  card_filter_entities_help: "Выберите сущности sensor / binary_sensor из этой интеграции. Пусто = все.",
  card_loading_objects: "Загрузка объектов\u2026",
  no_objects: "Пока нет объектов.",
  // Consistency audit additions
  action_error: "Не удалось выполнить действие. Попробуйте ещё раз.",
  area_id_optional: "Зона (опционально)",
  installation_date_optional: "Дата установки (опционально)",
  custom_icon_optional: "Иконка (опционально, например mdi:wrench)",
  task_enabled: "Задача включена",
  skip_reason_prompt: "Пропустить эту задачу?",
  reason_optional: "Причина (опционально)",
  reset_date_prompt: "Отметить задачу как выполненную?",
  reset_date_optional: "Дата последнего выполнения (опционально, по умолчанию: сегодня)",
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
  test_notification: "Тестовое уведомление",
  send_test: "Отправить тест",
  testing: "Отправка…",
  test_notification_success: "Тестовое уведомление отправлено",
  test_notification_failed: "Не удалось отправить тестовое уведомление",
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
  // 1.0.44 — sort + group-by + operator mode
  sort_alphabetical: "По алфавиту",
  sort_due_soonest: "Ближайший срок",
  sort_task_count: "Количество задач",
  sort_area: "Область",
  sort_assigned_user: "Назначенный пользователь",
  sort_group: "Группа",
  groupby_none: "Без группировки",
  groupby_area: "По области",
  groupby_group: "По группе",
  groupby_user: "По пользователю",
  unassigned: "Не назначено",
  no_area: "Без области",
  has_overdue: "Просроченные задачи",
  object: "Объект",
  settings_panel_access: "Доступ к панели",
  settings_panel_access_desc: "Администраторы всегда видят полную панель. Выберите здесь не-админ пользователей, которые также должны иметь полный доступ — остальные видят только Выполнить и Пропустить.",
  no_non_admin_users: "Не найдено не-админ пользователей. Добавьте их в Настройках → Люди.",
  owner_label: "Владелец",
};

const PL: Translations = {
  maintenance: "Konserwacja",
  objects: "Obiekty",
  tasks: "Zadania",
  overdue: "Zaległe",
  due_soon: "Wkrótce",
  triggered: "Wyzwolone",
  ok: "OK",
  all: "Wszystkie",
  new_object: "+ Nowy obiekt",
  edit: "Edytuj",
  delete: "Usuń",
  add_task: "+ Dodaj zadanie",
  complete: "Wykonaj",
  completed: "Wykonano",
  skip: "Pomiń",
  skipped: "Pominięte",
  reset: "Resetuj",
  cancel: "Anuluj",
  completing: "Wykonywanie\u2026",
  interval: "Interwał",
  warning: "Ostrzeżenie",
  last_performed: "Ostatnio wykonane",
  next_due: "Następny termin",
  days_until_due: "Dni do terminu",
  avg_duration: "Śr. czas trwania",
  trigger: "Wyzwalacz",
  trigger_type: "Typ wyzwalacza",
  threshold_above: "Górny limit",
  threshold_below: "Dolny limit",
  threshold: "Próg",
  counter: "Licznik",
  state_change: "Zmiana stanu",
  runtime: "Czas pracy",
  runtime_hours: "Docelowy czas pracy (godziny)",
  target_value: "Wartość docelowa",
  baseline: "Wartość bazowa",
  target_changes: "Docelowa liczba zmian",
  for_minutes: "Przez (minuty)",
  time_based: "Czasowy",
  sensor_based: "Oparty na czujniku",
  manual: "Ręczny",
  cleaning: "Czyszczenie",
  inspection: "Inspekcja",
  replacement: "Wymiana",
  calibration: "Kalibracja",
  service: "Serwis",
  custom: "Niestandardowy",
  history: "Historia",
  cost: "Koszt",
  duration: "Czas trwania",
  both: "Oba",
  trigger_val: "Wartość wyzwalacza",
  complete_title: "Wykonaj: ",
  checklist: "Lista kontrolna",
  checklist_steps_optional: "Kroki listy kontrolnej (opcjonalne)",
  checklist_placeholder: "Wyczyść filtr\nWymień uszczelkę\nSprawdź ciśnienie",
  checklist_help: "Jeden krok na linię. Maks. 100 elementów.",
  err_too_long: "{field}: za długie (maks. {n} znaków)",
  err_too_short: "{field}: za krótkie (min. {n} znaków)",
  err_value_too_high: "{field}: za duże (maks. {n})",
  err_value_too_low: "{field}: za małe (min. {n})",
  err_required: "{field}: wymagane",
  err_wrong_type: "{field}: zły typ (oczekiwano: {type})",
  err_invalid_choice: "{field}: niedozwolona wartość",
  err_invalid_value: "{field}: nieprawidłowa wartość",
  feat_schedule_time: "Harmonogram według pory dnia",
  feat_schedule_time_desc: "Zadania stają się zaległe o określonej porze dnia zamiast o północy.",
  schedule_time_optional: "Termin o godzinie (opcjonalne, HH:MM)",
  schedule_time_help: "Puste = północ (domyślnie). Strefa czasowa HA.",
  at_time: "o",
  notes_optional: "Notatki (opcjonalne)",
  cost_optional: "Koszt (opcjonalne)",
  duration_minutes: "Czas trwania w minutach (opcjonalne)",
  days: "dni",
  day: "dzień",
  today: "Dzisiaj",
  d_overdue: "d zaległe",
  no_tasks: "Jeszcze brak zadań konserwacyjnych. Utwórz obiekt, aby zacząć.",
  no_tasks_short: "Brak zadań",
  no_history: "Jeszcze brak wpisów historii.",
  show_all: "Pokaż wszystko",
  cost_duration_chart: "Koszt i czas trwania",
  installed: "Zainstalowane",
  confirm_delete_object: "Usunąć ten obiekt i wszystkie jego zadania?",
  confirm_delete_task: "Usunąć to zadanie?",
  min: "Min",
  max: "Maks",
  save: "Zapisz",
  saving: "Zapisywanie\u2026",
  edit_task: "Edytuj zadanie",
  new_task: "Nowe zadanie konserwacyjne",
  task_name: "Nazwa zadania",
  maintenance_type: "Typ konserwacji",
  schedule_type: "Typ harmonogramu",
  interval_days: "Interwał (dni)",
  warning_days: "Dni ostrzeżenia",
  last_performed_optional: "Ostatnio wykonane (opcjonalne)",
  interval_anchor: "Punkt zaczepienia interwału",
  anchor_completion: "Od daty wykonania",
  anchor_planned: "Od daty planowanej (bez przesunięć)",
  edit_object: "Edytuj obiekt",
  name: "Nazwa",
  manufacturer_optional: "Producent (opcjonalne)",
  model_optional: "Model (opcjonalne)",
  serial_number_optional: "Numer seryjny (opcjonalne)",
  serial_number_label: "S/N",
  sort_due_date: "Termin",
  sort_object: "Nazwa obiektu",
  sort_type: "Typ",
  sort_task_name: "Nazwa zadania",
  all_objects: "Wszystkie obiekty",
  tasks_lower: "zadań",
  no_tasks_yet: "Jeszcze brak zadań",
  add_first_task: "Dodaj pierwsze zadanie",
  trigger_configuration: "Konfiguracja wyzwalacza",
  entity_id: "ID encji",
  comma_separated: "oddzielone przecinkami",
  entity_logic: "Logika encji",
  entity_logic_any: "Wyzwala dowolna encja",
  entity_logic_all: "Wszystkie encje muszą wyzwolić",
  entities: "encje",
  attribute_optional: "Atrybut (opcjonalny, puste = stan)",
  use_entity_state: "Użyj stanu encji (bez atrybutu)",
  trigger_above: "Wyzwól powyżej",
  trigger_below: "Wyzwól poniżej",
  for_at_least_minutes: "Przez co najmniej (minuty)",
  safety_interval_days: "Interwał bezpieczeństwa (dni, opcjonalny)",
  delta_mode: "Tryb delta",
  from_state_optional: "Ze stanu (opcjonalne)",
  to_state_optional: "Do stanu (opcjonalne)",
  documentation_url_optional: "URL dokumentacji (opcjonalne)",
  nfc_tag_id_optional: "ID tagu NFC (opcjonalne)",
  environmental_entity_optional: "Czujnik środowiskowy (opcjonalne)",
  environmental_entity_helper: "np. sensor.outdoor_temperature — dostosowuje interwał na podstawie warunków środowiskowych",
  environmental_attribute_optional: "Atrybut środowiskowy (opcjonalne)",
  nfc_tag_id: "ID tagu NFC",
  nfc_linked: "Tag NFC powiązany",
  nfc_link_hint: "Kliknij, aby powiązać tag NFC",
  responsible_user: "Odpowiedzialny użytkownik",
  no_user_assigned: "(Brak przypisanego użytkownika)",
  all_users: "Wszyscy użytkownicy",
  my_tasks: "Moje zadania",
  budget_monthly: "Budżet miesięczny",
  budget_yearly: "Budżet roczny",
  groups: "Grupy",
  new_group: "Nowa grupa",
  edit_group: "Edytuj grupę",
  no_groups: "Jeszcze brak grup",
  delete_group: "Usuń grupę",
  delete_group_confirm: "Usunąć grupę '{name}'?",
  group_select_tasks: "Wybierz zadania",
  group_name_required: "Nazwa jest wymagana",
  description_optional: "Opis (opcjonalny)",
  selected: "Wybrane",
  loading_chart: "Ładowanie danych wykresu...",
  was_maintenance_needed: "Czy ta konserwacja była potrzebna?",
  feedback_needed: "Potrzebna",
  feedback_not_needed: "Niepotrzebna",
  feedback_not_sure: "Nie jestem pewien",
  suggested_interval: "Sugerowany interwał",
  apply_suggestion: "Zastosuj",
  reanalyze: "Analizuj ponownie",
  reanalyze_result: "Nowa analiza",
  reanalyze_insufficient_data: "Za mało danych do wygenerowania rekomendacji",
  data_points: "punkty danych",
  dismiss_suggestion: "Odrzuć",
  confidence_low: "Niska",
  confidence_medium: "Średnia",
  confidence_high: "Wysoka",
  recommended: "rekomendowane",
  seasonal_awareness: "Świadomość sezonowa",
  edit_seasonal_overrides: "Edytuj czynniki sezonowe",
  seasonal_overrides_title: "Czynniki sezonowe (nadpisanie)",
  seasonal_overrides_hint: "Czynnik na miesiąc (0.1–5.0). Puste = uczone automatycznie.",
  seasonal_override_invalid: "Nieprawidłowa wartość",
  seasonal_override_range: "Czynnik musi być między 0.1 a 5.0",
  clear_all: "Wyczyść wszystko",
  seasonal_chart_title: "Czynniki sezonowe",
  seasonal_learned: "Wyuczone",
  seasonal_manual: "Ręczne",
  month_jan: "Sty", month_feb: "Lut", month_mar: "Mar", month_apr: "Kwi",
  month_may: "Maj", month_jun: "Cze", month_jul: "Lip", month_aug: "Sie",
  month_sep: "Wrz", month_oct: "Paź", month_nov: "Lis", month_dec: "Gru",
  sensor_prediction: "Predykcja czujnika",
  degradation_trend: "Trend",
  trend_rising: "Rosnący",
  trend_falling: "Malejący",
  trend_stable: "Stabilny",
  trend_insufficient_data: "Niewystarczające dane",
  days_until_threshold: "Dni do progu",
  threshold_exceeded: "Próg przekroczony",
  environmental_adjustment: "Czynnik środowiskowy",
  sensor_prediction_urgency: "Czujnik przewiduje próg za ~{days} dni",
  day_short: "d",
  weibull_reliability_curve: "Krzywa niezawodności",
  weibull_failure_probability: "Prawdopodobieństwo awarii",
  weibull_r_squared: "Dopasowanie R²",
  beta_early_failures: "Wczesne awarie",
  beta_random_failures: "Losowe awarie",
  beta_wear_out: "Zużycie",
  beta_highly_predictable: "Wysoce przewidywalne",
  confidence_interval: "Przedział ufności",
  confidence_conservative: "Konserwatywny",
  confidence_aggressive: "Optymistyczny",
  current_interval_marker: "Bieżący interwał",
  recommended_marker: "Rekomendowany",
  characteristic_life: "Charakterystyczna żywotność",
  chart_mini_sparkline: "Wykres trendu",
  chart_history: "Historia kosztów i czasu trwania",
  chart_seasonal: "Czynniki sezonowe, 12 miesięcy",
  chart_weibull: "Krzywa niezawodności Weibulla",
  chart_sparkline: "Wykres wartości wyzwalacza czujnika",
  days_progress: "Postęp dni",
  qr_code: "Kod QR",
  qr_generating: "Generowanie kodu QR\u2026",
  qr_error: "Nie udało się wygenerować kodu QR.",
  qr_error_no_url: "Brak skonfigurowanego URL HA. Ustaw zewnętrzny lub wewnętrzny URL w Ustawienia \u2192 System \u2192 Sieć.",
  save_error: "Nie udało się zapisać. Spróbuj ponownie.",
  qr_print: "Drukuj",
  qr_download: "Pobierz SVG",
  qr_action: "Akcja przy skanowaniu",
  qr_action_view: "Wyświetl informacje o konserwacji",
  qr_action_complete: "Oznacz konserwację jako wykonaną",
  qr_url_mode: "Typ linku",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Lokalny (mDNS)",
  qr_mode_server: "URL serwera",
  overview: "Przegląd",
  analysis: "Analiza",
  recent_activities: "Ostatnie aktywności",
  search_notes: "Szukaj w notatkach",
  avg_cost: "Śr. koszt",
  no_advanced_features: "Brak włączonych funkcji zaawansowanych",
  no_advanced_features_hint: "Włącz \u201EAdaptacyjne interwały\u201D lub \u201EWzorce sezonowe\u201D w ustawieniach integracji, aby zobaczyć tutaj dane analityczne.",
  analysis_not_enough_data: "Jeszcze za mało danych do analizy.",
  analysis_not_enough_data_hint: "Analiza Weibulla wymaga co najmniej 5 wykonanych konserwacji; wzorce sezonowe stają się widoczne po 6+ punktach danych na miesiąc.",
  analysis_manual_task_hint: "Zadania ręczne bez interwału nie generują danych analitycznych.",
  completions: "wykonania",
  current: "Bieżące",
  shorter: "Krótsze",
  longer: "Dłuższe",
  normal: "Normalne",
  disabled: "Wyłączone",
  compound_logic: "Logika złożona",
  card_title: "Tytuł",
  card_show_header: "Pokaż nagłówek ze statystykami",
  card_show_actions: "Pokaż przyciski akcji",
  card_compact: "Tryb kompaktowy",
  card_max_items: "Maks. elementów (0 = wszystkie)",
  card_filter_status: "Filtruj wg statusu",
  card_filter_status_help: "Puste = pokaż wszystkie statusy.",
  card_filter_objects: "Filtruj wg obiektów",
  card_filter_objects_help: "Puste = pokaż wszystkie obiekty.",
  card_filter_entities: "Filtruj wg encji (entity_ids)",
  card_filter_entities_help: "Wybierz encje sensor / binary_sensor z tej integracji. Puste = wszystkie.",
  card_loading_objects: "Ładowanie obiektów\u2026",
  no_objects: "Brak obiektów.",
  action_error: "Akcja nie powiodła się. Spróbuj ponownie.",
  area_id_optional: "Obszar (opcjonalny)",
  installation_date_optional: "Data instalacji (opcjonalna)",
  custom_icon_optional: "Ikona (opcjonalna, np. mdi:wrench)",
  task_enabled: "Zadanie włączone",
  skip_reason_prompt: "Pominąć to zadanie?",
  reason_optional: "Powód (opcjonalny)",
  reset_date_prompt: "Oznaczyć zadanie jako wykonane?",
  reset_date_optional: "Data ostatniego wykonania (opcjonalna, domyślnie dzisiaj)",
  notes_label: "Notatki",
  documentation_label: "Dokumentacja",
  no_nfc_tag: "— Brak tagu —",
  dashboard: "Pulpit",
  settings: "Ustawienia",
  settings_features: "Funkcje zaawansowane",
  settings_features_desc: "Włącz lub wyłącz funkcje zaawansowane. Wyłączenie ukrywa je z UI, ale nie usuwa danych.",
  feat_adaptive: "Harmonogram adaptacyjny",
  feat_adaptive_desc: "Ucz się optymalnych interwałów z historii konserwacji",
  feat_predictions: "Predykcje czujników",
  feat_predictions_desc: "Przewiduj daty wyzwolenia z degradacji czujnika",
  feat_seasonal: "Korekty sezonowe",
  feat_seasonal_desc: "Dostosuj interwały do wzorców sezonowych",
  feat_environmental: "Korelacja środowiskowa",
  feat_environmental_desc: "Koreluj interwały z temperaturą/wilgotnością",
  feat_budget: "Śledzenie budżetu",
  feat_budget_desc: "Śledź miesięczne i roczne wydatki na konserwację",
  feat_groups: "Grupy zadań",
  feat_groups_desc: "Organizuj zadania w grupy logiczne",
  feat_checklists: "Listy kontrolne",
  feat_checklists_desc: "Wieloetapowe procedury wykonania zadania",
  settings_general: "Ogólne",
  settings_default_warning: "Domyślne dni ostrzeżenia",
  settings_panel_enabled: "Panel boczny",
  settings_notifications: "Powiadomienia",
  settings_notify_service: "Usługa powiadomień",
  test_notification: "Powiadomienie testowe",
  send_test: "Wyślij test",
  testing: "Wysyłanie\u2026",
  test_notification_success: "Powiadomienie testowe wysłane",
  test_notification_failed: "Powiadomienie testowe nie powiodło się",
  settings_notify_due_soon: "Powiadom gdy wkrótce",
  settings_notify_overdue: "Powiadom gdy zaległe",
  settings_notify_triggered: "Powiadom gdy wyzwolone",
  settings_interval_hours: "Interwał powtarzania (godziny, 0 = raz)",
  settings_quiet_hours: "Godziny ciszy",
  settings_quiet_start: "Początek",
  settings_quiet_end: "Koniec",
  settings_max_per_day: "Maks. powiadomień dziennie (0 = bez limitu)",
  settings_bundling: "Grupowanie powiadomień",
  settings_bundle_threshold: "Próg grupowania",
  settings_actions: "Mobilne przyciski akcji",
  settings_action_complete: "Pokaż przycisk 'Wykonaj'",
  settings_action_skip: "Pokaż przycisk 'Pomiń'",
  settings_action_snooze: "Pokaż przycisk 'Drzemka'",
  settings_snooze_hours: "Czas drzemki (godziny)",
  settings_budget: "Budżet",
  settings_currency: "Waluta",
  settings_budget_monthly: "Budżet miesięczny",
  settings_budget_yearly: "Budżet roczny",
  settings_budget_alerts: "Alerty budżetowe",
  settings_budget_threshold: "Próg alertu (%)",
  settings_import_export: "Import / Eksport",
  settings_export_json: "Eksportuj JSON",
  settings_export_csv: "Eksportuj CSV",
  settings_import_csv: "Importuj CSV",
  settings_import_placeholder: "Wklej tutaj zawartość JSON lub CSV\u2026",
  settings_import_btn: "Importuj",
  settings_import_success: "{count} obiektów zaimportowanych pomyślnie.",
  settings_export_success: "Eksport pobrany.",
  settings_saved: "Ustawienie zapisane.",
  settings_include_history: "Dołącz historię",
  sort_alphabetical: "Alfabetycznie",
  sort_due_soonest: "Najbliższy termin",
  sort_task_count: "Liczba zadań",
  sort_area: "Obszar",
  sort_assigned_user: "Przypisany użytkownik",
  sort_group: "Grupa",
  groupby_none: "Bez grupowania",
  groupby_area: "Wg obszaru",
  groupby_group: "Wg grupy",
  groupby_user: "Wg użytkownika",
  unassigned: "Nieprzypisane",
  no_area: "Brak obszaru",
  has_overdue: "Ma zaległe zadania",
  object: "Obiekt",
  settings_panel_access: "Dostęp do panelu",
  settings_panel_access_desc: "Administratorzy zawsze widzą pełny panel. Wybierz tutaj użytkowników nie-admin, którzy również powinni mieć pełny dostęp — pozostali widzą tylko Wykonaj i Pomiń.",
  no_non_admin_users: "Nie znaleziono użytkowników nie-admin. Dodaj ich w Ustawienia → Osoby.",
  owner_label: "Właściciel",
};

const CS: Translations = {
  maintenance: "Údržba",
  objects: "Objekty",
  tasks: "Úkoly",
  overdue: "Po termínu",
  due_soon: "Brzy",
  triggered: "Spuštěno",
  ok: "OK",
  all: "Vše",
  new_object: "+ Nový objekt",
  edit: "Upravit",
  delete: "Smazat",
  add_task: "+ Přidat úkol",
  complete: "Dokončit",
  completed: "Dokončeno",
  skip: "Přeskočit",
  skipped: "Přeskočeno",
  reset: "Reset",
  cancel: "Zrušit",
  completing: "Dokončování\u2026",
  interval: "Interval",
  warning: "Upozornění",
  last_performed: "Naposledy provedeno",
  next_due: "Další termín",
  days_until_due: "Dnů do termínu",
  avg_duration: "Prům. trvání",
  trigger: "Spouštěč",
  trigger_type: "Typ spouštěče",
  threshold_above: "Horní limit",
  threshold_below: "Dolní limit",
  threshold: "Práh",
  counter: "Čítač",
  state_change: "Změna stavu",
  runtime: "Doba běhu",
  runtime_hours: "Cílová doba běhu (hodiny)",
  target_value: "Cílová hodnota",
  baseline: "Základní hodnota",
  target_changes: "Cílový počet změn",
  for_minutes: "Po dobu (minut)",
  time_based: "Časový",
  sensor_based: "Založený na senzoru",
  manual: "Manuální",
  cleaning: "Čištění",
  inspection: "Inspekce",
  replacement: "Výměna",
  calibration: "Kalibrace",
  service: "Servis",
  custom: "Vlastní",
  history: "Historie",
  cost: "Náklady",
  duration: "Doba trvání",
  both: "Obojí",
  trigger_val: "Hodnota spouštěče",
  complete_title: "Dokončit: ",
  checklist: "Kontrolní seznam",
  checklist_steps_optional: "Kroky kontrolního seznamu (volitelné)",
  checklist_placeholder: "Vyčistit filtr\nVyměnit těsnění\nOtestovat tlak",
  checklist_help: "Jeden krok na řádek. Max 100 položek.",
  err_too_long: "{field}: příliš dlouhé (max {n} znaků)",
  err_too_short: "{field}: příliš krátké (min {n} znaků)",
  err_value_too_high: "{field}: příliš velké (max {n})",
  err_value_too_low: "{field}: příliš malé (min {n})",
  err_required: "{field}: povinné",
  err_wrong_type: "{field}: špatný typ (očekáván: {type})",
  err_invalid_choice: "{field}: nepovolená hodnota",
  err_invalid_value: "{field}: neplatná hodnota",
  feat_schedule_time: "Plánování podle denní doby",
  feat_schedule_time_desc: "Úkoly se stanou po termínu v určenou denní dobu místo o půlnoci.",
  schedule_time_optional: "Termín v čase (volitelné, HH:MM)",
  schedule_time_help: "Prázdné = půlnoc (výchozí). Časové pásmo HA.",
  at_time: "v",
  notes_optional: "Poznámky (volitelné)",
  cost_optional: "Náklady (volitelné)",
  duration_minutes: "Doba trvání v minutách (volitelné)",
  days: "dní",
  day: "den",
  today: "Dnes",
  d_overdue: "d po termínu",
  no_tasks: "Zatím žádné úkoly údržby. Vytvořte objekt pro začátek.",
  no_tasks_short: "Žádné úkoly",
  no_history: "Zatím žádné záznamy historie.",
  show_all: "Zobrazit vše",
  cost_duration_chart: "Náklady a doba trvání",
  installed: "Nainstalováno",
  confirm_delete_object: "Smazat tento objekt a všechny jeho úkoly?",
  confirm_delete_task: "Smazat tento úkol?",
  min: "Min",
  max: "Max",
  save: "Uložit",
  saving: "Ukládání\u2026",
  edit_task: "Upravit úkol",
  new_task: "Nový úkol údržby",
  task_name: "Název úkolu",
  maintenance_type: "Typ údržby",
  schedule_type: "Typ rozvrhu",
  interval_days: "Interval (dny)",
  warning_days: "Dny upozornění",
  last_performed_optional: "Naposledy provedeno (volitelné)",
  interval_anchor: "Ukotvení intervalu",
  anchor_completion: "Od data dokončení",
  anchor_planned: "Od plánovaného data (bez posunu)",
  edit_object: "Upravit objekt",
  name: "Název",
  manufacturer_optional: "Výrobce (volitelné)",
  model_optional: "Model (volitelné)",
  serial_number_optional: "Sériové číslo (volitelné)",
  serial_number_label: "S/N",
  sort_due_date: "Termín",
  sort_object: "Název objektu",
  sort_type: "Typ",
  sort_task_name: "Název úkolu",
  all_objects: "Všechny objekty",
  tasks_lower: "úkolů",
  no_tasks_yet: "Zatím žádné úkoly",
  add_first_task: "Přidat první úkol",
  trigger_configuration: "Konfigurace spouštěče",
  entity_id: "ID entity",
  comma_separated: "oddělené čárkami",
  entity_logic: "Logika entit",
  entity_logic_any: "Spustí libovolná entita",
  entity_logic_all: "Všechny entity musí spustit",
  entities: "entity",
  attribute_optional: "Atribut (volitelný, prázdný = stav)",
  use_entity_state: "Použít stav entity (bez atributu)",
  trigger_above: "Spustit nad",
  trigger_below: "Spustit pod",
  for_at_least_minutes: "Po dobu alespoň (minut)",
  safety_interval_days: "Bezpečnostní interval (dny, volitelný)",
  delta_mode: "Režim delta",
  from_state_optional: "Ze stavu (volitelné)",
  to_state_optional: "Do stavu (volitelné)",
  documentation_url_optional: "URL dokumentace (volitelné)",
  nfc_tag_id_optional: "ID NFC tagu (volitelné)",
  environmental_entity_optional: "Senzor prostředí (volitelný)",
  environmental_entity_helper: "např. sensor.outdoor_temperature — upravuje interval podle podmínek prostředí",
  environmental_attribute_optional: "Atribut prostředí (volitelný)",
  nfc_tag_id: "ID NFC tagu",
  nfc_linked: "NFC tag propojen",
  nfc_link_hint: "Klikněte pro propojení NFC tagu",
  responsible_user: "Zodpovědný uživatel",
  no_user_assigned: "(Žádný uživatel přiřazen)",
  all_users: "Všichni uživatelé",
  my_tasks: "Moje úkoly",
  budget_monthly: "Měsíční rozpočet",
  budget_yearly: "Roční rozpočet",
  groups: "Skupiny",
  new_group: "Nová skupina",
  edit_group: "Upravit skupinu",
  no_groups: "Zatím žádné skupiny",
  delete_group: "Smazat skupinu",
  delete_group_confirm: "Smazat skupinu '{name}'?",
  group_select_tasks: "Vybrat úkoly",
  group_name_required: "Název je povinný",
  description_optional: "Popis (volitelný)",
  selected: "Vybráno",
  loading_chart: "Načítání dat grafu...",
  was_maintenance_needed: "Byla tato údržba potřeba?",
  feedback_needed: "Potřebná",
  feedback_not_needed: "Nepotřebná",
  feedback_not_sure: "Nejsem si jistý",
  suggested_interval: "Navrhovaný interval",
  apply_suggestion: "Použít",
  reanalyze: "Znovu analyzovat",
  reanalyze_result: "Nová analýza",
  reanalyze_insufficient_data: "Nedostatek dat pro vytvoření doporučení",
  data_points: "datových bodů",
  dismiss_suggestion: "Zavřít",
  confidence_low: "Nízká",
  confidence_medium: "Střední",
  confidence_high: "Vysoká",
  recommended: "doporučeno",
  seasonal_awareness: "Sezónní povědomí",
  edit_seasonal_overrides: "Upravit sezónní faktory",
  seasonal_overrides_title: "Sezónní faktory (přepsání)",
  seasonal_overrides_hint: "Faktor na měsíc (0.1–5.0). Prázdné = naučeno automaticky.",
  seasonal_override_invalid: "Neplatná hodnota",
  seasonal_override_range: "Faktor musí být mezi 0.1 a 5.0",
  clear_all: "Vymazat vše",
  seasonal_chart_title: "Sezónní faktory",
  seasonal_learned: "Naučené",
  seasonal_manual: "Manuální",
  month_jan: "Led", month_feb: "Úno", month_mar: "Bře", month_apr: "Dub",
  month_may: "Kvě", month_jun: "Čer", month_jul: "Čvc", month_aug: "Srp",
  month_sep: "Zář", month_oct: "Říj", month_nov: "Lis", month_dec: "Pro",
  sensor_prediction: "Predikce senzoru",
  degradation_trend: "Trend",
  trend_rising: "Rostoucí",
  trend_falling: "Klesající",
  trend_stable: "Stabilní",
  trend_insufficient_data: "Nedostatek dat",
  days_until_threshold: "Dnů do prahu",
  threshold_exceeded: "Práh překročen",
  environmental_adjustment: "Faktor prostředí",
  sensor_prediction_urgency: "Senzor předpovídá práh za ~{days} dní",
  day_short: "d",
  weibull_reliability_curve: "Křivka spolehlivosti",
  weibull_failure_probability: "Pravděpodobnost selhání",
  weibull_r_squared: "Shoda R²",
  beta_early_failures: "Časná selhání",
  beta_random_failures: "Náhodná selhání",
  beta_wear_out: "Opotřebení",
  beta_highly_predictable: "Vysoce předvídatelné",
  confidence_interval: "Interval spolehlivosti",
  confidence_conservative: "Konzervativní",
  confidence_aggressive: "Optimistický",
  current_interval_marker: "Aktuální interval",
  recommended_marker: "Doporučený",
  characteristic_life: "Charakteristická životnost",
  chart_mini_sparkline: "Graf trendu",
  chart_history: "Historie nákladů a doby trvání",
  chart_seasonal: "Sezónní faktory, 12 měsíců",
  chart_weibull: "Weibullova křivka spolehlivosti",
  chart_sparkline: "Graf hodnoty spouštěče senzoru",
  days_progress: "Postup dnů",
  qr_code: "QR kód",
  qr_generating: "Generování QR kódu\u2026",
  qr_error: "Nepodařilo se vygenerovat QR kód.",
  qr_error_no_url: "Není nakonfigurováno URL HA. Nastavte externí nebo interní URL v Nastavení \u2192 Systém \u2192 Síť.",
  save_error: "Nepodařilo se uložit. Zkuste to znovu.",
  qr_print: "Tisk",
  qr_download: "Stáhnout SVG",
  qr_action: "Akce při skenování",
  qr_action_view: "Zobrazit informace o údržbě",
  qr_action_complete: "Označit údržbu jako dokončenou",
  qr_url_mode: "Typ odkazu",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Lokální (mDNS)",
  qr_mode_server: "URL serveru",
  overview: "Přehled",
  analysis: "Analýza",
  recent_activities: "Nedávné aktivity",
  search_notes: "Hledat v poznámkách",
  avg_cost: "Prům. náklady",
  no_advanced_features: "Žádné pokročilé funkce nejsou povoleny",
  no_advanced_features_hint: "Povolte \u201EAdaptivní intervaly\u201D nebo \u201ESezónní vzory\u201D v nastavení integrace pro zobrazení analytických dat.",
  analysis_not_enough_data: "Zatím nedostatek dat pro analýzu.",
  analysis_not_enough_data_hint: "Weibullova analýza vyžaduje alespoň 5 dokončených údržeb; sezónní vzory se stanou viditelné po 6+ datových bodech na měsíc.",
  analysis_manual_task_hint: "Manuální úkoly bez intervalu negenerují analytická data.",
  completions: "dokončení",
  current: "Aktuální",
  shorter: "Kratší",
  longer: "Delší",
  normal: "Normální",
  disabled: "Zakázáno",
  compound_logic: "Složená logika",
  card_title: "Název",
  card_show_header: "Zobrazit záhlaví se statistikami",
  card_show_actions: "Zobrazit tlačítka akcí",
  card_compact: "Kompaktní režim",
  card_max_items: "Max položek (0 = vše)",
  card_filter_status: "Filtrovat podle stavu",
  card_filter_status_help: "Prázdné = zobrazit všechny stavy.",
  card_filter_objects: "Filtrovat podle objektů",
  card_filter_objects_help: "Prázdné = zobrazit všechny objekty.",
  card_filter_entities: "Filtrovat podle entit (entity_ids)",
  card_filter_entities_help: "Vyberte entity sensor / binary_sensor z této integrace. Prázdné = všechny.",
  card_loading_objects: "Načítání objektů\u2026",
  no_objects: "Zatím žádné objekty.",
  action_error: "Akce se nezdařila. Zkuste to znovu.",
  area_id_optional: "Oblast (volitelná)",
  installation_date_optional: "Datum instalace (volitelné)",
  custom_icon_optional: "Ikona (volitelná, např. mdi:wrench)",
  task_enabled: "Úkol povolen",
  skip_reason_prompt: "Přeskočit tento úkol?",
  reason_optional: "Důvod (volitelný)",
  reset_date_prompt: "Označit úkol jako provedený?",
  reset_date_optional: "Datum posledního provedení (volitelné, výchozí dnes)",
  notes_label: "Poznámky",
  documentation_label: "Dokumentace",
  no_nfc_tag: "— Žádný tag —",
  dashboard: "Přehled",
  settings: "Nastavení",
  settings_features: "Pokročilé funkce",
  settings_features_desc: "Povolte nebo zakažte pokročilé funkce. Zakázání je skryje z UI, ale nesmaže data.",
  feat_adaptive: "Adaptivní plánování",
  feat_adaptive_desc: "Učte se optimální intervaly z historie údržby",
  feat_predictions: "Predikce senzorů",
  feat_predictions_desc: "Předpovídejte termíny spouštění z degradace senzoru",
  feat_seasonal: "Sezónní úpravy",
  feat_seasonal_desc: "Upravte intervaly podle sezónních vzorů",
  feat_environmental: "Korelace s prostředím",
  feat_environmental_desc: "Korelujte intervaly s teplotou/vlhkostí",
  feat_budget: "Sledování rozpočtu",
  feat_budget_desc: "Sledujte měsíční a roční výdaje na údržbu",
  feat_groups: "Skupiny úkolů",
  feat_groups_desc: "Organizujte úkoly do logických skupin",
  feat_checklists: "Kontrolní seznamy",
  feat_checklists_desc: "Vícestupňové procedury pro dokončení úkolu",
  settings_general: "Obecné",
  settings_default_warning: "Výchozí dny upozornění",
  settings_panel_enabled: "Boční panel",
  settings_notifications: "Oznámení",
  settings_notify_service: "Služba oznámení",
  test_notification: "Testovací oznámení",
  send_test: "Odeslat test",
  testing: "Odesílání\u2026",
  test_notification_success: "Testovací oznámení odesláno",
  test_notification_failed: "Testovací oznámení se nezdařilo",
  settings_notify_due_soon: "Oznámit když brzy",
  settings_notify_overdue: "Oznámit když po termínu",
  settings_notify_triggered: "Oznámit když spuštěno",
  settings_interval_hours: "Interval opakování (hodiny, 0 = jednou)",
  settings_quiet_hours: "Tiché hodiny",
  settings_quiet_start: "Začátek",
  settings_quiet_end: "Konec",
  settings_max_per_day: "Max oznámení denně (0 = bez limitu)",
  settings_bundling: "Seskupit oznámení",
  settings_bundle_threshold: "Práh seskupení",
  settings_actions: "Mobilní akční tlačítka",
  settings_action_complete: "Zobrazit tlačítko 'Dokončit'",
  settings_action_skip: "Zobrazit tlačítko 'Přeskočit'",
  settings_action_snooze: "Zobrazit tlačítko 'Odložit'",
  settings_snooze_hours: "Doba odložení (hodiny)",
  settings_budget: "Rozpočet",
  settings_currency: "Měna",
  settings_budget_monthly: "Měsíční rozpočet",
  settings_budget_yearly: "Roční rozpočet",
  settings_budget_alerts: "Rozpočtová upozornění",
  settings_budget_threshold: "Práh upozornění (%)",
  settings_import_export: "Import / Export",
  settings_export_json: "Exportovat JSON",
  settings_export_csv: "Exportovat CSV",
  settings_import_csv: "Importovat CSV",
  settings_import_placeholder: "Vložte sem obsah JSON nebo CSV\u2026",
  settings_import_btn: "Importovat",
  settings_import_success: "{count} objektů úspěšně importováno.",
  settings_export_success: "Export stažen.",
  settings_saved: "Nastavení uloženo.",
  settings_include_history: "Zahrnout historii",
  sort_alphabetical: "Abecedně",
  sort_due_soonest: "Nejbližší termín",
  sort_task_count: "Počet úkolů",
  sort_area: "Oblast",
  sort_assigned_user: "Přiřazený uživatel",
  sort_group: "Skupina",
  groupby_none: "Bez seskupení",
  groupby_area: "Podle oblasti",
  groupby_group: "Podle skupiny",
  groupby_user: "Podle uživatele",
  unassigned: "Nepřiřazeno",
  no_area: "Bez oblasti",
  has_overdue: "Má úkoly po termínu",
  object: "Objekt",
  settings_panel_access: "Přístup k panelu",
  settings_panel_access_desc: "Administrátoři vždy vidí celý panel. Vyberte zde uživatele bez admin práv, kteří by měli také mít plný přístup — ostatní vidí pouze Dokončit a Přeskočit.",
  no_non_admin_users: "Nenalezeni žádní uživatelé bez admin práv. Přidejte je v Nastavení → Lidé.",
  owner_label: "Vlastník",
};

const SV: Translations = {
  maintenance: "Underhåll",
  objects: "Objekt",
  tasks: "Uppgifter",
  overdue: "Försenad",
  due_soon: "Snart",
  triggered: "Utlöst",
  ok: "OK",
  all: "Alla",
  new_object: "+ Nytt objekt",
  edit: "Redigera",
  delete: "Ta bort",
  add_task: "+ Lägg till uppgift",
  complete: "Slutför",
  completed: "Slutförd",
  skip: "Hoppa över",
  skipped: "Hoppade över",
  reset: "Återställ",
  cancel: "Avbryt",
  completing: "Slutför\u2026",
  interval: "Intervall",
  warning: "Varning",
  last_performed: "Senast utförd",
  next_due: "Nästa förfallodatum",
  days_until_due: "Dagar till förfallodatum",
  avg_duration: "Snittlig varaktighet",
  trigger: "Utlösare",
  trigger_type: "Utlösartyp",
  threshold_above: "Övre gräns",
  threshold_below: "Undre gräns",
  threshold: "Tröskel",
  counter: "Räknare",
  state_change: "Tillståndsändring",
  runtime: "Körtid",
  runtime_hours: "Måltid (timmar)",
  target_value: "Målvärde",
  baseline: "Baslinje",
  target_changes: "Antal målförändringar",
  for_minutes: "Under (minuter)",
  time_based: "Tidsbaserad",
  sensor_based: "Sensorbaserad",
  manual: "Manuell",
  cleaning: "Rengöring",
  inspection: "Inspektion",
  replacement: "Byte",
  calibration: "Kalibrering",
  service: "Service",
  custom: "Anpassad",
  history: "Historik",
  cost: "Kostnad",
  duration: "Varaktighet",
  both: "Båda",
  trigger_val: "Utlösarvärde",
  complete_title: "Slutför: ",
  checklist: "Checklista",
  checklist_steps_optional: "Checkliststeg (valfritt)",
  checklist_placeholder: "Rengör filter\nByt tätning\nTesta tryck",
  checklist_help: "Ett steg per rad. Max 100 objekt.",
  err_too_long: "{field}: för lång (max {n} tecken)",
  err_too_short: "{field}: för kort (min {n} tecken)",
  err_value_too_high: "{field}: för stor (max {n})",
  err_value_too_low: "{field}: för liten (min {n})",
  err_required: "{field}: krävs",
  err_wrong_type: "{field}: fel typ (förväntad: {type})",
  err_invalid_choice: "{field}: ej tillåtet värde",
  err_invalid_value: "{field}: ogiltigt värde",
  feat_schedule_time: "Schemaläggning per tid på dygnet",
  feat_schedule_time_desc: "Uppgifter blir försenade vid en specifik tid på dygnet istället för midnatt.",
  schedule_time_optional: "Förfaller kl. (valfritt, HH:MM)",
  schedule_time_help: "Tomt = midnatt (standard). HA-tidszon.",
  at_time: "kl.",
  notes_optional: "Anteckningar (valfritt)",
  cost_optional: "Kostnad (valfritt)",
  duration_minutes: "Varaktighet i minuter (valfritt)",
  days: "dagar",
  day: "dag",
  today: "Idag",
  d_overdue: "d försenad",
  no_tasks: "Inga underhållsuppgifter ännu. Skapa ett objekt för att komma igång.",
  no_tasks_short: "Inga uppgifter",
  no_history: "Inga historikposter ännu.",
  show_all: "Visa alla",
  cost_duration_chart: "Kostnad och varaktighet",
  installed: "Installerad",
  confirm_delete_object: "Ta bort detta objekt och alla dess uppgifter?",
  confirm_delete_task: "Ta bort denna uppgift?",
  min: "Min",
  max: "Max",
  save: "Spara",
  saving: "Sparar\u2026",
  edit_task: "Redigera uppgift",
  new_task: "Ny underhållsuppgift",
  task_name: "Uppgiftsnamn",
  maintenance_type: "Underhållstyp",
  schedule_type: "Schematyp",
  interval_days: "Intervall (dagar)",
  warning_days: "Varningsdagar",
  last_performed_optional: "Senast utförd (valfritt)",
  interval_anchor: "Intervallankare",
  anchor_completion: "Från slutförandedatum",
  anchor_planned: "Från planerat datum (ingen drift)",
  edit_object: "Redigera objekt",
  name: "Namn",
  manufacturer_optional: "Tillverkare (valfritt)",
  model_optional: "Modell (valfritt)",
  serial_number_optional: "Serienummer (valfritt)",
  serial_number_label: "S/N",
  sort_due_date: "Förfallodatum",
  sort_object: "Objektnamn",
  sort_type: "Typ",
  sort_task_name: "Uppgiftsnamn",
  all_objects: "Alla objekt",
  tasks_lower: "uppgifter",
  no_tasks_yet: "Inga uppgifter ännu",
  add_first_task: "Lägg till första uppgift",
  trigger_configuration: "Utlösarkonfiguration",
  entity_id: "Entitets-ID",
  comma_separated: "kommaseparerad",
  entity_logic: "Entitetslogik",
  entity_logic_any: "Vilken entitet som helst utlöser",
  entity_logic_all: "Alla entiteter måste utlösa",
  entities: "entiteter",
  attribute_optional: "Attribut (valfritt, tomt = tillstånd)",
  use_entity_state: "Använd entitetstillstånd (inget attribut)",
  trigger_above: "Utlös över",
  trigger_below: "Utlös under",
  for_at_least_minutes: "Under minst (minuter)",
  safety_interval_days: "Säkerhetsintervall (dagar, valfritt)",
  delta_mode: "Delta-läge",
  from_state_optional: "Från tillstånd (valfritt)",
  to_state_optional: "Till tillstånd (valfritt)",
  documentation_url_optional: "Dokumentations-URL (valfritt)",
  nfc_tag_id_optional: "NFC-tagg-ID (valfritt)",
  environmental_entity_optional: "Miljösensor (valfritt)",
  environmental_entity_helper: "t.ex. sensor.outdoor_temperature — justerar intervallet baserat på miljöförhållanden",
  environmental_attribute_optional: "Miljöattribut (valfritt)",
  nfc_tag_id: "NFC-tagg-ID",
  nfc_linked: "NFC-tagg länkad",
  nfc_link_hint: "Klicka för att länka NFC-tagg",
  responsible_user: "Ansvarig användare",
  no_user_assigned: "(Ingen användare tilldelad)",
  all_users: "Alla användare",
  my_tasks: "Mina uppgifter",
  budget_monthly: "Månatlig budget",
  budget_yearly: "Årlig budget",
  groups: "Grupper",
  new_group: "Ny grupp",
  edit_group: "Redigera grupp",
  no_groups: "Inga grupper ännu",
  delete_group: "Ta bort grupp",
  delete_group_confirm: "Ta bort grupp '{name}'?",
  group_select_tasks: "Välj uppgifter",
  group_name_required: "Namn krävs",
  description_optional: "Beskrivning (valfritt)",
  selected: "Valda",
  loading_chart: "Laddar diagramdata...",
  was_maintenance_needed: "Behövdes detta underhåll?",
  feedback_needed: "Behövdes",
  feedback_not_needed: "Behövdes inte",
  feedback_not_sure: "Osäker",
  suggested_interval: "Föreslaget intervall",
  apply_suggestion: "Tillämpa",
  reanalyze: "Analysera igen",
  reanalyze_result: "Ny analys",
  reanalyze_insufficient_data: "Otillräckligt med data för rekommendation",
  data_points: "datapunkter",
  dismiss_suggestion: "Avvisa",
  confidence_low: "Låg",
  confidence_medium: "Medel",
  confidence_high: "Hög",
  recommended: "rekommenderad",
  seasonal_awareness: "Säsongsmedvetenhet",
  edit_seasonal_overrides: "Redigera säsongsfaktorer",
  seasonal_overrides_title: "Säsongsfaktorer (åsidosätt)",
  seasonal_overrides_hint: "Faktor per månad (0.1–5.0). Tomt = lärt automatiskt.",
  seasonal_override_invalid: "Ogiltigt värde",
  seasonal_override_range: "Faktor måste vara mellan 0.1 och 5.0",
  clear_all: "Rensa alla",
  seasonal_chart_title: "Säsongsfaktorer",
  seasonal_learned: "Lärt",
  seasonal_manual: "Manuell",
  month_jan: "Jan", month_feb: "Feb", month_mar: "Mar", month_apr: "Apr",
  month_may: "Maj", month_jun: "Jun", month_jul: "Jul", month_aug: "Aug",
  month_sep: "Sep", month_oct: "Okt", month_nov: "Nov", month_dec: "Dec",
  sensor_prediction: "Sensorprediktion",
  degradation_trend: "Trend",
  trend_rising: "Stigande",
  trend_falling: "Fallande",
  trend_stable: "Stabil",
  trend_insufficient_data: "Otillräcklig data",
  days_until_threshold: "Dagar till tröskel",
  threshold_exceeded: "Tröskel överskriden",
  environmental_adjustment: "Miljöfaktor",
  sensor_prediction_urgency: "Sensor förutsäger tröskel om ~{days} dagar",
  day_short: "d",
  weibull_reliability_curve: "Tillförlitlighetskurva",
  weibull_failure_probability: "Felsannolikhet",
  weibull_r_squared: "Anpassning R²",
  beta_early_failures: "Tidiga fel",
  beta_random_failures: "Slumpmässiga fel",
  beta_wear_out: "Slitage",
  beta_highly_predictable: "Mycket förutsägbar",
  confidence_interval: "Konfidensintervall",
  confidence_conservative: "Konservativ",
  confidence_aggressive: "Optimistisk",
  current_interval_marker: "Aktuellt intervall",
  recommended_marker: "Rekommenderat",
  characteristic_life: "Karakteristisk livslängd",
  chart_mini_sparkline: "Trenddiagram",
  chart_history: "Kostnads- och varaktighetshistorik",
  chart_seasonal: "Säsongsfaktorer, 12 månader",
  chart_weibull: "Weibull tillförlitlighetskurva",
  chart_sparkline: "Sensorutlösarvärdesdiagram",
  days_progress: "Dagsförlopp",
  qr_code: "QR-kod",
  qr_generating: "Genererar QR-kod\u2026",
  qr_error: "Kunde inte generera QR-kod.",
  qr_error_no_url: "Ingen HA-URL konfigurerad. Ange en extern eller intern URL i Inställningar \u2192 System \u2192 Nätverk.",
  save_error: "Kunde inte spara. Försök igen.",
  qr_print: "Skriv ut",
  qr_download: "Ladda ner SVG",
  qr_action: "Åtgärd vid skanning",
  qr_action_view: "Visa underhållsinformation",
  qr_action_complete: "Markera underhåll som slutfört",
  qr_url_mode: "Länktyp",
  qr_mode_companion: "Companion App",
  qr_mode_local: "Lokal (mDNS)",
  qr_mode_server: "Server-URL",
  overview: "Översikt",
  analysis: "Analys",
  recent_activities: "Senaste aktiviteter",
  search_notes: "Sök i anteckningar",
  avg_cost: "Snittlig kostnad",
  no_advanced_features: "Inga avancerade funktioner aktiverade",
  no_advanced_features_hint: "Aktivera \u201EAdaptiva intervall\u201D eller \u201ESäsongsmönster\u201D i integrationsinställningar för att se analysdata här.",
  analysis_not_enough_data: "Inte tillräckligt med data för analys ännu.",
  analysis_not_enough_data_hint: "Weibull-analys kräver minst 5 slutförda underhåll; säsongsmönster blir synliga efter 6+ datapunkter per månad.",
  analysis_manual_task_hint: "Manuella uppgifter utan intervall genererar inte analysdata.",
  completions: "slutföranden",
  current: "Aktuell",
  shorter: "Kortare",
  longer: "Längre",
  normal: "Normal",
  disabled: "Inaktiverad",
  compound_logic: "Sammansatt logik",
  card_title: "Titel",
  card_show_header: "Visa rubrik med statistik",
  card_show_actions: "Visa åtgärdsknappar",
  card_compact: "Kompakt läge",
  card_max_items: "Max objekt (0 = alla)",
  card_filter_status: "Filtrera efter status",
  card_filter_status_help: "Tomt = visa alla statusar.",
  card_filter_objects: "Filtrera efter objekt",
  card_filter_objects_help: "Tomt = visa alla objekt.",
  card_filter_entities: "Filtrera efter entiteter (entity_ids)",
  card_filter_entities_help: "Välj sensor- / binary_sensor-entiteter från denna integration. Tomt = alla.",
  card_loading_objects: "Laddar objekt\u2026",
  no_objects: "Inga objekt än.",
  action_error: "Åtgärden misslyckades. Försök igen.",
  area_id_optional: "Område (valfritt)",
  installation_date_optional: "Installationsdatum (valfritt)",
  custom_icon_optional: "Ikon (valfritt, t.ex. mdi:wrench)",
  task_enabled: "Uppgift aktiverad",
  skip_reason_prompt: "Hoppa över denna uppgift?",
  reason_optional: "Anledning (valfritt)",
  reset_date_prompt: "Markera uppgift som utförd?",
  reset_date_optional: "Datum för senaste utförande (valfritt, standard idag)",
  notes_label: "Anteckningar",
  documentation_label: "Dokumentation",
  no_nfc_tag: "— Ingen tagg —",
  dashboard: "Översikt",
  settings: "Inställningar",
  settings_features: "Avancerade funktioner",
  settings_features_desc: "Aktivera eller inaktivera avancerade funktioner. Inaktivering döljer dem från UI men tar inte bort data.",
  feat_adaptive: "Adaptiv schemaläggning",
  feat_adaptive_desc: "Lär dig optimala intervall från underhållshistorik",
  feat_predictions: "Sensorpredictions",
  feat_predictions_desc: "Förutsäg utlösningsdatum från sensordegradering",
  feat_seasonal: "Säsongsjusteringar",
  feat_seasonal_desc: "Justera intervall baserat på säsongsmönster",
  feat_environmental: "Miljökorrelation",
  feat_environmental_desc: "Korrelera intervall med temperatur/luftfuktighet",
  feat_budget: "Budgetuppföljning",
  feat_budget_desc: "Spåra månatliga och årliga underhållsutgifter",
  feat_groups: "Uppgiftsgrupper",
  feat_groups_desc: "Organisera uppgifter i logiska grupper",
  feat_checklists: "Checklistor",
  feat_checklists_desc: "Flerstegs procedurer för uppgiftens slutförande",
  settings_general: "Allmänt",
  settings_default_warning: "Standard varningsdagar",
  settings_panel_enabled: "Sidopanel",
  settings_notifications: "Notifikationer",
  settings_notify_service: "Notifikationstjänst",
  test_notification: "Testnotifikation",
  send_test: "Skicka test",
  testing: "Skickar\u2026",
  test_notification_success: "Testnotifikation skickad",
  test_notification_failed: "Testnotifikation misslyckades",
  settings_notify_due_soon: "Notifiera när snart förfallande",
  settings_notify_overdue: "Notifiera när försenad",
  settings_notify_triggered: "Notifiera när utlöst",
  settings_interval_hours: "Upprepningsintervall (timmar, 0 = en gång)",
  settings_quiet_hours: "Tysta timmar",
  settings_quiet_start: "Start",
  settings_quiet_end: "Slut",
  settings_max_per_day: "Max notifikationer per dag (0 = obegränsat)",
  settings_bundling: "Bunta notifikationer",
  settings_bundle_threshold: "Buntningströskel",
  settings_actions: "Mobila åtgärdsknappar",
  settings_action_complete: "Visa 'Slutför'-knapp",
  settings_action_skip: "Visa 'Hoppa över'-knapp",
  settings_action_snooze: "Visa 'Snooza'-knapp",
  settings_snooze_hours: "Snooza-tid (timmar)",
  settings_budget: "Budget",
  settings_currency: "Valuta",
  settings_budget_monthly: "Månatlig budget",
  settings_budget_yearly: "Årlig budget",
  settings_budget_alerts: "Budgetvarningar",
  settings_budget_threshold: "Varningströskel (%)",
  settings_import_export: "Import / Export",
  settings_export_json: "Exportera JSON",
  settings_export_csv: "Exportera CSV",
  settings_import_csv: "Importera CSV",
  settings_import_placeholder: "Klistra in JSON- eller CSV-innehåll här\u2026",
  settings_import_btn: "Importera",
  settings_import_success: "{count} objekt importerade.",
  settings_export_success: "Export nedladdad.",
  settings_saved: "Inställning sparad.",
  settings_include_history: "Inkludera historik",
  sort_alphabetical: "Alfabetisk",
  sort_due_soonest: "Närmaste förfallodatum",
  sort_task_count: "Antal uppgifter",
  sort_area: "Område",
  sort_assigned_user: "Tilldelad användare",
  sort_group: "Grupp",
  groupby_none: "Ingen gruppering",
  groupby_area: "Per område",
  groupby_group: "Per grupp",
  groupby_user: "Per användare",
  unassigned: "Otilldelad",
  no_area: "Inget område",
  has_overdue: "Har försenade uppgifter",
  object: "Objekt",
  settings_panel_access: "Paneltillgång",
  settings_panel_access_desc: "Administratörer ser alltid hela panelen. Välj icke-admin-användare nedan som också ska få full paneltillgång — alla andra icke-admins ser endast Slutför och Hoppa över.",
  no_non_admin_users: "Inga icke-admin-användare hittades. Lägg till några i Inställningar → Personer.",
  owner_label: "Ägare",
};

const TRANSLATIONS: Record<string, Translations> = { de: DE, en: EN, nl: NL, fr: FR, it: IT, es: ES, pt: PT, ru: RU, uk: UK, pl: PL, cs: CS, sv: SV };

/** Get a localized string. Falls back to English, then to key. */
export function t(key: string, lang?: string): string {
  const l = (lang || "en").substring(0, 2).toLowerCase();
  return TRANSLATIONS[l]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

/** Map language prefix to BCP-47 locale for date formatting. */
function langToLocale(lang?: string): string {
  const l = (lang || "en").substring(0, 2).toLowerCase();
  const map: Record<string, string> = {
    de: "de-DE", en: "en-US", nl: "nl-NL", fr: "fr-FR", it: "it-IT", es: "es-ES", pt: "pt-PT", ru: "ru-RU", uk: "uk-UA"
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
    justify-content: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: white;
    white-space: nowrap;
    /* Fixed minimum so OK / Due Soon / Overdue / Triggered pills are uniform
       width in the task table — keeps the object-name column aligned. */
    min-width: 70px;
    box-sizing: border-box;
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

  /* Overdue indicator dot on object cards (#35) */
  .object-card { position: relative; }
  .object-card-overdue { border-left: 3px solid var(--error-color); }
  .overdue-dot {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--error-color);
    box-shadow: 0 0 0 2px var(--card-background-color);
  }

  /* Group-by collapsible sections (#35 + #36) */
  .group-section {
    margin: 12px 0;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--card-background-color);
  }
  .group-section[open] { padding-bottom: 8px; }
  .group-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    cursor: pointer;
    font-weight: 500;
    list-style: none;
    user-select: none;
  }
  .group-section-header::-webkit-details-marker { display: none; }
  .group-section-header::before {
    content: "▶";
    font-size: 10px;
    color: var(--secondary-text-color);
    transition: transform 0.15s;
  }
  .group-section[open] .group-section-header::before { transform: rotate(90deg); }
  .group-section-count {
    color: var(--secondary-text-color);
    font-size: 13px;
    font-weight: 400;
  }
  .group-section .objects-grid,
  .group-section .task-table {
    padding: 0 12px;
  }

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

  .group-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .group-card-name {
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .group-card-actions {
    display: flex;
    gap: 0;
  }
  .group-card-actions mwc-icon-button {
    --mdc-icon-button-size: 28px;
    --mdc-icon-size: 16px;
    color: var(--secondary-text-color);
  }

  .groups-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .groups-header h3 { margin: 0; }

  .seasonal-actions {
    display: flex;
    justify-content: flex-end;
    padding: 4px 0;
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
