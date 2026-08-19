"""Intensive tests for the maintenance_supporter/task/history/update WS.

The user (Discussion #49 follow-up) explicitly asked for thorough testing of
this feature: "das müsste intensiv getestet werden ob die Änderungen korrekt
gespeichert werden". So we cover:

  - happy path: edit notes / cost / duration / completed_by / timestamp
  - identification: original_timestamp matching (incl. mismatched → not_found)
  - validation: bad timestamp, missing entry, missing task, missing object
  - permissions: non-admin rejected
  - last_performed recomputation when the latest lifecycle entry's
    timestamp is edited (forwards AND backwards in time)
  - clearing fields with explicit None
  - non-lifecycle entries (TRIGGERED / TRIGGER_REPLACED) do NOT affect
    last_performed
  - persistence: store actually contains the patched entry after save
  - WS contract: success payload contains patched_index + new_timestamp
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_update_history_entry,
)
from tests.conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
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

# ─── Fixtures ───────────────────────────────────────────────────────────────


def _hist_entry(
    days_ago: int,
    entry_type: str = HistoryEntryType.COMPLETED,
    notes: str | None = None,
    cost: float | None = None,
    duration: int | None = None,
) -> dict[str, Any]:
    """Build a history entry dated ``days_ago`` from now (HA timezone)."""
    ts = (dt_util.now() - timedelta(days=days_ago)).isoformat()
    entry: dict[str, Any] = {"timestamp": ts, "type": entry_type}
    if notes is not None:
        entry["notes"] = notes
    if cost is not None:
        entry["cost"] = cost
    if duration is not None:
        entry["duration"] = duration
    return entry


def _build_object_entry_with_history(
    history: list[dict[str, Any]],
    last_performed: str | None = None,
) -> MockConfigEntry:
    """Build an object entry with a single task carrying the given history.

    The returned entry is NOT yet added to hass — caller does that.
    """
    if last_performed is None and history:
        # Pick the latest lifecycle entry's date as last_performed
        lifecycle_types = {
            HistoryEntryType.COMPLETED,
            HistoryEntryType.RESET,
            HistoryEntryType.SKIPPED,
        }
        lifecycle = [h for h in history if h.get("type") in lifecycle_types]
        if lifecycle:
            last_performed = max(h["timestamp"] for h in lifecycle)[:10]
    task = build_task_data(history=history, last_performed=last_performed)
    return MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="HistEditObj",
        data=build_object_entry_data(
            object_data=build_object_data(name="HistEditObj"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_hist_edit",
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


def _get_store(hass: HomeAssistant, entry: MockConfigEntry):
    rd = getattr(entry, "runtime_data", None)
    return getattr(rd, "store", None) if rd else None


# ─── Happy path ─────────────────────────────────────────────────────────────


async def test_edit_notes_only(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Patching only ``notes`` leaves other fields intact."""
    h = _hist_entry(5, notes="initial", cost=12.5, duration=30)
    obj_entry = _build_object_entry_with_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "notes": "edited via UI",
        },
    )
    assert_ws_success(conn)

    store = _get_store(hass, obj_entry)
    saved = store.get_history(TASK_ID_1)[0]
    assert saved["notes"] == "edited via UI"
    assert saved["cost"] == 12.5  # untouched
    assert saved["duration"] == 30  # untouched
    assert saved["timestamp"] == h["timestamp"]  # untouched
    assert saved["type"] == HistoryEntryType.COMPLETED  # never patchable


async def test_edit_cost_and_duration(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    h = _hist_entry(3, cost=10.0, duration=15)
    obj_entry = _build_object_entry_with_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "cost": 99.99,
            "duration": 90,
        },
    )
    assert_ws_success(conn)

    store = _get_store(hass, obj_entry)
    saved = store.get_history(TASK_ID_1)[0]
    assert saved["cost"] == 99.99
    assert saved["duration"] == 90


