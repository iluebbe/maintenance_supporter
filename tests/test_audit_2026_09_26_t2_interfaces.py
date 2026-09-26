"""Regression tests for the audits of 2026-09-26, tranche 2 — interfaces.

Backend interfaces (flows, WS commands, services, imports, HTTP views):
DRY audit items BI-A3…BI-A10 / BR-A4 and bug audit items SEC-3/5/8/9/11,
FE-2. One test (or a small group) per finding; the docstrings name the
reported failure so a red test says which bug came back.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import pytest
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_TASKS,
    CONF_TRIGGER_ABOVE,
    CONF_TRIGGER_ATTRIBUTE,
    CONF_TRIGGER_DELTA_MODE,
    CONF_TRIGGER_ENTITY,
    CONF_TRIGGER_TARGET_VALUE,
    CONF_TRIGGER_TYPE,
    DOMAIN,
    GLOBAL_UNIQUE_ID,
    MaintenanceTypeEnum,
    ScheduleType,
    TriggerType,
)

from .conftest import (
    assert_ws_error,
    assert_ws_success,
    build_global_entry_data,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    call_ws_handler,
    make_ws_connection,
    setup_integration,
)

_COMPONENT = Path(__file__).resolve().parents[1] / "custom_components" / "maintenance_supporter"
TASK = "task_1"


def _global_entry(hass: HomeAssistant, *, options: dict[str, Any] | None = None, **kwargs: Any) -> MockConfigEntry:
    data = build_global_entry_data(**kwargs)
    g = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title="Maintenance Supporter",
        data=data,
        options={**data, **options} if options else {},
        source="user",
        unique_id=GLOBAL_UNIQUE_ID,
    )
    g.add_to_hass(hass)
    return g


def _object_entry(
    hass: HomeAssistant, *, name: str = "Boiler", object_id: str = "boiler", task_id: str = TASK, **task_overrides: Any
) -> MockConfigEntry:
    task: dict[str, Any] = build_task_data(task_id=task_id, interval_days=30, last_performed="2020-01-01", object_id=object_id)
    task["name"] = "Change Filter"
    task.update(task_overrides)
    obj = MockConfigEntry(
        version=1,
        minor_version=4,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(object_data=build_object_data(name=name, object_id=object_id), tasks={task_id: task}),
        source="user",
        unique_id=f"maintenance_supporter_{object_id}",
    )
    obj.add_to_hass(hass)
    return obj


async def _setup(hass: HomeAssistant, *, global_kwargs: dict[str, Any] | None = None, **task_overrides: Any) -> MockConfigEntry:
    g = _global_entry(hass, **(global_kwargs or {}))
    obj = _object_entry(hass, **task_overrides)
    await setup_integration(hass, g, obj)
    return obj


def _entry(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    return hass.config_entries.async_get_entry(entry.entry_id)


async def _ws(hass: HomeAssistant, handler: Any, msg: dict[str, Any]) -> Any:
    conn = make_ws_connection()
    await call_ws_handler(handler, hass, conn, {"id": 1, **msg})
    return conn


async def _to_trigger_type(hass: HomeAssistant, entity_id: str) -> Any:
    """Config flow: new object → sensor task on ``entity_id`` → the type step."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "create_object"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"name": "Flow Object"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "add_task"})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={"name": "Sensor task", "type": MaintenanceTypeEnum.INSPECTION, "schedule_type": ScheduleType.SENSOR_BASED},
    )
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ENTITY: [entity_id]})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ATTRIBUTE: "_state"})
    return result


# ─── BI-A3: flow-built triggers pass the same validation as the WS path ──


async def test_a_flow_refuses_a_delta_counter_without_a_positive_target(hass: HomeAssistant) -> None:
    """The WS validator refuses a delta counter with target ≤ 0 (it would
    fire on every reading); the setup/options flows saved it unchecked."""
    hass.states.async_set("sensor.odometer", "1200", {"unit_of_measurement": "km"})
    await setup_integration(hass, _global_entry(hass))
    result = await _to_trigger_type(hass, "sensor.odometer")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_TYPE: TriggerType.COUNTER})
    assert result["step_id"] == "trigger_counter"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], user_input={CONF_TRIGGER_TARGET_VALUE: 0, CONF_TRIGGER_DELTA_MODE: True}
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"] == {CONF_TRIGGER_TARGET_VALUE: "invalid_delta_target"}

    # An absolute counter may count down to 0 — only delta mode needs N > 0.
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], user_input={CONF_TRIGGER_TARGET_VALUE: 500, CONF_TRIGGER_DELTA_MODE: True}
    )
    assert result["step_id"] == "task_menu"


