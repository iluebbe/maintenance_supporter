"""The deferred findings of the bug audit of 2026-11-14 that the prod install
can hit (checked read-only on 2026-11-15):

- S9-4: at a restart the battery fleet read before the battery integrations
  had added their entities, and the low-recovery latch dropped those
  batteries as "no longer in the fleet". Seen live: the fleet task flipped
  triggered → ok → triggered at every restart. A latched battery whose entity
  is registered but has no state yet now counts as unavailable (latched +
  unavailable stays low), with its name, type and quantity kept in the entry.
- A9-1: a completion while the object reloads left the trigger's stored
  progress (hours, baseline, change count) in place, and the task came back
  triggered; the person-facing surfaces answered "Coordinator not found" or
  dropped the tap. The progress is cleared when no sensor runs the triggers,
  and the WS actions, the services and the phone / NFC taps wait out the
  reload.
- A9-4: the double-tap window lived only in the coordinator's memory; a
  second tap after the reload a completion caused was recorded again.
- L9-7: the morning pass (weekly digest, warranty reminder) ran only at
  08:00:00; a start that missed it now makes it up.
"""

from __future__ import annotations

import asyncio
import time
from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_BATTERY_LOW_PERCENT,
    CONF_WEEKLY_DIGEST_ENABLED,
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
)
from custom_components.maintenance_supporter.daily_jobs import _pass_record, async_catch_up_morning_pass
from custom_components.maintenance_supporter.helpers.battery_fleet import LOW_LATCH_KEY, compute_overview
from custom_components.maintenance_supporter.helpers.object_ready import async_wait_object_ready, object_reloading
from custom_components.maintenance_supporter.websocket.tasks_actions import ws_complete_task

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    set_sensor_state,
    setup_integration,
)

PLUS = "sensor.dimmer_battery_plus"
DOOR = "binary_sensor.washer_door"


# ── S9-4 ──────────────────────────────────────────────────────────────────


def _level(hass: HomeAssistant, level: float, *, low: bool) -> None:
    hass.states.async_set(
        PLUS,
        str(level),
        {"device_class": "battery", "battery_type": "AAA", "battery_quantity": 2, "battery_low": low, "battery_low_threshold": 5, "device_name": "Dimmer"},
    )


