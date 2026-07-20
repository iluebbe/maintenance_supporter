"""Battery Fleet setup: one object, type-parts, ONE task (helpers +
websocket/battery_fleet.py)."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_PARTS, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

from .conftest import call_ws_handler, make_ws_connection, setup_integration


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    from .conftest import build_global_entry_data

    entry = MockConfigEntry(domain=DOMAIN, data=build_global_entry_data(), unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    return entry


def _battery(hass: HomeAssistant, name: str, btype: str, qty: int, low: bool, last: str | None = None) -> None:
    hass.states.async_set(
        f"sensor.{name}_battery_plus",
        "8" if low else "80",
        {
            "device_class": "battery",
            "battery_type": btype,
            "battery_quantity": qty,
            "battery_low": low,
            "device_name": name,
            **({"battery_last_replaced": last} if last else {}),
        },
    )


def _fleet_entry(hass: HomeAssistant):
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import find_fleet_entry

    return find_fleet_entry(hass)


async def test_setup_creates_one_object_type_parts_and_single_task(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    _battery(hass, "motion", "CR2450", 1, low=True)
    _battery(hass, "sensor", "AA", 1, low=False)  # non-low AA still yields an AA part

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    result = conn.send_result.call_args[0][1]
    assert result["created"] is True
    assert set(result["types"]) == {"AA", "CR2450"}

    entry = _fleet_entry(hass)
    assert entry is not None
    # exactly ONE task, flagged, threshold-triggered on the low-count sensor.
    tasks = entry.data[CONF_TASKS]
    assert len(tasks) == 1
    (task,) = tasks.values()
    assert task["name"] == "Replace low batteries"
    assert task["battery_fleet_task"] is True
    tc = task["trigger_config"]
    assert tc["type"] == "threshold" and tc["trigger_above"] == 0
    assert tc["entity_ids"] == ["sensor.maintenance_supporter_batteries_to_replace"]
    # one part per battery type present.
    parts = entry.data[CONF_PARTS]
    assert {p["name"] for p in parts.values()} == {"AA battery", "CR2450 battery"}
    assert "batt_aa" in parts and "batt_cr2450" in parts


async def test_setup_is_idempotent_and_reconciles_new_types(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 2, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    first = conn.send_result.call_args[0][1]
    assert first["created"] is True

    # A new battery type appears; second setup reconciles (no second fleet).
    _battery(hass, "smoke", "9V", 1, low=False, last="2020-01-01T00:00:00+00:00")
    conn2 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn2, {"id": 2, "type": "x"})
    second = conn2.send_result.call_args[0][1]
    assert second["created"] is False
    assert second["parts_added"] == 1  # the 9V part

    # still exactly one fleet object, one task.
    fleets = [e for e in hass.config_entries.async_entries(DOMAIN) if e.data.get(CONF_OBJECT, {}).get("battery_fleet")]
    assert len(fleets) == 1
    assert len(fleets[0].data[CONF_TASKS]) == 1
    assert "batt_9v" in fleets[0].data[CONF_PARTS]


async def test_setup_refuses_without_any_batteries(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert conn.send_error.called
    assert conn.send_error.call_args[0][1] == "not_available"


async def test_setup_works_with_native_batteries_only(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # No Battery Notes at all — just native device_class:battery sensors. The
    # fleet still sets up in degraded mode (one "UNKNOWN" type-part).
    await setup_integration(hass, global_entry)
    hass.states.async_set("sensor.phone_battery", "10", {"device_class": "battery"})
    hass.states.async_set("sensor.remote_battery", "90", {"device_class": "battery"})

    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_overview,
        ws_battery_fleet_setup,
    )

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args
    result = conn.send_result.call_args[0][1]
    assert result["created"] is True and result["types"] == ["UNKNOWN"]
    entry = _fleet_entry(hass)
    assert entry is not None and "batt_unknown" in entry.data[CONF_PARTS]

    # Overview: the 10% native battery is low, the 90% one is not.
    conn2 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn2, {"id": 2, "type": "x"})
    res = conn2.send_result.call_args[0][1]
    assert res["available"] is True and res["has_battery_notes"] is False
    assert res["total"] == 2 and len(res["low"]) == 1
    assert res["low"][0]["entity_id"] == "sensor.phone_battery"


async def test_setup_trigger_carries_both_entity_id_shapes(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # Issue #106: the task-dialog save path gates on the SINGULAR entity_id;
    # a trigger stored with only entity_ids got wiped on an unrelated edit.
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    entry = _fleet_entry(hass)
    (task,) = entry.data[CONF_TASKS].values()
    tc = task["trigger_config"]
    assert tc["entity_id"] == "sensor.maintenance_supporter_batteries_to_replace"
    assert tc["entity_ids"] == ["sensor.maintenance_supporter_batteries_to_replace"]


async def test_reconcile_repairs_wiped_trigger_keeping_user_edits(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    # Full #106 reproduction: the user renames/re-types the fleet task and the
    # (buggy) dialog sends trigger_config=null — then re-running setup repairs
    # the trigger without touching the user's translations.
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)

    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import fleet_task_trigger_ok
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_overview,
        ws_battery_fleet_setup,
    )
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    entry = _fleet_entry(hass)
    (task_id,) = entry.data[CONF_TASKS]

    # The user's edit as the old dialog sent it: rename + type + trigger nulled.
    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn2,
        {
            "id": 2,
            "type": "x",
            "entry_id": entry.entry_id,
            "task_id": task_id,
            "name": "Remplacer batteries faibles",
            "task_type": "replacement",
            "warning_days": 1,
            "trigger_config": None,
        },
    )
    assert not conn2.send_error.called, conn2.send_error.call_args
    entry = _fleet_entry(hass)
    broken = entry.data[CONF_TASKS][task_id]
    assert broken.get("trigger_config") is None
    assert broken["battery_fleet_task"] is True  # the flag survives the edit
    assert fleet_task_trigger_ok(entry) is False

    # Overview surfaces the broken state (drives the panel's Repair button).
    conn3 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn3, {"id": 3, "type": "x"})
    assert conn3.send_result.call_args[0][1]["task_ok"] is False

    # Re-running setup (the Repair button) restores the canonical trigger.
    conn4 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn4, {"id": 4, "type": "x"})
    res = conn4.send_result.call_args[0][1]
    assert res["created"] is False and res["task_repaired"] is True

    entry = _fleet_entry(hass)
    fixed = entry.data[CONF_TASKS][task_id]
    tc = fixed["trigger_config"]
    assert tc["type"] == "threshold" and tc["trigger_above"] == 0
    assert tc["entity_id"] == "sensor.maintenance_supporter_batteries_to_replace"
    # The user's translations/edits are untouched.
    assert fixed["name"] == "Remplacer batteries faibles"
    assert fixed["type"] == "replacement"
    assert fixed["warning_days"] == 1
    assert fleet_task_trigger_ok(entry) is True


async def test_reconcile_recreates_deleted_fleet_task(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_delete_task

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    entry = _fleet_entry(hass)
    (task_id,) = entry.data[CONF_TASKS]

    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_delete_task, hass, conn2, {"id": 2, "type": "x", "entry_id": entry.entry_id, "task_id": task_id}
    )
    entry = _fleet_entry(hass)
    assert entry.data[CONF_TASKS] == {}

    conn3 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn3, {"id": 3, "type": "x"})
    assert conn3.send_result.call_args[0][1]["task_repaired"] is True
    entry = _fleet_entry(hass)
    tasks = entry.data[CONF_TASKS]
    assert len(tasks) == 1
    (task,) = tasks.values()
    assert task["battery_fleet_task"] is True
    assert task["trigger_config"]["entity_id"] == "sensor.maintenance_supporter_batteries_to_replace"


async def test_mark_replaced_presses_buttons_and_consumes_stock(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.parts_runtime import async_change_part_stock
    from custom_components.maintenance_supporter.websocket.battery_fleet import (
        ws_battery_fleet_mark_replaced,
        ws_battery_fleet_setup,
    )

    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    _battery(hass, "motion", "AA", 1, low=True)
    _battery(hass, "sensor", "CR2032", 1, low=False)
    # The Battery Notes 'replaced' buttons (parallel entities).
    for slug in ("lock", "motion"):
        hass.states.async_set(f"button.{slug}_battery_replaced", "unknown")

    # Set up the fleet, then stock the AA/CR2032 spares so consumption shows.
    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    fleet = _fleet_entry(hass)
    await async_change_part_stock(hass, fleet, "batt_aa", absolute=10)

    from pytest_homeassistant_custom_component.common import async_mock_service

    calls = async_mock_service(hass, "button", "press")

    conn2 = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_mark_replaced, hass, conn2, {"id": 2, "type": "x"})
    res = conn2.send_result.call_args[0][1]
    # both low AA devices marked (5 AA total), buttons pressed.
    assert res["marked"] == 2 and res["pressed"] == 2
    assert res["consumed"] == {"batt_aa": 5}
    # AA stock decremented by 5 (10 -> 5).
    rd = fleet.runtime_data
    assert rd.store.get_part_stock("batt_aa") == 5
    # both button presses were issued (to the two replaced buttons).
    pressed_targets = {c.data["entity_id"] for c in calls}
    assert pressed_targets == {"button.lock_battery_replaced", "button.motion_battery_replaced"}


async def test_overview_reports_low_and_grouped_needs(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_entry)
    _battery(hass, "lock", "AA", 4, low=True)
    _battery(hass, "motion", "AA", 1, low=True)
    _battery(hass, "sensor", "CR2032", 1, low=True)

    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_overview

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_overview, hass, conn, {"id": 1, "type": "x"})
    res = conn.send_result.call_args[0][1]
    assert res["available"] is True and res["configured"] is False
    assert res["total"] == 3 and len(res["low"]) == 3
    assert res["needs_now"] == {"AA": 5, "CR2032": 1}
