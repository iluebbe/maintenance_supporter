"""URL-safety, NFC-duplicate, and trigger-config validation helpers.

Shared base layer for the task WS handlers (imported by tasks_crud) and by
several sibling modules (objects, documents, io) + tests.
"""

from __future__ import annotations

import math
from typing import Any

from homeassistant.core import HomeAssistant

from ..const import (
    CONF_OBJECT,
    CONF_OBJECT_NAME,
    CONF_TASKS,
    UNAVAILABLE_STATES,
    TriggerType,
)
from ..helpers.trigger_fallback import threshold_limits_overlap
from . import (
    _get_object_entries,
)

# ---------------------------------------------------------------------------
# Validation helpers
# ---------------------------------------------------------------------------

_SAFE_URL_SCHEMES = {"http", "https"}


def _is_safe_url(url: str | None) -> bool:
    """Reject javascript:, data:, protocol-relative and other dangerous URLs.

    Only http/https and genuine path-relative URLs (no host) pass. ASCII control
    characters and surrounding whitespace are stripped first, since urlparse and
    browsers ignore them and they can otherwise mask a "//host" or scheme-less
    host (e.g. ``"   //evil.com"`` or ``"\t//evil.com"``).
    """
    if not url:
        return True
    from urllib.parse import urlparse

    cleaned = "".join(ch for ch in url if ch.isprintable()).strip()
    if not cleaned:
        return True
    # Block protocol-relative URLs like //evil.com
    if cleaned.startswith("//"):
        return False
    try:
        parsed = urlparse(cleaned)
    except Exception:  # noqa: BLE001 - any malformed URL is rejected as unsafe
        return False
    scheme = parsed.scheme.lower()
    if scheme in _SAFE_URL_SCHEMES:
        return True
    # An empty scheme is only safe for a true path-relative URL with no host.
    return scheme == "" and not parsed.netloc


# ---------------------------------------------------------------------------
# NFC tag uniqueness check
# ---------------------------------------------------------------------------


def _check_nfc_tag_duplicate(hass: HomeAssistant, nfc_tag_id: str, exclude_task_id: str | None = None) -> str | None:
    """Check if an NFC tag ID is already in use by another task.

    Returns a warning message if duplicate, or None.
    """
    for entry in _get_object_entries(hass):
        tasks = entry.data.get(CONF_TASKS, {})
        obj_name = entry.data.get(CONF_OBJECT, {}).get(CONF_OBJECT_NAME, "")
        for tid, tdata in tasks.items():
            if tid == exclude_task_id:
                continue
            if tdata.get("nfc_tag_id") == nfc_tag_id:
                return f"NFC tag '{nfc_tag_id}' is already linked to task '{tdata.get('name', tid)}' on object '{obj_name}'"
    return None


# ---------------------------------------------------------------------------
# Trigger config validation
# ---------------------------------------------------------------------------

# Derived from the enum so the server validator can't drift from the type set.
_VALID_TRIGGER_TYPES = frozenset(t.value for t in TriggerType)

_TRIGGER_REQUIRED_FIELDS: dict[str, list[str]] = {
    "threshold": [],  # at least one of trigger_above/trigger_below checked below
    "counter": ["trigger_target_value"],
    "state_change": [],
    "runtime": ["trigger_runtime_hours"],
    "compound": [],  # conditions validated separately
}

_TRIGGER_ALLOWED_KEYS: set[str] = {
    "type",
    "entity_id",
    "entity_ids",
    "entity_logic",
    "attribute",
    # threshold
    "trigger_above",
    "trigger_below",
    "trigger_equals",
    "trigger_not_equals",
    "trigger_for_minutes",
    # counter
    "trigger_target_value",
    "trigger_delta_mode",
    "trigger_baseline_value",
    # runtime
    "trigger_runtime_hours",
    "trigger_on_states",
    "trigger_runtime_max_session_seconds",
    # state_change
    "trigger_from_state",
    "trigger_to_state",
    "trigger_target_changes",
    # compound
    "compound_logic",
    "conditions",
    # record a completion when the trigger clears itself (#53)
    "auto_complete_on_recovery",
    # trigger ∧/∨ safety interval (any = whichever first, all = both required)
    "trigger_combinator",
}


