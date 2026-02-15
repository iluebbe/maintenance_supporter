"""Calendar platform for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)
from .models.maintenance_task import MaintenanceTask

_LOGGER = logging.getLogger(__name__)

PARALLEL_UPDATES = 1

# Status to emoji/prefix mapping
STATUS_PREFIX: dict[str, str] = {
    MaintenanceStatus.OK: "🟢",
    MaintenanceStatus.DUE_SOON: "🟡",
    MaintenanceStatus.OVERDUE: "🔴",
    MaintenanceStatus.TRIGGERED: "🔔",
}

# Calendar event translations (not covered by HA translation system)
_CAL_STRINGS: dict[str, dict[str, str]] = {
    "de": {
        "type": "Typ",
        "interval": "Intervall",
        "interval_days": "{days} Tage",
        "last_performed": "Zuletzt durchgeführt",
        "never": "Nie",
        "manually_triggered": "Manuell ausgelöste Wartungsaufgabe",
        "sensor_triggered": "Sensor-Trigger ausgelöst für {name}",
        "cleaning": "Reinigung",
        "inspection": "Inspektion",
        "replacement": "Austausch",
        "calibration": "Kalibrierung",
        "service": "Service",
        "custom": "Benutzerdefiniert",
    },
    "nl": {
        "type": "Type",
        "interval": "Interval",
        "interval_days": "{days} dagen",
        "last_performed": "Laatst uitgevoerd",
        "never": "Nooit",
        "manually_triggered": "Handmatig geactiveerde onderhoudstaak",
        "sensor_triggered": "Sensortrigger geactiveerd voor {name}",
        "cleaning": "Reiniging",
        "inspection": "Inspectie",
        "replacement": "Vervanging",
        "calibration": "Kalibratie",
        "service": "Service",
        "custom": "Aangepast",
    },
    "fr": {
        "type": "Type",
        "interval": "Intervalle",
        "interval_days": "{days} jours",
        "last_performed": "Dernière exécution",
        "never": "Jamais",
        "manually_triggered": "Tâche de maintenance déclenchée manuellement",
        "sensor_triggered": "Déclencheur capteur activé pour {name}",
        "cleaning": "Nettoyage",
        "inspection": "Inspection",
        "replacement": "Remplacement",
        "calibration": "Calibration",
        "service": "Service",
        "custom": "Personnalisé",
    },
    "it": {
        "type": "Tipo",
        "interval": "Intervallo",
        "interval_days": "{days} giorni",
        "last_performed": "Ultima esecuzione",
        "never": "Mai",
        "manually_triggered": "Attività di manutenzione attivata manualmente",
        "sensor_triggered": "Trigger sensore attivato per {name}",
        "cleaning": "Pulizia",
        "inspection": "Ispezione",
        "replacement": "Sostituzione",
        "calibration": "Calibrazione",
        "service": "Servizio",
        "custom": "Personalizzato",
    },
    "es": {
        "type": "Tipo",
        "interval": "Intervalo",
        "interval_days": "{days} días",
        "last_performed": "Última ejecución",
        "never": "Nunca",
        "manually_triggered": "Tarea de mantenimiento activada manualmente",
        "sensor_triggered": "Disparador de sensor activado para {name}",
        "cleaning": "Limpieza",
        "inspection": "Inspección",
        "replacement": "Reemplazo",
        "calibration": "Calibración",
        "service": "Servicio",
        "custom": "Personalizado",
    },
    "en": {
        "type": "Type",
        "interval": "Interval",
        "interval_days": "{days} days",
        "last_performed": "Last performed",
        "never": "Never",
        "manually_triggered": "Manually triggered maintenance task",
        "sensor_triggered": "Sensor trigger activated for {name}",
        "cleaning": "Cleaning",
        "inspection": "Inspection",
        "replacement": "Replacement",
        "calibration": "Calibration",
        "service": "Service",
        "custom": "Custom",
    },
}


def _cal_t(key: str, lang: str, **kwargs: str) -> str:
    """Get calendar translation string."""
    strings = _CAL_STRINGS.get(lang, _CAL_STRINGS["en"])
    text = strings.get(key, _CAL_STRINGS["en"].get(key, key))
    if kwargs:
        text = text.format(**kwargs)
    return text


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up calendar entity."""
    # Only create calendar for the global entry
    if entry.unique_id != GLOBAL_UNIQUE_ID:
        # Register this object's coordinator with existing calendar
        runtime_data = hass.data.get(DOMAIN, {}).get(entry.entry_id)
        if runtime_data and runtime_data.coordinator:
            calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
            if calendar:
                runtime_data.coordinator.register_calendar_entity(calendar)
        return

    calendar = MaintenanceCalendar(hass)
    hass.data.setdefault(DOMAIN, {})["_calendar_entity"] = calendar
    async_add_entities([calendar])

    # Register calendar with existing coordinators
    for entry_id, data in hass.data.get(DOMAIN, {}).items():
        if entry_id.startswith("_"):
            continue
        if hasattr(data, "coordinator") and data.coordinator:
            data.coordinator.register_calendar_entity(calendar)

    _LOGGER.debug("Maintenance calendar entity created")