async def _fleet(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.battery_fleet import ws_battery_fleet_setup

    conn = make_ws_connection()
    await call_ws_handler(ws_battery_fleet_setup, hass, conn, {"id": 1, "type": "x"})
    assert not conn.send_error.called, conn.send_error.call_args


def _latch(hass: HomeAssistant) -> dict[str, Any]:
    from custom_components.maintenance_supporter.helpers.battery_lifetime import fleet_store_and_task

    found = fleet_store_and_task(hass)
    assert found is not None
    store, task_id = found
    return dict(store.get_task_state(task_id).get(LOW_LATCH_KEY) or {})


async def test_a_latched_battery_not_back_after_a_restart_stays_low(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, minor_version=6, options={CONF_BATTERY_LOW_PERCENT: 5})
    await setup_integration(hass, g)
    er.async_get(hass).async_get_or_create("sensor", "battery_notes", "dimmer_plus", suggested_object_id="dimmer_battery_plus")
    _level(hass, 4, low=True)
    await _fleet(hass)
    assert compute_overview(hass).low_count == 1
    # The entry keeps what the row needs while the entity has no state.
    assert {k: _latch(hass)[PLUS][k] for k in ("name", "type", "quantity")} == {"name": "Dimmer", "type": "AAA", "quantity": 2}

    # A restart: Battery Notes has not added its entity yet.
    hass.states.async_remove(PLUS)
    ov = compute_overview(hass)
    assert ov.low_count == 1, "the episode survives a battery that is not back yet"
    (row,) = ov.low
    assert (row["entity_id"], row["latched"]) == (PLUS, True)
    assert dict(ov.needs_now) == {"AAA": 2}, "the shopping need stays the battery's own"
    assert PLUS in _latch(hass)

    # Back at 22 %: above the floor (5), below the recovery (50) — still low.
    _level(hass, 22, low=False)
    assert compute_overview(hass).low_count == 1


async def test_a_battery_gone_from_the_registry_leaves_the_fleet(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, minor_version=6, options={CONF_BATTERY_LOW_PERCENT: 5})
    await setup_integration(hass, g)
    _level(hass, 4, low=True)  # a state-only entity: no registry entry
    await _fleet(hass)
    assert compute_overview(hass).low_count == 1
    hass.states.async_remove(PLUS)
    assert compute_overview(hass).low_count == 0
    assert PLUS not in _latch(hass)


# ── A9-1 ──────────────────────────────────────────────────────────────────


def _counting_task() -> dict[str, Any]:
    return build_task_data(
        schedule_type="sensor_based",
        interval_days=None,
        trigger_config={"type": "state_change", "entity_id": DOOR, "entity_ids": [DOOR], "trigger_target_changes": 5},
    )


async def test_a_completion_while_no_sensor_runs_the_triggers_ends_their_progress(hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch) -> None:
    set_sensor_state(hass, DOOR, "off")
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _counting_task()})
    await setup_integration(hass, g, obj)
    coordinator = obj.runtime_data.coordinator
    store = obj.runtime_data.store
    store.set_trigger_runtime(TASK_ID_1, DOOR, {"change_count": 4, "last_state": "off"})
    # The object reloads: its task sensor is gone (nobody hears the reset
    # signal), the new one is not added yet.
    host = coordinator._trigger_hosts.pop(TASK_ID_1)
    monkeypatch.setattr("custom_components.maintenance_supporter.coordinator.async_dispatcher_send", MagicMock())
    try:
        await coordinator.complete_maintenance(TASK_ID_1)
        assert store.get_trigger_runtime(TASK_ID_1) == {}, "the next trigger starts fresh, like a reset"
    finally:
        coordinator._trigger_hosts[TASK_ID_1] = host


async def test_a_completion_with_its_sensor_running_resets_as_before(hass: HomeAssistant) -> None:
    set_sensor_state(hass, DOOR, "off")
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _counting_task()})
    await setup_integration(hass, g, obj)
    for state in ("on", "off", "on"):
        set_sensor_state(hass, DOOR, state)
        await hass.async_block_till_done()
    store = obj.runtime_data.store
    assert store.get_trigger_runtime(TASK_ID_1, DOOR).get("change_count") == 3
    await obj.runtime_data.coordinator.complete_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    runtime = store.get_trigger_runtime(TASK_ID_1, DOOR)
    assert runtime.get("change_count") == 0 and runtime.get("last_state") == "on", "the sensor's own reset, its last state kept"


async def test_an_action_waits_out_a_reload_of_its_object(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30)})
    await setup_integration(hass, g, obj)
    assert object_reloading(hass, obj.entry_id) is False
    await obj.setup_lock.acquire()
    try:
        assert object_reloading(hass, obj.entry_id) is True
        conn = make_ws_connection()
        call = hass.async_create_task(
            call_ws_handler(ws_complete_task, hass, conn, {"id": 1, "type": "maintenance_supporter/task/complete", "entry_id": obj.entry_id, "task_id": TASK_ID_1})
        )
        await asyncio.sleep(0.3)
        assert not conn.send_result.called and not conn.send_error.called, "it waits while the object reloads"
    finally:
        obj.setup_lock.release()
    await call
    assert conn.send_result.called and not conn.send_error.called


async def test_an_object_that_is_not_loaded_is_not_waited_for(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN, data=build_object_entry_data(object_data=build_object_data(name="Off")), unique_id="off")
    entry.add_to_hass(hass)
    started = time.monotonic()
    await async_wait_object_ready(hass, entry.entry_id)
    await async_wait_object_ready(hass, "no-such-entry")
    assert time.monotonic() - started < 0.5


# ── A9-4 ──────────────────────────────────────────────────────────────────


