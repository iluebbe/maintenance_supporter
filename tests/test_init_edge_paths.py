"""__init__.py runtime — gates and refusals the happy-path suites skip.

Every path here protects a real user outcome: lead reminders must not fire
for retired / paused / unloaded objects, a notification button or NFC tap on
a task that demands details must leave the task OPEN (and the reminder on
screen), services must refuse targets that are not tasks, a renamed shopping
list must stay connected, and a failing side-step (fleet reconcile, shared
part hand-over) must never take setup or removal down with it.
"""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.config_entries import ConfigEntryDisabler, ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter import (
    NOTIFICATION_MANAGER_KEY,
    _trigger_target_and_unit,
    async_maybe_send_lead_reminders,
    async_maybe_send_warranty_reminders,
)
from custom_components.maintenance_supporter.const import (
    CONF_REMINDER_LEAD_DAYS,
    CONF_SHOPPING_LIST_ENTITY,
    CONF_WARRANTY_REMINDER_ENABLED,
    DOMAIN,
    STORES_CACHE_KEY,
)

from .conftest import (
    TASK_ID_1,
    TASK_ID_2,
    build_object_data,
    build_object_entry_data,
    build_task_data,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    setup_integration,
)


def _due_in(days: int, name: str, task_id: str = TASK_ID_1) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=30 - days)).isoformat()
    return build_task_data(task_id=task_id, name=name, interval_days=30, last_performed=last)


def _mock_nm() -> MagicMock:
    nm = MagicMock()
    nm.async_send_lead_reminder = AsyncMock()
    nm.async_send_warranty_reminder = AsyncMock()
    nm.is_snoozed.return_value = False
    return nm


def _disabled_object(hass: HomeAssistant, name: str, uid: str, tasks: dict[str, Any]) -> MockConfigEntry:
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title=name,
        data=build_object_entry_data(object_data=build_object_data(name=name, object_id=f"obj_{uid}"), tasks=tasks),
        source="user",
        unique_id=f"maintenance_supporter_{uid}",
        disabled_by=ConfigEntryDisabler.USER,
    )
    entry.add_to_hass(hass)
    return entry


def _completions(hass: HomeAssistant, entry: MockConfigEntry) -> list[dict[str, Any]]:
    history = get_task_store_state(hass, entry.entry_id, TASK_ID_1).get("history", [])
    return [h for h in history if h.get("type") == "completed"]


# ─── lead / warranty reminders ───────────────────────────────────────────


async def test_reminders_without_a_global_entry_send_nothing(hass: HomeAssistant) -> None:
    nm = _mock_nm()
    hass.data.setdefault(DOMAIN, {})[NOTIFICATION_MANAGER_KEY] = nm

    await async_maybe_send_lead_reminders(hass)
    await async_maybe_send_warranty_reminders(hass, force=True)

    nm.async_send_lead_reminder.assert_not_awaited()
    nm.async_send_warranty_reminder.assert_not_awaited()


async def test_lead_reminders_without_a_notification_manager_are_a_quiet_no_op(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, extra_data={CONF_REMINDER_LEAD_DAYS: [14]})
    obj = make_object_entry(hass, tasks={TASK_ID_1: _due_in(14, "Hit")}, name="Pool", uid="lead_nonm")
    await setup_integration(hass, g, obj)
    hass.data[DOMAIN].pop(NOTIFICATION_MANAGER_KEY)

    await async_maybe_send_lead_reminders(hass)  # must not raise on the missing manager


