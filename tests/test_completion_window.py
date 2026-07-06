"""Tests for the completion window + Missed status (#36).

- ``earliest_completion_days`` blocks completing a task too far before its due
  date (``can_complete_now`` / the WS ``too_early`` guard).
- Skipping an overdue task records it as MISSED (not a deliberate SKIP); the WS
  ``as_missed`` flag forces MISSED explicitly.
"""

from __future__ import annotations

from unittest.mock import MagicMock

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    HistoryEntryType,
)
from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)
from custom_components.maintenance_supporter.websocket.objects import ws_get_object
from custom_components.maintenance_supporter.websocket.tasks_actions import (
    ws_complete_task,
    ws_skip_task,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)


def _iso_days_ago(n: int) -> str:
    return (dt_util.now().date() - __import__("datetime").timedelta(days=n)).isoformat()


# ─── Model: can_complete_now ────────────────────────────────────────────────


def test_no_restriction_always_completable() -> None:
    task = MaintenanceTask(name="X", interval_days=30, last_performed=_iso_days_ago(0))
    assert task.earliest_completion_days is None
    assert task.can_complete_now is True


def test_blocked_before_window() -> None:
    # Due in ~30 days, window 0 → not yet completable.
    task = MaintenanceTask(
        name="X",
        interval_days=30,
        last_performed=_iso_days_ago(0),
        earliest_completion_days=0,
    )
    assert task.can_complete_now is False


def test_allowed_within_window() -> None:
    # Due in ~2 days, window 7 → within → completable.
    task = MaintenanceTask(
        name="X",
        interval_days=30,
        last_performed=_iso_days_ago(28),
        earliest_completion_days=7,
    )
    assert task.can_complete_now is True


def test_overdue_always_completable() -> None:
    task = MaintenanceTask(
        name="X",
        interval_days=30,
        last_performed=_iso_days_ago(60),
        earliest_completion_days=0,
    )
    assert task.can_complete_now is True


def test_manual_task_completable() -> None:
    task = MaintenanceTask(name="X", schedule_type="manual", earliest_completion_days=0)
    assert task.can_complete_now is True


# ─── Model: round-trip + skip/missed ────────────────────────────────────────


def test_earliest_completion_days_roundtrips() -> None:
    d = MaintenanceTask(name="X", earliest_completion_days=14).to_dict()
    assert d["earliest_completion_days"] == 14
    assert MaintenanceTask.from_dict(d).earliest_completion_days == 14
    assert "earliest_completion_days" not in MaintenanceTask(name="X").to_dict()


def test_skip_records_skipped_by_default() -> None:
    task = MaintenanceTask(name="X", interval_days=30, last_performed=_iso_days_ago(0))
    task.skip()
    assert task.history[-1]["type"] == HistoryEntryType.SKIPPED


def test_skip_as_missed_records_missed() -> None:
    task = MaintenanceTask(name="X", interval_days=30, last_performed=_iso_days_ago(0))
    task.skip(as_missed=True)
    assert task.history[-1]["type"] == HistoryEntryType.MISSED


# ─── Sanitizer ──────────────────────────────────────────────────────────────


def test_sanitize_clamps_earliest_completion_days() -> None:
    task = {"name": "X", "earliest_completion_days": 99999}
    cap_task_fields(task)
    assert task["earliest_completion_days"] == 3650
    task2 = {"name": "X", "earliest_completion_days": -5}
    cap_task_fields(task2)
    assert task2["earliest_completion_days"] == 0


def test_sanitize_drops_non_int_window() -> None:
    task = {"name": "X", "earliest_completion_days": True}
    cap_task_fields(task)
    assert "earliest_completion_days" not in task


# ─── WS guard + Missed classification ───────────────────────────────────────


def _conn() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    return conn


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


def _object(hass: HomeAssistant, task: dict, *, uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Pool Pump"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


async def _history(hass: HomeAssistant, obj: MockConfigEntry) -> list[dict]:
    conn = _conn()
    await call_ws_handler(
        ws_get_object,
        hass,
        conn,
        {
            "id": 9,
            "type": "maintenance_supporter/object",
            "entry_id": obj.entry_id,
        },
    )
    tasks = conn.send_result.call_args[0][1]["tasks"]
    return next(t for t in tasks if t["id"] == TASK_ID_1)["history"]


async def test_ws_complete_blocked_before_window(hass: HomeAssistant) -> None:
    obj = _object(
        hass,
        build_task_data(
            interval_days=30,
            last_performed=_iso_days_ago(0),
        )
        | {"earliest_completion_days": 0},
        uid="cw_block",
    )
    await setup_integration(hass, _global(hass), obj)

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
        },
    )
    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "too_early"
    # Nothing recorded.
    assert not [h for h in await _history(hass, obj) if h["type"] == "completed"]


async def test_ws_complete_allowed_when_overdue(hass: HomeAssistant) -> None:
    obj = _object(
        hass,
        build_task_data(
            interval_days=30,
            last_performed=_iso_days_ago(60),
        )
        | {"earliest_completion_days": 0},
        uid="cw_ok",
    )
    await setup_integration(hass, _global(hass), obj)

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
        },
    )
    conn.send_result.assert_called_once()
    assert [h for h in await _history(hass, obj) if h["type"] == "completed"]


async def test_ws_skip_overdue_records_missed(hass: HomeAssistant) -> None:
    obj = _object(
        hass,
        build_task_data(
            interval_days=30,
            last_performed=_iso_days_ago(60),
        ),
        uid="cw_missed",
    )
    await setup_integration(hass, _global(hass), obj)

    conn = _conn()
    await call_ws_handler(
        ws_skip_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/skip",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    conn.send_result.assert_called_once()
    assert [h for h in await _history(hass, obj) if h["type"] == HistoryEntryType.MISSED]


async def test_ws_skip_not_due_records_skipped(hass: HomeAssistant) -> None:
    obj = _object(
        hass,
        build_task_data(
            interval_days=30,
            last_performed=_iso_days_ago(0),
        ),
        uid="cw_skip",
    )
    await setup_integration(hass, _global(hass), obj)

    conn = _conn()
    await call_ws_handler(
        ws_skip_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/skip",
            "entry_id": obj.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    conn.send_result.assert_called_once()
    hist = await _history(hass, obj)
    assert [h for h in hist if h["type"] == HistoryEntryType.SKIPPED]
    assert not [h for h in hist if h["type"] == HistoryEntryType.MISSED]