async def test_a_second_tap_after_a_reload_is_the_same_completion(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30)})
    await setup_integration(hass, g, obj)
    coordinator = obj.runtime_data.coordinator

    def completions() -> int:
        return sum(1 for h in coordinator.merged_task(TASK_ID_1)["history"] if h["type"] == "completed")

    await coordinator.complete_maintenance(TASK_ID_1)
    assert completions() == 1
    # A reload hands out a coordinator that started after the completion.
    coordinator._recent_manual_completions.clear()
    coordinator._started_at = dt_util.utcnow() + timedelta(seconds=1)
    await coordinator.complete_maintenance(TASK_ID_1)
    assert completions() == 1, "the second tap inside the window is the same action"
    # A reset ends the window, as it does in memory.
    await coordinator.reset_maintenance(TASK_ID_1)
    coordinator._started_at = dt_util.utcnow() + timedelta(seconds=1)
    await coordinator.complete_maintenance(TASK_ID_1)
    assert completions() == 2


async def test_the_same_coordinator_judges_its_own_completions_from_memory(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30)})
    await setup_integration(hass, g, obj)
    coordinator = obj.runtime_data.coordinator
    await coordinator.complete_maintenance(TASK_ID_1)
    coordinator._recent_manual_completions.clear()
    await coordinator.complete_maintenance(TASK_ID_1)
    assert sum(1 for h in coordinator.merged_task(TASK_ID_1)["history"] if h["type"] == "completed") == 2


# ── L9-7 ──────────────────────────────────────────────────────────────────


def _overdue_object(hass: HomeAssistant) -> MockConfigEntry:
    lp = (dt_util.now().date() - timedelta(days=60)).isoformat()
    return make_object_entry(hass, tasks={TASK_ID_1: build_task_data(interval_days=30, last_performed=lp)})


def _mock_nm(hass: HomeAssistant) -> MagicMock:
    nm = MagicMock()
    nm.async_send_weekly_digest = AsyncMock()
    nm.async_send_warranty_reminder = AsyncMock()
    nm.async_send_lead_reminder = AsyncMock()
    hass.data.setdefault(DOMAIN, {})[NOTIFICATION_MANAGER_KEY] = nm
    return nm


@pytest.mark.parametrize("last", ["2026-06-29", None, "2026-07-06"])
async def test_a_start_after_eight_makes_up_the_missed_morning_pass(hass: HomeAssistant, freezer: Any, last: str | None) -> None:
    freezer.move_to("2026-07-06 16:00:00+00:00")  # Monday 09:00 in the tests' US/Pacific
    g = make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data={CONF_WEEKLY_DIGEST_ENABLED: True})
    await setup_integration(hass, g, _overdue_object(hass))
    nm = _mock_nm(hass)
    record = _pass_record(hass)
    if last is not None:
        await record.async_mark(last)
    else:
        record._loaded, record._day = True, None

    await async_catch_up_morning_pass(hass)
    if last == "2026-06-29":
        nm.async_send_weekly_digest.assert_awaited_once()
    else:
        # None: the first start of this version keeps the day and sends
        # nothing (the version before may have sent it at 08:00); today: done.
        nm.async_send_weekly_digest.assert_not_awaited()
    assert await record.async_last_day() == "2026-07-06"

    nm.async_send_weekly_digest.reset_mock()
    await async_catch_up_morning_pass(hass)
    nm.async_send_weekly_digest.assert_not_awaited()


async def test_a_start_before_eight_leaves_the_pass_to_the_timer(hass: HomeAssistant, freezer: Any) -> None:
    freezer.move_to("2026-07-06 14:00:00+00:00")  # Monday 07:00 Pacific
    g = make_global_entry(hass, notifications_enabled=True, notify_service="notify.test", extra_data={CONF_WEEKLY_DIGEST_ENABLED: True})
    await setup_integration(hass, g, _overdue_object(hass))
    nm = _mock_nm(hass)
    await _pass_record(hass).async_mark("2026-06-29")
    await async_catch_up_morning_pass(hass)
    nm.async_send_weekly_digest.assert_not_awaited()
    assert await _pass_record(hass).async_last_day() == "2026-06-29"
