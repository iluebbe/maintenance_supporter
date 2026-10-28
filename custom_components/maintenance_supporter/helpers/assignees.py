"""Who a task is meant for: the one rule every per-person surface reads.

A task is meant for its responsible person (on a rotation, whoever's turn it
is). When nobody is responsible but the task is shared with people (*Shared
with* without a rotation, discussion #110), it is meant for each of them:
each is notified on their own phones and finds it under "my tasks". A task
with neither belongs to the household: its reminders go to the global notify
service, and no person filter matches it.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from homeassistant.core import HomeAssistant, State

from ..const import CONF_SHARED_DEVICE_USER_IDS
from .global_options import global_option


def shared_user_ids(task: Mapping[str, Any]) -> list[str]:
    """The HA user ids under *Shared with* (on a rotation, its members)."""
    pool = task.get("assignee_pool")
    if not isinstance(pool, list):
        return []
    return list(dict.fromkeys(u for u in pool if isinstance(u, str) and u))


def task_user_ids(task: Mapping[str, Any]) -> list[str]:
    """The HA user ids a task is meant for (see the module docstring)."""
    responsible = task.get("responsible_user_id")
    if isinstance(responsible, str) and responsible:
        return [responsible]
    return shared_user_ids(task)


def task_is_for(task: Mapping[str, Any], user_id: str | None) -> bool:
    """Is the task meant for this user — theirs, or shared with nobody on duty?"""
    return bool(user_id) and user_id in task_user_ids(task)


def _person_state(hass: HomeAssistant, user_id: str | None) -> State | None:
    """The person entity's state linked to a HA user, else None."""
    if not user_id:
        return None
    for state in hass.states.async_all("person"):
        if state.attributes.get("user_id") == user_id:
            return state
    return None


def person_of_user(hass: HomeAssistant, user_id: str | None) -> str | None:
    """The person entity linked to a HA user (``person.jane``), else None.

    The way automations name people: the same entity the ``update_task``
    action takes as ``responsible_user``.
    """
    state = _person_state(hass, user_id)
    return state.entity_id if state is not None else None


def task_people_attributes(hass: HomeAssistant, task: Mapping[str, Any]) -> dict[str, Any]:
    """Who a task is for, as the task sensor and ``list_tasks`` say it.

    * ``responsible_user_id`` / ``responsible_user`` (#210): the person on
      duty, as the user id and as the person entity (what ``update_task``
      takes as ``responsible_user``); None while nobody is responsible.
    * ``shared_with``: the person entities under *Shared with* (on a
      rotation, the people it rotates between).
    * ``assigned_user_ids`` / ``assigned_persons`` (#232): who the task is
      meant for by :func:`task_user_ids`: the responsible person, else
      everyone it is shared with. The people its reminders reach and whose
      "my tasks" list it, so a dashboard template that shows a task only to
      them agrees with both.
    """
    responsible = task.get("responsible_user_id") or None
    assigned = task_user_ids(task)
    return {
        "responsible_user_id": responsible,
        "responsible_user": person_of_user(hass, responsible),
        "shared_with": [p for u in shared_user_ids(task) if (p := person_of_user(hass, u))],
        "assigned_user_ids": assigned,
        "assigned_persons": [p for u in assigned if (p := person_of_user(hass, u))],
    }


def credited_user(hass: HomeAssistant, task: Mapping[str, Any], completed_by: str | None) -> tuple[str | None, str | None]:
    """Who a completion counts for, and the shared device it came from.

    An account several people use (a kitchen tablet, Settings → Shared
    devices) says nothing about who did the work: its completion counts
    for whoever is on duty, the responsible person (on a rotation whose
    turn it is). That keeps "hold them responsible" and a least-completed
    rotation honest. Nobody on duty: the account keeps it. Returns
    ``(completed_by, completed_via)``; ``completed_via`` is the device
    account when the credit moved, else None.
    """
    if not completed_by:
        return completed_by, None
    devices = global_option(hass, CONF_SHARED_DEVICE_USER_IDS) or []
    on_duty = task.get("responsible_user_id")
    if completed_by in devices and isinstance(on_duty, str) and on_duty and on_duty != completed_by:
        return on_duty, completed_by
    return completed_by, None


async def person_display_name(hass: HomeAssistant, user_id: str | None) -> str | None:
    """How the household calls a user: the person's name, else the login's,
    else None. Voice named the person, the "completed by" notification the
    login, so one completion read under two names (DRY audit 2026-10-12)."""
    state = _person_state(hass, user_id)
    if state is not None:
        return str(state.name)
    if not user_id:
        return None
    user = await hass.auth.async_get_user(user_id)
    return str(user.name) if user is not None and user.name else None
