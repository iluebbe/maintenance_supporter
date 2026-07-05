"""Calendar platform for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from datetime import date, datetime, time, timedelta
from typing import TYPE_CHECKING

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_ADVANCED_SCHEDULE_TIME,
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)
from .helpers.dates import interval_span_days
from .helpers.i18n import normalize_language
from .models.maintenance_task import MaintenanceTask

if TYPE_CHECKING:
    from . import MaintenanceSupporterConfigEntry

_LOGGER = logging.getLogger(__name__)

PARALLEL_UPDATES = 0

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
        "cal_last": "Letzter",
        "cal_day": "Tag",
        "last_performed": "Zuletzt durchgeführt",
        "never": "Nie",
        "manually_triggered": "Manuell ausgelöste Wartungsaufgabe",
        "sensor_triggered": "Sensor-Trigger ausgelöst für {name}",
        "cleaning": "Reinigung",
        "inspection": "Inspektion",
        "replacement": "Austausch",
        "calibration": "Kalibrierung",
        "service": "Service",
        "reading": "Ablesung",
        "custom": "Benutzerdefiniert",
    },
    "nl": {
        "type": "Type",
        "interval": "Interval",
        "interval_days": "{days} dagen",
        "cal_last": "Laatste",
        "cal_day": "Dag",
        "last_performed": "Laatst uitgevoerd",
        "never": "Nooit",
        "manually_triggered": "Handmatig geactiveerde onderhoudstaak",
        "sensor_triggered": "Sensortrigger geactiveerd voor {name}",
        "cleaning": "Reiniging",
        "inspection": "Inspectie",
        "replacement": "Vervanging",
        "calibration": "Kalibratie",
        "service": "Service",
        "reading": "Aflezing",
        "custom": "Aangepast",
    },
    "fr": {
        "type": "Type",
        "interval": "Intervalle",
        "interval_days": "{days} jours",
        "cal_last": "Dernier",
        "cal_day": "Jour",
        "last_performed": "Dernière exécution",
        "never": "Jamais",
        "manually_triggered": "Tâche de maintenance déclenchée manuellement",
        "sensor_triggered": "Déclencheur capteur activé pour {name}",
        "cleaning": "Nettoyage",
        "inspection": "Inspection",
        "replacement": "Remplacement",
        "calibration": "Calibration",
        "service": "Service",
        "reading": "Relevé",
        "custom": "Personnalisé",
    },
    "it": {
        "type": "Tipo",
        "interval": "Intervallo",
        "interval_days": "{days} giorni",
        "cal_last": "Ultimo",
        "cal_day": "Giorno",
        "last_performed": "Ultima esecuzione",
        "never": "Mai",
        "manually_triggered": "Attività di manutenzione attivata manualmente",
        "sensor_triggered": "Trigger sensore attivato per {name}",
        "cleaning": "Pulizia",
        "inspection": "Ispezione",
        "replacement": "Sostituzione",
        "calibration": "Calibrazione",
        "service": "Servizio",
        "reading": "Lettura",
        "custom": "Personalizzato",
    },
    "es": {
        "type": "Tipo",
        "interval": "Intervalo",
        "interval_days": "{days} días",
        "cal_last": "Último",
        "cal_day": "Día",
        "last_performed": "Última ejecución",
        "never": "Nunca",
        "manually_triggered": "Tarea de mantenimiento activada manualmente",
        "sensor_triggered": "Disparador de sensor activado para {name}",
        "cleaning": "Limpieza",
        "inspection": "Inspección",
        "replacement": "Reemplazo",
        "calibration": "Calibración",
        "service": "Servicio",
        "reading": "Lectura",
        "custom": "Personalizado",
    },
    "en": {
        "type": "Type",
        "interval": "Interval",
        "interval_days": "{days} days",
        "cal_last": "Last",
        "cal_day": "Day",
        "last_performed": "Last performed",
        "never": "Never",
        "manually_triggered": "Manually triggered maintenance task",
        "sensor_triggered": "Sensor trigger activated for {name}",
        "cleaning": "Cleaning",
        "inspection": "Inspection",
        "replacement": "Replacement",
        "calibration": "Calibration",
        "service": "Service",
        "reading": "Reading",
        "custom": "Custom",
    },
    "ru": {
        "type": "Тип",
        "interval": "Интервал",
        "interval_days": "{days} дней",
        "cal_last": "Последний",
        "cal_day": "День",
        "last_performed": "Последнее выполнение",
        "never": "Никогда",
        "manually_triggered": "Задача обслуживания запущена вручную",
        "sensor_triggered": "Триггер датчика активирован для {name}",
        "cleaning": "Очистка",
        "inspection": "Осмотр",
        "replacement": "Замена",
        "calibration": "Калибровка",
        "service": "Обслуживание",
        "reading": "Показания",
        "custom": "Пользовательский",
    },
    "uk": {
        "type": "Тип",
        "interval": "Інтервал",
        "interval_days": "{days} днів",
        "cal_last": "Останній",
        "cal_day": "День",
        "last_performed": "Останнє виконання",
        "never": "Ніколи",
        "manually_triggered": "Завдання обслуговування запущено вручну",
        "sensor_triggered": "Спрацював сенсорний тригер для {name}",
        "cleaning": "Очищення",
        "inspection": "Огляд",
        "replacement": "Заміна",
        "calibration": "Калібрування",
        "service": "Сервіс",
        "reading": "Показання",
        "custom": "Власний",
    },
    "pt": {
        "type": "Tipo",
        "interval": "Intervalo",
        "interval_days": "{days} dias",
        "cal_last": "Último",
        "cal_day": "Dia",
        "last_performed": "Última execução",
        "never": "Nunca",
        "manually_triggered": "Tarefa de manutenção acionada manualmente",
        "sensor_triggered": "Gatilho do sensor ativado para {name}",
        "cleaning": "Limpeza",
        "inspection": "Inspeção",
        "replacement": "Substituição",
        "calibration": "Calibração",
        "service": "Serviço",
        "reading": "Leitura",
        "custom": "Personalizado",
    },
    "zh": {
        "type": "类型",
        "interval": "间隔",
        "interval_days": "{days} 天",
        "cal_last": "最后",
        "cal_day": "日",
        "last_performed": "最后执行时间",
        "never": "从未",
        "manually_triggered": "手动触发维护任务",
        "sensor_triggered": "{name} 的传感器触发器已激活",
        "cleaning": "清洁",
        "inspection": "检查",
        "replacement": "更换",
        "calibration": "校准",
        "service": "服务",
        "reading": "读数",
        "custom": "自定义",
    },
}


def _cal_t(key: str, lang: str, **kwargs: str) -> str:
    """Get calendar translation string."""
    strings = _CAL_STRINGS.get(lang, _CAL_STRINGS["en"])
    text = strings.get(key, _CAL_STRINGS["en"].get(key, key))
    if kwargs:
        text = text.format(**kwargs)
    return text


def _recurrence_text(task: MaintenanceTask, lang: str) -> str:
    """Localized recurrence label for the calendar event description.

    Covers the calendar kinds (weekdays / nth_weekday / day_of_month) using
    babel weekday names so "1. Samstag" reads localized; falls back to the
    real day-span for interval/legacy tasks (so a 3-month task reads "~90
    days", not "3 days").
    """
    raw = task.schedule_raw if isinstance(task.schedule_raw, dict) else None
    kind = raw.get("kind") if raw else None
    if raw is not None and kind in ("weekdays", "nth_weekday", "day_of_month"):
        loc = lang or "en"
        try:
            # babel (HA-provided) gives locale-correct weekday names; degrade
            # gracefully (no label) if it is somehow absent, never crash.
            from babel.dates import get_day_names

            if kind == "weekdays":
                names = get_day_names("abbreviated", locale=loc)
                days = [d for d in raw.get("weekdays") or [] if isinstance(d, int) and 0 <= d <= 6]
                return " & ".join(names[d] for d in days)
            if kind == "nth_weekday":
                wd, nth = raw.get("weekday"), raw.get("nth")
                if not isinstance(wd, int) or not isinstance(nth, int):
                    return ""
                name = get_day_names("wide", locale=loc)[wd]
                ordinal = _cal_t("cal_last", lang) if nth == -1 else f"{nth}."
                return f"{ordinal} {name}"
            # day_of_month
            day = raw.get("day")
            return f"{_cal_t('cal_day', lang)} {day}" if isinstance(day, int) else ""
        except (ImportError, KeyError, LookupError, ValueError):
            return ""
    # interval / legacy flat → real day-span
    return (
        _cal_t("interval_days", lang, days=str(interval_span_days(task.interval_days, task.interval_unit)))
        if task.interval_days
        else ""
    )


async def async_setup_entry(
    hass: HomeAssistant,
    entry: MaintenanceSupporterConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up calendar entity."""
    # Only create calendar for the global entry
    if entry.unique_id != GLOBAL_UNIQUE_ID:
        # Register this object's coordinator with existing calendar
        runtime_data = entry.runtime_data
        if runtime_data and runtime_data.coordinator:
            calendar = hass.data.get(DOMAIN, {}).get("_calendar_entity")
            if calendar:
                runtime_data.coordinator.register_calendar_entity(calendar)
        return

    calendar = MaintenanceCalendar(hass)
    hass.data.setdefault(DOMAIN, {})["_calendar_entity"] = calendar
    async_add_entities([calendar])

    # Register calendar with existing coordinators
    for other_entry in hass.config_entries.async_entries(DOMAIN):
        if other_entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        other_data = getattr(other_entry, "runtime_data", None)
        if other_data and hasattr(other_data, "coordinator") and other_data.coordinator:
            other_data.coordinator.register_calendar_entity(calendar)

    _LOGGER.debug("Maintenance calendar entity created")


class MaintenanceCalendar(CalendarEntity):
    """Calendar entity aggregating all maintenance tasks."""

    _attr_name = "Maintenance Schedule"
    _attr_unique_id = "maintenance_supporter_calendar"
    _attr_translation_key = "maintenance_schedule"

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the calendar."""
        self._hass = hass
        self._cached_next_event: CalendarEvent | None = None
        self._cache_time: datetime | None = None

    def invalidate_cache(self) -> None:
        """Invalidate the cached next event (called by coordinators on update)."""
        self._cache_time = None

    @property
    def event(self) -> CalendarEvent | None:
        """Return the next upcoming event (cached for up to 1 hour)."""
        now = dt_util.now()
        if (
            self._cache_time is not None
            and (now - self._cache_time).total_seconds() < 3600
        ):
            return self._cached_next_event

        events = self._get_all_events(
            now, now + timedelta(days=365)
        )
        if events:
            # Events mix all-day (date) and timed (datetime) starts since v1.0.41.
            # Normalise to datetime for comparison so sort doesn't TypeError.
            def _key(e: CalendarEvent) -> datetime:
                s = e.start
                if isinstance(s, datetime):
                    return s if s.tzinfo else s.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
                return datetime.combine(s, time.min, tzinfo=dt_util.DEFAULT_TIME_ZONE)
            events.sort(key=_key)
            self._cached_next_event = events[0]
        else:
            self._cached_next_event = None

        self._cache_time = now
        return self._cached_next_event

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

            # v2.10.0: an archived object contributes no calendar events (its
            # tasks are cascade-archived too, but skip the whole entry up front).
            if obj_data.get("archived_at") is not None:
                continue

            # Use live coordinator data (has trigger state) if available,
            # fall back to config entry data
            runtime_data = getattr(entry, "runtime_data", None)
            if (
                runtime_data
                and hasattr(runtime_data, "coordinator")
                and runtime_data.coordinator
                and runtime_data.coordinator.data
            ):
                live_tasks = runtime_data.coordinator.data.get(CONF_TASKS, {})
            else:
                live_tasks = {}

            # Merge static (ConfigEntry) + dynamic (Store) task data
            store = getattr(runtime_data, "store", None) if runtime_data else None
            static_tasks = entry.data.get(CONF_TASKS, {})
            tasks_data = store.merge_all_tasks(static_tasks) if store is not None else static_tasks

            for task_id, task_dict in tasks_data.items():
                task = MaintenanceTask.from_dict(task_dict)

                if not task.enabled:
                    continue
                # Archived task → no calendar entries (inert).
                if task.archived_at is not None:
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
        """Get the HA UI language as a 2-letter table key."""
        return normalize_language(self._hass)

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
        # Show the real day-span so a 3-month task reads "~90 days", not "3 days"
        # (the calendar event itself is already placed at the unit-aware next_due).
        interval_text = _recurrence_text(task, lang)
        last_perf = str(task.last_performed) if task.last_performed else _cal_t("never", lang)

        # Build event window. Default: all-day. When schedule_time is set
        # (and the global advanced flag is on), render as a 30-min timed
        # event at HH:MM in HA's configured TZ — calendar apps can then
        # set proper alarms instead of the generic "all-day" reminder.
        start: date | datetime = next_due
        end: date | datetime = next_due + timedelta(days=1)
        if task.schedule_time and self._is_schedule_time_feature_enabled():
            try:
                hh, mm = task.schedule_time.split(":", 1)
                start_dt = datetime.combine(
                    next_due,
                    time(int(hh), int(mm)),
                    tzinfo=dt_util.DEFAULT_TIME_ZONE,
                )
                start = start_dt
                end = start_dt + timedelta(minutes=30)
            except (ValueError, TypeError):
                pass  # malformed schedule_time → fall back to all-day

        return CalendarEvent(
            summary=f"{prefix} {task.name} ({object_name})",
            start=start,
            end=end,
            description=(
                f"{_cal_t('type', lang)}: {type_translated}\n"
                f"{_cal_t('interval', lang)}: {interval_text}\n"
                f"{_cal_t('last_performed', lang)}: {last_perf}"
            ),
        )

    def _is_schedule_time_feature_enabled(self) -> bool:
        """Lookup the global advanced flag — same approach as coordinator."""
        for ce in self._hass.config_entries.async_entries(DOMAIN):
            if ce.unique_id == GLOBAL_UNIQUE_ID:
                opts = ce.options or ce.data
                return bool(opts.get(CONF_ADVANCED_SCHEDULE_TIME, False))
        return False
