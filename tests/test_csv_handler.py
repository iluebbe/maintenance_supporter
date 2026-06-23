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
