"""The sensor prediction's recorder half is cached per statistics hour.

Every refresh of an object ran a 180-day recorder query per sensor-based
threshold/counter task, so a skip on such an object took ~0.5 s in a real
home (measured 2026-10-15). The cache serves the recorder-derived fit for the
statistics hour, lets a click use the previous hour, and leaves every other
input (thresholds, live values, completions) fresh.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, ScheduleType
from custom_components.maintenance_supporter.helpers.prediction_cache import (
    PredictionCache,
    statistics_hour,
)
from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

from .conftest import build_task_data, make_global_entry, make_object_entry, setup_integration

_FETCH = "custom_components.maintenance_supporter.helpers.sensor_predictor.SensorPredictor._async_fetch_statistics_points"


def _rising(per_hour: float, hours: int = 48) -> list[tuple[float, float]]:
    now = dt_util.utcnow().timestamp()
    return [(now - (hours - 1 - i) * 3600, 10.0 + i * per_hour) for i in range(hours)]


# ─── statistics hour ─────────────────────────────────────────────────────


def test_the_statistics_hour_turns_a_quarter_past() -> None:
    """The recorder compiles an hour minutes after it ends: a fetch at 10:10
    still sees 09:00 as the newest hour and must not be cached as 10:00's."""
    at = datetime(2026, 10, 15, 10, 10, tzinfo=dt_util.UTC)
    assert statistics_hour(at) == statistics_hour(at - timedelta(minutes=50))
    assert statistics_hour(at + timedelta(minutes=6)) == statistics_hour(at) + 1


# ─── the cache itself ────────────────────────────────────────────────────


async def test_one_fetch_per_key_and_hour() -> None:
    cache = PredictionCache()
    fetch = AsyncMock(return_value=[1])
    assert await cache.async_get("k", fetch) == [1]
    assert await cache.async_get("k", fetch) == [1]
    assert fetch.await_count == 1
    assert await cache.async_get("other", AsyncMock(return_value=[2])) == [2]


async def test_the_next_hour_is_fetched(hass: HomeAssistant, freezer: Any) -> None:
    cache = PredictionCache()
    await cache.async_get("k", AsyncMock(return_value=[1]))
    freezer.tick(timedelta(hours=1))
    assert await cache.async_get("k", AsyncMock(return_value=[2])) == [2]


async def test_a_click_takes_the_previous_hour(hass: HomeAssistant, freezer: Any) -> None:
    """A click never waits for the recorder: the old hour's value comes back
    at once and the next periodic refresh fetches the new one."""
    cache = PredictionCache()
    await cache.async_get("k", AsyncMock(return_value=[1]))
    freezer.tick(timedelta(hours=1))
    fetch = AsyncMock(return_value=[2])
    assert await cache.async_get("k", fetch, stale_ok=True) == [1]
    fetch.assert_not_awaited()
    assert await cache.async_get("k", fetch) == [2]
    assert await cache.async_get("k", fetch, stale_ok=True) == [2]
    assert fetch.await_count == 1


async def test_a_click_still_waits_for_a_value_never_fetched() -> None:
    cache = PredictionCache()
    fetch = AsyncMock(return_value=[1])
    assert await cache.async_get("k", fetch, stale_ok=True) == [1]
    assert fetch.await_count == 1


async def test_an_empty_result_is_not_cached(hass: HomeAssistant, freezer: Any) -> None:
    """No statistics yet, or a recorder hiccup: asked again next refresh,
    as without the cache. An hour without a forecast would be a regression,
    and an empty new hour must not leave the old fit standing either."""
    cache = PredictionCache()
    fetch = AsyncMock(return_value=[])
    await cache.async_get("k", fetch)
    await cache.async_get("k", fetch)
    assert fetch.await_count == 2

    await cache.async_get("k", AsyncMock(return_value=[1]))
    freezer.tick(timedelta(hours=1))
    await cache.async_get("k", AsyncMock(return_value=[]))
    again = AsyncMock(return_value=[5])
    assert await cache.async_get("k", again, stale_ok=True) == [5]


async def test_keys_nobody_asks_for_are_dropped(hass: HomeAssistant, freezer: Any) -> None:
    cache = PredictionCache()
    await cache.async_get("old sensor", AsyncMock(return_value=[1]))
    freezer.tick(timedelta(hours=3))
    await cache.async_get("new sensor", AsyncMock(return_value=[2]))
    fetch = AsyncMock(return_value=[9])
    assert await cache.async_get("old sensor", fetch, stale_ok=True) == [9]
    assert fetch.await_count == 1


# ─── the predictor through the cache ─────────────────────────────────────


def _task(**trigger: Any) -> dict[str, Any]:
    return {
        "schedule_type": "sensor_based",
        "trigger_config": {"type": "threshold", "entity_id": "sensor.dp", **trigger},
    }


