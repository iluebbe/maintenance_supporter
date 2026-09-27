"""DRY audit 2026-09-26, section B (backend runtime) — tripwires and parity.

Each consolidation got ONE home; these tests pin that the copies stay gone
(source scans) and that the shared helpers keep the contracts their former
copies had (build → parse round trips, parity between twins). The drift bugs
found while consolidating have their regression tests here too.
"""

from __future__ import annotations

import ast
import re
from datetime import timedelta
from pathlib import Path
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.maintenance_supporter.const import (
    CONF_OBJECT,
    CONF_TASKS,
    DOMAIN,
    NOTIFIABLE_STATUSES,
    ScheduleType,
)
from custom_components.maintenance_supporter.helpers.aggregate import (
    PRIORITY_RANK,
    iter_live_tasks,
    object_slug,
    priority_rank,
    task_sensor_entity_id,
)
from custom_components.maintenance_supporter.helpers.notification_ids import (
    DIGEST_TAG,
    PANEL_PATH,
    QUIET_END_TAG,
    WARRANTY_TAG,
    action_id,
    budget_tag,
    bundle_tag,
    panel_url,
    parse_action_id,
    parse_panel_url,
    task_tag,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_object_data,
    build_task_data,
    make_global_entry,
    make_object_entry,
    setup_integration,
)

COMPONENT = Path(__file__).parent.parent / "custom_components" / "maintenance_supporter"


def _py_sources() -> list[Path]:
    return sorted(p for p in COMPONENT.rglob("*.py") if "__pycache__" not in p.parts)


def _rel(path: Path) -> str:
    return path.relative_to(COMPONENT).as_posix()


def _due_in(days: int, name: str, task_id: str = TASK_ID_1) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=30 - days)).isoformat()
    return build_task_data(task_id=task_id, name=name, last_performed=last, interval_days=30)


# ─── cross-object task walk ──────────────────────────────────────────────


async def test_list_tasks_and_assist_snapshot_walk_the_same_tasks(hass: HomeAssistant) -> None:
    """The ``list_tasks`` service and the Assist snapshot share
    ``aggregate.iter_live_tasks``: same rows, archived tasks and unloaded
    objects left out, the entry filter narrowing to one object."""
    from custom_components.maintenance_supporter.intent import _task_snapshot

    g = make_global_entry(hass)
    archived = _due_in(-3, "Old Pump Check", TASK_ID_2)
    archived["archived_at"] = dt_util.now().isoformat()
    pool = make_object_entry(hass, tasks={TASK_ID_1: _due_in(-3, "Filter"), TASK_ID_2: archived}, name="Pool", uid="walk_pool")
    car = make_object_entry(hass, tasks={TASK_ID_1: _due_in(20, "Oil")}, name="Car", uid="walk_car")
    await setup_integration(hass, g, pool, car)

    walked = {(e.entry_id, tid) for e, tid, _t in iter_live_tasks(hass)}
    assert walked == {(pool.entry_id, TASK_ID_1), (car.entry_id, TASK_ID_1)}
    assert {(e.entry_id, tid) for e, tid, _t in iter_live_tasks(hass, car.entry_id)} == {(car.entry_id, TASK_ID_1)}

    response = await hass.services.async_call(DOMAIN, "list_tasks", {}, blocking=True, return_response=True)
    assert response is not None
    service_rows = {(r["entry_id"], r["task_id"]) for r in response["tasks"]}  # type: ignore[union-attr]
    assert service_rows == walked
    assert {(r["entry_id"], r["task_id"]) for r in _task_snapshot(hass)} == walked

    one = await hass.services.async_call(DOMAIN, "list_tasks", {"entry_id": car.entry_id}, blocking=True, return_response=True)
    assert [r["name"] for r in one["tasks"]] == ["Oil"]  # type: ignore[index]


