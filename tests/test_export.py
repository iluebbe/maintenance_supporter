"""Tests for the export module (export.py)."""

from __future__ import annotations

import json
from unittest.mock import MagicMock, patch

import pytest

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
)


def test_export_yaml_normal() -> None:
    """serialize_export with fmt='yaml' produces valid YAML containing expected keys."""
    from custom_components.maintenance_supporter.export import serialize_export
    yaml = pytest.importorskip("yaml")
    data = {"version": 1, "objects": [{"entry_id": "abc", "object": {"name": "Pump"}, "tasks": []}]}
    result = serialize_export(data, fmt="yaml")
    parsed = yaml.safe_load(result)
    assert parsed["version"] == 1
    assert "objects" in parsed


def test_export_yaml_import_error_fallback() -> None:
    """When PyYAML is unavailable, serialize_export falls back to JSON."""
    from custom_components.maintenance_supporter.export import serialize_export
    data = {"version": 1, "objects": []}
    with patch.dict("sys.modules", {"yaml": None}):
        result = serialize_export(data, fmt="yaml")
    parsed = json.loads(result)
    assert parsed["version"] == 1


def test_export_includes_new_fields() -> None:
    """export.py _build_export_object includes interval_anchor, last_planned_due, entity_slug."""
    from custom_components.maintenance_supporter.export import _build_export_object

    entry = MagicMock()
    entry.entry_id = "test_entry"
    entry.data = {
        CONF_OBJECT: {"name": "Test"},
        CONF_TASKS: {
            "t1": {
                "id": "t1",
                "name": "Test Task",
                "interval_anchor": "planned",
                "last_planned_due": "2026-03-01",
                "entity_slug": "my_slug",
                "interval_days": 30,
            }
        },
    }
    # No runtime_data/store
    entry.runtime_data = None

    result = _build_export_object(MagicMock(), entry, None, include_history=False)
    task = result["tasks"][0]
    assert task["interval_anchor"] == "planned"
    assert task["last_planned_due"] == "2026-03-01"
    assert task["entity_slug"] == "my_slug"


def test_export_default_anchor() -> None:
    """Tasks without explicit interval_anchor default to 'completion' in export."""
    from custom_components.maintenance_supporter.export import _build_export_object

    entry = MagicMock()
    entry.entry_id = "test_entry"
    entry.data = {
        CONF_OBJECT: {"name": "Test"},
        CONF_TASKS: {"t1": {"id": "t1", "name": "Test Task"}},
    }
    entry.runtime_data = None

    result = _build_export_object(MagicMock(), entry, None, include_history=False)
    assert result["tasks"][0]["interval_anchor"] == "completion"
