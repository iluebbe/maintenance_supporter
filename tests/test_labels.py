"""Tests for cross-cutting task labels/tags.

Covers the surfaces a label travels through:
- the dataclass round-trip (``MaintenanceTask``, persist-only-if-non-empty),
- the sanitizer (trim / dedup / per-label cap / count cap / type guard),
- the config-flow free-text parser (``parse_labels_text``).

The WS create/update round-trip and the get-object exposure tripwire live in
``test_ws_objects.py`` (alongside the priority equivalents).
"""

from __future__ import annotations

from custom_components.maintenance_supporter.const import (
    MAX_LABEL_LENGTH,
    MAX_LABELS,
)
from custom_components.maintenance_supporter.helpers.sanitize import (
    cap_task_fields,
    parse_labels_text,
)
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)


# ─── Dataclass round-trip ───────────────────────────────────────────────────


def test_model_roundtrips_labels() -> None:
    task = MaintenanceTask(name="X", labels=["safety", "seasonal"])
    d = task.to_dict()
    assert d["labels"] == ["safety", "seasonal"]
    assert MaintenanceTask.from_dict(d).labels == ["safety", "seasonal"]


def test_empty_labels_not_persisted() -> None:
    # An empty list is the default → kept out of the stored dict to stay lean.
    assert "labels" not in MaintenanceTask(name="X").to_dict()
    assert MaintenanceTask.from_dict({"name": "X"}).labels == []


# ─── Sanitizer ──────────────────────────────────────────────────────────────


def test_sanitize_trims_dedups_and_drops_empties() -> None:
    task = {"name": "X", "labels": ["  safety ", "safety", "", "seasonal"]}
    cap_task_fields(task)
    assert task["labels"] == ["safety", "seasonal"]


def test_sanitize_caps_label_length() -> None:
    task = {"name": "X", "labels": ["a" * (MAX_LABEL_LENGTH + 50)]}
    cap_task_fields(task)
    assert len(task["labels"][0]) == MAX_LABEL_LENGTH


def test_sanitize_caps_label_count() -> None:
    task = {"name": "X", "labels": [f"tag{i}" for i in range(MAX_LABELS + 10)]}
    cap_task_fields(task)
    assert len(task["labels"]) == MAX_LABELS


def test_sanitize_drops_non_string_items() -> None:
    task = {"name": "X", "labels": ["ok", 5, None, {"a": 1}, "fine"]}
    cap_task_fields(task)
    assert task["labels"] == ["ok", "fine"]


def test_sanitize_non_list_becomes_empty() -> None:
    task = {"name": "X", "labels": "safety,seasonal"}
    cap_task_fields(task)
    assert task["labels"] == []


# ─── Config-flow free-text parser ───────────────────────────────────────────


def test_parse_labels_text_splits_on_comma_and_newline() -> None:
    assert parse_labels_text("safety, seasonal\ntenant") == [
        "safety",
        "seasonal",
        "tenant",
    ]


def test_parse_labels_text_trims_and_drops_blanks() -> None:
    assert parse_labels_text("  a ,, , b ,") == ["a", "b"]


def test_parse_labels_text_empty() -> None:
    assert parse_labels_text("") == []
    assert parse_labels_text("   ") == []
