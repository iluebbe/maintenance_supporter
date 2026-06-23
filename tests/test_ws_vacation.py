"""Tests for WebSocket vacation handlers (websocket/vacation.py)."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_VACATION_ENABLED,
    CONF_VACATION_END,
    CONF_VACATION_START,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.vacation import (
    ws_vacation_end_now,
    ws_vacation_preview,
    ws_vacation_update,
)

from .conftest import (
    build_global_entry_data,
    call_ws_handler,
    setup_integration,
)


def _covws_conn() -> MagicMock:
    """Create a mock WS connection."""
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    conn.subscriptions = {}
    conn.send_message = MagicMock()
    return conn


@pytest.fixture
def covws_global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# Lines 83-84: ws_vacation_update — global_entry is None → not_found error
async def test_vacation_update_no_global_entry(hass: HomeAssistant) -> None:
    """ws_vacation_update: no global config entry → not_found error."""
    conn = _covws_conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "enabled": True,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# Line 93: ws_vacation_update — enabled flag is set
async def test_vacation_update_enabled(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: setting enabled=True persists and is returned."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "enabled": True,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["enabled"] is True


# Lines 97-99: ws_vacation_update — invalid start date → invalid_date error
async def test_vacation_update_invalid_start(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: non-ISO start date → invalid_date error."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "start": "not-a-date",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_date"


# Line 104: ws_vacation_update — clearing start (start=None) succeeds
async def test_vacation_update_clear_start(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: start=None clears the start date."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    # First set a start
    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "start": "2026-08-01",
    })
    conn.reset_mock()

    # Then clear it
    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 2, "type": "maintenance_supporter/vacation/update",
        "start": None,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["start"] is None


# Lines 108-110: ws_vacation_update — invalid end date → invalid_date error
async def test_vacation_update_invalid_end(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: non-ISO end date → invalid_date error."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "end": "25-13-99",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_date"


# Lines 123-124: ws_vacation_update — end before start → invalid_range error
async def test_vacation_update_end_before_start(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: end date before start date → invalid_range error."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    # Set both in one call so both are present after the patch
    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "start": "2026-09-01",
        "end": "2026-08-01",  # before start
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_range"


# Line 135: ws_vacation_update — buffer_days is persisted
async def test_vacation_update_buffer_days(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: buffer_days is persisted in options."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "buffer_days": 3,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["buffer_days"] == 3


# Line 142: ws_vacation_update — exempt_task_ids sanitized and persisted
async def test_vacation_update_exempt_task_ids(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_update: exempt_task_ids list is cleaned and persisted."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    await call_ws_handler(ws_vacation_update, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/update",
        "exempt_task_ids": ["  task_a  ", "task_b", "task_a"],  # dup + whitespace
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # Sorted, deduped, stripped
    assert "task_a" in result["exempt_task_ids"]
    assert "task_b" in result["exempt_task_ids"]
    assert result["exempt_task_ids"].count("task_a") == 1


# Lines 170-171: ws_vacation_preview — no start/end → empty rows
async def test_vacation_preview_no_dates(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_preview: with no start/end configured → rows=[], window_end=None."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    await call_ws_handler(ws_vacation_preview, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/preview",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["rows"] == []
    assert result["window_end"] is None


# Lines 230-231: ws_vacation_end_now — global_entry is None → not_found error
async def test_vacation_end_now_no_global_entry(hass: HomeAssistant) -> None:
    """ws_vacation_end_now: no global entry → not_found error."""
    conn = _covws_conn()

    await call_ws_handler(ws_vacation_end_now, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/end_now",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


# Lines 244-245: ws_vacation_end_now — start <= today clamps end to today
async def test_vacation_end_now_clamps_end_to_today(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_vacation_end_now: start in the past → end is clamped to today's date."""
    await setup_integration(hass, covws_global_entry)

    today = dt_util.now().date()
    past_start = (today - timedelta(days=3)).isoformat()

    options = {
        CONF_VACATION_ENABLED: True,
        CONF_VACATION_START: past_start,
        CONF_VACATION_END: (today + timedelta(days=7)).isoformat(),
    }
    hass.config_entries.async_update_entry(covws_global_entry, options=options)

    conn = _covws_conn()
    await call_ws_handler(ws_vacation_end_now, hass, conn, {
        "id": 1, "type": "maintenance_supporter/vacation/end_now",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # enabled=False and end clamped to today
    assert result["enabled"] is False
    assert result["end"] == today.isoformat()
