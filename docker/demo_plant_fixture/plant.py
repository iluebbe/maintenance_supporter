"""The plant.<name> entities — one per plant, on the plant's device."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import DOMAIN, PLANTS, SIGNAL, STATES


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    async_add_entities(DemoPlant(key, name, species) for key, (name, species, _) in PLANTS.items())


class DemoPlant(Entity):
    _attr_has_entity_name = True
    _attr_name = None
    _attr_icon = "mdi:flower"
    _attr_should_poll = False

    def __init__(self, key: str, name: str, species: str) -> None:
        self._key = key
        self._attr_unique_id = key
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, key)}, name=name, manufacturer="Plant Monitor", model=species)
        self._attr_extra_state_attributes = {"species": species}

    @property
    def state(self) -> str:
        return STATES[self._key]

    async def async_added_to_hass(self) -> None:
        @callback
        def _update(key: str) -> None:
            if key == self._key:
                self.async_write_ha_state()

        self.async_on_remove(async_dispatcher_connect(self.hass, SIGNAL, _update))
