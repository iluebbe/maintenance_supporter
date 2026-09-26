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

from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

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
    """The fields *task* demands on completion (empty when it demands none).

    Phase-aware (#139): a phase that sets its own required fields overrides
    the task's; the phase currently due is what is being completed.
    """
    if not task:
        return []
    from .phases import effective_field

    return sanitize_required_completion_fields(effective_field(task, "required_completion_fields"))


def missing_completion_fields(
    task: dict[str, Any] | None,
    *,
    notes: str | None = None,
    cost: float | None = None,
    duration: int | None = None,
    photo_doc_ids: list[str] | None = None,
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
        "photo": bool(photo_doc_ids),
        "user": bool(completed_by),
    }
    return [field for field in required if not supplied[field]]


def own_photo_doc_ids(hass: HomeAssistant, object_id: str, photo_doc_ids: list[str] | None) -> list[str]:
    """Keep only the ids that name an uploaded FILE document of this object.

    A completion (or a history edit) took any ``photo_doc_ids`` on trust:
    another object's document — or a web link — satisfied a required photo,
    got linked to the task and was even re-homed with it on ``task/move``
    (bug audit 2026-09-26). Unknown / foreign ids are dropped, like
    ``sanitize_consumes_parts`` drops unknown parts; a required photo that
    only had foreign ids is then reported missing by the choke point.
    """
    if not photo_doc_ids:
        return []
    from ..const import DOCUMENT_STORE_KEY, DOMAIN
    from .documents import KIND_FILE

    store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    if store is None:
        return []
    kept: list[str] = []
    for doc_id in photo_doc_ids:
        doc = store.documents.get(doc_id)
        if doc is not None and doc.get("kind") == KIND_FILE and doc.get("object_id") == object_id:
            kept.append(doc_id)
    return kept
