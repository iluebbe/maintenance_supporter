"""Tests for __init__.py service handlers and notification actions."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.__init__ import NOTIFICATION_MANAGER_KEY
from custom_components.maintenance_supporter.const import (
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)

from .conftest import (
    TASK_ID_1,
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    get_task_store_state,
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

    # Verify task was completed (dynamic state is in the Store)
    state = get_task_store_state(hass, object_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") is not None
    # History should have a 'completed' entry
    assert any(h.get("type") == "completed" for h in state.get("history", []))


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

    state = get_task_store_state(hass, object_entry.entry_id, TASK_ID_1)
    history = state.get("history", [])
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

    # Reset sets last_performed to today (dynamic state is in the Store)
    state = get_task_store_state(hass, object_entry.entry_id, TASK_ID_1)
    assert state.get("last_performed") == dt_util.now().date().isoformat()


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

    # Skip adds history (dynamic state is in the Store)
    state = get_task_store_state(hass, object_entry.entry_id, TASK_ID_1)
    history = state.get("history", [])
    assert any(h.get("type") == "skipped" for h in history)


# ─── Notification Action Handler ─────────────────────────────────────────


async def test_notification_action_complete(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test mobile app notification action: complete."""
    await setup_integration(hass, global_entry, object_entry)

    entry_id = object_entry.entry_id
    action = f"MS_COMPLETE_{entry_id}_{TASK_ID_1}"

    runtime_data = object_entry.runtime_data
    runtime_data.coordinator.complete_maintenance = AsyncMock()

    hass.bus.async_fire("mobile_app_notification_action", {"action": action})
    await hass.async_block_till_done()

    runtime_data.coordinator.complete_maintenance.assert_called_once_with(task_id=TASK_ID_1)


async def test_notification_action_skip(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test mobile app notification action: skip."""
    await setup_integration(hass, global_entry, object_entry)

    entry_id = object_entry.entry_id
    action = f"MS_SKIP_{entry_id}_{TASK_ID_1}"

    runtime_data = object_entry.runtime_data
    runtime_data.coordinator.skip_maintenance = AsyncMock()

    hass.bus.async_fire("mobile_app_notification_action", {"action": action})
    await hass.async_block_till_done()

    runtime_data.coordinator.skip_maintenance.assert_called_once_with(
        task_id=TASK_ID_1, reason="Skipped from notification"
    )


async def test_notification_action_snooze(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test mobile app notification action: snooze."""
    await setup_integration(hass, global_entry, object_entry)

    entry_id = object_entry.entry_id
    action = f"MS_SNOOZE_{entry_id}_{TASK_ID_1}"

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    with patch.object(nm, "snooze_task") as mock_snooze:
        hass.bus.async_fire("mobile_app_notification_action", {"action": action})
        await hass.async_block_till_done()

        mock_snooze.assert_called_once_with(entry_id, TASK_ID_1)


async def test_notification_action_complete_dismisses_notification(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test that successful complete action dismisses notification and clears NM state."""
    await setup_integration(hass, global_entry, object_entry)

    entry_id = object_entry.entry_id
    action = f"MS_COMPLETE_{entry_id}_{TASK_ID_1}"

    runtime_data = object_entry.runtime_data
    runtime_data.coordinator.complete_maintenance = AsyncMock()

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    with patch.object(nm, "async_dismiss_task_notification", new_callable=AsyncMock) as mock_dismiss, \
         patch.object(nm, "clear_task_state") as mock_clear:
        hass.bus.async_fire("mobile_app_notification_action", {"action": action})
        await hass.async_block_till_done()

        mock_dismiss.assert_called_once_with(TASK_ID_1)
        mock_clear.assert_called_once_with(entry_id, TASK_ID_1)


async def test_notification_action_complete_error_does_not_dismiss(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test that failed complete action does NOT dismiss notification."""
    await setup_integration(hass, global_entry, object_entry)

    entry_id = object_entry.entry_id
    action = f"MS_COMPLETE_{entry_id}_{TASK_ID_1}"

    runtime_data = object_entry.runtime_data
    runtime_data.coordinator.complete_maintenance = AsyncMock(side_effect=RuntimeError("store error"))

    nm = hass.data.get(DOMAIN, {}).get(NOTIFICATION_MANAGER_KEY)
    with patch.object(nm, "async_dismiss_task_notification", new_callable=AsyncMock) as mock_dismiss, \
         patch.object(nm, "clear_task_state") as mock_clear:
        hass.bus.async_fire("mobile_app_notification_action", {"action": action})
        await hass.async_block_till_done()

        mock_dismiss.assert_not_called()
        mock_clear.assert_not_called()


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
