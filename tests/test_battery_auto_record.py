"""#181 follow-up: auto-record a replacement when a low battery recovers.

With the advanced setting ``battery_auto_record_recovery`` (default off) on, a
level-driven battery the #180 latch releases BECAUSE ITS LEVEL rose above
``battery_recovered_percent`` is recorded through the same path as the
roster's calendar chip (``async_record_replacement``): the date goes to
Battery Notes' ``set_battery_replaced`` and the note's own quantity of the
type's cells leaves the fleet's stock — once per day. A release by a newer
replacement date already counts as recorded; native rows (no note) and
rechargeables are skipped.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_BATTERY_AUTO_RECORD_RECOVERY,
    CONF_BATTERY_LOW_PERCENT,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.battery_fleet import (
    Battery,
    _schedule_auto_record,
    compute_overview,
    get_battery_auto_record_recovery,
)
from custom_components.maintenance_supporter.helpers.battery_fleet_setup import find_fleet_entry
from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

from .conftest import build_global_entry_data, call_ws_handler, make_global_entry, make_ws_connection, setup_integration

PLUS = "sensor.lock_battery_plus"


def _global_entry(hass: HomeAssistant, *, auto: bool) -> MockConfigEntry:
    # Low floor 5 % (4 % is low, 8 % is not); recovery threshold = default 50.
    options = {CONF_BATTERY_LOW_PERCENT: 5}
    if auto:
        options[CONF_BATTERY_AUTO_RECORD_RECOVERY] = True
    entry = MockConfigEntry(domain=DOMAIN, data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID, options=options)
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    return _global_entry(hass, auto=True)


def _noted_device(hass: HomeAssistant, *, level: str, low: bool, last: str | None = None, btype: str = "AA") -> str:
    """A registry device with a Battery Notes battery_plus (type ×2) on it."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = MockConfigEntry(domain="test", data={})
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id, identifiers={("test", "lock")}, name="Lock")
    er.async_get(hass).async_get_or_create("sensor", "battery_notes", "lock_plus", suggested_object_id="lock_battery_plus", device_id=device.id)
    _level(hass, level, low=low, last=last, btype=btype)
    return device.id


def _level(hass: HomeAssistant, level: str, *, low: bool, last: str | None = None, btype: str = "AA") -> None:
    hass.states.async_set(
        PLUS,
        level,
        {
            "device_class": "battery",
            "battery_type": btype,
            "battery_quantity": 2,
            "battery_low": low,
            "battery_low_threshold": 5,
            "device_name": "Lock",
            **({"battery_last_replaced": last} if last else {}),
        },
    )


async def _fleet_with_stock(hass: HomeAssistant, stock: int = 10):
    from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    fleet = find_fleet_entry(hass)
    assert fleet is not None
    await async_change_part_stock(hass, fleet, "batt_aa", absolute=stock)
    return fleet


def _stock(fleet, pid: str = "batt_aa"):
    return fleet.runtime_data.store.get_part_stock(pid)


