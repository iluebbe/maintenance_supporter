"""Tests for diagnostics and repairs."""

from __future__ import annotations

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.diagnostics import (
    async_get_config_entry_diagnostics,
)

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    set_sensor_state,
    setup_integration,
)


# ─── 11.1 Global Entry Diagnostics ──────────────────────────────────────


async def test_global_diagnostics(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test diagnostics for the global entry."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    diag = await async_get_config_entry_diagnostics(hass, global_config_entry)

    assert diag["entry"]["is_global"] is True
    assert "overview" in diag
    assert diag["overview"]["total_objects"] >= 1
    assert diag["overview"]["total_tasks"] >= 1


async def test_global_diagnostics_counts(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
    overdue_config_entry: ConfigEntry,
) -> None:
    """Test that global diagnostics correctly counts objects and overdue tasks."""
    await setup_integration(
        hass, global_config_entry, object_config_entry, overdue_config_entry
    )

    diag = await async_get_config_entry_diagnostics(hass, global_config_entry)

    assert diag["overview"]["total_objects"] == 2
    assert diag["overview"]["total_tasks"] == 2
    assert diag["overview"]["overdue_tasks"] >= 1


# ─── 11.2 Object Entry Diagnostics ──────────────────────────────────────


async def test_object_diagnostics(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test diagnostics for an object entry."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    diag = await async_get_config_entry_diagnostics(hass, object_config_entry)

    assert diag["entry"]["is_global"] is False
    assert "statistics" in diag
    assert diag["statistics"]["total_tasks"] == 1
    assert diag["statistics"]["enabled_tasks"] == 1
    assert "data_quality" in diag
    assert "coordinator" in diag


async def test_object_diagnostics_redaction(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
    object_config_entry: ConfigEntry,
) -> None:
    """Test that sensitive fields are redacted in diagnostics."""
    await setup_integration(hass, global_config_entry, object_config_entry)

    diag = await async_get_config_entry_diagnostics(hass, object_config_entry)

    # Name should be redacted in data
    data = diag.get("data", {})
    obj = data.get("object", {})
    assert obj.get("name") == "**REDACTED**"


async def test_diagnostics_trigger_status(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test diagnostics trigger status section."""
    set_sensor_state(hass, "sensor.pressure", "1.2")
    task = build_task_data(
        trigger_config={
            "entity_id": "sensor.pressure",
            "attribute": None,
            "type": "threshold",
            "trigger_above": 1.5,
        },
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Trigger Object",
        data=build_object_entry_data(
            object_data=build_object_data(name="Trigger Object"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_trigger_object",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    diag = await async_get_config_entry_diagnostics(hass, entry)
    trigger_status = diag.get("trigger_status", [])
    assert len(trigger_status) == 1
    assert trigger_status[0]["trigger_entity"] == "sensor.pressure"
    assert trigger_status[0]["entity_available"] is True


async def test_diagnostics_data_quality_warnings(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test diagnostics data quality warnings."""
    # Create a task with issues
    task = build_task_data(
        trigger_config={"entity_id": None},
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Quality Check",
        data=build_object_entry_data(
            object_data=build_object_data(name="Quality Check"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_quality_check",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    diag = await async_get_config_entry_diagnostics(hass, entry)
    warnings = diag.get("data_quality", [])
    # Should warn about trigger config without entity
    assert len(warnings) >= 1


# ─── 11.3 Repairs ───────────────────────────────────────────────────────


async def test_repairs_created_for_missing_trigger(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that missing trigger entity is detected during startup grace period.

    During the startup grace period, no repair issue is created yet but the
    trigger_entity_state attribute reflects the 'startup' state. The repair
    issue would be created after the grace period + threshold refreshes.
    """
    from homeassistant.helpers import entity_registry as er
    from homeassistant.helpers import issue_registry as ir

    # Task references non-existent sensor
    task = build_task_data(
        trigger_config={
            "entity_id": "sensor.does_not_exist",
            "attribute": None,
            "type": "threshold",
            "trigger_above": 50,
        },
        schedule_type="sensor_based",
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Missing Trigger",
        data=build_object_entry_data(
            object_data=build_object_data(name="Missing Trigger"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_missing_trigger",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    # During startup grace period, no repair issue is created yet
    issue_reg = ir.async_get(hass)
    issues = issue_reg.issues
    our_issues = {
        k: v for k, v in issues.items()
        if k[0] == DOMAIN and "missing_trigger" in k[1]
    }
    # No issue during grace period
    assert len(our_issues) == 0

    # The sensor is created and stays available (not "unavailable").
    # trigger_entity_state may be "available" (default before first coordinator
    # refresh) or "startup" (during grace period after first refresh).
    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, entry.entry_id)
    sensor_entities = [e for e in entities if e.domain == "sensor"]
    assert len(sensor_entities) >= 1
    state = hass.states.get(sensor_entities[0].entity_id)
    assert state is not None
    assert state.state != "unavailable"


async def test_repairs_removed_when_trigger_available(
    hass: HomeAssistant,
    global_config_entry: ConfigEntry,
) -> None:
    """Test that repair issue is removed when trigger entity becomes available."""
    from homeassistant.helpers import issue_registry as ir

    # Make the sensor available
    set_sensor_state(hass, "sensor.now_available", "42.0")

    task = build_task_data(
        trigger_config={
            "entity_id": "sensor.now_available",
            "attribute": None,
            "type": "threshold",
            "trigger_above": 50,
        },
        schedule_type="sensor_based",
    )

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Available Trigger",
        data=build_object_entry_data(
            object_data=build_object_data(name="Available Trigger"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_available_trigger",
    )
    entry.add_to_hass(hass)

    await setup_integration(hass, global_config_entry, entry)

    # Repair issue should NOT be created
    issue_reg = ir.async_get(hass)
    issues = issue_reg.issues
    our_issues = {
        k: v for k, v in issues.items()
        if k[0] == DOMAIN
        and "missing_trigger" in k[1]
        and entry.entry_id in k[1]
    }
    assert len(our_issues) == 0