def _validate_trigger_config(
    hass: HomeAssistant,
    trigger_config: dict[str, Any],
) -> tuple[list[str], list[str]]:
    """Validate trigger_config structure.

    Returns (errors, warnings).
    Accepts both ``entity_id`` (str) and ``entity_ids`` (list[str]).
    """
    from ..entity.triggers import normalize_entity_ids

    errors: list[str] = []
    warnings: list[str] = []

    # Trigger type
    trigger_type = trigger_config.get("type", "threshold")
    if trigger_type not in _VALID_TRIGGER_TYPES:
        errors.append(f"Invalid trigger type '{trigger_type}'. Must be one of: {', '.join(sorted(_VALID_TRIGGER_TYPES))}")
        return errors, warnings

    # --- Compound triggers ---
    if trigger_type == "compound":
        return _validate_compound_trigger(hass, trigger_config)

    # --- Non-compound: entity validation ---
    entity_ids = normalize_entity_ids(trigger_config)
    if not entity_ids:
        errors.append("trigger_config requires entity_id or entity_ids")
    else:
        for eid in entity_ids:
            state = hass.states.get(eid)
            if state is None:
                warnings.append(f"Entity {eid} does not exist (yet)")
            elif state.state in UNAVAILABLE_STATES:
                warnings.append(f"Entity {eid} is currently '{state.state}'")
        # Ensure entity_id is set for backwards compat
        if not trigger_config.get("entity_id"):
            trigger_config["entity_id"] = entity_ids[0]
        # Always store entity_ids list
        trigger_config["entity_ids"] = entity_ids

    # Validate entity_logic
    entity_logic = trigger_config.get("entity_logic")
    if entity_logic is not None and entity_logic not in ("any", "all"):
        errors.append(f"trigger_config.entity_logic must be 'any' or 'all', got '{entity_logic}'")

    # Required fields per type
    for field in _TRIGGER_REQUIRED_FIELDS[trigger_type]:
        if trigger_config.get(field) is None:
            errors.append(f"trigger_config.{field} is required for type '{trigger_type}'")

    # Threshold: at least one limit must be configured
    if trigger_type == "threshold":
        _limit_keys = ("trigger_above", "trigger_below", "trigger_equals", "trigger_not_equals")
        if all(trigger_config.get(k) is None for k in _limit_keys):
            errors.append(
                "trigger_config requires at least one of 'trigger_above', 'trigger_below', "
                "'trigger_equals' or 'trigger_not_equals' for type 'threshold'"
            )

    _validate_combinator(trigger_config, errors)
    _validate_trigger_values(trigger_type, trigger_config, errors)

    # #156: the limits are OR-ed — below > above means every reading trips
    # the trigger, so it can never recover (and never auto-completes).
    if trigger_type == "threshold" and threshold_limits_overlap(
        _coerce_number(trigger_config.get("trigger_above")),
        _coerce_number(trigger_config.get("trigger_below")),
    ):
        errors.append(
            "trigger_config.trigger_below must not be higher than trigger_above: the limits are OR-ed, "
            "so every reading would trigger the task and it could never recover. "
            "Leave one of them empty."
        )

    # Runtime: validate trigger_on_states if provided
    if trigger_type == "runtime":
        on_states = trigger_config.get("trigger_on_states")
        if on_states is not None:
            if not isinstance(on_states, list) or not all(isinstance(s, str) and s.strip() for s in on_states):
                errors.append("trigger_config.trigger_on_states must be a list of non-empty strings")
            elif len(on_states) == 0:
                errors.append("trigger_config.trigger_on_states must not be empty when provided")

    # Strip unknown keys to prevent data pollution
    unknown = set(trigger_config) - _TRIGGER_ALLOWED_KEYS
    for key in unknown:
        del trigger_config[key]

    # Coerce the recovery flag to a real bool (drop it when falsy so stored
    # configs stay minimal — absence means off).
    if "auto_complete_on_recovery" in trigger_config:
        if trigger_config["auto_complete_on_recovery"]:
            trigger_config["auto_complete_on_recovery"] = True
        else:
            del trigger_config["auto_complete_on_recovery"]

    # Normalise state_change from/to: HA's state machine stores values lowercase
    # ("on"/"off"/"home"/...). Users typing "ON"/"OFF" expect a match — same
    # forgiving treatment as the runtime trigger, which lowercases trigger_on_states.
    if trigger_type == "state_change":
        for key in ("trigger_from_state", "trigger_to_state"):
            val = trigger_config.get(key)
            if isinstance(val, str):
                stripped = val.strip().lower()
                if stripped:
                    trigger_config[key] = stripped
                else:
                    trigger_config.pop(key, None)

    return errors, warnings


# ---------------------------------------------------------------------------
# Value-level checks (security review 2026-08-21): the key allowlist and the
# per-type required fields never looked at the VALUES, so a write-tier client
# could store ``trigger_for_minutes: "abc"`` or a negative target. Nothing
# exploitable — the trigger classes fail closed — but the failure surfaced at
# trigger setup, far from its cause. Ranges mirror the options-flow selectors.
# ---------------------------------------------------------------------------

# Numeric fields that may hold any finite number (thresholds, counter targets,
# baselines) — a numeric string is accepted and stored as a float.
_NUMBER_FIELDS: tuple[str, ...] = (
    "trigger_above",
    "trigger_below",
    "trigger_equals",
    "trigger_not_equals",
    "trigger_target_value",
    "trigger_baseline_value",
)
# Whole-number fields with an inclusive range.
_INT_FIELDS: dict[str, tuple[int, int]] = {
    "trigger_for_minutes": (0, 1440),
    "trigger_target_changes": (1, 10_000),
}
TRIGGER_RUNTIME_HOURS_MAX = 100_000
# Optional fields where an explicit null means "unset" — dropped rather than
# refused, so a client clearing a field never trips the validator.
_OPTIONAL_VALUE_FIELDS: tuple[str, ...] = (
    "trigger_for_minutes",
    "trigger_target_changes",
    "trigger_baseline_value",
    "trigger_delta_mode",
    "trigger_runtime_hours",
)


