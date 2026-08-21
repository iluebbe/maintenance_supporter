"""Task create/update schema ↔ field-map ↔ sanitize-cap parity tripwires.

Drift audit 2026-08 (B1/B2): the task field vocabulary is maintained in FOUR
hand-written places — the create schema, the update schema, the
TASK_UPDATE_FIELD_MAP, and the create handler's if-chain — and the sanitize
string-cap map claims to mirror the schemas. `call_ws_handler` unwraps
``__wrapped__``, so no behavioural test ever exercises the voluptuous
schemas: a field added to one copy but not another ships silently (created-
but-not-persisted, or rejected only on a REAL HA connection). These tests pin
all the pairs at the source level.
"""

from __future__ import annotations

import inspect

import voluptuous as vol

from custom_components.maintenance_supporter.websocket.tasks_crud import (
    _TASK_CREATE_SCHEMA,
    _TASK_UPDATE_SCHEMA,
    TASK_UPDATE_FIELD_MAP,
    ws_create_task,
)

# Transport/control keys that are legitimately schema-only.
_CREATE_TRANSPORT = {"type", "entry_id", "dry_run"}
_UPDATE_TRANSPORT = {"type", "entry_id", "task_id"}
# Wire names that reach storage through a dedicated path rather than the
# field map: `name`/`task_type`/`enabled` are handled explicitly by both
# handlers, `schedule`/`schedule_time` go through Schedule.from_dict /
# feature-gated handling, `last_performed` seeds the Store.
_MAPLESS_WIRE_KEYS = {"name", "task_type", "enabled", "schedule", "schedule_time", "last_performed"}


def _keys(schema_dict: dict) -> set[str]:
    return {marker.schema for marker in schema_dict}


def _length_max(validator) -> int | None:
    """Max string length recursively extracted from a voluptuous validator."""
    if isinstance(validator, vol.Length):
        return validator.max
    for attr in ("validators", "schema"):
        inner = getattr(validator, attr, None)
        if isinstance(inner, (list, tuple)):
            for v in inner:
                found = _length_max(v)
                if found is not None:
                    return found
    return None


def _is_enum_validated(validator) -> bool:
    """True when the validator (or one of its parts) bounds the value harder
    than a length cap: a vol.In allowlist, or a fully-anchored vol.Match
    regex (fixed shape ⇒ fixed length)."""
    if isinstance(validator, vol.In):
        return True
    if isinstance(validator, vol.Match) and validator.pattern.pattern.startswith("^") and validator.pattern.pattern.endswith("$"):
        return True
    for attr in ("validators", "schema"):
        inner = getattr(validator, attr, None)
        if isinstance(inner, (list, tuple)) and any(_is_enum_validated(v) for v in inner):
            return True
    return False


def test_create_and_update_schemas_share_the_field_vocabulary() -> None:
    """A field present in one schema must be present in the other."""
    create_fields = _keys(_TASK_CREATE_SCHEMA) - _CREATE_TRANSPORT
    update_fields = _keys(_TASK_UPDATE_SCHEMA) - _UPDATE_TRANSPORT
    assert create_fields == update_fields, (
        f"create-only: {sorted(create_fields - update_fields)}, "
        f"update-only: {sorted(update_fields - create_fields)}"
    )


def test_schemas_cover_the_update_field_map() -> None:
    """Every wire key the update loop persists must be accepted by BOTH
    schemas, and every schema field must either be in the map or on the
    documented mapless list — no silent third category."""
    map_keys = set(TASK_UPDATE_FIELD_MAP)
    create_fields = _keys(_TASK_CREATE_SCHEMA) - _CREATE_TRANSPORT
    update_fields = _keys(_TASK_UPDATE_SCHEMA) - _UPDATE_TRANSPORT

    assert map_keys <= create_fields, f"map keys missing from create schema: {sorted(map_keys - create_fields)}"
    assert map_keys <= update_fields, f"map keys missing from update schema: {sorted(map_keys - update_fields)}"

    unaccounted = create_fields - map_keys - _MAPLESS_WIRE_KEYS
    assert not unaccounted, (
        f"schema fields neither in TASK_UPDATE_FIELD_MAP nor documented as "
        f"mapless: {sorted(unaccounted)} — add to the map or to "
        f"_MAPLESS_WIRE_KEYS here WITH a reason"
    )


def test_create_handler_reads_every_mapped_field() -> None:
    """The create handler persists via a hand-written if-chain (unlike
    update's single loop). A field added to the map/schemas but forgotten
    there is silently dropped on create."""
    source = inspect.getsource(ws_create_task)
    missing = [key for key in TASK_UPDATE_FIELD_MAP if f'"{key}"' not in source]
    assert not missing, f"ws_create_task never reads: {missing}"


def test_task_schema_string_caps_match_sanitize_map() -> None:
    """Task twin of test_object_schema_string_caps_match_sanitize_map — the
    sanitize cap map documents itself as mirroring these schemas, but only
    the OBJECT side was tripwired (drift audit 2026-08)."""
    from custom_components.maintenance_supporter.helpers.sanitize import _TASK_STR_LIMITS

    # The sanitize map is STORAGE-keyed ("type" = the task's type, wire name
    # "task_type"); the schemas are WIRE-keyed (where "type" is the WS command
    # id). Translate via the field map before comparing.
    for schema_dict, label in ((_TASK_CREATE_SCHEMA, "create"), (_TASK_UPDATE_SCHEMA, "update")):
        transport = _CREATE_TRANSPORT if label == "create" else _UPDATE_TRANSPORT
        caps: dict[str, int] = {}
        for marker, validator in schema_dict.items():
            wire_key = marker.schema
            if wire_key in transport:
                continue
            storage_key = TASK_UPDATE_FIELD_MAP.get(wire_key, wire_key)
            cap = _length_max(validator)
            if cap is not None and storage_key in _TASK_STR_LIMITS:
                caps[storage_key] = cap
        for storage_key, cap in caps.items():
            assert cap == _TASK_STR_LIMITS[storage_key], (
                f"{label} schema caps {storage_key} at {cap}, sanitize map says {_TASK_STR_LIMITS[storage_key]}"
            )
        # Every sanitize-capped string field the schemas accept must carry a
        # schema-side cap too (a cap on only one side is the drift we pin).
        wire_for_storage = {v: k for k, v in TASK_UPDATE_FIELD_MAP.items()}
        by_wire = {marker.schema: validator for marker, validator in schema_dict.items()}
        schema_keys = set(by_wire) - transport
        for storage_key in _TASK_STR_LIMITS:
            wire_key = wire_for_storage.get(storage_key, storage_key)
            if wire_key in schema_keys:
                # A vol.In allowlist bounds the value harder than any length.
                assert storage_key in caps or _is_enum_validated(by_wire[wire_key]), (
                    f"{label} schema accepts {wire_key} without a string cap"
                )
