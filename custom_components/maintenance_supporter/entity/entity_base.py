"""Base entity for the Maintenance Supporter integration."""

from __future__ import annotations

from typing import Any

from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from ..const import CONF_OBJECT, DOMAIN, GLOBAL_UNIQUE_ID
from ..coordinator import MaintenanceCoordinator
from ..helpers import device_link


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

        # 2.19 device attachment — an object can live on an EXISTING device
        # owned by another integration. Home Assistant's documented way to do
        # that is to point the entity at the device and nothing else:
        # https://developers.home-assistant.io/blog/2025/07/18/updated-pattern-for-helpers-linking-to-devices/
        #
        # We used to return the device's own identifiers from `device_info`,
        # which made the registry merge our config entry onto it. HA 2026.8
        # scopes identifiers PER CONFIG ENTRY, so that no longer merges — it
        # creates a second, nameless device holding our entities while the
        # appliance's page shows none of them. Setting `device_entry` attaches
        # the entities without claiming any ownership, and works on 2026.7 too
        # (`entity_platform` uses a pre-set value when `device_info` is None).
        #
        # Resolved ONCE here so `device_info` below and the entity's device
        # cannot disagree; re-evaluated when the entry reloads, which a
        # link change already triggers.
        #
        # Resolution goes through helpers.device_link, NOT a raw
        # `async_get(stored_id)`: on HA 2026.8 `async_get` still ANSWERS for a
        # pre-migration composite id by synthesising a read-only device that
        # carries that dead id — attaching to it makes the entity registry
        # refuse the link and log a "please create a bug report" warning. The
        # resolver returns a live id or None, never the synthetic. (Called via
        # the module so tests can substitute the resolver.)
        self._linked_device: dr.DeviceEntry | None = None
        if device_id := self._object_data.get("ha_device_id"):
            resolved = device_link.resolve_linked_device_id(
                coordinator.hass, device_id, own_entry_id=coordinator.entry.entry_id
            )
            if resolved is not None:
                self._linked_device = dr.async_get(coordinator.hass).async_get(resolved)
        if self._linked_device is not None:
            self.device_entry = self._linked_device

    @property
    def device_info(self) -> DeviceInfo | None:
        """Return device info for this maintenance object.

        Three shapes (2.19, device attachment):

        * linked to an existing device → ``None``. The entity is already
          attached via ``device_entry`` (see ``__init__``); describing a device
          here would create one of our own instead.
        * ``parent_entry_id`` set → our own device, nested under the parent
          object's device via ``via_device``.
        * neither → our own stand-alone device (the historical shape).
        """
        obj = self._object_data
        hass = self.coordinator.hass

        if self._linked_device is not None:
            return None
        # A linked device that no longer exists falls through to an own device,
        # so the entities are never left device-less. Core helpers drop to no
        # device at all here; keeping the fallback preserves what this
        # integration already did, and an object with its own device page reads
        # better than one with none.

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
            if parent is not None and parent.domain == DOMAIN and parent.unique_id and parent.unique_id != GLOBAL_UNIQUE_ID:
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
