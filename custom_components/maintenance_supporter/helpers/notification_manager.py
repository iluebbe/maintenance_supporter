"""Notification manager for maintenance reminders."""

from __future__ import annotations

import logging
from collections.abc import Mapping
from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from ..const import (
    BUDGET_CURRENCIES,
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_DUE_SOON_INTERVAL,
    CONF_NOTIFY_EVENT_ONLY,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_SNOOZE_DURATION_HOURS,
    CONF_TASK_PRIORITY,
    CONF_TASKS,
    DEFAULT_BUDGET_CURRENCY,
    DEFAULT_CURRENCY_DECIMALS,
    DEFAULT_TASK_PRIORITY,
    DOMAIN,
    NOTIFIABLE_STATUSES,
    NOTIFICATION_TITLE_STYLES,
    MaintenanceStatus,
    TaskPriority,
)
from .global_options import get_global_options
from .i18n import normalize_language
from .notification_gates import STATUS_ENABLED_KEYS, status_reminder_enabled, task_may_notify
from .notify_hooks import (
    KIND_BUDGET,
    KIND_BUNDLE,
    KIND_DIGEST,
    KIND_LEAD_TIME,
    KIND_QUIET_END,
    KIND_STATUS,
    KIND_WARRANTY,
    async_emit_and_dispatch,
    notification_context,
)
from .settings_registry import setting_default

_LOGGER = logging.getLogger(__name__)

# Repair-issue id raised when the *configured* global notify service does not
# exist (e.g. the mobile app or notify group it points at was removed), so
# notifications would silently fail. Scope is the top-level service only — a
# broken member *inside* a notify group is invisible here (HA dispatches to the
# working members and only logs the bad one), so we never flag that case.
_NOTIFY_SERVICE_MISSING_ISSUE_ID = "notify_service_missing"

# Sentinel value: interval=0 means "notify once, never repeat".
# A naive datetime.max is intentionally NOT comparable with the timezone-aware
# values stored elsewhere in self._last_notified — every code path that touches
# this sentinel guards on equality (`last == _SENT_ONCE` / `last != _SENT_ONCE`)
# BEFORE attempting any subtraction, so the naive/aware mix never reaches an
# arithmetic operation. Replacing with a tz-aware version would still work but
# adds noise; the sentinel is a singleton, not a real timestamp.
_SENT_ONCE = datetime.max  # noqa: DTZ901 - intentional naive sentinel, see comment above

# The manager's bookkeeping survives a restart (2026-09-13): what was sent when
# (incl. the "once" marks), snoozes, the daily counter, the lead dedup, the
# fairness sets and the reminders quiet hours are holding. Without it every
# restart re-announced everything once the trigger entities came back.
STATE_STORE_KEY = f"{DOMAIN}.notification_state"
STATE_STORE_VERSION = 1
_STATE_SAVE_DELAY = 5

