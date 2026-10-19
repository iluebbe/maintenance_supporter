"""Calendar-aware interval arithmetic (no external dependencies).

Used by the scheduling model so an interval can be expressed in days, weeks,
months, or years. Month/year steps are calendar-aware and clamp the day to the
target month's last day (e.g. Jan 31 + 1 month -> Feb 28/29), avoiding the
drift you get from approximating "monthly" as 30 days.
"""

from __future__ import annotations

import calendar
from collections.abc import Iterator
from datetime import UTC, date, datetime, time, timedelta
from typing import Any

from homeassistant.util import dt as dt_util

from ..const import TIME_HHMMSS_PATTERN
from .workday import is_business_day

INTERVAL_UNITS = ("days", "weeks", "months", "years")


def parse_hhmm(value: Any) -> time | None:
    """``"HH:MM"`` or ``"HH:MM:SS"`` (HA's TimeSelector) → ``time`` to the
    minute; ``None`` when absent or malformed (hours 0–23, minutes 0–59).

    The one parser behind the status sensor, the calendar entity and the
    model's sub-day overdue refinement — three hand-copied ``split(":")``
    blocks before — and behind :func:`normalize_hhmm`.
    """
    if not isinstance(value, str):
        return None
    text = value.strip()
    if not TIME_HHMMSS_PATTERN.match(text):
        return None
    hours, minutes = text.split(":")[:2]
    return time(int(hours), int(minutes))


def local_date_from_iso(value: Any) -> str | None:
    """The calendar date (``YYYY-MM-DD``) of an ISO timestamp *in HA's local
    zone*. ``value[:10]`` is right for stamps written locally but off by one
    around midnight for imported ``+00:00`` stamps; this is the one place
    that does it properly. ``None`` when the value is not a timestamp."""
    if not isinstance(value, str) or not value:
        return None
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        return value[:10] if len(value) >= 10 and value[4] == "-" else None
    if parsed.tzinfo is None:
        return parsed.date().isoformat()
    return dt_util.as_local(parsed).date().isoformat()


def normalize_hhmm(value: Any) -> str | None:
    """Canonical ``"HH:MM"`` for a stored time, dropping TimeSelector seconds;
    ``None`` when the value does not parse (the caller drops the field)."""
    parsed = parse_hhmm(value)
    return f"{parsed.hour:02d}:{parsed.minute:02d}" if parsed is not None else None


def parse_iso_date(value: str | None) -> date | None:
    """ISO date string → ``date``; ``None`` when absent or malformed."""
    if not value:
        return None
    try:
        return date.fromisoformat(value)
    except (ValueError, TypeError):
        return None


def local_moment(value: datetime) -> datetime:
    """A given moment in HA's time zone: naive input (a datetime-local field,
    service YAML) is local time, an offset from elsewhere ("…T23:30:00+00:00"
    from an automation) the same instant there — so every day derived from
    it is the LOCAL day, not the offset's (bug audit 2026-09-26, SCH-11)."""
    if value.tzinfo is None:
        value = value.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
    return dt_util.as_local(value)


def is_past_dated(completed_at: datetime | None) -> bool:
    """A completion recorded for a PAST local day: a history correction, not
    early work, so it bypasses the earliest-completion window. The WS
    pre-check took the offset's day and the coordinator the local one, so
    near midnight one refused what the other let through (DRY audit
    2026-10-12)."""
    return completed_at is not None and local_moment(completed_at).date() < dt_util.now().date()


def canonical_iso_date(value: str | None) -> str | None:
    """A date as ``YYYY-MM-DD``, or ``None`` when it is not one. Python reads
    the compact (``20261001``) and week (``2026-W40-4``) forms too; the
    handlers that validated with it stored what was typed, so the compact
    form reached the panel and the exports (DRY audit 2026-10-12)."""
    day = parse_iso_date(value)
    return day.isoformat() if day is not None else None


def import_day(value: Any, label: str, warnings: list[str]) -> str | None:
    """An imported date as ``YYYY-MM-DD``. One that is not a date is dropped
    with a warning naming ``label``: the imports stored it as it was, and a
    spreadsheet that saved "01.10.2026" left a task that never fell due and
    an object no edit could save (bug audit 2026-10-17, W-2)."""
    if value is None or value == "":
        return None
    day = canonical_iso_date(value) if isinstance(value, str) else None
    if day is None:
        warnings.append(f"{label} {value!r} is not a date — dropped")
    return day


