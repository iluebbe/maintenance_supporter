"""#150 per-task skip lock + #149 runtime per-session cap.

The lock is enforced in ``coordinator.skip_maintenance`` — the choke point
every surface funnels through (WS, voice, vacation preview) — and stored
minimally (only ``allow_skip: False`` is persisted; absence = allowed).

The session cap protects against sensors stuck ON: a single session books at
most ``trigger_runtime_max_session_seconds``, across the 5-minute persist
windows AND in the fallback evaluator.
"""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import AsyncMock, MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    last_performed = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(last_performed=last_performed)
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        unique_id="maintenance_supporter_pool_pump_skip_lock",
    )
    entry.add_to_hass(hass)
    return entry


# ─── #150: skip lock ───────────────────────────────────────────────────────


async def test_allow_skip_stored_only_when_false(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    """Minimal persistence: False is stored, True/None clears the key."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    await setup_integration(hass, global_entry, object_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {"id": 1, "type": "x", "entry_id": object_entry.entry_id, "task_id": TASK_ID_1, "allow_skip": False},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    assert object_entry.data[CONF_TASKS][TASK_ID_1]["allow_skip"] is False

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {"id": 2, "type": "x", "entry_id": object_entry.entry_id, "task_id": TASK_ID_1, "allow_skip": True},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    assert "allow_skip" not in object_entry.data[CONF_TASKS][TASK_ID_1]


async def test_create_persists_lock_and_summary_exposes_it(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task

    await setup_integration(hass, global_entry, object_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task,
        hass,
        conn,
        {"id": 1, "type": "x", "entry_id": object_entry.entry_id, "name": "No-skip task", "allow_skip": False},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    new_id = next(tid for tid, td in object_entry.data[CONF_TASKS].items() if td["name"] == "No-skip task")
    assert object_entry.data[CONF_TASKS][new_id]["allow_skip"] is False

    # The WS summary exposes the flag (the #50 rule) — and defaults to True.
    from custom_components.maintenance_supporter.websocket import _build_task_summary

    assert _build_task_summary(hass, new_id, object_entry.data[CONF_TASKS][new_id], None)["allow_skip"] is False
    assert _build_task_summary(hass, TASK_ID_1, object_entry.data[CONF_TASKS][TASK_ID_1], None)["allow_skip"] is True


async def test_skip_refused_when_locked_and_allowed_after_unlock(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    """The WS surface returns its own error code; the task stays untouched."""
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_skip_task
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    await setup_integration(hass, global_entry, object_entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {"id": 1, "type": "x", "entry_id": object_entry.entry_id, "task_id": TASK_ID_1, "allow_skip": False},
    )

    conn = make_ws_connection()
    await call_ws_handler(
        ws_skip_task,
        hass,
        conn,
        {"id": 2, "type": "x", "entry_id": object_entry.entry_id, "task_id": TASK_ID_1},
    )
    assert conn.send_error.called
    assert conn.send_error.call_args[0][1] == "skip_disabled"
    assert not conn.send_result.called

    # Unlock → the same skip goes through.
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {"id": 3, "type": "x", "entry_id": object_entry.entry_id, "task_id": TASK_ID_1, "allow_skip": True},
    )
    conn = make_ws_connection()
    await call_ws_handler(
        ws_skip_task,
        hass,
        conn,
        {"id": 4, "type": "x", "entry_id": object_entry.entry_id, "task_id": TASK_ID_1},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    assert conn.send_result.call_args[0][1] == {"success": True}


async def test_coordinator_choke_point_raises(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    """Every surface funnels through the coordinator — voice included."""
    await setup_integration(hass, global_entry, object_entry)

    tasks = dict(object_entry.data[CONF_TASKS])
    tasks[TASK_ID_1] = {**tasks[TASK_ID_1], "allow_skip": False}
    hass.config_entries.async_update_entry(object_entry, data={**object_entry.data, CONF_TASKS: tasks})

    coordinator = object_entry.runtime_data.coordinator
    with pytest.raises(ServiceValidationError):
        await coordinator.skip_maintenance(task_id=TASK_ID_1)


# ─── #149: runtime per-session cap ─────────────────────────────────────────


def _runtime_trigger(hass: HomeAssistant, cap: int | None):
    from custom_components.maintenance_supporter.entity.triggers.runtime import RuntimeTrigger

    config = {
        "type": "runtime",
        "entity_id": "switch.toothbrush",
        "trigger_runtime_hours": 6.0,
        **({"trigger_runtime_max_session_seconds": cap} if cap else {}),
    }
    return RuntimeTrigger(hass, MagicMock(), config)


async def test_session_cap_survives_persist_window_resets(hass: HomeAssistant) -> None:
    """The 5-minute periodic persist resets on_since — the cap must not reset
    with it, or a stuck sensor books capped slices window after window."""
    trig = _runtime_trigger(hass, cap=150)
    start = dt_util.utcnow()

    # Window 1: 5 minutes pass, periodic persist accumulates and re-anchors.
    trig._on_since_dt = start
    trig._accumulate_elapsed(start + timedelta(minutes=5))
    assert trig._accumulated_seconds == 150.0  # capped, not 300

    # Window 2 (the periodic callback re-anchors on_since): nothing left.
    trig._on_since_dt = start + timedelta(minutes=5)
    trig._accumulate_elapsed(start + timedelta(minutes=10))
    assert trig._accumulated_seconds == 150.0

    # Live view is capped too, while still "running".
    trig._on_since_dt = dt_util.utcnow() - timedelta(hours=8)
    assert trig._get_current_runtime_hours() == pytest.approx(150.0 / 3600.0)


async def test_short_sessions_book_real_time_and_cap_resets_per_session(hass: HomeAssistant) -> None:
    trig = _runtime_trigger(hass, cap=150)
    start = dt_util.utcnow()

    # Session 1: 2 minutes — under the cap, books the real 120 s.
    trig._on_since_dt = start
    trig._accumulate_elapsed(start + timedelta(minutes=2))
    trig._on_since_dt = None
    trig._session_booked = 0.0  # what every session-end site does

    # Session 2: stuck overnight — books only the cap.
    trig._on_since_dt = start
    trig._accumulate_elapsed(start + timedelta(hours=9))
    assert trig._accumulated_seconds == 120.0 + 150.0

    # Uncapped trigger keeps today's behaviour.
    free = _runtime_trigger(hass, cap=None)
    free._on_since_dt = start
    free._accumulate_elapsed(start + timedelta(hours=9))
    assert free._accumulated_seconds == 9 * 3600.0


async def test_reset_starts_a_fresh_session_for_the_cap(hass: HomeAssistant) -> None:
    """Bug review 2026-09-04: completing the task resets the runtime and
    re-anchors on_since for a still-ON entity ("fresh start") — but the
    per-session booking stayed at the cap, so the follow-up session could
    not book a single second until the entity turned off."""
    trig = _runtime_trigger(hass, cap=150)
    start = dt_util.utcnow()

    # Session 1 runs into the cap while still ON.
    trig._on_since_dt = start
    trig._accumulate_elapsed(start + timedelta(minutes=10))
    assert trig._accumulated_seconds == 150.0
    assert trig._session_booked == 150.0

    # Completion → reset while the entity is still ON.
    trig._coordinator.async_persist_trigger_runtime = AsyncMock()
    trig.reset()
    await hass.async_block_till_done()
    assert trig._accumulated_seconds == 0.0
    assert trig._session_booked == 0.0

    # The fresh session books real time up to the cap again.
    anchor = trig._on_since_dt
    assert anchor is not None
    trig._accumulate_elapsed(anchor + timedelta(minutes=2))
    assert trig._accumulated_seconds == 120.0
    trig._accumulate_elapsed(anchor + timedelta(hours=9))
    assert trig._accumulated_seconds == 150.0


async def test_fallback_evaluator_mirrors_the_cap(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.trigger_fallback import evaluate_runtime

    on_since = (dt_util.utcnow() - timedelta(hours=8)).isoformat()
    tc = {
        "type": "runtime",
        "trigger_runtime_hours": 1.0,
        "trigger_runtime_max_session_seconds": 150,
        "_trigger_state": {
            "switch.toothbrush": {
                "accumulated_seconds": 600.0,
                "on_since": on_since,
                "session_booked_seconds": 100.0,
            }
        },
    }
    result = evaluate_runtime(tc, ["switch.toothbrush"])
    # 600 booked + at most (150 - 100) ongoing = 650 s — NOT 600 + 8 h.
    assert result.current_value == pytest.approx(650.0 / 3600.0, abs=0.01)
    assert result.active is False

    # Without the cap the same state books the full 8 hours.
    tc.pop("trigger_runtime_max_session_seconds")
    uncapped = evaluate_runtime(tc, ["switch.toothbrush"])
    assert uncapped.current_value > 8.0
    assert uncapped.active is True


async def test_cap_validation_rejects_bad_values(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    await setup_integration(hass, global_entry, object_entry)

    for bad in (0, -5, 1.5, 100_000, "abc"):
        conn = make_ws_connection()
        await call_ws_handler(
            ws_update_task,
            hass,
            conn,
            {
                "id": 1,
                "type": "x",
                "entry_id": object_entry.entry_id,
                "task_id": TASK_ID_1,
                "trigger_config": {
                    "type": "runtime",
                    "entity_id": "switch.pump",
                    "trigger_runtime_hours": 10,
                    "trigger_runtime_max_session_seconds": bad,
                },
            },
        )
        assert conn.send_error.called, f"{bad!r} was accepted"
        assert conn.send_error.call_args[0][1] == "invalid_trigger_config"

    # A numeric string is coerced and stored as int (the sibling fields' rule).
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_task,
        hass,
        conn,
        {
            "id": 2,
            "type": "x",
            "entry_id": object_entry.entry_id,
            "task_id": TASK_ID_1,
            "trigger_config": {
                "type": "runtime",
                "entity_id": "switch.pump",
                "trigger_runtime_hours": 10,
                "trigger_runtime_max_session_seconds": "150",
            },
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    tc = object_entry.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert tc["trigger_runtime_max_session_seconds"] == 150