# --- Notification message translations ---
_NOTIFICATION_STRINGS: dict[str, dict[str, str]] = {
    "de": {
        "open_task_link": "Aufgabe öffnen",
        "due_soon_title": "Wartung bald fällig",
        "due_soon_message": "{task} für {object} ist in {days} Tag(en) fällig (Fällig: {due}).",
        "overdue_title": "Wartung überfällig!",
        "overdue_message": "{task} für {object} ist {days} Tag(e) überfällig!",
        "triggered_title": "Wartung ausgelöst",
        "triggered_message": "{task} für {object} wurde durch Sensordaten ausgelöst.",
        "action_complete": "Erledigt",
        "action_skip": "Überspringen",
        "action_snooze": "Später",
        "bundled_title": "Wartung: {count} Aufgaben",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} Erinnerungen aus der Ruhezeit",
        "digest_title": "Wöchentliche Wartungsübersicht",
        "digest_message": "{overdue} überfällig, {due_soon} diese Woche fällig.",
        "warranty_title": "Garantie läuft bald ab",
        "warranty_message": "{count} Objekt(e) mit Garantie-Ablauf in {days} Tagen: {names}",
        "completed_title": 'Aufgabe erledigt',
        "completed_message": '{task} für {object}: {reason}{who}',
        "completed_by": ' — von {name}',
        "reason_panel": 'im Panel erledigt',
        "reason_qr": 'per QR-Scan erledigt',
        "reason_nfc": 'per NFC-Tag erledigt',
        "reason_button": 'über die Button-Entität erledigt',
        "reason_todo": 'in der To-do-Liste abgehakt',
        "reason_voice": 'per Sprache erledigt',
        "reason_notification_action": 'aus der Benachrichtigung erledigt',
        "reason_shopping_list": 'über die Einkaufsliste nachgefüllt',
        "reason_service": 'von einer Automation erledigt',
        "reason_auto_recovery": 'automatisch erledigt, der Sensor hat sich erholt',
        "reason_unknown": 'erledigt',
        "bundled_overdue": "{task} (überfällig)",
        "bundled_due_soon": "{task} (bald fällig)",
        "bundled_triggered": "{task} (ausgelöst)",
        "budget_alert_title": "Wartungsbudget-Warnung",
        "budget_alert_monthly": "Monatsbudget zu {pct}% ausgeschöpft ({spent} von {budget})",
        "budget_alert_yearly": "Jahresbudget zu {pct}% ausgeschöpft ({spent} von {budget})",
    },
    "nl": {
        "open_task_link": "Taak openen",
        "due_soon_title": "Onderhoud binnenkort",
        "due_soon_message": "{task} voor {object} is over {days} dag(en) te doen (Vervaldatum: {due}).",
        "overdue_title": "Onderhoud achterstallig!",
        "overdue_message": "{task} voor {object} is {days} dag(en) achterstallig!",
        "triggered_title": "Onderhoud geactiveerd",
        "triggered_message": "{task} voor {object} is geactiveerd door sensordata.",
        "action_complete": "Voltooid",
        "action_skip": "Overslaan",
        "action_snooze": "Later",
        "bundled_title": "Onderhoud: {count} taken",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} herinneringen uit de stille uren",
        "digest_title": "Wekelijks onderhoudsoverzicht",
        "digest_message": "{overdue} achterstallig, {due_soon} deze week.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Taak voltooid',
        "completed_message": '{task} voor {object}: {reason}{who}',
        "completed_by": ' — door {name}',
        "reason_panel": 'voltooid in het paneel',
        "reason_qr": 'voltooid via QR-scan',
        "reason_nfc": 'voltooid via NFC-tag',
        "reason_button": 'voltooid via de knop-entiteit',
        "reason_todo": 'afgevinkt in de takenlijst',
        "reason_voice": 'voltooid via spraak',
        "reason_notification_action": 'voltooid vanuit de notificatie',
        "reason_shopping_list": 'aangevuld via de boodschappenlijst',
        "reason_service": 'voltooid door een automatisering',
        "reason_auto_recovery": 'automatisch voltooid, de sensor is hersteld',
        "reason_unknown": 'voltooid',
        "bundled_overdue": "{task} (achterstallig)",
        "bundled_due_soon": "{task} (binnenkort)",
        "bundled_triggered": "{task} (geactiveerd)",
        "budget_alert_title": "Onderhoudsbudget waarschuwing",
        "budget_alert_monthly": "Maandbudget op {pct}% ({spent} van {budget})",
        "budget_alert_yearly": "Jaarbudget op {pct}% ({spent} van {budget})",
    },
    "fr": {
        "open_task_link": "Ouvrir la tâche",
        "due_soon_title": "Maintenance bientôt due",
        "due_soon_message": "{task} pour {object} est dû dans {days} jour(s) (Échéance : {due}).",
        "overdue_title": "Maintenance en retard !",
        "overdue_message": "{task} pour {object} est en retard de {days} jour(s) !",
        "triggered_title": "Maintenance déclenchée",
        "triggered_message": "{task} pour {object} a été déclenchée par les données du capteur.",
        "action_complete": "Terminé",
        "action_skip": "Ignorer",
        "action_snooze": "Reporter",
        "bundled_title": "Maintenance : {count} tâches",
        "bundled_message": "{object} : {task_list}",
        "quiet_end_title": "{count} rappels des heures calmes",
        "digest_title": "Récapitulatif hebdomadaire d'entretien",
        "digest_message": "{overdue} en retard, {due_soon} cette semaine.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Tâche terminée',
        "completed_message": '{task} pour {object} : {reason}{who}',
        "completed_by": ' — par {name}',
        "reason_panel": 'terminée dans le panneau',
        "reason_qr": 'terminée par scan QR',
        "reason_nfc": 'terminée par tag NFC',
        "reason_button": "terminée via l'entité bouton",
        "reason_todo": 'cochée dans la liste de tâches',
        "reason_voice": 'terminée à la voix',
        "reason_notification_action": 'terminée depuis la notification',
        "reason_shopping_list": 'réapprovisionnée via la liste de courses',
        "reason_service": 'terminée par une automatisation',
        "reason_auto_recovery": "terminée automatiquement, le capteur s'est rétabli",
        "reason_unknown": 'terminée',
        "bundled_overdue": "{task} (en retard)",
        "bundled_due_soon": "{task} (bientôt dû)",
        "bundled_triggered": "{task} (déclenché)",
        "budget_alert_title": "Alerte budget maintenance",
        "budget_alert_monthly": "Budget mensuel à {pct}% ({spent} sur {budget})",
        "budget_alert_yearly": "Budget annuel à {pct}% ({spent} sur {budget})",
    },
    "it": {
        "open_task_link": "Apri l'attività",
        "due_soon_title": "Manutenzione in scadenza",
        "due_soon_message": "{task} per {object} è in scadenza tra {days} giorno/i (Scadenza: {due}).",
        "overdue_title": "Manutenzione scaduta!",
        "overdue_message": "{task} per {object} è scaduta da {days} giorno/i!",
        "triggered_title": "Manutenzione attivata",
        "triggered_message": "{task} per {object} è stata attivata dai dati del sensore.",
        "action_complete": "Completato",
        "action_skip": "Salta",
        "action_snooze": "Posticipa",
        "bundled_title": "Manutenzione: {count} attività",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} promemoria dalle ore di silenzio",
        "digest_title": "Riepilogo settimanale manutenzione",
        "digest_message": "{overdue} scadute, {due_soon} questa settimana.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Attività completata',
        "completed_message": '{task} per {object}: {reason}{who}',
        "completed_by": ' — da {name}',
        "reason_panel": 'completata nel pannello',
        "reason_qr": 'completata con scansione QR',
        "reason_nfc": 'completata con tag NFC',
        "reason_button": "completata tramite l'entità pulsante",
        "reason_todo": 'spuntata nella lista delle cose da fare',
        "reason_voice": 'completata a voce',
        "reason_notification_action": 'completata dalla notifica',
        "reason_shopping_list": 'rifornita dalla lista della spesa',
        "reason_service": "completata da un'automazione",
        "reason_auto_recovery": 'completata automaticamente, il sensore si è ripristinato',
        "reason_unknown": 'completata',
        "bundled_overdue": "{task} (scaduta)",
        "bundled_due_soon": "{task} (in scadenza)",
        "bundled_triggered": "{task} (attivata)",
        "budget_alert_title": "Avviso budget manutenzione",
        "budget_alert_monthly": "Budget mensile al {pct}% ({spent} di {budget})",
        "budget_alert_yearly": "Budget annuale al {pct}% ({spent} di {budget})",
    },
    "es": {
        "open_task_link": "Abrir la tarea",
        "due_soon_title": "Mantenimiento próximo",
        "due_soon_message": "{task} para {object} vence en {days} día(s) (Vencimiento: {due}).",
        "overdue_title": "¡Mantenimiento vencido!",
        "overdue_message": "¡{task} para {object} está vencido por {days} día(s)!",
        "triggered_title": "Mantenimiento activado",
        "triggered_message": "{task} para {object} ha sido activado por datos del sensor.",
        "action_complete": "Completar",
        "action_skip": "Omitir",
        "action_snooze": "Posponer",
        "bundled_title": "Mantenimiento: {count} tareas",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} recordatorios de las horas de silencio",
        "digest_title": "Resumen semanal de mantenimiento",
        "digest_message": "{overdue} vencidas, {due_soon} esta semana.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Tarea completada',
        "completed_message": '{task} para {object}: {reason}{who}',
        "completed_by": ' — por {name}',
        "reason_panel": 'completada en el panel',
        "reason_qr": 'completada por escaneo QR',
        "reason_nfc": 'completada por etiqueta NFC',
        "reason_button": 'completada mediante la entidad botón',
        "reason_todo": 'marcada en la lista de tareas',
        "reason_voice": 'completada por voz',
        "reason_notification_action": 'completada desde la notificación',
        "reason_shopping_list": 'repuesta desde la lista de la compra',
        "reason_service": 'completada por una automatización',
        "reason_auto_recovery": 'completada automáticamente, el sensor se recuperó',
        "reason_unknown": 'completada',
        "bundled_overdue": "{task} (vencido)",
        "bundled_due_soon": "{task} (próximo)",
        "bundled_triggered": "{task} (activado)",
        "budget_alert_title": "Alerta de presupuesto de mantenimiento",
        "budget_alert_monthly": "Presupuesto mensual al {pct}% ({spent} de {budget})",
        "budget_alert_yearly": "Presupuesto anual al {pct}% ({spent} de {budget})",
    },
    "en": {
        "open_task_link": "Open task",
        "due_soon_title": "Maintenance Due Soon",
        "due_soon_message": "{task} for {object} is due in {days} day(s) (Due: {due}).",
        "overdue_title": "Maintenance Overdue!",
        "overdue_message": "{task} for {object} is {days} day(s) overdue!",
        "triggered_title": "Maintenance Triggered",
        "triggered_message": "{task} for {object} has been triggered by sensor data.",
        "action_complete": "Complete",
        "action_skip": "Skip",
        "action_snooze": "Snooze",
        "bundled_title": "Maintenance: {count} tasks",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} reminders held during quiet hours",
        "digest_title": "Weekly maintenance digest",
        "digest_message": "{overdue} overdue, {due_soon} due this week.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Task completed',
        "completed_message": '{task} for {object}: {reason}{who}',
        "completed_by": ' — by {name}',
        "reason_panel": 'completed in the panel',
        "reason_qr": 'completed by QR scan',
        "reason_nfc": 'completed by NFC tag',
        "reason_button": 'completed via the button entity',
        "reason_todo": 'ticked off in the to-do list',
        "reason_voice": 'completed by voice',
        "reason_notification_action": 'completed from the notification',
        "reason_shopping_list": 'restocked from the shopping list',
        "reason_service": 'completed by an automation',
        "reason_auto_recovery": 'auto-completed, the sensor recovered',
        "reason_unknown": 'completed',
        "bundled_overdue": "{task} (overdue)",
        "bundled_due_soon": "{task} (due soon)",
        "bundled_triggered": "{task} (triggered)",
        "budget_alert_title": "Maintenance Budget Warning",
        "budget_alert_monthly": "Monthly budget at {pct}% ({spent} of {budget})",
        "budget_alert_yearly": "Yearly budget at {pct}% ({spent} of {budget})",
    },
    "da": {
        "open_task_link": "Åbn opgaven",
        "due_soon_title": "Vedligeholdelse snart forfalden",
        "due_soon_message": "{task} for {object} forfalder om {days} dag(e) (Forfalder: {due}).",
        "overdue_title": "Vedligeholdelse forfalden!",
        "overdue_message": "{task} for {object} er {days} dag(e) forsinket!",
        "triggered_title": "Vedligeholdelse udløst",
        "triggered_message": "{task} for {object} blev udløst af sensordata.",
        "action_complete": "Udført",
        "action_skip": "Spring over",
        "action_snooze": "Senere",
        "bundled_title": "Vedligeholdelse: {count} opgaver",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} påmindelser fra de stille timer",
        "digest_title": "Ugentlig vedligeholdelsesoversigt",
        "digest_message": "{overdue} forfaldne, {due_soon} denne uge.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Opgave fuldført',
        "completed_message": '{task} for {object}: {reason}{who}',
        "completed_by": ' — af {name}',
        "reason_panel": 'fuldført i panelet',
        "reason_qr": 'fuldført via QR-scanning',
        "reason_nfc": 'fuldført via NFC-tag',
        "reason_button": 'fuldført via knap-entiteten',
        "reason_todo": 'afkrydset på to-do-listen',
        "reason_voice": 'fuldført med stemmen',
        "reason_notification_action": 'fuldført fra notifikationen',
        "reason_shopping_list": 'genopfyldt fra indkøbslisten',
        "reason_service": 'fuldført af en automatisering',
        "reason_auto_recovery": 'fuldført automatisk, sensoren kom sig',
        "reason_unknown": 'fuldført',
        "bundled_overdue": "{task} (forfalden)",
        "bundled_due_soon": "{task} (snart forfalden)",
        "bundled_triggered": "{task} (udløst)",
        "budget_alert_title": "Advarsel om vedligeholdelsesbudget",
        "budget_alert_monthly": "Månedsbudget på {pct}% ({spent} af {budget})",
        "budget_alert_yearly": "Årsbudget på {pct}% ({spent} af {budget})",
    },
    "fi": {
        "open_task_link": "Avaa tehtävä",
        "due_soon_title": "Huolto erääntyy pian",
        "due_soon_message": "{task} kohteelle {object} erääntyy {days} päivän kuluttua (Eräpäivä: {due}).",
        "overdue_title": "Huolto myöhässä!",
        "overdue_message": "{task} kohteelle {object} on {days} päivää myöhässä!",
        "triggered_title": "Huolto käynnistetty",
        "triggered_message": "{task} kohteelle {object} käynnistyi anturitietojen perusteella.",
        "action_complete": "Valmis",
        "action_skip": "Ohita",
        "action_snooze": "Myöhemmin",
        "bundled_title": "Huolto: {count} tehtävää",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} muistutusta hiljaisilta tunneilta",
        "digest_title": "Viikoittainen huoltokooste",
        "digest_message": "{overdue} myöhässä, {due_soon} tällä viikolla.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Tehtävä valmis',
        "completed_message": '{task} kohteelle {object}: {reason}{who}',
        "completed_by": ' — tekijä {name}',
        "reason_panel": 'suoritettu paneelissa',
        "reason_qr": 'suoritettu QR-skannauksella',
        "reason_nfc": 'suoritettu NFC-tunnisteella',
        "reason_button": 'suoritettu painike-entiteetillä',
        "reason_todo": 'kuitattu tehtävälistalla',
        "reason_voice": 'suoritettu puheella',
        "reason_notification_action": 'suoritettu ilmoituksesta',
        "reason_shopping_list": 'täydennetty ostoslistalta',
        "reason_service": 'suoritettu automaatiolla',
        "reason_auto_recovery": 'suoritettu automaattisesti, anturi palautui',
        "reason_unknown": 'suoritettu',
        "bundled_overdue": "{task} (myöhässä)",
        "bundled_due_soon": "{task} (pian)",
        "bundled_triggered": "{task} (käynnistetty)",
        "budget_alert_title": "Huoltobudjetin varoitus",
        "budget_alert_monthly": "Kuukausibudjetti {pct}% ({spent} / {budget})",
        "budget_alert_yearly": "Vuosibudjetti {pct}% ({spent} / {budget})",
    },
    "nb": {
        "open_task_link": "Åpne oppgaven",
        "due_soon_title": "Vedlikehold forfaller snart",
        "due_soon_message": "{task} for {object} forfaller om {days} dag(er) (Forfaller: {due}).",
        "overdue_title": "Vedlikehold forfalt!",
        "overdue_message": "{task} for {object} er {days} dag(er) forsinket!",
        "triggered_title": "Vedlikehold utløst",
        "triggered_message": "{task} for {object} ble utløst av sensordata.",
        "action_complete": "Fullført",
        "action_skip": "Hopp over",
        "action_snooze": "Senere",
        "bundled_title": "Vedlikehold: {count} oppgaver",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} påminnelser fra de stille timene",
        "digest_title": "Ukentlig vedlikeholdsoversikt",
        "digest_message": "{overdue} forfalt, {due_soon} denne uken.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Oppgave fullført',
        "completed_message": '{task} for {object}: {reason}{who}',
        "completed_by": ' — av {name}',
        "reason_panel": 'fullført i panelet',
        "reason_qr": 'fullført via QR-skanning',
        "reason_nfc": 'fullført via NFC-tagg',
        "reason_button": 'fullført via knapp-entiteten',
        "reason_todo": 'huket av i gjøremålslisten',
        "reason_voice": 'fullført med stemme',
        "reason_notification_action": 'fullført fra varselet',
        "reason_shopping_list": 'etterfylt fra handlelisten',
        "reason_service": 'fullført av en automasjon',
        "reason_auto_recovery": 'fullført automatisk, sensoren kom seg',
        "reason_unknown": 'fullført',
        "bundled_overdue": "{task} (forfalt)",
        "bundled_due_soon": "{task} (snart)",
        "bundled_triggered": "{task} (utløst)",
        "budget_alert_title": "Varsel om vedlikeholdsbudsjett",
        "budget_alert_monthly": "Månedsbudsjett på {pct}% ({spent} av {budget})",
        "budget_alert_yearly": "Årsbudsjett på {pct}% ({spent} av {budget})",
    },
    "ja": {
        "open_task_link": "タスクを開く",
        "due_soon_title": "メンテナンス期限間近",
        "due_soon_message": "{object} の {task} はあと {days} 日で期限です（期限: {due}）。",
        "overdue_title": "メンテナンス期限超過！",
        "overdue_message": "{object} の {task} は {days} 日超過しています！",
        "triggered_title": "メンテナンス起動",
        "triggered_message": "{object} の {task} がセンサーデータにより起動されました。",
        "action_complete": "完了",
        "action_skip": "スキップ",
        "action_snooze": "後で",
        "bundled_title": "メンテナンス: {count} 件のタスク",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "静音時間中の{count}件のリマインダー",
        "digest_title": "週間メンテナンスまとめ",
        "digest_message": "期限切れ {overdue} 件、今週 {due_soon} 件。",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'タスク完了',
        "completed_message": '{object} の {task}：{reason}{who}',
        "completed_by": '（{name}）',
        "reason_panel": 'パネルで完了',
        "reason_qr": 'QR スキャンで完了',
        "reason_nfc": 'NFC タグで完了',
        "reason_button": 'ボタンエンティティで完了',
        "reason_todo": 'To-do リストでチェック',
        "reason_voice": '音声で完了',
        "reason_notification_action": '通知から完了',
        "reason_shopping_list": '買い物リストから補充',
        "reason_service": 'オートメーションで完了',
        "reason_auto_recovery": 'センサー回復により自動完了',
        "reason_unknown": '完了',
        "bundled_overdue": "{task}（超過）",
        "bundled_due_soon": "{task}（間近）",
        "bundled_triggered": "{task}（起動）",
        "budget_alert_title": "メンテナンス予算の警告",
        "budget_alert_monthly": "月間予算が {pct}%（{budget} 中 {spent}）",
        "budget_alert_yearly": "年間予算が {pct}%（{budget} 中 {spent}）",
    },
    "hi": {
        "open_task_link": "कार्य खोलें",
        "due_soon_title": "रखरखाव जल्द देय",
        "due_soon_message": "{object} के लिए {task} {days} दिन में देय है (देय: {due})।",
        "overdue_title": "रखरखाव अतिदेय!",
        "overdue_message": "{object} के लिए {task} {days} दिन अतिदेय है!",
        "triggered_title": "रखरखाव ट्रिगर हुआ",
        "triggered_message": "{object} के लिए {task} सेंसर डेटा द्वारा ट्रिगर हुआ।",
        "action_complete": "पूर्ण",
        "action_skip": "छोड़ें",
        "action_snooze": "बाद में",
        "bundled_title": "रखरखाव: {count} कार्य",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "शांत घंटों के {count} अनुस्मारक",
        "digest_title": "साप्ताहिक रखरखाव सारांश",
        "digest_message": "{overdue} अतिदेय, {due_soon} इस सप्ताह।",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'कार्य पूरा हुआ',
        "completed_message": '{object} के लिए {task}: {reason}{who}',
        "completed_by": ' — {name} द्वारा',
        "reason_panel": 'पैनल में पूरा किया',
        "reason_qr": 'QR स्कैन से पूरा किया',
        "reason_nfc": 'NFC टैग से पूरा किया',
        "reason_button": 'बटन एंटिटी से पूरा किया',
        "reason_todo": 'टू-डू सूची में टिक किया',
        "reason_voice": 'आवाज़ से पूरा किया',
        "reason_notification_action": 'सूचना से पूरा किया',
        "reason_shopping_list": 'खरीदारी सूची से पुनः भरा',
        "reason_service": 'ऑटोमेशन द्वारा पूरा किया',
        "reason_auto_recovery": 'स्वतः पूरा, सेंसर ठीक हो गया',
        "reason_unknown": 'पूरा किया',
        "bundled_overdue": "{task} (अतिदेय)",
        "bundled_due_soon": "{task} (जल्द देय)",
        "bundled_triggered": "{task} (ट्रिगर)",
        "budget_alert_title": "रखरखाव बजट चेतावनी",
        "budget_alert_monthly": "मासिक बजट {pct}% पर ({budget} में से {spent})",
        "budget_alert_yearly": "वार्षिक बजट {pct}% पर ({budget} में से {spent})",
    },
    "zh": {
        "open_task_link": "打开任务",
        "due_soon_title": "维护即将到期",
        "due_soon_message": "{object} 的 {task} 将在 {days} 天后到期（到期日期：{due}）。",
        "overdue_title": "维护已超期！",
        "overdue_message": "{object} 的 {task} 已超期 {days} 天！",
        "triggered_title": "维护已触发",
        "triggered_message": "传感器数据已触发 {object} 的 {task}。",
        "action_complete": "完成",
        "action_skip": "跳过",
        "action_snooze": "稍后提醒",
        "bundled_title": "维护：共有 {count} 项任务",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "静音时段积累的 {count} 条提醒",
        "digest_title": "每周维护摘要",
        "digest_message": "逾期 {overdue} 项，本周 {due_soon} 项。",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": '任务已完成',
        "completed_message": '{object} 的 {task}：{reason}{who}',
        "completed_by": '（{name}）',
        "reason_panel": '在面板中完成',
        "reason_qr": '通过二维码扫描完成',
        "reason_nfc": '通过 NFC 标签完成',
        "reason_button": '通过按钮实体完成',
        "reason_todo": '在待办清单中勾选',
        "reason_voice": '通过语音完成',
        "reason_notification_action": '从通知中完成',
        "reason_shopping_list": '从购物清单补货',
        "reason_service": '由自动化完成',
        "reason_auto_recovery": '传感器恢复，自动完成',
        "reason_unknown": '已完成',
        "bundled_overdue": "{task}（超期）",
        "bundled_due_soon": "{task}（即将到期）",
        "bundled_triggered": "{task}（已触发）",
        "budget_alert_title": "维护预算警报",
        "budget_alert_monthly": "月度预算已达 {pct}%（已支出 {spent} / 总预算 {budget}）",
        "budget_alert_yearly": "年度预算已达 {pct}%（已支出 {spent} / 总预算 {budget}）",
    },
    "ru": {
        "open_task_link": "Открыть задачу",
        "due_soon_title": "Обслуживание скоро требуется",
        "due_soon_message": "{task} для {object} требуется через {days} дн. (Срок: {due}).",
        "overdue_title": "Обслуживание просрочено!",
        "overdue_message": "{task} для {object} просрочено на {days} дн.!",
        "triggered_title": "Обслуживание сработало",
        "triggered_message": "{task} для {object} было запущено по данным датчика.",
        "action_complete": "Выполнить",
        "action_skip": "Пропустить",
        "action_snooze": "Отложить",
        "bundled_title": "Обслуживание: {count} задач",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} напоминаний за тихие часы",
        "digest_title": "Еженедельная сводка обслуживания",
        "digest_message": "{overdue} просрочено, {due_soon} на этой неделе.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Задача выполнена',
        "completed_message": '{task} для {object}: {reason}{who}',
        "completed_by": ' — {name}',
        "reason_panel": 'выполнено в панели',
        "reason_qr": 'выполнено по QR-коду',
        "reason_nfc": 'выполнено по NFC-метке',
        "reason_button": 'выполнено через кнопку',
        "reason_todo": 'отмечено в списке дел',
        "reason_voice": 'выполнено голосом',
        "reason_notification_action": 'выполнено из уведомления',
        "reason_shopping_list": 'пополнено из списка покупок',
        "reason_service": 'выполнено автоматизацией',
        "reason_auto_recovery": 'выполнено автоматически: датчик восстановился',
        "reason_unknown": 'выполнено',
        "bundled_overdue": "{task} (просрочено)",
        "bundled_due_soon": "{task} (скоро)",
        "bundled_triggered": "{task} (сработало)",
        "budget_alert_title": "Предупреждение о бюджете обслуживания",
        "budget_alert_monthly": "Месячный бюджет: {pct}% ({spent} из {budget})",
        "budget_alert_yearly": "Годовой бюджет: {pct}% ({spent} из {budget})",
    },
    "uk": {
        "open_task_link": "Відкрити завдання",
        "due_soon_title": "Незабаром термін обслуговування",
        "due_soon_message": "{task} для {object} через {days} день(днів) (Термін: {due}).",
        "overdue_title": "Обслуговування прострочено!",
        "overdue_message": "{task} для {object} прострочено на {days} день(днів)!",
        "triggered_title": "Обслуговування спрацювало",
        "triggered_message": "{task} для {object} спрацювало за даними сенсора.",
        "action_complete": "Виконати",
        "action_skip": "Пропустити",
        "action_snooze": "Відкласти",
        "bundled_title": "Обслуговування: {count} завдань",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} нагадувань за тихі години",
        "digest_title": "Щотижневий огляд обслуговування",
        "digest_message": "{overdue} прострочено, {due_soon} цього тижня.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Завдання виконано',
        "completed_message": '{task} для {object}: {reason}{who}',
        "completed_by": ' — {name}',
        "reason_panel": 'виконано в панелі',
        "reason_qr": 'виконано за QR-кодом',
        "reason_nfc": 'виконано за NFC-міткою',
        "reason_button": 'виконано через кнопку',
        "reason_todo": 'позначено в списку справ',
        "reason_voice": 'виконано голосом',
        "reason_notification_action": 'виконано зі сповіщення',
        "reason_shopping_list": 'поповнено зі списку покупок',
        "reason_service": 'виконано автоматизацією',
        "reason_auto_recovery": 'виконано автоматично: датчик відновився',
        "reason_unknown": 'виконано',
        "bundled_overdue": "{task} (прострочено)",
        "bundled_due_soon": "{task} (незабаром)",
        "bundled_triggered": "{task} (спрацювало)",
        "budget_alert_title": "Попередження про бюджет обслуговування",
        "budget_alert_monthly": "Щомісячний бюджет використано на {pct}% ({spent} з {budget})",
        "budget_alert_yearly": "Щорічний бюджет використано на {pct}% ({spent} з {budget})",
    },
    "pt": {
        "open_task_link": "Abrir a tarefa",
        "due_soon_title": "Manutenção em breve",
        "due_soon_message": "{task} para {object} é necessário em {days} dia(s) (Prazo: {due}).",
        "overdue_title": "Manutenção atrasada!",
        "overdue_message": "{task} para {object} está atrasado em {days} dia(s)!",
        "triggered_title": "Manutenção acionada",
        "triggered_message": "{task} para {object} foi acionado por dados do sensor.",
        "action_complete": "Concluir",
        "action_skip": "Ignorar",
        "action_snooze": "Adiar",
        "bundled_title": "Manutenção: {count} tarefas",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} lembretes das horas de silêncio",
        "digest_title": "Resumo semanal de manutenção",
        "digest_message": "{overdue} atrasadas, {due_soon} esta semana.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Tarefa concluída',
        "completed_message": '{task} para {object}: {reason}{who}',
        "completed_by": ' — por {name}',
        "reason_panel": 'concluída no painel',
        "reason_qr": 'concluída por leitura QR',
        "reason_nfc": 'concluída por etiqueta NFC',
        "reason_button": 'concluída através da entidade botão',
        "reason_todo": 'assinalada na lista de tarefas',
        "reason_voice": 'concluída por voz',
        "reason_notification_action": 'concluída a partir da notificação',
        "reason_shopping_list": 'reposta a partir da lista de compras',
        "reason_service": 'concluída por uma automação',
        "reason_auto_recovery": 'concluída automaticamente, o sensor recuperou',
        "reason_unknown": 'concluída',
        "bundled_overdue": "{task} (atrasado)",
        "bundled_due_soon": "{task} (em breve)",
        "bundled_triggered": "{task} (acionado)",
        "budget_alert_title": "Alerta de orçamento de manutenção",
        "budget_alert_monthly": "Orçamento mensal em {pct}% ({spent} de {budget})",
        "budget_alert_yearly": "Orçamento anual em {pct}% ({spent} de {budget})",
    },
    # v1.4.2: Polish notifications (panel + config-flow have been pl since v1.3.3
    # but phone notifications still went out in English).
    "pl": {
        "open_task_link": "Otwórz zadanie",
        "due_soon_title": "Wkrótce wymagana konserwacja",
        "due_soon_message": "{task} dla {object} wymagane za {days} dni (Termin: {due}).",
        "overdue_title": "Konserwacja przeterminowana!",
        "overdue_message": "{task} dla {object} jest przeterminowane o {days} dni!",
        "triggered_title": "Konserwacja wyzwolona",
        "triggered_message": "{task} dla {object} zostało wyzwolone przez dane z czujnika.",
        "action_complete": "Zakończ",
        "action_skip": "Pomiń",
        "action_snooze": "Drzemka",
        "bundled_title": "Konserwacja: {count} zadań",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} przypomnień z godzin ciszy",
        "digest_title": "Cotygodniowe podsumowanie konserwacji",
        "digest_message": "{overdue} zaległych, {due_soon} w tym tygodniu.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Zadanie ukończone',
        "completed_message": '{task} dla {object}: {reason}{who}',
        "completed_by": ' — przez {name}',
        "reason_panel": 'ukończone w panelu',
        "reason_qr": 'ukończone przez skan QR',
        "reason_nfc": 'ukończone przez tag NFC',
        "reason_button": 'ukończone przez encję przycisku',
        "reason_todo": 'odhaczone na liście zadań',
        "reason_voice": 'ukończone głosowo',
        "reason_notification_action": 'ukończone z powiadomienia',
        "reason_shopping_list": 'uzupełnione z listy zakupów',
        "reason_service": 'ukończone przez automatyzację',
        "reason_auto_recovery": 'ukończone automatycznie, czujnik wrócił do normy',
        "reason_unknown": 'ukończone',
        "bundled_overdue": "{task} (przeterminowane)",
        "bundled_due_soon": "{task} (wkrótce)",
        "bundled_triggered": "{task} (wyzwolone)",
        "budget_alert_title": "Ostrzeżenie o budżecie konserwacji",
        "budget_alert_monthly": "Budżet miesięczny na poziomie {pct}% ({spent} z {budget})",
        "budget_alert_yearly": "Budżet roczny na poziomie {pct}% ({spent} z {budget})",
    },
    # v1.4.2: Czech notifications (panel UI is cs since v1.0.41; closing the
    # config-flow + notification gap together).
    "cs": {
        "open_task_link": "Otevřít úkol",
        "due_soon_title": "Údržba se blíží",
        "due_soon_message": "{task} pro {object} je třeba za {days} dní (Termín: {due}).",
        "overdue_title": "Údržba po termínu!",
        "overdue_message": "{task} pro {object} je {days} dní po termínu!",
        "triggered_title": "Údržba spuštěna",
        "triggered_message": "{task} pro {object} bylo spuštěno daty ze senzoru.",
        "action_complete": "Hotovo",
        "action_skip": "Přeskočit",
        "action_snooze": "Odložit",
        "bundled_title": "Údržba: {count} úkolů",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} připomínek z tichých hodin",
        "digest_title": "Týdenní přehled údržby",
        "digest_message": "{overdue} po termínu, {due_soon} tento týden.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Úkol dokončen',
        "completed_message": '{task} pro {object}: {reason}{who}',
        "completed_by": ' — {name}',
        "reason_panel": 'dokončeno v panelu',
        "reason_qr": 'dokončeno skenem QR',
        "reason_nfc": 'dokončeno NFC tagem',
        "reason_button": 'dokončeno přes entitu tlačítka',
        "reason_todo": 'odškrtnuto v seznamu úkolů',
        "reason_voice": 'dokončeno hlasem',
        "reason_notification_action": 'dokončeno z oznámení',
        "reason_shopping_list": 'doplněno z nákupního seznamu',
        "reason_service": 'dokončeno automatizací',
        "reason_auto_recovery": 'dokončeno automaticky, senzor se zotavil',
        "reason_unknown": 'dokončeno',
        "bundled_overdue": "{task} (po termínu)",
        "bundled_due_soon": "{task} (brzy)",
        "bundled_triggered": "{task} (spuštěno)",
        "budget_alert_title": "Upozornění na rozpočet údržby",
        "budget_alert_monthly": "Měsíční rozpočet na {pct}% ({spent} z {budget})",
        "budget_alert_yearly": "Roční rozpočet na {pct}% ({spent} z {budget})",
    },
    # v1.4.2: Swedish notifications.
    "sv": {
        "open_task_link": "Öppna uppgiften",
        "due_soon_title": "Underhåll snart",
        "due_soon_message": "{task} för {object} förfaller om {days} dag(ar) (Förfaller: {due}).",
        "overdue_title": "Underhåll försenat!",
        "overdue_message": "{task} för {object} är {days} dag(ar) försenat!",
        "triggered_title": "Underhåll utlöst",
        "triggered_message": "{task} för {object} har utlösts av sensordata.",
        "action_complete": "Slutför",
        "action_skip": "Hoppa över",
        "action_snooze": "Snooza",
        "bundled_title": "Underhåll: {count} uppgifter",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} påminnelser från de tysta timmarna",
        "digest_title": "Veckovis underhållssammanfattning",
        "digest_message": "{overdue} försenade, {due_soon} denna vecka.",
        "warranty_title": "Warranty expiring soon",
        "warranty_message": "{count} object(s) with warranty expiring within {days} days: {names}",
        "completed_title": 'Uppgift slutförd',
        "completed_message": '{task} för {object}: {reason}{who}',
        "completed_by": ' — av {name}',
        "reason_panel": 'slutförd i panelen',
        "reason_qr": 'slutförd via QR-skanning',
        "reason_nfc": 'slutförd via NFC-tagg',
        "reason_button": 'slutförd via knappentiteten',
        "reason_todo": 'avbockad i att-göra-listan',
        "reason_voice": 'slutförd med rösten',
        "reason_notification_action": 'slutförd från aviseringen',
        "reason_shopping_list": 'påfylld via inköpslistan',
        "reason_service": 'slutförd av en automation',
        "reason_auto_recovery": 'slutförd automatiskt, sensorn återhämtade sig',
        "reason_unknown": 'slutförd',
        "bundled_overdue": "{task} (försenat)",
        "bundled_due_soon": "{task} (snart)",
        "bundled_triggered": "{task} (utlöst)",
        "budget_alert_title": "Varning för underhållsbudget",
        "budget_alert_monthly": "Månadsbudget på {pct}% ({spent} av {budget})",
        "budget_alert_yearly": "Årsbudget på {pct}% ({spent} av {budget})",
    },
    "pt-br": {
        "open_task_link": "Abrir a tarefa",
        "due_soon_title": "Manutenção em breve",
        "due_soon_message": "{task} de {object} vence em {days} dia(s) (vencimento: {due}).",
        "overdue_title": "Manutenção atrasada!",
        "overdue_message": "{task} de {object} está {days} dia(s) atrasada!",
        "triggered_title": "Manutenção acionada",
        "triggered_message": "{task} de {object} foi acionada por dados de sensor.",
        "action_complete": "Concluir",
        "action_skip": "Pular",
        "action_snooze": "Adiar",
        "bundled_title": "Manutenção: {count} tarefas",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} lembretes das horas de silêncio",
        "digest_title": "Resumo semanal de manutenção",
        "digest_message": "{overdue} atrasadas, {due_soon} vencem nesta semana.",
        "warranty_title": "Garantia expirando em breve",
        "warranty_message": "{count} objeto(s) com garantia expirando em {days} dias: {names}",
        "completed_title": 'Tarefa concluída',
        "completed_message": '{task} para {object}: {reason}{who}',
        "completed_by": ' — por {name}',
        "reason_panel": 'concluída no painel',
        "reason_qr": 'concluída por leitura de QR',
        "reason_nfc": 'concluída por tag NFC',
        "reason_button": 'concluída pela entidade de botão',
        "reason_todo": 'marcada na lista de tarefas',
        "reason_voice": 'concluída por voz',
        "reason_notification_action": 'concluída pela notificação',
        "reason_shopping_list": 'reposta pela lista de compras',
        "reason_service": 'concluída por uma automação',
        "reason_auto_recovery": 'concluída automaticamente, o sensor se recuperou',
        "reason_unknown": 'concluída',
        "bundled_overdue": "{task} (atrasada)",
        "bundled_due_soon": "{task} (em breve)",
        "bundled_triggered": "{task} (acionada)",
        "budget_alert_title": "Alerta de orçamento de manutenção",
        "budget_alert_monthly": "Orçamento mensal em {pct}% ({spent} de {budget})",
        "budget_alert_yearly": "Orçamento anual em {pct}% ({spent} de {budget})",
    },
    "hu": {
        "open_task_link": "Feladat megnyitása",
        "due_soon_title": "Karbantartás hamarosan esedékes",
        "due_soon_message": "{object} – {task} {days} nap múlva esedékes (határidő: {due}).",
        "overdue_title": "Karbantartás lejárt!",
        "overdue_message": "{object} – {task} {days} napja esedékes!",
        "triggered_title": "Karbantartás aktiválódott",
        "triggered_message": "{object} – {task} feladatot érzékelőadatok aktiválták.",
        "action_complete": "Kész",
        "action_skip": "Kihagyás",
        "action_snooze": "Halasztás",
        "bundled_title": "Karbantartás: {count} feladat",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "{count} emlékeztető a csendes órákból",
        "digest_title": "Heti karbantartási összefoglaló",
        "digest_message": "{overdue} lejárt, {due_soon} esedékes ezen a héten.",
        "warranty_title": "Hamarosan lejáró garancia",
        "warranty_message": "{count} objektum garanciája jár le {days} napon belül: {names}",
        "completed_title": 'Feladat elvégezve',
        "completed_message": '{task} ({object}): {reason}{who}',
        "completed_by": ' — {name}',
        "reason_panel": 'a panelen elvégezve',
        "reason_qr": 'QR-beolvasással elvégezve',
        "reason_nfc": 'NFC-címkével elvégezve',
        "reason_button": 'a gomb-entitáson keresztül elvégezve',
        "reason_todo": 'kipipálva a teendőlistán',
        "reason_voice": 'hanggal elvégezve',
        "reason_notification_action": 'az értesítésből elvégezve',
        "reason_shopping_list": 'a bevásárlólistáról feltöltve',
        "reason_service": 'automatizálás végezte el',
        "reason_auto_recovery": 'automatikusan elvégezve, az érzékelő helyreállt',
        "reason_unknown": 'elvégezve',
        "bundled_overdue": "{task} (lejárt)",
        "bundled_due_soon": "{task} (hamarosan)",
        "bundled_triggered": "{task} (aktiválva)",
        "budget_alert_title": "Karbantartási keret figyelmeztetés",
        "budget_alert_monthly": "Havi keret {pct}%-on ({spent} / {budget})",
        "budget_alert_yearly": "Éves keret {pct}%-on ({spent} / {budget})",
    },
    "ko": {
        "open_task_link": "작업 열기",
        "due_soon_title": "곧 예정된 유지보수",
        "due_soon_message": "{object}의 {task}이(가) {days}일 후 예정입니다 (기한: {due}).",
        "overdue_title": "유지보수 기한 초과!",
        "overdue_message": "{object}의 {task}이(가) {days}일 지났습니다!",
        "triggered_title": "유지보수 트리거됨",
        "triggered_message": "{object}의 {task}이(가) 센서 데이터로 트리거되었습니다.",
        "action_complete": "완료",
        "action_skip": "건너뛰기",
        "action_snooze": "미루기",
        "bundled_title": "유지보수: 작업 {count}개",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "방해 금지 시간 동안 쌓인 알림 {count}건",
        "digest_title": "주간 유지보수 요약",
        "digest_message": "기한 초과 {overdue}건, 이번 주 예정 {due_soon}건.",
        "warranty_title": "보증 기간 만료 임박",
        "warranty_message": "{days}일 이내에 보증이 만료되는 객체 {count}개: {names}",
        "completed_title": '작업 완료',
        "completed_message": '{object}의 {task}: {reason}{who}',
        "completed_by": ' — {name}',
        "reason_panel": '패널에서 완료',
        "reason_qr": 'QR 스캔으로 완료',
        "reason_nfc": 'NFC 태그로 완료',
        "reason_button": '버튼 엔티티로 완료',
        "reason_todo": '할 일 목록에서 체크',
        "reason_voice": '음성으로 완료',
        "reason_notification_action": '알림에서 완료',
        "reason_shopping_list": '쇼핑 목록에서 보충',
        "reason_service": '자동화가 완료',
        "reason_auto_recovery": '센서 복구로 자동 완료',
        "reason_unknown": '완료',
        "bundled_overdue": "{task} (기한 초과)",
        "bundled_due_soon": "{task} (곧 예정)",
        "bundled_triggered": "{task} (트리거됨)",
        "budget_alert_title": "유지보수 예산 경고",
        "budget_alert_monthly": "월 예산 {pct}% 사용 ({budget} 중 {spent})",
        "budget_alert_yearly": "연 예산 {pct}% 사용 ({budget} 중 {spent})",
    },
    "tr": {
        "open_task_link": "Görevi aç",
        "due_soon_title": "Bakım zamanı yaklaşıyor",
        "due_soon_message": "{object} için {task}, {days} gün içinde yapılmalı (Tarih: {due}).",
        "overdue_title": "Bakım gecikti!",
        "overdue_message": "{object} için {task}, {days} gün gecikti!",
        "triggered_title": "Bakım tetiklendi",
        "triggered_message": "{object} için {task}, sensör verileriyle tetiklendi.",
        "action_complete": "Tamamla",
        "action_skip": "Atla",
        "action_snooze": "Ertele",
        "bundled_title": "Bakım: {count} görev",
        "bundled_message": "{object}: {task_list}",
        "quiet_end_title": "Sessiz saatlerden {count} hatırlatma",
        "digest_title": "Haftalık bakım özeti",
        "digest_message": "{overdue} gecikmiş, {due_soon} bu hafta yapılacak.",
        "warranty_title": "Garanti yakında sona eriyor",
        "warranty_message": "{days} gün içinde garantisi sona erecek {count} nesne: {names}",
        "completed_title": 'Görev tamamlandı',
        "completed_message": '{object} için {task}: {reason}{who}',
        "completed_by": ' — {name} tarafından',
        "reason_panel": 'panelde tamamlandı',
        "reason_qr": 'QR taramayla tamamlandı',
        "reason_nfc": 'NFC etiketiyle tamamlandı',
        "reason_button": 'düğme varlığıyla tamamlandı',
        "reason_todo": 'yapılacaklar listesinde işaretlendi',
        "reason_voice": 'sesle tamamlandı',
        "reason_notification_action": 'bildirimden tamamlandı',
        "reason_shopping_list": 'alışveriş listesinden yenilendi',
        "reason_service": 'bir otomasyon tarafından tamamlandı',
        "reason_auto_recovery": 'otomatik tamamlandı, sensör toparlandı',
        "reason_unknown": 'tamamlandı',
        "bundled_overdue": "{task} (gecikmiş)",
        "bundled_due_soon": "{task} (yaklaşıyor)",
        "bundled_triggered": "{task} (tetiklendi)",
        "budget_alert_title": "Bakım bütçesi uyarısı",
        "budget_alert_monthly": "Aylık bütçe %{pct} ({spent} / {budget})",
        "budget_alert_yearly": "Yıllık bütçe %{pct} ({spent} / {budget})",
    },
}


