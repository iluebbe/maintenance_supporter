"""Shared helpers for config flow and options flow threshold suggestions."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import selector

from .const import CONF_TASK_INTERVAL_UNIT
from .helpers.dates import INTERVAL_UNITS
from .helpers.entity_analyzer import EntityAnalyzer
from .helpers.schedule import (
    KIND_DAY_OF_MONTH,
    KIND_NTH_WEEKDAY,
    KIND_WEEKDAYS,
    Schedule,
)
from .helpers.threshold_calculator import ThresholdCalculator, ThresholdSuggestions

_LOGGER = logging.getLogger(__name__)

# Calendar recurrence kinds offered in the config + options flows (Phase 4).
# Hardcoded English labels for the weekday/occurrence sub-options keep the
# config-flow i18n surface small; the kind names are translated via strings.json.
CALENDAR_KIND_VALUES = (KIND_WEEKDAYS, KIND_NTH_WEEKDAY, KIND_DAY_OF_MONTH)
_WEEKDAY_LABELS = (
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
)
_NTH_OPTIONS = (
    ("1", "1st"),
    ("2", "2nd"),
    ("3", "3rd"),
    ("4", "4th"),
    ("5", "5th"),
    ("-1", "Last"),
)


def calendar_schema(kind: str, current: dict[str, Any] | None = None) -> vol.Schema:
    """Voluptuous schema for a calendar kind's fields (weekdays / nth_weekday /
    day_of_month). Shared by the config + options flows (DRY). Callers extend it
    with their own warning_days / last_performed / go_back fields."""
    cur = current or {}
    weekday_opts = [selector.SelectOptionDict(value=str(i), label=lbl) for i, lbl in enumerate(_WEEKDAY_LABELS)]
    fields: dict[Any, Any] = {}
    if kind == KIND_WEEKDAYS:
        fields[vol.Required("weekdays", default=cur.get("weekdays", []))] = selector.SelectSelector(
            selector.SelectSelectorConfig(
                options=weekday_opts,
                multiple=True,
                mode=selector.SelectSelectorMode.LIST,
            )
        )
    elif kind == KIND_NTH_WEEKDAY:
        fields[vol.Required("nth", default=cur.get("nth", "1"))] = selector.SelectSelector(
            selector.SelectSelectorConfig(
                options=[selector.SelectOptionDict(value=v, label=lbl) for v, lbl in _NTH_OPTIONS],
                mode=selector.SelectSelectorMode.DROPDOWN,
            )
        )
        fields[vol.Required("weekday", default=cur.get("weekday", "5"))] = selector.SelectSelector(
            selector.SelectSelectorConfig(
                options=weekday_opts,
                mode=selector.SelectSelectorMode.DROPDOWN,
            )
        )
    elif kind == KIND_DAY_OF_MONTH:
        fields[vol.Required("day", default=cur.get("day", 1))] = selector.NumberSelector(
            selector.NumberSelectorConfig(min=1, max=31, step=1, mode=selector.NumberSelectorMode.BOX)
        )
        # (#83) end-of-month options: "last day" overrides the day number;
        # "business" rolls a weekend date back to Friday.
        fields[vol.Optional("last_day", default=cur.get("last_day", False))] = selector.BooleanSelector()
        fields[vol.Optional("business", default=cur.get("business", False))] = selector.BooleanSelector()
    # (#83) ±N-day shift of the computed occurrence, on every calendar kind
    # ("two days before the last working day" = last_day + business + offset -2).
    fields[vol.Optional("offset", default=cur.get("offset", 0))] = selector.NumberSelector(
        selector.NumberSelectorConfig(min=-15, max=15, step=1, mode=selector.NumberSelectorMode.BOX)
    )
    return vol.Schema(fields)


def schedule_from_calendar_input(kind: str, user_input: dict[str, Any]) -> dict[str, Any] | None:
    """Build the nested `schedule` dict from a calendar step's user_input."""

    def _with_offset(schedule: dict[str, Any]) -> dict[str, Any]:
        offset = int(user_input.get("offset", 0) or 0)
        if offset:
            schedule["offset"] = offset
        return schedule

    if kind == KIND_WEEKDAYS:
        days = sorted(int(d) for d in user_input.get("weekdays", []))
        return _with_offset({"kind": KIND_WEEKDAYS, "weekdays": days}) if days else None
    if kind == KIND_NTH_WEEKDAY:
        return _with_offset(
            {
                "kind": KIND_NTH_WEEKDAY,
                "nth": int(user_input["nth"]),
                "weekday": int(user_input["weekday"]),
            }
        )
    if kind == KIND_DAY_OF_MONTH:
        # (#83) "last day" wins over the day number; business rolls back weekends.
        day = -1 if user_input.get("last_day") else int(user_input.get("day", 1))
        schedule: dict[str, Any] = {"kind": KIND_DAY_OF_MONTH, "day": day}
        if user_input.get("business"):
            schedule["business"] = True
        return _with_offset(schedule)
    return None


