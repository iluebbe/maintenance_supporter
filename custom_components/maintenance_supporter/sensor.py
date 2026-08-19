"""Sensor platform for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from datetime import date, datetime, time
from typing import TYPE_CHECKING, Any

from homeassistant.components.sensor import (
    ENTITY_ID_FORMAT,
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import UnitOfInformation, UnitOfTime
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import async_generate_entity_id
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import dt as dt_util

from .const import (
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_ENTITY_LOGIC,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    SIGNAL_DOCUMENTS_UPDATED,
    SIGNAL_TASK_RESET,
    MaintenanceStatus,
    slugify_object_name,
    task_unique_id,
)
from .coordinator import MaintenanceCoordinator
from .entity.entity_base import MaintenanceEntity
from .entity.summary_coordinator import MaintenanceSummaryCoordinator
from .entity.triggers import BaseTrigger, create_triggers, normalize_entity_ids
from .helpers.global_options import is_schedule_time_enabled
from .helpers.schedule import read_legacy_fields
from .helpers.status import compute_status_from_task_dict

# (metric key in compute_status_counts, mdi icon) for the global summary sensors
SUMMARY_METRICS: list[tuple[str, str]] = [
    ("overdue", "mdi:alert-circle"),
    ("due_soon", "mdi:clock-alert-outline"),
    ("triggered", "mdi:flash"),
    ("needs_attention", "mdi:wrench-clock"),
    ("ok", "mdi:check-circle"),
    ("total_tasks", "mdi:format-list-checks"),
]

if TYPE_CHECKING:
    from . import MaintenanceSupporterConfigEntry
    from .helpers.battery_fleet import BatteryOverview
    from .helpers.documents import DocumentStore

_LOGGER = logging.getLogger(__name__)

PARALLEL_UPDATES = 0


async def async_setup_entry(
    hass: HomeAssistant,
    entry: MaintenanceSupporterConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sensor entities for a maintenance object."""
    # Global entry: expose the aggregate summary sensors instead of per-task ones.
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        from . import DOCUMENT_STORE_KEY

        runtime_data = entry.runtime_data
        summary = runtime_data.summary_coordinator if runtime_data else None
        entities: list[SensorEntity] = []
        if summary is not None:
            entities.extend(MaintenanceSummarySensor(summary, key, icon) for key, icon in SUMMARY_METRICS)
        # One global storage sensor (total blob bytes = real backup cost).
        doc_store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
        entities.append(DocumentStorageSensor(hass, doc_store))
        # Spare parts: how many parts across all objects need reordering.
        entities.append(PartsToReorderSensor(hass))
        # Battery fleet: how many batteries (across all Battery Notes devices)
        # need replacing now — the aggregate that backs the single fleet task.
        entities.append(BatteryFleetLowSensor(hass))
        async_add_entities(entities)
        return

    runtime_data = entry.runtime_data
    if runtime_data is None or runtime_data.coordinator is None:
        _LOGGER.error("No coordinator found for entry %s", entry.entry_id)
        return

    coordinator = runtime_data.coordinator
    tasks = entry.data.get(CONF_TASKS, {})

    entities = [MaintenanceSensor(coordinator, task_id) for task_id in tasks]
    # Companion timestamp sensor per task (disabled by default): the raw
    # next-due instant for tile/entities cards with the relative time-format
    # display options ("in 2 days"), template automations, etc.
    entities.extend(MaintenanceNextDueSensor(coordinator, task_id) for task_id in tasks)
    # Numeric countdown companion per task (disabled by default): plain
    # days-until-due number for gauge/progress-bar cards, which cannot read
    # the status sensor's attribute.
    entities.extend(MaintenanceDaysUntilDueSensor(coordinator, task_id) for task_id in tasks)
    # Spare parts: one stock sensor per part on the object device (catalog-only
    # parts without a tracked count read unavailable).
    from .const import CONF_PARTS

    entities.extend(PartStockSensor(coordinator, part_id) for part_id in entry.data.get(CONF_PARTS) or {})

    async_add_entities(entities)
    _LOGGER.debug(
        "Added %d sensor entities for %s",
        len(entities),
        entry.title,
    )


