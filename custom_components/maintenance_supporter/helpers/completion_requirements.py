"""Per-task "you must record this when you finish" rules.

A task can demand that certain details are captured on completion — a note,
what it cost, how long it took, a photo, or who did it. The point is the
household record: a shared chore or a rental hand-over is worth little if
half the completions are a bare tap.

Enforcement deliberately lives at the ONE choke point every surface funnels
through (``coordinator.complete_maintenance``) rather than in the dialog, so
the rule cannot be walked around by completing from a button, the to-do
list, an NFC tag, a notification action, voice or a service call. Surfaces
that CAN collect the data (panel + card dialogs) pre-empt the rejection by
opening the completion dialog; the rest fail with a message naming exactly
what is missing.

**Automatic completions are exempt** (``auto=True``): a problem sensor that
clears itself has no user to ask, and a required photo would otherwise leave
the task stuck overdue forever. Same reasoning as a rotation not advancing
on an automatic completion — nobody did the work, so nobody is asked for it.
"""

from __future__ import annotations

from typing import Any

# Requestable fields, in the order they are shown and reported. Kept as a
# tuple so the WS schema, the sanitizer and the TS dialog agree by
# construction (parity tripwire: tests/test_parity_task_fields.py).
REQUIRABLE_COMPLETION_FIELDS: tuple[str, ...] = ("notes", "cost", "duration", "photo", "user")


def sanitize_required_completion_fields(value: object) -> list[str]:
    """Clean a required-fields list: known keys only, deduped, stable order."""
    if not isinstance(value, list):
        return []
    seen = {str(item) for item in value if isinstance(item, str)}
    return [field for field in REQUIRABLE_COMPLETION_FIELDS if field in seen]


def required_completion_fields(task: dict[str, Any] | None) -> list[str]:
    """The fields *task* demands on completion (empty when it demands none)."""
    if not task:
        return []
    return sanitize_required_completion_fields(task.get("required_completion_fields"))


def missing_completion_fields(
    task: dict[str, Any] | None,
    *,
    notes: str | None = None,
    cost: float | None = None,
    duration: int | None = None,
    photo_doc_id: str | None = None,
    completed_by: str | None = None,
) -> list[str]:
    """Which required fields this completion attempt does NOT satisfy.

    A field counts as satisfied when a real value arrived: a note must carry
    non-whitespace text, and cost/duration must be present — ``0`` is a
    legitimate answer ("it cost nothing", "it took no time"), so only
    ``None`` counts as missing.
    """
    required = required_completion_fields(task)
    if not required:
        return []
    supplied = {
        "notes": bool(notes and str(notes).strip()),
        "cost": cost is not None,
        "duration": duration is not None,
        "photo": bool(photo_doc_id),
        "user": bool(completed_by),
    }
    return [field for field in required if not supplied[field]]
