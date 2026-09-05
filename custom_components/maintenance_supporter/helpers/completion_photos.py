"""Completion photos: the ids of the documents a history entry points at.

A completion can carry several photos (#161, #164): the entry stores
``photo_doc_ids`` — a capped, de-duplicated list of document ids. Entries
written before v2.75 carry a single ``photo_doc_id`` scalar; that key is
still READ (never rewritten in place) so old history keeps its picture, and
the WS layer still accepts the scalar from older clients and merges it into
the list. Every reader goes through :func:`history_photo_ids` so the two
shapes never diverge.
"""

from __future__ import annotations

from collections.abc import Iterable
from typing import Any

# Same order of magnitude as used_parts: enough for a before/after series,
# small enough that a runaway client cannot pin hundreds of docs to one entry.
MAX_COMPLETION_PHOTOS = 10


def normalize_photo_doc_ids(ids: Iterable[Any] | None, legacy: Any = None) -> list[str]:
    """Merge the list form and the legacy scalar into one clean list.

    Keeps order (scalar first, then the list), drops non-strings and blanks,
    de-duplicates and caps at :data:`MAX_COMPLETION_PHOTOS`.
    """
    out: list[str] = []
    candidates: list[Any] = [legacy]
    if ids is not None and not isinstance(ids, str):
        candidates.extend(ids)
    for cand in candidates:
        if not isinstance(cand, str):
            continue
        doc_id = cand.strip()
        if not doc_id or doc_id in out:
            continue
        out.append(doc_id)
        if len(out) >= MAX_COMPLETION_PHOTOS:
            break
    return out


def history_photo_ids(entry: dict[str, Any]) -> list[str]:
    """The photos of one history entry, whichever shape it was written in."""
    raw = entry.get("photo_doc_ids")
    return normalize_photo_doc_ids(raw if isinstance(raw, list) else None, entry.get("photo_doc_id"))
