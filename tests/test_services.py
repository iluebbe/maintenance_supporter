"""Tests for maintenance services (complete, reset, skip)."""

from __future__ import annotations

from datetime import date

import pytest
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    DOMAIN,
    SERVICE_COMPLETE,
    SERVICE_RESET,
    SERVICE_SKIP,
    HistoryEntryType,
    MaintenanceStatus,
)

from .conftest import (
    TASK_ID_1,
    get_task_store_state,
    setup_integration,
)

# ─── Helpers ─────────────────────────────────────────────────────────────


def _get_sensor_entity_id(hass: HomeAssistant, config_entry: ConfigEntry) -> str | None:
    """Get the first sensor entity ID for a config entry."""
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, config_entry.entry_id)
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

    # Verify: last_performed should be updated to today (dynamic state in Store)
    state = get_task_store_state(hass, object_config_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") == dt_util.now().date().isoformat()

    # Verify: history should have a completed entry
    history = state.get("history", [])
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

    state = get_task_store_state(hass, object_config_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") == dt_util.now().date().isoformat()


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

    state = get_task_store_state(hass, object_config_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") == dt_util.now().date().isoformat()

    history = state.get("history", [])
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

    state = get_task_store_state(hass, object_config_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") == "2024-06-15"


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

    # Skip sets last_performed to today (dynamic state in Store)
    state = get_task_store_state(hass, object_config_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") == dt_util.now().date().isoformat()

    history = state.get("history", [])
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


# ─── #128: completed_by / responsible_user via services ─────────────────


async def test_complete_records_completed_by_person(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """A person entity resolves to its linked HA user id in the history."""
    await setup_integration(hass, global_config_entry, object_config_entry)
    hass.states.async_set("person.alice", "home", {"user_id": "user-alice-1", "friendly_name": "Alice"})

    entity_id = _get_sensor_entity_id(hass, object_config_entry)
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COMPLETE,
        {"entity_id": entity_id, "completed_by": "person.alice"},
        blocking=True,
    )
    await hass.async_block_till_done()

    state = get_task_store_state(hass, object_config_entry.entry_id, TASK_ID_1)
    completed = [e for e in state.get("history", []) if e.get("type") == HistoryEntryType.COMPLETED]
    assert completed[-1].get("completed_by") == "user-alice-1"


async def test_complete_rejects_person_without_user_link(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    await setup_integration(hass, global_config_entry, object_config_entry)
    hass.states.async_set("person.guest", "home", {"friendly_name": "Guest"})

    entity_id = _get_sensor_entity_id(hass, object_config_entry)
    with pytest.raises(HomeAssistantError, match="not linked"):
        await hass.services.async_call(
            DOMAIN,
            SERVICE_COMPLETE,
            {"entity_id": entity_id, "completed_by": "person.guest"},
            blocking=True,
        )


async def test_complete_defaults_to_calling_user_context(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Without the field, the triggering user's context is recorded — a
    dashboard tap attributes itself."""
    from homeassistant.core import Context

    await setup_integration(hass, global_config_entry, object_config_entry)
    entity_id = _get_sensor_entity_id(hass, object_config_entry)
    await hass.services.async_call(
        DOMAIN,
        SERVICE_COMPLETE,
        {"entity_id": entity_id},
        blocking=True,
        context=Context(user_id="ctx-user-9"),
    )
    await hass.async_block_till_done()

    state = get_task_store_state(hass, object_config_entry.entry_id, TASK_ID_1)
    completed = [e for e in state.get("history", []) if e.get("type") == HistoryEntryType.COMPLETED]
    assert completed[-1].get("completed_by") == "ctx-user-9"


async def test_update_task_assigns_and_clears_responsible_user(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    await setup_integration(hass, global_config_entry, object_config_entry)
    hass.states.async_set("person.bob", "home", {"user_id": "user-bob-2", "friendly_name": "Bob"})

    await hass.services.async_call(
        DOMAIN,
        "update_task",
        {
            "entry_id": object_config_entry.entry_id,
            "task_id": TASK_ID_1,
            "responsible_user": "person.bob",
        },
        blocking=True,
    )
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(object_config_entry.entry_id)
    assert entry.data["tasks"][TASK_ID_1]["responsible_user_id"] == "user-bob-2"

    await hass.services.async_call(
        DOMAIN,
        "update_task",
        {
            "entry_id": object_config_entry.entry_id,
            "task_id": TASK_ID_1,
            "clear_responsible_user": True,
        },
        blocking=True,
    )
    await hass.async_block_till_done()
    entry = hass.config_entries.async_get_entry(object_config_entry.entry_id)
    assert "responsible_user_id" not in entry.data["tasks"][TASK_ID_1]

    with pytest.raises(HomeAssistantError, match="not both"):
        await hass.services.async_call(
            DOMAIN,
            "update_task",
            {
                "entry_id": object_config_entry.entry_id,
                "task_id": TASK_ID_1,
                "responsible_user": "person.bob",
                "clear_responsible_user": True,
            },
            blocking=True,
        )
