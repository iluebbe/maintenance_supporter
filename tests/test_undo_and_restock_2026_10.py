"""Undo after Complete, and parts back on the shelf when a completion is
deleted (2026-10).

* A Complete in the panel or on a card is remembered for its person like a
  voice action: the toast's Undo (``task/undo``) restores the record, the
  cycle anchor and the parts stock within ten minutes — one level per person,
  only for the task the toast is about, and never over a later change.
* Deleting a completion from the history returned nothing to stock: a
  mistaken completion left the shelf too low. The parts it used go back now,
  through the same per-part delta as clearing them in the history editor.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID, HistoryEntryType
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_complete_task,
    ws_delete_history_entry,
    ws_quick_complete_task,
    ws_skip_task,
    ws_undo_completion,
)
from tests.conftest import (
    TASK_ID_1,
    TASK_ID_2,
    assert_ws_error,
    assert_ws_success,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
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


def _object(history: list[dict[str, Any]] | None = None, *, quick: bool = False) -> MockConfigEntry:
    last = (dt_util.now() - timedelta(days=40)).date().isoformat()
    task = build_task_data(history=history or [], last_performed=last)
    task["consumes_parts"] = [{"part_id": "p_filter", "quantity": 2}]
    if quick:
        task["quick_complete_defaults"] = {"notes": "Done via QR"}
    other = build_task_data(task_id=TASK_ID_2, name="Descale", last_performed=last)
    data = build_object_entry_data(object_data=build_object_data(name="Water softener"), tasks={TASK_ID_1: task, TASK_ID_2: other})
    data["parts"] = {"p_filter": {"id": "p_filter", "name": "Water filter", "unit": "pcs", "auto_buy_task": False}}
    return MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title="Water softener", data=data, source="user", unique_id="ms_undo_obj"
    )


def _store(entry: MockConfigEntry) -> Any:
    return entry.runtime_data.store


async def _setup(hass: HomeAssistant, global_entry: MockConfigEntry, obj: MockConfigEntry, stock: float = 10) -> Any:
    obj.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj)
    store = _store(obj)
    store.set_part_stock("p_filter", stock)
    await store.async_save()
    return store


async def _complete(hass: HomeAssistant, obj: MockConfigEntry, task_id: str = TASK_ID_1, user: str = "mock-ws-user") -> dict[str, Any]:
    conn = make_ws_connection()
    conn.user.id = user
    await call_ws_handler(ws_complete_task, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": task_id})
    return assert_ws_success(conn)


async def _undo(hass: HomeAssistant, obj: MockConfigEntry, task_id: str = TASK_ID_1, user: str = "mock-ws-user") -> Any:
    conn = make_ws_connection()
    conn.user.id = user
    await call_ws_handler(ws_undo_completion, hass, conn, {"id": 2, "type": "x", "entry_id": obj.entry_id, "task_id": task_id})
    return conn


def _completions(store: Any, task_id: str = TASK_ID_1) -> list[dict[str, Any]]:
    return [h for h in store.get_history(task_id) if h.get("type") == HistoryEntryType.COMPLETED]


async def test_undo_takes_a_completion_back(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    anchor = store.get_task_state(TASK_ID_1).get("last_performed")

    assert (await _complete(hass, obj))["undo"] is True
    assert len(_completions(store)) == 1
    assert store.get_part_stock("p_filter") == 8

    conn = await _undo(hass, obj)
    payload = assert_ws_success(conn)
    assert payload["success"] is True and payload["action_ran"] is False
    assert _completions(store) == []
    assert store.get_task_state(TASK_ID_1).get("last_performed") == anchor
    assert store.get_part_stock("p_filter") == 10

    # one level: a second Undo has nothing left
    assert_ws_error(await _undo(hass, obj), "nothing_to_undo")


async def test_undo_is_only_for_the_task_of_the_toast(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Two quick Completes: the first toast's Undo must not take back the
    second task — the person's one remembered action is the latest."""
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    await _complete(hass, obj, TASK_ID_1)
    await _complete(hass, obj, TASK_ID_2)

    assert_ws_error(await _undo(hass, obj, TASK_ID_1), "nothing_to_undo")
    assert len(_completions(store, TASK_ID_1)) == 1  # untouched
    # the refusal did not consume the record of the second task
    assert_ws_success(await _undo(hass, obj, TASK_ID_2))
    assert _completions(store, TASK_ID_2) == []


