"""Base entity for the Maintenance Supporter integration."""

from __future__ import annotations

from typing import Any

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from ..const import CONF_OBJECT, DOMAIN
from ..coordinator import MaintenanceCoordinator


class MaintenanceEntity(CoordinatorEntity[MaintenanceCoordinator]):
    """Base class for Maintenance Supporter entities."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: MaintenanceCoordinator,
        task_id: str,
    ) -> None:
        """Initialize the base entity."""
        super().__init__(coordinator)
        self._task_id = task_id
        self._object_data = coordinator.entry.data.get(CONF_OBJECT, {})

    @property
    def device_info(self) -> DeviceInfo:
        """Return device info for this maintenance object."""
        obj = self._object_data
        identifiers = {(DOMAIN, self.coordinator.entry.unique_id or "")}

        device_info = DeviceInfo(
            identifiers=identifiers,
            name=obj.get("name", "Unknown"),
        )

        if obj.get("manufacturer"):
            device_info["manufacturer"] = obj["manufacturer"]
        if obj.get("model"):
            device_info["model"] = obj["model"]
        if obj.get("area_id"):
            device_info["suggested_area"] = obj["area_id"]

        return device_info

    @property
    def _task_data(self) -> dict[str, Any]:
        """Return the current task data from coordinator."""
        if self.coordinator.data is None:
            return {}
        tasks = self.coordinator.data.get("tasks", {})
        return tasks.get(self._task_id, {})