async def test_assist_snapshot_names_an_unnamed_object_like_list_tasks(hass: HomeAssistant) -> None:
    """Drift fix: the Assist copy read ``obj.get("name", title)`` and kept an
    EMPTY name, while ``list_tasks`` fell back to the entry title."""
    from custom_components.maintenance_supporter.intent import _task_snapshot

    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _due_in(-2, "Descale")}, name="", title="Coffee Machine", uid="walk_noname")
    await setup_integration(hass, g, obj)

    (row,) = _task_snapshot(hass)
    response = await hass.services.async_call(DOMAIN, "list_tasks", {}, blocking=True, return_response=True)
    (service_row,) = response["tasks"]  # type: ignore[index]
    assert row["object_name"] == service_row["object_name"] == "Coffee Machine"


def test_actionable_status_sets_are_the_shared_constant() -> None:
    """One set of "needs attention" statuses: the Assist list, the to-do
    mirror and our to-do platform used to spell their own."""
    from custom_components.maintenance_supporter import intent, todo
    from custom_components.maintenance_supporter.helpers import todo_mirror

    assert intent._ACTIONABLE is NOTIFIABLE_STATUSES
    assert todo_mirror.MIRRORED_STATUSES is NOTIFIABLE_STATUSES
    assert todo._ACTION_STATUSES is NOTIFIABLE_STATUSES
    assert {str(s) for s in NOTIFIABLE_STATUSES} == {"due_soon", "overdue", "triggered"}


def test_priority_rank_single_table() -> None:
    """High first, unknown/unset reads as normal — one table for the daily
    limit and the Assist ordering (the intent kept an inline copy)."""
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager

    assert [priority_rank(p) for p in ("high", "normal", "low", None, "", "bogus")] == [0, 1, 2, 1, 1, 1]
    rank: Any = NotificationManager._priority_rank
    assert rank({"priority": "high"}) == PRIORITY_RANK["high"] == 0
    assert rank(None) == 1
    offenders = [
        _rel(p)
        for p in _py_sources()
        if _rel(p) != "helpers/aggregate.py" and re.search(r"""["']high["']\s*:\s*0""", p.read_text(encoding="utf-8"))
    ]
    assert not offenders, f"hand-written priority rank table in {offenders} — use aggregate.priority_rank"


# ─── the task sensor's entity id ─────────────────────────────────────────


def test_object_slug_is_the_platform_registration_rule() -> None:
    from custom_components.maintenance_supporter.const import slugify_object_name

    assert object_slug({"name": "Pool Pump"}) == "pool_pump"
    assert object_slug({}) == "unknown"
    # An EMPTY name is slugged as such (a hash), exactly as the platforms
    # register it — not replaced by "unknown".
    assert object_slug({"name": ""}) == slugify_object_name("")
    assert object_slug({"name": None}) == "unknown"


async def test_every_task_sensor_lookup_finds_the_registered_sensor(hass: HomeAssistant) -> None:
    """Drift fix: the notification context mapped an EMPTY object name to
    "unknown", the coordinator a MISSING one to "" (the model's default) —
    the platforms register "" as "" and a missing name as "unknown", so each
    copy missed one kind of object's sensor."""
    from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_STATUS, notification_context
    from custom_components.maintenance_supporter.logbook import _task_entity_id

    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _due_in(-2, "Descale")}, name="", title="Coffee Machine", uid="lookup_noname")
    named = make_object_entry(hass, tasks={TASK_ID_1: _due_in(5, "Clean")}, name="Kettle", uid="lookup_named")
    nameless_data = build_object_data(object_id="d" * 32)
    del nameless_data["name"]
    nameless = make_object_entry(
        hass, tasks={TASK_ID_1: _due_in(5, "Rinse")}, title="Sink", uid="lookup_nokey", object_data=nameless_data
    )
    await setup_integration(hass, g, obj, named, nameless)

    registered = task_sensor_entity_id(hass, obj.data[CONF_OBJECT], TASK_ID_1)
    assert registered is not None and hass.states.get(registered) is not None
    coordinator = obj.runtime_data.coordinator
    assert coordinator.task_sensor_entity_id(TASK_ID_1) == registered
    ctx = notification_context(hass, KIND_STATUS, entry_id=obj.entry_id, task_id=TASK_ID_1)
    assert ctx["sensor_entity_id"] == registered
    response = await hass.services.async_call(
        DOMAIN, "list_tasks", {"entry_id": obj.entry_id}, blocking=True, return_response=True
    )
    assert response["tasks"][0]["entity_id"] == registered  # type: ignore[index]
    # An object stored without a name key registers under "unknown".
    nokey_sensor = task_sensor_entity_id(hass, nameless.data[CONF_OBJECT], TASK_ID_1)
    assert nokey_sensor is not None and hass.states.get(nokey_sensor) is not None
    assert nameless.runtime_data.coordinator.task_sensor_entity_id(TASK_ID_1) == nokey_sensor
    # The logbook's fallback for old events (no entity_id carried).
    sensor = task_sensor_entity_id(hass, named.data[CONF_OBJECT], TASK_ID_1)
    assert sensor is not None
    assert _task_entity_id(hass, {"object_name": "Kettle", "task_id": TASK_ID_1}) == sensor


