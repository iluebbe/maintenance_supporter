"""Tests for WebSocket IO handlers (websocket/io.py)."""

from __future__ import annotations

import json
from unittest.mock import MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
)
from custom_components.maintenance_supporter.export import build_export_data
from custom_components.maintenance_supporter.helpers.csv_handler import (
    export_object_records_csv,
    import_objects_csv,
)
from custom_components.maintenance_supporter.helpers.schedule import (
    read_legacy_fields,
)
from custom_components.maintenance_supporter.websocket.io import (
    ws_batch_generate_qr,
    ws_export_csv,
    ws_export_data,
    ws_export_objects_csv,
    ws_generate_qr,
    ws_get_templates,
    ws_import_csv,
    ws_import_json,
)

from .conftest import (
    TASK_ID_1,
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
def object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_ws_io",
    )
    entry.add_to_hass(hass)
    return entry


# ─── ws_get_templates ────────────────────────────────────────────────────


async def test_get_templates(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test get_templates returns categories and templates."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_get_templates, hass, conn, {
        "id": 1, "type": "maintenance_supporter/templates",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "categories" in result
    assert "templates" in result
    assert isinstance(result["categories"], dict)
    assert isinstance(result["templates"], list)
    assert len(result["templates"]) > 0

    # Check template structure
    tmpl = result["templates"][0]
    assert "id" in tmpl
    assert "name" in tmpl
    assert "category" in tmpl
    assert "tasks" in tmpl
    if tmpl["tasks"]:
        tt = tmpl["tasks"][0]
        assert "name" in tt
        assert "type" in tt
        assert "schedule_type" in tt


# ─── ws_export_data ──────────────────────────────────────────────────────


async def test_export_data_json(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test JSON export."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_export_data, hass, conn, {
        "id": 1, "type": "maintenance_supporter/export",
        "format": "json",
        "include_history": True,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["format"] == "json"
    assert isinstance(result["data"], str)
    assert "Pool Pump" in result["data"]


async def test_export_data_yaml(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test YAML export (no objects to avoid HA repr issues)."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_export_data, hass, conn, {
        "id": 1, "type": "maintenance_supporter/export",
        "format": "yaml",
        "include_history": True,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["format"] == "yaml"
    assert isinstance(result["data"], str)
    assert "version" in result["data"]


async def test_export_data_no_history(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test export without history."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_export_data, hass, conn, {
        "id": 1, "type": "maintenance_supporter/export",
        "include_history": False,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert isinstance(result["data"], str)


# ─── ws_export_csv ───────────────────────────────────────────────────────


async def test_export_csv(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test CSV export."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_export_csv, hass, conn, {
        "id": 1, "type": "maintenance_supporter/csv/export",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "csv" in result
    csv_data = result["csv"]
    assert "object_name" in csv_data  # header
    assert "Pool Pump" in csv_data


async def test_export_csv_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test CSV export with no objects."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_export_csv, hass, conn, {
        "id": 1, "type": "maintenance_supporter/csv/export",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # Should still have header row
    assert "object_name" in result["csv"]


# ─── ws_export_objects_csv (#67, per-object) ─────────────────────────────


async def test_export_objects_csv_one_row_per_object(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """objects/csv: one row per object incl. task-less, with the warranty col."""
    # A task-less object with full asset fields — the per-task CSV skips these.
    obj2 = build_object_data(name="Task-less Asset")
    obj2["warranty_expiry"] = "2031-09-09"
    obj2["documentation_url"] = "https://x.test/m.pdf"
    obj2["notes"] = "spare part 12-34"
    entry2 = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Task-less Asset",
        data=build_object_entry_data(object_data=obj2, tasks={}),
        source="user", unique_id="maintenance_supporter_taskless_asset",
    )
    entry2.add_to_hass(hass)
    await setup_integration(hass, global_entry, object_entry, entry2)
    conn = _mock_connection()

    await call_ws_handler(ws_export_objects_csv, hass, conn, {
        "id": 1, "type": "maintenance_supporter/objects/csv",
    })

    conn.send_result.assert_called_once()
    csv_text = conn.send_result.call_args[0][1]["csv"]
    lines = [ln for ln in csv_text.splitlines() if ln.strip()]
    assert lines[0].startswith("object_name,")
    assert "object_warranty_expiry" in lines[0]
    # header + exactly one row per object (2 objects)
    assert len(lines) == 3
    assert any("Task-less Asset" in ln and "2031-09-09" in ln for ln in lines[1:])
    assert any("Pool Pump" in ln for ln in lines[1:])


async def test_export_objects_csv_roundtrips_via_import(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """The per-object CSV uses object_* columns the CSV importer understands."""
    obj = build_object_data(name="RoundTrip Asset")
    obj["warranty_expiry"] = "2030-05-05"
    obj["installation_date"] = "2019-01-01"
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="RoundTrip Asset",
        data=build_object_entry_data(object_data=obj, tasks={}),
        source="user", unique_id="maintenance_supporter_roundtrip_asset",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    csv_text = export_object_records_csv(hass)
    parsed = import_objects_csv(csv_text, hass=hass)
    target = [o for o in parsed if o["object"]["name"] == "RoundTrip Asset"]
    assert target
    assert target[0]["object"]["warranty_expiry"] == "2030-05-05"
    assert target[0]["object"]["installation_date"] == "2019-01-01"


async def test_json_export_import_roundtrips_doc_url_and_notes(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """documentation_url + notes survive JSON export → import (#67 gap fix)."""
    obj = build_object_data(name="Docs Asset")
    obj["documentation_url"] = "https://x.test/manual.pdf"
    obj["notes"] = "torque 25Nm; filter ABC-9"
    obj["warranty_expiry"] = "2032-02-02"
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Docs Asset",
        data=build_object_entry_data(object_data=obj, tasks={}),
        source="user", unique_id="maintenance_supporter_docs_asset",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    data = build_export_data(hass, include_history=False)
    exported = next(e for e in data["objects"] if e["object"]["name"] == "Docs Asset")
    assert exported["object"]["documentation_url"] == "https://x.test/manual.pdf"
    assert exported["object"]["notes"] == "torque 25Nm; filter ABC-9"

    # Re-import a renamed copy through the real JSON import path.
    exported["object"]["name"] = "Docs Asset Copy"
    conn = _mock_connection()
    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json.dumps({"objects": [exported]}),
    })
    conn.send_result.assert_called_once()

    entries = [
        e for e in hass.config_entries.async_entries(DOMAIN)
        if e.title == "Docs Asset Copy"
    ]
    assert entries
    imported = entries[0].data[CONF_OBJECT]
    assert imported["documentation_url"] == "https://x.test/manual.pdf"
    assert imported["notes"] == "torque 25Nm; filter ABC-9"
    assert imported["warranty_expiry"] == "2032-02-02"


async def test_export_handles_null_checklist(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Export must not crash when a task has checklist/history = None.

    Regression: a task created without a checklist persists ``checklist: None``
    (key present, value null), so ``.get("checklist", [])`` returns None and CSV
    export iterated it → ``TypeError`` ("action failed, try again"). Pins both
    the CSV path (iterates) and the JSON path (was emitting null).
    """
    task = {**build_task_data(), "checklist": None, "history": None}
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Null Checklist",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user", unique_id="maintenance_supporter_null_checklist",
    )
    entry.add_to_hass(hass)
    await setup_integration(hass, global_entry, entry)

    # CSV export — the path that crashed.
    conn = _mock_connection()
    await call_ws_handler(ws_export_csv, hass, conn, {
        "id": 1, "type": "maintenance_supporter/csv/export",
    })
    conn.send_error.assert_not_called()
    conn.send_result.assert_called_once()
    assert "object_name" in conn.send_result.call_args[0][1]["csv"]

    # JSON export — must succeed too (checklist normalized to []).
    conn = _mock_connection()
    await call_ws_handler(ws_export_data, hass, conn, {
        "id": 2, "type": "maintenance_supporter/export", "format": "json",
    })
    conn.send_error.assert_not_called()
    conn.send_result.assert_called_once()
    assert "data" in conn.send_result.call_args[0][1]

    # YAML export — must succeed too.
    conn = _mock_connection()
    await call_ws_handler(ws_export_data, hass, conn, {
        "id": 3, "type": "maintenance_supporter/export", "format": "yaml",
    })
    conn.send_error.assert_not_called()
    conn.send_result.assert_called_once()
    assert "data" in conn.send_result.call_args[0][1]


def test_serialize_export_yaml_handles_non_native_types() -> None:
    """YAML export must handle JSON-serializable-but-not-YAML-safe types.

    Regression: yaml.safe_dump raised RepresenterError on a tuple in the real
    export data while the JSON path coerced it to a list. Both paths now
    normalize through JSON, so YAML export works whenever JSON export does.
    """
    import yaml

    from custom_components.maintenance_supporter.export import serialize_export

    data = {"version": 1, "objects": [{"name": "X", "weird": (1, 2, 3)}]}
    # JSON path coerces the tuple to a list (works today).
    assert "weird" in serialize_export(data, "json")
    # YAML path must no longer crash and must round-trip the value as a list.
    parsed = yaml.safe_load(serialize_export(data, "yaml"))
    assert parsed["objects"][0]["weird"] == [1, 2, 3]


async def test_yaml_export_import_roundtrip(
    hass: HomeAssistant,
    global_entry: MockConfigEntry,
    object_entry: MockConfigEntry,
) -> None:
    """Export to YAML, then import that YAML back — first-class YAML round-trip.

    Pins the option-3 contract: the structured importer (json/import) accepts
    YAML as well as JSON, so every export format round-trips.
    """
    await setup_integration(hass, global_entry, object_entry)

    conn = _mock_connection()
    await call_ws_handler(ws_export_data, hass, conn, {
        "id": 1, "type": "maintenance_supporter/export", "format": "yaml",
    })
    yaml_content = conn.send_result.call_args[0][1]["data"]
    assert "objects:" in yaml_content  # sanity: it really is YAML

    conn = _mock_connection()
    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 2, "type": "maintenance_supporter/json/import",
        "json_content": yaml_content,
    })
    conn.send_error.assert_not_called()
    assert conn.send_result.call_args[0][1].get("created", 0) >= 1


async def test_json_import_preserves_interval_unit_and_due_date(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """JSON/YAML import keeps interval_unit + one-time due_date (round-trip, #58/#59)."""
    import json as _json

    await setup_integration(hass, global_entry)
    payload = _json.dumps({"version": 1, "objects": [{
        "object": {"name": "ImportedUnitObj"},
        "tasks": [
            {"name": "Monthly", "schedule_type": "time_based",
             "interval_days": 3, "interval_unit": "months"},
            {"name": "OneShot", "schedule_type": "one_time",
             "due_date": "2026-09-01"},
        ],
    }]})
    conn = _mock_connection()
    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": payload,
    })
    conn.send_error.assert_not_called()

    entry = next(
        e for e in hass.config_entries.async_entries("maintenance_supporter")
        if e.data.get("object", {}).get("name") == "ImportedUnitObj"
    )
    tasks = list(entry.data.get("tasks", {}).values())
    monthly = next(t for t in tasks if t["name"] == "Monthly")
    oneshot = next(t for t in tasks if t["name"] == "OneShot")
    assert read_legacy_fields(monthly)["interval_unit"] == "months"
    assert read_legacy_fields(oneshot)["due_date"] == "2026-09-01"


async def test_json_import_preserves_calendar_kind(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """JSON import keeps a calendar kind (nth_weekday) via the nested schedule."""
    import json as _json

    await setup_integration(hass, global_entry)
    payload = _json.dumps({"version": 1, "objects": [{
        "object": {"name": "CalKindObj"},
        "tasks": [
            {"name": "Smoke alarm",
             "schedule": {"kind": "nth_weekday", "nth": 1, "weekday": 5}},
        ],
    }]})
    conn = _mock_connection()
    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": payload,
    })
    conn.send_error.assert_not_called()

    entry = next(
        e for e in hass.config_entries.async_entries("maintenance_supporter")
        if e.data.get("object", {}).get("name") == "CalKindObj"
    )
    task = next(iter(entry.data.get("tasks", {}).values()))
    assert task["schedule"] == {"kind": "nth_weekday", "nth": 1, "weekday": 5}


# ─── ws_import_csv ───────────────────────────────────────────────────────


async def test_import_csv_empty(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing empty CSV."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_import_csv, hass, conn, {
        "id": 1, "type": "maintenance_supporter/csv/import",
        "csv_content": "object_name,task_name\n",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "empty_csv"


async def test_import_csv_valid(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing valid CSV creates entries."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    csv = (
        "object_name,task_name,task_type,schedule_type,interval_days,warning_days\n"
        "Test Pump,Oil Change,service,time_based,90,14\n"
        "Test Pump,Filter Clean,cleaning,time_based,30,7\n"
    )

    await call_ws_handler(ws_import_csv, hass, conn, {
        "id": 1, "type": "maintenance_supporter/csv/import",
        "csv_content": csv,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["total"] == 1  # 1 object
    assert result["created"] == 1
    assert len(result["imported"]) == 1
    assert result["imported"][0]["name"] == "Test Pump"
    assert result["imported"][0]["task_count"] == 2


async def test_import_json_caps_checklist(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """JSON import drops non-string checklist items, caps per-item length, and
    enforces the 100-item ceiling. Mirrors the WebSocket schema for create/update."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json as _json
    long_item = "X" * 600  # > MAX_CHECKLIST_ITEM_LENGTH (500) → must be dropped
    valid_items = [f"step {i}" for i in range(150)]  # > MAX_CHECKLIST_ITEMS (100)
    json_data = _json.dumps({
        "version": 1,
        "objects": [{
            "object": {"name": f"JSON Cap {1}"},
            "tasks": [{
                "name": "Big",
                "schedule_type": "time_based",
                "interval_days": 30,
                "checklist": [
                    *valid_items,
                    long_item,
                    12345,           # non-string → dropped
                    None,            # non-string → dropped
                    {"a": "b"},      # non-string → dropped
                    "OK final",
                ],
            }],
        }],
    })
    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })
    res = conn.send_result.call_args[0][1]
    assert res["created"] == 1
    entry_id = res["imported"][0]["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    task = next(iter(entry.data[CONF_TASKS].values()))
    cl = task.get("checklist", [])
    assert len(cl) <= 100, f"item count not capped: {len(cl)}"
    assert all(isinstance(x, str) and len(x) <= 500 for x in cl), \
        "non-strings or oversize items leaked through"


async def test_csv_roundtrip_preserves_schedule_time(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """schedule_time round-trips through CSV. Malformed values are dropped."""
    from custom_components.maintenance_supporter.helpers.csv_handler import (
        export_objects_csv,
        import_objects_csv,
    )

    await setup_integration(hass, global_entry)

    entry = MockConfigEntry(
        domain="maintenance_supporter",
        title="CSV SchedTime",
        unique_id="maintenance_supporter_csv_schedtime",
        data={
            "object": {"id": "obj1", "name": "CSV SchedTime", "task_ids": ["t1"]},
            "tasks": {
                "t1": {
                    "id": "t1", "object_id": "obj1", "name": "Timed",
                    "type": "service", "schedule_type": "time_based",
                    "interval_days": 7, "warning_days": 1, "enabled": True,
                    "schedule_time": "09:30",
                }
            },
        },
    )
    entry.add_to_hass(hass)

    csv_text = export_objects_csv(hass)
    assert "09:30" in csv_text

    parsed = import_objects_csv(csv_text)
    entry_parsed = next(o for o in parsed if o["object"]["name"] == "CSV SchedTime")
    task = next(iter(entry_parsed["tasks"].values()))
    assert task.get("schedule_time") == "09:30"


async def test_csv_roundtrip_preserves_interval_unit_and_due_date(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """interval_unit (months) and one-time due_date round-trip through CSV."""
    from custom_components.maintenance_supporter.helpers.csv_handler import (
        export_objects_csv,
        import_objects_csv,
    )

    await setup_integration(hass, global_entry)

    entry = MockConfigEntry(
        domain="maintenance_supporter",
        title="CSV IntervalUnit",
        unique_id="maintenance_supporter_csv_interval_unit",
        data={
            "object": {
                "id": "obj1", "name": "CSV IntervalUnit",
                "task_ids": ["t1", "t2"],
            },
            "tasks": {
                "t1": {
                    "id": "t1", "object_id": "obj1", "name": "Monthly",
                    "type": "service", "schedule_type": "time_based",
                    "interval_days": 3, "interval_unit": "months",
                    "warning_days": 1, "enabled": True,
                },
                "t2": {
                    "id": "t2", "object_id": "obj1", "name": "One Shot",
                    "type": "inspection", "schedule_type": "one_time",
                    "due_date": "2026-09-01", "warning_days": 1, "enabled": True,
                },
            },
        },
    )
    entry.add_to_hass(hass)

    csv_text = export_objects_csv(hass)
    assert "months" in csv_text
    assert "2026-09-01" in csv_text

    parsed = import_objects_csv(csv_text)
    entry_parsed = next(
        o for o in parsed if o["object"]["name"] == "CSV IntervalUnit"
    )
    tasks = entry_parsed["tasks"]
    monthly = next(t for t in tasks.values() if t["name"] == "Monthly")
    one_shot = next(t for t in tasks.values() if t["name"] == "One Shot")
    assert monthly.get("interval_unit") == "months"
    assert one_shot.get("schedule_type") == "one_time"
    assert one_shot.get("due_date") == "2026-09-01"


async def test_csv_import_drops_malformed_schedule_time(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Garbage in schedule_time column must be dropped, not persisted."""
    from custom_components.maintenance_supporter.helpers.csv_handler import (
        import_objects_csv,
    )

    csv = (
        "object_name,task_name,task_type,schedule_type,interval_days,"
        "interval_anchor,schedule_time,warning_days\n"
        "Pump,Svc,service,time_based,7,completion,25:00,1\n"  # hour 25 invalid
    )
    parsed = import_objects_csv(csv)
    task = next(iter(parsed[0]["tasks"].values()))
    assert "schedule_time" not in task


async def test_json_import_drops_malformed_schedule_time(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """JSON import sanitizes schedule_time via the same HH:MM regex."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json as _json
    data = _json.dumps({
        "version": 1,
        "objects": [{
            "object": {"name": "JSON Sched 1"},
            "tasks": [{
                "name": "Good",
                "schedule_type": "time_based",
                "interval_days": 7,
                "schedule_time": "14:00",
            }, {
                "name": "Bad",
                "schedule_type": "time_based",
                "interval_days": 7,
                "schedule_time": "nope",
            }],
        }],
    })
    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": data,
    })
    res = conn.send_result.call_args[0][1]
    entry_id = res["imported"][0]["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    tasks = list(entry.data[CONF_TASKS].values())
    good = next(t for t in tasks if t["name"] == "Good")
    bad = next(t for t in tasks if t["name"] == "Bad")
    assert good.get("schedule_time") == "14:00"
    assert "schedule_time" not in bad


async def test_csv_roundtrip_preserves_checklist(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Checklist round-trips through CSV: items survive embedded newlines and
    formula-injection prefixes are neutralised on each item, not lost."""
    from custom_components.maintenance_supporter.helpers.csv_handler import (
        export_objects_csv,
        import_objects_csv,
    )

    await setup_integration(hass, global_entry)

    # Build a config entry with a task that has a tricky checklist
    entry = MockConfigEntry(
        domain="maintenance_supporter",
        title="CSV Pump",
        unique_id="maintenance_supporter_csv_pump",
        data={
            "object": {"id": "obj1", "name": "CSV Pump", "task_ids": ["t1"]},
            "tasks": {
                "t1": {
                    "id": "t1", "object_id": "obj1", "name": "Service",
                    "type": "service", "schedule_type": "time_based",
                    "interval_days": 30, "warning_days": 7, "enabled": True,
                    "checklist": [
                        "Drain water",
                        "=SUM(A1:A99)",  # would be a formula; must be neutralised
                        "Test pressure",
                    ],
                }
            },
        },
    )
    entry.add_to_hass(hass)

    # Export
    csv_text = export_objects_csv(hass)
    assert "CSV Pump" in csv_text

    # Import the produced CSV back into a fresh parse
    parsed = import_objects_csv(csv_text)
    csv_pump = next(o for o in parsed if o["object"]["name"] == "CSV Pump")
    task = next(iter(csv_pump["tasks"].values()))
    cl = task["checklist"]
    assert cl[0] == "Drain water"
    # Formula-injection guard prefixed a tab — payload preserved, not executed
    assert cl[1].startswith("\t=") or cl[1] == "=SUM(A1:A99)"
    assert cl[2] == "Test pressure"
    assert len(cl) == 3


async def test_csv_import_caps_checklist_length(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Malicious CSV with too many or too long checklist items must be capped."""
    from custom_components.maintenance_supporter.helpers.csv_handler import (
        import_objects_csv,
    )

    # Build a CSV row where the checklist cell contains 200 lines (> cap=100)
    # plus one absurdly long line (> per-item cap=500).
    long_step = "A" * 600
    many_steps = "\n".join([f"step{i}" for i in range(200)])
    checklist_cell = many_steps + "\n" + long_step
    # Quote the checklist cell because it contains newlines (RFC 4180)
    csv = (
        "object_name,task_name,task_type,schedule_type,interval_days,warning_days,checklist\n"
        f'Big Pump,Service,service,time_based,30,7,"{checklist_cell}"\n'
    )
    parsed = import_objects_csv(csv)
    task = next(iter(parsed[0]["tasks"].values()))
    items = task.get("checklist", [])
    assert len(items) <= 100, f"checklist not capped: got {len(items)} items"
    assert all(len(item) <= 500 for item in items), "per-item length not capped"


async def test_import_csv_multiple_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing CSV with multiple objects."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    csv = (
        "object_name,task_name,task_type,schedule_type,interval_days,warning_days\n"
        "Pump A,Oil Change,service,time_based,90,14\n"
        "Pump B,Filter Clean,cleaning,time_based,30,7\n"
    )

    await call_ws_handler(ws_import_csv, hass, conn, {
        "id": 1, "type": "maintenance_supporter/csv/import",
        "csv_content": csv,
    })

    result = conn.send_result.call_args[0][1]
    assert result["total"] == 2  # 2 objects
    assert result["created"] == 2


# ─── ws_import_json ──────────────────────────────────────────────────────


async def test_import_json_valid(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing valid JSON creates entries with all fields."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json
    json_data = json.dumps({
        "version": 1,
        "objects": [{
            "object": {
                "name": "JSON Pump",
                "manufacturer": "Acme",
                "model": "X100",
                "area_id": "garage",
                "installation_date": "2024-01-15",
            },
            "tasks": [
                {
                    "name": "Oil Change",
                    "type": "service",
                    "enabled": True,
                    "schedule_type": "time_based",
                    "interval_days": 90,
                    "interval_anchor": "planned",
                    "warning_days": 14,
                    "last_performed": "2025-12-01",
                    "notes": "Use 5W-30",
                    "checklist": ["Drain old oil", "Replace filter"],
                    "history": [{"date": "2025-12-01", "notes": "Done"}],
                },
                {
                    "name": "Filter Clean",
                    "type": "cleaning",
                    "schedule_type": "time_based",
                    "interval_days": 30,
                },
            ],
        }],
    })

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["total"] == 1
    assert result["created"] == 1
    assert len(result["imported"]) == 1
    assert result["imported"][0]["name"] == "JSON Pump"
    assert result["imported"][0]["task_count"] == 2

    # Regression (issue #30): imported tasks must have `created_at` stamped
    # so next_due has a stable anchor (not a moving today+interval).
    from homeassistant.util import dt as dt_util

    entry_id = result["imported"][0]["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    today_iso = dt_util.now().date().isoformat()
    for task in entry.data[CONF_TASKS].values():
        assert task["created_at"] == today_iso


async def test_import_json_multiple_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing JSON with multiple objects."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json
    json_data = json.dumps({
        "version": 1,
        "objects": [
            {"object": {"name": "Pump A"}, "tasks": [{"name": "Task 1"}]},
            {"object": {"name": "Pump B"}, "tasks": [{"name": "Task 2"}]},
        ],
    })

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    result = conn.send_result.call_args[0][1]
    assert result["total"] == 2
    assert result["created"] == 2


async def test_import_json_invalid_json(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing invalid JSON returns error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": "not valid json {{{",
    })

    conn.send_error.assert_called_once()
    # Importer accepts JSON or YAML now; unparseable content → invalid_format.
    assert conn.send_error.call_args[0][1] == "invalid_format"


async def test_import_json_missing_objects_key(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing JSON without 'objects' key returns error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": '{"version": 1}',
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_format"


async def test_import_json_empty_objects(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing JSON with empty objects array returns error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": '{"version": 1, "objects": []}',
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "empty"


async def test_import_json_missing_name(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing JSON with missing object name reports error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json
    json_data = json.dumps({
        "version": 1,
        "objects": [{"object": {}, "tasks": [{"name": "Task 1"}]}],
    })

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 0
    assert len(result["errors"]) == 1
    assert result["errors"][0]["reason"] == "missing name"


async def test_import_json_duplicate_name_reports_error(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test importing JSON with an existing object name reports error."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json

    # First import succeeds
    json_data = json.dumps({
        "version": 1,
        "objects": [{"object": {"name": "Dup Pump"}, "tasks": [{"name": "T1"}]}],
    })
    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })
    assert conn.send_result.call_args[0][1]["created"] == 1

    # Second import of same name fails
    conn.reset_mock()
    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 2, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 0
    assert len(result["errors"]) == 1


async def test_import_json_skips_computed_fields(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that computed fields in export JSON are ignored on import."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json
    json_data = json.dumps({
        "version": 1,
        "objects": [{
            "entry_id": "old_entry_id",
            "object": {"name": "Computed Test"},
            "tasks": [{
                "id": "old_task_id",
                "name": "Task With Computed",
                "type": "cleaning",
                "interval_days": 30,
                "status": "overdue",
                "days_until_due": -5,
                "next_due": "2025-01-01",
                "times_performed": 10,
                "total_cost": 500.0,
                "average_duration": 45,
            }],
        }],
    })

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1
    # The entry_id should be new, not the old one
    assert result["imported"][0]["entry_id"] != "old_entry_id"


async def test_import_json_with_trigger_config(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test that trigger_config is preserved on import."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    import json
    trigger_config = {
        "type": "threshold",
        "entity_ids": ["sensor.temperature"],
        "trigger_above": 30.0,
    }
    json_data = json.dumps({
        "version": 1,
        "objects": [{
            "object": {"name": "Trigger Test"},
            "tasks": [{
                "name": "Threshold Task",
                "schedule_type": "sensor_based",
                "trigger_config": trigger_config,
            }],
        }],
    })

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": json_data,
    })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1

    # Verify the entry was created with trigger_config
    entry_id = result["imported"][0]["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)
    assert entry is not None
    tasks = entry.data.get(CONF_TASKS, {})
    task = list(tasks.values())[0]
    assert task["trigger_config"] == trigger_config


# ─── ws_generate_qr ──────────────────────────────────────────────────────


async def test_generate_qr_object(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test QR code generation for an object."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_generate_qr, hass, conn, {
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": object_entry.entry_id,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "svg_data_uri" in result
    assert result["svg_data_uri"].startswith("data:image/svg+xml,")
    assert "url" in result
    assert "maintenance-supporter" in result["url"]
    assert "label" in result
    assert result["label"]["object_name"] == "Pool Pump"
    assert result["label"]["task_name"] is None


async def test_generate_qr_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test QR code generation for a specific task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_generate_qr, hass, conn, {
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "action": "complete",
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert "task_id" in result["url"]
    assert "action=complete" in result["url"]
    assert result["label"]["task_name"] == "Filter Cleaning"


async def test_generate_qr_with_base_url(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test QR code generation with custom base URL."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_generate_qr, hass, conn, {
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": object_entry.entry_id,
        "base_url": "https://my-ha.example.com",
    })

    result = conn.send_result.call_args[0][1]
    assert result["url"].startswith("https://my-ha.example.com/maintenance-supporter")


async def test_generate_qr_not_found_entry(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test QR generation with non-existent entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_generate_qr, hass, conn, {
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": "nonexistent",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_generate_qr_not_found_task(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """Test QR generation with non-existent task."""
    await setup_integration(hass, global_entry, object_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_generate_qr, hass, conn, {
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": object_entry.entry_id,
        "task_id": "nonexistent_task",
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "not_found"


async def test_generate_qr_rejects_global(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """Test QR generation rejects global entry."""
    await setup_integration(hass, global_entry)
    conn = _mock_connection()

    await call_ws_handler(ws_generate_qr, hass, conn, {
        "id": 1, "type": "maintenance_supporter/qr/generate",
        "entry_id": global_entry.entry_id,
    })

    conn.send_error.assert_called_once()


# ===========================================================================
# Coverage tests carried from test_cov_ws.py (websocket/io.py section)
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


@pytest.fixture
def covws_object_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = build_task_data(last_performed="2024-06-01")
    entry = MockConfigEntry(
        version=1, minor_version=1, domain=DOMAIN,
        title="Pool Pump",
        data=build_object_entry_data(tasks={TASK_ID_1: task}),
        source="user",
        unique_id="maintenance_supporter_pool_pump_cov",
    )
    entry.add_to_hass(hass)
    return entry


# Lines 177-181: CSV import — unexpected exception during flow.async_init
async def test_csv_import_flow_exception(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_csv: exception in flow.async_init is caught, appended to errors."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    # CSV format requires object_name + task_name columns
    csv_content = "object_name,task_name\nPump A,Filter Clean\n"

    async def _raise(*args, **kwargs):
        raise RuntimeError("simulated flow error")

    with patch.object(hass.config_entries.flow, "async_init", side_effect=_raise):
        await call_ws_handler(ws_import_csv, hass, conn, {
            "id": 1, "type": "maintenance_supporter/csv/import",
            "csv_content": csv_content,
        })

    # send_result is called even when all rows error
    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 0
    assert "errors" in result
    assert any("unexpected error" in e.get("reason", "") for e in result["errors"])


# Lines 192-193: CSV import — flow returns non-create_entry type
async def test_csv_import_flow_aborted(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_csv: a flow result that isn't create_entry appends to errors."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    # CSV format requires object_name + task_name columns
    csv_content = "object_name,task_name\nPump Fail,Filter\n"

    async def _abort(*args, **kwargs):
        return {"type": "abort", "reason": "already_configured"}

    with patch.object(hass.config_entries.flow, "async_init", side_effect=_abort):
        await call_ws_handler(ws_import_csv, hass, conn, {
            "id": 1, "type": "maintenance_supporter/csv/import",
            "csv_content": csv_content,
        })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 0
    assert "errors" in result
    assert result["errors"][0]["reason"] == "already_configured"


# Line 201: CSV import — resp includes "errors" key when errors list is non-empty
# (already covered by tests above — this tests the resp dict branch explicitly)
async def test_csv_import_errors_key_in_response(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_csv: 'errors' key appears in resp iff errors is non-empty."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    # CSV format requires object_name + task_name columns
    csv_content = "object_name,task_name\nOK Pump,Filter\n"

    async def _success(*args, **kwargs):
        fake_entry = MagicMock()
        fake_entry.entry_id = "fake123"
        return {"type": "create_entry", "result": fake_entry}

    with patch.object(hass.config_entries.flow, "async_init", side_effect=_success):
        await call_ws_handler(ws_import_csv, hass, conn, {
            "id": 1, "type": "maintenance_supporter/csv/import",
            "csv_content": csv_content,
        })

    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1
    # No errors → key should NOT be present
    assert "errors" not in result


# Lines 220-221: ws_import_json — YAML parsing fallback; YAML error → invalid_format
async def test_json_import_invalid_yaml(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: content that fails both JSON and YAML parse → invalid_format."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    # Deliberately broken YAML that yaml.safe_load raises on
    bad_content = "key: :\n  - broken: [unclosed"

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": bad_content,
    })

    conn.send_error.assert_called_once()
    args = conn.send_error.call_args[0]
    assert args[1] == "invalid_format"


# Lines 245-246: ws_import_json — oversized content
async def test_json_import_too_large(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: content > 10MB → too_large error."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    big_content = "x" * (10_485_760 + 1)

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": big_content,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "too_large"


# Lines 262-263: ws_import_json — 'objects' key present but not a list
async def test_json_import_objects_not_list(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: 'objects' is a dict (not list) → invalid_format."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    content = json.dumps({"objects": {"bad": "shape"}})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "invalid_format"


# Lines 266-267: ws_import_json — objects list exceeds 1000
async def test_json_import_too_many_objects(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: objects list > 1000 → too_many error."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    objects = [{"object": {"name": f"obj{i}"}, "tasks": []} for i in range(1001)]
    content = json.dumps({"objects": objects})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_error.assert_called_once()
    assert conn.send_error.call_args[0][1] == "too_many"


# Line 298: ws_import_json — task with invalid interval_days (< 1) is sanitized
async def test_json_import_sanitizes_invalid_interval_days(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: task with interval_days=0 has that field dropped (sanitized)."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    content = json.dumps({"objects": [{
        "object": {"name": "Sanitize Test"},
        "tasks": [{
            "name": "Bad interval",
            "interval_days": 0,  # invalid — must be dropped
        }],
    }]})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1


# Lines 328, 334-335: ws_import_json — task with invalid schedule_time stripped
async def test_json_import_sanitizes_invalid_schedule_time(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: task with bad schedule_time (not HH:MM) has it dropped."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    content = json.dumps({"objects": [{
        "object": {"name": "SchedTime Test"},
        "tasks": [{
            "name": "Bad schedule_time",
            "schedule_time": "99:99",  # invalid
        }],
    }]})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1


# Line 338: ws_import_json — task with out-of-range warning_days replaced by default
async def test_json_import_sanitizes_warning_days(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: task with warning_days=999 is clamped to the default."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    content = json.dumps({"objects": [{
        "object": {"name": "WarningDays Test"},
        "tasks": [{
            "name": "Bad warning days",
            "warning_days": 999,
        }],
    }]})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1


# Line 346: ws_import_json — task checklist with non-list value is dropped
async def test_json_import_sanitizes_non_list_checklist(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_import_json: checklist that is not a list is silently dropped."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    content = json.dumps({"objects": [{
        "object": {"name": "Checklist Test"},
        "tasks": [{
            "name": "Checklist task",
            "checklist": "not a list",
        }],
    }]})

    await call_ws_handler(ws_import_json, hass, conn, {
        "id": 1, "type": "maintenance_supporter/json/import",
        "json_content": content,
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["created"] == 1


# Lines 457-459: ws_batch_generate_qr — empty result set (no tasks match)
async def test_batch_qr_empty_result(
    hass: HomeAssistant, covws_global_entry: MockConfigEntry,
) -> None:
    """ws_batch_generate_qr: filtering yields 0 targets → empty result."""
    await setup_integration(hass, covws_global_entry)
    conn = _covws_conn()

    await call_ws_handler(ws_batch_generate_qr, hass, conn, {
        "id": 1, "type": "maintenance_supporter/qr/batch_generate",
        "entry_ids": ["nonexistent_entry"],
        "actions": ["complete"],
    })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    assert result["total"] == 0
    assert result["qrs"] == []


# Lines 591-595: ws_batch_generate_qr — URL build raises ValueError (no HA URL)
async def test_batch_qr_skips_on_url_error(
    hass: HomeAssistant,
    covws_global_entry: MockConfigEntry,
    covws_object_entry: MockConfigEntry,
) -> None:
    """ws_batch_generate_qr: ValueError from build_qr_url skips that row."""
    await setup_integration(hass, covws_global_entry, covws_object_entry)
    conn = _covws_conn()

    with patch(
        "custom_components.maintenance_supporter.websocket.io.build_qr_url",
        side_effect=ValueError("no URL"),
    ):
        await call_ws_handler(ws_batch_generate_qr, hass, conn, {
            "id": 1, "type": "maintenance_supporter/qr/batch_generate",
            "actions": ["complete"],
        })

    conn.send_result.assert_called_once()
    result = conn.send_result.call_args[0][1]
    # All rows were skipped due to ValueError — total is 0
    assert result["total"] == 0


# ─── ws_import_json: task filtering / sanitisation ────────────────────────


async def test_ws_import_json_empty_task_name_skipped(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_json skips tasks with empty/blank names."""
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, global_entry)

    json_data = {
        "version": 1,
        "objects": [
            {
                "object": {"name": "Test Object"},
                "tasks": [
                    {"name": ""},          # empty → skipped
                    {"name": "   "},       # blank → skipped
                    {"name": "Valid Task", "schedule_type": "time_based"},  # kept
                ],
            }
        ],
    }

    conn = _mock_connection()
    msg = {"id": 1, "json_content": json.dumps(json_data)}
    await call_ws_handler(ws_import_json, hass, conn, msg)

    assert conn.send_error.call_count == 0
    assert conn.send_result.call_count == 1
    payload = conn.send_result.call_args[0][1]
    # 1 entry created (count)
    assert payload.get("created") == 1
    # "imported" contains entry details
    imported = payload.get("imported", [])
    assert len(imported) == 1
    # Only 1 valid task created (the other 2 were skipped)
    assert imported[0]["task_count"] == 1


async def test_ws_import_json_invalid_interval_dropped(
    hass: HomeAssistant, global_entry: MockConfigEntry,
) -> None:
    """ws_import_json drops interval_days when it is not a positive integer."""
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, global_entry)

    json_data = {
        "version": 1,
        "objects": [
            {
                "object": {"name": "Pump 2"},
                "tasks": [
                    {
                        "name": "Bad Interval Task",
                        "interval_days": 0,   # invalid (<1) → should be dropped
                    },
                ],
            }
        ],
    }

    conn = _mock_connection()
    msg = {"id": 1, "json_content": json.dumps(json_data)}
    await call_ws_handler(ws_import_json, hass, conn, msg)

    assert conn.send_error.call_count == 0
    payload = conn.send_result.call_args[0][1]
    assert payload.get("created") == 1  # count of created entries
    imported = payload.get("imported", [])
    assert len(imported) == 1

    # Verify the imported entry's task has no interval_days
    imported_entry_id = imported[0]["entry_id"]
    imported_entry = hass.config_entries.async_get_entry(imported_entry_id)
    assert imported_entry is not None
    tasks = imported_entry.data.get(CONF_TASKS, {})
    assert len(tasks) == 1
    imported_task = list(tasks.values())[0]
    assert "interval_days" not in imported_task


# ─── ws_generate_qr: no_url error on ValueError ───────────────────────────


async def test_ws_qr_generate_no_url_error(
    hass: HomeAssistant, global_entry: MockConfigEntry, object_entry: MockConfigEntry,
) -> None:
    """QR generate returns no_url error when build_qr_url raises ValueError."""
    from custom_components.maintenance_supporter.websocket.io import ws_generate_qr

    await setup_integration(hass, global_entry, object_entry)

    conn = _mock_connection()
    msg = {
        "id": 1,
        "entry_id": object_entry.entry_id,
        "task_id": TASK_ID_1,
        "action": "view",
        "url_mode": "server",
    }

    with patch(
        "custom_components.maintenance_supporter.websocket.io.build_qr_url",
        side_effect=ValueError("No URL configured"),
    ):
        await call_ws_handler(ws_generate_qr, hass, conn, msg)

    assert conn.send_error.call_count == 1
    err = conn.send_error.call_args[0]
    assert err[1] == "no_url"
    assert "No URL" in err[2]
