"""Reset buttons, keyed and disabled by default like core roborock."""

from __future__ import annotations

import logging

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import DOMAIN, ROBOTS, SIGNAL, VALUES

_LOGGER = logging.getLogger(__name__)

BUTTON_KEYS = {
    "main_brush": "reset_main_brush_consumable",
    "side_brush": "reset_side_brush_consumable",
    "air_filter": "reset_air_filter_consumable",
    "sensor": "reset_sensor_consumable",
}


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    async_add_entities(
        ResetButton(robot, name, consumable, full) for robot, (name, cons) in ROBOTS.items() for consumable, (full, _) in cons.items()
    )


class ResetButton(ButtonEntity):
    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.CONFIG
    _attr_entity_registry_enabled_default = False

    def __init__(self, robot: str, name: str, consumable: str, full: float) -> None:
        self._key = (robot, consumable)
        self._full = full
        self._attr_translation_key = BUTTON_KEYS[consumable]
        self._attr_unique_id = f"{robot}_{BUTTON_KEYS[consumable]}"
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, robot)}, name=name, manufacturer="Roborock", model=name.split()[-1])

    async def async_press(self) -> None:
        _LOGGER.warning("DEMO reset pressed: %s -> %s h", self._key, self._full)
        VALUES[self._key] = self._full
        async_dispatcher_send(self.hass, SIGNAL, self._key)