PRIORITY_RANK: dict[str, int] = {TaskPriority.HIGH: 0, TaskPriority.NORMAL: 1, TaskPriority.LOW: 2}


def task_key_of(entry_id: str, task_id: str) -> str:
    """The per-task key of the daily-limit bookkeeping (status-agnostic)."""
    return f"{entry_id}_{task_id}"


def _service_payload(title: str, message: str, *, tag: str, url: str = "/maintenance-supporter") -> dict[str, Any]:
    """Notify payload with the deep link doubled into ``url`` (iOS) and
    ``clickAction`` (Android) — five hand-built copies each repeated the
    link string twice."""
    return {
        "title": title,
        "message": message,
        "data": {"tag": tag, "url": url, "clickAction": url},
    }


def build_action_buttons(
    hass: HomeAssistant,
    options: Mapping[str, Any],
    lang: str,
    *,
    entry_id: str | None,
    task_id: str | None,
    skip_allowed: bool,
) -> list[dict[str, str]]:
    """The Companion-app action buttons a reminder carries, per the three
    action toggles — translated labels, at most three (Android's cap).

    The one builder behind the status reminder AND the Settings test send
    (which hand-built the same list with hard-coded English labels and
    ignored the per-task skip lock). ``entry_id``/``task_id`` ``None`` = the
    test send: its ids are ``MS_TEST_<VERB>``, which the action listener
    ignores — a tap on a test button must not complete anything. ``hass`` is
    unused today (the caller resolves ``lang``); it keeps the signature in
    step with ``notification_context`` for a future lookup.
    """
    del hass
    is_test = entry_id is None or task_id is None

    def _id(verb: str) -> str:
        return f"MS_TEST_{verb}" if is_test else f"MS_{verb}_{entry_id}_{task_id}"

    actions: list[dict[str, str]] = []
    if options.get(CONF_ACTION_COMPLETE_ENABLED, setting_default(CONF_ACTION_COMPLETE_ENABLED)):
        actions.append({"action": _id("COMPLETE"), "title": f"✅ {_notif_t('action_complete', lang)}"})
    if options.get(CONF_ACTION_SKIP_ENABLED, setting_default(CONF_ACTION_SKIP_ENABLED)) and skip_allowed:
        actions.append({"action": _id("SKIP"), "title": f"⏭️ {_notif_t('action_skip', lang)}"})
    if options.get(CONF_ACTION_SNOOZE_ENABLED, setting_default(CONF_ACTION_SNOOZE_ENABLED)):
        actions.append({"action": _id("SNOOZE"), "title": f"\U0001f4a4 {_notif_t('action_snooze', lang)}"})
    return actions[:3]