async def _compound_first_condition(hass: HomeAssistant, entity_id: str) -> Any:
    result = await _to_trigger_type(hass, entity_id)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_TYPE: TriggerType.COMPOUND})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"compound_logic": "and"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ENTITY: [entity_id]})
    return result


async def test_a_compound_condition_needs_a_limit_and_accepts_decimals(hass: HomeAssistant) -> None:
    """A compound threshold condition without any limit was saved (it can
    never trigger), and its number fields had step 1 — the browser refused
    a limit such as 1.5 bar."""
    hass.states.async_set("sensor.pressure", "1.2", {"unit_of_measurement": "bar"})
    await setup_integration(hass, _global_entry(hass))
    result = await _compound_first_condition(hass, "sensor.pressure")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD})
    assert result["step_id"] == "compound_condition_threshold"
    steps = {str(key): value.config.get("step") for key, value in result["data_schema"].schema.items() if hasattr(value, "config")}
    assert steps["trigger_above"] == steps["trigger_below"] == "any"

    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={})
    assert result["errors"] == {"base": "invalid_threshold"}

    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ABOVE: 1.5})
    assert result["step_id"] == "compound_review"


async def test_a_compound_trigger_cannot_be_finished_with_one_condition(hass: HomeAssistant) -> None:
    """With one condition "finish" saved a compound the WS validator refuses
    (it needs two) — every later panel edit of the task failed. The flow
    now goes on to the second condition; the finished trigger validates."""
    from custom_components.maintenance_supporter.websocket.tasks_validation import _validate_trigger_config

    hass.states.async_set("sensor.pressure", "1.2", {"unit_of_measurement": "bar"})
    hass.states.async_set("sensor.flow", "10", {"unit_of_measurement": "l/min"})
    await setup_integration(hass, _global_entry(hass))
    result = await _compound_first_condition(hass, "sensor.pressure")
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_TYPE: TriggerType.COUNTER})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], user_input={CONF_TRIGGER_TARGET_VALUE: -1, CONF_TRIGGER_DELTA_MODE: True}
    )
    assert result["errors"] == {CONF_TRIGGER_TARGET_VALUE: "invalid_delta_target"}
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], user_input={CONF_TRIGGER_TARGET_VALUE: 2.5, CONF_TRIGGER_DELTA_MODE: True}
    )
    assert result["step_id"] == "compound_review"
    offered = [opt["value"] for opt in result["data_schema"].schema["compound_action"].config["options"]]
    assert offered == ["add"]

    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"compound_action": "add"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_ENTITY: ["sensor.flow"]})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={CONF_TRIGGER_TYPE: TriggerType.THRESHOLD})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"trigger_below": 2.5})
    assert result["step_id"] == "compound_review"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], user_input={"compound_action": "finish"})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "finish"})
    assert result["type"] == FlowResultType.CREATE_ENTRY
    tc = next(iter(result["data"][CONF_TASKS].values()))["trigger_config"]
    errors, _warnings = _validate_trigger_config(hass, json.loads(json.dumps(tc)))
    assert errors == []


# ─── BI-A9: every flow error / abort key has a text ──────────────────────

_ERROR_RE = re.compile(r'errors\[[^\]]+\]\s*=\s*"([a-z_]+)"')
_ABORT_RE = re.compile(r'async_abort\(\s*reason\s*=\s*"([a-z_]+)"')
# validate_notify_service returns its error key: (value, "key").
_RETURNED_ERROR_RE = re.compile(r'return \(\w+, "([a-z_]+)"\)')


def _flow_sections(path: Path) -> tuple[str, ...]:
    """Which strings.json flow sections a module's keys must exist in."""
    if path.name == "config_flow.py":
        return ("config",)
    if path.name.startswith("config_flow_options"):
        return ("options",)
    # Mixins shared by both flows (trigger, schedule, helpers).
    return ("config", "options")


def test_every_flow_error_and_abort_key_has_a_text() -> None:
    """``invalid_schedule``, ``entity_unavailable`` and ``unknown`` were used
    by the flows but never declared — the form showed the raw key."""
    strings = json.loads((_COMPONENT / "strings.json").read_text(encoding="utf-8"))
    missing: list[str] = []
    seen = 0
    for path in sorted(_COMPONENT.glob("config_flow*.py")):
        source = path.read_text(encoding="utf-8")
        sections = _flow_sections(path)
        used = [("error", key, sections) for key in _ERROR_RE.findall(source)]
        used += [("abort", key, sections) for key in _ABORT_RE.findall(source)]
        # validate_notify_service lives in the options module but also
        # validates the setup flow's global step.
        used += [("error", key, ("config", "options")) for key in _RETURNED_ERROR_RE.findall(source)]
        for kind, key, where in used:
            seen += 1
            missing += [f"{section}.{kind}.{key} ({path.name})" for section in where if key not in strings[section].get(kind, {})]
    assert seen > 20, "the scan found (almost) nothing — did the flow code change shape?"
    assert not missing, missing


