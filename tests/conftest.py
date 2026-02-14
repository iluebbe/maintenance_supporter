"""Shared fixtures for Maintenance Supporter tests."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECT,
    CONF_TASKS,
    DEFAULT_INTERVAL_DAYS,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
)


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable custom integrations for all tests."""
    yield


@pytest.fixture(autouse=True)
async def setup_ha_dependencies(hass: HomeAssistant):
    """Set up HA dependency integrations required by our manifest.

    manifest.json declares: dependencies: ["repairs", "http", "panel_custom", "lovelace"]
    Without setting these up first, HA raises DependencyError in CI.
    """
    await async_setup_component(hass, "http", {"http": {}})
    await async_setup_component(hass, "lovelace", {})
    await async_setup_component(hass, "panel_custom", {})
    await async_setup_component(hass, "repairs", {})
    await hass.async_block_till_done()
    yield


@pytest.fixture(autouse=True)
def reset_global_registration_flags():
    """Reset module-level registration flags between tests.

    panel.py and frontend/__init__.py use global flags (_PANEL_REGISTERED,
    _CARD_REGISTERED) to prevent duplicate registration.  These persist
    across tests because the modules stay loaded in the interpreter.
    """
    import custom_components.maintenance_supporter.frontend as frontend_mod
    import custom_components.maintenance_supporter.panel as panel_mod

    panel_mod._PANEL_REGISTERED = False
    frontend_mod._CARD_REGISTERED = False
    yield
    panel_mod._PANEL_REGISTERED = False
    frontend_mod._CARD_REGISTERED = False


# ─── Constants for testing ──────────────────────────────────────────────

TASK_ID_1 = "a" * 32
TASK_ID_2 = "b" * 32
OBJECT_ID_1 = "c" * 32


# ─── Data builders ──────────────────────────────────────────────────────


def build_global_entry_data(
    warning_days: int = DEFAULT_WARNING_DAYS,
    notifications_enabled: bool = False,
    notify_service: str = "",
) -> dict[str, Any]:
    """Build data dict for a global config entry."""
    return {
        CONF_DEFAULT_WARNING_DAYS: warning_days,
        CONF_NOTIFICATIONS_ENABLED: notifications_enabled,
        CONF_NOTIFY_SERVICE: notify_service,
    }


def build_object_data(
    name: str = "Pool Pump",
    object_id: str | None = None,
    area_id: str | None = None,
    manufacturer: str | None = None,
    model: str | None = None,
) -> dict[str, Any]:
    """Build an object data dict."""
    return {
        "id": object_id or OBJECT_ID_1,
        "name": name,
        "area_id": area_id,
        "manufacturer": manufacturer,
        "model": model,
        "task_ids": [],
    }


def build_task_data(
    task_id: str = TASK_ID_1,
    name: str = "Filter Cleaning",
    task_type: str = MaintenanceTypeEnum.CLEANING,
    schedule_type: str = ScheduleType.TIME_BASED,
    interval_days: int = DEFAULT_INTERVAL_DAYS,
    warning_days: int = DEFAULT_WARNING_DAYS,
    last_performed: str | None = None,
    trigger_config: dict[str, Any] | None = None,
    history: list[dict[str, Any]] | None = None,
    enabled: bool = True,
    object_id: str = OBJECT_ID_1,
) -> dict[str, Any]:
    """Build a task data dict."""
    data: dict[str, Any] = {
        "id": task_id,
        "object_id": object_id,
        "name": name,
        "type": task_type,
        "enabled": enabled,
        "schedule_type": schedule_type,
        "warning_days": warning_days,
        "history": history or [],
    }
    if interval_days is not None:
        data["interval_days"] = interval_days
    if last_performed is not None:
        data["last_performed"] = last_performed
    if trigger_config is not None:
        data["trigger_config"] = trigger_config
    return data


def build_object_entry_data(
    object_data: dict[str, Any] | None = None,
    tasks: dict[str, dict[str, Any]] | None = None,
) -> dict[str, Any]:
    """Build the full data dict for an object config entry."""
    obj = object_data or build_object_data()
    tsks = tasks or {}
    obj["task_ids"] = list(tsks.keys())
    return {
        CONF_OBJECT: obj,
        CONF_TASKS: tsks,
    }


# ─── Config entry fixtures ──────────────────────────────────────────────


@pytest.fixture
def global_config_entry(hass: HomeAssistant) -> MockConfigEntry:
    """Create and register a global config entry."""
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_config_entry(hass: HomeAssistant) -> MockConfigEntry:
    """Create a maintenance object config entry with one time-based task."""
    last_performed = (dt_util.now().date() - timedelta(days=20)).isoformat()
    task = build_task_data(last_performed=last_performed)
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump",
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def overdue_config_entry(hass: HomeAssistant) -> MockConfigEntry:
    """Create a maintenance object with an overdue task."""
    last_performed = (dt_util.now().date() - timedelta(days=60)).isoformat()
    task = build_task_data(
        last_performed=last_performed,
        interval_days=30,
    )
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Pool Pump Overdue",
        data=build_object_entry_data(
            object_data=build_object_data(name="Pool Pump Overdue"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_pool_pump_overdue",
    )
    entry.add_to_hass(hass)
    return entry


# ─── Integration setup helpers ──────────────────────────────────────────


async def setup_integration(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    *object_entries: MockConfigEntry,
) -> None:
    """Set up the integration with the provided entries."""
    from homeassistant.config_entries import ConfigEntryState

    await hass.config_entries.async_setup(global_entry.entry_id)
    await hass.async_block_till_done()

    for entry in object_entries:
        if entry.state == ConfigEntryState.NOT_LOADED:
            await hass.config_entries.async_setup(entry.entry_id)
            await hass.async_block_till_done()


# ─── Mock sensor helpers ────────────────────────────────────────────────


def set_sensor_state(
    hass: HomeAssistant,
    entity_id: str,
    state: str,
    attributes: dict[str, Any] | None = None,
) -> None:
    """Set a mock sensor state in HA."""
    hass.states.async_set(entity_id, state, attributes or {})
