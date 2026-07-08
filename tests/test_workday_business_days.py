"""Workday-aware business days (#83 follow-up).

The day-of-month ``business`` flag rolls to the *previous business day*. What
counts as a business day comes from ``helpers/workday``: the plain Mon-Fri
rule by default, or a predicate built from the user's Workday integration
config entry (public holidays via the ``holidays`` package, custom working
weekdays, add/remove overrides) installed at integration setup.

Verified weekday facts: 2027-06-30 = Wed, 2027-07-31 = Sat, 2027-07-30 = Fri,
2027-12-31 = Fri, 2027-12-30 = Thu.
"""

from __future__ import annotations

import sys
from collections.abc import Iterator
from datetime import date
from types import ModuleType

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.helpers.dates import (
    roll_back_to_business_day,
)
from custom_components.maintenance_supporter.helpers.schedule import (
    KIND_DAY_OF_MONTH,
    Schedule,
)
from custom_components.maintenance_supporter.helpers.workday import (
    async_setup_business_days,
    build_provider_from_workday_options,
    is_business_day,
    set_business_day_provider,
)


@pytest.fixture(autouse=True)
def _reset_provider() -> Iterator[None]:
    """The provider is process-global — never leak it across tests."""
    yield
    set_business_day_provider(None)


def _next(sched: Schedule, *, last: date | None, today: date) -> date | None:
    return sched.next_due(
        last_performed=last,
        created_at=today,
        last_planned_due=None,
        today=today,
    )


# ─── default rule + provider plumbing ───────────────────────────────────────


def test_default_rule_is_mon_fri() -> None:
    assert is_business_day(date(2027, 7, 30)) is True  # Fri
    assert is_business_day(date(2027, 7, 31)) is False  # Sat
    assert is_business_day(date(2027, 8, 1)) is False  # Sun


def test_roll_back_honours_installed_provider() -> None:
    # Wed 2027-06-30 is a "holiday" → last business day of June is Tue 29th.
    set_business_day_provider(lambda d: d.weekday() < 5 and d != date(2027, 6, 30))
    assert roll_back_to_business_day(date(2027, 6, 30)) == date(2027, 6, 29)
    # A holiday Friday before a weekend rolls Sat → Thu in one go.
    set_business_day_provider(lambda d: d.weekday() < 5 and d != date(2027, 12, 31))
    assert roll_back_to_business_day(date(2027, 12, 31)) == date(2027, 12, 30)


def test_roll_back_is_bounded_for_pathological_provider() -> None:
    set_business_day_provider(lambda _d: False)  # no business days at all
    assert roll_back_to_business_day(date(2027, 6, 30)) == date(2027, 6, 30)


def test_crashing_provider_falls_back_to_weekday_rule() -> None:
    def boom(_d: date) -> bool:
        raise RuntimeError("bad holiday calendar")

    set_business_day_provider(boom)
    assert is_business_day(date(2027, 7, 30)) is True  # Fri, weekday fallback
    assert is_business_day(date(2027, 7, 31)) is False  # Sat


# ─── Schedule integration ───────────────────────────────────────────────────


def test_last_business_day_of_month_skips_holiday() -> None:
    set_business_day_provider(lambda d: d.weekday() < 5 and d != date(2027, 6, 30))
    sched = Schedule.from_dict({"kind": KIND_DAY_OF_MONTH, "day": -1, "business": True})
    assert _next(sched, last=None, today=date(2027, 6, 5)) == date(2027, 6, 29)


def test_offset_before_last_business_day_with_holiday() -> None:
    # "-2 on the last business day": Dec 31 (Fri) is a holiday → last business
    # day is Thu 30th → minus 2 = Tue 28th.
    set_business_day_provider(lambda d: d.weekday() < 5 and d != date(2027, 12, 31))
    sched = Schedule.from_dict({"kind": KIND_DAY_OF_MONTH, "day": -1, "business": True, "offset": -2})
    assert _next(sched, last=None, today=date(2027, 12, 1)) == date(2027, 12, 28)


