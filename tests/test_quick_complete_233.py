"""#233: *Quick complete*, a task that completes in one tap.

A household with a kitchen tablet wanted chores closed with one tap; the
dialog asked nothing they needed. The quick-complete QR code already did
that, but only for a task with prefilled values, and nothing else used them.

The rule: the switch is the presence of ``quick_complete_defaults`` (an
empty mapping is "on, nothing to prefill"). A one-tap completion (the QR
code, the panel, a card) and every unattended completion a person made (a
button, a notification, a to-do tick, an NFC tap, voice) record the task's
prefill for what the caller did not pass; a required note, cost or duration
it holds is answered. Only the QR code is proof of presence, and automatic
completions get no prefill.
"""

from __future__ import annotations

from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from custom_components.maintenance_supporter.helpers.completion_requirements import (
    quick_complete_on,
    quick_complete_values,
    unattended_missing_fields,
)
from custom_components.maintenance_supporter.websocket.tasks_actions import ws_quick_complete_task
from custom_components.maintenance_supporter.websocket.tasks_bulk import apply_bulk_changes

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    make_object_entry,
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


async def _boiler(hass: HomeAssistant, global_entry: MockConfigEntry, **task: Any) -> MockConfigEntry:
    data = build_task_data(interval_days=30, last_performed="2026-01-01")
    data.update(task)
    obj = make_object_entry(hass, tasks={TASK_ID_1: data}, name="Boiler", uid="boiler", object_id="objid_boiler")
    await setup_integration(hass, global_entry, obj)
    return obj


def _history(hass: HomeAssistant, entry: MockConfigEntry) -> list[dict[str, Any]]:
    return get_task_store_state(hass, entry.entry_id, TASK_ID_1).get("history", []) or []


async def _quick(hass: HomeAssistant, entry: MockConfigEntry, **msg: Any):
    conn = make_ws_connection()
    await call_ws_handler(
        ws_quick_complete_task, hass, conn,
        {"id": 1, "type": f"{DOMAIN}/task/quick_complete", "entry_id": entry.entry_id, "task_id": TASK_ID_1, **msg},
    )
    return conn


# ── the switch ──────────────────────────────────────────────────────────────


def test_the_switch_is_the_presence_of_the_prefill() -> None:
    assert quick_complete_on({"quick_complete_defaults": {}})
    assert quick_complete_values({"quick_complete_defaults": {"cost": 12.0}}) == {"cost": 12.0}
    for off in ({}, {"quick_complete_defaults": None}, {"quick_complete_defaults": "yes"}, None):
        assert not quick_complete_on(off)
        assert quick_complete_values(off) == {}


def test_an_unattended_completion_answers_what_the_prefill_holds() -> None:
    task = {"required_completion_fields": ["notes", "cost", "photo"]}
    assert unattended_missing_fields(task) == ["notes", "cost", "photo"]
    assert unattended_missing_fields(task, prefill={"cost": 0, "notes": "Rinsed"}) == ["photo"]
    # "Who did it" is never answered for an unattended surface.
    assert unattended_missing_fields({"required_completion_fields": ["user"]}, prefill={"notes": "x"}) == ["user"]


# ── task/quick_complete ─────────────────────────────────────────────────────


