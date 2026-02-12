"""Tests for maintenance services (complete, reset, skip)."""

from __future__ import annotations

from datetime import date, timedelta

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    HistoryEntryType,
    MaintenanceStatus,
    SERVICE_COMPLETE,
    SERVICE_RESET,
    SERVICE_SKIP,
)

from .conftest import (
    TASK_ID_1,
    setup_integration,
)


# ─── Helpers ─────────────────────────────────────────────────────────────


def _get_sensor_entity_id(
    hass: HomeAssistant, config_entry: ConfigEntry
) -> str | None:
    """Get the first sensor entity ID for a config entry."""
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(
        entity_reg, config_entry.entry_id
    )
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    if sensor_entities:
        return sensor_entities[0].entity_id
    return None


# ─── 9.1 Complete Service ────────────────────────────────────────────────


async def test_complete_service(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test the complete maintenance service."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_id = _get_sensor_entity_id(hass, object_config_entry)
    assert entity_id is not None

    await hass.services.async_call(
        DOMAIN,
        SERVICE_COMPLETE,
        {
            "entity_id": entity_id,
            "notes": "Cleaned the filter",
            "cost": 25.50,
            "duration": 45,
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    # Verify: last_performed should be updated to today
    tasks = object_config_entry.data.get(CONF_TASKS, {})
    task = tasks.get(TASK_ID_1)
    assert task is not None
    assert task.get("last_performed") == dt_util.now().date().isoformat()

    # Verify: history should have a completed entry
    history = task.get("history", [])
    completed = [e for e in history if e.get("type") == HistoryEntryType.COMPLETED]
    assert len(completed) >= 1
    latest = completed[-1]
    assert latest.get("notes") == "Cleaned the filter"
    assert latest.get("cost") == 25.50
    assert latest.get("duration") == 45


async def test_complete_without_optional_fields(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test complete service without optional fields."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_id = _get_sensor_entity_id(hass, object_config_entry)
    assert entity_id is not None

    await hass.services.async_call(
        DOMAIN,
        SERVICE_COMPLETE,
        {"entity_id": entity_id},
        blocking=True,
    )
    await hass.async_block_till_done()

    tasks = object_config_entry.data.get(CONF_TASKS, {})
    task = tasks.get(TASK_ID_1)
    assert task is not None
    assert task.get("last_performed") == dt_util.now().date().isoformat()


# ─── 9.2 Reset Service ──────────────────────────────────────────────────


async def test_reset_service_default_date(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test reset service with default date (today)."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_id = _get_sensor_entity_id(hass, object_config_entry)
    assert entity_id is not None

    await hass.services.async_call(
        DOMAIN,
        SERVICE_RESET,
        {"entity_id": entity_id},
        blocking=True,
    )
    await hass.async_block_till_done()

    tasks = object_config_entry.data.get(CONF_TASKS, {})
    task = tasks.get(TASK_ID_1)
    assert task is not None
    assert task.get("last_performed") == dt_util.now().date().isoformat()

    history = task.get("history", [])
    reset_entries = [e for e in history if e.get("type") == HistoryEntryType.RESET]
    assert len(reset_entries) >= 1


async def test_reset_service_custom_date(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test reset service with a specific date."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_id = _get_sensor_entity_id(hass, object_config_entry)
    assert entity_id is not None

    target_date = date(2024, 6, 15)
    await hass.services.async_call(
        DOMAIN,
        SERVICE_RESET,
        {"entity_id": entity_id, "date": target_date.isoformat()},
        blocking=True,
    )
    await hass.async_block_till_done()

    tasks = object_config_entry.data.get(CONF_TASKS, {})
    task = tasks.get(TASK_ID_1)
    assert task is not None
    assert task.get("last_performed") == "2024-06-15"


# ─── 9.3 Skip Service ───────────────────────────────────────────────────


async def test_skip_service(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test skip service."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_id = _get_sensor_entity_id(hass, object_config_entry)
    assert entity_id is not None

    await hass.services.async_call(
        DOMAIN,
        SERVICE_SKIP,
        {"entity_id": entity_id, "reason": "Parts not available"},
        blocking=True,
    )
    await hass.async_block_till_done()

    tasks = object_config_entry.data.get(CONF_TASKS, {})
    task = tasks.get(TASK_ID_1)
    assert task is not None
    # Skip sets last_performed to today
    assert task.get("last_performed") == dt_util.now().date().isoformat()

    history = task.get("history", [])
    skip_entries = [e for e in history if e.get("type") == HistoryEntryType.SKIPPED]
    assert len(skip_entries) >= 1
    assert skip_entries[-1].get("notes") == "Parts not available"


# ─── 9.4 Service Error Handling ──────────────────────────────────────────


async def test_service_with_unknown_entity(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that services raise on unknown entity."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    with pytest.raises(HomeAssistantError):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_COMPLETE,
            {"entity_id": "sensor.does_not_exist"},
            blocking=True,
        )


async def test_complete_updates_status_to_ok(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    overdue_config_entry: ConfigEntry,
) -> None:
    """Test that completing an overdue task changes status back to OK."""
    await setup_integration(hass, global_config_entry, overdue_config_entry)

    entity_id = _get_sensor_entity_id(hass, overdue_config_entry)
    if entity_id is None:
        pytest.skip("No sensor entity found")

    # Before: should be overdue
    state = hass.states.get(entity_id)
    if state:
        assert state.state == MaintenanceStatus.OVERDUE

    # Complete
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COMPLETE,
        {"entity_id": entity_id},
        blocking=True,
    )
    await hass.async_block_till_done()

    # After: should be OK
    state = hass.states.get(entity_id)
    if state:
        assert state.state == MaintenanceStatus.OK
