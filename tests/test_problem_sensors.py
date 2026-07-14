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


def test_match_part_for_sensor_heuristics() -> None:
    """Token-overlap matching: toner-low ↔ 'Toner cartridge'; generic words
    (problem/low/sensor) never establish a match; best overlap wins."""
    from custom_components.maintenance_supporter.helpers.problem_sensors import match_part_for_sensor

    parts = {
        "p1": {"name": "Toner cartridge"},
        "p2": {"name": "Drum unit"},
        "p3": {"name": "Toner cartridge black"},
    }
    # "Toner low" shares the meaningful token "toner" → a toner part (p1 or p3).
    m = match_part_for_sensor("Printer toner low", parts)
    assert m is not None and m[0] in ("p1", "p3")
    # More overlapping tokens win: "black toner cartridge" → p3 (3 tokens).
    m = match_part_for_sensor("Black toner cartridge empty", parts)
    assert m == ("p3", "Toner cartridge black")
    # Purely generic sensor names must NOT match anything.
    assert match_part_for_sensor("Printer problem", {"p1": {"name": "Problem fixer"}}) is None
    assert match_part_for_sensor("Sensor low", parts) is None
    assert match_part_for_sensor("Toner low", {}) is None


async def test_discovery_suggests_matching_part_on_existing_object(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A problem sensor whose suggested (device-linked) object owns a part with
    a matching name carries suggested_part_id/name in the discovery payload."""
    from homeassistant.helpers import device_registry as dr
    from homeassistant.helpers import entity_registry as er

    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_discover_problem_sensors

    from .conftest import build_object_data, build_object_entry_data

    foreign = MockConfigEntry(domain="demo", title="Demo")
    foreign.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=foreign.entry_id, identifiers={("demo", "printer-1")}, name="Laser Printer",
    )
    data = build_object_entry_data(
        object_data={**build_object_data(name="Printer"), "ha_device_id": device.id}
    )
    data["parts"] = {"part_toner": {"id": "part_toner", "name": "Toner cartridge"}}
    obj = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Printer", data=data,
        source="user", unique_id="ms_ps_part",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)

    entry = er.async_get(hass).async_get_or_create(
        "binary_sensor", "demo", "toner-low-1", device_id=device.id, original_device_class="problem",
    )
    hass.states.async_set(entry.entity_id, "on", {"device_class": "problem", "friendly_name": "Toner low"})
    await hass.async_block_till_done()

    conn = make_ws_connection()
    await call_ws_handler(
        ws_discover_problem_sensors, hass, conn, {"id": 1, "type": "maintenance_supporter/problem_sensors/discover"}
    )
    cand = next(s for s in conn.send_result.call_args[0][1]["sensors"] if s["entity_id"] == entry.entity_id)
    assert cand["suggested_entry_id"] == obj.entry_id
    assert cand["suggested_part_id"] == "part_toner"
    assert cand["suggested_part_name"] == "Toner cartridge"


async def test_adopt_links_suggested_part_as_consumes_parts(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A selection carrying part_id creates the task with consumes_parts
    [{part_id, quantity: 1}]; an unknown part_id is silently dropped."""
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_adopt_problem_sensors

    from .conftest import OBJECT_ID_1, build_object_data, build_object_entry_data

    data = build_object_entry_data(object_data=build_object_data(name="Printer", object_id=OBJECT_ID_1))
    data["parts"] = {"part_toner": {"id": "part_toner", "name": "Toner cartridge"}}
    obj = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Printer", data=data,
        source="user", unique_id="ms_ps_adopt_part",
    )
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    _problem_sensor(hass, "binary_sensor.toner_low", "Toner low", "on")
    _problem_sensor(hass, "binary_sensor.drum_warn", "Drum warning", "on")

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_problem_sensors,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/problem_sensors/adopt",
            "selections": [
                {"entity_id": "binary_sensor.toner_low", "name": "Toner low", "entry_id": obj.entry_id, "part_id": "part_toner"},
                {"entity_id": "binary_sensor.drum_warn", "name": "Drum warning", "entry_id": obj.entry_id, "part_id": "not_a_part"},
            ],
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    assert conn.send_result.call_args[0][1]["tasks_created"] == 2

    fresh = hass.config_entries.async_get_entry(obj.entry_id)
    tasks = {t["name"]: t for t in fresh.data[CONF_TASKS].values()}
    assert tasks["Toner low"]["consumes_parts"] == [{"part_id": "part_toner", "quantity": 1}]
    assert "consumes_parts" not in tasks["Drum warning"]  # unknown id dropped


async def test_adopt_rolls_back_new_object_when_task_persist_fails(
    hass: HomeAssistant, global_entry: MockConfigEntry, monkeypatch: pytest.MonkeyPatch
) -> None:
    """If the task persist fails after a fresh object was created, that object is
    removed (no task-less orphan) and objects_created is not over-counted."""
    import custom_components.maintenance_supporter.websocket.tasks_persist as tp
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_adopt_problem_sensors

    await setup_integration(hass, global_entry)
    _problem_sensor(hass, "binary_sensor.doomed_problem", "Doomed", "on")

    async def _boom(*_a: object, **_k: object) -> None:
        raise ValueError("persist boom")

    monkeypatch.setattr(tp, "async_persist_task", _boom)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_problem_sensors,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/problem_sensors/adopt",
            "selections": [{"entity_id": "binary_sensor.doomed_problem", "name": "Doomed", "object_name": "Doomed Obj"}],
        },
    )
    await hass.async_block_till_done()
    res = conn.send_result.call_args[0][1]
    assert res["tasks_created"] == 0
    assert res["objects_created"] == 0, "the created object must be rolled back, not counted"
    assert res["errors"] and res["errors"][0]["entity_id"] == "binary_sensor.doomed_problem"
    # Only the global entry remains — no orphan object left behind.
    non_global = [e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID]
    assert non_global == [], f"orphan object entries left: {[e.title for e in non_global]}"


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