def _notif_t(key: str, lang: str, **kwargs: str) -> str:
    """Get notification translation string."""
    strings = _NOTIFICATION_STRINGS.get(lang, _NOTIFICATION_STRINGS["en"])
    text = strings.get(key, _NOTIFICATION_STRINGS["en"].get(key, key))
    if kwargs:
        safe_kwargs = {k: str(v).replace("{", "{{").replace("}", "}}") for k, v in kwargs.items()}
        text = text.format(**safe_kwargs)
    return text


async def get_user_notify_services(hass: HomeAssistant, user_id: str) -> list[str]:
    """Find all notify services for a user via mobile_app config entries.

    Discovery strategy:
    1. Find mobile_app config entries whose data contains matching user_id
    2. Look up associated devices in the device registry
    3. Find corresponding notify.mobile_app_* services
    4. Return list of service names
    """
    from homeassistant.helpers import device_registry as dr
    from homeassistant.util import slugify

    device_reg = dr.async_get(hass)
    services: list[str] = []
    seen: set[str] = set()

    # Find mobile_app config entries for this user
    for entry in hass.config_entries.async_entries("mobile_app"):
        if entry.data.get("user_id") != user_id:
            continue

        # mobile_app registers its notify service as ``notify.mobile_app_<slug>``
        # where <slug> = slugify(device name): the legacy notify platform
        # slugifies each target, and mobile_app's target is
        # ``entry.data[ATTR_DEVICE_NAME]`` ("device_name"). The previous code
        # used the device IDENTIFIER (a webhook UUID) instead, so the lookup
        # never matched and user notifications silently fell back to the global
        # service (#75). Use the entry's device_name (authoritative), plus the
        # device-registry names as a safety net (older entries without
        # device_name, or a device the user renamed).
        candidate_names: set[str] = {entry.data.get("device_name") or ""}
        for device in dr.async_entries_for_config_entry(device_reg, entry.entry_id):
            candidate_names.add(device.name_by_user or "")
            candidate_names.add(device.name or "")

        for name in candidate_names:
            if not name:
                continue
            service = f"mobile_app_{slugify(name)}"
            if service in seen or not hass.services.has_service("notify", service):
                continue
            seen.add(service)
            services.append(f"notify.{service}")
            _LOGGER.debug("Found notify service notify.%s for user %s", service, user_id)

    return services


