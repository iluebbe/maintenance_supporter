"""Repair-issue ids: ONE spelling per kind, and the purge that keeps them
from outliving what they are about.

The ids used to be hand-formatted in six places (coordinator, parts runtime,
the task-delete WS command, the device-link check, object removal, the
repair-flow dispatch). Deleting a task cleared only its ``missing_trigger_*``
issues and deleting an object only its ``device_link_lost_*`` notice — a
stale on-complete-action target, a broken part link or a missing trigger
entity of a deleted task/object stayed in Settings → Repairs for good, with
a fix flow that no longer had anything to fix (bug audit 2026-09-26, DRY
BR-A8). Every builder lives here; the two purges delete by prefix.

Ids are ``<prefix><entry_id>[_<task_id>_<entity_id>]``. Entry ids (ULIDs)
contain no underscore, so ``<prefix><entry_id>_`` can never match another
entry. A task-scoped purge additionally checks the issue's own ``task_id``
data when it carries one, so a task id that happens to prefix another's
(``task_1`` / ``task_1_2`` in hand-made test data) never takes the wrong
task's issues along.
"""

from __future__ import annotations

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import issue_registry as ir

from ..const import DOMAIN

MISSING_TRIGGER_PREFIX = "missing_trigger_"
STALE_ACTION_PREFIX = "stale_action_entity_"
BROKEN_PART_LINK_PREFIX = "broken_part_link_"
DEVICE_LINK_LOST_PREFIX = "device_link_lost_"
SHARED_PARTS_MOVED_PREFIX = "shared_parts_moved_"

# Issues about one TASK of an object (id carries the task id).
_TASK_SCOPED_PREFIXES = (MISSING_TRIGGER_PREFIX, STALE_ACTION_PREFIX)
# Every issue about an object entry — task-scoped ones included.
_ENTRY_SCOPED_PREFIXES = (
    *_TASK_SCOPED_PREFIXES,
    BROKEN_PART_LINK_PREFIX,
    DEVICE_LINK_LOST_PREFIX,
    SHARED_PARTS_MOVED_PREFIX,
)


def missing_trigger_issue_id(entry_id: str, task_id: str, entity_id: str) -> str:
    """A task's trigger entity has been missing for a while."""
    return f"{MISSING_TRIGGER_PREFIX}{entry_id}_{task_id}_{entity_id}"


def stale_action_issue_id(entry_id: str, task_id: str, entity_id: str) -> str:
    """A task's on-complete action targets an entity that no longer exists."""
    return f"{STALE_ACTION_PREFIX}{entry_id}_{task_id}_{entity_id}"


def broken_part_link_issue_id(entry_id: str) -> str:
    """A completion on the object referenced spare parts that are gone."""
    return f"{BROKEN_PART_LINK_PREFIX}{entry_id}"


def device_link_lost_issue_id(entry_id: str) -> str:
    """The object's linked HA device vanished (or is its own doppelganger)."""
    return f"{DEVICE_LINK_LOST_PREFIX}{entry_id}"


def shared_parts_moved_issue_id(entry_id: str) -> str:
    """A deleted object's shared spare-part pool moved to this object (#111)."""
    return f"{SHARED_PARTS_MOVED_PREFIX}{entry_id}"


@callback
def async_purge_task_issues(hass: HomeAssistant, entry_id: str, task_id: str) -> int:
    """Delete every repair issue about one task (it is being deleted).

    A callback (no await), like ``ir.async_delete_issue``. Returns how many
    issues went.
    """
    heads = tuple(f"{prefix}{entry_id}_{task_id}_" for prefix in _TASK_SCOPED_PREFIXES)
    doomed: list[str] = []
    for (domain, issue_id), issue in ir.async_get(hass).issues.items():
        if domain != DOMAIN or not issue_id.startswith(heads):
            continue
        owner = (issue.data or {}).get("task_id")
        if owner is None or owner == task_id:
            doomed.append(issue_id)
    for issue_id in doomed:
        ir.async_delete_issue(hass, DOMAIN, issue_id)
    return len(doomed)


@callback
def async_purge_entry_issues(hass: HomeAssistant, entry_id: str) -> int:
    """Delete every repair issue about an object entry (it is being removed).

    A callback (no await). Returns how many issues went.
    """
    exact = tuple(f"{prefix}{entry_id}" for prefix in _ENTRY_SCOPED_PREFIXES)
    heads = tuple(f"{head}_" for head in exact)
    doomed = [
        issue_id
        for (domain, issue_id) in ir.async_get(hass).issues
        if domain == DOMAIN and (issue_id in exact or issue_id.startswith(heads))
    ]
    for issue_id in doomed:
        ir.async_delete_issue(hass, DOMAIN, issue_id)
    return len(doomed)