# ─── BI-A4: stale select defaults no longer make the forms unsaveable ────


async def _open_edit_task(hass: HomeAssistant, entry: MockConfigEntry) -> Any:
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={"selected_task": TASK, "go_back": False})
    return await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "edit_task"})


async def test_the_task_form_saves_despite_stale_select_values(hass: HomeAssistant) -> None:
    """``rotation_strategy: None`` (persisted by every panel save), a pool
    member or assignee no longer offered, and a free-text task type
    came back as select defaults and failed validation: the options-flow
    task form could not be saved at all."""
    anna = await hass.auth.async_create_user("Anna")
    ben = await hass.auth.async_create_user("Ben")
    carl = await hass.auth.async_create_user("Carl")
    entry = await _setup(
        hass,
        rotation_strategy=None,
        assignee_pool=[anna.id, carl.id, ben.id],
        responsible_user_id=carl.id,
        type="filter_swap",
    )
    # Deactivated: no longer offered, but — unlike a deleted user — never
    # cleaned out of the task.
    await hass.auth.async_deactivate_user(carl)
    result = await _open_edit_task(hass, entry)
    assert result["step_id"] == "edit_task"
    defaults = {str(key): key.default() for key in result["data_schema"].schema if callable(getattr(key, "default", None))}
    assert defaults["rotation_strategy"] == ""
    assert defaults["assignee_pool"] == [anna.id, ben.id]
    assert defaults["responsible_user_id"] == ""
    assert defaults["type"] == "filter_swap"

    # The form as the UI submits it: every default untouched.
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={})
    assert result["step_id"] == "task_action"
    task = _entry(hass, entry).data[CONF_TASKS][TASK]
    assert task["type"] == "filter_swap"
    assert task["assignee_pool"] == [anna.id, ben.id]
    assert "rotation_strategy" not in task


async def test_the_panel_no_longer_persists_a_null_rotation(hass: HomeAssistant) -> None:
    """The task dialog sends ``rotation_strategy: null`` on every save; it
    was stored verbatim (and the service/import sanitiser kept None too)."""
    from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_update_task

    entry = await _setup(hass, rotation_strategy="round_robin")
    conn = await _ws(hass, ws_update_task, {"type": f"{DOMAIN}/task/update", "entry_id": entry.entry_id, "task_id": TASK, "rotation_strategy": None})
    assert_ws_success(conn)
    assert "rotation_strategy" not in _entry(hass, entry).data[CONF_TASKS][TASK]
    assert "rotation_strategy" not in cap_task_fields({"rotation_strategy": None})
    assert cap_task_fields({"rotation_strategy": "round_robin"})["rotation_strategy"] == "round_robin"


async def test_panel_access_saves_after_a_listed_user_left(hass: HomeAssistant) -> None:
    """A deleted operator (or one promoted to admin, hence no longer on the
    non-admin list) stayed the multi-select's default — the step could not
    be saved until someone edited storage by hand."""
    g = _global_entry(hass)
    await setup_integration(hass, g)
    await hass.auth.async_create_user("Owner", group_ids=["system-admin"])
    kid = await hass.auth.async_create_user("Kid")
    promoted = await hass.auth.async_create_user("Promoted", group_ids=["system-admin"])
    hass.config_entries.async_update_entry(g, options={**g.data, "admin_panel_user_ids": ["deleted-user", kid.id, promoted.id]})

    result = await hass.config_entries.options.async_init(g.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "panel_access"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={})
    assert result["type"] == FlowResultType.MENU
    assert hass.config_entries.async_get_entry(g.entry_id).options["admin_panel_user_ids"] == [kid.id]


def test_select_default_keeps_only_offered_values() -> None:
    from custom_components.maintenance_supporter.config_flow_helpers import select_default

    options = [{"value": "", "label": "-"}, {"value": "a", "label": "A"}]
    assert select_default(None, options) == ""
    assert select_default("gone", options, fallback="a") == "a"
    assert select_default("a", options) == "a"
    assert select_default(["a", "gone"], options) == ["a"]
    assert select_default(None, ["", "x"]) == ""


# ─── BI-A7: the options forms can clear what they show ───────────────────


