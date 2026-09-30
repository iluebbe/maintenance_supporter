"""The household intents (voice package C, 2026-09-30) and voice undo.

Readings, notes, whose turn, shopping, bought parts, low batteries — the
things people said to a satellite once "what is due" worked — and "undo
that", because a misheard name hits the wrong task and a satellite has no
history editor.

Driven through ``intent.async_handle``, the entry point both the classic and
the LLM agents use.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import patch

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, MAX_TEXT_LENGTH
from custom_components.maintenance_supporter.intent import (
    INTENT_ADD_NOTE,
    INTENT_BOUGHT_PART,
    INTENT_COMPLETE_TASK,
    INTENT_LOW_BATTERIES,
    INTENT_POSTPONE_TASK,
    INTENT_RECORD_READING,
    INTENT_SHOPPING_LIST,
    INTENT_SKIP_TASK,
    INTENT_SNOOZE_TASK,
    INTENT_UNDO,
    INTENT_WHOSE_TURN,
    async_setup_intents,
)

from .conftest import (
    TASK_ID_1,
    build_task_data,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    setup_integration,
)


@pytest.fixture(autouse=True)
async def _intents_registered(hass: HomeAssistant):
    await async_setup_intents(hass)


def _task(name: str, *, days_ago: int = 60, **extra: Any) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=days_ago)).isoformat()
    task: dict[str, Any] = build_task_data(task_id=TASK_ID_1, name=name, last_performed=last, interval_days=30)
    task.update(extra)
    return task


async def _object(
    hass: HomeAssistant, task: dict[str, Any], *, name: str = "House", parts: dict[str, Any] | None = None
) -> MockConfigEntry:
    g = make_global_entry(hass)
    extra = {"parts": parts} if parts else None
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name=name, uid=f"hh_{name.lower()}", extra_data=extra)
    await setup_integration(hass, g, obj)
    return obj


async def _ask(
    hass: HomeAssistant,
    intent_type: str,
    slots: dict[str, Any] | None = None,
    *,
    language: str = "en",
    user_id: str | None = None,
) -> intent.IntentResponse:
    return await intent.async_handle(
        hass,
        "test",
        intent_type,
        {k: {"value": v} for k, v in (slots or {}).items()},
        language=language,
        context=Context(user_id=user_id),
    )


def _speech(response: intent.IntentResponse) -> str:
    return str(response.speech.get("plain", {}).get("speech", ""))


def _completions(hass: HomeAssistant, entry: MockConfigEntry, task_id: str = TASK_ID_1) -> list[dict[str, Any]]:
    return [h for h in get_task_store_state(hass, entry.entry_id, task_id).get("history", []) if h.get("type") == "completed"]


def _static(entry: MockConfigEntry, task_id: str = TASK_ID_1) -> dict[str, Any]:
    return dict(entry.data[CONF_TASKS][task_id])


# ─── readings ─────────────────────────────────────────────────────────────


async def test_a_spoken_reading_completes_the_task_with_its_value(hass: HomeAssistant) -> None:
    obj = await _object(hass, _task("Water meter", type="reading", reading_unit="m³"), name="Utility")

    response = await _ask(hass, INTENT_RECORD_READING, {"name": "water meter", "value": "1.234,5"}, language="de")

    assert response.error_code is None, _speech(response)
    done = _completions(hass, obj)
    assert len(done) == 1 and done[0]["reading_value"] == 1234.5
    # Said back the German way, with the task's unit.
    assert "1234,5 m³" in _speech(response)


async def test_a_task_with_one_named_reading_records_it_in_that_slot(hass: HomeAssistant) -> None:
    slots = [{"id": "main", "name": "Main meter", "unit": "kWh"}]
    obj = await _object(hass, _task("Power meter", type="reading", readings=slots), name="Utility")

    response = await _ask(hass, INTENT_RECORD_READING, {"name": "power meter", "value": "812"})

    assert response.error_code is None, _speech(response)
    values = _completions(hass, obj)[0]["reading_values"]
    assert values[0]["id"] == "main" and values[0]["value"] == 812.0
    assert "812 kWh" in _speech(response)


async def test_several_named_readings_are_left_to_the_panel(hass: HomeAssistant) -> None:
    slots = [{"id": "a", "name": "Hot", "unit": "m³"}, {"id": "b", "name": "Cold", "unit": "m³"}]
    obj = await _object(hass, _task("Water meters", type="reading", readings=slots), name="Utility")

    response = await _ask(hass, INTENT_RECORD_READING, {"name": "water meters", "value": "5"})

    assert response.error_code == intent.IntentResponseErrorCode.FAILED_TO_HANDLE
    assert "several readings" in _speech(response)
    assert not _completions(hass, obj)


async def test_a_task_that_takes_no_reading_is_not_completed_by_one(hass: HomeAssistant) -> None:
    obj = await _object(hass, _task("Oil Change"), name="Car")

    response = await _ask(hass, INTENT_RECORD_READING, {"name": "oil change", "value": "5"})

    assert "doesn't record a reading" in _speech(response)
    assert not _completions(hass, obj)


async def test_a_value_without_a_number_is_said_so(hass: HomeAssistant) -> None:
    obj = await _object(hass, _task("Water meter", type="reading"), name="Utility")

    response = await _ask(hass, INTENT_RECORD_READING, {"name": "water meter", "value": "zwölf"}, language="de")

    assert "zwölf" in _speech(response)
    assert not _completions(hass, obj)


# ─── notes ────────────────────────────────────────────────────────────────


async def test_a_note_is_appended_with_the_date(hass: HomeAssistant) -> None:
    obj = await _object(hass, _task("Boiler service", notes="Use the blue key."), name="Boiler")

    response = await _ask(hass, INTENT_ADD_NOTE, {"name": "boiler service", "note": "pressure was  low"})

    assert response.error_code is None, _speech(response)
    notes = _static(obj)["notes"]
    today = dt_util.now().date().isoformat()
    assert notes == f"Use the blue key.\n{today}: pressure was low"


async def test_an_empty_note_asks_what_to_write(hass: HomeAssistant) -> None:
    obj = await _object(hass, _task("Boiler service"), name="Boiler")

    response = await _ask(hass, INTENT_ADD_NOTE, {"name": "boiler service", "note": "   "})

    assert _speech(response) == "What should the note say?"
    assert not _static(obj).get("notes")


async def test_full_notes_are_never_cut(hass: HomeAssistant) -> None:
    full = "x" * (MAX_TEXT_LENGTH - 5)
    obj = await _object(hass, _task("Boiler service", notes=full), name="Boiler")

    response = await _ask(hass, INTENT_ADD_NOTE, {"name": "boiler service", "note": "one more line"})

    assert "full" in _speech(response)
    assert _static(obj)["notes"] == full


# ─── whose turn ───────────────────────────────────────────────────────────


async def test_whose_turn_names_the_person_on_duty(hass: HomeAssistant) -> None:
    alice = await hass.auth.async_create_user("alice")
    await _object(hass, _task("Mow the lawn", responsible_user_id=alice.id), name="Garden")
    hass.states.async_set("person.alice", "home", {"user_id": alice.id, "friendly_name": "Alice Smith"})

    response = await _ask(hass, INTENT_WHOSE_TURN, {"name": "mow the lawn"})
    assert "Alice Smith" in _speech(response)

    mine = await _ask(hass, INTENT_WHOSE_TURN, {"name": "mow the lawn"}, user_id=alice.id)
    assert "your turn" in _speech(mine)


async def test_whose_turn_without_a_person_uses_the_login_name(hass: HomeAssistant) -> None:
    bob = await hass.auth.async_create_user("Bob")
    await _object(hass, _task("Mow the lawn", responsible_user_id=bob.id), name="Garden")

    assert "Bob" in _speech(await _ask(hass, INTENT_WHOSE_TURN, {"name": "mow the lawn"}))


async def test_an_unassigned_task_is_nobodys_turn(hass: HomeAssistant) -> None:
    await _object(hass, _task("Mow the lawn"), name="Garden")

    assert "Nobody" in _speech(await _ask(hass, INTENT_WHOSE_TURN, {"name": "mow the lawn"}))


# ─── shopping and bought parts ────────────────────────────────────────────

_PARTS = {
    "p1": {"id": "p1", "name": "Water filter", "reorder_threshold": 2, "restock_quantity": 3},
    "p2": {"id": "p2", "name": "Salt bag", "reorder_threshold": 0.5},
    "p3": {"id": "p3", "name": "Descaler", "reorder_threshold": 1},
}


async def _stocked(hass: HomeAssistant, stocks: dict[str, float | None]) -> MockConfigEntry:
    obj = await _object(hass, _task("Service", days_ago=1), name="Kitchen", parts=_PARTS)
    store = obj.runtime_data.store
    for part_id, stock in stocks.items():
        store.set_part_stock(part_id, stock)
    return obj


async def test_the_shopping_list_names_what_is_running_low(hass: HomeAssistant) -> None:
    """A decimal threshold counts too — the old stock answer compared only
    integer thresholds, so "0.5 bags" never warned."""
    await _stocked(hass, {"p1": 1, "p2": 0.5, "p3": 4})

    speech = _speech(await _ask(hass, INTENT_SHOPPING_LIST))

    assert speech.startswith("2 spare parts are running low")
    assert "Water filter (1 left)" in speech and "Salt bag (0.5 left)" in speech
    assert "Descaler" not in speech


async def test_nothing_low_says_so(hass: HomeAssistant) -> None:
    await _stocked(hass, {"p1": 9, "p2": 9, "p3": 9})
    assert _speech(await _ask(hass, INTENT_SHOPPING_LIST)).startswith("Nothing is running low")


async def test_bought_parts_go_into_stock(hass: HomeAssistant) -> None:
    obj = await _stocked(hass, {"p1": 1})

    response = await _ask(hass, INTENT_BOUGHT_PART, {"name": "water filter", "quantity": 4})

    assert obj.runtime_data.store.get_part_stock("p1") == 5
    assert "5 in stock" in _speech(response)


async def test_without_a_quantity_the_usual_restock_amount_is_added(hass: HomeAssistant) -> None:
    obj = await _stocked(hass, {"p1": 1})

    await _ask(hass, INTENT_BOUGHT_PART, {"name": "water filter"})

    assert obj.runtime_data.store.get_part_stock("p1") == 4  # restock_quantity 3


async def test_an_open_buy_reminder_is_completed_not_double_counted(hass: HomeAssistant) -> None:
    """With a buy reminder open, its completion does the restock — adding to
    the stock as well would count the purchase twice — and the purchase is
    on the reminder's history."""
    from custom_components.maintenance_supporter.helpers.parts import PART_REF_FIELD
    from custom_components.maintenance_supporter.parts_runtime import async_reconcile_buy_tasks

    parts = {**_PARTS, "p1": {**_PARTS["p1"], "auto_buy_task": True}}
    obj = await _object(hass, _task("Service", days_ago=1), name="Kitchen", parts=parts)
    obj.runtime_data.store.set_part_stock("p1", 1)
    await async_reconcile_buy_tasks(hass, obj)
    await hass.async_block_till_done()
    buy_id = next(tid for tid, t in obj.data[CONF_TASKS].items() if (t.get(PART_REF_FIELD) or {}).get("part_id") == "p1")

    await _ask(hass, INTENT_BOUGHT_PART, {"name": "water filter", "quantity": 4})
    await hass.async_block_till_done()

    assert obj.runtime_data.store.get_part_stock("p1") == 5
    assert len(_completions(hass, obj, buy_id)) == 1