def test_task_sensor_registry_lookups_use_the_shared_helper() -> None:
    """``task_unique_id`` feeds registry LOOKUPS only through
    ``aggregate.task_entity_id`` (the platforms build their own unique ids
    with it — that is registration, not lookup). The WS summary builder is
    still pending its move (owned by the interfaces refactor)."""
    pending: set[str] = set()
    offenders = []
    for p in _py_sources():
        text = p.read_text(encoding="utf-8")
        if "async_get_entity_id(" in text and "task_unique_id(" in text and _rel(p) not in {"helpers/aggregate.py", *pending}:
            offenders.append(_rel(p))
    assert not offenders, f"inline task-sensor lookup in {offenders} — use aggregate.task_sensor_entity_id"


# ─── the primary trigger entity ──────────────────────────────────────────


def test_primary_entity_id_reads_the_plural_list() -> None:
    from custom_components.maintenance_supporter.entity.triggers import primary_entity_id

    assert primary_entity_id({"type": "threshold", "entity_ids": ["sensor.a", "sensor.b"]}) == "sensor.a"
    assert primary_entity_id({"type": "threshold", "entity_id": "sensor.a"}) == "sensor.a"
    assert primary_entity_id({"type": "compound", "conditions": [{"entity_id": "sensor.a"}]}) is None
    assert primary_entity_id({"type": "threshold"}) is None
    assert primary_entity_id(None) is None


async def test_plural_only_trigger_has_unit_and_trigger_entity(hass: HomeAssistant) -> None:
    """Drift fix: ``list_tasks``' unit and the notification context's
    ``trigger_entity_id`` read only the singular ``entity_id`` — a trigger
    stored with just ``entity_ids`` (catalog tasks) had neither."""
    from custom_components.maintenance_supporter.helpers.notify_hooks import KIND_STATUS, notification_context

    hass.states.async_set("sensor.filter_pressure", "1.2", {"unit_of_measurement": "bar"})
    task = build_task_data(
        name="Filter",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": "threshold", "entity_ids": ["sensor.filter_pressure"], "trigger_above": 3},
    )
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Pool", uid="plural_trigger")
    await setup_integration(hass, g, obj)
    # Stored with the plural list only — what the old readers missed.
    assert "entity_id" not in obj.data[CONF_TASKS][TASK_ID_1]["trigger_config"]

    response = await hass.services.async_call(DOMAIN, "list_tasks", {}, blocking=True, return_response=True)
    (row,) = response["tasks"]  # type: ignore[index]
    assert row["trigger_target"] == 3 and row["trigger_unit"] == "bar"
    ctx = notification_context(hass, KIND_STATUS, entry_id=obj.entry_id, task_id=TASK_ID_1)
    assert ctx["trigger_entity_id"] == "sensor.filter_pressure"


def test_diagnostics_walk_the_shared_entity_ids(hass: HomeAssistant) -> None:
    """Drift fix: diagnostics missed entities nested under a compound
    condition's ``trigger_config`` and flagged plural-only triggers as
    "has trigger config but no entity"."""
    from custom_components.maintenance_supporter.diagnostics import _check_data_quality, _check_trigger_status

    data = {
        CONF_OBJECT: {"name": "Pool"},
        CONF_TASKS: {
            "nested": {
                "name": "Nested",
                "trigger_config": {
                    "type": "compound",
                    "conditions": [
                        {"trigger_config": {"type": "threshold", "entity_id": "sensor.deep"}},
                        {"entity_id": "sensor.flat"},
                    ],
                },
            },
            "plural": {"name": "Plural", "trigger_config": {"type": "threshold", "entity_ids": ["sensor.plural"]}},
        },
    }
    assert {r["trigger_entity"] for r in _check_trigger_status(hass, data)} == {"sensor.deep", "sensor.flat", "sensor.plural"}
    assert not any("no entity" in w for w in _check_data_quality(data))