async def test_lead_reminders_skip_retired_paused_and_unloaded_objects(hass: HomeAssistant) -> None:
    """Only the live task of a live object is reminded — an archived task, an
    archived or paused object and an object that is not loaded all stay quiet,
    even though each has a task exactly 14 days out."""
    g = make_global_entry(hass, extra_data={CONF_REMINDER_LEAD_DAYS: [14]})
    retired_task = _due_in(14, "Retired", TASK_ID_2)
    retired_task["archived_at"] = dt_util.now().isoformat()
    live = make_object_entry(hass, tasks={TASK_ID_1: _due_in(14, "Hit"), TASK_ID_2: retired_task}, name="Pool", uid="lead_live")

    archived_obj = build_object_data(name="Old Pump", object_id="obj_archived")
    archived_obj["archived_at"] = dt_util.now().isoformat()
    archived = make_object_entry(hass, tasks={TASK_ID_1: _due_in(14, "Archived obj")}, uid="lead_arch", object_data=archived_obj)

    paused_obj = build_object_data(name="Pool Heater", object_id="obj_paused")
    paused_obj["paused_at"] = dt_util.now().isoformat()
    paused = make_object_entry(hass, tasks={TASK_ID_1: _due_in(14, "Paused obj")}, uid="lead_paused", object_data=paused_obj)

    _disabled_object(hass, "Garage Door", "lead_disabled", {TASK_ID_1: _due_in(14, "Unloaded obj")})
    await setup_integration(hass, g, live, archived, paused)
    nm = _mock_nm()
    hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] = nm

    await async_maybe_send_lead_reminders(hass)

    sent = [c.kwargs["task_name"] for c in nm.async_send_lead_reminder.await_args_list]
    assert sent == ["Hit"]
    assert nm.async_send_lead_reminder.await_args.kwargs["days"] == 14


async def test_warranty_reminder_disabled_sends_nothing(hass: HomeAssistant) -> None:
    g = make_global_entry(hass, extra_data={CONF_WARRANTY_REMINDER_ENABLED: False})
    await setup_integration(hass, g)
    nm = _mock_nm()
    hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY] = nm

    await async_maybe_send_warranty_reminders(hass, force=True)

    nm.async_send_warranty_reminder.assert_not_awaited()


# ─── list_tasks readings table ────────────────────────────────────────────


def test_trigger_target_and_unit_per_trigger_type(hass: HomeAssistant) -> None:
    hass.states.async_set("sensor.filter_pressure", "1.2", {"unit_of_measurement": "bar"})

    assert _trigger_target_and_unit(hass, {"type": "runtime", "trigger_runtime_hours": 200}) == (200, "h")
    assert _trigger_target_and_unit(hass, {"type": "state_change", "trigger_target_changes": 50}) == (50, None)
    # A compound trigger has no single limit or unit to show.
    assert _trigger_target_and_unit(hass, {"type": "compound", "conditions": []}) == (None, None)
    assert _trigger_target_and_unit(
        hass, {"type": "counter", "entity_id": "sensor.filter_pressure", "trigger_target_value": 9}
    ) == (9, "bar")
    assert _trigger_target_and_unit(hass, {"type": "threshold", "entity_id": "sensor.filter_pressure", "trigger_below": 0.5}) == (
        0.5,
        "bar",
    )
    # A vanished source entity: the limit stays, the unit is unknown.
    assert _trigger_target_and_unit(hass, {"type": "threshold", "entity_id": "sensor.gone", "trigger_above": 3}) == (3, None)


async def test_list_tasks_leaves_out_objects_that_are_not_loaded(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    live = make_object_entry(hass, tasks={TASK_ID_1: _due_in(10, "Filter Clean")}, name="Pool", uid="lt_live")
    _disabled_object(hass, "Garage Door", "lt_disabled", {TASK_ID_1: _due_in(10, "Lubricate")})
    await setup_integration(hass, g, live)

    response = await hass.services.async_call(DOMAIN, "list_tasks", {}, blocking=True, return_response=True)

    assert [t["name"] for t in response["tasks"]] == ["Filter Clean"]


# ─── services refuse targets that are not tasks ──────────────────────────


async def test_delete_task_refuses_the_global_entry(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    await setup_integration(hass, g)

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "delete_task", {"entry_id": g.entry_id, "task_id": TASK_ID_1}, blocking=True)

    assert err.value.translation_key == "object_not_found"
    assert hass.config_entries.async_get_entry(g.entry_id) is not None


async def test_update_task_refuses_a_non_person_as_responsible_user(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _due_in(10, "Filter Clean")}, name="Pool", uid="upd_person")
    await setup_integration(hass, g, obj)
    hass.states.async_set("sensor.kitchen_temperature", "21", {"user_id": "sneaky"})

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(
            DOMAIN,
            "update_task",
            {"entry_id": obj.entry_id, "task_id": TASK_ID_1, "responsible_user": "sensor.kitchen_temperature"},
            blocking=True,
        )

    assert err.value.translation_key == "person_not_found"
    assert "responsible_user_id" not in obj.data["tasks"][TASK_ID_1]


