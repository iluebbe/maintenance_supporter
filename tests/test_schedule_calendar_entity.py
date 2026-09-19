"""The ``calendar`` schedule kind (#187 / D#157): once per event of a HA calendar.

Pure engine tests — the occurrences come from a provider installed through
``set_calendar_occurrence_provider`` (the coordinator does that in production,
these tests install a dict lookup) so ``next_due`` stays sync and testable:
first-time anchor, "next event strictly after the last completion", the
no-events case, offset, season window, span, serialization and the storage
adapters (normalize / legacy type / is_recurring / preview).
"""

from __future__ import annotations

from collections.abc import Iterator
from datetime import date

import pytest

from custom_components.maintenance_supporter.helpers.schedule import (
    _CALENDAR_KINDS,
    KIND_CALENDAR,
    KIND_MANUAL,
    Schedule,
    calendar_occurrences,
    is_recurring,
    legacy_schedule_type,
    normalize_task_storage,
    preview_occurrences,
    read_legacy_fields,
    set_calendar_occurrence_provider,
)

BIO = "calendar.bio_waste"
# Fortnightly pickups, deliberately unsorted with a duplicate — the provider
# contract is "whatever you have", the engine sorts and dedupes.
PICKUPS = [date(2026, 9, 22), date(2026, 9, 8), date(2026, 10, 6), date(2026, 9, 22), date(2026, 10, 20)]
TODAY = date(2026, 9, 19)


@pytest.fixture
def provider() -> Iterator[dict[str, list[date]]]:
    table = {BIO: list(PICKUPS)}
    set_calendar_occurrence_provider(lambda eid: table.get(eid, []))
    yield table
    set_calendar_occurrence_provider(None)


def _sched(**extra: object) -> Schedule:
    return Schedule.from_dict({"kind": KIND_CALENDAR, "entity_id": BIO, **extra})


def _next(s: Schedule, *, last: date | None, created: date = date(2026, 9, 1), today: date = TODAY) -> date | None:
    return s.next_due(last_performed=last, created_at=created, last_planned_due=None, today=today)


# ─── provider hook ────────────────────────────────────────────────────────


def test_calendar_kind_is_a_calendar_kind() -> None:
    assert KIND_CALENDAR in _CALENDAR_KINDS


def test_no_provider_means_no_occurrences_and_no_due() -> None:
    set_calendar_occurrence_provider(None)
    assert calendar_occurrences(BIO) == ()
    assert _next(_sched(), last=None) is None
    assert _sched().span_days() == 7


def test_provider_output_is_sorted_and_deduplicated(provider: dict[str, list[date]]) -> None:
    assert calendar_occurrences(BIO) == (date(2026, 9, 8), date(2026, 9, 22), date(2026, 10, 6), date(2026, 10, 20))
    assert calendar_occurrences("calendar.unknown") == ()
    assert calendar_occurrences("") == ()


def test_broken_provider_degrades_to_no_occurrences() -> None:
    def _boom(_eid: str) -> list[date]:
        raise RuntimeError("cache exploded")

    set_calendar_occurrence_provider(_boom)
    try:
        assert calendar_occurrences(BIO) == ()
        assert _next(_sched(), last=None) is None
    finally:
        set_calendar_occurrence_provider(None)


# ─── next_due semantics ──────────────────────────────────────────────────


def test_first_time_anchors_on_created_at_inclusive(provider: dict[str, list[date]]) -> None:
    """Never done: the first event on/after creation — a task created on the
    pickup day is due that day (and stays visibly overdue once it passes)."""
    assert _next(_sched(), last=None, created=date(2026, 9, 1)) == date(2026, 9, 8)
    assert _next(_sched(), last=None, created=date(2026, 9, 8)) == date(2026, 9, 8)
    assert _next(_sched(), last=None, created=None, today=date(2026, 9, 23)) == date(2026, 10, 6)


def test_completion_moves_to_the_next_event_strictly_after(provider: dict[str, list[date]]) -> None:
    """Once per event: completing ON the pickup day advances to the next pickup,
    never back onto the one just handled (the D#157 re-fire complaint)."""
    assert _next(_sched(), last=date(2026, 9, 22)) == date(2026, 10, 6)
    assert _next(_sched(), last=date(2026, 9, 23)) == date(2026, 10, 6)
    assert _next(_sched(), last=date(2026, 9, 21)) == date(2026, 9, 22)


def test_no_event_after_last_completion_means_no_due(provider: dict[str, list[date]]) -> None:
    assert _next(_sched(), last=date(2026, 10, 20)) is None
    provider[BIO] = []
    assert _next(_sched(), last=None) is None


