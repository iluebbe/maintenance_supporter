"""Helpers for rewriting entity_id references when HA renames an entity.

Used by the global ``EVENT_ENTITY_REGISTRY_UPDATED`` listener in ``__init__.py``
to keep ``trigger_config["entity_id"|"entity_ids"]`` and
``adaptive_config["environmental_entity"]`` in sync with the user's renames.

Without this, ``async_track_state_change_event`` (which subscribes by literal
entity_id) silently misses events on the new id — same dual-storage class of
bug as #48, but with feature breakage instead of a UI inconsistency.
"""

from __future__ import annotations

from typing import Any


def rewrite_trigger_config(
    config: dict[str, Any], old_id: str, new_id: str
) -> tuple[dict[str, Any], bool]:
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
                rewritten_inner, inner_changed = rewrite_trigger_config(
                    inner, old_id, new_id
                )
                if inner_changed:
                    new_cond = {**new_cond, "trigger_config": rewritten_inner}
                    cond_changed = True
            if cond_changed:
                changed = True
            new_conditions.append(new_cond)
        if changed:
            new_config["conditions"] = new_conditions

    return new_config, changed


def rewrite_task(
    task_data: dict[str, Any], old_id: str, new_id: str
) -> tuple[dict[str, Any], bool]:
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

    return new_task, changed


def rewrite_tasks(
    tasks: dict[str, dict[str, Any]], old_id: str, new_id: str
) -> tuple[dict[str, dict[str, Any]], bool]:
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

    Returns True iff anything was rewritten.
    """
    changed = False
    tasks_state: dict[str, Any] = store._data.get("tasks", {})
    for state in tasks_state.values():
        ac = state.get("adaptive_config")
        if isinstance(ac, dict) and ac.get("environmental_entity") == old_id:
            state["adaptive_config"] = {**ac, "environmental_entity": new_id}
            changed = True
        runtime = state.get("trigger_runtime")
        if isinstance(runtime, dict) and old_id in runtime:
            runtime[new_id] = runtime.pop(old_id)
            changed = True
    return changed
