"""DRY audit 2026-09-26, section B — backend interfaces (tripwires + parity).

One source per duty, pinned here so a new copy fails the build:

* task/create + task/update validators come from ONE ``_TASK_FIELDS`` map;
* the trigger / schedule / adaptive ranges come from ``const`` (the flow
  selectors, the WS validators and the adopt endpoint used literals);
* the options flow's plain + compound trigger steps share field builders,
  one trigger summary and one entity resolver;
* the two adopt endpoints share one batch scaffold — whose rollback now also
  un-counts the tasks of a removed object (drift bug of the integration copy);
* templates build their tasks through one helper; the JSON import leaves the
  checklist / reading-slot / to-do-mirror sanitising to the flow chokepoint;
* global options are merged with ONE read rule (options, else data);
* verbatim-duplicate catalog signatures are ONE shared object each, and the
  catalog heal reads its target states from the catalog.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import pytest
import voluptuous as vol
from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.const import (
    ADAPTIVE_EWA_ALPHA_RANGE,
    CONF_DEFAULT_WARNING_DAYS,
    CONF_SAVED_FILTER_VIEWS,
    CONF_TASKS,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    SCHEDULE_OFFSET_MAX_DAYS,
    TRIGGER_FIELD_RANGES,
    TRIGGER_RUNTIME_HOURS_MAX,
)

from .conftest import call_ws_handler, make_global_entry, make_ws_connection, setup_integration

ROOT = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter"


# ─── task/create + task/update: one validator per field ─────────────────────


def _by_key(schema: dict[Any, Any]) -> dict[str, tuple[Any, Any]]:
    return {marker.schema: (marker, validator) for marker, validator in schema.items()}


def test_task_schemas_are_built_from_one_field_map() -> None:
    """Both schemas hold the SAME validator object per task field — the
    key-set parity test (test_task_schema_parity) is trivially true now, so
    this pins the markers: update = every field optional WITHOUT a default,
    create = the documented required field + defaults, nothing else."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import (
        _TASK_CREATE_DEFAULTS,
        _TASK_CREATE_REQUIRED,
        _TASK_CREATE_SCHEMA,
        _TASK_FIELDS,
        _TASK_UPDATE_SCHEMA,
    )

    create = _by_key(_TASK_CREATE_SCHEMA)
    update = _by_key(_TASK_UPDATE_SCHEMA)
    assert set(create) - set(_TASK_FIELDS) == {"type", "entry_id", "dry_run"}
    assert set(update) - set(_TASK_FIELDS) == {"type", "entry_id", "task_id"}
    for key, validator in _TASK_FIELDS.items():
        c_marker, c_validator = create[key]
        u_marker, u_validator = update[key]
        assert c_validator is validator and u_validator is validator, key
        assert type(u_marker) is vol.Optional and u_marker.default is vol.UNDEFINED, key
        if key in _TASK_CREATE_REQUIRED:
            assert type(c_marker) is vol.Required, key
        elif key in _TASK_CREATE_DEFAULTS:
            assert type(c_marker) is vol.Optional and c_marker.default() == _TASK_CREATE_DEFAULTS[key], key
        else:
            assert type(c_marker) is vol.Optional and c_marker.default is vol.UNDEFINED, key
    assert {"name"} == _TASK_CREATE_REQUIRED


