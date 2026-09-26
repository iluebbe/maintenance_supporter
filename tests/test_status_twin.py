"""The model status and its dict twin are ONE ladder (DRY review 2026-09-12).

``MaintenanceTask.status`` and ``helpers.status.compute_status_from_task_dict``
(the entities' recomputation from the coordinator payload after a live
trigger update) both delegate to ``helpers.status.compute_status``. The twin
used to omit the span-capped warning window (#58) and the sub-day
``schedule_time`` refinement, and neither knew that a disabled task reads OK.
Pinned here: model and helper agree for time-based with the span cap, for
schedule_time on the due day, for a disabled task, for a trigger (both
combinators) and for archived — and the twin reproduces the coordinator's
own ``_status`` for every task it publishes.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import CONF_ADVANCED_SCHEDULE_TIME, CONF_TASKS, MaintenanceStatus
from custom_components.maintenance_supporter.helpers.status import (
    compute_status,
    compute_status_from_task_dict,
    effective_warning_days,
    is_past_schedule_time,
)
from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

from .conftest import TASK_ID_1, TASK_ID_2, build_task_data, make_global_entry, make_object_entry, setup_integration


def _payload(task: MaintenanceTask) -> dict[str, Any]:
    """What the coordinator publishes for the twin (the live fields)."""
    data = task.to_dict()
    data["_days_until_due"] = task.days_until_due
    data["_warning_days_effective"] = task.effective_warning_days
    data["_trigger_active"] = task._trigger_active
    return data


def _agree(task: MaintenanceTask, expected: MaintenanceStatus) -> None:
    assert task.status == expected
    assert compute_status_from_task_dict(_payload(task)) == expected


def _days_ago(n: int) -> str:
    return (dt_util.now().date() - timedelta(days=n)).isoformat()


def test_span_capped_warning_window_agrees() -> None:
    """A 5-day task postponed 10 days out: the 14-day warning is capped below
    the 5-day span, so the task reads OK — in the model AND the twin (which
    used to compare against the raw 14 and say DUE_SOON)."""
    data = build_task_data(interval_days=5, warning_days=14, last_performed=_days_ago(1))
    data["due_override"] = (dt_util.now().date() + timedelta(days=10)).isoformat()
    task = MaintenanceTask.from_dict(data)
    assert task.days_until_due == 10
    assert task.effective_warning_days == 4
    _agree(task, MaintenanceStatus.OK)
    # A payload without the published cap falls back to the raw window —
    # the drift the coordinator field closes.
    stale = _payload(task)
    del stale["_warning_days_effective"]
    assert compute_status_from_task_dict(stale) == MaintenanceStatus.DUE_SOON
    assert effective_warning_days(14, 5) == 4
    assert effective_warning_days(14, None) == 14
    assert effective_warning_days(14, 0) == 14
    # Bug audit 2026-09-26: a weekly task with the default 7-day warning is
    # not "due soon" on the day it was completed; a daily one only on the day.
    assert effective_warning_days(7, 7) == 6
    assert effective_warning_days(7, 1) == 0
    weekly = MaintenanceTask.from_dict(build_task_data(interval_days=7, warning_days=7, last_performed=_days_ago(0)))
    _agree(weekly, MaintenanceStatus.OK)
    _agree(MaintenanceTask.from_dict(build_task_data(interval_days=7, warning_days=7, last_performed=_days_ago(1))), MaintenanceStatus.DUE_SOON)


def test_time_based_ladder_agrees() -> None:
    _agree(MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=7, last_performed=_days_ago(10))), MaintenanceStatus.OK)
    _agree(MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=7, last_performed=_days_ago(25))), MaintenanceStatus.DUE_SOON)
    _agree(MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=7, last_performed=_days_ago(40))), MaintenanceStatus.OVERDUE)
    _agree(MaintenanceTask.from_dict(build_task_data(interval_days=None, schedule_type="manual")), MaintenanceStatus.OK)


def test_schedule_time_on_the_due_day_agrees(freezer: Any) -> None:
    # 20:00 UTC is early afternoon in US/Pacific (the test default zone) and
    # late evening in CEST: "06:00" is past and "23:30" still ahead in any of them.
    freezer.move_to("2026-06-15 20:00:00+00:00")
    due_today = build_task_data(interval_days=30, warning_days=7, last_performed=_days_ago(30), schedule_time="06:00")
    task = MaintenanceTask.from_dict(due_today)
    assert task.days_until_due == 0
    _agree(task, MaintenanceStatus.OVERDUE)
    later = MaintenanceTask.from_dict({**due_today, "schedule_time": "23:30"})
    _agree(later, MaintenanceStatus.DUE_SOON)
    assert is_past_schedule_time("06:00") and not is_past_schedule_time("23:30")
    assert not is_past_schedule_time(None) and not is_past_schedule_time("nonsense")


def test_disabled_task_reads_ok_in_both() -> None:
    task = MaintenanceTask.from_dict(build_task_data(interval_days=30, warning_days=7, last_performed=_days_ago(90), enabled=False))
    _agree(task, MaintenanceStatus.OK)
    task._trigger_active = True
    _agree(task, MaintenanceStatus.OK)


def test_triggered_agrees_for_both_combinators() -> None:
    fresh = build_task_data(interval_days=30, warning_days=7, last_performed=_days_ago(1), trigger_config={"type": "threshold"})
    task = MaintenanceTask.from_dict(fresh)
    task._trigger_active = True
    _agree(task, MaintenanceStatus.TRIGGERED)
    # "all": trigger AND elapsed interval — a fresh task stays OK, a due one trips.
    all_fresh = MaintenanceTask.from_dict({**fresh, "trigger_config": {"type": "threshold", "trigger_combinator": "all"}})
    all_fresh._trigger_active = True
    _agree(all_fresh, MaintenanceStatus.OK)
    all_due = MaintenanceTask.from_dict({**fresh, "last_performed": _days_ago(31), "trigger_config": {"type": "threshold", "trigger_combinator": "all"}})
    _agree(all_due, MaintenanceStatus.OK)  # elapsed alone never actions an "all" task
    all_due._trigger_active = True
    _agree(all_due, MaintenanceStatus.TRIGGERED)


def test_archived_and_paused_precedence() -> None:
    task = MaintenanceTask.from_dict({**build_task_data(interval_days=30, last_performed=_days_ago(90)), "archived_at": "2026-01-01T00:00:00+00:00"})
    task._trigger_active = True
    _agree(task, MaintenanceStatus.ARCHIVED)
    paused = _payload(MaintenanceTask.from_dict(build_task_data(interval_days=30, last_performed=_days_ago(90))))
    paused["_paused"] = True
    assert compute_status_from_task_dict(paused) == MaintenanceStatus.PAUSED
    # Disabled wins over archived — the coordinator's short-circuit order.
    assert compute_status(archived=True, enabled=False, days_until_due=-5, trigger_active=True, all_mode=False, warning_days=7, past_schedule_time=False) == MaintenanceStatus.OK


async def test_twin_reproduces_the_coordinator_status(hass: HomeAssistant) -> None:
    """For every task the coordinator publishes, the twin recomputes the very
    same ``_status`` from the payload alone."""
    g = make_global_entry(hass)
    hass.config_entries.async_update_entry(g, options={CONF_ADVANCED_SCHEDULE_TIME: True})
    tasks = {
        TASK_ID_1: build_task_data(interval_days=5, warning_days=14, last_performed=_days_ago(1)),
        TASK_ID_2: build_task_data(task_id=TASK_ID_2, name="Due", interval_days=30, warning_days=7, last_performed=_days_ago(30), schedule_time="00:00"),
        "t3": build_task_data(task_id="t3", name="Off", interval_days=30, last_performed=_days_ago(90), enabled=False),
        "t4": build_task_data(task_id="t4", name="Soon", interval_days=30, warning_days=7, last_performed=_days_ago(25)),
    }
    tasks[TASK_ID_1]["due_override"] = (dt_util.now().date() + timedelta(days=10)).isoformat()
    obj = make_object_entry(hass, tasks=tasks, name="Twin", uid="status_twin")
    await setup_integration(hass, g, obj)
    published = obj.runtime_data.coordinator.data[CONF_TASKS]
    assert published[TASK_ID_1]["_status"] == MaintenanceStatus.OK  # span cap
    assert published[TASK_ID_2]["_status"] == MaintenanceStatus.OVERDUE  # due today, past 00:00
    assert published["t3"]["_status"] == MaintenanceStatus.OK  # disabled
    assert published["t4"]["_status"] == MaintenanceStatus.DUE_SOON
    for task_id, payload in published.items():
        assert compute_status_from_task_dict(payload) == payload["_status"], task_id
