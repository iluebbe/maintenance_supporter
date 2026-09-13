"""One inert-task gate for every lifecycle action (DRY/drift round 2026-09-12).

Pins: ``helpers.pause.is_task_inert`` is the single predicate (archived,
disabled, or the object paused); ``reset_maintenance`` and
``async_postpone_task`` refuse an inert task with their own keys
(``task_inactive_reset`` / ``task_inactive_postpone``) exactly like
complete/skip (they had NO gate — a stale notification button or an old NFC
sticker could restart a retired task's cycle); the WS reset/postpone commands
surface those keys; an active task still resets and postpones.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import CONF_OBJECT
from custom_components.maintenance_supporter.helpers.pause import is_task_inert
from custom_components.maintenance_supporter.websocket.tasks import ws_postpone_task, ws_reset_task

from .conftest import TASK_ID_1, build_object_data, build_object_entry_data, build_task_data, call_ws_handler, make_global_entry, make_object_entry, make_ws_connection, setup_integration


async def _setup(hass: HomeAssistant, task_over: dict[str, Any] | None = None, *, paused: bool = False) -> MockConfigEntry:
    g = make_global_entry(hass)
    task = build_task_data(last_performed=(dt_util.now().date() - timedelta(days=10)).isoformat(), interval_days=30)
    task.update(task_over or {})
    od = build_object_data(name="Gate")
    if paused:
        od["paused_at"] = "2026-08-01T10:00:00+00:00"
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Gate", uid="inert_gate", object_data=od)
    await setup_integration(hass, g, obj)
    return obj


@pytest.mark.parametrize(
    ("task_over", "paused"),
    [({"archived_at": "2026-08-01T10:00:00+00:00", "archived_reason": "manual"}, False), ({"enabled": False}, False), ({}, True)],
    ids=["archived", "disabled", "paused-object"],
)
async def test_reset_and_postpone_refuse_an_inert_task(hass: HomeAssistant, task_over: dict[str, Any], paused: bool) -> None:
    obj = await _setup(hass, task_over, paused=paused)
    coordinator = obj.runtime_data.coordinator
    before = dict(obj.runtime_data.store.get_task_state(TASK_ID_1))
    with pytest.raises(ServiceValidationError) as exc:
        await coordinator.reset_maintenance(TASK_ID_1)
    assert exc.value.translation_key == "task_inactive_reset"
    with pytest.raises(ServiceValidationError) as exc:
        await coordinator.async_postpone_task(TASK_ID_1, date.today() + timedelta(days=30))
    assert exc.value.translation_key == "task_inactive_postpone"
    assert obj.runtime_data.store.get_task_state(TASK_ID_1) == before, "a refused action must not touch the cycle"


async def test_ws_reset_and_postpone_report_the_inactive_key(hass: HomeAssistant) -> None:
    obj = await _setup(hass, {"enabled": False})
    for handler, extra, key in (
        (ws_reset_task, {}, "task_inactive_reset"),
        (ws_postpone_task, {"until": (date.today() + timedelta(days=30)).isoformat()}, "task_inactive_postpone"),
    ):
        conn = make_ws_connection()
        await call_ws_handler(handler, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1, **extra})
        conn.send_result.assert_not_called()
        assert conn.send_error.call_args[0][1] == key


async def test_active_task_still_resets_and_postpones(hass: HomeAssistant) -> None:
    obj = await _setup(hass)
    coordinator = obj.runtime_data.coordinator
    until = date.today() + timedelta(days=30)
    await coordinator.async_postpone_task(TASK_ID_1, until)
    await hass.async_block_till_done()
    assert obj.runtime_data.store.get_task_state(TASK_ID_1).get("due_override") == until.isoformat()
    await coordinator.reset_maintenance(TASK_ID_1)
    await hass.async_block_till_done()
    assert obj.runtime_data.store.get_last_performed(TASK_ID_1) == dt_util.now().date().isoformat()


def test_is_task_inert_is_the_single_predicate() -> None:
    assert not is_task_inert({"enabled": True}, {})
    assert is_task_inert({"archived_at": "2026-01-01T00:00:00"}, {})
    assert is_task_inert({"enabled": False}, {})
    assert is_task_inert({}, {"paused_at": "2026-01-01T00:00:00"})
    assert not is_task_inert({}, {"paused_at": None})
    assert build_object_entry_data()[CONF_OBJECT].get("paused_at") is None