async def test_complete_refuses_a_part_stock_sensor(hass: HomeAssistant) -> None:
    """The service's entity picker offers every sensor of the integration; a
    spare-part stock sensor belongs to the object but is not a task."""
    g = make_global_entry(hass)
    obj = make_object_entry(
        hass,
        tasks={TASK_ID_1: _due_in(10, "Filter Clean")},
        name="Pool Pump",
        uid="cmp_part",
        extra_data={"parts": {"p1": {"id": "p1", "name": "Filter"}}},
    )
    await setup_integration(hass, g, obj)
    stock_sensor = er.async_get(hass).async_get_entity_id("sensor", DOMAIN, "maintenance_supporter_pool_pump_part_p1")
    assert stock_sensor is not None

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "complete", {"entity_id": stock_sensor}, blocking=True)

    assert err.value.translation_key == "no_task_for_entity"
    assert _completions(hass, obj) == []


async def test_every_per_task_entity_resolves_to_its_task(hass: HomeAssistant) -> None:
    """The service target picker offers every entity of the integration. Only
    the task sensor and the ``_overdue`` binary sensor used to resolve — a
    task's next-due / days-until-due sensor or its buttons failed with
    no_task_for_entity. Every per-task suffix resolves now."""
    from custom_components.maintenance_supporter import _get_task_id_for_entity

    g = make_global_entry(hass)
    obj = make_object_entry(
        hass,
        tasks={TASK_ID_1: _due_in(10, "Filter Clean")},
        name="Pool Pump",
        uid="cmp_all",
        extra_data={"parts": {"p1": {"id": "p1", "name": "Filter"}}},
    )
    await setup_integration(hass, g, obj)
    entries = er.async_entries_for_config_entry(er.async_get(hass), obj.entry_id)
    per_task = [e for e in entries if TASK_ID_1 in (e.unique_id or "")]
    suffixes = {e.unique_id.split(TASK_ID_1, 1)[1] for e in per_task}
    assert {"", "_overdue", "_next_due", "_days_until_due", "_complete", "_skip", "_reset"} <= suffixes
    for e in per_task:
        assert _get_task_id_for_entity(hass, e.entity_id) == TASK_ID_1, e.unique_id
    part = next(e for e in entries if e.unique_id.endswith("_part_p1"))
    assert _get_task_id_for_entity(hass, part.entity_id) is None, "a part stock sensor is no task"

    next_due = next(e for e in per_task if e.unique_id.endswith("_next_due"))
    await hass.services.async_call(DOMAIN, "complete", {"entity_id": next_due.entity_id}, blocking=True)
    await hass.async_block_till_done()
    assert len(_completions(hass, obj)) == 1


async def test_complete_refuses_an_entity_of_an_unloaded_object(hass: HomeAssistant) -> None:
    g = make_global_entry(hass)
    await setup_integration(hass, g)
    disabled = _disabled_object(hass, "Garage Door", "cmp_disabled", {TASK_ID_1: _due_in(10, "Lubricate")})
    stale = er.async_get(hass).async_get_or_create(
        "sensor",
        DOMAIN,
        f"maintenance_supporter_garage_door_{TASK_ID_1}",
        config_entry=disabled,
        suggested_object_id="garage_door_lubricate",
    )

    with pytest.raises(ServiceValidationError) as err:
        await hass.services.async_call(DOMAIN, "complete", {"entity_id": stale.entity_id}, blocking=True)

    assert err.value.translation_key == "no_coordinator_for_entity"


