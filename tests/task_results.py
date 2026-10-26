"""Build coordinator task results in tests.

The coordinator publishes one :class:`TaskResult` per task. Tests that seed
``coordinator.data`` by hand often think in the old flat shape (the task's
fields plus ``_status``, ``_days_until_due``, ...); :func:`as_result` takes
that shape and splits it: ``_``-prefixed keys that name a result field go to
the attribute, everything else into ``result.task``.
"""

from __future__ import annotations

import dataclasses
from collections.abc import Mapping
from typing import Any

from custom_components.maintenance_supporter.models.task_result import TaskResult

_FIELDS = {f.name for f in dataclasses.fields(TaskResult)} - {"task"}


def as_result(flat: Mapping[str, Any] | TaskResult) -> TaskResult:
    """A TaskResult from the flat test shape (a TaskResult passes through)."""
    if isinstance(flat, TaskResult):
        return flat
    task: dict[str, Any] = {}
    computed: dict[str, Any] = {}
    for key, value in flat.items():
        if key.startswith("_") and key[1:] in _FIELDS:
            computed[key[1:]] = value
        else:
            task[key] = value
    return TaskResult(task=task, **computed)


def as_results(tasks: Mapping[str, Mapping[str, Any] | TaskResult]) -> dict[str, TaskResult]:
    """``{task_id: flat}`` → ``{task_id: TaskResult}``."""
    return {task_id: as_result(flat) for task_id, flat in tasks.items()}


def coordinator_data(tasks: Mapping[str, Mapping[str, Any] | TaskResult], obj: Mapping[str, Any] | None = None) -> dict[str, Any]:
    """``coordinator.data`` for the given tasks (flat shape or results)."""
    return {"object": dict(obj or {}), "tasks": as_results(tasks)}


def flat(result: TaskResult | None) -> dict[str, Any]:
    """The old flat shape of a result (``{}`` for None), for tests that
    compare against it."""
    if result is None:
        return {}
    out = dict(result.task)
    for field in dataclasses.fields(TaskResult):
        if field.name != "task":
            out[f"_{field.name}"] = getattr(result, field.name)
    return out
