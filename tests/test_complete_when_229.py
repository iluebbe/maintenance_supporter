"""D#229: a task completes itself when another entity changes to a state
(``complete_when``), and a single-shot state-change latch can hold until the
task is done (``trigger_hold_until_done``). Pins:

- the change rule: only a real change INTO the state counts, not the entity
  appearing or coming back from unavailable; states compare case-insensitive
- the rule's shape (sanitize), which tasks listen, the WS create / update and
  the summary
- the washer: "finished" then "off" holds the task, the door opening
  completes it (automatic, source ``auto_entity``, a note naming the door);
  a held latch survives a reload
- only while due: the change completes a due task and leaves an OK one alone
- the validator refuses the hold together with auto-complete on recovery on
  the single-shot state change it acts on, and never stores it in a compound
- a rename and a device swap follow the entity
- a real new state-change episode right after a completion shows at once
  (it waited out the ten-minute post-completion cooldown before)
- a state-change recovery's note no longer ends in "(0)"
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock

from homeassistant.core import HomeAssistant, State
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_capture_events

from custom_components.maintenance_supporter.const import CONF_TASKS, EVENT_TASK_COMPLETED
from custom_components.maintenance_supporter.helpers.complete_when import completes, rules_by_entity
from custom_components.maintenance_supporter.helpers.device_swap import move_tasks_to_device
from custom_components.maintenance_supporter.helpers.entity_rename import rewrite_task
from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields, sanitize_complete_when
from custom_components.maintenance_supporter.websocket.tasks_validation import _validate_trigger_config

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_task_data,
    make_global_entry,
    make_object_entry,
    setup_integration,
)

WASHER = "sensor.washer"
DOOR = "binary_sensor.washer_door"
RULE = {"entity_id": DOOR, "to_state": "on"}


# ─── the change rule and the rule's shape ───────────────────────────────────


def test_only_a_real_change_into_the_state_counts() -> None:
    def s(state: str) -> State:
        return State(DOOR, state)

    assert completes("on", s("off"), s("on"))
    assert completes(" On ", s("off"), s("on")), "trimmed, case-insensitive"
    assert not completes("on", None, s("on")), "the entity appearing"
    assert not completes("on", s("unavailable"), s("on")), "a sensor reconnecting after a restart"
    assert not completes("on", s("unknown"), s("on"))
    assert not completes("on", s("on"), s("on")), "an attribute-only change"
    assert not completes("on", s("on"), s("off"))
    assert not completes("on", s("off"), None)
    assert not completes("on", s("off"), s("unavailable"))


def test_the_rule_shape() -> None:
    assert sanitize_complete_when({"entity_id": f" {DOOR} ", "to_state": " on "}) == RULE
    for bad in (
        None,
        "binary_sensor.washer_door",
        {},
        {"entity_id": "door", "to_state": "on"},
        {"entity_id": DOOR},
        {"entity_id": DOOR, "to_state": "  "},
        {"entity_id": DOOR, "to_state": "x" * 256},
        {"entity_id": 3, "to_state": "on"},
    ):
        assert sanitize_complete_when(bad) is None, bad
    task: dict[str, Any] = {"name": "x", "complete_when": {"entity_id": "door", "to_state": "on"}}
    cap_task_fields(task)
    assert "complete_when" not in task, "the config-flow path drops a malformed rule"


def test_which_tasks_listen() -> None:
    tasks = {
        "a": {"complete_when": RULE},
        "b": {"enabled": False, "complete_when": RULE},
        "c": {"complete_when": {"entity_id": DOOR, "to_state": "off"}},
        "d": {"complete_when": {"entity_id": "nonsense", "to_state": "on"}},
        "e": {},
    }
    assert rules_by_entity(tasks, {}) == {DOOR: [("a", "on"), ("c", "off")]}


# ─── the washer ─────────────────────────────────────────────────────────────


async def _washer(hass: HomeAssistant, **trigger: Any) -> MockConfigEntry:
    hass.states.async_set(WASHER, "off")
    hass.states.async_set(DOOR, "off", {"friendly_name": "Washer door"})
    task = build_task_data(
        name="Empty the washer",
        schedule_type="sensor_based",
        interval_days=None,
        trigger_config={"type": "state_change", "entity_id": WASHER, "entity_ids": [WASHER], "trigger_to_state": "finished", **trigger},
    )
    obj = make_object_entry(hass, tasks={TASK_ID_1: {**task, "complete_when": RULE}}, name="Washer", uid="washer_229")
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    return obj


async def _set(hass: HomeAssistant, entity_id: str, state: str) -> None:
    hass.states.async_set(entity_id, state, {"friendly_name": "Washer door"} if entity_id == DOOR else {})
    await hass.async_block_till_done()


def _status(obj: MockConfigEntry, task_id: str = TASK_ID_1) -> str:
    return str(obj.runtime_data.coordinator.data[CONF_TASKS][task_id].status)


def _entries(obj: MockConfigEntry, kind: str, task_id: str = TASK_ID_1) -> list[dict[str, Any]]:
    history = obj.runtime_data.coordinator._get_merged_tasks_data()[task_id].get("history") or []
    return [h for h in history if h.get("type") == kind]


async def test_the_washer_holds_until_the_door_opens(hass: HomeAssistant) -> None:
    obj = await _washer(hass, trigger_hold_until_done=True)
    events = async_capture_events(hass, EVENT_TASK_COMPLETED)

    await _set(hass, DOOR, "on")
    await _set(hass, DOOR, "off")
    assert not _entries(obj, "completed"), "the door opening while the task is OK records nothing"

    await _set(hass, WASHER, "running")
    await _set(hass, WASHER, "finished")
    assert _status(obj) == "triggered"
    await _set(hass, WASHER, "off")
    assert _status(obj) == "triggered", "held: the laundry is still inside"
    await _set(hass, WASHER, "finished")
    await _set(hass, WASHER, "off")
    assert len(_entries(obj, "triggered")) == 1, "a second wash while held is the same episode"

    await _set(hass, DOOR, "on")
    assert _status(obj) == "ok"
    done = _entries(obj, "completed")
    assert len(done) == 1
    assert done[0]["notes"] == "Auto-completed: Washer door changed to on"
    assert events[-1].data["source"] == "auto_entity"


async def test_a_held_latch_survives_a_reload(hass: HomeAssistant) -> None:
    obj = await _washer(hass, trigger_hold_until_done=True)
    await _set(hass, WASHER, "running")
    await _set(hass, WASHER, "finished")
    await _set(hass, WASHER, "off")
    assert _status(obj) == "triggered"
    await hass.config_entries.async_reload(obj.entry_id)
    await hass.async_block_till_done()
    assert _status(obj) == "triggered", "the persisted latch holds although the washer reads off"
    await _set(hass, DOOR, "on")
    assert _status(obj) == "ok"


async def test_without_hold_the_task_ends_with_the_state(hass: HomeAssistant) -> None:
    obj = await _washer(hass)
    await _set(hass, WASHER, "running")
    await _set(hass, WASHER, "finished")
    assert _status(obj) == "triggered"
    await _set(hass, WASHER, "off")
    assert _status(obj) == "ok"
    await _set(hass, DOOR, "on")
    assert not _entries(obj, "completed"), "nothing was due any more"


async def test_a_state_change_recovery_note_has_no_count(hass: HomeAssistant) -> None:
    obj = await _washer(hass, auto_complete_on_recovery=True)
    await _set(hass, WASHER, "running")
    await _set(hass, WASHER, "finished")
    await _set(hass, WASHER, "off")
    assert [h["notes"] for h in _entries(obj, "completed")] == ["Auto-completed: sensor recovered"]


async def test_a_new_episode_right_after_a_completion_shows_at_once(hass: HomeAssistant) -> None:
    obj = await _washer(hass)
    coordinator = obj.runtime_data.coordinator
    await _set(hass, WASHER, "running")
    await _set(hass, WASHER, "finished")
    await coordinator.complete_maintenance(TASK_ID_1, notes="emptied")
    await hass.async_block_till_done()
    assert _status(obj) == "ok"

    await _set(hass, WASHER, "running")
    await _set(hass, WASHER, "finished")
    await coordinator.async_refresh()
    await hass.async_block_till_done()
    assert _status(obj) == "triggered", "a real new edge, not the completed one"
    assert len(_entries(obj, "triggered")) == 2


# ─── only while due ─────────────────────────────────────────────────────────


async def test_only_a_due_task_completes(hass: HomeAssistant) -> None:
    today = dt_util.now().date()
    hass.states.async_set(DOOR, "off", {"friendly_name": "Descaler"})
    due = build_task_data(task_id=TASK_ID_1, name="Descale", interval_days=30, last_performed=(today - timedelta(days=40)).isoformat())
    fresh = build_task_data(task_id=TASK_ID_2, name="Wipe", interval_days=30, last_performed=today.isoformat())
    obj = make_object_entry(
        hass,
        tasks={TASK_ID_1: {**due, "complete_when": RULE}, TASK_ID_2: {**fresh, "complete_when": RULE}},
        name="Coffee machine",
        uid="coffee_229",
    )
    await setup_integration(hass, make_global_entry(hass), obj)
    await hass.async_block_till_done()
    assert _status(obj, TASK_ID_1) == "overdue"
    assert _status(obj, TASK_ID_2) == "ok"

    hass.states.async_set(DOOR, "unavailable")
    await hass.async_block_till_done()
    hass.states.async_set(DOOR, "on", {"friendly_name": "Descaler"})
    await hass.async_block_till_done()
    assert not _entries(obj, "completed", TASK_ID_1), "a sensor coming back is no change"

    hass.states.async_set(DOOR, "off", {"friendly_name": "Descaler"})
    await hass.async_block_till_done()
    hass.states.async_set(DOOR, "on", {"friendly_name": "Descaler"})
    await hass.async_block_till_done()
    assert [h["notes"] for h in _entries(obj, "completed", TASK_ID_1)] == ["Auto-completed: Descaler changed to on"]
    assert not _entries(obj, "completed", TASK_ID_2), "an OK task is left alone"


# ─── WS ─────────────────────────────────────────────────────────────────────


async def test_ws_create_update_and_summary(hass: HomeAssistant, hass_ws_client: Any) -> None:
    obj = make_object_entry(hass, tasks={}, name="Washer", uid="washer_229_ws")
    await setup_integration(hass, make_global_entry(hass), obj)
    client = await hass_ws_client(hass)

    async def send(**msg: Any) -> dict[str, Any]:
        await client.send_json_auto_id(msg)
        res: dict[str, Any] = await client.receive_json()
        await hass.async_block_till_done()
        return res

    res = await send(
        type="maintenance_supporter/task/create",
        entry_id=obj.entry_id,
        name="Empty the washer",
        interval_days=7,
        complete_when={"entity_id": f" {DOOR} ", "to_state": " on "},
    )
    assert res["success"], res
    task_id = res["result"]["task_id"]
    assert obj.data[CONF_TASKS][task_id]["complete_when"] == RULE

    summary = await send(type="maintenance_supporter/object", entry_id=obj.entry_id)
    assert summary["result"]["tasks"][0]["complete_when"] == RULE

    bad = await send(type="maintenance_supporter/task/update", entry_id=obj.entry_id, task_id=task_id, complete_when={"entity_id": "door"})
    assert not bad["success"] and bad["error"]["code"] == "invalid_input"
    assert obj.data[CONF_TASKS][task_id]["complete_when"] == RULE, "a refused update changes nothing"

    cleared = await send(type="maintenance_supporter/task/update", entry_id=obj.entry_id, task_id=task_id, complete_when=None)
    assert cleared["success"], cleared
    assert "complete_when" not in obj.data[CONF_TASKS][task_id]


# ─── the hold in the validator ──────────────────────────────────────────────


def test_hold_only_on_a_single_shot_state_change() -> None:
    hass = MagicMock()
    hass.states.get.return_value = None
    latch = {"type": "state_change", "entity_id": WASHER, "trigger_to_state": "finished"}

    tc = {**latch, "trigger_hold_until_done": "yes"}
    errors, _ = _validate_trigger_config(hass, tc)
    assert not errors and tc["trigger_hold_until_done"] is True

    tc = {**latch, "trigger_hold_until_done": False}
    errors, _ = _validate_trigger_config(hass, tc)
    assert not errors and "trigger_hold_until_done" not in tc, "absence is off"

    tc = {**latch, "trigger_hold_until_done": True, "auto_complete_on_recovery": True}
    errors, _ = _validate_trigger_config(hass, tc)
    assert any("trigger_hold_until_done" in e for e in errors)

    # Inert anywhere else, kept like the other type-specific keys — and no
    # conflict there: a counter or a threshold recovers as before.
    for other in (
        {**latch, "trigger_target_changes": 3},
        {"type": "state_change", "entity_id": WASHER},
        {"type": "threshold", "entity_id": WASHER, "trigger_below": 3},
    ):
        tc = {**other, "trigger_hold_until_done": True, "auto_complete_on_recovery": True}
        errors, _ = _validate_trigger_config(hass, tc)
        assert not errors and tc["trigger_hold_until_done"] is True, other

    compound = {
        "type": "compound",
        "trigger_hold_until_done": True,
        "conditions": [{**latch, "trigger_hold_until_done": True}, {"type": "threshold", "entity_id": "sensor.x", "trigger_below": 1}],
    }
    errors, _ = _validate_trigger_config(hass, compound)
    assert not errors
    assert "trigger_hold_until_done" not in compound and "trigger_hold_until_done" not in compound["conditions"][0]


# ─── the entity moves ───────────────────────────────────────────────────────


def test_a_rename_follows_the_entity() -> None:
    task = {"name": "x", "complete_when": RULE}
    new, changed = rewrite_task(task, DOOR, "binary_sensor.washer_door_2")
    assert changed and new["complete_when"] == {"entity_id": "binary_sensor.washer_door_2", "to_state": "on"}
    _, changed = rewrite_task(task, "binary_sensor.other", "binary_sensor.other_2")
    assert not changed


async def test_a_device_swap_moves_the_door_with_the_washer(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain="demo")
    entry.add_to_hass(hass)
    dev_reg, ent_reg = dr.async_get(hass), er.async_get(hass)
    old = dev_reg.async_get_or_create(config_entry_id=entry.entry_id, identifiers={("demo", "old_washer")})
    new = dev_reg.async_get_or_create(config_entry_id=entry.entry_id, identifiers={("demo", "new_washer")})
    other = dev_reg.async_get_or_create(config_entry_id=entry.entry_id, identifiers={("demo", "contact")})
    old_door = ent_reg.async_get_or_create("binary_sensor", "demo", "old_door", device_id=old.id, original_name="Door")
    new_door = ent_reg.async_get_or_create("binary_sensor", "demo", "new_door", device_id=new.id, original_name="Door")
    contact = ent_reg.async_get_or_create("binary_sensor", "demo", "contact", device_id=other.id, original_name="Contact")

    tasks = {
        "on_device": {"complete_when": {"entity_id": old_door.entity_id, "to_state": "on"}},
        "elsewhere": {"complete_when": {"entity_id": contact.entity_id, "to_state": "on"}},
    }
    moved, _ = move_tasks_to_device(hass, tasks, {old.id}, new.id, user_id=None)
    assert moved["on_device"]["complete_when"] == {"entity_id": new_door.entity_id, "to_state": "on"}
    assert moved["elsewhere"]["complete_when"]["entity_id"] == contact.entity_id, "another device's sensor stays"
    assert tasks["on_device"]["complete_when"]["entity_id"] == old_door.entity_id, "the input is not changed"
