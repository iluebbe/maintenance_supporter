"""#219: a battery counts as low only once it has read low for a while.

Shelly BT sensors sometimes report a very low level for some minutes and
recover by themselves. The fleet latched a battery at its first low reading,
so such a dip put it on the list and triggered the fleet task, and with the
automatic record on, its recovery recorded a replacement nobody made. With
``battery_low_delay_minutes`` set, a battery is low once it has read low that
long; 0 (the default) keeps "at once".
"""

from __future__ import annotations

from datetime import timedelta

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import (
    BATTERY_LOW_DELAY_MINUTES_RANGE,
    CONF_BATTERY_AUTO_RECORD_RECOVERY,
    CONF_BATTERY_LOW_DELAY_MINUTES,
    CONF_BATTERY_LOW_PERCENT,
)
from custom_components.maintenance_supporter.helpers.battery_fleet import (
    Battery,
    apply_low_latch,
    compute_overview,
    get_battery_low_delay_minutes,
)

from .conftest import call_ws_handler, make_global_entry, make_ws_connection, setup_integration

PLUS = "sensor.door_battery_plus"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    return make_global_entry(hass, minor_version=6, options={CONF_BATTERY_LOW_PERCENT: 10, CONF_BATTERY_LOW_DELAY_MINUTES: 10})


def _level(hass: HomeAssistant, level: float) -> None:
    hass.states.async_set(
        PLUS,
        str(level),
        {
            "device_class": "battery",
            "battery_type": "CR2032",
            "battery_quantity": 1,
            "battery_low": level <= 10,
            "battery_low_threshold": 10,
            "device_name": "Door",
            "battery_last_replaced": "2026-01-01T00:00:00+00:00",
        },
    )


def _door_device(hass: HomeAssistant) -> None:
    """A registry device for the note: the record path writes to it."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = MockConfigEntry(domain="test", data={})
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id, identifiers={("test", "door")}, name="Door")
    er.async_get(hass).async_get_or_create("sensor", "battery_notes", "door_plus", suggested_object_id="door_battery_plus", device_id=device.id)


async def _fleet(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args


def test_the_latch_waits_for_the_delay() -> None:
    def bat(low: bool, level: float, *, available: bool = True) -> Battery:
        return Battery("sensor.a", "A", "CR2032", 1, low, level, None, available=available)

    t0 = dt_util.utcnow()

    def at(minutes: float) -> str:
        return (t0 + timedelta(minutes=minutes)).isoformat()

    latch: dict = {}
    low_since: dict = {}
    b = bat(True, 4)
    assert apply_low_latch([b], latch, recovered=50, now_iso=at(0), low_since=low_since, low_delay_minutes=10) is False
    assert not b.low and latch == {} and low_since == {"sensor.a": at(0)}
    b = bat(True, 4)
    apply_low_latch([b], latch, recovered=50, now_iso=at(9), low_since=low_since, low_delay_minutes=10)
    assert not b.low and latch == {}
    b = bat(True, 4)
    assert apply_low_latch([b], latch, recovered=50, now_iso=at(10), low_since=low_since, low_delay_minutes=10) is True
    assert b.low and "sensor.a" in latch and low_since == {}

    # A dip that ends before the delay leaves nothing behind; an unavailable
    # reading in between is no proof either way.
    latch, low_since = {}, {}
    for minute, reading in ((0, bat(True, 4)), (3, bat(False, 4, available=False)), (5, bat(False, 85))):
        apply_low_latch([reading], latch, recovered=50, now_iso=at(minute), low_since=low_since, low_delay_minutes=10)
        assert not reading.low
        if minute == 3:
            assert low_since == {"sensor.a": at(0)}
    assert latch == {} and low_since == {}

    # No delay: at once, as before.
    b = bat(True, 4)
    apply_low_latch([b], {}, recovered=50, now_iso=at(0), low_since={}, low_delay_minutes=0)
    assert b.low


async def test_a_short_dip_never_reaches_the_list(hass: HomeAssistant, global_entry: MockConfigEntry, freezer: FrozenDateTimeFactory) -> None:
    await setup_integration(hass, global_entry)
    _level(hass, 85)
    await _fleet(hass)
    assert compute_overview(hass).low_count == 0

    _level(hass, 4)
    assert compute_overview(hass).low_count == 0, "low for a moment only"
    freezer.tick(timedelta(minutes=4))
    _level(hass, 86)
    freezer.tick(timedelta(minutes=10))
    assert compute_overview(hass).low_count == 0

    # Low for good: counted once the delay is over, without a new reading.
    _level(hass, 4)
    assert compute_overview(hass).low_count == 0
    freezer.tick(timedelta(minutes=10))
    assert compute_overview(hass).low_count == 1


async def test_a_dip_records_no_replacement(hass: HomeAssistant, global_entry: MockConfigEntry, freezer: FrozenDateTimeFactory) -> None:
    """With the automatic record on, the dip's recovery recorded a swap."""
    hass.config_entries.async_update_entry(global_entry, options={**global_entry.options, CONF_BATTERY_AUTO_RECORD_RECOVERY: True})
    await setup_integration(hass, global_entry)
    _door_device(hass)
    calls = async_mock_service(hass, "battery_notes", "set_battery_replaced")
    _level(hass, 85)
    await _fleet(hass)
    compute_overview(hass)
    _level(hass, 4)
    compute_overview(hass)
    freezer.tick(timedelta(minutes=5))
    _level(hass, 96)
    compute_overview(hass)
    await hass.async_block_till_done()
    assert not calls

    # Without the delay the same dip latched, and its recovery recorded one.
    hass.config_entries.async_update_entry(global_entry, options={**global_entry.options, CONF_BATTERY_LOW_DELAY_MINUTES: 0})
    await hass.async_block_till_done()
    _level(hass, 4)
    compute_overview(hass)
    _level(hass, 96)
    compute_overview(hass)
    await hass.async_block_till_done()
    assert len(calls) == 1


async def test_the_setting(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.settings_registry import int_range, setting_default
    from custom_components.maintenance_supporter.websocket.dashboard import _build_full_settings
    from custom_components.maintenance_supporter.helpers.settings_sanitize import sanitize_settings_input

    assert int_range(CONF_BATTERY_LOW_DELAY_MINUTES) == BATTERY_LOW_DELAY_MINUTES_RANGE == (0, 1440)
    assert setting_default(CONF_BATTERY_LOW_DELAY_MINUTES) == 0
    assert _build_full_settings({})["general"]["battery_low_delay_minutes"] == 0
    assert sanitize_settings_input({CONF_BATTERY_LOW_DELAY_MINUTES: 30})[0] == {CONF_BATTERY_LOW_DELAY_MINUTES: 30}
    assert sanitize_settings_input({CONF_BATTERY_LOW_DELAY_MINUTES: 1441})[0] == {}
    entry = make_global_entry(hass, minor_version=6, options={})
    assert get_battery_low_delay_minutes(hass) == 0
    hass.config_entries.async_update_entry(entry, options={CONF_BATTERY_LOW_DELAY_MINUTES: 15})
    assert get_battery_low_delay_minutes(hass) == 15
    hass.config_entries.async_update_entry(entry, options={CONF_BATTERY_LOW_DELAY_MINUTES: "junk"})
    assert get_battery_low_delay_minutes(hass) == 0
