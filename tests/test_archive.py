"""Archive & retention feature (v2.10.0).

Covers the whole vertical:

* **Status backbone** — ``archived`` is the highest-precedence status in both the
  model property and the dict twin (``compute_status_from_task_dict``), and the
  field round-trips through ``to_dict`` / ``from_dict``.
* **Retention policy (pure)** — ``should_auto_archive`` / ``should_auto_delete``
  decisions over plain dicts: one-offs only, auto-reason gates delete.
* **WS commands** — task + object archive/unarchive, the object→tasks cascade,
  the recurring-unarchive fresh cycle (D2), and the error paths.
* **Auto sweep** — ``async_run_retention_sweep`` auto-archives aged completed
  one-offs and auto-deletes aged auto-archives, but never a manual archive.
* **Inertness** — archived tasks drop out of the status counts (cost retained)
  and the WS response exposes the archive fields.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    ARCHIVE_REASON_AUTO,
    ARCHIVE_REASON_MANUAL,
    ARCHIVE_REASON_OBJECT,
    CONF_ARCHIVE_ONEOFF_DAYS,
    CONF_DELETE_ARCHIVED_ONEOFF_DAYS,
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.aggregate import (
    compute_status_counts,
)
from custom_components.maintenance_supporter.helpers.retention import (
    async_run_retention_sweep,
    is_completed_oneoff,
    should_auto_archive,
    should_auto_delete,
)
from custom_components.maintenance_supporter.helpers.status import (
    compute_status_from_task_dict,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)
from custom_components.maintenance_supporter.websocket import (
    _build_object_response,
    _build_task_summary,
)
from custom_components.maintenance_supporter.websocket.objects import (
    ws_archive_object,
    ws_get_object,
    ws_unarchive_object,
)
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_archive_task,
    ws_unarchive_task,
)

from .conftest import (
    OBJECT_ID_1,
    TASK_ID_1,
    TASK_ID_2,
    assert_ws_error,
    assert_ws_success,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    make_ws_connection,
    setup_integration,
)

_TODAY = dt_util.now().date()


def _days_ago(n: int) -> str:
    return (_TODAY - timedelta(days=n)).isoformat()


def _ts_days_ago(n: int) -> str:
    return (dt_util.now() - timedelta(days=n)).isoformat()


def _oneoff_task(
    *,
    task_id: str = TASK_ID_1,
    name: str = "Replace battery",
    last_performed: str | None = None,
    archived_at: str | None = None,
    archived_reason: str | None = None,
    history: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """A one-time task data dict (optionally completed / archived)."""
    td: dict[str, Any] = {
        "id": task_id,
        "object_id": OBJECT_ID_1,
        "name": name,
        "type": "replacement",
        "enabled": True,
        "schedule_type": "one_time",
        "due_date": _days_ago(40),
        "warning_days": 7,
        "history": history or [],
    }
    if last_performed is not None:
        td["last_performed"] = last_performed
    if archived_at is not None:
        td["archived_at"] = archived_at
    if archived_reason is not None:
        td["archived_reason"] = archived_reason
    return td


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _global_entry_with_archive(hass: HomeAssistant, *, archive_days: int = 0, delete_days: int = 0) -> MockConfigEntry:
    """Global entry whose options carry the archive automation thresholds."""
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        options={
            CONF_ARCHIVE_ONEOFF_DAYS: archive_days,
            CONF_DELETE_ARCHIVED_ONEOFF_DAYS: delete_days,
        },
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# ═══════════════════════════════════════════════════════════════════════════
# Status backbone
# ═══════════════════════════════════════════════════════════════════════════


def test_model_status_archived_has_highest_precedence() -> None:
    """archived_at on the model wins over overdue AND an active trigger."""
    task = MaintenanceTask.from_dict(
        {
            "id": "t",
            "name": "x",
            "schedule_type": "time_based",
            "interval_days": 30,
            "last_performed": "2000-01-01",  # wildly overdue
            "archived_at": _ts_days_ago(1),
        }
    )
    assert task.archived is True
    assert task.status == MaintenanceStatus.ARCHIVED
    # Even a live trigger does not beat archived.
    task._trigger_active = True
    assert task.status == MaintenanceStatus.ARCHIVED


def test_dict_status_twin_archived_precedence() -> None:
    """compute_status_from_task_dict mirrors the model: archived wins."""
    assert (
        compute_status_from_task_dict(
            {
                "archived_at": _ts_days_ago(2),
                "_trigger_active": True,
                "_days_until_due": -99,
            }
        )
        == MaintenanceStatus.ARCHIVED
    )
    # Active task (no archived_at) keeps the normal ladder.
    assert compute_status_from_task_dict({"_days_until_due": -1}) == MaintenanceStatus.OVERDUE


def test_archived_fields_round_trip_through_serialization() -> None:
    """archived_at + archived_reason survive to_dict / from_dict; absent when active."""
    archived = MaintenanceTask.from_dict(
        {
            "id": "t",
            "name": "x",
            "schedule_type": "one_time",
            "due_date": "2026-01-01",
            "last_performed": "2026-01-02",
            "archived_at": _ts_days_ago(3),
            "archived_reason": ARCHIVE_REASON_MANUAL,
        }
    )
    dumped = archived.to_dict()
    assert dumped["archived_at"] == archived.archived_at
    assert dumped["archived_reason"] == ARCHIVE_REASON_MANUAL
    assert MaintenanceTask.from_dict(dumped).archived is True

    # Active task: the keys stay out of the persisted dict (kept minimal).
    active = MaintenanceTask.from_dict({"id": "t", "name": "x"})
    assert active.archived is False
    assert "archived_at" not in active.to_dict()
    assert "archived_reason" not in active.to_dict()


# ═══════════════════════════════════════════════════════════════════════════
# Retention policy — pure functions
# ═══════════════════════════════════════════════════════════════════════════


def test_is_completed_oneoff() -> None:
    assert is_completed_oneoff(_oneoff_task(last_performed=_days_ago(1))) is True
    # one-off but never completed
    assert is_completed_oneoff(_oneoff_task()) is False
    # recurring task is never a "completed one-off"
    assert (
        is_completed_oneoff(
            {
                "schedule_type": "time_based",
                "interval_days": 30,
                "last_performed": _days_ago(1),
            }
        )
        is False
    )


def test_should_auto_archive_policy() -> None:
    today = _TODAY
    aged = _oneoff_task(last_performed=_days_ago(20))
    fresh = _oneoff_task(last_performed=_days_ago(5))

    assert should_auto_archive(aged, archive_days=14, today=today) is True
    # Not yet past the window.
    assert should_auto_archive(fresh, archive_days=14, today=today) is False
    # Feature disabled.
    assert should_auto_archive(aged, archive_days=0, today=today) is False
    # Already archived → never re-archived.
    already = _oneoff_task(last_performed=_days_ago(20), archived_at=_ts_days_ago(1))
    assert should_auto_archive(already, archive_days=14, today=today) is False
    # Recurring task is out of scope (manual archive only).
    recurring = {
        "schedule_type": "time_based",
        "interval_days": 30,
        "last_performed": _days_ago(99),
    }
    assert should_auto_archive(recurring, archive_days=14, today=today) is False


def test_should_auto_delete_policy() -> None:
    today = _TODAY
    auto_old = _oneoff_task(
        last_performed=_days_ago(60),
        archived_at=_ts_days_ago(30),
        archived_reason=ARCHIVE_REASON_AUTO,
    )
    assert should_auto_delete(auto_old, delete_days=14, today=today) is True
    # Disabled (0 = never).
    assert should_auto_delete(auto_old, delete_days=0, today=today) is False
    # Not yet aged enough.
    auto_recent = _oneoff_task(
        archived_at=_ts_days_ago(3),
        archived_reason=ARCHIVE_REASON_AUTO,
    )
    assert should_auto_delete(auto_recent, delete_days=14, today=today) is False
    # A MANUAL archive is never auto-deleted.
    manual_old = _oneoff_task(
        archived_at=_ts_days_ago(30),
        archived_reason=ARCHIVE_REASON_MANUAL,
    )
    assert should_auto_delete(manual_old, delete_days=14, today=today) is False
    # An OBJECT-cascade archive is never auto-deleted either.
    obj_old = _oneoff_task(
        archived_at=_ts_days_ago(30),
        archived_reason=ARCHIVE_REASON_OBJECT,
    )
    assert should_auto_delete(obj_old, delete_days=14, today=today) is False
    # Active task → nothing to delete.
    assert should_auto_delete(_oneoff_task(), delete_days=14, today=today) is False


# ═══════════════════════════════════════════════════════════════════════════
# WS — task archive / unarchive
# ═══════════════════════════════════════════════════════════════════════════


def _object_entry_with_task(hass: HomeAssistant, task: dict[str, Any], *, uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Gadget",
        data=build_object_entry_data(
            object_data=build_object_data(name="Gadget"),
            tasks={task["id"]: task},
        ),
        source="user",
        unique_id=uid,
    )
    entry.add_to_hass(hass)
    return entry


async def test_ws_archive_task_sets_fields_and_status(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """ws_archive_task stamps archived_at + reason MANUAL; status reads archived."""
    task = build_task_data(last_performed=_days_ago(60), interval_days=30)
    entry = _object_entry_with_task(hass, task, uid="ms_arch_task")
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_archive_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/archive",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    payload = assert_ws_success(conn)
    assert payload["success"] is True
    assert payload["archived_at"]

    persisted = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert persisted["archived_at"]
    assert persisted["archived_reason"] == ARCHIVE_REASON_MANUAL

    # The WS response (and thus the sensor) now reads archived.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_get_object,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/object",
            "entry_id": entry.entry_id,
        },
    )
    task_resp = assert_ws_success(conn)["tasks"][0]
    assert task_resp["archived"] is True
    assert task_resp["status"] == MaintenanceStatus.ARCHIVED


async def test_ws_archive_task_already_archived_errors(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    task = build_task_data(last_performed=_days_ago(10), interval_days=30)
    entry = _object_entry_with_task(hass, task, uid="ms_arch_twice")
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_archive_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/archive",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    assert_ws_success(conn)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_archive_task,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/task/archive",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    assert_ws_error(conn, "already_archived")


async def test_ws_archive_task_archives_only_that_task(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Archiving ONE task on a multi-task object must leave the others active
    and the object itself unarchived — task/archive must not cascade (only
    object/archive does). Guards the single-task-only gap in the other tests."""
    entry = _object_entry_two_tasks(hass, uid="ms_arch_one_of_two")
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_archive_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/archive",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    assert_ws_success(conn)

    data = hass.config_entries.async_get_entry(entry.entry_id).data
    assert data[CONF_TASKS][TASK_ID_1].get("archived_at")  # the chosen one
    assert "archived_at" not in data[CONF_TASKS][TASK_ID_2]  # sibling untouched
    assert "archived_at" not in data[CONF_OBJECT]  # object not archived


