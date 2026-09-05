"""Tests for reading slots — several named values per completion (#161 phase 2).

A `reading` task may declare slots (``readings: [{id, name, unit}]``); each
completion then records a snapshot ``reading_values: [{id, name, unit,
value}]`` instead of the scalar ``reading_value``. Covers:
- the helper (sanitizing slots, the textarea form with id reuse, resolving
  a completion's values by id / by name, entity attributes),
- the model round-trip and the completion write,
- WS task/create + task/update (both write paths sanitize), task/complete
  (unknown slot refused, skipped meter omitted), the task response,
- the history edit (scalar patch, slot map replaces, deleted slot stays
  editable), the `complete` service by NAME, the completion event,
- JSON export/import and CSV round-trips, the sensor attributes.
"""

from __future__ import annotations

import json

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    EVENT_TASK_COMPLETED,
    GLOBAL_UNIQUE_ID,
    SERVICE_COMPLETE,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.helpers.reading_slots import (
    MAX_READING_SLOTS,
    history_reading_values,
    last_reading_attributes,
    parse_reading_slots_text,
    reading_slots_text,
    resolve_reading_values,
    resolve_reading_values_by_name,
    sanitize_reading_slots,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)
from custom_components.maintenance_supporter.websocket.objects import ws_get_object
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
)
from custom_components.maintenance_supporter.websocket.tasks_crud import (
    ws_create_task,
    ws_update_task,
)
from custom_components.maintenance_supporter.websocket.tasks_history import (
    ws_update_history_entry,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    make_ws_connection as _conn,
    setup_integration,
)

SLOTS = [
    {"id": "cold", "name": "Water cold", "unit": "m³"},
    {"id": "warm", "name": "Water warm", "unit": "m³"},
    {"id": "power", "name": "Electricity", "unit": "kWh"},
]


# ─── helper ──────────────────────────────────────────────────────────────


def test_sanitize_slots_mints_ids_dedupes_and_caps() -> None:
    slots = sanitize_reading_slots(
        [
            {"name": "  Gas ", "unit": " m³ "},
            {"id": "cold", "name": "Water cold"},
            {"id": "cold", "name": "duplicate id"},
            {"id": "Not Valid!", "name": "Bad id"},
            {"name": ""},
            "not a mapping",
            {"unit": "kWh"},
        ]
    )
    assert [s["name"] for s in slots] == ["Gas", "Water cold", "Bad id"]
    assert slots[0]["unit"] == "m³" and len(slots[0]["id"]) == 8
    assert slots[1] == {"id": "cold", "name": "Water cold", "unit": None}
    assert slots[2]["id"] != "Not Valid!"
    assert len(sanitize_reading_slots([{"name": f"m{i}"} for i in range(40)])) == MAX_READING_SLOTS
    assert sanitize_reading_slots("nope") == [] and sanitize_reading_slots(None) == []


def test_textarea_form_round_trips_and_keeps_ids_by_name() -> None:
    text = reading_slots_text(SLOTS)
    assert text == "Water cold | m³\nWater warm | m³\nElectricity | kWh"
    edited = parse_reading_slots_text("water COLD | l\n\nGas\nElectricity|kWh", existing=SLOTS)
    assert [(s["id"], s["name"], s["unit"]) for s in edited][:1] == [("cold", "water COLD", "l")]
    assert edited[1]["name"] == "Gas" and edited[1]["id"] not in {"cold", "warm", "power"}
    assert edited[2]["id"] == "power"


def test_resolve_values_orders_skips_none_and_refuses_unknown() -> None:
    snap = resolve_reading_values(SLOTS, {"power": 4200.5, "cold": 12, "warm": None})
    assert snap == [
        {"id": "cold", "name": "Water cold", "unit": "m³", "value": 12.0},
        {"id": "power", "name": "Electricity", "unit": "kWh", "value": 4200.5},
    ]
    with pytest.raises(ValueError, match="unknown reading slot: gone"):
        resolve_reading_values(SLOTS, {"gone": 1})
    # An edited entry may name a slot deleted since: `keep` supplies its snapshot.
    kept = resolve_reading_values(SLOTS[:1], {"cold": 1, "old": 2}, keep=[{"id": "old", "name": "Old meter", "unit": None, "value": 9}])
    assert [s["name"] for s in kept] == ["Water cold", "Old meter"]
    assert resolve_reading_values(SLOTS, {}) == [] and resolve_reading_values(SLOTS, None) == []
    # Non-finite / out-of-range values are dropped, not stored.
    assert resolve_reading_values(SLOTS, {"cold": float("nan"), "warm": 1e13}) == []


