"""Bug audit 2026-10-17, tranche 3: the low findings.

Each test names its finding; the fix it pins is described there. W-15 (the
complete service crediting another person) stays as it is: a wall tablet
signed in as a household account credits the children's chores by design.
"""

from __future__ import annotations

import json
from datetime import date, timedelta
from typing import Any
from unittest.mock import MagicMock, patch

import pytest
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.components import persistent_notification
from homeassistant.core import Context, HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_BUDGET_CURRENCY,
    CONF_MAX_NOTIFICATIONS_PER_DAY,
    CONF_NOTIFICATIONS_ENABLED,
    CONF_NOTIFY_SERVICE,
    CONF_OBJECT,
    CONF_PARTS,
    CONF_TASKS,
    DEFAULT_MAX_HISTORY_ENTRIES,
    DOMAIN,
    MAX_SERIES_COUNT,
    NOTIFICATION_MANAGER_KEY,
    STORES_CACHE_KEY,
    ScheduleType,
    TriggerType,
)
from custom_components.maintenance_supporter.intent import INTENT_POSTPONE_TASK, async_setup_intents
from custom_components.maintenance_supporter.intent_household import INTENT_RECORD_READING, parse_spoken_number

from .conftest import (
    assert_ws_success,
    build_object_data,
    build_task_data,
    call_ws_handler,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    set_sensor_state,
    setup_integration,
)


@pytest.fixture(autouse=True)
async def _intents_registered(hass: HomeAssistant):
    await async_setup_intents(hass)


def _days_ago(n: int) -> str:
    return (dt_util.now().date() - timedelta(days=n)).isoformat()


async def _ask(hass: HomeAssistant, intent_type: str, slots: dict[str, Any], *, language: str = "en") -> intent.IntentResponse:
    return await intent.async_handle(
        hass, "test", intent_type, {k: {"value": v} for k, v in slots.items()}, language=language, context=Context()
    )


def _speech(response: intent.IntentResponse) -> str:
    return str(response.speech.get("plain", {}).get("speech", ""))


# ─── N-8 / N-9: spoken readings ─────────────────────────────────────────────


@pytest.mark.parametrize(
    ("text", "language", "value"),
    [
        ("1234.567", "de", 1234.567),
        ("0.125", "de", 0.125),
        ("0,125", "en", 0.125),
        ("1234,567", "en", 1234.567),
        # Still a thousands separator where it reads as one:
        ("12.500", "de", 12500.0),
        ("1.234.567", "de", 1234567.0),
        ("1,234", "en", 1234.0),
    ],
)
def test_n8_a_decimal_point_is_not_taken_for_thousands(text: str, language: str, value: float) -> None:
    """An LLM passes "1234.567" with a point in any language; in German it was
    recorded as 1234567, and "0.125" as 125."""
    assert parse_spoken_number(text, language) == value


async def test_n9_a_reading_goes_to_the_task_that_takes_one(hass: HomeAssistant) -> None:
    """"The water meter reads 1234.5" matched the meter's Reading and its
    Calibration (the object name counts); the classic agent cannot ask back,
    so nothing was recorded."""
    g = make_global_entry(hass)
    tasks = {
        "read": build_task_data(task_id="read", name="Reading", last_performed=_days_ago(40)) | {"type": "reading", "reading_unit": "m³"},
        "cal": build_task_data(task_id="cal", name="Calibration", last_performed=_days_ago(40)),
    }
    obj = make_object_entry(hass, tasks=tasks, name="Water meter", uid="n9")
    await setup_integration(hass, g, obj)

    response = await _ask(hass, INTENT_RECORD_READING, {"name": "water meter", "value": "1234.5"})

    assert response.error_code is None, _speech(response)
    done = [h for h in get_task_store_state(hass, obj.entry_id, "read").get("history", []) if h.get("type") == "completed"]
    assert len(done) == 1 and done[0]["reading_value"] == 1234.5
    assert not [h for h in get_task_store_state(hass, obj.entry_id, "cal").get("history", []) if h.get("type") == "completed"]


# ─── N-12 / C-10: voice postponements ───────────────────────────────────────


async def _oil_change(hass: HomeAssistant) -> MockConfigEntry:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={"t1": build_task_data(task_id="t1", name="Oil Change", last_performed=_days_ago(60))}, name="Car", uid="n12")
    await setup_integration(hass, g, obj)
    return obj


@pytest.mark.parametrize("days", [-3, 0, -(10**12)])
async def test_n12_postpone_by_no_or_negative_days_is_refused(hass: HomeAssistant, days: int) -> None:
    """"By -3 days" moved the due date earlier while the answer said
    "postponed"; a huge negative number raised OverflowError."""
    obj = await _oil_change(hass)

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "days": days})

    assert response.error_code == intent.IntentResponseErrorCode.FAILED_TO_HANDLE
    assert "how far to postpone" in _speech(response)
    assert not get_task_store_state(hass, obj.entry_id, "t1").get("due_override")


async def test_c10_voice_postpones_an_overdue_task_to_today(hass: HomeAssistant) -> None:
    """The panel and the coordinator take today; voice refused it."""
    obj = await _oil_change(hass)
    today = dt_util.now().date().isoformat()

    response = await _ask(hass, INTENT_POSTPONE_TASK, {"name": "oil change", "date": today})

    assert response.error_code is None, _speech(response)
    assert get_task_store_state(hass, obj.entry_id, "t1")["due_override"] == today


# ─── N-10 / N-13 / N-17 / N-18: flow forms ──────────────────────────────────


