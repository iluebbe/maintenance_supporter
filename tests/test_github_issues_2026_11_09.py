"""GitHub issues reported 2026-11-08/09.

- #254: a state rule counts the change its sensor made while Home Assistant
  was down (the last real state is on record), and leaves a sensor alone that
  already read so before the restart
- #260: a task that needs its trigger AND its interval is due at the later of
  the two: not overdue while the sensor has not got there, the prediction's
  date when there is one, no lead reminder from the interval alone, the
  calendar on that date; the status twin still weighs the interval leg
- D#256: the repair after a deleted pool owner promises no part move in the
  panel (there is none)
- #257: Pura 1.11's per-slot sensors are found by their own translation key
"""

from __future__ import annotations

from collections.abc import Iterator
from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_capture_events, async_fire_time_changed, async_mock_service

from custom_components.maintenance_supporter.const import (
    CONF_QUIET_HOURS_ENABLED,
    CONF_REMINDER_LEAD_DAYS,
    CONF_TASKS,
    DOMAIN,
    EVENT_NOTIFICATION,
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictionResult, ThresholdPrediction
from custom_components.maintenance_supporter.helpers.status import combined_due, compute_live_status
from custom_components.maintenance_supporter.models.task_result import TaskResult

from .conftest import (
    TASK_ID_1,
    build_task_data,
    make_global_entry,
    make_object_entry,
    set_sensor_state,
    setup_integration,
)


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id).runtime_data.coordinator


def _status(hass: HomeAssistant, entry: MockConfigEntry) -> str:
    return str(_coordinator(hass, entry).data[CONF_TASKS][TASK_ID_1].status)


def _entries(hass: HomeAssistant, entry: MockConfigEntry, kind: str) -> list[dict[str, Any]]:
    history = _coordinator(hass, entry)._get_merged_tasks_data()[TASK_ID_1].get("history") or []
    return [h for h in history if h.get("type") == kind]


async def _refresh(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    await _coordinator(hass, entry).async_refresh()
    await hass.async_block_till_done()


async def _restart(hass: HomeAssistant, entry: MockConfigEntry, *states: str) -> None:
    """Unload, let the sensor move while nothing watches, set up again."""
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    for state in states:
        set_sensor_state(hass, DRUM, state)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    await _refresh(hass, entry)


# ─── #254: a state reached while Home Assistant was down ─────────────────────

DRUM = "binary_sensor.washer_drum_clean_reminder"


async def _drum_task(hass: HomeAssistant, state: str, **extra: Any) -> MockConfigEntry:
    set_sensor_state(hass, DRUM, state)
    trigger = {
        "type": "state_change",
        "entity_id": DRUM,
        "entity_ids": [DRUM],
        "trigger_to_state": "on",
        "trigger_target_changes": 1,
        "auto_complete_on_recovery": True,
        **extra,
    }
    task = build_task_data(name="Clean the drum", schedule_type=ScheduleType.SENSOR_BASED, interval_days=None, trigger_config=trigger)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Washer", uid="washer_254")
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    assert _status(hass, obj) == MaintenanceStatus.OK
    return obj


async def test_254_a_state_reached_during_a_restart_fires_at_the_start(hass: HomeAssistant) -> None:
    obj = await _drum_task(hass, "off")
    await _restart(hass, obj, "on")
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED, "the reminder went on while Home Assistant was down"
    fired = _entries(hass, obj, "triggered")
    assert len(fired) == 1 and fired[0].get("trigger_change", {}).get("from") == "off", fired


async def test_254_a_sensor_unavailable_at_the_start_counts_its_first_real_state(hass: HomeAssistant) -> None:
    """The reporter's case: the source restores unavailable and reports on later."""
    obj = await _drum_task(hass, "off")
    await _restart(hass, obj, "unavailable")
    assert _status(hass, obj) == MaintenanceStatus.OK
    set_sensor_state(hass, DRUM, "on")
    await hass.async_block_till_done()
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    assert len(_entries(hass, obj, "triggered")) == 1


async def test_254_the_state_on_record_follows_the_live_changes(hass: HomeAssistant) -> None:
    """On at the first start (no record: nothing to count), off live, on
    during the restart: the off seen live is what the start compares with."""
    obj = await _drum_task(hass, "on")
    set_sensor_state(hass, DRUM, "off")
    await hass.async_block_till_done()
    await _restart(hass, obj, "on")
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED


async def test_254_a_sensor_already_on_before_the_restart_stays_alone(hass: HomeAssistant) -> None:
    """Completed while the sensor still read on: the restart is no new change."""
    obj = await _drum_task(hass, "off")
    set_sensor_state(hass, DRUM, "on")
    await hass.async_block_till_done()
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED
    await _coordinator(hass, obj).complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    await _restart(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.OK
    assert len(_entries(hass, obj, "triggered")) == 1, "no second activation for the same reading"


async def test_254_a_hold_window_starts_at_the_start(hass: HomeAssistant) -> None:
    """How long the state held while nothing watched is unknown: it has to
    hold for the window from the start on."""
    obj = await _drum_task(hass, "off", trigger_for_minutes=5)
    await _restart(hass, obj, "on")
    assert _status(hass, obj) == MaintenanceStatus.OK, "the window has not run yet"
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=6))
    await hass.async_block_till_done()
    await _refresh(hass, obj)
    assert _status(hass, obj) == MaintenanceStatus.TRIGGERED


