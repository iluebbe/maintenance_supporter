"""Event dates of Home Assistant calendar entities for the ``calendar`` schedule kind (#187).

A task scheduled by a calendar entity (waste collection, a club's fixture
list, the chimney sweep's published dates) comes due once per event: its
occurrences are the START DATES of that entity's events. The schedule engine
(``helpers/schedule.py``) is pure and synchronous, so it cannot ask HA for
events itself — it reads them through the provider installed by
:func:`calendar_occurrence_provider`, and the coordinator keeps that cache
warm from its refresh loop via :func:`async_refresh_calendar_occurrences`.

The cache is process-wide (``hass.data[DOMAIN][CALENDAR_OCCURRENCES_KEY]``):
several objects may schedule against the same calendar, and every object has
its own coordinator, so it must not live per entry. Entries are refetched
when older than :data:`CALENDAR_REFRESH_SECONDS` or when a user action asked
for an immediate recompute. A fetch failure (entity unavailable, integration
still starting) keeps whatever was cached before — a flapping calendar must
not flip a task to "no due date" and back.
"""

from __future__ import annotations

import logging
import time
from collections.abc import Collection, Iterable, Mapping, Sequence
from datetime import date, datetime, timedelta
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

from ..const import CONF_TASKS, DOMAIN
from .schedule import KIND_CALENDAR, CalendarOccurrenceProvider

_LOGGER = logging.getLogger(__name__)

CALENDAR_OCCURRENCES_KEY = "_calendar_occurrences"
# Reserved key inside the cache dict: entity_ids whose fetch failure was
# already logged (debug, once — a missing calendar is a config choice, not
# something to shout about every five minutes).
_FAILED_LOGGED_KEY = "__failed_logged"

# Refetch an entity's events when the cached copy is older than this.
CALENDAR_REFRESH_SECONDS = 15 * 60
# Fetch window: enough past to anchor "the next event after the last
# completion" for a task done two months ago, and a bit more than a year
# ahead so yearly events (chimney sweep) are known.
CALENDAR_WINDOW_PAST_DAYS = 60
CALENDAR_WINDOW_FUTURE_DAYS = 400


def calendar_entity_ids(tasks: Mapping[str, Any]) -> set[str]:
    """The ``calendar.*`` entity_ids referenced by the tasks' nested schedules."""
    out: set[str] = set()
    for task in tasks.values():
        sched = task.get("schedule") if isinstance(task, Mapping) else None
        if not isinstance(sched, Mapping) or sched.get("kind") != KIND_CALENDAR:
            continue
        eid = sched.get("entity_id")
        if isinstance(eid, str) and eid.startswith("calendar."):
            out.add(eid)
    return out


def all_calendar_entity_ids(hass: HomeAssistant) -> set[str]:
    """Calendar entity_ids referenced by ANY object entry's tasks."""
    out: set[str] = set()
    for entry in hass.config_entries.async_entries(DOMAIN):
        tasks = entry.data.get(CONF_TASKS)
        if isinstance(tasks, Mapping):
            out |= calendar_entity_ids(tasks)
    return out


def _cache(hass: HomeAssistant) -> dict[str, Any]:
    cache: dict[str, Any] = hass.data.setdefault(DOMAIN, {}).setdefault(CALENDAR_OCCURRENCES_KEY, {})
    return cache


def event_start_date(raw: object) -> date | None:
    """The local date an event starts on.

    ``calendar.get_events`` reports an all-day event's start as a plain date
    string and a timed event's start as an ISO datetime (with offset); the
    latter is converted to HA's local zone before taking the date, so a
    23:30 UTC pickup on the other side of midnight lands on the right day.
    """
    if isinstance(raw, datetime):
        return dt_util.as_local(raw).date()
    if isinstance(raw, date):
        return raw
    if not isinstance(raw, str):
        return None
    text = raw.strip()
    if not text:
        return None
    if len(text) == 10:
        try:
            return date.fromisoformat(text)
        except ValueError:
            return None
    parsed = dt_util.parse_datetime(text)
    if parsed is None:
        return None
    return dt_util.as_local(parsed).date()


def occurrences_from_response(entity_id: str, response: object) -> tuple[date, ...]:
    """Sorted, deduplicated event start dates from a ``get_events`` response."""
    block = response.get(entity_id) if isinstance(response, Mapping) else None
    events = block.get("events") if isinstance(block, Mapping) else None
    if not isinstance(events, Iterable) or isinstance(events, (str, bytes)):
        return ()
    dates = {d for ev in events if isinstance(ev, Mapping) and (d := event_start_date(ev.get("start"))) is not None}
    return tuple(sorted(dates))


async def async_refresh_calendar_occurrences(
    hass: HomeAssistant,
    entity_ids: Iterable[str],
    *,
    force: Collection[str] = (),
) -> None:
    """Refetch the events of every stale entity in ``entity_ids``.

    ``force`` names entities to refetch regardless of age (a user action on
    their object). Failures keep the previous cache entry and are logged at
    debug once per entity.
    """
    cache = _cache(hass)
    failed_logged: set[str] = cache.setdefault(_FAILED_LOGGED_KEY, set())
    now_mono = time.monotonic()
    stale = [
        eid
        for eid in sorted(set(entity_ids))
        if eid in force or eid not in cache or now_mono - cache[eid]["fetched"] >= CALENDAR_REFRESH_SECONDS
    ]
    if not stale:
        return
    if not hass.services.has_service("calendar", "get_events"):
        if "calendar.get_events" not in failed_logged:
            failed_logged.add("calendar.get_events")
            _LOGGER.debug("calendar.get_events is not available yet; calendar-entity schedules have no dates")
        return

    now = dt_util.now()
    window = {
        "start_date_time": (now - timedelta(days=CALENDAR_WINDOW_PAST_DAYS)).isoformat(),
        "end_date_time": (now + timedelta(days=CALENDAR_WINDOW_FUTURE_DAYS)).isoformat(),
    }
    for eid in stale:
        try:
            response = await hass.services.async_call(
                "calendar",
                "get_events",
                {"entity_id": eid, **window},
                blocking=True,
                return_response=True,
            )
        except (HomeAssistantError, vol.Invalid, ValueError, TypeError) as err:
            if eid not in failed_logged:
                failed_logged.add(eid)
                _LOGGER.debug("Could not read events of %s (keeping the previous dates): %s", eid, err)
            continue
        failed_logged.discard(eid)
        cache[eid] = {"dates": occurrences_from_response(eid, response), "fetched": time.monotonic()}


def calendar_occurrence_provider(hass: HomeAssistant) -> CalendarOccurrenceProvider:
    """The provider the schedule engine reads through — a cache lookup."""

    def _provider(entity_id: str) -> Sequence[date]:
        entry = hass.data.get(DOMAIN, {}).get(CALENDAR_OCCURRENCES_KEY, {}).get(entity_id)
        return entry["dates"] if isinstance(entry, Mapping) else ()

    return _provider