async def test_object_settings_can_clear_dates_and_text(hass: HomeAssistant) -> None:
    """A wrong installation / warranty date could never be removed: the
    frontend leaves an emptied field out, and the form's ``default=<stored>``
    put the stored value straight back (the handler never popped it)."""
    entry = await _setup(hass)
    obj = {**entry.data["object"], "installation_date": "2020-01-01", "warranty_expiry": "2022-01-01", "manufacturer": "ACME", "notes": "old"}
    hass.config_entries.async_update_entry(entry, data={**entry.data, "object": obj})

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "object_settings"})
    by_name = {str(key): key for key in result["data_schema"].schema}
    assert by_name["installation_date"].description == {"suggested_value": "2020-01-01"}

    # The UI submits only what is still filled in.
    await hass.config_entries.options.async_configure(result["flow_id"], user_input={"name": "Boiler"})
    stored = _entry(hass, entry).data["object"]
    assert "installation_date" not in stored
    assert "warranty_expiry" not in stored
    assert not stored.get("manufacturer")
    assert not stored.get("notes")


async def test_the_task_form_can_clear_notes_and_the_link(hass: HomeAssistant) -> None:
    """Options edit_task only ever SET notes / documentation URL (and its
    ``default=`` refilled them) — once written they could not be removed.
    Icon, NFC tag, unit and labels had the same refill."""
    entry = await _setup(
        hass,
        notes="Old notes",
        documentation_url="https://example.com/manual.pdf",
        custom_icon="mdi:wrench",
        nfc_tag_id="NFC-1",
        reading_unit="bar",
        labels=["garage"],
    )
    result = await _open_edit_task(hass, entry)
    by_name = {str(key): key for key in result["data_schema"].schema}
    assert by_name["notes"].description == {"suggested_value": "Old notes"}

    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={"name": "Change Filter"})
    assert result["step_id"] == "task_action"
    task = _entry(hass, entry).data[CONF_TASKS][TASK]
    for key in ("notes", "documentation_url", "custom_icon", "nfc_tag_id", "reading_unit", "labels"):
        assert key not in task, key


async def test_global_options_can_clear_the_panel_title_and_the_extra_data(hass: HomeAssistant) -> None:
    """HA's form drops an emptied field from the submission: the options
    merge kept the old sidebar title, and the notification extra-data
    template carried a ``default`` that re-inserted it — neither could be
    cleared from the options flow."""
    g = _global_entry(hass, notifications_enabled=True, options={"panel_title": "Upkeep", "notify_extra_data": '{"a": 1}'})
    await setup_integration(hass, g)
    result = await hass.config_entries.options.async_init(g.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "general_settings"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={})
    assert g.options["panel_title"] == ""
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "notification_settings"})
    await hass.config_entries.options.async_configure(result["flow_id"], user_input={})
    assert g.options["notify_extra_data"] == ""


# ─── BI-A8: the flow's adaptive step writes like the panel does ──────────


async def test_the_flow_adaptive_step_saves_now_refreshes_and_drops_a_stale_attribute(hass: HomeAssistant) -> None:
    """The options flow delay-saved (a restart in the debounce lost the
    change), never refreshed, and kept the old entity's attribute when a
    new environmental entity was picked — the WS command did all three."""
    from unittest.mock import patch

    entry = await _setup(hass, global_kwargs={"options": {"advanced_adaptive_visible": True}})
    rd = _entry(hass, entry).runtime_data
    rd.store.set_adaptive_config(TASK, {"enabled": True, "environmental_entity": "sensor.old", "environmental_attribute": "temperature"})

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(result["flow_id"], user_input={"selected_task": TASK, "go_back": False})
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "adaptive_scheduling"})
    with (
        patch.object(rd.store, "async_save", wraps=rd.store.async_save) as saved,
        patch.object(rd.coordinator, "async_refresh_now", wraps=rd.coordinator.async_refresh_now) as refreshed,
    ):
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], user_input={"adaptive_enabled": True, "environmental_entity": "sensor.new"}
        )
    assert result["step_id"] == "task_action"
    assert saved.called and refreshed.called
    adaptive = rd.store.get_adaptive_config(TASK)
    assert adaptive["environmental_entity"] == "sensor.new"
    assert "environmental_attribute" not in adaptive


# ─── BI-A5 / BR-A4: service + WS create/update paths ─────────────────────