async def test_ws_unarchive_recurring_task_starts_fresh_cycle(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """D2: unarchiving a recurring task re-anchors last_performed to today
    (next_due = today + interval), not retroactively overdue."""
    task = build_task_data(last_performed=_days_ago(900), interval_days=30)
    entry = _object_entry_with_task(hass, task, uid="ms_unarch_recur")
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_archive_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/archive",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    assert_ws_success(conn)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_unarchive_task,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/task/unarchive",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    assert_ws_success(conn)

    persisted = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert "archived_at" not in persisted
    assert "archived_reason" not in persisted
    # Fresh cycle: last_performed re-anchored to today (dynamic → Store).
    # Compute "today" via dt_util here (in the hass timezone the handler uses),
    # not the module-load _TODAY — those can differ by a day across the test
    # framework's TZ / UTC midnight boundary.
    assert get_task_store_state(hass, entry.entry_id, TASK_ID_1)["last_performed"] == dt_util.now().date().isoformat()

    # Status is no longer archived nor overdue (next_due = today + 30).
    conn = make_ws_connection()
    await call_ws_handler(
        ws_get_object,
        hass,
        conn,
        {
            "id": 3,
            "type": "maintenance_supporter/object",
            "entry_id": entry.entry_id,
        },
    )
    task_resp = assert_ws_success(conn)["tasks"][0]
    assert task_resp["archived"] is False
    assert task_resp["status"] != MaintenanceStatus.ARCHIVED
    assert task_resp["status"] != MaintenanceStatus.OVERDUE


async def test_ws_unarchive_oneoff_stays_done(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """A one-off keeps its terminal 'done' state on unarchive (no re-anchor)."""
    completed = _days_ago(30)
    task = _oneoff_task(last_performed=completed, archived_at=_ts_days_ago(5), archived_reason=ARCHIVE_REASON_MANUAL)
    entry = _object_entry_with_task(hass, task, uid="ms_unarch_oneoff")
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_unarchive_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/unarchive",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    assert_ws_success(conn)

    # last_performed unchanged (one-off NOT re-anchored).
    assert get_task_store_state(hass, entry.entry_id, TASK_ID_1)["last_performed"] == completed


async def test_ws_unarchive_task_not_archived_errors(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    task = build_task_data(last_performed=_days_ago(10), interval_days=30)
    entry = _object_entry_with_task(hass, task, uid="ms_unarch_active")
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_unarchive_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/unarchive",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_1,
        },
    )
    assert_ws_error(conn, "not_archived")


# ═══════════════════════════════════════════════════════════════════════════
# WS — object archive / unarchive (cascade)
# ═══════════════════════════════════════════════════════════════════════════


def _object_entry_two_tasks(hass: HomeAssistant, *, uid: str) -> MockConfigEntry:
    a = build_task_data(task_id=TASK_ID_1, name="A", last_performed=_days_ago(40), interval_days=30)
    b = build_task_data(task_id=TASK_ID_2, name="B", last_performed=_days_ago(40), interval_days=30)
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Appliance",
        data=build_object_entry_data(
            object_data=build_object_data(name="Appliance"),
            tasks={TASK_ID_1: a, TASK_ID_2: b},
        ),
        source="user",
        unique_id=uid,
    )
    entry.add_to_hass(hass)
    return entry


