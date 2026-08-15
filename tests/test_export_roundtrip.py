"""Tripwires from the 2026-08 export/import round-trip audit.

Three pins:
- JSON export → import round-trips EVERY portable field (a field added to one
  side but not the other fails here — the class that silently lost
  required_completion_fields until v2.57).
- CSV export → import round-trips the object notes + documentation URL (the
  import read ``object_notes``/``object_documentation_url`` from day one, but
  the export never wrote the columns).
- The settings export (the SECOND export; audit decision 2026-08-15) carries
  the global scope the objects export deliberately excludes, drops the
  instance-bound keys, and re-imports through the shared validation.
"""

from __future__ import annotations

import json

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    STORES_CACHE_KEY,
)
from custom_components.maintenance_supporter.export import build_export_data, build_settings_export
from custom_components.maintenance_supporter.websocket.io import ws_import_csv, ws_import_json

from .conftest import (
    build_global_entry_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)


@pytest.fixture
def global_entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=build_global_entry_data(),
        unique_id=GLOBAL_UNIQUE_ID,
    )
    entry.add_to_hass(hass)
    return entry


# The user-assignment cluster (responsible_user_id / assignee_pool /
# rotation_strategy) round-trips only when the HA user ids exist on the
# TARGET instance — the deliberate orphaned-user sweep prunes them at setup
# otherwise — so it is exercised elsewhere and skipped here.
FULL_TASK = {
    "name": "Full field probe",
    "type": "inspection",
    "enabled": True,
    "schedule_type": "time_based",
    "interval_days": 90,
    "interval_unit": "weeks",
    "interval_anchor": "planned",
    "warning_days": 9,
    "last_performed": "2026-06-01",
    "notes": "task notes",
    "documentation_url": "https://example.org/manual",
    "custom_icon": "mdi:test-tube",
    "nfc_tag_id": "nfc-123",
    "required_completion_fields": ["cost"],
    "earliest_completion_days": 3,
    "priority": "high",
    "labels": ["alpha", "beta"],
    "checklist": ["step1", "step2"],
    "schedule_time": "07:30",
    "reading_unit": "kWh",
    "due_override": "2026-12-24",
    "on_complete_action": {"service": "light.turn_off", "target": {"entity_id": "light.x"}},
    "quick_complete_defaults": {"notes": "qc", "cost": 5},
    "consumes_parts": [{"part_id": "part_a", "quantity": 2}],
    "history": [
        {
            "timestamp": "2026-05-01T10:00:00",
            "type": "completed",
            "notes": "hist",
            "cost": 12.5,
            "duration": 30,
            "completed_by": "Ingo",
            "used_parts": [{"part_id": "part_a", "name": "Filter", "quantity": 2}],
        }
    ],
}

FULL_OBJECT = {
    "name": "Roundtrip Rig",
    "manufacturer": "Acme",
    "model": "X1",
    "serial_number": "SN-1",
    "area_id": "workshop",
    "installation_date": "2024-01-15",
    "warranty_expiry": "2027-01-15",
    "documentation_url": "https://example.org/obj",
    "notes": "object notes",
    "paused_at": "2026-08-01T00:00:00+00:00",
    "paused_until": "2026-10-01",
}

FULL_PART = {
    "id": "part_a",
    "name": "Filter",
    "mpn": "F-1",
    "vendor": "Acme",
    "storage_location": "Shelf 2",
    "unit": "pcs",
    "cost": 3.5,
    "reorder_threshold": 2,
    "restock_quantity": 5,
}


async def _make_source_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = dict(build_task_data(), **FULL_TASK)
    data = build_object_entry_data(tasks={task["id"]: task})
    data = {**data, "object": {**data["object"], **FULL_OBJECT}, "parts": {"part_a": dict(FULL_PART)}}
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Roundtrip Rig",
        data=data,
        unique_id="maintenance_supporter_roundtrip_rig",
    )
    entry.add_to_hass(hass)
    return entry


def _get_imported(hass: HomeAssistant, name: str) -> MockConfigEntry:
    return next(
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.unique_id != GLOBAL_UNIQUE_ID and (e.data.get("object") or {}).get("name") == name
    )


