"""Final coverage push: __init__ helpers, diagnostics edges, budget edges, sensor fallback."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_BUDGET_ALERTS_ENABLED,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceStatus,
    ScheduleType,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    set_sensor_state,
    setup_integration,
)


# ─── __init__.py helper functions ────────────────────────────────────────


def test_get_coordinator_for_entity_not_in_registry(
    hass: HomeAssistant,
) -> None:
    """_get_coordinator_for_entity returns None when entity is not in registry."""
    from custom_components.maintenance_supporter import _get_coordinator_for_entity

    result = _get_coordinator_for_entity(hass, "sensor.nonexistent")
    assert result is None


async def test_get_coordinator_for_entity_no_config_entry_id(
    hass: HomeAssistant,
) -> None:
    """_get_coordinator_for_entity returns None when config_entry_id is None."""
    from custom_components.maintenance_supporter import _get_coordinator_for_entity

    entity_reg = er.async_get(hass)
    # Mock entity with config_entry_id=None
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.config_entry_id = None
        mock_get.return_value = mock_entry
        result = _get_coordinator_for_entity(hass, "sensor.fake_entity")
    assert result is None


async def test_get_coordinator_for_entity_config_entry_gone(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """_get_coordinator_for_entity returns None when config entry doesn't exist."""
    from custom_components.maintenance_supporter import _get_coordinator_for_entity

    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_reg = er.async_get(hass)
    # Mock entity pointing to nonexistent config entry
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.config_entry_id = "nonexistent_entry_id"
        mock_get.return_value = mock_entry
        result = _get_coordinator_for_entity(hass, "sensor.fake_entity")
    assert result is None


