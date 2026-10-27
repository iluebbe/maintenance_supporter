"""The timed jobs: the daily retention sweep (every 24 hours and once ten
minutes after each start), the 08:00 pass (weekly digest, warranty and
lead-time reminders) and the noon retry of the lead-time reminders."""

from __future__ import annotations

from datetime import timedelta
from functools import partial
from typing import Any

from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import (
    CALLBACK_TYPE,
    HomeAssistant,
    callback,
)
from homeassistant.helpers.event import (
    async_call_later,
    async_track_time_change,
    async_track_time_interval,
)

from .const import (
    CONF_OBJECT,
    CONF_WEEKLY_DIGEST_ENABLED,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    NOTIFICATION_MANAGER_KEY,
)
from .helpers.aggregate import merged_tasks
from .helpers.aggregate import object_name as aggregate_object_name
from .helpers.coordinator_data import task_results
from .helpers.global_options import entry_option, get_global_entry
from .helpers.notification_gates import task_may_notify
from .helpers.notify_hooks import KIND_LEAD_TIME
from .helpers.pause import is_task_inert
from .helpers.phases import task_label
from .helpers.retention import async_run_retention_sweep


async def async_maybe_send_weekly_digest(hass: HomeAssistant, *, force: bool = False) -> None:
    """Send the opt-in weekly digest when it's due.

    Gated on: it being Monday (skipped when ``force``), the global
    ``weekly_digest_enabled`` setting, and there being something to report.
    Extracted from the daily 08:00 time-change tick so it's unit-testable and
    can be triggered directly.
    """
    from homeassistant.util import dt as dt_util

    if not force and dt_util.now().weekday() != 0:  # Monday only
        return
    global_entry = get_global_entry(hass)
    if global_entry is None:
        return
    if not entry_option(global_entry, CONF_WEEKLY_DIGEST_ENABLED):
        return
    from .helpers.aggregate import compute_status_counts

    counts = compute_status_counts(hass)
    overdue = int(counts.get("overdue", 0))
    due_soon = int(counts.get("due_soon", 0)) + int(counts.get("triggered", 0))
    if overdue == 0 and due_soon == 0:
        return  # nothing to report — stay silent
    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if nm is not None:
        await nm.async_send_weekly_digest(overdue, due_soon)


async def async_maybe_send_warranty_reminders(hass: HomeAssistant, *, force: bool = False) -> None:
    """Remind about maintenance-object warranties nearing expiry.

    Opt-in (``warranty_reminder_enabled``). Fires the day an object's warranty is
    exactly ``warranty_reminder_days`` days out — once, no per-object persistence
    needed. ``force`` widens it to the whole 0..N window (for the test hook).
    """
    from datetime import date

    from homeassistant.util import dt as dt_util

    from .const import CONF_WARRANTY_REMINDER_DAYS, CONF_WARRANTY_REMINDER_ENABLED

    global_entry = get_global_entry(hass)
    if global_entry is None:
        return
    if not entry_option(global_entry, CONF_WARRANTY_REMINDER_ENABLED):
        return
    days = int(entry_option(global_entry, CONF_WARRANTY_REMINDER_DAYS))
    today = dt_util.now().date()
    names: list[str] = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        obj = entry.data.get(CONF_OBJECT) or {}
        # A retired (archived) object's warranty is nobody's business any
        # more — the lead-reminder loop below already skipped them (bug audit
        # 2026-09-26). A paused object keeps its reminder: the warranty runs
        # out whether the pool is in its winter pause or not.
        if obj.get("archived_at") is not None:
            continue
        expiry = obj.get("warranty_expiry")
        if not expiry:
            continue
        try:
            delta = (date.fromisoformat(expiry) - today).days
        except (ValueError, TypeError):
            continue
        if delta == days or (force and 0 <= delta <= days):
            names.append(aggregate_object_name(entry))
    if not names:
        return
    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if nm is not None:
        await nm.async_send_warranty_reminder(names, days)


