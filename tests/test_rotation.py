"""Tests for shared-task assignee rotation.

A task can carry an ``assignee_pool`` (HA user UUIDs) + ``rotation_strategy``;
each completion advances ``responsible_user_id`` to the next pool member. The
single pointer keeps every existing per-user notification/badge working.
"""

from __future__ import annotations

from custom_components.maintenance_supporter.helpers.sanitize import cap_task_fields
from custom_components.maintenance_supporter.models.maintenance_task import (
    MaintenanceTask,
)

A, B, C = "user-a", "user-b", "user-c"


# ─── Round-trip ─────────────────────────────────────────────────────────────


def test_model_roundtrips_pool_and_strategy() -> None:
    task = MaintenanceTask(
        name="X", assignee_pool=[A, B], rotation_strategy="round_robin"
    )
    d = task.to_dict()
    assert d["assignee_pool"] == [A, B]
    assert d["rotation_strategy"] == "round_robin"
    back = MaintenanceTask.from_dict(d)
    assert back.assignee_pool == [A, B]
    assert back.rotation_strategy == "round_robin"


def test_empty_pool_and_strategy_not_persisted() -> None:
    d = MaintenanceTask(name="X").to_dict()
    assert "assignee_pool" not in d
    assert "rotation_strategy" not in d


# ─── Rotation strategies ────────────────────────────────────────────────────


def test_round_robin_advances_and_wraps() -> None:
    task = MaintenanceTask(
        name="X", assignee_pool=[A, B, C], rotation_strategy="round_robin",
        responsible_user_id=A,
    )
    task.complete(completed_by=A)
    assert task.responsible_user_id == B
    task.complete(completed_by=B)
    assert task.responsible_user_id == C
    task.complete(completed_by=C)
    assert task.responsible_user_id == A  # wraps


def test_round_robin_from_none_starts_at_first() -> None:
    task = MaintenanceTask(
        name="X", assignee_pool=[A, B], rotation_strategy="round_robin",
        responsible_user_id=None,
    )
    task.complete()
    assert task.responsible_user_id == A


def test_least_completed_picks_fewest() -> None:
    # A has two prior completions, B none → after completing (credited to A),
    # B is still least → becomes responsible.
    task = MaintenanceTask(
        name="X", assignee_pool=[A, B], rotation_strategy="least_completed",
        responsible_user_id=A,
        history=[
            {"timestamp": "2026-01-01T00:00:00+00:00", "type": "completed", "completed_by": A},
            {"timestamp": "2026-02-01T00:00:00+00:00", "type": "completed", "completed_by": A},
        ],
    )
    task.complete(completed_by=A)
    assert task.responsible_user_id == B


def test_random_stays_in_pool_and_rotates_off_current() -> None:
    task = MaintenanceTask(
        name="X", assignee_pool=[A, B], rotation_strategy="random",
        responsible_user_id=A,
    )
    task.complete(completed_by=A)
    # Only B is an "other" member → deterministic here.
    assert task.responsible_user_id == B


# ─── No-op cases ────────────────────────────────────────────────────────────


def test_no_rotation_when_pool_too_small() -> None:
    task = MaintenanceTask(
        name="X", assignee_pool=[A], rotation_strategy="round_robin",
        responsible_user_id=A,
    )
    task.complete(completed_by=A)
    assert task.responsible_user_id == A


def test_no_rotation_without_strategy() -> None:
    task = MaintenanceTask(
        name="X", assignee_pool=[A, B], rotation_strategy=None,
        responsible_user_id=A,
    )
    task.complete(completed_by=A)
    assert task.responsible_user_id == A


# ─── Sanitizer ──────────────────────────────────────────────────────────────


def test_sanitize_pool_trims_dedups() -> None:
    task = {"name": "X", "assignee_pool": ["  user-a ", "user-a", "", "user-b"]}
    cap_task_fields(task)
    assert task["assignee_pool"] == ["user-a", "user-b"]


def test_sanitize_drops_invalid_strategy() -> None:
    task = {"name": "X", "rotation_strategy": "bogus"}
    cap_task_fields(task)
    assert "rotation_strategy" not in task


def test_sanitize_keeps_valid_strategy() -> None:
    task = {"name": "X", "rotation_strategy": "least_completed"}
    cap_task_fields(task)
    assert task["rotation_strategy"] == "least_completed"
