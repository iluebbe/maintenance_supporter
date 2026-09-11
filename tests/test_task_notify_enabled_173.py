"""#173: per-task "no notifications", event-only without a notify service,
and the options flow exposing the 2.80 notification-rule settings.

Pins: ``notify_enabled`` is stored only when False (absence = on) and echoed
by the task summary; a muted task sends nothing — neither on its own status
change, nor inside a bundle (and it does not force one), nor as a lead-time
reminder; with ``notify_event_only`` on and NO notify service configured the
event still fires (status change, bundle, Settings test) — before, the send
was refused for lack of a target before the hook ran; and the options flow's
notification step carries both settings (template clipped to the registry
cap).
"""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import Event, HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_NOTIFICATION_BUNDLE_THRESHOLD,
    CONF_NOTIFICATION_BUNDLING_ENABLED,
    CONF_NOTIFY_EVENT_ONLY,
    CONF_NOTIFY_EXTRA_DATA,
    CONF_QUIET_HOURS_ENABLED,
    CONF_REMINDER_LEAD_DAYS,
    CONF_TASKS,
    DOMAIN,
    EVENT_NOTIFICATION,
    GLOBAL_UNIQUE_ID,
    MAX_NOTIFY_EXTRA_DATA_LENGTH,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


def _global(hass: HomeAssistant, *, notify_service: str = "notify.test", **options: object) -> MockConfigEntry:
    data = build_global_entry_data(notifications_enabled=True, notify_service=notify_service)
    data[CONF_QUIET_HOURS_ENABLED] = False  # the default quiet hours would silence a night-time run
    data.update(options)
    entry = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Maintenance Supporter", data=data, source="user", unique_id=GLOBAL_UNIQUE_ID)
    entry.add_to_hass(hass)
    return entry


def _days_ago(n: int) -> str:
    return (dt_util.now().date() - timedelta(days=n)).isoformat()


def _object(hass: HomeAssistant, tasks: dict, *, uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(object_data=build_object_data(name="Pool Pump"), tasks=tasks),
        source="user",
        unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


def _capture(hass: HomeAssistant) -> list[Event]:
    events: list[Event] = []
    hass.bus.async_listen(EVENT_NOTIFICATION, events.append)
    return events


# ─── storage shape + summary ───────────────────────────────────────────────


async def test_notify_enabled_stored_only_when_false_and_echoed(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket import _build_task_summary
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task, ws_update_task

    g = _global(hass)
    obj = _object(hass, {TASK_ID_1: build_task_data(last_performed=_days_ago(20))}, uid="mute_ws")
    await setup_integration(hass, g, obj)
    conn = make_ws_connection()

    await call_ws_handler(ws_update_task, hass, conn, {"id": 1, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "notify_enabled": False})
    task = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert task["notify_enabled"] is False
    assert _build_task_summary(hass, TASK_ID_1, task, None)["notify_enabled"] is False

    await call_ws_handler(ws_update_task, hass, conn, {"id": 2, "type": "x", "entry_id": obj.entry_id, "task_id": TASK_ID_1, "notify_enabled": True})
    task = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][TASK_ID_1]
    assert "notify_enabled" not in task, "True is the default — never persisted"
    assert _build_task_summary(hass, TASK_ID_1, task, None)["notify_enabled"] is True

    await call_ws_handler(ws_create_task, hass, conn, {"id": 3, "type": "x", "entry_id": obj.entry_id, "name": "Quiet task", "notify_enabled": False})
    tasks = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS]
    new_id = next(tid for tid, t in tasks.items() if t.get("name") == "Quiet task")
    assert tasks[new_id]["notify_enabled"] is False


# ─── the mute itself ────────────────────────────────────────────────────────


async def test_muted_task_sends_nothing_on_status_change(hass: HomeAssistant) -> None:
    g = _global(hass)
    loud = build_task_data(name="Loud", last_performed=_days_ago(40))
    quiet = build_task_data(task_id=TASK_ID_2, name="Quiet", last_performed=_days_ago(40))
    quiet["notify_enabled"] = False
    obj = _object(hass, {TASK_ID_1: loud, TASK_ID_2: quiet}, uid="mute_status")
    await setup_integration(hass, g, obj)
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
    coordinator._previous_statuses = {}
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    notify = AsyncMock()
    results = {
        TASK_ID_1: {"name": "Loud", "_status": MaintenanceStatus.OVERDUE, "_days_until_due": -10},
        TASK_ID_2: {"name": "Quiet", "_status": MaintenanceStatus.OVERDUE, "_days_until_due": -10},
    }
    with patch.object(nm, "async_task_status_changed", notify):
        await coordinator._async_notify_status_changes(results)
    assert notify.await_count == 1
    assert notify.await_args.kwargs["task_name"] == "Loud"
    # The cache still learns the muted task's status (no spurious "change" later).
    assert coordinator._previous_statuses[TASK_ID_2] == MaintenanceStatus.OVERDUE


async def test_muted_task_neither_forces_nor_rides_in_a_bundle(hass: HomeAssistant) -> None:
    g = _global(hass, **{CONF_NOTIFICATION_BUNDLING_ENABLED: True, CONF_NOTIFICATION_BUNDLE_THRESHOLD: 2})
    loud = build_task_data(name="Loud", last_performed=_days_ago(40))
    quiet = build_task_data(task_id=TASK_ID_2, name="Quiet", last_performed=_days_ago(40))
    quiet["notify_enabled"] = False
    obj = _object(hass, {TASK_ID_1: loud, TASK_ID_2: quiet}, uid="mute_bundle")
    await setup_integration(hass, g, obj)
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
    coordinator._previous_statuses = {}
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    single, bundled = AsyncMock(), AsyncMock()
    results = {
        TASK_ID_1: {"name": "Loud", "_status": MaintenanceStatus.OVERDUE, "_days_until_due": -10},
        TASK_ID_2: {"name": "Quiet", "_status": MaintenanceStatus.OVERDUE, "_days_until_due": -10},
    }
    with patch.object(nm, "async_task_status_changed", single), patch.object(nm, "async_send_bundled", bundled):
        await coordinator._async_notify_status_changes(results)
    assert not bundled.called, "one loud task is below the threshold — the muted one must not count"
    assert single.await_count == 1 and single.await_args.kwargs["task_name"] == "Loud"