def test_legacy_runtime_split_keys_plural_only_triggers() -> None:
    from custom_components.maintenance_supporter.storage import legacy_runtime_to_trigger_state

    legacy = {"trigger_baseline_value": 20000}
    assert legacy_runtime_to_trigger_state({"type": "counter", "entity_ids": ["sensor.odo"]}, legacy) == {
        "sensor.odo": {"baseline_value": 20000}
    }
    assert legacy_runtime_to_trigger_state({"type": "counter", "entity_id": "sensor.odo"}, legacy) == {
        "sensor.odo": {"baseline_value": 20000}
    }
    assert legacy_runtime_to_trigger_state({"type": "compound", "conditions": []}, legacy) == {}


def test_entity_id_readers_use_normalize_entity_ids() -> None:
    """Runtime readers resolve a trigger's entities through
    ``normalize_entity_ids`` / ``primary_entity_id`` — not by reading the
    singular/plural keys by hand."""
    hand_rolled = re.compile(r"""\.get\(["']entity_ids["']\)\s*or\s*\(?\[[^\]]*["']entity_id["']""")
    offenders = [_rel(p) for p in _py_sources() if hand_rolled.search(p.read_text(encoding="utf-8"))]
    assert not offenders, f"hand-rolled entity_ids/entity_id fallback in {offenders}"


def test_trigger_fallback_uses_the_persisted_timestamp_parser() -> None:
    text = (COMPONENT / "helpers" / "trigger_fallback.py").read_text(encoding="utf-8")
    assert "parse_datetime(" not in text and "parse_persisted_utc(" in text


# ─── notification wire formats ───────────────────────────────────────────


@pytest.mark.parametrize("verb,kind", [("COMPLETE", "complete"), ("SKIP", "skip"), ("SNOOZE", "snooze")])
def test_action_id_round_trip(verb: str, kind: str) -> None:
    entry_id = "01JABCDEF0123456789XYZABCD"
    assert parse_action_id(action_id(verb, entry_id, TASK_ID_1)) == (kind, entry_id, TASK_ID_1)


def test_action_id_parser_rejects_what_is_not_a_task_button() -> None:
    assert parse_action_id(action_id("COMPLETE", None, None)) is None  # the Settings test send
    assert parse_action_id("OTHER_INTEGRATION_ACTION") is None
    assert parse_action_id("MS_UNKNOWN_x_y") is None
    assert parse_action_id(None) is None
    for malformed in ("MS_COMPLETE_", "MS_COMPLETE_short", "MS_SKIP__task", "MS_SNOOZE_entry_"):
        with pytest.raises(ValueError):
            parse_action_id(malformed)


