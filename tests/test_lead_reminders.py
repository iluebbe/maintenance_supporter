"""Tests for multiple lead-time reminders (``reminder_lead_days``).

An opt-in list of days-before-due (e.g. [14, 3, 0]); the daily tick fires one
extra reminder for every active task whose days-until-due matches a configured
lead. Complements — does not replace — the warning_days status-change path;
overdue repetition stays with ``notify_overdue_interval_hours``.
"""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import AsyncMock, MagicMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import (
    DOMAIN,
    async_maybe_send_lead_reminders,
)
from custom_components.maintenance_supporter.const import (
    CONF_REMINDER_LEAD_DAYS,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)

TASK_ID_2 = "b" * 32


def _iso_days_ago(n: int) -> str:
    return (dt_util.now().date() - timedelta(days=n)).isoformat()


def _global(hass: HomeAssistant, leads: list[int] | None) -> MockConfigEntry:
    data = build_global_entry_data(notifications_enabled=True, notify_service="notify.test")
    if leads is not None:
        data[CONF_REMINDER_LEAD_DAYS] = leads
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter", data=data,
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _object(hass: HomeAssistant, tasks: dict, *, uid: str) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Pool Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Pool Pump"), tasks=tasks,
        ),
        source="user", unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


def _mock_nm(hass: HomeAssistant) -> MagicMock:
    nm = MagicMock()
    nm.async_send_lead_reminder = AsyncMock()
    hass.data.setdefault(DOMAIN, {})["_notification_manager"] = nm
    return nm


# ─── Gating (async_maybe_send_lead_reminders) ───────────────────────────────


async def test_lead_reminder_fires_on_matching_day(hass: HomeAssistant) -> None:
    """A task due in exactly 14 days gets a lead reminder with days=14."""
    _global(hass, [14, 3])
    obj = _object(hass, {
        # interval 30, last performed 16 days ago → due in 14 days
        TASK_ID_1: build_task_data(
            name="Hit", interval_days=30, last_performed=_iso_days_ago(16),
        ),
        # due in 10 days → no configured lead matches
        TASK_ID_2: build_task_data(
            task_id=TASK_ID_2, name="Miss", interval_days=30,
            last_performed=_iso_days_ago(20),
        ),
    }, uid="lead_hit")
    await setup_integration(hass, hass.config_entries.async_entries(DOMAIN)[0], obj)
    nm = _mock_nm(hass)

    await async_maybe_send_lead_reminders(hass)

    nm.async_send_lead_reminder.assert_awaited_once()
    kwargs = nm.async_send_lead_reminder.await_args.kwargs
    assert kwargs["task_name"] == "Hit"
    assert kwargs["days"] == 14
    assert kwargs["object_name"] == "Pool Pump"


async def test_lead_zero_fires_on_due_date(hass: HomeAssistant) -> None:
    """lead 0 = 'on the due date'."""
    _global(hass, [0])
    obj = _object(hass, {
        TASK_ID_1: build_task_data(
            name="Due Today", interval_days=30, last_performed=_iso_days_ago(30),
        ),
    }, uid="lead_zero")
    await setup_integration(hass, hass.config_entries.async_entries(DOMAIN)[0], obj)
    nm = _mock_nm(hass)

    await async_maybe_send_lead_reminders(hass)
    assert nm.async_send_lead_reminder.await_args.kwargs["days"] == 0


async def test_no_leads_configured_is_noop(hass: HomeAssistant) -> None:
    _global(hass, None)
    obj = _object(hass, {
        TASK_ID_1: build_task_data(interval_days=30, last_performed=_iso_days_ago(16)),
    }, uid="lead_off")
    await setup_integration(hass, hass.config_entries.async_entries(DOMAIN)[0], obj)
    nm = _mock_nm(hass)

    await async_maybe_send_lead_reminders(hass)
    nm.async_send_lead_reminder.assert_not_awaited()


async def test_overdue_task_not_lead_reminded(hass: HomeAssistant) -> None:
    """Negative days-until-due belong to the overdue path, never to leads."""
    _global(hass, [0, 3])
    obj = _object(hass, {
        TASK_ID_1: build_task_data(
            name="Late", interval_days=30, last_performed=_iso_days_ago(60),
        ),
    }, uid="lead_overdue")
    await setup_integration(hass, hass.config_entries.async_entries(DOMAIN)[0], obj)
    nm = _mock_nm(hass)

    await async_maybe_send_lead_reminders(hass)
    nm.async_send_lead_reminder.assert_not_awaited()


async def test_disabled_task_not_reminded(hass: HomeAssistant) -> None:
    _global(hass, [14])
    obj = _object(hass, {
        TASK_ID_1: build_task_data(
            interval_days=30, last_performed=_iso_days_ago(16), enabled=False,
        ),
    }, uid="lead_disabled")
    await setup_integration(hass, hass.config_entries.async_entries(DOMAIN)[0], obj)
    nm = _mock_nm(hass)

    await async_maybe_send_lead_reminders(hass)
    nm.async_send_lead_reminder.assert_not_awaited()


# ─── NM send path (async_send_lead_reminder) ────────────────────────────────


async def test_send_lead_reminder_uses_due_soon_strings(
    hass: HomeAssistant,
) -> None:
    """The reminder reuses the localized due-soon title/message shape."""
    global_entry = _global(hass, [14])
    obj = _object(hass, {
        TASK_ID_1: build_task_data(interval_days=30, last_performed=_iso_days_ago(16)),
    }, uid="lead_send")
    await setup_integration(hass, global_entry, obj)
    nm = hass.data[DOMAIN]["_notification_manager"]

    # Pin quiet-hours off — the default window (22:00–08:00) would otherwise
    # make this test time-of-day dependent.
    with patch.object(nm, "hass") as mock_hass, \
         patch.object(nm, "_is_quiet_hours", return_value=False):
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()
        mock_hass.config_entries = hass.config_entries
        mock_hass.states = hass.states

        await nm.async_send_lead_reminder(
            entry_id=obj.entry_id, task_id=TASK_ID_1,
            task_name="Filter", object_name="Pool Pump",
            days=14, next_due="2026-07-19",
        )

        mock_hass.services.async_call.assert_called_once()
        data = mock_hass.services.async_call.call_args[0][2]
        assert "Filter" in data["message"]
        assert "14" in data["message"]
        assert "2026-07-19" in data["message"]


async def test_send_lead_reminder_respects_quiet_hours(
    hass: HomeAssistant,
) -> None:
    global_entry = _global(hass, [14])
    obj = _object(hass, {
        TASK_ID_1: build_task_data(interval_days=30, last_performed=_iso_days_ago(16)),
    }, uid="lead_quiet")
    await setup_integration(hass, global_entry, obj)
    nm = hass.data[DOMAIN]["_notification_manager"]

    with patch.object(nm, "hass") as mock_hass, \
         patch.object(nm, "_is_quiet_hours", return_value=True):
        mock_hass.services = MagicMock()
        mock_hass.services.async_call = AsyncMock()

        await nm.async_send_lead_reminder(
            entry_id=obj.entry_id, task_id=TASK_ID_1,
            task_name="Filter", object_name="Pool Pump", days=14,
        )
        mock_hass.services.async_call.assert_not_called()
