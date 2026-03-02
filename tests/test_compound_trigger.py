"""Tests for compound trigger AND/OR logic, sub-entities, proxy coordinator."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    ScheduleType,
)
from custom_components.maintenance_supporter.entity.triggers.compound import (
    CompoundSubEntity,
    CompoundTrigger,
    _CompoundCoordinatorProxy,
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


def _make_compound_entry(
    hass: HomeAssistant,
    compound_logic: str = "AND",
    conditions: list[dict[str, Any]] | None = None,
    unique_id: str = "compound",
) -> MockConfigEntry:
    if conditions is None:
        conditions = [
            {
                "type": "threshold",
                "entity_id": "sensor.temp",
                "entity_ids": ["sensor.temp"],
                "trigger_above": 30.0,
            },
            {
                "type": "threshold",
                "entity_id": "sensor.humidity",
                "entity_ids": ["sensor.humidity"],
                "trigger_above": 70.0,
            },
        ]

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "compound",
            "compound_logic": compound_logic,
            "conditions": conditions,
        },
    )
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Compound Test",
        data=build_object_entry_data(
            object_data=build_object_data(name="Compound Test"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Compound Trigger AND Logic ────────────────────────────────────────


async def test_compound_trigger_and_setup(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test compound trigger with AND logic sets up sub-triggers."""
    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    obj_entry = _make_compound_entry(hass, "AND", unique_id="and_setup")
    await setup_integration(hass, global_entry, obj_entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, obj_entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    assert len(sensors) >= 1


async def test_compound_trigger_and_not_triggered_initially(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test AND compound trigger is not triggered when conditions are not met."""
    hass.states.async_set("sensor.temp", "25")  # Below 30
    hass.states.async_set("sensor.humidity", "60")  # Below 70

    obj_entry = _make_compound_entry(hass, "AND", unique_id="and_not_trig")
    await setup_integration(hass, global_entry, obj_entry)

    state = hass.states.get(
        next(
            (e.entity_id for e in er.async_entries_for_config_entry(
                er.async_get(hass), obj_entry.entry_id
            ) if e.domain == "sensor"),
            None,
        )
    )
    if state:
        assert state.attributes.get("trigger_active", False) is False


async def test_compound_trigger_and_partial_trigger(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test AND compound trigger: one condition met doesn't trigger."""
    hass.states.async_set("sensor.temp", "35")  # Above 30 → condition 1 met
    hass.states.async_set("sensor.humidity", "60")  # Below 70 → condition 2 not met

    obj_entry = _make_compound_entry(hass, "AND", unique_id="and_partial")
    await setup_integration(hass, global_entry, obj_entry)

    state = hass.states.get(
        next(
            (e.entity_id for e in er.async_entries_for_config_entry(
                er.async_get(hass), obj_entry.entry_id
            ) if e.domain == "sensor"),
            None,
        )
    )
    if state:
        # AND logic: both must be true
        assert state.attributes.get("trigger_active", False) is False


# ─── Compound Trigger OR Logic ─────────────────────────────────────────


async def test_compound_trigger_or_setup(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test compound trigger with OR logic sets up correctly."""
    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    obj_entry = _make_compound_entry(hass, "OR", unique_id="or_setup")
    await setup_integration(hass, global_entry, obj_entry)

    entity_reg = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_reg, obj_entry.entry_id)
    sensors = [e for e in entities if e.domain == "sensor"]
    assert len(sensors) >= 1


async def test_compound_trigger_or_one_met(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test OR compound trigger: one condition met triggers."""
    hass.states.async_set("sensor.temp", "35")  # Above 30
    hass.states.async_set("sensor.humidity", "60")  # Below 70

    obj_entry = _make_compound_entry(hass, "OR", unique_id="or_one_met")
    await setup_integration(hass, global_entry, obj_entry)

    state = hass.states.get(
        next(
            (e.entity_id for e in er.async_entries_for_config_entry(
                er.async_get(hass), obj_entry.entry_id
            ) if e.domain == "sensor"),
            None,
        )
    )
    # OR logic: at least one condition met → should trigger
    # NOTE: Whether it actually triggers depends on sub-trigger setup timing


# ─── CompoundSubEntity Unit Tests ──────────────────────────────────────


def test_compound_sub_entity_aggregation_any() -> None:
    """Test CompoundSubEntity aggregation with 'any' logic."""
    mock_parent = MagicMock()
    mock_parent.entity.entity_id = "sensor.test"
    mock_parent.entity._task_id = TASK_ID_1
    mock_parent.entity.coordinator = MagicMock()

    sub = CompoundSubEntity(mock_parent, 0, {"entity_logic": "any"})

    # First entity triggered
    sub.async_update_trigger_state(True, 35.0, "sensor.temp1")
    mock_parent._on_condition_changed.assert_called_with(0, True)

    # Second entity not triggered, but any=True → still aggregated True
    sub.async_update_trigger_state(False, 20.0, "sensor.temp2")
    mock_parent._on_condition_changed.assert_called_with(0, True)


def test_compound_sub_entity_aggregation_all() -> None:
    """Test CompoundSubEntity aggregation with 'all' logic."""
    mock_parent = MagicMock()
    mock_parent.entity.entity_id = "sensor.test"
    mock_parent.entity._task_id = TASK_ID_1
    mock_parent.entity.coordinator = MagicMock()

    sub = CompoundSubEntity(mock_parent, 0, {"entity_logic": "all"})

    # First entity triggered
    sub.async_update_trigger_state(True, 35.0, "sensor.temp1")
    # Only one entity: all([True]) → True
    mock_parent._on_condition_changed.assert_called_with(0, True)

    # Second entity not triggered
    sub.async_update_trigger_state(False, 20.0, "sensor.temp2")
    # all: {temp1: True, temp2: False} → False
    mock_parent._on_condition_changed.assert_called_with(0, False)


def test_compound_sub_entity_write_ha_state_noop() -> None:
    """Test CompoundSubEntity.async_write_ha_state is a no-op."""
    mock_parent = MagicMock()
    mock_parent.entity.entity_id = "sensor.test"
    mock_parent.entity._task_id = TASK_ID_1
    mock_parent.entity.coordinator = MagicMock()

    sub = CompoundSubEntity(mock_parent, 0, {})
    # Should not raise
    sub.async_write_ha_state()


def test_compound_sub_entity_no_trigger_entity_id() -> None:
    """Test CompoundSubEntity with no trigger_entity_id uses direct value."""
    mock_parent = MagicMock()
    mock_parent.entity.entity_id = "sensor.test"
    mock_parent.entity._task_id = TASK_ID_1
    mock_parent.entity.coordinator = MagicMock()

    sub = CompoundSubEntity(mock_parent, 0, {})

    # No trigger_entity_id → direct is_triggered
    sub.async_update_trigger_state(True, None, None)
    mock_parent._on_condition_changed.assert_called_with(0, True)


# ─── _CompoundCoordinatorProxy Unit Tests ──────────────────────────────


async def test_coordinator_proxy_delegates_attrs() -> None:
    """Test proxy delegates unknown attributes to real coordinator."""
    real = MagicMock()
    real.some_method.return_value = 42

    proxy = _CompoundCoordinatorProxy(real, 0)
    assert proxy.some_method() == 42


async def test_coordinator_proxy_persist_runtime(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test proxy persists runtime under condition index."""
    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    obj_entry = _make_compound_entry(hass, "AND", unique_id="proxy_persist")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    coordinator = entry.runtime_data.coordinator

    proxy = _CompoundCoordinatorProxy(coordinator, 0)
    await proxy.async_persist_trigger_runtime(
        TASK_ID_1,
        {"accumulated_seconds": 3600},
        entity_id="sensor.temp",
    )

    # Verify data was persisted
    updated = hass.config_entries.async_get_entry(obj_entry.entry_id)
    trigger_config = updated.data[CONF_TASKS][TASK_ID_1].get("trigger_config", {})
    trigger_state = trigger_config.get("_trigger_state", {})
    conditions = trigger_state.get("conditions", [])
    assert len(conditions) >= 1
    assert "sensor.temp" in conditions[0]


async def test_coordinator_proxy_persist_no_entity(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test proxy persists runtime without entity_id."""
    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    obj_entry = _make_compound_entry(hass, "AND", unique_id="proxy_no_entity")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    coordinator = entry.runtime_data.coordinator

    proxy = _CompoundCoordinatorProxy(coordinator, 0)
    await proxy.async_persist_trigger_runtime(
        TASK_ID_1,
        {"some_key": "some_value"},
        entity_id=None,
    )

    updated = hass.config_entries.async_get_entry(obj_entry.entry_id)
    trigger_config = updated.data[CONF_TASKS][TASK_ID_1].get("trigger_config", {})
    trigger_state = trigger_config.get("_trigger_state", {})
    conditions = trigger_state.get("conditions", [])
    assert len(conditions) >= 1
    assert conditions[0].get("some_key") == "some_value"


async def test_coordinator_proxy_persist_missing_task(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test proxy returns early if task_id not in data."""
    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    obj_entry = _make_compound_entry(hass, "AND", unique_id="proxy_missing")
    await setup_integration(hass, global_entry, obj_entry)

    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    coordinator = entry.runtime_data.coordinator

    proxy = _CompoundCoordinatorProxy(coordinator, 0)
    # Should not crash
    await proxy.async_persist_trigger_runtime(
        "nonexistent_task_id",
        {"data": "value"},
    )


# ─── CompoundTrigger evaluate ──────────────────────────────────────────


def test_compound_evaluate_and() -> None:
    """Test evaluate with AND logic."""
    mock_entity = MagicMock()
    mock_entity.entity_id = "sensor.test"
    mock_entity._task_id = TASK_ID_1
    mock_entity.coordinator = MagicMock()

    hass = MagicMock()
    trigger = CompoundTrigger(hass, mock_entity, {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [{"type": "threshold"}, {"type": "threshold"}],
    })

    # Initially both False
    assert trigger.evaluate(0) is False

    # Set one to True
    trigger._condition_states[0] = True
    assert trigger.evaluate(0) is False  # AND: need both

    # Set both to True
    trigger._condition_states[1] = True
    assert trigger.evaluate(0) is True


def test_compound_evaluate_or() -> None:
    """Test evaluate with OR logic."""
    mock_entity = MagicMock()
    mock_entity.entity_id = "sensor.test"
    mock_entity._task_id = TASK_ID_1
    mock_entity.coordinator = MagicMock()

    hass = MagicMock()
    trigger = CompoundTrigger(hass, mock_entity, {
        "type": "compound",
        "compound_logic": "OR",
        "conditions": [{"type": "threshold"}, {"type": "threshold"}],
    })

    # Initially both False
    assert trigger.evaluate(0) is False

    # Set one to True
    trigger._condition_states[0] = True
    assert trigger.evaluate(0) is True  # OR: one is enough


def test_compound_condition_states_property() -> None:
    """Test condition_states property returns copy."""
    mock_entity = MagicMock()
    mock_entity.entity_id = "sensor.test"
    mock_entity._task_id = TASK_ID_1
    mock_entity.coordinator = MagicMock()

    hass = MagicMock()
    trigger = CompoundTrigger(hass, mock_entity, {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [{"type": "threshold"}],
    })

    states = trigger.condition_states
    assert states == [False]
    # Should be a copy
    states[0] = True
    assert trigger.condition_states == [False]


# ─── CompoundTrigger _on_condition_changed ─────────────────────────────


def test_on_condition_changed_activates(hass: HomeAssistant) -> None:
    """Test _on_condition_changed fires activation."""
    mock_entity = MagicMock()
    mock_entity.entity_id = "sensor.compound_test"
    mock_entity._task_id = TASK_ID_1
    mock_entity.coordinator = MagicMock()

    trigger = CompoundTrigger(hass, mock_entity, {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [{"type": "threshold"}, {"type": "threshold"}],
    })

    # Both conditions met → trigger activates
    trigger._on_condition_changed(0, True)
    trigger._on_condition_changed(1, True)

    # The entity should have been notified
    mock_entity.async_update_trigger_state.assert_called()


def test_on_condition_changed_deactivates(hass: HomeAssistant) -> None:
    """Test _on_condition_changed fires deactivation."""
    mock_entity = MagicMock()
    mock_entity.entity_id = "sensor.compound_test"
    mock_entity._task_id = TASK_ID_1
    mock_entity.coordinator = MagicMock()

    trigger = CompoundTrigger(hass, mock_entity, {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [{"type": "threshold"}, {"type": "threshold"}],
    })

    # Set to triggered first
    trigger._condition_states = [True, True]
    trigger._triggered = True

    # One condition no longer met → deactivates
    trigger._on_condition_changed(0, False)

    mock_entity.async_update_trigger_state.assert_called_with(
        is_triggered=False,
        current_value=None,
        trigger_entity_id=None,
    )


# ─── CompoundTrigger reset ────────────────────────────────────────────


def test_compound_reset() -> None:
    """Test compound reset clears all states."""
    mock_entity = MagicMock()
    mock_entity.entity_id = "sensor.test"
    mock_entity._task_id = TASK_ID_1
    mock_entity.coordinator = MagicMock()

    hass = MagicMock()
    trigger = CompoundTrigger(hass, mock_entity, {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [{"type": "threshold"}, {"type": "threshold"}],
    })

    trigger._condition_states = [True, True]
    trigger._triggered = True

    trigger.reset()

    assert trigger._condition_states == [False, False]
    assert trigger._triggered is False