def calendar_current(task: dict[str, Any]) -> dict[str, Any]:
    """Current calendar-field values from a task's nested schedule, in the shape
    `calendar_schema` defaults expect (selector values are strings)."""
    s = Schedule.parse(task)
    return {
        "weekdays": [str(d) for d in s.weekdays],
        "nth": str(s.nth) if s.nth is not None else "1",
        "weekday": str(s.weekday) if s.weekday is not None else "5",
        "day": s.day if (s.day or 0) >= 1 else 1,
        "last_day": s.day == -1,
        "business": s.business,
        "offset": s.offset_days,
    }


def interval_unit_selector() -> selector.SelectSelector:
    """Shared days/weeks/months/years dropdown for the interval unit.

    DRY single source for the time-based interval AND the sensor safety-interval
    steps across the config + options flows (previously duplicated 7×). Options
    come from the canonical ``INTERVAL_UNITS``; ``translation_key`` localizes them
    via ``selector.interval_unit.options`` in strings.json.
    """
    return selector.SelectSelector(
        selector.SelectSelectorConfig(
            options=list(INTERVAL_UNITS),
            mode=selector.SelectSelectorMode.DROPDOWN,
            translation_key="interval_unit",
        )
    )


def apply_interval_unit(target: dict[str, Any], user_input: dict[str, Any]) -> None:
    """Persist ``interval_unit`` from a flow step into ``target`` only when it
    differs from the implicit default ``days`` (keeps stored task dicts minimal).
    DRY: replaces the ``if unit != "days"`` block duplicated across flow steps.
    """
    unit = user_input.get(CONF_TASK_INTERVAL_UNIT, "days")
    if unit != "days":
        target[CONF_TASK_INTERVAL_UNIT] = unit


async def async_get_threshold_suggestions(
    hass: HomeAssistant,
    trigger_entity_id: str | None,
    current_task: dict[str, Any],
) -> ThresholdSuggestions:
    """Get threshold suggestions using EntityAnalyzer and ThresholdCalculator."""
    if not trigger_entity_id:
        return ThresholdSuggestions()

    try:
        analyzer = EntityAnalyzer(hass)
        analysis = await analyzer.async_analyze_entity(trigger_entity_id)

        attribute = current_task.get("trigger_config", {}).get("attribute")
        calculator = ThresholdCalculator(hass)
        return await calculator.async_calculate_suggestions(trigger_entity_id, attribute, analysis)
    except (HomeAssistantError, ValueError, TypeError, KeyError):
        _LOGGER.debug(
            "Failed to get threshold suggestions for %s",
            trigger_entity_id,
            exc_info=True,
        )
        return ThresholdSuggestions()


def format_threshold_placeholders(
    trigger_entity_id: str | None,
    attribute: str | None,
    suggestions: ThresholdSuggestions,
) -> dict[str, str]:
    """Format description placeholders from threshold suggestions."""
    return {
        "entity_id": trigger_entity_id or "",
        "attribute": attribute or "state",
        "current_value": str(suggestions.current_value) if suggestions.current_value is not None else "",
        "unit": suggestions.unit,
        "average": f"{suggestions.average:.1f}" if suggestions.average is not None else "N/A",
        "minimum": f"{suggestions.minimum:.1f}" if suggestions.minimum is not None else "N/A",
        "maximum": f"{suggestions.maximum:.1f}" if suggestions.maximum is not None else "N/A",
        "suggested_above": f"{suggestions.suggested_above:.1f}" if suggestions.suggested_above is not None else "",
        "suggested_below": f"{suggestions.suggested_below:.1f}" if suggestions.suggested_below is not None else "",
        "data_period": str(suggestions.data_period_days) if suggestions.data_period_days > 0 else "0",
        "trend": suggestions.trend or "",
    }