def test_action_buttons_parse_back_to_their_task(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import (
        CONF_ACTION_COMPLETE_ENABLED,
        CONF_ACTION_SKIP_ENABLED,
        CONF_ACTION_SNOOZE_ENABLED,
    )
    from custom_components.maintenance_supporter.helpers.notification_manager import build_action_buttons

    options = {CONF_ACTION_COMPLETE_ENABLED: True, CONF_ACTION_SKIP_ENABLED: True, CONF_ACTION_SNOOZE_ENABLED: True}
    buttons = build_action_buttons(hass, options, "en", entry_id="01JENTRY", task_id=TASK_ID_1, skip_allowed=True)
    assert [parse_action_id(b["action"]) for b in buttons] == [
        ("complete", "01JENTRY", TASK_ID_1),
        ("skip", "01JENTRY", TASK_ID_1),
        ("snooze", "01JENTRY", TASK_ID_1),
    ]
    test_buttons = build_action_buttons(hass, options, "en", entry_id=None, task_id=None, skip_allowed=True)
    assert test_buttons and all(parse_action_id(b["action"]) is None for b in test_buttons)


def test_panel_url_round_trip() -> None:
    assert parse_panel_url(panel_url(entry_id="E1", task_id="T1")) == {"entry_id": "E1", "task_id": "T1"}
    assert parse_panel_url(panel_url(entry_id="E1")) == {"entry_id": "E1"}
    assert parse_panel_url(panel_url(tab="today")) == {"tab": "today"}
    assert panel_url() == PANEL_PATH and parse_panel_url(panel_url()) == {}
    assert parse_panel_url("/lovelace/0?entry_id=E1") == {}
    # The byte shapes the phones and automations have always received.
    assert panel_url(entry_id="E1", task_id="T1") == "/maintenance-supporter?entry_id=E1&task_id=T1"
    assert panel_url(tab="today") == "/maintenance-supporter?tab=today"


def test_tags_keep_their_wire_values() -> None:
    assert task_tag(TASK_ID_1) == f"maintenance_{TASK_ID_1}"
    assert bundle_tag("E1") == "maintenance_bundled_E1"
    assert budget_tag("monthly") == "maintenance_budget_monthly"
    assert (QUIET_END_TAG, DIGEST_TAG, WARRANTY_TAG) == (
        "maintenance_quiet_end",
        "maintenance_weekly_digest",
        "maintenance_warranty_reminder",
    )


def test_notification_formats_are_not_hand_built() -> None:
    """Action ids, deep links and tags are built only in
    helpers/notification_ids — the listener parses what the builder makes."""
    owner = "helpers/notification_ids.py"
    patterns = {
        "action id": re.compile(r"""["']MS_(?:COMPLETE|SKIP|SNOOZE|TEST)|f["']MS_\{"""),
        "deep link": re.compile(r"""["']/maintenance-supporter"""),
        "tag": re.compile(r"""\btag=f?["']maintenance_|tag\s*=\s*f["']maintenance_"""),
    }
    offenders = [
        f"{_rel(p)} ({what})"
        for p in _py_sources()
        if _rel(p) != owner
        for what, rx in patterns.items()
        if rx.search(p.read_text(encoding="utf-8"))
    ]
    assert not offenders, f"hand-built notification formats: {offenders}"


def test_bundle_and_quiet_summary_share_the_status_lines() -> None:
    from custom_components.maintenance_supporter.helpers import notification_manager as nm

    assert nm._bundled_line("overdue", "en", "Filter") == nm._notif_t("bundled_overdue", "en", task="Filter")
    assert nm._bundled_line("triggered", "en", "Filter") == nm._notif_t("bundled_triggered", "en", task="Filter")
    assert nm._bundled_line("weird", "en", "Filter") == nm._notif_t("bundled_due_soon", "en", task="Filter")
    text = (COMPONENT / "helpers" / "notification_manager.py").read_text(encoding="utf-8")
    assert len(re.findall(r'MaintenanceStatus\.OVERDUE:\s*"bundled_overdue"', text)) == 1, (
        "the status → line-key map is spelled once"
    )


# ─── task writes ─────────────────────────────────────────────────────────


async def test_repair_replace_writes_through_the_task_chokepoint(hass: HomeAssistant) -> None:
    """Drift fix: the trigger-replace repair wrote the task raw (the remove
    path normalized) — a flat legacy recurrence stayed flat."""
    from custom_components.maintenance_supporter.repairs import MissingTriggerEntityRepairFlow

    task = build_task_data(
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=30,
        trigger_config={"type": "threshold", "entity_id": "sensor.old", "trigger_above": 30.0},
    )
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Pool", uid="repair_chokepoint")
    await setup_integration(hass, g, obj)
    # A legacy flat recurrence landing in entry.data (import / old backup).
    flat = {k: v for k, v in obj.data[CONF_TASKS][TASK_ID_1].items() if k != "schedule"}
    flat.update({"schedule_type": "sensor_based", "interval_days": 30, "interval_unit": "days"})
    hass.config_entries.async_update_entry(obj, data={**obj.data, CONF_TASKS: {TASK_ID_1: flat}})

    flow = MissingTriggerEntityRepairFlow()
    flow.hass = hass
    flow.data = {
        "entry_id": obj.entry_id,
        "task_id": TASK_ID_1,
        "task_name": "Filter",
        "object_name": "Pool",
        "entity_id": "sensor.old",
    }
    result = await flow.async_step_replace_entity({"new_entity_id": "sensor.new"})
    assert result["type"] == "create_entry"

    stored = hass.config_entries.async_get_entry(obj.entry_id).data[CONF_TASKS][TASK_ID_1]  # type: ignore[union-attr]
    assert stored["trigger_config"]["entity_id"] == "sensor.new"
    assert isinstance(stored.get("schedule"), dict)
    assert "interval_days" not in stored


def test_runtime_modules_write_tasks_through_the_chokepoint() -> None:
    """The coordinator, the repairs and the fleet setup write single tasks via
    ``entry_tasks.write_task`` — no hand-rolled ``new_data[CONF_TASKS] = …``
    for one task."""
    single_task_write = re.compile(r"new_tasks\[task_id\]\s*=\s*new_task\b|tasks_data\[task_id\]\s*=\s*task_dict\b")
    for rel in ("coordinator.py", "repairs.py", "helpers/battery_fleet_setup.py"):
        text = (COMPONENT / rel).read_text(encoding="utf-8")
        assert not single_task_write.search(text), f"{rel}: single-task write bypasses entry_tasks.write_task"
    assert "_async_persist_tasks" not in (COMPONENT / "coordinator.py").read_text(encoding="utf-8")


# ─── global options ──────────────────────────────────────────────────────


def _registered_setting_constants() -> set[str]:
    tree = ast.parse((COMPONENT / "const.py").read_text(encoding="utf-8"))
    names = {
        node.targets[0].id
        for node in tree.body
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name)
    }
    registry = (COMPONENT / "helpers" / "settings_registry.py").read_text(encoding="utf-8")
    return {name for name in names if f"SettingSpec({name}," in registry}


