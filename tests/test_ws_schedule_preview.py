"""Tests for the schedule/preview WS command (#83 roadmap item).

The preview must come from the REAL Schedule engine (never a frontend
reimplementation — the #103 drift lesson), simulating on-time completion
per step so every modifier (season window, business roll, offsets, finite
series) advances exactly as the engine would at runtime.
"""

from __future__ import annotations

from typing import Any

from freezegun import freeze_time
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_schedule_preview,
)

from .conftest import (
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


async def _preview(hass: HomeAssistant, payload: dict[str, Any]) -> dict[str, Any]:
    conn = make_ws_connection()
    await call_ws_handler(
        ws_schedule_preview,
        hass,
        conn,
        {"id": 1, "type": "maintenance_supporter/schedule/preview", **payload},
    )
    assert not conn.send_error.called, conn.send_error.call_args
    result: dict[str, Any] = conn.send_result.call_args[0][1]
    return result


@freeze_time("2026-07-19 12:00:00")
async def test_interval_days_from_today(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """A fresh 30-day interval anchors on today and steps by completion."""
    await setup_integration(hass, global_config_entry)
    res = await _preview(hass, {"schedule": {"kind": "interval", "every": 30, "unit": "days"}})
    assert res["occurrences"] == ["2026-08-18", "2026-09-17", "2026-10-17"]
    assert res["series_ended"] is False


@freeze_time("2026-07-19 12:00:00")
async def test_the_83_case_second_saturday_every_six_months(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """#83: '2nd Saturday, every 6 months' = nth_weekday + season window.

    From 2026-07-19 the next active occurrences are the 2nd Saturdays of
    Jan/Jul: 2027-01-09, 2027-07-10, 2028-01-08. (July 2026's 2nd Saturday,
    the 11th, is already past.)"""
    await setup_integration(hass, global_config_entry)
    res = await _preview(
        hass,
        {
            "schedule": {
                "kind": "nth_weekday",
                "nth": 2,
                "weekday": 5,  # Saturday
                "season_months": [1, 7],
            }
        },
    )
    assert res["occurrences"] == ["2027-01-09", "2027-07-10", "2028-01-08"]


@freeze_time("2026-07-19 12:00:00")
async def test_finite_series_reports_the_end(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """A repeat-twice series yields two dates and flags series_ended."""
    await setup_integration(hass, global_config_entry)
    res = await _preview(
        hass,
        {"schedule": {"kind": "interval", "every": 7, "unit": "days", "ends": {"count": 2}}},
    )
    assert res["occurrences"] == ["2026-07-26", "2026-08-02"]
    assert res["series_ended"] is True


@freeze_time("2026-07-19 12:00:00")
async def test_last_performed_anchors_the_first_step(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """An existing task's last_performed drives the first occurrence."""
    await setup_integration(hass, global_config_entry)
    res = await _preview(
        hass,
        {
            "schedule": {"kind": "interval", "every": 30, "unit": "days"},
            "last_performed": "2026-07-01",
        },
    )
    assert res["occurrences"] == ["2026-07-31", "2026-08-30", "2026-09-29"]


@freeze_time("2026-07-19 12:00:00")
async def test_manual_and_one_time(hass: HomeAssistant, global_config_entry: MockConfigEntry) -> None:
    """Manual → empty; one_time → its single date, then the series ends."""
    await setup_integration(hass, global_config_entry)
    res = await _preview(hass, {"schedule": {"kind": "manual"}})
    assert res["occurrences"] == [] and res["series_ended"] is True

    res = await _preview(hass, {"schedule": {"kind": "one_time", "due_date": "2026-12-24"}})
    assert res["occurrences"] == ["2026-12-24"]
    assert res["series_ended"] is True


@freeze_time("2026-07-19 12:00:00")
async def test_broken_schedule_values_surface_invalid_input(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """from_dict is lenient, but garbage VALUES that crash the engine at
    compute time (a string nth) must surface as invalid_input, not a 500."""
    await setup_integration(hass, global_config_entry)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_schedule_preview,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/schedule/preview",
            "schedule": {"kind": "nth_weekday", "nth": "second", "weekday": 5},
        },
    )
    assert conn.send_error.called
    assert conn.send_error.call_args[0][1] == "invalid_input"


async def test_invalid_last_performed_rejected(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    await setup_integration(hass, global_config_entry)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_schedule_preview,
        hass,
        conn,
        {
            "id": 1,
            "type": "maintenance_supporter/schedule/preview",
            "schedule": {"kind": "interval", "every": 30, "unit": "days"},
            "last_performed": "not-a-date",
        },
    )
    assert conn.send_error.called
