"""Tests for the global summary sensors and the shared status aggregator.

Pins the DRY contract from PR #57: the statistics WebSocket endpoint (panel
chips / card header), the summary coordinator (entities), and the dashboard
strategy headline all read counts from ``compute_status_counts`` — so they can
never diverge.
"""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import MagicMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import DOMAIN
from custom_components.maintenance_supporter.entity.summary_coordinator import (
    MaintenanceSummaryCoordinator,
)
from custom_components.maintenance_supporter.helpers.aggregate import (
    compute_status_counts,
)
from custom_components.maintenance_supporter.sensor import MaintenanceSummarySensor
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_get_statistics,
)

from .conftest import (
    TASK_ID_1,
    assert_ws_success,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


def _obj_entry(
    hass: HomeAssistant,
    name: str,
    unique: str,
    *,
    last_performed_days: int | None = None,
    enabled: bool = True,
    interval: int = 30,
    warning: int = 7,
) -> MockConfigEntry:
    """Register an object entry with one time-based task at a known status."""
    last_performed = None
    if last_performed_days is not None:
        last_performed = (
            dt_util.now().date() - timedelta(days=last_performed_days)
        ).isoformat()
    task = build_task_data(
        last_performed=last_performed,
        interval_days=interval,
        warning_days=warning,
        enabled=enabled,
    )
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


async def _setup_mixed(hass: HomeAssistant, global_config_entry: MockConfigEntry):
    """Set up overdue + due_soon + ok + disabled(=ok) objects."""
    e_overdue = _obj_entry(hass, "Over", "ms_over", last_performed_days=60)
    e_due = _obj_entry(hass, "Due", "ms_due", last_performed_days=27)  # due in 3d
    e_ok = _obj_entry(hass, "Ok", "ms_ok", last_performed_days=1)
    e_disabled = _obj_entry(
        hass, "Disabled", "ms_dis", last_performed_days=60, enabled=False
    )
    await setup_integration(
        hass, global_config_entry, e_overdue, e_due, e_ok, e_disabled
    )


async def test_statistics_ws_matches_aggregator(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """DRY tripwire: the statistics WS payload equals compute_status_counts."""
    await _setup_mixed(hass, global_config_entry)

    counts = compute_status_counts(hass)
    assert counts["overdue"] == 1
    assert counts["due_soon"] == 1
    assert counts["triggered"] == 0
    assert counts["ok"] == 2  # the ok task + the disabled task (forced OK)
    assert counts["needs_attention"] == 2
    assert counts["total_tasks"] == 4
    assert counts["total_objects"] == 4

    conn = make_ws_connection()
    await call_ws_handler(ws_get_statistics, hass, conn, {"id": 1, "type": "x"})
    payload = assert_ws_success(conn)

    for key in ("overdue", "due_soon", "triggered", "total_tasks", "total_objects"):
        assert payload[key] == counts[key], f"WS/aggregator disagree on {key}"


async def test_summary_coordinator_reflects_counts(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """The global summary coordinator holds the same counts."""
    await _setup_mixed(hass, global_config_entry)

    summary = global_config_entry.runtime_data.summary_coordinator
    assert summary is not None
    await summary.async_refresh()

    counts = compute_status_counts(hass)
    assert summary.data == counts
    assert summary.data["needs_attention"] == 2


async def test_disabled_task_counts_as_ok_not_overdue(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """A disabled task that would be overdue must not inflate 'overdue'."""
    e_disabled = _obj_entry(
        hass, "Disabled", "ms_dis_only", last_performed_days=90, enabled=False
    )
    await setup_integration(hass, global_config_entry, e_disabled)

    counts = compute_status_counts(hass)
    assert counts["overdue"] == 0
    assert counts["ok"] == 1
    assert counts["needs_attention"] == 0


async def test_zero_objects_all_zero(
    hass: HomeAssistant, global_config_entry: MockConfigEntry
) -> None:
    """With only the global entry, every count is zero (and available)."""
    await setup_integration(hass, global_config_entry)

    counts = compute_status_counts(hass)
    assert counts["overdue"] == 0
    assert counts["due_soon"] == 0
    assert counts["triggered"] == 0
    assert counts["ok"] == 0
    assert counts["needs_attention"] == 0
    assert counts["total_tasks"] == 0
    assert counts["total_objects"] == 0

    summary = global_config_entry.runtime_data.summary_coordinator
    assert summary is not None
    await summary.async_refresh()
    assert summary.data["overdue"] == 0


@pytest.mark.parametrize(
    ("key", "expected"),
    [
        ("overdue", 3),
        ("due_soon", 2),
        ("triggered", 1),
        ("needs_attention", 6),
        ("ok", 4),
        ("total_tasks", 10),
    ],
)
def test_summary_sensor_native_value(
    hass: HomeAssistant, key: str, expected: int
) -> None:
    """Each summary sensor returns its slice of the coordinator data."""
    coordinator = MaintenanceSummaryCoordinator(hass)
    coordinator.data = {
        "overdue": 3,
        "due_soon": 2,
        "triggered": 1,
        "needs_attention": 6,
        "ok": 4,
        "total_tasks": 10,
    }
    sensor = MaintenanceSummarySensor(coordinator, key, "mdi:test")
    assert sensor.native_value == expected
    assert sensor.unique_id == f"maintenance_supporter_global_summary_{key}"


def test_summary_sensor_missing_key_defaults_zero(hass: HomeAssistant) -> None:
    """A sensor whose key isn't in the data yet reads 0 (startup safety)."""
    coordinator = MaintenanceSummaryCoordinator(hass)
    coordinator.data = None
    sensor = MaintenanceSummarySensor(coordinator, "overdue", "mdi:test")
    assert sensor.native_value == 0
