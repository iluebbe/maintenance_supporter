"""Tests for coordinator legacy fallback paths (Store=None).

These cover the defensive `else` branches in mutation methods
that execute when a coordinator has no Store attached (pre-migration
or error recovery). In normal operation the Store is always present.

Strategy: set up integration normally (migration creates Store), then
patch coordinator._store = None to force the legacy ConfigEntry path.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    ScheduleType,
)

from .conftest import (
    TASK_ID_1,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


async def _setup_legacy_coordinator(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
    task: dict[str, Any] | None = None,
    unique_id: str = "maintenance_supporter_legacy",
) -> tuple[Any, Any]:
    """Set up an entry normally, then disable its Store for legacy testing."""
    if task is None:
        last_perf = (dt_util.now().date() - timedelta(days=20)).isoformat()
        task = build_task_data(last_performed=last_perf)

    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Legacy Object",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id=unique_id,
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_config_entry, entry)

    # Get the coordinator and disable Store → forces legacy paths
    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    coord = refreshed.runtime_data.coordinator
    coord._store = None

    # Put dynamic data back into ConfigEntry.data so legacy paths have
    # something to read (normally migration strips it out)
    full_task = build_task_data(last_performed=task.get("last_performed"))
    if "trigger_config" in task:
        full_task["trigger_config"] = task["trigger_config"]
    new_data = dict(refreshed.data)
    new_data[CONF_TASKS] = {TASK_ID_1: full_task}
    hass.config_entries.async_update_entry(refreshed, data=new_data)

    return coord, refreshed


# ─── complete_maintenance (legacy, no Store) ─────────────────────────


async def test_complete_maintenance_no_store(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """complete_maintenance writes to ConfigEntry when Store is None."""
    coord, entry = await _setup_legacy_coordinator(
        hass, global_config_entry, unique_id="ms_legacy_complete"
    )

    await coord.complete_maintenance(task_id=TASK_ID_1, notes="Legacy complete")

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    task_data = refreshed.data[CONF_TASKS][TASK_ID_1]
    assert task_data.get("last_performed") is not None
    assert len(task_data.get("history", [])) >= 1
    assert task_data["history"][-1]["type"] == "completed"


# ─── reset_maintenance (legacy, no Store) ────────────────────────────


async def test_reset_maintenance_no_store(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """reset_maintenance writes to ConfigEntry when Store is None."""
    coord, entry = await _setup_legacy_coordinator(
        hass, global_config_entry, unique_id="ms_legacy_reset"
    )

    await coord.reset_maintenance(task_id=TASK_ID_1)

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    task_data = refreshed.data[CONF_TASKS][TASK_ID_1]
    history = task_data.get("history", [])
    assert any(h["type"] == "reset" for h in history)


# ─── skip_maintenance (legacy, no Store) ─────────────────────────────


async def test_skip_maintenance_no_store(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """skip_maintenance writes to ConfigEntry when Store is None."""
    coord, entry = await _setup_legacy_coordinator(
        hass, global_config_entry, unique_id="ms_legacy_skip"
    )

    await coord.skip_maintenance(task_id=TASK_ID_1, reason="Too busy")

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    task_data = refreshed.data[CONF_TASKS][TASK_ID_1]
    history = task_data.get("history", [])
    assert any(h["type"] == "skipped" for h in history)


# ─── async_add_trigger_history_entry (legacy, no Store) ──────────────


async def test_trigger_history_entry_no_store(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """Trigger history entry writes to ConfigEntry when Store is None."""
    coord, entry = await _setup_legacy_coordinator(
        hass, global_config_entry, unique_id="ms_legacy_trig_hist"
    )

    await coord.async_add_trigger_history_entry(TASK_ID_1, trigger_value=42.0)

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    task_data = refreshed.data[CONF_TASKS][TASK_ID_1]
    history = task_data.get("history", [])
    assert any(h["type"] == "triggered" for h in history)


# ─── async_persist_trigger_runtime (legacy, no Store) ────────────────


async def test_persist_trigger_runtime_no_store_per_entity(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """Trigger runtime writes per-entity data to ConfigEntry._trigger_state."""
    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat(),
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.temp",
            "trigger_above": 30,
        },
    )
    coord, entry = await _setup_legacy_coordinator(
        hass, global_config_entry, task=task, unique_id="ms_legacy_runtime"
    )

    await coord.async_persist_trigger_runtime(
        TASK_ID_1,
        {"baseline_value": 25.5, "accumulated_seconds": 1800.0},
        entity_id="sensor.temp",
    )

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    tc = refreshed.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    ts = tc.get("_trigger_state", {})
    assert ts["sensor.temp"]["baseline_value"] == 25.5
    assert ts["sensor.temp"]["accumulated_seconds"] == 1800.0


async def test_persist_trigger_runtime_no_store_flat(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """Trigger runtime writes flat data to ConfigEntry.trigger_config."""
    task = build_task_data(
        last_performed=(dt_util.now().date() - timedelta(days=5)).isoformat(),
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={
            "type": "counter",
            "entity_id": "sensor.meter",
            "trigger_target_value": 100,
        },
    )
    coord, entry = await _setup_legacy_coordinator(
        hass, global_config_entry, task=task, unique_id="ms_legacy_flat_rt"
    )

    await coord.async_persist_trigger_runtime(
        TASK_ID_1,
        {"trigger_baseline_value": 500.0},
        entity_id=None,
    )

    refreshed = hass.config_entries.async_get_entry(entry.entry_id)
    assert refreshed is not None
    tc = refreshed.data[CONF_TASKS][TASK_ID_1]["trigger_config"]
    assert tc["trigger_baseline_value"] == 500.0


async def test_persist_trigger_runtime_no_store_missing_task(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
) -> None:
    """Persist trigger runtime silently returns if task not found."""
    coord, entry = await _setup_legacy_coordinator(
        hass, global_config_entry, unique_id="ms_legacy_missing_task"
    )

    # Should not raise — task doesn't exist
    await coord.async_persist_trigger_runtime(
        "nonexistent_task_id_00000000000000",
        {"baseline_value": 1.0},
        entity_id="sensor.x",
    )