async def test_update_task_service_changes_the_interval_of_a_calendar_task(hass: HomeAssistant) -> None:
    """``update_task`` with interval_days on a weekly (calendar-kind) task
    was silently dropped — normalize kept the calendar schedule; the WS
    update rebuilt it. A raw ``schedule`` was stored uncanonicalised."""
    entry = await _setup(hass)
    task = dict(entry.data[CONF_TASKS][TASK])
    for key in ("interval_days", "schedule_type"):
        task.pop(key, None)
    task["schedule"] = {"kind": "weekdays", "weekdays": [0]}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: {TASK: task}})

    await hass.services.async_call(DOMAIN, "update_task", {"entry_id": entry.entry_id, "task_id": TASK, "interval_days": 14}, blocking=True)
    await hass.async_block_till_done()
    schedule = _entry(hass, entry).data[CONF_TASKS][TASK]["schedule"]
    assert schedule["kind"] == "interval"
    assert schedule["every"] == 14

    await hass.services.async_call(
        DOMAIN,
        "update_task",
        {"entry_id": entry.entry_id, "task_id": TASK, "schedule": {"kind": "weekdays", "weekdays": [9, 2, 2]}},
        blocking=True,
    )
    await hass.async_block_till_done()
    assert _entry(hass, entry).data[CONF_TASKS][TASK]["schedule"]["weekdays"] == [2]


async def test_the_task_services_refuse_a_due_date_that_is_no_date(hass: HomeAssistant) -> None:
    """``due_date`` was only a string on the service path: "next tuesday"
    became a one-time task's due date, and the task never came due."""
    from homeassistant.exceptions import ServiceValidationError

    entry = await _setup(hass)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN,
            "add_task",
            {"entry_id": entry.entry_id, "name": "Once", "schedule_type": "one_time", "due_date": "next tuesday"},
            blocking=True,
        )
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "update_task", {"entry_id": entry.entry_id, "task_id": TASK, "due_date": "2026-13-45"}, blocking=True
        )
    assert "due_date" not in _entry(hass, entry).data[CONF_TASKS][TASK]