class MaintenanceSensor(MaintenanceEntity, SensorEntity):
    """Sensor entity representing a single maintenance task."""

    _attr_translation_key = "maintenance_task"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = [
        MaintenanceStatus.OK,
        MaintenanceStatus.DUE_SOON,
        MaintenanceStatus.OVERDUE,
        MaintenanceStatus.TRIGGERED,
        MaintenanceStatus.ARCHIVED,
        MaintenanceStatus.PAUSED,
    ]

    def __init__(
        self,
        coordinator: MaintenanceCoordinator,
        task_id: str,
    ) -> None:
        """Initialize the maintenance sensor."""
        super().__init__(coordinator, task_id)

        obj_data = coordinator.entry.data.get(CONF_OBJECT, {})
        task_data = coordinator.entry.data.get(CONF_TASKS, {}).get(task_id, {})

        object_slug = slugify_object_name(obj_data.get("name", "unknown"))
        self._attr_unique_id = task_unique_id(object_slug, task_id)

        # Use custom entity_slug as the friendly name if provided
        entity_slug = task_data.get("entity_slug")
        if entity_slug:
            self._attr_name = entity_slug
        self._attr_translation_placeholders = {"task_name": task_data.get("name", "")}

        # Instance-level mutable state (class attrs are just defaults)
        self._triggers: list[BaseTrigger] = []
        self._trigger_states: dict[str, bool] = {}
        self._trigger_values: dict[str, Any] = {}

    @property
    def _trigger(self) -> BaseTrigger | None:
        """Backwards-compatible access to the first trigger (or None)."""
        return self._triggers[0] if self._triggers else None

    @property
    def native_value(self) -> str | None:
        """Return the current status of the task."""
        task = self._task_data
        if not task:
            return None
        return str(task.get("_status", MaintenanceStatus.OK))

    @property
    def icon(self) -> str | None:
        """Return custom icon if configured, else fall back to icons.json."""
        task = self._task_data
        if task:
            custom: str | None = task.get("custom_icon")
            if custom:
                return custom
        return None

    @property
    def available(self) -> bool:
        """Return True if entity is available.

        The sensor stays available even when the trigger entity is
        unavailable or missing.  Trigger health is exposed as the
        ``trigger_entity_state`` attribute instead of making the whole
        maintenance sensor disappear from dashboards.
        """
        return super().available

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extended attributes for the sensor.

        Only stable attributes are exposed here to avoid excessive recorder
        writes.  Fast-changing trigger values (current_value,
        accumulated_hours, change_count, etc.) are served via the WebSocket
        ``subscribe`` endpoint instead.
        """
        task = self._task_data
        if not task:
            return {}

        sched = read_legacy_fields(task)
        attrs: dict[str, Any] = {
            "maintenance_type": task.get("type"),
            "schedule_type": sched["schedule_type"],
            "interval_days": sched["interval_days"],
            "interval_unit": sched["interval_unit"],
            "interval_anchor": sched["interval_anchor"],
            "due_date": sched["due_date"],
            "warning_days": task.get("warning_days"),
            "last_performed": task.get("last_performed"),
            "next_due": task.get("_next_due"),
            "days_until_due": task.get("_days_until_due"),
            "parent_object": self._object_data.get("name"),
            "times_performed": task.get("_times_performed", 0),
            "total_cost": task.get("_total_cost", 0.0),
            "average_duration": task.get("_average_duration"),
            # notes + documentation_url are user-entered reference data (a short
            # note and a manual link), exposed here so dashboards/templates can
            # read them via state_attr(...). They are not secrets and are also
            # served via the WS object read. (v2.8.3 briefly removed these for
            # data-minimisation; restored in v2.8.4 — the manual link in
            # particular is exactly what belongs on the entity.)
            "notes": task.get("notes"),
            "documentation_url": task.get("documentation_url"),
            # #134: the priority level, so automations can route on it
            # (state_attr(..., 'priority') == 'high'). Always present — tasks
            # without an explicit value are "normal", the model default.
            "priority": task.get("priority") or "normal",
        }

        # Trigger attributes (static config only — no fast-changing values)
        trigger_config = task.get("trigger_config")
        if trigger_config:
            ttype = trigger_config.get("type")
            attrs["trigger_type"] = ttype
            attrs["trigger_active"] = task.get("_trigger_active", False)
            if trigger_config.get("trigger_combinator") == "all":
                attrs["trigger_combinator"] = "all"

            if ttype == "threshold":
                attrs["trigger_above"] = trigger_config.get("trigger_above")
                attrs["trigger_below"] = trigger_config.get("trigger_below")
                attrs["trigger_equals"] = trigger_config.get("trigger_equals")
                attrs["trigger_not_equals"] = trigger_config.get("trigger_not_equals")
                attrs["trigger_for_minutes"] = trigger_config.get("trigger_for_minutes")
            elif ttype == "counter":
                attrs["trigger_target_value"] = trigger_config.get("trigger_target_value")
                attrs["trigger_delta_mode"] = trigger_config.get("trigger_delta_mode")
            elif ttype == "state_change":
                attrs["trigger_from_state"] = trigger_config.get("trigger_from_state")
                attrs["trigger_to_state"] = trigger_config.get("trigger_to_state")
                attrs["trigger_target_changes"] = trigger_config.get("trigger_target_changes")
            elif ttype == "runtime":
                attrs["trigger_runtime_hours"] = trigger_config.get("trigger_runtime_hours")
            elif ttype == "compound":
                attrs["compound_logic"] = trigger_config.get("compound_logic", "AND")
                conditions = trigger_config.get("conditions", [])
                attrs["compound_conditions_count"] = len(conditions)

        # Adaptive scheduling attributes
        if task.get("_suggested_interval") is not None:
            attrs["suggested_interval"] = task.get("_suggested_interval")
            attrs["interval_confidence"] = task.get("_interval_confidence")
        adaptive_cfg = task.get("adaptive_config")
        if adaptive_cfg:
            attrs["adaptive_scheduling_enabled"] = adaptive_cfg.get("enabled", False)

        # Seasonal scheduling attributes
        analysis = task.get("_interval_analysis")
        if analysis and analysis.get("seasonal_factor") is not None:
            attrs["seasonal_factor"] = analysis["seasonal_factor"]
            attrs["seasonal_reason"] = analysis.get("seasonal_reason")

        # Weibull advanced statistics
        if analysis and analysis.get("weibull_beta") is not None:
            attrs["weibull_beta"] = analysis["weibull_beta"]
            attrs["weibull_eta"] = analysis.get("weibull_eta")
            attrs["weibull_r_squared"] = analysis.get("weibull_r_squared")
            beta = analysis["weibull_beta"]
            if beta < 0.8:
                attrs["weibull_beta_interpretation"] = "early_failures"
            elif beta <= 1.2:
                attrs["weibull_beta_interpretation"] = "random_failures"
            elif beta <= 3.5:
                attrs["weibull_beta_interpretation"] = "wear_out"
            else:
                attrs["weibull_beta_interpretation"] = "highly_predictable"
        if analysis and analysis.get("confidence_interval_low") is not None:
            attrs["confidence_interval_low"] = analysis["confidence_interval_low"]
            attrs["confidence_interval_high"] = analysis.get("confidence_interval_high")

        return attrs

    async def async_added_to_hass(self) -> None:
        """When entity is added to hass, set up triggers if configured."""
        await super().async_added_to_hass()

        # Use merged data (static config + Store runtime) so that persisted
        # trigger state (_trigger_state) survives HA restarts.
        static_task = self.coordinator.entry.data.get(CONF_TASKS, {}).get(self._task_id, {})
        store = self.coordinator._store
        if store is not None:
            task_data = store.merge_task_data(self._task_id, static_task)
        else:
            task_data = static_task
        trigger_config = task_data.get("trigger_config")

        # Listen for task reset signals (completion/skip/reset) —
        # registered for ALL tasks (not just trigger-based) so that
        # status updates propagate immediately to the UI.
        signal = SIGNAL_TASK_RESET.format(entry_id=self.coordinator.entry.entry_id, task_id=self._task_id)
        self.async_on_remove(async_dispatcher_connect(self.hass, signal, self._handle_task_reset))

        # v2.10.0: an archived task is inert — keep the status listener above
        # (so unarchive repaints immediately) but never wire up its triggers.
        if task_data.get("archived_at") is not None:
            return

        # v2.20 (N3): same for a seasonally paused object — the pause/resume
        # WS commands reload the entry, so triggers wire up again on resume.
        obj_data = self.coordinator.entry.data.get(CONF_OBJECT, {})
        if obj_data.get("paused_at") is not None:
            return

        if not trigger_config:
            return

        # Compound triggers have entity_ids inside conditions, not at top level
        is_compound = trigger_config.get("type") == "compound"
        entity_ids = normalize_entity_ids(trigger_config)
        if not entity_ids and not is_compound:
            return

        try:
            self._triggers = create_triggers(
                hass=self.hass,
                entity=self,
                trigger_config=trigger_config,
            )
            for trigger in self._triggers:
                await trigger.async_setup()
            _LOGGER.debug(
                "Trigger setup for %s monitoring %s",
                self.entity_id,
                entity_ids if not is_compound else "[compound]",
            )
        except (HomeAssistantError, ValueError, TypeError, KeyError):
            _LOGGER.exception("Failed to set up triggers for %s", self.entity_id)

    async def async_will_remove_from_hass(self) -> None:
        """When entity is removed, clean up triggers."""
        for trigger in self._triggers:
            await trigger.async_teardown()
        self._triggers = []
        self._trigger_states = {}
        self._trigger_values = {}
        await super().async_will_remove_from_hass()

    @callback
    def _handle_task_reset(self) -> None:
        """Reset all trigger instances after task completion/skip/reset."""
        for trigger in self._triggers:
            trigger.reset()
        self._trigger_states = {}
        self._trigger_values = {}

        if self.coordinator.data is not None:
            tasks = self.coordinator.data.get(CONF_TASKS, {})
            task = tasks.get(self._task_id, {})
            if task:
                task["_trigger_active"] = False
                task["_trigger_current_value"] = None
                _old_status = task.get("_status")
                new_status = self._compute_live_status(task)
                task["_status"] = new_status
                self.async_write_ha_state()

    @callback
    def async_update_trigger_state(
        self,
        is_triggered: bool,
        current_value: float | None = None,
        trigger_entity_id: str | None = None,
    ) -> None:
        """Update trigger state from trigger callback.

        For multi-entity triggers, aggregates per-entity states using the
        configured entity_logic ("any" or "all").
        """
        if self.coordinator.data is None:
            return

        tasks = self.coordinator.data.get(CONF_TASKS, {})
        task = tasks.get(self._task_id, {})
        prev_active = task.get("_trigger_active", False)

        # Track per-entity state
        if trigger_entity_id is not None:
            self._trigger_states[trigger_entity_id] = is_triggered
            if current_value is not None:
                self._trigger_values[trigger_entity_id] = current_value

        # Aggregate trigger states
        if len(self._triggers) > 1:
            trigger_config = self.coordinator.entry.data.get(CONF_TASKS, {}).get(self._task_id, {}).get("trigger_config", {})
            entity_logic = trigger_config.get("entity_logic", DEFAULT_ENTITY_LOGIC)

            if entity_logic == "all":
                aggregated = bool(self._trigger_states) and all(self._trigger_states.values())
            else:  # "any"
                aggregated = any(self._trigger_states.values())

            task["_trigger_active"] = aggregated
        else:
            # Single trigger: direct assignment
            task["_trigger_active"] = is_triggered

        if current_value is not None:
            task["_trigger_current_value"] = current_value

        # Recompute _status immediately so native_value reflects the change
        old_status = task.get("_status")
        new_status = self._compute_live_status(task)
        task["_status"] = new_status

        # Only write HA state when the status — or the latched trigger flag —
        # actually changes, to avoid recorder writes on every value update.
        # With trigger_combinator="all" a latched trigger no longer implies a
        # status change (the interval leg may still be pending), but the
        # trigger_active attribute must repaint regardless.
        if new_status != old_status or task.get("_trigger_active", False) != prev_active:
            self.async_write_ha_state()

    @staticmethod
    def _compute_live_status(task: dict[str, Any]) -> str:
        """Compute task status from coordinator data dict (mirrors MaintenanceTask.status)."""
        return compute_status_from_task_dict(task)


class MaintenanceNextDueSensor(MaintenanceEntity, SensorEntity):
    """Timestamp sensor for a task's next due instant.

    Companion to the per-task status sensor, `disabled by default
    <https://developers.home-assistant.io/docs/core/entity/#registry-properties>`_
    so the extra entity costs nothing unless the user wants it. Once enabled
    it powers HA's relative time-format display options ("in 2 days") on
    tile/entities cards and plain timestamp automations.

    The instant is the task's next-due date at local midnight — or at the
    task's ``schedule_time`` when the time-of-day feature is enabled,
    mirroring the calendar entity's timed events.
    """

    _attr_translation_key = "next_due"
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_entity_registry_enabled_default = False

    def __init__(
        self,
        coordinator: MaintenanceCoordinator,
        task_id: str,
    ) -> None:
        """Initialize the next-due sensor."""
        super().__init__(coordinator, task_id)
        obj_data = coordinator.entry.data.get(CONF_OBJECT, {})
        task_data = coordinator.entry.data.get(CONF_TASKS, {}).get(task_id, {})
        object_slug = slugify_object_name(obj_data.get("name", "unknown"))
        self._attr_unique_id = task_unique_id(object_slug, task_id, "next_due")
        self._attr_translation_placeholders = {"task_name": task_data.get("name", "")}

    @property
    def native_value(self) -> datetime | None:
        """The next due instant, or None (manual / archived / done tasks)."""
        task = self._task_data
        if not task:
            return None
        if task.get("_status") == MaintenanceStatus.ARCHIVED:
            return None
        raw = task.get("_next_due")
        if not raw:
            return None
        try:
            due = date.fromisoformat(raw)
        except (ValueError, TypeError):
            return None

        at = time(0, 0)
        schedule_time = task.get("schedule_time")
        if schedule_time and self._schedule_time_enabled():
            try:
                # Tolerate "HH:MM" and "HH:MM:SS" (HA TimeSelector's format).
                parts = str(schedule_time).split(":")
                at = time(int(parts[0]), int(parts[1]))
            except (ValueError, TypeError, IndexError):
                at = time(0, 0)  # malformed -> midnight, like the calendar
        return datetime.combine(due, at, tzinfo=dt_util.DEFAULT_TIME_ZONE)

    def _schedule_time_enabled(self) -> bool:
        """Global advanced flag — same source as the calendar entity."""
        return is_schedule_time_enabled(self.coordinator.hass)


class MaintenanceDaysUntilDueSensor(MaintenanceEntity, SensorEntity):
    """Numeric days-until-due countdown for a task.

    Companion to the per-task status sensor, disabled by default like the
    next-due timestamp twin — always-on would double the entity count for
    large setups. Once enabled its STATE is the plain number of days until
    the task is due (negative once overdue), which is what gauge and
    progress-bar cards need; the status sensor only carries this as an
    attribute. Manual, archived and trigger-only tasks read unknown.

    Its entity_id is pinned language-independently (same reasoning as the
    global summary sensors): with ``has_entity_name`` the slug would
    otherwise derive from the TRANSLATED entity name, so a German install
    would get ``..._tage_bis_faellig`` and the documented gauge recipe would
    only work in English. The friendly name stays localized.
    """

    _attr_translation_key = "days_until_due"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfTime.DAYS
    _attr_suggested_display_precision = 0
    _attr_icon = "mdi:calendar-clock"
    _attr_entity_registry_enabled_default = False

    def __init__(
        self,
        coordinator: MaintenanceCoordinator,
        task_id: str,
    ) -> None:
        """Initialize the days-until-due sensor."""
        super().__init__(coordinator, task_id)
        obj_data = coordinator.entry.data.get(CONF_OBJECT, {})
        task_data = coordinator.entry.data.get(CONF_TASKS, {}).get(task_id, {})
        object_slug = slugify_object_name(obj_data.get("name", "unknown"))
        self._attr_unique_id = task_unique_id(object_slug, task_id, "days_until_due")
        self._attr_translation_placeholders = {"task_name": task_data.get("name", "")}
        # Pin the documented, language-independent entity_id. Only NEW entities
        # are affected — an already-registered one keeps its registry id.
        task_slug = task_data.get("entity_slug") or slugify_object_name(task_data.get("name", task_id))
        self.entity_id = async_generate_entity_id(
            ENTITY_ID_FORMAT,
            f"{object_slug}_{task_slug}_days_until_due",
            hass=coordinator.hass,
        )

    @property
    def native_value(self) -> int | None:
        """Days until due (negative = overdue), or None without a due date."""
        task = self._task_data
        if not task:
            return None
        if task.get("_status") == MaintenanceStatus.ARCHIVED:
            return None
        days = task.get("_days_until_due")
        return int(days) if days is not None else None


class MaintenanceSummarySensor(CoordinatorEntity[MaintenanceSummaryCoordinator], SensorEntity):
    """Aggregate count sensor on the global Maintenance Supporter hub device.

    Counts come from the shared summary coordinator (which uses the same
    ``compute_status_counts`` aggregator as the statistics WebSocket endpoint),
    so these entities, the panel KPI chips, and the dashboard-strategy headline
    always agree.
    """

    _attr_has_entity_name = True
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = "tasks"

    def __init__(
        self,
        coordinator: MaintenanceSummaryCoordinator,
        key: str,
        icon: str,
    ) -> None:
        """Initialize a summary sensor for one metric key."""
        super().__init__(coordinator)
        self._key = key
        self._attr_translation_key = f"summary_{key}"
        self._attr_unique_id = f"{GLOBAL_UNIQUE_ID}_summary_{key}"
        self._attr_icon = icon
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, GLOBAL_UNIQUE_ID)},
            name="Maintenance Supporter",
            entry_type=DeviceEntryType.SERVICE,
        )
        # Pin a stable, language-independent entity_id. With has_entity_name the
        # slug would otherwise derive from the translated name, so a non-English
        # system language would yield e.g. sensor.maintenance_supporter_überfällig
        # and break the documented IDs. The friendly name stays localized.
        self.entity_id = async_generate_entity_id(
            ENTITY_ID_FORMAT,
            f"maintenance_supporter_{key}",
            hass=coordinator.hass,
        )

    @property
    def native_value(self) -> int:
        """Return the current count for this metric."""
        data = self.coordinator.data or {}
        return int(data.get(self._key, 0))


class PartStockSensor(MaintenanceEntity, SensorEntity):
    """On-hand spare count for one part, on the object's device.

    State = the tracked stock (``unavailable`` for catalog-only parts without a
    tracked count); threshold/unit/location ride along as attributes. Refreshes
    off the ``SIGNAL_PARTS_UPDATED`` dispatcher signal fired by parts_runtime
    after every stock change — no polling, no recorder churn beyond real
    stock movements.
    """

    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:package-variant-closed"

    def __init__(self, coordinator: MaintenanceCoordinator, part_id: str) -> None:
        """Initialize the stock sensor for one part."""
        super().__init__(coordinator, part_id)
        self._part_id = part_id
        obj_data = coordinator.entry.data.get(CONF_OBJECT, {})
        object_slug = slugify_object_name(obj_data.get("name", "unknown"))
        self._attr_unique_id = f"maintenance_supporter_{object_slug}_part_{part_id}"
        part = self._part
        self._attr_name = f"{part.get('name', 'Part')} stock"

    @property
    def _part(self) -> dict[str, Any]:
        from .const import CONF_PARTS

        parts = self.coordinator.entry.data.get(CONF_PARTS) or {}
        result: dict[str, Any] = parts.get(self._part_id, {})
        return result

    async def async_added_to_hass(self) -> None:
        """Subscribe to stock-change notifications."""
        await super().async_added_to_hass()
        from .parts_runtime import SIGNAL_PARTS_UPDATED

        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL_PARTS_UPDATED, self._handle_parts_update))

    @callback
    def _handle_parts_update(self, entry_id: str) -> None:
        if entry_id == self.coordinator.entry.entry_id:
            self.async_write_ha_state()

    @property
    def _stock(self) -> int | None:
        rd = getattr(self.coordinator.entry, "runtime_data", None)
        store = getattr(rd, "store", None) if rd else None
        return store.get_part_stock(self._part_id) if store else None

    @property
    def available(self) -> bool:
        """Catalog-only parts (no tracked stock) read unavailable."""
        return self._part_id in (self.coordinator.entry.data.get("parts") or {}) and self._stock is not None

    @property
    def native_value(self) -> int | None:
        return self._stock

    @property
    def native_unit_of_measurement(self) -> str | None:
        return self._part.get("unit") or None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        from .helpers.parts import part_is_low

        part = self._part
        return {
            "part_name": part.get("name"),
            "reorder_threshold": part.get("reorder_threshold"),
            "storage_location": part.get("storage_location") or None,
            "is_low": part_is_low(part, self._stock),
        }


class PartsToReorderSensor(SensorEntity):
    """How many spare parts across all objects are at/below their threshold.

    Lives on the global hub device next to the summary sensors; registry-stable
    unique_id (#86 lesson). Dispatcher-driven off SIGNAL_PARTS_UPDATED.
    """

    _attr_has_entity_name = True
    _attr_translation_key = "parts_to_reorder"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:cart-arrow-down"
    _attr_native_unit_of_measurement = "parts"

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the global reorder-count sensor."""
        self.hass = hass
        self._attr_unique_id = f"{GLOBAL_UNIQUE_ID}_parts_to_reorder"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, GLOBAL_UNIQUE_ID)},
            name="Maintenance Supporter",
            entry_type=DeviceEntryType.SERVICE,
        )
        self.entity_id = async_generate_entity_id(
            ENTITY_ID_FORMAT,
            "maintenance_supporter_parts_to_reorder",
            hass=hass,
        )

    async def async_added_to_hass(self) -> None:
        """Subscribe to stock-change notifications (any entry)."""
        await super().async_added_to_hass()
        from .parts_runtime import SIGNAL_PARTS_UPDATED

        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL_PARTS_UPDATED, self._handle_parts_update))

    @callback
    def _handle_parts_update(self, _entry_id: str) -> None:
        self.async_write_ha_state()

    @property
    def native_value(self) -> int:
        from .const import CONF_PARTS
        from .helpers.parts import part_is_low

        count = 0
        for entry in self.hass.config_entries.async_entries(DOMAIN):
            if entry.unique_id == GLOBAL_UNIQUE_ID:
                continue
            rd = getattr(entry, "runtime_data", None)
            store = getattr(rd, "store", None) if rd else None
            if store is None:
                continue
            for part in (entry.data.get(CONF_PARTS) or {}).values():
                if part_is_low(part, store.get_part_stock(part["id"])):
                    count += 1
        return count


