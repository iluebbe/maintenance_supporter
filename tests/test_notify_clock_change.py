"""Reminder timing across the autumn clock change counts real time.

Found on 2026-11-01, when the full suite ran in the hour US/Pacific (the
test zone) repeats: a snooze of 4 hours ended after 5, and a reminder stamped
at 01:50 daylight time looked 40 minutes in the future at 01:10 standard time
— two times in the local zone subtract and compare by the wall clock.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import CONF_SNOOZE_DURATION_HOURS, DOMAIN, NOTIFICATION_MANAGER_KEY
from custom_components.maintenance_supporter.helpers.notification_manager import notification_key

from .test_audit_2026_09_26 import TASK, _setup

# US/Pacific falls back at 09:00 UTC on 2026-11-01 (02:00 PDT -> 01:00 PST).
AT_0137_PDT = "2026-11-01 08:37:40+00:00"
AT_0150_PDT = "2026-11-01 08:50:00+00:00"


async def test_a_snooze_lasts_real_hours_across_the_clock_change(hass: HomeAssistant, freezer: Any) -> None:
    freezer.move_to(AT_0137_PDT)
    entry = await _setup(hass)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    hours = nm._opt(CONF_SNOOZE_DURATION_HOURS)
    until = nm.snooze_task(entry.entry_id, TASK)
    assert until - dt_util.utcnow() == timedelta(hours=hours)
    assert until.utcoffset() == timedelta(hours=-8), "shown in local (standard) time"
    key = notification_key(entry.entry_id, TASK, "overdue")
    freezer.tick(timedelta(hours=hours) - timedelta(minutes=1))
    assert nm._is_snoozed(key)
    freezer.tick(timedelta(minutes=2))
    assert not nm._is_snoozed(key), "over after the real hours, not an hour later"


async def test_a_reminder_stamp_counts_real_time_in_the_repeated_hour(hass: HomeAssistant, freezer: Any) -> None:
    freezer.move_to(AT_0150_PDT)
    entry = await _setup(hass)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    key = notification_key(entry.entry_id, TASK, "triggered")
    nm._stamp_status_sent(key, 1)
    freezer.tick(timedelta(minutes=20))  # 01:10 PST, 20 real minutes later
    assert dt_util.now().hour == 1 and dt_util.now().minute == 10
    assert not nm._rate_limited(key, 600), "20 real minutes are past a 10-minute limit"
    assert not nm._status_due(key, 1)
    freezer.tick(timedelta(minutes=41))  # 61 real minutes after the stamp
    assert nm._status_due(key, 1), "the hourly repeat is due after an hour, not two"