# ─── unattended completions that the task refuses ─────────────────────────


async def _task_needing_cost(hass: HomeAssistant, uid: str, **extra: Any) -> MockConfigEntry:
    g = make_global_entry(hass)
    task = _due_in(-3, "Boiler Service")
    task["required_completion_fields"] = ["cost"]
    task.update(extra)
    obj = make_object_entry(hass, tasks={TASK_ID_1: task}, name="Boiler", uid=uid)
    await setup_integration(hass, g, obj)
    return obj


async def test_notification_complete_button_keeps_a_task_that_needs_details_open(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    obj = await _task_needing_cost(hass, "notif_needs_cost")
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]

    with patch.object(nm, "async_dismiss_task_notification", AsyncMock()) as dismiss:
        with caplog.at_level(logging.WARNING):
            hass.bus.async_fire("mobile_app_notification_action", {"action": f"MS_COMPLETE_{obj.entry_id}_{TASK_ID_1}"})
            await hass.async_block_till_done()

    assert _completions(hass, obj) == []
    dismiss.assert_not_awaited()  # the reminder stays on the phone
    assert f"Notification completion of task {TASK_ID_1} rejected" in caplog.text


async def test_nfc_tap_on_a_task_that_needs_details_leaves_it_open(hass: HomeAssistant, caplog: pytest.LogCaptureFixture) -> None:
    obj = await _task_needing_cost(hass, "nfc_needs_cost", nfc_tag_id="boiler-tag")

    with caplog.at_level(logging.WARNING):
        hass.bus.async_fire("tag_scanned", {"tag_id": "boiler-tag"})
        await hass.async_block_till_done()

    assert _completions(hass, obj) == []
    assert f"NFC completion of task {TASK_ID_1} rejected" in caplog.text


# ─── entity registry follow-ups ───────────────────────────────────────────


async def test_renaming_the_shopping_list_entity_keeps_the_sync_connected(hass: HomeAssistant) -> None:
    ent_reg = er.async_get(hass)
    todo = ent_reg.async_get_or_create("todo", "local_todo", "shopping_list_uid", suggested_object_id="shopping")
    g = make_global_entry(hass, options={CONF_SHOPPING_LIST_ENTITY: todo.entity_id})
    await setup_integration(hass, g)

    ent_reg.async_update_entity(todo.entity_id, new_entity_id="todo.groceries")
    await hass.async_block_till_done()

    assert g.options[CONF_SHOPPING_LIST_ENTITY] == "todo.groceries"


# ─── side-steps that must not take setup / removal down ───────────────────


def _fleet_entry(hass: HomeAssistant, parts: dict[str, Any]) -> MockConfigEntry:
    from custom_components.maintenance_supporter.helpers.battery_fleet_setup import _fleet_trigger_config

    task = build_task_data(name="Replace low batteries")
    task["battery_fleet_task"] = True
    task["trigger_config"] = _fleet_trigger_config()
    task["notes"] = "Aggregate battery check. The detail view lists which devices are low and which battery types to buy."
    obj = build_object_data(name="Battery Fleet", object_id="fleet_obj")
    obj["battery_fleet"] = True
    entry = MockConfigEntry(
        version=1,
        minor_version=1,
        domain=DOMAIN,
        title="Battery Fleet",
        data={**build_object_entry_data(object_data=obj, tasks={task["id"]: task}), "parts": parts},
        source="user",
        unique_id="maintenance_supporter_battery_fleet",
    )
    entry.add_to_hass(hass)
    return entry


