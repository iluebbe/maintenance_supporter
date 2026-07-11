"""Adopt HA problem sensors as sensor-triggered tasks (roadmap feature).

Discovery proposes `device_class: problem` binary sensors not already watched
by a task; adoption turns a selection into tasks that trigger while the problem
is on and auto-complete on recovery — reusing the existing trigger pipeline.
"""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

from .conftest import (
    build_global_entry_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _problem_sensor(hass: HomeAssistant, entity_id: str, name: str, state: str = "off") -> None:
    hass.states.async_set(entity_id, state, {"device_class": "problem", "friendly_name": name})


async def test_discover_lists_problem_sensors(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_discover_problem_sensors

    await setup_integration(hass, global_entry)
    _problem_sensor(hass, "binary_sensor.printer_problem", "Printer problem", "on")
    # A non-problem binary sensor must not show up.
    hass.states.async_set("binary_sensor.door", "off", {"device_class": "door"})

    conn = make_ws_connection()
    await call_ws_handler(
        ws_discover_problem_sensors, hass, conn, {"id": 1, "type": "maintenance_supporter/problem_sensors/discover"}
    )
    sensors = conn.send_result.call_args[0][1]["sensors"]
    ids = {s["entity_id"] for s in sensors}
    assert "binary_sensor.printer_problem" in ids
    assert "binary_sensor.door" not in ids
    printer = next(s for s in sensors if s["entity_id"] == "binary_sensor.printer_problem")
    assert printer["state"] == "on"


async def test_discovery_excludes_our_own_overdue_sensors(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The integration's own per-task `_overdue` binary sensors carry
    device_class: problem too — discovery must never propose adopting them
    (that would be circular). Regression from a live test."""
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_discover_problem_sensors

    from .conftest import (
        TASK_ID_1,
        build_object_data,
        build_object_entry_data,
        build_task_data,
    )

    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Rig",
        data=build_object_entry_data(
            object_data=build_object_data(name="Rig"),
            tasks={TASK_ID_1: build_task_data(name="Inspect")},
        ),
        source="user",
        unique_id="maintenance_supporter_rig",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    await hass.async_block_till_done()

    conn = make_ws_connection()
    await call_ws_handler(
        ws_discover_problem_sensors, hass, conn, {"id": 1, "type": "maintenance_supporter/problem_sensors/discover"}
    )
    ids = [s["entity_id"] for s in conn.send_result.call_args[0][1]["sensors"]]
    assert not any("maintenance_supporter" in eid or eid.endswith("_overdue") for eid in ids), (
        f"discovery leaked our own binary sensors: {ids}"
    )


async def test_adopt_creates_a_triggered_task_and_hides_from_discovery(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.problem_sensors import (
        ws_adopt_problem_sensors,
        ws_discover_problem_sensors,
    )

    await setup_integration(hass, global_entry)
    _problem_sensor(hass, "binary_sensor.hvac_filter_problem", "HVAC filter problem", "on")

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_problem_sensors,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/problem_sensors/adopt",
            "selections": [
                {
                    "entity_id": "binary_sensor.hvac_filter_problem",
                    "name": "HVAC filter problem",
                    "object_name": "HVAC System",
                }
            ],
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 1 and res["objects_created"] == 1

    # The adopted task carries the state_change trigger + auto-complete-on-recovery.
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == "HVAC System"
    )
    (task,) = obj.data[CONF_TASKS].values()
    tc = task["trigger_config"]
    assert tc["type"] == "state_change"
    assert tc["entity_ids"] == ["binary_sensor.hvac_filter_problem"]
    assert tc["trigger_to_state"] == "on"
    assert tc["auto_complete_on_recovery"] is True

    # Discovery no longer offers it (already watched by a task).
    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_discover_problem_sensors, hass, conn2, {"id": 2, "type": "maintenance_supporter/problem_sensors/discover"}
    )
    ids = {s["entity_id"] for s in conn2.send_result.call_args[0][1]["sensors"]}
    assert "binary_sensor.hvac_filter_problem" not in ids


async def test_adopt_two_sensors_same_device_reuse_one_object(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Two problem sensors on the same device create a single object, not two."""
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_adopt_problem_sensors

    await setup_integration(hass, global_entry)
    _problem_sensor(hass, "binary_sensor.printer_paper", "Printer paper jam", "on")
    _problem_sensor(hass, "binary_sensor.printer_toner", "Printer toner low", "on")

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_problem_sensors,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/problem_sensors/adopt",
            "selections": [
                {"entity_id": "binary_sensor.printer_paper", "name": "Paper jam", "object_name": "Printer", "device_id": "dev_printer"},
                {"entity_id": "binary_sensor.printer_toner", "name": "Toner low", "object_name": "Printer", "device_id": "dev_printer"},
            ],
        },
    )
    res = conn.send_result.call_args[0][1]
    assert res["objects_created"] == 1, "same device must reuse one object"
    assert res["tasks_created"] == 2


async def test_adopt_reports_error_when_target_entry_missing(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A selection pointing at a non-existent entry is reported, not fatal."""
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_adopt_problem_sensors

    await setup_integration(hass, global_entry)
    _problem_sensor(hass, "binary_sensor.ghost_problem", "Ghost problem", "on")

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_problem_sensors,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/problem_sensors/adopt",
            "selections": [
                {"entity_id": "binary_sensor.ghost_problem", "name": "Ghost", "entry_id": "does_not_exist"},
            ],
        },
    )
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 0
    assert res["errors"] == [{"entity_id": "binary_sensor.ghost_problem", "reason": "target object not found"}]


async def test_adopt_catches_bad_selection(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A malformed selection (no name) is caught per-item and reported, so a
    good sibling selection still succeeds."""
    from custom_components.maintenance_supporter.const import CONF_OBJECT
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_adopt_problem_sensors

    from .conftest import OBJECT_ID_1, build_object_data, build_object_entry_data

    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Existing",
        data=build_object_entry_data(object_data=build_object_data(name="Existing", object_id=OBJECT_ID_1)),
        source="user",
        unique_id="ms_ps_existing",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    _problem_sensor(hass, "binary_sensor.bad_problem", "Bad", "on")

    conn = make_ws_connection()
    # Bypasses the WS schema (call_ws_handler unwraps it), so the missing "name"
    # reaches build_problem_task and raises KeyError — which the handler catches.
    await call_ws_handler(
        ws_adopt_problem_sensors,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/problem_sensors/adopt",
            "selections": [{"entity_id": "binary_sensor.bad_problem", "entry_id": obj.entry_id}],
        },
    )
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 0
    assert res["errors"] and res["errors"][0]["entity_id"] == "binary_sensor.bad_problem"
    # The pre-existing object is untouched.
    assert obj.entry_id in {e.entry_id for e in hass.config_entries.async_entries(DOMAIN)}
    _ = CONF_OBJECT  # keep the import meaningful if the assertion above changes


async def test_discovery_resolves_device_area_and_suggests_existing_object(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A problem sensor bound to a device in an area surfaces device/area names,
    and an object already attached to that device is the suggested target."""
    from homeassistant.helpers import area_registry as ar
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    from .conftest import build_object_data, build_object_entry_data
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_discover_problem_sensors

    # A device (owned by a foreign integration) placed in an area.
    area = ar.async_get(hass).async_get_or_create("Basement")
    foreign = MockConfigEntry(domain="demo", title="Demo")
    foreign.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=foreign.entry_id,
        identifiers={("demo", "sump-1")},
        name="Sump Pump",
    )
    dr.async_get(hass).async_update_device(device.id, area_id=area.id)

    # A maintenance object already attached to that device -> suggested target.
    obj = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Sump",
        data=build_object_entry_data(
            object_data={**build_object_data(name="Sump"), "ha_device_id": device.id}
        ),
        source="user",
        unique_id="ms_ps_dev",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)

    # A problem binary sensor registered to the device.
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get_or_create(
        "binary_sensor",
        "demo",
        "sump-overflow-1",
        device_id=device.id,
        original_device_class="problem",
    )
    hass.states.async_set(entry.entity_id, "on", {"device_class": "problem", "friendly_name": "Sump overflow"})
    await hass.async_block_till_done()

    conn = make_ws_connection()
    await call_ws_handler(
        ws_discover_problem_sensors, hass, conn, {"id": 1, "type": "maintenance_supporter/problem_sensors/discover"}
    )
    sensors = conn.send_result.call_args[0][1]["sensors"]
    cand = next(s for s in sensors if s["entity_id"] == entry.entity_id)
    assert cand["device_name"] == "Sump Pump"
    assert cand["area_name"] == "Basement"
    assert cand["suggested_entry_id"] == obj.entry_id
    assert cand["suggested_object_name"] == "Sump"