async def test_new_tasks_take_the_configured_warning_default(hass: HomeAssistant) -> None:
    """``task/create`` and the ``add_task`` helper used the constant 7 instead
    of the integration-wide warning default every other path uses."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task
    from custom_components.maintenance_supporter.websocket.tasks_persist import async_create_task_simple

    entry = await _setup(hass, global_kwargs={"warning_days": 3})
    conn = await _ws(hass, ws_create_task, {"type": f"{DOMAIN}/task/create", "entry_id": entry.entry_id, "name": "WS task", "interval_days": 30})
    ws_id = assert_ws_success(conn)["task_id"]
    svc_id = await async_create_task_simple(hass, entry_id=entry.entry_id, name="Service task", interval_days=30)
    tasks = _entry(hass, entry).data[CONF_TASKS]
    assert tasks[ws_id]["warning_days"] == 3
    assert tasks[svc_id]["warning_days"] == 3


async def test_ws_task_writes_validate_dates_users_and_archived_objects(hass: HomeAssistant) -> None:
    """task/create + task/update only length-checked ``due_date``, stored any
    ``responsible_user_id`` (user/assign checks it) and — like
    task/duplicate — happily added tasks to an ARCHIVED object (task/move
    refuses one)."""
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_create_task, ws_duplicate_task, ws_update_task

    entry = await _setup(hass)
    # A stale assignee (the setup pass would already clear one at start-up).
    stale_task = {**entry.data[CONF_TASKS][TASK], "responsible_user_id": "since-deleted"}
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_TASKS: {TASK: stale_task}})
    base = {"type": f"{DOMAIN}/task/create", "entry_id": entry.entry_id, "name": "T", "schedule_type": "one_time"}
    assert_ws_error(await _ws(hass, ws_create_task, {**base, "due_date": "tomorrow"}), "invalid_format")
    assert_ws_error(await _ws(hass, ws_create_task, {**base, "due_date": "2026-10-01", "responsible_user_id": "nobody"}), "invalid_user")

    update = {"type": f"{DOMAIN}/task/update", "entry_id": entry.entry_id, "task_id": TASK}
    assert_ws_error(await _ws(hass, ws_update_task, {**update, "responsible_user_id": "nobody"}), "invalid_user")
    assert_ws_error(await _ws(hass, ws_update_task, {**update, "due_date": "01.10.2026"}), "invalid_format")
    # An older client re-sending the UNCHANGED (stale) assignee is not refused.
    assert_ws_success(await _ws(hass, ws_update_task, {**update, "responsible_user_id": "since-deleted", "name": "Renamed"}))

    current = _entry(hass, entry)
    obj = {**current.data["object"], "archived_at": "2026-09-01T00:00:00+00:00"}
    hass.config_entries.async_update_entry(current, data={**current.data, "object": obj})
    assert_ws_error(await _ws(hass, ws_create_task, {**base, "due_date": "2026-10-01"}), "archived")
    duplicate = {"type": f"{DOMAIN}/task/duplicate", "entry_id": entry.entry_id, "task_id": TASK}
    assert_ws_error(await _ws(hass, ws_duplicate_task, duplicate), "archived")
    assert list(_entry(hass, entry).data[CONF_TASKS]) == [TASK]


# ─── BI-A10: blank group names, over-long imported checklist steps ───────


async def test_a_group_cannot_be_renamed_to_blank(hass: HomeAssistant) -> None:
    """group/create refused "   ", group/update stored it."""
    from custom_components.maintenance_supporter.websocket.groups import ws_create_group, ws_update_group

    await _setup(hass)
    group_id = assert_ws_success(await _ws(hass, ws_create_group, {"type": f"{DOMAIN}/group/create", "name": "Garden"}))["group_id"]
    update = {"type": f"{DOMAIN}/group/update", "group_id": group_id}
    assert_ws_error(await _ws(hass, ws_update_group, {**update, "name": "   "}), "invalid_input")
    assert_ws_success(await _ws(hass, ws_update_group, {**update, "name": "  Yard "}))


async def test_the_json_import_truncates_an_over_long_checklist_step(hass: HomeAssistant) -> None:
    """Every other write path truncates a step to the cap; the JSON import
    dropped it without a trace."""
    from custom_components.maintenance_supporter.const import MAX_CHECKLIST_ITEM_LENGTH
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, _global_entry(hass))
    task = {"name": "T", "schedule_type": "time_based", "interval_days": 30, "checklist": ["short", "L" * 600]}
    payload = {"version": 1, "objects": [{"object": {"name": "Imported"}, "tasks": [task]}]}
    conn = await _ws(hass, ws_import_json, {"type": f"{DOMAIN}/json/import", "json_content": json.dumps(payload)})
    entry_id = assert_ws_success(conn)["imported"][0]["entry_id"]
    checklist = next(iter(hass.config_entries.async_get_entry(entry_id).data[CONF_TASKS].values()))["checklist"]
    assert checklist == ["short", "L" * MAX_CHECKLIST_ITEM_LENGTH]


# ─── FE-2: checklist ticks on a phased task ──────────────────────────────


async def test_ticks_on_a_phase_checklist_are_kept(hass: HomeAssistant) -> None:
    """A phased task shows the CURRENT phase's checklist, but progress was
    validated against the task-level list — every tick was dropped."""
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_checklist_progress

    entry = await _setup(
        hass,
        checklist=["Task step"],
        phases={"blades": {"name": "Blades", "checklist": ["Swap blades"]}, "oil": {"name": "Oil"}},
        phase_sequence=["blades", "oil"],
    )
    msg = {
        "type": f"{DOMAIN}/task/checklist_progress",
        "entry_id": entry.entry_id,
        "task_id": TASK,
        "checklist_state": {"Swap blades": True, "Task step": True},
    }
    assert assert_ws_success(await _ws(hass, ws_checklist_progress, msg))["checklist_state"] == {"Swap blades": True}


# ─── SEC-3: completion photos — open to every user, own object only ──────


async def _add_photo(hass: HomeAssistant, object_id: str, *, weblink: bool = False) -> str:
    from custom_components.maintenance_supporter.const import DOCUMENT_STORE_KEY

    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    if weblink:
        return str((await store.async_add_weblink(object_id, url="https://example.com/p.jpg"))["id"])
    doc = await store.async_add_file(object_id, content=f"img-{object_id}".encode(), filename="p.jpg", mime="image/jpeg", tags=["photo"])
    return str(doc["id"])


async def test_a_completion_links_only_this_objects_photos(hass: HomeAssistant) -> None:
    """Any doc id was taken on trust: another object's document (or a web
    link) satisfied a required photo, was linked to the task and later even
    re-homed with it by task/move."""
    from custom_components.maintenance_supporter.const import DOCUMENT_STORE_KEY
    from custom_components.maintenance_supporter.websocket.tasks_actions import ws_complete_task

    g = _global_entry(hass)
    boiler = _object_entry(hass, required_completion_fields=["photo"])
    shed = _object_entry(hass, name="Shed", object_id="shed", task_id="shed_task")
    await setup_integration(hass, g, boiler, shed)
    foreign = await _add_photo(hass, "shed")
    link = await _add_photo(hass, "boiler", weblink=True)
    own = await _add_photo(hass, "boiler")
    complete = {"type": f"{DOMAIN}/task/complete", "entry_id": boiler.entry_id, "task_id": TASK}

    assert_ws_error(await _ws(hass, ws_complete_task, {**complete, "photo_doc_ids": [foreign, link]}), "completion_details_required")
    assert_ws_success(await _ws(hass, ws_complete_task, {**complete, "photo_doc_ids": [foreign, own]}))
    await hass.async_block_till_done()
    history = _entry(hass, boiler).runtime_data.store.get_history(TASK)
    assert history[-1]["photo_doc_ids"] == [own]
    docs = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    assert TASK not in (docs.get(foreign) or {}).get("task_ids", [])


async def test_any_user_may_upload_a_completion_photo_but_nothing_else(
    hass: HomeAssistant, hass_client: Any, hass_read_only_access_token: str
) -> None:
    """The upload view was write-gated while the complete dialog offers the
    photo picker to everyone — a plain user could never satisfy a required
    photo. Now: an image tagged exactly ``photo`` is open to every user."""
    from aiohttp import FormData

    from custom_components.maintenance_supporter.views import UPLOAD_URL

    entry = await _setup(hass)
    client = await hass_client(hass_read_only_access_token)

    def _form(tags: list[str], content_type: str = "image/jpeg") -> FormData:
        form = FormData()
        form.add_field("entry_id", entry.entry_id)
        for tag in tags:
            form.add_field("tags", tag)
        form.add_field("file", b"\xff\xd8\xff", filename="p.jpg", content_type=content_type)
        return form

    resp = await client.post(UPLOAD_URL, data=_form(["photo"]))
    assert resp.status == 200, await resp.text()
    assert (await resp.json())["tags"] == ["photo"]
    refused = ((["manual"], "image/jpeg"), (["photo", "manual"], "image/jpeg"), (["photo"], "text/html"), ([], "image/jpeg"))
    for tags, ctype in refused:
        resp = await client.post(UPLOAD_URL, data=_form(tags, ctype))
        assert resp.status == 403, (tags, ctype)


# ─── SEC-5: no lost completion across the awaits of an edit / a move ─────

_MEANWHILE = {"timestamp": "2099-01-01T00:00:00+00:00", "type": "completed", "notes": "meanwhile"}


async def test_a_history_edit_keeps_a_completion_that_landed_meanwhile(hass: HomeAssistant) -> None:
    """The edit read the history, awaited the parts reconciliation, and wrote
    its snapshot back — a completion recorded during that await vanished."""
    from unittest.mock import patch

    from custom_components.maintenance_supporter.websocket.tasks_history import ws_update_history_entry

    entry = await _setup(hass)
    rd = _entry(hass, entry).runtime_data
    await rd.coordinator.complete_maintenance(TASK, notes="first")
    first_ts = rd.store.get_history(TASK)[-1]["timestamp"]

    async def _parts_edit_with_a_concurrent_completion(*_args: Any) -> list[Any]:
        rd.store.set_history(TASK, [*rd.store.get_history(TASK), dict(_MEANWHILE)])
        return []

    msg = {
        "type": f"{DOMAIN}/task/history/update",
        "entry_id": entry.entry_id,
        "task_id": TASK,
        "original_timestamp": first_ts,
        "notes": "edited",
        "used_parts": [],
    }
    with patch("custom_components.maintenance_supporter.parts_runtime.async_apply_history_parts_edit", _parts_edit_with_a_concurrent_completion):
        assert_ws_success(await _ws(hass, ws_update_history_entry, msg))
    notes = [h.get("notes") for h in rd.store.get_history(TASK)]
    assert "meanwhile" in notes
    assert "edited" in notes


async def test_a_move_keeps_a_completion_that_landed_meanwhile(hass: HomeAssistant) -> None:
    """task/move snapshotted the Store state, then the delete leg awaited the
    to-do mirror cleanup before dropping it — a completion in that window
    was lost with the source copy."""
    from custom_components.maintenance_supporter.websocket.tasks_persist import async_move_task

    g = _global_entry(hass)
    boiler = _object_entry(hass)
    shed = _object_entry(hass, name="Shed", object_id="shed", task_id="shed_task")
    await setup_integration(hass, g, boiler, shed)

    class _Mirror:
        async def async_forget_task(self, store: Any, task_id: str) -> None:
            store.set_history(task_id, [*store.get_history(task_id), dict(_MEANWHILE)])

    from unittest.mock import patch

    with patch.dict(hass.data[DOMAIN], {"todo_mirror": _Mirror()}):
        await async_move_task(hass, _entry(hass, boiler), _entry(hass, shed), TASK)
    # What ws_move_task does next — and it leaves no timers behind.
    await hass.config_entries.async_reload(boiler.entry_id)
    await hass.config_entries.async_reload(shed.entry_id)
    await hass.async_block_till_done()
    moved = _entry(hass, shed).runtime_data.store.get_history(TASK)
    assert any(h.get("notes") == "meanwhile" for h in moved)


# ─── SEC-8: CSV formula injection through the task type ──────────────────


async def test_the_csv_export_neutralises_a_formula_in_the_task_type(hass: HomeAssistant) -> None:
    """``task_type`` is free text over the WS API and was the one text column
    exported without the formula guard."""
    import csv
    import io

    from custom_components.maintenance_supporter.helpers.csv_handler import export_objects_csv, import_objects_csv

    await _setup(hass, type='=HYPERLINK("https://evil.example","x")')
    exported = export_objects_csv(hass)
    rows = list(csv.DictReader(io.StringIO(exported)))
    assert rows[0]["task_type"].startswith("\t=")
    # The round trip still reads the type back clean.
    parsed = import_objects_csv(exported)
    assert next(iter(parsed[0]["tasks"].values()))["type"].startswith("=HYPERLINK")


# ─── SEC-9: the documents archive export is streamed and capped ──────────


async def test_the_documents_archive_is_refused_above_the_import_ceiling(
    hass: HomeAssistant, hass_client: Any, monkeypatch: pytest.MonkeyPatch
) -> None:
    """The export built the whole ZIP in memory without any ceiling, while
    the import refuses more than 500 MB — now it streams from a temporary
    file (removed afterwards) and refuses such a selection with a 413."""
    import io
    import tempfile
    import zipfile

    from custom_components.maintenance_supporter.helpers import doc_archive
    from custom_components.maintenance_supporter.views import DOCS_ARCHIVE_URL

    await _setup(hass)
    await _add_photo(hass, "boiler")
    client = await hass_client()

    def _leftovers() -> set[str]:
        return {p.name for p in Path(tempfile.gettempdir()).glob("maintenance-documents-*.zip")}

    before = _leftovers()
    resp = await client.get(DOCS_ARCHIVE_URL)
    assert resp.status == 200
    with zipfile.ZipFile(io.BytesIO(await resp.read())) as zf:
        assert any(n.startswith(doc_archive.BLOB_DIR) for n in zf.namelist())
    assert _leftovers() == before, "the temporary archive was not removed"

    monkeypatch.setattr(doc_archive, "MAX_ARCHIVE_BYTES", 4)
    resp = await client.get(DOCS_ARCHIVE_URL)
    assert resp.status == 413
    assert "MB" in (await resp.json())["message"]
    assert _leftovers() == before


# ─── SEC-11: the global search survives a document deleted mid-search ────


async def test_the_search_skips_a_document_deleted_while_it_searched(hass: HomeAssistant) -> None:
    """The text-index search awaits; a document deleted meanwhile raised a
    KeyError and the whole search failed."""
    from custom_components.maintenance_supporter.const import DOCUMENT_STORE_KEY
    from custom_components.maintenance_supporter.websocket.documents import ws_search

    await _setup(hass)
    doc_id = await _add_photo(hass, "boiler")
    store = hass.data[DOMAIN][DOCUMENT_STORE_KEY]
    digest = store.documents[doc_id]["hash"]

    class _Index:
        async def async_search(self, query: str, limit: int) -> list[dict[str, Any]]:
            await store.async_remove(doc_id)
            return [{"digest": digest, "score": 5, "page": 1, "snippet": "boiler manual"}]

        async def async_forget(self, _digest: str) -> None:
            return None

    original = store.text_index
    store.text_index = _Index()
    try:
        conn = await _ws(hass, ws_search, {"type": f"{DOMAIN}/search", "query": "boiler manual"})
    finally:
        store.text_index = original
    assert assert_ws_success(conn)["documents"] == []


# ─── BR-A8 (interface part): deleting a task purges ALL its repair issues ─


async def test_deleting_a_task_removes_every_repair_issue_about_it(hass: HomeAssistant) -> None:
    """Only the task's missing-trigger issues were deleted — a stale
    completion-action notice outlived the task in Settings → Repairs."""
    from homeassistant.helpers import issue_registry as ir

    from custom_components.maintenance_supporter.helpers.issues import stale_action_issue_id
    from custom_components.maintenance_supporter.websocket.tasks_crud import ws_delete_task

    entry = await _setup(hass)
    issue_id = stale_action_issue_id(entry.entry_id, TASK, "light.gone")
    ir.async_create_issue(
        hass,
        DOMAIN,
        issue_id,
        is_fixable=False,
        severity=ir.IssueSeverity.WARNING,
        translation_key="stale_action_entity",
        data={"task_id": TASK},
    )
    assert_ws_success(await _ws(hass, ws_delete_task, {"type": f"{DOMAIN}/task/delete", "entry_id": entry.entry_id, "task_id": TASK}))
    assert ir.async_get(hass).async_get_issue(DOMAIN, issue_id) is None
