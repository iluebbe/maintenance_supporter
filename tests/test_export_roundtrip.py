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
    "entity_slug": "full_field_probe",
    "adaptive_config": {"enabled": True, "ewa_alpha": 0.3, "min_interval_days": 7, "max_interval_days": 120},
    "reading_unit": "kWh",
    "due_override": "2026-12-24",
    "on_complete_action": {"service": "light.turn_off", "target": {"entity_id": "light.x"}},
    "quick_complete_defaults": {"notes": "qc", "cost": 5},
    "consumes_parts": [{"part_id": "part_a", "quantity": 2}],
    # #139: phases round-trip; the cursor is Store-merged on export and
    # clamped against the imported sequence on import.
    "phases": {
        "flip": {"name": "Flip", "checklist": ["loosen", "flip"]},
        "replace": {
            "name": "Replace",
            "consumes_parts": [{"part_id": "part_a", "quantity": 4}],
            "required_completion_fields": ["cost"],
        },
    },
    "phase_sequence": ["flip", "flip", "replace"],
    "phase_cursor": 1,
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


def _full_trigger_config() -> dict:
    """A trigger_config exercising EVERY WS-allowlisted key (source-derived).

    The JSON import runs trigger_config through ``_validate_trigger_config``,
    which STRIPS keys missing from ``_TRIGGER_ALLOWED_KEYS`` — the silent-loss
    class that bit ``required_completion_fields`` in v2.57. Deriving this
    probe from the allowlist means a new trigger key breaks this test until a
    dummy value is added here, and the roundtrip below then proves the import
    keeps it. Values respect the validator's normalisations (states lowercase,
    recovery flag truthy, threshold needs one limit).
    """
    from custom_components.maintenance_supporter.websocket.tasks_validation import (
        _TRIGGER_ALLOWED_KEYS,
    )

    dummies: dict = {
        "type": "threshold",
        "entity_id": "sensor.probe",
        "entity_ids": ["sensor.probe"],
        "entity_logic": "any",
        "attribute": "level",
        "trigger_above": 80.0,
        "trigger_below": 10.0,
        "trigger_equals": 3.0,
        "trigger_not_equals": 1.0,
        "trigger_for_minutes": 5,
        "trigger_target_value": 100.0,
        "trigger_delta_mode": True,
        "trigger_baseline_value": 40.0,
        "trigger_runtime_hours": 500,
        "trigger_on_states": ["on"],
        "trigger_from_state": "running",
        "trigger_to_state": "clean",
        "trigger_target_changes": 30,
        "compound_logic": "AND",
        "conditions": [{"type": "threshold", "entity_id": "sensor.sub", "trigger_above": 1}],
        "auto_complete_on_recovery": True,
        "trigger_combinator": "all",
    }
    missing = _TRIGGER_ALLOWED_KEYS - set(dummies)
    assert not missing, (
        f"New trigger_config key(s) {sorted(missing)} have no dummy value here — "
        "add one so the export/import roundtrip proves the import keeps them."
    )
    return dummies