def test_resolve_by_name_is_case_insensitive_and_accepts_ids() -> None:
    snap = resolve_reading_values_by_name(SLOTS, {"water COLD": 1, "power": 2})
    assert [(s["id"], s["value"]) for s in snap] == [("cold", 1.0), ("power", 2.0)]
    with pytest.raises(ValueError, match="unknown reading: Gas"):
        resolve_reading_values_by_name(SLOTS, {"Gas": 3})


def test_history_reading_values_validates_shape() -> None:
    entry = {
        "reading_values": [
            {"id": "a", "name": "A", "unit": "x", "value": 1},
            {"id": "a", "name": "dupe", "value": 2},
            {"id": "b", "name": "B", "value": "not a number"},
            {"id": "c", "name": "C", "value": 3.5},
            "junk",
        ]
    }
    assert history_reading_values(entry) == [
        {"id": "a", "name": "A", "unit": "x", "value": 1.0},
        {"id": "c", "name": "C", "unit": None, "value": 3.5},
    ]
    assert history_reading_values({"reading_values": "no"}) == [] and history_reading_values(None) == []


def test_last_reading_attributes_pick_the_newest_completion() -> None:
    history = [
        {"timestamp": "2026-01-01T10:00:00", "type": "completed", "reading_value": 5},
        {"timestamp": "2026-03-01T10:00:00", "type": "completed", "reading_values": [{"id": "cold", "name": "Water cold", "value": 12}]},
        {"timestamp": "2026-02-01T10:00:00", "type": "completed", "reading_value": 7},
        {"timestamp": "2026-04-01T10:00:00", "type": "skipped", "reading_value": 99},
    ]
    assert last_reading_attributes(history) == {"last_readings": {"Water cold": 12.0}, "last_reading_at": "2026-03-01T10:00:00"}
    assert last_reading_attributes(history[:1]) == {"last_reading": 5.0, "last_reading_at": "2026-01-01T10:00:00"}
    assert last_reading_attributes([]) == {}


# ─── model ───────────────────────────────────────────────────────────────


def test_model_round_trips_slots_and_writes_the_snapshot() -> None:
    task = MaintenanceTask.from_dict({**build_task_data(task_type="reading"), "readings": SLOTS})
    assert task.readings == SLOTS
    assert task.to_dict()["readings"] == SLOTS
    assert "readings" not in MaintenanceTask.from_dict(build_task_data()).to_dict()
    snap = resolve_reading_values(SLOTS, {"cold": 12})
    task.complete(reading_values=snap)
    entry = task.last_entry
    assert entry and entry["reading_values"] == snap and "reading_value" not in entry
    task.complete()
    assert "reading_values" not in task.last_entry


# ─── WS ──────────────────────────────────────────────────────────────────


def _global(hass: HomeAssistant) -> MockConfigEntry:
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


def _object(hass: HomeAssistant, *, readings: list | None = None, history: list | None = None) -> MockConfigEntry:
    task = build_task_data(task_type="reading", last_performed="2024-06-01", history=history)
    if readings is not None:
        task["readings"] = readings
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Meter round",
        data=build_object_entry_data(
            object_data=build_object_data(name="Meter round"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_reading_obj",
    )
    entry.add_to_hass(hass)
    return entry


async def _task_response(hass: HomeAssistant, obj: MockConfigEntry, task_id: str = TASK_ID_1) -> dict:
    conn = _conn()
    await call_ws_handler(ws_get_object, hass, conn, {"id": 9, "type": "maintenance_supporter/object", "entry_id": obj.entry_id})
    return next(t for t in conn.send_result.call_args[0][1]["tasks"] if t["id"] == task_id)


async def _complete(hass: HomeAssistant, obj: MockConfigEntry, **extra: object):
    conn = _conn()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": obj.entry_id, "task_id": TASK_ID_1, **extra},
    )
    return conn


