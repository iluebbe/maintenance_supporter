"""Helpers for rewriting entity_id references when HA renames an entity.

Used by the global ``EVENT_ENTITY_REGISTRY_UPDATED`` listener in ``__init__.py``
to keep ``trigger_config["entity_id"|"entity_ids"]``,
``adaptive_config["environmental_entity"]``, calendar schedules, to-do mirror
targets, the completion action's target and the battery fleet's lists in sync
with the user's renames (the listener itself rewrites the global shopping-list
and notify-entity targets).

Without this, ``async_track_state_change_event`` (which subscribes by literal
entity_id) silently misses events on the new id — same dual-storage class of
bug as #48, but with feature breakage instead of a UI inconsistency.
"""

from __future__ import annotations

import re
from typing import Any


def rewrite_trigger_config(config: Any, old_id: str, new_id: str) -> tuple[Any, bool]:
    """Return (new_config, changed) with all entity_id references rewritten.

    Handles:
      - flat ``entity_id`` (legacy single-entity)
      - ``entity_ids`` list (multi-entity)
      - ``_trigger_state`` keyed by entity_id (per-entity persisted state)
      - compound triggers — recursive into ``conditions[].trigger_config``
    """
    if not isinstance(config, dict):
        return config, False

    new_config = dict(config)
    changed = False

    if new_config.get("entity_id") == old_id:
        new_config["entity_id"] = new_id
        changed = True

    eids = new_config.get("entity_ids")
    if isinstance(eids, list) and old_id in eids:
        new_config["entity_ids"] = [new_id if e == old_id else e for e in eids]
        changed = True

    state = new_config.get("_trigger_state")
    if isinstance(state, dict) and old_id in state:
        new_state = dict(state)
        new_state[new_id] = new_state.pop(old_id)
        new_config["_trigger_state"] = new_state
        changed = True

    if new_config.get("type") == "compound":
        new_conditions: list[dict[str, Any]] = []
        for cond in new_config.get("conditions", []) or []:
            new_cond, cond_changed = rewrite_trigger_config(cond, old_id, new_id)
            inner = new_cond.get("trigger_config") if isinstance(new_cond, dict) else None
            if isinstance(inner, dict):
                rewritten_inner, inner_changed = rewrite_trigger_config(inner, old_id, new_id)
                if inner_changed:
                    new_cond = {**new_cond, "trigger_config": rewritten_inner}
                    cond_changed = True
            if cond_changed:
                changed = True
            new_conditions.append(new_cond)
        if changed:
            new_config["conditions"] = new_conditions

    return new_config, changed


def rewrite_task(task_data: dict[str, Any], old_id: str, new_id: str) -> tuple[dict[str, Any], bool]:
    """Rewrite trigger_config + adaptive_config.environmental_entity in a task.

    Note: ``adaptive_config`` lives in the Store after the v1.x migration —
    this helper still rewrites the inline copy for the legacy / pre-migration
    path. The Store path is handled by ``rewrite_store``.
    """
    new_task = dict(task_data)
    changed = False

    tc = new_task.get("trigger_config")
    if isinstance(tc, dict):
        new_tc, tc_changed = rewrite_trigger_config(tc, old_id, new_id)
        if tc_changed:
            new_task["trigger_config"] = new_tc
            changed = True

    ac = new_task.get("adaptive_config")
    if isinstance(ac, dict) and ac.get("environmental_entity") == old_id:
        new_task["adaptive_config"] = {**ac, "environmental_entity": new_id}
        changed = True

    # A calendar-kind schedule (#187) names its HA calendar entity, and the
    # to-do mirror (D#183) its target lists: a renamed calendar left the task
    # without occurrences (never due again) and a renamed list orphaned the
    # mirrored rows (bug audit 2026-09-27).
    sched = new_task.get("schedule")
    if isinstance(sched, dict) and sched.get("kind") == "calendar" and sched.get("entity_id") == old_id:
        new_task["schedule"] = {**sched, "entity_id": new_id}
        changed = True

    mirrors = new_task.get("mirror_todo_entities")
    if isinstance(mirrors, list) and old_id in mirrors:
        new_task["mirror_todo_entities"] = [new_id if e == old_id else e for e in mirrors]
        changed = True

    # The completion action's target — above all the integration's reset
    # button wired at adoption (2.95): a renamed button used to leave the
    # counter running behind a repair message until someone re-picked it.
    action = new_task.get("on_complete_action")
    if isinstance(action, dict):
        new_action, action_changed = _rewrite_action(action, old_id, new_id)
        if action_changed:
            new_task["on_complete_action"] = new_action
            changed = True

    return new_task, changed


def _rewrite_action(action: dict[str, Any], old_id: str, new_id: str) -> tuple[dict[str, Any], bool]:
    """An action's ``target.entity_id`` and ``data.entity_id`` (a single id or
    a list) with ``old_id`` replaced."""
    new_action = dict(action)
    changed = False
    for part in ("target", "data"):
        block = new_action.get(part)
        if not isinstance(block, dict):
            continue
        eid = block.get("entity_id")
        if eid == old_id:
            new_action[part] = {**block, "entity_id": new_id}
            changed = True
        elif isinstance(eid, list) and old_id in eid:
            new_action[part] = {**block, "entity_id": [new_id if e == old_id else e for e in eid]}
            changed = True
    return new_action, changed