# ─── provider builder (fake `holidays` package) ─────────────────────────────


class _FakeHolidayCalendar:
    def __init__(self, table: dict[date, str]) -> None:
        self._table = table

    def __contains__(self, d: date) -> bool:
        return d in self._table

    def get(self, d: date) -> str | None:
        return self._table.get(d)


def _install_fake_holidays(monkeypatch: pytest.MonkeyPatch, table: dict[date, str]) -> None:
    mod = ModuleType("holidays")

    def country_holidays(country: str, subdiv: str | None = None) -> object:
        assert country  # the builder must pass the configured country through
        return _FakeHolidayCalendar(table)

    mod.country_holidays = country_holidays  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "holidays", mod)


_XMAS = date(2027, 12, 24)  # a Friday


def test_builder_excludes_public_holidays(monkeypatch: pytest.MonkeyPatch) -> None:
    _install_fake_holidays(monkeypatch, {_XMAS: "Christmas Eve"})
    fn = build_provider_from_workday_options(
        {"country": "DE", "workdays": ["mon", "tue", "wed", "thu", "fri"], "excludes": ["sat", "sun", "holiday"]}
    )
    assert fn is not None
    assert fn(_XMAS) is False  # holiday Friday
    assert fn(date(2027, 12, 23)) is True  # plain Thursday


def test_builder_honours_custom_working_week(monkeypatch: pytest.MonkeyPatch) -> None:
    _install_fake_holidays(monkeypatch, {})
    fn = build_provider_from_workday_options(
        {"country": "DE", "workdays": ["mon", "tue", "wed", "thu", "fri", "sat"], "excludes": ["sun", "holiday"]}
    )
    assert fn is not None
    assert fn(date(2027, 7, 31)) is True  # Saturday is a working day here
    assert fn(date(2027, 8, 1)) is False  # Sunday is not


def test_builder_add_and_remove_overrides(monkeypatch: pytest.MonkeyPatch) -> None:
    _install_fake_holidays(monkeypatch, {_XMAS: "Christmas Eve"})
    fn = build_provider_from_workday_options(
        {
            "country": "DE",
            "workdays": ["mon", "tue", "wed", "thu", "fri"],
            "excludes": ["sat", "sun", "holiday"],
            "add_holidays": ["2027-12-23"],  # company holiday
            "remove_holidays": ["2027-12-24"],
        }  # we do work Christmas Eve
    )
    assert fn is not None
    assert fn(date(2027, 12, 23)) is False  # added
    assert fn(_XMAS) is True  # removed by ISO date


def test_builder_remove_by_name_fragment(monkeypatch: pytest.MonkeyPatch) -> None:
    _install_fake_holidays(monkeypatch, {_XMAS: "Christmas Eve"})
    fn = build_provider_from_workday_options(
        {
            "country": "DE",
            "workdays": ["mon", "tue", "wed", "thu", "fri"],
            "excludes": ["sat", "sun", "holiday"],
            "remove_holidays": ["christmas"],
        }
    )
    assert fn is not None
    assert fn(_XMAS) is True


def test_builder_without_holiday_exclusion(monkeypatch: pytest.MonkeyPatch) -> None:
    _install_fake_holidays(monkeypatch, {_XMAS: "Christmas Eve"})
    fn = build_provider_from_workday_options(
        {"country": "DE", "workdays": ["mon", "tue", "wed", "thu", "fri"], "excludes": ["sat", "sun"]}  # "holiday" NOT excluded
    )
    assert fn is not None
    assert fn(_XMAS) is True  # holidays don't matter for this config