def test_task_schemas_accept_and_refuse_as_before() -> None:
    """Behavioural spot checks of the two compiled schemas."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import (
        _TASK_CREATE_SCHEMA,
        _TASK_UPDATE_SCHEMA,
    )

    create = vol.Schema(_TASK_CREATE_SCHEMA)
    update = vol.Schema(_TASK_UPDATE_SCHEMA)
    base = {"type": "maintenance_supporter/task/create", "entry_id": "e1"}
    out = create({**base, "name": "Filter"})
    assert {k: out[k] for k in ("task_type", "schedule_type", "interval_unit", "interval_anchor", "enabled", "dry_run")} == {
        "task_type": "custom",
        "schedule_type": "time_based",
        "interval_unit": "days",
        "interval_anchor": "completion",
        "enabled": True,
        "dry_run": False,
    }
    with pytest.raises(vol.Invalid):
        create(base)  # name required
    with pytest.raises(vol.Invalid):
        create({**base, "name": ""})
    u_base = {"type": "maintenance_supporter/task/update", "entry_id": "e1", "task_id": "t1"}
    assert update(u_base) == u_base  # no defaults sneak into an update
    with pytest.raises(vol.Invalid):
        update({**u_base, "name": ""})
    with pytest.raises(vol.Invalid):
        update({**u_base, "warning_days": 366})
    assert update({**u_base, "interval_days": None})["interval_days"] is None


# ─── Range single sources ────────────────────────────────────────────────────


def _selector_config(fields: dict[Any, Any], key: str) -> dict[str, Any]:
    for marker, sel in fields.items():
        if getattr(marker, "schema", marker) == key:
            return dict(sel.config)
    raise AssertionError(f"{key} not in form")


def test_trigger_ranges_have_one_source() -> None:
    from custom_components.maintenance_supporter.config_flow_trigger import (
        _for_minutes_field,
        _runtime_hours_field,
        _target_changes_field,
    )
    from custom_components.maintenance_supporter.websocket import tasks_validation

    assert tasks_validation._INT_FIELDS is TRIGGER_FIELD_RANGES
    assert tasks_validation.TRIGGER_RUNTIME_HOURS_MAX == TRIGGER_RUNTIME_HOURS_MAX

    fm = _selector_config(_for_minutes_field(), "trigger_for_minutes")
    assert (fm["min"], fm["max"]) == TRIGGER_FIELD_RANGES["trigger_for_minutes"]
    tcg = _selector_config(_target_changes_field(), "trigger_target_changes")
    assert (tcg["min"], tcg["max"]) == TRIGGER_FIELD_RANGES["trigger_target_changes"]
    assert _selector_config(_runtime_hours_field(), "trigger_runtime_hours")["max"] == TRIGGER_RUNTIME_HOURS_MAX


def test_adopt_hold_time_and_ewa_alpha_use_the_shared_ranges() -> None:
    from custom_components.maintenance_supporter.websocket.analysis import ws_set_adaptive
    from custom_components.maintenance_supporter.websocket.problem_sensors import _SELECTION_SCHEMA

    def _range(validator: Any) -> tuple[Any, Any]:
        stack = [validator]
        while stack:
            v = stack.pop()
            if isinstance(v, vol.Range):
                return v.min, v.max
            stack.extend(getattr(v, "validators", []))
        raise AssertionError("no Range")

    for_minutes = _by_key(_SELECTION_SCHEMA.schema)["for_minutes"][1]
    assert _range(for_minutes) == TRIGGER_FIELD_RANGES["trigger_for_minutes"]
    ewa = _by_key(ws_set_adaptive._ws_schema.schema)["ewa_alpha"][1]
    assert _range(ewa) == ADAPTIVE_EWA_ALPHA_RANGE


def test_calendar_offset_selector_and_engine_share_the_bound() -> None:
    from custom_components.maintenance_supporter.config_flow_helpers import calendar_schema
    from custom_components.maintenance_supporter.helpers import schedule
    from custom_components.maintenance_supporter.helpers.schedule import KIND_WEEKDAYS

    cfg = _selector_config(calendar_schema(KIND_WEEKDAYS).schema, "offset")
    assert (cfg["min"], cfg["max"]) == (-SCHEDULE_OFFSET_MAX_DAYS, SCHEDULE_OFFSET_MAX_DAYS)
    # helpers/schedule.py clamps stored offsets with its own name for it.
    assert schedule._MAX_OFFSET_DAYS == SCHEDULE_OFFSET_MAX_DAYS


_RANGE_LITERALS = re.compile(r"\b(1440|10_?000|100_?000)\b|min=-15\b|max=15\b|min=0\.1\b|max=0\.9\b")


@pytest.mark.parametrize(
    "rel",
    [
        "config_flow_trigger.py",
        "config_flow_helpers.py",
        "config_flow_options_task_adaptive.py",
        "websocket/tasks_validation.py",
        "websocket/problem_sensors.py",
        "websocket/analysis.py",
    ],
)
def test_no_range_literals_outside_const(rel: str) -> None:
    src = (ROOT / rel).read_text(encoding="utf-8")
    hits = [m.group(0) for m in _RANGE_LITERALS.finditer(src)]
    assert not hits, f"{rel}: range literal(s) {hits} — use the const.py source (TRIGGER_FIELD_RANGES & co.)"


# ─── Options-flow trigger summary + entity resolver ─────────────────────────


def test_trigger_entity_resolver_handles_every_legacy_shape() -> None:
    from custom_components.maintenance_supporter.config_flow_options_task_trigger import TriggerStepsMixin

    resolve = TriggerStepsMixin._stored_trigger_entities
    assert resolve({"entity_ids": ["sensor.a", "sensor.b"], "entity_id": "sensor.x"}) == ["sensor.a", "sensor.b"]
    assert resolve({"entity_ids": [], "entity_id": "sensor.x"}) == ["sensor.x"]
    assert resolve({"entity_id": ["sensor.a", "sensor.b"]}) == ["sensor.a", "sensor.b"]
    assert resolve({"entity_id": ""}) == []
    assert resolve({}) == []


def test_trigger_summary_has_one_formatter() -> None:
    from custom_components.maintenance_supporter.config_flow_options_task_trigger import TriggerStepsMixin

    tc = {"type": "threshold", "entity_id": "sensor.p", "trigger_above": 3, "trigger_for_minutes": 5}
    assert TriggerStepsMixin._build_trigger_config_parts(tc) == TriggerStepsMixin._condition_parts(tc)
    assert TriggerStepsMixin._condition_summary(tc) == "above: 3, for: 5min"
    compound = {"type": "compound", "compound_logic": "OR", "conditions": [{**tc, "entity_ids": ["sensor.p"]}, {"type": "counter"}]}
    assert TriggerStepsMixin._build_trigger_config_parts(compound) == [
        "logic: OR",
        "#1 threshold: sensor.p (above: 3, for: 5min)",
        "#2 counter: ? (—)",
    ]


# ─── Adopt batch scaffold (drift bug: rolled-back tasks were still counted) ──


async def test_integration_adopt_rollback_uncounts_the_removed_tasks(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """A fresh object whose SECOND task fails is removed with the first one —
    and neither is reported as created (the integration copy of the scaffold
    kept counting the first task of the removed object)."""
    import custom_components.maintenance_supporter.helpers.entry_tasks as tp
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    from .test_integration_setups import _seed_roborock

    await setup_integration(hass, make_global_entry(hass))
    device_id = await _seed_roborock(hass)

    original = tp.insert_new_task  # adopting stores via insert_new_task (one reload per object, 2.95)
    calls = {"n": 0}

    def _second_fails(*args: Any, **kwargs: Any) -> Any:
        calls["n"] += 1
        if calls["n"] == 2:
            raise ValueError("persist boom")
        return original(*args, **kwargs)

    monkeypatch.setattr(tp, "insert_new_task", _second_fails)
    conn = make_ws_connection()
    await call_ws_handler(ws_adopt_integration_setups, hass, conn, {"id": 1, "type": "x", "selections": [{"device_id": device_id}]})
    await hass.async_block_till_done()

    res = conn.send_result.call_args[0][1]
    assert calls["n"] == 2
    assert res["objects_created"] == 0
    assert res["tasks_created"] == 0, "the task persisted into the removed object must not be counted"
    assert res["errors"] == [{"device_id": device_id, "reason": "persist boom"}]
    assert [e for e in hass.config_entries.async_entries(DOMAIN) if e.unique_id != GLOBAL_UNIQUE_ID] == []


async def test_integration_adopt_failure_in_existing_object_keeps_its_count(
    hass: HomeAssistant, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Into an EXISTING object nothing is rolled back: the task persisted
    before the failure stays — and stays counted."""
    import custom_components.maintenance_supporter.helpers.entry_tasks as tp
    from custom_components.maintenance_supporter.websocket.integration_setups import ws_adopt_integration_setups

    from .conftest import make_object_entry
    from .test_integration_setups import _seed_roborock

    global_entry = make_global_entry(hass)
    target = make_object_entry(hass, name="Vacuum")
    await setup_integration(hass, global_entry, target)
    device_id = await _seed_roborock(hass)

    original = tp.insert_new_task  # adopting stores via insert_new_task (one reload per object, 2.95)
    calls = {"n": 0}

    def _second_fails(*args: Any, **kwargs: Any) -> Any:
        calls["n"] += 1
        if calls["n"] == 2:
            raise ValueError("persist boom")
        return original(*args, **kwargs)

    monkeypatch.setattr(tp, "insert_new_task", _second_fails)
    conn = make_ws_connection()
    await call_ws_handler(
        ws_adopt_integration_setups,
        hass,
        conn,
        {"id": 1, "type": "x", "selections": [{"device_id": device_id, "entry_id": target.entry_id}]},
    )
    await hass.async_block_till_done()

    res = conn.send_result.call_args[0][1]
    assert (res["tasks_created"], res["objects_created"]) == (1, 0)
    assert hass.config_entries.async_get_entry(target.entry_id) is not None
    assert len(hass.config_entries.async_get_entry(target.entry_id).data[CONF_TASKS]) == 1