# ─── #260: trigger AND interval, due at the later of the two ─────────────────

SALT = "sensor.water_softener_salt"
PREDICT = "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor.async_analyze"


def _day(offset: int) -> str:
    return (dt_util.now().date() + timedelta(days=offset)).isoformat()


def _forecast(days: int) -> SensorPredictionResult:
    return SensorPredictionResult(
        degradation=None,
        threshold_prediction=ThresholdPrediction(
            days_until_threshold=float(days),
            predicted_date=_day(days),
            threshold_value=10.0,
            threshold_direction="below",
            current_value=50.0,
            rate_per_day=-0.5,
            confidence="medium",
        ),
        environmental=None,
    )


@pytest.fixture
def predict() -> Iterator[AsyncMock]:
    """The sensor prediction (none unless a test sets one)."""
    mock = AsyncMock(return_value=None)
    with patch(PREDICT, mock):
        yield mock


async def _salt_task(hass: HomeAssistant, *, done: int = 365, reading: str = "50", **global_kw: Any) -> MockConfigEntry:
    """Done a year ago, a safety interval of 335 days (expired 30 days ago),
    salt to be refilled below 10, and both required."""
    set_sensor_state(hass, SALT, reading)
    trigger = {"type": "threshold", "entity_id": SALT, "entity_ids": [SALT], "trigger_below": 10, "trigger_combinator": "all"}
    task = build_task_data(name="Refill salt", schedule_type=ScheduleType.SENSOR_BASED, interval_days=335, last_performed=_day(-done), trigger_config=trigger)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Water softener", uid="softener_260")
    await setup_integration(hass, make_global_entry(hass, **global_kw), obj)
    await hass.async_block_till_done()
    return obj


def _result(hass: HomeAssistant, entry: MockConfigEntry) -> TaskResult:
    result: TaskResult = _coordinator(hass, entry).data[CONF_TASKS][TASK_ID_1]
    return result


async def test_260_an_expired_interval_without_its_trigger_is_not_overdue(hass: HomeAssistant, predict: AsyncMock) -> None:
    obj = await _salt_task(hass)
    result = _result(hass, obj)
    assert result.status == MaintenanceStatus.OK
    assert result.days_until_due is None and result.next_due is None, "no date: only the sensor can tell now"
    assert result.interval_days_until_due == -30


async def test_260_the_prediction_dates_it(hass: HomeAssistant, predict: AsyncMock) -> None:
    predict.return_value = _forecast(60)
    obj = await _salt_task(hass)
    result = _result(hass, obj)
    assert result.status == MaintenanceStatus.OK
    assert (result.next_due, result.days_until_due) == (_day(60), 60)


async def test_260_an_interval_still_running_keeps_its_date(hass: HomeAssistant, predict: AsyncMock) -> None:
    obj = await _salt_task(hass, done=300)
    assert _result(hass, obj).days_until_due == 35, "the earliest the task can be due"


async def test_260_a_trigger_after_the_interval_is_due_since_it_fired(hass: HomeAssistant, predict: AsyncMock) -> None:
    obj = await _salt_task(hass)
    set_sensor_state(hass, SALT, "5")
    await hass.async_block_till_done()
    await _refresh(hass, obj)
    result = _result(hass, obj)
    assert result.status == MaintenanceStatus.TRIGGERED
    assert result.days_until_due == 0, "due since today, not 30 days overdue"


def test_260_the_status_twin_weighs_the_interval_leg() -> None:
    """A live activation of a task dated by its prediction: the interval leg
    is long met, so the task is triggered at once."""
    result = TaskResult(task={"trigger_config": {"trigger_combinator": "all"}}, days_until_due=60, interval_days_until_due=-30, trigger_active=True)
    assert compute_live_status(result) == MaintenanceStatus.TRIGGERED