def _completed(hass: HomeAssistant, obj: MockConfigEntry) -> list[dict]:
    history = get_task_store_state(hass, obj.entry_id, TASK_ID_1).get("history", [])
    return [h for h in history if h.get("type") == HistoryEntryType.COMPLETED]


async def test_ws_create_and_update_sanitize_slots(hass: HomeAssistant) -> None:
    obj = _object(hass)
    await setup_integration(hass, _global(hass), obj)
    conn = _conn()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/create",
            "entry_id": obj.entry_id,
            "name": "Meters",
            "task_type": "reading",
            "readings": [{"name": "Gas", "unit": "m³"}, {"name": ""}, {"id": "cold", "name": "Water cold"}],
        },
    )
    task_id = conn.send_result.call_args[0][1]["task_id"]
    created = await _task_response(hass, obj, task_id)
    assert [s["name"] for s in created["readings"]] == ["Gas", "Water cold"]
    assert len(created["readings"][0]["id"]) == 8 and created["readings"][1]["id"] == "cold"

    # update: the raw field-map copy must still sanitize (invalid item dropped,
    # id kept), and an empty list clears the slots.
    conn = _conn()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/task/update",
            "entry_id": obj.entry_id,
            "task_id": task_id,
            "readings": [{"id": "cold", "name": "Water cold", "unit": "l"}, "junk", {"id": "cold", "name": "dupe"}],
        },
    )
    assert (await _task_response(hass, obj, task_id))["readings"] == [{"id": "cold", "name": "Water cold", "unit": "l"}]
    conn = _conn()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {"id": 3, "type": "maintenance_supporter/task/update", "entry_id": obj.entry_id, "task_id": task_id, "readings": []},
    )
    assert (await _task_response(hass, obj, task_id))["readings"] == []
    assert "readings" not in obj.data["tasks"][task_id]


async def test_ws_complete_records_the_snapshot_and_refuses_unknown_slots(hass: HomeAssistant) -> None:
    obj = _object(hass, readings=SLOTS)
    await setup_integration(hass, _global(hass), obj)
    events: list = []
    hass.bus.async_listen(EVENT_TASK_COMPLETED, lambda e: events.append(e.data))

    conn = await _complete(hass, obj, reading_values={"cold": 12.5, "power": 4200, "warm": None})
    assert conn.send_result.called, conn.send_error.call_args
    await hass.async_block_till_done()
    entry = _completed(hass, obj)[-1]
    assert entry["reading_values"] == [
        {"id": "cold", "name": "Water cold", "unit": "m³", "value": 12.5},
        {"id": "power", "name": "Electricity", "unit": "kWh", "value": 4200.0},
    ]
    assert "reading_value" not in entry
    assert events and events[-1]["reading_values"] == entry["reading_values"] and events[-1]["reading_value"] is None

    conn = await _complete(hass, obj, reading_values={"gone": 1})
    assert conn.send_error.called and conn.send_error.call_args[0][1] == "invalid_input"
    assert len(_completed(hass, obj)) == 1

    # The task response exposes the slots (the dialog builds its fields from them).
    assert (await _task_response(hass, obj))["readings"] == SLOTS


