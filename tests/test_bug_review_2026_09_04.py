"""Regression tests for the 2026-09-04 bug review (backend share).

Each test names the finding it pins; the fixes live in coordinator.py,
websocket/tasks_actions.py, __init__.py, runtime.py, notification_manager.py
and the battery-fleet / discovery helpers. Storage/flow findings of the same
round live next to their subjects (test_storage.py, test_options_flow.py,
test_ws_io.py).
"""

from __future__ import annotations

import time
from datetime import timedelta
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import ServiceValidationError
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_OVERDUE_ENABLED,
    CONF_NOTIFY_OVERDUE_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECT,
    CONF_QUIET_HOURS_ENABLED,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import async_dispatch_notify
from custom_components.maintenance_supporter.websocket.tasks_actions import ws_skip_task

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


def _global(hass: HomeAssistant, **options) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter",
        data=build_global_entry_data(), options=options, source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object(hass: HomeAssistant, task: dict, *, uid: str = "review_obj", **obj_over) -> MockConfigEntry:
    data = build_object_entry_data(tasks={TASK_ID_1: task})
    if obj_over:
        data[CONF_OBJECT] = {**data[CONF_OBJECT], **obj_over}
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Review object",
        data=data, source="user", unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


def _overdue_task(**over) -> dict:
    last = (dt_util.now().date() - timedelta(days=40)).isoformat()
    task = build_task_data(task_id=TASK_ID_1, name="Review task", last_performed=last, interval_days=30)
    task.update(over)
    return task


def _history(entry: MockConfigEntry) -> list[dict]:
    merged = entry.runtime_data.coordinator._get_merged_tasks_data()[TASK_ID_1]
    return list(merged.get("history") or [])


# ── skip_maintenance gates (finding B-3) ─────────────────────────────────


async def test_archived_task_refuses_skip(hass: HomeAssistant) -> None:
    """A stale notification button / old NFC sticker must not start a new
    cycle on a retired task — same gate complete_maintenance has had since
    the 2026-08-29 audit."""
    g = _global(hass)
    entry = _object(hass, _overdue_task(archived_at="2026-08-01T10:00:00+00:00", archived_reason="manual"))
    await setup_integration(hass, g, entry)
    before = _history(entry)

    with pytest.raises(ServiceValidationError) as exc:
        await entry.runtime_data.coordinator.skip_maintenance(TASK_ID_1)
    assert exc.value.translation_key == "task_inactive_skip"
    assert _history(entry) == before


async def test_paused_object_refuses_skip(hass: HomeAssistant) -> None:
    g = _global(hass)
    entry = _object(hass, _overdue_task(), paused_at="2026-08-01T10:00:00+00:00")
    await setup_integration(hass, g, entry)
    with pytest.raises(ServiceValidationError) as exc:
        await entry.runtime_data.coordinator.skip_maintenance(TASK_ID_1)
    assert exc.value.translation_key == "task_inactive_skip"


async def test_refused_skip_keeps_notification_state_and_double_tap_window(hass: HomeAssistant) -> None:
    """The cycle bookkeeping (notification state, double-tap window) was
    cleared BEFORE the #150 lock check — every refused skip re-armed the
    overdue push and forgot the just-recorded completion."""
    g = _global(hass)
    entry = _object(hass, _overdue_task(allow_skip=False))
    await setup_integration(hass, g, entry)
    coordinator = entry.runtime_data.coordinator
    coordinator._clear_notification_state = MagicMock()
    coordinator._recent_manual_completions[TASK_ID_1] = time.monotonic()

    with pytest.raises(ServiceValidationError):
        await coordinator.skip_maintenance(TASK_ID_1)

    coordinator._clear_notification_state.assert_not_called()
    assert TASK_ID_1 in coordinator._recent_manual_completions

    # A task that does not exist must not touch another's bookkeeping either.
    await coordinator.skip_maintenance("no-such-task")
    coordinator._clear_notification_state.assert_not_called()


