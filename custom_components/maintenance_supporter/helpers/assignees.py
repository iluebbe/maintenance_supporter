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

from homeassistant.core import HomeAssistant


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


def person_of_user(hass: HomeAssistant, user_id: str | None) -> str | None:
    """The person entity linked to a HA user (``person.jane``), else None.

    The way automations name people: the same entity the ``update_task``
    action takes as ``responsible_user``.
    """
    if not user_id:
        return None
    for state in hass.states.async_all("person"):
        if state.attributes.get("user_id") == user_id:
            return state.entity_id
    return None
