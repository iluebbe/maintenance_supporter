"""Journey backlog batch 4: single-task biographies over time.

B5 one task through the whole reminder ladder (ok → due_soon → overdue →
completed → next cycle) on a moving clock, C2 recurrence-type odyssey
(time ↔ sensor switches in sequence), L2 adaptive learning re-learns from
corrected history. See docs/design/user-journeys.md.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.websocket.tasks_crud import (
    ws_update_task,
)
from custom_components.maintenance_supporter.websocket.tasks_history import (
    ws_update_history_entry,
)

from .conftest import (
    make_ws_connection as _conn,
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)




def _make_entry(hass: HomeAssistant, unique_id: str, task: dict[str, Any]) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Biography Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Biography Object"),
            tasks={task["id"]: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── B5: one task's full reminder biography on a moving clock ────────────────


async def test_reminder_ladder_over_a_full_cycle(hass: HomeAssistant, freezer) -> None:
    """ok → (day 8) due_soon reminder → same-day refresh stays silent →
    (day 11) overdue reminder → complete → the NEXT cycle reminds again.
    Real repeat gating — no interval patching, the clock actually moves."""
    # 18:00 UTC = late morning in the test hass's US/Pacific default timezone
    # — safely outside the 22:00–07:00 local quiet hours.
    freezer.move_to("2026-08-03 18:00:00+00:00")

    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(notifications_enabled=True, notify_service="notify.mobile_app"),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    today = dt_util.now().date().isoformat()
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Water plants",
        interval_days=10,
        warning_days=3,
        last_performed=today,
    )
    obj_entry = _make_entry(hass, "b5_ladder", task)

    calls: list[dict[str, Any]] = []

    async def handler(call: Any) -> None:
        calls.append(dict(call.data))

    hass.services.async_register("notify", "mobile_app", handler)

    await setup_integration(hass, global_entry, obj_entry)
    await hass.async_block_till_done()
    coordinator = obj_entry.runtime_data.coordinator
    assert not calls, "a healthy task produced a notification at setup"

    async def _advance_to(day_offset: int) -> None:
        freezer.move_to(f"2026-08-{3 + day_offset:02d} 18:00:00+00:00")
        await coordinator.async_refresh()
        await hass.async_block_till_done()

    # Day 8: inside the 3-day warning window → the due-soon reminder.
    await _advance_to(8)
    assert len(calls) == 1, "due_soon transition did not notify"
    assert "Water plants" in str(calls[0])

    # Same day, second refresh: the repeat gate keeps it silent.
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert len(calls) == 1, "repeat gate failed — duplicate due_soon reminder"

    # Day 11: past due → the overdue reminder.
    await _advance_to(11)
    assert len(calls) == 2, "overdue transition did not notify"

    # The user completes; the ladder resets without a further push.
    await coordinator.complete_maintenance(task_id=TASK_ID_1)
    await hass.async_block_till_done()
    push_count = len(calls)

    # Next cycle, day 11+8: the due-soon reminder fires AGAIN — the cycle
    # re-armed instead of staying muted by the previous cycle's bookkeeping.
    await _advance_to(19)
    assert len(calls) == push_count + 1, "second cycle never reminded"


# ─── C2: recurrence-type odyssey — time ↔ sensor and back ────────────────────


async def test_schedule_type_switches_in_sequence(
    hass: HomeAssistant,
) -> None:
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    last = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, name="Filter", interval_days=30, last_performed=last)
    obj_entry = _make_entry(hass, "c2_switch", task)
    hass.states.async_set("sensor.c2_pressure", "5")
    await setup_integration(hass, global_entry, obj_entry)
    coordinator = obj_entry.runtime_data.coordinator

    async def _status() -> str:
        listed = await hass.services.async_call(
            DOMAIN,
            "list_tasks",
            {"entry_id": obj_entry.entry_id},
            blocking=True,
            return_response=True,
        )
        return str(listed["tasks"][0]["status"])

    assert await _status() == "ok"

    # 1. time_based → sensor_based (keep the interval as a safety net).
    await call_ws_handler(
        ws_update_task,
        hass,
        _conn(),
        {
            "id": 1,
            "type": "maintenance_supporter/task/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "schedule_type": "sensor_based",
            "trigger_config": {
                "type": "threshold",
                "entity_id": "sensor.c2_pressure",
                "trigger_above": 30,
            },
        },
    )
    await hass.async_block_till_done()
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert await _status() in ("ok", "due_soon")  # not triggered at 5

    # 2. The sensor crosses the threshold → triggered.
    hass.states.async_set("sensor.c2_pressure", "42")
    await hass.async_block_till_done()
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert await _status() == "triggered"

    # 3. Back to time_based; the trigger is removed and the trigger state
    #    must not haunt the task ("triggered" forever would be the bug).
    await call_ws_handler(
        ws_update_task,
        hass,
        _conn(),
        {
            "id": 2,
            "type": "maintenance_supporter/task/update",
            "entry_id": obj_entry.entry_id,
            "task_id": TASK_ID_1,
            "schedule_type": "time_based",
            "interval_days": 30,
            "trigger_config": None,
        },
    )
    await hass.async_block_till_done()
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    status = await _status()
    assert status != "triggered", "removed trigger still drives the status"
    assert status in ("ok", "due_soon")  # 20 of 30 days elapsed


# ─── L2: adaptive learning re-learns from corrected history ──────────────────


async def test_adaptive_suggestion_follows_history_correction(
    hass: HomeAssistant,
) -> None:
    """The interval analyzer reads the merged history on every refresh — a
    D1-style timestamp correction must move the suggestion, not leave it
    frozen on the pre-correction data."""
    global_entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    global_entry.add_to_hass(hass)

    today = dt_util.now().date()

    def _entry_at(days_ago: int) -> dict[str, Any]:
        d = (today - timedelta(days=days_ago)).isoformat()
        return {"timestamp": f"{d}T10:00:00", "type": "completed"}

    # Completions every ~10 days (the wrong, fat-fingered record).
    task = build_task_data(
        task_id=TASK_ID_1,
        name="Descale",
        interval_days=30,
        last_performed=(today - timedelta(days=10)).isoformat(),
        history=[_entry_at(40), _entry_at(30), _entry_at(20), _entry_at(10)],
    )
    # feedback_count gates the recommendation (it counts live completions);
    # deliberately NO stored smoothed_interval — the analyzer then derives the
    # EWA from history, which is the path a correction must flow through.
    task["adaptive_config"] = {
        "enabled": True,
        "min_interval_days": 1,
        "feedback_count": 6,
    }
    obj_entry = _make_entry(hass, "l2_adaptive", task)
    await setup_integration(hass, global_entry, obj_entry)
    coordinator = obj_entry.runtime_data.coordinator
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    # The suggestion is a confidence-weighted blend of the configured 30 and
    # the observed ~10-day spacing — the exact value depends on the blend,
    # the journey claim is the DIRECTION: pulled well below the base…
    before = coordinator.data["tasks"][TASK_ID_1]["_suggested_interval"]
    assert before is not None and before < 30, f"10-day spacing should pull the suggestion below 30, got {before}"

    # The correction: the two middle completions were logged on wrong dates —
    # in truth the spacing was ~20 days (entries at -40/-20 stay, -30 → -21,
    # -10 → -1). Move them via the history-edit command the panel uses.
    conn = _conn()
    for original_days_ago, corrected_days_ago in ((30, 21), (10, 1)):
        orig = _entry_at(original_days_ago)["timestamp"]
        new = _entry_at(corrected_days_ago)["timestamp"]
        await call_ws_handler(
            ws_update_history_entry,
            hass,
            conn,
            {
                "id": original_days_ago,
                "type": "maintenance_supporter/task/history/update",
                "entry_id": obj_entry.entry_id,
                "task_id": TASK_ID_1,
                "original_timestamp": orig,
                "timestamp": new,
            },
        )
    await hass.async_block_till_done()
    await coordinator.async_refresh()
    await hass.async_block_till_done()

    after = coordinator.data["tasks"][TASK_ID_1]["_suggested_interval"]
    assert after is not None and after > before, f"suggestion did not re-learn: before={before}, after={after}"
