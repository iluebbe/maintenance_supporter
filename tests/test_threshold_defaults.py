"""Household default thresholds (#146): the consumable floor Suggested setups
pre-wires and the battery fleet's "low" floor are global settings instead of
hard-coded 10 % / 20 %."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_BATTERY_LOW_PERCENT,
    CONF_DEFAULT_CONSUMABLE_THRESHOLD,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.battery_fleet import (
    NATIVE_LOW_PERCENT,
    _note_low_threshold,
)
from custom_components.maintenance_supporter.helpers.global_options import (
    get_battery_low_percent,
    get_consumable_threshold,
)
from custom_components.maintenance_supporter.helpers.integration_signatures import discover_integration_setups

from .conftest import build_global_entry_data, setup_integration
from .test_integration_setups import _seed_sensor


def _global(options: dict | None = None) -> MockConfigEntry:
    return MockConfigEntry(
        version=1, minor_version=6, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), options=options or {}, source="user", unique_id=GLOBAL_UNIQUE_ID,
    )


async def test_resolvers_default_and_validate(hass: HomeAssistant) -> None:
    entry = _global({CONF_DEFAULT_CONSUMABLE_THRESHOLD: 5, CONF_BATTERY_LOW_PERCENT: 35})
    entry.add_to_hass(hass)
    assert get_consumable_threshold(hass) == 5
    assert get_battery_low_percent(hass) == 35
    hass.config_entries.async_update_entry(entry, options={CONF_DEFAULT_CONSUMABLE_THRESHOLD: 0, CONF_BATTERY_LOW_PERCENT: "x"})
    assert get_consumable_threshold(hass) == 10  # out of range → default
    assert get_battery_low_percent(hass) == 20 == NATIVE_LOW_PERCENT


async def test_discovery_uses_the_household_consumable_floor(hass: HomeAssistant) -> None:
    """A percent-left signature with the catalog default follows the setting."""
    entry = _global({CONF_DEFAULT_CONSUMABLE_THRESHOLD: 5})
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)
    dev = await _seed_sensor(hass, "dreame_vacuum", "d1", "Dreame L10", [("main_brush_left", "main_brush_left", "%")])
    setup = next(s for s in discover_integration_setups(hass) if s["device_id"] == dev)
    brush = next(t for t in setup["tasks"] if t["task_name"] == "Replace Main Brush")
    assert brush["direction"] == "percent_left" and brush["threshold"] == 5.0


def test_note_low_threshold_uses_the_floor() -> None:
    assert _note_low_threshold({}, 30.0) == 30.0
    assert _note_low_threshold({"battery_low_threshold": 15}, 30.0) == 30.0  # floor wins
    assert _note_low_threshold({"battery_low_threshold": 45}, 30.0) == 45.0  # higher note threshold wins
    assert _note_low_threshold({}) == float(NATIVE_LOW_PERCENT)  # default floor unchanged
