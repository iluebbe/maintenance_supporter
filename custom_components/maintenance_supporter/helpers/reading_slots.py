"""Reading slots: several named values per completion (#161 phase 2).

A ``reading``-type task may declare *slots* — ``readings: [{id, name,
unit}]`` — so one task ("monthly meter round") records one value per meter
at every completion. The history entry then carries a SNAPSHOT
``reading_values: [{id, name, unit, value}]``: name and unit are copied at
completion time so renaming or deleting a slot later never falsifies old
entries, while the stable ``id`` is what deltas match on.

Tasks without slots keep the single ``reading_value`` scalar (v2.20) with
the task-level ``reading_unit``; an entry never carries both shapes.

Every write path (WS create/update, options flow, JSON/CSV import, service
call) funnels through :func:`sanitize_reading_slots`, and every completion
through :func:`resolve_reading_values`, so the persisted shapes cannot
drift between surfaces.
"""

from __future__ import annotations

import math
import re
from collections.abc import Iterable, Mapping
from typing import Any
from uuid import uuid4

from ..const import MAX_READING_UNIT_LENGTH

# Enough for a nine-meter round twice over; small enough to keep the
# completion dialog and the sensor attribute readable.
MAX_READING_SLOTS = 20
MAX_READING_SLOT_NAME_LENGTH = 50
# Mirrors the scalar reading_value bounds in the WS/service schemas.
READING_VALUE_RANGE = (-1e12, 1e12)

_SLOT_ID_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,31}$")


def new_slot_id() -> str:
    """A fresh slot id — short, url/attribute-safe, unique enough per task."""
    return uuid4().hex[:8]


def _clean_unit(raw: Any) -> str | None:
    if not isinstance(raw, str):
        return None
    unit = raw.strip()[:MAX_READING_UNIT_LENGTH]
    return unit or None


def sanitize_reading_slots(raw: Any) -> list[dict[str, Any]]:
    """Validate a task's slot list from ANY write path.

    Keeps ``[{id, name, unit}]`` with a non-empty name; a missing/invalid id
    gets a fresh one, a duplicated id OR name (case-insensitive) is dropped
    (the first wins — names key the sensor attribute and the service call,
    so they must be unique), the list is capped. Anything that is not a
    list of mappings yields ``[]``.
    """
    if not isinstance(raw, list):
        return []
    out: list[dict[str, Any]] = []
    seen: set[str] = set()
    seen_names: set[str] = set()
    for item in raw:
        if not isinstance(item, Mapping):
            continue
        name = item.get("name")
        if not isinstance(name, str):
            continue
        name = name.strip()[:MAX_READING_SLOT_NAME_LENGTH]
        if not name:
            continue
        slot_id = item.get("id")
        if not isinstance(slot_id, str) or not _SLOT_ID_RE.match(slot_id):
            slot_id = new_slot_id()
        if slot_id in seen or name.casefold() in seen_names:
            continue
        seen.add(slot_id)
        seen_names.add(name.casefold())
        out.append({"id": slot_id, "name": name, "unit": _clean_unit(item.get("unit"))})
        if len(out) >= MAX_READING_SLOTS:
            break
    return out


def parse_reading_slots_text(text: str, existing: Iterable[Mapping[str, Any]] | None = None) -> list[dict[str, Any]]:
    """Parse the options-flow / CSV textarea form: one ``Name | Unit`` per line.

    Ids are not part of the text, so a line whose name matches an existing
    slot (case-insensitive) keeps that slot's id — editing units or the
    order in the flow must not break the delta chain of old entries.
    """
    by_name: dict[str, str] = {}
    for slot in sanitize_reading_slots(list(existing or [])):
        by_name.setdefault(slot["name"].casefold(), slot["id"])
    slots: list[dict[str, Any]] = []
    for line in (text or "").splitlines():
        if not line.strip():
            continue
        name, _, unit = line.partition("|")
        name = name.strip()
        slots.append({"id": by_name.get(name.casefold()), "name": name, "unit": unit.strip() or None})
    return sanitize_reading_slots(slots)


def reading_slots_text(slots: Iterable[Mapping[str, Any]] | None) -> str:
    """Inverse of :func:`parse_reading_slots_text` (textarea default value)."""
    lines = []
    for slot in sanitize_reading_slots(list(slots or [])):
        lines.append(f"{slot['name']} | {slot['unit']}" if slot.get("unit") else slot["name"])
    return "\n".join(lines)


def _clean_value(raw: Any) -> float | None:
    """A finite number inside the reading range, else None."""
    if isinstance(raw, bool) or not isinstance(raw, (int, float)):
        return None
    value = float(raw)
    if not math.isfinite(value) or not READING_VALUE_RANGE[0] <= value <= READING_VALUE_RANGE[1]:
        return None
    return value