class MaintenanceCalendar(CalendarEntity):
    """Calendar entity aggregating all maintenance tasks."""

    _attr_has_entity_name = True
    _attr_unique_id = "maintenance_supporter_calendar"
    _attr_translation_key = "maintenance_schedule"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the calendar."""
        self._hass = hass

    @property
    def event(self) -> CalendarEvent | None:
        """Return the next upcoming event."""
        now = dt_util.now()
        events = self._get_all_events(
            now, now + timedelta(days=365)
        )
        if not events:
            return None

        # Sort by start date and return the earliest
        events.sort(key=lambda e: e.start)
        return events[0]

    async def async_get_events(
        self,
        hass: HomeAssistant,
        start_date: datetime,
        end_date: datetime,
    ) -> list[CalendarEvent]:
        """Return calendar events within the date range."""
        return self._get_all_events(start_date, end_date)

    def _get_all_events(
        self,
        start_date: datetime | date,
        end_date: datetime | date,
    ) -> list[CalendarEvent]:
        """Collect events from all maintenance objects."""
        events: list[CalendarEvent] = []

        # Convert to dates for comparison
        if isinstance(start_date, datetime):
            start_d = start_date.date()
        else:
            start_d = start_date

        if isinstance(end_date, datetime):
            end_d = end_date.date()
        else:
            end_d = end_date

        entries = self._hass.config_entries.async_entries(DOMAIN)

        for entry in entries:
            if entry.unique_id == GLOBAL_UNIQUE_ID:
                continue

            obj_data = entry.data.get(CONF_OBJECT, {})
            obj_name = obj_data.get("name", "Unknown")

            # Use live coordinator data (has trigger state) if available,
            # fall back to config entry data
            runtime_data = self._hass.data.get(DOMAIN, {}).get(entry.entry_id)
            if (
                runtime_data
                and hasattr(runtime_data, "coordinator")
                and runtime_data.coordinator
                and runtime_data.coordinator.data
            ):
                live_tasks = runtime_data.coordinator.data.get(CONF_TASKS, {})
            else:
                live_tasks = {}

            tasks_data = entry.data.get(CONF_TASKS, {})

            for task_id, task_dict in tasks_data.items():
                task = MaintenanceTask.from_dict(task_dict)

                if not task.enabled:
                    continue

                # Inject live trigger state from coordinator
                live = live_tasks.get(task_id, {})
                if live.get("_trigger_active", False):
                    task._trigger_active = True
                if live.get("_trigger_current_value") is not None:
                    task._trigger_current_value = live["_trigger_current_value"]

                event = self._create_event_for_task(
                    task, obj_name, start_d, end_d
                )
                if event:
                    events.append(event)

        return events

    @property
    def _lang(self) -> str:
        """Get the HA language."""
        return self._hass.config.language or "en"

    def _create_event_for_task(
        self,
        task: MaintenanceTask,
        object_name: str,
        start_d: date,
        end_d: date,
    ) -> CalendarEvent | None:
        """Create a calendar event for a task if within range."""
        lang = self._lang

        if task.schedule_type == ScheduleType.MANUAL:
            # Manual tasks only show if triggered
            if not task._trigger_active:
                return None
            # Show as event for today
            today = dt_util.now().date()
            if start_d <= today <= end_d:
                return CalendarEvent(
                    summary=f"{STATUS_PREFIX.get(MaintenanceStatus.TRIGGERED, '🔔')} {task.name} ({object_name})",
                    start=today,
                    end=today + timedelta(days=1),
                    description=_cal_t("manually_triggered", lang),
                )
            return None

        # Time-based or sensor-based with interval
        next_due = task.next_due
        if next_due is None:
            if task._trigger_active:
                # Sensor triggered without fixed date: show today
                today = dt_util.now().date()
                if start_d <= today <= end_d:
                    return CalendarEvent(
                        summary=f"{STATUS_PREFIX.get(MaintenanceStatus.TRIGGERED, '🔔')} {task.name} ({object_name})",
                        start=today,
                        end=today + timedelta(days=1),
                        description=_cal_t("sensor_triggered", lang, name=task.name),
                    )
            return None

        # Check if next_due is in range
        if next_due < start_d or next_due > end_d:
            return None

        status = task.status
        prefix = STATUS_PREFIX.get(status, "")

        # Build translated description
        type_translated = _cal_t(task.type, lang) if task.type else task.type
        interval_text = _cal_t("interval_days", lang, days=str(task.interval_days)) if task.interval_days else ""
        last_perf = str(task.last_performed) if task.last_performed else _cal_t("never", lang)

        return CalendarEvent(
            summary=f"{prefix} {task.name} ({object_name})",
            start=next_due,
            end=next_due + timedelta(days=1),
            description=(
                f"{_cal_t('type', lang)}: {type_translated}\n"
                f"{_cal_t('interval', lang)}: {interval_text}\n"
                f"{_cal_t('last_performed', lang)}: {last_perf}"
            ),
        )
