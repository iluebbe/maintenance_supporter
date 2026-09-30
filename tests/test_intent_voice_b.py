"""Voice package B (2026-09-30): what the existing intents got wrong.

Each test names the audit finding it pins. The unit tests of the time drove
the handlers with pre-digested slots in English and read only the happy
paths; none of these answers had ever been listened to in another language
or with the words a person actually uses.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, MAX_INTERVAL_DAYS
from custom_components.maintenance_supporter.intent import (
    INTENT_COMPLETE_TASK,
    INTENT_LIST_TASKS,
    INTENT_PART_STOCK,
    INTENT_POSTPONE_TASK,
    INTENT_SKIP_TASK,
    INTENT_TASK_INSTRUCTIONS,
    async_setup_intents,
)

from .conftest import (
    build_object_data,
    build_task_data,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    setup_integration,
)


@pytest.fixture(autouse=True)
async def _intents_registered(hass: HomeAssistant):
    await async_setup_intents(hass)


def _task(task_id: str, name: str, *, days_ago: int = 60, interval: int = 30, **extra: Any) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=days_ago)).isoformat()
    task: dict[str, Any] = build_task_data(task_id=task_id, name=name, last_performed=last, interval_days=interval)
    task.update(extra)
    return task


def _object(
    hass: HomeAssistant, name: str, tasks: dict[str, dict[str, Any]], *, area_id: str | None = None, **kw: Any
) -> MockConfigEntry:
    obj = build_object_data(name=name, object_id=name.lower().replace(" ", "_"))
    if area_id:
        obj["area_id"] = area_id
    return make_object_entry(hass, tasks=tasks, name=name, uid=f"b_{obj['id']}", object_data=obj, **kw)


async def _ask(
    hass: HomeAssistant,
    intent_type: str,
    slots: dict[str, Any] | None = None,
    *,
    language: str = "en",
    agent: str | None = None,
) -> intent.IntentResponse:
    return await intent.async_handle(
        hass,
        "test",
        intent_type,
        {k: {"value": v} for k, v in (slots or {}).items()},
        language=language,
        conversation_agent_id=agent,
    )


def _speech(response: intent.IntentResponse) -> str:
    return str(response.speech.get("plain", {}).get("speech", ""))


# ─── "what is due in the kitchen / this week" ─────────────────────────────


async def _rooms(hass: HomeAssistant) -> tuple[Any, Any]:
    registry = ar.async_get(hass)
    kitchen = registry.async_create("Kitchen", aliases={"Küche"})
    cellar = registry.async_create("Cellar")
    g = make_global_entry(hass)
    sink = _object(
        hass,
        "Sink",
        {
            "t1": _task("t1", "Descale"),  # overdue
            "t2": _task("t2", "Clean trap", days_ago=25, warning_days=1),  # due in 5 days, still "ok"
            "t3": _task("t3", "Replace seal", days_ago=1, interval=365),  # far away
        },
        area_id=kitchen.id,
    )
    boiler = _object(hass, "Boiler", {"t4": _task("t4", "Service")}, area_id=cellar.id)
    await setup_integration(hass, g, sink, boiler)
    return kitchen, cellar


async def test_what_is_due_in_a_named_room(hass: HomeAssistant) -> None:
    await _rooms(hass)

    speech = _speech(await _ask(hass, INTENT_LIST_TASKS, {"area": "kitchen"}))
    assert "Descale" in speech and "Service" not in speech

    # An area alias works as well — that is what HA's {area} list offers.
    assert "Descale" in _speech(await _ask(hass, INTENT_LIST_TASKS, {"area": "Küche"}, language="de"))


async def test_an_unknown_room_is_said_so(hass: HomeAssistant) -> None:
    await _rooms(hass)
    response = await _ask(hass, INTENT_LIST_TASKS, {"area": "Attic"})
    assert response.error_code == intent.IntentResponseErrorCode.NO_VALID_TARGETS
    assert "Attic" in _speech(response)


async def test_a_quiet_room_is_said_so(hass: HomeAssistant) -> None:
    await _rooms(hass)
    ar.async_get(hass).async_create("Attic")
    assert _speech(await _ask(hass, INTENT_LIST_TASKS, {"area": "Attic"})) == "Nothing needs maintenance in Attic."


async def test_a_time_window_lists_what_comes_up_whatever_its_status(hass: HomeAssistant) -> None:
    """"What is due this week" includes the task due in five days even
    though it is not "due soon" yet by its own warning days."""
    await _rooms(hass)

    week = _speech(await _ask(hass, INTENT_LIST_TASKS, {"within_days": 7}))
    assert "Clean trap" in week and "Descale" in week
    assert "Replace seal" not in week

    today = _speech(await _ask(hass, INTENT_LIST_TASKS, {"within_days": 0}))
    assert "Clean trap" not in today and "Descale" in today


async def test_status_overdue_filters(hass: HomeAssistant) -> None:
    await _rooms(hass)
    speech = _speech(await _ask(hass, INTENT_LIST_TASKS, {"status": "overdue"}))
    assert "Descale" in speech and "Clean trap" not in speech


# ─── ambiguity: say HOW to be more specific ───────────────────────────────


async def test_an_ambiguous_name_offers_the_phrase_that_resolves(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    a = _object(hass, "Kitchen Sink", {"a1": _task("a1", "Water Filter")})
    b = _object(hass, "Garage", {"b1": _task("b1", "Water Filter")})
    await setup_integration(hass, g, a, b)

    response = await _ask(hass, INTENT_COMPLETE_TASK, {"name": "water filter"})

    speech = _speech(response)
    assert response.error_code == intent.IntentResponseErrorCode.NO_VALID_TARGETS
    example = speech.split("for example “")[1].rstrip("”.")
    assert example in {"Water Filter on Kitchen Sink", "Water Filter on Garage"}
    # Saying exactly that resolves it.
    retry = await _ask(hass, INTENT_COMPLETE_TASK, {"name": example})
    assert retry.error_code is None, _speech(retry)


async def test_an_ambiguous_part_says_parts_not_tasks(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    parts = {"p1": {"id": "p1", "name": "Toner black"}, "p2": {"id": "p2", "name": "Toner cyan"}}
    obj = _object(hass, "Printer", {"t1": _task("t1", "Service")}, extra_data={"parts": parts})
    await setup_integration(hass, g, obj)

    speech = _speech(await _ask(hass, INTENT_PART_STOCK, {"name": "toner"}))
    assert speech.startswith("That matches several spare parts")


async def test_a_decimal_reorder_threshold_warns(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    parts = {"p1": {"id": "p1", "name": "Salt", "reorder_threshold": 0.5}}
    obj = _object(hass, "Softener", {"t1": _task("t1", "Refill")}, extra_data={"parts": parts})
    await setup_integration(hass, g, obj)
    obj.runtime_data.store.set_part_stock("p1", 0.5)

    assert "reorder threshold" in _speech(await _ask(hass, INTENT_PART_STOCK, {"name": "salt"}))


# ─── refusals in the speaker's language ───────────────────────────────────


async def test_a_refusal_is_not_english_in_german(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = _object(hass, "Boiler", {"t1": _task("t1", "Service", require_tag_scan=True)})
    await setup_integration(hass, g, obj)

    response = await _ask(hass, INTENT_COMPLETE_TASK, {"name": "service"}, language="de")

    assert response.error_code == intent.IntentResponseErrorCode.FAILED_TO_HANDLE
    speech = _speech(response)
    assert "Service" in speech and "can only be completed" not in speech
    assert "NFC" in speech


# ─── postpone: the longest interval, at the choke point ───────────────────


async def test_the_coordinator_refuses_a_postpone_beyond_the_longest_interval(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = _object(hass, "Car", {"t1": _task("t1", "Oil Change")})
    await setup_integration(hass, g, obj)

    too_far = dt_util.now().date() + timedelta(days=MAX_INTERVAL_DAYS + 1)
    with pytest.raises(ServiceValidationError) as err:
        await obj.runtime_data.coordinator.async_postpone_task("t1", too_far)
    assert err.value.translation_key == "postpone_too_far"


async def test_voice_cannot_postpone_past_it_either(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = _object(hass, "Car", {"t1": _task("t1", "Oil Change")})
    await setup_integration(hass, g, obj)

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "days": 999999}, language="de")

    assert response.error_code == intent.IntentResponseErrorCode.FAILED_TO_HANDLE
    assert str(MAX_INTERVAL_DAYS) in _speech(response)
    assert not get_task_store_state(hass, obj.entry_id, "t1").get("due_override")


# ─── no "?" and no question the classic agent cannot follow up ────────────


async def test_skipping_a_task_without_a_next_date_says_no_date(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    manual = build_task_data(task_id="t1", name="Deep clean", schedule_type="manual", interval_days=None)
    obj = _object(hass, "Oven", {"t1": manual})
    await setup_integration(hass, g, obj)

    speech = _speech(await _ask(hass, INTENT_SKIP_TASK, {"name": "deep clean"}))

    assert not obj.runtime_data.coordinator.data[CONF_TASKS]["t1"].get("_next_due")
    assert speech == "Skipped this cycle of 'Deep clean' on Oven."


async def test_the_classic_agent_is_not_asked_a_question_it_cannot_follow_up(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = _object(hass, "Oven", {"t1": _task("t1", "Deep clean")})
    await setup_integration(hass, g, obj)

    classic = _speech(await _ask(hass, INTENT_TASK_INSTRUCTIONS, {"name": "deep clean"}, agent="conversation.home_assistant"))
    llm = _speech(await _ask(hass, INTENT_TASK_INSTRUCTIONS, {"name": "deep clean"}, agent="conversation.openai"))

    assert "?" not in classic and "no stored instructions" in classic
    assert llm.endswith("would you like that?")


async def test_instructions_name_a_part_from_another_objects_pool(hass: HomeAssistant) -> None:
    """#111 pooled links: the instructions looked the part up in the task's
    own object only, so a filter kept in the shared stock was never named."""
    g = make_global_entry(hass)
    store_parts = {"px": {"id": "px", "name": "HEPA filter", "storage_location": "Cellar shelf"}}
    pool = _object(hass, "Spare parts", {"s1": _task("s1", "Inventory")}, extra_data={"parts": store_parts})
    link = [{"part_id": "px", "quantity": 1, "entry_id": pool.entry_id}]
    vac = _object(hass, "Vacuum", {"v1": _task("v1", "Filter swap", consumes_parts=link)})
    await setup_integration(hass, g, pool, vac)
    pool.runtime_data.store.set_part_stock("px", 2)

    speech = _speech(await _ask(hass, INTENT_TASK_INSTRUCTIONS, {"name": "filter swap"}))

    assert "HEPA filter" in speech and "Cellar shelf" in speech and "2 in stock" in speech


def test_spoken_dates_never_leak_iso() -> None:
    """Belt and braces for the date fix: every spoken date key formats a
    month NAME in every language."""
    from custom_components.maintenance_supporter.helpers.intent_speech import available_languages, spoken_date

    for language in available_languages():
        said = spoken_date(date(dt_util.now().year, 10, 3), language)
        assert "-10-" not in said and f"{dt_util.now().year}-" not in said, (language, said)
