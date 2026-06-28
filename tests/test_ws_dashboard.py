"""Tests for WebSocket dashboard handlers (websocket/dashboard.py)."""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_ACTION_COMPLETE_ENABLED,
    CONF_ACTION_SKIP_ENABLED,
    CONF_ACTION_SNOOZE_ENABLED,
    CONF_ADVANCED_ADAPTIVE,
    CONF_ADVANCED_BUDGET,
    CONF_ADVANCED_CHECKLISTS,
    CONF_ADVANCED_ENVIRONMENTAL,
    CONF_ADVANCED_GROUPS,
    CONF_ADVANCED_PREDICTIONS,
    CONF_ADVANCED_SEASONAL,
    CONF_BUDGET_ALERT_THRESHOLD,
    CONF_BUDGET_MONTHLY,
    CONF_BUDGET_YEARLY,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_PANEL_ENABLED,
    CONF_PANEL_TITLE,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.websocket.dashboard import (
    ws_get_budget_status,
    ws_get_settings,
    ws_get_statistics,
    ws_subscribe,
    ws_test_notification,
    ws_update_global_settings,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    setup_integration,
)


def _mock_connection() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.send_message = MagicMock()
    conn.subscriptions = {}
    conn.user = MagicMock(is_admin=True)
    return conn


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
def global_entry_with_features(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with advanced features enabled."""
    data = build_global_entry_data()
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        options={
            **data,
            CONF_ADVANCED_ADAPTIVE: True,
            CONF_ADVANCED_PREDICTIONS: True,
            CONF_ADVANCED_SEASONAL: True,
            CONF_ADVANCED_ENVIRONMENTAL: False,
            CONF_ADVANCED_BUDGET: True,
            CONF_ADVANCED_GROUPS: False,
            CONF_ADVANCED_CHECKLISTS: True,
        },
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def global_entry_with_budget(hass: HomeAssistant) -> MockConfigEntry:
    """Global entry with budget configuration."""
    data = build_global_entry_data()
    data[CONF_BUDGET_MONTHLY] = 200.0
    data[CONF_BUDGET_YEARLY] = 2000.0
    data[CONF_BUDGET_ALERT_THRESHOLD] = 90
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_ws_dash",
    )
    entry.add_to_hass(hass)
    return entry


@pytest.fixture
def object_entry_with_cost(hass: HomeAssistant) -> MockConfigEntry:
    """Object entry with history that has cost data."""
    now = dt_util.now()
    task = build_task_data(last_performed="2024-06-01")
    task["history"] = [
        {
            "timestamp": now.replace(day=1).isoformat(),
            "type": "completed",
            "cost": 50.0,
        },
        {
            "timestamp": now.replace(day=15).isoformat(),
            "type": "completed",
            "cost": 75.0,
        },
        {
            "timestamp": (now - timedelta(days=60)).isoformat(),
            "type": "completed",
            "cost": 100.0,
        },
        {
            "timestamp": "2023-06-01T00:00:00",
            "type": "completed",
            "cost": 200.0,  # last year — excluded from monthly/yearly
        },
    ]
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Costly Pump",
        data=build_object_entry_data(
            object_data=build_object_data(name="Costly Pump"),
            tasks={TASK_ID_1: task},
        ),
        source="user",
        unique_id="maintenance_supporter_costly_pump_ws",
    )
    entry.add_to_hass(hass)
    return entry


# ─── ws_get_settings ─────────────────────────────────────────────────────


async def test_get_settings_default(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test get_settings with default (no features enabled)."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_settings, hass, conn, {
        "id": 1, "type": "maintenance_supporter/settings",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    features = result["features"]
    assert features["adaptive"] is False
    assert features["predictions"] is False
    assert features["budget"] is False
    assert features["groups"] is False


async def test_get_settings_with_features(
    hass: HomeAssistant, global_entry_with_features: MockConfigEntry,
) -> None:
    """Test get_settings with advanced features enabled."""
    await setup_integration(hass, global_entry_with_features)
    conn = _mock_connection()

    await call_ws_handler(ws_get_settings, hass, conn, {
        "id": 1, "type": "maintenance_supporter/settings",
    })

    result = conn.send_result.call_args[0][1]
    features = result["features"]
    assert features["adaptive"] is True
    assert features["predictions"] is True
    assert features["seasonal"] is True
    assert features["environmental"] is False
    assert features["budget"] is True
    assert features["groups"] is False
    assert features["checklists"] is True


async def test_get_settings_exposes_every_writable_setting_key(
    hass: HomeAssistant,
) -> None:
    """Tripwire for the issue #50 / #48 pattern, settings edition.

    Every CONF_* in ``_ALLOWED_SETTING_KEYS`` (the write surface used by
    ``maintenance_supporter/global/update``) MUST appear somewhere in the
    response of ``maintenance_supporter/settings``. Otherwise the global
    settings UI hydrates with ``undefined`` for that field, the toggle
    appears wrong/empty, and the user's next save wipes the persisted
    value because the form re-sends its (empty) local state.

    This is the same failure mode as #50 but for the global settings
    dict instead of per-task fields. The audit was missed after #48
    because the lesson at the time was scoped narrowly to "HA registry
    sync" — ``_build_full_settings`` is neither a registry nor a
    sync-target, so it slipped past that lens.
    """
    from custom_components.maintenance_supporter.websocket.dashboard import (
        _ALLOWED_SETTING_KEYS,
        _build_full_settings,
    )

    # Build a full options dict where each writable key has a non-default
    # value, so we can detect both "key omitted from response" AND
    # "key returned as default instead of round-tripping".
    options: dict[str, Any] = {}
    for key, expected_type in _ALLOWED_SETTING_KEYS.items():
        if expected_type is bool:
            options[key] = True
        elif expected_type is int:
            options[key] = 42
        elif expected_type is float:
            options[key] = 3.14
        elif expected_type is str:
            options[key] = "test_value"
        elif expected_type is list:
            options[key] = ["abc"]

    # Specific overrides for str-typed keys with format requirements
    options["quiet_hours_start"] = "23:30"
    options["quiet_hours_end"] = "07:15"
    options["budget_currency"] = "EUR"
    options["notification_title_style"] = "default"
    options["notify_service"] = "notify.persistent_notification"

    full = _build_full_settings(options)

    # Flatten the nested response so we can grep for individual values
    def _flatten(d: dict[str, Any], prefix: str = "") -> dict[str, Any]:
        out: dict[str, Any] = {}
        for k, v in d.items():
            path = f"{prefix}.{k}" if prefix else k
            if isinstance(v, dict):
                out.update(_flatten(v, path))
            else:
                out[path] = v
        return out

    flat = _flatten(full)
    flat_values = list(flat.values())

    missing: list[str] = []
    for conf_key, set_value in options.items():
        # Each set_value should appear somewhere in the flattened response,
        # OR be transformed (e.g. currency → currency_symbol). Skip the
        # currency code here because _build_full_settings exposes both
        # the raw code AND the derived symbol — the raw code IS in the
        # response under budget.currency.
        if set_value not in flat_values:
            missing.append(f"{conf_key}={set_value!r}")

    assert not missing, (
        f"Tripwire (issue #50 pattern, settings edition): _build_full_settings "
        f"is dropping these CONF_* values that ws_update_global_settings "
        f"accepts as writable:\n  " + "\n  ".join(missing) +
        "\n\nFix: extend _build_full_settings in websocket/dashboard.py to "
        "expose them. See feedback_ws_response_field_audit memory for context."
    )


async def test_get_settings_no_global_entry(
    hass: HomeAssistant,
) -> None:
    """Test get_settings when no global entry exists."""
    conn = _mock_connection()

    await call_ws_handler(ws_get_settings, hass, conn, {
        "id": 1, "type": "maintenance_supporter/settings",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # No global entry → _build_full_settings({}) returns all defaults (all False)
    assert result["features"] == {
        "adaptive": False,
        "predictions": False,
        "seasonal": False,
        "environmental": False,
        "budget": False,
        "groups": False,
        "checklists": False,
        "schedule_time": False,
        "completion_actions": False,
    }


# ─── ws_get_statistics ───────────────────────────────────────────────────


async def test_get_statistics_basic(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test get_statistics returns aggregated data."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_statistics, hass, conn, {
        "id": 1, "type": "maintenance_supporter/statistics",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["total_objects"] == 1
    assert result["total_tasks"] == 1
    assert isinstance(result["overdue"], int)
    assert isinstance(result["due_soon"], int)
    assert isinstance(result["triggered"], int)
    assert isinstance(result["total_cost"], float)


async def test_get_statistics_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test get_statistics with no objects."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_statistics, hass, conn, {
        "id": 1, "type": "maintenance_supporter/statistics",
    })

    result = conn.send_result.call_args[0][1]
    assert result["total_objects"] == 0
    assert result["total_tasks"] == 0
    assert result["overdue"] == 0


async def test_get_statistics_multiple_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test get_statistics with multiple objects and tasks."""
    task1 = build_task_data(task_id=TASK_ID_1, last_performed="2024-01-01")
    task2 = build_task_data(task_id=TASK_ID_2, name="Oil Change", last_performed="2024-06-01")
    entry1 = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Object 1",
        data=build_object_entry_data(
            object_data=build_object_data(name="Object 1"),
            tasks={TASK_ID_1: task1},
        ),
        source="user", unique_id="maintenance_supporter_stats_obj1",
    )
    entry2 = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Object 2",
        data=build_object_entry_data(
            object_data=build_object_data(name="Object 2"),
            tasks={TASK_ID_2: task2},
        ),
        source="user", unique_id="maintenance_supporter_stats_obj2",
    )
    entry1.add_to_hass(hass)
    entry2.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry1, entry2)
    conn = _mock_connection()

    await call_ws_handler(ws_get_statistics, hass, conn, {
        "id": 1, "type": "maintenance_supporter/statistics",
    })

    result = conn.send_result.call_args[0][1]
    assert result["total_objects"] == 2
    assert result["total_tasks"] == 2