def _coerce_number(value: Any) -> float | None:
    """int/float/numeric-string → float; bools, non-numbers, NaN/inf → None."""
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        num = float(value)
    elif isinstance(value, str):
        try:
            num = float(value.strip())
        except ValueError:
            return None
    else:
        return None
    return num if math.isfinite(num) else None


def _validate_trigger_values(trigger_type: str, trigger_config: dict[str, Any], errors: list[str]) -> None:
    """Type/range-check the numeric trigger fields and normalise their types.

    Numeric strings (an automation template, a YAML import) are accepted and
    stored as numbers; everything else is refused with the field named, so
    the panel and the service caller see the cause instead of a trigger that
    silently never fires.
    """
    for key in _OPTIONAL_VALUE_FIELDS:
        if key in trigger_config and trigger_config[key] is None:
            del trigger_config[key]

    for key in _NUMBER_FIELDS:
        raw = trigger_config.get(key)
        if raw is None:
            continue
        num = _coerce_number(raw)
        if num is None:
            errors.append(f"trigger_config.{key} must be a number, got {raw!r}")
        elif isinstance(raw, str):
            trigger_config[key] = num

    for key, (low, high) in _INT_FIELDS.items():
        raw = trigger_config.get(key)
        if raw is None:
            continue
        num = _coerce_number(raw)
        if num is None or not num.is_integer() or not low <= num <= high:
            errors.append(f"trigger_config.{key} must be a whole number between {low} and {high}, got {raw!r}")
        else:
            trigger_config[key] = int(num)

    raw = trigger_config.get("trigger_runtime_hours")
    if raw is not None:
        num = _coerce_number(raw)
        if num is None or not 0 < num <= TRIGGER_RUNTIME_HOURS_MAX:
            errors.append(
                f"trigger_config.trigger_runtime_hours must be a number greater than 0 "
                f"and at most {TRIGGER_RUNTIME_HOURS_MAX}, got {raw!r}"
            )
        elif isinstance(raw, str):
            trigger_config["trigger_runtime_hours"] = num

    # #149: per-session cap against stuck sensors — whole seconds, 1..86400.
    raw = trigger_config.get("trigger_runtime_max_session_seconds")
    if raw is not None:
        num = _coerce_number(raw)
        if num is None or not num.is_integer() or not 1 <= num <= 86400:
            errors.append(
                f"trigger_config.trigger_runtime_max_session_seconds must be a whole number "
                f"between 1 and 86400 (seconds), got {raw!r}"
            )
        else:
            trigger_config["trigger_runtime_max_session_seconds"] = int(num)

    raw = trigger_config.get("trigger_delta_mode")
    if raw is not None and not isinstance(raw, bool):
        errors.append(f"trigger_config.trigger_delta_mode must be true or false, got {raw!r}")

    # A delta counter fires every N units of accumulated use — N must be
    # positive, or the task would fire on every reading.
    if trigger_type == "counter" and trigger_config.get("trigger_delta_mode") is True:
        target = _coerce_number(trigger_config.get("trigger_target_value"))
        if target is not None and target <= 0:
            errors.append(
                "trigger_config.trigger_target_value must be greater than 0 when trigger_delta_mode is on, "
                f"got {trigger_config.get('trigger_target_value')!r}"
            )


def _validate_combinator(trigger_config: dict[str, Any], errors: list[str]) -> None:
    """Validate the trigger ∧/∨ safety-interval combinator (any | all).

    Shared by the plain and compound paths — the combinator is task-level and
    legal on every trigger type.
    """
    combinator = trigger_config.get("trigger_combinator")
    if combinator is not None and combinator not in ("any", "all"):
        errors.append(f"trigger_config.trigger_combinator must be 'any' or 'all', got '{combinator}'")


def _validate_compound_trigger(
    hass: HomeAssistant,
    trigger_config: dict[str, Any],
) -> tuple[list[str], list[str]]:
    """Validate a compound trigger config."""
    errors: list[str] = []
    warnings: list[str] = []

    _validate_combinator(trigger_config, errors)

    compound_logic = trigger_config.get("compound_logic", "AND").upper()
    if compound_logic not in ("AND", "OR"):
        errors.append(f"compound_logic must be 'AND' or 'OR', got '{compound_logic}'")

    conditions = trigger_config.get("conditions")
    if not isinstance(conditions, list) or len(conditions) < 2:
        errors.append("Compound trigger requires 'conditions' list with at least 2 entries")
        return errors, warnings

    for idx, condition in enumerate(conditions):
        if not isinstance(condition, dict):
            errors.append(f"Condition {idx} must be a dict")
            continue
        cond_type = condition.get("type", "threshold")
        if cond_type == "compound":
            errors.append(f"Condition {idx}: nested compound triggers are not allowed")
            continue
        # Validate each condition as a regular trigger
        cond_errors, cond_warnings = _validate_trigger_config(hass, condition)
        for err in cond_errors:
            errors.append(f"Condition {idx}: {err}")
        for warn in cond_warnings:
            warnings.append(f"Condition {idx}: {warn}")

    return errors, warnings