async def test_ws_archive_object_cascades_to_active_tasks(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Archiving an object archives the object AND its active tasks (reason OBJECT),
    while a task archived manually beforehand keeps its own reason."""
    entry = _object_entry_two_tasks(hass, uid="ms_arch_obj_cascade")
    await setup_integration(hass, global_entry, entry)

    # Manually archive B first.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_archive_task,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/task/archive",
            "entry_id": entry.entry_id,
            "task_id": TASK_ID_2,
        },
    )
    assert_ws_success(conn)

    # Archive the object → cascades to the still-active A only.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_archive_object,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/object/archive",
            "entry_id": entry.entry_id,
        },
    )
    payload = assert_ws_success(conn)
    assert payload["archived_at"]

    data = hass.config_entries.async_get_entry(entry.entry_id).data
    assert data[CONF_OBJECT]["archived_at"]
    assert data[CONF_TASKS][TASK_ID_1]["archived_reason"] == ARCHIVE_REASON_OBJECT
    # B keeps the reason it was archived with.
    assert data[CONF_TASKS][TASK_ID_2]["archived_reason"] == ARCHIVE_REASON_MANUAL


async def test_ws_unarchive_object_uncascades_only_object_reason(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Unarchiving an object restores only the tasks IT archived; a manually
    archived task stays archived."""
    entry = _object_entry_two_tasks(hass, uid="ms_unarch_obj_cascade")
    await setup_integration(hass, global_entry, entry)

    # Manually archive B, then archive the object (cascades A as OBJECT).
    for mid, tid in ((1, TASK_ID_2),):
        conn = make_ws_connection()
        await call_ws_handler(
            ws_archive_task,
            hass,
            conn,
            {
                "id": mid,
                "type": "maintenance_supporter/task/archive",
                "entry_id": entry.entry_id,
                "task_id": tid,
            },
        )
        assert_ws_success(conn)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_archive_object,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/object/archive",
            "entry_id": entry.entry_id,
        },
    )
    assert_ws_success(conn)

    # Unarchive the object.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_unarchive_object,
        hass,
        conn,
        {
            "id": 3,
            "type": "maintenance_supporter/object/unarchive",
            "entry_id": entry.entry_id,
        },
    )
    assert_ws_success(conn)

    data = hass.config_entries.async_get_entry(entry.entry_id).data
    assert "archived_at" not in data[CONF_OBJECT]
    # A (object-cascade) restored …
    assert "archived_at" not in data[CONF_TASKS][TASK_ID_1]
    # … B (manual) stays archived.
    assert data[CONF_TASKS][TASK_ID_2]["archived_at"]
    assert data[CONF_TASKS][TASK_ID_2]["archived_reason"] == ARCHIVE_REASON_MANUAL