def test_global_settings_are_read_without_hand_typed_defaults() -> None:
    """A registered global setting is read through ``global_option`` /
    ``entry_option`` (registry default) — not as
    ``get_global_options(hass).get(KEY, <default>)`` or
    ``entry.options.get(KEY, <default>)`` with the default typed again.

    ``pending`` lists sites in modules owned by the interfaces refactor."""
    registered = _registered_setting_constants()
    assert "CONF_PANEL_ENABLED" in registered  # the scan sees the registry
    pending: set[str] = set()
    offenders: list[str] = []
    for p in _py_sources():
        if _rel(p) in pending:
            continue
        for node in ast.walk(ast.parse(p.read_text(encoding="utf-8"))):
            if not (
                isinstance(node, ast.Call)
                and isinstance(node.func, ast.Attribute)
                and node.func.attr == "get"
                and len(node.args) == 2
                and isinstance(node.args[0], ast.Name)
                and node.args[0].id in registered
            ):
                continue
            receiver = node.func.value
            chained = isinstance(receiver, ast.Call) and ast.unparse(receiver.func).endswith("get_global_options")
            options_attr = isinstance(receiver, ast.Attribute) and receiver.attr == "options"
            if chained or options_attr:
                offenders.append(f"{_rel(p)}:{node.lineno} {ast.unparse(node)}")
    assert not offenders, f"hand-typed global-setting defaults: {offenders}"


