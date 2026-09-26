"""Event dates of Home Assistant calendar entities for the ``calendar`` schedule kind (#187).

A task scheduled by a calendar entity (waste collection, a club's fixture
list, the chimney sweep's published dates) comes due once per event: its
occurrences are the START DATES of that entity's events. The schedule engine
(``helpers/schedule.py``) is pure and synchronous, so it cannot ask HA for
events itself — it reads them through the provider installed by
:func:`calendar_occurrence_provider`, and the coordinator keeps that cache
warm from its refresh loop via :func:`async_refresh_calendar_occurrences`.

Each cached entity also keeps its events' TITLES per start date (#189): a
single Waste Collection Schedule calendar names every pickup after the bin
("Residual waste", "Paper"), and the task shows which one is next
(:func:`next_event_titles`).

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
from .schedule import KIND_CALENDAR, CalendarOccurrenceProvider, Schedule

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
# #189: a busy calendar day must not turn a task label into a paragraph.
MAX_TITLES_PER_DAY = 5
MAX_TITLE_LENGTH = 60


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


def titles_from_response(entity_id: str, response: object) -> dict[date, tuple[str, ...]]:
    """Event titles per start date from a ``get_events`` response (#189).

    Deduplicated in calendar order, capped per day and per title; events
    without a usable summary are skipped (their date still counts).
    """
    block = response.get(entity_id) if isinstance(response, Mapping) else None
    events = block.get("events") if isinstance(block, Mapping) else None
    if not isinstance(events, Iterable) or isinstance(events, (str, bytes)):
        return {}
    out: dict[date, list[str]] = {}
    for ev in events:
        if not isinstance(ev, Mapping):
            continue
        day = event_start_date(ev.get("start"))
        summary = ev.get("summary")
        if day is None or not isinstance(summary, str) or not (title := " ".join(summary.split())[:MAX_TITLE_LENGTH]):
            continue
        titles = out.setdefault(day, [])
        if title not in titles and len(titles) < MAX_TITLES_PER_DAY:
            titles.append(title)
    return {day: tuple(titles) for day, titles in out.items()}


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
        cache[eid] = {
            "dates": occurrences_from_response(eid, response),
            "titles": titles_from_response(eid, response),
            "fetched": time.monotonic(),
        }


def calendar_occurrence_provider(hass: HomeAssistant) -> CalendarOccurrenceProvider:
    """The provider the schedule engine reads through — a cache lookup."""

    def _provider(entity_id: str) -> Sequence[date]:
        entry = hass.data.get(DOMAIN, {}).get(CALENDAR_OCCURRENCES_KEY, {}).get(entity_id)
        return entry["dates"] if isinstance(entry, Mapping) else ()

    return _provider


def calendar_event_titles(hass: HomeAssistant, entity_id: str, day: date) -> tuple[str, ...]:
    """The cached titles of ``entity_id``'s events starting on ``day``."""
    entry = hass.data.get(DOMAIN, {}).get(CALENDAR_OCCURRENCES_KEY, {}).get(entity_id)
    titles = entry.get("titles") if isinstance(entry, Mapping) else None
    return tuple(titles.get(day, ())) if isinstance(titles, Mapping) else ()


def next_event_titles(hass: HomeAssistant, schedule: Schedule, due: date | None) -> list[str]:
    """#189: the titles of the calendar events behind a task's next due date.

    Empty for every other schedule kind and when the due date is not an event
    date (postponed, or the calendar changed since) — the task keeps its own
    name. The ±offset is undone: a "day before pickup" task shows the pickup.
    """
    if due is None or schedule.kind != KIND_CALENDAR or not schedule.entity_id:
        return []
    return list(calendar_event_titles(hass, schedule.entity_id, due - timedelta(days=schedule.offset_days or 0)))


def with_event_titles(label: str, titles: Iterable[str] | None) -> str:
    """``label`` with the next events' titles appended — the one spelling
    notifications, the to-do list and the calendar share."""
    joined = ", ".join(t for t in (titles or ()) if t)
    return f"{label} · {joined}" if joined else label
