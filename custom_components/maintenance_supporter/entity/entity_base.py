"""Base entity for the Maintenance Supporter integration."""

from __future__ import annotations

from typing import Any

from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from ..const import CONF_OBJECT, DOMAIN, GLOBAL_UNIQUE_ID
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
        """Return device info for this maintenance object.

        Three shapes (2.19, device attachment):

        * ``ha_device_id`` set → attach to that EXISTING device: return only
          its identifiers/connections so the registry merges us onto it — no
          name/manufacturer, which would overwrite the owning integration's
          metadata (the obj→device forward-sync skips linked objects too).
        * ``parent_entry_id`` set → our own device, nested under the parent
          object's device via ``via_device``.
        * neither → our own stand-alone device (the historical shape).
        """
        obj = self._object_data
        hass = self.coordinator.hass

        if device_id := obj.get("ha_device_id"):
            device = dr.async_get(hass).async_get(device_id)
            if device is not None and (device.identifiers or device.connections):
                info = DeviceInfo()
                if device.identifiers:
                    info["identifiers"] = device.identifiers
                if device.connections:
                    info["connections"] = device.connections
                return info
            # Linked device vanished → fall through to an own device so the
            # entities never end up device-less.

        identifiers = {(DOMAIN, self.coordinator.entry.unique_id or "")}

        device_info = DeviceInfo(
            identifiers=identifiers,
            name=obj.get("name", "Unknown"),
        )

        if obj.get("manufacturer"):
            device_info["manufacturer"] = obj["manufacturer"]
        if obj.get("model"):
            device_info["model"] = obj["model"]
        if obj.get("serial_number"):
            device_info["serial_number"] = obj["serial_number"]
        if obj.get("area_id"):
            device_info["suggested_area"] = obj["area_id"]

        if parent_entry_id := obj.get("parent_entry_id"):
            parent = hass.config_entries.async_get_entry(parent_entry_id)
            if (
                parent is not None
                and parent.domain == DOMAIN
                and parent.unique_id
                and parent.unique_id != GLOBAL_UNIQUE_ID
            ):
                device_info["via_device"] = (DOMAIN, parent.unique_id)

        return device_info

    @property
    def _task_data(self) -> dict[str, Any]:
        """Return the current task data from coordinator."""
        if self.coordinator.data is None:
            return {}
        tasks: dict[str, Any] = self.coordinator.data.get("tasks", {})
        result: dict[str, Any] = tasks.get(self._task_id, {})
        return result
