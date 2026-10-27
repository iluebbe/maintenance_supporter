"""Who a task is meant for (helpers/assignees) and everything that reads it.

Discussion #110: a chore set up as *Shared with* two people and no rotation
notified only the global notify service, so one partner never heard of it,
and neither person's "my tasks" listed it. Issue #210: the ``list_tasks``
action and the task sensor did not say who is responsible, so an automation
could not pick one person's tasks.

The rule: a task is meant for its responsible person (on a rotation, whose
turn it is); when nobody is responsible, for everyone it is shared with.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import intent
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.maintenance_supporter.const import (
    CONF_QUIET_HOURS_ENABLED,
    DOMAIN,
    NOTIFICATION_MANAGER_KEY,
    MaintenanceStatus,
)
from custom_components.maintenance_supporter.helpers.assignees import (
    person_of_user,
    shared_user_ids,
    task_is_for,
    task_user_ids,
)
from custom_components.maintenance_supporter.helpers.notification_manager import NotificationManager
from custom_components.maintenance_supporter.helpers.saved_views import view_matches_task
from custom_components.maintenance_supporter.intent import INTENT_LIST_TASKS, async_setup_intents
from custom_components.maintenance_supporter.websocket.users import ws_tasks_by_user

from .conftest import (
    build_task_data,
    call_ws_handler,
    make_global_entry,
    make_object_entry,
    make_ws_connection,
    setup_integration,
)

_NM = "custom_components.maintenance_supporter.helpers.notification_manager"


def _task(task_id: str, name: str, **over: Any) -> dict[str, Any]:
    last = (dt_util.now().date() - timedelta(days=40)).isoformat()
    task = build_task_data(task_id=task_id, name=name, last_performed=last, interval_days=30)
    task.update(over)
    return task


def _global(hass: HomeAssistant) -> MockConfigEntry:
    return make_global_entry(
        hass, notifications_enabled=True, notify_service="notify.test",
        extra_data={CONF_QUIET_HOURS_ENABLED: False},
    )


def _notify(hass: HomeAssistant, name: str) -> AsyncMock:
    calls = AsyncMock()
    hass.services.async_register("notify", name, calls)
    return calls


def _phones(mapping: dict[str, list[str]]):
    async def _lookup(_hass: HomeAssistant, user_id: str) -> list[str]:
        return list(mapping.get(user_id, []))

    return patch(f"{_NM}.get_user_notify_services", AsyncMock(side_effect=_lookup))


# ─── the rule ───────────────────────────────────────────────────────────────


def test_the_responsible_person_wins_and_the_pool_counts_only_without_one() -> None:
    assert task_user_ids({"responsible_user_id": "ben", "assignee_pool": ["ann", "ben"]}) == ["ben"]
    assert task_user_ids({"assignee_pool": ["ann", "ben"]}) == ["ann", "ben"]
    assert task_user_ids({"responsible_user_id": "", "assignee_pool": ["ann", "ann", "", 7]}) == ["ann"]
    assert task_user_ids({}) == []
    assert task_user_ids({"assignee_pool": "ann"}) == []
    assert shared_user_ids({"responsible_user_id": "ben", "assignee_pool": ["ann", "ben"]}) == ["ann", "ben"]
    assert task_is_for({"assignee_pool": ["ann", "ben"]}, "ann")
    assert not task_is_for({"responsible_user_id": "ben", "assignee_pool": ["ann", "ben"]}, "ann")
    assert not task_is_for({"assignee_pool": ["ann"]}, None)
    assert not task_is_for({}, "ann")


async def test_person_of_user_finds_the_linked_person(hass: HomeAssistant) -> None:
    hass.states.async_set("person.ann", "home", {"user_id": "u-ann", "friendly_name": "Ann"})
    hass.states.async_set("person.guest", "home", {"friendly_name": "Guest"})
    assert person_of_user(hass, "u-ann") == "person.ann"
    assert person_of_user(hass, "u-nobody") is None
    assert person_of_user(hass, None) is None


# ─── notifications ──────────────────────────────────────────────────────────


async def _status_changed(nm: NotificationManager, entry: MockConfigEntry, task_id: str, responsible: str | None = None) -> None:
    await nm.async_task_status_changed(
        entry_id=entry.entry_id,
        task_id=task_id,
        task_name="Clean gutters",
        object_name="House",
        new_status=MaintenanceStatus.OVERDUE,
        days_until_due=-3,
        responsible_user_id=responsible,
    )
    await nm.hass.async_block_till_done()


async def test_a_shared_task_without_a_responsible_person_reaches_every_member(hass: HomeAssistant) -> None:
    _global(hass)
    household, ann, ben = _notify(hass, "test"), _notify(hass, "mobile_app_ann"), _notify(hass, "mobile_app_ben")
    entry = make_object_entry(hass, tasks={"t": _task("t", "Clean gutters", assignee_pool=["u-ann", "u-ben"])}, uid="shared")
    nm = NotificationManager(hass)
    with _phones({"u-ann": ["notify.mobile_app_ann"], "u-ben": ["notify.mobile_app_ben"]}):
        await _status_changed(nm, entry, "t")
    assert ann.await_count == 1 and ben.await_count == 1
    assert household.await_count == 0, "the household service is the fallback, not an extra copy"


async def test_a_member_without_a_phone_does_not_pull_in_the_household_service(hass: HomeAssistant) -> None:
    _global(hass)
    household, ann = _notify(hass, "test"), _notify(hass, "mobile_app_ann")
    entry = make_object_entry(hass, tasks={"t": _task("t", "Clean gutters", assignee_pool=["u-ann", "u-ben"])}, uid="shared")
    nm = NotificationManager(hass)
    with _phones({"u-ann": ["notify.mobile_app_ann"]}):
        await _status_changed(nm, entry, "t")
    assert ann.await_count == 1 and household.await_count == 0


async def test_a_shared_task_nobody_can_be_reached_for_goes_to_the_household(hass: HomeAssistant) -> None:
    _global(hass)
    household = _notify(hass, "test")
    entry = make_object_entry(hass, tasks={"t": _task("t", "Clean gutters", assignee_pool=["u-ann", "u-ben"])}, uid="shared")
    nm = NotificationManager(hass)
    with _phones({}):
        await _status_changed(nm, entry, "t")
    assert household.await_count == 1


async def test_a_rotation_notifies_only_whose_turn_it_is(hass: HomeAssistant) -> None:
    _global(hass)
    household, ann, ben = _notify(hass, "test"), _notify(hass, "mobile_app_ann"), _notify(hass, "mobile_app_ben")
    task = _task("t", "Mow", assignee_pool=["u-ann", "u-ben"], rotation_strategy="round_robin", responsible_user_id="u-ben")
    entry = make_object_entry(hass, tasks={"t": task}, uid="rota")
    nm = NotificationManager(hass)
    with _phones({"u-ann": ["notify.mobile_app_ann"], "u-ben": ["notify.mobile_app_ben"]}):
        await _status_changed(nm, entry, "t", responsible="u-ben")
    assert (ann.await_count, ben.await_count, household.await_count) == (0, 1, 0)


async def test_a_lead_reminder_for_a_shared_task_reaches_every_member(hass: HomeAssistant) -> None:
    _global(hass)
    ann, ben = _notify(hass, "mobile_app_ann"), _notify(hass, "mobile_app_ben")
    _notify(hass, "test")
    entry = make_object_entry(hass, tasks={"t": _task("t", "Clean gutters", assignee_pool=["u-ann", "u-ben"])}, uid="shared")
    nm = NotificationManager(hass)
    with _phones({"u-ann": ["notify.mobile_app_ann"], "u-ben": ["notify.mobile_app_ben"]}):
        await nm.async_send_lead_reminder(entry.entry_id, "t", "Clean gutters", "House", 3)
        await hass.async_block_till_done()
    assert ann.await_count == 1 and ben.await_count == 1


async def test_dismissal_clears_every_members_phone(hass: HomeAssistant) -> None:
    _global(hass)
    household, ann, ben = _notify(hass, "test"), _notify(hass, "mobile_app_ann"), _notify(hass, "mobile_app_ben")
    nm = NotificationManager(hass)
    with _phones({"u-ann": ["notify.mobile_app_ann"], "u-ben": ["notify.mobile_app_ben"]}):
        await nm.async_dismiss_task_notification("t", user_ids=["u-ann", "u-ben"])
        await hass.async_block_till_done()
    for svc in (ann, ben):
        assert svc.await_count == 1
        assert svc.call_args[0][0].data == {"message": "clear_notification", "data": {"tag": "maintenance_t"}}
    # The household service is no phone: it would have shown the command as
    # text (bug audit 2026-10-16, N2).
    assert household.await_count == 0


async def test_completing_from_a_phone_clears_the_reminder_for_everyone_it_was_shared_with(hass: HomeAssistant) -> None:
    ann = await hass.auth.async_create_user("Ann")
    ben = await hass.auth.async_create_user("Ben")
    g = _global(hass)
    entry = make_object_entry(hass, tasks={"t": _task("t", "Clean gutters", assignee_pool=[ann.id, ben.id])}, uid="shared")
    await setup_integration(hass, g, entry)
    entry.runtime_data.coordinator.complete_maintenance = AsyncMock()
    nm = hass.data[DOMAIN][NOTIFICATION_MANAGER_KEY]
    with patch.object(nm, "async_dismiss_task_notification", new_callable=AsyncMock) as dismiss:
        hass.bus.async_fire("mobile_app_notification_action", {"action": f"MS_COMPLETE_{entry.entry_id}_t"})
        await hass.async_block_till_done()
    dismiss.assert_called_once_with("t", user_ids=[ann.id, ben.id])


# ─── person filters: saved views, voice, WS ─────────────────────────────────


def test_a_persons_saved_view_holds_the_tasks_shared_with_them() -> None:
    shared = {"assignee_pool": ["ann", "ben"]}
    bens_turn = {"assignee_pool": ["ann", "ben"], "rotation_strategy": "round_robin", "responsible_user_id": "ben"}
    assert view_matches_task({"user_id": "ann"}, shared)
    assert not view_matches_task({"user_id": "ann"}, bens_turn)
    assert view_matches_task({"user_id": "ben"}, bens_turn)
    assert not view_matches_task({"user_id": "ann"}, {})


async def _household(hass: HomeAssistant) -> tuple[Any, Any, Any, MockConfigEntry]:
    """Ann and Ben; a shared chore, Ann's own, Ben's turn on a rotation, a household one."""
    ann = await hass.auth.async_create_user("Ann")
    ben = await hass.auth.async_create_user("Ben")
    bob = await hass.auth.async_create_user("Bob")
    hass.states.async_set("person.ann", "home", {"user_id": ann.id, "friendly_name": "Ann"})
    hass.states.async_set("person.ben", "home", {"user_id": ben.id, "friendly_name": "Ben"})
    hass.states.async_set("person.bob", "home", {"user_id": bob.id, "friendly_name": "Bob"})
    hass.states.async_set("person.guest", "home", {"friendly_name": "Guest"})
    g = make_global_entry(hass)
    entry = make_object_entry(
        hass,
        tasks={
            "shared": _task("shared", "Clean gutters", assignee_pool=[ann.id, ben.id]),
            "anns": _task("anns", "Descale kettle", responsible_user_id=ann.id),
            "rota": _task("rota", "Mow lawn", assignee_pool=[ann.id, ben.id], rotation_strategy="round_robin", responsible_user_id=ben.id),
            "house": _task("house", "Service boiler"),
        },
        name="House",
        uid="household",
    )
    await setup_integration(hass, g, entry)
    return ann, ben, bob, entry


async def test_my_tasks_by_voice_include_the_ones_shared_with_me(hass: HomeAssistant) -> None:
    ann, ben, _bob, _entry = await _household(hass)
    await async_setup_intents(hass)

    async def mine(user_id: str) -> str:
        resp = await intent.async_handle(
            hass, "test", INTENT_LIST_TASKS, {"scope": {"value": "mine"}}, context=Context(user_id=user_id)
        )
        return str(resp.speech["plain"]["speech"])

    anns, bens = await mine(ann.id), await mine(ben.id)
    assert "Clean gutters" in anns and "Descale kettle" in anns
    assert "Mow lawn" not in anns and "Service boiler" not in anns
    assert "Clean gutters" in bens and "Mow lawn" in bens and "Descale kettle" not in bens


async def test_tasks_by_user_includes_the_ones_shared_with_them(hass: HomeAssistant) -> None:
    ann, _ben, _bob, _entry = await _household(hass)
    conn = make_ws_connection()
    await call_ws_handler(ws_tasks_by_user, hass, conn, {"id": 1, "type": f"{DOMAIN}/tasks/by_user", "user_id": ann.id})
    names = sorted(t["name"] for t in conn.send_result.call_args[0][1]["tasks"])
    assert names == ["Clean gutters", "Descale kettle"]


# ─── #210: list_tasks and the task sensor say who is responsible ───────────


async def _list(hass: HomeAssistant, **data: Any) -> dict[str, dict[str, Any]]:
    resp = await hass.services.async_call(DOMAIN, "list_tasks", data, blocking=True, return_response=True)
    assert isinstance(resp, dict)
    return {row["task_id"]: row for row in resp["tasks"]}


async def test_list_tasks_rows_say_who_is_responsible_and_who_it_is_shared_with(hass: HomeAssistant) -> None:
    ann, ben, _bob, _entry = await _household(hass)
    rows = await _list(hass)
    assert (rows["anns"]["responsible_user_id"], rows["anns"]["responsible_user"]) == (ann.id, "person.ann")
    assert (rows["rota"]["responsible_user_id"], rows["rota"]["responsible_user"]) == (ben.id, "person.ben")
    assert rows["rota"]["shared_with"] == ["person.ann", "person.ben"]
    assert rows["shared"]["responsible_user_id"] is None and rows["shared"]["responsible_user"] is None
    assert rows["shared"]["shared_with"] == ["person.ann", "person.ben"]
    assert rows["house"]["shared_with"] == [] and rows["house"]["responsible_user"] is None


async def test_list_tasks_for_a_person_returns_the_tasks_meant_for_them(hass: HomeAssistant) -> None:
    await _household(hass)
    assert sorted(await _list(hass, person="person.ann")) == ["anns", "shared"]
    assert sorted(await _list(hass, person="person.ben")) == ["rota", "shared"]
    assert await _list(hass, person="person.bob") == {}
    # The filters combine: Ann's overdue ones.
    assert sorted(await _list(hass, person="person.ann", status="overdue")) == ["anns", "shared"]


@pytest.mark.parametrize(("person", "key"), [("person.nobody", "person_not_found"), ("person.guest", "person_without_user")])
async def test_list_tasks_refuses_a_person_it_cannot_resolve(hass: HomeAssistant, person: str, key: str) -> None:
    await _household(hass)
    with pytest.raises(ServiceValidationError) as err:
        await _list(hass, person=person)
    assert err.value.translation_key == key


async def test_the_task_sensor_says_who_is_responsible(hass: HomeAssistant) -> None:
    ann, _ben, _bob, _entry = await _household(hass)
    rows = await _list(hass)
    anns = hass.states.get(rows["anns"]["entity_id"])
    shared = hass.states.get(rows["shared"]["entity_id"])
    assert anns is not None and shared is not None
    assert anns.attributes["responsible_user_id"] == ann.id
    assert anns.attributes["responsible_user"] == "person.ann"
    assert shared.attributes["responsible_user_id"] is None
    assert shared.attributes["responsible_user"] is None


# ─── #232: who it is for, for templates, automations and spreadsheets ──────


async def test_the_task_sensor_and_list_tasks_say_who_it_is_for(hass: HomeAssistant) -> None:
    """#232: a dashboard template shows a task only to the people it is for.
    The sensor said who is responsible, so a task shared with two people
    showed to one of them or to every account."""
    ann, ben, _bob, _entry = await _household(hass)
    rows = await _list(hass)
    expect = {
        "shared": ([ann.id, ben.id], ["person.ann", "person.ben"]),
        "anns": ([ann.id], ["person.ann"]),
        "rota": ([ben.id], ["person.ben"]),  # whose turn it is
        "house": ([], []),
    }
    for task_id, (user_ids, persons) in expect.items():
        sensor = hass.states.get(rows[task_id]["entity_id"])
        assert sensor is not None
        for attrs in (sensor.attributes, rows[task_id]):
            assert attrs["assigned_user_ids"] == user_ids, task_id
            assert attrs["assigned_persons"] == persons, task_id
    shared = hass.states.get(rows["shared"]["entity_id"])
    assert shared is not None and shared.attributes["shared_with"] == ["person.ann", "person.ben"]


async def _update(hass: HomeAssistant, entry: MockConfigEntry, task_id: str, **data: Any) -> dict[str, Any]:
    await hass.services.async_call(DOMAIN, "update_task", {"entry_id": entry.entry_id, "task_id": task_id, **data}, blocking=True)
    await hass.async_block_till_done()
    return dict(hass.config_entries.async_get_entry(entry.entry_id).data["tasks"][task_id])


async def test_update_task_shares_a_task_and_sets_its_rotation(hass: HomeAssistant) -> None:
    ann, ben, _bob, entry = await _household(hass)
    task = await _update(hass, entry, "house", shared_with=["person.ann", "person.ben"])
    assert task["assignee_pool"] == [ann.id, ben.id] and "rotation_strategy" not in task
    assert task_user_ids(task) == [ann.id, ben.id]
    # A rotation keeps someone of them on duty, like the dialog.
    task = await _update(hass, entry, "house", rotation="least_completed")
    assert task["rotation_strategy"] == "least_completed" and task["responsible_user_id"] == ann.id
    # "none" ends the rotation; an empty list ends the sharing.
    task = await _update(hass, entry, "house", rotation="none", clear_responsible_user=True)
    assert "rotation_strategy" not in task and "responsible_user_id" not in task
    task = await _update(hass, entry, "house", shared_with=[])
    assert "assignee_pool" not in task


async def test_a_rotation_needs_two_people(hass: HomeAssistant) -> None:
    _ann, _ben, _bob, entry = await _household(hass)
    with pytest.raises(ServiceValidationError) as err:
        await _update(hass, entry, "house", shared_with=["person.ann"], rotation="round_robin")
    assert err.value.translation_key == "invalid_input"
    with pytest.raises(ServiceValidationError) as err:
        await _update(hass, entry, "house", shared_with=["person.guest"])
    assert err.value.translation_key == "person_without_user"


async def test_add_task_takes_who_it_is_for(hass: HomeAssistant) -> None:
    ann, ben, _bob, entry = await _household(hass)
    resp = await hass.services.async_call(
        DOMAIN, "add_task",
        {"entry_id": entry.entry_id, "name": "Water plants", "shared_with": ["person.ann", "person.ben"], "rotation": "round_robin"},
        blocking=True, return_response=True,
    )
    assert isinstance(resp, dict)
    task = hass.config_entries.async_get_entry(entry.entry_id).data["tasks"][resp["task_id"]]
    assert task["assignee_pool"] == [ann.id, ben.id]
    assert task["rotation_strategy"] == "round_robin" and task["responsible_user_id"] == ann.id
    resp = await hass.services.async_call(
        DOMAIN, "add_task", {"entry_id": entry.entry_id, "name": "Feed cat", "responsible_user": "person.ben"},
        blocking=True, return_response=True,
    )
    assert isinstance(resp, dict)
    assert hass.config_entries.async_get_entry(entry.entry_id).data["tasks"][resp["task_id"]]["responsible_user_id"] == ben.id


async def test_a_csv_round_trip_keeps_who_a_task_is_shared_with(hass: HomeAssistant) -> None:
    """#232: the CSV had no column for *Shared with*, so a round trip turned
    a task shared with two people into a household one."""
    from custom_components.maintenance_supporter.helpers.csv_handler import export_objects_csv, import_objects_csv

    ann, ben, _bob, _entry = await _household(hass)
    (obj,) = import_objects_csv(export_objects_csv(hass), hass=hass)
    by_name = {t["name"]: t for t in obj["tasks"].values()}
    assert by_name["Clean gutters"]["assignee_pool"] == [ann.id, ben.id]
    assert "rotation_strategy" not in by_name["Clean gutters"]
    assert by_name["Mow lawn"]["assignee_pool"] == [ann.id, ben.id]
    assert by_name["Mow lawn"]["rotation_strategy"] == "round_robin"
    assert by_name["Mow lawn"]["responsible_user_id"] == ben.id
    assert "assignee_pool" not in by_name["Service boiler"]
