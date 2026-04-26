"""Notification manager for maintenance reminders."""

from __future__ import annotations

import logging
from collections.abc import Mapping
from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

from ..const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATION_TITLE_STYLE,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_DUE_SOON_ENABLED,
    CONF_NOTIFY_DUE_SOON_INTERVAL,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_NOTIFY_TRIGGERED_ENABLED,
    CONF_NOTIFY_TRIGGERED_INTERVAL,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_END,
    CONF_QUIET_HOURS_START,
    CONF_SNOOZE_DURATION_HOURS,
    DEFAULT_MAX_NOTIFICATIONS_PER_DAY,
    DEFAULT_SNOOZE_DURATION_HOURS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)

_LOGGER = logging.getLogger(__name__)

# Sentinel value: interval=0 means "notify once, never repeat"
_SENT_ONCE = datetime.max

# --- Notification message translations ---
_NOTIFICATION_STRINGS: dict[str, dict[str, str]] = {
    "de": {
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
        "bundled_overdue": "{task} (überfällig)",
        "bundled_due_soon": "{task} (bald fällig)",
        "bundled_triggered": "{task} (ausgelöst)",
        "budget_alert_title": "Wartungsbudget-Warnung",
        "budget_alert_monthly": "Monatsbudget zu {pct}% ausgeschöpft ({spent} von {budget})",
        "budget_alert_yearly": "Jahresbudget zu {pct}% ausgeschöpft ({spent} von {budget})",
    },
    "nl": {
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
        "bundled_overdue": "{task} (achterstallig)",
        "bundled_due_soon": "{task} (binnenkort)",
        "bundled_triggered": "{task} (geactiveerd)",
        "budget_alert_title": "Onderhoudsbudget waarschuwing",
        "budget_alert_monthly": "Maandbudget op {pct}% ({spent} van {budget})",
        "budget_alert_yearly": "Jaarbudget op {pct}% ({spent} van {budget})",
    },
    "fr": {
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
        "bundled_overdue": "{task} (en retard)",
        "bundled_due_soon": "{task} (bientôt dû)",
        "bundled_triggered": "{task} (déclenché)",
        "budget_alert_title": "Alerte budget maintenance",
        "budget_alert_monthly": "Budget mensuel à {pct}% ({spent} sur {budget})",
        "budget_alert_yearly": "Budget annuel à {pct}% ({spent} sur {budget})",
    },
    "it": {
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
        "bundled_overdue": "{task} (scaduta)",
        "bundled_due_soon": "{task} (in scadenza)",
        "bundled_triggered": "{task} (attivata)",
        "budget_alert_title": "Avviso budget manutenzione",
        "budget_alert_monthly": "Budget mensile al {pct}% ({spent} di {budget})",
        "budget_alert_yearly": "Budget annuale al {pct}% ({spent} di {budget})",
    },
    "es": {
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
        "bundled_overdue": "{task} (vencido)",
        "bundled_due_soon": "{task} (próximo)",
        "bundled_triggered": "{task} (activado)",
        "budget_alert_title": "Alerta de presupuesto de mantenimiento",
        "budget_alert_monthly": "Presupuesto mensual al {pct}% ({spent} de {budget})",
        "budget_alert_yearly": "Presupuesto anual al {pct}% ({spent} de {budget})",
    },
    "en": {
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
        "bundled_overdue": "{task} (overdue)",
        "bundled_due_soon": "{task} (due soon)",
        "bundled_triggered": "{task} (triggered)",
        "budget_alert_title": "Maintenance Budget Warning",
        "budget_alert_monthly": "Monthly budget at {pct}% ({spent} of {budget})",
        "budget_alert_yearly": "Yearly budget at {pct}% ({spent} of {budget})",
    },
    "ru": {
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
        "bundled_overdue": "{task} (просрочено)",
        "bundled_due_soon": "{task} (скоро)",
        "bundled_triggered": "{task} (сработало)",
        "budget_alert_title": "Предупреждение о бюджете обслуживания",
        "budget_alert_monthly": "Месячный бюджет: {pct}% ({spent} из {budget})",
        "budget_alert_yearly": "Годовой бюджет: {pct}% ({spent} из {budget})",
    },
    "uk": {
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
        "bundled_overdue": "{task} (прострочено)",
        "bundled_due_soon": "{task} (незабаром)",
        "bundled_triggered": "{task} (спрацювало)",
        "budget_alert_title": "Попередження про бюджет обслуговування",
        "budget_alert_monthly": "Щомісячний бюджет використано на {pct}% ({spent} з {budget})",
        "budget_alert_yearly": "Щорічний бюджет використано на {pct}% ({spent} з {budget})",
    },
    "pt": {
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
        "bundled_overdue": "{task} (po termínu)",
        "bundled_due_soon": "{task} (brzy)",
        "bundled_triggered": "{task} (spuštěno)",
        "budget_alert_title": "Upozornění na rozpočet údržby",
        "budget_alert_monthly": "Měsíční rozpočet na {pct}% ({spent} z {budget})",
        "budget_alert_yearly": "Roční rozpočet na {pct}% ({spent} z {budget})",
    },
    # v1.4.2: Swedish notifications.
    "sv": {
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
        "bundled_overdue": "{task} (försenat)",
        "bundled_due_soon": "{task} (snart)",
        "bundled_triggered": "{task} (utlöst)",
        "budget_alert_title": "Varning för underhållsbudget",
        "budget_alert_monthly": "Månadsbudget på {pct}% ({spent} av {budget})",
        "budget_alert_yearly": "Årsbudget på {pct}% ({spent} av {budget})",
    },
}