async def test_ws_complete_schema_shape() -> None:
    schema = ws_complete_task._ws_schema
    base = {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": "e", "task_id": "t"}
    assert schema({**base, "reading_values": {"cold": "12.5", "warm": None}})["reading_values"] == {"cold": 12.5, "warm": None}
    with pytest.raises(vol.Invalid):
        schema({**base, "reading_values": {"cold": 1e13}})
    with pytest.raises(vol.Invalid):
        schema({**base, "reading_values": ["cold"]})


async def test_history_edit_patches_scalar_and_replaces_the_slot_snapshot(hass: HomeAssistant) -> None:
    ts = "2026-05-01T10:00:00"
    old_snapshot = [
        {"id": "cold", "name": "Water cold", "unit": "m³", "value": 10},
        {"id": "retired", "name": "Old gas meter", "unit": "m³", "value": 3},
    ]
    obj = _object(
        hass,
        readings=SLOTS,
        history=[
            {"timestamp": ts, "type": HistoryEntryType.COMPLETED, "reading_values": old_snapshot},
            {"timestamp": "2026-04-01T10:00:00", "type": HistoryEntryType.COMPLETED, "reading_value": 7},
        ],
    )
    await setup_integration(hass, _global(hass), obj)

    async def edit(original_ts: str, **fields):
        conn = _conn()
        await call_ws_handler(
            ws_update_history_entry,
            hass,
            conn,
            {
                "id": 5,
                "type": "maintenance_supporter/task/history/update",
                "entry_id": obj.entry_id,
                "task_id": TASK_ID_1,
                "original_timestamp": original_ts,
                **fields,
            },
        )
        return conn

    # Slot map replaces: a corrected value, a retired slot kept via its own
    # snapshot, a current slot added, a meter dropped by sending None.
    conn = await edit(ts, reading_values={"cold": 11, "retired": 4, "power": 500})
    assert conn.send_result.called, conn.send_error.call_args
    entry = next(h for h in _completed(hass, obj) if h["timestamp"] == ts)
    assert [(v["id"], v["name"], v["value"]) for v in entry["reading_values"]] == [
        ("cold", "Water cold", 11.0),
        ("power", "Electricity", 500.0),
        ("retired", "Old gas meter", 4.0),
    ]
    conn = await edit(ts, reading_values={"nope": 1})
    assert conn.send_error.call_args[0][1] == "invalid_input"
    conn = await edit(ts, reading_values=None)
    entry = next(h for h in _completed(hass, obj) if h["timestamp"] == ts)
    assert "reading_values" not in entry

    # The scalar is patchable like notes: set, then cleared.
    await edit("2026-04-01T10:00:00", reading_value=8.25)
    assert next(h for h in _completed(hass, obj) if h["timestamp"].startswith("2026-04"))["reading_value"] == 8.25
    await edit("2026-04-01T10:00:00", reading_value=None)
    assert "reading_value" not in next(h for h in _completed(hass, obj) if h["timestamp"].startswith("2026-04"))


# ─── service + sensor ────────────────────────────────────────────────────


def _sensor_id(hass: HomeAssistant, entry: MockConfigEntry) -> str:
    reg = er.async_get(hass)
    return next(e.entity_id for e in er.async_entries_for_config_entry(reg, entry.entry_id) if e.domain == "sensor")


async def test_service_complete_takes_readings_by_name(hass: HomeAssistant) -> None:
    obj = _object(hass, readings=SLOTS)
    await setup_integration(hass, _global(hass), obj)
    entity_id = _sensor_id(hass, obj)

    await hass.services.async_call(
        DOMAIN,
        SERVICE_COMPLETE,
        {"entity_id": entity_id, "reading_values": {"water cold": 12, "Electricity": 4200}},
        blocking=True,
    )
    await hass.async_block_till_done()
    entry = _completed(hass, obj)[-1]
    assert [(v["id"], v["value"]) for v in entry["reading_values"]] == [("cold", 12.0), ("power", 4200.0)]

    # The sensor exposes the newest values by NAME for templates/automations.
    state = hass.states.get(entity_id)
    assert state is not None
    assert state.attributes["last_readings"] == {"Water cold": 12.0, "Electricity": 4200.0}
    assert state.attributes["last_reading_at"] == entry["timestamp"]

    with pytest.raises(ServiceValidationError, match="unknown reading: Gas"):
        await hass.services.async_call(
            DOMAIN, SERVICE_COMPLETE, {"entity_id": entity_id, "reading_values": {"Gas": 1}}, blocking=True
        )
    assert len(_completed(hass, obj)) == 1


async def test_service_readings_do_not_fan_out(hass: HomeAssistant) -> None:
    obj = _object(hass, readings=SLOTS)
    await setup_integration(hass, _global(hass), obj)
    entity_id = _sensor_id(hass, obj)
    with pytest.raises(ServiceValidationError, match="single entity_id"):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_COMPLETE,
            {"entity_id": [entity_id, "sensor.other_task"], "reading_values": {"Water cold": 1}},
            blocking=True,
        )


async def test_scalar_task_exposes_last_reading(hass: HomeAssistant) -> None:
    obj = _object(hass)
    await setup_integration(hass, _global(hass), obj)
    conn = await _complete(hass, obj, reading_value=77.5)
    assert conn.send_result.called
    await hass.async_block_till_done()
    state = hass.states.get(_sensor_id(hass, obj))
    assert state is not None and state.attributes["last_reading"] == 77.5 and "last_readings" not in state.attributes


