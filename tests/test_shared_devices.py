"""Shared devices (#233 follow-up): an account several people use.

The kitchen tablet of #233 is one Home Assistant account for the whole
household. Every completion made there counted for that account, so a task
meant to "hold them responsible" recorded the tablet, and a least-completed
rotation never saw its people catch up.

The rule (helpers/assignees.credited_user): a completion from an account
listed under Settings → Shared devices counts for whoever is on duty, the
responsible person (on a rotation whose turn it is); the history entry
keeps the device as ``completed_via``. Nobody on duty: the account keeps it.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.const import CONF_SHARED_DEVICE_USER_IDS
from custom_components.maintenance_supporter.helpers.assignees import credited_user
from custom_components.maintenance_supporter.helpers.import_mapping import remap_task_users

from .conftest import (
    TASK_ID_1,
    build_task_data,
    get_task_store_state,
    make_global_entry,
    make_object_entry,
    setup_integration,
)


async def _people(hass: HomeAssistant) -> tuple[str, str, str]:
    """Real users: the setup prunes ids Home Assistant does not know."""
    tablet = await hass.auth.async_create_user("Kitchen tablet")
    ann = await hass.auth.async_create_user("Ann")
    ben = await hass.auth.async_create_user("Ben")
    return tablet.id, ann.id, ben.id


async def _kitchen(hass: HomeAssistant, tablet: str, **task: Any):
    g = make_global_entry(hass, extra_data={CONF_SHARED_DEVICE_USER_IDS: [tablet]})
    data = build_task_data(interval_days=7, last_performed="2026-01-01")
    data.update(task)
    entry = make_object_entry(hass, tasks={TASK_ID_1: data}, name="Kitchen", uid="kitchen", object_id="objid_kitchen")
    await setup_integration(hass, g, entry)
    return entry


def _history(hass: HomeAssistant, entry) -> list[dict[str, Any]]:
    return get_task_store_state(hass, entry.entry_id, TASK_ID_1).get("history", []) or []


async def test_the_rule(hass: HomeAssistant) -> None:
    tablet, ann, ben = "tablet-user", "ann-user", "ben-user"
    make_global_entry(hass, extra_data={CONF_SHARED_DEVICE_USER_IDS: [tablet]})
    assert credited_user(hass, {"responsible_user_id": ann}, tablet) == (ann, tablet)
    # Nobody on duty: the account keeps it.
    assert credited_user(hass, {}, tablet) == (tablet, None)
    # A person's own account is never re-credited.
    assert credited_user(hass, {"responsible_user_id": ann}, ben) == (ben, None)
    assert credited_user(hass, {"responsible_user_id": tablet}, tablet) == (tablet, None)
    assert credited_user(hass, {"responsible_user_id": ann}, None) == (None, None)


async def test_a_completion_on_the_tablet_counts_for_whoever_is_on_duty(hass: HomeAssistant) -> None:
    tablet, ann, _ben = await _people(hass)
    entry = await _kitchen(hass, tablet, responsible_user_id=ann)
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, completed_by=tablet, source="panel")
    (done,) = _history(hass, entry)
    assert done["completed_by"] == ann
    assert done["completed_via"] == tablet


async def test_a_rotation_moves_on_from_the_person_credited(hass: HomeAssistant) -> None:
    """least_completed counts completed_by. Credited to the tablet it stood
    0:0 and Ann, first in the pool, stayed on duty; credited to Ann it is
    1:0 and Ben is next."""
    tablet, ann, ben = await _people(hass)
    entry = await _kitchen(hass, tablet, responsible_user_id=ann, assignee_pool=[ann, ben], rotation_strategy="least_completed")
    coordinator = entry.runtime_data.coordinator
    await coordinator.complete_maintenance(TASK_ID_1, completed_by=tablet, source="panel")
    assert [h["completed_by"] for h in _history(hass, entry)] == [ann]
    assert coordinator.merged_task(TASK_ID_1)["responsible_user_id"] == ben


async def test_an_account_that_is_no_shared_device_keeps_its_completion(hass: HomeAssistant) -> None:
    tablet, ann, ben = await _people(hass)
    entry = await _kitchen(hass, tablet, responsible_user_id=ann)
    await entry.runtime_data.coordinator.complete_maintenance(TASK_ID_1, completed_by=ben, source="panel")
    (done,) = _history(hass, entry)
    assert done["completed_by"] == ben and "completed_via" not in done


def test_an_import_remaps_the_device_too() -> None:
    task = {"history": [{"type": "completed", "completed_by": "old-ann", "completed_via": "old-tablet"}]}
    remap_task_users(task, {"old-ann": "ann", "old-tablet": "tablet"})
    assert task["history"][0]["completed_by"] == "ann"
    assert task["history"][0]["completed_via"] == "tablet"