def _notif_t(key: str, lang: str, **kwargs: str) -> str:
    """Get notification translation string."""
    strings = _NOTIFICATION_STRINGS.get(lang, _NOTIFICATION_STRINGS["en"])
    text = strings.get(key, _NOTIFICATION_STRINGS["en"].get(key, key))
    if kwargs:
        safe_kwargs = {
            k: str(v).replace("{", "{{").replace("}", "}}")
            for k, v in kwargs.items()
        }
        text = text.format(**safe_kwargs)
    return text


async def _get_user_notify_services(
    hass: HomeAssistant, user_id: str
) -> list[str]:
    """Find all notify services for a user via mobile_app config entries.

    Discovery strategy:
    1. Find mobile_app config entries whose data contains matching user_id
    2. Look up associated devices in the device registry
    3. Find corresponding notify.mobile_app_* services
    4. Return list of service names
    """
    from homeassistant.helpers import device_registry as dr

    device_reg = dr.async_get(hass)
    services = []

    # Find mobile_app config entries for this user
    for entry in hass.config_entries.async_entries("mobile_app"):
        if entry.data.get("user_id") != user_id:
            continue

        # Get devices linked to this config entry
        devices = dr.async_entries_for_config_entry(device_reg, entry.entry_id)
        for device in devices:
            for identifier in device.identifiers:
                if identifier[0] == "mobile_app":
                    device_id = identifier[1]
                    service_name = f"notify.mobile_app_{device_id}"

                    if hass.services.has_service("notify", f"mobile_app_{device_id}"):
                        services.append(service_name)
                        _LOGGER.debug(
                            "Found notify service %s for user %s",
                            service_name,
                            user_id,
                        )

    return services


# Per-status config mapping
_STATUS_ENABLED_KEYS: dict[str, str] = {
    MaintenanceStatus.DUE_SOON: CONF_NOTIFY_DUE_SOON_ENABLED,
    MaintenanceStatus.OVERDUE: CONF_NOTIFY_OVERDUE_ENABLED,
    MaintenanceStatus.TRIGGERED: CONF_NOTIFY_TRIGGERED_ENABLED,
}

_STATUS_INTERVAL_KEYS: dict[str, tuple[str, int]] = {
    MaintenanceStatus.DUE_SOON: (CONF_NOTIFY_DUE_SOON_INTERVAL, 24),
    MaintenanceStatus.OVERDUE: (CONF_NOTIFY_OVERDUE_INTERVAL, 12),
    MaintenanceStatus.TRIGGERED: (CONF_NOTIFY_TRIGGERED_INTERVAL, 0),
}