# ─── export / import / csv ───────────────────────────────────────────────


async def test_json_export_import_keeps_slots_and_snapshots(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.export import build_export_data
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    snapshot = [{"id": "cold", "name": "Water cold", "unit": "m³", "value": 12}]
    obj = _object(
        hass,
        readings=SLOTS,
        history=[
            {"timestamp": "2026-05-01T10:00:00", "type": HistoryEntryType.COMPLETED, "reading_values": snapshot},
            {
                "timestamp": "2026-05-02T10:00:00",
                "type": HistoryEntryType.COMPLETED,
                "reading_values": [{"id": "cold", "name": "Water cold", "value": float("inf")}],
                "reading_value": float("nan"),
            },
        ],
    )
    await setup_integration(hass, _global(hass), obj)
    data = build_export_data(hass)
    exported = next(o for o in data["objects"] if o["entry_id"] == obj.entry_id)["tasks"][0]
    assert exported["readings"] == SLOTS

    payload = json.dumps(data).replace("Meter round", "Meter round copy")
    conn = _conn()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": payload})
    await hass.async_block_till_done()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1, result
    new_entry = hass.config_entries.async_get_entry(result["imported"][0]["entry_id"])
    assert new_entry is not None
    new_task = next(iter(new_entry.runtime_data.coordinator._get_merged_tasks_data().values()))
    assert new_task["readings"] == SLOTS
    completed = sorted((h for h in new_task["history"] if h["type"] == HistoryEntryType.COMPLETED), key=lambda h: h["timestamp"])
    assert completed[0]["reading_values"] == [{"id": "cold", "name": "Water cold", "unit": "m³", "value": 12.0}]
    # NaN/Infinity from a crafted backup are scrubbed, the completion survives.
    assert "reading_values" not in completed[1] and "reading_value" not in completed[1]


async def test_csv_round_trip_carries_the_slots_as_text(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.csv_handler import (
        export_objects_csv,
        import_objects_csv,
    )

    obj = _object(hass, readings=SLOTS)
    await setup_integration(hass, _global(hass), obj)
    csv_text = export_objects_csv(hass, {obj.entry_id})
    assert "Water cold | m³" in csv_text
    parsed = import_objects_csv(csv_text)
    task = next(iter(next(o for o in parsed if o["object"]["name"] == "Meter round")["tasks"].values()))
    assert [(s["name"], s["unit"]) for s in task["readings"]] == [(s["name"], s["unit"]) for s in SLOTS]


# ─── options flow ────────────────────────────────────────────────────────


async def test_options_flow_edit_task_readings_text(hass: HomeAssistant) -> None:
    """The options flow edits the slots as `Name | Unit` lines; a line whose
    name already exists keeps its id, an empty textarea clears the slots."""
    from homeassistant.data_entry_flow import FlowResultType

    obj = _object(hass, readings=SLOTS)
    await setup_integration(hass, _global(hass), obj)

    result = await hass.config_entries.options.async_init(obj.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={"selected_task": TASK_ID_1})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_task"})
    assert result["step_id"] == "edit_task"
    readings_key = next(k for k in result["data_schema"].schema if str(k) == "readings_text")
    assert readings_key.default() == "Water cold | m³\nWater warm | m³\nElectricity | kWh"

    base = {"name": "Meter round", "type": "reading", "interval_days": 30, "warning_days": 7}
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={**base, "readings_text": "water cold | l\nGas | m³\n\nnot a slot without a name? no: it is one"},
    )
    assert result["type"] == FlowResultType.MENU
    slots = obj.data["tasks"][TASK_ID_1]["readings"]
    assert [(s["name"], s["unit"]) for s in slots] == [
        ("water cold", "l"),
        ("Gas", "m³"),
        ("not a slot without a name? no: it is one", None),
    ]
    assert slots[0]["id"] == "cold" and slots[1]["id"] not in {"cold", "warm", "power"}

    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_task"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={**base, "readings_text": ""})
    assert result["type"] == FlowResultType.MENU
    assert "readings" not in obj.data["tasks"][TASK_ID_1]
