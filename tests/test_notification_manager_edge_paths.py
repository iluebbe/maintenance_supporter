"""NotificationManager — the refusal and failure paths of the send pipeline.

What the user must be able to rely on: a corrupt bookkeeping file does not
break loading, a quiet-hours summary that could not go out keeps its held
reminders for the next attempt, the daily limit and the per-task mute also
hold for bundles / lead reminders / budget alerts, and dismissing a reminder
on the phone survives a broken or missing notify service.
"""

from __future__ import annotations

import logging
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant, ServiceCall, ServiceRegistry
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_QUIET_HOURS_ENABLED,
    CONF_QUIET_HOURS_START,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.notification_manager import (
    STATE_STORE_KEY,
    STATE_STORE_VERSION,
    NotificationManager,
    notification_key,
)

from .conftest import TASK_ID_1, build_task_data, make_global_entry, make_object_entry

_NM_MOD = "custom_components.maintenance_supporter.helpers.notification_manager"
_HELD = {
    notification_key("e1", "t1", MaintenanceStatus.OVERDUE): {
        "entry_id": "e1",
        "task_id": "t1",
        "task_name": "Filter",
        "object_name": "Pool",
        "status": MaintenanceStatus.OVERDUE,
    }
}


def _global(hass: HomeAssistant, *, enabled: bool = True, max_per_day: int = 0, **extra: Any) -> None:
    make_global_entry(
        hass,
        notifications_enabled=enabled,
        notify_service="notify.mobile_app",
        options={
            CONF_NOTIFICATIONS_ENABLED: enabled,
            CONF_NOTIFY_SERVICE: "notify.mobile_app",
            CONF_QUIET_HOURS_ENABLED: False,
            CONF_MAX_NOTIFICATIONS_PER_DAY: max_per_day,
            **extra,
        },
    )


def _manager(hass: HomeAssistant) -> tuple[NotificationManager, AsyncMock]:
    nm = NotificationManager(hass)
    sent = AsyncMock(return_value=True)
    patch.object(nm, "_resolve_and_send", sent).start()
    return nm, sent


def _spend_the_daily_limit(nm: NotificationManager, count: int) -> None:
    nm._daily_reset_date = dt_util.now().date()
    nm._daily_count = count


# ─── persistence + quiet-hours bookkeeping ───────────────────────────────


async def test_a_corrupt_daily_counter_loads_as_zero(hass: HomeAssistant, hass_storage: dict[str, Any]) -> None:
    today = dt_util.now().date().isoformat()
    hass_storage[STATE_STORE_KEY] = {
        "version": STATE_STORE_VERSION,
        "minor_version": 1,
        "key": STATE_STORE_KEY,
        "data": {"daily_count": "a lot", "daily_reset_date": today, "lead_sent": {"e1_t1_14": today}},
    }
    _global(hass)
    nm = NotificationManager(hass)

    await nm.async_load()

    assert nm._daily_count == 0
    assert nm._lead_sent == {"e1_t1_14": today}  # the rest of the file still loads


async def test_an_unparseable_quiet_start_still_yields_a_stable_period(hass: HomeAssistant) -> None:
    """The skip is logged once per quiet period; a hand-edited start time
    that is not a time must not raise — the period falls back to midnight."""
    _global(hass, **{CONF_QUIET_HOURS_START: "late evening"})
    nm = NotificationManager(hass)

    assert nm._quiet_period_id() == f"{dt_util.now().date().isoformat()}Tlate evening"


async def test_quiet_summary_waits_while_notifications_are_off(hass: HomeAssistant) -> None:
    _global(hass, enabled=False)
    nm, _ = _manager(hass)
    nm._quiet_held = dict(_HELD)
    dispatch = AsyncMock(return_value=True)

    with patch(f"{_NM_MOD}.async_emit_and_dispatch", dispatch):
        assert await nm.async_flush_quiet_held() is False

    dispatch.assert_not_awaited()
    assert nm._quiet_held == _HELD


@pytest.mark.parametrize("outcome", ["raises", "not_delivered"])
async def test_an_undelivered_quiet_summary_keeps_the_held_reminders(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture, outcome: str
) -> None:
    _global(hass)
    nm, _ = _manager(hass)
    nm._quiet_held = dict(_HELD)
    dispatch = (
        AsyncMock(side_effect=HomeAssistantError("notify service down")) if outcome == "raises" else AsyncMock(return_value=False)
    )

    with patch(f"{_NM_MOD}.async_emit_and_dispatch", dispatch), caplog.at_level(logging.ERROR):
        assert await nm.async_flush_quiet_held() is False

    assert nm._quiet_held == _HELD, "held reminders must survive for the next attempt"
    assert nm._daily_count == 0
    assert notification_key("e1", "t1", MaintenanceStatus.OVERDUE) not in nm._last_notified
    assert ("Failed to send the quiet-hours summary" in caplog.text) is (outcome == "raises")


# ─── bundles ─────────────────────────────────────────────────────────────


