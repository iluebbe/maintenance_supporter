"""Task phases (#139): a cyclic sequence of different activities on ONE
shared cadence.

Some maintenance is a fixed cycle of distinct steps on one clock — the
robot-mower blade protocol (swap disks → flip blades → swap disks → REPLACE
blades), "every 4th car service is the big one", and friends. One task keeps
the scheduling correct (the cadence resets on completion, so a late step
pushes everything); the phases carry the differing CONTENT: name, checklist,
consumed parts, required completion fields.

Model:
- ``phases``  — dict of phase DEFINITIONS keyed by a slug id. Definitions +
  sequence are separate so a step used twice (both "swap" occurrences) is
  edited once and pools its statistics by id.
- ``phase_sequence`` — the ordered cycle of def ids (repeats allowed).
- ``phase_cursor`` — DYNAMIC (Store, like the rotation pointer): the index
  of the phase currently due. Advances only on a latest completion; skip,
  missed, reset and pure backfills leave it untouched (the physical state
  did not change — the same step stays due, only the clock restarts).

A phase field that is SET overrides the task-level field; unset falls
through to the task (override, never merge — predictable).
"""

from __future__ import annotations

import re
from typing import Any

from .completion_requirements import sanitize_required_completion_fields

MAX_PHASE_DEFS = 10
MAX_PHASE_SEQUENCE = 12
MAX_PHASE_NAME_LENGTH = 100
MAX_PHASE_NOTES_LENGTH = 500

_PHASE_ID_RX = re.compile(r"^[a-z0-9][a-z0-9_-]{0,31}$")

# Fields a phase definition may override on the task. Kept as a tuple so the
# sanitizer, the effective-value reader and the TS dialog agree by
# construction.
PHASE_OVERRIDE_FIELDS: tuple[str, ...] = ("checklist", "consumes_parts", "required_completion_fields")


def sanitize_phase_defs(value: object) -> dict[str, dict[str, Any]]:
    """Clean the phase-definition map: slug ids, capped names/notes, known
    override fields only. ``consumes_parts`` gets its full part validation at
    the write path (the caller has the part registry); here it is shape-only.
    """
    if not isinstance(value, dict):
        return {}
    out: dict[str, dict[str, Any]] = {}
    for raw_id, raw_def in value.items():
        if len(out) >= MAX_PHASE_DEFS:
            break
        if not isinstance(raw_id, str) or not _PHASE_ID_RX.match(raw_id):
            continue
        if not isinstance(raw_def, dict):
            continue
        name = raw_def.get("name")
        if not isinstance(name, str) or not name.strip():
            continue
        clean: dict[str, Any] = {"name": name.strip()[:MAX_PHASE_NAME_LENGTH]}
        notes = raw_def.get("notes")
        if isinstance(notes, str) and notes.strip():
            clean["notes"] = notes.strip()[:MAX_PHASE_NOTES_LENGTH]
        checklist = raw_def.get("checklist")
        if isinstance(checklist, list):
            items = [str(i).strip()[:200] for i in checklist if isinstance(i, str) and i.strip()]
            if items:
                clean["checklist"] = items[:20]
        rcf = raw_def.get("required_completion_fields")
        if isinstance(rcf, list):
            cleaned = sanitize_required_completion_fields(rcf)
            if cleaned:
                clean["required_completion_fields"] = cleaned
        cp = raw_def.get("consumes_parts")
        if isinstance(cp, list) and cp:
            clean["consumes_parts"] = cp  # per-part validation at the write path
        out[raw_id] = clean
    return out


def sanitize_phase_sequence(value: object, defs: dict[str, Any]) -> list[str]:
    """Clean the cycle: known def ids only, capped length."""
    if not isinstance(value, list) or not defs:
        return []
    seq = [item for item in value if isinstance(item, str) and item in defs]
    return seq[:MAX_PHASE_SEQUENCE]


def has_phases(task: dict[str, Any] | None) -> bool:
    return bool(task and task.get("phases") and task.get("phase_sequence"))


def clamp_phase_cursor(cursor: object, sequence_len: int) -> int:
    """A cursor from the Store against the CURRENT sequence (which an edit
    may have shortened) — the Store wins on restore, but never out of range."""
    if sequence_len <= 0:
        return 0
    if isinstance(cursor, bool) or not isinstance(cursor, (int, float, str)):
        return 0
    try:
        value = int(cursor)
    except (ValueError, OverflowError):
        return 0
    if value < 0:
        return 0
    return value % sequence_len


def current_phase(task: dict[str, Any] | None) -> dict[str, Any] | None:
    """The phase definition currently due, or None for a phase-less task.

    Returns ``{id, name, index, count, ...def fields}``.
    """
    if not task or not has_phases(task):
        return None
    defs: dict[str, Any] = task.get("phases") or {}
    seq: list[str] = task.get("phase_sequence") or []
    cursor = clamp_phase_cursor(task.get("phase_cursor", 0), len(seq))
    phase_id = seq[cursor]
    definition = defs.get(phase_id)
    if not isinstance(definition, dict):
        return None
    return {"id": phase_id, "index": cursor, "count": len(seq), **definition}


def effective_field(task: dict[str, Any] | None, field: str) -> Any:
    """The value *field* effectively has for the phase currently due:
    set on the phase → the phase's value; else the task's value."""
    phase = current_phase(task)
    if phase is not None and field in PHASE_OVERRIDE_FIELDS and field in phase:
        return phase[field]
    return (task or {}).get(field)