def test_builder_requires_holidays_package(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setitem(sys.modules, "holidays", None)  # forces ImportError
    assert build_provider_from_workday_options({"country": "DE"}) is None


def test_builder_rejects_empty_working_week(monkeypatch: pytest.MonkeyPatch) -> None:
    _install_fake_holidays(monkeypatch, {})
    assert build_provider_from_workday_options({"country": "DE", "workdays": []}) is None


# ─── setup wiring ───────────────────────────────────────────────────────────


async def test_setup_installs_provider_from_workday_entry(hass, monkeypatch: pytest.MonkeyPatch) -> None:
    _install_fake_holidays(monkeypatch, {_XMAS: "Christmas Eve"})
    entry = MockConfigEntry(
        domain="workday",
        title="Workday DE",
        data={},
        options={"country": "DE", "workdays": ["mon", "tue", "wed", "thu", "fri"], "excludes": ["sat", "sun", "holiday"]},
    )
    entry.add_to_hass(hass)

    await async_setup_business_days(hass)
    assert is_business_day(_XMAS) is False  # Fri, but a holiday
    assert is_business_day(date(2027, 12, 23)) is True


async def test_setup_clears_provider_without_workday_entry(hass) -> None:
    set_business_day_provider(lambda _d: False)  # stale provider from before
    await async_setup_business_days(hass)
    assert is_business_day(date(2027, 7, 30)) is True  # Fri, plain rule again


async def test_setup_builds_calendar_off_the_event_loop(hass, monkeypatch: pytest.MonkeyPatch) -> None:
    """`holidays.country_holidays` lazily imports its country submodule, which
    HA flags as a blocking call on the loop (issue #87). Verify the build runs
    in the executor, not the event loop thread."""
    import threading

    loop_thread = threading.get_ident()
    build_thread: dict[str, int] = {}

    mod = ModuleType("holidays")

    def country_holidays(country: str, subdiv: str | None = None) -> object:
        build_thread["id"] = threading.get_ident()
        return _FakeHolidayCalendar({_XMAS: "Christmas Eve"})

    mod.country_holidays = country_holidays  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "holidays", mod)

    entry = MockConfigEntry(
        domain="workday",
        title="Workday DE",
        data={},
        options={"country": "DE", "workdays": ["mon", "tue", "wed", "thu", "fri"], "excludes": ["sat", "sun", "holiday"]},
    )
    entry.add_to_hass(hass)

    await async_setup_business_days(hass)
    assert build_thread.get("id") is not None, "calendar was never built"
    assert build_thread["id"] != loop_thread, "calendar built on the event loop thread"


def test_builder_survives_unknown_country(monkeypatch: pytest.MonkeyPatch) -> None:
    """An unresolvable country/subdiv logs a warning and skips holidays."""
    mod = ModuleType("holidays")

    def country_holidays(country: str, subdiv: str | None = None) -> object:
        raise KeyError(f"unknown country {country}")

    mod.country_holidays = country_holidays  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "holidays", mod)

    fn = build_provider_from_workday_options(
        {"country": "XX-NOPE", "workdays": ["mon", "tue", "wed", "thu", "fri"], "excludes": ["sat", "sun", "holiday"]}
    )
    assert fn is not None
    # No calendar → plain weekday semantics.
    assert fn(date(2027, 7, 30)) is True  # Fri
    assert fn(date(2027, 7, 31)) is False  # Sat


def test_builder_ignores_malformed_override_dates(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Garbage in add_holidays is skipped; a NAME in remove_holidays matches."""
    _install_fake_holidays(monkeypatch, {_XMAS: "Christmas Eve"})
    fn = build_provider_from_workday_options(
        {
            "country": "DE",
            "workdays": ["mon", "tue", "wed", "thu", "fri"],
            "excludes": ["sat", "sun", "holiday"],
            "add_holidays": ["not-a-date", None],
            "remove_holidays": ["also-not-a-date"],
        }
    )
    assert fn is not None
    assert fn(date(2027, 12, 23)) is True  # garbage add ignored
    assert fn(_XMAS) is False  # real holiday still excluded
