"""Consistency audit 2026-10-16: what the live lifecycle check and the
screenshot review found where two surfaces told different stories.

1. The countdown sensor's entity_id skipped the area that Home Assistant
   puts in front of a task's other entities when the object is created in
   an area.
3. The summary sensors trailed a skip or a completion by up to ten seconds.
4. A sensor losing 1.4 % a day (40 points a month, past its threshold)
   was classed as a "stable" trend.
7. The integration's calendar put an overdue task on its past due date,
   the panel's Calendar tab on today.
(2, 5 and 6 are docs and panel fixes, covered by the docs tripwires and the
frontend specs.)
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.maintenance_supporter.const import DOMAIN, ScheduleType
from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_task_data,
    make_global_entry,
    make_object_entry,
    set_sensor_state,
    setup_integration,
)


def _days_ago(n: int) -> str:
    return (dt_util.now().date() - timedelta(days=n)).isoformat()


def _task_entities(hass: HomeAssistant, entry: MockConfigEntry, task_id: str) -> dict[str, str]:
    """{kind: entity_id} of one task (status, next_due, days_until_due, overdue, buttons)."""
    out = {}
    for e in er.async_entries_for_config_entry(er.async_get(hass), entry.entry_id):
        if task_id not in e.unique_id:
            continue
        kind = next((k for k in ("next_due", "days_until_due", "overdue", "complete", "skip", "reset") if e.unique_id.endswith("_" + k)), "status")
        out[kind] = e.entity_id
    return out


# ─── 1. the countdown shares the task's prefix ───────────────────────────


@pytest.mark.parametrize("language", ["en", "de"])
async def test_the_countdown_shares_the_prefix_of_an_object_in_an_area(hass: HomeAssistant, language: str) -> None:
    """HA builds a new entity_id from area + device + name. The countdown
    pinned its own id and skipped the area; it now gives only the
    language-independent name part, so the suffix stays _days_until_due in
    every language while the prefix matches the status sensor's."""
    hass.config.language = language
    area = ar.async_get(hass).async_create("Workshop")
    od = build_object_data(name="Lathe")
    od["area_id"] = area.id
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(name="Oil the bed")}, object_data=od, uid="lathe_audit")
    await setup_integration(hass, make_global_entry(hass), obj)

    ids = _task_entities(hass, obj, TASK_ID_1)
    base = ids["status"].removeprefix("sensor.")
    assert base.startswith("workshop_"), f"HA puts the area in front: {ids['status']}"
    assert ids["days_until_due"] == f"sensor.{base}_days_until_due"
    for kind in ("next_due", "overdue", "complete", "skip", "reset"):
        assert ids[kind].split(".", 1)[1].startswith(base), f"{kind}: {ids[kind]} vs {ids['status']}"


async def test_the_countdown_follows_a_custom_entity_slug(hass: HomeAssistant) -> None:
    task = build_task_data(name="Oil the bed")
    task["entity_slug"] = "bed_oil"
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Lathe", uid="lathe_slug")
    await setup_integration(hass, make_global_entry(hass), obj)
    ids = _task_entities(hass, obj, TASK_ID_1)
    assert ids["status"] == "sensor.lathe_bed_oil"
    assert ids["days_until_due"] == "sensor.lathe_bed_oil_days_until_due"


# ─── 3. the summary sensors follow at once ───────────────────────────────


async def test_the_summary_follows_a_second_action_within_a_second(hass: HomeAssistant, freezer: Any) -> None:
    """Two completions in a row: the second one used to wait out HA's
    ten-second request-refresh window before the overdue count moved."""
    late = {"interval_days": 7, "last_performed": _days_ago(10)}
    obj = make_object_entry(
        hass,
        tasks={TASK_ID_1: build_task_data(name="Filter", **late), "task_two": build_task_data(task_id="task_two", name="Belt", **late)},
        name="Lathe",
        uid="lathe_summary",
    )
    await setup_integration(hass, make_global_entry(hass), obj)
    overdue = lambda: hass.states.get("sensor.maintenance_supporter_overdue").state  # noqa: E731
    freezer.tick(timedelta(seconds=30))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert overdue() == "2"

    coordinator = obj.runtime_data.coordinator
    await coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    await coordinator.complete_maintenance("task_two")
    await hass.async_block_till_done()

    freezer.tick(timedelta(seconds=1.5))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert overdue() == "0"


# ─── 4. a steady decline is a trend ──────────────────────────────────────


def _linear(slope_per_day: float, start: float, days: int = 30) -> list[tuple[float, float]]:
    t0 = dt_util.utcnow().timestamp() - days * 86400
    return [(t0 + h * 3600, start + slope_per_day * h / 24) for h in range(days * 24)]


async def test_losing_one_and_a_half_percent_a_day_is_falling(hass: HomeAssistant) -> None:
    """An airflow sensor 95 % → 54 % in a month read "Trend: Stable" next to
    "Threshold exceeded": the significance was a per-day share of the mean."""
    predictor = SensorPredictor(hass)
    points = _linear(-1.4, 95.0)
    plain = await predictor._async_compute_degradation("sensor.airflow", None, 30, points=points)
    assert plain.trend == "falling"
    cycles = predictor._compute_cycle_aware_degradation("sensor.airflow", "up", points)
    assert cycles.trend == "falling"


async def test_a_sensor_that_barely_moves_stays_stable(hass: HomeAssistant) -> None:
    predictor = SensorPredictor(hass)
    deg = await predictor._async_compute_degradation("sensor.pressure", None, 30, points=_linear(-0.01, 15.0))
    assert deg.trend == "stable"


# ─── 7. both calendars put an overdue task on today ──────────────────────


async def test_the_calendar_puts_overdue_and_triggered_tasks_on_today(hass: HomeAssistant) -> None:
    set_sensor_state(hass, "sensor.audit_dp", "9")
    tasks = {
        TASK_ID_1: build_task_data(name="Descale", interval_days=7, last_performed=_days_ago(10)),
        "task_ok": build_task_data(task_id="task_ok", name="Wipe", interval_days=30, last_performed=_days_ago(5)),
        "task_trig": build_task_data(
            task_id="task_trig",
            name="Filter",
            schedule_type=ScheduleType.SENSOR_BASED,
            interval_days=90,
            last_performed=_days_ago(5),
            trigger_config={"type": "threshold", "entity_id": "sensor.audit_dp", "entity_ids": ["sensor.audit_dp"], "trigger_above": 5},
        ),
    }
    obj = make_object_entry(hass, tasks=tasks, name="Espresso", uid="espresso_cal_audit")
    await setup_integration(hass, make_global_entry(hass), obj)
    set_sensor_state(hass, "sensor.audit_dp", "8")
    await hass.async_block_till_done()
    await obj.runtime_data.coordinator.async_refresh()

    calendar = hass.data[DOMAIN]["_calendar_entity"]
    now = dt_util.now()
    events = await calendar.async_get_events(hass, now - timedelta(days=60), now + timedelta(days=60))
    by_task = {name: [e for e in events if f" {name} (" in (e.summary or "")] for name in ("Descale", "Wipe", "Filter")}
    today = dt_util.now().date()

    overdue = by_task["Descale"]
    assert [e.start for e in overdue] == [today], f"overdue sits on today: {[(e.summary, e.start) for e in overdue]}"
    assert overdue[0].description.startswith(f"Due: {(today - timedelta(days=3)).isoformat()}\n")
    triggered = by_task["Filter"]
    assert [e.start for e in triggered] == [today]
    ok = by_task["Wipe"]
    assert [e.start for e in ok] == [today + timedelta(days=25)]
    assert not ok[0].description.startswith("Due:")