async def test_muted_task_gets_no_lead_reminder(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter import async_maybe_send_lead_reminders

    g = _global(hass, **{CONF_REMINDER_LEAD_DAYS: [14]})
    hit = build_task_data(name="Hit", interval_days=30, last_performed=_days_ago(16))
    muted = build_task_data(task_id=TASK_ID_2, name="Muted", interval_days=30, last_performed=_days_ago(16))
    muted["notify_enabled"] = False
    obj = _object(hass, {TASK_ID_1: hit, TASK_ID_2: muted}, uid="mute_lead")
    await setup_integration(hass, g, obj)
    nm = MagicMock()
    nm.async_send_lead_reminder = AsyncMock()
    hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] = nm

    await async_maybe_send_lead_reminders(hass)

    nm.async_send_lead_reminder.assert_awaited_once()
    assert nm.async_send_lead_reminder.await_args.kwargs["task_name"] == "Hit"


# ─── event-only without a notify service ────────────────────────────────────


async def test_event_only_without_a_service_still_fires_the_status_event(hass: HomeAssistant) -> None:
    g = _global(hass, notify_service="", **{CONF_NOTIFY_EVENT_ONLY: True})
    obj = _object(hass, {TASK_ID_1: build_task_data(name="Filter", last_performed=_days_ago(40))}, uid="eo_status")
    await setup_integration(hass, g, obj)
    events = _capture(hass)
    mgr = NotificationManager(hass)
    sent = await mgr.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Pool Pump", new_status=MaintenanceStatus.OVERDUE, days_until_due=-3)
    await hass.async_block_till_done()
    assert sent is not False
    assert len(events) == 1
    assert events[0].data["target"] is None
    assert events[0].data["task_name"] == "Filter"


async def test_event_only_without_a_service_fires_the_bundle_event(hass: HomeAssistant) -> None:
    g = _global(hass, notify_service="", **{CONF_NOTIFY_EVENT_ONLY: True})
    obj = _object(hass, {TASK_ID_1: build_task_data(name="Filter", last_performed=_days_ago(40))}, uid="eo_bundle")
    await setup_integration(hass, g, obj)
    events = _capture(hass)
    mgr = NotificationManager(hass)
    await mgr.async_send_bundled(entry_id=obj.entry_id, object_name="Pool Pump", tasks=[{"task_id": TASK_ID_1, "task_name": "Filter", "status": MaintenanceStatus.OVERDUE, "days_until_due": -3}, {"task_id": TASK_ID_2, "task_name": "Pump", "status": MaintenanceStatus.DUE_SOON, "days_until_due": 2}])
    await hass.async_block_till_done()
    assert len(events) == 1 and events[0].data["kind"] == "bundle"


async def test_send_test_without_a_service_succeeds_in_event_only_mode(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.config_flow_options_global import send_test_notification

    entry = _global(hass, notify_service="", **{CONF_NOTIFY_EVENT_ONLY: True, CONF_NOTIFY_EXTRA_DATA: '{"category": "maintenance"}'})
    events = _capture(hass)
    assert await send_test_notification(hass, dict(entry.data)) == "success"
    await hass.async_block_till_done()
    assert events[0].data["kind"] == "test"
    assert events[0].data["data"]["category"] == "maintenance"

    # Without event-only an empty service is still "no_service".
    plain = build_global_entry_data(notifications_enabled=True, notify_service="")
    assert await send_test_notification(hass, plain) == "no_service"


async def test_without_event_only_an_empty_service_is_still_refused(hass: HomeAssistant) -> None:
    g = _global(hass, notify_service="")
    obj = _object(hass, {TASK_ID_1: build_task_data(name="Filter", last_performed=_days_ago(40))}, uid="eo_off")
    await setup_integration(hass, g, obj)
    events = _capture(hass)
    mgr = NotificationManager(hass)
    sent = await mgr.async_task_status_changed(entry_id=obj.entry_id, task_id=TASK_ID_1, task_name="Filter", object_name="Pool Pump", new_status=MaintenanceStatus.OVERDUE, days_until_due=-3)
    await hass.async_block_till_done()
    assert not sent and not events


# ─── options flow carries the two settings ───────────────────────────────────


@pytest.mark.usefixtures("hass")
async def test_options_flow_notification_step_carries_the_rule_settings(hass: HomeAssistant) -> None:
    g = _global(hass)
    await setup_integration(hass, g)
    result = await hass.config_entries.options.async_init(g.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "notification_settings"})
    assert result["type"] == FlowResultType.FORM
    keys = {str(k) for k in result["data_schema"].schema}
    assert {CONF_NOTIFY_EVENT_ONLY, CONF_NOTIFY_EXTRA_DATA} <= keys

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        user_input={CONF_NOTIFY_EVENT_ONLY: True, CONF_NOTIFY_EXTRA_DATA: "x" * (MAX_NOTIFY_EXTRA_DATA_LENGTH + 50)},
    )
    assert result["type"] == FlowResultType.MENU
    opts = g.options or g.data
    assert opts[CONF_NOTIFY_EVENT_ONLY] is True
    assert len(opts[CONF_NOTIFY_EXTRA_DATA]) == MAX_NOTIFY_EXTRA_DATA_LENGTH