async def test_level_recovery_records_and_consumes(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    device_id = _noted_device(hass, level="4", low=True, last="2025-01-10T09:00:00+00:00")
    calls = async_mock_service(hass, "battery_notes", "set_battery_replaced")
    fleet = await _fleet_with_stock(hass, 10)
    assert compute_overview(hass).low_count == 1  # latched (#180)

    # Hovering below the recovery threshold: still low, nothing recorded.
    _level(hass, "30", low=False, last="2025-01-10T09:00:00+00:00")
    assert compute_overview(hass).low_count == 1
    await hass.async_block_till_done()
    assert not calls and _stock(fleet) == 10

    # A fresh cell reports 96 %: released by its level → recorded automatically.
    before = dt_util.utcnow()
    _level(hass, "96", low=False, last="2025-01-10T09:00:00+00:00")
    assert compute_overview(hass).low_count == 0
    await hass.async_block_till_done()
    assert len(calls) == 1
    assert calls[0].data["device_id"] == device_id
    recorded_at = dt_util.parse_datetime(calls[0].data["datetime_replaced"])
    assert recorded_at is not None and before <= recorded_at <= dt_util.utcnow()
    # The note's own quantity (2 AA) left the stock — no task link involved.
    assert _stock(fleet) == 8

    # Later refreshes of the (released) battery do nothing more.
    assert compute_overview(hass).low_count == 0
    await hass.async_block_till_done()
    assert len(calls) == 1 and _stock(fleet) == 8


async def test_same_day_bounce_consumes_once(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Re-latching and recovering again on the same day (a bad contact) hits
    the record path's once-per-day memory: recorded again, consumed not."""
    await setup_integration(hass, global_entry)
    _noted_device(hass, level="4", low=True)
    calls = async_mock_service(hass, "battery_notes", "set_battery_replaced")
    fleet = await _fleet_with_stock(hass, 10)
    compute_overview(hass)
    _level(hass, "96", low=False)
    compute_overview(hass)
    await hass.async_block_till_done()
    assert len(calls) == 1 and _stock(fleet) == 8

    _level(hass, "4", low=True)
    assert compute_overview(hass).low_count == 1  # a new episode
    _level(hass, "96", low=False)
    assert compute_overview(hass).low_count == 0
    await hass.async_block_till_done()
    assert len(calls) == 2
    assert _stock(fleet) == 8  # not consumed twice on the same day


async def test_setting_off_records_nothing(hass: HomeAssistant) -> None:
    global_entry = _global_entry(hass, auto=False)
    await setup_integration(hass, global_entry)
    _noted_device(hass, level="4", low=True)
    calls = async_mock_service(hass, "battery_notes", "set_battery_replaced")
    fleet = await _fleet_with_stock(hass, 10)
    compute_overview(hass)
    _level(hass, "96", low=False)
    assert compute_overview(hass).low_count == 0  # the latch still releases
    await hass.async_block_till_done()
    assert not calls and _stock(fleet) == 10


async def test_release_by_recorded_date_is_not_recorded_again(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The user (or the Replaced action) recorded the swap: Battery Notes now
    carries a newer date and the level is still low-ish. That release is by
    the DATE — recording it again would be a second consumption."""
    await setup_integration(hass, global_entry)
    _noted_device(hass, level="4", low=True, last="2025-01-10T09:00:00+00:00")
    calls = async_mock_service(hass, "battery_notes", "set_battery_replaced")
    fleet = await _fleet_with_stock(hass, 10)
    compute_overview(hass)
    _level(hass, "8", low=False, last="2026-09-14T09:00:00+00:00")
    assert compute_overview(hass).low_count == 0
    await hass.async_block_till_done()
    assert not calls and _stock(fleet) == 10
    # Even when the date AND the level say recovered, the date wins (recorded).
    _level(hass, "4", low=True, last="2026-09-14T09:00:00+00:00")
    compute_overview(hass)
    _level(hass, "96", low=False, last="2026-09-15T09:00:00+00:00")
    assert compute_overview(hass).low_count == 0
    await hass.async_block_till_done()
    assert not calls and _stock(fleet) == 10


async def test_native_row_is_skipped(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A native battery (no Battery Notes note) has nothing to record on."""
    await setup_integration(hass, global_entry)
    calls = async_mock_service(hass, "battery_notes", "set_battery_replaced")
    hass.states.async_set("sensor.cam_battery", "4", {"device_class": "battery", "friendly_name": "Cam battery"})
    await _fleet_with_stock(hass, 10)
    assert compute_overview(hass).low_count == 1
    hass.states.async_set("sensor.cam_battery", "96", {"device_class": "battery", "friendly_name": "Cam battery"})
    assert compute_overview(hass).low_count == 0
    await hass.async_block_till_done()
    assert not calls


async def test_rechargeable_recovery_is_a_charge_not_a_swap(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    _noted_device(hass, level="4", low=True, btype="Rechargeable")
    calls = async_mock_service(hass, "battery_notes", "set_battery_replaced")
    await _fleet_with_stock(hass, 10)
    compute_overview(hass)
    _level(hass, "96", low=False, btype="Rechargeable")
    assert compute_overview(hass).low_count == 0
    await hass.async_block_till_done()
    assert not calls


async def test_battery_notes_gone_is_a_debug_skip(hass: HomeAssistant, global_entry: MockConfigEntry, caplog: pytest.LogCaptureFixture) -> None:
    """No set_battery_replaced service (Battery Notes unloaded): the hook
    logs and moves on — never an error out of a sensor update."""
    await setup_integration(hass, global_entry)
    _noted_device(hass, level="4", low=True)
    fleet = await _fleet_with_stock(hass, 10)
    compute_overview(hass)
    _level(hass, "96", low=False)
    assert compute_overview(hass).low_count == 0
    await hass.async_block_till_done()
    assert _stock(fleet) == 10
    assert "skipped" in caplog.text


async def test_in_flight_guard_schedules_once(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    _noted_device(hass, level="96", low=False)
    calls = async_mock_service(hass, "battery_notes", "set_battery_replaced")
    await _fleet_with_stock(hass, 10)
    bat = Battery(PLUS, "Lock", "AA", 2, False, 96.0, None)
    native = Battery("sensor.cam_battery", "Cam", "Unknown", 1, False, 96.0, None, source="native")
    assert _schedule_auto_record(hass, [bat, bat, native]) == 1
    assert _schedule_auto_record(hass, [bat]) == 0  # still in flight
    await hass.async_block_till_done()
    assert len(calls) == 1
    # The in-flight mark is released once the record ran.
    assert _schedule_auto_record(hass, [bat]) == 1
    await hass.async_block_till_done()


async def test_setting_default_echo_and_sanitiser(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.settings_registry import setting_default
    from custom_components.maintenance_supporter.websocket.dashboard import _build_full_settings, sanitize_settings_input

    assert setting_default(CONF_BATTERY_AUTO_RECORD_RECOVERY) is False
    assert _build_full_settings({})["general"]["battery_auto_record_recovery"] is False
    assert _build_full_settings({CONF_BATTERY_AUTO_RECORD_RECOVERY: True})["general"]["battery_auto_record_recovery"] is True
    assert sanitize_settings_input({CONF_BATTERY_AUTO_RECORD_RECOVERY: True})[0] == {CONF_BATTERY_AUTO_RECORD_RECOVERY: True}
    assert sanitize_settings_input({CONF_BATTERY_AUTO_RECORD_RECOVERY: "yes"})[0] == {}
    # The runtime reader: unset → off, option → on.
    entry = make_global_entry(hass, minor_version=6, options={})
    assert get_battery_auto_record_recovery(hass) is False
    hass.config_entries.async_update_entry(entry, options={CONF_BATTERY_AUTO_RECORD_RECOVERY: True})
    assert get_battery_auto_record_recovery(hass) is True
