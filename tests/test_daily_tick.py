"""Tests for the daily-tick scheduling wrappers (audit gap #4).

The weekly digest was only tested at the NotificationManager layer with
hand-fed counts — the ``async_maybe_send_weekly_digest`` wrapper (Monday-only
gate, enabled gate, live count computation) and the daily 08:00 tick wiring
had no coverage. An off-by-one in the weekday check would ship green.
"""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import AsyncMock, MagicMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.maintenance_supporter import (
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
    async_maybe_send_weekly_digest,
)
from custom_components.maintenance_supporter.const import (
    CONF_WEEKLY_DIGEST_ENABLED,
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


def _global(hass: HomeAssistant, *, digest: bool) -> MockConfigEntry:
    data = build_global_entry_data(notifications_enabled=True, notify_service="notify.test")
    data[CONF_WEEKLY_DIGEST_ENABLED] = digest
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter", data=data,
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _overdue_object(hass: HomeAssistant) -> MockConfigEntry:
    lp = (dt_util.now().date() - timedelta(days=60)).isoformat()
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Pool Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Pool Pump"),
            tasks={TASK_ID_1: build_task_data(interval_days=30, last_performed=lp)},
        ),
        source="user", unique_id="maintenance_supporter_tick_obj",
    )
    entry.add_to_hass(hass)
    return entry


def _mock_nm(hass: HomeAssistant) -> MagicMock:
    nm = MagicMock()
    nm.async_send_weekly_digest = AsyncMock()
    hass.data.setdefault(DOMAIN, {})[NOTIFICATION_MANAGER_KEY] = nm
    return nm


# ─── async_maybe_send_weekly_digest wrapper ─────────────────────────────────


async def test_maybe_weekly_digest_fires_on_monday_with_live_counts(
    hass: HomeAssistant, freezer,
) -> None:
    """On a Monday, the wrapper computes counts from live coordinators and
    forwards them to the manager."""
    freezer.move_to("2026-07-06 09:00:00+00:00")  # a Monday
    await setup_integration(hass, _global(hass, digest=True), _overdue_object(hass))
    nm = _mock_nm(hass)

    await async_maybe_send_weekly_digest(hass)

    nm.async_send_weekly_digest.assert_awaited_once()
    kwargs = nm.async_send_weekly_digest.await_args
    overdue = kwargs.args[0] if kwargs.args else kwargs.kwargs["overdue"]
    assert overdue >= 1  # the seeded 60-days-late task is counted


async def test_maybe_weekly_digest_silent_on_other_weekdays(
    hass: HomeAssistant, freezer,
) -> None:
    """The Monday gate: identical setup on a Tuesday sends nothing."""
    freezer.move_to("2026-07-07 09:00:00+00:00")  # a Tuesday
    await setup_integration(hass, _global(hass, digest=True), _overdue_object(hass))
    nm = _mock_nm(hass)

    await async_maybe_send_weekly_digest(hass)
    nm.async_send_weekly_digest.assert_not_awaited()

    # force=True bypasses the weekday gate (the test-notification hook).
    await async_maybe_send_weekly_digest(hass, force=True)
    nm.async_send_weekly_digest.assert_awaited_once()


async def test_maybe_weekly_digest_respects_enabled_flag(
    hass: HomeAssistant, freezer,
) -> None:
    freezer.move_to("2026-07-06 09:00:00+00:00")  # a Monday
    await setup_integration(hass, _global(hass, digest=False), _overdue_object(hass))
    nm = _mock_nm(hass)

    await async_maybe_send_weekly_digest(hass)
    nm.async_send_weekly_digest.assert_not_awaited()


async def test_maybe_weekly_digest_silent_when_nothing_to_report(
    hass: HomeAssistant, freezer,
) -> None:
    """No overdue/due-soon tasks → stay silent even on Monday/force."""
    freezer.move_to("2026-07-06 09:00:00+00:00")
    lp = dt_util.now().date().isoformat()  # completed today → ok
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN, title="Fresh",
        data=build_object_entry_data(
            object_data=build_object_data(name="Fresh"),
            tasks={TASK_ID_1: build_task_data(interval_days=3650, last_performed=lp)},
        ),
        source="user", unique_id="maintenance_supporter_tick_fresh",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, _global(hass, digest=True), entry)
    nm = _mock_nm(hass)

    await async_maybe_send_weekly_digest(hass, force=True)
    nm.async_send_weekly_digest.assert_not_awaited()


# ─── Daily 08:00 tick wiring ────────────────────────────────────────────────


async def test_daily_tick_dispatches_digest_warranty_and_lead_reminders(
    hass: HomeAssistant, freezer,
) -> None:
    """Firing the 08:00 time-change tick runs all three maybe_* helpers —
    proving the digest, warranty, and lead-reminder features are actually
    wired to a schedule (not just unit-correct)."""
    freezer.move_to("2026-07-06 07:59:50+00:00")
    await setup_integration(hass, _global(hass, digest=True), _overdue_object(hass))

    with patch(
        "custom_components.maintenance_supporter.async_maybe_send_weekly_digest",
        new_callable=AsyncMock,
    ) as digest, patch(
        "custom_components.maintenance_supporter.async_maybe_send_warranty_reminders",
        new_callable=AsyncMock,
    ) as warranty, patch(
        "custom_components.maintenance_supporter.async_maybe_send_lead_reminders",
        new_callable=AsyncMock,
    ) as leads:
        # Advance past the next local 08:00:00 so async_track_time_change fires.
        target = dt_util.now().replace(hour=8, minute=0, second=0, microsecond=0)
        if target <= dt_util.now():
            target += timedelta(days=1)
        freezer.move_to(target + timedelta(seconds=1))
        async_fire_time_changed(hass, target + timedelta(seconds=1))
        await hass.async_block_till_done()

        digest.assert_awaited_once()
        warranty.assert_awaited_once()
        leads.assert_awaited_once()
