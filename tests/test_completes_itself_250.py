"""D#250 follow-up: a reminder of a task its sensor completes carries no
Complete and no Skip button.

2.120.0 told the rows of the panel and the card ("Completes itself"), but
the push on the phone still offered Complete, Skip and Snooze for the robot
vacuum's water tank — filling the tank is the completion. The rule lives
twice (helpers/completes_itself.py, helpers/completes-itself.ts) and both
read one set of vectors. Snooze stays: it completes nothing.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_QUIET_HOURS_ENABLED,
    DOMAIN,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.completes_itself import completes_itself
from custom_components.maintenance_supporter.helpers.notification_ids import ACTION_PREFIX
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager

from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry, setup_integration
from .task_results import as_results

_VECTORS = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "maintenance_supporter"
    / "frontend-src"
    / "__tests__"
    / "fixtures"
    / "completes-itself-vectors.json"
)

_TANK: dict[str, Any] = {
    "type": "threshold",
    "entity_id": "sensor.vacuum_water_tank",
    "trigger_below": 10,
    "auto_complete_on_recovery": True,
}
_FILTER: dict[str, Any] = {"type": "counter", "entity_id": "sensor.dishwasher_cycles", "trigger_target_value": 30, "auto_complete_on_recovery": True}


def test_the_rule_gives_what_the_panel_gives() -> None:
    """frontend-src/__tests__/completes-itself-vectors.test.ts checks the same
    vectors against completesItself."""
    vectors = json.loads(_VECTORS.read_text(encoding="utf-8"))["vectors"]
    assert len(vectors) > 10
    for v in vectors:
        assert completes_itself(v["trigger_config"], v["trigger_active"]) is v["expected"], v["note"]


def _setup(hass: HomeAssistant, trigger: dict[str, Any]) -> MockConfigEntry:
    make_global_entry(
        hass,
        notifications_enabled=True,
        notify_service="notify.test",
        extra_data={
            CONF_QUIET_HOURS_ENABLED: False,
            CONF_ACTION_COMPLETE_ENABLED: True,
            CONF_ACTION_SKIP_ENABLED: True,
            CONF_ACTION_SNOOZE_ENABLED: True,
        },
    )
    task = build_task_data(task_id=TASK_ID_1, name="Water tank", schedule_type="sensor_based", trigger_config=trigger)
    return make_object_entry(hass, tasks={TASK_ID_1: task}, name="Robot vacuum", unique_id="ms_self_completing_250")


def _verbs(calls: AsyncMock) -> list[str]:
    actions = calls.call_args[0][0].data.get("data", {}).get("actions", [])
    return [a["action"].removeprefix(ACTION_PREFIX).split("_")[0] for a in actions]


async def _send(hass: HomeAssistant, obj: MockConfigEntry, status: str, **kw: Any) -> AsyncMock:
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    mgr = NotificationManager(hass)
    await mgr.async_task_status_changed(
        entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Water tank", object_name="Robot vacuum", new_status=status, **kw
    )
    await hass.async_block_till_done()
    assert calls.called, "the reminder went out"
    return calls


async def test_the_water_tank_reminder_offers_only_snooze(hass: HomeAssistant) -> None:
    obj = _setup(hass, _TANK)
    calls = await _send(hass, obj, MaintenanceStatus.TRIGGERED, trigger_active=True)
    assert _verbs(calls) == ["SNOOZE"], "filling the tank completes it: no Complete, no Skip"


async def test_a_triggered_status_stands_for_an_unknown_trigger_state(hass: HomeAssistant) -> None:
    obj = _setup(hass, _TANK)
    calls = await _send(hass, obj, MaintenanceStatus.TRIGGERED)
    assert _verbs(calls) == ["SNOOZE"]


async def test_due_by_the_safety_interval_keeps_the_buttons(hass: HomeAssistant) -> None:
    """Nothing completes an overdue task whose sensor reads fine."""
    obj = _setup(hass, _TANK)
    calls = await _send(hass, obj, MaintenanceStatus.OVERDUE, days_until_due=-2, trigger_active=False)
    assert _verbs(calls) == ["COMPLETE", "SKIP", "SNOOZE"]


async def test_the_dishwasher_filter_keeps_its_complete_button(hass: HomeAssistant) -> None:
    """A counter only resets on a completion."""
    obj = _setup(hass, _FILTER)
    calls = await _send(hass, obj, MaintenanceStatus.TRIGGERED, trigger_active=True)
    assert _verbs(calls) == ["COMPLETE", "SKIP", "SNOOZE"]


async def test_back_to_ok_on_recovery_keeps_the_buttons(hass: HomeAssistant) -> None:
    obj = _setup(hass, {**_TANK, "auto_complete_on_recovery": False})
    calls = await _send(hass, obj, MaintenanceStatus.TRIGGERED, trigger_active=True)
    assert _verbs(calls) == ["COMPLETE", "SKIP", "SNOOZE"]


async def test_the_coordinator_hands_on_the_live_trigger_state(hass: HomeAssistant) -> None:
    obj = _setup(hass, _TANK)
    await setup_integration(hass, hass.config_entries.async_entries(DOMAIN)[0], obj)
    coordinator = obj.runtime_data.coordinator
    coordinator._previous_statuses = {}
    nm = hass.data[DOMAIN]["_notification_manager"]
    with patch.object(nm, "async_task_status_changed", AsyncMock()) as sent:
        await coordinator._async_notify_status_changes(
            as_results({TASK_ID_1: {"name": "Water tank", "_status": MaintenanceStatus.TRIGGERED, "_trigger_active": True}})
        )
    assert sent.call_args.kwargs["trigger_active"] is True


async def test_the_lead_reminder_follows_the_same_rule(hass: HomeAssistant) -> None:
    obj = _setup(hass, _TANK)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    mgr = NotificationManager(hass)
    await mgr.async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Water tank", "Robot vacuum", days=3, trigger_active=True)
    await hass.async_block_till_done()
    assert _verbs(calls) == ["SNOOZE"]


async def test_the_lead_reminder_of_a_quiet_sensor_keeps_the_buttons(hass: HomeAssistant) -> None:
    obj = _setup(hass, _TANK)
    calls = AsyncMock()
    hass.services.async_register("notify", "test", calls)
    await NotificationManager(hass).async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Water tank", "Robot vacuum", days=3)
    await hass.async_block_till_done()
    assert _verbs(calls) == ["COMPLETE", "SKIP", "SNOOZE"]


async def test_a_compound_with_a_runtime_that_only_or_ends_keeps_the_buttons(hass: HomeAssistant) -> None:
    """OR(pump runtime, pressure): the runtime never ends by itself, so
    nothing completes the task once it fired (DRY audit round 7, BR7-A3)."""
    pump = {
        "type": "compound",
        "compound_logic": "OR",
        "auto_complete_on_recovery": True,
        "conditions": [{"type": "runtime", "entity_id": "binary_sensor.pump"}, {"type": "threshold", "entity_id": "sensor.pressure", "trigger_above": 3}],
    }
    obj = _setup(hass, pump)
    calls = await _send(hass, obj, MaintenanceStatus.TRIGGERED, trigger_active=True)
    assert _verbs(calls) == ["COMPLETE", "SKIP", "SNOOZE"]


def test_one_list_of_the_triggers_that_end_by_themselves() -> None:
    """DRY audit 2026-11-07: the coordinator, the options flow, the triggers
    and the panel dialog each listed which rules end by themselves and so
    may hold the task until it is done. A level is what BaseTrigger holds."""
    from custom_components.maintenance_supporter.entity.triggers import (
        CompoundTrigger,
        CounterTrigger,
        DueDateTrigger,
        RuntimeTrigger,
        StateChangeTrigger,
        ThresholdTrigger,
    )
    from custom_components.maintenance_supporter.helpers.completes_itself import LEVEL_TRIGGER_TYPES, can_hold_until_done

    classes = {"threshold": ThresholdTrigger, "counter": CounterTrigger, "state_change": StateChangeTrigger, "runtime": RuntimeTrigger, "due_date": DueDateTrigger, "compound": CompoundTrigger}
    assert {kind for kind, cls in classes.items() if cls.holds_level} == LEVEL_TRIGGER_TYPES
    assert can_hold_until_done({"type": "threshold", "trigger_below": 10})
    assert can_hold_until_done({"type": "due_date"})
    assert can_hold_until_done({"type": "state_change", "trigger_to_state": "finished"})
    assert not can_hold_until_done({"type": "state_change"}), "any change: a counter, nothing to hold"
    assert not can_hold_until_done({"type": "state_change", "trigger_to_state": "on", "trigger_target_changes": 3})
    assert not can_hold_until_done({"type": "counter", "trigger_target_value": 30})
    assert not can_hold_until_done({"type": "compound", "conditions": [{"type": "threshold"}]}), "a compound holds through its conditions"