def rewrite_object(obj: dict[str, Any], old_id: str, new_id: str) -> tuple[dict[str, Any], bool]:
    """Rewrite the battery fleet's manual include / exclude lists (#135) —
    a renamed battery sensor fell out of the fleet (include) or came back
    into it (exclude) after an entity rename (bug audit 2026-09-27)."""
    from ..const import BATTERY_FLEET_EXCLUDED, BATTERY_FLEET_INCLUDED

    new_obj = dict(obj)
    changed = False
    for key in (BATTERY_FLEET_INCLUDED, BATTERY_FLEET_EXCLUDED):
        ids = new_obj.get(key)
        if isinstance(ids, list) and old_id in ids:
            new_obj[key] = sorted({new_id if e == old_id else e for e in ids})
            changed = True
    return new_obj, changed


def rewrite_tasks(tasks: dict[str, dict[str, Any]], old_id: str, new_id: str) -> tuple[dict[str, dict[str, Any]], bool]:
    """Rewrite all tasks in an entry; return (new_tasks, any_changed)."""
    new_tasks: dict[str, dict[str, Any]] = {}
    any_changed = False
    for tid, td in tasks.items():
        new_td, changed = rewrite_task(td, old_id, new_id)
        new_tasks[tid] = new_td
        if changed:
            any_changed = True
    return new_tasks, any_changed


def rewrite_store(store: Any, old_id: str, new_id: str) -> bool:
    """Rewrite ``adaptive_config.environmental_entity`` and ``trigger_runtime``
    keys in a ``MaintenanceStore``.

    These fields live in Store (not entry.data) after the v1.x migration —
    `_DYNAMIC_TASK_FIELDS` includes ``adaptive_config``, and per-entity
    trigger runtime is keyed by entity_id. Both must follow renames.

    Compound sub-triggers persist their per-entity runtime under
    ``_compound_<idx>_<entity_id>`` (entity/triggers/compound.py), so those
    keys are rewritten too — otherwise a renamed entity inside a compound
    condition silently restarts from an empty baseline after the reload.

    Returns True iff anything was rewritten.
    """
    changed = False
    compound_key = re.compile(r"_compound_(\d+)_" + re.escape(old_id))
    for state in store.all_task_states().values():
        ac = state.get("adaptive_config")
        if isinstance(ac, dict) and ac.get("environmental_entity") == old_id:
            state["adaptive_config"] = {**ac, "environmental_entity": new_id}
            changed = True
        # The to-do mirror's record of the rows it owns is keyed by list
        # entity: the rows live on the renamed list under the same uid, so
        # the record follows the rename instead of being re-added as
        # duplicates (bug audit 2026-09-27).
        mirror = state.get("todo_mirror")
        if isinstance(mirror, dict) and old_id in mirror:
            state["todo_mirror"] = {(new_id if k == old_id else k): v for k, v in mirror.items()}
            changed = True
        runtime = state.get("trigger_runtime")
        if not isinstance(runtime, dict):
            continue
        if old_id in runtime:
            runtime[new_id] = runtime.pop(old_id)
            changed = True
        for key in list(runtime):
            match = compound_key.fullmatch(key)
            if match is None:
                continue
            runtime[f"_compound_{match.group(1)}_{new_id}"] = runtime.pop(key)
            changed = True
    return changed


def migrate_object_unique_ids(hass: Any, entry: Any, old_name: str | None, new_name: str | None) -> int:
    """Rewrite per-task entity unique_ids after an object RENAME.

    Same dual-storage bug class as the trigger rewrites above, but for our
    own entities: every per-task unique_id embeds the object's NAME SLUG
    (``maintenance_supporter_{slug}_{task_id}[_suffix]``). Without this
    migration a rename orphans all registry entries on the next reload —
    the entities come back under NEW unique_ids (and new entity_ids), while
    dashboards and automations keep pointing at the now-unavailable old ones.

    Rewrites in place, preserving entity_ids, history, and user
    customisations. Returns the number of migrated entries. A slug collision
    (another object already using the new unique_id) is logged and skipped
    rather than raised — the reload then falls back to fresh entities for
    just that entry, which matches the pre-migration behaviour.
    """
    from homeassistant.helpers import entity_registry as er

    from ..const import slugify_object_name

    old_slug = slugify_object_name(old_name or "")
    new_slug = slugify_object_name(new_name or "")
    if not old_slug or not new_slug or old_slug == new_slug:
        return 0

    old_prefix = f"maintenance_supporter_{old_slug}_"
    new_prefix = f"maintenance_supporter_{new_slug}_"
    ent_reg = er.async_get(hass)
    migrated = 0
    for reg_entry in er.async_entries_for_config_entry(ent_reg, entry.entry_id):
        uid = reg_entry.unique_id or ""
        if not uid.startswith(old_prefix):
            continue
        new_uid = new_prefix + uid[len(old_prefix) :]
        try:
            ent_reg.async_update_entity(reg_entry.entity_id, new_unique_id=new_uid)
            migrated += 1
        except ValueError:
            import logging

            logging.getLogger(__name__).warning(
                "unique_id %s already taken while renaming %r -> %r; leaving %s",
                new_uid,
                old_name,
                new_name,
                reg_entry.entity_id,
            )
    return migrated
