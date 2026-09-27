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


# ── Unattached completion photos (bug audit 2026-09-27, R SEC-3) ─────────────
#
# Every signed-in user may upload a completion photo (the document is tagged
# exactly "photo"); it becomes part of the record once a completion or a
# history edit references it. One that never gets there — the dialog was
# cancelled, the photo removed again, the upload finished after the save —
# is an orphan that counted against the object's document cap and that a
# non-writer could not delete (documents/delete is write-gated).

PHOTO_TAG = "photo"
#: At most this many unattached photos per object from non-writer uploads.
MAX_UNATTACHED_PHOTOS_PER_OBJECT = 20
#: The retention sweep removes unattached photos older than this.
UNATTACHED_PHOTO_MAX_AGE_HOURS = 24


def photo_references(hass: HomeAssistant, *, strict: bool = True) -> set[str] | None:
    """Every document id a history entry (``photo_doc_ids`` or the legacy
    scalar) or a spare part (``doc_id``) points at, across all objects.

    ``strict``: ``None`` when an object's Store is not loaded (disabled,
    setup retry, mid-reload) — its history cannot be read, so the automatic
    sweep must not judge anything unreferenced. Non-strict (a user discarding
    the photo they just uploaded) reads what is loaded; a photo in a
    completion record is also linked to its task, which
    :func:`is_unattached_photo` checks on its own.
    """
    from .aggregate import get_object_entries, merged_tasks
    from .completion_photos import history_photo_ids

    refs: set[str] = set()
    for entry in get_object_entries(hass):
        rd = getattr(entry, "runtime_data", None)
        if strict and getattr(rd, "store", None) is None:
            return None
        for task in merged_tasks(entry).values():
            for hist in task.get("history") or []:
                if isinstance(hist, dict):
                    refs.update(history_photo_ids(hist))
        for part in (entry.data.get("parts") or {}).values():
            if isinstance(part, dict) and isinstance(part.get("doc_id"), str):
                refs.add(part["doc_id"])
    return refs


def is_unattached_photo(doc: dict[str, Any], doc_id: str, references: set[str]) -> bool:
    """A file tagged exactly ``photo`` that nothing points at: no history
    entry, no spare part, no task / part link."""
    from .documents import KIND_FILE

    return (
        doc.get("kind") == KIND_FILE
        and list(doc.get("tags") or []) == [PHOTO_TAG]
        and not doc.get("task_ids")
        and not doc.get("part_ids")
        and doc_id not in references
    )


def unattached_photo_ids(hass: HomeAssistant, object_id: str | None = None, *, strict: bool = True) -> list[str] | None:
    """The unattached photos (of one object, or all); ``None`` when that
    cannot be decided (see :func:`photo_references`)."""
    from ..const import DOCUMENT_STORE_KEY, DOMAIN

    store = hass.data.get(DOMAIN, {}).get(DOCUMENT_STORE_KEY)
    if store is None:
        return []
    references = photo_references(hass, strict=strict)
    if references is None:
        return None
    return [
        doc_id
        for doc_id, doc in store.documents.items()
        if (object_id is None or doc.get("object_id") == object_id) and is_unattached_photo(doc, doc_id, references)
    ]


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
