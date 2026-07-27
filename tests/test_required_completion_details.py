"""A task can demand details on completion — enforced on EVERY surface.

The rule lives at the single choke point every completion path funnels
through (``coordinator.complete_maintenance``), so it cannot be walked
around by finishing the task from a button, the to-do list, an NFC tag, a
notification action, voice, a service call or the WebSocket API. The
surface-parity lesson from #103: a rule implemented in the dialog only is a
rule that four other surfaces quietly ignore.

Automatic completions (a problem sensor clearing itself) are exempt — there
is nobody to ask, and a required photo would strand the task overdue.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.completion_requirements import (
    missing_completion_fields,
    sanitize_required_completion_fields,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
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


def _object_entry(hass: HomeAssistant, *, required: list[str] | None) -> MockConfigEntry:
    task: dict[str, Any] = build_task_data(interval_days=30, last_performed="2026-01-01")
    if required is not None:
        task["required_completion_fields"] = required
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Boiler",
        data=build_object_entry_data(
            object_data=build_object_data(name="Boiler", object_id="objid_boiler"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_boiler",
    )
    entry.add_to_hass(hass)
    return entry


def _coordinator(hass: HomeAssistant, entry: MockConfigEntry):
    return entry.runtime_data.coordinator


def _history(hass: HomeAssistant, entry: MockConfigEntry) -> list[dict[str, Any]]:
    from .conftest import get_task_store_state

    return get_task_store_state(hass, entry.entry_id, TASK_ID_1).get("history", []) or []


# ── The rule itself ─────────────────────────────────────────────────────────


def test_sanitize_keeps_known_fields_in_canonical_order() -> None:
    assert sanitize_required_completion_fields(["cost", "bogus", "notes", "notes"]) == ["notes", "cost"]
    assert sanitize_required_completion_fields("notes") == []
    assert sanitize_required_completion_fields(None) == []


def test_zero_is_an_answer_but_blank_text_is_not() -> None:
    """A task that cost nothing / took no time is legitimately recorded as 0;
    a note of pure whitespace is not a note."""
    task = {"required_completion_fields": ["notes", "cost", "duration"]}
    assert missing_completion_fields(task, notes="done", cost=0, duration=0) == []
    assert missing_completion_fields(task, notes="   ", cost=0, duration=0) == ["notes"]
    assert missing_completion_fields(task, notes="done", duration=0) == ["cost"]


# ── Surface 1: the coordinator itself (and the auto exemption) ─────────────


async def test_coordinator_rejects_and_then_accepts(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object_entry(hass, required=["notes", "cost"])
    await setup_integration(hass, global_entry, obj)
    coordinator = _coordinator(hass, obj)

    with pytest.raises(ServiceValidationError) as err:
        await coordinator.complete_maintenance(TASK_ID_1)
    # The message must name the task and what is missing — it is what the
    # user reads in a toast, a log line or a spoken answer.
    assert "notes" in str(err.value) and "cost" in str(err.value)
    assert not _history(hass, obj), "a rejected completion must not be recorded"

    await coordinator.complete_maintenance(TASK_ID_1, notes="descaled", cost=12.5)
    assert len(_history(hass, obj)) == 1


async def test_rejection_does_not_arm_the_double_complete_guard(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Regression: the requirement check runs BEFORE the duplicate-completion
    guard. If it did not, the corrected completion a user makes seconds later
    (after the dialog told them what was missing) would be swallowed as a
    double tap and silently do nothing."""
    obj = _object_entry(hass, required=["notes"])
    await setup_integration(hass, global_entry, obj)
    coordinator = _coordinator(hass, obj)

    with pytest.raises(ServiceValidationError):
        await coordinator.complete_maintenance(TASK_ID_1)
    await coordinator.complete_maintenance(TASK_ID_1, notes="now with a note")

    assert len(_history(hass, obj)) == 1, "the corrected completion was swallowed as a duplicate"