class BatteryFleetLowSensor(SensorEntity):
    """How many batteries across all Battery Notes devices are low right now.

    Aggregate over the fleet (not one sensor per battery). Its state is the
    threshold source for the single "Replace low batteries" fleet task; the
    grouped shopping needs + forecast ride along as attributes. Lives on the
    global hub device; refreshes off the Battery Notes lifecycle events.
    """

    _attr_has_entity_name = True
    _attr_translation_key = "batteries_to_replace"
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:battery-alert"
    _attr_native_unit_of_measurement = "batteries"

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the global battery-fleet low-count sensor."""
        self.hass = hass
        self._attr_unique_id = f"{GLOBAL_UNIQUE_ID}_batteries_to_replace"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, GLOBAL_UNIQUE_ID)},
            name="Maintenance Supporter",
            entry_type=DeviceEntryType.SERVICE,
        )
        self.entity_id = async_generate_entity_id(ENTITY_ID_FORMAT, "maintenance_supporter_batteries_to_replace", hass=hass)

    async def async_added_to_hass(self) -> None:
        """Refresh on Battery Notes threshold/replaced/increased events."""
        await super().async_added_to_hass()
        for event in (
            "battery_notes_battery_threshold",
            "battery_notes_battery_replaced",
            "battery_notes_battery_increased",
        ):
            self.async_on_remove(self.hass.bus.async_listen(event, self._handle_event))

    @callback
    def _handle_event(self, _event: Any) -> None:
        self.async_write_ha_state()

    def _overview(self) -> BatteryOverview:
        from .helpers.battery_fleet import compute_overview

        return compute_overview(self.hass)

    @property
    def native_value(self) -> int:
        return self._overview().low_count

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        ov = self._overview()
        return {
            "total_batteries": ov.total,
            "soon_count": len(ov.soon),
            "needs_now": dict(ov.needs_now),
            "needs_soon": dict(ov.needs_soon),
            "battery_types": ov.types,
        }


class DocumentStorageSensor(SensorEntity):
    """Total on-disk size of stored document blobs — the real per-backup cost.

    The state is the **physical** footprint (unique, deduped blobs); the dedup
    saving and per-category/logical breakdown ride along as attributes. It lives
    on the global "Maintenance Supporter" service device next to the summary
    sensors and refreshes off the ``SIGNAL_DOCUMENTS_UPDATED`` dispatcher signal
    (fired by the DocumentStore after every change) rather than polling.
    """

    _attr_has_entity_name = True
    _attr_translation_key = "document_storage"
    _attr_device_class = SensorDeviceClass.DATA_SIZE
    _attr_native_unit_of_measurement = UnitOfInformation.BYTES
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_suggested_display_precision = 1
    _attr_icon = "mdi:file-cabinet"

    def __init__(self, hass: HomeAssistant, store: DocumentStore) -> None:
        """Initialize the global document-storage sensor."""
        self.hass = hass
        self._store = store
        self._attr_unique_id = f"{GLOBAL_UNIQUE_ID}_document_storage"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, GLOBAL_UNIQUE_ID)},
            name="Maintenance Supporter",
            entry_type=DeviceEntryType.SERVICE,
        )
        # Stable, language-independent entity_id (has_entity_name would otherwise
        # derive the slug from the translated friendly name).
        self.entity_id = async_generate_entity_id(
            ENTITY_ID_FORMAT,
            "maintenance_supporter_document_storage",
            hass=hass,
        )

    async def async_added_to_hass(self) -> None:
        """Subscribe to document-change notifications."""
        await super().async_added_to_hass()
        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL_DOCUMENTS_UPDATED, self._handle_update))

    @callback
    def _handle_update(self) -> None:
        """Refresh state after a document mutation."""
        self.async_write_ha_state()

    @property
    def native_value(self) -> int:
        """Physical footprint of all stored blobs, in bytes."""
        return int(self._store.storage_summary()["total_bytes"])

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Dedup saving + logical/per-category breakdown.

        Per-object drill-down is intentionally left to the ``documents/storage``
        WS command (id-keyed and potentially large — not recorder-friendly).
        """
        summ = self._store.storage_summary()
        return {
            "logical_bytes": summ["logical_bytes"],
            "dedup_savings_bytes": summ["dedup_savings_bytes"],
            "blob_count": summ["blob_count"],
            "file_count": summ["file_count"],
            "link_count": summ["link_count"],
            "document_count": summ["document_count"],
            "by_category": summ["by_category"],
        }
