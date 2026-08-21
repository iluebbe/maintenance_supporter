"""URL-safety, NFC-duplicate, and trigger-config validation helpers.

Shared base layer for the task WS handlers (imported by tasks_crud) and by
several sibling modules (objects, documents, io) + tests.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant

from ..const import (
    CONF_OBJECT,
    CONF_OBJECT_NAME,
    CONF_TASKS,
    UNAVAILABLE_STATES,
    TriggerType,
)
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
