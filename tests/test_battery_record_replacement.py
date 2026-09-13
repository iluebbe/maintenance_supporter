"""#181: the roster's calendar-sync chip consumes parts.

``battery_fleet/record_replacement`` records the detected swap in Battery
Notes (the ``set_battery_replaced`` service the panel used to call itself)
AND consumes the battery type's cells from the fleet's type-part stock through
the same helper the Replaced action uses. Idempotent per calendar day.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_mock_service

from custom_components.maintenance_supporter.const import CONF_BATTERY_LOW_PERCENT, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.battery_fleet import LOW_LATCH_KEY, compute_overview
from custom_components.maintenance_supporter.helpers.battery_fleet_setup import (
    RECORDED_REPLACEMENTS_KEY,
    async_record_replacement,
    find_fleet_entry,
)
from custom_components.maintenance_supporter.websocket.battery_fleet import (
    ws_battery_fleet_record_replacement,
    ws_battery_fleet_setup,
)

from .conftest import build_global_entry_data, call_ws_handler, make_ws_connection, setup_integration

PLUS = "sensor.lock_battery_plus"


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID, options={CONF_BATTERY_LOW_PERCENT: 5})
    entry.add_to_hass(hass)
    return entry


def _noted_device(hass: HomeAssistant, *, level: str = "80", low: bool = False, last: str | None = None) -> str:
    """A registry device with a Battery Notes battery_plus (AA ×2) on it.
    Returns the device id the service call must name."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    entry = MockConfigEntry(domain="test", data={})
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id, identifiers={("test", "lock")}, name="Lock")
    er.async_get(hass).async_get_or_create("sensor", "battery_notes", "lock_plus", suggested_object_id="lock_battery_plus", device_id=device.id)
    hass.states.async_set(
        PLUS,
        level,
        {
            "device_class": "battery",
            "battery_type": "AA",
            "battery_quantity": 2,
            "battery_low": low,
            "device_name": "Lock",
            **({"battery_last_replaced": last} if last else {}),
        },
    )
    return device.id


async def _fleet_with_stock(hass: HomeAssistant, stock: int = 10):
    from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    fleet = find_fleet_entry(hass)
    assert fleet is not None
    await async_change_part_stock(hass, fleet, "batt_aa", absolute=stock)
    return fleet


async def _record(hass: HomeAssistant, replaced_at: str, entity_id: str = PLUS):
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_record_replacement, hass, conn, {"id": 2, "type": "x", "entity_id": entity_id, "replaced_at": replaced_at})
    return conn


async def test_records_via_battery_notes_and_consumes_once(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    device_id = _noted_device(hass, last="2025-01-10T09:00:00+00:00")
    calls = async_mock_service(hass, "battery_notes", "set_battery_replaced")
    fleet = await _fleet_with_stock(hass, 10)

    conn = await _record(hass, "2026-09-10T10:30:00+00:00")
    assert not conn.send_error.called, conn.send_error.call_args
    res = conn.send_result.call_args[0][1]
    assert res == {"recorded": True, "already_recorded": False, "consumed": {"batt_aa": 2}}
    # The same service call the panel used to make — device + ISO datetime.
    assert len(calls) == 1
    assert calls[0].data["device_id"] == device_id
    assert calls[0].data["datetime_replaced"].startswith("2026-09-10T10:30:00")
    # Stock went down by the note's quantity (2 AA), through the shared helper.
    assert fleet.runtime_data.store.get_part_stock("batt_aa") == 8
    # The idempotency memory is on the fleet task's state.
    from custom_components.maintenance_supporter.helpers.battery_lifetime import fleet_store_and_task

    store, task_id = fleet_store_and_task(hass)
    assert store.get_task_state(task_id)[RECORDED_REPLACEMENTS_KEY] == {PLUS: "2026-09-10"}

    # Same calendar day again (a double click, the panel reloaded before
    # Battery Notes echoed the date): recorded again, consumed NOT again.
    conn = await _record(hass, "2026-09-10T11:00:00+00:00")
    res = conn.send_result.call_args[0][1]
    assert res == {"recorded": True, "already_recorded": True, "consumed": {}}
    assert fleet.runtime_data.store.get_part_stock("batt_aa") == 8
    assert len(calls) == 2

    # A different day is a different swap.
    conn = await _record(hass, "2026-09-12T08:00:00+00:00")
    assert conn.send_result.call_args[0][1]["consumed"] == {"batt_aa": 2}
    assert fleet.runtime_data.store.get_part_stock("batt_aa") == 6


async def test_date_already_on_the_note_is_not_consumed_again(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Battery Notes already carries that date (the Replaced action wrote it
    and consumed): the chip must not double-charge the stock."""
    await setup_integration(hass, global_entry)
    _noted_device(hass, last="2026-09-10T09:00:00+00:00")
    async_mock_service(hass, "battery_notes", "set_battery_replaced")
    fleet = await _fleet_with_stock(hass, 10)
    conn = await _record(hass, "2026-09-10T18:00:00+00:00")
    assert conn.send_result.call_args[0][1] == {"recorded": True, "already_recorded": True, "consumed": {}}
    assert fleet.runtime_data.store.get_part_stock("batt_aa") == 10


async def test_record_releases_the_low_latch(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    _noted_device(hass, level="4", low=True)
    async_mock_service(hass, "battery_notes", "set_battery_replaced")
    await _fleet_with_stock(hass)
    hass.states.async_set(PLUS, "8", {**hass.states.get(PLUS).attributes, "battery_low": False})
    assert compute_overview(hass).low_count == 1  # latched (#180)
    await _record(hass, "2026-09-12T08:00:00+00:00")
    from custom_components.maintenance_supporter.helpers.battery_lifetime import fleet_store_and_task

    store, task_id = fleet_store_and_task(hass)
    assert PLUS not in (store.get_task_state(task_id).get(LOW_LATCH_KEY) or {})
    assert compute_overview(hass).low_count == 0


async def test_error_codes(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    _noted_device(hass)
    await _fleet_with_stock(hass)
    # Battery Notes not loaded → not_available (nothing consumed).
    conn = await _record(hass, "2026-09-10T10:30:00+00:00")
    assert conn.send_error.call_args[0][1] == "not_available"
    async_mock_service(hass, "battery_notes", "set_battery_replaced")
    conn = await _record(hass, "2026-09-10T10:30:00+00:00", entity_id="sensor.nope_battery_plus")
    assert conn.send_error.call_args[0][1] == "not_found"
    conn = await _record(hass, "yesterday-ish")
    assert conn.send_error.call_args[0][1] == "invalid_date"
    # A state-only note (no registry entry → no device) cannot be recorded.
    hass.states.async_set("sensor.orphan_battery_plus", "70", {"device_class": "battery", "battery_type": "AA", "battery_quantity": 1, "device_name": "Orphan"})
    conn = await _record(hass, "2026-09-10T10:30:00+00:00", entity_id="sensor.orphan_battery_plus")
    assert conn.send_error.call_args[0][1] == "invalid_device"
    with pytest.raises(Exception, match="invalid_date"):
        await async_record_replacement(hass, PLUS, "")


async def test_record_replacement_is_write_tier(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    await setup_integration(hass, global_entry)
    conn = make_ws_connection()
    conn.user = type("U", (), {"is_admin": False, "id": "plain-user"})()
    with pytest.raises(Unauthorized):
        ws_battery_fleet_record_replacement(hass, conn, {"id": 1, "type": f"{DOMAIN}/battery_fleet/record_replacement", "entity_id": PLUS, "replaced_at": "2026-09-10T10:30:00+00:00"})
