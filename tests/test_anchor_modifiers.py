"""Moving the ``last_performed`` anchor abandons the cycle's modifiers.

Pins (DRY/drift round 2026-09-12): every anchor poke outside the coordinator
goes through ``MaintenanceStore.set_anchor`` / ``helpers.pause.write_anchor``,
and a MOVED anchor drops a pending postpone (``due_override``) — a task
postponed to a future date whose last completion is then deleted, re-dated
or overwritten in the dialog must not keep returning the postponed date.
An UNCHANGED anchor (a note edit, the dialog re-sending the same date)
keeps the postpone. History edit and delete share one rule
(``storage.reanchor_from_history``).
"""

from __future__ import annotations

from typing import Any

from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import HistoryEntryType
from custom_components.maintenance_supporter.helpers.pause import write_anchor
from custom_components.maintenance_supporter.storage import MaintenanceStore, reanchor_from_history
from custom_components.maintenance_supporter.websocket.tasks import (
    ws_delete_history_entry,
    ws_postpone_task,
    ws_update_history_entry,
    ws_update_task,
)

from .conftest import TASK_ID_1, build_task_data, call_ws_handler, make_global_entry, make_object_entry, make_ws_connection, setup_integration

SETUP_DAY = "2026-05-01 09:00:00"
POSTPONED_TO = "2026-06-20"
OLDER_TS = "2026-03-01T10:00:00+00:00"
LATEST_TS = "2026-04-20T10:00:00+00:00"


async def _postponed(hass: HomeAssistant) -> MockConfigEntry:
    """A monthly task with two completions, postponed into the future."""
    g = make_global_entry(hass)
    task = build_task_data(interval_days=None, last_performed=LATEST_TS[:10], history=[{"timestamp": OLDER_TS, "type": HistoryEntryType.COMPLETED, "notes": "first"}, {"timestamp": LATEST_TS, "type": HistoryEntryType.COMPLETED, "notes": "latest"}])
    task["schedule"] = {"kind": "interval", "every": 1, "unit": "months"}
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Widget", uid="anchor_mod")
    await setup_integration(hass, g, obj)
    await _call(hass, ws_postpone_task, {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "until": POSTPONED_TO})
    store = obj.runtime_data.store
    assert store.get_task_state(TASK_ID_1).get("due_override") == POSTPONED_TO, "postpone did not take effect"
    return obj


async def _call(hass: HomeAssistant, handler: Any, msg: dict[str, Any]) -> None:
    conn = make_ws_connection()
    await call_ws_handler(handler, hass, conn, {"id": 1, "type": "x", **msg})
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()


def _state(obj: MockConfigEntry) -> dict[str, Any]:
    return obj.runtime_data.store.get_task_state(TASK_ID_1)


async def test_deleting_the_latest_completion_drops_the_postpone(hass: HomeAssistant) -> None:
    with freeze_time(SETUP_DAY):
        obj = await _postponed(hass)
        await _call(hass, ws_delete_history_entry, {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "timestamp": LATEST_TS})
    assert _state(obj).get("last_performed") == OLDER_TS[:10]
    assert "due_override" not in _state(obj), "stale postpone survived the re-anchor"


async def test_deleting_an_older_entry_keeps_the_postpone(hass: HomeAssistant) -> None:
    with freeze_time(SETUP_DAY):
        obj = await _postponed(hass)
        await _call(hass, ws_delete_history_entry, {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "timestamp": OLDER_TS})
    assert _state(obj).get("last_performed") == LATEST_TS[:10]
    assert _state(obj).get("due_override") == POSTPONED_TO, "the anchor did not move — the postpone stands"


async def test_redating_the_latest_completion_drops_the_postpone(hass: HomeAssistant) -> None:
    with freeze_time(SETUP_DAY):
        obj = await _postponed(hass)
        await _call(hass, ws_update_history_entry, {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "original_timestamp": LATEST_TS, "timestamp": "2026-04-25T10:00:00+00:00"})
    assert _state(obj).get("last_performed") == "2026-04-25"
    assert "due_override" not in _state(obj)


async def test_editing_a_note_keeps_the_postpone(hass: HomeAssistant) -> None:
    with freeze_time(SETUP_DAY):
        obj = await _postponed(hass)
        await _call(hass, ws_update_history_entry, {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "original_timestamp": LATEST_TS, "notes": "typo fixed"})
    assert _state(obj).get("last_performed") == LATEST_TS[:10]
    assert _state(obj).get("due_override") == POSTPONED_TO


async def test_dialog_last_performed_edit_moves_the_store_anchor_and_drops_the_postpone(hass: HomeAssistant) -> None:
    with freeze_time(SETUP_DAY):
        obj = await _postponed(hass)
        # The dialog re-sends the unchanged date on every save → nothing happens.
        await _call(hass, ws_update_task, {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "notes": "renamed", "last_performed": LATEST_TS[:10]})
        assert _state(obj).get("due_override") == POSTPONED_TO
        # A real edit moves the Store's anchor (not only the static copy) and clears.
        await _call(hass, ws_update_task, {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "last_performed": "2026-04-28"})
    assert _state(obj).get("last_performed") == "2026-04-28"
    assert "due_override" not in _state(obj)
    # Clearing the date (None) is a real move too: the Store forgets it.
    with freeze_time(SETUP_DAY):
        await _call(hass, ws_postpone_task, {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "until": POSTPONED_TO})
        await _call(hass, ws_update_task, {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "last_performed": None})
    assert "last_performed" not in _state(obj) and "due_override" not in _state(obj)


def test_write_anchor_and_reanchor_from_history_rules(hass: HomeAssistant) -> None:
    state: dict[str, Any] = {"due_override": "2026-06-20", "last_planned_due": "2026-06-01"}
    write_anchor(state, "2026-05-01", clear_modifiers=False)
    assert state == {"due_override": "2026-06-20", "last_planned_due": "2026-06-01", "last_performed": "2026-05-01"}
    write_anchor(state, "2026-05-02")
    assert state == {"last_performed": "2026-05-02"}
    write_anchor(state, None)
    assert state == {}

    store = MaintenanceStore(hass, "unit")
    store.set_anchor(TASK_ID_1, "2026-04-20")
    store._ensure_task(TASK_ID_1)["due_override"] = "2026-06-20"
    # Only lifecycle entries anchor; TRIGGERED does not, and none → cleared.
    assert reanchor_from_history(store, TASK_ID_1, [{"timestamp": "2026-04-20T10:00:00", "type": HistoryEntryType.COMPLETED}, {"timestamp": "2026-04-29T10:00:00", "type": HistoryEntryType.TRIGGERED}]) == "2026-04-20"
    assert store.get_task_state(TASK_ID_1).get("due_override") == "2026-06-20", "same anchor keeps the modifiers"
    assert reanchor_from_history(store, TASK_ID_1, [{"timestamp": "2026-04-29T10:00:00", "type": HistoryEntryType.TRIGGERED}]) is None
    assert store.get_task_state(TASK_ID_1) == {}
