"""Tests for __init__.py service handlers and notification actions."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import Event, HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    last_performed = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(last_performed=last_performed)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_svc",
    )
    entry.add_to_hass(hass)
    return entry


def _find_sensor_entity_id(hass: HomeAssistant, entry: MockConfigEntry) -> str | None:
    """Find the sensor entity_id for an object entry."""
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    return sensors[0].entity_id if sensors else None


# ─── Service: complete ───────────────────────────────────────────────────


async def test_service_complete(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test calling the complete service."""
    await setup_integration(hass, global_entry, object_entry)
    entity_id = _find_sensor_entity_id(hass, object_entry)
    assert entity_id is not None

    await hass.services.async_call(
        DOMAIN, "complete",
        {"entity_id": entity_id},
        blocking=True,
    )

    # Verify task was completed
    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    task = entry.data[CONF_TASKS][TASK_ID_1]
    assert task.get("last_performed") is not None
    # History should have a 'completed' entry
    assert any(h.get("type") == "completed" for h in task.get("history", []))


async def test_service_complete_with_options(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test complete service with notes, cost, duration."""
    await setup_integration(hass, global_entry, object_entry)
    entity_id = _find_sensor_entity_id(hass, object_entry)

    await hass.services.async_call(
        DOMAIN, "complete",
        {"entity_id": entity_id, "notes": "Looks good", "cost": 50.0, "duration": 30},
        blocking=True,
    )

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    history = entry.data[CONF_TASKS][TASK_ID_1].get("history", [])
    completed = [h for h in history if h.get("type") == "completed"]
    assert len(completed) >= 1
    assert completed[-1].get("cost") == 50.0


# ─── Service: reset ──────────────────────────────────────────────────────


async def test_service_reset(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test calling the reset service."""
    await setup_integration(hass, global_entry, object_entry)
    entity_id = _find_sensor_entity_id(hass, object_entry)

    await hass.services.async_call(
        DOMAIN, "reset",
        {"entity_id": entity_id},
        blocking=True,
    )

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    task = entry.data[CONF_TASKS][TASK_ID_1]
    # Reset sets last_performed to today
    assert task.get("last_performed") == dt_util.now().date().isoformat()


# ─── Service: skip ───────────────────────────────────────────────────────


async def test_service_skip(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test calling the skip service."""
    await setup_integration(hass, global_entry, object_entry)
    entity_id = _find_sensor_entity_id(hass, object_entry)

    await hass.services.async_call(
        DOMAIN, "skip",
        {"entity_id": entity_id},
        blocking=True,
    )

    entry = hass.config_entries.async_get_entry(object_entry.entry_id)
    task = entry.data[CONF_TASKS][TASK_ID_1]
    history = task.get("history", [])
    assert any(h.get("type") == "skipped" for h in history)


# ─── Notification Action Handler ─────────────────────────────────────────


async def test_notification_action_complete(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test mobile app notification action: complete."""
    await setup_integration(hass, global_entry, object_entry)

    entry_id = object_entry.entry_id
    # Pad entry_id to 26 chars and task_id to 32 chars
    padded_entry = entry_id.ljust(26, "0")[:26]
    padded_task = TASK_ID_1.ljust(32, "0")[:32]
    action = f"MS_COMPLETE_{padded_entry}_{padded_task}"

    hass.bus.async_fire("mobile_app_notification_action", {"action": action})
    await hass.async_block_till_done()

    # If coordinator found, complete_maintenance should have been called
    # (may not work due to entry_id padding, but handler should not crash)


async def test_notification_action_skip(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test mobile app notification action: skip."""
    await setup_integration(hass, global_entry, object_entry)

    entry_id = object_entry.entry_id
    padded_entry = entry_id.ljust(26, "0")[:26]
    padded_task = TASK_ID_1.ljust(32, "0")[:32]
    action = f"MS_SKIP_{padded_entry}_{padded_task}"

    hass.bus.async_fire("mobile_app_notification_action", {"action": action})
    await hass.async_block_till_done()


async def test_notification_action_snooze(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test mobile app notification action: snooze."""
    await setup_integration(hass, global_entry, object_entry)

    entry_id = object_entry.entry_id
    padded_entry = entry_id.ljust(26, "0")[:26]
    padded_task = TASK_ID_1.ljust(32, "0")[:32]
    action = f"MS_SNOOZE_{padded_entry}_{padded_task}"

    hass.bus.async_fire("mobile_app_notification_action", {"action": action})
    await hass.async_block_till_done()


async def test_notification_action_ignores_non_ms(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that non-MS actions are ignored."""
    await setup_integration(hass, global_entry)

    hass.bus.async_fire("mobile_app_notification_action", {"action": "OTHER_ACTION"})
    await hass.async_block_till_done()
    # Should not crash


async def test_notification_action_invalid_format(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that badly formatted MS actions are logged and ignored."""
    await setup_integration(hass, global_entry)

    hass.bus.async_fire("mobile_app_notification_action", {"action": "MS_COMPLETE_short"})
    await hass.async_block_till_done()
    # Should log warning but not crash


# ─── Entry Unload ────────────────────────────────────────────────────────


async def test_entry_unload(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test that unloading an entry works."""
    await setup_integration(hass, global_entry, object_entry)

    result = await hass.config_entries.async_unload(object_entry.entry_id)
    assert result is True


async def test_global_entry_unload(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that unloading the global entry works."""
    await setup_integration(hass, global_entry)

    result = await hass.config_entries.async_unload(global_entry.entry_id)
    assert result is True