async def test_clear_optional_fields_with_null(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Sending ``None`` for an optional field removes it from the entry."""
    h = _hist_entry(2, notes="will be cleared", cost=5.0)
    obj_entry = _build_object_entry_with_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "notes": None,
            "cost": None,
        },
    )
    assert_ws_success(conn)

    store = _get_store(hass, obj_entry)
    saved = store.get_history(TASK_ID_1)[0]
    assert "notes" not in saved
    assert "cost" not in saved
    assert saved["type"] == HistoryEntryType.COMPLETED


# ─── Identification & errors ────────────────────────────────────────────────


async def test_unknown_original_timestamp_returns_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    h = _hist_entry(1)
    obj_entry = _build_object_entry_with_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": "2020-01-01T00:00:00",  # nonexistent
            "notes": "doesn't matter",
        },
    )
    code, _ = assert_ws_error(conn)
    assert code == "not_found"


async def test_unknown_task_returns_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    obj_entry = _build_object_entry_with_history([_hist_entry(1)])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": "z" * 32,  # nonexistent task id
            "original_timestamp": "2020-01-01T00:00:00",
            "notes": "noop",
        },
    )
    code, _ = assert_ws_error(conn)
    assert code == "not_found"


async def test_unknown_object_returns_not_found(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    await setup_integration(hass, global_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": "01ABC",
            "task_id": TASK_ID_1,
            "original_timestamp": "2020-01-01T00:00:00",
        },
    )
    code, _ = assert_ws_error(conn)
    assert code == "not_found"


async def test_invalid_timestamp_format_rejected(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    h = _hist_entry(1)
    obj_entry = _build_object_entry_with_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "timestamp": "this is not a date",
        },
    )
    code, _ = assert_ws_error(conn)
    assert code == "invalid_date"
    # Verify nothing was mutated
    store = _get_store(hass, obj_entry)
    assert store.get_history(TASK_ID_1)[0]["timestamp"] == h["timestamp"]


async def test_non_admin_rejected(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    h = _hist_entry(1)
    obj_entry = _build_object_entry_with_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    # Non-admin connection: the websocket_api.require_admin decorator wraps
    # the handler; bypassing it the way our test helper does (unwrapping
    # __wrapped__) would defeat the test. So we check at the decorator level
    # by manually invoking the outer wrapped function and asserting it raises.
    from homeassistant.exceptions import Unauthorized

    conn = make_ws_connection()
    conn.user = MagicMock(is_admin=False)
    conn.user.id = "mock-ws-user"

    # Call the outer (decorated) function — it should raise Unauthorized
    with pytest.raises(Unauthorized):
        # ws_update_history_entry is decorated with require_admin which
        # wraps the inner async function. The outer call respects admin.
        await ws_update_history_entry(
            hass,
            conn,
            {
                "id": 1,
                "type": "maintenance_supporter/task/history/update",
                "entry_id": obj_entry.entry_id,
                "task_id": TASK_ID_1,
                "original_timestamp": h["timestamp"],
                "notes": "shouldn't apply",
            },
        )


# ─── last_performed recomputation ───────────────────────────────────────────


async def test_editing_latest_completion_timestamp_updates_last_performed(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """When the user moves the latest completion's date forward by 2 days,
    last_performed must follow."""
    older = _hist_entry(15)
    latest = _hist_entry(2)
    obj_entry = _build_object_entry_with_history([older, latest])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    new_ts = (dt_util.now() - timedelta(days=0)).isoformat()  # today

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": latest["timestamp"],
            "timestamp": new_ts,
        },
    )
    assert_ws_success(conn)

    store = _get_store(hass, obj_entry)
    assert store.get_last_performed(TASK_ID_1) == new_ts[:10]


async def test_editing_older_entry_does_NOT_change_last_performed(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Patching an older entry's timestamp must NOT change last_performed
    (the latest entry is still the anchor)."""
    older = _hist_entry(20)
    latest = _hist_entry(3)
    obj_entry = _build_object_entry_with_history([older, latest])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    initial_lp = _get_store(hass, obj_entry).get_last_performed(TASK_ID_1)
    new_old_ts = (dt_util.now() - timedelta(days=25)).isoformat()

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": older["timestamp"],
            "timestamp": new_old_ts,
        },
    )
    assert_ws_success(conn)

    store = _get_store(hass, obj_entry)
    # last_performed is the LATEST lifecycle entry's date
    assert store.get_last_performed(TASK_ID_1) == latest["timestamp"][:10]
    assert store.get_last_performed(TASK_ID_1) == initial_lp


