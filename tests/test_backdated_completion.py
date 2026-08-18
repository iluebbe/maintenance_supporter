"""Backdated completions + ``completed_at`` event field (#133).

Covers the latest-vs-backfill split in ``MaintenanceTask.complete``:
- a ``completed_at`` that is still the LATEST lifecycle moment advances the
  cycle exactly like a normal completion (anchored on that moment),
- an OLDER one is a pure backfill: history entry only — the cycle anchor,
  trigger latch, postpone override and rotation pointer stay put,
- the ``maintenance_supporter_task_completed`` payload carries the entry's
  own timestamp as ``completed_at`` so period-bucketing automations can
  attribute backfills correctly,
- validation (future rejected, garbage rejected at the WS layer), the
  double-tap dedup bypass, and the earliest-completion-window bypass for
  past-dated records.
"""

from __future__ import annotations

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_capture_events,
)

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    EVENT_TASK_COMPLETED,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
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

# ─── Model: latest vs backfill ──────────────────────────────────────────────


def test_backdated_latest_advances_cycle() -> None:
    """'Did it three days ago' — the cycle anchors on that moment."""
    task = MaintenanceTask(name="X", interval_days=30)
    three_days_ago = dt_util.now() - timedelta(days=3)
    is_latest = task.complete(completed_at=three_days_ago)
    assert is_latest is True
    assert task.last_performed == three_days_ago.date().isoformat()
    assert task.history[-1]["timestamp"] == three_days_ago.isoformat()


def test_backfill_older_than_history_is_history_only() -> None:
    """A backfill older than the latest completion moves NOTHING but history."""
    task = MaintenanceTask(name="X", interval_days=30)
    task.complete()  # real completion "now"
    lp_before = task.last_performed
    task._trigger_active = True
    task.due_override = "2099-01-01"

    old = dt_util.now() - timedelta(days=90)
    is_latest = task.complete(completed_at=old, cost=12.5)

    assert is_latest is False
    assert task.last_performed == lp_before
    assert task._trigger_active is True, "backfill must not reset a latched trigger"
    assert task.due_override == "2099-01-01", "backfill must not consume a postpone"
    backfilled = task.history[-1]
    assert backfilled["timestamp"] == old.isoformat()
    assert backfilled["cost"] == 12.5


def test_backfill_does_not_advance_rotation() -> None:
    task = MaintenanceTask(
        name="X",
        assignee_pool=["user-a", "user-b"],
        rotation_strategy="round_robin",
        responsible_user_id="user-a",
    )
    task.complete()  # normal completion rotates a -> b
    assert task.responsible_user_id == "user-b"
    task.complete(completed_at=dt_util.now() - timedelta(days=30))
    assert task.responsible_user_id == "user-b", "backfill must not rotate again"


def test_backfill_respects_last_performed_without_history() -> None:
    """Imported / history-trimmed tasks: last_performed alone anchors the cycle."""
    task = MaintenanceTask(name="X", interval_days=30, last_performed="2026-06-01")
    task.history = []
    old = dt_util.parse_datetime("2026-01-15T10:00:00+00:00")
    assert old is not None
    is_latest = task.complete(completed_at=old)
    assert is_latest is False
    assert task.last_performed == "2026-06-01"


def test_missed_entry_anchors_against_backfill() -> None:
    """MISSED is a lifecycle anchor too (skip(as_missed=True) moved the cycle)."""
    task = MaintenanceTask(name="X", interval_days=30)
    task.skip(as_missed=True)
    lp_before = task.last_performed
    task.complete(completed_at=dt_util.now() - timedelta(days=60))
    assert task.last_performed == lp_before


def test_same_day_backdate_counts_as_latest() -> None:
    """A timestamped completion on the last_performed day still advances."""
    today = dt_util.now()
    task = MaintenanceTask(name="X", interval_days=30, last_performed=today.date().isoformat())
    task.history = []
    is_latest = task.complete(completed_at=today - timedelta(minutes=5))
    assert is_latest is True


# ─── Coordinator + WS: event payload, validation, dedup ─────────────────────


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


def _object(hass: HomeAssistant, extra_task_fields: dict | None = None, **task_kwargs) -> MockConfigEntry:
    task_data = build_task_data(**task_kwargs)
    task_data.update(extra_task_fields or {})
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Boiler",
        data=build_object_entry_data(
            object_data=build_object_data(name="Boiler"),
            tasks={TASK_ID_1: task_data},
        ),
        source="user",
        unique_id="maintenance_supporter_backdate_obj",
    )
    entry.add_to_hass(hass)
    return entry


async def _ws_complete(hass: HomeAssistant, obj: MockConfigEntry, **fields):
    conn = _conn()
    await call_ws_handler(
        ws_complete_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/complete",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID_1,
            **fields,
        },
    )
    return conn


async def test_event_carries_completed_at_now(hass: HomeAssistant) -> None:
    global_entry = _global(hass)
    obj = _object(hass, last_performed="2026-06-01")
    await setup_integration(hass, global_entry, obj)

    events = async_capture_events(hass, EVENT_TASK_COMPLETED)
    conn = await _ws_complete(hass, obj)
    assert conn.send_error.call_count == 0
    await hass.async_block_till_done()

    assert len(events) == 1
    completed_at = events[0].data["completed_at"]
    parsed = dt_util.parse_datetime(completed_at)
    assert parsed is not None
    assert abs((dt_util.now() - parsed).total_seconds()) < 60
    assert events[0].data["backfill"] is False