async def test_ws_archive_object_already_archived_errors(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    entry = _object_entry_two_tasks(hass, uid="ms_arch_obj_twice")
    await setup_integration(hass, global_entry, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_archive_object,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/object/archive",
            "entry_id": entry.entry_id,
        },
    )
    assert_ws_success(conn)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_archive_object,
        hass,
        conn,
        {
            "id": 2,
            "type": "maintenance_supporter/object/archive",
            "entry_id": entry.entry_id,
        },
    )
    assert_ws_error(conn, "already_archived")


# ═══════════════════════════════════════════════════════════════════════════
# Auto-retention sweep
# ═══════════════════════════════════════════════════════════════════════════


async def test_sweep_auto_archives_aged_completed_oneoff(
    hass: HomeAssistant,
) -> None:
    """A completed one-off older than archive_oneoff_days is auto-archived
    (reason AUTO); a fresh one is left active."""
    global_entry = _global_entry_with_archive(hass, archive_days=14)
    aged = _oneoff_task(task_id=TASK_ID_1, name="Aged", last_performed=_days_ago(30))
    fresh = _oneoff_task(task_id=TASK_ID_2, name="Fresh", last_performed=_days_ago(2))
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Sweeper",
        data=build_object_entry_data(
            object_data=build_object_data(name="Sweeper"),
            tasks={TASK_ID_1: aged, TASK_ID_2: fresh},
        ),
        source="user",
        unique_id="ms_sweep_archive",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    await async_run_retention_sweep(hass)
    await hass.async_block_till_done()

    data = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS]
    assert data[TASK_ID_1]["archived_at"]
    assert data[TASK_ID_1]["archived_reason"] == ARCHIVE_REASON_AUTO
    assert "archived_at" not in data[TASK_ID_2]