async def test_json_full_field_roundtrip(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    src = await _make_source_entry(hass)
    await setup_integration(hass, global_entry, src)
    store = hass.data[STORES_CACHE_KEY][src.entry_id]
    store.set_part_stock("part_a", 7)
    task_id = next(iter(src.data[CONF_TASKS]))
    store.set_checklist_progress(task_id, {"step1": True})
    await store.async_save()

    export = build_export_data(hass)
    payload = json.loads(json.dumps(export))
    payload["objects"][0]["object"]["name"] = "Rig Copy"

    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(payload)})
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()

    dst = _get_imported(hass, "Rig Copy")
    new_task_id = next(iter(dst.data[CONF_TASKS]))
    src_task = {**src.data[CONF_TASKS][task_id]}
    dst_task = {**dst.data[CONF_TASKS][new_task_id]}

    diffs: list[str] = []
    for key, want in FULL_OBJECT.items():
        if key != "name" and (dst.data.get("object") or {}).get(key) != want:
            diffs.append(f"object.{key}")
    skip = {"name", "history", "consumes_parts", "due_override", "last_performed",
            "interval_days", "interval_unit", "interval_anchor", "schedule_type"}
    for key, want in FULL_TASK.items():
        if key not in skip and dst_task.get(key) != want:
            diffs.append(f"task.{key}: {dst_task.get(key)!r}")
    from custom_components.maintenance_supporter.helpers.schedule import read_legacy_fields

    src_sched, dst_sched = read_legacy_fields(src_task), read_legacy_fields(dst_task)
    for key in ("schedule_type", "interval_days", "interval_unit", "interval_anchor"):
        if src_sched[key] != dst_sched[key]:
            diffs.append(f"schedule.{key}")
    new_parts = dst.data.get("parts") or {}
    links = dst_task.get("consumes_parts") or []
    if not (len(links) == 1 and links[0]["part_id"] in new_parts and links[0]["quantity"] == 2):
        diffs.append("task.consumes_parts remap")
    if new_parts:
        got_part = next(iter(new_parts.values()))
        for key in ("name", "mpn", "vendor", "storage_location", "unit", "cost", "reorder_threshold", "restock_quantity"):
            if got_part.get(key) != FULL_PART[key]:
                diffs.append(f"part.{key}")
    else:
        diffs.append("parts lost")

    dst_store = hass.data[STORES_CACHE_KEY][dst.entry_id]
    if new_parts and dst_store.get_part_stock(next(iter(new_parts))) != 7:
        diffs.append("part stock")
    state = dst_store.get_task_state(new_task_id)
    if state.get("checklist_progress") != {"step1": True}:
        diffs.append("checklist_progress")
    if state.get("last_performed", dst_task.get("last_performed")) != "2026-06-01":
        diffs.append("last_performed")
    if state.get("due_override", dst_task.get("due_override")) != "2026-12-24":
        diffs.append("due_override")
    hist = dst_store.get_history(new_task_id) or dst_task.get("history") or []
    if not hist:
        diffs.append("history lost")
    else:
        h = hist[0]
        diffs += [f"history.{k}" for k in ("timestamp", "type", "notes", "cost", "duration", "completed_by")
                  if h.get(k) != FULL_TASK["history"][0][k]]
        used = h.get("used_parts") or []
        if not (used and used[0].get("part_id") in new_parts and used[0].get("quantity") == 2):
            diffs.append("history.used_parts remap")

    assert not diffs, "JSON round-trip losses: " + ", ".join(diffs)


async def test_csv_roundtrip_keeps_object_notes_and_docs_url(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    src = await _make_source_entry(hass)
    await setup_integration(hass, global_entry, src)
    from custom_components.maintenance_supporter.helpers.csv_handler import export_objects_csv

    csv_text = export_objects_csv(hass).replace("Roundtrip Rig", "Csv Copy")
    conn = make_ws_connection()
    await call_ws_handler(ws_import_csv, hass, conn, {"id": 1, "type": "x", "csv_content": csv_text})
    assert not conn.send_error.called, conn.send_error.call_args
    await hass.async_block_till_done()

    dst = _get_imported(hass, "Csv Copy")
    obj = dst.data.get("object") or {}
    for key in ("manufacturer", "model", "serial_number", "area_id", "installation_date",
                "warranty_expiry", "documentation_url", "notes"):
        assert obj.get(key) == FULL_OBJECT[key], f"CSV lost object.{key}"
    dst_task = next(iter(dst.data[CONF_TASKS].values()))
    for key in ("notes", "documentation_url", "custom_icon", "nfc_tag_id", "reading_unit", "schedule_time"):
        assert dst_task.get(key) == FULL_TASK[key], f"CSV lost task.{key}"


async def test_settings_export_import_roundtrip(hass: HomeAssistant, global_entry: MockConfigEntry) -> None:
    """The second export: global scope round-trips, instance-bound keys don't."""
    await setup_integration(hass, global_entry)
    hass.config_entries.async_update_entry(
        global_entry,
        options={
            **dict(global_entry.options or {}),
            "default_warning_days": 14,
            "panel_title": "Wartung HQ",
            "notifications_enabled": True,
            "notification_bundling_enabled": True,
            "groups": {"g1": {"name": "Heating", "description": "Season", "task_refs": [{"entry_id": "e1", "task_id": "t1"}]}},
            "saved_filter_views": [{"id": "v1", "name": "Overdue only", "filters": {"status": ["overdue"]}}],
            "vacation_enabled": True,
            "vacation_start": "2026-09-01",
            "vacation_end": "2026-09-15",
            "vacation_buffer_days": 3,
            "vacation_exempt_task_ids": ["keep-me"],
            # Instance-bound — must NOT export.
            "admin_panel_user_ids": ["ha-user-1"],
            "adopted_task_notes": {"binary_sensor.x": {"notes": "stash"}},
        },
    )

    payload = build_settings_export(hass)
    settings = payload["global_settings"]
    assert settings["default_warning_days"] == 14
    assert settings["panel_title"] == "Wartung HQ"
    assert settings["groups"]["g1"]["name"] == "Heating"
    assert settings["saved_filter_views"][0]["name"] == "Overdue only"
    assert settings["vacation_start"] == "2026-09-01"
    assert "admin_panel_user_ids" not in settings
    assert "adopted_task_notes" not in settings

    # Wipe the global scope, then restore via the regular import command.
    hass.config_entries.async_update_entry(global_entry, options={})
    conn = make_ws_connection()
    await call_ws_handler(
        ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(payload)}
    )
    assert not conn.send_error.called, conn.send_error.call_args
    resp = conn.send_result.call_args[0][1]
    assert "default_warning_days" in resp.get("settings_applied", [])

    opts = global_entry.options
    assert opts["default_warning_days"] == 14
    assert opts["panel_title"] == "Wartung HQ"
    assert opts["notification_bundling_enabled"] is True
    assert opts["groups"]["g1"]["task_refs"] == [{"entry_id": "e1", "task_id": "t1"}]
    assert opts["saved_filter_views"][0]["name"] == "Overdue only"
    assert opts["vacation_enabled"] is True
    assert opts["vacation_end"] == "2026-09-15"
    assert opts["vacation_exempt_task_ids"] == ["keep-me"]
    assert "admin_panel_user_ids" not in opts
    assert "adopted_task_notes" not in opts