# ─── batteries ────────────────────────────────────────────────────────────


def _overview(**kw: Any) -> Any:
    from collections import OrderedDict

    from custom_components.maintenance_supporter.helpers.battery_fleet import BatteryOverview

    ov = BatteryOverview(total=kw.get("total", 3))
    ov.low = kw.get("low", [])
    ov.needs_now = OrderedDict(kw.get("needs", {}))
    return ov


async def test_low_batteries_are_named_with_what_to_buy(hass: HomeAssistant) -> None:
    low = [{"device_name": "Door sensor", "battery_type": "CR2032"}, {"device_name": "Smoke alarm", "battery_type": "AA"}]
    with patch(
        "custom_components.maintenance_supporter.helpers.battery_fleet.compute_overview",
        return_value=_overview(low=low, needs={"AA": 2, "CR2032": 1}),
    ):
        speech = _speech(await _ask(hass, INTENT_LOW_BATTERIES))
    assert "2 batteries are low" in speech
    assert "Door sensor (CR2032)" in speech and "Smoke alarm (AA)" in speech
    assert "To buy: 2 × AA, 1 × CR2032." in speech


@pytest.mark.parametrize(("total", "expected"), [(0, "No batteries are being tracked."), (4, "No batteries are low.")])
async def test_no_low_batteries(hass: HomeAssistant, total: int, expected: str) -> None:
    with patch(
        "custom_components.maintenance_supporter.helpers.battery_fleet.compute_overview",
        return_value=_overview(total=total),
    ):
        assert _speech(await _ask(hass, INTENT_LOW_BATTERIES)) == expected


