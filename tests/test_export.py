"""Tests for the export module (export.py)."""

from __future__ import annotations

import json
from unittest.mock import patch

import pytest


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