async def test_sweep_auto_deletes_aged_auto_archive_but_not_manual(
    hass: HomeAssistant,
) -> None:
    """delete_archived_oneoff_days deletes an aged AUTO archive but never a
    manual one."""
    global_entry = _global_entry_with_archive(hass, archive_days=0, delete_days=7)
    auto = _oneoff_task(
        task_id=TASK_ID_1,
        name="AutoOld",
        last_performed=_days_ago(60),
        archived_at=_ts_days_ago(20),
        archived_reason=ARCHIVE_REASON_AUTO,
    )
    manual = _oneoff_task(
        task_id=TASK_ID_2,
        name="ManualOld",
        last_performed=_days_ago(60),
        archived_at=_ts_days_ago(20),
        archived_reason=ARCHIVE_REASON_MANUAL,
    )
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Deleter",
        data=build_object_entry_data(
            object_data=build_object_data(name="Deleter"),
            tasks={TASK_ID_1: auto, TASK_ID_2: manual},
        ),
        source="user",
        unique_id="ms_sweep_delete",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    await async_run_retention_sweep(hass)
    await hass.async_block_till_done()

    tasks = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS]
    assert TASK_ID_1 not in tasks  # auto archive → deleted
    assert TASK_ID_2 in tasks  # manual archive → kept


