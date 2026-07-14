"""Assist intents: query (ListTasks) + complete (CompleteTask) by voice/LLM.

Registered via the integration intent platform; LLM pipelines expose them as
tools automatically, the classic agent uses the shipped sentence files. These
tests drive the handlers through ``intent.async_handle`` — the same entry point
both agents use.
"""

from __future__ import annotations

from datetime import timedelta

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.intent import (
    INTENT_COMPLETE_TASK,
    INTENT_LIST_TASKS,
    async_setup_intents,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    get_task_store_state,
    make_object_entry,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _overdue_task(name: str, task_id: str = TASK_ID_1) -> dict:
    last = (dt_util.now().date() - timedelta(days=60)).isoformat()
    return build_task_data(task_id=task_id, name=name, last_performed=last, interval_days=30)


def _ok_task(name: str, task_id: str = TASK_ID_1) -> dict:
    last = dt_util.now().date().isoformat()
    return build_task_data(task_id=task_id, name=name, last_performed=last, interval_days=30)


async def _handle(hass: HomeAssistant, intent_type: str, slots: dict | None = None, language: str = "en"):
    return await intent.async_handle(hass, "test", intent_type, slots=slots or {}, language=language)


async def test_list_tasks_speaks_the_overdue_task(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = make_object_entry(
        hass, tasks={TASK_ID_1: _overdue_task("Filter Cleaning")}, name="Pool Pump", uid="intent_list"
    )
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    resp = await _handle(hass, INTENT_LIST_TASKS)
    speech = resp.speech["plain"]["speech"]
    assert "Filter Cleaning" in speech
    assert "Pool Pump" in speech
    assert "overdue" in speech


async def test_list_tasks_all_ok_and_german(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = make_object_entry(hass, tasks={TASK_ID_1: _ok_task("Filter Cleaning")}, name="Pool Pump", uid="intent_ok")
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    resp = await _handle(hass, INTENT_LIST_TASKS)
    assert "Everything is OK" in resp.speech["plain"]["speech"]
    resp_de = await _handle(hass, INTENT_LIST_TASKS, language="de")
    assert "Alles in Ordnung" in resp_de.speech["plain"]["speech"]


async def test_complete_task_by_name_records_a_real_completion(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    obj = make_object_entry(
        hass, tasks={TASK_ID_1: _overdue_task("Oil Change")}, name="Family Car", uid="intent_complete"
    )
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    # Object-qualified spoken name must resolve ("oil change car").
    resp = await _handle(hass, INTENT_COMPLETE_TASK, {"name": {"value": "oil change car"}})
    speech = resp.speech["plain"]["speech"]
    assert "Oil Change" in speech and "Family Car" in speech

    state = get_task_store_state(hass, obj.entry_id, TASK_ID_1)
    completed = [h for h in state.get("history", []) if h.get("type") == "completed"]
    assert len(completed) == 1
    assert completed[0].get("completed_by") == "assist"


async def test_complete_unknown_name_errors_without_side_effects(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    obj = make_object_entry(
        hass, tasks={TASK_ID_1: _overdue_task("Oil Change")}, name="Family Car", uid="intent_unknown"
    )
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    resp = await _handle(hass, INTENT_COMPLETE_TASK, {"name": {"value": "warp core alignment"}})
    assert resp.error_code == intent.IntentResponseErrorCode.NO_VALID_TARGETS
    state = get_task_store_state(hass, obj.entry_id, TASK_ID_1)
    assert not [h for h in state.get("history", []) if h.get("type") == "completed"]


def test_match_tasks_edge_cases() -> None:
    from custom_components.maintenance_supporter.intent import _match_tasks

    snap = [
        {"name": "Oil Change", "object_name": "Car"},
        {"name": "Oil Change", "object_name": "Motorbike"},
    ]
    assert _match_tasks("", snap) == []  # empty query
    assert _match_tasks("   ", snap) == []
    # Exact name matching two tasks → both returned (ambiguous, not a guess).
    assert len(_match_tasks("oil change", snap)) == 2
    # Object-qualified resolves to one.
    assert _match_tasks("oil change motorbike", snap)[0]["object_name"] == "Motorbike"
    # Single exact match wins outright even if tokens would match more.
    snap2 = [{"name": "Oil", "object_name": "Car"}, {"name": "Oil Change", "object_name": "Car"}]
    assert _match_tasks("oil", snap2) == [snap2[0]]


async def test_list_tasks_status_filter_and_due_in_phrase(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The status slot filters, and a due-soon task speaks 'due in N days'."""
    last = (dt_util.now().date() - timedelta(days=25)).isoformat()  # due in 5 days
    task = build_task_data(task_id=TASK_ID_1, name="Descaling", last_performed=last, interval_days=30, warning_days=7)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Espresso", uid="intent_duesoon")
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    resp = await _handle(hass, INTENT_LIST_TASKS, {"status": {"value": "due_soon"}})
    speech = resp.speech["plain"]["speech"]
    assert "Descaling" in speech and "due in 5 days" in speech
    # Filtering for overdue finds nothing → the all-clear phrase.
    resp2 = await _handle(hass, INTENT_LIST_TASKS, {"status": {"value": "overdue"}})
    assert "Everything is OK" in resp2.speech["plain"]["speech"]


async def test_complete_respects_the_completion_window(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """A task outside its earliest_completion_days window errors 'too early'
    instead of completing — voice must not bypass the contract."""
    last = dt_util.now().date().isoformat()  # freshly done → next due in 30 days
    task = build_task_data(task_id=TASK_ID_1, name="Descaling", last_performed=last, interval_days=30)
    task["earliest_completion_days"] = 2  # only completable within 2 days of due
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Espresso", uid="intent_window")
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    resp = await _handle(hass, INTENT_COMPLETE_TASK, {"name": {"value": "descaling"}})
    assert resp.error_code == intent.IntentResponseErrorCode.FAILED_TO_HANDLE
    assert "closer to its due date" in resp.speech["plain"]["speech"]
    state = get_task_store_state(hass, obj.entry_id, TASK_ID_1)
    assert not [h for h in state.get("history", []) if h.get("type") == "completed"]


async def test_complete_ambiguous_name_lists_candidates_and_completes_nothing(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    obj_a = make_object_entry(
        hass,
        tasks={"a" * 32: _overdue_task("Filter Cleaning", task_id="a" * 32)},
        name="Pool Pump",
        uid="intent_amb_a",
        object_data={**build_object_data(name="Pool Pump", object_id="d" * 32)},
    )
    obj_b = make_object_entry(
        hass,
        tasks={"b" * 32: _overdue_task("Filter Cleaning", task_id="b" * 32)},
        name="HVAC",
        uid="intent_amb_b",
        object_data={**build_object_data(name="HVAC", object_id="e" * 32)},
    )
    await setup_integration(hass, global_entry, obj_a, obj_b)
    await async_setup_intents(hass)

    resp = await _handle(hass, INTENT_COMPLETE_TASK, {"name": {"value": "filter cleaning"}})
    assert resp.error_code == intent.IntentResponseErrorCode.NO_VALID_TARGETS
    msg = resp.speech["plain"]["speech"]
    assert "Pool Pump" in msg and "HVAC" in msg  # candidates listed
    for entry_id, tid in ((obj_a.entry_id, "a" * 32), (obj_b.entry_id, "b" * 32)):
        state = get_task_store_state(hass, entry_id, tid)
        assert not [h for h in state.get("history", []) if h.get("type") == "completed"]

    # Object-qualified retry resolves the ambiguity.
    resp2 = await _handle(hass, INTENT_COMPLETE_TASK, {"name": {"value": "filter cleaning pool pump"}})
    assert resp2.error_code is None
    state = get_task_store_state(hass, obj_a.entry_id, "a" * 32)
    assert [h for h in state.get("history", []) if h.get("type") == "completed"]
