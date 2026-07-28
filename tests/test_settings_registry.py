"""Freeze tests for the global-settings registry (helpers/settings_registry).

The WS write handler and the options-flow selectors both derive their
allow-list and numeric ranges from SETTING_SPECS. These tests pin the derived
tables to their exact values, so an accidental range/type change (or a dropped
key) fails loudly instead of silently loosening validation on a live surface.
"""

from __future__ import annotations

from custom_components.maintenance_supporter.helpers.settings_registry import (
    ALLOWED_SETTING_KEYS,
    FLOAT_RANGES,
    INT_RANGES,
    SETTING_SPECS,
    STR_MAX_LENGTHS,
    float_range,
    int_range,
)

# The exact tables the WS handler used to hand-maintain. Kept here as the frozen
# baseline; changing a bound is a deliberate act that must update this test too.
_EXPECTED_INT_RANGES = {
    "default_warning_days": (1, 365),
    "max_notifications_per_day": (0, 1000),
    "notify_due_soon_interval_hours": (0, 720),
    "notify_overdue_interval_hours": (0, 720),
    "notify_triggered_interval_hours": (0, 720),
    "notification_bundle_threshold": (2, 20),
    "snooze_duration_hours": (1, 168),
    "budget_alert_threshold": (10, 100),
    "archive_oneoff_days": (0, 3650),
    "delete_archived_oneoff_days": (0, 3650),
    "warranty_reminder_days": (1, 365),
}
_EXPECTED_FLOAT_RANGES = {
    "budget_monthly": (0.0, 10_000_000.0),
    "budget_yearly": (0.0, 100_000_000.0),
}
_EXPECTED_STR_MAX_LENGTHS = {
    "notify_service": 200,
    "quiet_hours_start": 5,
    "quiet_hours_end": 5,
    "budget_currency": 5,
    "notify_scope_view_id": 64,
}


def test_int_ranges_frozen() -> None:
    assert INT_RANGES == _EXPECTED_INT_RANGES


def test_float_ranges_frozen() -> None:
    assert FLOAT_RANGES == _EXPECTED_FLOAT_RANGES


def test_str_max_lengths_frozen() -> None:
    assert STR_MAX_LENGTHS == _EXPECTED_STR_MAX_LENGTHS


def test_allowed_keys_count_and_types() -> None:
    # 48 writable settings, each mapped to a concrete Python type.
    assert len(ALLOWED_SETTING_KEYS) == 48
    assert all(isinstance(t, type) for t in ALLOWED_SETTING_KEYS.values())
    # No duplicate keys crept into the spec tuple.
    keys = [s.key for s in SETTING_SPECS]
    assert len(keys) == len(set(keys)) == 48


def test_every_ranged_key_is_declared_with_matching_type() -> None:
    # An int_range must be on an int setting, a float_range on a float setting.
    for key in INT_RANGES:
        assert ALLOWED_SETTING_KEYS[key] is int
    for key in FLOAT_RANGES:
        assert ALLOWED_SETTING_KEYS[key] is float
    for key in STR_MAX_LENGTHS:
        assert ALLOWED_SETTING_KEYS[key] is str


def test_range_accessors_and_errors() -> None:
    assert int_range("default_warning_days") == (1, 365)
    assert float_range("budget_monthly") == (0.0, 10_000_000.0)
    # Wrong accessor for the setting's kind raises loudly.
    import pytest

    with pytest.raises(KeyError):
        int_range("budget_monthly")
    with pytest.raises(KeyError):
        float_range("default_warning_days")
    with pytest.raises(KeyError):
        int_range("nonexistent_setting")
