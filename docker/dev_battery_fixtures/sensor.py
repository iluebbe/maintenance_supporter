"""Five Battery-Notes-shaped fixtures, each on its own registry device.

The set is chosen so every fleet feature has a live specimen:

* Fixture Door Lock      — plain typed battery (AA x2, 72 %)
* Fixture Video Doorbell — rechargeable pack (charging icon, no table date)
* Fixture Hall Motion    — 100 % with a 21-month-old last_replaced: seed a
                           stepped statistics series onto it and the
                           unrecorded-swap detector fires WITH a device_id
* Fixture Thermostat     — low at its OWN threshold (35 %) at 30 %
* Fixture Leak Sensor    — 50 % inside the 35+20 approach band (amber bar)
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from . import DOMAIN

# slug, name, battery_type, quantity, level, replaced_months_ago, threshold, low
FIXTURES = [
    ("fixture_door_lock", "Fixture Door Lock", "AA", 2, 72.0, 8, None, False),
    ("fixture_video_doorbell", "Fixture Video Doorbell", "Battery Pack", 1, 64.0, 2, None, False),
    ("fixture_hall_motion", "Fixture Hall Motion", "CR2032", 1, 100.0, 21, None, False),
    ("fixture_thermostat", "Fixture Thermostat", "AA", 2, 30.0, 10, 35, True),
    ("fixture_leak_sensor", "Fixture Leak Sensor", "CR123A", 1, 50.0, 6, 35, False),
]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, add: AddEntitiesCallback) -> None:
    add(FixtureBattery(*spec) for spec in FIXTURES)


class FixtureBattery(SensorEntity):
    _attr_should_poll = False
    _attr_device_class = SensorDeviceClass.BATTERY
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_has_entity_name = False

    def __init__(self, slug, name, btype, qty, level, months_ago, threshold, low) -> None:
        self._attr_unique_id = f"devfix_{slug}"
        self._attr_name = f"{name} Battery+"
        self._attr_suggested_object_id = f"{slug}_battery_plus"
        self._attr_native_value = level
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, slug)},
            name=name,
            manufacturer="Dev Fixtures",
            model="Battery fixture",
        )
        attrs = {
            "battery_type": btype,
            "battery_quantity": qty,
            "battery_low": low,
            "battery_last_replaced": (dt_util.utcnow() - timedelta(days=months_ago * 30)).isoformat(),
            "device_name": name,
        }
        if threshold is not None:
            attrs["battery_low_threshold"] = threshold
        self._attr_extra_state_attributes = attrs
