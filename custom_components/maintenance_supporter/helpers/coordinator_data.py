"""Whether a coordinator has run its first refresh, and what it published."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from ..const import CONF_TASKS

if TYPE_CHECKING:
    from ..models.task_result import TaskResult


def has_coordinator_data(coordinator: Any) -> bool:
    """True once the coordinator's first refresh has produced data.

    Home Assistant's DataUpdateCoordinator types ``data`` as the payload,
    but it is None until the first refresh — a check written against it
    reads as unreachable to mypy (warn_unreachable, as HA core runs it).
    """
    return getattr(coordinator, "data", None) is not None


def task_results(coordinator: Any) -> dict[str, TaskResult]:
    """The task results an object coordinator published: {} before its first
    refresh, and for no coordinator at all (an entry that is not loaded)."""
    data = getattr(coordinator, "data", None)
    results: dict[str, TaskResult] = data.get(CONF_TASKS) or {} if data else {}
    return results