async def test_automatic_completion_is_exempt(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A self-clearing problem sensor has nobody to ask for a photo."""
    obj = _object_entry(hass, required=["photo", "user"])
    await setup_integration(hass, global_entry, obj)

    await _coordinator(hass, obj).complete_maintenance(TASK_ID_1, notes="sensor recovered", auto=True)
    assert len(_history(hass, obj)) == 1


async def test_task_without_requirements_is_untouched(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object_entry(hass, required=None)
    await setup_integration(hass, global_entry, obj)
    await _coordinator(hass, obj).complete_maintenance(TASK_ID_1)
    assert len(_history(hass, obj)) == 1


# ── Surface 2: WebSocket (panel + card dialog, and the QR quick path) ──────


async def test_ws_complete_answers_with_a_named_error(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_complete_task

    obj = _object_entry(hass, required=["cost"])
    await setup_integration(hass, global_entry, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_complete_task, hass, conn,
        {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1},
    )
    assert conn.send_error.called, "a rejected completion must answer with an error, not success"
    assert conn.send_error.call_args[0][1] == "completion_details_required"
    assert not _history(hass, obj)

    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_complete_task, hass, conn2,
        {"id": 2, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "cost": 0},
    )
    assert not conn2.send_error.called, conn2.send_error.call_args
    assert len(_history(hass, obj)) == 1


async def test_ws_quick_complete_falls_back_like_missing_defaults(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The QR / card quick path carries only the task's stored defaults. When
    those do not cover the requirements it must report the same 'open the dialog'
    shape as a task without defaults — never a half-recorded completion."""
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_quick_complete_task

    obj = _object_entry(hass, required=["cost"])
    entry_tasks = dict(obj.data[CONF_TASKS])
    entry_tasks[TASK_ID_1] = {**entry_tasks[TASK_ID_1], "quick_complete_defaults": {"notes": "quick"}}
    hass.config_entries.async_update_entry(obj, data={**obj.data, CONF_TASKS: entry_tasks})
    await setup_integration(hass, global_entry, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_quick_complete_task, hass, conn,
        {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1},
    )
    assert conn.send_error.called
    assert conn.send_error.call_args[0][1] == "completion_details_required"
    assert not _history(hass, obj)


# ── Surface 3: the one-press button entity ────────────────────────────────


async def test_button_press_is_refused(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The button cannot ask for a note, so it must fail visibly rather than
    record a completion that breaks the household's record."""
    obj = _object_entry(hass, required=["notes"])
    await setup_integration(hass, global_entry, obj)

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            "button", "press",
            {"entity_id": "button.boiler_filter_cleaning_complete"},
            blocking=True,
        )
    assert not _history(hass, obj)


# ── Surface 4: the native To-do entity ────────────────────────────────────


async def test_todo_check_off_is_refused(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = _object_entry(hass, required=["notes"])
    await setup_integration(hass, global_entry, obj)

    items = await hass.services.async_call(
        "todo", "get_items", {"entity_id": "todo.maintenance"},
        blocking=True, return_response=True,
    )
    item = items["todo.maintenance"]["items"][0]

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            "todo", "update_item",
            {"entity_id": "todo.maintenance", "item": item["uid"], "status": "completed"},
            blocking=True,
        )
    assert not _history(hass, obj)


# ── Surface 5: the maintenance_supporter.complete service ────────────────


async def test_service_complete_is_refused_then_accepted(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    obj = _object_entry(hass, required=["notes"])
    await setup_integration(hass, global_entry, obj)
    entity_id = "sensor.boiler_filter_cleaning"

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "complete", {"entity_id": entity_id}, blocking=True)
    assert not _history(hass, obj)

    await hass.services.async_call(
        DOMAIN, "complete", {"entity_id": entity_id, "notes": "serviced"}, blocking=True
    )
    assert len(_history(hass, obj)) == 1


# ── Surface 6: voice ─────────────────────────────────────────────────────


async def test_voice_answers_instead_of_raising(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Assist must SAY what is missing — an unhandled error would surface as a
    generic 'something went wrong' with no way for the user to learn why."""
    from homeassistant.helpers import intent as intent_helper

    from custom_components.maintenance_supporter.intent import (
        INTENT_COMPLETE_TASK,
        async_setup_intents,
    )

    obj = _object_entry(hass, required=["cost"])
    await setup_integration(hass, global_entry, obj)
    await async_setup_intents(hass)

    response = await intent_helper.async_handle(
        hass, DOMAIN, INTENT_COMPLETE_TASK, {"name": {"value": "Filter Cleaning"}},
    )
    assert response.error_code is not None
    assert "cost" in (response.speech.get("plain", {}).get("speech", "") or "")
    assert not _history(hass, obj)


# ── The field survives a round trip through the WS API ───────────────────


async def test_ws_create_and_update_persist_the_requirement(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_crud import (
        ws_create_task,
        ws_update_task,
    )

    obj = _object_entry(hass, required=None)
    await setup_integration(hass, global_entry, obj)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_create_task, hass, conn,
        {
            "id": 1, "type": "x", "entry_id": obj.entry_id, "name": "Annual service",
            "task_type": "service", "interval_days": 365,
            "required_completion_fields": ["cost", "notes"],
        },
    )
    assert not conn.send_error.called, conn.send_error.call_args
    new_id = conn.send_result.call_args[0][1]["task_id"]
    stored = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][new_id]
    assert stored["required_completion_fields"] == ["notes", "cost"]

    conn2 = make_ws_connection()
    await call_ws_handler(
        ws_update_task, hass, conn2,
        {
            "id": 2, "type": "x", "entry_id": obj.entry_id, "task_id": new_id,
            "required_completion_fields": [],
        },
    )
    assert not conn2.send_error.called, conn2.send_error.call_args
    stored2 = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][new_id]
    assert stored2["required_completion_fields"] == []