async def async_dispatch_notify(
    hass: HomeAssistant,
    target: str,
    service_data: dict[str, Any],
    *,
    blocking: bool = False,
) -> bool:
    """Send ``service_data`` to a notify target, handling both notify models.

    - A legacy notify *service* (``notify.mobile_app_<slug>``, a notify group, …)
      is called directly and carries the full payload — action buttons, tag, url.
    - A notify *entity* (the newer model — many single devices live only here)
      has no callable per-name service; it's reached via ``notify.send_message``
      with ``entity_id``, which carries only ``message`` + ``title`` (the entity
      model can't take ``data``, so action buttons / tag / url are dropped).

    Returns True if a target was dispatched, False if neither a service nor an
    entity by that name exists. Exceptions are left for the caller to handle.
    """
    domain, _, name = target.partition(".")
    if not name:
        _LOGGER.warning("Invalid notify target: %s", target)
        return False
    # #159: a persistent notification renders Markdown but never surfaces
    # data.url (the payload's deep link) — append it as a tappable line.
    if name == "persistent_notification":
        url = (service_data.get("data") or {}).get("url")
        msg = service_data.get("message", "")
        if url and "](" not in msg:
            link_text = _notif_t("open_task_link", normalize_language(hass))
            service_data = {**service_data, "message": f"{msg}\n\n[{link_text}]({url})"}
    if hass.services.has_service(domain, name):
        await hass.services.async_call(domain, name, service_data, blocking=blocking)
        return True
    if hass.states.get(target) is not None:
        await hass.services.async_call(
            "notify",
            "send_message",
            {
                "entity_id": target,
                "title": service_data.get("title", ""),
                "message": service_data.get("message", ""),
            },
            blocking=blocking,
        )
        return True
    _LOGGER.warning("Notify target not found (no service or entity): %s", target)
    return False


# Per-status config mapping
# The per-status repeat interval (hours; 0 = notify once) — defaults live in
# the settings registry. The enabled toggles are STATUS_ENABLED_KEYS
# (notification_gates), shared with the per-task gate.
_STATUS_INTERVAL_KEYS: dict[str, str] = {
    MaintenanceStatus.DUE_SOON: CONF_NOTIFY_DUE_SOON_INTERVAL,
    MaintenanceStatus.OVERDUE: CONF_NOTIFY_OVERDUE_INTERVAL,
    MaintenanceStatus.TRIGGERED: CONF_NOTIFY_TRIGGERED_INTERVAL,
}


def notification_key(entry_id: str, task_id: str, status: str) -> str:
    """The manager's bookkeeping key for one task's status reminder — the
    ``_last_notified`` stamp and the snooze both live under it (was spelled
    out as an f-string at eight call sites)."""
    return f"{entry_id}_{task_id}_{status}"