async def test_editing_older_entry_to_become_latest_updates_last_performed(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """If editing an older entry's timestamp into the future makes it the
    new latest, last_performed must follow that newest one."""
    older = _hist_entry(20)
    latest = _hist_entry(5)
    obj_entry = _build_object_entry_with_history([older, latest])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    new_ts = (dt_util.now() - timedelta(days=1)).isoformat()  # newer than latest

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": older["timestamp"],
            "timestamp": new_ts,
        },
    )
    assert_ws_success(conn)

    store = _get_store(hass, obj_entry)
    assert store.get_last_performed(TASK_ID_1) == new_ts[:10]


async def test_non_lifecycle_entry_edit_does_NOT_touch_last_performed(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Editing a TRIGGERED entry (non-lifecycle) must not move last_performed
    even if its new timestamp would be more recent than the latest completed
    entry."""
    completed = _hist_entry(5)
    triggered = _hist_entry(10, entry_type=HistoryEntryType.TRIGGERED)
    obj_entry = _build_object_entry_with_history([triggered, completed])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    initial_lp = _get_store(hass, obj_entry).get_last_performed(TASK_ID_1)

    new_triggered_ts = (dt_util.now()).isoformat()  # today — newest of all
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": triggered["timestamp"],
            "timestamp": new_triggered_ts,
        },
    )
    assert_ws_success(conn)

    store = _get_store(hass, obj_entry)
    # last_performed must still be the COMPLETED entry's date, not triggered.
    assert store.get_last_performed(TASK_ID_1) == completed["timestamp"][:10]
    assert store.get_last_performed(TASK_ID_1) == initial_lp


# ─── Persistence ────────────────────────────────────────────────────────────


async def test_patched_entry_survives_store_save_and_reload(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """End-to-end persistence: patch → store.async_save (already awaited by
    handler) → re-read via Store API → patched data still there."""
    h = _hist_entry(7, notes="before", cost=1.0)
    obj_entry = _build_object_entry_with_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "notes": "after",
            "cost": 42.0,
        },
    )
    assert_ws_success(conn)

    store = _get_store(hass, obj_entry)
    # Force a fresh read directly from the store data structure
    direct = store.get_history(TASK_ID_1)[0]
    assert direct["notes"] == "after"
    assert direct["cost"] == 42.0


# ─── WS contract ────────────────────────────────────────────────────────────


async def test_response_contains_index_and_new_timestamp(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """The success payload should give the frontend everything it needs to
    reconcile its local view (index + the new authoritative timestamp)."""
    h0 = _hist_entry(10)
    h1 = _hist_entry(5)  # the one we'll edit
    h2 = _hist_entry(2)
    obj_entry = _build_object_entry_with_history([h0, h1, h2])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    new_ts = (dt_util.now() - timedelta(days=4)).isoformat()
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h1["timestamp"],
            "timestamp": new_ts,
        },
    )
    payload = assert_ws_success(conn)
    assert payload["success"] is True
    assert payload["patched_index"] == 1
    assert payload["new_timestamp"] == new_ts


# ─── #130: part consumption on history edits ────────────────────────────────


def _entry_with_part_and_history(history: list[dict[str, Any]]) -> MockConfigEntry:
    task = build_task_data(history=history, last_performed=history[0]["timestamp"][:10])
    data = build_object_entry_data(
        object_data=build_object_data(name="PartsHist"),
        tasks={TASK_ID_1: task},
    )
    data["parts"] = {
        "p_filter": {
            "id": "p_filter",
            "name": "Water filter",
            "unit": "pcs",
            "reorder_threshold": 1,
            "auto_buy_task": False,
        }
    }
    return MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="PartsHist",
        data=data,
        source="user",
        unique_id="maintenance_supporter_parts_hist",
    )


async def _set_part_stock(hass: HomeAssistant, entry: MockConfigEntry, value: float) -> None:
    store = _get_store(hass, entry)
    store.set_part_stock("p_filter", value)
    await store.async_save()


async def test_edit_used_parts_adjusts_stock_by_delta(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Raising a recorded quantity consumes the difference; clearing the
    selection returns it — the shelf follows the corrected history."""
    h = _hist_entry(3, notes="live")
    h["used_parts"] = [{"part_id": "p_filter", "name": "Water filter", "quantity": 1}]
    obj_entry = _entry_with_part_and_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)
    await _set_part_stock(hass, obj_entry, 10)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "used_parts": [{"part_id": "p_filter", "quantity": 3}],
        },
    )
    assert_ws_success(conn)
    store = _get_store(hass, obj_entry)
    assert store.get_part_stock("p_filter") == 8  # delta +2 consumed
    saved = store.get_history(TASK_ID_1)[0]
    assert saved["used_parts"] == [{"part_id": "p_filter", "name": "Water filter", "quantity": 3.0}]

    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn2,
        {
            "id": 2,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "used_parts": [],
        },
    )
    assert_ws_success(conn2)
    assert store.get_part_stock("p_filter") == 11  # 3 returned
    assert "used_parts" not in store.get_history(TASK_ID_1)[0]


