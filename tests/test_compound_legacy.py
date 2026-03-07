"""Tests for compound trigger legacy fallback paths (Store=None).

These cover the defensive `else` branches in ``_CompoundCoordinatorProxy``
and the condition-state restoration path in ``CompoundTrigger.async_setup``
that execute when a coordinator has no Store attached (pre-migration or
error recovery).

Strategy: set up integration normally (migration creates Store), then
patch ``coordinator._store = None`` and put full task data back in
ConfigEntry (same approach as ``test_coordinator_legacy.py``).
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import patch

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
    _CompoundCoordinatorProxy,
)

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


# ─── Helpers ────────────────────────────────────────────────────────────


def _compound_task(
    conditions: list[dict[str, Any]] | None = None,
    compound_logic: str = "AND",
    trigger_state: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Build a compound-trigger task with optional pre-set trigger state."""
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

    tc: dict[str, Any] = {
        "type": "compound",
        "compound_logic": compound_logic,
        "conditions": conditions,
    }
    if trigger_state is not None:
        tc["_trigger_state"] = trigger_state

    return build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat(),
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config=tc,
    )


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    """Create and register a global config entry."""
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data={
            "default_warning_days": 7,
            "notifications_enabled": False,
            "notify_service": "",
        },
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


async def _setup_compound_legacy(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    task: dict[str, Any],
    unique_id: str,
) -> tuple[Any, MockConfigEntry]:
    """Set up a compound entry normally, then disable its Store for legacy testing."""
    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Compound Legacy",
        data=build_object_entry_data(
            object_data=build_object_data(name="Compound Legacy"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id=f"maintenance_supporter_{unique_id}",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    coord = refreshed.runtime_data.coordinator
    coord._store = None

    # Put full task data back into ConfigEntry.data so legacy paths work
    new_data = dict(refreshed.data)
    new_data[CONF_TASKS] = {TASK_ID_1: task}
    hass.config_entries.async_update_entry(refreshed, data=new_data)

    return coord, refreshed


# ─── _CompoundCoordinatorProxy legacy: per-entity (lines 132-136) ────


async def test_proxy_legacy_persist_per_entity(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Proxy writes per-entity data under _trigger_state.conditions[idx][entity_id]."""
    task = _compound_task()
    coord, entry = await _setup_compound_legacy(
        hass, global_entry, task, "proxy_per_entity"
    )

    proxy = _CompoundCoordinatorProxy(coord, 0)
    await proxy.async_persist_trigger_runtime(
        TASK_ID_1,
        {"accumulated_seconds": 3600.0, "baseline_value": 25.5},
        entity_id="sensor.temp",
    )

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    tc = refreshed.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    ts = tc["_trigger_state"]
    cond_state = ts["conditions"][0]
    assert cond_state["sensor.temp"]["accumulated_seconds"] == 3600.0
    assert cond_state["sensor.temp"]["baseline_value"] == 25.5


async def test_proxy_legacy_persist_per_entity_condition_idx_1(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Proxy at condition_idx=1 writes to the second slot in conditions list."""
    task = _compound_task()
    coord, entry = await _setup_compound_legacy(
        hass, global_entry, task, "proxy_per_entity_idx1"
    )

    proxy = _CompoundCoordinatorProxy(coord, 1)
    await proxy.async_persist_trigger_runtime(
        TASK_ID_1,
        {"baseline_value": 50.0},
        entity_id="sensor.humidity",
    )

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    tc = refreshed.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    ts = tc["_trigger_state"]
    conditions = ts["conditions"]
    # Index 0 should be padded as empty, index 1 should have the data
    assert len(conditions) >= 2
    assert conditions[1]["sensor.humidity"]["baseline_value"] == 50.0


# ─── _CompoundCoordinatorProxy legacy: flat / no entity_id (lines 137-139)


async def test_proxy_legacy_persist_flat(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Proxy writes flat data (no entity_id) under _trigger_state.conditions[idx]."""
    task = _compound_task()
    coord, entry = await _setup_compound_legacy(
        hass, global_entry, task, "proxy_flat"
    )

    proxy = _CompoundCoordinatorProxy(coord, 0)
    await proxy.async_persist_trigger_runtime(
        TASK_ID_1,
        {"trigger_baseline_value": 100.0, "accumulated_count": 42},
        entity_id=None,
    )

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    tc = refreshed.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    ts = tc["_trigger_state"]
    cond_state = ts["conditions"][0]
    assert cond_state["trigger_baseline_value"] == 100.0
    assert cond_state["accumulated_count"] == 42


async def test_proxy_legacy_persist_flat_condition_idx_1(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Flat persist at condition_idx=1 extends conditions list as needed."""
    task = _compound_task()
    coord, entry = await _setup_compound_legacy(
        hass, global_entry, task, "proxy_flat_idx1"
    )

    proxy = _CompoundCoordinatorProxy(coord, 1)
    await proxy.async_persist_trigger_runtime(
        TASK_ID_1,
        {"some_key": "some_value"},
        entity_id=None,
    )

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    tc = refreshed.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    ts = tc["_trigger_state"]
    conditions = ts["conditions"]
    assert len(conditions) >= 2
    assert conditions[1]["some_key"] == "some_value"


# ─── _CompoundCoordinatorProxy legacy: missing task early return ─────


async def test_proxy_legacy_persist_missing_task(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
) -> None:
    """Proxy legacy path returns early if task_id not found in ConfigEntry.data."""
    task = _compound_task()
    coord, entry = await _setup_compound_legacy(
        hass, global_entry, task, "proxy_missing_task"
    )

    proxy = _CompoundCoordinatorProxy(coord, 0)
    # Should not raise
    await proxy.async_persist_trigger_runtime(
        "nonexistent_task_00000000000000000",
        {"data": "value"},
        entity_id="sensor.temp",
    )

    # Entry data should be unchanged
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    tc = refreshed.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert "_trigger_state" not in tc


# ─── CompoundTrigger.async_setup condition state restoration (lines 203-205)


async def test_compound_setup_restores_condition_state(
    hass: HomeAssistant,
) -> None:
    """async_setup injects _trigger_state into condition config from persisted state.

    When conditions_state[idx] is non-empty, it should be injected as
    ``_trigger_state`` into the condition config that is passed to
    ``create_triggers``.

    We instantiate a CompoundTrigger directly with _trigger_state in its
    config and patch ``create_triggers`` to capture what gets passed to
    sub-triggers.
    """
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.entity.triggers.compound import (
        CompoundTrigger,
    )

    persisted_conditions = [
        {"sensor.temp": {"accumulated_seconds": 7200.0, "baseline_value": 20.0}},
        {"sensor.humidity": {"accumulated_seconds": 1800.0}},
    ]

    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    mock_entity = MagicMock()
    mock_entity.entity_id = "sensor.test_compound"
    mock_entity._task_id = TASK_ID_1
    mock_entity.coordinator = MagicMock()

    trigger_config: dict[str, Any] = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
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
        ],
        "_trigger_state": {"conditions": persisted_conditions},
    }

    trigger = CompoundTrigger(hass, mock_entity, trigger_config)

    # Capture configs passed to create_triggers from async_setup
    captured_configs: list[dict[str, Any]] = []

    from custom_components.maintenance_supporter.entity.triggers import (
        create_triggers as _real_ct,
    )

    def _capturing_ct(*args: Any, **kwargs: Any) -> Any:
        if "trigger_config" in kwargs:
            captured_configs.append(dict(kwargs["trigger_config"]))
        elif len(args) >= 3:
            captured_configs.append(dict(args[2]))
        return _real_ct(*args, **kwargs)

    with patch(
        "custom_components.maintenance_supporter.entity.triggers.create_triggers",
        side_effect=_capturing_ct,
    ):
        await trigger.async_setup()

    # async_setup should have called create_triggers twice (once per condition)
    assert len(captured_configs) == 2

    # Both conditions should have _trigger_state injected (non-empty persisted state)
    assert "_trigger_state" in captured_configs[0]
    assert captured_configs[0]["_trigger_state"] == persisted_conditions[0]

    assert "_trigger_state" in captured_configs[1]
    assert captured_configs[1]["_trigger_state"] == persisted_conditions[1]


async def test_compound_setup_restores_partial_conditions(
    hass: HomeAssistant,
) -> None:
    """Condition restoration handles fewer persisted states than conditions.

    If only 1 out of 2 conditions has persisted state, idx=0 gets
    _trigger_state and idx=1 does not (idx=1 is out of range).
    """
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.entity.triggers.compound import (
        CompoundTrigger,
    )

    persisted_conditions = [
        {"sensor.temp": {"baseline_value": 15.0}},
        # Only 1 entry — second condition has no persisted state
    ]

    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    mock_entity = MagicMock()
    mock_entity.entity_id = "sensor.test_partial"
    mock_entity._task_id = TASK_ID_1
    mock_entity.coordinator = MagicMock()

    trigger_config: dict[str, Any] = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
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
        ],
        "_trigger_state": {"conditions": persisted_conditions},
    }

    trigger = CompoundTrigger(hass, mock_entity, trigger_config)

    captured_configs: list[dict[str, Any]] = []

    from custom_components.maintenance_supporter.entity.triggers import (
        create_triggers as _real_ct,
    )

    def _capturing_ct(*args: Any, **kwargs: Any) -> Any:
        if "trigger_config" in kwargs:
            captured_configs.append(dict(kwargs["trigger_config"]))
        elif len(args) >= 3:
            captured_configs.append(dict(args[2]))
        return _real_ct(*args, **kwargs)

    with patch(
        "custom_components.maintenance_supporter.entity.triggers.create_triggers",
        side_effect=_capturing_ct,
    ):
        await trigger.async_setup()

    assert len(captured_configs) == 2

    # First condition has persisted state → _trigger_state injected
    assert "_trigger_state" in captured_configs[0]
    assert captured_configs[0]["_trigger_state"] == persisted_conditions[0]

    # Second condition has no persisted state (out of range) → no _trigger_state
    assert "_trigger_state" not in captured_configs[1]