async def test_quick_complete_without_values_is_a_plain_completion(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The kitchen tablet: nothing to record but the completion itself."""
    obj = await _boiler(hass, global_entry, quick_complete_defaults={})
    conn = await _quick(hass, obj, source="panel")
    assert not conn.send_error.called, conn.send_error.call_args
    (entry,) = _history(hass, obj)
    assert entry["type"] == "completed" and entry.get("cost") is None


async def test_quick_complete_off_asks_for_the_dialog(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = await _boiler(hass, global_entry)
    conn = await _quick(hass, obj, source="panel")
    assert conn.send_error.call_args[0][1] == "no_defaults"
    assert not _history(hass, obj)


async def test_only_the_qr_code_is_proof_of_presence(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """A tap in the panel or on a card is not standing at the thing."""
    obj = await _boiler(hass, global_entry, quick_complete_defaults={}, require_tag_scan=True)
    conn = await _quick(hass, obj, source="panel")
    assert conn.send_error.called
    assert not _history(hass, obj)
    conn = await _quick(hass, obj)  # an old QR link carries no source: the QR code
    assert not conn.send_error.called, conn.send_error.call_args
    assert len(_history(hass, obj)) == 1


# ── the prefill on every completion that asks nobody ────────────────────────


async def test_a_button_press_records_the_prefill_and_it_answers_a_required_cost(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """The button was refused for a task demanding a cost; the prefill is the
    household's answer for exactly this."""
    obj = await _boiler(hass, global_entry, required_completion_fields=["cost"], quick_complete_defaults={"cost": 12.5, "notes": "Filter rinsed"})
    await hass.services.async_call("button", "press", {"entity_id": "button.boiler_filter_cleaning_complete"}, blocking=True)
    (entry,) = _history(hass, obj)
    assert entry["cost"] == 12.5
    # The household's own note beats the canned "Completed from dashboard button".
    assert entry["notes"] == "Filter rinsed"


async def test_without_quick_complete_the_button_is_still_refused(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    obj = await _boiler(hass, global_entry, required_completion_fields=["cost"])
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call("button", "press", {"entity_id": "button.boiler_filter_cleaning_complete"}, blocking=True)
    assert not _history(hass, obj)


async def test_an_automatic_completion_records_no_prefill(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """Nobody did the work: a recovered sensor is not a quick completion."""
    obj = await _boiler(hass, global_entry, quick_complete_defaults={"cost": 12.5})
    await obj.runtime_data.coordinator.complete_maintenance(TASK_ID_1, auto=True, source="auto_recovery")
    (entry,) = _history(hass, obj)
    assert entry.get("cost") is None


async def test_the_notification_offers_complete_when_the_prefill_covers_it(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    from custom_components.maintenance_supporter.const import NOTIFICATION_MANAGER_KEY

    obj = await _boiler(hass, global_entry, required_completion_fields=["cost"])
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    assert not nm._complete_allowed(obj.entry_id, TASK_ID_1)
    tasks = dict(obj.data[CONF_TASKS])
    tasks[TASK_ID_1] = {**tasks[TASK_ID_1], "quick_complete_defaults": {"cost": 3.0}}
    hass.config_entries.async_update_entry(obj, data={**obj.data, CONF_TASKS: tasks})
    await hass.config_entries.async_reload(obj.entry_id)
    await hass.async_block_till_done()
    assert nm._complete_allowed(obj.entry_id, TASK_ID_1)


# ── bulk edit ───────────────────────────────────────────────────────────────


def test_bulk_edit_switches_quick_complete_and_undoes_exactly() -> None:
    plain = {"id": "a", "name": "A"}
    valued = {"id": "b", "name": "B", "quick_complete_defaults": {"cost": 4.0}}
    on_plain, prev_plain = apply_bulk_changes(plain, {"quick_complete": True})
    on_valued, prev_valued = apply_bulk_changes(valued, {"quick_complete": True})
    assert on_plain["quick_complete_defaults"] == {}
    assert on_valued["quick_complete_defaults"] == {"cost": 4.0}  # its own prefill stays
    assert prev_plain == {"quick_complete_defaults": None}
    off, prev_off = apply_bulk_changes(valued, {"quick_complete": False})
    assert "quick_complete_defaults" not in off
    # The undo sends back what it replaced.
    restored, _ = apply_bulk_changes(off, prev_off)
    assert restored["quick_complete_defaults"] == {"cost": 4.0}
    back_off, _ = apply_bulk_changes(on_plain, prev_plain)
    assert "quick_complete_defaults" not in back_off
