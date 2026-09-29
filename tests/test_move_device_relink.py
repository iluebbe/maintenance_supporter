"""A move re-links devices by what their integration calls them — every shape.

The move tests linked a device whose identifier's first element was its own
integration ("test_devices"), which is the one shape the lookup handled on
Home Assistant 2026.8+. Real households are full of others (bug audit
2026-09-29): an ESPHome device carries only its MAC address as a connection,
HomeKit names its identifiers ``homekit_controller:accessory-id``. Their links
stayed dangling after a move, without a word.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.helpers.import_mapping import DEVICES_KEY, attach_device_hints, device_map


def _device(hass: HomeAssistant, domain: str, **kwargs: object) -> dr.DeviceEntry:
    entry = MockConfigEntry(domain=domain, title=domain)
    entry.add_to_hass(hass)
    return dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id, **kwargs)  # type: ignore[arg-type]


async def test_every_device_shape_is_found_again(hass: HomeAssistant) -> None:
    esphome = _device(hass, "esphome", connections={(dr.CONNECTION_NETWORK_MAC, "aa:bb:cc:dd:ee:ff")}, name="Plug")
    homekit = _device(hass, "homekit_controller", identifiers={("homekit_controller:accessory-id", "11:22:33:44")}, name="Lock")
    plain = _device(hass, "roborock", identifiers={("roborock", "q7_1234")}, name="Robot")

    # The export names each linked device by its identifiers AND connections.
    data = {
        "objects": [
            {"object": {"name": name, "ha_device_id": device.id}, "tasks": []}
            for name, device in (("Plug", esphome), ("Lock", homekit), ("Robot", plain))
        ]
    }
    attach_device_hints(hass, data)
    hints = data[DEVICES_KEY]
    assert hints[esphome.id]["connections"] == [[dr.CONNECTION_NETWORK_MAC, "aa:bb:cc:dd:ee:ff"]]

    # Another instance: the same devices under ids minted there.
    moved = {f"old-{device_id}": hint for device_id, hint in hints.items()}
    mapping = device_map(hass, moved)
    assert mapping == {f"old-{d.id}": d.id for d in (esphome, homekit, plain)}


async def test_a_device_that_is_not_here_stays_unmapped(hass: HomeAssistant) -> None:
    hint = {"identifiers": [["esphome", "gone"]], "connections": [[dr.CONNECTION_NETWORK_MAC, "00:00:00:00:00:01"]]}
    assert device_map(hass, {"old-gone": hint}) == {}
    # Junk shapes from a hand-edited file are skipped, not raised on.
    assert device_map(hass, {"old": {"identifiers": 5, "connections": "x"}, 7: {}, "o2": [1]}) == {}
