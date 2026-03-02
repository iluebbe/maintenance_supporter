"""Sensor platform for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_ENTITY_LOGIC,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)
from .coordinator import MaintenanceCoordinator
from .entity.entity_base import MaintenanceEntity
from .entity.triggers import BaseTrigger, create_triggers, normalize_entity_ids

if TYPE_CHECKING:
    from . import MaintenanceSupporterConfigEntry

_LOGGER = logging.getLogger(__name__)

PARALLEL_UPDATES = 0


async def async_setup_entry(
    hass: HomeAssistant,
    entry: MaintenanceSupporterConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sensor entities for a maintenance object."""
    # Skip global entry
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        return

    runtime_data = entry.runtime_data
    if runtime_data is None or runtime_data.coordinator is None:
        _LOGGER.error("No coordinator found for entry %s", entry.entry_id)
        return

    coordinator = runtime_data.coordinator
    tasks = entry.data.get(CONF_TASKS, {})

    entities = [
        MaintenanceSensor(coordinator, task_id)
        for task_id in tasks
    ]

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
    ]
    # Note: _triggers, _trigger_states, _trigger_values are instance-level
    # only (initialised in __init__).  No class-level mutable defaults.

    def __init__(
        self,
        coordinator: MaintenanceCoordinator,
        task_id: str,
    ) -> None:
        """Initialize the maintenance sensor."""
        super().__init__(coordinator, task_id)

        obj_data = coordinator.entry.data.get(CONF_OBJECT, {})
        task_data = coordinator.entry.data.get(CONF_TASKS, {}).get(task_id, {})

        object_slug = (
            obj_data.get("name", "unknown").lower().replace(" ", "_").replace("-", "_")
        )
        self._attr_unique_id = f"maintenance_supporter_{object_slug}_{task_id}"

        # Use custom entity_slug as the friendly name if provided
        entity_slug = task_data.get("entity_slug")
        if entity_slug:
            self._attr_name = entity_slug
        self._attr_translation_placeholders = {"task_name": task_data.get("name", "")}

        # Instance-level mutable state (class attrs are just defaults)
        self._triggers = []
        self._trigger_states = {}
        self._trigger_values = {}

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

        attrs: dict[str, Any] = {
            "maintenance_type": task.get("type"),
            "schedule_type": task.get("schedule_type"),
            "interval_days": task.get("interval_days"),
            "warning_days": task.get("warning_days"),
            "last_performed": task.get("last_performed"),
            "next_due": task.get("_next_due"),
            "days_until_due": task.get("_days_until_due"),
            "parent_object": self._object_data.get("name"),
            "times_performed": task.get("_times_performed", 0),
            "total_cost": task.get("_total_cost", 0.0),
            "average_duration": task.get("_average_duration"),
            "notes": task.get("notes"),
            "documentation_url": task.get("documentation_url"),
        }

        # Trigger attributes (static config only — no fast-changing values)
        trigger_config = task.get("trigger_config")
        if trigger_config:
            ttype = trigger_config.get("type")
            attrs["trigger_type"] = ttype
            attrs["trigger_active"] = task.get("_trigger_active", False)

            if ttype == "threshold":
                attrs["trigger_above"] = trigger_config.get("trigger_above")
                attrs["trigger_below"] = trigger_config.get("trigger_below")
                attrs["trigger_for_minutes"] = trigger_config.get(
                    "trigger_for_minutes"
                )
            elif ttype == "counter":
                attrs["trigger_target_value"] = trigger_config.get(
                    "trigger_target_value"
                )
                attrs["trigger_delta_mode"] = trigger_config.get(
                    "trigger_delta_mode"
                )
            elif ttype == "state_change":
                attrs["trigger_from_state"] = trigger_config.get(
                    "trigger_from_state"
                )
                attrs["trigger_to_state"] = trigger_config.get("trigger_to_state")
                attrs["trigger_target_changes"] = trigger_config.get(
                    "trigger_target_changes"
                )
            elif ttype == "runtime":
                attrs["trigger_runtime_hours"] = trigger_config.get(
                    "trigger_runtime_hours"
                )
            elif ttype == "compound":
                attrs["compound_logic"] = trigger_config.get(
                    "compound_logic", "AND"
                )
                conditions = trigger_config.get("conditions", [])
                attrs["compound_conditions_count"] = len(conditions)

        # Adaptive scheduling attributes
        if task.get("_suggested_interval") is not None:
            attrs["suggested_interval"] = task.get("_suggested_interval")
            attrs["interval_confidence"] = task.get("_interval_confidence")
        adaptive_cfg = task.get("adaptive_config")
        if adaptive_cfg:
            attrs["adaptive_scheduling_enabled"] = adaptive_cfg.get(
                "enabled", False
            )

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
            attrs["confidence_interval_high"] = analysis.get(
                "confidence_interval_high"
            )

        return attrs

    async def async_added_to_hass(self) -> None:
        """When entity is added to hass, set up triggers if configured."""
        await super().async_added_to_hass()

        task_data = self.coordinator.entry.data.get(CONF_TASKS, {}).get(
            self._task_id, {}
        )
        trigger_config = task_data.get("trigger_config")

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
            _LOGGER.exception(
                "Failed to set up triggers for %s", self.entity_id
            )

    async def async_will_remove_from_hass(self) -> None:
        """When entity is removed, clean up triggers."""
        for trigger in self._triggers:
            await trigger.async_teardown()
        self._triggers = []
        self._trigger_states = {}
        self._trigger_values = {}
        await super().async_will_remove_from_hass()

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

        tasks = self.coordinator.data.get("tasks", {})
        task = tasks.get(self._task_id, {})

        # Track per-entity state
        if trigger_entity_id is not None:
            self._trigger_states[trigger_entity_id] = is_triggered
            if current_value is not None:
                self._trigger_values[trigger_entity_id] = current_value

        # Aggregate trigger states
        if len(self._triggers) > 1:
            trigger_config = self.coordinator.entry.data.get(CONF_TASKS, {}).get(
                self._task_id, {}
            ).get("trigger_config", {})
            entity_logic = trigger_config.get("entity_logic", DEFAULT_ENTITY_LOGIC)

            if entity_logic == "all":
                aggregated = bool(self._trigger_states) and all(
                    self._trigger_states.values()
                )
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

        # Only write HA state when status actually changes to avoid
        # unnecessary recorder writes on every trigger value update.
        if new_status != old_status:
            self.async_write_ha_state()

    @staticmethod
    def _compute_live_status(task: dict[str, Any]) -> str:
        """Compute task status from coordinator data dict (mirrors MaintenanceTask.status)."""
        if task.get("_trigger_active", False):
            return MaintenanceStatus.TRIGGERED

        days = task.get("_days_until_due")
        if days is None:
            return MaintenanceStatus.OK

        warning_days = task.get("warning_days", 7)
        if days < 0:
            return MaintenanceStatus.OVERDUE
        if days <= warning_days:
            return MaintenanceStatus.DUE_SOON
        return MaintenanceStatus.OK
