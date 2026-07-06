"""Bidirectional area sync between obj.area_id and device.area_id (issue #48).

DeviceInfo.suggested_area only fires on first device creation. Without
explicit sync, dashboard updates never reach the device, and HA-UI area
changes never reach the dashboard. These tests pin the two-way sync.

In-scope:
  forward (obj → device):  area_id, name, manufacturer, model, serial_number
  reverse (device → obj):  area_id only (HA's name_by_user is sticky-by-design)
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr

from custom_components.maintenance_supporter.const import CONF_OBJECT
from tests.conftest import setup_integration


async def _device_for(hass: HomeAssistant, entry: ConfigEntry) -> Any:
    devices = dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)
    assert len(devices) == 1
    return devices[0]


async def _update_obj(hass: HomeAssistant, entry: ConfigEntry, **field_updates: Any) -> None:
    """Apply obj-field updates the same way ws_update_object does."""
    obj = dict(entry.data.get(CONF_OBJECT, {}))
    obj.update(field_updates)
    new_data = {**entry.data, CONF_OBJECT: obj}
    hass.config_entries.async_update_entry(entry, data=new_data)
    await hass.async_block_till_done()


async def test_forward_sync_area_set_after_creation(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Setting obj.area_id after creation propagates to device.area_id."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    await _update_obj(hass, object_config_entry, area_id="kitchen")

    device = await _device_for(hass, object_config_entry)
    assert device.area_id == "kitchen"


async def test_forward_sync_area_cleared(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Clearing obj.area_id (set → None) clears device.area_id."""
    await setup_integration(hass, global_config_entry, object_config_entry)
    await _update_obj(hass, object_config_entry, area_id="garage")
    assert (await _device_for(hass, object_config_entry)).area_id == "garage"

    await _update_obj(hass, object_config_entry, area_id=None)
    assert (await _device_for(hass, object_config_entry)).area_id is None


async def test_forward_sync_meta_fields(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """name, manufacturer, model, serial_number all propagate to device."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    await _update_obj(
        hass,
        object_config_entry,
        name="New Pool Pump",
        manufacturer="Acme Inc",
        model="P-9000",
        serial_number="SN-42",
    )

    device = await _device_for(hass, object_config_entry)
    assert device.name == "New Pool Pump"
    assert device.manufacturer == "Acme Inc"
    assert device.model == "P-9000"
    assert device.serial_number == "SN-42"


async def test_reverse_sync_area_from_ha_ui(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """When HA-UI sets device.area_id, obj.area_id mirrors back."""
    await setup_integration(hass, global_config_entry, object_config_entry)
    device = await _device_for(hass, object_config_entry)

    # Simulate HA-UI changing the device area
    dr.async_get(hass).async_update_device(device.id, area_id="bathroom")
    await hass.async_block_till_done()

    obj = hass.config_entries.async_get_entry(object_config_entry.entry_id).data.get(CONF_OBJECT, {})
    assert obj.get("area_id") == "bathroom"


async def test_no_loop_between_forward_and_reverse(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """obj→device and device→obj listeners must terminate, not ping-pong.

    Each direction skips the update when values already match, so a single
    user action results in one update per side and no further events.
    """
    await setup_integration(hass, global_config_entry, object_config_entry)

    # Forward path: dashboard sets area
    await _update_obj(hass, object_config_entry, area_id="office")
    # Both listeners must have settled — block_till_done flushes pending tasks.
    await hass.async_block_till_done()
    device = await _device_for(hass, object_config_entry)
    obj = hass.config_entries.async_get_entry(object_config_entry.entry_id).data.get(CONF_OBJECT, {})
    assert device.area_id == "office"
    assert obj.get("area_id") == "office"

    # Reverse path: HA-UI sets area
    dr.async_get(hass).async_update_device(device.id, area_id="basement")
    await hass.async_block_till_done()
    device = await _device_for(hass, object_config_entry)
    obj = hass.config_entries.async_get_entry(object_config_entry.entry_id).data.get(CONF_OBJECT, {})
    assert device.area_id == "basement"
    assert obj.get("area_id") == "basement"
