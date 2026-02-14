"""Sensor platform for the Maintenance Supporter integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    TriggerEntityState,
)
from .entity.entity_base import MaintenanceEntity
from .entity.triggers import create_trigger

_LOGGER = logging.getLogger(__name__)

PARALLEL_UPDATES = 1


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sensor entities for a maintenance object."""
    # Skip global entry
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        return

    runtime_data = hass.data.get(DOMAIN, {}).get(entry.entry_id)
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
    _trigger = None

    def __init__(
        self,
        coordinator,
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
        self._attr_translation_placeholders = {"task_name": task_data.get("name", "")}

    @property
    def native_value(self) -> str | None:
        """Return the current status of the task."""
        task = self._task_data
        if not task:
            return None
        return task.get("_status", MaintenanceStatus.OK)

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
        """Return extended attributes for the sensor."""
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

        # Trigger attributes
        trigger_config = task.get("trigger_config")
        if trigger_config:
            attrs["trigger_entity"] = trigger_config.get("entity_id")
            attrs["trigger_attribute"] = trigger_config.get("attribute")
            attrs["trigger_type"] = trigger_config.get("type")
            attrs["trigger_active"] = task.get("_trigger_active", False)
            attrs["trigger_current_value"] = task.get("_trigger_current_value")
            attrs["trigger_entity_state"] = task.get(
                "_trigger_entity_state", TriggerEntityState.AVAILABLE
            )

            # Type-specific trigger attributes
            if trigger_config.get("type") == "threshold":
                attrs["trigger_above"] = trigger_config.get("trigger_above")
                attrs["trigger_below"] = trigger_config.get("trigger_below")
                attrs["trigger_for_minutes"] = trigger_config.get(
                    "trigger_for_minutes"
                )
            elif trigger_config.get("type") == "counter":
                attrs["trigger_target_value"] = trigger_config.get(
                    "trigger_target_value"
                )
                attrs["trigger_delta_mode"] = trigger_config.get(
                    "trigger_delta_mode"
                )
                # Baseline: live from trigger object, fallback to config
                attrs["trigger_baseline_value"] = (
                    self._trigger._baseline_value
                    if self._trigger is not None
                    and hasattr(self._trigger, "_baseline_value")
                    else trigger_config.get("trigger_baseline_value")
                )
                # Current delta: only available live from trigger object
                attrs["trigger_current_delta"] = (
                    self._trigger.current_delta
                    if self._trigger is not None
                    and hasattr(self._trigger, "current_delta")
                    else None
                )
            elif trigger_config.get("type") == "state_change":
                attrs["trigger_from_state"] = trigger_config.get(
                    "trigger_from_state"
                )
                attrs["trigger_to_state"] = trigger_config.get("trigger_to_state")
                attrs["trigger_target_changes"] = trigger_config.get(
                    "trigger_target_changes"
                )
                # Change count: live from trigger object, fallback to config
                attrs["trigger_change_count"] = (
                    self._trigger.change_count
                    if self._trigger is not None
                    and hasattr(self._trigger, "change_count")
                    else trigger_config.get("trigger_change_count", 0)
                )
            elif trigger_config.get("type") == "runtime":
                attrs["trigger_runtime_hours"] = trigger_config.get(
                    "trigger_runtime_hours"
                )
                if (
                    self._trigger is not None
                    and hasattr(self._trigger, "accumulated_hours")
                ):
                    attrs["trigger_accumulated_hours"] = round(
                        self._trigger.current_runtime_hours, 2
                    )
                    attrs["trigger_remaining_hours"] = round(
                        self._trigger.remaining_hours, 2
                    )
                else:
                    acc_sec = trigger_config.get(
                        "trigger_accumulated_seconds", 0.0
                    )
                    target = trigger_config.get("trigger_runtime_hours", 100.0)
                    attrs["trigger_accumulated_hours"] = round(
                        acc_sec / 3600.0, 2
                    )
                    attrs["trigger_remaining_hours"] = round(
                        max(0.0, target - acc_sec / 3600.0), 2
                    )

        # Last history entry
        last_entry = task.get("_last_entry")
        if last_entry:
            attrs["last_entry"] = last_entry

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

        # Weibull advanced statistics (Phase 4)
        if analysis and analysis.get("weibull_beta") is not None:
            attrs["weibull_beta"] = analysis["weibull_beta"]
            attrs["weibull_eta"] = analysis.get("weibull_eta")
            attrs["weibull_r_squared"] = analysis.get("weibull_r_squared")
            # Beta interpretation
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

        # Sensor-driven prediction attributes (Phase 3)
        if task.get("_degradation_rate") is not None:
            attrs["degradation_rate"] = task["_degradation_rate"]
            attrs["degradation_trend"] = task.get("_degradation_trend")
        if task.get("_days_until_threshold") is not None:
            attrs["days_until_threshold"] = task["_days_until_threshold"]
            attrs["threshold_prediction_confidence"] = task.get(
                "_threshold_prediction_confidence"
            )
        if task.get("_environmental_factor") is not None:
            attrs["environmental_factor"] = task["_environmental_factor"]
            attrs["environmental_entity"] = task.get("_environmental_entity")

        return attrs

    async def async_added_to_hass(self) -> None:
        """When entity is added to hass, set up trigger if configured."""
        await super().async_added_to_hass()

        task_data = self.coordinator.entry.data.get(CONF_TASKS, {}).get(
            self._task_id, {}
        )
        trigger_config = task_data.get("trigger_config")

        if trigger_config and trigger_config.get("entity_id"):
            try:
                self._trigger = create_trigger(
                    hass=self.hass,
                    entity=self,
                    trigger_config=trigger_config,
                )
                await self._trigger.async_setup()
                _LOGGER.debug(
                    "Trigger setup for %s monitoring %s",
                    self.entity_id,
                    trigger_config.get("entity_id"),
                )
            except (HomeAssistantError, ValueError, TypeError, KeyError):
                _LOGGER.exception(
                    "Failed to set up trigger for %s", self.entity_id
                )

    async def async_will_remove_from_hass(self) -> None:
        """When entity is removed, clean up trigger."""
        if self._trigger is not None:
            await self._trigger.async_teardown()
            self._trigger = None
        await super().async_will_remove_from_hass()

    @callback
    def async_update_trigger_state(
        self, is_triggered: bool, current_value: float | None = None
    ) -> None:
        """Update trigger state from trigger callback."""
        if self.coordinator.data is None:
            return

        tasks = self.coordinator.data.get("tasks", {})
        task = tasks.get(self._task_id, {})
        task["_trigger_active"] = is_triggered
        if current_value is not None:
            task["_trigger_current_value"] = current_value

        # Recompute _status immediately so native_value reflects the change
        task["_status"] = self._compute_live_status(task)

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