# ── note persistence across un-adopt → re-adopt (v2.26, roadmap) ─────────────


async def _adopt(hass: HomeAssistant, entity_id: str, name: str, object_name: str) -> None:
    from custom_components.maintenance_supporter.websocket.problem_sensors import ws_adopt_problem_sensors

    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_problem_sensors,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/problem_sensors/adopt",
            "selections": [{"entity_id": entity_id, "name": name, "object_name": object_name}],
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args


def _adopted_object_and_task(hass: HomeAssistant, object_name: str) -> tuple:
    obj = next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and e.data.get(CONF_OBJECT, {}).get("name") == object_name
    )
    (task,) = obj.data[CONF_TASKS].values()
    return obj, task


async def test_notes_survive_unadopt_readopt_cycle(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Adopt → write notes → delete the task (un-adopt) → re-adopt: the notes
    come back on the fresh task, and the stash entry is consumed."""
    from custom_components.maintenance_supporter.const import CONF_ADOPTED_NOTES
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_delete_task

    await setup_integration(hass, global_entry)
    _problem_sensor(hass, "binary_sensor.softener_salt_low", "Softener salt low", "on")
    await _adopt(hass, "binary_sensor.softener_salt_low", "Softener salt low", "Water softener")

    obj, task = _adopted_object_and_task(hass, "Water softener")
    # Accumulate notes on the adopted task (as task/update would persist them).
    new_data = dict(obj.data)
    new_tasks = dict(new_data[CONF_TASKS])
    new_tasks[task["id"]] = {**task, "notes": "Use broad-salt only; bypass valve sticks."}
    new_data[CONF_TASKS] = new_tasks
    hass.config_entries.async_update_entry(obj, data=new_data)

    # Un-adopt = delete the task.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_delete_task,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/task/delete", "entry_id": obj.entry_id, "task_id": task["id"]},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()

    # The notes are stashed on the global entry, keyed by the sensor.
    stash = (global_entry.options or global_entry.data).get(CONF_ADOPTED_NOTES, {})
    assert stash == {"binary_sensor.softener_salt_low": "Use broad-salt only; bypass valve sticks."}

    # Re-adopt (sensor is discoverable again) → notes restored on the new task.
    await _adopt(hass, "binary_sensor.softener_salt_low", "Softener salt low", "Water softener 2")
    _, task2 = _adopted_object_and_task(hass, "Water softener 2")
    assert task2["notes"] == "Use broad-salt only; bypass valve sticks."
    assert task2["id"] != task["id"]

    # Consumed: a third adopt would start clean.
    stash_after = (global_entry.options or global_entry.data).get(CONF_ADOPTED_NOTES, {})
    assert stash_after == {}


async def test_stash_ignores_non_adopted_tasks_and_empty_notes(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.const import CONF_ADOPTED_NOTES
    from custom_components.maintenance_supporter.helpers.problem_sensors import (
        stash_task_notes_for_readopt,
    )

    await setup_integration(hass, global_entry)
    # A plain time-based task with notes: not adopted → never stashed.
    stash_task_notes_for_readopt(hass, {"notes": "hello", "trigger_config": None})
    stash_task_notes_for_readopt(
        hass,
        {"notes": "hello", "trigger_config": {"type": "threshold", "entity_ids": ["sensor.x"]}},
    )
    # Adopted signature but empty/whitespace notes → nothing to preserve.
    stash_task_notes_for_readopt(
        hass,
        {
            "notes": "   ",
            "trigger_config": {"auto_complete_on_recovery": True, "entity_ids": ["binary_sensor.p"]},
        },
    )
    assert (global_entry.options or global_entry.data).get(CONF_ADOPTED_NOTES) in (None, {})


async def test_stash_is_fifo_capped(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.const import CONF_ADOPTED_NOTES, MAX_ADOPTED_NOTES
    from custom_components.maintenance_supporter.helpers.problem_sensors import (
        stash_task_notes_for_readopt,
    )

    await setup_integration(hass, global_entry)
    for i in range(MAX_ADOPTED_NOTES + 5):
        stash_task_notes_for_readopt(
            hass,
            {
                "notes": f"note {i}",
                "trigger_config": {
                    "auto_complete_on_recovery": True,
                    "entity_ids": [f"binary_sensor.p{i}"],
                },
            },
        )
    stash = (global_entry.options or global_entry.data)[CONF_ADOPTED_NOTES]
    assert len(stash) == MAX_ADOPTED_NOTES
    # Oldest evicted, newest kept.
    assert "binary_sensor.p0" not in stash
    assert stash[f"binary_sensor.p{MAX_ADOPTED_NOTES + 4}"] == f"note {MAX_ADOPTED_NOTES + 4}"