async def test_entry_option_and_global_option_agree(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.const import CONF_PANEL_ENABLED, CONF_SNOOZE_DURATION_HOURS
    from custom_components.maintenance_supporter.helpers.global_options import entry_option, global_option
    from custom_components.maintenance_supporter.helpers.settings_registry import setting_default

    assert global_option(hass, CONF_SNOOZE_DURATION_HOURS) == setting_default(CONF_SNOOZE_DURATION_HOURS)
    g = make_global_entry(hass, options={CONF_SNOOZE_DURATION_HOURS: 9})
    assert entry_option(g, CONF_SNOOZE_DURATION_HOURS) == global_option(hass, CONF_SNOOZE_DURATION_HOURS) == 9
    assert entry_option(g, CONF_PANEL_ENABLED) == setting_default(CONF_PANEL_ENABLED)


# ─── to-do service wrappers ──────────────────────────────────────────────


def test_todo_service_calls_live_in_the_shared_wrappers() -> None:
    """``todo.*`` services are called only by the three module-level wrappers
    in helpers/todo_mirror (the shopping sync carried a byte-identical copy)."""
    shopping = ast.parse((COMPONENT / "shopping_sync.py").read_text(encoding="utf-8"))
    assert not [n for n in ast.walk(shopping) if isinstance(n, ast.Attribute) and n.attr == "async_call"]
    mirror = ast.parse((COMPONENT / "helpers" / "todo_mirror.py").read_text(encoding="utf-8"))
    callers = {
        fn.name
        for fn in ast.walk(mirror)
        if isinstance(fn, (ast.FunctionDef, ast.AsyncFunctionDef))
        and any(isinstance(n, ast.Attribute) and n.attr == "async_call" for n in ast.walk(fn))
    }
    assert callers == {"async_todo_get_items", "async_todo_add_item", "async_todo_remove_item"}


# ─── smaller twins ───────────────────────────────────────────────────────


def test_fresh_copy_strips_every_dynamic_task_field() -> None:
    """A fresh task copy (duplicate / replace) must not inherit any field the
    Store owns. ``_PENDING`` = dynamic fields the sanitiser does not strip
    yet (helpers/sanitize.py is owned by the interfaces refactor) — empty it
    once ``_FRESH_COPY_STRIP_KEYS`` carries them."""
    from custom_components.maintenance_supporter.helpers.sanitize import _FRESH_COPY_STRIP_KEYS
    from custom_components.maintenance_supporter.storage import _DYNAMIC_TASK_FIELDS, _SPLIT_ONLY_TASK_FIELDS

    pending: set[str] = set()
    dynamic = set(_DYNAMIC_TASK_FIELDS) | set(_SPLIT_ONLY_TASK_FIELDS)
    missing = dynamic - set(_FRESH_COPY_STRIP_KEYS)
    assert missing <= pending, f"dynamic task fields a fresh copy would inherit: {sorted(missing - pending)}"
    assert pending <= dynamic, "a pending entry is no dynamic field any more — drop it"


def test_current_phase_summary_shape() -> None:
    from custom_components.maintenance_supporter.helpers.phases import current_phase_summary

    task = {
        "phases": {"clean": {"name": "Clean"}, "replace": {"name": "Replace"}},
        "phase_sequence": ["clean", "replace"],
        "phase_cursor": 1,
    }
    assert current_phase_summary(task) == {"id": "replace", "name": "Replace", "index": 1, "count": 2}
    assert current_phase_summary({"name": "No phases"}) is None
    assert "_current_phase_summary_for_sensor" not in (COMPONENT / "sensor.py").read_text(encoding="utf-8")


def test_linear_fit_is_shared_and_translation_safe() -> None:
    from custom_components.maintenance_supporter.helpers.interval_analyzer import IntervalAnalyzer
    from custom_components.maintenance_supporter.helpers.least_squares import linear_fit
    from custom_components.maintenance_supporter.helpers.sensor_predictor import SensorPredictor

    t0 = 1.7e9
    xs = [t0 + i * 86400.0 for i in range(6)]
    ys = [100.0 - 0.5 * i for i in range(6)]
    fit = linear_fit(xs, ys, min_denom=1e-15)
    assert fit is not None
    assert fit[0] == pytest.approx(-0.5 / 86400.0, rel=1e-9)
    assert fit[0] * xs[3] + fit[1] == pytest.approx(ys[3], rel=1e-9)
    assert linear_fit([1.0], [2.0], min_denom=1e-15) is None
    assert linear_fit([3.0, 3.0, 3.0], [1.0, 2.0, 3.0], min_denom=1e-15) is None
    predicted = SensorPredictor._linear_regression(list(zip(xs, ys, strict=True)))
    assert predicted is not None and predicted[:2] == fit
    for rel in ("helpers/interval_analyzer.py", "helpers/sensor_predictor.py"):
        text = (COMPONENT / rel).read_text(encoding="utf-8")
        assert "sum_xy" not in text, f"{rel}: its own normal equations — use least_squares.linear_fit"
    assert IntervalAnalyzer._weibull_fit([29.0, 30.0, 30.0, 31.0, 30.0, 29.5, 30.5]) is not None
