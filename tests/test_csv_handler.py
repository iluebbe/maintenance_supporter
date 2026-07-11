"""Tests for the CSV import/export helper (helpers/csv_handler.py)."""

from __future__ import annotations


def test_csv_roundtrip_interval_anchor() -> None:
    """CSV export/import preserves interval_anchor field."""
    from custom_components.maintenance_supporter.helpers.csv_handler import (
        import_objects_csv,
    )

    csv_content = (
        "object_name,task_name,task_type,interval_days,interval_anchor,warning_days\n"
        "Pool,Filter,cleaning,30,planned,7\n"
        "Pool,Pump,service,60,completion,14\n"
    )
    objects = import_objects_csv(csv_content)
    assert len(objects) == 1
    tasks = list(objects[0]["tasks"].values())
    assert tasks[0]["interval_anchor"] == "planned"
    assert tasks[1]["interval_anchor"] == "completion"


# === migrated from test_cov_helpers.py (behaviour-based split) ===


def test_import_csv_skips_rows_without_task_name() -> None:
    """Line 180: rows with empty task_name are skipped."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_content = "object_name,task_name,schedule_type\nMyObj,,time_based\n"
    result = import_objects_csv(csv_content)
    # object is created but has no tasks (task_name was empty)
    assert len(result) == 1
    assert result[0]["tasks"] == {}


def test_import_csv_last_performed_set() -> None:
    """Line 218: last_performed is stored when non-empty."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_content = "object_name,task_name,schedule_type,last_performed\nPump,Filter clean,time_based,2026-04-01\n"
    result = import_objects_csv(csv_content)
    task = next(iter(result[0]["tasks"].values()))
    assert task["last_performed"] == "2026-04-01"


def test_import_csv_notes_set_when_non_empty() -> None:
    """Line 222: notes are stored when non-empty."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_content = "object_name,task_name,schedule_type,notes\nPump,Filter clean,time_based,Check valve too\n"
    result = import_objects_csv(csv_content)
    task = next(iter(result[0]["tasks"].values()))
    assert task["notes"] == "Check valve too"


def test_safe_int_none_returns_default() -> None:
    """Lines 265, 268-269: _safe_int handles None and invalid strings."""
    from custom_components.maintenance_supporter.helpers.csv_handler import _safe_int

    assert _safe_int(None, 7) == 7
    assert _safe_int("bad", 14) == 14
    assert _safe_int("30", None) == 30
    assert _safe_int("15.7", 0) == 15  # float string → int


def test_csv_object_documentation_url_and_notes_roundtrip() -> None:
    """object_documentation_url + object_notes are in the export columns but
    were never read back on import (round-trip gap, audit 2026-07-11)."""
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_content = (
        "object_name,object_documentation_url,object_notes,task_name,task_type,interval_days,warning_days\n"
        "Boiler,https://vendor.test/manual.pdf,Serviced by ACME,Descale,cleaning,90,7\n"
    )
    objects = import_objects_csv(csv_content)
    assert len(objects) == 1
    obj = objects[0]["object"]
    assert obj["documentation_url"] == "https://vendor.test/manual.pdf", "documentation_url dropped on CSV import"
    assert obj["notes"] == "Serviced by ACME", "notes dropped on CSV import"
