"""Business-day provider bridging HA's Workday integration (#83 follow-up).

The day-of-month schedule's ``business`` flag rolls weekend dates back to the
previous business day. Out of the box that means a plain Mon-Fri rule — but
when the user has Home Assistant's **Workday** integration configured, "last
business day" should honour that configuration: country/region public
holidays, custom working weekdays (e.g. Mon-Sat), and the add/remove-holiday
overrides.

Layering: ``helpers/dates.py`` and ``helpers/schedule.py`` stay hass-free and
purely testable. This module keeps a process-global provider (the same
pattern Home Assistant itself uses for ``dt_util``'s default timezone):
``async_setup_business_days`` installs a predicate built from the first
Workday config entry during integration setup; ``roll_back_to_business_day``
consults it via :func:`is_business_day` and falls back to ``weekday < 5``
when none is installed (no Workday integration, unit tests).

Note: edits to the Workday configuration are picked up the next time this
integration is (re)loaded — holiday calendars change rarely enough that a
live listener isn't worth the coupling.
"""

from __future__ import annotations

import logging
from collections.abc import Callable, Mapping
from datetime import date
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

BusinessDayFn = Callable[[date], bool]

WORKDAY_DOMAIN = "workday"

_WEEKDAY_KEYS = ("mon", "tue", "wed", "thu", "fri", "sat", "sun")
_DEFAULT_WORKDAYS = ("mon", "tue", "wed", "thu", "fri")

_provider: BusinessDayFn | None = None


def set_business_day_provider(fn: BusinessDayFn | None) -> None:
    """Install (or clear, with ``None``) the global business-day predicate."""
    global _provider  # deliberate module-global, see docstring
    _provider = fn


def is_business_day(d: date) -> bool:
    """True when *d* is a business day.

    Uses the installed Workday-backed provider when present; otherwise the
    plain Mon-Fri rule. A crashing provider must never break due-date
    computation, so it degrades to the weekday rule.
    """
    if _provider is not None:
        try:
            return _provider(d)
        except Exception:  # noqa: BLE001 - degrade, never break scheduling
            _LOGGER.warning(
                "Business-day provider raised; falling back to Mon-Fri rule",
                exc_info=True,
            )
            return d.weekday() < 5
    return d.weekday() < 5


def build_provider_from_workday_options(
    options: Mapping[str, Any],
) -> BusinessDayFn | None:
    """Build a business-day predicate from a Workday config entry's options.

    Mirrors the Workday integration's semantics: a date is a business day when
    its weekday is in ``workdays`` and — if ``"holiday"`` is excluded — the
    date is not a public holiday (per ``country``/``province``, adjusted by
    ``add_holidays``/``remove_holidays``). Returns ``None`` when the
    ``holidays`` package is unavailable (it ships as a Workday requirement, so
    this only happens when Workday isn't actually installed).
    """
    try:
        import holidays as holidays_pkg  # Workday's own dependency
    except ImportError:
        return None

    raw_workdays = options.get("workdays")
    if raw_workdays is None:
        raw_workdays = _DEFAULT_WORKDAYS
    workday_names = set(raw_workdays)
    workdays = {i for i, key in enumerate(_WEEKDAY_KEYS) if key in workday_names}
    if not workdays:
        return None  # a config with no working days can't drive roll-back

    excludes = set(options.get("excludes") or ("sat", "sun", "holiday"))
    holidays_excluded = "holiday" in excludes

    calendar: Any = None
    country = options.get("country")
    if holidays_excluded and country:
        try:
            calendar = holidays_pkg.country_holidays(country, subdiv=options.get("province") or None)
        except Exception:  # noqa: BLE001 - unknown country/subdiv in options
            _LOGGER.warning(
                "Could not build a holiday calendar for Workday config %r",
                country,
                exc_info=True,
            )
            calendar = None

    # add_holidays / remove_holidays: ISO dates are honoured exactly; the
    # Workday integration additionally allows *name fragments* in
    # remove_holidays — matched case-insensitively against the holiday name.
    added: set[date] = set()
    for raw in options.get("add_holidays") or ():
        try:
            added.add(date.fromisoformat(str(raw)))
        except (ValueError, TypeError):
            continue
    removed: set[date] = set()
    removed_names: list[str] = []
    for raw in options.get("remove_holidays") or ():
        try:
            removed.add(date.fromisoformat(str(raw)))
        except (ValueError, TypeError):
            removed_names.append(str(raw).casefold())

    def provider(d: date) -> bool:
        if d.weekday() not in workdays:
            return False
        if not holidays_excluded:
            return True
        if d in added:
            return False
        # `d in calendar` lazily populates the year on demand.
        if calendar is not None and d in calendar:
            if d in removed:
                return True
            if removed_names:
                name = str(calendar.get(d) or "").casefold()
                if any(fragment in name for fragment in removed_names):
                    return True
            return False
        return True

    return provider


async def async_setup_business_days(hass: HomeAssistant) -> None:
    """Install the business-day provider from the first Workday config entry.

    Called during integration setup. Without a (loadable) Workday entry the
    provider is cleared and business-day rolling uses the plain Mon-Fri rule.

    The build runs in the executor: ``holidays.country_holidays`` lazily
    ``import_module``s the country submodule (e.g. ``holidays.countries.canada``),
    which HA flags as a blocking call when done on the event loop (issue #87).
    """
    for entry in hass.config_entries.async_entries(WORKDAY_DOMAIN):
        options: dict[str, Any] = {**entry.data, **entry.options}
        fn = await hass.async_add_executor_job(
            build_provider_from_workday_options, options
        )
        if fn is not None:
            set_business_day_provider(fn)
            _LOGGER.debug(
                "Business days follow Workday config %r (country=%s)",
                entry.title,
                options.get("country"),
            )
            return
    set_business_day_provider(None)