async def test_a_bundle_during_quiet_hours_is_held_member_by_member(hass: HomeAssistant) -> None:
    _global(hass)
    nm, sent = _manager(hass)
    members = [
        {"task_id": "t1", "task_name": "Filter", "status": MaintenanceStatus.OVERDUE, "days_until_due": -2},
        {"task_id": "t2", "task_name": "Pump", "status": MaintenanceStatus.DUE_SOON, "days_until_due": 3},
        {"task_name": "untracked row", "status": MaintenanceStatus.OVERDUE},
    ]

    with patch.object(nm, "_is_quiet_hours", return_value=True):
        await nm.async_send_bundled("e1", "Pool", members)

    sent.assert_not_awaited()
    held = nm._quiet_held
    assert set(held) == {
        notification_key("e1", "t1", MaintenanceStatus.OVERDUE),
        notification_key("e1", "t2", MaintenanceStatus.DUE_SOON),
    }
    assert held[notification_key("e1", "t1", MaintenanceStatus.OVERDUE)]["object_name"] == "Pool"
    assert held[notification_key("e1", "t2", MaintenanceStatus.DUE_SOON)]["days_until_due"] == 3


async def test_a_bundle_over_the_daily_limit_is_deferred_not_sent(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=2)
    nm, sent = _manager(hass)
    _spend_the_daily_limit(nm, 2)
    members = [{"task_id": "t1", "task_name": "Filter", "status": MaintenanceStatus.OVERDUE}]

    with patch(f"{_NM_MOD}.async_emit_and_dispatch", AsyncMock(return_value=True)) as dispatch:
        await nm.async_send_bundled("e1", "Pool", members)

    sent.assert_not_awaited()
    dispatch.assert_not_awaited()
    assert "e1_t1" in nm._deferred_today  # offered again at the next refresh
    assert notification_key("e1", "t1", MaintenanceStatus.OVERDUE) not in nm._last_notified


# ─── lead reminders + budget alerts ───────────────────────────────────────


async def test_a_muted_task_gets_no_lead_reminder(hass: HomeAssistant) -> None:
    _global(hass)
    task = build_task_data(name="Descale")
    task["notify_enabled"] = False
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Coffee Machine", uid="nm_muted")
    nm, sent = _manager(hass)

    await nm.async_send_lead_reminder(obj.entry_id, TASK_ID_1, "Descale", "Coffee Machine", 3)

    sent.assert_not_awaited()
    assert nm._lead_sent == {}


async def test_a_lead_reminder_over_the_daily_limit_is_not_stamped(hass: HomeAssistant) -> None:
    """Only a delivered lead is stamped — so the noon retry can still send it."""
    _global(hass, max_per_day=1)
    nm, sent = _manager(hass)
    _spend_the_daily_limit(nm, 1)

    await nm.async_send_lead_reminder("e1", "t1", "Filter", "Pool", 7)

    sent.assert_not_awaited()
    assert nm._lead_sent == {}
    assert "e1_t1" in nm._deferred_today


async def test_a_budget_alert_respects_the_daily_limit(hass: HomeAssistant) -> None:
    _global(hass, max_per_day=3)
    nm, _ = _manager(hass)
    _spend_the_daily_limit(nm, 3)

    with patch(f"{_NM_MOD}.async_emit_and_dispatch", AsyncMock(return_value=True)) as dispatch:
        await nm.async_budget_alert("monthly", spent=120.0, budget=100.0)

    dispatch.assert_not_awaited()
    assert nm._daily_count == 3
    # The alert was not rate-limit stamped either: it can go out tomorrow.
    assert "_budget_monthly" not in nm._last_notified


# ─── dismissing a reminder on the phone ───────────────────────────────────


def _register_notify(hass: HomeAssistant, name: str) -> list[dict[str, Any]]:
    calls: list[dict[str, Any]] = []

    async def _handler(call: ServiceCall) -> None:
        calls.append(dict(call.data))

    hass.services.async_register("notify", name, _handler)
    return calls


async def test_dismiss_skips_unknown_and_broken_services_but_clears_the_rest(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    _global(hass)
    nm = NotificationManager(hass)
    main_calls = _register_notify(hass, "mobile_app")
    _register_notify(hass, "broken_phone")
    real_call = ServiceRegistry.async_call

    async def _flaky(self: ServiceRegistry, domain: str, service: str, *args: Any, **kwargs: Any) -> Any:
        if service == "broken_phone":
            raise HomeAssistantError("phone unreachable")
        return await real_call(self, domain, service, *args, **kwargs)

    with (
        patch(f"{_NM_MOD}.get_user_notify_services", AsyncMock(return_value=["notify.broken_phone", "notify.gone_phone"])),
        patch.object(ServiceRegistry, "async_call", _flaky),
        caplog.at_level(logging.DEBUG, logger=_NM_MOD),
    ):
        await nm.async_dismiss_task_notification("t1", responsible_user_id="user-1")
        await hass.async_block_till_done()

    assert main_calls == [{"message": "clear_notification", "data": {"tag": "maintenance_t1"}}]
    assert "Failed to dismiss notification for tag maintenance_t1 on notify.broken_phone" in caplog.text


async def test_dismiss_survives_a_failing_user_lookup(hass: HomeAssistant) -> None:
    _global(hass)
    nm = NotificationManager(hass)
    main_calls = _register_notify(hass, "mobile_app")

    with patch(f"{_NM_MOD}.get_user_notify_services", AsyncMock(side_effect=RuntimeError("auth store locked"))):
        await nm.async_dismiss_task_notification("t9", responsible_user_id="user-2")
        await hass.async_block_till_done()

    assert main_calls == [{"message": "clear_notification", "data": {"tag": "maintenance_t9"}}]