def test_offset_shifts_the_event_date(provider: dict[str, list[date]]) -> None:
    """"Put the bin out the evening before" = offset -1; the first event is
    searched from ref - offset so the shifted date still lands after ref."""
    assert _next(_sched(offset=-1), last=None, created=date(2026, 9, 1)) == date(2026, 9, 7)
    assert _next(_sched(offset=-1), last=date(2026, 9, 21)) == date(2026, 10, 5)
    # A positive offset: the effective date of the 9/22 event is 9/24, which
    # is still after a completion on 9/22 — same rule as the pattern kinds.
    assert _next(_sched(offset=2), last=date(2026, 9, 22)) == date(2026, 9, 24)
    assert _next(_sched(offset=2), last=date(2026, 9, 24)) == date(2026, 10, 8)


def test_season_window_rolls_to_the_first_event_in_season(provider: dict[str, list[date]]) -> None:
    assert _next(_sched(season_months=[10]), last=None) == date(2026, 10, 6)
    # No known event inside the window → no date (never a made-up "1st of
    # the month" like the pattern kinds fall back to).
    assert _next(_sched(season_months=[12]), last=None) is None


def test_finite_series_ends_apply(provider: dict[str, list[date]]) -> None:
    s = _sched(ends={"until": "2026-10-01"})
    assert _next(s, last=date(2026, 9, 8)) == date(2026, 9, 22)
    assert _next(s, last=date(2026, 9, 22)) is None
    assert s.next_due(last_performed=None, created_at=None, last_planned_due=None, today=TODAY, times_performed=2) == date(2026, 9, 22)
    assert _sched(ends={"count": 2}).next_due(
        last_performed=None, created_at=None, last_planned_due=None, today=TODAY, times_performed=2
    ) is None


def test_span_days_is_the_median_gap(provider: dict[str, list[date]]) -> None:
    assert _sched().span_days() == 14
    provider[BIO] = [date(2026, 1, 1), date(2026, 1, 8), date(2026, 3, 1)]  # gaps 7 and 52 → median 29.5
    assert _sched().span_days() == 29
    provider[BIO] = [date(2026, 1, 1)]
    assert _sched().span_days() == 7


# ─── serialization / adapters ────────────────────────────────────────────


def test_to_dict_from_dict_roundtrip() -> None:
    d = {"kind": "calendar", "entity_id": BIO, "offset": -1, "season_months": [3, 10], "ends": {"count": 4}}
    s = Schedule.from_dict(d)
    assert s.kind == KIND_CALENDAR and s.entity_id == BIO and s.offset_days == -1
    assert s.to_dict() == d
    assert Schedule.from_dict(s.to_dict()) == s
    assert _sched().to_dict() == {"kind": "calendar", "entity_id": BIO}


@pytest.mark.parametrize("bad", ["sensor.bio", "calendar.", "", None, 7, " calendar.x" * 40])
def test_entity_id_is_validated(bad: object) -> None:
    s = Schedule.from_dict({"kind": "calendar", "entity_id": bad})
    assert s.kind == KIND_CALENDAR and s.entity_id is None
    assert s.to_dict() == {"kind": "calendar", "entity_id": None}


def test_entity_id_is_trimmed() -> None:
    assert Schedule.from_dict({"kind": "calendar", "entity_id": "  calendar.bio  "}).entity_id == "calendar.bio"


def test_storage_adapters_understand_the_kind() -> None:
    task = {"schedule": {"kind": "calendar", "entity_id": BIO}, "interval_days": 30, "schedule_type": "time_based"}
    normalized = normalize_task_storage(task)
    assert normalized == {"schedule": {"kind": "calendar", "entity_id": BIO}}  # nested wins, flat keys dropped
    assert is_recurring(normalized) is True
    assert legacy_schedule_type(Schedule.parse(normalized), has_trigger=False) == "calendar"
    assert legacy_schedule_type(Schedule.parse(normalized), has_trigger=True) == "sensor_based"
    flat = read_legacy_fields(normalized)
    assert flat["schedule_type"] == "calendar" and flat["interval_days"] is None
    assert Schedule.parse({"schedule": {"kind": "manual"}}).kind == KIND_MANUAL


def test_preview_walks_the_events_and_does_not_claim_a_series_end(provider: dict[str, list[date]]) -> None:
    dates, ended = preview_occurrences(_sched(), last_performed=None, today=date(2026, 9, 1), count=3)
    assert dates == [date(2026, 9, 8), date(2026, 9, 22), date(2026, 10, 6)]
    assert ended is False
    # Running out of KNOWN events is not a finite series ending …
    dates, ended = preview_occurrences(_sched(), last_performed=date(2026, 10, 6), today=date(2026, 10, 7), count=3)
    assert dates == [date(2026, 10, 20)] and ended is False
    # … a finite one is.
    dates, ended = preview_occurrences(_sched(ends={"count": 1}), last_performed=None, today=date(2026, 9, 1), count=3)
    assert dates == [date(2026, 9, 8)] and ended is True
