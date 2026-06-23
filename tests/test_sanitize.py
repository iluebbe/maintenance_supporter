"""Tests for the sanitize helpers (helpers/sanitize.py)."""

from __future__ import annotations

from typing import Any


def test_sanitize_cap_action_field_unserializable_data() -> None:
    """cap_action_field silently drops data when JSON serialization fails."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_action_field

    class Unserializable:
        pass

    task_data: dict[str, Any] = {
        "on_complete_action": {
            "service": "notify.notify",
            "data": {"nested": Unserializable()},  # This will fail json.dumps
        }
    }
    cap_action_field(task_data)
    # The unserializable data should be dropped, but service stays
    cleaned = task_data.get("on_complete_action", {})
    assert cleaned.get("service") == "notify.notify"
    assert "data" not in cleaned


# === migrated from test_cov_helpers.py (behaviour-based split) ===

def test_cap_strings_truncates_long_values() -> None:
    """Line 69: _cap_strings truncates strings exceeding max length."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields

    # name has MAX_NAME_LENGTH cap; overflow string
    long_name = "A" * 10000
    data = {"name": long_name}
    result = cap_task_fields(data)
    assert len(result["name"]) < len(long_name)

def test_cap_task_interval_days_clamping() -> None:
    """Lines 86, 88: interval_days < 1 clamped to 1; > MAX clamped to MAX."""
    from custom_components.maintenance_supporter.const import MAX_INTERVAL_DAYS
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields

    # Below min: clamped to 1
    data = {"interval_days": -10}
    cap_task_fields(data)
    assert data["interval_days"] == 1

    # Above max: clamped to MAX_INTERVAL_DAYS
    data2 = {"interval_days": MAX_INTERVAL_DAYS + 9999}
    cap_task_fields(data2)
    assert data2["interval_days"] == MAX_INTERVAL_DAYS

def test_cap_task_warning_days_clamping() -> None:
    """Lines 93, 95: warning_days < 0 clamped to 0; > 365 clamped to 365."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields

    data = {"warning_days": -5}
    cap_task_fields(data)
    assert data["warning_days"] == 0

    data2 = {"warning_days": 999}
    cap_task_fields(data2)
    assert data2["warning_days"] == 365

def test_cap_task_checklist_non_list_dropped() -> None:
    """Line 100: non-list checklist is dropped."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields

    data = {"checklist": "not a list"}
    cap_task_fields(data)
    assert "checklist" not in data

def test_cap_action_field_non_dict_dropped() -> None:
    """Lines 146-147: on_complete_action that is not a dict is dropped."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_action_field

    data: dict[str, Any] = {"on_complete_action": "invalid"}
    cap_action_field(data)
    assert "on_complete_action" not in data

def test_cap_action_field_invalid_service_dropped() -> None:
    """Lines 168-173: invalid service name causes action to be dropped."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_action_field

    # Bad service name (no dot)
    data: dict[str, Any] = {"on_complete_action": {"service": "nodothere"}}
    cap_action_field(data)
    assert "on_complete_action" not in data

    # Service too long
    data2: dict[str, Any] = {"on_complete_action": {"service": "a." + "b" * 200}}
    cap_action_field(data2)
    assert "on_complete_action" not in data2

def test_cap_action_field_target_list_capped() -> None:
    """Lines 168-173: target entity_id as list is capped and kept."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_action_field

    data: dict[str, Any] = {
        "on_complete_action": {
            "service": "notify.send",
            "target": {
                "entity_id": ["light.a", "light.b"],
            },
        }
    }
    cap_action_field(data)
    assert "on_complete_action" in data
    assert data["on_complete_action"]["target"]["entity_id"] == ["light.a", "light.b"]

def test_cap_quick_complete_non_dict_dropped() -> None:
    """Lines 200-201: quick_complete_defaults that is not dict is dropped."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_quick_complete_defaults_field

    data: dict[str, Any] = {"quick_complete_defaults": "invalid"}
    cap_quick_complete_defaults_field(data)
    assert "quick_complete_defaults" not in data

def test_cap_quick_complete_empty_cleaned_drops_key() -> None:
    """Line 224: when cleaned dict is empty, key is removed."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_quick_complete_defaults_field

    # All fields invalid → cleaned is empty → key dropped
    data: dict[str, Any] = {
        "quick_complete_defaults": {
            "notes": "",           # empty string → rejected
            "cost": -1,            # negative → rejected
            "duration": -1,        # negative → rejected
            "feedback": "wrong",   # invalid value → rejected
        }
    }
    cap_quick_complete_defaults_field(data)
    assert "quick_complete_defaults" not in data

def test_cap_quick_complete_valid_fields_kept() -> None:
    """Lines 183-184: valid quick_complete_defaults are stored."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_quick_complete_defaults_field

    data: dict[str, Any] = {
        "quick_complete_defaults": {
            "notes": "pre-filled note",
            "cost": 12.5,
            "duration": 60,
            "feedback": "needed",
        }
    }
    cap_quick_complete_defaults_field(data)
    assert data["quick_complete_defaults"]["notes"] == "pre-filled note"
    assert data["quick_complete_defaults"]["cost"] == 12.5
    assert data["quick_complete_defaults"]["feedback"] == "needed"
