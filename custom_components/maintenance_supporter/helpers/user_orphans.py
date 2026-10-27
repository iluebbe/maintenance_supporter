"""Deleted Home Assistant users our data still names: task assignments
(pruned in place) and the admin-panel allowlist (one fixable repair issue per
id). Checked at setup, when a user is removed and after an import."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir

from ..const import CONF_ADMIN_PANEL_USER_IDS, CONF_TASKS, DOMAIN, GLOBAL_UNIQUE_ID
from .entry_tasks import write_tasks
from .global_options import entry_option

_LOGGER = logging.getLogger(__name__)

_ORPHAN_ISSUE_PREFIX = "orphan_admin_panel_user_"


async def async_prune_task_user_orphans(hass: HomeAssistant) -> None:
    """Clear task assignments pointing at deleted HA users.

    Same class of bug as ``admin_panel_user_ids`` orphans (#48 audit) but for
    tasks: a user can be deleted in HA while we hold their UUID in entry data.
    Two references need pruning:

    * ``responsible_user_id`` — dashboards would render "Unknown user"
      forever; notifications already fall back to the global service.
    * ``assignee_pool`` (2.17 rotation) — a ghost member is WORSE than a
      ghost pointer: ``advance_rotation`` keeps assigning the deleted user
      (``least_completed`` picks them forever at 0 completions), so pruning
      only the pointer would resurrect it on the next completion.

    When the pool shrinks below 2 members the rotation is dissolved
    (mirroring the task-dialog save rule); when the orphaned pointer leaves a
    healthy pool behind, responsibility moves to the first remaining member
    so the shared task never goes unassigned. Silent removal with an info
    log — no repair issue, no user prompt.
    """
    valid_ids = {u.id for u in await hass.auth.async_get_users()}
    if not valid_ids:
        # Defensive: production HA always has at least the owner user. An
        # empty list means we're in a test harness without an auth fixture
        # or auth is mid-load — either way, don't prune references we
        # can't actually verify as orphaned.
        return
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.unique_id == GLOBAL_UNIQUE_ID:
            continue
        tasks = entry.data.get(CONF_TASKS, {})
        new_tasks: dict[str, dict[str, Any]] = {}
        changed = False
        for tid, td in tasks.items():
            ruid = td.get("responsible_user_id")
            raw_pool = td.get("assignee_pool")
            pool = [u for u in raw_pool if isinstance(u, str)] if isinstance(raw_pool, list) else []
            pruned_pool = [u for u in pool if u in valid_ids]
            # A value that is no user id at all (a list from a malformed
            # backup) is as orphaned as a deleted user's — `in valid_ids`
            # raised on it and failed the global entry's setup on every start
            # (bug audit 2026-09-29).
            resp_orphaned = bool(ruid) and (not isinstance(ruid, str) or ruid not in valid_ids)
            if not resp_orphaned and pruned_pool == pool:
                new_tasks[tid] = td
                continue

            new_td = dict(td)
            changed = True
            if pruned_pool != pool:
                _LOGGER.info(
                    "Removing %d deleted user(s) from assignee_pool on task %s (%s)",
                    len(pool) - len(pruned_pool),
                    tid,
                    entry.title,
                )
                if len(pruned_pool) >= 2:
                    new_td["assignee_pool"] = pruned_pool
                else:
                    # A rotation needs at least two members.
                    new_td.pop("assignee_pool", None)
                    new_td.pop("rotation_strategy", None)
                    # The one person left keeps the task: a task shared by
                    # two lost BOTH when one of them was deleted (bug audit
                    # 2026-10-16, C-D).
                    if pruned_pool and (resp_orphaned or not ruid):
                        new_td["responsible_user_id"] = pruned_pool[0]
            if resp_orphaned:
                _LOGGER.info(
                    "Clearing orphaned responsible_user_id %s on task %s (%s)",
                    ruid,
                    tid,
                    entry.title,
                )
                if pruned_pool:
                    # Keep the shared task assigned: hand over to the pool.
                    new_td["responsible_user_id"] = pruned_pool[0]
                else:
                    new_td.pop("responsible_user_id", None)
            new_tasks[tid] = new_td
        if changed:
            write_tasks(hass, entry, new_tasks)


async def async_sync_admin_panel_orphan_issues(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Surface admin_panel_user_ids entries pointing at deleted HA users.

    Each orphaned id becomes a fixable repair issue. The repair flow lets
    the admin remove the entry from the list with one click. Issues for
    ids that have been validated, removed from the list, or restored are
    cleared automatically.
    """
    user_ids_raw = entry_option(entry, CONF_ADMIN_PANEL_USER_IDS) or []
    if not isinstance(user_ids_raw, list):
        user_ids_raw = []
    user_ids: set[str] = {u for u in user_ids_raw if isinstance(u, str)}
    valid_ids = {u.id for u in await hass.auth.async_get_users()}

    # 1) Drop any pre-existing orphan issue whose target id is no longer
    #    in the list (admin removed it) OR is now valid (user re-created).
    #    Scope the iteration to OUR domain via the (domain, issue_id) tuple
    #    keys instead of scanning every integration's issues.
    issue_reg = ir.async_get(hass)
    stale_issue_ids = [iid for (dom, iid) in issue_reg.issues if dom == DOMAIN and iid.startswith(_ORPHAN_ISSUE_PREFIX)]
    for issue_id in stale_issue_ids:
        target_uid = issue_id[len(_ORPHAN_ISSUE_PREFIX) :]
        if target_uid not in user_ids or target_uid in valid_ids:
            ir.async_delete_issue(hass, DOMAIN, issue_id)

    # 2) Create issues for ids in the list that no longer match a HA user.
    for uid in user_ids:
        if uid in valid_ids:
            continue
        ir.async_create_issue(
            hass,
            DOMAIN,
            f"{_ORPHAN_ISSUE_PREFIX}{uid}",
            is_fixable=True,
            severity=ir.IssueSeverity.WARNING,
            translation_key="orphan_admin_panel_user",
            translation_placeholders={"user_id": uid[:8]},
            data={"user_id": uid, "entry_id": entry.entry_id},
        )
