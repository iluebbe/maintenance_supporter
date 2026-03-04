"""Binary sensor platform for the Maintenance Supporter integration.

Each maintenance task gets a binary_sensor entity that is ON when the task
is overdue or triggered, making it easy to use in HA automations.

Update paths:
  1. CoordinatorEntity._handle_coordinator_update (every 5 min) — base mechanism
  2. SIGNAL_TASK_RESET dispatcher signal (on complete/skip/reset) — immediate
  3. sensor.py trigger callbacks update coordinator data → picked up on next
     coordinator refresh automatically
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CONF_OBJECT,
    CONF_TASKS,
    GLOBAL_UNIQUE_ID,
    SIGNAL_TASK_RESET,
    MaintenanceStatus,
)
from .coordinator import MaintenanceCoordinator
from .entity.entity_base import MaintenanceEntity

if TYPE_CHECKING:
    from . import MaintenanceSupporterConfigEntry

_LOGGER = logging.getLogger(__name__)

PARALLEL_UPDATES = 0

_PROBLEM_STATUSES = {MaintenanceStatus.OVERDUE, MaintenanceStatus.TRIGGERED}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: MaintenanceSupporterConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up binary sensor entities for a maintenance object."""
    if entry.unique_id == GLOBAL_UNIQUE_ID:
        return

    runtime_data = entry.runtime_data
    if runtime_data is None or runtime_data.coordinator is None:
        _LOGGER.error("No coordinator found for entry %s", entry.entry_id)
        return

    coordinator = runtime_data.coordinator
    tasks = entry.data.get(CONF_TASKS, {})

    entities = [
        MaintenanceBinarySensor(coordinator, task_id) for task_id in tasks
    ]

    async_add_entities(entities)
    _LOGGER.debug(
        "Added %d binary_sensor entities for %s",
        len(entities),
        entry.title,
    )


class MaintenanceBinarySensor(MaintenanceEntity, BinarySensorEntity):
    """Binary sensor that is ON when a maintenance task needs attention.

    is_on = True when task status is OVERDUE or TRIGGERED.
    device_class = PROBLEM so that ON = bad (needs attention).
    """

    _attr_device_class = BinarySensorDeviceClass.PROBLEM
    _attr_translation_key = "maintenance_task_due"

    def __init__(
        self,
        coordinator: MaintenanceCoordinator,
        task_id: str,
    ) -> None:
        """Initialize the binary sensor."""
        super().__init__(coordinator, task_id)

        obj_data = coordinator.entry.data.get(CONF_OBJECT, {})
        task_data = coordinator.entry.data.get(CONF_TASKS, {}).get(task_id, {})

        object_slug = (
            obj_data.get("name", "unknown")
            .lower()
            .replace(" ", "_")
            .replace("-", "_")
        )
        self._attr_unique_id = (
            f"maintenance_supporter_{object_slug}_{task_id}_overdue"
        )

        entity_slug = task_data.get("entity_slug")
        if entity_slug:
            self._attr_name = f"{entity_slug} overdue"
        self._attr_translation_placeholders = {
            "task_name": task_data.get("name", ""),
        }

    @property
    def is_on(self) -> bool | None:
        """Return True if the task is overdue or triggered."""
        task = self._task_data
        if not task:
            return None
        status = task.get("_status", MaintenanceStatus.OK)
        return status in _PROBLEM_STATUSES

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return additional attributes."""
        task = self._task_data
        if not task:
            return {}
        return {
            "maintenance_status": task.get("_status", MaintenanceStatus.OK),
            "days_until_due": task.get("_days_until_due"),
            "next_due": task.get("_next_due"),
            "parent_object": self._object_data.get("name"),
        }

    async def async_added_to_hass(self) -> None:
        """Register for task reset signals for immediate updates."""
        await super().async_added_to_hass()

        signal = SIGNAL_TASK_RESET.format(
            entry_id=self.coordinator.entry.entry_id,
            task_id=self._task_id,
        )
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, signal, self._handle_task_reset
            )
        )

    @callback
    def _handle_task_reset(self) -> None:
        """Handle task reset (completion/skip/reset).

        The sensor entity's handler runs first (registered earlier during
        platform setup) and updates coordinator.data with the new _status.
        We then re-read coordinator data and write our HA state so the
        binary sensor reflects the change immediately, not 5 minutes later.

        Even if coordinator data is not yet refreshed, clearing _trigger_active
        and recomputing status here ensures correctness regardless of ordering.
        """
        if self.coordinator.data is None:
            return

        tasks = self.coordinator.data.get(CONF_TASKS, {})
        task = tasks.get(self._task_id, {})
        if not task:
            return

        # Mirror what sensor._handle_task_reset does: clear trigger state
        # and recompute status so we don't depend on execution order.
        task["_trigger_active"] = False
        task["_trigger_current_value"] = None
        new_status = self._compute_live_status(task)
        task["_status"] = new_status

        # Always write state on reset — the task was explicitly acted upon,
        # and attributes like days_until_due / next_due have changed.
        self.async_write_ha_state()

    @staticmethod
    def _compute_live_status(task: dict[str, Any]) -> str:
        """Compute task status from coordinator data dict.

        Mirrors MaintenanceTask.status / MaintenanceSensor._compute_live_status.
        """
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
