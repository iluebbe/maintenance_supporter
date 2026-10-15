"""A planned monthly or yearly series on the 29th-31st keeps its day.

A short month clamps the date to its last day (31 January + 1 month = 28
February). With the planned anchor that clamped date became the anchor of the
next cycle, and the series stayed on the 28th for good: 31.01. → 28.02. →
28.03. → 28.04. The task now remembers the day of month a clamped anchor
stands for (``planned_day``) and goes back to it: 28.02. → 31.03. → 30.04.
"""

from __future__ import annotations

from datetime import date, datetime

from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.helpers.dates import add_interval
from custom_components.maintenance_supporter.helpers.schedule import Schedule, preview_occurrences
from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask


def _planned(unit: str = "months", every: int = 1) -> Schedule:
    return Schedule.from_dict({"kind": "interval", "every": every, "unit": unit, "anchor": "planned"})


def _iso(dates: list[date]) -> list[str]:
    return [d.isoformat() for d in dates]


def test_the_preview_goes_back_to_the_31st_after_a_short_month() -> None:
    dates, _ = preview_occurrences(_planned(), last_performed=date(2026, 1, 31), today=date(2026, 1, 31), count=6)
    assert _iso(dates) == ["2026-02-28", "2026-03-31", "2026-04-30", "2026-05-31", "2026-06-30", "2026-07-31"]
    dates, _ = preview_occurrences(_planned(), last_performed=date(2026, 1, 30), today=date(2026, 1, 30), count=3)
    assert _iso(dates) == ["2026-02-28", "2026-03-30", "2026-04-30"]
    dates, _ = preview_occurrences(_planned(every=3), last_performed=date(2025, 11, 30), today=date(2025, 11, 30), count=3)
    assert _iso(dates) == ["2026-02-28", "2026-05-30", "2026-08-30"]


def test_a_leap_day_series_comes_back_to_the_29th() -> None:
    dates, _ = preview_occurrences(_planned("years"), last_performed=date(2028, 2, 29), today=date(2028, 2, 29), count=4)
    assert _iso(dates) == ["2029-02-28", "2030-02-28", "2031-02-28", "2032-02-29"]


def test_a_completion_anchored_series_starts_from_the_completion_as_before() -> None:
    """With the completion anchor the completion day IS the anchor: done on
    the 28th, due on the 28th. Nothing to remember there."""
    sched = Schedule.from_dict({"kind": "interval", "every": 1, "unit": "months", "anchor": "completion"})
    dates, _ = preview_occurrences(sched, last_performed=date(2026, 1, 31), today=date(2026, 1, 31), count=3)
    assert _iso(dates) == ["2026-02-28", "2026-03-28", "2026-04-28"]
    assert sched.carry_planned_day(31, date(2026, 2, 28)) is None


def test_carry_planned_day_only_for_a_clamped_month_end() -> None:
    sched = _planned()
    assert sched.carry_planned_day(31, date(2026, 2, 28)) == 31
    assert sched.carry_planned_day(31, date(2026, 4, 30)) == 31
    assert sched.carry_planned_day(31, date(2026, 3, 31)) is None, "the 31st itself needs no memory"
    assert sched.carry_planned_day(31, date(2026, 2, 20)) is None, "not a month end: the grid's day is meant"
    assert sched.carry_planned_day(15, date(2026, 2, 28)) is None, "an earlier day never moves a date later"
    assert sched.carry_planned_day(None, date(2026, 2, 28)) is None
    assert sched.carry_planned_day(40, date(2026, 2, 28)) is None
    assert _planned("weeks").carry_planned_day(31, date(2026, 2, 28)) is None
    assert add_interval(date(2026, 2, 28), 1, "months", day=31) == date(2026, 3, 31)
    assert add_interval(date(2026, 2, 28), 2, "months", day=31) == date(2026, 4, 30)


def _at(freezer, day: str) -> datetime:
    when = dt_util.as_utc(datetime.fromisoformat(f"{day}T09:00:00").replace(tzinfo=dt_util.get_default_time_zone()))
    freezer.move_to(when)
    return when