async def test_event_carries_backdated_completed_at(hass: HomeAssistant) -> None:
    global_entry = _global(hass)
    obj = _object(hass, last_performed="2026-06-01")
    await setup_integration(hass, global_entry, obj)

    past = (dt_util.now() - timedelta(days=4)).replace(microsecond=0)
    events = async_capture_events(hass, EVENT_TASK_COMPLETED)
    conn = await _ws_complete(hass, obj, completed_at=past.isoformat(), cost=42.0)
    assert conn.send_error.call_count == 0
    await hass.async_block_till_done()

    assert len(events) == 1
    assert events[0].data["completed_at"] == past.isoformat()
    assert events[0].data["cost"] == 42.0
    # Backdated-but-LATEST (nothing newer exists) is a real cycle advance.
    assert events[0].data["backfill"] is False

    # The history entry records the same moment; the cycle anchors on it.
    merged = obj.runtime_data.coordinator._get_merged_tasks_data()
    entry = merged[TASK_ID_1]["history"][-1]
    assert entry["timestamp"] == past.isoformat()
    assert merged[TASK_ID_1]["last_performed"] == past.date().isoformat()


async def test_ws_rejects_future_completed_at(hass: HomeAssistant) -> None:
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)

    future = (dt_util.now() + timedelta(days=2)).isoformat()
    conn = await _ws_complete(hass, obj, completed_at=future)
    assert conn.send_error.call_count == 1
    assert conn.send_error.call_args[0][1] == "completed_at_in_future"


async def test_ws_rejects_garbage_completed_at(hass: HomeAssistant) -> None:
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)

    conn = await _ws_complete(hass, obj, completed_at="not-a-date")
    assert conn.send_error.call_count == 1
    assert conn.send_error.call_args[0][1] == "invalid_format"


async def test_backdate_bypasses_double_tap_dedup(hass: HomeAssistant) -> None:
    """A deliberate backfill right after a normal completion must not be
    swallowed by the household double-complete guard."""
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)

    conn1 = await _ws_complete(hass, obj)
    assert conn1.send_error.call_count == 0
    past = (dt_util.now() - timedelta(days=10)).replace(microsecond=0)
    conn2 = await _ws_complete(hass, obj, completed_at=past.isoformat())
    assert conn2.send_error.call_count == 0
    await hass.async_block_till_done()

    merged = obj.runtime_data.coordinator._get_merged_tasks_data()
    completed = [h for h in merged[TASK_ID_1]["history"] if h["type"] == HistoryEntryType.COMPLETED]
    assert len(completed) == 2


async def test_past_dated_bypasses_earliest_completion_window(hass: HomeAssistant) -> None:
    """Recording work already done on a past day is a history correction, not
    early work — the completion window must not block it."""
    global_entry = _global(hass)
    # Freshly completed 30d-interval task with a tight window: a normal
    # complete now is "too early", a past-dated backfill is not.
    obj = _object(
        hass,
        last_performed=dt_util.now().date().isoformat(),
        interval_days=30,
        extra_task_fields={"earliest_completion_days": 2},
    )
    await setup_integration(hass, global_entry, obj)

    blocked = await _ws_complete(hass, obj)
    assert blocked.send_error.call_count == 1
    assert blocked.send_error.call_args[0][1] == "too_early"

    past = (dt_util.now() - timedelta(days=45)).replace(microsecond=0)
    backfill = await _ws_complete(hass, obj, completed_at=past.isoformat())
    assert backfill.send_error.call_count == 0


async def test_pure_backfill_flags_event_as_backfill(hass: HomeAssistant) -> None:
    """A completion older than the latest one carries backfill: true."""
    global_entry = _global(hass)
    obj = _object(hass)
    await setup_integration(hass, global_entry, obj)

    events = async_capture_events(hass, EVENT_TASK_COMPLETED)
    conn1 = await _ws_complete(hass, obj)  # real completion "now"
    assert conn1.send_error.call_count == 0
    past = (dt_util.now() - timedelta(days=30)).replace(microsecond=0)
    conn2 = await _ws_complete(hass, obj, completed_at=past.isoformat())
    assert conn2.send_error.call_count == 0
    await hass.async_block_till_done()

    assert [e.data["backfill"] for e in events] == [False, True]


async def test_backfill_skips_on_complete_action(hass: HomeAssistant) -> None:
    """A pure backfill must not run on_complete_action (the device state it
    would touch belongs to today, not to the months-old backfilled work)."""
    from unittest.mock import AsyncMock, patch

    global_entry = _global(hass)
    obj = _object(
        hass,
        extra_task_fields={
            "on_complete_action": {
                "service": "persistent_notification.create",
                "data": {"message": "Task done!"},
            }
        },
    )
    await setup_integration(hass, global_entry, obj)

    conn1 = await _ws_complete(hass, obj)  # real completion -> action fires
    assert conn1.send_error.call_count == 0
    await hass.async_block_till_done()

    with patch(
        "homeassistant.core.ServiceRegistry.async_call",
        new_callable=AsyncMock,
    ) as mock_call:
        past = (dt_util.now() - timedelta(days=30)).replace(microsecond=0)
        conn2 = await _ws_complete(hass, obj, completed_at=past.isoformat())
        assert conn2.send_error.call_count == 0
        await hass.async_block_till_done()
        assert mock_call.call_count == 0, "backfill must not dispatch on_complete_action"
