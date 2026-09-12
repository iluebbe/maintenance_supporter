"""Every id-shaped WS command field carries a length cap (tripwire).

``task/move`` shipped with bare ``str`` for entry_id / task_id /
target_entry_id while every other handler used
``vol.All(str, vol.Length(max=MAX_ID_LENGTH))`` — now ``websocket.ID_FIELD``.
Two guards: the registered schemas are walked after setup (nested dicts and
lists included) and any ``*_id`` key whose validator has no ``vol.Length``
anywhere inside fails; and a source scan refuses the bare
``vol.Required("x_id"): str`` / ``vol.Any(str, None)`` spellings outright.
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any

import pytest
import voluptuous as vol
from homeassistant.components.websocket_api.const import DOMAIN as WS_DOMAIN
from homeassistant.core import HomeAssistant

from custom_components.maintenance_supporter.const import MAX_ID_LENGTH
from custom_components.maintenance_supporter.websocket import ID_FIELD

from .conftest import make_global_entry, setup_integration

_WS_DIR = Path(__file__).resolve().parent.parent / "custom_components" / "maintenance_supporter" / "websocket"
_ID_KEYS = {"entry_id", "task_id", "target_entry_id", "doc_id", "part_id"}


def _is_id_key(name: Any) -> bool:
    return isinstance(name, str) and (name.endswith("_id") or name in _ID_KEYS)


def _has_length(validator: Any) -> bool:
    """True when a ``vol.Length`` sits anywhere inside the validator tree."""
    if isinstance(validator, vol.Length):
        return True
    if isinstance(validator, (vol.All, vol.Any)):
        return any(_has_length(v) for v in validator.validators)
    if isinstance(validator, vol.Schema):
        return _has_length(validator.schema)
    if isinstance(validator, (list, tuple)):
        return any(_has_length(v) for v in validator)
    return False


def _walk(schema: Any, path: str, out: list[str]) -> None:
    """Collect ``path.key`` for every id-shaped key without a cap, descending
    into nested dict and list schemas."""
    if isinstance(schema, vol.Schema):
        schema = schema.schema
    if isinstance(schema, (vol.All, vol.Any)):
        for v in schema.validators:
            _walk(v, path, out)
        return
    if isinstance(schema, (list, tuple)):
        for v in schema:
            _walk(v, path, out)
        return
    if not isinstance(schema, dict):
        return
    for marker, validator in schema.items():
        name = getattr(marker, "schema", marker)
        if _is_id_key(name) and not _has_length(validator):
            out.append(f"{path}.{name}")
        _walk(validator, f"{path}.{name}", out)


async def test_every_id_field_is_length_capped(hass: HomeAssistant) -> None:
    await setup_integration(hass, make_global_entry(hass))
    registry = hass.data[WS_DOMAIN]
    seen = 0
    uncapped: list[str] = []
    for cmd, entry in registry.items():
        if not cmd.startswith("maintenance_supporter/"):
            continue
        schema = entry[1] if isinstance(entry, tuple) else getattr(entry, "_ws_schema", None)
        if not schema:
            continue
        seen += 1
        _walk(schema, cmd, uncapped)
    assert seen > 50, "the registry walk found too few schemas — is the setup wiring intact?"
    assert not uncapped, f"id fields without a vol.Length cap: {uncapped}"
    # task/move specifically (the drift that motivated this file).
    move = registry["maintenance_supporter/task/move"][1].schema
    for key in ("entry_id", "task_id", "target_entry_id"):
        validator = next(v for m, v in move.items() if getattr(m, "schema", None) == key)
        assert validator is ID_FIELD
        with pytest.raises(vol.Invalid):
            validator("x" * (MAX_ID_LENGTH + 1))


def test_no_bare_id_field_spelling_in_source() -> None:
    bare = re.compile(r'vol\.(?:Required|Optional)\("(\w*_id)"\):\s*(?:str,|vol\.Any\(str,)')
    offenders = [f"{p.name}:{m.group(1)}" for p in _WS_DIR.glob("*.py") for m in bare.finditer(p.read_text(encoding="utf-8"))]
    assert not offenders, offenders
