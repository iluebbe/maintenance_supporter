"""Bug audit 2026-10-17: the findings in changes not released yet.

- Editing a compound trigger in the options flow removed the task's safety
  interval: the compound steps show no interval field, and the "cleared
  field" rule (2026-10-16, G5) read its absence as cleared. The rebuild
  also dropped the trigger/interval combinator, and the logic field always
  showed AND, so a stored OR flipped.
- The dismissal went to Companion phones only (2026-10-16, N2), so a notify
  group of phones was never cleared any more.
- The counter's reset confirmation (2026-10-16, T5) holds the trigger's
  state for a reading under the baseline; the refresh fallback read the same
  reading as "not reached" and ended the episode.

Each docstring names the failure, so a red test says which bug came back.
"""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, PropertyMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import async_mock_service

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, ScheduleType

from .conftest import build_task_data
from .test_bug_audit_2026_10_16_t2 import TASK, _advanced_global, _default, _live, _open_trigger_edit, _setup, _task

# ─── N-1: the options flow's compound edit ──────────────────────────────


async def _configure(hass: HomeAssistant, result: dict[str, Any], user_input: dict[str, Any]) -> dict[str, Any]:
    return await hass.config_entries.options.async_configure(result["flow_id"], user_input)


async def test_editing_a_compound_trigger_keeps_the_safety_interval(hass: HomeAssistant) -> None:
    """Finishing the compound steps removed the 90-day interval (the task
    became trigger-only), reset "trigger and interval" to "whichever first"
    and showed AND for a stored OR."""
    hass.states.async_set("sensor.pressure", "1.2")
    hass.states.async_set("sensor.flow", "10")
    tc = {
        "type": "compound",
        "compound_logic": "OR",
        "trigger_combinator": "all",
        "conditions": [
            {"type": "threshold", "entity_id": "sensor.pressure", "entity_ids": ["sensor.pressure"], "trigger_below": 1.0},
            {"type": "threshold", "entity_id": "sensor.flow", "entity_ids": ["sensor.flow"], "trigger_below": 2.0},
        ],
    }
    task = build_task_data(task_id=TASK, name="Filter", schedule_type=ScheduleType.SENSOR_BASED, interval_days=90, trigger_config=tc)
    entry = await _setup(hass, {TASK: task}, global_entry=_advanced_global(hass))
    before = _live(hass, entry).data[CONF_TASKS][TASK]["schedule"]
    assert before.get("interval") == 90 or before.get("every") == 90 or "90" in str(before)

    result = await _open_trigger_edit(hass, entry)
    result = await _configure(hass, result, {"next_step_id": "edit_trigger_proceed"})
    result = await _configure(hass, result, {"trigger_entity": ["sensor.pressure"]})
    result = await _configure(hass, result, {"trigger_attribute": "_state"})
    result = await _configure(hass, result, {"trigger_type": "compound"})
    assert result["step_id"] == "compound_logic"
    assert _default(result, "compound_logic") == "or"
    result = await _configure(hass, result, {"compound_logic": "or"})
    for entity, below in (("sensor.pressure", 0.9), ("sensor.flow", 1.5)):
        result = await _configure(hass, result, {"trigger_entity": [entity]})
        result = await _configure(hass, result, {"trigger_type": "threshold"})
        result = await _configure(hass, result, {"trigger_below": below})
        assert result["step_id"] == "compound_review"
        if entity == "sensor.pressure":
            result = await _configure(hass, result, {"compound_action": "add"})
    result = await _configure(hass, result, {"compound_action": "finish"})
    assert result["type"] == FlowResultType.MENU

    stored = _live(hass, entry).data[CONF_TASKS][TASK]
    assert stored["schedule"] == before, "the safety interval was removed"
    new_tc = stored["trigger_config"]
    assert new_tc["compound_logic"] == "OR"
    assert new_tc.get("trigger_combinator") == "all"
    assert [c["trigger_below"] for c in new_tc["conditions"]] == [0.9, 1.5]


# ─── N-4: a notify group of phones ──────────────────────────────────────


async def test_a_notify_group_is_cleared_on_its_phones(hass: HomeAssistant) -> None:
    """Sent to the group, "clear_notification" reached its Telegram member as
    text (N2); skipped, the reminder stayed on every phone of the group."""
    from custom_components.maintenance_supporter.const import NOTIFICATION_MANAGER_KEY

    phone_a = async_mock_service(hass, "notify", "mobile_app_a")
    phone_b = async_mock_service(hass, "notify", "mobile_app_b")
    telegram = async_mock_service(hass, "notify", "telegram_family")
    assert await async_setup_component(
        hass,
        "notify",
        {
            "notify": [
                {"platform": "group", "name": "family", "services": [{"action": "mobile_app_a"}, {"action": "telegram_family"}, {"action": "kids"}]},
                {"platform": "group", "name": "kids", "services": [{"action": "mobile_app_b"}, {"action": "mobile_app_gone"}]},
            ]
        },
    )
    await hass.async_block_till_done()
    assert hass.services.has_service("notify", "family")
    await _setup(hass, {TASK: _task()})
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    with (
        patch.object(type(nm), "notify_service", new_callable=PropertyMock, return_value="notify.family"),
        patch.object(nm, "_user_services", AsyncMock(return_value=["notify.mobile_app_a"])),
    ):
        await nm.async_dismiss_task_notification(TASK)
        await hass.async_block_till_done()
    clear = {"message": "clear_notification", "data": {"tag": f"maintenance_{TASK}"}}
    assert [c.data for c in phone_a] == [clear], "once, though in the group and the person's own"
    assert [c.data for c in phone_b] == [clear], "a nested group's phone"
    assert telegram == []


def test_an_unreadable_group_clears_nothing(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.notification_manager import _companion_phones

    class Broken:
        _service_name = "family"

        @property
        def entities(self) -> list[Any]:
            raise RuntimeError("another core")

    hass.data["notify_services"] = {"group": [Broken()]}
    assert _companion_phones(hass, "notify.family") == []
    assert _companion_phones(hass, "telegram.family") == []
    assert _companion_phones(hass, "notify.unknown") == []


# ─── T-3: the counter fallback under the baseline ───────────────────────


def test_the_fallback_has_no_verdict_under_the_counter_baseline() -> None:
    """The live trigger keeps its state for a reading under the baseline
    until the reset is confirmed; the fallback read it as "not reached",
    flipped the task to OK in the window, and a confirmed reset then found
    no episode to recover from (no auto-completion)."""
    from custom_components.maintenance_supporter.helpers.trigger_fallback import evaluate_counter

    tc = {"type": "counter", "trigger_delta_mode": True, "trigger_target_value": 500, "_trigger_state": {"sensor.odo": {"baseline_value": 1000}}}

    def reading(value: str) -> Any:
        return lambda _eid: type("S", (), {"state": value, "attributes": {}})()

    assert evaluate_counter(reading("3"), tc, ["sensor.odo"]).active is None
    assert evaluate_counter(reading("1600"), tc, ["sensor.odo"]).active is True
    assert evaluate_counter(reading("1200"), tc, ["sensor.odo"]).active is False