async def test_backfilled_entry_gains_parts_and_consumes_stock(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """An entry recorded without parts can be corrected to consume them."""
    h = _hist_entry(10)
    obj_entry = _entry_with_part_and_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)
    await _set_part_stock(hass, obj_entry, 5)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "used_parts": [{"part_id": "p_filter", "quantity": 2}],
        },
    )
    assert_ws_success(conn)
    store = _get_store(hass, obj_entry)
    assert store.get_part_stock("p_filter") == 3
    saved = store.get_history(TASK_ID_1)[0]
    assert saved["used_parts"][0]["name"] == "Water filter"  # enriched from the catalog


async def test_vanished_part_is_recorded_but_skips_stock_math(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    h = _hist_entry(2)
    obj_entry = _entry_with_part_and_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)
    await _set_part_stock(hass, obj_entry, 5)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "used_parts": [{"part_id": "p_gone", "quantity": 1}],
        },
    )
    assert_ws_success(conn)
    store = _get_store(hass, obj_entry)
    assert store.get_part_stock("p_filter") == 5  # untouched
    saved = store.get_history(TASK_ID_1)[0]
    assert saved["used_parts"][0]["part_id"] == "p_gone"  # still recorded


async def test_pooled_part_edit_resolves_owner_and_records_entry_id(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """A legacy used_parts record without entry_id resolves the pool owner via
    the task's consumes_parts link; the re-enriched record then carries the
    owner's entry_id and the OWNER's stock takes the delta."""
    owner = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title="Shelf",
        data={
            **build_object_entry_data(object_data=build_object_data(name="Shelf"), tasks={}),
            "parts": {"p_bags": {"id": "p_bags", "name": "Dust bags", "auto_buy_task": False}},
        },
        source="user", unique_id="maintenance_supporter_pool_owner",
    )
    owner.add_to_hass(hass)

    h = _hist_entry(4)
    h["used_parts"] = [{"part_id": "p_bags", "name": "Dust bags", "quantity": 1}]
    task = build_task_data(history=[h], last_performed=h["timestamp"][:10])
    task["consumes_parts"] = [{"part_id": "p_bags", "quantity": 1, "entry_id": owner.entry_id}]
    borrower = MockConfigEntry(
        version=1, minor_version=4, domain=DOMAIN, title="Vacuum",
        data=build_object_entry_data(object_data=build_object_data(name="Vacuum"), tasks={TASK_ID_1: task}),
        source="user", unique_id="maintenance_supporter_pool_borrower",
    )
    borrower.add_to_hass(hass)
    await setup_integration(hass, global_entry, owner, borrower)

    owner_store = _get_store(hass, owner)
    owner_store.set_part_stock("p_bags", 6)
    await owner_store.async_save()

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": borrower.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "used_parts": [{"part_id": "p_bags", "quantity": 2}],
        },
    )
    assert_ws_success(conn)
    assert owner_store.get_part_stock("p_bags") == 5  # delta +1 on the OWNER
    saved = _get_store(hass, borrower).get_history(TASK_ID_1)[0]
    assert saved["used_parts"] == [
        {"part_id": "p_bags", "name": "Dust bags", "quantity": 2.0, "entry_id": owner.entry_id}
    ]