# ─── undo ─────────────────────────────────────────────────────────────────


async def test_a_voice_completion_can_be_undone(hass: HomeAssistant) -> None:
    obj = await _object(hass, _task("Oil Change"), name="Car")
    before = dict(get_task_store_state(hass, obj.entry_id, TASK_ID_1))

    await _ask(hass, INTENT_COMPLETE_TASK, {"name": "oil change"})
    assert len(_completions(hass, obj)) == 1

    response = await _ask(hass, INTENT_UNDO)

    assert "no longer completed" in _speech(response)
    after = get_task_store_state(hass, obj.entry_id, TASK_ID_1)
    assert not _completions(hass, obj)
    assert after.get("last_performed") == before.get("last_performed")
    # One level only.
    assert "nothing of yours to undo" in _speech(await _ask(hass, INTENT_UNDO))
    # And the real completion that follows is not swallowed as a double tap.
    await _ask(hass, INTENT_COMPLETE_TASK, {"name": "oil change"})
    assert len(_completions(hass, obj)) == 1


async def test_undo_puts_the_rotation_pointer_back(hass: HomeAssistant) -> None:
    alice = await hass.auth.async_create_user("Alice")
    bob = await hass.auth.async_create_user("Bob")
    task = _task(
        "Mow the lawn", responsible_user_id=alice.id, assignee_pool=[alice.id, bob.id], rotation_strategy="round_robin"
    )
    obj = await _object(hass, task, name="Garden")

    await _ask(hass, INTENT_COMPLETE_TASK, {"name": "mow the lawn"}, user_id=alice.id)
    assert _static(obj)["responsible_user_id"] == bob.id

    await _ask(hass, INTENT_UNDO, user_id=alice.id)
    assert _static(obj)["responsible_user_id"] == alice.id