async def async_maybe_send_lead_reminders(hass: HomeAssistant) -> None:
    """Send extra lead-time reminders for tasks due in exactly N days.

    Opt-in via the ``reminder_lead_days`` list (e.g. [14, 3, 0]) — for every
    active task whose days-until-due matches one of the configured leads, one
    reminder fires through the notification manager (per-user routing, quiet
    hours, vacation, snooze, daily limit all apply). Runs from the daily
    08:00 tick, so each lead fires at most once per day per task, and once
    per cycle overall (the day-match only occurs on one day per lead).
    Complements — does not replace — the warning_days status-change path.
    """
    from .const import CONF_REMINDER_LEAD_DAYS, MaintenanceStatus
    from .models.maintenance_task import MaintenanceTask

    global_entry = get_global_entry(hass)
    if global_entry is None:
        return
    leads_raw = entry_option(global_entry, CONF_REMINDER_LEAD_DAYS) or []
    leads = {v for v in leads_raw if isinstance(v, int) and not isinstance(v, bool)}
    if not leads:
        return

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    if nm is None:
        return

    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        obj = entry.data.get(CONF_OBJECT) or {}
        if obj.get("archived_at") is not None:
            continue
        rd = getattr(entry, "runtime_data", None)
        coordinator = getattr(rd, "coordinator", None)
        if coordinator is None:
            continue
        # Merged data so last_performed reflects the Store, not stale entry data.
        merged = merged_tasks(entry)
        payload = task_results(coordinator)
        obj_name = aggregate_object_name(entry)
        for task_id, task_data in merged.items():
            # Disabled / archived task or a seasonally paused object (v2.20,
            # N3: schedules frozen) — the one inert predicate.
            if is_task_inert(task_data, obj):
                continue
            # The per-task gates the lead-time kind declares (#173 mute,
            # vacation, snooze) — before the model is even built.
            if not task_may_notify(hass, entry.entry_id, task_id, MaintenanceStatus.DUE_SOON, task_data, kind=KIND_LEAD_TIME, manager=nm):
                continue
            task = MaintenanceTask.from_dict(task_data)
            days = task.days_until_due
            # days == 0 is a valid lead ("on the due date"); negatives are the
            # overdue path's job (notify_overdue_interval_hours).
            if days is None or days < 0 or days not in leads:
                continue
            await nm.async_send_lead_reminder(
                entry_id=entry.entry_id,
                task_id=task_id,
                # The label every other reminder carries (due phase #139,
                # next calendar events #189) — this one sent the bare name
                # (bug audit 2026-09-26).
                task_name=task_label(task_data, published.next_event_titles if (published := payload.get(task_id)) else None),
                object_name=obj_name,
                days=days,
                next_due=task.next_due.isoformat() if task.next_due else None,
                responsible_user_id=task.responsible_user_id,
            )


async def _retention_tick(hass: HomeAssistant, _now: Any) -> None:
    await async_run_retention_sweep(hass)


async def _weekly_digest_tick(hass: HomeAssistant, _now: Any) -> None:
    await async_maybe_send_weekly_digest(hass)
    await async_maybe_send_warranty_reminders(hass)
    await async_maybe_send_lead_reminders(hass)


async def _lead_reminder_retry(hass: HomeAssistant, _now: Any) -> None:
    await async_maybe_send_lead_reminders(hass)


@callback
def async_track_daily_jobs(hass: HomeAssistant) -> list[CALLBACK_TYPE]:
    """Start the timers; returns their cancel callbacks, which the last
    entry's unload calls."""
    # v2.10.0: daily archive / auto-delete retention sweep (completed one-offs).
    # The pure decision logic + the sweep live in helpers/retention; this just
    # paces it once a day. First fire is +24h, which is plenty for a day-granular
    # policy (a freshly due archive simply waits for the next tick).
    retention_tick = partial(_retention_tick, hass)
    unsub_retention = async_track_time_interval(hass, retention_tick, timedelta(hours=24), cancel_on_shutdown=True)
    # ...and once ten minutes after each start: an install restarted every
    # night (backups, a power-saving host) never reached the 24-hour tick
    # and swept nothing (bug audit 2026-10-16, C-H).
    unsub_retention_boot = async_call_later(hass, timedelta(minutes=10), retention_tick)
    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, lambda _e: unsub_retention_boot())

    # v2.15.0: opt-in weekly digest — one summary notification on Monday morning.
    # Fires daily at 08:00 local; the gating lives in async_maybe_send_weekly_digest.
    unsub_digest = async_track_time_change(hass, partial(_weekly_digest_tick, hass), hour=8, minute=0, second=0)

    # The 08:00 tick drops lead reminders inside quiet hours; a quiet window
    # ending after 08:00 therefore silenced them for good (bug audit
    # 2026-08-29). A second, reminder-only pass at noon catches those - the
    # per-day dedup inside makes it a no-op when 08:00 already delivered.
    unsub_lead_retry = async_track_time_change(hass, partial(_lead_reminder_retry, hass), hour=12, minute=0, second=0)
    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, lambda _e: unsub_lead_retry())
    # async_track_time_change has no cancel_on_shutdown, so cancel it explicitly
    # on HA stop too — otherwise the daily timer lingers past shutdown when the
    # entries aren't formally unloaded (e.g. test teardown).
    hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, lambda _e: unsub_digest())
    return [unsub_retention, unsub_retention_boot, unsub_digest, unsub_lead_retry]
