"""Bug audit 2026-09-12 — notifications, chokepoint, lifecycle, options flow.

Each test pins one finding of the audit round (see CHANGELOG):
lead reminders sent twice a day, the startup seed re-run on every reload,
a bundle repeating hourly, a post-completion re-activation lifting the
cooldown, the stale repair issue in event-only mode, dismissals that missed
the responsible person's devices, the same-day backfill split, the text
index outliving the last object entry, and the options flow storing floats
for int settings / never clearing the extra-data template.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, Mock, patch

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFY_EVENT_ONLY,
    CONF_NOTIFY_EXTRA_DATA,
    CONF_QUIET_HOURS_ENABLED,
    DOCUMENT_TEXT_INDEX_KEY,
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
    ScheduleType,
)
from custom_components.maintenance_supporter.helpers.notification_manager import _SENT_ONCE, NotificationManager

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    make_global_entry,
    setup_integration,
)
from .test_audit_2026_08_29 import _completed, _object, _overdue_task


def _global(hass: HomeAssistant, **options: Any) -> MockConfigEntry:
    return make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: False, **options},
    )


def _notify(hass: HomeAssistant, name: str = "test") -> AsyncMock:
    calls = AsyncMock()
    hass.services.async_register("notify", name, calls)
    return calls


# ─── lead reminders: once per task, lead and day ────────────────────────────


async def test_lead_reminder_is_sent_once_per_day_but_survives_a_quiet_morning(hass: HomeAssistant) -> None:
    _global(hass)
    calls = _notify(hass)
    nm = NotificationManager(hass)
    kw = {"entry_id": "e1", "task_id": "t1", "task_name": "Filter", "object_name": "Pump", "days": 3}
    await nm.async_send_lead_reminder(**kw)
    await nm.async_send_lead_reminder(**kw)  # the noon retry
    await hass.async_block_till_done()
    assert calls.await_count == 1, "08:00 delivered → noon is a no-op"
    # A different lead of the same task is its own reminder.
    await nm.async_send_lead_reminder(**{**kw, "days": 0})
    await hass.async_block_till_done()
    assert calls.await_count == 2
    # Quiet hours at 08:00 → nothing stamped → the noon retry delivers.
    nm2 = NotificationManager(hass)
    with patch.object(nm2, "_is_quiet_hours", return_value=True):
        await nm2.async_send_lead_reminder(**kw)
    await nm2.async_send_lead_reminder(**kw)
    await hass.async_block_till_done()
    assert calls.await_count == 3


# ─── startup seed: once per entry per process ───────────────────────────────


async def test_reload_does_not_reseed_a_pending_notification(hass: HomeAssistant) -> None:
    g = _global(hass)
    entry = _object(hass, _overdue_task(), uid="seed_once")
    await setup_integration(hass, g, entry)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    key = f"{entry.entry_id}_{TASK_ID_1}_{MaintenanceStatus.OVERDUE}"
    assert key in nm._last_notified, "the first refresh after startup seeds"
    assert nm.begin_startup_seed(entry.entry_id) is False
    # The overdue reminder was suppressed (quiet hours / cap): nothing stamped.
    nm._last_notified.clear()
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert key not in nm._last_notified, "a reload must not mark the pending reminder as sent"


# ─── bundles ride the per-task repeat state ─────────────────────────────────


async def test_bundle_announces_only_due_tasks_and_stamps_them(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import CONF_NOTIFY_OVERDUE_INTERVAL

    _global(hass, **{CONF_NOTIFY_OVERDUE_INTERVAL: 12})
    calls = _notify(hass)
    nm = NotificationManager(hass)
    tasks = [
        {"task_id": "a", "task_name": "Alpha", "status": MaintenanceStatus.OVERDUE, "days_until_due": -1},
        {"task_id": "b", "task_name": "Beta", "status": MaintenanceStatus.OVERDUE, "days_until_due": -2},
    ]
    await nm.async_send_bundled(entry_id="e1", object_name="Pump", tasks=tasks)
    await hass.async_block_till_done()
    assert calls.await_count == 1
    for tid in ("a", "b"):
        assert f"e1_{tid}_{MaintenanceStatus.OVERDUE}" in nm._last_notified, "bundled tasks are stamped like single sends"
    # An hour later (bundle rate limit gone) both tasks are still inside their
    # 12 h interval → no repeat.
    nm._last_notified.pop("e1_bundled")
    await nm.async_send_bundled(entry_id="e1", object_name="Pump", tasks=tasks)
    await hass.async_block_till_done()
    assert calls.await_count == 1
    # Alpha's interval elapsed → a bundle with Alpha only.
    nm._last_notified[f"e1_a_{MaintenanceStatus.OVERDUE}"] = dt_util.now() - timedelta(hours=13)
    await nm.async_send_bundled(entry_id="e1", object_name="Pump", tasks=tasks)
    await hass.async_block_till_done()
    assert calls.await_count == 2
    message = calls.call_args[0][0].data["message"]
    assert "Alpha" in message and "Beta" not in message
    # A "notify once" status never rides a bundle twice.
    nm._last_notified[f"e1_c_{MaintenanceStatus.TRIGGERED}"] = _SENT_ONCE
    nm._last_notified.pop("e1_bundled")
    await nm.async_send_bundled(entry_id="e1", object_name="Pump", tasks=[{"task_id": "c", "task_name": "Gamma", "status": MaintenanceStatus.TRIGGERED, "days_until_due": None}])
    await hass.async_block_till_done()
    assert calls.await_count == 2


# ─── a re-activation right after Complete is not an edge ────────────────────


async def test_reactivation_without_recovery_keeps_the_completion_cooldown(hass: HomeAssistant) -> None:
    g = _global(hass)
    hass.states.async_set("sensor.salt", "5")
    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(last_performed=last, schedule_type=ScheduleType.SENSOR_BASED, trigger_config={"type": "threshold", "entity_id": "sensor.salt", "entity_ids": ["sensor.salt"], "trigger_below": 10})
    obj = MockConfigEntry(version=1, minor_version=1, domain=DOMAIN, title="Softener", data=build_object_entry_data(object_data=build_object_data(name="Softener"), tasks={TASK_ID_1: task}), source="user", unique_id="maintenance_supporter_salt")
    obj.add_to_hass(hass)
    await setup_integration(hass, g, obj)
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator
    await hass.async_block_till_done()
    # Complete while the sensor still reads low (the user is on the way to refill).
    await coordinator.complete_maintenance(TASK_ID_1, unattended=True, source="panel")
    await hass.async_block_till_done()
    assert TASK_ID_1 in coordinator._recently_completed
    with patch.object(coordinator, "note_trigger_edge", wraps=coordinator.note_trigger_edge) as edge:
        hass.states.async_set("sensor.salt", "4")  # still below → re-activates, but no edge
        await hass.async_block_till_done()
        assert edge.call_args.kwargs == {"recovered": False}, "still-low is not a new edge"
        assert TASK_ID_1 in coordinator._recently_completed
        hass.states.async_set("sensor.salt", "40")  # refilled
        await hass.async_block_till_done()
        hass.states.async_set("sensor.salt", "3")  # a genuine new edge
        await hass.async_block_till_done()
        assert edge.call_args.kwargs == {"recovered": True}
    assert TASK_ID_1 not in coordinator._recently_completed
    # After a RESET (no work done) a still-low sensor re-triggers at once.
    await coordinator.reset_maintenance(TASK_ID_1, date=dt_util.now().date() - timedelta(days=40))
    await hass.async_block_till_done()
    hass.states.async_set("sensor.salt", "2")
    await hass.async_block_till_done()
    assert TASK_ID_1 not in coordinator._recently_completed


# ─── event-only: no repair issue for a stale service name ───────────────────


async def test_event_only_mode_raises_no_missing_service_issue(hass: HomeAssistant) -> None:
    _global(hass, **{CONF_NOTIFY_EVENT_ONLY: True})
    nm = NotificationManager(hass)
    assert nm.notify_service == "notify.test" and nm.event_only
    nm.async_verify_configured_service()
    assert nm._notify_issue_active is False


# ─── dismissal reaches the responsible person's devices ─────────────────────


async def test_dismissal_clears_the_household_and_the_responsible_persons_devices(hass: HomeAssistant) -> None:
    _global(hass)
    household = _notify(hass, "test")
    phone = _notify(hass, "mobile_app_ben")
    nm = NotificationManager(hass)
    with patch("custom_components.maintenance_supporter.helpers.notification_manager.get_user_notify_services", AsyncMock(return_value=["notify.mobile_app_ben"])):
        await nm.async_dismiss_task_notification("t1", responsible_user_id="ben")
    await hass.async_block_till_done()
    for svc in (household, phone):
        assert svc.await_count == 1
        assert svc.call_args[0][0].data == {"message": "clear_notification", "data": {"tag": "maintenance_t1"}}
    # Without a person only the household service is cleared.
    await nm.async_dismiss_task_notification("t2")
    await hass.async_block_till_done()
    assert household.await_count == 2 and phone.await_count == 1


# ─── same-day earlier completion is a backfill for parts AND history ────────


async def test_same_day_earlier_completion_is_a_backfill_everywhere(hass: HomeAssistant) -> None:
    g = _global(hass)
    task = _overdue_task(consumes_parts=[{"part_id": "p1", "quantity": 1}])
    entry = _object(hass, task, uid="same_day", parts={"p1": {"id": "p1", "name": "Filter", "unit": "pcs"}})
    await setup_integration(hass, g, entry)
    store = entry.runtime_data.store
    store.set_part_stock("p1", 5)
    coordinator = entry.runtime_data.coordinator
    await coordinator.complete_maintenance(TASK_ID_1, unattended=True)
    assert store.get_part_stock("p1") == 4
    await coordinator.complete_maintenance(TASK_ID_1, unattended=True, completed_at=dt_util.now() - timedelta(hours=1))
    assert store.get_part_stock("p1") == 4, "an earlier same-day completion is a backfill"
    backfill = [h for h in _completed(entry) if not h.get("used_parts")]
    assert backfill, "and its history entry records no consumed parts either"


# ─── the text index dies with the last entry ────────────────────────────────


async def test_text_index_is_cancelled_when_the_last_object_entry_unloads(hass: HomeAssistant) -> None:
    g = _global(hass)
    entry = _object(hass, _overdue_task(), uid="idx")
    await setup_integration(hass, g, entry)
    index = hass.data[DOMAIN][DOCUMENT_TEXT_INDEX_KEY]
    index.cancel = Mock(wraps=index.cancel)  # type: ignore[method-assign]
    await hass.config_entries.async_remove(g.entry_id)
    await hass.async_block_till_done()
    assert index.cancel.call_count == 1
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert index.cancel.call_count == 2, "the object entry was the last one → cancel again"
    assert DOMAIN not in hass.data


# ─── options flow: ints stay ints, the template can be cleared ──────────────


async def test_options_flow_stores_ints_for_int_settings_and_offers_a_clearable_template(hass: HomeAssistant) -> None:
    g = _global(hass, **{CONF_NOTIFY_EXTRA_DATA: '{"a": 1}'})
    await setup_integration(hass, g)
    result = await hass.config_entries.options.async_init(g.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "general_settings"})
    assert result["type"] == FlowResultType.FORM
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={CONF_DEFAULT_WARNING_DAYS: 9.0})
    stored = g.options[CONF_DEFAULT_WARNING_DAYS]
    assert stored == 9 and isinstance(stored, int) and not isinstance(stored, float)

    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "notification_settings"})
    assert result["type"] == FlowResultType.FORM
    marker = next(k for k in result["data_schema"].schema if getattr(k, "schema", None) == CONF_NOTIFY_EXTRA_DATA)
    assert marker.default() == '{"a": 1}', "the field carries a default, so an emptied field submits '' instead of vanishing"
    await hass.config_entries.options.async_configure(result["flow_id"], user_input={CONF_NOTIFY_EXTRA_DATA: ""})
    assert g.options[CONF_NOTIFY_EXTRA_DATA] == ""