async def test_a_fleet_seeded_in_english_follows_the_instance_language_at_start(hass: HomeAssistant) -> None:
    from custom_components.maintenance_supporter.templates import localize_template_text

    hass.config.language = "de"
    g = make_global_entry(hass)
    fleet = _fleet_entry(
        hass,
        {
            "batt_aa": {"id": "batt_aa", "name": "AA battery", "notes": "Typical service life ~24 months."},
            "tool": {"id": "tool", "name": "Screwdriver", "notes": "Typical service life ~24 months."},
        },
    )

    await setup_integration(hass, g, fleet)

    german_name = localize_template_text("Battery Fleet", "de")
    assert german_name and german_name != "Battery Fleet"
    assert fleet.data["object"]["name"] == german_name
    assert fleet.title == german_name
    (task,) = fleet.data["tasks"].values()
    assert task["name"] == localize_template_text("Replace low batteries", "de")
    assert fleet.data["parts"]["batt_aa"]["name"] == "AA-Batterie"
    # A part the user added to the fleet by hand is not a seeded text.
    assert fleet.data["parts"]["tool"] == {"id": "tool", "name": "Screwdriver", "notes": "Typical service life ~24 months."}


async def test_a_failing_fleet_part_reconcile_does_not_break_setup(hass: HomeAssistant, caplog: pytest.LogCaptureFixture) -> None:
    g = make_global_entry(hass)
    fleet = _fleet_entry(hass, {"batt_aa": {"id": "batt_aa", "name": "AA battery"}})

    with (
        patch(
            "custom_components.maintenance_supporter.helpers.battery_fleet_setup.reconcile_fleet_parts_at_start",
            AsyncMock(side_effect=RuntimeError("registry exploded")),
        ),
        caplog.at_level(logging.ERROR),
    ):
        await setup_integration(hass, g, fleet)
        await hass.async_block_till_done()

    assert fleet.state is ConfigEntryState.LOADED
    assert "Battery-fleet part reconcile at start failed" in caplog.text


async def test_removal_survives_a_failing_shared_part_hand_over(hass: HomeAssistant, caplog: pytest.LogCaptureFixture) -> None:
    g = make_global_entry(hass)
    obj = make_object_entry(hass, tasks={TASK_ID_1: _due_in(10, "Filter Clean")}, name="Pool", uid="rm_fail")
    await setup_integration(hass, g, obj)
    assert obj.entry_id in hass.data[STORES_CACHE_KEY]

    with (
        patch(
            "custom_components.maintenance_supporter.helpers.shared_parts.async_transfer_pools_on_removal",
            AsyncMock(side_effect=RuntimeError("borrower vanished")),
        ),
        caplog.at_level(logging.ERROR),
    ):
        await hass.config_entries.async_remove(obj.entry_id)
        await hass.async_block_till_done()

    assert hass.config_entries.async_get_entry(obj.entry_id) is None
    assert obj.entry_id not in hass.data.get(STORES_CACHE_KEY, {})  # the store was still cleaned up
    assert "Could not transfer shared spare parts from Pool" in caplog.text


async def test_a_damaged_part_record_does_not_take_the_sensor_platform_down(hass: HomeAssistant, caplog: pytest.LogCaptureFixture) -> None:
    """Parts are validated on every write path, but a hand-edited or damaged
    entry could hold a non-dict record: the stock sensors used to raise a
    TypeError during setup (the voice summary already skipped such records)."""
    g = make_global_entry(hass)
    obj = make_object_entry(
        hass,
        tasks={TASK_ID_1: _due_in(10, "Filter Clean")},
        name="Pool Pump",
        uid="cmp_badpart",
        extra_data={"parts": {"junk": "garbage", "p1": {"id": "p1", "name": "Filter", "reorder_threshold": 5}}},
    )
    await setup_integration(hass, g, obj)
    assert obj.state is ConfigEntryState.LOADED
    assert set(hass.config_entries.async_get_entry(obj.entry_id).data["parts"]) == {"p1"}, "the damaged record is dropped once"
    reg = er.async_get(hass)
    good = reg.async_get_entity_id("sensor", DOMAIN, "maintenance_supporter_pool_pump_part_p1")
    assert good is not None and hass.states.get(good) is not None
    low = [s for s in hass.states.async_all("sensor") if s.entity_id.startswith("sensor.maintenance_supporter") and "part" in s.entity_id and "low" in s.entity_id]
    assert all(s.state not in ("unavailable",) for s in low)
    assert any("Repaired damaged spare-part" in r.getMessage() for r in caplog.records)
