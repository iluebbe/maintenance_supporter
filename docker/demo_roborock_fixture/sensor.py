"""Consumable countdowns (hours left), keyed like core roborock."""

from __future__ import annotations

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTime
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import DOMAIN, ROBOTS, SIGNAL, VALUES

SENSOR_KEYS = {
    "main_brush": "main_brush_time_left",
    "side_brush": "side_brush_time_left",
    "air_filter": "filter_time_left",
    "sensor": "sensor_time_left",
}


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    async_add_entities(
        ConsumableSensor(robot, name, consumable) for robot, (name, cons) in ROBOTS.items() for consumable in cons
    )


class ConsumableSensor(SensorEntity):
    _attr_has_entity_name = True
    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.HOURS
    _attr_suggested_display_precision = 0

    def __init__(self, robot: str, name: str, consumable: str) -> None:
        self._key = (robot, consumable)
        self._attr_translation_key = SENSOR_KEYS[consumable]
        self._attr_unique_id = f"{robot}_{SENSOR_KEYS[consumable]}"
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, robot)}, name=name, manufacturer="Roborock", model=name.split()[-1])

    @property
    def native_value(self) -> float:
        return VALUES[self._key]

    async def async_added_to_hass(self) -> None:
        @callback
        def _update(key: tuple[str, str]) -> None:
            if key == self._key:
                self.async_write_ha_state()

        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL, _update))