def resolve_reading_values(
    slots: Iterable[Mapping[str, Any]] | None,
    values: Mapping[str, Any] | None,
    *,
    keep: Iterable[Mapping[str, Any]] | None = None,
    default_unit: str | None = None,
) -> list[dict[str, Any]]:
    """Turn ``{slot_id: value}`` into the history snapshot, in slot order.

    ``None`` values (a meter not read this time) are skipped. Ids that are
    neither a current slot nor present in ``keep`` (an edited entry's own
    snapshot, whose slot may have been deleted since) raise ``ValueError``
    naming the id — the WS layer turns that into ``invalid_input``.
    A current slot without a unit snapshots ``default_unit`` (the task's
    ``reading_unit``) — the same fallback the complete dialog shows.
    """
    if not values:
        return []
    known: dict[str, dict[str, Any]] = {}
    for snap in history_reading_values({"reading_values": list(keep or [])}):
        known[snap["id"]] = {"id": snap["id"], "name": snap["name"], "unit": snap.get("unit")}
    current = sanitize_reading_slots(list(slots or []))
    for slot in current:
        known[slot["id"]] = {**slot, "unit": slot.get("unit") or _clean_unit(default_unit)}
    order = [s["id"] for s in current] + [sid for sid in known if sid not in {s["id"] for s in current}]
    unknown = [sid for sid in values if sid not in known]
    if unknown:
        raise ValueError(f"unknown reading slot: {unknown[0]}")
    out: list[dict[str, Any]] = []
    for slot_id in order:
        if slot_id not in values:
            continue
        value = _clean_value(values[slot_id])
        if value is None:
            continue
        slot = known[slot_id]
        out.append({"id": slot_id, "name": slot["name"], "unit": slot.get("unit"), "value": value})
    return out


def resolve_reading_values_by_name(
    slots: Iterable[Mapping[str, Any]] | None,
    values: Mapping[str, Any] | None,
    *,
    default_unit: str | None = None,
) -> list[dict[str, Any]]:
    """Service-call form: ``{name: value}`` (case-insensitive; an id works too).

    Automations know meters by name, not by the panel's generated ids.
    """
    if not values:
        return []
    current = sanitize_reading_slots(list(slots or []))
    by_key: dict[str, str] = {}
    for slot in current:
        by_key[slot["id"]] = slot["id"]
        by_key.setdefault(slot["name"].casefold(), slot["id"])
    by_id: dict[str, Any] = {}
    for key, value in values.items():
        slot_id = by_key.get(str(key).strip().casefold()) or by_key.get(str(key).strip())
        if slot_id is None:
            raise ValueError(f"unknown reading: {key}")
        by_id[slot_id] = value
    return resolve_reading_values(current, by_id, default_unit=default_unit)


def history_reading_values(entry: Mapping[str, Any] | None) -> list[dict[str, Any]]:
    """The validated ``reading_values`` snapshot of a history entry."""
    if not entry:
        return []
    raw = entry.get("reading_values")
    if not isinstance(raw, list):
        return []
    out: list[dict[str, Any]] = []
    seen: set[str] = set()
    for item in raw:
        if not isinstance(item, Mapping):
            continue
        slot_id = item.get("id")
        name = item.get("name")
        value = _clean_value(item.get("value"))
        if not isinstance(slot_id, str) or not slot_id or slot_id in seen or not isinstance(name, str) or value is None:
            continue
        seen.add(slot_id)
        out.append({"id": slot_id, "name": name.strip()[:MAX_READING_SLOT_NAME_LENGTH], "unit": _clean_unit(item.get("unit")), "value": value})
    return out


def last_reading_attributes(history: Iterable[Mapping[str, Any]] | None) -> dict[str, Any]:
    """Entity attributes for the most recent recorded readings.

    ``last_reading`` (scalar tasks) / ``last_readings`` (``{name: value}`` for
    slot tasks) — taken from the newest completion carrying either shape,
    so templates and automations can use the values without parsing history.
    """
    newest: Mapping[str, Any] | None = None
    for entry in history or []:
        if not isinstance(entry, Mapping) or entry.get("type") != "completed":
            continue
        if entry.get("reading_value") is None and not entry.get("reading_values"):
            continue
        if newest is None or str(entry.get("timestamp", "")) >= str(newest.get("timestamp", "")):
            newest = entry
    if newest is None:
        return {}
    attrs: dict[str, Any] = {}
    snapshot = history_reading_values(newest)
    if snapshot:
        attrs["last_readings"] = {snap["name"]: snap["value"] for snap in snapshot}
    elif (scalar := _clean_value(newest.get("reading_value"))) is not None:
        attrs["last_reading"] = scalar
    if attrs:
        attrs["last_reading_at"] = newest.get("timestamp")
    return attrs
