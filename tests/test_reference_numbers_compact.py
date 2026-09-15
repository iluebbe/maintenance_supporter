"""Reference-number compaction (#170 follow-up): the ONE explicit admin action
that renumbers.

The reporter deleted test objects and wanted a tidy sequence again. The rule
("assigned once, never reused, never renumbered") stays for every lazy path;
``reference_numbers/compact`` renumbers everything in one pass — objects
1..N in creation order, tasks 1..M per object, completions 1..K by date —
and resets the counters. Pinned here: gaps close, order is by creation /
date (not by the old number), archived tasks keep a number, skips stay
unnumbered, a second run changes nothing, the search resolves the NEW
reference, and only an admin may do it.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
)
from custom_components.maintenance_supporter.helpers.reference_numbers import (
    REFERENCE_NUMBERS_KEY,
    compact_history_refs,
    compact_task_refs,
    parse_ref,
)
from custom_components.maintenance_supporter.websocket.documents import ws_search
from custom_components.maintenance_supporter.websocket.reference_numbers import (
    ws_compact_reference_numbers,
)

from .conftest import (
    assert_ws_success,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_global_entry as _global,
    make_object_entry,
    make_ws_connection as _conn,
    setup_integration,
)

_CMD = "maintenance_supporter/reference_numbers/compact"


def _object(hass: HomeAssistant, name: str, uid: str, tasks: dict, created: datetime) -> MockConfigEntry:
    entry = make_object_entry(hass, tasks=tasks, name=name, unique_id=uid, object_id="obj_" + uid)
    object.__setattr__(entry, "created_at", created)
    return entry


def _task(name: str, created_at: str, tid: str, ref: int | None = None, **extra) -> dict:
    td = build_task_data(task_id=tid, name=name, last_performed="2026-05-01")
    td["created_at"] = created_at
    if ref is not None:
        td["ref_no"] = ref
    td.update(extra)
    return td


def _set_object_ref(hass: HomeAssistant, entry: MockConfigEntry, ref: int) -> None:
    obj = {**entry.data[CONF_OBJECT], "ref_no": ref}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_OBJECT: obj})


def _set_task_refs(hass: HomeAssistant, entry: MockConfigEntry, refs: dict[str, int], next_ref: int) -> None:
    tasks = {tid: {**td, "ref_no": refs[tid]} if tid in refs else td for tid, td in entry.data[CONF_TASKS].items()}
    obj = {**entry.data[CONF_OBJECT], "next_task_ref": next_ref}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_OBJECT: obj, CONF_TASKS: tasks})


async def _compact(hass: HomeAssistant) -> dict:
    conn = _conn()
    await call_ws_handler(ws_compact_reference_numbers, hass, conn, {"id": 1, "type": _CMD})
    return assert_ws_success(conn)


# ─── pure helpers ────────────────────────────────────────────────────────────


def test_compact_task_refs_closes_gaps_in_creation_order() -> None:
    data = build_object_entry_data(
        object_data={**build_object_data(name="Boiler"), "next_task_ref": 9},
        tasks={
            "b": _task("Second", "2026-02-01", "b", ref=7),
            "a": _task("First", "2026-01-01", "a", ref=2),
            "c": _task("Archived", "2026-03-01", "c", ref=8, archived_at="2026-04-01T00:00:00"),
        },
    )
    out = compact_task_refs(data)
    assert out is not None
    assert {tid: td["ref_no"] for tid, td in out[CONF_TASKS].items()} == {"a": 1, "b": 2, "c": 3}
    assert out[CONF_OBJECT]["next_task_ref"] == 4
    assert compact_task_refs(out) is None, "already compact → no-op"
    assert compact_task_refs(build_object_entry_data(tasks={})) is not None, "an empty object still gets next_task_ref = 1"


def test_compact_history_refs_orders_by_timestamp_and_drops_stray_numbers() -> None:
    history = [
        {"type": "completed", "timestamp": "2026-03-01T10:00:00", "ref_no": 2},
        {"type": "skipped", "timestamp": "2026-02-15T10:00:00", "ref_no": 9},
        {"type": "completed", "timestamp": "2025-01-01T10:00:00", "ref_no": 5},
        {"type": "completed", "timestamp": "2025-08-01T10:00:00"},
    ]
    store = MagicMock()
    store.get_history.return_value = history
    store.get_task_state.return_value = {"next_history_ref": 9}
    count, changed = compact_history_refs(store, {"t": {}})
    assert (count, changed) == (3, True)
    assert [(e["type"], e.get("ref_no")) for e in history] == [
        ("completed", 3),
        ("skipped", None),
        ("completed", 1),
        ("completed", 2),
    ]
    store.update_task_state.assert_called_once_with("t", next_history_ref=4)
    # No completions: the counter is removed (absent = "start at 1").
    store.reset_mock()
    store.get_history.return_value = [{"type": "skipped", "timestamp": "2026-01-01"}]
    store.get_task_state.return_value = {"next_history_ref": 3}
    assert compact_history_refs(store, {"t": {}}) == (0, True)
    store.update_task_state.assert_called_once_with("t", next_history_ref=None)


# ─── live ────────────────────────────────────────────────────────────────────


async def test_compact_renumbers_everything_and_is_idempotent(hass: HomeAssistant) -> None:
    g = _global(hass)
    now = dt_util.utcnow()
    # Three objects; the newest one is set up FIRST so creation date, not
    # boot order, decides. Task numbers carry gaps and an archived task.
    third = _object(hass, "Third", "cmp_c", {"c1": _task("C1", "2026-03-01", "c1")}, created=now - timedelta(days=10))
    first = _object(
        hass,
        "First",
        "cmp_a",
        {
            "a2": _task("A2", "2026-02-01", "a2"),
            "a1": _task("A1", "2026-01-01", "a1"),
            "a3": _task("A3 archived", "2026-03-01", "a3", archived_at="2026-04-01T00:00:00"),
        },
        created=now - timedelta(days=30),
    )
    second = _object(hass, "Second", "cmp_b", {"b1": _task("B1", "2026-01-01", "b1")}, created=now - timedelta(days=20))
    await setup_integration(hass, g, third, first, second)
    assert [e.data[CONF_OBJECT]["ref_no"] for e in (first, second, third)] == [1, 2, 3], "setup numbered by creation"

    # Now the state after deletions: objects 1, 3, 5; tasks 2, 5, 7; completions 2 and 5.
    _set_object_ref(hass, second, 3)
    _set_object_ref(hass, third, 5)
    ref_store = hass.data[DOMAIN][REFERENCE_NUMBERS_KEY]
    ref_store._next_object_ref = 9
    _set_task_refs(hass, first, {"a1": 2, "a2": 5, "a3": 7}, next_ref=11)
    _set_task_refs(hass, second, {"b1": 4}, next_ref=6)
    store = first.runtime_data.store
    store.set_history(
        "a1",
        [
            {"type": "completed", "timestamp": "2026-03-01T10:00:00", "notes": "newer", "ref_no": 5},
            {"type": "skipped", "timestamp": "2026-02-15T10:00:00", "notes": "skip"},
            {"type": "completed", "timestamp": "2025-01-01T10:00:00", "notes": "older", "ref_no": 2},
        ],
    )
    store.update_task_state("a1", next_history_ref=9)
    store.set_history("a3", [{"type": "completed", "timestamp": "2026-01-01T10:00:00", "notes": "archived done", "ref_no": 3}])
    store.update_task_state("a3", next_history_ref=4)
    await store.async_save()

    result = await _compact(hass)
    assert result == {"objects": 3, "tasks": 5, "completions": 3}

    # Objects 1..3 in creation order, counter reset.
    assert [e.data[CONF_OBJECT]["ref_no"] for e in (first, second, third)] == [1, 2, 3]
    assert ref_store._next_object_ref == 4
    # Tasks 1..M per object in creation order; the archived task keeps a number.
    assert {tid: td["ref_no"] for tid, td in first.data[CONF_TASKS].items()} == {"a1": 1, "a2": 2, "a3": 3}
    assert first.data[CONF_OBJECT]["next_task_ref"] == 4
    assert second.data[CONF_TASKS]["b1"]["ref_no"] == 1 and second.data[CONF_OBJECT]["next_task_ref"] == 2
    assert third.data[CONF_TASKS]["c1"]["ref_no"] == 1 and third.data[CONF_OBJECT]["next_task_ref"] == 2
    # Completions 1..K by timestamp (the OLDER one is 1 even though it carried 2 before), skips unnumbered.
    numbered = {e["notes"]: e.get("ref_no") for e in store.get_history("a1")}
    assert numbered == {"older": 1, "newer": 2, "skip": None}
    assert store.get_task_state("a1")["next_history_ref"] == 3
    assert store.get_history("a3")[0]["ref_no"] == 1 and store.get_task_state("a3")["next_history_ref"] == 2
    # A task that never completed carries no counter.
    assert "next_history_ref" not in store.get_task_state("a2")

    # The counters continue from the compacted state: the next completion is 1.1-3.
    await first.runtime_data.coordinator.complete_maintenance("a1", notes="after", unattended=True)
    assert next(e["ref_no"] for e in store.get_history("a1") if e.get("notes") == "after") == 3

    # The search resolves the NEW reference (parse_ref + the documents lookup).
    assert parse_ref("1.1-2") == (1, 1, 2)
    conn = _conn()
    await call_ws_handler(ws_search, hass, conn, {"id": 2, "type": "x", "query": "1.1-2"})
    hits = conn.send_result.call_args[0][1]["history"]
    assert len(hits) == 1 and hits[0]["ref"] == "1.1-2" and hits[0]["task_id"] == "a1" and "newer" in hits[0]["snippet"]

    # Second run: same counts, nothing moves.
    before = {e.entry_id: dict(e.data) for e in (first, second, third)}
    before_hist = [dict(e) for e in store.get_history("a1")]
    assert await _compact(hass) == {"objects": 3, "tasks": 5, "completions": 4}
    assert {e.entry_id: dict(e.data) for e in (first, second, third)} == before
    assert store.get_history("a1") == before_hist
    assert ref_store._next_object_ref == 4


async def test_compact_refuses_non_admin(hass: HomeAssistant) -> None:
    g = _global(hass)
    obj = _object(hass, "Pump", "cmp_pump", {"t1": _task("T1", "2026-01-01", "t1")}, created=dt_util.utcnow())
    await setup_integration(hass, g, obj)
    conn = _conn()
    conn.user = MagicMock(is_admin=False)
    conn.user.id = "plain-user"
    # The decorated handler (NOT unwrapped) must raise before touching anything.
    with pytest.raises(Unauthorized):
        await ws_compact_reference_numbers(hass, conn, {"id": 1, "type": _CMD})
    assert not conn.send_result.called


async def test_compact_reports_not_loaded_without_the_integration(hass: HomeAssistant) -> None:
    conn = _conn()
    await call_ws_handler(ws_compact_reference_numbers, hass, conn, {"id": 1, "type": _CMD})
    assert conn.send_error.called and conn.send_error.call_args[0][1] == "not_loaded"
    assert not conn.send_result.called