async def _general_settings(hass: HomeAssistant, options: dict[str, Any] | None = None) -> Any:
    g = make_global_entry(hass, options=options)
    await setup_integration(hass, g)
    result = await hass.config_entries.options.async_init(g.entry_id)
    return await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": "general_settings"})


def _schema_key(result: Any, name: str) -> Any:
    return next(key for key in result["data_schema"].schema if str(key) == name)


async def test_n10_general_settings_fills_the_q_placeholder(hass: HomeAssistant) -> None:
    """The search link's help text and its error name {q}; without a value
    the form read "Translation Error" in every language."""
    result = await _general_settings(hass)
    assert result["step_id"] == "general_settings"
    assert result["description_placeholders"] == {"q": "{q}"}


async def test_n17_an_unsupported_currency_does_not_lock_the_form(hass: HomeAssistant) -> None:
    """A code from an import or the API became the dropdown default, and the
    form refused every save."""
    from custom_components.maintenance_supporter.websocket.dashboard import sanitize_settings_input

    result = await _general_settings(hass, {CONF_BUDGET_CURRENCY: "XYZ"})
    assert _schema_key(result, CONF_BUDGET_CURRENCY).default() == "EUR"
    assert CONF_BUDGET_CURRENCY not in sanitize_settings_input({CONF_BUDGET_CURRENCY: "XYZ"})[0]
    assert sanitize_settings_input({CONF_BUDGET_CURRENCY: "USD"})[0][CONF_BUDGET_CURRENCY] == "USD"


def _options_flow(hass: HomeAssistant, current_task: dict[str, Any]) -> Any:
    from custom_components.maintenance_supporter.config_flow_options_task import MaintenanceOptionsFlow

    flow = MaintenanceOptionsFlow()
    flow.hass = hass
    flow._current_task = current_task
    flow._trigger_entity_id = "sensor.counter"
    flow._trigger_entity_state = None
    return flow


async def test_n13_the_compound_type_step_numbers_its_condition(hass: HomeAssistant) -> None:
    """Its title "Condition #{condition_num} — Type" had no value: Translation Error."""
    await setup_integration(hass, make_global_entry(hass))
    flow = _options_flow(hass, {})
    flow._compound_conditions = [{"type": "threshold"}]

    async def _step() -> Any:
        raise AssertionError("not reached")

    result = await flow._trigger_compound_condition_type(
        None,
        step_id="compound_condition_type",
        threshold_step=_step,
        counter_step=_step,
        state_change_step=_step,
        runtime_step=_step,
        due_date_step=_step,
    )
    assert result["description_placeholders"] == {"condition_num": "2"}


@pytest.mark.parametrize(("stored", "default"), [(-5, None), (7.5, 7.5)])
async def test_n18_a_negative_counter_start_is_not_offered_again(hass: HomeAssistant, stored: float, default: float | None) -> None:
    """The field takes 0 and up; a negative start value stored over the API
    came back as its default and the form refused every save."""
    await setup_integration(hass, make_global_entry(hass))
    tc = {"type": TriggerType.COUNTER, "entity_ids": ["sensor.counter"], "trigger_target_value": 100, "trigger_baseline_value": stored}
    flow = _options_flow(hass, {"trigger_config": tc})

    result = await flow._trigger_counter_config(None, step_id="opt_trigger_counter", on_complete=MagicMock())

    key = _schema_key(result, "trigger_baseline_value")
    assert (None if key.default is vol.UNDEFINED else key.default()) == default


# ─── N-14: Reconfigure on the global entry ──────────────────────────────────


async def test_n14_reconfigure_leaves_the_global_entry_alone(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    data_before = dict(g.data)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_RECONFIGURE, "entry_id": g.entry_id}
    )

    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "reconfigure_global"
    assert dict(g.data) == data_before and CONF_OBJECT not in g.data


# ─── N-15 / N-16: adding a task in the options flow ─────────────────────────


