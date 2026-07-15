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


# ── v2.28 intents: grounded guidance, due query, snooze, part stock ──────────


async def test_instructions_speaks_only_stored_guidance(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Notes, checklist, linked doc (with page), required part (with location
    and live stock) all come straight from stored data."""
    from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
    from custom_components.maintenance_supporter.intent import INTENT_TASK_INSTRUCTIONS

    task = _ok_task("Pump Service")
    task["notes"] = "Bleed the housing before restarting."
    task["checklist"] = ["Power off", "Swap seal", "Bleed housing"]
    task["consumes_parts"] = [{"part_id": "p1", "quantity": 2}]
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Pool Pump", uid="intent_guide")
    data = dict(obj.data)
    data["parts"] = {"p1": {"id": "p1", "name": "Seal kit", "storage_location": "Shelf B"}}
    hass.config_entries.async_update_entry(obj, data=data)
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    # Live stock + a linked manual with a per-task page hint.
    obj.runtime_data.store.set_part_stock("p1", 3)
    doc_store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    object_id = obj.data["object"]["id"]
    doc = await doc_store.async_add_weblink(object_id, url="https://x/manual", title="Pump manual")
    await doc_store.async_update(doc["id"], task_ids=[TASK_ID_1], task_pages={TASK_ID_1: 12})

    resp = await _handle(hass, INTENT_TASK_INSTRUCTIONS, {"name": {"value": "pump service"}})
    speech = resp.speech["plain"]["speech"]
    assert "Bleed the housing before restarting." in speech
    assert "3 checklist steps" in speech and "Swap seal" in speech
    assert "Pump manual" in speech and "page 12" in speech
    assert "2 × Seal kit" in speech
    assert "Shelf B" in speech and "3 in stock" in speech


async def test_instructions_nothing_stored_discloses_and_asks(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The anti-hallucination contract: no stored info → say so and ASK
    before any general advice; never invent steps."""
    from custom_components.maintenance_supporter.intent import INTENT_TASK_INSTRUCTIONS

    obj = make_object_entry(hass, tasks={TASK_ID_1: _ok_task("Descaling")}, name="Kettle", uid="intent_bare")
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    resp = await _handle(hass, INTENT_TASK_INSTRUCTIONS, {"name": {"value": "descaling"}})
    speech = resp.speech["plain"]["speech"]
    assert "no stored instructions" in speech
    assert "non-verified advice" in speech and "would you like that?" in speech

    resp_de = await _handle(hass, INTENT_TASK_INSTRUCTIONS, {"name": {"value": "descaling"}}, language="de")
    assert "ungeprüfte Hinweise" in resp_de.speech["plain"]["speech"]


async def test_task_due_speaks_status_and_date(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.intent import INTENT_TASK_DUE

    obj = make_object_entry(
        hass, tasks={TASK_ID_1: _overdue_task("Oil Change")}, name="Family Car", uid="intent_due"
    )
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    resp = await _handle(hass, INTENT_TASK_DUE, {"name": {"value": "oil change"}})
    speech = resp.speech["plain"]["speech"]
    assert "Oil Change" in speech and "overdue" in speech
    assert "next due date is 20" in speech.lower()  # ISO year on the date suffix


async def test_snooze_task_calls_the_notification_manager(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter import NOTIFICATION_MANAGER_KEY
    from custom_components.maintenance_supporter.intent import INTENT_SNOOZE_TASK

    obj = make_object_entry(
        hass, tasks={TASK_ID_1: _overdue_task("Oil Change")}, name="Family Car", uid="intent_snooze"
    )
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    nm = MagicMock()
    hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] = nm
    resp = await _handle(hass, INTENT_SNOOZE_TASK, {"name": {"value": "oil change"}})
    nm.snooze_task.assert_called_once_with(obj.entry_id, TASK_ID_1)
    speech = resp.speech["plain"]["speech"]
    assert "Snoozed" in speech and "hours" in speech


async def test_part_stock_tracked_low_untracked_and_not_found(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.intent import INTENT_PART_STOCK

    obj = make_object_entry(hass, tasks={TASK_ID_1: _ok_task("Service")}, name="Softener", uid="intent_stock")
    data = dict(obj.data)
    data["parts"] = {
        "p1": {"id": "p1", "name": "Salt bag", "storage_location": "Basement", "reorder_threshold": 2},
        "p2": {"id": "p2", "name": "Resin bottle"},
    }
    hass.config_entries.async_update_entry(obj, data=data)
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)
    obj.runtime_data.store.set_part_stock("p1", 1)

    resp = await _handle(hass, INTENT_PART_STOCK, {"name": {"value": "salt bag"}})
    speech = resp.speech["plain"]["speech"]
    assert "1 × Salt bag" in speech and "Basement" in speech
    assert "reorder threshold" in speech  # 1 <= threshold 2 → low warning

    resp2 = await _handle(hass, INTENT_PART_STOCK, {"name": {"value": "resin bottle"}})
    assert "Stock isn't tracked" in resp2.speech["plain"]["speech"]

    resp3 = await _handle(hass, INTENT_PART_STOCK, {"name": {"value": "flux capacitor"}})
    assert resp3.error_code == intent.IntentResponseErrorCode.NO_VALID_TARGETS


async def test_instructions_edge_branches(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Doc without a page hint, documentation URL, long-note truncation."""
    from custom_components.maintenance_supporter import DOCUMENT_STORE_KEY
    from custom_components.maintenance_supporter.intent import INTENT_TASK_INSTRUCTIONS

    task = _ok_task("Belt Change")
    task["notes"] = "x" * 300  # truncated to 240 with an ellipsis
    task["documentation_url"] = "https://example.com/belts"
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Dryer", uid="intent_guide2")
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    doc_store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    doc = await doc_store.async_add_weblink(obj.data["object"]["id"], url="https://x/b", title="Belt guide")
    await doc_store.async_update(doc["id"], task_ids=[TASK_ID_1])  # no page hint

    resp = await _handle(hass, INTENT_TASK_INSTRUCTIONS, {"name": {"value": "belt change"}})
    speech = resp.speech["plain"]["speech"]
    assert "Belt guide" in speech and "page" not in speech
    assert "a documentation link is on file" in speech
    assert "…" in speech and "x" * 241 not in speech


async def test_snooze_without_notification_manager_errors(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter import NOTIFICATION_MANAGER_KEY
    from custom_components.maintenance_supporter.intent import INTENT_SNOOZE_TASK

    obj = make_object_entry(hass, tasks={TASK_ID_1: _ok_task("Oil Change")}, name="Car", uid="intent_nonm")
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)
    hass.data[DOMAIN].pop(NOTIFICATION_MANAGER_KEY, None)

    resp = await _handle(hass, INTENT_SNOOZE_TASK, {"name": {"value": "oil change"}})
    assert resp.error_code == intent.IntentResponseErrorCode.FAILED_TO_HANDLE
    assert "nothing to snooze" in resp.speech["plain"]["speech"]


async def test_part_stock_ambiguous_lists_candidates(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.intent import INTENT_PART_STOCK

    obj = make_object_entry(hass, tasks={TASK_ID_1: _ok_task("Service")}, name="Printer", uid="intent_amb")
    data = dict(obj.data)
    data["parts"] = {
        "p1": {"id": "p1", "name": "Toner black"},
        "p2": {"id": "p2", "name": "Toner cyan"},
    }
    hass.config_entries.async_update_entry(obj, data=data)
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    resp = await _handle(hass, INTENT_PART_STOCK, {"name": {"value": "toner"}})
    assert resp.error_code == intent.IntentResponseErrorCode.NO_VALID_TARGETS
    assert "Toner black" in resp.speech["plain"]["speech"]
    assert "Toner cyan" in resp.speech["plain"]["speech"]