class NotificationManager:
    """Manages maintenance notifications and reminders."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the notification manager."""
        self.hass = hass
        self._last_notified: dict[str, datetime] = {}
        self._snoozed_until: dict[str, datetime] = {}
        self._daily_count: int = 0
        # Daily-limit fairness (2026-09-13): which tasks got a message today,
        # which were turned away today (limit / reserve / hold), and which
        # were turned away YESTERDAY and never served — those go first today.
        # Keyed by "<entry_id>_<task_id>"; a bundle marks every member.
        self._served_today: set[str] = set()
        self._deferred_today: set[str] = set()
        self._starved: set[str] = set()
        self._delivered_at: dict[str, datetime] = {}
        # Reminders that fell into quiet hours: key → the facts needed for the
        # one summary that goes out when the quiet hours end.
        self._quiet_held: dict[str, dict[str, Any]] = {}
        # The quiet-hours skip is logged once per quiet period, not per refresh.
        self._quiet_logged_for: str | None = None
        self._store: Store[dict[str, Any]] = Store(hass, STATE_STORE_VERSION, STATE_STORE_KEY)
        # Bug audit 2026-09-12: lead reminders run from the 08:00 tick AND a
        # noon retry (for quiet windows ending after 08:00) - this is the
        # per-day dedup the retry relies on: (entry, task, lead) -> ISO day.
        self._lead_sent: dict[str, str] = {}
        # Entries whose startup seed already ran this process. The manager
        # outlives every object-entry reload (each task edit reloads its
        # entry and hands the coordinator an empty _previous_statuses), and
        # re-seeding on every reload marked never-sent notifications as sent.
        self._seeded_entries: set[str] = set()
        self._daily_reset_date: date | None = None
        # Tracks the last-known state of the "configured notify service missing"
        # repair issue. None = not yet reconciled this process; the first
        # ``async_verify_configured_service`` call forces a registry sync so a
        # stale issue persisted from a previous run is cleared on restart.
        self._notify_issue_active: bool | None = None

    @property
    def _global_options(self) -> Mapping[str, Any]:
        """Get global options from the global config entry."""
        return get_global_options(self.hass)

    def _status_due(self, key: str, interval_hours: int) -> bool:
        """Whether a status notification for ``key`` is due now: never sent,
        or the repeat interval has elapsed. A "notify once" status (interval
        0) that was sent is never due again until the state is cleared."""
        last = self._last_notified.get(key)
        if last is None:
            return True
        if last == _SENT_ONCE:
            return False
        return not (interval_hours > 0 and (dt_util.now() - last).total_seconds() < interval_hours * 3600)

    def _stamp_status_sent(self, key: str, interval_hours: int) -> None:
        self._last_notified[key] = _SENT_ONCE if interval_hours == 0 else dt_util.now()
        self._dirty()

    def _rate_limited(self, key: str, min_seconds: float) -> bool:
        """True when ``key`` fired less than ``min_seconds`` ago.

        The _SENT_ONCE sentinel never blocks here — only the status-change
        path stores it, with its own interval-hours semantics. Extracted from
        the bundle/budget copies of the elapsed check."""
        last = self._last_notified.get(key)
        if last is None or last == _SENT_ONCE:
            return False
        return (dt_util.now() - last).total_seconds() < min_seconds

    async def _resolve_and_send(
        self,
        responsible_user_id: str | None,
        *,
        title: str,
        message: str,
        entry_id: str,
        task_id: str,
        context: Mapping[str, Any],
    ) -> bool:
        """Resolve targets (per-user services, else the global service) and
        fan the notification out; True when at least one send succeeded.

        The status-change and lead-reminder paths carried drifting copies of
        this block — one logged the per-user fallback, the other was silent.
        """
        target_services: list[str] = []
        if responsible_user_id:
            user_services = await get_user_notify_services(self.hass, responsible_user_id)
            if user_services:
                target_services = user_services
                _LOGGER.debug(
                    "Sending notification to user %s services: %s",
                    responsible_user_id,
                    user_services,
                )
            else:
                _LOGGER.debug(
                    "User %s has no notification services, falling back to global",
                    responsible_user_id,
                )
        if not target_services and self.notify_service:
            target_services = [self.notify_service]
        if not target_services:
            if self.event_only:
                # #173: "only fire the event" needs no notify service — the
                # automation IS the delivery. One event, empty target.
                target_services = [""]
            else:
                _LOGGER.warning("No notification services available")
                return False

        success = False
        for service in target_services:
            if await self._async_send_notification_to_service(
                service=service,
                title=title,
                message=message,
                entry_id=entry_id,
                task_id=task_id,
                context=context,
            ):
                success = True
        return success

    @property
    def _lang(self) -> str:
        """Get the HA UI language as a 2-letter table key."""
        return normalize_language(self.hass)

    def _skip_allowed(self, entry_id: str, task_id: str) -> bool:
        """#150: a skip-locked task gets no "Skip" action button — the tap
        could only fail in the action handler (bug review 2026-09-04).
        Unknown entries/tasks keep the button (nothing to check against)."""
        return self._task_config(entry_id, task_id).get("allow_skip") is not False

    def _task_config(self, entry_id: str, task_id: str) -> Mapping[str, Any]:
        """The task's static config dict (``entry.data``) — carries the flags
        the computed coordinator payload drops (``notify_enabled``,
        ``allow_skip``). Empty for an unknown entry/task."""
        entry = self.hass.config_entries.async_get_entry(entry_id)
        if entry is None:
            return {}
        task: Mapping[str, Any] = (entry.data.get(CONF_TASKS) or {}).get(task_id) or {}
        return task

    def _opt(self, key: str) -> Any:
        """A global setting, or its registry default when unset."""
        return self._global_options.get(key, setting_default(key))

    @property
    def enabled(self) -> bool:
        """Check if notifications are globally enabled."""
        return bool(self._opt(CONF_NOTIFICATIONS_ENABLED))

    @property
    def notify_service(self) -> str:
        """Get the configured notify service."""
        return str(self._opt(CONF_NOTIFY_SERVICE))

    @property
    def _has_target(self) -> bool:
        """A send has somewhere to go: a notify service, or event-only mode
        (#173), where the event itself is the delivery."""
        return bool(self.notify_service) or self.event_only

    @property
    def event_only(self) -> bool:
        """#165/#173: the user routes every notification through the event."""
        return bool(self._opt(CONF_NOTIFY_EVENT_ONLY))

    @property
    def title_style(self) -> str:
        """v1.4.0 (#44): how to format the notification title.

        Returns one of "default" / "object_name" / "task_name". Defaults to
        "default" so existing installs see no behaviour change. Defensive
        against a partially-initialised manager (some unit tests construct
        NotificationManager via __new__ without setting `hass`).
        """
        fallback = str(setting_default(CONF_NOTIFICATION_TITLE_STYLE))
        try:
            raw = str(self._opt(CONF_NOTIFICATION_TITLE_STYLE))
        except AttributeError:
            return fallback
        if raw not in NOTIFICATION_TITLE_STYLES:
            return fallback
        return raw

    def _configured_service_exists(self, service: str) -> bool:
        """Return True if the configured notify target exists right now.

        Either a registered ``notify.<name>`` service (legacy: mobile_app,
        notify groups) OR a notify *entity* (newer model, sent via
        ``notify.send_message``). Otherwise the repair issue would false-fire on
        a perfectly valid entity target.
        """
        domain, _, name = service.partition(".")
        if not name:
            return False
        if self.hass.services.has_service(domain, name):
            return True
        return self.hass.states.get(service) is not None

    @callback
    def async_verify_configured_service(self) -> None:
        """Raise/clear a repair issue when the configured notify service is gone.

        Notifications are sent with ``blocking=False``, so a configured service
        that no longer exists (renamed mobile app, removed notify group, …) fails
        *silently*. This surfaces that as a Home Assistant repair issue instead.

        Transition-gated and idempotent: cheap to call on every send attempt, on
        global-options changes, and once HA has started. Scope is deliberately the
        **top-level** configured service only — a broken member *inside* a notify
        group is invisible from here (HA dispatches to the working members and only
        logs the bad one in its own system log), so we never flag, nor false-alarm
        on, that case.
        """
        service = self.notify_service
        # Event-only delivery never calls the service, so a stale name is
        # not a fault to repair (bug audit 2026-09-12).
        missing = bool(service) and self.enabled and not self.event_only and not self._configured_service_exists(service)
        # None (first call) never equals a bool, so the registry is reconciled
        # once at startup — clearing any issue persisted from a previous run.
        if missing == self._notify_issue_active:
            return
        self._notify_issue_active = missing
        if missing:
            _LOGGER.warning(
                "Configured notify service '%s' is not available — notifications will silently fail; raising a repair issue",
                service,
            )
            ir.async_create_issue(
                self.hass,
                DOMAIN,
                _NOTIFY_SERVICE_MISSING_ISSUE_ID,
                is_fixable=False,
                severity=ir.IssueSeverity.WARNING,
                translation_key="notify_service_missing",
                translation_placeholders={"service": service},
            )
        else:
            ir.async_delete_issue(self.hass, DOMAIN, _NOTIFY_SERVICE_MISSING_ISSUE_ID)

    def _is_status_enabled(self, status: str) -> bool:
        """Check if notifications for this specific status are enabled."""
        return status_reminder_enabled(self._global_options, status)

    def _get_interval_hours(self, status: str) -> int:
        """Get repeat interval for a status. 0 = single notification."""
        key = _STATUS_INTERVAL_KEYS.get(status, CONF_NOTIFY_DUE_SOON_INTERVAL)
        return int(self._opt(key))

    def _is_quiet_hours(self) -> bool:
        """Check if current time is in quiet hours."""
        # Quiet hours default: enabled (matches config flow)
        if not self._opt(CONF_QUIET_HOURS_ENABLED):
            return False

        start_str = self._opt(CONF_QUIET_HOURS_START)
        end_str = self._opt(CONF_QUIET_HOURS_END)

        try:
            start = time.fromisoformat(start_str)
            end = time.fromisoformat(end_str)
        except (ValueError, TypeError):
            return False

        now = dt_util.now().time()

        if start <= end:
            return start <= now <= end
        # Overnight quiet hours (e.g., 22:00 - 08:00)
        return now >= start or now <= end

    def _check_daily_limit(self) -> bool:
        """Check if daily notification limit has been reached."""
        self._roll_day()
        max_per_day = self._opt(CONF_MAX_NOTIFICATIONS_PER_DAY)
        if max_per_day > 0 and self._daily_count >= max_per_day:
            _LOGGER.debug("Daily notification limit reached (%s/%s)", self._daily_count, max_per_day)
            return False
        return True

    def _roll_day(self) -> None:
        """Reset the daily counter at the first check of a new day; whoever was
        turned away yesterday and never served becomes today's ``_starved``."""
        today = dt_util.now().date()
        if self._daily_reset_date == today:
            return
        self._starved = {k for k in self._deferred_today if k not in self._served_today}
        self._deferred_today.clear()
        self._served_today.clear()
        self._daily_count = 0
        self._daily_reset_date = today
        self._dirty()

    # ── persistence ──────────────────────────────────────────────────────

    async def async_load(self) -> None:
        """Restore the bookkeeping saved by the previous process."""
        raw = await self._store.async_load()
        if not isinstance(raw, dict):
            return

        def _dt(value: Any) -> datetime | None:
            if value == "once":
                return _SENT_ONCE
            parsed = dt_util.parse_datetime(value) if isinstance(value, str) else None
            return parsed

        for key, value in (raw.get("last_notified") or {}).items():
            parsed = _dt(value)
            if parsed is not None:
                self._last_notified[str(key)] = parsed
        for key, value in (raw.get("snoozed_until") or {}).items():
            parsed = _dt(value)
            if parsed is not None and parsed is not _SENT_ONCE:
                self._snoozed_until[str(key)] = parsed
        for key, value in (raw.get("delivered_at") or {}).items():
            parsed = _dt(value)
            if parsed is not None and parsed is not _SENT_ONCE:
                self._delivered_at[str(key)] = parsed
        lead = raw.get("lead_sent")
        if isinstance(lead, dict):
            self._lead_sent = {str(k): str(v) for k, v in lead.items()}
        try:
            self._daily_count = max(0, int(raw.get("daily_count") or 0))
        except (TypeError, ValueError):
            self._daily_count = 0
        reset = raw.get("daily_reset_date")
        self._daily_reset_date = date.fromisoformat(reset) if isinstance(reset, str) else None
        for name in ("served_today", "deferred_today", "starved"):
            values = raw.get(name)
            if isinstance(values, list):
                setattr(self, f"_{name}", {str(v) for v in values})
        held = raw.get("quiet_held")
        if isinstance(held, dict):
            self._quiet_held = {str(k): dict(v) for k, v in held.items() if isinstance(v, dict)}

    def _snapshot(self) -> dict[str, Any]:
        def _ser(value: datetime) -> str:
            return "once" if value == _SENT_ONCE else value.isoformat()

        return {
            "last_notified": {k: _ser(v) for k, v in self._last_notified.items()},
            "snoozed_until": {k: v.isoformat() for k, v in self._snoozed_until.items()},
            "delivered_at": {k: v.isoformat() for k, v in self._delivered_at.items()},
            "lead_sent": dict(self._lead_sent),
            "daily_count": self._daily_count,
            "daily_reset_date": self._daily_reset_date.isoformat() if self._daily_reset_date else None,
            "served_today": sorted(self._served_today),
            "deferred_today": sorted(self._deferred_today),
            "starved": sorted(self._starved),
            "quiet_held": dict(self._quiet_held),
        }

    def _dirty(self) -> None:
        """Schedule a save of the bookkeeping (debounced; nothing is lost on a
        clean shutdown because HA flushes delayed saves at stop)."""
        self._store.async_delay_save(self._snapshot, _STATE_SAVE_DELAY)

    # ── quiet hours: hold, summarise, log once ───────────────────────────

    def _quiet_period_id(self) -> str:
        """Identifies the current quiet period (the day it started + start
        time) — the unit the skip is logged per."""
        start = str(self._opt(CONF_QUIET_HOURS_START))
        now = dt_util.now()
        try:
            start_t = time.fromisoformat(start)
        except (TypeError, ValueError):
            start_t = time(0, 0)
        day = now.date() if now.time() >= start_t else (now - timedelta(days=1)).date()
        return f"{day.isoformat()}T{start}"

    def _note_quiet_skip(self, what: str) -> None:
        """Log the quiet-hours skip ONCE per quiet period (it used to log on
        every refresh — thousands of lines a night)."""
        period = self._quiet_period_id()
        if self._quiet_logged_for == period:
            return
        self._quiet_logged_for = period
        _LOGGER.debug("Quiet hours (%s): holding %s — held reminders go out as one summary at the end", period, what)

    def _hold_for_quiet_end(self, key: str, facts: dict[str, Any]) -> None:
        self._quiet_held[key] = facts
        self._note_quiet_skip("a reminder")
        self._dirty()

    async def async_flush_quiet_held(self) -> bool:
        """Deliver what quiet hours held back as ONE household summary. Called
        at the first send attempt after quiet hours; True when a summary went
        out. Every member is stamped as sent, so the per-task reminders that
        follow in the same refresh wave stay silent."""
        if not self._quiet_held or self._is_quiet_hours():
            return False
        if not self.enabled or not self._has_target or not self._check_daily_limit():
            return False
        held = list(self._quiet_held.values())
        lang = self._lang
        status_key_map: dict[str, str] = {
            MaintenanceStatus.OVERDUE: "bundled_overdue",
            MaintenanceStatus.DUE_SOON: "bundled_due_soon",
            MaintenanceStatus.TRIGGERED: "bundled_triggered",
        }
        parts: list[str] = []
        for f in held:
            line = _notif_t(status_key_map.get(str(f.get("status") or ""), "bundled_due_soon"), lang, task=str(f.get("task_name") or ""))
            parts.append(f"{f.get('object_name') or ''}: {line}" if f.get("object_name") else line)
        title = _notif_t("quiet_end_title", lang, count=str(len(held)))
        message = "; ".join(parts)
        service_data = _service_payload(title, message, tag="maintenance_quiet_end", url="/maintenance-supporter?tab=today")
        context = notification_context(
            self.hass,
            KIND_QUIET_END,
            tasks=[
                {
                    "entry_id": f.get("entry_id"),
                    "task_id": f.get("task_id"),
                    "task_name": f.get("task_name"),
                    "object_name": f.get("object_name"),
                    "status": f.get("status"),
                    "days_until_due": f.get("days_until_due"),
                    "next_due": f.get("next_due"),
                }
                for f in held
            ],
        )
        try:
            sent = await async_emit_and_dispatch(self.hass, self.notify_service, service_data, context)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send the quiet-hours summary")
            return False
        if not sent:
            return False
        keys: list[str] = []
        for key, f in self._quiet_held.items():
            self._stamp_status_sent(key, self._get_interval_hours(str(f.get("status"))))
            if f.get("entry_id") and f.get("task_id"):
                keys.append(task_key_of(str(f["entry_id"]), str(f["task_id"])))
        self._quiet_held.clear()
        self._mark_delivered(keys)
        _LOGGER.debug("Quiet-hours summary sent: %s", title)
        return True

    @staticmethod
    def _priority_rank(task_data: Mapping[str, Any] | None) -> int:
        """0 = high, 1 = normal, 2 = low (unknown reads as normal)."""
        return PRIORITY_RANK.get(str((task_data or {}).get(CONF_TASK_PRIORITY) or DEFAULT_TASK_PRIORITY), 1)

    def _admit(self, keys: list[str], rank: int) -> bool:
        """The daily-limit decision for a task (or a bundle's member tasks).

        Without a limit every send passes. With a limit the last slots are
        not first-come-first-served any more:

        * **Priority** — the last 10 % of the limit (rounded down) are kept
          for high-priority tasks; low-priority tasks stop at 20 %. Below a
          limit of 10 those reserves are 0 and priority only orders a refresh.
        * **Starved first** — a task turned away yesterday and never served
          is guaranteed today: while such tasks are still waiting and the
          remaining budget would not cover them, other normal/low tasks wait.
        * **First-timers before repeats** — a task that already got a message
          today yields its repeat while a task that was turned away today is
          still waiting.

        A refused task is not stamped, so the next refresh offers it again —
        that is how the held budget reaches the waiting tasks.
        """
        self._roll_day()
        max_per_day = int(self._opt(CONF_MAX_NOTIFICATIONS_PER_DAY) or 0)
        if max_per_day <= 0:
            return True
        remaining = max_per_day - self._daily_count
        reason: str | None = None
        if remaining <= 0:
            reason = "daily limit reached"
        elif rank == 2 and remaining <= max_per_day // 5:
            reason = "last 20 % kept for normal/high priority"
        elif rank == 1 and remaining <= max_per_day // 10:
            reason = "last 10 % kept for high priority"
        elif rank != 0:
            waiting_starved = [k for k in self._starved if k not in self._served_today]
            if waiting_starved and not any(k in self._starved for k in keys) and remaining <= len(waiting_starved):
                reason = f"{len(waiting_starved)} task(s) starved yesterday go first"
            elif all(k in self._served_today for k in keys) and any(k not in self._served_today for k in self._deferred_today):
                reason = "repeat yields to tasks still waiting today"
        if reason is not None:
            self._deferred_today.update(keys)
            self._dirty()
            _LOGGER.debug("Holding notification for %s (%s/%s sent): %s", keys, self._daily_count, max_per_day, reason)
            return False
        return True

    def _mark_delivered(self, keys: list[str]) -> None:
        """Bookkeeping after a successful send: counts, served set, starvation."""
        self._daily_count += 1
        now = dt_util.now()
        for k in keys:
            self._served_today.add(k)
            self._deferred_today.discard(k)
            self._starved.discard(k)
            self._delivered_at[k] = now
        self._dirty()

    def _is_snoozed(self, key: str) -> bool:
        """Check if a notification key is snoozed."""
        until = self._snoozed_until.get(key)
        if until is None:
            return False
        if dt_util.now() >= until:
            # Snooze expired
            del self._snoozed_until[key]
            return False
        return True

    def is_snoozed(self, entry_id: str, task_id: str, status: str) -> bool:
        """Is the task's ``status`` reminder under an active snooze? (The
        per-task gate's view of the snooze state — notification_gates.)"""
        return self._is_snoozed(notification_key(entry_id, task_id, status))

    def snooze_task(self, entry_id: str, task_id: str) -> None:
        """Snooze all notifications for a task."""
        hours = self._opt(CONF_SNOOZE_DURATION_HOURS)
        until = dt_util.now() + timedelta(hours=hours)
        # Snooze for all status types
        for status in NOTIFIABLE_STATUSES:
            self._snoozed_until[notification_key(entry_id, task_id, status)] = until
            self._dirty()
        _LOGGER.debug("Snoozed task %s for %s hours (until %s)", task_id, hours, until)

    async def async_task_status_changed(
        self,
        entry_id: str,
        task_id: str,
        task_name: str,
        object_name: str,
        new_status: str,
        days_until_due: int | None = None,
        next_due: str | None = None,
        responsible_user_id: str | None = None,
        task_data: Mapping[str, Any] | None = None,
    ) -> None:
        """Handle status change / repeat check and send notification if appropriate.

        ``task_data`` is the task's config dict for the per-task gates (mute,
        saved-view scope); looked up from the entry when not given.
        """
        # Keep the "configured notify service missing" repair issue in sync with
        # reality on every attempt (cheap; transition-gated internally).
        self.async_verify_configured_service()

        if not self.enabled:
            return

        # Only notify for certain statuses
        if new_status not in STATUS_ENABLED_KEYS:
            return

        # The per-task gates the status kind declares (status toggle, mute,
        # scope, vacation, snooze) - one place, notification_gates.
        gate = task_may_notify(
            self.hass,
            entry_id,
            task_id,
            new_status,
            task_data if task_data is not None else self._task_config(entry_id, task_id),
            kind=KIND_STATUS,
            manager=self,
        )
        if not gate:
            _LOGGER.debug("Skipping %s notification for %s (%s)", new_status, task_id, gate.blocked_by)
            return

        # Rate limiting / interval
        key = notification_key(entry_id, task_id, new_status)
        interval_hours = self._get_interval_hours(new_status)
        if not self._status_due(key, interval_hours):
            return

        # Quiet hours: hold the reminder — it goes out in the one summary at
        # the end (not as a burst of single pushes on the first refresh after).
        if self._is_quiet_hours():
            self._hold_for_quiet_end(
                key,
                {
                    "entry_id": entry_id,
                    "task_id": task_id,
                    "task_name": task_name,
                    "object_name": object_name,
                    "status": new_status,
                    "days_until_due": days_until_due,
                    "next_due": next_due,
                    "responsible_user_id": responsible_user_id,
                },
            )
            return
        if await self.async_flush_quiet_held() and not self._status_due(key, interval_hours):
            return  # this task was part of the summary

        # Daily limit with priority + fairness (a refusal is not stamped, so
        # the next refresh offers the task again).
        task_key = task_key_of(entry_id, task_id)
        if not self._admit([task_key], self._priority_rank(task_data if task_data is not None else self._task_config(entry_id, task_id))):
            return

        # Build translated message
        lang = self._lang
        title, message = self._build_message(new_status, lang, task_name, object_name, days_until_due, next_due)

        context = notification_context(
            self.hass,
            KIND_STATUS,
            status=new_status,
            entry_id=entry_id,
            task_id=task_id,
            task_name=task_name,
            object_name=object_name,
            days_until_due=days_until_due,
            next_due=next_due,
            responsible_user_id=responsible_user_id,
        )
        if not await self._resolve_and_send(
            responsible_user_id,
            title=title,
            message=message,
            entry_id=entry_id,
            task_id=task_id,
            context=context,
        ):
            return

        self._stamp_status_sent(key, interval_hours)
        self._mark_delivered([task_key])

        _LOGGER.debug("Notification sent: %s - %s", title, message)

    async def async_task_completed(
        self,
        *,
        entry_id: str,
        task_id: str,
        task_name: str,
        object_name: str,
        source: str | None,
        completed_by: str | None = None,
        completed_at: str | None = None,
        task_data: Mapping[str, Any] | None = None,
    ) -> bool:
        """#173 follow-up: "activity" notification for a completion — household
        news, nothing to do. Off by default; ``automatic`` announces only
        completions no person made on the spot (sensor recovery, shopping-list
        sync, an automation's service call), ``all`` every one. Gates: the
        per-task mute, the saved-view scope, quiet hours and the daily cap —
        no repeat, no snooze (see the notification matrix). Routed to the
        household service only: a completion is shared news, and the person
        who just pressed Complete needs no push about it.
        """
        from ..const import COMPLETION_SOURCES_AUTOMATIC, CONF_NOTIFY_COMPLETED
        from .notify_hooks import KIND_COMPLETED, async_emit_and_dispatch, notification_context

        mode = str(self._opt(CONF_NOTIFY_COMPLETED))
        if mode == "off" or not self.enabled or not self._has_target:
            return False
        src = source or "unknown"
        if mode == "automatic" and src not in COMPLETION_SOURCES_AUTOMATIC:
            return False
        # The per-task gates the completed kind declares (mute, scope) — only
        # with a task dict to judge (a caller without one gets no mute/scope).
        if task_data is not None and not task_may_notify(
            self.hass, entry_id, task_id, MaintenanceStatus.DUE_SOON, task_data, kind=KIND_COMPLETED, manager=self
        ):
            return False
        if self._is_quiet_hours():
            self._note_quiet_skip("a completion notification")
            return False
        if not self._check_daily_limit():
            return False
        lang = self._lang
        who = ""
        actor_name: str | None = None
        if completed_by:
            user = await self.hass.auth.async_get_user(completed_by)
            actor_name = user.name if user else None
            if actor_name:
                who = _notif_t("completed_by", lang, name=actor_name)
        reason = _notif_t(f"reason_{src}" if f"reason_{src}" in _NOTIFICATION_STRINGS["en"] else "reason_unknown", lang)
        title = _notif_t("completed_title", lang)
        message = _notif_t("completed_message", lang, task=task_name, object=object_name, reason=reason, who=who)
        style = self.title_style
        if style == "object_name" and object_name:
            title = object_name
        elif style == "task_name" and task_name:
            title = task_name
        context = notification_context(
            self.hass,
            KIND_COMPLETED,
            entry_id=entry_id,
            task_id=task_id,
            task_name=task_name,
            object_name=object_name,
            reason=src,
            completed_by=completed_by,
            completed_by_name=actor_name,
            completed_at=completed_at,
        )
        # Same payload shape as every other kind: the per-task tag (the
        # completion replaces the task's still-standing reminder on the phone)
        # and the deep link the context already carries.
        service_data = _service_payload(title, message, tag=f"maintenance_{task_id}", url=str(context["url"]))
        sent = await async_emit_and_dispatch(self.hass, self.notify_service, service_data, context)
        if sent:
            self._daily_count += 1
        return sent

    def _build_message(
        self,
        status: str,
        lang: str,
        task_name: str,
        object_name: str,
        days_until_due: int | None,
        next_due: str | None,
    ) -> tuple[str, str]:
        """Build translated notification title and message."""
        if status == MaintenanceStatus.DUE_SOON:
            title = _notif_t("due_soon_title", lang)
            message = _notif_t(
                "due_soon_message",
                lang,
                task=task_name,
                object=object_name,
                days=str(days_until_due) if days_until_due is not None else "?",
                due=next_due if next_due is not None else "?",
            )
        elif status == MaintenanceStatus.OVERDUE:
            title = _notif_t("overdue_title", lang)
            days_overdue = str(abs(days_until_due)) if days_until_due is not None else "?"
            message = _notif_t(
                "overdue_message",
                lang,
                task=task_name,
                object=object_name,
                days=days_overdue,
            )
        elif status == MaintenanceStatus.TRIGGERED:
            title = _notif_t("triggered_title", lang)
            message = _notif_t(
                "triggered_message",
                lang,
                task=task_name,
                object=object_name,
            )
        else:
            title = "Maintenance"
            message = f"{task_name} ({object_name})"

        # v1.4.0 (#44): override title with object/task name so phone
        # notification stacks remain distinguishable at a glance.
        style = self.title_style
        if style == "object_name" and object_name:
            title = object_name
        elif style == "task_name" and task_name:
            title = task_name

        return title, message

    async def _async_send_notification_to_service(
        self,
        service: str,
        title: str,
        message: str,
        entry_id: str,
        task_id: str,
        context: Mapping[str, Any] | None = None,
    ) -> bool:
        """Send notification via specific service, optionally with action buttons.

        Args:
            service: Full service name like "notify.mobile_app_device"
            title: Notification title
            message: Notification message
            entry_id: Config entry ID for action buttons
            task_id: Task ID for action buttons

        Returns:
            True if the notification was sent successfully, False otherwise.
        """
        # Build action buttons for Companion App
        actions = build_action_buttons(
            self.hass,
            self._global_options,
            self._lang,
            entry_id=entry_id,
            task_id=task_id,
            skip_allowed=self._skip_allowed(entry_id, task_id),
        )

        service_data = _service_payload(
            title,
            message,
            tag=f"maintenance_{task_id}",
            url=f"/maintenance-supporter?entry_id={entry_id}&task_id={task_id}",
        )
        if actions:
            service_data["data"]["actions"] = actions

        if context is None:
            context = notification_context(self.hass, KIND_STATUS, entry_id=entry_id, task_id=task_id)
        try:
            return await async_emit_and_dispatch(self.hass, service, service_data, context)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send notification to %s", service)
            return False

    async def async_send_bundled(
        self,
        entry_id: str,
        object_name: str,
        tasks: list[dict[str, Any]],
    ) -> None:
        """Send a single bundled notification summarising multiple tasks."""
        self.async_verify_configured_service()
        if not self.enabled or not self._has_target:
            return

        if self._is_quiet_hours():
            for t in tasks:
                if not t.get("task_id"):
                    continue
                key = notification_key(entry_id, t["task_id"], t["status"])
                if self._status_due(key, self._get_interval_hours(t["status"])):
                    self._hold_for_quiet_end(key, {"entry_id": entry_id, "task_id": t["task_id"], "task_name": t.get("task_name"), "object_name": object_name, "status": t["status"], "days_until_due": t.get("days_until_due")})
            return
        await self.async_flush_quiet_held()

        # Rate-limit bundled notifications (once per hour)
        bundle_key = f"{entry_id}_bundled"
        if self._rate_limited(bundle_key, 3600):
            return

        # The per-task gates the bundle kind declares (mute, scope, vacation,
        # snooze) are enforced HERE, per member, so a bundle honours them even
        # without the coordinator's pre-filter (DRY review 2026-09-12).
        # Bug audit 2026-09-12: a bundle used to repeat every hour for as long
        # as N tasks were pending, ignoring the per-status repeat intervals
        # and the "notify once" statuses. It now rides the same bookkeeping as
        # the per-task path: only tasks whose own status reminder is due are
        # announced, and every announced task is stamped, so nothing is
        # re-announced when the bundle later dissolves.
        due = [
            t
            for t in tasks
            if not t.get("task_id")
            or (
                task_may_notify(
                    self.hass, entry_id, t["task_id"], t["status"], self._task_config(entry_id, t["task_id"]), kind=KIND_BUNDLE, manager=self
                )
                and self._status_due(notification_key(entry_id, t["task_id"], t["status"]), self._get_interval_hours(t["status"]))
            )
        ]
        if not due:
            return
        tasks = due

        member_keys = [task_key_of(entry_id, t["task_id"]) for t in tasks if t.get("task_id")]
        best_rank = min((self._priority_rank(self._task_config(entry_id, t["task_id"])) for t in tasks if t.get("task_id")), default=1)
        if not self._admit(member_keys, best_rank):
            return

        lang = self._lang
        status_key_map = {
            MaintenanceStatus.OVERDUE: "bundled_overdue",
            MaintenanceStatus.DUE_SOON: "bundled_due_soon",
            MaintenanceStatus.TRIGGERED: "bundled_triggered",
        }

        task_parts: list[str] = []
        for t in tasks:
            key = status_key_map.get(t["status"], "bundled_due_soon")
            task_parts.append(_notif_t(key, lang, task=t["task_name"]))

        title = _notif_t("bundled_title", lang, count=str(len(tasks)))
        message = _notif_t("bundled_message", lang, object=object_name, task_list=", ".join(task_parts))

        # v1.4.0 (#44): for bundled notifications, "object_name" style still
        # prefers the object as the title; "task_name" doesn't map cleanly
        # for multi-task bundles, so we leave the count-based default.
        if self.title_style == "object_name" and object_name:
            title = object_name

        service_data = _service_payload(
            title,
            message,
            tag=f"maintenance_bundled_{entry_id}",
            url=f"/maintenance-supporter?entry_id={entry_id}",
        )

        context = notification_context(
            self.hass,
            KIND_BUNDLE,
            entry_id=entry_id,
            object_name=object_name,
            tasks=[
                {"task_id": t.get("task_id"), "task_name": t.get("task_name"), "status": t.get("status")}
                for t in tasks
            ],
        )
        try:
            if await async_emit_and_dispatch(self.hass, self.notify_service, service_data, context):
                self._last_notified[bundle_key] = dt_util.now()
                self._dirty()
                for t in tasks:
                    if t.get("task_id"):
                        self._stamp_status_sent(notification_key(entry_id, t["task_id"], t["status"]), self._get_interval_hours(t["status"]))
                self._mark_delivered(member_keys)
                _LOGGER.debug("Bundled notification sent: %s - %s", title, message)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send bundled notification")

    async def async_send_weekly_digest(self, overdue: int, due_soon: int) -> None:
        """Send the opt-in weekly summary notification.

        One message with the cross-object counts. Unlike the reactive per-task
        notifications this is a scheduled once-a-week send, so it deliberately
        skips the rate-limit / quiet-hours gating (it fires at a fixed morning
        hour the user chose by enabling the digest).
        """
        self.async_verify_configured_service()
        if not self.enabled or not self._has_target:
            return
        lang = self._lang
        service_data = _service_payload(
            _notif_t("digest_title", lang),
            _notif_t("digest_message", lang, overdue=str(overdue), due_soon=str(due_soon)),
            tag="maintenance_weekly_digest",
        )
        context = notification_context(self.hass, KIND_DIGEST, overdue=overdue, due_soon=due_soon)
        try:
            await async_emit_and_dispatch(self.hass, self.notify_service, service_data, context)
            _LOGGER.debug("Weekly digest sent: %s overdue, %s due soon", overdue, due_soon)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send weekly digest")

    async def async_send_warranty_reminder(self, names: list[str], days: int) -> None:
        """Send the opt-in warranty-expiry reminder — one message listing the
        objects whose warranty expires within ``days`` days. Like the digest,
        a scheduled once-a-day send that skips rate-limit / quiet-hours gating.
        """
        self.async_verify_configured_service()
        if not self.enabled or not self._has_target or not names:
            return
        lang = self._lang
        service_data = _service_payload(
            _notif_t("warranty_title", lang),
            _notif_t(
                "warranty_message",
                lang,
                count=str(len(names)),
                days=str(days),
                names=", ".join(names),
            ),
            tag="maintenance_warranty_reminder",
        )
        context = notification_context(self.hass, KIND_WARRANTY, names=list(names), days=days)
        try:
            await async_emit_and_dispatch(self.hass, self.notify_service, service_data, context)
            _LOGGER.debug("Warranty reminder sent: %s object(s)", len(names))
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send warranty reminder")

    async def async_send_lead_reminder(
        self,
        entry_id: str,
        task_id: str,
        task_name: str,
        object_name: str,
        days: int,
        next_due: str | None = None,
        responsible_user_id: str | None = None,
    ) -> None:
        """Send one lead-time reminder (task is due in exactly ``days`` days).

        Fired by the daily lead-reminder tick when a task's days-until-due
        matches one of the configured ``reminder_lead_days``. Reuses the
        due-soon strings (same message shape) and the per-user routing of the
        status-change path. Honours quiet hours, vacation mode, snooze, and
        the daily limit. Sent at most once per task, lead and day: the 08:00
        tick and the noon retry both call this, and only a delivered reminder
        is stamped, so a quiet-hours skip at 08:00 still goes out at noon.
        """
        self.async_verify_configured_service()
        if not self.enabled:
            return
        lead_key = f"{entry_id}_{task_id}_{days}"
        today = dt_util.now().date().isoformat()
        if self._lead_sent.get(lead_key) == today:
            return
        if self._is_quiet_hours():
            self._note_quiet_skip("a lead-time reminder")
            return
        await self.async_flush_quiet_held()
        # The per-task gates the lead-time kind declares (mute, vacation,
        # snooze — an active snooze on the due-soon key silences leads too).
        if not task_may_notify(
            self.hass,
            entry_id,
            task_id,
            MaintenanceStatus.DUE_SOON,
            self._task_config(entry_id, task_id),
            kind=KIND_LEAD_TIME,
            manager=self,
        ):
            return
        lead_task_key = task_key_of(entry_id, task_id)
        if not self._admit([lead_task_key], self._priority_rank(self._task_config(entry_id, task_id))):
            return

        lang = self._lang
        title = _notif_t("due_soon_title", lang)
        message = _notif_t(
            "due_soon_message",
            lang,
            task=task_name,
            object=object_name,
            days=str(days),
            due=next_due if next_due is not None else "?",
        )

        context = notification_context(
            self.hass,
            KIND_LEAD_TIME,
            status="due_soon",
            entry_id=entry_id,
            task_id=task_id,
            task_name=task_name,
            object_name=object_name,
            days_until_due=days,
            next_due=next_due,
            responsible_user_id=responsible_user_id,
        )
        if await self._resolve_and_send(
            responsible_user_id,
            title=title,
            message=message,
            entry_id=entry_id,
            task_id=task_id,
            context=context,
        ):
            self._mark_delivered([lead_task_key])
            # Keep only today's stamps - yesterday's are dead weight.
            self._lead_sent = {k: d for k, d in self._lead_sent.items() if d == today}
            self._lead_sent[lead_key] = today
            self._dirty()
            _LOGGER.debug("Lead reminder sent: %s due in %s day(s)", task_name, days)

    async def async_budget_alert(
        self,
        period: str,
        spent: float,
        budget: float,
        currency_symbol: str = BUDGET_CURRENCIES[DEFAULT_BUDGET_CURRENCY],
        decimals: int = DEFAULT_CURRENCY_DECIMALS,
    ) -> None:
        """Send a budget threshold alert notification."""
        if not self.enabled or not self._has_target:
            return

        if self._is_quiet_hours():
            self._note_quiet_skip("a budget alert")
            return

        # Rate-limit budget alerts (once per 24 hours per period)
        budget_key = f"_budget_{period}"
        if self._rate_limited(budget_key, 86400):
            return

        if not self._check_daily_limit():
            return

        pct = round(spent / budget * 100) if budget > 0 else 0
        lang = self._lang
        title = _notif_t("budget_alert_title", lang)
        key = f"budget_alert_{period}"
        message = _notif_t(
            key,
            lang,
            pct=str(pct),
            spent=f"{spent:.{decimals}f}{currency_symbol}",
            budget=f"{budget:.{decimals}f}{currency_symbol}",
        )

        service_data = _service_payload(title, message, tag=f"maintenance_budget_{period}")

        context = notification_context(self.hass, KIND_BUDGET, period=period, spent=spent, budget=budget, percent=pct)
        try:
            if await async_emit_and_dispatch(self.hass, self.notify_service, service_data, context):
                self._last_notified[budget_key] = dt_util.now()
                self._daily_count += 1
                _LOGGER.debug("Budget alert sent: %s - %s", title, message)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send budget alert")

    def begin_startup_seed(self, entry_id: str) -> bool:
        """True the FIRST time an entry's coordinator refreshes in this process
        - only then may it seed ``_last_notified`` for the tasks that are
        already notifiable. Every later coordinator instance (the entry is
        reloaded on each task edit) inherits the manager's live state: stamps
        of what was sent survive, and a notification that was still pending
        (quiet hours, daily cap) is not silently marked as sent (bug audit
        2026-09-12)."""
        if entry_id in self._seeded_entries:
            return False
        self._seeded_entries.add(entry_id)
        return True

    def seed_startup_state(self, entry_id: str, task_id: str, status: str) -> None:
        """Seed notification state for a task that is already notifiable at startup.

        Called once on first coordinator refresh to prevent a burst of stale
        notifications.  Sets the ``_last_notified`` timestamp so the repeat
        interval starts *now* rather than firing immediately.
        """
        key = notification_key(entry_id, task_id, status)
        if key in self._last_notified:
            return  # persisted from the previous process — keep the real stamp
        interval_hours = self._get_interval_hours(status)
        if interval_hours == 0:
            self._last_notified[key] = _SENT_ONCE
        else:
            self._last_notified[key] = dt_util.now()
        self._dirty()

    def clear_task_state(self, entry_id: str, task_id: str) -> None:
        """Clear notification state for a task (after completion/reset)."""
        for status in NOTIFIABLE_STATUSES:
            key = notification_key(entry_id, task_id, status)
            self._last_notified.pop(key, None)
            self._snoozed_until.pop(key, None)
            self._quiet_held.pop(key, None)
        self._dirty()

    async def async_dismiss_task_notification(self, task_id: str, responsible_user_id: str | None = None) -> None:
        """Dismiss a task notification on Companion App devices.

        ``clear_notification`` is a legacy mobile_app service feature; the notify
        *entity* model (notify.send_message) has no equivalent, so an entity-only
        target can't be dismissed and is simply skipped. Reminders for a task
        with a responsible person land on THAT person's devices (see
        _resolve_and_send), so those are cleared too (bug audit 2026-09-12).
        """
        services = [self.notify_service]
        if responsible_user_id:
            try:
                services.extend(await get_user_notify_services(self.hass, responsible_user_id))
            except Exception:  # noqa: BLE001 - a lookup failure must not keep the action from finishing
                _LOGGER.debug("User notify services unavailable for %s", responsible_user_id, exc_info=True)
        tag = f"maintenance_{task_id}"
        for service in dict.fromkeys(s for s in services if s):
            domain, _, name = service.partition(".")
            if not (name and self.hass.services.has_service(domain, name)):
                continue
            try:
                await self.hass.services.async_call(
                    domain,
                    name,
                    {"message": "clear_notification", "data": {"tag": tag}},
                    blocking=False,
                )
            except (HomeAssistantError, ValueError, TypeError):
                _LOGGER.debug("Failed to dismiss notification for tag %s on %s", tag, service)

    async def async_unload(self) -> None:
        """Clean up the notification manager (the bookkeeping is saved first —
        the next manager instance loads it)."""
        await self._store.async_save(self._snapshot())
        self._last_notified.clear()
        self._snoozed_until.clear()
        self._daily_count = 0
        self._daily_reset_date = None
        self._served_today.clear()
        self._deferred_today.clear()
        self._starved.clear()
        self._delivered_at.clear()