# ─── ws_subscribe ────────────────────────────────────────────────────────


async def test_subscribe_registers_listener(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test subscribe registers coordinator listeners and sends initial data."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_subscribe, hass, conn, {
        "id": 1, "type": "maintenance_supporter/subscribe",
    })

    # Should call send_result for subscription confirmation
    conn.send_result.assert_called_once()
    # Should call send_message for initial data
    conn.send_message.assert_called_once()
    # Should register unsub callback
    assert 1 in conn.subscriptions


async def test_subscribe_unsub_cleans_up(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test unsubscribe callback cleans up listeners."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_subscribe, hass, conn, {
        "id": 1, "type": "maintenance_supporter/subscribe",
    })

    # Call unsub
    unsub = conn.subscriptions[1]
    unsub()  # Should not raise


async def test_subscribe_no_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test subscribe with no objects still works."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_subscribe, hass, conn, {
        "id": 1, "type": "maintenance_supporter/subscribe",
    })

    conn.send_result.assert_called_once()
    conn.send_message.assert_called_once()


# ─── ws_get_budget_status ────────────────────────────────────────────────


async def test_budget_status_default(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test budget_status with default config (no budget)."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_budget_status, hass, conn, {
        "id": 1, "type": "maintenance_supporter/budget_status",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["monthly_budget"] == 0.0
    assert result["yearly_budget"] == 0.0
    assert result["monthly_spent"] == 0.0
    assert result["yearly_spent"] == 0.0
    assert result["alert_threshold_pct"] == 80


async def test_budget_status_with_config(
    hass: HomeAssistant, global_entry_with_budget: MockConfigEntry,
) -> None:
    """Test budget_status returns configured budget values."""
    await setup_integration(hass, global_entry_with_budget)
    conn = _mock_connection()

    await call_ws_handler(ws_get_budget_status, hass, conn, {
        "id": 1, "type": "maintenance_supporter/budget_status",
    })

    result = conn.send_result.call_args[0][1]
    assert result["monthly_budget"] == 200.0
    assert result["yearly_budget"] == 2000.0
    assert result["alert_threshold_pct"] == 90


async def test_budget_status_with_costs(
    hass: HomeAssistant, global_entry_with_budget: MockConfigEntry,
    object_entry_with_cost: MockConfigEntry,
) -> None:
    """Test budget_status calculates spent from history."""
    await setup_integration(hass, global_entry_with_budget, object_entry_with_cost)
    conn = _mock_connection()

    await call_ws_handler(ws_get_budget_status, hass, conn, {
        "id": 1, "type": "maintenance_supporter/budget_status",
    })

    result = conn.send_result.call_args[0][1]
    # monthly: 50 + 75 = 125; yearly: 50 + 75 + 100 = 225
    assert result["monthly_spent"] == 125.0
    assert result["yearly_spent"] == 225.0


# ─── ws_get_settings expanded response ───────────────────────────────────


async def test_get_settings_returns_all_sections(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test get_settings returns all sections (general, notifications, etc.)."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_settings, hass, conn, {
        "id": 1, "type": "maintenance_supporter/settings",
    })

    result = conn.send_result.call_args[0][1]
    # All sections must be present
    assert "features" in result
    assert "general" in result
    assert "notifications" in result
    assert "actions" in result
    assert "budget" in result
    # Check general defaults
    assert result["general"]["default_warning_days"] == 7
    assert result["general"]["notifications_enabled"] is False
    assert result["general"]["panel_enabled"] is True  # on by default since v2.10.4 (#69 follow-up)
    # Check notification defaults
    assert result["notifications"]["due_soon_enabled"] is True
    assert result["notifications"]["quiet_hours_enabled"] is True
    # Check action defaults
    assert result["actions"]["complete_enabled"] is False
    # Check budget defaults
    assert result["budget"]["monthly"] == 0.0


