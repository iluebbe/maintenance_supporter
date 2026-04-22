"""Static + functional regression tests for the trigger-config save path.

The WS validator strips any key not in `_TRIGGER_ALLOWED_KEYS` (see
`websocket/tasks.py`). Historically the allowlist drifted out of sync with the
trigger classes — `trigger_from_state` / `trigger_to_state` (state_change),
`trigger_for_minutes` (threshold), `trigger_delta_mode` (counter), `attribute`
(all triggers via base_trigger) all used to be silently dropped, leaving the
trigger to fall back to permissive defaults. These tests pin the allowlist
against actual usage so the next regression is caught at test time, not by a
user filing an issue.
"""

from __future__ import annotations

import re
from pathlib import Path
from unittest.mock import MagicMock

import pytest

from custom_components.maintenance_supporter.websocket.tasks import (
    _TRIGGER_ALLOWED_KEYS,
    _validate_trigger_config,
)


@pytest.fixture
def mock_hass():
    """Minimal hass mock — entity lookups return None (warning, not error)."""
    hass = MagicMock()
    hass.states.get.return_value = None
    return hass

_TRIGGER_PKG = (
    Path(__file__).parent.parent
    / "custom_components"
    / "maintenance_supporter"
    / "entity"
    / "triggers"
)


def _trigger_config_keys_used_by_trigger_classes() -> set[str]:
    """Scan the trigger source files for `trigger_config.get("...")` reads."""
    pattern = re.compile(r"trigger_config\.get\(\s*['\"]([a-z_]+)['\"]")
    keys: set[str] = set()
    for src in _TRIGGER_PKG.glob("*.py"):
        text = src.read_text(encoding="utf-8")
        for match in pattern.finditer(text):
            keys.add(match.group(1))
    return keys


# Per-entity runtime state is injected at trigger construction by
# `_inject_per_entity_state` (entity/triggers/__init__.py) — it never travels
# over the WS save path, so it is intentionally NOT in the allowlist.
_RUNTIME_INJECTED_KEYS = frozenset({
    "trigger_change_count",
    "trigger_baseline_value",
    "trigger_accumulated_seconds",
    "trigger_on_since",
    "trigger_threshold_exceeded_since",
    # Compound trigger runtime state (per-condition triggered flags).
    # Written by compound.py at runtime; extracted out of the save path by
    # storage.py before the dict ever reaches the WS save validator.
    "_trigger_state",
})


def test_allowlist_covers_every_trigger_config_key_read_by_trigger_classes() -> None:
    """If a trigger class reads `trigger_config.get("foo")`, "foo" must save."""
    used = _trigger_config_keys_used_by_trigger_classes() - _RUNTIME_INJECTED_KEYS
    missing = used - _TRIGGER_ALLOWED_KEYS
    assert not missing, (
        f"Trigger classes read these trigger_config keys, but the WS save "
        f"path strips them silently: {sorted(missing)}.  Either add them to "
        f"_TRIGGER_ALLOWED_KEYS in websocket/tasks.py, or add them to the "
        f"_RUNTIME_INJECTED_KEYS exclusion in this test if they are runtime-"
        f"only and never round-trip through the save path."
    )


def test_state_change_from_to_lowercased_on_save(mock_hass) -> None:
    """HA states are lowercase; user input "OFF"/"ON" must normalise."""
    config = {
        "type": "state_change",
        "entity_id": "binary_sensor.filter",
        "trigger_from_state": "OFF",
        "trigger_to_state": " ON ",
    }
    errors, _warnings = _validate_trigger_config(mock_hass, config)
    assert not errors
    assert config["trigger_from_state"] == "off"
    assert config["trigger_to_state"] == "on"


def test_state_change_empty_strings_dropped(mock_hass) -> None:
    """Whitespace-only from/to means "no filter" and should not be persisted."""
    config = {
        "type": "state_change",
        "entity_id": "binary_sensor.filter",
        "trigger_from_state": "   ",
        "trigger_to_state": "",
    }
    errors, _warnings = _validate_trigger_config(mock_hass, config)
    assert not errors
    assert "trigger_from_state" not in config
    assert "trigger_to_state" not in config


def test_state_change_round_trip_preserves_allowlisted_keys(mock_hass) -> None:
    """Save the typical state-change config the panel sends; nothing gets stripped."""
    config = {
        "type": "state_change",
        "entity_id": "binary_sensor.filter_change",
        "entity_ids": ["binary_sensor.filter_change"],
        "attribute": "some_attribute",
        "trigger_from_state": "off",
        "trigger_to_state": "on",
        "trigger_target_changes": 5,
    }
    errors, _warnings = _validate_trigger_config(mock_hass, config)
    assert not errors
    for key in ("trigger_from_state", "trigger_to_state", "trigger_target_changes", "attribute"):
        assert key in config, f"{key} got stripped — allowlist regression"


def test_threshold_for_minutes_preserved(mock_hass) -> None:
    """threshold `trigger_for_minutes` used to get stripped — pin it."""
    config = {
        "type": "threshold",
        "entity_id": "sensor.temp",
        "trigger_above": 25.0,
        "trigger_for_minutes": 10,
    }
    errors, _warnings = _validate_trigger_config(mock_hass, config)
    assert not errors
    assert config.get("trigger_for_minutes") == 10


def test_counter_delta_mode_preserved(mock_hass) -> None:
    """counter `trigger_delta_mode` used to get stripped — pin it."""
    config = {
        "type": "counter",
        "entity_id": "sensor.total_runtime",
        "trigger_target_value": 500.0,
        "trigger_delta_mode": True,
    }
    errors, _warnings = _validate_trigger_config(mock_hass, config)
    assert not errors
    assert config.get("trigger_delta_mode") is True


@pytest.mark.parametrize(
    "key",
    [
        "trigger_from_state",
        "trigger_to_state",
        "trigger_for_minutes",
        "trigger_delta_mode",
        "attribute",
    ],
)
def test_critical_keys_in_allowlist(key: str) -> None:
    """Pin the 5 keys that have already been silently stripped once."""
    assert key in _TRIGGER_ALLOWED_KEYS, (
        f"{key} was dropped from _TRIGGER_ALLOWED_KEYS — this caused issue "
        f"#37 (state_change filter) and equivalent silent failures for "
        f"threshold/counter/attribute triggers."
    )