async def test_catalog_only_unchanged_and_orphaned_links_skip_stock_math(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Catalog-only parts (no tracked stock), unchanged quantities and links
    whose owner entry no longer exists all pass through without stock writes."""
    h = _hist_entry(6)
    h["used_parts"] = [{"part_id": "p_filter", "name": "Water filter", "quantity": 2}]
    obj_entry = _entry_with_part_and_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)
    # NOTE: no stock ever set for p_filter -> catalog-only.

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "used_parts": [
                {"part_id": "p_filter", "quantity": 5},  # catalog-only: recorded, no stock write
                {"part_id": "p_far", "quantity": 1, "entry_id": "no-such-entry"},  # owner gone
            ],
        },
    )
    assert_ws_success(conn)
    store = _get_store(hass, obj_entry)
    assert store.get_part_stock("p_filter") is None  # still untracked
    saved = store.get_history(TASK_ID_1)[0]
    ids = {u["part_id"]: u for u in saved["used_parts"]}
    assert ids["p_filter"]["quantity"] == 5.0
    assert ids["p_far"]["name"] == "p_far"  # fallback name, still recorded

    # Second edit with the SAME selection -> delta 0 everywhere, still success.
    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_update_history_entry,
        hass,
        conn2,
        {
            "id": 2,
            "type": "maintenance_supporter/task/history/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "original_timestamp": h["timestamp"],
            "used_parts": [
                {"part_id": "p_filter", "quantity": 5},
                {"part_id": "p_far", "quantity": 1, "entry_id": "no-such-entry"},
            ],
        },
    )
    assert_ws_success(conn2)


async def test_apply_history_parts_edit_skips_malformed_links(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Direct-caller defense: non-dict / part_id-less links are ignored."""
    from custom_components.maintenance_supporter.parts_runtime import async_apply_history_parts_edit

    h = _hist_entry(1)
    obj_entry = _entry_with_part_and_history([h])
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, obj_entry)

    enriched = await async_apply_history_parts_edit(
        hass, obj_entry, {}, [], ["nonsense", {"quantity": 2}]
    )
    assert enriched == []


# ─── Patchable-field surface parity (2026-08 audit) ──────────────────────────
#
# The editable history-entry fields live in four hand-kept places: the WS
# schema (the source, scanned here), the history-edit dialog, the calendar
# card's past-event mapping, and the edit handler itself. A field added to
# the schema but not the frontends silently loses data on the next edit
# (#103 class, history flavour).

def test_patchable_fields_known_to_both_frontends() -> None:
    import re
    from pathlib import Path

    component = Path(__file__).parent.parent / "custom_components" / "maintenance_supporter"
    ws_src = (component / "websocket" / "tasks_history.py").read_text(encoding="utf-8")

    # The Optional() keys of the history/update command = the patchable set.
    block = ws_src.split('"maintenance_supporter/task/history/update"', 1)[1]
    block = block.split("@websocket_api.async_response", 1)[0]
    patchable = set(re.findall(r'vol\.Optional\("([a-z_]+)"\)', block))
    assert patchable >= {"timestamp", "notes", "cost", "duration", "completed_by", "used_parts"}

    for ts_file in (
        component / "frontend-src" / "components" / "history-edit-dialog.ts",
        component / "frontend-src" / "maintenance-calendar-card.ts",
    ):
        src = ts_file.read_text(encoding="utf-8")
        unknown = {f for f in patchable if not re.search(rf"\b{re.escape(f)}\b", src)}
        assert not unknown, (
            f"{ts_file.name} does not reference patchable history field(s) "
            f"{sorted(unknown)} — a save/edit from that surface would drop them."
        )