async def test_ws_skip_reports_inactive_task_with_its_own_code(hass: HomeAssistant) -> None:
    g = _global(hass)
    entry = _object(hass, _overdue_task(enabled=False))
    await setup_integration(hass, g, entry)

    conn = make_ws_connection()
    await call_ws_handler(
        ws_skip_task,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/task/skip", "entry_id": entry.entry_id, "task_id": TASK_ID_1},
    )
    conn.send_result.assert_not_called()
    assert conn.send_error.call_args[0][1] == "task_inactive_skip"


# ── notification manager (findings B-5 / B-6) ────────────────────────────


_ACTION_OPTIONS = {
    CONF_NOTIFICATIONS_ENABLED: True,
    CONF_NOTIFY_SERVICE: "notify.mobile_app_phone",
    CONF_NOTIFY_OVERDUE_ENABLED: True,
    CONF_NOTIFY_OVERDUE_INTERVAL: 12,
    CONF_QUIET_HOURS_ENABLED: False,
    CONF_ACTION_COMPLETE_ENABLED: True,
    CONF_ACTION_SKIP_ENABLED: True,
    CONF_ACTION_SNOOZE_ENABLED: True,
}


async def _overdue_push_actions(hass: HomeAssistant, entry: MockConfigEntry) -> list[str]:
    """Fire an overdue status change for TASK_ID_1 and return the action ids
    the Companion payload carried."""
    nm = hass.data[DOMAIN]["_notification_manager"]
    # Setup already attempted (and rate-limit-recorded) the overdue push.
    nm._last_notified.clear()
    calls: list[dict] = []

    async def _capture(call: ServiceCall) -> None:
        calls.append(dict(call.data))

    hass.services.async_register("notify", "mobile_app_phone", _capture)
    await nm.async_task_status_changed(
        entry_id=entry.entry_id,
        task_id=TASK_ID_1,
        task_name="Review task",
        object_name="Review object",
        new_status=MaintenanceStatus.OVERDUE,
        days_until_due=-10,
    )
    await hass.async_block_till_done()
    assert len(calls) == 1, calls
    return [a["action"] for a in calls[0]["data"]["actions"]]


async def test_skip_locked_task_gets_no_skip_action_button(hass: HomeAssistant) -> None:
    """The Companion "Skip" button was offered for every task whenever the
    global option is on — on a #150 skip-locked task the tap could only fail
    in the action handler."""
    g = _global(hass, **_ACTION_OPTIONS)
    entry = _object(hass, _overdue_task(allow_skip=False))
    await setup_integration(hass, g, entry)

    actions = await _overdue_push_actions(hass, entry)
    assert [a.split("_")[1] for a in actions] == ["COMPLETE", "SNOOZE"]


async def test_unlocked_task_keeps_all_three_action_buttons(hass: HomeAssistant) -> None:
    g = _global(hass, **_ACTION_OPTIONS)
    entry = _object(hass, _overdue_task())
    await setup_integration(hass, g, entry)

    actions = await _overdue_push_actions(hass, entry)
    assert [a.split("_")[1] for a in actions] == ["COMPLETE", "SKIP", "SNOOZE"]


async def test_persistent_notification_link_follows_regional_language(hass: HomeAssistant) -> None:
    """The appended "Open task" link used the RAW HA language code — a
    pt-BR / zh-Hans profile fell through to English while every other
    string of the same notification was localized."""
    hass.config.language = "pt-BR"
    calls: list[dict] = []

    async def _capture(call: ServiceCall) -> None:
        calls.append(dict(call.data))

    hass.services.async_register("notify", "persistent_notification", _capture)
    await async_dispatch_notify(
        hass,
        "notify.persistent_notification",
        {"title": "T", "message": "Filter due", "data": {"url": "/maintenance-supporter?task_id=x"}},
        blocking=True,
    )

    assert len(calls) == 1
    from custom_components.maintenance_supporter.helpers.notification_manager import _NOTIFICATION_STRINGS

    expected = _NOTIFICATION_STRINGS["pt-br"]["open_task_link"]
    assert expected != _NOTIFICATION_STRINGS["en"]["open_task_link"]
    assert f"[{expected}](/maintenance-supporter?task_id=x)" in calls[0]["message"]