# ─── ws_update_global_settings ────────────────────────────────────────────


async def test_update_global_settings(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test updating global settings via WS."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {
            CONF_DEFAULT_WARNING_DAYS: 14,
            CONF_PANEL_ENABLED: True,
        },
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["general"]["default_warning_days"] == 14
    assert result["general"]["panel_enabled"] is True

    # Verify persisted in config entry
    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    options = entry.options or entry.data
    assert options[CONF_DEFAULT_WARNING_DAYS] == 14
    assert options[CONF_PANEL_ENABLED] is True


async def test_update_global_settings_panel_title_trimmed_and_capped(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """global/update normalises panel_title: trims whitespace, caps at 50 (#63)."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {CONF_PANEL_TITLE: "  " + "Z" * 80 + "  "},
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["general"]["panel_title"] == "Z" * 50

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    options = entry.options or entry.data
    assert options[CONF_PANEL_TITLE] == "Z" * 50


async def test_update_global_settings_panel_title_blank_clears(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """A blank panel_title is stored as "" (clears the override → default title)."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {CONF_PANEL_TITLE: "   "},
    })

    result = conn.send_result.call_args[0][1]
    assert result["general"]["panel_title"] == ""


async def test_update_global_settings_objects_table_columns_sanitised(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """objects_table_columns (#67): drop unknown/non-string, dedupe, keep order."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {
            "objects_table_columns": [
                "warranty_expiry", "bogus", "name", "warranty_expiry", 42,
            ],
        },
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["objects_table_columns"] == ["warranty_expiry", "name"]

    entry = hass.config_entries.async_get_entry(global_entry.entry_id)
    assert entry is not None
    options = entry.options or entry.data
    assert options["objects_table_columns"] == ["warranty_expiry", "name"]


async def test_update_global_settings_objects_table_columns_empty_defaults(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """An all-unknown column list falls back to the default set (#67)."""
    from custom_components.maintenance_supporter.const import (
        DEFAULT_OBJECTS_TABLE_COLUMNS,
    )

    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {"objects_table_columns": ["nope", "alsobad"]},
    })

    result = conn.send_result.call_args[0][1]
    assert result["objects_table_columns"] == list(DEFAULT_OBJECTS_TABLE_COLUMNS)