async def test_a_threshold_edit_applies_without_a_new_query(hass: HomeAssistant) -> None:
    """Only the fit comes from the cache; the threshold is applied fresh."""
    cache = PredictionCache()
    with patch(_FETCH, AsyncMock(return_value=_rising(0.5))) as fetch:
        first = await SensorPredictor(hass, cache=cache).async_analyze(_task(trigger_above=100), {})
        second = await SensorPredictor(hass, cache=cache).async_analyze(_task(trigger_above=200), {})
    assert fetch.await_count == 1
    assert first is not None and first.threshold_prediction is not None
    assert second is not None and second.threshold_prediction is not None
    assert second.threshold_prediction.days_until_threshold > first.threshold_prediction.days_until_threshold


async def test_another_sensor_or_direction_is_fetched_at_once(hass: HomeAssistant) -> None:
    cache = PredictionCache()
    with patch(_FETCH, AsyncMock(return_value=_rising(0.5))) as fetch:
        await SensorPredictor(hass, cache=cache).async_analyze(_task(trigger_above=100), {})
        await SensorPredictor(hass, cache=cache).async_analyze(_task(trigger_below=5), {})
        await SensorPredictor(hass, cache=cache).async_analyze(
            {**_task(trigger_above=100), "trigger_config": {"type": "threshold", "entity_id": "sensor.other", "trigger_above": 100}}, {}
        )
    assert [c.args[0] for c in fetch.await_args_list] == ["sensor.dp", "sensor.dp", "sensor.other"]


async def test_the_environment_reads_its_live_value_fresh(hass: HomeAssistant) -> None:
    """The environmental series is cached; the sensor's current value and the
    completions are not."""
    cache = PredictionCache()
    adaptive = {"environmental_entity": "sensor.outside"}
    hass.states.async_set("sensor.outside", "12")
    with patch(_FETCH, AsyncMock(return_value=_rising(0.5))) as fetch:
        first = await SensorPredictor(hass, cache=cache).async_analyze(_task(trigger_above=100), adaptive)
        hass.states.async_set("sensor.outside", "30")
        second = await SensorPredictor(hass, cache=cache).async_analyze(_task(trigger_above=100), adaptive)
    assert [c.args[0] for c in fetch.await_args_list] == ["sensor.dp", "sensor.outside"]
    assert first is not None and first.environmental is not None and first.environmental.current_value == 12.0
    assert second is not None and second.environmental is not None and second.environmental.current_value == 30.0


async def test_without_a_cache_every_call_queries(hass: HomeAssistant) -> None:
    with patch(_FETCH, AsyncMock(return_value=_rising(0.5))) as fetch:
        await SensorPredictor(hass).async_analyze(_task(trigger_above=100), {})
        await SensorPredictor(hass).async_analyze(_task(trigger_above=100), {})
    assert fetch.await_count == 2


# ─── the coordinator ─────────────────────────────────────────────────────

SENSOR_TASK = "task_sensor"
TIME_TASK = "task_time"


@pytest.fixture
def sensor_object(hass: HomeAssistant) -> tuple[MockConfigEntry, MockConfigEntry]:
    hass.states.async_set("sensor.dp", "20")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    sensor = build_task_data(
        task_id=SENSOR_TASK,
        name="Filter",
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": "threshold", "entity_id": "sensor.dp", "entity_ids": ["sensor.dp"], "trigger_above": 100},
    )
    timed = build_task_data(task_id=TIME_TASK, name="Wipe", last_performed=last, interval_days=30)
    global_entry = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={SENSOR_TASK: sensor, TIME_TASK: timed}, name="Pump", uid="pred_cache")
    return global_entry, obj


async def test_a_skip_does_not_query_the_recorder_again(
    hass: HomeAssistant, sensor_object: tuple[MockConfigEntry, MockConfigEntry], freezer: Any
) -> None:
    """The reported case: a skip on an object with a sensor-predicted task
    re-ran its recorder query. Now the query runs once an hour, from a
    periodic refresh, and never from a click."""
    global_entry, obj = sensor_object
    with patch(_FETCH, AsyncMock(return_value=_rising(0.5))) as fetch:
        await setup_integration(hass, global_entry, obj)
        coordinator = obj.runtime_data.coordinator
        assert fetch.await_count == 1
        rate = coordinator.data[CONF_TASKS][SENSOR_TASK].degradation_rate
        assert rate == pytest.approx(12.0, rel=0.01)

        await coordinator.skip_maintenance(TIME_TASK)
        await coordinator.async_refresh()
        assert fetch.await_count == 1

        fetch.return_value = _rising(1.0)
        freezer.tick(timedelta(hours=1))
        await coordinator.skip_maintenance(TIME_TASK)
        assert fetch.await_count == 1
        assert coordinator.data[CONF_TASKS][SENSOR_TASK].degradation_rate == rate

        await coordinator.async_refresh()
        assert fetch.await_count == 2
        assert coordinator.data[CONF_TASKS][SENSOR_TASK].degradation_rate == pytest.approx(24.0, rel=0.01)
