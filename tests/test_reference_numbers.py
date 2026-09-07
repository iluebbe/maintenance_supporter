"""Reference numbers (#170): object ``8``, task ``8.3``, completion ``8.3-2``.

Pins the promises printed booklets rely on: numbers are handed out in
creation order, once, never reused after a deletion, never renumbered;
completions are numbered in the coordinator's choke point (backdated ones
too); copies and successors start fresh; imports keep their numbers
unless they collide; the WS summaries and the search speak them.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.helpers.reference_numbers import (
    REFERENCE_NUMBERS_KEY,
    assign_task_refs,
    format_entry_ref,
    format_task_ref,
    parse_ref,
)
from custom_components.maintenance_supporter.websocket.documents import ws_search
from custom_components.maintenance_supporter.websocket.objects import (
    ws_duplicate_object,
    ws_replace_object,
)
from custom_components.maintenance_supporter.websocket.tasks_crud import (
    ws_create_task,
    ws_duplicate_task,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection as _conn,
    setup_integration,
)


def _global(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter", data=build_global_entry_data(), source="user", unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    return entry


def _object(hass: HomeAssistant, name: str, uid: str, tasks: dict | None = None, created: datetime | None = None) -> MockConfigEntry:
    obj = build_object_data(name=name, object_id="obj_" + uid)
    entry = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title=name, data=build_object_entry_data(object_data=obj, tasks=tasks or {}), source="user", unique_id=uid)
    entry.add_to_hass(hass)
    if created is not None:
        # MockConfigEntry stamps "now" — older objects must sort first.
        object.__setattr__(entry, "created_at", created)
    return entry


def _task(name: str, created_at: str, tid: str) -> dict:
    td = build_task_data(task_id=tid, name=name, last_performed="2026-05-01")
    td["created_at"] = created_at
    return td


# ─── pure helpers ────────────────────────────────────────────────────────────


def test_format_and_parse() -> None:
    assert format_task_ref(8, 3) == "8.3"
    assert format_entry_ref(8, 3, 2) == "8.3-2"
    assert format_task_ref(None, 3) is None and format_entry_ref(8, 3, None) is None
    assert parse_ref("8") == (8, None, None)
    assert parse_ref(" 8.3 ") == (8, 3, None)
    assert parse_ref("8.3-2") == (8, 3, 2)
    assert parse_ref("8-2") is None and parse_ref("filter") is None and parse_ref("") is None


def test_assign_task_refs_creation_order_high_water_and_collisions() -> None:
    data = build_object_entry_data(
        object_data=build_object_data(name="Boiler"),
        tasks={
            "b": _task("Second", "2026-02-01", "b"),
            "a": _task("First", "2026-01-01", "a"),
        },
    )
    out = assign_task_refs(data)
    assert out is not None
    assert out[CONF_TASKS]["a"]["ref_no"] == 1 and out[CONF_TASKS]["b"]["ref_no"] == 2
    assert out[CONF_OBJECT]["next_task_ref"] == 3
    assert assign_task_refs(out) is None, "all numbered → no-op"
    # Delete task 2, add a new one: it becomes 3 — number 2 is never reused.
    later = {**out, CONF_TASKS: {"a": out[CONF_TASKS]["a"], "c": _task("Third", "2026-03-01", "c")}}
    out2 = assign_task_refs(later)
    assert out2[CONF_TASKS]["c"]["ref_no"] == 3 and out2[CONF_OBJECT]["next_task_ref"] == 4
    # An imported copy that collides keeps the older task's number and renumbers the younger.
    clash = {**out2, CONF_TASKS: {**out2[CONF_TASKS], "d": {**_task("Clone", "2026-04-01", "d"), "ref_no": 1}}}
    out3 = assign_task_refs(clash)
    assert out3[CONF_TASKS]["a"]["ref_no"] == 1 and out3[CONF_TASKS]["d"]["ref_no"] == 4


# ─── live ────────────────────────────────────────────────────────────────────


async def test_objects_and_tasks_are_numbered_in_creation_order_on_setup(hass: HomeAssistant) -> None:
    g = _global(hass)
    now = dt_util.utcnow()
    newer = _object(hass, "Newer", "ref_newer", {"t2": _task("B", "2026-02-01", "t2"), "t1": _task("A", "2026-01-01", "t1")}, created=now)
    older = _object(hass, "Older", "ref_older", {TASK_ID_1: _task("Only", "2026-01-01", TASK_ID_1)}, created=now - timedelta(days=30))
    # Set the NEWER entry up first — creation date, not boot order, decides.
    await setup_integration(hass, g, newer, older)
    assert older.data[CONF_OBJECT]["ref_no"] == 1
    assert newer.data[CONF_OBJECT]["ref_no"] == 2
    assert newer.data[CONF_TASKS]["t1"]["ref_no"] == 1 and newer.data[CONF_TASKS]["t2"]["ref_no"] == 2
    assert older.data[CONF_TASKS][TASK_ID_1]["ref_no"] == 1
    assert hass.data[DOMAIN][REFERENCE_NUMBERS_KEY]._next_object_ref == 3

    # Summaries carry the numbers.
    from custom_components.maintenance_supporter.websocket import _build_object_response

    resp = _build_object_response(hass, newer, newer.runtime_data.coordinator.data)
    assert resp["object"]["ref_no"] == 2
    assert {t["name"]: t["ref_no"] for t in resp["tasks"]} == {"A": 1, "B": 2}


async def test_new_task_gets_the_next_number_and_a_copy_a_fresh_one(hass: HomeAssistant) -> None:
    g = _global(hass)
    obj = _object(hass, "Pump", "ref_pump", {TASK_ID_1: _task("Filter", "2026-01-01", TASK_ID_1)})
    await setup_integration(hass, g, obj)
    conn = _conn()
    await call_ws_handler(ws_create_task, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id, "name": "Descale", "interval_days": 30})
    new_id = conn.send_result.call_args[0][1]["task_id"]
    await hass.async_block_till_done()
    assert obj.data[CONF_TASKS][new_id]["ref_no"] == 2
    conn = _conn()
    await call_ws_handler(ws_duplicate_task, hass, conn, {"id": 2, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    copy_id = conn.send_result.call_args[0][1]["task_id"]
    await hass.async_block_till_done()
    assert obj.data[CONF_TASKS][copy_id]["ref_no"] == 3, "a copy is a new task, not 1 again"
    assert obj.data[CONF_TASKS][TASK_ID_1]["ref_no"] == 1


async def test_completions_are_numbered_in_the_choke_point_and_never_reused(hass: HomeAssistant) -> None:
    g = _global(hass)
    obj = _object(hass, "Pump", "ref_pump2", {TASK_ID_1: _task("Filter", "2026-01-01", TASK_ID_1)})
    await setup_integration(hass, g, obj)
    coordinator = obj.runtime_data.coordinator
    store = obj.runtime_data.store
    # Distinct timestamps: the 30-second double-complete dedup would swallow repeats.
    await coordinator.complete_maintenance(TASK_ID_1, notes="first", unattended=True, completed_at=dt_util.now() - timedelta(days=3))
    # A backdated completion (older date) still gets the NEXT number.
    await coordinator.complete_maintenance(TASK_ID_1, notes="backdated", unattended=True, completed_at=dt_util.now() - timedelta(days=400))
    await coordinator.complete_maintenance(TASK_ID_1, notes="third", unattended=True, completed_at=dt_util.now() - timedelta(days=1))
    history = store.get_history(TASK_ID_1)
    done = {e["notes"]: e["ref_no"] for e in history if e["type"] == "completed"}
    assert done == {"first": 1, "backdated": 2, "third": 3}
    # Skips carry no number; deleting the newest completion does not free its number.
    await coordinator.skip_maintenance(TASK_ID_1, reason="later")
    assert all("ref_no" not in e for e in store.get_history(TASK_ID_1) if e["type"] == "skipped")
    store.set_history(TASK_ID_1, [e for e in store.get_history(TASK_ID_1) if e.get("notes") != "third"])
    await coordinator.complete_maintenance(TASK_ID_1, notes="fourth", unattended=True)
    assert next(e["ref_no"] for e in store.get_history(TASK_ID_1) if e.get("notes") == "fourth") == 4
    assert store.get_task_state(TASK_ID_1)["next_history_ref"] == 5


async def test_object_copy_and_successor_get_fresh_numbers(hass: HomeAssistant) -> None:
    g = _global(hass)
    obj = _object(hass, "Boiler", "ref_boiler", {TASK_ID_1: _task("Service", "2026-01-01", TASK_ID_1)})
    await setup_integration(hass, g, obj)
    assert obj.data[CONF_OBJECT]["ref_no"] == 1
    conn = _conn()
    await call_ws_handler(ws_duplicate_object, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id})
    copy_entry_id = conn.send_result.call_args[0][1]["entry_id"]
    await hass.async_block_till_done()
    copy = hass.config_entries.async_get_entry(copy_entry_id)
    assert copy is not None and copy.data[CONF_OBJECT]["ref_no"] == 2
    assert list(copy.data[CONF_TASKS].values())[0]["ref_no"] == 1, "the copied task is that object's task 1"
    conn = _conn()
    await call_ws_handler(ws_replace_object, hass, conn, {"id": 2, "type": "x", "entry_id": obj.entry_id, "name": "Boiler II"})
    successor_id = conn.send_result.call_args[0][1]["entry_id"]
    await hass.async_block_till_done()
    successor = hass.config_entries.async_get_entry(successor_id)
    assert successor is not None and successor.data[CONF_OBJECT]["ref_no"] == 3
    assert obj.data[CONF_OBJECT]["ref_no"] == 1, "the retired unit keeps its number"


async def test_search_finds_a_completion_by_its_reference(hass: HomeAssistant) -> None:
    g = _global(hass)
    obj = _object(hass, "Pump", "ref_pump3", {TASK_ID_1: _task("Filter", "2026-01-01", TASK_ID_1)})
    await setup_integration(hass, g, obj)
    coordinator = obj.runtime_data.coordinator
    await coordinator.complete_maintenance(TASK_ID_1, notes="Sieb gewechselt", unattended=True, completed_at=dt_util.now() - timedelta(days=2))
    await coordinator.complete_maintenance(TASK_ID_1, notes="Dichtung erneuert", unattended=True)
    conn = _conn()
    await call_ws_handler(ws_search, hass, conn, {"id": 1, "type": "x", "query": "1.1-2"})
    res = conn.send_result.call_args[0][1]
    assert len(res["history"]) == 1
    hit = res["history"][0]
    assert hit["ref"] == "1.1-2" and hit["task_id"] == TASK_ID_1 and "Dichtung" in hit["snippet"]
    conn = _conn()
    await call_ws_handler(ws_search, hass, conn, {"id": 2, "type": "x", "query": "1.1-9"})
    assert conn.send_result.call_args[0][1]["history"] == []


async def test_pre_existing_completions_are_backfilled_oldest_first(hass: HomeAssistant) -> None:
    """A history from before 2.79 carries no numbers: the first refresh numbers
    the completions by date (skips stay unnumbered); a later completion continues."""
    task = _task("Filter", "2026-01-01", TASK_ID_1)
    task["history"] = [
        {"type": "completed", "timestamp": "2026-03-01T10:00:00", "notes": "newest"},
        {"type": "skipped", "timestamp": "2026-02-15T10:00:00", "notes": "skip"},
        {"type": "completed", "timestamp": "2025-01-01T10:00:00", "notes": "oldest"},
        {"type": "completed", "timestamp": "2025-08-01T10:00:00", "notes": "middle"},
    ]
    g = _global(hass)
    obj = _object(hass, "Pump", "ref_pump_bf", {TASK_ID_1: task})
    await setup_integration(hass, g, obj)
    store = obj.runtime_data.store
    numbered = {e["notes"]: e.get("ref_no") for e in store.get_history(TASK_ID_1)}
    assert numbered == {"oldest": 1, "middle": 2, "newest": 3, "skip": None}
    await obj.runtime_data.coordinator.complete_maintenance(TASK_ID_1, notes="after", unattended=True)
    assert next(e["ref_no"] for e in store.get_history(TASK_ID_1) if e.get("notes") == "after") == 4