async def test_update_global_settings_filters_unknown_keys(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Unknown keys are silently ignored."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {
            CONF_DEFAULT_WARNING_DAYS: 5,
            "totally_unknown_key": "should_be_ignored",
        },
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["general"]["default_warning_days"] == 5


async def test_update_global_settings_no_valid_keys(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Error when no valid setting keys are provided."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {"bad_key": True},
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_input"


async def test_update_global_settings_type_validation(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Wrong-typed values are filtered out."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {
            CONF_DEFAULT_WARNING_DAYS: "not_an_int",  # wrong type
            CONF_PANEL_ENABLED: True,  # valid
        },
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["general"]["panel_enabled"] is True
    # warning_days should remain at default since the string was filtered
    assert result["general"]["default_warning_days"] == 7


async def test_update_global_settings_drops_invalid_quiet_hours_times(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """v1.4.6 #44 follow-up regression: empty / malformed quiet-hours time
    strings must be dropped before persistence so the next options-flow
    render falls back to the 22:00 / 08:00 defaults instead of erroring
    out as 'Invalid time' and blocking the form save.
    """
    from custom_components.maintenance_supporter.const import (
        CONF_NOTIFICATION_TITLE_STYLE,
        CONF_QUIET_HOURS_END,
        CONF_QUIET_HOURS_START,
    )

    await setup_integration(hass, global_entry)

    for bad in ("", "  ", "not-a-time", "25:99", "abc:def", None, 42):
        conn = _mock_connection()
        await call_ws_handler(ws_update_global_settings, hass, conn, {
            "id": 1,
            "type": "maintenance_supporter/global/update",
            "settings": {
                CONF_QUIET_HOURS_START: bad,
                CONF_QUIET_HOURS_END: bad,
                # The user's actual edit (the one they tried to save in the
                # original bug report) must still land even though they didn't
                # touch the time fields. Use title_style here — it's a v1.4.0
                # setting that doesn't have HA-side panel side-effects.
                CONF_NOTIFICATION_TITLE_STYLE: "object_name",
            },
        })
        conn.send_result.assert_called_once()
        result = conn.send_result.call_args[0][1]
        # The unrelated edit must always be persisted — that's the actual
        # behaviour byoung79 was asking for in #44.
        assert result["notifications"]["title_style"] == "object_name", (
            f"unrelated title_style edit dropped for bad time {bad!r}"
        )
        # The bad time is dropped; the response shows the default for both.
        assert result["notifications"]["quiet_hours_start"] == "22:00"
        assert result["notifications"]["quiet_hours_end"] == "08:00"

    # Sanity: a *valid* HH:MM time is preserved.
    # (HH:MM:SS is technically valid format-wise but is dropped by an existing
    # `_STR_MAX_LENGTHS=5` cap higher up in this same handler — out of scope
    # for this regression test.)
    conn = _mock_connection()
    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {
            CONF_QUIET_HOURS_START: "23:00",
            CONF_QUIET_HOURS_END: "07:30",
        },
    })
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["notifications"]["quiet_hours_start"] == "23:00"
    assert result["notifications"]["quiet_hours_end"] == "07:30"


