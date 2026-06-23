"""Tests for the per-task action buttons and the global export button.

Pins the DRY contract: a button press delegates to the same coordinator action
method (complete/skip/reset) that the services and mobile-notification actions
use — no second code path.
"""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN

from .conftest import (
    TASK_ID_1,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    setup_integration,
)


def _obj_entry(
    hass: HomeAssistant, name: str = "Car", unique: str = "ms_btn", *, enabled: bool = True
) -> MockConfigEntry:
    """Register an object entry with one time-based task."""
    task = build_task_data(interval_days=30, enabled=enabled)
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(
            object_data=build_object_data(name=name), tasks={TASK_ID_1: task}
        ),
        source="user",
        unique_id=unique,
    )
    entry.add_to_hass(hass)
    return entry


def _button_entity_id(hass: HomeAssistant, entry: MockConfigEntry, action: str) -> str:
    """Resolve a per-task button's entity_id by its unique_id action suffix."""
    reg = er.async_get(hass)
    for e in er.async_entries_for_config_entry(reg, entry.entry_id):
        if e.domain == "button" and e.unique_id.endswith(f"_{action}"):
            return e.entity_id
    raise AssertionError(f"no {action} button for {entry.entry_id}")


async def test_per_task_buttons_created(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """Each task gets complete/skip/reset buttons, all enabled by default."""
    obj = _obj_entry(hass)
    await setup_integration(hass, global_config_entry, obj)

    reg = er.async_get(hass)
    buttons = [
        e
        for e in er.async_entries_for_config_entry(reg, obj.entry_id)
        if e.domain == "button"
    ]
    assert len(buttons) == 3
    assert {e.unique_id.rsplit("_", 1)[-1] for e in buttons} == {
        "complete",
        "skip",
        "reset",
    }
    # All three enabled by default (incl. reset, per decision).
    assert all(e.disabled_by is None for e in buttons)


async def test_global_entry_has_no_buttons(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """The global hub entry exposes no button entities (export is a service)."""
    await setup_integration(hass, global_config_entry)

    reg = er.async_get(hass)
    buttons = [
        e
        for e in er.async_entries_for_config_entry(reg, global_config_entry.entry_id)
        if e.domain == "button"
    ]
    assert buttons == []


@pytest.mark.parametrize(
    ("action", "method", "kwargs"),
    [
        ("complete", "complete_maintenance", {"notes": "Completed from dashboard button"}),
        ("skip", "skip_maintenance", {"reason": "Skipped from dashboard button"}),
        ("reset", "reset_maintenance", {}),
    ],
)
async def test_button_press_delegates_to_coordinator(
    hass: HomeAssistant,
    global_config_entry: MockConfigEntry,
    action: str,
    method: str,
    kwargs: dict,
) -> None:
    """DRY: pressing a button calls the shared coordinator action method."""
    obj = _obj_entry(hass)
    await setup_integration(hass, global_config_entry, obj)
    coordinator = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator

    with patch.object(coordinator, method, new=AsyncMock()) as mock:
        await hass.services.async_call(
            "button",
            "press",
            {"entity_id": _button_entity_id(hass, obj, action)},
            blocking=True,
        )
    mock.assert_awaited_once_with(TASK_ID_1, **kwargs)


async def test_disabled_task_button_unavailable(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """A button for a disabled (paused) task is unavailable."""
    obj = _obj_entry(hass, enabled=False)
    await setup_integration(hass, global_config_entry, obj)

    state = hass.states.get(_button_entity_id(hass, obj, "complete"))
    assert state is not None
    assert state.state == "unavailable"


async def test_button_available_false_when_no_task_data(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """MaintenanceActionButton.available returns False when _task_data is empty."""
    from custom_components.maintenance_supporter.button import MaintenanceActionButton

    obj = _obj_entry(hass)
    await setup_integration(hass, global_config_entry, obj)

    coord = hass.config_entries.async_get_entry(obj.entry_id).runtime_data.coordinator

    btn = MaintenanceActionButton(coord, "nonexistent_task", "complete", "Complete")
    # _task_data returns {} for nonexistent task, which is falsy
    assert not btn._task_data  # empty dict is falsy
    assert btn.available is False