def parse_persisted_utc(value: str | None) -> datetime | None:
    """Persisted ISO timestamp → TZ-aware ``datetime``; ``None`` when absent
    or malformed.

    Live writes use ``dt_util.utcnow().isoformat()`` (TZ-aware), but older
    payloads may be naive — those are assumed UTC, because subtracting a naive
    datetime from ``dt_util.utcnow()`` raises ``TypeError``. One home for the
    block the threshold and state-change triggers each hand-rolled (and the
    runtime trigger FORGOT — a naive ``on_since`` crashed its elapsed math).
    """
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(value)
    except (ValueError, TypeError):
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=UTC)
    return parsed


# Sorts before every real stamp (unreadable text, a non-string).
_NO_INSTANT = datetime.min.replace(tzinfo=UTC)


def stamp_instant(value: Any) -> datetime:
    """A history stamp as the instant it names, for ordering and age.

    History mixes aware stamps of two offsets (summer and winter time, an
    import written in UTC) with naive ones (the history editor's local
    time) and bare dates (a reset day). Compared as text, a completion
    after the clocks went back, or after a restored UTC backup, sorted
    before the entry it follows and was taken for an old backfill; read
    with ``parse_persisted_utc`` (naive = UTC), a naive local stamp lay
    hours in the future (bug audit 2026-10-16). Naive and date-only stamps
    are Home Assistant's local time, a bare date its midnight — before any
    time on that day. Unreadable values sort first."""
    if not isinstance(value, str) or not value:
        return _NO_INSTANT
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        return _NO_INSTANT
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
    try:
        return parsed.astimezone(UTC)
    except (OverflowError, ValueError):
        return _NO_INSTANT


def due_instant(raw: Any) -> datetime | None:
    """The instant a sensor's REPORTED due date stands for, or None.

    Not a persisted value (``parse_persisted_utc`` reads our own stamps, naive
    = UTC): a ``timestamp`` sensor reports an ISO datetime (aware, or naive =
    local time), a ``date`` sensor an ISO date, which falls due at local
    midnight that day, and an attribute may carry the Python objects
    themselves (the due_date trigger).
    """
    if isinstance(raw, datetime):
        parsed: datetime | None = raw
    elif isinstance(raw, date):
        return dt_util.start_of_local_day(raw)
    elif isinstance(raw, str) and raw.strip():
        text = raw.strip()
        if len(text) == 10 and (day := dt_util.parse_date(text)) is not None:
            return dt_util.start_of_local_day(day)
        parsed = dt_util.parse_datetime(text)
    else:
        return None
    if parsed is None:
        return None
    return parsed if parsed.tzinfo is not None else parsed.replace(tzinfo=dt_util.get_default_time_zone())


def days_until(due: datetime, now: datetime) -> float:
    """Days from ``now`` to ``due`` — negative once it has passed. Rounded to
    three decimals (about a minute and a half) so a timer that fires a hair
    early still reads the due instant as reached."""
    return round((due - now).total_seconds() / 86400, 3)


def _add_months(anchor: date, months: int, day: int | None = None) -> date:
    """Advance ``anchor`` by ``months`` calendar months, clamping the day.

    ``day`` aims at another day of month than the anchor's own (a series on
    the 31st whose anchor is a clamped 28 February), clamped the same way.
    """
    total = anchor.month - 1 + months
    year = anchor.year + total // 12
    month = total % 12 + 1
    last_day = calendar.monthrange(year, month)[1]
    return date(year, month, min(day or anchor.day, last_day))


def add_interval(anchor: date, n: int, unit: str = "days", *, day: int | None = None) -> date:
    """Return ``anchor`` advanced by ``n`` of ``unit``.

    ``unit`` is one of days / weeks / months / years; anything else (or None)
    falls back to days, which keeps existing day-based tasks working unchanged.
    ``day`` (months / years only) is the day of month to land on, clamped to
    the target month's length; the anchor's own day by default.
    """
    if unit == "weeks":
        return anchor + timedelta(weeks=n)
    if unit == "months":
        return _add_months(anchor, n, day)
    if unit == "years":
        return _add_months(anchor, n * 12, day)
    return anchor + timedelta(days=n)


def try_add_interval(anchor: date, n: int, unit: str = "days") -> date | None:
    """:func:`add_interval`, or ``None`` when the result would lie past the
    calendar's end (year 9999).

    ``add_interval`` raises OverflowError (day/week steps) or ValueError
    (month/year steps) there. A far-future reset date or an absurd interval
    reached it from inside the coordinator refresh and took the whole object
    down on every refresh and every restart (bug audit 2026-09-27) — the
    schedule reads such a date as "no due date" instead.
    """
    try:
        return add_interval(anchor, n, unit)
    except (OverflowError, ValueError):
        return None