async def test_update_global_settings_invalid_notify_service(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Invalid notify_service format returns error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {
            CONF_NOTIFY_SERVICE: "totally.invalid.service.format",
        },
    })

    conn.send_error.assert_called_once()


async def test_update_global_settings_no_global_entry(
    hass: HomeAssistant,
) -> None:
    """Error when global config entry doesn't exist."""
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {CONF_PANEL_ENABLED: True},
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_update_global_settings_int_for_float(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Int values accepted for float fields (budget)."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1,
        "type": "maintenance_supporter/global/update",
        "settings": {CONF_BUDGET_MONTHLY: 500},
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["budget"]["monthly"] == 500.0


# ─── ws_test_notification ─────────────────────────────────────────────────


async def test_test_notification_no_global_entry(
    hass: HomeAssistant,
) -> None:
    """Error when global config entry doesn't exist."""
    conn = _mock_connection()

    await call_ws_handler(ws_test_notification, hass, conn, {
        "id": 1, "type": "maintenance_supporter/global/test_notification",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_test_notification_no_service(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Returns failure when no notify service is configured."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_test_notification, hass, conn, {
        "id": 1, "type": "maintenance_supporter/global/test_notification",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is False


async def test_test_notification_success(
    hass: HomeAssistant,
) -> None:
    """Test notification succeeds when service is available."""
    # Create global entry with notify service configured
    data = build_global_entry_data()
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        options={**data, CONF_NOTIFY_SERVICE: "notify.test_device"},
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)

    # Register a mock notify service
    async def mock_notify(*args: Any, **kwargs: Any) -> None:
        pass

    hass.services.async_register("notify", "test_device", mock_notify)

    conn = _mock_connection()
    await call_ws_handler(ws_test_notification, hass, conn, {
        "id": 1, "type": "maintenance_supporter/global/test_notification",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True


async def test_test_notification_service_call_fails(
    hass: HomeAssistant,
) -> None:
    """Test notification returns failure when service call raises."""
    data = build_global_entry_data()
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        options={**data, CONF_NOTIFY_SERVICE: "notify.broken"},
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, entry)

    # Register a service that raises
    async def failing_notify(*args: Any, **kwargs: Any) -> None:
        raise RuntimeError("Connection refused")

    hass.services.async_register("notify", "broken", failing_notify)

    conn = _mock_connection()
    await call_ws_handler(ws_test_notification, hass, conn, {
        "id": 1, "type": "maintenance_supporter/global/test_notification",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is False


# ===========================================================================
# Coverage tests carried from test_cov_ws.py (websocket/dashboard.py section)
# ===========================================================================


def _covws_conn() -> MagicMock:
    """Create a mock WS connection (carried from test_cov_ws.py)."""
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.user = MagicMock(is_admin=True)
    conn.subscriptions = {}
    conn.send_message = MagicMock()
    return conn


@pytest.fixture
def covws_global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        source="user", unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# Lines 197-200: _vacation_summary — _parse returns None for invalid date string
async def test_settings_vacation_summary_invalid_date(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """_vacation_summary: non-date start/end strings are treated as None."""
    from custom_components.maintenance_supporter.const import (
        CONF_VACATION_BUFFER_DAYS,
        CONF_VACATION_ENABLED,
        CONF_VACATION_END,
        CONF_VACATION_START,
    )
    from custom_components.maintenance_supporter.websocket.dashboard import ws_get_settings

    # Set garbage dates via entry options
    await setup_integration(hass, covws_global_entry)
    options = {
        CONF_VACATION_ENABLED: True,
        CONF_VACATION_START: "not-a-date",
        CONF_VACATION_END: "also-bad",
        CONF_VACATION_BUFFER_DAYS: 2,
    }
    hass.config_entries.async_update_entry(covws_global_entry, options=options)

    conn = _covws_conn()
    await call_ws_handler(ws_get_settings, hass, conn, {
        "id": 1, "type": "maintenance_supporter/settings",
    })

    result = conn.send_result.call_args[0][1]
    vacation = result["vacation"]
    assert vacation["start"] is None
    assert vacation["end"] is None
    assert vacation["is_active"] is False


# Line 496: ws_update_global_settings — invalid notification_title_style is dropped
async def test_update_global_settings_invalid_title_style_dropped(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_update_global_settings: unknown notification_title_style is silently dropped."""
    from custom_components.maintenance_supporter.const import CONF_NOTIFICATION_TITLE_STYLE

    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    # Send an unknown style; must be dropped so no error is raised but setting
    # is not persisted
    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1, "type": "maintenance_supporter/global/update",
        "settings": {
            CONF_NOTIFICATION_TITLE_STYLE: "unicorn_style",
            # Also include a valid setting to avoid "no valid keys" error
            "default_warning_days": 10,
        },
    })

    result = conn.send_result.call_args[0][1]
    # The valid setting was accepted
    assert result is not None
    # The garbage title_style must NOT be in the merged options
    entry = hass.config_entries.async_get_entry(covws_global_entry.entry_id)
    opts = entry.options or entry.data
    assert opts.get(CONF_NOTIFICATION_TITLE_STYLE) != "unicorn_style"


# Lines 515-530: ws_update_global_settings — admin_panel_user_ids sanitized
async def test_update_global_settings_admin_user_ids_sanitized(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_update_global_settings: admin_panel_user_ids list is deduped and stripped."""
    from custom_components.maintenance_supporter.const import CONF_ADMIN_PANEL_USER_IDS

    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    raw_ids = [
        "  abc123  ",      # should be stripped
        "abc123",          # duplicate — should be deduped
        "",                # empty — should be dropped
        42,                # non-string — should be dropped
        "valid_user_id",   # valid
    ]

    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": 1, "type": "maintenance_supporter/global/update",
        "settings": {CONF_ADMIN_PANEL_USER_IDS: raw_ids},
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result is not None

    entry = hass.config_entries.async_get_entry(covws_global_entry.entry_id)
    opts = entry.options or entry.data
    cleaned = opts.get(CONF_ADMIN_PANEL_USER_IDS, [])
    # Duplicates removed, whitespace stripped, non-strings and empty strings dropped
    assert "abc123" in cleaned
    assert "valid_user_id" in cleaned
    # Only one copy of abc123
    assert cleaned.count("abc123") == 1
    # No empty strings
    assert "" not in cleaned


# ===========================================================================
# Coverage tests carried from test_coverage_97.py (websocket/dashboard.py section)
# ===========================================================================


_c97_msg_id = 0


def _c97_nid() -> int:
    global _c97_msg_id
    _c97_msg_id += 1
    return _c97_msg_id


def _c97_conn() -> MagicMock:
    conn = MagicMock()
    conn.send_result = MagicMock()
    conn.send_error = MagicMock()
    conn.send_message = MagicMock()
    conn.subscriptions = {}
    conn.user = MagicMock(is_admin=True)
    return conn


# ─── websocket/dashboard.py: triggered status in statistics ───────────


async def test_statistics_triggered_count(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Line 209: triggered status is counted in statistics."""
    # Create a sensor-based task that will show as triggered
    task = build_task_data(
        schedule_type="sensor_based",
        interval_days=None,
        trigger_config={
            "type": "threshold",
            "entity_id": "sensor.cov97_temp",
            "trigger_above": 30,
        },
    )
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Triggered Obj", source="user",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        unique_id="maintenance_supporter_cov97_triggered",
    )
    obj_entry.add_to_hass(hass)
    hass.states.async_set("sensor.cov97_temp", "50")
    await setup_integration(hass, global_entry, obj_entry)

    conn = _c97_conn()
    await call_ws_handler(ws_get_statistics, hass, conn, {
        "id": _c97_nid(), "type": "maintenance_supporter/statistics",
    })
    result = conn.send_result.call_args[0][1]
    # The task should be triggered since sensor value 50 > threshold 30
    assert result["triggered"] >= 1


# ─── websocket/dashboard.py: subscribe new entry callback ─────────────


async def test_subscribe_new_entry_callback(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Lines 270-271: _on_new_entry callback fires on new object entry."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _c97_conn()

    await call_ws_handler(ws_subscribe, hass, conn, {
        "id": _c97_nid(), "type": "maintenance_supporter/subscribe",
    })
    # Initial send_result + _forward_update
    initial_calls = conn.send_message.call_count

    # Add and set up a new object entry
    task2 = build_task_data(task_id=TASK_ID_2, name="New Task", last_performed="2024-01-01")
    new_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="New Pump", source="user",
        data=build_object_entry_data(
            object_data=build_object_data(name="New Pump"),
            tasks={TASK_ID_2: task2},
        ),
        unique_id="maintenance_supporter_cov97_new_sub",
    )
    new_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(new_entry.entry_id)
    await hass.async_block_till_done()

    # The _on_new_entry callback should have fired _forward_update
    assert conn.send_message.call_count > initial_calls


# ─── websocket/dashboard.py: subscribe already attached (line 254) ────


async def test_subscribe_already_attached_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Line 254: _attach_entry returns early if already attached."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _c97_conn()

    # Subscribe — this attaches the entry
    await call_ws_handler(ws_subscribe, hass, conn, {
        "id": _c97_nid(), "type": "maintenance_supporter/subscribe",
    })

    # Manually trigger _on_new_entry for the already-attached entry
    # by dispatching the signal
    from homeassistant.helpers.dispatcher import async_dispatcher_send

    from custom_components.maintenance_supporter.const import SIGNAL_NEW_OBJECT_ENTRY

    msg_count_before = conn.send_message.call_count
    async_dispatcher_send(hass, SIGNAL_NEW_OBJECT_ENTRY, object_entry.entry_id)
    await hass.async_block_till_done()
    # _forward_update is still called even for already-attached entries
    # (line 271), but _attach_entry returns early at line 254
    assert conn.send_message.call_count >= msg_count_before


# ─── websocket/dashboard.py: budget_status edge cases ─────────────────


async def test_budget_status_edge_history(
    hass: HomeAssistant,
) -> None:
    """Lines 325, 329, 332, 336-337: non-completed type, null cost, invalid timestamp."""
    from custom_components.maintenance_supporter.websocket.dashboard import (
        ws_get_budget_status,
    )

    # Global entry with budget config
    data = build_global_entry_data()
    data["budget_monthly"] = 500.0
    data["budget_yearly"] = 5000.0
    ge = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Maintenance Supporter", source="user",
        data=data, unique_id=GLOBAL_UNIQUE_ID,
    )
    ge.add_to_hass(hass)

    # Object with history containing edge cases
    now = dt_util.now()
    task = build_task_data(last_performed=(now.date() - timedelta(days=5)).isoformat())
    task["history"] = [
        # Line 329: type != "completed" → continue
        {"timestamp": now.isoformat(), "type": "skipped", "cost": 100.0},
        # Line 332: cost is None → continue
        {"timestamp": now.isoformat(), "type": "completed", "cost": None},
        # Lines 336-337: invalid timestamp → continue
        {"timestamp": "not-a-date", "type": "completed", "cost": 50.0},
        # Line 325: history from entry.data (legacy path — store is None)
        {"timestamp": now.isoformat(), "type": "completed", "cost": 25.0},
    ]
    obj_entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Budget Edge", source="user",
        data=build_object_entry_data(
            object_data=build_object_data(name="Budget Edge"),
            tasks={TASK_ID_1: task},
        ),
        unique_id="maintenance_supporter_cov97_budget_edge",
    )
    obj_entry.add_to_hass(hass)
    await setup_integration(hass, ge, obj_entry)

    # Patch the store to None to hit the legacy history path (line 325)
    # Also write the history into entry.data so the legacy path finds it
    entry = hass.config_entries.async_get_entry(obj_entry.entry_id)
    assert entry is not None
    rd = entry.runtime_data
    original_store = rd.store
    rd.store = None

    # Re-inject history into entry.data for the legacy path
    new_data = dict(entry.data)
    tasks = dict(new_data.get(CONF_TASKS, {}))
    t = dict(tasks[TASK_ID_1])
    t["history"] = task["history"]
    tasks[TASK_ID_1] = t
    new_data[CONF_TASKS] = tasks
    hass.config_entries.async_update_entry(entry, data=new_data)

    conn = _c97_conn()
    await call_ws_handler(ws_get_budget_status, hass, conn, {
        "id": _c97_nid(), "type": "maintenance_supporter/budget_status",
    })
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # Only the valid completed entry with cost 25.0 should be counted
    assert result["monthly_spent"] == 25.0

    rd.store = original_store


# ─── websocket/dashboard.py: test_notification invalid service ────────


async def test_notification_invalid_service(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 464-471: invalid notify service in ws_test_notification."""
    # Set up with an invalid notify service
    hass.config_entries.async_update_entry(
        global_entry, options={
            **dict(global_entry.data),
            CONF_NOTIFY_SERVICE: "invalid_service_format",
            CONF_NOTIFICATIONS_ENABLED: True,
        },
    )
    await setup_integration(hass, global_entry)

    conn = _c97_conn()
    await call_ws_handler(ws_test_notification, hass, conn, {
        "id": _c97_nid(), "type": "maintenance_supporter/global/test_notification",
    })
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is False


# ─── websocket/dashboard.py: test_notification action buttons ─────────


async def test_notification_with_action_buttons(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Lines 486-493: action buttons included in test notification."""
    hass.config_entries.async_update_entry(
        global_entry, options={
            **dict(global_entry.data),
            CONF_NOTIFY_SERVICE: "notify.mobile_app_phone",
            CONF_NOTIFICATIONS_ENABLED: True,
            CONF_ACTION_COMPLETE_ENABLED: True,
            CONF_ACTION_SKIP_ENABLED: True,
            CONF_ACTION_SNOOZE_ENABLED: True,
        },
    )
    await setup_integration(hass, global_entry)
    # Register the configured notify service so the dual-path test-send dispatches
    # to it (it checks has_service first); the call is captured by the patch below.
    hass.services.async_register("notify", "mobile_app_phone", lambda call: None)

    calls: list[dict[str, Any]] = []

    original_async_call = hass.services.async_call

    async def mock_async_call(
        domain: str, service: str, service_data: dict[str, Any] | None = None, **kw: Any,
    ) -> None:
        if domain == "notify":
            calls.append({"domain": domain, "service": service, "data": service_data or {}})
            return
        await original_async_call(domain, service, service_data, **kw)

    conn = _c97_conn()
    with patch(
        "homeassistant.core.ServiceRegistry.async_call",
        side_effect=mock_async_call,
    ):
        await call_ws_handler(ws_test_notification, hass, conn, {
            "id": _c97_nid(), "type": "maintenance_supporter/global/test_notification",
        })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["success"] is True
    # Verify action buttons were included
    assert len(calls) == 1
    actions = calls[0]["data"].get("data", {}).get("actions", [])
    assert len(actions) == 3
    action_names = [a["action"] for a in actions]
    assert "MS_TEST_COMPLETE" in action_names
    assert "MS_TEST_SKIP" in action_names
    assert "MS_TEST_SNOOZE" in action_names


# ─── websocket/dashboard.py: ws_update_global_settings notify validation


async def test_update_settings_invalid_notify_service(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Line 414: notify_service validation in global update."""
    await setup_integration(hass, global_entry)
    conn = _c97_conn()
    await call_ws_handler(ws_update_global_settings, hass, conn, {
        "id": _c97_nid(), "type": "maintenance_supporter/global/update",
        "settings": {CONF_NOTIFY_SERVICE: "badprefix.service_name"},
    })
    conn.send_error.assert_called_once()