async def test_compound_setup_skips_empty_condition_state(
    hass: HomeAssistant,
) -> None:
    """When conditions_state[idx] is empty dict, _trigger_state is NOT injected.

    This exercises the `if cond_state:` guard at line 204 -- an empty dict
    is falsy, so the condition config should NOT get ``_trigger_state``.
    """
    from unittest.mock import MagicMock

    from custom_components.maintenance_supporter.entity.triggers.compound import (
        CompoundTrigger,
    )

    hass.states.async_set("sensor.temp", "25")
    hass.states.async_set("sensor.humidity", "60")

    mock_entity = MagicMock()
    mock_entity.entity_id = "sensor.test_empty"
    mock_entity._task_id = TASK_ID_1
    mock_entity.coordinator = MagicMock()

    trigger_config: dict[str, Any] = {
        "type": "compound",
        "compound_logic": "AND",
        "conditions": [
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
        ],
        "_trigger_state": {
            "conditions": [
                {},  # falsy — should be skipped
                {},  # falsy — should be skipped
            ]
        },
    }

    trigger = CompoundTrigger(hass, mock_entity, trigger_config)

    captured_configs: list[dict[str, Any]] = []

    from custom_components.maintenance_supporter.entity.triggers import (
        create_triggers as _real_ct,
    )

    def _capturing_ct(*args: Any, **kwargs: Any) -> Any:
        if "trigger_config" in kwargs:
            captured_configs.append(dict(kwargs["trigger_config"]))
        elif len(args) >= 3:
            captured_configs.append(dict(args[2]))
        return _real_ct(*args, **kwargs)

    with patch(
        "custom_components.maintenance_supporter.entity.triggers.create_triggers",
        side_effect=_capturing_ct,
    ):
        await trigger.async_setup()

    assert len(captured_configs) == 2

    # Both conditions had empty persisted state -> _trigger_state should NOT be injected
    assert "_trigger_state" not in captured_configs[0]
    assert "_trigger_state" not in captured_configs[1]