async def _make_source_entry(hass: HomeAssistant) -> MockConfigEntry:
    task = dict(build_task_data(), **FULL_TASK, trigger_config=_full_trigger_config())
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
    # adaptive_config migrates into the Store on first setup (a
    # _DYNAMIC_TASK_FIELDS member) — checked below via the Store, like
    # last_performed / due_override.
    skip = {"name", "history", "consumes_parts", "due_override", "last_performed",
            "adaptive_config", "interval_days", "interval_unit", "interval_anchor", "schedule_type",
            # #139: phases carry a remapped part link (checked below);
            # the cursor migrates into the Store on first setup.
            "phases", "phase_cursor"}
    for key, want in FULL_TASK.items():
        if key not in skip and dst_task.get(key) != want:
            diffs.append(f"task.{key}: {dst_task.get(key)!r}")
    from custom_components.maintenance_supporter.helpers.schedule import read_legacy_fields

    src_sched, dst_sched = read_legacy_fields(src_task), read_legacy_fields(dst_task)
    for key in ("schedule_type", "interval_days", "interval_unit", "interval_anchor", "due_date"):
        if src_sched[key] != dst_sched[key]:
            diffs.append(f"schedule.{key}")
    new_parts = dst.data.get("parts") or {}
    links = dst_task.get("consumes_parts") or []
    if not (len(links) == 1 and links[0]["part_id"] in new_parts and links[0]["quantity"] == 2):
        diffs.append("task.consumes_parts remap")
    # #139: phase defs survive with the replace-phase's part link remapped to
    # the regenerated id; the flip phase must arrive verbatim.
    dst_phases = dst_task.get("phases") or {}
    if dst_phases.get("flip") != FULL_TASK["phases"]["flip"]:
        diffs.append(f"task.phases.flip: {dst_phases.get('flip')!r}")
    rep = dst_phases.get("replace") or {}
    rep_links = rep.get("consumes_parts") or []
    if not (
        rep.get("name") == "Replace"
        and rep.get("required_completion_fields") == ["cost"]
        and len(rep_links) == 1
        and rep_links[0]["part_id"] in new_parts
        and rep_links[0]["quantity"] == 4
    ):
        diffs.append(f"task.phases.replace remap: {rep!r}")
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
    if state.get("adaptive_config", dst_task.get("adaptive_config")) != FULL_TASK["adaptive_config"]:
        diffs.append("adaptive_config")
    # #139: the cursor is a dynamic field — Store after first setup.
    if state.get("phase_cursor", dst_task.get("phase_cursor")) != 1:
        diffs.append(f"phase_cursor: {state.get('phase_cursor', dst_task.get('phase_cursor'))!r}")
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

    # trigger_config: compare KEY SETS (the import normalises values — states
    # lowercase etc.), asserting no allowlisted key was stripped on the way in.
    src_tc = src_task.get("trigger_config") or {}
    dst_tc = dst_task.get("trigger_config") or {}
    lost_tc = set(src_tc) - set(dst_tc)
    if lost_tc:
        diffs.append(f"trigger_config keys stripped by import: {sorted(lost_tc)}")

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
    for key in ("notes", "documentation_url", "custom_icon", "nfc_tag_id", "reading_unit",
                "schedule_time", "priority", "labels"):
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
            "saved_filter_views": [{"id": "v1", "name": "Overdue only", "filters": {"status": ["overdue"], "priority": "high"}}],
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
    # #134: the priority filter dimension survives export -> wipe -> import.
    assert opts["saved_filter_views"][0]["filters"]["priority"] == "high"
    assert opts["vacation_enabled"] is True
    assert opts["vacation_end"] == "2026-09-15"
    assert opts["vacation_exempt_task_ids"] == ["keep-me"]
    assert "admin_panel_user_ids" not in opts
    assert "adopted_task_notes" not in opts


# ─── Export parity contracts (#134 audit) ───────────────────────────────────
#
# WHY these exist: every export surface used to be a hand-maintained field
# list (JSON builder, import mirror, CSV columns, and the FULL_TASK probe
# above) with nothing diffing them against each other — a new persisted field
# only round-tripped if someone remembered every list. These contracts anchor
# the chain on the RUNTIME export payload: any new exported field must either
# join the roundtrip probe (proving import parity) or be explicitly exempted
# here with a reason. Forgetting is no longer silent.

# Export keys that are deliberately NOT part of the FULL_TASK roundtrip probe.
_TASK_EXPORT_EXEMPT = {
    "id",  # regenerated on import by design
    # Computed at export time from coordinator state — never imported:
    "status", "days_until_due", "next_due",
    "times_performed", "total_cost", "average_duration",
    # Model-managed lifecycle stamps (created_at is the next_due fallback
    # anchor; archived_* keep retired tasks retired — both in the import
    # mirror, exercised by the archive/lifecycle test suites):
    "created_at", "archived_at", "archived_reason",
    "last_planned_due",  # planned-anchor bookkeeping, written by complete()
    "due_date",  # flat twin of the nested schedule, compared via read_legacy_fields
    "schedule",  # nested twin of the flat schedule fields compared above
    # The user cluster IS in the import mirror, but non-existent HA users are
    # deliberately pruned by the orphan sweep at setup (same reason the
    # settings roundtrip skips them) — unprobeable in a test hass:
    "responsible_user_id", "assignee_pool", "rotation_strategy",
    "checklist_progress",  # Store-side; asserted separately in the roundtrip
    "part_ref",  # auto-buy marker; covered by the parts/buy-task tests
    "trigger_config",  # key-set-compared separately (import normalises values)
}