def test_260_combined_due_takes_the_later_leg() -> None:
    today = dt_util.now().date()
    past, ahead = today - timedelta(days=30), today + timedelta(days=30)
    assert combined_due(past, trigger_active=False, predicted=None, activated=None, today=today) is None
    assert combined_due(ahead, trigger_active=False, predicted=None, activated=None, today=today) == ahead
    assert combined_due(past, trigger_active=False, predicted=today - timedelta(days=2), activated=None, today=today) == today
    assert combined_due(ahead, trigger_active=False, predicted=today + timedelta(days=5), activated=None, today=today) == ahead
    assert combined_due(past, trigger_active=True, predicted=None, activated=today - timedelta(days=3), today=today) == today - timedelta(days=3)
    assert combined_due(past, trigger_active=True, predicted=None, activated=None, today=today) == past
    assert combined_due(None, trigger_active=True, predicted=None, activated=today, today=today) is None


async def test_260_no_lead_reminder_from_the_interval_alone(hass: HomeAssistant, predict: AsyncMock) -> None:
    from custom_components.maintenance_supporter.daily_jobs import async_maybe_send_lead_reminders
    from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_LEAD_TIME

    async_mock_service(hass, "notify", "test")
    await _salt_task(
        hass,
        done=332,
        notifications_enabled=True,
        notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: False, CONF_REMINDER_LEAD_DAYS: [3]},
    )
    events = async_capture_events(hass, EVENT_NOTIFICATION)
    await async_maybe_send_lead_reminders(hass)
    await hass.async_block_till_done()
    assert not [e for e in events if e.data.get("kind") == KIND_LEAD_TIME], "the salt is not due in 3 days"


async def test_260_the_calendar_shows_the_predicted_date(hass: HomeAssistant, predict: AsyncMock) -> None:
    predict.return_value = _forecast(60)
    await _salt_task(hass)
    calendar = hass.data[DOMAIN]["_calendar_entity"]
    now = dt_util.now()
    events = [e for e in await calendar.async_get_events(hass, now - timedelta(days=1), now + timedelta(days=90)) if "Refill salt" in e.summary]
    assert [e.start for e in events] == [now.date() + timedelta(days=60)]


# ─── D#256: the repair after a pool owner was deleted ────────────────────────


def test_d256_the_moved_parts_repair_promises_no_move_in_the_panel() -> None:
    """There is no action that moves a part to another object; the repair
    told the user to use one."""
    import json
    from pathlib import Path

    comp = Path(__file__).parent.parent / "custom_components" / "maintenance_supporter"
    for path in [comp / "strings.json", *sorted((comp / "translations").glob("*.json"))]:
        description = json.loads(path.read_text(encoding="utf-8"))["issues"]["shared_parts_moved"]["description"]
        second = description.split("\n\n")[1]
        assert "{new_owner}" in second, path.name
        # Who got the parts, and why; nothing to do after it.
        sentences = len([c for c in second if c in ".。।"])
        assert sentences == (2 if path.stem in ("ja", "ko") else 1), f"{path.name}: {second}"
    english = json.loads((comp / "strings.json").read_text(encoding="utf-8"))["issues"]["shared_parts_moved"]["description"]
    assert "panel" not in english.lower()


# ─── #257: the drift report (connectlife, pura, wellbeing) ───────────────────


async def test_257_pura_1_11_slots_are_found_by_their_own_key(hass: HomeAssistant) -> None:
    """Pura 1.11 names each slot's sensor `bay_<n>_fragrance_remaining`
    (one key before). A renamed entity is found by that key alone."""
    from custom_components.maintenance_supporter.helpers.integration_signatures import discover_integration_setups

    from .test_catalog_2026_09_r15bh import Ent, _seed

    await setup_integration(hass, make_global_entry(hass))
    luxe = await _seed(
        hass,
        "pura",
        "luxe",
        "Pura Luxe",
        [
            # Renamed, no name of its own: only the translation key tells.
            Ent("living_room_scent_a", "bay_1_fragrance_remaining", "%", "60"),
            Ent("living_room_scent_d", "bay_4_fragrance_remaining", "%", "20"),
        ],
    )
    setups = {s["device_id"]: s for s in discover_integration_setups(hass)}
    found = sorted(e for t in setups[luxe]["tasks"] for e in t["entity_ids"])
    assert found == ["sensor.living_room_scent_a", "sensor.living_room_scent_d"]
