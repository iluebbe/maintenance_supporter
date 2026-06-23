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