# ─── Templates: one builder for the flow and the panel gallery ──────────────


def test_template_task_building_has_one_home() -> None:
    own_build = re.compile(r"\b(build_template_task|async_climate|template_tasks)\(")
    for rel in ("config_flow.py", "websocket/objects.py"):
        hits = own_build.findall((ROOT / rel).read_text(encoding="utf-8"))
        assert not hits, f"{rel} builds template tasks itself ({hits}) — use templates.async_build_template_tasks"


async def test_template_builder_follows_the_home_country(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.templates import async_build_template_tasks, get_template_by_id

    hass.config.country = "gb"
    hass.config.latitude = 0
    hass.config.longitude = 0  # "Null Island" = no climate data → northern defaults
    template = get_template_by_id("vehicle_car")
    assert template is not None
    tasks = await async_build_template_tasks(hass, template, "en", "obj1")
    assert len(tasks) == len(template.tasks)
    for task_id, task in tasks.items():
        assert task["id"] == task_id and task["object_id"] == "obj1"
    test = next(t for t in tasks.values() if t["name"] == "Roadworthiness Test")
    assert test["interval_days"] == 365  # the GB interval, not the 730-day default


# ─── JSON import: the flow chokepoint sanitises, not a second copy ──────────


async def test_json_import_sanitising_happens_at_the_flow_chokepoint(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, make_global_entry(hass))
    payload = {
        "version": 1,
        "objects": [
            {
                "object": {"name": "Import Probe"},
                "tasks": [
                    {
                        "name": "Messy",
                        "schedule_type": "time_based",
                        "interval_days": 30,
                        "checklist": ["  wipe  ", "", 5, "x" * 600],
                        "readings": "junk",
                        "mirror_todo_entities": ["todo.home", "light.nope", "todo.home"],
                    }
                ],
            }
        ],
    }
    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": "x", "json_content": json.dumps(payload)})
    res = conn.send_result.call_args[0][1]
    entry = hass.config_entries.async_get_entry(res["imported"][0]["entry_id"])
    task = next(iter(entry.data[CONF_TASKS].values()))
    assert task["checklist"] == ["wipe", "x" * 500]
    assert "readings" not in task
    assert task["mirror_todo_entities"] == ["todo.home"]


# ─── Global options: one read rule for every merge ──────────────────────────


async def test_merge_global_options_keeps_settings_that_live_in_data(hass: HomeAssistant) -> None:
    """A never-saved global entry keeps its settings in ``data``; a merge
    that started from ``options`` alone would have written an options dict
    holding only the change and hidden all of them."""
    from custom_components.maintenance_supporter.websocket import _merge_global_options

    entry = make_global_entry(hass, warning_days=11)
    assert not entry.options
    _merge_global_options(hass, entry, {CONF_SAVED_FILTER_VIEWS: []})
    assert entry.options[CONF_DEFAULT_WARNING_DAYS] == 11
    assert entry.options[CONF_SAVED_FILTER_VIEWS] == []


def test_ws_layer_reads_global_options_with_the_shared_rule() -> None:
    options_only = re.compile(r"\.options\.get\(|dict\(\w+\.options\)|options=\{\*\*")
    for path in sorted((ROOT / "websocket").glob("*.py")):
        hits = options_only.findall(path.read_text(encoding="utf-8"))
        assert not hits, f"{path.name}: global options read without the data fallback — use get_global_options / _merge_global_options"
    views = (ROOT / "views.py").read_text(encoding="utf-8")
    assert "GLOBAL_UNIQUE_ID" not in views, "views.py: use aggregate.is_object_entry"


# ─── Signature catalog ───────────────────────────────────────────────────────


def test_verbatim_duplicate_signatures_share_one_object() -> None:
    from custom_components.maintenance_supporter.helpers.integration_signatures import SIGNATURES

    first: dict[Any, tuple[str, Any]] = {}
    for domain, integration in SIGNATURES.items():
        for sig in integration.tasks:
            seen = first.setdefault(sig, (domain, sig))
            assert seen[1] is sig, (
                f"{domain}: {sig.task_name!r} is a verbatim copy of {seen[0]}'s — "
                "reference (or add) the shared constant in helpers/signatures/_shared.py"
            )


def test_shared_signatures_are_shared() -> None:
    from custom_components.maintenance_supporter.helpers.integration_signatures import SIGNATURES
    from custom_components.maintenance_supporter.helpers.signatures import _shared, _model

    users: dict[int, int] = {}
    for integration in SIGNATURES.values():
        for sig in integration.tasks:
            users[id(sig)] = users.get(id(sig), 0) + 1
    constants = {name: value for name, value in vars(_shared).items() if isinstance(value, _model.ConsumableSignature)}
    assert constants
    for name, value in constants.items():
        assert users.get(id(value), 0) >= 2, f"_shared.{name} is used by fewer than two integrations — inline it"


def test_catalog_heal_targets_come_from_the_catalog() -> None:
    from custom_components.maintenance_supporter.helpers import catalog_heal
    from custom_components.maintenance_supporter.helpers.integration_signatures import SIGNATURES

    for platform in catalog_heal._CLIMATE_RUNTIME_HEALS:
        states = catalog_heal._catalog_on_states(platform)
        assert states and states in {s.on_states for s in SIGNATURES[platform].tasks}
    src = (ROOT / "helpers" / "catalog_heal.py").read_text(encoding="utf-8")
    assert "fan_only" not in src, "catalog_heal.py carries its own copy of the healed states"