async def test_sweep_noop_when_disabled(hass: HomeAssistant) -> None:
    """Both thresholds 0 → the sweep changes nothing, even for aged one-offs."""
    global_entry = _global_entry_with_archive(hass, archive_days=0, delete_days=0)
    aged = _oneoff_task(task_id=TASK_ID_1, last_performed=_days_ago(999))
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Idle",
        data=build_object_entry_data(
            object_data=build_object_data(name="Idle"),
            tasks={TASK_ID_1: aged},
        ),
        source="user",
        unique_id="ms_sweep_noop",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    await async_run_retention_sweep(hass)
    await hass.async_block_till_done()

    tasks = hass.config_entries.async_get_entry(entry.entry_id).data[CONF_TASKS]
    assert TASK_ID_1 in tasks
    assert "archived_at" not in tasks[TASK_ID_1]


# ═══════════════════════════════════════════════════════════════════════════
# Inertness — status counts + response exposure
# ═══════════════════════════════════════════════════════════════════════════


async def test_status_counts_exclude_archived_but_keep_cost(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """An archived task drops out of total_tasks + the status buckets, but its
    spent cost still counts toward the cost total (budget is retained)."""
    active = build_task_data(
        task_id=TASK_ID_1,
        name="Active",
        last_performed=_days_ago(60),
        interval_days=30,  # overdue
    )
    archived = _oneoff_task(
        task_id=TASK_ID_2,
        name="Archived",
        last_performed=_days_ago(60),
        archived_at=_ts_days_ago(2),
        archived_reason=ARCHIVE_REASON_MANUAL,
        history=[
            {
                "type": "completed",
                "cost": 50.0,
                "timestamp": _ts_days_ago(60),
            }
        ],
    )
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Counter",
        data=build_object_entry_data(
            object_data=build_object_data(name="Counter"),
            tasks={TASK_ID_1: active, TASK_ID_2: archived},
        ),
        source="user",
        unique_id="ms_counts",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    counts = compute_status_counts(hass)
    assert counts["total_tasks"] == 1  # archived excluded
    assert counts["overdue"] == 1  # only the active task
    # Archived task's spent cost is retained in the cost total.
    assert counts["total_cost"] == 50.0


def test_build_task_summary_exposes_archive_fields(hass: HomeAssistant) -> None:
    archived = {
        "name": "T",
        "type": "custom",
        "archived_at": _ts_days_ago(1),
        "archived_reason": ARCHIVE_REASON_MANUAL,
    }
    res = _build_task_summary(hass, "tid", archived, None)
    assert res["archived"] is True
    assert res["archived_at"] == archived["archived_at"]
    assert res["archived_reason"] == ARCHIVE_REASON_MANUAL

    active = _build_task_summary(hass, "tid", {"name": "T", "type": "custom"}, None)
    assert active["archived"] is False
    assert active["archived_at"] is None


def test_build_object_response_exposes_archive_fields(hass: HomeAssistant) -> None:
    obj = build_object_data(name="Box")
    obj["archived_at"] = _ts_days_ago(1)
    entry = MockConfigEntry(
        version=1,
        minor_version=2,
        domain=DOMAIN,
        title="Box",
        data=build_object_entry_data(object_data=obj, tasks={}),
        source="user",
        unique_id="ms_obj_resp_archive",
    )
    entry.add_to_hass(hass)
    res = _build_object_response(hass, entry, None)
    assert res["object"]["archived"] is True
    assert res["object"]["archived_at"] == obj["archived_at"]