async def test_full_task_probe_covers_every_exported_field(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Tripwire: a new field in the JSON task export MUST join FULL_TASK (so
    the roundtrip proves the import mirrors it) or be exempted with a reason."""
    src = await _make_source_entry(hass)
    await setup_integration(hass, global_entry, src)

    export = build_export_data(hass)
    exported_task = export["objects"][0]["tasks"][0]

    uncovered = set(exported_task) - set(FULL_TASK) - _TASK_EXPORT_EXEMPT
    assert not uncovered, (
        f"Exported task field(s) {sorted(uncovered)} are not in the FULL_TASK "
        "roundtrip probe — add them there (and to the import mirror in "
        "websocket/io.py) or exempt them above with a reason."
    )
    stale = _TASK_EXPORT_EXEMPT - set(exported_task)
    assert not stale, f"Exempt entries no longer exported: {sorted(stale)}"


# CSV deliberately carries the human-readable asset/task basics, one row per
# task. Everything below is EXCLUDED ON PURPOSE — structured/nested data that
# doesn't fit a flat cell, instance-specific ids, or computed display state.
# A new exported field must be placed in the CSV columns or in this list.
_CSV_TASK_EXCLUDED = {
    "id", "created_at", "archived_at", "archived_reason",  # lifecycle/ids
    "schedule", "last_planned_due", "due_override",  # nested/derived schedule
    "adaptive_config", "checklist_progress", "history",  # structured state
    "on_complete_action", "quick_complete_defaults",  # nested service configs
    "assignee_pool", "rotation_strategy",  # multi-user config (JSON backup)
    "required_completion_fields", "earliest_completion_days",  # niche gates
    "entity_slug",  # instance-specific entity naming
    "consumes_parts", "part_ref",  # part links (ids are instance-specific)
    # #139: nested defs + cycle + Store cursor — structured state that doesn't
    # fit a flat cell; the JSON backup round-trips all three.
    "phases", "phase_sequence", "phase_cursor",
    "trigger_config",  # only the type is summarised (trigger_type column)
    "days_until_due", "next_due", "average_duration",  # computed display
}
_CSV_OBJECT_EXCLUDED = {
    # Instance-specific ids/lineage — meaningless in a spreadsheet migration:
    "ha_device_id", "parent_entry_id",
    "predecessor_entry_id", "replaced_by_entry_id",
    "paused_at", "paused_until",  # seasonal pause state (JSON backup carries it)
}


async def test_csv_covers_or_excludes_every_exported_field(
    hass: HomeAssistant, global_entry: MockConfigEntry
) -> None:
    """Tripwire: every JSON-exported field is either a CSV column or a
    documented CSV exclusion — losing one silently (the priority/labels class)
    now fails here."""
    from custom_components.maintenance_supporter.helpers.csv_handler import _COLUMNS

    src = await _make_source_entry(hass)
    await setup_integration(hass, global_entry, src)
    export = build_export_data(hass)
    exported_task = export["objects"][0]["tasks"][0]
    exported_object = export["objects"][0]["object"]

    csv_task_cols = {c for c in _COLUMNS if not c.startswith("object_")}
    # JSON name -> CSV column where they differ:
    renames = {"name": "task_name", "type": "task_type"}
    unplaced = {
        k for k in exported_task
        if renames.get(k, k) not in csv_task_cols and k not in _CSV_TASK_EXCLUDED
    }
    assert not unplaced, (
        f"Task field(s) {sorted(unplaced)} are neither a CSV column nor a "
        "documented exclusion — add a column + import reader in "
        "helpers/csv_handler.py, or exclude them above with a reason."
    )

    csv_obj_cols = {c.removeprefix("object_") for c in _COLUMNS if c.startswith("object_")}
    unplaced_obj = {
        k for k in exported_object if k not in csv_obj_cols and k not in _CSV_OBJECT_EXCLUDED
    }
    assert not unplaced_obj, (
        f"Object field(s) {sorted(unplaced_obj)} are neither a CSV column nor "
        "a documented exclusion."
    )
