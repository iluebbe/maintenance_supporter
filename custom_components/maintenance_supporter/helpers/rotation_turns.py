"""Whose turn a shared task is, now and next (D#284).

A rotation (``rotation_strategy`` over the ``assignee_pool``) hands a task on
when it is completed: ``round_robin`` to the next person, ``least_completed``
to whoever did it least, ``random`` to someone else. ``by_weekday`` fixes the
days instead: ``weekday_assignees`` names a person per weekday (0 = Monday …
6 = Sunday, None = anyone it is shared with), and the person on duty is the
one whose weekday the due date falls on. It follows the due date, not the
completions, so a postponed or edited task changes hands with it.

:func:`upcoming_turns` says who is on duty for the coming dates, so the next
person sees their turn before the previous one is done (the second half of
D#284). ``random`` can only say the current turn.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from datetime import date
from typing import Any

from .dates import parse_iso_date

BY_WEEKDAY = "by_weekday"
WEEKDAYS = 7
#: How many coming turns the task page lists.
UPCOMING_TURNS = 6
#: The panel's calendar draws a task at most this often for one viewer
#: (calendar-bucket.ts, MAX_OCCURRENCES_PER_TASK). Under *My tasks* those are
#: the viewer's own dates, so the task summary's turns go on until everybody
#: on the rota has that many ...
TURNS_PER_PERSON = 5
#: ... within this many dates: five weeks of a daily task, where a person
#: with one weekday still gets five.
MAX_TURNS = 35


def pool_of(task: Mapping[str, Any]) -> list[str]:
    """The people a task is shared with, in their order."""
    raw = task.get("assignee_pool")
    return [u for u in raw if isinstance(u, str) and u] if isinstance(raw, list) else []


def sanitize_weekday_assignees(value: object, pool: Sequence[str]) -> list[str | None] | None:
    """Seven entries, each a person of ``pool`` or None; None when ``value``
    is no list (a shorter list is padded, a longer one cut)."""
    if not isinstance(value, list):
        return None
    members = set(pool)
    days: list[str | None] = [v if isinstance(v, str) and v in members else None for v in value[:WEEKDAYS]]
    return days + [None] * (WEEKDAYS - len(days))


def weekday_turn(task: Mapping[str, Any], day: date | None) -> str | None:
    """The person whose weekday ``day`` is under the by-weekday rotation, or
    None (nobody's day, or no such rotation)."""
    if day is None or task.get("rotation_strategy") != BY_WEEKDAY:
        return None
    pool = pool_of(task)
    days = sanitize_weekday_assignees(task.get("weekday_assignees"), pool)
    return days[day.weekday()] if days and len(pool) >= 2 else None


def rotates_by_weekday(task: Mapping[str, Any]) -> bool:
    return task.get("rotation_strategy") == BY_WEEKDAY and len(pool_of(task)) >= 2


def current_assignee(task: Mapping[str, Any], next_due: date | str | None) -> str | None:
    """Who is responsible now: as stored, or under the by-weekday rotation
    the person whose weekday the due date is."""
    if rotates_by_weekday(task):
        due = parse_iso_date(next_due) if isinstance(next_due, str) else next_due
        return weekday_turn(task, due)
    responsible = task.get("responsible_user_id")
    return responsible if isinstance(responsible, str) and responsible else None


def _turn_dates(task: Mapping[str, Any], *, today: date, times_performed: int, count: int) -> list[date]:
    """The task's next due date and the coming ones after it, from the
    schedule engine (an on-time completion per step); dates already gone
    after the first are left out (an overdue task's catch-up steps)."""
    from .schedule import Schedule, cycle_state, preview_occurrences

    try:
        sched = Schedule.parse(task)
        lp_raw = task.get("last_performed")
        lp = parse_iso_date(lp_raw[:10]) if isinstance(lp_raw, str) and lp_raw else None

        def preview(n: int) -> list[date]:
            dates, _ended = preview_occurrences(
                sched, last_performed=lp, times_performed=times_performed, today=today, count=n, **cycle_state(task)
            )
            return dates

        dates = preview(count)
        # An overdue task's on-time steps start in the past: look further.
        if len(dates) > 1 and dates[1] < today:
            dates = preview(count + 30)
    except (TypeError, ValueError):  # pragma: no cover - malformed legacy data
        return []
    if not dates:
        return []
    return [dates[0], *(d for d in dates[1:] if d >= today)][:count]


def _enough(turns: Sequence[Mapping[str, Any]], pool: Sequence[str], count: int, per_person: int) -> int:
    """How many of ``turns`` to keep: ``count``, and on until everybody who
    gets a date at all has ``per_person`` of them. A date nobody has is
    everybody's; a person the dates never reach does not stretch the list."""
    have = {p: 0 for p in pool if any(turn["user_id"] in (p, None) for turn in turns)}
    for number, turn in enumerate(turns, start=1):
        for person in have:
            if turn["user_id"] in (person, None):
                have[person] += 1
        if number >= count and all(n >= per_person for n in have.values()):
            return number
    return len(turns)


def upcoming_turns(
    task: Mapping[str, Any], *, today: date, times_performed: int = 0, count: int = UPCOMING_TURNS, per_person: int = 0
) -> list[dict[str, Any]]:
    """The coming due dates of a rotating task with the person on duty for
    each (``user_id`` None = anyone it is shared with). Empty without a
    rotation; a random one says only the current turn.

    ``count`` dates, and with ``per_person`` as many more as it takes for
    everybody to have that many (within :data:`MAX_TURNS`): what the calendar
    needs to show one person their own coming dates."""
    pool = pool_of(task)
    strategy = task.get("rotation_strategy")
    if len(pool) < 2 or not strategy:
        return []
    ahead = max(count, MAX_TURNS) if per_person else count
    turns = _turns(task, pool, str(strategy), _turn_dates(task, today=today, times_performed=times_performed, count=ahead))
    return turns[: _enough(turns, pool, count, per_person)] if per_person else turns


def _turns(task: Mapping[str, Any], pool: list[str], strategy: str, dates: Sequence[date]) -> list[dict[str, Any]]:
    if not dates:
        return []
    if strategy == BY_WEEKDAY:
        return [{"date": d.isoformat(), "user_id": weekday_turn(task, d)} for d in dates]
    current = task.get("responsible_user_id")
    current = current if current in pool else pool[0]
    if strategy == "random":
        return [{"date": dates[0].isoformat(), "user_id": current}]
    turns: list[str] = [current]
    if strategy == "round_robin":
        start = pool.index(current)
        turns = [pool[(start + i) % len(pool)] for i in range(len(dates))]
    elif strategy == "least_completed":
        counts = dict.fromkeys(pool, 0)
        for entry in task.get("history") or []:
            who = entry.get("completed_by") if isinstance(entry, Mapping) else None
            if who in counts and entry.get("type") == "completed":
                counts[who] += 1
        for _ in dates[1:]:
            counts[turns[-1]] += 1
            turns.append(min(pool, key=lambda u: counts[u]))
    return [{"date": d.isoformat(), "user_id": who} for d, who in zip(dates, turns, strict=False)]