async def test_undo_is_per_person(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    await _complete(hass, obj, user="alice")
    assert_ws_error(await _undo(hass, obj, user="bob"), "nothing_to_undo")
    assert len(_completions(store)) == 1
    assert_ws_success(await _undo(hass, obj, user="alice"))


async def test_undo_refuses_over_a_later_change(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Someone else acted on the task meanwhile (here: skipped the next
    cycle): undoing the completion would erase that too — refused, nothing
    changes."""
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    await _complete(hass, obj, user="alice")
    conn = make_ws_connection()
    conn.user.id = "bob"
    await call_ws_handler(ws_skip_task, hass, conn, {"id": 9, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    assert_ws_success(conn)
    history = store.get_history(TASK_ID_1)

    assert_ws_error(await _undo(hass, obj, user="alice"), "changed_since")
    assert store.get_history(TASK_ID_1) == history
    assert store.get_part_stock("p_filter") == 8


async def test_a_swallowed_double_tap_offers_no_undo(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Bob taps Complete seconds after Alice: the double-tap guard keeps one
    completion. Bob gets no Undo — his would claim to take back Alice's."""
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    assert (await _complete(hass, obj, user="alice"))["undo"] is True
    assert (await _complete(hass, obj, user="bob"))["undo"] is False
    assert len(_completions(store)) == 1
    assert_ws_error(await _undo(hass, obj, user="bob"), "nothing_to_undo")
    assert len(_completions(store)) == 1
    # Alice's own Undo still works
    assert_ws_success(await _undo(hass, obj, user="alice"))
    assert _completions(store) == []


async def test_undo_expires_after_ten_minutes(
    hass: HomeAssistant, global_entry: MockConfigEntry, freezer: FrozenDateTimeFactory
) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    await _complete(hass, obj)
    freezer.tick(timedelta(minutes=11))
    assert_ws_error(await _undo(hass, obj), "nothing_to_undo")
    assert len(_completions(store)) == 1


async def test_an_undone_backdated_completion_can_be_sent_again(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Back-dated, undone, sent again with the same moment (the note was
    forgotten): the double-submit guard used to drop it for 30 s — found
    live, a second browser re-submitting the same minute after an Undo."""
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    moment = (dt_util.now() - timedelta(hours=2)).replace(second=0, microsecond=0).replace(tzinfo=None).isoformat()

    async def complete_at(notes: str) -> dict[str, Any]:
        conn = make_ws_connection()
        await call_ws_handler(
            ws_complete_task, hass, conn,
            {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "completed_at": moment, "notes": notes},
        )
        return assert_ws_success(conn)

    assert (await complete_at("first try"))["undo"] is True
    assert_ws_success(await _undo(hass, obj))
    assert _completions(store) == []
    assert (await complete_at("with the note"))["undo"] is True
    done = _completions(store)
    assert len(done) == 1 and done[0]["notes"] == "with the note"


async def test_quick_complete_is_undoable_too(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object(quick=True)
    store = await _setup(hass, global_entry, obj)
    conn = make_ws_connection()
    await call_ws_handler(ws_quick_complete_task, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
    assert assert_ws_success(conn)["undo"] is True
    assert_ws_success(await _undo(hass, obj))
    assert _completions(store) == []


async def test_undo_says_when_a_completion_action_already_ran(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    obj_data = dict(obj.data)
    tasks = dict(obj_data["tasks"])
    tasks[TASK_ID_1] = {**tasks[TASK_ID_1], "on_complete_action": {"service": "input_boolean.toggle", "target": {"entity_id": "input_boolean.x"}}}
    obj_data["tasks"] = tasks
    obj = MockConfigEntry(version=1, minor_version=4, domain=DOMAIN, title="Water softener", data=obj_data, source="user", unique_id="ms_undo_obj")
    await _setup(hass, global_entry, obj)
    await _complete(hass, obj)
    assert assert_ws_success(await _undo(hass, obj))["action_ran"] is True


async def test_deleting_a_completion_returns_its_parts(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object()
    store = await _setup(hass, global_entry, obj)
    await _complete(hass, obj)
    assert store.get_part_stock("p_filter") == 8
    entry_ts = _completions(store)[0]["timestamp"]
    assert _completions(store)[0]["used_parts"]

    conn = make_ws_connection()
    await call_ws_handler(
        ws_delete_history_entry, hass, conn, {"id": 3, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "timestamp": entry_ts}
    )
    payload = assert_ws_success(conn)
    assert payload["parts_returned"] is True
    assert store.get_part_stock("p_filter") == 10
    assert _completions(store) == []


async def test_deleting_an_entry_without_parts_moves_no_stock(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    skipped = {"timestamp": (dt_util.now() - timedelta(days=3)).isoformat(), "type": HistoryEntryType.SKIPPED}
    obj = _object([skipped])
    store = await _setup(hass, global_entry, obj)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_delete_history_entry, hass, conn, {"id": 3, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "timestamp": skipped["timestamp"]}
    )
    assert assert_ws_success(conn)["parts_returned"] is False
    assert store.get_part_stock("p_filter") == 10