class NotificationManager:
    """Manages maintenance notifications and reminders."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the notification manager."""
        self.hass = hass
        self._last_notified: dict[str, datetime] = {}
        self._snoozed_until: dict[str, datetime] = {}
        self._daily_count: int = 0
        self._daily_reset_date: date | None = None

    @property
    def _global_options(self) -> Mapping[str, Any]:
        """Get global options from the global config entry."""
        for entry in self.hass.config_entries.async_entries(DOMAIN):
            if entry.unique_id == GLOBAL_UNIQUE_ID:
                return entry.options or entry.data
        return {}

    @property
    def _lang(self) -> str:
        """Get the HA system language."""
        return self.hass.config.language or "en"

    @property
    def enabled(self) -> bool:
        """Check if notifications are globally enabled."""
        return bool(self._global_options.get(CONF_NOTIFICATIONS_ENABLED, False))

    @property
    def notify_service(self) -> str:
        """Get the configured notify service."""
        return str(self._global_options.get(CONF_NOTIFY_SERVICE, ""))

    @property
    def title_style(self) -> str:
        """v1.4.0 (#44): how to format the notification title.

        Returns one of "default" / "object_name" / "task_name". Defaults to
        "default" so existing installs see no behaviour change. Defensive
        against a partially-initialised manager (some unit tests construct
        NotificationManager via __new__ without setting `hass`).
        """
        try:
            raw = str(self._global_options.get(CONF_NOTIFICATION_TITLE_STYLE, "default"))
        except AttributeError:
            return "default"
        if raw not in ("default", "object_name", "task_name"):
            return "default"
        return raw

    def _is_status_enabled(self, status: str) -> bool:
        """Check if notifications for this specific status are enabled."""
        key = _STATUS_ENABLED_KEYS.get(status)
        if key is None:
            return False
        return bool(self._global_options.get(key, True))

    def _get_interval_hours(self, status: str) -> int:
        """Get repeat interval for a status. 0 = single notification."""
        entry = _STATUS_INTERVAL_KEYS.get(status)
        if entry is None:
            return 24
        key, default = entry
        return int(self._global_options.get(key, default))

    def _is_quiet_hours(self) -> bool:
        """Check if current time is in quiet hours."""
        options = self._global_options

        # Quiet hours default: enabled (matches config flow)
        if not options.get(CONF_QUIET_HOURS_ENABLED, True):
            return False

        start_str = options.get(CONF_QUIET_HOURS_START, "22:00")
        end_str = options.get(CONF_QUIET_HOURS_END, "08:00")

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
        today = dt_util.now().date()
        if self._daily_reset_date != today:
            self._daily_count = 0
            self._daily_reset_date = today

        max_per_day = self._global_options.get(
            CONF_MAX_NOTIFICATIONS_PER_DAY, DEFAULT_MAX_NOTIFICATIONS_PER_DAY
        )
        if max_per_day > 0 and self._daily_count >= max_per_day:
            _LOGGER.debug(
                "Daily notification limit reached (%s/%s)", self._daily_count, max_per_day
            )
            return False
        return True

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

    def snooze_task(self, entry_id: str, task_id: str) -> None:
        """Snooze all notifications for a task."""
        hours = self._global_options.get(
            CONF_SNOOZE_DURATION_HOURS, DEFAULT_SNOOZE_DURATION_HOURS
        )
        until = dt_util.now() + timedelta(hours=hours)
        # Snooze for all status types
        for status in (MaintenanceStatus.DUE_SOON, MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED):
            key = f"{entry_id}_{task_id}_{status}"
            self._snoozed_until[key] = until
        _LOGGER.debug(
            "Snoozed task %s for %s hours (until %s)", task_id, hours, until
        )

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
    ) -> None:
        """Handle status change / repeat check and send notification if appropriate."""
        if not self.enabled:
            return

        # Only notify for certain statuses
        if new_status not in _STATUS_ENABLED_KEYS:
            return

        # Check if this status is enabled
        if not self._is_status_enabled(new_status):
            return

        # Check quiet hours
        if self._is_quiet_hours():
            _LOGGER.debug("Skipping notification during quiet hours")
            return

        # Vacation mode (v1.2.0): suppress unless task is on the exempt list.
        # Sensor-triggered notifications use the same path so they're covered.
        from .vacation import get_vacation_state

        if get_vacation_state(self.hass).is_silent_for(task_id):
            _LOGGER.debug("Skipping notification — vacation mode active for %s", task_id)
            return

        # Rate limiting / interval
        key = f"{entry_id}_{task_id}_{new_status}"

        # Check snooze
        if self._is_snoozed(key):
            _LOGGER.debug("Notification snoozed for %s", key)
            return

        interval_hours = self._get_interval_hours(new_status)

        if key in self._last_notified:
            last = self._last_notified[key]
            if last == _SENT_ONCE:
                # interval=0: already sent once, never repeat
                return
            elapsed = (dt_util.now() - last).total_seconds()
            if interval_hours > 0 and elapsed < interval_hours * 3600:
                return
            # interval=0 but hasn't been sent yet → allow

        # Check daily limit
        if not self._check_daily_limit():
            return

        # Build translated message
        lang = self._lang
        title, message = self._build_message(
            new_status, lang, task_name, object_name, days_until_due, next_due
        )

        # Determine target services: user-specific or global
        target_services = []
        if responsible_user_id:
            user_services = await _get_user_notify_services(self.hass, responsible_user_id)
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

        # Fallback to global service
        if not target_services and self.notify_service:
            target_services = [self.notify_service]

        if not target_services:
            _LOGGER.warning("No notification services available")
            return

        # Send to all target services
        success = False
        for service in target_services:
            if await self._async_send_notification_to_service(
                service=service,
                title=title,
                message=message,
                entry_id=entry_id,
                task_id=task_id,
            ):
                success = True

        if not success:
            return

        # Record send time (only on success)
        if interval_hours == 0:
            self._last_notified[key] = _SENT_ONCE
        else:
            self._last_notified[key] = dt_util.now()
        self._daily_count += 1

        _LOGGER.debug("Notification sent: %s - %s", title, message)

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
        options = self._global_options
        lang = self._lang

        # Build action buttons for Companion App
        actions: list[dict[str, str]] = []
        if options.get(CONF_ACTION_COMPLETE_ENABLED, False):
            actions.append({
                "action": f"MS_COMPLETE_{entry_id}_{task_id}",
                "title": f"\u2705 {_notif_t('action_complete', lang)}",
            })
        if options.get(CONF_ACTION_SKIP_ENABLED, False):
            actions.append({
                "action": f"MS_SKIP_{entry_id}_{task_id}",
                "title": f"\u23ed\ufe0f {_notif_t('action_skip', lang)}",
            })
        if options.get(CONF_ACTION_SNOOZE_ENABLED, False):
            actions.append({
                "action": f"MS_SNOOZE_{entry_id}_{task_id}",
                "title": f"\U0001f4a4 {_notif_t('action_snooze', lang)}",
            })

        service_data: dict[str, Any] = {"title": title, "message": message}
        data: dict[str, Any] = {
            "tag": f"maintenance_{task_id}",
            "url": f"/maintenance-supporter?entry_id={entry_id}&task_id={task_id}",
            "clickAction": f"/maintenance-supporter?entry_id={entry_id}&task_id={task_id}",
        }
        if actions:
            data["actions"] = actions[:3]  # Android supports max 3
        service_data["data"] = data

        try:
            service_parts = service.split(".")
            if len(service_parts) == 2:
                await self.hass.services.async_call(
                    service_parts[0],
                    service_parts[1],
                    service_data,
                    blocking=False,
                )
                return True
            _LOGGER.warning("Invalid notify service format: %s", service)
            return False
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
        if not self.enabled or not self.notify_service:
            return

        if self._is_quiet_hours():
            return

        # Rate-limit bundled notifications (once per hour)
        bundle_key = f"{entry_id}_bundled"
        if bundle_key in self._last_notified:
            last = self._last_notified[bundle_key]
            if last != _SENT_ONCE:
                elapsed = (dt_util.now() - last).total_seconds()
                if elapsed < 3600:
                    return

        if not self._check_daily_limit():
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
        message = _notif_t(
            "bundled_message", lang, object=object_name, task_list=", ".join(task_parts)
        )

        # v1.4.0 (#44): for bundled notifications, "object_name" style still
        # prefers the object as the title; "task_name" doesn't map cleanly
        # for multi-task bundles, so we leave the count-based default.
        if self.title_style == "object_name" and object_name:
            title = object_name

        service_data: dict[str, Any] = {
            "title": title,
            "message": message,
            "data": {
                "tag": f"maintenance_bundled_{entry_id}",
                "url": f"/maintenance-supporter?entry_id={entry_id}",
                "clickAction": f"/maintenance-supporter?entry_id={entry_id}",
            },
        }

        try:
            service_parts = self.notify_service.split(".")
            if len(service_parts) == 2:
                await self.hass.services.async_call(
                    service_parts[0],
                    service_parts[1],
                    service_data,
                    blocking=False,
                )
                self._last_notified[bundle_key] = dt_util.now()
                self._daily_count += 1
                _LOGGER.debug("Bundled notification sent: %s - %s", title, message)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send bundled notification")

    async def async_budget_alert(
        self,
        period: str,
        spent: float,
        budget: float,
        currency_symbol: str = "€",
    ) -> None:
        """Send a budget threshold alert notification."""
        if not self.enabled or not self.notify_service:
            return

        if self._is_quiet_hours():
            return

        # Rate-limit budget alerts (once per 24 hours per period)
        budget_key = f"_budget_{period}"
        if budget_key in self._last_notified:
            last = self._last_notified[budget_key]
            if last != _SENT_ONCE:
                elapsed = (dt_util.now() - last).total_seconds()
                if elapsed < 86400:  # 24 hours
                    return

        if not self._check_daily_limit():
            return

        pct = round(spent / budget * 100) if budget > 0 else 0
        lang = self._lang
        title = _notif_t("budget_alert_title", lang)
        key = f"budget_alert_{period}"
        message = _notif_t(
            key, lang,
            pct=str(pct),
            spent=f"{spent:.2f}{currency_symbol}",
            budget=f"{budget:.2f}{currency_symbol}",
        )

        service_data: dict[str, Any] = {
            "title": title,
            "message": message,
            "data": {
                "tag": f"maintenance_budget_{period}",
                "url": "/maintenance-supporter",
                "clickAction": "/maintenance-supporter",
            },
        }

        try:
            service_parts = self.notify_service.split(".")
            if len(service_parts) == 2:
                await self.hass.services.async_call(
                    service_parts[0],
                    service_parts[1],
                    service_data,
                    blocking=False,
                )
                self._last_notified[budget_key] = dt_util.now()
                self._daily_count += 1
                _LOGGER.debug("Budget alert sent: %s - %s", title, message)
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.exception("Failed to send budget alert")

    def seed_startup_state(
        self, entry_id: str, task_id: str, status: str
    ) -> None:
        """Seed notification state for a task that is already notifiable at startup.

        Called once on first coordinator refresh to prevent a burst of stale
        notifications.  Sets the ``_last_notified`` timestamp so the repeat
        interval starts *now* rather than firing immediately.
        """
        key = f"{entry_id}_{task_id}_{status}"
        interval_hours = self._get_interval_hours(status)
        if interval_hours == 0:
            self._last_notified[key] = _SENT_ONCE
        else:
            self._last_notified[key] = dt_util.now()

    def clear_task_state(self, entry_id: str, task_id: str) -> None:
        """Clear notification state for a task (after completion/reset)."""
        for status in (MaintenanceStatus.DUE_SOON, MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED):
            key = f"{entry_id}_{task_id}_{status}"
            self._last_notified.pop(key, None)
            self._snoozed_until.pop(key, None)

    async def async_dismiss_task_notification(self, task_id: str) -> None:
        """Dismiss a task notification on Companion App devices."""
        service = self.notify_service
        if not service:
            return
        tag = f"maintenance_{task_id}"
        try:
            parts = service.split(".")
            if len(parts) == 2:
                await self.hass.services.async_call(
                    parts[0],
                    parts[1],
                    {"message": "clear_notification", "data": {"tag": tag}},
                    blocking=False,
                )
        except (HomeAssistantError, ValueError, TypeError):
            _LOGGER.debug("Failed to dismiss notification for tag %s", tag)

    async def async_unload(self) -> None:
        """Clean up the notification manager."""
        self._last_notified.clear()
        self._snoozed_until.clear()
        self._daily_count = 0
        self._daily_reset_date = None