def nth_weekday_of_month(year: int, month: int, nth: int, weekday: int) -> date | None:
    """The ``nth`` ``weekday`` of ``(year, month)``; ``None`` if it doesn't exist.

    ``weekday`` is 0=Mon … 6=Sun (``date.weekday()``). ``nth`` is 1..5, or -1 for
    the last occurrence. A 5th occurrence that the month doesn't have → ``None``.
    """
    last_day = calendar.monthrange(year, month)[1]
    if nth == -1:
        anchor = date(year, month, last_day)
        return anchor - timedelta(days=(anchor.weekday() - weekday) % 7)
    first = date(year, month, 1)
    day = 1 + (weekday - first.weekday()) % 7 + (nth - 1) * 7
    if day > last_day:
        return None
    return date(year, month, day)


def next_weekday_in_set(ref: date, weekdays: tuple[int, ...], *, inclusive: bool) -> date | None:
    """Next date on/after ``ref`` whose weekday is in ``weekdays`` (0=Mon…6=Sun).

    ``inclusive`` includes ``ref`` itself; otherwise the search starts the next
    day. ``None`` when ``weekdays`` is empty.
    """
    if not weekdays:
        return None
    start = ref if inclusive else ref + timedelta(days=1)
    for offset in range(7):
        candidate = start + timedelta(days=offset)
        if candidate.weekday() in weekdays:
            return candidate
    return None  # pragma: no cover  (unreachable: a non-empty weekday set always matches within 7 days)


def _iter_months(year: int, month: int, limit: int = 60) -> Iterator[tuple[int, int]]:
    """Yield ``(year, month)`` forward from the given month, ``limit`` times."""
    for _ in range(limit):
        yield year, month
        month += 1
        if month > 12:
            month = 1
            year += 1


def next_nth_weekday(
    ref: date,
    nth: int,
    weekday: int,
    months: tuple[int, ...] | None = None,
    *,
    inclusive: bool,
) -> date | None:
    """Next ``nth``-``weekday``-of-month occurrence on/after ``ref``.

    Optionally restricted to ``months`` (1=Jan…12=Dec). ``None`` if no occurrence
    is found within a bounded horizon (e.g. a 5th weekday restricted to a month
    that never has one).
    """
    for year, month in _iter_months(ref.year, ref.month):
        if months and month not in months:
            continue
        occ = nth_weekday_of_month(year, month, nth, weekday)
        if occ is not None and (occ >= ref if inclusive else occ > ref):
            return occ
    return None


def next_day_of_month(
    ref: date,
    day: int,
    months: tuple[int, ...] | None = None,
    *,
    inclusive: bool,
) -> date | None:
    """Next ``day``-of-month occurrence on/after ``ref`` (day clamped to month).

    ``day`` 1..31 is clamped to the month's length (e.g. 31 → Feb 28/29);
    ``day == -1`` means the LAST day of the month (#83). Optionally restricted
    to ``months``.
    """
    for year, month in _iter_months(ref.year, ref.month):
        if months and month not in months:
            continue
        month_len = calendar.monthrange(year, month)[1]
        clamped = month_len if day == -1 else min(day, month_len)
        candidate = date(year, month, clamped)
        if candidate >= ref if inclusive else candidate > ref:
            return candidate
    return None


def roll_back_to_business_day(d: date) -> date:
    """Roll a date back to the preceding business day (business days unchanged).

    Used by the day-of-month schedule's ``business`` flag (#83): "last business
    day of the month" = last day rolled back past non-business days. What
    counts as a business day comes from :mod:`.workday`: plain Mon-Fri by
    default, or the user's Workday integration configuration (public holidays,
    custom working weekdays) when one is set up.

    Bounded: a pathological provider that never yields a business day within
    two weeks returns *d* unchanged rather than walking off into the past.
    """
    candidate = d
    for _ in range(14):
        if is_business_day(candidate):
            return candidate
        candidate -= timedelta(days=1)
    return d


def interval_span_days(n: int | None, unit: str = "days") -> int:
    """Length of one ``n``-``unit`` interval in days, calendar-aware.

    Measured as the distance from a fixed reference date to that date advanced
    by the interval, so months/years reflect real calendar lengths instead of
    the raw count. Used so things like the warning window aren't capped by the
    bare interval *count* for month/year tasks (issue #58/#59 — a 6-month task
    must not collapse a 14-day warning to ``min(14, 6)``). Returns 0 when there
    is no positive interval.
    """
    if not n or n <= 0:
        return 0
    ref = date(2001, 1, 1)  # common (non-leap) year; representative span
    end = try_add_interval(ref, n, unit)
    # An interval reaching past year 9999 (read-path garbage — the schedule
    # clamps what it stores) spans "everything left", never a crash in the
    # warning-window math of every refresh (bug audit 2026-09-27).
    return ((end or date.max) - ref).days