def test_the_task_keeps_its_day_through_completions_skips_and_a_restore(freezer) -> None:
    task = MaintenanceTask(
        name="Rent",
        interval_days=1,
        interval_unit="months",
        interval_anchor="planned",
        last_performed="2026-01-31",
        last_planned_due="2026-01-31",
    )
    assert task.next_due == date(2026, 2, 28)

    _at(freezer, "2026-02-28")
    task.complete()
    assert (task.last_planned_due, task.planned_day) == ("2026-02-28", 31)
    assert task.next_due == date(2026, 3, 31), "back on the 31st, not the 28th"

    # The day survives a save and a load (the Store, an export).
    task = MaintenanceTask.from_dict(task.to_dict())
    assert task.planned_day == 31 and task.next_due == date(2026, 3, 31)

    _at(freezer, "2026-03-31")
    task.complete()
    assert task.planned_day is None, "on its own day again"
    assert task.next_due == date(2026, 4, 30)

    # A skip advances the same way; an EARLY completion of a clamped date too.
    _at(freezer, "2026-04-30")
    task.skip()
    assert task.planned_day == 31 and task.next_due == date(2026, 5, 31)
    _at(freezer, "2026-05-31")
    task.complete()
    _at(freezer, "2026-06-25")
    task.complete()  # the 30 June occurrence, done five days early
    assert task.next_due == date(2026, 7, 31)

    # A reset starts a fresh cycle: nothing to remember.
    task.planned_day = 31
    task.reset(date(2026, 7, 1))
    assert task.planned_day is None and task.last_planned_due is None


def test_a_malformed_planned_day_is_ignored() -> None:
    for raw in ("31", 0, 32, True, None, 3.5):
        task = MaintenanceTask.from_dict(
            {"name": "x", "interval_days": 1, "interval_unit": "months", "interval_anchor": "planned", "planned_day": raw}
        )
        assert task.planned_day is None, raw


async def test_the_day_survives_the_store_and_a_reload(hass, freezer) -> None:
    """The coordinator writes ``planned_day`` to the Store next to
    ``last_planned_due``; a reload reads it back."""
    from .conftest import build_object_data, build_task_data, get_task_store_state, make_global_entry, make_object_entry, setup_integration

    task = build_task_data(task_id="rent", name="Rent", interval_days=1, last_performed="2026-01-31")
    task.update({"interval_unit": "months", "interval_anchor": "planned", "last_planned_due": "2026-01-31"})
    _at(freezer, "2026-02-28")
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={"rent": task}, name="Flat", uid="flat", object_data=build_object_data(name="Flat", object_id="flat"))
    await setup_integration(hass, g, obj)

    def next_due() -> date | None:
        coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
        return MaintenanceTask.from_dict(coordinator._get_merged_tasks_data()["rent"]).next_due

    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
    await coordinator.complete_maintenance("rent", source="panel")
    await hass.async_block_till_done()
    assert get_task_store_state(hass, obj.entry_id, "rent").get("planned_day") == 31
    assert next_due() == date(2026, 3, 31)

    assert await hass.config_entries.async_reload(obj.entry_id)
    await hass.async_block_till_done()
    assert next_due() == date(2026, 3, 31), "still on the 31st after a reload"

    _at(freezer, "2026-03-31")
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
    await coordinator.skip_maintenance("rent")
    await hass.async_block_till_done()
    assert "planned_day" not in get_task_store_state(hass, obj.entry_id, "rent"), "on its own day: nothing kept"
    assert next_due() == date(2026, 4, 30)


def test_re_anchoring_a_task_forgets_the_day_with_its_planned_anchor() -> None:
    """Pause/resume, unarchive and a deleted last completion start a fresh
    cycle: the planned anchor goes, and the day it stood for with it."""
    from custom_components.maintenance_supporter.helpers.pause import write_anchor

    state = {"last_performed": "2026-02-28", "last_planned_due": "2026-02-28", "planned_day": 31, "due_override": "2026-03-05"}
    write_anchor(state, "2026-03-10")
    assert state == {"last_performed": "2026-03-10"}