async def test_n15_a_new_sensor_task_starts_without_the_last_tasks_sensors(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    task = build_task_data(
        task_id="t1",
        schedule_type=ScheduleType.SENSOR_BASED,
        trigger_config={"type": TriggerType.THRESHOLD, "entity_id": "sensor.temp", "entity_ids": ["sensor.temp"], "trigger_above": 30.0},
    )
    obj = make_object_entry(hass, tasks={"t1": task}, name="Heater", uid="n15")
    await setup_integration(hass, g, obj)

    flow = await hass.config_entries.options.async_init(obj.entry_id)
    fid = flow["flow_id"]
    result = await hass.config_entries.options.async_configure(fid, {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(fid, {"selected_task": "t1", "go_back": False})
    assert result["step_id"] == "task_action"
    result = await hass.config_entries.options.async_configure(fid, {"next_step_id": "manage_tasks"})
    result = await hass.config_entries.options.async_configure(fid, {"selected_task": "t1", "go_back": True})
    assert result["step_id"] == "init"
    result = await hass.config_entries.options.async_configure(fid, {"next_step_id": "add_task"})
    result = await hass.config_entries.options.async_configure(
        fid, {"name": "Second", "type": "cleaning", "schedule_type": ScheduleType.SENSOR_BASED, "go_back": False}
    )

    assert result["step_id"] == "opt_sensor_select"
    assert _schema_key(result, "trigger_entity").default is vol.UNDEFINED


async def test_n16_an_archived_object_says_why_it_takes_no_task(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj_data = build_object_data(name="Old boiler", object_id="n16") | {"archived_at": "2026-10-01T10:00:00+00:00"}
    obj = make_object_entry(hass, tasks={"t1": build_task_data(task_id="t1")}, name="Old boiler", uid="n16", object_data=obj_data)
    await setup_integration(hass, g, obj)

    flow = await hass.config_entries.options.async_init(obj.entry_id)
    result = await hass.config_entries.options.async_configure(flow["flow_id"], {"next_step_id": "add_task"})

    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "archived_no_new_tasks"


async def test_n16_the_task_limit_is_said_before_and_at_saving(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={"t1": build_task_data(task_id="t1")}, name="Busy", uid="n16b")
    await setup_integration(hass, g, obj)

    with patch("custom_components.maintenance_supporter.config_flow_options_task_base.MAX_TASKS_PER_OBJECT", 1):
        flow = await hass.config_entries.options.async_init(obj.entry_id)
        result = await hass.config_entries.options.async_configure(flow["flow_id"], {"next_step_id": "add_task"})
    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "task_limit"
    assert result["description_placeholders"] == {"max": "1"}

    # The cap reached while the form was open (another surface added one).
    flow = await hass.config_entries.options.async_init(obj.entry_id)
    fid = flow["flow_id"]
    await hass.config_entries.options.async_configure(fid, {"next_step_id": "add_task"})
    result = await hass.config_entries.options.async_configure(
        fid, {"name": "Late", "type": "cleaning", "schedule_type": ScheduleType.MANUAL, "go_back": False}
    )
    with (
        patch("custom_components.maintenance_supporter.config_flow_options_task_base.MAX_TASKS_PER_OBJECT", 1),
        patch("custom_components.maintenance_supporter.helpers.entry_tasks.MAX_TASKS_PER_OBJECT", 1),
    ):
        result = await hass.config_entries.options.async_configure(fid, {"warning_days": 7, "go_back": False})
    assert result["type"] == FlowResultType.ABORT and result["reason"] == "task_limit"
    assert len(obj.data[CONF_TASKS]) == 1


# ─── N-11 / N-19: notifications ─────────────────────────────────────────────


async def test_n11_tasks_that_cannot_notify_leave_the_waiting_lists(hass: HomeAssistant) -> None:
    """Only a completion or a delete took a task off the daily-limit lists: a
    postponed or muted task kept the "starved first" budget for good."""
    g = make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.mobile_app",
        options={CONF_NOTIFICATIONS_ENABLED: True, CONF_NOTIFY_SERVICE: "notify.mobile_app", CONF_MAX_NOTIFICATIONS_PER_DAY: 5},
    )
    tasks = {
        "fine": build_task_data(task_id="fine", name="Fine", last_performed=_days_ago(1)),
        "muted": build_task_data(task_id="muted", name="Muted", last_performed=_days_ago(60)) | {"notify_enabled": False},
    }
    obj = make_object_entry(hass, tasks=tasks, name="House", uid="n11")
    await setup_integration(hass, g, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    keys = {f"{obj.entry_id}_fine", f"{obj.entry_id}_muted"}
    nm._starved |= keys
    nm._deferred_today |= keys

    await obj.runtime_data.coordinator.async_refresh_now()

    assert not keys & (nm._starved | nm._deferred_today)


async def test_n19_a_persistent_notification_card_is_dismissed(hass: HomeAssistant) -> None:
    """Dismissal only reached Companion phones: with notify_completed off an
    "overdue" card stayed forever."""
    from custom_components.maintenance_supporter.helpers.notification_ids import task_tag
    from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager

    g = make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.persistent_notification",
        options={CONF_NOTIFICATIONS_ENABLED: True, CONF_NOTIFY_SERVICE: "notify.persistent_notification"},
    )
    await setup_integration(hass, g)
    card = f"{DOMAIN}_{task_tag('t1')}"
    persistent_notification.async_create(hass, "Filter overdue", notification_id=card)
    other = f"{DOMAIN}_{task_tag('t2')}"
    persistent_notification.async_create(hass, "Descale overdue", notification_id=other)
    nm = NotificationManager(hass)

    await nm.async_dismiss_task_notification("t1")

    cards = persistent_notification._async_get_or_create_notifications(hass)
    assert card not in cards and other in cards


# ─── N-20: room words in every script ───────────────────────────────────────


@pytest.mark.parametrize(
    ("name", "reason"),
    [("정원", "area_garden"), ("ガレージ", "area_garage"), ("сарай", "area_shed"), ("차고", "area_garage")],
)
def test_n20_folded_keywords_match_folded_area_names(name: str, reason: str) -> None:
    from custom_components.maintenance_supporter.helpers.home_profile import guess_dwelling

    assert reason in guess_dwelling([], [name], []).reasons


def test_n20_a_japanese_balcony_marks_an_apartment() -> None:
    from custom_components.maintenance_supporter.helpers.home_profile import guess_dwelling

    assert guess_dwelling([], ["ベランダ"], []).reasons == ("area_balcony",)


# ─── W-4: a swapped device's action belongs to who chose the device ─────────


async def test_w4_a_retargeted_action_is_stamped_with_the_saving_user(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.device_swap import move_tasks_to_device

    from .test_device_swap import _brush_task, _vacuum

    old_dev, old = _vacuum(hass, "q7_old", "Robot Old")
    new_dev, _new = _vacuum(hass, "q7_new", "Robot New")
    moved_task = _brush_task(old, old_dev.id)
    moved_task["on_complete_action"]["configured_by"] = "admin-1"
    kept_task = build_task_data(task_id="kept") | {
        "on_complete_action": {"service": "light.turn_on", "target": {"entity_id": "light.hall"}, "configured_by": "admin-1"}
    }

    moved, _report = move_tasks_to_device(hass, {"brush": moved_task, "kept": kept_task}, {old_dev.id}, new_dev.id, user_id="operator-7")

    assert moved["brush"]["on_complete_action"]["configured_by"] == "operator-7"
    assert moved["kept"]["on_complete_action"]["configured_by"] == "admin-1"


# ─── W-5 / W-6 / W-7 / W-9: what an import or a client sends ────────────────


def test_w5_text_fields_take_text_only() -> None:
    from custom_components.maintenance_supporter.helpers.sanitize import cap_object_fields, cap_task_fields

    task = cap_task_fields({"name": "Filter", "documentation_url": ["https://a"], "notes": 5, "custom_icon": {"x": 1}, "responsible_user_id": None})
    assert "documentation_url" not in task and "custom_icon" not in task
    assert task["notes"] == "5" and task["responsible_user_id"] is None
    obj = {"name": "Boiler", "manufacturer": ["Acme"], "model": 3000, "notes": True}
    cap_object_fields(obj)
    assert "manufacturer" not in obj and "notes" not in obj and obj["model"] == "3000"


async def test_w6_a_number_for_a_name_skips_that_object_only(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.io import ws_import_json

    await setup_integration(hass, make_global_entry(hass))
    payload = {"objects": [{"object": {"name": 5}, "tasks": []}, {"object": {"name": "Boiler"}, "tasks": []}]}
    conn = make_ws_connection()
    await call_ws_handler(ws_import_json, hass, conn, {"id": 1, "type": f"{DOMAIN}/json/import", "json_content": json.dumps(payload)})
    await hass.async_block_till_done()

    result = assert_ws_success(conn)
    assert [i["name"] for i in result["imported"]] == ["Boiler"]
    assert {"name": "object 1", "reason": "missing name"} in result["errors"]


def test_w7_task_refs_that_are_no_list_are_no_refs() -> None:
    from custom_components.maintenance_supporter.helpers.sanitize import sanitize_group

    assert sanitize_group({"name": "Kitchen", "task_refs": 5}) == {"name": "Kitchen", "description": "", "task_refs": []}


@pytest.mark.parametrize(
    "trigger",
    [
        {"type": ["threshold"], "entity_ids": ["sensor.a"], "trigger_above": 1},
        {"type": "threshold", "entity_ids": [5], "trigger_above": 1},
        {"type": "threshold", "entity_ids": [["sensor.a"]], "trigger_above": 1},
        {"type": "compound", "conditions": [{"type": "threshold", "entity_ids": [None], "trigger_above": 1}, {"type": "threshold", "entity_ids": ["sensor.b"], "trigger_above": 1}]},
    ],
)
def test_w9_a_malformed_trigger_is_refused_not_thrown(hass: HomeAssistant, trigger: dict[str, Any]) -> None:
    from custom_components.maintenance_supporter.websocket.tasks_validation import _validate_trigger_config

    errors, _warnings = _validate_trigger_config(hass, trigger)
    assert errors


# ─── W-8: the CSV import keeps a task's own archive ─────────────────────────


def test_w8_a_task_archived_on_its_own_stays_archived_on_its_own() -> None:
    from custom_components.maintenance_supporter.const import ARCHIVE_REASON_MANUAL, ARCHIVE_REASON_OBJECT
    from custom_components.maintenance_supporter.helpers.csv_handler import import_objects_csv

    csv_content = (
        "object_name,object_archived_at,task_name,schedule_type,interval_days,task_archived_at\n"
        "Boiler,2026-10-01T10:00:00+00:00,Service,time_based,365,2026-09-01T10:00:00+00:00\n"
        "Boiler,,Bleed,time_based,30,\n"
    )
    (boiler,) = import_objects_csv(csv_content)
    service, bleed = boiler["tasks"].values()
    assert service["archived_reason"] == ARCHIVE_REASON_MANUAL and service["archived_at"] == "2026-09-01T10:00:00+00:00"
    assert bleed["archived_reason"] == ARCHIVE_REASON_OBJECT


# ─── W-10: the add_object service ───────────────────────────────────────────


async def test_w10_add_object_refuses_a_blank_name_and_mends_dates(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "add_object", {"name": "   "}, blocking=True, return_response=True)
    assert err.value.translation_key == "name_empty"

    response = await hass.services.async_call(
        DOMAIN, "add_object", {"name": "Boiler", "installation_date": "20261001"}, blocking=True, return_response=True
    )
    assert response is not None
    entry = hass.config_entries.async_get_entry(str(response["entry_id"]))
    assert entry is not None and entry.data[CONF_OBJECT]["installation_date"] == "2026-10-01"


# ─── W-11 / C-8: history ordered by the instant ─────────────────────────────


def test_w11_deleting_the_latest_completion_rewinds_its_phase_across_offsets() -> None:
    """Across the clocks going back, 02:10+01:00 is AFTER 02:30+02:00; read as
    text the earlier entry was "latest", the anchor rewound and the phase
    stayed, so the step just undone was skipped."""
    from custom_components.maintenance_supporter.websocket.tasks_history import _rewind_phase_cursor

    store = MagicMock()
    store.get_task_state.return_value = {"phase_cursor": 0}
    history = [
        {"type": "completed", "timestamp": "2026-10-25T02:30:00+02:00", "phase_id": "p1"},
        {"type": "completed", "timestamp": "2026-10-25T02:10:00+01:00", "phase_id": "p2"},
    ]
    _rewind_phase_cursor(store, "t1", {"phase_sequence": ["p1", "p2"]}, history, "2026-10-25T02:10:00+01:00")
    store.set_phase_cursor.assert_called_once_with("t1", 1)


def test_c8_completions_are_numbered_in_date_order_across_offsets() -> None:
    from custom_components.maintenance_supporter.helpers.reference_numbers import assign_history_refs, compact_history_refs

    later = {"type": "completed", "timestamp": "2026-10-25T02:10:00+01:00"}
    earlier = {"type": "completed", "timestamp": "2026-10-25T02:30:00+02:00"}
    store = MagicMock()
    store.get_history.return_value = [later, earlier]
    state: dict[str, Any] = {}
    store.get_task_state.return_value = state
    store.update_task_state.side_effect = lambda _tid, **kw: state.update(kw)

    assign_history_refs(store, {"t1": {}})
    assert (earlier["ref_no"], later["ref_no"]) == (1, 2)
    later["ref_no"], earlier["ref_no"] = 1, 2
    compact_history_refs(store, {"t1": {}})
    assert (earlier["ref_no"], later["ref_no"]) == (1, 2)


# ─── W-13: settings errors arrive as their code ─────────────────────────────


async def test_w13_a_settings_error_is_its_code_not_raw_english(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.dashboard import ws_update_global_settings

    await setup_integration(hass, make_global_entry(hass))
    conn = make_ws_connection()
    await call_ws_handler(
        ws_update_global_settings, hass, conn, {"id": 1, "type": f"{DOMAIN}/global/update", "settings": {"notify_service": "notify.Bad Name"}}
    )
    code, message = conn.send_error.call_args[0][1:3]
    assert code == "invalid_notify_service"
    assert message == "invalid notify service"


# ─── W-14: the settings import keeps to vacation/update and the id limits ───


async def test_w14_settings_import_dates_ranges_and_ids(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.global_options import get_global_options
    from custom_components.maintenance_supporter.websocket.io import _apply_settings_import

    await setup_integration(hass, make_global_entry(hass))
    long_id = "g" * 80
    today = dt_util.now().date()
    _apply_settings_import(
        hass,
        {
            "vacation_start": (today + timedelta(days=3)).strftime("%Y%m%d"),
            "vacation_end": (today + timedelta(days=9)).isoformat(),
            "groups": {long_id: {"name": "Kitchen"}},
            "saved_filter_views": [{"id": "v" * 80, "name": "Mine"}],
        },
    )
    opts = get_global_options(hass)
    assert opts["vacation_start"] == (today + timedelta(days=3)).isoformat()
    (gid,) = opts["groups"]
    assert 0 < len(gid) <= 64 and opts["groups"][gid]["name"] == "Kitchen"
    assert len(opts["saved_filter_views"][0]["id"]) <= 64

    _apply_settings_import(hass, {"vacation_start": (today + timedelta(days=9)).isoformat(), "vacation_end": (today + timedelta(days=3)).isoformat()})
    opts = get_global_options(hass)
    assert opts["vacation_start"] == (today + timedelta(days=3)).isoformat(), "a reversed range is not applied"


# ─── T-6 / T-7 / T-8 / T-9: triggers ────────────────────────────────────────


def _mock_host(hass: HomeAssistant) -> MagicMock:
    from .test_triggers import _make_mock_entity

    return _make_mock_entity(hass)


@pytest.mark.parametrize("at_setup", ["unavailable", None])
async def test_t6_a_hold_window_resumes_when_the_entity_restores_late(hass: HomeAssistant, at_setup: str | None) -> None:
    """Resumed only when the entity was ready at setup: a Zigbee sensor that
    restored late (unavailable, or not there yet) never counted the state
    that kept holding."""
    from custom_components.maintenance_supporter.entity.triggers.state_change import StateChangeTrigger

    if at_setup is not None:
        set_sensor_state(hass, "binary_sensor.leak", at_setup)
    since = (dt_util.utcnow() - timedelta(minutes=10)).isoformat()
    trigger = StateChangeTrigger(
        hass,
        _mock_host(hass),
        {
            "entity_id": "binary_sensor.leak",
            "attribute": None,
            "type": TriggerType.STATE_CHANGE,
            "trigger_to_state": "on",
            "trigger_target_changes": 1,
            "trigger_for_minutes": 5,
            "trigger_state_pending_since": since,
            "trigger_state_pending_state": "on",
        },
    )
    await trigger.async_setup()
    assert trigger.change_count == 0

    hass.states.async_set("binary_sensor.leak", "on")
    await hass.async_block_till_done()

    assert trigger.change_count == 1 and trigger._triggered is True
    await trigger.async_teardown()


async def test_t7_a_deferred_rebaseline_survives_a_reload(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.entity.triggers import _inject_per_entity_state
    from custom_components.maintenance_supporter.entity.triggers.counter import CounterTrigger

    host = _mock_host(hass)
    config = {"entity_id": "sensor.odometer", "attribute": None, "type": TriggerType.COUNTER, "trigger_target_value": 100, "trigger_delta_mode": True, "trigger_baseline_value": 50.0}
    trigger = CounterTrigger(hass, host, dict(config))
    trigger._current_value = None
    trigger.reset_baseline()  # completed while the source had no reading
    await hass.async_block_till_done()
    persisted = host.coordinator.async_persist_trigger_runtime.await_args.args[1]
    assert persisted == {"baseline_value": 50.0, "rebaseline_pending": True}

    reloaded = dict(config)
    _inject_per_entity_state(reloaded, persisted)
    fresh = CounterTrigger(hass, _mock_host(hass), reloaded)
    assert fresh._reset_pending is True
    fresh._evaluate_and_update(300.0)  # the first reading after the reload
    assert fresh._baseline_value == 300.0 and fresh._triggered is False


async def test_t8_unavailable_then_on_keeps_the_restored_anchor(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.entity.triggers.runtime import RuntimeTrigger

    anchor = (dt_util.utcnow() - timedelta(hours=2)).isoformat()
    set_sensor_state(hass, "switch.pump", "unavailable")
    trigger = RuntimeTrigger(
        hass,
        _mock_host(hass),
        {"entity_id": "switch.pump", "attribute": None, "type": TriggerType.RUNTIME, "trigger_runtime_hours": 100, "trigger_accumulated_seconds": 3600.0, "trigger_on_since": anchor},
    )
    await trigger.async_setup()

    hass.states.async_set("switch.pump", "on")
    await hass.async_block_till_done()

    assert trigger._on_since == anchor, "the restart gap is still to be booked"
    await trigger.async_teardown()


async def test_t9_undoing_a_completion_puts_the_trigger_progress_back(hass: HomeAssistant) -> None:
    """A mis-tapped Complete on a pump at 180 of 200 hours, undone, read 0."""
    from custom_components.maintenance_supporter.helpers import voice_undo

    hass.states.async_set("switch.pump", "off")
    g = make_global_entry(hass)
    task = build_task_data(
        task_id="pump",
        name="Pump service",
        schedule_type=ScheduleType.SENSOR_BASED,
        interval_days=None,
        trigger_config={"type": TriggerType.RUNTIME, "entity_id": "switch.pump", "entity_ids": ["switch.pump"], "trigger_runtime_hours": 200},
    )
    obj = make_object_entry(hass, tasks={"pump": task}, name="Pump", uid="t9")
    await setup_integration(hass, g, obj)
    store = obj.runtime_data.store
    store.set_trigger_runtime("pump", "switch.pump", {"accumulated_seconds": 180 * 3600.0})
    before = voice_undo.capture(hass, obj.entry_id, "pump")

    await obj.runtime_data.coordinator.complete_maintenance("pump")
    await hass.async_block_till_done()
    assert store.get_task_state("pump")["trigger_runtime"]["switch.pump"]["accumulated_seconds"] == 0
    assert voice_undo.remember_as(hass, "user:u1", "completed", before)
    record = voice_undo.pop_as(hass, "user:u1")
    assert record is not None

    with patch.object(hass.config_entries, "async_schedule_reload") as reload:
        await voice_undo.async_restore(hass, record)

    assert store.get_task_state("pump")["trigger_runtime"]["switch.pump"]["accumulated_seconds"] == 180 * 3600.0
    reload.assert_called_once_with(obj.entry_id)


# ─── C-3: postponing the last occurrence past the series end ────────────────


def test_c3_a_postponed_last_occurrence_stays_in_its_series() -> None:
    from custom_components.maintenance_supporter.helpers.schedule import Schedule

    weekly = Schedule.from_dict({"kind": "interval", "every": 7, "unit": "days", "ends": {"until": "2026-12-31"}})
    state = {"last_performed": date(2026, 12, 20), "created_at": date(2026, 1, 1), "last_planned_due": None, "today": date(2026, 12, 21)}
    assert weekly.next_due(**state) == date(2026, 12, 27)
    assert weekly.next_due(**state, due_override=date(2027, 1, 3)) == date(2027, 1, 3)
    # Done on the postponed day, the series is over.
    assert weekly.next_due(**{**state, "last_performed": date(2027, 1, 3)}, due_override=date(2027, 1, 3)) is None
    # A series already past its end is not brought back by a postponement.
    ended = {**state, "last_performed": date(2026, 12, 27)}
    assert weekly.next_due(**ended, due_override=date(2027, 1, 3)) is None


# ─── C-4: skip and reset forget the reminders after persisting ──────────────


@pytest.mark.parametrize("action", ["skip", "reset"])
async def test_c4_the_reminder_stamp_stays_until_the_new_cycle_is_stored(hass: HomeAssistant, action: str) -> None:
    from custom_components.maintenance_supporter.const import MaintenanceStatus
    from custom_components.maintenance_supporter.helpers.notification_manager import notification_key

    g = make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.mobile_app",
        options={CONF_NOTIFICATIONS_ENABLED: True, CONF_NOTIFY_SERVICE: "notify.mobile_app"},
    )
    obj = make_object_entry(hass, tasks={"t1": build_task_data(task_id="t1", last_performed=_days_ago(60))}, name="Boiler", uid="c4")
    await setup_integration(hass, g, obj)
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    key = notification_key(obj.entry_id, "t1", MaintenanceStatus.OVERDUE)
    nm._last_notified[key] = dt_util.now()
    coordinator = obj.runtime_data.coordinator
    seen: list[bool] = []
    original = coordinator._persist_and_signal_task_change

    async def _persist(*args: Any, **kwargs: Any) -> None:
        seen.append(key in nm._last_notified)
        await original(*args, **kwargs)

    with patch.object(coordinator, "_persist_and_signal_task_change", _persist):
        if action == "skip":
            await coordinator.skip_maintenance("t1")
        else:
            await coordinator.reset_maintenance("t1")

    assert seen == [True], "a refresh running meanwhile still sees the reminder as sent"
    assert key not in nm._last_notified


# ─── C-5: the next-dates preview knows the task's cycle ─────────────────────


def test_c5_the_preview_starts_at_a_postponement() -> None:
    from custom_components.maintenance_supporter.helpers.schedule import Schedule, preview_occurrences

    monthly = Schedule.from_dict({"kind": "interval", "every": 30, "unit": "days", "anchor": "planned"})
    dates, _ended = preview_occurrences(
        monthly, last_performed=date(2026, 10, 1), today=date(2026, 10, 20),
        last_planned_due=date(2026, 10, 1), due_override=date(2026, 11, 10),
    )
    # The postponed one, then the planned grid again (Oct 31 + 30).
    assert dates == [date(2026, 11, 10), date(2026, 11, 30), date(2026, 12, 30)]


async def test_c5_the_panel_preview_reads_the_edited_tasks_cycle(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.websocket.dashboard import ws_schedule_preview

    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={"t1": build_task_data(task_id="t1", last_performed=_days_ago(10), interval_days=30)}, name="Boiler", uid="c5")
    await setup_integration(hass, g, obj)
    override = (dt_util.now().date() + timedelta(days=40)).isoformat()
    obj.runtime_data.store.update_task_state("t1", due_override=override)
    msg = {"id": 1, "type": f"{DOMAIN}/schedule/preview", "schedule": {"kind": "interval", "every": 30, "unit": "days"}, "last_performed": _days_ago(10), "count": 3, "times_performed": 0}

    conn = make_ws_connection()
    await call_ws_handler(ws_schedule_preview, hass, conn, {**msg, "entry_id": obj.entry_id, "task_id": "t1"})
    assert assert_ws_success(conn)["occurrences"][0] == override

    # A new last-performed day in the dialog re-anchors on saving: no postpone.
    conn = make_ws_connection()
    await call_ws_handler(ws_schedule_preview, hass, conn, {**msg, "last_performed": _days_ago(2), "entry_id": obj.entry_id, "task_id": "t1"})
    assert assert_ws_success(conn)["occurrences"][0] == (dt_util.now().date() + timedelta(days=28)).isoformat()


# ─── C-6: the calendar keeps a paused owner's pool buy task ─────────────────


async def test_c6_a_paused_objects_pool_buy_task_stays_on_the_calendar(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.parts import POOL_IN_USE_FIELD

    g = make_global_entry(hass)
    obj_data = build_object_data(name="Garage", object_id="c6") | {"paused_at": "2026-10-01T10:00:00+00:00"}
    tasks = {
        "buy": build_task_data(task_id="buy", name="Buy filters", last_performed=_days_ago(25), interval_days=30, object_id="c6") | {POOL_IN_USE_FIELD: True},
        "wash": build_task_data(task_id="wash", name="Wash car", last_performed=_days_ago(25), interval_days=30, object_id="c6"),
    }
    obj = make_object_entry(hass, tasks=tasks, name="Garage", uid="c6", object_data=obj_data)
    await setup_integration(hass, g, obj)

    calendar = hass.data[DOMAIN]["_calendar_entity"]
    now = dt_util.now()
    summaries = [e.summary for e in await calendar.async_get_events(hass, now - timedelta(days=1), now + timedelta(days=30))]

    assert any("Buy filters" in s for s in summaries)
    assert not any("Wash car" in s for s in summaries)


# ─── C-7: overdue the day after ─────────────────────────────────────────────


def test_c7_the_vacation_preview_says_overdue_the_day_after() -> None:
    from custom_components.maintenance_supporter.helpers.vacation import _events_from_next_due

    today = date(2026, 10, 20)
    events = _events_from_next_due(date(2026, 10, 25), 3, today, today, date(2026, 11, 5))
    assert [(e.date, e.status) for e in events] == [(date(2026, 10, 22), "due_soon"), (date(2026, 10, 26), "overdue")]
    # Due today: overdue tomorrow, not today. Due yesterday: overdue today.
    (event,) = _events_from_next_due(today, 3, today, today, date(2026, 11, 5))
    assert (event.date, event.status) == (date(2026, 10, 21), "overdue")
    (event,) = _events_from_next_due(date(2026, 10, 19), 3, today, today, date(2026, 11, 5))
    assert (event.date, event.status) == (today, "overdue")


# ─── C-9 / C-11: done is done ───────────────────────────────────────────────


def test_c9_a_completed_one_time_task_with_a_trigger_is_done() -> None:
    """Stored, the task has a nested one-time schedule and a trigger; its
    derived schedule label then reads sensor_based, and is_done checked that."""
    from custom_components.maintenance_supporter.helpers.schedule import normalize_task_storage
    from custom_components.maintenance_supporter.models.maintenance_task import MaintenanceTask

    stored = normalize_task_storage(
        build_task_data(task_id="t1", schedule_type=ScheduleType.ONE_TIME, interval_days=None, last_performed="2026-10-01")
        | {"due_date": "2026-10-01", "trigger_config": {"type": "threshold", "entity_ids": ["sensor.a"], "trigger_above": 1}}
    )
    task = MaintenanceTask.from_dict(stored)
    assert task.schedule_type == ScheduleType.SENSOR_BASED, "the derived label the old check read"
    assert task.is_done


def test_c11_a_series_count_stays_within_what_the_history_holds() -> None:
    from custom_components.maintenance_supporter.helpers.schedule import Schedule

    assert Schedule.from_dict({"kind": "interval", "every": 1, "unit": "days", "ends": {"count": 600}}).ends_count == MAX_SERIES_COUNT


def test_c11_the_dialog_caps_the_count_like_the_backend() -> None:
    from pathlib import Path

    dialog = Path(__file__).parents[1] / "custom_components" / "maintenance_supporter" / "frontend-src" / "components" / "task-dialog.ts"
    assert f'type="number" min="1" max="{MAX_SERIES_COUNT}"' in dialog.read_text(encoding="utf-8")


def test_c11_the_history_trim_gives_up_completions_last() -> None:
    from custom_components.maintenance_supporter.helpers.history import trim_history

    history: list[dict[str, Any]] = [{"type": "completed", "timestamp": f"2025-01-01T00:{i // 60:02d}:{i % 60:02d}+00:00"} for i in range(300)]
    history += [{"type": "skipped", "timestamp": f"2025-06-01T00:{i // 60:02d}:{i % 60:02d}+00:00"} for i in range(200)]
    history.append({"type": "triggered", "timestamp": "2025-07-01T00:00:00+00:00"})
    history.append({"type": "skipped", "timestamp": "2025-08-01T00:00:00+00:00"})
    trimmed = trim_history(history, DEFAULT_MAX_HISTORY_ENTRIES)
    assert len(trimmed) == DEFAULT_MAX_HISTORY_ENTRIES
    assert sum(1 for h in trimmed if h["type"] == "completed") == 300
    assert trimmed[-1]["timestamp"] == "2025-08-01T00:00:00+00:00", "the newest entry stays"
    assert not any(h["type"] == "triggered" for h in trimmed)


def test_c11_the_store_trims_by_the_same_rule(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.storage import MaintenanceStore

    store = MaintenanceStore(hass, "e1")
    for i in range(DEFAULT_MAX_HISTORY_ENTRIES):
        store.append_history("t1", {"type": "completed" if i < 10 else "skipped", "timestamp": f"2025-{i // 28 % 12 + 1:02d}-{i % 28 + 1:02d}T00:00:00+00:00"})
    store.append_history("t1", {"type": "triggered", "timestamp": "2026-01-01T00:00:00+00:00"})
    assert sum(1 for h in store.get_history("t1") if h["type"] == "completed") == 10


# ─── S-9: a folded battery part keeps one price ─────────────────────────────


def test_s9_price_package_and_restock_come_from_one_side() -> None:
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import _merge_parts

    canonical = {"id": "batt_aa", "name": "AA", "cost": 0.5, "restock_quantity": 8}
    alias = {"id": "x", "name": "AA alias", "package_size": 4, "restock_quantity": 2}
    merged = _merge_parts(canonical, alias)
    assert merged["cost"] == 0.5 and "package_size" not in merged and merged["restock_quantity"] == 8

    unpriced = {"id": "batt_aa", "name": "AA", "restock_quantity": 8}
    priced_alias = {"id": "x", "name": "AA 4-pack", "cost": 2.0, "package_size": 4, "restock_quantity": 2}
    merged = _merge_parts(unpriced, priced_alias)
    assert (merged["cost"], merged["package_size"], merged["restock_quantity"]) == (2.0, 4, 2)


# ─── S-10 / S-15: a reloading owner's Store ─────────────────────────────────


async def test_s10_s15_a_reloading_owners_store_is_still_reached(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.helpers.budget import compute_spend
    from custom_components.maintenance_supporter.parts_runtime import resolve_part_link

    g = make_global_entry(hass)
    history = [{"type": "completed", "timestamp": dt_util.now().isoformat(), "cost": 40.0}]
    obj = make_object_entry(
        hass,
        tasks={"t1": build_task_data(task_id="t1", last_performed=_days_ago(1), history=history)},
        name="Pool",
        uid="s10",
        extra_data={CONF_PARTS: {"p1": {"id": "p1", "name": "Filter"}}},
    )
    await setup_integration(hass, g, obj)
    store = obj.runtime_data.store
    assert compute_spend(hass)[1] == 40.0

    with patch.object(obj, "runtime_data", None):  # mid-reload
        assert hass.data[STORES_CACHE_KEY][obj.entry_id] is store
        assert resolve_part_link(hass, obj, {"part_id": "p1"})[2] is store
        assert compute_spend(hass)[1] == 40.0


# ─── S-14: one buy reminder per part ────────────────────────────────────────


def test_s14_a_second_reminder_for_one_part_goes() -> None:
    from custom_components.maintenance_supporter.helpers.parts import PART_REF_FIELD, reconcile_buy_tasks

    parts = {"p1": {"id": "p1", "name": "Filter", "auto_buy_task": True, "reorder_threshold": 2}}
    tasks = {
        "done": {"id": "done", PART_REF_FIELD: {"part_id": "p1"}, "last_performed": "2026-10-01"},
        "open_a": {"id": "open_a", PART_REF_FIELD: {"part_id": "p1"}},
        "open_b": {"id": "open_b", PART_REF_FIELD: {"part_id": "p1"}},
    }
    result, created, removed, changed = reconcile_buy_tasks(
        parts, {"p1": 0}, tasks,
        object_id="o", lang="en", search_template=None, today=date(2026, 10, 20),
        is_task_done=lambda t: bool(t.get("last_performed")),
    )
    assert changed and not created
    assert removed == ["open_b"]
    assert PART_REF_FIELD in result["open_a"] and PART_REF_FIELD not in result["done"]


# ─── S-16: money spent keeps counting ───────────────────────────────────────


def test_s16_an_auto_archived_task_that_booked_money_is_not_deleted() -> None:
    from custom_components.maintenance_supporter.helpers.retention import should_auto_delete

    base = {"archived_at": "2026-01-01T10:00:00+00:00", "archived_reason": "auto"}
    today = date(2026, 10, 20)
    paid = base | {"history": [{"type": "completed", "timestamp": "2025-12-01T10:00:00+00:00", "cost": 12.5}]}
    free = base | {"history": [{"type": "completed", "timestamp": "2025-12-01T10:00:00+00:00"}]}
    assert should_auto_delete(paid, delete_days=30, today=today) is False
    assert should_auto_delete(free, delete_days=30, today=today) is True