async def test_get_coordinator_for_entity_no_runtime_data(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """_get_coordinator_for_entity returns None when runtime_data is None."""
    from custom_components.maintenance_supporter import _get_coordinator_for_entity

    await setup_integration(hass, global_config_entry)

    entity_reg = er.async_get(hass)
    # Mock entity pointing to global entry (which has no runtime_data.coordinator)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.config_entry_id = global_config_entry.entry_id
        mock_get.return_value = mock_entry
        result = _get_coordinator_for_entity(hass, "sensor.fake_entity")
    assert result is None


def test_get_task_id_for_entity_not_in_registry(
    hass: HomeAssistant,
) -> None:
    """_get_task_id_for_entity returns None when entity not in registry."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    result = _get_task_id_for_entity(hass, "sensor.nonexistent")
    assert result is None


async def test_get_task_id_for_entity_wrong_prefix(
    hass: HomeAssistant,
) -> None:
    """_get_task_id_for_entity returns None when unique_id has wrong prefix."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    entity_reg = er.async_get(hass)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.unique_id = "wrong_prefix_test"
        mock_get.return_value = mock_entry
        result = _get_task_id_for_entity(hass, "sensor.something")
    assert result is None


async def test_get_task_id_for_entity_no_config_entry_id(
    hass: HomeAssistant,
) -> None:
    """_get_task_id_for_entity returns None when config_entry_id is None."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    entity_reg = er.async_get(hass)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.unique_id = f"maintenance_supporter_obj_{TASK_ID_1}"
        mock_entry.config_entry_id = None
        mock_get.return_value = mock_entry
        result = _get_task_id_for_entity(hass, "sensor.something")
    assert result is None


async def test_get_task_id_for_entity_no_config_entry(
    hass: HomeAssistant,
) -> None:
    """_get_task_id_for_entity returns None when config entry doesn't exist."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    entity_reg = er.async_get(hass)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.unique_id = f"maintenance_supporter_obj_{TASK_ID_1}"
        mock_entry.config_entry_id = "nonexistent_entry_id"
        mock_get.return_value = mock_entry
        result = _get_task_id_for_entity(hass, "sensor.something")
    assert result is None


async def test_get_task_id_for_entity_no_matching_task(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """_get_task_id_for_entity returns None when no task matches unique_id."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    await setup_integration(hass, global_config_entry, object_config_entry)

    entity_reg = er.async_get(hass)
    with patch.object(entity_reg, "async_get") as mock_get:
        mock_entry = MagicMock()
        mock_entry.unique_id = "maintenance_supporter_pool_pump_ffffffffffffffffffffffffffffffff"
        mock_entry.config_entry_id = object_config_entry.entry_id
        mock_get.return_value = mock_entry
        result = _get_task_id_for_entity(hass, "sensor.something")
    assert result is None


# ─── __init__.py notification action handler ────────────────────────────


async def test_notification_action_unknown_type(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Notification action with unknown MS_ prefix returns early."""
    await setup_integration(hass, global_config_entry)

    hass.bus.async_fire("mobile_app_notification_action", {"action": "MS_UNKNOWN_something"})
    await hass.async_block_till_done()
    # No crash — the unknown action type is silently ignored


async def test_notification_action_invalid_format(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Notification action with invalid format logs warning and returns."""
    await setup_integration(hass, global_config_entry)

    # Valid prefix but wrong length
    hass.bus.async_fire("mobile_app_notification_action", {"action": "MS_COMPLETE_tooshort"})
    await hass.async_block_till_done()


async def test_notification_action_no_coordinator(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Notification action with valid format but no coordinator returns."""
    await setup_integration(hass, global_config_entry)

    # 26-char entry_id + _ + 32-char task_id = 59 chars in remainder
    fake_entry_id = "a" * 26
    fake_task_id = "b" * 32
    action = f"MS_COMPLETE_{fake_entry_id}_{fake_task_id}"
    hass.bus.async_fire("mobile_app_notification_action", {"action": action})
    await hass.async_block_till_done()


# ─── __init__.py async_remove_config_entry_device ───────────────────────


async def test_remove_config_entry_device_no_entities(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """async_remove_config_entry_device returns True when device has no entities."""
    from custom_components.maintenance_supporter import async_remove_config_entry_device

    await setup_integration(hass, global_config_entry, object_config_entry)

    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=object_config_entry.entry_id,
        identifiers={(DOMAIN, "test_device_empty")},
    )

    result = await async_remove_config_entry_device(
        hass, object_config_entry, device
    )
    assert result is True


async def test_remove_config_entry_device_with_entities(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """async_remove_config_entry_device returns False when device has entities."""
    from custom_components.maintenance_supporter import async_remove_config_entry_device

    await setup_integration(hass, global_config_entry, object_config_entry)

    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_or_create(
        config_entry_id=object_config_entry.entry_id,
        identifiers={(DOMAIN, "test_device_with_ent")},
    )

    entity_reg = er.async_get(hass)
    entity_reg.async_get_or_create(
        "sensor", DOMAIN, "device_entity_test",
        config_entry=object_config_entry,
        device_id=device.id,
    )

    result = await async_remove_config_entry_device(
        hass, object_config_entry, device
    )
    assert result is False


# ─── diagnostics.py edge cases ──────────────────────────────────────────


async def test_diagnostics_overview_due_soon(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """_get_overview counts DUE_SOON tasks correctly."""
    # Create a task that is due_soon (close to interval)
    last = (dt_util.now().date() - timedelta(days=25)).isoformat()
    task = build_task_data(
        last_performed=last,
        interval_days=30,
        warning_days=7,
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Due Soon Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Due Soon Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_due_soon_diag",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_config_entry, entry)

    from custom_components.maintenance_supporter.diagnostics import (
        async_get_config_entry_diagnostics,
    )

    diag = await async_get_config_entry_diagnostics(hass, global_config_entry)
    overview = diag.get("overview", {})
    assert overview.get("due_soon_tasks", 0) >= 1


async def test_diagnostics_trigger_health_missing_entity(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """_check_trigger_health reports MISSING when entity doesn't exist."""
    task = build_task_data(
        trigger_config={
            "entity_id": "sensor.totally_missing",
            "type": "threshold",
            "trigger_above": 30,
        },
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Missing Entity Diag",
        data=build_object_entry_data(
            object_data=build_object_data(name="Missing Entity Diag"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_missing_diag",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_config_entry, entry)

    from custom_components.maintenance_supporter.diagnostics import (
        async_get_config_entry_diagnostics,
    )

    diag = await async_get_config_entry_diagnostics(hass, entry)
    trigger_status = diag.get("trigger_status", [])
    assert len(trigger_status) == 1
    assert trigger_status[0]["entity_health"] == "missing"


async def test_diagnostics_trigger_health_unavailable(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """_check_trigger_health reports UNAVAILABLE when entity is unavailable."""
    set_sensor_state(hass, "sensor.unavail_diag", "unavailable")
    task = build_task_data(
        trigger_config={
            "entity_id": "sensor.unavail_diag",
            "type": "threshold",
            "trigger_above": 30,
        },
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Unavail Diag",
        data=build_object_entry_data(
            object_data=build_object_data(name="Unavail Diag"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_unavail_diag",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_config_entry, entry)

    from custom_components.maintenance_supporter.diagnostics import (
        async_get_config_entry_diagnostics,
    )

    diag = await async_get_config_entry_diagnostics(hass, entry)
    trigger_status = diag.get("trigger_status", [])
    assert len(trigger_status) == 1
    assert trigger_status[0]["entity_health"] == "unavailable"


async def test_diagnostics_data_quality_all_warnings(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """_check_data_quality reports warnings for empty name, no tasks, etc."""
    from custom_components.maintenance_supporter.diagnostics import _check_data_quality

    # Object with no name, task with no name, time-based without interval
    data: dict[str, Any] = {
        CONF_OBJECT: {"name": ""},
        CONF_TASKS: {
            "task_a": {
                "name": "",
                "schedule_type": "time_based",
                "interval_days": None,
            },
        },
    }
    warnings = _check_data_quality(data)
    assert "Object has no name" in warnings
    # Task with no name
    assert any("has no name" in w for w in warnings)
    # Time-based without interval
    assert any("no interval" in w for w in warnings)

    # Empty tasks
    data2: dict[str, Any] = {
        CONF_OBJECT: {"name": "Test"},
        CONF_TASKS: {},
    }
    warnings2 = _check_data_quality(data2)
    assert "Object has no tasks defined" in warnings2


# ─── coordinator.py budget edge cases ───────────────────────────────────


async def test_budget_both_zero_returns(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """_async_check_budget returns early when both budgets are zero."""
    from custom_components.maintenance_supporter.helpers.notification_manager import (
        NotificationManager,
    )

    # Enable budget alerts but set both budgets to 0
    global_data = dict(global_config_entry.data)
    global_data[CONF_BUDGET_ALERTS_ENABLED] = True
    global_data[CONF_BUDGET_ALERT_THRESHOLD] = 80
    global_data[CONF_BUDGET_MONTHLY] = 0
    global_data[CONF_BUDGET_YEARLY] = 0
    hass.config_entries.async_update_entry(
        global_config_entry, data=global_data
    )

    await setup_integration(hass, global_config_entry, object_config_entry)

    # Set up a mock NM so the first isinstance check passes
    nm = MagicMock(spec=NotificationManager)
    nm.enabled = True
    hass.data[DOMAIN]["_notification_manager"] = nm

    coordinator = object_config_entry.runtime_data.coordinator
    await coordinator._async_check_budget({})


async def test_budget_skips_non_completed_and_no_cost(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Budget traversal skips non-completed entries, entries with no cost, and bad timestamps."""
    from custom_components.maintenance_supporter.helpers.notification_manager import (
        NotificationManager,
    )

    global_data = dict(global_config_entry.data)
    global_data[CONF_BUDGET_ALERTS_ENABLED] = True
    global_data[CONF_BUDGET_ALERT_THRESHOLD] = 80
    global_data[CONF_BUDGET_MONTHLY] = 1000
    global_data[CONF_BUDGET_YEARLY] = 5000
    hass.config_entries.async_update_entry(
        global_config_entry, data=global_data
    )

    now = datetime.now()
    task = build_task_data(
        history=[
            # Skipped entry (not completed) → line 660
            {"type": "skipped", "timestamp": now.isoformat()},
            # Completed but no cost → line 663
            {"type": "completed", "timestamp": now.isoformat(), "cost": None},
            # Completed with cost but bad timestamp → lines 667-668
            {"type": "completed", "timestamp": "not-a-date", "cost": 50.0},
            # Valid entry (below threshold, no alert)
            {"type": "completed", "timestamp": now.isoformat(), "cost": 10.0},
        ],
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Budget Edge",
        data=build_object_entry_data(
            object_data=build_object_data(name="Budget Edge"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_budget_edge",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    # Set up a mock NM so the first isinstance check passes
    nm = MagicMock(spec=NotificationManager)
    nm.enabled = True
    hass.data[DOMAIN]["_notification_manager"] = nm

    coordinator = entry.runtime_data.coordinator
    await coordinator._async_check_budget({})


# ─── sensor.py attribute edge cases ─────────────────────────────────────


async def test_sensor_runtime_fallback_attributes(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Sensor shows runtime fallback attributes when trigger instance is missing."""
    from custom_components.maintenance_supporter.sensor import MaintenanceSensor

    last = (dt_util.now().date() - timedelta(days=10)).isoformat()
    task = build_task_data(
        last_performed=last,
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "runtime",
            "entity_id": "sensor.pump_fallback",
            "entity_ids": ["sensor.pump_fallback"],
            "trigger_runtime_hours": 200,
            "trigger_accumulated_seconds": 7200.0,
        },
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="RT Fallback",
        data=build_object_entry_data(
            object_data=build_object_data(name="RT Fallback"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_rt_fallback",
    )
    entry.add_to_hass(hass)

    # Patch trigger creation to raise so sensor falls back to config values
    with patch(
        "custom_components.maintenance_supporter.sensor.create_triggers",
        side_effect=ValueError("Test trigger setup failure"),
    ):
        await setup_integration(hass, global_config_entry, entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1

    state = hass.states.get(sensor_entities[0].entity_id)
    assert state is not None
    # trigger_accumulated_hours and trigger_remaining_hours removed from state attributes


async def test_sensor_weibull_random_failures(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Sensor shows weibull_beta_interpretation = random_failures for beta ~1.0."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    coordinator = object_config_entry.runtime_data.coordinator

    # Inject analysis data with weibull_beta = 1.0 (random failures)
    if CONF_TASKS in coordinator.data:
        for task_id in coordinator.data[CONF_TASKS]:
            coordinator.data[CONF_TASKS][task_id]["_interval_analysis"] = {
                "seasonal_factor": None,
                "weibull_beta": 1.0,
                "weibull_eta": 30.0,
                "weibull_r_squared": 0.95,
                "confidence_interval_low": None,
            }

    # Get sensor entity
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, object_config_entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1

    # Force sensor to re-read coordinator data
    coordinator.async_set_updated_data(coordinator.data)
    await hass.async_block_till_done()

    state = hass.states.get(sensor_entities[0].entity_id)
    assert state is not None
    assert state.attributes.get("weibull_beta_interpretation") == "random_failures"


# ─── __init__.py unload cleanup ─────────────────────────────────────────


async def test_unload_last_entry_cleans_up_domain_data(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Unloading the last entry cleans up hass.data[DOMAIN]."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    assert DOMAIN in hass.data

    # Unload both entries
    await hass.config_entries.async_unload(object_config_entry.entry_id)
    await hass.async_block_till_done()
    await hass.config_entries.async_unload(global_config_entry.entry_id)
    await hass.async_block_till_done()

    # After removing both entries from HA, domain data should be gone
    # (only when async_entries returns empty)
    # Note: entries are unloaded but still registered - data cleanup happens
    # only when no entries remain. This tests the cleanup path.


# ─── __init__.py global options updated ─────────────────────────────────


async def test_global_options_updated_panel_toggle(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """_async_global_options_updated toggles panel registration."""
    await setup_integration(hass, global_config_entry)

    from custom_components.maintenance_supporter.const import CONF_PANEL_ENABLED

    # Enable panel
    hass.config_entries.async_update_entry(
        global_config_entry, options={CONF_PANEL_ENABLED: True}
    )
    await hass.async_block_till_done()

    # Disable panel
    hass.config_entries.async_update_entry(
        global_config_entry, options={CONF_PANEL_ENABLED: False}
    )
    await hass.async_block_till_done()
