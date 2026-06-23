"""Tests for diagnostics and repairs."""

from __future__ import annotations

from custom_components.maintenance_supporter.const import (
    GLOBAL_UNIQUE_ID,
    ScheduleType,
)
from .conftest import (
    build_global_entry_data,
)

from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
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


def test_diagnostics_check_trigger_status_no_entity_id(hass: HomeAssistant) -> None:
    """_check_trigger_status skips tasks with trigger_config but no entity_ids."""
    from custom_components.maintenance_supporter.diagnostics import _check_trigger_status

    data: dict[str, Any] = {
        CONF_TASKS: {
            TASK_ID_1: {
                "trigger_config": {
                    "type": "threshold",
                    "trigger_above": 80.0,
                    # No entity_id or entity_ids — should skip
                },
            },
        },
    }
    results = _check_trigger_status(hass, data)
    # No entity_ids → result should be empty
    assert results == []


def test_diagnostics_data_quality_missing_interval_warning(hass: HomeAssistant) -> None:
    """_check_data_quality warns when time_based task has no interval."""
    from custom_components.maintenance_supporter.diagnostics import _check_data_quality

    data: dict[str, Any] = {
        CONF_OBJECT: {"name": "My Object"},
        CONF_TASKS: {
            TASK_ID_1: {
                "name": "Interval-less Task",
                "schedule_type": "time_based",
                # no interval_days
            },
        },
    }
    warnings = _check_data_quality(data)
    assert any("interval" in w.lower() or "time-based" in w.lower() for w in warnings)


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


def test_diagnostics_no_false_warning_compound() -> None:
    """Compound triggers should not produce 'no entity' warnings."""
    from custom_components.maintenance_supporter.diagnostics import _check_data_quality

    data = {
        CONF_OBJECT: {"name": "Test"},
        CONF_TASKS: {
            "t1": {
                "name": "Test Task",
                "schedule_type": "sensor_based",
                "trigger_config": {
                    "type": "compound",
                    "compound_logic": "AND",
                    "conditions": [
                        {"type": "threshold", "entity_id": "sensor.a", "trigger_above": 10},
                        {"type": "threshold", "entity_id": "sensor.b", "trigger_above": 20},
                    ],
                },
            }
        },
    }
    warnings = _check_data_quality(data)
    assert not any("no entity" in w.lower() for w in warnings)


def test_diagnostics_trigger_status_compound(hass: HomeAssistant) -> None:
    """_check_trigger_status extracts entity_ids from compound conditions."""
    from custom_components.maintenance_supporter.diagnostics import _check_trigger_status

    hass.states.async_set("sensor.a", "10")
    hass.states.async_set("sensor.b", "20")

    data = {
        CONF_TASKS: {
            "t1": {
                "trigger_config": {
                    "type": "compound",
                    "conditions": [
                        {"type": "threshold", "entity_id": "sensor.a"},
                        {"type": "threshold", "entity_id": "sensor.b"},
                    ],
                }
            }
        }
    }
    results = _check_trigger_status(hass, data)
    entity_ids = [r["trigger_entity"] for r in results]
    assert "sensor.a" in entity_ids
    assert "sensor.b" in entity_ids


def _make_global(hass: HomeAssistant, **kw) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(**kw),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


def _make_object(
    hass: HomeAssistant,
    tasks: dict | None = None,
    name: str = "Test Object",
    uid: str = "test_obj_cov",
    object_data: dict | None = None,
) -> MockConfigEntry:
    od = object_data or build_object_data(name=name)
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title=name,
        data=build_object_entry_data(object_data=od, tasks=tasks or {}),
        source="user",
        unique_id=f"maintenance_supporter_{uid}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── diagnostics.py lines 175-176 — get diagnostics for global and object ────


async def test_diagnostics_global_entry(hass: HomeAssistant) -> None:
    """diagnostics.py: get diagnostics for global entry returns overview."""
    from custom_components.maintenance_supporter.diagnostics import async_get_config_entry_diagnostics

    global_entry = _make_global(hass)
    await setup_integration(hass, global_entry)

    diag = await async_get_config_entry_diagnostics(hass, global_entry)
    assert "overview" in diag
    assert "total_objects" in diag["overview"]


async def test_diagnostics_object_entry(hass: HomeAssistant) -> None:
    """diagnostics.py line 175-176: get diagnostics for object entry includes statistics."""
    from custom_components.maintenance_supporter.diagnostics import async_get_config_entry_diagnostics

    global_entry = _make_global(hass)
    hass.states.async_set("sensor.diag_trigger", "25.0")
    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.diag_trigger",
            "trigger_above": 30,
        },
    )
    obj_entry = _make_object(hass, tasks={TASK_ID_1: task}, uid="diag_obj")
    await setup_integration(hass, global_entry, obj_entry)

    diag = await async_get_config_entry_diagnostics(hass, obj_entry)
    assert "statistics" in diag
    assert "trigger_status" in diag
    assert diag["statistics"]["total_tasks"] == 1