async def test_skip_and_postpone_are_undone_too(hass: HomeAssistant) -> None:
    obj = await _object(hass, _task("Oil Change", days_ago=10), name="Car")
    due_before = obj.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]["_next_due"]

    await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "days": 5})
    assert get_task_store_state(hass, obj.entry_id, TASK_ID_1).get("due_override")
    assert "old date" in _speech(await _ask(hass, INTENT_UNDO))
    assert not get_task_store_state(hass, obj.entry_id, TASK_ID_1).get("due_override")

    await _ask(hass, INTENT_SKIP_TASK, {"name": "oil change"})
    assert "no longer skipped" in _speech(await _ask(hass, INTENT_UNDO))
    assert obj.runtime_data.coordinator.data[CONF_TASKS][TASK_ID_1]["_next_due"] == due_before


async def test_a_snooze_is_undone(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter import NOTIFICATION_MANAGER_KEY

    obj = await _object(hass, _task("Oil Change"), name="Car")
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]

    await _ask(hass, INTENT_SNOOZE_TASK, {"name": "oil change"})
    assert nm.task_snooze_state(obj.entry_id, TASK_ID_1)

    assert "on again" in _speech(await _ask(hass, INTENT_UNDO))
    assert nm.task_snooze_state(obj.entry_id, TASK_ID_1) == {}


async def test_a_note_and_a_purchase_are_undone(hass: HomeAssistant) -> None:
    obj = await _stocked(hass, {"p1": 1})

    await _ask(hass, INTENT_ADD_NOTE, {"name": "service", "note": "wrong task"})
    assert _static(obj).get("notes")
    await _ask(hass, INTENT_UNDO)
    assert not _static(obj).get("notes")

    await _ask(hass, INTENT_BOUGHT_PART, {"name": "water filter", "quantity": 4})
    assert "back out of stock" in _speech(await _ask(hass, INTENT_UNDO))
    assert obj.runtime_data.store.get_part_stock("p1") == 1


async def test_only_the_speaker_can_undo_their_action(hass: HomeAssistant) -> None:
    alice = await hass.auth.async_create_user("Alice")
    bob = await hass.auth.async_create_user("Bob")
    obj = await _object(hass, _task("Oil Change"), name="Car")

    await _ask(hass, INTENT_COMPLETE_TASK, {"name": "oil change"}, user_id=alice.id)

    assert "nothing of yours" in _speech(await _ask(hass, INTENT_UNDO, user_id=bob.id))
    assert len(_completions(hass, obj)) == 1
    await _ask(hass, INTENT_UNDO, user_id=alice.id)
    assert not _completions(hass, obj)


async def test_undo_expires(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    obj = await _object(hass, _task("Oil Change"), name="Car")
    await _ask(hass, INTENT_COMPLETE_TASK, {"name": "oil change"})

    freezer.tick(timedelta(minutes=11))

    assert "last 10 minutes" in _speech(await _ask(hass, INTENT_UNDO))
    assert len(_completions(hass, obj)) == 1


async def test_undo_never_overwrites_a_later_change(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    """Somebody completed the task again in the panel after the voice action:
    restoring the old state would erase that completion too."""
    obj = await _object(hass, _task("Oil Change"), name="Car")
    await _ask(hass, INTENT_COMPLETE_TASK, {"name": "oil change"})

    freezer.tick(timedelta(minutes=1))  # beyond the double-tap window
    await obj.runtime_data.coordinator.complete_maintenance(task_id=TASK_ID_1, completed_at=dt_util.now())

    response = await _ask(hass, INTENT_UNDO)

    assert response.error_code == intent.IntentResponseErrorCode.FAILED_TO_HANDLE
    assert "changed since" in _speech(response)
    assert len(_completions(hass, obj)) == 2
